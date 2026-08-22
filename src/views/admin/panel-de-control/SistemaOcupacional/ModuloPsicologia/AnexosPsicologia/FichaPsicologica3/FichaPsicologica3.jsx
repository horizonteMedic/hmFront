import { useForm } from '../../../../../../hooks/useForm';
import { useRegistroEditable } from '../../../../../../hooks/useRegistroEditable';
import { getToday, getFechaHoraActual } from '../../../../../../utils/helpers';
import { buildAuditoria } from '../../../../../../utils/auditoriaUtils';
import { useSessionData } from '../../../../../../hooks/useSessionData';
import { PrintHojaR, SubmitDataService, UpdateDataService, VerifyTR } from './controllerFichaPsicologica3';
import {
  InputsRadioGroup,
  InputTextArea,
  InputTextOneLine,
  InputsBooleanRadioGroup,
  InputCheckbox,
  RadioTable,
} from '../../../../../../components/reusableComponents/ResusableComponents';
import SectionFieldset from '../../../../../../components/reusableComponents/SectionFieldset';
import SearchButton from '../../../../../../components/reusableComponents/SearchButton';
import RegistroEstadoPill from '../../../../../../components/reusableComponents/RegistroEstadoPill';
import AuditoriaRegistro from '../../../../../../components/reusableComponents/AuditoriaRegistro';
import BotonesForm from '../../../../../../components/templates/BotonesForm';
import EmpleadoComboBox from '../../../../../../components/reusableComponents/EmpleadoComboBox';
import DatosPersonalesLaborales from '../../../../../../components/templates/DatosPersonalesLaborales';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

const tabla = "ficha_psicologica_anexo03";

const orientacionItems = [
  { name: 'orientacionTiempo', label: 'Tiempo' },
  { name: 'orientacionEspacio', label: 'Espacio' },
  { name: 'orientacionPersona', label: 'Persona' },
];

const orientacionOptions = [
  { value: 'DESORIENTADO', label: 'Desorientado' },
  { value: 'ORIENTADO', label: 'Orientado' },
];

// Campos que el usuario puede editar en este formulario (para resaltar/revertir cambios).
const CAMPOS_EDITABLES = ["fechaExamen", "esApto", "areaCognitiva", "areaEmocional", "user_medicoFirma", "nombre_medico"];

function EvaluacionRiesgosHistoria({
  form,
  handleChange,
  disabled,
}) {
  return (
    <div className="space-y-3">
      <SectionFieldset legend="Evaluación y Riesgos" className="grid grid-cols-1 lg:grid-cols-3 gap-x-4">
        <InputTextArea
          rows={5}
          label="Motivo Evaluación"
          name="motivoEvaluacion"
          value={form.motivoEvaluacion}
          onChange={handleChange}
          disabled={disabled}
        />
        <InputTextArea
          rows={5}
          label="Principales Riesgos"
          name="principalesRiesgos"
          value={form.principalesRiesgos}
          onChange={handleChange}
          disabled={disabled}
        />
        <InputTextArea
          rows={5}
          label="Medidas de Seguridad"
          name="medidasSeguridad"
          value={form.medidasSeguridad}
          onChange={handleChange}
          disabled={disabled}
        />
      </SectionFieldset>

      <SectionFieldset legend="Historia y Observaciones">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-4">
          <InputTextArea
            rows={5}
            label="Historia Familiar"
            name="historiaFamiliar"
            value={form.historiaFamiliar}
            onChange={handleChange}
            disabled={disabled}
          />
          <InputTextArea
            rows={5}
            label="Hábitos"
            name="habitos"
            value={form.habitos}
            onChange={handleChange}
            disabled={disabled}
          />
          <InputTextArea
            rows={5}
            label="Otras Observaciones"
            name="otrasObservaciones"
            value={form.otrasObservaciones}
            onChange={handleChange}
            disabled={disabled}
          />
        </div>
      </SectionFieldset>

      <SectionFieldset legend="Experiencia Laboral">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-[11px]">
            <thead>
              <tr className="bg-blue-100">
                <th className="border border-gray-300 px-2 py-1 text-left text-[11px] font-semibold">Fecha</th>
                <th className="border border-gray-300 px-2 py-1 text-left text-[11px] font-semibold">Empresa</th>
                <th className="border border-gray-300 px-2 py-1 text-left text-[11px] font-semibold">Actividad Empresa</th>
                <th className="border border-gray-300 px-2 py-1 text-left text-[11px] font-semibold">Puesto</th>
                <th className="border border-gray-300 px-2 py-1 text-left text-[11px] font-semibold">Sup</th>
                <th className="border border-gray-300 px-2 py-1 text-left text-[11px] font-semibold">Sub</th>
                <th className="border border-gray-300 px-2 py-1 text-left text-[11px] font-semibold">CausaRetiro</th>
              </tr>
            </thead>
            <tbody>
              {form.empresasAnteriores.length === 0 ? (
                <tr>
                  <td colSpan="7" className="border border-gray-300 px-2 py-4 text-center text-gray-500 text-[11px]">
                    No hay empresas registradas
                  </td>
                </tr>
              ) : (
                form.empresasAnteriores.map((empresa, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 px-2 py-1 text-[11px]">{empresa.fecha}</td>
                    <td className="border border-gray-300 px-2 py-1 text-[11px]">{empresa.empresa}</td>
                    <td className="border border-gray-300 px-2 py-1 text-[11px]">{empresa.actividad}</td>
                    <td className="border border-gray-300 px-2 py-1 text-[11px]">{empresa.ocupacion}</td>
                    <td className="border border-gray-300 px-2 py-1 text-[11px]">{empresa.superficie}</td>
                    <td className="border border-gray-300 px-2 py-1 text-[11px]">{empresa.socavon}</td>
                    <td className="border border-gray-300 px-2 py-1 text-[11px]">{empresa.causaRetiro}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </SectionFieldset>
    </div>
  );
}

function ExamenMental({
  form,
  handleChange,
  handleRadioButton,
  handleChangeSimple,
  handleCheckBoxChange,
  disabled,
  isFieldEdited,
  revertField,
  isMedicoEdited,
  revertMedico,
}) {
  return (
    <div className=" space-y-3">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="space-y-3">
          <SectionFieldset legend="Observación de Conductas" className="grid grid-cols-2 gap-4">

            <SectionFieldset legend="Presentación" >
              <InputsRadioGroup
                name="presentacion"
                value={form.presentacion}
                onChange={handleRadioButton}
                vertical
                disabled={disabled}
                options={[
                  { label: 'Adecuado', value: 'ADECUADO' },
                  { label: 'Inadecuado', value: 'INADECUADO' },
                ]}

              />
            </SectionFieldset>

            <SectionFieldset legend="Postura" >
              <InputsRadioGroup
                name="postura"
                value={form.postura}
                onChange={handleRadioButton}
                vertical
                disabled={disabled}
                options={[
                  { label: 'Erguida', value: 'ERGUIDA' },
                  { label: 'Encorvada', value: 'ENCORVADA' },
                ]}
              />
            </SectionFieldset>

            <SectionFieldset legend="Discurso: Ritmo">
              <InputsRadioGroup
                name="ritmo"
                value={form.ritmo}
                onChange={handleRadioButton}
                vertical
                disabled={disabled}
                options={[
                  { label: 'Lento', value: 'LENTO' },
                  { label: 'Rápido', value: 'RAPIDO' },
                  { label: 'Fluido', value: 'FLUIDO' },
                ]}
              />
            </SectionFieldset>

            <SectionFieldset legend="Discurso: Tono" >
              <InputsRadioGroup
                name="tono"
                value={form.tono}
                onChange={handleRadioButton}
                vertical
                disabled={disabled}
                options={[
                  { label: 'Bajo', value: 'BAJO' },
                  { label: 'Moderado', value: 'MODERADO' },
                  { label: 'Alto', value: 'ALTO' },
                ]}
              />
            </SectionFieldset>

            <SectionFieldset legend="Discurso: Articulación" >
              <InputsRadioGroup
                name="articulacion"
                value={form.articulacion}
                onChange={handleRadioButton}
                vertical
                disabled={disabled}
                options={[
                  { label: 'Con dificultad', value: 'CON_DIFICULTAD' },
                  { label: 'Sin dificultad', value: 'SIN_DIFICULTAD' },
                ]}
              />
            </SectionFieldset>

            <SectionFieldset legend="Orientación" fieldsetClassName="col-span-2">
              <RadioTable
                items={orientacionItems}
                options={orientacionOptions}
                form={form}
                handleRadioButton={handleRadioButton}
                labelColumns={1}
                disabled={disabled}
              />
            </SectionFieldset>
          </SectionFieldset>

          <SectionFieldset legend="Área Cognitiva" >
            <InputTextArea
              name="areaCognitiva"
              value={form.areaCognitiva}
              onChange={handleChange}
              rows={6}
              className="w-full"
              disabled={disabled}
              edited={isFieldEdited("areaCognitiva")}
              onRevert={() => revertField("areaCognitiva")}
            />
          </SectionFieldset>
        </div>

        <div className="space-y-3">
          <SectionFieldset legend="Procesos Cognitivos" className="space-y-3">
            <InputTextOneLine
              label="Lucido, atento"
              name="lucidoAtento"
              value={form.lucidoAtento}
              onChange={handleChange}
              labelWidth="120px"
              disabled={disabled}
            />
            <InputTextOneLine
              label="Pensamiento"
              name="pensamiento"
              value={form.pensamiento}
              onChange={handleChange}
              labelWidth="120px"
              disabled={disabled}
            />
            <InputTextOneLine
              label="Percepción"
              name="percepcion"
              value={form.percepcion}
              onChange={handleChange}
              labelWidth="120px"
              disabled={disabled}
            />
          </SectionFieldset>

          <SectionFieldset legend="Memoria">
            <InputsRadioGroup
              name="memoria"
              value={form.memoria}
              onChange={handleRadioButton}
              disabled={disabled}
              options={[
                { label: 'Corto Plazo', value: 'CORTO_PLAZO' },
                { label: 'Mediano Plazo', value: 'MEDIANO_PLAZO' },
                { label: 'Largo Plazo', value: 'LARGO_PLAZO' },
              ]}
            />
          </SectionFieldset>

          <SectionFieldset legend="Inteligencia" className="grid grid-cols-2 gap-x-4 gap-y-3">
            <InputsRadioGroup
              name="inteligencia"
              value={form.inteligencia}
              onChange={handleRadioButton}
              vertical
              disabled={disabled}
              options={[
                { label: 'Muy Superior', value: 'MUY_SUPERIOR' },
                { label: 'Superior', value: 'SUPERIOR' },
                { label: 'Normal Brillante', value: 'NORMAL_BRILLANTE' },
                { label: 'Promedio', value: 'PROMEDIO' },
                { label: 'N.Torpe', value: 'N_TORPE' },
              ]}
            />
            <InputsRadioGroup
              name="inteligencia"
              value={form.inteligencia}
              onChange={handleRadioButton}
              vertical
              disabled={disabled}
              options={[
                { label: 'Fronterizo', value: 'FRONTERIZO' },
                { label: 'RM Leve', value: 'RM_LEVE' },
                { label: 'RM Moderado', value: 'RM_MODERADO' },
                { label: 'RM Severo', value: 'RM_SEVERO' },
                { label: 'RM Profundo', value: 'RM_PROFUNDO' },
              ]}
            />
          </SectionFieldset>

          <SectionFieldset legend="Otros Procesos" className="space-y-3">
            <InputTextOneLine
              label="Apetito"
              name="apetito"
              value={form.apetito}
              onChange={handleChange}
              labelWidth="120px"
              disabled={disabled}
            />
            <InputTextOneLine
              label="Sueño"
              name="sueno"
              value={form.sueno}
              onChange={handleChange}
              labelWidth="120px"
              disabled={disabled}
            />
            <InputTextOneLine
              label="Personalidad"
              name="personalidad"
              value={form.personalidad}
              onChange={handleChange}
              labelWidth="120px"
              disabled={disabled}
            />
            <InputTextOneLine
              label="Afectividad"
              name="afectividad"
              value={form.afectividad}
              onChange={handleChange}
              labelWidth="120px"
              disabled={disabled}
            />
            <InputTextOneLine
              label="Conducta Sexual"
              name="conductaSexual"
              value={form.conductaSexual}
              onChange={handleChange}
              labelWidth="120px"
              disabled={disabled}
            />
          </SectionFieldset>
        </div>

        <div className="space-y-3">
          <SectionFieldset legend="Puntaje Nombre" className="space-y-3">
            <InputCheckbox
              label="Inventario Millón de Estilos de Personalidad - MIPS"
              name="mips"
              checked={form.mips}
              onChange={handleCheckBoxChange}
              disabled={disabled}
            />
            <InputCheckbox
              label="Escala de Motivaciones Psicosociales - MPS"
              name="mps"
              checked={form.mps}
              onChange={handleCheckBoxChange}
              disabled={disabled}
            />
            <InputCheckbox
              label="Luria - DNA Diagnóstico neuropsicológico de Adultos"
              name="luria"
              checked={form.luria}
              onChange={handleCheckBoxChange}
              disabled={disabled}
            />
            <InputCheckbox
              label="Escala de Apreciación del Estrés EAE"
              name="eae"
              checked={form.eae}
              onChange={handleCheckBoxChange}
              disabled={disabled}
            />
            <InputCheckbox
              label="Inventario de Burnout de Maslach"
              name="maslach"
              checked={form.maslach}
              onChange={handleCheckBoxChange}
              disabled={disabled}
            />
            <InputCheckbox
              label="Clima laboral"
              name="climaLaboral"
              checked={form.climaLaboral}
              onChange={handleCheckBoxChange}
              disabled={disabled}
            />
            <InputCheckbox
              label="Batería de Conductores"
              name="conductores"
              checked={form.conductores}
              onChange={handleCheckBoxChange}
              disabled={disabled}
            />
            <InputCheckbox
              label="WAIS"
              name="wais"
              checked={form.wais}
              onChange={handleCheckBoxChange}
              disabled={disabled}
            />
            <InputCheckbox
              label="Test BENTON"
              name="benton"
              checked={form.benton}
              onChange={handleCheckBoxChange}
              disabled={disabled}
            />
            <InputCheckbox
              label="Test Bender"
              name="bender"
              checked={form.bender}
              onChange={handleCheckBoxChange}
              disabled={disabled}
            />
            <InputCheckbox
              label="Inventario de la ansiedad ZUNG"
              name="zungAnsiedad"
              checked={form.zungAnsiedad}
              onChange={handleCheckBoxChange}
              disabled={disabled}
            />
            <InputCheckbox
              label="Inventario de Depresión ZUNG"
              name="zungDepresion"
              checked={form.zungDepresion}
              onChange={handleCheckBoxChange}
              disabled={disabled}
            />
            <InputCheckbox
              label="Escala de Memoria de Wechsler"
              name="wechsler"
              checked={form.wechsler}
              onChange={handleCheckBoxChange}
              disabled={disabled}
            />
            <InputCheckbox
              label="Otras Pruebas"
              name="otrasPruebas"
              checked={form.otrasPruebas}
              onChange={handleCheckBoxChange}
              disabled={disabled}
            />
          </SectionFieldset>

          <SectionFieldset legend="Área Emocional">
            <InputTextArea
              name="areaEmocional"
              value={form.areaEmocional}
              onChange={handleChange}
              rows={8}
              className="w-full"
              disabled={disabled}
              edited={isFieldEdited("areaEmocional")}
              onRevert={() => revertField("areaEmocional")}
            />
          </SectionFieldset>
        </div>
      </div>

      <SectionFieldset legend="Asignación de Médico">
        <EmpleadoComboBox
          value={form.nombre_medico}
          label="Especialista"
          form={form}
          onChange={handleChangeSimple}
          disabled={disabled}
          edited={isMedicoEdited}
          onRevert={revertMedico}
        />
      </SectionFieldset>
    </div>
  );
}

export default function FichaPsicologica3() {
  const today = getToday();
  const { token, userlogued, selectedSede, datosFooter, userName } =
    useSessionData();

  const initialFormState = {
    // ===== TAB: DATOS PERSONALES =====
    // Información General
    norden: "",
    fechaExamen: today,
    nombreExamen: "",
    esApto: undefined,
    codigoAnexo: null,

    // Datos Personales
    nombres: "",
    dni: "",
    sexo: "",
    apellidos: "",
    fechaNacimiento: "",
    lugarNacimiento: "",
    edad: "",
    estadoCivil: "",
    nivelEstudios: "",

    // Datos Laborales
    empresa: "",
    tiempoExperiencia: "",
    contrata: "",
    cargoDesempenar: "",
    ocupacion: "",
    mineralExp: "",
    explotacionEn: "",
    alturaLabor: "",

    // Evaluación y Riesgos
    motivoEvaluacion: "",
    principalesRiesgos: "",
    medidasSeguridad: "",

    // Historia y Observaciones
    historiaFamiliar: "",
    habitos: "",
    otrasObservaciones: "",

    // Anteriores Empresas - Lista almacenada
    empresasAnteriores: [],

    // ===== TAB: EXAMEN MENTAL =====
    // Observación de Conductas - Presentación
    presentacion: "ADECUADO",

    // Observación de Conductas - Postura
    postura: "ERGUIDA",

    // Observación de Conductas - Discurso
    ritmo: "FLUIDO",
    tono: "MODERADO",
    articulacion: "SIN_DIFICULTAD",

    // Observación de Conductas - Orientación
    orientacionTiempo: "ORIENTADO",
    orientacionEspacio: "ORIENTADO",
    orientacionPersona: "ORIENTADO",

    // Observación de Conductas - Área Cognitiva
    areaCognitiva: "",

    // Procesos Cognitivos
    lucidoAtento: "NORMOPROSEXICO",
    pensamiento: "CONCRETO",
    percepcion: "NIEGA ALUCINACIONES",
    memoria: null,
    inteligencia: null,
    apetito: "ADECUADO",
    sueno: "SIN DIFICULTAD",
    personalidad: "CUENTA CON RECURSOS PERSONALES",
    afectividad: "EUTIMICO",
    conductaSexual: "NORMAL",

    // Pruebas Psicológicas - Ptje Nombre
    mips: true,
    mps: true,
    luria: true,
    eae: false,
    maslach: false,
    climaLaboral: false,
    conductores: false,
    wais: false,
    benton: false,
    bender: false,
    zungAnsiedad: true,
    zungDepresion: true,
    wechsler: true,
    otrasPruebas: true,

    // Pruebas Psicológicas - Área Emocional
    areaEmocional: "",

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
    handleChange,
    handleRadioButton,
    handleRadioButtonBoolean,
    handleChangeSimple,
    handleCheckBoxChange,
    handleChangeNumber,
    handleChangeNumberDecimals,
    handleClearnotO,
    handlePrintDefault,
    handleClear,
    setForm,
  } = useForm(initialFormState, { storageKey: "fichaPsicologicaAnexo3" });

  const {
    edicionHabilitada,
    habilitarEdicion,
    camposDeshabilitados,
    isFieldEdited,
    revertField,
    revertFields,
  } = useRegistroEditable(form, setForm, { tieneRegistro: form.tieneRegistro, camposEditables: CAMPOS_EDITABLES });

  // El médico se compone de 2 campos (id de firma + nombre): se detecta el cambio por
  // el id y se revierten ambos en conjunto.
  const isMedicoEdited = isFieldEdited("user_medicoFirma");
  const revertMedico = () => revertFields(["user_medicoFirma", "nombre_medico"]);

  const handleSave = () => {
    SubmitDataService(form, token, userlogued, handleClear, tabla, datosFooter);
  };

  const handleEdit = () => {
    UpdateDataService(form, token, userlogued, handleClear, tabla, datosFooter);
  };

  // ===== Búsqueda con botón =====
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

  const hayRegistroCargado = Boolean(form.nombres || form.apellidos);

  const handlePrintNordenChange = (e) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return; // solo dígitos

    const hayDatosCargados = Boolean(form.nombres || form.apellidos || form.tieneRegistro);
    if (hayDatosCargados && value !== form.norden) {
      setForm({ ...initialFormState, norden: value });
    } else {
      setForm((f) => ({ ...f, norden: value }));
    }
  };

  const handlePrint = () => {
    handlePrintDefault(() => {
      PrintHojaR(form.norden, token, tabla, datosFooter, selectedSede);
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

      <SectionFieldset legend="Información del Examen">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="flex gap-x-3 w-full">
            <InputTextOneLine
              label="N° Orden"
              name="norden"
              value={form.norden}
              onKeyUp={handleSearch}
              onChange={handleChangeNumber}
              disabled={hayRegistroCargado}
              labelWidth="120px"
              className="w-full"
            />
            <SearchButton onClick={executeSearch} className="lg:hidden" />
          </div>
          <InputTextOneLine
            label="Fecha Examen"
            name="fechaExamen"
            type="date"
            value={form.fechaExamen}
            onChange={handleChangeSimple}
            // disabled={disabled}
            edited={isFieldEdited("fechaExamen")}
            onRevert={() => revertField("fechaExamen")}
            labelWidth="120px"
          />
          <InputTextOneLine
            label="Nombre Examen"
            name="nombreExamen"
            type="text"
            value={form.nombreExamen}
            disabled
            labelWidth="120px"
          />
          <InputsBooleanRadioGroup
            label="Aptitud"
            labelWidth="120px"
            name="esApto"
            value={form.esApto}
            trueLabel="APTO"
            falseLabel="NO APTO"
            onChange={handleRadioButtonBoolean}
            // disabled={disabled}
            edited={isFieldEdited("esApto")}
            onRevert={() => revertField("esApto")}
          />
        </div>
      </SectionFieldset>

      <DatosPersonalesLaborales form={form} />

      <SectionFieldset legend="Datos Laborales (Adicional)">
        <InputTextOneLine
          label="Tiempo de Experiencia"
          name="tiempoExperiencia"
          value={form.tiempoExperiencia}
          disabled
          labelWidth="120px"
        />
        <InputTextOneLine
          label="Mineral Exp"
          name="mineralExp"
          value={form.mineralExp}
          onChange={handleChange}
          disabled
          labelWidth="120px"
        />
        <InputTextOneLine
          label="Explotación en"
          name="explotacionEn"
          value={form.explotacionEn}
          onChange={handleChange}
          disabled
          labelWidth="120px"
        />
        <InputTextOneLine
          label="Altura de Labor"
          name="alturaLabor"
          value={form.alturaLabor}
          onChange={handleChange}
          disabled
          labelWidth="120px"
        />

      </SectionFieldset>

      <EvaluacionRiesgosHistoria
        form={form}
        handleChange={handleChange}
        disabled={camposDeshabilitados}
      />
      <ExamenMental
        form={form}
        handleChange={handleChange}
        handleRadioButton={handleRadioButton}
        handleChangeSimple={handleChangeSimple}
        handleCheckBoxChange={handleCheckBoxChange}
        disabled={camposDeshabilitados}
        isFieldEdited={isFieldEdited}
        revertField={revertField}
        isMedicoEdited={isMedicoEdited}
        revertMedico={revertMedico}
      />

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
