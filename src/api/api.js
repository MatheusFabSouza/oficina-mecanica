// src/api/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://agendamentos.spaincentral.cloudapp.azure.com/api',
});

// Anexa o token de acesso em toda requisição
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepta respostas e renova token se der 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Se o erro for 401 e ainda não tentamos renovar nesta chamada
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');

      if (refreshToken) {
        try {
          const res = await axios.post(
            'https://agendamentos.spaincentral.cloudapp.azure.com/api/auth/renovar/',
            { refresh: refreshToken }
          );
          
          const newAccess = res.data.access;
          localStorage.setItem('access_token', newAccess);

          // Atualiza o header da requisição que falhou e tenta novamente
          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
          return api(originalRequest);
        } catch (refreshErr) {
          // Refresh expirado ou inválido: limpa e redireciona
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
        }
      } else {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;