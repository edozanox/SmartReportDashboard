<script setup lang="ts">
import { useMapStore } from '@/stores/store';
import mapboxgl, { LngLat } from 'mapbox-gl';
import type { FeatureCollection, Feature, Point, GeoJsonProperties } from 'geojson';
import { onMounted, ref, watch } from 'vue';

const mapStore = useMapStore();
const geoJsonSemafori = ref<FeatureCollection<Point, GeoJsonProperties>>({
    type: 'FeatureCollection',
    features: [] as any[],
});
const geoJsonZtl = ref<FeatureCollection<Point, GeoJsonProperties>>({
    type: 'FeatureCollection',
    features: [] as any[],
});
var marker: mapboxgl.Marker | null = null;
let addedMarkersCount = 0; // Traccia quanti marker sono stati aggiunti

onMounted(() => {

const mapbox_token = 'pk.eyJ1IjoiZWRvYXJkb3phbm90dGkiLCJhIjoiY2ttNHBxM2F1MDZ2MjJ2bXRqbGVreGUwNyJ9._YdTxeWs2w0KNlNF3QkLxw';
const urlSemafori ='https://opendata.comune.bologna.it/api/explore/v2.1/catalog/datasets/stars-controllo-rosso-semaforico/records'
const urlVarchiZtl = 'https://opendata.comune.bologna.it/api/explore/v2.1/catalog/datasets/varchi-bologna/records'

const popupReportHTML = `
`

mapboxgl.accessToken = mapbox_token;
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/streets-v12', // style URL
        center: [11.2718593191134, 44.5525618278896], // starting position [lng, lat]
        zoom: 12, // starting zoom
    });

    //GET semafori
    fetch(urlSemafori)
        .then((response) => response.json())
        .then((data) => {  
        geoJsonSemafori.value = {  
            type: 'FeatureCollection',
            features: data.results.map((item: any) => ({
                type: 'Feature',
                properties: {
                    Nome: item.semaforo_stars_bologna
                },
                geometry: {
                type: 'Point',
                coordinates: [ item.coordinate.lon, item.coordinate.lat ]
                }
            }))
        }})
        .catch((error) => {
        console.error('Error fetching STARS data:', error);
        });

    //GET varchi ZTL
    fetch(urlVarchiZtl)
        .then((response) => response.json())
        .then((data) => {
       geoJsonZtl.value = {  
            type: 'FeatureCollection',
            features: data.results.map((item: any): Feature<Point, GeoJsonProperties> => ({
                type: 'Feature',
                properties: {
                    id: item.id,
                    nome: item.nome_varco,
                },
                geometry: {
                type: 'Point',
                coordinates: [ item.coordinate.lon, item.coordinate.lat ]
                }
            }))
        }})
        .catch((error) => {
        console.error('Error fetching ZTL gates date:', error);
        });

  //Aggiorna i marker sulla mappa quando cambia il reactive markers
  watch(() => mapStore.markers, (newMarkers: LngLat[]) => {
    // Aggiungi solo i nuovi marker che non sono stati ancora aggiunti
    for(let i = addedMarkersCount; i < newMarkers.length; i++) {
      const item = newMarkers[i];
      marker = new mapboxgl.Marker()
        .setLngLat(item)
        .addTo(map);
      mapStore.markerObjects[i] = marker; // Assegna il marker all'array nello store
    }
    addedMarkersCount = newMarkers.length; // Aggiorna il conteggio
  }, { deep: true, immediate: true });

  map.on('click', function (e) {

  const lng = e.lngLat.lng;
  const lat = e.lngLat.lat;
  const lngLat = new LngLat(lng, lat);
  
  map.on('click', function(e) {
    // Rimuovi il marker precedente se esiste
    if (marker) {
      marker.remove();
      marker = null;
    }
    
    // Aggiungi marker sulla mappa
    marker = new mapboxgl.Marker()
      .setLngLat([lng, lat])
      .addTo(map);
    mapStore.addMarker(lngLat); // Aggiungi il marker allo store
    });
  
  
  //Ricava indirizzo e aggiorno reactive utilizzato da componente form
  fetch(
    `https://api.mapbox.com/search/geocode/v6/reverse?longitude=${lng}&latitude=${lat}&access_token=${mapbox_token}`
  )
  .then((response) => response.json())
  .then((data) => { 
    mapStore.setMapData(data.features[0].properties?.full_address, lngLat);
  })
  return {};
  });

   // Wait until the map has finished loading.
    map.on('load', () => {        
        map.addSource('semafori-stars', {
            type: 'geojson',
            data: geoJsonSemafori.value,            
        });
        map.addLayer({
            'id': 'semafori-stars',
            'type': 'circle',
            'source': 'semafori-stars',
            'paint': {
                'circle-radius': 10,
                'circle-color': '#B42222'
            }
        });

        map.addSource('varchi-ztl', {
            type: 'geojson',
            data: geoJsonZtl.value,
        });

        map.addLayer({
            'id': 'varchi-ztl',
            'type': 'circle',
            'source': 'varchi-ztl',
            'paint': {
                'circle-radius': 10,
                'circle-color': 'blue'
            }
        });
    });

    // After the last frame rendered before the map enters an "idle" state.
    map.on('idle', () => {
        // If these two layers were not added to the map, abort
        if (!map.getLayer('semafori-stars')) {
            return;
        }

        // Skip if buttons already exist
        if (document.getElementById('btn-stars') || document.getElementById('btn-ztl')) {
            return;
        }

        // STARS button
        const btnStars = document.createElement('button');
        btnStars.id = 'btn-stars';
        btnStars.className = 'map-icon-button active';
        btnStars.textContent = 'Semafori STARS';
        btnStars.title = 'Semafori STARS';   
        
        btnStars.onclick = function (e) {
            e.preventDefault();
            e.stopPropagation();

            const visibility = map.getLayoutProperty('semafori-stars', 'visibility');
            if (visibility === 'visible') {
                map.setLayoutProperty('semafori-stars', 'visibility', 'none');
                btnStars.classList.remove('active');
                const checkIcon = btnStars.querySelector('.check-icon');
                if (checkIcon) checkIcon.remove();
            } else {
                map.setLayoutProperty('semafori-stars', 'visibility', 'visible');
                btnStars.classList.add('active');
                const checkIcon = document.createElement('span');
                checkIcon.className = 'check-icon';
                checkIcon.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4caf50" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
                btnStars.prepend(checkIcon);
            }
        };

        // ZTL button
        const btnZtl = document.createElement('button');
        btnZtl.id = 'btn-ztl';
        btnZtl.className = 'map-icon-button active';
        btnZtl.title = 'Varchi ZTL';
        btnZtl.textContent = 'Varchi ZTL';
        
        btnZtl.onclick = function (e) {
            e.preventDefault();
            e.stopPropagation();

            const visibility = map.getLayoutProperty('varchi-ztl', 'visibility');
            if (visibility === 'visible') {
                map.setLayoutProperty('varchi-ztl', 'visibility', 'none');
                btnZtl.classList.remove('active');
                const checkIcon = btnZtl.querySelector('.check-icon');
                if (checkIcon) checkIcon.remove();
            } else {
                map.setLayoutProperty('varchi-ztl', 'visibility', 'visible');
                btnZtl.classList.add('active');
                const checkIcon = document.createElement('span');
                checkIcon.className = 'check-icon';
                checkIcon.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4caf50" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
                btnZtl.prepend(checkIcon);
            }
        };
        const filterGroup = document.getElementById('filter-group');
        filterGroup?.appendChild(btnStars);
        filterGroup?.appendChild(btnZtl);
    });

});

</script>
<template>
    <div style="position: relative; width: 100%; height: 100%;">
        <div id='map' style="width: 100%; height: 100%;"></div>  
        <nav id="filter-group" class="filter-group"></nav>
    </div>
</template>
<style scoped>
   .filter-group {
        position: absolute;
        top: 10px;
        right: 10px;
        z-index: 1;
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .map-icon-button {
        width: 40px;
        height: 40px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(255, 255, 255, 0.9);
        transition: all 0.3s ease;
        box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
        padding: 0;
    }

    .map-icon-button img {
        width: 24px;
        height: 24px;
        object-fit: contain;
        pointer-events: none;
    }

    .map-icon-button:hover {
        background-color: #fff;
        box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.2);
    }

    .map-icon-button:not(.active) {
        opacity: 0.5;
    }

    .map-icon-button.active {
        opacity: 1;
    }

    .check-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 6px;
    }

    .check-icon svg {
        flex-shrink: 0;
    }
</style>
