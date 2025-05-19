<script setup lang="ts">

</script>

<template>
  <div class="it-header-slim-wrapper">
  <div class="container-xxl">
    <div class="row">
      <div class="col-12">
        <div class="it-header-slim-wrapper-content">
          <div class="it-brand-wrapper">
            <a href="#">
             <!-- <div class="header-thumbnail">
              <img src="  /logo_unibo.png" alt="logo unibo">
             </div> -->
              <div class="it-brand-text">
                <div class="it-brand-title">Smart Report Dashboard</div>
                <!-- <div class="it-brand-tagline d-none d-md-block">Gestione segnalazioni</div> -->
              </div>
            </a>
          </div>
          <div class="it-header-slim-right-zone">
          <div class="it-user-wrapper">              
              <a aria-label="Cerca nel sito" href="#">
                <svg class="icon icon-padded">
                  <use href="/bi-icons.svg#it-user"></use>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<style scoped>
  .header-thumbnail img {
    width: 50px;
    height: 50px;
    border-radius: 50%; /* Per un'immagine rotonda */
    object-fit: cover; /* Mantiene le proporzioni dell'immagine */
    margin-right: 20px;
  }
</style>
