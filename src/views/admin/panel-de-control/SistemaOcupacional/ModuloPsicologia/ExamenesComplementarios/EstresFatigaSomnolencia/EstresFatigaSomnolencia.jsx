import {
    InputTextOneLine,
    InputTextArea,
    InputsBooleanRadioGroup,
} from "../../../../../../components/reusableComponents/ResusableComponents";
import SectionFieldset from "../../../../../../components/reusableComponents/SectionFieldset";
import SearchButton from "../../../../../../components/reusableComponents/SearchButton";
import RegistroEstadoPill from "../../../../../../components/reusableComponents/RegistroEstadoPill";
import AuditoriaRegistro from "../../../../../../components/reusableComponents/AuditoriaRegistro";
import { useSessionData } from "../../../../../../hooks/useSessionData";
import { getToday, getFechaHoraActual } from "../../../../../../utils/helpers";
import { buildAuditoria } from "../../../../../../utils/auditoriaUtils";
import { useForm } from "../../../../../../hooks/useForm";
import { useRegistroEditable } from "../../../../../../hooks/useRegistroEditable";
import { PrintHojaR, SubmitDataService, UpdateDataService, VerifyTR } from "./controllerEstresFatigaSomnolencia";
import BotonesForm from "../../../../../../components/templates/BotonesForm";
import EmpleadoComboBox from "../../../../../../components/reusableComponents/EmpleadoComboBox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

const tabla = "informe_psicologico_estres";

// Campos que el usuario puede editar en este formulario (para resaltar/revertir cambios).
const CAMPOS_EDITABLES = [
    "fechaExamen",
    "nombreExamen",
    "esApto",
    "escalaStress",
    "somnolencia",
    "testFatiga",
    "fortalezasOportunidades",
    "amenazasDebilidades",
    "observaciones",
    "recomendaciones",
    "user_medicoFirma",
    "nombre_medico",
];

export default function EstresFatigaSomnolencia() {
    const today = getToday();
    const { token, userlogued, selectedSede, datosFooter, userName } = useSessionData();

    const initialFormState = {
        // Header - Información del examen
        norden: "",
        fechaExamen: today,
        nombreExamen: "",
        esApto: undefined,

        // Datos Personales
        nombres: "",
        apellidos: "",
        fechaNacimiento: "",
        edad: "",
        lugarNacimiento: "",
        domicilioActual: "",
        estadoCivil: "",
        nivelEstudios: "",

        // Datos Laborales
        empresa: "",
        contrata: "",
        ocupacion: "",
        cargoDesempenar: "",

        // Criterios Psicológicos
        escalaStress: "",
        somnolencia: "",
        testFatiga: "",

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
        handleChangeSimple,
        handleRadioButtonBoolean,
        handleChangeNumberDecimals,
        handleClear,
        handleClearnotO,
        handlePrintDefault,
    } = useForm(initialFormState, { storageKey: "informePsicologicoADECOPsicologia" });

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
                <div className="flex gap-4 items-center 2xl:col-span-2">
                    <h4 className="font-semibold min-w-[120px] max-w-[120px]">Nombre del Examen:</h4>
                    <select
                        name="nombreExamen"
                        value={form.nombreExamen}
                        onChange={handleChangeSimple}
                        disabled={camposDeshabilitados}
                        className={`border rounded px-2 py-1 text-base w-full ${camposDeshabilitados ? "bg-gray-300" : ""} ${isFieldEdited("nombreExamen") ? "border-orange-400 bg-orange-100" : ""}`}
                    >
                        <option value="">
                        </option>
                        <option value="INF. PSIC. - ESTRÉS/ FATIGA Y SOMNOLENCIA">
                            INF. PSIC. - ESTRÉS/ FATIGA Y SOMNOLENCIA
                        </option>
                        <option value="INFORME PSICOLÓGICO - ESTRÉS">
                            INFORME PSICOLÓGICO - ESTRÉS
                        </option>
                        <option value="INFORME PSICOLÓGICO - SOMNOLENCIA Y FATIGA">
                            INFORME PSICOLÓGICO - SOMNOLENCIA Y FATIGA
                        </option>
                    </select>
                </div>
                <InputsBooleanRadioGroup
                    label="Aptitud"
                    name="esApto"
                    value={form.esApto}
                    trueLabel="APTO"
                    falseLabel="NO APTO"
                    labelWidth="120px"
                    onChange={handleRadioButtonBoolean}
                    disabled={camposDeshabilitados}
                    edited={isFieldEdited("esApto")}
                    onRevert={() => revertField("esApto")}
                />
            </SectionFieldset>
            <SectionFieldset legend="Datos Necesarios">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Columna Izquierda */}
                    <div className="space-y-3">
                        <InputTextOneLine
                            label="Nombres"
                            name="nombres"
                            value={form.nombres}
                            disabled
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="Apellidos"
                            name="apellidos"
                            value={form.apellidos}
                            disabled
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="Fecha Nacimiento"
                            name="fechaNacimiento"
                            value={form.fechaNacimiento}
                            disabled
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="Lugar Nacimiento"
                            name="lugarNacimiento"
                            value={form.lugarNacimiento}
                            disabled
                            labelWidth="120px"
                        />
                    </div>

                    {/* Columna Derecha */}
                    <div className="space-y-3">
                        <InputTextOneLine
                            label="Domicilio Actual"
                            name="domicilioActual"
                            value={form.domicilioActual}
                            disabled
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="Edad"
                            name="edad"
                            value={form.edad}
                            disabled
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="Estado Civil"
                            name="estadoCivil"
                            value={form.estadoCivil}
                            disabled
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="Nivel Estudios"
                            name="nivelEstudios"
                            value={form.nivelEstudios}
                            disabled
                            labelWidth="120px"
                        />
                    </div>
                </div>
            </SectionFieldset>
            <SectionFieldset legend="Datos Laborales">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-3">
                    <InputTextOneLine
                        label="Empresa"
                        name="empresa"
                        value={form.empresa}
                        disabled
                        labelWidth="120px"
                    />
                    <InputTextOneLine
                        label="Contrata"
                        name="contrata"
                        value={form.contrata}
                        disabled
                        labelWidth="120px"
                    />
                    <InputTextOneLine
                        label="Ocupación"
                        name="ocupacion"
                        value={form.ocupacion}
                        disabled
                        labelWidth="120px"
                    />
                    <InputTextOneLine
                        label="Cargo Desempeñar"
                        name="cargoDesempenar"
                        value={form.cargoDesempenar}
                        disabled
                        labelWidth="120px"
                    />
                </div>
            </SectionFieldset>
            <SectionFieldset legend="Criterios Psicológicos">
                <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        <InputTextOneLine
                            label="1.- Escala Sintomática de Estrés"
                            name="escalaStress"
                            value={form?.escalaStress}
                            onChange={handleChange}
                            labelWidth="120px"
                            disabled={camposDeshabilitados}
                            edited={isFieldEdited("escalaStress")}
                            onRevert={() => revertField("escalaStress")}
                        />
                        <InputTextOneLine
                            label="2.- Somnolencia"
                            name="somnolencia"
                            value={form?.somnolencia}
                            onChange={handleChange}
                            labelWidth="120px"
                            disabled={camposDeshabilitados}
                            edited={isFieldEdited("somnolencia")}
                            onRevert={() => revertField("somnolencia")}
                        />
                        <InputTextOneLine
                            label="3.- Test de Intensidad de Fatiga"
                            name="testFatiga"
                            value={form?.testFatiga}
                            onChange={handleChange}
                            labelWidth="120px"
                            disabled={camposDeshabilitados}
                            edited={isFieldEdited("testFatiga")}
                            onRevert={() => revertField("testFatiga")}
                        />
                    </div>
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
