// import './assets/main.css'
import 'bootstrap-italia/dist/css/bootstrap-italia.min.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { piniaResetPlugin } from './stores/store'
import httpClient from './lib/http-client'


const pinia = createPinia();
const app = createApp(App)
pinia.use(piniaResetPlugin);

app.use(pinia);
app.use(router);

// Rendi httpClient disponibile globalmente
app.config.globalProperties.$http = httpClient;

app.mount('#app')
