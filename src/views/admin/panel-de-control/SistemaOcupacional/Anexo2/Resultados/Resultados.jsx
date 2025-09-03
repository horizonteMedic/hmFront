
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faPlus, faBroom, faPen, faChartBar } from "@fortawesome/free-solid-svg-icons";

const Resultados = () => {
  return (
    <div className="p-6" style={{ fontSize: '11px' }}>
      <h3 className="font-semibold mb-6 text-gray-800">Resultados del Examen Ocupacional</h3>
          
      {/* Primera fila - 3 columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Columna 1 - Aptitud del Paciente */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="font-semibold text-gray-800 mb-4">Aptitud del Paciente</p>
          
          {/* Radio buttons de aptitud */}
          <div className="space-y-3 mb-4">
            <label className="flex items-center">
              <input type="radio" name="aptitud" value="apto" defaultChecked className="mr-3 h-4 w-4" />
              <span>APTO (para el puesto en el que trabaja o postula)</span>
            </label>
            <label className="flex items-center">
              <input type="radio" name="aptitud" value="apto-con-restricciones" className="mr-3 h-4 w-4" />
              <span>APTO CON RESTRICCION (para el puesto en el que trabaja o postula)</span>
            </label>
            <label className="flex items-center">
              <input type="radio" name="aptitud" value="no-apto" className="mr-3 h-4 w-4" />
              <span>NO APTO (para el puesto en el que trabaja o postula)</span>
            </label>
          </div>

          {/* Fechas */}
          <div className="space-y-3 mb-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Fecha:</label>
              <div className="relative">
                <input 
                  type="text" 
                  defaultValue="22/08/2025" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <FontAwesomeIcon icon={faCalendarAlt} className="absolute right-3 top-3 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Fecha Venc.:</label>
              <div className="relative">
                <input 
                  type="text" 
                  defaultValue="22/08/2026" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <FontAwesomeIcon icon={faCalendarAlt} className="absolute right-3 top-3 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Restricciones */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">Restricciones:</label>
            <textarea 
              rows="3" 
              defaultValue="-NINGUNO"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
            />
          </div>
        </div>

        {/* Columna 2 - Recomendaciones y Restricciones */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="font-semibold text-gray-800 mb-4">Recomendaciones y Restricciones</p>
          
          <div className="space-y-2 mb-4">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="">CORREGIR AGUDEZA VISUAL TOTAL PARA TRABAJO SOBRE 1.8 M.S.N.PISO</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="">CORREGIR AGUDEZA VISUAL PARA TRABAJO SOBRE 1.8 M.S.N.PISO</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="">DIETA HIPOCALORICA Y EJERCICIOS</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="">EVITAR MOVIMIENTOS Y POSICIONES DISERGONOMICAS</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="">NO HACER TRABAJO DE ALTO RIESGO</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="">NO HACER TRABAJO SOBRE 1.8 M.S.N.PISO</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="">USO DE EPP AUDITIVO ANTE EXPOSICION A RUIDO {'>='}80 DB</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="">USO DE LENTES CORRECTORES PARA CONDUCIR Y/O OPERAR VEHICULOS MOTORIZADOS</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="">USO DE LENTES CORRECTORES PARA TRABAJO.</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="">USO DE LENTES CORRECTORES PARA TRABAJO SOBRE 1.8 M.S.N.PISO</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="">NINGUNO.</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="">NO CONDUCIR VEHICULOS</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="">USO DE EPP AUDITIVO</span>
            </label>
          </div>

          {/* Botones de operación */}
          <div className="flex space-x-2">
            <button className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ">
              <FontAwesomeIcon icon={faPlus} className="mr-1" />
              Agregar/Actualizar
            </button>
            <button className="flex items-center px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 ">
              <FontAwesomeIcon icon={faBroom} className="mr-1" />
              Limpiar
            </button>
          </div>
        </div>

        {/* Columna 3 - Resultados de Laboratorio */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="font-semibold text-gray-800 mb-4">Resultados de Laboratorio</p>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className=" text-gray-600">V.S.G:</label>
              <input type="text" defaultValue="N/A" className="w-20 px-2 py-1 border border-gray-300 rounded text-center" />
            </div>
            <div className="flex items-center justify-between">
              <label className=" text-gray-600">Glucosa:</label>
              <input type="text" className="w-20 px-2 py-1 border border-gray-300 rounded text-center" />
            </div>
            <div className="flex items-center justify-between">
              <label className=" text-gray-600">Creatinina:</label>
              <input type="text" defaultValue="N/A" className="w-20 px-2 py-1 border border-gray-300 rounded text-center" />
            </div>
            <div className="flex items-center justify-between">
              <label className=" text-gray-600">Marihuana:</label>
              <input type="text" defaultValue="POSITIVO" className="w-20 px-2 py-1 border border-gray-300 rounded text-center bg-gray-200" />
            </div>
            <div className="flex items-center justify-between">
              <label className=" text-gray-600">Cocaina:</label>
              <input type="text" defaultValue="POSITIVO" className="w-20 px-2 py-1 border border-gray-300 rounded text-center bg-gray-200" />
            </div>
            <div className="flex items-center justify-between">
              <label className=" text-gray-600">Hemoglobina / Hema...:</label>
              <div className="flex items-center">
                <input type="text" className="w-20 px-2 py-1 border border-gray-300 rounded text-center" />
                <span className="ml-1  text-gray-500">gr. %</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Segunda fila - Estado del Paciente (1 columna) */}
      <div className="mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="font-semibold text-gray-800 mb-4">Estado de Paciente</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block  font-medium text-gray-700 mb-1">Nro Orden :</label>
              <div className="relative">
                <input type="text" className="w-full px-3 py-2 border border-orange-300 rounded-md bg-orange-50" />
                <FontAwesomeIcon icon={faPlus} className="absolute right-3 top-3 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block  font-medium text-gray-700 mb-1">Nombres :</label>
              <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block  font-medium text-gray-700 mb-1">Tipo Examén :</label>
              <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
          </div>
        </div>
      </div>

      {/* Sección de Exámenes */}
      <div className="mt-6 bg-white border border-gray-200 rounded-lg p-6">
        <p className="font-semibold text-gray-800 mb-4">Exámenes Realizados</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <div>
            <label className="block  font-medium text-gray-700 mb-1">Triaje:</label>
            <input type="text" className="w-full px-2 py-1 border border-gray-300 rounded text-center" />
          </div>
          <div>
            <label className="block  font-medium text-gray-700 mb-1">Lab. Clinico:</label>
            <input type="text" className="w-full px-2 py-1 border border-gray-300 rounded text-center" />
          </div>
          <div>
            <label className="block  font-medium text-gray-700 mb-1">Electrocardiograma:</label>
            <input type="text" className="w-full px-2 py-1 border border-gray-300 rounded text-center" />
          </div>
          <div>
            <label className="block  font-medium text-gray-700 mb-1">Rx. Torax P.A:</label>
            <input type="text" className="w-full px-2 py-1 border border-gray-300 rounded text-center" />
          </div>
          <div>
            <label className="block  font-medium text-gray-700 mb-1">Ficha Audiologica:</label>
            <input type="text" className="w-full px-2 py-1 border border-gray-300 rounded text-center" />
          </div>
          <div>
            <label className="block  font-medium text-gray-700 mb-1">Espirometria:</label>
            <input type="text" className="w-full px-2 py-1 border border-gray-300 rounded text-center" />
          </div>
          <div>
            <label className="block  font-medium text-gray-700 mb-1">Odontograma:</label>
            <input type="text" className="w-full px-2 py-1 border border-gray-300 rounded text-center" />
          </div>
          <div>
            <label className="block  font-medium text-gray-700 mb-1">Psicologia:</label>
            <input type="text" className="w-full px-2 py-1 border border-gray-300 rounded text-center" />
          </div>
          <div>
            <label className="block  font-medium text-gray-700 mb-1">Anexo 7D:</label>
            <input type="text" className="w-full px-2 py-1 border border-gray-300 rounded text-center" />
          </div>
          <div>
            <label className="block  font-medium text-gray-700 mb-1">Hist. Ocupacional:</label>
            <input type="text" className="w-full px-2 py-1 border border-gray-300 rounded text-center" />
          </div>
          <div>
            <label className="block  font-medium text-gray-700 mb-1">Ficha Ant. Patológicos:</label>
            <input type="text" className="w-full px-2 py-1 border border-gray-300 rounded text-center" />
          </div>
          <div>
            <label className="block  font-medium text-gray-700 mb-1">Cuestionario Nórdico:</label>
            <input type="text" className="w-full px-2 py-1 border border-gray-300 rounded text-center" />
          </div>
          <div>
            <label className="block  font-medium text-gray-700 mb-1">Cert. Trabajo Altura:</label>
            <input type="text" className="w-full px-2 py-1 border border-gray-300 rounded text-center" />
          </div>
          <div>
            <label className="block  font-medium text-gray-700 mb-1">Detención S.A.S:</label>
            <input type="text" className="w-full px-2 py-1 border border-gray-300 rounded text-center" />
          </div>
          <div>
            <label className="block  font-medium text-gray-700 mb-1">Consentimiento Dosaje:</label>
            <input type="text" className="w-full px-2 py-1 border border-gray-300 rounded text-center" />
          </div>
          <div>
            <label className="block  font-medium text-gray-700 mb-1">Ex. Rx Sanguineos:</label>
            <input type="text" className="w-full px-2 py-1 border border-gray-300 rounded text-center" />
          </div>
          <div>
            <label className="block  font-medium text-gray-700 mb-1">Perimetro Toraxico:</label>
            <input type="text" className="w-full px-2 py-1 border border-gray-300 rounded text-center" />
          </div>
          <div>
            <label className="block  font-medium text-gray-700 mb-1">Oftalmología :</label>
            <input type="text" className="w-full px-2 py-1 border border-gray-300 rounded text-center" />
          </div>
        </div>
      </div>

      {/* Sección de Impresión de Informes */}
      <div className="mt-6 bg-white border border-gray-200 rounded-lg p-6">
        <p className="font-semibold text-gray-800 mb-4">Imprimir Informes de Exámenes</p>
        
        <div className="flex flex-wrap gap-4">
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Anexo 7C - N°1
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Anexo 7C - N°2
          </button>
          <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            <FontAwesomeIcon icon={faPen} className="mr-2" />
            Aptitud Medica
          </button>
          <button className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
            <FontAwesomeIcon icon={faChartBar} className="mr-2" />
            Certificación previa Trabajo en altura
          </button>
        </div>
      </div>
    </div>
  );
};

export default Resultados;
