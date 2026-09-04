import { useSessionData } from '../../../../../../hooks/useSessionData';
import { useForm } from '../../../../../../hooks/useForm';
import { useRegistroEditable } from '../../../../../../hooks/useRegistroEditable';
import { getToday, getFechaHoraActual } from '../../../../../../utils/helpers';
import { buildAuditoria } from '../../../../../../utils/auditoriaUtils';
import { PrintHojaR, SubmitDataService, UpdateDataService, VerifyTR } from './controllerExamenOrina';
import {
    InputTextOneLine,
} from '../../../../../../components/reusableComponents/ResusableComponents';
import SectionFieldset from '../../../../../../components/reusableComponents/SectionFieldset';
import SearchButton from '../../../../../../components/reusableComponents/SearchButton';
import AccionesRegistroHeader from '../../../../../../components/reusableComponents/AccionesRegistroHeader';
import AuditoriaRegistro from '../../../../../../components/reusableComponents/AuditoriaRegistro';
import DatosPersonalesLaborales from '../../../../../../components/templates/DatosPersonalesLaborales';
import EmpleadoComboBox from '../../../../../../components/reusableComponents/EmpleadoComboBox';
import BotonesForm from '../../../../../../components/templates/BotonesForm';

const tabla = 'lab_clinico_examen_orina';

// Campos que el usuario puede editar en este formulario (para resaltar/revertir cambios).
const CAMPOS_EDITABLES = [
    "fecha",
    "color",
    "aspecto",
    "densidad",
    "ph",
    "nitritos",
    "proteinas",
    "cetonas",
    "leucocitosExamenQuimico",
    "acAscorbico",
    "urobilinogeno",
    "bilirrubina",
    "glucosaExamenQuimico",
    "sangre",
    "leucocitosSedimentoUnitario",
    "hematiesSedimentoUnitario",
    "celEpiteliales",
    "cristales",
    "almidon",
    "levadura",
    "cilindros",
    "bacterias",
    "gramSc",
    "otros",
    "user_medicoFirma",
    "nombre_medico",
    "user_doctorAsignado",
    "nombre_doctorAsignado",
];

export default function ExamenOrina() {
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

        // Campos de Examen de Orina - Estados iniciales
        color: 'AMARILLO CLARO',
        aspecto: 'TRANSPARENTE',
        densidad: '',
        ph: '',

        nitritos: 'NEGATIVO',
        proteinas: 'NEGATIVO',
        cetonas: 'NEGATIVO',
        leucocitosExamenQuimico: 'NEGATIVO',
        acAscorbico: 'NEGATIVO',
        urobilinogeno: 'NEGATIVO',
        bilirrubina: 'NEGATIVO',
        glucosaExamenQuimico: 'NEGATIVO',
        sangre: 'NEGATIVO',

        leucocitosSedimentoUnitario: '0-1',
        hematiesSedimentoUnitario: '0-0',
        celEpiteliales: 'ESCASAS',
        cristales: 'NO SE OBSERVAN',
        almidon: 'NO SE OBSERVAN',
        levadura: "NO SE OBSERVAN",
        cilindros: 'NO SE OBSERVAN',
        bacterias: 'NO SE OBSERVAN',
        gramSc: 'NO SE OBSERVAN',
        otros: 'NO SE OBSERVAN',

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
        handleChange,
        handleChangeNumberDecimals,
        handleFocusNext,
        handleChangeSimple,
        handleClearnotO,
        handleClear,
        handlePrintDefault,
    } = useForm(initialFormState, { storageKey: "examenOrina" });

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
            <AccionesRegistroHeader
                tieneRegistro={form.tieneRegistro}
                hayRegistroCargado={hayRegistroCargado}
                edicionHabilitada={edicionHabilitada}
                onHabilitarEdicion={habilitarEdicion}
                onLimpiar={handleClear}
            />

            <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="flex gap-x-3 w-full">
                    <InputTextOneLine
                        label="N° Orden"
                        name="norden"
                        value={form.norden}
                        onChange={handleChangeNumberDecimals}
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

            <div className="font-semibold text-center bg-gray-100 p-3 rounded">
                MUESTRA: ORINA
            </div>

            {/*Examen de Orina */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
                <div className="space-y-3 flex flex-col">
                    <SectionFieldset legend="Examen Físico" className="space-y-4 flex-1">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-4">
                                <label className="font-semibold min-w-[100px] max-w-[100px]">Color :</label>
                                <select name="color" value={form.color} disabled={camposDeshabilitados} className="border rounded p-1 w-full" onChange={handleChange}>
                                    <option>N/A</option>
                                    <option>AMARILLO CLARO</option>
                                    <option>AMARILLO PAJIZO</option>
                                    <option>AMARILLO AMBAR</option>
                                    <option>AMBAR</option>
                                    <option>INCOLORO</option>
                                    <option>MEDICAMENTOSO</option>
                                    <option>SANGUINOLENTO</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-4">
                                <label className="font-semibold min-w-[100px] max-w-[100px]">Aspecto:</label>
                                <select name="aspecto" value={form.aspecto} disabled={camposDeshabilitados} className="border rounded p-1 w-full" onChange={handleChange}>
                                    <option>N/A</option>
                                    <option>LIGERAMENTE TURBIO</option>
                                    <option>TRANSPARENTE</option>
                                    <option>TURBIO</option>
                                </select>
                            </div>
                            <InputTextOneLine
                                label="Densidad"
                                name="densidad"
                                value={form.densidad}
                                labelWidth="100px"
                                onChange={handleChange}
                                onKeyUp={(e) => { handleFocusNext(e, "ph") }}
                                disabled={camposDeshabilitados}
                                edited={isFieldEdited("densidad")}
                                onRevert={() => revertField("densidad")}
                            />
                            <InputTextOneLine
                                label="PH"
                                name="ph"
                                value={form.ph}
                                labelWidth="100px"
                                onChange={handleChange}
                                disabled={camposDeshabilitados}
                                edited={isFieldEdited("ph")}
                                onRevert={() => revertField("ph")}
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                className="bg-red-600 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:pointer-events-none"
                                disabled={camposDeshabilitados}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setForm(prev => {
                                        const isNA = form.color === "N/A";

                                        const defaults = {
                                            color: "AMARILLO CLARO",
                                            aspecto: "TRANSPARENTE",
                                            densidad: "",
                                            ph: "",
                                            nitritos: "NEGATIVO",
                                            proteinas: "NEGATIVO",
                                            cetonas: "NEGATIVO",
                                            leucocitosExamenQuimico: "NEGATIVO",
                                            acAscorbico: "NEGATIVO",
                                            urobilinogeno: "NEGATIVO",
                                            bilirrubina: "NEGATIVO",
                                            glucosaExamenQuimico: "NEGATIVO",
                                            sangre: "NEGATIVO",
                                            leucocitosSedimentoUnitario: "0-1",
                                            hematiesSedimentoUnitario: "0-0",
                                            celEpiteliales: "ESCASAS",
                                            cristales: "NO SE OBSERVAN",
                                            almidon: "NO SE OBSERVAN",
                                            levadura: "NO SE OBSERVAN",
                                            cilindros: "NO SE OBSERVAN",
                                            bacterias: "NO SE OBSERVAN",
                                            gramSc: "NO SE OBSERVAN",
                                            otros: "NO SE OBSERVAN",
                                        };
                                        const cleared = Object.fromEntries(
                                            Object.keys(defaults).map(key => [key, "N/A"])
                                        );
                                        return {
                                            ...prev,
                                            ...(isNA ? defaults : cleared)
                                        };
                                    });

                                }}
                            >
                                No Aplica
                            </button>
                        </div>
                    </SectionFieldset>

                    <SectionFieldset legend="Sedimento Urinario" className="space-y-2 grid xl:grid-cols-2 gap-x-4">
                        <div className="grid gap-y-2">
                            {[
                                { label: 'Leucocitos (x campos)', key: 'leucocitosSedimentoUnitario' },
                                { label: 'CelEpiteliales', key: 'celEpiteliales' },
                                { label: 'Cilindros', key: 'cilindros' },
                                { label: 'Almidon', key: 'almidon' },
                                { label: 'Gram S/C', key: 'gramSc' },
                            ].map((item) => (
                                <InputTextOneLine
                                    label={item.label}
                                    name={item.key}
                                    key={item.key}
                                    value={form[item.key]}
                                    onChange={handleChange}
                                    onKeyUp={handleFocusNext}
                                    disabled={camposDeshabilitados}
                                    edited={isFieldEdited(item.key)}
                                    onRevert={() => revertField(item.key)}
                                />
                            ))}
                        </div>
                        <div className="grid gap-y-2">
                            {[
                                { label: 'Hematies (x campos)', key: 'hematiesSedimentoUnitario' },
                                { label: 'Cristales', key: 'cristales' },
                                { label: 'Bacterias', key: 'bacterias' },
                                { label: 'Levadura', key: 'levadura' },
                                { label: 'Otros', key: 'otros' },
                            ].map((item) => (
                                <InputTextOneLine
                                    label={item.label}
                                    name={item.key}
                                    key={item.key}
                                    value={form[item.key]}
                                    onChange={handleChange}
                                    onKeyUp={handleFocusNext}
                                    disabled={camposDeshabilitados}
                                    edited={isFieldEdited(item.key)}
                                    onRevert={() => revertField(item.key)}
                                />
                            ))}
                        </div>
                    </SectionFieldset>
                </div>
                <div className="space-y-3 flex flex-col">
                    <SectionFieldset legend="Examen Químico" className="grid xl:grid-cols-2 gap-y-2 xl:gap-y-0 gap-x-4">
                        <div className="grid gap-y-2 ">
                            {[
                                { label: 'Nitritos', key: 'nitritos' },
                                { label: 'Cetonas', key: 'cetonas' },
                                { label: 'Ác. Ascórbico', key: 'acAscorbico' },
                                { label: 'Bilirrubina', key: 'bilirrubina' },
                                { label: 'Sangre', key: 'sangre' },
                            ].map((item) => (
                                <InputTextOneLine
                                    label={item.label}
                                    name={item.key}
                                    key={item.key}
                                    value={form[item.key]}
                                    onChange={handleChange}
                                    onKeyUp={handleFocusNext}
                                    disabled={camposDeshabilitados}
                                    edited={isFieldEdited(item.key)}
                                    onRevert={() => revertField(item.key)}
                                />
                            ))}
                        </div>
                        <div className="flex flex-col gap-y-2 ">
                            {[
                                { label: 'Proteínas', key: 'proteinas' },
                                { label: 'Leucocitos', key: 'leucocitosExamenQuimico' },
                                { label: 'Urobilinógeno', key: 'urobilinogeno' },
                                { label: 'Glucosa', key: 'glucosaExamenQuimico' },

                            ].map((item) => (
                                <InputTextOneLine
                                    label={item.label}
                                    name={item.key}
                                    key={item.key}
                                    value={form[item.key]}
                                    onChange={handleChange}
                                    onKeyUp={handleFocusNext}
                                    disabled={camposDeshabilitados}
                                    edited={isFieldEdited(item.key)}
                                    onRevert={() => revertField(item.key)}
                                />
                            ))}
                        </div>
                    </SectionFieldset>
                    <SectionFieldset legend="Especialista">
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
                </div>
            </div>

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
