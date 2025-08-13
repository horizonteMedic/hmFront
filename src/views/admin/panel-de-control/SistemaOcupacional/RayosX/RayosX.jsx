import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXRay } from "@fortawesome/free-solid-svg-icons";
import styles from "./RayosX.module.css";
import RayosXToraxPA from "./RayosXToraxPA";
import RayosXColumna from "./RayosXColumna";
import ConsentimientoMujerRayosX from "./consentimientoMujer/ConsentimientoMujerRayosX";

const RayosX = ({ token, selectedSede, userlogued }) => {
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
            <FontAwesomeIcon icon={faXRay} className="mr-2" /> Consentimiento Mujeres
          </button>
        </nav>
        <div className="p-6  max-w-[95%] mx-auto">
          {activeTab === 0 && (
            <RayosXToraxPA
              token={token}
              selectedSede={selectedSede}
              userlogued={userlogued}
            />
          )}
          {activeTab === 1 && (
            <RayosXColumna
              token={token}
              selectedSede={selectedSede}
              userlogued={userlogued}
            />
          )}
          {activeTab === 2 && (
            <ConsentimientoMujerRayosX
              token={token}
              selectedSede={selectedSede}
              userlogued={userlogued}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default RayosX;
