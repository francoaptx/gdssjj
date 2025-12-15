<!-- src/components/RoutingSheetCreate.vue -->
<template>
  <div class="routing-sheet-create">
    <h2>Crear Nueva Hoja de Ruta</h2>
    <form @submit.prevent="onSubmit" class="rs-form">
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

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '../services/api';

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

// Watch for changes in hasCite
watch(hasCite, generateCiteNumber);

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
    const requestData = {
      number: generatedNumber.value,
      reference: reference.value,
      recipientId: parseInt(recipientId.value),
      provision: provision.value,
      numberOfPages: numberOfPages.value || null,
      numberOfAttachments: numberOfAttachments.value || null,
      hasCite: hasCite.value,
      priority: priority.value,
    };

    const response = await apiClient.post('/routing-sheets', requestData);

    // II.2.1: Crear copias después de crear la hoja de ruta
    for (const copy of copies.value) {
        await apiClient.post('/copies', {
            routingSheetId: response.data.id,
            recipientId: copy.recipientId,
            provision: copy.provision,
        });
    }

    // TODO: Handle cite file upload if provided
    // This would require a separate endpoint or multipart/form-data handling

    alert('Hoja de Ruta creada exitosamente!');
    router.push('/routing-sheets'); // Redirigir a la lista
  } catch (err) {
    console.error('Error creating routing sheet:', err);
    error.value = 'Error al crear la hoja de ruta.';
  }
};
</script>

<style scoped>
.rs-form {
  max-width: 800px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1rem;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-row .form-group {
  flex: 1;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

input, select, textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.copy-section {
  margin-top: 2rem;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.copy-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background-color: #f8f9fa;
  margin-bottom: 0.5rem;
}

.error {
  color: red;
  margin-top: 1rem;
}

/* New styling for the cite section */
.cite-section {
  border: 2px solid #007bff;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: #f8f9ff;
}

.cite-section .form-group:last-child {
  margin-bottom: 0;
}
</style>