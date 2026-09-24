import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import {
    InputCheckbox,
    InputTextOneLine,
    SectionFieldset,
} from "../../../../components/reusableComponents/ResusableComponents";
import { DatosPersonalesLaborales } from "../../../../components/templates/Templates";
import BotonesForm from "../../../../components/templates/BotonesForm";
import EmpleadoComboBox from "../../../../components/reusableComponents/EmpleadoComboBox";
import AccionesRegistroHeader from "../../../../components/reusableComponents/AccionesRegistroHeader";
import AuditoriaRegistro from "../../../../components/reusableComponents/AuditoriaRegistro";
import { useSessionData } from "../../../../hooks/useSessionData";
import { useForm } from "../../../../hooks/useForm";
import { useRegistroEditable } from "../../../../hooks/useRegistroEditable";
import { getToday, getFechaHoraActual } from "../../../../utils/helpers";
import { buildAuditoria } from "../../../../utils/auditoriaUtils";
import { SubmitDataService, VerifyTR } from "./controllerAntecedentesPatologicos";

const tabla = "antecedentes_patologicos_asistencial";

// Campos que el usuario puede editar en este formulario (para resaltar/revertir cambios).
// Los checkboxes (enfermedades/vacunas) e inputs temporales de "agregar quirúrgico" quedan
// fuera: InputCheckbox no soporta edited/onRevert y los qXxx no son campos propios del
// registro guardado (son el borrador de la fila a agregar).
const CAMPOS_EDITABLES = [
    "fecha",
    "etapaVida",
    "observaciones",
    "otrasPatologias",
    "reaccionAdversaMedicamentosEspecificar",
    "dosisVacunas",
    "padre",
    "madre",
    "hermanos",
    "hijos",
    "esposaConyuge",
    "carnetConadis",
    "user_medicoFirma",
    "nombre_medico",
];

// Enfermedades a marcar (Antecedentes Patológicos Personales)
const ENFERMEDADES = [
    ["acv", "ACV (Acc. Cerebro Vascular)"],
    ["alergias", "Alergias"],
    ["amigdalitisCronica", "Amigdalitis crónica"],
    ["amputacion", "Amputación"],
    ["anemia", "Anemia"],
    ["arritmiasCardiacas", "Arritmias cardiacas"],
    ["asma", "Asma"],
    ["bocio", "Bocio"],
    ["bronconeumonia", "Bronconeumonía"],
    ["bronquitisRepeticion", "Bronquitis a repetición"],
    ["cariesGingivitis", "Caries o gingivitis"],
    ["colecistitis", "Colecistitis"],
    ["columna", "Columna"],
    ["dermatitis", "Dermatitis"],
    ["diabetes", "Diabetes"],
    ["discopatias", "Discopatías"],
    ["dislipidemia", "Dislipidemia"],
    ["disenteria", "Disentería"],
    ["enfCorazon", "Enfermedades del corazón"],
    ["enfOculares", "Enf. Oculares"],
    ["enfPiel", "Enf de la Piel"],
    ["enfPsiquiatricas", "Enf Psiquiátricas"],
    ["enfPulmonares", "Enf Pulmonares"],
    ["enfReumatica", "Enf Reumática"],
    ["epilepsiaConvulsiones", "Epilepsia o convulsiones"],
    ["ets", "ETS"],
    ["faringitisCronica", "Faringitis crónica"],
    ["fiebreMalta", "Fiebre malta"],
    ["fiebreReumatica", "Fiebre Reumática"],
    ["fiebreTifoidea", "Fiebre tifoidea"],
    ["fobias", "Fobias"],
    ["forunculosis", "Forunculosis"],
    ["fracturas", "Fracturas"],
    ["gastritisCronica", "Gastritis crónica"],
    ["gonorrea", "Gonorrea"],
    ["gota", "Gota"],
    ["hemorroides", "Hemorroides"],
    ["hepatitis", "Hepatitis"],
    ["hernias", "Hernias"],
    ["hipertensionArterial", "Hipertensión Arterial"],
    ["ima", "IMA (Infarto agudo al miocardio)"],
    ["infUrinariasRepetidas", "Inf. Urinarias repetidas"],
    ["insuficienciaCardiaca", "Insuficiencia Cardíaca"],
    ["insuficienciaCoronariaCronica", "Insuficiencia Coronaria Crónica"],
    ["insuficienciaRenalCronica", "Insuficiencia Renal Crónica"],
    ["intoxicaciones", "Intoxicaciones"],
    ["litiasisUrinaria", "Litiasis Urinaria"],
    ["meningitis", "Meningitis"],
    ["migrana", "Migraña"],
    ["neoplasias", "Neoplasias"],
    ["neuritisRepeticion", "Neuritis a Repetición"],
    ["obesidad", "Obesidad"],
    ["onicomicosis", "Onicomicosis"],
    ["otitisMedia", "Otitis Media"],
    ["paludismoMalaria", "Paludismo o malaria"],
    ["parasitosisIntestinal", "Parasitosis Intestinal"],
    ["parotiditis", "Parotiditis"],
    ["pleuresia", "Pleuresia"],
    ["plumbismo", "Plumbismo"],
    ["poliomielitis", "Poliomielitis"],
    ["portadorMarcapaso", "Portador de Marcapaso"],
    ["presionAltaBaja", "Presión alta o baja"],
    ["protesisCardiacasValvulares", "Prótesis Cardiacas Valvulares"],
    ["quemaduras", "Quemaduras"],
    ["resfriosFrecuentes", "Resfríos frecuentes"],
    ["reumatismoRepeticion", "Reumatismo a repetición"],
    ["sarampion", "Sarampión"],
    ["sifilis", "Sífilis"],
    ["silicosis", "Silicosis"],
    ["sinusitisCronica", "Sinusitis crónica"],
    ["sordera", "Sordera"],
    ["tbc", "TBC"],
    ["tendinitis", "Tendinitis"],
    ["tifoidea", "Tifoidea"],
    ["tosConvulsiva", "Tos convulsiva"],
    ["trastornosNerviosos", "Trastornos Nerviosos"],
    ["traumatismoEncefalocraneano", "Traumatismo encefalocraneano"],
    ["tuberculosis", "Tuberculosis"],
    ["tumoresQuistes", "Tumores - quistes"],
    ["ulceraPeptica", "Ulcera péptica"],
    ["varicela", "Varicela"],
    ["varices", "Várices"],
    ["varicocele", "Varicocele"],
    ["vertigos", "Vértigos"],
    ["vih", "VIH"],
];

const VACUNAS_COL1 = [
    ["antitetanica", "Antitetánica"],
    ["fiebreAmarilla", "Fiebre Amarilla"],
    ["influenza", "Influenza"],
    ["hepatitisA", "Hepatitis A"],
    ["hepatitisB", "Hepatitis B"],
];

const VACUNAS_COL2 = [
    ["gripeInfluenza", "Gripe/Influenza"],
    ["neumococo", "Neumococo"],
    ["rabia", "Rabia"],
    ["papilomaHumano", "Papiloma Humano"],
    ["covidAntecedentePatologico", "COVID-19"],
];

const chunkColumns = (arr, columnas) => {
    const porColumna = Math.ceil(arr.length / columnas);
    return Array.from({ length: columnas }, (_, i) =>
        arr.slice(i * porColumna, (i + 1) * porColumna)
    );
};

const ENFERMEDADES_KEYS = ENFERMEDADES.map(([key]) => key);
const VACUNAS_KEYS = [...VACUNAS_COL1, ...VACUNAS_COL2].map(([key]) => key);

export default function AntecedentesPatologicos() {
    const today = getToday();
    const { token, userlogued, datosFooter, userName } = useSessionData();

    const initialFormState = {
        id: null,
        norden: "",
        fecha: today,

        // Campos de DatosPersonalesLaborales
        dni: "",
        nombres: "",
        apellidos: "",
        fechaNacimiento: "",
        lugarNacimiento: "",
        edad: "",
        sexo: "",
        estadoCivil: "",
        nivelEstudios: "",
        empresa: "",
        contrata: "",
        ocupacion: "",
        cargoDesempenar: "",

        etapaVida: "",
        observaciones: "",

        // 1. Antecedentes Patológicos Personales
        ...Object.fromEntries(ENFERMEDADES.map(([name]) => [name, false])),
        otrasPatologias: "",
        reaccionAdversaMedicamentos: false,
        reaccionAdversaMedicamentosEspecificar: "",

        // 2. Antecedentes Inmunológicos / Vacunas
        ...Object.fromEntries([...VACUNAS_COL1, ...VACUNAS_COL2].map(([name]) => [name, false])),
        dosisVacunas: "",

        // 3. Antecedentes Quirúrgicos
        qFecha: "",
        qHospital: "",
        qOperacion: "",
        qDiasHospitalizacion: "",
        qComplicaciones: "",
        quirurgicos: [],

        // 4. Antecedentes Patológicos Familiares
        padre: "",
        madre: "",
        hermanos: "",
        hijos: "",
        esposaConyuge: "",
        carnetConadis: "",

        // Especialista
        nombre_medico: userName,
        user_medicoFirma: userlogued,

        // Control de edición + auditoría (useRegistroEditable / buildAuditoria)
        tieneRegistro: false,
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
        handleCheckBoxChange,
        handleClear,
        handleClearnotO,
    } = useForm(initialFormState, { storageKey: "antecedentes_patologicos_asistencial" });

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

    const hayRegistroCargado = Boolean(form.nombres || form.dni);

    const auditoria = buildAuditoria(form, {
        usuarioActual: userlogued,
        fechaHoraActual: getFechaHoraActual(),
    });

    const enfermedadesColumnas = chunkColumns(ENFERMEDADES, 4);

    const handleSave = () => {
        SubmitDataService(
            form,
            token,
            userlogued,
            handleClear,
            tabla,
            datosFooter,
            ENFERMEDADES_KEYS,
            VACUNAS_KEYS
        );
    };

    const handleSearch = (e) => {
        if (e.key === "Enter") {
            handleClearnotO();
            VerifyTR(form.norden, token, setForm, today, ENFERMEDADES_KEYS, VACUNAS_KEYS);
        }
    };

    const handleAgregarQuirurgico = () => {
        if (!form.qFecha || !form.qHospital || !form.qOperacion) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Por favor, complete Año, Hospital y Operación.",
            });
            return;
        }
        setForm((prev) => ({
            ...prev,
            quirurgicos: [
                ...prev.quirurgicos,
                {
                    id: null,
                    fecha: prev.qFecha,
                    hospital: prev.qHospital,
                    operacion: prev.qOperacion,
                    diasHospitalizacion: prev.qDiasHospitalizacion,
                    complicaciones: prev.qComplicaciones,
                },
            ],
            qFecha: "",
            qHospital: "",
            qOperacion: "",
            qDiasHospitalizacion: "",
            qComplicaciones: "",
        }));
    };

    const handleEliminarQuirurgico = (index) => {
        if (camposDeshabilitados) return;
        setForm((prev) => ({
            ...prev,
            quirurgicos: prev.quirurgicos.filter((_, i) => i !== index),
        }));
    };

    return (
        <div className="space-y-3 px-4 max-w-[95%] xl:max-w-[90%] mx-auto">
            <AccionesRegistroHeader
                tieneRegistro={form.tieneRegistro}
                hayRegistroCargado={hayRegistroCargado}
                edicionHabilitada={edicionHabilitada}
                onHabilitarEdicion={habilitarEdicion}
                onLimpiar={handleClear}
            />

            <SectionFieldset legend="Datos de Registro" className="grid grid-cols-1 2xl:grid-cols-4 gap-3">
                <InputTextOneLine
                    label="N° Ticket"
                    name="norden"
                    value={form.norden}
                    onChange={handleChangeNumber}
                    onKeyUp={handleSearch}
                    labelWidth="120px"
                />
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
                    label="Ocupación"
                    name="ocupacion"
                    value={form.ocupacion}
                    disabled
                    className="2xl:col-span-2"
                    labelWidth="120px"
                />
            </SectionFieldset>

            <DatosPersonalesLaborales form={form} laborales={false} />

            <SectionFieldset legend="Antecedentes Patológicos Personales" collapsible>
                <p className="mb-3 font-semibold text-red-600">
                    Marcar todas las enfermedades que ha tenido o tiene
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-1 mb-4">
                    {enfermedadesColumnas.map((columna, i) => (
                        <div key={i} className="space-y-1">
                            {columna.map(([name, label]) => (
                                <InputCheckbox
                                    key={name}
                                    label={label}
                                    name={name}
                                    checked={form[name]}
                                    onChange={handleCheckBoxChange}
                                    disabled={camposDeshabilitados}
                                />
                            ))}
                        </div>
                    ))}
                </div>
                <div className="flex flex-wrap items-center gap-3 my-3">
                    <InputCheckbox
                        label="Reacción adversa a medicamentos"
                        name="reaccionAdversaMedicamentos"
                        checked={form.reaccionAdversaMedicamentos}
                        onChange={handleCheckBoxChange}
                        disabled={camposDeshabilitados}
                    />
                    <div className="flex-1 min-w-[250px]">
                        <InputTextOneLine
                            label="Especificar"
                            name="reaccionAdversaMedicamentosEspecificar"
                            value={form.reaccionAdversaMedicamentosEspecificar}
                            onChange={handleChange}
                            disabled={camposDeshabilitados || !form.reaccionAdversaMedicamentos}
                            edited={isFieldEdited("reaccionAdversaMedicamentosEspecificar")}
                            onRevert={() => revertField("reaccionAdversaMedicamentosEspecificar")}
                            labelWidth="90px"
                        />
                    </div>
                </div>
                <InputTextOneLine
                    label="Otras Patologías"
                    name="otrasPatologias"
                    value={form.otrasPatologias}
                    onChange={handleChange}
                    disabled={camposDeshabilitados}
                    edited={isFieldEdited("otrasPatologias")}
                    onRevert={() => revertField("otrasPatologias")}
                    labelWidth="150px"
                />
            </SectionFieldset>

            <SectionFieldset legend="Antecedentes Inmunológicos / Vacunas" collapsible>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-1">
                        {VACUNAS_COL1.map(([name, label]) => (
                            <InputCheckbox
                                key={name}
                                label={label}
                                name={name}
                                checked={form[name]}
                                onChange={handleCheckBoxChange}
                                disabled={camposDeshabilitados}
                            />
                        ))}
                    </div>
                    <div className="space-y-1">
                        {VACUNAS_COL2.map(([name, label]) => (
                            <InputCheckbox
                                key={name}
                                label={label}
                                name={name}
                                checked={form[name]}
                                onChange={handleCheckBoxChange}
                                disabled={camposDeshabilitados}
                            />
                        ))}
                    </div>
                </div>
                <InputTextOneLine
                    label="Dosis de vacunas COVID-19"
                    name="dosisVacunas"
                    value={form.dosisVacunas}
                    onChange={handleChangeNumber}
                    disabled={camposDeshabilitados || !form.covidAntecedentePatologico}
                    edited={isFieldEdited("dosisVacunas")}
                    onRevert={() => revertField("dosisVacunas")}
                    labelWidth="180px"
                    className="mt-3"
                />
            </SectionFieldset>

            <SectionFieldset legend="Antecedentes Quirúrgicos" collapsible>
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-3">
                    <InputTextOneLine label="Año" labelOnTop name="qFecha" value={form.qFecha} onChange={handleChange} disabled={camposDeshabilitados} />
                    <InputTextOneLine label="Hospital (Nombre - Lugar)" labelOnTop name="qHospital" value={form.qHospital} onChange={handleChange} disabled={camposDeshabilitados} />
                    <InputTextOneLine label="Operación" labelOnTop name="qOperacion" value={form.qOperacion} onChange={handleChange} disabled={camposDeshabilitados} />
                    <InputTextOneLine label="Días Hospitalización" labelOnTop name="qDiasHospitalizacion" value={form.qDiasHospitalizacion} onChange={handleChangeNumber} disabled={camposDeshabilitados} />
                    <InputTextOneLine label="Complicaciones" labelOnTop name="qComplicaciones" value={form.qComplicaciones} onChange={handleChange} disabled={camposDeshabilitados} />
                </div>
                <button
                    type="button"
                    onClick={handleAgregarQuirurgico}
                    disabled={camposDeshabilitados}
                    className="bg-[#059668] hover:bg-[#047857] text-white px-4 py-2 rounded flex items-center gap-2 mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <FontAwesomeIcon icon={faPlus} />
                    Agregar
                </button>
                <div className="border border-gray-200 rounded-lg overflow-hidden overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                        <thead className="bg-blue-100">
                            <tr>
                                <th className="px-3 py-2 text-left font-semibold border-b border-gray-300">Año</th>
                                <th className="px-3 py-2 text-left font-semibold border-b border-gray-300">Hospital (Nombre - Lugar)</th>
                                <th className="px-3 py-2 text-left font-semibold border-b border-gray-300">Operación</th>
                                <th className="px-3 py-2 text-left font-semibold border-b border-gray-300">Días</th>
                                <th className="px-3 py-2 text-left font-semibold border-b border-gray-300">Complicaciones</th>
                                <th className="px-3 py-2 text-left font-semibold border-b border-gray-300">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {form.quirurgicos.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-4 py-6 text-center text-gray-500 border-b border-gray-200">
                                        No hay antecedentes quirúrgicos registrados
                                    </td>
                                </tr>
                            ) : (
                                form.quirurgicos.map((reg, index) => (
                                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="px-3 py-2 border-r border-gray-200">{reg.fecha}</td>
                                        <td className="px-3 py-2 border-r border-gray-200">{reg.hospital}</td>
                                        <td className="px-3 py-2 border-r border-gray-200">{reg.operacion}</td>
                                        <td className="px-3 py-2 border-r border-gray-200">{reg.diasHospitalizacion}</td>
                                        <td className="px-3 py-2 border-r border-gray-200">{reg.complicaciones}</td>
                                        <td className="px-3 py-2">
                                            <button
                                                type="button"
                                                onClick={() => handleEliminarQuirurgico(index)}
                                                disabled={camposDeshabilitados}
                                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </SectionFieldset>

            <SectionFieldset legend="Antecedentes Patológicos Familiares" collapsible className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <InputTextOneLine
                    label="Padre - Especifique"
                    name="padre"
                    value={form.padre}
                    onChange={handleChange}
                    disabled={camposDeshabilitados}
                    edited={isFieldEdited("padre")}
                    onRevert={() => revertField("padre")}
                    labelWidth="180px"
                />
                <InputTextOneLine
                    label="Madre - Especifique"
                    name="madre"
                    value={form.madre}
                    onChange={handleChange}
                    disabled={camposDeshabilitados}
                    edited={isFieldEdited("madre")}
                    onRevert={() => revertField("madre")}
                    labelWidth="180px"
                />
                <InputTextOneLine
                    label="Hermanos - Especifique"
                    name="hermanos"
                    value={form.hermanos}
                    onChange={handleChange}
                    disabled={camposDeshabilitados}
                    edited={isFieldEdited("hermanos")}
                    onRevert={() => revertField("hermanos")}
                    labelWidth="180px"
                />
                <InputTextOneLine
                    label="Hijos - Especifique"
                    name="hijos"
                    value={form.hijos}
                    onChange={handleChange}
                    disabled={camposDeshabilitados}
                    edited={isFieldEdited("hijos")}
                    onRevert={() => revertField("hijos")}
                    labelWidth="180px"
                />
                <InputTextOneLine
                    label="Esposa/Cónyuge - Especifique"
                    name="esposaConyuge"
                    value={form.esposaConyuge}
                    onChange={handleChange}
                    disabled={camposDeshabilitados}
                    edited={isFieldEdited("esposaConyuge")}
                    onRevert={() => revertField("esposaConyuge")}
                    labelWidth="180px"
                />
                <InputTextOneLine
                    label="Carné CONADIS - Especifique"
                    name="carnetConadis"
                    value={form.carnetConadis}
                    onChange={handleChange}
                    disabled={camposDeshabilitados}
                    edited={isFieldEdited("carnetConadis")}
                    onRevert={() => revertField("carnetConadis")}
                    labelWidth="180px"
                />
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

            <BotonesForm
                form={form}
                handleSave={handleSave}
                saveLabel={form.tieneRegistro && edicionHabilitada ? "Guardar Cambios" : "Guardar"}
                handleEdit={habilitarEdicion}
                handleClear={handleClear}
                hideSave={form.tieneRegistro && !edicionHabilitada}
                hideEdit={!form.tieneRegistro || edicionHabilitada}
                hidePrint
            />
        </div>
    );
}
