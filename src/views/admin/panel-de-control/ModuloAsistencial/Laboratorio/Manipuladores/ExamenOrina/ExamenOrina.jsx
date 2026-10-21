import { InputTextOneLine } from '../../../../../../components/reusableComponents/ResusableComponents';
import SectionFieldset from '../../../../../../components/reusableComponents/SectionFieldset';
import SearchButton from '../../../../../../components/reusableComponents/SearchButton';
import AccionesRegistroHeader from '../../../../../../components/reusableComponents/AccionesRegistroHeader';
import AuditoriaRegistro from '../../../../../../components/reusableComponents/AuditoriaRegistro';
import EmpleadoComboBox from '../../../../../../components/reusableComponents/EmpleadoComboBox';
import DatosPersonalesLaboralesAsistencial from '../../../../../../components/templates/DatosPersonalesLaboralesAsistencial';
import BotonesForm from '../../../../../../components/templates/BotonesForm';
import { useSessionData } from '../../../../../../hooks/useSessionData';
import { useForm } from '../../../../../../hooks/useForm';
import { useRegistroEditable } from '../../../../../../hooks/useRegistroEditable';
import { getToday, getFechaHoraActual } from '../../../../../../utils/helpers';
import { buildAuditoria } from '../../../../../../utils/auditoriaUtils';
import { ASPECTOS, CAMPOS_ORINA, COLORES, VALORES_NORMALES } from './camposOrina';
import { ConfirmarImpresion, SubmitDataService, UpdateDataService, VerifyTR } from './controllerExamenOrina';

// Columnas de cada sección: [etiqueta, campo del formulario].
const SEDIMENTO = [
  [['Leucocitos (x campos)', 'leucocitosSedimentoUnitario'], ['CelEpiteliales', 'celEpiteliales'], ['Cilindros', 'cilindros'], ['Almidon', 'almidon'], ['Gram S/C', 'gramSc']],
  [['Hematies (x campos)', 'hematiesSedimentoUnitario'], ['Cristales', 'cristales'], ['Bacterias', 'bacterias'], ['Levadura', 'levadura'], ['Otros', 'otros']],
];
const QUIMICO = [
  [['Nitritos', 'nitritos'], ['Cetonas', 'cetonas'], ['Ác. Ascórbico', 'acAscorbico'], ['Bilirrubina', 'bilirrubina'], ['Sangre', 'sangre']],
  [['Proteínas', 'proteinas'], ['Leucocitos', 'leucocitosExamenQuimico'], ['Urobilinógeno', 'urobilinogeno'], ['Glucosa', 'glucosaExamenQuimico']],
];

// Campos que el usuario puede editar en este formulario (para resaltar/revertir cambios).
const CAMPOS_EDITABLES = [
  "fecha",
  ...CAMPOS_ORINA.map(({ form }) => form),
  "user_medicoFirma",
  "nombre_medico",
  "user_doctorAsignado",
  "nombre_doctorAsignado",
];

export default function ExamenOrina() {
  const { token, userlogued, userName } = useSessionData();
  const today = getToday();

  const initialFormState = {
    numeroTicket: "",
    ticketImprimir: "",
    fecha: today,

    codLabclinico: null,

    pacienteId: null,
    numeroDocumento: "",
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
    ocupacion: "",

    ...VALORES_NORMALES,

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
    handleFocusNext,
    handleChangeSimple,
    handleClear,
  } = useForm(initialFormState, { storageKey: "asistExamenOrina" });

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

  // "No Aplica": pone todos los resultados en N/A; si ya están en N/A, restaura los valores normales.
  const alternarNoAplica = () => {
    setForm((prev) => ({
      ...prev,
      ...(prev.color === "N/A"
        ? VALORES_NORMALES
        : Object.fromEntries(Object.keys(VALORES_NORMALES).map((campo) => [campo, "N/A"]))),
    }));
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

  const campo = (label, name) => (
    <InputTextOneLine
      key={name}
      label={label}
      name={name}
      value={form[name]}
      onChange={handleChange}
      onKeyUp={handleFocusNext}
      disabled={camposDeshabilitados}
      edited={isFieldEdited(name)}
      onRevert={() => revertField(name)}
    />
  );

  const selector = (label, name, opciones) => (
    <div className="flex items-center gap-4">
      <label className="font-semibold min-w-[100px] max-w-[100px]">{label} :</label>
      <select name={name} value={form[name]} disabled={camposDeshabilitados} className="border rounded p-1 w-full" onChange={handleChange}>
        {opciones.map((opcion) => (
          <option key={opcion}>{opcion}</option>
        ))}
      </select>
    </div>
  );

  const columnas = (listas) =>
    listas.map((lista, i) => (
      <div key={i} className="grid gap-y-2 content-start">
        {lista.map(([label, name]) => campo(label, name))}
      </div>
    ));

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

      <DatosPersonalesLaboralesAsistencial form={form} laborales={false} />

      <div className="font-semibold text-center bg-gray-100 p-3 rounded">
        MUESTRA: ORINA
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
        <div className="space-y-3 flex flex-col">
          <SectionFieldset legend="Examen Físico" className="space-y-4 flex-1">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {selector("Color", "color", COLORES)}
              {selector("Aspecto", "aspecto", ASPECTOS)}
              {campo("Densidad", "densidad")}
              {campo("PH", "ph")}
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                className="bg-red-600 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:pointer-events-none"
                disabled={camposDeshabilitados}
                onClick={alternarNoAplica}
              >
                No Aplica
              </button>
            </div>
          </SectionFieldset>

          <SectionFieldset legend="Sedimento Urinario" className="grid xl:grid-cols-2 gap-x-4 gap-y-2">
            {columnas(SEDIMENTO)}
          </SectionFieldset>
        </div>

        <div className="space-y-3 flex flex-col">
          <SectionFieldset legend="Examen Químico" className="grid xl:grid-cols-2 gap-x-4 gap-y-2">
            {columnas(QUIMICO)}
          </SectionFieldset>

          <SectionFieldset legend="Especialista">
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
        </div>
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
