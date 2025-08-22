import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXRay } from "@fortawesome/free-solid-svg-icons";
import styles from "./RayosX.module.css";
import RayosXToraxPA from "./rayosXToraxPA/RayosXToraxPA";
import RayosXColumna from "./rayosXColumna/RayosXColumna";
import ConsentimientoMujerRayosX from "./consentimientoMujer/ConsentimientoMujerRayosX";

export default function RayosXTabSelector() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="w-full mx-auto bg-white overflow-hidden">
      <div className="w-full">
        <nav className={styles.labNav}>
          <button
            className={`${styles.labNavButton}${
              activeTab === 0 ? " " + styles.labNavButtonActive : ""
            }`}
            onClick={() => setActiveTab(0)}
          >
            <FontAwesomeIcon icon={faXRay} className="mr-2" /> Radiografía de
            Tórax P.A.
          </button>
          <button
            className={`${styles.labNavButton}${
              activeTab === 1 ? " " + styles.labNavButtonActive : ""
            }`}
            onClick={() => setActiveTab(1)}
          >
            <FontAwesomeIcon icon={faXRay} className="mr-2" /> Radiografía
            Columna
          </button>
          <button
            className={`${styles.labNavButton}${
              activeTab === 2 ? " " + styles.labNavButtonActive : ""
            }`}
            onClick={() => setActiveTab(2)}
          >
            <FontAwesomeIcon icon={faXRay} className="mr-2" /> Consentimiento
            Mujeres
          </button>
        </nav>
        <div className="p-6  max-w-[95%] mx-auto">
          {activeTab === 0 && <RayosXToraxPA />}
          {activeTab === 1 && <RayosXColumna />}
          {activeTab === 2 && <ConsentimientoMujerRayosX />}
        </div>
      </div>
    </div>
  );
};
