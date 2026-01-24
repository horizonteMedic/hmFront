import { useState } from "react";
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
import BotonesAccion from "../../../../../../components/templates/BotonesAccion";

const tabla = "informe_psicologico";

export default function InformePsicologico() {
    const { token, userlogued, selectedSede, datosFooter } = useSessionData();

    const today = getToday();

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
        areaIntelectual: "- EL EVALUADO POSEE UN NIVEL INTELECTUAL PROMEDIO.",
        intelectualSuperior: false,
        intelectualPromedio: true,
        intelectualPromedioSuperior: false,
        intelectualPromedioBajo: false,

        pSuperior: false,
        pMedio: false,
        pBajo: false,
        bajo: false,

        infosencilla: false,
        infogeneral: false,

        compInfo: false,
        // compBajo: false,

        supVerbalNum: false,
        promVerbalNum: false,
        promSupVerbalNum: false,
        promBajoVerbalNum: false,

        adecuado: false,
        prmBajo: false,

        // Área de Personalidad
        areaPersonalidad: "",

        // Área de Psicomotricidad
        areaPsicomotricidad: "",
        nivAdecuadoPs: false,

        facilidad: false,
        dificultad: false,

        // Área de Organicidad
        areaOrganicidad: "",
        orientadoTiempo: false,

        adecuadoManejo: false,
        bajoManejo: false,

        noEnvidencia: false,

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
        handleChangeNumberDecimals,
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
        nivelIntelectual: ['intelectualSuperior', 'intelectualPromedio', 'intelectualPromedioSuperior', 'intelectualPromedioBajo'],
        facilidadDificultad: ['infosencilla', 'infogeneral'],
        capacidadNumerica: ['supVerbalNum', 'promVerbalNum', 'promSupVerbalNum', 'promBajoVerbalNum'],
        nivelPsicomotor: ['promSuperior', 'promedio', 'superior', 'promBajo'],
        nivelAtencion: ['compInfo'], //, 'compBajo'
        retencionDigitos: ['adecuado', 'prmBajo']
    };

    // Textos específicos para cada checkbox
    const intellectualTexts = {
        intelectualSuperior: "- EL EVALUADO POSEE UN NIVEL INTELECTUAL SUPERIOR.",
        intelectualPromedio: "- EL EVALUADO POSEE UN NIVEL INTELECTUAL PROMEDIO.",
        intelectualPromedioSuperior: "- EL EVALUADO POSEE UN NIVEL INTELECTUAL PROMEDIO SUPERIOR.",
        intelectualPromedioBajo: "- EL EVALUADO POSEE UN NIVEL INTELECTUAL PROMEDIO BAJO.",

        infosencilla: "- COMPRENDE Y PROCESA LA INFORMACION SENCILLA CON FACILIDAD.",
        infogeneral: "- COMPRENDE Y PROCESA LA INFORMACION CON FACILIDAD.",

        supVerbalNum: "- POSEE UN NIVEL SUPERIOR EN COMPRENSION VERBAL Y EN CAPACIDAD NUMÉRICA.",
        promVerbalNum: "- POSEE UN NIVEL PROMEDIO EN COMPRENSION VERBAL Y EN CAPACIDAD NUMÉRICA.",
        promSupVerbalNum: "- POSEE UN NIVEL PROMEDIO SUPERIOR EN COMPRENSION VERBAL Y EN CAPACIDAD NUMÉRICA.",
        promBajoVerbalNum: "- POSEE UN NIVEL PROMEDIO BAJO EN COMPRENSION VERBAL Y EN CAPACIDAD NUMÉRICA.",
        
        promSuperior: "- POSEE UN NIVEL PROMEDIO SUPERIOR EN COMPRENSION VERBAL Y EN CAPACIDAD DE CÁLCULO.",
        promedio: "- POSEE UN NIVEL PROMEDIO EN COMPRENSION VERBAL Y EN CAPACIDAD DE CÁLCULO.",
        superior: "- POSEE UN NIVEL SUPERIOR EN COMPRENSION VERBAL Y EN CAPACIDAD DE CÁLCULO.",
        promBajo: "- POSEE UN NIVEL PROMEDIO BAJO EN COMPRENSION VERBAL Y EN CAPACIDAD DE CÁLCULO.",

        compInfo: "- COMPRENDE Y PROCESA LA INFORMACION SENCILLA CON FACILIDAD.",
        // compBajo: "- POSEE UN NIVEL PROMEDIO BAJO EN EL MANEJO DE FACULTADES MENTALES.",
 
        adecuado: "- ADECUADA RETENCION DE DIGITOS.",
        prmBajo: "- PRESENTA UN NIVEL PROMEDIO BAJO RETENCION DE DIGITOS."
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
                manejoFacultades: ['adecuadoManejo', 'bajoManejo'],
                orientacion: ['orientadoTiempo'],
                danoOrganico: ['noEnvidencia']
            },
            texts: {
                adecuadoManejo: '- POSEE UN ADECUADO MANEJO DE FACULTADES MENTALES.',
                bajoManejo: '- POSEE UN NIVEL PROMEDIO BAJO EN EL MANEJO DE FACULTADES MENTALES.',
                orientadoTiempo: '- ORIENTADO EN TIEMPO, ESPACIO, Y PERSONA.',
                noEnvidencia: '- NO SE EVIDENCIA DAÑO ORGÁNICO.'
            },
            fieldName: 'areaOrganicidad'
        },
        psicomotricidad: {
            groups: {
                nivel: ['nivAdecuado'],
                facilidad: ['facilidad', 'dificultad']
            },
            texts: {
                nivAdecuado: '- NIVEL ADECUADO EN DESARROLLO PSICOMOTOR.',
                facilidad: '- REALIZA LAS INSTRUCCIONES BRINDADAS CON FACILIDAD',
                dificultad: '- REALIZA LAS INSTRUCCIONES BRINDADAS CON DIFICULTAD.'
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
        <div className="space-y-3 px-4 max-w-[90%]  xl:max-w-[80%] mx-auto">
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
                            <div className="grid grid-cols-2 gap-2">
                                <SectionFieldset>
                                    <InputCheckbox
                                        label="SUPERIOR"
                                        name="intelectualSuperior"
                                        checked={form.intelectualSuperior}
                                        onChange={handleIntellectualCheckboxChange}
                                    />
                                    <InputCheckbox
                                        label="PROMEDIO"
                                        name="intelectualPromedio"
                                        checked={form.intelectualPromedio}
                                        onChange={handleIntellectualCheckboxChange}
                                    />
                                    <InputCheckbox
                                        label="PROMEDIO SUPERIOR"
                                        name="intelectualPromedioSuperior"
                                        checked={form.intelectualPromedioSuperior}
                                        onChange={handleIntellectualCheckboxChange}
                                    />
                                    <InputCheckbox
                                        label="PROMEDIO BAJO"
                                        name="intelectualPromedioBajo"
                                        checked={form.intelectualPromedioBajo}
                                        onChange={handleIntellectualCheckboxChange}
                                    />
                                </SectionFieldset>
                                <SectionFieldset >
                                    <InputCheckbox
                                        label="INFORMACION SENCILLA"
                                        name="infosencilla"
                                        checked={form.infosencilla}
                                        onChange={handleIntellectualCheckboxChange}
                                    />
                                    <InputCheckbox
                                        label="INFORMACION GENERAL"
                                        name="infogeneral"
                                        checked={form.infogeneral}
                                        onChange={handleIntellectualCheckboxChange}
                                    />
                                </SectionFieldset>
                                <SectionFieldset>
                                    <InputCheckbox
                                        label="N.S.VERBAL Y NUMÉRICA"
                                        name="supVerbalNum"
                                        checked={form.supVerbalNum}
                                        onChange={handleIntellectualCheckboxChange}
                                    />
                                    <InputCheckbox
                                        label="N.P.VERBAL Y NUMÉRICA"
                                        name="promVerbalNum"
                                        checked={form.promVerbalNum}
                                        onChange={handleIntellectualCheckboxChange}
                                    />
                                    <InputCheckbox
                                        label="N.P.S.VERBAL Y NUMÉRICA"
                                        name="promSupVerbalNum"
                                        checked={form.promSupVerbalNum}
                                        onChange={handleIntellectualCheckboxChange}
                                    />       
                                    <InputCheckbox
                                        label="N.P.B.VERBAL Y NUMÉRICA"
                                        name="promBajoVerbalNum"
                                        checked={form.promBajoVerbalNum}
                                        onChange={handleIntellectualCheckboxChange}
                                    />                             
                                </SectionFieldset>
                                <SectionFieldset>
                                    <InputCheckbox
                                        label="N.P.S. VERBAL Y CÁLCULO"
                                        name="promSuperior"
                                        checked={form.promSuperior}
                                        onChange={handleIntellectualCheckboxChange}
                                    />
                                    <InputCheckbox
                                        label="N.P.VERBAL Y CÁLCULO"
                                        name="promedio"
                                        checked={form.promedio}
                                        onChange={handleIntellectualCheckboxChange}
                                    />
                                    <InputCheckbox
                                        label="N.S.VERBAL Y CÁLCULO"
                                        name="superior"
                                        checked={form.superior}
                                        onChange={handleIntellectualCheckboxChange}
                                    />
                                    <InputCheckbox
                                        label="N.P.B.VERBAL Y CÁLCULO"
                                        name="promBajo"
                                        checked={form.promBajo}
                                        onChange={handleIntellectualCheckboxChange}
                                    />
                                </SectionFieldset>
                                <SectionFieldset>
                                    <InputCheckbox
                                        label="COMPRENSIÓN"
                                        name="compInfo"
                                        checked={form.compInfo}
                                        onChange={handleIntellectualCheckboxChange}
                                    />
                                    {/* <InputCheckbox
                                        label="PROMEDIO BAJO"
                                        name="compBajo"
                                        checked={form.compBajo}
                                        onChange={handleIntellectualCheckboxChange}
                                    /> */}
                                </SectionFieldset>
                                <SectionFieldset>
                                    <InputCheckbox
                                        label="ADECUADA RETENCIÓN DE DÍGITOS"
                                        name="adecuado"
                                        checked={form.adecuado}
                                        onChange={handleIntellectualCheckboxChange}
                                    />
                                    <InputCheckbox
                                        label="PROMEDIO BAJO DE RETENCIÓN"
                                        name="prmBajo"
                                        checked={form.prmBajo}
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
                                <SectionFieldset className="flex gap-3 flex-col" >
                                    <InputCheckbox
                                        label="ADECUADO MANEJO DE FACULTADES MENTALES"
                                        name="adecuadoManejo"
                                        checked={form.adecuadoManejo}
                                        onChange={handleOrganicidadCheckboxChange}
                                    />
                                    <InputCheckbox
                                        label="BAJO MANEJO DE FACULTADES MENTALES"
                                        name="bajoManejo"
                                        checked={form.bajoManejo}
                                        onChange={handleOrganicidadCheckboxChange}
                                    />
                                </SectionFieldset>
                                <div className="space-y-3">
                                    <SectionFieldset>
                                        <InputCheckbox
                                            label="ORIENTADO EN TIEMPO, ESPACIO, Y PERSONA"
                                            name="orientadoTiempo"
                                            checked={form.orientadoTiempo}
                                            onChange={handleOrganicidadCheckboxChange}
                                        />
                                    </SectionFieldset>
                                    <SectionFieldset>
                                        <InputCheckbox
                                            label="NO SE EVIDENCIA DAÑO ORGÁNICO"
                                            name="noEnvidencia"
                                            checked={form.noEnvidencia}
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
                                        label="NIVEL ADECUADO"
                                        name="nivAdecuado"
                                        checked={form.nivAdecuado}
                                        onChange={handlePsicomotricidadCheckboxChange}
                                    />
                                </SectionFieldset>
                                <SectionFieldset>
                                    <InputCheckbox
                                        label="FACILIDAD"
                                        name="facilidad"
                                        checked={form.facilidad}
                                        onChange={handlePsicomotricidadCheckboxChange}
                                    />
                                    <InputCheckbox
                                        label="DIFICULTAD"
                                        name="dificultad"
                                        checked={form.dificultad}
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

            <BotonesAccion
                form={form}
                handleSave={handleSave}
                handleClear={handleClear}
                handlePrint={handlePrint}
                handleChangeNumberDecimals={handleChangeNumberDecimals}
            />
        </div>
    );
}