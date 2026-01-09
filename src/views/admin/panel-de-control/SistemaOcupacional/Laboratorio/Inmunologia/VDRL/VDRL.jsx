import { useSessionData } from '../../../../../../hooks/useSessionData';
import { useForm } from '../../../../../../hooks/useForm';
import { getToday } from '../../../../../../utils/helpers';
import { PrintHojaR, SubmitDataService, VerifyTR } from './controllerVDRL';
import {
  InputTextOneLine,
  InputsRadioGroup,
} from '../../../../../../components/reusableComponents/ResusableComponents';
import SectionFieldset from '../../../../../../components/reusableComponents/SectionFieldset';
import DatosPersonalesLaborales from '../../../../../../components/templates/DatosPersonalesLaborales';
import EmpleadoComboBox from '../../../../../../components/reusableComponents/EmpleadoComboBox';
import BotonesAccion from '../../../../../../components/templates/BotonesAccion';

const tabla = 'inmunologia_vdrl';

export default function VDRL() {
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

    muestra: 'SUERO',
    examen: 'VDRL',
    metodo: 'AGLUTINACIÓN DE LÍPIDOS COMPLEJOS',
    resultado: 'NO REACTIVO',

    // Médico que Certifica //BUSCADOR
    nombre_medico: userName,
    user_medicoFirma: userlogued,
  };

  const {
    form,
    setForm,
    handleChange,
    handleChangeNumberDecimals,
    handleRadioButton,
    handleChangeSimple,
    handleClearnotO,
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
    <div className="space-y-3 px-4 max-w-[90%] xl:max-w-[80%] mx-auto">
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

      <DatosPersonalesLaborales form={form} />

      <SectionFieldset legend="Muestra" className="grid xl:grid-cols-3 gap-x-4 gap-y-3">
        <InputTextOneLine
          label="Muestra"
          name="muestra"
          value={form.muestra}
          onChange={handleChange}
          labelWidth="120px"
        />
        <InputTextOneLine
          label="Examen Solicitado"
          name="examen"
          value={form.examen}
          disabled
          labelWidth="120px"
        />
        <InputTextOneLine
          label="Método"
          name="metodo"
          value={form.metodo}
          disabled
          labelWidth="120px"
        />
      </SectionFieldset>

      <SectionFieldset legend="Resultado" className="flex gap-4">
        <InputTextOneLine
          label='VDRL'
          name="resultado"
          value={form.resultado}
          onChange={handleChange}
          className='w-full max-w-[80%]'
          labelWidth='120px'
        />
        <InputsRadioGroup
          name="resultado"
          value={form.resultado}
          onChange={handleRadioButton}
          options={[
            { label: 'Reactivo', value: 'REACTIVO' },
            { label: 'No Reactivo', value: 'NO REACTIVO' },
          ]}
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
