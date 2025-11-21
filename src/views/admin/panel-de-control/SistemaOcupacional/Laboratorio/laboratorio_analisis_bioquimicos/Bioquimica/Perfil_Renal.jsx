import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faBroom, faPrint } from '@fortawesome/free-solid-svg-icons';
import { useSessionData } from '../../../../../../hooks/useSessionData';
import { useForm } from '../../../../../../hooks/useForm';
import { getToday } from '../../../../../../utils/helpers';
import { PrintHojaR, SubmitDataService, VerifyTR } from './controllerPerfR';
import {
  InputTextOneLine,
} from '../../../../../../components/reusableComponents/ResusableComponents';
import SectionFieldset from '../../../../../../components/reusableComponents/SectionFieldset';

const tabla = 'l_bioquimica';

export default function PerfilRenal() {
  const { token, userlogued, selectedSede } = useSessionData();
  const today = getToday();

  const initialFormState = {
    norden: '',
    fecha: today,
    nombres: '',
    edad: '',
    muestra: 'SUERO',
    creatinina: '',
    urea: '',
    acidoUrico: '',
    printCount: '',
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
        creatinina: '',
        urea: '',
        acidoUrico: '',
        printCount: '',
        medico: ''
      }));
      VerifyTR(form.norden, tabla, token, setForm, selectedSede);
    }
  };

  const handlePrint = () => {
    handlePrintDefault(() => {
      PrintHojaR(form.norden, token);
    }, '¿Desea Imprimir Perfil Renal?', form.norden);
  };

  return (
    <div className="w-full max-w-[70vw] mx-auto bg-white rounded shadow p-6">
      <h2 className="text-2xl font-bold text-center mb-6">PERFIL RENAL</h2>
      
      <form className="space-y-6">
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

        <SectionFieldset legend="Muestra" className="space-y-4">
          <InputTextOneLine
            label="Muestra"
            name="muestra"
            value={form.muestra}
            disabled
            labelWidth="120px"
            inputClassName="w-32"
          />
        </SectionFieldset>

        <SectionFieldset legend="Resultados" className="space-y-4">
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <div className="font-bold text-center">PRUEBAS</div>
            <div className="font-bold text-center">RESULTADOS</div>

            <label className="font-semibold text-left">CREATININA SÉRICA</label>
            <InputTextOneLine
              name="creatinina"
              value={form.creatinina}
              onChange={handleChange}
            />

            <label className="font-semibold text-left">UREA SÉRICA</label>
            <InputTextOneLine
              name="urea"
              value={form.urea}
              onChange={handleChange}
            />

            <label className="font-semibold text-left">ÁCIDO ÚRICO SÉRICO</label>
            <InputTextOneLine
              name="acidoUrico"
              value={form.acidoUrico}
              onChange={handleChange}
            />
          </div>
        </SectionFieldset>

        <SectionFieldset legend="Asignación de Médico" className="space-y-4">
          <div className="flex items-center gap-2">
            <label className="font-semibold min-w-[120px]">ASIGNAR MÉDICO:</label>
            <select
              disabled
              className="border rounded px-2 py-1 min-w-[220px] bg-gray-100"
              name="medico"
              value={form.medico}
              onChange={handleChange}
            >
              <option value="">Seleccionar médico</option>
              <option value="medico1">Dr. Juan Pérez</option>
              <option value="medico2">Dra. Ana Torres</option>
              <option value="medico3">Dr. Luis Gómez</option>
            </select>
          </div>
        </SectionFieldset>

        <fieldset className="flex flex-col md:flex-row justify-between items-center gap-4 px-3">
          <div className="flex gap-3">
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
        </fieldset>
      </form>
    </div>
  );
}
