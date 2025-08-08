const Engrosamiento = ({form,setForm}) => {

    const handleInputChangeChecked = (e) => {
        const { name, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: checked
        }));
    }

    const handleInputChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value.toUpperCase() });
    };

    const handleCheckboxChange = (e) => {
        const { checked, value } = e.target;

        setForm((prev) => {
            let nuevoTexto = prev.txtSComentarios || "";

            if (checked) {
            // Agrega con separador " + " si ya hay algo escrito
            nuevoTexto = nuevoTexto
                ? `${nuevoTexto} ${value}`
                : value;
            }
            return { ...prev, txtSComentarios: nuevoTexto };
        });
    };

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
                            {[{label:"De Perfil", codeO:"chk2_40", codeD: "chk2_42", codeI: "chk2_44"}
                            , {label:"De Frente", codeO:"chk2_41", codeD: "chk2_43", codeI: "chk2_45"}]
                            .map((item, idx) => (
                            <div key={idx} className="flex flex-row items-center gap-2 mb-1">
                                <span className="w-[40%] text-lg">{item.label}</span>

                                {/* Checkboxes sin letras al costado */}
                                <div className="w-[25px] flex justify-center">
                                <input disabled={form.chk2No} type="checkbox" name={item.codeO} id={item.codeO} checked={form[item.codeO]} onChange={handleInputChangeChecked}/> <span className="ml-1">O</span>
                                </div>
                                <div className="w-[25px] flex justify-center">
                                <input disabled={form.chk2No} type="checkbox" name={item.codeD} id={item.codeD} checked={form[item.codeD]} onChange={handleInputChangeChecked}/> <span className="ml-1">D</span>
                                </div>
                                <div className="w-[25px] flex justify-center">
                                <input disabled={form.chk2No} type="checkbox" name={item.codeI} id={item.codeI} checked={form[item.codeI]} onChange={handleInputChangeChecked}/> <span className="ml-1">I</span>
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
                            {[{label:"",codeO:"chk2_46", codeD: "chk2_48", codeI: "chk2_50"}
                            , {label:"",codeO:"chk2_47", codeD: "chk2_49", codeI: "chk2_51"}]
                            .map((item, idx) => (
                            <div key={idx} className="flex flex-row items-center gap-2 mb-1">
                                <span className="w-[30%] text-sm">{item.label}</span>

                                {/* Checkboxes sin letras al costado */}
                                <div className="w-[25px] flex justify-center">
                                <input disabled={form.chk2No} type="checkbox" name={item.codeO} id={item.codeO} checked={form[item.codeO]} onChange={handleInputChangeChecked}/> <span className="ml-1">O</span>
                                </div>
                                <div className="w-[25px] flex justify-center">
                                <input disabled={form.chk2No} type="checkbox" name={item.codeD} id={item.codeD} checked={form[item.codeD]} onChange={handleInputChangeChecked}/> <span className="ml-1">D</span>
                                </div>
                                <div className="w-[25px] flex justify-center">
                                <input disabled={form.chk2No} type="checkbox" name={item.codeI} id={item.codeI} checked={form[item.codeI]} onChange={handleInputChangeChecked}/> <span className="ml-1">I</span>
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
                                    {[{label:"O", code: "chk2_53"}, {label:"D", code: "chk2_55"}]
                                    .map((item, idx) => (
                                        <label key={idx} className="flex flex-row items-center w-[25px]">
                                        <input disabled={form.chk2No} type="checkbox" name={item.code} id={item.code} checked={form[item.code]} onChange={handleInputChangeChecked}/>
                                        <span className="text-lg ml-1 font-normal">{item.label}</span>
                                        </label>
                                    ))}
                                    </div>
                                    <div className="flex gap-2">
                                    {[{label:"1", code: "chk2_52"}, {label:"2", code: "chk2_54"}, {label:"3", code: "chk2_56"}]
                                    .map((item, idx) => (
                                        <label key={idx} className="flex items-center w-[25px]">
                                        <input disabled={form.chk2No} type="checkbox" name={item.code} id={item.code} checked={form[item.code]} onChange={handleInputChangeChecked}/>
                                        <span className="text-lg ml-1 font-normal">{item.label}</span>
                                        </label>
                                    ))}
                                    </div>
                                </div>
                                <div className="flex flex-col items-center gap-1">
                                    <div className="flex gap-2">
                                    {[{label: "O", code: "chk2_58"}, {label:"I", code: "chk2_60"}]
                                    .map((item, idx) => (
                                        <label key={idx} className="flex  items-center w-[25px]">
                                        <input disabled={form.chk2No} type="checkbox" name={item.code} id={item.code} checked={form[item.code]} onChange={handleInputChangeChecked}/>
                                        <span className="text-lg ml-1 font-normal">{item.label}</span>
                                        </label>
                                    ))}
                                    </div>
                                    <div className="flex gap-2">
                                    {[{label:"1", code: "chk2_57"}
                                    , {label:"2", code: "chk2_59"}
                                    , {label:"3", code: "chk2_61"}]
                                    .map((item, idx) => (
                                        <label key={idx} className="flex  items-center w-[25px]">
                                        <input disabled={form.chk2No} type="checkbox" name={item.code} id={item.code} checked={form[item.code]} onChange={handleInputChangeChecked}/>
                                        <span className="text-lg ml-1 font-normal">{item.label}</span>
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
                                        {[{label:"D", code: "chk2_63"}].map((item, idx) => (
                                            <label key={idx} className="flex flex-row items-center w-[25px]">
                                            <input disabled={form.chk2No} type="checkbox" name={item.code} id={item.code} checked={form[item.code]} onChange={handleInputChangeChecked}/>
                                            <span className="text-lg ml-1 font-normal">{item.label}</span>
                                            </label>
                                        ))}
                                        </div>
                                        <div className="flex gap-2">
                                        {[{label:"A", code: "chk2_62"}
                                        , {label:"B", code: "chk2_64"}
                                        , {label:"C", code: "chk2_65"}]
                                        .map((item, idx) => (
                                            <label key={idx} className="flex items-center w-[25px]">
                                            <input disabled={form.chk2No} type="checkbox" name={item.code} id={item.code} checked={form[item.code]} onChange={handleInputChangeChecked}/>
                                            <span className="text-lg ml-1 font-normal">{item.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex flex-col items-center gap-1">
                                    <div className="flex gap-2">
                                    {[{label:"I", code: "chk2_67"}]
                                    .map((item, idx) => (
                                        <label key={idx} className="flex flex-row items-center w-[25px]">
                                        <input disabled={form.chk2No} type="checkbox" name={item.code} id={item.code} checked={form[item.code]} onChange={handleInputChangeChecked}/>
                                        <span className="text-lg ml-1 font-normal">{item.label}</span>
                                        </label>
                                    ))}
                                    </div>
                                    <div className="flex gap-2">
                                    {[{label:"A", code: "chk2_66"}
                                    , {label:"B", code: "chk2_68"}
                                    , {label:"C", code: "chk2_69"}]
                                    .map((item, idx) => (
                                        <label key={idx} className="flex items-center w-[25px]">
                                        <input disabled={form.chk2No} type="checkbox" name={item.code} id={item.code} checked={form[item.code]} onChange={handleInputChangeChecked}/>
                                        <span className="text-lg ml-1 font-normal">{item.label}</span>
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
                        <input type="checkbox" checked={form.chk3Si} onChange={() =>setForm(prev => ({...prev,chk3Si: true,chk3No: false,}))} name="chk3Radio" id="chk3Si" />
                        <label htmlFor="">SI</label>

                        <input type="checkbox" checked={form.chk3No} onChange={() =>setForm(prev => ({...prev,chk3Si: false,chk3No: true,}))} name="chk3Radio" id="chk3No" />
                        <label htmlFor="">NO</label>
                    </div>
                </div>
                <p>(Rodee con un circulo la respuesta adecuada; si rodea od, escriba a continuación un COMENTARIO)</p>
                <div className="flex flex-wrap gap-2 my-4">
                    {[
                        [{ label: 'aa', code: 'chk_28' }, { label: 'fr', code: 'chk_29' }],
                        [{ label: 'at', code: 'chk_01' }, { label: 'hi', code: 'chk_14' }],
                        [{ label: 'ax', code: 'chk_02' }, { label: 'ho', code: 'chk_15' }],
                        [{ label: 'bu', code: 'chk_03' }, { label: 'id', code: 'chk_16' }],
                        [{ label: 'ca', code: 'chk_04' }, { label: 'ih', code: 'chk_17' }],
                        [{ label: 'cg', code: 'chk_05' }, { label: 'kl', code: 'chk_18' }],
                        [{ label: 'cn', code: 'chk_06' }, { label: 'me', code: 'chk_19' }],
                        [{ label: 'co', code: 'chk_07' }, { label: 'pa', code: 'chk_20' }],
                        [{ label: 'cp', code: 'chk_08' }, { label: 'pb', code: 'chk_21' }],
                        [{ label: 'cv', code: 'chk_09' }, { label: 'pi', code: 'chk_22' }],
                        [{ label: 'di', code: 'chk_10' }, { label: 'px', code: 'chk_23' }],
                        [{ label: 'ef', code: 'chk_11' }, { label: 'ra', code: 'chk_24' }],
                        [{ label: 'em', code: 'chk_12' }, { label: 'rp', code: 'chk_25' }],
                        [{ label: 'es', code: 'chk_13' }, { label: 'tb', code: 'chk_26' }],
                        [{ label: 'OD', code: 'chk_27' }]
                    ].map((group, idx) => (
                        <div key={idx} className="flex flex-col w-16">
                        {group.map((item, subIdx) => (
                            <label key={subIdx} className="flex items-center gap-1">
                            <input disabled={form.chk3No} type="checkbox" className="shrink-0" name={item.code} id={item.code} checked={form[item.code]} onChange={handleInputChangeChecked}/>
                            <span className="text-xs">{item.label}</span>
                            </label>
                        ))}
                        </div>
                    ))}
                </div>
                <div className="flex w-full p-2 mx-2 gap-1 justify-center items-start">
                    <label htmlFor="">COMENTARIOS</label>
                    <div className="flex flex-col w-full">
                        <input type="text" className="w-full border rounded px-2 py-1 mx-4" name="txtSComentarios" id="txtSComentarios" value={form.txtSComentarios} onChange={handleInputChange} />
                        <div className="flex justify-start items-center px-2 py-1 mx-4 mt-2 gap-2">
                            <input type="checkbox" name="" onChange={handleCheckboxChange} value="TRAMA BRONCOVASCULAR ACENTUADA EN ACP" id=""  />
                            <label htmlFor="">TRAMA BRONCOVASCULAR ACENTUADA EN ACP</label>
                            <input type="checkbox" name=""  value="EVALUACION ANUAL" onChange={handleCheckboxChange} className="ml-8" id="" />
                            <label htmlFor="">EVALUACION ANUAL</label>
                        </div>
                    </div>
                    
                </div>
                <div className="w-full h-[1px] bg-gray-300 my-4" />
                <div className="flex p-2 gap-1 items-center">
                    <label htmlFor="">Medico: </label>
                    <input type="text" disabled value={form.doctor} className="border rounded px-2 py-1 mx-4 w-[22%]" />
                </div>
            </div>   
        </>
    )
}

export default Engrosamiento