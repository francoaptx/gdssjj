<!-- src/components/Register.vue -->
<template>
  <div class="register-container">
    <form @submit.prevent="onSubmit" class="register-form">
      <h2>Registrar Usuario</h2>
      <div>
        <label for="name">Nombre Completo:</label>
        <input v-model="name" type="text" id="name" required />
      </div>
      <div>
        <label for="username">Usuario:</label>
        <input v-model="username" type="text" id="username" required />
      </div>
      <div>
        <label for="password">Contraseña:</label>
        <input v-model="password" type="password" id="password" required />
      </div>
      <div>
        <label for="officeId">Oficina:</label>
        <select v-model="officeId" id="officeId" required>
          <option value="">Seleccione una oficina</option>
          <option v-for="office in offices" :key="office.id" :value="office.id">{{ office.name }}</option>
        </select>
      </div>
      <div>
        <label for="roleId">Cargo:</label>
        <select v-model="roleId" id="roleId" required>
          <option value="">Seleccione un cargo</option>
          <option v-for="role in roles" :key="role.id" :value="role.id">{{ role.name }}</option>
        </select>
      </div>
      <div>
        <label for="contract">Contrato (Opcional):</label>
        <input v-model="contract" type="text" id="contract" />
      </div>
      <button type="submit">Registrar</button>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '../services/api';

export default {
  name: 'Register',
  setup() {
    const name = ref('');
    const username = ref('');
    const password = ref('');
    const officeId = ref('');
    const roleId = ref('');
    const contract = ref('');
    const error = ref('');
    const router = useRouter();
    const offices = ref([]);
    const roles = ref([]);

    const fetchOfficesAndRoles = async () => {
      try {
        const [officesResponse, rolesResponse] = await Promise.all([
          apiClient.get('/offices'),
          apiClient.get('/roles'),
        ]);
        offices.value = officesResponse.data;
        roles.value = rolesResponse.data;
      } catch (err) {
        console.error('Error fetching offices or roles:', err);
        error.value = 'Error al cargar oficinas y cargos.';
      }
    };

    onMounted(fetchOfficesAndRoles);

    const onSubmit = async () => {
      try {
        await apiClient.post('/users', {
          name: name.value,
          username: username.value,
          password: password.value,
          officeId: parseInt(officeId.value),
          roleId: parseInt(roleId.value),
          contract: contract.value,
        });
        alert('Usuario registrado exitosamente!');
        router.push('/login'); // Redirigir al login después de registrar
      } catch (err) {
        console.error(err);
        error.value = 'Error al registrar usuario. Asegúrese de que el usuario no exista.';
      }
    };

    return {
      name,
      username,
      password,
      officeId,
      roleId,
      contract,
      error,
      offices,
      roles,
      onSubmit,
    };
  },
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0;
}

.register-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.register-form div {
  margin-bottom: 1rem;
}

.register-form label {
  display: block;
  margin-bottom: 0.5rem;
}

.register-form input,
.register-form select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.register-form button {
  width: 100%;
  padding: 0.75rem;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.register-form button:hover {
  background-color: #218838;
}

.error {
  color: red;
  margin-top: 1rem;
}
</style>