import React, { useState } from 'react';
import FormLogin from './controller/FormLogin';

export function LoginPage() {
    // Estado para almacenar la sede seleccionada
    const [sede, setSede] = useState('');

    // Función para manejar el cambio de sede
    const handleSedeChange = (event) => {
        setSede(event.target.value);
    };

    return (
        <>
            <div className="d-flex flex-column w-full h-screen justify-center items-center">
                <div className="page page-center">
                    <div className="container-tight py-2 mt-auto mb-auto">
                        <div className="card card-md">
                            <div className="card-body">
                                {/* Select para seleccionar la sede */}
                                <div className="mb-4">
                                    <label htmlFor="sede" className="block text-sm font-medium text-gray-700">Seleccionar Sede</label>
                                    <select id="sede" name="sede" value={sede} onChange={handleSedeChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
                                        <option value="">Seleccionar Sede</option>
                                        <option value="sede1">Sede 1</option>
                                        <option value="sede2">Sede 2</option>
                                        <option value="sede3">Sede 3</option>
                                    </select>
                                </div>

                                {/* Componente de inicio de sesión */}
                                <h2 className="h2 text-center mb-4">¡Bienvenido!</h2>
                                <FormLogin sede={sede} /> {/* Pasar la sede al componente de inicio de sesión */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default LoginPage;
