import { InputTextOneLine } from "../../../../../components/reusableComponents/ResusableComponents";
import SectionFieldset from "../../../../../components/reusableComponents/SectionFieldset";
import SearchButton from "../../../../../components/reusableComponents/SearchButton";
import AccionesRegistroHeader from "../../../../../components/reusableComponents/AccionesRegistroHeader";
import AuditoriaRegistro from "../../../../../components/reusableComponents/AuditoriaRegistro";
import { useForm } from "../../../../../hooks/useForm";
import { useRegistroEditable } from "../../../../../hooks/useRegistroEditable";
import { useSessionData } from "../../../../../hooks/useSessionData";
import { getToday, getFechaHoraActual } from "../../../../../utils/helpers";
import { buildAuditoria } from "../../../../../utils/auditoriaUtils";
import { PrintHojaR, SubmitDataService, UpdateDataService, VerifyTR } from "./controllerConformidadEMO";
import BotonesForm from "../../../../../components/templates/BotonesForm";
import EmpleadoComboBox from "../../../../../components/reusableComponents/EmpleadoComboBox";
import { textoDocumento } from '../../../../../utils/documentoPaciente';

const tabla = "registro_conformidad_emo";

// Campos que el usuario puede editar en este formulario (para resaltar/revertir cambios).
const CAMPOS_EDITABLES = ["fecha", "user_medicoFirma", "nombre_medico"];

const textoFinalConsentimiento = `Me ha entregado, informado y explicado de manera presencial por medios digitales los resultados del Examen Médico Ocupacional que se me ha realizado.\nAsí mismo me comprometo a cumplir con las indicaciones y recomendaciones recibidas por parte del médico ocupacional.`;
const textoFinalConsentimiento2 = `Doy conformidad de lo indicado mediante mi firma y/o huella digital.`;

export default function ConformidadEMO() {
    const today = getToday();
    const { token, selectedSede, userlogued, datosFooter, hora, userName } = useSessionData();

    const initialFormState = {
        norden: "",
        fecha: today,
        nombreExamen: "",
        nombres: "",
        edad: "",
        dni: "",
        empresa: "",
        ocupacion: "",

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
        handleChangeSimple,
        handleChangeNumber,
        handleClear,
        handleClearnotO,
        handlePrintDefault,
    } = useForm(initialFormState, { storageKey: "conformidadEMO" });

    const {
        edicionHabilitada,
        habilitarEdicion,
        camposDeshabilitados,
        isFieldEdited,
        revertField,
        revertFields,
    } = useRegistroEditable(form, setForm, { tieneRegistro: form.tieneRegistro, camposEditables: CAMPOS_EDITABLES });

    // El médico se compone de 2 campos (id de firma + nombre): se detecta el cambio por el id y se
    // revierten ambos en conjunto.
    const isMedicoEdited = isFieldEdited("user_medicoFirma");
    const revertMedico = () => revertFields(["user_medicoFirma", "nombre_medico"]);

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

    const handleSave = () => {
        SubmitDataService(form, token, userlogued, handleClear, tabla, datosFooter);
    };

    const handleUpdate = () => {
        UpdateDataService(form, token, userlogued, handleClear, tabla, datosFooter);
    };

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
            PrintHojaR(form.norden, token, tabla, datosFooter);
        });
    };

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

            <SectionFieldset legend="Información del Examen" className="grid xl:grid-cols-3 gap-x-4 gap-y-3">
                <div className="flex gap-x-3 w-full">
                    <InputTextOneLine
                        label="N° Orden"
                        name="norden"
                        value={form.norden}
                        onKeyUp={handleSearch}
                        onChange={handleChangeNumber}
                        disabled={hayRegistroCargado}
                        className="w-full"
                    />
                    <SearchButton onClick={executeSearch} className="lg:hidden" />
                </div>
                <InputTextOneLine
                    label="Fecha"
                    type="date"
                    name="fecha"
                    value={form.fecha}
                    onChange={handleChangeSimple}
                    disabled={camposDeshabilitados}
                    edited={isFieldEdited("fecha")}
                    onRevert={() => revertField("fecha")}
                />
                <InputTextOneLine
                    label="Hora"
                    name="hora"
                    value={hora}
                    disabled
                />
            </SectionFieldset>

            {/* Contenido del Consentimiento */}
            <SectionFieldset legend="Consentimiento Evaluación Médica" className="space-y-3">
                {/* Información Personal */}
                <div className="space-y-3">
                    <InputTextOneLine
                        label="Yo"
                        name="nombres"
                        value={form.nombres}
                        disabled
                        labelWidth="30px"
                    />
                    <div className="flex items-center flex-wrap">
                        <InputTextOneLine
                            label="de"
                            name="edad"
                            value={form.edad}
                            disabled
                            labelWidth="30px"
                            className="mr-4"
                        />
                        <label className="font-semibold min-w-[50px]">años de edad,</label>
                        <InputTextOneLine
                            label="identificado con DNI"
                            name="dni"
                            value={textoDocumento(form.dni)}
                            disabled
                            labelWidth="110px"
                        />
                    </div>
                    <InputTextOneLine
                        label="Con ocupación laboral de"
                        name="ocupacion"
                        value={form.ocupacion}
                        disabled
                        labelWidth="140px"
                    />
                </div>

                {/* Texto del Consentimiento */}
                <div className="space-y-4">
                    <div className="text-justify leading-relaxed">
                        <div className="mb-3">
                            <InputTextOneLine
                                label="Para la Empresa"
                                name="empresa"
                                value={form.empresa}
                                disabled
                                labelWidth="140px"
                            />
                        </div>
                        <p className="text-justify">
                            {textoFinalConsentimiento}
                        </p>
                        <p className="text-justify">
                            {textoFinalConsentimiento2}
                        </p>
                    </div>
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
                onNordenChange={handlePrintNordenChange}
                handleSave={form.tieneRegistro && edicionHabilitada ? handleUpdate : handleSave}
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

