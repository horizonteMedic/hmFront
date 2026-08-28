import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink, faSpinner } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { FloatingInput } from "../../../admin/panel-de-control/ModuloSalud/Inventario/ProductosEnInventario/components/FloatingField";
import SectionFieldset from "../SectionFieldset";

function FilaPlantilla({ p, idx, checked, onToggle, onDobleClick, stripeA, stripeB }) {
    return (
        <tr
            onDoubleClick={() => onDobleClick(p)}
            title="Click en el checkbox para seleccionar, doble click en la fila para editar o clonar"
            className={`align-middle border-b-2 border-gray-200 hover:bg-white ${
                idx % 2 === 0 ? stripeA : stripeB
            }`}
        >
            <td className="py-2 px-2 align-middle text-center" onDoubleClick={(e) => e.stopPropagation()}>
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggle(p)}
                    className="cursor-pointer w-5 h-5 accent-emerald-600"
                />
            </td>
            <td className="py-2 px-2 align-middle">{p.codigo}</td>
            <td className="py-2 px-2 align-middle">{p.titulo}</td>
            <td className="py-2 px-2 align-middle">{p.diagnostico}</td>
            <td className="py-2 px-2 align-top">
                <div className="space-y-1">
                    {(p.cie10s || []).map((c, i) => (
                        <div
                            key={c.cod}
                            className="flex items-center gap-1.5 bg-sky-50 border border-sky-200 rounded-md px-1.5 py-1"
                        >
                            <span className="text-[10px] font-bold text-sky-600 rounded-full w-4 h-4 flex items-center justify-center shrink-0">
                                {i + 1})
                            </span>
                            <span className=" font-bold text-sky-700 bg-sky-100 px-1 py-0.5 rounded shrink-0">
                                {c.cod}
                            </span>
                            <span className="uppercase text-sky-800">{c.diagnostico}</span>
                        </div>
                    ))}
                </div>
            </td>
            <td className="py-2 px-2 align-top">
                <div className="space-y-1">
                    {(p.recomendaciones || []).map((r, i) => (
                        <div
                            key={r.id}
                            className="flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-md px-1.5 py-1"
                        >
                            <span className="text-[10px] font-bold text-green-500  rounded-full w-4 h-4 flex items-center justify-center shrink-0">
                                {i + 1})
                            </span>
                            <span className="uppercase text-green-600">{r.descripcion}</span>
                        </div>
                    ))}
                </div>
            </td>
            <td className="py-2 px-2 align-top">
                <div className="space-y-1">
                    {(p.restricciones || []).map((r, i) => (
                        <div
                            key={r.id}
                            className="flex items-center gap-1.5 bg-red-50 border border-red-200 rounded-md px-1.5 py-1"
                        >
                            <span className="text-[10px] font-bold text-red-600 rounded-full w-4 h-4 flex items-center justify-center shrink-0">
                                {i + 1})
                            </span>
                            <span className="text-sm text-red-800">{r.descripcion}</span>
                        </div>
                    ))}
                </div>
            </td>
        </tr>
    );
}

function TablaPlantillas({ items, checked, onToggle, onDobleClick, loading, emptyText, stripeA, stripeB, headerClassName }) {
    return (
        <div className="max-h-[320px] overflow-y-auto border rounded">
            <table className="w-full">
                <thead className={`sticky top-0 ${headerClassName}`}>
                    <tr>
                        <th className="py-3 px-2 w-10"></th>
                        <th className="py-3 px-2 text-left">Código</th>
                        <th className="py-3 px-2 text-left">Título</th>
                        <th className="py-3 px-2 text-left">Diagnóstico</th>
                        <th className="py-3 px-2 text-left">CIE10</th>
                        <th className="py-3 px-2 text-left">Recomendaciones</th>
                        <th className="py-3 px-2 text-left">Restricciones</th>
                    </tr>
                </thead>
                <tbody>
                    {loading && (
                        <tr>
                            <td colSpan={7} className="text-center py-4">
                                <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> Cargando...
                            </td>
                        </tr>
                    )}
                    {!loading && items.length === 0 && (
                        <tr>
                            <td colSpan={7} className="text-center py-4 text-gray-500">
                                {emptyText}
                            </td>
                        </tr>
                    )}
                    {!loading &&
                        items.map((p, idx) => (
                            <FilaPlantilla
                                key={p.idPlantilla}
                                p={p}
                                idx={idx}
                                checked={checked}
                                onToggle={onToggle}
                                onDobleClick={onDobleClick}
                                stripeA={stripeA}
                                stripeB={stripeB}
                            />
                        ))}
                </tbody>
            </table>
        </div>
    );
}

const normalizar = (s) => (s || "").toString().toUpperCase().trim();

export default function PlantillaDiagnosticoBuscador({ hook, onVincular, onEditar, onClonar }) {
    const { plantillas, filtros, setFiltros, loadingList, buscarPlantillas } = hook;
    // Map<idPlantilla, plantilla> en vez de un Set de ids: así la lista de
    // seleccionadas se mantiene aunque, al filtrar, la plantilla ya no
    // aparezca en los resultados visibles.
    const [seleccionados, setSeleccionados] = useState(new Map());

    // Se trae el listado completo UNA sola vez al abrirse; los filtros de
    // arriba filtran ese listado en el front, no vuelven a golpear el
    // endpoint. El timeout+cleanup evita el doble disparo de
    // React.StrictMode en desarrollo.
    useEffect(() => {
        const timeout = setTimeout(() => buscarPlantillas({}), 0);
        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleFiltro = (e) => {
        const { name, value } = e.target;
        setFiltros((prev) => ({ ...prev, [name]: value }));
    };

    const plantillasFiltradas = useMemo(() => {
        const qCodigo = normalizar(filtros.codigo);
        const qTitulo = normalizar(filtros.titulo);
        const qDiagnostico = normalizar(filtros.diagnostico);
        const qCie10 = normalizar(filtros.cie10);
        return plantillas.filter((p) => {
            if (qCodigo && !normalizar(p.codigo).includes(qCodigo)) return false;
            if (qTitulo && !normalizar(p.titulo).includes(qTitulo)) return false;
            if (qDiagnostico && !normalizar(p.diagnostico).includes(qDiagnostico)) return false;
            if (qCie10) {
                const matchCie10 = (p.cie10s || []).some(
                    (c) => normalizar(c.cod).includes(qCie10) || normalizar(c.diagnostico).includes(qCie10)
                );
                if (!matchCie10) return false;
            }
            return true;
        });
    }, [plantillas, filtros]);

    const seleccionar = (p) => {
        setSeleccionados((prev) => new Map(prev).set(p.idPlantilla, p));
    };

    const quitarSeleccionado = (p) => {
        setSeleccionados((prev) => {
            const next = new Map(prev);
            next.delete(p.idPlantilla);
            return next;
        });
    };

    const listaSeleccionados = Array.from(seleccionados.values());
    // "Disponibles": lo que se ve en la tabla es lo que aún no está en la
    // lista de seleccionadas.
    const disponibles = plantillasFiltradas.filter((p) => !seleccionados.has(p.idPlantilla));

    const handleVincularSeleccionados = () => {
        if (listaSeleccionados.length === 0) return;
        onVincular && onVincular(listaSeleccionados);
        setSeleccionados(new Map());
    };

    const handleDobleClick = async (p) => {
        const result = await Swal.fire({
            title: "¿Qué deseas hacer?",
            html: `<div>Plantilla <b>${p.codigo}</b> - ${p.titulo}</div>`,
            icon: "question",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Editar",
            denyButtonText: "Clonar",
            cancelButtonText: "Cancelar",
        });
        if (result.isConfirmed) {
            onEditar && onEditar(p.idPlantilla);
        } else if (result.isDenied) {
            onClonar && onClonar(p);
        }
    };

    return (
        <SectionFieldset legend="Buscar Plantillas" className="space-y-3" fieldsetClassName="bg-white">
            <div className="grid grid-cols-2 gap-3">
                <FloatingInput id="filtro-codigo" name="codigo" label="Código" value={filtros.codigo} onChange={handleFiltro} />
                <FloatingInput id="filtro-titulo" name="titulo" label="Título" value={filtros.titulo} onChange={handleFiltro} />
                <FloatingInput
                    id="filtro-diagnostico"
                    name="diagnostico"
                    label="Diagnóstico"
                    value={filtros.diagnostico}
                    onChange={handleFiltro}
                />
                <FloatingInput id="filtro-cie10" name="cie10" label="CIE10" value={filtros.cie10} onChange={handleFiltro} />
            </div>

            <div>
                <p className="text-sm font-semibold text-gray-600 my-1">
                    Disponibles ({disponibles.length})
                </p>
                <TablaPlantillas
                    items={disponibles}
                    checked={false}
                    onToggle={seleccionar}
                    onDobleClick={handleDobleClick}
                    loading={loadingList}
                    emptyText="Sin resultados"
                    stripeA="bg-gray-50"
                    stripeB="bg-gray-100"
                    headerClassName="bg-gradient-to-r from-blue-100 to-blue-300"
                />
            </div>

            <div>
                <div className="flex justify-between items-center mb-1">
                    <p className="text-sm font-semibold text-emerald-700 my-auto">
                        Seleccionadas ({listaSeleccionados.length})
                    </p>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            disabled={listaSeleccionados.length === 0}
                            onClick={() => setSeleccionados(new Map())}
                            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed text-gray-700 rounded"
                        >
                            Limpiar selección
                        </button>
                        <button
                            type="button"
                            disabled={listaSeleccionados.length === 0}
                            onClick={handleVincularSeleccionados}
                            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded flex items-center gap-2"
                        >
                            <FontAwesomeIcon icon={faLink} /> Vincular seleccionadas
                        </button>
                    </div>
                </div>
                <TablaPlantillas
                    items={listaSeleccionados}
                    checked
                    onToggle={quitarSeleccionado}
                    onDobleClick={handleDobleClick}
                    loading={false}
                    emptyText="Ninguna seleccionada"
                    stripeA="bg-emerald-50"
                    stripeB="bg-emerald-100"
                    headerClassName="bg-gradient-to-r from-emerald-100 to-emerald-300"
                />
            </div>
        </SectionFieldset>
    );
}
