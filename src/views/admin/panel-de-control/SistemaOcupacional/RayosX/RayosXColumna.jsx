import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faPrint, faBroom } from "@fortawesome/free-solid-svg-icons";
import {
  PrintHojaR,
  SubmitDataService,
  VerifyTR,
} from "./controllerRayosXColumna";
import { useSessionData } from "../../../../hooks/useSessionData";
import { useForm } from "../../../../hooks/useForm";

const tabla = "radiografia";
const date = new Date();
const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
  2,
  "0"
)}-${String(date.getDate()).padStart(2, "0")}`;

const initialFormState = {
  norden: "",
  fechaExam: today,
  nombres: "",
  dni: "",
  edad: "",
  tipoRadiografia: "DORSOLUMBAR",
  informe:
    "CUERPOS VERTEBRALES MUESTRAN MORFOLOGÍA NORMAL.\n" +
    "SACRO NO MUESTRA LESIONES EVIDENTES.\n" +
    "ESPACIOS INTERVERTEBRALES CONSERVADOS.\n" +
    "DENSIDAD ÓSEA ADECUADA.\n" +
    "LORDOSIS LUMBAR NORMAL.\n" +
    "CANAL RAQUÍDEO CON AMPLITUD NORMAL.",
  conclusion:
    "CUERPOS VERTEBRALES DORSOLUMBARES EVALUADOS SIN ALTERACIONES SIGNIFICATIVAS.",
};

export default function RayosXColumna() {
  const {
    form,
    setForm,
    handleChange,
    handleChangeNumber,
    handleRadioButton, 
    handleCheckBoxChange,
    handleClear,
    handleClearnotO,
    handlePrintDefault
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
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[95%] md:max-w-[80%]">
        <div className="flex flex-col gap-6">
          <div className="w-full">
            {/* Header con título y botón imprimir */}
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-gray-800">
                Radiografía Columna
              </h1>
              <div className="flex flex-col items-end">
                <span className="font-bold italic text-base mb-1">
                  IMPRIMIR
                </span>
                <div className="flex items-center gap-2">
                  <input
                    name="norden"
                    value={form.norden}
                    onChange={handleChangeNumber}
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
            {/* Sección Aptitud */}
            <div className="border rounded p-4  mb-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-3 w-full">
                <div className="flex items-center gap-4">
                  <label className="font-semibold min-w-[65px]">
                    N° Orden :
                  </label>
                  <input
                    className="border rounded px-2 py-1 w-full"
                    name="norden"
                    value={form.norden || ""}
                    onKeyUp={handleSearch}
                    onChange={handleChangeNumber}
                  />
                </div>
                <div className="flex items-center gap-4">
                  <label className="font-semibold min-w-[65px]">
                    Fecha Ex :
                  </label>
                  <input
                    type="date"
                    className="border rounded px-2 py-1 w-full"
                    name="fechaExam"
                    value={form.fechaExam || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <label className="font-semibold min-w-[65px]">Nombres :</label>
                <input
                  className="border rounded px-2 py-1 w-full"
                  name="nombres"
                  value={form.nombres || ""}
                  disabled
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-3 w-full">
                <div className="flex items-center gap-4">
                  <label className="font-semibold min-w-[65px]">DNI :</label>
                  <input
                    className="border rounded px-2 py-1 w-full"
                    name="dni"
                    value={form.dni || ""}
                    disabled
                  />
                </div>
                <div className="flex items-center gap-4">
                  <label className="font-semibold min-w-[65px]">Edad :</label>
                  <input
                    className="border rounded px-2 py-1 w-full"
                    name="edad"
                    value={form.edad || ""}
                    disabled
                  />
                </div>
              </div>
            </div>
            {/* Sección Radiografía de Columna */}
            <div className="border rounded p-4 bg-white mb-4 space-y-3">
              <div className="font-bold mb-2">RADIOGRAFÍA DE COLUMNA</div>
              <div className="flex gap-6 mb-2">
                <label className="flex gap-2 font-semibold">
                  <input
                    type="radio"
                    name="tipoRadiografia"
                    checked={form.tipoRadiografia === "LUMBAR"}
                    onChange={(e) => {
                      handleRadioButton(e, "LUMBAR");
                      setForm((prev) => ({
                        ...prev,
                        conclusion:
                          "RADIOGRAFÍA DE COLUMNA LUMBAR AP-L SIN ALTERACIONES SIGNIFICATIVAS.",
                      }));
                    }}
                  />
                  Lumbar
                </label>
                <label className="flex gap-2 font-semibold">
                  <input
                    type="radio"
                    name="tipoRadiografia"
                    checked={form.tipoRadiografia === "LUMBOSACRA AP-L"}
                    onChange={(e) => {
                      handleRadioButton(e, "LUMBOSACRA AP-L");
                      setForm((prev) => ({
                        ...prev,
                        conclusion:
                          "RADIOGRAFÍA DE COLUMNA LUMBOSACRA AP-L SIN ALTERACIONES SIGNIFICATIVAS.",
                      }));
                    }}
                  />
                  Lumbosacro
                </label>
                <label className="flex gap-2 font-semibold">
                  <input
                    type="radio"
                    name="tipoRadiografia"
                    checked={form.tipoRadiografia === "DORSOLUMBAR"}
                    onChange={(e) => {
                      handleRadioButton(e, "DORSOLUMBAR");
                      setForm((prev) => ({
                        ...prev,
                        conclusion:
                          "CUERPOS VERTEBRALES DORSOLUMBARES EVALUADOS SIN ALTERACIONES SIGNIFICATIVAS.",
                      }));
                    }}
                  />
                  Dorsolumbar
                </label>
              </div>
              <div className="flex items-start flex-col">
                <label className="font-semibold">Informe :</label>
                <p className="text-[#233245]">
                  El estudio Radiografico representado en incidencia frontal y
                  lateral muestra:
                </p>
                <textarea
                  className="border rounded px-2 py-1 w-full resize-none mt-1"
                  name="informe"
                  rows={6}
                  value={form.informe || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-start gap-1 flex-col">
                <label className="font-semibold ">Conclusión :</label>
                <textarea
                  className="border rounded px-2 py-1 w-full resize-none"
                  name="conclusion"
                  rows={4}
                  value={form.conclusion || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4  px-4 pt-2">
              <div className=" flex gap-4">
                <button
                  type="button"
                  onClick={handleSave}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-base px-6 py-2 rounded flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faSave} /> Guardar/Actualizar
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="bg-yellow-400 hover:bg-yellow-500 text-white text-base px-6 py-2 rounded flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faBroom} /> Limpiar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
