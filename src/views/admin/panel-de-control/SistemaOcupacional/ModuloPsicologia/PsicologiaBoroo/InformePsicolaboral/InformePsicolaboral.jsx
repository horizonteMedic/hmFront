import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBrain,
  faUsers,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import { useForm } from "../../../../../../hooks/useForm";
import { useSessionData } from "../../../../../../hooks/useSessionData";
import { useRegistroEditable } from "../../../../../../hooks/useRegistroEditable";
import { getToday, getFechaHoraActual } from "../../../../../../utils/helpers";
import { buildAuditoria } from "../../../../../../utils/auditoriaUtils";
import CriteriosPsicologicosI from "./TabsInformePsicolaboral/CriteriosPsicologicosI";
import CriteriosPsicologicosII from "./TabsInformePsicolaboral/CriteriosPsicologicosII";
import {
  InputTextArea, InputsBooleanRadioGroup, InputTextOneLine,
  InputCheckbox
} from "../../../../../../components/reusableComponents/ResusableComponents";
import SectionFieldset from "../../../../../../components/reusableComponents/SectionFieldset";
import SearchButton from "../../../../../../components/reusableComponents/SearchButton";
import RegistroEstadoPill from "../../../../../../components/reusableComponents/RegistroEstadoPill";
import AuditoriaRegistro from "../../../../../../components/reusableComponents/AuditoriaRegistro";
import { PrintHojaR, SubmitDataService, UpdateDataService, VerifyTR } from "./controllerInformePsicolaboral";
import BotonesForm from "../../../../../../components/templates/BotonesForm";
import EmpleadoComboBox from "../../../../../../components/reusableComponents/EmpleadoComboBox";
import DatosPersonalesLaborales from "../../../../../../components/templates/DatosPersonalesLaborales";

const tabla = "informe_psicolaboral";

// Campos que el usuario puede editar en este formulario (para resaltar/revertir cambios).
// Por el volumen de campos (~30 entre las 2 pestañas), el resaltado/revertido individual solo
// se aplica a los campos "core" de la sección principal; el resto de campos (criterios
// psicológicos en pestañas) solo respeta el bloqueo general (camposDeshabilitados).
const CAMPOS_EDITABLES = [
  "fechaExam",
  "esApto",
  "observaciones",
  "recomendaciones",
  "user_medicoFirma",
  "nombre_medico",
];

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

    // Control de UI: false = mostrar Guardar (nuevo) / true = mostrar Editar (ya existe)
    tieneRegistro: false,

    // Auditoría
    userRegistro: "",
    fechaRegistro: "",
    usuarioActualizacion: "",
    fechaActualizacion: "",
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

  const {
    edicionHabilitada,
    habilitarEdicion,
    camposDeshabilitados,
    isFieldEdited,
    revertField,
    revertFields,
  } = useRegistroEditable(form, setForm, { tieneRegistro: form.tieneRegistro, camposEditables: CAMPOS_EDITABLES });

  // El médico se compone de 2 campos (id de firma + nombre): se detecta el cambio por
  // el id y se revierten ambos en conjunto.
  const isMedicoEdited = isFieldEdited("user_medicoFirma");
  const revertMedico = () => revertFields(["user_medicoFirma", "nombre_medico"]);

  const tabs = [
    { id: 0, name: "Criterios Psicológicos I", icon: faBrain, component: CriteriosPsicologicosI },
    { id: 1, name: "Criterios Psicológicos II", icon: faUsers, component: CriteriosPsicologicosII },
  ];

  const handleSave = () => {
    SubmitDataService(form, token, userlogued, handleClear, tabla, datosFooter);
  };

  const handleEdit = () => {
    UpdateDataService(form, token, userlogued, handleClear, tabla, datosFooter);
  };

  // ===== Búsqueda con botón =====
  const executeSearch = () => {
    handleClearnotO();
    VerifyTR(form.norden, tabla, token, setForm, selectedSede);
  };

  // ===== Búsqueda con enter =====
  const handleSearch = (e) => {
    if (!e || e.key === "Enter") {
      executeSearch();
    }
  };

  const hayRegistroCargado = Boolean(form.nombres);

  const handlePrintNordenChange = (e) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return; // solo dígitos

    const hayDatosCargados = Boolean(form.nombres || form.tieneRegistro);
    if (hayDatosCargados && value !== form.norden) {
      setForm({ ...initialFormState, norden: value });
    } else {
      setForm((f) => ({ ...f, norden: value }));
    }
  };

  const handlePrint = () => {
    handlePrintDefault(() => {
      PrintHojaR(form.norden, token, tabla, datosFooter);
    });
  };

  const auditoria = buildAuditoria(form, {
    usuarioActual: userlogued,
    fechaHoraActual: getFechaHoraActual(),
  });

  const ActiveComponent = tabs[activeTab]?.component || (() => null);

  return (
    <div className="space-y-3 px-4 max-w-[90%]  xl:max-w-[80%] mx-auto">
      <div className="sticky top-2 z-20 flex justify-end pointer-events-none">
        <RegistroEstadoPill
          tieneRegistro={form.tieneRegistro}
          className={hayRegistroCargado ? "" : "invisible"}
        />
        {hayRegistroCargado && form.tieneRegistro && !edicionHabilitada && (
          <button
            type="button"
            onClick={habilitarEdicion}
            className="pointer-events-auto inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-3 py-1.5 rounded-full shadow-sm transition-all duration-150 ease-out hover:shadow-lg active:scale-95"
          >
            <FontAwesomeIcon icon={faEdit} /> Habilitar edición
          </button>
        )}
      </div>

      <SectionFieldset legend="Información del Examen" className="m-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3">
          <div className="flex gap-x-3 w-full">
            <InputTextOneLine
              label="N° Orden"
              name="norden"
              value={form?.norden}
              onChange={handleChangeNumber}
              onKeyUp={handleSearch}
              disabled={hayRegistroCargado}
              className="w-full"
            />
            <SearchButton onClick={executeSearch} className="md:hidden" />
          </div>
          <InputTextOneLine
            label="Fecha"
            name="fechaExam"
            type="date"
            value={form?.fechaExam}
            onChange={handleChangeSimple}
            disabled={camposDeshabilitados}
            edited={isFieldEdited("fechaExam")}
            onRevert={() => revertField("fechaExam")}
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
            disabled={camposDeshabilitados}
            edited={isFieldEdited("esApto")}
            onRevert={() => revertField("esApto")}
          />
          <InputCheckbox
            label={<p className="text-red-500 text-[10px]">Examen Anual</p>}
            name="anual"
            checked={form?.anual}
            onChange={handleCheckBoxChange}
          />
        </div>
      </SectionFieldset>

      <DatosPersonalesLaborales form={form}/>
      
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
        disabled={camposDeshabilitados}
      />
      <SectionFieldset legend="Observaciones y Recomendaciones" className="grid gap-x-4 gap-y-3 grid-cols-1 md:grid-cols-2">
        <InputTextArea
          label="Observaciones"
          name="observaciones"
          value={form?.observaciones}
          onChange={handleChange}
          rows={4}
          disabled={camposDeshabilitados}
          edited={isFieldEdited("observaciones")}
          onRevert={() => revertField("observaciones")}
        />
        <InputTextArea
          label="Recomendaciones"
          name="recomendaciones"
          value={form?.recomendaciones}
          onChange={handleChange}
          rows={4}
          disabled={camposDeshabilitados}
          edited={isFieldEdited("recomendaciones")}
          onRevert={() => revertField("recomendaciones")}
        />
      </SectionFieldset>

      <SectionFieldset legend="Asignación de Médico">
        <EmpleadoComboBox
          value={form.nombre_medico}
          label="Especialista"
          form={form}
          onChange={handleChangeSimple}
          disabled={camposDeshabilitados}
          edited={isMedicoEdited}
          onRevert={revertMedico}
        />
      </SectionFieldset>

      {/* ===== SECCIÓN: AUDITORÍA DEL REGISTRO ===== */}
      {hayRegistroCargado && (
        <AuditoriaRegistro
          mostrarEdicion={form.tieneRegistro}
          fechaCreacion={auditoria.fechaCreacion}
          fechaEdicion={auditoria.fechaActualizacion}
          usuarioRegistro={auditoria.usuarioRegistro}
          usuarioEdicion={auditoria.usuarioActualizacion}
        />
      )}

      {/* ===== BOTONES DE ACCIÓN ===== */}
      <BotonesForm
        form={form}
        handleChangeNumberDecimals={handleChangeNumberDecimals}
        onNordenChange={handlePrintNordenChange}
        handleSave={form.tieneRegistro && edicionHabilitada ? handleEdit : handleSave}
        saveLabel={form.tieneRegistro && edicionHabilitada ? "Guardar Cambios" : "Guardar"}
        handleEdit={habilitarEdicion}
        handleClear={handleClear}
        handlePrint={handlePrint}
        hideSave={form.tieneRegistro && !edicionHabilitada}
        hideEdit={!form.tieneRegistro || edicionHabilitada}
      />
    </div>
  );
}
