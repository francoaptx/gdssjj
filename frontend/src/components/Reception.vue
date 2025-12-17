<!-- src/components/Reception.vue -->
<template>
  <div class="reception-list">
    <div class="header">
      <h2>Bandeja de Recepción</h2>
    </div>

    <div v-if="loading" class="loading-state">
      <p>Cargando hojas de ruta entrantes...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
    </div>

    <div v-else>
      <table class="table">
        <thead>
          <tr>
            <th>Número</th>
            <th>Referencia</th>
            <th>Remitente</th>
            <th>Fecha de Envío</th>
            <th>Prioridad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="incomingSheets.length === 0">
            <td colspan="6" class="text-center">No tiene hojas de ruta pendientes de recepción.</td>
          </tr>
          <tr v-for="rs in incomingSheets" :key="rs.id">
            <td>{{ rs.number }}</td>
            <td>{{ rs.reference || 'Sin referencia' }}</td>
            <td>{{ rs.sender ? rs.sender.name : 'N/A' }}</td>
            <td>{{ formatDate(rs.createdAt) }}</td>
            <td>
              <span :class="['priority-badge', rs.priority ? rs.priority.toLowerCase() : '']">
                {{ getPriorityText(rs.priority) }}
              </span>
            </td>
            <td>
              <button @click="receiveSheet(rs.id)" class="btn btn-success btn-sm">Recibir</button>
              <router-link :to="`/routing-sheets/${rs.id}`" class="btn btn-info btn-sm">Ver Detalle</router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed, watch } from 'vue';
import { useStore } from 'vuex';
import apiClient from '../services/api';

export default {
  name: 'Reception',
  setup() {
    const store = useStore();
    const incomingSheets = ref([]);
    const loading = ref(true);
    const error = ref(null);
    const user = computed(() => store.getters.user);

    const fetchIncomingSheets = async () => {
      loading.value = true;
      error.value = null;
      try {
        const currentUserId = user.value?.id;

        if (!currentUserId || isNaN(currentUserId)) {
          throw new Error('No se pudo obtener el ID del usuario actual.');
        }

        // Usar el endpoint que obtiene las hojas pendientes para el usuario autenticado
        const sheetsResponse = await apiClient.get(`/routing-sheets/pending`);
        
        // Los datos ya están filtrados por el backend
        incomingSheets.value = sheetsResponse.data;

      } catch (err) {
        console.error('Error fetching incoming routing sheets:', err);
        error.value = 'No se pudieron cargar las hojas de ruta. Intente de nuevo más tarde.';
      } finally {
        loading.value = false;
      }
    };

    const receiveSheet = async (sheetId) => {
      if (!confirm('¿Está seguro de que desea marcar esta hoja de ruta como recibida?')) {
        return;
      }
      try {
        // Utilizar el método y endpoint correctos (PATCH) para recibir la hoja de ruta
        await apiClient.patch(`/routing-sheets/${sheetId}/receive`);
        
        // Eliminar la hoja de ruta de la lista local para actualizar la UI
        incomingSheets.value = incomingSheets.value.filter(sheet => sheet.id !== sheetId);
        
        alert('Hoja de ruta recibida exitosamente.');
      } catch (err) {
        console.error('Error receiving sheet:', err);
        alert('Hubo un error al intentar recibir la hoja de ruta.');
      }
    };

    const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    const getPriorityText = (priority) => {
      const priorityMap = {
        'HIGH': 'Alta',
        'NORMAL': 'Normal',
        'LOW': 'Baja',
        'URGENT': 'Urgente'
      };
      return priorityMap[priority] || priority;
    };

    // Observar el ID del usuario. La función solo se ejecutará cuando el ID sea un número válido.
    watch(() => user.value?.id, (newId) => {
      if (newId && !isNaN(newId)) {
        fetchIncomingSheets();
      }
    }, { immediate: true }); // 'immediate: true' asegura que se ejecute al cargar el componente si el ID ya está disponible.


    return {
      incomingSheets,
      loading,
      error,
      formatDate,
      getPriorityText,
      receiveSheet,
    };
  }
};
</script>

<style scoped>
/* Estilos similares a RoutingSheetList para consistencia */
.reception-list { padding: 20px; }
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.header h2 { margin: 0; }
.table { width: 100%; border-collapse: collapse; background-color: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
.table th, .table td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
.table th { background-color: #f8f9fa; font-weight: bold; }
.text-center { text-align: center; }
.loading-state, .error-state { text-align: center; padding: 40px; font-size: 1.2rem; color: #6c757d; }
.error-state { color: #dc3545; }

.priority-badge { padding: 4px 8px; border-radius: 4px; font-size: 0.8em; font-weight: bold; }
.priority-badge.normal { background-color: #d1ecf1; color: #0c5460; }
.priority-badge.urgent { background-color: #f8d7da; color: #721c24; }
.priority-badge.high { background-color: #f8d7da; color: #721c24; }
.priority-badge.low { background-color: #e2e3e5; color: #383d41; }

.btn { display: inline-block; padding: 8px 16px; border-radius: 4px; text-decoration: none; font-weight: bold; cursor: pointer; border: none; margin-right: 5px; }
.btn-sm { padding: 4px 8px; font-size: 0.8em; }
.btn-success { background-color: #28a745; color: white; }
.btn-info { background-color: #17a2b8; color: white; }
</style>