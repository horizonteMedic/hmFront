import React, { useState } from 'react';

const AddNewSedeUserModal = ({ closeModal }) => {
    const [selectedSede, setSelectedSede] = useState('');

    const handleSaveSede = () => {
        console.log("Sede seleccionada:", selectedSede);
        closeModal();
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
            <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-md w-[500px] h-auto relative">

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
                            className="border border-gray-400 p-2 rounded-md mb-4 w-full"
                        >
                            <option value="">Selecciona una sede</option>
                            <option value="sedeA">Sede A</option>
                            <option value="sedeB">Sede B</option>
                            <option value="sedeC">Sede C</option>
                        </select>
                    </div>
                    <div className="flex justify-end">
                        <button onClick={closeModal} className="mr-4 azul-btn py-2 px-4 rounded focus:outline-none">Cancelar</button>
                        <button onClick={handleSaveSede} className="naranjabackgroud text-white py-2 px-4 rounded focus:outline-none focus:bg-blue-600 transition-colors duration-300 ease-in-out">Asignar</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddNewSedeUserModal;
