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

export default function Anexo2() {
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
    reside: false,
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
    enfermedadAccidente: "",
    enfermedadAsociadaTrabajo: false,
    anioEnfermedad: "",
    diasDescanso: "",
    dataEnfermedades: [],

    // //Medidas Generales
    // talla: "",
    // peso: "",
    // imc: "",

    //===============================
    //TAB LATERAL
    //===============================
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

    //===============================
    //SEGUNDA TAB EXAMENES
    //===============================
    // Función Respiratoria
    fvc: "",
    fev1: "",
    fev1Fvc: "",
    fef2575: "",
    tipoFuncionRespiratoria: "",
    conclusionRespiratoria: "",

    // Medidas Generales
    temperatura: "",
    cintura: "",
    cadera: "",
    icc: "",

    // Signos Vitales
    frecuenciaRespiratoria: "",
    frecuenciaCardiaca: "",
    saturacionO2: "",
    perimetro: "",

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

    // Dentadura
    piezasMalEstado: "",
    piezasFaltan: "",

    // Presión Arterial
    presionSistolica: "",
    presionDiastolica: "",

    // Grupo Sanguíneo
    grupoSanguineo: "",
    rh: "",

    // Observaciones Generales
    ectoscopia: "",
    estadoMental: "",
    anamnesis: "",
  };

  const {
    form,
    setForm,
    handleChange,
    handleChangeNumber,
    handleRadioButton,
    handleCheckBoxChange,
    handleClear,
    handleClearnotO,
    handleRadioButtonBoolean,
    handlePrintDefault,
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
    {
      id: 2,
      name: "Examen Físico",
      icon: faHeartbeat,
      component: ExamenFisico,
    },
    { id: 3, name: "Resultados", icon: faChartLine, component: Resultados },
  ];

  return (
    <div className="mx-auto bg-white rounded-lg shadow-md overflow-hidden py-8">
      <div className="flex h-full">
        {/* Contenido principal - 80% */}
        <div className="w-4/5">
          <div className="w-full">
            {/* Tab Navigation */}
            <nav className="flex bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
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
                    />
                  )
                );
              })}
            </div>
          </div>
        </div>

        {/* Panel lateral de datos - 20% */}
        <div className="w-1/5 border-l border-gray-200">
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
