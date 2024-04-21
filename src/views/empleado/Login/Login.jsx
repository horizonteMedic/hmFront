import React, { useState } from 'react';
import FormLogin from './controller/FormLogin';

export function LoginPage() {
    const [sede, setSede] = useState('');

    const handleSedeChange = (event) => {
        setSede(event.target.value);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="max-w-md w-full">
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-2xl font-semibold text-center mb-6">¡Bienvenido!</h2>

                    <div className="mb-4">
                        <label htmlFor="sede" className="block text-sm font-medium text-gray-700 mb-1">Seleccionar Sede</label>
                        <select
                            id="sede"
                            name="sede"
                            value={sede}
                            onChange={handleSedeChange}
                            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 bg-white cursor-pointer"
                        >
                            <option value="">Seleccionar Sede</option>
                            <option value="sede1">Sede 1</option>
                            <option value="sede2">Sede 2</option>
                            <option value="sede3">Sede 3</option>
                        </select>
                    </div>

                    <FormLogin sede={sede} />

                </div>
            </div>
        </div>
    );
}

export default LoginPage;
