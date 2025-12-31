<template>
  <div class="processing-container">
    <div class="processing-list unified-page">
      <BaseList
        title="Bandeja de Pendientes"
        subtitle="Hojas de ruta recibidas pendientes de procesamiento"
        :items="pendingRoutingSheets"
        :loading="loading"
        :error="error"
        :columns="columns"
        :actions="actions"
        @refresh="fetchPendingRoutingSheets"
        @action="handleAction"
      />
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
import BaseList from './BaseList.vue';
import { useRoutingSheetsStore } from '../store/routingSheets';

export default {
  name: 'Processing',
  components: {
    BaseList
  },
  setup() {
    const router = useRouter();
    const routingSheetsStore = useRoutingSheetsStore();
    
    const pendingRoutingSheets = computed(() => routingSheetsStore.processingItems);
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
    const loading = computed(() => routingSheetsStore.loading);
    const error = computed(() => routingSheetsStore.error);

    const fetchPendingRoutingSheets = async () => {
      try {
        await routingSheetsStore.fetchProcessingItems();
      } catch (err) {
        console.error('Error fetching pending routing sheets:', err);
        error.value = 'Error al cargar las hojas de ruta pendientes';
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
                    recipientId: parseInt(newRecipientId.value),
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
      // Use the standard classes from our global CSS
      return `status-badge ${status.toLowerCase()}`;
    };
    

    const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('es-ES', options);
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

    const handleAction = ({ action, item }) => {
      if (action === 'process') {
        startProcess(item);
      } else if (action === 'archive') {
        archiveSheet(item);
      } else if (action === 'history') {
        viewHistory(item);
      }
    };

    const columns = [
      { field: 'number', header: 'Nro. Hoja de Ruta', sortable: true },
      { field: 'reference', header: 'Referencia', sortable: true },
      { field: 'sender', header: 'Remitente', type: 'sender', sortable: true },
      { field: 'createdAt', header: 'Fecha de Envío', type: 'date', sortable: true },
      { field: 'receivedAt', header: 'Fecha Recepción', type: 'date', sortable: true },
      { field: 'priority', header: 'Prioridad', type: 'priority', sortable: true },
      { field: 'status', header: 'Estado', type: 'status', sortable: true },
      { 
        field: 'deadline', 
        header: 'Plazo (días)', 
        sortable: true,
        customBody: (rowData) => {
          const days = getDaysUntilDeadline(rowData.receivedAt);
          return days;
        }
      }
    ];

    const actions = [
      { 
        name: 'process', 
        icon: 'pi pi-paper-plane', 
        class: 'p-button-success', 
        title: 'Derivar hoja de ruta',
        severity: 'success'
      },
      { 
        name: 'archive', 
        icon: 'pi pi-archive', 
        class: 'p-button-warning', 
        title: 'Archivar hoja de ruta',
        severity: 'warning'
      },
      { 
        name: 'history', 
        icon: 'pi pi-history', 
        class: 'p-button-info', 
        title: 'Ver historial',
        severity: 'info'
      }
    ];

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
      loading,
      error,
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
      router,
      handleAction,
      columns,
      actions,
      fetchPendingRoutingSheets
    };
  },
};
</script>

<style scoped>
.processing-container {
  width: 100%;
  height: 100%;
  padding: 1.5rem;
}

.processing-list {
  padding: 1.5rem;
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

@media (max-width: 768px) {
  .processing-list {
    padding: 1rem;
  }
}
</style>