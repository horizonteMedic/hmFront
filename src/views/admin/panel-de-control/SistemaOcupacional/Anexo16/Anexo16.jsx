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
const tabla = "anexo7c";

export default function Anexo16() {
  const today = getToday();
  const { token, userlogued, selectedSede, datosFooter, userName } = useSessionData();

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
    nivelEstudios: "",
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
    cargos: true,
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

    //Examenes
    //Cabeza
    cabeza: "NORMAL",
    cabezaDesc: "",
    //Nariz y Oídos
    nariz: "NORMAL",
    narizDesc: "",
    oidoD: "NORMAL",
    oidoDDesc: "",
    oidoI: "NORMAL",
    oidoIDesc: "",
    //Boca y Garganta
    boca: "NORMAL",
    bocaDesc: "",
    garganta: "NORMAL",
    gargantaDesc: "",
    //Cuello
    cuello: "NORMAL",
    cuelloDesc: "",
    //Piel
    piel: "NORMAL",
    pielDesc: "",
    pielObservaciones: "",
    //Ojos - Visión
    ojoD: "NORMAL",
    ojoDDesc: "",
    ojoI: "NORMAL",
    ojoIDesc: "",
    visionLejana: "",
    visionColor: "NORMAL",
    reflejosPupilares: "NORMAL",
    visionBinocular: "NORMAL",
    enfermedadOculares: "",
    enfermedadOtros: "",
    //Tórax
    torax: "NORMAL",
    toraxDesc: "",
    //Corazón
    corazon: "NORMAL",
    corazonDesc: "",
    //Pulmones
    pulmones: "NORMAL",
    pulmonesDesc: "",
    pulmonesObservaciones: "",
    //Abdomen
    abdomen: "NORMAL",
    abdomenDesc: "",
    //Miembros superiores
    miembrosSuperiores: "NORMAL",
    miembrosSuperioresDesc: "",
    //Miembros inferiores
    miembrosInferiores: "NORMAL",
    miembrosInferioresDesc: "",
    //Reflejos
    reflejosOsteotendinosos: "NORMAL",
    reflejosOsteotendinososDesc: "",
    //Marcha
    marcha: "NORMAL",
    marchaDesc: "",
    //Columna vertebral
    columnaVertebral: "NORMAL",
    columnaVertebralDesc: "",
    //Organos genitales
    organosGenitales: "NORMAL",
    organosGenitalesDesc: "",
    //Tacto rectal
    tactoRectal: "NORMAL",
    tactoRectalDesc: "",
    //Hernia inguinal
    hernias: "NORMAL",
    herniasDesc: "",
    //Varices
    varices: "NORMAL",
    varicesDesc: "",
    //Ganglios
    ganglios: "NORMAL",
    gangliosDesc: "",
    //Evaluación cognitiva
    evaluacionCognitiva: "NORMAL",
    evaluacionCognitivaDesc: "",
    //Estado mental
    estadoMental: "NORMAL",
    estadoMentalDesc: "",

    //Laboratorio
    grupoSanguineo: "",
    factorRh: "",
    grupoSanguineoPrevio: "",
    grupoSanguineoGrupo: "",
    vsg: "",
    glucosa: "",
    creatinina: "",
    marihuana: "",
    cocaina: "",
    hemoglobinaHematocrito: "",

    //Perfil Lipídico
    colesterolTotal: "",
    LDLColesterol: "",
    HDLColesterol: "",
    VLDLColesterol: "",
    trigliceridos: "",

    //Otras pruebas
    electrocardiograma: "",
    electrocardiogramaDesc: "",
    rxTorax: "",
    rxToraxDesc: "",
    espirometria: "",
    espirometriaDesc: "",
    audiometria: "",
    audiometriaDesc: "",
    otoscopiaOd: "",
    otoscopiaOi: "",

    //Diagnósticos y Conclusiones
    clasificacion: "",
    observacionesGenerales: "",
    observacionesAudio: "",
    diagnosticosCIE10: [],

    //Conclusión Medica
    conclusionMedico: "",
    //Observaciones y restricciones
    observacionesFichaMedica: "",
    //Conclusión de la salud y riesgo
    // apto: false,
    // noApto: false,
    // conRestriccion: false,
    //Recomendaciones y restricciones
    notasDoctor: "",
    apto: false,
    noApto: false,
    conRestriccion: false,
    aptoCondicion: "",

    //Psicología y otros
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
    // otrosExamenes2: "",

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

  const [visualerOpen, setVisualerOpen] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

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
      GetExamenesRealizados(form.nordenEstadoPaciente, setForm, token, () => { Swal.close(); });
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
                  className={`flex-1 px-4 py-3 uppercase tracking-wider text-[11px] border-b-4 transition-colors duration-200 cursor-pointer text-gray-700 hover:bg-gray-100 ${activeTab === tab.id ? "border-[#233245] text-[#233245] font-semibold" : "border-transparent"}`}
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
                      handleChangeSimple={handleChangeSimple}
                      handleBlur={handleBlur}
                      token={token}
                      selectedSede={selectedSede}
                      userlogued={userlogued}
                      today={today}
                      handleSearch={handleSearch}
                      handleSearchExamenesRealizados={handleSearchExamenesRealizados}
                      handleRadioButtonBoolean={handleRadioButtonBoolean}
                    />
                  )
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar - 20% */}
        <div className="w-1/5 bg-gray-50 border-l border-gray-200 overflow-y-auto">
          <div className="p-4 space-y-4">
            <ButtonsPDF
              norden={form.norden}
              handlePrint={handlePrint}
              handleSave={handleSave}
              form={form}
              setForm={setForm}
              tabla={tabla}
              token={token}
            />
            {/* <SubirArchivosAnexo16
              form={form}
              setForm={setForm}
              token={token}
              selectedSede={selectedSede}
              userlogued={userlogued}
              handleSearch={handleSearch}
              {...form.SubirDoc ? { handleSave: () => { handleSubirArchivo(form, selectedSede, userlogued, token) } } : {}}
              {...form.SubirDoc ? { handleRead: () => { ReadArchivosForm(form, setVisualerOpen, token) } } : {}}
              handleMasivo={() => { handleSubirArchivoMasivo(form, selectedSede, userlogued, token) }}
            /> */}
            <PanelObservaciones
              form={form}
              handleRadioButton={handleRadioButton}
              handleChange={handleChange}
              handleBlur={handleBlur}
              token={token}
              setForm={setForm}
            />
          </div>
        </div>
        {visualerOpen && (
          <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white rounded-lg overflow-hidden overflow-y-auto shadow-xl w-[700px] h-[auto] max-h-[90%]">
              <div className="px-4 py-2 naranjabackgroud flex justify-between">
                <h2 className="text-lg font-bold color-blanco">{visualerOpen.nombreArchivo}</h2>
                <button onClick={() => setVisualerOpen(null)} className="text-xl text-white" style={{ fontSize: "23px" }}>×</button>
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
  );
}
