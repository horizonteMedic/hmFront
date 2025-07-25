import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBroom, 
  faSearch, 
  faFileAlt, 
  faCalendarAlt, 
  faLightbulb,
  faComments,
  faPrint,
  faFileMedical,
  faClipboardList
} from '@fortawesome/free-solid-svg-icons';

const OdontologiaReportes = () => {
  const [nombre, setNombre] = useState('');
  const [codigo, setCodigo] = useState('');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [filtroOcupacional, setFiltroOcupacional] = useState(false);
  const [filtroClientesConsulta, setFiltroClientesConsulta] = useState(false);

  const handleLimpiar = () => {
    setNombre('');
    setCodigo('');
    setFechaDesde('');
    setFechaHasta('');
    setFiltroOcupacional(false);
    setFiltroClientesConsulta(false);
  };

  const handleBuscarImprimirFicha = () => {
    console.log('Buscando e imprimiendo ficha para:', nombre, codigo);
  };

  const handleEjecutarConsulta = () => {
    console.log('Ejecutando consulta con filtros:', {
      nombre,
      codigo,
      fechaDesde,
      fechaHasta,
      filtroOcupacional,
      filtroClientesConsulta
    });
  };

  return (
    <div className="w-full p-4 space-y-6">
      <div className="flex gap-2 w-full bg-gray-50 p-2">
        {/* IZQUIERDA 50% */}
        <div className="w-1/2 bg-white rounded shadow p-4 space-y-6">
          {/* Sección de búsqueda */}
          <Section title="Búsqueda de Pacientes">
            <div className="flex gap-2 items-center w-full max-w-full">
              <span className="font-medium text-lg">Buscar:</span>
              <input
                name="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value.toUpperCase())}
                className="border rounded px-2 py-1 text-lg flex-1 min-w-0"
                style={{ maxWidth: 400 }}
                placeholder="Ingrese nombre"
              />
             
              <span className="font-medium text-lg ml-2">
                Código:
              </span>
              <input
                name="code"
                value={codigo}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    setCodigo(value);
                  }
                }}
                className="border rounded px-2 py-1 text-lg"
                style={{ width: 120 }}
                placeholder="Código"
              />
            </div>
          </Section>

          {/* Sección de reportes */}
          <Section >
            <h3 className="font-semibold text-red-600 text-xl mb-4">
              <FontAwesomeIcon icon={faFileMedical} className="mr-2" />
              Reportes de Trabajos
            </h3>
            
            <div className="bg-gray-50 p-4 rounded-md space-y-4">
              <div>
                <label className="block text-gray-700 mb-2 font-semibold text-lg">Buscar por Fechas:</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <span className="mr-2 font-medium">Desde:</span>
                    <div className="relative flex-1">
                      <input
                        type="date"
                        value={fechaDesde}
                        onChange={(e) => setFechaDesde(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 pr-10 text-lg"
                      />
                      <FontAwesomeIcon 
                        icon={faCalendarAlt} 
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      />
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2 font-medium">Hasta:</span>
                    <div className="relative flex-1">
                      <input
                        type="date"
                        value={fechaHasta}
                        onChange={(e) => setFechaHasta(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 pr-10 text-lg"
                      />
                      <FontAwesomeIcon 
                        icon={faCalendarAlt} 
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2 font-semibold text-lg">Filtrar por:</label>
                <div className="flex items-center gap-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filtroOcupacional}
                      onChange={() => setFiltroOcupacional(!filtroOcupacional)}
                      className="mr-2 w-4 h-4 text-blue-600"
                    />
                    <span className="text-gray-700 text-lg">Ocupacionales</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filtroClientesConsulta}
                      onChange={() => setFiltroClientesConsulta(!filtroClientesConsulta)}
                      className="mr-2 w-4 h-4 text-blue-600"
                    />
                    <span className="text-gray-700 text-lg">Clientes Consulta</span>
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end">
                <ActionButton 
                  onClick={handleEjecutarConsulta} 
                  color="blue" 
                  icon={faComments}
                >
                  Ejecutar Consulta
                </ActionButton>
              </div>
            </div>
          </Section>

          {/* Acciones */}
          <div className="flex gap-4 pt-4 border-t border-gray-200">
            <ActionButton onClick={handleLimpiar} color="yellow" icon={faBroom}>
              Limpiar
            </ActionButton>
          </div>
        </div>

        {/* DERECHA 50% */}
        <div className="w-1/2 bg-white rounded shadow p-4 flex flex-col gap-4">
          <Table />
        </div>
      </div>
    </div>
  );
};

// Componente Tabla sin registros
function Table() {
  return (
    <div className="overflow-y-auto" style={{ maxHeight: 'calc(12 * 4rem)' }}>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-blue-100">
            <th className="border px-2 py-1 text-left" style={{ fontSize: '13px', fontWeight: 'bold' }}>
              <FontAwesomeIcon icon={faClipboardList} className="mr-1" />
              N° Or...
            </th>
            <th className="border px-2 py-1 text-left" style={{ fontSize: '13px', fontWeight: 'bold' }}>
              <FontAwesomeIcon icon={faFileMedical} className="mr-1" />
              Nombres y Apellidos
            </th>
            <th className="border px-2 py-1 text-left" style={{ fontSize: '13px', fontWeight: 'bold' }}>
              <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
              Fecha
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={3} className="text-center py-4 text-gray-500" style={{ fontSize: '13px', fontWeight: 'bold' }}>
              No hay datos
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// Componente Section
function Section({ title, children }) {
  return (
    <div className="space-y-2">
      {title && <h3 className="font-semibold text-blue-700 text-xl">{title}</h3>}
      {children}
    </div>
  );
}

// Componente ActionButton con colores del ejemplo
function ActionButton({ color, icon, onClick, children }) {
  const bg = {
    green:  'bg-green-600 hover:bg-green-700',
    yellow: 'bg-yellow-400 hover:bg-yellow-500',
    blue:   'bg-blue-600 hover:bg-blue-700',
    red:    'bg-red-500 hover:bg-red-600'
  }[color];
  
  return (
    <button
      onClick={onClick}
      className={`${bg} text-white px-4 py-2 rounded flex items-center gap-2 text-lg transition-colors`}
    >
      <FontAwesomeIcon icon={icon} />
      {children}
    </button>
  );
}

export default OdontologiaReportes;
