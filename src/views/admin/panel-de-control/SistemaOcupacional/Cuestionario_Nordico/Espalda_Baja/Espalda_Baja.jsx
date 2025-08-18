const Espalda_Baja = ({token, selectedSede, userlogued, form, setForm, handleChange, handleChangeNumber, handleClearnotO, handleInputChangeChecked}) => {
    
    const handleInputChangeCheckedEB = (e) => {
        const { name } = e.target;
        setForm(prev => {
            const newForm = { ...prev };

            if (prev[name]) {
                // Si ya estaba activo, lo desmarcamos
                newForm[name] = false;
            } else {
            // Primero desmarcar todos los de este grupo
            ["pregunta4AEspaldaBaja", "pregunta4BEspaldaBaja", "pregunta4CEspaldaBaja", "pregunta4DEspaldaBaja", "pregunta4EEspaldaBaja"]
            .forEach(code => newForm[code] = false);

            // Activar solo el seleccionado
                newForm[name] = true;
            }

            return newForm;
        });
    };

    const handleInputChangeCheckedEB2 = (e) => {
        const { name } = e.target;
        setForm(prev => {
            const newForm = { ...prev };

            if (prev[name]) {
                // Si ya estaba activo, lo desmarcamos
                newForm[name] = false;
            } else {
                // Primero desmarcar todos los de este grupo
                ["pregunta6AEspaldaBaja", "pregunta6BEspaldaBaja", "pregunta6CEspaldaBaja", "pregunta6DEspaldaBaja"]
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
                <div className="flex flex-col w-full">
                    <div className="flex">
                        <div className="flex flex-col w-[80%]">
                        <h1 className="font-bold mb-8 mt-4 text-2xl">3.- Problemas con la Espalda Baja</h1>
                        <h2 className="font-bold text-center text-2xl mb-4">¿Cómo responder el cuestionario?</h2>
                        <p>En este dibujo Ud. puede ver la Parte del cuerpo referida en el cuestionario. problemas de espalda baja significan molestias. dolor o disconfort en el área indicada con irradiación o no hacia una o ambas piernas (ciática). Por favor responda poniendo una x en el respectivo recuadro para cada pregunta.</p>
                    </div>
                    <div className="flex flex-col w-[20%]">
                        <img src="img/Nordico/Espaldabaja.png" alt="" />
                    </div>
                    </div>
                    <div className="flex justify-between mt-5">
                        <label className=" font-normal" htmlFor="">1.- Ud. ha tenido problemas en la espalda baja (molestias, dolor o disconfort) ?</label>
                        <div className="flex justify-center items-center mr-10">
                            <label htmlFor="">No</label>
                            <input checked={form.pregunta1EspaldaBajaNo} onChange={handleInputChangeChecked} type="checkbox" name="pregunta1EspaldaBajaNo" id="" className=" mx-3"/>
                            <label htmlFor="">Si</label>
                            <input checked={form.pregunta1EspaldaBajaSi} onChange={handleInputChangeChecked} type="checkbox" name="pregunta1EspaldaBajaSi" id="" className=" mx-3"/>
                        </div>
                    </div>
                    <div className="flex justify-between my-2">
                        <label className="font-bold" htmlFor="">Si Ud. respondió NO a la pregunta 1, no responda las preguntas de la 2 a la B</label>
                    </div>
                    <div className="flex justify-between my-2">
                        <label className=" font-normal" htmlFor="">2.- Ud. ha estado hospitalizado por problemas es espalda baja?</label>
                        <div className="flex justify-center items-center mr-10">
                            <label htmlFor="">No</label>
                            <input checked={form.pregunta2EspaldaBajaNo} onChange={handleInputChangeChecked} type="checkbox" name="pregunta2EspaldaBajaNo" id="" className=" mx-3"/>
                            <label htmlFor="">Si</label>
                            <input checked={form.pregunta2EspaldaBajaSi} onChange={handleInputChangeChecked} type="checkbox" name="pregunta2EspaldaBajaSi" id="" className=" mx-3"/>
                        </div>
                    </div>
                    <div className="flex justify-between my-2">
                        <label className=" font-normal" htmlFor="">3.- Ud. ha tenido cambios de trabajo o actividad por problemas de espalda baja?</label>
                        <div className="flex justify-center items-center mr-10">
                            <label htmlFor="">No</label>
                            <input checked={form.pregunta3EspaldaBajaNo} onChange={handleInputChangeChecked} type="checkbox" name="pregunta3EspaldaBajaNo" id="" className=" mx-3"/>
                            <label htmlFor="">Si</label>
                            <input checked={form.pregunta3EspaldaBajaSi} onChange={handleInputChangeChecked} type="checkbox" name="pregunta3EspaldaBajaSi" id="" className=" mx-3"/>
                        </div>
                    </div>
                    <div className="flex flex-col justify-between my-2">
                        <label className=" font-normal" htmlFor="">4.- Cuál es la duración total de tiempo en que ha tenido problemas de espalda baja durante los últimos 12 meses ?</label>
                        <div className="flex justify-around w-[80%] items-center mt-3">
                            {[
                                {label: "0 Días", code: "pregunta4AEspaldaBaja"},{label: "1-7 Días", code: "pregunta4BEspaldaBaja"},{label: "8-30 Días", code: "pregunta4CEspaldaBaja"},{label: "Más de 30 Días", code: "pregunta4DEspaldaBaja"},{label: "Todos los Días", code: "pregunta4EEspaldaBaja"},
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-1">
                                    <input checked={form[item.code]} type="checkbox" name={item.code} onChange={handleInputChangeCheckedEB} id="" />
                                    <label htmlFor="">{item.label}</label>
                                </div>
                            
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-between my-2">
                        <label className="font-bold" htmlFor="">Si Ud. respondió 0 días a la pregunta 4, No responda las preguntas 5 a la 8</label>
                    </div>
                    <div className="flex flex-col justify-between my-2">
                        <label className=" font-normal" htmlFor="">5.- Los problemas de espalda baja han causado a Ud. reducción de su actividad física durante los últimos 12 meses?</label>
                        <div className="flex justify-between items-center mr-10 my-1">
                            <label className="ml-20 font-normal"  htmlFor="">a. Actividad de trabajo (en el trabajo o la casa)</label>
                            <div className="flex items-center">
                                <label htmlFor="">No</label>
                                <input checked={form.pregunta5AEspaldaBajaNo} onChange={handleInputChangeChecked} type="checkbox" name="pregunta5AEspaldaBajaNo" id="" className=" mx-3"/>
                                <label htmlFor="">Si</label>
                                <input checked={form.pregunta5AEspaldaBajaSi} onChange={handleInputChangeChecked} type="checkbox" name="pregunta5AEspaldaBajaSi" id="" className=" mx-3"/>
                            </div>
                        </div>
                        <div className="flex justify-between items-center mr-10 my-1">
                            <label className="ml-20 font-normal" htmlFor="">b. Actividades recreativas</label>
                            <div className="flex items-center">
                                <label htmlFor="">No</label>
                                <input checked={form.pregunta5BEspaldaBajaNo} onChange={handleInputChangeChecked} type="checkbox" name="pregunta5BEspaldaBajaNo" id="" className=" mx-3"/>
                                <label htmlFor="">Si</label>
                                <input checked={form.pregunta5BEspaldaBajaSi} onChange={handleInputChangeChecked} type="checkbox" name="pregunta5BEspaldaBajaSi" id="" className=" mx-3"/>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col justify-between my-2">
                        <label className=" font-normal w-[80%]" htmlFor="">6.- Cuál es la duración total de tiempo que los problemas de espalda baja le han impedido hacer sus rutinas de trabajo (en el trabajo o en casa) durante los ultimos 12 meses?</label>
                        <div className="flex justify-around w-[80%] items-center mt-3">
                            {[
                                {label: "0 Días", code: "pregunta6AEspaldaBaja"},{label: "1-7 Días", code: "pregunta6BEspaldaBaja"},{label: "8-30 Días", code: "pregunta6CEspaldaBaja"},{label: "Más de 30 Días", code: "pregunta6DEspaldaBaja"}
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-1">
                                    <input checked={form[item.code]} type="checkbox" name={item.code} onChange={handleInputChangeCheckedEB2} id="" />
                                    <label htmlFor="">{item.label}</label>
                                </div>
                            
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-between my-2">
                        <label className=" font-normal w-[80%]" htmlFor="">7.- Ha sido visto por un médico, fisioterapista, quiropráctico y otra persona de área debido a problemas de espalda durante los ultimos 12 meses?</label>
                        <div className="flex justify-center items-center mr-10">
                            <label htmlFor="">No</label>
                            <input checked={form.pregunta7EspaldaBajaNo} onChange={handleInputChangeChecked} type="checkbox" name="pregunta7EspaldaBajaNo" id="" className=" mx-3"/>
                            <label htmlFor="">Si</label>
                            <input checked={form.pregunta7EspaldaBajaSi} onChange={handleInputChangeChecked} type="checkbox" name="pregunta7EspaldaBajaSi" id="" className=" mx-3"/>
                        </div>
                    </div>
                    <div className="flex justify-between my-2">
                        <label className=" font-normal w-[80%]" htmlFor="">8.- Ha tenido problemas de espalda baja en algún momento durante los últimos 7 días?</label>
                        <div className="flex justify-center items-center mr-10">
                            <label htmlFor="">No</label>
                            <input checked={form.pregunta8EspaldaBajaNo} onChange={handleInputChangeChecked} type="checkbox" name="pregunta8EspaldaBajaNo" id="" className=" mx-3"/>
                            <label htmlFor="">Si</label>
                            <input checked={form.pregunta8EspaldaBajaSi} onChange={handleInputChangeChecked} type="checkbox" name="pregunta8EspaldaBajaSi" id="" className=" mx-3"/>
                        </div>
                    </div>
                </div>

                
                
            </div>
        </>
    )
}

export default Espalda_Baja