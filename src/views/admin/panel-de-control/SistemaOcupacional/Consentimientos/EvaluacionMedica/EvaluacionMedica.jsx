import { InputTextOneLine } from "../../../../../components/reusableComponents/ResusableComponents";
import SectionFieldset from "../../../../../components/reusableComponents/SectionFieldset";
import { useForm } from "../../../../../hooks/useForm";
import { useSessionData } from "../../../../../hooks/useSessionData";
import { getToday } from "../../../../../utils/helpers";
import {
  PrintHojaR,
  SubmitDataService,
  VerifyTR,
} from "./controllerEvaluacionMedica";
import BotonesAccion from "../../../../../components/templates/BotonesAccion";

const tabla = "";

const textoFinalConsentimiento = `De acuerdo con lo dispuesto en la Ley 29733 (Ley de Protección de Datos Personales), declaro haber tomado conocimiento que los exámenes médicos efectuados por el Centro Médico Evaluador y la información contenida en los mismos, a fin de evaluar mi condición médica para postular a un puesto de trabajo en el campamento minero es registrada por la Compañía Minera y/o la Compañía Aseguradora que tenga a su cargo la cobertura del Seguro Complementario de Trabajo de Riesgo o la que esta designe para los efectos de control de dicho seguro. En ese sentido, mediante la suscripción del presente documento, otorgo consentimiento expreso e inequívoco para que la Compañía Minera efectúe el tratamiento de los datos personales facilitados y los transfiera a la Compañía Aseguradora a fin de la evaluación y otorgamiento de la Cobertura del Seguro Complementario de Trabajo de Riesgo, pudiendo esta última informar a la Compañía Minera, Contratistas o Corredor de Seguros de ambos el estado de la cobertura del Seguro Complementario de Trabajo de Riesgo. Esta declaración autoriza al Centro Médico Evaluador la transferencia al empleador y/o Compañía Aseguradora de la información de la historia clínica y exámenes médicos confidenciales de conformidad con la Ley 26842 (Ley General de Salud), y de la Ley 29783 (Ley de Seguridad y Salud en el Trabajo) y su Reglamento aprobado por Decreto Supremo 005-2012-TR.`;

export default function EvaluacionMedica() {
  const today = getToday();
  const { token, selectedSede, userlogued, datosFooter, hora } = useSessionData();

  const initialFormState = {
    norden: "",
    fecha: today,
    nombres: "",
    dni: "",
    empresa: "",
    ocupacion: "",
  };

  const {
    form,
    setForm,
    handleChange,
    handleChangeSimple,
    handleChangeNumberDecimals,
    handleClear,
    handleClearnotO,
    handlePrintDefault,
  } = useForm(initialFormState, { storageKey: "evaluacionMedica" });


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
      <SectionFieldset legend="Consentimiento Evaluación Médica" className="space-y-3">
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
          <div className="text-justify leading-relaxed">
            <div className="mb-3">
              <InputTextOneLine
                label="Para la Empresa"
                name="empresa"
                value={form.empresa}
                disabled
                labelWidth="140px"
              />
            </div>
            <p className="font-semibold">
              Certifico haber sido informado que:
            </p>
            <p className="text-justify">
              {textoFinalConsentimiento}
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
