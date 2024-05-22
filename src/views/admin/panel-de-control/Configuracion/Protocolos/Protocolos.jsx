import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import RuterConfig from '../RuterConfig';
import EditModal from '../Protocolos/EditModal/EditModal.jsx';

const Protocolos = () => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentData, setCurrentData] = useState({
    razon: '',
    direccion: '',
    telefono: '',
    responsable: '',
    email: ''
  });

  const handleEditClick = () => {
    setCurrentData({
      razon: 'Empresa 1',
      direccion: 'Dirección 1',
      telefono: '123456789',
      responsable: 'Responsable 1',
      email: 'email1@example.com'
    });
    setShowEditModal(true);
  };

  return (
    <div className="container mx-auto mt-12 mb-12">
      <RuterConfig /> 
  
      <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-xl w-[90%]">
        <div className="px-4 py-2 azuloscurobackground flex justify-between">
          <h1 className="text-start font-bold color-azul text-white">Protocolo</h1>
        </div>
        <div className='container p-6'>
          <div className="mb-4 flex items-center">
            <label htmlFor="nombre" className="block  font-medium text-gray-700 mr-2">
              Nombre:
            </label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              className="border mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              placeholder="Ingrese el nombre del Protocolo"
            />
            <FontAwesomeIcon icon={faEdit} className="text-blue-500 ml-2 cursor-pointer" onClick={handleEditClick} />
          </div>
          <div className="mb-4">
            <label htmlFor="empresa" className="block  font-medium text-gray-700">
              Empresa:
            </label>
            <input
              id="empresa"
              name="empresa"
              type="text"
              className="border mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              placeholder="Ingrese el nombre de la empresa"
            />
          </div>
          
          <div className="mb-4 mt-6 flex flex-wrap">
            <div className="w-full md:w-1/2 pr-2">
              <p className="mb-2">Listado de Contratas:</p>
              <div className="mb-4">
                <label htmlFor="contrata" className="block  font-medium text-gray-700">
                  Contrata:
                </label>
                <select
                  id="contrata"
                  name="contrata"
                  className="border mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="1">Opción 1</option>
                  <option value="2">Opción 2</option>
                  <option value="3">Opción 3</option>
                </select>
              </div>
            <div className="mb-4 overflow-auto max-h-60">
              <table className="w-full border-collapse border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2">Orden</th>
                    <th className="border border-gray-300 px-4 py-2">Contrata</th>
                    <th className="border border-gray-300 px-4 py-2">Precio</th>
                  </tr>
                </thead>
                  <tbody>
                    <tr className="bg-white">
                      <td className="border border-gray-300 px-4 py-2">1</td>
                      <td className="border border-gray-300 px-4 py-2">Empresa 1</td>
                      <td className="border border-gray-300 px-4 py-2">$100</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">2</td>
                      <td className="border border-gray-300 px-4 py-2">Empresa 2</td>
                      <td className="border border-gray-300 px-4 py-2">$150</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="border border-gray-300 px-4 py-2">3</td>
                      <td className="border border-gray-300 px-4 py-2">Empresa 3</td>
                      <td className="border border-gray-300 px-4 py-2">$200</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">4</td>
                      <td className="border border-gray-300 px-4 py-2">Empresa 4</td>
                      <td className="border border-gray-300 px-4 py-2">$250</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="border border-gray-300 px-4 py-2">5</td>
                      <td className="border border-gray-300 px-4 py-2">Empresa 5</td>
                      <td className="border border-gray-300 px-4 py-2">$300</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">6</td>
                      <td className="border border-gray-300 px-4 py-2">Empresa 6</td>
                      <td className="border border-gray-300 px-4 py-2">$350</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="border border-gray-300 px-4 py-2">7</td>
                      <td className="border border-gray-300 px-4 py-2">Empresa 7</td>
                      <td className="border border-gray-300 px-4 py-2">$400</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="w-full md:w-1/2 pl-2">
              <p className="mb-2">Listado de Servicios:</p>
              <div className="mb-4">
                <label htmlFor="contrata" className="block  font-medium text-gray-700">
                  Contrata:
                </label>
                <select
                  id="contrata"
                  name="contrata"
                  className="border mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="1">Opción 1</option>
                  <option value="2">Opción 2</option>
                  <option value="3">Opción 3</option>
                </select>
              </div>
            <div className="mb-4 overflow-auto max-h-60">
              <table className="w-full border-collapse border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2">Orden</th>
                    <th className="border border-gray-300 px-4 py-2">Contrata</th>
                    <th className="border border-gray-300 px-4 py-2">Precio</th>
                  </tr>
                </thead>
                  <tbody>
                    <tr className="bg-white">
                      <td className="border border-gray-300 px-4 py-2">1</td>
                      <td className="border border-gray-300 px-4 py-2">Empresa 1</td>
                      <td className="border border-gray-300 px-4 py-2">$100</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">2</td>
                      <td className="border border-gray-300 px-4 py-2">Empresa 2</td>
                      <td className="border border-gray-300 px-4 py-2">$150</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="border border-gray-300 px-4 py-2">3</td>
                      <td className="border border-gray-300 px-4 py-2">Empresa 3</td>
                      <td className="border border-gray-300 px-4 py-2">$200</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">4</td>
                      <td className="border border-gray-300 px-4 py-2">Empresa 4</td>
                      <td className="border border-gray-300 px-4 py-2">$250</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="border border-gray-300 px-4 py-2">5</td>
                      <td className="border border-gray-300 px-4 py-2">Empresa 5</td>
                      <td className="border border-gray-300 px-4 py-2">$300</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">6</td>
                      <td className="border border-gray-300 px-4 py-2">Empresa 6</td>
                      <td className="border border-gray-300 px-4 py-2">$350</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="border border-gray-300 px-4 py-2">7</td>
                      <td className="border border-gray-300 px-4 py-2">Empresa 7</td>
                      <td className="border border-gray-300 px-4 py-2">$400</td>
                    </tr>
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        </div>
      </div>
      {showEditModal && (
        <EditModal 
          setShowEditModal={setShowEditModal} 
          razon={currentData.razon} 
          direccion={currentData.direccion} 
          telefono={currentData.telefono} 
          responsable={currentData.responsable} 
          email={currentData.email} 
        />
      )}
    </div>
  );
};

export default Protocolos;
