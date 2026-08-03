import InputsRadioGroup from "../../../../../components/reusableComponents/InputsRadioGroup";
import InputTextArea from "../../../../../components/reusableComponents/InputTextArea";
import InputTextOneLine from "../../../../../components/reusableComponents/InputTextOneLine";
import SectionFieldset from "../../../../../components/reusableComponents/SectionFieldset";
import SearchButton from "../../../../../components/reusableComponents/SearchButton";
import RegistroEstadoPill from "../../../../../components/reusableComponents/RegistroEstadoPill";
import AuditoriaRegistro from "../../../../../components/reusableComponents/AuditoriaRegistro";
import EmpleadoComboBox from "../../../../../components/reusableComponents/EmpleadoComboBox";
import DatosPersonalesLaborales from "../../../../../components/templates/DatosPersonalesLaborales";
import BotonesForm from "../../../../../components/templates/BotonesForm";
import { useForm } from "../../../../../hooks/useForm";
import { useSessionData } from "../../../../../hooks/useSessionData";
import { useRegistroEditable } from "../../../../../hooks/useRegistroEditable";
import { getToday, getFechaHoraActual } from "../../../../../utils/helpers";
import { buildAuditoria } from "../../../../../utils/auditoriaUtils";
import { PrintHojaR, SubmitDataService, UpdateDataService, VerifyTR } from "./ControllerHojaConsultaExterna";

const tabla = "hoja_consulta_externa";
const today = getToday();

// Campos que el usuario puede editar en este formulario (para resaltar/revertir cambios).
const CAMPOS_EDITABLES = [
    "fechaExamen",
    "cajon",
    "otrosDescripcion",
    "observaciones",
    "user_medicoFirma",
    "nombre_medico",
];

const HojaConsultaExterna = () => {
    const { token, userlogued, selectedSede, datosFooter, userName, hora } = useSessionData();

    const initialFormState = {
        // Header
        norden: "",
        nombreExamen: "",
        fechaExamen: today,
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

        // Caja
        cajon: "",
        otrosDescripcion: "",

        // Observaciones
        observaciones: "",
        observacionesAuto: "",

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
        handleClearnotO,
        handleClear,
        handleChange,
        handlePrintDefault,
        handleRadioButton,
        handleChangeNumberDecimals,
    } = useForm(initialFormState, { storageKey: "Hoja_Consulta_Externa_form" });

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

            {/* ===== SECCIÓN: INFORMACIÓN GENERAL ===== */}
            <SectionFieldset legend="Información General" className="grid grid-cols-1 lg:grid-cols-4 gap-x-4 gap-y-3">
                <div className="flex gap-x-3 w-full">
                    <InputTextOneLine
                        label="N° Orden"
                        name="norden"
                        labelWidth="60px"
                        value={form.norden}
                        onChange={handleChangeNumber}
                        onKeyUp={handleSearch}
                        disabled={nordenDisabled}
                        className="w-full"
                    />
                    <SearchButton onClick={executeSearch} className="lg:hidden" />
                </div>
                <InputTextOneLine
                    label="Tipo de Examen"
                    name="nombreExamen"
                    disabled
                    value={form.nombreExamen}
                    labelWidth="100px"
                />
                <InputTextOneLine
                    label="Fecha de Examen"
                    name="fechaExamen"
                    type="date"
                    value={form.fechaExamen}
                    labelWidth="100px"
                    onChange={handleChangeSimple}
                    disabled={camposDeshabilitados}
                    edited={isFieldEdited("fechaExamen")}
                    onRevert={() => revertField("fechaExamen")}
                />
                <InputTextOneLine
                    label="Hora"
                    name="horaSalida"
                    disabled
                    value={form.tieneRegistro ? form.horaSalida : hora}
                />
            </SectionFieldset>

            {/* ===== SECCIÓN: DATOS LABORALES ===== */}
            <DatosPersonalesLaborales form={form} />

            {/* ===== SECCIÓN: CAJA ===== */}
            <SectionFieldset legend="Caja" className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-3">
                <InputsRadioGroup
                    name="cajon"
                    value={form.cajon}
                    className="py-2"
                    onChange={handleRadioButton}
                    disabled={camposDeshabilitados}
                    options={[
                        { label: "POSTA VIJUS", value: "POSTA VIJUS" },
                        { label: "CEDRO", value: "CEDRO" },
                        { label: "PARAISO", value: "PARAISO" },
                        { label: "OTROS", value: "OTROS" },
                    ]}
                    edited={isFieldEdited("cajon")}
                    onRevert={() => revertField("cajon")}
                />
                <InputTextOneLine
                    label="Otros"
                    disabled={camposDeshabilitados || form.cajon !== "OTROS"}
                    name="otrosDescripcion"
                    value={form.otrosDescripcion}
                    onChange={handleChange}
                    edited={isFieldEdited("otrosDescripcion")}
                    onRevert={() => revertField("otrosDescripcion")}
                />
            </SectionFieldset>

            {/* ===== SECCIÓN: OBSERVACIONES ===== */}
            <SectionFieldset legend="Observaciones">
                <InputTextArea
                    label="Observaciones"
                    name="observaciones"
                    value={form.observaciones}
                    onChange={handleChangeSimple}
                    onBlur={() => setForm((prev) => ({ ...prev, observaciones: prev.observaciones.toUpperCase() }))}
                    rows={15}
                    disabled={camposDeshabilitados}
                    edited={isFieldEdited("observaciones")}
                    onRevert={() => revertField("observaciones")}
                />

                {form.observacionesAuto !== "" && (
                    <InputTextArea
                        label="Observaciones AUTO"
                        name="observacionesAuto"
                        value={form.observacionesAuto}
                        rows={15}
                        disabled
                    />
                )}
            </SectionFieldset>

            {/* ===== SECCIÓN: ASIGNACIÓN DE MÉDICO ===== */}
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
    );
};

export default HojaConsultaExterna;
