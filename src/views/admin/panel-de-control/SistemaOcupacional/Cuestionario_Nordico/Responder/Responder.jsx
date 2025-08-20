const Responder = ({token, selectedSede, userlogued, form, setForm, handleChange, handleChangeNumber, handleClearnotO, handleInputChangeChecked}) => {
    
    const handleInputChangeCheckedGroup = (e, group) => {
        const { name } = e.target;
        setForm(prev => {
            const newForm = { ...prev };

            if (prev[name]) {
                // Si ya estaba activo, lo desmarcamos
                newForm[name] = false;
            } else {
                // Desmarcar todos los del grupo recibido
                group.forEach(code => newForm[code] = false);

                // Activar solo el seleccionado
                newForm[name] = true;
            }

            return newForm;
        });
    };
    
    return(
        <>
            <div className="flex w-full text-xl border rounded p-4 mt-6">
                <div className="flex flex-col">

                    <div className="flex w-full border rounded p-3 divide-x">
                        <div className="w-[45%] flex flex-col">
                            <h1 className="text-center font-bold mb-14">Para ser respondido por todos</h1>
                            <p className="p-3">Ha tenido Ud. Durante cualquier tiempo en los ultimos 12 meses problemas (molestias, dolor o disconfort) en:</p>
                        </div>
                        
                        <div className="w-[55%]">
                            <h1 className="font-bold text-center">Para ser respondido únicamente por quienes han tenido problemas</h1>
                            <div className="flex mt-6 justify-center items-center divide-x">
                                <div className="w-1/2 rounded p-3 divide-x">
                                    <p>Ha estado impedido en cualquier tiempo durante los pasados 12 meses para hacer sus rutinas habituales en el trabajo o su casa por este problema?</p>
                                </div>
                                <div className="w-1/2  p-3  divide-x">
                                    <p>Ud. Ha tenido problemas durante los ultimos 7 días?</p>
                                </div>
                            </div>
                        </div> 
                    </div>
                    {/*Cuello */}
                    <div className="flex w-full pt-4 border  p-3 divide-x">
                        <div className="w-[45%] flex flex-col">
                            <div className="flex justify-between">
                                <label htmlFor="">Cuello: </label>
                                <div className="flex">
                                    <label htmlFor="">No</label>
                                    <input checked={form.cuelloNo} onChange={(e) => {handleInputChangeCheckedGroup(e, ["cuelloNo","cuelloSi"])}} type="checkbox" name="cuelloNo" id="" className=" mx-3"/>
                                    <label htmlFor="" className="ml-4">Si</label>
                                    <input checked={form.cuelloSi} onChange={(e) => {handleInputChangeCheckedGroup(e, ["cuelloNo","cuelloSi"])}} type="checkbox" name="cuelloSi" id="" className=" mx-3"/>
                                </div>
                            </div>
                        </div>
                        
                       <div className="w-[55%] flex flex-col">
                            <div className="flex justify-center">
                                <div className="w-1/2 flex justify-center items-center">
                                    <label>No</label>
                                    <input disabled={form.cuelloNo} checked={form.pregunta1CuelloNo} onChange={(e) => {handleInputChangeCheckedGroup(e, ["pregunta1CuelloNo","pregunta1CuelloSi"])}} name="pregunta1CuelloNo" type="checkbox" className="mx-3" />
                                    <label className="ml-4">Si</label>
                                    <input disabled={form.cuelloNo} checked={form.pregunta1CuelloSi} onChange={(e) => {handleInputChangeCheckedGroup(e, ["pregunta1CuelloNo","pregunta1CuelloSi"])}} name="pregunta1CuelloSi" type="checkbox" className="mx-3" />
                                </div>
                                <div className="w-1/2 flex justify-center items-center">
                                    <label>No</label>
                                    <input disabled={form.cuelloNo} checked={form.pregunta2CuelloNo} onChange={(e) => {handleInputChangeCheckedGroup(e, ["pregunta2CuelloNo","pregunta2CuelloSi"])}} name="pregunta2CuelloNo" type="checkbox" className="mx-3" />
                                    <label className="ml-4">Si</label>
                                    <input disabled={form.cuelloNo} checked={form.pregunta2CuelloSi} onChange={(e) => {handleInputChangeCheckedGroup(e, ["pregunta2CuelloNo","pregunta2CuelloSi"])}} name="pregunta2CuelloSi" type="checkbox" className="mx-3" />
                                </div>
                            </div>
                        </div> 
                    </div>
                    {/*Hombros */}
                    <div className="flex w-full pt-4 items-center border  p-3 divide-x">
                        <div className="w-[45%] flex flex-col">
                            <div className="flex ">
                                <label htmlFor="" className="w-60">Hombros: </label>
                                <div className="flex flex-col">
                                    <div className="flex gap-1">
                                        <input checked={form.hombrosNo} onChange={(e) => {handleInputChangeCheckedGroup(e, ["hombrosNo","hombroDerechoSi","hombroIzquierdoSi","ambosHombrosSi"])}} name="hombrosNo" type="checkbox" id="" className=" mx-3"/>
                                        <label htmlFor="">No</label>
                                    </div>
                                    <div className="flex gap-1">
                                        <input checked={form.hombroDerechoSi} onChange={(e) => {handleInputChangeCheckedGroup(e, ["hombrosNo","hombroDerechoSi","hombroIzquierdoSi","ambosHombrosSi"])}} type="checkbox" name="hombroDerechoSi" id="" className=" mx-3"/>
                                        <label htmlFor="" className="">Si, en el hombro derecho</label>
                                    </div>
                                    <div className="flex gap-1">
                                        <input checked={form.hombroIzquierdoSi} onChange={(e) => {handleInputChangeCheckedGroup(e, ["hombrosNo","hombroDerechoSi","hombroIzquierdoSi","ambosHombrosSi"])}} type="checkbox" name="hombroIzquierdoSi" id="" className=" mx-3"/>
                                        <label htmlFor="" className="">Si, en el hombro izquierdo</label>
                                    </div>
                                    <div className="flex gap-1">
                                        <input checked={form.ambosHombrosSi} onChange={(e) => {handleInputChangeCheckedGroup(e, ["hombrosNo","hombroDerechoSi","hombroIzquierdoSi","ambosHombrosSi"])}} type="checkbox" name="ambosHombrosSi" id="" className=" mx-3"/>
                                        <label htmlFor="" className="">Si, en ambos hombros</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                       <div className="w-[55%] flex flex-col">
                            <div className="flex justify-center">
                                <div className="w-1/2 flex justify-center items-center">
                                    <label>No</label>
                                    <input disabled={form.hombrosNo} checked={form.pregunta1HombrosNo} onChange={(e) => {handleInputChangeCheckedGroup(e, ["pregunta1HombrosNo","pregunta1HombrosSi"])}} name="pregunta1HombrosNo" type="checkbox" className="mx-3" />
                                    <label className="ml-4">Si</label>
                                    <input disabled={form.hombrosNo} checked={form.pregunta1HombrosSi} onChange={(e) => {handleInputChangeCheckedGroup(e, ["pregunta1HombrosNo","pregunta1HombrosSi"])}} name="pregunta1HombrosSi" type="checkbox" className="mx-3" />
                                </div>
                                <div className="w-1/2 flex justify-center items-center">
                                    <label>No</label>
                                    <input disabled={form.hombrosNo} checked={form.pregunta2HombrosNo} onChange={(e) => {handleInputChangeCheckedGroup(e, ["pregunta2HombrosNo","pregunta2HombrosSi"])}} name="pregunta2HombrosNo" type="checkbox" className="mx-3" />
                                    <label className="ml-4">Si</label>
                                    <input disabled={form.hombrosNo} checked={form.pregunta2HombrosSi} onChange={(e) => {handleInputChangeCheckedGroup(e, ["pregunta2HombrosNo","pregunta2HombrosSi"])}} name="pregunta2HombrosSi" type="checkbox" className="mx-3" />
                                </div>
                            </div>
                        </div> 
                    </div>
                    {/*Codos */}
                    <div className="flex w-full pt-4 items-center border  p-3 divide-x">
                        <div className="w-[45%] flex flex-col">
                            <div className="flex ">
                                <label htmlFor="" className="w-60">Codos: </label>
                                <div className="flex flex-col">
                                    <div className="flex gap-1">
                                        <input checked={form.codosNo} onChange={(e) => {handleInputChangeCheckedGroup(e, ["codosNo","codoDerechoSi","codoIzquierdoNo","ambosCodosSi"])}} type="checkbox" name="codosNo" id="" className=" mx-3"/>
                                        <label htmlFor="">No</label>
                                    </div>
                                    <div className="flex gap-1">
                                        <input checked={form.codoDerechoSi} onChange={(e) => {handleInputChangeCheckedGroup(e, ["codosNo","codoDerechoSi","codoIzquierdoNo","ambosCodosSi"])}} type="checkbox" name="codoDerechoSi" id="" className=" mx-3"/>
                                        <label htmlFor="" className="">Si, en el codo derecho</label>
                                    </div>
                                    <div className="flex gap-1">
                                        <input checked={form.codoIzquierdoNo} onChange={(e) => {handleInputChangeCheckedGroup(e, ["codosNo","codoDerechoSi","codoIzquierdoNo","ambosCodosSi"])}} type="checkbox" name="codoIzquierdoNo" id="" className=" mx-3"/>
                                        <label htmlFor="" className="">Si, en el codo izquierdo</label>
                                    </div>
                                    <div className="flex gap-1">
                                        <input checked={form.ambosCodosSi} onChange={(e) => {handleInputChangeCheckedGroup(e, ["codosNo","codoDerechoSi","codoIzquierdoNo","ambosCodosSi"])}} type="checkbox" name="ambosCodosSi" id="" className=" mx-3"/>
                                        <label htmlFor="" className="">Si, en ambos codos</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                       <div className="w-[55%] flex flex-col">
                            <div className="flex justify-center">
                                <div className="w-1/2 flex justify-center items-center">
                                    <label>No</label>
                                    <input disabled={form.codosNo} checked={form.pregunta1CodosNo} onChange={(e) => {handleInputChangeCheckedGroup(e, ["pregunta1CodosNo","pregunta1CodosSi"])}} name="pregunta1CodosNo" type="checkbox" className="mx-3" />
                                    <label className="ml-4">Si</label>
                                    <input disabled={form.codosNo} checked={form.pregunta1CodosSi} onChange={(e) => {handleInputChangeCheckedGroup(e, ["pregunta1CodosNo","pregunta1CodosSi"])}} name="pregunta1CodosSi" type="checkbox" className="mx-3" />
                                </div>
                                <div className="w-1/2 flex justify-center items-center">
                                    <label>No</label>
                                    <input disabled={form.codosNo} checked={form.pregunta2CodosNo} onChange={(e) => {handleInputChangeCheckedGroup(e, ["pregunta2CodosNo","pregunta2CodosSi"])}} name="pregunta2CodosNo" type="checkbox" className="mx-3" />
                                    <label className="ml-4">Si</label>
                                    <input disabled={form.codosNo} checked={form.pregunta2CodosSi} onChange={(e) => {handleInputChangeCheckedGroup(e, ["pregunta2CodosNo","pregunta2CodosSi"])}} name="pregunta2CodosSi" type="checkbox" className="mx-3" />
                                </div>
                            </div>
                        </div> 
                    </div>
                    {/*Muñeca */}
                    <div className="flex w-full pt-4 items-center border  p-3 divide-x">
                        <div className="w-[45%] flex flex-col">
                            <div className="flex ">
                                <label htmlFor="" className="w-60">Muñeca: </label>
                                <div className="flex flex-col">
                                    <div className="flex gap-1">
                                        <input checked={form.munecaNo} onChange={(e) => {handleInputChangeCheckedGroup(e, ["munecaNo","munecaDerechaSi","munecaIzquierdaSi","ambasMunecasSi"])}}  type="checkbox" name="munecaNo" id="" className=" mx-3"/>
                                        <label htmlFor="">No</label>
                                    </div>
                                    <div className="flex gap-1">
                                        <input checked={form.munecaDerechaSi} onChange={(e) => {handleInputChangeCheckedGroup(e, ["munecaNo","munecaDerechaSi","munecaIzquierdaSi","ambasMunecasSi"])}} type="checkbox" name="munecaDerechaSi" id="" className=" mx-3"/>
                                        <label htmlFor="" className="">Si, en la muñeca/mano derecha</label>
                                    </div>
                                    <div className="flex gap-1">
                                        <input checked={form.munecaIzquierdaSi} onChange={(e) => {handleInputChangeCheckedGroup(e, ["munecaNo","munecaDerechaSi","munecaIzquierdaSi","ambasMunecasSi"])}} type="checkbox" name="munecaIzquierdaSi" id="" className=" mx-3"/>
                                        <label htmlFor="" className="">Si, en el muñeca/mano izquierda</label>
                                    </div>
                                    <div className="flex gap-1">
                                        <input checked={form.ambasMunecasSi} onChange={(e) => {handleInputChangeCheckedGroup(e, ["munecaNo","munecaDerechaSi","munecaIzquierdaSi","ambasMunecasSi"])}} type="checkbox" name="ambasMunecasSi" id="" className=" mx-3"/>
                                        <label htmlFor="" className="">Si, en ambos muñecas/manos</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                       <div className="w-[55%] flex flex-col">
                            <div className="flex justify-center">
                                <div className="w-1/2 flex justify-center items-center">
                                    <label>No</label>
                                    <input disabled={form.munecaNo} checked={form.pregunta1MunecasNo} onChange={(e) => {handleInputChangeCheckedGroup(e, ["pregunta1MunecasNo","pregunta1MunecasSi"])}} name="pregunta1MunecasNo" type="checkbox" className="mx-3" />
                                    <label className="ml-4">Si</label>
                                    <input disabled={form.munecaNo} checked={form.pregunta1MunecasSi} onChange={(e) => {handleInputChangeCheckedGroup(e, ["pregunta1MunecasNo","pregunta1MunecasSi"])}} name="pregunta1MunecasSi" type="checkbox" className="mx-3" />
                                </div>
                                <div className="w-1/2 flex justify-center items-center">
                                    <label>No</label>
                                    <input disabled={form.munecaNo} checked={form.pregunta2MunecasNo} onChange={(e) => {handleInputChangeCheckedGroup(e, ["pregunta2MunecasNo","pregunta2MunecasSi"])}} name="pregunta2MunecasNo" type="checkbox" className="mx-3" />
                                    <label className="ml-4">Si</label>
                                    <input disabled={form.munecaNo} checked={form.pregunta2MunecasSi} onChange={(e) => {handleInputChangeCheckedGroup(e, ["pregunta2MunecasNo","pregunta2MunecasSi"])}} name="pregunta2MunecasSi" type="checkbox" className="mx-3" />
                                </div>
                            </div>
                        </div> 
                    </div>
                    {/*Otros */}
                    <div className="flex w-full pt-4 items-center border  p-3 divide-x">
                        <div className="w-[45%] flex flex-col">
                            <div className="flex items-center">
                                <label htmlFor="" className="w-[60%] py-2">Espalda Alta (Tórax): </label>
                                <label htmlFor="">No</label>
                                <input checked={form.espaldaAltaToraxNo} onChange={(e) => {handleInputChangeCheckedGroup(e, ["espaldaAltaToraxNo","espaldaAltaToraxSi"])}} type="checkbox" name="espaldaAltaToraxNo" id="" className=" mx-3"/>
                                <label htmlFor="">Si</label>
                                <input checked={form.espaldaAltaToraxSi} onChange={(e) => {handleInputChangeCheckedGroup(e, ["espaldaAltaToraxNo","espaldaAltaToraxSi"])}} type="checkbox" name="espaldaAltaToraxSi" id="" className=" mx-3"/>
                            </div>
                            <div className="flex items-center">
                                <label htmlFor="" className="w-[60%] py-2">Espalda Baja (Région Lumbar): </label>
                                <label htmlFor="">No</label>
                                <input checked={form.espaldaBajaLumbarNo} onChange={(e) => {handleInputChangeCheckedGroup(e, ["espaldaBajaLumbarNo","espaldaBajaLumbarSi"])}} type="checkbox" name="espaldaBajaLumbarNo" id="" className=" mx-3"/>
                                <label htmlFor="">Si</label>
                                <input checked={form.espaldaBajaLumbarSi} onChange={(e) => {handleInputChangeCheckedGroup(e, ["espaldaBajaLumbarNo","espaldaBajaLumbarSi"])}} type="checkbox" name="espaldaBajaLumbarSi" id="" className=" mx-3"/>
                            </div>
                            <div className="flex items-center">
                                <label htmlFor="" className="w-[60%] py-2">Una o ambas caderas/muslos: </label>
                                <label htmlFor="">No</label>
                                <input checked={form.caderasOMuslosNo} onChange={(e) => {handleInputChangeCheckedGroup(e, ["caderasOMuslosNo","caderasOMuslosSi"])}} type="checkbox" name="caderasOMuslosNo" id="" className=" mx-3"/>
                                <label htmlFor="">Si</label>
                                <input checked={form.caderasOMuslosSi} onChange={(e) => {handleInputChangeCheckedGroup(e, ["caderasOMuslosNo","caderasOMuslosSi"])}} type="checkbox" name="caderasOMuslosSi" id="" className=" mx-3"/>
                            </div>
                            <div className="flex items-center">
                                <label htmlFor="" className="w-[60%] py-2">Una o ambas rodillas: </label>
                                <label htmlFor="">No</label>
                                <input checked={form.rodillasNo} onChange={(e) => {handleInputChangeCheckedGroup(e, ["rodillasNo","rodillasSi"])}} type="checkbox" name="rodillasNo" id="" className=" mx-3"/>
                                <label htmlFor="">Si</label>
                                <input checked={form.rodillasSi} onChange={(e) => {handleInputChangeCheckedGroup(e, ["rodillasNo","rodillasSi"])}} type="checkbox" name="rodillasSi" id="" className=" mx-3"/>
                            </div>
                            <div className="flex items-center">
                                <label htmlFor="" className="w-[60%] py-2">Uno o ambos tobillos/Pies: </label>
                                <label htmlFor="">No</label>
                                <input checked={form.tobillosOPiesNo} onChange={(e) => {handleInputChangeCheckedGroup(e, ["tobillosOPiesNo","tobillosOPiesSi"])}} type="checkbox" name="tobillosOPiesNo" id="" className=" mx-3"/>
                                <label htmlFor="">Si</label>
                                <input checked={form.tobillosOPiesSi} onChange={(e) => {handleInputChangeCheckedGroup(e, ["tobillosOPiesNo","tobillosOPiesSi"])}} type="checkbox" name="tobillosOPiesSi" id="" className=" mx-3"/>
                            </div>
                        </div>
                        
                       <div className="w-[55%] flex flex-col">
                            {/*Espalda Alta*/}
                            <div className="flex justify-center py-2">
                                <div className="w-1/2 flex justify-center items-center">
                                    <label>No</label>
                                    <input disabled={form.espaldaAltaToraxNo} checked={form.pregunta1EspaldaAltaToraxNo} onChange={(e) => {handleInputChangeCheckedGroup(e, ["pregunta1EspaldaAltaToraxNo","pregunta1EspaldaAltaToraxSi"])}} name="pregunta1EspaldaAltaToraxNo" type="checkbox" className="mx-3" />
                                    <label className="ml-4">Si</label>
                                    <input disabled={form.espaldaAltaToraxNo} checked={form.pregunta1EspaldaAltaToraxSi} onChange={(e) => {handleInputChangeCheckedGroup(e, ["pregunta1EspaldaAltaToraxNo","pregunta1EspaldaAltaToraxSi"])}} name="pregunta1EspaldaAltaToraxSi" type="checkbox" className="mx-3" />
                                </div>
                                <div className="w-1/2 flex justify-center items-center">
                                    <label>No</label>
                                    <input disabled={form.espaldaAltaToraxNo} checked={form.pregunta2EspaldaAltaToraxNo} onChange={(e) => {handleInputChangeCheckedGroup(e, ["pregunta2EspaldaAltaToraxNo","pregunta2EspaldaAltaToraxSi"])}} name="pregunta2EspaldaAltaToraxNo" type="checkbox" className="mx-3" />
                                    <label className="ml-4">Si</label>
                                    <input disabled={form.espaldaAltaToraxNo} checked={form.pregunta2EspaldaAltaToraxSi} onChange={(e) => {handleInputChangeCheckedGroup(e, ["pregunta2EspaldaAltaToraxNo","pregunta2EspaldaAltaToraxSi"])}} name="pregunta2EspaldaAltaToraxSi" type="checkbox" className="mx-3" />
                                </div>
                            </div>
                            {/*Espalda Baja*/}
                            <div className="flex justify-center py-2">
                                <div className="w-1/2 flex justify-center items-center">
                                    <label>No</label>
                                    <input disabled={form.espaldaBajaLumbarNo} checked={form.pregunta1EspaldaBajaLumbarNo} onChange={(e) => {handleInputChangeCheckedGroup(e, ["pregunta1EspaldaBajaLumbarNo","pregunta1EspaldaBajaLumbarSi"])}} name="pregunta1EspaldaBajaLumbarNo" type="checkbox" className="mx-3" />
                                    <label className="ml-4">Si</label>
                                    <input disabled={form.espaldaBajaLumbarNo} checked={form.pregunta1EspaldaBajaLumbarSi} onChange={(e) => {handleInputChangeCheckedGroup(e, ["pregunta1EspaldaBajaLumbarNo","pregunta1EspaldaBajaLumbarSi"])}} name="pregunta1EspaldaBajaLumbarSi" type="checkbox" className="mx-3" />
                                </div>
                                <div className="w-1/2 flex justify-center items-center">
                                    <label>No</label>
                                    <input disabled={form.espaldaBajaLumbarNo} checked={form.pregunta2EspaldaBajaLumbarNo} onChange={(e) => {handleInputChangeCheckedGroup(e, ["pregunta2EspaldaBajaLumbarNo","pregunta2EspaldaBajaLumbarSi"])}} name="pregunta2EspaldaBajaLumbarNo" type="checkbox" className="mx-3" />
                                    <label className="ml-4">Si</label>
                                    <input disabled={form.espaldaBajaLumbarNo} checked={form.pregunta2EspaldaBajaLumbarSi} onChange={(e) => {handleInputChangeCheckedGroup(e, ["pregunta2EspaldaBajaLumbarNo","pregunta2EspaldaBajaLumbarSi"])}} name="pregunta2EspaldaBajaLumbarSi" type="checkbox" className="mx-3" />
                                </div>
                            </div>
                            {/*Caderas*/}    
                            <div className="flex justify-center py-2">
                                <div className="w-1/2 flex justify-center items-center">
                                    <label>No</label>
                                    <input disabled={form.caderasOMuslosNo} checked={form.pregunta1CaderasOMuslosNo} onChange={(e) => {handleInputChangeCheckedGroup(e, ["pregunta1CaderasOMuslosNo","pregunta1CaderasOMuslosSi"])}} name="pregunta1CaderasOMuslosNo" type="checkbox" className="mx-3" />
                                    <label className="ml-4">Si</label>
                                    <input disabled={form.caderasOMuslosNo} checked={form.pregunta1CaderasOMuslosSi} onChange={(e) => {handleInputChangeCheckedGroup(e, ["pregunta1CaderasOMuslosNo","pregunta1CaderasOMuslosSi"])}} name="pregunta1CaderasOMuslosSi" type="checkbox" className="mx-3" />
                                </div>
                                <div className="w-1/2 flex justify-center items-center">
                                    <label>No</label>
                                    <input disabled={form.caderasOMuslosNo} checked={form.pregunta2CaderasOMuslosNo} onChange={(e) => {handleInputChangeCheckedGroup(e, ["pregunta2CaderasOMuslosNo","pregunta2CaderasOMuslosSi"])}} name="pregunta2CaderasOMuslosNo" type="checkbox" className="mx-3" />
                                    <label className="ml-4">Si</label>
                                    <input disabled={form.caderasOMuslosNo} checked={form.pregunta2CaderasOMuslosSi} onChange={(e) => {handleInputChangeCheckedGroup(e, ["pregunta2CaderasOMuslosNo","pregunta2CaderasOMuslosSi"])}} name="pregunta2CaderasOMuslosSi" type="checkbox" className="mx-3" />
                                </div>
                            </div>
                            {/*Rodillas*/}  
                            <div className="flex justify-center py-2">
                                <div className="w-1/2 flex justify-center items-center">
                                    <label>No</label>
                                    <input disabled={form.rodillasNo} checked={form.pregunta1RodillasNo} onChange={(e) => {handleInputChangeCheckedGroup(e, ["pregunta1RodillasNo","pregunta1RodillasSi"])}} name="pregunta1RodillasNo" type="checkbox" className="mx-3" />
                                    <label className="ml-4">Si</label>
                                    <input disabled={form.rodillasNo} checked={form.pregunta1RodillasSi} onChange={(e) => {handleInputChangeCheckedGroup(e, ["pregunta1RodillasNo","pregunta1RodillasSi"])}} name="pregunta1RodillasSi" type="checkbox" className="mx-3" />
                                </div>
                                <div className="w-1/2 flex justify-center items-center">
                                    <label>No</label>
                                    <input disabled={form.rodillasNo} checked={form.pregunta2RodillasNo} onChange={(e) => {handleInputChangeCheckedGroup(e, ["pregunta2RodillasNo","pregunta2RodillasSi"])}} name="pregunta2RodillasNo" type="checkbox" className="mx-3" />
                                    <label className="ml-4">Si</label>
                                    <input disabled={form.rodillasNo} checked={form.pregunta2RodillasSi} onChange={(e) => {handleInputChangeCheckedGroup(e, ["pregunta2RodillasNo","pregunta2RodillasSi"])}} name="pregunta2RodillasSi" type="checkbox" className="mx-3" />
                                </div>
                            </div>
                            {/*Tobillos*/}  
                            <div className="flex justify-center py-2">
                                <div className="w-1/2 flex justify-center items-center">
                                    <label>No</label>
                                    <input disabled={form.tobillosOPiesNo} checked={form.pregunta1TobillosOPiesNo} onChange={(e) => {handleInputChangeCheckedGroup(e, ["pregunta1TobillosOPiesNo","pregunta1TobillosOPiesSi"])}} name="pregunta1TobillosOPiesNo" type="checkbox" className="mx-3" />
                                    <label className="ml-4">Si</label>
                                    <input disabled={form.tobillosOPiesNo} checked={form.pregunta1TobillosOPiesSi} onChange={(e) => {handleInputChangeCheckedGroup(e, ["pregunta1TobillosOPiesNo","pregunta1TobillosOPiesSi"])}} name="pregunta1TobillosOPiesSi" type="checkbox" className="mx-3" />
                                </div>
                                <div className="w-1/2 flex justify-center items-center">
                                    <label>No</label>
                                    <input disabled={form.tobillosOPiesNo} checked={form.pregunta2TobillosOPiesNo} onChange={(e) => {handleInputChangeCheckedGroup(e, ["pregunta2TobillosOPiesNo","pregunta2TobillosOPiesSi"])}} name="pregunta2TobillosOPiesNo" type="checkbox" className="mx-3" />
                                    <label className="ml-4">Si</label>
                                    <input disabled={form.tobillosOPiesNo} checked={form.pregunta2TobillosOPiesSi} onChange={(e) => {handleInputChangeCheckedGroup(e, ["pregunta2TobillosOPiesNo","pregunta2TobillosOPiesSi"])}} name="pregunta2TobillosOPiesSi" type="checkbox" className="mx-3" />
                                </div>
                            </div>
                        </div> 
                    </div>
                </div>
                
                
            </div>
        </>
    )
}

export default Responder