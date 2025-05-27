<script setup lang="ts">
import { useMapStore } from '@/stores/map';
const mapStore = useMapStore();
</script>

<template>
 
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
            <select id="defaultSelect" class="form-control">
              <option value="">Seleziona una voce</option>
              <option value="Value 1">Opzione 1</option>
              <option value="Value 2">Opzione 2</option>
              <option value="Value 3">Opzione 3</option>
              <option value="Value 4">Opzione 4</option>
              <option value="Value 5">Opzione 5</option>
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
        <textarea class="form-control" id="descrizione" rows="4" maxlength="5000"></textarea>
      </div>
    </div>
    <div class="spacer"></div>
    <div class="row">
      <div class="col-12 col-md-12">
                
          <input type="file" name="upload1" id="upload1" class="upload" />
          <label for="upload1">
            <svg class="icon icon-sm" aria-hidden="true"><use href="/bi-icons.svg#it-upload"></use></svg>
            <span>Carica file</span>
          </label>
          <ul class="upload-file-list">
            
          </ul>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <button class="btn btn-primary mt-3" type="submit">Invia form</button>
      </div>
    </div>
  </div>

</template>

<style scoped>
.spacer {
  height: 50px;
}
</style>
