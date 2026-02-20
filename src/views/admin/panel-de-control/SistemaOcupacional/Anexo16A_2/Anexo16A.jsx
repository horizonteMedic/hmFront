import { useState } from "react";
import InputTextOneLine from "../../../../components/reusableComponents/InputTextOneLine";
import InputsBooleanRadioGroup from "../../../../components/reusableComponents/InputsBooleanRadioGroup";
import SectionFieldset from "../../../../components/reusableComponents/SectionFieldset";
import BotonesAccion from "../../../../components/templates/BotonesAccion";
import { useForm } from "../../../../hooks/useForm";
import { useSessionData } from "../../../../hooks/useSessionData";
import { getToday } from "../../../../utils/helpers";
import DatosPersonalesLaborales from "../../../../components/templates/DatosPersonalesLaborales";
import EmpleadoComboBox from "../../../../components/reusableComponents/EmpleadoComboBox";
import InputTextArea from "../../../../components/reusableComponents/InputTextArea";
import RadioTable from "../../../../components/reusableComponents/RadioTable";
import InputCheckbox from "../../../../components/reusableComponents/InputCheckbox";

// import {
//   PrintHojaR,
//   SubmitDataService,
//   VerifyTR,
// } from "./Anexo16AController";


const tabla = "anexo16a";

export default function Anexo16A() {
  const today = getToday();

  const {
    token,
    userlogued,
    selectedSede,
    datosFooter,
    userName,
    userDireccion,
  } = useSessionData();

  const [visualerOpen, setVisualerOpen] = useState(null);

  const initialFormState = {
    norden: "",
    fechaExam: today,
    codigoAnexo: null,
    apto: undefined,
    actividadRealizar: "",
    dni: "",
    nombres: "",
    sexo: "",
    fechaNac: "",
    edad: "",
    fc: "",
    pa: "",
    fr: "",
    imc: "",
    satO2: "",
    temperatura: "",
    peso: "",
    talla: "",
    medicoDireccion: userDireccion,
    cirugiaMayor: false,
    desordenesCoagulacion: false,
    diabetes: false,
    hipertension: false,
    embarazo: false,
    furDescripcion: "",
    problemasNeurologicos: false,
    infeccionesRecientes: false,
    medicacionActual: "",
    obesidadMorbida: false,
    problemasCardiacos: false,
    problemasRespiratorios: false,
    problemasOftalmologicos: false,
    problemasDigestivos: false,
    apneaSueño: false,
    otraCondicion: false,
    alergias: false,
    usoMedicacion: false,
    corregirAgudeza: false,
    obesidadDieta: false,
    diabetesControlado: false,
    sobrepeso: false,
    htaControlada: false,
    lentesCorrectivos: false,
    contrata: "",
    empresa: "",
    observaciones: "",
    //Agudeza Visual
    vcOD: "",
    vlOD: "",
    vcOI: "",
    vlOI: "",
    vcCorregidaOD: "",
    vlCorregidaOD: "",
    vclrs: "",
    vb: "",
    rp: "",
    vcCorregidaOI: "",
    vlCorregidaOI: "",
    enfermedadesOculares: "",

    imcRed: false,
    obesidadMorbidaRed: false,
    hipertensionRed: false,
    problemasOftalmologicosRed: false,

    // Médico que Certifica //BUSCADOR
    nombre_medico: userName,
    user_medicoFirma: userlogued,
  }

  const {
    form,
    setForm,
    handleChange,
    handleChangeNumberDecimals,
    handleClear,
    handleChangeSimple,
    handleClearnotO,
    handlePrintDefault,
    handleRadioButtonBoolean,
  } = useForm(initialFormState, { storageKey: "anexo16a" });

  const handleSave = () => {
    // SubmitDataService(form, token, userlogued, handleClear, tabla, datosFooter);
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      handleClearnotO();
      // VerifyTR(form.norden, tabla, token, setForm, selectedSede);
    }
  };

  const handlePrint = () => {
    handlePrintDefault(() => {
      // PrintHojaR(form.norden, token, tabla, datosFooter);
    });
  };
const handleCheckBoxChangeWithObservations = (e) => {
    const { name, checked } = e.target;
    const textoAsociado = checkboxTexts[name];

    setForm((prev) => {
      const newForm = { ...prev, [name]: checked };
      let observaciones = (prev.observaciones || "").split("\n").filter(l => l.trim() !== "");

      if (checked && textoAsociado && !observaciones.includes(textoAsociado)) {
        observaciones.push(textoAsociado);
      } else if (!checked) {
        observaciones = observaciones.filter(l => l !== textoAsociado);
      }
      newForm.observaciones = observaciones.join("\n");
      return newForm;
    });
  };
return (
  <div className="px-4 max-w-[95%] xl:max-w-[90%] mx-auto">

    <div className="grid grid-cols-5 gap-x-4 gap-y-3">

      {/* ================= IZQUIERDA ================= */}
      <div className="col-span-4 space-y-3">

        <SectionFieldset
          legend="Información del Examen"
          className="grid grid-cols-3 gap-3"
        >
          <InputTextOneLine
            label="N° Orden"
            name="norden"
            value={form.norden}
            onChange={handleChangeNumberDecimals}
            onKeyUp={handleSearch}
          />

          <InputTextOneLine
            label="Fecha"
            name="fechaExam"
            type="date"
            value={form.fechaExam}
            onChange={handleChangeSimple}
          />

          <InputsBooleanRadioGroup
            label="Aptitud"
            name="apto"
            value={form.apto}
            trueLabel="APTO"
            falseLabel="NO APTO"
            onChange={handleRadioButtonBoolean}
          />

          <div className="2xl:col-span-4">
            <InputTextOneLine
              label="Actividad a Realizar"
              name="actividadRealizar"
              value={form.actividadRealizar}
              disabled
            />
          </div>
        </SectionFieldset>

        <DatosPersonalesLaborales form={form} />

        <SectionFieldset legend="Asignación de Médico" className="space-y-4">
          <EmpleadoComboBox
            value={form.nombre_medico}
            label="Especialista"
            form={form}
            onChange={handleChangeSimple}
          />
        </SectionFieldset>
{/* --- ANTECEDENTES DEL REGISTRO MÉDICO --- */}
<SectionFieldset legend="Antecedentes del Registro Médico" collapsible>
  <h4 className="font-semibold text-gray-800 mb-3">El/la presenta o ha presentado en los 6 últimos meses</h4>
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-2">
    
    {/* Columna Izquierda */}
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span>Cirugía Mayor Reciente</span>
        <InputsBooleanRadioGroup
          name="cirugiaMayor"
          value={form?.cirugiaMayor}
          onChange={handleRadioButtonBoolean}
        />
      </div>
      <div className="flex items-center justify-between">
        <span>Desórdenes de la coagulación, trombosis, etc</span>
        <InputsBooleanRadioGroup
          name="desordenesCoagulacion"
          value={form?.desordenesCoagulacion}
          onChange={handleRadioButtonBoolean}
        />
      </div>
      <div className="flex items-center justify-between">
        <span>Diabetes Mellitus</span>
        <InputsBooleanRadioGroup
          name="diabetes"
          value={form?.diabetes}
          onChange={handleRadioButtonBoolean}
        />
      </div>
      <div className="flex items-center justify-between">
        <span className={`${form?.hipertensionRed ? 'text-red-500 font-bold' : ''}`}>Hipertensión Arterial</span>
        <InputsBooleanRadioGroup
          name="hipertension"
          value={form?.hipertension}
          onChange={(e, value) => { 
            if (value === false) setForm(prev => ({ ...prev, hipertensionRed: false })); 
            handleRadioButtonBoolean(e, value);
          }}
        />
      </div>
      <div className="flex items-center justify-between">
        <span>Embarazo</span>
        <InputsBooleanRadioGroup
          name="embarazo"
          value={form?.embarazo}
          onChange={handleRadioButtonBoolean}
        />
      </div>
      <InputTextOneLine 
        label="FUR" 
        name="furDescripcion" 
        value={form?.furDescripcion} 
        onChange={handleChange} 
      />
      <div className="flex items-center justify-between">
        <span>Problemas Neurológicos: Epilepsia, vértigo, etc</span>
        <InputsBooleanRadioGroup
          name="problemasNeurologicos"
          value={form?.problemasNeurologicos}
          onChange={handleRadioButtonBoolean}
        />
      </div>
      <div className="flex items-center justify-between">
        <span>Infecciones recientes (especialmente oídos, nariz, garganta)</span>
        <InputsBooleanRadioGroup
          name="infeccionesRecientes"
          value={form?.infeccionesRecientes}
          onChange={handleRadioButtonBoolean}
        />
      </div>
    </div>

    {/* Columna Derecha */}
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className={`${form?.obesidadMorbidaRed ? 'text-red-500 font-bold' : ''}`}>Obesidad Mórbida (IMC mayor a 35 m/Kg 2)</span>
        <InputsBooleanRadioGroup
          name="obesidadMorbida"
          value={form?.obesidadMorbida}
          onChange={(e, value) => { 
            if (value === false) setForm(prev => ({ ...prev, obesidadMorbidaRed: false })); 
            handleRadioButtonBoolean(e, value);
          }}
        />
      </div>
      <div className="flex items-center justify-between">
        <span>Problemas Cardiacos: marca pasos, coronariopatías, etc</span>
        <InputsBooleanRadioGroup
          name="problemasCardiacos"
          value={form?.problemasCardiacos}
          onChange={handleRadioButtonBoolean}
        />
      </div>
      <div className="flex items-center justify-between">
        <span>Problemas respiratorios: Asma, EPOC etc</span>
        <InputsBooleanRadioGroup
          name="problemasRespiratorios"
          value={form?.problemasRespiratorios}
          onChange={handleRadioButtonBoolean}
        />
      </div>
      <div className="flex items-center justify-between">
        <span className={`${form?.problemasOftalmologicosRed ? 'text-red-500 font-bold' : ''}`}>Problemas Oftalmológicos: Retinopatía, glaucoma, etc</span>
        <InputsBooleanRadioGroup
          name="problemasOftalmologicos"
          value={form?.problemasOftalmologicos}
          onChange={(e, value) => { 
            if (value === false) setForm(prev => ({ ...prev, problemasOftalmologicosRed: false })); 
            handleRadioButtonBoolean(e, value);
          }}
        />
      </div>
      <div className="flex items-center justify-between">
        <span>Problemas Digestivos: Úlcera péptica, hepatitis, etc</span>
        <InputsBooleanRadioGroup
          name="problemasDigestivos"
          value={form?.problemasDigestivos}
          onChange={handleRadioButtonBoolean}
        />
      </div>
      <div className="flex items-center justify-between">
        <span>Apnea del Sueño</span>
        <InputsBooleanRadioGroup
          name="apneaSueño"
          value={form?.apneaSueño}
          onChange={handleRadioButtonBoolean}
        />
      </div>
      <div className="flex items-center justify-between">
        <span>Otra condición Médica Importante</span>
        <InputsBooleanRadioGroup
          name="otraCondicion"
          value={form?.otraCondicion}
          onChange={handleRadioButtonBoolean}
        />
      </div>
      <div className="flex items-center justify-between">
        <span>Alergias</span>
        <InputsBooleanRadioGroup
          name="alergias"
          value={form?.alergias} 
          onChange={handleRadioButtonBoolean}
        />
      </div>
      <div className="flex items-center justify-between">
        <span>Uso de Medicación Actual</span>
        <InputsBooleanRadioGroup
          name="usoMedicacion"
          value={form?.usoMedicacion}
          onChange={(e, value) => {
            if (value === false) setForm(prev => ({ ...prev, medicacionActual: "" }));
            handleRadioButtonBoolean(e, value);
          }}
        />
      </div>
      <InputTextOneLine 
        label="Medicación Actual" 
        name="medicacionActual" 
        value={form?.medicacionActual} 
        onChange={handleChange} 
        disabled={!form?.usoMedicacion} 
      />
    </div>
  </div>
</SectionFieldset>

<SectionFieldset legend="Recomendaciones y Observaciones" collapsible>
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-2">
    <div>
      <h4 className="font-semibold text-gray-800 mb-3">Recomendaciones</h4>
      <div className="space-y-2">
        {/* Todos los checked evalúan a false si no hay datos, por lo tanto inician vacíos */}
        <InputCheckbox
          label="Corregir Agudeza Visual"
          checked={!!form?.corregirAgudeza} 
          name="corregirAgudeza"
          onChange={handleCheckBoxChangeWithObservations}
        />
        <InputCheckbox
          label="Obesidad I. Dieta Hipocalórica y Ejercicios"
          checked={!!form?.obesidadDieta}
          name="obesidadDieta"
          onChange={handleCheckBoxChangeWithObservations}
        />
        <InputCheckbox
          label="D m II controlado, tto con:....."
          checked={!!form?.diabetesControlado}
          name="diabetesControlado"
          onChange={handleCheckBoxChangeWithObservations}
        />
        <InputCheckbox
          label="Sobrepeso. Dieta Hipocalórica y Ejercicios"
          checked={!!form?.sobrepeso}
          name="sobrepeso"
          onChange={handleCheckBoxChangeWithObservations}
        />
        <InputCheckbox
          label="HTA Controlada, en tto con:..."
          checked={!!form?.htaControlada}
          name="htaControlada"
          onChange={handleCheckBoxChangeWithObservations}
        />
        <InputCheckbox
          label="Uso de Lentes Correct. Lectura de Cerca"
          checked={!!form?.lentesCorrectivos}
          name="lentesCorrectivos"
          onChange={handleCheckBoxChangeWithObservations}
        />
      </div>
    </div>
    <div>
      <h4 className="font-semibold text-gray-800 mb-3">Observaciones</h4>
      <InputTextArea rows={8} name="observaciones" value={form?.observaciones || ""} onChange={handleChange} />
    </div>
  </div>
</SectionFieldset>

      {/* 4. BOTONES AL FINAL */}
      <BotonesAccion
        form={form}
        onSave={handleSave}
        onClear={handleClear}
        onPrint={handlePrint}
      />
      </div>

      <div className="space-y-3">

        <SectionFieldset legend="Resultados Oftalmología">
          <div className="p-2 space-y-6 text-[10px]">

            <div className="space-y-3">
              <p className="text-center font-bold border-b text-blue-700 uppercase">
                Sin Corregir
              </p>

              <div className="grid grid-cols-2 gap-4">
                {/* O.D. */}
                <div className="space-y-2">
                  <p className="text-center font-bold border-b">O.D.</p>
                  <InputTextOneLine
                    label="V.C."
                    name="visionCercaSincorregirOd_v_cerca_s_od"
                    value={form?.visionCercaSincorregirOd_v_cerca_s_od}
                    disabled
                    labelWidth="30px"
                  />
                  <InputTextOneLine
                    label="V.L."
                    name="visionLejosSincorregirOd_v_lejos_s_od"
                    value={form?.visionLejosSincorregirOd_v_lejos_s_od}
                    disabled
                    labelWidth="30px"
                  />
                </div>

                {/* O.I. */}
                <div className="space-y-2">
                  <p className="text-center font-bold border-b">O.I.</p>
                  <InputTextOneLine
                    label="V.C."
                    name="visionCercaSincorregirOi_v_cerca_s_oi"
                    value={form?.visionCercaSincorregirOi_v_cerca_s_oi}
                    disabled
                    labelWidth="30px"
                  />
                  <InputTextOneLine
                    label="V.L."
                    name="visionLejosSincorregirOi_v_lejos_s_oi"
                    value={form?.visionLejosSincorregirOi_v_lejos_s_oi}
                    disabled
                    labelWidth="30px"
                  />
                </div>
              </div>
            </div>

            {/* SUB-BLOQUE: CORREGIDA */}
            <div className="space-y-3 pt-2 border-t">
              <p className="text-center font-bold border-b text-blue-700 uppercase">
                Corregida
              </p>

              <div className="grid grid-cols-2 gap-4">
                {/* O.D. */}
                <div className="space-y-2">
                  <p className="text-center font-bold border-b">O.D.</p>
                  <InputTextOneLine
                    label="V.C."
                    name="oftalodccmologia_odcc"
                    value={form?.oftalodccmologia_odcc}
                    disabled
                    labelWidth="30px"
                  />
                  <InputTextOneLine
                    label="V.L."
                    name="odlcOftalmologia_odlc"
                    value={form?.odlcOftalmologia_odlc}
                    disabled
                    labelWidth="30px"
                  />
                </div>

                {/* O.I. */}
                <div className="space-y-2">
                  <p className="text-center font-bold border-b">O.I.</p>
                  <InputTextOneLine
                    label="V.C."
                    name="oiccoftalmologia_oicc"
                    value={form?.oiccoftalmologia_oicc}
                    disabled
                    labelWidth="30px"
                  />
                  <InputTextOneLine
                    label="V.L."
                    name="oilcOftalmologia_oilc"
                    value={form?.oilcOftalmologia_oilc}
                    disabled
                    labelWidth="30px"
                  />
                </div>
              </div>
            </div>

            {/* OTROS VALORES */}
            <div className="space-y-2 pt-2 border-t">
              <InputTextOneLine
                label="V.Clrs"
                name="vcOftalmologia_vc"
                value={form?.vcOftalmologia_vc}
                disabled
                className="flex-1 w-full"
                labelWidth="35px"
              />
              <InputTextOneLine
                name="vbOftalmologia_vb"
                label="V.B."
                value={form?.vbOftalmologia_vb}
                disabled
                className="flex-1 w-full"
                labelWidth="35px"
              />
              <InputTextOneLine
                label="R.P."
                name="rpOftalmologia_rp"
                value={form?.rpOftalmologia_rp}
                disabled
                className="flex-1 w-full"
                labelWidth="35px"
              />
            </div>

            <InputTextArea
              label="Enfermedades Oculares"
              rows={2}
              name="enfermedadesOcularesOftalmologia_e_oculares"
              value={form?.enfermedadesOcularesOftalmologia_e_oculares}
              onChange={handleChange}
              labelWidth="35px"
            />

          </div>
        </SectionFieldset>
      </div>
    </div>
  </div>
  
);
}