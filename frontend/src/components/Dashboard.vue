<template>
  <div class="dashboard">
    <div class="header">
      <h1>Panel de Control</h1>
      <p>Bienvenido, {{ currentUser.name }}</p>
    </div>
    
    <div class="stats-grid">
      <div class="stat-card" v-for="(value, key) in stats" :key="key">
        <div class="stat-content">
          <i :class="`${getStatIcon(key)} stat-icon`"></i>
          <div class="stat-info">
            <h3>{{ value }}</h3>
            <p>{{ getStatLabel(key) }}</p>
          </div>
        </div>
      </div>
    </div>
    
    <div class="dashboard-content">
      <div class="dashboard-card">
        <div class="card-header">
          <h2>Documentos Enviados (No Recibidos)</h2>
        </div>
        <div class="card-body">
          <div v-if="loadingUnreceived" class="loading-container">
            <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
          </div>
          <div v-else-if="unreceivedSentSheets.length === 0" class="no-data">
            <p>No hay documentos enviados pendientes de recepción</p>
          </div>
          <div v-else class="table-container">
            <table class="data-table">
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
                  <td><span class="status-badge pending">No recibido</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <div class="dashboard-card">
        <div class="card-header">
          <h2>Historial de Documentos</h2>
        </div>
        <div class="card-body">
          <div v-if="loadingReceived" class="loading-container">
            <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
          </div>
          <div v-else-if="receivedSentSheets.length === 0" class="no-data">
            <p>No hay documentos recibidos en el historial</p>
          </div>
          <div v-else class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Número</th>
                  <th>Destinatario</th>
                  <th>Referencia</th>
                  <th>Fecha de Envío</th>
                  <th>Fecha de Recepción</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="sheet in receivedSentSheets" :key="sheet.id">
                  <td>{{ sheet.number }}</td>
                  <td>{{ sheet.recipient.name }}</td>
                  <td>{{ sheet.reference }}</td>
                  <td>{{ formatDate(sheet.createdAt) }}</td>
                  <td>{{ formatDate(sheet.receivedAt) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import apiClient from '../services/api';

export default {
  name: 'Dashboard',
  setup() {
    const store = useStore();
    const currentUser = computed(() => store.getters.user);
    
    const stats = ref({});
    
    const unreceivedSentSheets = ref([]);
    const receivedSentSheets = ref([]);
    
    const loadingUnreceived = ref(true);
    const loadingReceived = ref(true);
    
    // Función para manejar las solicitudes con timeout
    const fetchWithTimeout = async (url, timeout = 5000) => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        const response = await apiClient.get(url, {
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        return response;
      } catch (error) {
        if (error.code === 'ERR_CANCELED' || error.name === 'AbortError') {
          console.warn(`Request to ${url} timed out`);
        } else {
          console.warn(`Request to ${url} failed:`, error.message);
        }
        return { data: [] };
      }
    };
    
    const fetchStats = async () => {
      try {
        // Intentar solo las solicitudes que probablemente funcionen con manejo de errores
        const [inboxRes, pendingRes, sentRes, archivedRes] = await Promise.allSettled([
          fetchWithTimeout('/routing-sheets/inbox'),
          fetchWithTimeout('/routing-sheets/pending'),
          fetchWithTimeout('/routing-sheets/sent'),
          fetchWithTimeout('/routing-sheets/archived')
        ]);
        
        stats.value = {
          inboxCount: inboxRes.status === 'fulfilled' ? inboxRes.value.data.length : 0,
          pendingCount: pendingRes.status === 'fulfilled' ? pendingRes.value.data.length : 0,
          sentCount: sentRes.status === 'fulfilled' ? sentRes.value.data.length : 0,
          archivedCount: archivedRes.status === 'fulfilled' ? archivedRes.value.data.length : 0
        };
      } catch (err) {
        console.error('Error fetching stats:', err);
        // Asegurar que se establezcan valores por defecto
        stats.value = {
          inboxCount: 0,
          pendingCount: 0,
          sentCount: 0,
          archivedCount: 0
        };
      }
    };
    
    const fetchUnreceivedSentSheets = async () => {
      try {
        const response = await fetchWithTimeout('/routing-sheets/sent/unreceived');
        unreceivedSentSheets.value = response.data;
      } catch (err) {
        console.error('Error fetching unreceived sent sheets:', err);
        unreceivedSentSheets.value = [];
      } finally {
        loadingUnreceived.value = false;
      }
    };
    
    const fetchReceivedSentSheets = async () => {
      try {
        // Usar endpoint existente que funcione
        const response = await fetchWithTimeout('/routing-sheets/sent');
        receivedSentSheets.value = response.data.filter(sheet => sheet.status === 'RECEIVED');
      } catch (err) {
        console.error('Error fetching received sent sheets:', err);
        receivedSentSheets.value = [];
      } finally {
        loadingReceived.value = false;
      }
    };
    
    onMounted(async () => {
      // Cargar datos de forma paralela
      await Promise.all([
        fetchStats(),
        fetchUnreceivedSentSheets(),
        fetchReceivedSentSheets()
      ]);
    });
    
    // Methods
    const getStatIcon = (key) => {
      const icons = {
        inbox: 'pi pi-inbox',
        pending: 'pi pi-clock',
        sent: 'pi pi-send',
        archived: 'pi pi-archive',
        cancelled: 'pi pi-times-circle'
      };
      return icons[key] || 'pi pi-question';
    };
    
    const getStatLabel = (key) => {
      const labels = {
        inbox: 'En Bandeja',
        pending: 'Pendientes',
        sent: 'Enviados',
        archived: 'Archivados',
        cancelled: 'Cancelados'
      };
      return labels[key] || key;
    };
    
    const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('es-ES', options);
    };
    
    return {
      currentUser,
      stats,
      unreceivedSentSheets,
      receivedSentSheets,
      loadingUnreceived,
      loadingReceived,
      getStatIcon,
      getStatLabel,
      formatDate
    };
  }
};
</script>

<style scoped>
.dashboard {
  padding: 20px;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.header {
  margin-bottom: 2rem;
  text-align: center;
}

.header h1 {
  margin: 0;
  color: #2c3e50;
  font-weight: 600;
  font-size: 2rem;
}

.header p {
  color: #7f8c8d;
  margin: 10px 0 0 0;
  font-size: 1.1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.stat-content {
  display: flex;
  align-items: center;
  padding: 20px;
}

.stat-icon {
  font-size: 2.5rem;
  margin-right: 15px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: white;
  background: linear-gradient(135deg, #007bff, #0062cc);
}

.stat-info {
  flex: 1;
}

.stat-info h3 {
  margin: 0 0 5px 0;
  font-size: 1.8rem;
  font-weight: 700;
  color: #2c3e50;
}

.stat-info p {
  margin: 0;
  color: #7f8c8d;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 500;
}

.dashboard-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.dashboard-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.card-header {
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
  background-color: #f8f9fa;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.card-header h2 {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
}

.card-body {
  padding: 20px;
}

.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #e9ecef;
}

.data-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #495057;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
}

.data-table tbody tr:hover {
  background-color: #f8f9fa;
}

.status-badge {
  display: inline-block;
  padding: 0.35em 0.65em;
  font-size: 0.75rem;
  font-weight: 700;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: 0.25rem;
}

.status-badge.pending {
  background-color: #fff3cd;
  color: #856404;
}

.no-data {
  text-align: center;
  padding: 40px 20px;
  color: #6c757d;
  font-style: italic;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
}

@media (max-width: 992px) {
  .dashboard-content {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}

@media (max-width: 768px) {
  .dashboard {
    padding: 15px;
  }
  
  .header h1 {
    font-size: 1.6rem;
  }
  
  .stat-content {
    flex-direction: column;
    text-align: center;
  }
  
  .stat-icon {
    margin-right: 0;
    margin-bottom: 15px;
  }
  
  .dashboard-content {
    gap: 15px;
  }
  
  .card-header, .card-body {
    padding: 15px;
  }
}
</style>