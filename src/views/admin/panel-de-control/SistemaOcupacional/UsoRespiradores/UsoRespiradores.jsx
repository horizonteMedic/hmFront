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
  SectionFieldset,
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
import DatosPersonalesLaborales from "../../../../components/templates/DatosPersonalesLaborales";
import BotonesAccion from "../../../../components/templates/BotonesAccion";

const tabla = "b_uso_respiradores";

export default function UsoRespiradores() {
  const [activeTab, setActiveTab] = useState(0);
  const today = getToday();
  const { token, userlogued, selectedSede, datosFooter, userDNI } = useSessionData();

  const initialFormState = {
    // Header
    norden: "",
    codigoRespiradores: null,
    fechaExam: today,
    tipoExamen: "",
    // Datos personales
    dni: "",
    nombres: "",
    fechaNacimiento: "",
    lugarNacimiento: "",
    edad: "",
    sexo: "",
    estadoCivil: "",
    nivelEstudios: "",

    // Datos Laborales
    empresa: "",
    contrata: "",
    ocupacion: "",
    cargoDesempenar: "",

    dniUsuario: userDNI,

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
    handleChangeNumberDecimals,
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
    <div className="grid 2xl:grid-cols-8 mx-auto gap-x-4 px-2 gap-y-3">
      {/* Contenido principal - 80% */}
      <div className="2xl:col-span-6 space-y-3">
        {/* Datos del trabajador */}
        <SectionFieldset legend="Información del Examen">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-4 gap-y-3">
            <InputTextOneLine
              label="N° Orden"
              name="norden"
              value={form.norden}
              onChange={handleChangeNumberDecimals}
              onKeyUp={handleSearch}
              labelWidth="120px"
            />
            <InputTextOneLine
              label="Fecha"
              name="fechaExam"
              type="date"
              value={form.fechaExam}
              onChange={handleChangeSimple}
              labelWidth="120px"
            />
            <InputTextOneLine
              label="Nombre del Examen"
              name="tipoExamen"
              value={form.tipoExamen}
              disabled
              labelWidth="120px"
            />
          </div>
        </SectionFieldset>

        <DatosPersonalesLaborales form={form} />

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
        <div className="px-4 pt-4 ">
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

        <BotonesAccion
          form={form}
          handleSave={handleSave}
          handleClear={handleClear}
          handlePrint={handlePrint}
          handleChangeNumberDecimals={handleChangeNumberDecimals}
        />
      </div>

      {/* Panel lateral - 20% */}
      <div className="2xl:col-span-2">
        <SectionFieldset legend="Oftalmología" className="grid gap-y-3">
          <SectionFieldset legend="Sin Corregir" className="grid md:grid-cols-2 gap-x-4 gap-y-3">
            <div>
              <div className="font-semibold mb-2 text-center ml-[80px]">Ojo Derecho</div>
              <div className="space-y-3">
                <InputTextOneLine label="Visión Cerca" name="vcOD" value={form?.vcOD} disabled labelWidth="70px" />
                <InputTextOneLine label="Visión Lejos" name="vlOD" value={form?.vlOD} disabled labelWidth="70px" />
              </div>
            </div>
            <div>
              <div className="font-semibold mb-2 text-center ml-[80px]">Ojo Izquierdo</div>
              <div className="space-y-3">
                <InputTextOneLine label="Visión Cerca" name="vcOI" value={form?.vcOI} disabled labelWidth="70px" />
                <InputTextOneLine label="Visión Lejos" name="vlOI" value={form?.vlOI} disabled labelWidth="70px" />
              </div>
            </div>
          </SectionFieldset>

          {/* Corregida */}
          <SectionFieldset legend="Corregida" className="grid md:grid-cols-2 gap-x-4 gap-y-3">
            <div className="space-y-3">
              <div className="font-semibold mb-2 text-center ml-[80px]">Ojo Derecho</div>
              <InputTextOneLine
                label="Visión Cerca"
                name="vcCorregidaOD"
                value={form?.vcCorregidaOD}
                disabled
                labelWidth="70px"
              />
              <InputTextOneLine
                label="Visión Lejos"
                name="vlCorregidaOD"
                value={form?.vlCorregidaOD}
                disabled
                labelWidth="70px"
              />
            </div>
            <div className="space-y-3">
              <div className="font-semibold mb-2 text-center ml-[80px]">Ojo Izquierdo</div>
              <InputTextOneLine
                label="Visión Cerca"
                name="vcCorregidaOI"
                value={form?.vcCorregidaOI}
                disabled
                labelWidth="70px"
              />
              <InputTextOneLine
                label="Visión Lejos"
                name="vlCorregidaOI"
                value={form?.vlCorregidaOI}
                disabled
                labelWidth="70px"
              />
            </div>
          </SectionFieldset>
          {/* Fila extra (ancho completo) */}
          <SectionFieldset legend="Valoración Oftalmológica" className="grid gap-y-3">
            <InputTextOneLine
              label="Visión Colores"
              name="vclrs"
              value={form?.vclrs}
              disabled
              labelWidth="100px"
            />
            <InputTextOneLine
              label="Visión Binocular"
              name="vb"
              value={form?.vb}
              disabled
              labelWidth="100px"
            />
            <InputTextOneLine
              label="Reflejos Pupilares"
              name="rp"
              value={form?.rp}
              disabled
              labelWidth="100px"
            />
            <InputTextArea
              label="Enfermedades Oculares"
              rows={7}
              name="enfermedadesOculares"
              value={form?.enfermedadesOculares}
              onChange={handleChange}
              disabled
            />
          </SectionFieldset>

        </SectionFieldset>
      </div>
    </div>
  );
}