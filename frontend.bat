@echo off
echo Creando estructura del proyecto Vue.js...
echo.

REM Crear estructura principal de directorios
mkdir frontend
cd frontend
mkdir public
mkdir src
mkdir src\assets
mkdir src\assets\css
mkdir src\components
mkdir src\router
mkdir src\store
mkdir src\services
mkdir src\views

echo Directorios creados exitosamente.
echo.

echo Creando archivos...
echo.

REM Crear archivo index.html en public
echo ^<!DOCTYPE html^> > public\index.html
echo ^<html lang="es"^> >> public\index.html
echo   ^<head^> >> public\index.html
echo     ^<meta charset="UTF-8"^> >> public\index.html
echo     ^<link rel="icon" type="image/x-icon" href="/favicon.ico"^> >> public\index.html
echo     ^<meta name="viewport" content="width=device-width, initial-scale=1.0"^> >> public\index.html
echo     ^<title^>Sistema de Gestion Documental^</title^> >> public\index.html
echo   ^</head^> >> public\index.html
echo   ^<body^> >> public\index.html
echo     ^<div id="app"^>^</div^> >> public\index.html
echo     ^<script type="module" src="/src/main.js"^>^</script^> >> public\index.html
echo   ^</body^> >> public\index.html
echo ^</html^> >> public\index.html

REM Crear archivos principales en src
echo // Componente principal de la aplicación > src\App.vue
echo ^<template^> >> src\App.vue
echo   ^<div id="app"^> >> src\App.vue
echo     ^<router-view/^> >> src\App.vue
echo   ^</div^> >> src\App.vue
echo ^</template^> >> src\App.vue
echo. >> src\App.vue
echo ^<script^> >> src\App.vue
echo export default { >> src\App.vue
echo   name: 'App', >> src\App.vue
echo } >> src\App.vue
echo ^</script^> >> src\App.vue
echo. >> src\App.vue
echo ^<style^> >> src\App.vue
echo #app { >> src\App.vue
echo   font-family: Avenir, Helvetica, Arial, sans-serif; >> src\App.vue
echo   -webkit-font-smoothing: antialiased; >> src\App.vue
echo   -moz-osx-font-smoothing: grayscale; >> src\App.vue
echo   text-align: center; >> src\App.vue
echo   color: #2c3e50; >> src\App.vue
echo   margin-top: 60px; >> src\App.vue
echo } >> src\App.vue
echo ^</style^> >> src\App.vue

echo // Archivo principal de JavaScript > src\main.js
echo import { createApp } from 'vue' >> src\main.js
echo import App from './App.vue' >> src\main.js
echo import router from './router' >> src\main.js
echo import store from './store' >> src\main.js
echo import './assets/css/style.css' >> src\main.js
echo. >> src\main.js
echo createApp(App).use(store).use(router).mount('#app') >> src\main.js

REM Crear archivo de estilos CSS
echo /* Estilos globales */ > src\assets\css\style.css
echo * { >> src\assets\css\style.css
echo   margin: 0; >> src\assets\css\style.css
echo   padding: 0; >> src\assets\css\style.css
echo   box-sizing: border-box; >> src\assets\css\style.css
echo } >> src\assets\css\style.css
echo. >> src\assets\css\style.css
echo body { >> src\assets\css\style.css
echo   font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; >> src\assets\css\style.css
echo   background-color: #f5f5f5; >> src\assets\css\style.css
echo   color: #333; >> src\assets\css\style.css
echo } >> src\assets\css\style.css
echo. >> src\assets\css\style.css
echo .container { >> src\assets\css\style.css
echo   max-width: 1200px; >> src\assets\css\style.css
echo   margin: 0 auto; >> src\assets\css\style.css
echo   padding: 20px; >> src\assets\css\style.css
echo } >> src\assets\css\style.css

REM Crear componentes Vue
echo // Componente Header > src\components\Header.vue
echo ^<template^> >> src\components\Header.vue
echo   ^<header class="header"^> >> src\components\Header.vue
echo     ^<div class="logo"^>Sistema de Gestion Documental^</div^> >> src\components\Header.vue
echo     ^<nav class="nav"^> >> src\components\Header.vue
echo       ^<router-link to="/"^>Inicio^</router-link^> >> src\components\Header.vue
echo       ^<router-link to="/login" v-if="!isAuthenticated"^>Iniciar Sesion^</router-link^> >> src\components\Header.vue
echo       ^<button @click="logout" v-else^>Cerrar Sesion^</button^> >> src\components\Header.vue
echo     ^</nav^> >> src\components\Header.vue
echo   ^</header^> >> src\components\Header.vue
echo ^</template^> >> src\components\Header.vue
echo. >> src\components\Header.vue
echo ^<script^> >> src\components\Header.vue
echo export default { >> src\components\Header.vue
echo   name: 'Header', >> src\components\Header.vue
echo   computed: { >> src\components\Header.vue
echo     isAuthenticated() { >> src\components\Header.vue
echo       return this.$store.state.auth.isAuthenticated; >> src\components\Header.vue
echo     } >> src\components\Header.vue
echo   }, >> src\components\Header.vue
echo   methods: { >> src\components\Header.vue
echo     logout() { >> src\components\Header.vue
echo       this.$store.dispatch('auth/logout'); >> src\components\Header.vue
echo       this.$router.push('/login'); >> src\components\Header.vue
echo     } >> src\components\Header.vue
echo   } >> src\components\Header.vue
echo } >> src\components\Header.vue
echo ^</script^> >> src\components\Header.vue
echo. >> src\components\Header.vue
echo ^<style scoped^> >> src\components\Header.vue
echo .header { >> src\components\Header.vue
echo   background-color: #2c3e50; >> src\components\Header.vue
echo   color: white; >> src\components\Header.vue
echo   padding: 1rem; >> src\components\Header.vue
echo   display: flex; >> src\components\Header.vue
echo   justify-content: space-between; >> src\components\Header.vue
echo   align-items: center; >> src\components\Header.vue
echo } >> src\components\Header.vue
echo .logo { >> src\components\Header.vue
echo   font-size: 1.5rem; >> src\components\Header.vue
echo   font-weight: bold; >> src\components\Header.vue
echo } >> src\components\Header.vue
echo .nav a { >> src\components\Header.vue
echo   color: white; >> src\components\Header.vue
echo   margin-left: 1rem; >> src\components\Header.vue
echo   text-decoration: none; >> src\components\Header.vue
echo } >> src\components\Header.vue
echo .nav a:hover { >> src\components\Header.vue
echo   text-decoration: underline; >> src\components\Header.vue
echo } >> src\components\Header.vue
echo ^</style^> >> src\components\Header.vue

echo // Componente Sidebar > src\components\Sidebar.vue
echo ^<template^> >> src\components\Sidebar.vue
echo   ^<aside class="sidebar"^> >> src\components\Sidebar.vue
echo     ^<nav^> >> src\components\Sidebar.vue
echo       ^<router-link to="/dashboard"^>Dashboard^</router-link^> >> src\components\Sidebar.vue
echo       ^<router-link to="/routing-sheets"^>Hoja de Ruta^</router-link^> >> src\components\Sidebar.vue
echo       ^<router-link to="/documents"^>Documentos^</router-link^> >> src\components\Sidebar.vue
echo       ^<router-link to="/reception"^>Recepcion^</router-link^> >> src\components\Sidebar.vue
echo       ^<router-link to="/processing"^>Tramite^</router-link^> >> src\components\Sidebar.vue
echo       ^<router-link to="/archive"^>Archivo^</router-link^> >> src\components\Sidebar.vue
echo       ^<router-link to="/history"^>Historial^</router-link^> >> src\components\Sidebar.vue
echo       ^<router-link to="/users"^>Usuarios^</router-link^> >> src\components\Sidebar.vue
echo     ^</nav^> >> src\components\Sidebar.vue
echo   ^</aside^> >> src\components\Sidebar.vue
echo ^</template^> >> src\components\Sidebar.vue
echo. >> src\components\Sidebar.vue
echo ^<script^> >> src\components\Sidebar.vue
echo export default { >> src\components\Sidebar.vue
echo   name: 'Sidebar' >> src\components\Sidebar.vue
echo } >> src\components\Sidebar.vue
echo ^</script^> >> src\components\Sidebar.vue
echo. >> src\components\Sidebar.vue
echo ^<style scoped^> >> src\components\Sidebar.vue
echo .sidebar { >> src\components\Sidebar.vue
echo   background-color: #34495e; >> src\components\Sidebar.vue
echo   color: white; >> src\components\Sidebar.vue
echo   width: 200px; >> src\components\Sidebar.vue
echo   min-height: calc(100vh - 60px); >> src\components\Sidebar.vue
echo   padding: 1rem; >> src\components\Sidebar.vue
echo } >> src\components\Sidebar.vue
echo .sidebar nav { >> src\components\Sidebar.vue
echo   display: flex; >> src\components\Sidebar.vue
echo   flex-direction: column; >> src\components\Sidebar.vue
echo } >> src\components\Sidebar.vue
echo .sidebar a { >> src\components\Sidebar.vue
echo   color: white; >> src\components\Sidebar.vue
echo   text-decoration: none; >> src\components\Sidebar.vue
echo   padding: 0.5rem; >> src\components\Sidebar.vue
echo   margin-bottom: 0.5rem; >> src\components\Sidebar.vue
echo   border-radius: 4px; >> src\components\Sidebar.vue
echo } >> src\components\Sidebar.vue
echo .sidebar a:hover { >> src\components\Sidebar.vue
echo   background-color: #2c3e50; >> src\components\Sidebar.vue
echo } >> src\components\Sidebar.vue
echo ^</style^> >> src\components\Sidebar.vue

REM Crear más componentes (estructuras básicas)
for %%C in (Dashboard Login Register RoutingSheetList RoutingSheetCreate DocumentCreate Reception Processing Archive History UserManagement) do (
  echo // Componente %%C > src\components\%%C.vue
  echo ^<template^> >> src\components\%%C.vue
  echo   ^<div class="%%C-lower"^> >> src\components\%%C.vue
  echo     ^<h1^>%%C^</h1^> >> src\components\%%C.vue
  echo     ^<p^>Contenido del componente %%C^</p^> >> src\components\%%C.vue
  echo   ^</div^> >> src\components\%%C.vue
  echo ^</template^> >> src\components\%%C.vue
  echo. >> src\components\%%C.vue
  echo ^<script^> >> src\components\%%C.vue
  echo export default { >> src\components\%%C.vue
  echo   name: '%%C' >> src\components\%%C.vue
  echo } >> src\components\%%C.vue
  echo ^</script^> >> src\components\%%C.vue
  echo. >> src\components\%%C.vue
  echo ^<style scoped^> >> src\components\%%C.vue
  echo .%%C-lower { >> src\components\%%C.vue
  echo   padding: 20px; >> src\components\%%C.vue
  echo } >> src\components\%%C.vue
  echo ^</style^> >> src\components\%%C.vue
)

REM Crear archivo de rutas
echo // Configuracion de rutas > src\router\index.js
echo import { createRouter, createWebHistory } from 'vue-router' >> src\router\index.js
echo import Home from '../views/Home.vue' >> src\router\index.js
echo import NotFound from '../views/NotFound.vue' >> src\router\index.js
echo import Login from '../components/Login.vue' >> src\router\index.js
echo import Register from '../components/Register.vue' >> src\router\index.js
echo import Dashboard from '../components/Dashboard.vue' >> src\router\index.js
echo import RoutingSheetList from '../components/RoutingSheetList.vue' >> src\router\index.js
echo import RoutingSheetCreate from '../components/RoutingSheetCreate.vue' >> src\router\index.js
echo import DocumentCreate from '../components/DocumentCreate.vue' >> src\router\index.js
echo import Reception from '../components/Reception.vue' >> src\router\index.js
echo import Processing from '../components/Processing.vue' >> src\router\index.js
echo import Archive from '../components/Archive.vue' >> src\router\index.js
echo import History from '../components/History.vue' >> src\router\index.js
echo import UserManagement from '../components/UserManagement.vue' >> src\router\index.js
echo. >> src\router\index.js
echo const routes = [ >> src\router\index.js
echo   { >> src\router\index.js
echo     path: '/', >> src\router\index.js
echo     name: 'Home', >> src\router\index.js
echo     component: Home >> src\router\index.js
echo   }, >> src\router\index.js
echo   { >> src\router\index.js
echo     path: '/login', >> src\router\index.js
echo     name: 'Login', >> src\router\index.js
echo     component: Login >> src\router\index.js
echo   }, >> src\router\index.js
echo   { >> src\router\index.js
echo     path: '/register', >> src\router\index.js
echo     name: 'Register', >> src\router\index.js
echo     component: Register >> src\router\index.js
echo   }, >> src\router\index.js
echo   { >> src\router\index.js
echo     path: '/dashboard', >> src\router\index.js
echo     name: 'Dashboard', >> src\router\index.js
echo     component: Dashboard >> src\router\index.js
echo   }, >> src\router\index.js
echo   { >> src\router\index.js
echo     path: '/routing-sheets', >> src\router\index.js
echo     name: 'RoutingSheets', >> src\router\index.js
echo     component: RoutingSheetList >> src\router\index.js
echo   }, >> src\router\index.js
echo   { >> src\router\index.js
echo     path: '/routing-sheets/create', >> src\router\index.js
echo     name: 'RoutingSheetCreate', >> src\router\index.js
echo     component: RoutingSheetCreate >> src\router\index.js
echo   }, >> src\router\index.js
echo   { >> src\router\index.js
echo     path: '/documents/create', >> src\router\index.js
echo     name: 'DocumentCreate', >> src\router\index.js
echo     component: DocumentCreate >> src\router\index.js
echo   }, >> src\router\index.js
echo   { >> src\router\index.js
echo     path: '/reception', >> src\router\index.js
echo     name: 'Reception', >> src\router\index.js
echo     component: Reception >> src\router\index.js
echo   }, >> src\router\index.js
echo   { >> src\router\index.js
echo     path: '/processing', >> src\router\index.js
echo     name: 'Processing', >> src\router\index.js
echo     component: Processing >> src\router\index.js
echo   }, >> src\router\index.js
echo   { >> src\router\index.js
echo     path: '/archive', >> src\router\index.js
echo     name: 'Archive', >> src\router\index.js
echo     component: Archive >> src\router\index.js
echo   }, >> src\router\index.js
echo   { >> src\router\index.js
echo     path: '/history', >> src\router\index.js
echo     name: 'History', >> src\router\index.js
echo     component: History >> src\router\index.js
echo   }, >> src\router\index.js
echo   { >> src\router\index.js
echo     path: '/users', >> src\router\index.js
echo     name: 'UserManagement', >> src\router\index.js
echo     component: UserManagement >> src\router\index.js
echo   }, >> src\router\index.js
echo   { >> src\router\index.js
echo     path: '/:pathMatch(.*)*', >> src\router\index.js
echo     name: 'NotFound', >> src\router\index.js
echo     component: NotFound >> src\router\index.js
echo   } >> src\router\index.js
echo ] >> src\router\index.js
echo. >> src\router\index.js
echo const router = createRouter({ >> src\router\index.js
echo   history: createWebHistory(), >> src\router\index.js
echo   routes >> src\router\index.js
echo }) >> src\router\index.js
echo. >> src\router\index.js
echo export default router >> src\router\index.js

REM Crear archivo de store Vuex
echo // Store Vuex > src\store\index.js
echo import { createStore } from 'vuex' >> src\store\index.js
echo. >> src\store\index.js
echo export default createStore({ >> src\store\index.js
echo   state: { >> src\store\index.js
echo     auth: { >> src\store\index.js
echo       isAuthenticated: false, >> src\store\index.js
echo       user: null, >> src\store\index.js
echo       token: null >> src\store\index.js
echo     } >> src\store\index.js
echo   }, >> src\store\index.js
echo   mutations: { >> src\store\index.js
echo     SET_AUTH(state, payload) { >> src\store\index.js
echo       state.auth.isAuthenticated = payload.isAuthenticated; >> src\store\index.js
echo       state.auth.user = payload.user; >> src\store\index.js
echo       state.auth.token = payload.token; >> src\store\index.js
echo     }, >> src\store\index.js
echo     CLEAR_AUTH(state) { >> src\store\index.js
echo       state.auth.isAuthenticated = false; >> src\store\index.js
echo       state.auth.user = null; >> src\store\index.js
echo       state.auth.token = null; >> src\store\index.js
echo     } >> src\store\index.js
echo   }, >> src\store\index.js
echo   actions: { >> src\store\index.js
echo     login({ commit }, { user, token }) { >> src\store\index.js
echo       commit('SET_AUTH', { >> src\store\index.js
echo         isAuthenticated: true, >> src\store\index.js
echo         user, >> src\store\index.js
echo         token >> src\store\index.js
echo       }); >> src\store\index.js
echo       localStorage.setItem('token', token); >> src\store\index.js
echo       localStorage.setItem('user', JSON.stringify(user)); >> src\store\index.js
echo     }, >> src\store\index.js
echo     logout({ commit }) { >> src\store\index.js
echo       commit('CLEAR_AUTH'); >> src\store\index.js
echo       localStorage.removeItem('token'); >> src\store\index.js
echo       localStorage.removeItem('user'); >> src\store\index.js
echo     }, >> src\store\index.js
echo     initializeAuth({ commit }) { >> src\store\index.js
echo       const token = localStorage.getItem('token'); >> src\store\index.js
echo       const user = JSON.parse(localStorage.getItem('user')); >> src\store\index.js
echo       if (token && user) { >> src\store\index.js
echo         commit('SET_AUTH', { >> src\store\index.js
echo           isAuthenticated: true, >> src\store\index.js
echo           user, >> src\store\index.js
echo           token >> src\store\index.js
echo         }); >> src\store\index.js
echo       } >> src\store\index.js
echo     } >> src\store\index.js
echo   }, >> src\store\index.js
echo   getters: { >> src\store\index.js
echo     isAuthenticated: state => state.auth.isAuthenticated, >> src\store\index.js
echo     currentUser: state => state.auth.user >> src\store\index.js
echo   } >> src\store\index.js
echo }) >> src\store\index.js

REM Crear servicio API
echo // Servicio API para comunicacion con backend > src\services\api.js
echo import axios from 'axios' >> src\services\api.js
echo. >> src\services\api.js
echo const api = axios.create({ >> src\services\api.js
echo   baseURL: process.env.VUE_APP_API_URL || 'http://localhost:3000', >> src\services\api.js
echo   timeout: 10000, >> src\services\api.js
echo }) >> src\services\api.js
echo. >> src\services\api.js
echo // Interceptor para agregar token a las peticiones >> src\services\api.js
echo api.interceptors.request.use( >> src\services\api.js
echo   config => { >> src\services\api.js
echo     const token = localStorage.getItem('token') >> src\services\api.js
echo     if (token) { >> src\services\api.js
echo       config.headers.Authorization = `Bearer ${token}` >> src\services\api.js
echo     } >> src\services\api.js
echo     return config >> src\services\api.js
echo   }, >> src\services\api.js
echo   error => { >> src\services\api.js
echo     return Promise.reject(error) >> src\services\api.js
echo   } >> src\services\api.js
echo ) >> src\services\api.js
echo. >> src\services\api.js
echo // Interceptor para manejar respuestas >> src\services\api.js
echo api.interceptors.response.use( >> src\services\api.js
echo   response => response, >> src\services\api.js
echo   error => { >> src\services\api.js
echo     if (error.response && error.response.status === 401) { >> src\services\api.js
echo       // Token expirado o invalido >> src\services\api.js
echo       localStorage.removeItem('token') >> src\services\api.js
echo       localStorage.removeItem('user') >> src\services\api.js
echo       window.location.href = '/login' >> src\services\api.js
echo     } >> src\services\api.js
echo     return Promise.reject(error) >> src\services\api.js
echo   } >> src\services\api.js
echo ) >> src\services\api.js
echo. >> src\services\api.js
echo export default { >> src\services\api.js
echo   // Auth >> src\services\api.js
echo   login: (credentials) => api.post('/auth/login', credentials), >> src\services\api.js
echo   register: (userData) => api.post('/auth/register', userData), >> src\services\api.js
echo. >> src\services\api.js
echo   // Users >> src\services\api.js
echo   getUsers: () => api.get('/users'), >> src\services\api.js
echo   getUser: (id) => api.get(`/users/${id}`), >> src\services\api.js
echo   createUser: (userData) => api.post('/users', userData), >> src\services\api.js
echo   updateUser: (id, userData) => api.put(`/users/${id}`, userData), >> src\services\api.js
echo   deleteUser: (id) => api.delete(`/users/${id}`), >> src\services\api.js
echo. >> src\services\api.js
echo   // Routing Sheets >> src\services\api.js
echo   getRoutingSheets: () => api.get('/routing-sheets'), >> src\services\api.js
echo   getRoutingSheet: (id) => api.get(`/routing-sheets/${id}`), >> src\services\api.js
echo   createRoutingSheet: (data) => api.post('/routing-sheets', data), >> src\services\api.js
echo   updateRoutingSheet: (id, data) => api.put(`/routing-sheets/${id}`, data), >> src\services\api.js
echo   deleteRoutingSheet: (id) => api.delete(`/routing-sheets/${id}`), >> src\services\api.js
echo. >> src\services\api.js
echo   // Documents >> src\services\api.js
echo   getDocuments: () => api.get('/documents'), >> src\services\api.js
echo   getDocument: (id) => api.get(`/documents/${id}`), >> src\services\api.js
echo   createDocument: (data) => api.post('/documents', data), >> src\services\api.js
echo   updateDocument: (id, data) => api.put(`/documents/${id}`, data), >> src\services\api.js
echo   deleteDocument: (id) => api.delete(`/documents/${id}`), >> src\services\api.js
echo. >> src\services\api.js
echo   // Otros endpoints segun necesidad >> src\services\api.js
echo } >> src\services\api.js

REM Crear vistas
echo // Vista Home > src\views\Home.vue
echo ^<template^> >> src\views\Home.vue
echo   ^<div class="home"^> >> src\views\Home.vue
echo     ^<Header /^> >> src\views\Home.vue
echo     ^<div class="main-content"^> >> src\views\Home.vue
echo       ^<Sidebar v-if="isAuthenticated" /^> >> src\views\Home.vue
echo       ^<div class="content"^> >> src\views\Home.vue
echo         ^<h1^>Bienvenido al Sistema de Gestion Documental^</h1^> >> src\views\Home.vue
echo         ^<p^>Sistema para la gestion de documentos, hojas de ruta y tramites^</p^> >> src\views\Home.vue
echo       ^</div^> >> src\views\Home.vue
echo     ^</div^> >> src\views\Home.vue
echo   ^</div^> >> src\views\Home.vue
echo ^</template^> >> src\views\Home.vue
echo. >> src\views\Home.vue
echo ^<script^> >> src\views\Home.vue
echo import Header from '../components/Header.vue' >> src\views\Home.vue
echo import Sidebar from '../components/Sidebar.vue' >> src\views\Home.vue
echo. >> src\views\Home.vue
echo export default { >> src\views\Home.vue
echo   name: 'Home', >> src\views\Home.vue
echo   components: { >> src\views\Home.vue
echo     Header, >> src\views\Home.vue
echo     Sidebar >> src\views\Home.vue
echo   }, >> src\views\Home.vue
echo   computed: { >> src\views\Home.vue
echo     isAuthenticated() { >> src\views\Home.vue
echo       return this.$store.state.auth.isAuthenticated; >> src\views\Home.vue
echo     } >> src\views\Home.vue
echo   }, >> src\views\Home.vue
echo   mounted() { >> src\views\Home.vue
echo     this.$store.dispatch('initializeAuth'); >> src\views\Home.vue
echo   } >> src\views\Home.vue
echo } >> src\views\Home.vue
echo ^</script^> >> src\views\Home.vue
echo. >> src\views\Home.vue
echo ^<style scoped^> >> src\views\Home.vue
echo .home { >> src\views\Home.vue
echo   min-height: 100vh; >> src\views\Home.vue
echo } >> src\views\Home.vue
echo .main-content { >> src\views\Home.vue
echo   display: flex; >> src\views\Home.vue
echo } >> src\views\Home.vue
echo .content { >> src\views\Home.vue
echo   flex: 1; >> src\views\Home.vue
echo   padding: 2rem; >> src\views\Home.vue
echo } >> src\views\Home.vue
echo ^</style^> >> src\views\Home.vue

echo // Vista NotFound > src\views\NotFound.vue
echo ^<template^> >> src\views\NotFound.vue
echo   ^<div class="not-found"^> >> src\views\NotFound.vue
echo     ^<h1^>404 - Pagina no encontrada^</h1^> >> src\views\NotFound.vue
echo     ^<p^>La pagina que buscas no existe.^</p^> >> src\views\NotFound.vue
echo     ^<router-link to="/"^>Volver al inicio^</router-link^> >> src\views\NotFound.vue
echo   ^</div^> >> src\views\NotFound.vue
echo ^</template^> >> src\views\NotFound.vue
echo. >> src\views\NotFound.vue
echo ^<script^> >> src\views\NotFound.vue
echo export default { >> src\views\NotFound.vue
echo   name: 'NotFound' >> src\views\NotFound.vue
echo } >> src\views\NotFound.vue
echo ^</script^> >> src\views\NotFound.vue
echo. >> src\views\NotFound.vue
echo ^<style scoped^> >> src\views\NotFound.vue
echo .not-found { >> src\views\NotFound.vue
echo   text-align: center; >> src\views\NotFound.vue
echo   padding: 50px; >> src\views\NotFound.vue
echo } >> src\views\NotFound.vue
echo .not-found h1 { >> src\views\NotFound.vue
echo   color: #e74c3c; >> src\views\NotFound.vue
echo   font-size: 3rem; >> src\views\NotFound.vue
echo } >> src\views\NotFound.vue
echo .not-found a { >> src\views\NotFound.vue
echo   color: #3498db; >> src\views\NotFound.vue
echo   text-decoration: none; >> src\views\NotFound.vue
echo } >> src\views\NotFound.vue
echo ^</style^> >> src\views\NotFound.vue

REM Crear archivos de configuración
echo VUE_APP_API_URL=http://localhost:3000 > .env
echo VUE_APP_TITLE=Sistema de Gestion Documental >> .env

echo node_modules/ > .gitignore
echo dist/ >> .gitignore
echo .env >> .gitignore
echo .env.local >> .gitignore
echo .env.*.local >> .gitignore
echo npm-debug.log* >> .gitignore
echo yarn-debug.log* >> .gitignore
echo yarn-error.log* >> .gitignore
echo pnpm-debug.log* >> .gitignore
echo .vscode/ >> .gitignore
echo .idea/ >> .gitignore

echo // Configuracion de Babel > babel.config.js
echo module.exports = { >> babel.config.js
echo   presets: [ >> babel.config.js
echo     '@vue/cli-plugin-babel/preset' >> babel.config.js
echo   ] >> babel.config.js
echo } >> babel.config.js

echo // Configuracion de JavaScript > jsconfig.json
echo { >> jsconfig.json
echo   "compilerOptions": { >> jsconfig.json
echo     "target": "es5", >> jsconfig.json
echo     "module": "esnext", >> jsconfig.json
echo     "baseUrl": "./", >> jsconfig.json
echo     "moduleResolution": "node", >> jsconfig.json
echo     "paths": { >> jsconfig.json
echo       "@/*": ["src/*"] >> jsconfig.json
echo     }, >> jsconfig.json
echo     "lib": ["esnext", "dom", "dom.iterable", "scripthost"] >> jsconfig.json
echo   } >> jsconfig.json
echo } >> jsconfig.json

echo // Configuracion de Vite > vite.config.js
echo import { defineConfig } from 'vite' >> vite.config.js
echo import vue from '@vitejs/plugin-vue' >> vite.config.js
echo import path from 'path' >> vite.config.js
echo. >> vite.config.js
echo export default defineConfig({ >> vite.config.js
echo   plugins: [vue()], >> vite.config.js
echo   resolve: { >> vite.config.js
echo     alias: { >> vite.config.js
echo       '@': path.resolve(__dirname, 'src') >> vite.config.js
echo     } >> vite.config.js
echo   }, >> vite.config.js
echo   server: { >> vite.config.js
echo     port: 8080, >> vite.config.js
echo     proxy: { >> vite.config.js
echo       '/api': { >> vite.config.js
echo         target: 'http://localhost:3000', >> vite.config.js
echo         changeOrigin: true, >> vite.config.js
echo         rewrite: (path) => path.replace(/^\/api/, '') >> vite.config.js
echo       } >> vite.config.js
echo     } >> vite.config.js
echo   } >> vite.config.js
echo }) >> vite.config.js

echo // Configuracion de package.json > package.json
echo { >> package.json
echo   "name": "sistema-gestion-documental-frontend", >> package.json
echo   "version": "1.0.0", >> package.json
echo   "private": true, >> package.json
echo   "scripts": { >> package.json
echo     "serve": "vue-cli-service serve", >> package.json
echo     "build": "vue-cli-service build", >> package.json
echo     "dev": "vite", >> package.json
echo     "preview": "vite preview" >> package.json
echo   }, >> package.json
echo   "dependencies": { >> package.json
echo     "vue": "^3.3.4", >> package.json
echo     "vue-router": "^4.2.4", >> package.json
echo     "vuex": "^4.1.0", >> package.json
echo     "axios": "^1.5.0" >> package.json
echo   }, >> package.json
echo   "devDependencies": { >> package.json
echo     "@vitejs/plugin-vue": "^4.4.0", >> package.json
echo     "vite": "^4.4.9" >> package.json
echo   } >> package.json
echo } >> package.json

echo.
echo ¡Estructura creada exitosamente!
echo.
echo Instrucciones:
echo 1. Ejecuta: cd frontend
echo 2. Instala dependencias: npm install
echo 3. Configura las variables de entorno en el archivo .env
echo 4. Ejecuta el proyecto: npm run dev
echo 5. Abre en navegador: http://localhost:8080
echo.
echo Nota: Este script asume que estas usando Vue 3 con Vite.
echo       Si prefieres Vue CLI, necesitaras ajustar las dependencias.
echo.
pause