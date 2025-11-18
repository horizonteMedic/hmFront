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

      // const handleInputChange = (e) => {
    //     setForm({ ...form, [e.target.name]: e.target.value.toUpperCase() });
    // };
    const handleInputChange = (e) => {
        const { name, value, selectionStart, selectionEnd } = e.target;

        setForm((f) => {
            const upper = value.toUpperCase();
            return { ...f, [name]: upper };
        });

        // Restaurar posición del cursor en el próximo ciclo
        requestAnimationFrame(() => {
            e.target.setSelectionRange(selectionStart, selectionEnd);
        });
    };

    const handleInputChangeChecked = (e) => {
        const { name, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: checked
        }));
    };

    const AnormalidadesNo = (set) => {
        set(prev => ({
            ...prev,
            anormalidades_parenquimatosas_si: false,
            anormalidades_parenquimatosas_no: true,
            chk1D: false,
            chk1I: false,
            chk2D: false,
            chk2I: false,
            chk3D: false,
            chk3I: false,
            //a
            chk1: false,
            chk2: false,
            chk3: false,
            chk4: false,
            chk5: true,
            chk6: false,
            chk7: false,
            chk8: false,
            chk9: false,
            chk10: false,
            chk11: false,
            chk12: false,
            //b
            chkP1: false,
            chkP2: false,
            chkP3: false,
            chkP4: false,
            chkP5: false,
            chkP6: false,
            chkS1: false,
            chkS2: false,
            chkS3: false,
            chkS4: false,
            chkS5: false,
            chkS6: false,
            //c
            chko: true,
            chka: false,
            chkb: false,
            chkc: false,
        }))
    }

    return(
        <>
            <div className="w-auto">
                <div className="flex flex-wrap gap-4">
                    {/*Cuadros */}
                    <div className="flex justify-around items-center border rounded p-3 divide-x">
                        {/* Sección Izquierda */}
                        <div className="min-w-[170px]">
                            <h2 className="text-center font-bold uppercase">Calidad Radiográfica</h2>
                        </div>

                        {/* Sección Derecha */}
                        <div className="px-6 flex flex-col gap-2">
                            {[
                                { label: "1.- Buena", name: "rbBuena" },
                                { label: "2.- Aceptable", name: "rbAceptable" },
                                { label: "3.- Baja Calidad", name: "rbBajacalidad" },
                                { label: "4.- Inaceptable", name: "rbInaceptable" },
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center">
                                <label htmlFor={item.name} className="w-40">{item.label}</label>
                                <input
                                    type="checkbox"
                                    id={item.name}
                                    name={item.name}
                                    checked={form[item.name]}
                                    onChange={() => handleCheck(item.name)}
                                />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-around items-center border rounded p-3 divide-x ">
                        {/* Sección Izquierda */}
                        <div className="min-w-[170px]">
                            <h2 className="text-center font-bold uppercase">Causas</h2>
                        </div>

                        {/* Sección Derecha */}
                        <div className="pl-6 grid grid-cols-2 gap-y-3 gap-x-16">
                            <div className="flex items-center">
                                <input type="checkbox" name="rbSobreexposicion" id="rbSobreexposicion"
                                    checked={form.rbSobreexposicion} onChange={() => handleCheck2('rbSobreexposicion')} />
                                <label htmlFor="rbSobreexposicion" className="ml-2">Sobre Exposición</label>
                            </div>

                            <div className="flex items-center">
                                <input type="checkbox" name="rbEscapulas" id="rbEscapulas"
                                    checked={form.rbEscapulas} onChange={() => handleCheck2('rbEscapulas')} />
                                <label htmlFor="rbEscapulas" className="ml-2">Escápulas</label>
                            </div>

                            <div className="flex items-center">
                                <input type="checkbox" name="rbSubexposicion" id="rbSubexposicion"
                                    checked={form.rbSubexposicion} onChange={() => handleCheck2('rbSubexposicion')} />
                                <label htmlFor="rbSubexposicion" className="ml-2">Subexposición</label>
                            </div>

                            <div className="flex items-center">
                                <input type="checkbox" name="rbArtefactos" id="rbArtefactos"
                                    checked={form.rbArtefactos} onChange={() => handleCheck2('rbArtefactos')} />
                                <label htmlFor="rbArtefactos" className="ml-2">Artefactos</label>
                            </div>

                            <div className="flex items-center">
                                <input type="checkbox" name="rbPosicioncentrado" id="rbPosicioncentrado"
                                    checked={form.rbPosicioncentrado} onChange={() => handleCheck2('rbPosicioncentrado')} />
                                <label htmlFor="rbPosicioncentrado" className="ml-2">Posición centrado</label>
                            </div>

                            <div className="flex items-center">
                                <input type="checkbox" name="rbOtros" id="rbOtros"
                                    checked={form.rbOtros} onChange={() => handleCheck2('rbOtros')} />
                                <label htmlFor="rbOtros" className="ml-2">Otros</label>
                            </div>

                            <div className="flex items-center col-span-2">
                                <input type="checkbox" name="rbInspiracionInsuficiente" id="rbInspiracionInsuficiente"
                                    checked={form.rbInspiracionInsuficiente} onChange={() => handleCheck2('rbInspiracionInsuficiente')} />
                                <label htmlFor="rbInspiracionInsuficiente" className="ml-2">Inspiración Insuficiente</label>
                            </div>
                        </div>
                        
                    </div>
                </div>
                <div className="flex items-center gap-4 py-3">
                    <label className="font-semibold max-w-[250px] min-w-[250px] ">Comentario sobre defectos técnicos: </label>
                    <input type="text" className="border rounded px-2 py-1 w-full" value={form.txtDefectosTecnicos} onChange={handleInputChange} name="txtDefectosTecnicos" id="txtDefectosTecnicos" />

                </div>
                <div className="flex  items-center gap-8">
                    <h2 className="font-bold text-[11px]">II. ANORMALIDADES PARENQUIMATOSAS (SI NO HAY ANORMALIDADES PASE A III. A. PLEURALES)</h2>
                    <div className="flex">
                        <input type="checkbox" name="chkParenradio" checked={form.anormalidades_parenquimatosas_si} onChange={() =>
                        setForm(prev => ({
                        ...prev,
                        anormalidades_parenquimatosas_si: true,
                        anormalidades_parenquimatosas_no: false,
                        }))} id="chk2Si" 
                        className="mr-2"/>
                        <label htmlFor="">SI</label>

                        <input type="checkbox" name="chkParenradio" checked={form.anormalidades_parenquimatosas_no} onChange={() =>
                            AnormalidadesNo(setForm)
                        } id="chk2No" 
                        className="mr-2 ml-4"/>
                        <label htmlFor="">NO</label>
                    </div>
                </div>
                <div className="grid mt-4 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {/*Cuadros */}
                    <div className="flex flex-col items-start border rounded p-3">
                        <p className="font-semibold">2.1. Zonas Afectadas</p>
                        <p className="mb-2 text-gray-600">(marque todas las zonas afectadas)</p>

                        <div className="grid grid-cols-3 gap-y-2 gap-x-4 pl-4 mx-auto mt-auto mb-3">
                            {/* Encabezados vacíos + Der + Izq */}
                            <div></div>
                            <span className="font-medium text-center">Der.</span>
                            <span className="font-medium text-center">Izq.</span>

                            {/* Fila Superior */}
                            <label className="">Superior</label>
                            <input disabled={form.anormalidades_parenquimatosas_no} type="checkbox" className="mx-auto" name="chk1D" id="chk1D" checked={form.chk1D} onChange={handleInputChangeChecked} />
                            <input disabled={form.anormalidades_parenquimatosas_no} type="checkbox" className="mx-auto" name="chk1I" id="chk1I" checked={form.chk1I} onChange={handleInputChangeChecked}/>

                            {/* Fila Medio */}
                            <label className="">Medio</label>
                            <input disabled={form.anormalidades_parenquimatosas_no} type="checkbox" className="mx-auto" name="chk2D" id="chk2D" checked={form.chk2D} onChange={handleInputChangeChecked}/>
                            <input disabled={form.anormalidades_parenquimatosas_no} type="checkbox" className="mx-auto" name="chk2I" id="chk2I" checked={form.chk2I} onChange={handleInputChangeChecked}/>

                            {/* Fila Inferior */}
                            <label className="">Inferior</label>
                            <input disabled={form.anormalidades_parenquimatosas_no} type="checkbox" className="mx-auto" name="chk3D" id="chk3D" checked={form.chk3D} onChange={handleInputChangeChecked}/>
                            <input disabled={form.anormalidades_parenquimatosas_no} type="checkbox" className="mx-auto" name="chk3I" id="chk3I" checked={form.chk3I} onChange={handleInputChangeChecked}/>
                        </div>
                    </div>

                    <div className="flex flex-col items-start border rounded p-3 ">
                        <div>
                        <p className="font-semibold">2.2. Profusión (opacidades pequeñas)</p>
                        <p className="text-gray-600">(escala de 12 puntos)</p>
                        <p className="mb-2 text-gray-600">(Consulte las radiografias estandar -marque la subcateforia de profusión)</p>
                        </div>
                        <div className="grid grid-cols-3 gap-y-2 gap-x-8 pl-4 mx-auto">

                            {/* Fila Superior */}
                            <div className="flex font-semibold"><input disabled={form.anormalidades_parenquimatosas_no} type="checkbox"  name="chk1" id="chk1" checked={form.chk1} onChange={handleInputChangeChecked}/> <p className="pl-2">0/-</p> </div>
                            <div className="flex font-semibold"><input disabled={form.anormalidades_parenquimatosas_no} type="checkbox"  name="chk5" id="chk5" checked={form.chk5} onChange={handleInputChangeChecked}/> <p className="pl-2">0/0</p> </div>
                            <div className="flex font-semibold"><input disabled={form.anormalidades_parenquimatosas_no} type="checkbox"  name="chk9" id="chk9" checked={form.chk9} onChange={handleInputChangeChecked}/> <p className="pl-2">0/1</p> </div>
                            {/* Fila Medio */}
                            <div className="flex font-semibold"><input disabled={form.anormalidades_parenquimatosas_no} type="checkbox"  name="chk2" id="chk2" checked={form.chk2} onChange={handleInputChangeChecked}/> <p className="pl-2">1/0</p> </div>
                            <div className="flex font-semibold"><input disabled={form.anormalidades_parenquimatosas_no} type="checkbox"  name="chk6" id="chk6" checked={form.chk6} onChange={handleInputChangeChecked}/> <p className="pl-2">1/1</p> </div>
                            <div className="flex font-semibold"><input disabled={form.anormalidades_parenquimatosas_no} type="checkbox"  name="chk10" id="chk10" checked={form.chk10} onChange={handleInputChangeChecked}/> <p className="pl-2">1/2</p> </div>

                            {/* Fila Inferior */}
                            <div className="flex font-semibold"><input disabled={form.anormalidades_parenquimatosas_no} type="checkbox"  name="chk3" id="chk3" checked={form.chk3} onChange={handleInputChangeChecked}/> <p className="pl-2">2/1</p> </div>
                            <div className="flex font-semibold"><input disabled={form.anormalidades_parenquimatosas_no} type="checkbox"  name="chk7" id="chk7" checked={form.chk7} onChange={handleInputChangeChecked}/> <p className="pl-2">2/2</p> </div>
                            <div className="flex font-semibold"><input disabled={form.anormalidades_parenquimatosas_no} type="checkbox"  name="chk11" id="chk11" checked={form.chk11} onChange={handleInputChangeChecked}/> <p className="pl-2">/3</p> </div>

                            <div className="flex font-semibold"><input disabled={form.anormalidades_parenquimatosas_no} type="checkbox"  name="chk4" id="chk4" checked={form.chk4} onChange={handleInputChangeChecked}/> <p className="pl-2">3/2</p> </div>
                            <div className="flex font-semibold"><input disabled={form.anormalidades_parenquimatosas_no} type="checkbox"  name="chk8" id="chk8" checked={form.chk8} onChange={handleInputChangeChecked}/> <p className="pl-2">3/3</p> </div>
                            <div className="flex font-semibold"><input disabled={form.anormalidades_parenquimatosas_no} type="checkbox"  name="chk12" id="chk12" checked={form.chk12} onChange={handleInputChangeChecked}/> <p className="pl-2">3/+</p> </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-start border rounded p-3">
                        <div>
                            <p className=" font-semibold">2.3. Forma y Tamaño:</p>
                            <p className=" mb-2 text-gray-600 max-w-[300px]">(Consulte las radiografias estandar; se requiere dos símbolos; marque un primario y un secundario)</p>
                        </div>
                        <div className="grid grid-cols-2 gap-x-14 mt-2 mb-1 pl-2 mx-auto">
                            <span className="text-center font-medium ">Primaria</span>
                            <span className="text-center font-medium ">Secundaria</span>
                        </div>

                        {/* Opciones */}
                        <div className="grid grid-cols-4 gap-y-2 gap-x-8 pl-2 mx-auto">
                            {/* Fila 1 */}
                            <label className="flex items-center space-x-1">
                            <input disabled={form.anormalidades_parenquimatosas_no} type="checkbox" name="chkP1" id="chkP1" checked={form.chkP1} onChange={handleInputChangeChecked}/> <span className="pl-2">P</span>
                            </label>
                            <label className="flex items-center space-x-1">
                            <input disabled={form.anormalidades_parenquimatosas_no} type="checkbox" name="chkP4" id="chkP4" checked={form.chkP4} onChange={handleInputChangeChecked}/> <span className="pl-2">q</span>
                            </label>
                            <label className="flex items-center space-x-1">
                            <input disabled={form.anormalidades_parenquimatosas_no} type="checkbox" name="chkS1" id="chkS1" checked={form.chkS1} onChange={handleInputChangeChecked}/> <span className="pl-2">p</span>
                            </label>
                            <label className="flex items-center space-x-1">
                            <input disabled={form.anormalidades_parenquimatosas_no} type="checkbox" name="chkS4" id="chkS4" checked={form.chkS4} onChange={handleInputChangeChecked}/> <span className="pl-2">s</span>
                            </label>

                            {/* Fila 2 */}
                            <label className="flex items-center space-x-1">
                            <input disabled={form.anormalidades_parenquimatosas_no} type="checkbox" name="chkP2" id="chkP2" checked={form.chkP2} onChange={handleInputChangeChecked}/> <span className="pl-2">q</span>
                            </label>
                            <label className="flex items-center space-x-1">
                            <input disabled={form.anormalidades_parenquimatosas_no} type="checkbox" name="chkP5" id="chkP5" checked={form.chkP5} onChange={handleInputChangeChecked}/> <span className="pl-2">t</span>
                            </label>
                            <label className="flex items-center space-x-1">
                            <input disabled={form.anormalidades_parenquimatosas_no} type="checkbox" name="chkS2" id="chkS2" checked={form.chkS2} onChange={handleInputChangeChecked}/> <span className="pl-2">q</span>
                            </label>
                            <label className="flex items-center space-x-1">
                            <input disabled={form.anormalidades_parenquimatosas_no} type="checkbox" name="chkS5" id="chkS5" checked={form.chkS5} onChange={handleInputChangeChecked}/> <span className="pl-2">t</span>
                            </label>

                            {/* Fila 3 */}
                            <label className="flex items-center space-x-1">
                            <input disabled={form.anormalidades_parenquimatosas_no} type="checkbox" name="chkP3" id="chkP3" checked={form.chkP3} onChange={handleInputChangeChecked}/> <span className="pl-2">r</span>
                            </label>
                            <label className="flex items-center space-x-1">
                            <input disabled={form.anormalidades_parenquimatosas_no} type="checkbox" name="chkP6" id="chkP6" checked={form.chkP6} onChange={handleInputChangeChecked}/> <span className="pl-2">u</span>
                            </label>
                            <label className="flex items-center space-x-1">
                            <input disabled={form.anormalidades_parenquimatosas_no} type="checkbox" name="chkS3" id="chkS3" checked={form.chkS3} onChange={handleInputChangeChecked}/> <span className="pl-2">r</span>
                            </label>
                            <label className="flex items-center space-x-1">
                            <input disabled={form.anormalidades_parenquimatosas_no} type="checkbox" name="chkS6" id="chkS6" checked={form.chkS6} onChange={handleInputChangeChecked}/> <span className="pl-2">u</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex flex-col items-start border rounded p-3 ">
                        <div>
                            <p className="font-semibold">2.4. Opacidades Grandes:</p>
                            <p className="mb-2 text-gray-600">(Marque O si no hay ninguna o marque A, B, o C)</p>
                        </div>
                        {/* Opciones */}
                        <div className="gap-y-2 gap-x-4 flex flex-col justify-center mt-4 mx-auto">
                            <div className="flex ">
                                <input disabled={form.anormalidades_parenquimatosas_no} type="checkbox" name="chko" id="chko" checked={form.chko} onChange={handleInputChangeChecked} /> 
                                <label htmlFor="" className="pl-2"> O</label>
                            </div>
                            <div className="flex ">
                                <input disabled={form.anormalidades_parenquimatosas_no} type="checkbox" name="chka" id="chka" checked={form.chka} onChange={handleInputChangeChecked} /> 
                                <label htmlFor="" className="pl-2"> A</label>
                            </div>
                            <div className="flex ">
                                <input disabled={form.anormalidades_parenquimatosas_no} type="checkbox" name="chkb" id="chkb" checked={form.chkb} onChange={handleInputChangeChecked} /> 
                                <label htmlFor="" className="pl-2"> B</label>
                            </div>
                            <div className="flex ">
                                <input disabled={form.anormalidades_parenquimatosas_no} type="checkbox" name="chkc" id="chkc" checked={form.chkc} onChange={handleInputChangeChecked} /> 
                                <label htmlFor="" className="pl-2"> C</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>    
        </>
    )
}

export default Parenquimatosas