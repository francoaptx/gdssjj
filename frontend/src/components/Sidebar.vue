// Componente Sidebar 
<template> 
  <aside class="sidebar"> 
    <nav> 
      <router-link to="/dashboard">Dashboard</router-link> 
      <router-link to="/routing-sheets">Hoja de Ruta</router-link> 
      <router-link to="/routing-sheets/create" class="sub-item">Crear Hoja de Ruta</router-link>
      <router-link to="/reception">Recepcion</router-link> 
      <router-link to="/processing">Tramite</router-link> 
      <router-link to="/archive">Archivo</router-link> 
      <router-link to="/history">Historial</router-link> 
      <router-link to="/users">Usuarios</router-link>
      <div class="admin-section" v-if="isAdmin">
        <hr>
        <h3>Administración</h3>
        <router-link to="/users">Gestionar Usuarios</router-link>
        <router-link to="/admin/positions">Gestionar Cargos</router-link>
        <router-link to="/admin/offices">Gestionar Oficinas</router-link>
      </div>
    </nav> 
  </aside> 
</template> 
 
<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

export default { 
  name: 'Sidebar',
  setup() {
    const store = useStore();
    const user = computed(() => store.getters.user);
    const isAdmin = computed(() => user.value && user.value.role && user.value.role.name === 'ADMIN');
    
    return {
      isAdmin
    };
  }
};
</script> 
 
<style scoped> 
.sidebar { 
  background-color: #34495e; 
  color: white; 
  width: 200px; 
  min-height: calc(100vh - 60px); 
  padding: 1rem; 
} 
.sidebar nav { 
  display: flex; 
  flex-direction: column; 
} 
.sidebar a { 
  color: white; 
  text-decoration: none; 
  padding: 0.5rem; 
  margin-bottom: 0.5rem; 
  border-radius: 4px; 
} 
.sidebar a.router-link-active { 
  background-color: #2c3e50; 
} 
.sidebar .sub-item {
  padding-left: 1.5rem;
  font-size: 0.9rem;
}
.sidebar hr {
  width: 100%;
  border: 0.5px solid #6c757d;
  margin: 1rem 0;
}
.admin-section h3 {
  margin: 0.5rem 0;
  font-size: 1rem;
  color: #ccc;
}
</style>