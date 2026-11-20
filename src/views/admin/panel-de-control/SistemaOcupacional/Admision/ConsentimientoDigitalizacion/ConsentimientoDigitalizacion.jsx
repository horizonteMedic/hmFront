import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLayerGroup } from "@fortawesome/free-solid-svg-icons";
import InputTextOneLine from "../../../../../components/reusableComponents/InputTextOneLine";
import SectionFieldset from "../../../../../components/reusableComponents/SectionFieldset";
import SearchButton from "../../../../../components/reusableComponents/SearchButton";
import RevertButton from "../../../../../components/reusableComponents/RevertButton";
import ButtonsPDF from "../../../../../components/reusableComponents/ButtonsPDF";
import AccionesRegistroHeader from "../../../../../components/reusableComponents/AccionesRegistroHeader";
import AuditoriaRegistro from "../../../../../components/reusableComponents/AuditoriaRegistro";
import BotonesForm from "../../../../../components/templates/BotonesForm";
import { useForm } from "../../../../../hooks/useForm";
import { useSessionData } from "../../../../../hooks/useSessionData";
import { useRegistroEditable } from "../../../../../hooks/useRegistroEditable";
import { getToday, getFechaHoraActual } from "../../../../../utils/helpers";
import { buildAuditoria } from "../../../../../utils/auditoriaUtils";
import {
  handleSubirArchivo,
  handleSubirArchivoMasivo,
  PrintHojaR,
  ReadArchivosForm,
  SubmitDataService,
  VerifyTR,
} from "./controllerConsentimientoDigitalizacion";
import ModalGenerarMasivo from "./ModalGenerarMasivo";
import ModalVisorArchivo from "./ModalVisorArchivo";

const tabla = "consen_digit";
const today = getToday();

// Campos que el usuario puede editar en este formulario (para resaltar/revertir cambios).
const CAMPOS_EDITABLES = ["fecha", "authorized"];

const ConsentimientoDigitalizacion = () => {
  const { token, selectedSede, userlogued, datosFooter } = useSessionData();

  const initialFormState = {
    norden: "",
    fecha: today,
    nombres: "",
    dni: "",
    edad: "",
    authorized: true,

    SubirDoc: false,
    nomenclatura: "DECLARACION USO FIRMA",

    // Control de UI: false = mostrar Guardar (nuevo) / true = mostrar Editar (ya existe)
    tieneRegistro: false,

    // Auditoría
    userRegistro: "",
    fechaRegistro: "",
    usuarioActualizacion: "",
    fechaActualizacion: "",
  };

  const [visualerOpen, setVisualerOpen] = useState(null);
  const [masivoModalOpen, setMasivoModalOpen] = useState(false);
  const [errors, setErrors] = useState({});

  const {
    form,
    setForm,
    handleChangeSimple,
    handleChangeNumber,
    handleClear,
    handleClearnotO,
    handlePrintDefault,
    handleChangeNumberDecimals,
  } = useForm(initialFormState, { storageKey: "ConsentimientoDigitalizacion" });

  const {
    edicionHabilitada,
    habilitarEdicion,
    camposDeshabilitados,
    isFieldEdited,
    revertField,
  } = useRegistroEditable(form, setForm, { tieneRegistro: form.tieneRegistro, camposEditables: CAMPOS_EDITABLES });

  const hayRegistroCargado = Boolean(form.nombres || form.dni);
  const hayPacienteCargado = Boolean(form.nombres && form.dni);

  // Los errores se muestran solo tras intentar guardar y se limpian solos cuando el campo se corrige.
  const ordenError = errors.norden && !hayPacienteCargado ? errors.norden : "";
  const fechaError = errors.fecha && !form.fecha ? errors.fecha : "";
  const autorizacionError = errors.authorized && !form.authorized ? errors.authorized : "";

  const validateForm = () => {
    const next = {};
    if (!String(form.norden).trim()) next.norden = "Ingrese el N° de orden.";
    else if (!hayPacienteCargado) next.norden = "Busque el N° de orden para cargar los datos del paciente.";
    if (!String(form.fecha).trim()) next.fecha = "Ingrese la fecha.";
    if (!form.authorized) next.authorized = "Debe aceptar la autorización para registrar.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleClearForm = () => {
    setErrors({});
    handleClear();
  };

  const handleSave = () => {
    if (!validateForm()) return;
    SubmitDataService(form, token, userlogued, handleClearForm, tabla, form.tieneRegistro);
  };

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
    <div className="space-y-3 px-4 max-w-[90%] xl:max-w-[80%] mx-auto">
      <AccionesRegistroHeader
        tieneRegistro={form.tieneRegistro}
        hayRegistroCargado={hayRegistroCargado}
        edicionHabilitada={edicionHabilitada}
        onHabilitarEdicion={habilitarEdicion}
        onLimpiar={handleClearForm}
      >
        <button
          type="button"
          onClick={() => setMasivoModalOpen(true)}
          className="pointer-events-auto inline-flex items-center justify-center gap-2 text-white text-md font-semibold px-3 py-1.5 rounded bg-purple-600 hover:bg-purple-700 transition-all duration-150 ease-out hover:shadow-lg active:scale-95"
        >
          <FontAwesomeIcon icon={faLayerGroup} /> Generar masivo
        </button>
      </AccionesRegistroHeader>

      {/* ===== SECCIÓN: N° ORDEN Y FECHA ===== */}
      <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-3">
        <div className="flex gap-x-3 w-full">
          <InputTextOneLine
            label="N° Orden"
            name="norden"
            value={form.norden}
            onKeyUp={handleSearch}
            onChange={handleChangeNumber}
            disabled={hayRegistroCargado}
            labelWidth="120px"
            className="w-full"
            error={ordenError}
          />
          <SearchButton onClick={executeSearch} className="lg:hidden" />
        </div>
        <InputTextOneLine
          label="Fecha"
          name="fecha"
          type="date"
          value={form.fecha}
          onChange={handleChangeSimple}
          disabled={camposDeshabilitados}
          labelWidth="120px"
          required
          error={fechaError}
          edited={isFieldEdited("fecha")}
          onRevert={() => revertField("fecha")}
        />
      </SectionFieldset>

      {/* ===== SECCIÓN: DATOS DEL PACIENTE ===== */}
      <SectionFieldset legend="Datos del Paciente" className="grid grid-cols-1 lg:grid-cols-4 gap-x-4 gap-y-3">
        <InputTextOneLine
          label="Nombres"
          name="nombres"
          value={form.nombres}
          disabled
          labelWidth="120px"
          className="lg:col-span-2"
        />
        <InputTextOneLine label="DNI" name="dni" value={form.dni} disabled labelWidth="60px" />
        <InputTextOneLine label="Edad" name="edad" value={form.edad} disabled labelWidth="60px" />
      </SectionFieldset>

      {/* ===== SECCIÓN: DECLARACIÓN JURADA ===== */}
      <SectionFieldset legend="Declaración Jurada para el Uso de la Firma Electrónica" className="space-y-4">
        <p className="font-semibold">
          Yo, <span className="font-bold underline underline-offset-2">{form.nombres || "…………………………"}</span>,
          identificado(a) con DNI N.º <span className="font-bold underline underline-offset-2">{form.dni || "………………"}</span>:
        </p>
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            name="authorized"
            checked={form.authorized}
            disabled={camposDeshabilitados}
            onChange={(e) => setForm((prev) => ({ ...prev, authorized: e.target.checked }))}
            className="mt-1 w-5 h-5 shrink-0 accent-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <span className="leading-relaxed">
            Autorizo el uso de mi firma electrónica y huella, exclusivamente para la impresión de informes médicos. Esta firma tendrá validez para los documentos necesarios implicados en este proceso. Asimismo, doy fe de que la información proporcionada es verídica, al igual que la información que brindaré durante los exámenes realizados en el centro médico Horizonte Medic. También, autorizo el envío de información médica a los correos electrónicos y/o números de celular de la empresa contratista.
          </span>
          {isFieldEdited("authorized") && <RevertButton onClick={() => revertField("authorized")} />}
        </div>
        {autorizacionError && <p className="text-sm text-red-600">{autorizacionError}</p>}
      </SectionFieldset>

      {/* ===== SECCIÓN: DOCUMENTO DIGITALIZADO ===== */}
      <SectionFieldset legend="Documento Digitalizado" className="flex justify-center">
        <ButtonsPDF
          {...(form.SubirDoc ? { handleSave: () => handleSubirArchivo(form, selectedSede, userlogued, token) } : {})}
          {...(form.SubirDoc ? { handleRead: () => ReadArchivosForm(form, setVisualerOpen, token) } : {})}
          handleMasivo={() => handleSubirArchivoMasivo(form, selectedSede, userlogued, token)}
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
        handleChangeNumberDecimals={handleChangeNumberDecimals}
        onNordenChange={handlePrintNordenChange}
        handleSave={handleSave}
        saveLabel={form.tieneRegistro && edicionHabilitada ? "Guardar Cambios" : "Guardar"}
        handleEdit={habilitarEdicion}
        handleClear={handleClearForm}
        handlePrint={handlePrint}
        hideSave={form.tieneRegistro && !edicionHabilitada}
        hideEdit={!form.tieneRegistro || edicionHabilitada}
      />

      {visualerOpen && <ModalVisorArchivo archivo={visualerOpen} onClose={() => setVisualerOpen(null)} />}
      {masivoModalOpen && (
        <ModalGenerarMasivo
          fechaInicial={today}
          userlogued={userlogued}
          token={token}
          onClose={() => setMasivoModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ConsentimientoDigitalizacion;
