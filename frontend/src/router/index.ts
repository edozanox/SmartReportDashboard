import { createRouter, createWebHistory } from 'vue-router'
import ExistingReportItem from '@/components/ExistingReportItem.vue'
import ReportsList from '@/components/ReportsList.vue'
import ReportFormItem from '@/components/ReportFormItem.vue'
import SignIn from '@/components/auth/sign-in.vue'
import { authClient } from '@/lib/auth-client'
import Homepage from '@/components/Homepage.vue'
import { RuoliEnum } from '@/models/ruoli.enum'
import { useCurrentUserStore as useCurrentUserStore } from '@/stores/store'
import AdminContainer from '@/components/AdminContainer.vue'
import CittadinoContainer from '@/components/CittadinoContainer.vue'
import NotFound from '@/components/NotFound.vue'
import type { UserDataPayload } from '@/lib/better-auth'

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
      component: CittadinoContainer, 
      meta: {
        requiresAuth: true,
        requiredRoles: [RuoliEnum.CITTADINO]
      },
    },
    {
      path: '/reports/dettaglio/:id',
      name: 'dettagli-segnalazione',
      component: ExistingReportItem, 
      meta: {
        requiresAuth: true,
        requiredRoles: [RuoliEnum.AMMINISTRATORE]
      },
    },
    {
      path: '/login',
      name: 'login',
      component: SignIn,      
    },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
  ],
});

// Helper per verificare i ruoli
const hasRequiredRole = (userRole: string, requiredRoles: RuoliEnum[] | undefined): boolean => {
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
    
    const userStore = useCurrentUserStore();
    let session: any = null;
    let isAuthenticated = false;

    // Se l'utente è già nello store, non richiamare getSession (ottimizzazione)
    if (userStore.id) {
      isAuthenticated = true;
    } else {
      // Altrimenti, recupera la sessione dal server
      const response = await authClient.getSession() as UserDataPayload;    
      const { data } = response;
      session = data;
      isAuthenticated = !!session;

      // 🔑 Ripristina i dati dell'utente nello store se la sessione è valida
      if (isAuthenticated && session.user) {
        userStore.setUserInfo(
          session.user.id,
          session.user.name,
          session.user.role
        );
      }
    }

    const userRole = userStore.role;

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
      console.log(`Utente già autenticato. Reindirizzamento alla dashboard.`);
      // Reindirizza alla dashboard appropriata in base al ruolo
      if (userRole === RuoliEnum.AMMINISTRATORE) {
        next({name: 'dashboard-amministrazione'});
      } else if (userRole === RuoliEnum.CITTADINO) {
        next({name: 'dashboard-cittadino'});
      } else {
        next({ name: 'home' });
      }
      return;
    }

    // Se l'utente è loggato e vai alla home, reindirizza alla dashboard appropriata
    if (isAuthenticated && to.name === 'home' || isAuthenticated && to.name === '') {
      console.log(`Utente loggato sulla home. Reindirizzamento alla dashboard.`);
      if (userRole === RuoliEnum.AMMINISTRATORE) {
        next({name: 'dashboard-amministrazione'});
      } else if (userRole === RuoliEnum.CITTADINO) {
        next({name: 'dashboard-cittadino'});
      } else {
        next(); // Se ha un ruolo non riconosciuto, lascia passare
      }
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
