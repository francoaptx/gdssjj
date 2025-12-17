<!-- src/components/Sent.vue -->
<template>
  <div class="sent">
    <h2>Documentos Enviados</h2>
    <p>Lista de hojas de ruta enviadas cuyo estado es pendiente de recepción.</p>
    
    <div class="controls">
      <button @click="fetchSentSheets" class="btn btn-primary" :disabled="loading">
        <span v-if="loading">Cargando...</span>
        <span v-else>Actualizar</span>
      </button>
    </div>
    
    <div v-if="loading" class="loading-state">
      <p>Cargando hojas de ruta enviadas...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <button @click="fetchSentSheets" class="btn btn-primary">Reintentar</button>
    </div>

    <div v-else>
      <table class="table">
        <thead>
          <tr>
            <th>Número</th>
            <th>Destinatario</th>
            <th>Referencia</th>
            <th>Fecha de Envío</th>
            <th>Prioridad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="sentSheets.length === 0">
            <td colspan="6" class="text-center">No tiene hojas de ruta enviadas pendientes de recepción.</td>
          </tr>
          <tr v-for="rs in sentSheets" :key="rs.id">
            <td>{{ rs.number }}</td>
            <td>{{ rs.recipient ? rs.recipient.name : 'N/A' }}</td>
            <td>{{ rs.reference || 'Sin referencia' }}</td>
            <td>{{ formatDate(rs.createdAt) }}</td>
            <td>
              <span :class="['priority-badge', rs.priority ? rs.priority.toLowerCase() : '']">
                {{ getPriorityText(rs.priority) }}
              </span>
            </td>
            <td>
              <router-link :to="`/routing-sheets/${rs.id}`" class="btn btn-info btn-sm">Ver Detalle</router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import apiClient from '../services/api';

export default {
  name: 'Sent',
  setup() {
    const sentSheets = ref([]);
    const loading = ref(true);
    const error = ref(null);

    const fetchSentSheets = async () => {
      loading.value = true;
      error.value = null;
      try {
        // Usar el endpoint que obtiene las hojas enviadas no recibidas
        const sheetsResponse = await apiClient.get(`/routing-sheets/sent/unreceived`);
        
        sentSheets.value = sheetsResponse.data;
      } catch (err) {
        console.error('Error fetching sent routing sheets:', err);
        console.error('Error response:', err.response);
        if (err.response) {
          error.value = `Error ${err.response.status}: ${err.response.statusText}`;
        } else {
          error.value = 'No se pudieron cargar las hojas de ruta enviadas. Intente de nuevo más tarde.';
        }
      } finally {
        loading.value = false;
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

    onMounted(() => {
      fetchSentSheets();
    });

    return {
      sentSheets,
      loading,
      error,
      formatDate,
      getPriorityText,
      fetchSentSheets
    };
  }
};
</script>

<style scoped>
.sent { padding: 20px; }
.sent h2 { margin-top: 0; }
.controls { margin-bottom: 20px; }
.table { width: 100%; border-collapse: collapse; background-color: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
.table th, .table td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
.table th { background-color: #f8f9fa; font-weight: bold; }
.text-center { text-align: center; }
.loading-state, .error-state { text-align: center; padding: 40px; font-size: 1.2rem; color: #6c757d; }
.error-state { color: #dc3545; }
.error-state .btn { margin-top: 10px; }

.priority-badge { padding: 4px 8px; border-radius: 4px; font-size: 0.8em; font-weight: bold; }
.priority-badge.normal { background-color: #d1ecf1; color: #0c5460; }
.priority-badge.urgent { background-color: #f8d7da; color: #721c24; }
.priority-badge.high { background-color: #f8d7da; color: #721c24; }
.priority-badge.low { background-color: #e2e3e5; color: #383d41; }

.btn { display: inline-block; padding: 8px 16px; border-radius: 4px; text-decoration: none; font-weight: bold; cursor: pointer; border: none; margin-right: 5px; }
.btn:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-sm { padding: 4px 8px; font-size: 0.8em; }
.btn-primary { background-color: #007bff; color: white; }
.btn-info { background-color: #17a2b8; color: white; }
</style>