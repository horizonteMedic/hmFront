const Cuestionario = () => {
    return(
        <>
            <div className="flex w-full text-xl">
                <div className="w-[60%] flex flex-col">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">1.- Datos Personales</h2>
                        <div className="flex items-center">
                            <label htmlFor="">Fecha: </label>
                            <input type="date" name="" id="" className="border rounded px-2 py-1 w-full" />
                        </div>
                    </div>
                    <div className="flex flex-col justify-center mt-4">
                        <div className="flex w-auto items-center my-2 ">
                            <label className="w-80 text-right" htmlFor="">Nro Orden:</label>
                            <input type="text" className="border rounded px-2 py-1" />
                            <button></button>
                        </div>
                        <div className="flex w-auto items-center my-2">
                            <label className="w-80 text-right" htmlFor="">Nombre Completo:</label>
                            <input type="text" className="border rounded px-2 py-1 w-[50%]" />
                        </div>
                        <div className="flex w-auto items-center my-2">
                            <label className="w-80 text-right" htmlFor="">Edad en años cunplidos:</label>
                            <input type="text" className="border rounded px-2 py-1" />
                        </div>
                        <div className="flex w-auto items-center my-2">
                            <label className="w-80 text-right" htmlFor="">Género:</label>
                            <label htmlFor="" className="ml-3">Masculino</label>
                            <input type="checkbox" name="" id="" className="m-2" />
                            <label htmlFor="" className="ml-4">Femenino</label>
                            <input type="checkbox" name="" id="" className="m-2" />
                        </div>
                        <h2 className="text-center">Cuantos años y meses ha estado Ud. haciendo el presente tipo de trabajo:</h2>
                        <div className="flex w-auto items-center my-2">
                            <label className="w-80 text-right" htmlFor="">Años:</label>
                            <input type="text" name=""id="" className="w-20 border rounded px-2 py-1 mx-2" />
                            <label htmlFor="" className="ml-4">Meses</label>
                            <input type="text" name=""id="" className="w-20 border rounded px-2 py-1 mx-2" />
                        </div>
                        <div className="flex w-auto items-center my-2">
                            <label className="text-right" htmlFor="">En promedio, cuántas horas a la semana trabaja?:</label>
                            <input type="text" name=""id="" className="w-20 border rounded px-2 py-1 mx-2" />
                        </div>
                        <div className="flex w-auto items-center my-2">
                            <label className="w-80 text-right" htmlFor="">Es Ud.:</label>
                            <label htmlFor="" className="ml-3">Diestro</label>
                            <input type="checkbox" name="" id="" className="m-2" />
                            <label htmlFor="" className="ml-4">Zurdo</label>
                            <input type="checkbox" name="" id="" className="m-2" />
                        </div>
                        <h1 className="font-bold mt-3">2.- Problemas con los órganos de la locomocción</h1>
                        <h2 className="text-center mt-5 mb-6">¿Cómo responder el cuestionario?</h2>
                        <p>En este dibujo Ud. puede ver la posición aproximada de las partes del cuerpo referidos en el cuestionario.
                        </p>
                        <p className="mt-2">Ud. debe decidir cuál parte tiene o ha tenido molestias / problema (si lo ha tenido), por favor responda poniendo una x en el respectivo recuadro para cada pregunta.</p>
                    </div>
                </div>
                <div className="w-[40%] flex flex-col">
                    <img src="img/Nordico/nordico.png" alt="" />
                </div>
            </div>
        </>
    )
}

export default Cuestionario