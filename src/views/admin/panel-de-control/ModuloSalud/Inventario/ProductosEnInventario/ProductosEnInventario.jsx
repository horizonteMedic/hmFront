import { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useAuthStore } from "../../../../../../store/auth";
import Paginacion from "../../components/Paginacion";
import { filtrarPorTexto } from "../../utils/filtrarPorTexto";
import useListaPaginada from "../../utils/useListaPaginada";
import CargaMasivaMedicamentos from "./CargaMasivaMedicamentos/CargaMasivaMedicamentos";
import { FloatingInput, FloatingSelect } from "./components/FloatingField";
import DetalleMedicamentoModal from "./DetalleMedicamentoModal/DetalleMedicamentoModal";
import IngresoStockModal from "./IngresoStockModal/IngresoStockModal";
import MedicamentoModal from "./MedicamentoModal/MedicamentoModal";
import MedicamentosTabla from "./MedicamentosTabla";
import useMedicamentos from "./useMedicamentos";

const FILTROS_INICIALES = { nombre: "", presentacion: "", stock: "todos" };

const FILTRO_STOCK_OPTIONS = [
    { value: "todos", label: "Todos" },
    { value: "sin-stock", label: "Sin stock" },
    { value: "bajo-minimo", label: "Stock menor al mínimo" },
];

const filtrarMedicamentos = (medicamentos, { nombre, presentacion, stock }) =>
    filtrarPorTexto(filtrarPorTexto(medicamentos, nombre, (m) => [m.nombre]), presentacion, (m) => [m.presentacion]).filter((m) => {
        const actual = m.stockActual ?? 0;
        if (stock === "sin-stock") return actual === 0;
        if (stock === "bajo-minimo") return actual < (m.stockMinimo ?? 0);
        return true;
    });

const textoVacio = ({ cargando, fallo, total }) => {
    if (cargando) return "Cargando medicamentos...";
    if (fallo) return "No se pudo cargar la lista de medicamentos.";
    if (total === 0) return "Esta campaña aún no tiene medicamentos. Agrégalos con «Agregar medicamento» o «Carga masiva».";
    return "No se encontraron medicamentos con esos filtros.";
};

// Medicamentos de la campaña con su stock. Cada campaña tiene los suyos (stock independiente).
export default function ProductosEnInventario({ campania }) {
    const token = useAuthStore((state) => state.token);
    const usuario = useAuthStore((state) => state.userlogued?.sub ?? "");
    const { medicamentos, cargando, fallo, recargar } = useMedicamentos(token, campania);
    const [filtros, setFiltros] = useState(FILTROS_INICIALES);
    const [modal, setModal] = useState(null); // { tipo: "crear" | "detalle" | "editar" | "ingreso" | "masiva", medicamento? }

    const filtrados = useMemo(() => filtrarMedicamentos(medicamentos, filtros), [medicamentos, filtros]);
    const paginacion = useListaPaginada(filtrados, { reiniciarCon: filtros });
    const cerrar = () => setModal(null);
    const filtro = (campo) => ({
        value: filtros[campo],
        onChange: (e) => setFiltros((f) => ({ ...f, [campo]: e.target.value })),
    });

    return (
        <div className="container mx-auto mb-12 mt-6">
            <div className="mx-auto w-[95%] overflow-hidden rounded-xl border border-gray-100 bg-white p-3 shadow-xl sm:p-5">
                <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h1 className="text-lg font-bold text-primario">Productos en Inventario</h1>
                        <p className="text-sm text-gray-500">{filtrados.length} resultados</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <label className="flex items-center gap-2 text-sm text-gray-600">
                            <span>Productos por hoja</span>
                            <select
                                value={paginacion.porPagina}
                                onChange={(e) => paginacion.cambiarPorPagina(Number(e.target.value))}
                                className="rounded-lg border border-gray-300 px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#084788]"
                            >
                                {[10, 25, 50, 100].map((cantidad) => (
                                    <option key={cantidad} value={cantidad}>{cantidad}</option>
                                ))}
                            </select>
                        </label>
                        <button
                            type="button"
                            onClick={() => setModal({ tipo: "masiva" })}
                            className="verde-btn flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold"
                        >
                            <FontAwesomeIcon icon={faFileExcel} /> Carga Masiva
                        </button>
                        <button
                            type="button"
                            onClick={() => setModal({ tipo: "crear" })}
                            className="azul-btn flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold"
                        >
                            <FontAwesomeIcon icon={faPlus} /> Agregar Medicamento
                        </button>
                    </div>
                </div>

                <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <FloatingInput id="filtro-nombre" label="Buscar por nombre" {...filtro("nombre")} />
                    <FloatingInput id="filtro-presentacion" label="Buscar por presentación" {...filtro("presentacion")} />
                    <FloatingSelect id="filtro-stock" label="Estado de stock" options={FILTRO_STOCK_OPTIONS} {...filtro("stock")} />
                </div>

                <MedicamentosTabla
                    medicamentos={paginacion.visibles}
                    numeroInicial={Math.max(paginacion.desde, 1)}
                    emptyText={textoVacio({ cargando, fallo, total: medicamentos.length })}
                    onSeleccionar={(medicamento) => setModal({ tipo: "detalle", medicamento })}
                    onIngresarStock={(medicamento) => setModal({ tipo: "ingreso", medicamento })}
                />
                {fallo && (
                    <div className="mt-3 text-center">
                        <button
                            type="button"
                            onClick={recargar}
                            className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                            Reintentar
                        </button>
                    </div>
                )}

                <div className="mt-5">
                    <Paginacion paginacion={paginacion} etiqueta="productos" />
                </div>
            </div>

            {(modal?.tipo === "crear" || modal?.tipo === "editar") && (
                <MedicamentoModal token={token} campania={campania} medicamento={modal.medicamento} onClose={cerrar} onGuardado={recargar} />
            )}
            {modal?.tipo === "detalle" && (
                <DetalleMedicamentoModal
                    id={modal.medicamento.id}
                    token={token}
                    onClose={cerrar}
                    onEditar={(medicamento) => setModal({ tipo: "editar", medicamento })}
                />
            )}
            {modal?.tipo === "ingreso" && (
                <IngresoStockModal token={token} usuario={usuario} medicamento={modal.medicamento} onClose={cerrar} onGuardado={recargar} />
            )}
            {modal?.tipo === "masiva" && (
                <CargaMasivaMedicamentos token={token} campania={campania} existentes={medicamentos} onClose={cerrar} onCargado={recargar} />
            )}
        </div>
    );
}
