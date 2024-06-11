import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
<<<<<<< HEAD
import { faEdit, faSearch, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
=======
import Swal from 'sweetalert2';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
>>>>>>> 0d90639f776ffc7c7e18d9bc3370e30213eb5697
import RuterConfig from '../RuterConfig';
import EditModal from '../Protocolos/EditModal/EditModal.jsx';
import ModalRegistroServicios from './ModalRegistroServicios/ModalRegistroServicios.jsx'; // Importamos el nuevo componente
import { useAuthStore } from '../../../../../store/auth.js';
import { ComboboxContrata, ComboboxEmpresa, ComboboxServicios } from './model/Combobox.jsx';
import { registrarProtocolos, registrarProtocolosServicios } from './model/AdministrarProtocolos.js';
import { Loading } from '../../../../components/Loading.jsx';

const Protocolos = () => {

  const Contratas = ComboboxContrata()
  const Empresas = ComboboxEmpresa()
  const Servicios = ComboboxServicios()
  const token = useAuthStore(state => state.token);
  const UserLogued = useAuthStore(state => state.userlogued)
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false)

  const [showModalRegistroServicios, setShowModalRegistroServicios] = useState(false); // Estado para mostrar/ocultar el modal de registro de servicios
  const [datos, setDatos] = useState({
    nombre: '',
    ruc: '',
    razonSocialE: '',
    rucC: '',
    razonSocialC:'',
    servicios: ''
  });
  const [selectValue, setSelectValue] = useState('');
  const [servicios, setServicios] = useState([])
  const [contratas, setContratas] = useState([])
  const [searchTerm, setSearchTerm] = useState({
    empresa: '',
    contrata: ''
  });
  const [filteredData, setFilteredData] = useState({
    empresas: [],
    contratas: []
  });
  const [tableDataContratas, setTableDataContratas] = useState([]);
  const [tableDataServicios, setTableDataServicios] = useState([]);

  
 
  const newService = (option) => {
    setServicios([...servicios, { id: option.idServicio, Nombre: option.nombreServicio, Precio: option.precio }]);
  };

<<<<<<< HEAD
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

=======
  const handleChange = (e) => {
    const selectedOption = JSON.parse(e.target.value);
    setSelectValue('')
    newService(selectedOption)
  };

  const newContrata = (option) => {
    setContratas([...contratas, { razonSocial: option.razonSocial, ruc: option.ruc }]);
  };

  const deleteService = (index) => {
    setServicios(servicios.filter((_, i) => i !== index));
  };

  const deleteContrata = (index) => {
    setContratas(contratas.filter((_, i) => i !== index));
  };

  const handleSearch = (e) => {
    if (e.target.name === 'empresa') {
      setSearchTerm({...searchTerm, empresa: e.target.value});
      const filteredResults = Empresas.filter((option) =>
        option.razonSocial.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setFilteredData({...filteredData, empresas: filteredResults});
    } else {
      setSearchTerm({...searchTerm, contrata: e.target.value});
      const filteredResults = Contratas.filter((option) =>
        option.razonSocial.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setFilteredData({...filteredData, contratas: filteredResults});
    }
    
  };

  const totalPrecio = servicios.reduce((total, servicio) => total + servicio.Precio, 0);
  console.log(servicios)
  const handleService = (id) => {
    servicios.forEach((servicio) => {
      const datosServices = {
        id_protocolo: id,
        id_servicio: servicio.id,
        precio: servicio.Precio,
      };
  
      registrarProtocolosServicios(datosServices,UserLogued.sub, token)
        .then((res) => {
          console.log(`Servicio ${servicio.id} registrado:`, res);
        })
        .catch((error) => {
          console.error(`Error registrando el servicio ${servicio.id}:`, error);
          Swal.fire({
            title: 'Error',
            text: `Ha ocurrido un error al registrar el servicio ${servicio.id}`,
            icon: 'error',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Aceptar'
          });
        });
    });
  }

  const handleSubmit = () => {

    if (!datos.nombre.trim() || !datos.ruc || !totalPrecio) {
      Swal.fire('Error', 'Por favor, complete todos los campos', 'error');
      return;
    }
    const datosTransformados = {
      nombreProtocolo: datos.nombre.toUpperCase().trim(),
      rucEmpresa: parseInt(datos.ruc.trim(), 10),
      precio: totalPrecio,
    }
    setLoading(true)
    registrarProtocolos(datosTransformados, UserLogued.sub, token)
      .then((res) => {
        console.log(res)
        handleService(res.idProtocolo)
      })
      .catch((error) => {
        Swal.fire({
          title: 'Error',
          text: 'Ha ocurrido un error al crear el protocolo',
          icon: 'error',
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Aceptar'
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }

>>>>>>> 0d90639f776ffc7c7e18d9bc3370e30213eb5697
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
<<<<<<< HEAD
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
=======
            <input
              id="nombre"
              name="nombre"
              value={datos.nombre}
              onChange={(e) => {setDatos({...datos, nombre:e.target.value})}}
              type="text"
              className="border mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              placeholder="Ingrese el nombre del Protocolo"
            />
            <FontAwesomeIcon icon={faEdit} className="text-blue-500 ml-2 cursor-pointer"  />
>>>>>>> 0d90639f776ffc7c7e18d9bc3370e30213eb5697
          </div>

          <div className="mb-4">
            
            <label htmlFor="empresa" className="block  font-medium text-gray-700">
              Empresa:
            </label>
            <input
              id="empresa"
              name="empresa"
              value={searchTerm.empresa}
              type="text"
              onChange={handleSearch}
              autoComplete='off'
              className="border mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              placeholder="Ingrese el nombre de la empresa"
              
            />
            {searchTerm.empresa && (
              <div className="border border-gray-300 rounded-md mt-1 max-h-48 overflow-y-auto">
              {filteredData.empresas.map((option, index) => (
                <div
                  key={index}
                  className="cursor-pointer p-2 hover:bg-gray-200"
                  onClick={() => {
                    setDatos({...datos, ruc:option.ruc, razonSocialE:option.razonSocial})
                    setSearchTerm({...searchTerm, empresa: ''});
                    setFilteredData({...filteredData, empresas: []});
                  }}
                >
                  {option.razonSocial}
                </div>
              ))}
            </div>
            )}
            {datos.ruc && (
              <div className=" text-lg mt-1">Seleccionado: <strong>{datos.razonSocialE}</strong></div>
            )}
          </div>

          <div className="mb-4 mt-6 flex flex-wrap">
<<<<<<< HEAD
            <div className="w-full md:w-1/2 pr-2">
              <p className="mb-2">Listado de Contratas:</p>
=======

            <div className="w-full md:w-1/2 pr-2">
              <p className="mb-2">Listado de Servicios:</p>
>>>>>>> 0d90639f776ffc7c7e18d9bc3370e30213eb5697
              <div className="mb-4">
                <select
                  id="servicios"
                  name="servicios"
                  value={selectValue}
                  onChange={handleChange}
                  className="border mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  onChange={handleContrataChange}
                >
<<<<<<< HEAD
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
=======
                  <option value="">Elija sus Servicios</option>
                  {Servicios?.map((option, index) => (
                    <option key={index} value={JSON.stringify(option)}>{option.nombreServicio}</option>
                  ))}
                </select>
              </div>
            <div className="mb-4 overflow-auto max-h-60">
              <table className="w-full border-collapse border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2">Servicio</th>
                    <th className="border border-gray-300 px-4 py-2">Precio</th>
                    <th className="border border-gray-300 px-4 py-2">Acciones</th>
                  </tr>
                </thead>
                  <tbody>
                    {servicios?.map((option,index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 px-4 py-2">{option.Nombre}</td>
                        <td className="border border-gray-300 px-4 py-2">{option.Precio}</td>
                        <td className="border border-gray-300 px-4 py-2">
                          <FontAwesomeIcon
                            icon={faEdit}
                            className="text-blue-500 cursor-pointer mr-2"
                            onClick={() => handleEditarServicio(servicio)}
                          />
                          <FontAwesomeIcon
                            icon={faTrashAlt}
                            className="text-red-500 cursor-pointer"
                            onClick={() => deleteService(index)}
                          />
                        </td>
                      </tr>
                    ))}
                    
>>>>>>> 0d90639f776ffc7c7e18d9bc3370e30213eb5697
                  </tbody>
                </table>
              </div>
              <div className='flex justify-center'>
                <p>Precio TOTAL: S/{totalPrecio}</p>
              </div>
            </div>

            <div className="w-full md:w-1/2 pl-2">
              <p className="mb-2">Listado de Contratas:</p>
              <div className="mb-4">
<<<<<<< HEAD
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
=======

                <input
                  id="contrata"
                  name="contrata"
                  value={searchTerm.contrata}
                  onChange={handleSearch}
                  autoComplete='off'
                  placeholder='Ingresa la Contratas'
                  className="border mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                />
                {searchTerm.contrata && (
                  <div className="border border-gray-300 rounded-md mt-1 max-h-48 overflow-y-auto">
                  {filteredData.contratas.map((option, index) => (
                    <div
                      key={index}
                      className="cursor-pointer p-2 hover:bg-gray-200"
                      onClick={() => {
                        setSearchTerm({...searchTerm, contrata: ''});
                        setFilteredData({...filteredData, contratas: []});
                        newContrata(option)
                      }}
                    >
                      {option.razonSocial}
                    </div>
                  ))}
                </div>
                )}
              </div>
            <div className="mb-4 overflow-auto max-h-60">
              <table className="w-full border-collapse border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2">Razon Social</th>
                    <th className="border border-gray-300 px-4 py-2">RUC</th>
                    <th className="border border-gray-300 px-4 py-2">Acciones</th>
                  </tr>
                </thead>
                  <tbody>
                    {contratas?.map((option,index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 px-4 py-2">{option.razonSocial}</td>
                        <td className="border border-gray-300 px-4 py-2">{option.ruc}</td>
                        <td className="border border-gray-300 px-4 py-2">
                          <FontAwesomeIcon
                            icon={faEdit}
                            className="text-blue-500 cursor-pointer mr-2"
                            onClick={() => handleEditarServicio(servicio)}
                          />
                          <FontAwesomeIcon
                            icon={faTrashAlt}
                            className="text-red-500 cursor-pointer"
                            onClick={() => deleteContrata(index)}
                          />
                        </td>
                      </tr>
                    ))}
                    
>>>>>>> 0d90639f776ffc7c7e18d9bc3370e30213eb5697
                  </tbody>
                </table>
                
              </div>
              <div className='flex justify-end items-end'>
              <button onClick={handleSubmit} disabled={!totalPrecio} className='naranja-btn p-2 rounded'>Guardar</button>
              </div>
            </div>
          </div>
        </div>
<<<<<<< HEAD
      </div>
      {showEditModal && (
        <EditModal
          setShowEditModal={setShowEditModal}
          razon={currentData.razon}
          direccion={currentData.direccion}
          telefono={currentData.telefono}
          responsable={currentData.responsable}
          email={currentData.email}
=======
    </div>
      {loading && <Loading/>}
      {showEditModal && (
        <EditModal 
          setShowEditModal={setShowEditModal} 

>>>>>>> 0d90639f776ffc7c7e18d9bc3370e30213eb5697
        />
      )}
      {showModalRegistroServicios && <ModalRegistroServicios setShowModalRegistroServicios={setShowModalRegistroServicios} user={UserLogued.sub} token={token}  />}
    </div>
  );
};

export default Protocolos;
