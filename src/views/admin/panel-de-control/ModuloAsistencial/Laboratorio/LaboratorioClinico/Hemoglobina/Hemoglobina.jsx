import { useSessionData } from '../../../../../../hooks/useSessionData';
import { useForm } from '../../../../../../hooks/useForm';
import { useRegistroEditable } from '../../../../../../hooks/useRegistroEditable';
import { getToday, getFechaHoraActual } from '../../../../../../utils/helpers';
import { buildAuditoria } from '../../../../../../utils/auditoriaUtils';
import { ConfirmarImpresion, SubmitDataService, UpdateDataService, VerifyTR } from './controllerHemoblobina';
import {
    InputTextOneLine,
    InputsRadioGroup,
} from '../../../../../../components/reusableComponents/ResusableComponents';
import SectionFieldset from '../../../../../../components/reusableComponents/SectionFieldset';
import SearchButton from '../../../../../../components/reusableComponents/SearchButton';
import AccionesRegistroHeader from '../../../../../../components/reusableComponents/AccionesRegistroHeader';
import AuditoriaRegistro from '../../../../../../components/reusableComponents/AuditoriaRegistro';
import DatosPersonalesLaboralesAsistencial from '../../../../../../components/templates/DatosPersonalesLaboralesAsistencial';
import EmpleadoComboBox from '../../../../../../components/reusableComponents/EmpleadoComboBox';
import BotonesForm from '../../../../../../components/templates/BotonesForm';

// Campos que el usuario puede editar en este formulario (para resaltar/revertir cambios).
const CAMPOS_EDITABLES = [
    "fecha",
    "grupoSanguineo",
    "factorRh",
    "hematocrito",
    "hemoglobina",
    "user_medicoFirma",
    "nombre_medico",
    "user_doctorAsignado",
    "nombre_doctorAsignado",
];

export default function Hemoglobina() {
    const { token, userlogued, userName } = useSessionData();
    const today = getToday();

    const initialFormState = {
        numeroTicket: '',
        ticketImprimir: '',
        fecha: today,
        codLabclinico: null,

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

        grupoSanguineo: "",
        factorRh: "",
        hematocrito: "",
        hemoglobina: "",

        // Médico que Certifica //BUSCADOR
        nombre_medico: userName,
        user_medicoFirma: userlogued,

        // Doctor Asignado //BUSCADOR
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
        handleRadioButton,
        handleChangeSimple,
        handleClear,
        handleFocusNext,
    } = useForm(initialFormState, { storageKey: "asistLabClinicoHemoglobina" });

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

            <DatosPersonalesLaboralesAsistencial form={form} laborales={false}  />

            <SectionFieldset legend="Exámenes" className="grid gap-x-4 gap-y-3">
                <InputsRadioGroup
                    label="Grupo Sanguíneo"
                    name="grupoSanguineo"
                    value={form.grupoSanguineo}
                    options={[{ label: "O", value: "O" }, { label: "A", value: "A" }, { label: "B", value: "B" }, { label: "AB", value: "AB" }]}
                    labelWidth="120px"
                    onChange={handleRadioButton}
                    disabled={camposDeshabilitados}
                    edited={isFieldEdited("grupoSanguineo")}
                    onRevert={() => revertField("grupoSanguineo")}
                />
                <InputsRadioGroup
                    label="Factor Rh"
                    name="factorRh"
                    options={[{ label: "Rh(+)", value: "RH(+)" }, { label: "Rh(-)", value: "RH(-)" }]}
                    value={form.factorRh}
                    labelWidth="120px"
                    onChange={handleRadioButton}
                    disabled={camposDeshabilitados}
                    edited={isFieldEdited("factorRh")}
                    onRevert={() => revertField("factorRh")}
                />
                <InputTextOneLine
                    label="Hematocrito"
                    name="hematocrito"
                    value={form.hematocrito}
                    onChange={handleChangeNumberDecimals}
                    labelWidth="120px"
                    onKeyUp={handleFocusNext}
                    disabled={camposDeshabilitados}
                    edited={isFieldEdited("hematocrito")}
                    onRevert={() => revertField("hematocrito")}
                />
                <InputTextOneLine
                    label="Hemoglobina"
                    name="hemoglobina"
                    value={form.hemoglobina}
                    onChange={(e) => handleChangeNumberDecimals(e, 1)}
                    labelWidth="120px"
                    disabled={camposDeshabilitados}
                    edited={isFieldEdited("hemoglobina")}
                    onRevert={() => revertField("hemoglobina")}
                />
            </SectionFieldset>

            <SectionFieldset legend="Especialista">
                <EmpleadoComboBox
                    value={form.nombre_medico}
                    form={form}
                    label='Especialista que Certifica'
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
