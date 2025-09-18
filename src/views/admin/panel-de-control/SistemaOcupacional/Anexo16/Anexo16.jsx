import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faStethoscope,
  faChartLine,
  faHeartbeat,
} from "@fortawesome/free-solid-svg-icons";
import Resultados from "./Resultados/Resultados";
import Examenes from "./Examenes/Examenes";
import DatosPersonales from "./DatosPersonales/DatosPersonales";
import PanelObservaciones from "./PanelObservaciones/PanelObservaciones";
import Abdomen from "./Abdomen/Abdomen";
import { useForm } from "../../../../hooks/useForm";
import { useSessionData } from "../../../../hooks/useSessionData";
import { getToday } from "../../../../utils/helpers";
import { PrintHojaR, SubmitDataService, VerifyTR } from "./controllerAnexo16";
import Swal from "sweetalert2";

const tabla = "anexo_16";
const today = getToday();

export default function Anexo16({ listas }) {
  const { MedicosMulti } = listas || {};
  // console.log(MedicosMulti);

  const { token, userlogued, selectedSede, datosFooter, userCompleto } =
    useSessionData();

  const initialFormState = {
    norden: "",
    nomExamen: "",
    fechaExam: today,
    codigoAnexo: null,
    //Info personal
    dni: "",
    nombres: "",
    apellidos: "",
    fechaNac: "",
    sexo: "",
    edad: "",
    //Contacto y Estado Civil
    lugarNac: "",
    domicilio: "",
    telefono: "",
    estadoCivil: "",
    gradoInstruccion: "",
    //Información Laboral
    empresa: "",
    contrata: "",
    mineralExp: "",
    explotacion: "",
    alturaLaboral: "",
    //Detalles del Puesto
    puestoPostula: "",
    areaPuesto: "",
    puestoActual: "",
    tiempoPuesto: "",
    reubicacion: false,

    //Agentes presentes en Trabajo Actual
    ruido: false,
    polvo: false,
    vidSegmentario: false,
    vidTotal: false,
    alturaEstruct: false,
    vibraciones: false,
    cancerigenos: false,
    mutagenicos: false,
    solventes: false,
    metales: false,
    alturaGeograf: false,
    temperaturaAgente: false,
    biologicos: false,
    posturas: false,
    turnos: false,
    quimicos: false,
    cargas: false,
    movRepet: false,
    pvd: false,
    electricos: false,
    otros: false,

    //Antecedentes
    antecedentesPersonalesOcupacionales: "",
    antecedentesFamiliares: "",
    grupoSanguineoPrevio: "",
    grupoSanguineoGrupo: "",
    antecedentesPatologicos: "",

    //Número de Hijos
    hijosVivos: "",
    hijosMuertos: "",

    //Inmunizaciones
    tetano: false,
    hepatitisB: false,
    fiebreAmarilla: false,

    //Hábitos
    tabaco: "nada",
    alcohol: "nada",
    drogas: "nada",

    //=============================================================================================
    //TAB LATERAL
    //=============================================================================================
    observacionesGenerales: "",
    conclusiones: "",
    colesterolTotal: "",
    LDLColesterol: "",
    HDLColesterol: "",
    VLDLColesterol: "",
    trigliceridos: "",
    //Grupo Sanguineo
    grupoSanguineo: "",
    factorRh: "",
    //Resultados de Laboratorio
    vsg: "",
    glucosa: "",
    creatinina: "",
    marihuana: "",
    cocaina: "",
    hemoglobinaHematocrito: "",

    //=============================================================================================
    //SEGUNDA TAB EXAMENES
    //=============================================================================================
    // Función Respiratoria
    fvc: "",
    fev1: "",
    fev1Fvc: "",
    fef2575: "",
    conclusionRespiratoria: "",

    // Información Triaje
    //Medidas Generales
    temperatura: "",
    cintura: "",
    cadera: "",
    icc: "",

    //Medidas Generales
    talla: "",
    peso: "",
    imc: "",
    imcRojo: false,

    // Signos Vitales
    frecuenciaRespiratoria: "",
    frecuenciaCardiaca: "",
    saturacionO2: "",
    perimetro: "",

    // Presión Arterial
    presionSistolica: "",
    presionDiastolica: "",

    // Audiometría - Oído Derecho
    od500: "",
    od1000: "",
    od2000: "",
    od3000: "",
    od4000: "",
    od6000: "",
    od8000: "",

    // Audiometría - Oído Izquierdo
    oi500: "",
    oi1000: "",
    oi2000: "",
    oi3000: "",
    oi4000: "",
    oi6000: "",
    oi8000: "",

    // Ojos
    visionCercaOd: "",
    visionCercaOi: "",
    visionCercaOdCorregida: "",
    visionCercaOiCorregida: "",

    visionLejosOd: "",
    visionLejosOi: "",
    visionLejosOdCorregida: "",
    visionLejosOiCorregida: "",

    visionColores: "",
    enfermedadOculares: "",
    enfermedadOtros: "",
    reflejosPupilares: "",
    visionBinocular: "",

    // Observaciones Generales
    ectoscopia: "",
    estadoMental: "",
    anamnesis: "",

    // Dentadura
    piezasMalEstado: "",
    piezasFaltan: "",
    dentaduraObservaciones: "",

    // Examen Físico
    cabeza: "",
    nariz: "",
    cuello: "",
    bocaAmigdalasFaringeLaringe: "",
    otoscopiaOd: true,
    otoscopiaOi: true,
    torax: "",
    corazon: "",
    pulmones: "",
    pulmonesObservaciones: "",
    miembrosSuperiores: "",
    miembrosInferiores: "",
    reflejosOsteotendinosos: "",
    marcha: "",

    // Abdomen y Examen Físico
    abdomen: "",
    columnaVertebral: "",
    anillosInguinales: "",
    organosGenitales: "",
    tactoRectal: "",
    describirTactoRectal: false,
    tactoRectalObservaciones: "",
    hernias: "",
    varices: "",
    ganglios: "",
    evaluacionCognitiva: "",
    clasificacion: "",
    reaccionesSerologicasPositivo: false,
    reaccionesSerologicasNegativo: false,
    sinNeumoconiosis: "",
    imagenRadiograficaPolvo: "",
    conNeumoconiosis: "",
    numeroRx: "",
    fechaRx: "",
    calidadRx: "",
    simbolosRx: "",
    vertices: "",
    hilios: "",
    senos: "",
    mediastinos: "",
    conclusionesRadiograficas: "",
    siluetaCardiovascular: "",

    //=============================================================================================
    //TERCERA TAB RESULTADOS
    //=============================================================================================
    // Exámenes de Laboratorio
    rhFactor: "",
    coca: "",
    nitritos: "",
    proteinas: "",
    cetonas: "",
    leucocitos: "",
    urobilinogeno: "",
    bilirrubina: "",
    glucosaQuimico: "",
    sangre: "",
    leucocitosSedimento: "",
    celulasEpiteliales: "",
    cilindios: "",
    bacterias: "",
    hematies: "",
    cristales: "",
    pus: "",
    otrosSedimento: "",
    colorFisico: "",
    aspectoFisico: "",
    densidadFisico: "",
    phFisico: "",
    otrosExamenes: "",
    aptoParaTrabajar: "si",

    // Aptitud del Paciente
    aptitud: "APTO",
    fechaAptitud: today,
    fechaVencimiento: today,
    restricciones: "NINGUNO",

    // Recomendaciones y Restricciones
    corregirAgudezaVisualTotal: false,
    corregirAgudezaVisual: false,
    dietaHipocalorica: false,
    evitarMovimientosDisergonomicos: false,
    noTrabajoAltoRiesgo: false,
    noTrabajoSobre18m: false,
    usoEppAuditivo: false,
    usoLentesCorrectorConducir: false,
    usoLentesCorrectorTrabajo: false,
    usoLentesCorrectorTrabajo18m: false,
    ninguno: true,
    noConducirVehiculos: false,
    usoEppAuditivoGeneral: false,

    // Estado del Paciente
    nordenEstadoPaciente: "",
    nombresEstadoPaciente: "",
    tipoExamenEstadoPaciente: "",

    // Exámenes Realizados
    triaje: "",
    labClinico: "",
    electrocardiograma: "",
    rxToraxPA: "",
    fichaAudiologica: "",
    espirometria: "",
    odontograma: "",
    psicologia: "",
    anexo7D: "",
    histOcupacional: "",
    fichaAntPatologicos: "",
    cuestionarioNordico: "",
    certTrabajoAltura: "",
    detencionSAS: "",
    consentimientoDosaje: "",
    exRxSanguineos: "",
    perimetroToraxico: "",
    oftalmologia: "",

    // Médico que Certifica //BUSCADOR
    nombre_medico: userCompleto?.datos?.nombres_user?.toUpperCase(),
    filteredNombresMedicos: [],
  };

  const {
    form,
    setForm,
    handleChange,
    handleChangeNumber,
    handleRadioButton,
    handleCheckBoxChange,
    handleRadioButtonBoolean,
    handleClear,
    handleClearnotO,
  } = useForm(initialFormState);

  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      id: 0,
      name: "Datos Personales",
      icon: faUser,
      component: DatosPersonales,
    },
    { id: 1, name: "Exámenes", icon: faStethoscope, component: Examenes },
    { id: 2, name: "Abdomen", icon: faHeartbeat, component: Abdomen },
    { id: 3, name: "Resultados", icon: faChartLine, component: Resultados },
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
  const handlePrint = (numPage) => {
    if (!form.norden)
      return Swal.fire("Error", "Debe colocar un N° Orden", "error");
    Swal.fire({
      title: "¿Desea Imprimir Anexo 16?",
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
        PrintHojaR(form.norden, token, tabla, numPage, datosFooter);
      }
    });
  };

  return (
    <div className="mx-auto bg-white overflow-hidden ">
      <div className="flex h-full">
        {/* Contenido principal - 80% */}
        <div className="w-4/5">
          <div className="w-full">
            {/* Tab Navigation */}
            <nav className="flex bg-white border-b border-gray-200 sticky top-0 z-20 ">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`flex-1 px-4 py-3 uppercase tracking-wider text=[11px] border-b-4 transition-colors duration-200 cursor-pointer text-gray-700 hover:bg-gray-100 ${
                    activeTab === tab.id
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

            {/* Tab Content */}
            <div className="max-w-full">
              {tabs.map((tab) => {
                const Component = tab.component;
                return (
                  activeTab === tab.id && (
                    <Component
                      key={tab.id}
                      form={form}
                      setForm={setForm}
                      handleChange={handleChange}
                      handleChangeNumber={handleChangeNumber}
                      handleRadioButton={handleRadioButton}
                      handleCheckBoxChange={handleCheckBoxChange}
                      handleClear={handleClear}
                      handleClearnotO={handleClearnotO}
                      handleRadioButtonBoolean={handleRadioButtonBoolean}
                      MedicosMulti={MedicosMulti}
                      handlePrint={handlePrint}
                      handleSearch={handleSearch}
                    />
                  )
                );
              })}
            </div>
          </div>
        </div>

        {/* Panel lateral de datos - 20% */}
        <div className="w-1/5">
          <PanelObservaciones
            form={form}
            handleRadioButton={handleRadioButton}
            handleClear={handleClear}
            handleSave={handleSave}
            activeTab={activeTab}
            handleChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
}
