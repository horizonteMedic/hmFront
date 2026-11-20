import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GetHistoriaC } from '../../model/AdminHistoriaC';
import { esEmpresaLaArena } from './constantes.js';

const BUSQUEDA_VACIA = { codigo: '', nombre: '' };
const ESPERA_BUSQUEDA_MS = 400;

// Listado "Últimos agregados": con ambos filtros vacíos trae lo más reciente de la sede; el nombre
// busca solo (con espera) y el código se busca con Enter. El backend no filtra por empresa, así que
// `visibles` deja solo las de La Arena (`registros` conserva todas: el N° de atención del día de la
// hoja de ruta cuenta las de todas las empresas).
export const useListadoHistorias = (sede, token) => {
  const [registros, setRegistros] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState(BUSQUEDA_VACIA);
  const [version, setVersion] = useState(0);
  const temporizador = useRef(null);
  const ultimaConsulta = useRef(0);

  const consultar = useCallback(
    async (filtro, { conservarSiVacio = false } = {}) => {
      const id = ++ultimaConsulta.current; // una respuesta vieja nunca pisa a una más nueva
      setCargando(true);
      let lista = [];
      try {
        const res = await GetHistoriaC(filtro, sede, token);
        lista = Array.isArray(res) ? res : [];
      } catch {
        lista = [];
      }
      if (id === ultimaConsulta.current) {
        if (lista.length > 0 || !conservarSiVacio) setRegistros(lista);
        setCargando(false);
      }
      return lista;
    },
    [sede, token]
  );

  useEffect(() => {
    if (!busqueda.codigo && !busqueda.nombre) {
      consultar({ opcion_id_p: 1, nombres_apellidos_p: '' });
    }
  }, [busqueda.codigo, busqueda.nombre, version, consultar]);

  useEffect(() => () => clearTimeout(temporizador.current), []);

  const cambiarNombre = (nombre) => {
    clearTimeout(temporizador.current);
    setBusqueda({ codigo: '', nombre });
    if (!nombre.trim()) return; // al vaciarlo, el efecto de arriba recarga la lista por defecto
    temporizador.current = setTimeout(
      () => consultar({ opcion_id_p: 3, norden: '', nombres_apellidos_p: nombre }),
      ESPERA_BUSQUEDA_MS
    );
  };

  const cambiarCodigo = (codigo) => {
    clearTimeout(temporizador.current);
    setBusqueda({ codigo, nombre: '' });
  };

  // true si no había nada que buscar o si hubo resultados; false si no se encontró nada
  const buscarPorCodigo = async () => {
    if (!busqueda.codigo) return true;
    const lista = await consultar(
      { opcion_id_p: 2, norden: Number(busqueda.codigo), nombres_apellidos_p: '' },
      { conservarSiVacio: true }
    );
    return lista.length > 0;
  };

  const refrescar = () => {
    clearTimeout(temporizador.current);
    setBusqueda(BUSQUEDA_VACIA);
    setVersion((v) => v + 1);
  };

  const visibles = useMemo(() => registros.filter((r) => esEmpresaLaArena(r.razon_empresa)), [registros]);

  return { registros, visibles, cargando, busqueda, cambiarNombre, cambiarCodigo, buscarPorCodigo, refrescar };
};
