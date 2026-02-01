<script setup lang="ts">
import { ref } from 'vue';
import { authClient } from '@/lib/auth-client'; 
import type { UserDataPayload } from '@/lib/better-auth';
import { useCurrentUserStore as useCurrentUserStore } from '@/stores/store';
import router from '@/router';
import { RuoliEnum } from '@/models/ruoli.enum';

const session = authClient.useSession();

// Stato per alternare tra Login (false) e Registrazione (true)
const isSignUpMode = ref(false);

// Dati del form
const name = ref(''); 
const email = ref('');
const telefono = ref('');
const password = ref(''); 
const ruolo = ref(0);

// Stato UI
const isLoading = ref(false);
const errorMessage = ref<string | null>(null);
const successMessage = ref<string | null>(null);

//Salvataggio nello store dei dati dell'utente
const currentUserStore = useCurrentUserStore();

function resetState() {
  errorMessage.value = null;
  successMessage.value = null;
  isLoading.value = false;
}

async function hashPassword(plainPassword: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plainPassword);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function handleSignIn() {
  resetState();
  isLoading.value = true;

  const hashedPassword = await hashPassword(password.value);
  const { data , error } = await authClient.signIn.email({
    email: email.value,
    password: hashedPassword,
  }) as UserDataPayload;

  isLoading.value = false;
  if (error) {
    errorMessage.value = error.message || 'Credenziali non valide.';
  } else {
    successMessage.value = 'Login effettuato con successo, attendere prego...';
    // Accedi ai dati dell'utente
    
    if (session.value.data?.user) {
      const user: UserDataPayload = session.value.data.user;
      currentUserStore.setUserInfo(user.id, user.name, user.role);   
    }

    if (currentUserStore.role === RuoliEnum.AMMINISTRATORE) {  
      router.push({ name: 'dashboard-amministrazione' });
    }

    //OPERATORE
    

    //OSSERVATORE

    //CITTADINO
    if (currentUserStore.role === RuoliEnum.CITTADINO) {  
      router.push({ name: 'dashboard-cittadino' });
    }
  }
}

async function handleSignUp() {
  resetState();
  isLoading.value = true;

  // Validazione client-side aggiuntiva per dominio email
  if (!email.value.endsWith('@unibo.it')) {
     errorMessage.value = 'Registrazione consentita solo con email @unibo.it';
     isLoading.value = false;
     return;
  }

  const hashedPassword = await hashPassword(password.value);
  const payload: UserDataPayload = {
    name: name.value,
    email: email.value,
    password: hashedPassword,    
    phone: telefono.value,
    role: ruolo.value,
  };
  // La chiamata API interagirà con l'hook nel backend che controlla il dominio
  const { data, error } = await authClient.signUp.email(payload);

  isLoading.value = false;
  if (error) {
    // Riceverà l'errore del backend se il dominio non è @unibo.it
    errorMessage.value = error.message || 'Errore durante la registrazione.';
  } else {
    // L'utente è stato correttamente registrato via Better Auth
    successMessage.value = 'Registrazione avvenuta con successo!';   
    
    name.value = '';
    email.value = '';
    telefono.value = '';
    password.value = '';
    ruolo.value = 0;
        
  }
}

function toggleMode() {
  isSignUpMode.value = !isSignUpMode.value;
  resetState(); 
}
</script>

<template>
  <div class="auth-ui-container">
    <h2>{{ isSignUpMode ? 'Registrazione' : 'Accesso' }}</h2>

    <form @submit.prevent="isSignUpMode ? handleSignUp() : handleSignIn()">
      <!-- <div v-if="isSignUpMode">
        <label for="auth-name">Nome:</label>
        <input type="text" id="auth-name" v-model="name" required />
      </div>

      <div>
        <label for="auth-email">Email:</label>
        <input
          type="email"
          id="auth-email"
          v-model="email"
          required
          :pattern="isSignUpMode ? '.+@studio.unibo\\.it$' : '.+'"
          :title="isSignUpMode ? 'Inserisci una email valida @my-dom.it' : 'Inserisci la tua email'"
        />
      </div>

      <div class="select-wrapper">
        <label for="auth-password">Password:</label>
        <input
          type="password"
          id="auth-password"
          v-model="password"
          required
          :minlength="isSignUpMode ? 8 : undefined"
        />
      </div>
         
      
       -->

       <div class="form-wrapper bg-white p-6 cmp-input">
                          
        <div class="col-12 col-md-12  form-item" v-if="isSignUpMode">
          <label for="name">Nome</label>
          <input type="text" class="form-control" id="name" name="name" v-model="name" data-focus-mouse="false">                               
        </div>       
                          
        <div class="col-12 col-md-12 form-item">
          <label for="email">Email</label>
          <input type="email" class="form-control" id="email" name="email" v-model="email" required data-focus-mouse="false">        
        </div>

        <div class="col-12 col-md-12 form-item" v-if="isSignUpMode">
          <label for="tel">Telefono</label>
          <input type="tel" class="form-control" id="telefono" name="telefono" v-model="telefono" data-focus-mouse="false">        
        </div>
        
        <div class="col-12 col-md-12 form-item">
          <label for="password">Password</label>
          <input type="password" class="form-control" id="password" name="password" v-model="password" required data-focus-mouse="false">        
        </div>           
        
        <br/>
        <br/>
        
        <div class="select-wrapper" v-if="isSignUpMode">
          <label for="selettoreRuolo">Ruolo</label>
          <select id="selettoreRuolo" class="form-control" v-model="ruolo">
            <option value="">--</option>
            <option value="ADMIN">Amministratore</option>
            <option value="USER">Cittadino</option>
          </select>
        </div>
                          
      </div>  

      <button type="button" class="btn btn-primary" v-on:click="isSignUpMode ? handleSignUp() : handleSignIn()">
        {{ (isSignUpMode ? 'Registrati' : 'Accedi') }}
      </button>

      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
    </form>

    <a class="btn btn-link" @click="toggleMode" role="button">
      {{ isSignUpMode ? 'Hai già un account? Accedi' : 'Non hai un account? Registrati' }}
    </a>
  </div>
</template>

<style scoped>

.auth-ui-container {
  /* Stili di base per container, puoi modellarli come shadcn/ui */
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-item {
  margin-bottom: 5px;
}

.spacer {
  height: 50px;
}

.error-message { color: red; }
.success-message { color: green; }
/* ... (Aggiungi tutti gli altri stili dal componente precedente se necessario) ... */
</style>