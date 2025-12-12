<template> 
  <div class="home"> 
    <div class="content"> 
      <h1>Bienvenido al Sistema de Gestion Documental</h1> 
      <p>Sistema para la gestion de documentos, hojas de ruta y tramites</p>
      <div v-if="isAuthenticated">
        <p>Usuario autenticado: {{ user ? user.username : 'Desconocido' }}</p>
        <p><router-link to="/dashboard">Ir al panel de control</router-link></p>
      </div>
      <div v-else>
        <p><router-link to="/login">Iniciar sesión</router-link> para acceder al sistema</p>
      </div>
    </div> 
  </div> 
</template> 
 
<script> 
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';

export default { 
  name: 'Home',
  setup() {
    const store = useStore();
    const isAuthenticated = computed(() => store.getters.isAuthenticated);
    const user = computed(() => store.getters.user);
    
    console.log('Home component setup');
    console.log('isAuthenticated:', isAuthenticated.value);
    console.log('user:', user.value);

    onMounted(() => {
      console.log('Home component mounted');
      console.log('isAuthenticated (mounted):', isAuthenticated.value);
      console.log('user (mounted):', user.value);
    });

    return {
      isAuthenticated,
      user
    };
  }
}; 
</script> 

<style scoped> 
.home { 
  display: flex; 
  justify-content: center; 
  align-items: center; 
  height: 100%; 
  min-height: 400px; 
} 

.content { 
  text-align: center; 
} 

.content h1 { 
  color: #2c3e50; 
  margin-bottom: 1rem; 
} 

.content p { 
  color: #7f8c8d; 
  margin-bottom: 1rem; 
} 

.content a { 
  color: #3498db; 
  text-decoration: none; 
  font-weight: bold; 
} 

.content a:hover { 
  text-decoration: underline; 
} 
</style>