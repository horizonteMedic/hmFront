import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBone, faUserMd } from "@fortawesome/free-solid-svg-icons";
import EvaluacionMusculoEsqueletica from "./EvaluacionMusculoEsqueletica/EvaluacionMusculoEsqueletica";
import EvaluacionMusculoEsqueletica2021 from "./EvaluacionMusculoEsqueletica2021/EvaluacionMusculoEsqueletica2021";

const MusculoEsqueleticoTabSelector = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="mx-auto bg-white rounded-lg shadow-md overflow-hidden py-8">
      <div className="w-full">
        {/* Tab Navigation */}
        <nav className="flex bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
          <button
            className={`flex-1 px-4 py-3 uppercase tracking-wider text-base border-b-4 transition-colors duration-200 cursor-pointer text-gray-700 hover:bg-gray-100 ${
              activeTab === 0
                ? "border-[#233245] text-[#233245] font-semibold"
                : "border-transparent"
            }`}
            onClick={() => setActiveTab(0)}
          >
            <FontAwesomeIcon icon={faBone} className="mr-2" />
            Evaluación Musculoesquelética
          </button>
          <button
            className={`flex-1 px-4 py-3 uppercase tracking-wider text-base border-b-4 transition-colors duration-200 cursor-pointer text-gray-700 hover:bg-gray-100 ${
              activeTab === 1
                ? "border-[#233245] text-[#233245] font-semibold"
                : "border-transparent"
            }`}
            onClick={() => setActiveTab(1)}
          >
            <FontAwesomeIcon icon={faUserMd} className="mr-2" />
            Evaluación Musculoesquelética BOORO
          </button>
        </nav>

        {/* Tab Content */}
        <div className="p-6 max-w-[95%] mx-auto">
          {activeTab === 0 && <EvaluacionMusculoEsqueletica />}
          {activeTab === 1 && <EvaluacionMusculoEsqueletica2021 />}
        </div>
      </div>
    </div>
  );
};

export default MusculoEsqueleticoTabSelector;
