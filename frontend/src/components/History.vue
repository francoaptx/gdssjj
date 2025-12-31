<template>
  <div class="history-container">
    <div class="history-list">
      <BaseList
        title="Historial de Hojas de Ruta"
        :items="historyItems"
        :loading="loading"
        :error="error"
        :columns="columns"
        :actions="actions"
        @refresh="fetchHistoryItems"
        @action="handleAction"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import apiClient from '../services/api';
import BaseList from './BaseList.vue';

const store = useStore();
const user = computed(() => store.getters.user);

// Use data from API directly for history
const historyItems = ref([]);
const loading = ref(false);
const error = ref(null);

const fetchHistoryItems = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await apiClient.get('/history/user');
    historyItems.value = response.data;
  } catch (err) {
    console.error('Error fetching history items:', err);
    error.value = err.message || 'Error al cargar el historial';
    historyItems.value = []; // Ensure we have an empty array in case of error
  } finally {
    loading.value = false;
  }
};

const columns = [
  { field: 'routingSheet.number', header: 'Nro. Hoja de Ruta', sortable: true },
  { field: 'routingSheet.reference', header: 'Referencia', sortable: true },
  { field: 'user.name', header: 'Usuario', sortable: true },
  { field: 'timestamp', header: 'Fecha', type: 'date', sortable: true },
  { field: 'action', header: 'Acción', sortable: true }
];

const actions = [
  { 
    name: 'view', 
    icon: 'pi pi-eye', 
    class: 'p-button-info', 
    title: 'Ver detalles',
    severity: 'info'
  }
];

const handleAction = (data) => {
  console.log('Action:', data);
};

// Fetch data when component is mounted
fetchHistoryItems();
</script>

<style scoped>
.history-container {
  width: 100%;
  height: 100%;
}

.history-list {
  padding: 1.5rem;
}

@media (max-width: 768px) {
  .history-list {
    padding: 1rem;
  }
}
</style>