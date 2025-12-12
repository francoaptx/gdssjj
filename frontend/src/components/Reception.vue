<!-- src/components/Reception.vue -->
<template>
  <div class="reception">
    <h2>Bandeja de Entrantes</h2>
    <p>Estas son las hojas de ruta que han sido enviadas a usted y están pendientes de recepción.</p>
    <table class="table">
      <thead>
        <tr>
          <th>Número</th>
          <th>Remitente</th>
          <th>Referencia</th>
          <th>Fecha Envío</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="rs in receivedRoutingSheets" :key="rs.id">
          <td>{{ rs.number }}</td>
          <td>{{ rs.sender.name }}</td>
          <td>{{ rs.reference }}</td>
          <td>{{ formatDate(rs.createdAt) }}</td>
          <td>
            <button @click="receiveRS(rs.id)" class="btn btn-success">Recibir</button>
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
  name: 'Reception',
  setup() {
    const receivedRoutingSheets = ref([]);

    const fetchReceivedRoutingSheets = async () => {
      try {
        // IV.1.1: Obtener hojas de ruta recibidas (pendientes de recepción)
        const response = await apiClient.get('/routing-sheets/received'); // Este endpoint filtra por status PENDING y destinatario actual
        receivedRoutingSheets.value = response.data;
      } catch (err) {
        console.error('Error fetching received routing sheets:', err);
      }
    };

    const receiveRS = async (id) => {
        try {
            await apiClient.put(`/routing-sheets/${id}/receive`);
            // Recargar la lista
            fetchReceivedRoutingSheets();
        } catch (err) {
            console.error('Error receiving routing sheet:', err);
            alert('Error al recibir la hoja de ruta.');
        }
    };

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString();
    };

    onMounted(fetchReceivedRoutingSheets);

    return {
      receivedRoutingSheets,
      receiveRS,
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

.btn-success { background-color: #28a745; color: white; }
</style>