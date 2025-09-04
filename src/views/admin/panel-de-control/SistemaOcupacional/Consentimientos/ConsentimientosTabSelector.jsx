import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBone,
  faFileContract,
  faUserMd,
} from "@fortawesome/free-solid-svg-icons";
import ConsentimientoInformadoOcupacional from "./ConsentimientoInformado/Consentimiento_informado_digitalizado";
import ConsentimientoBuenaSalud from "./ConsentimientoBuenaSalud/ConsentimientoBuenaSalud";

export default function ConsentimientosTabSelector({ tieneVista }) {
  const [activeTab, setActiveTab] = useState(0);

  useEffect(
    () => {
      // Encontrar el primer tab permitido
      if (tieneVista("Consentimiento Informado")) {
        setActiveTab(0);
      } else if (tieneVista("Consentimiento Buena Salud")) {
        setActiveTab(1);
      } else {
        setActiveTab(-1); // -1 significa que no tiene permisos
      }
    },
    [
      /* aquí puedes poner dependencias si cambian los permisos */
    ]
  );

  return (
    <div className="mx-auto bg-white rounded-lg overflow-hidden pt-8">
      <div className="w-full">
        {/* Tab Navigation */}
        <nav className="flex bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
          {tieneVista("Consentimiento Informado") && (
            <button
              className={`flex-1 px-4 py-3 uppercase tracking-wider text-base border-b-4 transition-colors duration-200 cursor-pointer text-gray-700 hover:bg-gray-100 ${
                activeTab === 0
                  ? "border-[#233245] text-[#233245] font-semibold"
                  : "border-transparent"
              }`}
              onClick={() => setActiveTab(0)}
            >
              <FontAwesomeIcon icon={faFileContract} className="mr-2" />
              Consentimiento Informado
            </button>
          )}
          {tieneVista("Consentimiento Buena Salud") && (
            <button
              className={`flex-1 px-4 py-3 uppercase tracking-wider text-base border-b-4 transition-colors duration-200 cursor-pointer text-gray-700 hover:bg-gray-100 ${
                activeTab === 1
                  ? "border-[#233245] text-[#233245] font-semibold"
                  : "border-transparent"
              }`}
              onClick={() => setActiveTab(1)}
            >
              <FontAwesomeIcon icon={faFileContract} className="mr-2" />
              Consentimiento Buena Salud
            </button>
          )}
        </nav>

        {/* Tab Content */}
        <div className="p-6 max-w-[95%] mx-auto">
          {activeTab === 0 && <ConsentimientoInformadoOcupacional />}
          {activeTab === 1 && <ConsentimientoBuenaSalud />}
          {activeTab === -1 && (
            <div className="text-center text-gray-500">
              No tiene permisos para ver ningún examen.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
