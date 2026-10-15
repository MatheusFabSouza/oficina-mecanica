// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  // Busca dados do usuário autenticado
  const carregarUsuario = async () => {
    try {
      const res = await api.get('/auth/eu/');
      setUsuario(res.data);
    } catch (err) {
      setUsuario(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      carregarUsuario();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, senha) => {
    const res = await api.post('/auth/login/', {
      organizacao: 'oficina-mecanica',
      email,
      senha,
    });
    localStorage.setItem('access_token', res.data.access);
    localStorage.setItem('refresh_token', res.data.refresh);
    await carregarUsuario();
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUsuario(null);
  };

  // Regra de ouro do guia: checar pelas 'permissoes', nunca pelo nome do grupo
  const temPermissao = (permissao) => {
    return usuario?.permissoes?.includes(permissao) || false;
  };

  return (
    <AuthContext.Provider value={{ usuario, loading, login, logout, temPermissao, carregarUsuario }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);