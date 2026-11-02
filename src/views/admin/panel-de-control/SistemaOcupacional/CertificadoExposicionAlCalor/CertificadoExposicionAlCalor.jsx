import EmpleadoComboBox from "../../../../components/reusableComponents/EmpleadoComboBox";
import InputsRadioGroup from "../../../../components/reusableComponents/InputsRadioGroup";
import InputTextArea from "../../../../components/reusableComponents/InputTextArea";
import InputTextOneLine from "../../../../components/reusableComponents/InputTextOneLine";
import SectionFieldset from "../../../../components/reusableComponents/SectionFieldset";
import SearchButton from "../../../../components/reusableComponents/SearchButton";
import AccionesRegistroHeader from "../../../../components/reusableComponents/AccionesRegistroHeader";
import AuditoriaRegistro from "../../../../components/reusableComponents/AuditoriaRegistro";
import BotonesForm from "../../../../components/templates/BotonesForm";
import DatosPersonalesLaborales from "../../../../components/templates/DatosPersonalesLaborales";
import { useForm } from "../../../../hooks/useForm";
import { useRegistroEditable } from "../../../../hooks/useRegistroEditable";
import { useSessionData } from "../../../../hooks/useSessionData";
import { getToday, getFechaHoraActual } from "../../../../utils/helpers";
import { buildAuditoria } from "../../../../utils/auditoriaUtils";
import {
  PrintHojaR,
  SubmitDataService,
  UpdateDataService,
  VerifyTR,
} from "./ControllerCertificadoExposicionAlCalor";

const tabla = "certificado_exposicion_al_calor";

// Evaluación clínica: cada sección tiene su campo de resultado (`<name>Resultados`) y de observación
// (`<name>Observaciones`).
const SECCIONES_EVALUACION = [
  { name: "signosVitales", label: "Signos vitales" },
  { name: "sistemaCardiovascular", label: "Sistema Cardiovascular" },
  { name: "sistemaRespiratorio", label: "Sistema Respiratorio" },
  { name: "estadoNeurologico", label: "Estado Neurológico" },
  { name: "estadoHidratacion", label: "Estado de Hidratación" },
  { name: "toleranciaCalor", label: "Tolerancia al Calor" },
  { name: "sudoracion", label: "Sudoración / Termorregulación" },
];

const CAMPOS_EVALUACION = SECCIONES_EVALUACION.flatMap(({ name }) => [
  `${name}Resultados`,
  `${name}Observaciones`,
]);

// Campos que el usuario puede editar en este formulario (para resaltar/revertir cambios).
const CAMPOS_EDITABLES = [
  "fecha",
  ...CAMPOS_EVALUACION,
  "aptitud",
  "observaciones",
  "restricciones",
  "user_medicoFirma",
  "nombre_medico",
];

export default function CertificadoExposicionAlCalor() {
  const today = getToday();
  const { token, userlogued, selectedSede, datosFooter, userName } =
    useSessionData();

  const initialFormState = {
    norden: "",
    id: null,
    fecha: today,
    hora: "",
    nombreExamen: "",

    nombres: "",
    edad: "",
    sexo: "",
    dni: "",
    fechaNacimiento: "",
    lugarNacimiento: "",
    estadoCivil: "",
    nivelEstudios: "",

    // Datos Laborales
    empresa: "",
    contrata: "",
    ocupacion: "",
    cargoDesempenar: "",

    signosVitalesResultados: "",
    signosVitalesObservaciones: "",
    sistemaCardiovascularResultados:
      "NO INGURGITACION YUGULAR, CAROTIDEO, RADIAL, FEMORAL, PEDIO CONSERVADOS.RCRR, NO SOPLOS, NO FROTES.",
    sistemaCardiovascularObservaciones: "NINGUNA",
    sistemaRespiratorioResultados:
      "RESPIRACIÓN NORMAL, EXPANSIÓN TORACICA SIMÉTRICA, BPMV EN ACP, NO RALES.",
    sistemaRespiratorioObservaciones: "NINGUNA",
    estadoNeurologicoResultados:
      "DESPIERTO, OTEP, SENSIBILIDAD Y MOTRICIDAD CONSERVADA, ROTS CONSERVADOS. PARES CRANEALES CONSERVADOS. NO SIGNOS MENINGEOS.",
    estadoNeurologicoObservaciones: "NINGUNA",
    estadoHidratacionResultados:
      "MUCOSAS ORALES HIDRATADAS, PIEL TURGENTE, LLENADO CAPILAR < 2 SEG.",
    estadoHidratacionObservaciones: "NINGUNA",
    toleranciaCalorResultados: "SI",
    toleranciaCalorObservaciones: "N/A",
    sudoracionResultados: "SI",
    sudoracionObservaciones: "N/A",

    aptitud: "",

    observaciones: "",
    restricciones: "",

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
    handleChangeNumberDecimals,
    handleChangeSimple,
    handleClear,
    handleRadioButton,
    handleClearnotO,
    handlePrintDefault,
  } = useForm(initialFormState, {
    storageKey: "certificado_exposicion_al_calor",
  });

  const {
    edicionHabilitada,
    habilitarEdicion,
    camposDeshabilitados,
    isFieldEdited,
    revertField,
    revertFields,
  } = useRegistroEditable(form, setForm, {
    tieneRegistro: form.tieneRegistro,
    camposEditables: CAMPOS_EDITABLES,
  });

  // El médico se compone de 2 campos (id de firma + nombre): se detecta el cambio por el id y se revierten ambos.
  const isMedicoEdited = isFieldEdited("user_medicoFirma");
  const revertMedico = () => revertFields(["user_medicoFirma", "nombre_medico"]);

  const handleSave = () => {
    SubmitDataService(form, token, userlogued, handleClear, tabla, datosFooter);
  };

  const handleEdit = () => {
    UpdateDataService(form, token, userlogued, handleClear, tabla, datosFooter);
  };

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

      <SectionFieldset
        legend="Información del Examen"
        className="grid grid-cols-1 lg:grid-cols-4 gap-3"
      >
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

        <InputTextOneLine
          label="Hora"
          name="hora"
          value={form.hora}
          disabled
          labelWidth="120px"
        />
      </SectionFieldset>

      <DatosPersonalesLaborales form={form} />

      <SectionFieldset
        legend="Evaluación Clínica y Ocupacional"
        className="grid grid-cols-1 gap-y-3"
      >
        {SECCIONES_EVALUACION.map(({ name, label }) => {
          const campoResultado = `${name}Resultados`;
          const campoObservacion = `${name}Observaciones`;
          return (
            <div
              key={name}
              className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3"
            >
              <InputTextArea
                label={label}
                name={campoResultado}
                value={form[campoResultado]}
                onChange={handleChangeSimple}
                rows={6}
                disabled={camposDeshabilitados}
                edited={isFieldEdited(campoResultado)}
                onRevert={() => revertField(campoResultado)}
              />
              <InputTextArea
                label="Observaciones"
                name={campoObservacion}
                value={form[campoObservacion]}
                onChange={handleChangeSimple}
                rows={6}
                disabled={camposDeshabilitados}
                edited={isFieldEdited(campoObservacion)}
                onRevert={() => revertField(campoObservacion)}
              />
            </div>
          );
        })}
      </SectionFieldset>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <SectionFieldset
          legend="Conclusión de Aptitud"
          className="grid grid-cols-1  gap-3"
        >
          <InputsRadioGroup
            name="aptitud"
            value={form.aptitud}
            onChange={handleRadioButton}
            disabled={camposDeshabilitados}
            edited={isFieldEdited("aptitud")}
            onRevert={() => revertField("aptitud")}
            vertical
            options={[
              {
                label: "APTO (Puede realizar trabajos con exposición al calor.)",
                value: "APTO",
              },
              {
                label:
                  "APTO CON RESTRICCION (Debe cumplir medidas preventivas específicas.)",
                value: "RESTRICCION",
              },
              {
                label:
                  "NO APTO (No apto para trabajos con exposición al calor y vapor)",
                value: "NO APTO",
              },
            ]}
          />

          <InputTextArea
            label="Observaciones"
            name="observaciones"
            value={form.observaciones}
            onChange={handleChangeSimple}
            rows={5}
            disabled={camposDeshabilitados}
            edited={isFieldEdited("observaciones")}
            onRevert={() => revertField("observaciones")}
          />
        </SectionFieldset>

        <SectionFieldset legend="Restricciones">
          <InputTextArea
            name="restricciones"
            value={form.restricciones}
            onChange={handleChangeSimple}
            rows={10}
            disabled={camposDeshabilitados}
            edited={isFieldEdited("restricciones")}
            onRevert={() => revertField("restricciones")}
          />
        </SectionFieldset>
      </div>

      <SectionFieldset legend="Asignación de Médico" className="w-full">
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
