import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FichaAptitudAnexo2 from "./FichaAptitudAnexo2/FichaAptitudAnexo2";
import FichaAptitudAnexo16 from "./FichaAptitudAnexo16/FichaAptitudAnexo16";
import { useSessionData } from "../../../../hooks/useSessionData";
import { useForm } from "../../../../hooks/useForm";
import { useState } from "react";
import { getToday } from "../../../../utils/helpers";

const today = getToday();

// Tab Normal de Fichas Aptitud
export default function FichasAptitud({ listas }) {
  const { MedicosMulti } = listas;
  const { userCompleto } = useSessionData();
  const initialFormState = {
    // Datos básicos
    norden: "",
    fechaExam: today,
    nombres: "",
    sexo: "",
    edad: "",
    boroo: false,
    
    // Datos específicos para Fichas Aptitud Anexo 2
    numeroHistoria: "",
    tipoExamen: "",
    paraHuamachuco: false,
    poderosa: false,
    tipodos: "",
    nombresApellidos: "",
    dni: "",
    genero: "",
    empresa: "",
    contratista: "",
    puestoPostula: "",
    ocupacionActual: "",
    conclusiones: "",
    aptitud: "",
    fecha: today,
    fechaVencimiento: "",
    medicoCertifica: "",
    recomendaciones: "",
    restricciones: "",
    
    // Checkboxes de recomendaciones
    corregirAgudezaVisualTotal: false,
    corregirAgudezaVisual: false,
    dietaHipocalorica: false,
    evitarMovimientosDisergonomicos: false,
    noHacerTrabajoAltoRiesgo: false,
    noHacerTrabajoSobre18: false,
    usoEppAuditivo: false,
    usoLentesConducir: false,
    usoLentesTrabajo: false,
    usoLentesTrabajoSobre18: false,
    ninguno: false,
    noConducirVehiculos: false,
    
    // Campo de búsqueda
    busqueda: "",
    
    // Datos médicos - Visión
    visionCercaOd: "",
    visionCercaOi: "",
    visionCercaOdCorregida: "",
    visionCercaOiCorregida: "",
    visionLejosOd: "",
    visionLejosOi: "",
    visionLejosOdCorregida: "",
    visionLejosOiCorregida: "",
    visionColores: "",
    visionBinocular: "",
    reflejosPupilares: "",
    enfermedadOculares: "",
    
    // Datos médicos - Laboratorio
    hemoglobinaHematocrito: "",
    vsg: "",
    glucosa: "",
    creatinina: "",
    
    // Médico que Certifica
    nombre_medico: userCompleto?.datos?.nombres_user?.toUpperCase(),
  };
  
  const {
    form,
    setForm,
    handleChange,
    handleChangeNumber,
    handleRadioButton,
    handleChangeSimple,
    handleCheckBoxChange,
    handleRadioButtonBoolean,
    handleClear,
    handleClearnotO,
    handlePrintDefault,
  } = useForm(initialFormState);
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      id: 0,
      name: "Ficha Aptitud Anexo 2",
      component: FichaAptitudAnexo2,
    },
    {
      id: 1,
      name: "Ficha Aptitud Anexo 16",
      component: FichaAptitudAnexo16,
    },
  ];

  const handleSave = () => {
    // SubmitDataService(form, token, userlogued, handleClear, tabla, datosFooter);
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      handleClearnotO();
      // VerifyTR(form.norden, tabla, token, setForm, selectedSede);
    }
  };
  
  const handlePrint = () => {
    handlePrintDefault(() => {
      // PrintHojaR(form.norden, token, tabla, datosFooter);
    });
  };

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-lg p-3">
        {/* Tab Navigation */}
        <nav className="flex bg-white border-b border-gray-200 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`flex-1 px-4 py-3 uppercase tracking-wider border-b-4 transition-colors duration-200 cursor-pointer hover:bg-gray-100 ${
                activeTab === tab.id
                  ? "border-[#233245] font-semibold"
                  : "border-transparent"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
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
                  handleChangeSimple={handleChangeSimple}
                  handleRadioButtonBoolean={handleRadioButtonBoolean}
                  MedicosMulti={MedicosMulti}
                  handleSave={handleSave}
                  handleSearch={handleSearch}
                  handlePrint={handlePrint}
                  handleClear={handleClear}
                />
              )
            );
          })}
        </div>
      </div>
    </div>
  );
}
