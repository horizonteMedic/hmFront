import InputTextOneLine from "../../../../components/reusableComponents/InputTextOneLine";
import InputsBooleanRadioGroup from "../../../../components/reusableComponents/InputsBooleanRadioGroup";
import SectionFieldset from "../../../../components/reusableComponents/SectionFieldset";
import DatosPersonalesLaborales from "../../../../components/templates/DatosPersonalesLaborales";
import { useForm } from "../../../../hooks/useForm";
import { useSessionData } from "../../../../hooks/useSessionData";
import { getToday } from "../../../../utils/helpers";

export default function AntecedentesDeAltura() {
  const today = getToday();
  const { token, userlogued, selectedSede, datosFooter, userName, userDNI, userCMP, userEmail, userDireccion } = useSessionData();

  const initialFormState = {
    // Header - Información del examen
    norden: "",
    fecha: today,
    nombreExamen: "",
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

    // Información del médico
    dniMedico: userDNI,
    nombreMedico: userName,
    cmp: userCMP,
    email: userEmail,
    direccionMedico: userDireccion,

    // Antecedentes patológicos - todos en false por defecto
    accidenteCerebrovascular: false,
    anginaInestable: false,
    antecedenteBypass: false,
    antecedenteEdemaCerebral: false,
    antecedenteEdemaPulmonar: false,
    antecedenteNeumotorax: false,
    arritmiaCardiaca: false,
    cardiomiopatiaHipertrofica: false,
    cirugiaMayor: false,
    insuficienciaValvulaAortica: false,
    diabetesMellitus: false,
    embarazo: false,
    epilepsia: false,
    epoc: false,
    eritrocitosisExcesiva: false,
    hipertensionArterial: false,
    hipertensionPulmonar: false,
    infartoMiocardio: false,
    insuficienciaCardiaca: false,
    patologiaHemorragicaRetina: false,
    patologiaValvularCardiaca: false,
    presenciaMarcapasos: false,
    riesgoCardiovascularAlto: false,
    trastornosCoagulacion: false,
    trombosisVenosaCerebral: false,
    otros: false,
    otrosDescripcion: "",
    comentarios: "",

    usuario: userlogued ?? "",

    // Médico que Certifica //BUSCADOR
    nombre_medico: userName,
    user_medicoFirma: userlogued,
  }


  const {
    form,
    setForm,
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
      <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 2xl:grid-cols-4 gap-3">
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
          name="nombreExamen"
          value={form.nombreExamen}
          disabled
          labelWidth="120px"
        />
        <InputsBooleanRadioGroup
          label="Aptitud"
          name="esApto"
          value={form.esApto}
          trueLabel="APTO"
          falseLabel="NO APTO"
          onChange={handleRadioButtonBoolean}
        />
      </SectionFieldset>

      <DatosPersonalesLaborales form={form} />

      <SectionFieldset legend="Médico" className="grid grid-cols-1 2xl:grid-cols-4 gap-3">

        <InputTextOneLine
          label="Nombres"
          name="nombreMedico"
          value={form.nombreMedico}
          disabled
          labelWidth="120px"
        />

        <InputTextOneLine
          label="CMP"
          name="cmp"
          value={form.cmp}
          disabled
          labelWidth="120px"
        />

        <InputTextOneLine
          label="Email"
          name="email"
          value={form.email}
          disabled
          labelWidth="120px"
        />

        <InputTextOneLine
          label="Dirección"
          name="direccionMedico"
          value={form.direccionMedico}
          disabled
          labelWidth="120px"
        />
      </SectionFieldset>

      </div>

  )
}