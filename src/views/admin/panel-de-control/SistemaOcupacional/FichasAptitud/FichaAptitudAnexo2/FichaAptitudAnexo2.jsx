import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint, faUpload } from "@fortawesome/free-solid-svg-icons";
import {
  InputTextOneLine,
  InputTextArea,
  InputCheckbox,
  InputsRadioGroup,
  SectionFieldset,
  SearchButton
} from "../../../../../components/reusableComponents/ResusableComponents";
import { useSessionData } from "../../../../../hooks/useSessionData";
import { getToday, getFechaHoraActual } from "../../../../../utils/helpers";
import { buildAuditoria } from "../../../../../utils/auditoriaUtils";
import { useForm } from "../../../../../hooks/useForm";
import { useRegistroEditable } from "../../../../../hooks/useRegistroEditable";
import {
  DURACION_FA2_OPCIONES,
  RESTRICCIONES_FA2,
  RESTRICCIONES_FA2_NAMES,
  RESTRICCIONES_FA2_DESMARCADAS,
  armarRestriccionesFA2,
  getFA2FechaVencimiento,
} from "./FA2FormDefaults";
import { PrintHojaR, PrintHojaR2, SubmitDataService, UpdateDataService, VerifyTR } from "./controllerFichaAptitudAnexo2";
import EmpleadoComboBox from "../../../../../components/reusableComponents/EmpleadoComboBox";
import AccionesRegistroHeader from "../../../../../components/reusableComponents/AccionesRegistroHeader";
import AuditoriaRegistro from "../../../../../components/reusableComponents/AuditoriaRegistro";
import RevertButton from "../../../../../components/reusableComponents/RevertButton";
import DatosPersonalesLaborales from "../../../../../components/templates/DatosPersonalesLaborales";
import BotonesForm from "../../../../../components/templates/BotonesForm";
import { useState } from "react";
import CargaMasivaFA2 from "./CargaMasivaFA2/CargaMasivaFA2";

const tabla = "aptitud_medico_ocupacional_agro"
const tabla2 = "resumen_medico_poderosa_anexo02"

// Campos acoplados: se revierten en conjunto.
// - Restricciones: el texto se genera a partir de las casillas.
// - Aptitud: al cambiarla se reinician las restricciones.
// - Vigencia: la fecha de vencimiento se calcula con la fecha y la duración.
const CAMPOS_RESTRICCIONES = [...RESTRICCIONES_FA2_NAMES, "ninguno", "restricciones"];
const CAMPOS_APTITUD = ["apto", ...CAMPOS_RESTRICCIONES];
const CAMPOS_VIGENCIA = ["fechaValido", "duracionAnios", "fechaVencimiento"];

// Campos que el usuario puede editar en este formulario (para resaltar/revertir cambios).
const CAMPOS_EDITABLES = [
  "conclusiones",
  "recomendaciones",
  ...CAMPOS_APTITUD,
  ...CAMPOS_VIGENCIA,
  "user_medicoFirma",
  "nombre_medico",
];

export default function FichaAptitudAnexo2() {
  const today = getToday();

  const { token, userlogued, selectedSede, datosFooter, userName, hora } = useSessionData();
  const [modalCargaMasiva, setModalCargaMasiva] = useState(false);

  const initialFormState = {
    // Datos básicos
    norden: "",
    tipoExamen: "",

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

    conclusiones: "",
    apto: "APTO",
    fechaValido: today,
    duracionAnios: "1",
    fechaVencimiento: getFA2FechaVencimiento(today, "1"),
    recomendaciones: "",
    restricciones: "NINGUNO.",

    // Checkboxes de recomendaciones
    ...RESTRICCIONES_FA2_DESMARCADAS,
    ninguno: true,

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
    handleChangeNumberDecimals,
    handleRadioButton,
    handleChangeSimple,
    handleClear,
    handleClearnotO,
    handlePrintDefault,
  } = useForm(initialFormState, { storageKey: "fichaAptitudAnexo2" });

  const {
    edicionHabilitada,
    habilitarEdicion,
    camposDeshabilitados,
    isFieldEdited,
    revertFields,
  } = useRegistroEditable(form, setForm, { tieneRegistro: form.tieneRegistro, camposEditables: CAMPOS_EDITABLES });

  // Propiedades comunes de un campo editable: bloqueo, resaltado al modificarlo y botón de revertir.
  // `acoplados` son los campos que se revierten junto con él (por defecto, solo él).
  const editable = (name, acoplados = [name]) => ({
    disabled: camposDeshabilitados,
    edited: isFieldEdited(name),
    onRevert: () => revertFields(acoplados),
  });

  // El médico se compone de 2 campos (id de firma + nombre): se detecta el cambio por el id y se
  // revierten ambos en conjunto.
  const isMedicoEdited = isFieldEdited("user_medicoFirma");
  const revertMedico = () => revertFields(["user_medicoFirma", "nombre_medico"]);

  const handleSave = () => {
    SubmitDataService(form, token, userlogued, handleClear, tabla, datosFooter);
  };

  const handleUpdate = () => {
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
      PrintHojaR(form.norden, token, tabla, datosFooter);
    });
  };

  const handlePrint2 = () => {
    handlePrintDefault(() => {
      PrintHojaR2(form.norden, token, tabla2, datosFooter);
    });
  };

  const auditoria = buildAuditoria(form, {
    usuarioActual: userlogued,
    fechaHoraActual: getFechaHoraActual(),
  });

  // Función para manejar cambios en checkboxes de restricciones
  const handleRestriccionesChange = (name, checked) => {
    setForm(prev => {
      if (name === "ninguno") {
        // Si se marca "NINGUNO", se desmarcan todos los otros
        return checked
          ? { ...prev, ...RESTRICCIONES_FA2_DESMARCADAS, ninguno: true, restricciones: "NINGUNO." }
          : { ...prev, ninguno: false };
      }
      // Si se marca cualquier otro, se desmarca "NINGUNO"; las restricciones se regeneran con las marcadas
      const newForm = { ...prev, [name]: checked, ...(checked && { ninguno: false }) };
      return { ...newForm, restricciones: armarRestriccionesFA2(newForm) };
    });
  };

  const hayRestriccionMarcada = RESTRICCIONES_FA2_NAMES.some((name) => form?.[name]);
  const restriccionesEditadas = [...RESTRICCIONES_FA2_NAMES, "ninguno"].some(isFieldEdited);

  const checkboxesRestriccion = RESTRICCIONES_FA2.map(({ name, label }) => (
    <InputCheckbox
      key={name}
      name={name}
      checked={form?.[name]}
      onChange={(e) => handleRestriccionesChange(name, e.target.checked)}
      disabled={camposDeshabilitados || form?.ninguno}
      className={form?.ninguno ? "opacity-50 text-gray-400" : ""}
      label={label}
    />
  ));

  return (
    <div className="mx-auto max-w-[90%] lg:max-w-[80%] grid gap-y-3 gap-x-4 py-4">
      <AccionesRegistroHeader
        tieneRegistro={form.tieneRegistro}
        hayRegistroCargado={hayRegistroCargado}
        edicionHabilitada={edicionHabilitada}
        onHabilitarEdicion={habilitarEdicion}
        onLimpiar={handleClear}
      />

      <SectionFieldset legend="Información del Examen" className="grid xl:grid-cols-3 gap-y-3 gap-x-4">
        <div className="flex gap-x-3 w-full">
          <InputTextOneLine
            label="N° Orden"
            name="norden"
            value={form?.norden}
            onChange={handleChangeNumber}
            onKeyUp={handleSearch}
            disabled={hayRegistroCargado}
            className="w-full"
          />
          <SearchButton onClick={executeSearch} className="lg:hidden" />
        </div>
        <InputTextOneLine
          label="Tipo de Examen"
          name="tipoExamen"
          value={form?.tipoExamen}
          disabled
        />
        <InputTextOneLine
          label="Hora"
          name="hora"
          value={hora}
          inputClassName="font-bold"
          disabled
        />
        <button
          type="button"
          onClick={() => setModalCargaMasiva(true)}
          className=" px-4 mx-auto mb-3 verde-btn py-2 rounded flex items-center justify-center gap-2"
        >
          <FontAwesomeIcon icon={faUpload} /> Carga Masiva
        </button>
      </SectionFieldset>

      {/* Información del paciente */}
      <DatosPersonalesLaborales form={form} />

      {/* Conclusiones y Recomendaciones en dos columnas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
        {/* Columna 1: Conclusiones */}
        <div className="space-y-3">
          <SectionFieldset legend="Conclusiones y Recomendaciones" className="grid gap-x-4 gap-y-3">
            <InputTextArea
              label="Conclusiones"
              name="conclusiones"
              value={form?.conclusiones}
              onChange={handleChange}
              rows={6}
              className="mb-3"
              {...editable("conclusiones")}
            />
            <InputsRadioGroup
              label="Aptitud"
              name="apto"
              value={form?.apto}
              labelOnTop
              onChange={(e, value) => {
                if (value == "APTO") {
                  setForm(prev => ({
                    ...prev,
                    ...RESTRICCIONES_FA2_DESMARCADAS,
                    restricciones: "NINGUNO.",
                    ninguno: true,
                  }));
                }
                else if (value == "APTO CON RESTRICCION" || value == "NO APTO") {
                  setForm(prev => ({
                    ...prev,
                    restricciones: prev.restricciones == "NINGUNO." ? "" : prev.restricciones,
                    ninguno: false,
                  }));
                }
                handleRadioButton(e, value)
              }}
              vertical
              options={[
                { label: "APTO (para el puesto en el que trabaja o postula)", value: "APTO" },
                { label: "APTO CON RESTRICCIÓN (para el puesto en el que trabaja o postula)", value: "APTO CON RESTRICCION" },
                { label: "NO APTO (para el puesto en el que trabaja o postula)", value: "NO APTO" },
                { label: "CON OBSERVACION", value: "CON OBSERVACION" },
                { label: "EVALUADO", value: "EVALUADO" },
              ]}
              {...editable("apto", CAMPOS_APTITUD)}
            />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-4 gap-y-3 mt-1">
              <InputTextOneLine
                label="Fecha"
                name="fechaValido"
                type="date"
                value={form?.fechaValido}
                onChange={(e) => {
                  const { value } = e.target;
                  setForm(prev => ({ ...prev, fechaVencimiento: getFA2FechaVencimiento(value, prev.duracionAnios) }));
                  handleChangeSimple(e)
                }}
                {...editable("fechaValido", CAMPOS_VIGENCIA)}
              />
              {form?.apto == "NO APTO" ? (
                <InputTextOneLine
                  label="Fecha Venc."
                  name="fechaVencimientoText"
                  value="NO APLICA"
                  disabled
                />
              ) : (
                <InputTextOneLine
                  label="Fecha Venc."
                  name="fechaVencimiento"
                  type="date"
                  value={form?.fechaVencimiento}
                  disabled
                />
              )}
              <InputsRadioGroup
                label="Duración"
                name="duracionAnios"
                value={form?.duracionAnios}
                onChange={(e, value) => {
                  setForm(prev => ({
                    ...prev,
                    duracionAnios: value,
                    fechaVencimiento: getFA2FechaVencimiento(prev.fechaValido, value),
                  }));
                }}
                options={DURACION_FA2_OPCIONES}
                className="xl:col-span-2"
                {...editable("duracionAnios", CAMPOS_VIGENCIA)}
                disabled={camposDeshabilitados || form?.apto == "NO APTO"}
              />
            </div>
            <InputTextArea
              label="Recomendaciones"
              name="recomendaciones"
              value={form?.recomendaciones}
              onChange={handleChange}
              rows={6}
              {...editable("recomendaciones")}
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
        </div>

        {/* Columna 2: Recomendaciones */}
        <SectionFieldset legend="Observaciones" className="space-y-3">
          <InputTextArea
            label="Restricciones"
            name="restricciones"
            value={form?.restricciones}
            onChange={handleChange}
            rows={8}
            {...editable("restricciones", CAMPOS_RESTRICCIONES)}
          />
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h5 className="font-semibold">Restricciones y recomendaciones:</h5>
              {restriccionesEditadas && (
                <RevertButton
                  onClick={() => revertFields(CAMPOS_RESTRICCIONES)}
                  title="Revertir restricciones"
                />
              )}
            </div>
            {/* "NINGUNO." va antes de la última casilla */}
            {checkboxesRestriccion.slice(0, -1)}
            <InputCheckbox
              name="ninguno"
              checked={form?.ninguno}
              onChange={(e) => handleRestriccionesChange("ninguno", e.target.checked)}
              disabled={camposDeshabilitados || hayRestriccionMarcada}
              className={hayRestriccionMarcada ? "opacity-50 text-gray-400 cursor-not-allowed" : ""}
              label="NINGUNO."
            />
            {checkboxesRestriccion.slice(-1)}
          </div>
        </SectionFieldset>
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
        handleSave={form.tieneRegistro && edicionHabilitada ? handleUpdate : handleSave}
        saveLabel={form.tieneRegistro && edicionHabilitada ? "Guardar Cambios" : "Guardar"}
        handleEdit={habilitarEdicion}
        handleClear={handleClear}
        handlePrint={handlePrint}
        hideSave={form.tieneRegistro && !edicionHabilitada}
        hideEdit={!form.tieneRegistro || edicionHabilitada}
      >
        <button
          type="button"
          onClick={handlePrint2}
          className="
            bg-green-500 hover:bg-green-600
            text-white text-base px-6 py-2 rounded
            flex items-center gap-2
            transition-all duration-150 ease-out
            hover:shadow-lg
            active:scale-95 active:shadow-inner"
        >
          Resumen Médico <FontAwesomeIcon icon={faPrint} />
        </button>
      </BotonesForm>
      {modalCargaMasiva && <CargaMasivaFA2
        onClose={() => setModalCargaMasiva(false)}
        token={token}
        userlogued={userlogued}
        userName={userName}
        tabla={tabla}
        sede={selectedSede} />}
    </div>
  );
}
