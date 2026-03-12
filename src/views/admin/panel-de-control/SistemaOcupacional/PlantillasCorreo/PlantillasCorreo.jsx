import { useEffect, useState } from "react";
import { useForm } from "../../../../hooks/useForm";
import { useSessionData } from "../../../../hooks/useSessionData";
import { getToday } from "../../../../utils/helpers";
import { GetListEmpresaContrata, SubmitEmpresaContrata } from "./controllerPlantillasCorreo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";

export default function PlantillasCorreo({ ContrataMulti, EmpresasMulti }) {
    const today = getToday();
    const { token, userlogued, selectedSede, datosFooter, userName } = useSessionData();

    const initialFormState = {
        idRelacionEmpresaContrata: null,
        razonEmpresa: "",
        rucEmpresa: "",

        razonContrata: "",
        rucContrata: "",
    };

    const {
        form,
        setForm,
        handleChange,
        handleChangeNumberDecimals,
        handleChangeSimple,
        handleRadioButtonBoolean,
        handleClear,
        handleClearnotO,
        handlePrintDefault,
    } = useForm(initialFormState);

    const [empresaContrataList, setEmpresaContrataList] = useState([])

    const [searchEmpresa, setSearchEmpresa] = useState(form.razonEmpresa);
    const [filteredEmpresas, setFilteredEmpresas] = useState([]);

    // — Autocomplete Contrata —
    const [searchContrata, setSearchContrata] = useState(form.razonContrata);
    const [filteredContratas, setFilteredContratas] = useState([]);

    const handleContrataSearch = e => {
        const v = e.target.value.toUpperCase();
        if (v === "") {
            setForm(d => ({ ...d, razonContrata: "" }));
        }
        setForm(d => ({ ...d, razonContrata: v }))
        setSearchContrata(v);
        setFilteredContratas(
            v
                ? ContrataMulti.filter(c =>
                    c.mensaje.toLowerCase().includes(v.toLowerCase())
                )
                : []
        );
    };

    const handleSelectContrata = c => {
        setSearchContrata(c.mensaje);
        setForm(d => ({ ...d, razonContrata: c.mensaje, rucContrata: c.rucEmpresa }));
        setFilteredContratas([]);
    };

    const handleEmpresaSearch = e => {
        const v = e.target.value.toUpperCase();

        if (v === "") {
            setForm(d => ({ ...d, razonEmpresa: "" }));
        }
        setForm(d => ({ ...d, razonEmpresa: v }))
        setSearchEmpresa(v);
        setFilteredEmpresas(
            v
                ? EmpresasMulti.filter(emp =>
                    emp.mensaje.toLowerCase().includes(v.toLowerCase())
                )
                : []
        );
    };

    const handleSelectEmpresa = emp => {
        setSearchEmpresa(emp.mensaje);
        setForm(d => ({ ...d, razonEmpresa: emp.mensaje, rucEmpresa: emp.rucEmpresa }));
        setFilteredEmpresas([]);
        // mueve el foco al siguiente campo Contrata
        document.getElementById('razonContrata')?.focus();
    };

    const handleSave = async () => {
        await SubmitEmpresaContrata(form, token, userlogued, handleClear);
    };

    const obtenerRelacionesEmpresaContrata = async () => {
        await GetListEmpresaContrata(setEmpresaContrataList, token);
    }

    // useEffect(() => { obtenerRelacionesEmpresaContrata() }, [])

    return (
        <div className="space-y-3 px-4 max-w-[90%] xl:max-w-[80%] mx-auto">
            <div>

            </div>
            <div className="flex items-center space-x-2 mb-1">
                <label htmlFor="razonEmpresa" className="block w-32">
                    Empresa:
                </label>
                <div className="relative flex-grow flex items-center">
                    <input autoComplete="off"
                        id="razonEmpresa"
                        name="razonEmpresa"
                        type="text"
                        value={searchEmpresa}
                        placeholder="Escribe para buscar empresa..."
                        // disabled={habilitar}
                        onChange={handleEmpresaSearch}
                        className={`border pointer border-gray-300 px-3 py-1 mb-1 rounded-md focus:outline-none w-full `}
                        onKeyDown={e => {
                            if (e.key === 'Enter' && filteredEmpresas.length > 0) {
                                e.preventDefault();
                                handleSelectEmpresa(filteredEmpresas[0]);
                            }
                        }}
                        onFocus={() => {
                            if (searchEmpresa) {
                                setFilteredEmpresas(
                                    EmpresasMulti.filter(emp =>
                                        emp.mensaje.toLowerCase().includes(searchEmpresa.toLowerCase())
                                    )
                                );
                            }
                        }}
                        onBlur={() => setTimeout(() => setFilteredEmpresas([]), 100)}
                    />
                    {searchEmpresa && filteredEmpresas.length > 0 && (
                        <ul className="absolute inset-x-0 top-full bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto z-10">
                            {filteredEmpresas.map(emp => (
                                <li
                                    key={emp.id}
                                    className="cursor-pointer px-3 py-2 hover:bg-gray-100"
                                    onMouseDown={() => handleSelectEmpresa(emp)}
                                >
                                    {emp.mensaje}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            <div className="flex items-center space-x-2 mb-1">
                <label htmlFor="razonContrata" className="block w-32">Contrata:</label>
                <div className="relative flex-grow flex items-center">
                    <input autoComplete="off"
                        id="razonContrata"
                        name="razonContrata"
                        type="text"
                        value={searchContrata}
                        placeholder="Escribe para buscar contrata..."
                        // disabled={habilitar}
                        onChange={handleContrataSearch}
                        className={`border pointer border-gray-300 px-3 py-1 mb-1 rounded-md focus:outline-none w-full `}
                        onKeyDown={e => {
                            if (e.key === 'Enter' && filteredContratas.length > 0) {
                                e.preventDefault();
                                handleSelectContrata(filteredContratas[0]);
                            }
                        }}
                        onFocus={() => {
                            if (searchContrata) {
                                setFilteredContratas(
                                    ContrataMulti.filter(c =>
                                        c.mensaje.toLowerCase().includes(searchContrata.toLowerCase())
                                    )
                                );
                            }
                        }}
                        onBlur={() => setTimeout(() => setFilteredContratas([]), 100)}
                    />
                    {searchContrata && filteredContratas.length > 0 && (
                        <ul className="absolute inset-x-0 top-full bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto z-10">
                            {filteredContratas.map(c => (
                                <li
                                    key={c.id}
                                    className="cursor-pointer px-3 py-2 hover:bg-gray-100"
                                    onMouseDown={() => handleSelectContrata(c)}
                                >
                                    {c.mensaje}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            <button
                type="button"
                onClick={obtenerRelacionesEmpresaContrata}
                className="
                bg-emerald-600 hover:bg-emerald-700
                text-white text-base px-6 py-2 rounded
                flex items-center gap-2
                transition-all duration-150 ease-out
                hover:shadow-lg
                active:scale-95 active:shadow-inner"
            >
                <FontAwesomeIcon icon={faSave} /> Guardar/Actualizar
            </button>
            <div>

            </div>
        </div>
    )
}
