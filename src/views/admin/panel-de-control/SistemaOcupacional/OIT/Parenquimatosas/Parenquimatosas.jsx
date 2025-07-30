const Parenquimatosas = () => {
    
    return(
        <>
            <div className="w-auto">
                <div className="flex flex-row">
                    {/*Cuadros */}
                    <div className="flex justify-around items-center border rounded-md p-3 divide-x">
                        {/* Sección Izquierda */}
                        <div className="pr-4">
                            <h2>Calidad Radiográfica</h2>
                        </div>

                        {/* Sección Derecha */}
                        <div className="pl-4 flex flex-col">
                            <div className="flex flex-row m-2">
                                <label htmlFor="">1.- Buena</label>
                                <input className="ml-8" type="radio" name="" id="" />
                            </div>
                            <div className="flex flex-row m-2">
                                <label htmlFor="">2.- Aceptable</label>
                                <input className="ml-2" type="radio" name="" id="" />
                            </div>
                            <div className="flex flex-row m-2">
                                <label htmlFor="">3.- Baja Calidad</label>
                                <input className="ml-2" type="radio" name="" id="" />
                            </div>
                            <div className="flex flex-row m-2">
                                <label htmlFor="">4.- Inaceptable</label>
                                <input className="ml-2" type="radio" name="" id="" />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-around items-center border rounded-md p-3 divide-x ml-3">
                        {/* Sección Izquierda */}
                        <div className="pr-4">
                            <h2>Causas</h2>
                        </div>

                        {/* Sección Derecha */}
                        <div className="pl-4 flex flex-col">
                            <div className="flex flex-row m-2">
                                <label htmlFor="">Sobre Exposición</label>
                                <input className="ml-2" type="radio" name="" id="" />
                                <label className="ml-10" htmlFor="">Escápulas</label>
                                <input className="ml-2" type="radio" name="" id="" />
                            </div>
                            <div className="flex flex-row m-2">
                                <label htmlFor="">Subexposición</label>
                                <input className="ml-2" type="radio" name="" id="" />
                                <label className="ml-16" htmlFor="">Artefactos</label>
                                <input className="ml-2" type="radio" name="" id="" />
                            </div>
                            <div className="flex flex-row m-2">
                                <label htmlFor="">Posición centrado</label>
                                <input className="ml-2" type="radio" name="" id="" />
                                <label className="ml-10" htmlFor="">Otros</label>
                                <input className="ml-2" type="radio" name="" id="" />
                            </div>
                            <div className="flex flex-row m-2">
                                <label htmlFor="">Inspiración Insuficiente</label>
                                <input className="ml-2" type="radio" name="" id="" />
                            </div>
                        </div>
                        
                    </div>

                </div>
                <div className="flex flex-row items-center my-3">
                    <label htmlFor="">Comentario sobre defectos técnicos: </label>
                    <input type="text" className='border rounded w-full px-2 py-1 mx-4' />
                </div>
                <h2 className="font-bold">II. ANORMALIDADES PARENQUIMATOSAS (SI NO HAY ANORMALIDADES PASE A III. A. PLEURALES</h2>
                <div className="flex flex-row w-auto mt-4">
                    {/*Cuadros */}
                    <div className="flex flex-col w-auto items-start border rounded-md p-3">
                        <p className="text-sm font-semibold">2.1. Zonas Afectadas</p>
                        <p className="text-sm mb-2 text-gray-600">(marque todas las zonas afectadas)</p>

                        <div className="grid grid-cols-3 gap-y-2 gap-x-4 pl-4">
                            {/* Encabezados vacíos + Der + Izq */}
                            <div></div>
                            <span className="text-sm font-medium text-center">Der.</span>
                            <span className="text-sm font-medium text-center">Izq.</span>

                            {/* Fila Superior */}
                            <label className="text-sm">Superior</label>
                            <input type="checkbox" className="mx-auto" />
                            <input type="checkbox" className="mx-auto" />

                            {/* Fila Medio */}
                            <label className="text-sm">Medio</label>
                            <input type="checkbox" className="mx-auto" />
                            <input type="checkbox" className="mx-auto" />

                            {/* Fila Inferior */}
                            <label className="text-sm">Inferior</label>
                            <input type="checkbox" className="mx-auto" />
                            <input type="checkbox" className="mx-auto" />
                        </div>
                    </div>

                    <div className="flex flex-col w-auto items-start border rounded-md p-3 ml-2">
                        <p className="text-sm font-semibold">2.2. Profusión (opacidades pequeñas)</p>
                        <p className="text-sm text-gray-600">(escala de 12 puntos)</p>
                        <p className="text-sm mb-2 text-gray-600">(Consulte las radiografias estandar -marque la subcateforia de profusión)</p>

                        <div className="grid grid-cols-3 gap-y-2 gap-x-4 pl-4">

                            {/* Fila Superior */}
                            <div className="flex items-center"><input type="checkbox" className="mx-auto" /> 0/- </div>
                            <div className="flex items-center"><input type="checkbox" className="mx-auto" /> 0/0 </div>
                            <div className="flex items-center"><input type="checkbox" className="mx-auto" /> 0/1 </div>
                            {/* Fila Medio */}
                            <div className="flex items-center"><input type="checkbox" className="mx-auto" /> 1/0 </div>
                            <div className="flex items-center"><input type="checkbox" className="mx-auto" /> 1/1 </div>
                            <div className="flex items-center"><input type="checkbox" className="mx-auto" /> 1/2 </div>

                            {/* Fila Inferior */}
                            <div className="flex items-center"><input type="checkbox" className="mx-auto" /> 2/1 </div>
                            <div className="flex items-center"><input type="checkbox" className="mx-auto" /> 2/2 </div>
                            <div className="flex items-center"><input type="checkbox" className="mx-auto" /> 2/3 </div>

                            <div className="flex items-center"><input type="checkbox" className="mx-auto" /> 3/2 </div>
                            <div className="flex items-center"><input type="checkbox" className="mx-auto" /> 3/3 </div>
                            <div className="flex items-center"><input type="checkbox" className="mx-auto" /> 3/+ </div>
                        </div>
                    </div>

                    <div className="flex flex-col w-auto items-start border rounded-md p-3 ml-2">
                        <p className="text-sm font-semibold">2.3. Forma y Tamaño:</p>
                        <p className="text-sm mb-2 text-gray-600">(Consulte las radiografias estandar; se requiere dos símbolos; marque un primario y un secudanrio)</p>

                        <div className="grid grid-cols-4 gap-x-4 mt-2 mb-1 pl-2">
                            <span className="col-span-2 text-center font-medium text-sm">Primaria</span>
                            <span className="col-span-2 text-center font-medium text-sm">Secundaria</span>
                        </div>

                        {/* Opciones */}
                        <div className="grid grid-cols-4 gap-y-2 gap-x-4 pl-2">
                            {/* Fila 1 */}
                            <label className="flex items-center space-x-1">
                            <input type="checkbox" /> <span className="text-sm">P</span>
                            </label>
                            <label className="flex items-center space-x-1">
                            <input type="checkbox" /> <span className="text-sm">q</span>
                            </label>
                            <label className="flex items-center space-x-1">
                            <input type="checkbox" /> <span className="text-sm">p</span>
                            </label>
                            <label className="flex items-center space-x-1">
                            <input type="checkbox" /> <span className="text-sm">s</span>
                            </label>

                            {/* Fila 2 */}
                            <label className="flex items-center space-x-1">
                            <input type="checkbox" /> <span className="text-sm">q</span>
                            </label>
                            <label className="flex items-center space-x-1">
                            <input type="checkbox" /> <span className="text-sm">t</span>
                            </label>
                            <label className="flex items-center space-x-1">
                            <input type="checkbox" /> <span className="text-sm">q</span>
                            </label>
                            <label className="flex items-center space-x-1">
                            <input type="checkbox" /> <span className="text-sm">t</span>
                            </label>

                            {/* Fila 3 */}
                            <label className="flex items-center space-x-1">
                            <input type="checkbox" /> <span className="text-sm">r</span>
                            </label>
                            <label className="flex items-center space-x-1">
                            <input type="checkbox" /> <span className="text-sm">u</span>
                            </label>
                            <label className="flex items-center space-x-1">
                            <input type="checkbox" /> <span className="text-sm">r</span>
                            </label>
                            <label className="flex items-center space-x-1">
                            <input type="checkbox" /> <span className="text-sm">u</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex flex-col w-auto items-start border rounded-md p-3 ml-2">
                        <p className="text-sm font-semibold">2.4. Opacidades Grandes:</p>
                        <p className="text-sm mb-2 text-gray-600">(Marque O si no hay ninguna o marque A, B, o C)</p>


                        {/* Opciones */}
                        <div className="gap-y-2 gap-x-4 flex flex-col justify-center items-center pl-2">
                            <div className="flex justify-center items-center">
                                <input type="checkbox" name="" id="" /> 
                                <label htmlFor=""> O</label>
                            </div>
                            <div className="flex justify-center items-center">
                                <input type="checkbox" name="" id="" /> 
                                <label htmlFor=""> A</label>
                            </div>
                            <div className="flex justify-center items-center">
                                <input type="checkbox" name="" id="" /> 
                                <label htmlFor=""> B</label>
                            </div>
                            <div className="flex justify-center items-center">
                                <input type="checkbox" name="" id="" /> 
                                <label htmlFor=""> C</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>    
        </>
    )
}

export default Parenquimatosas