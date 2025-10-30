<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useMapStore, useReportStore } from '@/stores/map';
import type { Group } from '@/models/group.model';

var groups = ref([] as Group[]);

onMounted(async () =>{
try {
  const response = await fetch('http://localhost:3000/api/gruppi/getAll');
  groups.value = (await response.json()).data;  

} catch (error) {
    console.error('Errore nel recupero della lista gruppi:', error);
}
});

</script>

<template>
<!-- <h3>Segnalazioni</h3> -->
  <table class="table">
    <thead>
      <tr>
        <th scope="col">Codice</th>
        <th scope="col">Descrizione</th>
        <th scope="col">Segnalazioni attive</th> 
      </tr>
    </thead>
    <tbody>
      <tr v-for="x in groups" :key="x.id">        
        <td>{{ x.codice }}</td>
        <td>{{ x.nome }}</td>
        <td>{{ x.segnalazioniAssociate }}</td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>


</style>
