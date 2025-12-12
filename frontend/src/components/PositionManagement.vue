<template>
  <div class="position-management">
    <h2>Gestión de Cargos/Posiciones</h2>
    
    <!-- Formulario para crear/editar posiciones -->
    <div class="form-section">
      <h3>{{ editingPosition ? 'Editar Cargo' : 'Crear Nuevo Cargo' }}</h3>
      <form @submit.prevent="savePosition">
        <div class="form-group">
          <label for="positionName">Nombre del Cargo:</label>
          <input 
            id="positionName" 
            v-model="positionForm.name" 
            type="text" 
            required 
            class="form-control"
          />
        </div>
        
        <div class="form-group">
          <label for="positionDescription">Descripción:</label>
          <textarea 
            id="positionDescription" 
            v-model="positionForm.description" 
            class="form-control"
            rows="3"
          ></textarea>
        </div>
        
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">
            {{ editingPosition ? 'Actualizar' : 'Crear' }}
          </button>
          <button 
            v-if="editingPosition" 
            type="button" 
            @click="cancelEdit" 
            class="btn btn-secondary"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
    
    <!-- Lista de posiciones -->
    <div class="list-section">
      <h3>Lista de Cargos</h3>
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="position in positions" :key="position.id">
            <td>{{ position.id }}</td>
            <td>{{ position.name }}</td>
            <td>{{ position.description || 'N/A' }}</td>
            <td>
              <button @click="editPosition(position)" class="btn btn-sm btn-warning">Editar</button>
              <button @click="deletePosition(position.id)" class="btn btn-sm btn-danger">Eliminar</button>
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
  name: 'PositionManagement',
  setup() {
    const positions = ref([]);
    const positionForm = ref({
      name: '',
      description: ''
    });
    const editingPosition = ref(null);

    const fetchPositions = async () => {
      try {
        const response = await apiClient.get('/positions');
        positions.value = response.data;
      } catch (err) {
        console.error('Error fetching positions:', err);
        alert('Error al cargar los cargos.');
      }
    };

    const savePosition = async () => {
      try {
        if (editingPosition.value) {
          // Actualizar posición existente
          await apiClient.patch(`/positions/${editingPosition.value.id}`, positionForm.value);
          alert('Cargo actualizado exitosamente.');
        } else {
          // Crear nueva posición
          await apiClient.post('/positions', positionForm.value);
          alert('Cargo creado exitosamente.');
        }
        
        // Resetear formulario y refrescar lista
        positionForm.value = { name: '', description: '' };
        editingPosition.value = null;
        fetchPositions();
      } catch (err) {
        console.error('Error saving position:', err);
        alert('Error al guardar el cargo.');
      }
    };

    const editPosition = (position) => {
      editingPosition.value = position;
      positionForm.value = { 
        name: position.name, 
        description: position.description || '' 
      };
    };

    const cancelEdit = () => {
      editingPosition.value = null;
      positionForm.value = { name: '', description: '' };
    };

    const deletePosition = async (id) => {
      if (!confirm('¿Está seguro de que desea eliminar este cargo?')) return;
      
      try {
        await apiClient.delete(`/positions/${id}`);
        alert('Cargo eliminado exitosamente.');
        fetchPositions();
      } catch (err) {
        console.error('Error deleting position:', err);
        alert('Error al eliminar el cargo.');
      }
    };

    onMounted(fetchPositions);

    return {
      positions,
      positionForm,
      editingPosition,
      savePosition,
      editPosition,
      cancelEdit,
      deletePosition
    };
  }
};
</script>

<style scoped>
.position-management {
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
</style>