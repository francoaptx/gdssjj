<template>
  <div class="routing-sheet-container">
    <div class="routing-sheet-list">
      <BaseList
        title="Todas las Hojas de Ruta"
        :items="routingSheets"
        :loading="loading"
        :error="error"
        :columns="columns"
        :actions="actions"
        @refresh="fetchRoutingSheets"
        @action="handleAction"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import api from '../services/api';
import BaseList from './BaseList.vue';

const store = useStore();
const user = computed(() => store.getters.user);
const routingSheets = ref([]);
const loading = ref(false);
const error = ref(null);

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

const fetchRoutingSheets = async () => {
  try {
    loading.value = true;
    error.value = null;
    const response = await api.get('/routing-sheets');
    routingSheets.value = response.data;
  } catch (err) {
    console.error('Error fetching routing sheets:', err);
    error.value = 'Error al cargar las hojas de ruta.';
  } finally {
    loading.value = false;
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

onMounted(fetchRoutingSheets);
</script>

<style scoped>
.routing-sheet-container {
  width: 100%;
  height: 100%;
}

.routing-sheet-list {
  padding: 20px;
}

@media (max-width: 768px) {
  .routing-sheet-list {
    padding: 15px;
  }
}
</style>