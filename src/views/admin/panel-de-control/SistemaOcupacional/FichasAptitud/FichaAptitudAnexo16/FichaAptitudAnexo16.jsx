import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import {
  InputTextOneLine,
  InputTextArea,
  InputCheckbox,
  InputsRadioGroup,
  SectionFieldset
} from "../../../../../components/reusableComponents/ResusableComponents";
import { useSessionData } from "../../../../../hooks/useSessionData";
import { getDatePlusOneYear, getToday } from "../../../../../utils/helpers";
import { useForm } from "../../../../../hooks/useForm";
import { PrintHojaR, PrintHojaR2, SubmitDataService, VerifyTR } from "./controllerFichaAptitudAnexo16";
import EmpleadoComboBox from "../../../../../components/reusableComponents/EmpleadoComboBox";
import BotonesAccion from "../../../../../components/templates/BotonesAccion";
import DatosPersonalesLaborales from "../../../../../components/templates/DatosPersonalesLaborales";

const tabla = "certificado_aptitud_medico_ocupacional"
const tabla2 = "resumen_medico_poderosa"

export default function FichaAptitudAnexo16() {
  const today = getToday();

  const { token, userlogued, selectedSede, datosFooter, userName, hora } = useSessionData();

  const initialFormState = {
    // Datos básicos
    norden: "",
    tipoExamen: "",
    dni: "",
    nombres: "",
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

    // Médico que Certifica //BUSCADOR
    nombre_medico: userName,
    user_medicoFirma: userlogued,
  };

  const {
    form,
    setForm,
    handleChange,
    handleChangeNumber,
    handleChangeNumberDecimals,
    handleRadioButton,
    handleChangeSimple,
    handleClear,
    handleClearnotO,
    handlePrintDefault,
  } = useForm(initialFormState, { storageKey: "fichaAptitudAnexo16" });

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
    <div className="grid xl:grid-cols-10 mx-auto max-w-[90%] gap-y-3 gap-x-4 py-4">
      <div className="space-y-6 xl:col-span-7">
        {/* Header */}
        <SectionFieldset legend="Información del Examen" className="grid xl:grid-cols-3 gap-y-3 gap-x-4">
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
        </SectionFieldset>
        <div className="space-y-3">
          {/* Información del paciente */}
          <DatosPersonalesLaborales form={form} />

          {/* Conclusiones y Recomendaciones en dos columnas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-3">
            {/* Columna 1: Conclusiones */}
            <div className="space-y-3">
              <SectionFieldset legend="Conclusiones y Recomendaciones" className="space-y-3">
                <InputTextArea
                  label="Conclusiones"
                  name="conclusiones"
                  value={form?.conclusiones}
                  onChange={handleChange}
                  rows={6}
                />
                <div className="space-y-3">
                  <InputCheckbox
                    label="Formato OHLA"
                    name="esOhla"
                    checked={form?.esOhla}
                    disabled
                    className="justify-end"
                  />
                  <InputsRadioGroup
                    label="Aptitud"
                    name="apto"
                    value={form?.apto}
                    labelOnTop
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
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-3">
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
                    {form?.apto == "NO APTO" ? (
                      <InputTextOneLine
                        label="Fecha Venc."
                        name="fechaVencimientoText"
                        value="NO APLICA"
                        disabled
                      />
                    ) : (
                      <InputTextOneLine
                        label="Fecha Venc."
                        name="fechaVencimiento"
                        type="date"
                        value={form?.fechaVencimiento}
                        disabled
                      />
                    )}
                  </div>
                  <InputTextArea
                    label="Recomendaciones"
                    name="recomendaciones"
                    value={form?.recomendaciones}
                    onChange={handleChange}
                    rows={6}
                    className="mb-3"
                  />

                </div>
              </SectionFieldset>
              <SectionFieldset legend="Asignación de Médico">
                <EmpleadoComboBox
                  value={form.nombre_medico}
                  label="Especialista"
                  form={form}
                  onChange={handleChangeSimple}
                />
              </SectionFieldset>
            </div>

            {/* Columna 2: Recomendaciones */}
            <SectionFieldset legend="Observaciones" className="space-y-3">
              <InputTextArea
                label="Restricciones"
                name="restricciones"
                value={form?.restricciones}
                onChange={handleChange}
                rows={8}
              />
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
            </SectionFieldset>
          </div>

          <div className="flex justify-between">
            <div className="w-full">
              <BotonesAccion
                form={form}
                handleSave={handleSave}
                handleClear={handleClear}
                handlePrint={handlePrint}
                handleChangeNumberDecimals={handleChangeNumberDecimals}
              />
            </div>
            <button
              type="button"
              onClick={handlePrint2}
              className="
                        bg-green-500 hover:bg-green-600  
                        text-white text-base px-6 py-2 rounded
                        flex items-center gap-2
                        transition-all duration-150 ease-out
                        hover:shadow-lg
                        active:scale-95 active:shadow-inner w-full 
                        max-w-[140px] max-h-[21px] justify-center mt-auto"
            >
              Resumen Médico <FontAwesomeIcon icon={faPrint} />
            </button>
          </div>
        </div>

      </div>
      {/* Columna de Datos Médicos (derecha) - 1/4 del ancho */}
      <div className="xl:col-span-3 flex flex-col space-y-3">
        <SectionFieldset legend="Oftalmología" collapsible className="grid gap-y-3">
          <SectionFieldset legend="Sin Corregir" className="grid md:grid-cols-2 gap-x-4 gap-y-3">
            <div>
              <div className="font-semibold mb-2 text-center ml-[80px]">Ojo Derecho</div>
              <div className="space-y-3">
                <InputTextOneLine label="Visión Cerca" name="visionCercaOd" value={form?.visionCercaOd} disabled labelWidth="70px" />
                <InputTextOneLine label="Visión Lejos" name="visionLejosOd" value={form?.visionLejosOd} disabled labelWidth="70px" />
              </div>
            </div>
            <div>
              <div className="font-semibold mb-2 text-center ml-[80px]">Ojo Izquierdo</div>
              <div className="space-y-3">
                <InputTextOneLine label="Visión Cerca" name="visionCercaOi" value={form?.visionCercaOi} disabled labelWidth="70px" />
                <InputTextOneLine label="Visión Lejos" name="visionLejosOi" value={form?.visionLejosOi} disabled labelWidth="70px" />
              </div>
            </div>
          </SectionFieldset>

          {/* Corregida */}
          <SectionFieldset legend="Corregida" className="grid md:grid-cols-2 gap-x-4 gap-y-3">
            <div className="space-y-3">
              <div className="font-semibold mb-2 text-center ml-[80px]">Ojo Derecho</div>
              <InputTextOneLine
                label="Visión Cerca"
                name="visionCercaOdCorregida"
                value={form?.visionCercaOdCorregida}
                disabled
                labelWidth="70px"
              />
              <InputTextOneLine
                label="Visión Lejos"
                name="visionLejosOdCorregida"
                value={form?.visionLejosOdCorregida}
                disabled
                labelWidth="70px"
              />
            </div>
            <div className="space-y-3">
              <div className="font-semibold mb-2 text-center ml-[80px]">Ojo Izquierdo</div>
              <InputTextOneLine
                label="Visión Cerca"
                name="visionCercaOiCorregida"
                value={form?.visionCercaOiCorregida}
                disabled
                labelWidth="70px"
              />
              <InputTextOneLine
                label="Visión Lejos"
                name="visionLejosOiCorregida"
                value={form?.visionLejosOiCorregida}
                disabled
                labelWidth="70px"
              />
            </div>
          </SectionFieldset>
          {/* Fila extra (ancho completo) */}
          <SectionFieldset legend="Valoración Oftalmológica" className="grid gap-y-3">
            <InputTextOneLine
              label="Visión Colores"
              name="visionColores"
              value={form?.visionColores}
              disabled
              labelWidth="100px"
            />
            <InputTextOneLine
              label="Visión Binocular"
              name="visionBinocular"
              value={form?.visionBinocular}
              disabled
              labelWidth="100px"
            />
            <InputTextOneLine
              label="Reflejos Pupilares"
              name="reflejosPupilares"
              value={form?.reflejosPupilares}
              disabled
              labelWidth="100px"
            />
            <InputTextArea
              label="Enfermedades Oculares"
              rows={7}
              name="enfermedadOculares"
              value={form?.enfermedadOculares}
              onChange={handleChange}
              disabled
            />
          </SectionFieldset>

        </SectionFieldset>
        {/* Sección de Laboratorio */}
        <SectionFieldset legend="Laboratorio" className="space-y-3" collapsible>
          <InputTextOneLine label="Hemoglobina" name="hemoglobina" value={form?.hemoglobina} disabled />
          <InputTextOneLine label="V.S.G" name="vsg" value={form?.vsg} disabled />
          <InputTextOneLine label="Glucosa" name="glucosa" value={form?.glucosa} disabled />
          <InputTextOneLine label="Creatinina" name="creatinina" value={form?.creatinina} disabled />
        </SectionFieldset>
      </div>
    </div>
  );
}
