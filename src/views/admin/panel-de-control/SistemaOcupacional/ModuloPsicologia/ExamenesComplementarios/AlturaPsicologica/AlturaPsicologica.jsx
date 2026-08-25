import {
  InputTextOneLine,
  InputTextArea,
  InputsBooleanRadioGroup,
  InputsRadioGroup,
  RadioTable,
} from "../../../../../../components/reusableComponents/ResusableComponents";
import { useSessionData } from "../../../../../../hooks/useSessionData";
import { getToday, getFechaHoraActual } from "../../../../../../utils/helpers";
import { buildAuditoria } from "../../../../../../utils/auditoriaUtils";
import { useForm } from "../../../../../../hooks/useForm";
import { useRegistroEditable } from "../../../../../../hooks/useRegistroEditable";
import { PrintHojaR, SubmitDataService, UpdateDataService, VerifyTR } from "./controllerAlturaPsicologica";
import { useTailwindBreakpoints } from "../../../../../../hooks/useTailwindBreakpoints";
import SectionFieldset from "../../../../../../components/reusableComponents/SectionFieldset";
import SearchButton from "../../../../../../components/reusableComponents/SearchButton";
import RegistroEstadoPill from "../../../../../../components/reusableComponents/RegistroEstadoPill";
import AuditoriaRegistro from "../../../../../../components/reusableComponents/AuditoriaRegistro";
import BotonesForm from "../../../../../../components/templates/BotonesForm";
import DatosPersonalesLaborales from "../../../../../../components/templates/DatosPersonalesLaborales";
import EmpleadoComboBox from "../../../../../../components/reusableComponents/EmpleadoComboBox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

const tabla = "psicologiafobias";

// Campos que el usuario puede editar en este formulario (para resaltar/revertir cambios).
const CAMPOS_EDITABLES = [
  "fechaExamen",
  "nombreExamen",
  "esApto",
  "razonamiento",
  "memoria",
  "atencionConcentracion",
  "coordinacionVisoMotora",
  "orientacionEspacial",
  "estabilidad",
  "ansiedadTendencias",
  "consumoAlcohol",
  "fobiaAltura",
  "analisisResultados",
  "recomendaciones",
  "user_medicoFirma",
  "nombre_medico",
];

export default function AlturaPsicologica() {
  const today = getToday();
  const { token, userlogued, selectedSede, datosFooter, userName } = useSessionData();
  const { isLgUp } = useTailwindBreakpoints();

  const initialFormState = {
    // Header - Información del examen
    norden: "",
    fechaExamen: today,
    nombreExamen: "INFORME PSICOLÓGICO - TRABAJO EN ALTURA",
    esApto: undefined,

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

    // Criterios Psicológicos - Aspecto Intelectual (I/NPI/NP/NPS/S)
    razonamiento: "",
    memoria: "",
    atencionConcentracion: "",
    coordinacionVisoMotora: "",
    orientacionEspacial: "",

    // Aspectos de Personalidad
    estabilidad: "ESTABLE",
    ansiedadTendencias: "NO CASO",
    consumoAlcohol: "NO CASO",
    fobiaAltura: "NADA",

    // Analisis y recomendaciones
    analisisResultados: "",
    recomendaciones: "",

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
    handleChangeNumberDecimals,
    handleChangeSimple,
    handleRadioButton,
    handleRadioButtonBoolean,
    handleClear,
    handleClearnotO,
    handlePrintDefault,
  } = useForm(initialFormState, { storageKey: "informePsicologicoAlturaPsicologia" });

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

  const handleSave = () => {
    SubmitDataService(form, token, userlogued, handleClear, tabla, datosFooter);
  };

  const handleEdit = () => {
    UpdateDataService(form, token, userlogued, handleClear, tabla, datosFooter);
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

  const handlePrint = () => {
    handlePrintDefault(() => {
      PrintHojaR(form.norden, token, tabla, datosFooter, selectedSede);
    });
  };

  const auditoria = buildAuditoria(form, {
    usuarioActual: userlogued,
    fechaHoraActual: getFechaHoraActual(),
  });

  const itemsIntelectual = [
    { name: "razonamiento", label: "1.- Razonamiento" },
    { name: "memoria", label: "2.- Memoria" },
    { name: "atencionConcentracion", label: "3.- Atención y concentración" },
    { name: "coordinacionVisoMotora", label: "4.- Coordinación viso-motora" },
    { name: "orientacionEspacial", label: "5.- Orientación espacial" },
  ];

  const opcionesIntelectual = [
    { value: "I", label: "I" },
    { value: "NPI", label: "NPI" },
    { value: "NP", label: "NP" },
    { value: "NPS", label: "NPS" },
    { value: "S", label: "S" },
  ];

  return (
    <div className="space-y-3 px-4 max-w-[90%] xl:max-w-[80%] mx-auto">
      <div className="sticky top-2 z-20 flex justify-end pointer-events-none">
        <RegistroEstadoPill
          tieneRegistro={form.tieneRegistro}
          className={hayRegistroCargado ? "" : "invisible"}
        />
        {hayRegistroCargado && form.tieneRegistro && !edicionHabilitada && (
          <button
            type="button"
            onClick={habilitarEdicion}
            className="pointer-events-auto inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-3 py-1.5 rounded-full shadow-sm transition-all duration-150 ease-out hover:shadow-lg active:scale-95"
          >
            <FontAwesomeIcon icon={faEdit} /> Habilitar edición
          </button>
        )}
      </div>

      {/* Header con información del examen */}
      <SectionFieldset legend="Información del Examen" className="grid 2xl:grid-cols-4 gap-3">
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
          />
          <SearchButton onClick={executeSearch} className="2xl:hidden" />
        </div>
        <InputTextOneLine
          label="Fecha"
          name="fechaExamen"
          type="date"
          value={form.fechaExamen}
          onChange={handleChangeSimple}
          disabled={camposDeshabilitados}
          edited={isFieldEdited("fechaExamen")}
          onRevert={() => revertField("fechaExamen")}
          labelWidth="120px"
        />
        <div className="flex gap-4 items-center 2xl:col-span-2">
          <h4 className="font-semibold min-w-[120px] max-w-[120px]">Nombre del Examen:</h4>
          <select
            name="nombreExamen"
            value={form.nombreExamen}
            onChange={handleChangeSimple}
            disabled={camposDeshabilitados}
            className={`border rounded px-2 py-1 text-base w-full ${camposDeshabilitados ? "bg-gray-300" : ""} ${isFieldEdited("nombreExamen") ? "border-orange-400 bg-orange-100" : ""}`}
          >
            <option value="INFORME PSICOLÓGICO - TRABAJO EN ALTURA">
              INFORME PSICOLÓGICO - TRABAJO EN ALTURA
            </option>
            <option value="INFORME PSICOLÓGICO - TRABAJO EN ALTURA/FOBIAS">
              INFORME PSICOLÓGICO - TRABAJO EN ALTURA/FOBIAS
            </option>
          </select>
        </div>
        <InputsBooleanRadioGroup
          name="esApto"
          label="Aptitud"
          labelWidth="120px"
          value={form.esApto}
          trueLabel="APTO"
          falseLabel="NO APTO"
          onChange={handleRadioButtonBoolean}
          disabled={camposDeshabilitados}
          edited={isFieldEdited("esApto")}
          onRevert={() => revertField("esApto")}
        />
      </SectionFieldset>

      <DatosPersonalesLaborales form={form} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SectionFieldset legend="Aspecto Intelectual">
          <RadioTable
            items={itemsIntelectual}
            options={opcionesIntelectual}
            form={form}
            handleRadioButton={handleRadioButton}
            labelColumns={2}
            disabled={camposDeshabilitados}
            isFieldEdited={isFieldEdited}
            onRevert={revertField}
          />
        </SectionFieldset>
        <SectionFieldset legend="Aspecto Personalidad" className="space-y-8">
          {/* Aspectos de Personalidad */}
          <InputsRadioGroup
            label="1.- Estabilidad"
            name="estabilidad"
            value={form.estabilidad}
            onChange={handleRadioButton}
            options={[
              { label: "INESTABLE", value: "INESTABLE" },
              { label: "ESTABLE", value: "ESTABLE" },
            ]}
            labelOnTop
            disabled={camposDeshabilitados}
            edited={isFieldEdited("estabilidad")}
            onRevert={() => revertField("estabilidad")}
          />
          <InputsRadioGroup
            label="2.- Nivel de ansiedad y tendencias"
            name="ansiedadTendencias"
            value={form.ansiedadTendencias}
            onChange={handleRadioButton}
            options={[
              { label: "CASO", value: "CASO" },
              { label: "NO CASO", value: "NO CASO" },
            ]}
            labelOnTop
            disabled={camposDeshabilitados}
            edited={isFieldEdited("ansiedadTendencias")}
            onRevert={() => revertField("ansiedadTendencias")}
          />
          <InputsRadioGroup
            label="3.- Consumo de alcohol"
            name="consumoAlcohol"
            value={form.consumoAlcohol}
            onChange={handleRadioButton}
            options={[
              { label: "CASO", value: "CASO" },
              { label: "NO CASO", value: "NO CASO" },
            ]}
            labelOnTop
            disabled={camposDeshabilitados}
            edited={isFieldEdited("consumoAlcohol")}
            onRevert={() => revertField("consumoAlcohol")}
          />
          <InputsRadioGroup
            label="4.- Fobia a la altura"
            name="fobiaAltura"
            value={form.fobiaAltura}
            onChange={handleRadioButton}
            options={[
              { label: "NADA", value: "NADA" },
              { label: "LIGERAMENTE", value: "LIGERAMENTE" },
              { label: "MODERADAMENTE", value: "MODERADAMENTE" },
              { label: "MARCADAMENTE", value: "MARCADAMENTE" },
              { label: "MIEDO EXTREMO", value: "MIEDO EXTREMO" },
            ]}
            labelOnTop
            vertical={!isLgUp}
            disabled={camposDeshabilitados}
            edited={isFieldEdited("fobiaAltura")}
            onRevert={() => revertField("fobiaAltura")}
          />
        </SectionFieldset>
      </div>

      {/* Análisis y Recomendaciones */}
      <SectionFieldset legend="Conclusiones Finales" className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputTextArea
          label="Análisis y Resultados"
          name="analisisResultados"
          value={form.analisisResultados}
          onChange={handleChange}
          rows={4}
          disabled={camposDeshabilitados}
          edited={isFieldEdited("analisisResultados")}
          onRevert={() => revertField("analisisResultados")}
        />
        <InputTextArea
          label="Recomendaciones"
          name="recomendaciones"
          value={form.recomendaciones}
          onChange={handleChange}
          rows={4}
          disabled={camposDeshabilitados}
          edited={isFieldEdited("recomendaciones")}
          onRevert={() => revertField("recomendaciones")}
        />
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
        handleClear={handleClear}
        handlePrint={handlePrint}
        hideSave={form.tieneRegistro && !edicionHabilitada}
        hideEdit={!form.tieneRegistro || edicionHabilitada}
      />
    </div>
  );
}
