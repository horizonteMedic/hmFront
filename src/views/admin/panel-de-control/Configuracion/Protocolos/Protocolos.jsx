import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSearch, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import RuterConfig from '../RuterConfig';
import EditModal from '../Protocolos/EditModal/EditModal.jsx';
import ModalRegistroServicios from './ModalRegistroServicios/ModalRegistroServicios.jsx'; // Importamos el nuevo componente

const Protocolos = () => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showModalRegistroServicios, setShowModalRegistroServicios] = useState(false); // Estado para mostrar/ocultar el modal de registro de servicios
  const [currentData, setCurrentData] = useState({
    razon: '',
    direccion: '',
    telefono: '',
    responsable: '',
    email: ''
  });
  const [tableDataContratas, setTableDataContratas] = useState([]);
  const [tableDataServicios, setTableDataServicios] = useState([]);

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

  const handleContrataChange = (event) => {
    const selectedContrata = event.target.value;
    const newTableData = [...tableDataContratas, { orden: tableDataContratas.length + 1, contrata: selectedContrata }];
    setTableDataContratas(newTableData);
  };

  const handleServicioChange = (event) => {
    const selectedServicio = event.target.value;
    const newTableData = [...tableDataServicios, { orden: tableDataServicios.length + 1, servicio: selectedServicio }];
    setTableDataServicios(newTableData);
  };

  return (
    <div className="container mx-auto mt-12 mb-12">
      <RuterConfig /> 
      <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-xl w-[60%]">
        <div className="px-4 py-2 azuloscurobackground flex justify-between">
          <h1 className="text-start font-bold color-azul text-white">Protocolo</h1>
          <button className="naranja-btn px-4 rounded flex items-center mr-3" onClick={() => setShowModalRegistroServicios(true)}>Registrar Servicios</button>
        </div>
        <div className='container p-6'>
          <div className="mb-4 flex items-center">
            <label htmlFor="nombre" className="block font-medium text-gray-700 mr-2">
              Nombre:
            </label>
            <div className="flex items-center w-full">
              <input
                id="nombre"
                name="nombre"
                type="text"
                className="border mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                placeholder="Ingrese el nombre del Protocolo"
              />
              <button className="border ml-2 flex items-center px-2 py-1 text-sm text-gray-500 border-gray-300 rounded-md">
                Buscar
                <FontAwesomeIcon icon={faSearch} className="ml-1" />
              </button>
            </div>
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
                <select
                  id="contrata"
                  name="contrata"
                  className="border mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  onChange={handleContrataChange}
                >
                                  <option disabled selected value="">Seleccionar</option>

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
                      <th className="border border-gray-300 px-4 py-2">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableDataContratas.map((item) => (
                      <tr key={item.orden} className="bg-white">
                        <td className="border border-gray-300 px-4 py-2">{item.orden}</td>
                        <td className="border border-gray-300 px-4 py-2">{item.contrata}</td>
                        <td className="border border-gray-300 px-4 py-2">$100</td>
                        <td className="border border-gray-300 px-4 py-2">
                          <button className="text-blue-500">
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="w-full md:w-1/2 pl-2">
              <p className="mb-2">Listado de Servicios:</p>
              <div className="mb-4">
                <select
                  id="servicio"
                  name="servicio"
                  className="border mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline
                  focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  onChange={handleServicioChange}
                >                <option disabled selected value="">Seleccionar</option>

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
                      <th className="border border-gray-300 px-4 py-2">Servicio</th>
                      <th className="border border-gray-300 px-4 py-2">Precio</th>
                      <th className="border border-gray-300 px-4 py-2">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableDataServicios.map((item) => (
                      <tr key={item.orden} className="bg-white">
                        <td className="border border-gray-300 px-4 py-2">{item.orden}</td>
                        <td className="border border-gray-300 px-4 py-2">{item.servicio}</td>
                        <td className="border border-gray-300 px-4 py-2">$100</td>
                        <td className="border border-gray-300 px-4 py-2">
                          <button className="text-blue-500">
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                        </td>
                      </tr>
                    ))}
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
      {showModalRegistroServicios && <ModalRegistroServicios setShowModalRegistroServicios={setShowModalRegistroServicios} />}
    </div>
  );
};

export default Protocolos;
