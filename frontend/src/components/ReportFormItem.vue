<script setup lang="ts">
import { Notification } from 'bootstrap-italia';
import { useCurrentUserStore, useMapStore } from '@/stores/map';
import { ref } from 'vue';
import axios, { HttpStatusCode } from 'axios';
import { ReportStatus } from '@/models/report-status.enum';

const mapStore = useMapStore();
const currentUserStore = useCurrentUserStore();
const api = axios.create({
  baseURL: 'http://localhost:3000'
})
const tipo = ref('');
const descrizione = ref('');
const email = ref('');
const telefono = ref('');

async function inviaReport(){
  try {  
    const request =
    {id: null, utenteId: currentUserStore.$id, categoria: tipo.value, indirizzo: mapStore.indirizzo, descrizione: descrizione.value, coordinate: mapStore.coordinate,
      data_inserimento: new Date().toISOString().slice(0, 19).replace('T', ' '), data_aggiornamento: null, assegnatario: null, status: ReportStatus.OPEN,
      email: email.value, telefono: telefono.value, annotazioni: null};
    
    const response = await api.post('/api/reports/send', request);
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
</script>

<template>
  <div class="notification top-fix with-icon success" role="alert" id="report-ok" style="display: none;">
    <h2 class="h5"><svg class="icon"><use href="/bi-icons.svg#it-check-circle"></use></svg>Segnalazione inviata con successo!</h2>
  </div>
  <div class="notification top-fix with-icon error" role="alert" id="report-ko" style="display: none;">
    <h2 class="h5"><svg class="icon"><use href="/bi-icons.svg#it-close-circle"></use></svg>Errore nell'invio della segnalazione</h2>
  </div>
  
 
  <div class="container mb-5 mt-2 pt-2">
    <div class="row">      
      <div class="col-12">
        <h3>Nuova segnalazione</h3>
        <hr>
      </div>
    </div>
    <div class="spacer"></div>
    <div class="row">
      <div class="col-12 col-md-4">
          <div class="form-group">
          <div class="select-wrapper">
            <label for="defaultSelect">Tipo segnalazione</label>
            <select id="defaultSelect" class="form-control" v-model="tipo">
              <option value="">Seleziona una voce</option>
              <option value="OP_VIA">Manutenzione - sicurezza</option>
              <option value="OP_STR">Strade - segnaletica - viabilità</option>
              <option value="OP_VRD">Verde urbano</option>
              <option value="OP_URB">Rifiuti</option>
              <option value="OP_SOS">Ordine pubblico</option>
            </select>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-8">
        <div class="form-group">
          <label for="nome" class="">Indirizzo</label>
          <input type="text" class="form-control" id="indirizzo" v-model="mapStore.indirizzo">
        </div>
      </div>
      <div class="col-12 col-md-12">
        <label for="nome" class="">Descrizione</label>
        <textarea class="form-control" id="descrizione" rows="4" maxlength="5000" v-model="descrizione"></textarea>
      </div>
      <div class="spacer"></div>
      <div class="col-12 col-md-6">
        <label for="email" class="">Email</label>
        <input type="email" class="form-control" v-model="email">  
      </div>    
      <div class="col-12 col-md-6">
        <label for="telefono" class="">Telefono</label>
        <input type="tel" class="form-control" v-model="telefono">
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
