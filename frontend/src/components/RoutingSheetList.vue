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
          <th>Remitente</th>
          <th>Destinatario</th>
          <th>Referencia</th>
          <th>Estado</th>
          <th>Fecha Creación</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="rs in routingSheets" :key="rs.id">
          <td>{{ rs.number }}</td>
          <td>{{ rs.sender.name }}</td>
          <td>{{ rs.recipient.name }}</td>
          <td>{{ rs.reference }}</td>
          <td><span :class="`status status-${rs.status.toLowerCase()}`">{{ rs.status }}</span></td>
          <td>{{ formatDate(rs.createdAt) }}</td>
          <td>
            <router-link :to="`/routing-sheets/${rs.id}`" class="btn btn-sm btn-secondary">Ver</router-link>
            <button v-if="rs.status === 'PENDING' && rs.sender.id === userId" @click="cancelRS(rs.id)" class="btn btn-sm btn-danger">Cancelar</button>
            <button v-if="rs.status === 'PENDING' && rs.recipient.id === userId" @click="receiveRS(rs.id)" class="btn btn-sm btn-success">Recibir</button>
            <button v-if="rs.groupedAsMain && rs.groupedAsMain.length > 0" @click="ungroupRS(rs.id)" class="btn btn-sm btn-warning">Desagrupar (IV.3.3)</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import { debounce } from 'lodash-es';
import apiClient from '../services/api';

export default {
  name: 'RoutingSheetList',
  setup() {
    const routingSheets = ref([]);
    const searchQuery = ref('');
    const store = useStore();

    const userId = computed(() => store.state.user?.id);

    const fetchRoutingSheets = async (query = '') => {
      try {
        let url = '/routing-sheets';
        if (query) {
          url = `/routing-sheets/search?q=${encodeURIComponent(query)}`;
        }
        const response = await apiClient.get(url);
        routingSheets.value = response.data;
      } catch (err) {
        console.error('Error fetching routing sheets:', err);
      }
    };

    const debouncedSearch = debounce(() => {
      fetchRoutingSheets(searchQuery.value);
    }, 300);

    const receiveRS = async (id) => {
        try {
            await apiClient.put(`/routing-sheets/${id}/receive`);
            fetchRoutingSheets(searchQuery.value); // Recargar la lista
        } catch (err) {
            console.error('Error receiving routing sheet:', err);
            alert('Error al recibir la hoja de ruta.');
        }
    };

    const cancelRS = async (id) => {
        if (!confirm('¿Está seguro de que desea cancelar esta hoja de ruta?')) return;
        try {
            await apiClient.put(`/routing-sheets/${id}/cancel`);
            fetchRoutingSheets(searchQuery.value); // Recargar la lista
        } catch (err) {
            console.error('Error cancelling routing sheet:', err);
            alert('Error al cancelar la hoja de ruta.');
        }
    };

    const ungroupRS = async (id) => {
        if (!confirm('¿Está seguro de que desea desagrupar esta hoja de ruta? Se desagruparán todas las hojas asociadas a esta principal.')) return;
        try {
            await apiClient.delete(`/groups/${id}`); // IV.3.3: Desagrupación general
            alert('Hojas de ruta desagrupadas exitosamente.');
            fetchRoutingSheets(searchQuery.value); // Recargar la lista
        } catch (err) {
            console.error('Error ungrouping routing sheet:', err);
            alert('Error al desagrupar la hoja de ruta.');
        }
    };

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString();
    };

    onMounted(() => {
      fetchRoutingSheets();
    });

    return {
      routingSheets,
      searchQuery,
      debouncedSearch,
      receiveRS,
      cancelRS,
      ungroupRS, // Nuevo
      formatDate,
      userId,
    };
  },
};
</script>

<style scoped>
.controls {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

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

.btn-primary { background-color: #007bff; color: white; }
.btn-secondary { background-color: #6c757d; color: white; }
.btn-danger { background-color: #dc3545; color: white; }
.btn-success { background-color: #28a745; color: white; }

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