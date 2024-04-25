export const Configrol =() => {
    return (
        <>  
            <div className="dashboard-container">
                <div className="main-content flex flex-col items-center justify-center p-5">
                    <div className="flex flex-wrap w-[70%] flex-col justify-center text-center">
                        <h1 className="text-center font-bold mb-4">Configuración de Roles</h1>
                        <div className="flex m-2 p-2 justify-around items-center">
                            <div className="flex flex-col justify-center items-center">
                                <h1 className="text-center">Roles:</h1>
                                <select class="form-select" aria-label="Default select example">
                                    <option selected>Open this select menu</option>
                                    <option value="1">One</option>
                                    <option value="2">Two</option>
                                    <option value="3">Three</option>
                                </select>
                            </div>
                            <div className="flex flex-col w-[50%] justify-center items-center">
                                <h1>Tabla de Vistas</h1>
                                <div className=" h-64 w-full bg-yellow-200 rounded-lg">
                                    <a href="#">Triaje</a>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 bg-white rounded-lg overflow-hidden shadow-xl p-6">
                            <h1 className="text-center font-bold mb-4">Configuracion</h1>
                            <div className="overflow-x-auto mb-4">
                            <table className="w-full border border-gray-300 px-3 py-2">
                                <thead>
                                <tr className="bg-gray-200">
                                    <th className="border border-gray-300 px-2 py-1">Nro.</th>
                                    <th className="border border-gray-300 px-2 py-1">Descripción</th>
                                    <th className="border border-gray-300 px-2 py-1">Estado</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td className="border border-gray-300 px-2 py-1">1</td>
                                    <td className="border border-gray-300 px-2 py-1">DNI</td>
                                    <td className="border border-gray-300 px-2 py-1">12345678</td>
                                    <td className="border border-gray-300 px-2 py-1 bg-green-300">Activo</td>
                                </tr>
                                </tbody>
                            </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Configrol