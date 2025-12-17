<template>
  <div>
    <h2>Prueba de Oficinas</h2>
    <div v-if="loading">Cargando...</div>
    <div v-if="error" class="error">{{ error }}</div>
    
    <div>
      <h3>Lista de Oficinas</h3>
      <ul>
        <li v-for="office in offices" :key="office.id">
          {{ office.id }} - {{ office.name }}
        </li>
      </ul>
    </div>
    
    <div>
      <h3>Crear/Actualizar Oficina</h3>
      <input v-model="officeName" placeholder="Nombre de la oficina" />
      <button @click="createOffice">Crear</button>
      <button @click="updateOffice" :disabled="!selectedOffice">Actualizar</button>
      <button @click="deleteOffice" :disabled="!selectedOffice">Eliminar</button>
    </div>
    
    <div>
      <h3>Seleccionar Oficina</h3>
      <select v-model="selectedOffice">
        <option value="">Seleccione una oficina</option>
        <option v-for="office in offices" :key="office.id" :value="office.id">
          {{ office.name }}
        </option>
      </select>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import apiClient from '../services/api';

export default {
  name: 'OfficeTest',
  setup() {
    const offices = ref([]);
    const officeName = ref('');
    const selectedOffice = ref('');
    const loading = ref(false);
    const error = ref('');
    
    const fetchOffices = async () => {
      loading.value = true;
      error.value = '';
      try {
        const response = await apiClient.get('/offices');
        offices.value = response.data;
      } catch (err) {
        console.error('Error al obtener oficinas:', err);
        error.value = 'Error al obtener oficinas: ' + (err.response?.data?.message || err.message);
      } finally {
        loading.value = false;
      }
    };
    
    const createOffice = async () => {
      if (!officeName.value.trim()) {
        error.value = 'Ingrese un nombre para la oficina';
        return;
      }
      
      try {
        await apiClient.post('/offices', { name: officeName.value.trim() });
        officeName.value = '';
        await fetchOffices();
      } catch (err) {
        console.error('Error al crear oficina:', err);
        error.value = 'Error al crear oficina: ' + (err.response?.data?.message || err.message);
      }
    };
    
    const updateOffice = async () => {
      if (!selectedOffice.value) {
        error.value = 'Seleccione una oficina para actualizar';
        return;
      }
      
      if (!officeName.value.trim()) {
        error.value = 'Ingrese un nombre para la oficina';
        return;
      }
      
      try {
        await apiClient.put(`/offices/${selectedOffice.value}`, { name: officeName.value.trim() });
        officeName.value = '';
        await fetchOffices();
      } catch (err) {
        console.error('Error al actualizar oficina:', err);
        error.value = 'Error al actualizar oficina: ' + (err.response?.data?.message || err.message);
      }
    };
    
    const deleteOffice = async () => {
      if (!selectedOffice.value) {
        error.value = 'Seleccione una oficina para eliminar';
        return;
      }
      
      try {
        await apiClient.delete(`/offices/${selectedOffice.value}`);
        selectedOffice.value = '';
        await fetchOffices();
      } catch (err) {
        console.error('Error al eliminar oficina:', err);
        error.value = 'Error al eliminar oficina: ' + (err.response?.data?.message || err.message);
      }
    };
    
    onMounted(fetchOffices);
    
    return {
      offices,
      officeName,
      selectedOffice,
      loading,
      error,
      createOffice,
      updateOffice,
      deleteOffice
    };
  }
};
</script>

<style scoped>
.error {
  color: red;
  margin: 10px 0;
}
</style>