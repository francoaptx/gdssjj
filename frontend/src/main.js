import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import store from './store'

// PrimeVue
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'

// PrimeVue Theme for v4
import Lara from '@primevue/themes/lara'
import 'primeicons/primeicons.css'
import './assets/css/global-styles.css'

// Custom styles
import './assets/css/status-priority.css'

// PrimeVue Components
import './plugins/primevue'

const app = createApp(App)

app.use(store)
app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: Lara,
    options: {
      prefix: 'p',
      darkModeSelector: '.p-dark',
      cssLayer: false
    }
  }
})
app.use(ToastService)

app.mount('#app')