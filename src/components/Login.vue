<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Iniciar Sesión
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div v-if="error" class="text-red-500 text-sm text-center">
          {{ error }}
        </div>
        
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email" class="sr-only">Email</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              v-model="formData.email"
              required 
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
              placeholder="Correo electrónico"
            >
          </div>
          <div>
            <label for="password" class="sr-only">Contraseña</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              v-model="formData.password"
              required 
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
              placeholder="Contraseña"
            >
          </div>
        </div>

        <div>
          <button 
            type="submit" 
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Iniciar Sesión
          </button>
        </div>

        <div>
          <button 
            type="button"
            @click="handleGoogleLogin"
            class="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <img 
              src="@/assets/google-icon.png" 
              alt="Google" 
              class="w-5 h-5 mr-2"
            >
            Continuar con Google
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'Login',
  setup() {
    const router = useRouter();
    const error = ref('');
    const formData = ref({
      email: '',
      password: ''
    });

    const handleSubmit = async () => {
      try {
        const response = await axios.post('http://127.0.0.1:8000/dj-rest-auth/login/', {
          email: formData.value.email,
          password: formData.value.password
        });

        // Guardar el token en localStorage
        localStorage.setItem('token', response.data.key);
        
        // Configurar el token para futuras peticiones
        axios.defaults.headers.common['Authorization'] = `Token ${response.data.key}`;
        
        // Redireccionar al usuario
        router.push('/main');
      } catch (err) {
        error.value = 'Error al iniciar sesión. Por favor, verifica tus credenciales.';
      }
    };

    const handleGoogleLogin = () => {
      window.location.href = 'http://127.0.0.1:8000/accounts/google/login/';
    };

    return {
      formData,
      error,
      handleSubmit,
      handleGoogleLogin
    };
  }
};
</script> 