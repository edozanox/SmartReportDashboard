<script setup lang="ts">
import { Report } from '../models/report.model';
import { onMounted, ref } from 'vue';
import { useCurrentUserStore, useMapStore, useReportStore } from '@/stores/map';
import { ReportStatus } from '@/models/report-status.enum';
import router from '@/router';
import { RuoliEnum } from '@/models/ruoli.enum';
import axios from 'axios';

const mapActions = useMapStore();
const reportStore = useReportStore();
const currentUserStore = useCurrentUserStore();
const reports = ref([] as Report[]);
const baseUrlApi = 'http://localhost:3000/api/reports';

onMounted(async () =>{
try {

  if(currentUserStore.role === RuoliEnum.CITTADINO){
    const response = await fetch(`${baseUrlApi}/getByUser/${currentUserStore.$id}`);
    reports.value = (await response.json()).data;  
    for (const report of reports.value) {
      mapActions.addMarker(report.coordinate);
    }
    return;
  }

  if(currentUserStore.role === RuoliEnum.AMMINISTRATORE) {
    const response = await fetch(`${baseUrlApi}/getAll`);
    reports.value = (await response.json()).data;  
    for (const report of reports.value) {
      mapActions.addMarker(report.coordinate);
    }
  }
} catch (error) {
    console.error('Error fetching reports:', error);
}

});

const formatDate = (iso_date: any) => {
  const date = new Date(iso_date)
  return date.toLocaleDateString('it-IT')
}

function apriDettaglioSegnalazione(report: Report) {
  reportStore.setReport(report);
  router.push({name: 'dettagli-segnalazione' });
}

</script>

<template>
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
          <span v-if="x.status === ReportStatus.OPEN">
          <svg class="icon icon-secondary"><use href="/bi-icons.svg#it-plus-circle"></use></svg>
          Aperta
          </span>

          <span v-if="x.status === ReportStatus.IN_PROGRESS">
          <svg class="icon icon-primary"><use href="/bi-icons.svg#it-clock"></use></svg>
          In lavorazione
          </span>

          <span v-if="x.status === ReportStatus.RESOLVED">
          <svg class="icon icon-success"><use href="/bi-icons.svg#it-check-circle"></use></svg>
          Risolta
          </span>            
          
          <span v-if="x.status === ReportStatus.REFUSED">
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
