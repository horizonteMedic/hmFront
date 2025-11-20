import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faPrint, faTrash } from "@fortawesome/free-solid-svg-icons";
import {
  InputTextOneLine,
  InputTextArea,
  InputCheckbox,
  InputsRadioGroup
} from "../../../../../components/reusableComponents/ResusableComponents";
import { useSessionData } from "../../../../../hooks/useSessionData";
import { getDatePlusOneYear, getToday } from "../../../../../utils/helpers";
import { useForm } from "../../../../../hooks/useForm";
import MedicoSearch from "../../../../../components/reusableComponents/MedicoSearch";
import useRealTime from "../../../../../hooks/useRealTime";
import { PrintHojaR, PrintHojaR2, SubmitDataService, VerifyTR } from "./controllerFichaAptitudAnexo16";

const tabla = "certificado_aptitud_medico_ocupacional"
const tabla2 = "resumen_medico_poderosa"
const today = getToday();

export default function FichaAptitudAnexo16({ MedicosMulti }) {
  const hora = useRealTime();

  const { token, userlogued, selectedSede, datosFooter, userCompleto } =
    useSessionData();

  const initialFormState = {
    // Datos básicos
    norden: "",
    tipoExamen: "",
    nombres: "",
    dni: "",
    edad: "",
    sexo: "",
    empresa: "",
    contrata: "",
    puestoPostula: "",
    areaTrabajo: "",
    puestoActual: "",
    esOhla: false,

    conclusiones: "",
    apto: "APTO",
    fechaValido: today,
    fechaVencimiento: getDatePlusOneYear(today),
    recomendaciones: "",
    restricciones: "NINGUNO.",

    // Checkboxes de recomendaciones
    corregirAgudezaVisualTotal: false,
    corregirAgudezaVisual: false,
    dietaHipocalorica: false,
    evitarMovimientosDisergonomicos: false,
    noHacerTrabajoAltoRiesgo: false,
    noHacerTrabajoSobre18: false,
    usoEppAuditivo: false,
    usoLentesConducir: false,
    usoLentesTrabajo: false,
    usoLentesTrabajoSobre18: false,
    ninguno: true,
    noConducirVehiculos: false,

    visionCercaOd: "",
    visionLejosOd: "",
    visionCercaOi: "",
    visionLejosOi: "",

    visionCercaOdCorregida: "",
    visionLejosOdCorregida: "",
    visionCercaOiCorregida: "",
    visionLejosOiCorregida: "",

    visionColores: "",
    visionBinocular: "",
    reflejosPupilares: "",
    enfermedadOculares: "",

    hemoglobina: "",
    vsg: "",
    glucosa: "",
    creatinina: "",

    // Médico que Certifica
    nombre_medico: userCompleto?.datos?.nombres_user?.toUpperCase(),
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
  } = useForm(initialFormState);

  const handleSave = () => {
    SubmitDataService(form, token, userlogued, handleClear, tabla, datosFooter);
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      handleClearnotO();
      VerifyTR(form.norden, tabla, token, setForm, selectedSede);
    }
  };

  const handlePrint = () => {
    handlePrintDefault(() => {
      PrintHojaR(form.norden, token, tabla, datosFooter);
    });
  };
  const handlePrint2 = () => {
    handlePrintDefault(() => {
      PrintHojaR2(form.norden, token, tabla2, datosFooter);
    });
  };

  // Función para manejar cambios en checkboxes de restricciones
  const handleRestriccionesChange = (name, checked) => {
    setForm(prev => {
      const newForm = { ...prev, [name]: checked };
      // Si se marca "NINGUNO", deshabilitar todos los otros
      if (name === "ninguno" && checked) {
        newForm.corregirAgudezaVisualTotal = false;
        newForm.corregirAgudezaVisual = false;
        newForm.dietaHipocalorica = false;
        newForm.evitarMovimientosDisergonomicos = false;
        newForm.noHacerTrabajoAltoRiesgo = false;
        newForm.noHacerTrabajoSobre18 = false;
        newForm.usoEppAuditivo = false;
        newForm.usoLentesConducir = false;
        newForm.usoLentesTrabajo = false;
        newForm.usoLentesTrabajoSobre18 = false;
        newForm.noConducirVehiculos = false;
        newForm.restricciones = "NINGUNO.";
      } else if (name !== "ninguno" && checked) {
        // Si se marca cualquier otro, deshabilitar "NINGUNO"
        newForm.ninguno = false;

        // Generar recomendaciones basadas en los checkboxes marcados
        const restricciones = [];
        if (newForm.corregirAgudezaVisualTotal) restricciones.push("CORREGIR AGUDEZA VISUAL TOTAL PARA TRABAJO SOBRE 1.8 M.S.N.PISO");
        if (newForm.corregirAgudezaVisual) restricciones.push("CORREGIR AGUDEZA VISUAL PARA TRABAJO SOBRE 1.8 M.S.N.PISO");
        if (newForm.dietaHipocalorica) restricciones.push("DIETA HIPOCALÓRICA Y EJERCICIOS");
        if (newForm.evitarMovimientosDisergonomicos) restricciones.push("EVITAR MOVIMIENTOS Y POSICIONES DISERGONÓMICAS");
        if (newForm.noHacerTrabajoAltoRiesgo) restricciones.push("NO HACER TRABAJO DE ALTO RIESGO");
        if (newForm.noHacerTrabajoSobre18) restricciones.push("NO HACER TRABAJO SOBRE 1.8 M.S.N.PISO");
        if (newForm.usoEppAuditivo) restricciones.push("USO DE EPP AUDITIVO ANTE EXPOSICIÓN A RUIDO >=80 DB");
        if (newForm.usoLentesConducir) restricciones.push("USO DE LENTES CORRECTORES PARA CONDUCIR Y/O OPERAR VEHÍCULOS MOTORIZADOS");
        if (newForm.usoLentesTrabajo) restricciones.push("USO DE LENTES CORRECTORES PARA TRABAJO.");
        if (newForm.usoLentesTrabajoSobre18) restricciones.push("USO DE LENTES CORRECTORES PARA TRABAJO SOBRE 1.8 M.S.N.PISO");
        if (newForm.noConducirVehiculos) restricciones.push("NO CONDUCIR VEHÍCULOS");

        newForm.restricciones = restricciones.join("\n");
      } else if (!checked) {
        // Si se desmarca un checkbox, regenerar las restricciones sin ese elemento
        if (name !== "ninguno") {
          const restricciones = [];
          if (newForm.corregirAgudezaVisualTotal) restricciones.push("CORREGIR AGUDEZA VISUAL TOTAL PARA TRABAJO SOBRE 1.8 M.S.N.PISO");
          if (newForm.corregirAgudezaVisual) restricciones.push("CORREGIR AGUDEZA VISUAL PARA TRABAJO SOBRE 1.8 M.S.N.PISO");
          if (newForm.dietaHipocalorica) restricciones.push("DIETA HIPOCALÓRICA Y EJERCICIOS");
          if (newForm.evitarMovimientosDisergonomicos) restricciones.push("EVITAR MOVIMIENTOS Y POSICIONES DISERGONÓMICAS");
          if (newForm.noHacerTrabajoAltoRiesgo) restricciones.push("NO HACER TRABAJO DE ALTO RIESGO");
          if (newForm.noHacerTrabajoSobre18) restricciones.push("NO HACER TRABAJO SOBRE 1.8 M.S.N.PISO");
          if (newForm.usoEppAuditivo) restricciones.push("USO DE EPP AUDITIVO ANTE EXPOSICIÓN A RUIDO >=80 DB");
          if (newForm.usoLentesConducir) restricciones.push("USO DE LENTES CORRECTORES PARA CONDUCIR Y/O OPERAR VEHÍCULOS MOTORIZADOS");
          if (newForm.usoLentesTrabajo) restricciones.push("USO DE LENTES CORRECTORES PARA TRABAJO.");
          if (newForm.usoLentesTrabajoSobre18) restricciones.push("USO DE LENTES CORRECTORES PARA TRABAJO SOBRE 1.8 M.S.N.PISO");
          if (newForm.noConducirVehiculos) restricciones.push("NO CONDUCIR VEHÍCULOS");

          newForm.restricciones = restricciones.join("\n");
        }
      }

      return newForm;
    });
  };

  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="space-y-6 col-span-3">
        {/* Header */}
        <section className="bg-white border border-gray-200 rounded-lg p-4 grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
          <InputTextOneLine
            label="N° Orden"
            name="norden"
            value={form?.norden}
            onChange={handleChangeNumber}
            onKeyUp={handleSearch}
          />
          <InputTextOneLine
            label="Tipo de Examen"
            name="tipoExamen"
            value={form?.tipoExamen}
            disabled
          />
          <InputTextOneLine
            label="Hora"
            name="hora"
            value={hora}
            inputClassName="font-bold"
            disabled
          />
        </section>

        <div>
          {/* Información del paciente */}
          <div className="bg-white border border-gray-200 rounded-lg p-4  mb-3">
            <h3 className="text-lg font-semibold mb-3">Datos del Paciente</h3>
            {/* Fila 1: Nombres, DNI, Edad, Género */}
            <div className="grid grid-cols-1 md:grid-cols-2  gap-4 mb-3">
              <InputTextOneLine
                label="Nombres y Apellidos"
                name="nombres"
                value={form?.nombres}
                disabled
              />
              <div className="grid grid-cols-3 gap-4">
                <InputTextOneLine
                  label="DNI"
                  name="dni"
                  value={form?.dni}
                  disabled
                />
                <InputTextOneLine
                  label="Edad"
                  name="edad"
                  value={form?.edad}
                  disabled
                />
                <InputTextOneLine
                  label="Sexo"
                  name="sexo"
                  value={form?.sexo}
                  disabled
                />
              </div>
              <InputTextOneLine
                label="Empresa"
                name="empresa"
                value={form?.empresa}
                disabled
              />
              <InputTextOneLine
                label="Contrata"
                name="contrata"
                value={form?.contrata}
                disabled
              />
              <InputTextOneLine
                label="Puesto al que Postula"
                name="puestoPostula"
                value={form?.puestoPostula}
                disabled
              />
              <InputTextOneLine
                label="Area de Trabajo"
                name="puestoPostula"
                value={form?.puestoPostula}
                disabled
              />
              <InputTextOneLine
                label="Puesto de Trabajo"
                name="puestoActual"
                value={form?.puestoActual}
                disabled
                className="col-span-2"
              />
            </div>
          </div>

          {/* Conclusiones y Recomendaciones en dos columnas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6  mb-3">
            {/* Columna 1: Conclusiones */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 ">
              <InputTextArea
                label="Conclusiones"
                name="conclusiones"
                value={form?.conclusiones}
                onChange={handleChange}
                rows={6}
                className="mb-3"
              />
              <div className="space-y-2">
                <div className="flex justify-end">
                  <InputCheckbox
                    label="Formato OHLA"
                    name="esOhla"
                    checked={form?.esOhla}
                    disabled
                  />
                </div>
                <InputsRadioGroup
                  label="Aptitud"
                  name="apto"
                  value={form?.apto}
                  onChange={(e, value) => {
                    if (value == "APTO") {
                      setForm(prev => ({
                        ...prev,
                        restricciones: "NINGUNO.",
                        corregirAgudezaVisualTotal: false,
                        corregirAgudezaVisual: false,
                        dietaHipocalorica: false,
                        evitarMovimientosDisergonomicos: false,
                        noHacerTrabajoAltoRiesgo: false,
                        noHacerTrabajoSobre18: false,
                        usoEppAuditivo: false,
                        usoLentesConducir: false,
                        usoLentesTrabajo: false,
                        usoLentesTrabajoSobre18: false,
                        ninguno: true,
                        noConducirVehiculos: false,
                      }));
                    }
                    else {
                      setForm(prev => ({
                        ...prev,
                        restricciones: prev.restricciones == "NINGUNO." ? "" : prev.restricciones,
                        ninguno: false,
                      }));
                    }
                    handleRadioButton(e, value)
                  }}
                  vertical
                  options={[
                    { label: "APTO (para el puesto en el que trabaja o postula)", value: "APTO" },
                    { label: "APTO CON RESTRICCIÓN (para el puesto en el que trabaja o postula)", value: "APTO CON RESTRICCION" },
                    { label: "NO APTO (para el puesto en el que trabaja o postula)", value: "NO APTO" },
                    { label: "CON OBSERVACION", value: "CON OBSERVACION" },
                    { label: "EVALUADO", value: "EVALUADO" },
                  ].filter(item => (form.esOhla || (item.label != "CON OBSERVACION" && item.label != "EVALUADO")))}
                />
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-3">
                  <InputTextOneLine
                    label="Fecha"
                    name="fechaValido"
                    type="date"
                    value={form?.fechaValido}
                    onChange={(e) => {
                      setForm(prev => ({ ...prev, fechaVencimiento: getDatePlusOneYear(e.target.value) }));
                      handleChangeSimple(e)
                    }}
                  />
                  <InputTextOneLine
                    label="Fecha Venc."
                    name="fechaVencimiento"
                    type="date"
                    value={form?.fechaVencimiento}
                    disabled
                  />
                </div>
                <InputTextArea
                  label="Recomendaciones"
                  name="recomendaciones"
                  value={form?.recomendaciones}
                  onChange={handleChange}
                  rows={6}
                  className="mb-3"
                />
                <MedicoSearch
                  value={form.nombre_medico}
                  onChange={handleChangeSimple}
                  MedicosMulti={MedicosMulti}
                />
              </div>
            </div>

            {/* Columna 2: Recomendaciones */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <InputTextArea
                label="Restricciones"
                name="restricciones"
                value={form?.restricciones}
                onChange={handleChange}
                rows={8}
              />
              <div className="grid grid-cols-1 gap-2">
                <div className="space-y-2">
                  <InputCheckbox
                    name="corregirAgudezaVisualTotal"
                    checked={form?.corregirAgudezaVisualTotal}
                    onChange={(e) => handleRestriccionesChange("corregirAgudezaVisualTotal", e.target.checked)}
                    disabled={form?.ninguno}
                    className={form?.ninguno ? "opacity-50 text-gray-400" : ""}
                    label="CORREGIR AGUDEZA VISUAL TOTAL PARA TRABAJO SOBRE 1.8 M.S.N.PISO"
                  />
                  <InputCheckbox
                    name="corregirAgudezaVisual"
                    checked={form?.corregirAgudezaVisual}
                    onChange={(e) => handleRestriccionesChange("corregirAgudezaVisual", e.target.checked)}
                    disabled={form?.ninguno}
                    className={form?.ninguno ? "opacity-50 text-gray-400" : ""}
                    label="CORREGIR AGUDEZA VISUAL PARA TRABAJO SOBRE 1.8 M.S.N.PISO"
                  />
                  <InputCheckbox
                    name="dietaHipocalorica"
                    checked={form?.dietaHipocalorica}
                    onChange={(e) => handleRestriccionesChange("dietaHipocalorica", e.target.checked)}
                    disabled={form?.ninguno}
                    className={form?.ninguno ? "opacity-50 text-gray-400" : ""}
                    label="DIETA HIPOCALÓRICA Y EJERCICIOS"
                  />
                  <InputCheckbox
                    name="evitarMovimientosDisergonomicos"
                    checked={form?.evitarMovimientosDisergonomicos}
                    onChange={(e) => handleRestriccionesChange("evitarMovimientosDisergonomicos", e.target.checked)}
                    disabled={form?.ninguno}
                    className={form?.ninguno ? "opacity-50 text-gray-400" : ""}
                    label="EVITAR MOVIMIENTOS Y POSICIONES DISERGONÓMICAS"
                  />
                  <InputCheckbox
                    name="noHacerTrabajoAltoRiesgo"
                    checked={form?.noHacerTrabajoAltoRiesgo}
                    onChange={(e) => handleRestriccionesChange("noHacerTrabajoAltoRiesgo", e.target.checked)}
                    disabled={form?.ninguno}
                    className={form?.ninguno ? "opacity-50 text-gray-400" : ""}
                    label="NO HACER TRABAJO DE ALTO RIESGO"
                  />
                  <InputCheckbox
                    name="noHacerTrabajoSobre18"
                    checked={form?.noHacerTrabajoSobre18}
                    onChange={(e) => handleRestriccionesChange("noHacerTrabajoSobre18", e.target.checked)}
                    disabled={form?.ninguno}
                    className={form?.ninguno ? "opacity-50 text-gray-400" : ""}
                    label="NO HACER TRABAJO SOBRE 1.8 M.S.N.PISO"
                  />
                </div>
                <div className="space-y-2">
                  <InputCheckbox
                    name="usoEppAuditivo"
                    checked={form?.usoEppAuditivo}
                    onChange={(e) => handleRestriccionesChange("usoEppAuditivo", e.target.checked)}
                    disabled={form?.ninguno}
                    className={form?.ninguno ? "opacity-50 text-gray-400" : ""}
                    label="USO DE EPP AUDITIVO ANTE EXPOSICIÓN A RUIDO >=80 DB"
                  />
                  <InputCheckbox
                    name="usoLentesConducir"
                    checked={form?.usoLentesConducir}
                    onChange={(e) => handleRestriccionesChange("usoLentesConducir", e.target.checked)}
                    disabled={form?.ninguno}
                    className={form?.ninguno ? "opacity-50 text-gray-400" : ""}
                    label="USO DE LENTES CORRECTORES PARA CONDUCIR Y/O OPERAR VEHÍCULOS MOTORIZADOS"
                  />
                  <InputCheckbox
                    name="usoLentesTrabajo"
                    checked={form?.usoLentesTrabajo}
                    onChange={(e) => handleRestriccionesChange("usoLentesTrabajo", e.target.checked)}
                    disabled={form?.ninguno}
                    className={form?.ninguno ? "opacity-50 text-gray-400" : ""}
                    label="USO DE LENTES CORRECTORES PARA TRABAJO."
                  />
                  <InputCheckbox
                    name="usoLentesTrabajoSobre18"
                    checked={form?.usoLentesTrabajoSobre18}
                    onChange={(e) => handleRestriccionesChange("usoLentesTrabajoSobre18", e.target.checked)}
                    disabled={form?.ninguno}
                    className={form?.ninguno ? "opacity-50 text-gray-400" : ""}
                    label="USO DE LENTES CORRECTORES PARA TRABAJO SOBRE 1.8 M.S.N.PISO"
                  />
                  <InputCheckbox
                    name="ninguno"
                    checked={form?.ninguno}
                    onChange={(e) => handleRestriccionesChange("ninguno", e.target.checked)}
                    disabled={form?.corregirAgudezaVisualTotal || form?.corregirAgudezaVisual || form?.dietaHipocalorica || form?.evitarMovimientosDisergonomicos || form?.noHacerTrabajoAltoRiesgo || form?.noHacerTrabajoSobre18 || form?.usoEppAuditivo || form?.usoLentesConducir || form?.usoLentesTrabajo || form?.usoLentesTrabajoSobre18 || form?.noConducirVehiculos}
                    className={(() => {
                      const isDisabled = form?.corregirAgudezaVisualTotal || form?.corregirAgudezaVisual || form?.dietaHipocalorica || form?.evitarMovimientosDisergonomicos || form?.noHacerTrabajoAltoRiesgo || form?.noHacerTrabajoSobre18 || form?.usoEppAuditivo || form?.usoLentesConducir || form?.usoLentesTrabajo || form?.usoLentesTrabajoSobre18 || form?.noConducirVehiculos;
                      return isDisabled ? "opacity-50 text-gray-400 cursor-not-allowed" : "";
                    })()}
                    label="NINGUNO."
                  />
                  <InputCheckbox
                    name="noConducirVehiculos"
                    checked={form?.noConducirVehiculos}
                    onChange={(e) => handleRestriccionesChange("noConducirVehiculos", e.target.checked)}
                    disabled={form?.ninguno}
                    className={form?.ninguno ? "opacity-50 text-gray-400" : ""}
                    label="NO CONDUCIR VEHÍCULOS"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Médico, Botones y Restricciones en dos columnas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-2">
              {/* Botones de acción */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 ">
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={handleSave}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-base px-6 py-2 rounded flex items-center gap-2"
                  >
                    <FontAwesomeIcon icon={faSave} /> Grabar/Actualizar
                  </button>
                  <button
                    type="button"
                    onClick={handleClear}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white text-base px-6 py-2 rounded flex items-center gap-2"
                  >
                    <FontAwesomeIcon icon={faTrash} /> Limpiar
                  </button>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-bold italic text-base mb-1">Imprimir</span>
                  <div className="flex items-center gap-2">
                    <InputTextOneLine
                      name="norden"
                      value={form?.norden}
                      onChange={handleChangeNumber}
                      className="w-24"
                    />
                    <button
                      type="button"
                      onClick={handlePrint}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-base px-4 h-[21px] rounded flex items-center gap-2"
                    >
                      <FontAwesomeIcon icon={faPrint} />
                    </button>
                    <button
                      type="button"
                      onClick={handlePrint2}
                      className="bg-green-600 hover:bg-green-700 text-white text-base px-4 h-[21px] rounded flex items-center gap-2"
                    >
                      Resumen Médico<FontAwesomeIcon icon={faPrint} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
      {/* Columna de Datos Médicos (derecha) - 1/4 del ancho */}
      <div className="lg:col-span-1 flex flex-col">
        <div className="bg-white border border-gray-200 rounded-lg p-3 flex-1 flex flex-col">
          <h4 className="font-bold mb-4">Datos Médicos</h4>

          {/* Sección de Visión */}
          <div className="mb-4">
            <h5 className="font-bold mb-3 text-center">Visión</h5>
            {/* Sin Corregir */}
            <div className="mb-4">
              <h6 className="font-semibold texce">Sin Corregir</h6>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <div className="font-semibold text-center">O.D</div>
                  <InputTextOneLine label="V.C." name="visionCercaOd" value={form?.visionCercaOd} disabled labelWidth="60px" />
                  <InputTextOneLine label="V.L." name="visionLejosOd" value={form?.visionLejosOd} disabled labelWidth="60px" />
                </div>
                <div className="space-y-2">
                  <div className="font-semibold  text-center">O.I</div>
                  <InputTextOneLine label="V.C." name="visionCercaOi" value={form?.visionCercaOi} disabled labelWidth="60px" />
                  <InputTextOneLine label="V.L." name="visionLejosOi" value={form?.visionLejosOi} disabled labelWidth="60px" />
                </div>
              </div>
            </div>

            {/* Corregida */}
            <div className="mb-4">
              <h6 className="font-semibold ">Corregida</h6>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <div className="font-semibold text-center">O.D</div>
                  <InputTextOneLine label="V.C." name="visionCercaOdCorregida" value={form?.visionCercaOdCorregida} disabled labelWidth="60px" />
                  <InputTextOneLine label="V.L." name="visionLejosOdCorregida" value={form?.visionLejosOdCorregida} disabled labelWidth="60px" />

                </div>
                <div className="space-y-2">
                  <div className="font-semibold text-center">O.I</div>
                  <InputTextOneLine label="V.C." name="visionCercaOiCorregida" value={form?.visionCercaOiCorregida} disabled labelWidth="60px" />
                  <InputTextOneLine label="V.L." name="visionLejosOiCorregida" value={form?.visionLejosOiCorregida} disabled labelWidth="60px" />
                </div>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <InputTextOneLine label="V.Clrs" name="visionColores" value={form?.visionColores} disabled labelWidth="60px" />
              <InputTextOneLine label="V.B. " name="visionBinocular" value={form?.visionBinocular} disabled labelWidth="60px" />
              <InputTextOneLine label="R.P. " name="reflejosPupilares" value={form?.reflejosPupilares} disabled labelWidth="60px" />
            </div>

            {/* Enfermedades Oculares */}
            <div className="mb-4 flex-1">
              <InputTextArea label="Enfermedades Oculares" rows={5} name="enfermedadOculares" value={form?.enfermedadOculares} disabled />
            </div>
          </div>

          {/* Sección de Laboratorio */}
          <div className="mb-4">
            <h5 className=" mb-2 font-bold">Laboratorio</h5>
            <div className="space-y-2">
              <InputTextOneLine label="Hemoglobina" name="hemoglobina" value={form?.hemoglobina} disabled />
              <InputTextOneLine label="V.S.G" name="vsg" value={form?.vsg} disabled />
              <InputTextOneLine label="Glucosa" name="glucosa" value={form?.glucosa} disabled />
              <InputTextOneLine label="Creatinina" name="creatinina" value={form?.creatinina} disabled />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
