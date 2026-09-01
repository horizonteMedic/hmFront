import Swal from "sweetalert2";
import EmpleadoComboBox from "../../../../../components/reusableComponents/EmpleadoComboBox";
import InputsRadioGroup from "../../../../../components/reusableComponents/InputsRadioGroup";
import InputTextArea from "../../../../../components/reusableComponents/InputTextArea";
import InputTextOneLine from "../../../../../components/reusableComponents/InputTextOneLine"
import SectionFieldset from "../../../../../components/reusableComponents/SectionFieldset"
import SearchButton from "../../../../../components/reusableComponents/SearchButton";
import RevertButton from "../../../../../components/reusableComponents/RevertButton";
import AccionesRegistroHeader from "../../../../../components/reusableComponents/AccionesRegistroHeader";
import AuditoriaRegistro from "../../../../../components/reusableComponents/AuditoriaRegistro";
import DatosPersonalesLaborales from "../../../../../components/templates/DatosPersonalesLaborales";
import BotonesForm from "../../../../../components/templates/BotonesForm";
import { useForm } from "../../../../../hooks/useForm";
import { useSessionData } from "../../../../../hooks/useSessionData";
import { useRegistroEditable } from "../../../../../hooks/useRegistroEditable";
import { getToday, getFechaHoraActual, getTodayPlusOneYear } from "../../../../../utils/helpers";
import { buildAuditoria } from "../../../../../utils/auditoriaUtils";
import { PrintHojaR, SubmitDataService, UpdateDataService, VerifyTR } from "./controllerCAHerramientasManuales";

const tabla = "certificado_aptitud_herramientas_manuales";
const today = getToday();

const TITULOS_EXAMEN = [
    "CERTIFICADO DE APTITUD PARA USO DE HERRAMIENTAS MANUALES",
    "CERTIFICADO DE ESPACIOS CONFINADOS",
];

// Campos que el usuario puede editar en este formulario (para resaltar/revertir cambios).
const CAMPOS_EDITABLES = [
    "fechaExamen",
    "fechaHasta",
    "tituloExamen",
    "aptitud",
    "observacion",
    "user_medicoFirma",
    "nombre_medico",
];

const CAHerramientasManuales = () => {
    const { token, userlogued, selectedSede, datosFooter, userName } = useSessionData();

    const initialFormState = {
        // Header
        norden: "",
        idCertificado: null,
        nombreExamen: "",
        tituloExamen: TITULOS_EXAMEN[0],
        fechaExamen: today,
        fechaHasta: getTodayPlusOneYear(),

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
        explotacion: "",

        // Conclusiones finales
        aptitud: "",
        observacion: "",

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
    } = useForm(initialFormState, { storageKey: "CAHerramientasManuales" });

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

    const validateForm = () => {
        if (!form.aptitud) {
            Swal.fire({
                icon: "error",
                title: '<i class="fa-solid fa-clipboard-list"></i>Error',
                html: "Por favor, seleccione la aptitud.",
            });
            return false;
        }
        return true;
    };

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
            <AccionesRegistroHeader
                tieneRegistro={form.tieneRegistro}
                hayRegistroCargado={hayRegistroCargado}
                edicionHabilitada={edicionHabilitada}
                onHabilitarEdicion={habilitarEdicion}
                onLimpiar={handleClear}
            />

            {/* ===== SECCIÓN: INFORMACIÓN DEL EXAMEN ===== */}
            <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-3">
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
                    label="Nombre Examen"
                    name="nombreExamen"
                    disabled
                    value={form.nombreExamen}
                    labelWidth="120px"
                />
                <div className="flex items-center gap-4 w-full md:col-span-2 lg:col-span-2">
                    <label className="font-semibold min-w-[120px] max-w-[120px]">Título del Examen :</label>
                    <div className="w-full flex items-center gap-1.5">
                        <select
                            name="tituloExamen"
                            value={form.tituloExamen}
                            onChange={handleChangeSimple}
                            disabled={camposDeshabilitados}
                            className={`border rounded px-2 py-1 text-base w-full ${camposDeshabilitados ? "bg-gray-300" : ""} ${isFieldEdited("tituloExamen") ? "border-orange-400 bg-orange-100" : ""}`}
                        >
                            {TITULOS_EXAMEN.map((titulo) => (
                                <option key={titulo} value={titulo}>{titulo}</option>
                            ))}
                        </select>
                        {isFieldEdited("tituloExamen") && (
                            <RevertButton onClick={() => revertField("tituloExamen")} title="Revertir selección" />
                        )}
                    </div>
                </div>
                    <InputTextOneLine
                        label="Fecha"
                        name="fechaExamen"
                        type="date"
                        value={form.fechaExamen}
                        labelWidth="120px"
                        onChange={handleChangeSimple}
                        disabled={camposDeshabilitados}
                        edited={isFieldEdited("fechaExamen")}
                        onRevert={() => revertField("fechaExamen")}
                    />
                    <InputTextOneLine
                        label="Fecha Venc."
                        name="fechaHasta"
                        type="date"
                        labelWidth="120px"
                        value={form.fechaHasta}
                        onChange={handleChangeSimple}
                        disabled={camposDeshabilitados}
                        edited={isFieldEdited("fechaHasta")}
                        onRevert={() => revertField("fechaHasta")}
                    />
            </SectionFieldset>

            {/* ===== SECCIÓN: DATOS LABORALES ===== */}
            <DatosPersonalesLaborales form={form} />

            <SectionFieldset legend="Datos Adicionales" className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-3">
                <InputTextOneLine
                    label="Explotación"
                    name="explotacion"
                    disabled
                    value={form.explotacion}
                    labelWidth="120px"
                />
            </SectionFieldset>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-3 items-start">
                <SectionFieldset legend="Aptitud">
                    <InputsRadioGroup
                        vertical
                        disabled={camposDeshabilitados}
                        name="aptitud"
                        value={form.aptitud}
                        className="py-2"
                        onChange={handleRadioButton}
                        options={[
                            { label: "APTO", value: "APTO" },
                            { label: "APTO CON RESTRICCION", value: "APTO CON RESTRICCION" },
                            { label: "APTO TEMPORAL", value: "APTO TEMPORAL" },
                            { label: "NO APTO", value: "NO APTO" },
                        ]}
                        edited={isFieldEdited("aptitud")}
                        onRevert={() => revertField("aptitud")}
                    />
                </SectionFieldset>

                <SectionFieldset legend="Observación">
                    <InputTextArea
                        label="Observación"
                        name="observacion"
                        value={form.observacion}
                        onChange={handleChange}
                        rows={6}
                        disabled={camposDeshabilitados}
                        edited={isFieldEdited("observacion")}
                        onRevert={() => revertField("observacion")}
                    />
                </SectionFieldset>
            </div>

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

export default CAHerramientasManuales
