import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faTimes, faTrash, faTentArrowDownToLine, faBuilding } from '@fortawesome/free-solid-svg-icons'; // Agregado faBuilding
import Swal from 'sweetalert2';
import AsignarSedeUser from '../AsignarSedeUser/AsignarSedeUser';
import AsignarEmpresaContrataModal from '../AsignarEmpresaContrataModal/AsignarEmpresaContrataModal'; // Importamos el nuevo modal
import { ListUser, DeleteUsers } from '../model/ListUserID';

const UsersModal = ({ closeModal, userlogued,idEmpleado, token }) => {
    const [data, setData] = useState([]);
    const [showAsignarSedeUser, setShowAsignarSedeUser] = useState(false);
    const [showAsignarEmpresaContrataModal, setShowAsignarEmpresaContrataModal] = useState(false); // Estado para controlar la visibilidad del nuevo modal
    
    const [iduser, setIduser] = useState('')
    const [username, setUsername] = useState('')
    console.log(data)
    useEffect(() => {
        ListUser(idEmpleado, token)
            .then(response => {
                setData(response);
            })
            .catch(error => {
                throw new Error('Network response was not ok.', error);
            });
    }, []);

    const Refresgpag = () => {
        ListUser(idEmpleado, token)
            .then(response => {
                setData(response);
            })
            .catch(error => {
                throw new Error('Network response was not ok.', error);
            });
    };

    const DeleteAlert = (id,username,id_empleado) => {
        Swal.fire({
            title: "¿Estas Seguro?",
            text: "No puedes revertir esta accion!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, Deshabilitar!"
        }).then((result) => {
            if (result.isConfirmed) {
                DeleteUsers(id, username, id_empleado,token)
                    .then(() => {
                        Swal.fire({
                            title: "Deshabilitar!",
                            text: "El Usuario ha sido Deshabilitar.",
                            icon: "success"
                        }).then(() => {
                            Refresgpag();
                        });
                    })
                    .catch(() => {
                        Swal.fire({
                            title: "Error!",
                            text: "El Usuario no se ha podido Eliminar!",
                            icon: "error"
                        });
                    });
            }
        });
    };

    const handleConfigIconClick = (id,username) => {
        setIduser(id)
        setUsername(username)
        setShowAsignarSedeUser(true);
    };

    const handleAsignarEmpresaContrataIconClick = (id,username) => {
        setIduser(id)
        setUsername(username)
        setShowAsignarEmpresaContrataModal(true); // Abrir el nuevo modal
    };

    return (
        <>
            <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
                <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-md  w-[400px] md:w-[880px] relative">

                    <FontAwesomeIcon
                        icon={faTimes}
                        className="absolute top-0 right-0 m-3 cursor-pointer  color-blanco"
                        onClick={closeModal}
                    />
                <div className="p azuloscurobackground flex justify-between p-3.5">
                    <h1 className="text-start font-bold color-azul text-white">Lista de Usuarios vinculados</h1>
                </div>
                    <div className='container p-4'>
                        <table className="w-full border border-gray-300">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="border border-gray-300 px-2 py-1">Nro.</th>
                                    <th className="border border-gray-300 px-2 py-1">Acciones</th>
                                    <th className="border border-gray-300 px-2 py-1">Username</th>
                                    <th className="border border-gray-300 px-2 py-1">Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((item, index) => (
                                    <tr key={index}>
                                        <td className="border border-gray-300 px-2 py-1">{index + 1}</td>
                                        <td className="border border-gray-300 px-2 py-1">
                                            <FontAwesomeIcon icon={faTrash} onClick={() => { DeleteAlert(item.idUser,item.username,item.id_empleado) }} className="text-red-500 cursor-pointer" />
                                            <FontAwesomeIcon icon={faTentArrowDownToLine} onClick={()=> {handleConfigIconClick(item.idUser,item.username)}} className="text-blue-500 ml-2 cursor-pointer" />
                                            {/* Agregamos el icono para asignar empresa contratante */}
                                            <FontAwesomeIcon icon={faBuilding} onClick={() => {handleAsignarEmpresaContrataIconClick(item.idUser,item.username)}} className="text-green-500 ml-2 cursor-pointer" />
                                        </td>
                                        <td className="border border-gray-300 px-2 py-1">{item.username}</td>
                                        <td className={`border border-gray-300 px-2 py-1 ${item.estado ? 'bg-green-300' : 'bg-red-300'}`}>{item.estado ? 'Activo' : 'Inactivo'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {/* Cuadro de leyenda horizontal o vertical */}
                        <div className="mt-4 flex flex-col md:flex-row items-center justify-center md:justify-center bg-gray-100 rounded-lg p-3 mx-auto md:mx-0">
                            <div className="flex items-center mb-2 md:mb-0">
                                <FontAwesomeIcon icon={faTrash} className="text-red-500" />
                                <p className="text-sm ml-2 md:ml-4">Eliminar Usuario</p>
                            </div>
                            <div className="flex items-center mb-2 md:mb-0 md:ml-6">
                                <FontAwesomeIcon icon={faTentArrowDownToLine} className="text-blue-500" />
                                <p className="text-sm ml-2 md:ml-4">Asiganación de Sede </p>
                            </div>
                            <div className="flex items-center mb-2 md:mb-0 md:ml-6">
                                <FontAwesomeIcon icon={faBuilding} className="text-green-500" />
                                <p className="text-sm ml-2 md:ml-4">Asignar Empresa/Contrata</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showAsignarSedeUser && <AsignarSedeUser closeModal={() => setShowAsignarSedeUser(false)} id={iduser} user={username} userlogued={userlogued} token={token}/>}
            {/* Renderizamos el nuevo modal */}
            {showAsignarEmpresaContrataModal && <AsignarEmpresaContrataModal closeModal={() => setShowAsignarEmpresaContrataModal(false)} id={iduser} user={username} userlogued={userlogued} token={token}/>}
        </>
    );
};

export default UsersModal;
