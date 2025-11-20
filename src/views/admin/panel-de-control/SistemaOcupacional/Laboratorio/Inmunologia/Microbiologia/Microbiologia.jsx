import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faBroom, faPrint } from '@fortawesome/free-solid-svg-icons';
import { useSessionData } from '../../../../../../hooks/useSessionData';
import { useForm } from '../../../../../../hooks/useForm';
import { getToday } from '../../../../../../utils/helpers';
import { PrintHojaR, SubmitDataService, VerifyTR } from './controller';
import {
  InputTextOneLine,
} from '../../../../../../components/reusableComponents/ResusableComponents';
import SectionFieldset from '../../../../../../components/reusableComponents/SectionFieldset';

const tabla = 'microbiologia';

export default function Microbiologia() {
  const { token, userlogued, selectedSede, datosFooter } = useSessionData();
  const today = getToday();

  const initialFormState = {
    norden: '',
    fecha: today,
    nombres: '',
    edad: '',
    examenDirecto: false,
    bk1: '',
    bk1Radio: '',
    bk2: '',
    bk2Radio: '',
    koh: '',
    kohRadio: '',
    medico: ''
  };

  const {
    form,
    setForm,
    handleChange,
    handleClear,
    handleClearnotO,
    handlePrintDefault,
  } = useForm(initialFormState);

  const handleExamenDirectoChange = (checked) => {
    setForm(prev => {
      const newState = { ...prev, examenDirecto: checked };
      if (checked) {
        // Examen Directo is checked, so BK1 and BK2 fields are disabled and should be cleared
        newState.bk1 = '';
        newState.bk1Radio = '';
        newState.bk2 = '';
        newState.bk2Radio = '';
      } else {
        // Examen Directo is unchecked, so KOH fields are disabled and should be cleared
        newState.koh = '';
        newState.kohRadio = '';
      }
      return newState;
    });
  };

  const handleSave = () => {
    SubmitDataService(form, token, userlogued, handleClear, tabla, datosFooter);
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      handleClearnotO();
      VerifyTR(form.norden, tabla, token, setForm, selectedSede);
    }
  };

  const handlePrint = () => {
    handlePrintDefault(() => {
      PrintHojaR(form.norden, token, tabla, datosFooter);
    });
  };

  const handleBk1RadioChange = (opt) => {
    setForm(prev => ({
      ...prev,
      bk1Radio: prev.bk1Radio === opt ? '' : opt,
      bk1: prev.bk1Radio === opt ? '' : opt
    }));
  };

  const handleBk2RadioChange = (opt) => {
    setForm(prev => ({
      ...prev,
      bk2Radio: prev.bk2Radio === opt ? '' : opt,
      bk2: prev.bk2Radio === opt ? '' : opt
    }));
  };

  const handleKohRadioChange = (opt) => {
    setForm(prev => ({
      ...prev,
      kohRadio: prev.kohRadio === opt ? '' : opt,
      koh: prev.kohRadio === opt ? '' : opt
    }));
  };

  const bkOptions = ["BAAR - NEGATIVO", "BAAR - POSITIVO", "N/A"];
  const kohOptions = ["NEGATIVO", "POSITIVO", "N/A"];

  return (
    <div className="w-full max-w-[70vw] mx-auto bg-white rounded shadow p-6">
      <h2 className="text-2xl font-bold text-center mb-6">MICROBIOLOGÍA</h2>
      <form className="space-y-6">
        <SectionFieldset
          legend="Información del Examen"
          className="grid grid-cols-1 lg:grid-cols-2 gap-4"
        >
          <InputTextOneLine
            label="Nro Ficha"
            name="norden"
            value={form.norden}
            onChange={handleChange}
            onKeyUp={handleSearch}
            labelWidth="120px"
          />
          <InputTextOneLine
            label="Fecha"
            name="fecha"
            type="date"
            value={form.fecha}
            onChange={handleChange}
            labelWidth="120px"
          />
          <InputTextOneLine
            label="Nombres"
            name="nombres"
            value={form.nombres}
            disabled
            labelWidth="120px"
          />
          <InputTextOneLine
            label="Edad"
            name="edad"
            value={form.edad}
            disabled
            labelWidth="120px"
            inputClassName="w-24"
          />
        </SectionFieldset>

        <SectionFieldset legend="Configuración">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.examenDirecto}
              onChange={(e) => handleExamenDirectoChange(e.target.checked)}
            />
            <span className="font-semibold">Examen Directo</span>
          </label>
        </SectionFieldset>

        <div className="text-center font-semibold text-lg mb-4">MUESTRA: ESPUTO</div>

        <SectionFieldset legend="Pruebas" className="space-y-4">
          <div className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-4 font-bold flex items-center">PRUEBA</div>
            <div className="col-span-2 font-bold flex items-center">RESULTADO</div>
            <div className="col-span-6 font-bold flex items-center">OPCIONES</div>

            {/* BK 1 */}
            <div className="col-span-4 flex items-center">
              Examen de BK - BACILOSCOPIA 1ª:
            </div>
            <div className="col-span-2">
              <InputTextOneLine
                name="bk1"
                value={form.bk1}
                onChange={handleChange}
                disabled={form.examenDirecto}
                inputClassName="w-full"
              />
            </div>
            <div className="col-span-6 flex flex-wrap gap-3">
              {bkOptions.map(opt => (
                <label key={opt} className="flex items-center gap-2 text-xs md:text-sm">
                  <input
                    type="checkbox"
                    checked={form.bk1Radio === opt}
                    disabled={form.examenDirecto}
                    onChange={() => handleBk1RadioChange(opt)}
                  />
                  {opt}
                </label>
              ))}
            </div>

            {/* BK 2 */}
            <div className="col-span-4 flex items-center">
              Examen de BK - BACILOSCOPIA 2ª:
            </div>
            <div className="col-span-2">
              <InputTextOneLine
                name="bk2"
                value={form.bk2}
                onChange={handleChange}
                disabled={form.examenDirecto}
                inputClassName="w-full"
              />
            </div>
            <div className="col-span-6 flex flex-wrap gap-3">
              {bkOptions.map(opt => (
                <label key={opt} className="flex items-center gap-2 text-xs md:text-sm">
                  <input
                    type="checkbox"
                    checked={form.bk2Radio === opt}
                    disabled={form.examenDirecto}
                    onChange={() => handleBk2RadioChange(opt)}
                  />
                  {opt}
                </label>
              ))}
            </div>

            {/* KOH */}
            <div className="col-span-4 flex items-center">KOH:</div>
            <div className="col-span-2">
              <InputTextOneLine
                name="koh"
                value={form.koh}
                onChange={handleChange}
                disabled={!form.examenDirecto}
                inputClassName="w-full"
              />
            </div>
            <div className="col-span-6 flex flex-wrap gap-3">
              {kohOptions.map(opt => (
                <label key={opt} className="flex items-center gap-2 text-xs md:text-sm">
                  <input
                    type="checkbox"
                    checked={form.kohRadio === opt}
                    disabled={!form.examenDirecto}
                    onChange={() => handleKohRadioChange(opt)}
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>
        </SectionFieldset>

        <SectionFieldset legend="Asignar Médico">
          <select
            disabled
            className="w-full border rounded px-3 py-2 bg-gray-100 text-sm"
            name="medico"
            value={form.medico}
            onChange={handleChange}
          >
            <option value="">-- Seleccionar --</option>
          </select>
        </SectionFieldset>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleSave}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faSave} /> Guardar/Actualizar
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-2 rounded flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faBroom} /> Limpiar
            </button>
          </div>

          <div className="flex flex-col items-end">
            <span className="font-bold italic mb-2">Imprimir</span>
            <div className="flex items-center gap-2">
              <InputTextOneLine
                name="norden"
                value={form.norden}
                onChange={handleChange}
                inputClassName="w-24"
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
}
