import React, { useState } from 'react';
import FormLogin from './controller/FormLogin';

export function LoginPage() {

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="max-w-md w-full mx-4"> 
                <div className="bg-white shadow-md rounded-lg p-6">
                    <div className="flex justify-center mb-6">
                        <img src="https://horizontemedic.com/images/Logo.png" alt="Logo" className="w-32" />
                    </div>
                    <p className="text-2xl font-semibold text-center mb-6 " style={{ color: "#084788" }}> <strong>Iniciar Sesión</strong></p>

                    <FormLogin />

                </div>
            </div>
        </div>
    );
}

export default LoginPage;
