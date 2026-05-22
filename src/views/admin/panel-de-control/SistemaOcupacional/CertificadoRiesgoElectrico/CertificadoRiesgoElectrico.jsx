import EmpleadoComboBox from "../../../../components/reusableComponents/EmpleadoComboBox";
import InputTextOneLine from "../../../../components/reusableComponents/InputTextOneLine"
import RadioTable from "../../../../components/reusableComponents/RadioTable";
import SectionFieldset from "../../../../components/reusableComponents/SectionFieldset"
import BotonesAccion from "../../../../components/templates/BotonesAccion";
import DatosPersonalesLaborales from "../../../../components/templates/DatosPersonalesLaborales";
import { useForm } from "../../../../hooks/useForm";
import { useSessionData } from "../../../../hooks/useSessionData";
import { getToday } from "../../../../utils/helpers";
import { PrintHojaR, SubmitDataService, VerifyTR } from "./controllerCertificadoRiesgo";

const CertficadoRiesgoElectrico = () => {
    const today = getToday();
    const { token, userlogued, selectedSede, datosFooter, userName } = useSessionData();

    const initialFormState = {
        // Header
        norden: "",
        fechaExamen: today,
        tipoExamen: "",
        // Datos personales
        dni: "",
        nombres: "",
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

        //EXAMEN MEDICO
        fechaNacimientoPaciente: "",
        peso: "",
        talla: "",
        colorPiel: "",
        colorOjos: "",
        cabello: "",

        //FACTORES HEREDITARIOS
        //1
        asma: false,
        alergias: false,
        bronquitis: false,
        pleuresia: false,
        neumonia: false,
        respiracion: false,
        sangreSaliva: false,
        respiracionBreve: false,
        problemasNasales: false,
        tbc: false,
        fuma: false,
        //2
        palpitaciones: false,
        ritmoCardiacoIrregular: false,
        fallasCardiacas: false,
        desmayos: false,
        tobillosHinchados: false,
        moretonesAnormales: false,
        presionAlta: false,
        heridasPecho: false,
        otrasEnfermedades: false,
        tomaMedicina: false,

        //DETALLES
        //EXAMNE MEDICO
        pulsoReposo: "",
        pulsoReposoBp: "",
        pulso30flexiones: "",
        respiracionReposo: "",
        respiracion30flexiones: "",
        obstruccionNasal: "",
        formaPecho: "",
        expansionPecho: "",
        pulmones: "",
        corazon: "",
        enfermedadesCronicas: "",
        funcionPulmonar: "",
        fvc: "",
        fevl: "",
        otros: "",
        enForma: "",

        //RAYOS X
        fechaPlaca: "",
        pechoNormal: "",
        tbcRayosX: "",
        pneumoconiosis: "",
        clasificacionOit: "",
        filmNumeroPlaca: "",
        corazonRayosX: "",
        otrosCambios: "",
        examenSaliva: "",
        //OPINOINES
        hallazgosAnormales: "",
        opinionClinica: "",

        // Médico que Certifica //BUSCADOR
        nombre_medico: userName,
        user_medicoFirma: userlogued,
    };

    const {
        form,
        setForm,
        handleChange,
        handleChangeNumber,
        handleRadioButtonBoolean,
        handleFocusNext,
        handleClear,
        handleChangeSimple,
        handleClearnotO,
        handlePrintDefault,
    } = useForm(initialFormState, { storageKey: "CertificadoRiesgoElectrico" });

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
        <>
            <div className="space-y-3 px-4 max-w-[90%] xl:max-w-[80%] mx-auto">
                {/* ===== SECCIÓN: N° ORDEN Y FECHA ===== */}
                <SectionFieldset legend="Información General" className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-3">
                    <InputTextOneLine
                        label="N° Orden"
                        name="norden"
                        value={form.norden}
                        onKeyUp={handleSearch}
                        onChange={handleChangeNumber}
                        labelWidth="120px"
                    />
                    <InputTextOneLine
                        label="Fecha de Ingreso"
                        name="fechaExamen"
                        type="date"
                        value={form.fechaExamen}
                        onChange={handleChangeSimple}
                        labelWidth="120px"
                    />

                </SectionFieldset>

                {/* ===== SECCIÓN: DATOS LABORALES ===== */}
                <DatosPersonalesLaborales form={form} />

                <SectionFieldset legend="FACTORES HEREDITARIOS" className="w-full">
                    <RadioTable
                        items={[
                            { name: "asma", label: "1.- ¿Se ha realizado una evaluación de riesgo al trabajo específico?" },
                            { name: "alergias", label: "2.- ¿Las personas que van a realizar el trabajo son competentes en el área eléctrica?" },
                            { name: "bronquitis", label: "3.- 3	¿Las personas que van a realizar el trabajo conocen el voltaje (medio, bajo, otro) que se va a intervenir?" },
                            { name: "pleuresia", label: "4.- ¿Están certificadas las personas para trabajar en este tipo de voltaje?" },
                            { name: "neumonia", label: "5.- ¿Los elementos y equipos de protección personal son los apropiados para la tarea  y según el tipo de voltaje?" },
                            { name: "respiracion", label: "6.- ¿Se ha verificado que se encuentra des-energizado el sistema que va a ser intervenido?" },
                            { name: "sangreSaliva", label: "7.- ¿Se ha verificado que se encuentra des-energizado el sistema que va a ser intervenido?" },
                            { name: "respiracionBreve", label: "8.- ¿Se han instalado tarjetas de advertencias y/o peligroso?" },
                            { name: "problemasNasales", label: "9.- ¿Se han instalado los bloqueos pertinentes?" },
                            { name: "tbc", label: "10.- ¿Se encuentran aterrizados los sistemas que van a ser intervenidos?" },
                            { name: "fuma", label: "11.- ¿Si existen trabajos simultáneos que pueden afectar el trabajo ya fueron notificados y se tomaron las acciones pertinentes." },
                            { name: "fuma", label: "12.- ¿Todas las personas que intervienen en el trabajo, han sido entrenadas en riesgos eléctricos?" },
                            { name: "fuma", label: "13.- ¿Se siente usted satisfecho y considera que de todas las medidas de seguridad industrial han sido tomadas y se va a desarrollar un trabajo seguro?" }
                        ]}
                        options={[
                            { label: "SI", value: "SI" },
                            { label: "NO", value: "NO" },
                            { label: "N/A", value: "N/A" },
                        ]}
                        form={form}
                        labelColumns={5}
                        groupLabel="ELECTRICO "
                        handleRadioButton={handleRadioButtonBoolean}
                    />
                </SectionFieldset>


                <SectionFieldset legend="Asignación de Médico" className="w-full">
                    <EmpleadoComboBox
                        value={form.nombre_medico}
                        label="Especialista"
                        form={form}
                        onChange={handleChangeSimple}
                    />
                </SectionFieldset>
                {/* BOTONES DE ACCIÓN */}
                <BotonesAccion
                    form={form}
                    handleSave={handleSave}
                    handleClear={handleClear}
                    handlePrint={handlePrint}
                />
            </div>
        </>
    )
}

export default CertficadoRiesgoElectrico