import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUser,
    faHeartbeat,
    faPrint,
    faBroom,
    faSave,
} from "@fortawesome/free-solid-svg-icons";
import {
    InputTextOneLine,
    InputTextArea,
    InputCheckbox,
    InputsBooleanRadioGroup,
} from "../../../../../../components/reusableComponents/ResusableComponents";
import { useForm } from "../../../../../../hooks/useForm";
import { useSessionData } from "../../../../../../hooks/useSessionData";
import { getToday } from "../../../../../../utils/helpers";
import { PrintHojaR, SubmitDataService, VerifyTR } from "./controllerInformePsicologico";
import SectionFieldset from "../../../../../../components/reusableComponents/SectionFieldset";

const tabla = "informe_psicologico";
const today = getToday();

export default function InformePsicologico() {
    const { token, userlogued, selectedSede, datosFooter } = useSessionData();

    const initialFormState = {
        norden: "",
        codigoInforme: null,
        fechaEntrevista: today,
        nombreExamen: "",
        nombres: "",
        apellidos: "",
        fechaNacimiento: "",
        lugarNacimiento: "",
        domicilioActual: "",
        edad: "",
        sexo: "",
        estadoCivil: "",
        nivelEstudios: "",

        // Datos Laborales
        empresa: "",
        contrata: "",
        ocupacion: "",
        cargoDesempenar: "",

        // Área Intelectual
        areaIntelectual: "EL EVALUADO POSEE UN NIVEL INTELECTUAL PROMEDIO.",
        promedio: false,
        superior: false,
        nInferior: false,
        alto: false,

        pSuperior: false,
        pMedio: false,
        pBajo: false,
        bajo: false,

        facilidad: false,
        dificultad: false,

        pnAdecuado: false,
        nAlto: false,
        nBajo: false,

        yNumerica: false,
        yCalculo: false,

        adecuadaR: false,
        inadecuada: false,

        // Área de Personalidad
        areaPersonalidad: "",

        // Área de Psicomotricidad
        areaPsicomotricidad: "",
        nivelAltoPs: false,
        nivelAdecuadoPs: false,
        nivelBajoPs: false,

        facilidadPs: false,
        dificultadPs: false,

        // Área de Organicidad
        areaOrganicidad: "",
        orientadoEnTiempo: false,

        poseeAltoManejo: false,
        pAdecuadoManejo: false,
        pBajoManejo: false,

        noSeEnvidencia: false,

        // Recomendaciones
        recomendaciones: "",

        // Aprobó Test
        aproboTest: undefined,
    };

    const {
        form,
        setForm,
        handleChange,
        handleChangeNumber,
        handleClear,
        handleRadioButtonBoolean,
        handleClearnotO,
        handlePrintDefault,
    } = useForm(initialFormState, { storageKey: "informePsicologicoPsicologia" });

    // Estado para el select de recomendaciones predefinidas
    const [selectedRecomendacion, setSelectedRecomendacion] = useState("");

    // Opciones predefinidas para recomendaciones
    const opcionesRecomendaciones = [
        "Se recomienda seguimiento psicológico periódico",
        "Mantener un ambiente laboral saludable y libre de estrés",
        "Implementar técnicas de manejo del estrés",
        "Fomentar la comunicación asertiva en el equipo de trabajo",
        "Realizar pausas activas durante la jornada laboral",
        "Promover el equilibrio entre vida laboral y personal",
        "Capacitación en habilidades de liderazgo",
        "Evaluación psicológica de seguimiento en 6 meses",
        "Apoyo psicológico especializado si es necesario",
        "Fortalecer la autoestima y confianza personal"
    ];

    // Función para agregar recomendación seleccionada al campo
    const agregarRecomendacion = () => {
        if (selectedRecomendacion) {
            const textoActual = form.recomendaciones;
            const nuevoTexto = textoActual
                ? `${textoActual}\n• ${selectedRecomendacion}`
                : `• ${selectedRecomendacion}`;

            setForm({
                ...form,
                recomendaciones: nuevoTexto
            });

            // Limpiar el select después de agregar
            setSelectedRecomendacion("");
        }
    };

    // Definición de grupos de checkboxes del área intelectual
    const intellectualGroups = {
        nivelIntelectual: ['promedio', 'superior', 'nInferior', 'alto'],
        facilidadDificultad: ['facilidad', 'dificultad'],
        capacidadNumerica: ['yNumerica', 'yCalculo'],
        nivelPsicomotor: ['pSuperior', 'pMedio', 'pBajo', 'bajo'],
        nivelAtencion: ['pnAdecuado', 'nAlto', 'nBajo'],
        retencionDigitos: ['adecuadaR', 'inadecuada']
    };

    // Textos específicos para cada checkbox
    const intellectualTexts = {
        promedio: "EL EVALUADO POSEE UN NIVEL INTELECTUAL PROMEDIO.",
        superior: "EL EVALUADO POSEE UN NIVEL INTELECTUAL SUPERIOR.",
        nInferior: "EL EVALUADO POSEE UN NIVEL INTELECTUAL NORMAL INFERIOR.",
        alto: "EL EVALUADO POSEE UN NIVEL INTELECTUAL ALTO.",
        facilidad: "PRESENTA FACILIDAD EN EL PROCESAMIENTO DE LA INFORMACIÓN.",
        dificultad: "PRESENTA DIFICULTAD EN EL PROCESAMIENTO DE LA INFORMACIÓN.",
        yNumerica: "Y EN CAPACIDAD NUMÉRICA.",
        yCalculo: "Y EN CAPACIDAD DE CÁLCULO.",
        pSuperior: "POSEE UN NIVEL PSICOMOTOR SUPERIOR.",
        pMedio: "POSEE UN NIVEL PSICOMOTOR MEDIO.",
        pBajo: "POSEE UN NIVEL PSICOMOTOR BAJO.",
        bajo: "POSEE UN NIVEL PSICOMOTOR BAJO.",
        pnAdecuado: "PRESENTA UN NIVEL DE ATENCIÓN ADECUADO.",
        nAlto: "PRESENTA UN NIVEL DE ATENCIÓN ALTO.",
        nBajo: "PRESENTA UN NIVEL DE ATENCIÓN BAJO.",
        adecuadaR: "PRESENTA ADECUADA RETENCIÓN DE DÍGITOS.",
        inadecuada: "PRESENTA INADECUADA RETENCIÓN DE DÍGITOS."
    };

    // Configuración de grupos y textos para todas las áreas
    const areaConfigurations = {
        intelectual: {
            groups: intellectualGroups,
            texts: intellectualTexts,
            fieldName: 'areaIntelectual'
        },
        organicidad: {
            groups: {
                manejoFacultades: ['poseeAltoManejo', 'pAdecuadoManejo', 'pBajoManejo'],
                orientacion: ['orientadoEnTiempo'],
                danoOrganico: ['noSeEnvidencia']
            },
            texts: {
                poseeAltoManejo: 'POSEE ALTO MANEJO DE FACULTADES MENTALES.',
                pAdecuadoManejo: 'POSEE ADECUADO MANEJO DE FACULTADES MENTALES.',
                pBajoManejo: 'POSEE BAJO MANEJO DE FACULTADES MENTALES.',
                orientadoEnTiempo: 'ORIENTADO EN TIEMPO, ESPACIO Y PERSONA.',
                noSeEnvidencia: 'NO SE EVIDENCIA DAÑO ORGÁNICO.'
            },
            fieldName: 'areaOrganicidad'
        },
        psicomotricidad: {
            groups: {
                nivel: ['nivelAltoPs', 'nivelAdecuadoPs', 'nivelBajoPs'],
                facilidad: ['facilidadPs', 'dificultadPs']
            },
            texts: {
                nivelAltoPs: 'POSEE UN NIVEL PSICOMOTOR ALTO.',
                nivelAdecuadoPs: 'POSEE UN NIVEL PSICOMOTOR ADECUADO.',
                nivelBajoPs: 'POSEE UN NIVEL PSICOMOTOR BAJO.',
                facilidadPs: 'PRESENTA FACILIDAD EN PSICOMOTRICIDAD.',
                dificultadPs: 'PRESENTA DIFICULTAD EN PSICOMOTRICIDAD.'
            },
            fieldName: 'areaPsicomotricidad'
        }
    };

    // Función unificada para manejar checkboxes de todas las áreas
    const handleAreaCheckboxChange = (areaType) => (e) => {
        const { name, checked } = e.target;
        const config = areaConfigurations[areaType];

        if (!config) return;

        // Encontrar el grupo al que pertenece el checkbox
        const groupName = Object.keys(config.groups).find(group =>
            config.groups[group].includes(name)
        );

        if (!groupName) return;

        const group = config.groups[groupName];
        const textToAdd = config.texts[name];

        setForm(prevForm => {
            const newForm = { ...prevForm };

            // Desmarcar todos los checkboxes del grupo
            group.forEach(checkboxName => {
                newForm[checkboxName] = false;
            });

            // Si se está marcando (no desmarcando), marcar el seleccionado
            if (checked) {
                newForm[name] = true;
            }

            // Actualizar el texto del área correspondiente
            let currentText = prevForm[config.fieldName] || "";

            // Remover textos previos del mismo grupo
            group.forEach(checkboxName => {
                const textToRemove = config.texts[checkboxName];
                if (textToRemove) {
                    // Remover el texto con salto de línea previo si existe
                    currentText = currentText.replace(`\n${textToRemove}`, "");
                    // Remover el texto si está al inicio
                    if (currentText.startsWith(textToRemove)) {
                        currentText = currentText.replace(textToRemove, "").replace(/^\n/, "");
                    }
                }
            });

            // Agregar el nuevo texto si se está marcando
            if (checked && textToAdd) {
                if (currentText.trim()) {
                    currentText = `${currentText}\n${textToAdd}`;
                } else {
                    currentText = textToAdd;
                }
            }

            newForm[config.fieldName] = currentText;

            return newForm;
        });
    };

    // Funciones específicas para cada área
    const handleIntellectualCheckboxChange = handleAreaCheckboxChange('intelectual');
    const handleOrganicidadCheckboxChange = handleAreaCheckboxChange('organicidad');
    const handlePsicomotricidadCheckboxChange = handleAreaCheckboxChange('psicomotricidad');


    // Funciones temporales sin funcionalidad del controller
    const handleSave = () => {
        SubmitDataService(form, token, userlogued, handleClear, tabla, datosFooter);
    };

    const handleSearch = (e) => {
        if (e.key === "Enter") {
            handleClearnotO();
            VerifyTR(form.norden, tabla, token, setForm, selectedSede);
        }
    };

    const handlePrint = () => {
        handlePrintDefault(() => {
            PrintHojaR(form.norden, token, tabla, datosFooter);
        });
    };
    return (
        <div className="w-full space-y-3 px-4">
            {/* ===== SECCIÓN: DATOS NECESARIOS ===== */}
            <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 lg:grid-cols-4 gap-3">
                <InputTextOneLine
                    label="N° Orden"
                    name="norden"
                    value={form.norden}
                    onKeyUp={handleSearch}
                    onChange={handleChangeNumber}
                    labelWidth="120px"
                />
                <InputTextOneLine
                    label="Fecha Entrevista"
                    name="fechaEntrevista"
                    type="date"
                    value={form.fechaEntrevista}
                    onChange={handleChange}
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
                    label="Aprobó Test"
                    name="aproboTest"
                    value={form.aproboTest}
                    onChange={handleRadioButtonBoolean}
                />
            </SectionFieldset>
            {/* Contenido principal */}
            <SectionFieldset legend="Datos Personales" className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                    <div className="grid md:grid-cols-2 gap-3">
                        <InputTextOneLine
                            label="Edad (Años)"
                            name="edad"
                            value={form.edad}
                            disabled
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="Sexo"
                            name="sexo"
                            value={form.sexo}
                            disabled
                            labelWidth="120px"
                        />
                    </div>
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
            </SectionFieldset>
            {/* ===== SECCIÓN: DATOS LABORALES ===== */}
            <SectionFieldset legend="Datos Laborales" className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
            </SectionFieldset>


            {/*==========================Área Intelectual Section==========================*/}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Columna Izquierda */}
                <div className="space-y-4">
                    {/* Área Intelectual */}
                    <SectionFieldset legend="Área Intelectual">
                        <div className="space-y-2">
                            <InputTextArea
                                rows={5}
                                label="Test de inteligencia de barranquilla / test de Otis Intermedia"
                                name="areaIntelectual"
                                value={form.areaIntelectual}
                                onChange={handleChange}
                            />
                            <div className="grid grid-cols-4 gap-2 ">
                                <SectionFieldset>
                                    <InputCheckbox
                                        label="PROMEDIO"
                                        name="promedio"
                                        checked={form.promedio}
                                        onChange={handleIntellectualCheckboxChange}
                                    />
                                    <InputCheckbox
                                        label="SUPERIOR"
                                        name="superior"
                                        checked={form.superior}
                                        onChange={handleIntellectualCheckboxChange}
                                    />
                                    <InputCheckbox
                                        label="N. INFERIOR"
                                        name="nInferior"
                                        checked={form.nInferior}
                                        onChange={handleIntellectualCheckboxChange}
                                    />
                                    <InputCheckbox
                                        label="ALTO"
                                        name="alto"
                                        checked={form.alto}
                                        onChange={handleIntellectualCheckboxChange}
                                    />
                                </SectionFieldset>
                                <SectionFieldset>
                                    <InputCheckbox
                                        label="FACILIDAD"
                                        name="facilidad"
                                        checked={form.facilidad}
                                        onChange={handleIntellectualCheckboxChange}
                                    />
                                    <InputCheckbox
                                        label="DIFICULTAD"
                                        name="dificultad"
                                        checked={form.dificultad}
                                        onChange={handleIntellectualCheckboxChange}
                                    />
                                </SectionFieldset>
                                <SectionFieldset fieldsetClassName="col-span-2">
                                    <InputCheckbox
                                        label="Y EN CAPACIDAD NUMÉRICA"
                                        name="yNumerica"
                                        checked={form.yNumerica}
                                        onChange={handleIntellectualCheckboxChange}
                                    />
                                    <InputCheckbox
                                        label="Y EN CAPACIDAD DE CÁLCULO"
                                        name="yCalculo"
                                        checked={form.yCalculo}
                                        onChange={handleIntellectualCheckboxChange}
                                    />
                                </SectionFieldset>
                                <SectionFieldset>
                                    <InputCheckbox
                                        label="P. SUPERIOR"
                                        name="pSuperior"
                                        checked={form.pSuperior}
                                        onChange={handleIntellectualCheckboxChange}
                                    />
                                    <InputCheckbox
                                        label="P. MEDIO"
                                        name="pMedio"
                                        checked={form.pMedio}
                                        onChange={handleIntellectualCheckboxChange}
                                    />
                                    <InputCheckbox
                                        label="P. BAJO"
                                        name="pBajo"
                                        checked={form.pBajo}
                                        onChange={handleIntellectualCheckboxChange}
                                    />
                                    <InputCheckbox
                                        label="BAJO"
                                        name="bajo"
                                        checked={form.bajo}
                                        onChange={handleIntellectualCheckboxChange}
                                    />
                                </SectionFieldset>
                                <SectionFieldset>
                                    <InputCheckbox
                                        label="P.N. ADECUADO"
                                        name="pnAdecuado"
                                        checked={form.pnAdecuado}
                                        onChange={handleIntellectualCheckboxChange}
                                    />
                                    <InputCheckbox
                                        label="N. ALTO"
                                        name="nAlto"
                                        checked={form.nAlto}
                                        onChange={handleIntellectualCheckboxChange}
                                    />
                                    <InputCheckbox
                                        label="N. BAJO"
                                        name="nBajo"
                                        checked={form.nBajo}
                                        onChange={handleIntellectualCheckboxChange}
                                    />
                                </SectionFieldset>
                                <SectionFieldset fieldsetClassName="col-span-2">
                                    <InputCheckbox
                                        label="ADECUADA RETENCIÓN DE DÍGITOS"
                                        name="adecuadaR"
                                        checked={form.adecuadaR}
                                        onChange={handleIntellectualCheckboxChange}
                                    />
                                    <InputCheckbox
                                        label="INADECUADA"
                                        name="inadecuada"
                                        checked={form.inadecuada}
                                        onChange={handleIntellectualCheckboxChange}
                                    />
                                </SectionFieldset>
                            </div>
                        </div>
                    </SectionFieldset>

                    {/* Área de Organicidad */}
                    <SectionFieldset legend="Área de Organicidad">
                        <div className="space-y-2">
                            <InputTextArea
                                rows={5}
                                label="Test de Bender para adultos / test de Benton Forma C"
                                name="areaOrganicidad"
                                value={form.areaOrganicidad}
                                onChange={handleChange}
                            />
                            <fieldset className="grid grid-cols-2 gap-2">
                                <SectionFieldset >
                                    <InputCheckbox
                                        label="ALTO MANEJO DE FACULTADES MENTALES"
                                        name="poseeAltoManejo"
                                        checked={form.poseeAltoManejo}
                                        onChange={handleOrganicidadCheckboxChange}
                                    />
                                    <InputCheckbox
                                        label="ADECUADO MANEJO DE FACULTADES MENTALES"
                                        name="pAdecuadoManejo"
                                        checked={form.pAdecuadoManejo}
                                        onChange={handleOrganicidadCheckboxChange}
                                    />
                                    <InputCheckbox
                                        label="BAJO MANEJO DE FACULTADES MENTALES"
                                        name="pBajoManejo"
                                        checked={form.pBajoManejo}
                                        onChange={handleOrganicidadCheckboxChange}
                                    />
                                </SectionFieldset>
                                <div className="space-y-3">
                                    <SectionFieldset>
                                        <InputCheckbox
                                            label="ORIENTADO EN TIEMPO, ESPACIO, Y PERSONA"
                                            name="orientadoEnTiempo"
                                            checked={form.orientadoEnTiempo}
                                            onChange={handleOrganicidadCheckboxChange}
                                        />
                                    </SectionFieldset>
                                    <SectionFieldset>
                                        <InputCheckbox
                                            label="NO SE EVIDENCIA DAÑO ORGÁNICO"
                                            name="noSeEnvidencia"
                                            checked={form.noSeEnvidencia}
                                            onChange={handleOrganicidadCheckboxChange}
                                        />
                                    </SectionFieldset>
                                </div>

                            </fieldset>
                        </div>
                    </SectionFieldset>
                </div>

                {/* Columna Derecha */}
                <div className="space-y-4">
                    {/* Área Personalidad */}
                    <SectionFieldset legend="Área Personalidad">
                        <InputTextArea
                            rows={5}
                            label="Test de la figura humana de Machover / MV Multifásico de Personalidad"
                            name="areaPersonalidad"
                            value={form.areaPersonalidad}
                            onChange={handleChange}
                        />
                    </SectionFieldset>

                    {/* Área de Psicomotricidad */}
                    <SectionFieldset legend="Área Psicomotricidad">
                        <div className="space-y-2">
                            <InputTextArea
                                rows={5}
                                label="Prueba de Laberintos de Weschler"
                                name="areaPsicomotricidad"
                                value={form.areaPsicomotricidad}
                                onChange={handleChange}
                            />
                            <div className="grid grid-cols-2 gap-2">
                                <SectionFieldset>
                                    <InputCheckbox
                                        label="NIVEL ALTO"
                                        name="nivelAltoPs"
                                        checked={form.nivelAltoPs}
                                        onChange={handlePsicomotricidadCheckboxChange}
                                    />
                                    <InputCheckbox
                                        label="NIVEL ADECUADO"
                                        name="nivelAdecuadoPs"
                                        checked={form.nivelAdecuadoPs}
                                        onChange={handlePsicomotricidadCheckboxChange}
                                    />
                                    <InputCheckbox
                                        label="NIVEL BAJO"
                                        name="nivelBajoPs"
                                        checked={form.nivelBajoPs}
                                        onChange={handlePsicomotricidadCheckboxChange}
                                    />
                                </SectionFieldset>
                                <SectionFieldset>
                                    <InputCheckbox
                                        label="FACILIDAD"
                                        name="facilidadPs"
                                        checked={form.facilidadPs}
                                        onChange={handlePsicomotricidadCheckboxChange}
                                    />
                                    <InputCheckbox
                                        label="DIFICULTAD"
                                        name="dificultadPs"
                                        checked={form.dificultadPs}
                                        onChange={handlePsicomotricidadCheckboxChange}
                                    />
                                </SectionFieldset>
                            </div>
                        </div>
                    </SectionFieldset>

                    {/* Recomendaciones */}
                    <SectionFieldset legend="Recomendaciones">
                        {/* Select y botón para agregar recomendaciones predefinidas */}
                        <div className="flex gap-2 mb-3">
                            <select
                                value={selectedRecomendacion}
                                onChange={(e) => setSelectedRecomendacion(e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Seleccionar recomendación predefinida...</option>
                                {opcionesRecomendaciones.map((opcion, index) => (
                                    <option key={index} value={opcion}>
                                        {opcion}
                                    </option>
                                ))}
                            </select>
                            <button
                                type="button"
                                onClick={agregarRecomendacion}
                                disabled={!selectedRecomendacion}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                            >
                                Agregar
                            </button>
                        </div>

                        <InputTextArea
                            rows={4}
                            name="recomendaciones"
                            value={form.recomendaciones}
                            onChange={handleChange}
                        />
                    </SectionFieldset>
                </div>
            </div>

            {/* BOTONES DE ACCIÓN */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-12">
                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={handleSave}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-base px-6 py-2 rounded flex items-center gap-2"
                    >
                        <FontAwesomeIcon icon={faSave} /> Guardar/Actualizar
                    </button>
                    <button
                        type="button"
                        onClick={handleClear}
                        className="bg-yellow-400 hover:bg-yellow-500 text-white text-base px-6 py-2 rounded flex items-center gap-2"
                    >
                        <FontAwesomeIcon icon={faBroom} /> Limpiar
                    </button>
                </div>
                <div className="flex flex-col items-end">
                    <span className="font-bold italic text-base mb-1">IMPRIMIR</span>
                    <div className="flex items-center gap-2">
                        <input
                            name="norden"
                            value={form.norden}
                            onChange={handleChange}
                            className="border rounded px-2 py-1 text-base w-24"
                        />

                        <button
                            type="button"
                            onClick={handlePrint}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-base px-4 py-2 rounded flex items-center gap-2"
                        >
                            <FontAwesomeIcon icon={faPrint} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}