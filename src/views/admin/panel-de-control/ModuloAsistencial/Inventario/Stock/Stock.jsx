import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotate } from "@fortawesome/free-solid-svg-icons";
import InputTextOneLine from "../../../../../components/reusableComponents/InputTextOneLine";
import { SelectField } from "../../../../../components/reusableComponents/InputSelect";
import SectionFieldset from "../../../../../components/reusableComponents/SectionFieldset";
import TablaTemplate from "../../../../../components/templates/TablaTemplate";
import { useSessionData } from "../../../../../hooks/useSessionData";
import { formatearFechaCorta } from "../../../../../utils/formatDateUtils";
import { usePagination } from "../../../../../utils/listUtils";
import { normalizarTexto } from "../inventarioUtils";
import PaginadorTabla from "../PaginadorTabla";
import SelectorInventario from "../SelectorInventario";
import { useConsultaInventario } from "../useConsultaInventario";
import { useInventarios } from "../useInventarios";
import { ObtenerStockResumen } from "./controllerStock";
import ModalLotes from "./ModalLotes/ModalLotes";

const columnas = [
    { label: "Medicamento", accessor: "nombre", width: "22%" },
    { label: "Presentación", accessor: "presentacion", width: "12%" },
    { label: "Tipo", accessor: "tipoMedicamentoDescripcion", width: "12%" },
    { label: "Mínimo", accessor: "stockMinimo", width: "7%" },
    { label: "Actual", accessor: "cantidadActual", width: "7%" },
    { label: "Reservada", accessor: "cantidadReservada", width: "9%" },
    { label: "Disponible", width: "9%", render: (row) => <strong>{row.cantidadDisponible}</strong> },
    { label: "Próx. Vencimiento", width: "12%", render: (row) => formatearFechaCorta(row.proximoVencimiento) || "—" },
    {
        label: "Estado",
        width: "10%",
        render: (row) => (
            <span className={`px-2 py-0.5 rounded text-sm font-semibold ${row.requiereReposicion ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}`}>
                {row.requiereReposicion ? "Reponer" : "Suficiente"}
            </span>
        ),
    },
];

export default function Stock() {
    const { token } = useSessionData();
    const { inventarios, inventarioId, setInventarioId, inventarioActual, errorInventarios, cargarInventarios } = useInventarios(token);
    const { datos: stock, cargando, error, ejecutar } = useConsultaInventario();

    const [filtroNombre, setFiltroNombre] = useState("");
    const [filtroTipo, setFiltroTipo] = useState("");
    const [soloReposicion, setSoloReposicion] = useState(false);
    const [medicamentoLotes, setMedicamentoLotes] = useState(null);

    const cargar = () => {
        if (inventarioId) ejecutar(() => ObtenerStockResumen(inventarioId, token));
    };

    useEffect(() => {
        cargar();
    }, [inventarioId]);

    // Los tipos del filtro salen del propio stock, así no depende de otra consulta.
    const opcionesTipo = useMemo(() => {
        const tipos = new Map(stock.map((fila) => [fila.tipoMedicamento, fila.tipoMedicamentoDescripcion]));
        return [...tipos].map(([codigo, descripcion]) => ({ value: String(codigo), label: descripcion }));
    }, [stock]);

    const stockFiltrado = useMemo(() => {
        const texto = normalizarTexto(filtroNombre);
        return stock.filter((fila) => {
            if (filtroTipo && String(fila.tipoMedicamento) !== filtroTipo) return false;
            if (soloReposicion && !fila.requiereReposicion) return false;
            return !texto || normalizarTexto(`${fila.nombre} ${fila.presentacion}`).includes(texto);
        });
    }, [stock, filtroNombre, filtroTipo, soloReposicion]);

    const paginacion = usePagination(stockFiltrado, 10);
    const { setCurrentPage, paginatedData } = paginacion;

    // Al cambiar un filtro la lista puede quedar más corta que la página actual.
    useEffect(() => {
        setCurrentPage(1);
    }, [filtroNombre, filtroTipo, soloReposicion, inventarioId]);

    const porReponer = stock.filter((fila) => fila.requiereReposicion).length;

    return (
        <div className="space-y-4 px-4 pb-4">
            <SectionFieldset legend="Stock del Inventario">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <SelectorInventario
                        inventarios={inventarios}
                        inventarioId={inventarioId}
                        onChange={(e) => setInventarioId(e.target.value)}
                        error={errorInventarios}
                        onRetry={cargarInventarios}
                    />
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={cargar}
                            disabled={!inventarioId || cargando}
                            className="
                                bg-blue-600 hover:bg-blue-700
                                text-white text-base px-6 py-2 rounded
                                flex items-center gap-2
                                transition-all duration-150 ease-out
                                hover:shadow-lg
                                active:scale-95 active:shadow-inner
                                disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FontAwesomeIcon icon={faRotate} spin={cargando} /> Actualizar
                        </button>
                        {stock.length > 0 && (
                            <span className="text-sm">
                                {stock.length} medicamentos ·{" "}
                                <strong className={porReponer > 0 ? "text-red-600" : "text-emerald-700"}>{porReponer} por reponer</strong>
                            </span>
                        )}
                    </div>
                </div>

                {error && (
                    <div className="flex items-center justify-between gap-4 mb-3 p-3 rounded border border-red-300 bg-red-50 text-red-700">
                        <span>{error}</span>
                        <button
                            type="button"
                            onClick={cargar}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded transition-all duration-150 ease-out active:scale-95"
                        >
                            Reintentar
                        </button>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <InputTextOneLine
                        label="Buscar"
                        name="filtroNombre"
                        labelWidth="110px"
                        value={filtroNombre}
                        onChange={(e) => setFiltroNombre(e.target.value)}
                    />
                    <SelectField
                        label="Filtrar por tipo"
                        name="filtroTipo"
                        value={filtroTipo}
                        onChange={(e) => setFiltroTipo(e.target.value)}
                        options={opcionesTipo}
                        placeholder="Todos"
                        inline
                        labelWidth="110px"
                    />
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={soloReposicion} onChange={(e) => setSoloReposicion(e.target.checked)} />
                        Solo los que requieren reposición
                    </label>
                </div>

                <p className="text-sm text-gray-500 mb-2">Haga clic en un medicamento para ver sus lotes.</p>

                <TablaTemplate
                    columns={columnas}
                    data={paginatedData}
                    height={450}
                    onRowClick={setMedicamentoLotes}
                    getRowClassName={(row) => (row.requiereReposicion ? "bg-red-50" : "")}
                    emptyText={cargando ? "Cargando stock..." : "No hay medicamentos para mostrar"}
                />

                <PaginadorTabla paginacion={paginacion} total={stockFiltrado.length} etiqueta="medicamentos" />
            </SectionFieldset>

            <ModalLotes
                isOpen={Boolean(medicamentoLotes)}
                onRequestClose={() => setMedicamentoLotes(null)}
                inventario={inventarioActual}
                medicamento={medicamentoLotes}
                token={token}
            />
        </div>
    );
}
