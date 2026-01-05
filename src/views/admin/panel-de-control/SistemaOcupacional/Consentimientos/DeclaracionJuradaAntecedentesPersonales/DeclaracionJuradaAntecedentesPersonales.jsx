import { InputsBooleanRadioGroup, InputTextArea, InputTextOneLine } from "../../../../../components/reusableComponents/ResusableComponents";
import SectionFieldset from "../../../../../components/reusableComponents/SectionFieldset";
import { useForm } from "../../../../../hooks/useForm";
import { useSessionData } from "../../../../../hooks/useSessionData";
import { getToday } from "../../../../../utils/helpers";
import {
  PrintHojaR,
  SubmitDataService,
  VerifyTR,
} from "./controllerDeclaracionJuradaAntecedentesPersonales";
import BotonesAccion from "../../../../../components/templates/BotonesAccion";

const tabla = "DECLA_JURA_ANTECE_PERSON_FAM";

const textoFinalConsentimiento = "(De marcar SI, detallar que antecedentes existen, considerar los antecedentes de la madre, padre, abuelo y abuela)";
const textoFinalConsentimiento2 = "Se suscribe la presente declaración jurada en conformidad de lo antes expuesto.";

export default function DeclaracionJuradaAntecedentesPersonales() {
  const today = getToday();
  const { token, selectedSede, userlogued, datosFooter, hora } = useSessionData();

  const initialFormState = {
    norden: "",
    fecha: today,
    idConsentimiento: null,
    nombres: "",
    dni: "",
    empresa: "",
    ocupacion: "",
    existenAntecedentes: false,
    detalleAntecedentes: "",
  };

  const {
    form,
    setForm,
    handleChange,
    handleChangeSimple,
    handleRadioButtonBoolean,
    handleChangeNumberDecimals,
    handleClear,
    handleClearnotO,
    handlePrintDefault,
  } = useForm(initialFormState, { storageKey: "DeclaracionJuradaAntecedentesPersonales" });

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      handleClearnotO();
      VerifyTR(form.norden, tabla, token, setForm, selectedSede);
    }
  };

  const handleSave = () => {
    SubmitDataService(form, token, userlogued, handleClear, tabla, datosFooter);
  };

  const handlePrint = () => {
    handlePrintDefault(() => {
      PrintHojaR(form.norden, token, tabla, datosFooter);
    });
  };

  return (
    <div className="space-y-3 px-4 max-w-[90%] xl:max-w-[80%] mx-auto">
      <SectionFieldset legend="Información del Examen" className="grid xl:grid-cols-3 gap-x-4 gap-y-3">
        <InputTextOneLine
          label="N° Orden"
          name="norden"
          value={form.norden}
          onKeyUp={handleSearch}
          onChange={handleChangeNumberDecimals}
        />
        <InputTextOneLine
          label="Fecha"
          type="date"
          name="fecha"
          value={form.fecha}
          onChange={handleChangeSimple}
        />
        <InputTextOneLine
          label="Hora"
          name="hora"
          value={hora}
          disabled
        />
      </SectionFieldset>

      {/* Contenido del Consentimiento */}
      <SectionFieldset legend="Declaración Jurada de Antecedentes Personales" className="space-y-3">
        {/* Información Personal */}
        <div className="space-y-3">
          <InputTextOneLine
            label="Yo"
            name="nombres"
            value={form.nombres}
            onChange={handleChange}
            disabled
            labelWidth="30px"
          />
          <InputTextOneLine
            label="Identificado con DNI"
            name="dni"
            value={form.dni}
            disabled
            labelWidth="140px"
          />
          <InputTextOneLine
            label="Con ocupación laboral de"
            name="ocupacion"
            value={form.ocupacion}
            onChange={handleChange}
            disabled
            labelWidth="140px"
          />
        </div>

        {/* Texto del Consentimiento */}
        <div className="space-y-4">
          <div className="text-justify space-y-3">
            <InputTextOneLine
              label="Para la Empresa"
              name="empresa"
              value={form.empresa}
              disabled
              labelWidth="140px"
            />
            <InputsBooleanRadioGroup
              label="Declaro bajo juramento: Existen antecedentes personales y familiares"
              name="existenAntecedentes"
              value={form.existenAntecedentes}
              onChange={(e, value) => {
                handleRadioButtonBoolean(e, value);
                setForm((prev) => ({
                  ...prev,
                  detalleAntecedentes: ""
                }));
              }}
              labelOnTop
            />
            <p className=" text-gray-500">
              {textoFinalConsentimiento}
            </p>
            <InputTextArea
              label="Detalle de Antecedentes"
              name="detalleAntecedentes"
              value={form.detalleAntecedentes}
              onChange={handleChange}
              disabled={!form.existenAntecedentes}
              rows={8}
            />
            <p className="text-justify">
              {textoFinalConsentimiento2}
            </p>
          </div>
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
