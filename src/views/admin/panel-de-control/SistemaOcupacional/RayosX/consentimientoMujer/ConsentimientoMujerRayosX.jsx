import {
  PrintHojaR,
  SubmitDataService,
  UpdateDataService,
  VerifyTR,
} from "./controllerConsentimientoMujerRayosX";
import { useForm } from "../../../../../hooks/useForm";
import { useSessionData } from "../../../../../hooks/useSessionData";
import { useRegistroEditable } from "../../../../../hooks/useRegistroEditable";
import { getToday, getFechaHoraActual } from "../../../../../utils/helpers";
import { buildAuditoria } from "../../../../../utils/auditoriaUtils";
import BotonesForm from "../../../../../components/templates/BotonesForm";
import AccionesRegistroHeader from "../../../../../components/reusableComponents/AccionesRegistroHeader";
import AuditoriaRegistro from "../../../../../components/reusableComponents/AuditoriaRegistro";
import RevertButton from "../../../../../components/reusableComponents/RevertButton";
import SearchButton from "../../../../../components/reusableComponents/SearchButton";
import { InputTextOneLine, SectionFieldset } from "../../../../../components/reusableComponents/ResusableComponents";
import { textoDocumento } from '../../../../../utils/documentoPaciente';

const tabla = "consentimiento_rayosx";

const textoConsentimientoParte1 = `Declaro que he recibido explicaciones satisfactorias sobre el propósito, naturaleza y riesgos de la toma de RAYOS X, por lo cual doy de conocimiento y declaro que a la fecha no me encuentro en estado de gestación, ya que soy consciente de los eventuales riesgos que se pueden derivar de la realización de dicho examen en caso de encontrarme gestando.`;
const textoConsentimientoParte2 = `Por lo cual AUTORIZO a que se me realice la radiografía, indicada por el protocolo de la empresa contratante.`;

// Campos que el usuario puede editar en este formulario (para resaltar/revertir cambios).
const CAMPOS_EDITABLES = ["fecha", "fechaUltimaRegla"];

export default function ConsentimientoMujerRayosX() {
  const today = getToday();
  const { token, userlogued, selectedSede, datosFooter, userName } = useSessionData();

  const initialFormState = {
    norden: "",
    fecha: today,
    nombres: "",
    edad: "",
    dni: "",
    empresa: "",
    contrata: "",
    ocupacion: "",
    fechaUltimaRegla: "",
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
    handleChangeSimple,
    handleChange,
    handleChangeNumberDecimals,
    handleClear,
    handleClearnotO,
    handlePrintDefault,
  } = useForm(initialFormState, { storageKey: "consentimientoMujerRayosX" });

  const {
    edicionHabilitada,
    habilitarEdicion,
    camposDeshabilitados,
    isFieldEdited,
    revertField,
  } = useRegistroEditable(form, setForm, { tieneRegistro: form.tieneRegistro, camposEditables: CAMPOS_EDITABLES });

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

  const handleSave = () => {
    SubmitDataService(form, token, userlogued, handleClear, tabla, datosFooter);
  };

  const handleEdit = () => {
    UpdateDataService(form, token, userlogued, handleClear, tabla, datosFooter);
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

  const handlePrint = () => {
    handlePrintDefault(() => {
      PrintHojaR(form.norden, token, tabla, datosFooter);
    });
  };

  const hayRegistroCargado = Boolean(form.nombres || form.dni);
  const nordenDisabled = hayRegistroCargado;

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
        onLimpiar={handleClear}
      />

      <SectionFieldset legend="Información del Examen" className="grid xl:grid-cols-2 gap-x-4 gap-y-3">
        <div className="flex gap-x-3 w-full">
          <InputTextOneLine
            label="N° Orden"
            name="norden"
            value={form.norden}
            onKeyUp={handleSearch}
            onChange={handleChangeNumberDecimals}
            disabled={nordenDisabled}
            className="w-full"
          />
          <SearchButton onClick={executeSearch} className="lg:hidden" />
        </div>
        <InputTextOneLine
          label="Fecha"
          type="date"
          name="fecha"
          value={form.fecha}
          onChange={handleChangeSimple}
          disabled={camposDeshabilitados}
          edited={isFieldEdited("fecha")}
          onRevert={() => revertField("fecha")}
        />
      </SectionFieldset>
      {/* Contenido del Consentimiento */}
      <SectionFieldset legend="Consentimiento de Toma Radiográfica en Mujeres en Edad Fértil" className="space-y-3">
        {/* Información Personal */}
        <div className="space-y-3">
          <InputTextOneLine
            label="Yo"
            name="nombres"
            value={form.nombres}
            onChange={handleChange}
            disabled
            labelWidth="30px"
          />
          <div className="flex items-center flex-wrap">
            <InputTextOneLine
              label="de"
              name="edad"
              value={form.edad}
              disabled
              labelWidth="30px"
              className="mr-4"
            />
            <label className="font-semibold min-w-[50px]">años de edad,</label>
            <InputTextOneLine
              label="identificado con DNI"
              name="dni"
              value={textoDocumento(form.dni)}
              disabled
              labelWidth="110px"
            />
          </div>
          <InputTextOneLine
            label="Con ocupación laboral de"
            name="ocupacion"
            value={form.ocupacion}
            onChange={handleChange}
            disabled
            labelWidth="140px"
          />
        </div>

        {/* Texto del Consentimiento */}
        <div className="space-y-4">
          <div className="text-justify leading-relaxed">
            <div className="mb-3">
              <InputTextOneLine
                label="Empresa"
                name="empresa"
                value={form.empresa}
                disabled
                labelWidth="140px"
              />
            </div>
            <p className="text-justify">
              {textoConsentimientoParte1} Así mismo mi Fecha de Última Regla fue el{" "}
              <input
                type="date"
                name="fechaUltimaRegla"
                value={form.fechaUltimaRegla ?? ""}
                onChange={handleChangeSimple}
                disabled={camposDeshabilitados}
                required
                className={`border rounded px-2 py-1 mx-1 align-middle ${camposDeshabilitados ? "bg-gray-300" : ""} ${isFieldEdited("fechaUltimaRegla") ? "border-orange-400 bg-orange-100" : ""}`}
              />
              {isFieldEdited("fechaUltimaRegla") && (
                <RevertButton onClick={() => revertField("fechaUltimaRegla")} className="mr-1 align-middle" />
              )}
              . {textoConsentimientoParte2}
            </p>
          </div>
        </div>
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
        handleSave={form.tieneRegistro && edicionHabilitada ? handleEdit : handleSave}
        saveLabel={form.tieneRegistro && edicionHabilitada ? "Guardar Cambios" : "Guardar"}
        handleEdit={habilitarEdicion}
        handleClear={handleClear}
        handlePrint={handlePrint}
        hideSave={form.tieneRegistro && !edicionHabilitada}
        hideEdit={!form.tieneRegistro || edicionHabilitada}
      />
    </div>
  );
}
