import {
  InputCheckbox,
  InputTextOneLine,
} from '../../../../../../components/reusableComponents/ResusableComponents';
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
import CampoConOpciones from '../components/CampoConOpciones';
import {
  CAMPOS_RESULTADO,
  MACROSCOPICO,
  MICROSCOPICO,
  MUESTRAS,
  cantidadMuestras,
  camposDeMuestra,
} from './camposCoproparasitologia';
import { ConfirmarImpresion, SubmitDataService, UpdateDataService, VerifyTR } from './controllerCoproparasitologia';

const ROMANOS = { 1: "I", 2: "II", 3: "III" };

const BOTON_MARCAR =
  "bg-blue-500 hover:bg-blue-600 text-white text-base px-4 py-2 rounded transition-all duration-150 ease-out hover:shadow-lg active:scale-95 active:shadow-inner disabled:opacity-50 disabled:pointer-events-none";

// Campos que el usuario puede editar en este formulario (para resaltar/revertir cambios).
const CAMPOS_EDITABLES = [
  "fecha",
  "tipoCoproparasitologico",
  "sinHecesTres",
  ...CAMPOS_RESULTADO,
  "user_medicoFirma",
  "nombre_medico",
  "user_doctorAsignado",
  "nombre_doctorAsignado",
];

export default function Coproparasitologia() {
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
    fechaNacimiento: "",
    lugarNacimiento: "",
    edad: "",
    sexo: "",
    estadoCivil: "",
    nivelEstudios: "",

    // Datos Laborales
    empresa: "",
    ocupacion: "",

    tipoCoproparasitologico: false,
    sinHecesTres: false,
    ...Object.fromEntries(CAMPOS_RESULTADO.map((campo) => [campo, ""])),

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
  } = useForm(initialFormState, { storageKey: "asistCoproparasitologia" });

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

  // "Coproparasitológico" (1 muestra) y "2 muestras" son excluyentes. Las muestras que no se informan quedan en
  // "N/A" (y bloqueadas); al volver a informarse se vacían.
  const handleTipoMuestras = (e) => {
    const { name, checked } = e.target;
    setForm((prev) => {
      const next = { ...prev, [name]: checked };
      if (checked) next[name === "tipoCoproparasitologico" ? "sinHecesTres" : "tipoCoproparasitologico"] = false;

      const informadas = cantidadMuestras(next);
      MUESTRAS.forEach((muestra) => {
        camposDeMuestra(muestra).forEach((campo) => {
          if (Number(muestra) > informadas) next[campo] = "N/A";
          else if (prev[campo] === "N/A") next[campo] = "";
        });
      });
      return next;
    });
  };

  // "Marcar todo AUSENTE": asigna `valores` ({ campo: valor }) en las muestras informadas; si alguno ya lo tiene, los limpia.
  const alternarTodo = (valores) => {
    setForm((prev) => {
      const asignaciones = MUESTRAS.slice(0, cantidadMuestras(prev)).flatMap((muestra) =>
        Object.entries(valores).map(([campo, valor]) => [`${campo}${muestra}`, valor])
      );
      const hayMarcados = asignaciones.some(([campo, valor]) => prev[campo] === valor);
      return { ...prev, ...Object.fromEntries(asignaciones.map(([campo, valor]) => [campo, hayMarcados ? "" : valor])) };
    });
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
  const informadas = cantidadMuestras(form);

  const auditoria = buildAuditoria(form, {
    usuarioActual: userlogued,
    fechaHoraActual: getFechaHoraActual(),
  });

  // Una sección por muestra con los campos de `definiciones` (macroscópico o microscópico).
  const seccionesPorMuestra = (titulo, definiciones) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {MUESTRAS.map((muestra) => {
        const bloqueada = camposDeshabilitados || Number(muestra) > informadas;
        return (
          <SectionFieldset key={muestra} legend={`${titulo} ${ROMANOS[muestra]}`} className="space-y-4">
            {definiciones.map(({ name, label, opciones, xCampo }) => {
              const campo = `${name}${muestra}`;
              return (
                <CampoConOpciones
                  key={campo}
                  label={label}
                  name={campo}
                  value={form[campo]}
                  onChange={handleChange}
                  onSelect={(valor) => setForm((prev) => ({ ...prev, [campo]: valor }))}
                  opciones={opciones}
                  xCampo={xCampo}
                  labelOnTop
                  disabled={bloqueada}
                  edited={isFieldEdited(campo)}
                  onRevert={() => revertField(campo)}
                />
              );
            })}
          </SectionFieldset>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-3 px-4 max-w-[90%] xl:max-w-[80%] mx-auto">
      <AccionesRegistroHeader
        tieneRegistro={form.tieneRegistro}
        hayRegistroCargado={hayRegistroCargado}
        edicionHabilitada={edicionHabilitada}
        onHabilitarEdicion={habilitarEdicion}
        onLimpiar={handleClear}
      />

      <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="flex gap-x-3 w-full">
          <InputTextOneLine
            label="N° Ticket"
            name="numeroTicket"
            value={form.numeroTicket}
            onChange={handleChangeNumber}
            onKeyUp={handleSearch}
            disabled={hayRegistroCargado}
            labelWidth="100px"
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
        <div className="grid grid-cols-[auto_1fr] gap-2 items-center">
          <span>Muestras:</span>
          <div className="flex flex-col gap-2">
            <InputCheckbox
              label="COPROPARASITOLÓGICO"
              name="tipoCoproparasitologico"
              checked={form.tipoCoproparasitologico}
              onChange={handleTipoMuestras}
              disabled={camposDeshabilitados}
            />
            <InputCheckbox
              label="2 MUESTRAS"
              name="sinHecesTres"
              checked={form.sinHecesTres}
              onChange={handleTipoMuestras}
              disabled={camposDeshabilitados}
            />
          </div>
        </div>
      </SectionFieldset>

      <DatosPersonalesLaboralesAsistencial form={form} laborales={false} />

      <SectionFieldset legend="Muestras" className="space-y-4">
        <div>
          <button
            type="button"
            onClick={() => alternarTodo({ mocoFecal: "AUSENTE", grasa: "AUSENTE", sangreVisible: "AUSENTE", restosAlimenticios: "AUSENTE" })}
            disabled={camposDeshabilitados}
            className={BOTON_MARCAR}
          >
            Marcar todo AUSENTE
          </button>
        </div>
        {seccionesPorMuestra("MUESTRA: HECES", MACROSCOPICO)}
      </SectionFieldset>

      <SectionFieldset legend="Examen Microscópico" className="space-y-4">
        <div>
          <button
            type="button"
            onClick={() => alternarTodo({ leucocitos: "NO SE OBSERVAN", hematies: "NO SE OBSERVAN", lugol: "AUSENTE" })}
            disabled={camposDeshabilitados}
            className={BOTON_MARCAR}
          >
            Marcar todo NO SE OBSERVAN / AUSENTE
          </button>
        </div>
        {seccionesPorMuestra("EXAMEN MICROSCÓPICO", MICROSCOPICO)}
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
