import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faStethoscope,
  faHeartbeat,
  faChartLine,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import Resultados from "./Resultados/Resultados";
import ExamenFisico from "./ExamenFisico/ExamenFisico";
import Examenes from "./Examenes/Examenes";
import DatosPersonales from "./DatosPersonales/DatosPersonales";
import { useForm } from "../../../../hooks/useForm";
import { useSessionData } from "../../../../hooks/useSessionData";
import PanelObservaciones from "./PanelObservaciones/PanelObservaciones";

const tabla = "informe_electrocardiograma";
const date = new Date();
const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
  2,
  "0"
)}-${String(date.getDate()).padStart(2, "0")}`;

// Panel de Observaciones Generales

export default function Anexo2({ listas }) {
  const { MedicosMulti } = listas;
  console.log(MedicosMulti);

  const { token, userlogued, selectedSede, datosFooter, userCompleto } =
    useSessionData();

  const initialFormState = {
    norden: "",
    nomExamen: "",
    fechaExam: today,
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

    //Ant. Personales
    neoplasia: false,
    neoplasiaDescripcion: "",
    quemaduras: false,
    quemadurasDescripcion: "",
    otrosAntecedentes: false,
    otrosAntecedentesDescripcion: "",
    its: false,
    itsDescripcion: "",
    cirugias: false,
    cirugiasDescripcion: "",

    //Residencia en el lugar de trabajo
    reside: true,
    tiempoReside: "",
    essalud: false,
    sctr: false,
    eps: false,
    otrosResidencia: false,
    otrosResidencia1: false,

    //Número de Hijos
    hijosVivos: "",
    hijosMuertos: "",
    hijosDependientes: "",
    totalHijos: "",

    //Antecedentes Familiares
    antecendentesPadre: "",
    antecendentesMadre: "",
    antecendentesHermano: "",
    antecendentesEsposao: "",

    //Medicamentos
    tomaMedicamento: false,
    tipoMedicamentos: "",
    frecuenciaMedicamentos: "",

    //Absentismo: Enfermedades y accidentes
    enfermedad: "",
    asociadoTrabajo: false,
    anio: "",
    diasDescanso: "",
    dataEnfermedades: [],

    //=============================================================================================
    //TAB LATERAL
    //=============================================================================================
    observacionesGenerales: "",
    colesterolTotal: "",
    LDLColesterol: "",
    HDLColesterol: "",
    VLDLColesterol: "",
    trigliceridos: "",
    //Comparacion Grupo Sanguineo
    grupoSanguineoPrevio: "",
    grupoSanguineoGrupo: "",
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

    //=============================================================================================
    //TERCERA TAB EXAMEN FISICO
    //=============================================================================================

    // Examen Físico por Sistemas
    cabeza:
      "CENTRAL, PRESENCIA DE CABELLO FRONDOSO, NO MASAS, NO TUMORACIONES.",
    cuello: "CENTRAL, MOVIL, NO MASAS NO TUMORACIONES.",
    boca: "HUMECTADA, LENGUA ROSADA,CARRILLOS ROSADOS,NO MASA, NO TUMORACIONES, NO LESIONES EN MUCOSA.",
    faringe:
      "HUMECTADA, SONROSADA, AMIGADALAS NO HIPERTROFICAS, NO CONGESTIVAS.",
    nariz: "CENTRAL, PERMEABLE",
    oidos: "",
    marcha: "NORMAL",
    piel: "NORMAL.NO  MANCHA, NO SPRESENCIA DE LUNARES SOSPECHOSOS DE MALIGNIDAD.",
    aparatoRespiratorio:
      "RESPIRACION  NORMAL,EXPANSION TORACICA SIMETRICA, BPMV EN ACP, NO RALES.",
    apaCardiovascular:
      "NO INGURGITACION YUGULAR, CAROTIDEO,RADIAL, FEMORAL, PEDIO CONSERVADOS.RCRR, NO SOPLOS, NO FROTES.",
    aparatoDigestivo:
      "ABDOMEN PLANO, RHA CONSERVADOS, NO RUIDOS ANORMALES, BLANDO, DEPRESIBLE, NO DOLOR A LA PALPACION SUPERFICIAL NI PROFUNDA, NO MASAS NI TUMORACIONES PALPABLES.",
    aGenitourinario:
      "PPL: NEGATIVO. PRU: NEGATIVO.HIPOGASTRIO PLANO, B/D, NO DOLOROSO A LA PALPACION SUPERFIAL NI PROFUNDA.NO MASAS NI TUMORACIONES PALPABLES.",
    aparatoLocomotor:
      "BIPEDESTACION,MUSCULATURA CONSERVADA, MOTRICIDAD CORPORAL Y SEGMENTARIA CONSERVADA.",
    miembrosSuperiores: "SIMETRICOS, NO DEFORMIDADES, MOTRICIDAD CONSERVADA.",
    miembrosInferiores: "SIMETRICOS, NO DEFORMIDADES, MOTRICIDAD CONSERVADA.",
    sistemaLinfatico: "NO ADENOMEGALIAS PATOLOGICA.",
    sistemaNervioso:
      "DESPIERTO, OTEP, SENSIBILIDAD Y MOTRICIDAD CONSERVADA, ROTS CONSERVADOS.PARES CRANEALES CONSERVADOS.NO SIGNOS MENINGEOS.",
    columnaVertebral: "CENTRAL, CURVATURAS CONSERVADAS, MOTRICIDAD CONSERVADA.",

    // Otros Exámenes
    otrosExamenes: "",

    //=============================================================================================
    //CUARTA TAB RESULTADOS
    //=============================================================================================
    // Aptitud del Paciente
    aptitud: "APTO",
    fechaAptitud: today,
    fechaVencimiento: today,
    restricciones: "",

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
    ninguno: false,
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

    // Médico que Certifica
    nombre_medico: "",
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
    handlePrintDefault,
  } = useForm(initialFormState);

  const [activeTab, setActiveTab] = useState(0);
  const [filteredNombresMedicos, setFilteredNombresMedicos] = useState([]);

  const tabs = [
    {
      id: 0,
      name: "Datos Personales",
      icon: faUser,
      component: DatosPersonales,
    },
    { id: 1, name: "Exámenes", icon: faStethoscope, component: Examenes },
    {
      id: 2,
      name: "Examen Físico",
      icon: faHeartbeat,
      component: ExamenFisico,
    },
    { id: 3, name: "Resultados", icon: faChartLine, component: Resultados },
  ];

  const handleNombreMedicoSearch = (e) => {
    const v = e.target.value.toUpperCase();
    setForm((d) => ({ ...d, nombre_medico: v }));

    setFilteredNombresMedicos(
      v
        ? MedicosMulti.filter((medico) =>
            medico.mensaje.toLowerCase().includes(v.toLowerCase())
          )
        : []
    );
  };

  const handleSelectNombreMedico = (medico) => {
    setForm((d) => ({ ...d, nombre_medico: medico.mensaje }));
    setFilteredNombresMedicos([]);
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
                      handleNombreMedicoSearch={handleNombreMedicoSearch}
                      handleSelectNombreMedico={handleSelectNombreMedico}
                      // searchNombreMedico={searchNombreMedico}
                      filteredNombresMedicos={filteredNombresMedicos}
                      setFilteredNombresMedicos={setFilteredNombresMedicos}
                      MedicosMulti={MedicosMulti}
                    />
                  )
                );
              })}
            </div>
          </div>
        </div>

        {/* Panel lateral de datos - 20% */}
        <div className="w-1/5  border-gray-200">
          <PanelObservaciones
            form={form}
            setForm={setForm}
            handleChange={handleChange}
            handleChangeNumber={handleChangeNumber}
            handleRadioButton={handleRadioButton}
            handleCheckBoxChange={handleCheckBoxChange}
            handleClear={handleClear}
            handleClearnotO={handleClearnotO}
            handleRadioButtonBoolean={handleRadioButtonBoolean}
          />
        </div>
      </div>
    </div>
  );
}
