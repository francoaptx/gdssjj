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

    onMounted(fetchStats);

    return {
      stats,
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
</style>