const ModalPreCarga = ({ opcionesPreCarga = [], setModalPreCarga, aplicarPreCarga }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-11/12 max-w-4xl max-h-[80vh] flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Seleccionar Pre-Carga ({opcionesPreCarga.length} resultados)
                    </h2>
                    <button
                        onClick={() => setModalPreCarga(false)}
                        className="text-gray-400 hover:text-gray-600 text-xl font-bold"
                    >
                        ×
                    </button>
                </div>

                {/* Tabla */}
                <div className="overflow-auto flex-1 px-6 py-4">
                    <table className="min-w-full border border-gray-200 text-sm">
                        <thead className="bg-gray-100 sticky top-0">
                            <tr>
                                <th className="border px-3 py-2 text-left">ID</th>
                                <th className="border px-3 py-2 text-left">Fecha</th>
                                <th className="border px-3 py-2 text-left">Empresa</th>
                                <th className="border px-3 py-2 text-left">Perfil</th>
                                <th className="border px-3 py-2 text-left">Cargo</th>
                                <th className="border px-3 py-2 text-left">Área</th>
                                <th className="border px-3 py-2 text-left">Precio</th>
                                <th className="border px-3 py-2 text-left">Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {opcionesPreCarga.map((item, i) => (
                                <tr key={i} className="hover:bg-orange-50 cursor-pointer">
                                    <td className="border px-3 py-2">{item.id}</td>
                                    <td className="border px-3 py-2">{item.fechaApertura}</td>
                                    <td className="border px-3 py-2">{item.razonEmpresa}</td>
                                    <td className="border px-3 py-2">{item.protocolo}</td>
                                    <td className="border px-3 py-2">{item.cargo}</td>
                                    <td className="border px-3 py-2">{item.area}</td>
                                    <td className="border px-3 py-2">{item.precio}</td>
                                    <td className="border px-3 py-2">
                                        <button
                                            onClick={() => aplicarPreCarga(item)}
                                            className="bg-orange-600 hover:bg-orange-500 text-white px-3 py-1 rounded text-xs"
                                        >
                                            Seleccionar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="px-6 py-3 border-t flex justify-end">
                    <button
                        onClick={() => setModalPreCarga(false)}
                        className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-100"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ModalPreCarga