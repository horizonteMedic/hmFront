import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faSave, faPlus } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { ComboboxEmpresa, ComboboxContrata } from "../model/Combobox";
import { GetListEmpresaContrata } from "../../SistemaOcupacional/PlantillasCorreo/controllerPlantillasCorreo";
import { AsignarVinculacionEmpresaContrata, ObtenerVinculacionesUsuario, CrearRelacionEmpresaContrata } from "./controllerAsignarEmpresaContrataVinculado";
import TablaTemplate from "../../../../components/templates/TablaTemplate";
import InputCheckbox from "../../../../components/reusableComponents/InputCheckbox";

export default function AsignarEmpresaContrataVinculado({ closeModal, id, user, userlogued, token }) {
    const ListEmpresa = ComboboxEmpresa();
    const ListContrata = ComboboxContrata();

    const [empresaContrataList, setEmpresaContrataList] = useState([]);
    const [empresaContrataListFiltered, setEmpresaContrataListFiltered] = useState([]);

    const [searchEmpresa, setSearchEmpresa] = useState("");
    const [filteredEmpresas, setFilteredEmpresas] = useState([]);

    const [searchContrata, setSearchContrata] = useState("");
    const [filteredContratas, setFilteredContratas] = useState([]);

    const [selectedIds, setSelectedIds] = useState([]);
    const [loadingVinculaciones, setLoadingVinculaciones] = useState(false);

    const refrescarEmpresaContrataList = () => {
        GetListEmpresaContrata(setEmpresaContrataList, token);
    };

    useEffect(() => {
        refrescarEmpresaContrataList();

        setLoadingVinculaciones(true);
        ObtenerVinculacionesUsuario(id, token)
            .then(ids => setSelectedIds(ids))
            .finally(() => setLoadingVinculaciones(false));
    }, [id]);

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
    }, [searchEmpresa, searchContrata, empresaContrataList]);

    const toggleSeleccion = (idEmpresaContrata) => {
        setSelectedIds(prev =>
            prev.includes(idEmpresaContrata) ? prev.filter(x => x !== idEmpresaContrata) : [...prev, idEmpresaContrata]
        );
    };

    const handleEmpresaSearch = (e) => {
        const v = e.target.value.toUpperCase();
        setSearchEmpresa(v);

        const filtered = v
            ? ListEmpresa.filter(emp => (emp.razonSocial ?? "").toUpperCase().includes(v) || (emp.ruc ?? "").includes(v))
            : [];
        setFilteredEmpresas(filtered);
    };

    const handleSelectEmpresa = (emp) => {
        setSearchEmpresa(emp.razonSocial);
        setFilteredEmpresas([]);
    };

    const handleContrataSearch = (e) => {
        const v = e.target.value.toUpperCase();
        setSearchContrata(v);

        const filtered = v
            ? ListContrata.filter(c => (c.razonSocial ?? "").toUpperCase().includes(v) || (c.ruc ?? "").includes(v))
            : [];
        setFilteredContratas(filtered);
    };

    const handleSelectContrata = (c) => {
        setSearchContrata(c.razonSocial);
        setFilteredContratas([]);
    };

    const empresaSeleccionada = ListEmpresa.find(e => (e.razonSocial ?? "").toUpperCase() === searchEmpresa.toUpperCase());
    const contrataSeleccionada = ListContrata.find(c => (c.razonSocial ?? "").toUpperCase() === searchContrata.toUpperCase());

    const relacionExistente = empresaSeleccionada && empresaContrataList.find(rel =>
        rel.rucEmpresa === empresaSeleccionada.ruc &&
        (rel.rucContrata ?? "") === (contrataSeleccionada?.ruc ?? "")
    );

    const mostrarCrearRelacion = !!empresaSeleccionada && !relacionExistente;

    const handleCrearRelacion = () => {
        CrearRelacionEmpresaContrata(
            empresaSeleccionada.ruc,
            contrataSeleccionada?.ruc ?? "",
            userlogued,
            token,
            () => {
                GetListEmpresaContrata((lista) => {
                    setEmpresaContrataList(lista);
                    const nueva = lista.find(rel =>
                        rel.rucEmpresa === empresaSeleccionada.ruc &&
                        (rel.rucContrata ?? "") === (contrataSeleccionada?.ruc ?? "")
                    );
                    if (nueva) setSelectedIds(prev => prev.includes(nueva.id) ? prev : [...prev, nueva.id]);
                }, token);
            }
        );
    };

    const handleVincular = () => {
        if (selectedIds.length === 0) {
            Swal.fire("Error", "Debe seleccionar al menos una Empresa-Contrata", "error");
            return;
        }

        AsignarVinculacionEmpresaContrata(id, selectedIds, token, closeModal);
    };

    const columns = [
        {
            label: "",
            accessor: "sel",
            width: "50px",
            render: (row) => (
                <div onClick={(e) => e.stopPropagation()}>
                    <InputCheckbox
                        checked={selectedIds.includes(row.id)}
                        onChange={() => toggleSeleccion(row.id)}
                    />
                </div>
            )
        },
        {
            label: "RUC Empresa",
            accessor: "rucEmpresa",
            width: "110px"
        },
        {
            label: "Razón Empresa",
            accessor: "razonEmpresa"
        },
        {
            label: "RUC Contrata",
            accessor: "rucContrata",
            width: "110px",
            render: (row) => row.rucContrata ?? "-"
        },
        {
            label: "Razón Contrata",
            accessor: "razonContrata",
            render: (row) => row.razonContrata ?? "-"
        }
    ];

    const seleccionadosList = empresaContrataList.filter(item => selectedIds.includes(item.id));
    const disponiblesListFiltered = empresaContrataListFiltered.filter(item => !selectedIds.includes(item.id));

    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
            <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-md w-[400px] md:w-[800px] relative">
                <FontAwesomeIcon
                    icon={faTimes}
                    className="absolute top-0 right-0 m-3 cursor-pointer color-blanco"
                    onClick={closeModal}
                />
                <div className="p azuloscurobackground flex justify-between p-3.5">
                    <h1 className="text-start font-bold color-azul text-white">Asignar Empresa-Contrata Vinculado</h1>
                </div>

                <div className="container p-4">
                    <h1 className="text-start font-bold mb-3">Usuario: {user}</h1>

                    <div className="grid grid-cols-2 gap-3 mb-1">
                        <div className="relative flex-grow flex items-center">
                            <input
                                autoComplete="off"
                                type="text"
                                value={searchEmpresa}
                                onChange={handleEmpresaSearch}
                                placeholder="Buscar / Crear Empresa..."
                                className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none bg-white"
                                onKeyDown={e => {
                                    if (e.key === 'Enter' && filteredEmpresas.length > 0) {
                                        e.preventDefault();
                                        handleSelectEmpresa(filteredEmpresas[0]);
                                    }
                                }}
                                onFocus={() => {
                                    if (searchEmpresa) {
                                        setFilteredEmpresas(ListEmpresa.filter(emp => (emp.razonSocial ?? "").toUpperCase().includes(searchEmpresa.toUpperCase())));
                                    }
                                }}
                                onBlur={() => setTimeout(() => setFilteredEmpresas([]), 100)}
                            />
                            {searchEmpresa && filteredEmpresas.length > 0 && (
                                <ul className="absolute inset-x-0 top-full bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto z-30 shadow-lg">
                                    {filteredEmpresas.map((emp, index) => (
                                        <li
                                            key={index}
                                            className="cursor-pointer px-3 py-2 hover:bg-gray-100 flex justify-between gap-2"
                                            onMouseDown={() => handleSelectEmpresa(emp)}
                                        >
                                            <span>{emp.razonSocial}</span>
                                            <span className="text-gray-400 text-xs whitespace-nowrap">{emp.ruc}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div className="relative flex-grow flex items-center">
                            <input
                                autoComplete="off"
                                type="text"
                                value={searchContrata}
                                onChange={handleContrataSearch}
                                placeholder="Buscar / Crear Contrata..."
                                className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none bg-white"
                                onKeyDown={e => {
                                    if (e.key === 'Enter' && filteredContratas.length > 0) {
                                        e.preventDefault();
                                        handleSelectContrata(filteredContratas[0]);
                                    }
                                }}
                                onFocus={() => {
                                    if (searchContrata) {
                                        setFilteredContratas(ListContrata.filter(c => (c.razonSocial ?? "").toUpperCase().includes(searchContrata.toUpperCase())));
                                    }
                                }}
                                onBlur={() => setTimeout(() => setFilteredContratas([]), 100)}
                            />
                            {searchContrata && filteredContratas.length > 0 && (
                                <ul className="absolute inset-x-0 top-full bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto z-30 shadow-lg">
                                    {filteredContratas.map((c, index) => (
                                        <li
                                            key={index}
                                            className="cursor-pointer px-3 py-2 hover:bg-gray-100 flex justify-between gap-2"
                                            onMouseDown={() => handleSelectContrata(c)}
                                        >
                                            <span>{c.razonSocial}</span>
                                            <span className="text-gray-400 text-xs whitespace-nowrap">{c.ruc}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    {mostrarCrearRelacion && (
                        <div className="flex items-center justify-between gap-3 bg-blue-50 border border-blue-200 rounded p-2 mt-3 mb-3">
                            <span className="text-xs text-blue-700">
                                No existe una relación registrada para{" "}
                                <strong>{empresaSeleccionada.razonSocial}</strong>
                                {contrataSeleccionada ? <> - <strong>{contrataSeleccionada.razonSocial}</strong></> : ""}.
                            </span>
                            <button
                                type="button"
                                onClick={handleCrearRelacion}
                                className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded flex items-center gap-1 whitespace-nowrap"
                            >
                                <FontAwesomeIcon icon={faPlus} /> Crear Relación
                            </button>
                        </div>
                    )}

                    <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded p-2 mb-3 mt-3">
                        Al vincular, se reemplazará por completo la lista de Empresa-Contrata vinculadas de este usuario
                        con las que selecciones aquí. Seleccione todas las que deban quedar vinculadas.
                    </p>

                    {loadingVinculaciones && (
                        <p className="text-sm text-gray-500 mb-2">Cargando vinculaciones actuales...</p>
                    )}

                    <p className="font-semibold text-sm text-gray-700 mb-1">
                        Seleccionados ({seleccionadosList.length})
                    </p>
                    <TablaTemplate
                        columns={columns}
                        data={seleccionadosList}
                        height={140}
                        emptyText="Aún no ha seleccionado ninguna Empresa-Contrata"
                        onRowClick={(row) => toggleSeleccion(row.id)}
                    />

                    <p className="font-semibold text-sm text-gray-700 mb-1 mt-3">
                        Disponibles
                    </p>
                    <TablaTemplate
                        columns={columns}
                        data={disponiblesListFiltered}
                        height={220}
                        onRowClick={(row) => toggleSeleccion(row.id)}
                    />

                    <div className="flex justify-end mt-4">
                        <button
                            type="button"
                            onClick={handleVincular}
                            className="
                            bg-emerald-600 hover:bg-emerald-700
                            text-white text-base px-6 py-2 rounded
                            flex items-center gap-2
                            transition-all duration-150 ease-out
                            hover:shadow-lg
                            active:scale-95 active:shadow-inner"
                        >
                            <FontAwesomeIcon icon={faSave} /> Vincular
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
