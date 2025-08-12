const Responder = () => {
    return(
        <>
            <div className="flex w-full text-xl">
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
                                    <input type="checkbox" name="" id="" className=" mx-3"/>
                                    <label htmlFor="" className="ml-4">Si</label>
                                    <input type="checkbox" name="" id="" className=" mx-3"/>
                                </div>
                            </div>
                        </div>
                        
                       <div className="w-[55%] flex flex-col">
                            <div className="flex justify-center">
                                <div className="w-1/2 flex justify-center items-center">
                                    <label>No</label>
                                    <input type="checkbox" className="mx-3" />
                                    <label className="ml-4">Si</label>
                                    <input type="checkbox" className="mx-3" />
                                </div>
                                <div className="w-1/2 flex justify-center items-center">
                                    <label>No</label>
                                    <input type="checkbox" className="mx-3" />
                                    <label className="ml-4">Si</label>
                                    <input type="checkbox" className="mx-3" />
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
                                        <input type="checkbox" name="" id="" className=" mx-3"/>
                                        <label htmlFor="">No</label>
                                    </div>
                                    <div className="flex gap-1">
                                        <input type="checkbox" name="" id="" className=" mx-3"/>
                                        <label htmlFor="" className="">Si, en el hombro derecho</label>
                                    </div>
                                    <div className="flex gap-1">
                                        <input type="checkbox" name="" id="" className=" mx-3"/>
                                        <label htmlFor="" className="">Si, en el hombro izquierdo</label>
                                    </div>
                                    <div className="flex gap-1">
                                        <input type="checkbox" name="" id="" className=" mx-3"/>
                                        <label htmlFor="" className="">Si, en ambos hombros</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                       <div className="w-[55%] flex flex-col">
                            <div className="flex justify-center">
                                <div className="w-1/2 flex justify-center items-center">
                                    <label>No</label>
                                    <input type="checkbox" className="mx-3" />
                                    <label className="ml-4">Si</label>
                                    <input type="checkbox" className="mx-3" />
                                </div>
                                <div className="w-1/2 flex justify-center items-center">
                                    <label>No</label>
                                    <input type="checkbox" className="mx-3" />
                                    <label className="ml-4">Si</label>
                                    <input type="checkbox" className="mx-3" />
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
                                        <input type="checkbox" name="" id="" className=" mx-3"/>
                                        <label htmlFor="">No</label>
                                    </div>
                                    <div className="flex gap-1">
                                        <input type="checkbox" name="" id="" className=" mx-3"/>
                                        <label htmlFor="" className="">Si, en el codo derecho</label>
                                    </div>
                                    <div className="flex gap-1">
                                        <input type="checkbox" name="" id="" className=" mx-3"/>
                                        <label htmlFor="" className="">Si, en el codo izquierdo</label>
                                    </div>
                                    <div className="flex gap-1">
                                        <input type="checkbox" name="" id="" className=" mx-3"/>
                                        <label htmlFor="" className="">Si, en ambos codos</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                       <div className="w-[55%] flex flex-col">
                            <div className="flex justify-center">
                                <div className="w-1/2 flex justify-center items-center">
                                    <label>No</label>
                                    <input type="checkbox" className="mx-3" />
                                    <label className="ml-4">Si</label>
                                    <input type="checkbox" className="mx-3" />
                                </div>
                                <div className="w-1/2 flex justify-center items-center">
                                    <label>No</label>
                                    <input type="checkbox" className="mx-3" />
                                    <label className="ml-4">Si</label>
                                    <input type="checkbox" className="mx-3" />
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
                                        <input type="checkbox" name="" id="" className=" mx-3"/>
                                        <label htmlFor="">No</label>
                                    </div>
                                    <div className="flex gap-1">
                                        <input type="checkbox" name="" id="" className=" mx-3"/>
                                        <label htmlFor="" className="">Si, en la muñeca/mano derecha</label>
                                    </div>
                                    <div className="flex gap-1">
                                        <input type="checkbox" name="" id="" className=" mx-3"/>
                                        <label htmlFor="" className="">Si, en el muñeca/mano izquierda</label>
                                    </div>
                                    <div className="flex gap-1">
                                        <input type="checkbox" name="" id="" className=" mx-3"/>
                                        <label htmlFor="" className="">Si, en ambos muñecas/manos</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                       <div className="w-[55%] flex flex-col">
                            <div className="flex justify-center">
                                <div className="w-1/2 flex justify-center items-center">
                                    <label>No</label>
                                    <input type="checkbox" className="mx-3" />
                                    <label className="ml-4">Si</label>
                                    <input type="checkbox" className="mx-3" />
                                </div>
                                <div className="w-1/2 flex justify-center items-center">
                                    <label>No</label>
                                    <input type="checkbox" className="mx-3" />
                                    <label className="ml-4">Si</label>
                                    <input type="checkbox" className="mx-3" />
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
                                <input type="checkbox" name="" id="" className=" mx-3"/>
                                <label htmlFor="">Si</label>
                                <input type="checkbox" name="" id="" className=" mx-3"/>
                            </div>
                            <div className="flex items-center">
                                <label htmlFor="" className="w-[60%] py-2">Espalda Baja (Région Lumbar): </label>
                                <label htmlFor="">No</label>
                                <input type="checkbox" name="" id="" className=" mx-3"/>
                                <label htmlFor="">Si</label>
                                <input type="checkbox" name="" id="" className=" mx-3"/>
                            </div>
                            <div className="flex items-center">
                                <label htmlFor="" className="w-[60%] py-2">Una o ambas caderas/muslos: </label>
                                <label htmlFor="">No</label>
                                <input type="checkbox" name="" id="" className=" mx-3"/>
                                <label htmlFor="">Si</label>
                                <input type="checkbox" name="" id="" className=" mx-3"/>
                            </div>
                            <div className="flex items-center">
                                <label htmlFor="" className="w-[60%] py-2">Una o ambas rodillas: </label>
                                <label htmlFor="">No</label>
                                <input type="checkbox" name="" id="" className=" mx-3"/>
                                <label htmlFor="">Si</label>
                                <input type="checkbox" name="" id="" className=" mx-3"/>
                            </div>
                            <div className="flex items-center">
                                <label htmlFor="" className="w-[60%] py-2">Uno o ambos tobillos/Pies: </label>
                                <label htmlFor="">No</label>
                                <input type="checkbox" name="" id="" className=" mx-3"/>
                                <label htmlFor="">Si</label>
                                <input type="checkbox" name="" id="" className=" mx-3"/>
                            </div>
                        </div>
                        
                       <div className="w-[55%] flex flex-col">
                            <div className="flex justify-center py-2">
                                <div className="w-1/2 flex justify-center items-center">
                                    <label>No</label>
                                    <input type="checkbox" className="mx-3" />
                                    <label className="ml-4">Si</label>
                                    <input type="checkbox" className="mx-3" />
                                </div>
                                <div className="w-1/2 flex justify-center items-center">
                                    <label>No</label>
                                    <input type="checkbox" className="mx-3" />
                                    <label className="ml-4">Si</label>
                                    <input type="checkbox" className="mx-3" />
                                </div>
                            </div>
                            <div className="flex justify-center py-2">
                                <div className="w-1/2 flex justify-center items-center">
                                    <label>No</label>
                                    <input type="checkbox" className="mx-3" />
                                    <label className="ml-4">Si</label>
                                    <input type="checkbox" className="mx-3" />
                                </div>
                                <div className="w-1/2 flex justify-center items-center">
                                    <label>No</label>
                                    <input type="checkbox" className="mx-3" />
                                    <label className="ml-4">Si</label>
                                    <input type="checkbox" className="mx-3" />
                                </div>
                            </div>
                            <div className="flex justify-center py-2">
                                <div className="w-1/2 flex justify-center items-center">
                                    <label>No</label>
                                    <input type="checkbox" className="mx-3" />
                                    <label className="ml-4">Si</label>
                                    <input type="checkbox" className="mx-3" />
                                </div>
                                <div className="w-1/2 flex justify-center items-center">
                                    <label>No</label>
                                    <input type="checkbox" className="mx-3" />
                                    <label className="ml-4">Si</label>
                                    <input type="checkbox" className="mx-3" />
                                </div>
                            </div>
                            <div className="flex justify-center py-2">
                                <div className="w-1/2 flex justify-center items-center">
                                    <label>No</label>
                                    <input type="checkbox" className="mx-3" />
                                    <label className="ml-4">Si</label>
                                    <input type="checkbox" className="mx-3" />
                                </div>
                                <div className="w-1/2 flex justify-center items-center">
                                    <label>No</label>
                                    <input type="checkbox" className="mx-3" />
                                    <label className="ml-4">Si</label>
                                    <input type="checkbox" className="mx-3" />
                                </div>
                            </div>
                            <div className="flex justify-center py-2">
                                <div className="w-1/2 flex justify-center items-center">
                                    <label>No</label>
                                    <input type="checkbox" className="mx-3" />
                                    <label className="ml-4">Si</label>
                                    <input type="checkbox" className="mx-3" />
                                </div>
                                <div className="w-1/2 flex justify-center items-center">
                                    <label>No</label>
                                    <input type="checkbox" className="mx-3" />
                                    <label className="ml-4">Si</label>
                                    <input type="checkbox" className="mx-3" />
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