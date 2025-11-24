import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faBroom, faPrint } from '@fortawesome/free-solid-svg-icons';
import { PrintHojaR, SubmitDataService, VerifyTR } from './ControllerHematologia';
import { useSessionData } from '../../../../../../hooks/useSessionData';
import { useForm } from '../../../../../../hooks/useForm';
import { getToday } from '../../../../../../utils/helpers';
import {
  InputTextOneLine,
  SectionFieldset
} from '../../../../../../components/reusableComponents/ResusableComponents';

const PRUEBAS = [
  { key: 'hemoglobina', label: 'Hemoglobina' },
  { key: 'hematocrito', label: 'Hematocrito' },
  { key: 'hematies', label: 'Hematíes' },
  { key: 'volumen_corpuscular_medio', label: 'Volumen Corpuscular medio' },
  { key: 'hemoglobina_corpuscular_media', label: 'Hemoglobina Corpuscular media' },
  { key: 'concentracion_hemoglobina_corpuscular', label: 'Concentración de Hemoglobina Corp' },
  { key: 'leucocitos', label: 'Leucocitos' },
  { key: 'plaquetas', label: 'Plaquetas' }
];

const DIFERENCIAL = [
  { key: 'neutrofilos', label: 'Neutrófilos (%)' },
  { key: 'abastonados', label: 'Abastonados (%)' },
  { key: 'segmentados', label: 'Segmentados (%)' },
  { key: 'monocitos', label: 'Monocitos (%)' },
  { key: 'eosinofilos', label: 'Eosinófilos (%)' },
  { key: 'basofilos', label: 'Basófilos (%)' },
  { key: 'linfocitos', label: 'Linfocitos (%)' }
];

const tabla = 'hemograma_autom';

export default function Hematologia() {
  const { token, userlogued, selectedSede } = useSessionData();
  const today = getToday();

  const initialFormState = {
    norden: '',
    fecha: today,
    paciente: '',
    edad: '',
    medico: '',
    // Pruebas
    hemoglobina: '',
    hematocrito: '',
    hematies: '',
    volumen_corpuscular_medio: '',
    hemoglobina_corpuscular_media: '',
    concentracion_hemoglobina_corpuscular: '',
    leucocitos: '',
    plaquetas: '',
    // Diferencial
    neutrofilos: '',
    abastonados: '',
    segmentados: '',
    monocitos: '',
    eosinofilos: '',
    basofilos: '',
    linfocitos: ''
  };

  const {
    form,
    setForm,
    handleChange,
    handleChangeNumber,
    handleChangeSimple,
    handleFocusNext,
    handleClear,
    handlePrintDefault,
  } = useForm(initialFormState);

  const handleSave = () => {
    SubmitDataService(form, token, userlogued, handleClear, tabla);
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      VerifyTR(form.norden, tabla, token, setForm, selectedSede);
    }
  };

  const handlePrint = () => {
    handlePrintDefault(() => {
      PrintHojaR(form.norden, token, tabla);
    });
  };

  return (
    <div className="p-4 space-y-3">
      <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
        <InputTextOneLine
          label="Nro Ficha"
          name="norden"
          value={form.norden}
          onChange={handleChangeNumber}
          onKeyUp={handleSearch}
          labelWidth="120px"
        />
        <InputTextOneLine
          label="Fecha"
          name="fecha"
          type="date"
          value={form.fecha}
          onChange={handleChangeSimple}
          labelWidth="120px"
        />
        <InputTextOneLine
          label="Paciente"
          name="paciente"
          value={form.paciente}
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

      <div className="font-semibold text-center bg-gray-100 p-3 rounded">
        MUESTRA: SANGRE TOTAL C/ EDTA
      </div>

      <SectionFieldset legend="Resultados" className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SectionFieldset legend="Pruebas" className="space-y-3">
          {PRUEBAS.map(({ key, label }) => (
            <InputTextOneLine
              label={label}
              key={key}
              name={key}
              value={form[key]}
              onChange={handleChange}
              onKeyUp={handleFocusNext}
              labelWidth='200px'
            />
          ))}
        </SectionFieldset>
        <SectionFieldset legend="Recuento Diferencial" className="space-y-3">
          {DIFERENCIAL.map(({ key, label }) => (
            <InputTextOneLine
              label={label}
              key={key}
              name={key}
              value={form[key]}
              onChange={handleChange}
              onKeyUp={handleFocusNext}
              labelWidth='200px'
            />
          ))}
        </SectionFieldset>
      </SectionFieldset>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4 border-t">
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faSave} /> Guardar/Actualizar
          </button>
          <button
            onClick={handleClear}
            className="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-2 rounded flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faBroom} /> Limpiar
          </button>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="font-bold italic">Imprimir</span>
          <div className="flex items-center gap-2">
            <InputTextOneLine
              name="norden"
              value={form.norden}
              onChange={handleChange}
              inputClassName="w-28"
            />
            <button
              onClick={handlePrint}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faPrint} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
