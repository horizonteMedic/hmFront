import { faBroom, faPrint, faSave } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const Cuello = ({token, userlogued, form, setForm, handleInputChangeChecked, SubmitCuestionarioNordic, tabla, handleClear}) => {
    
    const handleInputChangeChecked4 = (e) => {
        const { name } = e.target;
        setForm(prev => {
            const newForm = { ...prev };

            if (prev[name]) {
                // Si ya estaba activo, lo desmarcamos
                newForm[name] = false;
            } else {
            // Primero desmarcar todos los de este grupo
            ["pregunta4AProblemasCuello", "pregunta4BProblemasCuello", "pregunta4CProblemasCuello", "pregunta4DProblemasCuello", "pregunta4EProblemasCuello"]
            .forEach(code => newForm[code] = false);

            // Activar solo el seleccionado
                newForm[name] = true;
            }

            return newForm;
        });
    };

    const handleInputChangeChecked6 = (e) => {
        const { name } = e.target;
        setForm(prev => {
            const newForm = { ...prev };

            if (prev[name]) {
                // Si ya estaba activo, lo desmarcamos
                newForm[name] = false;
            } else {
            // Primero desmarcar todos los de este grupo
            ["pregunta6AProblemasCuello", "pregunta6BProblemasCuello", "pregunta6CProblemasCuello", "pregunta6DProblemasCuello"]
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
                        <h1 className="font-bold mb-8 mt-4 text-2xl">5.- Problemas con el Cuello</h1>
                        <h2 className="font-bold text-center text-2xl mb-4">¿Cómo responder el cuestionario?</h2>
                        <p>Problemas de cuello significa molestias, dolor o disconforten el área indicada. Por favor concéntrese en ésta área ignorando cualquier problema que usted pueda haber tenido en partes adyacentes a ésta.</p>
                    </div>
                    <div className="flex flex-col w-[20%]">
                        <img src="img/Nordico/cuello.png" alt="" />
                    </div>
                    </div>
                    <div className="flex justify-between mt-5">
                        <label className=" font-normal" htmlFor="">1.- Ud. ha tenido problemas en el cuello (molestias, dolor o disconfort) ?</label>
                        <div className="flex justify-center items-center mr-10">
                            <label htmlFor="">No</label>
                            <input checked={form.pregunta1ProblemasCuelloNo} onChange={handleInputChangeChecked} type="checkbox" name="pregunta1ProblemasCuelloNo" id="" className=" mx-3"/>
                            <label htmlFor="">Si</label>
                            <input checked={form.pregunta1ProblemasCuelloSi} onChange={handleInputChangeChecked} type="checkbox" name="pregunta1ProblemasCuelloSi" id="" className=" mx-3"/>
                        </div>
                    </div>
                    <div className="flex justify-between my-2">
                        <label className="font-bold" htmlFor="">Si Ud. respondió NO a la pregunta 1, no responda las preguntas de la 2 a la B</label>
                    </div>
                    <div className="flex justify-between my-2">
                        <label className=" font-normal" htmlFor="">2.- Ud. ha sido lesionado en su cuello en un accidente?</label>
                        <div className="flex justify-center items-center mr-10">
                            <label htmlFor="">No</label>
                            <input checked={form.pregunta2ProblemasCuelloNo} onChange={handleInputChangeChecked} type="checkbox" name="pregunta2ProblemasCuelloNo" id="" className=" mx-3"/>
                            <label htmlFor="">Si</label>
                            <input checked={form.pregunta2ProblemasCuelloSi} onChange={handleInputChangeChecked} type="checkbox" name="pregunta2ProblemasCuelloSi" id="" className=" mx-3"/>
                        </div>
                    </div>
                    <div className="flex justify-between my-2">
                        <label className=" font-normal" htmlFor="">3.- Ud. ha tenido cambios de trabajo o actividad por problemas en el cuello?</label>
                        <div className="flex justify-center items-center mr-10">
                            <label htmlFor="">No</label>
                            <input checked={form.pregunta3ProblemasCuelloNo} onChange={handleInputChangeChecked} type="checkbox" name="pregunta3ProblemasCuelloNo" id="" className=" mx-3"/>
                            <label htmlFor="">Si</label>
                            <input checked={form.pregunta3ProblemasCuelloSi} onChange={handleInputChangeChecked} type="checkbox" name="pregunta3ProblemasCuelloSi" id="" className=" mx-3"/>
                        </div>
                    </div>
                    <div className="flex flex-col justify-between my-2">
                        <label className=" font-normal" htmlFor="">4.- Cuál es la duración total de tiempo en que ha tenido problemas de espalda baja durante los últimos 12 meses ?</label>
                        <div className="flex justify-around w-[80%] items-center mt-3">
                            {[
                                {label: "0 Días", code: "pregunta4AProblemasCuello"},{label: "1-7 Días", code: "pregunta4BProblemasCuello"},{label: "8-30 Días", code: "pregunta4CProblemasCuello"},{label: "Más de 30 Días", code: "pregunta4DProblemasCuello"},{label: "Todos los Días", code: "pregunta4EProblemasCuello"},
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-1">
                                    <input checked={form[item.code]} type="checkbox" name={item.code} onChange={handleInputChangeChecked4} id="" />
                                    <label htmlFor="">{item.label}</label>
                                </div>
                            
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-between my-2">
                        <label className="font-bold" htmlFor="">Si Ud. respondió 0 días a la pregunta 4, No responda las preguntas 5 a la 8</label>
                    </div>
                    <div className="flex flex-col justify-between my-2">
                        <label className=" font-normal" htmlFor="">5.- Los problemas de su cuello han causado a Ud. reducción de su actividad física durante los últimos 12 meses?</label>
                        <div className="flex justify-between items-center mr-10 my-1">
                            <label className="ml-20 font-normal"  htmlFor="">a. Actividad de trabajo (en el trabajo o la casa)</label>
                            <div className="flex items-center">
                                <label htmlFor="">No</label>
                                <input checked={form.pregunta5AProblemasCuelloNo} onChange={handleInputChangeChecked} type="checkbox" name="pregunta5AProblemasCuelloNo" id="" className=" mx-3"/>
                                <label htmlFor="">Si</label>
                                <input checked={form.pregunta5AProblemasCuelloSi} onChange={handleInputChangeChecked} type="checkbox" name="pregunta5AProblemasCuelloSi" id="" className=" mx-3"/>
                            </div>
                        </div>
                        <div className="flex justify-between items-center mr-10 my-1">
                            <label className="ml-20 font-normal" htmlFor="">b. Actividades recreativas</label>
                            <div className="flex items-center">
                                <label htmlFor="">No</label>
                                <input checked={form.pregunta5BProblemasCuelloNo} onChange={handleInputChangeChecked} type="checkbox" name="pregunta5BProblemasCuelloNo" id="" className=" mx-3"/>
                                <label htmlFor="">Si</label>
                                <input checked={form.pregunta5BProblemasCuelloSi} onChange={handleInputChangeChecked} type="checkbox" name="pregunta5BProblemasCuelloSi" id="" className=" mx-3"/>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col justify-between my-2">
                        <label className=" font-normal w-[80%]" htmlFor="">6.- Cuál es la duración total de tiempo que los problemas de su cuello le han impedido hacer sus rutinas de trabajo (en el trabajo o en casa) durante los ultimos 12 meses?</label>
                        <div className="flex justify-around w-[80%] items-center mt-3">
                            {[
                                {label: "0 Días", code: "pregunta6AProblemasCuello"},{label: "1-7 Días", code: "pregunta6BProblemasCuello"},{label: "8-30 Días", code: "pregunta6CProblemasCuello"},{label: "Más de 30 Días", code: "pregunta6DProblemasCuello"}
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-1">
                                    <input checked={form[item.code]} type="checkbox" name={item.code} onChange={handleInputChangeChecked6} id="" />
                                    <label htmlFor="">{item.label}</label>
                                </div>
                            
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-between my-2">
                        <label className=" font-normal w-[80%]" htmlFor="">7.- Ha sido visto por un médico, fisioterapista, quiropráctico y otra persona de área debido a problemas en su cuello durante los ultimos 12 meses?</label>
                        <div className="flex justify-center items-center mr-10">
                            <label htmlFor="">No</label>
                            <input checked={form.pregunta7ProblemasCuelloNo} onChange={handleInputChangeChecked} type="checkbox" name="pregunta7ProblemasCuelloNo" id="" className=" mx-3"/>
                            <label htmlFor="">Si</label>
                            <input checked={form.pregunta7ProblemasCuelloSi} onChange={handleInputChangeChecked} type="checkbox" name="pregunta7ProblemasCuelloSi" id="" className=" mx-3"/>
                        </div>
                    </div>
                    <div className="flex justify-between my-2">
                        <label className=" font-normal w-[80%]" htmlFor="">8.- Ha tenido problemas en su cuello en algún momento durante los últimos 7 días?</label>
                        <div className="flex justify-center items-center mr-10">
                            <label htmlFor="">No</label>
                            <input checked={form.pregunta8ProblemasCuelloNo} onChange={handleInputChangeChecked} type="checkbox" name="pregunta8ProblemasCuelloNo" id="" className=" mx-3"/>
                            <label htmlFor="">Si</label>
                            <input checked={form.pregunta8ProblemasCuelloSi} onChange={handleInputChangeChecked} type="checkbox" name="pregunta8ProblemasCuelloSi" id="" className=" mx-3"/>
                        </div>
                    </div>
                    <div className="flex justify-between my-3">
                        <div className="flex items-center gap-1">
                            <span className="font-bold italic text-base mb-1">IMPRIMIR</span>
                            <div className="flex items-center gap-2">
                                <input
                                name="norden"
                                className="border rounded px-2 py-1 text-base w-24"
                                />
                
                                <button
                                type="button"
                                className="bg-blue-600 hover:bg-blue-700 text-white text-base px-4 py-2 rounded flex items-center gap-2"
                                >
                                <FontAwesomeIcon icon={faPrint} />
                                </button>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => {SubmitCuestionarioNordic(form,token,userlogued,handleClear,tabla)}}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white text-base px-6 py-2 rounded flex items-center gap-2"
                            >
                                <FontAwesomeIcon icon={faSave} /> Guardar/Actualizar
                            </button>
                            <button
                                type="button"
                                onClick={handleClear}
                                className="bg-yellow-400 hover:bg-yellow-500 text-white text-base px-6 py-2 rounded flex items-center gap-2"
                            >
                                <FontAwesomeIcon icon={faBroom} /> Limpiar
                            </button>
                        </div>
                    </div>
                </div>

                
                
            </div>
        </>
    )
}

export default Cuello