import InputTextOneLine from "../../../../components/reusableComponents/InputTextOneLine";
import InputsBooleanRadioGroup from "../../../../components/reusableComponents/InputsBooleanRadioGroup";
import SectionFieldset from "../../../../components/reusableComponents/SectionFieldset";
import DatosPersonalesLaborales from "../../../../components/templates/DatosPersonalesLaborales";
import { useForm } from "../../../../hooks/useForm";
import { useSessionData } from "../../../../hooks/useSessionData";
import { getToday } from "../../../../utils/helpers";
import { useState } from "react";
import RadioTable from "../../../../components/reusableComponents/RadioTable";
import EmpleadoComboBox from "../../../../components/reusableComponents/EmpleadoComboBox";
import BotonesAccion from "../../../../components/templates/BotonesAccion";
import {
  PrintHojaR,
  SubmitDataService,
  VerifyTR,
} from "./controllerAntecedentesDeAltura";

const tabla = "antece_enfermedades_altura";

export default function AntecedentesDeAltura() {
  const today = getToday();
  const { token, userlogued, selectedSede, datosFooter, userName, userDNI, userCMP, userEmail, userDireccion } = useSessionData();
  const [visualerOpen, setVisualerOpen] = useState(null)

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
    //columna 1
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

    //columna2
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
    handleChange,
    handleChangeSimple,
    handleClearnotO,
    handlePrintDefault,
    handleRadioButtonBoolean,
    handleRadioButton,
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
            <SectionFieldset legend="Antecedentes del Registro Médico" collapsible> 
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-3">
                    <RadioTable
                        items={[
                            { name: "accidenteCerebrovascular", label: "Accidente cerebrovascular" },
                            { name: "anginaInestable", label: "Angina inestable" },
                            { name: "antecedenteBypass", label: "Antecedente de Bypass arterial coronario/Angioplastia/Stent" },
                            { name: "antecedenteEdemaCerebral", label: "Antecedente de edema cerebral de altura" },
                            { name: "antecedenteEdemaPulmonar", label: "Antecendente de edema pulmonar de altura" },
                            { name: "antecedenteNeumotorax", label: "Antecedente de Neumotórax en los ultimos 6 meses" },
                            { name: "arritmiaCardiaca", label: "Arritmia cardiaca no controlada" },
                            { name: "cardiomiopatiaHipertrofica", label: "Cardiomiopatía hipertrófica idiopática" },
                            { name: "cirugiaMayor", label: "Cirugía mayor en los últimos 30 días" },
                            { name: "insuficienciaValvulaAortica", label: "Cualquier insuficiencia en la válvula aórtica" },
                            { name: "diabetesMellitus", label: "Diabetes Mellitus" },
                            { name: "embarazo", label: "Embarazo" },
                            { name: "epilepsia", label: "Epilepsia" },
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
                            { name: "epoc", label: "EPOC - Enfermedad pulmonar obstructiva crónica confirmada" },
                            { name: "eritrocitosisExcesiva", label: "Eritrocitosis excesiva (mal de montaña crónico)" },
                            { name: "hipertensionArterial", label: "Hipertensión arterial" },
                            { name: "hipertensionPulmonar", label: "Hipertensión pulmonar" },
                            { name: "infartoMiocardio", label: "Infarto al miocardio en los últimos 6 meses" },
                            { name: "insuficienciaCardiaca", label: "Insuficiencia cardíaca congestiva" },
                            { name: "patologiaHemorragicaRetina", label: "Patología hemorrágica de retina" },
                            { name: "patologiaValvularCardiaca", label: "Patología Valvular Cardíaca en tratamiento (ICC)" },
                            { name: "presenciaMarcapasos", label: "Presencia de marcapasos" },
                            { name: "riesgoCardiovascularAlto", label: "Presencia de riesgo cardiovascular alto" },
                            { name: "trastornosCoagulacion", label: "Trastornos de coagulación" },
                            { name: "trombosisVenosaCerebral", label: "Trombosis venosa cerebral" },
                            { name: "otros", label: "Otros" },
                          ]}
                        options={[
                            { value: "SI", label: "SI" },
                            { value: "NO", label: "NO" }
                        ]}
                        labelColumns={6}
                        form={form}
                        handleRadioButton={handleRadioButtonBoolean}
                    />
                    {form.otros === "SI" && (
                      <div className="mt-4">
                        <label className="font-semibold block mb-2 text-sm">
                          Especificar otros:
                        </label>
                        <input
                          className="border rounded px-3 py-2 w-full"
                          name="otrosDescripcion"
                          value={form.otrosDescripcion}
                          onChange={handleChange}
                          placeholder="Describa otros antecedentes..."
                        />
                      </div>
                    )}
                </div>
            </SectionFieldset>
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
                handleSave={handleSave}
                handleClear={handleClear}
                handlePrint={handlePrint}
                handleChangeNumberDecimals={handleChangeNumberDecimals}
            />
            {visualerOpen && (
                <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg overflow-hidden overflow-y-auto shadow-xl w-[700px] h-[auto] max-h-[90%]">
                        <div className="px-4 py-2 naranjabackgroud flex justify-between">
                            <h2 className="text-lg font-bold color-blanco">{visualerOpen.nombreArchivo}</h2>
                            <button onClick={() => setVisualerOpen(null)} className="text-xl text-white" style={{ fontSize: '23px' }}>×</button>
                        </div>
                        <div className="px-6 py-4  overflow-y-auto flex h-auto justify-center items-center">
                            <iframe src={`https://docs.google.com/gview?url=${encodeURIComponent(`${visualerOpen.mensaje}`)}&embedded=true`} type="application/pdf" className="h-[500px] w-[500px] max-w-full" />
                        </div>
                        <div className="flex justify-center">
                            <a href={visualerOpen.mensaje} download={visualerOpen.nombreArchivo} className="azul-btn font-bold py-2 px-4 rounded mb-4">
                                <FontAwesomeIcon icon={faDownload} className="mr-2" /> Descargar
                            </a>
                        </div>
                    </div>
                </div>
            )}
      </div>
  )
}
