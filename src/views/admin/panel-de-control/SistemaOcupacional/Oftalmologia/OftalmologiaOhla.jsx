import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faL } from "@fortawesome/free-solid-svg-icons";

const tabla = "oftalmologia2021";
const date = new Date();
const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
  2,
  "0"
)}-${String(date.getDate()).padStart(2, "0")}`;

const initialFormState = {
  norden: "",
  fechaExam: today,
  nomExam: "",
  fechaNac: "",
  nombres: "",
  dni: "",
  empresa: "",
  contrata: "",

  parpadosYAnexos: "NORMAL",
  corneas: "NORMAL",
  otrosHallazgos: "NINGUNO",
  conjuntivas: "NORMAL",
  cristalino: "TRANSPARENTE",

  fondoNormalOD: false,
  fondoNormalOI: false,
  fondoAnormalOD: false,
  fondoAnormalOI: false,
  fondoHallazgos: "N/A",

  pioOd: "-",
  pioOi: "-",
  noAplica: "X",

  correctorOcular: "NO",
  correctorCerca: false,
  correctorLejos: false,
  noTrajocorrectorCerca: false,
  noTrajocorrectorLejos: false,

  antecedentesPersonales: "NO REFIERE",
  antecedentesFamiliares: "NO REFIERE",

  ishihara: "",
  coloresPuros: "",
  estereopsia: "",
  estereopsiaText: "",

  aplicaRefraccion: "NO",
  odsfL: "",
  odcilL: "",
  odejeL: "",

  oisfL: "",
  oicilL: "",
  oiejeL: "",
  dipL: "",

  odsfC: "",
  odcilC: "",
  odejeC: "",

  oisfC: "",
  oicilC: "",
  oiejeC: "",
  dipC: "",

  agudezaOdLejos: "",
  agudezaOiLejos: "",
  agudezaOdCerca: "",
  agudezaOiCerca: "",
  diagnostico: "",

  ninguna: true,
  usoCorrectoresCerca: true,
  usoCorrectoresLejos: true,
  lentesCorrectoresCerca: true,
  lentesCorrectoresLejos: true,
  lentesCambioLunas: true,
  indicacionPterigion: true,
  indicacionOtras: true,

  noRestringeActividades: true,
  restriccionCorrectorLejos: true,
  restriccionCorrectorCerca: true,
  noTrabajosCableElectrico: true,
  noConduccion: true,
};
export default function OftalmologiaOhla({ token, selectedSede, userlogued }) {
  const [form, setForm] = useState(initialFormState);
  const [tab, setTab] = useState(0);

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

  const handleRadioButton = (e, value) => {
    const { name } = e.target;
    setForm((f) => ({
      ...f,
      [name]: value.toUpperCase(),
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
        PrintHojaR(form.norden, token, tabla);
      }
    });
  };

  return (
    <div className="w-full text-[11px]">
      <form className=" p-4 rounded w-full border mb-4">
        <div className="grid grid-cols-4  items-center gap-3 w-full">
          {/* Primera fila: solo los 4 campos principales */}
          <div className="flex items-center gap-4">
            <label className="font-semibold min-w-[65px]">N° Orden :</label>
            <input
              className="border rounded px-2 py-1 w-full"
              name="norden"
              value={form.norden || ""}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="font-semibold min-w-[65px]">Fecha Ex :</label>
            <input
              type="date"
              className="border rounded px-2 py-1 w-full"
              name="fechaExam"
              value={form.fechaExam || ""}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="font-semibold min-w-[65px]">Ex. Médico :</label>
            <input
              className="border rounded px-2 py-1  w-full"
              name="nomExam"
              value={form.nomExam || ""}
              disabled
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="font-semibold min-w-[65px]">Fecha Nac :</label>
            <input
              className="border rounded px-2 py-1 w-full"
              name="fechaNac"
              value={form.fechaNac || ""}
              disabled
            />
          </div>
          {/* Segunda fila: Nombres, DNI */}
          <div className="flex items-center gap-4 col-span-3">
            <label className="font-semibold min-w-[65px]">Nombres :</label>
            <input
              className="border rounded px-2 py-1 w-full"
              name="nombres"
              value={form.nombres || ""}
              disabled
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="font-semibold min-w-[65px]">DNI :</label>
            <input
              className="border rounded px-2 py-1 w-full"
              name="dni"
              value={form.dni || ""}
              disabled
            />
          </div>
          {/* Tercera fila: Empresa, Contrata */}
          <div className="flex items-center gap-4 col-span-2">
            <label className="font-semibold min-w-[65px]">Empresa :</label>
            <input
              className="border rounded px-2 py-1 w-full"
              name="empresa"
              value={form.empresa || ""}
              disabled
            />
          </div>
          <div className="flex items-center gap-4 col-span-2">
            <label className="font-semibold min-w-[65px]">Contrata :</label>
            <input
              className="border rounded px-2 py-1 w-full"
              name="contrata"
              value={form.contrata || ""}
              disabled
            />
          </div>
        </div>
      </form>
      {/* Tabs */}
      <div className="flex border-b mb-2">
        <button
          onClick={() => setTab(0)}
          className={`px-4 py-2 font-semibold border-t border-l border-r rounded-t ${
            tab === 0 ? "bg-white" : "bg-gray-100"
          } ${tab === 0 ? "border-b-0" : "border-b"}`}
        >
          PARTE I
        </button>
        <button
          onClick={() => setTab(1)}
          className={`px-4 py-2 font-semibold border-t border-l border-r rounded-t ml-1 ${
            tab === 1 ? "bg-white" : "bg-gray-100"
          } ${tab === 1 ? "border-b-0" : "border-b"}`}
        >
          PARTE II
        </button>
        <button
          onClick={() => setTab(2)}
          className={`px-4 py-2 font-semibold border-t border-l border-r rounded-t ml-1 ${
            tab === 2 ? "bg-white" : "bg-gray-100"
          } ${tab === 2 ? "border-b-0" : "border-b"}`}
        >
          PARTE III
        </button>
      </div>
      {/* Contenido de los tabs */}
      <div className="bg-white border rounded-b p-6 oftalmo-13px">
        {tab === 0 && (
          <div className="grid grid-cols-2 gap-8">
            {/* Columna 1: Todo el bloque oftalmológico */}
            <div className="space-y-6">
              {/* Evaluación Oftalmológica */}
              <div className="border rounded p-4 ">
                <div className="text-blue-700 font-semibold text-center mb-2">
                  EVALUACIÓN OFTALMOLÓGICA
                </div>
                <div className="grid grid-cols-1 gap-y-3 gap-x-4  items-center">
                  <EditableSelect
                    label="Párpados y Anexos:"
                    name="parpadosYAnexos"
                    value={form.parpadosYAnexos}
                    onChange={handleChange}
                    options={["NORMAL", "ANORMAL"]}
                  />
                  <EditableSelect
                    label="Corneas:"
                    name="corneas"
                    value={form.corneas}
                    onChange={handleChange}
                    options={["NORMAL", "ANORMAL"]}
                  />
                  <EditableSelect
                    label="Otros Hallazgos:"
                    name="otrosHallazgos"
                    value={form.otrosHallazgos}
                    onChange={handleChange}
                    options={["NINGUNO"]}
                  />
                  <EditableSelect
                    label="Conjuntivas:"
                    name="conjuntivas"
                    value={form.conjuntivas}
                    onChange={handleChange}
                    options={["NORMAL", "ANORMAL"]}
                  />
                  <EditableSelect
                    label="Cristalino:"
                    name="cristalino"
                    value={form.cristalino}
                    onChange={handleChange}
                    options={["TRANSPARENTE", "CATARATA", "LENTE"]}
                  />
                </div>
              </div>
              {/* Fondo de Ojo */}
              <div className="border rounded p-4">
                <div className="text-blue-700 font-semibold text-center mb-2">
                  FONDO DE OJO
                </div>
                <div className="grid grid-cols-2">
                  <div className="flex gap-2 flex-col">
                    <div className="flex items-center gap-2 ">
                      <span className="min-w-[70px] font-semibold">Normal</span>
                      <input
                        type="checkbox"
                        name="fondoNormalOD"
                        className="ml-2 text-[11px]"
                        checked={form.fondoNormalOD}
                        onChange={handleCheckBoxChange}
                      />
                      <span className="ml-1 text-[11px]">OD</span>
                      <input
                        type="checkbox"
                        name="fondoNormalOI"
                        className="ml-4 text-[11px]"
                        checked={form.fondoNormalOI}
                        onChange={handleCheckBoxChange}
                      />
                      <span className="ml-1 text-[11px]">OI</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="min-w-[70px] font-semibold">
                        Anormal
                      </span>
                      <input
                        type="checkbox"
                        name="fondoAnormalOD"
                        checked={form.fondoAnormalOD}
                        onChange={handleCheckBoxChange}
                        className="ml-2 text-[11px]"
                      />
                      <span className="ml-1 text-[11px]">OD</span>
                      <input
                        type="checkbox"
                        name="fondoAnormalOI"
                        checked={form.fondoAnormalOI}
                        onChange={handleCheckBoxChange}
                        className="ml-4 text-[11px]"
                      />
                      <span className="ml-1 text-[11px]">OI</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <span className="font-semibold">Hallazgos</span>
                    <input
                      className="border rounded px-2 py-1  flex-1 min-w-[180px] text-[11px]"
                      name="fondoHallazgos"
                      value={form.fondoHallazgos}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              {/* PIO y Correctores Oculares */}
              <div className="flex gap-4 ">
                {/* PIO */}
                <div className="border rounded p-4  flex flex-col justify-between min-w-[180px] max-w-[220px] w-full">
                  <div className="text-blue-700 font-semibold text-center mb-2">
                    PIO
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-4">
                      <label className="font-semibold min-w-[60px]">OD</label>
                      <input
                        className="border rounded px-2 py-1 w-full"
                        name="pioOd"
                        value={form.pioOd || ""}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <label className="font-semibold min-w-[60px]">OI</label>
                      <input
                        className="border rounded px-2 py-1 w-full"
                        name="pioOi"
                        value={form.pioOi || ""}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <label className="font-semibold min-w-[60px]">
                        No Aplica
                      </label>
                      <input
                        className="border rounded px-2 py-1 w-full"
                        name="noAplica"
                        value={form.noAplica || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
                {/* Correctores Oculares */}
                <div className="border rounded p-4  flex-1 min-w-[320px] ">
                  <div className="text-blue-700 font-semibold text-center mb-2">
                    CORRECTORES OCULARES
                  </div>
                  <div className="flex items-center gap-6 mb-2 pl-4">
                    <label className="flex items-center gap-1 font-semibold text-[11px]">
                      <input
                        type="radio"
                        name="correctorOcular"
                        checked={form.correctorOcular === "SI"}
                        onChange={(e) => handleRadioButton(e, "SI")}
                        className="text-[11px]"
                      />
                      SI
                    </label>
                    <label className="flex items-center gap-1 font-semibold text-[11px]">
                      <input
                        type="radio"
                        name="correctorOcular"
                        checked={form.correctorOcular === "NO"}
                        onChange={(e) => {
                          handleRadioButton(e, "NO");
                          setForm((f) => ({
                            ...f,
                            correctorCerca: false,
                            correctorLejos: false,
                            noTrajocorrectorCerca: false,
                            noTrajocorrectorLejos: false,
                          }));
                        }}
                        className="text-[11px]"
                      />
                      NO
                    </label>
                  </div>
                  <div
                    className={`flex gap-16 border rounded p-3 ${
                      form.correctorOcular === "NO"
                        ? "opacity-50 pointer-events-none"
                        : ""
                    }`}
                  >
                    <div className="flex items-start gap-2 flex-col justify-start">
                      <label className="flex justify-center items-center gap-2">
                        <input
                          type="checkbox"
                          name="correctorCerca"
                          className=" text-[11px]"
                          checked={form.correctorCerca}
                          disabled={form.correctorOcular === "NO"}
                          onChange={handleCheckBoxChange}
                        />
                        Cerca
                      </label>
                      <label className="flex justify-center items-center gap-2">
                        <input
                          type="checkbox"
                          name="correctorLejos"
                          className=" text-[11px]"
                          checked={form.correctorLejos}
                          onChange={handleCheckBoxChange}
                          disabled={form.correctorOcular === "NO"}
                        />
                        Lejos
                      </label>
                    </div>
                    <div className="flex items-start gap-2 flex-col justify-start">
                      <label>Si tiene lentes y no los trajo</label>
                      <div className="flex border p-3 gap-4 rounded">
                        <label className="flex justify-center items-center gap-2">
                          <input
                            type="checkbox"
                            name="noTrajocorrectorCerca"
                            className=" text-[11px] "
                            checked={form.noTrajocorrectorCerca}
                            onChange={handleCheckBoxChange}
                            disabled={form.correctorOcular === "NO"}
                          />
                          No trajo corrector Cerca
                        </label>
                        <label className="flex justify-center items-center gap-2">
                          <input
                            type="checkbox"
                            name="noTrajocorrectorLejos"
                            className=" text-[11px] "
                            checked={form.noTrajocorrectorLejos}
                            onChange={handleCheckBoxChange}
                            disabled={form.correctorOcular === "NO"}
                          />
                          No trajo corrector Lejos
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Columna 2: Antecedentes, test, refracción */}
            <div className="space-y-6">
              <div className="border rounded p-4 mb-2">
                <div className="text-blue-700 font-semibold text-center mb-2">
                  ANTECEDENTES
                </div>
                <div className="flex flex-col gap-2 mb-3">
                  <span className="font-semibold">
                    Antecedentes personales importantes:
                  </span>
                  <input
                    className="border rounded px-3 py-1  flex-1 min-w-[180px] text-[11px]"
                    name="antecedentesPersonales"
                    value={form.antecedentesPersonales}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <span className="font-semibold">
                    Antecedentes familiares importantes:
                  </span>
                  <input
                    className="border rounded px-3 py-1  flex-1 min-w-[180px] text-[11px]"
                    name="antecedentesFamiliares"
                    value={form.antecedentesFamiliares}
                    onChange={handleChange}
                  />
                </div>
              </div>
              {/* Test de Evaluación Complementaria */}
              <div className="border rounded p-4">
                <div className="text-blue-700 font-semibold text-center mb-2">
                  TEST DE EVALUACIÓN COMPLEMENTARIA
                </div>
                <div className="grid grid-cols-[260px_1fr] gap-x-2 gap-y-1">
                  {/* Fila 1 */}
                  <span className="flex items-center h-8 text-[11px] font-semibold">
                    Test de Ishihara (Colores)
                  </span>
                  <div className="flex gap-6 items-center h-8">
                    <div className="w-32" />
                    <label className="flex items-center gap-1 font-normal text-[11px]">
                      <input
                        type="radio"
                        name="ishihara"
                        className="text-[11px]"
                        checked={form.ishihara === "NORMAL"}
                        onChange={(e) => handleRadioButton(e, "NORMAL")}
                      />
                      Normal
                    </label>
                    <label className="flex items-center gap-1 font-normal text-[11px]">
                      <input
                        type="radio"
                        name="ishihara"
                        className="text-[11px]"
                        checked={form.ishihara === "ANORMAL"}
                        onChange={(e) => handleRadioButton(e, "ANORMAL")}
                      />
                      Anormal
                    </label>
                    <label className="flex items-center gap-1 font-normal text-[11px]">
                      <input
                        type="radio"
                        name="ishihara"
                        className="text-[11px]"
                        checked={form.ishihara === "N.C."}
                        onChange={(e) => handleRadioButton(e, "N.C.")}
                      />
                      N.C.
                    </label>
                  </div>
                  {/* Fila 2 */}
                  <span className="flex items-center h-8 text-[11px] font-semibold">
                    Test de Colores Puros (Rojo-Amarillo-Verde)
                  </span>
                  <div className="flex gap-6 items-center h-8">
                    <div className="w-32" />
                    <label className="flex items-center gap-1 font-normal text-[11px]">
                      <input
                        type="radio"
                        name="coloresPuros"
                        className="text-[11px]"
                        checked={form.coloresPuros === "NORMAL"}
                        onChange={(e) => handleRadioButton(e, "NORMAL")}
                      />
                      Normal
                    </label>
                    <label className="flex items-center gap-1 font-normal text-[11px]">
                      <input
                        type="radio"
                        name="coloresPuros"
                        className="text-[11px]"
                        checked={form.coloresPuros === "ANORMAL"}
                        onChange={(e) => handleRadioButton(e, "ANORMAL")}
                      />
                      Anormal
                    </label>
                    <label className="flex items-center gap-1 font-normal text-[11px]">
                      <input
                        type="radio"
                        name="coloresPuros"
                        className="text-[11px]"
                        checked={form.coloresPuros === "N.C."}
                        onChange={(e) => handleRadioButton(e, "N.C.")}
                      />
                      N.C.
                    </label>
                  </div>
                  {/* Fila 3 */}
                  <span className="flex items-center h-8 text-[11px] font-semibold">
                    Estereopsia (Test Profundidad)
                  </span>
                  <div className="flex  gap-6 items-center h-8">
                    <input
                      name="estereopsiaText"
                      value={form.estereopsiaText}
                      onChange={handleChange}
                      className="border rounded px-2 py-1 text-[11px] w-32"
                    />
                    <label className="flex items-center gap-1 font-normal text-[11px] ">
                      <input
                        type="radio"
                        name="estereopsia"
                        className="text-[11px]"
                        checked={form.estereopsia === "NORMAL"}
                        onChange={(e) => handleRadioButton(e, "NORMAL")}
                      />
                      Normal
                    </label>
                    <label className="flex items-center gap-1 font-normal text-[11px]">
                      <input
                        type="radio"
                        name="estereopsia"
                        className="text-[11px]"
                        checked={form.estereopsia === "ANORMAL"}
                        onChange={(e) => handleRadioButton(e, "ANORMAL")}
                      />
                      Anormal
                    </label>
                    <label className="flex items-center gap-1 font-normal text-[11px]">
                      <input
                        type="radio"
                        name="estereopsia"
                        className="text-[11px]"
                        checked={form.estereopsia === "N.C."}
                        onChange={(e) => handleRadioButton(e, "N.C.")}
                      />
                      N.C.
                    </label>
                  </div>
                </div>
              </div>
              {/* Refracción */}
              <div className="border rounded p-4">
                <div className="text-blue-700 font-semibold text-center mb-2">
                  REFRACCIÓN
                </div>
                <div className="flex items-center gap-8 mb-2">
                  <div className="flex items-center gap-6 ml-4 mb-2">
                    <label className="flex items-center gap-1 font-semibold text-[11px]">
                      <input
                        type="radio"
                        name="aplicaRefraccion"
                        checked={form.aplicaRefraccion === "SI"}
                        onChange={(e) => handleRadioButton(e, "SI")}
                      />
                      Aplica
                    </label>
                    <label className="flex items-center gap-1 font-semibold text-[11px]">
                      <input
                        type="radio"
                        name="aplicaRefraccion"
                        checked={form.aplicaRefraccion === "NO"}
                        onChange={(e) => handleRadioButton(e, "NO")}
                      />
                      No Aplica
                    </label>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {/* De Lejos */}
                  <div className="border rounded p-4">
                    <div className="mb-4 font-bold">REFRACCIÓN DE LEJOS</div>
                    <div className="grid grid-cols-4 gap-2 items-center mb-1">
                      <div></div>
                      <span className="text-center font-semibold">SF</span>
                      <span className="text-center font-semibold">CIL</span>
                      <span className="text-center font-semibold">EJE</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 items-center mb-1">
                      <span className=" font-semibold">OD</span>
                      <input
                        name="odsfL"
                        value={form.odsfL}
                        onChange={handleChange}
                        className="border rounded px-2 py-1"
                      />
                      <input
                        name="odcilL"
                        value={form.odcilL}
                        onChange={handleChange}
                        className="border rounded px-2 py-1 "
                      />
                      <input
                        name="odejeL"
                        value={form.odejeL}
                        onChange={handleChange}
                        className="border rounded px-2 py-1 "
                      />
                    </div>
                    <div className="grid grid-cols-4 gap-2 items-center mb-1">
                      <span className="font-semibold">OI</span>
                      <input
                        name="oisfL"
                        value={form.oisfL}
                        onChange={handleChange}
                        className="border rounded px-2 py-1"
                      />
                      <input
                        name="oicilL"
                        value={form.oicilL}
                        onChange={handleChange}
                        className="border rounded px-2 py-1 "
                      />
                      <input
                        name="oiejeL"
                        value={form.oiejeL}
                        onChange={handleChange}
                        className="border rounded px-2 py-1 "
                      />
                    </div>
                    <div className="grid grid-cols-4 gap-2 items-center">
                      <span className=" font-semibold">DIP</span>
                      <input
                        name="dipL"
                        value={form.dipL}
                        onChange={handleChange}
                        className="border rounded px-2 py-1  col-span-2 "
                      />
                    </div>
                  </div>
                  {/* De Cerca */}
                  <div className="border rounded p-4">
                    <div className="font-bold mb-4">REFRACCIÓN DE CERCA</div>
                    <div className="grid grid-cols-4 gap-2 items-center mb-1">
                      <div></div>
                      <span className="text-center font-semibold">SF</span>
                      <span className="text-center font-semibold">CIL.</span>
                      <span className="text-center font-semibold">EJE</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 items-center mb-1">
                      <span className=" font-semibold">OD</span>
                      <input
                        name="odsfC"
                        value={form.odsfC}
                        onChange={handleChange}
                        className="border rounded px-2 py-1"
                      />
                      <input
                        name="odcilC"
                        value={form.odcilC}
                        onChange={handleChange}
                        className="border rounded px-2 py-1 "
                      />
                      <input
                        name="odejeC"
                        value={form.odejeC}
                        onChange={handleChange}
                        className="border rounded px-2 py-1 "
                      />
                    </div>
                    <div className="grid grid-cols-4 gap-2 items-center mb-1">
                      <span className="font-semibold">OI</span>
                      <input
                        name="oisfC"
                        value={form.oisfC}
                        onChange={handleChange}
                        className="border rounded px-2 py-1"
                      />
                      <input
                        name="oicilC"
                        value={form.oicilC}
                        onChange={handleChange}
                        className="border rounded px-2 py-1 "
                      />
                      <input
                        name="oiejeC"
                        value={form.oiejeC}
                        onChange={handleChange}
                        className="border rounded px-2 py-1 "
                      />
                    </div>
                    <div className="grid grid-cols-4 gap-2 items-center">
                      <span className=" font-semibold">DIP</span>
                      <input
                        name="dipC"
                        value={form.dipC}
                        onChange={handleChange}
                        className="border rounded px-2 py-1  col-span-2 "
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {tab === 1 && (
          <div className="grid grid-cols-2 gap-6">
            {/* Columna izquierda: Agudeza Visual y Diagnóstico */}
            <div>
              {/* Agudeza Visual Final */}
              <div className="border rounded p-4 ">
                <div className="text-blue-700 font-semibold text-center mb-4">
                  AGUDEZA VISUAL FINAL (CON REFRACCIÓN)
                </div>
                <div className="grid grid-cols-5 gap-3 items-center mb-3">
                  <div></div>
                  <span className="text-center font-semibold col-span-2">
                    OD
                  </span>
                  <span className="text-center font-semibold col-span-2">
                    OI
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-3 items-center mb-3">
                  <span className="font-semibold">De Lejos</span>
                  <input
                    name="agudezaOdLejos"
                    value={form.agudezaOdLejos}
                    onChange={handleChange}
                    className="border rounded px-2 py-1  col-span-2"
                  />
                  <input
                    name="agudezaOiLejos"
                    value={form.agudezaOiLejos}
                    onChange={handleChange}
                    className="border rounded px-2 py-1  col-span-2"
                  />
                </div>
                <div className="grid grid-cols-5 gap-3 items-center mb-3">
                  <span className="font-semibold">De Cerca</span>
                  <input
                    name="agudezaOdCerca"
                    value={form.agudezaOdCerca}
                    onChange={handleChange}
                    className="border rounded px-2 py-1 col-span-2"
                  />
                  <input
                    name="agudezaOiCerca"
                    value={form.agudezaOiCerca}
                    onChange={handleChange}
                    className="border rounded px-2 py-1 col-span-2"
                  />
                </div>
              </div>
              {/* Diagnóstico */}
              <div className="mt-2">
                <div className="font-semibold text-[11px] mb-1">
                  DIAGNÓSTICO
                </div>
                <textarea
                  name="diagnostico"
                  value={form.diagnostico}
                  onChange={handleChange}
                  className="w-full h-24 border rounded p-2 text-[11px] resize-none"
                />
              </div>
            </div>
            {/* Columna derecha: Indicaciones y Restricciones */}
            <div className="flex flex-col gap-4 ">
              {/* Indicaciones */}
              <div className="border rounded p-4 ">
                <div className="text-blue-700 font-semibold text-center mb-4">
                  INDICACIONES
                </div>
                <div className="flex flex-col gap-1 items-start">
                  <label className="flex gap-2 font-normal">
                    <input
                      type="checkbox"
                      name="ninguna"
                      checked={form.ninguna}
                      onChange={handleCheckBoxChange}
                    />
                    Ninguna
                  </label>
                  <label className="flex gap-2 font-normal">
                    <input
                      type="checkbox"
                      name="usoCorrectoresCerca"
                      checked={form.usoCorrectoresCerca}
                      onChange={handleCheckBoxChange}
                    />
                    Uso de Correctores Oculares Cerca
                  </label>
                  <label className="flex gap-2 font-normal">
                    <input
                      type="checkbox"
                      name="usoCorrectoresLejos"
                      checked={form.usoCorrectoresLejos}
                      onChange={handleCheckBoxChange}
                    />
                    Uso de Correctores Oculares Lejos (Trabajos de Oficina)
                  </label>
                  <label className="flex gap-2 font-normal">
                    <input
                      type="checkbox"
                      name="lentesCorrectoresCerca"
                      checked={form.lentesCorrectoresCerca}
                      onChange={handleCheckBoxChange}
                    />
                    Control complementario por Oftalmología : Lentes correctores
                    - Cerca
                  </label>
                  <label className="flex gap-2 font-normal">
                    <input
                      type="checkbox"
                      name="lentesCorrectoresLejos"
                      checked={form.lentesCorrectoresLejos}
                      onChange={handleCheckBoxChange}
                    />
                    Control complementario por Oftalmología : Lentes correctores
                    - Lejos
                  </label>
                  <label className="flex gap-2 font-normal">
                    <input
                      type="checkbox"
                      name="lentesCambioLunas"
                      checked={form.lentesCambioLunas}
                      onChange={handleCheckBoxChange}
                    />
                    Lentes: Cambio de Lunas
                  </label>
                  <label className="flex gap-2 font-normal">
                    <input
                      type="checkbox"
                      name="indicacionPterigion"
                      checked={form.indicacionPterigion}
                      onChange={handleCheckBoxChange}
                    />
                    Pterigion III° - IV°
                  </label>
                  <label className="flex gap-2 font-normal">
                    <input
                      type="checkbox"
                      name="indicacionOtras"
                      checked={form.indicacionOtras}
                      onChange={handleCheckBoxChange}
                    />
                    Otras
                  </label>
                </div>
              </div>
              {/* Restricciones */}
              <div className="border rounded p-4">
                <div className="text-blue-700 font-semibold text-center mb-4">
                  RESTRICCIONES (Aplican al entorno laboral)
                </div>
                <div className="flex flex-col gap-1">
                  <label className="flex gap-2 font-normal">
                    <input
                      type="checkbox"
                      name="noRestringeActividades"
                      checked={form.noRestringeActividades}
                      onChange={handleCheckBoxChange}
                    />
                    No restringe actividades labores en el puesto de trabajo
                  </label>
                  <label className="flex gap-2 font-normal">
                    <input
                      type="checkbox"
                      name="restriccionCorrectorLejos"
                      checked={form.restriccionCorrectorLejos}
                      onChange={handleCheckBoxChange}
                    />
                    Uso de Correctores Oculares - Lejos
                  </label>
                  <label className="flex gap-2 font-normal">
                    <input
                      type="checkbox"
                      name="restriccionCorrectorCerca"
                      checked={form.restriccionCorrectorCerca}
                      onChange={handleCheckBoxChange}
                    />
                    Uso de Correctores Oculares - Cerca (Trabajos de Oficina)
                  </label>
                  <label className="flex gap-2 font-normal">
                    <input
                      type="checkbox"
                      name="noTrabajosCableElectrico"
                      checked={form.noTrabajosCableElectrico}
                      onChange={handleCheckBoxChange}
                    />
                    No trabajos con cables eléctricos ni fibra óptica
                  </label>
                  <label className="flex gap-2 font-normal">
                    <input
                      type="checkbox"
                      name="noConduccion"
                      checked={form.noConduccion}
                      onChange={handleCheckBoxChange}
                    />
                    No conducción vehicular
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
        {tab == 2 && (
          <div className="border rounded p-4 bg-white w-full">
            <div className="text-[11px]">
              {/* Encabezados */}
              <div className="grid grid-cols-[180px_repeat(6,_80px)] gap-1 items-center mb-1">
                <div></div>
                <div className="col-span-2 text-center font-semibold">
                  Sin Correctores
                </div>
                <div className="col-span-2 text-center font-semibold">
                  Con Correctores
                </div>
                <div className="col-span-2 text-center font-semibold">
                  Con Agujero Estenopeico
                </div>
              </div>
              <div className="grid grid-cols-[180px_repeat(6,_80px)] gap-1 items-center mb-2">
                <div></div>
                <div className="text-center">O.D</div>
                <div className="text-center">O.I</div>
                <div className="text-center">O.D</div>
                <div className="text-center">O.I</div>
                <div className="text-center">O.D</div>
                <div className="text-center">O.I</div>
              </div>

              {/* Visión de Cerca */}
              <div className="grid grid-cols-[180px_repeat(6,_80px)] gap-1 items-center mb-1">
                <div className="whitespace-nowrap">Visión de Cerca :</div>
                {[...Array(6)].map((_, i) => (
                  <input
                    key={`vc-${i}`}
                    className="border border-gray-300 rounded px-2 py-1 text-[11px] bg-[#f5f5f5] text-center"
                  />
                ))}
              </div>

              {/* Visión de Lejos */}
              <div className="grid grid-cols-[180px_repeat(6,_80px)] gap-1 items-center mb-1">
                <div className="whitespace-nowrap">Visión de Lejos :</div>
                {[...Array(6)].map((_, i) => (
                  <input
                    key={`vl-${i}`}
                    className="border border-gray-300 rounded px-2 py-1 text-[11px] bg-[#f5f5f5] text-center"
                  />
                ))}
              </div>

              {/* Binocular + Reflejos Pupilares */}
              <div className="grid grid-cols-[180px_repeat(6,_80px)] gap-1 items-center">
                <div className="whitespace-nowrap">Binocular (Reev.)</div>
                <input className="border border-gray-300 rounded px-2 py-1 text-[11px] bg-[#f5f5f5] text-center" />
                <div></div>
                <input className="border border-gray-300 rounded px-2 py-1 text-[11px] bg-[#f5f5f5] text-center" />
                <div></div>
                <div className="text-right font-semibold whitespace-nowrap col-span-1">
                  Reflejos Pupilares :
                </div>
                <input className="border border-gray-300 rounded px-2 py-1 text-[11px] bg-[#f5f5f5] w-full" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const EditableSelect = ({ label, name, value, onChange, options = [] }) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  const handleSelect = (val) => {
    onChange({ target: { name, value: val } });
    setOpen(false);
  };

  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="flex">
      {label && <label className="block mb-1 w-[180px]">{label}</label>}
      <div className="relative w-full">
        <input
          name={name}
          value={value || ""}
          onChange={onChange}
          onFocus={() => setOpen(true)}
          className="appearance-none border rounded px-3 py-1 w-full"
          autoComplete="off"
        />
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
          <FontAwesomeIcon icon={faChevronDown} />
        </div>

        {open && (
          <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded shadow max-h-48 overflow-y-auto">
            {options.map((opt, idx) => (
              <li
                key={idx}
                className="px-3 py-1 hover:bg-blue-100 cursor-pointer"
                onMouseDown={() => handleSelect(opt)} // usar onMouseDown para evitar blur antes del click
              >
                {opt}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
