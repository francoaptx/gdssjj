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
import { useRoutingSheetsStore } from '../store/routingSheets';
import BaseList from './BaseList.vue';

const store = useStore();
const routingSheetsStore = useRoutingSheetsStore();
const user = computed(() => store.getters.user);

// Use data from Pinia store
const historyItems = computed(() => routingSheetsStore.archivedItems); // Using archived items for history
const loading = computed(() => routingSheetsStore.loading);
const error = computed(() => routingSheetsStore.error);

const columns = [
  { field: 'number', header: 'Nro. Hoja de Ruta', sortable: true },
  { field: 'reference', header: 'Referencia', sortable: true },
  { field: 'sender', header: 'Remitente', type: 'sender', sortable: true },
  { field: 'createdAt', header: 'Fecha de Envío', type: 'date', sortable: true },
  { field: 'priority', header: 'Prioridad', type: 'priority', sortable: true },
  { field: 'status', header: 'Estado', type: 'status', sortable: true }
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

const fetchHistoryItems = async () => {
  try {
    await routingSheetsStore.fetchArchivedItems(); // Using archived items for history
  } catch (err) {
    console.error('Error fetching history items:', err);
  }
};

const handleAction = async ({ action, item }) => {
  if (action === 'view') {
    // Handle view action
    console.log('View item:', item);
  }
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('es-ES', options);
};
</script>

<style scoped>
.history-container {
  width: 100%;
  height: 100%;
}

.history-list {
  padding: 20px;
}

@media (max-width: 768px) {
  .history-list {
    padding: 15px;
  }
}
</style>