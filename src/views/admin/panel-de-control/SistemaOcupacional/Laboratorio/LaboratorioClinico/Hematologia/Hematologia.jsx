import { PrintHojaR, SubmitDataService, UpdateDataService, VerifyTR } from './ControllerHematologia';
import { useSessionData } from '../../../../../../hooks/useSessionData';
import { useForm } from '../../../../../../hooks/useForm';
import { useRegistroEditable } from '../../../../../../hooks/useRegistroEditable';
import { getToday, getFechaHoraActual } from '../../../../../../utils/helpers';
import { buildAuditoria } from '../../../../../../utils/auditoriaUtils';
import {
  InputTextOneLine,
  SectionFieldset
} from '../../../../../../components/reusableComponents/ResusableComponents';
import SearchButton from '../../../../../../components/reusableComponents/SearchButton';
import RegistroEstadoPill from '../../../../../../components/reusableComponents/RegistroEstadoPill';
import AuditoriaRegistro from '../../../../../../components/reusableComponents/AuditoriaRegistro';
import EmpleadoComboBox from '../../../../../../components/reusableComponents/EmpleadoComboBox';
import DatosPersonalesLaborales from '../../../../../../components/templates/DatosPersonalesLaborales';
import BotonesForm from '../../../../../../components/templates/BotonesForm';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

const PRUEBAS = [
  { key: 'hemoglobina', label: 'Hemoglobina' },
  { key: 'hematocrito', label: 'Hematocrito' },
  { key: 'hematies', label: 'Hematíes' },
  { key: 'volumen_corpuscular_medio', label: 'Volumen Corpuscular medio' },
  { key: 'hemoglobina_corpuscular_media', label: 'Hemoglobina Corpuscular media' },
  { key: 'concentracion_hemoglobina_corpuscular', label: 'Concentración de Hemoglobina Corp' },
  { key: 'leucocitos', label: 'Leucocitos' },
  { key: 'plaquetas', label: 'Plaquetas' }
];

const DIFERENCIAL = [
  { key: 'neutrofilos', label: 'Neutrófilos (%)' },
  { key: 'abastonados', label: 'Abastonados (%)' },
  { key: 'segmentados', label: 'Segmentados (%)' },
  { key: 'monocitos', label: 'Monocitos (%)' },
  { key: 'eosinofilos', label: 'Eosinófilos (%)' },
  { key: 'basofilos', label: 'Basófilos (%)' },
  { key: 'linfocitos', label: 'Linfocitos (%)' }
];

const tabla = 'hemograma_autom';

// Campos que el usuario puede editar en este formulario (para resaltar/revertir cambios).
const CAMPOS_EDITABLES = [
  'fecha',
  ...PRUEBAS.map(p => p.key),
  ...DIFERENCIAL.map(d => d.key),
  'user_medicoFirma',
  'nombre_medico',
  'user_doctorAsignado',
  'nombre_doctorAsignado',
];

export default function Hematologia() {
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

    // Pruebas
    hemoglobina: "",
    hematocrito: "",
    hematies: "",
    volumen_corpuscular_medio: "",
    hemoglobina_corpuscular_media: "",
    concentracion_hemoglobina_corpuscular: "",
    leucocitos: "",
    plaquetas: "",
    // Diferencial
    neutrofilos: "",
    abastonados: "",
    segmentados: "",
    monocitos: "",
    eosinofilos: "",
    basofilos: "",
    linfocitos: "",

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
    handleClearnotO,
    handleChangeNumber,
    handleChangeNumberDecimals,
    handleChangeSimple,
    handleFocusNext,
    handleClear,
    handlePrintDefault,
  } = useForm(initialFormState, { storageKey: "hemogramaAutomatizado" });

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
      <div className="sticky top-2 z-20 flex justify-end pointer-events-none">
        <RegistroEstadoPill
          tieneRegistro={form.tieneRegistro}
          className={hayRegistroCargado ? "" : "invisible"}
        />
        {hayRegistroCargado && form.tieneRegistro && !edicionHabilitada && (
          <button
            type="button"
            onClick={habilitarEdicion}
            className="pointer-events-auto inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-3 py-1.5 rounded-full shadow-sm transition-all duration-150 ease-out hover:shadow-lg active:scale-95"
          >
            <FontAwesomeIcon icon={faEdit} /> Habilitar edición
          </button>
        )}
      </div>

      <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 xl:grid-cols-3 gap-3 lg:gap-4">
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
          <SearchButton onClick={executeSearch} className="xl:hidden" />
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
          label="Nombre Examen"
          name="nombreExamen"
          value={form.nombreExamen}
          disabled
          labelWidth="120px"
        />
      </SectionFieldset>

      <DatosPersonalesLaborales form={form} />

      <div className="font-semibold text-center bg-gray-100 p-3 rounded">
        MUESTRA: SANGRE TOTAL C/ EDTA
      </div>

      <SectionFieldset legend="Resultados" className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SectionFieldset legend="Pruebas" className="space-y-3">
          {PRUEBAS.map(({ key, label }) => (
            <InputTextOneLine
              label={label}
              key={key}
              name={key}
              value={form[key]}
              onChange={handleChange}
              onKeyUp={handleFocusNext}
              labelWidth='200px'
              disabled={camposDeshabilitados}
              edited={isFieldEdited(key)}
              onRevert={() => revertField(key)}
            />
          ))}
        </SectionFieldset>
        <SectionFieldset legend="Recuento Diferencial" className="space-y-3">
          {DIFERENCIAL.map(({ key, label }) => (
            <InputTextOneLine
              label={label}
              key={key}
              name={key}
              value={form[key]}
              onChange={handleChange}
              onKeyUp={handleFocusNext}
              labelWidth='200px'
              disabled={camposDeshabilitados}
              edited={isFieldEdited(key)}
              onRevert={() => revertField(key)}
            />
          ))}
        </SectionFieldset>
      </SectionFieldset>

      <SectionFieldset legend="Especialista">
        <EmpleadoComboBox
          value={form.nombre_medico}
          form={form}
          label='Especialista que Certifica'
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
