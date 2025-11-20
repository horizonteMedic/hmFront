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

const tabla = 'lgonadotropina';

export default function Gonadotropina() {
  const { token, userlogued, selectedSede } = useSessionData();
  const today = getToday();

  const initialFormState = {
    norden: '',
    fecha: today,
    nombres: '',
    edad: '',
    resultado: 'NEGATIVO',
    positivo: false,
    negativo: true,
    printCount: ''
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
      VerifyTR(form.norden, tabla, token, setForm, selectedSede);
    }
  };

  const handlePrint = () => {
    handlePrintDefault(() => {
      PrintHojaR(form.norden, token);
    }, '¿Desea Imprimir Gonadotropina?', form.norden);
  };

  const handleResultadoChange = (value) => {
    setForm(prev => ({
      ...prev,
      resultado: value,
      positivo: value === 'POSITIVO',
      negativo: value === 'NEGATIVO'
    }));
  };

  return (
    <div className="w-full max-w-[70vw] mx-auto bg-white rounded shadow p-6">
       <h2 className="text-2xl font-bold text-center mb-6">GONADOTROPINA CORIÓNICA HUMANA</h2>
      
      <form className="space-y-4">
        <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        <SectionFieldset legend="Resultado" className="space-y-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <label className="font-semibold min-w-[100px]">Resultado:</label>
            <InputTextOneLine
              name="resultado"
              value={form.resultado}
              onChange={handleChange}
              className="flex-1"
            />
            <div className="flex items-center gap-6">
              <InputsRadioGroup
                name="resultado_radio"
                value={form.resultado}
                onChange={(e, value) => handleResultadoChange(value)}
                options={[
                  { label: 'Positivo', value: 'POSITIVO' },
                  { label: 'Negativo', value: 'NEGATIVO' }
                ]}
                groupClassName="gap-6"
              />
            </div>
          </div>
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
        </fieldset>
      </form>
    </div>
  );
}
