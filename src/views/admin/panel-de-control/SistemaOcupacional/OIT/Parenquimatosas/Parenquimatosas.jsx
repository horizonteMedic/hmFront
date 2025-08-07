const Parenquimatosas = ({form,setForm}) => {
    
    const handleCheck = (name) => {
        setForm((prevForm) => {
            // Si la misma opción ya está seleccionada, deselecciónala
            if (prevForm[name]) {
                return {
                    ...prevForm,
                    rbBuena: false,
                    rbAceptable: false,
                    rbBajacalidad: false,
                    rbInaceptable: false
                };
            }
            // Activar solo la opción seleccionada y desactivar las demás
            return {
                ...prevForm,
                rbBuena: false,
                rbAceptable: false,
                rbBajacalidad: false,
                rbInaceptable: false,
                [name]: true
            };
        });
    };

    const handleCheck2 = (name) => {
        setForm((prevForm) => {
            // Si la misma opción ya está seleccionada, deselecciónala
            if (prevForm[name]) {
                return {
                    ...prevForm,
                    rbSobreexposicion: false,
                    rbSubexposicion: false,
                    rbPosicioncentrado: false,
                    rbInspiracionInsuficiente: false,
                    rbEscapulas: false,
                    rbArtefactos: false,
                    rbOtros: false,
                };
            }
            // Activar solo la opción seleccionada y desactivar las demás
            return {
                ...prevForm,
                rbSobreexposicion: false,
                rbSubexposicion: false,
                rbPosicioncentrado: false,
                rbInspiracionInsuficiente: false,
                rbEscapulas: false,
                rbArtefactos: false,
                rbOtros: false,
                [name]: true
            };
        });
    };

    const handleInputChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value.toUpperCase() });
    };

    const handleInputChangeChecked = (e) => {
        const { name, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: checked
        }));
    };

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
                                <input className="ml-8" type="checkbox" name="rbBuena" id="rbBuena" checked={form.rbBuena} onChange={() => handleCheck('rbBuena')} />
                            </div>
                            <div className="flex flex-row m-2">
                                <label htmlFor="">2.- Aceptable</label>
                                <input className="ml-2" type="checkbox" name="rbAceptable" id="rbAceptable" checked={form.rbAceptable} onChange={() => handleCheck('rbAceptable')}/>
                            </div>
                            <div className="flex flex-row m-2">
                                <label htmlFor="">3.- Baja Calidad</label>
                                <input className="ml-2" type="checkbox" name="rbBajacalidad" id="rbBajacalidad" checked={form.rbBajacalidad} onChange={() => handleCheck('rbBajacalidad')}/>
                            </div>
                            <div className="flex flex-row m-2">
                                <label htmlFor="">4.- Inaceptable</label>
                                <input className="ml-2" type="checkbox" name="rbInaceptable" id="rbInaceptable" checked={form.rbInaceptable} onChange={() => handleCheck('rbInaceptable')}/>
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
                                <input className="ml-2" type="checkbox" name="rbSobreexposicion" id="rbSobreexposicion" checked={form.rbSobreexposicion} onChange={() => handleCheck2('rbSobreexposicion')}/>
                                <label className="ml-10" htmlFor="">Escápulas</label>
                                <input className="ml-2" type="checkbox" name="rbEscapulas" id="rbEscapulas" checked={form.rbEscapulas} onChange={() => handleCheck2('rbEscapulas')}/>
                            </div>
                            <div className="flex flex-row m-2">
                                <label htmlFor="">Subexposición</label>
                                <input className="ml-2" type="checkbox" name="rbSubexposicion" id="rbSubexposicion" checked={form.rbSubexposicion} onChange={() => handleCheck2('rbSubexposicion')}/>
                                <label className="ml-16" htmlFor="">Artefactos</label>
                                <input className="ml-2" type="checkbox" name="rbArtefactos" id="rbArtefactos" checked={form.rbArtefactos} onChange={() => handleCheck2('rbArtefactos')}/>
                            </div>
                            <div className="flex flex-row m-2">
                                <label htmlFor="">Posición centrado</label>
                                <input className="ml-2" type="checkbox" name="rbPosicioncentrado" id="rbPosicioncentrado" checked={form.rbPosicioncentrado} onChange={() => handleCheck2('rbPosicioncentrado')}/>
                                <label className="ml-10" htmlFor="">Otros</label>
                                <input className="ml-2" type="checkbox" name="rbOtros" id="rbOtros" checked={form.rbOtros} onChange={() => handleCheck2('rbOtros')}/>
                            </div>
                            <div className="flex flex-row m-2">
                                <label htmlFor="">Inspiración Insuficiente</label>
                                <input className="ml-2" type="checkbox" name="rbInspiracionInsuficiente" id="rbInspiracionInsuficiente" checked={form.rbInspiracionInsuficiente} onChange={() => handleCheck2('rbInspiracionInsuficiente')}/>
                            </div>
                        </div>
                        
                    </div>

                </div>
                <div className="flex flex-row items-center my-3">
                    <label htmlFor="">Comentario sobre defectos técnicos: </label>
                    <input type="text" className='border rounded w-full px-2 py-1 mx-4' value={form.txtDefectosTecnicos} />
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
                            <input type="checkbox" className="mx-auto" name="chk1D" id="chk1D" checked={form.chk1D} onChange={handleInputChangeChecked} />
                            <input type="checkbox" className="mx-auto" name="chk1I" id="chk1I" checked={form.chk1I} onChange={handleInputChangeChecked}/>

                            {/* Fila Medio */}
                            <label className="text-sm">Medio</label>
                            <input type="checkbox" className="mx-auto" name="chk2D" id="chk2D" checked={form.chk2D} onChange={handleInputChangeChecked}/>
                            <input type="checkbox" className="mx-auto" name="chk2I" id="chk2I" checked={form.chk2I} onChange={handleInputChangeChecked}/>

                            {/* Fila Inferior */}
                            <label className="text-sm">Inferior</label>
                            <input type="checkbox" className="mx-auto" name="chk3D" id="chk3D" checked={form.chk3D} onChange={handleInputChangeChecked}/>
                            <input type="checkbox" className="mx-auto" name="chk3I" id="chk3I" checked={form.chk3I} onChange={handleInputChangeChecked}/>
                        </div>
                    </div>

                    <div className="flex flex-col w-auto items-start border rounded-md p-3 ml-2">
                        <p className="text-sm font-semibold">2.2. Profusión (opacidades pequeñas)</p>
                        <p className="text-sm text-gray-600">(escala de 12 puntos)</p>
                        <p className="text-sm mb-2 text-gray-600">(Consulte las radiografias estandar -marque la subcateforia de profusión)</p>

                        <div className="grid grid-cols-3 gap-y-2 gap-x-4 pl-4">

                            {/* Fila Superior */}
                            <div className="flex items-center"><input type="checkbox" className="mx-auto" name="chk1" id="chk1" checked={form.chk1} onChange={handleInputChangeChecked}/> 0/- </div>
                            <div className="flex items-center"><input type="checkbox" className="mx-auto" name="chk5" id="chk5" checked={form.chk5} onChange={handleInputChangeChecked}/> 0/0 </div>
                            <div className="flex items-center"><input type="checkbox" className="mx-auto" name="chk9" id="chk9" checked={form.chk9} onChange={handleInputChangeChecked}/> 0/1 </div>
                            {/* Fila Medio */}
                            <div className="flex items-center"><input type="checkbox" className="mx-auto" name="chk2" id="chk2" checked={form.chk2} onChange={handleInputChangeChecked}/> 1/0 </div>
                            <div className="flex items-center"><input type="checkbox" className="mx-auto" name="chk6" id="chk6" checked={form.chk6} onChange={handleInputChangeChecked}/> 1/1 </div>
                            <div className="flex items-center"><input type="checkbox" className="mx-auto" name="chk10" id="chk10" checked={form.chk10} onChange={handleInputChangeChecked}/> 1/2 </div>

                            {/* Fila Inferior */}
                            <div className="flex items-center"><input type="checkbox" className="mx-auto" name="chk3" id="chk3" checked={form.chk3} onChange={handleInputChangeChecked}/> 2/1 </div>
                            <div className="flex items-center"><input type="checkbox" className="mx-auto" name="chk7" id="chk7" checked={form.chk7} onChange={handleInputChangeChecked}/> 2/2 </div>
                            <div className="flex items-center"><input type="checkbox" className="mx-auto" name="chk11" id="chk11" checked={form.chk11} onChange={handleInputChangeChecked}/> 2/3 </div>

                            <div className="flex items-center"><input type="checkbox" className="mx-auto" name="chk4" id="chk4" checked={form.chk4} onChange={handleInputChangeChecked}/> 3/2 </div>
                            <div className="flex items-center"><input type="checkbox" className="mx-auto" name="chk8" id="chk8" checked={form.chk8} onChange={handleInputChangeChecked}/> 3/3 </div>
                            <div className="flex items-center"><input type="checkbox" className="mx-auto" name="chk12" id="chk12" checked={form.chk12} onChange={handleInputChangeChecked}/> 3/+ </div>
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
                            <input type="checkbox" name="chkP1" id="chkP1" checked={form.chkP1} onChange={handleInputChangeChecked}/> <span className="text-sm">P</span>
                            </label>
                            <label className="flex items-center space-x-1">
                            <input type="checkbox" name="chkP4" id="chkP4" checked={form.chkP4} onChange={handleInputChangeChecked}/> <span className="text-sm">q</span>
                            </label>
                            <label className="flex items-center space-x-1">
                            <input type="checkbox" name="chkS1" id="chkS1" checked={form.chkS1} onChange={handleInputChangeChecked}/> <span className="text-sm">p</span>
                            </label>
                            <label className="flex items-center space-x-1">
                            <input type="checkbox" name="chkS4" id="chkS4" checked={form.chkS4} onChange={handleInputChangeChecked}/> <span className="text-sm">s</span>
                            </label>

                            {/* Fila 2 */}
                            <label className="flex items-center space-x-1">
                            <input type="checkbox" name="chkP2" id="chkP2" checked={form.chkP2} onChange={handleInputChangeChecked}/> <span className="text-sm">q</span>
                            </label>
                            <label className="flex items-center space-x-1">
                            <input type="checkbox" name="chkP5" id="chkP5" checked={form.chkP5} onChange={handleInputChangeChecked}/> <span className="text-sm">t</span>
                            </label>
                            <label className="flex items-center space-x-1">
                            <input type="checkbox" name="chkS2" id="chkS2" checked={form.chkS2} onChange={handleInputChangeChecked}/> <span className="text-sm">q</span>
                            </label>
                            <label className="flex items-center space-x-1">
                            <input type="checkbox" name="chkS5" id="chkS5" checked={form.chkS5} onChange={handleInputChangeChecked}/> <span className="text-sm">t</span>
                            </label>

                            {/* Fila 3 */}
                            <label className="flex items-center space-x-1">
                            <input type="checkbox" name="chkP3" id="chkP3" checked={form.chkP3} onChange={handleInputChangeChecked}/> <span className="text-sm">r</span>
                            </label>
                            <label className="flex items-center space-x-1">
                            <input type="checkbox" name="chkP6" id="chkP6" checked={form.chkP6} onChange={handleInputChangeChecked}/> <span className="text-sm">u</span>
                            </label>
                            <label className="flex items-center space-x-1">
                            <input type="checkbox" name="chkS3" id="chkS3" checked={form.chkS3} onChange={handleInputChangeChecked}/> <span className="text-sm">r</span>
                            </label>
                            <label className="flex items-center space-x-1">
                            <input type="checkbox" name="chkS6" id="chkS6" checked={form.chk1D} onChange={handleInputChangeChecked}/> <span className="text-sm">u</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex flex-col w-auto items-start border rounded-md p-3 ml-2">
                        <p className="text-sm font-semibold">2.4. Opacidades Grandes:</p>
                        <p className="text-sm mb-2 text-gray-600">(Marque O si no hay ninguna o marque A, B, o C)</p>


                        {/* Opciones */}
                        <div className="gap-y-2 gap-x-4 flex flex-col justify-center items-center pl-2">
                            <div className="flex justify-center items-center">
                                <input type="checkbox" name="chko" id="chko" checked={form.chko} onChange={handleInputChangeChecked} /> 
                                <label htmlFor=""> O</label>
                            </div>
                            <div className="flex justify-center items-center">
                                <input type="checkbox" name="chka" id="chka" checked={form.chka} onChange={handleInputChangeChecked} /> 
                                <label htmlFor=""> A</label>
                            </div>
                            <div className="flex justify-center items-center">
                                <input type="checkbox" name="chkb" id="chkb" checked={form.chkb} onChange={handleInputChangeChecked} /> 
                                <label htmlFor=""> B</label>
                            </div>
                            <div className="flex justify-center items-center">
                                <input type="checkbox" name="chkc" id="chkc" checked={form.chkc} onChange={handleInputChangeChecked} /> 
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