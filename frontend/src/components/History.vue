<!-- src/components/History.vue -->
<template>
  <div class="history">
    <h2>Bandeja de Historial</h2>
    <p>Historial de hojas de ruta que ha enviado y que ya han sido recibidas.</p>
    <table class="table">
      <thead>
        <tr>
          <th>Número</th>
          <th>Destinatario</th>
          <th>Referencia</th>
          <th>Estado Actual</th>
          <th>Fecha Envío</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="rs in sentRoutingSheets" :key="rs.id">
          <td>{{ rs.number }}</td>
          <td>{{ rs.recipient.name }}</td>
          <td>{{ rs.reference }}</td>
          <td><span :class="`status status-${rs.status.toLowerCase()}`">{{ rs.status }}</span></td>
          <td>{{ formatDate(rs.createdAt) }}</td>
          <td>
            <router-link :to="`/history/detail/${rs.id}`" class="btn btn-sm btn-info">Detalles</router-link>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import apiClient from '../services/api';

export default {
  name: 'History',
  setup() {
    const sentRoutingSheets = ref([]);

    const fetchSentRoutingSheets = async () => {
      try {
        // V.2: Obtener hojas de ruta enviadas y ya recibidas
        // El backend debe filtrar por sender.id = userId y status != PENDING
        const response = await apiClient.get('/routing-sheets/history'); // Endpoint tentativo
        sentRoutingSheets.value = response.data;
      } catch (err) {
        console.error('Error fetching sent routing sheets history:', err);
        // Si no hay endpoint específico, podríamos usar /routing-sheets y filtrar client-side
        // por ejemplo, filtrando por miembro del store `user.id` y estado != PENDING
      }
    };

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString();
    };

    onMounted(fetchSentRoutingSheets);

    return {
      sentRoutingSheets,
      formatDate,
    };
  },
};
</script>

<style scoped>
/* Reutiliza estilos de RoutingSheetList.vue */
.table {
  width: 100%;
  border-collapse: collapse;
}

.table th, .table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.table th {
  background-color: #f2f2f2;
}

.btn {
  padding: 0.25rem 0.5rem;
  margin-right: 0.25rem;
  text-decoration: none;
  border-radius: 4px;
  cursor: pointer;
  border: none;
  font-size: 0.875rem;
}

.btn-info { background-color: #17a2b8; color: white; }

.status {
  padding: 0.25em 0.4em;
  border-radius: 0.25rem;
  font-size: 0.75em;
  font-weight: 700;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
}

.status-pending { background-color: #ffc107; color: #212529; }
.status-received { background-color: #17a2b8; color: white; }
.status-archived { background-color: #6f42c1; color: white; }
.status-cancelled { background-color: #6c757d; color: white; }
</style>