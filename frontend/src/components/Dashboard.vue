<!-- src/components/Dashboard.vue -->
<template>
  <div class="dashboard">
    <h2>Panel de Control</h2>
    <div class="stats-grid">
      <div class="stat-card">
        <h3>{{ stats.inboxCount }}</h3>
        <p>Entrantes</p>
      </div>
      <div class="stat-card">
        <h3>{{ stats.pendingCount }}</h3>
        <p>Pendientes</p>
      </div>
      <div class="stat-card">
        <h3>{{ stats.sentCount }}</h3>
        <p>Enviados</p>
      </div>
      <div class="stat-card">
        <h3>{{ stats.archivedCount }}</h3>
        <p>Archivados</p>
      </div>
      <div class="stat-card">
        <h3>{{ stats.cancelledCount }}</h3>
        <p>Cancelados</p>
      </div>
    </div>
    
    <!-- Tabla de Documentos Enviados (No Recibidos) -->
    <div class="section">
      <h3>Documentos Enviados (No Recibidos)</h3>
      <div class="table-container">
        <table class="data-table" v-if="unreceivedSentSheets.length > 0">
          <thead>
            <tr>
              <th>Número</th>
              <th>Destinatario</th>
              <th>Referencia</th>
              <th>Fecha de Envío</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="sheet in unreceivedSentSheets" :key="sheet.id">
              <td>{{ sheet.number }}</td>
              <td>{{ sheet.recipient.name }}</td>
              <td>{{ sheet.reference }}</td>
              <td>{{ formatDate(sheet.createdAt) }}</td>
              <td><span class="status-pending">No recibido</span></td>
            </tr>
          </tbody>
        </table>
        <div v-else class="no-data">
          <p>No hay documentos enviados pendientes de recepción</p>
        </div>
      </div>
    </div>
    
    <!-- Tabla de Historial -->
    <div class="section">
      <h3>Historial de Documentos</h3>
      <div class="table-container">
        <table class="data-table" v-if="receivedSentSheets.length > 0">
          <thead>
            <tr>
              <th>Número</th>
              <th>Destinatario</th>
              <th>Referencia</th>
              <th>Fecha de Envío</th>
              <th>Fecha de Recepción</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="sheet in receivedSentSheets" :key="sheet.id">
              <td>{{ sheet.number }}</td>
              <td>{{ sheet.recipient.name }}</td>
              <td>{{ sheet.reference }}</td>
              <td>{{ formatDate(sheet.createdAt) }}</td>
              <td>{{ sheet.receivedAt ? formatDate(sheet.receivedAt) : 'N/A' }}</td>
              <td><span class="status-received">Recibido</span></td>
            </tr>
          </tbody>
        </table>
        <div v-else class="no-data">
          <p>No hay documentos recibidos en el historial</p>
        </div>
      </div>
    </div>
    
    <!-- Gráfica de documentos generados -->
    <div class="chart-container">
      <h3>Gráfica de Documentos Generados</h3>
      <p>(Aquí se integraría una librería como Chart.js)</p>
      <!-- Ejemplo simple -->
      <div class="simple-chart">
        <div class="bar" style="height: 60%;">60%</div>
        <div class="bar" style="height: 40%;">40%</div>
        <div class="bar" style="height: 80%;">80%</div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import apiClient from '../services/api';

export default {
  name: 'Dashboard',
  setup() {
    const stats = ref({
      inboxCount: 0,
      pendingCount: 0,
      sentCount: 0,
      archivedCount: 0,
      cancelledCount: 0,
    });
    
    const unreceivedSentSheets = ref([]);
    const receivedSentSheets = ref([]);

    const fetchStats = async () => {
      try {
        // I.3: Estadísticas del Dashboard
        // Para simplificar, obtenemos conteos de diferentes endpoints
        const [
          inboxResponse,
          pendingResponse,
          sentResponse,
          archivedResponse,
          cancelledResponse,
        ] = await Promise.allSettled([
          apiClient.get('/routing-sheets/received'), // IV.1.1
          apiClient.get('/routing-sheets/pending'), // IV.1.2
          apiClient.get('/routing-sheets/sent'),    // V.1
          apiClient.get('/routing-sheets/archived'), // V.2
          apiClient.get('/routing-sheets'), // Filtrar por status CANCELLED, se requiere endpoint o filtro
        ]);

        stats.value.inboxCount = inboxResponse.status === 'fulfilled' ? inboxResponse.value.data.length : 0;
        stats.value.pendingCount = pendingResponse.status === 'fulfilled' ? pendingResponse.value.data.length : 0;
        stats.value.sentCount = sentResponse.status === 'fulfilled' ? sentResponse.value.data.length : 0;
        stats.value.archivedCount = archivedResponse.status === 'fulfilled' ? archivedResponse.value.data.length : 0;
        // Para cancelled, se podría hacer un GET a /routing-sheets y filtrar client-side o tener un endpoint /cancelled
        // Por ahora, asumimos 0 o se puede hacer una llamada específica si el backend lo soporta.
        stats.value.cancelledCount = 0; // Placeholder

      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      }
    };
    
    const fetchUnreceivedSentSheets = async () => {
      try {
        const response = await apiClient.get('/routing-sheets/sent/unreceived');
        unreceivedSentSheets.value = response.data;
      } catch (err) {
        console.error('Error fetching unreceived sent sheets:', err);
      }
    };
    
    const fetchReceivedSentSheets = async () => {
      try {
        // For now, we'll get all sent sheets and filter for received ones
        const response = await apiClient.get('/routing-sheets/sent');
        receivedSentSheets.value = response.data.filter(sheet => sheet.status === 'RECEIVED');
      } catch (err) {
        console.error('Error fetching received sent sheets:', err);
      }
    };

    const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleDateString();
    };

    const fetchData = async () => {
      await Promise.all([
        fetchStats(),
        fetchUnreceivedSentSheets(),
        fetchReceivedSentSheets()
      ]);
    };

    onMounted(fetchData);

    return {
      stats,
      unreceivedSentSheets,
      receivedSentSheets,
      formatDate
    };
  },
};
</script>

<style scoped>
.dashboard h2 {
  margin-bottom: 1.5rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  margin-bottom: 2rem;
}

.stat-card {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 1rem;
  text-align: center;
}

.stat-card h3 {
  margin: 0;
  font-size: 2rem;
  color: #007bff;
}

.chart-container {
  background: white;
  padding: 1rem;
  border: 1px solid #dee2e6;
  border-radius: 4px;
}

.simple-chart {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 200px;
  margin-top: 1rem;
}

.bar {
  width: 50px;
  background: #007bff;
  border: 1px solid #0056b3;
}

.section {
  margin: 2rem 0;
}

.section h3 {
  margin-bottom: 1rem;
  color: #333;
  border-bottom: 2px solid #eee;
  padding-bottom: 0.5rem;
}

.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.data-table th,
.data-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.data-table th {
  background-color: #f8f9fa;
  font-weight: bold;
}

.no-data {
  text-align: center;
  padding: 2rem;
  color: #6c757d;
}

.status-pending {
  background-color: #fff3cd;
  color: #856404;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8em;
  font-weight: bold;
}

.status-received {
  background-color: #d1ecf1;
  color: #0c5460;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8em;
  font-weight: bold;
}
</style>