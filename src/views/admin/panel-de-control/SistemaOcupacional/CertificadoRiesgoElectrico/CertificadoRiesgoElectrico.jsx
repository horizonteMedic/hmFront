import EmpleadoComboBox from "../../../../components/reusableComponents/EmpleadoComboBox";
import InputsRadioGroup from "../../../../components/reusableComponents/InputsRadioGroup";
import InputTextOneLine from "../../../../components/reusableComponents/InputTextOneLine"
import RadioTable from "../../../../components/reusableComponents/RadioTable";
import SectionFieldset from "../../../../components/reusableComponents/SectionFieldset"
import SearchButton from "../../../../components/reusableComponents/SearchButton";
import AccionesRegistroHeader from "../../../../components/reusableComponents/AccionesRegistroHeader";
import AuditoriaRegistro from "../../../../components/reusableComponents/AuditoriaRegistro";
import BotonesForm from "../../../../components/templates/BotonesForm";
import DatosPersonalesLaborales from "../../../../components/templates/DatosPersonalesLaborales";
import { useForm } from "../../../../hooks/useForm";
import { useRegistroEditable } from "../../../../hooks/useRegistroEditable";
import { useSessionData } from "../../../../hooks/useSessionData";
import { getToday, getTodayPlusOneYear, getFechaHoraActual } from "../../../../utils/helpers";
import { buildAuditoria } from "../../../../utils/auditoriaUtils";
import { PrintHojaR, SubmitDataService, UpdateDataService, VerifyTR } from "./controllerCertificadoRiesgo";

const tabla = "riesgo_electrico"

// Preguntas del cuestionario (SI / NO / N/A).
const ITEMS = [
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
];

// Campos que el usuario puede editar en este formulario (para resaltar/revertir cambios).
const CAMPOS_EDITABLES = [
    "fechaExamen",
    "fechaExpiracion",
    "ubicacionSitio",
    ...ITEMS.map((item) => item.name),
    "aptitud",
    "user_medicoFirma",
    "nombre_medico",
];

const CertficadoRiesgoElectrico = () => {

    const today = getToday();
    const { token, userlogued, selectedSede, datosFooter, userName } = useSessionData();

    const initialFormState = {
        // Header
        norden: "",
        id: null,
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
        handleChangeNumberDecimals,
        handleRadioButtonBoolean,
        handleRadioButton,
        handleClear,
        handleChangeSimple,
        handleClearnotO,
        handlePrintDefault,
    } = useForm(initialFormState, { storageKey: "CertificadoRiesgoElectrico" });

    const {
        edicionHabilitada,
        habilitarEdicion,
        camposDeshabilitados,
        isFieldEdited,
        revertField,
        revertFields,
    } = useRegistroEditable(form, setForm, { tieneRegistro: form.tieneRegistro, camposEditables: CAMPOS_EDITABLES });

    // El médico se compone de 2 campos (id de firma + nombre): se detecta el cambio por el id y se revierten ambos.
    const isMedicoEdited = isFieldEdited("user_medicoFirma");
    const revertMedico = () => revertFields(["user_medicoFirma", "nombre_medico"]);

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

    const hayRegistroCargado = Boolean(form.nombres || form.dni);
    const nordenDisabled = hayRegistroCargado;

    const auditoria = buildAuditoria(form, {
        usuarioActual: userlogued,
        fechaHoraActual: getFechaHoraActual(),
    });

    return (
        <>
            <div className="space-y-3 px-4 max-w-[90%] xl:max-w-[80%] mx-auto">
                <AccionesRegistroHeader
                    tieneRegistro={form.tieneRegistro}
                    hayRegistroCargado={hayRegistroCargado}
                    edicionHabilitada={edicionHabilitada}
                    onHabilitarEdicion={habilitarEdicion}
                    onLimpiar={handleClear}
                />

                {/* ===== SECCIÓN: N° ORDEN Y FECHA ===== */}
                <SectionFieldset legend="Información General" className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-3">
                    <div className="flex gap-x-3 w-full">
                        <InputTextOneLine
                            label="N° Orden"
                            name="norden"
                            value={form.norden}
                            onKeyUp={handleSearch}
                            onChange={handleChangeNumberDecimals}
                            disabled={nordenDisabled}
                            labelWidth="120px"
                            className="w-full"
                        />
                        <SearchButton onClick={executeSearch} className="lg:hidden" />
                    </div>
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
                        disabled={camposDeshabilitados}
                        edited={isFieldEdited("fechaExamen")}
                        onRevert={() => revertField("fechaExamen")}
                        labelWidth="120px"
                    />
                    <InputTextOneLine
                        label="Fecha expiración"
                        name="fechaExpiracion"
                        type="date"
                        value={form.fechaExpiracion}
                        onChange={handleChangeSimple}
                        disabled={camposDeshabilitados}
                        edited={isFieldEdited("fechaExpiracion")}
                        onRevert={() => revertField("fechaExpiracion")}
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
                        disabled={camposDeshabilitados}
                        edited={isFieldEdited("ubicacionSitio")}
                        onRevert={() => revertField("ubicacionSitio")}
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
                        items={ITEMS}
                        options={[
                            { label: "SI", value: "SI" },
                            { label: "NO", value: "NO" },
                            { label: "N/A", value: "NA" },
                        ]}
                        form={form}
                        labelColumns={5}
                        groupLabel="ELECTRICO "
                        handleRadioButton={handleRadioButtonBoolean}
                        disabled={camposDeshabilitados}
                        isFieldEdited={isFieldEdited}
                        onRevert={revertField}
                        stackOnMobile
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
                        disabled={camposDeshabilitados}
                        edited={isFieldEdited("aptitud")}
                        onRevert={() => revertField("aptitud")}
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

                {/* BOTONES DE ACCIÓN */}
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
        </>
    )
}

export default CertficadoRiesgoElectrico
