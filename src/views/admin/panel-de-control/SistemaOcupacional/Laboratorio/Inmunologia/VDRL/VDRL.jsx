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

const tabla = 'inmunologia';

export default function VDRL() {
  const { token, userlogued, selectedSede } = useSessionData();
  const today = getToday();

  const initialFormState = {
    norden: '',
    fecha: today,
    nombres: '',
    edad: '',
    muestra: 'SUERO',
    examen: 'VDRL',
    metodo: 'Aglutinación de lípidos complejos',
    resultado: 'NO REACTIVO',
    medico: ''
  };

  const {
    form,
    setForm,
    handleChange,
    handleClear,
    handlePrintDefault,
  } = useForm(initialFormState);

  const handleSave = () => {
    SubmitDataService(form, token, userlogued, handleClear);
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      setForm(prev => ({
        ...prev,
        fecha: today,
        nombres: '',
        edad: '',
        muestra: 'SUERO',
        examen: 'VDRL',
        metodo: 'Aglutinación de lípidos complejos',
        resultado: 'NO REACTIVO',
        medico: ''
      }));
      VerifyTR(form.norden, tabla, token, setForm, selectedSede);
    }
  };

  const handlePrint = () => {
    handlePrintDefault(() => {
      PrintHojaR(form.norden, token);
    }, '¿Desea Imprimir VDRL?', form.norden);
  };

  const handleResultadoChange = (value) => {
    setForm(prev => ({ ...prev, resultado: value }));
  };

  return (
    <div className="w-full max-w-[70vw] mx-auto bg-white rounded shadow p-6">
      <h2 className="text-2xl font-bold mb-6 text-center underline">INMUNOLOGÍA</h2>
      
      <form className="space-y-6">
        <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
            inputClassName="w-20"
          />
        </SectionFieldset>

        <SectionFieldset legend="Datos del Examen" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <InputTextOneLine
              label="MUESTRA"
              name="muestra"
              value={form.muestra}
              disabled
              labelWidth="120px"
              inputClassName="w-32"
            />
            <InputTextOneLine
              label="EXAMEN SOLICITADO"
              name="examen"
              value={form.examen}
              disabled
              labelWidth="150px"
              inputClassName="w-32"
            />
          </div>
        </SectionFieldset>

        <SectionFieldset legend="Resultados" className="space-y-4">
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <div className="font-bold text-lg">EXAMEN</div>
            <div className="font-bold text-lg">RESULTADO</div>
            
            <div className="text-base">
              {form.examen} (Método: {form.metodo})
            </div>
            <div className="flex items-center gap-4">
              <InputsRadioGroup
                name="resultado"
                value={form.resultado}
                onChange={(e, value) => handleResultadoChange(value)}
                options={[
                  { label: 'REACTIVO', value: 'REACTIVO' },
                  { label: 'NO REACTIVO', value: 'NO REACTIVO' }
                ]}
                groupClassName="gap-6"
              />
              <InputTextOneLine
                name="resultado"
                value={form.resultado}
                onChange={handleChange}
                inputClassName="w-40"
              />
            </div>
          </div>
        </SectionFieldset>

        <SectionFieldset legend="Médico" className="space-y-4">
          <InputTextOneLine
            label="Médico"
            name="medico"
            value={form.medico}
            onChange={handleChange}
            labelWidth="120px"
            className="w-64"
          />
        </SectionFieldset>

        <fieldset className="flex flex-col md:flex-row justify-between items-center gap-4 px-3">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleSave}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faSave} /> Guardar
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
                inputClassName="w-28"
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
        </fieldset>
      </form>
    </div>
  );
}
