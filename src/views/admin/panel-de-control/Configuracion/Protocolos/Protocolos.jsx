import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Swal from 'sweetalert2';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import RuterConfig from '../RuterConfig';
import EditModal from '../Protocolos/EditModal/EditModal.jsx';
import ModalRegistroServicios from './ModalRegistroServicios/ModalRegistroServicios.jsx'; // Importamos el nuevo componente
import { useAuthStore } from '../../../../../store/auth.js';
import { ComboboxContrata, ComboboxEmpresa, ComboboxServicios } from './model/Combobox.jsx';
import { registrarProtocolos, registrarProtocolosServicios, registrarProtocolosContratas } from './model/AdministrarProtocolos.js';
import { Loading } from '../../../../components/Loading.jsx';
import { getFetch } from '../../getFetch/getFetch.js';

const Protocolos = () => {

  const Contratas = ComboboxContrata()
  const Empresas = ComboboxEmpresa()
  const [Servicios, SEtServicios] = useState([])
  const token = useAuthStore(state => state.token);
  const UserLogued = useAuthStore(state => state.userlogued)
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false)
  const [reload, setReload] = useState(0)

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

  useEffect(() => {
    getFetch('/api/v01/ct/ocupacional/servicios', token)
      .then(response => {
        SEtServicios(response);
      })
      .catch(error => {
        throw new Error('Network response was not ok.', error);
      })
  },[reload])
 
  const Reloading = () => {
    setReload(reload + 1)
  }

  const newService = (option) => {
    const servicioExistente = servicios.some(servicio => servicio.id === option.idServicio);

    if (!servicioExistente) {
      setServicios([...servicios, { id: option.idServicio, Nombre: option.nombreServicio, Precio: option.precio }]);
    } else {
      Swal.fire('Advertencia', 'El servicio ya está en la lista', 'warning');
    }
  };

  const handleChange = (e) => {
    const selectedOption = JSON.parse(e.target.value);
    setSelectValue('')
    newService(selectedOption)
  };

  const newContrata = (option) => {
    const ContrataExistente = contratas.some(contrata => contrata.ruc === option.ruc);
    if (!ContrataExistente) {
      setContratas([...contratas, { razonSocial: option.razonSocial, ruc: option.ruc, precio: totalPrecio }]);
    } else {
      Swal.fire('Advertencia', 'La contrata ya esta en la lista', 'warning');
    }
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


  const handleContratas = (id) => {
      const promesasContratas = contratas.map((contrata) => {
        const datosServices = {
          id_protocolo: id,
          rucContrata: parseInt(contrata.ruc, 10),
          precio: contrata.precio,
        };
        return registrarProtocolosContratas(datosServices, UserLogued.sub, token);
      });
      return Promise.all(promesasContratas)
        .then((results) => {
          console.log(results)
          const allSuccessful = results.every(result => result.idContratoProtocolo);
          if (!allSuccessful) {
            return Swal.fire('Error', 'Ha Ocurrido un error al registrar las Contratas', 'error');
          }
          Swal.fire('Registro Completo', 'Se ha completado el Registro de manera correcta', 'success');
          setContratas([])
          setServicios([])
          setDatos({
            nombre: '',
            ruc: '',
            razonSocialE: '',
            rucC: '',
            razonSocialC:'',
            servicios: ''
          });
        })
        .catch((error) => {
          Swal.fire('Error', 'Ha Ocurrido un error al registrar', 'error');
        });
  };
  

  const handleService = (id) => {

      const promesasServicios = servicios.map((servicio) => {
        const datosServices = {
          id_protocolo: id,
          id_servicio: servicio.id,
          precio: servicio.Precio,
        };
        return registrarProtocolosServicios(datosServices, UserLogued.sub, token);
      });
      return Promise.all(promesasServicios)
        .then((results) => {
          console.log(results)
          const allSuccessful = results.every(result => result.idServicioProtocolo);
          if (!allSuccessful) {
            return Swal.fire('Error', 'Ha Ocurrido un error al registrar los Servicios', 'error');
          }
          return handleContratas(id);
        })
        .catch((error) => {
          Swal.fire('Error', 'Ha Ocurrido un error al registrar', 'error');
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
        if (!res.idProtocolo) {
          return Swal.fire('Error', 'Ha Ocurrido un error al registrar', 'error');
        }
        return handleService(res.idProtocolo)
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

  const handlePrecioChange = (e, index) => {
    const newPrecio = e.target.value;
    const input = e.target.name;
    console.log(newPrecio,input,index)
    if (input === 'contrata') {
      setContratas(prevContratas => {
        const updatedContratas = [...prevContratas];
        updatedContratas[index] = {
          ...updatedContratas[index],
          precio: newPrecio
        };
        return updatedContratas;
      });
    } else if (input === 'servicio') {
      
    }
    
  };

  console.log(contratas)

  const totalPrecio = servicios.reduce((total, servicio) => total + servicio.Precio, 0);

  return (
    <div className="container mx-auto mt-12 mb-12">
      <RuterConfig /> 
      <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-xl w-[81%]">
        <div className="px-4 py-2 azuloscurobackground flex justify-between">
          <h1 className="text-start font-bold color-azul text-white">Protocolo</h1>
          <button className="naranja-btn px-4 rounded flex items-center mr-3" onClick={() => setShowModalRegistroServicios(true)}>Registrar Servicios</button>
        </div>
        <div className='container p-6'>
          <div className="mb-4 flex items-center">
            <label htmlFor="nombre" className="block font-medium text-gray-700 mr-2">
              Nombre:
            </label>
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

            <div className="w-full md:w-1/2 pr-2">
              <p className="mb-2">Listado de Servicios:</p>
              <div className="mb-4">
                <select
                  id="servicios"
                  name="servicios"
                  value={selectValue}
                  onChange={handleChange}
                  className="border mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
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
                            onClick={() => handleEditarServicio()}
                          />
                          <FontAwesomeIcon
                            icon={faTrashAlt}
                            className="text-red-500 cursor-pointer"
                            onClick={() => deleteService(index)}
                          />
                        </td>
                      </tr>
                    ))}
                    
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

                <input
                  id="contrata"
                  name="contrata"
                  disabled={servicios.length === 0}
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
                    <th className="border border-gray-300 px-4 py-2">Precio</th>
                    <th className="border border-gray-300 px-4 py-2">Acciones</th>
                  </tr>
                </thead>
                  <tbody>
                    {contratas?.map((option,index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 px-4 py-2">{option.razonSocial}</td>
                        <td className="border border-gray-300 px-4 py-2">{option.ruc}</td>
                        <td className="border border-gray-300 px-4 py-2">
                          <input type="number" name='contrata' className='w-full border-1 border-green-300 rounded-lg h-full' onChange={(e) => handlePrecioChange(e, index)} value={option.precio} />  
                          </td>
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
                    
                  </tbody>
                </table>
                
              </div>
              <div className='flex justify-end items-end'>
              <button onClick={handleSubmit} disabled={!totalPrecio || contratas.length === 0} className='naranja-btn p-2 rounded'>Guardar</button>
              </div>
            </div>
          </div>
        </div>
    </div>
      {loading && <Loading/>}
      {showEditModal && (
        <EditModal 
          setShowEditModal={setShowEditModal} 

        />
      )}
      {showModalRegistroServicios && <ModalRegistroServicios setShowModalRegistroServicios={setShowModalRegistroServicios} user={UserLogued.sub} token={token} RefreshS={ Reloading } />}
    </div>
  );
};

export default Protocolos;
