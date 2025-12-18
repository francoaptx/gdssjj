<script setup>
import { ref, onMounted, computed, onActivated } from 'vue';
import api from '../services/api';

const sentItems = ref([]);
const loading = ref(true);
const error = ref(null);

// Fetch real data from the API
const fetchSentItems = async () => {
  try {
    loading.value = true;
    // Add timestamp to URL to prevent caching
    const response = await api.get(`/routing-sheets/sent?t=${new Date().getTime()}`);
    // Only show items with PENDING status (displayed as "Enviado")
    sentItems.value = response.data.filter(item => item.status === 'PENDING');
    error.value = null;
  } catch (err) {
    error.value = 'Error al cargar las hojas de ruta enviadas.';
    console.error('Error fetching sent routing sheets:', err);
  } finally {
    loading.value = false;
  }
};

// Add a method to force refresh the data
const refreshSentItems = () => {
  fetchSentItems();
};

onMounted(fetchSentItems);
onActivated(refreshSentItems);

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('es-ES', options);
};

const getStatusText = (status) => {
  switch (status) {
    case 'PENDING':
      return 'Enviado';
    case 'RECEIVED':
      return 'Pendiente';
    default:
      return status;
  }
};

const getPriorityClass = (priority) => {
  if (!priority) return 'normal';
  return `priority-${priority.toLowerCase()}`;
};

const getStatusClass = (status) => {
  if (status === 'PENDING') {
    return 'enviado';
  }
  return '';
};

const cancelSheet = async (id) => {
  // Ask for user confirmation before cancelling
  if (!confirm('¿Está seguro de que desea cancelar esta hoja de ruta? Esta acción no se puede deshacer.')) {
    return; // User cancelled the operation
  }
  
  try {
    await api.patch(`/routing-sheets/${id}/cancel`);
    // Refresh the list after cancellation
    fetchSentItems();
    alert(`La hoja de ruta ${id} ha sido cancelada.`);
  } catch (err) {
    console.error(err);
    alert('Error al cancelar la hoja de ruta.');
  }
};
</script>

<template>
  <div class="sent">
    <div class="header">
      <h2>Hojas de Ruta Enviadas</h2>
      <button @click="refreshSentItems" class="btn btn-primary btn-sm">
        Actualizar
      </button>
    </div>
    <div v-if="loading" class="loading-state">Cargando hojas de ruta enviadas...</div>
    <div v-else-if="error" class="error-state">{{ error }}</div>
    <div v-else-if="sentItems.length === 0" class="loading-state">No has enviado ninguna hoja de ruta.</div>
    <table v-else class="table">
      <thead>
        <tr>
          <th>Nro. Hoja de Ruta</th>
          <th>Referencia</th>
          <th>Destinatario</th>
          <th>Fecha de Envío</th>
          <th>Prioridad</th>
          <th>Estado</th>
          <th class="text-center">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in sentItems" :key="item.id">
          <td>{{ item.number }}</td>
          <td>
            <div>{{ item.reference }}</div>
          </td>
          <td>
            <div class="recipient-details">{{ item.recipient.name }}</div>
          </td>
          <td>{{ formatDate(item.createdAt) }}</td>
          <td>
            <span :class="['priority-badge', getPriorityClass(item.priority), getStatusClass(item.status)]">
              {{ getStatusText(item.status) }}
            </span>
          </td>
          <td class="actions-cell">
            <button class="btn btn-sm btn-info">Ver</button>
            <button 
              v-if="item.status === 'PENDING'" 
              @click="cancelSheet(item.id)" 
              class="btn btn-sm btn-danger">
              Cancelar
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.sent { padding: 20px; }

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h2 {
  margin: 0;
}

.table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  overflow: hidden;
}

.table th {
  background-color: #f8f9fa;
  font-weight: 600;
  padding: 16px 12px;
  text-align: left;
  color: #495057;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #e9ecef;
}

.table td {
  padding: 14px 12px;
  border-bottom: 1px solid #e9ecef;
  vertical-align: top;
}

.table tbody tr:last-child td {
  border-bottom: none;
}

.table tbody tr:hover {
  background-color: #f8f9fa;
}

.text-center {
  text-align: center;
}

.loading-state, .error-state {
  text-align: center;
  padding: 40px;
  font-size: 1.2rem;
  color: #6c757d;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.error-state {
  color: #dc3545;
}

.priority-badge {
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  display: inline-block;
  text-align: center;
  min-width: 80px;
}

.priority-badge.normal {
  background-color: #d1ecf1;
  color: #0c5460;
}

.priority-badge.urgent {
  background-color: #f8d7da;
  color: #721c24;
}

.priority-badge.high {
  background-color: #f8d7da;
  color: #721c24;
}

.priority-badge.low {
  background-color: #e2e3e5;
  color: #383d41;
}

.priority-badge.enviado,
.status-cell.enviado {
  background-color: #ffc107;
  color: #212529;
}

.actions-cell {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  justify-content: center;
}

.btn {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
  border: none;
  font-size: 0.85rem;
  transition: all 0.2s ease;
  text-align: center;
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 0.8rem;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-info {
  background-color: #17a2b8;
  color: white;
}

.btn-warning {
  background-color: #ffc107;
  color: #212529;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.recipient-details {
  font-size: 0.9rem;
  color: #6c757d;
  margin: 4px 0;
  font-style: italic;
}

.reference-details, .provision-details {
  font-size: 0.85rem;
  color: #868e96;
  margin: 3px 0;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  padding: 25px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content h3 {
  margin-top: 0;
  color: #1e293b;
  font-weight: 600;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 15px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #334155;
}

.checkbox-item {
  margin-bottom: 8px;
}

.checkbox-item input {
  margin-right: 8px;
}

.form-control {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.form-control:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
}

.form-control textarea {
  min-height: 100px;
  resize: vertical;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .sent {
    padding: 15px;
  }
  
  .table {
    font-size: 0.9rem;
  }
  
  .table th,
  .table td {
    padding: 10px 8px;
  }
  
  .priority-badge {
    padding: 3px 8px;
    font-size: 0.7rem;
    min-width: 70px;
  }
  
  .btn {
    padding: 6px 12px;
    font-size: 0.8rem;
  }
  
  .btn-sm {
    padding: 4px 8px;
    font-size: 0.7rem;
  }
  
  .actions-cell {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>