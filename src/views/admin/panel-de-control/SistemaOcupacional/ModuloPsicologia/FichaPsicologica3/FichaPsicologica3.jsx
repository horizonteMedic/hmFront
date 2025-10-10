import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBrain } from '@fortawesome/free-solid-svg-icons';
import { useForm } from '../../../../../hooks/useForm';
import DatosPersonales from './DatosPersonales/DatosPersonales';
import ExamenMental from './ExamenMental/ExamenMental';

const FichaPsicologica3 = () => {
  const [activeTab, setActiveTab] = useState(0);

  // Estado inicial unificado del formulario
  const initialFormState = {
    // Datos personales básicos
    nOrden: "",
    dni: "",
    nombres: "",
    apellidos: "",
    fechaNacimiento: "",
    sexo: "",
    edad: "",
    lugarNacimiento: "",
    estadoCivil: "",
    gradoInstruccion: "",
    
    // Datos laborales
    empresa: "",
    contrata: "",
    puesto: "",
    area: "",
    mineralExp: "",
    explotacionEn: "",
    alturaLabor: "",
    
    // Datos adicionales
    exMedico: "",
    tLaboratorio: "",
    
    // Evaluación y riesgos
    motivoEvaluacion: "",
    principalesRiesgos: "",
    medidasSeguridad: "",
    
    // Historia y observaciones
    historiaFamiliar: "",
    habitos: "",
    otrasObservaciones: "",
    
    // Experiencia laboral - campos de entrada
    fechaEmpresa: "",
    nombreEmpresa: "",
    actividadEmpresa: "",
    puestoEmpresa: "",
    tSup: "",
    tSub: "",
    causaRetiro: "",
    
    // Lista de empresas anteriores
    empresasAnteriores: [],

    // Examen Mental - Presentación
    presentacion: null,
    
    // Postura
    postura: null,
    
    // Discurso
    ritmo: null,
    tono: null,
    articulacion: null,
    
    // Orientación
    orientacionTiempo: null,
    orientacionEspacio: null,
    orientacionPersona: null,
    
    // Área Cognitiva
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
    
    // Pruebas Psicológicas
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
    
    // Área Emocional
    areaEmocional: "",
  };

  const {
    form,
    handleChange,
    handleChangeSimple,
    handleChangeNumber,
    setForm,
  } = useForm(initialFormState);

  // Función para agregar empresa a la lista
  const agregarEmpresa = () => {
    if (form.nombreEmpresa && form.fechaEmpresa) {
      const nuevaEmpresa = {
        fecha: form.fechaEmpresa,
        nombreEmpresa: form.nombreEmpresa,
        actividadEmpresa: form.actividadEmpresa,
        puestoEmpresa: form.puestoEmpresa,
        tSup: form.tSup,
        tSub: form.tSub,
        causaRetiro: form.causaRetiro,
      };

      setForm(prevForm => ({
        ...prevForm,
        empresasAnteriores: [...prevForm.empresasAnteriores, nuevaEmpresa],
        // Limpiar campos de entrada
        fechaEmpresa: "",
        nombreEmpresa: "",
        actividadEmpresa: "",
        puestoEmpresa: "",
        tSup: "",
        tSub: "",
        causaRetiro: "",
      }));
    }
  };

  // Función para limpiar campos de empresa
  const limpiarCamposEmpresa = () => {
    setForm(prevForm => ({
      ...prevForm,
      fechaEmpresa: "",
      nombreEmpresa: "",
      actividadEmpresa: "",
      puestoEmpresa: "",
      tSup: "",
      tSub: "",
      causaRetiro: "",
    }));
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
        agregarEmpresa={agregarEmpresa}
        limpiarCamposEmpresa={limpiarCamposEmpresa}
      />
    },
    {
      label: 'Examen Mental',
      icon: faBrain,
      component: <ExamenMental 
        form={form}
        handleChange={handleChange}
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
            className={`px-6 py-2 border rounded-t-lg transition duration-150 text-base font-semibold focus:outline-none flex items-center whitespace-nowrap ${
              activeTab === idx
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

export default FichaPsicologica3;
