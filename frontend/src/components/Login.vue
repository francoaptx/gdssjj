<!-- src/components/Login.vue --> 
<template>
  <div class="login-container">
    <form @submit.prevent="onSubmit" class="login-form">
      <h2>Iniciar Sesión</h2>
      <div>
        <label for="username">Usuario:</label>
        <input v-model="username" type="text" id="username" required />
      </div>
      <div>
        <label for="password">Contraseña:</label>
        <input v-model="password" type="password" id="password" required />
      </div>
      <button type="submit">Ingresar</button>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import apiClient from '../services/api';

export default {
  name: 'Login',
  setup() {
    const username = ref('');
    const password = ref('');
    const error = ref('');
    const router = useRouter();
    const store = useStore();
    const isAuthenticated = computed(() => store.getters.isAuthenticated);

    onMounted(() => {
      if (isAuthenticated.value) {
        router.push('/dashboard');
      }
    });

    const onSubmit = async () => {
      try {
        const response = await apiClient.post('/auth/login', { 
          username: username.value, 
          password: password.value 
        });
        
        // Almacenar token y datos de usuario
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Actualizar el estado de Vuex
        const user = response.data.user;
        store.dispatch('login', { token: response.data.access_token, user });
        
        // Redirección basada en el rol del usuario
        if (user && user.role && user.role.name === 'ADMIN') {
          // Si es admin, redirigir a la página de gestión de usuarios
          router.push('/users');
        } else {
          // Para otros usuarios, redirigir al dashboard
          router.push('/dashboard');
        }
      } catch (err) {
        if (err.response) {
          // El servidor respondió con un estado de error (4xx, 5xx)
          if (err.response.status === 401) {
            error.value = 'Nombre de usuario o contraseña incorrectos.';
          } else {
            error.value = `Error del servidor: ${err.response.status}. Inténtelo de nuevo más tarde.`;
          }
        } else {
          // Error de red o el servidor no responde
          error.value = 'No se pudo conectar con el servidor. Verifique su conexión a internet.';
        }
        console.error('Error de inicio de sesión:', err);
      }
    };

    return {
      username,
      password,
      error,
      onSubmit,
    };
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0;
}

.login-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.login-form div {
  margin-bottom: 1rem;
}

.login-form label {
  display: block;
  margin-bottom: 0.5rem;
}

.login-form input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.login-form button {
  width: 100%;
  padding: 0.75rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.login-form button:hover {
  background-color: #0056b3;
}

.error {
  color: red;
  margin-top: 1rem;
}
</style>