import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

const AsignarEmpresaContrataModal = ({ closeModal, idUser, token }) => {
    const [empresas, setEmpresas] = useState([]);
    const [selectedEmpresa, setSelectedEmpresa] = useState('');
    const [selectedUser, setSelectedUser] = useState('');

    useEffect(() => {
    }, [token]);

    const handleEmpresaChange = (event) => {
        setSelectedEmpresa(event.target.value);
    };

    const handleUserChange = (event) => {
        setSelectedUser(event.target.value);
    };

    const asignarEmpresaContrata = () => {
        closeModal();
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
            <div className="bg-white rounded-lg shadow-md p-6 w-[400px] relative">
                <FontAwesomeIcon
                    icon={faTimes}
                    className="absolute top-0 right-0 m-4 cursor-pointer text-gray-500"
                    onClick={closeModal}
                />
                
                <h1 className="text-start font-bold mb-4">Listado de Empresas y Contratas</h1>
                <h1 className="text-start font-bold mb-2">Usuario:</h1>
                <div className="mb-4">
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm text-gray-700"
                        value={selectedUser}
                        onChange={handleUserChange}
                        placeholder="Usuario por lectura de la API"
                    />
                </div>
                <table className="w-full border border-gray-300 mb-4">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-300 px-2 py-1">Tipo</th>
                            <th className="border border-gray-300 px-2 py-1">Razón Social</th>
                            <th className="border border-gray-300 px-2 py-1">Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-gray-300 px-2 py-1">Tipo Empresa/Contrata</td>
                            <td className="border border-gray-300 px-2 py-1">Nombre Empresa/Contrata</td>
                            <td className="border border-gray-300 px-2 py-1">Estado</td>
                        </tr>
                    </tbody>
                </table>
                
                <button
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                Registrar Nueva Empresa
                </button>
            </div>
        </div>
    );
};

export default AsignarEmpresaContrataModal;
