import {
  InputTextOneLine,
  InputTextArea,
  SectionFieldset,
  RadioTable
} from "../../../../../components/reusableComponents/ResusableComponents";
import { useSessionData } from "../../../../../hooks/useSessionData";
import { getToday } from "../../../../../utils/helpers";
import { useForm } from "../../../../../hooks/useForm";
import { PrintHojaR, SubmitDataService, VerifyTR } from "./controllerHistoriaClinicaAdultoMayor";
import { BotonesAccion, DatosPersonalesLaborales } from "../../../../../components/templates/Templates";
import EmpleadoComboBox from "../../../../../components/reusableComponents/EmpleadoComboBox";

const tabla = "hc_adulto_mayor";

export default function HistoriaClinicaAdultoMayor() {
  const today = getToday();
  const { token, userlogued, selectedSede, datosFooter, userName } = useSessionData();

  const initialFormState = {
    // Header
    n_hcl: "",
    fecha_apertura_hcl: today,

    // Datos Generales (los que no están en DatosPersonalesLaborales)
    domicilio: "",
    telefono: "",
    religion: "",
    raza: "",
    procedencia: "",
    grupo_sanguineo: "",

    // Familiar o Cuidador Responsable
    familiar_responsable: "",
    edad_familiar: "",
    domicilio_telefono_familiar: "",
    parentesco: "",

    // Antecedentes Personales
    ap_hipertension: undefined,
    ap_diabetes: undefined,
    ap_obesidad: undefined,
    ap_infarto_cardiaco: undefined,
    ap_acv: undefined,
    ap_osteoporosis: undefined,
    ap_hospitalizacion: undefined,
    ap_transfusion: undefined,
    ap_interv_quirurgica: undefined,
    ap_accidentes: undefined,
    ap_cancer: undefined,
    ap_cancer_especificar: "",
    ap_tuberculosis: undefined,
    ap_its_vih: undefined,
    ap_hepatitis_b: undefined,
    ap_malaria: undefined,
    ap_osteoartrosis: undefined,
    ap_glaucoma: undefined,
    ap_convulsiones: undefined,
    ap_depresion: undefined,
    ap_riesgo_ocupacional: undefined,
    ap_mordedura_animales: undefined,
    ap_tuberculosis2: undefined,
    ap_its_vih2: undefined,
    ap_hepatitis_b2: undefined,
    ap_enfermedades_cronicas: undefined,
    ap_violencia_familiar: undefined,
    ap_cancer2: undefined,
    especificacion_cancer: "",
    sexualmente_activo: undefined,
    problema_sexualidad: "",

    // Reacción Adversa a Medicamentos
    reaccion_adversa_medicamentos: undefined,
    reaccion_adversa_medicamentos_cual: "",
    medicamentos_uso_frecuente_cual: "",
    medicamentos_uso_frecuente: undefined,
    medicamentos_observacion: "",

    // Inmunizaciones
    vacuna_1: "",
    fecha_vacuna_1: "",
    vacuna_2: "",
    fecha_vacuna_2: "",
    vacuna_3: "",
    fecha_vacuna_3: "",
    vacuna_4: "",
    fecha_vacuna_4: "",
    vacuna_5: "",
    fecha_vacuna_5: "",
    vacuna_6: "",
    fecha_vacuna_6: "",
    vacuna_7: "",
    fecha_vacuna_7: "",
    vacuna_8: "",
    fecha_vacuna_8: "",

    // Síndromes y Problemas Geriátricos
    spg_incontinencia_urinaria: undefined,
    spg_estrenimiento: undefined,
    spg_ulceras_depresion: undefined,
    spg_insomnio: undefined,
    spg_inmovilizacion: undefined,
    spg_confusion_aguda: undefined,
    spg_vertigo: undefined,
    spg_sincope: undefined,
    spg_prostatismo: undefined,
    spg_deprivacion_auditiva: undefined,
    spg_deprivacion_visual: undefined,
    spg_caidas: undefined,
    spg_caidas_ultimo_ano: undefined,
    spg_n_caidas: "",
    spg_fracturas: "",
    spg_sitio_anatomico: "",

    // Observaciones
    observaciones: "",

    // Médico que Certifica
    nombre_medico: userName,
    user_medicoFirma: userlogued,

    // Campos de DatosPersonalesLaborales
    norden: "",
    fecha: today,
    nombreExamen: "HISTORIA CLINICA DEL ADULTO MAYOR",
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
    empresa: "",
    contrata: "",
    ocupacion: "",
    cargoDesempenar: "",
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
  } = useForm(initialFormState, { storageKey: "hc_adulto_mayor" });

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
      <SectionFieldset legend="Datos Generales" className="grid grid-cols-1 2xl:grid-cols-4 gap-3">
        <InputTextOneLine
          label="N° HCL"
          name="n_hcl"
          value={form.n_hcl}
          onChange={handleChangeNumberDecimals}
          onKeyUp={handleSearch}
        />
        <InputTextOneLine
          label="Fecha"
          name="fecha_apertura_hcl"
          type="date"
          value={form.fecha_apertura_hcl}
          onChange={handleChangeSimple}
        />
      </SectionFieldset>

      <DatosPersonalesLaborales form={form} />

      <SectionFieldset legend="Datos Personales" className="grid grid-cols-1 xl:grid-cols-2 gap-3" collapsible>
        <InputTextOneLine
          label="Domicilio"
          name="domicilio"
          value={form.domicilio}
          disabled
        />
        <InputTextOneLine
          label="Teléfono"
          name="telefono"
          value={form.telefono}
          disabled
        />
        <InputTextOneLine
          label="Religion"
          name="religion"
          value={form.religion}
          disabled
        />
        <InputTextOneLine
          label="Raza"
          name="raza"
          value={form.raza}
          disabled
        />
        <InputTextOneLine
          label="Procedencia"
          name="procedencia"
          value={form.procedencia}
          disabled
        />
        <InputTextOneLine
          label="Grupo Sanguíneo"
          name="grupo_sanguineo"
          value={form.grupo_sanguineo}
          disabled
        />
      </SectionFieldset>

      <SectionFieldset legend="Familiar o Cuidador Responsable" className="grid md:grid-cols-2 gap-y-3 gap-x-4">
        <div className="space-y-3">
          <InputTextOneLine label="Apellidos y Nombres" name="familiar_responsable" value={form.familiar_responsable} onChange={handleChange} />
          <InputTextOneLine label="Edad" name="edad_familiar" value={form.edad_familiar} onChange={handleChange} />
          <InputTextOneLine label="Domicilio / Teléfono" name="domicilio_telefono_familiar" value={form.domicilio_telefono_familiar} onChange={handleChange} />
          <InputTextOneLine label="Parentesco" name="parentesco" value={form.parentesco} onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <RadioTable
            items={[
              { name: "ap_tuberculosis2", label: "Tuberculosis" },
              { name: "ap_its_vih2", label: "ITS-VIH - SIDA" },
              { name: "ap_hepatitis_b2", label: "Hepatitis B" },
              { name: "ap_enfermedades_cronicas", label: "Enfermedades Crónicas" },
              { name: "ap_violencia_familiar", label: "Violencia Familiar" },
              { name: "ap_cancer2", label: "Cáncer" },
            ]}
            options={[
              { value: "SI", label: "SI" },
              { value: "NO", label: "NO" }
            ]}
            labelColumns={6}
            form={form}
            handleRadioButton={handleRadioButton}
          />
          {form.ap_cancer2 === "SI" && (
            <InputTextOneLine label="Tipo de Cáncer" labelWidth="90px" name="especificacion_cancer" value={form.especificacion_cancer} onChange={handleChange} />
          )}
        </div>
      </SectionFieldset>

      <SectionFieldset legend="Antecedentes Personales" className="grid md:grid-cols-2 gap-x-4 gap-y-3">
        <div className="space-y-3">
          <RadioTable
            items={[
              { name: "ap_hipertension", label: "Hipertensión Arterial" },
              { name: "ap_diabetes", label: "Diabetes" },
              { name: "ap_obesidad", label: "Obesidad / Sobrepeso" },
              { name: "ap_infarto_cardiaco", label: "Infarto Cardiaco / ICC" },
              { name: "ap_acv", label: "ACV (derrame cerebral)" },
              { name: "ap_osteoporosis", label: "Osteoporosis" },
              { name: "ap_hospitalizacion", label: "Hospitalización Últ 3 años" },
              { name: "ap_transfusion", label: "Transfusión" },
              { name: "ap_interv_quirurgica", label: "Interv. Quirúrgica" },
              { name: "ap_accidentes", label: "Accidentes" },
              { name: "ap_cancer", label: "Cáncer" },

            ]}
            options={[
              { value: "SI", label: "SI" },
              { value: "NO", label: "NO" }
            ]}
            labelColumns={6}
            form={form}
            handleRadioButton={handleRadioButton}
          />
          {form.ap_cancer === "SI" && (
            <InputTextOneLine
              label="Tipo de Cáncer"
              name="ap_cancer_especificar"
              labelWidth="90px"
              value={form.ap_cancer_especificar}
              onChange={handleChange}
            />
          )}
        </div>
        <RadioTable
          items={[
            { name: "ap_tuberculosis", label: "Tuberculosis" },
            { name: "ap_its_vih", label: "ITS - VIH - SIDA" },
            { name: "ap_hepatitis_b", label: "Hepatitis B" },
            { name: "ap_malaria", label: "Malaria" },
            { name: "ap_osteoartrosis", label: "Osteoartrosis" },
            { name: "ap_glaucoma", label: "Glaucoma" },
            { name: "ap_convulsiones", label: "Convulsiones" },
            { name: "ap_depresion", label: "Depresión" },
            { name: "ap_riesgo_ocupacional", label: "Riesgo Ocupacional" },
            { name: "ap_mordedura_animales", label: "Mordedura de animales" },
            { name: "sexualmente_activo", label: "Sexualmente Activo (a)" },
            { name: "problema_sexualidad", label: "Problema de Sexualidad" },
          ]}
          options={[
            { value: "SI", label: "SI" },
            { value: "NO", label: "NO" }
          ]}
          labelColumns={6}
          form={form}
          handleRadioButton={handleRadioButton}
        />
      </SectionFieldset>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SectionFieldset legend="Medicamentos" className="space-y-3">
          <RadioTable
            items={[
              { name: "reaccion_adversa_medicamentos", label: "Reacción Adversa a Medicamentos" },
              { name: "medicamentos_uso_frecuente", label: "Medicamentos de uso frecuente" },
            ]}
            options={[
              { value: "SI", label: "SI" },
              { value: "NO", label: "NO" }
            ]}
            labelColumns={6}
            form={form}
            handleRadioButton={handleRadioButton}
          />

          {form.reaccion_adversa_medicamentos === "SI" && (
            <InputTextArea
              label="¿Cuáles medicamentos genera reacción adversa?"
              name="reaccion_adversa_medicamentos_cual"
              value={form.reaccion_adversa_medicamentos_cual}
              onChange={handleChange}
            />
          )}
          {form.medicamentos_uso_frecuente === "SI" && (
            <InputTextArea
              label="¿Cuáles medicamentos son de  uso frecuente?"
              name="medicamentos_uso_frecuente_cual"
              value={form.medicamentos_uso_frecuente_cual}
              onChange={handleChange}
            />
          )}

          <InputTextArea
            label="Dosis, tiempo de uso u otra observación"
            name="medicamentos_observacion"
            value={form.medicamentos_observacion}
            onChange={handleChange}
            rows={3}
          />
        </SectionFieldset>
        <SectionFieldset legend="Inmunizaciones">
          <div className="grid grid-cols-2 gap-y-3 gap-x-4">
            <InputTextOneLine label="Vacuna" name="vacuna_1" value={form.vacuna_1} onChange={handleChange} />
            <InputTextOneLine label="Fecha" name="fecha_vacuna_1" type="date" value={form.fecha_vacuna_1} onChange={handleChangeSimple} />

            <InputTextOneLine label="Vacuna" name="vacuna_2" value={form.vacuna_2} onChange={handleChange} />
            <InputTextOneLine label="Fecha" name="fecha_vacuna_2" type="date" value={form.fecha_vacuna_2} onChange={handleChangeSimple} />

            <InputTextOneLine label="Vacuna" name="vacuna_3" value={form.vacuna_3} onChange={handleChange} />
            <InputTextOneLine label="Fecha" name="fecha_vacuna_3" type="date" value={form.fecha_vacuna_3} onChange={handleChangeSimple} />

            <InputTextOneLine label="Vacuna" name="vacuna_4" value={form.vacuna_4} onChange={handleChange} />
            <InputTextOneLine label="Fecha" name="fecha_vacuna_4" type="date" value={form.fecha_vacuna_4} onChange={handleChangeSimple} />

            <InputTextOneLine label="Vacuna" name="vacuna_5" value={form.vacuna_5} onChange={handleChange} />
            <InputTextOneLine label="Fecha" name="fecha_vacuna_5" type="date" value={form.fecha_vacuna_5} onChange={handleChangeSimple} />

            <InputTextOneLine label="Vacuna" name="vacuna_6" value={form.vacuna_6} onChange={handleChange} />
            <InputTextOneLine label="Fecha" name="fecha_vacuna_6" type="date" value={form.fecha_vacuna_6} onChange={handleChangeSimple} />

            <InputTextOneLine label="Vacuna" name="vacuna_7" value={form.vacuna_7} onChange={handleChange} />
            <InputTextOneLine label="Fecha" name="fecha_vacuna_7" type="date" value={form.fecha_vacuna_7} onChange={handleChangeSimple} />

            <InputTextOneLine label="Vacuna" name="vacuna_8" value={form.vacuna_8} onChange={handleChange} />
            <InputTextOneLine label="Fecha" name="fecha_vacuna_8" type="date" value={form.fecha_vacuna_8} onChange={handleChangeSimple} />
          </div>
        </SectionFieldset>
      </div>

      <SectionFieldset legend="Síndromes y Problemas Geriátricos" className="grid md:grid-cols-2 gap-x-4 gap-y-3">
        <RadioTable
          items={[
            { name: "spg_incontinencia_urinaria", label: "Incontinencia Urinaria" },
            { name: "spg_estrenimiento", label: "Estreñimiento" },
            { name: "spg_ulceras_depresion", label: "Úlceras por depresión" },
            { name: "spg_insomnio", label: "Insomnio" },
            { name: "spg_inmovilizacion", label: "Inmovilización" },
            { name: "spg_confusion_aguda", label: "Confusión Aguda (Delirio)" },
          ]}
          options={[
            { value: "SI", label: "SI" },
            { value: "NO", label: "NO" }
          ]}
          labelColumns={6}
          form={form}
          handleRadioButton={handleRadioButton}
        />
        <RadioTable
          items={[
            { name: "spg_vertigo", label: "Vértigo" },
            { name: "spg_sincope", label: "Síncope" },
            { name: "spg_prostatismo", label: "Prostatismo" },
            { name: "spg_deprivacion_auditiva", label: "Deprivación Auditiva" },
            { name: "spg_deprivacion_visual", label: "Deprivación Visual" },
            { name: "spg_caidas", label: "Caídas" },
            { name: "spg_caidas_ultimo_ano", label: "Caídas en el último año" },
          ]}
          options={[
            { value: "SI", label: "SI" },
            { value: "NO", label: "NO" }
          ]}
          labelColumns={6}
          form={form}
          handleRadioButton={handleRadioButton}
        />

        <InputTextOneLine
          label="N° de caídas"
          name="spg_n_caidas"
          value={form.spg_n_caidas}
          onChange={handleChange}
        />

        <InputTextOneLine
          label="Fracturas"
          name="spg_fracturas"
          value={form.spg_fracturas}
          onChange={handleChange}
        />

        <InputTextOneLine
          label="Sitio Anatómico"
          name="spg_sitio_anatomico"
          value={form.spg_sitio_anatomico}
          onChange={handleChange}
        />
      </SectionFieldset>

      <SectionFieldset legend="Observaciones">
        <InputTextArea name="observaciones" value={form.observaciones} onChange={handleChange} rows={4} />
      </SectionFieldset>

      <SectionFieldset legend="Asignación de Médico">
        <EmpleadoComboBox
          value={form.nombre_medico}
          label="Especialista"
          form={form}
          onChange={handleChangeSimple}
        />
      </SectionFieldset>

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
