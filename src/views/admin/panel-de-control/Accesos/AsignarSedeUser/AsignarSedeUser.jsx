import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import AddNewSedeUserModal from '../AddNewSedeUserModal/AddNewSedeUserModal'; // Importa el nuevo componente
import { ListSedesxUsername } from '../model/ListSedesUser';

const ConfigModal = ({ closeModal, id, user, userlogued, token }) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [refres, setRefresh] = useState(0)

    const [userName, setUserName] = useState('');
    const [userTableData, setUserTableData] = useState([]);
    const [showAddSedeModal, setShowAddSedeModal] = useState(false); // Estado para controlar la visualización del modal

    useEffect(() => {
        setLoading(true)
        ListSedesxUsername(id, token)
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
                        <label htmlFor="userName" className="block mb-2">Usuario: {user}</label>
                    </div>
                    <div>
                        {loading ? (
                            <p className="text-center">Cargando...</p>
                        ) : (
                        <table className="w-full mb-4">
                            <thead>
                                <tr>
                                    <th className="border border-gray-400 px-4 py-2">Id</th>
                                    <th className="border border-gray-400 px-4 py-2">Sede</th>
                                    <th className="border border-gray-400 px-4 py-2">Fecha de registro</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((item, index) => (
                                    <tr key={index}>
                                        <td className="border border-gray-400 px-4 py-2">{item.idUsuarioSede}</td>
                                        <td className="border border-gray-400 px-4 py-2">{item.sede}</td>
                                        <td className="border border-gray-400 px-4 py-2">{item.fechaRegistro}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        )}
                    </div>
                    <div className="flex justify-end">
                        <button onClick={() => setShowAddSedeModal(true)} className="ml-4 mr-4 naranjabackgroud text-white py-2 px-4 rounded ">Agregar otra sede</button>
                    </div>
                </div>
            </div>
            {showAddSedeModal && (
                <AddNewSedeUserModal closeModal={() => setShowAddSedeModal(false)} Refresgpag={Refresgpag} id_user={id} userlogued={userlogued} token={token}/>
            )}
        </div>

    );
};

export default ConfigModal;
