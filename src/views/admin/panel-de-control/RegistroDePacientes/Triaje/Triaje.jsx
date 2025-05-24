import React, { useState, useRef } from 'react';
import { Convert, GetCC, GetCintura, GetCuello, GetFC, GetICC, GetIMC, GetPA } from './Conversiones';
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
  // Ejemplo de datos de tabla
  const [tablehc, setTablehc] = useState([])

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

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full">
      {/* Columna 1 */}
      <div className="flex-1 bg-white rounded shadow p-4 min-w-[350px]">
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
              <label className="font-medium">Nro.: <input className="border rounded px-1 text-md w-24" autoComplete='off' name="nro" value={form.nro} onChange={handleFormChange} 
              onKeyUp={(event) => {if(event.key === 'Enter')handleTR(),VerifyTR(form,getFetch,token,setForm,setTriaje,selectedSede)/*GetInfoPac(form,setForm,getFetch,token,selectedSede)*/}}/></label>
              <button type="button" onClick={() => {handleTR(),VerifyTR(form,getFetch,token,setForm,setTriaje,selectedSede)}} className="bg-yellow-200 border rounded px-2 text-md flex items-center"><span role="img" aria-label="buscar" className="mr-1">🔍</span>buscar</button>
              <label className="font-medium ml-2"><input type="radio" name="recibo" checked={form.recibo} onChange={() => setForm(f => ({...f, recibo: true, nOrden: false}))}/> Recibo</label>
              <label className="font-medium ml-2"><input type="radio" name="nOrden" checked={form.nOrden} onChange={() => setForm(f => ({...f, nOrden: true, recibo: false}))}/> N° Orden</label>
            </div>
            <div className="flex items-center gap-x-2 mb-2">
              <label className="font-medium">Ex.Médico :</label>
              <input className="border rounded px-1 flex-1 text-md" placeholder="" name="nomExam" value={form.nomExam} onChange={handleFormChange} disabled={habilitar}/>
            </div>
            <div className="flex items-center gap-x-2 mb-2">
              <label className="font-medium">Empresa :</label>
              <input className="border rounded px-1 flex-1 text-md" placeholder="" name="empresa" value={form.empresa} onChange={handleFormChange} disabled={habilitar}/>
            </div>
            <div className="flex items-center gap-x-2 mb-2">
              <label className="font-medium">Contrata :</label>
              <input className="border rounded px-1 flex-1 text-md" placeholder="" name="contrata" value={form.contrata} onChange={handleFormChange} disabled={habilitar}/>
            </div>
            <div className="flex items-center gap-x-2 mb-2">
              <label className="font-medium">N° Historial :</label>
              <input className="border rounded px-1 flex-1 text-md" placeholder="" name="nroHistorial" value={form.nroHistorial} onChange={handleFormChange} disabled={habilitar}/>
            </div>
            <div className="flex items-center gap-x-2 mb-2">
              <label className="font-medium">Nombres :</label>
              <input className="border rounded px-1 flex-1 text-md" placeholder="" name="nombres" value={form.nombres} onChange={handleFormChange} disabled={habilitar}/>
              <label className="font-medium ml-2">Edad:</label>
              <input className="border rounded px-1 w-24 text-md" placeholder="" name="edad" value={form.edad} onChange={handleFormChange} disabled={habilitar}/>
            </div>
            <div className="flex items-center gap-x-2 mb-2">
              <label className="font-medium">Apellidos :</label>
              <input className="border rounded px-1 flex-1 text-md" placeholder="" name="apellidos" value={form.apellidos} onChange={handleFormChange} disabled={habilitar}/>
            </div>
            <div className="flex items-center gap-x-2 mb-2">
              <label className="font-medium">Fecha Nac:</label>
              <input className="border rounded px-1 text-md" type="date" name="fechaNac" value={form.fechaNac} onChange={handleFormChange} disabled={habilitar}/>
              <label className="font-medium ml-2">Fecha Triaje:</label>
              <DatePicker id="fechaExamen" value={form.fechaExamen} onChange={(date) => {setForm(d => ({...d, fechaExamen: (format(date, "yyyy-MM-dd"))}))}} dateFormat="yyyy/MM/dd" className="border rounded px-1 text-md"/>
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
                      <div className="flex items-center mb-1">
                        <label className="w-24 font-medium">Talla:</label>
                        <input className="border rounded px-1 w-20 text-md ml-1" autoComplete='off' id="talla" placeholder="m." name="talla" value={triaje.talla} onChange={handleTriajeChange}
                        onKeyUp={(event) => {Convert(event,triaje,setTriaje,Swal)}}/>
                      </div>
                      <div className="flex items-center mb-1">
                        <label className="w-24 font-medium">Peso:</label>
                        <input className="border rounded px-1 w-20 text-md ml-1" id="peso" autoComplete='off' placeholder="Kg." name="peso" value={triaje.peso} onChange={handleTriajeChange}
                        onKeyUp={(event) => {GetIMC(event,triaje,setTriaje,Swal)}}/>
                      </div>
                      <div className="flex items-center mb-1">
                        <label className="w-24 font-medium">IMC:</label>
                        <input className="border rounded px-1 w-20 text-md ml-1" disabled autoComplete='off' name="imc" value={triaje.imc} onChange={handleTriajeChange}/>
                      </div>
                      <div className="flex items-center mb-1">
                        <label className="w-24 font-medium">Cintura:</label>
                        <input className="border rounded px-1 w-20 text-md ml-1" id="cintura" autoComplete='off' name="cintura" value={triaje.cintura} onChange={handleTriajeChange}
                        onKeyUp={(event) => {GetCintura(event,triaje,setTriaje,Swal)}}/>
                      </div>
                      <div className="flex items-center mb-1">
                        <label className="w-24 font-medium">ICC:</label>
                        <input className="border rounded px-1 w-20 text-md ml-1" disabled autoComplete='off' name="icc" value={triaje.icc} onChange={handleTriajeChange}/>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center mb-1">
                        <label className="w-32 font-medium">Cadera:</label>
                        <input className="border rounded px-1 w-24 text-md ml-1" id="cadera" name="cadera" autoComplete='off' value={triaje.cadera} onChange={handleTriajeChange}
                         onKeyUp={(event) => {GetICC(event,triaje,setTriaje,Swal)}}/>
                      </div>
                      <div className="flex items-center mb-1">
                        <label className="w-32 font-medium">Temperatura:</label>
                        <input className="border rounded px-1 w-24 text-md ml-1" id="temperatura" name="temperatura" autoComplete='off' value={triaje.temperatura} onChange={handleTriajeChange}
                        onKeyUp={(event) => {GetCC(event,triaje,setTriaje,Swal)}}/>
                      </div>
                      <div className="flex items-center mb-1">
                        <label className="w-32 font-medium">F. Cardiaca:</label>
                        <input className="border rounded px-1 w-24 text-md ml-1" id="fCardiaca" name="fCardiaca" autoComplete='off' value={triaje.fCardiaca} onChange={handleTriajeChange}
                        onKeyUp={(event) => {GetFC(event,triaje,setTriaje,Swal)}}/>
                      </div>
                      <div className="flex items-center mb-1">
                        <label className="w-32 font-medium">SAT. 02:</label>
                        <input className="border rounded px-1 w-24 text-md ml-1" id="sat02" name="sat02" autoComplete='off' value={triaje.sat02} onChange={handleTriajeChange}
                        onKeyDown={(event) => {if(event.key === 'Enter')document.getElementById('perimetroCuello')?.focus()}}/>
                      </div>
                      <div className="flex items-center mb-1">
                        <label className="w-32 font-medium">Perímetro Cuello:</label>
                        <input className="border rounded px-1 w-24 text-md ml-1" id="perimetroCuello" name="perimetroCuello" autoComplete='off' value={triaje.perimetroCuello} onChange={handleTriajeChange}
                        onKeyDown={(event) => {GetCuello(event,triaje,setTriaje,Swal)}}/>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-2 items-end">
                    <fieldset className="border rounded p-2 flex-1">
                      <legend className="text-md text-blue-700 font-semibold">Presión Sistémica</legend>
                      <div className="flex gap-2 items-center mb-1">
                        <label className="font-medium w-20">Sistólica:</label>
                        <input className="border rounded px-1 w-20 text-md ml-1" placeholder="mm Hg" id="sistolica" name="sistolica" value={triaje.sistolica} onChange={handleTriajeChange}
                        onKeyDown={(event) => {if(event.key === 'Enter')document.getElementById('diastolica')?.focus()}}/>
                        <label className="font-medium w-20 ml-4">Diastólica:</label>
                        <input className="border rounded px-1 w-20 text-md ml-1" placeholder="mm Hg" id="diastolica" name="diastolica" value={triaje.diastolica} onChange={handleTriajeChange}
                        onKeyDown={(event) => {GetPA(event,triaje,setTriaje,Swal)}}/>
                      </div>
                    </fieldset>
                    <div className="flex-1 flex items-center ml-4">
                      <label className="font-medium w-32">F. Respiratoria:</label>
                      <input className="border rounded px-1 w-32 text-md ml-1 " id="fRespiratoria" name="fRespiratoria" value={triaje.fRespiratoria} onChange={handleTriajeChange}
                      onKeyDown={(event) => {if(event.key === 'Enter')document.getElementById('registrarTR')?.focus()}}/>
                    </div>
                  </div>
                  <textarea className="border rounded px-1 w-full mt-2 text-md" placeholder="Diagnóstico" name="diagnostico" value={triaje.diagnostico} onChange={(e) => {setTriaje({diagnostico: e.target.value.toUpperCase()})}} rows="1" onInput={(e) => {e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px';}}/>
                  <div className="flex gap-3 mt-2">
                    <button type="button" onClick={() => {setHabilitar(false)}}  className="bg-blue-500 text-white px-3 py-1 rounded text-md">Editar</button>
                    <button type="button" onClick={() => {handleSubmit(triaje,form.edad,form.nro, form.fechaExamen, Swal, token)}} id='registrarTR' className="bg-green-500 text-white px-3 py-1 rounded text-md">Registrar/Actualizar</button>
                    <button type="button" onClick={() => {Clean(setForm,setTriaje)}} id='cleanTR' className="bg-yellow-400 text-white px-3 py-1 rounded text-md">Limpiar/Cancelar</button>
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
      <div className="flex-1 bg-white rounded shadow p-4 min-w-[350px]">
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
        <div className="border rounded">
          <div className="bg-gray-100 px-2 py-1 text-md font-bold">Revisar si registro paciente correctamente</div>
          <table className="w-full text-md">
            <thead>
              <tr className="bg-gray-200 text-center">
                <th>N°</th><th>Nombre</th><th>Fecha</th><th>Empresa</th><th>Contrata</th><th>T.Examen</th><th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {tablehc.length == 0  && <tr><td className="border border-gray-300 px-2 py-1  mb-1">Cargando...</td></tr>}
              {tablehc.map((row, i) => (
                <tr key={i} className={`text-center cursor-pointer ${row.color === 'AMARILLO' ? 'bg-[#ffff00]' : row.color === 'VERDE' ? 'bg-[#00ff00]' : 'bg-[#ff6767]'}`} 
                onClick={() => {GetListTriajeMulttable(row.n_orden,setForm,setTriaje,getFetch,token)}}>
                  <td>{row.n_orden}</td>
                  <td>{row.nombres}</td>
                  <td>{row.fecha_apertura_po}</td>
                  <td>{row.razon_empresa}</td>
                  <td>{row.razon_contrata}</td>
                  <td>{row.nom_examen}</td>
                  <td>{row.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Triaje; 