import { useSessionData } from '../../../../../../hooks/useSessionData';
import { useForm } from '../../../../../../hooks/useForm';
import { useRegistroEditable } from '../../../../../../hooks/useRegistroEditable';
import { getToday, getFechaHoraActual } from '../../../../../../utils/helpers';
import { buildAuditoria } from '../../../../../../utils/auditoriaUtils';
import { PrintHojaR, SubmitDataService, UpdateDataService, VerifyTR } from './controllerHemoblobina';
import {
    InputTextOneLine,
    InputsRadioGroup,
} from '../../../../../../components/reusableComponents/ResusableComponents';
import SectionFieldset from '../../../../../../components/reusableComponents/SectionFieldset';
import SearchButton from '../../../../../../components/reusableComponents/SearchButton';
import RegistroEstadoPill from '../../../../../../components/reusableComponents/RegistroEstadoPill';
import AuditoriaRegistro from '../../../../../../components/reusableComponents/AuditoriaRegistro';
import DatosPersonalesLaborales from '../../../../../../components/templates/DatosPersonalesLaborales';
import EmpleadoComboBox from '../../../../../../components/reusableComponents/EmpleadoComboBox';
import BotonesForm from '../../../../../../components/templates/BotonesForm';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

const tabla = 'lab_clinico_hemoglobina';

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
    const { token, userlogued, selectedSede, userName } = useSessionData();
    const today = getToday();

    const initialFormState = {
        norden: '',
        fecha: today,
        codLabclinico: null,

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
        handleClearnotO,
        handleClear,
        handlePrintDefault,
        handleFocusNext,
    } = useForm(initialFormState, { storageKey: "labClinicoHemoglobina" });

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
        SubmitDataService(form, token, userlogued, handleClear, tabla);
    };

    const handleEdit = () => {
        UpdateDataService(form, token, userlogued, handleClear, tabla);
    };

    // ===== Búsqueda con botón =====
    const executeSearch = () => {
        handleClearnotO();
        VerifyTR(form.norden, tabla, token, setForm, selectedSede);
    };

    // ===== Búsqueda con enter =====
    const handleSearch = (e) => {
        if (!e || e.key === 'Enter') {
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
            PrintHojaR(form.norden, token, tabla);
        });
    };

    const auditoria = buildAuditoria(form, {
        usuarioActual: userlogued,
        fechaHoraActual: getFechaHoraActual(),
    });

    return (
        <div className="space-y-3 px-4 max-w-[90%] xl:max-w-[80%] mx-auto">
            <div className="sticky top-2 z-20 flex justify-end pointer-events-none">
                <RegistroEstadoPill
                    tieneRegistro={form.tieneRegistro}
                    className={hayRegistroCargado ? "" : "invisible"}
                />
                {hayRegistroCargado && form.tieneRegistro && !edicionHabilitada && (
                    <button
                        type="button"
                        onClick={habilitarEdicion}
                        className="pointer-events-auto inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-3 py-1.5 rounded-full shadow-sm transition-all duration-150 ease-out hover:shadow-lg active:scale-95"
                    >
                        <FontAwesomeIcon icon={faEdit} /> Habilitar edición
                    </button>
                )}
            </div>

            <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="flex gap-x-3 w-full">
                    <InputTextOneLine
                        label="N° Orden"
                        name="norden"
                        value={form.norden}
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
                <InputTextOneLine
                    label="Nombre del Examen"
                    name="nombreExamen"
                    value={form.nombreExamen}
                    disabled
                    labelWidth="120px"
                />
            </SectionFieldset>

            <DatosPersonalesLaborales form={form} />

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
