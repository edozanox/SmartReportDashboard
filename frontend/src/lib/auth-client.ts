// src/lib/auth-client.ts
import { createAuthClient } from 'better-auth/vue';

export const authClient = createAuthClient({  
  baseURL: 'http://localhost:3000',  
  basePath: '/api/auth',
  withCredentials: true, // Importante per gestire i cookie di sessione
   headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  plugins: [],
});

// Esporta funzioni specifiche se preferisci [cite: 75]
// export const { signIn, signUp, useSession } = authClient;