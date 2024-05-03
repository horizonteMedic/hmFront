import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faTrash, faCogs } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import AsignarSedeUser from '../AsignarSedeUser/AsignarSedeUser'; // Importa el componente del modal de configuración/asignación
import { ListUser, DeleteUsers } from '../model/ListUserID'; // Importa ListUser y DeleteUsers desde su ubicación correcta

const UsersModal = ({ closeModal, idEmpleado, token }) => {
    const [data, setData] = useState([]);
    const [showAsignarSedeUser, setShowAsignarSedeUser] = useState(false); // Estado para controlar la visibilidad del modal de configuración/asignación

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

    const DeleteAlert = (id) => {
        Swal.fire({
            title: "¿Estas Seguro?",
            text: "No puedes revertir esta accion!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, Eliminar!"
        }).then((result) => {
            if (result.isConfirmed) {
                DeleteUsers(id, token)
                    .then(() => {
                        Swal.fire({
                            title: "Eliminado!",
                            text: "El Usuario ha sido Eliminado.",
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

    // Función para manejar el clic en el icono de configuración/asignación
    const handleConfigIconClick = () => {
        setShowAsignarSedeUser(true); // Abre el modal de configuración/asignación
    };

    return (
        <>
            {/* Modal de lista de usuarios */}
            <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
                <div className="bg-white rounded-lg shadow-md p-6 w-[400px] md:w-[880px] relative">
                    <FontAwesomeIcon
                        icon={faTimes}
                        className="absolute top-0 right-0 m-4 cursor-pointer text-gray-500"
                        onClick={closeModal}
                    />
                    <h1 className="text-start font-bold mb-4">Lista de Usuarios vinculados</h1>
                    {/* Tabla de usuarios */}
                    <table className="w-full border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border border-gray-300 px-2 py-1">Nro.</th>
                                <th className="border border-gray-300 px-2 py-1">Acciones</th>
                                <th className="border border-gray-300 px-2 py-1">Username</th>
                                <th className="border border-gray-300 px-2 py-1">Estado</th>
                                <th className="border border-gray-300 px-2 py-1">Ruc</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, index) => (
                                <tr key={index}>
                                    <td className="border border-gray-300 px-2 py-1">{index + 1}</td>
                                    <td className="border border-gray-300 px-2 py-1">
                                        <FontAwesomeIcon icon={faTrash} onClick={() => { DeleteAlert(item.idUser) }} className="text-red-500 cursor-pointer" />
                                        {/* Icono de configuración/asignación */}
                                        <FontAwesomeIcon icon={faCogs} onClick={handleConfigIconClick} className="text-blue-500 ml-2 cursor-pointer" />
                                    </td>
                                    <td className="border border-gray-300 px-2 py-1">{item.username}</td>
                                    <td className={`border border-gray-300 px-2 py-1 ${item.estado ? 'bg-green-300' : 'bg-red-300'}`}>{item.estado ? 'Activo' : 'Inactivo'}</td>
                                    <td className="border border-gray-300 px-2 py-1">{item.ruc}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de configuración/asignación */}
            {showAsignarSedeUser && <AsignarSedeUser closeModal={() => setShowAsignarSedeUser(false)} />}
        </>
    );
};

export default UsersModal;
