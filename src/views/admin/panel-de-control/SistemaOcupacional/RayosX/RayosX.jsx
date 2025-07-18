import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXRay } from '@fortawesome/free-solid-svg-icons';
import styles from './RayosX.module.css';
import RayosXToraxPA from './RayosXToraxPA';
import RayosXColumna from './RayosXColumna';

const RayosX = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div style={{ maxWidth: '90%', margin: '0 auto', background: 'white', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', overflow: 'hidden', padding: '2rem 0 2rem 0' }}>
      <div style={{ width: '100%', padding: '0 1.5rem' }}>
        <h1 className="text-3xl font-bold mb-4 text-center">Rayos X</h1>
        <nav className={styles.labNav}>
          <button
            className={`${styles.labNavButton}${activeTab === 0 ? ' ' + styles.labNavButtonActive : ''}`}
            onClick={() => setActiveTab(0)}
          >
            <FontAwesomeIcon icon={faXRay} className="mr-2" /> Radiografía de Tórax P.A.
          </button>
          <button
            className={`${styles.labNavButton}${activeTab === 1 ? ' ' + styles.labNavButtonActive : ''}`}
            onClick={() => setActiveTab(1)}
          >
            <FontAwesomeIcon icon={faXRay} className="mr-2" /> Radiografía Columna
          </button>
        </nav>
        <div className={styles.labContent}>
          {activeTab === 0 && (
            <RayosXToraxPA />
          )}
          {activeTab === 1 && (
            <RayosXColumna />
          )}
        </div>
      </div>
    </div>
  );
};

export default RayosX; 