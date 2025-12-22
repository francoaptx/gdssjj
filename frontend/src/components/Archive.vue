<!-- src/components/Archive.vue -->
<template>
  <div class="archive-container">
    <div class="archive-list">
      <BaseList
        title="Hojas de Ruta Archivadas"
        :items="archivedItems"
        :loading="loading"
        :error="error"
        :columns="columns"
        :actions="actions"
        @refresh="fetchArchivedItems"
        @action="handleAction"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import { useRoutingSheetsStore } from '../store/routingSheets';
import BaseList from './BaseList.vue';

const store = useStore();
const routingSheetsStore = useRoutingSheetsStore();
const user = computed(() => store.getters.user);

// Use data from Pinia store
const archivedItems = computed(() => routingSheetsStore.archivedItems);
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
    class: 'p-button-info p-button-rounded p-button-sm', 
    title: 'Ver detalles' 
  }
];

const fetchArchivedItems = async () => {
  try {
    await routingSheetsStore.fetchArchivedItems();
  } catch (err) {
    console.error('Error fetching archived items:', err);
  }
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('es-ES', options);
};

const handleAction = async ({ action, item }) => {
  if (action === 'view') {
    // Handle view action
    console.log('View item:', item);
  }
};

onMounted(fetchArchivedItems);
</script>

<style scoped>
.archive-container {
  width: 100%;
  height: 100%;
}

.archive-list {
  padding: 20px;
}

@media (max-width: 768px) {
  .archive-list {
    padding: 15px;
  }
}
</style>