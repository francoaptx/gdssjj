import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

console.log('Starting Vue application initialization...');

// Initialize the Vue application with the proper App component
const app = createApp(App)

console.log('Vue app instance created');

// Attach the store and router to the app
console.log('Attaching store to app');
app.use(store)

console.log('Attaching router to app');
app.use(router)

// Add global error handling
app.config.errorHandler = (err, instance, info) => {
  console.error('Global error handler:', err, info);
};

app.config.warnHandler = (msg, instance, trace) => {
  console.warn('Global warning handler:', msg, trace);
};

// Mount the application to the DOM
console.log('Mounting app to #app');
app.mount('#app')

console.log('App mounted successfully');