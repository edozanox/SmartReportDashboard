import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ExistingReportItem from '@/components/ExistingReportItem.vue'
import ReportsList from '@/components/ReportsList.vue'
import ReportFormItem from '@/components/ReportFormItem.vue'
import AdminContainer from '@/components/AdminContainer.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: AdminContainer,
    },
    {
      path: '/reports/nuova',
      name: 'nuova-segnalazione',
      component: ReportFormItem,
    },
    {
      path: '/reports/elenco',
      name: 'elenco-segnalazioni',
      component: ReportsList,
    },
    {
      path: '/reports/dettaglio',
      name: 'dettagli-segnalazione',
      component: ExistingReportItem,
    },
  ],
})

export default router
