import {
  InputTextOneLine,
  InputTextArea,
  InputsBooleanRadioGroup,
} from "../../../../../../components/reusableComponents/ResusableComponents";
import SectionFieldset from "../../../../../../components/reusableComponents/SectionFieldset";
import { useSessionData } from "../../../../../../hooks/useSessionData";
import { getToday } from "../../../../../../utils/helpers";
import { useForm } from "../../../../../../hooks/useForm";
import { PrintHojaR, SubmitDataService, VerifyTR } from "./controllerBrigadista";
import { BotonesAccion, DatosPersonalesLaborales } from "../../../../../../components/templates/Templates";

const tabla = "";

export default function Brigadista() {
  const today = getToday();
  const { token, userlogued, selectedSede, datosFooter } = useSessionData();

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

    afrontamientoTomaDecisiones: "",
    estiloDeConflicto: "",
    afrontamientoSituacionesRiesgo: "",
    nivelAnsiedad: "",

    // Análisis FODA
    fortalezasOportunidades: "",
    amenazasDebilidades: "",

    // Observaciones y Recomendaciones
    observaciones: "",
    recomendaciones: "",
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
  } = useForm(initialFormState, { storageKey: "informeConductores" });

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
      <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 lg:grid-cols-4 gap-3">
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
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-4">
            <InputTextOneLine
              label="1.- Afrontamiento para la Toma de Decisiones"
              name="afrontamientoTomaDecisiones"
              value={form?.afrontamientoTomaDecisiones}
              onChange={handleChange}
              labelWidth="120px"
            />
            <InputTextOneLine
              label="2.- Estilo de Conflicto"
              name="estiloDeConflicto"
              value={form?.estiloDeConflicto}
              onChange={handleChange}
              labelWidth="120px"
            />
            <InputTextOneLine
              label="3.- Afrontamiento a Situaciones de Riesgo"
              name="afrontamientoSituacionesRiesgo"
              value={form?.afrontamientoSituacionesRiesgo}
              onChange={handleChange}
              labelWidth="120px"
            />
            <InputTextOneLine
              label="4.- Nivel de Ansiedad"
              name="nivelAnsiedad"
              value={form?.nivelAnsiedad}
              onChange={handleChange}
              labelWidth="120px"
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