<script setup lang="ts">
import { Report } from '../models/report.model';
import { onMounted, ref } from 'vue';
import { useCurrentUserStore, useMapStore, useReportStore } from '@/stores/store';
import { ReportStatus } from '@/models/report-status.enum';
import router from '@/router';
import { RuoliEnum } from '@/models/ruoli.enum';
import type { Gruppo } from '@/models/gruppo.model';
import { CategoriaEnum } from '@/models/categoria.enum';

const mapActions = useMapStore();
const reportStore = useReportStore();
const currentUserStore = useCurrentUserStore();
const reports = ref([] as Report[]);
const gruppi = ref([] as Gruppo[]);

const filters = ref({
  stato: null,
  categoria: null,
  gruppoId: null,
});

const baseUrlApiReports = 'http://localhost:3000/api/reports';
const baseUrlApiGruppi = 'http://localhost:3000/api/gruppi';

onMounted(async () =>{
  await initializeComponent();
});

async function initializeComponent(){
  try {

  if(currentUserStore.role === RuoliEnum.CITTADINO){
    const response = await fetch(`${baseUrlApiReports}/getByUser/${currentUserStore.id}`);
    reports.value = (await response.json()).data;  
    for (const report of reports.value) {
      mapActions.addMarker(report.coordinate);
    }
    return;
  }

  if(currentUserStore.role === RuoliEnum.AMMINISTRATORE) {

    //Recupero tutte le segnalazioni
    const response = await fetch(`${baseUrlApiReports}/getAll`);
    reports.value = (await response.json()).data;  
    for (const report of reports.value) {
      mapActions.addMarker(report.coordinate);
    }

    //Recupero gruppi per filtri
    const responseGruppi = await fetch(`${baseUrlApiGruppi}/getAll`);
    gruppi.value = (await responseGruppi.json()).data;  
    return;
  }
  } catch (error) {
      console.error('Error fetching reports:', error);
  }
}

const formatDate = (iso_date: any) => {
  const date = new Date(iso_date)
  return date.toLocaleDateString('it-IT')
  }

  function apriDettaglioSegnalazione(report: Report) {
    reportStore.setReport(report);
    router.push({name: 'dettagli-segnalazione' });
  }

  async function applicaFiltri() {
    const filterdReports = await fetch(`${baseUrlApiReports}/getByFilters`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(filters.value)
    });
    const responseData = await filterdReports.json();
    reports.value = responseData.data.data;
    mapActions.clearMarkers();
    for (const report of reports.value) {    
      setTimeout(() => mapActions.addMarker(report.coordinate), 500);
    }
  }

defineExpose({
  initializeComponent
});
</script>

<template>

<br/>

<div class="d-flex justify-content-between mb-3">

  <!-- Filtro per status -->
  <div class="select-wrapper">
    <label for="selettoreStatus">Status</label>
    <select id="selettoreStatus" class="form-control" v-model="filters.stato">
      <option value="">--</option>
      <option value="0">Aperte</option>
      <option value="1">In lavorazione</option>
      <option value="2">Risolte</option>
      <option value="3">Rifiutate</option>
    </select>
  </div>

  <!-- Filtro per categoria -->
  <div class="select-wrapper">
    <label for="selettoreCategoria">Categoria</label>
    <select id="selettoreCategoria" class="form-control" v-model="filters.categoria">
      <option value="" default>--</option>    
      <option v-for="(value, key) in Object.entries(CategoriaEnum)" :key="key" :value="value[0]">{{ value[0] }} - {{ value[1] }}</option>
    </select>
  </div>

  <!-- Filtro per gruppo -->
  <div class="select-wrapper">
    <label for="selettoreGruppo">Gruppo</label>
    <select id="selettoreGruppo" class="form-control" v-model="filters.gruppoId">
      <option value="" default>--</option>   
      <option v-for="value in gruppi" :key="value.id">{{ value.nome }}</option>
    </select>
  </div>

  <!-- Applicazione filtro -->
  <button class="btn btn-dropdown dropdown-toggle" type="button" id="applyFilterBtn"
          data-bs-toggle="tooltip" title="Applica filtri" aria-haspopup="true" aria-expanded="false"
          v-on:click="applicaFiltri()">
    <a>
      <svg class="icon icon-primary">
        <use href="/bi-icons.svg#it-funnel"></use>
      </svg>
    </a>
  </button>
  
</div>

<!-- <h3>Segnalazioni</h3> -->
  <table class="table">
    <thead>
      <tr>        
        <th scope="col">Categoria</th>
        <th scope="col">Descrizione</th>
        <th scope="col">Indirizzo</th>
        <th scope="col">Data inserimento</th>
        <th scope="col">Status</th>
        <th scope="col">Operazioni</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="x in reports" :key="x.id">        
        <td>{{ x.categoria }}</td>
        <td>{{ x.descrizione }}</td>
        <td>{{ x.indirizzo }}</td>        
        <td>{{ formatDate(x.data_inserimento)}}</td>
        <td>
          <span v-if="x.stato === ReportStatus.OPEN">
          <svg class="icon icon-secondary"><use href="/bi-icons.svg#it-plus-circle"></use></svg>
          Aperta
          </span>

          <span v-if="x.stato === ReportStatus.IN_PROGRESS">
          <svg class="icon icon-primary"><use href="/bi-icons.svg#it-clock"></use></svg>
          In lavorazione
          </span>

          <span v-if="x.stato === ReportStatus.RESOLVED">
          <svg class="icon icon-success"><use href="/bi-icons.svg#it-check-circle"></use></svg>
          Risolta
          </span>            
          
          <span v-if="x.stato === ReportStatus.REFUSED">
          <svg class="icon icon-danger"><use href="/bi-icons.svg#it-close-circle"></use></svg>
          Chiusa
          </span>
          
        </td>
        <td>
          <button class="btn btn btn-primary" 
          data-bs-toggle="tooltip" data-bs-placement="top" title="Apri segnalazione" 
          @click="apriDettaglioSegnalazione(x)">
          <svg class="icon icon-white">
            <use href="/bi-icons.svg#it-arrow-right-circle"></use>
          </svg>
        </button>
          
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>


</style>
