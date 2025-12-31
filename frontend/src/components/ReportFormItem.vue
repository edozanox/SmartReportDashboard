<script setup lang="ts">
import { Notification } from 'bootstrap-italia';
import { useCurrentUserStore, useMapStore } from '@/stores/store';
import { onMounted, ref } from 'vue';
import axios, { HttpStatusCode } from 'axios';
import { ReportStatus } from '@/models/report-status.enum';
import { CategoriaEnum } from '@/models/categoria.enum';

const mapStore = useMapStore();
const currentUserStore = useCurrentUserStore();
const api = axios.create({
  baseURL: 'http://localhost:3000/api/reports'
})

const report = ref({  
  tipo: '',
  descrizione: '',
  email: '',
  telefono: '',  
});

onMounted(() =>{
  initializeComponent();
});

function initializeComponent(){
  mapStore.clearMarkers();
}

async function inviaReport(){
  try {  
    const request =
    {
      id: null,
      utenteId: currentUserStore.id,
      categoria: report.value.tipo[0],
      indirizzo: mapStore.indirizzo,
      descrizione: report.value.descrizione,
      coordinate: mapStore.coordinate,
      data_inserimento: new Date().toISOString().slice(0, 19).replace('T', ' '),
      data_aggiornamento: null,
      assegnatario: null,
      stato: ReportStatus.OPEN,
      email: report.value.email,
      telefono: report.value.telefono,
      annotazioni: null
    }
    console.log(request);
    const response = await api.post('/send', request);
    if(response.status == HttpStatusCode.Created)
    {
      let element = document.getElementById('report-ok');
      
      if(element) {
        element.style.display = 'block';
        new Notification(element, {timeout: 5000});
      }
    }     
  } catch {

    let element = document.getElementById('report-ko');
    if(element) {
      element.style.display = 'block';
      new Notification(element, {timeout: 5000});
    }
    
  }

}
defineExpose({
  initializeComponent
});
</script>

<template>
  <div class="notification top-fix with-icon success" role="alert" id="report-ok" style="display: none;">
    <h2 class="h5"><svg class="icon"><use href="/bi-icons.svg#it-check-circle"></use></svg>Segnalazione inviata con successo!</h2>
  </div>
  <div class="notification top-fix with-icon error" role="alert" id="report-ko" style="display: none;">
    <h2 class="h5"><svg class="icon"><use href="/bi-icons.svg#it-close-circle"></use></svg>Errore nell'invio della segnalazione</h2>
  </div>
  
 
  <div class="container mb-5 mt-2 pt-2">    
    <div class="spacer"></div>
    <div class="row">
      <div class="col-12 col-md-4">          
        <div class="select-wrapper">
          <label for="defaultSelect">Categoria</label>
          <select id="defaultSelect" class="form-control" v-model="report.tipo">
            <option v-for="(value, key) in Object.entries(CategoriaEnum)" :key="key" :value="value">{{ value[0] }} - {{ value[1] }}</option>
          </select>
        </div>        
      </div>
      <div class="col-12 col-md-8">        
        <label for="nome" class="">Indirizzo</label>
        <input type="text" class="form-control" id="indirizzo" v-model="mapStore.indirizzo">      
      </div>
      <div class="col-12 col-md-12">
        <label for="nome" class="">Descrizione</label>
        <textarea class="form-control" id="descrizione" rows="4" maxlength="5000" v-model="report.descrizione"></textarea>
      </div>
      <div class="spacer"></div>
      <div class="col-12 col-md-6">
        <label for="email" class="">Email</label>
        <input type="email" class="form-control" v-model="report.email">  
      </div>    
      <div class="col-12 col-md-6">
        <label for="telefono" class="">Telefono</label>
        <input type="tel" class="form-control" v-model="report.telefono">
      </div>
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
        <button class="btn btn-primary mt-3" type="submit" @click="inviaReport()">Invia segnalazione</button>
      </div>
    </div>
  </div>

</template>

<style scoped>
.spacer {
  height: 50px;
}
</style>
