import { useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';

export function useApi(endpoint, { paginado = false, auto = true } = {}) {
  const [dados, setDados] = useState(paginado ? [] : null);
  const [carregando, setCarregando] = useState(auto);
  const [carregandoMais, setCarregandoMais] = useState(false);
  const [erro, setErro] = useState(null);
  const [proximaPagina, setProximaPagina] = useState(null);

  const carregar = useCallback(async () => {
    if (!endpoint) return;
    setCarregando(true);
    setErro(null);
    try {
      const res = await api.get(endpoint);
      if (paginado) {
        if (Array.isArray(res)) {
          setDados(res);
          setProximaPagina(null);
        } else {
          const lista = Array.isArray(res?.results)
            ? res.results
            : Array.isArray(res?.data)
              ? res.data
              : [];
          setDados(lista);
          setProximaPagina(res?.next || res?.links?.next || null);
        }
      } else {
        setDados(res);
      }
    } catch (err) {
      setErro(err);
    } finally {
      setCarregando(false);
    }
  }, [endpoint, paginado]);

  const carregarMais = async () => {
    if (!proximaPagina || carregandoMais) return;
    setCarregandoMais(true);
    try {
      const res = await api.get(proximaPagina);
      const novos = Array.isArray(res)
        ? res
        : Array.isArray(res?.results)
          ? res.results
          : Array.isArray(res?.data)
            ? res.data
            : [];
      setDados((atual) => [...(Array.isArray(atual) ? atual : []), ...novos]);
      setProximaPagina(res?.next || res?.links?.next || null);
    } catch (err) {
      setErro(err);
    } finally {
      setCarregandoMais(false);
    }
  };

  useEffect(() => {
    if (auto) carregar();
  }, [carregar, auto]);

  return {
    dados,
    setDados,
    carregando,
    carregandoMais,
    erro,
    proximaPagina,
    recarregar: carregar,
    carregarMais,
  };
}