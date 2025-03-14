<template>
  <div class="min-h-screen flex flex-col items-center justify-center">
    <h1 class="text-4xl font-bold mb-8">Bienvenido</h1>
    <div class="space-x-4">
      <router-link 
        to="/register" 
        class="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
      >
        Registrarse
      </router-link>
      <router-link 
        to="/login" 
        class="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700"
      >
        Iniciar Sesión
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Landing'
}
</script> 