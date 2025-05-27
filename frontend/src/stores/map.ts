// stores/map.js
import { defineStore } from 'pinia'
import { LngLat } from 'mapbox-gl';
import { ref } from 'vue';

export const useMapStore = defineStore('map', () => {
 const indirizzo = ref('');
 const coordinate = ref (new LngLat(0,0));
 const setMapData = (addr: string, coords: LngLat) => {
    indirizzo.value = addr;
    coordinate.value = coords;
 }
 return { indirizzo, setMapData }
});