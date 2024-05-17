import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const TriajeMinera = () => {
  return (
    <div className="container mx-auto mt-12 mb-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-xl w-full sm:w-[90%]">
        <div className="px-4 py-2 azuloscurobackground flex justify-between">
          <h1 className="text-start font-bold text-white">Triaje</h1>
        </div>
        <div className="overflow-x-auto mb-4 p-5">
          <form>
            <div className="grid gap-4 mb-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {/* Columna 1 */}
              <div className="pr-4">
                <div className="flex items-center space-x-2 mb-4">
                  <input type="checkbox" id="ocupacional" name="ocupacional" className='pointer'/>
                  <label htmlFor="ocupacional">Ocupacional</label>
                  <input type="checkbox" id="asistencial" name="asistencial" className='pointer'/>
                  <label htmlFor="asistencial">Asistencial</label>
                </div>
                <div className="flex items-center space-x-2 mb-4">
                  <p>Nro</p>
                  <input
                    type="text"
                    id="nro"
                    name="nro"
                    className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white"
                  />
                </div>
                <div className="flex items-center space-x-2 mb-4">
                  <input type="checkbox" id="recibo" name="recibo" className='pointer' />
                  <label htmlFor="recibo">Recibo</label>
                  <input type="checkbox" id="nroOrden" name="nroOrden" className='pointer' />
                  <label htmlFor="nroOrden">Nro Orden</label>
                </div>
                <div className="flex items-center space-x-2 mb-4">
                  <label htmlFor="expmedico" className="block text-gray-700 w-36">
                    Expediente Médico:
                  </label>
                  <input
                    type="text"
                    id="expmedico"
                    name="expmedico"
                    className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none bg-white"
                  />
                </div>
                <div className="flex items-center space-x-2 mb-4">
                  <label htmlFor="empresa" className="block text-gray-700 w-36">
                    Empresa:
                  </label>
                  <select
                    id="empresa"
                    name="empresa"
                    className="pointer border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none bg-white"
                  >
                    <option value="">Seleccionar</option>
                    {/* Agregar opciones aquí */}
                  </select>
                </div>
                <div className="flex items-center space-x-2 mb-4">
                  <label htmlFor="contrata" className="block text-gray-700 w-36">
                    Contrata:
                  </label>
                  <select
                    id="contrata"
                    name="contrata"
                    className="pointer border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none bg-white"
                  >
                    <option value="">Seleccionar</option>
                    {/* Agregar opciones aquí */}
                  </select>
                </div>
                <div className="flex items-center space-x-2 mb-4">
                  <label htmlFor="historial" className="block text-gray-700 w-36">
                    N° Historial:
                  </label>
                  <input
                    type="text"
                    id="historial"
                    name="historial"
                    className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none bg-white"
                  />
                </div>
                <div className="flex items-center space-x-2 mb-4">
                  <label htmlFor="nombres" className="block text-gray-700 w-36">
                    Nombres:
                  </label>
                  <input
                    type="text"
                    id="nombres"
                    name="nombres"
                    className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none bg-white"
                  />
                </div>
                <div className="flex items-center space-x-2 mb-4">
                  <label htmlFor="apellidos" className="block text-gray-700 w-36">
                    Apellidos:
                  </label>
                  <input
                    type="text"
                    id="apellidos"
                    name="apellidos"
                    className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none bg-white"
                  />
                </div>
                <div className="flex items-center space-x-2 mb-4">
                  <label htmlFor="fechaNacimiento" className="block text-gray-700 w-36">
                    Fecha de Nacimiento:
                  </label>
                  <input
                    type="date"
                    id="fechaNacimiento"
                    name="fechaNacimiento"
                    className="border pointer border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none bg-white"
                  />
                </div>
              </div>
            
              {/* Columna 2 */}
              <div className="pl-4">
                <div>
                  <p className='mb-4 fw-bold'>Ingrese Información del Triaje:</p>
                </div>
                <div className="flex items-center space-x-2 mb-4">
                  <label htmlFor="talla" className="block text-gray-700 w-36">
                    Talla:
                  </label>
                  <input
                    type="text"
                    id="talla"
                    name="talla"
                    className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none bg-white"
                  />
                </div>
                <div className="flex items-center space-x-2 mb-4">
                  <label htmlFor="peso" className="block text-gray-700 w-36">
                    Peso:
                  </label>
                  <input
                    type="text"
                    id="peso"
                    name="peso"
                    className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none bg-white"
                  />
                </div>
                <div className="flex items-center space-x-2 mb-4">
                  <label htmlFor="imc" className="block text-gray-700 w-36">
                    IMC:
                  </label>
                  <input
                    type="text"
                    id="imc"
                    name="imc"
                    className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none bg-white"
                  />
                </div>
                <div className="flex items-center space-x-2 mb-4">
                  <label htmlFor="cintura" className="block text-gray-700 w-36">
                    Cintura:
                  </label>
                  <input
                    type="text"
                    id="cintura"
                    name="cintura"
                    className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none bg-white"
                  />
                </div>
                <div className="flex items-center space-x-2 mb-4">
                  <label htmlFor="icc" className="block text-gray-700 w-36">
                    ICC:
                  </label>
                  <input
                    type="text"
                    id="icc"
                    name="icc"
                    className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none bg-white"
                  />
                </div>
              </div>
              {/* Columna 3 */}
              <div className='pt-5'>
                <div className="flex items-center space-x-2 mb-4">
                  <label htmlFor="cadera" className="block text-gray-700 w-36">
                    Cadera:
                  </label>
                  <input
                    type="text"
                    id="cadera"
                    name="cadera"
                    className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none bg-white"
                  />
                </div>
                <div className="flex items-center space-x-2 mb-4">
                  <label htmlFor="temperatura" className="block text-gray-700 w-36">
                    Temperatura:
                  </label>
                  <input
                    type="text"
                    id="temperatura"
                    name="temperatura"
                    className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none bg-white"
                  />
                </div>
                <div className="flex items-center space-x-2 mb-4">
                  <label htmlFor="fcardiaca" className="block text-gray-700 w-36">
                    F. Cardiaca:
                  </label>
                  <input
                    type="text"
                    id="fcardiaca"
                    name="fcardiaca"
                    className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none bg-white"
                  />
                </div>
                <div className="flex items-center space-x-2 mb-4">
                  <label htmlFor="sat" className="block text-gray-700 w-36">
                    SAT. 02:
                  </label>
                  <input
                    type="text"
                    id="sat"
                    name="sat"
                    className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none bg-white"
                  />
                </div>
                <div className="flex items-center space-x-2 mb-4">
                  <label htmlFor="perimetrocuello" className="block text-gray-700 w-36">
                    Perimetro del cuello:
                  </label>
                  <input
                    type="text"
                    id="perimetrocuello"
                    name="perimetrocuello"
                    className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none bg-white"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TriajeMinera;
