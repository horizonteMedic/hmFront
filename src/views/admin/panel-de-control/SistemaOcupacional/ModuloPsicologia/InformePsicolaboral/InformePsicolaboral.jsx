import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBrain,
  faUsers,
  faBroom,
  faPrint,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import { useForm } from "../../../../../hooks/useForm";
import { getToday } from "../../../../../utils/helpers";
import { useSessionData } from "../../../../../hooks/useSessionData";
import CriteriosPsicologicosI from "./TabsInformePsicolaboral/CriteriosPsicologicosI";
import CriteriosPsicologicosII from "./TabsInformePsicolaboral/CriteriosPsicologicosII";
import Swal from "sweetalert2";
import {
  InputTextArea, InputsBooleanRadioGroup, InputTextOneLine
} from "../../../../../components/reusableComponents/ResusableComponents";
import { PrintHojaR, SubmitDataService, VerifyTR } from "./controllerInformePsicolaboral";

const tabla = "informe_psicolaboral";
const today = getToday();

export default function InformePsicolaboral() {
  const [activeTab, setActiveTab] = useState(0);

  const { token, userlogued, selectedSede, datosFooter, userCompleto } =
    useSessionData();

  const initialFormState = {
    // Header
    norden: "",
    codigoInforme: null,
    fechaExam: today,
    tipoExamen: "",
    // Aptitud
    esApto: undefined,
    // Datos personales
    nombres: "",
    dni: "",
    edad: "",
    sexo: "",
    empresa: "",
    contrata: "",
    // Campos usados por la interfaz principal
    puestoPostula: "",
    puestoActual: "",

    dniUsuario: userCompleto?.datos?.dni_user ?? "",

    // ====================== CRITERIOS PSICOLÓGICOS I ======================
    // ASPECTO INTELECTUAL
    razonamientoProblemas: "", // I, NP1, NP, NPS, S
    memoria: "",
    atencionConcentracion: "",
    coordinacionVisoMotora: "",
    orientacionEspacial: "",
    comprensionVerbal: "",

    // ASPECTOS PERSONALIDAD
    estabilidadEmocional: "", // B, NPB, NP, NPA, A
    toleranciaFrustracion: "",
    autoestima: "",
    asertividad: "",
    ansiedadEstado: "",
    ansiedadRasgo: "",

    // ====================== CRITERIOS PSICOLÓGICOS II ======================
    // ASPECTOS CONDUCTUALES
    calidadSuenoEstres: "", // BAJO, PROMEDIO, ALTO
    nivelAlertaRiesgo: "",
    somnolencia: "",

    // ASPECTOS PSICOLABORALES
    capacidadInfluencia: "",// PD, NM, A, D, E
    adaptacionCambios: "",
    trabajoEquipoColaboracion: "",
    orientacionAccionMejoraProcesos: "",
    autonomiaProactividad: "",
    tomaDecisiones: "",
    crecimientoPersonal: "",

    motivacion: "",
    estresLaboral: "",

    // Observaciones y Recomendaciones
    observaciones: "",
    recomendaciones: "",
  };

  const {
    form,
    setForm,
    handleChange,
    handleChangeNumber,
    handleRadioButton,
    handleChangeSimple,
    handleRadioButtonBoolean,
    handleCheckBoxChange,
    handleClear,
    handleClearnotO,
    handlePrintDefault,
  } = useForm(initialFormState);

  const tabs = [
    { id: 0, name: "Criterios Psicológicos I", icon: faBrain, component: CriteriosPsicologicosI },
    { id: 1, name: "Criterios Psicológicos II", icon: faUsers, component: CriteriosPsicologicosII },
  ];

  const handleSave = () => {
    if (form.esApto === undefined) {
      Swal.fire({
        icon: "warning",
        title: "Advertencia",
        text: "Por favor, marque si es apto o no apto.",
      });
      return;
    }
    SubmitDataService(form, token, userlogued, handleClear, tabla, datosFooter);
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      handleClearnotO();
      VerifyTR(form.norden, tabla, token, setForm, selectedSede);
    }
  };

  const handlePrint = () => {
    handlePrintDefault(() => {
      PrintHojaR(form.norden, token, tabla, datosFooter);
    });
  };

  const ActiveComponent = tabs[activeTab]?.component || (() => null);

  return (
    <div className="mx-auto bg-white ">
      <div className="flex h-full">
        {/* Contenido principal - 100% */}
        <div className="w-full">
          <div className="w-full">
            {/* Datos del trabajador */}
            <section className="bg-white border border-gray-200 rounded-lg p-4 m-4 grid grid-cols-1 md:grid-cols-4 gap-4">
              <InputTextOneLine
                label="N° Orden"
                name="norden"
                value={form?.norden}
                onChange={handleChangeNumber}
                onKeyUp={handleSearch}
              />
              <InputTextOneLine
                label="Fecha"
                name="fechaExam"
                type="date"
                value={form?.fechaExam}
                onChange={handleChangeSimple}
              />
              <InputTextOneLine
                label="Tipo de Examen"
                name="tipoExamen"
                disabled
                onChange={handleChange}
              />
              <div className="flex gap-4 items-center">
                <h4 className="font-semibold min-w-[80px] max-w-[80px]">Aptitud:</h4>
                <InputsBooleanRadioGroup
                  name="esApto"
                  value={form.esApto}
                  trueLabel="APTO"
                  falseLabel="NO APTO"
                  onChange={handleRadioButtonBoolean}
                />
              </div>
            </section>

            {/* Información del trabajador */}
            <section className="bg-white border border-gray-200 rounded-lg p-4 m-4 gap-4">
              <h3 className="text-lg font-semibold mb-3">Datos del Paciente</h3>
              {/* Fila 1: Nombres, DNI, Edad, Género */}
              <div className="grid grid-cols-1 md:grid-cols-2  gap-3 mb-3">
                <InputTextOneLine
                  label="Nombres y Apellidos"
                  name="nombres"
                  value={form?.nombres}
                  disabled
                />
                <div className="grid grid-cols-3 gap-4">
                  <InputTextOneLine
                    label="DNI"
                    name="dni"
                    value={form?.dni}
                    disabled
                  />
                  <InputTextOneLine
                    label="Edad"
                    name="edad"
                    value={form?.edad}
                    disabled
                  />
                  <InputTextOneLine
                    label="Sexo"
                    name="sexo"
                    value={form?.sexo}
                    disabled
                  />
                </div>
                <InputTextOneLine
                  label="Empresa"
                  name="empresa"
                  value={form?.empresa}
                  disabled
                />
                <InputTextOneLine
                  label="Contrata"
                  name="contrata"
                  value={form?.contrata}
                  disabled
                />
                <InputTextOneLine
                  label="Area de Trabajo"
                  name="puestoPostula"
                  value={form?.puestoPostula}
                  disabled
                />
                <InputTextOneLine
                  label="Puesto de Trabajo"
                  name="puestoActual"
                  value={form?.puestoActual}
                  disabled
                />
              </div>
            </section>

            {/* Navegación de pestañas */}
            <nav className="flex bg-white border-b border-gray-200 sticky top-0 z-20">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`flex-1 px-4 py-3 uppercase tracking-wider text=[11px] border-b-4 transition-colors duration-200 cursor-pointer text-gray-700 hover:bg-gray-100 ${activeTab === tab.id
                    ? "border-[#233245] text-[#233245] font-semibold"
                    : "border-transparent"
                    }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <FontAwesomeIcon icon={tab.icon} className="mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
            {/* Contenido de la pestaña activa */}
            <div className="px-4 pt-4">
              <ActiveComponent
                form={form}
                handleChange={handleChange}
                handleChangeNumber={handleChangeNumber}
                handleCheckBoxChange={handleCheckBoxChange}
                handleRadioButtonBoolean={handleRadioButtonBoolean}
                handleRadioButton={handleRadioButton}
                handleChangeSimple={handleChangeSimple}
              />
            </div>
            {/* Observaciones */}
            <div className="mt-6 bg-white border border-gray-200 rounded-lg p-4 mx-4 grid gap-4 grid-cols-1 md:grid-cols-2">
              <InputTextArea
                label="Observaciones"
                name="observaciones"
                value={form?.observaciones}
                onChange={handleChange}
                rows={4}
                placeholder="Escriba sus observaciones aquí..."
              />
              <InputTextArea
                label="Recomendaciones"
                name="recomendaciones"
                value={form?.recomendaciones}
                onChange={handleChange}
                rows={4}
                placeholder="Escriba sus recomendaciones aquí..."
              />
            </div>

            <section className="flex flex-col md:flex-row justify-between items-center gap-4  px-4 pt-4">
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
                    className="bg-blue-600 hover:bg-blue-700 text-white text-base px-4 py-2 rounded flex items-center gap-2"
                  >
                    <FontAwesomeIcon icon={faPrint} />
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}