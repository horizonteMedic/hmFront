import { useSessionData } from '../../../../../../hooks/useSessionData';
import { useForm } from '../../../../../../hooks/useForm';
import { useRegistroEditable } from '../../../../../../hooks/useRegistroEditable';
import { getToday, getFechaHoraActual } from '../../../../../../utils/helpers';
import { buildAuditoria } from '../../../../../../utils/auditoriaUtils';
import { PrintHojaR, SubmitDataService, UpdateDataService, VerifyTR } from './controllerPanel10D';
import {
  InputTextOneLine,
  InputsRadioGroup,
} from '../../../../../../components/reusableComponents/ResusableComponents';
import SectionFieldset from '../../../../../../components/reusableComponents/SectionFieldset';
import SearchButton from '../../../../../../components/reusableComponents/SearchButton';
import AccionesRegistroHeader from '../../../../../../components/reusableComponents/AccionesRegistroHeader';
import AuditoriaRegistro from '../../../../../../components/reusableComponents/AuditoriaRegistro';
import EmpleadoComboBox from '../../../../../../components/reusableComponents/EmpleadoComboBox';
import DatosPersonalesLaborales from '../../../../../../components/templates/DatosPersonalesLaborales';
import BotonesForm from '../../../../../../components/templates/BotonesForm';

const tabla = 'panel10d';

const PRUEBAS = [
  { label: 'Cocaína (COC)', name: 'valueC' },
  { label: 'Marihuana (THC)', name: 'valueM' },
  { label: 'Anfetamina (AMP)', name: 'valueAn' },
  { label: 'Metanfetaminas', name: 'valueMet' },
  { label: 'Benzodiazepina', name: 'valueBen' },
  { label: 'Opiáceos (OPI)', name: 'valueOpi' },
  { label: 'Barbitúricos (BAR)', name: 'valueBar' },
  { label: 'Metadona (MTD)', name: 'valueMetadona' },
  { label: 'Fenciclidina (PCP)', name: 'valueFenci' },
  { label: 'Antidepresivos Ticíclicos (TCA)', name: 'valueAnti' },
];

// Campos que el usuario puede editar en este formulario (para resaltar/revertir cambios).
const CAMPOS_EDITABLES = [
  "fecha",
  "metodo",
  ...PRUEBAS.map(p => p.name),
  "user_medicoFirma",
  "nombre_medico",
  "user_doctorAsignado",
  "nombre_doctorAsignado",
];

export default function Panel10D() {
  const { token, userlogued, selectedSede, userName } = useSessionData();
  const today = getToday();

  const initialFormState = {
    norden: '',
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

    valueM: 'NEGATIVO',
    valueC: 'NEGATIVO',
    valueAn: 'NEGATIVO',
    valueMet: 'NEGATIVO',
    valueBen: 'NEGATIVO',
    valueOpi: 'NEGATIVO',
    valueBar: 'NEGATIVO',
    valueMetadona: 'NEGATIVO',
    valueFenci: 'NEGATIVO',
    valueAnti: 'NEGATIVO',
    metodo: 'INMUNOCROMATOGRAFICO',

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
    handleRadioButton,
    handleChangeSimple,
    handleClearnotO,
    handleClear,
    handlePrintDefault,
  } = useForm(initialFormState, { storageKey: "panel10d" });

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

  return (
    <div className="space-y-3 px-4 max-w-[90%] xl:max-w-[80%] mx-auto">
      <AccionesRegistroHeader
        tieneRegistro={form.tieneRegistro}
        hayRegistroCargado={hayRegistroCargado}
        edicionHabilitada={edicionHabilitada}
        onHabilitarEdicion={habilitarEdicion}
        onLimpiar={handleClear}
      />

      {/* Información del Examen */}
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

      {/* Resultados */}
      <SectionFieldset legend="Resultados">
        <InputTextOneLine
          label='Prueba Rápida Cualitativa'
          name="metodo"
          value={form.metodo}
          onChange={handleChange}
          labelWidth='120px'
          disabled={camposDeshabilitados}
          edited={isFieldEdited("metodo")}
          onRevert={() => revertField("metodo")}
        />
        <div className="grid gap-x-4 gap-y-3">
          {PRUEBAS.map(({ label, name }) => (
            <div className="flex gap-4" key={name}>
              <InputTextOneLine
                label={label}
                name={name}
                value={form[name]}
                onChange={handleChange}
                labelWidth='120px'
                className='w-full max-w-[85%]'
                disabled={camposDeshabilitados}
                edited={isFieldEdited(name)}
                onRevert={() => revertField(name)}
              />
              <InputsRadioGroup
                name={name}
                value={form[name]}
                onChange={handleRadioButton}
                options={[
                  { label: 'Positivo', value: 'POSITIVO' },
                  { label: 'Negativo', value: 'NEGATIVO' }
                ]}
                disabled={camposDeshabilitados}
              />
            </div>
          ))}
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
