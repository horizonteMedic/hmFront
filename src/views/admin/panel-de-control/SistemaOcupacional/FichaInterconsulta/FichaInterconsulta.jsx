import { useState } from "react";
import { faUpload, faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Swal from "sweetalert2";
import InputTextArea from "../../../../components/reusableComponents/InputTextArea";
import InputTextAreaUpper from "../../../../components/reusableComponents/InputTextAreaUpper";
import InputTextOneLine from "../../../../components/reusableComponents/InputTextOneLine";
import { SelectField } from "../../../../components/reusableComponents/InputSelect";
import SectionFieldset from "../../../../components/reusableComponents/SectionFieldset";
import SearchButton from "../../../../components/reusableComponents/SearchButton";
import AccionesRegistroHeader from "../../../../components/reusableComponents/AccionesRegistroHeader";
import AuditoriaRegistro from "../../../../components/reusableComponents/AuditoriaRegistro";
import EmpleadoComboBox from "../../../../components/reusableComponents/EmpleadoComboBox";
import CIE10List from "../../../../components/reusableComponents/CIE10List";
import DatosPersonalesLaborales from "../../../../components/templates/DatosPersonalesLaborales";
import BotonesForm from "../../../../components/templates/BotonesForm";
import { useForm } from "../../../../hooks/useForm";
import { useRegistroEditable } from "../../../../hooks/useRegistroEditable";
import { useSessionData } from "../../../../hooks/useSessionData";
import { getToday, getFechaHoraActual, comprimirPdfAzureSiSuperaLimite, uint8ToBase64 } from "../../../../utils/helpers";
import { buildAuditoria } from "../../../../utils/auditoriaUtils";
import { formatearFechaCorta } from "../../../../utils/formatDateUtils";
import { LoadingDefault } from "../../../../utils/functionUtils";
import { SubmitData } from "../../../../utils/apiHelpers";
import { PrintHojaR, SubmitDataService, VerifyTR } from "./controllerFichaInterconsulta";
import { SubirInterconsulta, ReadArchivos } from "./model";

const tabla = "ficha_interconsulta"
const today = getToday();

// Campos que el usuario puede editar en este formulario (para resaltar/revertir cambios).
const CAMPOS_EDITABLES = [
    "fechaExamen",
    "especialidad",
    "motivo",
    "hallazgo",
    "diagnostico",
    "tratamiento",
    "conclusionesCie10",
    "fechaReevaluacion",
    "user_medicoFirma",
    "nombre_medico",
];

const Especialidades = [
    "Neurología del Sueño",
    "Neurocirugia",
    "Alergología",
    "Neurología",
    "Cirugía General",
    "Cirugía Cardiovascular",
    "Cirugía Cabeza y Cuello",
    "Gastroenterología",
    "Fisiatria",
    "Medicina Fisica",
    "Oncologia",
    "Cirugía Oncológica",
    "Hematología",
    "Ginecologia y Obstetricia",
    "Oftalmología",
    "Cardiología",
    "Neumología",
    "Medicina Interna",
    "Endocrinología",
    "Traumatología",
    "Reumatología",
    "Nutrición",
    "Otorrinolaringologia",
    "Área Medica",
    "Laboratorio",
    "Imagenologia",
    "Audiometria",
    "Dermatología",
    "Agudeza Visual",
    "Odontologia",
    "Urologia",
    "Nefrologia",
    "Psiquiatría",
    "Psicología",
    "Medicina Física y Rehabilitación",
    "Emergencia y Desastres",
    "Asistencia Social",
    "Espirometria"
]

// Opciones del selector, ordenadas alfabéticamente respetando tildes (el valor guardado va en mayúsculas).
const OPCIONES_ESPECIALIDAD = [...Especialidades]
    .sort((a, b) => a.localeCompare(b))
    .map((option) => ({ value: option.toUpperCase(), label: option }));

export default function FichaInterconsulta() {

    const { token, userlogued, selectedSede, datosFooter, userCompleto, userName, hora } =
        useSessionData();
    const [visualerOpen, setVisualerOpen] = useState(null)
    const Initialform = {
        norden: "",
        fechaExamen: today,
        nombreExamen: "",
        especialidad: "",
        areaPaciente: "",
        cargoPaciente: "",
        conclusionesCie10: "",
        //Datos Usuario
        dniPaciente: "",
        dniUser: userCompleto?.datos?.dni_user,
        nombres: "",
        sexo: "",
        fechaNacimientoPaciente: "",
        lugarNacimientoPaciente: "",
        estadoCivilPaciente: "",
        nivelEstudioPaciente: "",
        edadPaciente: "",
        //Funciones Vitales
        frecuenciaCardiaca: "",
        PA: "",
        frecuenciaRespiratoriaTriaje: "",
        imcTriaje: "",
        saturacionOxigenoTriaje: "",
        temperatura: "",
        peso: "",
        tallaTriaje: "",

        contrata: "",
        empresa: "",
        //Medico
        nombre_medico: userName,
        user_medicoFirma: userlogued,

        cmpUsuario: "",
        direccionClinica: "",
        //Cuadros
        motivo: "SE SOLICITA EVALUACION POR ESPECIALIDAD PARA DIAGNOSTICO, TRATAMIENTO, CONTROLES POSTERIORES Y DEFINIR APTITUD PARA LABORAR",
        hallazgo: "",
        diagnostico: "",
        tratamiento: "",
        apto: false,
        SubirDoc: false,
        nomenclatura: "",
        orden: "",
        fechaReevaluacion: "",

        // Control de UI: false = mostrar Guardar (nuevo) / true = mostrar Editar (ya existe)
        tieneRegistro: false,

        // Auditoría
        userRegistro: "",
        fechaRegistro: "",
        usuarioActualizacion: "",
        fechaActualizacion: "",
    }

    const { form, setForm, handleChangeSimple, handleChange, handleClear, handleClearnotO, handleChangeNumber, handlePrintDefault } = useForm(Initialform, { storageKey: "ficha_interconsultas_form" })

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

    // Props comunes de un campo de texto.
    const campo = (name, onChange = handleChange) => ({
        name,
        value: form[name],
        onChange,
        disabled: camposDeshabilitados,
        edited: isFieldEdited(name),
        onRevert: () => revertField(name),
    });

    // ===== Búsqueda =====
    // Una orden puede tener varias interconsultas (una por especialidad): si ya tiene registros se elige cuál abrir
    // (o crear una nueva); si no tiene ninguno se carga el paciente con la especialidad elegida en el selector.
    const executeSearch = () => {
        const especialidad = form.especialidad;
        handleClearnotO();
        VerifyTR(form.norden, especialidad, tabla, token, setForm, selectedSede);
    };

    const handleSearch = (e) => {
        if (!e || e.key === "Enter") {
            executeSearch();
        }
    };

    const handlePrintNordenChange = (e) => {
        const value = e.target.value;
        if (!/^\d*$/.test(value)) return; // solo dígitos

        const hayDatosCargados = Boolean(form.nombres || form.dniPaciente || form.tieneRegistro);
        if (hayDatosCargados && value !== form.norden) {
            setForm({ ...Initialform, norden: value });
        } else {
            setForm((f) => ({ ...f, norden: value }));
        }
    };

    // ===== Impresión =====
    const handlePrint = () => {
        handlePrintDefault(() => {
            PrintHojaR(form.norden, token, tabla, datosFooter);
        });
    };

    // ===== Guardar =====
    // Un solo endpoint hace de alta y de edición (se distingue por `codigoFichaInterconsulta`): no se puede validar con
    // "ya existe un registro para la orden" porque una orden tiene una interconsulta por especialidad.
    const handleSave = () => {
        if (!form.especialidad) return Swal.fire("Error", "Debe seleccionar al menos una especialidad", "error")
        SubmitDataService(form, token, userlogued, handleClear, tabla, datosFooter);
    };

    const handleSubirArchivo = async () => {
        const { value: file } = await Swal.fire({
            title: "Selecciona un archivo PDF",
            input: "file",
            inputAttributes: {
                accept: "application/pdf", // solo PDF
                "aria-label": "Sube tu archivo en formato PDF"
            },
            showCancelButton: true,
            confirmButtonText: "Subir",
            cancelButtonText: "Cancelar",
            inputValidator: (file) => {
                if (!file) return "Debes seleccionar un archivo.";
                if (file.type !== "application/pdf") return "Solo se permiten archivos PDF.";
            },
        });

        if (file) {
            // Puedes convertirlo a Base64 si lo necesitas
            const reader = new FileReader();
            reader.onload = async (e) => {
                LoadingDefault("Subiendo documento")
                const base64WithoutHeader = e.target.result.split(',')[1];
                let pdfBytes = Uint8Array.from(atob(base64WithoutHeader), c => c.charCodeAt(0));

                // Comprime con Azure solo si el archivo pesa más de 5MB
                pdfBytes = await comprimirPdfAzureSiSuperaLimite(pdfBytes, file.name);

                const base64Final = uint8ToBase64(new Uint8Array(pdfBytes));

                const datos = {
                    nombre: file.name,
                    sede: selectedSede,
                    base64: base64Final,
                    nomenclatura: form.nomenclatura,
                    norden: form.norden
                };
                const response = await SubirInterconsulta(datos, userlogued, token);
                if (response.id === 1) {
                    const body = {
                        "codigoFichaInterconsulta": form.codigoFichaInterconsulta,
                        "nomenclatura": form.nomenclatura
                    }
                    await SubmitData(body, '/api/v01/ct/fichaInterconsulta/actualizarNomenclaturaFichaInterconsulta', token)
                    Swal.fire("Exito", "Archivo Subido con exto", "success")
                } else {
                    Swal.fire("Error", "No se pudo subir", "error")
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const ReadArchivosForm = async () => {
        LoadingDefault("Cargando Interconsulta")
        ReadArchivos(form.norden, form.nomenclatura)
            .then(response => {
                if (response.id === 1) {
                    setVisualerOpen(response)
                    Swal.close()
                } else {
                    Swal.fire("Error", "No Existe reporte para este Numero de Orden", "error")
                }
            })
            .catch(error => {
                Swal.fire("Error", "Ocurrio un Error al visualizar la interconsulta", "error")
                throw new Error('Network response was not ok.', error);
            })
    }

    // Fecha de reevaluación a partir de la fecha del examen
    const sumarMeses = (meses) => {
        const d = new Date(form.fechaExamen + "T00:00:00");
        d.setMonth(d.getMonth() + meses);
        setForm(prev => ({ ...prev, fechaReevaluacion: d.toISOString().split('T')[0] }));
    };

    const hayRegistroCargado = Boolean(form.nombres || form.dniPaciente);

    // Adaptador: DatosPersonalesLaborales espera sus propios nombres de campo.
    const datosPaciente = {
        nombres: form.nombres,
        edad: form.edadPaciente,
        sexo: form.sexo,
        dni: form.dniPaciente,
        fechaNacimiento: formatearFechaCorta(form.fechaNacimientoPaciente ?? ""),
        lugarNacimiento: form.lugarNacimientoPaciente,
        estadoCivil: form.estadoCivilPaciente,
        nivelEstudios: form.nivelEstudioPaciente,
        empresa: form.empresa,
        contrata: form.contrata,
        ocupacion: form.areaPaciente,
        cargoDesempenar: form.cargoPaciente,
    };

    // La especialidad cargada puede no estar en la lista fija: se agrega para no perderla en el selector.
    const opcionesEspecialidad =
        form.especialidad && !OPCIONES_ESPECIALIDAD.some((o) => o.value === form.especialidad)
            ? [...OPCIONES_ESPECIALIDAD, { value: form.especialidad, label: form.especialidad }]
            : OPCIONES_ESPECIALIDAD;

    // Registro existente: el reporte solo trae el usuario y la fecha (sin hora) de registro, y esa fecha no puede
    // pasar por formatearFechaHora (la tomaría como UTC y mostraría el día anterior). Nuevo: creación en vivo.
    const auditoria = form.tieneRegistro
        ? {
            fechaCreacion: formatearFechaCorta(form.fechaRegistro ?? ""),
            usuarioRegistro: form.userRegistro,
        }
        : buildAuditoria(form, { usuarioActual: userlogued, fechaHoraActual: getFechaHoraActual() });

    return (
        <div className="space-y-3 px-4 max-w-[95%] mx-auto pb-6">
            <AccionesRegistroHeader
                tieneRegistro={form.tieneRegistro}
                hayRegistroCargado={hayRegistroCargado}
                edicionHabilitada={edicionHabilitada}
                onHabilitarEdicion={habilitarEdicion}
                onLimpiar={handleClear}
            />

            {/* ===== SECCIÓN: INFORMACIÓN DEL EXAMEN ===== */}
            <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-3">
                <div className="flex gap-x-3 w-full">
                    <InputTextOneLine
                        label="N° Orden"
                        name="norden"
                        value={form.norden}
                        onKeyUp={handleSearch}
                        onChange={handleChangeNumber}
                        disabled={hayRegistroCargado}
                        labelWidth="110px"
                        className="w-full"
                    />
                    <SearchButton onClick={executeSearch} className="lg:hidden" />
                </div>
                <InputTextOneLine
                    label="Fecha de Examen"
                    type="date"
                    labelWidth="110px"
                    {...campo("fechaExamen", handleChangeSimple)}
                />
                <SelectField
                    label="Especialidad"
                    inline
                    labelWidth="110px"
                    name="especialidad"
                    value={form.especialidad}
                    onChange={handleChangeSimple}
                    options={opcionesEspecialidad}
                    placeholder="Seleccione una Especialidad..."
                    disabled={camposDeshabilitados}
                    edited={isFieldEdited("especialidad")}
                    onRevert={() => revertField("especialidad")}
                />
                <InputTextOneLine
                    label="Nombre Examen"
                    name="nombreExamen"
                    value={form.nombreExamen}
                    disabled
                    labelWidth="110px"
                />
                <InputTextOneLine
                    label="Hora"
                    name="hora"
                    value={hora}
                    disabled
                    labelWidth="110px"
                />
                {/* Una orden tiene una interconsulta por especialidad: con una cargada se vuelve a la lista. */}
                {hayRegistroCargado && form.norden && (
                    <div className="flex items-center">
                        <button
                            type="button"
                            onClick={executeSearch}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-base px-4 py-1.5 rounded"
                        >
                            Cambiar de especialidad
                        </button>
                    </div>
                )}
            </SectionFieldset>

            {/* ===== SECCIÓN: DATOS PERSONALES Y LABORALES ===== */}
            <DatosPersonalesLaborales form={datosPaciente} />

            {/* ===== SECCIÓN: DOCUMENTO (solo con registro existente) ===== */}
            {form.SubirDoc && (
                <SectionFieldset legend="Documento de Interconsulta" className="flex flex-wrap justify-center items-center gap-3">
                    <button type="button" onClick={handleSubirArchivo} className="bg-emerald-600 hover:bg-emerald-700 text-white text-base px-6 py-2 rounded flex items-center gap-2">
                        <FontAwesomeIcon icon={faUpload} />
                        Subir Archivo
                    </button>
                    <button type="button" onClick={ReadArchivosForm} className="bg-emerald-600 hover:bg-emerald-700 text-white text-base px-6 py-2 rounded flex items-center gap-2">
                        <FontAwesomeIcon icon={faDownload} />
                        Ver Archivo
                    </button>
                </SectionFieldset>
            )}

            {/* ===== SECCIÓN: FUNCIONES VITALES (solo lectura: datos de Triaje) ===== */}
            <SectionFieldset legend="Funciones Vitales" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-8 gap-3 items-center">
                <div className="flex items-center gap-1">
                    <InputTextOneLine label="F.C" labelWidth="30px" disabled value={form.frecuenciaCardiaca} className="min-w-[90px] w-full !gap-1" name="fc" />
                    <span className="text-sm text-gray-600">x min</span>
                </div>
                <div className="flex items-center gap-1">
                    <InputTextOneLine label="P.A" labelWidth="30px" disabled value={form.PA} className="min-w-[90px] w-full !gap-1" name="pa" />
                    <span className="text-sm text-gray-600">mmHg</span>
                </div>
                <div className="flex items-center gap-1">
                    <InputTextOneLine label="F.R" labelWidth="30px" disabled value={form.frecuenciaRespiratoriaTriaje} className="min-w-[90px] w-full !gap-1" name="fr" />
                    <span className="text-sm text-gray-600">x min</span>
                </div>
                <InputTextOneLine label="IMC" labelWidth="30px" disabled value={form.imcTriaje} className="min-w-[90px] w-full !gap-1" name="imc" />
                <InputTextOneLine label="Sat. O°" labelWidth="45px" disabled value={form.saturacionOxigenoTriaje} className="min-w-[90px] w-full !gap-1" name="sat" />
                <InputTextOneLine label="T°" labelWidth="25px" disabled value={form.temperatura} className="min-w-[90px] w-full !gap-1" name="temperatura" />
                <div className="flex items-center gap-1">
                    <InputTextOneLine label="Peso" labelWidth="40px" disabled value={form.peso} className="min-w-[90px] w-full !gap-1" name="peso" />
                    <span className="text-sm text-gray-600">Kg</span>
                </div>
                <div className="flex items-center gap-1">
                    <InputTextOneLine label="Talla" labelWidth="45px" disabled value={form.tallaTriaje} className="min-w-[90px] w-full !gap-1" name="talla" />
                    <span className="text-sm text-gray-600">m</span>
                </div>
            </SectionFieldset>

            {/* ===== SECCIÓN: DOCTOR ===== */}
            <SectionFieldset legend="Doctor">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                    <EmpleadoComboBox
                        value={form.nombre_medico}
                        label="Doctor Asignado"
                        form={form}
                        onChange={handleChangeSimple}
                        disabled={camposDeshabilitados}
                        edited={isMedicoEdited}
                        onRevert={revertMedico}
                    />
                </div>
            </SectionFieldset>

            {/* ===== SECCIÓN: INTERCONSULTA ===== */}
            <SectionFieldset legend="Interconsulta" className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
                <div className="space-y-4">
                    <InputTextArea label="Motivo de Interconsulta" rows={6} {...campo("motivo")} />
                    <InputTextAreaUpper
                        label="Diagnóstico"
                        name="diagnostico"
                        value={form.diagnostico}
                        rows={6}
                        disabled={camposDeshabilitados}
                        edited={isFieldEdited("diagnostico")}
                        onRevert={() => revertFields(["diagnostico", "conclusionesCie10"])}
                        onChange={(upper) => {
                            const cie10Lines = upper
                                .split("\n")
                                .filter(l => /^CIE 10:/i.test(l.trim()));
                            const nuevoCie10 = cie10Lines.join("\n");
                            setForm((d) => ({
                                ...d,
                                diagnostico: upper,
                                ...(nuevoCie10 !== d.conclusionesCie10 && { conclusionesCie10: nuevoCie10 }),
                            }));
                        }}
                    />
                    <div className="bg-green-200 p-3 rounded-xl w-full">
                        <CIE10List
                            value={form.conclusionesCie10}
                            fieldName="conclusionesCie10"
                            label="Conclusiones CIE10"
                            token={token}
                            setForm={setForm}
                            setAdditionalForm={setForm}
                            additionalFieldName="diagnostico"
                            additionalDelimiter={"\n"}
                            disabled={camposDeshabilitados}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <InputTextArea label="Hallazgos Relevantes" rows={6} {...campo("hallazgo")} />
                    <InputTextArea label="Tratamiento" rows={6} {...campo("tratamiento")} />

                    {/* Fecha Reevaluación */}
                    <div className="flex flex-col gap-2 p-3 border rounded-lg">
                        <span className="font-semibold">Fecha Reevaluación</span>
                        <div className="flex items-center gap-2 flex-wrap">
                            <InputTextOneLine
                                type="date"
                                {...campo("fechaReevaluacion", handleChangeSimple)}
                                className="w-auto"
                            />
                            <button
                                type="button"
                                disabled={camposDeshabilitados}
                                onClick={() => sumarMeses(1)}
                                className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs px-3 py-1 rounded"
                            >
                                + 1 mes
                            </button>
                            <button
                                type="button"
                                disabled={camposDeshabilitados}
                                onClick={() => sumarMeses(3)}
                                className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs px-3 py-1 rounded"
                            >
                                + 3 meses
                            </button>
                            <button
                                type="button"
                                disabled={camposDeshabilitados}
                                onClick={() => setForm(prev => ({ ...prev, fechaReevaluacion: "" }))}
                                className="bg-gray-400 hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs px-3 py-1 rounded"
                            >
                                Limpiar
                            </button>
                        </div>
                    </div>
                </div>
            </SectionFieldset>

            {/* ===== SECCIÓN: AUDITORÍA DEL REGISTRO ===== */}
            {hayRegistroCargado && (
                <AuditoriaRegistro
                    mostrarEdicion={false}
                    fechaCreacion={auditoria.fechaCreacion}
                    usuarioRegistro={auditoria.usuarioRegistro}
                />
            )}

            {/* ===== BOTONES DE ACCIÓN ===== */}
            <BotonesForm
                form={form}
                onNordenChange={handlePrintNordenChange}
                handleSave={handleSave}
                saveLabel={form.tieneRegistro && edicionHabilitada ? "Guardar Cambios" : "Guardar"}
                handleEdit={habilitarEdicion}
                handleClear={handleClear}
                handlePrint={handlePrint}
                hideSave={form.tieneRegistro && !edicionHabilitada}
                hideEdit={!form.tieneRegistro || edicionHabilitada}
            />

            {visualerOpen && (
                <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg overflow-hidden overflow-y-auto shadow-xl w-[700px] h-[auto] max-h-[90%]">
                        <div className="px-4 py-2 naranjabackgroud flex justify-between">
                            <h2 className="text-lg font-bold color-blanco">{visualerOpen.nombreArchivo}</h2>
                            <button onClick={() => setVisualerOpen(null)} className="text-xl text-white" style={{ fontSize: '23px' }}>×</button>
                        </div>
                        <div className="px-6 py-4  overflow-y-auto flex h-auto justify-center items-center">
                            <iframe src={`https://docs.google.com/gview?url=${encodeURIComponent(`${visualerOpen.mensaje}`)}&embedded=true`} type="application/pdf" className="h-[500px] w-[500px] max-w-full" />
                        </div>
                        <div className="flex justify-center">
                            <a href={visualerOpen.mensaje} download={visualerOpen.nombreArchivo} className="azul-btn font-bold py-2 px-4 rounded mb-4">
                                <FontAwesomeIcon icon={faDownload} className="mr-2" /> Descargar
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
