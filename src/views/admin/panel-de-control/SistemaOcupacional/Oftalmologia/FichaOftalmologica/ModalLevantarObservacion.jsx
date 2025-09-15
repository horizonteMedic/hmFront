import {
  SubmitDataService,
  VerifyTR,
} from "./controllerModalLevantarObservacion";

import {
  faSave,
  faBroom,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "./FichaOftalmologica";

const tabla = "oftalmologia_lo";
export default function ModalLevantarObservacion({
  onClose,
  form,
  setForm,
  initialFormState,
  token,
  userlogued,
  selectedSede,
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value.toUpperCase() }));
  };
  const handleChangeNumber = (e) => {
    const { name, value } = e.target;
    if (/^[\d/]*$/.test(value)) {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };
  const handleCheckBoxChange = (e) => {
    const { name, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: checked,
    }));
  };
  const handleNextFocus = (e, name) => {
    if (e.key == "Enter") document.getElementsByName(name)[0]?.focus();
  };

  const handleClear = () => {
    setForm(initialFormState);
  };
  const handleClearnotO = () => {
    setForm((prev) => ({ ...initialFormState, norden: prev.norden }));
  };

  const handleSave = () => {
    SubmitDataService(form, token, userlogued, handleClear, tabla, onClose);
  };

  return (
    <div className="fixed inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 min-w-[850px] relative max-w-lg w-full">
        <button
          onClick={() => {
            onClose();
            handleClear();
          }}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-4xl"
        >
          &times;
        </button>
        <h2 className="text-lg font-bold mb-2">Levantar Observación</h2>
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4 items-center mb-2 w-full ">
            <div>
              <label className="font-semibold">N° Orden :</label>
              <input
                name="norden"
                value={form.norden}
                onChange={handleChange}
                onKeyUp={(e) => {
                  if (e.key === "Enter") {
                    handleClearnotO();
                    VerifyTR(form.norden, tabla, token, setForm, selectedSede);
                  }
                }}
                className="border rounded px-2 py-1 w-full"
              />
            </div>
            <div>
              <label className="font-semibold">Fecha de Examen :</label>
              <input
                name="fechaExamen"
                type="date"
                value={form.fechaExamen}
                onChange={handleChange}
                className="border rounded px-2 py-1 w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-2">
            <div>
              <label className="font-semibold">Examen Médico :</label>
              <input
                name="nomExam"
                value={form.nomExam || ""}
                disabled
                className="border rounded px-2 py-1 w-full"
              />
            </div>
            <div>
              <label className="font-semibold">Fecha Nacimiento :</label>
              <input
                name="fechaNac"
                value={form.fechaNac}
                disabled
                className="border rounded px-2 py-1 w-full"
              />
            </div>
            <div>
              <label className="font-semibold">Nombres :</label>
              <input
                name="nombres"
                value={form.nombres || ""}
                disabled
                className="border rounded px-2 py-1 w-full"
              />
            </div>
            <div>
              <label className="font-semibold">DNI :</label>
              <input
                name="dni"
                value={form.dni || ""}
                disabled
                className="border rounded px-2 py-1 w-full"
              />
            </div>
            <div>
              <label className="font-semibold">Empresa :</label>
              <input
                name="empresa"
                value={form.empresa || ""}
                disabled
                className="border rounded px-2 py-1 w-full"
              />
            </div>
            <div>
              <label className="font-semibold">Contrata :</label>
              <input
                name="contrata"
                value={form.contrata || ""}
                disabled
                className="border rounded px-2 py-1 w-full"
              />
            </div>
          </div>
          {/* Sección de visión */}
          <div className="border rounded p-4 bg-gray-50 mb-2">
            <div className="grid grid-cols-5 gap-2 mb-2 text-center font-semibold">
              <div></div>
              <div className="col-span-2">Sin Corregir</div>
              <div className="col-span-2">Corregida</div>
            </div>
            <div className="grid grid-cols-5 gap-2 mb-2 text-center">
              <div></div>
              <div>O.D</div>
              <div>O.I</div>
              <div>O.D</div>
              <div>O.I</div>
            </div>
            {/* Visión de Cerca */}
            <div className="grid grid-cols-5 gap-2 mb-1 items-center">
              <label className="text-right pr-2">Visión de Cerca :</label>
              <input
                name="visionCercaOD"
                value={form.visionCercaOD || ""}
                disabled
                className="border rounded px-2 py-1"
              />
              <input
                name="visionCercaOI"
                value={form.visionCercaOI || ""}
                disabled
                className="border rounded px-2 py-1"
              />
              <input
                name="visionCercaODC"
                value={form.visionCercaODC || ""}
                onChange={handleChange}
                onKeyUp={(e) => handleNextFocus(e, "visionCercaOIC")}
                className="border rounded px-2 py-1"
              />
              <input
                name="visionCercaOIC"
                value={form.visionCercaOIC || ""}
                onChange={handleChange}
                onKeyUp={(e) => handleNextFocus(e, "visionLejosODC")}
                className="border rounded px-2 py-1"
              />
            </div>
            {/* Visión de Lejos */}
            <div className="grid grid-cols-5 gap-2 mb-1 items-center">
              <label className="text-right pr-2">Visión de Lejos :</label>
              <input
                name="visionLejosOD"
                value={form.visionLejosOD || ""}
                disabled
                className="border rounded px-2 py-1"
              />
              <input
                name="visionLejosOI"
                value={form.visionLejosOI || ""}
                disabled
                className="border rounded px-2 py-1"
              />
              <input
                name="visionLejosODC"
                value={form.visionLejosODC || ""}
                onChange={handleChange}
                onKeyUp={(e) => handleNextFocus(e, "visionLejosOIC")}
                className="border rounded px-2 py-1"
              />
              <input
                name="visionLejosOIC"
                value={form.visionLejosOIC || ""}
                onChange={handleChange}
                onKeyUp={(e) => handleNextFocus(e, "visionColores")}
                className="border rounded px-2 py-1"
              />
            </div>
            {/* Visión de Colores */}
            <div className="grid grid-cols-5 gap-2 mb-1 pt-4 items-center">
              <label className="text-right pr-2">Visión de Colores :</label>
              <input
                name="visionColores"
                value={form.visionColores || ""}
                onChange={handleChange}
                onKeyUp={(e) => handleNextFocus(e, "visionBinocular")}
                className="border rounded px-2 py-1 col-span-2"
              />
              <div className="col-span-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  name="normal"
                  checked={
                    form.visionColores != null &&
                    form.visionColores.toUpperCase().includes("NORMAL")
                  }
                  onChange={(e) => {
                    handleCheckBoxChange(e);
                    setForm((prev) => ({
                      ...prev,
                      visionColores: e.target.checked ? "NORMAL" : "",
                    }));
                  }}
                  className="mr-1"
                />{" "}
                Normal
              </div>
            </div>
            {/* Visión Binocular */}
            <div className="grid grid-cols-5 gap-2 mb-1 items-center">
              <label className="text-right pr-2">Visión Binocular :</label>
              <input
                name="visionBinocular"
                value={form.visionBinocular || ""}
                onChange={handleChangeNumber}
                onKeyUp={(e) => handleNextFocus(e, "reflejosPupilares")}
                className="border rounded px-2 py-1 col-span-2"
              />
              <div></div>
            </div>
            {/* Reflejos Pupilares */}
            <div className="grid grid-cols-5 gap-2 mb-1 items-center">
              <label className="text-right pr-2">Reflejos Pupilares :</label>
              <input
                name="reflejosPupilares"
                value={form.reflejosPupilares}
                onKeyUp={(e) => handleNextFocus(e, "enfOculares")}
                onChange={handleChange}
                className="border rounded px-2 py-1 col-span-2"
              />
              <div className="col-span-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  name="conservado"
                  checked={
                    form.reflejosPupilares != null &&
                    form.reflejosPupilares.toUpperCase().includes("CONSERVADO")
                  }
                  onChange={(e) => {
                    handleCheckBoxChange(e);
                    setForm((prev) => ({
                      ...prev,
                      reflejosPupilares: e.target.checked ? "CONSERVADO" : "",
                    }));
                  }}
                  className="mr-1"
                />{" "}
                Conservado
              </div>
            </div>
            {/* Enfermedades Oculares */}
            <div className="grid grid-cols-5 gap-2 mb-1 items-center">
              <label className="text-right pr-2">Enferm.Oculares :</label>
              <textarea
                name="enfOculares"
                value={form.enfOculares || ""}
                rows={3}
                disabled
                className="border rounded px-2 py-1 col-span-2 resize-none"
              />
              <div className="col-span-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  name="ninguna"
                  checked={
                    form.enfOculares != null &&
                    form.enfOculares.toUpperCase().includes("NINGUNA")
                  }
                  disabled
                  className="mr-1"
                />{" "}
                Ninguna
              </div>
            </div>
            <div className="grid grid-cols-5 gap-2 mb-1 items-center">
              <label className="text-right pr-2"></label>
              <textarea
                name="presenciaPterigion"
                value={form.presenciaPterigion || ""}
                rows={2}
                disabled
                className="border rounded px-2 py-1 col-span-4 resize-none"
              />
              <div className="col-span-5 grid grid-cols-4 text-black">
                <div></div>
                <label className="flex items-center gap-1 font-normal text-black">
                  <input
                    type="checkbox"
                    name="opcionPterigion"
                    checked={form.presenciaPterigion == "PTERIGIÓN OJO DERECHO"}
                    disabled
                  />{" "}
                  PTERIG.OJO DEREC
                </label>
                <label className="flex items-center gap-1 font-normal text-black">
                  <input
                    type="checkbox"
                    name="opcionPterigion"
                    checked={
                      form.presenciaPterigion == "PTERIGIÓN OJO IZQUIERDO"
                    }
                    disabled
                  />{" "}
                  PTERIG. OJO IZQ
                </label>
                <label className="flex items-center gap-1 font-normal text-black">
                  <input
                    type="checkbox"
                    name="opcionPterigion"
                    checked={form.presenciaPterigion == "PTERIGIÓN BILATERAL"}
                    disabled
                  />{" "}
                  PTERIG. BILATERAL
                </label>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-4 justify-center mt-auto">
            <Button onClick={handleSave} color="green" icon={faSave}>
              Guardar/Actualizar
            </Button>
            <Button onClick={handleClear} color="yellow" icon={faBroom}>
              Nuevo / Limpiar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
