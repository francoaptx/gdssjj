<template> 
  <header class="header"> 
    <div class="logo">Sistema de Gestion Documental</div> 
    <nav class="nav"> 
      <router-link to="/">Inicio</router-link> 
      <template v-if="isAuthenticated"> 
        <span>Bienvenido, {{ user ? user.username : 'Usuario' }}</span>
        <button @click="logout">Cerrar Sesión</button> 
      </template>
      <router-link to="/login" v-else>Iniciar Sesión</router-link> 
    </nav> 
  </header> 
</template> 

<script> 
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default { 
  name: 'Header',
  setup() {
    const store = useStore();
    const router = useRouter();
    
    const isAuthenticated = computed(() => store.getters.isAuthenticated);
    const user = computed(() => store.getters.user);
    
    const logout = () => {
      store.dispatch('logout');
      router.push('/login');
    };
    
    return {
      isAuthenticated,
      user,
      logout
    };
  }
}; 
</script> 

<style scoped> 
.header { 
  background-color: #2c3e50; 
  color: white; 
  padding: 1rem; 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
} 
.logo { 
  font-size: 1.5rem; 
  font-weight: bold; 
} 
.nav { 
  display: flex; 
  align-items: center; 
  gap: 1rem; 
} 
.nav a, .nav button { 
  color: white; 
  background: none; 
  border: none; 
  cursor: pointer; 
  text-decoration: none; 
} 
.nav a:hover { 
  text-decoration: underline; 
} 
</style>