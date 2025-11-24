import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faBroom, faPrint } from '@fortawesome/free-solid-svg-icons';
import { useSessionData } from '../../../../../../hooks/useSessionData';
import { useForm } from '../../../../../../hooks/useForm';
import { InputTextOneLine, InputTextArea, InputCheckbox } from '../../../../../../components/reusableComponents/ResusableComponents';
import SectionFieldset from '../../../../../../components/reusableComponents/SectionFieldset';
import { PrintHojaR, SubmitDataService, VerifyTR } from './controllerBoro';
import { getToday } from '../../../../../../utils/helpers';

const Boro = () => {
  const { token, userlogued, selectedSede } = useSessionData();
  const today = getToday();

  const initialFormState = {
    norden: '',
    fecha: today,
    nombres: '',
    edad: '',
    dni: '',
    trabajador: true,
    postulante: false,
    empresa: '',
    enfermedad: { key: false, cual: '' },
    medicamento: { key: false, cual: '' },
    matecoca: { key: false, fecha: today },
    chaccha: { key: false, fecha: today },
    tratamiento: { key: false, cual: '', cuando: '', donde: '' },
    notas: '',
    medico: '',
  };

  const { form, setForm, handleChange, handleClear, handlePrintDefault } = useForm(initialFormState);

  const handlePreguntaChange = (field, key, value) => {
    setForm(prev => ({
      ...prev,
      [field]: { ...prev[field], [key]: value }
    }));
  };

  const handleset = () => {
    setForm(prev => ({
      ...prev,
      fecha: today,
      nombres: '',
      edad: '',
      dni: '',
      trabajador: true,
      postulante: false,
      empresa: '',
      enfermedad: { key: false, cual: '' },
      medicamento: { key: false, cual: '' },
      matecoca: { key: false, fecha: today },
      chaccha: { key: false, fecha: today },
      tratamiento: { key: false, cual: '', cuando: '', donde: '' },
      notas: '',
      medico: '',
    }));
  };

  const handlePrint = () => {
    handlePrintDefault(() => {
      PrintHojaR(form, token);
    }, '¿Desea Imprimir Consentimiento BORO?', form.norden);
  };

  const handleSubmit = () => {
    SubmitDataService(form, token, userlogued, handleClear);
  };

  return (
    <div className="w-full max-w-[70vw] mx-auto bg-white rounded shadow p-6">
      <h2 className="text-2xl font-bold text-center mb-6">CONSENTIMIENTO PARA REALIZAR LA PRUEBA DE DOSAJE DE MARIHUANA Y COCAÍNA</h2>
      
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
            <span>Yo</span>
            <input
              name="nombres"
              value={form.nombres || ''}
              readOnly
              className="border-b border-gray-400 px-3 py-2 min-w-[120px] max-w-[400px] text-base bg-gray-100 cursor-not-allowed"
              style={{ width: `${Math.min(400, Math.max(120, (form.nombres?.length || 0) * 10))}px` }}
            />
            <span>de</span>
            <input
              name="edad"
              value={form.edad || ''}
              readOnly
              className="border-b border-gray-400 px-3 py-2 min-w-[50px] max-w-[80px] text-base bg-gray-100 cursor-not-allowed"
              style={{ width: `${Math.min(80, Math.max(50, (String(form.edad)?.length || 0) * 14))}px` }}
            />
            <span>años de edad, con documento de identidad N°</span>
            <input
              name="dni"
              value={form.dni || ''}
              readOnly
              className="border-b border-gray-400 px-3 py-2 min-w-[80px] max-w-[120px] text-base bg-gray-100 cursor-not-allowed"
              style={{ width: `${Math.min(120, Math.max(80, (String(form.dni)?.length || 0) * 10))}px` }}
            />
          </div>
          <div className="flex flex-wrap items-center gap-3 text-base">
            <span>trabajador (</span>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="trabajador_postulante"
                checked={form.trabajador}
                onChange={() => setForm(prev => ({ ...prev, trabajador: true, postulante: false }))}
              />
              <span>Sí</span>
            </label>
            <span>) o postulante (</span>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="trabajador_postulante"
                checked={form.postulante}
                onChange={() => setForm(prev => ({ ...prev, trabajador: false, postulante: true }))}
              />
              <span>Sí</span>
            </label>
            <span>), de la empresa</span>
            <input
              name="empresa"
              value={form.empresa || ''}
              disabled
              className="border-b border-gray-400 px-2 py-1 min-w-[120px] max-w-[200px] bg-gray-100 text-base"
              style={{ width: `${Math.min(200, Math.max(120, (form.empresa?.length || 0) * 10))}px` }}
            />
          </div>
          <div className="text-justify text-base">
            autorizo al POLICLINICO HORIZONTE MEDIC, para que se me realice el examen toxicológico de drogas en orina y/o saliva, según los protocolos establecidos y que los resultados se entreguen directamente a la empresa.
          </div>
        </SectionFieldset>

        <SectionFieldset legend="Además, declaro que la información que brindaré a continuación es verdadera:" className="space-y-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <InputCheckbox
                name="enfermedad"
                checked={form.enfermedad.key}
                onChange={() => handlePreguntaChange('enfermedad', 'key', !form.enfermedad.key)}
                label="¿Sufre alguna enfermedad?"
              />
              {form.enfermedad.key && (
                <InputTextOneLine
                  label="¿Cuál?"
                  name="enfermedad_cual"
                  value={form.enfermedad.cual}
                  onChange={(e) => handlePreguntaChange('enfermedad', 'cual', e.target.value)}
                  labelWidth="80px"
                  className="flex-1"
                  disabled={!form.enfermedad.key}
                />
              )}
            </div>

            <div className="flex items-center gap-3">
              <InputCheckbox
                name="medicamento"
                checked={form.medicamento.key}
                onChange={() => handlePreguntaChange('medicamento', 'key', !form.medicamento.key)}
                label="¿Consume regularmente algún medicamento?"
              />
              {form.medicamento.key && (
                <InputTextOneLine
                  label="¿Cuál?"
                  name="medicamento_cual"
                  value={form.medicamento.cual}
                  onChange={(e) => handlePreguntaChange('medicamento', 'cual', e.target.value)}
                  labelWidth="80px"
                  className="flex-1"
                  disabled={!form.medicamento.key}
                />
              )}
            </div>

            <div className="flex items-center gap-3">
              <InputCheckbox
                name="matecoca"
                checked={form.matecoca.key}
                onChange={() => handlePreguntaChange('matecoca', 'key', !form.matecoca.key)}
                label="¿Consume regularmente mate de coca?"
              />
              {form.matecoca.key && (
                <InputTextOneLine
                  label="Especifique la fecha:"
                  name="matecoca_fecha"
                  type="date"
                  value={form.matecoca.fecha}
                  onChange={(e) => handlePreguntaChange('matecoca', 'fecha', e.target.value)}
                  labelWidth="150px"
                  className="w-48"
                />
              )}
            </div>

            <div className="flex items-center gap-3">
              <InputCheckbox
                name="chaccha"
                checked={form.chaccha.key}
                onChange={() => handlePreguntaChange('chaccha', 'key', !form.chaccha.key)}
                label="¿Chaccha o mastica hoja de coca?"
              />
              {form.chaccha.key && (
                <InputTextOneLine
                  label="Especifique la fecha:"
                  name="chaccha_fecha"
                  type="date"
                  value={form.chaccha.fecha}
                  onChange={(e) => handlePreguntaChange('chaccha', 'fecha', e.target.value)}
                  labelWidth="150px"
                  className="w-48"
                />
              )}
            </div>

            <div className="flex items-center gap-3">
              <InputCheckbox
                name="tratamiento"
                checked={form.tratamiento.key}
                onChange={() => handlePreguntaChange('tratamiento', 'key', !form.tratamiento.key)}
                label="¿En las últimas 48 horas, se realizó algún tratamiento quirúrgico o dental?"
              />
            </div>
            {form.tratamiento.key && (
              <div className="ml-8 space-y-3">
                <InputTextOneLine
                  label="Especifique cuál:"
                  name="tratamiento_cual"
                  value={form.tratamiento.cual}
                  onChange={(e) => handlePreguntaChange('tratamiento', 'cual', e.target.value)}
                  labelWidth="150px"
                  className="flex-1"
                />
                <div className="flex flex-col md:flex-row gap-4">
                  <InputTextOneLine
                    label="Especifique cuándo:"
                    name="tratamiento_cuando"
                    value={form.tratamiento.cuando}
                    onChange={(e) => handlePreguntaChange('tratamiento', 'cuando', e.target.value)}
                    labelWidth="150px"
                    className="flex-1"
                  />
                  <InputTextOneLine
                    label="Especifique dónde:"
                    name="tratamiento_donde"
                    value={form.tratamiento.donde}
                    onChange={(e) => handlePreguntaChange('tratamiento', 'donde', e.target.value)}
                    labelWidth="150px"
                    className="flex-1"
                  />
                </div>
              </div>
            )}
          </div>
        </SectionFieldset>

        <SectionFieldset legend="Notas" className="space-y-4">
          <InputTextArea
            label="Notas"
            name="notas"
            value={form.notas}
            onChange={handleChange}
            rows={4}
          />
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

export default Boro;
