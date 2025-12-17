<!-- src/components/Processing.vue -->
<template>
  <div class="processing-container">
    <div class="page-header">
      <h1 class="page-title">Bandeja de Pendientes</h1>
      <p class="page-description">Hojas de ruta recibidas pendientes de procesamiento</p>
    </div>
    
    <div class="controls-section">
      <button @click="startGrouping" v-if="selectedForGrouping.length > 1" class="btn btn-primary">
        <i class="fas fa-layer-group"></i> Agrupar Seleccionadas (IV.3.1)
      </button>
    </div>
    
    <div class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th class="col-checkbox">
              <input type="checkbox" @change="selectAll" v-model="allSelected" />
            </th>
            <th class="col-number">Número</th>
            <th class="col-sender">Remitente</th>
            <th class="col-reference">Referencia</th>
            <th class="col-provision">Proveído</th>
            <th class="col-date">Fecha Recepción</th>
            <th class="col-status">Estado</th>
            <th class="col-deadline">Plazo (días)</th>
            <th class="col-actions">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="rs in pendingRoutingSheets" :key="rs.id" class="data-row">
            <td class="cell-checkbox">
              <input type="checkbox" v-model="selectedForGrouping" :value="rs.id" />
            </td>
            <td class="cell-number">{{ rs.number }}</td>
            <td class="cell-sender">{{ rs.sender.name }}</td>
            <td class="cell-reference">{{ rs.reference }}</td>
            <td class="cell-provision">{{ rs.provision }}</td>
            <td class="cell-date">{{ rs.receivedAt ? formatDate(rs.receivedAt) : 'N/A' }}</td>
            <td class="cell-status">
              <span :class="getStatusClass(rs.status)">
                {{ getStatusText(rs.status) }}
              </span>
            </td>
            <td :class="['cell-deadline', getDeadlineClass(getDaysUntilDeadline(rs.receivedAt))]">
              {{ getDaysUntilDeadline(rs.receivedAt) }}
            </td>
            <td class="cell-actions">
              <div class="action-buttons">
                <button @click="startProcess(rs)" class="btn btn-outline-primary btn-sm action-btn" title="Derivar hoja de ruta">
                  <i class="fas fa-paper-plane"></i>
                </button>
                <button @click="archiveSheet(rs)" class="btn btn-outline-warning btn-sm action-btn" title="Archivar hoja de ruta">
                  <i class="fas fa-archive"></i>
                </button>
                <button @click="viewHistory(rs)" class="btn btn-outline-info btn-sm action-btn" title="Ver historial">
                  <i class="fas fa-history"></i>
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="pendingRoutingSheets.length === 0">
            <td colspan="9" class="no-data">
              <i class="fas fa-inbox fa-2x"></i>
              <p>No hay hojas de ruta pendientes</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal para agrupación -->
    <div v-if="showGroupModal" class="modal-overlay" @click="closeGroupModal">
      <div class="modal-content" @click.stop>
        <h3>Agrupar Hojas de Ruta</h3>
        <p>Hojas seleccionadas: {{ selectedForGrouping.length }}</p>
        <div class="form-group">
          <label for="mainRSHId">Seleccionar Hoja de Ruta Principal:</label>
          <select v-model="mainRSHId" id="mainRSHId">
            <option value="">Seleccione una hoja principal</option>
            <option v-for="id in selectedForGrouping" :key="id" :value="id">{{ getRSNumberById(id) }}</option>
          </select>
        </div>
        <button @click="confirmGrouping" class="btn btn-primary">Agrupar</button>
        <button @click="closeGroupModal" class="btn btn-secondary">Cancelar</button>
      </div>
    </div>

    <!-- Modal para procesar -->
    <div v-if="showProcessModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h3>Procesar Hoja de Ruta: {{ processingRS?.number }}</h3>
        <p>Estado actual: {{ getStatusText(processingRS?.status) }}</p>
        <form @submit.prevent="onProcessSubmit">
          <div class="form-group">
            <label>
              <input v-model="processAction" type="radio" value="derive" /> Derivar
            </label>
            <label>
              <input v-model="processAction" type="radio" value="archive" /> Archivar
            </label>
          </div>
          <div v-if="processAction === 'derive'" class="form-group">
            <label for="newRecipientId">Nuevo Destinatario:</label>
            <select v-model="newRecipientId" id="newRecipientId">
              <option value="">Seleccione un destinatario</option>
              <option v-for="user in users" :key="user.id" :value="user.id">{{ user.name }}</option>
            </select>
            <label for="provision">Proveído:</label>
            <textarea v-model="provision" id="provision"></textarea>
          </div>
          <div v-if="processAction === 'archive'" class="form-group">
            <label for="folderId">Carpeta de Archivo:</label>
            <select v-model="folderId" id="folderId">
              <option value="">Seleccione una carpeta</option>
              <option v-for="folder in folders" :key="folder.id" :value="folder.id">{{ folder.name }}</option>
            </select>
            <label for="observation">Observación:</label>
            <textarea v-model="observation" id="observation"></textarea>
          </div>
          <button type="submit" class="btn btn-primary">Confirmar</button>
          <button type="button" @click="closeModal" class="btn btn-secondary">Cancelar</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '../services/api';

export default {
  name: 'Processing',
  setup() {
    const router = useRouter();
    const pendingRoutingSheets = ref([]);
    const showProcessModal = ref(false);
    const showGroupModal = ref(false);
    const processingRS = ref(null);
    const processAction = ref('derive'); // 'derive' or 'archive'
    const newRecipientId = ref('');
    const provision = ref('');
    const folderId = ref('');
    const observation = ref('');
    const users = ref([]);
    const folders = ref([]);
    const selectedForGrouping = ref([]);
    const allSelected = ref(false);
    const mainRSHId = ref('');

    const fetchPendingRoutingSheets = async () => {
      try {
        const response = await apiClient.get('/routing-sheets/received');
        pendingRoutingSheets.value = response.data;
      } catch (err) {
        console.error('Error fetching pending routing sheets:', err);
      }
    };

    const fetchUsersAndFolders = async () => {
      try {
        const [usersResponse, foldersResponse] = await Promise.all([
          apiClient.get('/users'),
          apiClient.get('/folders'),
        ]);
        users.value = usersResponse.data;
        folders.value = foldersResponse.data;
      } catch (err) {
        console.error('Error fetching users or folders:', err);
      }
    };

    const startProcess = (rs) => {
        processingRS.value = rs;
        processAction.value = 'derive';
        newRecipientId.value = '';
        provision.value = '';
        folderId.value = '';
        observation.value = '';
        showProcessModal.value = true;
    };

    const closeModal = () => {
        showProcessModal.value = false;
        processingRS.value = null;
    };

    const onProcessSubmit = async () => {
        if (!processingRS.value) return;

        try {
            if (processAction.value === 'derive') {
                if (!newRecipientId.value) {
                    alert('Debe seleccionar un nuevo destinatario para derivar.');
                    return;
                }
                await apiClient.put(`/routing-sheets/${processingRS.value.id}/process`, {
                    newRecipientId: parseInt(newRecipientId.value),
                    provision: provision.value,
                });
            } else if (processAction.value === 'archive') {
                if (!folderId.value) {
                    alert('Debe seleccionar una carpeta para archivar.');
                    return;
                }
                await apiClient.put(`/routing-sheets/${processingRS.value.id}/archive`, {
                    folderId: parseInt(folderId.value),
                    observation: observation.value,
                });
            }
            alert('Hoja de ruta procesada exitosamente.');
            closeModal();
            fetchPendingRoutingSheets(); // Recargar listas
        } catch (err) {
            console.error('Error processing routing sheet:', err);
            alert('Error al procesar la hoja de ruta.');
        }
    };

    const startGrouping = () => {
        if (selectedForGrouping.value.length < 2) {
            alert('Debe seleccionar al menos 2 hojas de ruta para agrupar.');
            return;
        }
        mainRSHId.value = '';
        showGroupModal.value = true;
    };

    const closeGroupModal = () => {
        showGroupModal.value = false;
        selectedForGrouping.value = [];
        allSelected.value = false;
    };

    const confirmGrouping = async () => {
        if (!mainRSHId.value) {
            alert('Debe seleccionar una hoja de ruta principal.');
            return;
        }
        const groupedIds = selectedForGrouping.value.filter(id => id !== mainRSHId.value);
        if (groupedIds.length === 0) {
            alert('Debe haber al menos una hoja de ruta secundaria para agrupar.');
            return;
        }

        try {
            await apiClient.post('/groups', {
                mainRoutingSheetId: parseInt(mainRSHId.value),
                groupedRoutingSheetIds: groupedIds,
            });
            alert('Hojas de ruta agrupadas exitosamente.');
            closeGroupModal();
            fetchPendingRoutingSheets(); // Recargar listas
        } catch (err) {
            console.error('Error grouping routing sheets:', err);
            alert('Error al agrupar las hojas de ruta.');
        }
    };

    const selectAll = () => {
        if (allSelected.value) {
            selectedForGrouping.value = pendingRoutingSheets.value.map(rs => rs.id);
        } else {
            selectedForGrouping.value = [];
        }
    };

    const getRSNumberById = (id) => {
        const rs = pendingRoutingSheets.value.find(r => r.id === id);
        return rs ? rs.number : 'N/A';
    };

    const getDaysUntilDeadline = (receivedAt) => {
        if (!receivedAt) return 'sin recibir';
        const receivedDate = new Date(receivedAt);
        const deadlineDate = new Date(receivedDate);
        deadlineDate.setDate(deadlineDate.getDate() + 11); // IV.1.2: 11 días calendario
        const today = new Date();
        const diffTime = deadlineDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const getDeadlineClass = (days) => {
        if (days <= 0) return 'deadline-overdue';
        if (days <= 2) return 'deadline-warning';
        return 'deadline-ok';
    };

    const getStatusText = (status) => {
        const statusMap = {
            'UNRECEIVED': 'No recibido',
            'PENDING': 'No recibido',
            'RECEIVED': 'Pendiente',
            'PROCESSED': 'Procesado',
            'ARCHIVED': 'Archivado',
            'CANCELLED': 'Cancelado'
        };
        return statusMap[status] || status;
    };

    const getStatusClass = (status) => {
        return `status-${status.toLowerCase()}`;
    };

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString();
    };

    const viewHistory = (rs) => {
        // Navigate to the history page
        router.push('/history');
        alert(`Mostrando historial para la hoja de ruta ${rs.number}.`);
        // TODO: Implementar la funcionalidad para mostrar el historial específico
    };

    const archiveSheet = (rs) => {
        alert(`Funcionalidad de archivar para la hoja de ruta ${rs.number}. Implementación pendiente.`);
        // TODO: Implementar la funcionalidad para archivar la hoja de ruta
    };

    onMounted(() => {
        fetchPendingRoutingSheets();
        fetchUsersAndFolders();
    });

    return {
      pendingRoutingSheets,
      showProcessModal,
      showGroupModal,
      processingRS,
      processAction,
      newRecipientId,
      provision,
      folderId,
      observation,
      users,
      folders,
      selectedForGrouping,
      allSelected,
      mainRSHId,
      startProcess,
      closeModal,
      onProcessSubmit,
      startGrouping,
      closeGroupModal,
      confirmGrouping,
      selectAll,
      getRSNumberById,
      getDaysUntilDeadline,
      getDeadlineClass,
      getStatusText,
      getStatusClass,
      formatDate,
      viewHistory,
      archiveSheet,
      router
    };
  },
};
</script>

<style scoped>
.processing-container {
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 10px;
  margin: 15px;
}

.page-header {
  background: linear-gradient(120deg, #4f46e5, #7c3aed);
  border-radius: 8px;
  padding: 25px;
  margin-bottom: 25px;
  color: white;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
}

.page-title {
  font-size: 1.8rem;
  font-weight: 600;
  margin: 0 0 10px 0;
}

.page-description {
  font-size: 1rem;
  margin: 0;
  opacity: 0.9;
}

.controls-section {
  margin-bottom: 25px;
  padding: 15px;
  background-color: #eef2ff;
  border-radius: 6px;
}

.controls-section .btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.table-wrapper {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 900px;
}

.data-table thead {
  background-color: #f8fafc;
}

.data-table thead th {
  padding: 16px 12px;
  text-align: left;
  font-weight: 600;
  color: #334155;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #e2e8f0;
}

.col-checkbox {
  width: 40px;
  text-align: center;
}

.col-actions {
  width: 160px;
  text-align: center;
}

.data-table tbody tr {
  border-bottom: 1px solid #f1f5f9;
  transition: background-color 0.2s ease;
}

.data-table tbody tr:hover {
  background-color: #f8fafc;
}

.data-table tbody td {
  padding: 14px 12px;
  vertical-align: middle;
}

.cell-number {
  font-weight: 600;
  color: #4f46e5;
}

.cell-sender {
  font-weight: 500;
  color: #1e293b;
}

.cell-reference, .cell-provision {
  color: #64748b;
}

.cell-date {
  color: #475569;
}

.cell-status {
  text-align: center;
}

.status-pending {
  background-color: #fef3c7;
  color: #92400e;
  padding: 5px 12px;
  border-radius: 20px;
  font-weight: 500;
  font-size: 0.8rem;
  display: inline-block;
}

.status-received {
  background-color: #dbeafe;
  color: #1e40af;
  padding: 5px 12px;
  border-radius: 20px;
  font-weight: 500;
  font-size: 0.8rem;
  display: inline-block;
}

.cell-deadline {
  font-weight: 600;
  text-align: center;
  border-radius: 20px;
  padding: 5px 12px;
}

.deadline-overdue {
  background-color: #fee2e2;
  color: #b91c1c;
}

.deadline-warning {
  background-color: #fef3c7;
  color: #b45309;
}

.deadline-ok {
  background-color: #dcfce7;
  color: #166534;
}

.cell-actions {
  text-align: center;
}

.action-buttons {
  display: flex;
  gap: 6px;
  justify-content: center;
}

.action-btn {
  width: 32px;
  height: 32px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.no-data {
  text-align: center;
  padding: 40px 20px;
  color: #94a3b8;
}

.no-data i {
  margin-bottom: 10px;
  opacity: 0.7;
}

.btn {
  padding: 10px 18px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.btn-primary {
  background-color: #4f46e5;
  color: white;
}

.btn-primary:hover {
  background-color: #4338ca;
}

.btn-warning {
  background-color: #f59e0b;
  color: white;
}

.btn-warning:hover {
  background-color: #d97706;
}

.btn-info {
  background-color: #0ea5e9;
  color: white;
}

.btn-info:hover {
  background-color: #0284c7;
}

.btn-secondary {
  background-color: #94a3b8;
  color: white;
}

.btn-secondary:hover {
  background-color: #64748b;
}

.btn-outline-primary {
  background-color: transparent;
  color: #4f46e5;
  border: 1px solid #c7d2fe;
}

.btn-outline-primary:hover {
  background-color: #eef2ff;
  border-color: #4f46e5;
}

.btn-outline-warning {
  background-color: transparent;
  color: #f59e0b;
  border: 1px solid #fde68a;
}

.btn-outline-warning:hover {
  background-color: #fffbeb;
  border-color: #f59e0b;
}

.btn-outline-info {
  background-color: transparent;
  color: #0ea5e9;
  border: 1px solid #bae6fd;
}

.btn-outline-info:hover {
  background-color: #f0f9ff;
  border-color: #0ea5e9;
}

.btn-sm {
  padding: 6px 10px;
  font-size: 0.8rem;
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

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
}

.form-group textarea {
  min-height: 100px;
  resize: vertical;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .processing-container {
    padding: 15px;
    margin: 10px;
  }
  
  .page-header {
    padding: 20px;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .data-table thead th,
  .data-table tbody td {
    padding: 12px 8px;
  }
}
</style>