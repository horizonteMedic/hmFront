import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const CrearEmpresaContrataModal = ({ closeModal }) => {
    const [tipo, setTipo] = useState('empresa');
    const [razonSocial, setRazonSocial] = useState('');
    const [ruc, setRuc] = useState('');
    const [estado, setEstado] = useState(false);

    const handleTipoChange = (event) => {
        setTipo(event.target.value);
    };

    const handleRazonSocialChange = (event) => {
        setRazonSocial(event.target.value);
    };

    const handleRucChange = (event) => {
        setRuc(event.target.value);
    };

    const handleEstadoChange = () => {
        setEstado(!estado);
    };

    const registrarEmpresaContrata = () => {
        // Aquí iría la lógica para enviar los datos al servidor
        closeModal();
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
                <h1 className="text-start font-bold color-azul text-white">Creación de Empresas / Contratas</h1>
            </div>
            <div className='container p-4'>
                <div className="mb-4">
                    <label className="mr-2">
                        Seleccionar entre:
                    </label>
                    <select
                        value={tipo}
                        onChange={handleTipoChange}
                        className=" pointer border border-gray-300 rounded-md py-2 px-3 text-sm text-gray-700"
                    >
                        <option value="empresa">Empresa</option>
                        <option value="contrata">Contrata</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label>Razón Social:</label>
                    <input
                        type="text"
                        value={razonSocial}
                        onChange={handleRazonSocialChange}
                        className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm text-gray-700"
                    />
                </div>
                <div className="mb-4">
                    <label>RUC:</label>
                    <input
                        type="text"
                        value={ruc}
                        onChange={handleRucChange}
                        className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm text-gray-700"
                    />
                </div>
                <div className="mb-4">
                    <label>
                        Estado:
                        <input
                            type="checkbox"
                            checked={estado}
                            onChange={handleEstadoChange}
                            className="ml-2 pointer"
                        />
                    </label>
                </div>
                <div className="flex justify-center"> 
                        <button
                            onClick={registrarEmpresaContrata}
                            className="mb-3 naranjabackgroud text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Registrar
                        </button>
                    </div>
               
            </div>
        </div>
        </div>
    );
};

export default CrearEmpresaContrataModal;
