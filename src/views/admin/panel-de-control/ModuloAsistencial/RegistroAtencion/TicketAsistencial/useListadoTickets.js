import { useCallback, useEffect, useRef, useState } from "react";
import { ListarTicketsFiltros } from "./controllerTicketAsistencial";

// opcion_id_p de POST /api/tickets/reporte/filtros
const OPCION_TICKETS = { ULTIMOS: 1, POR_NUMERO: 2, POR_NOMBRE: 3 };

const BUSQUEDA_VACIA = { numero: "", nombre: "" };
const ESPERA_BUSQUEDA_MS = 400;

// Listado "Últimos tickets": con ambos filtros vacíos trae lo más reciente de la sede; el nombre busca
// solo (con espera) y el N° de ticket se busca con Enter.
export const useListadoTickets = (sede, token) => {
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
      const lista = await ListarTicketsFiltros(filtro, sede, token);
      if (id === ultimaConsulta.current) {
        if (lista.length > 0 || !conservarSiVacio) setRegistros(lista);
        setCargando(false);
      }
      return lista;
    },
    [sede, token]
  );

  useEffect(() => {
    if (!busqueda.numero && !busqueda.nombre) consultar({ opcion: OPCION_TICKETS.ULTIMOS });
  }, [busqueda.numero, busqueda.nombre, version, consultar]);

  useEffect(() => () => clearTimeout(temporizador.current), []);

  const cambiarNombre = (nombre) => {
    clearTimeout(temporizador.current);
    setBusqueda({ numero: "", nombre });
    if (!nombre.trim()) return; // al vaciarlo, el efecto de arriba recarga la lista por defecto
    temporizador.current = setTimeout(
      () => consultar({ opcion: OPCION_TICKETS.POR_NOMBRE, nombres: nombre.trim() }),
      ESPERA_BUSQUEDA_MS
    );
  };

  const cambiarNumero = (numero) => {
    clearTimeout(temporizador.current);
    setBusqueda({ numero, nombre: "" });
  };

  // true si no había nada que buscar o si hubo resultados; false si no se encontró nada
  const buscarPorNumero = async () => {
    if (!busqueda.numero) return true;
    const lista = await consultar(
      { opcion: OPCION_TICKETS.POR_NUMERO, numeroTicket: Number(busqueda.numero) },
      { conservarSiVacio: true }
    );
    return lista.length > 0;
  };

  const refrescar = () => {
    clearTimeout(temporizador.current);
    setBusqueda(BUSQUEDA_VACIA);
    setVersion((v) => v + 1);
  };

  return { registros, cargando, busqueda, cambiarNombre, cambiarNumero, buscarPorNumero, refrescar };
};
