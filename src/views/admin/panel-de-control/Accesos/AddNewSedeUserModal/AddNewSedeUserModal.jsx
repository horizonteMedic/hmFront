import React, { useState, useEffect } from 'react';
import { getFetch } from '../../getFetch/getFetch';
import { AsignarSedexUsuario } from '../model/AsignarSedexUser';
import Swal from 'sweetalert2';
const AddNewSedeUserModal = ({ closeModal,Refresgpag, id_user,userlogued, token }) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [creating, setCreating] = useState(false);

    const [selectedSede, setSelectedSede] = useState('');
    
    function AleertSucces() {
        Swal.fire({
          title: "¡Exito!",
          text: "Se ha asigando una Nueva Sede al Usuario",
          icon: "success",
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Aceptar"
        }).then((result) => {
          if (result.isConfirmed) {
            closeModal();
            Refresgpag();
          }
        });
      }

    useEffect(() => {
        setLoading(true)
        getFetch('https://servicios-web-hm.azurewebsites.net/api/v01/ct/sede/listadoSedesHabilitados', token)
        .then(response => {
          setData(response)
        })
        .catch(error => {
          throw new Error('Network response was not ok.',error);
        })
        .finally(() => {
          setLoading(false)
        })
      },[])

    const handleSaveSede = () => {
        setCreating(true)
        AsignarSedexUsuario(id_user,selectedSede,userlogued,token)
        .then(data => {
          AleertSucces()
        })
        .catch(error => {
          console.error('Error', error);
        })
        .finally(() =>{
            setCreating(false)
        })
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
            <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-md w-[400px] h-auto relative">

                <div className="p azuloscurobackground flex justify-between p-3.5">
                    <h1 className="text-start font-bold color-azul text-white">Agregar Nueva Sede</h1>
                </div>
                <div className='container p-4'>
                    <div>
                        <label htmlFor="sedeName" className="block mb-2">Selecciona una Sede:</label>
                        <select
                            id="sedeName"
                            value={selectedSede}
                            onChange={(e) => setSelectedSede(e.target.value)}
                            className="border border-gray-400 p-2 rounded-md mb-4 w-full pointer"
                        >
                            <option value="">{data ? 'Seleccione...' : 'Espera un momento'}</option>
                            {data?.map((option, index) => (
                                <option key={index} value={option.id}>{option.nombreSede}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-end">
                        <button onClick={closeModal} className="mr-4 azul-btn py-2 px-4 rounded focus:outline-none">Cancelar</button>
                        <button onClick={handleSaveSede}
                        disabled={creating}
                        className="naranjabackgroud text-white py-2 px-4 rounded focus:outline-none focus:bg-blue-600 transition-colors duration-300 ease-in-out"
                        >{creating ? 'Realizando Asignacion...' : 'Asignar'}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddNewSedeUserModal;
