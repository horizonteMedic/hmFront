import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { faBroom, faCalendarDay, faCircleExclamation, faPlus, faPrint, faTrash, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InputCheckbox from "../../../../../components/reusableComponents/InputCheckbox";
import { SelectField } from "../../../../../components/reusableComponents/InputSelect";
import InputsRadioGroup from "../../../../../components/reusableComponents/InputsRadioGroup";
import InputTextOneLine from "../../../../../components/reusableComponents/InputTextOneLine";
import SectionFieldset from "../../../../../components/reusableComponents/SectionFieldset";
import BotonesForm from "../../../../../components/templates/BotonesForm";
import { useForm } from "../../../../../hooks/useForm";
import { useSessionData } from "../../../../../hooks/useSessionData";
import { getToday } from "../../../../../utils/helpers";
import { LoadingDefault } from "../../../../../utils/functionUtils";
import EmpleadoComboBox from "../../../../../components/reusableComponents/EmpleadoComboBox";
import { BuscarPacientes, ListarServicios, CrearServicio, BuscarPorDni, BuscarPorPasaporte, RegistrarTicket, ObtenerTicketPorNumero } from "./controllerTicketAsistencial";
import TicketVenta from "../../../../../jaspers/TicketAsistencial/TicketVenta";

const METODOS_PAGO = [
    { value: "CONTADO", label: "CONTADO" },
    { value: "CREDITO", label: "CREDITO" },
    { value: "TARJETA DE DEBITO", label: "TARJETA DEBITO" },
    { value: "TARJETA DE CREDITO", label: "TARJETA CREDITO" },
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
                                    key={r.id}
                                    className="cursor-pointer p-2 hover:bg-gray-200"
                                    onClick={() => handlePick(r)}
                                >
                                    <div className="font-semibold">
                                        {r.apellidos} {r.nombres}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {r.numeroDocumento ? `${r.tipoDocumento ?? "DOC"}: ${r.numeroDocumento}` : "Sin Documento"}
                                        {r.numeroHistoriaClinica ? ` · HC: ${r.numeroHistoriaClinica}` : ""}
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

// Autocompletado de servicios: filtra el catálogo por descripción y, al elegir uno,
// entrega el objeto completo para llenar Cod. Servicio / Precio / Unidad.
function AutocompleteServicio({ label, value, options, onType, onSelect, labelWidth = "80px" }) {
    const [show, setShow] = useState(false);
    const boxRef = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (boxRef.current && !boxRef.current.contains(e.target)) setShow(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const text = value ?? "";
    const filtered = (text
        ? options.filter((o) => (o.descripcion ?? "").toLowerCase().includes(text.toLowerCase()))
        : options
    ).slice(0, 30);

    return (
        <div className="flex items-center gap-4" ref={boxRef}>
            <label className="font-semibold" style={{ minWidth: labelWidth, maxWidth: labelWidth }}>
                {label} :
            </label>
            <div className="relative w-full">
                <input
                    type="text"
                    autoComplete="off"
                    value={text}
                    placeholder="Escriba para buscar un servicio..."
                    className="border rounded px-2 py-1 w-full"
                    onChange={(e) => onType(e.target.value)}
                    onFocus={() => setShow(true)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && filtered.length > 0) {
                            e.preventDefault();
                            onSelect(filtered[0]);
                            setShow(false);
                        }
                    }}
                />
                {show && filtered.length > 0 && (
                    <div className="absolute z-20 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-56 overflow-y-auto shadow-lg">
                        {filtered.map((s) => (
                            <div
                                key={s.codigoServicio}
                                className="cursor-pointer p-2 hover:bg-gray-200"
                                onClick={() => {
                                    onSelect(s);
                                    setShow(false);
                                }}
                            >
                                <div className="font-semibold">{s.descripcion}</div>
                                <div className="text-xs text-gray-500">
                                    Cod: {s.codigoServicio} · S/ {s.precio} · {s.unidad}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// Modal para registrar un servicio nuevo en el catálogo (POST /api/servicios-generales).
function ModalNuevoServicio({ open, value, onChange, onClose, onSave, saving }) {
    if (!open) return null;

    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50 z-[60]">
            <div className="bg-white rounded-xl shadow-xl w-[420px] max-h-[85vh] flex flex-col">
                <div className="azuloscurobackground text-white px-4 py-3 flex justify-between items-center rounded-t-xl">
                    <h1 className="font-semibold text-base">Nuevo Servicio</h1>
                    <FontAwesomeIcon icon={faTimes} className="cursor-pointer" onClick={onClose} />
                </div>
                <div className="p-4 flex-1 overflow-y-auto space-y-3">
                    <InputTextOneLine
                        label="Cod. Servicio"
                        name="codigoServicio"
                        value={value.codigoServicio}
                        onChange={(e) => onChange({ ...value, codigoServicio: e.target.value })}
                        labelWidth="110px"
                    />
                    <InputTextOneLine
                        label="Descripción"
                        name="descripcion"
                        value={value.descripcion}
                        onChange={(e) => onChange({ ...value, descripcion: e.target.value })}
                        labelWidth="110px"
                    />
                    <InputTextOneLine
                        label="Precio"
                        name="precio"
                        value={value.precio}
                        onChange={(e) => onChange({ ...value, precio: e.target.value.replace(/[^0-9.]/g, "") })}
                        labelWidth="110px"
                    />
                    <InputTextOneLine
                        label="Unidad"
                        name="unidad"
                        value={value.unidad}
                        onChange={(e) => onChange({ ...value, unidad: e.target.value })}
                        labelWidth="110px"
                    />
                </div>
                <div className="p-3 border-t flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={onSave}
                        disabled={saving}
                        className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50"
                    >
                        {saving ? "Guardando..." : "Guardar"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function TicketAsistencial() {

    const today = getToday();

    const { token, userlogued, selectedSede, userName } = useSessionData();

    const initialFormState = {
        // Datos básicos
        tipoDocumento: "DNI",
        documentoIdentidad: "",
        idDatos: null,
        dni: null,
        fechaNacimiento: null,
        NHCL: "",
        nroTicket: "",
        codVendedor: "",

        metodoPago: "",
        autorizadoPor: "",

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
        handleChangeSimple,
        handleClear,
        handlePrintDefault,
    } = useForm(initialFormState, { storageKey: "ticketAsistencial" });

    const [errors, setErrors] = useState({});

    // Error inline del input "N° Ticket" de la sección IMPRIMIR (reimpresión manual).
    const [errorImprimirTicket, setErrorImprimirTicket] = useState("");

    // Paciente elegido en el buscador de "Sin DNI" (bloquea el input tras seleccionarlo)
    const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);

    // Cambiar el tipo de documento invalida cualquier dato ya cargado/tipeado, así que el
    // formulario se limpia por completo y solo conserva el nuevo tipo elegido.
    const handleTipoDocumentoChange = (e, value) => {
        setPacienteSeleccionado(null);
        setErrors({});
        setErrorImprimirTicket("");
        setForm({ ...initialFormState, tipoDocumento: value });
    };

    const handleSeleccionarPacienteSinDni = (item) => {
        setPacienteSeleccionado({
            idDatos: item.id,
            label: `${item.apellidos ?? ""} ${item.nombres ?? ""}`.trim(),
        });
        setForm((f) => ({
            ...f,
            idDatos: item.id ?? null,
            dni: item.numeroDocumento ?? null,
            documentoIdentidad: item.numeroDocumento ?? "",
            nombres: `${item.apellidos ?? ""} ${item.nombres ?? ""}`.trim(),
            NHCL: item.numeroHistoriaClinica ? parseInt(item.numeroHistoriaClinica) : null,
            fechaNacimiento: item.fechaNacimiento ?? null,
        }));
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
            fechaNacimiento: null,
        }));
    };

    // Catálogo de servicios generales, para autocompletar Cod. Servicio/Precio/Unidad
    const [servicios, setServicios] = useState([]);
    const [modalServicioOpen, setModalServicioOpen] = useState(false);
    const [nuevoServicio, setNuevoServicio] = useState({
        codigoServicio: "",
        descripcion: "",
        precio: "",
        unidad: "",
    });
    const [guardandoServicio, setGuardandoServicio] = useState(false);

    useEffect(() => {
        ListarServicios(token).then(setServicios);
    }, [token]);

    const handleSeleccionarServicio = (s) => {
        setForm((f) => ({
            ...f,
            servicio: s.descripcion ?? "",
            codServicio: s.codigoServicio ?? "",
            precio: s.precio ?? "",
            unidad: s.unidad ?? "",
        }));
    };

    const handleAbrirNuevoServicio = () => {
        setNuevoServicio({ codigoServicio: "", descripcion: "", precio: "", unidad: "" });
        setModalServicioOpen(true);
    };

    const handleGuardarNuevoServicio = async () => {
        const { codigoServicio, descripcion, precio, unidad } = nuevoServicio;
        if (!codigoServicio.trim() || !descripcion.trim() || !precio || !unidad.trim()) {
            Swal.fire("Error", "Complete todos los campos del servicio", "error");
            return;
        }

        setGuardandoServicio(true);
        const creado = await CrearServicio(
            {
                codigoServicio: codigoServicio.trim(),
                descripcion: descripcion.trim().toUpperCase(),
                precio: Number(precio),
                unidad: unidad.trim(),
                activo: true,
            },
            token
        );
        setGuardandoServicio(false);

        if (!creado) {
            Swal.fire("Error", "No se pudo registrar el servicio", "error");
            return;
        }

        setServicios((prev) => [...prev, creado]);
        handleSeleccionarServicio(creado);
        setModalServicioOpen(false);
        Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title: "Servicio registrado",
            showConfirmButton: false,
            timer: 1500,
        });
    };

    const handleSearch = (e) => {
        if (e.key !== "Enter") return;
        if (!form.documentoIdentidad) return;
        if (form.tipoDocumento === "DNI") {
            BuscarPorDni(form.documentoIdentidad, token, setForm);
        } else if (form.tipoDocumento === "PASAPORTE") {
            BuscarPorPasaporte(form.documentoIdentidad, token, setForm);
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
            descuento: "0",
        }));
    };

    // Limpia los inputs de "Agregar Servicios" sin necesidad de agregar el ítem a la tabla.
    const handleLimpiarServicioInputs = () => {
        setForm((f) => ({
            ...f,
            servicio: "",
            codServicio: "",
            precio: "",
            unidad: "",
            descuento: "0",
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

    const handleDescuentoItemChange = (index, value) => {
        setForm((f) => ({
            ...f,
            ticketItems: f.ticketItems.map((item, i) => {
                if (i !== index) return item;
                return {
                    ...item,
                    descuento: value,
                    total: calcularTotalItem(item.precio, item.cantidad, value),
                };
            }),
        }));
    };

    const totalGeneral = (form.ticketItems || []).reduce(
        (acc, item) => acc + (Number(item.total) || 0),
        0
    );

    // Todos los campos son obligatorios, excepto los de la sección "Agregar Servicios
    // Ticket" (esos solo alimentan la tabla; lo obligatorio ahí es tener al menos un ítem).
    const validateForm = () => {
        const next = {};
        if (!form.empresa?.trim()) next.empresa = "La empresa es obligatoria.";
        if (!form.metodoPago) next.metodoPago = "El método de pago es obligatorio.";
        if (!form.autorizadoPor) next.autorizadoPor = "Debe seleccionar quién autoriza el ticket.";
        if (!form.user_medicoFirma) next.nombre_medico = "Debe asignar un doctor.";
        if (!String(form.codVendedor ?? "").trim()) next.codVendedor = "El código de vendedor es obligatorio.";
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleClearForm = () => {
        setErrors({});
        setErrorImprimirTicket("");
        setPacienteSeleccionado(null);
        handleClear();
    };

    const handleRegistrarTicket = async () => {
        if (!form.idDatos) {
            Swal.fire("Error", "Debe buscar y seleccionar un paciente antes de registrar el ticket.", "error");
            return;
        }
        if (!validateForm()) return;
        if (!form.ticketItems?.length) {
            Swal.fire("Error", "Agregue al menos un servicio al ticket.", "error");
            return;
        }

        const ahora = new Date();
        const pad = (n) => String(n).padStart(2, "0");
        const horaTicket = `${pad(ahora.getHours())}:${pad(ahora.getMinutes())}:${pad(ahora.getSeconds())}`;

        const body = {
            pacienteId: form.idDatos,
            medico: form.nombre_medico || null,
            descuento: 0,
            fechaTicket: form.fecha,
            horaTicket,
            serieTicket: selectedSede || "",
            operador: userlogued || null,
            modoPago: form.metodoPago || null,
            empresa: form.empresa || null,
            codigoVendedor: form.codVendedor ? Number(form.codVendedor) : null,
            autoriza: form.autorizadoPor || null,
            contenidos: form.ticketItems.map((item) => ({
                codigoServicio: item.cod || null,
                cantidad: Number(item.cantidad) || 0,
                precioUnitario: Number(item.precio) || 0,
                descuentoLinea: Number(item.descuento) || 0,
            })),
        };

        LoadingDefault("Registrando Ticket");

        const creado = await RegistrarTicket(body, token, userlogued);

        Swal.close();

        if (!creado) {
            Swal.fire("Error", "No se pudo registrar el ticket", "error");
            return;
        }

        const numeroTicketCreado = creado.numeroTicket ?? form.nroTicket;
        setErrorImprimirTicket("");
        setForm((f) => ({ ...f, nroTicket: numeroTicketCreado }));

        Swal.fire({
            title: "Ticket registrado",
            icon: "success",
            html: `
                <p style="margin:0 0 10px;">Ticket registrado correctamente.</p>
                <p style="margin:0; font-size:1.2em; font-weight:600;">N° de Ticket</p>
                <p style="margin:0; font-size:1.8em; font-weight:800; color:#16a34a;">
                    ${numeroTicketCreado ?? ""}
                </p>
            `,
            showCancelButton: true,
            confirmButtonText: "Sí, Imprimir",
            cancelButtonText: "No",
        }).then((result) => {
            if (result.isConfirmed) {
                imprimirTicketVenta(numeroTicketCreado);
            }
        });
    };

    // Arma e imprime el ticket de venta de 80mm (Horizonte Medic). Todos los datos -incluidos
    // los del paciente (nombre/documento/edad)- se traen de GET /api/tickets/numero/{n}, el
    // registro ya persistido; nunca del formulario en pantalla, porque al reimprimir un ticket
    // anterior desde el input de "Imprimir" el formulario puede estar vacío o tener cargado
    // otro paciente distinto. Se usa tanto al confirmar impresión justo después de registrar,
    // como desde el botón "Imprimir" para reimprimir un ticket ya registrado.
    const imprimirTicketVenta = async (numeroTicket) => {
        const numero = numeroTicket ?? form.nroTicket;
        if (!numero) return false;

        const ticket = await ObtenerTicketPorNumero(numero, token);

        if (!ticket) {
            Swal.fire("Error", `No existe un ticket registrado con el N° ${numero}.`, "error");
            return false;
        }

        TicketVenta({
            tipoDocumento: "DNI",
            documentoIdentidad: ticket.pacienteDni,
            nombres: `${ticket.pacienteApellidos ?? ""} ${ticket.pacienteNombres ?? ""}`.trim(),
            edad: ticket.pacienteEdad,
            medico: ticket.medico,
            fecha: ticket.fechaTicket,
            numeroTicket: ticket.numeroTicket,
            items: (ticket.contenidos || []).map((c) => ({
                descripcion: c.descripcion,
                unidad: c.unidad,
                cantidad: c.cantidad,
                precio: c.precioUnitario,
                total: c.precioTotal,
                descuento: c.descuentoLinea,
            })),
        });
        return true;
    };

    const handleImprimirTicket = async () => {
        const numero = String(form.nroTicket ?? "").trim();
        if (!numero) {
            setErrorImprimirTicket("Debe ingresar un N° de Ticket.");
            return;
        }
        setErrorImprimirTicket("");
        const ok = await imprimirTicketVenta(numero);
        if (!ok) {
            setErrorImprimirTicket(`El N° de Ticket "${numero}" no existe.`);
        }
    };

    const handleImprimirFecha = () => {
        handlePrintDefault(() => {
            window.print();
        });
    };

    // Un registro cargado se detecta por los datos de resultado (nombres/dni), nunca por
    // el documento que el usuario está tipeando.
    const hayRegistroCargado = Boolean(form.nombres || form.dni);

    return (
        <div className="mx-auto max-w-[90%] lg:max-w-[80%] grid gap-y-3 gap-x-4 py-4">
            <SectionFieldset legend="Información del Examen" className="grid xl:grid-cols-4 gap-y-3 gap-x-4">
                <InputsRadioGroup
                    name="tipoDocumento"
                    value={form.tipoDocumento}
                    label="Tipo de Documento"
                    labelWidth="120px"
                    onChange={handleTipoDocumentoChange}
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
                        label={`${form.tipoDocumento === "DNI" ? "DNI" : "Pasaporte"}`}
                        name="documentoIdentidad"
                        value={form.documentoIdentidad}
                        onChange={handleChange}
                        onKeyUp={handleSearch}
                        disabled={hayRegistroCargado}
                        required
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
                    required
                    error={errors.codVendedor}
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
                    onChange={handleChange}
                    labelWidth="120px"
                    required
                    error={errors.empresa}
                />
                <SelectField
                    label="Método de pago"
                    name="metodoPago"
                    value={form.metodoPago}
                    onChange={handleChangeSimple}
                    options={METODOS_PAGO}
                    inline
                    labelWidth="120px"
                    required
                    error={errors.metodoPago}
                />
                <SelectField
                    label="Autorizado por"
                    name="autorizadoPor"
                    value={form.autorizadoPor}
                    onChange={handleChangeSimple}
                    options={AUTORIZADO_POR}
                    inline
                    labelWidth="120px"
                    required
                    error={errors.autorizadoPor}
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
                    required
                    error={errors.nombre_medico}
                />
            </SectionFieldset>

            <SectionFieldset legend="Agregar Servicios Ticket" className="grid grid-cols-1 xl:grid-cols-[1fr_150px] gap-x-6 gap-y-3">
                <div className="grid grid-cols-1 gap-y-3">
                    <div className="flex items-center gap-2">
                        <div className="flex-1">
                            <AutocompleteServicio
                                label="Servicio"
                                value={form.servicio}
                                options={servicios}
                                onType={(v) => setForm((f) => ({ ...f, servicio: v, codServicio: "", precio: "", unidad: "" }))}
                                onSelect={handleSeleccionarServicio}
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleAbrirNuevoServicio}
                            title="Nuevo servicio"
                            className="text-blue-600 hover:text-blue-800 px-2"
                        >
                            <FontAwesomeIcon icon={faPlus} />
                        </button>
                        <button
                            type="button"
                            onClick={handleLimpiarServicioInputs}
                            title="Limpiar campos de servicio"
                            className="text-amber-600 hover:text-amber-800 px-2"
                        >
                            <FontAwesomeIcon icon={faBroom} />
                        </button>
                    </div>
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
                                    <td className="border px-2 py-1">
                                        <select
                                            value={item.descuento || 0}
                                            onChange={(e) => handleDescuentoItemChange(index, e.target.value)}
                                            className="border rounded px-1 py-0.5"
                                        >
                                            {DESCUENTOS.map((d) => (
                                                <option key={d.value} value={d.value}>{d.label}</option>
                                            ))}
                                        </select>
                                    </td>
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
                    {form.ticketItems?.length ? (
                        <tfoot>
                            <tr className="bg-gray-100 font-semibold">
                                <td className="border px-2 py-1 text-right" colSpan={6}>Total</td>
                                <td className="border px-2 py-1">{totalGeneral.toFixed(2)}</td>
                                <td className="border px-2 py-1"></td>
                            </tr>
                        </tfoot>
                    ) : null}
                </table>

            </SectionFieldset>


            <BotonesForm
                form={form}
                handleSave={handleRegistrarTicket}
                saveLabel="Guardar"
                handleClear={handleClearForm}
                hideEdit
                printSlot={
                    <div className="flex flex-col items-end">
                        <span className="font-bold italic text-base mb-1">IMPRIMIR</span>
                        <div className="flex items-center gap-2">
                            <input
                                name="nroTicket"
                                value={form.nroTicket}
                                onChange={(e) => {
                                    setErrorImprimirTicket("");
                                    handleChangeNumberDecimals(e);
                                }}
                                onKeyUp={(e) => e.key === "Enter" && handleImprimirTicket()}
                                className={`border rounded px-2 py-1 text-base w-24 ${errorImprimirTicket ? "border-red-500 bg-red-50" : ""}`}
                            />
                            <button
                                type="button"
                                onClick={handleImprimirTicket}
                                className="bg-blue-600 hover:bg-blue-700 text-white text-base px-6 py-2 rounded flex items-center gap-2 transition-all duration-150 ease-out hover:shadow-lg active:scale-95 active:shadow-inner"
                            >
                                <FontAwesomeIcon icon={faPrint} />
                            </button>
                        </div>
                        {errorImprimirTicket && (
                            <p className="flex items-center gap-1.5 mt-1 text-sm text-red-600">
                                <FontAwesomeIcon icon={faCircleExclamation} className="shrink-0" />
                                <span>{errorImprimirTicket}</span>
                            </p>
                        )}
                    </div>
                }
            >
                <button
                    type="button"
                    onClick={handleImprimirFecha}
                    className="bg-purple-600 hover:bg-purple-700 text-white text-base px-6 py-2 rounded flex items-center gap-2 transition-all duration-150 ease-out hover:shadow-lg active:scale-95 active:shadow-inner"
                >
                    <FontAwesomeIcon icon={faCalendarDay} /> Imprimir Fecha
                </button>
            </BotonesForm>

            <ModalNuevoServicio
                open={modalServicioOpen}
                value={nuevoServicio}
                onChange={setNuevoServicio}
                onClose={() => setModalServicioOpen(false)}
                onSave={handleGuardarNuevoServicio}
                saving={guardandoServicio}
            />
        </div>
    )
}