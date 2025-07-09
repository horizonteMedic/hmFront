import React, { useEffect, useState } from 'react';
import styles from './HistoriaOcupacional.module.css';
import { handleSearch, handleSelect, PrintHojaR, SubmiteHistoriaOcupacionalController, VerifyTR } from './controller/controllerHO';
import { getFetch } from '../../getFetch/getFetch';
import Swal from 'sweetalert2';
import AutoResizeInput from './Inputs';

  const date = new Date();
  const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const tabla = 'historia_oc_info'

  const riesgosOptions = [
    {id: 1, title: 'INTERIOR MINA', mensaje:'MOV. Y POSICIONES DISERGONOMICAS, MOVIMIENTO REPETITIVOS, ALTAS TEMPERATURAS, HUMEDAD, POLVO, EXPLOSIONES, APLASTAMIENTOS, DESCARGAS ELECTRICAS, INTOXICACION POR GASES, GOLPE, CAIDAS, RUIDO'},
    {id: 1, title: 'MINA (SUPERFICIE O TAJO ABIERTO)', mensaje:'MOV. Y POSICIONES DISERGONOMICAS, MOVIMIENTOS REPETITIVOS, HUMEDAD, INSOLACION'},
    {id: 1, title: 'COCINA (COCINEROS O AYUDANTES DE COCINA)', mensaje:'MOV. Y POSICIONES DISERGONOMICAS, QUEMADURAS, VAPORES ORGANICOS Y QUIMICOS, CORTES, CAIDAS'},
    {id: 1, title: 'ALMACEN', mensaje:'MOV. Y POSICIONES DISERGONOMICAS, MOVIMIENTOS REPETITIVOS, DERRUMBAMIENTO DE OBJETOS, QUEMADURAS, CORTES, CAIDAS DE ALTURA DE 1.80M, FRACTURAS'},
    {id: 1, title: 'SOLDADOR', mensaje:'MOV. Y POSICIONES DISERGONOMICAS, MOVIMIENTOS REPETITIVOS, QUEMADURAS, DESCARGAS ELECTRICAS, ELECTROCUCION, GOLPES, CORTES, CAIDAS SOBRE 1.8 M, RUIDO'},
    {id: 1, title: 'OPERADOR DE EQUIPO PESADO', mensaje:'MOV. Y POSICIONES DISERGONOMICAS, MOVIMIENTOS REPETITIVOS, VIBRACIONES, RUIDO, ESFUERZO VISUAL, INSOLACION, RUIDO'},
    {id: 1, title: 'VALLIJERO', mensaje:'MOV. Y POSICIONES DISERGONOMICAS, MOVIMIENTOS REPETITIVOS, HUMEDAD, DERMATITIS'},
    {id: 1, title: 'AZAFATA', mensaje:'MOV. Y POSICIONES DISERGONOMICAS, TENDINITIS  ESTOS SON LOS RIESGOS QUE ELLAS MANEJAN ACTUALIZADOS'},
  ];
  const proteccionOptions = [
    {id: 1, mensaje:'CASCO,LENTES,TAPONES AUDITIVOS,RESPIRADOR,CHALECO DE SEGURIDAD, OVERALL, GUANTES,ZAPATOS DE SEGURIDAD'},
    {id: 2, mensaje:'MANDIL, MANDILON'},
    {id: 3, mensaje:'CHALECO ANTIBALAS'},
    {id: 4, mensaje:'EPPS BASICOS : "CASCO, LENTES, GUANTES,OVERAL,ZAPATOS DE SEGURIDAD"'},
    {id: 5, mensaje:'EPPS COMPLETO : "CASCO, LENTES, GUANTES,TAPONES AUDITIVOS,RESPIRADOR, OREJERAS,ZAPATOS DE SEGURIDAD"'},
    {id: 6, mensaje:'NINGUNO'}
  ];

const HistoriaOcupacional = ({token,userlogued,selectedSede,listas,userDatos}) => {
  const [nroOrden, setNroOrden] = useState('');
  // Simulación: nombre se llena automáticamente al ingresar nroOrden
  const nombreCompleto = nroOrden ? 'Juan Pérez Gómez' : '';
  const [form, setForm] = useState({
    norden: "",
    nombres: "",
    fecha: today,
    //Area de trabajo
    areaO: "",
    dni: "",
    dniUser: userDatos.datos.dni_user,
    nombreUser: userDatos.datos.nombres_user
  })
  const [rowData, setRowData] = useState({
    fecha: '',
    empresa: '',
    altitud: '',
    actividad: '',
    areaEmpresa: '',
    ocupacion: '',
    superficie: '',
    socavon: '',
    riesgo: '',
    proteccion: '',
  });

  const [registros, setRegistros] = useState([]);
  //AUTOCOMPLETABLES
  const [searchEmpresa, setSearchEmpresa]  = useState("");
  const [searchAltitud, setSearchAltitud]  = useState("");
  const [searchArea, setSearchArea]  = useState("");
  const [searchRiesgo, setSearchRiesgo]  = useState("");
  const [searchProt, setSearchProt]  = useState("");

  const [filteredEmpresa, setFilteredEmpresa] = useState([]);
  const [filteredAltitud, setFilteredAltitud] = useState([]);
  const [filteredArea, setFilteredArea] = useState([]);
  const [filteredRiesgo, setFilteredRiesgo] = useState([]);
  const [filteredProt, setFilteredProt] = useState([]);
  
  //listas
  const {EmpresasMulti,AlturaMulti,AreaMulti} = listas
  // Opciones random de ejemplo para los selects
  //ALGUNOS YA TREEN DATOS DE VERITAS

  

  const handleRowChange = (field, value) => {
    const numero = Number(value); // solo para lógica de control

    if (field === 'socavon') {
      setRowData(prev => ({
        ...prev,
        socavon: value, // se guarda como string
        superficie: numero !== 0 ? '0' : prev.superficie  // se resetea si socavon no es 0
      }));
      return;
    }

    if (field === 'superficie') {
      setRowData(prev => ({
        ...prev,
        superficie: value,
        socavon: numero !== 0 ? '0' : prev.socavon
      }));
      return;
    }

    setRowData(prev => ({ ...prev, [field]: value }));
  };

  const getAñoInicial = (fecha) => {
    const match = fecha.match(/\d{4}/); // Busca el primer año (4 dígitos)
    return match ? parseInt(match[0], 10) : Infinity;
  };

  const handleRegistrar = async () => {
    // Validar que al menos año y empresa estén llenos (puedes ajustar la validación)
    if (!rowData.fecha || !rowData.empresa){
      await Swal.fire("Error","Faltan datos","error")
      return
    } 
    const nuevaLista = [...registros, rowData];
     nuevaLista.sort((a, b) => getAñoInicial(a.fecha) - getAñoInicial(b.fecha));
    setRegistros(nuevaLista);
    setRowData({
      fecha: '',
      empresa: '',
      altitud: '',
      actividad: '',
      areaEmpresa: '',
      ocupacion: '',
      superficie: '',
      socavon: '',
      riesgo: '',
      proteccion: '',
    });
    setSearchEmpresa("")
    setSearchAltitud("")
    setSearchArea("")
    setSearchRiesgo("")
    setSearchProt("")
  };

  const handleClean = () => {
    setForm({
      norden: "",
    nombres: "",
    fecha: today,
    })
    setRowData({
      fecha: '',
      empresa: '',
      altitud: '',
      actividad: '',
      areaEmpresa: '',
      ocupacion: '',
      superficie: '',
      socavon: '',
      riesgo: '',
      proteccion: '',
    })
    setRegistros([])
    setSearchEmpresa("")
    setSearchAltitud("")
    setSearchArea("")
  }

  const handleset = () => {
    setForm(f => ({
      ...f,
      nombres: "",
      fecha: today,
    }))
    setRegistros([])
    setSearchEmpresa("")
    setSearchAltitud("")
    setSearchArea("")
  }

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value.toUpperCase() });
  };

 const handleEditChange = (index, field, value) => {
    setRegistros(prev =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  
  const handlePrint = () => {
    if (!form.norden) return Swal.fire('Error', 'Debe colocar un N° Orden', 'error')
    Swal.fire({
      title: '¿Desea Imprimir Hepatitis?',
      html: `<div style='font-size:1.1em;margin-top:8px;'><b style='color:#5b6ef5;'>N° Orden: ${form.norden}</b></div>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, Imprimir',
      cancelButtonText: 'Cancelar',
      customClass: {
        title: 'swal2-title',
        confirmButton: 'swal2-confirm',
        cancelButton: 'swal2-cancel'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        PrintHojaR(form.norden,token,tabla);
      }
    });
  }
  
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
              name='norden'
              className={styles.inputSmall}
              value={form.norden}
              onKeyUp={(event) => {
                if (event.key === 'Enter'){
                  handleset()
                  VerifyTR(form.norden, tabla, token, setForm, selectedSede,setRegistros);
                }
              }}
              onChange={e => handleInputChange(e)}
              placeholder=""
              style={{ fontSize: 13, color: '#000' }}
            />
          </div>
          <div className={styles.campoGrupo}>
            <label style={{ color: '#000' }}>Nombres y Apellidos :</label>
            <input
              type="text"
              className={styles.inputLarge}
              value={form.nombres}
              name='nombres'
              disabled
              placeholder="Nombre y Apellido"
              style={{ fontSize: 13, color: '#000' }}
            />
          </div>
          <div className={styles.campoGrupo}>
            <label style={{ color: '#000' }}>Área de Trabajo :</label>
            <input type="text" value={form.areaO} name='areaO' onChange={handleInputChange} className={styles.inputXLarge} style={{ fontSize: 13, color: '#000' }} />
          </div>
          <div className={styles.campoGrupo}>
            <label style={{ color: '#000' }}>Fecha :</label>
            <input type="date" value={form.fecha} onChange={handleInputChange} name='fecha' className={`${styles.inputSmall} w-auto`} placeholder="dd/mm/aa" style={{ fontSize: 13, color: '#000' }} />
          </div>
        </div>
      </fieldset>
      <div className={styles.tableWrapper}>
        <table className={styles.historiaTable} style={{ fontSize: 13, color: '#000' }}>
          <thead >
            <tr >
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
              <th>Socavon</th>
              <th>Superficie</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td> <AutoResizeInput value={rowData.fecha} onChange={e => handleRowChange('fecha', e.target.value)}/></td>
              <td><AutoResizeInput value={rowData.empresa} onChange={e => handleRowChange('empresa', e.target.value)} /></td>
              <td><AutoResizeInput value={rowData.altitud} onChange={e => handleRowChange('altitud', e.target.value)} /></td>
              <td><AutoResizeInput value={rowData.actividad} onChange={e => handleRowChange('actividad', e.target.value)} /></td>
              <td><AutoResizeInput value={rowData.areaEmpresa} onChange={e => handleRowChange('areaEmpresa', e.target.value)}/></td>
              <td><AutoResizeInput value={rowData.ocupacion} onChange={e => handleRowChange('ocupacion', e.target.value)}/></td>
              <td><AutoResizeInput value={rowData.socavon} onChange={e => handleRowChange('socavon', e.target.value)} /></td>
              <td><AutoResizeInput value={rowData.superficie} onChange={e => handleRowChange('superficie', e.target.value)} /></td>
              <td><AutoResizeInput value={rowData.riesgo} onChange={e => handleRowChange('riesgo', e.target.value)} /></td>
              <td><AutoResizeInput value={rowData.proteccion} onChange={e => handleRowChange('proteccion', e.target.value)}/></td>   
            </tr>
          </tbody>
        </table>
      </div>

      {/* Buscadores debajo de la tabla */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2em', marginTop: 24, alignItems: 'flex-end' }}>
        {/*EMPRESA*/}
        <div className='relative'>
          <div className='flex flex-col items-center justify-center'>
              <label htmlFor="">Empresas</label>
              <input type="text" autoComplete='off' className={styles.inputLarge} value={searchEmpresa} name='empresa'
                onChange={(e) => {handleSearch(e,setSearchEmpresa,handleRowChange,setFilteredEmpresa,EmpresasMulti)}}
                onKeyUp={(e) => {
                  if (e.key === "Enter" && filteredEmpresa.length > 0) {
                    e.preventDefault();
                    handleSelect(e,e.target.name,filteredEmpresa[0].mensaje,setSearchEmpresa,handleRowChange,setFilteredEmpresa);
                  }
                }}
                onBlur={() => setTimeout(() => setFilteredEmpresa([]), 100)}/>
              {searchEmpresa && filteredEmpresa.length > 0 && (
                <ul className="absolute inset-x-0 top-full bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto z-10">
                  {filteredEmpresa.map((opt) => (
                    <li
                      key={opt.id}
                      className="cursor-pointer px-3 py-2 hover:bg-gray-100 text-lg font-bold"
                      onMouseDown={(e) => handleSelect(e,'empresa',opt.mensaje,setSearchEmpresa,handleRowChange,setFilteredEmpresa)}
                    >
                      {opt.mensaje}
                    </li>
                  ))}
                </ul>
              )}
          </div>
          
        </div>
        {/*ALTITUD*/}
        <div className='relative'>
          <div className='flex flex-col items-center justify-center'>
              <label htmlFor="">Altitud</label>
              <input type="text" autoComplete='off' className={styles.inputLarge} value={searchAltitud} name='altitud'
              onChange={(e) => {handleSearch(e,setSearchAltitud,handleRowChange,setFilteredAltitud,AlturaMulti)}}
              onKeyUp={(e) => {
                if (e.key === "Enter" && filteredAltitud.length > 0) {
                  e.preventDefault();
                  handleSelect(e,e.target.name,filteredAltitud[0].mensaje,setSearchAltitud,handleRowChange,setFilteredAltitud);
                }
              }}
              onBlur={() => setTimeout(() => setFilteredAltitud([]), 100)}/>
              {searchAltitud && filteredAltitud.length > 0 && (
                <ul className="absolute inset-x-0 top-full bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto z-10">
                  {filteredAltitud.map((opt) => (
                    <li
                      key={opt.id}
                      name="altitud"
                      className="cursor-pointer px-3 py-2 hover:bg-gray-100 text-lg font-bold"
                      onMouseDown={(e) => handleSelect(e,'altitud',opt.mensaje,setSearchAltitud,handleRowChange,setFilteredAltitud)}
                    >
                      {opt.mensaje}
                    </li>
                  ))}
                </ul>
              )}
          </div> 
        </div>
        {/*AREAS*/}
        <div className='relative'>
          <div className='flex flex-col items-center justify-center'>
            <label htmlFor="">Areas</label>
              <input type="text" autoComplete='off' className={styles.inputLarge} value={searchArea} name='areaEmpresa'
            onChange={(e) => {handleSearch(e,setSearchArea,handleRowChange,setFilteredArea,AreaMulti)}}
            onKeyUp={(e) => {
              if (e.key === "Enter" && filteredArea.length > 0) {
                e.preventDefault();
                handleSelect(e,e.target.name,filteredArea[0].mensaje,setSearchArea,handleRowChange,setFilteredArea);
              }
            }}
            onBlur={() => setTimeout(() => setFilteredArea([]), 100)}/>
            {searchArea && filteredArea.length > 0 && (
              <ul className="absolute inset-x-0 top-full bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto z-10">
                {filteredArea.map((opt) => (
                  <li
                    key={opt.id}
                    name="areaEmpresa"
                    className="cursor-pointer px-3 py-2 hover:bg-gray-100 text-lg font-bold"
                    onMouseDown={(e) => handleSelect(e,'areaEmpresa',opt.mensaje,setSearchArea,handleRowChange,setFilteredArea)}
                  >
                    {opt.mensaje}
                  </li>
                ))}
              </ul>
            )}
          </div>
            
        </div>
        {/*RIESGOS */}
        <div className='relative'>
          <div className='flex flex-col items-center justify-center'>
            <label htmlFor="">Riesgos</label>
              <input type="text" autoComplete='off' className={styles.inputLarge} value={searchRiesgo} name='riesgo'
            onChange={(e) => {handleSearch(e,setSearchRiesgo,handleRowChange,setFilteredRiesgo,riesgosOptions)}}
            onKeyUp={(e) => {
              if (e.key === "Enter" && filteredRiesgo.length > 0) {
                e.preventDefault();
                handleSelect(e,e.target.name,filteredRiesgo[0].mensaje,setSearchRiesgo,handleRowChange,setFilteredRiesgo);
              }
            }}
            onBlur={() => setTimeout(() => setFilteredRiesgo([]), 100)}/>
            {searchRiesgo && filteredRiesgo.length > 0 && (
              <ul className="absolute inset-x-0 top-full bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto z-10">
                {filteredRiesgo.map((opt) => (
                  <li
                    key={opt.id}
                    name="riesgo"
                    className="cursor-pointer px-3 py-2 hover:bg-gray-100 text-lg font-bold"
                    onMouseDown={(e) => handleSelect(e,'riesgo',opt.mensaje,setSearchRiesgo,handleRowChange,setFilteredRiesgo)}
                  >
                    {opt.title}
                  </li>
                ))}
              </ul>
            )}
          </div>   
        </div>
        {/*EPPS*/}
        <div className='relative'>
          <div className='flex flex-col items-center justify-center'>
            <label htmlFor="">Protección</label>
              <input type="text" autoComplete='off' className={styles.inputLarge} value={searchProt} name='proteccion'
            onChange={(e) => {handleSearch(e,setSearchProt,handleRowChange,setFilteredProt,proteccionOptions)}}
            onKeyUp={(e) => {
              if (e.key === "Enter" && filteredProt.length > 0) {
                e.preventDefault();
                handleSelect(e,e.target.name,filteredProt[0].mensaje,setSearchProt,handleRowChange,setFilteredProt);
              }
            }}
            onBlur={() => setTimeout(() => setFilteredProt([]), 100)}/>
            {searchProt && filteredProt.length > 0 && (
              <ul className="absolute inset-x-0 top-full bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto z-10">
                {filteredProt.map((opt) => (
                  <li
                    key={opt.id}
                    name="proteccion"
                    className="cursor-pointer px-3 py-2 hover:bg-gray-100 text-lg font-bold"
                    onMouseDown={(e) => handleSelect(e,'proteccion',opt.mensaje,setSearchProt,handleRowChange,setFilteredProt)}
                  >
                    {opt.mensaje}
                  </li>
                ))}
              </ul>
            )}
          </div>   
        </div>
        <button
          type="button"
          style={{ height: 32, marginLeft: 'auto', background: '#233245', color: '#fff', border: 'none', borderRadius: 4, padding: '0 16px', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}
          onClick={handleRegistrar}
        >
          <i className="fas fa-plus"></i> Registrar
        </button>
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
                    <td><AutoResizeInput value={reg.fecha}  onChange={e => handleEditChange(idx, 'fecha', e.target.value)}/></td>
                    <td><AutoResizeInput value={reg.empresa}  onChange={e => handleEditChange(idx, 'empresa', e.target.value)}/></td>
                    <td><AutoResizeInput value={reg.altitud}  onChange={e => handleEditChange(idx, 'altitud', e.target.value)}/></td>
                    <td><AutoResizeInput value={reg.actividad}  onChange={e => handleEditChange(idx, 'actividad', e.target.value)}/></td>
                    <td><AutoResizeInput value={reg.areaEmpresa}  onChange={e => handleEditChange(idx, 'areaEmpresa', e.target.value)}/></td>
                    <td><AutoResizeInput value={reg.ocupacion}  onChange={e => handleEditChange(idx, 'ocupacion', e.target.value)}/></td>
                    <td><AutoResizeInput value={reg.superficie}  onChange={e => handleEditChange(idx, 'superficie', e.target.value)}/></td>
                    <td><AutoResizeInput value={reg.socavon}  onChange={e => handleEditChange(idx, 'socavon', e.target.value)}/></td>
                    <td><AutoResizeInput value={reg.riesgo}  onChange={e => handleEditChange(idx, 'riesgo', e.target.value)}/></td>
                    <td><AutoResizeInput value={reg.proteccion}  onChange={e => handleEditChange(idx, 'proteccion', e.target.value)}/></td>
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
            <input type="text" value={form.norden} name='norden' onChange={handleInputChange} style={{ width: 80, marginLeft: 8, border: '1px solid #ccc', borderRadius: 3, padding: '2px 6px', fontSize: 13, color: '#000' }} />
            <button onClick={handlePrint} style={{ marginLeft: 4, background: 'none', border: 'none', cursor: 'pointer', color: '#000', fontSize: 16 }}>
              <i className="fas fa-print"></i>
            </button>
          </div>
        </div>
        <fieldset style={{ border: '1px solid #bbb', borderRadius: 4, padding: 8, minWidth: 260 }}>
          <button onClick={() => {SubmiteHistoriaOcupacionalController(form,token,userlogued,handleClean,tabla,registros)}} style={{ height: 32, background: '#059669', color: '#fff', border: 'none', borderRadius: 3, padding: '0 16px', marginRight: 8, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', fontSize: 13 }}>
            <i className="fas fa-save" style={{ marginRight: 6 }}></i> Guardar/Actualizar
          </button>
          <button onClick={handleClean} style={{ height: 32, background: '#fc6b03', color: '#fff', border: 'none', borderRadius: 3, padding: '0 16px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', fontSize: 13 }}>
            <i className="fas fa-broom" style={{ marginRight: 6 }}></i> Limpiar
          </button>
        </fieldset>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginLeft: 16 }}>
          <div>
            DNI Responsable : <input type="text" disabled value={form.dniUser} className='p-2' style={{ width: 100, marginLeft: 4, fontSize: 13, color: '#000' ,  border: '1px solid #ccc', borderRadius:'5px'}} />
          </div>
          <div className='flex justify-center items-center w-auto'>
            Nombres: <input type="text" disabled value={form.nombreUser} className='p-2 w-full' style={{  marginLeft: 4, fontSize: 13, color: '#000', border: '1px solid #ccc', borderRadius:'5px' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoriaOcupacional; 