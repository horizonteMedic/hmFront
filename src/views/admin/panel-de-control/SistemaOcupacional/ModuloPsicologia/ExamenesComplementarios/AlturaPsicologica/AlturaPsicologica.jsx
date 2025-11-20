import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faPrint, faBroom } from "@fortawesome/free-solid-svg-icons";
import {
  InputTextOneLine,
  InputTextArea,
  InputsBooleanRadioGroup,
  InputsRadioGroup,
  RadioTable,
} from "../../../../../../components/reusableComponents/ResusableComponents";
import { useSessionData } from "../../../../../../hooks/useSessionData";
import { getToday } from "../../../../../../utils/helpers";
import { useForm } from "../../../../../../hooks/useForm";
import { PrintHojaR, SubmitDataService, VerifyTR } from "./controllerAlturaPsicologica";
import { useTailwindBreakpoints } from "../../../../../../hooks/useTailwindBreakpoints";
import SectionFieldset from "../../../../../../components/reusableComponents/SectionFieldset";

const tabla = "";
const today = getToday();

export default function AlturaPsicologica() {
  const { token, userlogued, selectedSede, datosFooter } = useSessionData();
  const { isLgUp } = useTailwindBreakpoints();

  const initialFormState = {
    // Header - Información del examen
    norden: "",
    fechaExamen: today,
    nombreExamen: "INFORME PSICOLÓGICO - TRABAJO EN ALTURA",
    esApto: undefined,

    // Datos Personales
    nombres: "",
    apellidos: "",
    fechaNacimiento: "",
    edad: "",
    dni: "",
    sexo: "",
    lugarNacimiento: "",
    domicilioActual: "",
    estadoCivil: "",
    nivelEstudios: "",

    // Datos Laborales
    empresa: "",
    contrata: "",
    ocupacion: "",
    cargoDesempenar: "",

    // Criterios Psicológicos - Aspecto Intelectual (I/NPI/NP/NPS/S)
    razonamiento: "",
    memoria: "",
    atencionConcentracion: "",
    coordinacionVisoMotora: "",
    orientacionEspacial: "",

    // Aspectos de Personalidad
    estabilidad: "",
    ansiedadTendencias: "",
    consumoAlcohol: "",
    fobiaAltura: "",

    // Analisis y recomendaciones
    analisisResultados: "",
    recomendaciones: "",
  };

  const {
    form,
    setForm,
    handleChange,
    handleChangeNumber,
    handleChangeSimple,
    handleRadioButton,
    handleRadioButtonBoolean,
    handleClear,
    handleClearnotO,
    handlePrintDefault,
  } = useForm(initialFormState, { storageKey: "informePsicologicoAlturaPsicologia" });

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

  const itemsIntelectual = [
    { name: "razonamiento", label: "1.- Razonamiento" },
    { name: "memoria", label: "2.- Memoria" },
    { name: "atencionConcentracion", label: "3.- Atención y concentración" },
    { name: "coordinacionVisoMotora", label: "4.- Coordinación viso-motora" },
    { name: "orientacionEspacial", label: "5.- Orientación espacial" },
  ];

  const opcionesIntelectual = [
    { value: "I", label: "I" },
    { value: "NPI", label: "NPI" },
    { value: "NP", label: "NP" },
    { value: "NPS", label: "NPS" },
    { value: "S", label: "S" },
  ];

  return (
    <div className="space-y-6 p-4">
      {/* Header con información del examen */}
      <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 lg:grid-cols-4 gap-3">
        <InputTextOneLine
          label="N° Orden"
          name="norden"
          value={form.norden}
          onKeyUp={handleSearch}
          onChange={handleChangeNumber}
          labelWidth="120px"
        />
        <InputTextOneLine
          label="Fecha Entrevista"
          name="fechaExamen"
          type="date"
          value={form.fechaExamen}
          onChange={handleChangeSimple}
          labelWidth="120px"
        />
        <div className="flex gap-4 items-center col-span-2">
          <h4 className="font-semibold min-w-[120px] max-w-[120px]">Nombre del Examen:</h4>
          <select
            name="nombreExamen"
            value={form.nombreExamen}
            onChange={handleChangeSimple}
            className="border rounded px-2 py-1 text-base w-full"
          >
            <option value="INFORME PSICOLÓGICO - TRABAJO EN ALTURA">
              INFORME PSICOLÓGICO - TRABAJO EN ALTURA
            </option>
            <option value="INFORME PSICOLÓGICO - TRABAJO EN ALTURA/OBRAS">
              INFORME PSICOLÓGICO - TRABAJO EN ALTURA/OBRAS
            </option>
          </select>
        </div>
        <InputsBooleanRadioGroup
          name="esApto"
          label="Aptitud"
          labelWidth="120px"
          value={form.esApto}
          trueLabel="APTO"
          falseLabel="NO APTO"
          onChange={handleRadioButtonBoolean}
        />
      </SectionFieldset>

      {/* Datos necesarios */}
      <SectionFieldset legend="Datos Personales" className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <InputTextOneLine
          label="Nombres"
          name="nombres"
          value={form.nombres}
          disabled
          labelWidth="120px"
        />
        <div className="grid lg:grid-cols-2 gap-3">
          <InputTextOneLine
            label="Edad"
            name="edad"
            value={form.edad}
            disabled
            labelWidth="120px"
          />
          <InputTextOneLine
            label="Sexo"
            name="sexo"
            value={form.sexo}
            disabled
            labelWidth="120px" />
        </div>
        <InputTextOneLine
          label="Apellidos"
          name="apellidos"
          value={form.apellidos}
          disabled
          labelWidth="120px"
        />
        <div className="grid lg:grid-cols-2 gap-3">
          <InputTextOneLine
            label="DNI"
            name="dni"
            value={form.dni}
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
        </div>
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
          label="Domicilio Actual"
          name="domicilioActual"
          value={form.domicilioActual}
          disabled
          labelWidth="120px"
        />
        <InputTextOneLine
          label="Nivel Estudios"
          name="nivelEstudios"
          value={form.nivelEstudios}
          disabled
          labelWidth="120px"
        />
      </SectionFieldset>

      {/* Datos Laborales */}
      <SectionFieldset legend="Datos Laborales" className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <InputTextOneLine
          label="Empresa"
          name="empresa"
          value={form.empresa}
          disabled
          labelWidth="120px"
        />
        <InputTextOneLine
          label="Contrata"
          name="contrata"
          value={form.contrata}
          disabled
          labelWidth="120px"
        />
        <InputTextOneLine
          label="Ocupación"
          name="ocupacion"
          value={form.ocupacion}
          disabled
          labelWidth="120px"
        />
        <InputTextOneLine
          label="Cargo Desempeñar"
          name="cargoDesempenar"
          value={form.cargoDesempenar}
          disabled
          labelWidth="120px"
        />
      </SectionFieldset>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SectionFieldset legend="Aspecto Intelectual">
          <RadioTable
            items={itemsIntelectual}
            options={opcionesIntelectual}
            form={form}
            handleRadioButton={handleRadioButton}
            labelColumns={2}
          />
        </SectionFieldset>
        <SectionFieldset legend="Aspecto Personalidad" className="space-y-8">
          {/* Aspectos de Personalidad */}
          <InputsRadioGroup
            label="1.- Estabilidad"
            name="estabilidad"
            value={form.estabilidad}
            onChange={handleRadioButton}
            options={[
              { label: "INESTABLE", value: "INESTABLE" },
              { label: "ESTABLE", value: "ESTABLE" },
            ]}
            labelOnTop
          />
          <InputsRadioGroup
            label="2.- Nivel de ansiedad y tendencias"
            name="ansiedadTendencias"
            value={form.ansiedadTendencias}
            onChange={handleRadioButton}
            options={[
              { label: "CASO", value: "CASO" },
              { label: "NO CASO", value: "NO CASO" },
            ]}
            labelOnTop
          />
          <InputsRadioGroup
            label="3.- Consumo de alcohol"
            name="consumoAlcohol"
            value={form.consumoAlcohol}
            onChange={handleRadioButton}
            options={[
              { label: "CASO", value: "CASO" },
              { label: "NO CASO", value: "NO CASO" },
            ]}
            labelOnTop
          />
          <InputsRadioGroup
            label="4.- Fobia a la altura"
            name="fobiaAltura"
            value={form.fobiaAltura}
            onChange={handleRadioButton}
            options={[
              { label: "NADA", value: "NADA" },
              { label: "LIGERAMENTE", value: "LIGERAMENTE" },
              { label: "MODERADAMENTE", value: "MODERADAMENTE" },
              { label: "MARCADAMENTE", value: "MARCADAMENTE" },
              { label: "MIEDO EXTREMO", value: "MIEDO EXTREMO" },
            ]}
            labelOnTop
            vertical={!isLgUp}
          />
        </SectionFieldset>
      </div>

      {/* Análisis y Recomendaciones */}
      <SectionFieldset legend="Conclusiones Finales" className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputTextArea
          label="Análisis y Resultados"
          name="analisisResultados"
          value={form.analisisResultados}
          onChange={handleChange}
          rows={4}
        />
        <InputTextArea
          label="Recomendaciones"
          name="recomendaciones"
          value={form.recomendaciones}
          onChange={handleChange}
          rows={4}
        />
      </SectionFieldset>

      {/* Acciones */}
      <section className="flex flex-col md:flex-row justify-between items-center gap-4 px-4">
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
              onChange={handleChangeNumber}
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
      </section>
    </div>
  );
}