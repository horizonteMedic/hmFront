import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faFileExcel } from "@fortawesome/free-solid-svg-icons";
import InputTextOneLine from "../../../../../components/reusableComponents/InputTextOneLine";
import { SelectField } from "../../../../../components/reusableComponents/InputSelect";
import SectionFieldset from "../../../../../components/reusableComponents/SectionFieldset";
import BotonesForm from "../../../../../components/templates/BotonesForm";
import TablaTemplate from "../../../../../components/templates/TablaTemplate";
import { useForm } from "../../../../../hooks/useForm";
import { useSessionData } from "../../../../../hooks/useSessionData";
import { formatearFechaHora } from "../../../../../utils/formatDateUtils";
import { usePagination } from "../../../../../utils/listUtils";
import { normalizarTexto } from "../inventarioUtils";
import { ObtenerCatalogoMedicamentos, RegistrarMedicamento, ValidarMedicamento } from "./controllerMedicamentos";
import ModalCargaMasivaMedicamentos from "./ModalCargaMasivaMedicamentos/ModalCargaMasivaMedicamentos";

const initialFormState = {
    nombre: "",
    presentacion: "",
    tipoMedicamento: "",
    stockMinimo: "",
};

const columnas = [
    { label: "Nombre", accessor: "nombre", width: "24%" },
    { label: "Presentación", accessor: "presentacion", width: "16%" },
    { label: "Tipo", accessor: "tipoMedicamentoDescripcion", width: "14%" },
    { label: "Stock Mínimo", accessor: "stockMinimo", width: "10%" },
    {
        label: "Estado",
        width: "9%",
        render: (row) => (
            <span className={`px-2 py-0.5 rounded text-sm font-semibold ${row.activo ? "bg-emerald-100 text-emerald-700" : "bg-gray-200 text-gray-600"}`}>
                {row.activo ? "Activo" : "Inactivo"}
            </span>
        ),
    },
    { label: "Registrado por", accessor: "usuarioRegistro", width: "13%" },
    { label: "Fecha de Registro", width: "14%", render: (row) => formatearFechaHora(row.fechaRegistro) },
];

export default function Medicamentos() {
    const { token, userlogued } = useSessionData();
    const { form, handleChange, handleChangeSimple, handleChangeNumberDecimals, handleClear } = useForm(initialFormState);

    const [medicamentos, setMedicamentos] = useState([]);
    const [tipos, setTipos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [errorCarga, setErrorCarga] = useState("");
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

    const { currentPage, setCurrentPage, recordsPerPage, totalPages, visiblePages, paginatedData, handleChangeRecordsPerPage } =
        usePagination(medicamentosFiltrados, 10);

    // Al cambiar un filtro la lista puede quedar más corta que la página actual.
    useEffect(() => {
        setCurrentPage(1);
    }, [filtroNombre, filtroTipo]);

    const cargar = async () => {
        setCargando(true);
        await ObtenerCatalogoMedicamentos(token, setMedicamentos, setTipos, setErrorCarga);
        setCargando(false);
    };

    useEffect(() => {
        cargar();
    }, []);

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
    };

    const handleSave = async () => {
        const erroresForm = ValidarMedicamento(form, medicamentos);
        setErrores(erroresForm);
        if (Object.keys(erroresForm).length > 0) return;

        const registrado = await RegistrarMedicamento(form, token, userlogued);
        if (!registrado) return;

        handleClear();
        setErrores({});
        cargar();
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
                <InputTextOneLine
                    label="Presentación"
                    name="presentacion"
                    labelWidth="110px"
                    value={form.presentacion}
                    onChange={onChange}
                    required
                    error={errores.presentacion}
                />
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
                {errorCarga && (
                    <div className="flex items-center justify-between gap-4 mb-3 p-3 rounded border border-red-300 bg-red-50 text-red-700">
                        <span>{errorCarga}</span>
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
                    emptyText={cargando ? "Cargando medicamentos..." : "No hay medicamentos registrados"}
                />

                <div className="flex flex-col md:flex-row items-center justify-between gap-3 mt-3">
                    <div className="flex items-center gap-2">
                        <span>Mostrar</span>
                        <select className="border border-gray-300 rounded-md px-2 py-1" value={recordsPerPage} onChange={handleChangeRecordsPerPage}>
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={-1}>Todos</option>
                        </select>
                        <span>de {medicamentosFiltrados.length} medicamentos</span>
                    </div>

                    <div className="flex justify-center">
                        <button
                            type="button"
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="mx-1 px-3 py-1 !bg-[#fc6b03] text-white rounded-md disabled:opacity-50"
                        >
                            <FontAwesomeIcon icon={faChevronLeft} />
                        </button>
                        {visiblePages.map((page) => (
                            <button
                                key={page}
                                type="button"
                                onClick={() => setCurrentPage(page)}
                                className={`mx-1 px-3 py-1 rounded-md ${currentPage === page ? "!bg-[#233245] text-white" : "bg-gray-200"}`}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            type="button"
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="mx-1 px-3 py-1 !bg-[#fc6b03] text-white rounded-md disabled:opacity-50"
                        >
                            <FontAwesomeIcon icon={faChevronRight} />
                        </button>
                    </div>
                </div>
            </SectionFieldset>

            <ModalCargaMasivaMedicamentos
                isOpen={modalMasivo}
                onRequestClose={() => setModalMasivo(false)}
                tipos={tipos}
                medicamentos={medicamentos}
                token={token}
                usuario={userlogued}
                onSuccess={cargar}
            />
        </div>
    );
}
