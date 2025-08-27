import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXRay } from "@fortawesome/free-solid-svg-icons";
import styles from "./RayosX.module.css";
import RayosXToraxPA from "./rayosXToraxPA/RayosXToraxPA";
import RayosXColumna from "./rayosXColumna/RayosXColumna";
import ConsentimientoMujerRayosX from "./consentimientoMujer/ConsentimientoMujerRayosX";

export default function RayosXTabSelector({tieneVista}) {
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
  // Encontrar el primer tab permitido
  if (tieneVista("Radiografía de Torax")) {
    setActiveTab(0);
  } else if (tieneVista("Radiografía de Columna")) {
    setActiveTab(1);
  } else if (tieneVista("Consentimiento Mujeres")) {
    setActiveTab(2);
  } else {
    setActiveTab(-1); // -1 significa que no tiene permisos
  }
}, [/* aquí puedes poner dependencias si cambian los permisos */]);

  return (
    <div className="w-full mx-auto bg-white overflow-hidden">
      <div className="w-full">
        <nav className={styles.labNav}>
          {tieneVista("Radiografía de Torax") && <button
            className={`${styles.labNavButton}${
              activeTab === 0 ? " " + styles.labNavButtonActive : ""
            }`}
            onClick={() => setActiveTab(0)}
          >
            <FontAwesomeIcon icon={faXRay} className="mr-2" /> Radiografía de
            Tórax P.A.
          </button>}
          {tieneVista("Radiografía de Columna") &&<button
            className={`${styles.labNavButton}${
              activeTab === 1 ? " " + styles.labNavButtonActive : ""
            }`}
            onClick={() => setActiveTab(1)}
          >
            <FontAwesomeIcon icon={faXRay} className="mr-2" /> Radiografía
            Columna
          </button>}
          {tieneVista("Consentimiento Mujeres") &&<button
            className={`${styles.labNavButton}${
              activeTab === 2 ? " " + styles.labNavButtonActive : ""
            }`}
            onClick={() => setActiveTab(2)}
          >
            <FontAwesomeIcon icon={faXRay} className="mr-2" /> Consentimiento
            Mujeres
          </button>}
        </nav>
        <div className="p-6  max-w-[95%] mx-auto">
          {activeTab === 0 &&  <RayosXToraxPA /> }
          {activeTab === 1 && <RayosXColumna />}
          {activeTab === 2 && <ConsentimientoMujerRayosX />}
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
