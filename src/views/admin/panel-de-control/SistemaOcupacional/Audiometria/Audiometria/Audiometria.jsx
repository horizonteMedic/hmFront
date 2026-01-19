import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStethoscope } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import {
  SubmitDataService,
  VerifyTR,
  PrintHojaR,
} from "./controllerAudiometria";
import { getToday } from "../../../../../utils/helpers";
import { useSessionData } from "../../../../../hooks/useSessionData";
import { useForm } from "../../../../../hooks/useForm";
import BotonesAccion from "../../../../../components/templates/BotonesAccion";
import InputTextOneLine from "../../../../../components/reusableComponents/InputTextOneLine";
import SectionFieldset from "../../../../../components/reusableComponents/SectionFieldset";
import DatosPersonalesLaborales from "../../../../../components/templates/DatosPersonalesLaborales";
import RadioTable from "../../../../../components/reusableComponents/RadioTable";
import InputsBooleanRadioGroup from "../../../../../components/reusableComponents/InputsBooleanRadioGroup";
import InputsRadioGroup from "../../../../../components/reusableComponents/InputsRadioGroup";
import InputCheckbox from "../../../../../components/reusableComponents/InputCheckbox";
import InputTextArea from "../../../../../components/reusableComponents/InputTextArea";
import EmpleadoComboBox from "../../../../../components/reusableComponents/EmpleadoComboBox";

const tabla = "audiometria_2023";

const chemicals = [
  "plomo",
  "mercurio",
  "tolueno",
  "xileno",
  "plaguicidas",
  "organofosforados",
];
const frecuencias = ["500", "1000", "2000", "3000", "4000", "6000", "8000"];

export default function Audiometria() {
  const today = getToday();
  const { token, userlogued, selectedSede, datosFooter, userName } = useSessionData();
  const initialFormState = {
    codAu: "",
    norden: "",
    fecha: today,
    nomExam: "",

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

    sordera: false,
    acufenos: false,
    vertigo: false,
    otalgia: false,
    secrecion_otica: false,
    otros_sintomas_orl: "",

    rinitis: false,
    sinusitis: false,
    otitis_media_cronica: false,
    medicamentos_ototoxicos: false,
    meningitis: false,
    tec: false,
    sordera_am: false,
    parotiditis: false,
    sarampion: false,
    tbc: false,
    cuales_antecedentes: "",

    exposicion_ruido: false,
    promedio_horas: "",
    anios_exposicion: "",
    meses_exposicion: "",

    protectores_auditivos: false,

    // tipo_protectores
    tapones: false,
    orejeras: false,

    exposicion_quimicos: false,

    plomo_hrs: "", // New fields
    mercurio_hrs: "",
    tolueno_hrs: "",
    xileno_hrs: "",
    plaguicidas_hrs: "",
    organofosforados_hrs: "",

    plomo_anios: "",
    mercurio_anios: "",
    tolueno_anios: "",
    xileno_anios: "",
    plaguicidas_anios: "",
    organofosforados_anios: "",
    otros_quimicos: "",

    practica_tiro: false,
    uso_walkman: false,
    otros_antecedentes: false,
    cuales_antecedentes_extralaborales: "",

    otoscopia_odiocho: "NORMAL",
    otoscopia_odilzquierdo: "NORMAL",

    od_500: "",
    od_1000: "",
    od_2000: "",
    od_3000: "",
    od_4000: "",
    od_6000: "",
    od_8000: "",

    oi_500: "",
    oi_1000: "",
    oi_2000: "",
    oi_3000: "",
    oi_4000: "",
    oi_6000: "",
    oi_8000: "",

    diagnostico_od: "",
    diagnostico_oi: "",
    comentarios_audiometria: "",

    proteccion_simpleODoble: "",
    control_semestralOAnual: "",
    recomendaciones_otras: "",

    od_o_500: "",
    od_o_1000: "",
    od_o_2000: "",
    od_o_3000: "",
    od_o_4000: "",
    od_o_6000: "",
    od_o_8000: "",
    oi_o_500: "",
    oi_o_1000: "",
    oi_o_2000: "",
    oi_o_3000: "",
    oi_o_4000: "",
    oi_o_6000: "",
    oi_o_8000: "",

    // Médico que Certifica //BUSCADOR
    //nombre_medico: userName,
    //user_medicoFirma: userlogued,
  };

  const {
    form,
    setForm,
    handleChange,
    handleChangeNumber,
    handleChangeNumberDecimals,
    handleChangeSimple,
    handleRadioButton,
    handleRadioButtonBoolean,
    handleClear,
    handleClearnotO,
    handleCheckBoxChange,
    handlePrintDefault,
    handleFocusNext,
  } = useForm(initialFormState, { storageKey: "audiometriaNormal" });

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

  const tipoHipoacusia = (promedio) => {
    let textoPromedio = "";
    if (promedio >= -10 && promedio <= 25) textoPromedio = "NORMAL";
    else if (promedio > 25 && promedio <= 40)
      textoPromedio = "Hipoacusia neurosensorial leve".toUpperCase();
    else if (promedio > 40 && promedio <= 55)
      textoPromedio = "Hipoacusia neurosensorial moderada".toUpperCase();
    else if (promedio > 55 && promedio <= 70)
      textoPromedio = "Hipoacusia neurosensorial moderada-severa".toUpperCase();
    else if (promedio > 70 && promedio <= 90)
      textoPromedio = "Hipoacusia neurosensorial severa".toUpperCase();
    else if (promedio > 90)
      textoPromedio = "Hipoacusia neurosensorial profunda".toUpperCase();
    return textoPromedio;
  };
  const calcularOidos = () => {
    try {
      const odValues = [
        form.od_500,
        form.od_1000,
        form.od_2000,
        form.od_3000,
        form.od_4000,
        form.od_6000,
        form.od_8000,
      ]
        .map((v) => parseFloat(v) || 0)
        .filter((v) => v >= 25);

      let odPromedio = (
        odValues.reduce((acc, val) => acc + val, 0) / odValues.length
      ).toFixed(2);

      odPromedio = isNaN(odPromedio) ? 0 : odPromedio;

      setForm((f) => ({
        ...f,
        diagnostico_od: tipoHipoacusia(odPromedio),
      }));

      const oiValues = [
        form.oi_500,
        form.oi_1000,
        form.oi_2000,
        form.oi_3000,
        form.oi_4000,
        form.oi_6000,
        form.oi_8000,
      ]
        .map((v) => parseFloat(v) || 0)
        .filter((v) => v > 25);
      let oiPromedio = (
        oiValues.reduce((acc, val) => acc + val, 0) / oiValues.length
      ).toFixed(2);
      oiPromedio = isNaN(oiPromedio) ? 0 : oiPromedio;

      console.log("Oído Izquierdo - Promedio:", oiPromedio);

      setForm((f) => ({
        ...f,
        diagnostico_oi: tipoHipoacusia(oiPromedio) + "",
      }));
    } catch (error) {
      console.error("Error al calcular el oído derecho:", error);
      Swal.fire("Error", "No se pudo calcular el oído derecho", "error");
    }
  };

  return (
    <div className="space-y-3 px-4 max-w-[90%] xl:max-w-[80%] mx-auto">
      <div className="space-y-3">
        <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 2xl:grid-cols-3 gap-3">
          <InputTextOneLine
            label="N° Orden"
            name="norden"
            value={form.norden}
            onChange={handleChangeNumberDecimals}
            onKeyUp={handleSearch}
            labelWidth="120px"
          />
          <InputTextOneLine
            label="Fecha"
            name="fecha"
            type="date"
            value={form.fecha}
            onChange={handleChangeSimple}
            labelWidth="120px"
          />
          <InputTextOneLine
            label="Nombre del Examen"
            name="nomExam"
            value={form.nomExam}
            disabled
            labelWidth="120px"
          />
        </SectionFieldset>
        {/* Paciente */}
        <DatosPersonalesLaborales form={form} />

        {/* Primera fila*/}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
          <div className="space-y-3">
            {/* Síntomas Actuales */}
            <SectionFieldset legend="Síntomas Actuales" className="space-y-3">
              <RadioTable
                form={form}
                items={[
                  { label: "Sordera", name: "sordera" },
                  { label: "Acúfenos", name: "acufenos" },
                  { label: "Vértigo", name: "vertigo" },
                  { label: "Otalgia", name: "otalgia" },
                  { label: "Secreción Ótica", name: "secrecion_otica" },
                ]}
                options={[
                  { value: true, label: "SI" },
                  { value: false, label: "NO" },
                ]}
                handleRadioButton={handleRadioButtonBoolean}
              />
              <InputTextOneLine
                label="Otros Síntomas"
                name="otros_sintomas"
                value={form.otros_sintomas}
                onChange={handleChange}
                labelWidth="100px"
              />
            </SectionFieldset>
            {/* Antecedentes Médicos de importancia */}
            <SectionFieldset legend="Antecedentes Médicos de Importancia" className="space-y-3">
              <div className="grid lg:grid-cols-2 gap-x-4 gap-y-3">
                <RadioTable
                  form={form}
                  items={[
                    { label: "Rinitis", name: "rinitis" },
                    { label: "Sinusitis", name: "sinusitis" },
                    { label: "Otitis Media Crónica", name: "otitis_media_cronica" },
                    { label: "Medicamentos Ototóxicos", name: "medicamentos_ototoxicos" },
                    { label: "Meningitis", name: "meningitis" },
                  ]}
                  options={[
                    { value: true, label: "SI" },
                    { value: false, label: "NO" },
                  ]}
                  handleRadioButton={handleRadioButtonBoolean}
                />
                <RadioTable
                  form={form}
                  items={[
                    { label: "TEC", name: "tec" },
                    { label: "Sordera", name: "sordera_am" },
                    { label: "Parotiditis", name: "parotiditis" },
                    { label: "Sarampión", name: "sarampion" },
                    { label: "TBC", name: "tbc" },
                  ]}
                  options={[
                    { value: true, label: "SI" },
                    { value: false, label: "NO" },
                  ]}
                  handleRadioButton={handleRadioButtonBoolean}
                />
              </div>
              <InputTextOneLine
                label="Cuáles"
                name="cuales_antecedentes"
                value={form.cuales_antecedentes}
                onChange={handleChange}
                labelWidth="100px"
              />
            </SectionFieldset>
            <SectionFieldset legend="Exposición Ocupacional" className="space-y-4">
              <InputsBooleanRadioGroup
                label="Exposición al Ruido"
                name="exposicion_ruido"
                value={form.exposicion_ruido}
                onChange={(e) => {
                  handleRadioButtonBoolean(e, e.target.value == "true");
                  setForm((f) => ({
                    ...f,
                    promedio_horas: "",
                    anios_exposicion: "",
                    meses_exposicion: "",
                  }));
                }}
                labelWidth="120px"
              />
              <SectionFieldset legend="Exposición a Ruido (Promedio de Horas por Día)" >
                <InputsRadioGroup
                  name="promedio_horas"
                  value={form.promedio_horas}
                  options={[
                    { label: "0-2", value: "0-2" },
                    { label: "4-6", value: "4-6" },
                    { label: "8-10", value: "8-10" },
                    { label: ">12", value: ">12" },
                  ]}
                  disabled={!form.exposicion_ruido}
                  onChange={handleRadioButton}
                />
                <InputsRadioGroup
                  name="promedio_horas"
                  value={form.promedio_horas}
                  options={[
                    { label: "2-4", value: "2-4" },
                    { label: "6-8", value: "6-8" },
                    { label: "10-12", value: "10-12" },
                    { label: "Eventual", value: "EVENTUAL" },
                  ]}
                  onChange={handleRadioButton}
                  disabled={!form.exposicion_ruido}
                  className="mt-2"
                />
                <div className="grid 2xl:grid-cols-2 gap-x-4 gap-y-3 mt-3">
                  <InputTextOneLine
                    label="Años de Exposición (Aprox.)"
                    name="anios_exposicion"
                    value={form.anios_exposicion}
                    disabled={!form.exposicion_ruido}
                    onChange={handleChangeNumber}
                    labelWidth="150px"
                  />
                  <InputTextOneLine
                    label="Meses"
                    name="meses_exposicion"
                    value={form.meses_exposicion}
                    disabled={!form.exposicion_ruido}
                    onChange={handleChangeNumber}
                  />
                </div>
              </SectionFieldset>
            </SectionFieldset>
          </div>

          <div className="space-y-3">
            <SectionFieldset legend="Uso Protectores" className="space-y-4">
              <InputsBooleanRadioGroup
                label="Uso de Protectores Auditivos"
                name="protectores_auditivos"
                value={form.protectores_auditivos}
                onChange={(e) => {
                  handleRadioButtonBoolean(e, e.target.value == "true");
                  setForm((f) => ({
                    ...f,
                    tapones: false,
                    orejeras: false,
                  }));
                }}
                labelWidth="120px"
              />
              <SectionFieldset legend="Tipo de Protectores" className="flex gap-4">
                <InputCheckbox
                  label="Tapones"
                  name="tapones"
                  checked={form.tapones}
                  onChange={handleCheckBoxChange}
                  disabled={!form.protectores_auditivos}
                />
                <InputCheckbox
                  label="Orejeras"
                  name="orejeras"
                  checked={form.orejeras}
                  onChange={handleCheckBoxChange}
                  disabled={!form.protectores_auditivos}
                />
              </SectionFieldset>
            </SectionFieldset>
            <SectionFieldset legend="Sustancias Químicas" className="space-y-4">
              <InputsBooleanRadioGroup
                label="Exposición a Sustancias Químicas"
                name="exposicion_quimicos"
                value={form.exposicion_quimicos}
                onChange={(e) => {
                  handleRadioButtonBoolean(e, e.target.value == "true");
                  setForm((f) => ({
                    ...f,
                    plomo_hrs: "",
                    mercurio_hrs: "",
                    tolueno_hrs: "",
                    xileno_hrs: "",
                    plaguicidas_hrs: "",
                    organofosforados_hrs: "",

                    plomo_anios: "",
                    mercurio_anios: "",
                    tolueno_anios: "",
                    xileno_anios: "",
                    plaguicidas_anios: "",
                    organofosforados_anios: "",
                    otros_quimicos: "",
                  }));
                }}
                labelWidth="120px"
              />
              {/* Químicos a los que está expuesto: */}
              <SectionFieldset legend="Químicos a los que está expuesto" >
                <div className="grid grid-cols-7 gap-4 mb-2">
                  <div className="flex flex-col items-center">
                    <label className=" rounded  py-1 w-full  mt-7">
                      Hrs./dia
                    </label>
                    <label className="rounded  py-1 w-full ">
                      Tpo.(Años)
                    </label>
                  </div>
                  {chemicals.map((chem) => (
                    <div key={chem} className="flex flex-col items-center gap-y-1">
                      <label className="capitalize">
                        {chem.length > 5
                          ? chem.slice(0, 1).toUpperCase() +
                          chem.slice(1, 5) +
                          "."
                          : chem.slice(0, 1).toUpperCase() + chem.slice(1)}
                      </label>
                      <InputTextOneLine
                        name={`${chem}_hrs`}
                        value={form[`${chem}_hrs`]}
                        onChange={handleChange}
                        onKeyUp={handleFocusNext}
                        disabled={!form.exposicion_quimicos}
                      />
                      <InputTextOneLine
                        name={`${chem}_anios`}
                        value={form[`${chem}_anios`]}
                        onChange={handleChange}
                        onKeyUp={handleFocusNext}
                        disabled={!form.exposicion_quimicos}
                      />
                    </div>
                  ))}
                </div>
                <InputTextOneLine
                  label="Otros (detallar)"
                  name="otros_quimicos"
                  value={form.otros_quimicos}
                  onChange={handleChange}
                  disabled={!form.exposicion_quimicos}
                  labelWidth="120px"
                  className="mt-3"
                />
              </SectionFieldset>
            </SectionFieldset>

            <div className="space-y-3">
              <SectionFieldset legend="Antecedentes Extra-Laborales" className="space-y-4">
                <RadioTable
                  form={form}
                  items={[
                    { label: "Práctica de Tiro", name: "practica_tiro" },
                    { label: "Uso de Walkman", name: "uso_walkman" },
                    { label: "Otros", name: "otros_antecedentes" },
                  ]}
                  options={[
                    { value: true, label: "SI" },
                    { value: false, label: "NO" },
                  ]}
                  handleRadioButton={handleRadioButtonBoolean}
                />
                <InputTextOneLine
                  label="Cuáles"
                  name="cuales_antecedentes_extralaborales"
                  value={form.cuales_antecedentes_extralaborales}
                  onChange={handleChange}
                  labelWidth="100px"
                />
              </SectionFieldset>
              {/* Otoscopia: */}
              <SectionFieldset legend="Otoscopia" className="space-y-3">
                <InputsRadioGroup
                  label="Oído Derecho"
                  name="otoscopia_odiocho"
                  value={form.otoscopia_odiocho}
                  options={[
                    { label: "Normal", value: "NORMAL" },
                    { label: "Anormal", value: "ANORMAL" },
                  ]}
                  onChange={handleRadioButton}
                />
                <InputTextOneLine
                  name="otoscopia_odiocho"
                  value={form.otoscopia_odiocho}
                  onChange={handleChange}
                  labelWidth="100px"
                />
                <InputsRadioGroup
                  label="Oído Izquierdo"
                  name="otoscopia_odilzquierdo"
                  value={form.otoscopia_odilzquierdo}
                  options={[
                    { label: "Normal", value: "NORMAL" },
                    { label: "Anormal", value: "ANORMAL" },
                  ]}
                  onChange={handleRadioButton}
                />
                <InputTextOneLine
                  name="otoscopia_odilzquierdo"
                  value={form.otoscopia_odilzquierdo}
                  onChange={handleChange}
                  labelWidth="100px"
                />
              </SectionFieldset>

            </div>
          </div>
        </div>

        {/* Sección de Audiometría*/}
        <div className="border rounded p-4 mt-6 ">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 ">
            {/* Audiometría  Área  */}
            <SectionFieldset legend="Audiometría Aérea" className="space-y-3">
              {/* Oído Derecho */}
              <SectionFieldset legend="Oído Derecho" className="grid grid-cols-8 gap-1 text-center font-semibold ">
                <div className="flex flex-col items-start gap-2">
                  <p>hz</p>
                  <p>dB (A)</p>
                </div>
                {frecuencias.map((hz) => (
                  <div key={hz}>
                    <p>{hz}</p>
                    <InputTextOneLine
                      name={`od_${hz}`}
                      value={form[`od_${hz}`]}
                      onChange={handleChangeNumber}
                      onKeyUp={handleFocusNext}
                    />
                  </div>
                ))}
              </SectionFieldset>
              {/* Oído Izquierdo */}
              <SectionFieldset legend="Oído Izquierdo" className="grid grid-cols-8 gap-1 text-center  font-semibold">
                <div className="flex flex-col items-start gap-2">
                  <p>hz</p>
                  <p>dB (A)</p>
                </div>
                {frecuencias.map((hz) => (
                  <div key={hz}>
                    <p>{hz}</p>
                    <InputTextOneLine
                      name={`oi_${hz}`}
                      value={form[`oi_${hz}`]}
                      onChange={handleChangeNumber}
                      onKeyUp={handleFocusNext}
                    />
                  </div>
                ))}
              </SectionFieldset>
            </SectionFieldset>

            {/* Diagnóstico y Comentarios */}
            <SectionFieldset legend="Diagnóstico" className="space-y-3">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    calcularOidos();
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white text-base px-6 py-2 rounded flex items-center gap-2 w-full  max-w-[120px]"
                >
                  <FontAwesomeIcon icon={faStethoscope} /> Diagnosticar
                </button>
              </div>

              <InputTextOneLine
                label="Diagnóstico Oído Derecho"
                name="diagnostico_od"
                value={form.diagnostico_od}
                labelOnTop
                onChange={handleChange}
              />
              <InputTextOneLine
                label="Diagnóstico Oído Izquierdo"
                name="diagnostico_oi"
                value={form.diagnostico_oi}
                labelOnTop
                onChange={handleChange}
              />
              <InputTextArea
                label="Comentarios"
                name="comentarios_audiometria"
                value={form.comentarios_audiometria}
                labelOnTop
                onChange={handleChange}
                rows={3}
              />
            </SectionFieldset>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-6">
            {/* Audiometría Ósea */}
            <SectionFieldset legend="Audiometría Ósea" className="space-y-3">
              {/* Oído Derecho */}
              <SectionFieldset legend="Oído Derecho" className="grid grid-cols-8 gap-1 text-center font-semibold ">
                <div className="flex flex-col items-start  gap-2">
                  <p>hz</p>
                  <p>dB (A)</p>
                </div>
                {frecuencias.map((hz) => (
                  <div key={`od_o_${hz}`}>
                    <p>{hz}</p>
                    <InputTextOneLine
                      name={`od_o_${hz}`}
                      value={form[`od_o_${hz}`]}
                      onChange={handleChangeNumber}
                      onKeyUp={handleFocusNext}
                    />
                  </div>
                ))}
              </SectionFieldset>

              {/* Oído Izquierdo */}
              <SectionFieldset legend="Oído Izquierdo" className="grid grid-cols-8 gap-1 text-center  font-semibold">
                <div className="flex flex-col items-start gap-2">
                  <p>hz</p>
                  <p>dB (A)</p>
                </div>
                {frecuencias.map((hz) => (
                  <div key={`oi_o_${hz}`}>
                    <p>{hz}</p>
                    <InputTextOneLine
                      name={`oi_o_${hz}`}
                      value={form[`oi_o_${hz}`]}
                      onChange={handleChangeNumber}
                      onKeyUp={handleFocusNext}
                    />
                  </div>
                ))}
              </SectionFieldset>
            </SectionFieldset>

            {/* Recomendaciones */}
            <SectionFieldset legend="Recomendaciones" className="space-y-3">
              <SectionFieldset legend=" Uso adecuado de Protección Auditiva" className="flex gap-x-4">
                <InputCheckbox
                  label="Simple"
                  name="proteccion_simpleODoble"
                  checked={form.proteccion_simpleODoble === "SIMPLE"}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      proteccion_simpleODoble: e.target.checked
                        ? "SIMPLE"
                        : "",
                    }))
                  }
                />
                <InputCheckbox
                  label="Doble"
                  name="proteccion_simpleODoble"
                  checked={form.proteccion_simpleODoble === "DOBLE"}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      proteccion_simpleODoble: e.target.checked
                        ? "DOBLE"
                        : "",
                    }))
                  }
                />
              </SectionFieldset>
              <SectionFieldset legend="Control audiométrico" className="flex gap-x-4">

                <InputCheckbox
                  label="Semestral"
                  name="control_semestralOAnual"
                  checked={form.control_semestralOAnual === "SEMESTRAL"}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      control_semestralOAnual: e.target.checked
                        ? "SEMESTRAL"
                        : "",
                    }))
                  }
                />
                <InputCheckbox
                  label="Anual"
                  name="control_semestralOAnual"
                  checked={form.control_semestralOAnual === "ANUAL"}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      control_semestralOAnual: e.target.checked
                        ? "ANUAL"
                        : "",
                    }))
                  }
                />
              </SectionFieldset>
              <InputTextArea
                label="Otras Recomendaciones"
                name="recomendaciones_otras"
                value={form.recomendaciones_otras}
                onChange={handleChange}
                rows={3}
              />
            </SectionFieldset>
          </div>
          <SectionFieldset legend="Sellos" className="space-y-4">
            <EmpleadoComboBox
              value={form.nombre_medico}
              label="Especialista"
              form={form}
              onChange={handleChangeSimple}
            />
          </SectionFieldset>
        </div>

        {/* Acciones */}
        <BotonesAccion
          form={form}
          handleSave={handleSave}
          handleClear={handleClear}
          handlePrint={handlePrint}
          handleChangeNumberDecimals={handleChangeNumberDecimals}
        />
      </div>
    </div>
  );
}