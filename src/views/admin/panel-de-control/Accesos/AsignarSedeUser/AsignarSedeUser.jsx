import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const ConfigModal = ({ closeModal }) => {
    const [selectedSedes, setSelectedSedes] = useState([]);
    const sedes = [
        { id: 1, name: "Sede A" },
        { id: 2, name: "Sede B" },
        { id: 3, name: "Sede C" },
        { id: 4, name: "Sede D" },
    ];

    const handleCheckboxChange = (e) => {
        const sedeId = parseInt(e.target.value);
        if (e.target.checked) {
            setSelectedSedes([...selectedSedes, sedeId]);
        } else {
            setSelectedSedes(selectedSedes.filter(id => id !== sedeId));
        }
    };

    const handleSave = () => {
        console.log("Sedes seleccionadas:", selectedSedes);
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
                <div className="overflow-y-auto max-h-[300px]">
                    {sedes.map(sede => (
                        <div key={sede.id} className="flex items-center mb-2">
                            <input
                                type="checkbox"
                                id={`sede-${sede.id}`}
                                value={sede.id}
                                checked={selectedSedes.includes(sede.id)}
                                onChange={handleCheckboxChange}
                                className="mr-2 cursor-pointer"
                            />
                            <label htmlFor={`sede-${sede.id}`} className="cursor-pointer">{sede.name}</label>
                        </div>
                    ))}
                </div>
                <button onClick={handleSave} className="mt-4 naranjabackgroud text-white py-2 px-4 rounded focus:outline-none focus:bg-blue-600 transition-colors duration-300 ease-in-out">Guardar</button>
            </div>
        </div>
    </div>

    );
};

export default ConfigModal;
