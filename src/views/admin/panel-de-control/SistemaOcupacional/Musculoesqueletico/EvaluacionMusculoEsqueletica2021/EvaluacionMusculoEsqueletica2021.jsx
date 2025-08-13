import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBroom,
  faPrint,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import ExamenFisicoI2021 from "./ExamenFisicoI2021";
import ExamenFisicoII2021 from "./ExamenFisicoII2021";
import ExamenFisicoIII2021 from "./ExamenFisicoIII2021";
import ExamenFisicoIV2021 from "./ExamenFisicoIV2021";

const date = new Date();
const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
  2,
  "0"
)}-${String(date.getDate()).padStart(2, "0")}`;

const initialFormState = {
  norden: "",
  nombres: "",
  dni: "",
  areaTrabajo: "",
  edad: "",
  sexo: "",
  fecha: today,
  empresa: "",
  tiempoServicio: "",
  
  // Síntomas
  sintomas: "NO",
  cualesSintomas: "NINGUNO",
  
  // Uso de Faja Lumbar
  usoFajaLumbar: "NO",
  
  // Técnica de Levantamiento
  tecnicaLevantamiento: "NO",
  
  // Capacitación
  capacitacionLevantamiento: "NO",
  
  // PARTE 1: APTITUD ESPALDA
  flexFuerzaAbdomen: "",
  cadera: "",
  muslo: "",
  abdomenLateralI: "",
  totalAptitudEspalda: "",
  observacionesAptitudEspalda: "",
  
  // PARTE 1: RANGOS ARTICULARES
  abduccionHombro180: "",
  abduccionHombro60: "",
  rotacionExterna90: "",
  rotacionExternaHombroInterna: "",
  totalRangosArticulares: "",
  observacionesRangosArticulares: "",
  
  // Campos de dolor contra resistencia
  dolorAbduccionHombro180: "NO",
  dolorAbduccionHombro60: "NO",
  dolorRotacionExterna90: "NO",
  dolorRotacionExternaHombroInterna: "NO",
  
  // PARTE 2: COLUMNA VERTEBRAL
  desviacionEje: "",
  testAdams: "",
  dandy: "",
  lasegue: "",
  contracturaMuscular: "",
  cicatrizPostOperatoria: "",
  desviacionEjeDescripcion: "",
  testAdamsDescripcion: "",
  dandyDescripcion: "",
  lasegueDescripcion: "",
  contracturaMuscularDescripcion: "",
  cicatrizPostOperatoriaDescripcion: "",
  
  // PARTE 2: TESTS
  testJobeDerecha: "",
  testJobeIzquierda: "",
  testPatteDerecha: "",
  testPatteIzquierda: "",
  testGerberDerecha: "",
  testGerberIzquierda: "",
  palmUpTestDerecha: "",
  palmUpTestIzquierda: "",
  epicondilitisDerecha: "",
  epicondilitisIzquierda: "",
  epitrocleitisDerecha: "",
  epitrocleitisIzquierda: "",
  phalenDerecha: "",
  phalenIzquierda: "",
  phalenInvertidoDerecha: "",
  phalenInvertidoIzquierda: "",
  
  // PARTE 3: MANIOBRAS DE DESCARTE
  tinnelDerecha: "",
  tinnelIzquierda: "",
  finkelsTeinDerecha: "",
  finkelsTeinIzquierda: "",
  
  // PARTE 3: EVAL. DINAMICA - CADERA Y RODILLA
  abduccionCaderaDerecha: "",
  abduccionCaderaIzquierda: "",
  abduccionRodillaDerecha: "",
  abduccionRodillaIzquierda: "",
  aduccionCaderaDerecha: "",
  aduccionCaderaIzquierda: "",
  aduccionRodillaDerecha: "",
  aduccionRodillaIzquierda: "",
  flexionCaderaDerecha: "",
  flexionCaderaIzquierda: "",
  flexionRodillaDerecha: "",
  flexionRodillaIzquierda: "",
  extensionCaderaDerecha: "",
  extensionCaderaIzquierda: "",
  extensionRodillaDerecha: "",
  extensionRodillaIzquierda: "",
  rotacionExternaCaderaDerecha: "",
  rotacionExternaCaderaIzquierda: "",
  rotacionExternaRodillaDerecha: "",
  rotacionExternaRodillaIzquierda: "",
  rotacionInternaCaderaDerecha: "",
  rotacionInternaCaderaIzquierda: "",
  rotacionInternaRodillaDerecha: "",
  rotacionInternaRodillaIzquierda: "",
  irradiacionCaderaDerecha: "",
  irradiacionCaderaIzquierda: "",
  irradiacionRodillaDerecha: "",
  irradiacionRodillaIzquierda: "",
  altMasaMuscularCaderaDerecha: "",
  altMasaMuscularCaderaIzquierda: "",
  altMasaMuscularRodillaDerecha: "",
  altMasaMuscularRodillaIzquierda: "",
  
  // PARTE 4: EVAL. DINAMICA - TOBILLOS
  abduccionTobilloDerecho: "",
  abduccionTobilloIzquierdo: "",
  aduccionTobilloDerecho: "",
  aduccionTobilloIzquierdo: "",
  flexionTobilloDerecho: "",
  flexionTobilloIzquierdo: "",
  extensionTobilloDerecho: "",
  extensionTobilloIzquierdo: "",
  rotacionExternaTobilloDerecho: "",
  rotacionExternaTobilloIzquierdo: "",
  rotacionInternaTobilloDerecho: "",
  rotacionInternaTobilloIzquierdo: "",
  irradiacionTobilloDerecho: "",
  irradiacionTobilloIzquierdo: "",
  altMasaMuscularTobilloDerecho: "",
  altMasaMuscularTobilloIzquierdo: "",
};

const EvaluacionMusculoEsqueletica2021 = ({ token, selectedSede, userlogued }) => {
  const [form, setForm] = useState(initialFormState);

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

  const handleRadioButton = (e, value) => {
    const { name } = e.target;
    setForm((f) => ({
      ...f,
      [name]: value.toUpperCase(),
    }));
  };

  const handleClear = () => {
    setForm(initialFormState);
  };

  const handleSave = () => {
    // Aquí iría la función de guardado
    // SubmitDataService(form, token, userlogued, handleClear, tabla);
    Swal.fire("Éxito", "Datos guardados correctamente", "success");
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
        // Aquí iría la función de impresión
        // PrintHojaR(form.norden, token, tabla);
        Swal.fire("Éxito", "Reporte enviado a impresión", "success");
      }
    });
  };

  return (
    <div className="w-full text-[11px]">
      {/* Header Form */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-blue-900 mb-4 border-b-2 pb-2">
          Datos del Paciente
        </h2>
        <form className="p-4 rounded w-full border">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 items-center gap-3 w-full">
            {/* Primera fila: n° orden, nombres (largo), edad */}
            <div className="flex items-center gap-4">
              <label className="font-semibold min-w-[65px]">N° Orden :</label>
              <input
                className="border rounded px-2 py-1 w-100 bg-gray-100"
                name="norden"
                value={form.norden || ""}
                onChange={handleChangeNumber}
                disabled
              />
            </div>
            <div className="flex items-center gap-4 xl:col-span-2">
              <label className="font-semibold min-w-[65px]">Nombres :</label>
              <input
                className="border rounded px-2 py-1 w-full bg-gray-100"
                name="nombres"
                value={form.nombres || ""}
                onChange={handleChange}
                disabled
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="font-semibold min-w-[65px]">Edad :</label>
              <input
                className="border rounded px-2 py-1 w-100 bg-gray-100"
                name="edad"
                value={form.edad || ""}
                onChange={handleChangeNumber}
                disabled
              />
            </div>
            
            {/* Segunda fila: dni, fecha, sexo, t. servicio */}
            <div className="flex items-center gap-4">
              <label className="font-semibold min-w-[65px]">DNI :</label>
              <input
                className="border rounded px-2 py-1 w-100 bg-gray-100"
                name="dni"
                value={form.dni || ""}
                onChange={handleChange}
                disabled
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="font-semibold min-w-[65px]">Fecha :</label>
              <input
                type="date"
                className="border rounded px-2 py-1 w-100 bg-gray-100"
                name="fecha"
                value={form.fecha || ""}
                onChange={handleChange}
                disabled
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="font-semibold min-w-[65px]">Sexo :</label>
              <input
                className="border rounded px-2 py-1 w-100 bg-gray-100"
                name="sexo"
                value={form.sexo || ""}
                onChange={handleChange}
                disabled
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="font-semibold min-w-[65px]">T. Servicio :</label>
              <input
                className="border rounded px-2 py-1 w-100 bg-gray-100"
                name="tiempoServicio"
                value={form.tiempoServicio || ""}
                onChange={handleChangeNumber}
                disabled
              />
            </div>
            
            {/* Tercera fila: área trabajo (largo), empresa (largo) */}
            <div className="flex items-center gap-4 xl:col-span-2">
              <label className="font-semibold min-w-[65px]">Área Trabajo :</label>
              <input
                className="border rounded px-2 py-1 w-full bg-gray-100"
                name="areaTrabajo"
                value={form.areaTrabajo || ""}
                onChange={handleChange}
                disabled
              />
            </div>
            <div className="flex items-center gap-4 xl:col-span-2">
              <label className="font-semibold min-w-[65px]">Empresa :</label>
              <input
                className="border rounded px-2 py-1 w-full bg-gray-100"
                name="empresa"
                value={form.empresa || ""}
                onChange={handleChange}
                disabled
              />
            </div>
          </div>
        </form>
      </div>

      {/* PARTE 1: EXAMEN FÍSICO I */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-center text-blue-900 mb-4 border-b-2 pb-2">
          PARTE 1: EXAMEN FÍSICO I
        </h2>
        <ExamenFisicoI2021 
          form={form}
          handleRadioButton={handleRadioButton}
          handleChange={handleChange}
          handleChangeNumber={handleChangeNumber}
        />
      </div>

      {/* PARTE 2: EXAMEN FÍSICO II */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-center text-blue-900 mb-4 border-b-2 pb-2">
          PARTE 2: EXAMEN FÍSICO II
        </h2>
        <ExamenFisicoII2021 
          form={form}
          handleRadioButton={handleRadioButton}
          handleChange={handleChange}
          handleChangeNumber={handleChangeNumber}
        />
      </div>

      {/* PARTE 3: EXAMEN FÍSICO III */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-center text-blue-900 mb-4 border-b-2 pb-2">
          PARTE 3: EXAMEN FÍSICO III
        </h2>
        <ExamenFisicoIII2021 
          form={form}
          handleRadioButton={handleRadioButton}
          handleChange={handleChange}
          handleChangeNumber={handleChangeNumber}
        />
      </div>

      {/* PARTE 4: EXAMEN FÍSICO IV */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-center text-blue-900 mb-4 border-b-2 pb-2">
          PARTE 4: EXAMEN FÍSICO IV
        </h2>
        <ExamenFisicoIV2021 
          form={form}
          handleRadioButton={handleRadioButton}
          handleChange={handleChange}
          handleChangeNumber={handleChangeNumber}
        />
      </div>
      
      <div className="mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-4 pt-6">
          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleSave}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-base px-6 py-2 rounded flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faSave} /> Agregar/Actualizar
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
            <span className="font-bold italic text-base mb-1">IMPRIMIR</span>
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
                className="bg-blue-600 hover:bg-blue-700 text-white text-base px-6 py-2 rounded flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faPrint} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluacionMusculoEsqueletica2021;
