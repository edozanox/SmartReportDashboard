<script setup lang="ts">
import { authClient } from '@/lib/auth-client';
import { RuoliEnum } from '@/models/ruoli.enum';
import { useCurrentUserStore } from '@/stores/map';
import { getActivePinia } from 'pinia';
import router from '@/router';

const currentUserStore = useCurrentUserStore();

function logout() {
  authClient.signOut();  
  // currentUserStore.$reset();
  router.push({ name: 'home' });
}
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
                <div class="it-brand-title"><strong>Smart Report Dashboard</strong></div>
              </div>
            </a>
          </div>
          <div class="it-header-slim-right-zone">
            <div class="user-info">{{currentUserStore.name}} - <i><small>{{RuoliEnum[currentUserStore.role]}}</small></i></div>
          <div class="it-user-wrapper dropdown text-center">
            <button class="btn btn-dropdown dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <a>
                <svg class="icon icon-padded">
                  <use href="/bi-icons.svg#it-user"></use>
                </svg>
              </a>
            </button>            
              <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <div class="link-list-wrapper">
                  <ul class="link-list">
                    <li><a class="dropdown-item list-item" href="#"><span>I miei dati</span></a></li>
                    <li><a class="dropdown-item list-item" href="#"><span>Assistenza</span></a></li>
                    <li><a class="dropdown-item list-item" v-on:click="logout()"><span>Logout</span></a></li>
                  </ul>
                </div>
              </div>
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

  .user-info {
    color: white;
  }
</style>
