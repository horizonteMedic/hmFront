import { useEffect, useState } from "react";
import OdontogramaAdultos from "./OdontogramaAdultos";
import OdontologiaReportes from "./OdontologiaReportes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faClipboardList,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import {
  getInfoTabla,
  PrintConsultaEjecutada,
  PrintHojaR,
  SubmitDataService,
  UpdateDataService,
  SubmitDataServiceLO,
  TABLA_ODONTOLOGIA,
  VerifyTR,
} from "./controllerOdontologia";
import OdontogramaLevantarObservacion from "./OdontogramaLevantarObservacion";
import Swal from "sweetalert2";
import { useForm } from "../../../../hooks/useForm";
import { useRegistroEditable } from "../../../../hooks/useRegistroEditable";
import { useSessionData } from "../../../../hooks/useSessionData";
import { getToday, getFechaHoraActual } from "../../../../utils/helpers";
import { buildAuditoria } from "../../../../utils/auditoriaUtils";
import EmpleadoComboBox from "../../../../components/reusableComponents/EmpleadoComboBox";
import SectionFieldset from "../../../../components/reusableComponents/SectionFieldset";
import SearchButton from "../../../../components/reusableComponents/SearchButton";
import InputTextOneLine from "../../../../components/reusableComponents/InputTextOneLine";
import AccionesRegistroHeader from "../../../../components/reusableComponents/AccionesRegistroHeader";
import AuditoriaRegistro from "../../../../components/reusableComponents/AuditoriaRegistro";
import BotonesForm from "../../../../components/templates/BotonesForm";
import { CAMPOS_DIENTES, CAMPOS_OBSERVACIONES } from "./camposOdontologia";

const tabla = TABLA_ODONTOLOGIA;
const tablaLO = "odontograma_lo";

// Campos que el usuario puede editar en este formulario (para resaltar/revertir cambios).
// Los contadores (ausentes, cariadas, etc.) se calculan a partir de los dientes, por eso no se incluyen.
const CAMPOS_EDITABLES = [
  "fechaExam",
  ...CAMPOS_DIENTES,
  ...CAMPOS_OBSERVACIONES,
  "user_medicoFirma",
  "nombre_medico",
];


// Con `nOrdenInicial` el formulario va incrustado (p. ej. Auditoría de Protocolos): carga esa orden al abrir,
// sin pestaña de reportes ni Limpiar/Imprimir, y avisa con `onGuardado` al registrar o actualizar el odontograma.
export default function Odontologia({ nOrdenInicial, onGuardado }) {
  const embebido = Boolean(nOrdenInicial);
  const today = getToday();
  const { token, userlogued, selectedSede, datosFooter, userName } = useSessionData();

  const initialFormState = {
    norden: embebido ? String(nOrdenInicial) : "",
    codOd: null,
    fechaExam: today,
    nombres: "",
    sexo: "",
    edad: "",
    empresa: "",
    contrata: "",

    d1: "Normal",
    d2: "Normal",
    d3: "Normal",
    d4: "Normal",
    d5: "Normal",
    d6: "Normal",
    d7: "Normal",
    d8: "Normal",
    d9: "Normal",
    d10: "Normal",
    d11: "Normal",
    d12: "Normal",
    d13: "Normal",
    d14: "Normal",
    d15: "Normal",
    d16: "Normal",
    d17: "Normal",
    d18: "Normal",
    d19: "Normal",
    d20: "Normal",
    d21: "Normal",
    d22: "Normal",
    d23: "Normal",
    d24: "Normal",
    d25: "Normal",
    d26: "Normal",
    d27: "Normal",
    d28: "Normal",
    d29: "Normal",
    d30: "Normal",
    d31: "Normal",
    d32: "Normal",

    ausente: 0,
    cariada: 0,
    porExtraer: 0,
    fracturada: 0,
    corona: 0,
    obturacion: 0,
    puente: 0,
    pprMetalica: 0,
    pprAcrilica: 0,
    pTotal: 0,
    normal: 32,
    malEstado: 0,

    observaciones: "",
    observacionesCie10: "",
    noPasoExamen: false,

    nombres_search: "",
    codigo_search: "",
    fechaDesde: today,
    fechaHasta: today,
    filtroOcupacional: true,
    filtroClientesConsulta: false,

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


  const initialFormStateLO = {
    norden: "",
    fechaExam: today,
    nombres: "",
    sexo: "",
    edad: "",
    empresa: "",
    contrata: "",

    d1: "Normal",
    d2: "Normal",
    d3: "Normal",
    d4: "Normal",
    d5: "Normal",
    d6: "Normal",
    d7: "Normal",
    d8: "Normal",
    d9: "Normal",
    d10: "Normal",
    d11: "Normal",
    d12: "Normal",
    d13: "Normal",
    d14: "Normal",
    d15: "Normal",
    d16: "Normal",
    d17: "Normal",
    d18: "Normal",
    d19: "Normal",
    d20: "Normal",
    d21: "Normal",
    d22: "Normal",
    d23: "Normal",
    d24: "Normal",
    d25: "Normal",
    d26: "Normal",
    d27: "Normal",
    d28: "Normal",
    d29: "Normal",
    d30: "Normal",
    d31: "Normal",
    d32: "Normal",

    ausente: 0,
    cariada: 0,
    porExtraer: 0,
    fracturada: 0,
    corona: 0,
    obturacion: 0,
    puente: 0,
    pprMetalica: 0,
    pprAcrilica: 0,
    pTotal: 0,
    normal: 32,
    malEstado: 0,

    observaciones: "",
  };

  const {
    form,
    setForm,
    handleChange,
    handleChangeNumber,
    handleChangeSimple,
    handleCheckBoxChange,
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
  } = useRegistroEditable(form, setForm, { tieneRegistro: form.tieneRegistro, camposEditables: CAMPOS_EDITABLES });

  // El médico se compone de 2 campos (id de firma + nombre): se detecta el cambio por el id y se
  // revierten ambos en conjunto.
  const isMedicoEdited = isFieldEdited("user_medicoFirma");
  const revertMedico = () => revertFields(["user_medicoFirma", "nombre_medico"]);

  const {
    form: formLO,
    setForm: setFormLO,
    handleChange: handleChangeLO,
    handleClear: handleClearLO,
    handleClearnotO: handleClearnotOLO,
  } = useForm(initialFormStateLO);

  const [activeTab, setActiveTab] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataTabla, setDataTabla] = useState([]);

  const changeTab = (tabIndex) => {
    setActiveTab(tabIndex);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    handleClearLO();
  };

  const handlePrint = () => {
    handlePrintDefault(() => {
      PrintHojaR(form.norden, token, tabla, datosFooter);
    });
  };

  // Incrustado no se limpia el formulario al registrar: se avisa para que el contenedor muestre el nuevo estado
  const alRegistrar = embebido ? () => onGuardado?.() : handleClear;

  const handleSave = () => {
    SubmitDataService(form, token, userlogued, alRegistrar, tabla, datosFooter);
  };

  const handleUpdate = () => {
    UpdateDataService(form, token, userlogued, alRegistrar, tabla, datosFooter);
  };

  // ===== Búsqueda con botón =====
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

  const hayRegistroCargado = Boolean(form.nombres);

  const handlePrintNordenChange = (e) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return; // solo dígitos

    const hayDatosCargados = Boolean(form.nombres || form.tieneRegistro);
    if (hayDatosCargados && value !== form.norden) {
      setForm({ ...initialFormState, norden: value });
    } else {
      setForm((f) => ({ ...f, norden: value }));
    }
  };

  const auditoria = buildAuditoria(form, {
    usuarioActual: userlogued,
    fechaHoraActual: getFechaHoraActual(),
  });

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

  const handleSaveLO = () => {
    SubmitDataServiceLO(
      formLO,
      token,
      userlogued,
      handleClearLO,
      tablaLO,
      closeModal,
      datosFooter
    );
  };
  useEffect(() => {
    if (!embebido) obtenerInfoTabla();
  }, [embebido]);

  // Incrustado: abre la orden recibida (datos del paciente si aún no hay odontograma; si ya existe, sus resultados)
  useEffect(() => {
    if (embebido) {
      VerifyTR(String(nOrdenInicial), tabla, token, setForm, selectedSede, { silencioso: true });
    }
  }, [embebido, nOrdenInicial, selectedSede, token, setForm]);

  const obtenerInfoTabla = () => {
    getInfoTabla(form.nombres_search, form.codigo_search, setDataTabla, token);
  };

  return (
    <div className="w-full  mx-auto bg-white p-6">
      <h2 className="text-2xl font-bold text-center mb-6">ODONTOLOGÍA</h2>
      {/* overflow-clip (no overflow-hidden): recorta igual pero no rompe la barra superior fija del registro */}
      <div className="mx-auto bg-white rounded-lg overflow-clip relative mt-6">
        <div className="container mx-auto mt-1 mb-12 px-4 sm:px-6 lg:px-8">
          <div className="pt-4">
            {(embebido || activeTab === 1) && (
              <AccionesRegistroHeader
                tieneRegistro={form.tieneRegistro}
                hayRegistroCargado={hayRegistroCargado}
                edicionHabilitada={edicionHabilitada}
                onHabilitarEdicion={habilitarEdicion}
                onLimpiar={handleClear}
                mostrarLimpiar={!embebido}
              />
            )}

            {/*superior*/}
            <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3 mb-6">
              <div className="flex gap-x-3 w-full">
                <InputTextOneLine
                  label="N° Orden"
                  name="norden"
                  value={form.norden || ""}
                  onChange={handleChangeNumber}
                  onKeyUp={handleSearch}
                  disabled={embebido || hayRegistroCargado}
                  labelWidth="130px"
                  className="w-full"
                />
                {!embebido && <SearchButton onClick={executeSearch} className="lg:hidden" />}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                <InputTextOneLine
                  label="Fecha de Examen"
                  name="fechaExam"
                  type="date"
                  value={form.fechaExam}
                  onChange={handleChange}
                  labelWidth="130px"
                  disabled={camposDeshabilitados}
                  edited={isFieldEdited("fechaExam")}
                  onRevert={() => revertField("fechaExam")}
                />
                <div className="flex flex-1 mt-auto">
                  <button
                    type="button"
                    disabled={form.codOd == null}
                    onClick={() => {
                      openModal();
                      setFormLO((prev) => ({ ...prev, norden: form.norden }));
                    }}
                    className={`px-3 h-[22px] rounded flex items-center w-full justify-center transition-colors duration-200 my-auto
                              ${form.codOd == null
                        ? "bg-gray-300 text-gray-500 "
                        : "bg-green-200 hover:bg-green-300 text-green-800 cursor-pointer"
                      }`}
                  >
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className={`mr-2 ${form.codOd == null
                        ? "text-gray-500"
                        : "text-green-800"
                        }`}
                    />
                    <p className="">LEVANTAR OBSERVACION</p>
                  </button>
                </div>
              </div>
              <InputTextOneLine
                label="Nombres"
                name="nombres"
                value={form.nombres || ""}
                disabled
                labelWidth="130px"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                <InputTextOneLine
                  label="Sexo"
                  name="sexo"
                  value={form.sexo}
                  disabled
                  labelWidth="130px"
                />
                <InputTextOneLine
                  label="Edad"
                  name="edad"
                  value={form.edad}
                  disabled
                  labelWidth="130px"
                />
              </div>
              <InputTextOneLine
                label="Empresa"
                name="empresa"
                value={form.empresa || ""}
                disabled
                labelWidth="130px"
              />
              <InputTextOneLine
                label="Contrata"
                name="contrata"
                value={form.contrata || ""}
                disabled
                labelWidth="130px"
              />
            </SectionFieldset>

            {/* Tabs (incrustado solo se muestra el odontograma) */}
            {!embebido && (
            <div className="flex gap-1">
              <div
                className={`px-6 py-2 border rounded-t-lg transition duration-150 text-base font-semibold  cursor-pointer   focus:outline-none flex items-center whitespace-nowrap ${activeTab === 1
                  ? "bg-[#233245] text-white font-bold"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  } ${activeTab === 1 ? "border-b-0" : "border-b"}`}
                onClick={() => changeTab(1)}
              >
                <FontAwesomeIcon icon={faUsers} className="mr-2" />
                Odontograma Adultos
              </div>
              <div
                className={`px-6 py-2 border rounded-t-lg transition duration-150 text-base font-semibold cursor-pointer  focus:outline-none flex items-center whitespace-nowrap ${activeTab === 2
                  ? "bg-[#233245] text-white font-bold"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  } ${activeTab === 2 ? "border-b-0" : "border-b"}`}
                onClick={() => changeTab(2)}
              >
                <FontAwesomeIcon icon={faClipboardList} className="mr-2" />
                Reportes
              </div>
            </div>
            )}

            {/* Contenido de los tabs */}
            {(embebido || activeTab === 1) && (
              <>
                <OdontogramaAdultos
                  form={form}
                  setForm={setForm}
                  token={token}
                  handleChange={handleChange}
                  handleCheckBoxChange={handleCheckBoxChange}
                  disabled={camposDeshabilitados}
                  isFieldEdited={isFieldEdited}
                  revertFields={revertFields}
                />
                <div className="mt-4 px-6">
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

                  {/* ===== SECCIÓN: AUDITORÍA DEL REGISTRO ===== */}
                  {hayRegistroCargado && (
                    <AuditoriaRegistro
                      className="mt-3"
                      mostrarEdicion={form.tieneRegistro}
                      fechaCreacion={auditoria.fechaCreacion}
                      fechaEdicion={auditoria.fechaActualizacion}
                      usuarioRegistro={auditoria.usuarioRegistro}
                      usuarioEdicion={auditoria.usuarioActualizacion}
                    />
                  )}

                  {/* ===== BOTONES DE ACCIÓN ===== */}
                  <div className="pt-2">
                    <BotonesForm
                      form={form}
                      onNordenChange={handlePrintNordenChange}
                      handleSave={form.tieneRegistro && edicionHabilitada ? handleUpdate : handleSave}
                      saveLabel={form.tieneRegistro && edicionHabilitada ? "Guardar Cambios" : "Guardar"}
                      handleEdit={habilitarEdicion}
                      handleClear={handleClear}
                      handlePrint={handlePrint}
                      hideSave={form.tieneRegistro && !edicionHabilitada}
                      hideEdit={!form.tieneRegistro || edicionHabilitada}
                      hideClear={embebido}
                      hidePrint={embebido}
                      printLabel="Imprimir"
                    />
                  </div>
                </div>
              </>
            )}
            {!embebido && activeTab === 2 && (
              <OdontologiaReportes
                form={form}
                setForm={setForm}
                handleChange={handleChange}
                handleEjecutarConsulta={handleEjecutarConsulta}
                tabla={tabla}
                token={token}
                handleClear={handleClear}
                dataTabla={dataTabla}
                setActiveTab={setActiveTab}
                obtenerInfoTabla={obtenerInfoTabla}
                selectedSede={selectedSede}
                datosFooter={datosFooter}
              />
            )}
           
          </div>
        </div>

        {/* Modal Levantar Observación */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg px-2 w-full max-h-[95%] mx-4 ">
              <OdontogramaLevantarObservacion
                form={formLO}
                setForm={setFormLO}
                handleChange={handleChangeLO}
                closeModal={closeModal}
                token={token}
                selectedSede={selectedSede}
                handleClear={handleClearLO}
                handleClearnotO={handleClearnotOLO}
                handleSave={handleSaveLO}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
