import { useSessionData } from '../../../../../../hooks/useSessionData';
import { useForm } from '../../../../../../hooks/useForm';
import { getToday } from '../../../../../../utils/helpers';
import { PrintHojaR, SubmitDataService, VerifyTR } from './controllerPanel3D';
import {
  InputTextOneLine,
  InputsRadioGroup,
} from '../../../../../../components/reusableComponents/ResusableComponents';
import SectionFieldset from '../../../../../../components/reusableComponents/SectionFieldset';
import EmpleadoComboBox from '../../../../../../components/reusableComponents/EmpleadoComboBox';
import BotonesAccion from '../../../../../../components/templates/BotonesAccion';

const tabla = 'panel3d';

export default function Resultado_Panel3D() {
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

    valueM: 'NEGATIVO',
    valueC: 'NEGATIVO',
    valueE: 'NEGATIVO',
    metodo: 'INMUNOCROMATOGRAFICO',

    // Médico que Certifica //BUSCADOR
    nombre_medico: userName,
    user_medicoFirma: userlogued,

    nombre_doctorAsignado: "",
    user_doctorAsignado: "",
  };

  const {
    form,
    setForm,
    handleChange,
    handleChangeNumberDecimals,
    handleChangeSimple,
    handleRadioButton,
    handleFocusNext,
    handleClearnotO,
    handleClear,
    handlePrintDefault,
  } = useForm(initialFormState);

  const handleSave = () => {
    SubmitDataService(form, token, userlogued, handleClear);
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
    <div className="space-y-3 px-4 max-w-[90%] xl:max-w-[80%] mx-auto">
      {/* Información del Examen */}
      <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <InputTextOneLine
          label="N° Orden"
          name="norden"
          value={form.norden}
          onChange={handleChangeNumberDecimals}
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
          label="Nombre del Examen"
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
        <div className="grid lg:grid-cols-2 gap-3">
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
        </div>
        <InputTextOneLine
          label="Lugar Nacimiento"
          name="lugarNacimiento"
          value={form.lugarNacimiento}
          disabled
          labelWidth="120px"
        />
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

      {/* Resultados */}
      <SectionFieldset legend="Resultados" className='grid gap-y-3'>
        <InputTextOneLine
          label='Prueba Rápida Cualitativa'
          name="metodo"
          value={form.metodo}
          onChange={handleChange}
          labelWidth='120px'
        />
        <div className="grid  gap-x-4 gap-y-3">

          <div className="flex gap-4">
            <InputTextOneLine
              label='Marihuana (THC)'
              name="valueM"
              value={form.valueM}
              onChange={handleChange}
              labelWidth='120px'
              className='w-full max-w-[85%]'
            />
            <InputsRadioGroup
              name="valueM"
              value={form.valueM}
              onChange={handleRadioButton}
              options={[
                { label: 'Positivo', value: 'POSITIVO' },
                { label: 'Negativo', value: 'NEGATIVO' }
              ]}
            />
          </div>

          <div className="flex gap-4">
            <InputTextOneLine
              label='Cocaína (COC)'
              name="valueC"
              value={form.valueC}
              onChange={handleChange}
              labelWidth='120px'
              className='w-full max-w-[85%]'
            />
            <InputsRadioGroup
              name="valueC"
              value={form.valueC}
              onChange={handleRadioButton}
              options={[
                { label: 'Positivo', value: 'POSITIVO' },
                { label: 'Negativo', value: 'NEGATIVO' }
              ]}
            />
          </div>

          <div className="flex gap-4">
            <InputTextOneLine
              label='Éxtasis (MDMA)'
              name="valueE"
              value={form.valueE}
              onChange={handleChange}
              labelWidth='120px'
              className='w-full max-w-[85%]'
            />
            <InputsRadioGroup
              name="valueE"
              value={form.valueE}
              onChange={handleRadioButton}
              options={[
                { label: 'Positivo', value: 'POSITIVO' },
                { label: 'Negativo', value: 'NEGATIVO' }
              ]}
            />
          </div>
        </div>
      </SectionFieldset>

      <SectionFieldset legend="Asignación de Médico" className="space-y-4">
        <EmpleadoComboBox
          value={form.nombre_medico}
          label="Especialista"
          form={form}
          onChange={handleChangeSimple}
        />
        <EmpleadoComboBox
          value={form.nombre_doctorAsignado}
          label="Doctor Asignado"
          form={form}
          onChange={handleChangeSimple}
          nameField="nombre_doctorAsignado"
          idField="user_doctorAsignado"
        />
      </SectionFieldset>

      {/* Acciones */}
      <BotonesAccion
        form={form}
        handleSave={handleSave}
        handleClear={handleClear}
        handlePrint={handlePrint}
        handleChangeNumberDecimals={handleChangeNumberDecimals}
      />
    </div>
  );
}