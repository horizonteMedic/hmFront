import {
    InputTextOneLine,
    InputTextArea,
    InputsRadioGroup,
    RadioTable,
    InputCheckbox,
} from "../../../../components/reusableComponents/ResusableComponents";
import SectionFieldset from "../../../../components/reusableComponents/SectionFieldset";
import { useSessionData } from "../../../../hooks/useSessionData";
import { getToday } from "../../../../utils/helpers";
import { useForm } from "../../../../hooks/useForm";
import { PrintHojaR, SubmitDataService, VerifyTR } from "./controllerAltura18";
import { BotonesAccion, DatosPersonalesLaborales } from "../../../../components/templates/Templates";

const tabla = "";
const today = getToday();

export default function Altura18() {
    const { token, userlogued, selectedSede, datosFooter } = useSessionData();

    const initialFormState = {
        // Header - Información del examen
        norden: "",
        fecha: today,
        nombreExamen: "",
        examen: "PRIMERA ACTITUD",
        aniosExperiencia: "",

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

        //Antecedentes del Registro Médico
        miedoAlturas: "NO",
        epilepsiaa: "NO",
        alcoholismo: "NO",
        enfermedadPsiquiatrica: "NO",
        diabetesNoControlada: "NO",
        migrañaNoControlada: "NO",

        insuficienciaCardiaca: "NO",
        asma: "NO",
        hipertensionNoControlada: "NO",
        hipoacusia: "NO",
        alteracionVisual: "NO",
        noAptoAltura: "NO",

        comentarios: "",

        //Antecedentes de la Entrevista con el Paciente
        resfriado: "NO",
        epilepsia: "NO",

        alcohol24h: "NO",
        frecuenciaCefaleas: "NO",

        medicinasTomando: "",

        //Examen Físico
        limitacionFuerzaMovilidad: "NO",
        alteracionEquilibrio: "NO",
        anormalidadMarcha: "NO",
        anormalidadFuerzaMiembros: "NO",
        lenguajeAnormal: "NO",
        alteracionCoordinacion: "NO",
        nistagmus: "NO",
        anormalidadMovOculares: "NO",
        pupilasCIRLA: "SI",
        asimetriaFacial: "NO",
        hallazgoHombro: "NO",
        hallazgoCodo: "NO",
        hallazgoRodilla: "NO",
        hallazgoTobillo: "NO",
        otrosHallazgosMusculoEsqueleticos: "NO",

        hallazgosAnormales: "",

        //Conclusión
        apto18: "SI",
        usoPermanenteLentesCorrectores: "NO",
        usoPermanenteAudifonos: "NO",

        otraRestriccion: "",

        //oftalmo
        vcOD: "",
        vlOD: "",
        vcOI: "",
        vlOI: "",

        vcCorregidaOD: "",
        vlCorregidaOD: "",
        vcCorregidaOI: "",
        vlCorregidaOI: "",

        vclrs: "",
        vb: "",
        rp: "",
        enfermedadesOculares: "",

        //Altura
        alturaLabor: "",
        alturaPara: "",

        frecuenciaCardiaca: "",
        frecuenciaRespiratoria: "",
        saturacionO2: "",
        talla: "",
        peso: "",
        imc: "",
        presionArterial: "",

        observacionesYRecomendaciones: "",

        // Recomendaciones específicas
        sobrepesoObesidadHipocalorica: false,
        corregirAgudezaVisual: false,
        corregirAgudezaVisualTotal: false,
        obesidadDietaHipocalorica: false,
        usoLentesCorrectoresLecturaCerca: false,
        corregirAgudezaLecturaCerca: false,
    };

    const {
        form,
        setForm,
        handleChange,
        handleChangeNumberDecimals,
        handleCheckBoxWriteOnText,
        handleChangeSimple,
        handleRadioButton,
        handleClear,
        handleClearnotO,
        handlePrintDefault,
    } = useForm(initialFormState, { storageKey: "altura1.8" });

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

    const recomendacionesTextMap = {
        sobrepesoObesidadHipocalorica: "SOBREPESO. BAJAR DE PESO. DIETA HIPOCALÓRICA Y EJERCICIOS.",
        corregirAgudezaVisual: "CORREGIR AGUDEZA VISUAL.",
        corregirAgudezaVisualTotal: "CORREGIR AGUDEZA VISUAL TOTAL.",
        obesidadDietaHipocalorica: "OBESIDAD I. BAJAR DE PESO. DIETA HIPOCALÓRICA Y EJERCICIOS.",
        usoLentesCorrectoresLecturaCerca: "USO DE LENTES CORRECTORES PARA LECTURA DE CERCA.",
        corregirAgudezaLecturaCerca: "CORREGIR AGUDEZA VISUAL PARA LECTURA DE CERCA.",
    };

    const handleCheckboxRecomendaciones = (e) => {
        handleCheckBoxWriteOnText(e, "observacionesYRecomendaciones", recomendacionesTextMap);
    }

    return (
        <div className="space-y-3 px-4 max-w-[90%]  xl:max-w-[80%] mx-auto">
            <SectionFieldset legend="Información del Examen">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                    <InputTextOneLine
                        label="N° Orden"
                        name="norden"
                        value={form.norden}
                        onChange={handleChangeNumberDecimals}
                        onKeyUp={handleSearch}
                        labelWidth="120px"
                    />
                    <InputTextOneLine
                        label="Fecha"
                        name="fecha"
                        type="date"
                        value={form.fecha}
                        onChange={handleChangeSimple}
                        labelWidth="120px"
                    />
                    <InputTextOneLine
                        label="Nombre del Examen"
                        name="nombreExamen"
                        value={form.nombreExamen}
                        disabled
                        labelWidth="120px"
                    />
                    <InputsRadioGroup
                        label="Examen"
                        name="examen"
                        labelWidth="120px"
                        value={form.examen}
                        options={[
                            { label: "Primera Actitud", value: "PRIMERA ACTITUD" },
                            { label: "Revalidación", value: "REVALIDACIÓN" },
                        ]}
                        onChange={handleRadioButton}
                    />
                    <InputTextOneLine
                        label="Años Experiencia"
                        name="aniosExperiencia"
                        value={form.aniosExperiencia}
                        onChange={handleChange}
                        labelWidth="120px"
                    />
                </div>
            </SectionFieldset>

            <DatosPersonalesLaborales form={form} />

            <SectionFieldset legend="Antecedentes del Registro Médico" collapsible>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-3">
                    <RadioTable
                        items={[
                            { name: "miedoAlturas", label: "Tiene fobia (miedo) a las alturas" },
                            { name: "epilepsiaa", label: "Epilepsia/convulsiones u otra enfermedad que condiciona pérdida de conciencia" },
                            { name: "alcoholismo", label: "Alcoholismo o abuso de sustancias (adicción)" },
                            { name: "enfermedadPsiquiatrica", label: "Portador de enfermedad psiquiátrica o hallazgo psicológico como rasgos de ansiedad, trastornos impulsivos o compulsivos" },
                            { name: "diabetesNoControlada", label: "Diabetes mellitus o hipoglicemia no controlada" },
                            { name: "migrañaNoControlada", label: "Migraña no controlada" },
                        ]}
                        options={[
                            { value: "SI", label: "SI" },
                            { value: "NO", label: "NO" }
                        ]}
                        labelColumns={6}
                        form={form}
                        handleRadioButton={handleRadioButton}
                    />
                    <RadioTable
                        items={[
                            { name: "insuficienciaCardiaca", label: "Insuficiencia cardiaca, enfermedad coronaria, arritmias, porta marcapaso, prótesis valvular" },
                            { name: "asma", label: "Asma bronquial - Patrón obstructivo moderado o severo" },
                            { name: "hipertensionNoControlada", label: "Hipertensión arterial no controlada" },
                            { name: "hipoacusia", label: "Hipoacusia severa" },
                            { name: "alteracionVisual", label: "Alteración de la agudeza visual (de lejos) y/o estereopsia" },
                            { name: "noAptoAltura", label: "Declarado NO APTO para labor de altura en último examen ocupacional" },
                        ]}
                        options={[
                            { value: "SI", label: "SI" },
                            { value: "NO", label: "NO" }
                        ]}
                        labelColumns={6}
                        form={form}
                        handleRadioButton={handleRadioButton}
                    />
                </div>
                <InputTextArea
                    label="Comentarios y Detalles"
                    name="comentarios"
                    value={form.comentarios}
                    onChange={handleChange}
                    className="ml-4 mt-4"
                    rows={4}

                />
            </SectionFieldset>

            <SectionFieldset legend="Antecedentes de la Entrevista con el Paciente" collapsible>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-3">
                    <RadioTable
                        items={[
                            { name: "resfriado", label: "Se encuentra resfriado o con algún cuadro respiratorio" },
                            { name: "epilepsia", label: "Sufre de vértigos o mareos diagnosticados recientemente" },
                        ]}
                        options={[
                            { value: "SI", label: "SI" },
                            { value: "NO", label: "NO" }
                        ]}
                        labelColumns={6}
                        form={form}
                        handleRadioButton={handleRadioButton}
                    />
                    <RadioTable
                        items={[
                            { name: "alcohol24h", label: "Consumió alcohol en las últimas 24 horas" },
                            { name: "frecuenciaCefaleas", label: "Frecuencia de cefaleas" },
                        ]}
                        options={[
                            { value: "SI", label: "SI" },
                            { value: "NO", label: "NO" }
                        ]}
                        labelColumns={6}
                        form={form}
                        handleRadioButton={handleRadioButton}
                    />
                </div>
                <InputTextArea
                    label="Detalle de las Medicinas que está Tomando"
                    name="medicinasTomando"
                    value={form.medicinasTomando}
                    onChange={handleChange}
                    className="ml-4 mt-4"
                    rows={4}
                />
            </SectionFieldset>

            <div className="grid xl:grid-cols-2 gap-x-4 gap-y-3">
                <div className="flex flex-col gap-y-3">
                    <SectionFieldset legend="Examen Físico" collapsible>
                        <RadioTable
                            items={[
                                { name: "limitacionFuerzaMovilidad", label: "Limitación en Fuerza y/o movilidad de extremidades" },
                                { name: "alteracionEquilibrio", label: "Alteración del equilibrio" },
                                { name: "anormalidadMarcha", label: "Anormalidad en la marcha" },
                                { name: "anormalidadFuerzaMiembros", label: "Anormalidad en la fuerza de los miembros" },
                                { name: "lenguajeAnormal", label: "Lenguaje anormal" },

                                { name: "alteracionCoordinacion", label: "Alteración de la coordinación Presente" },
                                { name: "nistagmus", label: "Presencia de nistagmus" },
                                { name: "anormalidadMovOculares", label: "Anormalidad en movimientos oculares" },
                                { name: "pupilasCIRLA", label: "Pupilas CIRLA" },
                                { name: "asimetriaFacial", label: "Asimetría facial" },

                                { name: "hallazgoHombro", label: "Hallazgos Anormales Hombro: Cirugías, Accidentes, Congénitos" },
                                { name: "hallazgoCodo", label: "Hallazgos Anormales Codo: Cirugías, Accidentes, Congénitos" },
                                { name: "hallazgoRodilla", label: "Hallazgos Anormales Rodilla: Cirugías, Accidentes, Congénitos" },
                                { name: "hallazgoTobillo", label: "Hallazgos Anormales Tobillo: Cirugías, Accidentes, Congénitos" },
                                { name: "otrosHallazgosMusculoEsqueleticos", label: "Otros Hallazgos Alteración Musculo-Esqueléticos" },
                            ]}
                            options={[
                                { value: "SI", label: "SI" },
                                { value: "NO", label: "NO" }
                            ]}
                            labelColumns={6}
                            form={form}
                            handleRadioButton={handleRadioButton}
                        />
                        <InputTextArea
                            label="Hallazos Anormales en Articulaciones Específicas (Alteraciones Musculoesqueléticas)"
                            name="hallazgosAnormales"
                            value={form.hallazgosAnormales}
                            onChange={handleChange}
                            className="ml-4 mt-4"
                            rows={4}
                        />
                    </SectionFieldset>

                    <SectionFieldset legend="Conclusión" collapsible>
                        <RadioTable
                            items={[
                                { name: "apto18", label: "Apto para trabajar encima de los 1.8 metros" },
                                { name: "usoPermanenteLentesCorrectores", label: "Uso Permanente de Lentes Correctores" },
                                { name: "usoPermanenteAudifonos", label: "Uso Permanente de Audífonos" },
                            ]}
                            options={[
                                { value: "SI", label: "SI" },
                                { value: "NO", label: "NO" }
                            ]}
                            labelColumns={6}
                            form={form}
                            handleRadioButton={handleRadioButton}
                        />
                        <InputTextArea
                            label="Otra Restricción"
                            name="otraRestriccion"
                            value={form.otraRestriccion}
                            onChange={handleChange}
                            className="ml-4 mt-4"
                            rows={4}
                        />
                    </SectionFieldset>
                </div>
                <div className="flex  flex-col gap-y-3">
                    <SectionFieldset legend="Oftalmología" collapsible>
                        <h4 className="font-semibold text-gray-800 mb-3 text-center">Sin Corregir</h4>
                        {/* Sin Corregir */}
                        <div className="mb-4">
                            <div className="grid md:grid-cols-2 gap-3">
                                <div className="">
                                    <div className="font-semibold mb-2 text-center">O.D</div>
                                    <div className="space-y-3">
                                        <InputTextOneLine label="V.C." name="vcOD" value={form?.vcOD} disabled labelWidth="35px" />
                                        <InputTextOneLine label="V.L." name="vlOD" value={form?.vlOD} disabled labelWidth="35px" />
                                    </div>
                                </div>
                                <div className="">
                                    <div className="font-semibold mb-2 text-center">O.I</div>
                                    <div className="space-y-3">
                                        <InputTextOneLine label="V.C." name="vcOI" value={form?.vcOI} disabled labelWidth="35px" />
                                        <InputTextOneLine label="V.L." name="vlOI" value={form?.vlOI} disabled labelWidth="35px" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Corregida */}
                        <div className="mb-4">
                            <h5 className="font-semibold text-gray-700 mb-2 text-center">Corregida</h5>
                            {/* Fila OD y OI */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <div className="font-semibold mb-2 text-center">O.D</div>
                                    <InputTextOneLine
                                        label="V.C."
                                        name="vcCorregidaOD"
                                        value={form?.vcCorregidaOD}
                                        disabled
                                        labelWidth="35px"
                                    />
                                    <InputTextOneLine
                                        label="V.L."
                                        name="vlCorregidaOD"
                                        value={form?.vlCorregidaOD}
                                        disabled
                                        labelWidth="35px"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <div className="font-semibold mb-2 text-center">O.I</div>
                                    <InputTextOneLine
                                        label="V.C."
                                        name="vcCorregidaOI"
                                        value={form?.vcCorregidaOI}
                                        disabled
                                        labelWidth="35px"
                                    />
                                    <InputTextOneLine
                                        label="V.L."
                                        name="vlCorregidaOI"
                                        value={form?.vlCorregidaOI}
                                        disabled
                                        labelWidth="35px"
                                    />
                                </div>
                            </div>
                            {/* Fila extra (ancho completo) */}
                            <div className="mt-4 space-y-3">
                                <InputTextOneLine
                                    label="V.Clrs"
                                    name="vclrs"
                                    value={form?.vclrs}
                                    disabled
                                    labelWidth="35px"
                                />
                                <InputTextOneLine
                                    name="vb"
                                    label="V.B."
                                    value={form?.vb}
                                    disabled
                                    labelWidth="35px"
                                />
                                <InputTextOneLine
                                    label="R.P."
                                    name="rp"
                                    value={form?.rp}
                                    disabled
                                    labelWidth="35px"
                                />
                                <InputTextArea
                                    label="Enfermedades Oculares"
                                    rows={7}
                                    name="enfermedadesOculares"
                                    value={form?.enfermedadesOculares}
                                    onChange={handleChange}
                                    disabled
                                />
                            </div>
                        </div>
                    </SectionFieldset>
                    <SectionFieldset legend="Altura" className="space-y-3" collapsible>
                        <InputTextOneLine
                            label="Altura del Labor"
                            name="alturaLabor"
                            value={form?.alturaLabor}
                            onChange={handleChange}
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="Para"
                            name="alturaPara"
                            value={form?.alturaPara}
                            onChange={handleChange}
                            labelWidth="120px"
                        />
                    </SectionFieldset>
                    <SectionFieldset legend="Examen Físico" className="grid xl:grid-cols-2 gap-x-4 gap-y-3" collapsible>
                        <InputTextOneLine
                            label="Frecuencia Cardiaca (x min)"
                            name="frecuenciaCardiaca"
                            value={form?.frecuenciaCardiaca}
                            disabled
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="Frecuencia Respiratoria (x min)"
                            name="frecuenciaRespiratoria"
                            value={form?.frecuenciaRespiratoria}
                            disabled
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="Saturación O² (%)"
                            name="saturacionO2"
                            value={form?.saturacionO2}
                            disabled
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="Talla (m)"
                            name="talla"
                            value={form?.talla}
                            disabled
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="Peso (kg)"
                            name="peso"
                            value={form?.peso}
                            disabled
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="IMC (kg/m²)"
                            name="imc"
                            value={form?.imc}
                            disabled
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="Presión Arterial (mmHg)"
                            name="presionArterial"
                            value={form?.presionArterial}
                            disabled
                            labelWidth="120px"
                        />
                    </SectionFieldset>
                    <SectionFieldset legend="Recomendaciones" className="grid gap-y-3 grid-cols-2 gap-4" collapsible>
                        <InputTextArea
                            label="Observaciones y Recomendaciones"
                            name="observacionesYRecomendaciones"
                            value={form?.observacionesYRecomendaciones}
                            onChange={handleChange}
                            rows={6}
                        />
                        <div className="grid grid-cols-1 gap-2">
                            <InputCheckbox
                                label="Sobrepeso/Obesidad - Dieta Hipocalórica"
                                name="sobrepesoObesidadHipocalorica"
                                checked={form?.sobrepesoObesidadHipocalorica}
                                onChange={handleCheckboxRecomendaciones}
                            />
                            <InputCheckbox
                                label="Corregir Agudeza Visual"
                                name="corregirAgudezaVisual"
                                checked={form?.corregirAgudezaVisual}
                                onChange={handleCheckboxRecomendaciones}
                            />
                            <InputCheckbox
                                label="Corregir Agudeza Visual Total"
                                name="corregirAgudezaVisualTotal"
                                checked={form?.corregirAgudezaVisualTotal}
                                onChange={handleCheckboxRecomendaciones}
                            />
                            <InputCheckbox
                                label="Obesidad - Dieta Hipocalórica"
                                name="obesidadDietaHipocalorica"
                                checked={form?.obesidadDietaHipocalorica}
                                onChange={handleCheckboxRecomendaciones}
                            />
                            <InputCheckbox
                                label="Uso de Lentes Correctores para Lectura de Cerca"
                                name="usoLentesCorrectoresLecturaCerca"
                                checked={form?.usoLentesCorrectoresLecturaCerca}
                                onChange={handleCheckboxRecomendaciones}
                            />
                            <InputCheckbox
                                label="Corregir Agudeza para Lectura de Cerca"
                                name="corregirAgudezaLecturaCerca"
                                checked={form?.corregirAgudezaLecturaCerca}
                                onChange={handleCheckboxRecomendaciones}
                            />
                        </div>
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