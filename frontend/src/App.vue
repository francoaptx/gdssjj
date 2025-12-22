<template>
  <div id="app">
    <Header />
    <div class="app-container">
      <Sidebar v-if="isAuthenticated" class="sidebar" />
      <main class="main-content" :class="{ 'full-width': !isAuthenticated }">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
import Header from './components/Header.vue';
import Sidebar from './components/Sidebar.vue';

export default {
  name: 'App',
  components: {
    Header,
    Sidebar
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    }
  },
  mounted() {
    // 初始化认证状态
    this.$store.dispatch('initializeAuth');
  }
};
</script>

<style>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-container {
  display: flex;
  flex: 1;
  min-height: calc(100vh - 60px); /* Ajustar según la altura del header */
}

.sidebar {
  flex-shrink: 0;
  z-index: 1000; /* Asegurar que el sidebar esté por debajo de otros elementos si es necesario */
}

.main-content {
  flex: 1;
  padding: 20px;
  transition: margin-left 0.3s ease;
}

.main-content.full-width {
  margin-left: 0;
  width: 100%;
}

/* Ajustar el layout cuando hay sidebar */
.app-container .sidebar + .main-content {
  margin-left: 200px; /* Ancho del sidebar */
}

/* Ajustar para pantallas pequeñas */
@media (max-width: 768px) {
  .app-container {
    flex-direction: column;
  }
  
  .main-content {
    margin-left: 0 !important;
  }
}
</style>