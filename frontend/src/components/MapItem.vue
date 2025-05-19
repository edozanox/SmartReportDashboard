<script setup lang="ts">
import mapboxgl, { LngLat } from 'mapbox-gl';
import { onMounted } from 'vue';
import { provide, ref } from 'vue';

onMounted(() => {
const mapbox_token = 'pk.eyJ1IjoiZWRvYXJkb3phbm90dGkiLCJhIjoiY2ttNHBxM2F1MDZ2MjJ2bXRqbGVreGUwNyJ9._YdTxeWs2w0KNlNF3QkLxw';

mapboxgl.accessToken = mapbox_token;
  const map = new mapboxgl.Map({
      container: 'map', // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [44.49224, 11.34379], // starting position [lng, lat]
      zoom: 9, // starting zoom
  });

  map.on('click', function (e) {

  const lng = e.lngLat.lng;
  const lat = e.lngLat.lat;
  const lngLat = new LngLat(lng, lat);
    fetch(
    `https://api.mapbox.com/search/geocode/v6/reverse?longitude=${lng}&latitude=${lat}&access_token=${mapbox_token}`
  )
    .then((response) => response.json())
    .then((data) => {      
      // L'indirizzo si trova tipicamente in data.features[0].properties
      new mapboxgl.Popup()
      .setLngLat(lngLat)
      .setHTML(`<p>${data.features[0].properties?.full_address}</p>`)
    });
  })
});
</script>
<template>
  <div id='map' style="width: 100%; height: 100%;"></div>
</template>
