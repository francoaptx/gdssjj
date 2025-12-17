<template>
  <div class="test-form">
    <h2>Formulario de Prueba</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="testInput">Campo de prueba:</label>
        <input type="text" id="testInput" v-model="testInput" />
      </div>
      <button type="submit">Enviar</button>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'TestForm',
  setup() {
    const testInput = ref('');

    const handleSubmit = () => {
      alert(`Valor ingresado: ${testInput.value}`);
    };

    return {
      testInput,
      handleSubmit
    };
  }
};
</script>

<style scoped>
.test-form {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

input[type="text"] {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

button {
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>