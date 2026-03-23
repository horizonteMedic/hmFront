import { useEffect, useState } from "react";
import { useForm } from "../../../../hooks/useForm";
import { useSessionData } from "../../../../hooks/useSessionData";
import { GetListArchivos, GetListEmpresaContrata, getPlantillaPorEmpresaContrata, SubmitEmpresaContrata, SubmitPlantillaCorreo } from "./controllerPlantillasCorreo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faFile, faPlus, faRotateRight, faSave, faX } from "@fortawesome/free-solid-svg-icons";
import TablaTemplate from "../../../../components/templates/TablaTemplate";
import InputTextOneLine from "../../../../components/reusableComponents/InputTextOneLine";
import SectionFieldset from "../../../../components/reusableComponents/SectionFieldset";

export default function PlantillasCorreo({ ContrataMulti, EmpresasMulti }) {
    const { token, userlogued, selectedSede, datosFooter, userName } = useSessionData();

    const initialFormState = {
        idRelacionEmpresaContrata: null,
        razonEmpresa: "",
        rucEmpresa: "",

        razonContrata: "",
        rucContrata: "",
        datosEmpresaContrataBloqueado: false,

        plantillaConfig: []
    };

    const {
        form,
        setForm,
        handleClear,
    } = useForm(initialFormState);


    const [empresaContrataList, setEmpresaContrataList] = useState([])
    const [empresaContrataListFiltered, setEmpresaContrataListFiltered] = useState([])

    const [archivosList, setArchivosList] = useState([])

    const [searchEmpresa, setSearchEmpresa] = useState(form.razonEmpresa);
    const [filteredEmpresas, setFilteredEmpresas] = useState([]);

    // — Autocomplete Contrata —
    const [searchContrata, setSearchContrata] = useState(form.razonContrata);
    const [filteredContratas, setFilteredContratas] = useState([]);

    const handleClearNew = () => {
        handleClear();
        obtenerRelacionesEmpresaContrata();
        setSearchEmpresa("");
        setSearchContrata("");
    }

    const handleContrataSearch = (e) => {
        const v = e.target.value.toUpperCase();

        setSearchContrata(v);
        setForm(d => ({ ...d, razonContrata: v }));

        const filtered = v
            ? ContrataMulti.filter(c =>
                c.mensaje.toLowerCase().includes(v.toLowerCase())
            )
            : [];

        setFilteredContratas(filtered);

        const exactMatch = ContrataMulti.find(
            c => c.mensaje.toLowerCase() === v.toLowerCase()
        );

        if (!exactMatch) {
            setForm(d => ({ ...d, rucContrata: "" }));
        }
    };

    const handleSelectContrata = c => {
        setSearchContrata(c.mensaje);
        setForm(d => ({ ...d, razonContrata: c.mensaje, rucContrata: c.rucEmpresa }));
        setFilteredContratas([]);
    };

    const handleEmpresaSearch = (e) => {
        const v = e.target.value.toUpperCase();

        setSearchEmpresa(v);
        setForm(d => ({ ...d, razonEmpresa: v }));

        const filtered = v
            ? EmpresasMulti.filter(emp =>
                emp.mensaje.toLowerCase().includes(v.toLowerCase())
            )
            : [];

        setFilteredEmpresas(filtered);

        // verificar coincidencia exacta
        const exactMatch = EmpresasMulti.find(
            emp => emp.mensaje.toLowerCase() === v.toLowerCase()
        );

        if (!exactMatch) {
            setForm(d => ({ ...d, rucEmpresa: "" }));
        }
    };

    const handleSelectEmpresa = emp => {
        setSearchEmpresa(emp.mensaje);
        setForm(d => ({ ...d, razonEmpresa: emp.mensaje, rucEmpresa: emp.rucEmpresa }));
        setFilteredEmpresas([]);
        // mueve el foco al siguiente campo Contrata
        document.getElementById('razonContrata')?.focus();
    };

    const handleSave = async () => {
        await SubmitEmpresaContrata({ ...form, empresaContrataList }, token, userlogued, handleClearNew);
    };

    const handleSavePlantilla = async () => {
        await SubmitPlantillaCorreo(form, token, userlogued, handleClearNew);
    };

    const obtenerRelacionesEmpresaContrata = async () => {
        await GetListEmpresaContrata(setEmpresaContrataList, token);
    }
    const obtenerListArchivos = async () => {
        await GetListArchivos(setArchivosList, token);
    }

    const obtenerPlantilla = async (id) => {
        await getPlantillaPorEmpresaContrata(id, setForm, token);
    }

    useEffect(() => {
        obtenerRelacionesEmpresaContrata();
        obtenerListArchivos();
    }, [])

    useEffect(() => {
        const filtered = empresaContrataList
            .filter(emp => {
                const empresa = emp.razonEmpresa ?? "";
                const contrata = emp.razonContrata ?? "";

                return empresa.toUpperCase().includes(searchEmpresa.toUpperCase()) &&
                    contrata.toUpperCase().includes(searchContrata.toUpperCase());
            })
            .sort((a, b) => {
                const empresaA = (a.razonEmpresa ?? "").localeCompare(b.razonEmpresa ?? "");
                if (empresaA !== 0) return empresaA;

                return (a.razonContrata ?? "").localeCompare(b.razonContrata ?? "");
            });

        setEmpresaContrataListFiltered(filtered);
    }, [searchEmpresa, searchContrata, empresaContrataList])


    const columns = [
        {
            label: "ID",
            accessor: "id",
            width: "80px"
        },
        {
            label: "RUC Empresa",
            accessor: "rucEmpresa",
            width: "160px"
        },
        {
            label: "Razón Empresa",
            accessor: "razonEmpresa"
        },
        {
            label: "RUC Contrata",
            accessor: "rucContrata",
            render: (row) => row.rucContrata ?? "-"
        },
        {
            label: "Razón Contrata",
            accessor: "razonContrata",
            render: (row) => row.razonContrata ?? "-"
        }
    ];


    const addEmailForm = () => {
        setForm(prev => ({
            ...prev,
            plantillaConfig: [
                ...prev.plantillaConfig,
                {
                    id: null,
                    destino: "",
                    conCopia: "",
                    asunto: "{nombreExamen}//{nombrePaciente}//{empresa}//{fechaExamen}",
                    mensaje: `Estimado/a Dr./Dra.,\n
Se envían de manera adjunta {listaAdjuntos} del/la Sr./Sra.\n
-{nombrePaciente}\n
Colaborador/a de la empresa {empresa}.\n
Con fecha: {fechaExamen}\n

Saludos cordiales.\n
{nombreUsuario}`,
                    archivos: []
                }
            ]
        }));
    };

    const handleEmailChange = (index, e) => {
        const { name, value } = e.target;

        setForm(prev => {
            const newPlantillas = [...prev.plantillaConfig];

            newPlantillas[index] = {
                ...newPlantillas[index],
                [name]: value
            };

            return {
                ...prev,
                plantillaConfig: newPlantillas
            };
        });
    };

    const toggleArchivo = (formIndex, archivo) => {
        setForm(prev => {
            const newPlantillas = [...prev.plantillaConfig];
            const archivosActuales = newPlantillas[formIndex].archivos || [];

            const existe = archivosActuales.find(
                a => a.idTipoArchivo === archivo.idTipoArchivo
            );

            let nuevosArchivos;

            if (existe) {
                if (existe.idArchivoPlantilla) {
                    // toggle anulado
                    nuevosArchivos = archivosActuales.map(a =>
                        a.idTipoArchivo === archivo.idTipoArchivo
                            ? { ...a, anulado: !a.anulado }
                            : a
                    );
                } else {
                    // eliminar del array
                    nuevosArchivos = archivosActuales.filter(
                        a => a.idTipoArchivo !== archivo.idTipoArchivo
                    );
                }
            } else {
                // agregar
                nuevosArchivos = [
                    ...archivosActuales,
                    {
                        idTipoArchivo: archivo.idTipoArchivo,
                        nomenclatura: archivo.nomenclatura,
                        anulado: false
                    }
                ];
            }

            newPlantillas[formIndex] = {
                ...newPlantillas[formIndex],
                archivos: nuevosArchivos
            };

            return {
                ...prev,
                plantillaConfig: newPlantillas
            };
        });
    };

    const removeEmailForm = (index) => {
        setForm(prev => {
            const newPlantillas = [...prev.plantillaConfig];

            const item = newPlantillas[index];

            let updated;

            if (item.id) {
                // tiene id → solo marcar como anulado
                updated = newPlantillas.map((a, i) =>
                    i === index ? { ...a, anulado: true } : a
                );
            } else {
                // no tiene id → eliminar
                updated = newPlantillas.filter((_, i) => i !== index);
            }

            return {
                ...prev,
                plantillaConfig: updated
            };
        });
    };

    return (
        <div className="grid xl:grid-cols-2 gap-x-4 gap-y-3 max-w-[95%] mx-auto">
            <div className="space-y-6">
                <SectionFieldset className="space-y-3" legend="Datos Plantilla">
                    <div className="flex items-center space-x-2 mb-1">
                        <label htmlFor="razonEmpresa" className="block w-36">
                            Empresa:
                        </label>
                        <div className="relative flex-grow flex items-center">
                            <input autoComplete="off"
                                id="razonEmpresa"
                                name="razonEmpresa"
                                type="text"
                                value={searchEmpresa}
                                placeholder="Escribe para buscar empresa..."
                                disabled={form.datosEmpresaContrataBloqueado}
                                onChange={handleEmpresaSearch}
                                className={`border rounded px-2 py-1 w-full mb-1 focus:outline-none ${form.datosEmpresaContrataBloqueado ? "bg-gray-300" : ""
                                    }`}
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
                    <InputTextOneLine
                        label="RUC Empresa"
                        name="rucEmpresa"
                        value={form.rucEmpresa}
                        disabled
                    />
                    <div className="flex items-center space-x-2 mb-1 pt-8">
                        <label htmlFor="razonContrata" className="block w-36">Contrata:</label>
                        <div className="relative flex-grow flex items-center">
                            <input autoComplete="off"
                                id="razonContrata"
                                name="razonContrata"
                                type="text"
                                value={searchContrata}
                                placeholder="Escribe para buscar contrata..."
                                disabled={form.datosEmpresaContrataBloqueado}
                                onChange={handleContrataSearch}
                                className={`border rounded px-2 py-1 w-full mb-1 focus:outline-none ${form.datosEmpresaContrataBloqueado ? "bg-gray-300" : ""
                                    }`}
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
                    <InputTextOneLine
                        label="RUC Contrata"
                        name="rucContrata"
                        value={form.rucContrata}
                        disabled
                    />
                </SectionFieldset>
                {form.datosEmpresaContrataBloqueado ? (
                    <button
                        type="button"
                        onClick={() => {
                            setForm(prev => ({
                                ...prev,
                                datosEmpresaContrataBloqueado: false,
                                idRelacionEmpresaContrata: "",
                                razonEmpresa: "",
                                rucEmpresa: "",
                                razonContrata: "",
                                rucContrata: "",
                                plantillaConfig: []
                            }))
                            setSearchEmpresa("")
                            setSearchContrata("")
                        }}
                        className="
                        bg-amber-500 hover:bg-amber-600   ml-4
                        text-white text-base px-6 py-2 rounded
                        flex items-center gap-2
                        transition-all duration-150 ease-out
                        hover:shadow-lg
                        active:scale-95 active:shadow-inner"
                    >
                        <FontAwesomeIcon icon={faRotateRight} /> Reiniciar
                    </button>
                )
                    : (
                        <button
                            type="button"
                            onClick={handleSave}
                            className="
                        bg-emerald-600 hover:bg-emerald-700 ml-4
                        text-white text-base px-6 py-2 rounded
                        flex items-center gap-2
                        transition-all duration-150 ease-out
                        hover:shadow-lg
                        active:scale-95 active:shadow-inner"
                        >
                            <FontAwesomeIcon icon={faSave} /> Vincular
                        </button>)}
            </div>



            {/* PARTE DERECHA */}
            {form.datosEmpresaContrataBloqueado ? (
                <div className="flex flex-col gap-4 ">
                    <div className="flex justify-between">
                        <button
                            type="button"
                            onClick={addEmailForm}
                            className="self-start bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md  shadow"
                        >
                            <FontAwesomeIcon icon={faPlus} /> Nuevo Correo
                        </button>
                        <button
                            type="button"
                            onClick={handleSavePlantilla}
                            className="
                        bg-emerald-600 hover:bg-emerald-700
                        text-white text-base px-6 py-2 rounded
                        flex items-center gap-2
                        transition-all duration-150 ease-out
                        hover:shadow-lg
                        active:scale-95 active:shadow-inner"
                        >
                            <FontAwesomeIcon icon={faSave} /> Guardar Plantilla
                        </button>
                    </div>
                    {/* VARIABLES */}
                    <SectionFieldset legend="Indicaciones" collapsible defaultOpen={false}>
                        <p className="text-gray-600">
                            Utiliza las siguientes variables para personalizar el correo:
                        </p>
                        <div className="flex flex-wrap gap-2 text-gray-500">
                            {
                                ["empresa", "contrata", "nombrePaciente", "tipoExamen", "nombreExamen", "fechaExamen", "fechaCorreo", "listaAdjuntos", "nombreUsuario"].map((item, index) => (
                                    <span className="bg-white px-2 py-1 rounded" key={index}>
                                        {`{${item}}`}
                                    </span>
                                ))
                            }
                        </div>
                    </SectionFieldset>

                    <div className="flex flex-col gap-4 max-h-[520px] overflow-y-auto pr-2">
                        {form.plantillaConfig?.map((emailForm, index) => {
                            if (emailForm.anulado) return null;
                            return (
                                <div
                                    key={index}
                                    className="border rounded-lg shadow-sm bg-white "
                                >
                                    {/* HEADER */}
                                    <div className="flex justify-between items-center px-4 py-2 bg-primario rounded-t-lg">
                                        <span className=" font-semibold text-white">
                                            Correo
                                        </span>

                                        <button
                                            onClick={() => removeEmailForm(index)}
                                            className="text-gray-400 hover:text-red-500"
                                        >
                                            <FontAwesomeIcon icon={faX} />
                                        </button>

                                    </div>

                                    {/* BODY */}
                                    <div className="p-4 space-y-3">

                                        {/* DESTINO */}
                                        <div className="flex items-center gap-2">
                                            <span className="w-32 font-semibold text-gray-500">
                                                Destinatario
                                            </span>
                                            <input
                                                name="destino"
                                                value={emailForm.destino}
                                                onChange={(e) => handleEmailChange(index, e)}
                                                placeholder="correo@empresa.com , email@empresa.com"
                                                className="flex-1 border-b border-gray-300 focus:border-blue-500 outline-none "
                                            />
                                        </div>

                                        {/* CC */}
                                        <div className="flex items-center gap-2">
                                            <span className="w-32 font-semibold text-gray-500">
                                                Con Copia
                                            </span>

                                            <input
                                                name="conCopia"
                                                value={emailForm.conCopia}
                                                onChange={(e) => handleEmailChange(index, e)}
                                                placeholder="copia@empresa.com , segundacopia@empresa.com"
                                                className="flex-1 border-b border-gray-300 focus:border-blue-500 outline-none "
                                            />
                                        </div>

                                        {/* ASUNTO */}
                                        <div className="flex items-center gap-2  pb-1">
                                            <span className="w-32 font-semibold text-gray-500">
                                                Asunto
                                            </span>

                                            <input
                                                name="asunto"
                                                value={emailForm.asunto}
                                                onChange={(e) => handleEmailChange(index, e)}
                                                className="flex-1 outline-none border-b border-gray-300"
                                            />
                                        </div>

                                        {/* ARCHIVOS */}
                                        <div className="flex flex-wrap gap-2 pt-2">
                                            <span className="w-32 font-semibold text-gray-500">
                                                Archivos
                                            </span>
                                            {archivosList?.map((archivo) => {
                                                const seleccionado = form.plantillaConfig[index]?.archivos?.some(
                                                    a => (a.idTipoArchivo === archivo.idTipoArchivo) && !a.anulado
                                                );
                                                return (
                                                    <button
                                                        key={archivo.idTipoArchivo}
                                                        type="button"
                                                        onClick={() => toggleArchivo(index, archivo)}
                                                        className={`
                                                    relative flex items-center gap-2 px-4 py-1.5 text-xs font-medium rounded-full border
                                                    transition-all duration-200 ease-in-out
                                                    transform active:scale-95 hover:scale-105

                                                    ${seleccionado
                                                                ? "bg-blue-500 border-blue-500 text-white shadow-md"
                                                                : "bg-white border-gray-300 text-gray-600 hover:bg-gray-100 hover:border-gray-400 shadow-sm hover:shadow-md"}
                                                    `}
                                                    >
                                                        {/* Icono SIEMPRE igual */}
                                                        <FontAwesomeIcon icon={faFile} className="text-[12px]" />
                                                        {archivo.nomenclatura}
                                                        {/* Check pequeño flotante */}
                                                        {seleccionado && (
                                                            <span className="absolute -top-1 -right-1 bg-white text-blue-500 rounded-full text-[10px] px-1 shadow">
                                                                <FontAwesomeIcon icon={faCheck} />
                                                            </span>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        {/* MENSAJE */}
                                        <textarea
                                            name="mensaje"
                                            value={emailForm.mensaje}
                                            onChange={(e) => handleEmailChange(index, e)}
                                            rows="14"
                                            placeholder="Escribe el mensaje..."
                                            className="w-full border rounded-md p-3  focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                        />

                                    </div>

                                </div>
                            )
                        })}

                    </div>
                </div>
            ) : (
                <TablaTemplate
                    columns={columns}
                    data={empresaContrataListFiltered}
                    height={500}
                    onRowClick={(row) => {
                        setForm(prev => ({
                            ...prev,
                            datosEmpresaContrataBloqueado: true,
                            idRelacionEmpresaContrata: row.id,
                            razonEmpresa: row.razonEmpresa ?? "",
                            rucEmpresa: row.rucEmpresa ?? "",
                            razonContrata: row.razonContrata ?? "",
                            rucContrata: row.rucContrata ?? "",
                        }))
                        setSearchEmpresa(row.razonEmpresa ?? "")
                        setSearchContrata(row.razonContrata ?? "")

                        obtenerPlantilla(row.id)
                    }}
                />)
            }

        </div >
    )
}
