import React, { useState } from 'react';
import styles from './HistoriaOcupacional.module.css';

const HistoriaOcupacional = () => {
  const [nroOrden, setNroOrden] = useState('');
  // Simulación: nombre se llena automáticamente al ingresar nroOrden
  const nombreCompleto = nroOrden ? 'Juan Pérez Gómez' : '';

  const [rowData, setRowData] = useState({
    ano: '',
    empresa: '',
    altitud: '',
    actividad: '',
    areaEmpresa: '',
    ocupacion: '',
    tiempoSuperficie: '',
    tiempoSocavon: '',
    riesgos: '',
    proteccion: '',
  });

  const [registros, setRegistros] = useState([]);

  // Opciones random de ejemplo para los selects
  const empresaOptions = [
    '',
    'EMPRESA MINERA S.A.',
    'CONSTRUCTORA ANDINA',
    'SERVICIOS GENERALES SAC',
    'INDUSTRIAS DEL SUR',
  ];
  const altitudOptions = [
    '',
    'BAJA (< 1000 MSNM)',
    'MEDIA (1000-2500 MSNM)',
    'ALTA (> 2500 MSNM)',
  ];
  const areaEmpresaOptions = [
    '',
    'PRODUCCIÓN',
    'MANTENIMIENTO',
    'ADMINISTRACIÓN',
    'LOGÍSTICA',
  ];
  const riesgosOptions = [
    '',
    'RUIDO',
    'POLVO',
    'QUÍMICOS',
    'BIOLÓGICOS',
    'ERGONÓMICOS',
  ];
  const proteccionOptions = [
    'CASCOS, LENTES, GUANTES',
    'MANDIL, MADILON',
    'CHALECO ANTIBALA',
    'EPPS BASICO',
    'EPPS COMPLETO',
    'NINGUNO',
  ];

  const handleRowChange = (field, value) => {
    setRowData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegistrar = () => {
    // Validar que al menos año y empresa estén llenos (puedes ajustar la validación)
    if (!rowData.ano || !rowData.empresa) return;
    setRegistros(prev => [...prev, rowData]);
    setRowData({
      ano: '',
      empresa: '',
      altitud: '',
      actividad: '',
      areaEmpresa: '',
      ocupacion: '',
      tiempoSuperficie: '',
      tiempoSocavon: '',
      riesgos: '',
      proteccion: '',
    });
  };

  return (
    <div className={styles.historiaOcupacionalContainer} style={{ fontSize: 13, color: '#000' }}>
      <h1 className={styles.tituloPrincipal} style={{ fontSize: 15, color: '#000', fontWeight: 'bold' }}>HISTORIAL OCUPACIONAL</h1>
      <fieldset className={styles.fieldset}>
        <legend style={{ fontSize: 15, color: '#000' }}>Datos Historia ocupacional</legend>
        <div className={styles.rowCampos}>
          <div className={styles.campoGrupo}>
            <label style={{ color: '#000' }}>N° Orden :</label>
            <input
              type="text"
              className={styles.inputSmall}
              value={nroOrden}
              onChange={e => setNroOrden(e.target.value)}
              placeholder=""
              style={{ fontSize: 13, color: '#000' }}
            />
          </div>
          <div className={styles.campoGrupo}>
            <label style={{ color: '#000' }}>Nombres y Apellidos :</label>
            <input
              type="text"
              className={styles.inputLarge}
              value={nombreCompleto}
              disabled
              placeholder="Nombre y Apellido"
              style={{ fontSize: 13, color: '#000' }}
            />
          </div>
          <div className={styles.campoGrupo}>
            <label style={{ color: '#000' }}>Área de Trabajo :</label>
            <input type="text" className={styles.inputXLarge} style={{ fontSize: 13, color: '#000' }} />
          </div>
          <div className={styles.campoGrupo}>
            <label style={{ color: '#000' }}>Fecha :</label>
            <input type="text" className={styles.inputSmall} placeholder="dd/mm/aa" style={{ fontSize: 13, color: '#000' }} />
          </div>
        </div>
      </fieldset>
      <div className={styles.tableWrapper}>
        <table className={styles.historiaTable} style={{ fontSize: 13, color: '#000' }}>
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
              <td><input type="text" className={styles.inputTable} value={rowData.ano} onChange={e => handleRowChange('ano', e.target.value)} style={{ fontSize: 13, color: '#000' }} /></td>
              <td>{rowData.empresa}</td>
              <td>{rowData.altitud}</td>
              <td><input type="text" className={styles.inputTable} value={rowData.actividad} onChange={e => handleRowChange('actividad', e.target.value)} style={{ fontSize: 13, color: '#000' }} /></td>
              <td>{rowData.areaEmpresa}</td>
              <td><input type="text" className={styles.inputTable} value={rowData.ocupacion} onChange={e => handleRowChange('ocupacion', e.target.value)} style={{ fontSize: 13, color: '#000' }} /></td>
              <td><input type="text" className={styles.inputTable} value={rowData.tiempoSuperficie} onChange={e => handleRowChange('tiempoSuperficie', e.target.value)} style={{ fontSize: 13, color: '#000' }} /></td>
              <td><input type="text" className={styles.inputTable} value={rowData.tiempoSocavon} onChange={e => handleRowChange('tiempoSocavon', e.target.value)} style={{ fontSize: 13, color: '#000' }} /></td>
              <td>{rowData.riesgos}</td>
              <td>{rowData.proteccion}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Preview de registros vacío */}
      {registros.length === 0 && (
        <div style={{
          border: '1px dashed #bbb',
          background: '#f7f7f7',
          color: '#888',
          padding: 24,
          margin: '24px 0',
          borderRadius: 6,
          textAlign: 'center',
          fontSize: 13
        }}>
          Aquí se mostrarán los registros
        </div>
      )}

      {/* Buscadores debajo de la tabla */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2em', marginTop: 24, alignItems: 'flex-end' }}>
        <select
          className={styles.inputLarge}
          value={rowData.empresa}
          onChange={e => handleRowChange('empresa', e.target.value)}
          style={{ minWidth: 180, fontSize: 13, color: '#000' }}
        >
          {empresaOptions.map(opt => (
            <option key={opt} value={opt}>{opt === '' ? 'Empresa...' : opt}</option>
          ))}
        </select>
        <select
          className={styles.inputMedium}
          value={rowData.altitud}
          onChange={e => handleRowChange('altitud', e.target.value)}
          style={{ minWidth: 120, fontSize: 13, color: '#000' }}
        >
          {altitudOptions.map(opt => (
            <option key={opt} value={opt}>{opt === '' ? 'Altitud...' : opt}</option>
          ))}
        </select>
        <select
          className={styles.inputLarge}
          value={rowData.areaEmpresa}
          onChange={e => handleRowChange('areaEmpresa', e.target.value)}
          style={{ minWidth: 180, fontSize: 13, color: '#000' }}
        >
          {areaEmpresaOptions.map(opt => (
            <option key={opt} value={opt}>{opt === '' ? 'Área Empresa...' : opt}</option>
          ))}
        </select>
        <select
          className={styles.inputLarge}
          value={rowData.riesgos}
          onChange={e => handleRowChange('riesgos', e.target.value)}
          style={{ minWidth: 180, fontSize: 13, color: '#000' }}
        >
          {riesgosOptions.map(opt => (
            <option key={opt} value={opt}>{opt === '' ? 'Riesgos...' : opt}</option>
          ))}
        </select>
        <select
          className={styles.inputLarge}
          value={rowData.proteccion}
          onChange={e => handleRowChange('proteccion', e.target.value)}
          style={{ minWidth: 180, fontSize: 13, color: '#000' }}
        >
          <option value="">Protección...</option>
          {proteccionOptions.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <button
          type="button"
          style={{ height: 32, marginLeft: 'auto', background: '#233245', color: '#fff', border: 'none', borderRadius: 4, padding: '0 16px', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}
          onClick={handleRegistrar}
        >
          <i className="fas fa-plus"></i> Registrar
        </button>
      </div>

      {/* Tabla de registros */}
      {registros.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <h3 style={{ fontSize: 15, color: '#000', fontWeight: 'bold' }}>Registros</h3>
          <div className={styles.tableWrapper}>
            <table className={styles.historiaTable} style={{ fontSize: 13, color: '#000' }}>
              <thead>
                <tr>
                  <th>Año</th>
                  <th>Empresa - Lugar Geográfico</th>
                  <th>Altitud</th>
                  <th>Actividad</th>
                  <th>Área Empresa</th>
                  <th>Ocupación</th>
                  <th>Superficie</th>
                  <th>Socavón</th>
                  <th>Riesgos</th>
                  <th>Protección</th>
                </tr>
              </thead>
              <tbody>
                {registros.map((reg, idx) => (
                  <tr key={idx}>
                    <td>{reg.ano}</td>
                    <td>{reg.empresa}</td>
                    <td>{reg.altitud}</td>
                    <td>{reg.actividad}</td>
                    <td>{reg.areaEmpresa}</td>
                    <td>{reg.ocupacion}</td>
                    <td>{reg.tiempoSuperficie}</td>
                    <td>{reg.tiempoSocavon}</td>
                    <td>{reg.riesgos}</td>
                    <td>{reg.proteccion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bloque EPP visual al final */}
      <div style={{
        border: '1px solid #ccc',
        borderRadius: 4,
        marginTop: 40,
        padding: 12,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 16,
        background: '#fafbfc',
        fontSize: 13,
        color: '#000'
      }}>
        <div style={{ fontWeight: 'bold', minWidth: 220, fontSize: 15 }}>
          EPP: Equipo de Protección Personal
          <div style={{ marginTop: 8, fontSize: 13 }}>
            Imprimir N° Orden :
            <input type="text" style={{ width: 80, marginLeft: 8, border: '1px solid #ccc', borderRadius: 3, padding: '2px 6px', fontSize: 13, color: '#000' }} />
            <button style={{ marginLeft: 4, background: 'none', border: 'none', cursor: 'pointer', color: '#000', fontSize: 16 }}>
              <i className="fas fa-print"></i>
            </button>
          </div>
        </div>
        <fieldset style={{ border: '1px solid #bbb', borderRadius: 4, padding: 8, minWidth: 260 }}>
          <button style={{ height: 32, background: '#059669', color: '#fff', border: 'none', borderRadius: 3, padding: '0 16px', marginRight: 8, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', fontSize: 13 }}>
            <i className="fas fa-save" style={{ marginRight: 6 }}></i> Guardar/Actualizar
          </button>
          <button style={{ height: 32, background: '#fc6b03', color: '#fff', border: 'none', borderRadius: 3, padding: '0 16px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', fontSize: 13 }}>
            <i className="fas fa-broom" style={{ marginRight: 6 }}></i> Limpiar
          </button>
        </fieldset>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginLeft: 16 }}>
          <div>
            DNI Responsable : <input type="text" style={{ width: 100, marginLeft: 4, fontSize: 13, color: '#000' ,  border: '1px solid #ccc', borderRadius:'5px'}} />
          </div>
          <div>
            Nombres: <input type="text" style={{ width: 180, marginLeft: 4, fontSize: 13, color: '#000', border: '1px solid #ccc', borderRadius:'5px' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoriaOcupacional; 