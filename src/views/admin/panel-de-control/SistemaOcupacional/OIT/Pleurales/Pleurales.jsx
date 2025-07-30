const Pleurales = () => {
return(
        <>
            <div className="w-auto">
                <div className="flex justify-between items-center">
                    <h2 className="font-bold">III. ANORMALIDADES PLEURALES (SI NO HAY ANORMALIDADES PASE A SIMBOLOS)</h2>
                    <div className="flex">
                        <input type="checkbox" name="" id="" />
                        <label htmlFor="">SI</label>

                        <input type="checkbox" name="" id="" />
                        <label htmlFor="">NO</label>
                    </div>
                </div>
                <div className="flex flex-row w-auto mt-4">
                    {/*Cuadros */}
                    <div className="flex flex-col w-auto items-start justify-center border rounded-md p-3">
                        <p className=" text-xl text-gray-600">Sitio</p>
                        <p className="text-xl mb-2 text-gray-600">(Marque todas las zonas afectadas)</p>
                    </div>

                    <div className="flex flex-col w-auto items-start justify-center border rounded-md p-3 ml-2">
                        <p className=" text-xl text-gray-600">Calcifiación</p>
                        <p className="text-xl mb-2 text-gray-600">(Marque)</p>
                    </div>

                    <div className="flex flex-col w-auto items-center justify-center border rounded-md p-3 ml-2">
                        <p className=" text-xl font-bold text-gray-600">Extensión</p>
                        <p className="text-xl mb-2 font-bold text-gray-600">(Pared Torácica; combinada para placas de perfil y de frente)</p>

                        {/* Opciones */}
                        <div className="flex flex-col gap-y-2 gap-x-4 pl-2">
                            <div className="flex flex-row">
                                <input type="checkbox" name="" id="" />
                                <span>{" < 1/4 de la pared lateral de tórax"}</span>
                            </div>
                            <div className="flex flex-row">
                                <input type="checkbox" name="" id="" />
                                <span>{" Entre 1/4 y 1/2 de la pared lateral de tórax"}</span>
                            </div>
                            <div className="flex flex-row">
                                <input type="checkbox" name="" id="" />
                                <span>{" > 1/2 de la pared lateral de tórax"}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col w-auto items-center justify-center border rounded-md p-3 ml-2">
                        <p className=" text-xl font-bold text-gray-600">Ancho (opcional)</p>
                        <p className="text-xl mb-2 font-bold text-gray-600">(Ancho minímo elegido: 3 mm)</p>

                        {/* Opciones */}
                        <div className="flex flex-col gap-y-2 gap-x-4 pl-2">
                            <div className="flex flex-row">
                                <input type="checkbox" name="" id="" />
                                <span>{" De 3 a 5 mm"}</span>
                            </div>
                            <div className="flex flex-row">
                                <input type="checkbox" name="" id="" />
                                <span>{" De 5 a 10 mm"}</span>
                            </div>
                            <div className="flex flex-row">
                                <input type="checkbox" name="" id="" />
                                <span>{" Mayor a 10 mm"}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>    
        </>
    )
}

export default Pleurales