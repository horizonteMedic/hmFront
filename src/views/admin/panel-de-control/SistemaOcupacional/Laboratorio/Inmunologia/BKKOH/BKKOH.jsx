import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faBroom, faPrint } from '@fortawesome/free-solid-svg-icons';
import { useSessionData } from '../../../../../../hooks/useSessionData';
import { useForm } from '../../../../../../hooks/useForm';
import { getToday } from '../../../../../../utils/helpers';
import { PrintHojaR, SubmitDataService, VerifyTR } from './controllerBKKOH';
import {
  InputCheckbox,
  InputsRadioGroup,
  InputTextOneLine,
} from '../../../../../../components/reusableComponents/ResusableComponents';
import SectionFieldset from '../../../../../../components/reusableComponents/SectionFieldset';
import EmpleadoComboBox from '../../../../../../components/reusableComponents/EmpleadoComboBox';

const tabla = 'microbiologia';

export default function BKKOH() {
  const { token, userlogued, selectedSede, userName } = useSessionData();
  const today = getToday();

  const initialFormState = {
    norden: '',
    fecha: today,
    nombreExamen: "",

    dni: "",
    nombres: "",
    apellidos: "",
    fechaNacimiento: "",
    lugarNacimiento: "",
    edad: "",
    sexo: "",
    estadoCivil: "",
    nivelEstudios: "",

    // Datos Laborales
    empresa: "",
    contrata: "",
    ocupacion: "",
    cargoDesempenar: "",

    examenDirecto: false,
    bk1: '',
    bk1Radio: '',
    bk2: '',
    bk2Radio: '',
    koh: '',
    kohRadio: '',

    // Médico que Certifica //BUSCADOR
    nombre_medico: userName,
    user_medicoFirma: userlogued,
  };

  const {
    form,
    setForm,
    handleChange,
    handleClearnotO,
    handleRadioButton,
    handleChangeNumber,
    handleChangeSimple,
    handleClear,
    handlePrintDefault,
  } = useForm(initialFormState);

  const handleSave = () => {
    SubmitDataService(form, token, userlogued, handleClear, tabla);
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      handleClearnotO();
      VerifyTR(form.norden, tabla, token, setForm, selectedSede);
    }
  };

  const handlePrint = () => {
    handlePrintDefault(() => {
      PrintHojaR(form.norden, token, tabla);
    });
  };

  return (
    <form className="p-4 space-y-3">
      <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 xl:grid-cols-3 gap-3 lg:gap-4">
        <InputTextOneLine
          label="N° Orden"
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
          label="Nombre Examen"
          name="nombreExamen"
          value={form.nombreExamen}
          disabled
          labelWidth="120px"
        />
      </SectionFieldset>
      <SectionFieldset legend="Datos Personales" collapsible className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
        <InputTextOneLine
          label="Nombres"
          name="nombres"
          value={form.nombres}
          disabled
          labelWidth="120px"
        />
        <div className="grid lg:grid-cols-2 gap-3">
          <InputTextOneLine
            label="Edad (Años)"
            name="edad"
            value={form.edad}
            disabled
            labelWidth="120px"
          />
          <InputTextOneLine
            label="Sexo"
            name="sexo"
            value={form.sexo}
            disabled
            labelWidth="120px"
          />
        </div>
        <InputTextOneLine
          label="DNI"
          name="dni"
          value={form.dni}
          labelWidth="120px"
          disabled
        />
        <InputTextOneLine
          label="Fecha Nacimiento"
          name="fechaNacimiento"
          value={form.fechaNacimiento}
          disabled
          labelWidth="120px"
        />
        <InputTextOneLine
          label="Lugar Nacimiento"
          name="lugarNacimiento"
          value={form.lugarNacimiento}
          disabled
          labelWidth="120px"
        />
        <div className="grid lg:grid-cols-2 gap-3">
          <InputTextOneLine
            label="Estado Civil"
            name="estadoCivil"
            value={form.estadoCivil}
            disabled
            labelWidth="120px"
          />
          <InputTextOneLine
            label="Nivel Estudios"
            name="nivelEstudios"
            value={form.nivelEstudios}
            disabled
            labelWidth="120px"
          />
        </div>
      </SectionFieldset>
      <SectionFieldset legend="Datos Laborales" collapsible className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <InputTextOneLine
          label="Empresa"
          name="empresa"
          value={form.empresa}
          disabled
          labelWidth="120px"
        />
        <InputTextOneLine
          label="Contrata"
          name="contrata"
          value={form.contrata}
          disabled
          labelWidth="120px"
        />
        <InputTextOneLine
          label="Ocupación"
          name="ocupacion"
          value={form.ocupacion}
          disabled
          labelWidth="120px"
        />
        <InputTextOneLine
          label="Cargo Desempeñar"
          name="cargoDesempenar"
          value={form.cargoDesempenar}
          disabled
          labelWidth="120px"
        />
      </SectionFieldset>

      <SectionFieldset legend="Configuración">
        <InputCheckbox
          label="Examen Directo"
          checked={form.examenDirecto}
          name="examenDirecto"
          onChange={(e) => {
            const checked = e.target.checked;
            setForm(prev => {
              const newState = { ...prev, examenDirecto: checked };
              if (checked) {
                newState.bk1 = '';
                newState.bk2 = '';
              } else {
                newState.koh = '';
              }
              return newState;
            });
          }}
        />

      </SectionFieldset>

      <div className="text-center font-semibold text-lg my-4">MUESTRA: ESPUTO</div>
      <SectionFieldset legend="Pruebas" className="grid grid-cols-12 gap-2 items-center">
        <InputTextOneLine
          label='Examen de BK - BACILOSCOPIA 1ª'
          labelWidth='180px'
          name="bk1"
          value={form.bk1}
          onChange={handleChange}
          className="col-span-6"
          disabled={form.examenDirecto}
        />
        <InputsRadioGroup
          name="bk1"
          value={form.bk1}
          options={[
            { label: 'BAAR - NEGATIVO', value: 'BAAR - NEGATIVO' },
            { label: 'BAAR - POSITIVO', value: 'BAAR - POSITIVO' },
            { label: 'N/A', value: 'N/A' }
          ]}
          onChange={handleRadioButton}
          disabled={form.examenDirecto}
          className='col-span-6'
        />
        {/* BK 2 */}
        <InputTextOneLine
          label='Examen de BK - BACILOSCOPIA 2ª'
          labelWidth='180px'
          name="bk2"
          value={form.bk2}
          className="col-span-6"
          onChange={handleChange}
          disabled={form.examenDirecto}
        />
        <InputsRadioGroup
          name="bk2"
          value={form.bk2}
          options={[
            { label: 'BAAR - NEGATIVO', value: 'BAAR - NEGATIVO' },
            { label: 'BAAR - POSITIVO', value: 'BAAR - POSITIVO' },
            { label: 'N/A', value: 'N/A' }
          ]}
          onChange={handleRadioButton}
          disabled={form.examenDirecto}
          className='col-span-6'
        />

        {/* KOH */}
        <InputTextOneLine
          label='KOH'
          labelWidth='180px'
          className="col-span-6"
          name="koh"
          value={form.koh}
          onChange={handleChange}
          disabled={!form.examenDirecto}
        />
        <InputsRadioGroup
          name="koh"
          value={form.koh}
          options={[
            { label: 'NEGATIVO', value: 'NEGATIVO' },
            { label: 'POSITIVO', value: 'POSITIVO' },
            { label: 'N/A', value: 'N/A' }
          ]}
          onChange={handleRadioButton}
          disabled={!form.examenDirecto}
          className='col-span-6'
        />
      </SectionFieldset>

      <SectionFieldset legend="Especialista">
        <EmpleadoComboBox
          value={form.nombre_medico}
          form={form}
          label='Especialista que Certifica'
          onChange={handleChangeSimple}
        />
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
  );
}
