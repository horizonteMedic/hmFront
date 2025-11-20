import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBroom, faPrint, faSave } from "@fortawesome/free-solid-svg-icons";
import {
  PrintHojaR,
  SubmitDataService,
  VerifyTR,
} from "./controllerConsentimientoMujerRayosX";
import { useForm } from "../../../../../hooks/useForm";
import { useSessionData } from "../../../../../hooks/useSessionData";

const tabla = "consentimiento_rayosx";
const date = new Date();
const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
  2,
  "0"
)}-${String(date.getDate()).padStart(2, "0")}`;

const initialFormState = {
  norden: "",
  fecha: today,
  nombres: "",
  edad: "",
  dni: "",
  empresa: "",
  contrata: "",
  ocupacion: "",
  textoFinalConsentimiento: `Declaro que he recibido explicaciones satisfactorias sobre el propósito, naturaleza y riesgos de la toma de RAYOS X, por lo cual doy de conocimiento y declaro que a la fecha no me encuentro en estado de gestación, ya que soy consciente de los eventuales riesgos que se pueden derivar de la realización de dicho examen en caso de encontrarme gestando. Por lo cual AUTORIZO a que se me realice la radiografía, indicada por el protocolo de la empresa contratante.`,
};

export default function ConsentimientoMujerRayosX() {
  const {
    form,
    setForm,
    handleChange,
    handleChangeNumber,
    handleRadioButton,
    handleCheckBoxChange,
    handleClear,
    handleClearnotO,
    handlePrintDefault,
  } = useForm(initialFormState);
  
  const { token, userlogued, selectedSede, datosFooter, userCompleto } =
    useSessionData();

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
    <div className="w-[90%] mx-auto text-[11px] my-12">
      {/* Título principal */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Consentimiento de Toma Radiográfica en Mujeres en Edad Fértil
        </h1>
        <p className="text-center text-gray-600 text-md">
          Sistema de Gestión de Consentimientos - HORIZONTE MEDIC
        </p>
      </div>

      <form
        onSubmit={(e) => e.preventDefault()}
        className="p-3 rounded w-full border mb-4 bg-white shadow-sm"
      >
        <div className="flex items-center gap-3">
          <label className="font-semibold text-[11px]">N° Orden:</label>
          <input
            className="border rounded px-2 py-1 w-[200px] "
            name="norden"
            value={form.norden || ""}
            onKeyUp={handleSearch}
            onChange={handleChangeNumber}
            placeholder="Ingrese N° Orden"
          />
        </div>
      </form>

      {/* Contenido del Consentimiento */}
      <div className="bg-white border rounded-lg p-6 shadow-sm">
        {/* Información Personal */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-4">
            <label className="font-semibold min-w-[30px]">Yo:</label>
            <input
              className="border rounded px-2 py-1 flex-1"
              name="nombres"
              value={form.nombres || ""}
              onChange={handleChange}
              disabled
              placeholder="Nombre completo"
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="font-semibold min-w-[30px]">de</label>
            <input
              className="border rounded px-2 py-1 w-48"
              name="edad"
              value={form.edad || ""}
              onChange={handleChange}
              disabled
              placeholder="Edad"
            />
            <label className="font-semibold min-w-[50px]"> años de edad,</label>
            <label className="font-semibold min-w-[80px]">
              identificado con DNI:
            </label>
            <input
              className="border rounded px-2 py-1 w-48"
              name="dni"
              value={form.dni || ""}
              onChange={handleChange}
              disabled
              placeholder="DNI"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="font-semibold min-w-[150px]">
              con ocupación laboral de:
            </label>
            <input
              className="border rounded px-2 py-1 flex-1"
              name="ocupacion"
              value={form.ocupacion || ""}
              onChange={handleChange}
              disabled
              placeholder="Ocupación laboral"
            />
          </div>
        </div>

        {/* Texto del Consentimiento */}
        <div className="space-y-4 mb-6">
          <div className="text-justify ">
            <div className="flex mb-3">
              <p className="mb-3 font-semibold min-w-[169px]">de la Empresa:</p>
              <input
                className="border rounded px-2 py-1 w-full"
                name="empresa"
                value={form.empresa || ""}
                onChange={handleChange}
                disabled
                placeholder="Empresa"
              />
            </div>

            <p className="text-justify leading-relaxed">
              {form.textoFinalConsentimiento}
            </p>
          </div>
        </div>

        {/* Fecha y Hora */}
        <div className="flex items-center gap-8 mb-6">
          <div className="flex items-center gap-4">
            <label className="font-semibold min-w-[60px]">Fecha:</label>
            <input
              type="date"
              className="border rounded px-2 py-1"
              name="fecha"
              value={form.fecha || ""}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-4 pt-2">
        <div className="flex gap-4">
          <button
            type="button"
            onClick={handleSave}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-base px-6 py-2 rounded flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faSave} />
            Grabar/Actualizar
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="bg-yellow-400 hover:bg-yellow-500 text-white text-base px-6 py-2 rounded flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faBroom} /> Limpiar
          </button>
        </div>
        <div className="flex flex-col items-end">
          <span className="font-bold italic text-base mb-1">Imprimir</span>
          <div className="flex items-center gap-2">
            <input
              name="norden"
              value={form.norden}
              onChange={handleChange}
              className="border rounded px-2 py-1 text-base w-24"
            />
            <button
              type="button"
              onClick={handlePrint}
              className="bg-blue-600 hover:bg-blue-700 text-white text-base px-4 py-2 rounded flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faPrint} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
