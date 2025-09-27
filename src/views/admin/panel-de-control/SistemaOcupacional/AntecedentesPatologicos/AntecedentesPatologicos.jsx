import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faStethoscope, faFileMedical } from "@fortawesome/free-solid-svg-icons";
import AntecedentesPatologicosTab from "./AntecedentesPatologicosTab/AntecedentesPatologicosTab"
import IndicarEnfermedades from "./IndicarEnfermedades/IndicarEnfermedades"
import Antecedentes from "./Antecedentes/Antecedentes";
import { InputTextOneLine, InputTextArea } from "../../../../components/reusableComponents/ResusableComponents";
import { useSessionData } from "../../../../hooks/useSessionData";
import { useForm } from "../../../../hooks/useForm";
import { useState } from "react";
import { getToday } from "../../../../utils/helpers";
import { PrintHojaR, SubmitDataService, VerifyTR } from "./controllerAntecedentesPatologicos";

const tabla = "antecedentes_patologicos"
const today = getToday();

// Tab Normal de Antecedentes Patológicos
export default function AntecedentesPatologicos({ listas }) {
  const { MedicosMulti } = listas;
  const { token, userlogued, selectedSede, datosFooter, userCompleto } =
    useSessionData();

  const initialFormState = {
    //PRIMERA TAB==========================================================================
    norden: "",
    codigoAntecedentesPatologicos_cod_ap: null,
    fechaExam: today,
    nombres: "",
    sexo: "",
    edad: "",
    boroo: false,

    covid19: false,
    fechaCovid: today,
    severidadCovid: "",

    alergias: false,
    amigdalitisCronica: false,
    arritmiasCardiacas: false,
    asma: false,
    bocio: false,
    bronconeumonia: false,
    bronquitisRepeticion: false,
    cariesGingivitis: false,
    colecistitis: false,
    dermatitis: false,
    diabetes: false,
    disenteria: false,
    enfCorazon: false,
    enfOculares: false,
    epilepsiaConvulsiones: false,
    faringitisCronica: false,
    fiebreMalta: false,
    fiebreTifoidea: false,
    fiebreReumatica: false,
    forunculosis: false,

    gastritisCronica: false,
    gonorrea: false,
    gota: false,
    hemorroides: false,
    hepatitis: false,
    hernias: false,
    hipertensionArterial: false,
    infUrinariasRepetidas: false,
    intoxicaciones: false,
    insuficienciaCardiaca: false,
    insuficienciaCoronariaCronica: false,
    insuficienciaRenalCronica: false,
    litiasisUrinaria: false,
    meningitis: false,
    neuritisRepeticion: false,
    otitisMedia: false,
    presionAltaBaja: false,
    paludismoMalaria: false,
    parasitosisIntestinal: false,
    parotiditis: false,

    pleuresia: false,
    plumbismo: false,
    poliomielitis: false,
    portadorMarcapaso: false,
    protesisCardiacasValvulares: false,
    resfriosFrecuentes: false,
    reumatismoRepeticion: false,
    sarampion: false,
    sifilis: false,
    silicosis: false,
    sinusitisCronica: false,
    tosConvulsiva: false,
    trastornosNerviosos: false,
    traumatismoEncefalocraneano: false,
    tuberculosis: false,
    vertigos: false,
    tumoresQuistes: false,
    ulceraPeptica: false,
    varicela: false,
    varices: false,
    varicocele: false,

    ima: false,
    acv: false,
    tbc: false,
    ets: false,
    vih: false,
    fobias: false,

    tifoidea: false,
    neoplasias: false,
    quemaduras: false,
    discopatias: false,
    columna: false,
    enfPsiquiatricas: false,

    enfReumatica: false,
    enfPulmonares: false,
    enfPiel: false,
    tendinitis: false,
    onicomicosis: false,
    fracturas: false,
    anemia: false,
    obesidad: false,
    dislipidemia: false,
    amputacion: false,
    sordera: false,
    migrana: false,

    otrasPatologias: "",
    detallesTratamiento: "",
    alergiasMedicamentos: false,
    especifiqueAlergias: "",

    accidenteTrabajo: false,
    fechaAccidente: today,
    tiempoPerdido: false,
    especifiqueTiempoPerdido: "",
    tipoIncapacidad: "",

    enfermedadProfesional: false,
    evaluadoCalificacion: false,
    especifiqueCalificacion: "",
    fechaCalificacion: today,

    //LATERAL TAB==========================================================================
    vcOD: "",
    vlOD: "",
    vcOI: "",
    vlOI: "",
    vcCorregidaOD: "",
    vlCorregidaOD: "",
    vcCorregidaOI: "",
    vlCorregidaOI: "",
    vclrs: "",
    vb: "",
    rp: "",
    enfermedadesOculares: "",
    dosisVacunas: "",
    cocaina: "",
    cocainaRed:false,
    marihuana: "",
    marihuanaRed:false,

    //SEGUNDA TAB==========================================================================

    perdidaMemoria: false,
    preocupacionesAngustia: false,
    doloresArticulares: false,
    aumentoDisminucionPeso: false,
    dolorCabeza: false,
    diarrea: false,
    agitacionEjercicios: false,
    dolorOcular: false,
    dolorOpresivoTorax: false,
    hinchazonPiesManos: false,

    estrenimiento: false,
    vomitosSangre: false,
    sangradoOrina: false,
    tosSangre: false,
    coloracionAmarilla: false,
    indigestionFrecuente: false,
    insomnio: false,
    lumbalgias: false,
    mareosDesmayos: false,
    hecesNegras: false,

    orinaDolorArdor: false,
    orinaInvoluntaria: false,
    dolorOido: false,
    secrecionesOido: false,
    palpitaciones: false,
    adormecimientos: false,
    pesadillasFrecuentes: false,
    doloresMusculares: false,
    tosCronica: false,
    sangradoEncias: false,

    antitetanica: false,
    fiebreAmarilla: false,
    influenza: false,
    hepatitisA: false,
    hepatitisB: false,

    gripeInfluenza: false,
    neumococo: false,
    rabia: false,
    papilomaHumano: false,

    drogas: false,
    tipoDrogas: "",
    frecuenciaDrogas: "",

    licor: false,
    tipoLicor: "",
    frecuenciaLicor: "",

    fumar: false,
    numeroCigarrillos: "",

    otros: false,
    tipoOtros: "",
    frecuenciaOtros: "",

    medicamentos: false,
    especifiqueMedicamentos: "",

    actividadFisica: false,
    especifiqueActividadFisica: "",

    //TERCERA TAB==========================================================================
    fechaAntecedente: "",
    hospital: "",
    operacion: "",
    diasHospitalizacion: "",
    complicaciones: "",
    antecedentes: [],

    hijosVivos: "",
    hijosFallecidos: "",
    abortosParejas: "",
    causasAbortos: "",

    inicioMenstruacion: "",
    inicioVidaSexual: "",
    parejasSexuales: "",
    hijosVivosDamas: "",
    hijosFallecidosDamas: "",
    abortosDamas: "",
    causasAbortosDamas: "",

    padre: "",
    madre: "",
    hermanos: "",
    hijos: "",
    esposaConyuge: "",
    carnetConadis: "",

    dniUsuario: userCompleto?.datos?.dni_user ?? "",
    // Médico que Certifica //BUSCADOR
    nombre_medico: userCompleto?.datos?.nombres_user?.toUpperCase(),
  };
  const {
    form,
    setForm,
    handleChange,
    handleChangeNumber,
    handleRadioButton,
    handleChangeSimple,
    handleCheckBoxChange,
    handleRadioButtonBoolean,
    handleClear,
    handleClearnotO,
    handlePrintDefault,
  } = useForm(initialFormState);
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      id: 0,
      name: "Antecedentes Patológicos",
      icon: faUser,
      component: AntecedentesPatologicosTab,
    },
    {
      id: 1,
      name: "Indicar Enfermedades",
      icon: faStethoscope,
      component: IndicarEnfermedades,
    },
    {
      id: 2,
      name: "Antecedentes",
      icon: faFileMedical,
      component: Antecedentes,
    },
  ];

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
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-lg p-3">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Columna 1 - Ancha con los 3 tabs */}
          <div className="lg:col-span-3">
            {/* Tab Navigation */}
            <nav className="flex bg-white border-b border-gray-200 mb-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`flex-1 px-4 py-3 uppercase tracking-wider border-b-4 transition-colors duration-200 cursor-pointer hover:bg-gray-100 ${activeTab === tab.id
                    ? "border-[#233245] font-semibold"
                    : "border-transparent"
                    }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <FontAwesomeIcon icon={tab.icon} className="mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>

            {/* Tab Content */}
            <div className="max-w-full">
              {tabs.map((tab) => {
                const Component = tab.component;
                return (
                  activeTab === tab.id && (
                    <Component
                      key={tab.id}
                      form={form}
                      setForm={setForm}
                      handleChange={handleChange}
                      handleChangeNumber={handleChangeNumber}
                      handleRadioButton={handleRadioButton}
                      handleCheckBoxChange={handleCheckBoxChange}
                      handleChangeSimple={handleChangeSimple}
                      handleRadioButtonBoolean={handleRadioButtonBoolean}
                      MedicosMulti={MedicosMulti}
                      handleSave={handleSave}
                      handleSearch={handleSearch}
                      handlePrint={handlePrint}
                      handleClear={handleClear}
                    />
                  )
                );
              })}
            </div>
          </div>
          {/* Columna 2 - Pequeña con formulario ocular */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 h-full">
              <h5 className="font-semibold mb-3">Examen Ocular</h5>
              {/* Sin Corregir */}
              <div className="mb-4">
                <h6 className="font-semibold mb-2">Sin Corregir</h6>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center">
                    <div className="font-semibold mb-2">O.D</div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="min-w-[30px]">V.C.:</span>
                        <InputTextOneLine name="vcOD" value={form?.vcOD} disabled />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="min-w-[30px]">V.L.:</span>
                        <InputTextOneLine name="vlOD" value={form?.vlOD} disabled />
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold mb-2">O.I</div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="min-w-[30px]">V.C.:</span>
                        <InputTextOneLine name="vcOI" value={form?.vcOI} disabled />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="min-w-[30px]">V.L.:</span>
                        <InputTextOneLine name="vlOI" value={form?.vlOI} disabled />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Corregida */}
              <div className="mb-4">
                <h6 className="font-semibold mb-2">Corregida</h6>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center">
                    <div className="font-semibold mb-2">O.D</div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="min-w-[30px]">V.C.:</span>
                        <InputTextOneLine name="vcCorregidaOD" value={form?.vcCorregidaOD} disabled />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="min-w-[30px]">V.L.:</span>
                        <InputTextOneLine name="vlCorregidaOD" value={form?.vlCorregidaOD} disabled />
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold mb-2">O.I</div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="min-w-[30px]">V.C.:</span>
                        <InputTextOneLine name="vcCorregidaOI" value={form?.vcCorregidaOI} disabled />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="min-w-[30px]">V.L.:</span>
                        <InputTextOneLine name="vlCorregidaOI" value={form?.vlCorregidaOI} disabled />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Campos adicionales de Corregida */}
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="min-w-[50px]">V.Clrs:</span>
                    <InputTextOneLine name="vclrs" value={form?.vclrs} disabled />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="min-w-[50px]">V.B.:</span>
                    <InputTextOneLine name="vb" value={form?.vb} disabled />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="min-w-[50px]">R.P.:</span>
                    <InputTextOneLine name="rp" value={form?.rp} disabled />
                  </div>
                </div>
              </div>
              {/* Campos de texto */}
              <div className="space-y-3">
                <InputTextArea rows={3} label="Enfermedades Oculares" name="enfermedadesOculares" value={form?.enfermedadesOculares} disabled />
                <InputTextOneLine label="Cocaína" labelOnTop name="cocaina" value={form?.cocaina} disabled  className={form?.cocainaRed ? "text-red-500" : ""}/>
                <InputTextOneLine label="Marihuana" labelOnTop name="marihuana" value={form?.marihuana} disabled className={form?.marihuanaRed ? "text-red-500" : ""}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
