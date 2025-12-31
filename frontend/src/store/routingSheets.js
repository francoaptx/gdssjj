import { defineStore } from 'pinia';
import api from '../services/api';

export const useRoutingSheetsStore = defineStore('routingSheets', {
  state: () => ({
    sentItems: [],
    receivedItems: [],
    processingItems: [],
    archivedItems: [],
    loading: false,
    error: null
  }),

  getters: {
    pendingSentItems: (state) => {
      return state.sentItems.filter(item => item.status === 'PENDING');
    },
    
    receivedSentItems: (state) => {
      return state.sentItems.filter(item => item.status === 'RECEIVED');
    }
  },

  actions: {
    async fetchSentItems() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await api.get('/routing-sheets/sent');
        this.sentItems = response.data;
      } catch (error) {
        this.error = error.message || 'Error al cargar las hojas de ruta enviadas';
        console.error('Error fetching sent items:', error);
        // Devolver un array vacío en caso de error para evitar romper la UI
        this.sentItems = [];
      } finally {
        this.loading = false;
      }
    },

    async fetchReceivedItems() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await api.get('/routing-sheets/received');
        this.receivedItems = response.data;
      } catch (error) {
        this.error = error.message || 'Error al cargar las hojas de ruta recibidas';
        console.error('Error fetching received items:', error);
        // Devolver un array vacío en caso de error para evitar romper la UI
        this.receivedItems = [];
      } finally {
        this.loading = false;
      }
    },

    async fetchProcessingItems() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await api.get('/routing-sheets/pending');
        this.processingItems = response.data;
      } catch (error) {
        this.error = error.message || 'Error al cargar las hojas de ruta en procesamiento';
        console.error('Error fetching processing items:', error);
        // Devolver un array vacío en caso de error para evitar romper la UI
        this.processingItems = [];
      } finally {
        this.loading = false;
      }
    },

    async fetchArchivedItems() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await api.get('/routing-sheets/archived');
        this.archivedItems = response.data;
      } catch (error) {
        this.error = error.message || 'Error al cargar las hojas de ruta archivadas';
        console.error('Error fetching archived items:', error);
        // Devolver un array vacío en caso de error para evitar romper la UI
        this.archivedItems = [];
      } finally {
        this.loading = false;
      }
    }
  }
});