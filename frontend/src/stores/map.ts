// stores/map.js
import { defineStore } from 'pinia'
import { LngLat } from 'mapbox-gl';
import { ref } from 'vue';

export const useMapStore = defineStore('map', () => {
 const indirizzo = ref('');
 const coordinate = ref (new LngLat(0,0));
 const markers = ref([] as LngLat[]);
 const setMapData = (addr: string, coords: LngLat) => {
    indirizzo.value = addr;
    coordinate.value = coords;
 }

 const addMarker = (marker: LngLat) => {
    markers.value.push(marker);
  };

  const clearMarkers = () => {
    markers.value = [];
  };

 return { indirizzo, coordinate, setMapData, markers, addMarker, clearMarkers };
});
