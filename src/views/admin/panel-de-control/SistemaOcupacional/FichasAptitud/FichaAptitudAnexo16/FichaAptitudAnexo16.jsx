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
import { getDatePlus364Days, getToday, getFechaHoraActual } from "../../../../../utils/helpers";
import { buildAuditoria } from "../../../../../utils/auditoriaUtils";
import { useForm } from "../../../../../hooks/useForm";
import { useRegistroEditable } from "../../../../../hooks/useRegistroEditable";
import { PrintHojaR, PrintHojaR2, SubmitDataService, UpdateDataService, TABLA_FICHA_APTITUD_ANEXO16, VerifyTR } from "./controllerFichaAptitudAnexo16";
import {
  RESTRICCIONES_FA16,
  RESTRICCIONES_FA16_NAMES,
  RESTRICCIONES_FA16_DESMARCADAS,
  armarRestriccionesFA16,
} from "./FA16FormDefaults";
import EmpleadoComboBox from "../../../../../components/reusableComponents/EmpleadoComboBox";
import AccionesRegistroHeader from "../../../../../components/reusableComponents/AccionesRegistroHeader";
import AuditoriaRegistro from "../../../../../components/reusableComponents/AuditoriaRegistro";
import RevertButton from "../../../../../components/reusableComponents/RevertButton";
import BotonesForm from "../../../../../components/templates/BotonesForm";
import DatosPersonalesLaborales from "../../../../../components/templates/DatosPersonalesLaborales";
import { useEffect, useState } from "react";
import CargaMasivaFA16 from "./CargaMasivaFA16/CargaMasivaFA16";

const tabla = TABLA_FICHA_APTITUD_ANEXO16
const tabla2 = "resumen_medico_poderosa"

// Campos acoplados: se revierten en conjunto.
// - Restricciones: el texto se genera a partir de las casillas.
// - Aptitud: al cambiarla se reinician las restricciones.
// - Vigencia: la fecha de vencimiento se calcula con la fecha.
const CAMPOS_RESTRICCIONES = [...RESTRICCIONES_FA16_NAMES, "ninguno", "restricciones"];
const CAMPOS_APTITUD = ["apto", ...CAMPOS_RESTRICCIONES];
const CAMPOS_VIGENCIA = ["fechaValido", "fechaVencimiento"];

// Campos que el usuario puede editar en este formulario (para resaltar/revertir cambios).
const CAMPOS_EDITABLES = [
  "conclusiones",
  "recomendaciones",
  ...CAMPOS_APTITUD,
  ...CAMPOS_VIGENCIA,
  "user_medicoFirma",
  "nombre_medico",
];

// Con `nOrdenInicial` el formulario va incrustado (p. ej. Auditoría de Protocolos): carga esa orden al abrir,
// no guarda su borrador y avisa con `onGuardado` al registrar o actualizar la ficha.
export default function FichaAptitudAnexo16({ nOrdenInicial, onGuardado }) {
  const embebido = Boolean(nOrdenInicial);
  const today = getToday();

  const { token, userlogued, selectedSede, datosFooter, userName, hora } = useSessionData();
  const [modalCargaMasiva, setModalCargaMasiva] = useState(false);
  const initialFormState = {
    // Datos básicos
    norden: embebido ? String(nOrdenInicial) : "",
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
    fechaVencimiento: getDatePlus364Days(today),
    recomendaciones: "",
    restricciones: "NINGUNO.",

    // Checkboxes de recomendaciones
    ...RESTRICCIONES_FA16_DESMARCADAS,
    ninguno: true,

    visionCercaOd: "",
    visionLejosOd: "",
    visionCercaOi: "",
    visionLejosOi: "",

    visionCercaOdCorregida: "",
    visionLejosOdCorregida: "",
    visionCercaOiCorregida: "",
    visionLejosOiCorregida: "",

    visionColores: "",
    visionBinocular: "",
    reflejosPupilares: "",
    enfermedadOculares: "",

    hemoglobina: "",
    vsg: "",
    glucosa: "",
    creatinina: "",

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
  } = useForm(initialFormState, { storageKey: embebido ? undefined : "fichaAptitudAnexo16" });

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

  // Incrustado no se limpia el formulario al registrar: se avisa para que el contenedor muestre el nuevo estado
  const alRegistrar = embebido ? () => onGuardado?.() : handleClear;

  const handleSave = () => {
    SubmitDataService(form, token, userlogued, alRegistrar, tabla, datosFooter);
  };

  const handleUpdate = () => {
    UpdateDataService(form, token, userlogued, alRegistrar, tabla, datosFooter);
  };

  // Incrustado: abre la orden recibida (datos del paciente si aún no hay ficha; si ya existe, sus resultados)
  useEffect(() => {
    if (embebido) {
      VerifyTR(String(nOrdenInicial), tabla, token, setForm, selectedSede, { silencioso: true });
    }
  }, [embebido, nOrdenInicial, selectedSede, token, setForm]);

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
          ? { ...prev, ...RESTRICCIONES_FA16_DESMARCADAS, ninguno: true, restricciones: "NINGUNO." }
          : { ...prev, ninguno: false };
      }
      // Si se marca cualquier otro, se desmarca "NINGUNO"; las restricciones se regeneran con las marcadas
      const newForm = { ...prev, [name]: checked, ...(checked && { ninguno: false }) };
      return { ...newForm, restricciones: armarRestriccionesFA16(newForm) };
    });
  };

  const hayRestriccionMarcada = RESTRICCIONES_FA16_NAMES.some((name) => form?.[name]);
  const restriccionesEditadas = [...RESTRICCIONES_FA16_NAMES, "ninguno"].some(isFieldEdited);

  const checkboxesRestriccion = RESTRICCIONES_FA16.map(({ name, label }) => (
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
    <div className={embebido ? "space-y-3 px-4 py-4" : " mx-auto max-w-[80%] space-y-3 py-4"}>
      <AccionesRegistroHeader
        tieneRegistro={form.tieneRegistro}
        hayRegistroCargado={hayRegistroCargado}
        edicionHabilitada={edicionHabilitada}
        onHabilitarEdicion={habilitarEdicion}
        onLimpiar={handleClear}
        mostrarLimpiar={!embebido}
      />

      <SectionFieldset legend="Información del Examen" className="grid xl:grid-cols-3 gap-y-3 gap-x-4">
        <div className="flex gap-x-3 w-full">
          <InputTextOneLine
            label="N° Orden"
            name="norden"
            value={form?.norden}
            onChange={handleChangeNumber}
            onKeyUp={handleSearch}
            disabled={embebido || hayRegistroCargado}
            className="w-full"
          />
          {!embebido && <SearchButton onClick={executeSearch} className="lg:hidden" />}
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
      </SectionFieldset>
      {/* Carga Masiva (no va incrustado) */}
      {!embebido && (
        <button
          type="button"
          onClick={() => setModalCargaMasiva(true)}
          className=" px-4 mx-auto mb-3 verde-btn py-2 rounded flex items-center justify-center gap-2"
        >
          <FontAwesomeIcon icon={faUpload} /> Carga Masiva
        </button>
      )}
      <div className="space-y-3">
        {/* Información del paciente */}
        <DatosPersonalesLaborales form={form} />

        {/* Conclusiones y Recomendaciones en dos columnas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-3">
          {/* Columna 1: Conclusiones */}
          <div className="space-y-3">
            <SectionFieldset legend="Conclusiones y Recomendaciones" className="space-y-3">
              <InputTextArea
                label="Conclusiones"
                name="conclusiones"
                value={form?.conclusiones}
                onChange={handleChange}
                rows={6}
                {...editable("conclusiones")}
              />
              <div className="space-y-3">
                <InputsRadioGroup
                  label="Aptitud"
                  name="apto"
                  value={form?.apto}
                  labelOnTop
                  onChange={(e, value) => {
                    if (value == "APTO") {
                      setForm(prev => ({
                        ...prev,
                        ...RESTRICCIONES_FA16_DESMARCADAS,
                        restricciones: "NINGUNO.",
                        ninguno: true,
                      }));
                    }
                    else {
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
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-3">
                  <InputTextOneLine
                    label="Fecha"
                    name="fechaValido"
                    type="date"
                    value={form?.fechaValido}
                    onChange={(e) => {
                      setForm(prev => ({ ...prev, fechaVencimiento: getDatePlus364Days(e.target.value) }));
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
                </div>
                <InputTextArea
                  label="Recomendaciones"
                  name="recomendaciones"
                  value={form?.recomendaciones}
                  onChange={handleChange}
                  rows={6}
                  className="mb-3"
                  {...editable("recomendaciones")}
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
          hideClear={embebido}
          hidePrint={embebido}
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
      </div>
      {modalCargaMasiva && <CargaMasivaFA16
        onClose={() => setModalCargaMasiva(false)}
        token={token}
        userlogued={userlogued}
        userName={userName}
        tabla={tabla}
        sede={selectedSede} />}
    </div>
  );
}
