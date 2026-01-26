import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBrain,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { useForm } from "../../../../../../hooks/useForm";
import { getToday } from "../../../../../../utils/helpers";
import { useSessionData } from "../../../../../../hooks/useSessionData";
import CriteriosPsicologicosI from "./TabsInformePsicolaboral/CriteriosPsicologicosI";
import CriteriosPsicologicosII from "./TabsInformePsicolaboral/CriteriosPsicologicosII";
import Swal from "sweetalert2";
import {
  InputTextArea, InputsBooleanRadioGroup, InputTextOneLine,
  InputCheckbox
} from "../../../../../../components/reusableComponents/ResusableComponents";
import SectionFieldset from "../../../../../../components/reusableComponents/SectionFieldset";
import { PrintHojaR, SubmitDataService, VerifyTR } from "./controllerInformePsicolaboral";
import BotonesAccion from "../../../../../../components/templates/BotonesAccion";
import EmpleadoComboBox from "../../../../../../components/reusableComponents/EmpleadoComboBox";

const tabla = "informe_psicolaboral";

export default function InformePsicolaboral() {
  const today = getToday();
  const [activeTab, setActiveTab] = useState(0);

  const { token, userlogued, selectedSede, datosFooter, userDNI, userName } = useSessionData();

  const initialFormState = {
    // Header
    norden: "",
    codigoInforme: null,
    fechaExam: today,
    tipoExamen: "",
    // Aptitud
    esApto: undefined,
    anual: false,
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

    dniUsuario: userDNI,

    // ====================== CRITERIOS PSICOLÓGICOS I ======================
    // ASPECTO INTELECTUAL
    razonamientoProblemas: "", // I, NPI, NP, NPS, S
    memoria: "",
    atencionConcentracion: "",
    coordinacionVisoMotora: "",
    orientacionEspacial: "",
    comprensionVerbal: "",

    // ASPECTOS PERSONALIDAD
    estabilidadEmocional: "NP", // B, NPB, NP, NPA, A
    toleranciaFrustracion: "NP",
    autoestima: "NP",
    asertividad: "NP",
    ansiedadEstado: "NPB",
    ansiedadRasgo: "NPB",

    // ====================== CRITERIOS PSICOLÓGICOS II ======================
    // ASPECTOS CONDUCTUALES
    nivelAlerta: "", // BAJO, PROMEDIO, ALTO
    hostigamientoSexual: "",
    consecuencia: "",

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

    // Médico que Certifica //BUSCADOR
    nombre_medico: userName,
    user_medicoFirma: userlogued,

  };

  const {
    form,
    setForm,
    handleChange,
    handleChangeNumberDecimals,
    handleChangeNumber,
    handleRadioButton,
    handleChangeSimple,
    handleRadioButtonBoolean,
    handleCheckBoxChange,
    handleClear,
    handleClearnotO,
    handlePrintDefault,
  } = useForm(initialFormState, { storageKey: "informePsicolaboralPsicologia" });

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
    <div className="space-y-3 px-4 max-w-[90%]  xl:max-w-[80%] mx-auto">
      <SectionFieldset legend="Información del Examen" className="m-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3">
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
            value={form?.tipoExamen}
            disabled
            onChange={handleChange}
          />
          <InputsBooleanRadioGroup
            label="Aptitud"
            name="esApto"
            value={form.esApto}
            trueLabel="APTO"
            falseLabel="NO APTO"
            onChange={handleRadioButtonBoolean}
          />
          <InputCheckbox
            label={<p className="text-red-500 text-[10px]">Examen Anual</p>}
            name="anual"
            checked={form?.anual}
          // onChange={handleCheckBoxChange}
          />
        </div>
      </SectionFieldset>

      <SectionFieldset legend="Datos del Paciente" className="m-4">
        {/* Fila 1: Nombres, DNI, Edad, Género */}
        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-x-4 gap-y-3">
          <InputTextOneLine
            label="Nombres y Apellidos"
            name="nombres"
            value={form?.nombres}
            disabled
          />
          <div className="grid 2xl:grid-cols-3 gap-4">
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
      </SectionFieldset>

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
      <ActiveComponent
        form={form}
        handleChange={handleChange}
        handleChangeNumber={handleChangeNumber}
        handleCheckBoxChange={handleCheckBoxChange}
        handleRadioButtonBoolean={handleRadioButtonBoolean}
        handleRadioButton={handleRadioButton}
        handleChangeSimple={handleChangeSimple}
      />
      <SectionFieldset legend="Observaciones y Recomendaciones" className="grid gap-x-4 gap-y-3 grid-cols-1 md:grid-cols-2">
        <InputTextArea
          label="Observaciones"
          name="observaciones"
          value={form?.observaciones}
          onChange={handleChange}
          rows={4}
        />
        <InputTextArea
          label="Recomendaciones"
          name="recomendaciones"
          value={form?.recomendaciones}
          onChange={handleChange}
          rows={4}
        />
      </SectionFieldset>

      <SectionFieldset legend="Asignación de Médico">
        <EmpleadoComboBox
          value={form.nombre_medico}
          label="Especialista"
          form={form}
          onChange={handleChangeSimple}
        />
      </SectionFieldset>

      <BotonesAccion
        form={form}
        handleSave={handleSave}
        handleClear={handleClear}
        handlePrint={handlePrint}
        handleChangeNumberDecimals={handleChangeNumberDecimals}
      />
    </div>
  );
}