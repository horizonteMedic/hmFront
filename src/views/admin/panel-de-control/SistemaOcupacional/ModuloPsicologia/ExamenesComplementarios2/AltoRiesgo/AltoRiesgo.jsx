import {
    InputTextOneLine,
    InputTextArea,
    InputsBooleanRadioGroup,
} from "../../../../../../components/reusableComponents/ResusableComponents";
import SectionFieldset from "../../../../../../components/reusableComponents/SectionFieldset";
import SearchButton from "../../../../../../components/reusableComponents/SearchButton";
import AccionesRegistroHeader from "../../../../../../components/reusableComponents/AccionesRegistroHeader";
import AuditoriaRegistro from "../../../../../../components/reusableComponents/AuditoriaRegistro";
import { useSessionData } from "../../../../../../hooks/useSessionData";
import { getToday, getFechaHoraActual } from "../../../../../../utils/helpers";
import { buildAuditoria } from "../../../../../../utils/auditoriaUtils";
import { useForm } from "../../../../../../hooks/useForm";
import { useRegistroEditable } from "../../../../../../hooks/useRegistroEditable";
import { PrintHojaR, SubmitDataService, UpdateDataService, VerifyTR } from "./controllerAltoRiesgo";
import BotonesForm from "../../../../../../components/templates/BotonesForm";
import DatosPersonalesLaborales from "../../../../../../components/templates/DatosPersonalesLaborales";
import EmpleadoComboBox from "../../../../../../components/reusableComponents/EmpleadoComboBox";

const tabla = "alto_riesgo";

// Campos que el usuario puede editar en este formulario (para resaltar/revertir cambios).
const CAMPOS_EDITABLES = [
    "fecha",
    "esApto",
    "temorRiesgoElectrico",
    "temorTareaAltura",
    "temorEspaciosConfinados",
    "fortalezasOportunidades",
    "amenazasDebilidades",
    "observaciones",
    "recomendaciones",
    "user_medicoFirma",
    "nombre_medico",
];

export default function AltoRiesgo() {
    const today = getToday();
    const { token, userlogued, selectedSede, datosFooter, userName } = useSessionData();

    const initialFormState = {
        // Header - Información del examen
        norden: "",
        fecha: today,
        nombreExamen: "",
        esApto: undefined,

        dni: "",
        nombres: "",
        apellidos: "",
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

        temorRiesgoElectrico: "",
        temorTareaAltura: "",
        temorEspaciosConfinados: "",

        // Análisis FODA
        fortalezasOportunidades: "",
        amenazasDebilidades: "",

        // Observaciones y Recomendaciones
        observaciones: "",
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
        handleChangeNumberDecimals,
        handleChangeSimple,
        handleRadioButtonBoolean,
        handleClear,
        handleClearnotO,
        handlePrintDefault,
    } = useForm(initialFormState, { storageKey: "AltoRiesgo" });

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

    const handleSave = () => {
        SubmitDataService(form, token, userlogued, handleClear, tabla, datosFooter);
    };

    const handleEdit = () => {
        UpdateDataService(form, token, userlogued, handleClear, tabla, datosFooter);
    };

    // ===== Búsqueda con botón =====
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

    const hayRegistroCargado = Boolean(form.nombres);

    const handlePrintNordenChange = (e) => {
        const value = e.target.value;
        if (!/^\d*$/.test(value)) return; // solo dígitos

        const hayDatosCargados = Boolean(form.nombres || form.tieneRegistro);
        if (hayDatosCargados && value !== form.norden) {
            setForm({ ...initialFormState, norden: value });
        } else {
            setForm((f) => ({ ...f, norden: value }));
        }
    };

    const handlePrint = () => {
        handlePrintDefault(() => {
            PrintHojaR(form.norden, token, tabla, datosFooter, selectedSede);
        });
    };

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

            <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <div className="flex gap-x-3 w-full">
                    <InputTextOneLine
                        label="N° Orden"
                        name="norden"
                        value={form.norden}
                        onChange={handleChangeNumber}
                        onKeyUp={handleSearch}
                        disabled={hayRegistroCargado}
                        labelWidth="120px"
                        className="w-full"
                    />
                    <SearchButton onClick={executeSearch} className="lg:hidden" />
                </div>
                <InputTextOneLine
                    label="Fecha"
                    name="fecha"
                    type="date"
                    value={form.fecha}
                    onChange={handleChangeSimple}
                    disabled={camposDeshabilitados}
                    edited={isFieldEdited("fecha")}
                    onRevert={() => revertField("fecha")}
                    labelWidth="120px"
                />
                <InputTextOneLine
                    label="Nombre del Examen"
                    name="nombreExamen"
                    value={form.nombreExamen}
                    disabled
                    labelWidth="120px"
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
                />
            </SectionFieldset>

            <DatosPersonalesLaborales form={form} />

            <SectionFieldset legend="Criterios Psicológicos">
                <div className="grid grid-cols-1 gap-4">
                    <InputTextOneLine
                        label="1.- Temor a Riesgo Eléctrico"
                        name="temorRiesgoElectrico"
                        value={form?.temorRiesgoElectrico}
                        onChange={handleChange}
                        labelWidth="120px"
                        disabled={camposDeshabilitados}
                        edited={isFieldEdited("temorRiesgoElectrico")}
                        onRevert={() => revertField("temorRiesgoElectrico")}
                    />
                    <InputTextOneLine
                        label="2.- Temor a Tareas en Altura / Izaje"
                        name="temorTareaAltura"
                        value={form?.temorTareaAltura}
                        onChange={handleChange}
                        labelWidth="120px"
                        disabled={camposDeshabilitados}
                        edited={isFieldEdited("temorTareaAltura")}
                        onRevert={() => revertField("temorTareaAltura")}
                    />
                    <InputTextOneLine
                        label="3.- Temor a Espacios Confinados"
                        name="temorEspaciosConfinados"
                        value={form?.temorEspaciosConfinados}
                        onChange={handleChange}
                        labelWidth="120px"
                        disabled={camposDeshabilitados}
                        edited={isFieldEdited("temorEspaciosConfinados")}
                        onRevert={() => revertField("temorEspaciosConfinados")}
                    />
                </div>
            </SectionFieldset>
            <SectionFieldset legend="Análisis FODA">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputTextArea
                        label="Fortalezas / Oportunidades"
                        name="fortalezasOportunidades"
                        value={form?.fortalezasOportunidades}
                        onChange={handleChange}
                        rows={4}
                        disabled={camposDeshabilitados}
                        edited={isFieldEdited("fortalezasOportunidades")}
                        onRevert={() => revertField("fortalezasOportunidades")}
                    />
                    <InputTextArea
                        label="Amenazas / Debilidades"
                        name="amenazasDebilidades"
                        value={form?.amenazasDebilidades}
                        onChange={handleChange}
                        rows={4}
                        disabled={camposDeshabilitados}
                        edited={isFieldEdited("amenazasDebilidades")}
                        onRevert={() => revertField("amenazasDebilidades")}
                    />
                </div>
            </SectionFieldset>

            <SectionFieldset legend="Observaciones y Recomendaciones">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputTextArea
                        label="Observaciones"
                        name="observaciones"
                        value={form?.observaciones}
                        onChange={handleChange}
                        rows={4}
                        disabled={camposDeshabilitados}
                        edited={isFieldEdited("observaciones")}
                        onRevert={() => revertField("observaciones")}
                    />
                    <InputTextArea
                        label="Recomendaciones"
                        name="recomendaciones"
                        value={form?.recomendaciones}
                        onChange={handleChange}
                        rows={4}
                        disabled={camposDeshabilitados}
                        edited={isFieldEdited("recomendaciones")}
                        onRevert={() => revertField("recomendaciones")}
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
}
