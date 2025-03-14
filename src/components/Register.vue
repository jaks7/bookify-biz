<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Crear una cuenta
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
            <label for="password1" class="sr-only">Contraseña</label>
            <input 
              id="password1" 
              name="password1" 
              type="password" 
              v-model="formData.password1"
              required 
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
              placeholder="Contraseña"
            >
          </div>
          <div>
            <label for="password2" class="sr-only">Confirmar Contraseña</label>
            <input 
              id="password2" 
              name="password2" 
              type="password" 
              v-model="formData.password2"
              required 
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
              placeholder="Confirmar Contraseña"
            >
          </div>
        </div>

        <div>
          <button 
            type="submit" 
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Registrarse
          </button>
        </div>

        <div class="text-center">
          <router-link 
            to="/login" 
            class="font-medium text-indigo-600 hover:text-indigo-500"
          >
            ¿Ya tienes una cuenta? Inicia sesión
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

export default {
  name: 'Register',
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const error = ref('');
    const formData = ref({
      email: '',
      password1: '',
      password2: ''
    });

    const handleSubmit = async () => {
      try {
        // Validar que las contraseñas coincidan
        if (formData.value.password1 !== formData.value.password2) {
          throw new Error('Las contraseñas no coinciden');
        }

        const response = await fetch('http://127.0.0.1:8000/dj-rest-auth/registration/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData.value)
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || Object.values(data)[0][0] || 'Error en el registro');
        }

        // Iniciar sesión automáticamente después del registro
        await authStore.login({
          email: formData.value.email,
          password: formData.value.password1
        });

        router.push('/main');
      } catch (err) {
        error.value = err.message || 'Error en el registro';
      }
    };

    return {
      formData,
      error,
      handleSubmit
    };
  }
};
</script> 