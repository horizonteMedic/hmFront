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
import { PrintHojaR, SubmitDataService, VerifyTR } from "./controllerFichaAptitudAnexo2";
import EmpleadoComboBox from "../../../../../components/reusableComponents/EmpleadoComboBox";
import DatosPersonalesLaborales from "../../../../../components/templates/DatosPersonalesLaborales";
import BotonesAccion from "../../../../../components/templates/BotonesAccion";

const tabla = "aptitud_medico_ocupacional_agro"

export default function FichaAptitudAnexo2() {
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

    // Médico que Certifica //BUSCADOR
    nombre_medico: userName,
    user_medicoFirma: userlogued,
  };

  const {
    form,
    setForm,
    handleChange,
    handleChangeNumberDecimals,
    handleRadioButton,
    handleChangeSimple,
    handleClear,
    handleClearnotO,
    handlePrintDefault,
  } = useForm(initialFormState, { storageKey: "fichaAptitudAnexo2" });

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
    <div className="mx-auto max-w-[90%] lg:max-w-[80%] grid gap-y-3 gap-x-4 py-4">
      <SectionFieldset legend="Información del Examen" className="grid xl:grid-cols-3 gap-y-3 gap-x-4">
        <InputTextOneLine
          label="N° Orden"
          name="norden"
          value={form?.norden}
          onChange={handleChangeNumberDecimals}
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

      {/* Información del paciente */}
      <DatosPersonalesLaborales form={form} />

      {/* Conclusiones y Recomendaciones en dos columnas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
        {/* Columna 1: Conclusiones */}
        <div className="space-y-3">
          <SectionFieldset legend="Conclusiones y Recomendaciones" className="grid gap-x-4 gap-y-3">
            <InputTextArea
              label="Conclusiones"
              name="conclusiones"
              value={form?.conclusiones}
              onChange={handleChange}
              rows={6}
              className="mb-3"
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
                else if (value == "APTO CON RESTRICCION" || value == "NO APTO") {
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
              ]}
            />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-4 gap-y-3 mt-1">
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
            />
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
      <BotonesAccion
        form={form}
        handleSave={handleSave}
        handleClear={handleClear}
        handlePrint={handlePrint}
        handleChangeNumberDecimals={handleChangeNumberDecimals}
      />
    </div>
  );
}
