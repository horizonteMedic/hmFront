const Hombros = () => {
    return(
        <>
            <div className="flex w-full text-xl">
                <div className="flex flex-col w-full">
                    <div className="flex">
                        <div className="flex flex-col w-[80%]">
                        <h1 className="font-bold mb-8 mt-4 text-2xl">4.- Problemas con los Hombros</h1>
                        <h2 className="font-bold text-center text-2xl mb-4">¿Cómo responder el cuestionario?</h2>
                        <p>Problemas de los hombros significa molestias, dolor o disconforten el área indicada. Por favor concéntrese en éste área ignorando cualquier problema que usted pueda haber tenido en partes adyacente a ésta. Existe un cuestionario separado para cuello. Por favor, responda poniendo una x en el respectivo recuadro para cada pregunta.</p>
                    </div>
                    <div className="flex flex-col w-[20%]">
                        <img src="img/Nordico/hombros.png" alt="" />
                    </div>
                    </div>
                    <div className="flex justify-between mt-5">
                        <label className=" font-normal" htmlFor="">9.- Ud. ha tenido problema de hombros (molestias, dolor o disconfort) ?</label>
                        <div className="flex justify-center items-center mr-10">
                            <label htmlFor="">No</label>
                            <input type="checkbox" name="" id="" className=" mx-3"/>
                            <label htmlFor="">Si</label>
                            <input type="checkbox" name="" id="" className=" mx-3"/>
                        </div>
                    </div>
                    <div className="flex justify-between my-2">
                        <label className="font-bold" htmlFor="">Si Ud. respondió NO a la pregunta 9, no responda las preguntas de la 10 a 17</label>
                    </div>
                    <div className="flex flex-col justify-between my-2">
                        <label className=" font-normal" htmlFor="">10.- Ud. ha tenido lesiones en sus hombros en un accidente?</label>
                        <div className="flex items-center mr-10 my-1 ml-20">
                            <input type="checkbox" name="" id="" className=" mx-3"/>
                            <label className=" font-normal w-[20%]"  htmlFor="">1 No</label>
                            <input type="checkbox" name="" id="" className=" mx-3"/>
                            <label className=" font-normal w-[20%]"  htmlFor="">3 Si, en mi hombro izquierdo</label>
                        </div>
                        <div className="flex items-center mr-10 my-1 ml-20">
                            <input type="checkbox" name="" id="" className=" mx-3"/>
                            <label className=" font-normal w-[20%]"  htmlFor="">2 SI, en mi hombro derecho</label>
                            <input type="checkbox" name="" id="" className=" mx-3"/>
                            <label className=" font-normal w-[20%]"  htmlFor="">3 Si, en ambos hombros</label>
                        </div>
                    </div>
                    <div className="flex justify-between my-2">
                        <label className=" font-normal" htmlFor="">11.- Ud. ha tenido un cambio de trabajo o actividad por problemas de hombros?</label>
                        <div className="flex justify-center items-center mr-10">
                            <label htmlFor="">No</label>
                            <input type="checkbox" name="" id="" className=" mx-3"/>
                            <label htmlFor="">Si</label>
                            <input type="checkbox" name="" id="" className=" mx-3"/>
                        </div>
                    </div>
                    <div className="flex flex-col justify-between my-2">
                        <label className=" font-normal" htmlFor="">12.- Ud. ha tenido problemas en los hombros durante los ultimos 12 meses? <span className="font-bold">Si Ud. Responde NO, no responda las preguntas 13 a 17</span></label>
                        <div className="flex items-center mr-10 my-1 ml-20">
                            <input type="checkbox" name="" id="" className=" mx-3"/>
                            <label className=" font-normal w-[20%]"  htmlFor="">1 No</label>
                            <input type="checkbox" name="" id="" className=" mx-3"/>
                            <label className=" font-normal w-[20%]"  htmlFor="">3 Si, en mi hombro izquierdo</label>
                        </div>
                        <div className="flex items-center mr-10 my-1 ml-20">
                            <input type="checkbox" name="" id="" className=" mx-3"/>
                            <label className=" font-normal w-[20%]"  htmlFor="">2 SI, en mi hombro derecho</label>
                            <input type="checkbox" name="" id="" className=" mx-3"/>
                            <label className=" font-normal w-[20%]"  htmlFor="">3 Si, en ambos hombros</label>
                        </div>
                    </div>
                    <div className="flex flex-col justify-between my-2">
                        <label className=" font-normal w-[80%]" htmlFor="">13.- Cuál es la duración total de tiempo en que Ud. Ha tenido problemas en los últimos 12 meses?</label>
                        <div className="flex justify-around w-[80%] items-center mt-3">
                            {[
                                {label: "0 Días", code: ""},{label: "1-7 Días", code: ""},{label: "8-30 Días", code: ""},{label: "Más de 30 Días", code: ""}
                            ].map((item, idx) => (
                                <div className="flex items-center gap-1">
                                    <input type="checkbox" name="" id="" />
                                    <label htmlFor="">{item.label}</label>
                                </div>
                            
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col justify-between my-2">
                        <label className=" font-normal" htmlFor="">14.- El problema en sus hombros le han causado una disminución de su actividad durante los últimos 12 meses?</label>
                        <div className="flex justify-between items-center mr-10 my-1">
                            <label className="ml-20 font-normal"  htmlFor="">a. Actividad de trabajo (en el trabajo o la casa)</label>
                            <div className="flex items-center">
                                <label htmlFor="">No</label>
                                <input type="checkbox" name="" id="" className=" mx-3"/>
                                <label htmlFor="">Si</label>
                                <input type="checkbox" name="" id="" className=" mx-3"/>
                            </div>
                        </div>
                        <div className="flex justify-between items-center mr-10 my-1">
                            <label className="ml-20 font-normal" htmlFor="">b. Actividades recreativas</label>
                            <div className="flex items-center">
                                <label htmlFor="">No</label>
                                <input type="checkbox" name="" id="" className=" mx-3"/>
                                <label htmlFor="">Si</label>
                                <input type="checkbox" name="" id="" className=" mx-3"/>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col justify-between my-2">
                        <label className=" font-normal w-[80%]" htmlFor="">15.- Cuál es la duración total de tiempo que el problema en sus hombros le han impedido hacer sus rutinas de trabajo (en el trabajo o en casa) durante los ultimos 12 meses?</label>
                        <div className="flex justify-around w-[80%] items-center mt-3">
                            {[
                                {label: "0 Días", code: ""},{label: "1-7 Días", code: ""},{label: "8-30 Días", code: ""},{label: "Más de 30 Días", code: ""}
                            ].map((item, idx) => (
                                <div className="flex items-center gap-1">
                                    <input type="checkbox" name="" id="" />
                                    <label htmlFor="">{item.label}</label>
                                </div>
                            
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-between my-2">
                        <label className=" font-normal w-[80%]" htmlFor="">16.- Ha sido visto por un médico, fisioterapista, quiropráctico y otra persona de área debido a problemas en los hombros los ultimos 12 meses?</label>
                        <div className="flex justify-center items-center mr-10">
                            <label htmlFor="">No</label>
                            <input type="checkbox" name="" id="" className=" mx-3"/>
                            <label htmlFor="">Si</label>
                            <input type="checkbox" name="" id="" className=" mx-3"/>
                        </div>
                    </div>
                    <div className="flex flex-col justify-between my-2">
                        <label className=" font-normal w-[80%]" htmlFor="">17.- Ha tenido problemas de los hombros en algún momento durante los últimos 7 días?</label>
                        <div className="flex items-center mr-10 my-1 ml-20">
                            <input type="checkbox" name="" id="" className=" mx-3"/>
                            <label className=" font-normal w-[20%]"  htmlFor="">1 No</label>
                            <input type="checkbox" name="" id="" className=" mx-3"/>
                            <label className=" font-normal w-[20%]"  htmlFor="">3 Si, en mi hombro izquierdo</label>
                        </div>
                        <div className="flex items-center mr-10 my-1 ml-20">
                            <input type="checkbox" name="" id="" className=" mx-3"/>
                            <label className=" font-normal w-[20%]"  htmlFor="">2 SI, en mi hombro derecho</label>
                            <input type="checkbox" name="" id="" className=" mx-3"/>
                            <label className=" font-normal w-[20%]"  htmlFor="">3 Si, en ambos hombros</label>
                        </div>
                    </div>
                </div>

                
                
            </div>
        </>
    )
}

export default Hombros