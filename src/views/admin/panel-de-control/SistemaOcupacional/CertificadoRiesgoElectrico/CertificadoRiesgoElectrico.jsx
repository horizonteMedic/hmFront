import EmpleadoComboBox from "../../../../components/reusableComponents/EmpleadoComboBox";
import InputsRadioGroup from "../../../../components/reusableComponents/InputsRadioGroup";
import InputTextOneLine from "../../../../components/reusableComponents/InputTextOneLine"
import RadioTable from "../../../../components/reusableComponents/RadioTable";
import SectionFieldset from "../../../../components/reusableComponents/SectionFieldset"
import BotonesAccion from "../../../../components/templates/BotonesAccion";
import DatosPersonalesLaborales from "../../../../components/templates/DatosPersonalesLaborales";
import { useForm } from "../../../../hooks/useForm";
import { useSessionData } from "../../../../hooks/useSessionData";
import { getToday, getTodayPlusOneYear } from "../../../../utils/helpers";
import { PrintHojaR, SubmitDataService, VerifyTR } from "./controllerCertificadoRiesgo";

const tabla = "riesgo_electrico"

const CertficadoRiesgoElectrico = () => {

    // const tabla = "certificado_exposicion_calor_vapor"


    const today = getToday();
    const { token, userlogued, selectedSede, datosFooter, userName } = useSessionData();

    const initialFormState = {
        // Header
        norden: "",
        fechaExamen: today,
        fechaExpiracion: getTodayPlusOneYear(),
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

        ubicacionSitio: "",
        tiempoExperiencia: "",

        evaluacionRiesgoRealizada: "SI",
        personalCompetenteAreaElectrica: "SI",
        conoceTipoVoltaje: "SI",
        personalCertificadoVoltaje: "SI",
        eppApropiadoTarea: "SI",
        sistemaDesenergizado: "SI",
        sistemaAislado: "SI",
        tarjetasAdvertenciaInstaladas: "SI",
        bloqueosInstalados: "SI",
        sistemasAterrizados: "SI",
        trabajosSimultaneosControlados: "SI",
        personalEntrenadoRiesgoElectrico: "SI",
        medidasSeguridadSatisfactorias: "SI",

        aptitud: "",
        // Médico que Certifica //BUSCADOR
        nombre_medico: userName,
        user_medicoFirma: userlogued,
    };

    const {
        form,
        setForm,
        handleChange,
        handleChangeNumber,
        handleChangeNumberDecimals,
        handleRadioButtonBoolean,
        handleRadioButton,
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
                        label="Nombre del Examen"
                        name="tipoExamen"
                        value={form.tipoExamen}
                        disabled
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
                    <InputTextOneLine
                        label="Fecha expiración"
                        name="fechaExpiracion"
                        type="date"
                        value={form?.fechaExpiracion}
                        onChange={handleChangeSimple}
                        labelWidth="120px"
                    />
                </SectionFieldset>

                {/* ===== SECCIÓN: DATOS LABORALES ===== */}
                <DatosPersonalesLaborales form={form} />

                <SectionFieldset className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-3">
                    <InputTextOneLine
                        label="Ubicación del sitio"
                        name="ubicacionSitio"
                        value={form.ubicacionSitio}
                        onChange={handleChange}
                        labelWidth="120px"
                    />
                    <InputTextOneLine
                        label="Tiempo de experiencia"
                        name="tiempoExperiencia"
                        value={form.tiempoExperiencia}
                        disabled
                        labelWidth="121px"
                    />
                </SectionFieldset>

                <SectionFieldset legend="ITEMS" className="w-full">
                    <RadioTable
                        items={[
                            { name: "evaluacionRiesgoRealizada", label: "1.- ¿Se ha realizado una evaluación de riesgo al trabajo específico?" },
                            { name: "personalCompetenteAreaElectrica", label: "2.- ¿Las personas que van a realizar el trabajo son competentes en el área eléctrica?" },
                            { name: "conoceTipoVoltaje", label: "3.- 3	¿Las personas que van a realizar el trabajo conocen el voltaje (medio, bajo, otro) que se va a intervenir?" },
                            { name: "personalCertificadoVoltaje", label: "4.- ¿Están certificadas las personas para trabajar en este tipo de voltaje?" },
                            { name: "eppApropiadoTarea", label: "5.- ¿Los elementos y equipos de protección personal son los apropiados para la tarea  y según el tipo de voltaje?" },
                            { name: "sistemaDesenergizado", label: "6.- ¿Se ha verificado que se encuentra des-energizado el sistema que va a ser intervenido?" },
                            { name: "sistemaAislado", label: "7.- ¿Ha sido aislado el sistema que va a ser intervenido?" },
                            { name: "tarjetasAdvertenciaInstaladas", label: "8.- ¿Se han instalado tarjetas de advertencias y/o peligroso?" },
                            { name: "bloqueosInstalados", label: "9.- ¿Se han instalado los bloqueos pertinentes?" },
                            { name: "sistemasAterrizados", label: "10.- ¿Se encuentran aterrizados los sistemas que van a ser intervenidos?" },
                            { name: "trabajosSimultaneosControlados", label: "11.- ¿Si existen trabajos simultáneos que pueden afectar el trabajo ya fueron notificados y se tomaron las acciones pertinentes." },
                            { name: "personalEntrenadoRiesgoElectrico", label: "12.- ¿Todas las personas que intervienen en el trabajo, han sido entrenadas en riesgos eléctricos?" },
                            { name: "medidasSeguridadSatisfactorias", label: "13.- ¿Se siente usted satisfecho y considera que de todas las medidas de seguridad industrial han sido tomadas y se va a desarrollar un trabajo seguro?" }
                        ]}
                        options={[
                            { label: "SI", value: "SI" },
                            { label: "NO", value: "NO" },
                            { label: "N/A", value: "NA" },
                        ]}
                        form={form}
                        labelColumns={5}
                        groupLabel="ELECTRICO "
                        handleRadioButton={handleRadioButtonBoolean}
                    />
                </SectionFieldset>

                <SectionFieldset
                    legend="Conclusión de Aptitud"
                    className="grid grid-cols-1  gap-3"
                >
                    <InputsRadioGroup
                        name="aptitud"
                        value={form?.aptitud}
                        onChange={handleRadioButton}
                        vertical
                        options={[
                            {
                                label: "APTO (Puede realizar trabajos con exposición al calor.)",
                                value: "APTO",
                            },
                            {
                                label:
                                    "APTO CON RESTRICCION (Debe cumplir medidas preventivas específicas.)",
                                value: "RESTRICCION",
                            },
                            {
                                label:
                                    "NO APTO (No apto para trabajos con exposición al calor y vapor)",
                                value: "NO_APTO",
                            },
                        ]}
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
                    handleChangeNumberDecimals={handleChangeNumberDecimals}
                />
            </div>
        </>
    )
}

export default CertficadoRiesgoElectrico