import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faComments } from "@fortawesome/free-solid-svg-icons";
import {
  GetInfoServicio,
  getInfoTabla,
  handleSubirArchivo,
  handleSubirArchivoMasivo,
  Loading,
  PrintConsultaEjecutada,
  PrintHojaR,
  ReadArchivosForm,
  SubmitDataService,
  UpdateDataService,
  TABLA_RAYOS_X_TORAX_PA,
  VerifyTR,
} from "./controllerRayoxXToraxPA";
import Swal from "sweetalert2";
import { useSessionData } from "../../../../../hooks/useSessionData";
import { useForm } from "../../../../../hooks/useForm";
import { useRegistroEditable } from "../../../../../hooks/useRegistroEditable";
import { getToday, getFechaHoraActual } from "../../../../../utils/helpers";
import { buildAuditoria } from "../../../../../utils/auditoriaUtils";
import InputTextOneLine from "../../../../../components/reusableComponents/InputTextOneLine";
import SectionFieldset from "../../../../../components/reusableComponents/SectionFieldset";
import DatosPersonalesLaborales from "../../../../../components/templates/DatosPersonalesLaborales";
import InputCheckbox from "../../../../../components/reusableComponents/InputCheckbox";
import InputTextArea from "../../../../../components/reusableComponents/InputTextArea";
import SearchButton from "../../../../../components/reusableComponents/SearchButton";
import RevertButton from "../../../../../components/reusableComponents/RevertButton";
import AccionesRegistroHeader from "../../../../../components/reusableComponents/AccionesRegistroHeader";
import AuditoriaRegistro from "../../../../../components/reusableComponents/AuditoriaRegistro";
import BotonesForm from "../../../../../components/templates/BotonesForm";
import TablaTemplate from "../../../../../components/templates/TablaTemplate";
import { formatearFechaCorta } from "../../../../../utils/formatDateUtils";
import EmpleadoComboBox from "../../../../../components/reusableComponents/EmpleadoComboBox";
import ButtonsPDF from "../../../../../components/reusableComponents/ButtonsPDF";
import CIE10List from "../../../../../components/reusableComponents/CIE10List";

const tabla = TABLA_RAYOS_X_TORAX_PA;

// Campos de la evaluación radiográfica (algunas casillas los cambian todos a la vez).
const CAMPOS_EVALUACION = [
  "vertices",
  "hilios",
  "senosCostofrenicos",
  "camposPulmonares",
  "mediastinos",
  "siluetaCardiovascular",
  "osteomuscular",
  "conclusiones",
  "conclusionesCie10",
  "observaciones",
];

// Campos que el usuario puede editar en este formulario (para resaltar/revertir cambios).
const CAMPOS_EDITABLES = [
  "fechaExam",
  ...CAMPOS_EVALUACION,
  "user_medicoFirma",
  "nombre_medico",
];

// Con `nOrdenInicial` el formulario va incrustado (p. ej. Auditoría de Protocolos): carga esa orden al abrir,
// no guarda su borrador, no muestra la búsqueda/historial y avisa con `onGuardado` al registrar el examen.
export default function RayosXToraxPA({ nOrdenInicial, onGuardado }) {
  const embebido = Boolean(nOrdenInicial);
  const [dataTabla, setDataTabla] = useState([]);
  // Sube cada vez que se carga un registro desde la tabla (aunque sea el mismo), para volver a bloquear la edición
  const [cargaId, setCargaId] = useState(0);
  const today = getToday();

  const { token, userlogued, selectedSede, datosFooter, userName } = useSessionData();

  const initialFormState = {
    norden: embebido ? String(nOrdenInicial) : "",
    codRat: null,
    fechaExam: today,
    nombreExamen: "",

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

    vertices: "LIBRES",
    hilios: "NORMALES",
    senosCostofrenicos: "LIBRES",
    camposPulmonares: "NORMALES",
    mediastinos: "NORMALES",
    siluetaCardiovascular: "NORMAL",
    osteomuscular: "NORMAL",
    conclusiones: "NORMAL",
    conclusionesCie10: "",
    observaciones: "NORMAL",

    nombres_search: "",
    codigo_search: "",
    fechaDesde: today,
    fechaHasta: today,

    // Médico que Certifica //BUSCADOR
    nombre_medico: userName,
    user_medicoFirma: userlogued,

    SubirDoc: false,
    nomenclatura: "RAYOS X TORAX",

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
    handleChangeNumberDecimals,
    handleChangeSimple,
    handleClear,
    handleClearnotO,
    handlePrintDefault,
  } = useForm(initialFormState, { storageKey: embebido ? undefined : "rayosX_torax_PA" });

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
    resetKey: cargaId,
  });

  // El médico se compone de 2 campos (id de firma + nombre): se detecta el cambio por
  // el id y se revierten ambos en conjunto.
  const isMedicoEdited = isFieldEdited("user_medicoFirma");
  const revertMedico = () => revertFields(["user_medicoFirma", "nombre_medico"]);

  // Props comunes de un campo de texto: bloqueo, resaltado de cambios y botón de revertir.
  const campo = (name, onChange = handleChange) => ({
    name,
    value: form[name] ?? "",
    onChange,
    disabled: camposDeshabilitados,
    edited: isFieldEdited(name),
    onRevert: () => revertField(name),
  });

  const [visualerOpen, setVisualerOpen] = useState(null)

  // ===== Búsqueda con boton =====
  const executeSearch = () => {
    handleClearnotO();
    VerifyTR(form.norden, tabla, token, setForm, selectedSede);
  };

  // ===== Búsqueda con enter =====
  const handleSearch = (e) => {
    if (!e || e.key === "Enter") {
      executeSearch();
    }
  };

  // Incrustado no se limpia el formulario al registrar: se avisa para que el contenedor muestre el nuevo estado
  const alRegistrar = embebido ? () => onGuardado?.() : handleClear;

  const handleSave = () => {
    SubmitDataService(form, token, userlogued, alRegistrar, tabla, datosFooter);
  };

  const handleEdit = () => {
    UpdateDataService(form, token, userlogued, alRegistrar, tabla, datosFooter);
  };

  const handlePrintNordenChange = (e) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return; // solo dígitos

    const hayDatosCargados = Boolean(form.nombres || form.dni || form.tieneRegistro);
    if (hayDatosCargados && value !== form.norden) {
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

  const handleEjecutarConsulta = () => {
    Swal.fire({
      title: "¿Desea Imprimir Consulta?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, Imprimir",
      cancelButtonText: "Cancelar",
      customClass: {
        title: "swal2-title",
        confirmButton: "swal2-confirm",
        cancelButton: "swal2-cancel",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        PrintConsultaEjecutada(
          form.fechaDesde,
          form.fechaHasta,
          token,
          datosFooter
        );
      }
    });
  };

  const obtenerInfoTabla = () => {
    getInfoTabla(form.nombres_search, form.codigo_search, setDataTabla, token);
  };

  useEffect(() => {
    if (!embebido) obtenerInfoTabla();
  }, [embebido]);

  // Incrustado: abre la orden recibida (datos del paciente si aún no hay examen; si ya existe, sus resultados)
  useEffect(() => {
    if (embebido) {
      VerifyTR(String(nOrdenInicial), tabla, token, setForm, selectedSede, { silencioso: true });
    }
  }, [embebido, nOrdenInicial, selectedSede, token, setForm]);

  const hayRegistroCargado = Boolean(form.nombres || form.dni);
  const nordenDisabled = embebido || hayRegistroCargado;

  const auditoria = buildAuditoria(form, {
    usuarioActual: userlogued,
    fechaHoraActual: getFechaHoraActual(),
  });

  return (
    <div className={embebido ? "px-4 space-y-3" : "px-4 max-w-[95%] mx-auto space-y-3"}>
      <AccionesRegistroHeader
        tieneRegistro={form.tieneRegistro}
        hayRegistroCargado={hayRegistroCargado}
        edicionHabilitada={edicionHabilitada}
        onHabilitarEdicion={habilitarEdicion}
        onLimpiar={handleClear}
        mostrarLimpiar={!embebido}
      />

      <div className={embebido ? "space-y-3" : "grid xl:grid-cols-2 gap-6 items-start"}>
        {/* Columna izquierda: Formulario */}
        <div className="space-y-3 min-w-0">
          <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 2xl:grid-cols-3 gap-x-4 gap-y-3">
            <div className="flex gap-x-3 w-full">
              <InputTextOneLine
                label="N° Orden"
                name="norden"
                value={form.norden}
                onChange={handleChangeNumberDecimals}
                onKeyUp={handleSearch}
                disabled={nordenDisabled}
                className="w-full"
              />
              {!embebido && <SearchButton onClick={executeSearch} className="lg:hidden" />}
            </div>
            <InputTextOneLine
              label="Fecha"
              type="date"
              {...campo("fechaExam", handleChangeSimple)}
            />
            <InputTextOneLine
              label="Tipo Examen"
              name="nombreExamen"
              value={form.nombreExamen}
              disabled
            />
          </SectionFieldset>

          <SectionFieldset legend="Documento de Radiografía">
            <ButtonsPDF
              {...form.SubirDoc ? { handleSave: () => { handleSubirArchivo(form, selectedSede, userlogued, token, form.nomenclatura) } } : {}}
              {...form.SubirDoc ? { handleRead: () => { ReadArchivosForm(form, setVisualerOpen, token) } } : {}}
              handleMasivo={() => { handleSubirArchivoMasivo(form, selectedSede, userlogued, token, form.nomenclatura) }}
            />
          </SectionFieldset>

          <DatosPersonalesLaborales form={form} minSizePrincipal="none" />

          <SectionFieldset
            legend="Evaluación Radiográfica"
            className="space-y-3"
            actions={
              CAMPOS_EVALUACION.some(isFieldEdited) ? (
                <RevertButton
                  onClick={() => revertFields(CAMPOS_EVALUACION)}
                  title="Revertir cambios de esta sección"
                />
              ) : null
            }
          >
            <InputTextOneLine label="Vértices" labelWidth="150px" {...campo("vertices")} />

            <InputTextOneLine label="Hilios" labelWidth="150px" {...campo("hilios")} />

            <InputTextOneLine label="Senos Costofrénicos" labelWidth="150px" {...campo("senosCostofrenicos")} />

            <div className="space-y-2">
              <InputTextOneLine label="Campos Pulmonares" labelWidth="150px" {...campo("camposPulmonares")} />

              <InputCheckbox
                label="Trama Broncovascular Acentuada en ACP"
                name="tramaBroncovascular"
                checked={
                  form.camposPulmonares ===
                  "TRAMA BRONCOVASCULAR ACENTUADA EN ACP"
                }
                disabled={camposDeshabilitados}
                onChange={(e) => {
                  setForm((prev) => ({
                    ...prev,
                    camposPulmonares: e.target.checked
                      ? "TRAMA BRONCOVASCULAR ACENTUADA EN ACP"
                      : "",
                  }));
                }}
                className="ml-[170px]"
              />
            </div>

            <InputTextOneLine label="Campos Mediastinos" labelWidth="150px" {...campo("mediastinos")} />

            <InputTextOneLine label="Silueta Cardiovascular" labelWidth="150px" {...campo("siluetaCardiovascular")} />

            <InputTextOneLine label="Osteomuscular" labelWidth="150px" {...campo("osteomuscular")} />

            <InputTextOneLine label="Conclusiones Radiográficas" labelWidth="150px" {...campo("conclusiones")} />

            <div className="bg-green-200 p-3 rounded-xl flex items-start gap-2">
              <div className="flex-1">
                <CIE10List
                  value={form.conclusionesCie10}
                  fieldName="conclusionesCie10"
                  label="Conclusiones CIE10"
                  token={token}
                  setForm={setForm}
                  disabled={camposDeshabilitados}
                />
              </div>
              {isFieldEdited("conclusionesCie10") && (
                <RevertButton onClick={() => revertField("conclusionesCie10")} />
              )}
            </div>

            <div className="flex flex-col md:flex-row gap-x-4 gap-y-2">
              <InputTextArea label="Observaciones" rows={3} {...campo("observaciones")} />
              <div className="flex flex-col gap-y-2 mt-4 min-w-[190px]">
                <InputCheckbox
                  label="Evaluación Anual"
                  name="evaluacionAnual"
                  checked={form.observaciones === "EVALUACIÓN ANUAL"}
                  disabled={camposDeshabilitados}
                  onChange={(e) => {
                    setForm((prev) => ({
                      ...prev,
                      observaciones: e.target.checked
                        ? "EVALUACIÓN ANUAL"
                        : "",
                    }));
                  }}
                />
                <InputCheckbox
                  label="No se Tomó Radiografía de Tórax"
                  name="noRadiografiaTorax"
                  checked={form.observaciones === "NO SE TOMÓ RADIOGRAFIA DE TÓRAX"}
                  disabled={camposDeshabilitados}
                  onChange={(e) => {
                    const texto = e.target.checked
                      ? "NO SE TOMÓ RADIOGRAFIA DE TÓRAX"
                      : "";
                    setForm((prev) => ({
                      ...prev,
                      vertices: texto,
                      hilios: texto,
                      senosCostofrenicos: texto,
                      camposPulmonares: texto,
                      mediastinos: texto,
                      siluetaCardiovascular: texto,
                      osteomuscular: texto,
                      conclusiones: texto,
                      observaciones: texto,
                    }));
                  }}
                />

                <InputCheckbox
                  label="Evaluación por Neumología"
                  name="evaluacionNeumologia"
                  checked={form.observaciones === "EVALUACIÓN POR NEUMOLOGÍA"}
                  disabled={camposDeshabilitados}
                  onChange={(e) => {
                    setForm((prev) => ({
                      ...prev,
                      observaciones: e.target.checked
                        ? "EVALUACIÓN POR NEUMOLOGÍA"
                        : "",
                    }));
                  }}
                />
              </div>
            </div>
          </SectionFieldset>
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

        {/* Columna derecha: Panel de historial/búsqueda (incrustado se omite) */}
        {!embebido && (
          <div className="space-y-3 min-w-0">
            <SectionFieldset legend="Búsqueda de Registros" className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
                <InputTextOneLine
                  label="Nombre"
                  labelOnTop
                  name="nombres_search"
                  value={form.nombres_search}
                  onKeyUp={(e) => {
                    if (e.key === "Enter") {
                      obtenerInfoTabla();
                    }
                  }}
                  onChange={(e) => { handleChange(e); setForm(prev => ({ ...prev, codigo_search: "" })) }}
                />
                <InputTextOneLine
                  label="Código"
                  labelOnTop
                  name="codigo_search"
                  value={form.codigo_search}
                  onKeyUp={(e) => {
                    if (e.key === "Enter") {
                      obtenerInfoTabla();
                    }
                  }}
                  onChange={(e) => { handleChangeNumberDecimals(e); setForm(prev => ({ ...prev, nombres_search: "" })) }}
                />
              </div>
              <Table
                data={dataTabla}
                tabla={tabla}
                set={setForm}
                token={token}
                clean={handleClear}
                datosFooter={datosFooter}
                onCargarRegistro={() => setCargaId((id) => id + 1)}
              />
            </SectionFieldset>

            <SectionFieldset legend="Reportes por Fechas" className="grid grid-cols-1 md:grid-cols-10 gap-x-4 gap-y-3">
              <InputTextOneLine
                label="Fecha Desde"
                labelOnTop
                name="fechaDesde"
                type="date"
                value={form.fechaDesde}
                onChange={handleChangeSimple}
                className="md:col-span-4"
              />
              <InputTextOneLine
                label="Fecha Hasta"
                labelOnTop
                name="fechaHasta"
                type="date"
                value={form.fechaHasta}
                onChange={handleChangeSimple}
                className="md:col-span-4"
              />
              <div className="flex justify-end pt-4 md:col-span-2">
                <button
                  type="button"
                  onClick={handleEjecutarConsulta}
                  className="bg-blue-500 hover:bg-blue-600 text-white text-base px-6 py-2 rounded flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faComments} /> Ejecutar Consulta
                </button>
              </div>
            </SectionFieldset>
          </div>
        )}
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
        onNordenChange={handlePrintNordenChange}
        handleSave={form.tieneRegistro && edicionHabilitada ? handleEdit : handleSave}
        saveLabel={form.tieneRegistro && edicionHabilitada ? "Guardar Cambios" : "Guardar"}
        handleEdit={habilitarEdicion}
        handleClear={handleClear}
        handlePrint={handlePrint}
        hideSave={form.tieneRegistro && !edicionHabilitada}
        hideEdit={!form.tieneRegistro || edicionHabilitada}
        hideClear={embebido}
        hidePrint={embebido}
      />

      {/* Visor del archivo subido (fuera de la columna derecha: también se usa incrustado) */}
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
  );
}
function Table({ data, tabla, set, token, clean, datosFooter, onCargarRegistro }) {
  // confirmación antes de imprimir
  const handlePrintConfirm = (nro) => {
    Swal.fire({
      title: "Confirmar impresión",
      text: `¿Deseas imprimir la ficha Nº ${nro}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, imprimir",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        PrintHojaR(nro, token, tabla, datosFooter);
      }
    });
  };

  function clicktable(nro) {
    // Cada carga vuelve a bloquear la edición, aunque se elija otra vez el mismo registro.
    onCargarRegistro();
    clean();
    Loading("Importando Datos");
    GetInfoServicio(nro, tabla, set, token, () => {
      Swal.close();
    });
  }

  const columns = [
    {
      label: "N° Orden",
      accessor: "norden",
      width: "120px",
      render: (row) => <span className="font-bold">{row.norden}</span>,
    },
    {
      label: "Nombres",
      accessor: "nombres",
    },
    {
      label: "Fecha",
      accessor: "fechaInforme",
      render: (row) => formatearFechaCorta(row.fecha),
    },
  ];

  return (
    <TablaTemplate
      columns={columns}
      data={data}
      height={780}
      onRowClick={(row) => clicktable(row.norden)}
      onRowRightClick={(row) => handlePrintConfirm(row.norden)}
    />
  );
}
