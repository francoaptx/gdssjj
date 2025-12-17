import { createStore } from 'vuex';
import axios from 'axios';

// Función auxiliar para obtener el usuario del localStorage de forma segura
function getUserFromLocalStorage() {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (e) {
    console.error('Error parsing user from localStorage:', e);
    return null;
  }
}

const store = createStore({
  state: {
    token: localStorage.getItem('token') || null,
    user: getUserFromLocalStorage()
  },
  getters: {
    isAuthenticated: (state) => {
      return !!(state.token && state.user);
    },
    user: (state) => {
      return state.user;
    }
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token;
      if (token) {
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } else {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
      }
    },
    SET_USER(state, user) {
      state.user = user;
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user');
      }
    },
    CLEAR_AUTH(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
    }
  },
  actions: {
    login({ commit }, { token, user }) {
      commit('SET_TOKEN', token);
      commit('SET_USER', user);
    },
    logout({ commit }) {
      commit('CLEAR_AUTH');
    },
    initializeAuth({ commit }) {
      const token = localStorage.getItem('token');
      const user = getUserFromLocalStorage();
      
      if (token && user) {
        commit('SET_TOKEN', token);
        commit('SET_USER', user);
      } else {
        // Si hay datos incompletos, limpiar todo
        commit('CLEAR_AUTH');
      }
    }
  }
});

// Initialize auth on store creation
store.dispatch('initializeAuth');

export default store;