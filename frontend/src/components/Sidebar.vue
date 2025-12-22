cd // Componente Sidebar 
<template> 
  <aside class="sidebar"> 
    <nav> 
      <router-link to="/dashboard" class="nav-item">
        <i class="pi pi-home"></i>
        <span>Dashboard</span>
      </router-link>
      <router-link to="/routing-sheets" class="nav-item">
        <i class="pi pi-file"></i>
        <span>Hoja de Ruta</span>
      </router-link>
      <router-link to="/routing-sheets/create" class="nav-item">
        <i class="pi pi-plus"></i>
        <span>Crear Hoja de Ruta</span>
      </router-link>
      <router-link to="/reception" class="nav-item">
        <i class="pi pi-inbox"></i>
        <span>Recepción</span>
      </router-link>
      <router-link to="/processing" class="nav-item">
        <i class="pi pi-cog"></i>
        <span>Pendientes</span>
      </router-link>
      <router-link to="/sent" class="nav-item">
        <i class="pi pi-send"></i>
        <span>Enviados</span>
      </router-link>
      <router-link to="/archive" class="nav-item">
        <i class="pi pi-box"></i>
        <span>Archivo</span>
      </router-link>
      <router-link to="/history" class="nav-item">
        <i class="pi pi-history"></i>
        <span>Historial</span>
      </router-link>
      <!-- Enlace a usuarios eliminado del menú principal -->
      <!-- Enlace temporal para pruebas de PrimeVue eliminado -->
      <div class="admin-section" v-if="isAdmin">
        <div class="admin-header">
          <i class="pi pi-lock"></i>
          <h3>Administración</h3>
        </div>
        <hr>
        <router-link to="/users" class="nav-item admin-item">
          <i class="pi pi-user-edit"></i>
          <span>Gestionar Usuarios</span>
        </router-link>
        <router-link to="/admin/positions" class="nav-item admin-item">
          <i class="pi pi-briefcase"></i>
          <span>Gestionar Cargos</span>
        </router-link>
        <router-link to="/admin/offices" class="nav-item admin-item">
          <i class="pi pi-building"></i>
          <span>Gestionar Oficinas</span>
        </router-link>
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
  background: linear-gradient(180deg, #2c3e50 0%, #34495e 100%); 
  color: white; 
  width: 250px; 
  min-height: 100vh; 
  height: 100vh;
  padding: 1rem 0; 
  position: fixed;
  top: 0;
  left: 0;
  overflow-y: auto;
  z-index: 100;
  box-shadow: 3px 0 10px rgba(0, 0, 0, 0.1);
  margin-top: 60px; /* Para compensar el header */
} 

.sidebar nav { 
  display: flex; 
  flex-direction: column; 
  padding: 0 0.5rem;
} 

.nav-item { 
  color: white; 
  text-decoration: none; 
  padding: 0.75rem 1rem; 
  margin-bottom: 0.25rem; 
  border-radius: 4px; 
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  gap: 0.75rem;
} 

.nav-item i {
  width: 24px;
  text-align: center;
}

.nav-item span {
  flex: 1;
}

.nav-item.router-link-active,
.nav-item:hover { 
  background-color: rgba(255, 255, 255, 0.1); 
  transform: translateX(5px);
} 

.admin-section {
  margin-top: 1.5rem;
  padding: 1rem 0.5rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.admin-header {
  display: flex;
  align-items: center;
  padding: 0 0.5rem 0.5rem;
  gap: 0.5rem;
}

.admin-header i {
  font-size: 1.1rem;
}

.admin-header h3 {
  margin: 0;
  font-size: 1rem;
  color: #ddd;
  font-weight: 600;
}

.admin-item {
  padding-left: 2.5rem;
  font-size: 0.95rem;
}

.admin-item i {
  font-size: 0.9rem;
}

.sidebar hr {
  width: 100%;
  border: 0.5px solid rgba(255, 255, 255, 0.2);
  margin: 0.75rem 0;
}
</style>