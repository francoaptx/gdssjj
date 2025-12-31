<script setup>
import { ref, onMounted } from 'vue';
import Card from 'primevue/card';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import Button from 'primevue/button';

// Props
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: null
  },
  items: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: null
  },
  columns: {
    type: Array,
    default: () => []
  },
  actions: {
    type: Array,
    default: () => []
  }
});

// Emits
const emit = defineEmits(['refresh', 'action']);

// Methods
const onRefresh = () => {
  emit('refresh');
};

const onAction = (action, item) => {
  emit('action', { action, item });
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('es-ES', options);
};

const getPrioritySeverity = (priority) => {
  switch (priority) {
    case 'URGENT':
      return 'danger';
    case 'HIGH':
      return 'warning';
    case 'NORMAL':
      return 'info';
    case 'LOW':
      return 'success';
    default:
      return 'secondary';
  }
};

const getPriorityText = (priority) => {
  const priorityMap = {
    'URGENT': 'Urgente',
    'HIGH': 'Alta',
    'NORMAL': 'Normal',
    'LOW': 'Baja'
  };
  return priorityMap[priority] || priority;
};

const getStatusSeverity = (status) => {
  // Manejar el caso especial donde el texto es "No recibido" para el estado PENDING
  if (status === 'PENDING' || (typeof status === 'string' && status === 'No recibido')) {
    return 'warning';
  }
  
  switch (status) {
    case 'RECEIVED':
      return 'info';
    case 'PROCESSED':
      return 'success';
    case 'ARCHIVED':
      return 'secondary';
    case 'CANCELLED':
      return 'danger';
    default:
      return 'secondary';
  }
};

const getStatusText = (status) => {
  const statusMap = {
    'PENDING': 'No recibido',
    'RECEIVED': 'Recibido',
    'PROCESSED': 'Procesado',
    'ARCHIVED': 'Archivado',
    'CANCELLED': 'Cancelado'
  };
  return statusMap[status] || status;
};

onMounted(() => {
  if (!props.items.length && !props.loading && !props.error) {
    onRefresh();
  }
});
</script>

<template>
  <div class="base-list">
    <Card class="base-card unified-card">
      <template #header>
        <div class="header p-4">
          <h2 class="page-title">{{ title }}</h2>
          <p v-if="subtitle" class="page-subtitle">{{ subtitle }}</p>
        </div>
      </template>
      
      <template #content>
        <div v-if="loading" class="loading-state p-d-flex p-flex-column p-ai-center p-jc-center p-p-6 unified-loading">
          <i class="pi pi-spin pi-spinner loading-icon"></i>
          <p class="p-mt-3 loading-text">Cargando {{ title.toLowerCase() }}...</p>
        </div>
        
        <div v-else-if="error" class="error-state p-d-flex p-flex-column p-ai-center p-jc-center p-p-6 unified-error">
          <i class="pi pi-times-circle error-icon"></i>
          <h3 class="p-mt-3 error-title">Error al cargar datos</h3>
          <p class="p-mt-2 error-message">{{ error }}</p>
          <Button @click="onRefresh" icon="pi pi-refresh" label="Reintentar" class="p-mt-4 retry-button p-button p-button-primary" />
        </div>
        
        <div v-else-if="items.length === 0" class="empty-state p-d-flex p-flex-column p-ai-center p-jc-center p-p-6 unified-empty">
          <i class="pi pi-inbox empty-icon"></i>
          <p class="p-mt-3 empty-text">No hay {{ title.toLowerCase() }}.</p>
        </div>
        
        <DataTable 
          v-else 
          :value="items" 
          class="data-table unified-table"
          responsiveLayout="scroll"
          stripedRows
          :paginator="true" 
          :rows="10"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} entradas"
          :rowHover="true"
        >
          <Column 
            v-for="column in columns" 
            :key="column.field"
            :field="column.field" 
            :header="column.header"
            :sortable="column.sortable !== false"
            :style="column.style"
          >
            <template #body="slotProps">
              <!-- Columnas especiales -->
              <span v-if="column.type === 'date'" class="date-cell unified-cell">
                {{ formatDate(slotProps.data[column.field]) }}
              </span>
              
              <Tag v-else-if="column.type === 'priority'" 
                   :severity="getPrioritySeverity(slotProps.data[column.field])" 
                   :value="getPriorityText(slotProps.data[column.field]) || 'Normal'" 
                   class="priority-tag unified-tag" />
              
              <Tag v-else-if="column.type === 'status'" 
                   :severity="getStatusSeverity(slotProps.data[column.field])" 
                   :value="getStatusText(slotProps.data[column.field])" 
                   class="status-tag unified-tag" />
              
              <div v-else-if="column.type === 'sender'" class="sender-cell unified-cell">
                {{ slotProps.data.sender ? slotProps.data.sender.name : 'N/A' }}
              </div>
              
              <div v-else-if="column.type === 'recipient'" class="recipient-cell unified-cell">
                {{ slotProps.data.recipient ? slotProps.data.recipient.name : 'N/A' }}
              </div>
              
              <!-- Columna personalizada -->
              <span v-else-if="column.customBody" class="default-cell unified-cell">
                {{ column.customBody(slotProps.data) }}
              </span>
              
              <!-- Columna por defecto -->
              <span v-else class="default-cell unified-cell">
                {{ slotProps.data[column.field] }}
              </span>
            </template>
          </Column>
          
          <Column header="Acciones" v-if="actions.length > 0">
            <template #body="slotProps">
              <div class="actions-cell p-d-flex p-jc-center p-gap-2">
                <Button 
                  v-for="action in actions"
                  :key="action.name"
                  @click="onAction(action.name, slotProps.data)"
                  :icon="action.icon"
                  :class="['action-button', `p-button-${action.severity || 'secondary'}`, action.class]"
                  :title="action.title"
                  :label="action.label"
                  :rounded="!action.label"
                  :size="action.size || 'small'"
                />
                <Button 
                  v-if="actions.some(a => a.name === 'view' || a.view !== false)"
                  :to="`/routing-sheets/${slotProps.data.id}`"
                  icon="pi pi-eye"
                  class="action-button p-button-info"
                  title="Ver detalles"
                  rounded
                  size="small"
                  :disabled="!slotProps.data.id"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.base-list {
  padding: 1.5rem;
  width: 100%;
}

.base-card {
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border: none;
}

.header {
  border-bottom: 1px solid #e9ecef;
}

.page-title {
  margin: 0;
  color: #343a40;
  font-weight: 600;
  font-size: 1.25rem;
}

.page-subtitle {
  margin: 5px 0 0 0;
  color: #6c757d;
  font-size: 0.9rem;
}

.loading-state, .error-state, .empty-state {
  text-align: center;
  border-radius: 8px;
}

.loading-icon, .error-icon, .empty-icon {
  font-size: 3rem;
}

.loading-icon {
  color: #007bff;
}

.error-icon {
  color: #dc3545;
}

.empty-icon {
  color: #6c757d;
}

.loading-text, .error-text, .empty-text {
  margin: 0;
  font-size: 1.1rem;
  color: #6c757d;
}

.error-title {
  color: #dc3545;
  font-size: 1.2rem;
  text-align: center;
}

.error-message {
  color: #6c757d;
  font-size: 1rem;
  text-align: center;
  max-width: 300px;
}

.retry-button {
  background-color: #007bff;
  border-color: #007bff;
}

.data-table {
  border: none;
}

.data-table :deep(.p-datatable-header) {
  background-color: #f8f9fa;
  border: none;
  padding: 1rem;
}

.data-table :deep(.p-datatable-thead > tr > th) {
  background-color: #f8f9fa;
  color: #495057;
  font-weight: 600;
  border: none;
  padding: 0.75rem 0.5rem;
}

.data-table :deep(.p-datatable-tbody > tr) {
  border-bottom: 1px solid #e9ecef;
}

.data-table :deep(.p-datatable-tbody > tr:last-child) {
  border-bottom: none;
}

.data-table :deep(.p-datatable-tbody > tr:hover) {
  background-color: #f8f9fa;
}

.data-table :deep(.p-datatable-tbody > tr > td) {
  padding: 0.75rem 0.5rem;
  border: none;
}

.date-cell, .sender-cell, .recipient-cell, .default-cell {
  font-size: 0.875rem;
  color: #495057;
}

.priority-tag, .status-tag {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
}

.actions-cell {
  padding: 0.5rem 0;
}

.action-button {
  min-width: 2rem;
  height: 2rem;
}

@media (max-width: 768px) {
  .base-list {
    padding: 1rem;
  }
  
  .page-title {
    font-size: 1.25rem;
  }
  
  .data-table :deep(.p-datatable-thead > tr > th),
  .data-table :deep(.p-datatable-tbody > tr > td) {
    padding: 0.75rem 0.5rem;
  }
}
</style>