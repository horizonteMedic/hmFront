import {
    InputTextOneLine,
    InputTextArea,
    RadioTable,
    InputsBooleanRadioGroup,
} from "../../../../../../components/reusableComponents/ResusableComponents";
import SectionFieldset from "../../../../../../components/reusableComponents/SectionFieldset";
import SearchButton from "../../../../../../components/reusableComponents/SearchButton";
import AccionesRegistroHeader from "../../../../../../components/reusableComponents/AccionesRegistroHeader";
import AuditoriaRegistro from "../../../../../../components/reusableComponents/AuditoriaRegistro";
import { useForm } from "../../../../../../hooks/useForm";
import { useSessionData } from "../../../../../../hooks/useSessionData";
import { useRegistroEditable } from "../../../../../../hooks/useRegistroEditable";
import { getToday, getFechaHoraActual } from "../../../../../../utils/helpers";
import { buildAuditoria } from "../../../../../../utils/auditoriaUtils";
import { PrintHojaR, SubmitDataService, UpdateDataService, VerifyTR } from "./controllerInformeRiesgoPsicosocial";
import BotonesForm from "../../../../../../components/templates/BotonesForm";
import DatosPersonalesLaborales from "../../../../../../components/templates/DatosPersonalesLaborales";
import EmpleadoComboBox from "../../../../../../components/reusableComponents/EmpleadoComboBox";

const tabla = "informe_riesgos_psicosociales";

// Ítems de Riesgos Psicosociales
const riesgosItems = [
    { name: "exigenciasPsicologicas", label: "1. Exigencias psicológicas" },
    { name: "trabajoActivoDesarrollo", label: "2. Trabajo activo y posibilidades de desarrollo" },
    { name: "apoyoSocial", label: "3. Apoyo social" },
    { name: "compensaciones", label: "4. Compensaciones" },
    { name: "doblePresencia", label: "5. Doble presencia" },
];

// Opciones estandarizadas
const riesgoOptions = [
    { value: "FAVORABLE", label: "FAVORABLE" },
    { value: "PROMEDIO", label: "PROMEDIO" },
    { value: "DESFAVORABLE", label: "DESFAVORABLE" },
];

// Campos que el usuario puede editar en este formulario (para resaltar/revertir cambios).
const CAMPOS_EDITABLES = [
    "fecha",
    "recomendaciones",
    "analisisResultados",
    "conclusionPerfil",
    "user_medicoFirma",
    "nombre_medico",
];

export default function InformeRiesgoPsicosocial() {
    const today = getToday();
    const { token, userlogued, selectedSede, datosFooter, userName } = useSessionData();

    const initialFormState = {
        // Header
        norden: "",
        fecha: today,
        nombreExamen: "",

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

        // Riesgos Psicosociales
        exigenciasPsicologicas: "",
        trabajoActivoDesarrollo: "",
        apoyoSocial: "",
        compensaciones: "",
        doblePresencia: "",

        // Texto libre
        recomendaciones: "",
        analisisResultados: "",
        conclusionPerfil: undefined,

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
        handleClearnotO,
        handleChangeNumberDecimals,
        handlePrintDefault,
        handleChangeNumber,
        handleChangeSimple,
        handleClear,
        handleRadioButton,
        handleRadioButtonBoolean
    } = useForm(initialFormState, { storageKey: "InformeRiesgoPsicosocial" });

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
        <div className="space-y-3 px-4 max-w-[90%]  xl:max-w-[80%] mx-auto">
            <AccionesRegistroHeader
                tieneRegistro={form.tieneRegistro}
                hayRegistroCargado={hayRegistroCargado}
                edicionHabilitada={edicionHabilitada}
                onHabilitarEdicion={habilitarEdicion}
                onLimpiar={handleClear}
            />

            <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="flex gap-x-3 w-full">
                    <InputTextOneLine
                        label="N° Orden"
                        name="norden"
                        value={form.norden}
                        onKeyUp={handleSearch}
                        onChange={handleChangeNumber}
                        disabled={hayRegistroCargado}
                        labelWidth="120px"
                        className="w-full"
                    />
                    <SearchButton onClick={executeSearch} className="lg:hidden" />
                </div>
                <InputTextOneLine
                    label="Fecha Examen"
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
                    label="Nombre de Examen"
                    name="nombreExamen"
                    value={form.nombreExamen}
                    disabled
                    labelWidth="120px"
                />
            </SectionFieldset>

            <DatosPersonalesLaborales form={form} />

            <div className="grid md:grid-cols-2 gap-4">
                <SectionFieldset legend="Riesgos Psicosociales">
                    <RadioTable
                        items={riesgosItems}
                        options={riesgoOptions}
                        form={form}
                        handleRadioButton={handleRadioButton}
                        disabled={camposDeshabilitados}
                    />
                </SectionFieldset>
                <SectionFieldset legend="Recomendaciones y Conclusión">
                    <div className="space-y-3">
                        <InputTextArea
                            label="Recomendaciones"
                            name="recomendaciones"
                            value={form.recomendaciones}
                            onChange={handleChange}
                            rows={10}
                            disabled={camposDeshabilitados}
                            edited={isFieldEdited("recomendaciones")}
                            onRevert={() => revertField("recomendaciones")}
                        />
                        <InputsBooleanRadioGroup
                            label="Conclusión del Perfil"
                            name="conclusionPerfil"
                            value={form.conclusionPerfil}
                            labelWidth="120px"
                            onChange={handleRadioButtonBoolean}
                            trueLabel="Cumple"
                            falseLabel="No Cumple"
                            disabled={camposDeshabilitados}
                            edited={isFieldEdited("conclusionPerfil")}
                            onRevert={() => revertField("conclusionPerfil")}
                        />

                    </div>
                </SectionFieldset>
            </div>

            <SectionFieldset legend="Análisis y Resultados">
                <InputTextArea
                    label=""
                    name="analisisResultados"
                    value={form.analisisResultados}
                    onChange={handleChange}
                    rows={6}
                    disabled={camposDeshabilitados}
                    edited={isFieldEdited("analisisResultados")}
                    onRevert={() => revertField("analisisResultados")}
                />
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
