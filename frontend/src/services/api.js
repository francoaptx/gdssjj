// Servicio API para comunicacion con backend 
import axios from 'axios' 

const api = axios.create({ 
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000', // Use VITE_API_URL for Vite projects
  timeout: 10000, 
}) 

// Interceptor para agregar token a las peticiones 
api.interceptors.request.use( 
  (config) => {
    const token = localStorage.getItem('token') 
    if (token) { 
      config.headers.Authorization = `Bearer ${token}` 
    } 
    return config 
  }, 
  (error) => {
    return Promise.reject(error) 
  } 
) 

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    console.error('Error en la respuesta de la API:', error);
    return Promise.reject(error);
  }
);

export default api;