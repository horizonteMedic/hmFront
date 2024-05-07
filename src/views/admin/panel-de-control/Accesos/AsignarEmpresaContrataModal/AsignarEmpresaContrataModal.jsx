import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import CrearEmpresaContrataModal from '../CrearEmpresaContrataModal/CrearEmpresaContrataModal'; // Importa el nuevo componente
import { ListEoCUsername } from '../model/ListarEoCUser';

//Primer Modal
const AsignarEmpresaContrataModal = ({ closeModal, id, user,userlogued, token }) => {

    //Consulta de la API
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [refres, setRefresh] = useState(0)

    const [empresas, setEmpresas] = useState([]);
    const [selectedEmpresa, setSelectedEmpresa] = useState('');
    const [selectedUser, setSelectedUser] = useState('');
    const [showCrearModal, setShowCrearModal] = useState(false); // Estado para controlar la visualización del modal de creación

    useEffect(() => {
        setLoading(true)
        ListEoCUsername(id, token)
        .then(response => {
          setData(response)
        })
        .catch(error => {
          throw new Error('Network response was not ok.',error);
        })
        .finally(() => {
          setLoading(false)
        })
      },[refres])
    
    const Refresgpag = () => {
        setRefresh(refres + +1)
    }
    

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
                    <h1 className="text-start font-bold mb-3">Usuario: {user}</h1>
                    {loading ? (
                        <p className="text-center">Cargando...</p>
                    ) : (
                    <table className="w-full border border-gray-300 mb-4">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border border-gray-300 px-2 py-1">Tipo</th>
                                <th className="border border-gray-300 px-2 py-1">Razón Social</th>
                                <th className="border border-gray-300 px-2 py-1">RUC</th>
                                <th className="border border-gray-300 px-2 py-1">Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.map((item, index) => (
                            <tr key={index}>
                                <td className="border border-gray-300 px-2 py-1">{item.tipo}</td>
                                <td className="border border-gray-300 px-2 py-1">{item.razonSocial}</td>
                                <td className="border border-gray-300 px-2 py-1">{item.ruc}</td>
                                <td className="border border-gray-300 px-2 py-1">{item.estado ? 'Activo' : 'Inactivo'}</td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                    )}
                    <div className="flex justify-center"> 
                        <button
                            onClick={openCrearModal}
                            className="mb-3 naranjabackgroud text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Asignar Nueva Empresa / Contrata
                        </button>
                    </div>
                    {showCrearModal && (
                        <CrearEmpresaContrataModal closeModal={closeCrearModal} id={id} user={userlogued} token={token} Refresgpag={Refresgpag}/>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AsignarEmpresaContrataModal;
