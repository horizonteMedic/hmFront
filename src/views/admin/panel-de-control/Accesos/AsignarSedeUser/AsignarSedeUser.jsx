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
        // Agrega más sedes si es necesario
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
        // Aquí puedes hacer lo que necesites con las sedes seleccionadas
        console.log("Sedes seleccionadas:", selectedSedes);
        // Puedes enviar las sedes seleccionadas a una función para guardarlas en el backend, por ejemplo
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
            <div className="bg-white rounded-lg shadow-md p-6 w-[400px] md:w-[600px] relative">
                <FontAwesomeIcon
                    icon={faTimes}
                    className="absolute top-0 right-0 m-4 cursor-pointer text-gray-500 hover:text-gray-700"
                    onClick={closeModal}
                />
                <h1 className="text-lg font-bold mb-4">Asignación de Sede</h1>
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
                <button onClick={handleSave} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Guardar</button>
            </div>
        </div>
    );
};

export default ConfigModal;
