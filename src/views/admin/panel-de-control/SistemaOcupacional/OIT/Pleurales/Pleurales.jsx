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

    const NOPleurales = (set) => {
        set(prev => ({...prev,
            chk2Si: false,
            chk2No: true,
            chk2Si: false,
            chk2No: true,
            chkE1: false,
            chkE2: false,
            chkE3: false,
            chkE4: false,
            chkE5: false,
            chkE6: false,
            //a
            chk2_1: true,
            chk2_2: true,
            chk2_3: true,
            chk2_4: false,
            chk2_5: false,
            chk2_6: false,
            chk2_7: false,
            chk2_8: false,
            chk2_9: false,
            chk2_10: true,
            chk2_11: true,
            chk2_12: true,
            chk2_13: false,
            chk2_14: false,
            chk2_15: false,
            chk2_16: false,
            chk2_17: false,
            chk2_18: false,
            chk2_19: false,
            chk2_20: true,
            chk2_21: false,
            chk2_22: false,
            chk2_23: false,
            chk2_24: false,
            chk2_25: true,
            chk2_26: false,
            chk2_27: false,
            chk2_28: false,
            chk2_29: false,
            chk2_30: false,
            chk2_31: false,
            chk2_32: false,
            chk2_33: false,
            chk2_34: false,
            chk2_35: false,
            chk2_36: false,
            chk2_37: true,
            chk2_38: false,
            chk2_39: false,
            chk2_40: false,
            chk2_41: true,
            chk2_42: false,
            chk2_43: false,
            chk2_44: false,
            chk2_45: false,
            chk2_46: false,
            chk2_47: true,
            chk2_48: false,
            chk2_49: false,
            chk2_50: false,
            chk2_51: false,
            chk2_52: false,
            chk2_53: true,
            chk2_54: false,
            chk2_55: false,
            chk2_56: false,
            chk2_57: false,
            chk2_58: true,
            chk2_59: false,
            chk2_60: false,
            chk2_61: false,
            chk2_62: false,
            chk2_63: false,
            chk2_64: false,
            chk2_65: false,
            chk2_66: false,
            chk2_67: false,
            chk2_68: false,
            chk2_69: false,
        }))
    }
    
    return(
            <>
                <div className="w-auto">
                    <div className="flex  items-center gap-8">
                        <h2 className="font-bold text-[11px] pr-8">III. ANORMALIDADES PLEURALES (SI NO HAY ANORMALIDADES PASE A SIMBOLOS)</h2>
                        <div className="flex">
                            <input type="checkbox" name="chk2radio" className="mr-2" checked={form.chk2Si} onChange={() =>setForm(prev => ({...prev,chk2Si: true,chk2No: false,}))} id="chk2Si" />
                            <label htmlFor="" >SI</label>

                            <input type="checkbox" name="chk2radio" className="mr-2 ml-4" checked={form.chk2No} onChange={() =>NOPleurales(setForm)} id="chk2No" />
                            <label htmlFor="" >NO</label>
                        </div>
                    </div>
                    <h3>3.1 Placas Pleurales (0 = Ninguna, D = Hemitórax derecho, I = Hemitórax izquierda)</h3>
                    <div className=" grid grid-cols-1 md:flex md:flex-row gap-4 mt-4">
                        {/*Cuadros */}
                        <div className="flex flex-col  items-center justify-center border rounded-md p-3">
                            <p className=" text-[11px] text-[#212529] text-center font-semibold">Sitio</p>
                            <p className="text-[11px] mb-2 text-gray-600 text-center ">(Marque todas las zonas afectadas)</p>
                        </div>

                        <div className="flex flex-col  items-center justify-center border rounded-md p-3 ml-2">
                            <p className=" text-[11px] text-[#212529] font-semibold">Calcifiación</p>
                            <p className="text-[11px] mb-2 text-gray-600 ">(Marque)</p>
                        </div>

                        <div className="flex flex-col  items-center justify-center border rounded-md p-3 ml-2">
                            <p className=" text-[11px] font-semibold text-[#212529]">Extensión</p>
                            <p className="text-[11px] mb-2 text-gray-600">(Pared Torácica; combinada para placas de perfil y de frente)</p>

                            {/* Opciones */}
                            <div className="flex flex-col gap-y-2 gap-x-4 pl-2 font-semibold">
                                <div className="flex flex-row gap-2 ">
                                    <input disabled={form.chk2No} type="checkbox" name="chkE1" id="chkE1" checked={form.chkE1} onChange={handleInputChangeChecked} />
                                    <span>{"< 1/4 de la pared lateral de tórax"}</span>
                                </div>
                                <div className="flex flex-row gap-2">
                                    <input disabled={form.chk2No} type="checkbox" name="chkE2" id="chkE2" checked={form.chkE2} onChange={handleInputChangeChecked} />
                                    <span>{"Entre 1/4 y 1/2 de la pared lateral de tórax"}</span>
                                </div>
                                <div className="flex flex-row gap-2">
                                    <input  disabled={form.chk2No} type="checkbox" name="chkE3" id="chkE3" checked={form.chkE3} onChange={handleInputChangeChecked} />
                                    <span>{"> 1/2 de la pared lateral de tórax"}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col  items-center justify-center border rounded-md p-3 ml-2">
                            <p className=" text-[11px] font-semibold text-[#212529]">Ancho <span className="font-normal text-gray-600">(opcional)</span></p>
                            <p className="text-[11px] mb-2  text-gray-600">(Ancho minímo elegido: 3 mm)</p>

                            {/* Opciones */}
                            <div className="flex flex-col gap-y-2 gap-x-4 pl-2">
                                <div className="flex flex-row gap-2">
                                    <input disabled={form.chk2No} type="checkbox" name="chkE4" id="chkE4" checked={form.chkE4} onChange={handleInputChangeChecked} />
                                    <span className="font-semibold">{"De 3 a 5 mm"}</span>
                                </div>
                                <div className="flex flex-row gap-2">
                                    <input disabled={form.chk2No} type="checkbox" name="chkE5" id="chkE5" checked={form.chkE5} onChange={handleInputChangeChecked} />
                                    <span className="font-semibold">{"De 5 a 10 mm"}</span>
                                </div>
                                <div className="flex flex-row gap-2">
                                    <input disabled={form.chk2No} type="checkbox" name="chkE6" id="chkE6" checked={form.chkE6} onChange={handleInputChangeChecked} />
                                    <span className="font-semibold">{"Mayor a 10 mm"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Fila de checkboxes alineada con los cuadros superiores */}
                    <div className="flex flex-row w-auto mt-2 gap-2">
                        <div className="flex flex-col">
                            {/* Título */}
                            <span className="text-[11px] font-bold mb-1 uppercase">Pared torácica de perfil</span>

                            {/* Encabezado O D I */}
                            <div className="flex flex-row items-center gap-2 mb-1 ml-[170px] pl-2">
                            <span className="w-[35px] text-[11px] font-bold text-center ">O</span>
                            <span className="w-[35px] text-[11px] font-bold text-center">D</span>
                            <span className="w-[35px] text-[11px] font-bold text-center">I</span>
                            </div>

                            {/* Filas con checkboxes */}
                            {[{ label:"De Frente", codeO: "chk2_1", codeD: "chk2_4", codeI: "chk2_7"}, 
                            {label:"Diafragma", codeO: "chk2_2", codeD: "chk2_5", codeI: "chk2_8"}, 
                            {label:"Otro(s) Sitio(s)", codeO: "chk2_3", codeD: "chk2_6", codeI: "chk2_9"}, 
                            {label:"Obliteración del Ángulo Costofrénico", codeO:"chk2_37", codeD: "chk2_38", codeI: "chk2_39"}]
                            .map((item, idx) => (
                            <div key={idx} className="flex flex-row items-center gap-2 mb-1  font-semibold text-[11px]">
                                <span className="w-[170px] text-[11px]">{item.label}</span>

                                {/* Checkboxes sin letras al costado */}
                                <div className="w-[35px] flex justify-center ">
                                <input disabled={form.chk2No} type="checkbox" name={item.codeO} id={item.codeO} checked={form[item.codeO]} onChange={handleInputChangeChecked} /> 
                                <span className="ml-2">O</span>
                                </div>
                                <div className="w-[35px] flex justify-center ">
                                <input disabled={form.chk2No} type="checkbox" name={item.codeD} id={item.codeD} checked={form[item.codeD]} onChange={handleInputChangeChecked}/> 
                                <span className="ml-2">D</span>
                                </div>
                                <div className="w-[35px] flex justify-center ">
                                <input disabled={form.chk2No} type="checkbox" name={item.codeI} id={item.codeI} checked={form[item.codeI]} onChange={handleInputChangeChecked} /> 
                                <span className="ml-2">I</span>
                                </div>
                            </div>
                            ))}
                        </div>
                        <div className="flex flex-col divide-x">
                            
                            <div className="flex flex-row items-center gap-2 mb-1 ml-4 mt-8 pl-2">
                                <span className="w-[35px] text-[11px] font-bold text-center">O</span>
                                <span className="w-[35px] text-[11px] font-bold text-center">D</span>
                                <span className="w-[35px] text-[11px] font-bold text-center">I</span>
                            </div>
                            {/* Filas con checkboxes */}
                            {[{label:"", codeO:"chk2_10", codeD: "chk2_13", codeI: "chk2_16"}
                            ,{label:"", codeO:"chk2_11", codeD: "chk2_14", codeI: "chk2_17"},
                            {label:"", codeO:"chk2_12", codeD: "chk2_15", codeI: "chk2_18"}]
                            .map((item, idx) => (
                            <div key={idx} className="flex flex-row items-center gap-2 mb-1  font-semibold text-[11px] ">
                                <span className="ml-4 text-[11px]">{item.label}</span>

                                {/* Checkboxes sin letras al costado */}
                                <div className="w-[35px] flex justify-center ">
                                <input disabled={form.chk2No} type="checkbox" name={item.codeO} id={item.codeO} checked={form[item.codeO]} onChange={handleInputChangeChecked}/> <span className="ml-2 ">O</span>
                                </div>
                                <div className="w-[35px] flex justify-center">
                                <input disabled={form.chk2No} type="checkbox" name={item.codeD} id={item.codeD} checked={form[item.codeD]} onChange={handleInputChangeChecked}/> <span className="ml-2">D</span>
                                </div>
                                <div className="w-[35px] flex justify-center">
                                <input disabled={form.chk2No} type="checkbox" name={item.codeI} id={item.codeI} checked={form[item.codeI]} onChange={handleInputChangeChecked}/> <span className="ml-2">I</span>
                                </div>
                            </div>
                            ))}
                        </div>
                        <div className="flex flex-row gap-6 pt-4 ml-8 border-l pl-6">
                            {/* Grupo 1 */}
                            <div className="flex flex-col items-center gap-1">
                                <div className="flex gap-2 ">
                                {[{label:"O", code: "chk2_20"}, 
                                {label:"D", code: "chk2_22"}]
                                .map((item, idx) => (
                                    <label key={idx} className="flex flex-row items-center w-[25px]">
                                    <input disabled={form.chk2No} type="checkbox" name={item.code} id={item.code} checked={form[item.code]} onChange={handleInputChangeChecked}/>
                                    <span className="text-[11px] ml-2 font-semibold">{item.label}</span>
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
                                    <span className="text-[11px] ml-2 font-semibold">{item.label}</span>
                                    </label>
                                ))}
                                </div>
                            </div>
                            <div className="w-[1px] bg-gray-200 h-[50px]"/>
                            {/* Grupo 2 */}
                            <div className="flex flex-col items-center gap-1">
                                <div className="flex gap-2">
                                {[{label:"O", code: "chk2_25"}
                                , {label:"I", code: "chk2_27"}]
                                .map((item, idx) => (
                                    <label key={idx} className="flex flex-row items-center w-[25px]">
                                    <input disabled={form.chk2No} type="checkbox" name={item.code} id={item.code} checked={form[item.code]} onChange={handleInputChangeChecked}/>
                                    <span className="text-[11px] ml-2 font-semibold">{item.label}</span>
                                    </label>
                                ))}
                                </div>
                                <div className="flex gap-2">
                                {[{label:"1", code: "chk2_24"}
                                , {label:"2", code: "chk2_26"}
                                , {label:"3", code: "chk2_28"}]
                                .map((item, idx) => (
                                    <label key={idx} className="flex flex-row items-center w-[25px]">
                                    <input disabled={form.chk2No} type="checkbox" name={item.code} id={item.code} checked={form[item.code]} onChange={handleInputChangeChecked}/>
                                    <span className="text-[11px] ml-2 font-semibold">{item.label}</span>
                                    </label>
                                ))}
                                </div>
                            </div>
                            <div className="w-[1px] bg-gray-200 h-[50px]"/>
                            {/* Grupo 3 */}
                            <div className="flex flex-col items-center gap-1">
                                <div className="flex gap-2">
                                {[{label:"D", code: "chk2_30"}].map((item, idx) => (
                                    <label key={idx} className="flex flex-row items-center w-[25px]">
                                    <input disabled={form.chk2No} type="checkbox" name={item.code} id={item.code} checked={form[item.code]} onChange={handleInputChangeChecked}/>
                                    <span className="text-[11px] ml-2 font-semibold">{item.label}</span>
                                    </label>
                                ))}
                                </div>
                                <div className="flex gap-2">
                                {[{label:"A", code: "chk2_29"}
                                , {label:"B", code: "chk2_31"}
                                , {label:"C", code: "chk2_32"}]
                                .map((item, idx) => (
                                    <label key={idx} className="flex flex-row items-center w-[25px]">
                                    <input disabled={form.chk2No} type="checkbox" name={item.code} id={item.code} checked={form[item.code]} onChange={handleInputChangeChecked}/>
                                    <span className="text-[11px] ml-2 font-semibold">{item.label}</span>
                                    </label>
                                ))}
                                </div>
                            </div>
                            <div className="w-[1px] bg-gray-200 h-[50px]"/>
                            {/* Grupo 4 */}
                            <div className="flex flex-col items-center gap-1">
                                <div className="flex gap-2">
                                {[{label:"I", code: "chk2_34"}].map((item, idx) => (
                                    <label key={idx} className="flex flex-row items-center w-[25px]">
                                    <input disabled={form.chk2No} type="checkbox" name={item.code} id={item.code} checked={form[item.code]} onChange={handleInputChangeChecked} />
                                    <span className="text-[11px] ml-2 font-semibold">{item.label}</span>
                                    </label>
                                ))}
                                </div>
                                <div className="flex gap-2">
                                {[{label:"A", code: "chk2_33"}
                                , {label:"B", code: "chk2_35"}
                                , {label:"C", code: "chk2_36"}].map((item, idx) => (
                                    <label key={idx} className="flex flex-row items-center w-[25px]">
                                    <input disabled={form.chk2No} type="checkbox" name={item.code} id={item.code} checked={form[item.code]} onChange={handleInputChangeChecked}/>
                                    <span className="text-[11px] ml-2 font-semibold">{item.label}</span>
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