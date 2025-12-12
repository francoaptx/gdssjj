// Vista NotFound 
<template> 
  <div class="not-found"> 
    <h1>404 - Pagina no encontrada</h1> 
    <p>La pagina que buscas no existe.</p> 
    <router-link to="/">Volver al inicio</router-link> 
  </div> 
</template> 
 
<script> 
export default { 
  name: 'NotFound' 
} 
</script> 
 
<style scoped> 
.not-found { 
  text-align: center; 
  padding: 50px; 
} 
.not-found h1 { 
  color: #e74c3c; 
  font-size: 3rem; 
} 
.not-found a { 
  color: #3498db; 
  text-decoration: none; 
} 
</style> 
