import { useEffect } from "react";
import ExamenFisicoI2021 from "./ExamenFisicoI2021";
import ExamenFisicoII2021 from "./ExamenFisicoII2021";
import ExamenFisicoIII2021 from "./ExamenFisicoIII2021";
import ExamenFisicoIV2021 from "./ExamenFisicoIV2021";
import {
  PrintHojaR,
  SubmitDataService,
  UpdateDataService,
  TABLA_EVALUACION_2021,
  VerifyTR,
} from "./controllerEvaluacionMusculoEsqueletica2021";
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
import InputCheckbox from "../../../../../components/reusableComponents/InputCheckbox";
import SearchButton from "../../../../../components/reusableComponents/SearchButton";
import RevertButton from "../../../../../components/reusableComponents/RevertButton";
import EmpleadoComboBox from "../../../../../components/reusableComponents/EmpleadoComboBox";
import DatosPersonalesLaborales from "../../../../../components/templates/DatosPersonalesLaborales";
import BotonesForm from "../../../../../components/templates/BotonesForm";

const tabla = TABLA_EVALUACION_2021;
const today = getToday();

// Campos de cada examen físico: sus inputs son crudos (radios/inputs con `name`), así que el resaltado y la
// reversión se hacen por parte (botón en el título de la sección) y el bloqueo con un <fieldset disabled>.
const PARTE_1 = [
  "flexFuerzaAbdomen", "cadera", "muslo", "abdomenLateralI", "totalAptitudEspalda", "observacionesAptitudEspalda",
  "abduccionHombro180", "dolorAbduccionHombro180", "abduccionHombro60", "dolorAbduccionHombro60",
  "rotacionExterna90", "dolorRotacionExterna90", "rotacionExternaHombroInterna", "dolorRotacionExternaHombroInterna",
  "totalRangosArticulares", "observacionesRangosArticulares",
];
const PARTE_2 = [
  "desviacionEje", "desviacionEjeDescripcion", "testAdams", "testAdamsDescripcion", "dandy", "dandyDescripcion",
  "lasegue", "lasegueDescripcion", "contracturaMuscular", "contracturaMuscularDescripcion",
  "cicatrizPostOperatoria", "cicatrizPostOperatoriaDescripcion",
  "testJobeDerecha", "testJobeIzquierda", "testPatteDerecha", "testPatteIzquierda", "testGerberDerecha", "testGerberIzquierda",
  "palmUpTestDerecha", "palmUpTestIzquierda", "epicondilitisDerecha", "epicondilitisIzquierda",
  "epitrocleitisDerecha", "epitrocleitisIzquierda", "phalenDerecha", "phalenIzquierda",
  "phalenInvertidoDerecha", "phalenInvertidoIzquierda",
];
const PARTE_3 = [
  "tinnelDerecha", "tinnelIzquierda", "finkelsTeinDerecha", "finkelsTeinIzquierda",
  "abduccionCaderaDerecha", "abduccionCaderaIzquierda", "abduccionRodillaDerecha", "abduccionRodillaIzquierda",
  "aduccionCaderaDerecha", "aduccionCaderaIzquierda", "aduccionRodillaDerecha", "aduccionRodillaIzquierda",
  "flexionCaderaDerecha", "flexionCaderaIzquierda", "flexionRodillaDerecha", "flexionRodillaIzquierda",
  "extensionCaderaDerecha", "extensionCaderaIzquierda", "extensionRodillaDerecha", "extensionRodillaIzquierda",
  "rotacionExternaCaderaDerecha", "rotacionExternaCaderaIzquierda", "rotacionExternaRodillaDerecha", "rotacionExternaRodillaIzquierda",
  "rotacionInternaCaderaDerecha", "rotacionInternaCaderaIzquierda", "rotacionInternaRodillaDerecha", "rotacionInternaRodillaIzquierda",
  "irradiacionCaderaDerecha", "irradiacionCaderaIzquierda", "irradiacionRodillaDerecha", "irradiacionRodillaIzquierda",
  "altMasaMuscularCaderaDerecha", "altMasaMuscularCaderaIzquierda", "altMasaMuscularRodillaDerecha", "altMasaMuscularRodillaIzquierda",
];
const PARTE_4 = [
  "abduccionTobilloDerecho", "abduccionTobilloIzquierdo", "aduccionTobilloDerecho", "aduccionTobilloIzquierdo",
  "flexionTobilloDerecho", "flexionTobilloIzquierdo", "extensionTobilloDerecho", "extensionTobilloIzquierdo",
  "rotacionExternaTobilloDerecho", "rotacionExternaTobilloIzquierdo", "rotacionInternaTobilloDerecho", "rotacionInternaTobilloIzquierdo",
  "irradiacionTobilloDerecho", "irradiacionTobilloIzquierdo", "altMasaMuscularTobilloDerecho", "altMasaMuscularTobilloIzquierdo",
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
const EvaluacionMusculoEsqueletica2021 = ({ nOrdenInicial, onGuardado }) => {
  const embebido = Boolean(nOrdenInicial);
  const { token, userlogued, selectedSede, datosFooter, userCompleto, userName } =
    useSessionData();

  const initialFormState = {
    norden: embebido ? String(nOrdenInicial) : "",
    codEvaluacion: null,
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

    // PARTE 1: APTITUD ESPALDA
    flexFuerzaAbdomen: "1",
    cadera: "1",
    muslo: "1",
    abdomenLateralI: "1",
    totalAptitudEspalda: "4",
    observacionesAptitudEspalda: "",

    // PARTE 1: RANGOS ARTICULARES
    abduccionHombro180: "1",
    abduccionHombro60: "1",
    rotacionExterna90: "1",
    rotacionExternaHombroInterna: "1",
    totalRangosArticulares: "4",
    observacionesRangosArticulares: "",

    // Campos de dolor contra resistencia
    dolorAbduccionHombro180: "NO",
    dolorAbduccionHombro60: "NO",
    dolorRotacionExterna90: "NO",
    dolorRotacionExternaHombroInterna: "NO",

    // PARTE 2: COLUMNA VERTEBRAL
    desviacionEje: "NO",
    testAdams: "-",
    dandy: "-",
    lasegue: "-",
    contracturaMuscular: "NO",
    cicatrizPostOperatoria: "NO",
    desviacionEjeDescripcion: "",
    testAdamsDescripcion: "",
    dandyDescripcion: "",
    lasegueDescripcion: "",
    contracturaMuscularDescripcion: "",
    cicatrizPostOperatoriaDescripcion: "",

    // PARTE 2: TESTS
    testJobeDerecha: "NO",
    testJobeIzquierda: "NO",
    testPatteDerecha: "NO",
    testPatteIzquierda: "NO",
    testGerberDerecha: "NO",
    testGerberIzquierda: "NO",
    palmUpTestDerecha: "NO",
    palmUpTestIzquierda: "NO",
    epicondilitisDerecha: "NO",
    epicondilitisIzquierda: "NO",
    epitrocleitisDerecha: "NO",
    epitrocleitisIzquierda: "NO",
    phalenDerecha: "NO",
    phalenIzquierda: "NO",
    phalenInvertidoDerecha: "NO",
    phalenInvertidoIzquierda: "NO",

    // PARTE 3: MANIOBRAS DE DESCARTE
    tinnelDerecha: "NO",
    tinnelIzquierda: "NO",
    finkelsTeinDerecha: "NO",
    finkelsTeinIzquierda: "NO",

    // PARTE 3: EVAL. DINAMICA - CADERA Y RODILLA
    abduccionCaderaDerecha: "0",
    abduccionCaderaIzquierda: "0",
    abduccionRodillaDerecha: "",
    abduccionRodillaIzquierda: "",
    aduccionCaderaDerecha: "0",
    aduccionCaderaIzquierda: "0",
    aduccionRodillaDerecha: "",
    aduccionRodillaIzquierda: "",
    flexionCaderaDerecha: "0",
    flexionCaderaIzquierda: "0",
    flexionRodillaDerecha: "0",
    flexionRodillaIzquierda: "0",
    extensionCaderaDerecha: "0",
    extensionCaderaIzquierda: "0",
    extensionRodillaDerecha: "0",
    extensionRodillaIzquierda: "0",
    rotacionExternaCaderaDerecha: "0",
    rotacionExternaCaderaIzquierda: "0",
    rotacionExternaRodillaDerecha: "0",
    rotacionExternaRodillaIzquierda: "0",
    rotacionInternaCaderaDerecha: "0",
    rotacionInternaCaderaIzquierda: "0",
    rotacionInternaRodillaDerecha: "0",
    rotacionInternaRodillaIzquierda: "0",
    irradiacionCaderaDerecha: "0",
    irradiacionCaderaIzquierda: "0",
    irradiacionRodillaDerecha: "0",
    irradiacionRodillaIzquierda: "0",
    altMasaMuscularCaderaDerecha: "0",
    altMasaMuscularCaderaIzquierda: "0",
    altMasaMuscularRodillaDerecha: "0",
    altMasaMuscularRodillaIzquierda: "0",

    // PARTE 4: EVAL. DINAMICA - TOBILLOS
    abduccionTobilloDerecho: "0",
    abduccionTobilloIzquierdo: "0",
    aduccionTobilloDerecho: "0",
    aduccionTobilloIzquierdo: "0",
    flexionTobilloDerecho: "0",
    flexionTobilloIzquierdo: "0",
    extensionTobilloDerecho: "0",
    extensionTobilloIzquierdo: "0",
    rotacionExternaTobilloDerecho: "0",
    rotacionExternaTobilloIzquierdo: "0",
    rotacionInternaTobilloDerecho: "0",
    rotacionInternaTobilloIzquierdo: "0",
    irradiacionTobilloDerecho: "0",
    irradiacionTobilloIzquierdo: "0",
    altMasaMuscularTobilloDerecho: "0",
    altMasaMuscularTobilloIzquierdo: "0",

    cie10: "Z00",
    nombreMedico: `${fixEncodingModern(
      userCompleto?.datos?.nombres_user ?? ""
    )} - ${userCompleto?.datos?.cmp ?? ""}`,
    conclusiones: "",
    recomendaciones: "-EVALUACIÓN ANUAL",

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
  } = useForm(initialFormState, { storageKey: embebido ? undefined : "evaluacionMusculoEsqueletica2021" });

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

  // Botón de revertir en el título de un examen cuando alguno de sus campos cambió.
  const revertirParte = (campos) =>
    campos.some(isFieldEdited) ? (
      <RevertButton onClick={() => revertFields(campos)} title="Revertir cambios de esta parte" />
    ) : null;

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

  const hayRegistroCargado = Boolean(form.nombres || form.dni);
  const nordenDisabled = embebido || hayRegistroCargado;

  const auditoria = buildAuditoria(form, {
    usuarioActual: userlogued,
    fechaHoraActual: getFechaHoraActual(),
  });

  // Props comunes de los exámenes físicos
  const propsExamen = { form, handleRadioButton, handleChange, handleChangeNumber };
  const examenClass = "m-0 p-0 border-0 min-w-0 text-[11px]";

  return (
    <div className="w-full space-y-3">
      <AccionesRegistroHeader
        tieneRegistro={form.tieneRegistro}
        hayRegistroCargado={hayRegistroCargado}
        edicionHabilitada={edicionHabilitada}
        onHabilitarEdicion={habilitarEdicion}
        onLimpiar={handleClear}
        mostrarLimpiar={!embebido}
      />

      {/* ===== SECCIÓN: DATOS DEL PACIENTE ===== */}
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

      {/* ===== SECCIÓN: EXÁMENES FÍSICOS =====
          El bloqueo de edición va en un <fieldset disabled> por examen (deshabilita todos sus radios/inputs). */}
      <SectionFieldset legend="Parte 1: Examen Físico I" actions={revertirParte(PARTE_1)}>
        <fieldset disabled={camposDeshabilitados} className={examenClass}>
          <ExamenFisicoI2021 {...propsExamen} />
        </fieldset>
      </SectionFieldset>

      <SectionFieldset legend="Parte 2: Examen Físico II" actions={revertirParte(PARTE_2)}>
        <fieldset disabled={camposDeshabilitados} className={examenClass}>
          <ExamenFisicoII2021 {...propsExamen} />
        </fieldset>
      </SectionFieldset>

      <SectionFieldset legend="Parte 3: Examen Físico III" actions={revertirParte(PARTE_3)}>
        <fieldset disabled={camposDeshabilitados} className={examenClass}>
          <ExamenFisicoIII2021 {...propsExamen} />
        </fieldset>
      </SectionFieldset>

      <SectionFieldset legend="Parte 4: Examen Físico IV" actions={revertirParte(PARTE_4)}>
        <fieldset disabled={camposDeshabilitados} className={examenClass}>
          <ExamenFisicoIV2021 {...propsExamen} />
        </fieldset>
      </SectionFieldset>

      {/* ===== SECCIÓN: CONCLUSIONES Y COMENTARIOS ===== */}
      <SectionFieldset legend="Conclusiones y Comentarios" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputTextOneLine label="CIE 10" labelWidth="80px" inputClassName="capitalize" {...campo("cie10")} />
          <EmpleadoComboBox
            value={form.nombre_medico}
            form={form}
            onChange={handleChangeSimple}
            disabled={camposDeshabilitados}
            edited={isMedicoEdited}
            onRevert={revertMedico}
          />
        </div>
        <div className="space-y-2">
          <InputTextArea label="Conclusiones" rows={3} {...campo("conclusiones")} />
          <InputCheckbox
            label="Normal"
            name="conclusionesNormal"
            checked={form.conclusiones == "NORMAL"}
            disabled={camposDeshabilitados}
            onChange={(e) => {
              const marcado = e.target.checked;
              setForm((prev) => ({
                ...prev,
                conclusiones: marcado ? "NORMAL" : "",
              }));
            }}
          />
        </div>
        <InputTextArea label="Recomendaciones - Restricciones" rows={3} {...campo("recomendaciones")} />
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
};

export default EvaluacionMusculoEsqueletica2021;
