<template>
  <div id="app">
    <Header />
    <div class="app-container">
      <Sidebar v-if="isAuthenticated" />
      <main class="main-content" :class="{ 'full-width': !isAuthenticated }">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import Header from './components/Header.vue';
import Sidebar from './components/Sidebar.vue';

export default {
  name: 'App',
  components: {
    Header,
    Sidebar
  },
  setup() {
    const store = useStore();
    const isAuthenticated = computed(() => store.getters.isAuthenticated);
    
    return {
      isAuthenticated
    };
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
}

.app-container {
  display: flex;
  min-height: calc(100vh - 60px);
}

.main-content {
  flex: 1;
  padding: 20px;
}

.main-content.full-width {
  width: 100%;
}

.authenticated .main-content {
  flex: 1;
  padding: 20px;
}
</style>