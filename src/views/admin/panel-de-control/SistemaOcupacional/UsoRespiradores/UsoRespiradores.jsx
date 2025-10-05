import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faIndustry,
  faUser,
  faUsers,
  faListCheck,
  faCheck,
  faBroom,
  faPrint,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import {
  InputTextOneLine,
  InputTextArea,
  InputsRadioGroup,
  InputCheckbox,
} from "../../../../components/reusableComponents/ResusableComponents";
import { useForm } from "../../../../hooks/useForm";
import { getToday } from "../../../../utils/helpers";
import { useSessionData } from "../../../../hooks/useSessionData";
import Swal from "sweetalert2";
import LugarDeTrabajo from "./LugarDeTrabajo/LugarDeTrabajo";
import PersonalEmpleadoI from "./PersonalEmpleadoI/PersonalEmpleadoI";
import PersonalEmpleadoII from "./PersonalEmpleadoII/PersonalEmpleadoII";
import PersonalEmpleadoIII from "./PersonalEmpleadoIII/PersonalEmpleadoIII";
import PersonalEmpleadoIV from "./PersonalEmpleadoIV/PersonalEmpleadoIV";
import FinalAutorizacion from "./FinalAutorizacion/FinalAutorizacion";
import { PrintHojaR, SubmitDataService, VerifyTR } from "./controllerUsoRespiradores";

const tabla = "b_uso_respiradores";
const today = getToday();

export default function UsoRespiradores() {
  const [activeTab, setActiveTab] = useState(0);

  const { token, userlogued, selectedSede, datosFooter, userCompleto } =
    useSessionData();

  const initialFormState = {
    // Header
    norden: "",
    fechaExam: today,
    tipoExamen: "",
    razonVisita: "PRIMERA ACTITUD",
    // Datos personales
    nombres: "",
    dni: "",
    edad: "",
    sexo: "",
    empresa: "",
    contrata: "",
    areaTrabajo: "",
    puestoTrabajo: "",

    // ====================== TAB LATERAL: AGUDEZA VISUAL ======================
    vcOD: "",
    vlOD: "",
    vcOI: "",
    vlOI: "",
    vcCorregidaOD: "",
    vlCorregidaOD: "",
    vcCorregidaOI: "",
    vlCorregidaOI: "",
    vclrs: "",
    vb: "",
    rp: "",
    enfermedadesOculares: "",

    // ====================== 7.1 Lugar de Trabajo ======================
    respiradorMascaraPolvo: false,
    respiradorMediaCara: false,
    respiradorCaraCompleta: false,
    respiradorPurificadorSinEnergia: false,
    respiradorPurificadorConEnergia: false,
    respiradorAutonomo: false,

    usoDiario: false,
    usoSemanal: false,
    usoOcasional: false,
    usoRaraVez: false,

    elevacionesAltas: false,
    temperaturasExtremas: false,
    atmosferasHumidas: false,
    espaciosConfinados: false,
    atmosferasIDLH: false,
    hazmatFuegoRescate: false,
    temperaturasExtremasTrabajo: false,

    matAsbestos: false,
    matSilice: false,
    matTungstenoCobalto: false,
    matBerilio: false,
    matAluminio: false,
    matCarbon: false,
    matHierro: false,
    matLaton: false,
    matExcesoPolvo: false,

    esfuerzoLigero: false,
    esfuerzoModerado: false,
    esfuerzoPesado: false,

    otrosLugarTrabajo: "",

    // ====================== 7.2 Personal Empleado I ======================
    usadoRespiradorPrevio: null,
    problemasRespirandoMascarillas: null,
    alergiaMaterialRespirador: null,
    ambientesPolvoHumo: null,
    tallaMascara: "",
    modeloPreferido: "",
    comentariosPersonalI: "",

    // ====================== 7.3 Personal Empleado II ======================
    tosCronica: null,
    dificultadRespirar: null,
    dolorPecho: null,
    palpitaciones: null,
    hipertensionDiagnosticada: null,
    antecedentesAsma: null,
    detalleSintomasII: "",

    // ====================== 7.4 Personal Empleado III ======================
    mareosFrecuentes: null,
    fatigaExtrema: null,
    dolorCabezaFrecuente: null,
    desmayos: null,
    problemasVisionRespirador: null,
    claustrofobia: null,
    detalleSintomasIII: "",

    // ====================== 7.5 Personal Empleado IV ======================
    diabetes: null,
    problemasPulmonaresCronicos: null,
    enfermedadCardiaca: null,
    trastornosNeurologicos: null,
    alteracionesPsicologicas: null,
    otraCondicionRelevante: null,
    detalleCondicionesIV: "",

    // ====================== 7.6 Autorización Final ======================
    aptitudUsoRespirador: null,
    medicoEvaluador: userCompleto?.datos?.nombres_user?.toUpperCase() ?? "",
    cmpEvaluador: "",
    fechaEvaluacion: today,
    observacionesFinales: "",
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
    { id: 0, name: "Lugar de Trabajo", icon: faIndustry, component: LugarDeTrabajo },
    { id: 1, name: "Personal Empleado I", icon: faUser, component: PersonalEmpleadoI },
    { id: 2, name: "Personal Empleado II", icon: faUsers, component: PersonalEmpleadoII },
    { id: 3, name: "Personal Empleado III", icon: faListCheck, component: PersonalEmpleadoIII },
    { id: 4, name: "Personal Empleado IV", icon: faListCheck, component: PersonalEmpleadoIV },
    { id: 5, name: "Autorización Final", icon: faCheck, component: FinalAutorizacion },
  ];

  const handleSave = () => {
    if (form.aptitudUsoRespirador == null) {
      Swal.fire({ icon: "error", title: "Error", text: "Por favor, seleccione la aptitud." });
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
    <div className="mx-auto bg-white max-w-[95%]">
      <div className="flex h-full">
        {/* Contenido principal - 80% */}
        <div className="w-4/5">
          <div className="w-full">
            {/* Datos del trabajador */}
            <section className="bg-white border border-gray-200 rounded-lg p-4 m-4 grid grid-cols-1 md:grid-cols-4 gap-4">
              <InputTextOneLine
                label="N° Orden"
                name="norden"
                value={form?.norden}
                onChange={handleChangeNumber}
                onKeyDown={handleSearch}
              />
              <InputTextOneLine
                label="Fecha"
                name="fechaExam"
                type="date"
                value={form?.fechaExam}
                onChange={handleChange}
              />
              <InputTextOneLine
                label="Tipo de Examen"
                name="tipoExamen"
                value={form?.tipoExamen}
                onChange={handleChange}
              />

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
            <div className="flex items-center gap-4 px-4">
              {tabs.map((tab, idx) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(idx)}
                  className={`flex items-center gap-2 px-3 py-2 rounded ${activeTab === idx ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"}`}
                >
                  <FontAwesomeIcon icon={tab.icon} />
                  <span className="hidden md:inline">{tab.name}</span>
                </button>
              ))}
            </div>

            {/* Contenido de la pestaña activa */}
            <div className="m-4">
              <ActiveComponent
                form={form}
                handleChange={handleChange}
                handleCheckBoxChange={handleCheckBoxChange}
                handleRadioButtonBoolean={handleRadioButtonBoolean}
              />
            </div>

            {/* Acciones */}
            <div className="flex items-center gap-4 p-4 m-4">
              <button
                onClick={handleClear}
                className="flex items-center gap-2 bg-gray-200 text-gray-800 hover:bg-gray-300 px-3 py-2 rounded"
              >
                <FontAwesomeIcon icon={faBroom} /> Limpiar
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 bg-indigo-600 text-white hover:bg-indigo-700 px-3 py-2 rounded"
              >
                <FontAwesomeIcon icon={faPrint} /> IMPRIMIR
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-green-600 text-white hover:bg-green-700 px-3 py-2 rounded"
              >
                <FontAwesomeIcon icon={faSave} /> Guardar
              </button>
            </div>
          </div>
        </div>

        {/* Panel lateral - 20% */}
        <div className="w-1/5 border-l border-gray-200 bg-white p-4">
          <h3 className="text-base font-semibold text-gray-800 mb-4">Agudeza Visual</h3>
          <div className="space-y-4">
            {/* Sin corregir */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Sin corregir</h4>
              <div className="grid grid-cols-2 gap-2">
                <InputTextOneLine label="VC OD" name="vcOD" value={form?.vcOD} onChange={handleChangeSimple} />
                <InputTextOneLine label="VL OD" name="vlOD" value={form?.vlOD} onChange={handleChangeSimple} />
                <InputTextOneLine label="VC OI" name="vcOI" value={form?.vcOI} onChange={handleChangeSimple} />
                <InputTextOneLine label="VL OI" name="vlOI" value={form?.vlOI} onChange={handleChangeSimple} />
              </div>
            </div>

            {/* Corregida */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Corregida</h4>
              <div className="grid grid-cols-2 gap-2">
                <InputTextOneLine label="VC OD" name="vcCorregidaOD" value={form?.vcCorregidaOD} onChange={handleChangeSimple} />
                <InputTextOneLine label="VL OD" name="vlCorregidaOD" value={form?.vlCorregidaOD} onChange={handleChangeSimple} />
                <InputTextOneLine label="VC OI" name="vcCorregidaOI" value={form?.vcCorregidaOI} onChange={handleChangeSimple} />
                <InputTextOneLine label="VL OI" name="vlCorregidaOI" value={form?.vlCorregidaOI} onChange={handleChangeSimple} />
              </div>
            </div>

            {/* Otros */}
            <div className="grid grid-cols-3 gap-2">
              <InputTextOneLine label="V.Clrs" name="vclrs" value={form?.vclrs} onChange={handleChangeSimple} />
              <InputTextOneLine label="V.B." name="vb" value={form?.vb} onChange={handleChangeSimple} />
              <InputTextOneLine label="R.P." name="rp" value={form?.rp} onChange={handleChangeSimple} />
            </div>

            <InputTextArea label="Enfermedades Oculares" name="enfermedadesOculares" value={form?.enfermedadesOculares} onChange={handleChange} rows={3} />
          </div>
        </div>
      </div>
    </div>
  );
}
