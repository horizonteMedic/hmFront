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
    // Header
    norden: "",
    fechaExam: today,
    codigoAnexo: null,
    apto: undefined,
    actividadRealizar: "",
    // Datos personales
    dni: "",
    nombres: "",
    sexo: "",
    fechaNac: "",
    edad: "",

    // Signos vitales
    fc: "",
    pa: "",
    fr: "",
    imc: "",
    satO2: "",
    temperatura: "",
    peso: "",
    talla: "",

    medicoDireccion: userDireccion,

    // Antecedentes
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
    apneaSueno: false,

    otraCondicion: false,
    alergias: false,
    usoMedicacion: false,
    corregirAgudeza: false,
    obesidadDieta: false,
    diabetesControlado: false,
    sobrepeso: false,
    htaControlada: false,
    lentesCorrectivos: false,

    // Empresa
    contrata: "",
    empresa: "",
    observaciones: "",

    // Agudeza Visual
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

    // Médico
    nombre_medico: userName,
    user_medicoFirma: userlogued,
  };

  const {
    form,
    setForm,
    handleChange,
    handleChangeNumberDecimals,
    handleClear,
    handleChangeSimple,
    handleClearnotO,
    handlePrintDefault,
    handleRadioButton,
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
<SectionFieldset legend="Antecedentes del Registro Médico" collapsible>
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-3">

    <RadioTable
      items={[
        { name: "cirugiaMayor", label: "Cirugía Mayor Reciente" },
        { name: "desordenesCoagulacion", label: "Desórdenes de la coagulación, trombosis, etc." },
        { name: "diabetes", label: "Diabetes Mellitus" },
        { name: "hipertension", label: "Hipertensión Arterial" },
        { name: "embarazo", label: "Embarazo" },
        { name: "problemasNeurologicos", label: "Problemas Neurológicos: Epilepsia, vértigo, etc." },
        { name: "infeccionesRecientes", label: "Infecciones recientes (oídos, nariz, garganta)" },

        { name: "obesidadMorbida", label: "Obesidad Mórbida (IMC mayor a 35)" },
        { name: "problemasCardiacos", label: "Problemas Cardíacos: marcapasos, coronariopatías" },
        { name: "problemasRespiratorios", label: "Problemas respiratorios: Asma, EPOC" },
        { name: "problemasOftalmologicos", label: "Problemas Oftalmológicos: Retinopatía, glaucoma" },
        { name: "problemasDigestivos", label: "Problemas Digestivos: Úlcera péptica, hepatitis" },
        { name: "apneaSueño", label: "Apnea del Sueño" },
        { name: "otraCondicion", label: "Otra condición Médica Importante" },
        { name: "alergias", label: "Alergias" },
        { name: "usoMedicacion", label: "Uso de Medicación Actual" },
      ]}
      options={[
        { value: "SI", label: "SI" },
        { value: "NO", label: "NO" }
      ]}
      labelColumns={6}
      form={form}
      handleRadioButton={handleRadioButton}
    />

    {/* Campo adicional */}
    <InputTextOneLine
      label="Medicación Actual"
      name="medicacionActual"
      value={form?.medicacionActual}
      onChange={handleChange}
      disabled={form?.usoMedicacion !== "SI"}
    />

    <InputTextOneLine
      label="FUR"
      name="furDescripcion"
      value={form?.furDescripcion}
      onChange={handleChange}
    />

  </div>
</SectionFieldset>

    </div>
  </div>
  
);
}