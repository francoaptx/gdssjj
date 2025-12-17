<!-- src/components/Sent.vue -->
<template>
  <div class="sent">
    <h2>Documentos Enviados</h2>
    <p>Lista de hojas de ruta enviadas cuyo estado es pendiente de recepción.</p>
    
    <div class="controls">
      <button @click="fetchSentSheets" class="btn btn-primary" :disabled="loading">
        <span v-if="loading">Cargando...</span>
        <span v-else>Actualizar</span>
      </button>
    </div>
    
    <div v-if="loading" class="loading-state">
      <p>Cargando hojas de ruta enviadas...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <button @click="fetchSentSheets" class="btn btn-primary">Reintentar</button>
    </div>

    <div v-else>
      <table class="table">
        <thead>
          <tr>
            <th>Número</th>
            <th>Destinatario</th>
            <th>Referencia</th>
            <th>Fecha de Envío</th>
            <th>Prioridad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="sentSheets.length === 0">
            <td colspan="6" class="text-center">No tiene hojas de ruta enviadas pendientes de recepción.</td>
          </tr>
          <tr v-for="rs in sentSheets" :key="rs.id">
            <td>{{ rs.number }}</td>
            <td>{{ rs.recipient ? rs.recipient.name : 'N/A' }}</td>
            <td>{{ rs.reference || 'Sin referencia' }}</td>
            <td>{{ formatDate(rs.createdAt) }}</td>
            <td>
              <span :class="['priority-badge', rs.priority ? rs.priority.toLowerCase() : '']">
                {{ getPriorityText(rs.priority) }}
              </span>
            </td>
            <td class="actions-cell">
              <router-link :to="`/routing-sheets/${rs.id}`" class="btn btn-info btn-sm">Ver Detalle</router-link>
              <button @click="printSheet(rs)" class="btn btn-secondary btn-sm">Imprimir</button>
              <button @click="copySheet(rs)" class="btn btn-warning btn-sm">Copia</button>
              <button @click="cancelSheet(rs.id)" class="btn btn-danger btn-sm">Cancelar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal para copia -->
    <div v-if="showCopyModal" class="modal-overlay" @click="closeCopyModal">
      <div class="modal-content" @click.stop>
        <h3>Enviar Copia de Hoja de Ruta</h3>
        <p><strong>Hojas de ruta:</strong> {{ copySourceSheet?.number }}</p>
        <div class="form-group">
          <label>Seleccionar Destinatarios para la Copia:</label>
          <div v-for="user in users" :key="user.id" class="checkbox-item">
            <input 
              type="checkbox" 
              :id="'user-' + user.id" 
              :value="user.id" 
              v-model="selectedRecipients"
            >
            <label :for="'user-' + user.id">{{ user.name }}</label>
          </div>
        </div>
        <div class="form-group">
          <label for="copyReference">Referencia para la copia:</label>
          <input 
            id="copyReference" 
            v-model="copyReference" 
            placeholder="Referencia para la copia" 
            class="form-control"
          >
        </div>
        <div class="form-group">
          <label for="copyProvision">Proveído para la copia:</label>
          <textarea 
            id="copyProvision" 
            v-model="copyProvision" 
            placeholder="Proveído para la copia" 
            class="form-control"
          ></textarea>
        </div>
        <div class="modal-actions">
          <button @click="submitCopy" class="btn btn-primary" :disabled="selectedRecipients.length === 0">Enviar Copias</button>
          <button @click="closeCopyModal" class="btn btn-secondary">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import apiClient from '../services/api';

export default {
  name: 'Sent',
  setup() {
    const sentSheets = ref([]);
    const loading = ref(true);
    const error = ref(null);
    
    // Variables para el modal de copia
    const showCopyModal = ref(false);
    const copySourceSheet = ref(null);
    const selectedRecipients = ref([]);
    const copyReference = ref('');
    const copyProvision = ref('');
    const users = ref([]);

    const fetchSentSheets = async () => {
      loading.value = true;
      error.value = null;
      try {
        // Usar el endpoint que obtiene las hojas enviadas no recibidas
        const sheetsResponse = await apiClient.get(`/routing-sheets/sent/unreceived`);
        
        sentSheets.value = sheetsResponse.data;
      } catch (err) {
        console.error('Error fetching sent routing sheets:', err);
        console.error('Error response:', err.response);
        if (err.response) {
          error.value = `Error ${err.response.status}: ${err.response.statusText}`;
        } else {
          error.value = 'No se pudieron cargar las hojas de ruta enviadas. Intente de nuevo más tarde.';
        }
      } finally {
        loading.value = false;
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await apiClient.get('/users');
        users.value = response.data;
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };

    const printSheet = (sheet) => {
      // Funcionalidad básica de impresión
      alert(`Funcionalidad de impresión para la hoja de ruta ${sheet.number}. En un implementación completa, esto abriría la hoja de ruta en un formato imprimible.`);
      // En una implementación real, aquí se abriría una ventana de impresión o se generaría un PDF
    };

    const copySheet = async (sheet) => {
      copySourceSheet.value = sheet;
      selectedRecipients.value = [];
      copyReference.value = sheet.reference || '';
      copyProvision.value = sheet.provision || '';
      
      // Cargar usuarios si no están cargados
      if (users.value.length === 0) {
        await fetchUsers();
      }
      
      showCopyModal.value = true;
    };

    const closeCopyModal = () => {
      showCopyModal.value = false;
      copySourceSheet.value = null;
      selectedRecipients.value = [];
      copyReference.value = '';
      copyProvision.value = '';
    };

    const submitCopy = async () => {
      if (!copySourceSheet.value || selectedRecipients.value.length === 0) {
        alert('Debe seleccionar al menos un destinatario para la copia.');
        return;
      }

      try {
        // Crear una copia para cada destinatario seleccionado
        const copyPromises = selectedRecipients.value.map(recipientId => {
          return apiClient.post('/copies', {
            originalRoutingSheetId: copySourceSheet.value.id,
            recipientId: recipientId,
            reference: copyReference.value,
            provision: copyProvision.value
          });
        });

        await Promise.all(copyPromises);
        
        alert(`Copias enviadas exitosamente a ${selectedRecipients.value.length} destinatario(s).`);
        closeCopyModal();
      } catch (err) {
        console.error('Error sending copies:', err);
        alert('Hubo un error al enviar las copias. Intente de nuevo.');
      }
    };

    const cancelSheet = async (sheetId) => {
      if (!confirm('¿Está seguro de que desea cancelar esta hoja de ruta? Esta acción no se puede deshacer.')) {
        return;
      }
      
      try {
        // Usar el endpoint para cancelar la hoja de ruta
        await apiClient.patch(`/routing-sheets/${sheetId}/cancel`);
        
        // Eliminar la hoja de ruta de la lista local para actualizar la UI
        sentSheets.value = sentSheets.value.filter(sheet => sheet.id !== sheetId);
        
        alert('Hoja de ruta cancelada exitosamente.');
      } catch (err) {
        console.error('Error cancelling sheet:', err);
        if (err.response && err.response.status === 400) {
          alert('No se puede cancelar esta hoja de ruta. Solo se pueden cancelar hojas de ruta pendientes.');
        } else {
          alert('Hubo un error al intentar cancelar la hoja de ruta.');
        }
      }
    };

    const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    const getPriorityText = (priority) => {
      const priorityMap = {
        'HIGH': 'Alta',
        'NORMAL': 'Normal',
        'LOW': 'Baja',
        'URGENT': 'Urgente'
      };
      return priorityMap[priority] || priority;
    };

    onMounted(() => {
      fetchSentSheets();
    });

    return {
      sentSheets,
      loading,
      error,
      formatDate,
      getPriorityText,
      fetchSentSheets,
      printSheet,
      copySheet,
      closeCopyModal,
      submitCopy,
      cancelSheet,
      // Variables para el modal de copia
      showCopyModal,
      copySourceSheet,
      selectedRecipients,
      copyReference,
      copyProvision,
      users
    };
  }
};
</script>

<style scoped>
.sent { padding: 20px; }
.sent h2 { margin-top: 0; }
.controls { margin-bottom: 20px; }
.table { width: 100%; border-collapse: collapse; background-color: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
.table th, .table td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
.table th { background-color: #f8f9fa; font-weight: bold; }
.text-center { text-align: center; }
.loading-state, .error-state { text-align: center; padding: 40px; font-size: 1.2rem; color: #6c757d; }
.error-state { color: #dc3545; }
.error-state .btn { margin-top: 10px; }

.priority-badge { padding: 4px 8px; border-radius: 4px; font-size: 0.8em; font-weight: bold; }
.priority-badge.normal { background-color: #d1ecf1; color: #0c5460; }
.priority-badge.urgent { background-color: #f8d7da; color: #721c24; }
.priority-badge.high { background-color: #f8d7da; color: #721c24; }
.priority-badge.low { background-color: #e2e3e5; color: #383d41; }

.actions-cell {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  justify-content: center;
}

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

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.btn {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
  cursor: pointer;
  border: none;
  margin-right: 5px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-sm {
  padding: 4px 8px;
  font-size: 0.8em;
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
</style>