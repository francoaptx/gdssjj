// Configuracion de rutas 
import { createRouter, createWebHistory } from 'vue-router' 
import Home from '../views/Home.vue' 
import NotFound from '../views/NotFound.vue' 
import Test from '../views/Test.vue' 
import Login from '../components/Login.vue' 
import Register from '../components/Register.vue' 
import Dashboard from '../components/Dashboard.vue' 
import RoutingSheetList from '../components/RoutingSheetList.vue' 
import RoutingSheetCreate from '../components/RoutingSheetCreate.vue' 
import RoutingSheetDetail from '../components/RoutingSheetDetail.vue' // Nuevo
import DocumentCreate from '../components/DocumentCreate.vue' 
import Reception from '../components/Reception.vue' 
import Processing from '../components/Processing.vue' 
import Archive from '../components/Archive.vue' 
import History from '../components/History.vue' 
import UserManagement from '../components/UserManagement.vue'
import PositionManagement from '../components/PositionManagement.vue'
import OfficeManagement from '../components/OfficeManagement.vue'

// Debugging
console.log('Loading routes...');

const routes = [ 
  { 
    path: '/', 
    name: 'Home', 
    component: Home 
  }, 
  { 
    path: '/login', 
    name: 'Login', 
    component: Login 
  }, 
  { 
    path: '/register', 
    name: 'Register', 
    component: Register 
  }, 
  { 
    path: '/dashboard', 
    name: 'Dashboard', 
    component: Dashboard 
  }, 
  { 
    path: '/routing-sheets', 
    name: 'RoutingSheetList', 
    component: RoutingSheetList 
  }, 
  { 
    path: '/routing-sheets/create', 
    name: 'RoutingSheetCreate', 
    component: RoutingSheetCreate 
  }, 
  { 
    path: '/routing-sheets/:id', 
    name: 'RoutingSheetDetail', 
    component: RoutingSheetDetail, 
    props: true 
  }, 
  { 
    path: '/documents/create', 
    name: 'DocumentCreate', 
    component: DocumentCreate 
  }, 
  { 
    path: '/reception', 
    name: 'Reception', 
    component: Reception 
  }, 
  { 
    path: '/processing', 
    name: 'Processing', 
    component: Processing 
  }, 
  { 
    path: '/archive', 
    name: 'Archive', 
    component: Archive 
  }, 
  { 
    path: '/history', 
    name: 'History', 
    component: History 
  }, 
  { 
    path: '/users', 
    name: 'UserManagement', 
    component: UserManagement 
  },
  {
    path: '/admin/users',
    name: 'AdminUserManagement',
    component: UserManagement
  },
  {
    path: '/admin/positions',
    name: 'PositionManagement',
    component: PositionManagement
  },
  {
    path: '/admin/offices',
    name: 'OfficeManagement',
    component: OfficeManagement
  },
  { 
    path: '/test', 
    name: 'Test', 
    component: Test 
  }, 
  { 
    path: '/:pathMatch(.*)*', 
    name: 'NotFound', 
    component: NotFound 
  } 
] 

const router = createRouter({ 
  history: createWebHistory(), 
  routes 
}) 

console.log('Routes loaded:', routes);

export default router