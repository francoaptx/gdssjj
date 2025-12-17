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
import { useRouter } from 'vue-router';

export default {
  name: 'Home',
  setup() {
    const store = useStore();
    const router = useRouter();
    const isAuthenticated = computed(() => store.getters.isAuthenticated);
    const user = computed(() => store.getters.user);

    onMounted(() => {
      if (isAuthenticated.value) {
        router.push('/dashboard');
      }
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

.content a { 
  color: #42b983; 
  font-weight: bold; 
  text-decoration: none; 
} 

.content a:hover { 
  text-decoration: underline; 
} 
</style>