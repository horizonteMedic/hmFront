import { useEffect, useRef, useState } from "react";
import { faBroom, faCalendarDay, faPrint, faTrash, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InputCheckbox from "../../../../../components/reusableComponents/InputCheckbox";
import { SelectField } from "../../../../../components/reusableComponents/InputSelect";
import InputsRadioGroup from "../../../../../components/reusableComponents/InputsRadioGroup";
import InputTextOneLine from "../../../../../components/reusableComponents/InputTextOneLine";
import SectionFieldset from "../../../../../components/reusableComponents/SectionFieldset";
import { useForm } from "../../../../../hooks/useForm";
import { useSessionData } from "../../../../../hooks/useSessionData";
import { getToday } from "../../../../../utils/helpers";
import EmpleadoComboBox from "../../../../../components/reusableComponents/EmpleadoComboBox";
import { BuscarPacientes, ObtenerPorId } from "./controllerTicketAsistencial";

const METODOS_PAGO = [
    { value: "CONTADO", label: "CONTADO" },
    { value: "CREDITO", label: "CREDITO" },
    { value: "TARJETA_DEBITO", label: "TARJETA DEBITO" },
    { value: "TARJETA_CREDITO", label: "TARJETA CREDITO" },
    { value: "TRANSFERENCIA", label: "TRANSFERENCIA" },
    { value: "YAPE/PLIN", label: "YAPE / PLIN" },
];

const AUTORIZADO_POR = [
    { value: "ARTEMIO", label: "DR. ARTEMIO" },
    { value: "CARLOS", label: "CARLOS" },
    { value: "LILIANA", label: "LILIANA" },
    { value: "CONVENIO", label: "CONVENIO" },
    { value: "CORREO", label: "POR CORREO" },
    { value: "OTROS", label: "OTROS" },
];

const DESCUENTOS = [
    { value: "0", label: "0%" },
    { value: "5", label: "5%" },
    { value: "10", label: "10%" },
    { value: "15", label: "15%" },
    { value: "20", label: "20%" },
    { value: "25", label: "25%" },
    { value: "50", label: "50%" },
];

// Buscador de pacientes sin DNI: autocompletado por nombres/apellidos contra
// /buscarPacientes; al elegir un resultado se bloquea el input con el paciente elegido.
function BuscadorPacienteSinDni({ token, locked, selectedLabel, onSelect, onClear }) {
    const [query, setQuery] = useState("");
    const [resultados, setResultados] = useState([]);
    const [buscando, setBuscando] = useState(false);
    const [show, setShow] = useState(false);
    const boxRef = useRef(null);
    const debounceRef = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (boxRef.current && !boxRef.current.contains(e.target)) setShow(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    useEffect(() => {
        if (locked) return;
        clearTimeout(debounceRef.current);
        const texto = query.trim();
        if (texto.length < 2) {
            setResultados([]);
            setBuscando(false);
            return;
        }
        setBuscando(true);
        debounceRef.current = setTimeout(async () => {
            const lista = await BuscarPacientes(texto, token);
            setResultados(lista);
            setBuscando(false);
        }, 350);
        return () => clearTimeout(debounceRef.current);
    }, [query, token, locked]);

    const handlePick = (item) => {
        setShow(false);
        setResultados([]);
        setQuery("");
        onSelect(item);
    };

    if (locked) {
        return (
            <div className="flex items-center gap-4">
                <label className="font-semibold" style={{ minWidth: "120px", maxWidth: "120px" }}>
                    Paciente :
                </label>
                <div className="flex items-center gap-2 w-full">
                    <input
                        type="text"
                        value={selectedLabel}
                        disabled
                        className="border rounded px-2 py-1 w-full bg-gray-300 font-semibold"
                    />
                    <button
                        type="button"
                        onClick={onClear}
                        title="Cambiar paciente"
                        className="text-red-600 hover:text-red-800 px-2"
                    >
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-4" ref={boxRef}>
            <label className="font-semibold" style={{ minWidth: "120px", maxWidth: "120px" }}>
                Buscar Paciente :
            </label>
            <div className="relative w-full">
                <input
                    type="text"
                    autoComplete="off"
                    value={query}
                    placeholder="Escriba apellidos y/o nombres (mín. 2 letras)"
                    style={{ textTransform: "uppercase" }}
                    className="border rounded px-2 py-1 w-full"
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setShow(true);
                    }}
                    onFocus={() => setShow(true)}
                />
                {show && query.trim().length >= 2 && (
                    <div className="absolute z-20 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-56 overflow-y-auto shadow-lg">
                        {buscando ? (
                            <div className="p-2 text-sm text-gray-500">Buscando...</div>
                        ) : resultados.length === 0 ? (
                            <div className="p-2 text-sm text-gray-500">Sin coincidencias</div>
                        ) : (
                            resultados.map((r) => (
                                <div
                                    key={r.idDatos}
                                    className="cursor-pointer p-2 hover:bg-gray-200"
                                    onClick={() => handlePick(r)}
                                >
                                    <div className="font-semibold">
                                        {r.apellidos} {r.nombres}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {r.dni ? `DNI: ${r.dni}` : "Sin DNI"}
                                        {r.historiaClinica ? ` · HC: ${r.historiaClinica}` : ""}
                                        {r.edad ? ` · ${r.edad} años` : ""}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function TicketAsistencial() {

    const today = getToday();

    const { token, userlogued, selectedSede, datosFooter, userName, hora } = useSessionData();

    const initialFormState = {
        // Datos básicos
        tipoDocumento: "DNI",
        documentoIdentidad: "",
        idDatos: null,
        dni: null,
        NHCL: "",
        nroTicket: "",
        codVendedor: "",

        // Médico que Certifica //BUSCADOR
        nombre_medico: userName,
        user_medicoFirma: userlogued,

        nombres: "",
        empresa: "",

        menorCincoAños: false,
        adolescente: false,
        adulto: true,
        adultoMayor: false,

        // Agregar Servicios Ticket
        servicio: "",
        codServicio: "",
        precio: "",
        unidad: "",
        descuento: "0",
        ticketItems: [],

        fecha: today,
    };

    const {
        form,
        setForm,
        handleChange,
        handleChangeNumberDecimals,
        handleRadioButton,
        handleChangeSimple,
        handleCheckBoxChange,
        handleClear,
        handleClearnotO,
        handlePrintDefault,
    } = useForm(initialFormState, { storageKey: "fichaAptitudAnexo2" });

    // Paciente elegido en el buscador de "Sin DNI" (bloquea el input tras seleccionarlo)
    const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);

    // Al cambiar el tipo de documento se descarta cualquier selección previa del buscador
    useEffect(() => {
        if (form.tipoDocumento !== "SIN DNI" && pacienteSeleccionado) {
            setPacienteSeleccionado(null);
        }
    }, [form.tipoDocumento]);

    const handleSeleccionarPacienteSinDni = async (item) => {
        setPacienteSeleccionado({
            idDatos: item.idDatos,
            label: `${item.apellidos ?? ""} ${item.nombres ?? ""}`.trim(),
        });
        await ObtenerPorId(item.idDatos, token, setForm);
    };

    const handleLimpiarPacienteSinDni = () => {
        setPacienteSeleccionado(null);
        setForm((f) => ({
            ...f,
            idDatos: null,
            dni: null,
            documentoIdentidad: "",
            nombres: "",
            NHCL: "",
        }));
    };

    const handleSearch = (e) => {
        if (e.key === "Enter") {
            // handleClearnotO();
            // VerifyTR(form.norden, tabla, token, setForm, selectedSede);
        }
    };

    const calcularTotalItem = (precio, cantidad, descuentoPorcentaje) => {
        const subtotal = (Number(precio) || 0) * (Number(cantidad) || 0);
        const total = subtotal - subtotal * ((Number(descuentoPorcentaje) || 0) / 100);
        return total.toFixed(2);
    };

    const handleAgregarServicio = () => {
        if (!form.servicio || !form.precio) return;
        const nuevoItem = {
            cod: form.codServicio,
            cantidad: 1,
            unidad: form.unidad,
            descripcion: form.servicio,
            precio: form.precio,
            descuento: form.descuento || 0,
            total: calcularTotalItem(form.precio, 1, form.descuento),
        };
        setForm((f) => ({
            ...f,
            ticketItems: [...(f.ticketItems || []), nuevoItem],
            servicio: "",
            codServicio: "",
            precio: "",
            unidad: "",
            descuento: "",
        }));
    };

    const handleEliminarServicio = (index) => {
        setForm((f) => ({
            ...f,
            ticketItems: f.ticketItems.filter((_, i) => i !== index),
        }));
    };

    const handleCantidadItemChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;
        setForm((f) => ({
            ...f,
            ticketItems: f.ticketItems.map((item, i) => {
                if (i !== index) return item;
                const cantidad = value;
                return {
                    ...item,
                    cantidad,
                    total: calcularTotalItem(item.precio, cantidad || 0, item.descuento),
                };
            }),
        }));
    };

    const handleImprimirFecha = () => {
        handlePrintDefault(() => {
            window.print();
        });
    };

    const handleImprimirTicket = () => {
        handlePrintDefault(() => {
            window.print();
        });
    };

    return (
        <div className="mx-auto max-w-[90%] lg:max-w-[80%] grid gap-y-3 gap-x-4 py-4">
            <SectionFieldset legend="Información del Examen" className="grid xl:grid-cols-4 gap-y-3 gap-x-4">
                <InputsRadioGroup
                    name="tipoDocumento"
                    value={form.tipoDocumento}
                    label="Tipo de Documento"
                    labelWidth="120px"
                    onChange={handleRadioButton}
                    options={[
                        { label: "DNI", value: "DNI" },
                        { label: "Pasaporte", value: "PASAPORTE" },
                        { label: "Sin DNI", value: "SIN DNI" },
                    ]}
                    className="xl:col-span-4"
                />
                {form.tipoDocumento == "SIN DNI" ?
                    <BuscadorPacienteSinDni
                        token={token}
                        locked={!!pacienteSeleccionado}
                        selectedLabel={pacienteSeleccionado?.label ?? ""}
                        onSelect={handleSeleccionarPacienteSinDni}
                        onClear={handleLimpiarPacienteSinDni}
                    />
                    :
                    <InputTextOneLine
                        label={`${form.tipoDocumento === "DNI" ? "DNI" : form.tipoDocumento === "PASAPORTE" ? "Pasaporte" : "Sin DNI"}`}
                        name="documentoIdentidad"
                        value={form.documentoIdentidad}
                        onChange={handleChangeNumberDecimals}
                        onKeyUp={handleSearch}
                        disabled={form.tipoDocumento === "SIN DNI"}
                        labelWidth="120px"
                    />
                }
                <InputTextOneLine
                    label="NHCL"
                    name="NHCL"
                    value={form?.NHCL}
                    disabled
                    onKeyUp={handleSearch}
                />
                <InputTextOneLine
                    label="N° Ticket"
                    name="nroTicket"
                    value={form?.nroTicket}
                    disabled
                    onKeyUp={handleSearch}
                />
                <InputTextOneLine
                    label="Código Vendedor"
                    name="codVendedor"
                    value={form?.codVendedor}
                    onChange={handleChangeNumberDecimals}
                    onKeyUp={handleSearch}
                />
            </SectionFieldset>

            <SectionFieldset legend="Datos" className="grid grid-cols-1 xl:grid-cols-2 gap-x-4 gap-y-3">
                <InputTextOneLine
                    label="Apellidos y Nombres"
                    name="nombres"
                    value={form.nombres}
                    labelWidth="120px"
                    disabled
                    className="xl:col-span-2"
                />
                <InputTextOneLine
                    label="Empresa"
                    name="empresa"
                    value={form.empresa}
                    labelWidth="120px"
                />
                <SelectField
                    label="Método de pago"
                    name="metodoPago"
                    value={form.metodoPago}
                    onChange={handleChangeSimple}
                    options={METODOS_PAGO}
                    inline
                    labelWidth="120px"
                />
                <SelectField
                    label="Autorizado por"
                    name="autorizadoPor"
                    value={form.autorizadoPor}
                    onChange={handleChangeSimple}
                    options={AUTORIZADO_POR}
                    inline
                    labelWidth="120px"
                />
                <div className="flex flex-wrap items-center gap-6">
                    <InputCheckbox
                        label="< 5 AÑOS"
                        name="menorCincoAños"
                        checked={form.menorCincoAños}
                        // onChange={handleCheckBoxChange}
                        disabled
                        className="opacity-60"
                    />
                    <InputCheckbox
                        label="ADOLESCENTE"
                        name="adolescente"
                        checked={form.adolescente}
                        // onChange={handleCheckBoxChange}
                        disabled
                        className="opacity-60"
                    />
                    <InputCheckbox
                        label="ADULTO"
                        name="adulto"
                        checked={form.adulto}
                        disabled
                    // onChange={handleCheckBoxChange}
                    />
                    <InputCheckbox
                        label="ADULTO MAYOR"
                        name="adultoMayor"
                        checked={form.adultoMayor}
                        // onChange={handleCheckBoxChange}
                        disabled
                        className="opacity-60"
                    />
                </div>
                <EmpleadoComboBox
                    value={form.nombre_medico}
                    label="Doctor"
                    form={form}
                    onChange={handleChangeSimple}
                />
            </SectionFieldset>

            <SectionFieldset legend="Agregar Servicios Ticket" className="grid grid-cols-1 xl:grid-cols-[1fr_150px] gap-x-6 gap-y-3">
                <div className="grid grid-cols-1 gap-y-3">
                    <InputTextOneLine
                        label="Servicio"
                        name="servicio"
                        value={form.servicio}
                        onChange={handleChangeSimple}
                    />
                    <div className="grid grid-cols-1 xl:grid-cols-4 gap-x-4 gap-y-3">
                        <InputTextOneLine
                            label="Cod. Servicio"
                            name="codServicio"
                            value={form.codServicio}
                            disabled
                        />
                        <InputTextOneLine
                            label="Precio"
                            name="precio"
                            value={form.precio}
                            disabled
                        />
                        <InputTextOneLine
                            label="Unidad"
                            name="unidad"
                            value={form.unidad}
                            disabled
                        />
                        <SelectField
                            label="Descuento"
                            name="descuento"
                            value={form.descuento}
                            onChange={handleChangeSimple}
                            hidePlaceHolder
                            options={DESCUENTOS}
                            inline
                            labelWidth="80px"
                        />
                    </div>
                </div>
                <button
                    type="button"
                    onClick={handleAgregarServicio}
                    className="w-full h-8 xl:h-full bg-[#007bff] hover:bg-blue-700 text-white rounded-md transition-all duration-150 ease-out active:scale-95"
                >
                    Agregar
                </button>
            </SectionFieldset>

            <SectionFieldset legend="Servicios Agregados" className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                    <thead>
                        <tr className="bg-gray-100 text-left">
                            <th className="border px-2 py-1">Cod</th>
                            <th className="border px-2 py-1">Cant</th>
                            <th className="border px-2 py-1">Unidad</th>
                            <th className="border px-2 py-1">Descripción</th>
                            <th className="border px-2 py-1">P.Unitario</th>
                            <th className="border px-2 py-1">Dscto</th>
                            <th className="border px-2 py-1">Total</th>
                            <th className="border px-2 py-1"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {form.ticketItems?.length ? (
                            form.ticketItems.map((item, index) => (
                                <tr key={index}>
                                    <td className="border px-2 py-1">{item.cod}</td>
                                    <td className="border px-2 py-1">
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            value={item.cantidad}
                                            onChange={(e) => handleCantidadItemChange(index, e.target.value)}
                                            className="w-14 border rounded px-1 py-0.5 text-center"
                                        />
                                    </td>
                                    <td className="border px-2 py-1">{item.unidad}</td>
                                    <td className="border px-2 py-1">{item.descripcion}</td>
                                    <td className="border px-2 py-1">{item.precio}</td>
                                    <td className="border px-2 py-1">{item.descuento}%</td>
                                    <td className="border px-2 py-1">{item.total}</td>
                                    <td className="border px-2 py-1 text-center">
                                        <button
                                            type="button"
                                            onClick={() => handleEliminarServicio(index)}
                                            className="text-red-600 hover:text-red-800"
                                            title="Eliminar"
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8} className="border px-2 py-3 text-center text-gray-500">
                                    No hay servicios agregados
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

            </SectionFieldset>

            <SectionFieldset legend="Fecha" className="grid xl:grid-cols-3 gap-y-3 gap-x-4">
                <InputTextOneLine
                    label="Fecha"
                    name="fecha"
                    value={form.fecha}
                    type="Date"
                    disabled
                />
                <InputTextOneLine
                    label="Hora"
                    name="hora"
                    value={hora}
                    inputClassName="font-bold"
                    disabled
                />
            </SectionFieldset>


            <div className="flex flex-col md:flex-row justify-center items-center gap-4">
                <button
                    type="button"
                    onClick={handleImprimirFecha}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-base px-6 py-2 rounded flex items-center gap-2 transition-all duration-150 ease-out hover:shadow-lg active:scale-95 active:shadow-inner"
                >
                    <FontAwesomeIcon icon={faCalendarDay} /> Imprimir Fecha
                </button>
                <button
                    type="button"
                    onClick={handleImprimirTicket}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-base px-6 py-2 rounded flex items-center gap-2 transition-all duration-150 ease-out hover:shadow-lg active:scale-95 active:shadow-inner"
                >
                    <FontAwesomeIcon icon={faPrint} /> Imprimir Ticket
                </button>
                <button
                    type="button"
                    onClick={handleClear}
                    className="bg-amber-500 hover:bg-amber-600 text-white text-base px-6 py-2 rounded flex items-center gap-2 transition-all duration-150 ease-out hover:shadow-lg active:scale-95 active:shadow-inner"
                >
                    <FontAwesomeIcon icon={faBroom} /> Limpiar
                </button>
            </div>
        </div>
    )
}