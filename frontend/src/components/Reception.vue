<template>
  <div class="reception-container">
    <div class="reception-list unified-page">
      <BaseList
        title="Bandeja de Recepción"
        :items="incomingSheets"
        :loading="loading"
        :error="error"
        :columns="columns"
        :actions="actions"
        @refresh="fetchIncomingSheets"
        @action="handleAction"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import { useRoutingSheetsStore } from '../store/routingSheets';
import apiClient from '../services/api';
import BaseList from './BaseList.vue';

const store = useStore();
const routingSheetsStore = useRoutingSheetsStore();
const user = computed(() => store.getters.user);

// Use data from Pinia store
const incomingSheets = computed(() => routingSheetsStore.receivedItems);
const loading = computed(() => routingSheetsStore.loading);
const error = computed(() => routingSheetsStore.error);

const columns = [
  { field: 'number', header: 'Nro. Hoja de Ruta', sortable: true },
  { field: 'reference', header: 'Referencia', sortable: true },
  { field: 'sender', header: 'Remitente', type: 'sender', sortable: true },
  { field: 'createdAt', header: 'Fecha de Envío', type: 'date', sortable: true },
  { field: 'priority', header: 'Prioridad', type: 'priority', sortable: true }
];

const actions = [
  { 
    name: 'receive', 
    icon: 'pi pi-check', 
    class: 'p-button-success', 
    title: 'Recibir',
    severity: 'success'
  }
];

const fetchIncomingSheets = async () => {
  try {
    await routingSheetsStore.fetchReceivedItems();
  } catch (err) {
    console.error('Error fetching incoming routing sheets:', err);
    // Asegurarse de que la UI no se rompa incluso si hay un error
    // El store ya maneja el error y establece una lista vacía
  }
};

const handleAction = async ({ action, item }) => {
  if (action === 'receive') {
    await receiveSheet(item.id);
  }
};

const receiveSheet = async (sheetId) => {
  if (!confirm('¿Está seguro de que desea marcar esta hoja de ruta como recibida?\nLa hoja de ruta aparecerá en la sección "Pendientes" para su procesamiento.')) {
    return;
  }
  try {
    // Utilizar el método y endpoint correctos (PATCH) para recibir la hoja de ruta
    await apiClient.patch(`/routing-sheets/${sheetId}/receive`);
    
    // Reload the list using existing API integration
    await fetchIncomingSheets();
    
    // Show success message
    alert('Hoja de ruta recibida exitosamente.\nAhora puede encontrarla en la sección "Pendientes" para procesarla.');
  } catch (err) {
    console.error('Error receiving sheet:', err);
    if (err.response) {
      console.error('Response data:', err.response.data);
      console.error('Response status:', err.response.status);
      console.error('Response headers:', err.response.headers);
      alert(`Error ${err.response.status}: ${err.response.statusText}`);
    } else {
      alert('Hubo un error al intentar recibir la hoja de ruta.');
    }
  }
};

onMounted(fetchIncomingSheets);
</script>

<style scoped>
.reception-container {
  width: 100%;
  height: 100%;
}

.reception-list {
  padding: 1.5rem;
}

@media (max-width: 768px) {
  .reception-list {
    padding: 1rem;
  }
}
</style>