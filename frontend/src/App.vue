  <template>
  <div id="app">
    <Header class="fixed-header" />
    <div class="app-container">
      <Sidebar v-if="isAuthenticated" class="fixed-sidebar" />
      <main class="main-content" :class="{ 'full-width': !isAuthenticated, 'with-sidebar': isAuthenticated }">
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
    // Inicializar estado de autenticación
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

.fixed-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  z-index: 1001; /* Mayor que el sidebar */
  flex-shrink: 0;
}

.app-container {
  display: flex;
  flex: 1;
  min-height: calc(100vh - 60px);
  margin-top: 60px; /* Altura del header */
}

.fixed-sidebar {
  flex-shrink: 0;
  z-index: 1000; /* Asegurar que el sidebar esté por debajo del header */
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

.main-content.with-sidebar {
  margin-left: 250px; /* Ancho del sidebar para evitar superposición */
}

/* Ajustar para pantallas pequeñas */
@media (max-width: 768px) {
  .fixed-sidebar {
    position: fixed;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  
  .fixed-sidebar.active {
    transform: translateX(0);
  }
  
  .app-container {
    flex-direction: column;
  }
  
  .main-content {
    margin-left: 0 !important;
  }
}
</style>