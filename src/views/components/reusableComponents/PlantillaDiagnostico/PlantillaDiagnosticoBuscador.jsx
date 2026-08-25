import { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink, faPencil, faSpinner, faTrash } from "@fortawesome/free-solid-svg-icons";
import InputTextOneLine from "../InputTextOneLine";
import SectionFieldset from "../SectionFieldset";

export default function PlantillaDiagnosticoBuscador({ hook, onVincular }) {
    const { plantillas, filtros, setFiltros, loadingList, buscarPlantillas, cargarParaEditar, eliminar } = hook;
    const debounceRef = useRef(null);
    const isFirstRun = useRef(true);

    // Al abrirse (este componente se monta cada vez que se muestra la
    // pestaña Buscar/Vincular) siempre trae el listado completo primero.
    useEffect(() => {
        buscarPlantillas(filtros);
        isFirstRun.current = false;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (isFirstRun.current) return;
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => buscarPlantillas(filtros), 300);
        return () => clearTimeout(debounceRef.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filtros]);

    const handleFiltro = (e) => {
        const { name, value } = e.target;
        setFiltros((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <SectionFieldset legend="Buscar Plantillas" className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
                <InputTextOneLine
                    label="Código"
                    name="codigo"
                    value={filtros.codigo}
                    onChange={handleFiltro}
                    labelWidth="90px"
                />
                <InputTextOneLine
                    label="Título"
                    name="titulo"
                    value={filtros.titulo}
                    onChange={handleFiltro}
                    labelWidth="90px"
                />
                <InputTextOneLine
                    label="Diagnóstico"
                    name="diagnostico"
                    value={filtros.diagnostico}
                    onChange={handleFiltro}
                    labelWidth="90px"
                />
                <InputTextOneLine
                    label="CIE10"
                    name="cie10"
                    value={filtros.cie10}
                    onChange={handleFiltro}
                    labelWidth="90px"
                />
            </div>

            <div className="max-h-[360px] overflow-y-auto border rounded">
                <table className="w-full text-sm">
                    <thead className="bg-gradient-to-r from-blue-100 to-blue-300 sticky top-0">
                        <tr>
                            <th className="py-2 px-2 text-left">Código</th>
                            <th className="py-2 px-2 text-left">Título</th>
                            <th className="py-2 px-2 text-left">CIE10</th>
                            <th className="py-2 px-2 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loadingList && (
                            <tr>
                                <td colSpan={4} className="text-center py-4">
                                    <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> Cargando...
                                </td>
                            </tr>
                        )}
                        {!loadingList && plantillas.length === 0 && (
                            <tr>
                                <td colSpan={4} className="text-center py-4 text-gray-500">
                                    Sin resultados
                                </td>
                            </tr>
                        )}
                        {!loadingList &&
                            plantillas.map((p) => (
                                <tr key={p.idPlantilla} className="border-t hover:bg-gray-50">
                                    <td className="py-1 px-2 font-mono">{p.codigo}</td>
                                    <td className="py-1 px-2">{p.titulo}</td>
                                    <td className="py-1 px-2 text-xs text-gray-500">
                                        {(p.cie10s || []).map((c) => c.cod).join(", ")}
                                    </td>
                                    <td className="py-1 px-2">
                                        <div className="flex justify-center gap-3">
                                            <button
                                                type="button"
                                                title="Vincular a este formulario"
                                                onClick={() => onVincular && onVincular(p)}
                                                className="text-emerald-600 hover:text-emerald-800"
                                            >
                                                <FontAwesomeIcon icon={faLink} />
                                            </button>
                                            <button
                                                type="button"
                                                title="Editar"
                                                onClick={() => cargarParaEditar(p.idPlantilla)}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                <FontAwesomeIcon icon={faPencil} />
                                            </button>
                                            <button
                                                type="button"
                                                title="Eliminar"
                                                onClick={() => eliminar(p.idPlantilla)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </SectionFieldset>
    );
}
