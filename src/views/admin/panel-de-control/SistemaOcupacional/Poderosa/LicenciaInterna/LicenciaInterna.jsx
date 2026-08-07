import EmpleadoComboBox from "../../../../../components/reusableComponents/EmpleadoComboBox";
import InputsRadioGroup from "../../../../../components/reusableComponents/InputsRadioGroup";
import InputTextArea from "../../../../../components/reusableComponents/InputTextArea";
import InputTextOneLine from "../../../../../components/reusableComponents/InputTextOneLine"
import SectionFieldset from "../../../../../components/reusableComponents/SectionFieldset"
import SearchButton from "../../../../../components/reusableComponents/SearchButton";
import RegistroEstadoPill from "../../../../../components/reusableComponents/RegistroEstadoPill";
import AuditoriaRegistro from "../../../../../components/reusableComponents/AuditoriaRegistro";
import DatosPersonalesLaborales from "../../../../../components/templates/DatosPersonalesLaborales";
import BotonesForm from "../../../../../components/templates/BotonesForm";
import { useForm } from "../../../../../hooks/useForm";
import { useSessionData } from "../../../../../hooks/useSessionData";
import { useRegistroEditable } from "../../../../../hooks/useRegistroEditable";
import { getToday, getFechaHoraActual } from "../../../../../utils/helpers";
import { buildAuditoria } from "../../../../../utils/auditoriaUtils";
import { PrintHojaR, SubmitDataService, UpdateDataService, VerifyTR } from "./ControllerLicenciaInterna";

const tabla = "aptitud_licencia_conduciri";
const today = getToday();

// Vigencia por defecto de un registro nuevo: un año desde la fecha de examen.
const fechaVenc = new Date(today);
fechaVenc.setFullYear(fechaVenc.getFullYear() + 1);
const nextYearDate = fechaVenc.toISOString().split("T")[0];

// Campos que el usuario puede editar en este formulario (para resaltar/revertir cambios).
const CAMPOS_EDITABLES = [
    "fechaExamen",
    "fechaHasta",
    "apto",
    "observaciones",
    "user_medicoFirma",
    "nombre_medico",
];

const LicenciaInterna = () => {
    const { token, userlogued, selectedSede, datosFooter, userName, hora } = useSessionData();

    const initialFormState = {
        // Header
        norden: "",
        nombreExamen: "",
        fechaExamen: today,
        fechaHasta: nextYearDate,
        horaSalida: "",

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

        // Aptitud
        apto: "",
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
        handleChangeNumber,
        handleChangeSimple,
        handleChange,
        handleClearnotO,
        handleClear,
        handleRadioButton,
        handlePrintDefault,
        handleChangeNumberDecimals,
    } = useForm(initialFormState, { storageKey: "LicenciaInterna" });

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

    // ===== Búsqueda con boton =====
    const executeSearch = () => {
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
        SubmitDataService(form, token, userlogued, handleClear, tabla, datosFooter);
    };

    const handleEdit = () => {
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
            <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 lg:grid-cols-3 gap-x-4 gap-y-3">
                <div className="w-full flex gap-x-3">
                    <InputTextOneLine
                        label="N° Orden"
                        name="norden"
                        value={form.norden}
                        onKeyUp={handleSearch}
                        onChange={handleChangeNumber}
                        disabled={nordenDisabled}
                        labelWidth="120px"
                        className="flex-1"
                    />
                    <SearchButton onClick={executeSearch} className="lg:hidden" />
                </div>
                <InputTextOneLine
                    label="Tipo de Examen"
                    name="nombreExamen"
                    disabled
                    value={form.nombreExamen}
                    labelWidth="120px"
                />
                <InputTextOneLine
                    label="Hora"
                    name="horaSalida"
                    labelWidth="120px"
                    disabled
                    value={form.tieneRegistro ? form.horaSalida : hora}
                />
            </SectionFieldset>

            {/* ===== SECCIÓN: DATOS LABORALES ===== */}
            <DatosPersonalesLaborales form={form} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-3 items-start">
                <div className="space-y-3">
                    <SectionFieldset legend="Aptitud" className="space-y-3">
                        <InputsRadioGroup
                            vertical
                            disabled={camposDeshabilitados}
                            name="apto"
                            value={form.apto}
                            className="py-2"
                            onChange={handleRadioButton}
                            options={[
                                { label: "APTO (para el puesto en el que trabaja o postula)", value: "APTO" },
                                { label: "No APTO (para el puesto en el que trabaja o postula)", value: "NOAPTO" },
                            ]}
                            edited={isFieldEdited("apto")}
                            onRevert={() => revertField("apto")}
                        />
                        <div className="flex flex-col sm:flex-row gap-3">
                            <InputTextOneLine
                                label="Fecha"
                                name="fechaExamen"
                                type="date"
                                value={form.fechaExamen}
                                labelWidth="90px"
                                onChange={handleChangeSimple}
                                disabled={camposDeshabilitados}
                                edited={isFieldEdited("fechaExamen")}
                                onRevert={() => revertField("fechaExamen")}
                            />
                            <InputTextOneLine
                                label="Fecha Venc."
                                name="fechaHasta"
                                type="date"
                                value={form.fechaHasta}
                                labelWidth="90px"
                                onChange={handleChangeSimple}
                                disabled={camposDeshabilitados}
                                edited={isFieldEdited("fechaHasta")}
                                onRevert={() => revertField("fechaHasta")}
                            />
                        </div>
                    </SectionFieldset>

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
                </div>

                <SectionFieldset legend="Observaciones">
                    <InputTextArea
                        label="Observaciones"
                        name="observaciones"
                        value={form.observaciones}
                        onChange={handleChange}
                        rows={15}
                        disabled={camposDeshabilitados}
                        edited={isFieldEdited("observaciones")}
                        onRevert={() => revertField("observaciones")}
                    />
                </SectionFieldset>
            </div>

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
                handleClear={handleClear}
                handlePrint={handlePrint}
                hideSave={form.tieneRegistro && !edicionHabilitada}
                hideEdit={!form.tieneRegistro || edicionHabilitada}
            />
        </div>
    )
}

export default LicenciaInterna
