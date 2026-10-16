import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import InputTextOneLine from "../../../../../components/reusableComponents/InputTextOneLine";
import { SelectField } from "../../../../../components/reusableComponents/InputSelect";
import SectionFieldset from "../../../../../components/reusableComponents/SectionFieldset";
import BotonesForm from "../../../../../components/templates/BotonesForm";
import TablaTemplate from "../../../../../components/templates/TablaTemplate";
import { useForm } from "../../../../../hooks/useForm";
import { useSessionData } from "../../../../../hooks/useSessionData";
import { formatearFechaHora } from "../../../../../utils/formatDateUtils";
import { usePagination } from "../../../../../utils/listUtils";
import AvisoError from "../AvisoError";
import { normalizarTexto } from "../inventarioUtils";
import PaginadorTabla from "../PaginadorTabla";
import SelectorInventario from "../SelectorInventario";
import { useConsultaInventario } from "../useConsultaInventario";
import { useInventarios } from "../useInventarios";
import {
    OTRA_PRESENTACION,
    ObtenerListaMedicamentos,
    ObtenerTiposMedicamento,
    RegistrarMedicamento,
    ValidarMedicamento,
    opcionesPresentacion,
} from "./controllerMedicamentos";
import ModalCargaMasivaMedicamentos from "./ModalCargaMasivaMedicamentos/ModalCargaMasivaMedicamentos";

const initialFormState = {
    nombre: "",
    presentacion: "",
    presentacionOtro: "",
    tipoMedicamento: "",
    stockMinimo: "",
};

const columnas = [
    { label: "Nombre", accessor: "nombre", width: "19%" },
    { label: "Presentación", accessor: "presentacion", width: "11%" },
    { label: "Tipo", accessor: "tipoMedicamentoDescripcion", width: "11%" },
    { label: "Mínimo", accessor: "stockMinimo", width: "7%" },
    { label: "Actual", width: "7%", render: (row) => row.stockActual ?? "—" },
    { label: "Reservado", width: "8%", render: (row) => row.stockReservado ?? "—" },
    { label: "Disponible", width: "9%", render: (row) => <strong>{row.stockDisponible ?? "—"}</strong> },
    {
        label: "Estado",
        width: "8%",
        render: (row) => (
            <span className={`px-2 py-0.5 rounded text-sm font-semibold ${row.activo ? "bg-emerald-100 text-emerald-700" : "bg-gray-200 text-gray-600"}`}>
                {row.activo ? "Activo" : "Inactivo"}
            </span>
        ),
    },
    { label: "Registrado por", width: "10%", render: (row) => row.usuarioRegistroNombre || row.usuarioRegistro },
    { label: "Fecha de Registro", width: "10%", render: (row) => formatearFechaHora(row.fechaRegistro) },
];

export default function Medicamentos() {
    const { token, userlogued } = useSessionData();
    const { inventarios, inventarioId, setInventarioId, cargandoInventarios, errorInventarios, cargarInventarios } = useInventarios(token);
    const { form, handleChange, handleChangeSimple, handleChangeNumberDecimals, handleClear } = useForm(initialFormState);

    // El catálogo es único; lo que cambia con el inventario elegido es el stock que se muestra de cada medicamento.
    const { datos: medicamentos, cargando, error: errorMedicamentos, ejecutar } = useConsultaInventario();
    const [tipos, setTipos] = useState([]);
    const [errorTipos, setErrorTipos] = useState("");
    const [errores, setErrores] = useState({});
    const [filtroNombre, setFiltroNombre] = useState("");
    const [filtroTipo, setFiltroTipo] = useState("");
    const [modalMasivo, setModalMasivo] = useState(false);

    const opcionesTipo = useMemo(() => tipos.map((tipo) => ({ value: String(tipo.codigo), label: tipo.descripcion })), [tipos]);

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

    // Al corregir un campo se le quita el mensaje de error.
    const limpiarError = (campo) => setErrores((prev) => ({ ...prev, [campo]: "" }));

    const onChange = (e) => {
        handleChange(e);
        limpiarError(e.target.name);
    };

    const onChangeNumero = (e) => {
        handleChangeNumberDecimals(e, 0);
        limpiarError(e.target.name);
    };

    // El select no usa handleChange: este pone el valor en mayúsculas y restaura el cursor, algo que
    // un <select> no soporta.
    const onChangeSelect = (e) => {
        handleChangeSimple(e);
        limpiarError(e.target.name);
        if (e.target.name === "presentacion") limpiarError("presentacionOtro");
    };

    const handleSave = async () => {
        const erroresForm = ValidarMedicamento(form, medicamentos);
        setErrores(erroresForm);
        if (Object.keys(erroresForm).length > 0) return;

        const registrado = await RegistrarMedicamento(form, token, userlogued);
        if (!registrado) return;

        handleClear();
        setErrores({});
        cargarMedicamentos();
    };

    const handleLimpiar = () => {
        handleClear();
        setErrores({});
    };

    return (
        <div className="space-y-4 px-4 pb-4">
            <SectionFieldset legend="Registrar Medicamento" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputTextOneLine
                    label="Nombre"
                    name="nombre"
                    labelWidth="110px"
                    value={form.nombre}
                    onChange={onChange}
                    required
                    error={errores.nombre}
                />
                <SelectField
                    label="Presentación"
                    name="presentacion"
                    value={form.presentacion}
                    onChange={onChangeSelect}
                    options={opcionesPresentacion}
                    inline
                    labelWidth="110px"
                    required
                    error={errores.presentacion}
                />
                {form.presentacion === OTRA_PRESENTACION && (
                    <InputTextOneLine
                        label="Especifique"
                        name="presentacionOtro"
                        labelWidth="110px"
                        value={form.presentacionOtro}
                        onChange={onChange}
                        required
                        error={errores.presentacionOtro}
                    />
                )}
                <SelectField
                    label="Tipo"
                    name="tipoMedicamento"
                    value={form.tipoMedicamento}
                    onChange={onChangeSelect}
                    options={opcionesTipo}
                    inline
                    labelWidth="110px"
                    required
                    error={errores.tipoMedicamento}
                />
                <InputTextOneLine
                    label="Stock Mínimo"
                    name="stockMinimo"
                    labelWidth="110px"
                    value={form.stockMinimo}
                    onChange={onChangeNumero}
                    required
                    error={errores.stockMinimo}
                />
            </SectionFieldset>

            <BotonesForm hideEdit hidePrint saveLabel="Registrar" handleSave={handleSave} handleClear={handleLimpiar}>
                <button
                    type="button"
                    onClick={() => setModalMasivo(true)}
                    disabled={tipos.length === 0}
                    className="
                        bg-blue-600 hover:bg-blue-700
                        text-white text-base px-6 py-2 rounded
                        flex items-center gap-2
                        transition-all duration-150 ease-out
                        hover:shadow-lg
                        active:scale-95 active:shadow-inner
                        disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <FontAwesomeIcon icon={faFileExcel} /> Registro Masivo
                </button>
            </BotonesForm>

            <SectionFieldset legend="Medicamentos Registrados">
                <AvisoError mensaje={errorMedicamentos || errorTipos} onRetry={reintentar} />

                <div className="mb-3">
                    <SelectorInventario
                        inventarios={inventarios}
                        inventarioId={inventarioId}
                        onChange={(e) => setInventarioId(e.target.value)}
                        error={errorInventarios}
                        onRetry={cargarInventarios}
                    />
                    <p className="mt-1 text-sm text-gray-500">El stock (actual, reservado y disponible) es el del inventario elegido; por defecto, el central.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
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
                </div>

                <TablaTemplate
                    columns={columnas}
                    data={paginatedData}
                    height={450}
                    emptyText={cargando || cargandoInventarios ? "Cargando medicamentos..." : "No hay medicamentos registrados"}
                />

                <PaginadorTabla paginacion={paginacion} total={medicamentosFiltrados.length} etiqueta="medicamentos" />
            </SectionFieldset>

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
