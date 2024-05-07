import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import AddNewSedeUserModal from '../AddNewSedeUserModal/AddNewSedeUserModal'; // Importa el nuevo componente

const ConfigModal = ({ closeModal }) => {
    const [userName, setUserName] = useState('');
    const [userTableData, setUserTableData] = useState([]);
    const [showAddSedeModal, setShowAddSedeModal] = useState(false); // Estado para controlar la visualización del modal

    const handleSave = () => {
        const newUserTableData = [...userTableData, { name: userName }];
        setUserTableData(newUserTableData);
        console.log("Nuevo usuario y sus sedes:", newUserTableData);
        setUserName('');
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
            <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-md w-[500px] h-auto relative">

                <FontAwesomeIcon
                    icon={faTimes}
                    className="absolute top-0 right-0 m-3 cursor-pointer  color-blanco"
                    onClick={closeModal}
                />
                <div className="p azuloscurobackground flex justify-between p-3.5">
                    <h1 className="text-start font-bold color-azul text-white">Asignar Sede</h1>
                </div>
                <div className='container p-4'>
                    <div>
                        <label htmlFor="userName" className="block mb-2">Usuario:</label>
                        <input 
                            type="text"
                            id="userName"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            className="border border-gray-400 p-2 rounded-md mb-4 w-full"
                        />
                    </div>
                    <div>
                        <table className="w-full mb-4">
                            <thead>
                                <tr>
                                    <th className="border border-gray-400 px-4 py-2">Id</th>
                                    <th className="border border-gray-400 px-4 py-2">Sede</th>
                                    <th className="border border-gray-400 px-4 py-2">Fecha de registro</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userTableData.map((userData, index) => (
                                    <tr key={index}>
                                        <td className="border border-gray-400 px-4 py-2">{index + 1}</td>
                                        <td className="border border-gray-400 px-4 py-2">{userData.name}</td>
                                        <td className="border border-gray-400 px-4 py-2">{/* Aquí debería ir la fecha de registro */}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-end">
                        <button onClick={() => setShowAddSedeModal(true)} className="ml-4 mr-4 naranjabackgroud text-white py-2 px-4 rounded ">Agregar otra sede</button>
                    </div>
                </div>
            </div>
            {showAddSedeModal && (
                <AddNewSedeUserModal closeModal={() => setShowAddSedeModal(false)} />
            )}
        </div>

    );
};

export default ConfigModal;
