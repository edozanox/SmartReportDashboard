<script setup lang="ts">

</script>

<template>
 
  <div class="container mb-5 mt-5 pt-5">
    <div class="row">      
      <div class="col-12">
        <h3>Nuova segnalazione</h3>
        <hr>
      </div>
    </div>
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
      <div class="col-12 col-md-6">
        <div class="form-group">
          <label for="nome" class="">Campo testo</label>
          <input type="text" class="form-control" id="nome">
        </div>
      </div>
      <div></div>
      <div class="col-12 col-md-4">
        <div class="form-group">
          <label for="camponumerico" class="">Campo numerico (5 cifre)</label>
          <input type="number" data-bs-input="" class="form-control" id="camponumerico" maxlenght="5">
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-12 col-md-4">
        <div class="form-group">
          <label for="email" class="">Campo Email</label>
          <input type="email" class="form-control" id="email">
        </div>
      </div>
      <div class="col-12 col-md-4">
      
      </div>
      <div class="col-12 col-md-4">
        <div class="form-group">
          <label class="active" for="date">Datepicker</label>
          <input class="form-control" type="date" id="date" name="date">
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-12 col-md-4">
        <div class="form-group">
          <label class="active" for="time">Timepicker</label>
          <input class="form-control" id="time" type="time">
        </div>
      </div>
      <div class="col-12 col-md-4">
        <div class="form-group">
          <label for="importo_input_group" class="input-symbol-label active">Importo</label>
          <span class="input-group input-number">
            <span class="input-group-text fw-semibold">€</span>
            <input type="number" class="form-control" data-bs-input="" id="importo_input_group" name="importo" step="any" value="3.50" min="0" max="50">
            <span class="input-group-text align-buttons flex-column">
              <button class="input-number-add">
                <span class="visually-hidden">Aumenta valore Euro</span>
              </button>
              <button class="input-number-sub">
                <span class="visually-hidden">Diminuisci valore Euro</span>
              </button>
            </span>
          </span>
        </div>
      </div>
      <div class="col-12 col-md-4">
        <div class="form-group">
          <label for="perc_input_group" class="input-symbol-label active">Percentuale</label>
          <div class="input-group input-number">
            <span class="input-group-text fw-semibold">%</span>
            <input type="number" class="form-control" data-bs-input="" id="perc_input_group" name="perc_input_group" value="80" min="80" max="100" step="any">
            <span class="input-group-text align-buttons flex-column">
              <button class="input-number-add">
                <span class="visually-hidden">Aumenta del 10%</span>
              </button>
              <button class="input-number-sub">
                <span class="visually-hidden">Diminuisci del 10%</span>
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
     <div class="row mb-5">
      <div class="col-12 col-md-6">
        <div class="form-upload">
          <label for="upload" class="">Upload</label>
          <input type="file" name="upload" id="upload" class="form-control">
        </div>
      </div> 
    </div>
    <div class="row">
      <div class="col-12">
        <button class="btn btn-primary mt-3" type="submit">Invia form</button>
      </div>
    </div>
  </div>

</template>
