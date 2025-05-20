import React, { useState } from 'react';

const Triaje = () => {
  // Estado para tab principal
  const [activeTab, setActiveTab] = useState('datos');
  // Estado para tab interno de triaje/espiro
  const [tabTriaje, setTabTriaje] = useState('triaje');

  // Estado para formulario de datos
  const [form, setForm] = useState({
    ocupacional: false,
    asistencial: false,
    nro: '',
    exMedico: '',
    empresa: '',
    contrata: '',
    nroHistorial: '',
    nombres: '',
    apellidos: '',
    edad: '',
    fechaNac: '',
    fechaTriaje: '',
    recibo: false,
    nOrden: false,
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

  // Ejemplo de datos de tabla
  const tablaEjemplo = [
    { nro: '148731', nombre: 'BIDEL...', fecha: '25/04/2025', empresa: 'CENTR...', contrata: 'CENTR...', tExamen: 'ANUAL', cargo: 'ADMIN...', fAptitud: 'FALTA', estado: '', hEntrada: '12:04:27', hSalida: '' }
  ];

  // Handlers
  const handleFormChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };
  const handleTriajeChange = e => {
    const { name, value } = e.target;
    setTriaje(prev => ({ ...prev, [name]: value }));
  };
  const handleBusquedaChange = e => {
    const { name, value, type, checked } = e.target;
    setBusqueda(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

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
              <label className="font-medium">Nro.: <input className="border rounded px-1 text-md w-24" name="nro" value={form.nro} onChange={handleFormChange} /></label>
              <button type="button" className="bg-yellow-200 border rounded px-2 text-md flex items-center"><span role="img" aria-label="buscar" className="mr-1">🔍</span>buscar</button>
              <label className="font-medium ml-2"><input type="radio" name="recibo" checked={form.recibo} onChange={() => setForm(f => ({...f, recibo: true, nOrden: false}))}/> Recibo</label>
              <label className="font-medium ml-2"><input type="radio" name="nOrden" checked={form.nOrden} onChange={() => setForm(f => ({...f, nOrden: true, recibo: false}))}/> N° Orden</label>
            </div>
            <div className="flex items-center gap-x-2 mb-2">
              <label className="font-medium">Ex.Médico :</label>
              <input className="border rounded px-1 flex-1 text-md" placeholder="" name="exMedico" value={form.exMedico} onChange={handleFormChange} readOnly/>
            </div>
            <div className="flex items-center gap-x-2 mb-2">
              <label className="font-medium">Empresa :</label>
              <input className="border rounded px-1 flex-1 text-md" placeholder="" name="empresa" value={form.empresa} onChange={handleFormChange} readOnly/>
            </div>
            <div className="flex items-center gap-x-2 mb-2">
              <label className="font-medium">Contrata :</label>
              <input className="border rounded px-1 flex-1 text-md" placeholder="" name="contrata" value={form.contrata} onChange={handleFormChange} readOnly/>
            </div>
            <div className="flex items-center gap-x-2 mb-2">
              <label className="font-medium">N° Historial :</label>
              <input className="border rounded px-1 flex-1 text-md" placeholder="" name="nroHistorial" value={form.nroHistorial} onChange={handleFormChange} readOnly/>
            </div>
            <div className="flex items-center gap-x-2 mb-2">
              <label className="font-medium">Nombres :</label>
              <input className="border rounded px-1 flex-1 text-md" placeholder="" name="nombres" value={form.nombres} onChange={handleFormChange} readOnly/>
              <label className="font-medium ml-2">Edad:</label>
              <input className="border rounded px-1 w-24 text-md" placeholder="" name="edad" value={form.edad} onChange={handleFormChange} readOnly/>
            </div>
            <div className="flex items-center gap-x-2 mb-2">
              <label className="font-medium">Apellidos :</label>
              <input className="border rounded px-1 flex-1 text-md" placeholder="" name="apellidos" value={form.apellidos} onChange={handleFormChange} readOnly/>
            </div>
            <div className="flex items-center gap-x-2 mb-2">
              <label className="font-medium">Fecha Nac:</label>
              <input className="border rounded px-1 text-md" type="date" name="fechaNac" value={form.fechaNac} onChange={handleFormChange} readOnly/>
              <label className="font-medium ml-2">Fecha Triaje:</label>
              <input className="border rounded px-1 text-md" type="date" name="fechaTriaje" value={form.fechaTriaje} onChange={handleFormChange} readOnly/>
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
                        <input className="border rounded px-1 w-20 text-md ml-1" placeholder="m." name="talla" value={triaje.talla} onChange={handleTriajeChange}/>
                      </div>
                      <div className="flex items-center mb-1">
                        <label className="w-24 font-medium">Peso:</label>
                        <input className="border rounded px-1 w-20 text-md ml-1" placeholder="Kg." name="peso" value={triaje.peso} onChange={handleTriajeChange}/>
                      </div>
                      <div className="flex items-center mb-1">
                        <label className="w-24 font-medium">IMC:</label>
                        <input className="border rounded px-1 w-20 text-md ml-1" name="imc" value={triaje.imc} onChange={handleTriajeChange}/>
                      </div>
                      <div className="flex items-center mb-1">
                        <label className="w-24 font-medium">Cintura:</label>
                        <input className="border rounded px-1 w-20 text-md ml-1" name="cintura" value={triaje.cintura} onChange={handleTriajeChange}/>
                      </div>
                      <div className="flex items-center mb-1">
                        <label className="w-24 font-medium">ICC:</label>
                        <input className="border rounded px-1 w-20 text-md ml-1" name="icc" value={triaje.icc} onChange={handleTriajeChange}/>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center mb-1">
                        <label className="w-32 font-medium">Cadera:</label>
                        <input className="border rounded px-1 w-24 text-md ml-1" name="cadera" value={triaje.cadera} onChange={handleTriajeChange}/>
                      </div>
                      <div className="flex items-center mb-1">
                        <label className="w-32 font-medium">Temperatura:</label>
                        <input className="border rounded px-1 w-24 text-md ml-1" name="temperatura" value={triaje.temperatura} onChange={handleTriajeChange}/>
                      </div>
                      <div className="flex items-center mb-1">
                        <label className="w-32 font-medium">F. Cardiaca:</label>
                        <input className="border rounded px-1 w-24 text-md ml-1" name="fCardiaca" value={triaje.fCardiaca} onChange={handleTriajeChange}/>
                      </div>
                      <div className="flex items-center mb-1">
                        <label className="w-32 font-medium">SAT. 02:</label>
                        <input className="border rounded px-1 w-24 text-md ml-1" name="sat02" value={triaje.sat02} onChange={handleTriajeChange}/>
                      </div>
                      <div className="flex items-center mb-1">
                        <label className="w-32 font-medium">Perímetro Cuello:</label>
                        <input className="border rounded px-1 w-24 text-md ml-1" name="perimetroCuello" value={triaje.perimetroCuello} onChange={handleTriajeChange}/>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-2 items-end">
                    <fieldset className="border rounded p-2 flex-1">
                      <legend className="text-md text-blue-700 font-semibold">Presión Sistémica</legend>
                      <div className="flex gap-2 items-center mb-1">
                        <label className="font-medium w-20">Sistólica:</label>
                        <input className="border rounded px-1 w-20 text-md ml-1" placeholder="mm Hg" name="sistolica" value={triaje.sistolica} onChange={handleTriajeChange}/>
                        <label className="font-medium w-20 ml-4">Diastólica:</label>
                        <input className="border rounded px-1 w-20 text-md ml-1" placeholder="mm Hg" name="diastolica" value={triaje.diastolica} onChange={handleTriajeChange}/>
                      </div>
                    </fieldset>
                    <div className="flex-1 flex items-center ml-4">
                      <label className="font-medium w-32">F. Respiratoria:</label>
                      <input className="border rounded px-1 w-32 text-md ml-1" name="fRespiratoria" value={triaje.fRespiratoria} onChange={handleTriajeChange}/>
                    </div>
                  </div>
                  <textarea className="border rounded px-1 w-full mt-2 text-md" placeholder="Diagnóstico" name="diagnostico" value={triaje.diagnostico} onChange={handleTriajeChange}/>
                  <div className="flex gap-3 mt-2">
                    <button type="button" className="bg-blue-500 text-white px-3 py-1 rounded text-md">Editar</button>
                    <button type="button" className="bg-green-500 text-white px-3 py-1 rounded text-md">Registrar/Actualizar</button>
                    <button type="button" className="bg-yellow-400 text-white px-3 py-1 rounded text-md">Limpiar/Cancelar</button>
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
            <label className="ml-2 font-medium">Código: <input className="border rounded px-1 w-24 text-md" name="codigo" value={busqueda.codigo} onChange={handleBusquedaChange}/></label>
          </div>
          <input className="border rounded px-1 w-full mb-2 text-md" placeholder="Nombres" name="nombres" value={busqueda.nombres} onChange={handleBusquedaChange}/>
        </div>
        <div className="border rounded">
          <div className="bg-gray-100 px-2 py-1 text-md font-bold">Revisar si registro paciente correctamente</div>
          <table className="w-full text-md">
            <thead>
              <tr className="bg-gray-200">
                <th>N°</th><th>Nombre</th><th>Fecha</th><th>Empresa</th><th>Contrata</th><th>T.Examen</th><th>Cargo</th><th>F.Aptitud</th><th>Estado</th><th>H.Entrada</th><th>H.Salida</th>
              </tr>
            </thead>
            <tbody>
              {tablaEjemplo.map((row, i) => (
                <tr key={i} className="text-center" style={{background: i === 0 ? '#ff0000' : undefined, color: i === 0 ? 'white' : undefined}}>
                  <td>{row.nro}</td><td>{row.nombre}</td><td>{row.fecha}</td><td>{row.empresa}</td><td>{row.contrata}</td><td>{row.tExamen}</td><td>{row.cargo}</td><td>{row.fAptitud}</td><td>{row.estado}</td><td>{row.hEntrada}</td><td>{row.hSalida}</td>
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