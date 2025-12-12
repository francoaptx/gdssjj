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
import { ref } from 'vue';
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

    const onSubmit = async () => {
      try {
        error.value = '';
        console.log('Intentando iniciar sesión con:', { 
          username: username.value, 
          password: password.value 
        });
        
        const response = await apiClient.post('/auth/login', {
          username: username.value,
          password: password.value,
        });

        console.log('Respuesta del servidor:', response);

        // Verificar que el backend devuelve { access_token, user }
        const { access_token, user } = response.data;

        if (!access_token) {
          throw new Error('Token de acceso no encontrado en la respuesta');
        }

        // Guardar token y usuario en Vuex y localStorage
        store.dispatch('login', { token: access_token, user });

        // Redirigir al dashboard
        router.push('/dashboard');
      } catch (err) {
        console.error('Error de inicio de sesión completo:', err);
        
        if (err.response) {
          // Error de respuesta del servidor
          console.log('Error de respuesta:', err.response);
          if (err.response.status === 401) {
            error.value = 'Credenciales incorrectas.';
          } else {
            error.value = `Error del servidor: ${err.response.status} - ${err.response.statusText}`;
          }
        } else if (err.request) {
          // Error de red
          console.log('Error de solicitud:', err.request);
          error.value = 'Error de red. Verifique su conexión.';
        } else {
          // Otro tipo de error
          console.log('Error desconocido:', err.message);
          error.value = `Error: ${err.message}`;
        }
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