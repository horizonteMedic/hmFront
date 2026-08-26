import {
    InputTextOneLine,
    InputTextArea,
    InputsBooleanRadioGroup,
    InputsRadioGroup,
    RadioTable,
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
import { PrintHojaR, SubmitDataService, UpdateDataService, VerifyTR } from "./controllerExamenEspacioConfinado";
import BotonesForm from "../../../../../../components/templates/BotonesForm";
import EmpleadoComboBox from "../../../../../../components/reusableComponents/EmpleadoComboBox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import DatosPersonalesLaborales from "../../../../../../components/templates/DatosPersonalesLaborales";

const tabla = "psicologia_espacios_confinados";

const CAMPOS_EDITABLES = [
    "fechaExamen",
    "esApto",
    "razonamiento",
    "memoria",
    "atencionConcentracion",
    "coordinacionVisoMotora",
    "orientacionEspacial",
    "estabilidadEmocional",
    "nivelAnsiedadGeneral",
    "ansiedadEspaciosConfinados",
    "analisisResultados",
    "recomendaciones",
    "user_medicoFirma",
    "nombre_medico",
];

export default function ExamenEspacioConfinado() {
    const today = getToday();
    const { token, userlogued, selectedSede, datosFooter, userName } = useSessionData();

    const initialFormState = {
        // Header - Información del examen
        norden: "",
        fechaExamen: today,
        nombreExamen: "",
        esApto: undefined,

        // Datos Personales - Columna Izquierda
        nombres: "",
        apellidos: "",
        fechaNacimiento: "",
        lugarNacimiento: "",

        // Datos Personales - Columna Derecha
        domicilioActual: "",
        edad: "",
        estadoCivil: "",
        nivelEstudios: "",

        // Datos Laborales
        empresa: "",
        contrata: "",
        ocupacion: "",
        cargoDesempenar: "",

        // Criterios Psicológicos - Aspecto Intelectual
        razonamiento: "",
        memoria: "",
        atencionConcentracion: "",
        coordinacionVisoMotora: "",
        orientacionEspacial: "",

        // Criterios Psicológicos - Aspectos Personalidad
        estabilidadEmocional: "",
        nivelAnsiedadGeneral: "",
        ansiedadEspaciosConfinados: "",

        // Análisis y Resultados
        analisisResultados: "",
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
        handleRadioButton,
        handleChangeSimple,
        handleRadioButtonBoolean,
        handleClear,
        handleClearnotO,
        handlePrintDefault,
    } = useForm(initialFormState, { storageKey: "examenEspacioConfinadoPsicologia" });

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

    // Arrays para RadioTable - Aspecto Intelectual
    const aspectoIntelectualItems = [
        { name: "razonamiento", label: "1.- RAZONAMIENTO:" },
        { name: "memoria", label: "2.- MEMORIA:" },
        { name: "atencionConcentracion", label: "3.- ATENCIÓN Y CONCENTRACIÓN:" },
        { name: "coordinacionVisoMotora", label: "4.- COORDINACIÓN VISO-MOTORA:" },
        { name: "orientacionEspacial", label: "5.- ORIENTACIÓN ESPACIAL:" }
    ];

    const aspectoIntelectualOptions = [
        { label: "I", value: "I" },
        { label: "NPI", value: "NPI" },
        { label: "NP", value: "NP" },
        { label: "NPS", value: "NPS" },
        { label: "S", value: "S" },
    ];

    const ansiedadOptions = [
        { label: "NADA", value: "NADA" },
        { label: "POCA ANSIEDAD", value: "POCA_ANSIEDAD" },
        { label: "MODERADAMENTE ANSIOSO", value: "MODERADAMENTE_ANSIOSO" },
        { label: "ELEVADAMENTE ANSIOSO", value: "ELEVADAMENTE_ANSIOSO" },
    ];

    const estabilidadOptions = [
        { label: "INESTABLE", value: "INESTABLE" },
        { label: "ESTABLE", value: "ESTABLE" },
    ];

    const nivelAnsiedadOptions = [
        { label: "CASO", value: "CASO" },
        { label: "NO CASO", value: "NO_CASO" },
    ];

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

            <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 lg:grid-cols-2 gap-3">
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
                    label="Tipo de Examen"
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
                    labelWidth="120px"
                    onChange={handleRadioButtonBoolean}
                    disabled={camposDeshabilitados}
                    edited={isFieldEdited("esApto")}
                    onRevert={() => revertField("esApto")}
                />
            </SectionFieldset>

            <DatosPersonalesLaborales form={form} />

            <SectionFieldset legend="Domicilio Actual">
                <InputTextOneLine
                    label="Domicilio Actual"
                    name="domicilioActual"
                    value={form.domicilioActual}
                    disabled
                    labelWidth="120px"
                />
            </SectionFieldset>
 

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <SectionFieldset legend="Aspecto Intelectual">
                    <RadioTable
                        items={aspectoIntelectualItems}
                        options={aspectoIntelectualOptions}
                        form={form}
                        handleRadioButton={handleRadioButton}
                        disabled={camposDeshabilitados}
                        isFieldEdited={isFieldEdited}
                        onRevert={revertField}
                    />
                </SectionFieldset>

                <SectionFieldset legend="Aspectos Personalidad">
                    <div className="space-y-8">
                        <InputsRadioGroup
                            label="1.- ESTABILIDAD EMOCIONAL"
                            labelOnTop
                            name="estabilidadEmocional"
                            value={form.estabilidadEmocional}
                            onChange={handleRadioButton}
                            options={estabilidadOptions}
                            disabled={camposDeshabilitados}
                            edited={isFieldEdited("estabilidadEmocional")}
                            onRevert={() => revertField("estabilidadEmocional")}
                        />
                        <InputsRadioGroup
                            label="2.- NIVEL DE ANSIEDAD GENERAL"
                            labelOnTop
                            name="nivelAnsiedadGeneral"
                            value={form.nivelAnsiedadGeneral}
                            onChange={handleRadioButton}
                            options={nivelAnsiedadOptions}
                            disabled={camposDeshabilitados}
                            edited={isFieldEdited("nivelAnsiedadGeneral")}
                            onRevert={() => revertField("nivelAnsiedadGeneral")}
                        />
                        <InputsRadioGroup
                            label="3.- ANSIEDAD A ESPACIOS CONFINADOS"
                            labelOnTop
                            name="ansiedadEspaciosConfinados"
                            value={form.ansiedadEspaciosConfinados}
                            onChange={handleRadioButton}
                            options={ansiedadOptions}
                            vertical
                            disabled={camposDeshabilitados}
                            edited={isFieldEdited("ansiedadEspaciosConfinados")}
                            onRevert={() => revertField("ansiedadEspaciosConfinados")}
                        />
                    </div>
                </SectionFieldset>

                <SectionFieldset legend="Análisis y Resultados">
                    <div className="space-y-4">
                        <InputTextArea
                            label="ANÁLISIS Y RESULTADOS"
                            name="analisisResultados"
                            value={form.analisisResultados}
                            onChange={handleChange}
                            rows={8}
                            disabled={camposDeshabilitados}
                            edited={isFieldEdited("analisisResultados")}
                            onRevert={() => revertField("analisisResultados")}
                        />
                        <div className="mt-4">
                            <InputTextArea
                                label="RECOMENDACIONES"
                                name="recomendaciones"
                                value={form.recomendaciones}
                                onChange={handleChange}
                                rows={5}
                                disabled={camposDeshabilitados}
                                edited={isFieldEdited("recomendaciones")}
                                onRevert={() => revertField("recomendaciones")}
                            />
                        </div>
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
