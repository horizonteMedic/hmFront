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
} from "./controllerRecepcionExamenMedico";
import BotonesForm from "../../../../../components/templates/BotonesForm";
import { textoDocumento } from '../../../../../utils/documentoPaciente';

const tabla = "CONSENT_RECOM_MEDIC";

// Campos que el usuario puede editar en este formulario (para resaltar/revertir cambios).
const CAMPOS_EDITABLES = ["fecha"];

const textoFinalConsentimiento = `En mi calidad de trabajador de Confipetrol Andina, declaro bajo juramento que he sido informado de las razones para los exámenes de salud ocupacional así como de los riesgos para la seguridad y salud en mi puesto de trabajo, además declaro haber recibido oportunamente los resultados de mi examen médico, de manera confidencial, conforme a lo establecido en el artículo 71° literal b) de la Ley N° 29783, Ley de Seguridad y Salud en el Trabajo¹. Teniendo conocimiento de mis resultados, me comprometo a cumplir con las recomendaciones de carácter médico, indicadas por el médico tratante y/o médico ocupacional, así como ingresar al programa de vigilancia médica según lo establecido en el RM 312-2011-MINSA².`;
const textoFinalConsentimiento2 = `En ese sentido, manifiesto que tengo conocimiento que al no cumplir con las recomendaciones médicas indicadas cualquier dolencia o malestar que presente queda bajo mi responsabilidad.`;

export default function RecepcionExamenMedico() {
  const today = getToday();
  const { token, selectedSede, userlogued, datosFooter, hora } = useSessionData();

  const initialFormState = {
    norden: "",
    fecha: today,
    idConsentimiento: null,
    nombres: "",
    dni: "",
    domicilio: "",
    distrito: "",
    provincia: "",

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
  } = useForm(initialFormState, { storageKey: "RecepcionExamenMedico" });

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
      <SectionFieldset legend="Recepción de Examen Médico" className="space-y-3">
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
            value={textoDocumento(form.dni)}
            disabled
            labelWidth="140px"
          />
          <InputTextOneLine
            label="Con Domicilio en"
            name="domicilio"
            value={form.domicilio}
            disabled
            labelWidth="140px"
          />
          <div className="grid xl:grid-cols-2 gap-x-4 gap-y-3">
            <InputTextOneLine
              label="Distrito de"
              name="distrito"
              value={form.distrito}
              disabled
              labelWidth="140px"
            />
            <InputTextOneLine
              label="Provincia y Departamento de"
              name="provincia"
              value={form.provincia}
              disabled
              labelWidth="170px"
            />
          </div>
        </div>

        {/* Texto del Consentimiento */}
        <div className="space-y-4">
          <div className="text-justify leading-relaxed">

            <p className="text-justify">
              {textoFinalConsentimiento}
            </p>
            <p className="text-justify">
              {textoFinalConsentimiento2}
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
