// src/types/better-auth.d.ts (o dove gestisci i tuoi tipi globali)

// Importa i tipi di BetterAuth se necessario, altrimenti usa i tipi base
import type { SignUpEmail, User } from 'better-auth/client'; 

export interface UserSignUpData extends User {
  phone?: string;
  role?: number;
}

// 2. Estendi l'interfaccia di Sign-Up per includere i campi personalizzati
// Utilizziamo un'intersezione di tipi per combinare i campi standard
// (email, password, ecc.) con i campi personalizzati.
export type UserDataPayload = SignUpEmail & UserSignUpData;