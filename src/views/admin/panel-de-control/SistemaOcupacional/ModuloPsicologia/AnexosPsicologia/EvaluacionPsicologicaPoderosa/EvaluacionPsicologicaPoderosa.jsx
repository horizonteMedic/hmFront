import {
    InputTextOneLine,
    InputTextArea,
    InputsRadioGroup,
    RadioTable,
} from "../../../../../../components/reusableComponents/ResusableComponents";
import { useForm } from "../../../../../../hooks/useForm";
import { useSessionData } from "../../../../../../hooks/useSessionData";
import { useRegistroEditable } from "../../../../../../hooks/useRegistroEditable";
import { getToday, getFechaHoraActual } from "../../../../../../utils/helpers";
import { buildAuditoria } from "../../../../../../utils/auditoriaUtils";
import { PrintHojaR, SubmitDataService, UpdateDataService, VerifyTR } from "./controllerEvaluacionPsicologicaPoderosa";
import SectionFieldset from "../../../../../../components/reusableComponents/SectionFieldset";
import SearchButton from "../../../../../../components/reusableComponents/SearchButton";
import AccionesRegistroHeader from "../../../../../../components/reusableComponents/AccionesRegistroHeader";
import AuditoriaRegistro from "../../../../../../components/reusableComponents/AuditoriaRegistro";
import BotonesForm from "../../../../../../components/templates/BotonesForm";
import EmpleadoComboBox from "../../../../../../components/reusableComponents/EmpleadoComboBox";
import { useEffect, useState } from "react";
import DatosPersonalesLaborales from "../../../../../../components/templates/DatosPersonalesLaborales";

// Áreas de Evaluación: Inteligencia
const inteligenciaItems = [
    { name: "intelCoeficiente", label: "1. Coeficiente Intelectual" },
    { name: "intelComprension", label: "2. Comprensión" },
    { name: "intelAtencion", label: "3. Nivel de atención / Concentración" },
    { name: "intelMemoria", label: "4. Memoria a corto, mediano y largo plazo" },
    { name: "intelVisomotora", label: "5. Coordinación viso-motora" },
    { name: "intelOrientacionEspacial", label: "6. Orientación espacial" },
    { name: "intelDiscriminarDetalles", label: "7. Capacidad para discriminar detalles" },
    { name: "intelAprendizaje", label: "8. Capacidad de aprendizaje" },
    { name: "intelAnalisisSintesis", label: "9. Capacidad de análisis y síntesis" }
];
// Áreas de Evaluación: Personalidad
const personalidadItems = [
    { name: "persEstabilidad", label: "1. Estabilidad emocional" },
    { name: "persAfrontaEstres", label: "2. Afrontamiento al estrés" },
    { name: "persAfrontaRiesgo", label: "3. Afrontamiento al riesgo" },
    { name: "persRelaciones", label: "4. Relaciones interpersonales / Adaptación al medio" },
    { name: "persNormasReglas", label: "5. Disposición para acatar normas y reglas" },
];
// Opciones estandarizadas S / NPS / NP / NPI
const evalOptions = [
    { value: "S", label: "Superior" },
    { value: "NPS", label: "Nivel Promedio Superior" },
    { value: "NP", label: "Nivel Promedio" },
    { value: "NPI", label: "Nivel Promedio Inferior" },
    { value: "I", label: "Inferior" },
];

// Campos que el usuario puede editar en este formulario (para resaltar/revertir cambios).
const CAMPOS_EDITABLES = [
    "fechaExam",
    "aptitud",
    "recomendaciones",
    "user_medicoFirma",
    "nombre_medico",
    // Áreas de Evaluación - Inteligencia
    "intelCoeficiente",
    "intelComprension",
    "intelAtencion",
    "intelMemoria",
    "intelVisomotora",
    "intelOrientacionEspacial",
    "intelDiscriminarDetalles",
    "intelAprendizaje",
    "intelAnalisisSintesis",
    // Áreas de Evaluación - Personalidad
    "persEstabilidad",
    "persAfrontaEstres",
    "persAfrontaRiesgo",
    "persRelaciones",
    "persNormasReglas",
    // Campos de texto libres
    "fortalezasOportunidades",
    "amenazasDebilidades",
    "observaciones",
];

export default function EvaluacionPsicologicaPoderosa() {
    const today = getToday();
    const [tabla, setTabla] = useState("evaluacion_psicologica_poderosa_normal");
    const [tipoInforme, setTipoInforme] = useState({ tipoInforme: "NORMAL" })

    const { token, userlogued, selectedSede, datosFooter, userName } = useSessionData();

    const initialFormState = {
        // Header
        norden: "",
        codigoEvaluacionPsicologicaPoderosa: null,
        fechaExam: today,
        nombreExamen: "",
        aptitud: "",

        // Datos personales
        nombres: "",
        apellidos: "",
        dni: "",
        fechaNacimiento: "",
        lugarNacimiento: "",
        domicilioActual: "",
        edad: "",
        sexo: "",
        estadoCivil: "",
        nivelEstudios: "",

        // Datos laborales
        ocupacion: "",
        cargoDesempenar: "",
        empresa: "",
        contrata: "",

        // Áreas de Evaluación (Inteligencia)
        intelCoeficiente: "",
        intelComprension: "",
        intelAtencion: "",
        intelMemoria: "",
        intelVisomotora: "",
        intelOrientacionEspacial: "",
        intelDiscriminarDetalles: "",
        intelAprendizaje: "",
        intelAnalisisSintesis: "",

        // Áreas de Evaluación (Personalidad)
        persEstabilidad: "NP",
        persAfrontaEstres: "NP",
        persAfrontaRiesgo: "NP",
        persRelaciones: "NP",
        persNormasReglas: "NP",

        // Campos de texto libres
        fortalezasOportunidades: "",
        amenazasDebilidades: "",
        observaciones: "",
        recomendaciones: "",

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
        handlePrintDefault,
        handleChangeNumber,
        handleChangeSimple,
        handleClear,
        handleRadioButton,
        handleChangeNumberDecimals,
    } = useForm(initialFormState, { storageKey: "EvaluacionPsicologicaPoderosa" });

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

    const handleRadioButtonTipoInforme = (e, value) => {
        const { name } = e.target;
        setTipoInforme((f) => ({
            ...f,
            [name]: value.toUpperCase(),
        }));
    };

    useEffect(() => {
        const value = tipoInforme.tipoInforme;
        setTabla(
            value == "NORMAL" ? "evaluacion_psicologica_poderosa_normal" :
                value == "LICENCIA" ? "evaluacion_psicologica_poderosa_licencia" :
                    value == "T. EN CALIENTE" ? "evaluacion_psicologica_poderosa_caliente" : "evaluacion_psicologica_poderosa_normal")
        handleClearnotO();
    }, [tipoInforme.tipoInforme])

    const handleSave = () => {
        SubmitDataService({ ...form, ...tipoInforme }, token, userlogued, handleClear, tabla, datosFooter);
    };

    const handleEdit = () => {
        UpdateDataService({ ...form, ...tipoInforme }, token, userlogued, handleClear, tabla, datosFooter);
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

    const hayRegistroCargado = Boolean(form.nombres || form.apellidos);

    const handlePrintNordenChange = (e) => {
        const value = e.target.value;
        if (!/^\d*$/.test(value)) return; // solo dígitos

        const hayDatosCargados = Boolean(form.nombres || form.apellidos || form.tieneRegistro);
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

            {/* Header */}
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
                    name="fechaExam"
                    type="date"
                    value={form.fechaExam}
                    onChange={handleChangeSimple}
                    disabled={camposDeshabilitados}
                    edited={isFieldEdited("fechaExam")}
                    onRevert={() => revertField("fechaExam")}
                    labelWidth="120px"
                />
                <InputTextOneLine
                    label="Nombre Examen"
                    name="nombreExamen"
                    value={form.nombreExamen}
                    disabled
                    labelWidth="120px"
                />
                <InputsRadioGroup
                    label="Tipo Informe"
                    name="tipoInforme"
                    value={tipoInforme.tipoInforme}
                    labelWidth="120px"
                    options={[
                        { label: "NORMAL", value: "NORMAL" },
                        { label: "LICENCIA", value: "LICENCIA" },
                        { label: "T. EN CALIENTE", value: "T. EN CALIENTE" },
                    ]}
                    onChange={handleRadioButtonTipoInforme}
                />
                <InputsRadioGroup
                    label="Aptitud"
                    name="aptitud"
                    value={form.aptitud}
                    labelWidth="120px"
                    options={[
                        { label: "APTO", value: "APTO" },
                        { label: "NO APTO", value: "NO APTO" },
                        { label: "EX", value: "EX" },
                        { label: "AP O.", value: "AP O." },
                    ]}
                    onChange={handleRadioButton}
                    disabled={camposDeshabilitados}
                    edited={isFieldEdited("aptitud")}
                    onRevert={() => revertField("aptitud")}
                />
            </SectionFieldset>

            <DatosPersonalesLaborales form={form} />

            <SectionFieldset legend="Domicilio">
                <InputTextOneLine
                    label="Domicilio Actual"
                    name="domicilioActual"
                    value={form.domicilioActual}
                    disabled
                    labelWidth="160px" />
            </SectionFieldset>


            <div className="grid md:grid-cols-2 gap-4">
                {/* Áreas de Evaluación - Inteligencia */}
                <SectionFieldset legend="Áreas de Evaluación - Inteligencia" >
                    <RadioTable
                        items={inteligenciaItems}
                        options={evalOptions}
                        labelColumns={3}
                        form={form}
                        handleRadioButton={handleRadioButton}
                        disabled={camposDeshabilitados}
                        isFieldEdited={isFieldEdited}
                        onRevert={revertField}
                    />
                </SectionFieldset>
                {/* Áreas de Evaluación - Personalidad */}
                <SectionFieldset legend="Áreas de Evaluación - Personalidad" >
                    <RadioTable
                        items={personalidadItems}
                        options={evalOptions}
                        form={form}
                        labelColumns={3}
                        handleRadioButton={handleRadioButton}
                        disabled={camposDeshabilitados}
                        isFieldEdited={isFieldEdited}
                        onRevert={revertField}
                    />
                </SectionFieldset>
            </div>
            {/* Campos de texto libres */}
            <SectionFieldset legend="Conclusiones Finales" className="grid md:grid-cols-2 gap-4">
                <InputTextArea
                    label="Fortalezas y Oportunidades"
                    name="fortalezasOportunidades"
                    value={form.fortalezasOportunidades}
                    onChange={handleChange}
                    rows={5}
                    disabled={camposDeshabilitados}
                    edited={isFieldEdited("fortalezasOportunidades")}
                    onRevert={() => revertField("fortalezasOportunidades")}
                />
                <InputTextArea
                    label="Amenazas y Debilidades"
                    name="amenazasDebilidades"
                    value={form.amenazasDebilidades}
                    onChange={handleChange}
                    rows={5}
                    disabled={camposDeshabilitados}
                    edited={isFieldEdited("amenazasDebilidades")}
                    onRevert={() => revertField("amenazasDebilidades")}
                />
                <InputTextArea
                    label="Observaciones"
                    name="observaciones"
                    value={form.observaciones}
                    onChange={handleChange}
                    rows={5}
                    disabled={camposDeshabilitados}
                    edited={isFieldEdited("observaciones")}
                    onRevert={() => revertField("observaciones")}
                />
                <InputTextArea
                    label="Recomendaciones"
                    name="recomendaciones"
                    value={form.recomendaciones}
                    onChange={handleChange}
                    rows={5}
                    disabled={camposDeshabilitados}
                    edited={isFieldEdited("recomendaciones")}
                    onRevert={() => revertField("recomendaciones")}
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
