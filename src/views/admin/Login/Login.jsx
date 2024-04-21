import React, { useState } from 'react';
import FormLogin from './controller/FormLogin';

export function LoginPage() {

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="max-w-md w-full">
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-2xl font-semibold text-center mb-6">¡Bienvenido!</h2>

                    <FormLogin  />

                </div>
            </div>
        </div>
    );
}

export default LoginPage;
