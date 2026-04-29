import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faStethoscope,
  faChartLine,
  faFlask,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import Resultados from "./Resultados/Resultados";
import Examenes from "./Examenes/Examenes";
import DatosPersonales from "./DatosPersonales/DatosPersonales";
import PanelObservaciones from "./PanelObservaciones/PanelObservaciones";
import { useForm } from "../../../../hooks/useForm";
import { useSessionData } from "../../../../hooks/useSessionData";
import { getToday } from "../../../../utils/helpers";
import { GetExamenesRealizados, handleSubirArchivo, handleSubirArchivoMasivo, PrintHojaR, ReadArchivosForm, SubmitDataService, VerifyTR } from "./controllerAnexo16";
import Swal from "sweetalert2";
import Abdomen from "./Abdomen/Abdomen";
import Laboratorio from "./Laboratorio/Laboratorio";
import ButtonsPDF from "../../../../components/reusableComponents/ButtonsPDF";
import CIE10 from "./CIE10/CIE10";
const tabla = "anexo7c";

export default function Anexo16() {
  const today = getToday();
  const { token, userlogued, selectedSede, datosFooter, userName } =
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
    //Agentes presentes en Trabajo Actual
    ruido: true,
    polvo: true,
    vidSegmentario: true,
    vidTotal: true,
    alturaEstruct: true,
    vibraciones: true,
    cancerigenos: false,
    mutagenicos: false,
    solventes: false,
    metales: false,
    alturaGeograf: false,
    temperaturaAgente: true,
    biologicos: false,
    posturas: true,
    turnos: false,
    quimicos: false,
    cargas: true,
    movRepet: true,
    pvd: false,
    electricos: false,
    otros: false,
    //Información Laboral
    empresa: "",
    contrata: "",
    mineralExp: "",
    explotacion: "",
    alturaLaboral: "",
    //Detalles del Puesto
    puestoPostula: "N/A",
    areaPuesto: "",
    puestoActual: "N/A",
    tiempoPuesto: "N/A",
    reubicacion: false,

    //Antecedentes
    antecedentesPersonales2: "NINGUNO",
    antecedentesPersonales: "NIEGA DB, TBC, HTA, CONVULSIONES, ASMA, ALERGIAS, ACCIDENTES",
    antecedentesFamiliares: "NO CONTRIBUTORIOS",
    antecedentesPatologicos: "",
    //Hábitos
    tabaco: "NADA",
    alcohol: "NADA",
    drogas: "NADA",
    //Número de Hijos
    hijosVivos: "",
    hijosMuertos: "",
    //Inmunizaciones
    tetano: false,
    hepatitisB: false,
    fiebreAmarilla: false,

    //=============================================================================================
    //TAB LATERAL
    //=============================================================================================
    observacionesGenerales: "",
    observacionesAudio: "",
    conclusionMedico: "",

    //Resultados de Laboratorio
    vsg: "",
    glucosa: "",
    creatinina: "",
    marihuana: "",
    cocaina: "NO REACTIVO",
    hemoglobinaHematocrito: "",
    //Grupo Sanguineo
    grupoSanguineoPrevio: "",
    grupoSanguineoGrupo: "",
    grupoSanguineo: "",
    factorRh: "",
    //Resultados de Laboratorio
    colesterolTotal: "",
    LDLColesterol: "",
    HDLColesterol: "",
    VLDLColesterol: "",
    trigliceridos: "",


    //=============================================================================================
    //SEGUNDA TAB EXAMENES
    //=============================================================================================
    // Información Triaje
    //Medidas Generales
    temperatura: "",
    cintura: "",
    cadera: "",
    icc: "",
    // Signos Vitales
    frecuenciaRespiratoria: "",
    frecuenciaCardiaca: "",
    saturacionO2: "",
    // Presión Arterial
    presionSistolica: "",
    presionDiastolica: "",

    //Medidas Generales
    talla: "",
    peso: "",
    imc: "",
    imcRojo: false,

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

    otoscopiaOd: "NORMAL",
    otoscopiaOi: "NORMAL",

    // Función Respiratoria
    fvc: "",
    funcionABSNormal: false,
    funcionABSOBSTR: false,
    fev1: "",
    fev1Fvc: "",
    fef2575: "",
    conclusionRespiratoria: "",

    // Examen Físico
    cabeza: "NORMAL",
    nariz: "CENTRAL, PERMEABLE",
    cuello: "CENTRAL, MOVIL",
    perimetro: "",
    bocaAmigdalasFaringeLaringe: "HUMECTADA, NO HIPERTROFICAS, NO CONGESTIVAS",

    piel: "NORMAL",
    pielObservaciones: "NORMAL. NO MANCHAS, AUSENCIA DE LUNARES SOSPECHOSOS DE MALIGNIDAD.",
    //Miembros y reflejos
    miembrosSuperiores: "SIMETRICOS, NO DEFORMIDADES, MOTRICIDAD CONSERVADA.",
    miembrosInferiores: "SIMETRICOS, NO DEFORMIDADES, MOTRICIDAD CONSERVADA.",
    reflejosOsteotendinosos: "CONSERVADOS",
    marcha: "NORMAL",

    // Ojos
    visionCercaOd: "",
    visionCercaOi: "",
    visionCercaOdCorregida: "",
    visionCercaOiCorregida: "",

    visionLejosOd: "",
    visionLejosOi: "",
    visionLejosOdCorregida: "",
    visionLejosOiCorregida: "",

    visionColores: "NORMAL",
    enfermedadOculares: "NINGUNA",
    enfermedadOtros: "NINGUNA",
    reflejosPupilares: "CONSERVADOS",
    visionBinocular: "",

    pulmones: "NORMAL",
    pulmonesObservaciones: "BPMV EN ACP. NO RALES.",
    torax: "BPMV EN ACP, NO RALES.",
    corazon: "RCRR, NO SOPLOS.",
    // Dentadura
    piezasMalEstado: "",
    piezasFaltan: "",
    dentaduraObservaciones: "",
    //=============================================================================================
    //TERCERA TAB RESULTADOS
    //=============================================================================================
    // Examen Físico - Abdomen
    abdomen: "RHA(+), B/D, NO DOLOROSO A LA PALPACION",
    columnaVertebral: "CENTRAL, MOVIL, CURVATURAS CONSERVADAS",
    anillosInguinales: "CONSERVADOS",
    organosGenitales: "DE CARACTER NORMAL",
    //Tacto Rectal
    tactoRectal: "NO_SE_HIZO",
    hernias: "NO",
    varices: "NO",
    ganglios: "NO LINFADENOPATIAS",
    evaluacionCognitiva: "NORMAL",
    //Información Radiológica
    numeroRx: "",
    codigoExamenRadiograficoSanguineo: null,
    fechaRx: today,
    calidadRx: "",
    simbolosRx: "N/A",
    //Conclusiones Radiográficas
    vertices: "",
    hilios: "",
    senos: "",
    mediastinos: "",
    conclusionesRadiograficas: "",
    siluetaCardiovascular: "",
    //Estado Mental y Anamnesis
    estadoMental: "DESPIERTO, OTEP, COMUNICATIVO.",
    anamnesis: "COLABORADOR REFIERE SENTIRSE BIEN, SIN PROBLEMAS DE SALUD, NO practica deporte o deporte de alto rendimiento.",
    //Clasificación y Neumoconiosis
    clasificacion: "0/0",
    reaccionesSerologicas: "NEGATIVO",
    sinNeumoconiosis: "NORMAL",
    imagenRadiograficaPolvo: "SOSPECHA",
    conNeumoconiosis: "",

    //=============================================================================================
    //CUARTA TAB RESULTADOS
    //=============================================================================================
    // Exámenes de Laboratorio
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
    aptoParaTrabajar: "",

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

    //colores
    cocainaRed: "",
    marihuanaRed: "",
    glucosaRed: "",
    creatininaRed: "",
    imcRed: "",
    hemoglobinaRed: "",
    colesterolRed: "",

    ldlRed: "",
    hdlRed: "",
    vldlRed: "",
    trigliceridosRed: "",

    notasDoctor: "",
    //Laboratorio
    mercurioOrina: "N/A",
    plomoSangre: "N/A",
    pcr_ultrasensible: "",

    // Médico que Certifica //BUSCADOR
    nombre_medico: userName,
    user_medicoFirma: userlogued,

    observacionesGenerales2: "",
    posibleCerrar: false,
    cerrado: false,
    otrosExamenes2: "",

    SubirDoc: false,
    nomenclatura: "RESMAG"
  };

  const {
    form,
    setForm,
    handleChange,
    handleChangeNumber,
    handleChangeSimple,
    handleRadioButton,
    handleCheckBoxChange,
    handleRadioButtonBoolean,
    handleClear,
    handleClearnotO,
    handleBlur
  } = useForm(initialFormState, { storageKey: "anexo_16" });

  const [visualerOpen, setVisualerOpen] = useState(null)
  const [activeTab, setActiveTab] = useState(0);
  const [modalCIE10, setModalCIE10] = useState(false)

  const tabs = [
    {
      id: 0,
      name: "Datos Personales",
      icon: faUser,
      component: DatosPersonales,
    },
    { id: 1, name: "Exámenes", icon: faStethoscope, component: Examenes },
    { id: 2, name: "Laboratorio", icon: faFlask, component: Laboratorio },
    { id: 3, name: "Abdomen", icon: faChartLine, component: Abdomen },
    { id: 4, name: "Resultados", icon: faChartLine, component: Resultados },

  ];

  const handleSave = () => {
    SubmitDataService(form, setForm, token, userlogued, handleClear, tabla, datosFooter);
  };
  const handleSearchExamenesRealizados = (e) => {
    if (e.key === "Enter") {
      // handleClearnotO();
      GetExamenesRealizados(form.nordenEstadoPaciente, setForm, token, () => { Swal.close() });
    }
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
                      handlePrint={handlePrint}
                      handleSearch={handleSearch}
                      handleSave={handleSave}
                      handleSearchExamenesRealizados={handleSearchExamenesRealizados}
                      handleChangeSimple={handleChangeSimple}
                      handleBlur={handleBlur}

                    />
                  )
                );
              })}
            </div>
          </div>
        </div>

        {/* Panel lateral de datos - 20% */}
        <div className="w-1/5">
          {/* <ButtonsPDF
            {...form.SubirDoc ? { handleSave: () => { handleSubirArchivo(form, selectedSede, userlogued, token) } } : {}}
            {...form.SubirDoc ? { handleRead: () => { ReadArchivosForm(form, setVisualerOpen, token) } } : {}}
            handleMasivo={() => { handleSubirArchivoMasivo(form, selectedSede, userlogued, token) }}
          /> */}
          <PanelObservaciones
            form={form}
            handleRadioButton={handleRadioButton}

            activeTab={activeTab}
            handleChange={handleChange}
            setmodalCIE10={(boolean) => { setModalCIE10(boolean) }}
          />
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
      {modalCIE10 && <CIE10 closeModal={() => { setModalCIE10(false) }} token={token} setForm={setForm} />}
    </div>
  );
}