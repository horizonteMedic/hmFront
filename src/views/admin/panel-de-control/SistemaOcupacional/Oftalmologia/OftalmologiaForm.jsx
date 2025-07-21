import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSave,
  faBroom,
  faEdit,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import ModalLevantarObservacion from "./ModalLevantarObservacion";

const tabla = "funcion_abs";
const date = new Date();
const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
  2,
  "0"
)}-${String(date.getDate()).padStart(2, "0")}`;

const initialForm = {
  norden: "",
  fechaExamen: today,
  examenMedico: "",
  fechaNacimiento: "",
  dni: "",
  nombres: "",
  apellidos: "",
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
  normal: false,
  conservado: false,
  ninguna: false,
  enfOculares: "",
  pterigDerec: false,
  pterigIzq: false,
  pterigBilateral: false,
  normalGeneral: false,
  agudezaLejos: "",
};

export default function OftalmologiaForm() {
  const [form, setForm] = useState(initialForm);
  const [showModal, setShowModal] = useState(false);

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setField(name, type === "checkbox" ? checked : value);
  };

  const handleClear = () => {
    setForm(initialForm);
  };

  const handleSave = () => {
    // Aquí se integrará con la API en el futuro
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
              value={form.norden}
              onChange={handleInputChange}
              className="border rounded px-2 py-1 w-32 "
            />
            <label className="font-semibold ml-4">Fecha de Examen :</label>
            <input
              name="fechaExamen"
              type="date"
              value={form.fechaExamen}
              onChange={handleInputChange}
              className="border rounded px-2 py-1 w-40"
            />
            <div className="flex gap-4  flex-1 justify-center items-center ">
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="px-3 h-[22px] bg-green-200 hover:bg-green-300 rounded flex items-center w-full  justify-center "
              >
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="mr-2 text-green-800"
                />
                <p className="">LEVANTAR OBSERVACION</p>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-2">
            <div>
              <label className="font-semibold">Examen Médico :</label>
              <input
                name="examenMedico"
                value={form.examenMedico}
                onChange={handleInputChange}
                className="border rounded px-2 py-1 w-full"
              />
            </div>
            <div>
              <label className="font-semibold">Fecha Nacimiento :</label>
              <input
                name="fechaNacimiento"
                type="date"
                value={form.fechaNacimiento}
                onChange={handleInputChange}
                className="border rounded px-2 py-1 w-full"
              />
            </div>
            <div>
              <label className="font-semibold">DNI :</label>
              <input
                name="dni"
                value={form.dni}
                onChange={handleInputChange}
                className="border rounded px-2 py-1 w-full"
              />
            </div>
            <div></div>
            <div>
              <label className="font-semibold">Nombres :</label>
              <input
                name="nombres"
                value={form.nombres}
                onChange={handleInputChange}
                className="border rounded px-2 py-1 w-full"
              />
            </div>
            <div>
              <label className="font-semibold">Apellidos :</label>
              <input
                name="apellidos"
                value={form.apellidos}
                onChange={handleInputChange}
                className="border rounded px-2 py-1 w-full"
              />
            </div>
            <div>
              <label className="font-semibold">Empresa :</label>
              <input
                name="empresa"
                value={form.empresa}
                onChange={handleInputChange}
                className="border rounded px-2 py-1 w-full"
              />
            </div>
            <div>
              <label className="font-semibold">Contrata :</label>
              <input
                name="contrata"
                value={form.contrata}
                onChange={handleInputChange}
                className="border rounded px-2 py-1 w-full"
              />
            </div>
          </div>
          {/* Sección de visión */}
          <div className="border rounded p-4 bg-gray-50 mb-2">
            <div className="grid grid-cols-5 gap-2 mb-2 text-center font-semibold">
              <div></div>
              <div colSpan={2}>Sin Corregir</div>
              <div colSpan={2}>Corregida</div>
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
                value={form.visionCercaOD}
                onChange={handleInputChange}
                className="border rounded px-2 py-1"
              />
              <input
                name="visionCercaOI"
                value={form.visionCercaOI}
                onChange={handleInputChange}
                className="border rounded px-2 py-1"
              />
              <input
                name="visionCercaODC"
                value={form.visionCercaODC}
                onChange={handleInputChange}
                className="border rounded px-2 py-1"
              />
              <input
                name="visionCercaOIC"
                value={form.visionCercaOIC}
                onChange={handleInputChange}
                className="border rounded px-2 py-1"
              />
            </div>
            {/* Visión de Lejos */}
            <div className="grid grid-cols-5 gap-2 mb-1 items-center">
              <label className="text-right pr-2">Visión de Lejos :</label>
              <input
                name="visionLejosOD"
                value={form.visionLejosOD}
                onChange={handleInputChange}
                className="border rounded px-2 py-1"
              />
              <input
                name="visionLejosOI"
                value={form.visionLejosOI}
                onChange={handleInputChange}
                className="border rounded px-2 py-1"
              />
              <input
                name="visionLejosODC"
                value={form.visionLejosODC}
                onChange={handleInputChange}
                className="border rounded px-2 py-1"
              />
              <input
                name="visionLejosOIC"
                value={form.visionLejosOIC}
                onChange={handleInputChange}
                className="border rounded px-2 py-1"
              />
            </div>
            {/* Visión de Colores */}
            <div className="grid grid-cols-5 gap-2 mb-1 items-center">
              <label className="text-right pr-2">Visión de Colores :</label>
              <input
                name="visionColores"
                value={form.visionColores}
                onChange={handleInputChange}
                className="border rounded px-2 py-1 col-span-2"
              />
              <div className="col-span-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  name="normal"
                  checked={form.normal}
                  onChange={handleInputChange}
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
                value={form.visionBinocular}
                onChange={handleInputChange}
                className="border rounded px-2 py-1 col-span-2"
              />
              <div className="col-span-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  name="conservado"
                  checked={form.conservado}
                  onChange={handleInputChange}
                  className="mr-1"
                />{" "}
                Conservado
              </div>
            </div>
            {/* Reflejos Pupilares */}
            <div className="grid grid-cols-5 gap-2 mb-1 items-center">
              <label className="text-right pr-2">Reflejos Pupilares :</label>
              <input
                name="reflejosPupilares"
                value={form.reflejosPupilares}
                onChange={handleInputChange}
                className="border rounded px-2 py-1 col-span-2"
              />
              <div className="col-span-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  name="ninguna"
                  checked={form.ninguna}
                  onChange={handleInputChange}
                  className="mr-1"
                />{" "}
                Ninguna
              </div>
            </div>
            {/* Enfermedades Oculares */}
            <div className="grid grid-cols-5 gap-2 mb-1 items-center">
              <label className="text-right pr-2">Enferm.Oculares :</label>
              <input
                name="enfOculares"
                value={form.enfOculares}
                onChange={handleInputChange}
                className="border rounded px-2 py-1 col-span-2"
              />
              <div className="col-span-2 flex flex-row items-center gap-6 text-black">
                <label className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    name="pterigDerec"
                    checked={form.pterigDerec}
                    onChange={handleInputChange}
                  />{" "}
                  PTERIG.OJO DEREC
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    name="pterigIzq"
                    checked={form.pterigIzq}
                    onChange={handleInputChange}
                  />{" "}
                  PTERIG. OJO IZQ
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    name="pterigBilateral"
                    checked={form.pterigBilateral}
                    onChange={handleInputChange}
                  />{" "}
                  PTERIG. BILATERAL
                </label>
              </div>
            </div>
          </div>
          {/* Normal y Agudeza visual de lejos */}
          <div className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              name="normalGeneral"
              checked={form.normalGeneral}
              onChange={handleInputChange}
              className="mr-1"
            />{" "}
            Normal
          </div>
          <div className="mb-2">
            <label className="font-semibold">Agudeza visual de lejos:</label>
            <input
              name="agudezaLejos"
              value={form.agudezaLejos}
              onChange={handleInputChange}
              className="border rounded px-2 py-1 w-full"
            />
          </div>
          {/* Botones */}
          <div className="flex gap-4 justify-center mt-4">
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
        <div className="flex gap-2 mb-2">
          <label className="font-semibold">Nombre :</label>
          <input className="border rounded px-2 py-1 flex-1" />
          <label className="font-semibold ml-2">Codigo:</label>
          <input className="border rounded px-2 py-1 w-20" />
        </div>
        <div className="mb-2">
          <div className="font-semibold border-b">Agregados Recientemente</div>
          <div className="border rounded bg-white min-h-[120px] h-32 mt-1 mb-2"></div>
        </div>
        <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-4 py-2 rounded shadow border border-gray-300 mt-auto">
          VER HISTORIAL
        </button>
      </div>
      {/* Modal para levantar observación */}
      {showModal && (
        <ModalLevantarObservacion
          onClose={() => setShowModal(false)}
          datos={form}
        />
      )}
    </div>
  );
}

function Button({ onClick, color, icon, children }) {
  const bg =
    color === "green"
      ? "bg-green-600 hover:bg-green-700"
      : "bg-yellow-400 hover:bg-yellow-500";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${bg} text-white px-3 py-1 rounded inline-flex items-center gap-2 text-sm`}
    >
      <FontAwesomeIcon icon={icon} />
      {children}
    </button>
  );
}
