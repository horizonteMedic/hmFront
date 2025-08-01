const Engrosamiento = () => {
    return(
        <>
            <div className="w-auto">
                <div className="flex justify-between items-center">
                    <h2 className="font-bold">3.2 ENGROSAMIENTO DIFUSO DE LA PLEURA (0 = NINGUNA, D = HEMITÓRAX DERECHO, I = HEMITÓRAX IZQUIERDO)</h2>
                    
                </div>
                <div className="flex flex-row w-auto mt-2 gap-2 p-4">
                    {/*Cuadros */}
                    <div className="border rounded-md flex p-4 ">

                        <div className="flex flex-col">
                            {/* Encabezado O D I */}
                            <div className="flex flex-row justify-center items-center gap-2 mb-1 ml-[40%]">
                                <span className="text-base font-bold text-center">Pared Torácica</span>
                            </div>

                            {/* Filas con checkboxes */}
                            {["De Perfil", "De Frente"].map((label, idx) => (
                            <div key={idx} className="flex flex-row items-center gap-2 mb-1">
                                <span className="w-[40%] text-lg">{label}</span>

                                {/* Checkboxes sin letras al costado */}
                                <div className="w-[25px] flex justify-center">
                                <input type="checkbox" /> <span className="ml-1">O</span>
                                </div>
                                <div className="w-[25px] flex justify-center">
                                <input type="checkbox" /> <span className="ml-1">D</span>
                                </div>
                                <div className="w-[25px] flex justify-center">
                                <input type="checkbox" /> <span className="ml-1">I</span>
                                </div>
                            </div>
                            ))}
                        </div>
                        <div className="flex flex-col ml-6">
                            {/* Encabezado O D I */}
                            <div className="flex flex-row justify-center items-center gap-2 mb-1 ml-[20%]">
                                <span className="text-base font-bold text-center">Calcificación</span>
                            </div>

                            {/* Filas con checkboxes */}
                            {["", ""].map((label, idx) => (
                            <div key={idx} className="flex flex-row items-center gap-2 mb-1">
                                <span className="w-[30%] text-sm">{label}</span>

                                {/* Checkboxes sin letras al costado */}
                                <div className="w-[25px] flex justify-center">
                                <input type="checkbox" /> <span className="ml-1">O</span>
                                </div>
                                <div className="w-[25px] flex justify-center">
                                <input type="checkbox" /> <span className="ml-1">D</span>
                                </div>
                                <div className="w-[25px] flex justify-center">
                                <input type="checkbox" /> <span className="ml-1">I</span>
                                </div>
                            </div>
                            ))}
                        </div>
                    </div>

                   
                    <div className="flex gap-6 pt-4 ml-[15%]">
                        {/* Grupo 1 */}
                        <div className="flex flex-col items-center">
                            <span>Extensión</span>
                            <div className="flex gap-10">
                                <div className="flex flex-col items-center gap-1">
                                    <div className="flex gap-2 ">
                                    {["O", "D"].map((letter, idx) => (
                                        <label key={idx} className="flex flex-row items-center w-[25px]">
                                        <input type="checkbox" />
                                        <span className="text-lg ml-1 font-normal">{letter}</span>
                                        </label>
                                    ))}
                                    </div>
                                    <div className="flex gap-2">
                                    {["1", "2", "3"].map((label, idx) => (
                                        <label key={idx} className="flex items-center w-[25px]">
                                        <input type="checkbox" />
                                        <span className="text-lg ml-1 font-normal">{label}</span>
                                        </label>
                                    ))}
                                    </div>
                                </div>
                                <div className="flex flex-col items-center gap-1">
                                    <div className="flex gap-2">
                                    {["O", "I"].map((letter, idx) => (
                                        <label key={idx} className="flex  items-center w-[25px]">
                                        <input type="checkbox" />
                                        <span className="text-lg ml-1 font-normal">{letter}</span>
                                        </label>
                                    ))}
                                    </div>
                                    <div className="flex gap-2">
                                    {["1", "2", "3"].map((label, idx) => (
                                        <label key={idx} className="flex  items-center w-[25px]">
                                        <input type="checkbox" />
                                        <span className="text-lg ml-1 font-normal">{label}</span>
                                        </label>
                                    ))}
                                    </div>
                                </div>
                            </div>      
                        </div>
                        {/* Grupo 2 */}
                        <div className="flex flex-col items-center">
                            <span>Ancho</span>
                            <div className="flex gap-10">
                                <div className="flex flex-col items-center gap-1">
                                    <div className="flex gap-2">
                                        {["D"].map((letter, idx) => (
                                            <label key={idx} className="flex flex-row items-center w-[25px]">
                                            <input type="checkbox" />
                                            <span className="text-lg ml-1 font-normal">{letter}</span>
                                            </label>
                                        ))}
                                        </div>
                                        <div className="flex gap-2">
                                        {["A", "B", "C"].map((label, idx) => (
                                            <label key={idx} className="flex items-center w-[25px]">
                                            <input type="checkbox" />
                                            <span className="text-lg ml-1 font-normal">{label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex flex-col items-center gap-1">
                                    <div className="flex gap-2">
                                    {["I"].map((letter, idx) => (
                                        <label key={idx} className="flex flex-row items-center w-[25px]">
                                        <input type="checkbox" />
                                        <span className="text-lg ml-1 font-normal">{letter}</span>
                                        </label>
                                    ))}
                                    </div>
                                    <div className="flex gap-2">
                                    {["A", "B", "C"].map((label, idx) => (
                                        <label key={idx} className="flex items-center w-[25px]">
                                        <input type="checkbox" />
                                        <span className="text-lg ml-1 font-normal">{label}</span>
                                        </label>
                                    ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <h2 className="font-bold">IV. SIMBOLOS*</h2>
                    <div className="flex">
                        <input type="checkbox" name="" id="" />
                        <label htmlFor="">SI</label>

                        <input type="checkbox" name="" id="" />
                        <label htmlFor="">NO</label>
                    </div>
                </div>
                <p>(Rodee con un circulo la respuesta adecuada; si rodea od, escriba a continuación un COMENTARIO)</p>
                <div className="my-4">
                                    aqui van los checkbox
                </div>
                <div className="flex w-full p-2 mx-2 gap-1 justify-center items-start">
                    <label htmlFor="">COMENTARIOS</label>
                    <div className="flex flex-col w-full">
                        <input type="text" className="w-full border rounded px-2 py-1 mx-4" />
                        <div className="flex justify-start items-center px-2 py-1 mx-4 mt-2 gap-2">
                            <input type="checkbox" name="" id="" />
                            <label htmlFor="">TRAMA BRONCOVASCULAR ACENTUADA EN ACP</label>
                            <input type="checkbox" name="" className="ml-8" id="" />
                            <label htmlFor="">EVALUACION ANUAL</label>
                        </div>
                    </div>
                    
                </div>
                <div className="w-full h-[1px] bg-gray-300 my-4" />
                <div className="flex p-2 gap-1 items-center">
                    <label htmlFor="">Medico: </label>
                    <input type="text" className="border rounded px-2 py-1 mx-4 w-[22%]" />
                </div>
            </div>   
        </>
    )
}

export default Engrosamiento