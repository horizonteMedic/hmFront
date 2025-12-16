import { InputTextOneLine } from "../../../../../components/reusableComponents/ResusableComponents";
import SectionFieldset from "../../../../../components/reusableComponents/SectionFieldset";
import { useForm } from "../../../../../hooks/useForm";
import { useSessionData } from "../../../../../hooks/useSessionData";
import { getToday } from "../../../../../utils/helpers";
import {
  PrintHojaR,
  SubmitDataService,
  VerifyTR,
} from "./controllerRecepcionExamenMedico";
import BotonesAccion from "../../../../../components/templates/BotonesAccion";

const tabla = "";

const textoFinalConsentimiento = `En mi calidad de trabajador de Confipetrol Andina, declaro bajo juramento que he sido informado de las razones para los exámenes de salud ocupacional así como de los riesgos para la seguridad y salud en mi puesto de trabajo, además declaro haber recibido oportunamente los resultados de mi examen médico, de manera confidencial, conforme a lo establecido en el artículo 71° literal b) de la Ley N° 29783, Ley de Seguridad y Salud en el Trabajo¹. Teniendo conocimiento de mis resultados, me comprometo a cumplir con las recomendaciones de carácter médico, indicadas por el médico tratante y/o médico ocupacional, así como ingresar al programa de vigilancia médica según lo establecido en el RM 312-2011-MINSA².`;
const textoFinalConsentimiento2 = `En ese sentido, manifiesto que tengo conocimiento que al no cumplir con las recomendaciones médicas indicadas cualquier dolencia o malestar que presente queda bajo mi responsabilidad.`;

export default function RecepcionExamenMedico() {
  const today = getToday();
  const { token, selectedSede, userlogued, datosFooter, hora } = useSessionData();

  const initialFormState = {
    norden: "",
    fecha: today,
    nombres: "",
    dni: "",
    domicilio: "",
    distrito: "",
    provincia: "",
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
  } = useForm(initialFormState, { storageKey: "RecepcionExamenMedico" });


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
            label="Con Domicilio en"
            name="domicilio"
            value={form.domicilio}
            disabled
            labelWidth="140px"
          />
          <div className="grid xl:grid-cols-2 gap-x-4 gap-y-3">
            <InputTextOneLine
              label="Distrito de"
              name="distrito"
              value={form.distrito}
              disabled
              labelWidth="140px"
            />
            <InputTextOneLine
              label="Provincia y Departamento de"
              name="provincia"
              value={form.provincia}
              disabled
              labelWidth="170px"
            />
          </div>
        </div>

        {/* Texto del Consentimiento */}
        <div className="space-y-4">
          <div className="text-justify leading-relaxed">

            <p className="text-justify">
              {textoFinalConsentimiento}
            </p>
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
