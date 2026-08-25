import { useForm } from "../../../../../../hooks/useForm"
import { getToday, getFechaHoraActual } from "../../../../../../utils/helpers";
import {
    InputTextOneLine,
    RadioTable,
    InputTextArea,
    InputsBooleanRadioGroup,
} from "../../../../../../components/reusableComponents/ResusableComponents";
import SearchButton from "../../../../../../components/reusableComponents/SearchButton";
import RegistroEstadoPill from "../../../../../../components/reusableComponents/RegistroEstadoPill";
import AuditoriaRegistro from "../../../../../../components/reusableComponents/AuditoriaRegistro";
import { buildAuditoria } from "../../../../../../utils/auditoriaUtils";
import { useRegistroEditable } from "../../../../../../hooks/useRegistroEditable";
import { PrintHojaR, SubmitDataService, UpdateDataService, VerifyTR } from "./controllerAversionRiesgo";
import SectionFieldset from "../../../../../../components/reusableComponents/SectionFieldset";
import BotonesForm from "../../../../../../components/templates/BotonesForm";
import DatosPersonalesLaborales from "../../../../../../components/templates/DatosPersonalesLaborales";
import { useSessionData } from "../../../../../../hooks/useSessionData";
import EmpleadoComboBox from "../../../../../../components/reusableComponents/EmpleadoComboBox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

const tabla = "aversionalriesgo"

// Campos que el usuario puede editar en este formulario (para resaltar/revertir cambios).
const CAMPOS_EDITABLES = [
    "fechaExam",
    "practicaFuncional",
    "recursividad",
    "capacidadAtencion",
    "estabilidadEmocional",
    "flexibilidadEmociones",
    "controlImpulsos",
    "subordinacion",
    "adecuacionNormas",
    "consideracionTerceros",
    "autonomiaTrabajo",
    "proactividad",
    "capacidadPresion",
    "evaluacionRiesgos",
    "motivacionCargo",
    "analisisResultados",
    "recomendaciones",
    "conclusion",
    "user_medicoFirma",
    "nombre_medico",
];

export default function AversionRiesgo() {
    const today = getToday();
    const { token, userlogued, selectedSede, datosFooter, userName } = useSessionData();

    const initialFormState = {
        norden: "",
        fechaExam: today,
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

        practicaFuncional: "",
        recursividad: "",
        capacidadAtencion: "",

        estabilidadEmocional: "",
        flexibilidadEmociones: "",
        controlImpulsos: "",

        subordinacion: "",
        adecuacionNormas: "",
        consideracionTerceros: "",
        autonomiaTrabajo: "",
        proactividad: "",
        capacidadPresion: "",
        evaluacionRiesgos: "",
        motivacionCargo: "",

        analisisResultados: "",
        recomendaciones: "",

        conclusion: undefined,

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
    }
    const {
        form,
        setForm,
        handleChange,
        handleChangeNumber,
        handleChangeNumberDecimals,
        handleRadioButton,
        handleRadioButtonBoolean,
        handleChangeSimple,
        handleClear,
        handleClearnotO,
        handlePrintDefault,
    } = useForm(initialFormState, { storageKey: "aversionRiesgoPsicologia" });

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
            <div className="sticky top-2 z-20 flex justify-end pointer-events-none">
                <RegistroEstadoPill
                    tieneRegistro={form.tieneRegistro}
                    className={hayRegistroCargado ? "" : "invisible"}
                />
                {hayRegistroCargado && form.tieneRegistro && !edicionHabilitada && (
                    <button
                        type="button"
                        onClick={habilitarEdicion}
                        className="pointer-events-auto inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-3 py-1.5 rounded-full shadow-sm transition-all duration-150 ease-out hover:shadow-lg active:scale-95"
                    >
                        <FontAwesomeIcon icon={faEdit} /> Habilitar edición
                    </button>
                )}
            </div>

            <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 xl:grid-cols-3 gap-x-4 gap-y-3">
                <div className="flex gap-x-3 w-full">
                    <InputTextOneLine
                        label="N° Orden"
                        name="norden"
                        value={form?.norden}
                        onChange={handleChangeNumber}
                        onKeyUp={handleSearch}
                        disabled={hayRegistroCargado}
                        labelWidth="120px"
                        className="w-full"
                    />
                    <SearchButton onClick={executeSearch} className="xl:hidden" />
                </div>
                <InputTextOneLine
                    label="Fecha"
                    name="fechaExam"
                    type="date"
                    value={form?.fechaExam}
                    onChange={handleChangeSimple}
                    disabled={camposDeshabilitados}
                    edited={isFieldEdited("fechaExam")}
                    onRevert={() => revertField("fechaExam")}
                    labelWidth="120px"
                />
                <InputTextOneLine
                    label="Tipo de Examen"
                    name="nombreExamen"
                    value={form.nombreExamen}
                    disabled
                    labelWidth="120px"
                />
            </SectionFieldset>

            <DatosPersonalesLaborales form={form} />

            {/* Contenido*/}
            <div className="space-y-3 grid grid-cols-1 xl:grid-cols-3 gap-4">
                <div className="grid grid-cols-1 gap-4 mt-3">
                    <SectionFieldset legend="Aspectos Intelectuales">
                        <RadioTable
                            items={[
                                { name: "practicaFuncional", label: "Practica y Funcional" },
                                { name: "recursividad", label: "Recursividad" },
                                { name: "capacidadAtencion", label: "Capacidad de atención y concentración" }
                            ]}
                            options={[
                                { value: "BAJO", label: "Bajo" },
                                { value: "MEDIO", label: "Medio" },
                                { value: "ALTO", label: "Alto" }
                            ]}
                            form={form}
                            handleRadioButton={handleRadioButton}
                            labelColumns={2}
                            disabled={camposDeshabilitados}
                            isFieldEdited={isFieldEdited}
                            onRevert={revertField}
                        />
                    </SectionFieldset>
                    <SectionFieldset legend="Aspectos Emocionales" >
                        <RadioTable
                            items={[
                                { name: "estabilidadEmocional", label: "Estabilidad emocional - madurez" },
                                { name: "flexibilidadEmociones", label: "Flexibilidad en el manejo de las emociones" },
                                { name: "controlImpulsos", label: "Control de impulsos" }
                            ]}
                            options={[
                                { value: "BAJO", label: "Bajo" },
                                { value: "MEDIO", label: "Medio" },
                                { value: "ALTO", label: "Alto" }
                            ]}
                            form={form}
                            handleRadioButton={handleRadioButton}
                            labelColumns={2}
                            disabled={camposDeshabilitados}
                            isFieldEdited={isFieldEdited}
                            onRevert={revertField}
                        />
                    </SectionFieldset>
                </div>
                <SectionFieldset legend="Comp. Esp. Conducta Segura" >
                    <RadioTable
                        items={[
                            { name: "subordinacion", label: "Capacidad de subordinación" },
                            { name: "adecuacionNormas", label: "Adecuación a las normas y procedimientos" },
                            { name: "consideracionTerceros", label: "Consideración de terceros" },
                            { name: "autonomiaTrabajo", label: "Autonomía para trabajar" },
                            { name: "proactividad", label: "Proactividad" },
                            { name: "capacidadPresion", label: "Capacidad para trabajar bajo presión" },
                            { name: "evaluacionRiesgos", label: "Capacidad para evaluar riesgos" },
                            { name: "motivacionCargo", label: "Motivación por el cargo" },
                        ]}
                        options={[
                            { value: "BAJO", label: "Bajo" },
                            { value: "MEDIO", label: "Medio" },
                            { value: "ALTO", label: "Alto" },
                        ]}
                        form={form}
                        handleRadioButton={handleRadioButton}
                        labelColumns={2}
                        disabled={camposDeshabilitados}
                        isFieldEdited={isFieldEdited}
                        onRevert={revertField}
                    />
                </SectionFieldset>
                <section className="space-y-3">
                    <SectionFieldset legend="Análisis y Resultados">
                        <InputTextArea
                            label="Análisis y Resultados"
                            value={form.analisisResultados}
                            onChange={handleChange}
                            rows={6}
                            name="analisisResultados"
                            disabled={camposDeshabilitados}
                            edited={isFieldEdited("analisisResultados")}
                            onRevert={() => revertField("analisisResultados")}
                        />
                        <InputTextArea
                            label="Recomendaciones"
                            value={form.recomendaciones}
                            onChange={handleChange}
                            rows={6}
                            name="recomendaciones"
                            disabled={camposDeshabilitados}
                            edited={isFieldEdited("recomendaciones")}
                            onRevert={() => revertField("recomendaciones")}
                        />
                    </SectionFieldset>
                    <SectionFieldset legend="Conclusión">
                        <InputsBooleanRadioGroup
                            name="conclusion"
                            value={form?.conclusion}
                            vertical
                            onChange={handleRadioButtonBoolean}
                            trueLabel="CUMPLE CON EL PERFIL"
                            falseLabel="NO CUMPLE CON EL PERFIL"
                            disabled={camposDeshabilitados}
                            edited={isFieldEdited("conclusion")}
                            onRevert={() => revertField("conclusion")}
                        />
                    </SectionFieldset>
                </section>
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
