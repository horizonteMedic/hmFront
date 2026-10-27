import { useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import InputTextOneLine from '../../../../components/reusableComponents/InputTextOneLine';
import { formatearFechaCorta } from '../../../../utils/formatDateUtils';
import { SubmitDetalleCita } from './model/AdminCitas';

const COLUMNAS = ['Sede', 'DNI', 'Empresa', 'Contrata', 'Programador', 'Fecha'];
const CELDA = 'px-2 py-[6px] text-slate-800';

// Detalle de una reserva (POST citaOcupacional/detalleReserva: BackendDetalleReservaDTO), con filtro por DNI.
// `user` es la fila elegida de ReservaPacientes: { usuario, nomensede, fechaReserva, ... }.
const Modal = ({ user, onClose, token }) => {
  const [detalle, setDetalle] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [dni, setDni] = useState('');

  useEffect(() => {
    let vigente = true;
    SubmitDetalleCita(user, token)
      .then((res) => vigente && setDetalle(Array.isArray(res) ? res : []))
      .catch(() => vigente && setDetalle([]))
      .finally(() => vigente && setCargando(false));
    return () => {
      vigente = false;
    };
  }, [user, token]);

  const visibles = useMemo(() => detalle.filter((fila) => String(fila.dni ?? '').includes(dni)), [detalle, dni]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
      <div
        className="mx-auto w-full max-w-[60%] rounded bg-white shadow-lg"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.key === 'Escape' && onClose()}
      >
        <div className="flex items-center justify-between rounded-t bg-primario px-4 py-2 text-white">
          <h2 className="mb-0 text-lg font-bold">Pacientes registrados por el usuario: {user?.usuario}</h2>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="text-white">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="space-y-3 p-4">
          <InputTextOneLine
            label="DNI"
            name="busquedaDni"
            value={dni}
            onChange={(e) => setDni(e.target.value.replace(/\D/g, '').slice(0, 8))}
            placeholder="Buscar DNI..."
            inputMode="numeric"
            maxLength={8}
            labelWidth="50px"
            className="sm:max-w-[320px]"
            autocomplete="off"
          />

          <div className="max-h-[60vh] overflow-y-auto rounded-md border-[1px] border-slate-200">
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
                      {cargando ? 'Cargando...' : 'No se encontraron datos'}
                    </td>
                  </tr>
                )}
                {visibles.map((fila, index) => (
                  <tr key={fila.idResp ?? index} className="border-b-[1px] border-slate-100">
                    <td className={CELDA}>{fila.sede}</td>
                    <td className={CELDA}>{fila.dni}</td>
                    <td className={CELDA}>{fila.empresa}</td>
                    <td className={CELDA}>{fila.contrata}</td>
                    <td className={CELDA}>{fila.programador}</td>
                    <td className={CELDA}>{formatearFechaCorta(fila.fecha) || fila.fecha}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
