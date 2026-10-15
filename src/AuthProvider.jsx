import { useState, useEffect, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import { api, ORGANIZACAO, getAccessToken, setTokens, clearTokens } from './api/client';

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  const carregarUsuario = useCallback(async () => {
    if (!getAccessToken()) {
      setUsuario(null);
      setCarregando(false);
      return null;
    }
    try {
      const dados = await api.get('/auth/eu/');
      setUsuario(dados);
      return dados;
    } catch {
      clearTokens();
      setUsuario(null);
      return null;
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarUsuario();
    const handleLogout = () => setUsuario(null);
    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, [carregarUsuario]);

  const login = async (email, senha) => {
    const tokens = await api.post(
      '/auth/login/',
      { organizacao: ORGANIZACAO, email, senha },
      { publico: true }
    );
    setTokens(tokens.access, tokens.refresh);
    return await carregarUsuario();
  };

  const cadastrar = async (nome, email, senha) => {
    await api.post(
      '/auth/cadastro/',
      { organizacao: ORGANIZACAO, nome, email, senha },
      { publico: true }
    );
    return await login(email, senha);
  };

  const logout = () => {
    clearTokens();
    setUsuario(null);
  };

  const temPermissao = (permissao) => {
    return Boolean(usuario?.permissoes?.includes(permissao));
  };

  const isAdmin = temPermissao('api.change_organizacao');

  return (
    <AuthContext.Provider
      value={{
        usuario,
        carregando,
        login,
        cadastrar,
        logout,
        recarregarUsuario: carregarUsuario,
        temPermissao,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}