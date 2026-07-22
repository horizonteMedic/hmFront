import { useEffect, useState } from "react";
import EmpleadoComboBox from "../../../../../components/reusableComponents/EmpleadoComboBox";
import InputsRadioGroup from "../../../../../components/reusableComponents/InputsRadioGroup";
import InputTextArea from "../../../../../components/reusableComponents/InputTextArea";
import InputTextOneLine from "../../../../../components/reusableComponents/InputTextOneLine"
import SectionFieldset from "../../../../../components/reusableComponents/SectionFieldset"
import SearchButton from "../../../../../components/reusableComponents/SearchButton";
import RegistroEstadoPill from "../../../../../components/reusableComponents/RegistroEstadoPill";
import AuditoriaRegistro from "../../../../../components/reusableComponents/AuditoriaRegistro";
import BotonesAccion from "../../../../../components/templates/BotonesAccion";
import DatosPersonalesLaborales from "../../../../../components/templates/DatosPersonalesLaborales";
import { useForm } from "../../../../../hooks/useForm";
import { useSessionData } from "../../../../../hooks/useSessionData";
import { getToday, getFechaHoraActual } from "../../../../../utils/helpers";
import { formatearFechaHora } from "../../../../../utils/formatDateUtils";
import { PrintHojaR, SubmitDataService, UpdateDataService, VerifyTR } from "./controllerAptitudBrigadista";
import BotonesForm from "../../../../../components/templates/BotonesForm";

const tabla = "certificado_aptitud_brigadista";
const today = getToday();

// Campos que el usuario puede editar en este formulario (para resaltar/revertir cambios).
const CAMPOS_EDITABLES = [
    "fechaExam",
    "aptitud",
    "conclusiones",
    "restricciones",
    "recomendaciones",
    "user_medicoFirma",
    "nombre_medico",
];

const CertificadoAptitudBrigadista = () => {
    const { token, userlogued, selectedSede, datosFooter, userName } = useSessionData();
    const initialFormState = {
        // Header
        norden: "",
        fechaExam: today,
        tipoExamen: "",
        // Datos personales
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
        aptitud: "",
        conclusiones: "",
        restricciones: "",
        recomendaciones: "",
        // Médico que Certifica //BUSCADOR
        nombre_medico: userName,
        user_medicoFirma: userlogued,

        // Control de UI: false = mostrar Guardar (nuevo) / true = mostrar Editar (ya existe)
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
        handleChangeNumber,
        handleRadioButton,
        handleRadioButtonBoolean,
        handleClear,
        handleChangeSimple,
        handleClearnotO,
        handlePrintDefault,
        handleChangeNumberDecimals,
    } = useForm(initialFormState, { storageKey: "CertificadoAptitudBrigadista" });

    // ===== Validación de campos obligatorios (feedback visual, sin Swal) =====
    const [errors, setErrors] = useState({});

    // Edición de un registro existente: bloqueada hasta pulsar "Habilitar edición".
    const [edicionHabilitada, setEdicionHabilitada] = useState(false);

    // El error de Conclusiones se muestra solo tras intentar guardar y mientras
    // el campo siga vacío; se limpia solo a medida que el usuario escribe.
    const conclusionesError =
        errors.conclusiones && !form.conclusiones?.trim() ? errors.conclusiones : "";

    const validateForm = () => {
        const next = {};
        if (!form.conclusiones?.trim()) {
            next.conclusiones = "Las conclusiones son obligatorias.";
        }
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSave = () => {
        if (!validateForm()) return;
        SubmitDataService(form, token, userlogued, handleClear, tabla, datosFooter);
    };

    const handleEdit = () => {
        if (!validateForm()) return;
        UpdateDataService(form, token, userlogued, handleClear, tabla, datosFooter);
    };

    // Limpia el formulario y descarta los errores de validación visibles.
    const handleClearForm = () => {
        setErrors({});
        handleClear();
    };

    // ===== Modo edición: detectar y revertir cambios por campo =====
    // Snapshot de los valores originales tomados al cargar un registro existente.
    const [valoresOriginales, setValoresOriginales] = useState(null);

    useEffect(() => {
        // Cada vez que cambia el registro cargado, la edición vuelve a bloquearse.
        setEdicionHabilitada(false);
        if (form.tieneRegistro) {
            // Al entrar en modo edición guardamos los valores cargados como "originales".
            setValoresOriginales(
                CAMPOS_EDITABLES.reduce((acc, campo) => {
                    acc[campo] = form[campo];
                    return acc;
                }, {})
            );
        } else {
            setValoresOriginales(null);
        }
        // Solo queremos capturar el snapshot al pasar a modo edición.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form.tieneRegistro]);

    // ¿El campo difiere de su valor original? (solo aplica en modo edición).
    const isFieldEdited = (campo) =>
        Boolean(valoresOriginales) && valoresOriginales[campo] !== form[campo];

    // Revierte un campo a su valor original.
    const revertField = (campo) => {
        if (!valoresOriginales) return;
        setForm((f) => ({ ...f, [campo]: valoresOriginales[campo] }));
    };

    // El médico se compone de 2 campos (id + nombre); se detecta/revierte en conjunto.
    const isMedicoEdited =
        Boolean(valoresOriginales) &&
        valoresOriginales.user_medicoFirma !== form.user_medicoFirma;

    const revertMedico = () => {
        if (!valoresOriginales) return;
        setForm((f) => ({
            ...f,
            user_medicoFirma: valoresOriginales.user_medicoFirma,
            nombre_medico: valoresOriginales.nombre_medico,
        }));
    };


    //Buscar por Norden
    const executeSearch = () => {
        setErrors({});
        handleClearnotO();
        VerifyTR(form.norden, tabla, token, setForm, selectedSede);
    };

    const handleSearch = (e) => {
        if (!e || e.key === "Enter") {
            executeSearch();
        }
    };

    // const handlePrint = () => {
    //     handlePrintDefault(() => {
    //         PrintHojaR(form.norden, token, tabla);
    //     });
    // };

    const handlePrint = () => {
        handlePrintDefault(() => {
            PrintHojaR(form.norden, token, tabla, datosFooter, selectedSede);
        });
    };

    // Al cambiar el N° Orden en la casilla de imprimir: si había datos cargados de otro
    // norden, se limpian para no dejar información desactualizada en pantalla.
    const handlePrintNordenChange = (e) => {
        const value = e.target.value;
        if (!/^\d*$/.test(value)) return; // solo dígitos

        const hayDatosCargados = Boolean(form.nombres || form.dni || form.tieneRegistro);
        if (hayDatosCargados && value !== form.norden) {
            setErrors({});
            setForm({ ...initialFormState, norden: value });
        } else {
            setForm((f) => ({ ...f, norden: value }));
        }
    };

    // ¿Ya se buscó y cargó un registro de paciente? Mientras el formulario esté
    // vacío (sin búsqueda) usamos este flag para ocultar la pill de estado y la
    // sección de auditoría, y para deshabilitar el N° Orden.
    const hayRegistroCargado = Boolean(form.nombres || form.dni);

    // Deshabilita el N° Orden cuando ya se cargaron datos del paciente tras la búsqueda
    const nordenDisabled = hayRegistroCargado;

    // ===== Auditoría dinámica del registro =====
    // Fecha/hora "en vivo": el formulario se re-renderiza cada segundo (useRealTime
    // dentro de useSessionData), por lo que refleja el momento actual hasta guardar.
    const fechaHoraActual = getFechaHoraActual();

    // Auditoría del registro. Las fechas del backend llegan con su zona horaria;
    // formatearFechaHora las muestra en hora local. Nuevo: solo creación en vivo.
    // Edición: datos REALES de obtenerReporte (si la actualización es null, muestra "—").
    const auditoria = form.tieneRegistro
        ? {
            // Registro existente: creación y actualización REALES (obtenerReporte).
            fechaCreacion: formatearFechaHora(form.fechaRegistro),
            usuarioRegistro: form.userRegistro,
            fechaActualizacion: formatearFechaHora(form.fechaActualizacion),
            usuarioActualizacion: form.usuarioActualizacion,
        }
        : {
            // Registro nuevo: solo datos de creación en vivo (aún no existe en BD).
            fechaCreacion: fechaHoraActual,
            usuarioRegistro: userlogued,
            fechaActualizacion: "",
            usuarioActualizacion: "",
        };

    // Habilita la edición de los campos del formulario (solo para registros existentes).
    const habilitarEdicion = () => setEdicionHabilitada(true);

    // Campos propios del formulario: bloqueados si es un registro existente y aún no se
    // pulsó "Habilitar edición". En un registro nuevo siempre están habilitados.
    const camposDeshabilitados = form.tieneRegistro && !edicionHabilitada;

    return (
        <div className="space-y-3 px-4 max-w-[90%] xl:max-w-[80%] mx-auto">
            {/* ===== ESTADO DEL FORMULARIO (nuevo / edición) ===== */}
            {/* La pill solo aparece cuando ya se buscó/cargó un registro. */}
            {hayRegistroCargado && (
                <div className="sticky top-2 z-20 flex justify-end pointer-events-none">
                    <RegistroEstadoPill tieneRegistro={form.tieneRegistro} />
                </div>
            )}

            {/* ===== SECCIÓN: N° ORDEN Y FECHA ===== */}
            <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-3">
                <div className="flex gap-x-3 w-full">
                    <InputTextOneLine
                        label="N° Orden"
                        name="norden"
                        value={form.norden}
                        onKeyUp={handleSearch}
                        onChange={handleChangeNumber}
                        disabled={nordenDisabled}
                        labelWidth="120px"
                        className="w-full"
                    />
                    <SearchButton onClick={executeSearch} className="lg:hidden" />
                </div>
                <InputTextOneLine
                    label="Fecha de Ingreso"
                    name="fechaExam"
                    type="date"
                    value={form.fechaExam}
                    onChange={handleChangeSimple}
                    disabled={form.tieneRegistro}
                    labelWidth="120px"
                    edited={isFieldEdited("fechaExam")}
                    onRevert={() => revertField("fechaExam")}
                />

            </SectionFieldset>

            {/* ===== SECCIÓN: DATOS LABORALES ===== */}
            <DatosPersonalesLaborales form={form} />

            <div className="flex flex-col md:flex-row gap-3 items-start w-full ">
                <div className="w-full md:w-[40%]">
                    <SectionFieldset legend="Aptitud" className="w-full">
                        <InputsRadioGroup
                            vertical
                            disabled={camposDeshabilitados}
                            name="aptitud" value={form?.aptitud} className="py-2"
                            onChange={handleRadioButton} options={[
                                { label: "APTO (para el puesto en el que trabaja o postula)", value: "APTO" },
                                { label: "No APTO (para el puesto en el que trabaja o postula)", value: "NOAPTO" }
                            ]}
                            edited={isFieldEdited("aptitud")}
                            onRevert={() => revertField("aptitud")}
                        />

                    </SectionFieldset>
                    <SectionFieldset legend="Asignación de Médico" className="w-full">
                        <EmpleadoComboBox
                            value={form.nombre_medico}
                            label="Especialista"
                            form={form}
                            onChange={handleChangeSimple}
                            disabled={camposDeshabilitados}
                            edited={isMedicoEdited}
                            onRevert={revertMedico}
                        />
                    </SectionFieldset>
                </div>

                <div className="w-full md:w-[60%]  ">
                    <SectionFieldset legend="Conclusiones y Observaciones" className="w-full space-y-3">
                        <InputTextArea
                            label="Conclusiones"
                            name="conclusiones"
                            onChange={handleChange}
                            value={form.conclusiones}
                            rows={3}
                            labelWidth="120px"
                            required
                            disabled={camposDeshabilitados}
                            error={conclusionesError}
                            edited={isFieldEdited("conclusiones")}
                            onRevert={() => revertField("conclusiones")}
                        />
                        <InputTextArea
                            label="Restricciones"
                            name="restricciones"
                            onChange={handleChange}
                            rows={3}
                            value={form.restricciones}
                            labelWidth="120px"
                            disabled={camposDeshabilitados}
                            edited={isFieldEdited("restricciones")}
                            onRevert={() => revertField("restricciones")}
                        />
                        <InputTextArea
                            label="Recomendaciones"
                            name="recomendaciones"
                            onChange={handleChange}
                            rows={3}
                            value={form.recomendaciones}
                            labelWidth="120px"
                            disabled={camposDeshabilitados}
                            edited={isFieldEdited("recomendaciones")}
                            onRevert={() => revertField("recomendaciones")}
                        />
                    </SectionFieldset>

                </div>
            </div>

            {/* ===== SECCIÓN: AUDITORÍA DEL REGISTRO (independiente de las firmas) ===== */}
            {/* Solo se muestra tras buscar un N° Orden. Nuevo: solo creación.
                Edición: los 4 campos (edición = fecha/usuario actual). */}
            {hayRegistroCargado && (
                <AuditoriaRegistro
                    mostrarEdicion={form.tieneRegistro}
                    fechaCreacion={auditoria.fechaCreacion}
                    fechaEdicion={auditoria.fechaActualizacion}
                    usuarioRegistro={auditoria.usuarioRegistro}
                    usuarioEdicion={auditoria.usuarioActualizacion}
                />
            )}

            {/* BOTONES DE ACCIÓN */}
            {/* <BotonesAccion
                form={form}
                handleChangeNumberDecimals={handleChangeNumberDecimals}
                handleSave={handleSave}
                handleClear={handleClear}
                handlePrint={handlePrint}
            /> */}

            <BotonesForm
                form={form}
                handleChangeNumberDecimals={handleChangeNumberDecimals}
                onNordenChange={handlePrintNordenChange}
                handleSave={form.tieneRegistro && edicionHabilitada ? handleEdit : handleSave}
                saveLabel={form.tieneRegistro && edicionHabilitada ? "Guardar Cambios" : "Guardar"}
                handleEdit={habilitarEdicion}
                handleClear={handleClearForm}
                handlePrint={handlePrint}
                hideSave={form.tieneRegistro && !edicionHabilitada}
                hideEdit={!form.tieneRegistro || edicionHabilitada}
            />
        </div>
    )
}

export default CertificadoAptitudBrigadista