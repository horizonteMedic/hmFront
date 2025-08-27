import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBone, faUserMd } from "@fortawesome/free-solid-svg-icons";
import EvaluacionMusculoEsqueletica from "./EvaluacionMusculoEsqueletica/EvaluacionMusculoEsqueletica";
import EvaluacionMusculoEsqueletica2021 from "./EvaluacionMusculoEsqueletica2021/EvaluacionMusculoEsqueletica2021";

const MusculoEsqueleticoTabSelector = ({tieneVista}) => {
  const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
    // Encontrar el primer tab permitido
    if (tieneVista("E. Musculoesqueletica")) {
      setActiveTab(0);
    } else if (tieneVista("E. Musculoesqueletica Booro")) {
      setActiveTab(1);
    } else {
      setActiveTab(-1); // -1 significa que no tiene permisos
    }
  }, [/* aquí puedes poner dependencias si cambian los permisos */]);
  

  return (
    <div className="mx-auto bg-white rounded-lg shadow-md overflow-hidden py-8">
      <div className="w-full">
        {/* Tab Navigation */}
        <nav className="flex bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
          {tieneVista("E. Musculoesqueletica") && <button
            className={`flex-1 px-4 py-3 uppercase tracking-wider text-base border-b-4 transition-colors duration-200 cursor-pointer text-gray-700 hover:bg-gray-100 ${
              activeTab === 0
                ? "border-[#233245] text-[#233245] font-semibold"
                : "border-transparent"
            }`}
            onClick={() => setActiveTab(0)}
          >
            <FontAwesomeIcon icon={faBone} className="mr-2" />
            Evaluación Musculoesquelética
          </button>}
          {tieneVista("E. Musculoesqueletica Booro") && <button
            className={`flex-1 px-4 py-3 uppercase tracking-wider text-base border-b-4 transition-colors duration-200 cursor-pointer text-gray-700 hover:bg-gray-100 ${
              activeTab === 1
                ? "border-[#233245] text-[#233245] font-semibold"
                : "border-transparent"
            }`}
            onClick={() => setActiveTab(1)}
          >
            <FontAwesomeIcon icon={faUserMd} className="mr-2" />
            Evaluación Musculoesquelética BOORO
          </button>}
        </nav>

        {/* Tab Content */}
        <div className="p-6 max-w-[95%] mx-auto">
          {activeTab === 0 && <EvaluacionMusculoEsqueletica />}
          {activeTab === 1 && <EvaluacionMusculoEsqueletica2021 />}
          {activeTab === -1 && (
          <div className="text-center text-gray-500">
            No tiene permisos para ver ningún examen.
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default MusculoEsqueleticoTabSelector;
