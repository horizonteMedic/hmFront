import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faBroom, faPrint } from '@fortawesome/free-solid-svg-icons';
import { useSessionData } from '../../../../../../hooks/useSessionData';
import { useForm } from '../../../../../../hooks/useForm';
import { getToday } from '../../../../../../utils/helpers';
import { PrintHojaR, SubmitDataService, VerifyTR } from './controller';
import {
  InputTextOneLine,
  InputsRadioGroup,
} from '../../../../../../components/reusableComponents/ResusableComponents';
import SectionFieldset from '../../../../../../components/reusableComponents/SectionFieldset';

const tabla = 'lhepatitis';

export default function Hepatitis() {
  const { token, userlogued, selectedSede, datosFooter } = useSessionData();
  const today = getToday();

  const initialFormState = {
    norden: '',
    fecha: today,
    nombres: '',
    edad: '',
    hav: true,
    hbsag: false,
    marca: 'RAPID TEST - MONTEST',
    resultadoHAV: '',
    resultadoHAVRadio: '',
    resultadoHBsAg: '',
    resultadoHBsAgRadio: '',
    medico: ''
  };

  const {
    form,
    setForm,
    handleChange,
    handleClear,
    handleClearnotO,
    handlePrintDefault,
    handleRadioButton,
  } = useForm(initialFormState);

  const handleSave = () => {
    SubmitDataService(form, token, userlogued, handleClear, tabla, datosFooter);
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      handleClearnotO();
      setForm((prev) => ({
        ...prev,
        fecha: today,
        nombres: '',
        edad: '',
        hav: true,
        hbsag: false,
        marca: 'RAPID TEST - MONTEST',
        resultadoHAV: '',
        resultadoHAVRadio: '',
        resultadoHBsAg: '',
        resultadoHBsAgRadio: '',
      }));
      VerifyTR(form.norden, tabla, token, setForm, selectedSede);
    }
  };

  const handlePrint = () => {
    handlePrintDefault(() => {
      PrintHojaR(form.norden, token, tabla, datosFooter);
    });
  };

  const handleHavChange = (checked) => {
    setForm(prev => ({
      ...prev,
      hav: checked,
      hbsag: checked ? false : prev.hbsag,
      resultadoHBsAg: checked ? '' : prev.resultadoHBsAg,
      resultadoHBsAgRadio: checked ? '' : prev.resultadoHBsAgRadio
    }));
  };

  const handleHbsagChange = (checked) => {
    setForm(prev => ({
      ...prev,
      hbsag: checked,
      hav: checked ? false : prev.hav,
      resultadoHAV: checked ? '' : prev.resultadoHAV,
      resultadoHAVRadio: checked ? '' : prev.resultadoHAVRadio
    }));
  };

  const handleResultadoHAVRadio = (e, value) => {
    handleRadioButton(e, value);
    setForm(prev => ({
      ...prev,
      resultadoHAV: value,
      resultadoHAVRadio: value
    }));
  };

  const handleResultadoHBsAgRadio = (e, value) => {
    handleRadioButton(e, value);
    setForm(prev => ({
      ...prev,
      resultadoHBsAg: value,
      resultadoHBsAgRadio: value
    }));
  };

  return (
    <div className="w-full max-w-[70vw] mx-auto bg-white rounded shadow p-6">
      <h2 className="text-2xl font-bold text-center mb-6">HEPATITIS</h2>
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

        <SectionFieldset legend="Tipo de Prueba">
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={form.hav}
                onChange={(e) => handleHavChange(e.target.checked)}
              />
              <span className="font-semibold">HEPATITIS A (HAV)</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={form.hbsag}
                onChange={(e) => handleHbsagChange(e.target.checked)}
              />
              <span className="font-semibold">HEPATITIS B (HBsAg)</span>
            </label>
          </div>
        </SectionFieldset>

        <SectionFieldset legend="Marca">
          <InputTextOneLine
            label="Marca"
            name="marca"
            value={form.marca}
            onChange={handleChange}
            labelWidth="120px"
          />
        </SectionFieldset>

        <SectionFieldset legend="Resultados" className="space-y-4">
          <div className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-4 font-bold flex items-center">PRUEBAS</div>
            <div className="col-span-3 font-bold flex items-center">RESULTADOS</div>
            <div className="col-span-5 font-bold flex items-center">OPCIONES</div>

            {/* HAV */}
            <div className="col-span-4 flex items-center">HEPATITIS A (HAV) - RAPID TEST</div>
            <div className="col-span-3">
              <InputTextOneLine
                name="resultadoHAV"
                value={form.resultadoHAV}
                onChange={handleChange}
                disabled={!form.hav}
                inputClassName="w-full"
              />
            </div>
            <div className="col-span-5">
              <InputsRadioGroup
                name="resultadoHAVRadio"
                value={form.resultadoHAVRadio}
                onChange={handleResultadoHAVRadio}
                options={[
                  { label: 'Positivo', value: 'POSITIVO' },
                  { label: 'Negativo', value: 'NEGATIVO' }
                ]}
                disabled={!form.hav}
                groupClassName="gap-4"
              />
            </div>

            {/* HBsAg */}
            <div className="col-span-4 flex items-center">HEPATITIS B (HBsAg) - RAPID TEST</div>
            <div className="col-span-3">
              <InputTextOneLine
                name="resultadoHBsAg"
                value={form.resultadoHBsAg}
                onChange={handleChange}
                disabled={!form.hbsag}
                inputClassName="w-full"
              />
            </div>
            <div className="col-span-5">
              <InputsRadioGroup
                name="resultadoHBsAgRadio"
                value={form.resultadoHBsAgRadio}
                onChange={handleResultadoHBsAgRadio}
                options={[
                  { label: 'Positivo', value: 'POSITIVO' },
                  { label: 'Negativo', value: 'NEGATIVO' }
                ]}
                disabled={!form.hbsag}
                groupClassName="gap-4"
              />
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
