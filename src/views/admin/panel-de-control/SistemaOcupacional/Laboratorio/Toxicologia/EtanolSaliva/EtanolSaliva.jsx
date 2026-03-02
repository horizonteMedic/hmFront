import EmpleadoComboBox from "../../../../../../components/reusableComponents/EmpleadoComboBox";
import InputCheckbox from "../../../../../../components/reusableComponents/InputCheckbox";
import InputsRadioGroup from "../../../../../../components/reusableComponents/InputsRadioGroup";
import InputTextOneLine from "../../../../../../components/reusableComponents/InputTextOneLine";
import SectionFieldset from "../../../../../../components/reusableComponents/SectionFieldset";
import BotonesAccion from "../../../../../../components/templates/BotonesAccion";
import DatosPersonalesLaborales from "../../../../../../components/templates/DatosPersonalesLaborales";
import { useForm } from "../../../../../../hooks/useForm";
import { useSessionData } from "../../../../../../hooks/useSessionData";
import { getToday} from '../../../../../../utils/helpers';
const tabla = 'etanol_saliva';

export default function EtanolSaliva() {
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

    resultado: "",

    muestra: 'SALIVA',
    examenDirecto: false,

    pruebaRapida: "",

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
    handleRadioButton,
    handleFocusNext,
    handleChangeSimple,
    handleClearnotO,
    handleClear,
    handlePrintDefault,
  } = useForm(initialFormState);

  const handleSave = () => {
    // SubmitDataService(form, token, userlogued, handleClear, tabla);
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      handleClearnotO();
    //   VerifyTR(form.norden, tabla, token, setForm, selectedSede);
    }
  };

  const handlePrint = () => {
    handlePrintDefault(() => {
    //   PrintHojaR(form.norden, token, tabla);
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
            <SectionFieldset legend="Muestra" className="grid gap-3">
                <InputTextOneLine
                    label='Muestra'
                    name="muestra"
                    value={form.muestra}
                    labelWidth='120px'
                    onChange={handleChange}
                />
                <InputCheckbox
                    label="Examen Completo"
                    checked={form.examenDirecto}
                    name="examenDirecto"
                    onChange={(e) => {
                        const checked = e.target.checked;
                        setForm(prev => {
                            const newState = { ...prev, examenDirecto: checked };
                            if (!checked) {
                                newState.colesterolTotal = '';
                                newState.ldl = '';
                                newState.hdl = '';
                                newState.vldl = '';
                                newState.trigliceridos = '';
                            }
                            return newState;
                        });
                    }}
                />
            </SectionFieldset>
<SectionFieldset legend="Resultado" className="w-full">
  <div className="flex items-center gap-4 w-full">
    
    {/* 1. Label de la prueba y el input (Cajita) */}
    <div className="flex-grow">
      <InputTextOneLine
        label="PCR ULTRASENSIBLE (MÉTODO INMUNOTURBIDIMÉTRICO)"
        name="resultado"
        value={form.resultado}
        labelWidth="400px" // Espacio suficiente para el nombre largo de la prueba
        onChange={handleChangeSimple}
        onKeyUp={handleFocusNext}
        className="w-full"
      />
    </div>

    {/* 2. Botones de Radio justo al lado */}
    <div className="flex-none whitespace-nowrap">
      <InputsRadioGroup
        name="resultado"
        value={form.resultado}
        onChange={handleRadioButton}
        options={[
          { label: 'Positivo', value: 'POSITIVO' },
          { label: 'Negativo', value: 'NEGATIVO' }
        ]}
      />
    </div>

  </div>
</SectionFieldset>
            <SectionFieldset legend="Asignación de Médico">
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
