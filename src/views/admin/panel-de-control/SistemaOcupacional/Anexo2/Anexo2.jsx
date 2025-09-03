import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUser, 
  faStethoscope, 
  faHeartbeat, 
  faChartLine,
  faPlus
} from "@fortawesome/free-solid-svg-icons";
import Resultados from "./Resultados/Resultados";
import ExamenFisico from "./ExamenFisico/ExamenFisico";
import Examenes from "./Examenes/Examenes";

// Componentes de contenido para cada tab
const DatosPersonales = () => (
  <div className="p-6">
    <h3 className="text=[11px] font-semibold mb-4 text-gray-800">Datos Personales</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-4">
        <div>
          <label className="block text=[11px] font-medium text-gray-700 mb-1">Nombre Completo</label>
          <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text=[11px] font-medium text-gray-700 mb-1">DNI</label>
          <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text=[11px] font-medium text-gray-700 mb-1">Fecha de Nacimiento</label>
          <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text=[11px] font-medium text-gray-700 mb-1">Empresa</label>
          <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text=[11px] font-medium text-gray-700 mb-1">Puesto de Trabajo</label>
          <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text=[11px] font-medium text-gray-700 mb-1">Área</label>
          <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>
    </div>
  </div>
);








// Panel de Observaciones Generales
const PanelObservaciones = () => (
  <div className="bg-gray-50 p-4 h-full">
    <div className="space-y-4">
      {/* Observaciones Generales */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-medium text-gray-700">Observaciones Generales :</h4>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text=[11px] flex items-center">
            <FontAwesomeIcon icon={faPlus} className="mr-1" />
            Agregar
          </button>
        </div>
        <textarea 
          rows="8" 
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
          placeholder="RADIOGRAFIA DE COLUMNA LUMBOSACRA AP-L..."
        ></textarea>
      </div>

      {/* Perfil Lipídico */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h4 className="font-medium text-gray-700 mb-3">Perfil Lipídico</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text=[11px] text-gray-600">Colesterol Total :</label>
            <input type="text" value="2" className="w-16 px-2 py-1 border border-gray-300 rounded text-center" />
          </div>
          <div className="flex items-center justify-between">
            <label className="text=[11px] text-gray-600">L.D.L Colesterol :</label>
            <input type="text" value="4" className="w-16 px-2 py-1 border border-gray-300 rounded text-center" />
          </div>
          <div className="flex items-center justify-between">
            <label className="text=[11px] text-gray-600">H.D.L Colesterol :</label>
            <input type="text" value="5" className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-red-600" />
          </div>
          <div className="flex items-center justify-between">
            <label className="text=[11px] text-gray-600">V.L.D.L Colesterol :</label>
            <input type="text" value="6" className="w-16 px-2 py-1 border border-gray-300 rounded text-center" />
          </div>
          <div className="flex items-center justify-between">
            <label className="text=[11px] text-gray-600">Trigliceridos :</label>
            <input type="text" value="3" className="w-16 px-2 py-1 border border-gray-300 rounded text-center" />
          </div>
        </div>
      </div>

      {/* Botón Asignar Médico */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <button className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded font-medium">
          ASIGNAR MEDICO
        </button>
      </div>
    </div>
  </div>
);

export default function Anexo2() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { id: 0, name: "Datos Personales", icon: faUser, component: DatosPersonales },
    { id: 1, name: "Exámenes", icon: faStethoscope, component: Examenes },
    { id: 2, name: "Examen Físico", icon: faHeartbeat, component: ExamenFisico },
    { id: 3, name: "Resultados", icon: faChartLine, component: Resultados }
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
                return activeTab === tab.id && <Component key={tab.id} />;
              })}
            </div>
          </div>
        </div>
        
        {/* Panel lateral de datos - 20% */}
        <div className="w-1/5 border-l border-gray-200">
          <PanelObservaciones />
        </div>
      </div>
    </div>
  );
}
