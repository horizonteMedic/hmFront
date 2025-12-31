import {
  InputTextOneLine,
  InputTextArea,
  InputsBooleanRadioGroup,
} from "../../../../../../components/reusableComponents/ResusableComponents";
import SectionFieldset from "../../../../../../components/reusableComponents/SectionFieldset";
import { useSessionData } from "../../../../../../hooks/useSessionData";
import { getToday } from "../../../../../../utils/helpers";
import { useForm } from "../../../../../../hooks/useForm";
import { PrintHojaR, SubmitDataService, VerifyTR } from "./controllerCuestionarioBerlin";
import { BotonesAccion, DatosPersonalesLaborales } from "../../../../../../components/templates/Templates";
import EmpleadoComboBox from "../../../../../../components/reusableComponents/EmpleadoComboBox";

const tabla = "cuestionario_berlin";

export default function CuestionarioBerlin() {
  const today = getToday();
  const { token, userlogued, selectedSede, datosFooter, userName } = useSessionData();

  const initialFormState = {
    // Header - Información del examen
    norden: "",
    fecha: today,
    nombreExamen: "",
    esApto: undefined,

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

    criterioApneaObstructivaSueno: "",
    criterioFatigaSomnolencia: "",
    criterioHipertensionArterial: "",

    // Análisis FODA
    fortalezasOportunidades: "",
    amenazasDebilidades: "",

    // Observaciones y Recomendaciones
    observaciones: "",
    recomendaciones: "",

    // Médico que Certifica //BUSCADOR
    nombre_medico: userName,
    user_medicoFirma: userlogued,
  };

  const {
    form,
    setForm,
    handleChange,
    handleChangeNumberDecimals,
    handleChangeSimple,
    handleRadioButtonBoolean,
    handleClear,
    handleClearnotO,
    handlePrintDefault,
  } = useForm(initialFormState, { storageKey: "cuestionario_berlin" });

  const handleSave = () => {
    SubmitDataService(form, token, userlogued, handleClear, tabla, datosFooter);
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      handleClearnotO();
      VerifyTR(form.norden, tabla, token, setForm, selectedSede);
    }
  };

  const handlePrint = () => {
    handlePrintDefault(() => {
      PrintHojaR(form.norden, token, tabla, datosFooter);
    });
  };

  return (
    <div className="space-y-3 px-4 max-w-[90%] xl:max-w-[80%] mx-auto">
      <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 2xl:grid-cols-4 gap-3">
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
        <InputsBooleanRadioGroup
          label="Aptitud"
          name="esApto"
          value={form.esApto}
          trueLabel="APTO"
          falseLabel="NO APTO"
          onChange={handleRadioButtonBoolean}
        />
      </SectionFieldset>

      <DatosPersonalesLaborales form={form} />

      <SectionFieldset legend="Criterios Psicológicos">
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <InputTextOneLine
              label="1.- Apnea Obstructiva del Sueño"
              name="criterioApneaObstructivaSueno"
              value={form?.criterioApneaObstructivaSueno}
              onChange={handleChange}
              labelWidth="200px"
            />
            <InputTextOneLine
              label="2.- Fatiga y Somnolencia"
              name="criterioFatigaSomnolencia"
              value={form?.criterioFatigaSomnolencia}
              onChange={handleChange}
              labelWidth="200px"
            />
            <InputTextOneLine
              label="3.- Hipertensión Arterial"
              name="criterioHipertensionArterial"
              value={form?.criterioHipertensionArterial}
              onChange={handleChange}
              labelWidth="200px"
            />
          </div>
        </div>
      </SectionFieldset>
      <SectionFieldset legend="Análisis FODA">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputTextArea
            label="Fortalezas / Oportunidades"
            name="fortalezasOportunidades"
            value={form?.fortalezasOportunidades}
            onChange={handleChange}
            rows={4}
          />
          <InputTextArea
            label="Amenazas / Debilidades"
            name="amenazasDebilidades"
            value={form?.amenazasDebilidades}
            onChange={handleChange}
            rows={4}
          />
        </div>
      </SectionFieldset>

      <SectionFieldset legend="Observaciones y Recomendaciones">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputTextArea
            label="Observaciones"
            name="observaciones"
            value={form?.observaciones}
            onChange={handleChange}
            rows={4}
          />
          <InputTextArea
            label="Recomendaciones"
            name="recomendaciones"
            value={form?.recomendaciones}
            onChange={handleChange}
            rows={4}
          />
        </div>
      </SectionFieldset>

      <SectionFieldset legend="Asignación de Médico">
        <EmpleadoComboBox
          value={form.nombre_medico}
          label="Especialista"
          form={form}
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