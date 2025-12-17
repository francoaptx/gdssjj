<!-- src/components/RoutingSheetCreate.vue -->
<template>
  <div class="routing-sheet-create">
    <h2>Crear Nueva Hoja de Ruta</h2>
    <form @submit.prevent="onSubmit" class="rs-form">
      <div class="form-group">
        <label for="generatedNumber">Número de Hoja de Ruta (Autogenerado):</label>
        <input v-model="generatedNumber" type="text" id="generatedNumber" readonly class="readonly-field" />
      </div>
      <div class="form-group">
        <label for="reference">Referencia:</label>
        <input v-model="reference" type="text" id="reference" required />
      </div>
      <div class="form-group">
        <label for="recipientId">Destinatario:</label>
        <select v-model="recipientId" id="recipientId" required>
          <option value="">Seleccione un destinatario</option>
          <option v-for="user in users" :key="user.id" :value="user.id">{{ user.name }} ({{ user.office.name }})</option>
        </select>
      </div>
      <div class="form-group">
        <label for="provision">Proveído:</label>
        <textarea v-model="provision" id="provision" required></textarea>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="numberOfPages">Nº de Hojas:</label>
          <input v-model.number="numberOfPages" type="number" id="numberOfPages" min="0" />
        </div>
        <div class="form-group">
          <label for="numberOfAttachments">Nº de Anexos:</label>
          <input v-model.number="numberOfAttachments" type="number" id="numberOfAttachments" min="0" />
        </div>
      </div>
      <div class="form-group">
        <label>
          <input v-model="hasCite" type="checkbox" /> ¿Tiene Cite?
        </label>
      </div>
      
      <!-- Restored cite fields with framing -->
      <div v-if="hasCite" class="cite-section">
        <div class="form-group">
          <label for="citeNumber">Número de Cite (Autogenerado):</label>
          <input v-model="citeNumber" type="text" id="citeNumber" readonly />
        </div>
        
        <div class="form-group">
          <label for="citeFile">Subir archivo con Cite (PDF o Word):</label>
          <input type="file" id="citeFile" @change="onCiteFileChange" accept=".pdf,.doc,.docx" />
        </div>
      </div>
      
      <div class="form-group">
        <label>
          <input v-model="priority" type="radio" value="NORMAL" /> Normal
        </label>
        <label>
          <input v-model="priority" type="radio" value="URGENT" /> Urgente
        </label>
      </div>
      <!-- II.1.2: Adjuntar Archivos Digitales -->
      <div class="form-group">
        <label for="file">Adjuntar Archivo:</label>
        <input type="file" id="file" @change="onFileChange" />
      </div>

      <!-- II.1.3: Copias -->
      <div class="copy-section">
        <h3>Copias</h3>
        <div class="form-row">
          <div class="form-group">
            <label for="newCopyRecipient">Destinatario de Copia:</label>
            <select v-model="newCopyRecipientId" id="newCopyRecipient">
              <option value="">Seleccione un destinatario</option>
              <option v-for="user in users" :key="user.id" :value="user.id">{{ user.name }} ({{ user.office.name }})</option>
            </select>
          </div>
          <div class="form-group">
            <label for="newCopyProvision">Proveído:</label>
            <input v-model="newCopyProvision" type="text" id="newCopyProvision" />
          </div>
        </div>
        <button type="button" @click="addCopy">Agregar Copia</button>

        <div class="copy-list">
          <div v-for="(copy, index) in copies" :key="index" class="copy-item">
            <div>
              <strong>{{ getUserById(copy.recipientId)?.name }}</strong>: {{ copy.provision }}
            </div>
            <button type="button" @click="() => removeCopy(index)">Eliminar</button>
          </div>
        </div>
      </div>
      <button type="submit">Crear Hoja de Ruta</button>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '../services/api';

export default {
  setup() {
    const reference = ref('');
    const recipientId = ref('');
    const provision = ref('');
    const numberOfPages = ref(null);
    const numberOfAttachments = ref(null);
    const hasCite = ref(false);
    const citeNumber = ref(''); // Will show the generated cite number
    const citeFile = ref(null); // File for cite document
    const priority = ref('NORMAL');
    const file = ref(null); // Para manejar el archivo adjunto
    const copies = ref([]); // [{recipientId, provision}]
    const newCopyRecipientId = ref('');
    const newCopyProvision = ref('');
    const error = ref('');
    const router = useRouter();
    const users = ref([]);
    const cites = ref([]);
    const generatedNumber = ref('');

    // Generate cite number when "hasCite" is checked
    const generateCiteNumber = () => {
      if (hasCite.value) {
        // Generate a cite number following the same format as the backend
        const year = new Date().getFullYear();
        // For demo purposes, we'll use a fixed number
        // In a real implementation, this would ideally come from the backend
        const correlativo = '0001'; // Placeholder
        citeNumber.value = `HR-CITE-${correlativo}-${year}`;
      } else {
        citeNumber.value = '';
      }
    };

    const generateRoutingSheetNumber = () => {
      const year = new Date().getFullYear();
      // For demo purposes, we'll use a fixed number
      // In a real implementation, this would ideally come from the backend
      const correlativo = '0001'; // Placeholder
      generatedNumber.value = `HR-${correlativo}-${year}`;
    };

    // Watch for changes in hasCite
    watch(hasCite, generateCiteNumber);
    watch(hasCite, generateRoutingSheetNumber);

    const fetchUsersAndCites = async () => {
      try {
        const [usersResponse, citesResponse] = await Promise.all([
          apiClient.get('/users'),
          apiClient.get('/cites'),
        ]);
        users.value = usersResponse.data;
        cites.value = citesResponse.data.filter(c => c.isUploaded); // Solo cites subidos
      } catch (err) {
        console.error('Error fetching users or cites:', err);
        error.value = 'Error al cargar datos necesarios.';
      }
    };

    onMounted(() => {
      generateRoutingSheetNumber();
      fetchUsersAndCites();
    });

    const onFileChange = (event) => {
      file.value = event.target.files[0];
    };

    // Handle cite file selection
    const onCiteFileChange = (event) => {
      citeFile.value = event.target.files[0];
    };

    const addCopy = () => {
        if (newCopyRecipientId.value && newCopyProvision.value) {
            copies.value.push({ recipientId: parseInt(newCopyRecipientId.value), provision: newCopyProvision.value });
            newCopyRecipientId.value = '';
            newCopyProvision.value = '';
        }
    };

    const removeCopy = (index) => {
        copies.value.splice(index, 1);
    };

    const getUserById = (id) => {
        return users.value.find(u => u.id === id);
    };

    const onSubmit = async () => {
      try {
        const formData = new FormData();
            
            // Enviar datos como JSON en el cuerpo de la solicitud
            const requestData = {
              reference: reference.value,
              recipientId: parseInt(recipientId.value),
              provision: provision.value,
              numberOfPages: numberOfPages.value,
              numberOfAttachments: numberOfAttachments.value,
              hasCite: hasCite.value,
              priority: priority.value,
              copies: copies.value.map(copy => ({
                recipientId: parseInt(copy.recipientId),
                provision: copy.provision,
              }))
            };

            // Agregar citeId si hay un cite seleccionado
            if (hasCite.value && cites.value.length > 0) {
              requestData.citeId = cites.value[0].id;
            }

            const response = await apiClient.post('/routing-sheets', requestData, {
              headers: {
                'Content-Type': 'application/json'
              }
            });

            router.push('/routing-sheets');
          } catch (err) {
            error.value = 'Error al crear la hoja de ruta';
            console.error('Error creating routing sheet:', err);
          }
        };

    return {
      reference,
      recipientId,
      provision,
      numberOfPages,
      numberOfAttachments,
      hasCite,
      citeNumber,
      citeFile,
      priority,
      file,
      copies,
      newCopyRecipientId,
      newCopyProvision,
      error,
      users,
      generatedNumber,
      onFileChange,
      onCiteFileChange,
      addCopy,
      removeCopy,
      getUserById,
      onSubmit,
    };
  }
}
</script>

<style scoped>
.routing-sheet-create {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

h2 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 2rem;
  font-weight: 600;
}

.rs-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-row .form-group {
  flex: 1;
}

label {
  font-weight: 500;
  color: #34495e;
}

input[type="text"],
input[type="number"],
select,
textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

input[type="text"]:focus,
input[type="number"]:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.readonly-field {
  background-color: #f5f7fa;
  cursor: not-allowed;
}

.cite-section,
.copy-section {
  border: 1px solid #e4e7ed;
  padding: 1.5rem;
  border-radius: 8px;
  margin-top: 1rem;
  background-color: #fcfcfc;
}

.cite-section h3,
.copy-section h3 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #2c3e50;
  font-size: 1.2rem;
}

.copy-list {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.copy-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f5f7fa;
  border-radius: 6px;
}

button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  background-color: #409eff;
  color: white;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #66b1ff;
}

.copy-item button {
  background-color: #f56c6c;
}

.copy-item button:hover {
  background-color: #f78989;
}

.error {
  color: #f56c6c;
  text-align: center;
  margin-top: 1rem;
}
</style>
