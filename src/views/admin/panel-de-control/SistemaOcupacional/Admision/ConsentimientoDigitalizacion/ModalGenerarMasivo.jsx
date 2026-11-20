import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTimes } from '@fortawesome/free-solid-svg-icons';
import { GenerarConsentimientosMasivo } from './controllerConsentimientoDigitalizacion';

const CAMPO = 'w-full border border-gray-400 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400';
const SOLO_NUMEROS_Y_COMAS = /[^0-9,\s]/g;

// Registra el consentimiento de varias órdenes a la vez. Si alguna falla, el modal queda abierto con
// solo los N° de orden fallidos para reintentar.
const ModalGenerarMasivo = ({ fechaInicial, userlogued, token, onClose }) => {
  const [nordenes, setNordenes] = useState('');
  const [fecha, setFecha] = useState(fechaInicial);
  const [procesando, setProcesando] = useState(false);

  const guardar = async () => {
    setProcesando(true);
    const resultado = await GenerarConsentimientosMasivo(nordenes, fecha, userlogued, token);
    setProcesando(false);
    if (!resultado) return;
    if (resultado.fallidos.length > 0) setNordenes(resultado.fallidos.map((f) => f.norden).join(', '));
    else onClose();
  };

  const cerrar = () => !procesando && onClose();
  const sinDatos = procesando || !nordenes.trim() || !fecha;

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg overflow-hidden shadow-xl w-[500px] max-h-[90%]">
        <div className="px-4 py-2 naranjabackgroud flex justify-between items-center">
          <h2 className="text-lg font-bold color-blanco">Generar masivo</h2>
          <button onClick={cerrar} className="text-xl text-white" style={{ fontSize: '23px' }}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className="px-6 py-5 flex flex-col gap-4">
          <label className="block">
            <span className="block mb-1 font-bold text-black">Nro. Orden (separados por comas)</span>
            <textarea
              rows={4}
              value={nordenes}
              onChange={(e) => setNordenes(e.target.value.replace(SOLO_NUMEROS_Y_COMAS, ''))}
              onPaste={(e) => {
                e.preventDefault();
                const texto = e.clipboardData.getData('text').replace(SOLO_NUMEROS_Y_COMAS, '');
                setNordenes((prev) => prev + texto);
              }}
              className={CAMPO}
              placeholder="Ej: 12345, 12346, 12347"
              disabled={procesando}
            />
          </label>
          <label className="block">
            <span className="block mb-1 font-bold text-black">Fecha</span>
            <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className={CAMPO} disabled={procesando} />
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              className="flex items-center gap-2 px-6 py-2 rounded-md font-semibold text-gray-800 bg-gray-200 hover:bg-gray-300 shadow border border-gray-400 transition-colors duration-200"
              onClick={cerrar}
              disabled={procesando}
            >
              Cancelar
            </button>
            <button
              type="button"
              className={`flex items-center gap-2 px-6 py-2 rounded-md font-semibold text-white shadow transition-colors duration-200 ${sinDatos ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              onClick={guardar}
              disabled={sinDatos}
            >
              <FontAwesomeIcon icon={faEdit} />
              {procesando ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalGenerarMasivo;
