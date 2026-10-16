import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import InputTextOneLine from "../../../../../components/reusableComponents/InputTextOneLine";
import { SelectField } from "../../../../../components/reusableComponents/InputSelect";
import SectionFieldset from "../../../../../components/reusableComponents/SectionFieldset";
import SelectorColumnas from "../../../../../components/reusableComponents/SelectorColumnas";
import TablaTemplate from "../../../../../components/templates/TablaTemplate";
import { useSessionData } from "../../../../../hooks/useSessionData";
import { formatearFechaHora } from "../../../../../utils/formatDateUtils";
import { usePagination } from "../../../../../utils/listUtils";
import AvisoError from "../AvisoError";
import { normalizarTexto } from "../inventarioUtils";
import PaginadorTabla from "../PaginadorTabla";
import SelectorInventario from "../SelectorInventario";
import { useConsultaInventario } from "../useConsultaInventario";
import { useInventarios } from "../useInventarios";
import { ObtenerListaMedicamentos, ObtenerTiposMedicamento } from "./controllerMedicamentos";
import ModalCargaMasivaMedicamentos from "./ModalCargaMasivaMedicamentos/ModalCargaMasivaMedicamentos";
import ModalRegistrarMedicamento from "./ModalRegistrarMedicamento/ModalRegistrarMedicamento";

// Cada columna lleva un `id` para poder mostrarla u ocultarla desde el selector de columnas.
const columnas = [
    { id: "nombre", label: "Nombre", accessor: "nombre", width: "17%" },
    { id: "presentacion", label: "Presentación", accessor: "presentacion", width: "10%" },
    { id: "tipo", label: "Tipo", accessor: "tipoMedicamentoDescripcion", width: "10%" },
    { id: "stockMinimo", label: "Stock Mínimo", accessor: "stockMinimo", width: "9%" },
    { id: "stockActual", label: "Stock Actual", width: "8%", render: (row) => row.stockActual ?? "—" },
    { id: "stockReservado", label: "Stock Reservado", width: "10%", render: (row) => row.stockReservado ?? "—" },
    { id: "stockDisponible", label: "Stock Disponible", width: "10%", render: (row) => <strong>{row.stockDisponible ?? "—"}</strong> },
    {
        id: "estado",
        label: "Estado",
        width: "8%",
        render: (row) => (
            <span className={`px-2 py-0.5 rounded text-sm font-semibold ${row.activo ? "bg-emerald-100 text-emerald-700" : "bg-gray-200 text-gray-600"}`}>
                {row.activo ? "Activo" : "Inactivo"}
            </span>
        ),
    },
    { id: "usuarioRegistro", label: "Registrado por", width: "9%", render: (row) => row.usuarioRegistroNombre || row.usuarioRegistro },
    { id: "fechaRegistro", label: "Fecha de Registro", width: "9%", render: (row) => formatearFechaHora(row.fechaRegistro) },
];

// Columnas que la tabla trae ocultas; el usuario puede mostrarlas desde "Columnas".
const COLUMNAS_OCULTAS_INICIALES = ["stockMinimo", "stockActual", "stockReservado"];

export default function Medicamentos() {
    const { token, userlogued } = useSessionData();
    const { inventarios, inventarioId, setInventarioId, cargandoInventarios, errorInventarios, cargarInventarios } = useInventarios(token);

    // El catálogo es único; lo que cambia con el inventario elegido es el stock que se muestra de cada medicamento.
    const { datos: medicamentos, cargando, error: errorMedicamentos, ejecutar } = useConsultaInventario();
    const [tipos, setTipos] = useState([]);
    const [errorTipos, setErrorTipos] = useState("");
    const [filtroNombre, setFiltroNombre] = useState("");
    const [filtroTipo, setFiltroTipo] = useState("");
    const [columnasOcultas, setColumnasOcultas] = useState(COLUMNAS_OCULTAS_INICIALES);
    const [modalRegistro, setModalRegistro] = useState(false);
    const [modalMasivo, setModalMasivo] = useState(false);

    const opcionesTipo = useMemo(() => tipos.map((tipo) => ({ value: String(tipo.codigo), label: tipo.descripcion })), [tipos]);

    const columnasVisibles = useMemo(() => columnas.filter((columna) => !columnasOcultas.includes(columna.id)), [columnasOcultas]);

    const alternarColumna = (id) =>
        setColumnasOcultas((actuales) => (actuales.includes(id) ? actuales.filter((oculta) => oculta !== id) : [...actuales, id]));

    const medicamentosFiltrados = useMemo(() => {
        const texto = normalizarTexto(filtroNombre);
        return medicamentos.filter((medicamento) => {
            if (filtroTipo && String(medicamento.tipoMedicamento) !== filtroTipo) return false;
            return !texto || normalizarTexto(`${medicamento.nombre} ${medicamento.presentacion}`).includes(texto);
        });
    }, [medicamentos, filtroNombre, filtroTipo]);

    const paginacion = usePagination(medicamentosFiltrados, 10);
    const { setCurrentPage, paginatedData } = paginacion;

    // Al cambiar un filtro la lista puede quedar más corta que la página actual.
    useEffect(() => {
        setCurrentPage(1);
    }, [filtroNombre, filtroTipo]);

    const cargarTipos = async () => {
        const res = await ObtenerTiposMedicamento(token);
        if (!res.ok) {
            setErrorTipos(res.mensaje);
            return;
        }
        setErrorTipos("");
        setTipos(Array.isArray(res.resultado) ? res.resultado : []);
    };

    const cargarMedicamentos = () => ejecutar(() => ObtenerListaMedicamentos(token, false, inventarioId));

    const reintentar = () => {
        cargarTipos();
        cargarMedicamentos();
    };

    useEffect(() => {
        cargarTipos();
    }, []);

    // Se espera a saber qué inventario se muestra (por defecto el central) para pedir el catálogo con su stock. Si
    // los inventarios no cargaron, igual se pide el catálogo, sin stock, para poder registrar medicamentos.
    useEffect(() => {
        if (!cargandoInventarios) cargarMedicamentos();
    }, [inventarioId, cargandoInventarios]);

    // Sin los tipos no se puede registrar ni cargar medicamentos (el tipo es obligatorio).
    const sinTipos = tipos.length === 0;

    return (
        <div className="space-y-4 px-4 pb-4">
            <SectionFieldset legend="Medicamentos Registrados">
                <AvisoError mensaje={errorMedicamentos || errorTipos} onRetry={reintentar} />

                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <div title="El stock (actual, reservado y disponible) es el del inventario elegido; por defecto, el central.">
                        <SelectorInventario
                            compacto
                            inventarios={inventarios}
                            inventarioId={inventarioId}
                            onChange={(e) => setInventarioId(e.target.value)}
                            error={errorInventarios}
                            onRetry={cargarInventarios}
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setModalRegistro(true)}
                            disabled={sinTipos}
                            className="
                                bg-emerald-600 hover:bg-emerald-700
                                text-white text-base px-6 py-2 rounded
                                flex items-center gap-2
                                transition-all duration-150 ease-out
                                hover:shadow-lg
                                active:scale-95 active:shadow-inner
                                disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FontAwesomeIcon icon={faPlus} /> Agregar nuevo
                        </button>
                        <button
                            type="button"
                            onClick={() => setModalMasivo(true)}
                            disabled={sinTipos}
                            className="
                                bg-blue-600 hover:bg-blue-700
                                text-white text-base px-6 py-2 rounded
                                flex items-center gap-2
                                transition-all duration-150 ease-out
                                hover:shadow-lg
                                active:scale-95 active:shadow-inner
                                disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FontAwesomeIcon icon={faPlus} /> Masivo
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] items-start gap-4 mb-3">
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
                    <SelectorColumnas columnas={columnas} ocultas={columnasOcultas} onToggle={alternarColumna} />
                </div>

                <TablaTemplate
                    columns={columnasVisibles}
                    data={paginatedData}
                    height={450}
                    emptyText={cargando || cargandoInventarios ? "Cargando medicamentos..." : "No hay medicamentos registrados"}
                />

                <PaginadorTabla paginacion={paginacion} total={medicamentosFiltrados.length} etiqueta="medicamentos" />
            </SectionFieldset>

            <ModalRegistrarMedicamento
                isOpen={modalRegistro}
                onRequestClose={() => setModalRegistro(false)}
                opcionesTipo={opcionesTipo}
                medicamentos={medicamentos}
                token={token}
                usuario={userlogued}
                onSuccess={cargarMedicamentos}
            />

            <ModalCargaMasivaMedicamentos
                isOpen={modalMasivo}
                onRequestClose={() => setModalMasivo(false)}
                tipos={tipos}
                medicamentos={medicamentos}
                token={token}
                usuario={userlogued}
                onSuccess={cargarMedicamentos}
            />
        </div>
    );
}
