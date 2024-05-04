import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import CrearEmpresaContrataModal from '../CrearEmpresaContrataModal/CrearEmpresaContrataModal'; // Importa el nuevo componente

const AsignarEmpresaContrataModal = ({ closeModal, idUser, token }) => {
    const [empresas, setEmpresas] = useState([]);
    const [selectedEmpresa, setSelectedEmpresa] = useState('');
    const [selectedUser, setSelectedUser] = useState('');
    const [showCrearModal, setShowCrearModal] = useState(false); // Estado para controlar la visualización del modal de creación

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

    const openCrearModal = () => {
        setShowCrearModal(true);
    };

    const closeCrearModal = () => {
        setShowCrearModal(false);
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
            <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-md w-[500px] h-auto relative">

                <FontAwesomeIcon
                    icon={faTimes}
                    className="absolute top-0 right-0 m-3 cursor-pointer color-blanco"
                    onClick={closeModal}
                />
                <div className="p azuloscurobackground flex justify-between p-3.5">
                    <h1 className="text-start font-bold color-azul text-white">Listado de Empresas y Contratas</h1>
                </div>
                <div className='container p-4'>
                    <h1 className="text-start font-bold mb-3">Usuario:</h1>
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
                    <div className="flex justify-center"> 
                        <button
                            onClick={openCrearModal}
                            className="mb-3 naranjabackgroud text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Asignar Nueva Empresa / Contrata
                        </button>
                    </div>
                    {showCrearModal && (
                        <CrearEmpresaContrataModal closeModal={closeCrearModal} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default AsignarEmpresaContrataModal;
