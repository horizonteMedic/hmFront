import { useSessionData } from '../../../../../../hooks/useSessionData';
import { useForm } from '../../../../../../hooks/useForm';
import { useRegistroEditable } from '../../../../../../hooks/useRegistroEditable';
import { getToday, getFechaHoraActual } from '../../../../../../utils/helpers';
import { buildAuditoria } from '../../../../../../utils/auditoriaUtils';
import { PrintHojaR, SubmitDataService, UpdateDataService, VerifyTR } from './controllerPerfilHepatico';
import {
  InputTextOneLine,
} from '../../../../../../components/reusableComponents/ResusableComponents';
import SectionFieldset from '../../../../../../components/reusableComponents/SectionFieldset';
import SearchButton from '../../../../../../components/reusableComponents/SearchButton';
import AccionesRegistroHeader from '../../../../../../components/reusableComponents/AccionesRegistroHeader';
import AuditoriaRegistro from '../../../../../../components/reusableComponents/AuditoriaRegistro';
import EmpleadoComboBox from '../../../../../../components/reusableComponents/EmpleadoComboBox';
import DatosPersonalesLaborales from '../../../../../../components/templates/DatosPersonalesLaborales';
import BotonesForm from '../../../../../../components/templates/BotonesForm';

const testFields = [
  { label: 'Fosfatasa Alcalina', name: 'fosfAlc' },
  { label: 'GGT', name: 'ggt' },
  { label: 'TGP', name: 'tgp' },
  { label: 'TGO', name: 'tgo' },
  { label: 'Bilirrubina Total', name: 'biliTotal' },
  { label: 'Bilirrubina Directa', name: 'biliDir' },
  { label: 'Bilirrubina Indirecta', name: 'biliInd' },
  { label: 'Proteínas Totales', name: 'protTot' },
  { label: 'Albumina', name: 'albumina' },
  { label: 'Globulina Sérica', name: 'globSer' },
];

const tabla = 'perfil_hepatico';

// Campos que el usuario puede editar en este formulario (para resaltar/revertir cambios).
const CAMPOS_EDITABLES = [
  "fecha",
  ...testFields.map(f => f.name),
  "user_medicoFirma",
  "nombre_medico",
  "user_doctorAsignado",
  "nombre_doctorAsignado",
];

export default function PerfilHepatico() {
  const { token, userlogued, selectedSede, userName } = useSessionData();
  const today = getToday();

  const initialFormState = {
    norden: "",
    fecha: today,

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

    tgo: '',
    tgp: '',
    ggt: '',
    fosfAlc: '',
    biliTotal: '',
    biliInd: '',
    biliDir: '',
    protTot: '',
    albumina: '',
    globSer: '',

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
    handleFocusNext,
    handleClearnotO,
    handleClear,
    handlePrintDefault,
  } = useForm(initialFormState, { storageKey: "perfilHepatico" });

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

  const handleChangeBilirrubina = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      const total = parseFloat(next.biliTotal);
      const directa = parseFloat(next.biliDir);
      const diff = total - directa;
      const result = Number.isFinite(diff) ? (Math.round(diff * 100) / 100).toString() : '';
      next.biliInd = result;
      return next;
    });
  };

  const handleChangeGlobulina = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      const prot = parseFloat(next.protTot);
      const alb = parseFloat(next.albumina);
      const diff = prot - alb;
      const result = Number.isFinite(diff) ? (Math.round(diff * 100) / 100).toString() : '';
      next.globSer = result;
      return next;
    });
  };

  const handleSave = () => {
    SubmitDataService(form, token, userlogued, handleClear, tabla);
  };

  const handleEdit = () => {
    UpdateDataService(form, token, userlogued, handleClear, tabla);
  };

  // ===== Búsqueda con botón =====
  const executeSearch = () => {
    handleClearnotO();
    VerifyTR(form.norden, tabla, token, setForm, selectedSede);
  };

  // ===== Búsqueda con enter =====
  const handleSearch = (e) => {
    if (!e || e.key === 'Enter') {
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
      PrintHojaR(form.norden, token, tabla);
    });
  };

  const auditoria = buildAuditoria(form, {
    usuarioActual: userlogued,
    fechaHoraActual: getFechaHoraActual(),
  });

  const handleFieldChange = (name) => {
    if (name === 'biliTotal' || name === 'biliDir') return handleChangeBilirrubina;
    if (name === 'protTot' || name === 'albumina') return handleChangeGlobulina;
    return handleChange;
  };

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
            label="N° Orden"
            name="norden"
            value={form.norden}
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
        <InputTextOneLine
          label="Nombre del Examen"
          name="nombreExamen"
          value={form.nombreExamen}
          disabled
          labelWidth="120px"
        />
      </SectionFieldset>

      <DatosPersonalesLaborales form={form} />

      <SectionFieldset legend="Resultados" className='space-y-3'>
        <div className="flex justify-end">
          <button
            type="button"
            disabled={camposDeshabilitados}
            className="bg-red-600 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => {
              const text = form.fosfAlc == "N/A" ? "" : "N/A";
              setForm(prev => ({
                ...prev,
                fosfAlc: text,
                ggt: text,
                tgp: text,
                tgo: text,
                biliTotal: text,
                biliDir: text,
                biliInd: text,
                protTot: text,
                albumina: text,
                globSer: text,
              }))
            }}
          >
            N/A
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div className='space-y-4'>
            {testFields.slice(0, 5).map(({ label, name }) => (
              <InputTextOneLine
                key={name}
                label={label}
                name={name}
                value={form[name]}
                onChange={handleFieldChange(name)}
                onKeyUp={handleFocusNext}
                labelWidth="120px"
                disabled={camposDeshabilitados}
                edited={isFieldEdited(name)}
                onRevert={() => revertField(name)}
              />
            ))}
          </div>
          <div className='space-y-4'>
            {testFields.slice(5, 10).map(({ label, name }) => (
              <InputTextOneLine
                key={name}
                label={label}
                name={name}
                value={form[name]}
                onChange={handleFieldChange(name)}
                onKeyUp={handleFocusNext}
                labelWidth="120px"
                disabled={camposDeshabilitados}
                edited={isFieldEdited(name)}
                onRevert={() => revertField(name)}
              />
            ))}
          </div>
        </div>

      </SectionFieldset>

      <SectionFieldset legend="Asignación de Médico" className="space-y-4">
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
