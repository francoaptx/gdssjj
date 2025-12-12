<!-- src/components/Processing.vue -->
<template>
  <div class="processing">
    <h2>Bandeja de Pendientes</h2>
    <p>Estas son las hojas de ruta que ha recibido y están pendientes de procesamiento (derivación o archivado).</p>
    <div class="controls">
      <button @click="startGrouping" v-if="selectedForGrouping.length > 1" class="btn btn-info">Agrupar Seleccionadas (IV.3.1)</button>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th><input type="checkbox" @change="selectAll" v-model="allSelected" /></th>
          <th>Número</th>
          <th>Remitente</th>
          <th>Referencia</th>
          <th>Proveído</th>
          <th>Fecha Recepción</th>
          <th>Plazo (días)</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="rs in pendingRoutingSheets" :key="rs.id">
          <td><input type="checkbox" v-model="selectedForGrouping" :value="rs.id" /></td>
          <td>{{ rs.number }}</td>
          <td>{{ rs.sender.name }}</td>
          <td>{{ rs.reference }}</td>
          <td>{{ rs.provision }}</td>
          <td>{{ rs.receivedAt ? formatDate(rs.receivedAt) : 'N/A' }}</td>
          <td :class="getDeadlineClass(getDaysUntilDeadline(rs.receivedAt))">{{ getDaysUntilDeadline(rs.receivedAt) }}</td>
          <td>
            <button @click="startProcess(rs)" class="btn btn-primary">Procesar</button>
          </td>
        </tr>
      </tbody>
    </table>

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
          <button type="submit">Confirmar</button>
          <button type="button" @click="closeModal">Cancelar</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import apiClient from '../services/api';

export default {
  name: 'Processing',
  setup() {
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
        const response = await apiClient.get('/routing-sheets/pending');
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
        if (!receivedAt) return 'N/A';
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

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString();
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
      formatDate,
    };
  },
};
</script>

<style scoped>
/* ... estilos anteriores ... */
.controls {
  margin-bottom: 1rem;
}

.controls .btn {
  margin-right: 0.5rem;
}
</style>