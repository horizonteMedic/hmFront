import { useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import SectionFieldset from '../../../../components/reusableComponents/SectionFieldset';
import InputTextOneLine from '../../../../components/reusableComponents/InputTextOneLine';
import { formatearFechaCorta } from '../../../../utils/formatDateUtils';
import Modal from './Modal';
import { getFetch } from '../../getFetch/getFetch.js';

const COLUMNAS = ['Usuario', 'Sede', 'Cantidad', 'Fecha de Reserva', 'Fecha de Registro', 'Detalles'];
const CELDA = 'px-2 py-[6px] text-slate-800';

// Reservas de pacientes programadas por el usuario (GET listadoReserva: BackendEntityReservaListaDTO).
// Es un listado de solo lectura: no hay un registro que editar, por eso no lleva barra de edición ni auditoría.
const ReservaPacientes = ({ token, userlogued }) => {
  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [seleccionada, setSeleccionada] = useState(null);

  useEffect(() => {
    let vigente = true;
    setCargando(true);
    getFetch(`/api/v01/ct/ocupacional/listadoReserva/${userlogued}`, token)
      .then((res) => vigente && setReservas(Array.isArray(res) ? res : []))
      .catch(() => vigente && setReservas([]))
      .finally(() => vigente && setCargando(false));
    return () => {
      vigente = false;
    };
  }, [token, userlogued]);

  // Busca por usuario, sede o cualquiera de las dos fechas
  const visibles = useMemo(() => {
    const buscado = busqueda.trim().toLowerCase();
    if (!buscado) return reservas;
    return reservas.filter((r) =>
      [r.usuario, r.sede, r.nomensede, r.fechaReserva, formatearFechaCorta(r.fechaReserva), r.fechaRegistro, formatearFechaCorta(r.fechaRegistro)]
        .some((valor) => String(valor ?? '').toLowerCase().includes(buscado))
    );
  }, [reservas, busqueda]);

  return (
    <div className="space-y-3 px-4 max-w-[90%] xl:max-w-[80%] mx-auto">
      <SectionFieldset
        legend="Reserva de Pacientes"
        className="space-y-3"
        actions={<span className="font-bold">{visibles.length} reservas</span>}
      >
        <InputTextOneLine
          label="Buscar"
          name="busquedaReserva"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Usuario, sede o fecha"
          labelWidth="70px"
          className="sm:max-w-[420px]"
          autocomplete="off"
        />

        <div className="max-h-[calc(100vh-360px)] min-h-[200px] overflow-y-auto rounded-md border-[1px] border-slate-200 bg-white">
          <table className="w-full text-center text-base">
            <thead>
              <tr>
                {COLUMNAS.map((columna) => (
                  <th
                    key={columna}
                    className="sticky top-0 z-10 bg-slate-100 px-2 py-[6px] font-bold text-slate-700 shadow-[inset_0_-1px_0_#cbd5e1]"
                  >
                    {columna}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibles.length === 0 && (
                <tr>
                  <td colSpan={COLUMNAS.length} className="px-2 py-[28px] text-slate-500">
                    {cargando ? 'Cargando...' : reservas.length === 0 ? 'No hay reservas registradas' : 'Sin resultados para la búsqueda'}
                  </td>
                </tr>
              )}
              {visibles.map((reserva, index) => (
                <tr key={reserva.id ?? index} className="border-b-[1px] border-slate-100 hover:bg-blue-50">
                  <td className={CELDA}>{reserva.usuario}</td>
                  <td className={CELDA}>{reserva.sede}</td>
                  <td className={CELDA}>{reserva.cantidad}</td>
                  <td className={CELDA}>{formatearFechaCorta(reserva.fechaReserva) || reserva.fechaReserva}</td>
                  <td className={CELDA}>{formatearFechaCorta(reserva.fechaRegistro) || reserva.fechaRegistro}</td>
                  <td className={CELDA}>
                    <button
                      type="button"
                      title="Ver detalle de la reserva"
                      onClick={() => setSeleccionada(reserva)}
                      className="inline-flex items-center gap-1.5 rounded bg-blue-600 px-3 py-1 text-white transition-colors hover:bg-blue-700"
                    >
                      <FontAwesomeIcon icon={faEye} /> Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionFieldset>

      {seleccionada && <Modal user={seleccionada} onClose={() => setSeleccionada(null)} token={token} />}
    </div>
  );
};

export default ReservaPacientes;
