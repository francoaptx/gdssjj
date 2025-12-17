// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import store from '../store';

// Importar componentes
import Home from '../views/Home.vue';
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';
import Dashboard from '../components/Dashboard.vue';
import RoutingSheetList from '../components/RoutingSheetList.vue';
import RoutingSheetCreate from '../components/RoutingSheetCreate.vue';
import RoutingSheetCreateSimple from '../components/RoutingSheetCreateSimple.vue';
import RoutingSheetDetail from '../components/RoutingSheetDetail.vue';
import DocumentCreate from '../components/DocumentCreate.vue';
import Reception from '../components/Reception.vue';
import Processing from '../components/Processing.vue';
import Archive from '../components/Archive.vue';
import History from '../components/History.vue';
import UserManagement from '../components/UserManagement.vue';
import OfficeManagement from '../components/OfficeManagement.vue';
import PositionManagement from '../components/PositionManagement.vue';
import TestForm from '../components/TestForm.vue'; // Nuevo componente de prueba

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/routing-sheets', component: RoutingSheetList, meta: { requiresAuth: true } },
  { path: '/routing-sheets/create', component: RoutingSheetCreate, meta: { requiresAuth: true } },
  { path: '/routing-sheets/create-simple', component: RoutingSheetCreateSimple, meta: { requiresAuth: true } },
  { path: '/routing-sheets/:id', component: RoutingSheetDetail, props: true, meta: { requiresAuth: true } },
  { path: '/documents/create', component: DocumentCreate, meta: { requiresAuth: true } },
  { path: '/reception', component: Reception, meta: { requiresAuth: true } },
  { path: '/processing', component: Processing, meta: { requiresAuth: true } },
  { path: '/archive', component: Archive, meta: { requiresAuth: true } },
  { path: '/history', component: History, meta: { requiresAuth: true } },
  { path: '/users', component: UserManagement, meta: { requiresAuth: true } },
  { path: '/admin/offices', component: OfficeManagement, meta: { requiresAuth: true } },
  { path: '/admin/positions', component: PositionManagement, meta: { requiresAuth: true } },
  { path: '/test-form', component: TestForm, meta: { requiresAuth: true } }, // Ruta de prueba
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters.isAuthenticated;
  
  if (to.path === '/login' && isAuthenticated) {
    // 如果已认证且试图访问登录页，则重定向到仪表板
    next('/dashboard');
  } else if (to.meta.requiresAuth && !isAuthenticated) {
    // 如果路由需要认证但未认证，则重定向到登录页
    next('/login');
  } else {
    // 其他情况允许正常导航
    next();
  }
});

export default router;