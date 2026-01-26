import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint, faEdit, faEraser, faDownload } from '@fortawesome/free-solid-svg-icons';
import { useForm } from '../../../../../hooks/useForm';
import { useSessionData } from '../../../../../hooks/useSessionData';
import { getToday } from '../../../../../utils/helpers';
import {
  handleSubirArchivo,
  PrintHojaR,
  ReadArchivosForm,
  SubmitDataService,
  VerifyTR,
} from "./controllerConsentimientoDigitalizacion";
import { useState } from 'react';
import ButtonsPDF from '../../../../../components/reusableComponents/ButtonsPDF';

const tabla = 'consen_digit';

const ConsentimientoDigitalizacion = () => {
  const today = getToday();
  const { token, selectedSede, userlogued } = useSessionData();

  const initialFormState = {
    norden: '',
    fecha: today,
    nombres: '',
    dni: '',
    authorized: true,

    SubirDoc: false,
    nomenclatura: "DECLARACION USO FIRMA"
  };
  const [visualerOpen, setVisualerOpen] = useState(null)

  const {
    form,
    setForm,
    handleChangeSimple,
    handleChange,
    handleChangeNumberDecimals,
    handleClear,
    handleClearnotO,
  } = useForm(initialFormState);

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      handleClearnotO();
      VerifyTR(form.norden, tabla, token, setForm, selectedSede);
    }
  };

  const handleSave = () => {
    SubmitDataService(form, token, userlogued, handleClear, tabla);
  };

  const canSave =
    String(form.norden).trim() &&
    String(form.fecha).trim() &&
    String(form.nombres).trim() &&
    String(form.dni).trim() &&
    form.authorized;

  const handlePrint = () => {
    PrintHojaR(form.norden, token, tabla);
  };

  return (
    <div className="max-w mx-auto bg-white rounded-xl shadow-lg p-8">
      <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
        <label className="flex-1">
          <span className="block mb-1" style={{ color: '#000', fontWeight: 'bold' }}>Nro: Orden</span>
          <input
            type="text"
            name="norden"
            value={form.norden}
            onChange={handleChangeNumberDecimals}
            onKeyUp={e => {
              if (e.key === 'Enter') {
                handleSearch(e);
              }
            }}
            className="w-full border border-gray-400 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            placeholder="Ingrese número de orden"
          />
        </label>
        <label className="flex-1">
          <span className="block mb-1" style={{ color: '#000', fontWeight: 'bold' }}>Fecha</span>
          <input
            type="date"
            name="fecha"
            value={form.fecha}
            onChange={handleChangeSimple}
            className="w-full border border-gray-400 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
        {form.SubirDoc &&
          <ButtonsPDF
            handleSave={() => { handleSubirArchivo(form, selectedSede, userlogued, token) }}
            handleRead={() => { ReadArchivosForm(form, setVisualerOpen, token) }}
          />
        }
      </div>

      <h2 className="text-center text-2xl mb-8 tracking-wide" style={{ color: '#000', fontWeight: 'bold' }}>
        DECLARACIÓN JURADA PARA EL USO DE LA FIRMA ELECTRÓNICA
      </h2>

      <div className="flex flex-col md:flex-row items-center gap-3 mb-6">
        <span className="font-medium" style={{ color: '#000', fontWeight: 'bold' }}>Yo,</span>
        <input
          type="text"
          name="nombres"
          placeholder="Nombre completo"
          value={form.nombres}
          onChange={handleChange}
          className="flex-1 border border-gray-400 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
        />
        <span className="font-medium whitespace-nowrap" style={{ color: '#000', fontWeight: 'bold' }}>identificado(a) con DNI N.º</span>
        <input
          type="text"
          name="dni"
          placeholder="DNI"
          value={form.dni}
          onChange={handleChangeNumberDecimals}
          className="w-40 border border-gray-400 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
        />
      </div>

      <div className="flex items-start gap-3 mb-8">
        <input
          type="checkbox"
          name="authorized"
          checked={form.authorized}
          onChange={e => setForm(prev => ({ ...prev, authorized: e.target.checked }))}
          className="mt-1 w-5 h-5 accent-blue-600 border-2 border-blue-600 rounded focus:ring-2 focus:ring-blue-500"
        />
        <span className="text-base leading-relaxed">
          Autorizo el uso de mi firma electrónica y huella, exclusivamente para la impresión de informes médicos. Esta firma tendrá validez para los documentos necesarios implicados en este proceso. Asimismo, doy fe de que la información proporcionada es verídica, al igual que la información que brindaré durante los exámenes realizados en el centro médico Horizonte Medic. También, autorizo el envío de información médica a los correos electrónicos y/o números de celular de la empresa contratista.
        </span>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4 border-t pt-6 mt-6">
        <button
          className={`flex items-center gap-2 px-6 py-2 rounded-md font-semibold text-white shadow transition-colors duration-200 ${canSave ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
          disabled={!canSave}
          onClick={handleSave}
        >
          <FontAwesomeIcon icon={faEdit} />
          Grabar/actualizar
        </button>
        <button
          className="flex items-center gap-2 px-6 py-2 rounded-md font-semibold text-white bg-green-600 hover:bg-green-700 shadow transition-colors duration-200"
          onClick={handlePrint}
        >
          <FontAwesomeIcon icon={faPrint} />
          Imprimir
        </button>
        <button
          className="flex items-center gap-2 px-6 py-2 rounded-md font-semibold text-gray-800 bg-gray-200 hover:bg-gray-300 shadow border border-gray-400 transition-colors duration-200"
          onClick={handleClear}
        >
          <FontAwesomeIcon icon={faEraser} />
          Limpiar
        </button>
      </div>
      {visualerOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg overflow-hidden overflow-y-auto shadow-xl w-[700px] h-[auto] max-h-[90%]">
            <div className="px-4 py-2 naranjabackgroud flex justify-between">
              <h2 className="text-lg font-bold color-blanco">{visualerOpen.nombreArchivo}</h2>
              <button onClick={() => setVisualerOpen(null)} className="text-xl text-white" style={{ fontSize: '23px' }}>×</button>
            </div>
            <div className="px-6 py-4  overflow-y-auto flex h-auto justify-center items-center">
              <iframe src={`https://docs.google.com/gview?url=${encodeURIComponent(`${visualerOpen.mensaje}`)}&embedded=true`} type="application/pdf" className="h-[500px] w-[500px] max-w-full" />
            </div>
            <div className="flex justify-center">
              <a href={visualerOpen.mensaje} download={visualerOpen.nombreArchivo} className="azul-btn font-bold py-2 px-4 rounded mb-4">
                <FontAwesomeIcon icon={faDownload} className="mr-2" /> Descargar
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsentimientoDigitalizacion;
