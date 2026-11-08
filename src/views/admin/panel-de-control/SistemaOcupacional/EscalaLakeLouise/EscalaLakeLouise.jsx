import { Fragment } from "react";
import EmpleadoComboBox from "../../../../components/reusableComponents/EmpleadoComboBox";
import InputTextOneLine from "../../../../components/reusableComponents/InputTextOneLine";
import SectionFieldset from "../../../../components/reusableComponents/SectionFieldset";
import RevertButton from "../../../../components/reusableComponents/RevertButton";
import SearchButton from "../../../../components/reusableComponents/SearchButton";
import AccionesRegistroHeader from "../../../../components/reusableComponents/AccionesRegistroHeader";
import AuditoriaRegistro from "../../../../components/reusableComponents/AuditoriaRegistro";
import BotonesForm from "../../../../components/templates/BotonesForm";
import DatosPersonalesLaborales from "../../../../components/templates/DatosPersonalesLaborales";
import { useForm } from "../../../../hooks/useForm";
import { useRegistroEditable } from "../../../../hooks/useRegistroEditable";
import { useSessionData } from "../../../../hooks/useSessionData";
import { getToday, getFechaHoraActual } from "../../../../utils/helpers";
import { buildAuditoria } from "../../../../utils/auditoriaUtils";
import {
    calcularPuntaje,
    PREGUNTAS_LAKE_LOUISE,
    PrintHojaR,
    SubmitDataService,
    UpdateDataService,
    VerifyTR,
} from "./ControllerEscalaLakeLouise";

const tabla = "escala_lake_louise"

// Preguntas de la escala: la respuesta elegida es el índice de su opción (0, 1, 2...) y también su puntaje.
const QUESTIONS = [
    {
        title: "Cefalea",
        name: "cefalea",
        labels: ["Ausente", "Leve", "Moderada", "Grave"],
    },
    {
        title: "Síntomas Digestivos",
        name: "sintomasDigestivos",
        labels: ["Buen apetito", "Poco apetito o náuseas", "Náuseas moderadas o vómitos", "Náuseas o vómitos graves o incapacitantes"],
    },
    {
        title: "Fatiga y/o debilidad",
        name: "fatiga",
        labels: ["Ausentes", "Leve", "Moderada", "Grave o incapacitante"],
    },
    {
        title: "Vértigo/mareos",
        name: "vertigo",
        labels: ["Ausentes", "Leves", "Moderados", "Graves o incapacitantes"],
    },
    {
        title: "Alteraciones del sueño",
        name: "alteracionesSueno",
        labels: ["Duerme como habitualmente lo hace", "No duerme como habitualmente lo hace", "Se despierta muchas veces, sueño nocturno escaso", "No puede dormir"],
    },
    {
        title: "Alteraciones mentales",
        name: "alteracionesMentales",
        labels: ["Ausentes", "Letargo", "Desorientado/confuso", "Estupor/semiconciencia", "Coma"],
    },
    {
        title: "Ataxia (caminar sobre una línea haciendo coincidir taco con punta)",
        name: "ataxia",
        labels: ["Marcha normal", "Marcha tambaleante", "Pisadas fuera de línea", "Caídas al suelo", "Incapacidad para pararse"],
    },
    {
        title: "Edemas periféricos",
        name: "edemasPerifericos",
        labels: ["Ausentes", "En una extremidad", "En ≥ 2 extremidades"],
    },
]

const SINTOMAS_QUESTIONS = QUESTIONS.slice(0, 5);
const HALLAZGOS_QUESTIONS = QUESTIONS.slice(5);

// Campos que el usuario puede editar en este formulario (para resaltar/revertir cambios).
const CAMPOS_EDITABLES = [
    "fecha",
    ...PREGUNTAS_LAKE_LOUISE,
    "user_medicoFirma",
    "nombre_medico",
];

export default function EscalaLakeLouise() {
    const today = getToday();
    const { token, userlogued, selectedSede, datosFooter, userName } = useSessionData();

    const initialFormState = {
        norden: "",
        id: null,
        fecha: today,
        nombreExamen: "",

        nombres: "",
        edad: "",
        sexo: "",
        dni: "",
        fechaNacimiento: "",
        lugarNacimiento: "",
        estadoCivil: "",
        nivelEstudios: "",

        // Datos Laborales
        empresa: "",
        contrata: "",
        ocupacion: "",
        cargoDesempenar: "",

        //todos son int
        cefalea: parseInt("0"),
        sintomasDigestivos: parseInt("0"),
        fatiga: parseInt("0"),
        vertigo: parseInt("0"),
        alteracionesSueno: parseInt("0"),
        alteracionesMentales: parseInt("0"),
        ataxia: parseInt("0"),
        edemasPerifericos: parseInt("0"),
        calificacion: "",

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
        handleChangeNumberDecimals,
        handleChangeSimple,
        handleClear,
        handleClearnotO,
        handlePrintDefault,
    } = useForm(initialFormState, { storageKey: "escala_lake_louise" });

    const {
        edicionHabilitada,
        habilitarEdicion,
        camposDeshabilitados,
        valoresOriginales,
        isFieldEdited,
        revertField,
        revertFields,
    } = useRegistroEditable(form, setForm, { tieneRegistro: form.tieneRegistro, camposEditables: CAMPOS_EDITABLES });

    // El médico se compone de 2 campos (id de firma + nombre): se detecta el cambio por el id y se revierten ambos.
    const isMedicoEdited = isFieldEdited("user_medicoFirma");
    const revertMedico = () => revertFields(["user_medicoFirma", "nombre_medico"]);

    // La calificación es la suma de las respuestas: se recalcula al responder y al revertir una pregunta.
    const setRespuesta = (name, value) => {
        setForm((f) => {
            const next = { ...f, [name]: value };
            next.calificacion = calcularPuntaje(next);
            return next;
        });
    };

    const revertPregunta = (name) => {
        if (!valoresOriginales) return;
        setRespuesta(name, valoresOriginales[name]);
    };

    const handleSave = () => {
        SubmitDataService(form, token, userlogued, handleClear, tabla, datosFooter);
    };

    const handleEdit = () => {
        UpdateDataService(form, token, userlogued, handleClear, tabla, datosFooter);
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

    const handlePrint = () => {
        handlePrintDefault(() => {
            PrintHojaR(form.norden, token, tabla, datosFooter);
        });
    };

    // Fila de una pregunta: título, una opción por respuesta (se rellena hasta `maxOpciones`) y el botón de revertir.
    const filaPregunta = (question, index, maxOpciones) => (
        <Fragment key={question.name}>
            <div className="col-span-2 font-bold">{index + 1 + ".- " + question.title}</div>
            {question.labels.map((label, value) => (
                <div key={value} className="text-center">
                    <input
                        type="radio"
                        name={question.name}
                        value={value}
                        checked={form[question.name] === value}
                        disabled={camposDeshabilitados}
                        onChange={() => setRespuesta(question.name, value)}
                    />
                    <div className="text-center">{label}</div>
                </div>
            ))}
            {Array.from({ length: maxOpciones - question.labels.length }, (_, i) => (
                <div key={`vacio-${i}`} />
            ))}
            <div className="flex justify-center">
                {isFieldEdited(question.name) && (
                    <RevertButton onClick={() => revertPregunta(question.name)} title="Revertir selección" />
                )}
            </div>
        </Fragment>
    );

    const puntaje = Number(form.calificacion || 0);

    let txtPuntaje = "";

    if (puntaje >= 0 && puntaje <= 3) {
        txtPuntaje = "MMA Leve";
    } else if (puntaje >= 4 && puntaje <= 6) {
        txtPuntaje = "MMA Moderado";
    } else if (puntaje >= 7) {
        txtPuntaje = "MMA Grave";
    }

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

            <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                <div className="flex gap-x-3 w-full">
                    <InputTextOneLine
                        label="N° Orden"
                        name="norden"
                        value={form.norden}
                        onChange={handleChangeNumberDecimals}
                        onKeyUp={handleSearch}
                        disabled={nordenDisabled}
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
            </SectionFieldset>

            <DatosPersonalesLaborales form={form} />

            <SectionFieldset legend="Situación">
                <div className="flex p-3 overflow-x-auto">
                    <div className="grid grid-cols-[4fr,1fr,1fr,1fr,1fr,1fr,2rem] gap-2 items-center mx-auto">

                        <div className="col-span-2"></div>

                        {[0, 1, 2, 3].map((n) => (
                            <div
                                key={n}
                                className="text-center font-bold text-blue-800 bg-gray-100 py-2 rounded-t-lg"
                            >
                                {n}
                            </div>
                        ))}
                        <div></div>
                        {SINTOMAS_QUESTIONS.map((question, index) => filaPregunta(question, index, 4))}
                    </div>

                </div>
            </SectionFieldset>

            <SectionFieldset legend="Hallazgos clínicos">
                <div className="flex p-3 overflow-x-auto">
                    <div className="grid grid-cols-[4fr,1fr,1fr,1fr,1fr,1fr,1fr,2rem] gap-2 items-center mx-auto">

                        <div className="col-span-2"></div>

                        {[0, 1, 2, 3, 4].map((n) => (
                            <div
                                key={n}
                                className="text-center font-bold text-blue-800 bg-gray-100 p-2 rounded-t-lg"
                            >
                                {n}
                            </div>
                        ))}
                        <div></div>
                        {HALLAZGOS_QUESTIONS.map((question, index) => filaPregunta(question, index, 5))}
                    </div>

                </div>
            </SectionFieldset>

            <SectionFieldset legend="Calificación">
                <div className="grid grid-cols-2 items-center gap-2 py-4">

                    <div className="text-xl text-gray-600">
                        <div>1 - 3 ptos. → MMA leve</div>
                        <div>4 - 6 ptos. → MMA moderado</div>
                        <div>≥ 7 ptos. → MMA grave</div>
                    </div>

                    <div>
                        <div className="text-4xl font-bold text-blue-700">
                            {form.calificacion}
                        </div>
                        <div className="text-xl font-semibold">
                            {txtPuntaje || "Sin clasificación"}
                        </div>
                    </div>

                </div>
            </SectionFieldset>


            <SectionFieldset legend="Asignación de Médico" className="w-full">
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
