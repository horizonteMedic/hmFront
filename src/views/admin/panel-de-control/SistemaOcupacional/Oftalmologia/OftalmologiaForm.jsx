import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSave,
  faBroom,
  faEdit,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import ModalLevantarObservacion from "./ModalLevantarObservacion";
import {
  GetInfoServicio,
  GetInfoServicioTabla,
  getInfoTabla,
  Loading,
  PrintHojaCompleto,
  PrintHojaR,
  SubmitDataService,
  VerifyTR,
} from "./controllerOftalmologiaForm";
import Swal from "sweetalert2";

const tabla = "oftalmologia";
const date = new Date();
const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
  2,
  "0"
)}-${String(date.getDate()).padStart(2, "0")}`;

const initialFormState = {
  norden: "",
  codOf: null,
  fechaExamen: today,
  nomExam: "",
  fechaNac: "",
  dni: "",
  nombres: "",
  empresa: "",
  contrata: "",
  visionCercaOD: "",
  visionCercaOI: "",
  visionCercaODC: "",
  visionCercaOIC: "",
  visionLejosOD: "",
  visionLejosOI: "",
  visionLejosODC: "",
  visionLejosOIC: "",
  visionColores: "",
  visionBinocular: "",
  reflejosPupilares: "",
  presenciaPterigion: "",
  opcionPterigion: "",
  normal: false,
  conservado: false,
  ninguna: false,
  enfOculares: "",

  normalGeneral: false,
  agudezaLejos: "",

  nombres_search: "",
  codigo_search: "",
};

export default function OftalmologiaForm({ token, selectedSede, userlogued }) {
  const [form, setForm] = useState(initialFormState);
  const [form2, setForm2] = useState(initialFormState);
  const [showModal, setShowModal] = useState(false);

  const [dataTabla, setDataTabla] = useState([]);

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

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value == "" ? "00" : value }));
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
    SubmitDataService(form, token, userlogued, handleClear, tabla);
  };

  useEffect(() => {
    obtenerInfoTabla();
  }, []);

  const obtenerInfoTabla = () => {
    getInfoTabla(form.nombres_search, form.codigo_search, setDataTabla, token);
  };

  const handlePrint = () => {
    if (!form.norden)
      return Swal.fire("Error", "Debe colocar un N° Orden", "error");
    Swal.fire({
      title: "¿Desea Imprimir Reporte?",
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
        PrintHojaCompleto(form.norden, token, "oftalmologia_reporte");
      }
    });
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Columna izquierda: Formulario */}
      <div
        className="min-w-[320px] w-full md:w-1/2 text-black"
        style={{ flexBasis: "50%" }}
      >
        <form className="space-y-4">
          <div className="flex gap-4 items-center mb-2">
            <label className="font-semibold">N° Orden :</label>
            <input
              name="norden"
              value={form.norden || ""}
              onChange={handleChange}
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  handleClearnotO();
                  VerifyTR(form.norden, tabla, token, setForm, selectedSede);
                }
              }}
              className="border rounded px-2 py-1 w-32 "
            />
            <label className="font-semibold ml-4">Fecha de Examen :</label>
            <input
              name="fechaExamen"
              type="date"
              value={form.fechaExamen}
              onChange={handleChange}
              className="border rounded px-2 py-1 w-40"
            />
            <div className="flex gap-4 flex-1 justify-center items-center">
              <button
                type="button"
                disabled={form.codOf == null}
                onClick={() => {
                  setShowModal(true);
                  setForm2((prev) => ({ ...prev, norden: form.norden }));
                }}
                className={`px-3 h-[22px] rounded flex items-center w-full justify-center transition-colors duration-200
                  ${
                    form.codOf == null
                      ? "bg-gray-300 text-gray-500 "
                      : "bg-green-200 hover:bg-green-300 text-green-800 cursor-pointer"
                  }`}
              >
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className={`mr-2 ${
                    form.codOf == null ? "text-gray-500" : "text-green-800"
                  }`}
                />
                <p className="">LEVANTAR OBSERVACION</p>
              </button>
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
                onChange={handleChangeNumber}
                onKeyUp={(e) => handleNextFocus(e, "visionCercaOI")}
                onBlur={handleBlur}
                className="border rounded px-2 py-1"
              />
              <input
                name="visionCercaOI"
                value={form.visionCercaOI || ""}
                onChange={handleChangeNumber}
                onKeyUp={(e) => handleNextFocus(e, "visionLejosOD")}
                onBlur={handleBlur}
                className="border rounded px-2 py-1"
              />
              <input
                name="visionCercaODC"
                value={form.visionCercaODC || ""}
                onChange={handleChangeNumber}
                onKeyUp={(e) => handleNextFocus(e, "visionCercaOIC")}
                onBlur={handleBlur}
                className="border rounded px-2 py-1"
              />
              <input
                name="visionCercaOIC"
                value={form.visionCercaOIC || ""}
                onChange={handleChangeNumber}
                onKeyUp={(e) => handleNextFocus(e, "visionLejosODC")}
                onBlur={handleBlur}
                className="border rounded px-2 py-1"
              />
            </div>
            {/* Visión de Lejos */}
            <div className="grid grid-cols-5 gap-2 mb-1 items-center">
              <label className="text-right pr-2">Visión de Lejos :</label>
              <input
                name="visionLejosOD"
                value={form.visionLejosOD || ""}
                onChange={handleChangeNumber}
                onKeyUp={(e) => handleNextFocus(e, "visionLejosOI")}
                onBlur={handleBlur}
                className="border rounded px-2 py-1"
              />
              <input
                name="visionLejosOI"
                value={form.visionLejosOI || ""}
                onChange={handleChangeNumber}
                onKeyUp={(e) => handleNextFocus(e, "visionCercaODC")}
                onBlur={handleBlur}
                className="border rounded px-2 py-1"
              />
              <input
                name="visionLejosODC"
                value={form.visionLejosODC || ""}
                onChange={handleChangeNumber}
                onKeyUp={(e) => handleNextFocus(e, "visionLejosOIC")}
                onBlur={handleBlur}
                className="border rounded px-2 py-1"
              />
              <input
                name="visionLejosOIC"
                value={form.visionLejosOIC || ""}
                onChange={handleChangeNumber}
                onKeyUp={(e) => handleNextFocus(e, "visionColores")}
                onBlur={handleBlur}
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
              <input
                name="enfOculares"
                value={form.enfOculares || ""}
                onChange={handleChange}
                onKeyUp={(e) => handleNextFocus(e, "presenciaPterigion")}
                className="border rounded px-2 py-1 col-span-2"
              />
              <div className="col-span-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  name="ninguna"
                  checked={
                    form.enfOculares != null &&
                    form.enfOculares.toUpperCase().includes("NINGUNA")
                  }
                  onChange={(e) => {
                    handleCheckBoxChange(e);
                    setForm((prev) => ({
                      ...prev,
                      enfOculares: e.target.checked ? "NINGUNA" : "",
                    }));
                  }}
                  className="mr-1"
                />{" "}
                Ninguna
              </div>
            </div>
            <div className="grid grid-cols-5 gap-2 mb-1 items-center">
              <label className="text-right pr-2"></label>
              <input
                name="presenciaPterigion"
                value={form.presenciaPterigion || ""}
                onKeyUp={(e) => handleNextFocus(e, "agudezaLejos")}
                onChange={handleChange}
                className="border rounded px-2 py-1 col-span-4"
              />
              <div className="col-span-5 grid grid-cols-4 text-black">
                <div></div>
                <label className="flex items-center gap-1 font-normal text-black">
                  <input
                    type="checkbox"
                    name="opcionPterigion"
                    checked={form.presenciaPterigion == "PTERIGIÓN OJO DERECHO"}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        presenciaPterigion: e.target.checked
                          ? "PTERIGIÓN OJO DERECHO"
                          : "",
                      }))
                    }
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
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        presenciaPterigion: e.target.checked
                          ? "PTERIGIÓN OJO IZQUIERDO"
                          : "",
                      }))
                    }
                  />{" "}
                  PTERIG. OJO IZQ
                </label>
                <label className="flex items-center gap-1 font-normal text-black">
                  <input
                    type="checkbox"
                    name="opcionPterigion"
                    checked={form.presenciaPterigion == "PTERIGIÓN BILATERAL"}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        presenciaPterigion: e.target.checked
                          ? "PTERIGIÓN BILATERAL"
                          : "",
                      }))
                    }
                  />{" "}
                  PTERIG. BILATERAL
                </label>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="mb-2 flex-1">
              <label className="font-semibold">Agudeza visual de lejos:</label>
              <textarea
                name="agudezaLejos"
                rows={2}
                value={form.agudezaLejos || ""}
                onChange={handleChange}
                className="border rounded px-2 py-1 w-full"
              />
            </div>
            {/* Normal y Agudeza visual de lejos */}
            <div className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                name="normalGeneral"
                checked={
                  form.agudezaLejos != null &&
                  form.agudezaLejos.toUpperCase().includes("NORMAL")
                }
                onChange={(e) => {
                  handleCheckBoxChange(e);
                  setForm((prev) => ({
                    ...prev,
                    agudezaLejos: e.target.checked ? "NORMAL" : "",
                  }));
                }}
                className="mr-1"
              />
              Normal
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-4 justify-center pt-4 mt-auto">
            <Button onClick={handleSave} color="green" icon={faSave}>
              Guardar/Actualizar
            </Button>
            <Button onClick={handleClear} color="yellow" icon={faBroom}>
              Nuevo / Limpiar
            </Button>
          </div>
        </form>
      </div>
      {/* Columna derecha: Panel de historial/búsqueda */}
      <div
        className="bg-gray-50 border rounded p-4 flex flex-col min-w-[320px] w-full md:w-1/2 text-black"
        style={{ flexBasis: "50%", maxWidth: "100%" }}
      >
        <div className="mb-2 font-semibold">Buscar - Imprimir Reportes</div>
        <div className="grid grid-cols-2 gap-2 mb-2 items-center justify-center w-full">
          <div>
            <label className="font-semibold">Nombre :</label>
            <input
              className="border rounded px-2 py-1 w-full"
              name="nombres_search"
              value={form.nombres_search}
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  obtenerInfoTabla();
                }
              }}
              onChange={(e) => {
                const { name, value } = e.target;
                setForm((f) => ({ ...f, [name]: value, codigo_search: "" }));
              }}
            />
          </div>
          <div>
            <label className="font-semibold ml-2">Codigo:</label>
            <input
              className="border rounded px-2 py-1  w-full"
              name="codigo_search"
              value={form.codigo_search}
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  obtenerInfoTabla();
                }
              }}
              onChange={(e) => {
                const { name, value } = e.target;
                if (/^[\d/]*$/.test(value)) {
                  setForm((f) => ({ ...f, [name]: value, nombres_search: "" }));
                }
              }}
            />
          </div>
        </div>
        <div className="mb-2">
          <div className="font-semibold ">Agregados Recientemente</div>
        </div>
        <div className="flex-1">
          <Table
            data={dataTabla}
            tabla={tabla}
            set={setForm}
            token={token}
            clean={handleClear}
          />
        </div>
        <div className="flex justify-center mt-auto pt-4">
          <button
            className={`font-semibold px-4 py-2 rounded shadow border max-w-[450px] transition-colors duration-200 ${
              form.norden == ""
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
            }`}
            disabled={form.norden == ""}
            onClick={handlePrint}
          >
            VER HISTORIAL
          </button>
        </div>
      </div>
      {/* Modal para levantar observación */}
      {showModal && (
        <ModalLevantarObservacion
          onClose={() => setShowModal(false)}
          form={form2}
          setForm={setForm2}
          initialFormState={initialFormState}
          token={token}
          userlogued={userlogued}
          selectedSede={selectedSede}
        />
      )}
    </div>
  );
}

export function Button({ onClick, color, icon, children }) {
  const bg =
    color === "green"
      ? "bg-green-600 hover:bg-green-700"
      : "bg-yellow-400 hover:bg-yellow-500";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${bg} text-white font-semibold px-4 py-2 rounded shadow border  max-w-[450px] flex gap-2 justify-center items-center`}
    >
      <FontAwesomeIcon icon={icon} />
      {children}
    </button>
  );
}

function Table({ data, tabla, set, token, clean }) {
  // confirmación antes de imprimir
  const handlePrintConfirm = (nro) => {
    Swal.fire({
      title: "Confirmar impresión",
      text: `¿Deseas imprimir la ficha Nº ${nro}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, imprimir",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        PrintHojaR(nro, token, tabla);
      }
    });
  };

  function clicktable(nro) {
    clean();
    Loading("Importando Datos");
    GetInfoServicioTabla(nro, tabla, set, token);
  }
  function convertirFecha(fecha) {
    if (fecha == null || fecha === "") return "";
    const [dia, mes, anio] = fecha.split("-");
    return `${anio}/${mes.padStart(2, "0")}/${dia.padStart(2, "0")}`;
  }

  return (
    <div className="overflow-y-auto " style={{ maxHeight: "450px" }}>
      <table className="w-full table-auto border-collapse ">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1 text-left text-lg">N° Orden</th>
            <th className="border px-2 py-1 text-left text-lg">Nombres</th>
            <th className="border px-2 py-1 text-left text-lg">Fecha</th>
            <th className="border px-2 py-1 text-left text-lg">
              Fecha Actualización
            </th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, i) => (
              <tr
                key={i}
                className={`hover:bg-gray-50 cursor-pointer text-lg `}
                onClick={() => clicktable(row.norden)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  handlePrintConfirm(row.norden);
                }}
              >
                <td className="border px-2 py-1 font-bold">
                  {row.norden || ""}
                </td>
                <td className="border px-2 py-1">{row.nombres || ""}</td>
                <td className="border px-2 py-1">
                  {convertirFecha(row.fechaOf)}
                </td>
                <td className="border px-2 py-1">
                  {convertirFecha(row.fechaActualizacion)}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={5}
                className="text-center py-4 text-gray-500 text-lg"
              >
                No hay datos
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
