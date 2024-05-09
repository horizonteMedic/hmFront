import React, { useState, useEffect } from 'react';
import { getFetch } from '../../getFetch/getFetch';
import { AsignarRolUser } from '../model/AsiganarRolxUser';
import Swal from 'sweetalert2';
const AddNewRol = ({ closeModal,Refresgpag, id_user,userlogued, token }) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [creating, setCreating] = useState(false);

    const [selectedRol, setSelectedRol] = useState('');
    function AleertSucces() {
        Swal.fire({
          title: "¡Exito!",
          text: "Se ha asigando un Nuevo Rol",
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
        getFetch('https://servicios-web-hm.azurewebsites.net/api/v01/ct/rol', token)
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
        const nerrol = {id_user,selectedRol}
        AsignarRolUser(nerrol,userlogued,token)
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
            <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-md w-[500px] h-auto relative">

                <div className="p azuloscurobackground flex justify-between p-3.5">
                    <h1 className="text-start font-bold color-azul text-white">Agregar Nuevo Rol al Usuario</h1>
                </div>
                <div className='container p-4'>
                    <div>
                        <label htmlFor="sedeName" className="block mb-2">Selecciona un Rol:</label>
                        <select
                            id="RolName"
                            value={selectedRol}
                            onChange={(e) => setSelectedRol(e.target.value)}
                            className="border border-gray-400 p-2 rounded-md mb-4 w-full"
                        >
                            <option value="">{data ? 'Seleccione una Sede...' : 'Espera un momento'}</option>
                            {data?.map((option, index) => (
                                <option key={index} value={option.idRol}>{option.nombre}</option>
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

export default AddNewRol;
