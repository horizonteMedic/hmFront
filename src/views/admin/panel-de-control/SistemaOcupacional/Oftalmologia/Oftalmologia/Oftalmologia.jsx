import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBroom,
  faChevronDown,
  faDownload,
  faPrint,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import {
  handleSubirArchivo,
  PrintHojaR,
  ReadArchivosForm,
  SubmitDataService,
  VerifyTR,
} from "./controllerOftalmologia";
import Swal from "sweetalert2";
import { getToday } from "../../../../../utils/helpers";
import ButtonsPDF from "../../../../../components/reusableComponents/ButtonsPDF";
import { useSessionData } from "../../../../../hooks/useSessionData";
import EmpleadoComboBox from "../../../../../components/reusableComponents/EmpleadoComboBox";
import SectionFieldset from "../../../../../components/reusableComponents/SectionFieldset";

const tabla = "oftalmologia2021";

export default function OftalmologiaOhla() {
  const { token, userlogued, selectedSede, userName } = useSessionData();
  const today = getToday();

  const initialFormState = {
    norden: "",
    codOf: null,
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
    odsfL: "-",
    odcilL: "-",
    odejeL: "-",

    oisfL: "-",
    oicilL: "-",
    oiejeL: "-",
    dipL: "-",

    odsfC: "-",
    odcilC: "-",
    odejeC: "-",

    oisfC: "-",
    oicilC: "-",
    oiejeC: "-",
    dipC: "-",

    agudezaOdLejos: "00",
    agudezaOiLejos: "00",
    agudezaOdCerca: "00",
    agudezaOiCerca: "00",
    diagnostico: "",

    ninguna: false,
    usoCorrectoresCerca: false,
    usoCorrectoresLejos: false,
    lentesCorrectoresCerca: false,
    lentesCorrectoresLejos: false,
    lentesCambioLunas: false,
    indicacionPterigion: false,
    indicacionOtras: false,

    noRestringeActividades: false,
    restriccionCorrectorLejos: false,
    restriccionCorrectorCerca: false,
    noTrabajosCableElectrico: false,
    noConduccion: false,

    vc_sinc_od: "00",
    vc_sinc_oi: "00",
    vc_conc_od: "00",
    vc_conc_oi: "00",
    vc_agujero_od: "00",
    vc_agujero_oi: "00",
    vl_sinc_od: "00",
    vl_sinc_oi: "00",
    vl_conc_od: "00",
    vl_conc_oi: "00",
    vl_agujero_od: "00",
    vl_agujero_oi: "00",
    bino_sinc: "00",
    bino_conc: "00",
    reflejos_pupilares: "",

    ptosisPalpebralOd: false,
    ptosisPalpebralOi: false,
    pterigionGradoOd: false,
    pterigionGradoOi: false,

    estrabismoOd: false,
    estrabismoOi: false,
    pingueculaOd: false,
    pingueculaOi: false,

    conjuntivitisOd: false,
    conjuntivitisOi: false,
    chalazionOd: false,
    chalazionOi: false,

    cataratasOd: false,
    cataratasOi: false,
    otrosOd: false,
    otrosOi: false,
    examenClinicoHallazgos: "",

    SubirDoc: false,
    nomenclatura: "OFTALMOLOGIA VISION TESTER",

    // Médico que Certifica //BUSCADOR
    nombre_medico: userName,
    user_medicoFirma: userlogued,

    nombre_doctorAsignado: "",
    user_doctorAsignado: "",

  };
  const [form, setForm] = useState(initialFormState);
  const [tab, setTab] = useState(0);

  const [visualerOpen, setVisualerOpen] = useState(null)

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
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value == "" ? "00" : value }));
  };
  const handleClear = () => {
    setForm(initialFormState);
  };
  const handleClearnotO = () => {
    setForm((prev) => ({ ...initialFormState, norden: prev.norden }));
  };
  const handleSearch = (e) => {
    if (e.key === "Enter") {
      handleClearnotO();
      VerifyTR(form.norden, tabla, token, setForm, selectedSede);
    }
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
      <div className=" p-4 rounded w-full border mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 items-center gap-3 w-full">
          {/* Primera fila: solo los 4 campos principales */}
          <div className="flex items-center gap-4">
            <label className="font-semibold min-w-[65px]">N° Orden :</label>
            <input
              className="border rounded px-2 py-1 w-full"
              name="norden"
              value={form.norden || ""}
              onKeyUp={handleSearch}
              onChange={handleChangeNumber}
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
          <div className="flex items-center gap-4 xl:col-span-3">
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
          <div className="flex items-center gap-4 xl:col-span-2">
            <label className="font-semibold min-w-[65px]">Empresa :</label>
            <input
              className="border rounded px-2 py-1 w-full"
              name="empresa"
              value={form.empresa || ""}
              disabled
            />
          </div>
          <div className="flex items-center gap-4 xl:col-span-2">
            <label className="font-semibold min-w-[65px]">Contrata :</label>
            <input
              className="border rounded px-2 py-1 w-full"
              name="contrata"
              value={form.contrata || ""}
              disabled
            />
          </div>
          {form.SubirDoc &&
            <ButtonsPDF
              handleSave={() => { handleSubirArchivo(form, selectedSede, userlogued, token) }}
              handleRead={() => { ReadArchivosForm(form, setVisualerOpen, token) }}
            />
          }
        </div>
      </div>
      {/* Tabs */}
      <div className="flex gap-1">
        <button
          onClick={() => setTab(0)}
          className={`px-6 py-2 border rounded-t-lg transition duration-150 text-base font-semibold focus:outline-none flex items-center whitespace-nowrap ${tab === 0
            ? "bg-[#233245] text-white font-bold"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            } ${tab === 0 ? "border-b-0" : "border-b"}`}
        >
          PARTE I
        </button>
        <button
          onClick={() => setTab(1)}
          className={`px-6 py-2 border rounded-t-lg transition duration-150 text-base font-semibold focus:outline-none flex items-center whitespace-nowrap ${tab === 1
            ? "bg-[#233245] text-white font-bold"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            } ${tab === 1 ? "border-b-0" : "border-b"}`}
        >
          PARTE II
        </button>
        <button
          onClick={() => setTab(2)}
          className={`px-6 py-2 border rounded-t-lg transition duration-150 text-base font-semibold focus:outline-none flex items-center whitespace-nowrap ${tab === 2
            ? "bg-[#233245] text-white font-bold"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            } ${tab === 2 ? "border-b-0" : "border-b"}`}
        >
          PARTE III
        </button>
      </div>
      {/* Contenido de los tabs */}
      <div className="bg-white border  rounded-b-lg p-6 ">
        {tab === 0 && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Columna 1: Todo el bloque oftalmológico */}
            <div className="space-y-6 flex flex-col">
              {/* Evaluación Oftalmológica */}
              <div className="border rounded p-4 flex-1">
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
              <div className="border rounded p-4 ">
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
              <div className="flex gap-4 flex-1 flex-col md:flex-row">
                {/* PIO */}
                <div className="border rounded p-4 flex flex-col md:max-w-[220px] w-full">
                  <div className="text-blue-700 font-semibold text-center mb-2">
                    PIO
                  </div>
                  <div className="flex flex-col gap-2 h-full items-center justify-center">
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
                <div className="border rounded p-4  flex-1 ">
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
                    className={`flex gap-16 border rounded p-3 ${form.correctorOcular === "NO"
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
                <div className="grid md:grid-cols-[260px_1fr] gap-x-2 gap-y-1">
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
                      disabled={form.estereopsia != "ANORMAL"}
                      className="border rounded px-2 py-1 text-[11px] w-32"
                    />
                    <label className="flex items-center gap-1 font-normal text-[11px] ">
                      <input
                        type="radio"
                        name="estereopsia"
                        className="text-[11px]"
                        checked={form.estereopsia === "NORMAL"}
                        onChange={(e) => {
                          handleRadioButton(e, "NORMAL");
                          setForm((prev) => ({
                            ...prev,
                            estereopsiaText: "",
                          }));
                        }}
                      />
                      Normal
                    </label>
                    <label className="flex items-center gap-1 font-normal text-[11px]">
                      <input
                        type="radio"
                        name="estereopsia"
                        className="text-[11px]"
                        checked={form.estereopsia === "ANORMAL"}
                        onChange={(e) => {
                          handleRadioButton(e, "ANORMAL");
                          setForm((prev) => ({
                            ...prev,
                            estereopsiaText: "",
                          }));
                        }}
                      />
                      Anormal
                    </label>
                    <label className="flex items-center gap-1 font-normal text-[11px]">
                      <input
                        type="radio"
                        name="estereopsia"
                        className="text-[11px]"
                        checked={form.estereopsia === "N.C."}
                        onChange={(e) => {
                          handleRadioButton(e, "N.C.");
                          setForm((prev) => ({
                            ...prev,
                            estereopsiaText: "",
                          }));
                        }}
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
                        onChange={(e) => {
                          handleRadioButton(e, "SI");
                          setForm((prev) => ({
                            ...prev,
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
                          }));
                        }}
                      />
                      Aplica
                    </label>
                    <label className="flex items-center gap-1 font-semibold text-[11px]">
                      <input
                        type="radio"
                        name="aplicaRefraccion"
                        checked={form.aplicaRefraccion === "NO"}
                        onChange={(e) => {
                          handleRadioButton(e, "NO");
                          setForm((prev) => ({
                            ...prev,
                            odsfL: "-",
                            odcilL: "-",
                            odejeL: "-",

                            oisfL: "-",
                            oicilL: "-",
                            oiejeL: "-",
                            dipL: "-",

                            odsfC: "-",
                            odcilC: "-",
                            odejeC: "-",

                            oisfC: "-",
                            oicilC: "-",
                            oiejeC: "-",
                            dipC: "-",
                          }));
                        }}
                      />
                      No Aplica
                    </label>
                  </div>
                </div>
                <div
                  className={`grid md:grid-cols-2 gap-4 ${form.aplicaRefraccion === "NO"
                    ? "opacity-50 pointer-events-none"
                    : ""
                    } `}
                >
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
                        disabled={form.aplicaRefraccion == "NO"}
                        onChange={handleChange}
                        onKeyUp={(e) => handleNextFocus(e, "odcilL")}
                        className="border rounded px-2 py-1"
                      />
                      <input
                        name="odcilL"
                        value={form.odcilL}
                        disabled={form.aplicaRefraccion == "NO"}
                        onChange={handleChange}
                        onKeyUp={(e) => handleNextFocus(e, "odejeL")}
                        className="border rounded px-2 py-1 "
                      />
                      <input
                        name="odejeL"
                        value={form.odejeL}
                        disabled={form.aplicaRefraccion == "NO"}
                        onChange={handleChange}
                        onKeyUp={(e) => handleNextFocus(e, "oisfL")}
                        className="border rounded px-2 py-1 "
                      />
                    </div>
                    <div className="grid grid-cols-4 gap-2 items-center mb-1">
                      <span className="font-semibold">OI</span>
                      <input
                        name="oisfL"
                        value={form.oisfL}
                        onChange={handleChange}
                        onKeyUp={(e) => handleNextFocus(e, "oicilL")}
                        className="border rounded px-2 py-1"
                      />
                      <input
                        name="oicilL"
                        value={form.oicilL}
                        onChange={handleChange}
                        disabled={form.aplicaRefraccion == "NO"}
                        onKeyUp={(e) => handleNextFocus(e, "oiejeL")}
                        className="border rounded px-2 py-1 "
                      />
                      <input
                        name="oiejeL"
                        value={form.oiejeL}
                        onChange={handleChange}
                        disabled={form.aplicaRefraccion == "NO"}
                        onKeyUp={(e) => handleNextFocus(e, "dipL")}
                        className="border rounded px-2 py-1 "
                      />
                    </div>
                    <div className="grid grid-cols-4 gap-2 items-center">
                      <span className=" font-semibold">DIP</span>
                      <input
                        name="dipL"
                        value={form.dipL}
                        onChange={handleChange}
                        disabled={form.aplicaRefraccion == "NO"}
                        onKeyUp={(e) => handleNextFocus(e, "odsfC")}
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
                        disabled={form.aplicaRefraccion == "NO"}
                        onKeyUp={(e) => handleNextFocus(e, "odcilC")}
                        className="border rounded px-2 py-1"
                      />
                      <input
                        name="odcilC"
                        value={form.odcilC}
                        onChange={handleChange}
                        disabled={form.aplicaRefraccion == "NO"}
                        onKeyUp={(e) => handleNextFocus(e, "odejeC")}
                        className="border rounded px-2 py-1 "
                      />
                      <input
                        name="odejeC"
                        value={form.odejeC}
                        onChange={handleChange}
                        disabled={form.aplicaRefraccion == "NO"}
                        onKeyUp={(e) => handleNextFocus(e, "oisfC")}
                        className="border rounded px-2 py-1 "
                      />
                    </div>
                    <div className="grid grid-cols-4 gap-2 items-center mb-1">
                      <span className="font-semibold">OI</span>
                      <input
                        name="oisfC"
                        value={form.oisfC}
                        onChange={handleChange}
                        disabled={form.aplicaRefraccion == "NO"}
                        onKeyUp={(e) => handleNextFocus(e, "oicilC")}
                        className="border rounded px-2 py-1"
                      />
                      <input
                        name="oicilC"
                        value={form.oicilC}
                        onChange={handleChange}
                        disabled={form.aplicaRefraccion == "NO"}
                        onKeyUp={(e) => handleNextFocus(e, "oiejeC")}
                        className="border rounded px-2 py-1 "
                      />
                      <input
                        name="oiejeC"
                        value={form.oiejeC}
                        onChange={handleChange}
                        disabled={form.aplicaRefraccion == "NO"}
                        onKeyUp={(e) => handleNextFocus(e, "dipC")}
                        className="border rounded px-2 py-1 "
                      />
                    </div>
                    <div className="grid grid-cols-4 gap-2 items-center">
                      <span className=" font-semibold">DIP</span>
                      <input
                        name="dipC"
                        value={form.dipC}
                        onChange={handleChange}
                        disabled={form.aplicaRefraccion == "NO"}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    onKeyUp={(e) => handleNextFocus(e, "agudezaOiLejos")}
                    className="border rounded px-2 py-1  col-span-2"
                  />
                  <input
                    name="agudezaOiLejos"
                    value={form.agudezaOiLejos}
                    onChange={handleChange}
                    onKeyUp={(e) => handleNextFocus(e, "agudezaOdCerca")}
                    className="border rounded px-2 py-1  col-span-2"
                  />
                </div>
                <div className="grid grid-cols-5 gap-3 items-center mb-3">
                  <span className="font-semibold">De Cerca</span>
                  <input
                    name="agudezaOdCerca"
                    value={form.agudezaOdCerca}
                    onChange={handleChange}
                    onKeyUp={(e) => handleNextFocus(e, "agudezaOiCerca")}
                    className="border rounded px-2 py-1 col-span-2"
                  />
                  <input
                    name="agudezaOiCerca"
                    value={form.agudezaOiCerca}
                    onChange={handleChange}
                    onKeyUp={(e) => handleNextFocus(e, "diagnostico")}
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
                  rows={8}
                  className="w-full  border rounded p-2 text-[11px] resize-none"
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
                      onChange={(e) => {
                        handleCheckBoxChange(e);
                        setForm((prev) => ({
                          ...prev,
                          usoCorrectoresCerca: false,
                          usoCorrectoresLejos: false,
                          lentesCorrectoresCerca: false,
                          lentesCorrectoresLejos: false,
                          lentesCambioLunas: false,
                          indicacionPterigion: false,
                          indicacionOtras: false,
                        }));
                      }}
                    />
                    Ninguna
                  </label>
                  <label className="flex gap-2 font-normal">
                    <input
                      type="checkbox"
                      name="usoCorrectoresCerca"
                      checked={form.usoCorrectoresCerca}
                      onChange={(e) => {
                        handleCheckBoxChange(e);
                        setForm((prev) => ({
                          ...prev,
                          ninguna: false,
                        }));
                      }}
                    />
                    Uso de Correctores Oculares Cerca
                  </label>
                  <label className="flex gap-2 font-normal">
                    <input
                      type="checkbox"
                      name="usoCorrectoresLejos"
                      checked={form.usoCorrectoresLejos}
                      onChange={(e) => {
                        handleCheckBoxChange(e);
                        setForm((prev) => ({
                          ...prev,
                          ninguna: false,
                        }));
                      }}
                    />
                    Uso de Correctores Oculares Lejos (Trabajos de Oficina)
                  </label>
                  <label className="flex gap-2 font-normal">
                    <input
                      type="checkbox"
                      name="lentesCorrectoresCerca"
                      checked={form.lentesCorrectoresCerca}
                      onChange={(e) => {
                        handleCheckBoxChange(e);
                        setForm((prev) => ({
                          ...prev,
                          ninguna: false,
                        }));
                      }}
                    />
                    Control complementario por Oftalmología : Lentes correctores
                    - Cerca
                  </label>
                  <label className="flex gap-2 font-normal">
                    <input
                      type="checkbox"
                      name="lentesCorrectoresLejos"
                      checked={form.lentesCorrectoresLejos}
                      onChange={(e) => {
                        handleCheckBoxChange(e);
                        setForm((prev) => ({
                          ...prev,
                          ninguna: false,
                        }));
                      }}
                    />
                    Control complementario por Oftalmología : Lentes correctores
                    - Lejos
                  </label>
                  <label className="flex gap-2 font-normal">
                    <input
                      type="checkbox"
                      name="lentesCambioLunas"
                      checked={form.lentesCambioLunas}
                      onChange={(e) => {
                        handleCheckBoxChange(e);
                        setForm((prev) => ({
                          ...prev,
                          ninguna: false,
                        }));
                      }}
                    />
                    Lentes: Cambio de Lunas
                  </label>
                  <label className="flex gap-2 font-normal">
                    <input
                      type="checkbox"
                      name="indicacionPterigion"
                      checked={form.indicacionPterigion}
                      onChange={(e) => {
                        handleCheckBoxChange(e);
                        setForm((prev) => ({
                          ...prev,
                          ninguna: false,
                        }));
                      }}
                    />
                    Pterigion III° - IV°
                  </label>
                  <label className="flex gap-2 font-normal">
                    <input
                      type="checkbox"
                      name="indicacionOtras"
                      checked={form.indicacionOtras}
                      onChange={(e) => {
                        handleCheckBoxChange(e);
                        setForm((prev) => ({
                          ...prev,
                          ninguna: false,
                        }));
                      }}
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
                      onChange={(e) => {
                        handleCheckBoxChange(e);
                        setForm((prev) => ({
                          ...prev,
                          restriccionCorrectorLejos: false,
                          restriccionCorrectorCerca: false,
                          noTrabajosCableElectrico: false,
                          noConduccion: false,
                        }));
                      }}
                    />
                    No restringe actividades labores en el puesto de trabajo
                  </label>
                  <label className="flex gap-2 font-normal">
                    <input
                      type="checkbox"
                      name="restriccionCorrectorLejos"
                      checked={form.restriccionCorrectorLejos}
                      onChange={(e) => {
                        handleCheckBoxChange(e);
                        setForm((prev) => ({
                          ...prev,
                          noRestringeActividades: false,
                        }));
                      }}
                    />
                    Uso de Correctores Oculares - Lejos
                  </label>
                  <label className="flex gap-2 font-normal">
                    <input
                      type="checkbox"
                      name="restriccionCorrectorCerca"
                      checked={form.restriccionCorrectorCerca}
                      onChange={(e) => {
                        handleCheckBoxChange(e);
                        setForm((prev) => ({
                          ...prev,
                          noRestringeActividades: false,
                        }));
                      }}
                    />
                    Uso de Correctores Oculares - Cerca (Trabajos de Oficina)
                  </label>
                  <label className="flex gap-2 font-normal">
                    <input
                      type="checkbox"
                      name="noTrabajosCableElectrico"
                      checked={form.noTrabajosCableElectrico}
                      onChange={(e) => {
                        handleCheckBoxChange(e);
                        setForm((prev) => ({
                          ...prev,
                          noRestringeActividades: false,
                        }));
                      }}
                    />
                    No trabajos con cables eléctricos ni fibra óptica
                  </label>
                  <label className="flex gap-2 font-normal">
                    <input
                      type="checkbox"
                      name="noConduccion"
                      checked={form.noConduccion}
                      onChange={(e) => {
                        handleCheckBoxChange(e);
                        setForm((prev) => ({
                          ...prev,
                          noRestringeActividades: false,
                        }));
                      }}
                    />
                    No conducción vehicular
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
        {tab === 2 && (
          <div className="space-y-4">
            <div className="border rounded p-4 space-y-4  w-full">
              <div className="text-blue-700 font-semibold text-center mb-4">
                EXPOSICIÓN OCUPACIONAL
              </div>
              <div className="grid grid-cols-7 gap-4 items-center mb-1 ">
                <div className=""></div>
                <span className="text-center font-semibold col-span-2">
                  Sin Correctores
                </span>
                <span className="text-center font-semibold col-span-2">
                  Con Correctores
                </span>
                <span className="text-center font-semibold col-span-2">
                  Con Agujero Estenopeico
                </span>
              </div>
              <div className="grid grid-cols-7 gap-4 items-center mb-1">
                <div className=""></div>
                <span className="text-center font-semibold">O.D.</span>
                <span className="text-center font-semibold">O.I.</span>
                <span className="text-center font-semibold">O.D.</span>
                <span className="text-center font-semibold">O.I.</span>
                <span className="text-center font-semibold">O.D.</span>
                <span className="text-center font-semibold">O.I.</span>
              </div>
              <div className="grid grid-cols-7 gap-4 items-center mb-1">
                <span className="font-semibold">Visión de Cerca:</span>
                <input
                  name="vc_sinc_od"
                  value={form.vc_sinc_od}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onKeyUp={(e) => handleNextFocus(e, "vc_sinc_oi")}
                  className="border rounded px-2 py-1"
                />
                <input
                  name="vc_sinc_oi"
                  value={form.vc_sinc_oi}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onKeyUp={(e) => handleNextFocus(e, "vl_sinc_od")}
                  className="border rounded px-2 py-1"
                />
                <input
                  name="vc_conc_od"
                  value={form.vc_conc_od}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onKeyUp={(e) => handleNextFocus(e, "vc_conc_oi")}
                  className="border rounded px-2 py-1 "
                />
                <input
                  name="vc_conc_oi"
                  value={form.vc_conc_oi}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onKeyUp={(e) => handleNextFocus(e, "vl_conc_od")}
                  className="border rounded px-2 py-1 "
                />
                <input
                  name="vc_agujero_od"
                  value={form.vc_agujero_od}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onKeyUp={(e) => handleNextFocus(e, "vc_agujero_oi")}
                  className="border rounded px-2 py-1 "
                />
                <input
                  name="vc_agujero_oi"
                  value={form.vc_agujero_oi}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onKeyUp={(e) => handleNextFocus(e, "vl_agujero_od")}
                  className="border rounded px-2 py-1 "
                />
              </div>
              <div className="grid grid-cols-7 gap-4 items-center mb-1">
                <span className="font-semibold">Visión de Lejos:</span>
                <input
                  name="vl_sinc_od"
                  value={form.vl_sinc_od}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onKeyUp={(e) => handleNextFocus(e, "vl_sinc_oi")}
                  className="border rounded px-2 py-1"
                />
                <input
                  name="vl_sinc_oi"
                  value={form.vl_sinc_oi}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onKeyUp={(e) => handleNextFocus(e, "vc_conc_od")}
                  className="border rounded px-2 py-1"
                />
                <input
                  name="vl_conc_od"
                  value={form.vl_conc_od}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onKeyUp={(e) => handleNextFocus(e, "vl_conc_oi")}
                  className="border rounded px-2 py-1 "
                />
                <input
                  name="vl_conc_oi"
                  value={form.vl_conc_oi}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onKeyUp={(e) => handleNextFocus(e, "vc_agujero_od")}
                  className="border rounded px-2 py-1 "
                />
                <input
                  name="vl_agujero_od"
                  value={form.vl_agujero_od}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onKeyUp={(e) => handleNextFocus(e, "vl_agujero_oi")}
                  className="border rounded px-2 py-1 "
                />
                <input
                  name="vl_agujero_oi"
                  value={form.vl_agujero_oi}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onKeyUp={(e) => handleNextFocus(e, "bino_sinc")}
                  className="border rounded px-2 py-1 "
                />
              </div>
              <div className="grid grid-cols-7 gap-4 items-center">
                <span className="font-semibold">Binocular (Reev.):</span>
                <input
                  name="bino_sinc"
                  value={form.bino_sinc}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onKeyUp={(e) => handleNextFocus(e, "bino_conc")}
                  className="border rounded px-2 py-1 col-span-2"
                />
                <input
                  name="bino_conc"
                  value={form.bino_conc}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onKeyUp={(e) => handleNextFocus(e, "reflejos_pupilares")}
                  className="border rounded px-2 py-1 col-span-2"
                />
                <span className="font-semibold text-center">
                  Reflejos Pupilares:
                </span>
                <input
                  name="reflejos_pupilares"
                  value={form.reflejos_pupilares}
                  onChange={handleChange}
                  className="border rounded px-2 py-1 "
                />
              </div>
            </div>
            <div className="border rounded p-4 space-y-4  w-full">
              <div className="text-blue-700 font-semibold text-center mb-4">
                EXAMEN CLÍNICO EXTERNO
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 px-4">
                <CheckDualLabel
                  label="Ptosis Palpebral"
                  nameOd="ptosisPalpebralOd"
                  nameOi="ptosisPalpebralOi"
                  form={form}
                  onChange={handleCheckBoxChange}
                />
                <CheckDualLabel
                  label="Pterigion (Grado)"
                  nameOd="pterigionGradoOd"
                  nameOi="pterigionGradoOi"
                  form={form}
                  onChange={handleCheckBoxChange}
                />
                <CheckDualLabel
                  label="Estrabismo"
                  nameOd="estrabismoOd"
                  nameOi="estrabismoOi"
                  form={form}
                  onChange={handleCheckBoxChange}
                />
                <CheckDualLabel
                  label="Pinguécula"
                  nameOd="pingueculaOd"
                  nameOi="pingueculaOi"
                  form={form}
                  onChange={handleCheckBoxChange}
                />
                <CheckDualLabel
                  label="Conjuntivitis"
                  nameOd="conjuntivitisOd"
                  nameOi="conjuntivitisOi"
                  form={form}
                  onChange={handleCheckBoxChange}
                />
                <CheckDualLabel
                  label="Chalazion"
                  nameOd="chalazionOd"
                  nameOi="chalazionOi"
                  form={form}
                  onChange={handleCheckBoxChange}
                />
                <CheckDualLabel
                  label="Cataratas"
                  nameOd="cataratasOd"
                  nameOi="cataratasOi"
                  form={form}
                  onChange={handleCheckBoxChange}
                />
                <CheckDualLabel
                  label="Otros"
                  nameOd="otrosOd"
                  nameOi="otrosOi"
                  form={form}
                  onChange={handleCheckBoxChange}
                />
              </div>
              <div className="ml-6">
                <label className="font-semibold min-w-[65px] mb-1">
                  Hallazgos (describir):
                </label>
                <input
                  className="border rounded px-2 py-1 w-full"
                  name="examenClinicoHallazgos"
                  value={form.examenClinicoHallazgos || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        )}
        <SectionFieldset legend="Asignación de Médico">
          <EmpleadoComboBox
            value={form.nombre_medico}
            label="Especialista"
            form={form}
            onChange={handleChange}
          />
          <EmpleadoComboBox
            value={form.nombre_doctorAsignado}
            label="Doctor Asignado"
            form={form}
            onChange={handleChange}
            nameField="nombre_doctorAsignado"
            idField="user_doctorAsignado"
          />
        </SectionFieldset>
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
          {visualerOpen && (
            <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
              <div className="bg-white rounded-lg overflow-hidden overflow-y-auto shadow-xl w-[700px] h-[auto] max-h-[90%]">
                <div className="px-4 py-2 naranjabackgroud flex justify-between">
                  <h2 className="text-lg font-bold color-blanco">{visualerOpen.nombreArchivo}</h2>
                  <button onClick={() => setVisualerOpen(null)} className="text-xl text-white" style={{ fontSize: '23px' }}>×</button>
                </div>
                <div className="px-6 py-4  overflow-y-auto flex h-auto justify-center items-center">
                  <iframe src={`https://docs.google.com/gview?url=${encodeURIComponent(`${visualerOpen.mensaje}`)}&embedded=true`} type="application/pdf" className="h-[500px] w-[500px] max-w-full" />
                </div>
                <div className="flex justify-center">
                  <a href={visualerOpen.mensaje} download={visualerOpen.nombreArchivo} className="azul-btn font-bold py-2 px-4 rounded mb-4">
                    <FontAwesomeIcon icon={faDownload} className="mr-2" /> Descargar
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
const CheckDualLabel = ({ label, nameOd, nameOi, form, onChange }) => {
  return (
    <div className="flex items-center ">
      <span className="min-w-[120px] font-semibold">{label}</span>
      <input
        type="checkbox"
        id={nameOd}
        name={nameOd}
        checked={form[nameOd]}
        onChange={onChange}
      />
      <label className="ml-2 mr-4" htmlFor={nameOd}>
        OD
      </label>
      <input
        type="checkbox"
        name={nameOi}
        id={nameOi}
        checked={form[nameOi]}
        onChange={onChange}
      />
      <label className="ml-2" htmlFor={nameOi}>
        OI
      </label>
    </div>
  );
};

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
