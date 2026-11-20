import {
  handleSubirArchivo2,
  handleSubirArchivoMasivo,
  PrintHojaR,
  ReadArchivosForm,
  SubmitDataService,
  UpdateDataService,
  VerifyTR,
} from "./controllerRayosXColumna";
import { useSessionData } from "../../../../../hooks/useSessionData";
import { useForm } from "../../../../../hooks/useForm";
import { useRegistroEditable } from "../../../../../hooks/useRegistroEditable";
import BotonesForm from "../../../../../components/templates/BotonesForm";
import InputTextOneLine from "../../../../../components/reusableComponents/InputTextOneLine";
import SectionFieldset from "../../../../../components/reusableComponents/SectionFieldset";
import SearchButton from "../../../../../components/reusableComponents/SearchButton";
import RevertButton from "../../../../../components/reusableComponents/RevertButton";
import AccionesRegistroHeader from "../../../../../components/reusableComponents/AccionesRegistroHeader";
import AuditoriaRegistro from "../../../../../components/reusableComponents/AuditoriaRegistro";
import DatosPersonalesLaborales from "../../../../../components/templates/DatosPersonalesLaborales";
import { getToday, getFechaHoraActual } from "../../../../../utils/helpers";
import { buildAuditoria } from "../../../../../utils/auditoriaUtils";
import InputsRadioGroup from "../../../../../components/reusableComponents/InputsRadioGroup";
import InputTextArea from "../../../../../components/reusableComponents/InputTextArea";
import EmpleadoComboBox from "../../../../../components/reusableComponents/EmpleadoComboBox";
import ButtonsPDF from "../../../../../components/reusableComponents/ButtonsPDF";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import CIE10List from "../../../../../components/reusableComponents/CIE10List";

const tabla = "radiografia";

// Conclusión sugerida al elegir el tipo de radiografía
const CONCLUSIONES_POR_TIPO = {
  LUMBAR:
    "RADIOGRAFÍA DE COLUMNA LUMBAR AP-L SIN ALTERACIONES SIGNIFICATIVAS.",
  "LUMBOSACRA AP-L":
    "RADIOGRAFÍA DE COLUMNA LUMBOSACRA AP-L SIN ALTERACIONES SIGNIFICATIVAS.",
  DORSOLUMBAR:
    "CUERPOS VERTEBRALES DORSOLUMBARES EVALUADOS SIN ALTERACIONES SIGNIFICATIVAS.",
};

// Campos que el usuario puede editar en este formulario (para resaltar/revertir cambios).
const CAMPOS_EDITABLES = [
  "fechaExam",
  "tipoRadiografia",
  "informe",
  "conclusion",
  "conclusionCie10",
  "user_medicoFirma",
  "nombre_medico",
];

export default function RayosXColumna() {
  const today = getToday();
  const { token, userlogued, selectedSede, datosFooter, userName } = useSessionData();
  const initialFormState = {
    norden: "",
    fechaExam: today,
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

    tipoRadiografia: "DORSOLUMBAR",
    informe:
      "CUERPOS VERTEBRALES MUESTRAN MORFOLOGÍA NORMAL.\n" +
      "SACRO NO MUESTRA LESIONES EVIDENTES.\n" +
      "ESPACIOS INTERVERTEBRALES CONSERVADOS.\n" +
      "DENSIDAD ÓSEA ADECUADA.\n" +
      "LORDOSIS LUMBAR NORMAL.\n" +
      "CANAL RAQUÍDEO CON AMPLITUD NORMAL.",
    conclusion:
      "CUERPOS VERTEBRALES DORSOLUMBARES EVALUADOS SIN ALTERACIONES SIGNIFICATIVAS.",
    conclusionCie10: "",
    // Médico que Certifica //BUSCADOR
    nombre_medico: userName,
    user_medicoFirma: userlogued,

    SubirDoc: false,
    nomenclatura: "INFORME RADIOGRAFICO",
    nomenclatura2: "INFORME RADIOGRAFICO 2",

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
    handleRadioButton,
    handleChangeNumberDecimals,
    handleChangeSimple,
    handleClear,
    handleClearnotO,
    handlePrintDefault
  } = useForm(initialFormState, { storageKey: "rayosXColumna" });

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

  const [visualerOpen, setVisualerOpen] = useState(null)

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

  const handleSave = () => {
    SubmitDataService(form, token, userlogued, handleClear, tabla, datosFooter);
  };

  const handleEdit = () => {
    UpdateDataService(form, token, userlogued, handleClear, tabla, datosFooter);
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
    <div className="space-y-3 px-4 max-w-[90%] xl:max-w-[80%] mx-auto">
      <AccionesRegistroHeader
        tieneRegistro={form.tieneRegistro}
        hayRegistroCargado={hayRegistroCargado}
        edicionHabilitada={edicionHabilitada}
        onHabilitarEdicion={habilitarEdicion}
        onLimpiar={handleClear}
      />

      {/* Sección Información del Examen */}
      <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 2xl:grid-cols-3 gap-3">
        <div className="flex gap-x-3 w-full">
          <InputTextOneLine
            label="N° Orden"
            name="norden"
            value={form.norden}
            onChange={handleChangeNumberDecimals}
            onKeyUp={handleSearch}
            disabled={nordenDisabled}
            labelWidth="120px"
            className="w-full"
          />
          <SearchButton onClick={executeSearch} className="lg:hidden" />
        </div>
        <InputTextOneLine
          label="Fecha"
          name="fechaExam"
          type="date"
          value={form.fechaExam}
          onChange={handleChangeSimple}
          disabled={camposDeshabilitados}
          edited={isFieldEdited("fechaExam")}
          onRevert={() => revertField("fechaExam")}
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

      <SectionFieldset legend="Documentos de Radiografía" className="flex gap-2 w-full flex-col justify-center">
        <ButtonsPDF
          {...form.SubirDoc ? { handleSave: () => { handleSubirArchivo2(form, selectedSede, userlogued, token, form.nomenclatura) } } : {}}
          {...form.SubirDoc ? { handleRead: () => { ReadArchivosForm(form, setVisualerOpen, token) } } : {}}
        />
        <ButtonsPDF
          {...form.SubirDoc ? { handleSave: () => { handleSubirArchivo2(form, selectedSede, userlogued, token, form.nomenclatura2) } } : {}}
          {...form.SubirDoc ? { handleRead: () => { ReadArchivosForm(form, setVisualerOpen, token, form.nomenclatura2) } } : {}}
          handleMasivo={() => { handleSubirArchivoMasivo(form, selectedSede, userlogued, token, form.nomenclatura2) }}
          Nombre_1="Subir Archivo 2"
          Nombre_2="Ver Archivo 2"
        />
      </SectionFieldset>

      <DatosPersonalesLaborales form={form} />
      {/* Sección Radiografía de Columna */}
      <SectionFieldset legend="Radiografía de Columna" className="space-y-3">
        <InputsRadioGroup
          name="tipoRadiografia"
          value={form.tipoRadiografia}
          options={[
            { label: "Lumbar", value: "LUMBAR" },
            { label: "Lumbosacro", value: "LUMBOSACRA AP-L" },
            { label: "Dorsolumbar", value: "DORSOLUMBAR" },
          ]}
          disabled={camposDeshabilitados}
          // La conclusión sugerida cambia con el tipo: se revierten juntos.
          edited={isFieldEdited("tipoRadiografia")}
          onRevert={() => revertFields(["tipoRadiografia", "conclusion"])}
          onChange={(e, value) => {
            handleRadioButton(e, value);
            setForm((prev) => ({
              ...prev,
              conclusion: CONCLUSIONES_POR_TIPO[value] ?? prev.conclusion,
            }));
          }}
        />
        <InputTextArea
          label="Informe (El estudio radiográfico representado en incidencia frontal y lateral muestra) "
          name="informe"
          value={form.informe ?? ""}
          rows={6}
          onChange={handleChange}
          disabled={camposDeshabilitados}
          edited={isFieldEdited("informe")}
          onRevert={() => revertField("informe")}
        />
        <InputTextArea
          label="Conclusión"
          name="conclusion"
          value={form.conclusion ?? ""}
          rows={4}
          onChange={handleChange}
          disabled={camposDeshabilitados}
          edited={isFieldEdited("conclusion")}
          onRevert={() => revertField("conclusion")}
        />
        <div className="bg-green-200 p-3 rounded-xl flex items-start gap-2">
          <div className="flex-1">
            <CIE10List
              value={form.conclusionCie10}
              fieldName="conclusionCie10"
              label="Conclusiones CIE10"
              token={token}
              setForm={setForm}
              disabled={camposDeshabilitados}
            />
          </div>
          {isFieldEdited("conclusionCie10") && (
            <RevertButton onClick={() => revertField("conclusionCie10")} />
          )}
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
        handleSave={form.tieneRegistro && edicionHabilitada ? handleEdit : handleSave}
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
  );
}
