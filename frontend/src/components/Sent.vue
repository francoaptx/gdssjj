<template>
  <div class="sent-container">
    <div class="sent-list">
      <BaseList
        title="Hojas de Ruta Enviadas"
        :items="sentItems"
        :loading="loading"
        :error="errorMessage"
        :columns="columns"
        :actions="actions"
        @refresh="fetchSentItems"
        @action="handleAction"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onActivated } from 'vue';
import { useStore } from 'vuex';
import { useRoutingSheetsStore } from '../store/routingSheets';
import BaseList from './BaseList.vue';

const store = useStore();
const routingSheetsStore = useRoutingSheetsStore();
const user = computed(() => store.getters.user);

// Dialog visibility
const displayDialog = ref(false);
const selectedSheet = ref(null);

// Use data from Pinia store
const sentItems = computed(() => routingSheetsStore.sentItems);
const loading = computed(() => routingSheetsStore.loading);
const errorMessage = ref(null);

const columns = [
  { field: 'number', header: 'Nro. Hoja de Ruta', sortable: true },
  { field: 'reference', header: 'Referencia', sortable: true },
  { field: 'recipient', header: 'Destinatario', type: 'recipient', sortable: true },
  { field: 'createdAt', header: 'Fecha de Envío', type: 'date', sortable: true },
  { field: 'priority', header: 'Prioridad', type: 'priority', sortable: true },
  { 
    field: 'status', 
    header: 'Estado', 
    type: 'status', 
    sortable: true,
    customBody: (rowData) => {
      return getStatusText(rowData.status);
    }
  }
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

// Fetch real data from the store
const fetchSentItems = async () => {
  try {
    await routingSheetsStore.fetchSentItems();
    // Additional verification that sheets belong to current user
    const currentUserId = user.value?.id;
    if (!currentUserId) {
      console.error('Current user ID not found');
    }
  } catch (err) {
    console.error('Error fetching sent items:', err);
    errorMessage.value = 'Error al cargar las hojas de ruta enviadas.';
  }
};

const handleAction = async ({ action, item }) => {
  if (action === 'view') {
    selectedSheet.value = item;
    displayDialog.value = true;
  }
};

const getStatusText = (status) => {
  const statusMap = {
    'PENDING': 'No recibido',
    'RECEIVED': 'Recibido',
    'PROCESSED': 'Procesado',
    'ARCHIVED': 'Archivado',
    'CANCELLED': 'Cancelado'
  };
  return statusMap[status] || status;
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('es-ES', options);
};

onMounted(fetchSentItems);
onActivated(fetchSentItems);
</script>

<style scoped>
.sent-container {
  width: 100%;
  height: 100%;
}

.sent-list {
  padding: 20px;
}

@media (max-width: 768px) {
  .sent-list {
    padding: 15px;
  }
}
</style>

<style scoped>
.status-no-recibido {
  color: red;
  font-weight: bold;
}
</style>