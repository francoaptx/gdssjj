<!-- src/components/RoutingSheetList.vue -->
<template>
  <div class="routing-sheet-list">
    <div class="header">
      <h2>Hojas de Ruta</h2>
      <router-link to="/routing-sheets/create" class="btn btn-primary">Crear Nueva</router-link>
    </div>
    <div class="controls">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Buscar..."
        @input="debouncedSearch"
      />
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>Número</th>
          <th>Referencia</th>
          <th>Remitente</th>
          <th>Destinatario</th>
          <th>Fecha</th>
          <th>Estado</th>
          <th>Prioridad</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="rs in routingSheets" :key="rs.id">
          <td>{{ rs.number }}</td>
          <td>{{ rs.reference || 'Sin referencia' }}</td>
          <td>{{ rs.sender ? rs.sender.name : 'N/A' }}</td>
          <td>{{ rs.recipient ? rs.recipient.name : 'N/A' }}</td>
          <td>{{ formatDate(rs.createdAt) }}</td>
          <td>
            <span :class="['status-badge', rs.status.toLowerCase()]">
              {{ getStatusText(rs.status) }}
            </span>
          </td>
          <td>
            <span :class="['priority-badge', rs.priority ? rs.priority.toLowerCase() : '']">
              {{ getPriorityText(rs.priority) }}
            </span>
          </td>
          <td>
            <router-link :to="`/routing-sheets/${rs.id}`" class="btn btn-sm btn-info">Ver</router-link>
          </td>
        </tr>
        <tr v-if="routingSheets.length === 0">
          <td colspan="8" class="text-center">No se encontraron hojas de ruta</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import apiClient from '../services/api';

export default {
  name: 'RoutingSheetList',
  setup() {
    const routingSheets = ref([]);
    const searchQuery = ref('');

    const fetchRoutingSheets = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        const response = await apiClient.get('/routing-sheets', config);
        routingSheets.value = response.data;
      } catch (err) {
        console.error('Error fetching routing sheets:', err);
      }
    };

    const searchRoutingSheets = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        const response = await apiClient.get(`/routing-sheets/search?query=${encodeURIComponent(searchQuery.value)}`, config);
        routingSheets.value = response.data;
      } catch (err) {
        console.error('Error searching routing sheets:', err);
      }
    };

    const debouncedSearch = debounce(searchRoutingSheets, 300);

    const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const getStatusText = (status) => {
      const statusMap = {
        'PENDING': 'Enviado',
        'RECEIVED': 'Recibido',
        'PROCESSED': 'Procesado',
        'ARCHIVED': 'Archivado',
        'CANCELLED': 'Cancelado'
      };
      return statusMap[status] || status;
    };

    const getPriorityText = (priority) => {
      if (!priority) return 'N/A';
      switch (priority) {
        case 'HIGH': return 'Alta';
        case 'NORMAL': return 'Normal';
        case 'LOW': return 'Baja';
        default: return priority;
      }
    };

    // Función de utilidad para debounce
    function debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    }

    onMounted(fetchRoutingSheets);

    return {
      routingSheets,
      searchQuery,
      debouncedSearch,
      formatDate,
      getStatusText,
      getPriorityText
    };
  }
};
</script>

<style scoped>
.routing-sheet-list {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h2 {
  margin: 0;
}

.controls {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.controls input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 300px;
}

.table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.table th,
.table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.table th {
  background-color: #f8f9fa;
  font-weight: bold;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8em;
  font-weight: bold;
}

.status-badge.pending { background-color: #ffc107; color: #212529; }
.status-badge.received { background-color: #cce5ff; color: #004085; }
.status-badge.processed { background-color: #d4edda; color: #155724; }
.status-badge.archived { background-color: #d1ecf1; color: #0c5460; }
.status-badge.cancelled { background-color: #f8d7da; color: #721c24; }

.priority-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8em;
  font-weight: bold;
}

.priority-badge.normal { background-color: #d1ecf1; color: #0c5460; }
.priority-badge.urgent { background-color: #f8d7da; color: #721c24; }

.text-center {
  text-align: center;
}

.btn {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
  cursor: pointer;
  border: none;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-info {
  background-color: #17a2b8;
  color: white;
}

.btn-sm {
  padding: 4px 8px;
  font-size: 0.8em;
}
</style>