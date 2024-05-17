import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrashAlt, faCheck, faSyncAlt } from '@fortawesome/free-solid-svg-icons'; // Agregamos los iconos necesarios

const AperturaExamenesPreOcup = () => {
  const [startDate, setStartDate] = useState(new Date());

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes manejar la lógica para enviar los datos del formulario
    console.log('Formulario enviado');
  };

  return (
    <div className="p-4 mt-4">
      <form onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-4 mb-1">
          <div className="mb-4 pr-4 border-r border-gray-300">
            <div className="border-b mb-1 pb-2">
              <h2 className="text-lg font-bold">Datos</h2>
            </div>
            <div className="flex items-center space-x-2 mb-1">
              <label htmlFor="dni" className="block w-36">DNI:</label>
              <input
                type="text"
                id="dni"
                name="dni"
                className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white flex-grow"
              />
                <label htmlFor="apellidos" className="block w-36">G.Sang.:</label>
              <input
                type="text"
                id="apellidos"
                name="apellidos"
                className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white flex-grow"
              />
            </div>
            <div className="flex items-center space-x-2 mb-1">
              <label htmlFor="nombre" className="block w-36">Nombre:</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white flex-grow"
              />
              <label htmlFor="apellidos" className="block w-36">Apellidos:</label>
              <input
                type="text"
                id="apellidos"
                name="apellidos"
                className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white flex-grow"
              />
            </div>
            <div className="flex items-center space-x-2 mb-1">
              <label htmlFor="empresa" className="block w-36">Empresa:</label>
              <select
                id="empresa"
                name="empresa"
                className="border pointer border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white flex-grow"
              >
                <option value="">Seleccionar</option>
                {/* Agregar opciones aquí */}
              </select>
              <label htmlFor="contrata" className="block w-36">Contrata:</label>
              <select
                id="contrata"
                name="contrata"
                className="border pointer border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white flex-grow"
              >
                <option value="">Seleccionar</option>
                {/* Agregar opciones aquí */}
              </select>
            </div>
            <div className="flex items-center space-x-2 mb-1">
            <label htmlFor="medicoOcupacional" className="block w-36">Médico Ocupacional:</label>
              <input
                type="text"
                id="precioExamenMedico"
                name="precioExamenMedico"
                className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white flex-grow"
              />
              <label htmlFor="tipoPrueba" className="block w-36">Tipo de Prueba:</label>
              <select
                id="tipoPrueba"
                name="tipoPrueba"
                className="border pointer border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white flex-grow"
              >
                <option value="">Seleccionar</option>
                {/* Agregar opciones aquí */}
              </select>
            </div>
          {/* </div>
            No borrar
          <div className="mb-4 pl-4"> */} 
            <div className="border-b mb-1 pb-2 mt-5">
              <h2 className="text-lg font-bold">Área Pre-Ocupacional</h2>
            </div>
            <div className="flex items-center space-x-2 mb-1">
              <label htmlFor="cargo" className="block w-36">Cargo:</label>
              <input
                type="text"
                id="cargo"
                name="cargo"
                className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white flex-grow"
              />
            </div>
            <div className="flex items-center space-x-2 mb-1">
              <label htmlFor="area" className="block w-36">Área:</label>
              <select
                id="area"
                name="area"
                className="border pointer border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white flex-grow"
              >
                <option value="">Seleccionar</option>
              </select>
            </div>
            <div className="flex items-center space-x-2 mb-1">
              <label htmlFor="examenMedico" className="block w-36">Examen Médico:</label>
              <select
                id="examenMedico"
                name="examenMedico"
                className="border pointer border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white flex-grow" >
                <option value="">Seleccionar</option>
              </select>
            </div>
            <div className="flex items-center space-x-2 mb-1">
              <label htmlFor="examenAdicional" className="block w-36">Examen Adicional:</label>
              <div className="flex items-center">
                <input type="checkbox" id="examenAdicional1" name="examenAdicional1" className="mr-2" />
                <label htmlFor="examenAdicional1">Item 1</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="examenAdicional2" name="examenAdicional2" className="mr-2" />
                <label htmlFor="examenAdicional2">Item 2</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="examenAdicional3" name="examenAdicional3" className="mr-2" />
                <label htmlFor="examenAdicional3">Item 3</label>
              </div>
            </div>
            <div className="flex items-center space-x-2 mb-1">
              <label htmlFor="explotacionEn" className="block w-36">Explotación en:</label>
              <select
                id="explotacionEn"
                name="
                explotacionEn"
                className="border pointer border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white flex-grow"
              >
                <option value="">Seleccionar</option>
              </select>
            </div>
            <div className="flex items-center space-x-2 mb-1">
              <label htmlFor="mineralExp" className="block w-36">Mineral Exp:</label>
              <select
                id="mineralExp"
                name="mineralExp"
                className="border pointer border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white flex-grow"
              >
                <option value="">Seleccionar</option>
              </select>
            </div>
            <div className="flex items-center space-x-2 mb-1">
              <label htmlFor="altura" className="block w-36">Altura:</label>
              <select
                id="altura"
                name="altura"
                className="border pointer border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white flex-grow"
              >
                <option value="">Seleccionar</option>
              </select>
            </div>
            <div className="flex items-center space-x-2 mb-1">
              <label htmlFor="precioExamenMedico" className="block w-36">Precio Examen Médico:</label>
              <input
                type="text"
                id="precioExamenMedico"
                name="precioExamenMedico"
                className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white flex-grow"
              />
              <label htmlFor="formaPago" className="block ml-4">Forma de Pago:</label>
              <select
                id="formaPago"
                name="formaPago"
                className="border pointer border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white"
              >
                <option value="">Seleccionar</option>
              </select>
            </div>
            <div className="flex items-center space-x-2 mb-1">
              <label htmlFor="precioExamenAdicional" className="block w-36">Precio Examen Adicional:</label>
              <input
                type="text"
                id="precioExamenAdicional"
                name="precioExamenAdicional"
                className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white flex-grow"
              />
              <label htmlFor="autorizadoPor" className="block ml-4">Autorizado Por:</label>
              <select
                id="autorizadoPor"
                name="autorizadoPor"
                className="border pointer border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white"
              >
                <option value="">Seleccionar</option>
              </select>
            </div>
            <div className="flex items-center space-x-2 mb-1">
              <label htmlFor="fechaApertura" className="block w-36">Fecha de Apertura:</label>
              <DatePicker
                selected={startDate}
                onChange={date => setStartDate(date)}
                dateFormat="dd/MM/yyyy"
                className="border pointer border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white flex-grow"
              />
              <label htmlFor="numOperacion" className="block ml-4">N° Operación:</label>
              <input
                type="text"
                id="numOperacion"
                name="numOperacion"
                className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white"
              />
            </div>
            <div className="flex items-center space-x-2 mb-1">
              <label htmlFor="observacion1" className="block w-36">Observación 1:</label>
              <input
                type="text"
                id="observacion1"
                name="observacion1"
                className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white flex-grow"
              />
            </div>
            <div className="flex items-center space-x-2 mb-1">
              <label htmlFor="observacion2" className="block w-36">Observación 2:</label>
              <input
                type="text"
                id="observacion2"
                name="observacion2"
                className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white flex-grow"
              />
            </div>
            <div className="flex items-center space-x-2 mb-1">
              <label htmlFor="protocolo" className="block w-36">Protocolo:</label>
              <select
                id="protocolo"
                name="protocolo"
                className="border pointer border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white flex-grow"
              >
                <option value="">Seleccionar</option>
              </select>
            </div>
          </div>
          {/* Nueva columna con estructura solicitada */}
          <div className="mb-4 pl-4">
            <div className="mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <input type="checkbox" id="soloMiSede" name="soloMiSede" className="mr-2" />
                <label htmlFor="soloMiSede" className="block">Solo mi Sede</label>
                <label htmlFor="fecha" className="block w-14">Fecha:</label>
                <DatePicker
                  selected={startDate}
                  onChange={date => setStartDate(date)}
                  dateFormat="dd/MM/yyyy"
                  className="border pointer border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white w-32"
                />
                <label htmlFor="hora" className="block w-14">Hora:</label>
                <input
                  type="text"
                  id="hora"
                  name="hora"
                  className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white w-24"
                />
                <label htmlFor="sedeClinica" className="block w-36">Sede Clínica:</label>
                <input
                  type="text"
                  id="sedeClinica"
                  name="sedeClinica"
                  className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white flex-grow"
                />
              </div>

              <div className="flex items-center space-x-2 mb-2">
                <label htmlFor="nombre" className="block w-36">Nombre:</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white flex-grow"
                />
                <label htmlFor="codigo" className="block w-36">Código:</label>
                <input
                  type="text"
                  id="codigo"
                  name="codigo"
                  className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white flex-grow"
                />
              </div>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-bold mb-2">Últimos Agregados & Hojas de Ruta</h3>
              <table  className="w-full text-center border border-gray-300 mb-4">
                <thead>
                  <tr>
                    <th className="border border-gray-300 px-2 py-1">Título 1</th>
                    <th className="border border-gray-300 px-2 py-1">Título 2</th>
                    <th className="border border-gray-300 px-2 py-1">Título 3</th>
                    <th className="border border-gray-300 px-2 py-1">Título 4</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-2 py-1">Dato 1.1</td>
                    <td className="border border-gray-300 px-2 py-1">Dato 1.2</td>
                    <td className="border border-gray-300 px-2 py-1">Dato 1.3</td>
                    <td className="border border-gray-300 px-2 py-1">Dato 1.4</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-2 py-1">Dato 2.1</td>
                    <td className="border border-gray-300 px-2 py-1">Dato 2.2</td>
                    <td className="border border-gray-300 px-2 py-1">Dato 2.3</td>
                    <td className="border border-gray-300 px-2 py-1">Dato 2.4</td>
                  </tr>
                 
                </tbody>
              </table>
            </div>
            <div className="mb-4 pt-4 flex justify-center items-center">
                <button type="button" className="flex items-center border-1 border-blue-500 text-blue-500 px-3 py-2 rounded-md hover:bg-blue-500 hover:text-white focus:outline-none">
                  <FontAwesomeIcon icon={faPlus} className="mr-2" /> Agregar
                </button>
                <button type="button" className="flex items-center border-1 border-gray-500 ml-4 text-gray-500 px-3 py-2 rounded-md hover:bg-gray-500 hover:text-white focus:outline-none">
                  <FontAwesomeIcon icon={faTrashAlt} className="mr-2" /> Limpiar
                </button>
                <button type="button" className="flex items-center border-1 border-green-500 ml-4 text-green-500 px-3 py-2 rounded-md hover:bg-green-500 hover:text-white focus:outline-none">
                  <FontAwesomeIcon icon={faCheck} className="mr-2" /> Habilitar
                </button>
                <button type="button" className="flex items-center border-1 border-yellow-500 ml-4 text-yellow-500 px-3 py-2 rounded-md hover:bg-yellow-500 hover:text-white focus:outline-none">
                  <FontAwesomeIcon icon={faSyncAlt} className="mr-2" /> Actualizar
                </button>
              </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AperturaExamenesPreOcup;
