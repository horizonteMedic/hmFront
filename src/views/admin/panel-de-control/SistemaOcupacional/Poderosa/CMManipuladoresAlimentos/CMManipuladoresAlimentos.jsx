import { useState } from "react";
import InputTextOneLine from "../../../../../components/reusableComponents/InputTextOneLine";
import InputTextArea from "../../../../../components/reusableComponents/InputTextArea";
import InputsBooleanRadioGroup from "../../../../../components/reusableComponents/InputsBooleanRadioGroup";
import SectionFieldset from "../../../../../components/reusableComponents/SectionFieldset";
import SearchButton from "../../../../../components/reusableComponents/SearchButton";
import RegistroEstadoPill from "../../../../../components/reusableComponents/RegistroEstadoPill";
import AuditoriaRegistro from "../../../../../components/reusableComponents/AuditoriaRegistro";
import EmpleadoComboBox from "../../../../../components/reusableComponents/EmpleadoComboBox";
import BotonesForm from "../../../../../components/templates/BotonesForm";
import { useForm } from "../../../../../hooks/useForm";
import { useSessionData } from "../../../../../hooks/useSessionData";
import { useRegistroEditable } from "../../../../../hooks/useRegistroEditable";
import { getToday, getFechaHoraActual } from "../../../../../utils/helpers";
import { buildAuditoria } from "../../../../../utils/auditoriaUtils";
import { PrintHojaR, SubmitDataService, UpdateDataService, VerifyTR } from "./controllerCMManipuladoresAlimentos";
import DatosPersonalesLaborales from "../../../../../components/templates/DatosPersonalesLaborales";

const tabla = "certificado_manipuladores_barrick";
const today = getToday();

// Campos que el usuario puede editar en este formulario (para resaltar/revertir cambios).
const CAMPOS_EDITABLES = [
    "fechaExam",
    "esApto",
    "observaciones",
    "recomendaciones",
    "user_medicoFirma",
    "nombre_medico",
];

export default function CMManipuladoresAlimentos() {
    const { token, userlogued, selectedSede, datosFooter, userName } = useSessionData();

    const initialFormState = {
        // Header
        norden: "",
        fechaExam: today,
        nombreExamen: "",
        esApto: undefined,

        // Datos personales
        nombres: "",
        dni: "",
        edad: "",
        sexo: "",
        fechaNacimiento: "",
        lugarNacimiento: "",
        estadoCivil: "",
        nivelEstudios: "",
        ocupacion: "",

        empresa: "",
        contrata: "",
        cargoDesempenar: "",
        areaTrabajo: "",

        // Recomendaciones
        recomendaciones: "",
        observaciones: "",

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
        handleChangeSimple,
        handleRadioButtonBoolean,
        handleClear,
        handleClearnotO,
        handlePrintDefault,
        handleChangeNumberDecimals,
    } = useForm(initialFormState, { storageKey: "CMManipuladoresAlimentos" });

    const {
        edicionHabilitada,
        habilitarEdicion,
        camposDeshabilitados,
        isFieldEdited,
        revertField,
        revertFields,
    } = useRegistroEditable(form, setForm, { tieneRegistro: form.tieneRegistro, camposEditables: CAMPOS_EDITABLES });

    // El médico se compone de 2 campos (id de firma + nombre): se detecta el cambio por
    // el id y se revierten ambos en conjunto.
    const isMedicoEdited = isFieldEdited("user_medicoFirma");
    const revertMedico = () => revertFields(["user_medicoFirma", "nombre_medico"]);

    const [errors, setErrors] = useState({});

    // Los errores se muestran solo tras intentar guardar y mientras el campo siga
    // inválido; se limpian solos a medida que el usuario los corrige.
    const fechaExamError = errors.fechaExam && !form.fechaExam ? errors.fechaExam : "";
    const esAptoError = errors.esApto && form.esApto === undefined ? errors.esApto : "";

    const validateForm = () => {
        const next = {};
        if (!form.fechaExam) {
            next.fechaExam = "La fecha de examen es obligatoria.";
        }
        if (form.esApto === undefined) {
            next.esApto = "Seleccione la aptitud.";
        }
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleClearForm = () => {
        setErrors({});
        handleClear();
    };

    // ===== Búsqueda con boton =====
    const executeSearch = () => {
        setErrors({});
        handleClearnotO();
        VerifyTR(form.norden, tabla, token, setForm, selectedSede);
    };

    // ===== Búsqueda con enter =====
    const handleSearch = (e) => {
        if (!e || e.key === "Enter") {
            executeSearch();
        }
    };

    const handlePrintNordenChange = (e) => {
        const value = e.target.value;
        if (!/^\d*$/.test(value)) return; // solo dígitos

        const hayDatosCargados = Boolean(form.nombres || form.dni || form.tieneRegistro);
        if (hayDatosCargados && value !== form.norden) {
            setForm({ ...initialFormState, norden: value });
        } else {
            setForm((f) => ({ ...f, norden: value }));
        }
    };

    // ===== Impresión =====
    const handlePrint = () => {
        handlePrintDefault(() => {
            PrintHojaR(form.norden, token, tabla, datosFooter, selectedSede);
        });
    };

    const handleSave = () => {
        if (!validateForm()) return;
        SubmitDataService(form, token, userlogued, handleClear, tabla, datosFooter);
    };

    const handleEdit = () => {
        if (!validateForm()) return;
        UpdateDataService(form, token, userlogued, handleClear, tabla, datosFooter);
    };

    const hayRegistroCargado = Boolean(form.nombres || form.dni);
    const nordenDisabled = hayRegistroCargado;

    const auditoria = buildAuditoria(form, {
        usuarioActual: userlogued,
        fechaHoraActual: getFechaHoraActual(),
    });

    return (
        <div className="space-y-3 px-4 max-w-[90%] xl:max-w-[80%] mx-auto">
            {hayRegistroCargado && (
                <div className="sticky top-2 z-20 flex justify-end pointer-events-none">
                    <RegistroEstadoPill tieneRegistro={form.tieneRegistro} />
                </div>
            )}

            {/* ===== SECCIÓN: INFORMACIÓN DEL EXAMEN ===== */}
            <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <div className="flex gap-x-3 w-full">
                    <InputTextOneLine
                        label="N° Orden"
                        name="norden"
                        value={form.norden}
                        onChange={handleChangeNumber}
                        onKeyUp={handleSearch}
                        disabled={nordenDisabled}
                        className="w-full"
                    />
                    <SearchButton onClick={executeSearch} className="lg:hidden" />
                </div>
                <InputTextOneLine
                    label="Nombre Examen"
                    name="nombreExamen"
                    value={form.nombreExamen}
                    disabled
                />
                <InputTextOneLine
                    label="Fecha Examen"
                    name="fechaExam"
                    type="date"
                    value={form.fechaExam}
                    onChange={handleChangeSimple}
                    disabled={camposDeshabilitados}
                    edited={isFieldEdited("fechaExam")}
                    onRevert={() => revertField("fechaExam")}
                    required
                    error={fechaExamError}
                />
                <InputsBooleanRadioGroup
                    label="Aptitud"
                    name="esApto"
                    value={form.esApto}
                    trueLabel="APTO"
                    falseLabel="NO APTO"
                    onChange={handleRadioButtonBoolean}
                    disabled={camposDeshabilitados}
                    edited={isFieldEdited("esApto")}
                    onRevert={() => revertField("esApto")}
                    required
                    error={esAptoError}
                />
            </SectionFieldset>

            {/* ===== SECCIÓN: DATOS DEL PACIENTE ===== */}
            <DatosPersonalesLaborales form={form} />

            {/* ===== SECCIÓN: CONCLUSIONES FINALES ===== */}
            <SectionFieldset legend="Conclusiones Finales" className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputTextArea
                        label="Observaciones"
                        name="observaciones"
                        value={form.observaciones}
                        onChange={handleChange}
                        rows={4}
                        disabled={camposDeshabilitados}
                        edited={isFieldEdited("observaciones")}
                        onRevert={() => revertField("observaciones")}
                    />
                    <InputTextArea
                        label="Recomendaciones"
                        name="recomendaciones"
                        value={form.recomendaciones}
                        onChange={handleChange}
                        rows={4}
                        disabled={camposDeshabilitados}
                        edited={isFieldEdited("recomendaciones")}
                        onRevert={() => revertField("recomendaciones")}
                    />
                </div>

                {/* Médico */}
                <SectionFieldset legend="Asignación de Médico">
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

            {/* ===== BOTONES DE ACCIÓN ===== */}
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
    );
}
