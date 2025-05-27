<script setup lang="ts">
import { useMapStore } from '@/stores/map';
import mapboxgl, { LngLat, Marker } from 'mapbox-gl';
import { onMounted, provide, ref } from 'vue';

const mapStore = useMapStore();
var marker: mapboxgl.Marker | null = null;

onMounted(() => {

const mapbox_token = 'pk.eyJ1IjoiZWRvYXJkb3phbm90dGkiLCJhIjoiY2ttNHBxM2F1MDZ2MjJ2bXRqbGVreGUwNyJ9._YdTxeWs2w0KNlNF3QkLxw';

mapboxgl.accessToken = mapbox_token;
  const map = new mapboxgl.Map({
      container: 'map', // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [11.2718593191134, 44.5525618278896], // starting position [lng, lat]
      zoom: 12, // starting zoom
  });

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
})
});
</script>
<template>
  <div id='map' style="width: 100%; height: 100%;"></div>
</template>
