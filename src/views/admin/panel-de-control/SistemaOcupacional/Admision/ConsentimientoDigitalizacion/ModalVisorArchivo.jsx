import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

// Visor del PDF digitalizado de la orden. `archivo` = { nombreArchivo, mensaje (url) }.
const ModalVisorArchivo = ({ archivo, onClose }) => (
  <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
    <div className="bg-white rounded-lg overflow-hidden overflow-y-auto shadow-xl w-[700px] h-[auto] max-h-[90%]">
      <div className="px-4 py-2 naranjabackgroud flex justify-between">
        <h2 className="text-lg font-bold color-blanco">{archivo.nombreArchivo}</h2>
        <button onClick={onClose} className="text-xl text-white" style={{ fontSize: '23px' }}>×</button>
      </div>
      <div className="px-6 py-4  overflow-y-auto flex h-auto justify-center items-center">
        <iframe
          src={`https://docs.google.com/gview?url=${encodeURIComponent(`${archivo.mensaje}`)}&embedded=true`}
          type="application/pdf"
          className="h-[500px] w-[500px] max-w-full"
        />
      </div>
      <div className="flex justify-center">
        <a href={archivo.mensaje} download={archivo.nombreArchivo} className="azul-btn font-bold py-2 px-4 rounded mb-4">
          <FontAwesomeIcon icon={faDownload} className="mr-2" /> Descargar
        </a>
      </div>
    </div>
  </div>
);

export default ModalVisorArchivo;
