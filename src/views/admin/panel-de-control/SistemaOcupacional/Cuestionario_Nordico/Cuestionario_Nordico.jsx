import { useState } from "react";
// import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

import { useSessionData } from "../../../../hooks/useSessionData";
import { useForm } from "../../../../hooks/useForm";
import { useRegistroEditable } from "../../../../hooks/useRegistroEditable";
import { getToday, getFechaHoraActual } from "../../../../utils/helpers";
import { buildAuditoria } from "../../../../utils/auditoriaUtils";

import InputTextOneLine from "../../../../components/reusableComponents/InputTextOneLine";
import SectionFieldset from "../../../../components/reusableComponents/SectionFieldset";
import SearchButton from "../../../../components/reusableComponents/SearchButton";
import AccionesRegistroHeader from "../../../../components/reusableComponents/AccionesRegistroHeader";
import AuditoriaRegistro from "../../../../components/reusableComponents/AuditoriaRegistro";
import EmpleadoComboBox from "../../../../components/reusableComponents/EmpleadoComboBox";
import ButtonsPDF from "../../../../components/reusableComponents/ButtonsPDF";
import DatosPersonalesLaborales from "../../../../components/templates/DatosPersonalesLaborales";
import BotonesForm from "../../../../components/templates/BotonesForm";

import Cuestionario from "./componentes/Cuestionario";
import Responder from "./componentes/Responder";
import Espalda_Baja from "./componentes/Espalda_Baja";
import Hombros from "./componentes/Hombros";
import Cuello from "./componentes/Cuello";
import {
  VerifyTR,
  SubmitCuestionarioNordic,
  PrintHojaR,
  handleSubirArchivo,
  ReadArchivosForm,
  handleSubirArchivoMasivo,
} from "./ControllerCN";

const today = getToday();
const tabla = "cuestionario_nordico";

// Campos propios que el usuario puede editar en un registro existente (resaltar/revertir).
// Las ~180 preguntas del cuestionario respetan solo el bloqueo general (fieldset disabled).
const CAMPOS_EDITABLES = ["fechaCuestionario", "user_medicoFirma", "nombre_medico"];

const Cuestionario_Nordico = () => {
  const { token, selectedSede, userlogued, userName } = useSessionData();

  const initialFormState = {
    norden: "",
    codigoCuestionario: null,
    fechaCuestionario: today,

    // Datos personales
    nombres: "",
    edad: "",
    sexo: "",
    dni: "",
    fechaNacimiento: "",
    lugarNacimiento: "",
    estadoCivil: "",
    nivelEstudios: "",

    // Datos laborales
    empresa: "",
    contrata: "",
    ocupacion: "",
    cargoDesempenar: "",

    // Datos del trabajo (cuestionario)
    anios: "",
    meses: "",
    horasTrabajadas: "",
    esDiestro: false,
    esZurdo: false,
    //Responder
    cuelloNo: true,
    cuelloSi: false,
    pregunta1CuelloNo: false,
    pregunta1CuelloSi: false,
    pregunta2CuelloNo: false,
    pregunta2CuelloSi: false,
    //Hombros
    hombrosNo: true,
    hombroDerechoSi: false,
    hombroIzquierdoSi: false,
    ambosHombrosSi: false,
    pregunta1HombrosNo: false,
    pregunta1HombrosSi: false,
    pregunta2HombrosNo: false,
    pregunta2HombrosSi: false,
    //Codos
    codosNo: true,
    codoDerechoSi: false,
    codoIzquierdoNo: false,
    ambosCodosSi: false,
    pregunta1CodosNo: false,
    pregunta1CodosSi: false,
    pregunta2CodosNo: false,
    pregunta2CodosSi: false,
    //Otros
    //Espalda Alta
    espaldaAltaToraxNo: true,
    espaldaAltaToraxSi: false,
    pregunta1EspaldaAltaToraxNo: false,
    pregunta1EspaldaAltaToraxSi: false,
    pregunta2EspaldaAltaToraxNo: false,
    pregunta2EspaldaAltaToraxSi: false,
    //Espalda Baja
    espaldaBajaLumbarNo: true,
    espaldaBajaLumbarSi: false,
    pregunta1EspaldaBajaLumbarNo: false,
    pregunta1EspaldaBajaLumbarSi: false,
    pregunta2EspaldaBajaLumbarNo: false,
    pregunta2EspaldaBajaLumbarSi: false,
    //Caderas
    caderasOMuslosNo: true,
    caderasOMuslosSi: false,
    pregunta1CaderasOMuslosNo: false,
    pregunta1CaderasOMuslosSi: false,
    pregunta2CaderasOMuslosNo: false,
    pregunta2CaderasOMuslosSi: false,
    //Rodillas
    rodillasNo: true,
    rodillasSi: false,
    pregunta1RodillasNo: false,
    pregunta1RodillasSi: false,
    pregunta2RodillasNo: false,
    pregunta2RodillasSi: false,
    //Tobillos
    tobillosOPiesNo: true,
    tobillosOPiesSi: false,
    pregunta1TobillosOPiesNo: false,
    pregunta1TobillosOPiesSi: false,
    pregunta2TobillosOPiesNo: false,
    pregunta2TobillosOPiesSi: false,
    //Muñeca
    munecaNo: true,
    munecaDerechaSi: false,
    munecaIzquierdaSi: false,
    ambasMunecasSi: false,
    pregunta1MunecasNo: false,
    pregunta1MunecasSi: false,
    pregunta2MunecasNo: false,
    pregunta2MunecasSi: false,
    //Espalda Baja form
    pregunta1EspaldaBajaNo: true,
    pregunta1EspaldaBajaSi: false,
    pregunta2EspaldaBajaNo: false,
    pregunta2EspaldaBajaSi: false,
    pregunta3EspaldaBajaNo: false,
    pregunta3EspaldaBajaSi: false,
    //Dias 1
    pregunta4AEspaldaBaja: false,
    pregunta4BEspaldaBaja: false,
    pregunta4CEspaldaBaja: false,
    pregunta4DEspaldaBaja: false,
    pregunta4EEspaldaBaja: false,
    //5
    pregunta5AEspaldaBajaNo: false,
    pregunta5AEspaldaBajaSi: false,
    pregunta5BEspaldaBajaNo: false,
    pregunta5BEspaldaBajaSi: false,
    //6 Dias 2
    pregunta6AEspaldaBaja: false,
    pregunta6BEspaldaBaja: false,
    pregunta6CEspaldaBaja: false,
    pregunta6DEspaldaBaja: false,
    //7
    pregunta7EspaldaBajaNo: false,
    pregunta7EspaldaBajaSi: false,
    //8
    pregunta8EspaldaBajaNo: false,
    pregunta8EspaldaBajaSi: false,
    //Hombros
    pregunta1ProblemasHombrosNo: true,
    pregunta1ProblemasHombrosSi: false,
    //10.
    pregunta2ProblemasHombrosNo: false,
    pregunta2ProblemasHombroIzquierdoSi: false,
    pregunta2ProblemasHombroDerechoSi: false,
    pregunta2ProblemasAmbosHombros: false,
    //11
    pregunta3ProblemasHombrosNo: false,
    pregunta3ProblemasHombrosSi: false,
    //12
    pregunta4ProblemasHombrosNo: false,
    pregunta4ProblemasHombroIzquierdoSi: false,
    pregunta4ProblemasHombroDerechoSi: false,
    pregunta4ProblemasAmbosHombros: false,
    //13
    pregunta5AProblemasHombros: false,
    pregunta5BProblemasHombros: false,
    pregunta5CProblemasHombros: false,
    pregunta5DProblemasHombros: false,
    //14
    pregunta6AProblemasHombrosNo: false,
    pregunta6AProblemasHombrosSi: false,

    pregunta6BProblemasHombrosNo: false,
    pregunta6BProblemasHombrosSi: false,
    //15
    pregunta7AProblemasHombros: false,
    pregunta7BProblemasHombros: false,
    pregunta7CProblemasHombros: false,
    pregunta7DProblemasHombros: false,
    //16
    pregunta8ProblemasHombrosNo: false,
    pregunta8ProblemasHombrosSi: false,
    //17
    pregunta9ProblemasHombrosNo: false,
    pregunta9ProblemasHombroIzquierdoSi: false,
    pregunta9ProblemasHombroDerechoSi: false,
    pregunta9ProblemasAmbosHombros: false,
    //Cuello
    pregunta1ProblemasCuelloNo: true,
    pregunta1ProblemasCuelloSi: false,
    //2
    pregunta2ProblemasCuelloNo: false,
    pregunta2ProblemasCuelloSi: false,
    //3
    pregunta3ProblemasCuelloNo: false,
    pregunta3ProblemasCuelloSi: false,
    //4
    pregunta4AProblemasCuello: false,
    pregunta4BProblemasCuello: false,
    pregunta4CProblemasCuello: false,
    pregunta4DProblemasCuello: false,
    pregunta4EProblemasCuello: false,
    //5
    pregunta5AProblemasCuelloNo: false,
    pregunta5AProblemasCuelloSi: false,

    pregunta5BProblemasCuelloNo: false,
    pregunta5BProblemasCuelloSi: false,
    //6
    pregunta6AProblemasCuello: false,
    pregunta6BProblemasCuello: false,
    pregunta6CProblemasCuello: false,
    pregunta6DProblemasCuello: false,
    //7
    pregunta7ProblemasCuelloNo: false,
    pregunta7ProblemasCuelloSi: false,
    //8
    pregunta8ProblemasCuelloNo: false,
    pregunta8ProblemasCuelloSi: false,

    // Médico que Certifica //BUSCADOR
    nombre_medico: userName,
    user_medicoFirma: userlogued,

    SubirDoc: false,
    nomenclatura: "PRUEBA DE ESFUERZO",

    // Control de UI: false = registro nuevo / true = registro existente
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
    handleChangeNumber,
    handleChangeSimple,
    handleClear,
    handleClearnotO,
    handlePrintDefault,
  } = useForm(initialFormState);

  const {
    edicionHabilitada,
    habilitarEdicion,
    camposDeshabilitados,
    isFieldEdited,
    revertField,
    revertFields,
  } = useRegistroEditable(form, setForm, {
    tieneRegistro: form.tieneRegistro,
    camposEditables: CAMPOS_EDITABLES,
  });

  const [visualerOpen, setVisualerOpen] = useState(null);

  // ===== Búsqueda por N° Orden =====
  const executeSearch = () => {
    handleClearnotO();
    VerifyTR(form.norden, tabla, token, setForm, selectedSede);
  };

  const handleSearch = (e) => {
    if (!e || e.key === "Enter") {
      executeSearch();
    }
  };

  // ===== Guardar / Actualizar =====
  const handleGuardar = () => {
    SubmitCuestionarioNordic(form, token, userlogued, handleClear, tabla);
  };

  // ===== Impresión =====
  const handlePrint = () => {
    handlePrintDefault(() => {
      PrintHojaR(form.norden, token, tabla);
    });
  };

  const handlePrintNordenChange = (e) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return; // solo dígitos
    const hayDatosCargados = Boolean(
      form.nombres || form.dni || form.tieneRegistro
    );
    if (hayDatosCargados && value !== form.norden) {
      setForm({ ...initialFormState, norden: value });
    } else {
      setForm((f) => ({ ...f, norden: value }));
    }
  };

  const hayRegistroCargado = Boolean(form.nombres || form.dni);

  const auditoria = buildAuditoria(form, {
    usuarioActual: userlogued,
    fechaHoraActual: getFechaHoraActual(),
  });

  return (
    <div className="px-4 max-w-[95%] xl:max-w-[85%] mx-auto space-y-3">
      <AccionesRegistroHeader
        tieneRegistro={form.tieneRegistro}
        hayRegistroCargado={hayRegistroCargado}
        edicionHabilitada={edicionHabilitada}
        onHabilitarEdicion={habilitarEdicion}
        onLimpiar={handleClear}
      /> 

      {/* ===== SECCIÓN: N° ORDEN Y FECHA ===== */}
      <SectionFieldset
        legend="Información del Cuestionario"
        className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-3"
      >
        <div className="flex gap-x-3 w-full">
          <InputTextOneLine
            label="N° Orden"
            name="norden"
            value={form.norden}
            onChange={handleChangeNumber}
            onKeyUp={handleSearch}
            disabled={hayRegistroCargado}
            labelWidth="120px"
            className="w-full"
          />
          <SearchButton onClick={executeSearch} className="lg:hidden" />
        </div>
        <InputTextOneLine
          label="Fecha"
          name="fechaCuestionario"
          type="date"
          value={form.fechaCuestionario}
          onChange={handleChangeSimple}
          disabled={camposDeshabilitados}
          labelWidth="120px"
          edited={isFieldEdited("fechaCuestionario")}
          onRevert={() => revertField("fechaCuestionario")}
        />
      </SectionFieldset>

      {/* ===== SECCIÓN: DATOS PERSONALES Y LABORALES ===== */}
      <DatosPersonalesLaborales form={form} />

      {/* ===== SECCIÓN: DOCUMENTO ESCANEADO ===== */}
      <SectionFieldset legend="Documento Escaneado del Cuestionario">
        <ButtonsPDF
          {...(form.SubirDoc
            ? {
                handleSave: () => {
                  handleSubirArchivo(form, selectedSede, userlogued, token);
                },
              }
            : {})}
          {...(form.SubirDoc
            ? {
                handleRead: () => {
                  ReadArchivosForm(form, setVisualerOpen, token);
                },
              }
            : {})}
          handleMasivo={() => {
            handleSubirArchivoMasivo(form, selectedSede, userlogued, token);
          }}
        />
      </SectionFieldset>

      {/* ===== SECCIONES DEL CUESTIONARIO =====
          Se bloquean en conjunto cuando se ve un registro existente sin edición
          habilitada (fieldset disabled nativo -> deshabilita todos los controles). */}
      <fieldset
        disabled={camposDeshabilitados}
        className="m-0 p-0 border-0 space-y-3 disabled:opacity-70"
      >
        <SectionFieldset legend="1. Datos Personales del Trabajo">
          <Cuestionario
            form={form}
            setForm={setForm}
            handleChangeNumber={handleChangeNumber}
          />
        </SectionFieldset>

        <SectionFieldset legend="Signos y Síntomas Osteomusculares (últimos 12 meses)">
          <Responder form={form} setForm={setForm} />
        </SectionFieldset>

        <SectionFieldset legend="3. Problemas con la Espalda Baja">
          <Espalda_Baja form={form} setForm={setForm} />
        </SectionFieldset>

        <SectionFieldset legend="4. Problemas con los Hombros">
          <Hombros form={form} setForm={setForm} />
        </SectionFieldset>

        <SectionFieldset legend="5. Problemas con el Cuello">
          <Cuello form={form} setForm={setForm} />
        </SectionFieldset>
      </fieldset>

      {/* ===== SECCIÓN: ASIGNACIÓN DE MÉDICO ===== */}
      <SectionFieldset legend="Asignación de Médico">
        <EmpleadoComboBox
          value={form.nombre_medico}
          label="Especialista"
          form={form}
          onChange={handleChangeSimple}
          disabled={camposDeshabilitados}
          edited={isFieldEdited("user_medicoFirma")}
          onRevert={() => revertFields(["user_medicoFirma", "nombre_medico"])}
        />
      </SectionFieldset>

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
        onNordenChange={handlePrintNordenChange}
        handleSave={handleGuardar}
        saveLabel={
          form.tieneRegistro && edicionHabilitada
            ? "Guardar Cambios"
            : "Guardar/Actualizar"
        }
        handleEdit={habilitarEdicion}
        handleClear={handleClear}
        handlePrint={handlePrint}
        hideSave={form.tieneRegistro && !edicionHabilitada}
        hideEdit={!form.tieneRegistro || edicionHabilitada}
      />

      {visualerOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg overflow-hidden overflow-y-auto shadow-xl w-[700px] h-[auto] max-h-[90%]">
            <div className="px-4 py-2 naranjabackgroud flex justify-between">
              <h2 className="text-lg font-bold color-blanco">
                {visualerOpen.nombreArchivo}
              </h2>
              <button
                onClick={() => setVisualerOpen(null)}
                className="text-xl text-white"
                style={{ fontSize: "23px" }}
              >
                ×
              </button>
            </div>
            <div className="px-6 py-4  overflow-y-auto flex h-auto justify-center items-center">
              <iframe
                src={`https://docs.google.com/gview?url=${encodeURIComponent(
                  `${visualerOpen.mensaje}`
                )}&embedded=true`}
                type="application/pdf"
                className="h-[500px] w-[500px] max-w-full"
              />
            </div>
            <div className="flex justify-center">
              <a
                href={visualerOpen.mensaje}
                download={visualerOpen.nombreArchivo}
                className="azul-btn font-bold py-2 px-4 rounded mb-4"
              >
                <FontAwesomeIcon icon={faDownload} className="mr-2" /> Descargar
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cuestionario_Nordico;
