const Hombros = ({token, selectedSede, userlogued, form, setForm, handleChange, handleChangeNumber, handleClearnotO, handleInputChangeChecked}) => {
    
    const handleInputChangeChecked1 = (e) => {
        const { name } = e.target;
        setForm(prev => {
            const newForm = { ...prev };

            if (prev[name]) {
                // Si ya estaba activo, lo desmarcamos
                newForm[name] = false;
            } else {
            // Primero desmarcar todos los de este grupo
            ["pregunta5AProblemasHombros", "pregunta5BProblemasHombros", "pregunta5CProblemasHombros", "pregunta5DProblemasHombros"]
            .forEach(code => newForm[code] = false);

            // Activar solo el seleccionado
                newForm[name] = true;
            }

            return newForm;
        });
    };

    const handleInputChangeChecked2 = (e) => {
        const { name } = e.target;
        setForm(prev => {
            const newForm = { ...prev };

            if (prev[name]) {
                // Si ya estaba activo, lo desmarcamos
                newForm[name] = false;
            } else {
            // Primero desmarcar todos los de este grupo
            ["pregunta7AProblemasHombros", "pregunta7BProblemasHombros", "pregunta7CProblemasHombros", "pregunta7DProblemasHombros"]
            .forEach(code => newForm[code] = false);

            // Activar solo el seleccionado
                newForm[name] = true;
            }

            return newForm;
        });
    };

    const handleInputChangeChecked10 = (e) => {
        const { name } = e.target;
        setForm(prev => {
            const newForm = { ...prev };

            if (prev[name]) {
                // Si ya estaba activo, lo desmarcamos
                newForm[name] = false;
            } else {
            // Primero desmarcar todos los de este grupo
            ["pregunta2ProblemasHombrosNo", "pregunta2ProblemasHombroIzquierdoSi", "pregunta2ProblemasHombroDerechoSi", "pregunta2ProblemasAmbosHombros"]
            .forEach(code => newForm[code] = false);

            // Activar solo el seleccionado
                newForm[name] = true;
            }

            return newForm;
        });
    };

    const handleInputChangeChecked12 = (e) => {
        const { name } = e.target;
        setForm(prev => {
            const newForm = { ...prev };

            if (prev[name]) {
                // Si ya estaba activo, lo desmarcamos
                newForm[name] = false;
            } else {
            // Primero desmarcar todos los de este grupo
            ["pregunta4ProblemasHombrosNo", "pregunta4ProblemasHombroIzquierdoSi", "pregunta4ProblemasHombroDerechoSi", "pregunta4ProblemasAmbosHombros"]
            .forEach(code => newForm[code] = false);

            // Activar solo el seleccionado
                newForm[name] = true;
            }

            return newForm;
        });
    };

    const handleInputChangeChecked17 = (e) => {
        const { name } = e.target;
        setForm(prev => {
            const newForm = { ...prev };

            if (prev[name]) {
                // Si ya estaba activo, lo desmarcamos
                newForm[name] = false;
            } else {
            // Primero desmarcar todos los de este grupo
            ["pregunta9ProblemasHombrosNo", "pregunta9ProblemasHombroIzquierdoSi", "pregunta9ProblemasHombroDerechoSi", "pregunta9ProblemasAmbosHombros"]
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
                            <input checked={form.pregunta1ProblemasHombrosNo} onChange={handleInputChangeChecked} type="checkbox" name="pregunta1ProblemasHombrosNo" id="" className=" mx-3"/>
                            <label htmlFor="">Si</label>
                            <input checked={form.pregunta1ProblemasHombrosSi} onChange={handleInputChangeChecked} type="checkbox" name="pregunta1ProblemasHombrosSi" id="" className=" mx-3"/>
                        </div>
                    </div>
                    <div className="flex justify-between my-2">
                        <label className="font-bold" htmlFor="">Si Ud. respondió NO a la pregunta 9, no responda las preguntas de la 10 a 17</label>
                    </div>
                    <div className="flex flex-col justify-between my-2">
                        <label className=" font-normal" htmlFor="">10.- Ud. ha tenido lesiones en sus hombros en un accidente?</label>
                        <div className="flex items-center mr-10 my-1 ml-20">
                            <input checked={form.pregunta2ProblemasHombrosNo} onChange={handleInputChangeChecked10} type="checkbox" name="pregunta2ProblemasHombrosNo" id="" className=" mx-3"/>
                            <label className=" font-normal w-[20%]"  htmlFor="">1 No</label>
                            <input checked={form.pregunta2ProblemasHombroIzquierdoSi} onChange={handleInputChangeChecked10} type="checkbox" name="pregunta2ProblemasHombroIzquierdoSi" id="" className=" mx-3"/>
                            <label className=" font-normal w-[20%]"  htmlFor="">3 Si, en mi hombro izquierdo</label>
                        </div>
                        <div className="flex items-center mr-10 my-1 ml-20">
                            <input checked={form.pregunta2ProblemasHombroDerechoSi} onChange={handleInputChangeChecked10} type="checkbox" name="pregunta2ProblemasHombroDerechoSi" id="" className=" mx-3"/>
                            <label className=" font-normal w-[20%]"  htmlFor="">2 SI, en mi hombro derecho</label>
                            <input checked={form.pregunta2ProblemasAmbosHombros} onChange={handleInputChangeChecked10} type="checkbox" name="pregunta2ProblemasAmbosHombros" id="" className=" mx-3"/>
                            <label className=" font-normal w-[20%]"  htmlFor="">3 Si, en ambos hombros</label>
                        </div>
                    </div>
                    <div className="flex justify-between my-2">
                        <label className=" font-normal" htmlFor="">11.- Ud. ha tenido un cambio de trabajo o actividad por problemas de hombros?</label>
                        <div className="flex justify-center items-center mr-10">
                            <label htmlFor="">No</label>
                            <input checked={form.pregunta3ProblemasHombrosNo} onChange={handleInputChangeChecked} type="checkbox" name="pregunta3ProblemasHombrosNo" id="" className=" mx-3"/>
                            <label htmlFor="">Si</label>
                            <input checked={form.pregunta3ProblemasHombrosSi} onChange={handleInputChangeChecked} type="checkbox" name="pregunta3ProblemasHombrosSi" id="" className=" mx-3"/>
                        </div>
                    </div>
                    <div className="flex flex-col justify-between my-2">
                        <label className=" font-normal" htmlFor="">12.- Ud. ha tenido problemas en los hombros durante los ultimos 12 meses? <span className="font-bold">Si Ud. Responde NO, no responda las preguntas 13 a 17</span></label>
                        <div className="flex items-center mr-10 my-1 ml-20">
                            <input checked={form.pregunta4ProblemasHombrosNo} onChange={handleInputChangeChecked12} type="checkbox" name="pregunta4ProblemasHombrosNo" id="" className=" mx-3"/>
                            <label className=" font-normal w-[20%]"  htmlFor="">1 No</label>
                            <input checked={form.pregunta4ProblemasHombroIzquierdoSi} onChange={handleInputChangeChecked12} type="checkbox" name="pregunta4ProblemasHombroIzquierdoSi" id="" className=" mx-3"/>
                            <label className=" font-normal w-[20%]"  htmlFor="">3 Si, en mi hombro izquierdo</label>
                        </div>
                        <div className="flex items-center mr-10 my-1 ml-20">
                            <input checked={form.pregunta4ProblemasHombroDerechoSi} onChange={handleInputChangeChecked12} type="checkbox" name="pregunta4ProblemasHombroDerechoSi" id="" className=" mx-3"/>
                            <label className=" font-normal w-[20%]"  htmlFor="">2 SI, en mi hombro derecho</label>
                            <input checked={form.pregunta4ProblemasAmbosHombros} onChange={handleInputChangeChecked12} type="checkbox" name="pregunta4ProblemasAmbosHombros" id="" className=" mx-3"/>
                            <label className=" font-normal w-[20%]"  htmlFor="">3 Si, en ambos hombros</label>
                        </div>
                    </div>
                    <div className="flex flex-col justify-between my-2">
                        <label className=" font-normal w-[80%]" htmlFor="">13.- Cuál es la duración total de tiempo en que Ud. Ha tenido problemas en los últimos 12 meses?</label>
                        <div className="flex justify-around w-[80%] items-center mt-3">
                            {[
                                {label: "0 Días", code: "pregunta5AProblemasHombros"},{label: "1-7 Días", code: "pregunta5BProblemasHombros"},{label: "8-30 Días", code: "pregunta5CProblemasHombros"},{label: "Más de 30 Días", code: "pregunta5DProblemasHombros"}
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-1">
                                    <input checked={form[item.code]} type="checkbox" name={item.code} onChange={handleInputChangeChecked1} id="" />
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
                                <input checked={form.pregunta6AProblemasHombrosNo} onChange={handleInputChangeChecked} type="checkbox" name="pregunta6AProblemasHombrosNo" id="" className=" mx-3"/>
                                <label htmlFor="">Si</label>
                                <input checked={form.pregunta6AProblemasHombrosSi} onChange={handleInputChangeChecked} type="checkbox" name="pregunta6AProblemasHombrosSi" id="" className=" mx-3"/>
                            </div>
                        </div>
                        <div className="flex justify-between items-center mr-10 my-1">
                            <label className="ml-20 font-normal" htmlFor="">b. Actividades recreativas</label>
                            <div className="flex items-center">
                                <label htmlFor="">No</label>
                                <input checked={form.pregunta6BProblemasHombrosNo} onChange={handleInputChangeChecked} type="checkbox" name="pregunta6BProblemasHombrosNo" id="" className=" mx-3"/>
                                <label htmlFor="">Si</label>
                                <input checked={form.pregunta6BProblemasHombrosSi} onChange={handleInputChangeChecked} type="checkbox" name="pregunta6BProblemasHombrosSi" id="" className=" mx-3"/>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col justify-between my-2">
                        <label className=" font-normal w-[80%]" htmlFor="">15.- Cuál es la duración total de tiempo que el problema en sus hombros le han impedido hacer sus rutinas de trabajo (en el trabajo o en casa) durante los ultimos 12 meses?</label>
                        <div className="flex justify-around w-[80%] items-center mt-3">
                            {[
                                {label: "0 Días", code: "pregunta7AProblemasHombros"},{label: "1-7 Días", code: "pregunta7BProblemasHombros"},{label: "8-30 Días", code: "pregunta7CProblemasHombros"},{label: "Más de 30 Días", code: "pregunta7DProblemasHombros"}
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-1">
                                    <input checked={form[item.code]} type="checkbox" name={item.code} onChange={handleInputChangeChecked2} id="" />
                                    <label htmlFor="">{item.label}</label>
                                </div>
                            
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-between my-2">
                        <label className=" font-normal w-[80%]" htmlFor="">16.- Ha sido visto por un médico, fisioterapista, quiropráctico y otra persona de área debido a problemas en los hombros los ultimos 12 meses?</label>
                        <div className="flex justify-center items-center mr-10">
                            <label htmlFor="">No</label>
                            <input checked={form.pregunta8ProblemasHombrosNo} onChange={handleInputChangeChecked} type="checkbox" name="pregunta8ProblemasHombrosNo" id="" className=" mx-3"/>
                            <label htmlFor="">Si</label>
                            <input checked={form.pregunta8ProblemasHombrosSi} onChange={handleInputChangeChecked} type="checkbox" name="pregunta8ProblemasHombrosSi" id="" className=" mx-3"/>
                        </div>
                    </div>
                    <div className="flex flex-col justify-between my-2">
                        <label className=" font-normal w-[80%]" htmlFor="">17.- Ha tenido problemas de los hombros en algún momento durante los últimos 7 días?</label>
                        <div className="flex items-center mr-10 my-1 ml-20">
                            <input checked={form.pregunta9ProblemasHombrosNo} onChange={handleInputChangeChecked17} type="checkbox" name="pregunta9ProblemasHombrosNo" id="" className=" mx-3"/>
                            <label className=" font-normal w-[20%]"  htmlFor="">1 No</label>
                            <input checked={form.pregunta9ProblemasHombroIzquierdoSi} onChange={handleInputChangeChecked17} type="checkbox" name="pregunta9ProblemasHombroIzquierdoSi" id="" className=" mx-3"/>
                            <label className=" font-normal w-[20%]"  htmlFor="">3 Si, en mi hombro izquierdo</label>
                        </div>
                        <div className="flex items-center mr-10 my-1 ml-20">
                            <input checked={form.pregunta9ProblemasHombroDerechoSi} onChange={handleInputChangeChecked17} type="checkbox" name="pregunta9ProblemasHombroDerechoSi" id="" className=" mx-3"/>
                            <label className=" font-normal w-[20%]"  htmlFor="">2 SI, en mi hombro derecho</label>
                            <input checked={form.pregunta9ProblemasAmbosHombros} onChange={handleInputChangeChecked17} type="checkbox" name="pregunta9ProblemasAmbosHombros" id="" className=" mx-3"/>
                            <label className=" font-normal w-[20%]"  htmlFor="">3 Si, en ambos hombros</label>
                        </div>
                    </div>
                </div>

                
                
            </div>
        </>
    )
}

export default Hombros