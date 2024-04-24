import React, { useState } from 'react';
import FormLogin from './controller/FormLogin';

export function LoginPage() {

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="max-w-md w-full mx-4"> 
                <div className="bg-white shadow-md rounded-lg p-6">
                    <div className="flex justify-center mb-6">
                        <img src="img/logo-color.png" alt="Logo" className="w-[45%]" />
                    </div>
                        <p className="text-2xl font-semibold text-center mb-6 color-azul"><strong>Iniciar Sesión</strong></p>
                    <FormLogin />
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
