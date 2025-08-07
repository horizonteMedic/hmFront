const Pleurales = ({form,setForm}) => {

    const handleInputChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value.toUpperCase() });
    };

    const handleInputChangeChecked = (e) => {
        const { name, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: checked
        }));
    };
    console.log(form)
    return(
            <>
                <div className="w-auto">
                    <div className="flex justify-between items-center">
                        <h2 className="font-bold">III. ANORMALIDADES PLEURALES (SI NO HAY ANORMALIDADES PASE A SIMBOLOS)</h2>
                        <div className="flex">
                            <input type="radio" name="chk2radio" checked={form.chk2Si} onChange={() => {setForm(prev => ({...prev, chk2Si:true, chk2No:false}))}} id="chk2Si" />
                            <label htmlFor="">SI</label>

                            <input type="radio" name="chk2radio" checked={form.chk2No} onChange={() => {setForm(prev => ({...prev, chk2Si:false, chk2No:true}))}} id="chk2No" />
                            <label htmlFor="">NO</label>
                        </div>
                    </div>
                    <h3>3.1 Placas Pleurales (0 = Ninguna, D = Hemitórax derecho, I = Hemitórax izquierda)</h3>
                    <div className="flex flex-row w-auto mt-4">
                        {/*Cuadros */}
                        <div className="flex flex-col w-auto items-start justify-center border rounded-md p-3">
                            <p className=" text-xl text-gray-600">Sitio</p>
                            <p className="text-xl mb-2 text-gray-600">(Marque todas las zonas afectadas)</p>
                        </div>

                        <div className="flex flex-col w-auto items-start justify-center border rounded-md p-3 ml-2">
                            <p className=" text-xl text-gray-600">Calcifiación</p>
                            <p className="text-xl mb-2 text-gray-600">(Marque)</p>
                        </div>

                        <div className="flex flex-col w-auto items-center justify-center border rounded-md p-3 ml-2">
                            <p className=" text-xl font-bold text-gray-600">Extensión</p>
                            <p className="text-xl mb-2 font-bold text-gray-600">(Pared Torácica; combinada para placas de perfil y de frente)</p>

                            {/* Opciones */}
                            <div className="flex flex-col gap-y-2 gap-x-4 pl-2">
                                <div className="flex flex-row">
                                    <input disabled={form.chk2No} type="checkbox" name="chkE1" id="chkE1" checked={form.chkE1} onChange={handleInputChangeChecked} />
                                    <span>{" < 1/4 de la pared lateral de tórax"}</span>
                                </div>
                                <div className="flex flex-row">
                                    <input disabled={form.chk2No} type="checkbox" name="chkE2" id="chkE2" checked={form.chkE2} onChange={handleInputChangeChecked} />
                                    <span>{" Entre 1/4 y 1/2 de la pared lateral de tórax"}</span>
                                </div>
                                <div className="flex flex-row">
                                    <input  disabled={form.chk2No} type="checkbox" name="chkE3" id="chkE3" checked={form.chkE3} onChange={handleInputChangeChecked} />
                                    <span>{" > 1/2 de la pared lateral de tórax"}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col w-auto items-center justify-center border rounded-md p-3 ml-2">
                            <p className=" text-xl font-bold text-gray-600">Ancho (opcional)</p>
                            <p className="text-xl mb-2 font-bold text-gray-600">(Ancho minímo elegido: 3 mm)</p>

                            {/* Opciones */}
                            <div className="flex flex-col gap-y-2 gap-x-4 pl-2">
                                <div className="flex flex-row">
                                    <input disabled={form.chk2No} type="checkbox" name="chkE4" id="chkE4" checked={form.chkE4} onChange={handleInputChangeChecked} />
                                    <span>{" De 3 a 5 mm"}</span>
                                </div>
                                <div className="flex flex-row">
                                    <input disabled={form.chk2No} type="checkbox" name="chkE5" id="chkE5" checked={form.chkE5} onChange={handleInputChangeChecked} />
                                    <span>{" De 5 a 10 mm"}</span>
                                </div>
                                <div className="flex flex-row">
                                    <input disabled={form.chk2No} type="checkbox" name="chkE6" id="chkE6" checked={form.chkE6} onChange={handleInputChangeChecked} />
                                    <span>{" Mayor a 10 mm"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Fila de checkboxes alineada con los cuadros superiores */}
                    <div className="flex flex-row w-auto mt-2 gap-2">
                        <div className="flex flex-col">
                            {/* Título */}
                            <span className="text-sm font-semibold mb-1">Pared torácica de perfil</span>

                            {/* Encabezado O D I */}
                            <div className="flex flex-row items-center gap-2 mb-1 ml-[170px]">
                            <span className="w-[25px] text-sm font-bold text-center">O</span>
                            <span className="w-[25px] text-sm font-bold text-center">D</span>
                            <span className="w-[25px] text-sm font-bold text-center">I</span>
                            </div>

                            {/* Filas con checkboxes */}
                            {[{ label:"De Frente", codeO: "chk2_1", codeD: "chk2_4", codeI: "chk2_7"}, 
                            {label:"Diafragma", codeO: "chk2_2", codeD: "chk2_5", codeI: "chk2_8"}, 
                            {label:"Otro(s) Sitio(s)", codeO: "chk2_3", codeD: "chk2_6", codeI: "chk2_9"}, 
                            {label:"Obliteración del Ángulo Costofrénico", codeO:"chk2_37", codeD: "chk2_38", codeI: "chk2_39"}]
                            .map((item, idx) => (
                            <div key={idx} className="flex flex-row items-center gap-2 mb-1">
                                <span className="w-[170px] text-sm">{item.label}</span>

                                {/* Checkboxes sin letras al costado */}
                                <div className="w-[25px] flex justify-center">
                                <input disabled={form.chk2No} type="checkbox" name={item.codeO} id={item.codeO} checked={form[item.codeO]} onChange={handleInputChangeChecked} /> 
                                <span className="ml-1">O</span>
                                </div>
                                <div className="w-[25px] flex justify-center">
                                <input disabled={form.chk2No} type="checkbox" name={item.codeD} id={item.codeD} checked={form[item.codeD]} onChange={handleInputChangeChecked}/> 
                                <span className="ml-1">D</span>
                                </div>
                                <div className="w-[25px] flex justify-center">
                                <input disabled={form.chk2No} type="checkbox" name={item.codeI} id={item.codeI} checked={form[item.codeI]} onChange={handleInputChangeChecked} /> 
                                <span className="ml-1">I</span>
                                </div>
                            </div>
                            ))}
                        </div>
                        <div className="flex flex-col">
                            
                            <div className="flex flex-row items-center gap-2 mb-1 ml-4 mt-4">
                                <span className="w-[25px] text-sm font-bold text-center">O</span>
                                <span className="w-[25px] text-sm font-bold text-center">D</span>
                                <span className="w-[25px] text-sm font-bold text-center">I</span>
                            </div>
                            {/* Filas con checkboxes */}
                            {[{label:"", codeO:"chk2_10", codeD: "chk2_13", codeI: "chk2_16"}
                            ,{label:"", codeO:"chk2_11", codeD: "chk2_14", codeI: "chk2_17"},
                            {label:"", codeO:"chk2_12", codeD: "chk2_15", codeI: "chk2_18"}]
                            .map((item, idx) => (
                            <div key={idx} className="flex flex-row items-center gap-2 mb-1 ">
                                <span className="ml-4 text-sm">{item.label}</span>

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
                        <div className="flex flex-row gap-6 pt-4 ml-8">
                            {/* Grupo 1 */}
                            <div className="flex flex-col items-center gap-1">
                                <div className="flex gap-2 ">
                                {[{label:"O", code: "chk2_20"}, 
                                {label:"D", code: "chk2_22"}]
                                .map((item, idx) => (
                                    <label key={idx} className="flex flex-row items-center w-[25px]">
                                    <input disabled={form.chk2No} type="checkbox" name={item.code} id={item.code} checked={form[item.code]} onChange={handleInputChangeChecked}/>
                                    <span className="text-lg ml-1 font-normal">{item.label}</span>
                                    </label>
                                ))}
                                </div>
                                <div className="flex gap-2">
                                {[{label:"1", code: "chk2_19"}
                                , {label:"2", code: "chk2_21"}
                                , {label:"3", code: "chk2_23"}]
                                .map((item, idx) => (
                                    <label key={idx} className="flex items-center w-[25px]">
                                    <input disabled={form.chk2No} type="checkbox" name={item.code} id={item.code} checked={form[item.code]} onChange={handleInputChangeChecked}/>
                                    <span className="text-lg ml-1 font-normal">{item.label}</span>
                                    </label>
                                ))}
                                </div>
                            </div>

                            {/* Grupo 2 */}
                            <div className="flex flex-col items-center gap-1">
                                <div className="flex gap-2">
                                {[{label:"O", code: "chk2_25"}
                                , {label:"I", code: "chk2_27"}]
                                .map((item, idx) => (
                                    <label key={idx} className="flex flex-row items-center w-[25px]">
                                    <input disabled={form.chk2No} type="checkbox" name={item.code} id={item.code} checked={form[item.code]} onChange={handleInputChangeChecked}/>
                                    <span className="text-lg ml-1 font-normal">{item.label}</span>
                                    </label>
                                ))}
                                </div>
                                <div className="flex gap-2">
                                {[{label:"1", code: "chk2_24"}
                                , {label:"2", code: "chk2_26"}
                                , {label:"3", code: "chk2_28"}]
                                .map((item, idx) => (
                                    <label key={idx} className="flex flex-col items-center w-[25px]">
                                    <input disabled={form.chk2No} type="checkbox" name={item.code} id={item.code} checked={form[item.code]} onChange={handleInputChangeChecked}/>
                                    <span className="text-xs">{item.label}</span>
                                    </label>
                                ))}
                                </div>
                            </div>

                            {/* Grupo 3 */}
                            <div className="flex flex-col items-center gap-1">
                                <div className="flex gap-2">
                                {[{label:"D", code: "chk2_30"}].map((item, idx) => (
                                    <label key={idx} className="flex flex-row items-center w-[25px]">
                                    <input disabled={form.chk2No} type="checkbox" name={item.code} id={item.code} checked={form[item.code]} onChange={handleInputChangeChecked}/>
                                    <span className="text-lg ml-1 font-normal">{item.label}</span>
                                    </label>
                                ))}
                                </div>
                                <div className="flex gap-2">
                                {[{label:"A", code: "chk2_29"}
                                , {label:"B", code: "chk2_31"}
                                , {label:"C", code: "chk2_32"}]
                                .map((item, idx) => (
                                    <label key={idx} className="flex flex-col items-center w-[25px]">
                                    <input disabled={form.chk2No} type="checkbox" name={item.code} id={item.code} checked={form[item.code]} onChange={handleInputChangeChecked}/>
                                    <span className="text-xs">{item.label}</span>
                                    </label>
                                ))}
                                </div>
                            </div>

                            {/* Grupo 4 */}
                            <div className="flex flex-col items-center gap-1">
                                <div className="flex gap-2">
                                {[{label:"I", code: "chk2_34"}].map((item, idx) => (
                                    <label key={idx} className="flex flex-row items-center w-[25px]">
                                    <input disabled={form.chk2No} type="checkbox" name={item.code} id={item.code} checked={form[item.code]} onChange={handleInputChangeChecked} />
                                    <span className="text-lg ml-1 font-normal">{item.label}</span>
                                    </label>
                                ))}
                                </div>
                                <div className="flex gap-2">
                                {[{label:"A", code: "chk2_33"}
                                , {label:"B", code: "chk2_35"}
                                , {label:"C", code: "chk2_36"}].map((item, idx) => (
                                    <label key={idx} className="flex flex-col items-center w-[25px]">
                                    <input disabled={form.chk2No} type="checkbox" name={item.code} id={item.code} checked={form[item.code]} onChange={handleInputChangeChecked}/>
                                    <span className="text-xs">{item.label}</span>
                                    </label>
                                ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>    
            </>
    )
}

export default Pleurales