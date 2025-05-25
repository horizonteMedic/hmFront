import React, { useState, useRef } from 'react';
import { Convert, GetCC, GetCintura, GetCuello, GetFC, GetICC, GetIMC, GetPA, GetSat } from './Conversiones';
import { Clean, GetInfoPac, GetListTriajeMult, GetListTriajeMulttable, GetTable, handleNombreChange, handleSubmit, SearchHC, VerifyTR } from './Controller';
import { getFetch } from '../../getFetch/getFetch';
import Swal from 'sweetalert2';
import { useEffect } from 'react';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';

const Triaje = ({token,selectedSede}) => {
  //Para la busqueda
  const today = new Date();
  const debounceTimeout = useRef(null);
  // Estado para tab principal
  const [activeTab, setActiveTab] = useState('datos');
  // Estado para tab interno de triaje/espiro
  const [tabTriaje, setTabTriaje] = useState('triaje');

  // Estado para formulario de datos
  const [form, setForm] = useState({
    ocupacional: true,
    asistencial: false,
    nro: '',
    nomExam: '',
    empresa: '',
    contrata: '',
    nroHistorial: '',
    nombres: '',
    apellidos: '',
    edad: '',
    fechaNac: '',
    fechaExamen: format(today, 'yyyy-MM-dd'),
    recibo: false,
    nOrden: true,
  });

  // Estado para información de triaje
  const [triaje, setTriaje] = useState({
    talla: '', peso: '', imc: '', cintura: '', icc: '',
    cadera: '', temperatura: '', fCardiaca: '', sat02: '', perimetroCuello: '',
    sistolica: '', diastolica: '', fRespiratoria: '',
    diagnostico: '',
  });

  // Estado para búsqueda
  const [busqueda, setBusqueda] = useState({
    tipoPaciente: false,
    tipoOcupacional: true,
    codigo: '',
    nombres: '',
  });
  const [refresh, setRefresh] = useState(0)
  const [habilitar, setHabilitar] = useState(true )
  const [habilitarTR, setHabilitarTR] = useState(false )
  // Ejemplo de datos de tabla
  const [tablehc, setTablehc] = useState([])
  const [loadingInputs, setLoadingInputs] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [resumenFecha, setResumenFecha] = useState(format(new Date(), 'yyyy-MM-dd'));

  useEffect(() => {
    if (busqueda.codigo === "" && busqueda.nombres === "") {
      GetTable(busqueda.codigo,busqueda.nombres,selectedSede,token,setTablehc)
    }
  },[busqueda.codigo,busqueda.nombres,refresh])

  // Handlers
  const handleFormChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };
  const handleTriajeChange = e => {
    const { name, value } = e.target;
    if (/^\d{0,15}$/.test(value)) {
      setTriaje(prev => ({ ...prev, [name]: value }));
    }
  };
  const handleBusquedaChange = e => {
    const { name, value, type, checked } = e.target;
    setBusqueda(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };
  const handleTR = () => {
    setTriaje({talla: '', peso: '', imc: '', cintura: '', icc: '',
    cadera: '', temperatura: '', fCardiaca: '', sat02: '', perimetroCuello: '',
    sistolica: '', diastolica: '', fRespiratoria: '',
    diagnostico: ''})
  }
  const refreshtable = () => {
    setRefresh(refresh + 1)
  }
  console.log(triaje)

  // Calcular resumen de pacientes para la fecha seleccionada
  const pacientesDelDia = tablehc.filter(row => row.fecha_apertura_po && row.fecha_apertura_po.startsWith(resumenFecha));
  const completados = pacientesDelDia.filter(row => (row.estado || '').toLowerCase().includes('complet')).length;
  const faltantes = pacientesDelDia.filter(row => (row.estado || '').toLowerCase().includes('falta')).length;

  // Modifica la función para cargar datos al hacer click izquierdo y mostrar loading
  const handleRowClick = async (row) => {
    setLoadingInputs(true);
    await new Promise(res => setTimeout(res, 800));
    await GetListTriajeMulttable(row.n_orden, setForm, setTriaje, getFetch, token, setHabilitarTR, setHabilitar);
    setLoadingInputs(false);
  };

  // Click derecho: primero muestra alerta de carga, luego la de impresión según la conexión
  const handleRowContextMenu = async (e, row) => {
    e.preventDefault();
    Swal.fire({
      title: '<span style="font-size:1.3em;font-weight:bold;">Cargando Hoja de Ruta</span>',
      html: `<div style=\"font-size:1.1em;\">N° <b style='color:#2563eb;'>${row.n_orden}</b> - <span style='color:#0d9488;font-weight:bold;'>${row.nombres}</span></div><div class='mt-2'>Espere por favor...</div>` ,
      icon: 'info',
      background: '#f0f6ff',
      color: '#22223b',
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      customClass: {
        popup: 'swal2-border-radius',
        title: 'swal2-title-custom',
        htmlContainer: 'swal2-html-custom',
      },
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      },
      didOpen: () => {
        Swal.showLoading();
      }
    });
    try {
      await getFetch(`/api/v01/ct/triaje/listarFormatoTriaje/${row.n_orden}`, token);
    } catch (error) {
      Swal.close();
      Swal.fire('Error', 'No se pudo cargar la hoja de ruta', 'error');
      return;
    }
    Swal.close();
    Swal.fire({
      title: '<span style="font-size:1.3em;font-weight:bold;">¿Desea Imprimir Hoja de Ruta?</span>',
      html: `<div style=\"font-size:1.1em;\">N° <b style='color:#2563eb;'>${row.n_orden}</b> - <span style='color:#0d9488;font-weight:bold;'>${row.nombres.split(' ').slice(0,2).join(' ')}</span></div>` ,
      icon: 'question',
      background: '#f0f6ff',
      color: '#22223b',
      showCancelButton: true,
      confirmButtonText: 'Sí, Imprimir',
      cancelButtonText: 'Cancelar',
      customClass: {
        popup: 'swal2-border-radius',
        title: 'swal2-title-custom',
        htmlContainer: 'swal2-html-custom',
        confirmButton: 'swal2-confirm-custom',
        cancelButton: 'swal2-cancel-custom',
      },
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        import('./Controller').then(mod => mod.GetJasper(row.n_orden, token));
      }
    });
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full">
      {/* Columna 1 */}
      <div className="bg-white rounded shadow p-4 min-w-[400px]  w-full md:w-[45%]">
        {/* Tab principal */}
        <div className="flex border-b mb-4">
          <button
            className={`px-4 py-2 font-semibold text-base ${activeTab === 'datos' ? 'border-b-2 border-blue-700 text-blue-700' : 'text-gray-500'}`}
            onClick={() => setActiveTab('datos')}
          >
            Datos
          </button>
        </div>
        {/* Contenido de Tab principal */}
        {activeTab === 'datos' && (
          <form className="space-y-3 text-md">
            <div className="flex gap-3 items-center">
              <label className="font-medium"><input type="checkbox" name="ocupacional" checked={form.ocupacional} onChange={handleFormChange}/> Ocupacional</label>
              <label className="font-medium"><input type="checkbox" name="asistencial" checked={form.asistencial} onChange={handleFormChange}/> Asistencial</label>
            </div>
            <div className="flex gap-2 items-center">
              <label className="font-medium">Nro.: <input style={{fontSize: '2rem', fontWeight: 800}} className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-2 text-xl font-bold text-black focus:outline-none focus:ring-2 focus:ring-blue-200 w-56 text-center shadow-sm" autoComplete='off' name="nro" value={form.nro} onChange={handleFormChange} 
              onKeyUp={(event) => {if(event.key === 'Enter')handleTR(),VerifyTR(form,getFetch,token,setForm,setTriaje,selectedSede,setHabilitarTR,setHabilitar)/*GetInfoPac(form,setForm,getFetch,token,selectedSede)*/}}/></label>
              <button type="button" onClick={() => {handleTR(),VerifyTR(form,getFetch,token,setForm,setTriaje,selectedSede,setHabilitarTR,setHabilitar)}} className="bg-blue-600 hover:bg-blue-700 border border-blue-700 rounded px-3 py-2 text-md flex items-center text-white font-semibold transition-colors duration-150">
                <i className="fa fa-search mr-2"></i>Buscar
              </button>
              <label className="font-medium ml-2"><input type="radio" name="recibo" checked={form.recibo} onChange={() => setForm(f => ({...f, recibo: true, nOrden: false}))}/> Recibo</label>
              <label className="font-medium ml-2"><input type="radio" name="nOrden" checked={form.nOrden} onChange={() => setForm(f => ({...f, nOrden: true, recibo: false}))}/> N° Orden</label>
            </div>
            {form.nroHistorial && (
              <div className="bg-blue-50 text-gray-500 rounded px-4 py-2 mb-2 w-fit mx-auto border border-blue-100 shadow-sm flex items-center justify-center">
                <span style={{fontSize: '2.5rem', fontWeight: 800, color: '#222'}}> {form.nroHistorial} </span>
              </div>
            )}
            <div className="flex items-center gap-x-1 mb-2">
              <label className="font-medium min-w-[90px]">Ex.Médico :</label>
              {loadingInputs ? <div className="animate-pulse bg-gray-200 rounded h-8 flex-1" /> :
              <input className="border rounded px-1 flex-1 text-md h-8" placeholder="" name="nomExam" value={form.nomExam} onChange={handleFormChange} disabled={habilitar}/>}
            </div>
            <div className="flex items-center gap-x-1 mb-2">
              <label className="font-medium min-w-[90px]">Empresa :</label>
              {loadingInputs ? <div className="animate-pulse bg-gray-200 rounded h-8 flex-1" /> :
              <input className="border rounded px-1 flex-1 text-md h-8" placeholder="" name="empresa" value={form.empresa} onChange={handleFormChange} disabled={habilitar}/>}
            </div>
            <div className="flex items-center gap-x-1 mb-2">
              <label className="font-medium min-w-[90px]">Contrata :</label>
              {loadingInputs ? <div className="animate-pulse bg-gray-200 rounded h-8 flex-1" /> :
              <input className="border rounded px-1 flex-1 text-md h-8" placeholder="" name="contrata" value={form.contrata} onChange={handleFormChange} disabled={habilitar}/>}
            </div>
            <div className="flex items-center gap-x-1 mb-2">
              <label className="font-medium min-w-[90px]">N° Historial :</label>
              {loadingInputs ? <div className="animate-pulse bg-gray-200 rounded h-8 flex-1" /> :
              <input className="border rounded px-1 flex-1 text-md h-8" placeholder="" name="nroHistorial" value={form.nroHistorial} onChange={handleFormChange} disabled={habilitar}/>}
            </div>
            <div className="flex items-center gap-x-1 mb-2">
              <label className="font-medium min-w-[90px]">Nombres :</label>
              {loadingInputs ? <div className="animate-pulse bg-gray-200 rounded h-8 flex-1" /> :
              <input className="border rounded px-1 flex-1 text-md h-8" placeholder="" name="nombres" value={form.nombres} onChange={handleFormChange} disabled={habilitar}/>}
              <label className="font-medium ml-2 min-w-[50px]">Edad:</label>
              {loadingInputs ? <div className="animate-pulse bg-gray-200 rounded h-8 w-24" /> :
              <input className="border rounded px-1 w-24 text-md h-8" placeholder="" name="edad" value={form.edad} onChange={handleFormChange} disabled={habilitar}/>}
            </div>
            <div className="flex items-center gap-x-1 mb-2">
              <label className="font-medium min-w-[90px]">Apellidos :</label>
              {loadingInputs ? <div className="animate-pulse bg-gray-200 rounded h-8 flex-1" /> :
              <input className="border rounded px-1 flex-1 text-md h-8" placeholder="" name="apellidos" value={form.apellidos} onChange={handleFormChange} disabled={habilitar}/>}
            </div>
            <div className="flex items-center gap-x-1 mb-2">
              <label className="font-medium min-w-[90px]">Fecha Nac:</label>
              {loadingInputs ? <div className="animate-pulse bg-gray-200 rounded h-8 w-40" /> :
              <input className="border rounded px-1 text-md h-8 w-40" type="date" name="fechaNac" value={form.fechaNac} onChange={handleFormChange} disabled={habilitar}/>}
              <label className="font-medium ml-2 min-w-[90px]">Fecha Triaje:</label>
              {loadingInputs ? <div className="animate-pulse bg-gray-200 rounded h-8 w-40" /> :
              <DatePicker id="fechaExamen" value={form.fechaExamen} onChange={(date) => {setForm(d => ({...d, fechaExamen: (format(date, "yyyy-MM-dd"))}))}} dateFormat="yyyy/MM/dd" className="border rounded px-1 text-md h-8 w-40"/>}
            </div>
            {/* Tabs internos para Triaje/Espirometría */}
            <fieldset className="border rounded p-2 mt-2">
              <div className="flex border-b mb-2">
                <button
                  type="button"
                  className={`px-3 py-1 font-semibold text-base ${tabTriaje === 'triaje' ? 'border-b-2 border-blue-700 text-blue-700' : 'text-gray-500'}`}
                  onClick={() => setTabTriaje('triaje')}
                >
                  Ingresar Información Triaje
                </button>
                <button
                  type="button"
                  className={`px-3 py-1 font-semibold text-base ${tabTriaje === 'espiro' ? 'border-b-2 border-blue-700 text-blue-700' : 'text-gray-500'}`}
                  onClick={() => setTabTriaje('espiro')}
                >
                  Espirometría
                </button>
              </div>
              {tabTriaje === 'triaje' && (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                    <div>
                      {/* Inputs con shimmer si loadingInputs */}
                      <div className="flex items-center mb-1">
                        <label className="w-24 font-medium">Talla:</label>
                        {loadingInputs ? <div className="animate-pulse bg-gray-200 rounded w-20 h-8 ml-1" /> :
                        <input disabled={habilitarTR} className="border rounded px-1 w-20 text-md ml-1" autoComplete='off' id="talla" placeholder="m." name="talla" value={triaje.talla} onChange={handleTriajeChange}
                        onKeyUp={(event) => {Convert(event,triaje,setTriaje,Swal)}}/>}
                      </div>
                      <div className="flex items-center mb-1">
                        <label className="w-24 font-medium">Peso:</label>
                        {loadingInputs ? <div className="animate-pulse bg-gray-200 rounded w-20 h-8 ml-1" /> :
                        <input disabled={habilitarTR} className="border rounded px-1 w-20 text-md ml-1" id="peso" autoComplete='off' placeholder="Kg." name="peso" value={triaje.peso} onChange={handleTriajeChange}
                        onKeyUp={(event) => {GetIMC(event,triaje,setTriaje,Swal)}}/>}
                      </div>
                      <div className="flex items-center mb-1">
                        <label className="w-24 font-medium">IMC:</label>
                        {loadingInputs ? <div className="animate-pulse bg-gray-200 rounded w-20 h-8 ml-1" /> :
                        <input className="border rounded px-1 w-20 text-md ml-1" disabled autoComplete='off' name="imc" value={triaje.imc} onChange={handleTriajeChange}/>}
                      </div>
                      <div className="flex items-center mb-1">
                        <label className="w-24 font-medium">Cintura:</label>
                        {loadingInputs ? <div className="animate-pulse bg-gray-200 rounded w-20 h-8 ml-1" /> :
                        <input disabled={habilitarTR} className="border rounded px-1 w-20 text-md ml-1" id="cintura" autoComplete='off' name="cintura" value={triaje.cintura} onChange={handleTriajeChange}
                        onKeyUp={(event) => {GetCintura(event,triaje,setTriaje,Swal)}}/>}
                      </div>
                      <div className="flex items-center mb-1">
                        <label className="w-24 font-medium">ICC:</label>
                        {loadingInputs ? <div className="animate-pulse bg-gray-200 rounded w-20 h-8 ml-1" /> :
                        <input className="border rounded px-1 w-20 text-md ml-1" disabled autoComplete='off' name="icc" value={triaje.icc} onChange={handleTriajeChange}/>}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center mb-1">
                        <label className="w-32 font-medium">Cadera:</label>
                        {loadingInputs ? <div className="animate-pulse bg-gray-200 rounded w-24 h-8 ml-1" /> :
                        <input disabled={habilitarTR} className="border rounded px-1 w-24 text-md ml-1" id="cadera" name="cadera" autoComplete='off' value={triaje.cadera} onChange={handleTriajeChange}
                         onKeyUp={(event) => {GetICC(event,triaje,setTriaje,Swal)}}/>}
                      </div>
                      <div className="flex items-center mb-1">
                        <label className="w-32 font-medium">Temperatura:</label>
                        {loadingInputs ? <div className="animate-pulse bg-gray-200 rounded w-24 h-8 ml-1" /> :
                        <input disabled={habilitarTR} className="border rounded px-1 w-24 text-md ml-1" id="temperatura" name="temperatura" autoComplete='off' value={triaje.temperatura} onChange={handleTriajeChange}
                        onKeyUp={(event) => {GetCC(event,triaje,setTriaje,Swal)}}/>}
                      </div>
                      <div className="flex items-center mb-1">
                        <label className="w-32 font-medium">F. Cardiaca:</label>
                        {loadingInputs ? <div className="animate-pulse bg-gray-200 rounded w-24 h-8 ml-1" /> :
                        <input disabled={habilitarTR} className="border rounded px-1 w-24 text-md ml-1" id="fCardiaca" name="fCardiaca" autoComplete='off' value={triaje.fCardiaca} onChange={handleTriajeChange}
                        onKeyUp={(event) => {GetFC(event,triaje,setTriaje,Swal)}}/>}
                      </div>
                      <div className="flex items-center mb-1">
                        <label className="w-32 font-medium">SAT. 02:</label>
                        {loadingInputs ? <div className="animate-pulse bg-gray-200 rounded w-24 h-8 ml-1" /> :
                        <input disabled={habilitarTR} className="border rounded px-1 w-24 text-md ml-1" id="sat02" name="sat02" autoComplete='off' value={triaje.sat02} onChange={handleTriajeChange}
                        onKeyUp={(event) => {GetSat(event,triaje,setTriaje,Swal)}}/>}
                      </div>
                      <div className="flex items-center mb-1">
                        <label className="w-32 font-medium">Perímetro Cuello:</label>
                        {loadingInputs ? <div className="animate-pulse bg-gray-200 rounded w-24 h-8 ml-1" /> :
                        <input disabled={habilitarTR} className="border rounded px-1 w-24 text-md ml-1" id="perimetroCuello" name="perimetroCuello" autoComplete='off' value={triaje.perimetroCuello} onChange={handleTriajeChange}
                        onKeyUp={(event) => {GetCuello(event,triaje,setTriaje,Swal)}}/>}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-2 items-end">
                    <fieldset className="border rounded p-2 flex-1 min-w-[250px]">
                      <legend className="text-md text-blue-700 font-semibold">Presión Sistémica</legend>
                      <div className="flex flex-wrap gap-2 items-center mb-1">
                        <label className="font-medium w-20">Sistólica:</label>
                        <input disabled={habilitarTR} className="border rounded px-1 w-20 text-md ml-1" placeholder="mm Hg" id="sistolica" name="sistolica" value={triaje.sistolica} onChange={handleTriajeChange}
                        onKeyDown={(event) => {if(event.key === 'Enter')document.getElementById('diastolica')?.focus()}}/>
                        <label className="font-medium w-20 ml-4">Diastólica:</label>
                        <input disabled={habilitarTR} className="border rounded px-1 w-20 text-md ml-1" placeholder="mm Hg" id="diastolica" name="diastolica" value={triaje.diastolica} onChange={handleTriajeChange}
                        onKeyDown={(event) => {GetPA(event,triaje,setTriaje,Swal)}}/>
                        <label className="font-medium w-32 ml-4">F. Respiratoria:</label>
                        <input disabled={habilitarTR} className="border rounded px-1 w-32 text-md ml-1 " id="fRespiratoria" name="fRespiratoria" value={triaje.fRespiratoria} onChange={handleTriajeChange}
                        onKeyDown={(event) => {if(event.key === 'Enter')document.getElementById('registrarTR')?.focus()}}/>
                      </div>
                    </fieldset>
                  </div>
                  <textarea
                    disabled={habilitarTR}
                    className="border rounded px-1 w-full mt-2 text-md resize-none overflow-hidden "
                    style={{padding: '10px'}}
                    placeholder="Diagnóstico"
                    name="diagnostico"
                    value={triaje.diagnostico}
                    onChange={(e) => {
                      setTriaje(d => ({...d,diagnostico: e.target.value.toUpperCase()}));
                      e.target.style.height = 'auto';
                      e.target.style.height = e.target.scrollHeight + 'px';
                    }}
                    rows="1"
                    ref={el => {
                      if (el) {
                        el.style.height = 'auto';
                        el.style.height = el.scrollHeight + 'px';
                      }
                    }}
                    onInput={e => {
                      e.target.style.height = 'auto';
                      e.target.style.height = e.target.scrollHeight + 'px';
                    }}
                  />
                  <div className="flex gap-3 mt-2">
                    <button type="button" onClick={() => {setHabilitar(false),setHabilitarTR(false)}}  className="bg-blue-500 text-white px-3 py-1 rounded text-md">
                      <i className="fa fa-pencil mr-2"></i>Editar
                    </button>
                    <button type="button" onClick={() => {handleSubmit(triaje,form.edad,form.nro, form.fechaExamen, Swal, token,setForm,setTriaje,refreshtable,getFetch,setHabilitar)}} id='registrarTR' className="bg-green-500 text-white px-3 py-1 rounded text-md">
                      <i className="fa fa-save mr-2"></i>Registrar/Actualizar
                    </button>
                    <button type="button" onClick={() => {Clean(setForm,setTriaje),setHabilitar(true)}} id='cleanTR' className="bg-yellow-400 text-white px-3 py-1 rounded text-md">
                      <i className="fa fa-eraser mr-2"></i>Limpiar/Cancelar
                    </button>
                  </div>
                </div>
              )}
              {tabTriaje === 'espiro' && (
                <div className="p-4 text-gray-400 text-md">Espirometría (en desarrollo)</div>
              )}
            </fieldset>
          </form>
        )}
      </div>
      {/* Columna 2 */}
      <div className="bg-white rounded shadow p-4 min-w-[400px]  w-full md:w-[55%]">
        {/* Filtro de pacientes/código/nombres */}
        <div className="border rounded p-2 mb-2">
          <div className="flex gap-3 items-center mb-2 text-md">
            <label className="font-medium"><input type="checkbox" name="tipoPaciente" checked={busqueda.tipoPaciente} onChange={handleBusquedaChange}/> Pacientes</label>
            <label className="font-medium"><input type="checkbox" name="tipoOcupacional" checked={busqueda.tipoOcupacional} onChange={handleBusquedaChange}/> Ocupacional</label>
            <label className="ml-2 font-medium">Código: <input autoComplete='off' className="border rounded px-1 w-24 text-md" name="codigo" value={busqueda.codigo} onKeyUp={(event) => {SearchHC(event,busqueda,setTablehc,selectedSede,token)}}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d{0,7}$/.test(value)) { // máximo 7 dígitos numéricos
                setBusqueda(prev => ({
                  ...prev,
                  codigo: value,
                  nombres: ""
                }));
              }
            }}/></label>
          </div>
          <input className="border rounded px-1 w-full mb-2 text-md" placeholder="Nombres" name="nombres" value={busqueda.nombres} onChange={(e) => {handleNombreChange(e,setBusqueda,setTablehc,selectedSede,token,debounceTimeout)}}/>
        </div>
        {/* Resumen de pacientes y fecha */}
        <div className="mb-2">
          <div className="font-bold mb-1">Últimos Agregados & Hojas de Ruta</div>
          <div className="flex flex-col md:flex-row items-center justify-between bg-blue-50 rounded-lg px-4 py-3 border border-blue-100">
            <div className="flex items-center gap-2 mb-2 md:mb-0">
              <span className="font-semibold">Fecha:</span>
              <input
                type="date"
                className="border rounded px-2 py-1 text-md"
                value={resumenFecha}
                onChange={e => setResumenFecha(e.target.value)}
                style={{minWidth: '120px'}}
              />
            </div>
            <div className="flex gap-6 text-lg font-semibold">
              <span className="text-gray-700">Pacientes completados: <span className="text-green-600">{completados}</span></span>
              <span className="text-gray-700">Pacientes faltantes: <span className="text-red-600">{faltantes}</span></span>
            </div>
          </div>
        </div>
        {/* Número de historia clínica destacado */}
        {form.nroHistorial && (
          <div className="bg-blue-50 text-gray-500 text-2xl font-extrabold rounded px-4 py-2 mb-2 w-fit mx-auto border border-blue-100 shadow-sm flex items-center justify-center">
            <span style={{fontSize: '2.5rem', fontWeight: 800, color: '#222'}}> {form.nroHistorial} </span>
          </div>
        )}
        <div className="border rounded">
          {/* Texto informativo arriba de la tabla */}
          <div className="bg-blue-50 text-blue-700 px-2 py-1 text-sm font-medium border-b border-blue-200 mb-1">(Click izquierdo para importar datos  |  Click derecho para imprimir)</div>
          <div className="overflow-x-auto overflow-y-auto" style={{maxHeight: '535px'}}> {/* SCROLL VERTICAL Y HORIZONTAL */}
            <table className="w-full text-md border border-gray-300 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gradient-to-r from-blue-100 to-blue-300 text-center">
                  <th className="font-bold">N°</th>
                  <th>Nombre</th>
                  <th>Fecha</th>
                  <th>Empresa</th>
                  <th>Contrata</th>
                  <th>T.Examen</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {tablehc.length == 0  && <tr><td className="border border-gray-300 px-2 py-1 mb-1 text-center" colSpan={7}>Cargando...</td></tr>}
                {tablehc.map((row, i) => (
                  <tr
                    key={i}
                    className={`text-center cursor-pointer transition-all duration-200
                      ${row.color === 'AMARILLO' ? 'bg-[#ffff00]' : row.color === 'VERDE' ? 'bg-[#00ff00]' : row.color === 'ROJO' ? 'bg-[#ff6767]' : ''}
                      ${hoveredRow !== null && hoveredRow !== i ? 'relative after:content-[""] after:absolute after:inset-0 after:bg-black after:opacity-25 after:pointer-events-none' : ''}`}
                    style={{zIndex: 1, position: 'relative'}}
                    onClick={() => handleRowClick(row)}
                    onContextMenu={(e) => handleRowContextMenu(e, row)}
                    onMouseEnter={() => setHoveredRow(i)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <td className="font-bold border-b border-gray-200 py-1">{row.n_orden}</td>
                    <td className="border-b border-gray-200 py-1">{row.nombres}</td>
                    <td className="border-b border-gray-200 py-1">{row.fecha_apertura_po}</td>
                    <td className="border-b border-gray-200 py-1">{row.razon_empresa}</td>
                    <td className="border-b border-gray-200 py-1">{row.razon_contrata}</td>
                    <td className="border-b border-gray-200 py-1">{row.nom_examen}</td>
                    <td className="border-b border-gray-200 py-1">{row.estado}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Triaje; 