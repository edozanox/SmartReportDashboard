// stores/map.js
import { defineStore } from 'pinia'
import { LngLat } from 'mapbox-gl';
import { ref } from 'vue';
import { Report } from '@/models/report.model';
import { RuoliEnum } from '@/models/ruoli.enum';

export const useMapStore = defineStore('map', () => {
 const indirizzo = ref('');
 const coordinate = ref (new LngLat(0,0));
 const markers = ref([] as LngLat[]);
 const markerObjects = ref([] as mapboxgl.Marker[]);
 const setMapData = (addr: string, coords: LngLat) => {
    indirizzo.value = addr;
    coordinate.value = coords;
 }

 const addMarker = (marker: LngLat) => {
    markers.value.push(marker);
  };

  const clearMarkers = () => {
    markerObjects.value.forEach(marker => marker.remove());
    markerObjects.value = [];
    markers.value = [];
  };

 return { indirizzo, coordinate, setMapData, markers, addMarker, clearMarkers };
});

export const useReportStore = defineStore('report', () => {
  const segnalazione = ref({} as Report);
  const setReport = (report: Report) => {
    segnalazione.value = report
  }
  return { segnalazione, setReport };
});

export const useCurrentUserStore = defineStore('currentUser', () => {
  const id = ref('');
  const name = ref('');
  const role = ref();
  const setUserInfo = (userId: string, userName: string, userRole: RuoliEnum) => {
    id.value = userId;
    name.value = userName;
    role.value = userRole;
  }
  return { id, name, role, setUserInfo };  
});