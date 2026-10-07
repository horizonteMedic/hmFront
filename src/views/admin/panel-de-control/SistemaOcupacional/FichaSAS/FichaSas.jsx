import { useState } from "react";
import Swal from "sweetalert2";
import EmpleadoComboBox from "../../../../components/reusableComponents/EmpleadoComboBox";
import InputsBooleanRadioGroup from "../../../../components/reusableComponents/InputsBooleanRadioGroup";
import InputTextAreaUpper from "../../../../components/reusableComponents/InputTextAreaUpper";
import InputTextOneLine from "../../../../components/reusableComponents/InputTextOneLine";
import SectionFieldset from "../../../../components/reusableComponents/SectionFieldset";
import SearchButton from "../../../../components/reusableComponents/SearchButton";
import RadioTable from "../../../../components/reusableComponents/RadioTable";
import RevertButton from "../../../../components/reusableComponents/RevertButton";
import CIE10List from "../../../../components/reusableComponents/CIE10List";
import AccionesRegistroHeader from "../../../../components/reusableComponents/AccionesRegistroHeader";
import AuditoriaRegistro from "../../../../components/reusableComponents/AuditoriaRegistro";
import DatosPersonalesLaborales from "../../../../components/templates/DatosPersonalesLaborales";
import BotonesForm from "../../../../components/templates/BotonesForm";
import { useForm } from "../../../../hooks/useForm";
import { useSessionData } from "../../../../hooks/useSessionData";
import { useRegistroEditable } from "../../../../hooks/useRegistroEditable";
import { getToday, getFechaHoraActual } from "../../../../utils/helpers";
import { buildAuditoria } from "../../../../utils/auditoriaUtils";
import Mallampati from "../../../../../../public/img/Mallampati.jpg";
import { PrintHojaR, SubmitDataService, UpdateDataService, VerifyTR } from "./controllerFichaSas";

const tabla = "ficha_sas";
const today = getToday();

// Campos Sí/No que dependen de un "padre" (se limpian y bloquean cuando el padre pasa a NO).
const CRITERIOS_PSG = ["criterio_a", "criterio_b"];
const CRITERIOS_D = [
    "criterio_d_imc",
    "criterio_d_hta",
    "criterio_d_cuello",
    "criterio_d_epworth",
    "criterio_d_trastorno",
    "criterio_d_ahi",
];
const CRITERIOS_APTO_3_MESES = ["criterio_c", "criterio_d", ...CRITERIOS_D, "criterio_e"];

// Campos que el usuario puede editar en este formulario (para resaltar/revertir cambios).
// Se excluyen los de solo lectura (datos del paciente y de Triaje) y `antec_familiar_apnea`,
// que desde siempre está bloqueado en este formulario.
const CAMPOS_EDITABLES = [
    "fechaExam",
    "tipoLicencia",
    // Trabajo de noche
    "trabajoNoche",
    "diasTrabajoNoche",
    "diasDescansoNoche",
    "anosTrabajoNoche",
    // Antecedentes personales
    "apneaDelSueno",
    "ultimoControl",
    "hta",
    "medicacionRiesgo",
    "polisomnografiaRealizada",
    "fechaUltimaPolisomnografia",
    "accidenteEnLaMina",
    "accidenteFueraDeLaMina",
    // Antecedentes de choques
    "criterio1_cabeceo",
    "accidente_nocturno",
    "ausencia_evidencia_maniobra",
    "choque_vehiculo_contra_otro",
    "vehiculo_invadio_carril",
    "conductor_no_recuerda",
    "tratamiento_medicinas_somnolencia",
    "conductor_encontraba_horas_extra",
    "accidente_confirmado_somnolencia",
    "accidente_alta_sospecha_somnolencia",
    "accidente_escasa_evidencia_somnolencia",
    "no_datos_suficientes",
    "accidente_no_debido_somnolencia",
    // Antecedente familiar / entrevista
    "indique_familiar_apnea",
    "ronca_al_dormir",
    "ruidos_respirar_durmiendo",
    "deja_respirar_durmiendo",
    "mas_sueno_cansancio",
    "entrevistaPuntuacion",
    // Examen físico
    "hta_nueva",
    "cuello_varon_normal",
    "cuello_mujer_normal",
    "mallampati_grado",
    // Conclusión
    "requiere_psg",
    ...CRITERIOS_PSG,
    "apto_3_meses",
    "criterio_c",
    "criterio_d",
    ...CRITERIOS_D,
    "criterio_e",
    "apto_bajo_riesgo",
    // Observaciones / médico
    "observaciones",
    "conclusionesCie10",
    "user_medicoFirma",
    "nombre_medico",
];

// Opciones Sí/No (valores booleanos) de la tabla de la sección 6.
const OPCIONES_SI_NO = [
    { label: "SÍ", value: true },
    { label: "NO", value: false },
];

/**
 * Etiqueta de un criterio dentro de `RadioTable`. Las filas "padre" quedan en negrita (estilo por
 * defecto de la tabla) y los criterios hijos se muestran sangrados y en peso normal, con su
 * título ("Criterio A:") resaltado. `nivel` 1 = criterio, 2 = sub-criterio.
 */
function EtiquetaCriterio({ nivel = 1, titulo, children }) {
    const sangria = nivel === 1 ? "pl-[16px]" : "pl-[40px]";
    return (
        <span className={`block font-normal ${sangria}`}>
            {titulo && <span className="font-semibold">{titulo} </span>}
            {children}
        </span>
    );
}

/**
 * Fila "texto + Sí/No" reutilizada en las secciones de preguntas. En mobile apila el texto
 * sobre los radios; desde `sm` los deja en una sola línea.
 */
function FilaSiNo({
    children,
    name,
    form,
    onChange,
    disabled,
    isFieldEdited,
    revertField,
    last = false,
}) {
    return (
        <div
            className={`flex flex-col gap-2 py-[8px] sm:flex-row sm:items-center sm:justify-between sm:gap-4 ${last ? "" : "border-b border-gray-200"
                }`}
        >
            <div className="flex-1 min-w-0">{children}</div>
            <InputsBooleanRadioGroup
                className="shrink-0"
                name={name}
                value={form[name]}
                onChange={onChange}
                disabled={disabled}
                edited={isFieldEdited(name)}
                onRevert={() => revertField(name)}
            />
        </div>
    );
}

const FichaSas = () => {
    const { token, userlogued, selectedSede, datosFooter, userName, userDNI } = useSessionData();

    const initialFormState = {
        // Header
        norden: "",
        codigoSas: null,
        fechaExam: today,
        tipoExamen: "",
        tipoLicencia: "",
        conclusionesCie10: "",
        // Datos personales
        dni: "",
        nombres: "",
        fechaNacimiento: "",
        lugarNacimiento: "",
        edad: "",
        sexo: "",
        estadoCivil: "",
        nivelEstudios: "",
        // Datos laborales
        empresa: "",
        contrata: "",
        ocupacion: "",
        cargoDesempenar: "",
        // Trabaja de noche
        trabajoNoche: false,
        diasTrabajoNoche: "",
        diasDescansoNoche: "",
        anosTrabajoNoche: "",
        // Antecedentes personales
        apneaDelSueno: false,
        ultimoControl: "",
        hta: false,
        medicacionRiesgo: "",
        polisomnografiaRealizada: false,
        fechaUltimaPolisomnografia: "",
        accidenteEnLaMina: false,
        accidenteFueraDeLaMina: false,

        // Antecedentes de choques
        criterio1_cabeceo: false, //1
        accidente_nocturno: false, //2
        ausencia_evidencia_maniobra: false, //3
        choque_vehiculo_contra_otro: false, //4
        vehiculo_invadio_carril: false, //5
        conductor_no_recuerda: false, //6
        tratamiento_medicinas_somnolencia: false, //7
        conductor_encontraba_horas_extra: false, //8
        accidente_confirmado_somnolencia: false, //9
        accidente_alta_sospecha_somnolencia: false, //10
        accidente_escasa_evidencia_somnolencia: false, //11
        no_datos_suficientes: false, //12
        accidente_no_debido_somnolencia: false, //13

        // Antecedentes familiares de apnea del sueño
        antec_familiar_apnea: false,
        indique_familiar_apnea: "",

        // Entrevista al paciente
        ronca_al_dormir: false,
        ruidos_respirar_durmiendo: false,
        deja_respirar_durmiendo: false,
        mas_sueno_cansancio: false,
        entrevistaPuntuacion: "0",

        // Examen Físico
        peso_kg: "",
        talla_mts: "",
        imc_kg_m2: "",
        circunferencia_cuello: "",
        cuello_varon_normal: true, // true para SI, false para NO
        cuello_mujer_normal: true, // true para SI, false para NO
        presion_sistolica: "",
        presion_diastolica: "",
        hta_nueva: false, // true para SI, false para NO

        // Evaluación de vía aérea superior MALLAMPATI
        mallampati_grado: "1", // "1", "2", "3", "4"

        // Conclusión de la Evaluación
        // Requiere PSG antes de certificar aptitud para conducir
        requiere_psg: false,
        criterio_a: false,
        criterio_b: false,

        // Apto por 3 meses a renovar luego de PSG
        apto_3_meses: false,
        criterio_c: false,
        criterio_d: false,
        criterio_d_imc: false,
        criterio_d_hta: false,
        criterio_d_cuello: false,
        criterio_d_epworth: false,
        criterio_d_trastorno: false,
        criterio_d_ahi: false,
        criterio_e: false,

        // Apto con bajo riesgo de Apnea del sueño
        apto_bajo_riesgo: false,

        observaciones: "",

        dniUsuario: userDNI,

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
        handleRadioButton,
        handleRadioButtonBoolean,
        handleClear,
        handleChangeSimple,
        handleClearnotO,
        handlePrintDefault,
        handleChangeNumberDecimals,
    } = useForm(initialFormState, { storageKey: "ficha_sas_form" });

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

    // Observaciones y la lista CIE10 se mantienen sincronizadas entre sí: se tratan como una unidad.
    const isObservacionesEdited = isFieldEdited("observaciones") || isFieldEdited("conclusionesCie10");
    const revertObservaciones = () => revertFields(["observaciones", "conclusionesCie10"]);

    const [errors, setErrors] = useState({});

    // El error de Tipo de Licencia se muestra solo tras intentar guardar y mientras el campo
    // siga vacío; se limpia solo a medida que el usuario escribe.
    const tipoLicenciaError =
        errors.tipoLicencia && !form.tipoLicencia?.trim() ? errors.tipoLicencia : "";

    const validateForm = () => {
        const next = {};
        if (!form.tipoLicencia?.trim()) {
            next.tipoLicencia = "El tipo de licencia es obligatorio.";
            // El campo está arriba del formulario: se avisa también con alerta para que no pase desapercibido.
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Por favor, ingrese el tipo de licencia",
            });
        }
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSave = () => {
        if (!validateForm()) return;
        SubmitDataService(form, token, userlogued, handleClear, tabla, datosFooter);
    };

    const handleEdit = () => {
        if (!validateForm()) return;
        UpdateDataService(form, token, userlogued, handleClear, tabla, datosFooter);
    };

    const handleClearForm = () => {
        setErrors({});
        handleClear();
    };

    // ===== Búsqueda con boton =====
    const executeSearch = () => {
        setErrors({});
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
            setErrors({});
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

    // ===== Reglas de dependencia entre campos (Sí/No que limpian a sus dependientes) =====
    const handleTrabajoNoche = (e, value) => {
        if (!value) {
            setForm((prev) => ({ ...prev, diasTrabajoNoche: "", diasDescansoNoche: "", anosTrabajoNoche: "" }));
        }
        handleRadioButtonBoolean(e, value);
    };

    const handleApnea = (e, value) => {
        if (!value) setForm((prev) => ({ ...prev, ultimoControl: "" }));
        handleRadioButtonBoolean(e, value);
    };

    const handleHta = (e, value) => {
        if (!value) setForm((prev) => ({ ...prev, medicacionRiesgo: "" }));
        handleRadioButtonBoolean(e, value);
    };

    const handlePolisomnografia = (e, value) => {
        setForm((prev) => ({ ...prev, fechaUltimaPolisomnografia: !value ? "" : today }));
        handleRadioButtonBoolean(e, value);
    };

    // Si pasa a NO, bloquea los criterios dependientes y los pone en false.
    const limpiarDependientes = (campos) => (e, value) => {
        if (value === false) {
            setForm((prev) => ({
                ...prev,
                ...Object.fromEntries(campos.map((c) => [c, false])),
            }));
        }
        handleRadioButtonBoolean(e, value);
    };

    const handleRequierePsg = limpiarDependientes(CRITERIOS_PSG);
    const handleApto3Meses = limpiarDependientes(CRITERIOS_APTO_3_MESES);
    const handleCriterioD = limpiarDependientes(CRITERIOS_D);

    // La tabla de la sección 6 tiene un único handler: según la fila (`name` del radio) se aplica
    // la regla de dependencia que corresponda.
    const handleConclusion = (e, value) => {
        const porFila = {
            requiere_psg: handleRequierePsg,
            apto_3_meses: handleApto3Meses,
            criterio_d: handleCriterioD,
        };
        (porFila[e.target.name] ?? handleRadioButtonBoolean)(e, value);
    };

    // Observaciones: las líneas "CIE 10: ..." alimentan la lista de conclusiones CIE10.
    const handleObservacionesChange = (upper) => {
        const cie10Lines = upper
            .split("\n")
            .filter((l) => /^CIE 10:/i.test(l.trim()));
        const nuevoCie10 = cie10Lines.join("\n");
        setForm((d) => ({
            ...d,
            observaciones: upper,
            ...(nuevoCie10 !== d.conclusionesCie10 && { conclusionesCie10: nuevoCie10 }),
        }));
    };

    const hayRegistroCargado = Boolean(form.nombres || form.dni);
    const nordenDisabled = hayRegistroCargado;

    const auditoria = buildAuditoria(form, {
        usuarioActual: userlogued,
        fechaHoraActual: getFechaHoraActual(),
    });

    // Props comunes de las filas Sí/No.
    const fila = {
        form,
        onChange: handleRadioButtonBoolean,
        disabled: camposDeshabilitados,
        isFieldEdited,
        revertField,
    };

    const sinCuelloVaron = form.sexo === "FEMENINO";
    const sinCuelloMujer = form.sexo === "MASCULINO";

    // Filas de la sección 6. Cada criterio se bloquea (`disabled`) mientras su "padre" esté en NO.
    const sinRequierePsg = !form.requiere_psg;
    const sinApto3Meses = !form.apto_3_meses;
    const sinCriterioD = !form.criterio_d;
    const itemsConclusion = [
        {
            name: "requiere_psg",
            label: "Requiere PSG antes de certificar aptitud para conducir. (un criterio positivo)",
        },
        {
            name: "criterio_a",
            disabled: sinRequierePsg,
            label: (
                <EtiquetaCriterio titulo="Criterio A:">
                    Excesiva somnolencia determinada por ESS mayor de 15 cabeceo presenciado durante la evaluación (espera, antecedente de accidente por somnolencia o con alta sospecha por somnolencia)
                </EtiquetaCriterio>
            ),
        },
        {
            name: "criterio_b",
            disabled: sinRequierePsg,
            label: (
                <EtiquetaCriterio titulo="Criterio B:">
                    Antecedentes de SAS sin control reciente o sin cumplimiento de tratamiento (con CPAP o cirugía)
                </EtiquetaCriterio>
            ),
        },
        {
            name: "apto_3_meses",
            label: "Apto por 3 meses a renovar luego de PSG (un criterio positivo)",
        },
        {
            name: "criterio_c",
            disabled: sinApto3Meses,
            label: (
                <EtiquetaCriterio titulo="Criterio C:">
                    Historia de higiene de sueño sugiere SAS (presencia de ronquidos, somnolencia excesiva durante la actividad, pausas respiratorias)
                </EtiquetaCriterio>
            ),
        },
        {
            name: "criterio_d",
            disabled: sinApto3Meses,
            label: (
                <EtiquetaCriterio titulo="Criterio D:">
                    Cumple con 2 o más de los siguientes:
                </EtiquetaCriterio>
            ),
        },
        // IMC no depende de "Criterio D": se autocompleta desde Triaje y siempre fue editable.
        {
            name: "criterio_d_imc",
            label: <EtiquetaCriterio nivel={2}>IMC mayor o igual a 30</EtiquetaCriterio>,
        },
        {
            name: "criterio_d_hta",
            disabled: sinCriterioD,
            label: (
                <EtiquetaCriterio nivel={2}>
                    Hipertensión Arterial (nueva, no controlada con una sola medicación)
                </EtiquetaCriterio>
            ),
        },
        {
            name: "criterio_d_cuello",
            disabled: sinCriterioD,
            label: <EtiquetaCriterio nivel={2}>Circunferencia del cuello anormal</EtiquetaCriterio>,
        },
        {
            name: "criterio_d_epworth",
            disabled: sinCriterioD,
            label: (
                <EtiquetaCriterio nivel={2}>Puntuación de Epworth mayor de 10 y menor de 16</EtiquetaCriterio>
            ),
        },
        {
            name: "criterio_d_trastorno",
            disabled: sinCriterioD,
            label: (
                <EtiquetaCriterio nivel={2}>
                    Antecedentes de trastorno del sueño (diagnosticado) sin seguimiento
                </EtiquetaCriterio>
            ),
        },
        {
            name: "criterio_d_ahi",
            disabled: sinCriterioD,
            label: (
                <EtiquetaCriterio nivel={2}>
                    Índice de apnea-hipopnea (AHI) mayor de 5 y menor de 30
                </EtiquetaCriterio>
            ),
        },
        {
            name: "criterio_e",
            disabled: sinApto3Meses,
            label: (
                <EtiquetaCriterio titulo="Criterio E:">
                    Evaluación de vía aérea superior patológica*
                </EtiquetaCriterio>
            ),
        },
        {
            name: "apto_bajo_riesgo",
            label: "Apto con bajo riesgo de Apnea del sueño (ningún criterio positivo)",
        },
    ];

    return (
        <div className="space-y-3 px-4 max-w-[95%] xl:max-w-[90%] mx-auto">
            <AccionesRegistroHeader
                tieneRegistro={form.tieneRegistro}
                hayRegistroCargado={hayRegistroCargado}
                edicionHabilitada={edicionHabilitada}
                onHabilitarEdicion={habilitarEdicion}
                onLimpiar={handleClearForm}
            />

            {/* ===== SECCIÓN: INFORMACIÓN DEL EXAMEN ===== */}
            <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-3">
                <div className="flex gap-x-3 w-full">
                    <InputTextOneLine
                        label="N° Orden"
                        name="norden"
                        value={form.norden}
                        onKeyUp={handleSearch}
                        onChange={handleChangeNumber}
                        disabled={nordenDisabled}
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
                    labelWidth="120px"
                    edited={isFieldEdited("fechaExam")}
                    onRevert={() => revertField("fechaExam")}
                />
                <InputTextOneLine
                    label="Tipo de Examen"
                    name="tipoExamen"
                    value={form.tipoExamen}
                    disabled
                    labelWidth="120px"
                />
                <InputTextOneLine
                    label="Tipo Licencia"
                    name="tipoLicencia"
                    value={form.tipoLicencia}
                    onChange={handleChangeSimple}
                    disabled={camposDeshabilitados}
                    labelWidth="120px"
                    required
                    error={tipoLicenciaError}
                    edited={isFieldEdited("tipoLicencia")}
                    onRevert={() => revertField("tipoLicencia")}
                />
            </SectionFieldset>

            {/* ===== SECCIÓN: DATOS PERSONALES Y LABORALES ===== */}
            <DatosPersonalesLaborales form={form} />

            {/* ===== SECCIÓN: TRABAJO DE NOCHE Y ANTECEDENTES PERSONALES ===== */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 items-start">
                <SectionFieldset legend="Trabajo de Noche" className="space-y-3">
                    <InputsBooleanRadioGroup
                        label="Trabaja de noche"
                        labelWidth="150px"
                        stackOnMobile
                        name="trabajoNoche"
                        value={form.trabajoNoche}
                        onChange={handleTrabajoNoche}
                        disabled={camposDeshabilitados}
                        edited={isFieldEdited("trabajoNoche")}
                        onRevert={() => revertField("trabajoNoche")}
                    />
                    <InputTextOneLine
                        label="N° días trabajo"
                        name="diasTrabajoNoche"
                        value={form.diasTrabajoNoche}
                        onChange={handleChangeNumber}
                        disabled={camposDeshabilitados || !form.trabajoNoche}
                        labelWidth="150px"
                        edited={isFieldEdited("diasTrabajoNoche")}
                        onRevert={() => revertField("diasTrabajoNoche")}
                    />
                    <InputTextOneLine
                        label="N° días descanso"
                        name="diasDescansoNoche"
                        value={form.diasDescansoNoche}
                        onChange={handleChangeNumber}
                        disabled={camposDeshabilitados || !form.trabajoNoche}
                        labelWidth="150px"
                        edited={isFieldEdited("diasDescansoNoche")}
                        onRevert={() => revertField("diasDescansoNoche")}
                    />
                    <InputTextOneLine
                        label="Años de trabajo en dicho horario de trabajo"
                        name="anosTrabajoNoche"
                        value={form.anosTrabajoNoche}
                        onChange={handleChangeNumber}
                        disabled={camposDeshabilitados || !form.trabajoNoche}
                        labelWidth="150px"
                        edited={isFieldEdited("anosTrabajoNoche")}
                        onRevert={() => revertField("anosTrabajoNoche")}
                    />
                </SectionFieldset>

                <SectionFieldset legend="Antecedentes Personales" className="space-y-3">
                    {/* Ápnea del sueño */}
                    <div className="space-y-2">
                        <InputsBooleanRadioGroup
                            label="Ápnea del sueño"
                            labelWidth="150px"
                            stackOnMobile
                            name="apneaDelSueno"
                            value={form.apneaDelSueno}
                            onChange={handleApnea}
                            disabled={camposDeshabilitados}
                            edited={isFieldEdited("apneaDelSueno")}
                            onRevert={() => revertField("apneaDelSueno")}
                        />
                        <InputTextOneLine
                            label="Último control"
                            name="ultimoControl"
                            value={form.ultimoControl}
                            onChange={handleChange}
                            disabled={camposDeshabilitados || !form.apneaDelSueno}
                            labelWidth="150px"
                            edited={isFieldEdited("ultimoControl")}
                            onRevert={() => revertField("ultimoControl")}
                        />
                    </div>

                    {/* HTA */}
                    <div className="space-y-2">
                        <InputsBooleanRadioGroup
                            label="HTA"
                            labelWidth="150px"
                            stackOnMobile
                            name="hta"
                            value={form.hta}
                            onChange={handleHta}
                            disabled={camposDeshabilitados}
                            edited={isFieldEdited("hta")}
                            onRevert={() => revertField("hta")}
                        />
                        <InputTextOneLine
                            label="Medicación (riesgo >2)"
                            name="medicacionRiesgo"
                            value={form.medicacionRiesgo}
                            onChange={handleChange}
                            disabled={camposDeshabilitados || !form.hta}
                            labelWidth="150px"
                            edited={isFieldEdited("medicacionRiesgo")}
                            onRevert={() => revertField("medicacionRiesgo")}
                        />
                    </div>

                    {/* Polisomnografía */}
                    <div className="space-y-2">
                        <InputsBooleanRadioGroup
                            label="Polisomnografía realizada"
                            labelWidth="150px"
                            stackOnMobile
                            name="polisomnografiaRealizada"
                            value={form.polisomnografiaRealizada}
                            onChange={handlePolisomnografia}
                            disabled={camposDeshabilitados}
                            edited={isFieldEdited("polisomnografiaRealizada")}
                            onRevert={() => revertField("polisomnografiaRealizada")}
                        />
                        <InputTextOneLine
                            label="Fecha última polisomnografía"
                            name="fechaUltimaPolisomnografia"
                            type="date"
                            value={form.fechaUltimaPolisomnografia}
                            onChange={handleChangeSimple}
                            disabled={camposDeshabilitados || !form.polisomnografiaRealizada}
                            labelWidth="150px"
                            edited={isFieldEdited("fechaUltimaPolisomnografia")}
                            onRevert={() => revertField("fechaUltimaPolisomnografia")}
                        />
                    </div>

                    {/* Antecedentes de choque de vehículo */}
                    <div className="space-y-2 pt-1">
                        <span className="block font-bold">Antecedentes de choque de vehículo</span>
                        <InputsBooleanRadioGroup
                            label="Accidente en la mina"
                            labelWidth="150px"
                            stackOnMobile
                            name="accidenteEnLaMina"
                            value={form.accidenteEnLaMina}
                            onChange={handleRadioButtonBoolean}
                            disabled={camposDeshabilitados}
                            edited={isFieldEdited("accidenteEnLaMina")}
                            onRevert={() => revertField("accidenteEnLaMina")}
                        />
                        <InputsBooleanRadioGroup
                            label="Accidente fuera de la mina"
                            labelWidth="150px"
                            stackOnMobile
                            name="accidenteFueraDeLaMina"
                            value={form.accidenteFueraDeLaMina}
                            onChange={handleRadioButtonBoolean}
                            disabled={camposDeshabilitados}
                            edited={isFieldEdited("accidenteFueraDeLaMina")}
                            onRevert={() => revertField("accidenteFueraDeLaMina")}
                        />
                    </div>
                </SectionFieldset>
            </div>

            {/* ===== SECCIÓN: ANTECEDENTES DEL (LOS) CHOQUES ===== */}
            <SectionFieldset legend="Antecedentes del (los) choques (incidentes o accidente)">
                <FilaSiNo {...fila} name="criterio1_cabeceo">
                    <span className="font-semibold">Criterio 1: </span>
                    Se &quot;cabeceó&quot; y por ello ocurrió un accidente (incidente) con un vehículo (alguna vez)
                </FilaSiNo>

                <div className="py-[8px] border-b border-gray-200">
                    <span className="font-semibold">Criterio 2: </span>
                    2 o más es positivo
                </div>

                <FilaSiNo {...fila} name="accidente_nocturno">
                    Accidente ocurrido entre las últimas 5 horas de un turno nocturno o entre las 14 y 17 horas (tarde)
                </FilaSiNo>
                <FilaSiNo {...fila} name="ausencia_evidencia_maniobra">
                    AUSENCIA DE evidencia de maniobra evasiva del chofer para evitar la colisión
                </FilaSiNo>
                <FilaSiNo {...fila} name="choque_vehiculo_contra_otro">
                    Choque del vehículo contra otro, cayó a un precipicio, no al choque contra un
                </FilaSiNo>
                <FilaSiNo {...fila} name="vehiculo_invadio_carril">
                    Vehículo que invadió el otro carril o se desvió sin causa aparente
                </FilaSiNo>
                <FilaSiNo {...fila} name="conductor_no_recuerda">
                    El conductor no recuerda claramente lo ocurrido 10 segundos antes del impacto
                </FilaSiNo>
                <FilaSiNo {...fila} name="tratamiento_medicinas_somnolencia">
                    Tratamiento con medicinas que causan somnolencia (benzodiazepinas, antihistamínicos, relajantes
                </FilaSiNo>
                <FilaSiNo {...fila} name="conductor_encontraba_horas_extra" last>
                    El conductor se encontraba en horas extra (excediendo sus horas habituales de trabajo) o realizando días adicionales de trabajo (sobretiempo)
                </FilaSiNo>

                <h4 className="font-semibold mt-4 mb-1 pt-3 border-t border-gray-300">
                    Clasificación del (los) &quot;choques&quot; o accidentes vehiculares del postulante (marque solo una categoría)
                </h4>
                <FilaSiNo {...fila} name="accidente_confirmado_somnolencia">
                    Accidente confirmado por Somnolencia (Criterio 1 positivo)
                </FilaSiNo>
                <FilaSiNo {...fila} name="accidente_alta_sospecha_somnolencia">
                    Accidente con alta sospecha de somnolencia (Criterio 2 positivo)
                </FilaSiNo>
                <FilaSiNo {...fila} name="accidente_escasa_evidencia_somnolencia">
                    Accidente con escasa evidencia / sospecha por somnolencia (solo 1 ítem de Criterio 2)
                </FilaSiNo>
                <FilaSiNo {...fila} name="no_datos_suficientes">
                    No se dispone de datos suficientes para clasificar el (los) incidentes
                </FilaSiNo>
                <FilaSiNo {...fila} name="accidente_no_debido_somnolencia" last>
                    Accidente no debido a somnolencia (información suficiente que descarta somnolencia)
                </FilaSiNo>
            </SectionFieldset>

            {/* ===== SECCIÓN: ANTECEDENTE FAMILIAR DE APNEA DEL SUEÑO ===== */}
            <SectionFieldset legend="3. Antec. familiar de apnea del sueño" className="space-y-3">
                <InputsBooleanRadioGroup
                    label="Antec. familiar"
                    labelWidth="150px"
                    stackOnMobile
                    name="antec_familiar_apnea"
                    value={form.antec_familiar_apnea}
                    onChange={handleRadioButtonBoolean}
                    disabled
                />
                <InputTextOneLine
                    label="Indique"
                    name="indique_familiar_apnea"
                    value={form.indique_familiar_apnea}
                    onChange={handleChange}
                    disabled={camposDeshabilitados}
                    labelWidth="150px"
                    edited={isFieldEdited("indique_familiar_apnea")}
                    onRevert={() => revertField("indique_familiar_apnea")}
                />
            </SectionFieldset>

            {/* ===== SECCIÓN: ENTREVISTA AL PACIENTE ===== */}
            <SectionFieldset legend="4. Entrevista al paciente">
                <FilaSiNo {...fila} name="ronca_al_dormir">
                    En los últimos 5 años, su pareja o esposa le ha comentado que ronca al dormir
                </FilaSiNo>
                <FilaSiNo {...fila} name="ruidos_respirar_durmiendo">
                    En los últimos 5 años, su pareja o esposa le ah comentado que hace ruidos al respirar mientras duerme
                </FilaSiNo>
                <FilaSiNo {...fila} name="deja_respirar_durmiendo">
                    En los últimos 5 años, su pareja o esposa le ah comentado que deja de respirar cuando duerme (pausa respiratoria)
                </FilaSiNo>
                <FilaSiNo {...fila} name="mas_sueno_cansancio" last>
                    Comparado con sus compañeros, usted siente que tiene más sueño o cansancio que ellos mientras trabaja
                </FilaSiNo>

                {/* Puntuación de la escala de Epworth */}
                <div className="mt-3 bg-gray-50 rounded px-3 py-[8px] flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                    <div>
                        <span className="font-semibold">PUNTUACIÓN DE LA ESCALA DE EPWORTH (ESS)</span>
                        <br />
                        <span>(NUNCA = 0, POCA = 1, MODERADA = 2, ALTA = 3)</span>
                    </div>
                    <InputTextOneLine
                        label="Total puntos (sumatoria)"
                        name="entrevistaPuntuacion"
                        value={form.entrevistaPuntuacion}
                        onChange={handleChangeNumber}
                        disabled={camposDeshabilitados}
                        labelWidth="140px"
                        className="sm:w-[240px] shrink-0"
                        edited={isFieldEdited("entrevistaPuntuacion")}
                        onRevert={() => revertField("entrevistaPuntuacion")}
                    />
                </div>
            </SectionFieldset>

            {/* ===== SECCIÓN: EXAMEN FÍSICO Y MALLAMPATI ===== */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 items-start">
                <SectionFieldset legend="Examen Físico" className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                        <InputTextOneLine
                            label="Peso (Kg)"
                            name="peso_kg"
                            value={form.peso_kg}
                            disabled
                            labelWidth="100px"
                        />
                        <InputTextOneLine
                            label="Talla (mts)"
                            name="talla_mts"
                            value={form.talla_mts}
                            disabled
                            labelWidth="100px"
                        />
                        <div>
                            <InputTextOneLine
                                label="IMC (Kg/m2)"
                                name="imc_kg_m2"
                                value={form.imc_kg_m2}
                                disabled
                                labelWidth="100px"
                            />
                            <span className="block text-red-600 mt-1">(&gt; 35 es de alto riesgo)</span>
                        </div>
                        <InputTextOneLine
                            label="P. Sistólica"
                            name="presion_sistolica"
                            value={form.presion_sistolica}
                            disabled
                            labelWidth="100px"
                        />
                        <InputTextOneLine
                            label="P. Diastólica"
                            name="presion_diastolica"
                            value={form.presion_diastolica}
                            disabled
                            labelWidth="100px"
                        />
                        <InputsBooleanRadioGroup
                            label="HTA nueva"
                            labelWidth="100px"
                            stackOnMobile
                            name="hta_nueva"
                            value={form.hta_nueva}
                            onChange={handleRadioButtonBoolean}
                            disabled={camposDeshabilitados}
                            edited={isFieldEdited("hta_nueva")}
                            onRevert={() => revertField("hta_nueva")}
                        />
                    </div>

                    {/* Circunferencia de cuello */}
                    <div className="border rounded p-[12px] space-y-3">
                        <InputTextOneLine
                            label="Circunferencia de cuello"
                            name="circunferencia_cuello"
                            value={form.circunferencia_cuello}
                            disabled
                            labelWidth="100px"
                        />
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <span>Varón (menor de 43.2 cm, es normal)</span>
                            <InputsBooleanRadioGroup
                                label="Normal"
                                labelWidth="60px"
                                className="shrink-0"
                                name="cuello_varon_normal"
                                value={form.cuello_varon_normal}
                                onChange={handleRadioButtonBoolean}
                                disabled={camposDeshabilitados || sinCuelloVaron}
                                edited={isFieldEdited("cuello_varon_normal")}
                                onRevert={() => revertField("cuello_varon_normal")}
                            />
                        </div>
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <span>Mujer (menor de 40.6 cm, es normal)</span>
                            <InputsBooleanRadioGroup
                                label="Normal"
                                labelWidth="60px"
                                className="shrink-0"
                                name="cuello_mujer_normal"
                                value={form.cuello_mujer_normal}
                                onChange={handleRadioButtonBoolean}
                                disabled={camposDeshabilitados || sinCuelloMujer}
                                edited={isFieldEdited("cuello_mujer_normal")}
                                onRevert={() => revertField("cuello_mujer_normal")}
                            />
                        </div>
                    </div>
                </SectionFieldset>

                {/* Evaluación de vía aérea superior MALLAMPATI */}
                <SectionFieldset legend="Evaluación de vía aérea superior MALLAMPATI (Seleccione)">
                    <div className="flex flex-col items-center gap-3">
                        <img
                            src={Mallampati}
                            alt="Evaluación Mallampati - Grados I, II, III, IV"
                            className="w-full max-w-[550px]"
                        />
                        {/* Radio buttons alineados debajo de cada grado */}
                        <div className="grid grid-cols-4 w-full max-w-[550px]">
                            {[
                                { valor: "1", etiqueta: "Grado I" },
                                { valor: "2", etiqueta: "Grado II" },
                                { valor: "3", etiqueta: "Grado III" },
                                { valor: "4", etiqueta: "Grado IV" },
                            ].map(({ valor, etiqueta }) => (
                                <div key={valor} className="flex justify-center">
                                    <label className={`flex items-center gap-1 ${camposDeshabilitados ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}>
                                        <input
                                            type="radio"
                                            name="mallampati_grado"
                                            value={valor}
                                            checked={form.mallampati_grado === valor}
                                            onChange={(e) => handleRadioButton(e, valor)}
                                            disabled={camposDeshabilitados}
                                            className="w-5 h-5 accent-primario"
                                        />
                                        <span className="font-medium">{etiqueta}</span>
                                    </label>
                                </div>
                            ))}
                        </div>
                        {isFieldEdited("mallampati_grado") && (
                            <RevertButton onClick={() => revertField("mallampati_grado")} />
                        )}
                    </div>
                </SectionFieldset>
            </div>

            {/* ===== SECCIÓN: CONCLUSIÓN DE LA EVALUACIÓN ===== */}
            <SectionFieldset legend="6. Conclusión de la evaluación">
                <RadioTable
                    items={itemsConclusion}
                    options={OPCIONES_SI_NO}
                    form={form}
                    handleRadioButton={handleConclusion}
                    labelColumns={9}
                    stackOnMobile
                    disabled={camposDeshabilitados}
                    isFieldEdited={isFieldEdited}
                    onRevert={revertField}
                />
            </SectionFieldset>

            {/* ===== SECCIÓN: OBSERVACIONES Y FIRMA DEL MÉDICO ===== */}
            <SectionFieldset legend="Observaciones y Firma del Médico" className="space-y-3">
                <EmpleadoComboBox
                    value={form.nombre_medico}
                    form={form}
                    onChange={handleChangeSimple}
                    disabled={camposDeshabilitados}
                    edited={isMedicoEdited}
                    onRevert={revertMedico}
                />
                <InputTextAreaUpper
                    label="Observaciones"
                    rows={6}
                    name="observaciones"
                    value={form.observaciones}
                    onChange={handleObservacionesChange}
                    disabled={camposDeshabilitados}
                    edited={isObservacionesEdited}
                    onRevert={revertObservaciones}
                />
                <div className="bg-green-200 p-[12px] rounded-xl">
                    <CIE10List
                        value={form.conclusionesCie10}
                        fieldName="conclusionesCie10"
                        label="Conclusiones CIE10"
                        token={token}
                        setForm={setForm}
                        setAdditionalForm={setForm}
                        additionalFieldName="observaciones"
                        additionalDelimiter={"\n"}
                        disabled={camposDeshabilitados}
                    />
                </div>
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
                handleClear={handleClearForm}
                handlePrint={handlePrint}
                hideSave={form.tieneRegistro && !edicionHabilitada}
                hideEdit={!form.tieneRegistro || edicionHabilitada}
            />
        </div>
    );
};

export default FichaSas;
