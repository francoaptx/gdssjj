<template>
  <div class="routing-sheet-create-simple">
    <h2>Crear Nueva Hoja de Ruta (Versión Simple)</h2>
    <div v-if="loading">
      <p>Cargando...</p>
    </div>
    <div v-else-if="error">
      <p class="error">Error: {{ error }}</p>
      <button @click="retryLoad">Reintentar</button>
    </div>
    <form v-else @submit.prevent="onSubmit">
      <div class="form-group">
        <label for="reference">Referencia:</label>
        <input v-model="reference" type="text" id="reference" required />
      </div>
      
      <div class="form-group">
        <label for="recipientId">Destinatario:</label>
        <select v-model="recipientId" id="recipientId" required>
          <option value="">Seleccione un destinatario</option>
          <option v-for="user in users" :key="user.id" :value="user.id">
            {{ user.name }}
          </option>
        </select>
      </div>
      
      <div class="form-group">
        <label for="provision">Proveído:</label>
        <textarea v-model="provision" id="provision" required></textarea>
      </div>
      
      <button type="submit">Crear Hoja de Ruta</button>
    </form>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '../services/api';

export default {
  name: 'RoutingSheetCreateSimple',
  setup() {
    const router = useRouter();
    const loading = ref(true);
    const error = ref(null);
    const reference = ref('');
    const recipientId = ref('');
    const provision = ref('');
    const users = ref([]);

    const fetchUsers = async () => {
      try {
        const response = await apiClient.get('/users');
        users.value = response.data;
      } catch (err) {
        console.error('Error fetching users:', err);
        throw err;
      }
    };

    const loadData = async () => {
      loading.value = true;
      error.value = null;
      
      try {
        await fetchUsers();
      } catch (err) {
        error.value = 'Error al cargar los datos';
        console.error('Error loading data:', err);
      } finally {
        loading.value = false;
      }
    };

    const retryLoad = () => {
      loadData();
    };

    const onSubmit = async () => {
      try {
        await apiClient.post('/routing-sheets', {
          reference: reference.value,
          recipientId: parseInt(recipientId.value),
          provision: provision.value,
          numberOfPages: 0,
          numberOfAttachments: 0,
          hasCite: false,
          priority: 'NORMAL'
        });
        
        router.push('/routing-sheets');
      } catch (err) {
        console.error('Error creating routing sheet:', err);
        alert('Error al crear la hoja de ruta');
      }
    };

    onMounted(() => {
      loadData();
    });

    return {
      loading,
      error,
      reference,
      recipientId,
      provision,
      users,
      onSubmit,
      retryLoad
    };
  }
};
</script>

<style scoped>
.routing-sheet-create-simple {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1rem;
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
  font-size: 1rem;
}

textarea {
  min-height: 100px;
}

button {
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.error {
  color: red;
  padding: 1rem;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
}
</style>