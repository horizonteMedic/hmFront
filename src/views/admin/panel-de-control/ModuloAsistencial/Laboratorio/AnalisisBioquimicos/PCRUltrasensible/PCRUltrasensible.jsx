import EmpleadoComboBox from "../../../../../../components/reusableComponents/EmpleadoComboBox";
import InputTextOneLine from "../../../../../../components/reusableComponents/InputTextOneLine";
import SectionFieldset from "../../../../../../components/reusableComponents/SectionFieldset";
import SearchButton from "../../../../../../components/reusableComponents/SearchButton";
import AccionesRegistroHeader from "../../../../../../components/reusableComponents/AccionesRegistroHeader";
import AuditoriaRegistro from "../../../../../../components/reusableComponents/AuditoriaRegistro";
import BotonesForm from "../../../../../../components/templates/BotonesForm";
import DatosPersonalesLaboralesAsistencial from "../../../../../../components/templates/DatosPersonalesLaboralesAsistencial";
import { useForm } from "../../../../../../hooks/useForm";
import { useSessionData } from "../../../../../../hooks/useSessionData";
import { useRegistroEditable } from "../../../../../../hooks/useRegistroEditable";
import { getToday, getFechaHoraActual } from '../../../../../../utils/helpers';
import { buildAuditoria } from "../../../../../../utils/auditoriaUtils";
import { ConfirmarImpresion, SubmitDataService, UpdateDataService, VerifyTR } from "./controllerPCRUltrasensible";

// Campos que el usuario puede editar en este formulario (para resaltar/revertir cambios).
const CAMPOS_EDITABLES = [
    "fecha",
    "resultado",
    "user_medicoFirma",
    "nombre_medico",
    "user_doctorAsignado",
    "nombre_doctorAsignado",
];

export default function PCRUltrasensible() {
    const { token, userlogued, userName } = useSessionData();
    const today = getToday();

    const initialFormState = {
        numeroTicket: "",
        ticketImprimir: "",
        fecha: today,

        pacienteId: null,
        numeroDocumento: "",
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
        ocupacion: "",

        resultado: "",

        muestra: "SUERO EN AYUNAS",

        // Médico que Certifica //BUSCADOR
        nombre_medico: userName,
        user_medicoFirma: userlogued,

        nombre_doctorAsignado: "",
        user_doctorAsignado: "",

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
        handleChangeNumber,
        handleChangeNumberDecimals,
        handleFocusNext,
        handleChangeSimple,
        handleClear,
    } = useForm(initialFormState, { storageKey: "asistPcrUltrasensible" });

    const {
        edicionHabilitada,
        habilitarEdicion,
        camposDeshabilitados,
        isFieldEdited,
        revertField,
        revertFields,
    } = useRegistroEditable(form, setForm, { tieneRegistro: form.tieneRegistro, camposEditables: CAMPOS_EDITABLES });

    // El médico y el doctor asignado se componen de 2 campos (id de firma + nombre): se detecta
    // el cambio por el id y se revierten ambos en conjunto.
    const isMedicoEdited = isFieldEdited("user_medicoFirma");
    const revertMedico = () => revertFields(["user_medicoFirma", "nombre_medico"]);
    const isDoctorEdited = isFieldEdited("user_doctorAsignado");
    const revertDoctor = () => revertFields(["user_doctorAsignado", "nombre_doctorAsignado"]);

    const handleSave = () => {
        SubmitDataService(form, token, userlogued, handleClear);
    };

    const handleEdit = () => {
        UpdateDataService(form, token, userlogued, handleClear);
    };

    // Equivalente a handleClearnotO pero conservando el N° Ticket digitado.
    const limpiarSalvoTicket = () => {
        setForm((prev) => ({ ...initialFormState, numeroTicket: prev.numeroTicket }));
    };

    // ===== Búsqueda con botón =====
    const executeSearch = () => {
        limpiarSalvoTicket();
        VerifyTR(form.numeroTicket, token, setForm);
    };

    // ===== Búsqueda con enter =====
    const handleSearch = (e) => {
        if (!e || e.key === 'Enter') {
            executeSearch();
        }
    };

    const hayRegistroCargado = Boolean(form.nombres);

    const handlePrint = () => {
        ConfirmarImpresion(form.ticketImprimir, token);
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

            <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="flex gap-x-3 w-full">
                    <InputTextOneLine
                        label="N° Ticket"
                        name="numeroTicket"
                        value={form.numeroTicket}
                        onChange={handleChangeNumber}
                        onKeyUp={handleSearch}
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
            </SectionFieldset>
            <DatosPersonalesLaboralesAsistencial form={form} laborales={false} />
            <SectionFieldset legend="Muestra" className="grid gap-3">
                <InputTextOneLine
                    label='Muestra'
                    name="muestra"
                    value={form.muestra}
                    disabled
                    labelWidth='120px'
                />
            </SectionFieldset>
            <SectionFieldset legend="Resultados" className="grid grid-cols-1 gap-4">
                <div className="flex items-center gap-4">
                    <InputTextOneLine
                        label="PRC ULTRASENSIBLE (MÉTODO INMUNOTURBIDIMÉTRICO)"
                        name="resultado"
                        value={form.resultado}
                        labelWidth="400px"
                        onChange={(e) => handleChangeNumberDecimals(e, 2)}
                        onKeyUp={handleFocusNext}
                        className="flex-1"
                        disabled={camposDeshabilitados}
                        edited={isFieldEdited("resultado")}
                        onRevert={() => revertField("resultado")}
                    />
                    <span className="text-gray-500 text-[11px] font-medium whitespace-nowrap">
                        {"(Valor Normal < 7.5 mg/l)"}
                    </span>
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
                <EmpleadoComboBox
                    value={form.nombre_doctorAsignado}
                    label="Doctor Asignado"
                    form={form}
                    onChange={handleChangeSimple}
                    nameField="nombre_doctorAsignado"
                    idField="user_doctorAsignado"
                    disabled={camposDeshabilitados}
                    edited={isDoctorEdited}
                    onRevert={revertDoctor}
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
                handleSave={form.tieneRegistro && edicionHabilitada ? handleEdit : handleSave}
                saveLabel={form.tieneRegistro && edicionHabilitada ? "Guardar Cambios" : "Guardar"}
                handleEdit={habilitarEdicion}
                handleClear={handleClear}
                handlePrint={handlePrint}
                printField="ticketImprimir"
                printLabel="IMPRIMIR N° TICKET"
                hideSave={form.tieneRegistro && !edicionHabilitada}
                hideEdit={!form.tieneRegistro || edicionHabilitada}
            />
        </div>
    );
}
