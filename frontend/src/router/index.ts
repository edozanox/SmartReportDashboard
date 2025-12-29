import { createRouter, createWebHistory } from 'vue-router'
import ExistingReportItem from '@/components/ExistingReportItem.vue'
import ReportsList from '@/components/ReportsList.vue'
import ReportFormItem from '@/components/ReportFormItem.vue'
import SignIn from '@/components/auth/sign-in.vue'
import { authClient } from '@/lib/auth-client'
import Homepage from '@/components/Homepage.vue'
import { RuoliEnum } from '@/models/ruoli.enum'
import { useCurrentUserStore as useCurrentUserStore } from '@/stores/map'
import AdminContainer from '@/components/AdminContainer.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Homepage,
      meta: { requiresAuth: false },
    },
    {
      path: '/dashboard/amministrazione',
      name: 'dashboard-amministrazione',
      component: AdminContainer, 
      meta: {
        requiresAuth: true,
        requiredRoles: [RuoliEnum.AMMINISTRATORE]
      },
    },
    {
      path: '/dashboard/cittadino',
      name: 'dashboard-cittadino',
      component: AdminContainer, 
      meta: {
        requiresAuth: true,
        requiredRoles: [RuoliEnum.CITTADINO]
      },
    },

    // {
    //   path: '/reports/nuova',
    //   name: 'nuova-segnalazione',
    //   component: ReportFormItem,
    //   meta: {
    //     requiresAuth: true,
    //     requiredRoles: [RuoliEnum.CITTADINO]
    //   },
    // },
    // {
    //   path: '/reports/elenco',
    //   name: 'elenco-segnalazioni',
    //   component: ReportsList,
    //   meta: { 
    //     requiresAuth: true,
    //     requiredRoles: [RuoliEnum.AMMINISTRATORE, RuoliEnum.OSSERVATORE] 
    //   },
    // },
    // {
    //   path: '/reports/dettaglio',
    //   name: 'dettagli-segnalazione',
    //   component: ExistingReportItem, 
    //   meta: {
    //     requiresAuth: true,
    //     requiredRoles: [RuoliEnum.AMMINISTRATORE, RuoliEnum.OPERATORE, RuoliEnum.OSSERVATORE]
    //   },
    // },
    {
      path: '/login',
      name: 'login',
      component: SignIn,      
    },
  ],
});

// Helper per verificare i ruoli
const hasRequiredRole = (userRole: number, requiredRoles: RuoliEnum[] | undefined): boolean => {
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }
  return requiredRoles.includes(userRole as RuoliEnum);
};

router.beforeEach(async (to, from, next) => {
  
  // Definisci se la rotta richiede autenticazione (meta: { requiresAuth: true })
  const requiresAuth = to.meta.requiresAuth;
  const requiredRoles = to.meta.requiredRoles as RuoliEnum[] | undefined;

  try {
    
    const response = await authClient.getSession();    
    const { data: session } = response;
    const isAuthenticated = !!session; // La sessione è autenticata se `session` non è null/undefined

    const userRole = useCurrentUserStore().role;

    // ❌ Rotta protetta ma utente non autenticato
    if (requiresAuth && !isAuthenticated) {
      console.warn(`Accesso negato a ${to.path}. Utente non autenticato.`);
      next({ name: 'login' });
      return;
    }

    // ❌ Utente autenticato ma ruolo insufficiente
    if (requiresAuth && isAuthenticated && !hasRequiredRole(userRole, requiredRoles)) {
      console.warn(`Accesso negato a ${to.path}. Ruolo insufficiente. Ruolo: ${userRole}`);
      next({ name: 'home' });
      return;
    }

    // ✅ Utente già autenticato che prova ad accedere a /login
    if (!requiresAuth && isAuthenticated && to.name === 'login') {
      console.log(`Utente già autenticato. Reindirizzamento a /home.`);
      next({ name: 'home' });
      return;
    }

    // ✅ Accesso consentito
    next();

  } catch (error: any) {
    console.error('Errore dettagliato:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    next(); // In caso di errore, consenti il passaggio (potrebbe essere una richiesta pubblica)
  }
});

export default router
