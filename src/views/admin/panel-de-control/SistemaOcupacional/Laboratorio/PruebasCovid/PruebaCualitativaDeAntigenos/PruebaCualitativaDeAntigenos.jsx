import { useState, useEffect } from 'react';
import { useSessionData } from '../../../../../../hooks/useSessionData';
import { useForm } from '../../../../../../hooks/useForm';
import { useRegistroEditable } from '../../../../../../hooks/useRegistroEditable';
import { getToday, getFechaHoraActual } from '../../../../../../utils/helpers';
import { buildAuditoria } from '../../../../../../utils/auditoriaUtils';
import { PrintHojaR, SubmitDataService, UpdateDataService, VerifyTR } from './controllerPruebaCualitativaDeAntigenos';
import {
  InputTextOneLine,
  InputTextArea,
  InputCheckbox,
  InputsBooleanRadioGroup,
} from '../../../../../../components/reusableComponents/ResusableComponents';
import SectionFieldset from '../../../../../../components/reusableComponents/SectionFieldset';
import SearchButton from '../../../../../../components/reusableComponents/SearchButton';
import AccionesRegistroHeader from '../../../../../../components/reusableComponents/AccionesRegistroHeader';
import AuditoriaRegistro from '../../../../../../components/reusableComponents/AuditoriaRegistro';
import { getFetch } from '../../../../getFetch/getFetch';
import EmpleadoComboBox from '../../../../../../components/reusableComponents/EmpleadoComboBox';
import DatosPersonalesLaborales from '../../../../../../components/templates/DatosPersonalesLaborales';
import BotonesForm from '../../../../../../components/templates/BotonesForm';

const sintomasList = [
  'Tos', 'Dolor de garganta', 'Congestión nasal', 'Dificultad respiratoria',
  'Fiebre/Escalofrío', 'Malestar general', 'Pérdida olfato o gusto',
  'Diarrea', 'Náuseas/vómitos', 'Cefalea', 'Irritabilidad/confusión',
  'Dolor', 'Expectoración'
];

const DEFAULT_METODO = {
  metodo: 'Inmunocromatografía',
  sensibilidad: '94.55%',
  especificidad: '100.00%'
};

const tabla = 'examen_inmunologico';

// Campos que el usuario puede editar en este formulario (para resaltar/revertir cambios).
const CAMPOS_EDITABLES = [
  "fecha",
  "marsa",
  "marca",
  "resultado",
  "fechaSintomas",
  "sintomas",
  "observaciones",
  "user_medicoFirma",
  "nombre_medico",
  "user_doctorAsignado",
  "nombre_doctorAsignado",
];

export default function PruebaCualitativaDeAntigenos() {
  const { token, userlogued, selectedSede, userName } = useSessionData();
  const today = getToday();

  const [marcas, setMarcas] = useState([]);

  useEffect(() => {
    if (token) {
      getFetch(`/api/v01/ct/pruebasCovid/obtenerMarcasCovid`, token)
        .then((res) => {
          setMarcas(res);
        })
        .catch(() => {
          console.log('Error al obtener marcas de COVID-19');
        });
    }
  }, []);

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

    marca: '',
    doctor: 'N/A',
    resultado: false,
    fechaSintomas: today,
    sintomas: [],
    marsa: false,
    observaciones: '',

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
    handleChangeNumberDecimals,
    handleChangeSimple,
    handleRadioButtonBoolean,
    handleCheckBoxChange,
    handleClearnotO,
    handleClear,
    handlePrintDefault,
  } = useForm(initialFormState, { storageKey: "pruebaCualitativaDeAntigenos" });

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

  const handleSintomaChange = (sintoma, checked) => {
    const sintomasActuales = new Set(form.sintomas);
    checked ? sintomasActuales.add(sintoma) : sintomasActuales.delete(sintoma);
    const sintomasArray = [...sintomasActuales];

    // Obtener líneas actuales del campo observaciones
    const lineasActuales = (form.observaciones || "").split("\n");

    // Filtrar: deja todas las líneas que NO son síntomas conocidos
    const lineasNoSintomas = lineasActuales.filter((linea) => {
      const contenido = linea.trim().replace(/^- /, "").toLowerCase();
      return !sintomasList.some((s) => s.toLowerCase() === contenido);
    });

    // Agregar los síntomas seleccionados como nuevas líneas
    const nuevasLineasSintomas = sintomasArray.map((s) => `- ${s}`);

    // Combinar y limpiar doble salto de línea
    const nuevasObservaciones = [...lineasNoSintomas, ...nuevasLineasSintomas]
      .filter((linea, index, arr) => arr.indexOf(linea) === index)
      .join("\n");

    setForm(prev => ({
      ...prev,
      sintomas: sintomasArray,
      observaciones: nuevasObservaciones,
    }));
  };

  const handleObservacionesChange = (e) => {
    setForm(prev => ({
      ...prev,
      observaciones: e.target.value,
    }));
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
      <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="flex gap-x-3 w-full">
          <InputTextOneLine
            label="N° Orden"
            name="norden"
            value={form.norden}
            onChange={handleChangeNumberDecimals}
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
        <InputCheckbox
          label="MARSA"
          name="marsa"
          checked={form.marsa}
          onChange={handleCheckBoxChange}
          disabled={camposDeshabilitados}
        />
      </SectionFieldset>

      <DatosPersonalesLaborales form={form} />

      <SectionFieldset legend="Marca y Método" className="space-y-4">
        <div className="grid grid-cols-1  gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="font-semibold min-w-[120px] max-w-[120px]">
                Marca:
              </label>
              <select
                name="marca"
                value={form.marca}
                onChange={handleChangeSimple}
                disabled={camposDeshabilitados}
                className="border rounded px-2 py-1 w-full"
              >
                <option value="">--Seleccione--</option>
                {marcas.map((option) => (
                  <option key={option.id} value={option.mensaje}>
                    {option.mensaje}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="border rounded bg-gray-50 p-4 text-base min-h-[80px]">
            <div>
              <span className="font-semibold">Método:</span> {DEFAULT_METODO.metodo}
            </div>
            <div>
              <span className="font-semibold">Sensibilidad:</span> {DEFAULT_METODO.sensibilidad}
            </div>
            <div>
              <span className="font-semibold">Especificidad:</span> {DEFAULT_METODO.especificidad}
            </div>
          </div>
        </div>
      </SectionFieldset>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-3'>
        <SectionFieldset legend="Resultado">
          <InputsBooleanRadioGroup
            name="resultado"
            value={form.resultado}
            onChange={handleRadioButtonBoolean}
            trueLabel='Positivo'
            falseLabel='Negativo'
            disabled={camposDeshabilitados}
          />
        </SectionFieldset>

        <SectionFieldset legend="Fecha de Síntomas">
          <InputTextOneLine
            label="Fecha Síntomas"
            name="fechaSintomas"
            type="date"
            value={form.fechaSintomas}
            onChange={handleChangeSimple}
            disabled={camposDeshabilitados}
            edited={isFieldEdited("fechaSintomas")}
            onRevert={() => revertField("fechaSintomas")}
            labelWidth="140px"
          />
        </SectionFieldset>
      </div>
      <SectionFieldset legend="Síntomas y Observaciones" className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {sintomasList.map(s => (
            <label key={s} className="flex items-center gap-2 ">
              <input
                type="checkbox"
                checked={form.sintomas.includes(s)}
                disabled={camposDeshabilitados}
                onChange={(e) => handleSintomaChange(s, e.target.checked)}
              />
              {s}
            </label>
          ))}
        </div>
        <InputTextArea
          label="Observaciones"
          name="observaciones"
          value={form.observaciones}
          onChange={handleObservacionesChange}
          disabled={camposDeshabilitados}
          edited={isFieldEdited("observaciones")}
          onRevert={() => revertField("observaciones")}
          rows={4}
        />
      </SectionFieldset>
      {/* Médico */}
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
