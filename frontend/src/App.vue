<script setup lang="ts">
import HeaderBI from './components/HeaderBI.vue';
import MapItem from './components/MapItem.vue';
import { loadFonts } from 'bootstrap-italia'
import 'mapbox-gl/dist/mapbox-gl.css';
import ReportFormItem from './components/ReportFormItem.vue';
import ReportsList from './components/ReportsList.vue';

loadFonts('./fonts');

</script>

<template>
  <HeaderBI/>

  <div class="container-fluid full-height">
    <div class="row h-100">
      
      <!-- COLONNA SINISTRA -->
      <div class="col-4 d-flex">
        <MapItem/>
      </div>

      <!-- COLONNA DESTRA -->
     <div class="col-md-6 d-flex flex-column">
      <!-- Riga superiore (2/3 dell'altezza) -->
      <ReportsList/>
      <!-- <ReportFormItem/> -->
      <div class="flex-grow-2 ">
        
      </div>

      <!-- Riga inferiore (1/3 dell'altezza) -->
      <!-- <div class="flex-grow-1 bg-success"> -->
        <!-- Riga inferiore (1/3) -->
      <!-- </div> -->
    </div>

    </div>
  </div>
</template>

<style scoped>

 html, body {
      height: 100%;
      margin: 0;
    }
    .full-height {
      height: 100vh;
    }
    .half-height {
      height: 50%;
    }

</style>
