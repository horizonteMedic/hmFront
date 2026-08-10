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
import { getToday, getFechaHoraActual, getDatePlus364Days } from "../../../../../utils/helpers";
import { buildAuditoria } from "../../../../../utils/auditoriaUtils";
import { PrintHojaR, SubmitDataService, UpdateDataService, VerifyTR } from "./controllerCuadradorVigia";

const tabla = "certificado_aptitud_cuadrador";
const today = getToday();

// Campos que el usuario puede editar en este formulario (para resaltar/revertir cambios).
const CAMPOS_EDITABLES = [
    "fechaExamen",
    "fechaHasta",
    "explotacion",
    "apto",
    "observaciones",
    "user_doctorAsignado",
    "nombre_doctorAsignado",
];

const CuadradorVigia = () => {
    const { token, userlogued, selectedSede, datosFooter, userName, hora } = useSessionData();

    const initialFormState = {
        // Header
        norden: "",
        nombreExamen: "",
        explotacion: "",
        fechaExamen: today,
        fechaHasta: getDatePlus364Days(today),

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

        // Doctor que Certifica //BUSCADOR
        nombre_doctorAsignado: userName,
        user_doctorAsignado: userlogued,

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
    } = useForm(initialFormState, { storageKey: "CuadradorVigiaPoderosa" });

    const {
        edicionHabilitada,
        habilitarEdicion,
        camposDeshabilitados,
        isFieldEdited,
        revertField,
        revertFields,
    } = useRegistroEditable(form, setForm, { tieneRegistro: form.tieneRegistro, camposEditables: CAMPOS_EDITABLES });

    // El doctor se compone de 2 campos (id de firma + nombre): se detecta el cambio por
    // el id y se revierten ambos en conjunto.
    const isDoctorEdited = isFieldEdited("user_doctorAsignado");
    const revertDoctor = () => revertFields(["user_doctorAsignado", "nombre_doctorAsignado"]);

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

            {/* ===== SECCIÓN: INFORMACIÓN GENERAL ===== */}
            <SectionFieldset legend="Información General" className="grid grid-cols-1 xl:grid-cols-2 gap-x-4 gap-y-3">
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
                <InputsRadioGroup
                    label="Explotación"
                    name="explotacion"
                    className="space-x-16"
                    value={form.explotacion}
                    onChange={handleRadioButton}
                    disabled={camposDeshabilitados}
                    options={[
                        { label: "Superficie", value: "SUPERFICIE" },
                        { label: "Planta", value: "PLANTA" },
                        { label: "Subsuelo", value: "SUBSUELO" },
                    ]}
                    edited={isFieldEdited("explotacion")}
                    onRevert={() => revertField("explotacion")}
                />
                <InputTextOneLine
                    label="Hora"
                    labelWidth="120px"
                    disabled
                    value={hora}
                    className="font-bold"
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
                                { label: "APTO", value: "APTO" },
                                { label: "APTO CON RESTRICCION", value: "APTO_CON_RESTRICCION" },
                                { label: "APTO TEMPORAL", value: "APTO_TEMPORAL" },
                                { label: "NO APTO", value: "NO_APTO" },
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
                            value={form.nombre_doctorAsignado}
                            label="Doctor Asignado"
                            form={form}
                            onChange={handleChangeSimple}
                            nameField="nombre_doctorAsignado"
                            idField="user_doctorAsignado"
                            disabled={camposDeshabilitados}
                            edited={isDoctorEdited}
                            onRevert={revertDoctor}
                        />
                    </SectionFieldset>
                </div>

                <SectionFieldset legend="Observaciones">
                    <InputTextArea
                        label="Observaciones"
                        name="observaciones"
                        value={form.observaciones}
                        onChange={handleChange}
                        rows={14}
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

export default CuadradorVigia
