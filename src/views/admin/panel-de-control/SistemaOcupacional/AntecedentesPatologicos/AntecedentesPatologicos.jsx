import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faStethoscope, faFileMedical } from "@fortawesome/free-solid-svg-icons";
import AntecedentesPatologicosTab from "./AntecedentesPatologicosTab/AntecedentesPatologicosTab"
import IndicarEnfermedades from "./IndicarEnfermedades/IndicarEnfermedades"
import Antecedentes from "./Antecedentes/Antecedentes";
import AccionesRegistroHeader from "../../../../components/reusableComponents/AccionesRegistroHeader";
import AuditoriaRegistro from "../../../../components/reusableComponents/AuditoriaRegistro";
import EmpleadoComboBox from "../../../../components/reusableComponents/EmpleadoComboBox";
import InputTextArea from "../../../../components/reusableComponents/InputTextArea";
import InputTextOneLine from "../../../../components/reusableComponents/InputTextOneLine";
import SearchButton from "../../../../components/reusableComponents/SearchButton";
import SectionFieldset from "../../../../components/reusableComponents/SectionFieldset";
import BotonesForm from "../../../../components/templates/BotonesForm";
import { useSessionData } from "../../../../hooks/useSessionData";
import { useForm } from "../../../../hooks/useForm";
import { useRegistroEditable } from "../../../../hooks/useRegistroEditable";
import { getToday, getFechaHoraActual } from "../../../../utils/helpers";
import { buildAuditoria } from "../../../../utils/auditoriaUtils";
import {
  PrintHojaR,
  SubmitDataService,
  TABLA_ANTECEDENTES_PATOLOGICOS,
  UpdateDataService,
  VerifyTR,
} from "./controllerAntecedentesPatologicos";

const tabla = TABLA_ANTECEDENTES_PATOLOGICOS;

// Campos que el usuario puede editar en este formulario (para resaltar/revertir cambios).
// Las casillas (enfermedades, síntomas, vacunas, agentes) solo respetan el bloqueo general.
const CAMPOS_EDITABLES = [
  "fechaExam",
  // Pestaña 1
  "severidadCovid",
  "fechaCovid",
  "otrasPatologias",
  "detallesTratamiento",
  "alergiasMedicamentos",
  "especifiqueAlergias",
  "accidenteTrabajo",
  "fechaAccidente",
  "tiempoPerdido",
  "especifiqueTiempoPerdido",
  "tipoIncapacidad",
  "enfermedadProfesional",
  "evaluadoCalificacion",
  "especifiqueCalificacion",
  "fechaCalificacion",
  // Pestaña 2
  "otrasEnfermedades",
  "dosisVacunas",
  "drogas",
  "tipoDrogas",
  "frecuenciaDrogas",
  "licor",
  "tipoLicor",
  "frecuenciaLicor",
  "fumar",
  "numeroCigarrillos",
  "otros",
  "tipoOtros",
  "frecuenciaOtros",
  "medicamentos",
  "especifiqueMedicamentos",
  "actividadFisica",
  "especifiqueActividadFisica",
  // Pestaña 3
  "antecedentes",
  "antecedentesEliminados",
  "hijosVivos",
  "hijosFallecidos",
  "abortosParejas",
  "causasAbortos",
  "inicioMenstruacion",
  "inicioVidaSexual",
  "parejasSexuales",
  "hijosVivosDamas",
  "hijosFallecidosDamas",
  "abortosDamas",
  "causasAbortosDamas",
  "padre",
  "madre",
  "hermanos",
  "hijos",
  "esposaConyuge",
  "carnetConadis",
  // Médico (id de firma + nombre)
  "user_medicoFirma",
  "nombre_medico",
];

// Tab Normal de Antecedentes Patológicos
// Con `nOrdenInicial` el formulario va incrustado (p. ej. Auditoría de Protocolos): carga esa orden al abrir,
// no guarda su borrador, sin Limpiar/Imprimir, y avisa con `onGuardado` al registrar o actualizar los antecedentes.
export default function AntecedentesPatologicos({ nOrdenInicial, onGuardado }) {
  const embebido = Boolean(nOrdenInicial);
  const today = getToday();
  const { token, userlogued, selectedSede, datosFooter, userCompleto, userName } =
    useSessionData();

  const initialFormState = {
    //PRIMERA TAB==========================================================================
    norden: embebido ? String(nOrdenInicial) : "",
    codigoAntecedentesPatologicos_cod_ap: null,
    fechaExam: today,
    nombres: "",
    dni: "",
    sexo: "",
    edad: "",
    boroo: false,

    covid19: false,
    fechaCovid: today,
    severidadCovid: "",

    //Agentes presentes en Trabajo Actual
    ruido: true,
    polvo: true,
    vidSegmentario: true,
    vidTotal: true,
    alturaEstruct: true,
    vibraciones: true,
    cancerigenos: false,
    mutagenicos: false,
    solventes: false,
    metales: false,
    alturaGeograf: false,
    temperaturaAgente: true,
    biologicos: false,
    posturas: true,
    turnos: false,
    quimicos: false,
    cargas: true,
    movRepet: true,
    pvd: false,
    electricos: false,
    otrosAgentes: false,
    //
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
    cocainaRed: false,
    marihuana: "",
    marihuanaRed: false,

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
    otrasEnfermedades: "",

    antitetanica: false,
    fiebreAmarilla: false,
    influenza: false,
    hepatitisA: false,
    hepatitisB: false,

    gripeInfluenza: false,
    neumococo: false,
    rabia: false,
    papilomaHumano: false,
    covidAntecedentePatologico: false,

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
    antecedentesEliminados: [],

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
    nombre_medico: userName,
    user_medicoFirma: userlogued,

    // Control de UI: false = mostrar Guardar (nuevo) / true = mostrar Editar (ya existe)
    tieneRegistro: false,

    // Auditoría
    userRegistro: "",
    fechaRegistro: "",
    usuarioActualizacion: "",
    fechaActualizacion: "",
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
    handleChangeNumberDecimals,
  } = useForm(initialFormState, { storageKey: embebido ? undefined : "antecedentes_patologicos" });

  const {
    edicionHabilitada,
    habilitarEdicion,
    camposDeshabilitados,
    isFieldEdited,
    revertField,
    revertFields,
  } = useRegistroEditable(form, setForm, { tieneRegistro: form.tieneRegistro, camposEditables: CAMPOS_EDITABLES });

  // El médico se compone de 2 campos (id de firma + nombre): se detecta el cambio por
  // el id y se revierten ambos en conjunto.
  const isMedicoEdited = isFieldEdited("user_medicoFirma");
  const revertMedico = () => revertFields(["user_medicoFirma", "nombre_medico"]);

  const [activeTab, setActiveTab] = useState(0);
  const [errors, setErrors] = useState({});

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
    /*{
      id: 3,
      name: "Mineros del Norte",
      icon: faN,
      component: MinerosdelNorte,
    },*/
  ];
  const ActiveComponent = tabs[activeTab]?.component || (() => null);

  const hayRegistroCargado = Boolean(form.nombres || form.dni);
  const nordenDisabled = embebido || hayRegistroCargado;

  // El error del N° Orden se muestra solo tras intentar guardar y se limpia cuando ya hay un paciente cargado.
  const ordenError = errors.norden && !hayRegistroCargado ? errors.norden : "";

  const validateForm = () => {
    const next = {};
    if (!String(form.norden ?? "").trim()) next.norden = "Ingrese el N° de orden.";
    else if (!hayRegistroCargado) next.norden = "Busque el N° de orden para cargar los datos del paciente.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleClearForm = () => {
    setErrors({});
    handleClear();
  };

  // Incrustado no se limpia el formulario al registrar: se avisa para que el contenedor muestre el nuevo estado
  const alRegistrar = embebido ? () => onGuardado?.() : handleClearForm;

  const handleSave = () => {
    if (!validateForm()) return;
    SubmitDataService(form, token, userlogued, alRegistrar, tabla, datosFooter);
  };

  const handleEdit = () => {
    if (!validateForm()) return;
    UpdateDataService(form, token, userlogued, alRegistrar, tabla, datosFooter);
  };

  // Incrustado: abre la orden recibida (si aún no hay registro ofrece copiar uno anterior; si ya existe, sus datos)
  useEffect(() => {
    if (embebido) {
      VerifyTR(String(nOrdenInicial), tabla, token, setForm, selectedSede, { silencioso: true });
    }
  }, [embebido, nOrdenInicial, selectedSede, token, setForm]);

  // ===== Búsqueda con boton =====
  const executeSearch = () => {
    setErrors({});
    handleClearnotO();
    VerifyTR(form.norden, tabla, token, setForm, selectedSede);
  };

  // ===== Búsqueda con enter =====
  const handleSearch = (e) => {
    if (!e || e.key === "Enter") {
      executeSearch();
    }
  };

  const handlePrintNordenChange = (e) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return; // solo dígitos

    const hayDatosCargados = Boolean(form.nombres || form.dni || form.tieneRegistro);
    if (hayDatosCargados && value !== form.norden) {
      setErrors({});
      setForm({ ...initialFormState, norden: value });
    } else {
      setForm((f) => ({ ...f, norden: value }));
    }
  };

  // ===== Impresión =====
  const handlePrint = () => {
    handlePrintDefault(() => {
      PrintHojaR(form.norden, token, tabla, datosFooter);
    });
  };

  const auditoria = buildAuditoria(form, {
    usuarioActual: userlogued,
    fechaHoraActual: getFechaHoraActual(),
  });

  return (
    <div
      className={
        // Incrustado el ancho útil es el del panel (no el de la ventana): bajo 1600 px las secciones de dos columnas
        // quedan muy angostas y desbordan, así que se apilan.
        embebido
          ? "space-y-3 px-4 max-[1599px]:[&>.grid]:grid-cols-1"
          : "space-y-3 px-4 max-w-[95%] mx-auto"
      }
    >
      <AccionesRegistroHeader
        tieneRegistro={form.tieneRegistro}
        hayRegistroCargado={hayRegistroCargado}
        edicionHabilitada={edicionHabilitada}
        onHabilitarEdicion={habilitarEdicion}
        onLimpiar={handleClearForm}
        mostrarLimpiar={!embebido}
      />

      {/* ===== SECCIÓN: N° ORDEN Y FECHA ===== */}
      <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-3">
        <div className="flex gap-x-3 w-full">
          <InputTextOneLine
            label="N° Orden"
            name="norden"
            value={form.norden}
            onKeyUp={handleSearch}
            onChange={handleChangeNumber}
            disabled={nordenDisabled}
            labelWidth="120px"
            className="w-full"
            error={ordenError}
          />
          {!embebido && <SearchButton onClick={executeSearch} className="lg:hidden" />}
        </div>
        <InputTextOneLine
          label="Fecha"
          name="fechaExam"
          type="date"
          value={form.fechaExam}
          onChange={handleChangeSimple}
          disabled={camposDeshabilitados}
          labelWidth="120px"
          edited={isFieldEdited("fechaExam")}
          onRevert={() => revertField("fechaExam")}
        />
      </SectionFieldset>

      {/* ===== SECCIÓN: DATOS DEL PACIENTE ===== */}
      <SectionFieldset legend="Datos del Paciente" className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-3">
        <InputTextOneLine label="Nombres" name="nombres" value={form.nombres} disabled labelWidth="120px" />
        <InputTextOneLine label="DNI" name="dni" value={form.dni} disabled labelWidth="120px" />
        <InputTextOneLine label="Sexo" name="sexo" value={form.sexo} disabled labelWidth="120px" />
        <InputTextOneLine label="Edad" name="edad" value={form.edad} disabled labelWidth="120px" />
      </SectionFieldset>

      <div className="flex flex-col lg:flex-row gap-3 items-start">
        {/* ===== COLUMNA PRINCIPAL: PESTAÑAS ===== */}
        <div className="w-full flex-1 min-w-0 space-y-3">
          <div className="bg-primarioClaro border rounded">
            <nav className="flex overflow-x-auto scrollbar-tabs bg-white border-b border-gray-200 rounded-t">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={`shrink-0 whitespace-nowrap lg:flex-1 px-4 py-3 uppercase tracking-wider text-[11px] border-b-4 transition-colors duration-200 cursor-pointer text-gray-700 hover:bg-gray-100 ${activeTab === tab.id
                    ? "border-[#233245] text-[#233245] font-semibold"
                    : "border-transparent"
                    }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <FontAwesomeIcon icon={tab.icon} className="mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
            <div className="p-4">
              <ActiveComponent
                form={form}
                setForm={setForm}
                handleChange={handleChange}
                handleChangeNumber={handleChangeNumber}
                handleRadioButton={handleRadioButton}
                handleCheckBoxChange={handleCheckBoxChange}
                handleChangeSimple={handleChangeSimple}
                handleRadioButtonBoolean={handleRadioButtonBoolean}
                disabled={camposDeshabilitados}
                isFieldEdited={isFieldEdited}
                revertField={revertField}
                revertFields={revertFields}
              />
            </div>
          </div>

          {/* ===== SECCIÓN: ASIGNACIÓN DE MÉDICO ===== */}
          <SectionFieldset legend="Asignación de Médico">
            <EmpleadoComboBox
              value={form.nombre_medico}
              label="Especialista"
              form={form}
              onChange={handleChangeSimple}
              disabled={camposDeshabilitados}
              edited={isMedicoEdited}
              onRevert={revertMedico}
            />
          </SectionFieldset>
        </div>

        {/* ===== BARRA LATERAL: EXAMEN OCULAR (solo lectura, Oftalmología / Laboratorio) ===== */}
        <aside className="w-full lg:w-80 shrink-0 space-y-3">
          <SectionFieldset legend="Examen Ocular">
            <div className="space-y-4">
              <div>
                <div className="font-semibold mb-2 text-center">Sin Corregir</div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <div className="font-semibold text-center">O.D</div>
                    <InputTextOneLine label="V.C." name="vcOD" value={form.vcOD} disabled labelWidth="35px" />
                    <InputTextOneLine label="V.L." name="vlOD" value={form.vlOD} disabled labelWidth="35px" />
                  </div>
                  <div className="space-y-2">
                    <div className="font-semibold text-center">O.I</div>
                    <InputTextOneLine label="V.C." name="vcOI" value={form.vcOI} disabled labelWidth="35px" />
                    <InputTextOneLine label="V.L." name="vlOI" value={form.vlOI} disabled labelWidth="35px" />
                  </div>
                </div>
              </div>
              <div>
                <div className="font-semibold mb-2 text-center">Corregida</div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <div className="font-semibold text-center">O.D</div>
                    <InputTextOneLine label="V.C." name="vcCorregidaOD" value={form.vcCorregidaOD} disabled labelWidth="35px" />
                    <InputTextOneLine label="V.L." name="vlCorregidaOD" value={form.vlCorregidaOD} disabled labelWidth="35px" />
                  </div>
                  <div className="space-y-2">
                    <div className="font-semibold text-center">O.I</div>
                    <InputTextOneLine label="V.C." name="vcCorregidaOI" value={form.vcCorregidaOI} disabled labelWidth="35px" />
                    <InputTextOneLine label="V.L." name="vlCorregidaOI" value={form.vlCorregidaOI} disabled labelWidth="35px" />
                  </div>
                </div>
                <div className="mt-3 space-y-2">
                  <InputTextOneLine label="V.Clrs" name="vclrs" value={form.vclrs} disabled labelWidth="50px" />
                  <InputTextOneLine label="V.B." name="vb" value={form.vb} disabled labelWidth="50px" />
                  <InputTextOneLine label="R.P." name="rp" value={form.rp} disabled labelWidth="50px" />
                </div>
              </div>
              <InputTextArea label="Enfermedades Oculares" name="enfermedadesOculares" rows={4} value={form.enfermedadesOculares} disabled />
              <InputTextOneLine label="Cocaína" labelOnTop name="cocaina" value={form.cocaina} disabled className={form.cocainaRed ? "text-red-500" : ""} />
              <InputTextOneLine label="Marihuana" labelOnTop name="marihuana" value={form.marihuana} disabled className={form.marihuanaRed ? "text-red-500" : ""} />
            </div>
          </SectionFieldset>
        </aside>
      </div>

      {/* ===== SECCIÓN: AUDITORÍA DEL REGISTRO ===== */}
      {hayRegistroCargado && (
        <AuditoriaRegistro
          mostrarEdicion={form.tieneRegistro}
          fechaCreacion={auditoria.fechaCreacion}
          fechaEdicion={auditoria.fechaActualizacion}
          usuarioRegistro={auditoria.usuarioRegistro}
          usuarioEdicion={auditoria.usuarioActualizacion}
        />
      )}

      {/* ===== BOTONES DE ACCIÓN ===== */}
      <BotonesForm
        form={form}
        handleChangeNumberDecimals={handleChangeNumberDecimals}
        onNordenChange={handlePrintNordenChange}
        handleSave={form.tieneRegistro && edicionHabilitada ? handleEdit : handleSave}
        saveLabel={form.tieneRegistro && edicionHabilitada ? "Guardar Cambios" : "Guardar"}
        handleEdit={habilitarEdicion}
        handleClear={handleClearForm}
        handlePrint={handlePrint}
        hideSave={form.tieneRegistro && !edicionHabilitada}
        hideEdit={!form.tieneRegistro || edicionHabilitada}
        hideClear={embebido}
        hidePrint={embebido}
      />
    </div>
  );
}
