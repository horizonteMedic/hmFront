import React, { useState } from 'react';
import styles from './HistoriaOcupacional.module.css';

const HistoriaOcupacional = () => {
  const [nroOrden, setNroOrden] = useState('');
  // Simulación: nombre se llena automáticamente al ingresar nroOrden
  const nombreCompleto = nroOrden ? 'Juan Pérez Gómez' : '';

  return (
    <div className={styles.historiaOcupacionalContainer}>
      <h1 className={styles.tituloPrincipal}>HISTORIAL OCUPACIONAL</h1>
      <fieldset className={styles.fieldset}>
        <legend>Datos Historia ocupacional</legend>
        <div className={styles.rowCampos}>
          <div className={styles.campoGrupo}>
            <label>N° Orden :</label>
            <input
              type="text"
              className={styles.inputSmall}
              value={nroOrden}
              onChange={e => setNroOrden(e.target.value)}
              placeholder=""
            />
          </div>
          <div className={styles.campoGrupo}>
            <label>Nombres y Apellidos :</label>
            <input
              type="text"
              className={styles.inputLarge}
              value={nombreCompleto}
              disabled
              placeholder="Nombre y Apellido"
            />
          </div>
          <div className={styles.campoGrupo}>
            <label>Área de Trabajo :</label>
            <input type="text" className={styles.inputXLarge} />
          </div>
          <div className={styles.campoGrupo}>
            <label>Fecha :</label>
            <input type="text" className={styles.inputSmall} placeholder="dd/mm/aa" />
          </div>
        </div>
      </fieldset>
      <div className={styles.tableWrapper}>
        <table className={styles.historiaTable}>
          <thead>
            <tr>
              <th rowSpan={2}>Año</th>
              <th rowSpan={2}>Empresa - Lugar Geográfico</th>
              <th rowSpan={2}>Altitud</th>
              <th rowSpan={2}>Actividad</th>
              <th rowSpan={2}>Área Empresa</th>
              <th rowSpan={2}>Ocupación</th>
              <th colSpan={2} style={{textAlign: 'center'}}>Tiempo de Labor</th>
              <th rowSpan={2}>Riesgos</th>
              <th rowSpan={2}>Protección</th>
            </tr>
            <tr>
              <th>Superficie</th>
              <th>Socavón</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><input type="text" className={styles.inputTable} /></td>
              <td><input type="text" className={styles.inputTable} /></td>
              <td><input type="text" className={styles.inputTable} /></td>
              <td><input type="text" className={styles.inputTable} /></td>
              <td><input type="text" className={styles.inputTable} /></td>
              <td><input type="text" className={styles.inputTable} /></td>
              <td><input type="text" className={styles.inputTable} /></td>
              <td><input type="text" className={styles.inputTable} /></td>
              <td><input type="text" className={styles.inputTable} /></td>
              <td><input type="text" className={styles.inputTable} /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoriaOcupacional; 