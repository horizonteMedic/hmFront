import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { Loading } from '../../../../../components/Loading';
import { registrarProtocolosServicios, registrarProtocolosContratas, DeleteContrataProtocolo, DeleteServicioProtocolo } from '../model/AdministrarProtocolos';
import { EditarProtocolos, EditarServicioProtoclo, EditarContrataProtoclo } from '../model/Editar';

const EditProtocolos = (props) => {

    const [datos, setDatos] = useState({
        Protocolo: props.ListDatos.nombreProtocolo,
        Empresa: props.ListDatos.razonEmpresa,
        Ruc: props.ListDatos.rucEmpresa,
        Precio: props.ListDatos.precio
    })
    const [searchTerm, setSearchTerm] = useState({
        Empresa: '',
        Contrata: ''
    })
    const [filteredData, setFilteredData] = useState({
        empresas: [],
        contratas: [],
        protocolo: []
      });
    const [ServiciosTable, setServiciosTable] = useState(props.servicio)
    const [ContratasTable, setContratasTable] = useState(props.contrata)
    const [loading, setLoading] = useState(false)
    const handleChange = (e) => {
        if (e.target.name === 'Empresa') {
            setSearchTerm({...searchTerm, Empresa: e.target.value});
            const filteredResults = props.ListEmpresas.filter((option) =>
                option.razonSocial.toLowerCase().includes(e.target.value.toLowerCase())
            );
            setFilteredData({...filteredData, empresas: filteredResults});
            return
        } else if (e.target.name === "Servicios") {
            const selectedOption = JSON.parse(e.target.value);
            newItem('Servicio',selectedOption)
            return
        } else if (e.target.name === "Contrata") {
            setSearchTerm({...searchTerm, Contrata: e.target.value});
            const filteredResults = props.ListContratas.filter((option) =>
                option.razonSocial.toLowerCase().includes(e.target.value.toLowerCase())
            );
            setFilteredData({...filteredData, contratas: filteredResults});
            return
        }
        const { name, value, } = e.target;
        setDatos({
            ...datos,
            [name]: value,
        });
    }

    const newItem = (name,option) => {
        if (name === "Contrata") {
            const ContrataExistente = ContratasTable.some(contrata => contrata.ruc === parseInt(option.ruc.trim(), 10));
            if (!ContrataExistente) {
            setContratasTable([...ContratasTable, { razonSocial: option.razonSocial, ruc: parseInt(option.ruc.trim(), 10), precio: totalPrecio }]);
            } else {
            Swal.fire('Advertencia', 'La contrata ya esta en la lista', 'warning');
            }
        } else if (name === "Servicio") {
            const servicioExistente = ServiciosTable.some(servicio => servicio.id_servicio === option.idServicio);
            const servicioExistente2 = ServiciosTable.some(servicio => servicio.id === option.idServicio);

            if (!servicioExistente && !servicioExistente2) {
            setServiciosTable([...ServiciosTable, { id: option.idServicio, Nombre: option.nombreServicio, Precio: option.precio }]);
            } else {
            Swal.fire('Advertencia', 'El servicio ya está en la lista', 'warning');
            }
        }
        
      };

    const deleteitem = (name,index,option) => {
        if (name === 'Contratas') {
            Swal.fire({title: "¿Estas Seguro?",text: "No puedes revertir esta accion!",icon: "warning",showCancelButton: true,confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Si, Eliminar!"
              }).then((result) => {
                if (result.isConfirmed) {
                    DeleteContrataProtocolo(option.id,props.token)
                    .then(() => {
                        setContratasTable(prev => prev.filter((_, i) => i !== index));
                        Swal.fire({title: "Exito!",text: "Se ha ELiminado Correctamente",icon: "success"
                          });
                    })
                    .catch(() => {
                      Swal.fire({title: "Error!",text: "La asignacion no se ha podido Eliminar!",icon: "error"
                      });
                    });
                }
              });
        } else if (name === 'Servicios') {
            Swal.fire({title: "¿Estas Seguro?",text: "No puedes revertir esta accion!",icon: "warning",showCancelButton: true,confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Si, Eliminar!"
              }).then((result) => {
                if (result.isConfirmed) {
                    DeleteServicioProtocolo(option.id_servicioProtocolo,props.token)
                    .then(() => {
                        setServiciosTable(prev => prev.filter((_, i) => i !== index));
                        Swal.fire({title: "Exito!",text: "Se ha ELiminado Correctamente",icon: "success"
                          });
                    })
                    .catch(() => {
                      Swal.fire({title: "Error!",text: "La asignacion no se ha podido Eliminar!",icon: "error"
                      });
                    });
                }
              });
        }
      };

    const EditSyC = async () => {

        const EditServices = ServiciosTable.map(item => {
            const datos = {
                id_protocolo: props.ListDatos.idProtocolo, // Ajusta según tu estructura de datos
                id_servicio: item.id, // Ajusta según tu estructura de datos
                precio: item.Precio,
                fecha: item.Fecha, // Fecha en formato YYYY-MM-DD
                user: item.User
            };
            if (item.id_servicioProtocolo) {
                datos.id = item.id_servicioProtocolo; // Asigna el ID para editar
                return EditarServicioProtoclo(datos, props.user,props.token)
                    .then(response => {
                        return response;
                    })
                    .catch(error => {
                        console.error('Error al editar:', error);
                        throw error;
                    });
            } else {
                return registrarProtocolosServicios(datos, props.user,props.token)
                    .then(response => {
                        return response;
                    })
                    .catch(error => {
                        console.error('Error al registrar:', error);
                        throw error;
                    });
            }
        });
        const promises = ContratasTable.map(item => {
            const datos = {
                id_protocolo: props.ListDatos.idProtocolo, // Ajusta según tu estructura de datos
                rucContrata: item.ruc, // Ajusta según tu estructura de datos
                precio: item.precio,
                fecha: item.fecha, // Fecha en formato YYYY-MM-DD
                user: item.user
            };
    
            if (item.id) {
                datos.id = item.id; // Asigna el ID para editar
                return EditarContrataProtoclo(datos, props.user,props.token)
                    .then(response => {
                        return response;
                    })
                    .catch(error => {
                        console.error('Error al editar:', error);
                        throw error;
                    });
            } else {
                return registrarProtocolosContratas(datos, props.user,props.token)
                    .then(response => {
                        return response;
                    })
                    .catch(error => {
                        console.error('Error al registrar:', error);
                        throw error;
                    });
            }
        });
        Promise.all([EditServices,promises])
          .then(() => {
            Swal.fire('Exito', 'Datos Editados Correctamente', 'success');
          })
          .catch(() => {
            Swal.fire('Advertencia', 'No se puede traer los datos', 'warning');
          })
          .finally(() => {
            setLoading(false)
          })
    }

    const handleEdit = () => {
        setLoading(true)
        const body = {
            id: props.ListDatos.idProtocolo,
            nombreProtocolo: datos.Protocolo,
            rucEmpresa:  parseInt(String(datos.Ruc).trim(), 10),
            precio: totalPrecio,
            fecha: props.ListDatos.fechaRegistro,
            user: props.ListDatos.userRegistro
        }
        EditarProtocolos(body,props.user,props.token)
        .then((res) => {
            EditSyC()
        })
        .catch(() => {
            console.log('telibreerrros')
        })
    }

    const handlePrecioChange = (e, index) => {
        const newPrecio = parseFloat(e.target.value) ;
        const input = e.target.name;
        if (input === 'contrata') {
          setContratasTable(prevContratas => {
            const updatedContratas = [...prevContratas];
            updatedContratas[index] = {
              ...updatedContratas[index],
              precio: newPrecio
            };
            return updatedContratas;
          });
        } else if (input === 'servicio') {
          setServiciosTable(prevContratas => {
            const updatedContratas = [...prevContratas];
            updatedContratas[index] = {
              ...updatedContratas[index],
              Precio: newPrecio
            };
            return updatedContratas;
          });
        }
        
      };

      const totalPrecio = ServiciosTable.reduce((total, servicio) => total + servicio.Precio, 0);


    return (
        <>
            <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
                <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-md w-[400px] md:w-[800px] relative">
                    <FontAwesomeIcon
                        icon={faTimes}
                        className="absolute top-0 right-0 m-3 cursor-pointer text-white"
                        onClick={props.setShowEditModal}
                    />
                    <div className="p-3 azuloscurobackground flex justify-between">
                        <h1 className="text-start font-bold color-azul text-white">Servicios Creación y Lista</h1>
                    </div>
                    <div className="container p-4">
                    <label htmlFor="Protocolos" className="block font-medium mb-2">
                        Protocolos
                    </label>
                    <input       
                        name="Protocolo"
                        value={datos.Protocolo}
                        onChange={handleChange}
                        type="text"
                        className="border mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                    />
                    <label htmlFor="Empresa" className="block font-medium mb-2">
                        Contratas
                    </label>
                    <input
                        id="Empresa"
                        name="Empresa"
                        value={searchTerm.Empresa}
                        onChange={handleChange}
                        type="text"
                        className="border mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                    />
                    {searchTerm.Empresa && (
                    <div className="border border-gray-300 rounded-md mt-1 max-h-48 overflow-y-auto">
                    {filteredData.empresas.map((option, index) => (
                        <div
                        key={index}
                        className="cursor-pointer p-2 hover:bg-gray-200"
                        onClick={() => {
                            setDatos({...datos, Ruc:option.ruc, Empresa:option.razonSocial})
                            setSearchTerm({...searchTerm, Empresa: ''})
                        }}
                        >
                        {option.razonSocial}
                        </div>
                    ))}
                    </div>
                    )}
                    {datos.Ruc && (
                    <div className=" text-lg mt-1">Seleccionado: <strong>{datos.Empresa}</strong></div>
                    )}
                        <div className="flex w-full justify-between gap-10">
                            <div className='flex flex-col w-full mt-4'>
                                <p className="mb-2">Listado de Servicios:</p>
                                <div className="mb-4">
                                    <select
                                        id="Servicios"
                                        name="Servicios"
                                        onChange={handleChange}
                                        className="border mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                    >
                                        <option value="">Elija sus Servicios</option>
                                        {props.ListServicios.map((option, index) => (
                                            <option key={index} value={JSON.stringify(option)} >{option.nombreServicio}</option>
                                        ))}
                                    </select>
                                </div>
                                    <table className="w-full mt-6 border-collapse border border-gray-300">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="border border-gray-300 px-4 py-2">Nombre</th>
                                                <th className="border border-gray-300 px-4 py-2">Precio</th>
                                                <th className="border border-gray-300 px-4 py-2">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {ServiciosTable.map((option,index) => (
                                                <tr key={index}>
                                                    <td className="border border-gray-300 px-4 py-2">{option.Nombre}</td>
                                                    <td className="border border-gray-300 px-4 py-2">
                                                        <input type="number" name='servicio' className='w-full border-1 border-green-300 rounded-lg h-full' value={option.Precio} onChange={(e) => handlePrecioChange(e, index)} />
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2">
                                                    <FontAwesomeIcon
                                                        icon={faTrashAlt}
                                                        className="text-red-500 cursor-pointer"
                                                        onClick={() => {deleteitem("Servicios",index,option)}}
                                                    />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div className='flex justify-center'>
                                        <p>Precio TOTAL: S/{totalPrecio}</p>
                                    </div>
                            </div>
                            <div className='flex flex-col w-full mt-4'>
                                <p className="mb-2">Listado de Contratas:</p>
                                <div className="mb-4">
                                <input
                                id="Contrata"
                                name="Contrata"
                                value={searchTerm.Contrata}
                                onChange={handleChange}            
                                autoComplete='off'
                                placeholder='Ingresa la Contratas'
                                className="border mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                />
                                {searchTerm.Contrata && (
                                    <div className="border border-gray-300 rounded-md mt-1 max-h-48 overflow-y-auto">
                                    {filteredData.contratas.map((option, index) => (
                                        <div
                                        key={index}
                                        className="cursor-pointer p-2 hover:bg-gray-200"
                                        onClick={() => {
                                            setSearchTerm({...searchTerm, Contrata: ''});
                                            setFilteredData({...filteredData, contratas: []});
                                            newItem('Contrata',option)
                                        }}
                                        >
                                        {option.razonSocial}
                                        </div>
                                    ))}
                                    </div>
                                    )}
                                </div>
                                    <table className="w-full mt-6 border-collapse border border-gray-300">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="border border-gray-300 px-4 py-2">Nombre</th>
                                                <th className="border border-gray-300 px-4 py-2">Precio</th>
                                                <th className="border border-gray-300 px-4 py-2">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {ContratasTable.map((option,index) => (
                                                <tr key={index}>
                                                    <td className="border border-gray-300 px-4 py-2">{option.razonSocial}</td>
                                                    <td className="border border-gray-300 px-4 py-2">
                                                        <input type="number" name='contrata' className='w-full border-1 border-green-300 rounded-lg h-full' value={option.precio} onChange={(e) => handlePrecioChange(e, index)} />
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2">
                                                    <FontAwesomeIcon
                                                        icon={faTrashAlt}
                                                        className="text-red-500 cursor-pointer"
                                                        onClick={() => {deleteitem("Contratas",index,option)}}
                                                    />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                            </div>

                        </div>

                        <div className="flex justify-end">
                            <button
                            onClick={handleEdit}
                                className="mt-4 naranja-btn font-bold py-2 px-4 rounded"
                            >
                                Editar Protocolo
                            </button>
                        </div>

                    </div>
                </div>
            {loading && <Loading/>}

            </div>
        </>
    )
}

export default EditProtocolos