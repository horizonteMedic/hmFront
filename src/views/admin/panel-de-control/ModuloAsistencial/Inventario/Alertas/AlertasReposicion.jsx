import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotate } from "@fortawesome/free-solid-svg-icons";
import InputTextOneLine from "../../../../../components/reusableComponents/InputTextOneLine";
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
import { Faltante, ObtenerAlertasReposicion, OrdenarPorUrgencia } from "./controllerAlertasReposicion";

const columnas = [
    { label: "Medicamento", accessor: "nombre", width: "24%" },
    { label: "Presentación", accessor: "presentacion", width: "13%" },
    { label: "Tipo", accessor: "tipoMedicamentoDescripcion", width: "13%" },
    { label: "Mínimo", accessor: "stockMinimo", width: "7%" },
    { label: "Disponible", accessor: "cantidadDisponible", width: "9%" },
    { label: "Faltante", width: "8%", render: (row) => <strong className="text-red-600">{Faltante(row)}</strong> },
    { label: "Actual", accessor: "cantidadActual", width: "7%" },
    { label: "Reservada", accessor: "cantidadReservada", width: "9%" },
    { label: "Próx. Vencimiento", width: "10%", render: (row) => formatearFechaCorta(row.proximoVencimiento) || "—" },
];

export default function AlertasReposicion() {
    const { token } = useSessionData();
    const { inventarios, inventarioId, setInventarioId, errorInventarios, cargarInventarios } = useInventarios(token);
    const { datos, cargando, error, ejecutar } = useConsultaInventario();
    const [filtroNombre, setFiltroNombre] = useState("");

    const cargar = () => {
        if (inventarioId) ejecutar(() => ObtenerAlertasReposicion(inventarioId, token));
    };

    useEffect(() => {
        cargar();
    }, [inventarioId]);

    const alertas = useMemo(() => OrdenarPorUrgencia(datos), [datos]);

    const alertasFiltradas = useMemo(() => {
        const texto = normalizarTexto(filtroNombre);
        return alertas.filter((fila) => !texto || normalizarTexto(`${fila.nombre} ${fila.presentacion}`).includes(texto));
    }, [alertas, filtroNombre]);

    const paginacion = usePagination(alertasFiltradas, 10);
    const { setCurrentPage, paginatedData } = paginacion;

    useEffect(() => {
        setCurrentPage(1);
    }, [filtroNombre, inventarioId]);

    return (
        <div className="space-y-4 px-4 pb-4">
            <SectionFieldset legend="Alertas de Reposición">
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
                        {!cargando && !error && inventarioId && (
                            <span className={`font-semibold ${alertas.length > 0 ? "text-red-600" : "text-emerald-700"}`}>
                                {alertas.length > 0 ? `${alertas.length} medicamentos requieren reposición` : "No hay medicamentos por reponer"}
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <InputTextOneLine
                        label="Buscar"
                        name="filtroNombre"
                        labelWidth="110px"
                        value={filtroNombre}
                        onChange={(e) => setFiltroNombre(e.target.value)}
                    />
                </div>

                <TablaTemplate
                    columns={columnas}
                    data={paginatedData}
                    height={450}
                    emptyText={cargando ? "Cargando alertas..." : "No hay alertas de reposición"}
                />

                <PaginadorTabla paginacion={paginacion} total={alertasFiltradas.length} etiqueta="medicamentos" />
            </SectionFieldset>
        </div>
    );
}
