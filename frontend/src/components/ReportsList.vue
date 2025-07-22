<script setup lang="ts">
import axios from 'axios';
import { Report } from '../models/report.model';
import { onMounted, ref } from 'vue';

const reports = ref([] as Report[]);
// const api = axios.create({
//   baseURL: 'http://localhost:3000'
// })

onMounted(async () =>{
try {
  const response = await fetch('http://localhost:3000/api/reports/getAll');
  reports.value = (await response.json()).data;
} catch (error) {
    console.error('Error fetching reports:', error);
  }
});

const formatDate = (iso_date: any) => {
  const date = new Date(iso_date)
  return date.toLocaleDateString('it-IT')
}

</script>

<template>
<h3>Elenco segnalazioni</h3>
  <table class="table">
    <thead>
      <tr>
        <th scope="col">ID</th>
        <th scope="col">Categoria</th>
        <th scope="col">Descrizione</th>
        <th scope="col">Indirizzo</th>
        <th scope="col">Data inserimento</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="x in reports" :key="x.id">
        <td>{{ x.id }}</td>
        <td>{{ x.categoria }}</td>
        <td>{{ x.descrizione }}</td>
        <td>{{ x.indirizzo }}</td>        
        <td>{{ formatDate(x.data_inserimento)}}</td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>


</style>
