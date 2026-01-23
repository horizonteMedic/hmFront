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
import BotonesAccion from "../../../../../../components/templates/BotonesAccion";
import DatosPersonalesLaborales from "../../../../../../components/templates/DatosPersonalesLaborales";
import EmpleadoComboBox from "../../../../../../components/reusableComponents/EmpleadoComboBox";

const tabla = "psicologiafobias";

export default function AlturaPsicologica() {
  const today = getToday();
  const { token, userlogued, selectedSede, datosFooter, userName } = useSessionData();
  const { isLgUp } = useTailwindBreakpoints();

  const initialFormState = {
    // Header - Información del examen
    norden: "",
    fechaExamen: today,
    nombreExamen: "INFORME PSICOLÓGICO - TRABAJO EN ALTURA",
    esApto: undefined,

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

    // Criterios Psicológicos - Aspecto Intelectual (I/NPI/NP/NPS/S)
    razonamiento: "",
    memoria: "",
    atencionConcentracion: "",
    coordinacionVisoMotora: "",
    orientacionEspacial: "",

    // Aspectos de Personalidad
    estabilidad: "ESTABLE",
    ansiedadTendencias: "NO CASO",
    consumoAlcohol: "NO CASO",
    fobiaAltura: "NADA",

    // Analisis y recomendaciones
    analisisResultados: "",
    recomendaciones: "",


    // Médico que Certifica //BUSCADOR
    nombre_medico: userName,
    user_medicoFirma: userlogued,
  };

  const {
    form,
    setForm,
    handleChange,
    handleChangeNumberDecimals,
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
    <div className="space-y-3 px-4 max-w-[90%] xl:max-w-[80%] mx-auto">
      {/* Header con información del examen */}
      <SectionFieldset legend="Información del Examen" className="grid 2xl:grid-cols-4 gap-3">
        <InputTextOneLine
          label="N° Orden"
          name="norden"
          value={form.norden}
          onKeyUp={handleSearch}
          onChange={handleChangeNumberDecimals}
          labelWidth="120px"
        />
        <InputTextOneLine
          label="Fecha"
          name="fechaExamen"
          type="date"
          value={form.fechaExamen}
          onChange={handleChangeSimple}
          labelWidth="120px"
        />
        <div className="flex gap-4 items-center 2xl:col-span-2">
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
            <option value="INFORME PSICOLÓGICO - TRABAJO EN ALTURA/FOBIAS">
              INFORME PSICOLÓGICO - TRABAJO EN ALTURA/FOBIAS
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

      <DatosPersonalesLaborales form={form} />

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

      <SectionFieldset legend="Asignación de Médico">
        <EmpleadoComboBox
          value={form.nombre_medico}
          label="Especialista"
          form={form}
          onChange={handleChangeSimple}
        />
      </SectionFieldset>

      {/* Acciones */}
      <BotonesAccion
        form={form}
        handleSave={handleSave}
        handleClear={handleClear}
        handlePrint={handlePrint}
        handleChangeNumberDecimals={handleChangeNumberDecimals}
      />
    </div>
  );
}