<!-- src/components/RoutingSheetDetail.vue -->
<template>
  <div class="routing-sheet-detail">
    <h2>Detalle de Hoja de Ruta: {{ routingSheet?.number }}</h2>
    <div v-if="routingSheet">
      <div class="detail-section">
        <h3>Datos Generales</h3>
        <p><strong>Remitente:</strong> {{ routingSheet.sender.name }}</p>
        <p><strong>Destinatario:</strong> {{ routingSheet.recipient.name }}</p>
        <p><strong>Referencia:</strong> {{ routingSheet.reference }}</p>
        <p><strong>Proveído:</strong> {{ routingSheet.provision }}</p>
        <p><strong>Nº de Hojas:</strong> {{ routingSheet.numberOfPages || 'N/A' }}</p>
        <p><strong>Nº de Anexos:</strong> {{ routingSheet.numberOfAttachments || 'N/A' }}</p>
        <p><strong>Estado:</strong> <span :class="`status status-${routingSheet.status.toLowerCase()}`">{{ routingSheet.status }}</span></p>
        <p><strong>Fecha Creación:</strong> {{ formatDate(routingSheet.createdAt) }}</p>
        <p><strong>Fecha Recepción:</strong> {{ routingSheet.receivedAt ? formatDate(routingSheet.receivedAt) : 'N/A' }}</p>
        <p><strong>Fecha Procesamiento:</strong> {{ routingSheet.processedAt ? formatDate(routingSheet.processedAt) : 'N/A' }}</p>
        <p><strong>Fecha Archivado:</strong> {{ routingSheet.archivedAt ? formatDate(routingSheet.archivedAt) : 'N/A' }}</p>
        <p><strong>Fecha Cancelación:</strong> {{ routingSheet.cancelledAt ? formatDate(routingSheet.cancelledAt) : 'N/A' }}</p>
        <p><strong>Carpeta de Archivo:</strong> {{ routingSheet.archivedFolder?.name || 'N/A' }}</p>
        <p><strong>Tiene Cite:</strong> {{ routingSheet.hasCite ? 'Sí' : 'No' }}</p>
        <p v-if="routingSheet.cite"><strong>Cite Asociado:</strong> {{ routingSheet.cite.number }} - {{ routingSheet.cite.reference }}</p>
      </div>

      

      <div class="detail-section">
        <h3>Copias Enviadas</h3>
        <ul v-if="routingSheet.copies && routingSheet.copies.length > 0">
          <li v-for="copy in routingSheet.copies" :key="copy.id">
            {{ copy.recipient.name }} - {{ copy.provision }}
          </li>
        </ul>
        <p v-else>No se enviaron copias.</p>
      </div>

      <div class="detail-section">
        <h3>Hojas Agrupadas (IV.3.1)</h3>
        <ul v-if="routingSheet.groupedAsMain && routingSheet.groupedAsMain.length > 0">
          <li v-for="groupedRs in routingSheet.groupedAsMain" :key="groupedRs.id">
            {{ groupedRs.number }} - {{ groupedRs.reference }}
          </li>
        </ul>
        <p v-else>Esta hoja de ruta no agrupa a otras.</p>
        <p v-if="routingSheet.groupedAsSecondary && routingSheet.groupedAsSecondary.length > 0">
          Esta hoja de ruta está agrupada bajo: {{ routingSheet.groupedAsSecondary[0].mainRoutingSheet.number }}
        </p>
      </div>

      <div class="detail-section">
        <h3>Historial de Acciones (V.3)</h3>
        <table class="table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Acción</th>
              <th>Detalles</th>
              <th>Fecha/Hora</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="entry in routingSheet.history" :key="entry.id">
              <td>{{ entry.user.name }}</td>
              <td>{{ entry.action }}</td>
              <td>{{ entry.details || 'N/A' }}</td>
              <td>{{ formatDate(entry.timestamp) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="detail-section">
        <h3>Opciones de Impresión</h3>
        <!-- II.1.4: Impresión de Hoja de Ruta -->
        <button @click="printRoutingSheet" class="btn btn-primary">Imprimir Hoja de Ruta</button>
        <!-- IV.3.2: Generación de Carátula de Agrupación -->
        <button v-if="routingSheet.groupedAsMain && routingSheet.groupedAsMain.length > 0" @click="printGroupCover" class="btn btn-info">Imprimir Carátula de Agrupación (IV.3.2)</button>
        <!-- II.2.3: Impresión de Reverso -->
        <button v-if="routingSheet.copies && routingSheet.copies.length > 0" @click="printReverso" class="btn btn-secondary">Imprimir Reverso (II.2.3)</button>
      </div>
    </div>
    <div v-else>
      <p>Cargando...</p>
    </div>
  </div>
  
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import apiClient from '../services/api';

export default {
  name: 'RoutingSheetDetail',
  setup() {
    const route = useRoute();
    const id = route.params.id;
    const routingSheet = ref(null);

    const fetchRoutingSheet = async () => {
      try {
        const response = await apiClient.get(`/routing-sheets/${id}`);
        routingSheet.value = response.data;
      } catch (err) {
        console.error('Error fetching routing sheet detail:', err);
      }
    };

    const printRoutingSheet = () => {
      // II.1.4: Abrir el PDF generado por el backend en una nueva pestaña
      window.open(`/api/reports/routing-sheet/${id}/pdf`, '_blank');
    };

    const printGroupCover = () => {
      // IV.3.2: Abrir el PDF de la carátula generado por el backend en una nueva pestaña
      // Asumiendo que el ID de la hoja principal es el mismo que el ID de la hoja actual si es principal
      const mainId = routingSheet.value.id; // En la entidad, si es principal, su id es el del grupo
      window.open(`/api/reports/group-cover/${mainId}/pdf`, '_blank');
    };

    const printReverso = () => {
      // II.2.3: Abrir el PDF del reverso generado por el backend en una nueva pestaña
      window.open(`/api/reports/reverso/${id}/pdf`, '_blank');
    };

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleString(); // Fecha y hora
    };

    onMounted(fetchRoutingSheet);

    return {
      routingSheet,
      printRoutingSheet,
      printGroupCover,
      printReverso,
      formatDate,
    };
  },
};
</script>

<style scoped>
.detail-section {
  margin-bottom: 2rem;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.detail-section h3 {
  margin-top: 0;
}

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
</style>