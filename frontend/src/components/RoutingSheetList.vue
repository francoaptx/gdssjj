<!-- src/components/RoutingSheetList.vue -->
<template>
  <div class="routing-sheet-list">
    <h2>Hojas de Ruta</h2>
    <div class="controls">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Buscar..."
        @input="debouncedSearch"
      />
      <router-link to="/routing-sheets/create" class="btn btn-primary">Crear Nueva</router-link>
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
          <td>{{ rs.reference }}</td>
          <td>{{ rs.sender.name }}</td>
          <td>{{ rs.recipient.name }}</td>
          <td>{{ formatDate(rs.createdAt) }}</td>
          <td>
            <span :class="['status-badge', rs.status.toLowerCase()]">
              {{ getStatusText(rs.status) }}
            </span>
          </td>
          <td>
            <span :class="['priority-badge', rs.priority.toLowerCase()]">
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
        const response = await apiClient.get('/routing-sheets');
        routingSheets.value = response.data;
      } catch (err) {
        console.error('Error fetching routing sheets:', err);
      }
    };

    const searchRoutingSheets = async () => {
      try {
        const response = await apiClient.get(`/routing-sheets/search?query=${encodeURIComponent(searchQuery.value)}`);
        routingSheets.value = response.data;
      } catch (err) {
        console.error('Error searching routing sheets:', err);
      }
    };

    const debouncedSearch = debounce(searchRoutingSheets, 300);

    const formatDate = (dateString) => {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const getStatusText = (status) => {
      const statusMap = {
        'PENDING': 'Pendiente',
        'RECEIVED': 'Recibido',
        'PROCESSED': 'Procesado',
        'ARCHIVED': 'Archivado',
        'CANCELLED': 'Cancelado'
      };
      return statusMap[status] || status;
    };

    const getPriorityText = (priority) => {
      const priorityMap = {
        'NORMAL': 'Normal',
        'URGENT': 'Urgente'
      };
      return priorityMap[priority] || priority;
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

.controls {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.controls input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 300px;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th, .table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

.table th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.text-center {
  text-align: center;
}

.btn {
  padding: 0.25rem 0.5rem;
  text-decoration: none;
  border-radius: 4px;
  cursor: pointer;
  border: none;
  font-size: 0.875rem;
}

.btn-primary { background-color: #007bff; color: white; }
.btn-info { background-color: #17a2b8; color: white; }
.btn-sm { padding: 0.2rem 0.4rem; font-size: 0.75rem; }

.status-badge {
  padding: 0.25em 0.4em;
  font-size: 75%;
  font-weight: 700;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: 0.25rem;
}

.status-badge.pending { background-color: #fff3cd; color: #856404; }
.status-badge.received { background-color: #cce5ff; color: #004085; }
.status-badge.processed { background-color: #d4edda; color: #155724; }
.status-badge.archived { background-color: #d1ecf1; color: #0c5460; }
.status-badge.cancelled { background-color: #f8d7da; color: #721c24; }

.priority-badge {
  padding: 0.25em 0.4em;
  font-size: 75%;
  font-weight: 700;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: 0.25rem;
}

.priority-badge.normal { background-color: #e2e3e5; color: #383d41; }
.priority-badge.urgent { background-color: #f8d7da; color: #721c24; }
</style>