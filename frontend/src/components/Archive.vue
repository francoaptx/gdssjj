<!-- src/components/Archive.vue -->
<template>
  <div class="archive">
    <h2>Bandeja de Archivados</h2>
    <p>Estas son las hojas de ruta que han sido archivadas por usted.</p>
    <table class="table">
      <thead>
        <tr>
          <th>Número</th>
          <th>Remitente</th>
          <th>Referencia</th>
          <th>Carpeta</th>
          <th>Fecha Archivado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="rs in archivedRoutingSheets" :key="rs.id">
          <td>{{ rs.number }}</td>
          <td>{{ rs.sender.name }}</td>
          <td>{{ rs.reference }}</td>
          <td>{{ rs.archivedFolder?.name || 'N/A' }}</td>
          <td>{{ rs.archivedAt ? formatDate(rs.archivedAt) : 'N/A' }}</td>
          <td>
            <button @click="unarchiveRS(rs.id)" class="btn btn-warning">Desarchivar</button>
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
  name: 'Archive',
  setup() {
    const archivedRoutingSheets = ref([]);

    const fetchArchivedRoutingSheets = async () => {
      try {
        // V.2: Obtener hojas de ruta archivadas por el usuario
        const response = await apiClient.get('/routing-sheets/archived');
        archivedRoutingSheets.value = response.data;
      } catch (err) {
        console.error('Error fetching archived routing sheets:', err);
      }
    };

    const unarchiveRS = async (id) => {
        if (!confirm('¿Está seguro de que desea desarchivar esta hoja de ruta? Volverá a la bandeja de pendientes.')) return;
        try {
            await apiClient.put(`/routing-sheets/${id}/unarchive`);
            // Recargar la lista
            fetchArchivedRoutingSheets();
        } catch (err) {
            console.error('Error unarchiving routing sheet:', err);
            alert('Error al desarchivar la hoja de ruta.');
        }
    };

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString();
    };

    onMounted(fetchArchivedRoutingSheets);

    return {
      archivedRoutingSheets,
      unarchiveRS,
      formatDate,
    };
  },
};
</script>

<style scoped>
/* Reutiliza estilos de Reception.vue */
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

.btn-warning { background-color: #ffc107; color: #212529; }
</style>