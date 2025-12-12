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
      <div v-if="hasCite" class="form-group">
        <label for="citeId">Seleccionar Cite:</label>
        <select v-model="citeId" id="citeId">
          <option value="">Seleccione un cite</option>
          <option v-for="cite in cites" :key="cite.id" :value="cite.id">{{ cite.number }} - {{ cite.reference }}</option>
        </select>
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
        <label for="file">Adjuntar Archivo (Opcional, max 5MB):</label>
        <input @change="onFileChange" type="file" id="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" />
      </div>
      <!-- II.2.1: Envío de Copias -->
      <div class="form-group">
        <h3>Enviar Copias</h3>
        <div class="copy-entry">
          <select v-model="newCopyRecipientId">
            <option value="">Agregar destinatario de copia...</option>
            <option v-for="user in users.filter(u => u.id !== recipientId)" :key="user.id" :value="user.id">{{ user.name }}</option>
          </select>
          <input v-model="newCopyProvision" type="text" placeholder="Proveído para la copia..." />
          <button @click="addCopy" type="button">+</button>
        </div>
        <ul>
          <li v-for="(copy, index) in copies" :key="index">
            {{ getUserById(copy.recipientId)?.name }} - {{ copy.provision }}
            <button @click="removeCopy(index)" type="button">X</button>
          </li>
        </ul>
      </div>
      <button type="submit">Crear Hoja de Ruta</button>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '../services/api';

export default {
  name: 'RoutingSheetCreate',
  setup() {
    const reference = ref('');
    const recipientId = ref('');
    const provision = ref('');
    const numberOfPages = ref(0);
    const numberOfAttachments = ref(0);
    const hasCite = ref(false);
    const citeId = ref('');
    const priority = ref('NORMAL');
    const file = ref(null); // Para manejar el archivo adjunto
    const copies = ref([]); // [{recipientId, provision}]
    const newCopyRecipientId = ref('');
    const newCopyProvision = ref('');
    const error = ref('');
    const router = useRouter();
    const users = ref([]);
    const cites = ref([]);

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

    onMounted(fetchUsersAndCites);

    const onFileChange = (event) => {
      file.value = event.target.files[0];
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
          reference: reference.value,
          recipient: { id: parseInt(recipientId.value) }, // Enviar solo el ID
          provision: provision.value,
          numberOfPages: numberOfPages.value || null,
          numberOfAttachments: numberOfAttachments.value || null,
          hasCite: hasCite.value,
          priority: priority.value,
        };

        if (hasCite.value && citeId.value) {
            requestData.cite = { id: parseInt(citeId.value) };
        }

        const response = await apiClient.post('/routing-sheets', requestData);

        // II.2.1: Crear copias después de crear la hoja de ruta
        for (const copy of copies.value) {
            await apiClient.post('/copies', {
                routingSheetId: response.data.id,
                recipientId: copy.recipientId,
                provision: copy.provision,
            });
        }

        // TODO: Manejar la subida de archivos si se adjunta uno
        // Esto puede requerir un endpoint diferente o multipart/form-data

        alert('Hoja de Ruta creada exitosamente!');
        router.push('/routing-sheets'); // Redirigir a la lista
      } catch (err) {
        console.error('Error creating routing sheet:', err);
        error.value = 'Error al crear la hoja de ruta.';
      }
    };

    return {
      reference,
      recipientId,
      provision,
      numberOfPages,
      numberOfAttachments,
      hasCite,
      citeId,
      priority,
      file, // No se usa directamente en el submit actual
      copies,
      newCopyRecipientId,
      newCopyProvision,
      error,
      users,
      cites,
      onFileChange,
      addCopy,
      removeCopy,
      getUserById,
      onSubmit,
    };
  },
};
</script>

<style scoped>
.rs-form {
  max-width: 600px;
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

.rs-form label {
  display: block;
  margin-bottom: 0.5rem;
}

.rs-form input,
.rs-form select,
.rs-form textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.copy-entry {
    display: flex;
    gap: 0.5rem;
    align-items: center;
}

.copy-entry input, .copy-entry select {
    flex: 1;
}

.copy-entry button {
    padding: 0.25rem 0.5rem;
    cursor: pointer;
}

.rs-form ul {
    list-style-type: none;
    padding: 0;
}

.rs-form li {
    display: flex;
    justify-content: space-between;
    padding: 0.25rem 0;
    border-bottom: 1px solid #eee;
}

.rs-form button[type='submit'] {
  padding: 0.75rem 1.5rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.rs-form button[type='submit']:hover {
  background-color: #0056b3;
}

.error {
  color: red;
  margin-top: 1rem;
}
</style>