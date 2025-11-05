import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBrain } from '@fortawesome/free-solid-svg-icons';
import { useForm } from '../../../../../../hooks/useForm';
import DatosPersonales from './TabsFichaPsicologica3/DatosPersonales';
import ExamenMental from './TabsFichaPsicologica3/ExamenMental';
import { getToday } from '../../../../../../utils/helpers';
import { useSessionData } from '../../../../../../hooks/useSessionData';
import { PrintHojaR, SubmitDataService, VerifyTR } from './controllerFichaPsicologica3';

const tabla = "ficha_psicologica_anexo03";
const today = getToday();

export default function FichaPsicologica3() {
  const [activeTab, setActiveTab] = useState(0);

  const { token, userlogued, selectedSede, datosFooter, userCompleto } =
    useSessionData();

  const initialFormState = {
    // ===== TAB: DATOS PERSONALES =====
    // Información General
    norden: "",
    fechaExamen: today,
    nombreExamen: "",
    codigoAnexo: null,

    // Datos Personales
    nombres: "",
    dni: "",
    sexo: "",
    apellidos: "",
    fechaNacimiento: "",
    lugarNacimiento: "",
    edad: "",
    estadoCivil: "",
    gradoInstruccion: "",

    // Datos Laborales
    empresa: "",
    tiempoExperiencia: "",
    contrata: "",
    puesto: "",
    area: "",
    mineralExp: "",
    explotacionEn: "",
    alturaLabor: "",

    // Evaluación y Riesgos
    motivoEvaluacion: "",
    principalesRiesgos: "",
    medidasSeguridad: "",

    // Historia y Observaciones
    historiaFamiliar: "",
    habitos: "",
    otrasObservaciones: "",

    // Anteriores Empresas - Lista almacenada
    empresasAnteriores: [],

    // ===== TAB: EXAMEN MENTAL =====
    // Observación de Conductas - Presentación
    presentacion: null,

    // Observación de Conductas - Postura
    postura: null,

    // Observación de Conductas - Discurso
    ritmo: null,
    tono: null,
    articulacion: null,

    // Observación de Conductas - Orientación
    orientacionTiempo: null,
    orientacionEspacio: null,
    orientacionPersona: null,

    // Observación de Conductas - Área Cognitiva
    areaCognitiva: "",

    // Procesos Cognitivos
    lucidoAtento: "",
    pensamiento: "",
    percepcion: "",
    memoria: null,
    inteligencia: null,
    apetito: "",
    sueno: "",
    personalidad: "",
    afectividad: "",
    conductaSexual: "",

    // Pruebas Psicológicas - Ptje Nombre
    mips: false,
    mps: false,
    luria: false,
    eae: false,
    maslach: false,
    climaLaboral: false,
    conductores: false,
    wais: false,
    benton: false,
    bender: false,
    zungAnsiedad: false,
    zungDepresion: false,
    wechsler: false,
    otrasPruebas: false,

    // Pruebas Psicológicas - Área Emocional
    areaEmocional: "",
  };

  const {
    form,
    handleChange,
    handleRadioButton,
    handleChangeSimple,
    handleCheckBoxChange,
    handleChangeNumber,
    handleClearnotO,
    handlePrintDefault,
    handleClear,
    setForm,
  } = useForm(initialFormState, { storageKey: "fichaPsicologicaAnexo3" });

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

  const tabs = [
    {
      label: 'Datos Personales',
      icon: faUser,
      component: <DatosPersonales
        form={form}
        handleChange={handleChange}
        handleChangeNumber={handleChangeNumber}
        handleChangeSimple={handleChangeSimple}
        setForm={setForm}
        handleSearch={handleSearch}
      />
    },
    {
      label: 'Examen Mental',
      icon: faBrain,
      component: <ExamenMental
        form={form}
        handleChange={handleChange}
        handleRadioButton={handleRadioButton}
        handleCheckBoxChange={handleCheckBoxChange}
        handleSave={handleSave}
        handlePrint={handlePrint}
        handleClear={handleClear}
      />
    }
  ];

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex space-x-1 overflow-x-auto">
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            onClick={() => setActiveTab(idx)}
            className={`px-6 py-2 border rounded-t-lg transition duration-150 text-base font-semibold focus:outline-none flex items-center whitespace-nowrap ${activeTab === idx
              ? 'bg-[#233245] text-white font-bold'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            <FontAwesomeIcon icon={tab.icon} className="mr-2" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active Content */}
      <div className="border border-gray-200 border-t-0  bg-white rounded-b-lg text-lg">
        {tabs[activeTab].component}
      </div>
    </div>
  );
};

