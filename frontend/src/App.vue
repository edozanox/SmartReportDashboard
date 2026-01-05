<script setup lang="ts">
import HeaderBI from './components/HeaderBI.vue';
import MapItem from './components/MapItem.vue';
import 'mapbox-gl/dist/mapbox-gl.css';
import { authClient } from './lib/auth-client';
import FeedRssItem from './components/FeedRssItem.vue';

authClient.useSession()

</script>

<template>

  <HeaderBI/>

  <div class="container-fluid full-height app-container">
    <div class="row h-100">

      <!-- COLONNA SINISTRA -->
      <div class="col-4 d-flex">
        <MapItem/>
      </div>

      <!-- COLONNA DESTRA -->
     <div class="col-md-8 d-flex flex-column">
      <!-- Riga superiore (2/3 dell'altezza) -->
       <RouterView></RouterView>
      <!-- <ReportFormItem/> -->
      <div class="flex-grow-2 ">

      </div>

      <!-- Riga inferiore (1/3 dell'altezza) -->
      <div class="col-md-12 d-flex bg-light" >
        <FeedRssItem></FeedRssItem>
        <!-- Riga inferiore (1/3) -->
      </div>
     </div>
    </div>
  </div>
</template>

<style scoped>
  @font-face {
    font-family: 'Titillium Web';
    font-style: normal;
    font-weight: 700;
    src: url('@/assets/fonts/Titillium_Web/titillium-web-v10-latin-ext_latin-700.woff2') format('woff2');
  }

  html, body {
      height: 100vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    /* .full-height {
      height: 100vh;
    }
    .half-height {
      height: 50%;
    } */

</style>
