import {
  InputTextOneLine,
  InputsBooleanRadioGroup,
} from '../../../../../components/reusableComponents/ResusableComponents';
import SectionFieldset from '../../../../../components/reusableComponents/SectionFieldset';
import SearchButton from '../../../../../components/reusableComponents/SearchButton';
import AccionesRegistroHeader from '../../../../../components/reusableComponents/AccionesRegistroHeader';
import AuditoriaRegistro from '../../../../../components/reusableComponents/AuditoriaRegistro';
import EmpleadoComboBox from '../../../../../components/reusableComponents/EmpleadoComboBox';
import BotonesForm from '../../../../../components/templates/BotonesForm';
import { useSessionData } from '../../../../../hooks/useSessionData';
import { useForm } from '../../../../../hooks/useForm';
import { useRegistroEditable } from '../../../../../hooks/useRegistroEditable';
import { getToday, getFechaHoraActual } from '../../../../../utils/helpers';
import { buildAuditoria } from '../../../../../utils/auditoriaUtils';
import { antecedentesIniciales, datosConsentimiento, segmentosConsentimiento } from './config/consentimientos';
import { ConfirmarImpresion, SubmitDataService, UpdateDataService, VerifyTR } from './controllerConsentimiento';

// Campos que el usuario puede editar en este formulario (para resaltar/revertir cambios).
const CAMPOS_EDITABLES = [
  "fecha",
  "user_medicoFirma",
  "nombre_medico",
  "user_doctorAsignado",
  "nombre_doctorAsignado",
];

// Formulario de un consentimiento de Laboratorio asistencial; `config` (config/consentimientos.js) define
// su título, texto y antecedentes.
export default function ConsentimientoLaboratorio({ config }) {
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

    antecedentes: antecedentesIniciales(config, today),

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
    handleChangeNumber,
    handleChangeNumberDecimals,
    handleChangeSimple,
    handleClear,
  } = useForm(initialFormState, { storageKey: `asistCons_${config.id}` });

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

  const actualizarAntecedente = (key, cambios) => {
    setForm((prev) => ({
      ...prev,
      antecedentes: prev.antecedentes.map((item) => (item.key === key ? { ...item, ...cambios } : item)),
    }));
  };

  const handleSave = () => SubmitDataService(config, form, token, userlogued, handleClear);
  const handleEdit = () => UpdateDataService(config, form, token, userlogued, handleClear);
  const handlePrint = () => ConfirmarImpresion(config, form.ticketImprimir, token);

  // Equivalente a handleClearnotO pero conservando el N° Ticket digitado.
  const limpiarSalvoTicket = () => {
    setForm((prev) => ({ ...initialFormState, numeroTicket: prev.numeroTicket }));
  };

  // ===== Búsqueda con botón =====
  const executeSearch = () => {
    limpiarSalvoTicket();
    VerifyTR(config, form.numeroTicket, token, setForm);
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

  const etiquetas = Object.fromEntries(config.antecedentes.map(({ key, label }) => [key, label]));
  const parrafo = segmentosConsentimiento(config.texto, datosConsentimiento(form));

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
        <h2 className="text-lg md:text-xl font-bold text-center">
          {config.titulo.map((linea) => (
            <span key={linea} className="block">{linea}</span>
          ))}
        </h2>
        <p className="text-justify text-base leading-8">
          {parrafo.map((segmento, i) => (
            <span
              key={i}
              className={`${segmento.negrita ? "font-bold" : ""} ${segmento.dato ? "px-2 border-b border-gray-400 bg-gray-100" : ""}`}
            >
              {segmento.texto}
            </span>
          ))}
        </p>
      </SectionFieldset>

      {config.antecedentes.length > 0 && (
        <SectionFieldset legend="Antecedentes" className="space-y-4">
          {config.nota && <p className="text-base">{config.nota}</p>}
          {form.antecedentes.map(({ key, value, fecha }) => (
            <div key={key} className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
              <span className="text-base font-medium flex-1">{etiquetas[key]}</span>
              <div className="flex flex-wrap items-center gap-4 md:min-w-[400px]">
                <InputsBooleanRadioGroup
                  name={`antecedente_${key}`}
                  value={value}
                  onChange={(e, nuevoValor) => actualizarAntecedente(key, { value: nuevoValor })}
                  trueLabel="SI"
                  falseLabel="NO"
                  disabled={camposDeshabilitados}
                  className="flex items-center"
                  groupClassName="gap-4"
                />
                {value === true && (
                  <InputTextOneLine
                    label="Fecha"
                    name={`fecha_${key}`}
                    type="date"
                    value={fecha}
                    onChange={(e) => actualizarAntecedente(key, { fecha: e.target.value })}
                    disabled={camposDeshabilitados}
                    labelWidth="80px"
                    className="w-48"
                  />
                )}
              </div>
            </div>
          ))}
        </SectionFieldset>
      )}

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
