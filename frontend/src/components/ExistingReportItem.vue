<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useMapStore, useReportStore } from '@/stores/store';
import { ReportStatus } from '@/models/report-status.enum';
import { CategoriaEnum } from '@/models/categoria.enum';
import { Notification } from 'bootstrap-italia';
import type { Gruppo } from '@/models/gruppo.model';
import type { Report } from '@/models/report.model';
import axios from 'axios';
import router from '@/router';

const reportStore = useReportStore();
const mapActions = useMapStore();
const route = useRoute();
const report = ref<Report>(reportStore.segnalazione);
const gruppi = ref([] as Gruppo[]);
const apiReports = axios.create({
  baseURL: 'http://localhost:3000/api/reports',
  withCredentials: true,
});
const apiGruppi = axios.create({
  baseURL: 'http://localhost:3000/api/gruppi',
  withCredentials: true,
});

onMounted(async () =>{
  
  await initializeComponent();
  
  try {
    const response = (await apiGruppi.get('/getAll'));
    gruppi.value = response.data.data;
  } catch (error) {
      console.error('Errore nel recupero della lista gruppi:', error);
  }
});

// Osserva i cambiamenti dell'ID della rotta per aggiornare il componente
watch(() => route.params.id, async () => {
  await initializeComponent();
});

async function initializeComponent(){
  // Se il report non è nello store, recuperalo dal server tramite l'ID della rotta
  if (!report.value || !report.value.id) {
    const reportId = route.params.id as string;
    try {
      const response = await apiReports.get(`/${reportId}`);
      report.value = response.data;
      reportStore.setReport(report.value as Report);
    } catch (error) {
      console.error('Errore nel recupero del report:', error);
      //router.push({ name: 'dashboard-amministrazione' });
      return;
    }
  }
  
  mapActions.clearMarkers();
  if (report.value?.coordinate) {
    setTimeout(() => mapActions.addMarker(report.value!.coordinate));
  }
}

async function salvaModifiche(){
  try {

    (report.value?.id_gruppo != null || report.value?.id_gruppo != 0) ? report.value.stato = ReportStatus.IN_PROGRESS : report.value.stato = ReportStatus.OPEN;
    
    const response = await apiReports.put('/change', report.value);
    
    if(response.status == 200){
      let element = document.getElementById('report-ok');
      
      if(element) {
        element.style.display = 'block'
        new Notification(element);
        setTimeout(() => {
          element.style.display = 'none';
        }, 5000);
      }
    }     
  } catch {    
    let element = document.getElementById('report-ko');

    if(element) {
      element.style.display = 'block';
      new Notification(element);
      setTimeout(() => {
        element.style.display = 'none';
      }, 5000);
    }    
  }
}

async function risolviSegnalazione(id: string) {
  const response = await apiReports.patch(`/resolve/${id}`);
  if(response.status == 200){
    let element = document.getElementById('report-risolto');    
    if(element) {
      element.style.display = 'block'
      new Notification(element);
      setTimeout(() => { 
         router.push({ name: 'dashboard-amministrazione' })
      }, 3000);
    }
  } else {
    let element = document.getElementById('report-ko');    
    if(element) {
      element.style.display = 'block'
      new Notification(element);
      setTimeout(() => {
        element.style.display = 'none';
      }, 3000);
    }
  }
}

async function eliminaReport(id: string) {
  const response = await apiReports.delete(`/${id}`);
 if(response.status == 200){
    let element = document.getElementById('report-eliminato');    
    if(element) {
      element.style.display = 'block'
      new Notification(element);
      setTimeout(() => {
        router.push({ name: 'dashboard-amministrazione' });
      }, 3000);
    }
  } else {
    let element = document.getElementById('report-ko');    
    if(element) {
      element.style.display = 'block'
      new Notification(element);
      setTimeout(() => {
        element.style.display = 'none';
      }, 3000);
    }
  }

}

function goToElencoReport() {
  router.push({ name: 'dashboard-amministrazione' });
}
</script>

<template>
  <div class="notification top-fix with-icon success" role="alert" id="report-ok" style="display: none;">
    <h2 class="h5"><svg class="icon"><use href="/bi-icons.svg#it-check-circle"></use></svg>Report modificato con successo</h2>
  </div>
  <div class="notification top-fix with-icon error" role="alert" id="report-ko" style="display: none;">
    <h2 class="h5"><svg class="icon"><use href="/bi-icons.svg#it-close-circle"></use></svg>Errore nella modifica del report</h2>
  </div>
  <div class="notification top-fix with-icon success" role="alert" id="report-risolto" style="display: none;">
    <h2 class="h5"><svg class="icon"><use href="/bi-icons.svg#it-check-circle"></use></svg>Report contrassegnato come risolto</h2>
  </div>
  <div class="notification top-fix with-icon error" role="alert" id="report-eliminato" style="display: none;">
    <h2 class="h5"><svg class="icon"><use href="/bi-icons.svg#it-check-circle"></use></svg>Report eliminato con successo</h2>
  </div>

  <div class="container mb-5 mt-2 pt-2">
    <div class="row">      
      <div class="col-12" style="display: flex; justify-content: space-between; align-items: center;">
        <h3>Dettaglio segnalazione</h3>
        <span v-if="report.stato === ReportStatus.OPEN">
          <svg class="icon icon-secondary"><use href="/bi-icons.svg#it-plus-circle"></use></svg>
          <strong>Aperta</strong>
          </span>

          <span v-if="report.stato === ReportStatus.IN_PROGRESS">
          <svg class="icon icon-primary"><use href="/bi-icons.svg#it-clock"></use></svg>
          <strong>In lavorazione</strong> 
          </span>

          <span v-if="report.stato === ReportStatus.RESOLVED">
          <svg class="icon icon-success"><use href="/bi-icons.svg#it-check-circle"></use></svg>
          <strong>Risolta</strong>
          </span>            
          
          <span v-if="report.stato === ReportStatus.REFUSED">
          <svg class="icon icon-danger"><use href="/bi-icons.svg#it-close-circle"></use></svg>
          <strong>Chiusa</strong>
          </span>        
      </div>      
    </div>
    <p style="color:gray">Report {{ route.params.id.slice(0, 8) }} creato il {{ new Date(report.data_inserimento).toLocaleDateString('it-IT') }}</p>
    <hr>     
    <div class="spacer"></div>
    <div class="row">
    <div class="col-12 col-md-4">
        <div class="select-wrapper">
          <label for="tipoSelector">Categoria</label>
          <select id="tipoSelector" class="form-control" v-model="report.categoria">
            <option v-for="(value, key) in Object.entries(CategoriaEnum)" :key="key" :value="value">{{ value[0] }} - {{ value[1] }}</option>
          </select>
        </div>
      </div>
      <div class="col-12 col-md-8">        
        <label for="nome" class="">Indirizzo</label>
        <input type="text" class="form-control" id="indirizzo" v-model="report.indirizzo" disabled>      
      </div>
      <div class="col-12 col-md-12">
        <label for="nome" class="">Descrizione</label>
        <textarea class="form-control" id="descrizione" rows="4" maxlength="5000" v-model="report.descrizione" disabled></textarea>
      </div>
      <div class="spacer"></div>
      <div class="col-12 col-md-6">
        <label for="email" class="">Email</label>
        <input type="email" class="form-control" v-model="report.email" disabled>  
      </div>    
      <div class="col-12 col-md-6">
        <label for="telefono" class="">Telefono</label>
        <input type="tel" class="form-control" v-model="report.telefono" disabled>
      </div>
      <div class="spacer"></div>
      <div class="col-12 col-md-6">
        <div class="select-wrapper">
          <label for="gruppoSelector">Gruppo incaricato</label>
          <select id="gruppoSelector" class="form-control" v-model="report.id_gruppo">              
            <option v-for="group in gruppi" :value="group.id">{{ group.codice }} - {{ group.nome }}</option>     
          </select>
        </div>
      </div>
      <div class="col-12 col-md-6">        
        <label for="nome" class="">Note</label>
        <input type="text" class="form-control" id="indirizzo" v-model="report.annotazioni">        
      </div>
      <!-- <div class="col-12 col-md-6">
        <label for="annotazioni" class="">Note</label>
        <input type="text" class="form-control" v-model="report.annotazioni">
      </div>
      <div class="col-12 col-md-8">
        <div class="form-group">
          <div class="select-wrapper">
            <label for="defaultSelect">Gruppo incaricato</label>
            <select id="defaultSelect" class="form-control" v-model="report.id_gruppo">              
              <option v-for="group in groups" value="{{ group.id }}">{{ group.codice }} - {{ group.nome }}</option>     
            </select>
          </div>
        </div>
      </div>      -->
    </div>   
    
    <!-- <div class="row">
      <div class="col-12 col-md-12">                
          <input type="file" name="upload1" id="upload1" class="upload" />
          <label for="upload1">
            <svg class="icon icon-sm" aria-hidden="true"><use href="/bi-icons.svg#it-upload"></use></svg>
            <span>Carica file</span>
          </label>
          <ul class="upload-file-list">
            
          </ul>
      </div>
    </div> -->
    <div class="row">
      <div class="col-12">
        <div style="display: flex; justify-content: space-between; gap: 10px">
          <button class="btn btn-primary mt-3" type="submit" @click="salvaModifiche()">Salva modifiche</button>
          <div style="display: flex; gap: 10px">
            <!-- RISOLTO -->
            <div v-if="report.stato == ReportStatus.IN_PROGRESS || report.stato == ReportStatus.OPEN">
              <button class="btn btn-success mt-3" type="submit" @click="risolviSegnalazione(report.id)">Risolto</button>
            </div>
            <!-- ELIMINA -->
            <button class="btn btn-danger mt-3" type="submit" @click="eliminaReport(report.id)">Elimina</button>
          </div>
        </div>
        </div>
      </div>
    </div>

    <a class="btn btn-link" v-on:click="goToElencoReport()" role="button">Torna all'elenco report</a>   
  
</template>

<style scoped>
.spacer {
  height: 50px;
}
</style>
