<!-- src/components/RoutingSheetDetail.vue -->
<template>
  <div class="routing-sheet-detail" v-if="routingSheet">
    <div class="header">
      <h2>Hoja de Ruta #{{ routingSheet.number }}</h2>
      <router-link to="/routing-sheets" class="btn btn-secondary">Volver</router-link>
    </div>

    <div class="info-grid">
      <div class="info-card">
        <h3>Información Básica</h3>
        <div class="info-item">
          <label>Referencia:</label>
          <span>{{ routingSheet.reference }}</span>
        </div>
        <div class="info-item">
          <label>Fecha de Creación:</label>
          <span>{{ formatDate(routingSheet.createdAt) }}</span>
        </div>
        <div class="info-item">
          <label>Estado:</label>
          <span :class="['status-badge', routingSheet.status.toLowerCase()]">
            {{ getStatusText(routingSheet.status) }}
          </span>
        </div>
        <div class="info-item">
          <label>Prioridad:</label>
          <span :class="['priority-badge', routingSheet.priority.toLowerCase()]">
            {{ getPriorityText(routingSheet.priority) }}
          </span>
        </div>
      </div>

      <div class="info-card">
        <h3>Participantes</h3>
        <div class="info-item">
          <label>Remitente:</label>
          <span>{{ routingSheet.sender.name }} ({{ routingSheet.sender.office.name }})</span>
        </div>
        <div class="info-item">
          <label>Destinatario:</label>
          <span>{{ routingSheet.recipient.name }} ({{ routingSheet.recipient.office.name }})</span>
        </div>
      </div>

      <div class="info-card">
        <h3>Detalles del Documento</h3>
        <div class="info-item">
          <label>Proveído:</label>
          <span>{{ routingSheet.provision }}</span>
        </div>
        <div class="info-item">
          <label>Nº de Hojas:</label>
          <span>{{ routingSheet.numberOfPages || 'N/A' }}</span>
        </div>
        <div class="info-item">
          <label>Nº de Anexos:</label>
          <span>{{ routingSheet.numberOfAttachments || 'N/A' }}</span>
        </div>
        <div class="info-item" v-if="routingSheet.hasCite">
          <label>Cite:</label>
          <span>{{ routingSheet.cite?.number }} - {{ routingSheet.cite?.reference }}</span>
        </div>
      </div>
    </div>

    <div class="actions" v-if="canPerformActions">
      <h3>Acciones</h3>
      <div class="action-buttons">
        <button 
          v-if="routingSheet.status === 'PENDING'" 
          @click="updateStatus('RECEIVED')"
          class="btn btn-success"
        >
          Marcar como Recibido
        </button>
        <button 
          v-if="routingSheet.status === 'RECEIVED'" 
          @click="updateStatus('PROCESSED')"
          class="btn btn-warning"
        >
          Marcar como Procesado
        </button>
        <button 
          v-if="routingSheet.status !== 'ARCHIVED' && routingSheet.status !== 'CANCELLED'" 
          @click="updateStatus('ARCHIVED')"
          class="btn btn-info"
        >
          Archivar
        </button>
        <button 
          v-if="routingSheet.status !== 'CANCELLED'" 
          @click="updateStatus('CANCELLED')"
          class="btn btn-danger"
        >
          Cancelar
        </button>
      </div>
    </div>

    <div class="copies-section" v-if="copies.length > 0">
      <h3>Copias</h3>
      <table class="table">
        <thead>
          <tr>
            <th>Destinatario</th>
            <th>Proveído</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="copy in copies" :key="copy.id">
            <td>{{ copy.recipient.name }} ({{ copy.recipient.office.name }})</td>
            <td>{{ copy.provision }}</td>
            <td>
              <span :class="['status-badge', copy.status.toLowerCase()]">
                {{ getCopyStatusText(copy.status) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="history-section">
      <h3>Historial</h3>
      <table class="table">
        <thead>
          <tr>
            <th>Fecha/Hora</th>
            <th>Usuario</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="log in history" :key="log.id">
            <td>{{ formatDateTime(log.timestamp) }}</td>
            <td>{{ log.user.name }}</td>
            <td>{{ getActionText(log.action) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div v-else class="loading">
    Cargando...
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import apiClient from '../services/api';

export default {
  name: 'RoutingSheetDetail',
  props: {
    id: {
      type: [String, Number],
      required: true
    }
  },
  setup(props) {
    const route = useRoute();
    const router = useRouter();
    const routingSheet = ref(null);
    const copies = ref([]);
    const history = ref([]);
    const currentUser = ref(null);

    const fetchRoutingSheet = async () => {
      try {
        const response = await apiClient.get(`/routing-sheets/${props.id}`);
        routingSheet.value = response.data;
      } catch (err) {
        console.error('Error fetching routing sheet:', err);
      }
    };

    const fetchCopies = async () => {
      try {
        const response = await apiClient.get(`/copies/routing-sheet/${props.id}`);
        copies.value = response.data;
      } catch (err) {
        console.error('Error fetching copies:', err);
      }
    };

    const fetchHistory = async () => {
      try {
        const response = await apiClient.get(`/history/routing-sheet/${props.id}`);
        history.value = response.data;
      } catch (err) {
        console.error('Error fetching history:', err);
      }
    };

    const fetchCurrentUser = async () => {
      try {
        const response = await apiClient.get('/users/profile');
        currentUser.value = response.data;
      } catch (err) {
        console.error('Error fetching current user:', err);
      }
    };

    const updateStatus = async (newStatus) => {
      try {
        await apiClient.patch(`/routing-sheets/${props.id}`, { status: newStatus });
        await fetchRoutingSheet(); // Refresh data
        await fetchHistory(); // Refresh history
        
        // Log the action
        await apiClient.post('/history', {
          routingSheetId: props.id,
          userId: currentUser.value.id,
          action: newStatus
        });
        
        alert(`Estado actualizado a: ${getStatusText(newStatus)}`);
      } catch (err) {
        console.error('Error updating status:', err);
        alert('Error al actualizar el estado.');
      }
    };

    const formatDate = (dateString) => {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const formatDateTime = (dateString) => {
      const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
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

    const getCopyStatusText = (status) => {
      const statusMap = {
        'PENDING': 'Pendiente',
        'RECEIVED': 'Recibido',
        'READ': 'Leído'
      };
      return statusMap[status] || status;
    };

    const getActionText = (action) => {
      const actionMap = {
        'SENT': 'Enviado',
        'RECEIVED': 'Recibido',
        'PROCESSED': 'Procesado',
        'ARCHIVED': 'Archivado',
        'CANCELLED': 'Cancelado'
      };
      return actionMap[action] || action;
    };

    // Computed property to determine if current user can perform actions
    const canPerformActions = () => {
      if (!routingSheet.value || !currentUser.value) return false;
      return routingSheet.value.recipient.id === currentUser.value.id;
    };

    onMounted(async () => {
      await Promise.all([
        fetchRoutingSheet(),
        fetchCopies(),
        fetchHistory(),
        fetchCurrentUser()
      ]);
    });

    return {
      routingSheet,
      copies,
      history,
      updateStatus,
      formatDate,
      formatDateTime,
      getStatusText,
      getPriorityText,
      getCopyStatusText,
      getActionText,
      canPerformActions
    };
  }
};
</script>

<style scoped>
.routing-sheet-detail {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.info-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.info-card h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #333;
}

.info-item {
  display: flex;
  margin-bottom: 10px;
}

.info-item label {
  font-weight: bold;
  min-width: 120px;
  margin-right: 10px;
}

.actions {
  margin-bottom: 30px;
}

.action-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.copies-section, .history-section {
  margin-bottom: 30px;
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

.btn {
  padding: 0.5rem 1rem;
  text-decoration: none;
  border-radius: 4px;
  cursor: pointer;
  border: none;
  font-size: 0.875rem;
}

.btn-secondary { background-color: #6c757d; color: white; }
.btn-success { background-color: #28a745; color: white; }
.btn-warning { background-color: #ffc107; color: black; }
.btn-info { background-color: #17a2b8; color: white; }
.btn-danger { background-color: #dc3545; color: white; }


.loading {
  text-align: center;
  padding: 50px;
  font-size: 1.2rem;
}
</style>