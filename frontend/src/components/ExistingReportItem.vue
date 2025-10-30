<script setup lang="ts">
import { Notification } from 'bootstrap-italia';
import { useMapStore, useReportStore } from '@/stores/map';
import { onMounted, ref } from 'vue';
import axios, { HttpStatusCode } from 'axios';
import { ReportStatus } from '@/models/report-status.enum';
import type { Group } from '@/models/group.model';

const reportStore = useReportStore();
const mapActions = useMapStore();
const report = reportStore.segnalazione;
var groups = [] as Group[];
const api = axios.create({
  baseURL: 'http://localhost:3000'
})

onMounted(async () =>{
  mapActions.clearMarkers();    

  // Recupero i gruppi per l'assegnazione del report
  try {
  const response = await fetch('http://localhost:3000/api/gruppi/getAll');
  groups = (await response.json()).data;  

  } catch (error) {
      console.error('Errore nel recupero della lista gruppi:', error);
  }
});

async function salvaModifiche(){
  try {  
    const request =
    {id: null, assegnatario: null, status: ReportStatus.OPEN, annotazioni: null};
    
    const response = await api.post('/api/reports/change', request);
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
  <!-- <div class="notification top-fix with-icon success" role="alert" id="report-ok" style="display: none;">
    <h2 class="h5"><svg class="icon"><use href="/bi-icons.svg#it-check-circle"></use></svg>Segnalazione inviata con successo!</h2>
  </div>
  <div class="notification top-fix with-icon error" role="alert" id="report-ko" style="display: none;">
    <h2 class="h5"><svg class="icon"><use href="/bi-icons.svg#it-close-circle"></use></svg>Errore nell'invio della segnalazione</h2>
  </div> -->
  
 
  <div class="container mb-5 mt-2 pt-2">
    <div class="row">      
      <div class="col-12" style="display: flex; justify-content: space-between; align-items: center;">
        <h3>Dettaglio segnalazione</h3>
        <span v-if="report.status === ReportStatus.OPEN">
          <svg class="icon icon-secondary"><use href="/bi-icons.svg#it-plus-circle"></use></svg>
          <strong>Aperta</strong>
          </span>

          <span v-if="report.status === ReportStatus.IN_PROGRESS">
          <svg class="icon icon-primary"><use href="/bi-icons.svg#it-clock"></use></svg>
          <strong>In lavorazione</strong> 
          </span>

          <span v-if="report.status === ReportStatus.RESOLVED">
          <svg class="icon icon-success"><use href="/bi-icons.svg#it-check-circle"></use></svg>
          <strong>Risolta</strong>
          </span>            
          
          <span v-if="report.status === ReportStatus.REFUSED">
          <svg class="icon icon-danger"><use href="/bi-icons.svg#it-close-circle"></use></svg>
          <strong>Chiusa</strong>
          </span>        
      </div>
      <hr>
    </div>
    <div class="spacer"></div>
    <div class="row">
      <div class="col-12 col-md-4">
          <div class="form-group">
          <div class="select-wrapper">
            <label for="tipoSelector">Tipo segnalazione</label>
            <select id="tipoSelector" class="form-control" v-model="report.categoria" disabled>
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
          <input type="text" class="form-control" id="indirizzo" v-model="report.indirizzo" disabled>
        </div>
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
          <div class="form-group">
          <div class="select-wrapper">
            <label for="gruppoSelector">Gruppo incaricato</label>
            <select id="gruppoSelector" class="form-control" v-model="report.id_gruppo">              
              <option v-for="group in groups" value="{{ group.id }}">{{ group.codice }} - {{ group.nome }}</option>     
            </select>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6">
        <div class="form-group">
          <label for="nome" class="">Note</label>
          <input type="text" class="form-control" id="indirizzo" v-model="report.annotazioni">
        </div>
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
        <button class="btn btn-primary mt-3" type="submit" @click="salvaModifiche()">Salva modifiche</button>
      </div>
    </div>
  </div>

</template>

<style scoped>
.spacer {
  height: 50px;
}
</style>
