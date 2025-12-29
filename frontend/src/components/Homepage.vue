<script setup lang="ts">
import SignIn from './auth/sign-in.vue';

</script>
<template>
  <div class="container mb-5 mt-2 pt-2">
    <div class="row">
      <div class="col-12">
        <h1>Ti diamo il benvenuto su SmartCityDashboard</h1>
        <hr>
        <p>SmartCityDashboard è la piattaforma dedicata alla gestione delle segnalazioni dei cittadini per migliorare i servizi urbani e la qualità della vita nella tua città.</p>
        <p>Attraverso questa dashboard, puoi facilmente inviare segnalazioni riguardanti problemi come buche stradali, illuminazione pubblica, manutenzione del verde e molto altro. Il nostro obiettivo è garantire una comunicazione efficace tra i cittadini e le autorità locali, facilitando la risoluzione rapida delle problematiche segnalate.</p>
        <p>Inizia subito a utilizzare SmartCityDashboard per contribuire attivamente al miglioramento della tua comunità!</p>
      </div>
      <!-- <button class="btn btn-primary mt-3" @click="$router.push('/reports/nuova')">Invia una segnalazione</button> -->
       <SignIn/>
    </div>
  </div>
</template>
