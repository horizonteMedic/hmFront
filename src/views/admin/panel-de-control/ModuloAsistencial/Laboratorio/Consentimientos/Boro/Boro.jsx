import {
  InputTextOneLine,
  InputTextArea,
  InputCheckbox,
} from '../../../../../../components/reusableComponents/ResusableComponents';
import SectionFieldset from '../../../../../../components/reusableComponents/SectionFieldset';
import SearchButton from '../../../../../../components/reusableComponents/SearchButton';
import AccionesRegistroHeader from '../../../../../../components/reusableComponents/AccionesRegistroHeader';
import AuditoriaRegistro from '../../../../../../components/reusableComponents/AuditoriaRegistro';
import EmpleadoComboBox from '../../../../../../components/reusableComponents/EmpleadoComboBox';
import BotonesForm from '../../../../../../components/templates/BotonesForm';
import { useSessionData } from '../../../../../../hooks/useSessionData';
import { useForm } from '../../../../../../hooks/useForm';
import { useRegistroEditable } from '../../../../../../hooks/useRegistroEditable';
import { getToday, getFechaHoraActual } from '../../../../../../utils/helpers';
import { buildAuditoria } from '../../../../../../utils/auditoriaUtils';
import { datosConsentimiento, segmentosConsentimiento } from '../config/consentimientos';
import { ConfirmarImpresion, SubmitDataService, TEXTO_BORO, UpdateDataService, VerifyTR } from './controllerBoro';

// Campos que el usuario puede editar en este formulario (para resaltar/revertir cambios).
const CAMPOS_EDITABLES = [
  "fecha",
  "notas",
  "user_medicoFirma",
  "nombre_medico",
  "user_doctorAsignado",
  "nombre_doctorAsignado",
];

// Preguntas con un solo detalle: un texto (¿Cuál?) o una fecha.
const PREGUNTAS = [
  { campo: "enfermedad", label: "¿Sufre alguna enfermedad?", detalle: "cual" },
  { campo: "medicamento", label: "¿Consume regularmente algún medicamento?", detalle: "cual" },
  { campo: "matecoca", label: "¿Consume regularmente mate de coca?", detalle: "fecha" },
  { campo: "chaccha", label: "¿Chaccha o mastica hoja de coca?", detalle: "fecha" },
];

export default function Boro() {
  const { token, userlogued, userName } = useSessionData();
  const today = getToday();

  const initialFormState = {
    numeroTicket: "",
    ticketImprimir: "",
    fecha: today,

    pacienteId: null,
    numeroDocumento: "",
    nombres: "",
    apellidos: "",
    edad: "",
    empresa: "",

    trabajador: true,
    postulante: false,

    enfermedad: { key: false, cual: "" },
    medicamento: { key: false, cual: "" },
    matecoca: { key: false, fecha: today },
    chaccha: { key: false, fecha: today },
    tratamiento: { key: false, cual: "", cuando: "", donde: "" },
    notas: "",

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
    handleChangeNumber,
    handleChangeNumberDecimals,
    handleChangeSimple,
    handleClear,
  } = useForm(initialFormState, { storageKey: "asistConsBoro" });

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

  const handlePreguntaChange = (campo, clave, valor) => {
    setForm((prev) => ({ ...prev, [campo]: { ...prev[campo], [clave]: valor } }));
  };

  const handleSave = () => SubmitDataService(form, token, userlogued, handleClear);
  const handleEdit = () => UpdateDataService(form, token, userlogued, handleClear);
  const handlePrint = () => ConfirmarImpresion(form.ticketImprimir, token);

  // Equivalente a handleClearnotO pero conservando el N° Ticket digitado.
  const limpiarSalvoTicket = () => {
    setForm((prev) => ({ ...initialFormState, numeroTicket: prev.numeroTicket }));
  };

  // ===== Búsqueda con botón =====
  const executeSearch = () => {
    limpiarSalvoTicket();
    VerifyTR(form.numeroTicket, token, setForm);
  };

  // ===== Búsqueda con enter =====
  const handleSearch = (e) => {
    if (!e || e.key === 'Enter') {
      executeSearch();
    }
  };

  const hayRegistroCargado = Boolean(form.nombres);

  const auditoria = buildAuditoria(form, {
    usuarioActual: userlogued,
    fechaHoraActual: getFechaHoraActual(),
  });

  const autorizacion = segmentosConsentimiento(TEXTO_BORO, {
    ...datosConsentimiento(form),
    trabajador: form.trabajador ? "X" : " ",
    postulante: form.postulante ? "X" : " ",
  });

  const { tratamiento } = form;

  return (
    <div className="space-y-3 px-4 max-w-[90%] xl:max-w-[80%] mx-auto">
      <AccionesRegistroHeader
        tieneRegistro={form.tieneRegistro}
        hayRegistroCargado={hayRegistroCargado}
        edicionHabilitada={edicionHabilitada}
        onHabilitarEdicion={habilitarEdicion}
        onLimpiar={handleClear}
      />

      <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="flex gap-x-3 w-full">
          <InputTextOneLine
            label="N° Ticket"
            name="numeroTicket"
            value={form.numeroTicket}
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
      </SectionFieldset>

      <SectionFieldset legend="Consentimiento" className="space-y-4">
        <h2 className="text-lg md:text-xl font-bold text-center">AUTORIZACIÓN DE EXAMEN DE DROGAS</h2>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-base">
          <span className="font-semibold">Condición:</span>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="trabajador_postulante"
              checked={form.trabajador}
              disabled={camposDeshabilitados}
              onChange={() => setForm((prev) => ({ ...prev, trabajador: true, postulante: false }))}
            />
            Trabajador
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="trabajador_postulante"
              checked={form.postulante}
              disabled={camposDeshabilitados}
              onChange={() => setForm((prev) => ({ ...prev, trabajador: false, postulante: true }))}
            />
            Postulante
          </label>
        </div>
        <p className="text-justify text-base leading-8">
          {autorizacion.map((segmento, i) => (
            <span
              key={i}
              className={`${segmento.negrita ? "font-bold" : ""} ${segmento.dato ? "px-2 border-b border-gray-400 bg-gray-100" : ""}`}
            >
              {segmento.texto}
            </span>
          ))}
        </p>
      </SectionFieldset>

      <SectionFieldset legend="Además, declaro que la información que brindaré a continuación es verdadera:" className="space-y-4">
        {PREGUNTAS.map(({ campo, label, detalle }) => (
          <div key={campo} className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
            <InputCheckbox
              name={campo}
              checked={form[campo].key}
              onChange={() => handlePreguntaChange(campo, "key", !form[campo].key)}
              label={label}
              disabled={camposDeshabilitados}
            />
            {form[campo].key && (
              <InputTextOneLine
                label={detalle === "cual" ? "¿Cuál?" : "Especifique la fecha:"}
                name={`${campo}_${detalle}`}
                type={detalle === "fecha" ? "date" : "text"}
                value={form[campo][detalle]}
                onChange={(e) => handlePreguntaChange(campo, detalle, e.target.value)}
                labelWidth={detalle === "cual" ? "80px" : "150px"}
                className={detalle === "cual" ? "flex-1" : "w-full md:w-72"}
                disabled={camposDeshabilitados}
              />
            )}
          </div>
        ))}

        <div className="space-y-3">
          <InputCheckbox
            name="tratamiento"
            checked={tratamiento.key}
            onChange={() => handlePreguntaChange("tratamiento", "key", !tratamiento.key)}
            label="¿En las últimas 48 horas, se realizó algún tratamiento quirúrgico o dental?"
            disabled={camposDeshabilitados}
          />
          {tratamiento.key && (
            <div className="md:ml-8 space-y-3">
              <InputTextOneLine
                label="Especifique cuál:"
                name="tratamiento_cual"
                value={tratamiento.cual}
                onChange={(e) => handlePreguntaChange("tratamiento", "cual", e.target.value)}
                labelWidth="150px"
                disabled={camposDeshabilitados}
              />
              <div className="flex flex-col md:flex-row gap-3">
                <InputTextOneLine
                  label="Especifique cuándo:"
                  name="tratamiento_cuando"
                  value={tratamiento.cuando}
                  onChange={(e) => handlePreguntaChange("tratamiento", "cuando", e.target.value)}
                  labelWidth="150px"
                  className="flex-1"
                  disabled={camposDeshabilitados}
                />
                <InputTextOneLine
                  label="Especifique dónde:"
                  name="tratamiento_donde"
                  value={tratamiento.donde}
                  onChange={(e) => handlePreguntaChange("tratamiento", "donde", e.target.value)}
                  labelWidth="150px"
                  className="flex-1"
                  disabled={camposDeshabilitados}
                />
              </div>
            </div>
          )}
        </div>
      </SectionFieldset>

      <SectionFieldset legend="Notas">
        <InputTextArea
          label="Notas"
          name="notas"
          value={form.notas}
          onChange={handleChange}
          disabled={camposDeshabilitados}
          edited={isFieldEdited("notas")}
          onRevert={() => revertField("notas")}
          rows={4}
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
        handleSave={form.tieneRegistro && edicionHabilitada ? handleEdit : handleSave}
        saveLabel={form.tieneRegistro && edicionHabilitada ? "Guardar Cambios" : "Guardar"}
        handleEdit={habilitarEdicion}
        handleClear={handleClear}
        handlePrint={handlePrint}
        printField="ticketImprimir"
        printLabel="IMPRIMIR N° TICKET"
        hideSave={form.tieneRegistro && !edicionHabilitada}
        hideEdit={!form.tieneRegistro || edicionHabilitada}
      />
    </div>
  );
}
