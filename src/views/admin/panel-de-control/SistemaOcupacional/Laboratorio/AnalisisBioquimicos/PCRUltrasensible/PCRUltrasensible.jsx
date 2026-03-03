import EmpleadoComboBox from "../../../../../../components/reusableComponents/EmpleadoComboBox";
import InputCheckbox from "../../../../../../components/reusableComponents/InputCheckbox";
import InputTextOneLine from "../../../../../../components/reusableComponents/InputTextOneLine";
import SectionFieldset from "../../../../../../components/reusableComponents/SectionFieldset";
import BotonesAccion from "../../../../../../components/templates/BotonesAccion";
import DatosPersonalesLaborales from "../../../../../../components/templates/DatosPersonalesLaborales";
import { useForm } from "../../../../../../hooks/useForm";
import { useSessionData } from "../../../../../../hooks/useSessionData";
import { getToday } from '../../../../../../utils/helpers';
import { PrintHojaR, SubmitDataService, VerifyTR } from "./controllerPCRUltrasensible";
const tabla = 'pcr_ultrasensible';

export default function PCRUltrasensible() {
  const { token, userlogued, selectedSede, userName } = useSessionData();
  const today = getToday();

  const initialFormState = {
    norden: '',
    fecha: today,

    tipoExamen: "",

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

    muestra: "",
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
    handleFocusNext,
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
          name="tipoExamen"
          value={form.tipoExamen}
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
            </SectionFieldset>
            <SectionFieldset legend="Resultados" className="grid grid-cols-1 gap-4">

              <div className="flex items-center gap-4">
                <InputTextOneLine
                  label="PRC ULTRASENSIBLE (MÉTODO INMUNOTURBIDIMÉTRICO)"
                  name="resultado"
                  value={form.resultado}
                  labelWidth="400px" // Aumentamos esto porque el texto es mucho más largo que "Glucosa Basal"
                  onChange={(e) => handleChangeNumberDecimals(e, 1)}
                  onKeyUp={handleFocusNext}
                  className="flex-1" // Usamos flex-1 para que el input ocupe todo el espacio disponible
                />
                <span className="text-gray-500 text-[11px] font-medium whitespace-nowrap">
                  {"(Valor Normal < 7.5 mg/l)"}
                </span>
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
