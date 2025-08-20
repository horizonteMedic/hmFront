
const Cuestionario = ({token, selectedSede, userlogued, form, setForm, handleChange, handleChangeNumber, handleClearnotO, handleInputChangeChecked, tabla, VerifyTR}) => {
    
    const handleInputChangeCheckedSexo = (e) => {
        const { name } = e.target;
        setForm(prev => {
            const newForm = { ...prev };

            if (prev[name]) {
                // Si ya estaba activo, lo desmarcamos
                newForm[name] = false;
            } else {
            // Primero desmarcar todos los de este grupo
            ["esDiestro", "esZurdo"]
            .forEach(code => newForm[code] = false);

            // Activar solo el seleccionado
                newForm[name] = true;
            }

            return newForm;
        });
    };

    return(
        <>
            <div className="flex w-full text-xl border rounded p-4 mt-6">
                <div className="w-[60%] flex flex-col">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">1.- Datos Personales</h2>
                        <div className="flex items-center">
                            <label htmlFor="">Fecha: </label>
                            <input type="date" name="fechaCuestionario" value={form.fechaCuestionario} onChange={handleChange} className="border rounded px-2 py-1 w-full" />
                        </div>
                    </div>
                    <div className="flex flex-col justify-center mt-4">
                        <div className="flex w-auto items-center my-2 ">
                            <label className="w-80 text-right" htmlFor="">Nro Orden:</label>
                            <input type="text" name="norden" className="border rounded px-2 py-1" onChange={handleChangeNumber} 
                            value={form.norden} 
                            onKeyUp={(event) => {
                            if (event.key === "Enter")
                                handleClearnotO(),
                                VerifyTR(
                                    form.norden,
                                    tabla,
                                    token,
                                    setForm,
                                    selectedSede
                                );
                            }} />
                            <button></button>
                        </div>
                        <div className="flex w-auto items-center my-2">
                            <label className="w-80 text-right" htmlFor="">Nombre Completo:</label>
                            <input disabled type="text" value={form.nombres} className="border rounded px-2 py-1 w-[50%]" />
                        </div>
                        <div className="flex w-auto items-center my-2">
                            <label className="w-80 text-right" htmlFor="">Edad en años cunplidos:</label>
                            <input disabled value={form.edad} type="text" className="border rounded px-2 py-1" />
                        </div>
                        <div className="flex w-auto items-center my-2">
                            <label className="w-80 text-right" htmlFor="">Género:</label>
                            <label htmlFor="" className="ml-3">Masculino</label>
                            <input disabled checked={form.sexo === "M"} type="checkbox" name="" id="" className="m-2" />
                            <label htmlFor="" className="ml-4">Femenino</label>
                            <input disabled checked={form.sexo === "F"} type="checkbox" name="" id="" className="m-2" />
                        </div>
                        <h2 className="text-center">Cuantos años y meses ha estado Ud. haciendo el presente tipo de trabajo:</h2>
                        <div className="flex w-auto items-center my-2">
                            <label className="w-80 text-right" htmlFor="">Años:</label>
                            <input value={form.anios} onChange={handleChangeNumber} type="text" name="anios" id="" className="w-20 border rounded px-2 py-1 mx-2" />
                            <label htmlFor="" className="ml-4">Meses</label>
                            <input value={form.meses} onChange={handleChangeNumber} type="text" name="meses" id="" className="w-20 border rounded px-2 py-1 mx-2" />
                        </div>
                        <div className="flex w-auto items-center my-2">
                            <label className="text-right" htmlFor="">En promedio, cuántas horas a la semana trabaja?:</label>
                            <input type="text" value={form.horasTrabajadas} onChange={handleChangeNumber} name="horasTrabajadas"id="" className="w-20 border rounded px-2 py-1 mx-2" />
                        </div>
                        <div className="flex w-auto items-center my-2">
                            <label className="w-80 text-right" htmlFor="">Es Ud.:</label>
                            <label htmlFor="" className="ml-3">Diestro</label>
                            <input onChange={handleInputChangeCheckedSexo} checked={form.esDiestro} type="checkbox" name="esDiestro" id="" className="m-2" />
                            <label htmlFor="" className="ml-4">Zurdo</label>
                            <input onChange={handleInputChangeCheckedSexo} checked={form.esZurdo} type="checkbox" name="esZurdo" id="" className="m-2" />
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