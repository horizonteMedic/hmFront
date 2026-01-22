import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faBroom, faPrint } from '@fortawesome/free-solid-svg-icons';
import { useSessionData } from '../../../../../../hooks/useSessionData';
import { useForm } from '../../../../../../hooks/useForm';
import { InputTextOneLine, InputsBooleanRadioGroup } from '../../../../../../components/reusableComponents/ResusableComponents';
import SectionFieldset from '../../../../../../components/reusableComponents/SectionFieldset';
import { PrintHojaR, SubmitDataService, VerifyTR } from './controllerPanel10D';
import { getToday } from '../../../../../../utils/helpers';
import EmpleadoComboBox from '../../../../../../components/reusableComponents/EmpleadoComboBox';

const Panel10D = () => {
  const { token, userlogued, selectedSede, userName } = useSessionData();
  const today = getToday();

  const initialFormState = {
    norden: '',
    fecha: today,
    nombres: '',
    edad: '',
    dni: '',
    antecedentes: [
      { label: 'CONSUME MARIHUANA (THC)', key: 'MARIHUANA', fecha: today, value: false },
      { label: 'CONSUME COCAINA (COC)', key: 'COCAINA', fecha: today, value: false },
      { label: 'CONSUMO HOJA DE COCA EN LOS 14 DIAS PREVIOS', key: 'COCA', fecha: today, value: false },
      { label: 'CONSUME ANFETAMINAS (AMP)', key: 'ANFETAMINAS', fecha: today, value: false },
      { label: 'CONSUME METHANFETAMINAS (MET)', key: 'METAN', fecha: today, value: false },
      { label: 'CONSUME BENZODIAZEPINAS (BZO)', key: 'BENZO', fecha: today, value: false },
      { label: 'CONSUME OPIÁCEOS (OPI)', key: 'OPIA', fecha: today, value: false },
      { label: 'CONSUME BARBITÚRICOS (BAR)', key: 'BARBI', fecha: today, value: false },
      { label: 'CONSUME METADONA (MTD)', key: 'METADONA', fecha: today, value: false },
      { label: 'CONSUME FENCICLIDINA (PCP)', key: 'FENCI', fecha: today, value: false },
      { label: 'CONSUME ANTIDEPRESIVOS TRICÍCLICOS (TCA)', key: 'ANTI', fecha: today, value: false },
    ],
    // Médico que Certifica //BUSCADOR
    nombre_medico: userName,
    user_medicoFirma: userlogued,
  };

  const { form, setForm, handleChange, handleChangeSimple, handleClear, handlePrintDefault } = useForm(initialFormState);

  const handleAntecedenteChange = (key, newValue) => {
    setForm(prev => ({
      ...prev,
      antecedentes: prev.antecedentes.map(item =>
        item.key === key
          ? { ...item, value: newValue }
          : item
      )
    }));
  };

  const handleFechaChange = (key, nuevaFecha) => {
    setForm(prev => ({
      ...prev,
      antecedentes: prev.antecedentes.map(item =>
        item.key === key
          ? { ...item, fecha: nuevaFecha }
          : item
      )
    }));
  };

  const handleset = () => {
    setForm(prev => ({
      ...prev,
      fecha: today,
      nombres: '',
      edad: '',
      dni: '',
      antecedentes: [
        { label: 'CONSUME MARIHUANA (THC)', key: 'MARIHUANA', fecha: today, value: false },
        { label: 'CONSUME COCAINA (COC)', key: 'COCAINA', fecha: today, value: false },
        { label: 'CONSUMO HOJA DE COCA EN LOS 14 DIAS PREVIOS', key: 'COCA', fecha: today, value: false },
        { label: 'CONSUME ANFETAMINAS (AMP)', key: 'ANFETAMINAS', fecha: today, value: false },
        { label: 'CONSUME METHANFETAMINAS (MET)', key: 'METAN', fecha: today, value: false },
        { label: 'CONSUME BENZODIAZEPINAS (BZO)', key: 'BENZO', fecha: today, value: false },
        { label: 'CONSUME OPIÁCEOS (OPI)', key: 'OPIA', fecha: today, value: false },
        { label: 'CONSUME BARBITÚRICOS (BAR)', key: 'BARBI', fecha: today, value: false },
        { label: 'CONSUME METADONA (MTD)', key: 'METADONA', fecha: today, value: false },
        { label: 'CONSUME FENCICLIDINA (PCP)', key: 'FENCI', fecha: today, value: false },
        { label: 'CONSUME ANTIDEPRESIVOS TRICÍCLICOS (TCA)', key: 'ANTI', fecha: today, value: false },
      ],
      // Médico que Certifica //BUSCADOR
      nombre_medico: userName,
      user_medicoFirma: userlogued,
    }));
  };

  const handlePrint = () => {
    handlePrintDefault(() => {
      PrintHojaR(form, token);
    }, '¿Desea Imprimir Consentimiento Panel 10D?', form.norden);
  };

  const handleSubmit = () => {
    SubmitDataService(form, token, userlogued, handleClear);
  };

  return (
    <div className="w-full max-w-[70vw] mx-auto bg-white rounded shadow p-6">
      <h2 className="text-2xl font-bold text-center mb-6">CONSENTIMIENTO INFORMADO PARA REALIZAR LA PRUEBA DE DROGAS<br />PANEL 10 D (AMP-BAR-BZO-COC-MET-MTP-PCP-THC-OPI-TCA)</h2>

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
                  VerifyTR(form.norden, token, setForm, selectedSede, form);
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
            <span>, de</span>
            <input
              name="edad"
              value={form.edad || ''}
              readOnly
              className="border-b border-gray-400 px-3 py-2 min-w-[50px] max-w-[80px] text-base bg-gray-100 cursor-not-allowed"
              style={{ width: `${Math.min(80, Math.max(50, (String(form.edad)?.length || 0) * 14))}px` }}
            />
            <span>años de edad, identificado con DNI N°</span>
            <input
              name="dni"
              value={form.dni || ''}
              readOnly
              className="border-b border-gray-400 px-3 py-2 min-w-[80px] max-w-[150px] text-base bg-gray-100 cursor-not-allowed"
              style={{ width: `${Math.min(120, Math.max(80, (String(form.dni)?.length || 0) * 10))}px` }}
            />
          </div>
          <div className="text-justify text-base">
            , habiendo recibido consejería e información acerca de la prueba para el panel de 10D drogas en orina; y en pleno uso de mis facultades mentales AUTORIZO se tome la muestra para el dosaje de dichas sustancias, así mismo me comprometo a regresar para recibir la consejería Post -Test y mis resultados.
          </div>
        </SectionFieldset>

        <SectionFieldset legend="ANTECEDENTES" className="space-y-4">
          {form.antecedentes.map(({ label, key, fecha, value }) => (
            <div key={key} className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <label className="text-base font-medium flex-1 whitespace-nowrap min-w-[300px]">{label}</label>
              <div className="flex items-center gap-4">
                <InputsBooleanRadioGroup
                  name={`antecedente_${key}`}
                  value={value}
                  onChange={(e, newValue) => handleAntecedenteChange(key, newValue)}
                  trueLabel="SI"
                  falseLabel="NO"
                  className="flex items-center"
                  groupClassName="gap-4"
                />
                {value === true && (
                  <InputTextOneLine
                    label="Fecha"
                    name={`fecha_${key}`}
                    type="date"
                    value={fecha}
                    onChange={e => handleFechaChange(key, e.target.value)}
                    labelWidth="80px"
                    className="w-48"
                  />
                )}
              </div>
            </div>
          ))}
        </SectionFieldset>
        <SectionFieldset legend="Asignación de Médico">
          <EmpleadoComboBox
            value={form.nombre_medico}
            label="Especialista"
            form={form}
            onChange={handleChangeSimple}
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

export default Panel10D;
