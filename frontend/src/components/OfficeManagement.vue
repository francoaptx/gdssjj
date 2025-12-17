<template>
  <div class="office-management">
    <h2>Gestión de Oficinas</h2>
    
    <!-- Mostrar estado de carga -->
    <div v-if="loading" class="alert alert-info">
      Cargando oficinas...
    </div>
    
    <!-- Mostrar errores -->
    <div v-if="error" class="alert alert-danger">
      {{ error }}
    </div>
    
    <!-- Formulario para crear/editar oficinas -->
    <div class="form-section">
      <h3>{{ editingOffice ? 'Editar Oficina' : 'Crear Nueva Oficina' }}</h3>
      <form @submit.prevent="saveOffice">
        <div class="form-group">
          <label for="officeName">Nombre de la Oficina:</label>
          <input 
            id="officeName" 
            v-model="officeForm.name" 
            type="text" 
            required 
            class="form-control"
          />
        </div>
        
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">
            {{ editingOffice ? 'Actualizar' : 'Crear' }}
          </button>
          <button 
            v-if="editingOffice" 
            type="button" 
            @click="cancelEdit" 
            class="btn btn-secondary"
            :disabled="loading"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
    
    <!-- Lista de oficinas -->
    <div class="list-section">
      <h3>Lista de Oficinas</h3>
      <div v-if="offices.length === 0 && !loading" class="alert alert-warning">
        No se encontraron oficinas.
      </div>
      <table v-else class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="office in offices" :key="office.id">
            <td>{{ office.id }}</td>
            <td>{{ office.name }}</td>
            <td>
              <button @click="editOffice(office)" class="btn btn-sm btn-warning" :disabled="loading">Editar</button>
              <button @click="deleteOffice(office.id)" class="btn btn-sm btn-danger" :disabled="loading">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import apiClient from '../services/api';

export default {
  name: 'OfficeManagement',
  setup() {
    const offices = ref([]);
    const officeForm = ref({
      name: ''
    });
    const editingOffice = ref(null);
    const loading = ref(false);
    const error = ref(null);

    const fetchOffices = async () => {
      loading.value = true;
      error.value = null;
      try {
        const response = await apiClient.get('/offices');
        offices.value = response.data;
      } catch (err) {
        error.value = 'Error al cargar las oficinas: ' + (err.response?.data?.message || err.message);
        alert(error.value);
      } finally {
        loading.value = false;
      }
    };

    const saveOffice = async () => {
      if (!officeForm.value.name.trim()) {
        alert('Por favor ingrese un nombre para la oficina');
        return;
      }

      try {
        if (editingOffice.value) {
          // Actualizar oficina existente
            await apiClient.put(`/offices/${editingOffice.value.id}`, { name: officeForm.value.name.trim() });
          alert('Oficina actualizada exitosamente.');
        } else {
          // Crear nueva oficina
            await apiClient.post('/offices', { name: officeForm.value.name.trim() });
          alert('Oficina creada exitosamente.');
        }
        
        // Resetear formulario y refrescar lista
        officeForm.value = { name: '' };
        editingOffice.value = null;
        await fetchOffices();
      } catch (err) {
        if (err.response && err.response.status === 400) {
          alert('Error: ' + err.response.data.message);
        } else if (err.response && err.response.status === 401) {
          alert('Error de autenticación. Por favor inicie sesión nuevamente.');
        } else if (err.response && err.response.status === 403) {
          alert('No tiene permisos para realizar esta acción.');
        } else {
          alert('Error al guardar la oficina: ' + (err.response?.data?.message || err.message));
        }
      }
    };

    const editOffice = (office) => {
      editingOffice.value = office;
      officeForm.value = { name: office.name };
    };

    const cancelEdit = () => {
      editingOffice.value = null;
      officeForm.value = { name: '' };
    };

    const deleteOffice = async (id) => {
      if (!confirm('¿Está seguro de que desea eliminar esta oficina?')) return;
      
      try {
        await apiClient.delete(`/offices/${id}`);
        alert('Oficina eliminada exitosamente.');
        await fetchOffices();
      } catch (err) {
        if (err.response && err.response.status === 404) {
          alert('Error: Oficina no encontrada.');
        } else if (err.response && err.response.status === 409) {
          // Conflict - oficina tiene usuarios asociados
          alert('No se puede eliminar la oficina porque tiene usuarios asociados.');
        } else {
          alert('Error al eliminar la oficina: ' + (err.response?.data?.message || err.message));
        }
      }
    };

    onMounted(fetchOffices);

    return {
      offices,
      officeForm,
      editingOffice,
      loading,
      error,
      saveOffice,
      editOffice,
      cancelEdit,
      deleteOffice
    };
  }
};
</script>

<style scoped>
.office-management {
  padding: 20px;
}

.form-section, .list-section {
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-control {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.form-actions {
  margin-top: 20px;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th, .table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.table th {
  background-color: #f2f2f2;
}

.btn {
  padding: 0.25rem 0.5rem;
  margin-right: 0.25rem;
  text-decoration: none;
  border-radius: 4px;
  cursor: pointer;
  border: none;
  font-size: 0.875rem;
}

.btn-primary { background-color: #007bff; color: white; }
.btn-secondary { background-color: #6c757d; color: white; }
.btn-warning { background-color: #ffc107; color: black; }
.btn-danger { background-color: #dc3545; color: white; }

.btn-sm {
  padding: 0.2rem 0.4rem;
  font-size: 0.75rem;
}

.alert {
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
  border-radius: 0.25rem;
}

.alert-info {
  color: #0c5460;
  background-color: #d1ecf1;
  border-color: #bee5eb;
}

.alert-warning {
  color: #856404;
  background-color: #fff3cd;
  border-color: #ffeaa7;
}

.alert-danger {
  color: #721c24;
  background-color: #f8d7da;
  border-color: #f5c6cb;
}
</style>