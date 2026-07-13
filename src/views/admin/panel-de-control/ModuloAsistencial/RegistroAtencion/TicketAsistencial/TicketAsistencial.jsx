import { faBroom, faCalendarDay, faPrint, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InputCheckbox from "../../../../../components/reusableComponents/InputCheckbox";
import { SelectField } from "../../../../../components/reusableComponents/InputSelect";
import InputsRadioGroup from "../../../../../components/reusableComponents/InputsRadioGroup";
import InputTextOneLine from "../../../../../components/reusableComponents/InputTextOneLine";
import SectionFieldset from "../../../../../components/reusableComponents/SectionFieldset";
import DatosPersonalesLaborales from "../../../../../components/templates/DatosPersonalesLaborales";
import { useForm } from "../../../../../hooks/useForm";
import { useSessionData } from "../../../../../hooks/useSessionData";
import { getDatePlus364Days, getToday } from "../../../../../utils/helpers";

const METODOS_PAGO = [
    { value: "CONTADO", label: "CONTADO" },
    { value: "TARJETA", label: "TARJETA" },
    { value: "TRANSFERENCIA", label: "TRANSFERENCIA" },
    { value: "YAPE/PLIN", label: "YAPE / PLIN" },
];

const AUTORIZADO_POR = [
    { value: "PACIENTE", label: "PACIENTE" },
    { value: "EMPRESA", label: "EMPRESA" },
    { value: "ASEGURADORA", label: "ASEGURADORA" },
    { value: "CONVENIO", label: "CONVENIO" },
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

export default function TicketAsistencial() {

    const today = getToday();

    const { token, userlogued, selectedSede, datosFooter, userName, hora } = useSessionData();

    const initialFormState = {
        // Datos básicos
        norden: "",
        tipoExamen: "",
        NHCL: "",
        nroTicket: "",
        CodVendedor: "",

        dni: "",
        nombres: "",
        fechaNacimiento: "",
        lugarNacimiento: "",
        edad: "",
        sexo: "",
        estadoCivil: "",
        nivelEstudios: "",

        // Datos Laborales
        empresa: "",
        contrata: "",
        ocupacion: "",
        cargoDesempenar: "",

        conclusiones: "",
        apto: "APTO",
        fechaValido: today,
        fechaVencimiento: getDatePlus364Days(today),
        recomendaciones: "",
        restricciones: "NINGUNO.",

        // Checkboxes de recomendaciones
        corregirAgudezaVisualTotal: false,
        corregirAgudezaVisual: false,
        dietaHipocalorica: false,
        evitarMovimientosDisergonomicos: false,
        noHacerTrabajoAltoRiesgo: false,
        noHacerTrabajoSobre18: false,
        usoEppAuditivo: false,
        usoLentesConducir: false,
        usoLentesTrabajo: false,
        usoLentesTrabajoSobre18: false,
        ninguno: true,
        noConducirVehiculos: false,

        menorCincoAños: false,
        adolescente: false,
        adulto: false,
        adultoMayor: false,

        // Agregar Servicios Ticket
        servicio: "",
        codServicio: "",
        precio: "",
        unidad: "",
        descuento: "",
        ticketItems: [],

        // Médico que Certifica //BUSCADOR
        nombre_medico: userName,
        user_medicoFirma: userlogued,
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



    const handleSearch = (e) => {
        if (e.key === "Enter") {
            handleClearnotO();
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
            <SectionFieldset legend="Información del Examen" className="grid xl:grid-cols-5 gap-y-3 gap-x-4">
                <InputsRadioGroup
                    name="tipoDocumento"
                    value={form.tipoDocumento}
                    onChange={handleRadioButton}
                    options={[
                        { label: "D.N.I", value: "dni" },
                        { label: "Historia Clínica", value: "hClinica" },
                        { label: "S/D", value: "SD" },
                    ]}
                />
                <InputTextOneLine
                    label="Numero de documento"
                    name="numeroDocumento"
                    value={form.numeroDocumento}
                    labelWidth="130px"
                    onChange={handleChangeNumberDecimals}
                    onKeyUp={handleSearch}
                />
                <InputTextOneLine
                    label="NHCL"
                    name="NHCL"
                    value={form?.NHCL}
                    onChange={handleChangeNumberDecimals}
                    onKeyUp={handleSearch}
                />
                <InputTextOneLine
                    label="N° Ticket"
                    name="nroTicket"
                    value={form?.nroTicket}
                    onChange={handleChangeNumberDecimals}
                    onKeyUp={handleSearch}
                />
                <InputTextOneLine
                    label="Código Vendedor"
                    name="CodVendedor"
                    value={form?.CodVendedor}
                    onChange={handleChangeNumberDecimals}
                    onKeyUp={handleSearch}
                />
            </SectionFieldset>

            <SectionFieldset legend="Fecha" className="grid xl:grid-cols-2 gap-y-3 gap-x-4"> 
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


            <SectionFieldset legend="Datos" className="grid grid-cols-1 xl:grid-cols-2 gap-x-4 gap-y-3">
                <InputTextOneLine
                    label="Apellidos y Nombres"
                    name="nombres"
                    value={form.nombres}
                    labelWidth="120px"
                    className="xl:col-span-2"
                />
                <InputTextOneLine
                    label="Empresa"
                    name="empresa"
                    value={form.empresa}
                    labelWidth="120px"
                />
                <InputTextOneLine
                    label="Doctor"
                    name="doctor"
                    value={form.doctor}
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
                        onChange={handleCheckBoxChange}
                    />
                    <InputCheckbox
                        label="ADOLESCENTE"
                        name="adolescente"
                        checked={form.adolescente}
                        onChange={handleCheckBoxChange}
                    />
                    <InputCheckbox
                        label="ADULTO"
                        name="adulto"
                        checked={form.adulto}
                        onChange={handleCheckBoxChange}
                    />
                    <InputCheckbox
                        label="ADULTO MAYOR"
                        name="adultoMayor"
                        checked={form.adultoMayor}
                        onChange={handleCheckBoxChange}
                    />
                </div>
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
                            onChange={handleChangeSimple}
                        />
                        <InputTextOneLine
                            label="Precio"
                            name="precio"
                            value={form.precio}
                            onChange={handleChangeNumberDecimals}
                        />
                        <InputTextOneLine
                            label="Unidad"
                            name="unidad"
                            value={form.unidad}
                            onChange={handleChangeSimple}
                        />
                        <SelectField
                            label="Descuento"
                            name="descuento"
                            value={form.descuento}
                            onChange={handleChangeSimple}
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