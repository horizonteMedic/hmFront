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
} from "../../../../components/reusableComponents/ResusableComponents";
import { useForm } from "../../../../hooks/useForm";
import { getToday, getTodayPlusOneYear } from "../../../../utils/helpers";
import { useSessionData } from "../../../../hooks/useSessionData";
import LugarDeTrabajo from "./TabsUsoRespiradores/LugarDeTrabajo";
import PersonalEmpleadoI from "./TabsUsoRespiradores/PersonalEmpleadoI";
import PersonalEmpleadoII from "./TabsUsoRespiradores/PersonalEmpleadoII";
import PersonalEmpleadoIII from "./TabsUsoRespiradores/PersonalEmpleadoIII";
import PersonalEmpleadoIV from "./TabsUsoRespiradores/PersonalEmpleadoIV";
import FinalAutorizacion from "./TabsUsoRespiradores/FinalAutorizacion";
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
    codigoRespiradores: null,
    fechaExam: today,
    tipoExamen: "",
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

    // ====================== LUGAR DE TRABAJO ======================
    // Tipo de respirador(es) a utilizar
    respiradorMascaraPolvo: true,
    respiradorMediaCara: true,
    respiradorCaraCompleta: false,
    tipoRespiradorTipo: "PURIFICADOR_SIN_ENERGIA",

    // Tipo de Protección
    tipoProteccion: "FILTRO_HEPA",

    // Esfuerzo físico esperado requerido
    esfuerzoFisico: "MODERADO",

    // Frecuencia de uso
    frecuenciaUso: "DIARIO",
    promedioHorasDia: "",

    // Exposición de Materiales Peligros
    expHumoMetal: false,
    expVaporOrganico: false,
    expArsenico: false,
    expAmoniaco: false,
    expPlomo: false,
    expPolvoRespirable: true,
    expAsbesto: false,
    expSilice: true,
    expDpm: false,
    expMercurio: false,
    expMonoxidoCarbono: false,
    expDioxidoCarbono: false,
    expOtros: false,

    // Condiciones Especiales de Trabajo
    elevacionesAltas: true,
    temperaturasExtremas: true,
    atmosferasHumidas: true,
    espaciosConfirmados: false,
    atmosferasIDLH: false,
    hazmatFuegoRescate: false,
    eppAdicionalUtilizado: false,
    otrosCondicionesTrabajo: false,
    otrosCondicionesTrabajoDescripcion: "",
    // ====================== PERSONAL EMPLEADO 1======================
    // Sección 1
    fumaUltimoMes: false,

    // Sección 2 - Condiciones
    condPalpitaciones: false,
    condConvulsiones: false,
    condDiabetes: false,
    condReaccionesAlergicasRespiracion: false,
    condClaustrofobia: false,

    // Sección 3 - Problemas pulmonares
    probPulmonAsbestosis: false,
    probPulmonAsma: false,
    probPulmonBronquitisCronica: false,
    probPulmonEnfisema: false,
    probPulmonNeumonia: false,
    probPulmonTuberculosis: false,
    probPulmonSilicosis: false,
    probPulmonNeumotorax: false,
    probPulmonCancer: false,
    probPulmonCostillasFracturadas: false,
    probPulmonLesionCirugia: false,
    probPulmonOtros: false,
    probPulmonOtrosDescripcion: "",

    // Sección 4 - Síntomas pulmonares
    sintRespirarReposo: false,
    sintRespirarCaminaNivel: false,
    sintRespirarCaminaInclinacion: false,
    sintRespirarAlTarea: false,
    sintTosExpectoracion: false,
    sintTosDespiertaManana: false,
    sintTosEchado: false,
    sintTosConSangre: false,
    sintSilbidosPecho: false,
    sintDolorPechoRespira: false,
    sintOtros: false,
    sintOtrosDescripcion: "",
    // ====================== PERSONAL EMPLEADO 2======================
    // 5. Problemas cardiovasculares
    cardioInfarto: false,
    cardioAngina: false,
    cardioInsuficienciaCardiaca: false,
    cardioHinchazonPiernasPies: false,
    cardioArritmiaCorazon: false,
    cardioReflujoGastroesofagicoNoComida: false,
    cardioOtros: false,
    cardioOtrosDescripcion: "",

    // 6. Síntomas cardiovasculares
    sintCardioDolorPresionPecho: false,
    sintCardioDolorPresionPechoActividadFisica: false,
    sintCardioDolorPresionPechoTrabajo: false,
    sintCardioPalpitaciones: false,
    sintCardioAcidezIndigestionNoComida: false,
    sintCardioOtros: false,
    sintCardioOtrosDescripcion: "",

    // 7. Medicación actual para condiciones
    medsProblemaRespiratorio: false,
    medsProblemasCorazon: false,
    medsPresionSanguinea: false,
    medsConvulsiones: false,

    // 8. Problemas al usar respirador
    respIrritacionOjos: false,
    respAlergiasPielErupciones: false,
    respAnsiedad: false,
    respFatigaDebilidad: false,
    respOtros: false,
    respOtrosDescripcion: "",
    // ====================== PERSONAL EMPLEADO 3======================
    // 9. Visión
    visionPerdidaOjo: false,
    visionUsaLentesContacto: false,
    visionUsaLentes: false,
    visionDaltonismo: false,
    visionOtros: false,
    visionOtrosDescripcion: "",

    // 11. Lesiones de oído
    oidoLesionTimpanoRoto: false,

    // 12. Audición actual
    audicionDificultadEscuchar: false,
    audicionUsaAudifono: false,
    audicionOtros: false,
    audicionOtrosDescripcion: "",

    // 13. Lesiones a la espalda
    espaldaLesion: false,

    // 14. Problemas musculoesqueléticos y de movilidad
    probGenDebilidadExtremidades: false,
    probGenDolorEspalda: false,
    probGenDificultadMoverBrazosPiernas: false,
    probGenDolorRigidezCintura: false,
    probGenDificultadMoverCabezaArribaAbajo: false,
    probGenDificultadMoverCabezaLadoALado: false,
    probGenDificultadDoblarRodillas: false,
    probGenDificultadCuclillas: false,
    probGenSubirEscaleras: false,
    probGenOtros: false,
    probGenOtrosDescripcion: "",

    // ====================== PERSONAL EMPLEADO 4======================
    alturaMareos: false,
    alturaDificultadRespirar: false,
    alturaPalpitaciones: false,
    alturaOtros: false,
    alturaOtrosDescripcion: "",

    probPulmonAsbestos: false,
    probPulmonSilice: false,
    probPulmonTungstenoCobalto: false,
    probPulmonBerilio: false,
    probPulmonAluminio: false,
    probPulmonCarbon: false,
    probPulmonHierro: false,
    probPulmonLaton: false,
    probPulmonAmbienteExcesoPolvo: false,
    probPulmonIndustrialesOtros: false,
    probPulmonIndustrialesOtrosDescripcion: "",

    trabajosExpuestosPeligrosRespiratorios: "",
    servicioMilitar: false,
    equipoMatpelEmergencias: false,

    // ====================== TAB 6 FINAL AUTORIZACION======================
    supervisor: "DESCONOCIDO",
    claseAutorizacion: "CLASE_I",
    claseIIOpcion: "",
    fechaExpiraAutorizacion: getTodayPlusOneYear(),
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
    // if (form.aptitudUsoRespirador == null) {
    //   Swal.fire({ icon: "error", title: "Error", text: "Por favor, seleccione la aptitud." });
    //   return;
    // }
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
        {/* Contenido principal - 80% */}
        <div className="w-4/5">
          <div className="w-full">
            {/* Datos del trabajador */}
            <section className="bg-white border border-gray-200 rounded-lg p-4 m-4 grid grid-cols-1 md:grid-cols-3 gap-4">
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
                onChange={handleChange}
              />
              <InputTextOneLine
                label="Nombre Examen"
                name="tipoExamen"
                value={form?.tipoExamen}
                disabled
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
                setForm={setForm}
                handleChange={handleChange}
                handleChangeNumber={handleChangeNumber}
                handleCheckBoxChange={handleCheckBoxChange}
                handleRadioButtonBoolean={handleRadioButtonBoolean}
                handleClear={handleClear}
                handleSave={handleSave}
                handlePrint={handlePrint}
                handleRadioButton={handleRadioButton}
                handleChangeSimple={handleChangeSimple}
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

        {/* Panel lateral - 20% */}
        <div className="w-1/5">
          <section className="bg-white border border-gray-200 rounded-lg p-4 m-4 flex-1 flex flex-col space-y-3">
            <h4 className="font-semibold text-gray-800 mb-3">Agudeza Visual</h4>
            {/* Sin Corregir */}
            <div className="mb-4">
              <h5 className="font-semibold text-gray-700 mb-2 text-center">Sin Corregir</h5>
              <div className="grid grid-cols-2 gap-3">
                <div className="">
                  <div className="font-semibold mb-2 text-center">O.D</div>
                  <div className="space-y-3">
                    <InputTextOneLine label="V.C." name="vcOD" value={form?.vcOD} disabled labelWidth="35px" />
                    <InputTextOneLine label="V.L." name="vlOD" value={form?.vlOD} disabled labelWidth="35px" />
                  </div>
                </div>
                <div className="">
                  <div className="font-semibold mb-2 text-center">O.I</div>
                  <div className="space-y-3">
                    <InputTextOneLine label="V.C." name="vcOI" value={form?.vcOI} disabled labelWidth="35px" />
                    <InputTextOneLine label="V.L." name="vlOI" value={form?.vlOI} disabled labelWidth="35px" />
                  </div>
                </div>
              </div>
            </div>

            {/* Corregida */}
            <div className="mb-4">
              <h5 className="font-semibold text-gray-700 mb-2 text-center">Corregida</h5>
              {/* Fila OD y OI */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="font-semibold mb-2 text-center">O.D</div>
                  <InputTextOneLine
                    label="V.C."
                    name="vcCorregidaOD"
                    value={form?.vcCorregidaOD}
                    disabled
                    labelWidth="35px"
                  />
                  <InputTextOneLine
                    label="V.L."
                    name="vlCorregidaOD"
                    value={form?.vlCorregidaOD}
                    disabled
                    labelWidth="35px"
                  />
                </div>
                <div className="space-y-3">
                  <div className="font-semibold mb-2 text-center">O.I</div>
                  <InputTextOneLine
                    label="V.C."
                    name="vcCorregidaOI"
                    value={form?.vcCorregidaOI}
                    disabled
                    labelWidth="35px"
                  />
                  <InputTextOneLine
                    label="V.L."
                    name="vlCorregidaOI"
                    value={form?.vlCorregidaOI}
                    disabled
                    labelWidth="35px"
                  />
                </div>
              </div>
              {/* Fila extra (ancho completo) */}
              <div className="mt-4 space-y-3">
                <InputTextOneLine
                  label="V.Clrs"
                  name="vclrs"
                  value={form?.vclrs}
                  disabled
                  className="flex-1 w-full"
                  labelWidth="35px"
                />
                <InputTextOneLine
                  name="vb"
                  label="V.B."
                  value={form?.vb}
                  disabled
                  className="flex-1 w-full"
                  labelWidth="35px"
                />
                <InputTextOneLine
                  label="R.P."
                  name="rp"
                  value={form?.rp}
                  disabled
                  className="flex-1 w-full"
                  labelWidth="35px"
                />
              </div>
            </div>
            {/* Enfermedades Oculares */}
            <InputTextArea label="Enfermedades Oculares" rows={5} name="enfermedadesOculares" value={form?.enfermedadesOculares} onChange={handleChange} disabled />
          </section>
        </div>
      </div>
    </div>
  );
}