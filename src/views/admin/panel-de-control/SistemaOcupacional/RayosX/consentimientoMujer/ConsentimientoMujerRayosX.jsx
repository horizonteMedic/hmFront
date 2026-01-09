import {
  PrintHojaR,
  SubmitDataService,
  VerifyTR,
} from "./controllerConsentimientoMujerRayosX";
import { useForm } from "../../../../../hooks/useForm";
import { useSessionData } from "../../../../../hooks/useSessionData";
import { getToday } from "../../../../../utils/helpers";
import BotonesAccion from "../../../../../components/templates/BotonesAccion";
import { InputTextOneLine, SectionFieldset } from "../../../../../components/reusableComponents/ResusableComponents";

const tabla = "consentimiento_rayosx";

const textoFinalConsentimiento = `Declaro que he recibido explicaciones satisfactorias sobre el propósito, naturaleza y riesgos de la toma de RAYOS X, por lo cual doy de conocimiento y declaro que a la fecha no me encuentro en estado de gestación, ya que soy consciente de los eventuales riesgos que se pueden derivar de la realización de dicho examen en caso de encontrarme gestando. Por lo cual AUTORIZO a que se me realice la radiografía, indicada por el protocolo de la empresa contratante.`;

export default function ConsentimientoMujerRayosX() {
  const today = getToday();
  const { token, userlogued, selectedSede, datosFooter, userName } = useSessionData();

  const initialFormState = {
    norden: "",
    fecha: today,
    nombres: "",
    edad: "",
    dni: "",
    empresa: "",
    contrata: "",
    ocupacion: "",
    // Médico que Certifica //BUSCADOR
    nombre_medico: userName,
    user_medicoFirma: userlogued,
  };

  const {
    form,
    setForm,
    handleChangeSimple,
    handleChange,
    handleChangeNumberDecimals,
    handleClear,
    handleClearnotO,
    handlePrintDefault,
  } = useForm(initialFormState);

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
      <SectionFieldset legend="Información del Examen" className="grid xl:grid-cols-2 gap-x-4 gap-y-3">
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
      </SectionFieldset>
      {/* Contenido del Consentimiento */}
      <SectionFieldset legend="Consentimiento de Toma Radiográfica en Mujeres en Edad Fértil" className="space-y-3">
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
          <div className="flex items-center flex-wrap">
            <InputTextOneLine
              label="de"
              name="edad"
              value={form.edad}
              disabled
              labelWidth="30px"
              className="mr-4"
            />
            <label className="font-semibold min-w-[50px]">años de edad,</label>
            <InputTextOneLine
              label="identificado con DNI"
              name="dni"
              value={form.dni}
              disabled
              labelWidth="110px"
            />
          </div>
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
                label="Empresa"
                name="empresa"
                value={form.empresa}
                disabled
                labelWidth="140px"
              />
            </div>
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
