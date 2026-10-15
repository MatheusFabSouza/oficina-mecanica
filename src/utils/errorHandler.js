// src/utils/errorHandler.js
export function extrairMensagemErro(error) {
  if (!error.response) {
    return 'Erro de conexão com o servidor. Verifique sua internet.';
  }

  const { status, data } = error.response;

  if (status === 400) {
    if (typeof data === 'string') return data;
    if (data.detail) return data.detail;
    if (data.non_field_errors) return data.non_field_errors.join(' ');
    if (Array.isArray(data)) return data.join(' ');
    
    // Retorna o primeiro erro encontrado por campo
    const campos = Object.keys(data);
    if (campos.length > 0) {
      const campo = campos[0];
      const mensagens = Array.isArray(data[campo]) ? data[campo].join(' ') : data[campo];
      return `${campo}: ${mensagens}`;
    }
    return 'Dados inválidos. Verifique os campos.';
  }

  if (status === 403) return 'Você não tem permissão para esta ação.';
  if (status === 404) return 'Registro não encontrado.';
  if (status === 429) return 'Muitas tentativas, aguarde um minuto.';

  return 'Ocorreu um erro inesperado. Tente novamente.';
}