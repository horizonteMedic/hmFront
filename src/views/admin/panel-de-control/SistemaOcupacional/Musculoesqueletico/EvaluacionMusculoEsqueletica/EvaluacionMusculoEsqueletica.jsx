import { useEffect } from "react";
import ExamenFisicoI from "./ExamenFisicoI";
import ExamenFisicoII from "./ExamenFisicoII";
import ExamenFisicoIII from "./ExamenFisicoIII";
import {
  PrintHojaR,
  SubmitDataService,
  UpdateDataService,
  TABLA_EVALUACION_NORMAL,
  VerifyTR,
} from "./controllerEvaluacionMusculoEsqueletica";
import { EdicionContext } from "../EdicionContext";
import { useForm } from "../../../../../hooks/useForm";
import { useSessionData } from "../../../../../hooks/useSessionData";
import { useRegistroEditable } from "../../../../../hooks/useRegistroEditable";
import { getToday, getFechaHoraActual } from "../../../../../utils/helpers";
import { buildAuditoria } from "../../../../../utils/auditoriaUtils";
import AccionesRegistroHeader from "../../../../../components/reusableComponents/AccionesRegistroHeader";
import AuditoriaRegistro from "../../../../../components/reusableComponents/AuditoriaRegistro";
import SectionFieldset from "../../../../../components/reusableComponents/SectionFieldset";
import InputTextOneLine from "../../../../../components/reusableComponents/InputTextOneLine";
import InputTextArea from "../../../../../components/reusableComponents/InputTextArea";
import InputsRadioGroup from "../../../../../components/reusableComponents/InputsRadioGroup";
import SearchButton from "../../../../../components/reusableComponents/SearchButton";
import RevertButton from "../../../../../components/reusableComponents/RevertButton";
import EmpleadoComboBox from "../../../../../components/reusableComponents/EmpleadoComboBox";
import CIE10List from "../../../../../components/reusableComponents/CIE10List";
import DatosPersonalesLaborales from "../../../../../components/templates/DatosPersonalesLaborales";
import BotonesForm from "../../../../../components/templates/BotonesForm";

const tabla = TABLA_EVALUACION_NORMAL;
const today = getToday();

const OPCIONES_SI_NO = [
  { label: "SI", value: "SI" },
  { label: "NO", value: "NO" },
];

// Campos que NO edita el usuario (identidad, datos del paciente, control de UI y auditoría): el resto del
// formulario se resalta/revierte al editar un registro existente.
const CAMPOS_NO_EDITABLES = [
  "norden",
  "codEvaluacion",
  "nombres",
  "dni",
  "edad",
  "sexo",
  "fechaNacimiento",
  "lugarNacimiento",
  "estadoCivil",
  "nivelEstudios",
  "empresa",
  "contrata",
  "ocupacion",
  "cargoDesempenar",
  "nombreMedico",
  "tieneRegistro",
  "userRegistro",
  "fechaRegistro",
  "usuarioActualizacion",
  "fechaActualizacion",
];

function fixEncodingModern(str) {
  const bytes = new Uint8Array([...str].map((c) => c.charCodeAt(0)));
  return new TextDecoder("utf-8").decode(bytes);
}

// Con `nOrdenInicial` el formulario va incrustado (p. ej. Auditoría de Protocolos): carga esa orden al abrir,
// sin Limpiar/Imprimir, y avisa con `onGuardado` al registrar o actualizar la evaluación.
export default function EvaluacionMusculoEsqueletica({ nOrdenInicial, onGuardado }) {
  const embebido = Boolean(nOrdenInicial);
  const { token, userlogued, selectedSede, datosFooter, userCompleto, userName } =
    useSessionData();

  const initialFormState = {
    norden: embebido ? String(nOrdenInicial) : "",
    codEvaluacion: "",
    nombres: "",
    dni: "",
    edad: "",
    sexo: "",
    fecha: today,
    fechaNacimiento: "",
    lugarNacimiento: "",
    estadoCivil: "",
    nivelEstudios: "",
    empresa: "",
    contrata: "",
    ocupacion: "",
    cargoDesempenar: "",
    tiempoServicio: "AÑOS",

    // Síntomas
    sintomas: "NO",
    cualesSintomas: "",

    // Uso de Faja Lumbar
    usoFajaLumbar: "NO",

    // Técnica de Levantamiento
    tecnicaLevantamiento: "NO",

    // Capacitación
    capacitacionLevantamiento: "NO",

    // Cabeza y Cuello
    extensionCabeza: "CONSERVADO",
    flexionCabeza: "CONSERVADO",
    gradoExtension: "N",
    gradoFlexion: "N",

    // Miembros Superiores - Tórax
    flexionTorax: "N",
    extensionTorax: "N",
    rotacionTorax: "N",
    flexionToraxDerecho: "N",
    extensionToraxDerecho: "N",
    rotacionToraxDerecho: "N",

    // Miembros Superiores - Hombro
    flexionHombro: "N",
    extensionHombro: "N",
    abduccionHombro: "N",
    aduccionHombro: "N",
    rotacionInternaHombro: "N",
    rotacionExternaHombro: "N",
    flexionHombroDerecho: "N",
    extensionHombroDerecho: "N",
    abduccionHombroDerecho: "N",
    aduccionHombroDerecho: "N",
    rotacionInternaHombroDerecho: "N",
    rotacionExternaHombroDerecho: "N",

    // Miembros Superiores - Brazo
    flexionBrazo: "N",
    extensionBrazo: "N",
    flexionBrazoDerecho: "N",
    extensionBrazoDerecho: "N",

    // Miembros Superiores - Antebrazo
    pronacionAntebrazo: "N",
    supinacionAntebrazo: "N",
    pronacionAntebrazoDerecho: "N",
    supinacionAntebrazoDerecho: "N",

    // Examen Físico II - Muñeca
    flexionMuneca: "N",
    extensionMuneca: "N",
    desviacionCubitalMuneca: "N",
    desviacionRadialMuneca: "N",
    // Muñeca - Lado Derecho
    flexionMunecaDerecho: "N",
    extensionMunecaDerecho: "N",
    desviacionCubitalMunecaDerecho: "N",
    desviacionRadialMunecaDerecho: "N",
    signoPhallen: "NO",
    signoTinel: "NO",

    // Examen Físico II - Cadera
    flexionCadera: "N",
    extensionCadera: "N",
    abduccionCadera: "N",
    aduccionCadera: "N",
    rotacionInternaCadera: "N",
    rotacionExternaCadera: "N",
    // Cadera - Lado Derecho
    flexionCaderaDerecho: "N",
    extensionCaderaDerecho: "N",
    abduccionCaderaDerecho: "N",
    aduccionCaderaDerecho: "N",
    rotacionInternaCaderaDerecho: "N",
    rotacionExternaCaderaDerecho: "N",

    // Examen Físico II - Pierna
    flexionPierna: "N",
    extensionPierna: "N",
    // Pierna - Lado Derecho
    flexionPiernaDerecho: "N",
    extensionPiernaDerecho: "N",

    // Examen Físico II - Rodilla
    flexionRodilla: "N",
    extensionRodilla: "N",
    rotacionInternaRodilla: "N",
    rotacionExternaRodilla: "N",
    // Rodilla - Lado Derecho
    flexionRodillaDerecho: "N",
    extensionRodillaDerecho: "N",
    rotacionInternaRodillaDerecho: "N",
    rotacionExternaRodillaDerecho: "N",

    // Examen Físico III - Tobillo
    flexionTobillo: "N",
    extensionTobillo: "N",
    // Tobillo - Lado Derecho
    flexionTobilloDerecho: "N",
    extensionTobilloDerecho: "N",

    // Examen Físico III - Columna Vertebral
    desviacionEjeCervical: "NORMAL",
    desviacionEjeDorsal: "NORMAL",
    desviacionEjeLumbar: "NORMAL",
    cifosis: "NO",
    escoliosis: "NO",
    lordosis: "NO",
    mixta: "NO",
    fuerzaMuscular: "5",
    dolorCervical: "NO",
    dolorDorsal: "NO",
    dolorLumbar: "NO",
    signoLesagueDerecho: "NO",
    signoLesagueIzquierdo: "NO",

    // Conclusión y Comentarios
    tratamiento: "NO",
    conclusion: "SI",
    diagnostico: "",
    diagnosticoCie10: "",
    recomendaciones: "-EVALUACIÓN ANUAL",
    nombreMedico: `${fixEncodingModern(
      userCompleto?.datos?.nombres_user ?? ""
    )} - ${userCompleto?.datos?.cmp ?? ""}`,

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
    handleChangeSimple,
    handleRadioButton,
    handleClear,
    handleClearnotO,
    handlePrintDefault,
  } = useForm(initialFormState, { storageKey: embebido ? undefined : "evaluacionMusculoEsqueletica" });

  const camposEditables = Object.keys(initialFormState).filter((k) => !CAMPOS_NO_EDITABLES.includes(k));

  const {
    edicionHabilitada,
    habilitarEdicion,
    camposDeshabilitados,
    isFieldEdited,
    revertField,
    revertFields,
  } = useRegistroEditable(form, setForm, { tieneRegistro: form.tieneRegistro, camposEditables });

  // El médico se compone de 2 campos (id de firma + nombre): se detecta el cambio por
  // el id y se revierten ambos en conjunto.
  const isMedicoEdited = isFieldEdited("user_medicoFirma");
  const revertMedico = () => revertFields(["user_medicoFirma", "nombre_medico"]);

  // Props comunes de un grupo SI/NO: bloqueo, resaltado de cambios y botón de revertir.
  const radioSiNo = (name, extra = {}) => ({
    name,
    value: form[name],
    onChange: handleRadioButton,
    options: OPCIONES_SI_NO,
    disabled: camposDeshabilitados,
    edited: isFieldEdited(name),
    onRevert: () => revertField(name),
    ...extra,
  });

  // Props comunes de un campo de texto.
  const campo = (name, onChange = handleChange) => ({
    name,
    value: form[name],
    onChange,
    disabled: camposDeshabilitados,
    edited: isFieldEdited(name),
    onRevert: () => revertField(name),
  });

  // Incrustado no se limpia el formulario al registrar: se avisa para que el contenedor muestre el nuevo estado
  const alRegistrar = embebido ? () => onGuardado?.() : handleClear;

  const dniUsuario = userCompleto?.datos?.dni_user;

  const handleSave = () => {
    SubmitDataService(form, token, userlogued, alRegistrar, tabla, datosFooter, dniUsuario);
  };

  const handleEdit = () => {
    UpdateDataService(form, token, userlogued, alRegistrar, tabla, datosFooter, dniUsuario);
  };

  // Incrustado: abre la orden recibida (datos del paciente si aún no hay evaluación; si ya existe, sus resultados)
  useEffect(() => {
    if (embebido) {
      VerifyTR(String(nOrdenInicial), tabla, token, setForm, selectedSede, { silencioso: true });
    }
  }, [embebido, nOrdenInicial, selectedSede, token, setForm]);

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

  // ===== Impresión =====
  const handlePrint = () => {
    handlePrintDefault(() => {
      PrintHojaR(form.norden, token, tabla, datosFooter);
    });
  };

  // Al pasar los síntomas a NO se limpia el detalle ("Cuáles").
  const handleSintomas = (e, value) => {
    setForm((f) => ({
      ...f,
      sintomas: value,
      ...(value === "NO" ? { cualesSintomas: "" } : {}),
    }));
  };

  const hayRegistroCargado = Boolean(form.nombres || form.dni);
  const nordenDisabled = embebido || hayRegistroCargado;

  const auditoria = buildAuditoria(form, {
    usuarioActual: userlogued,
    fechaHoraActual: getFechaHoraActual(),
  });

  // Incrustado el ancho útil es el del panel (no el de la ventana): bajo 1600 px las columnas Izquierdo/Derecho
  // anidadas de los exámenes físicos quedan muy angostas y desbordan, así que se apilan.
  return (
    <div className={embebido ? "w-full space-y-3 max-[1599px]:[&_.grid_.grid]:grid-cols-1" : "w-full space-y-3"}>
      <AccionesRegistroHeader
        tieneRegistro={form.tieneRegistro}
        hayRegistroCargado={hayRegistroCargado}
        edicionHabilitada={edicionHabilitada}
        onHabilitarEdicion={habilitarEdicion}
        onLimpiar={handleClear}
        mostrarLimpiar={!embebido}
      />

      {/* ===== SECCIÓN: FILIACIÓN ===== */}
      <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3">
        <div className="flex gap-x-3 w-full">
          <InputTextOneLine
            label="N° Orden"
            name="norden"
            value={form.norden}
            onKeyUp={handleSearch}
            onChange={handleChangeNumber}
            disabled={nordenDisabled}
            labelWidth="100px"
            className="w-full"
          />
          {!embebido && <SearchButton onClick={executeSearch} className="lg:hidden" />}
        </div>
        <InputTextOneLine
          label="Fecha"
          type="date"
          labelWidth="100px"
          {...campo("fecha")}
        />
        <InputTextOneLine
          label="T. Servicio"
          labelWidth="100px"
          {...campo("tiempoServicio")}
        />
      </SectionFieldset>

      <DatosPersonalesLaborales form={form} />

      {/* ===== SECCIÓN: SÍNTOMAS Y LEVANTAMIENTO DE CARGA ===== */}
      <SectionFieldset legend="Síntomas y Levantamiento de Carga" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-3">
          <InputsRadioGroup
            label="Síntomas"
            labelOnTop
            {...radioSiNo("sintomas", {
              onChange: handleSintomas,
              onRevert: () => revertFields(["sintomas", "cualesSintomas"]),
              edited: isFieldEdited("sintomas") || isFieldEdited("cualesSintomas"),
            })}
          />
          <InputTextOneLine
            label="Cuáles"
            labelWidth="60px"
            {...campo("cualesSintomas")}
            disabled={camposDeshabilitados || form.sintomas === "NO"}
          />
        </div>
        <InputsRadioGroup label="Uso de Faja Lumbar" labelOnTop {...radioSiNo("usoFajaLumbar")} />
        <InputsRadioGroup label="Adecuada Técnica de Levantamiento de Carga" labelOnTop {...radioSiNo("tecnicaLevantamiento")} />
        <InputsRadioGroup label="Capacitación en Levantamiento de Carga" labelOnTop {...radioSiNo("capacitacionLevantamiento")} />
      </SectionFieldset>

      {/* ===== SECCIÓN: EXÁMENES FÍSICOS =====
          El bloqueo de edición va en un <fieldset disabled> (deshabilita todos sus radios/inputs sin hilar `disabled`
          por cada grupo); el resaltado y la reversión por grupo salen del EdicionContext. */}
      <EdicionContext.Provider value={{ isFieldEdited, revertField }}>
        <SectionFieldset legend="Parte 1: Examen Físico I">
          <fieldset disabled={camposDeshabilitados} className="m-0 p-0 border-0 min-w-0 text-[11px]">
            <ExamenFisicoI form={form} handleRadioButton={handleRadioButton} handleChange={handleChange} />
          </fieldset>
        </SectionFieldset>

        <SectionFieldset legend="Parte 2: Examen Físico II">
          <fieldset disabled={camposDeshabilitados} className="m-0 p-0 border-0 min-w-0 text-[11px]">
            <ExamenFisicoII form={form} handleRadioButton={handleRadioButton} handleChange={handleChange} />
          </fieldset>
        </SectionFieldset>

        <SectionFieldset legend="Parte 3: Examen Físico III">
          <fieldset disabled={camposDeshabilitados} className="m-0 p-0 border-0 min-w-0 text-[11px]">
            <ExamenFisicoIII form={form} handleRadioButton={handleRadioButton} handleChange={handleChange} />
          </fieldset>
        </SectionFieldset>
      </EdicionContext.Provider>

      {/* ===== SECCIÓN: CONCLUSIONES Y COMENTARIOS ===== */}
      <SectionFieldset legend="Conclusiones y Comentarios" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <InputsRadioGroup label="Tratamiento" labelWidth="100px" {...radioSiNo("tratamiento")} />
            <InputsRadioGroup label="Conclusión" labelWidth="100px" {...radioSiNo("conclusion")} />
          </div>
          <EmpleadoComboBox
            value={form.nombre_medico}
            form={form}
            onChange={handleChangeSimple}
            disabled={camposDeshabilitados}
            edited={isMedicoEdited}
            onRevert={revertMedico}
          />
        </div>
        <InputTextArea label="Diagnóstico" rows={3} {...campo("diagnostico")} />
        <div className="bg-green-200 p-3 rounded-xl flex items-start gap-2">
          <div className="flex-1">
            <CIE10List
              value={form.diagnosticoCie10}
              fieldName="diagnosticoCie10"
              label="Diagnóstico CIE10"
              token={token}
              setForm={setForm}
              disabled={camposDeshabilitados}
            />
          </div>
          {isFieldEdited("diagnosticoCie10") && (
            <RevertButton onClick={() => revertField("diagnosticoCie10")} />
          )}
        </div>
        <InputTextArea label="Recomendaciones y plan de acción" rows={3} {...campo("recomendaciones")} />
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
        hideClear={embebido}
        hidePrint={embebido}
      />
    </div>
  );
}
