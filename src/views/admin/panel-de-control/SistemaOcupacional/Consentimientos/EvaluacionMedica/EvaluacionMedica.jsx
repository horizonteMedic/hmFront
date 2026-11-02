import { InputTextOneLine } from "../../../../../components/reusableComponents/ResusableComponents";
import SectionFieldset from "../../../../../components/reusableComponents/SectionFieldset";
import SearchButton from "../../../../../components/reusableComponents/SearchButton";
import AccionesRegistroHeader from "../../../../../components/reusableComponents/AccionesRegistroHeader";
import AuditoriaRegistro from "../../../../../components/reusableComponents/AuditoriaRegistro";
import { useForm } from "../../../../../hooks/useForm";
import { useRegistroEditable } from "../../../../../hooks/useRegistroEditable";
import { useSessionData } from "../../../../../hooks/useSessionData";
import { getToday, getFechaHoraActual } from "../../../../../utils/helpers";
import { buildAuditoria } from "../../../../../utils/auditoriaUtils";
import {
  PrintHojaR,
  SubmitDataService,
  UpdateDataService,
  VerifyTR,
} from "./controllerEvaluacionMedica";
import BotonesForm from "../../../../../components/templates/BotonesForm";

const tabla = "CONSENT_INFORMADO_MEDICA";

// Campos que el usuario puede editar en este formulario (para resaltar/revertir cambios).
const CAMPOS_EDITABLES = ["fecha"];

const textoFinalConsentimiento = `De acuerdo con lo dispuesto en la Ley 29733 (Ley de Protección de Datos Personales), declaro haber tomado conocimiento que los exámenes médicos efectuados por el Centro Médico Evaluador y la información contenida en los mismos, a fin de evaluar mi condición médica para postular a un puesto de trabajo en el campamento minero es registrada por la Compañía Minera y/o la Compañía Aseguradora que tenga a su cargo la cobertura del Seguro Complementario de Trabajo de Riesgo o la que esta designe para los efectos de control de dicho seguro. En ese sentido, mediante la suscripción del presente documento, otorgo consentimiento expreso e inequívoco para que la Compañía Minera efectúe el tratamiento de los datos personales facilitados y los transfiera a la Compañía Aseguradora a fin de la evaluación y otorgamiento de la Cobertura del Seguro Complementario de Trabajo de Riesgo, pudiendo esta última informar a la Compañía Minera, Contratistas o Corredor de Seguros de ambos el estado de la cobertura del Seguro Complementario de Trabajo de Riesgo. Esta declaración autoriza al Centro Médico Evaluador la transferencia al empleador y/o Compañía Aseguradora de la información de la historia clínica y exámenes médicos confidenciales de conformidad con la Ley 26842 (Ley General de Salud), y de la Ley 29783 (Ley de Seguridad y Salud en el Trabajo) y su Reglamento aprobado por Decreto Supremo 005-2012-TR.`;

export default function EvaluacionMedica() {
  const today = getToday();
  const { token, selectedSede, userlogued, datosFooter, hora } = useSessionData();

  const initialFormState = {
    norden: "",
    idConsentimiento: null,
    fecha: today,
    nombres: "",
    dni: "",
    empresa: "",
    ocupacion: "",

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
    handleChangeSimple,
    handleChangeNumber,
    handleClear,
    handleClearnotO,
    handlePrintDefault,
  } = useForm(initialFormState, { storageKey: "evaluacionMedica" });

  const {
    edicionHabilitada,
    habilitarEdicion,
    camposDeshabilitados,
    isFieldEdited,
    revertField,
  } = useRegistroEditable(form, setForm, { tieneRegistro: form.tieneRegistro, camposEditables: CAMPOS_EDITABLES });

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

  const handleSave = () => {
    SubmitDataService(form, token, userlogued, handleClear, tabla, datosFooter);
  };

  const handleUpdate = () => {
    UpdateDataService(form, token, userlogued, handleClear, tabla, datosFooter);
  };

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
        onLimpiar={handleClear}
      />

      <SectionFieldset legend="Información del Examen" className="grid xl:grid-cols-3 gap-x-4 gap-y-3">
        <div className="flex gap-x-3 w-full">
          <InputTextOneLine
            label="N° Orden"
            name="norden"
            value={form.norden}
            onKeyUp={handleSearch}
            onChange={handleChangeNumber}
            disabled={hayRegistroCargado}
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
        <InputTextOneLine
          label="Hora"
          name="hora"
          value={hora}
          disabled
        />
      </SectionFieldset>

      {/* Contenido del Consentimiento */}
      <SectionFieldset legend="Consentimiento Evaluación Médica" className="space-y-3">
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
          <InputTextOneLine
            label="Identificado con DNI"
            name="dni"
            value={form.dni}
            disabled
            labelWidth="140px"
          />
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
                label="Para la Empresa"
                name="empresa"
                value={form.empresa}
                disabled
                labelWidth="140px"
              />
            </div>
            <p className="font-semibold">
              Certifico haber sido informado que:
            </p>
            <p className="text-justify">
              {textoFinalConsentimiento}
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
        handleSave={form.tieneRegistro && edicionHabilitada ? handleUpdate : handleSave}
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
