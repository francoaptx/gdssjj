<!-- src/components/DocumentCreate.vue -->
<template>
  <div class="document-create">
    <h2>Crear Nuevo Documento (Cite)</h2>
    <form @submit.prevent="onStepOneSubmit" v-if="step === 1" class="doc-form">
      <h3>Paso 1: Datos del Documento</h3>
      <div class="form-group">
        <label>Tipo de Documento Principal:</label>
        <label>
          <input v-model="type" type="radio" value="INTERNO" /> Interno
        </label>
        <label>
          <input v-model="type" type="radio" value="EXTERNO" /> Externo
        </label>
      </div>
      <div class="form-group">
        <label>Tipo Específico:</label>
        <select v-model="specificType" required>
          <option value="">Seleccione...</option>
          <option value="INFORME">Informe</option>
          <option value="NOTA INTERNA">Nota Interna</option>
          <option v-if="type === 'EXTERNO'" value="NOTA EXTERNA">Nota Externa</option>
        </select>
      </div>
      <div class="form-group">
        <label for="recipient">Destinatario:</label>
        <input v-model="recipient" type="text" id="recipient" required />
      </div>
      <div class="form-group">
        <label for="via">Vía (Opcional):</label>
        <input v-model="via" type="text" id="via" />
      </div>
      <div class="form-group">
        <label for="reference">Referencia:</label>
        <input v-model="reference" type="text" id="reference" required />
      </div>
      <button type="submit">Siguiente</button>
    </form>

    <div v-if="step === 2" class="doc-step-two">
      <h3>Paso 2: Generar Plantilla</h3>
      <p>Se ha generado el número de cite: <strong>{{ generatedCiteNumber }}</strong>. Cópielo.</p>
      <p>Descargue la plantilla de Word y edítela.</p>
      <button @click="downloadTemplate" class="btn btn-primary">Descargar Plantilla</button>
      <button @click="goToStepThree" class="btn btn-secondary">He editado el documento, continuar</button>
    </div>

    <form @submit.prevent="onStepThreeSubmit" v-if="step === 3" class="doc-form">
      <h3>Paso 3: Subir Documento Editado</h3>
      <p>El número de cite asignado es: <strong>{{ generatedCiteNumber }}</strong>.</p>
      <div class="form-group">
        <label for="file">Seleccionar Archivo Editado (.docx, .pdf):</label>
        <input @change="onFileChange" type="file" id="file" accept=".docx,.pdf" required />
      </div>
      <button type="submit">Subir Documento</button>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '../services/api';

export default {
  name: 'DocumentCreate',
  setup() {
    const step = ref(1);
    const type = ref('');
    const specificType = ref('');
    const recipient = ref('');
    const via = ref('');
    const reference = ref('');
    const generatedCiteNumber = ref('');
    const file = ref(null);
    const error = ref('');
    const router = useRouter();

    const onStepOneSubmit = async () => {
      // Simular generación de número de cite (el backend lo haría)
      // En la práctica, se enviarían los datos al backend para que genere el cite y devuelva el número
      // Por ahora, simulamos una respuesta del backend
      try {
          const response = await apiClient.post('/cites', {
              type: type.value,
              specificType: specificType.value,
              recipient: recipient.value,
              via: via.value,
              reference: reference.value,
          });
          generatedCiteNumber.value = response.data.number; // Suponiendo que el backend devuelve el número generado
          step.value = 2;
      } catch (err) {
          console.error('Error creating cite stub:', err);
          error.value = 'Error al crear el cite.';
      }
    };

    const downloadTemplate = () => {
      // En un entorno real, este link apuntaría a un archivo estático o generado dinámicamente por el backend
      const link = document.createElement('a');
      link.href = '/templates/template.docx'; // Ruta relativa al directorio public
      link.download = `Plantilla_Cite_${generatedCiteNumber.value}.docx`;
      link.click();
    };

    const goToStepThree = () => {
        step.value = 3;
    };

    const onFileChange = (event) => {
      file.value = event.target.files[0];
    };

    const onStepThreeSubmit = async () => {
      if (!file.value) {
          error.value = 'Por favor, seleccione un archivo.';
          return;
      }
      const formData = new FormData();
      formData.append('file', file.value);

      try {
        await apiClient.post(`/documents/cite/${generatedCiteNumber.value.split('-')[1]}/upload`, // El ID del cite se extrae del número generado
                             formData,
                             {
                                headers: {
                                    'Content-Type': 'multipart/form-data'
                                }
                             });
        alert('Documento subido exitosamente!');
        router.push('/cites'); // Redirigir a la lista de cites
      } catch (err) {
        console.error('Error uploading document:', err);
        error.value = 'Error al subir el documento.';
      }
    };

    return {
      step,
      type,
      specificType,
      recipient,
      via,
      reference,
      generatedCiteNumber,
      file,
      error,
      onStepOneSubmit,
      downloadTemplate,
      goToStepThree,
      onFileChange,
      onStepThreeSubmit,
    };
  },
};
</script>

<style scoped>
.doc-form, .doc-step-two {
  max-width: 600px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1rem;
}

.doc-form label {
  display: block;
  margin-bottom: 0.5rem;
}

.doc-form input,
.doc-form select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.doc-form button {
  padding: 0.75rem 1.5rem;
  margin-right: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.doc-form button[type='submit'] {
  background-color: #007bff;
  color: white;
}

.doc-form button[type='submit']:hover {
  background-color: #0056b3;
}

.btn {
  padding: 0.75rem 1.5rem;
  margin-right: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
}

.btn-primary { background-color: #007bff; color: white; }
.btn-secondary { background-color: #6c757d; color: white; }

.error {
  color: red;
  margin-top: 1rem;
}
</style>