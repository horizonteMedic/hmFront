import {
    InputTextOneLine,
    InputTextArea,
} from "../../../../../../components/reusableComponents/ResusableComponents";
import SectionFieldset from "../../../../../../components/reusableComponents/SectionFieldset";
import SearchButton from "../../../../../../components/reusableComponents/SearchButton";
import AccionesRegistroHeader from "../../../../../../components/reusableComponents/AccionesRegistroHeader";
import AuditoriaRegistro from "../../../../../../components/reusableComponents/AuditoriaRegistro";
import { useSessionData } from "../../../../../../hooks/useSessionData";
import { getToday, getFechaHoraActual } from "../../../../../../utils/helpers";
import { buildAuditoria } from "../../../../../../utils/auditoriaUtils";
import { useForm } from "../../../../../../hooks/useForm";
import { useRegistroEditable } from "../../../../../../hooks/useRegistroEditable";
import { PrintHojaR, SubmitDataService, UpdateDataService, VerifyTR } from "./controllerInformeBurnout";
import BotonesForm from "../../../../../../components/templates/BotonesForm";
import DatosPersonalesLaborales from "../../../../../../components/templates/DatosPersonalesLaborales";
import EmpleadoComboBox from "../../../../../../components/reusableComponents/EmpleadoComboBox";

const tabla = "informe_burnout";

// Campos que el usuario puede editar en este formulario (para resaltar/revertir cambios).
const CAMPOS_EDITABLES = [
    "fecha",
    "sindromeBurnout",
    "agotamientoEmocional",
    "despersonalizacion",
    "realizacionPersonal",
    "resultados",
    "conclusiones",
    "recomendaciones",
    "user_medicoFirma",
    "nombre_medico",
];

export default function InformeBurnout() {
    const today = getToday();
    const { token, userlogued, selectedSede, datosFooter, userName } = useSessionData();

    const initialFormState = {
        norden: '',
        fecha: today,

        nombreExamen: "",

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

        // Síndrome de Burnout
        sindromeBurnout: "",
        agotamientoEmocional: "",
        despersonalizacion: "",
        realizacionPersonal: "",

        // Textos libres
        resultados: "",
        conclusiones: "",
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
        handleChangeNumberDecimals,
        handleClear,
        handleClearnotO,
        handlePrintDefault,
    } = useForm(initialFormState, { storageKey: "informeBurnoutPsicologia" });

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
        <div className="space-y-3 px-4 max-w-[90%]  xl:max-w-[80%] mx-auto">
            <AccionesRegistroHeader
                tieneRegistro={form.tieneRegistro}
                hayRegistroCargado={hayRegistroCargado}
                edicionHabilitada={edicionHabilitada}
                onHabilitarEdicion={habilitarEdicion}
                onLimpiar={handleClear}
            />

            {/* Header con información del examen */}
            <SectionFieldset legend="Información del Examen">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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
                        label="Nombre de Examen"
                        name="nombreExamen"
                        value={form.nombreExamen}
                        disabled
                        labelWidth="120px"
                    />
                </div>
            </SectionFieldset>

            <DatosPersonalesLaborales form={form} />

            <SectionFieldset legend="Criterios Psicológicos">
                <div className="space-y-4">
                    <InputTextOneLine
                        label="Síndrome de Burnout"
                        name="sindromeBurnout"
                        value={form?.sindromeBurnout}
                        onChange={handleChange}
                        labelWidth="170px"
                        disabled={camposDeshabilitados}
                        edited={isFieldEdited("sindromeBurnout")}
                        onRevert={() => revertField("sindromeBurnout")}
                    />
                    <div className="pt-2">
                        <h5 className="font-bold  mb-3">III. Sub Escalas</h5>
                        <div className="grid grid-cols-1 gap-3 ml-4">
                            <InputTextOneLine
                                label="-Agotamiento Emocional"
                                name="agotamientoEmocional"
                                value={form?.agotamientoEmocional}
                                onChange={handleChange}
                                labelWidth="160px"
                                disabled={camposDeshabilitados}
                                edited={isFieldEdited("agotamientoEmocional")}
                                onRevert={() => revertField("agotamientoEmocional")}
                            />
                            <InputTextOneLine
                                label="-Despersonalización"
                                name="despersonalizacion"
                                value={form?.despersonalizacion}
                                onChange={handleChange}
                                labelWidth="160px"
                                disabled={camposDeshabilitados}
                                edited={isFieldEdited("despersonalizacion")}
                                onRevert={() => revertField("despersonalizacion")}
                            />
                            <InputTextOneLine
                                label="-Realización Personal"
                                name="realizacionPersonal"
                                value={form?.realizacionPersonal}
                                onChange={handleChange}
                                labelWidth="160px"
                                disabled={camposDeshabilitados}
                                edited={isFieldEdited("realizacionPersonal")}
                                onRevert={() => revertField("realizacionPersonal")}
                            />
                        </div>
                    </div>
                </div>
            </SectionFieldset>

            <SectionFieldset legend="Conclusiones Finales" className="space-y-3">
                <InputTextArea
                    label="Resultados"
                    name="resultados"
                    value={form?.resultados}
                    onChange={handleChange}
                    rows={4}
                    disabled={camposDeshabilitados}
                    edited={isFieldEdited("resultados")}
                    onRevert={() => revertField("resultados")}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputTextArea
                        label="Conclusiones"
                        name="conclusiones"
                        value={form?.conclusiones}
                        onChange={handleChange}
                        rows={4}
                        disabled={camposDeshabilitados}
                        edited={isFieldEdited("conclusiones")}
                        onRevert={() => revertField("conclusiones")}
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
