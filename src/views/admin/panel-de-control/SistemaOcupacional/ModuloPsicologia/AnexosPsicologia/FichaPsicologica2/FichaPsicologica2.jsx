import {
    InputTextOneLine,
    InputTextArea,
    InputsBooleanRadioGroup,
    InputsRadioGroup,
    RadioTable,
} from "../../../../../../components/reusableComponents/ResusableComponents";
import { useForm } from "../../../../../../hooks/useForm";
import { useSessionData } from "../../../../../../hooks/useSessionData";
import { useRegistroEditable } from "../../../../../../hooks/useRegistroEditable";
import { getToday, getFechaHoraActual } from "../../../../../../utils/helpers";
import { buildAuditoria } from "../../../../../../utils/auditoriaUtils";
import { PrintHojaR, SubmitDataService, UpdateDataService, VerifyTR } from "./controllerFichaPsicologica2";
import SectionFieldset from "../../../../../../components/reusableComponents/SectionFieldset";
import SearchButton from "../../../../../../components/reusableComponents/SearchButton";
import RegistroEstadoPill from "../../../../../../components/reusableComponents/RegistroEstadoPill";
import AuditoriaRegistro from "../../../../../../components/reusableComponents/AuditoriaRegistro";
import BotonesForm from "../../../../../../components/templates/BotonesForm";
import EmpleadoComboBox from "../../../../../../components/reusableComponents/EmpleadoComboBox";
import DatosPersonalesLaborales from "../../../../../../components/templates/DatosPersonalesLaborales";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

const tabla = "ficha_psicologica_anexo02"
const today = getToday()

// Arrays para RadioTable de Orientación
const orientacionItems = [
    { name: "orientacionTiempo", label: "Tiempo" },
    { name: "orientacionEspacio", label: "Espacio" },
    { name: "orientacionPersona", label: "Persona" }
];

const orientacionOptions = [
    { value: "DESORIENTADO", label: "Desorientado" },
    { value: "ORIENTADO", label: "Orientado" }
];

// Campos que el usuario puede editar en este formulario (para resaltar/revertir cambios).
const CAMPOS_EDITABLES = ["fechaExamen", "esApto", "recomendaciones", "user_medicoFirma", "nombre_medico"];

export default function FichaPsicologica2() {
    const { token, userlogued, selectedSede, datosFooter, userName } = useSessionData();

    const initialFormState = {
        // Datos personales
        norden: "",
        fechaExamen: today,
        esApto: undefined,
        nombreExamen: "",
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

        // Motivo de evaluación
        motivoEvaluacion: "",

        // Observación de Conductas
        presentacion: "",
        postura: "",
        discursoRitmo: "",
        discursoTono: "",
        discursoArticulacion: "",
        orientacionTiempo: "",
        orientacionEspacio: "",
        orientacionPersona: "",

        // Resultados de evaluación
        nivelIntelectual: "",
        coordinacionVisomotriz: "",
        nivelMemoria: "",
        personalidad: "",
        afectividad: "",

        // Recomendaciones y Conclusiones
        recomendaciones: "",
        areaCognitiva: "",
        areaEmocional: "",

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
        handlePrintDefault,
        handleChangeNumber,
        handleChangeSimple,
        handleClear,
        handleRadioButtonBoolean,
        handleRadioButton,
        handleChangeNumberDecimals,
    } = useForm(initialFormState, { storageKey: "fichaPsicologicaAnexo2" });

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

            {/* Header con información del examen */}
            <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 lg:grid-cols-4 gap-3">
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
                    label="Fecha Entrevista"
                    name="fechaExamen"
                    type="date"
                    value={form.fechaExamen}
                    onChange={handleChangeSimple}
                    disabled={camposDeshabilitados}
                    edited={isFieldEdited("fechaExamen")}
                    onRevert={() => revertField("fechaExamen")}
                    labelWidth="120px"
                />
                <InputTextOneLine
                    label="Nombre Examen"
                    name="nombreExamen"
                    value={form.nombreExamen}
                    disabled
                    labelWidth="120px"
                />
                <InputsBooleanRadioGroup
                    label="Aptitud"
                    labelWidth="120px"
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

            <SectionFieldset legend="Domicilio">
                <InputTextOneLine
                    label="Domicilio Actual"
                    name="domicilioActual"
                    value={form.domicilioActual}
                    disabled
                    labelWidth="120px"
                />
            </SectionFieldset>

            <div className="grid md:grid-cols-2 gap-3">
                <div className="space-y-3">
                    {/* Motivo Evaluación */}
                    <SectionFieldset legend="Motivo Evaluación" fieldsetClassName="border-gray-200 rounded-lg">
                        <InputTextArea
                            rows={4}
                            name="motivoEvaluacion"
                            value={form.motivoEvaluacion}
                            onChange={handleChange}
                            disabled={camposDeshabilitados}
                        />
                    </SectionFieldset>

                    {/* Observación de Conductas */}
                    <SectionFieldset legend="Observación de Conductas" className="grid xl:grid-cols-4 gap-4">
                        <SectionFieldset legend="Presentación">
                            <InputsRadioGroup
                                name="presentacion"
                                value={form.presentacion}
                                vertical
                                onChange={handleRadioButton}
                                disabled={camposDeshabilitados}
                                options={[
                                    { label: "Adecuado", value: "ADECUADO" },
                                    { label: "Inadecuado", value: "INADECUADO" },
                                ]}
                            />
                        </SectionFieldset>

                        <SectionFieldset legend="Postura">
                            <InputsRadioGroup
                                name="postura"
                                value={form.postura}
                                vertical
                                onChange={handleRadioButton}
                                disabled={camposDeshabilitados}
                                options={[
                                    { label: "Erguida", value: "ERGUIDA" },
                                    { label: "Encorvada", value: "ENCORVADA" },
                                ]}
                            />
                        </SectionFieldset>

                        <SectionFieldset legend="Discurso: Ritmo">
                            <InputsRadioGroup
                                name="discursoRitmo"
                                value={form.discursoRitmo}
                                onChange={handleRadioButton}
                                vertical
                                disabled={camposDeshabilitados}
                                options={[
                                    { label: "Lento", value: "LENTO" },
                                    { label: "Rápido", value: "RAPIDO" },
                                    { label: "Fluido", value: "FLUIDO" },
                                ]}
                            />
                        </SectionFieldset>

                        <SectionFieldset legend="Discurso: Tono">
                            <InputsRadioGroup
                                name="discursoTono"
                                value={form.discursoTono}
                                onChange={handleRadioButton}
                                vertical
                                disabled={camposDeshabilitados}
                                options={[
                                    { label: "Bajo", value: "BAJO" },
                                    { label: "Moderado", value: "MODERADO" },
                                    { label: "Alto", value: "ALTO" },
                                ]}
                            />
                        </SectionFieldset>

                        <SectionFieldset legend="Discurso: Articulación">
                            <InputsRadioGroup
                                name="discursoArticulacion"
                                value={form.discursoArticulacion}
                                onChange={handleRadioButton}
                                vertical
                                disabled={camposDeshabilitados}
                                options={[
                                    { label: "Con dificultad", value: "CON_DIFICULTAD" },
                                    { label: "Sin dificultad", value: "SIN_DIFICULTAD" },
                                ]}
                            />
                        </SectionFieldset>

                        <SectionFieldset legend="Orientación" fieldsetClassName="md:col-span-3">
                            <RadioTable
                                items={orientacionItems}
                                options={orientacionOptions}
                                form={form}
                                handleRadioButton={handleRadioButton}
                                labelColumns={1}
                                disabled={camposDeshabilitados}
                            />
                        </SectionFieldset>
                    </SectionFieldset>
                </div>
                {/* Resultados de Evaluación */}
                <SectionFieldset legend="Resultados de Evaluación" fieldsetClassName="border-gray-200 rounded-lg">
                    <div className="grid gap-4">
                        <InputTextOneLine
                            label="Nivel Intelectual"
                            name="nivelIntelectual"
                            value={form.nivelIntelectual}
                            onChange={handleChange}
                            labelWidth="160px"
                            disabled={camposDeshabilitados}
                        />
                        <InputTextOneLine
                            label="Coordinación Visomotriz"
                            name="coordinacionVisomotriz"
                            value={form.coordinacionVisomotriz}
                            onChange={handleChange}
                            labelWidth="160px"
                            disabled={camposDeshabilitados}
                        />
                        <InputTextOneLine
                            label="Nivel de Memoria"
                            name="nivelMemoria"
                            value={form.nivelMemoria}
                            onChange={handleChange}
                            labelWidth="160px"
                            disabled={camposDeshabilitados}
                        />
                        <InputTextArea
                            rows={8}
                            label="Personalidad"
                            name="personalidad"
                            value={form.personalidad}
                            onChange={handleChange}
                            disabled={camposDeshabilitados}
                        />
                        <InputTextArea
                            rows={5}
                            label="Afectividad"
                            name="afectividad"
                            value={form.afectividad}
                            onChange={handleChange}
                            disabled={camposDeshabilitados}
                        />
                    </div>
                </SectionFieldset>
            </div>
            {/* Recomendaciones y Conclusiones */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <SectionFieldset legend="Recomendaciones" fieldsetClassName="border-gray-200 rounded-lg">
                    <InputTextArea
                        rows={9}
                        name="recomendaciones"
                        value={form.recomendaciones}
                        onChange={handleChange}
                        disabled={camposDeshabilitados}
                        edited={isFieldEdited("recomendaciones")}
                        onRevert={() => revertField("recomendaciones")}
                    />
                </SectionFieldset>
                <SectionFieldset legend="Conclusiones" fieldsetClassName="border-gray-200 rounded-lg">
                    <div className="space-y-3">
                        <InputTextArea
                            rows={4}
                            label="Área Cognitiva"
                            name="areaCognitiva"
                            value={form.areaCognitiva}
                            onChange={handleChange}
                            disabled={camposDeshabilitados}
                        />
                        <InputTextArea
                            rows={4}
                            label="Área Emocional"
                            name="areaEmocional"
                            value={form.areaEmocional}
                            onChange={handleChange}
                            disabled={camposDeshabilitados}
                        />
                    </div>
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
    );
}
