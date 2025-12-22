<template>
  <div class="test-primevue">
    <Card>
      <template #header>
        <div class="p-3">
          <h2>Prueba de Componentes PrimeVue</h2>
        </div>
      </template>
      <template #content>
        <div class="p-grid p-fluid">
          <div class="p-col-12">
            <Card>
              <template #title>Botones</template>
              <template #content>
                <div class="p-d-flex p-flex-wrap p-ai-center p-jc-center" style="gap: 1rem">
                  <Button label="Primary" />
                  <Button label="Secondary" class="p-button-secondary" />
                  <Button label="Success" class="p-button-success" />
                  <Button label="Warning" class="p-button-warning" />
                  <Button label="Danger" class="p-button-danger" />
                  <Button label="Info" class="p-button-info" />
                  <Button icon="pi pi-check" class="p-button-rounded p-button-success" />
                  <Button icon="pi pi-trash" class="p-button-rounded p-button-danger" />
                </div>
              </template>
            </Card>
          </div>
          
          <div class="p-col-12">
            <Card>
              <template #title>Campos de Entrada</template>
              <template #content>
                <div class="p-fluid">
                  <div class="p-field p-mb-3">
                    <label for="text-input">Texto</label>
                    <InputText id="text-input" placeholder="Texto de ejemplo" />
                  </div>
                  
                  <div class="p-field p-mb-3">
                    <label for="textarea">Área de Texto</label>
                    <Textarea id="textarea" placeholder="Área de texto de ejemplo" rows="3" />
                  </div>
                  
                  <div class="p-field p-mb-3">
                    <label for="disabled-input">Campo Deshabilitado</label>
                    <InputText id="disabled-input" placeholder="Texto deshabilitado" disabled />
                  </div>
                </div>
              </template>
            </Card>
          </div>
          
          <div class="p-col-12">
            <Card>
              <template #title>Tabla de Ejemplo</template>
              <template #content>
                <DataTable :value="sampleData" responsiveLayout="scroll" stripedRows>
                  <Column field="id" header="ID"></Column>
                  <Column field="name" header="Nombre"></Column>
                  <Column field="status" header="Estado">
                    <template #body="slotProps">
                      <Tag :severity="getSeverity(slotProps.data.status)">
                        {{ slotProps.data.status }}
                      </Tag>
                    </template>
                  </Column>
                </DataTable>
              </template>
            </Card>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Sample data for the table
const sampleData = ref([
  { id: 1, name: 'Documento 1', status: 'Activo' },
  { id: 2, name: 'Documento 2', status: 'Pendiente' },
  { id: 3, name: 'Documento 3', status: 'Cancelado' },
  { id: 4, name: 'Documento 4', status: 'Completado' }
]);

const getSeverity = (status) => {
  switch (status) {
    case 'Activo':
      return 'success';
    case 'Pendiente':
      return 'warning';
    case 'Cancelado':
      return 'danger';
    case 'Completado':
      return 'info';
    default:
      return null;
  }
};
</script>

<style scoped>
.test-primevue {
  padding: 2rem;
}

.p-field {
  margin-bottom: 1rem;
}

.p-field label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}
</style>