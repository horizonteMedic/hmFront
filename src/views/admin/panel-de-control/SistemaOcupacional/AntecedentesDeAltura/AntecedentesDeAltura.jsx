import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { useSessionData } from "../../../../hooks/useSessionData";
import { useForm } from "../../../../hooks/useForm";
import {
  PrintHojaR,
  SubmitDataService,
  VerifyTR,
} from "./controllerAntecedentesDeAltura";
import { getToday } from "../../../../utils/helpers";
import EmpleadoComboBox from "../../../../components/reusableComponents/EmpleadoComboBox";
import SectionFieldset from "../../../../components/reusableComponents/SectionFieldset";
import InputTextOneLine from "../../../../components/reusableComponents/InputTextOneLine";
import DatosPersonalesLaborales from "../../../../components/templates/DatosPersonalesLaborales";
import RadioTable from "../../../../components/reusableComponents/RadioTable";
import InputsBooleanRadioGroup from "../../../../components/reusableComponents/InputsBooleanRadioGroup";
import InputTextArea from "../../../../components/reusableComponents/InputTextArea";
import BotonesAccion from "../../../../components/templates/BotonesAccion";
import { getAntecedentesDeAlturaInitialFormState } from "./antecedentesDeAlturaFormDefaults";
import CargaMasivaAntecedentesDeAltura from "./CargaMasivaAntecedentesDeAltura/CargaMasivaAntecedentesDeAltura";

const tabla = "antece_enfermedades_altura";

export default function AntecedentesDeAltura() {
  const today = getToday();
  const { token, userlogued, selectedSede, datosFooter, userName, userDNI, userCMP, userEmail, userDireccion } = useSessionData();
  const initialFormState = getAntecedentesDeAlturaInitialFormState({
    today,
    userlogued,
    userName,
    userDNI,
    userCMP,
    userEmail,
    userDireccion,
  });

  const [modalCargaMasiva, setModalCargaMasiva] = useState(false);

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
  } = useForm(initialFormState, { storageKey: "antecedentes_altura" });

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
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setModalCargaMasiva(true)}
          className="verde-btn px-4 py-2 rounded flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faUpload} /> Carga Masiva
        </button>
      </div>
      <SectionFieldset legend="Antecedentes de Enfermedades en Altura" className="grid grid-cols-1 xl:grid-cols-3 gap-x-4 gap-y-3">
        <InputTextOneLine
          label="N° Orden"
          name="norden"
          value={form?.norden}
          onChange={handleChangeNumberDecimals}
          onKeyUp={handleSearch}
        />

        <InputTextOneLine
          label="Fecha"
          type="date"
          name="fechaExam"
          value={form.fechaExam || ""}
          onChange={handleChangeSimple}
        />

        <InputsBooleanRadioGroup
          label="Aptitud: "
          name="apto"
          value={form?.apto}
          onChange={handleRadioButtonBoolean}
          trueLabel="Apto"
          falseLabel="No apto"
        />

      </SectionFieldset>

      <DatosPersonalesLaborales form={form} />

      <SectionFieldset legend="Médico" className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-3">
        <InputTextOneLine
          label="Nombres"
          name="nombreMedico"
          value={form?.nombreMedico}
          disabled
          labelWidth="120px"
        />
        <InputTextOneLine
          label="CMP"
          name="cmp"
          value={form.cmp || ""}
          disabled
          labelWidth="120px"
        />
        <InputTextOneLine
          label="Email"
          name="email"
          value={form?.email}
          onChange={handleChangeSimple}
          disabled
          labelWidth="120px"
        />
        <InputTextOneLine
          label="Dirección"
          name="direccionMedico"
          value={form.direccionMedico || ""}
          disabled
          labelWidth="120px"
        />
      </SectionFieldset>

      <SectionFieldset legend="Antecedentes patológicos">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-3">

          <RadioTable className="grid grid-cols-1 md:grid-cols-2"
            items={[
              {
                name: "accidenteCerebrovascular",
                label: "Accidente cerebrovascular"
              },
              {
                name: "anginaInestable",
                label: "Angina inestable"
              },
              {
                name: "antecedenteBypass",
                label:
                  "Antecedente de Bypass arterial coronario/Angioplastia/Stent",
              },
              {
                name: "antecedenteEdemaCerebral",
                label: "Antecedente de edema cerebral de altura",
              },
              {
                name: "antecedenteEdemaPulmonar",
                label: "Antecendente de edema pulmonar de altura",
              },
              {
                name: "antecedenteNeumotorax",
                label: "Antecedente de Neumotórax en los ultimos 6 meses",
              },
              {
                name: "arritmiaCardiaca",
                label: "Arritmia cardiaca no controlada",
              },
              {
                name: "cardiomiopatiaHipertrofica",
                label: "Cardiomiopatía hipertrófica idiopática",
              },
              {
                name: "cirugiaMayor",
                label: "Cirugía mayor en los últimos 30 días",
              },
              {
                name: "insuficienciaValvulaAortica",
                label: "Cualquier insuficiencia en la válvula aórtica",
              },
              {
                name: "diabetesMellitus",
                label: "Diabetes Mellitus"
              },
              {
                name: "embarazo",
                label: "Embarazo"
              },
              {
                name: "epilepsia",
                label: "Epilepsia"
              },
            ]}
            options={[
              { value: true, label: "SI" },
              { value: false, label: "NO" }
            ]}
            labelColumns={6}
            form={form}
            handleRadioButton={handleRadioButtonBoolean}
          />

          <RadioTable className="grid grid-cols-1 md:grid-cols-2"
            items={[
              {
                name: "epoc",
                label: "EPOC - Enfermedad pulmonar obstructiva crónica confirmada",
              },
              {
                name: "eritrocitosisExcesiva",
                label: "Eritrocitosis excesiva (mal de montaña crónico)",
              },
              {
                name: "hipertensionArterial",
                label: "Hipertensión arterial",
              },
              {
                name: "hipertensionPulmonar",
                label: "Hipertensión pulmonar",
              },
              {
                name: "infartoMiocardio",
                label: "Infarto al miocardio en los últimos 6 meses",
              },
              {
                name: "insuficienciaCardiaca",
                label: "Insuficiencia cardíaca congestiva",
              },
              {
                name: "patologiaHemorragicaRetina",
                label: "Patología hemorrágica de retina",
              },
              {
                name: "patologiaValvularCardiaca",
                label: "Patología Valvular Cardíaca en tratamiento (ICC)",
              },
              {
                name: "presenciaMarcapasos",
                label: "Presencia de marcapasos",
              },
              {
                name: "riesgoCardiovascularAlto",
                label: "Presencia de riesgo cardiovascular alto",
              },
              {
                name: "trastornosCoagulacion",
                label: "Trastornos de la coagulación",
              },
              {
                name: "trombosisVenosaCerebral",
                label: "Trombosis venosa cerebral",
              },
              {
                name: "otros",
                label: "Otros"
              },

            ]}
            options={[
              { value: true, label: "SI" },
              { value: false, label: "NO" }
            ]}
            labelColumns={6}
            form={form}
            handleRadioButton={handleRadioButtonBoolean}
          />
        </div>
      </SectionFieldset>

      <SectionFieldset legend="Comentarios">
        <InputTextArea
          name="comentarios"
          value={form.comentarios}
          onChange={handleChange}
          rows={4}
        />
      </SectionFieldset>

      <SectionFieldset legend="Asignación de médico">
        <EmpleadoComboBox
          value={form.nombre_medico}
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

      {modalCargaMasiva && (
        <CargaMasivaAntecedentesDeAltura
          onClose={() => setModalCargaMasiva(false)}
          token={token}
          userlogued={userlogued}
          userName={userName}
          userDNI={userDNI}
          userCMP={userCMP}
          userEmail={userEmail}
          userDireccion={userDireccion}
          tabla={tabla}
          sede={selectedSede}
        />
      )}
    </div>
  );
}
