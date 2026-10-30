import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicroscope,
  faTint,
  faHeartbeat,
  faDownload,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import Parenquimatosas from "./Parenquimatosas/Parenquimatosas";
import Pleurales from "./Pleurales/Pleurales";
import Engrosamiento from "./Engrosamiento/Engrosamiento";
import { useEffect, useState } from "react";
import {
  handleSubirArchivo,
  handleSubirArchivoMasivo,
  PrintHojaR,
  PrintHojaSinDatos,
  ReadArchivosForm,
  SubmitOIT,
  UpdateOIT,
  TABLA_OIT,
  VerifyTR,
} from "./controller/OIT_controller";
import Swal from "sweetalert2";
import ButtonsPDF from "../../../../components/reusableComponents/ButtonsPDF";
import { useSessionData } from "../../../../hooks/useSessionData";
import EmpleadoComboBox from "../../../../components/reusableComponents/EmpleadoComboBox";
import SectionFieldset from "../../../../components/reusableComponents/SectionFieldset";
import SearchButton from "../../../../components/reusableComponents/SearchButton";
import InputCheckbox from "../../../../components/reusableComponents/InputCheckbox";
import RevertButton from "../../../../components/reusableComponents/RevertButton";
import AccionesRegistroHeader from "../../../../components/reusableComponents/AccionesRegistroHeader";
import AuditoriaRegistro from "../../../../components/reusableComponents/AuditoriaRegistro";
import BotonesForm from "../../../../components/templates/BotonesForm";
import {
  getOITInitialFormState,
  CAMPOS_OIT_PARENQUIMATOSAS,
  CAMPOS_OIT_PLEURALES,
  CAMPOS_OIT_ENGROSAMIENTO,
} from "./oitFormDefaults";
import CargaMasivaOIT from "./CargaMasivaOIT/CargaMasivaOIT";
import InputTextOneLine from "../../../../components/reusableComponents/InputTextOneLine";
import { useForm } from "../../../../hooks/useForm";
import { useRegistroEditable } from "../../../../hooks/useRegistroEditable";
import { getToday, getFechaHoraActual } from "../../../../utils/helpers";
import { buildAuditoria } from "../../../../utils/auditoriaUtils";

const tabla = TABLA_OIT;
const today = getToday();

// Campos que el usuario puede editar en este formulario (para resaltar/revertir cambios).
// Las casillas de las pestañas se resaltan y revierten por pestaña (ver `tabs`).
const CAMPOS_EDITABLES = [
  "SinDatos",
  "flectura",
  "fradiografia",
  "user_medicoFirma",
  "nombre_medico",
  ...CAMPOS_OIT_PARENQUIMATOSAS,
  ...CAMPOS_OIT_PLEURALES,
  ...CAMPOS_OIT_ENGROSAMIENTO,
];

// Con `nOrdenInicial` el formulario va incrustado (p. ej. Auditoría de Protocolos): carga esa orden al abrir,
// sin carga masiva ni Limpiar/Imprimir, y avisa con `onGuardado` al registrar o actualizar el OIT.
const OIT = ({ nOrdenInicial, onGuardado }) => {
  const embebido = Boolean(nOrdenInicial);

  const { token, userlogued, selectedSede, userName, userDNI } = useSessionData();

  const [activeTab, setActiveTab] = useState(0);

  const estadoInicial = getOITInitialFormState({ today, userlogued, userName, userDNI });

  const {
    form,
    setForm,
    handleChangeNumber,
    handleChangeSimple,
  } = useForm({
    ...estadoInicial,
    norden: embebido ? String(nOrdenInicial) : "",
  });

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

  const [modalCargaMasiva, setModalCargaMasiva] = useState(false);

  const handleClean = () => {
    setForm(estadoInicial);
  };

  // Incrustado no se limpia el formulario al registrar: se avisa para que el contenedor muestre el nuevo estado
  const alRegistrar = embebido ? () => onGuardado?.() : handleClean;

  // Incrustado: abre la orden recibida (datos del paciente si aún no hay OIT; si ya existe, sus resultados)
  useEffect(() => {
    if (embebido) {
      VerifyTR(String(nOrdenInicial), tabla, token, setForm, selectedSede, { silencioso: true });
    }
  }, [embebido, nOrdenInicial, selectedSede, token, setForm]);

  const tabs = [
    {
      label: "Parenquimatosas",
      icon: faMicroscope,
      campos: CAMPOS_OIT_PARENQUIMATOSAS,
      component: (
        <Parenquimatosas
          token={token}
          selectedSede={selectedSede}
          userlogued={userlogued}
          form={form}
          setForm={setForm}
        />
      ),
    },
    {
      label: "Pleurales",
      icon: faTint,
      campos: CAMPOS_OIT_PLEURALES,
      component: (
        <Pleurales
          token={token}
          selectedSede={selectedSede}
          userlogued={userlogued}
          form={form}
          setForm={setForm}
        />
      ),
    },
    {
      label: "Engrosamiento",
      icon: faHeartbeat,
      campos: CAMPOS_OIT_ENGROSAMIENTO,
      component: (
        <Engrosamiento
          token={token}
          selectedSede={selectedSede}
          userlogued={userlogued}
          form={form}
          setForm={setForm}
        />
      ),
    },
  ];

  const tabActiva = tabs[activeTab];
  const tabEditada = (tab) => tab.campos.some(isFieldEdited);

  const handleset = () => {
    setForm((prev) => ({
      ...prev,
      ...estadoInicial,
      norden: prev.norden,
      aPruebaDeSoledad: prev.aPruebaDeSoledad,
      SinDatos: prev.SinDatos,
      nombre_medico: prev.nombre_medico,
      user_medicoFirma: prev.user_medicoFirma,
    }));
  };

  // ===== Búsqueda con botón =====
  const executeSearch = () => {
    handleset();
    VerifyTR(form.norden, tabla, token, setForm, selectedSede);
  };

  // ===== Búsqueda con enter =====
  const handleSearch = (e) => {
    if (!e || e.key === "Enter") {
      executeSearch();
    }
  };

  const hayRegistroCargado = Boolean(form.nombres);
  const hayRegistroExistente = form.tieneRegistro;

  const handleSave = () => {
    SubmitOIT(form, token, userlogued, alRegistrar, tabla);
  };

  const handleUpdate = () => {
    UpdateOIT(form, token, userlogued, alRegistrar, tabla);
  };

  const handlePrintNordenChange = (e) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return; // solo dígitos

    const hayDatosCargados = Boolean(form.nombres || form.tieneRegistro);
    if (hayDatosCargados && value !== form.norden) {
      setForm({ ...estadoInicial, norden: value });
    } else {
      setForm((f) => ({ ...f, norden: value }));
    }
  };

  const handlePrint = () => {
    if (!form.norden)
      return Swal.fire("Error", "Debe colocar un N° Orden", "error");
    if (form.SinDatos) {
      Swal.fire({
        title: "¿Desea Imprimir OIT SIN DATOS?",
        html: `<div style='font-size:1.1em;margin-top:8px;'><b style='color:#5b6ef5;'>N° Orden: ${form.norden}</b></div>`,
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
          PrintHojaSinDatos(form.norden, token, tabla);
        }
      });
    } else {
      Swal.fire({
        title: "¿Desea Imprimir OIT?",
        html: `<div style='font-size:1.1em;margin-top:8px;'><b style='color:#5b6ef5;'>N° Orden: ${form.norden}</b></div>`,
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
          PrintHojaR(form.norden, token, tabla);
        }
      });
    }
  };

  const auditoria = buildAuditoria(form, {
    usuarioActual: userlogued,
    fechaHoraActual: getFechaHoraActual(),
  });

  const [visualerOpen, setVisualerOpen] = useState(null)

  // Propiedades comunes de un campo editable: bloqueo, resaltado al modificarlo y botón de revertir.
  const editable = (name) => ({
    disabled: camposDeshabilitados,
    edited: isFieldEdited(name),
    onRevert: () => revertField(name),
  });

  return (
    <div className="">
      <div className={embebido ? "" : "max-w-[95%] mx-auto"}>
        <h1 className="text-3xl font-bold mb-4 text-center">OIT</h1>

        <AccionesRegistroHeader
          tieneRegistro={form.tieneRegistro}
          hayRegistroCargado={hayRegistroCargado}
          edicionHabilitada={edicionHabilitada}
          onHabilitarEdicion={habilitarEdicion}
          onLimpiar={handleClean}
          mostrarLimpiar={!embebido}
        >
          {!embebido && (
            <button
              type="button"
              onClick={() => setModalCargaMasiva(true)}
              className="pointer-events-auto verde-btn px-3 py-1.5 rounded flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faUpload} /> Carga Masiva
            </button>
          )}
        </AccionesRegistroHeader>

        <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-4 gap-y-3">
          <div className="flex gap-x-3 w-full">
            <InputTextOneLine
              label="N° Orden"
              name="norden"
              value={form.norden}
              onChange={handleChangeNumber}
              onKeyUp={handleSearch}
              disabled={embebido || hayRegistroCargado}
              labelWidth="100px"
              className="w-full"
            />
            {!embebido && <SearchButton onClick={executeSearch} className="lg:hidden" />}
          </div>
          <InputTextOneLine
            label="Lector"
            name="lector"
            value={form.doctor}
            disabled
            labelWidth="100px"
            className="xl:col-span-2"
          />
          <InputTextOneLine
            label="Nro Placa"
            name="placa"
            value={form.nplaca}
            disabled
            labelWidth="100px"
          />
          <InputTextOneLine
            label="Nombre"
            name="nombres"
            value={form.nombres}
            disabled
            labelWidth="100px"
            className="xl:col-span-2"
          />
          <InputTextOneLine
            label="Edad"
            name="edad"
            value={form.edad}
            disabled
            labelWidth="100px"
          />
          <div className="flex items-center gap-2">
            <InputCheckbox
              label="Sin Datos"
              labelRight={false}
              name="SinDatos"
              checked={form.SinDatos}
              disabled={camposDeshabilitados}
              onChange={() => setForm((prev) => ({ ...prev, SinDatos: !prev.SinDatos }))}
              className="font-semibold"
            />
            {isFieldEdited("SinDatos") && (
              <RevertButton onClick={() => revertField("SinDatos")} title="Revertir cambio" />
            )}
          </div>
          <InputTextOneLine
            label="Fecha de Lectura"
            name="flectura"
            type="date"
            value={form.flectura}
            onChange={handleChangeSimple}
            labelWidth="100px"
            {...editable("flectura")}
          />
          <InputTextOneLine
            label="Fecha de Radiografía"
            name="fradiografia"
            type="date"
            value={form.fradiografia}
            onChange={handleChangeSimple}
            labelWidth="100px"
            {...editable("fradiografia")}
          />
          <ButtonsPDF
            {...form.SubirDoc ? { handleSave: () => { handleSubirArchivo(form, selectedSede, userlogued, token, form.nomenclatura) } } : {}}
            {...form.SubirDoc ? { handleRead: () => { ReadArchivosForm(form, setVisualerOpen, token) } } : {}}
            handleMasivo={() => { handleSubirArchivoMasivo(form, selectedSede, userlogued, token, form.nomenclatura) }}
          />
        </SectionFieldset>

        {/* Tabs */}
        <div className="flex space-x-1 overflow-x-auto mt-4">
          {tabs.map((tab, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveTab(idx)}
              className={`px-6 py-2 border rounded-t-lg transition duration-150 text-base font-semibold focus:outline-none flex items-center whitespace-nowrap ${activeTab === idx
                ? "bg-[#233245] text-white font-bold"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              <FontAwesomeIcon icon={tab.icon} className="mr-2" />
              {tab.label}
              {tabEditada(tab) && (
                <span
                  className="ml-2 w-2.5 h-2.5 rounded-full bg-orange-500"
                  title="Pestaña con cambios"
                />
              )}
            </button>
          ))}
        </div>
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

        {/* Active Content: el fieldset bloquea las casillas de la pestaña mientras el registro no esté habilitado */}
        <div className="border border-gray-200 border-t-0 p-4 bg-white rounded-b-lg text-lg">
          {tabEditada(tabActiva) && (
            <div className="flex items-center justify-end gap-2 mb-3 text-sm text-orange-700">
              <span>Esta pestaña tiene cambios sin guardar</span>
              <RevertButton
                onClick={() => revertFields(tabActiva.campos)}
                title="Revertir los cambios de esta pestaña"
              />
            </div>
          )}
          <fieldset disabled={camposDeshabilitados} className="min-w-0">
            {tabActiva.component}
          </fieldset>
        </div>

        <SectionFieldset legend="Asignación de Médico" className="mt-3">
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
        <div className="pt-4">
          <BotonesForm
            form={form}
            onNordenChange={handlePrintNordenChange}
            handleSave={hayRegistroExistente && edicionHabilitada ? handleUpdate : handleSave}
            saveLabel={hayRegistroExistente && edicionHabilitada ? "Guardar Cambios" : "Guardar"}
            handleEdit={habilitarEdicion}
            handleClear={handleClean}
            handlePrint={handlePrint}
            hideSave={!form.aPruebaDeSoledad || (hayRegistroExistente && !edicionHabilitada)}
            hideEdit={!hayRegistroExistente || edicionHabilitada}
            hideClear={embebido}
            hidePrint={embebido}
            printLabel="Imprimir"
          />
        </div>
      </div>

      {modalCargaMasiva && (
        <CargaMasivaOIT
          onClose={() => setModalCargaMasiva(false)}
          token={token}
          userlogued={userlogued}
          userName={userName}
          userDNI={userDNI}
          tabla={tabla}
          sede={selectedSede}
        />
      )}
    </div>
  );
};

export default OIT;
