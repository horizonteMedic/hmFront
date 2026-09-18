import { useState, useEffect, useRef } from "react";
import InputsRadioGroup from "../../../../../components/reusableComponents/InputsRadioGroup";
import InputTextOneLine from "../../../../../components/reusableComponents/InputTextOneLine";
import SectionFieldset from "../../../../../components/reusableComponents/SectionFieldset";
import AccionesRegistroHeader from "../../../../../components/reusableComponents/AccionesRegistroHeader";
import AuditoriaRegistro from "../../../../../components/reusableComponents/AuditoriaRegistro";
import RevertButton from "../../../../../components/reusableComponents/RevertButton";
import BotonesForm from "../../../../../components/templates/BotonesForm";
import { useForm } from "../../../../../hooks/useForm";
import { useSessionData } from "../../../../../hooks/useSessionData";
import { useRegistroEditable } from "../../../../../hooks/useRegistroEditable";
import { getToday, getFechaHoraActual } from "../../../../../utils/helpers";
import { buildAuditoria } from "../../../../../utils/auditoriaUtils";
import { SubmitDataService, BuscarPorDni, BuscarPorPasaporte } from "./controllerRegistroAsistencial";
import {
    ComboboxProfesión,
    ComboboxDepartamentos,
    ComboboxProvincias,
    ComboboxDistritos,
} from "../../../SistemaOcupacional/Admision/model/Combobox";

// Listas estáticas (mismas que RegistroClientes)
const NIVEL_ESTUDIOS_OPTIONS = [
    "ANALFABETO",
    "PRIMARIA COMPLETA",
    "PRIMARIA INCOMPLETA",
    "SECUNDARIA COMPLETA",
    "SECUNDARIA INCOMPLETA",
    "UNIVERSITARIO",
    "TECNICO",
];

const ESTADO_CIVIL_OPTIONS = [
    "SOLTERO",
    "CASADO",
    "VIUDO",
    "CONVIVIENTE",
    "SEPARADO",
    "DIVORCIADO",
];

const SEXO_OPTIONS = ["MASCULINO", "FEMENINO"];

// Campos que el usuario puede editar en este formulario (para resaltar/revertir cambios
// cuando se edita un paciente ya registrado). El documento de identidad y el N° de Historia
// Clínica quedan fuera: no se editan aquí (ver nota en controllerRegistroAsistencial).
const CAMPOS_EDITABLES = [
    "fecha",
    "nombres",
    "apellidos",
    "fechaNacimiento",
    "sexo",
    "estadoCivil",
    "nivelEstudios",
    "lugarNacimiento",
    "departamento",
    "provincia",
    "distrito",
    "domicilioActual",
    "telefono",
    "ocupacion",
];

// dd-MM-yyyy -> edad en años (string). "" si la fecha es inválida / incompleta.
function calcularEdad(fechaStr) {
    if (!fechaStr) return "";
    const [dd, mm, yyyy] = fechaStr.split("-");
    if (!dd || !mm || !yyyy || yyyy.length < 4) return "";
    const dia = Number(dd);
    const mes = Number(mm);
    const anio = Number(yyyy);
    if (!dia || !mes || !anio) return "";

    const nacimiento = new Date(anio, mes - 1, dia);
    if (
        nacimiento.getFullYear() !== anio ||
        nacimiento.getMonth() !== mes - 1 ||
        nacimiento.getDate() !== dia
    ) {
        return "";
    }

    const hoy = new Date();
    let edad = hoy.getFullYear() - anio;
    const cumpleEsteAnio = new Date(hoy.getFullYear(), mes - 1, dia);
    if (hoy < cumpleEsteAnio) edad--;

    if (edad < 0 || edad > 150) return "";
    return String(edad);
}

// Autocomplete reutilizable con el mismo comportamiento que RegistroClientes
function AutocompleteOneLine({
    label,
    name,
    value,
    options = [],
    getOptionLabel = (o) => o,
    onType,
    onSelect,
    labelWidth = "120px",
    disabled = false,
    edited = false,
    onRevert,
    placeholder = "Escribe para buscar...",
}) {
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
    const filtered = options
        .filter((o) => getOptionLabel(o).toLowerCase().includes(text.toLowerCase()))
        .slice(0, 50);

    const showRevert = edited && typeof onRevert === "function";

    return (
        <div className="flex items-center gap-4" ref={boxRef}>
            <label
                className="font-semibold"
                style={{ minWidth: labelWidth, maxWidth: labelWidth }}
                htmlFor={name}
            >
                {label} :
            </label>
            <div className="w-full flex items-center gap-1.5">
                <div className="relative w-full">
                    <input
                        id={name}
                        name={name}
                        type="text"
                        autoComplete="off"
                        disabled={disabled}
                        value={text}
                        placeholder={placeholder}
                        style={{ textTransform: "uppercase" }}
                        className={`border rounded px-2 py-1 w-full ${disabled ? "bg-gray-300" : ""} ${edited ? "border-orange-400 bg-orange-100" : ""}`}
                        onChange={(e) => onType(e.target.value.toUpperCase())}
                        onFocus={() => !disabled && setShow(true)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                if (filtered.length > 0) {
                                    onSelect(filtered[0]);
                                    setShow(false);
                                }
                            }
                        }}
                    />
                    {show && !disabled && filtered.length > 0 && (
                        <div className="absolute z-20 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-48 overflow-y-auto shadow-lg">
                            {filtered.map((opt, i) => (
                                <div
                                    key={i}
                                    className="cursor-pointer p-2 hover:bg-gray-200"
                                    onClick={() => {
                                        onSelect(opt);
                                        setShow(false);
                                    }}
                                >
                                    {getOptionLabel(opt)}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {showRevert && <RevertButton onClick={onRevert} />}
            </div>
        </div>
    );
}

export default function RegistroAsistencial() {

    const today = getToday();

    const { token, userlogued, selectedSede, datosFooter, userName, hora } = useSessionData();

    // Catálogos para autocompletado (mismos endpoints que RegistroClientes)
    const Profesiones = ComboboxProfesión();
    const Departamentos = ComboboxDepartamentos();
    const Provincias = ComboboxProvincias();
    const Distritos = ComboboxDistritos();

    const initialFormState = {
        // Datos básicos
        idDatos: null,
        tipoDocumento: "DNI",
        documentoIdentidad: "",
        NHCL: null,
        fecha: today,

        nombres: "",
        apellidos: "",
        fechaNacimiento: "",
        lugarNacimiento: "",
        edad: "",
        sexo: "",
        estadoCivil: "",
        nivelEstudios: "",

        departamento: "",
        provincia: "",
        distrito: "",
        domicilioActual: "",
        telefono: "",

        ocupacion: "",

        // Control de UI: false = mostrar Guardar (nuevo) / true = mostrar Habilitar edición (ya existe)
        tieneRegistro: false,

        // Auditoría
        userRegistro: "",
        fechaRegistro: "",
        usuarioActualizacion: "",
        fechaActualizacion: "",
    };

    const {
        form,
        setForm,
        handleChange,
        handleChangeNumberDecimals,
        handleChangeSimple,
        handleClear,
        handlePrintDefault,
        handleFocusNext,
    } = useForm(initialFormState, { storageKey: "registroPacienteAsistencial" });

    const {
        edicionHabilitada,
        habilitarEdicion,
        camposDeshabilitados,
        isFieldEdited,
        revertField,
    } = useRegistroEditable(form, setForm, { tieneRegistro: form.tieneRegistro, camposEditables: CAMPOS_EDITABLES });

    const setField = (name, value) => setForm((f) => ({ ...f, [name]: value }));

    // La edad se autocalcula a partir de la fecha de nacimiento
    useEffect(() => {
        const edad = calcularEdad(form.fechaNacimiento);
        setForm((f) => (f.edad === edad ? f : { ...f, edad }));
    }, [form.fechaNacimiento]);

    const esMenorDeEdad = form.edad !== "" && Number(form.edad) < 18;

    // Fecha de nacimiento con máscara dd-MM-yyyy (igual que RegistroClientes)
    const handleFechaNacimiento = (e) => {
        const raw = e.target.value.replace(/\D/g, "").slice(0, 8);
        let formatted = raw;
        if (raw.length >= 5) {
            formatted = raw.replace(/(\d{2})(\d{2})(\d{0,4})/, "$1-$2-$3");
        } else if (raw.length >= 3) {
            formatted = raw.replace(/(\d{2})(\d{0,2})/, "$1-$2");
        }
        setField("fechaNacimiento", formatted);
    };

    // Departamento / Provincia / Distrito dependientes
    const deptSel = Departamentos.find((d) => d.nombre === form.departamento);
    const provSel = Provincias.find(
        (p) => p.nombre === form.provincia && (!deptSel || p.idDepartamento === deptSel.id)
    );
    const provinciasOpts = deptSel
        ? Provincias.filter((p) => p.idDepartamento === deptSel.id)
        : [];
    const distritosOpts = provSel
        ? Distritos.filter((d) => d.idProvincia === provSel.id)
        : [];


    const handleSearch = (e) => {
        if (e.key === "Enter") {
            if (!form.documentoIdentidad) return;
            if (form.tipoDocumento === "DNI") {
                BuscarPorDni(form.documentoIdentidad, token, setForm);
            } else if (form.tipoDocumento === "PASAPORTE") {
                BuscarPorPasaporte(form.documentoIdentidad, token, setForm);
            }
        }
    };

    const handleSave = () => {
        SubmitDataService(form, token, handleClear, userlogued);
    };

    // Cambiar el tipo de documento invalida cualquier dato ya cargado/tipeado (DNI,
    // Pasaporte y Sin Documento son búsquedas independientes), así que el formulario
    // se limpia por completo y solo conserva el nuevo tipo elegido.
    const handleTipoDocumentoChange = (e, value) => {
        setForm({ ...initialFormState, tipoDocumento: value });
    };

    // Enter se comporta como Tab: salta al siguiente campo enfocable
    const handleEnterAsTab = (e) => {
        if (e.key !== "Enter" || e.shiftKey) return;
        const el = e.target;
        // No interferir con textareas, botones ni el buscador de impresión
        if (el.tagName === "TEXTAREA" || el.tagName === "BUTTON") return;
        if (el.name === "norden") return;
        handleFocusNext(e);
    };

    // Un registro cargado (nuevo por RENIEC o ya existente) se detecta por los datos de
    // resultado (nombres/apellidos), nunca por el documento que el usuario está tipeando.
    const hayRegistroCargado = Boolean(form.nombres || form.apellidos);
    // El N° de documento se bloquea una vez cargado un registro, para forzar "Limpiar" (o
    // cambiar el tipo de documento, que también limpia) antes de buscar a otro paciente.
    // Corregir el documento de un registro existente requiere un endpoint aparte
    // (PUT /{id}/documento), no este formulario.
    const busquedaDisabled = hayRegistroCargado;

    const auditoria = buildAuditoria(form, {
        usuarioActual: userlogued,
        fechaHoraActual: getFechaHoraActual(),
    });

    return (
        <div className="mx-auto max-w-[90%] lg:max-w-[80%] grid gap-y-3 gap-x-4 py-4" >
            <AccionesRegistroHeader
                tieneRegistro={form.tieneRegistro}
                hayRegistroCargado={hayRegistroCargado}
                edicionHabilitada={edicionHabilitada}
                onHabilitarEdicion={habilitarEdicion}
                onLimpiar={handleClear}
            />

            <SectionFieldset legend="Información del Examen" className="grid xl:grid-cols-2 gap-y-3 gap-x-4">
                <InputsRadioGroup
                    name="tipoDocumento"
                    value={form.tipoDocumento}
                    label="Tipo de Documento"
                    labelWidth="120px"
                    onChange={handleTipoDocumentoChange}
                    options={[
                        { label: "DNI", value: "DNI" },
                        { label: "Pasaporte", value: "PASAPORTE" },
                        { label: "Sin Documento", value: "SIN_DOCUMENTO" },
                    ]}
                    className="col-span-3"
                />
                {form.tipoDocumento == "SIN_DOCUMENTO" ?
                    <h1>Sin Documento</h1>
                    :
                    <InputTextOneLine
                        label={`${form.tipoDocumento === "DNI" ? "DNI" : form.tipoDocumento === "PASAPORTE" ? "Pasaporte" : "SIN_DOCUMENTO"}`}
                        name="documentoIdentidad"
                        value={form.documentoIdentidad}
                        onChange={handleChange}
                        onKeyUp={handleSearch}
                        disabled={form.tipoDocumento === "SIN_DOCUMENTO" || busquedaDisabled}
                        labelWidth="120px"
                    />
                }

                <InputTextOneLine
                    label="Historia Clínica"
                    name="NHCL"
                    value={form?.NHCL}
                    labelWidth="120px"
                    className="font-bold"
                    disabled
                />
            </SectionFieldset>

            <SectionFieldset legend="Datos Personales" className="grid grid-cols-1 xl:grid-cols-2 gap-x-4 gap-y-3">
                <InputTextOneLine
                    label="Nombres"
                    name="nombres"
                    value={form.nombres}
                    onChange={handleChange}
                    labelWidth="120px"
                    disabled={camposDeshabilitados}
                    edited={isFieldEdited("nombres")}
                    onRevert={() => revertField("nombres")}
                />
                <InputTextOneLine
                    label="Apellidos"
                    name="apellidos"
                    value={form.apellidos}
                    onChange={handleChange}
                    labelWidth="120px"
                    disabled={camposDeshabilitados}
                    edited={isFieldEdited("apellidos")}
                    onRevert={() => revertField("apellidos")}
                />
                <div className="grid xl:grid-cols-2 gap-x-4 gap-y-3">
                    <div className="flex flex-col gap-1">
                        <InputTextOneLine
                            label="Fecha Nacimiento"
                            name="fechaNacimiento"
                            value={form.fechaNacimiento}
                            onChange={handleFechaNacimiento}
                            labelWidth="120px"
                            disabled={camposDeshabilitados}
                            inputClassName={esMenorDeEdad ? "border-red-500 text-red-600 font-bold" : ""}
                            edited={isFieldEdited("fechaNacimiento")}
                            onRevert={() => revertField("fechaNacimiento")}
                        />
                        <span className="text-[11px] text-gray-500" style={{ marginLeft: "136px" }}>
                            Formato: Día-Mes-Año (DD-MM-AAAA)
                        </span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <InputTextOneLine
                            label="Edad (Años)"
                            name="edad"
                            value={form.edad}
                            disabled
                            labelWidth="120px"
                            inputClassName={esMenorDeEdad ? "text-red-600 font-bold border-red-500" : ""}
                        />
                        {esMenorDeEdad && (
                            <span className="text-[11px] text-red-600 font-semibold" style={{ marginLeft: "136px" }}>
                                Menor de edad
                            </span>
                        )}
                    </div>
                </div>
                <div className="grid xl:grid-cols-2 gap-x-4 gap-y-3">
                    <div className="flex items-center gap-4">
                        <label
                            className="font-semibold"
                            style={{ minWidth: "120px", maxWidth: "120px" }}
                            htmlFor="sexo"
                        >
                            Sexo :
                        </label>
                        <div className="w-full flex items-center gap-1.5">
                            <select
                                id="sexo"
                                name="sexo"
                                value={form.sexo}
                                onChange={handleChangeSimple}
                                disabled={camposDeshabilitados}
                                className={`border rounded px-2 py-1 w-full ${camposDeshabilitados ? "bg-gray-300" : "bg-white"} ${isFieldEdited("sexo") ? "border-orange-400 bg-orange-100" : ""}`}
                            >
                                <option value="">-- Seleccione --</option>
                                {SEXO_OPTIONS.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                            {isFieldEdited("sexo") && <RevertButton onClick={() => revertField("sexo")} />}
                        </div>
                    </div>
                    <AutocompleteOneLine
                        label="Estado Civil"
                        name="estadoCivil"
                        value={form.estadoCivil}
                        options={ESTADO_CIVIL_OPTIONS}
                        onType={(v) => setField("estadoCivil", v)}
                        onSelect={(opt) => setField("estadoCivil", opt)}
                        labelWidth="120px"
                        disabled={camposDeshabilitados}
                        edited={isFieldEdited("estadoCivil")}
                        onRevert={() => revertField("estadoCivil")}
                    />
                </div>
                <AutocompleteOneLine
                    label="Nivel Estudios"
                    name="nivelEstudios"
                    value={form.nivelEstudios}
                    options={NIVEL_ESTUDIOS_OPTIONS}
                    onType={(v) => setField("nivelEstudios", v)}
                    onSelect={(opt) => setField("nivelEstudios", opt)}
                    labelWidth="120px"
                    disabled={camposDeshabilitados}
                    edited={isFieldEdited("nivelEstudios")}
                    onRevert={() => revertField("nivelEstudios")}
                />
                <InputTextOneLine
                    label="Lugar Nacimiento"
                    name="lugarNacimiento"
                    value={form.lugarNacimiento}
                    onChange={handleChange}
                    labelWidth="120px"
                    disabled={camposDeshabilitados}
                    edited={isFieldEdited("lugarNacimiento")}
                    onRevert={() => revertField("lugarNacimiento")}
                />
                <AutocompleteOneLine
                    label="Departamento"
                    name="departamento"
                    value={form.departamento}
                    options={Departamentos}
                    getOptionLabel={(o) => o.nombre}
                    onType={(v) => setForm((f) => ({ ...f, departamento: v }))}
                    onSelect={(opt) =>
                        setForm((f) => ({ ...f, departamento: opt.nombre, provincia: "", distrito: "" }))
                    }
                    labelWidth="120px"
                    disabled={camposDeshabilitados}
                    edited={isFieldEdited("departamento")}
                    onRevert={() => revertField("departamento")}
                />
                <AutocompleteOneLine
                    label="Provincia"
                    name="provincia"
                    value={form.provincia}
                    options={provinciasOpts}
                    getOptionLabel={(o) => o.nombre}
                    onType={(v) => setForm((f) => ({ ...f, provincia: v }))}
                    onSelect={(opt) => setForm((f) => ({ ...f, provincia: opt.nombre, distrito: "" }))}
                    labelWidth="120px"
                    disabled={camposDeshabilitados}
                    edited={isFieldEdited("provincia")}
                    onRevert={() => revertField("provincia")}
                />
                <AutocompleteOneLine
                    label="Distrito"
                    name="distrito"
                    value={form.distrito}
                    options={distritosOpts}
                    getOptionLabel={(o) => o.nombre}
                    onType={(v) => setForm((f) => ({ ...f, distrito: v }))}
                    onSelect={(opt) => setForm((f) => ({ ...f, distrito: opt.nombre }))}
                    labelWidth="120px"
                    disabled={camposDeshabilitados}
                    edited={isFieldEdited("distrito")}
                    onRevert={() => revertField("distrito")}
                />
                <InputTextOneLine
                    label="Domicilio Actual"
                    name="domicilioActual"
                    value={form.domicilioActual}
                    onChange={handleChange}
                    labelWidth="120px"
                    disabled={camposDeshabilitados}
                    edited={isFieldEdited("domicilioActual")}
                    onRevert={() => revertField("domicilioActual")}
                />
                <InputTextOneLine
                    label="Telefono"
                    name="telefono"
                    value={form.telefono}
                    onChange={handleChangeNumberDecimals}
                    labelWidth="120px"
                    disabled={camposDeshabilitados}
                    edited={isFieldEdited("telefono")}
                    onRevert={() => revertField("telefono")}
                />
                <AutocompleteOneLine
                    label="Ocupación"
                    name="ocupacion"
                    value={form.ocupacion}
                    options={Profesiones}
                    getOptionLabel={(o) => o.descripcion}
                    onType={(v) => setField("ocupacion", v)}
                    onSelect={(opt) => setField("ocupacion", opt.descripcion)}
                    labelWidth="120px"
                    disabled={camposDeshabilitados}
                    edited={isFieldEdited("ocupacion")}
                    onRevert={() => revertField("ocupacion")}
                />
            </SectionFieldset>

                    
            {/* ===== SECCIÓN: AUDITORÍA DEL REGISTRO ===== */}
            {hayRegistroCargado && (
                <AuditoriaRegistro
                    mostrarEdicion={form.tieneRegistro}
                    fechaCreacion={auditoria.fechaCreacion}
                    fechaEdicion={auditoria.fechaActualizacion}
                    usuarioRegistro={auditoria.usuarioRegistro}
                    usuarioEdicion={auditoria.usuarioActualizacion}
                />
            )}

            <BotonesForm
                form={form}
                handleSave={handleSave}
                saveLabel={form.tieneRegistro && edicionHabilitada ? "Guardar Cambios" : "Guardar"}
                handleEdit={habilitarEdicion}
                handleClear={handleClear}
                hideSave={form.tieneRegistro && !edicionHabilitada}
                hideEdit={!form.tieneRegistro || edicionHabilitada}
                hidePrint
            />
        </div>
    )
}
