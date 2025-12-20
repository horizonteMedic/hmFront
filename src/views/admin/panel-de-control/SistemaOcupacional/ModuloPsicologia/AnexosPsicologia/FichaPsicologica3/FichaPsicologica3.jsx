import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBroom, faPrint, faSave } from '@fortawesome/free-solid-svg-icons';
import { useForm } from '../../../../../../hooks/useForm';
import { getToday } from '../../../../../../utils/helpers';
import { useSessionData } from '../../../../../../hooks/useSessionData';
import { PrintHojaR, SubmitDataService, VerifyTR } from './controllerFichaPsicologica3';
import {
  InputsRadioGroup,
  InputTextArea,
  InputTextOneLine,
  InputCheckbox,
  RadioTable,
} from '../../../../../../components/reusableComponents/ResusableComponents';
import SectionFieldset from '../../../../../../components/reusableComponents/SectionFieldset';

const tabla = "ficha_psicologica_anexo03";
const today = getToday();

const orientacionItems = [
  { name: 'orientacionTiempo', label: 'Tiempo' },
  { name: 'orientacionEspacio', label: 'Espacio' },
  { name: 'orientacionPersona', label: 'Persona' },
];

const orientacionOptions = [
  { value: 'DESORIENTADO', label: 'Desorientado' },
  { value: 'ORIENTADO', label: 'Orientado' },
];

function DatosPersonales({
  form,
  handleChange,
  handleChangeNumber,
  handleChangeSimple,
  handleSearch,
}) {
  return (
    <div className="space-y-3">
      <SectionFieldset legend="Información del Examen">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <InputTextOneLine
            label="N° Orden"
            name="norden"
            value={form.norden}
            onKeyUp={handleSearch}
            onChange={handleChangeNumber}
            labelWidth="120px"
          />
          <InputTextOneLine
            label="Fecha Examen"
            name="fechaExamen"
            type="date"
            value={form.fechaExamen}
            onChange={handleChangeSimple}
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
        </div>
      </SectionFieldset>

      <SectionFieldset legend="Datos Personales">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 space-y-2">
          <InputTextOneLine
            label="Nombres"
            name="nombres"
            value={form.nombres}
            onChange={handleChange}
            disabled
            labelWidth="120px"
          />
          <div className="grid grid-cols-2 gap-4">
            <InputTextOneLine
              label="DNI"
              name="dni"
              value={form.dni}
              disabled
              labelWidth="120px"
            />
            <InputTextOneLine
              label="Sexo"
              name="sexo"
              value={form.sexo}
              disabled
              labelWidth="120px"
            />
          </div>
          <InputTextOneLine
            label="Apellidos"
            name="apellidos"
            value={form.apellidos}
            onChange={handleChange}
            disabled
            labelWidth="120px"
          />
          <InputTextOneLine
            label="Fecha Nacimiento"
            name="fechaNacimiento"
            value={form.fechaNacimiento}
            disabled
            labelWidth="120px"
          />
          <InputTextOneLine
            label="Lugar Nacimiento"
            name="lugarNacimiento"
            value={form.lugarNacimiento}
            disabled
            labelWidth="120px"
          />
          <InputTextOneLine
            label="Edad (Años)"
            name="edad"
            value={form.edad}
            disabled
            labelWidth="120px"
          />
          <InputTextOneLine
            label="Estado Civil"
            name="estadoCivil"
            value={form.estadoCivil}
            disabled
            labelWidth="120px"
          />
          <InputTextOneLine
            label="Grado Instrucción"
            name="gradoInstruccion"
            value={form.gradoInstruccion}
            disabled
            labelWidth="120px"
          />
        </div>
      </SectionFieldset>

      <SectionFieldset legend="Datos Laborales">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 space-y-2">
          <InputTextOneLine
            label="Empresa"
            name="empresa"
            value={form.empresa}
            onChange={handleChange}
            disabled
            labelWidth="120px"
          />
          <InputTextOneLine
            label="Tiempo de Experiencia"
            name="tiempoExperiencia"
            value={form.tiempoExperiencia}
            disabled
            labelWidth="120px"
          />
          <InputTextOneLine
            label="Contrata"
            name="contrata"
            value={form.contrata}
            onChange={handleChange}
            disabled
            labelWidth="120px"
          />
          <InputTextOneLine
            label="Puesto"
            name="puesto"
            value={form.puesto}
            onChange={handleChange}
            disabled
            labelWidth="120px"
          />
          <InputTextOneLine
            label="Área"
            name="area"
            value={form.area}
            onChange={handleChange}
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
        </div>
      </SectionFieldset>

      <SectionFieldset legend="Evaluación y Riesgos" className="grid grid-cols-1 lg:grid-cols-3 gap-x-4">
        <InputTextArea
          rows={5}
          label="Motivo Evaluación"
          name="motivoEvaluacion"
          value={form.motivoEvaluacion}
          onChange={handleChange}
        />
        <InputTextArea
          rows={5}
          label="Principales Riesgos"
          name="principalesRiesgos"
          value={form.principalesRiesgos}
          onChange={handleChange}
        />
        <InputTextArea
          rows={5}
          label="Medidas de Seguridad"
          name="medidasSeguridad"
          value={form.medidasSeguridad}
          onChange={handleChange}
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
          />
          <InputTextArea
            rows={5}
            label="Hábitos"
            name="habitos"
            value={form.habitos}
            onChange={handleChange}
          />
          <InputTextArea
            rows={5}
            label="Otras Observaciones"
            name="otrasObservaciones"
            value={form.otrasObservaciones}
            onChange={handleChange}
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
  handleCheckBoxChange,
  handleSave,
  handlePrint,
  handleClear,
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
            />
            <InputTextOneLine
              label="Pensamiento"
              name="pensamiento"
              value={form.pensamiento}
              onChange={handleChange}
              labelWidth="120px"
            />
            <InputTextOneLine
              label="Percepción"
              name="percepcion"
              value={form.percepcion}
              onChange={handleChange}
              labelWidth="120px"
            />
          </SectionFieldset>

          <SectionFieldset legend="Memoria">
            <InputsRadioGroup
              name="memoria"
              value={form.memoria}
              onChange={handleRadioButton}
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
            />
            <InputTextOneLine
              label="Sueño"
              name="sueno"
              value={form.sueno}
              onChange={handleChange}
              labelWidth="120px"
            />
            <InputTextOneLine
              label="Personalidad"
              name="personalidad"
              value={form.personalidad}
              onChange={handleChange}
              labelWidth="120px"
            />
            <InputTextOneLine
              label="Afectividad"
              name="afectividad"
              value={form.afectividad}
              onChange={handleChange}
              labelWidth="120px"
            />
            <InputTextOneLine
              label="Conducta Sexual"
              name="conductaSexual"
              value={form.conductaSexual}
              onChange={handleChange}
              labelWidth="120px"
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
            />
            <InputCheckbox
              label="Escala de Motivaciones Psicosociales - MPS"
              name="mps"
              checked={form.mps}
              onChange={handleCheckBoxChange}
            />
            <InputCheckbox
              label="Luria - DNA Diagnóstico neuropsicológico de Adultos"
              name="luria"
              checked={form.luria}
              onChange={handleCheckBoxChange}
            />
            <InputCheckbox
              label="Escala de Apreciación del Estrés EAE"
              name="eae"
              checked={form.eae}
              onChange={handleCheckBoxChange}
            />
            <InputCheckbox
              label="Inventario de Burnout de Maslach"
              name="maslach"
              checked={form.maslach}
              onChange={handleCheckBoxChange}
            />
            <InputCheckbox
              label="Clima laboral"
              name="climaLaboral"
              checked={form.climaLaboral}
              onChange={handleCheckBoxChange}
            />
            <InputCheckbox
              label="Batería de Conductores"
              name="conductores"
              checked={form.conductores}
              onChange={handleCheckBoxChange}
            />
            <InputCheckbox
              label="WAIS"
              name="wais"
              checked={form.wais}
              onChange={handleCheckBoxChange}
            />
            <InputCheckbox
              label="Test BENTON"
              name="benton"
              checked={form.benton}
              onChange={handleCheckBoxChange}
            />
            <InputCheckbox
              label="Test Bender"
              name="bender"
              checked={form.bender}
              onChange={handleCheckBoxChange}
            />
            <InputCheckbox
              label="Inventario de la ansiedad ZUNG"
              name="zungAnsiedad"
              checked={form.zungAnsiedad}
              onChange={handleCheckBoxChange}
            />
            <InputCheckbox
              label="Inventario de Depresión ZUNG"
              name="zungDepresion"
              checked={form.zungDepresion}
              onChange={handleCheckBoxChange}
            />
            <InputCheckbox
              label="Escala de Memoria de Wechsler"
              name="wechsler"
              checked={form.wechsler}
              onChange={handleCheckBoxChange}
            />
            <InputCheckbox
              label="Otras Pruebas"
              name="otrasPruebas"
              checked={form.otrasPruebas}
              onChange={handleCheckBoxChange}
            />
          </SectionFieldset>

          <SectionFieldset legend="Área Emocional">
            <InputTextArea
              name="areaEmocional"
              value={form.areaEmocional}
              onChange={handleChange}
              rows={8}
              className="w-full"
            />
          </SectionFieldset>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex gap-4">
          <button
            type="button"
            onClick={handleSave}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-base px-6 py-2 rounded flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faSave} /> Guardar/Actualizar
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="bg-yellow-400 hover:bg-yellow-500 text-white text-base px-6 py-2 rounded flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faBroom} /> Limpiar
          </button>
        </div>
        <div className="flex flex-col items-end">
          <span className="font-bold italic text-base mb-1">Imprimir</span>
          <div className="flex items-center gap-2">
            <input
              name="norden"
              value={form.norden}
              onChange={handleChange}
              className="border rounded px-2 py-1 text-base w-24"
            />
            <button
              type="button"
              onClick={handlePrint}
              className="bg-blue-600 hover:bg-blue-700 text-white text-base px-4 py-2 rounded flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faPrint} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FichaPsicologica3() {

  const { token, userlogued, selectedSede, datosFooter } =
    useSessionData();

  const initialFormState = {
    // ===== TAB: DATOS PERSONALES =====
    // Información General
    norden: "",
    fechaExamen: today,
    nombreExamen: "",
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
    gradoInstruccion: "",

    // Datos Laborales
    empresa: "",
    tiempoExperiencia: "",
    contrata: "",
    puesto: "",
    area: "",
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
    personalidad: "CUENTA CON RECUERDOS PERSONALES",
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
  };

  const {
    form,
    handleChange,
    handleRadioButton,
    handleChangeSimple,
    handleCheckBoxChange,
    handleChangeNumber,
    handleClearnotO,
    handlePrintDefault,
    handleClear,
    setForm,
  } = useForm(initialFormState, { storageKey: "fichaPsicologicaAnexo3" });

  const handleSave = () => {
    SubmitDataService(form, token, userlogued, handleClear, tabla, datosFooter);
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      handleClearnotO();
      VerifyTR(form.norden, tabla, token, setForm, selectedSede);
    }
  };

  const handlePrint = () => {
    handlePrintDefault(() => {
      PrintHojaR(form.norden, token, tabla, datosFooter);
    });
  };

  return (
    <div className="space-y-3 px-4 max-w-[90%] xl:max-w-[80%] mx-auto">
      <DatosPersonales
        form={form}
        handleChange={handleChange}
        handleChangeNumber={handleChangeNumber}
        handleChangeSimple={handleChangeSimple}
        handleSearch={handleSearch}
      />
      <ExamenMental
        form={form}
        handleChange={handleChange}
        handleRadioButton={handleRadioButton}
        handleCheckBoxChange={handleCheckBoxChange}
        handleSave={handleSave}
        handlePrint={handlePrint}
        handleClear={handleClear}
      />
    </div>
  );
};

