import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faBroom, faPrint } from "@fortawesome/free-solid-svg-icons";

import Swal from "sweetalert2";
import {
  PrintHojaR,
  SubmitDataService,
  VerifyTR,
} from "./controllerAudiometriaCuestionario";
import EmpleadoComboBox from "../../../../../components/reusableComponents/EmpleadoComboBox";

export default function AudiometriaCuestionario({
  token,
  selectedSede,
  userlogued,
  initialFormState,
  form,
  setForm,
}) {
  const tabla = "cuestionario_audiometria";

  const handleClear = () => {
    setForm(initialFormState);
  };

  const handleClearnotO = () => {
    setForm((prev) => ({ ...initialFormState, norden: prev.norden }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };
  const toggleCheckBox = (e) => {
    const { name } = e.target;
    setForm((f) => ({
      ...f,
      [name]: !f[name],
    }));
  };
  const handlePrint = () => {
    if (!form.norden)
      return Swal.fire("Error", "Debe colocar un N° Orden", "error");
    Swal.fire({
      title: "¿Desea Imprimir Cuestionario de Audiometría?",
      html: `<div style='font-size:1.1em;margin-top:8px;'><b style='color:#5b6ef5;'>N° Orden: ${form.norden}</b></div>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, Imprimir",
      cancelButtonText: "Cancelar",
      customClass: {
        title: "swal2-title",
        confirmButton: "swal2-confirm",
        cancelButton: "swal2-cancel",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        PrintHojaR(form.norden, token, tabla);
      }
    });
  };

  return (
    <div className="w-full max-w-[70vw] mx-auto bg-white rounded shadow p-6">
      <h2 className="text-center mb-6 font-bold" style={{ fontSize: "13px" }}>
        CUESTIONARIO DE AUDIOMETRÍA
      </h2>
      <div className="space-y-6">
        <div className="flex flex-col space-y-6 mb-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2 ">
              <label
                className="font-bold min-w-[90px]"
                style={{ fontSize: "13px" }}
              >
                Nro Orden :
              </label>
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
                style={{ fontSize: "11px" }}
              />
            </div>
            <div className="flex items-center gap-2 ">
              <label
                className="font-bold min-w-[90px]"
                style={{ fontSize: "13px" }}
              >
                Fecha :
              </label>
              <input
                type="date"
                name="fecha"
                value={form.fecha}
                onChange={handleChange}
                className="border rounded px-2 py-1 w-full"
                style={{ fontSize: "11px" }}
              />
            </div>
          </div>
          <div className="flex flex-row gap-8 items-center w-full">
            <div className="flex items-center gap-2 flex-1">
              <label
                className="font-bold min-w-[90px]"
                style={{ fontSize: "13px" }}
              >
                Nombres:
              </label>
              <input
                name="nombres"
                value={form.nombres}
                disabled
                className="border rounded px-2 py-1 bg-gray-100 flex-1"
                style={{ fontSize: "11px" }}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2 ">
              <label
                className="font-bold min-w-[90px]"
                style={{ fontSize: "13px" }}
              >
                Edad :
              </label>
              <input
                name="edad"
                value={form.edad}
                disabled
                className="border rounded px-2 py-1 bg-gray-100 w-full"
                style={{ fontSize: "11px" }}
              />
            </div>
            <div className="flex items-center gap-2 ">
              <label
                className="font-bold  min-w-[90px]"
                style={{ fontSize: "13px" }}
              >
                Género :
              </label>
              <div className="flex items-center gap-6">
                <label
                  className="flex items-center gap-1"
                  style={{ fontSize: "11px" }}
                >
                  <input
                    type="radio"
                    name="genero"
                    value="Masculino"
                    checked={form.genero === "Masculino"}
                    onChange={() => { }}
                  />
                  Masculino
                </label>
                <label
                  className="flex items-center gap-1"
                  style={{ fontSize: "11px" }}
                >
                  <input
                    type="radio"
                    name="genero"
                    value="Femenino"
                    checked={form.genero === "Femenino"}
                    onChange={() => { }}
                  />
                  Femenino
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="font-bold mb-2" style={{ fontSize: "13px" }}>
          Antecedentes médicos:
        </div>

        {/* Pregunta 1 - Formato tipo imagen, sin negrita y todo en 11px */}
        <div className="mb-2" style={{ fontSize: "11px" }}>
          <div className="mb-1" style={{ fontSize: "12px" }}>
            <b>
              1.- Tiene conocimiento de algún problema del oído y/o audición que
              haya tenido o haya sido diagnosticado y/o en estudio, así como :
              perdida de audición, hipoacusia, otitis medio agudo, cronico,
              supurativo externo, presencia de secreción purulenta y/o
              sanguinolenta con o sin mal olor, escucha sonidos como pititos,
              soplidos del viento, sonido del mar ocufenos, tinnitus mareos,
              vértigo, nauseas, rinitis alérgica parolisis facial,
              adormecimiento de hemicoro, tumores del sistema nerviosos central.
            </b>
          </div>
          <div className="flex flex-col gap-4 px-4 py-4">
            <div className="flex flex-row gap-4">
              <div className="flex items-start gap-4 ">
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="radio"
                    name="p1"
                    value="SI"
                    checked={form.p1 === "SI"}
                    onChange={handleChange}
                  />
                  <span>SI</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="radio"
                  name="p1"
                  value="NO"
                  checked={form.p1 === "NO"}
                  onChange={(e) => {
                    handleChange(e);
                    setForm((prev) => ({
                      ...prev,
                      p1_cual: "",
                      p1_cuando: "",
                      p1_quehizo: "",
                    }));
                  }}
                />
                <span>NO</span>
              </div>
            </div>
            <div
              className={`flex-1 flex flex-col gap-2 ${form.p1 === "SI" ? "opacity-100" : "opacity-50"
                }`}
            >
              <div className="flex items-center gap-2">
                <span className="min-w-[70px]">¿Cuál?</span>
                <input
                  name="p1_cual"
                  value={form.p1_cual || ""}
                  onChange={handleChange}
                  className="border rounded px-2 py-1 flex-1"
                  style={{ fontSize: "11px" }}
                  disabled={form.p1 !== "SI"}
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="min-w-[70px]">¿Cuándo?</span>
                <input
                  name="p1_cuando"
                  value={form.p1_cuando || ""}
                  onChange={handleChange}
                  className="border rounded px-2 py-1 flex-1"
                  style={{ fontSize: "11px" }}
                  disabled={form.p1 !== "SI"}
                />
              </div>

              <div className="flex items-center gap-2 w-full">
                <span className="min-w-[70px]">¿Qué Hizo?</span>
                <input
                  name="p1_quehizo"
                  value={form.p1_quehizo || ""}
                  onChange={handleChange}
                  className="border rounded px-2 py-1 flex-1"
                  style={{ fontSize: "11px" }}
                  disabled={form.p1 !== "SI"}
                />
              </div>
            </div>
          </div>
        </div>
        {/* Pregunta 2 */}
        <div className="mb-2 flex items-center" style={{ fontSize: "11px" }}>
          <span className="mr-2">
            <b>
              2.- Ha realizado viaje o ha llegado de viaje en las 16 horas
              anteriores a esta entrevista y examen.
            </b>
          </span>
          <div className="flex items-center gap-2 ml-auto">
            <input
              type="radio"
              name="p2"
              value="SI"
              checked={form.p2 === "SI"}
              onChange={handleChange}
            />
            <span>SI</span>
            <input
              type="radio"
              name="p2"
              value="NO"
              checked={form.p2 === "NO"}
              onChange={handleChange}
              className="ml-4"
            />
            <span>NO</span>
          </div>
        </div>
        {/* Pregunta 3 */}
        <div className="mb-2 flex items-center" style={{ fontSize: "11px" }}>
          <span className="mr-2">
            <b>
              3.- Ha estado escuchando música con audífonos en las 16 horas
              anteriores a esta entrevista o examen.
            </b>
          </span>
          <div className="flex items-center gap-2 ml-auto">
            <input
              type="radio"
              name="p3"
              value="SI"
              checked={form.p3 === "SI"}
              onChange={handleChange}
            />
            <span>SI</span>
            <input
              type="radio"
              name="p3"
              value="NO"
              checked={form.p3 === "NO"}
              onChange={handleChange}
              className="ml-4"
            />
            <span>NO</span>
          </div>
        </div>
        {/* Pregunta 4 */}
        <div className="mb-2 flex items-center" style={{ fontSize: "11px" }}>
          <span className="mr-2">
            <b>
              4.- Se ha desplazado y/o movilizado en moto lineal y/o en vehículo
              con las ventanas abiertas.
            </b>
          </span>
          <div className="flex items-center gap-2 ml-auto">
            <input
              type="radio"
              name="p4"
              value="SI"
              checked={form.p4 === "SI"}
              onChange={handleChange}
            />
            <span>SI</span>
            <input
              type="radio"
              name="p4"
              value="NO"
              checked={form.p4 === "NO"}
              onChange={handleChange}
              className="ml-4"
            />
            <span>NO</span>
          </div>
        </div>
        {/* Pregunta 5 */}
        <div className="mb-2 flex items-center" style={{ fontSize: "11px" }}>
          <span className="mr-2">
            <b>
              5.- Ha trabajado expuesto a ruido y/o vibraciones en las 16 horas
              anteriores a esta entrevista y examen.
            </b>
          </span>
          <div className="flex items-center gap-2 ml-auto">
            <input
              type="radio"
              name="p5"
              value="SI"
              checked={form.p5 === "SI"}
              onChange={handleChange}
            />
            <span>SI</span>
            <input
              type="radio"
              name="p5"
              value="NO"
              checked={form.p5 === "NO"}
              onChange={handleChange}
              className="ml-4"
            />
            <span>NO</span>
          </div>
        </div>
        {/* Pregunta 6 */}
        <div className="mb-2 flex items-center" style={{ fontSize: "11px" }}>
          <span className="mr-2">
            <b>
              6.- Ha bebido bebidas alcohólicas y/o fumó cigarrillos en las 16
              horas anteriores a esta entrevista y examen.
            </b>
          </span>
          <div className="flex items-center gap-2 ml-auto">
            <input
              type="radio"
              name="p6"
              value="SI"
              checked={form.p6 === "SI"}
              onChange={handleChange}
            />
            <span>SI</span>
            <input
              type="radio"
              name="p6"
              value="NO"
              checked={form.p6 === "NO"}
              onChange={handleChange}
              className="ml-4"
            />
            <span>NO</span>
          </div>
        </div>
        {/* Pregunta 7 */}
        <div className="mb-2 flex items-center" style={{ fontSize: "11px" }}>
          <span className="mr-2">
            <b>
              7.- Ha estado despierto o trabajando en turno de noche 16 horas
              anteriores a esta entrevista y examen.
            </b>
          </span>
          <div className="flex items-center gap-2 ml-auto">
            <input
              type="radio"
              name="p7"
              value="SI"
              checked={form.p7 === "SI"}
              onChange={handleChange}
            />
            <span>SI</span>
            <input
              type="radio"
              name="p7"
              value="NO"
              checked={form.p7 === "NO"}
              onChange={handleChange}
              className="ml-4"
            />
            <span>NO</span>
          </div>
        </div>
        {/* Pregunta 8 */}
        <div className="mb-2 flex items-center" style={{ fontSize: "11px" }}>
          <span className="mr-2">
            <b>
              8.- ¿Está resfriado con tos, con dolor auricular, fiebre y/u otra
              enfermedad respiratoria aguda.
            </b>
          </span>
          <div className="flex items-center gap-2 ml-auto">
            <input
              type="radio"
              name="p8"
              value="SI"
              checked={form.p8 === "SI"}
              onChange={handleChange}
            />
            <span>SI</span>
            <input
              type="radio"
              name="p8"
              value="NO"
              checked={form.p8 === "NO"}
              onChange={handleChange}
              className="ml-4"
            />
            <span>NO</span>
          </div>
        </div>
        {/* Pregunta 9 */}
        <div className="mb-2" style={{ fontSize: "11px" }}>
          <div className="mb-1" style={{ fontSize: "12px" }}>
            <b>
              9.- ¿Le han practicado cirugía de oído (timpanoplastía,
              mastoidectomía, estopediectomía)?
            </b>
          </div>
          <div className="flex flex-col gap-4 px-4 py-4">
            <div className="flex flex-row gap-4">
              <div className="flex items-start gap-4">
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="radio"
                    name="p9"
                    value="SI"
                    checked={form.p9 === "SI"}
                    onChange={handleChange}
                  />
                  <span>SI</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="radio"
                  name="p9"
                  value="NO"
                  checked={form.p9 === "NO"}
                  onChange={(e) => {
                    handleChange(e);
                    setForm((prev) => ({
                      ...prev,
                      p9_cual: "",
                      p9_donde: "",
                      p9_quehizo: "",
                    }));
                  }}
                />
                <span>NO</span>
              </div>
            </div>

            <div
              className={`flex-1 flex flex-col gap-2 ${form.p9 === "SI" ? "opacity-100" : "opacity-50"
                }`}
            >
              <div className="flex items-center gap-2">
                <span className="min-w-[150px]">¿Cuál?</span>
                <input
                  name="p9_cual"
                  value={form.p9_cual || ""}
                  onChange={handleChange}
                  className="border rounded px-2 py-1 flex-1"
                  style={{ fontSize: "11px" }}
                  disabled={form.p9 !== "SI"}
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="min-w-[150px]">¿Dónde lo diagnosticaron?</span>
                <input
                  name="p9_donde"
                  value={form.p9_donde || ""}
                  onChange={handleChange}
                  className="border rounded px-2 py-1 flex-1"
                  style={{ fontSize: "11px" }}
                  disabled={form.p9 !== "SI"}
                />
              </div>

              <div className="flex items-center gap-2 w-full">
                <span className="min-w-[150px]">¿Qué Hizo?</span>
                <input
                  name="p9_quehizo"
                  value={form.p9_quehizo || ""}
                  onChange={handleChange}
                  className="border rounded px-2 py-1 flex-1"
                  style={{ fontSize: "11px" }}
                  disabled={form.p9 !== "SI"}
                />
              </div>
            </div>
          </div>
        </div>
        {/* Pregunta 10 */}
        <div className="mb-2" style={{ fontSize: "11px" }}>
          <div className="mb-1" style={{ fontSize: "12px" }}>
            <b>
              10.- ¿Ha tenido traumatismo craneoencefálico traumatismo en el
              oído?
            </b>
          </div>
          <div className="flex flex-col gap-4 px-4 py-4">
            <div className="flex flex-row gap-4">
              <div className="flex items-start gap-4">
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="radio"
                    name="p10"
                    value="SI"
                    checked={form.p10 === "SI"}
                    onChange={handleChange}
                  />
                  <span>SI</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="radio"
                  name="p10"
                  value="NO"
                  checked={form.p10 === "NO"}
                  onChange={(e) => {
                    handleChange(e);
                    setForm((prev) => ({
                      ...prev,
                      p10_cual: "",
                      p10_donde: "",
                      p10_quehizo: "",
                    }));
                  }}
                />
                <span>NO</span>
              </div>
            </div>

            <div
              className={`flex-1 flex flex-col gap-2 ${form.p10 === "SI" ? "opacity-100" : "opacity-50"
                }`}
            >
              <div className="flex items-center gap-2">
                <span className="min-w-[70px]">¿Cuál?</span>
                <input
                  name="p10_cual"
                  value={form.p10_cual || ""}
                  onChange={handleChange}
                  className="border rounded px-2 py-1 flex-1"
                  style={{ fontSize: "11px" }}
                  disabled={form.p10 !== "SI"}
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="min-w-[70px]">¿Dónde?</span>
                <input
                  name="p10_donde"
                  value={form.p10_donde || ""}
                  onChange={handleChange}
                  className="border rounded px-2 py-1 flex-1"
                  style={{ fontSize: "11px" }}
                  disabled={form.p10 !== "SI"}
                />
              </div>

              <div className="flex items-center gap-2 w-full">
                <span className="min-w-[70px]">¿Qué Hizo?</span>
                <input
                  name="p10_quehizo"
                  value={form.p10_quehizo || ""}
                  onChange={handleChange}
                  className="border rounded px-2 py-1 flex-1"
                  style={{ fontSize: "11px" }}
                  disabled={form.p10 !== "SI"}
                />
              </div>
            </div>
          </div>
        </div>
        {/* Pregunta 11 */}
        <div className="mb-2" style={{ fontSize: "11px" }}>
          <div className="mb-1" style={{ fontSize: "12px" }}>
            <b>
              11.- ¿Ha consumido o consume medicamentos como: Clipatino,
              aminoglucósidos (bancomicina y amikacina) aspirina, furosemida y/o
              antituberculosos?
            </b>
          </div>
          <div className="flex flex-col gap-4 px-4 py-4">
            <div className="flex flex-row gap-4">
              <div className="flex items-start gap-4">
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="radio"
                    name="p11"
                    value="SI"
                    checked={form.p11 === "SI"}
                    onChange={handleChange}
                  />
                  <span>SI</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="radio"
                  name="p11"
                  value="NO"
                  checked={form.p11 === "NO"}
                  onChange={(e) => {
                    handleChange(e);
                    setForm((prev) => ({
                      ...prev,
                      p11_cual: "",
                      p11_tiempo: "",
                    }));
                  }}
                />
                <span>NO</span>
              </div>
            </div>

            <div
              className={`flex-1 flex flex-col gap-2 ${form.p11 === "SI" ? "opacity-100" : "opacity-50"
                }`}
            >
              <div className="flex items-center gap-2">
                <span className="min-w-[150px]">¿Cuál?</span>
                <input
                  name="p11_cual"
                  value={form.p11_cual || ""}
                  onChange={handleChange}
                  className="border rounded px-2 py-1 flex-1"
                  style={{ fontSize: "11px" }}
                  disabled={form.p11 !== "SI"}
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="min-w-[150px]">¿Por cuanto tiempo?</span>
                <input
                  name="p11_tiempo"
                  value={form.p11_tiempo || ""}
                  onChange={handleChange}
                  className="border rounded px-2 py-1 flex-1"
                  style={{ fontSize: "11px" }}
                  disabled={form.p11 !== "SI"}
                />
              </div>
            </div>
          </div>
        </div>
        {/* Pregunta 12 */}
        <div className="mb-2" style={{ fontSize: "11px" }}>
          <div className="mb-1" style={{ fontSize: "12px" }}>
            <b>
              12.- ¿Ha estado expuesto a solventes orgánicos (tolveno, xileno,
              disulfuro de carbono, plomo, mercurio, monóxido de carbono)
              plaguicidas, organofosforados y piretroides?
            </b>
          </div>
          <div className="flex flex-col gap-4 px-4 py-4">
            <div className="flex flex-row gap-4">
              <div className="flex items-start gap-4">
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="radio"
                    name="p12"
                    value="SI"
                    checked={form.p12 === "SI"}
                    onChange={handleChange}
                  />
                  <span>SI</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="radio"
                  name="p12"
                  value="NO"
                  checked={form.p12 === "NO"}
                  onChange={(e) => {
                    handleChange(e);
                    setForm((prev) => ({
                      ...prev,
                      p12_cual: "",
                      p12_tiempo: "",
                    }));
                  }}
                />
                <span>NO</span>
              </div>
            </div>

            <div
              className={`flex-1 flex flex-col gap-2 ${form.p12 === "SI" ? "opacity-100" : "opacity-50"
                }`}
            >
              <div className="flex items-center gap-2">
                <span className="min-w-[70px]">¿Cuál?</span>
                <input
                  name="p12_cual"
                  value={form.p12_cual || ""}
                  onChange={handleChange}
                  className="border rounded px-2 py-1 flex-1"
                  style={{ fontSize: "11px" }}
                  disabled={form.p12 !== "SI"}
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="min-w-[70px]">¿Por cuanto tiempo?</span>
                <input
                  name="p12_tiempo"
                  value={form.p12_tiempo || ""}
                  onChange={handleChange}
                  className="border rounded px-2 py-1 flex-1"
                  style={{ fontSize: "11px" }}
                  disabled={form.p12 !== "SI"}
                />
              </div>
            </div>
          </div>
        </div>
        {/* Pregunta 13 */}
        <div className="mb-2" style={{ fontSize: "11px" }}>
          <div className="mb-1" style={{ fontSize: "12px" }}>
            <b>13.- ¿Ha estado expuesto a vibraciones continuas?</b>
          </div>
          <div className="flex flex-col gap-4 px-4 py-4">
            <div className="flex flex-row gap-4">
              <div className="flex items-start gap-4">
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="radio"
                    name="p13"
                    value="SI"
                    checked={form.p13 === "SI"}
                    onChange={handleChange}
                  />
                  <span>SI</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="radio"
                  name="p13"
                  value="NO"
                  checked={form.p13 === "NO"}
                  onChange={(e) => {
                    handleChange(e);
                    setForm((prev) => ({
                      ...prev,
                      p13_tiempo: "",
                      p13_cuando: "",
                      p13_donde: "",
                    }));
                  }}
                />
                <span>NO</span>
              </div>
            </div>

            <div
              className={`flex-1 flex flex-col gap-2 ${form.p13 === "SI" ? "opacity-100" : "opacity-50"
                }`}
            >
              <div className="flex items-center gap-2">
                <span className="min-w-[110px]">¿Cuánto tiempo?</span>
                <input
                  name="p13_tiempo"
                  value={form.p13_tiempo || ""}
                  onChange={handleChange}
                  className="border rounded px-2 py-1 flex-1"
                  style={{ fontSize: "11px" }}
                  disabled={form.p13 !== "SI"}
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="min-w-[110px]">¿Cuándo?</span>
                <input
                  name="p13_cuando"
                  value={form.p13_cuando || ""}
                  onChange={handleChange}
                  className="border rounded px-2 py-1 flex-1"
                  style={{ fontSize: "11px" }}
                  disabled={form.p13 !== "SI"}
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="min-w-[110px]">¿Dónde?</span>
                <input
                  name="p13_donde"
                  value={form.p13_donde || ""}
                  onChange={handleChange}
                  className="border rounded px-2 py-1 flex-1"
                  style={{ fontSize: "11px" }}
                  disabled={form.p13 !== "SI"}
                />
              </div>
            </div>
          </div>
        </div>
        {/* Pregunta 14 */}
        <div className="mb-2" style={{ fontSize: "11px" }}>
          <div className="mb-1" style={{ fontSize: "12px" }}>
            <b>
              14.- ¿Sufre de: hipertensión arterial diabetes mellitus,
              hipotiroidismo, insuficiencia renal crónica, enfermedades
              autoinmunes?
            </b>
          </div>
          <div className="flex flex-col gap-4 px-4 py-4">
            <div className="flex flex-row gap-4">
              <div className="flex items-start gap-4">
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="radio"
                    name="p14"
                    value="SI"
                    checked={form.p14 === "SI"}
                    onChange={handleChange}
                  />
                  <span>SI</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="radio"
                  name="p14"
                  value="NO"
                  checked={form.p14 === "NO"}
                  onChange={(e) => {
                    handleChange(e);
                    setForm((prev) => ({
                      ...prev,
                      p14_cual: "",
                      p14_donde: "",
                      p14_quehizo: "",
                    }));
                  }}
                />
                <span>NO</span>
              </div>
            </div>

            <div
              className={`flex-1 flex flex-col gap-2 ${form.p14 === "SI" ? "opacity-100" : "opacity-50"
                }`}
            >
              <div className="flex items-center gap-2">
                <span className="min-w-[110px]">¿Cuál?</span>
                <input
                  name="p14_cual"
                  value={form.p14_cual || ""}
                  onChange={handleChange}
                  className="border rounded px-2 py-1 flex-1"
                  style={{ fontSize: "11px" }}
                  disabled={form.p14 !== "SI"}
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="min-w-[110px]">¿Dónde lo diagnosticaron?</span>
                <input
                  name="p14_donde"
                  value={form.p14_donde || ""}
                  onChange={handleChange}
                  className="border rounded px-2 py-1 flex-1"
                  style={{ fontSize: "11px" }}
                  disabled={form.p14 !== "SI"}
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="min-w-[110px]">¿Qué hizo?</span>
                <input
                  name="p14_quehizo"
                  value={form.p14_quehizo || ""}
                  onChange={handleChange}
                  className="border rounded px-2 py-1 flex-1"
                  style={{ fontSize: "11px" }}
                  disabled={form.p14 !== "SI"}
                />
              </div>
            </div>
          </div>
        </div>
        {/* Pregunta 15 */}
        <div className="mb-2" style={{ fontSize: "11px" }}>
          <div className="mb-1" style={{ fontSize: "12px" }}>
            <b>15.- ¿Consume cigarrillos?</b>
          </div>

          <div className="flex flex-col gap-4 px-4 py-4">
            <div className="flex flex-row gap-4">
              <div className="flex items-start gap-4">
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="radio"
                    name="p15"
                    value="SI"
                    checked={form.p15 === "SI"}
                    onChange={handleChange}
                  />
                  <span>SI</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="radio"
                  name="p15"
                  value="NO"
                  checked={form.p15 === "NO"}
                  onChange={(e) => {
                    handleChange(e);
                    setForm((prev) => ({
                      ...prev,
                      p15_cuantos: "",
                    }));
                  }}
                />
                <span>NO</span>
              </div>
            </div>

            <div
              className={`flex-1 flex flex-col gap-2 ${form.p15 === "SI" ? "opacity-100" : "opacity-50"
                }`}
            >
              <div className="flex items-center gap-2">
                <span className="min-w-[110px]">¿Cuántos por mes?</span>
                <input
                  name="p15_cuantos"
                  value={form.p15_cuantos || ""}
                  onChange={handleChange}
                  className="border rounded px-2 py-1 flex-1"
                  style={{ fontSize: "11px" }}
                  disabled={form.p15 !== "SI"}
                />
              </div>
            </div>
          </div>
        </div>
        {/* Pregunta 16 */}
        <div className="mb-2" style={{ fontSize: "11px" }}>
          <div className="mb-1" style={{ fontSize: "12px" }}>
            <b>16.- ¿Ha realizado actividades de?</b>
          </div>

          <div className="flex flex-col gap-4 px-4 py-4">
            {[
              { name: "p16_caza", label: "Caza", tiempo: "p16_caza_tiempo" },
              {
                name: "p16_tiro",
                label: "Tiro al blanco",
                tiempo: "p16_tiro_tiempo",
              },
              {
                name: "p16_discoteca",
                label: "Concurrencia frecuente a discotecas y/o bares",
                tiempo: "p16_discoteca_tiempo",
              },
              {
                name: "p16_auriculares",
                label: "Uso de auriculares",
                tiempo: "p16_auriculares_tiempo",
              },
              {
                name: "p16_servicio",
                label: "Servicio militar",
                tiempo: "p16_servicio_tiempo",
              },
              { name: "p16_boxeo", label: "Boxeo", tiempo: "p16_boxeo_tiempo" },
            ].map((item) => (
              <div key={item.name} className="flex flex-col  gap-1">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name={item.name}
                    checked={form[item.name]}
                    onChange={(e) => {
                      toggleCheckBox(e);
                      setForm((prev) => ({
                        ...prev,
                        [item.tiempo]: "",
                      }));
                    }}
                  />
                  <span>{item.label}</span>
                </div>

                <div
                  className={`flex items-center gap-2 sm:ml-4 ${form[item.name] ? "opacity-100" : "opacity-50"
                    }`}
                >
                  <span>¿Cuánto tiempo?</span>
                  <input
                    name={item.tiempo}
                    value={form[item.tiempo] || ""}
                    onChange={handleChange}
                    className="border rounded px-2 py-1 flex-1 min-w-[150px]"
                    style={{ fontSize: "11px" }}
                    disabled={!form[item.name]}
                  />
                </div>
              </div>
            ))}
          </div>
          <EmpleadoComboBox
            value={form.nombre_medico}
            label="Especialista"
            form={form}
            onChange={handleChange}
          />
        </div>
      </div>
      {/* Acciones al pie, dentro del mismo formulario */}
      <div
        className="flex flex-col justify-between lg:flex-row mt-8 gap-8"
        style={{ fontSize: "12px" }}
      >
        {/* Cuestionario Terminado */}
        <fieldset className="border rounded p-3 min-w-[340px]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 rounded-lg border-none font-semibold bg-[#059669] text-white transition"
              style={{ minWidth: "160px", fontSize: "12px" }}
              onClick={() => {
                SubmitDataService(form, token, userlogued, handleClear, tabla);
              }}
            >
              <FontAwesomeIcon
                icon={faSave}
                style={{ color: "#fff", fontSize: "13px" }}
              />{" "}
              Guardar/Actualizar
            </button>
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 rounded-lg border-none font-semibold bg-[#facc14] text-[#FFFFFF] transition"
              style={{ minWidth: "120px", fontSize: "12px" }}
              onClick={handleClear}
            >
              <FontAwesomeIcon
                icon={faBroom}
                style={{ color: "white", fontSize: "13px" }}
              />{" "}
              Limpiar
            </button>
          </div>
        </fieldset>
        {/* Imprimir Cuestionario */}
        <fieldset className="border rounded p-3 min-w-[340px]">
          <div className="flex items-center gap-2">
            <label
              className="font-bold min-w-[90px]"
              style={{ fontSize: "12px" }}
            >
              Nro Orden :
            </label>
            <input
              name="norden"
              value={form.norden}
              onChange={handleChange}
              className="border rounded-lg px-3 py-2"
              style={{
                fontSize: "12px",
                width: "100px",
                color: "#222",
                fontWeight: "bold",
                outline: "none",
              }}
            />
            <button
              type="button"
              className="ml-2 px-4 py-2.5 rounded-lg border-none bg-[#2664eb]  transition text-white flex items-center justify-center"
              title="Imprimir Cuestionario"
              onClick={handlePrint}
              style={{ fontSize: "13px" }}
            >
              <FontAwesomeIcon
                icon={faPrint}
                style={{ color: "#fff", fontSize: "13px" }}
              />
            </button>
          </div>
        </fieldset>
      </div>
    </div>
  );
}