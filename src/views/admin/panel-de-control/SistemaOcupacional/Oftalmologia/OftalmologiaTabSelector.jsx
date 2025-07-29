import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import FichaOftalmologica from "./FichaOftalmologica/FichaOftalmologica";
import Oftalmologia from "./Oftalmologia/Oftalmologia";

const OftalmologiaTabSelector = ({ token, selectedSede, userlogued }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="mx-auto bg-white rounded-lg shadow-md overflow-hidden py-8">
      <div className="w-full ">
        <h1 className="text-3xl font-bold mb-4 text-center">Oftalmología</h1>

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
            <FontAwesomeIcon icon={faEye} className="mr-2" />
            Ficha Oftalmológica
          </button>
          <button
            className={`flex-1 px-4 py-3 uppercase tracking-wider text-base border-b-4 transition-colors duration-200 cursor-pointer text-gray-700 hover:bg-gray-100 ${
              activeTab === 1
                ? "border-[#233245] text-[#233245] font-semibold"
                : "border-transparent"
            }`}
            onClick={() => setActiveTab(1)}
          >
            <FontAwesomeIcon icon={faEye} className="mr-2" />
            Oftalmología
          </button>
        </nav>

        {/* Tab Content */}
        <div className="p-6  max-w-[95%] mx-auto">
          {activeTab === 0 && (
            <FichaOftalmologica
              token={token}
              userlogued={userlogued}
              selectedSede={selectedSede}
            />
          )}
          {activeTab === 1 && (
            <Oftalmologia
              token={token}
              userlogued={userlogued}
              selectedSede={selectedSede}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default OftalmologiaTabSelector;
