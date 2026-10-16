const BASE_URL = (
  import.meta.env.VITE_API_URL ||
  'https://agendamentos.spaincentral.cloudapp.azure.com/api'
).replace(/\/+$/, '');
export const ORGANIZACAO = import.meta.env.VITE_ORGANIZACAO || 'oficina-mecanica';

export function getAccessToken() {
  return localStorage.getItem('access_token');
}

export function getRefreshToken() {
  return localStorage.getItem('refresh_token');
}

export function setTokens(access, refresh) {
  if (access) localStorage.setItem('access_token', access);
  if (refresh) localStorage.setItem('refresh_token', refresh);
}

export function clearTokens() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
}

export function extrairErros(status, data) {
  const resultado = { status, campos: {}, geral: '' };

  if (status === 403) {
    resultado.geral = 'Você não tem permissão para esta ação';
    return resultado;
  }
  if (status === 404) {
    resultado.geral = 'Não encontrado';
    return resultado;
  }
  if (status === 429) {
    resultado.geral = 'Muitas tentativas, aguarde um minuto';
    return resultado;
  }
  if (status === 400 && data) {
    if (typeof data === 'string') {
      resultado.geral = data;
    } else if (Array.isArray(data)) {
      resultado.geral = data.join(' ');
    } else if (typeof data === 'object') {
      Object.entries(data).forEach(([chave, valor]) => {
        const msg = Array.isArray(valor) ? valor.join(' ') : String(valor);
        if (chave === 'detail' || chave === 'non_field_errors') {
          resultado.geral = resultado.geral ? `${resultado.geral} ${msg}` : msg;
        } else {
          resultado.campos[chave] = msg;
        }
      });
    }
    if (!resultado.geral && Object.keys(resultado.campos).length === 0) {
      resultado.geral = 'Dados inválidos.';
    }
    return resultado;
  }

  resultado.geral = data?.detail || 'Erro ao comunicar com o servidor.';
  return resultado;
}

async function renovarToken() {
  const refresh = getRefreshToken();
  if (!refresh) return null;

  try {
    const res = await fetch(`${BASE_URL}/auth/renovar/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    });
    if (!res.ok) throw new Error();
    const dados = await res.json();
    setTokens(dados.access, dados.refresh || refresh);
    return dados.access;
  } catch {
    clearTokens();
    window.dispatchEvent(new Event('auth:logout'));
    return null;
  }
}

export async function request(path, options = {}, retry = true) {
  const { publico = false, ...fetchOptions } = options;
  const url = path.startsWith('http') ? path : `${BASE_URL}${path}`;
  const isFormData = fetchOptions.body instanceof FormData;
  const headers = { ...(fetchOptions.headers || {}) };

  if (!isFormData && fetchOptions.body && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const token = getAccessToken();
  if (token && !publico) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...fetchOptions,
    headers,
    body: isFormData
      ? fetchOptions.body
      : fetchOptions.body && typeof fetchOptions.body === 'object'
        ? JSON.stringify(fetchOptions.body)
        : fetchOptions.body,
  };

  let res;
  try {
    res = await fetch(url, config);
  } catch {
    throw { status: 0, campos: {}, geral: 'Falha de conexão com o servidor.' };
  }

  if (res.status === 401 && retry && !publico) {
    const novoToken = await renovarToken();
    if (novoToken) {
      return request(path, options, false);
    }
    throw { status: 401, campos: {}, geral: 'Sessão expirada.' };
  }

  if (res.status === 204) return null;

  const texto = await res.text();
  let data = null;
  try {
    data = texto ? JSON.parse(texto) : null;
  } catch {
    data = texto;
  }

  if (!res.ok) {
    throw extrairErros(res.status, data);
  }

  return data;
}

export const api = {
  get: (path, options) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options) => request(path, { ...options, method: 'POST', body }),
  patch: (path, body, options) => request(path, { ...options, method: 'PATCH', body }),
  delete: (path, options) => request(path, { ...options, method: 'DELETE' }),
  getAllPages: async (path) => {
    let resultados = [];
    let proximo = path;
    while (proximo) {
      const res = await request(proximo, { method: 'GET' });
      if (Array.isArray(res)) return res;
      resultados = resultados.concat(res?.results || []);
      proximo = res?.next || null;
    }
    return resultados;
  },
};