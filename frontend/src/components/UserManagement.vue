<!-- src/components/UserManagement.vue -->
<template>
  <div class="user-management">
    <h2>Gestión de Usuarios</h2>
    
    <!-- Formulario para crear/editar usuarios -->
    <div class="form-section">
      <h3>{{ editingUser ? 'Editar Usuario' : 'Crear Nuevo Usuario' }}</h3>
      <form @submit.prevent="saveUser">
        <div class="form-row">
          <div class="form-group">
            <label for="userName">Nombre:</label>
            <input 
              id="userName" 
              v-model="userForm.name" 
              type="text" 
              required 
              class="form-control"
            />
          </div>
          
          <div class="form-group">
            <label for="userUsername">Nombre de Usuario:</label>
            <input 
              id="userUsername" 
              v-model="userForm.username" 
              type="text" 
              required 
              class="form-control"
            />
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="userPassword">
              {{ editingUser ? 'Nueva Contraseña (opcional)' : 'Contraseña:' }}
            </label>
            <input 
              id="userPassword" 
              v-model="userForm.password" 
              type="password" 
              :required="!editingUser"
              class="form-control"
            />
          </div>
          
          <div class="form-group">
            <label for="userContract">Tipo de Contrato:</label>
            <input 
              id="userContract" 
              v-model="userForm.contract" 
              type="text" 
              class="form-control"
            />
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="userOffice">Oficina:</label>
            <select 
              id="userOffice" 
              v-model="userForm.officeId" 
              required 
              class="form-control"
            >
              <option value="">Seleccione una oficina</option>
              <option 
                v-for="office in offices" 
                :key="office.id" 
                :value="office.id"
              >
                {{ office.name }}
              </option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="userPosition">Cargo:</label>
            <select 
              id="userPosition" 
              v-model="userForm.positionId" 
              required 
              class="form-control"
            >
              <option value="">Seleccione un cargo</option>
              <option 
                v-for="position in positions" 
                :key="position.id" 
                :value="position.id"
              >
                {{ position.name }}
              </option>
            </select>
          </div>
        </div>
        
        <div class="form-group">
          <label for="userRole">Rol:</label>
          <select 
            id="userRole" 
            v-model="userForm.roleId" 
            required 
            class="form-control"
          >
            <option value="">Seleccione un rol</option>
            <option 
              v-for="role in roles" 
              :key="role.id" 
              :value="role.id"
            >
              {{ role.name }}
            </option>
          </select>
        </div>
        
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">
            {{ editingUser ? 'Actualizar' : 'Crear' }}
          </button>
          <button 
            v-if="editingUser" 
            type="button" 
            @click="cancelEdit" 
            class="btn btn-secondary"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
    
    <!-- Lista de usuarios -->
    <div class="list-section">
      <h3>Lista de Usuarios</h3>
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Usuario</th>
            <th>Oficina</th>
            <th>Cargo</th>
            <th>Rol</th>
            <th>Contrato</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.office.name }}</td>
            <td>{{ user.position.name }}</td>
            <td>{{ user.role.name }}</td>
            <td>{{ user.contract || 'N/A' }}</td>
            <td>
              <button @click="editUser(user)" class="btn btn-sm btn-warning">Editar</button>
              <button @click="deleteUser(user.id)" class="btn btn-sm btn-danger">Eliminar</button>
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
  name: 'UserManagement',
  setup() {
    const users = ref([]);
    const offices = ref([]);
    const positions = ref([]);
    const roles = ref([]);
    
    const userForm = ref({
      name: '',
      username: '',
      password: '',
      contract: '',
      officeId: '',
      positionId: '',
      roleId: ''
    });
    
    const editingUser = ref(null);

    const fetchUsers = async () => {
      try {
        const response = await apiClient.get('/users');
        users.value = response.data;
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };
    
    const fetchOffices = async () => {
      try {
        const response = await apiClient.get('/offices');
        offices.value = response.data;
      } catch (err) {
        console.error('Error fetching offices:', err);
      }
    };
    
    const fetchPositions = async () => {
      try {
        const response = await apiClient.get('/positions');
        positions.value = response.data;
      } catch (err) {
        console.error('Error fetching positions:', err);
      }
    };
    
    const fetchRoles = async () => {
      try {
        const response = await apiClient.get('/roles');
        roles.value = response.data;
      } catch (err) {
        console.error('Error fetching roles:', err);
      }
    };

    const saveUser = async () => {
      try {
        if (editingUser.value) {
          // Actualizar usuario existente
          await apiClient.patch(`/users/${editingUser.value.id}`, userForm.value);
          alert('Usuario actualizado exitosamente.');
        } else {
          // Crear nuevo usuario
          await apiClient.post('/users', userForm.value);
          alert('Usuario creado exitosamente.');
        }
        
        // Resetear formulario y refrescar lista
        resetForm();
        fetchUsers();
      } catch (err) {
        console.error('Error saving user:', err);
        alert('Error al guardar el usuario.');
      }
    };

    const editUser = (user) => {
      editingUser.value = user;
      userForm.value = { 
        name: user.name,
        username: user.username,
        password: '',
        contract: user.contract || '',
        officeId: user.office.id,
        positionId: user.position.id,
        roleId: user.role.id
      };
    };

    const cancelEdit = () => {
      editingUser.value = null;
      resetForm();
    };
    
    const resetForm = () => {
      userForm.value = {
        name: '',
        username: '',
        password: '',
        contract: '',
        officeId: '',
        positionId: '',
        roleId: ''
      };
    };

    const deleteUser = async (id) => {
      if (!confirm('¿Está seguro de que desea eliminar este usuario?')) return;
      try {
        await apiClient.delete(`/users/${id}`);
        alert('Usuario eliminado exitosamente.');
        // Recargar la lista
        fetchUsers();
      } catch (err) {
        console.error('Error deleting user:', err);
        alert('Error al eliminar el usuario.');
      }
    };

    onMounted(async () => {
      await fetchUsers();
      await fetchOffices();
      await fetchPositions();
      await fetchRoles();
    });

    return {
      users,
      offices,
      positions,
      roles,
      userForm,
      editingUser,
      saveUser,
      editUser,
      cancelEdit,
      deleteUser
    };
  },
};
</script>

<style scoped>
.user-management {
  padding: 20px;
}

.form-section, .list-section {
  margin-bottom: 30px;
}

.form-row {
  display: flex;
  gap: 15px;
}

.form-group {
  flex: 1;
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