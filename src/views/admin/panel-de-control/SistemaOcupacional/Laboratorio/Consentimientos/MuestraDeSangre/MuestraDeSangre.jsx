import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faBroom, faPrint } from '@fortawesome/free-solid-svg-icons';
import { useSessionData } from '../../../../../../hooks/useSessionData';
import { useForm } from '../../../../../../hooks/useForm';
import { InputTextOneLine } from '../../../../../../components/reusableComponents/ResusableComponents';
import SectionFieldset from '../../../../../../components/reusableComponents/SectionFieldset';
import { PrintHojaR, SubmitDataService, VerifyTR } from './controllerMuestraDeSangre';
import { getToday } from '../../../../../../utils/helpers';

const MuestraDeSangre = () => {
  const { token, userlogued, selectedSede } = useSessionData();
  const today = getToday();

  const initialFormState = {
    norden: '',
    fecha: today,
    nombres: '',
    edad: '',
    dni: '',
    empresa: '',
  };

  const { form, setForm, handleChange, handleClear, handlePrintDefault } = useForm(initialFormState);

  const handleset = () => {
    setForm(prev => ({
      ...prev,
      fecha: today,
      nombres: '',
      edad: '',
      dni: '',
      empresa: '',
    }));
  };

  const handlePrint = () => {
    handlePrintDefault(() => {
      PrintHojaR(form, token);
    }, '¿Desea Imprimir Consentimiento Muestra de Sangre?', form.norden);
  };

  const handleSubmit = () => {
    SubmitDataService(form, token, userlogued, handleClear);
  };

  return (
    <div className="w-full max-w-[70vw] mx-auto bg-white rounded shadow p-6">
      <h2 className="text-2xl font-bold text-center mb-6">CONSENTIMIENTO INFORMADO PARA LA TOMA DE MUESTRA DE SANGRE</h2>
      
      <form className="space-y-6">
        <SectionFieldset legend="Datos del Paciente" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <InputTextOneLine
              label="Nro Orden"
              name="norden"
              value={form.norden}
              onChange={handleChange}
              onKeyUp={(event) => {
                if (event.key === 'Enter') {
                  handleset();
                  VerifyTR(form.norden, token, setForm, selectedSede);
                }
              }}
              labelWidth="120px"
              className="flex-1"
            />
            <InputTextOneLine
              label="Fecha"
              name="fecha"
              type="date"
              value={form.fecha}
              onChange={handleChange}
              labelWidth="120px"
              className="flex-1"
            />
          </div>
        </SectionFieldset>

        <SectionFieldset legend="Información Personal" className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-base">
            <span>YO,</span>
            <input
              name="nombres"
              value={form.nombres || ''}
              readOnly
              className="border-b border-gray-400 px-3 py-2 min-w-[120px] max-w-[400px] text-base bg-gray-100 cursor-not-allowed"
              style={{ width: `${Math.min(400, Math.max(120, (form.nombres?.length || 0) * 10))}px` }}
            />
            <span>de,</span>
            <input
              name="edad"
              value={form.edad || ''}
              readOnly
              className="border-b border-gray-400 px-3 py-2 min-w-[50px] max-w-[80px] text-base bg-gray-100 cursor-not-allowed"
              style={{ width: `${Math.min(80, Math.max(50, (String(form.edad)?.length || 0) * 14))}px` }}
            />
            <span>años de edad, identificado con DNI nº</span>
            <input
              name="dni"
              value={form.dni || ''}
              readOnly
              className="border-b border-gray-400 px-3 py-2 min-w-[80px] max-w-[120px] text-base bg-gray-100 cursor-not-allowed"
              style={{ width: `${Math.min(120, Math.max(80, (String(form.dni)?.length || 0) * 10))}px` }}
            />
          </div>
          <div className="text-justify text-base">
            ; habiendo recibido consejería e información acerca de los exámenes en sangre que se me va ha realizar según solicitud del protocolo médico de la empresa
          </div>
          <div className="flex justify-center">
            <input
              name="empresa"
              value={form.empresa || ''}
              readOnly
              className="border-b border-gray-400 px-3 py-2 w-96 text-base bg-gray-100 cursor-not-allowed"
              placeholder="Protocolo médico de la empresa"
            />
          </div>
          <div className="text-justify text-base">
            ; y en pleno uso de mis facultades mentales AUTORIZO se me tome la muestra de sangre para cumplir con los exámenes pertinentes.
          </div>
        </SectionFieldset>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faSave} /> Guardar/Actualizar
            </button>
            <button
              type="button"
              className="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-2 rounded flex items-center gap-2"
              onClick={handleClear}
            >
              <FontAwesomeIcon icon={faBroom} /> Limpiar
            </button>
          </div>

          <div className="flex flex-col items-end">
            <span className="font-bold italic mb-2">Imprimir</span>
            <div className="flex items-center gap-2">
              <input
                name="norden"
                value={form.norden}
                onChange={handleChange}
                className="border rounded px-2 py-1 text-base w-24"
              />
              <button
                type="button"
                onClick={handlePrint}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faPrint} />
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default MuestraDeSangre;
