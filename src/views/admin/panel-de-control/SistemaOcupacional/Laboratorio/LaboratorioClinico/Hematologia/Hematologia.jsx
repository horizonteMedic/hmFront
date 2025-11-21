import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faBroom, faPrint } from '@fortawesome/free-solid-svg-icons';
import { PrintHojaR, SubmitDataService, VerifyTR } from './Controller';
import { useSessionData } from '../../../../../../hooks/useSessionData';
import { useForm } from '../../../../../../hooks/useForm';
import { getToday } from '../../../../../../utils/helpers';
import {
  InputTextOneLine,
} from '../../../../../../components/reusableComponents/ResusableComponents';
import SectionFieldset from '../../../../../../components/reusableComponents/SectionFieldset';

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
    });
  };

  return (
    <div className="w-full max-w-[70vw] mx-auto bg-white rounded shadow p-6">
      <h2 className="text-2xl font-bold text-center mb-4">HEMATOLOGÍA</h2>

      <SectionFieldset legend="Información del Examen" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputTextOneLine
            label="Nro Ficha"
            name="norden"
            value={form.norden}
            onChange={handleChange}
            onKeyUp={handleSearch}
            labelWidth="120px"
            inputClassName="text-xl font-bold"
          />
          <InputTextOneLine
            label="Fecha"
            name="fecha"
            type="date"
            value={form.fecha}
            onChange={handleChange}
            labelWidth="120px"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputTextOneLine
            label="Paciente"
            name="paciente"
            value={form.paciente}
            onChange={handleChange}
            disabled
            labelWidth="120px"
          />
          <InputTextOneLine
            label="Edad"
            name="edad"
            value={form.edad}
            onChange={handleChange}
            disabled
            labelWidth="120px"
            inputClassName="w-20"
          />
        </div>
      </SectionFieldset>

      <div className="font-semibold text-center bg-gray-100 p-3 rounded">
        MUESTRA: SANGRE TOTAL C/ EDTA
      </div>

      <SectionFieldset legend="Resultados" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="font-semibold mb-3 text-lg">PRUEBAS</h3>
            <div className="space-y-3">
              {PRUEBAS.map(({ key, label }) => (
                <div key={key} className="flex items-center gap-4">
                  <label className="font-medium min-w-[200px] text-[10px]">{label}:</label>
                  <input
                    type="text"
                    name={key}
                    value={form[key]}
                    onChange={handleChange}
                    className="border rounded px-2 py-1 w-32"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold mb-3 text-lg">RECUENTO DIFERENCIAL</h3>
            <div className="space-y-3">
              {DIFERENCIAL.map(({ key, label }) => (
                <div key={key} className="flex items-center gap-4">
                  <label className="font-medium min-w-[200px] text-[10px]">{label}:</label>
                  <input
                    type="text"
                    name={key}
                    value={form[key]}
                    onChange={handleChange}
                    className="border rounded px-2 py-1 w-32"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
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
