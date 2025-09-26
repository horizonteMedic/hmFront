import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileMedical, faSearch, faSave, faPrint, faTrash, faCalendar } from "@fortawesome/free-solid-svg-icons";
import { 
  InputTextOneLine, 
  InputTextArea, 
  InputCheckbox, 
  InputsRadioGroup 
} from "../../../../../components/reusableComponents/ResusableComponents";

// Componente para Ficha Aptitud Anexo 16
export default function FichaAptitudAnexo16({
  form,
  setForm,
  handleChange,
  handleChangeNumber,
  handleRadioButton,
  handleCheckBoxChange,
  handleChangeSimple,
  handleRadioButtonBoolean,
  MedicosMulti,
  handleSave,
  handleSearch,
  handlePrint,
  handleClear,
}) {
  // Función para manejar cambios en aptitud
  const handleAptitudChange = (e) => {
    const name = e.target.name;
    const checked = e.target.checked;
    
    setForm(prev => {
      const newForm = { ...prev, [name]: checked };
      
      // Si se marca "apto", desmarcar los otros y aplicar lógica de APTO
      if (name === "apto" && checked) {
        newForm.apto_restriccion = false;
        newForm.no_apto = false;
        // APTO: NINGUNO marcado, restricciones "NINGUNA", recomendaciones "NINGUNA"
        newForm.ninguno = true;
        newForm.restricciones = "NINGUNA";
        newForm.recomendaciones = "NINGUNA";
        // Desmarcar todas las otras recomendaciones
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
      } else if (name === "apto_restriccion" && checked) {
        newForm.apto = false;
        newForm.no_apto = false;
        // APTO CON RESTRICCIÓN: NINGUNO deshabilitado, restricciones "APTO CON RESTRICCIONES", recomendaciones libres
        newForm.ninguno = false;
        newForm.restricciones = "APTO CON RESTRICCIONES";
        newForm.recomendaciones = "";
        // Desmarcar todas las recomendaciones para que el usuario pueda elegir
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
      } else if (name === "no_apto" && checked) {
        newForm.apto = false;
        newForm.apto_restriccion = false;
        // NO APTO: NINGUNO deshabilitado, restricciones vacías, recomendaciones libres
        newForm.ninguno = false;
        newForm.restricciones = "";
        newForm.recomendaciones = "";
        // Desmarcar todas las recomendaciones para que el usuario pueda elegir
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
      }
      
      return newForm;
    });
  };

  // Función para manejar cambios en checkboxes de recomendaciones
  const handleRecomendacionChange = (name, checked) => {
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
        newForm.recomendaciones = "NINGUNO.";
      } else if (name !== "ninguno" && checked) {
        // Si se marca cualquier otro, deshabilitar "NINGUNO"
        newForm.ninguno = false;
        
        // Generar recomendaciones basadas en los checkboxes marcados
        const recomendaciones = [];
        if (newForm.corregirAgudezaVisualTotal) recomendaciones.push("CORREGIR AGUDEZA VISUAL TOTAL PARA TRABAJO SOBRE 1.8 M.S.N.PISO");
        if (newForm.corregirAgudezaVisual) recomendaciones.push("CORREGIR AGUDEZA VISUAL PARA TRABAJO SOBRE 1.8 M.S.N.PISO");
        if (newForm.dietaHipocalorica) recomendaciones.push("DIETA HIPOCALÓRICA Y EJERCICIOS");
        if (newForm.evitarMovimientosDisergonomicos) recomendaciones.push("EVITAR MOVIMIENTOS Y POSICIONES DISERGONÓMICAS");
        if (newForm.noHacerTrabajoAltoRiesgo) recomendaciones.push("NO HACER TRABAJO DE ALTO RIESGO");
        if (newForm.noHacerTrabajoSobre18) recomendaciones.push("NO HACER TRABAJO SOBRE 1.8 M.S.N.PISO");
        if (newForm.usoEppAuditivo) recomendaciones.push("USO DE EPP AUDITIVO ANTE EXPOSICIÓN A RUIDO >=80 DB");
        if (newForm.usoLentesConducir) recomendaciones.push("USO DE LENTES CORRECTORES PARA CONDUCIR Y/O OPERAR VEHÍCULOS MOTORIZADOS");
        if (newForm.usoLentesTrabajo) recomendaciones.push("USO DE LENTES CORRECTORES PARA TRABAJO.");
        if (newForm.usoLentesTrabajoSobre18) recomendaciones.push("USO DE LENTES CORRECTORES PARA TRABAJO SOBRE 1.8 M.S.N.PISO");
        if (newForm.noConducirVehiculos) recomendaciones.push("NO CONDUCIR VEHÍCULOS");
        
        newForm.recomendaciones = recomendaciones.join("\n");
      } else if (!checked) {
        // Si se desmarca un checkbox, regenerar las recomendaciones sin ese elemento
        if (name !== "ninguno") {
          const recomendaciones = [];
          if (newForm.corregirAgudezaVisualTotal) recomendaciones.push("CORREGIR AGUDEZA VISUAL TOTAL PARA TRABAJO SOBRE 1.8 M.S.N.PISO");
          if (newForm.corregirAgudezaVisual) recomendaciones.push("CORREGIR AGUDEZA VISUAL PARA TRABAJO SOBRE 1.8 M.S.N.PISO");
          if (newForm.dietaHipocalorica) recomendaciones.push("DIETA HIPOCALÓRICA Y EJERCICIOS");
          if (newForm.evitarMovimientosDisergonomicos) recomendaciones.push("EVITAR MOVIMIENTOS Y POSICIONES DISERGONÓMICAS");
          if (newForm.noHacerTrabajoAltoRiesgo) recomendaciones.push("NO HACER TRABAJO DE ALTO RIESGO");
          if (newForm.noHacerTrabajoSobre18) recomendaciones.push("NO HACER TRABAJO SOBRE 1.8 M.S.N.PISO");
          if (newForm.usoEppAuditivo) recomendaciones.push("USO DE EPP AUDITIVO ANTE EXPOSICIÓN A RUIDO >=80 DB");
          if (newForm.usoLentesConducir) recomendaciones.push("USO DE LENTES CORRECTORES PARA CONDUCIR Y/O OPERAR VEHÍCULOS MOTORIZADOS");
          if (newForm.usoLentesTrabajo) recomendaciones.push("USO DE LENTES CORRECTORES PARA TRABAJO.");
        if (newForm.usoLentesTrabajoSobre18) recomendaciones.push("USO DE LENTES CORRECTORES PARA TRABAJO SOBRE 1.8 M.S.N.PISO");
        if (newForm.noConducirVehiculos) recomendaciones.push("NO CONDUCIR VEHÍCULOS");
        
          newForm.recomendaciones = recomendaciones.join("\n");
        }
      }
      
      return newForm;
    });
  };

  return (
    <div className="space-y-6">
      {/* Layout principal con grid de 4 columnas desde arriba */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
        {/* Columna principal (izquierda) - 3/4 del ancho */}
        <div className="lg:col-span-3 space-y-4">
      {/* Header */}
          <div className="bg-white border border-gray-200 rounded-lg p-3">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-500">
            {new Date().toLocaleTimeString()}
          </div>
        </div>

        {/* Primera fila */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Aptitud</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">N° Historia Clínica:</span>
            <InputTextOneLine
              name="numeroHistoria"
              value={form?.numeroHistoria || ""}
              onChange={handleChange}
              className="w-32"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">Tipo de Examen:</span>
            <InputTextOneLine
              name="tipoExamen"
              value={form?.tipoExamen || ""}
              onChange={handleChange}
              className="w-40"
            />
          </div>
          <div className="flex items-center gap-2">
                <span className="font-semibold">Tipo Dos:</span>
                <InputTextOneLine
                  name="tipodos"
                  value={form?.tipodos || ""}
                  onChange={handleChange}
                  className="w-40"
                />
              </div>
              <div className="flex items-center gap-4">
            <InputCheckbox
              name="paraHuamachuco"
              checked={form?.paraHuamachuco || false}
              onChange={handleCheckBoxChange}
              label="PARA HUAMACHUCO"
            />
                <InputCheckbox
                  name="poderosa"
                  checked={form?.poderosa || false}
                  onChange={handleCheckBoxChange}
                  label="PODEROSA"
                />
          </div>
        </div>
      </div>

      {/* Información del paciente */}
          <div className="bg-white border border-gray-200 rounded-lg p-3">
        <h3 className="text-lg font-semibold mb-3">Certifica que el Sr.</h3>
        
        {/* Fila 1: Nombres, DNI, Edad, Género */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-3">
          <div className="md:col-span-2">
            <InputTextOneLine
              label="Nombres y Apellidos"
              name="nombresApellidos"
              value={form?.nombresApellidos || ""}
              onChange={handleChange}
            />
          </div>
          <InputTextOneLine
            label="DNI"
            name="dni"
            value={form?.dni || ""}
            onChange={handleChange}
          />
          <InputTextOneLine
            label="Edad"
            name="edad"
            value={form?.edad || ""}
            onChange={handleChange}
          />
          <InputTextOneLine
            label="Género"
            name="genero"
            value={form?.genero || ""}
            onChange={handleChange}
          />
        </div>

        {/* Fila 2: Empresa y Contratista */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
          <InputTextOneLine
            label="Empresa"
            name="empresa"
            value={form?.empresa || ""}
            onChange={handleChange}
          />
          <InputTextOneLine
            label="Contratista"
            name="contratista"
            value={form?.contratista || ""}
            onChange={handleChange}
          />
        </div>

        {/* Fila 3: Puesto y Ocupación */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
          <InputTextOneLine
            label="Puesto al que Postula"
            name="puestoPostula"
            value={form?.puestoPostula || ""}
            onChange={handleChange}
          />
          <InputTextOneLine
            label="Ocupación actual o Última Ocupación"
            name="ocupacionActual"
            value={form?.ocupacionActual || ""}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Conclusiones y Recomendaciones en dos columnas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Columna 1: Conclusiones */}
            <div className="bg-white border border-gray-200 rounded-lg p-3">
          <h3 className="text-lg font-semibold mb-3">Conclusiones</h3>
          
          <InputTextArea
            label=""
            name="conclusiones"
            value={form?.conclusiones || ""}
            onChange={handleChange}
            rows={3}
            className="mb-3"
          />

          <div className="space-y-2">
                <InputCheckbox
                  name="apto"
                  checked={form?.apto || false}
                  onChange={handleAptitudChange}
                  label="APTO (para el puesto en el que trabaja o postula)"
                />
                <InputCheckbox
                  name="apto_restriccion"
                  checked={form?.apto_restriccion || false}
                  onChange={handleAptitudChange}
                  label="APTO CON RESTRICCIÓN (para el puesto en el que trabaja o postula)"
                />
                <InputCheckbox
                  name="no_apto"
                  checked={form?.no_apto || false}
              onChange={handleAptitudChange}
                  label="NO APTO (para el puesto en el que trabaja o postula)"
                />
                <div className="grid grid-cols-1 gap-4 mb-3">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Fecha:</span>
                <InputTextOneLine
                  name="fecha"
                  type="date"
                  value={form?.fecha || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Fecha Venc.:</span>
                <InputTextOneLine
                  name="fechaVencimiento"
                  type="date"
                  value={form?.fechaVencimiento || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Columna 2: Recomendaciones */}
            <div className="bg-white border border-gray-200 rounded-lg p-3">
          <h3 className="text-lg font-semibold mb-3">Recomendaciones</h3>
          
          <InputTextArea
            label=""
            name="recomendaciones"
            value={form?.recomendaciones || ""}
            onChange={handleChange}
            rows={3}
            className="mb-3"
          />

            <div className="space-y-2">
              <InputCheckbox
                name="corregirAgudezaVisualTotal"
                checked={form?.corregirAgudezaVisualTotal || false}
                onChange={(e) => handleRecomendacionChange("corregirAgudezaVisualTotal", e.target.checked)}
                disabled={form?.ninguno || false}
                className={form?.ninguno ? "opacity-50 text-gray-400" : ""}
                label="CORREGIR AGUDEZA VISUAL TOTAL PARA TRABAJO SOBRE 1.8 M.S.N.PISO"
              />
              <InputCheckbox
                name="corregirAgudezaVisual"
                checked={form?.corregirAgudezaVisual || false}
                onChange={(e) => handleRecomendacionChange("corregirAgudezaVisual", e.target.checked)}
                disabled={form?.ninguno || false}
                className={form?.ninguno ? "opacity-50 text-gray-400" : ""}
                label="CORREGIR AGUDEZA VISUAL PARA TRABAJO SOBRE 1.8 M.S.N.PISO"
              />
              <InputCheckbox
                name="dietaHipocalorica"
                checked={form?.dietaHipocalorica || false}
                onChange={(e) => handleRecomendacionChange("dietaHipocalorica", e.target.checked)}
                disabled={form?.ninguno || false}
                className={form?.ninguno ? "opacity-50 text-gray-400" : ""}
                label="DIETA HIPOCALÓRICA Y EJERCICIOS"
              />
              <InputCheckbox
                name="evitarMovimientosDisergonomicos"
                checked={form?.evitarMovimientosDisergonomicos || false}
                onChange={(e) => handleRecomendacionChange("evitarMovimientosDisergonomicos", e.target.checked)}
                disabled={form?.ninguno || false}
                className={form?.ninguno ? "opacity-50 text-gray-400" : ""}
                label="EVITAR MOVIMIENTOS Y POSICIONES DISERGONÓMICAS"
              />
              <InputCheckbox
                name="noHacerTrabajoAltoRiesgo"
                checked={form?.noHacerTrabajoAltoRiesgo || false}
                onChange={(e) => handleRecomendacionChange("noHacerTrabajoAltoRiesgo", e.target.checked)}
                disabled={form?.ninguno || false}
                className={form?.ninguno ? "opacity-50 text-gray-400" : ""}
                label="NO HACER TRABAJO DE ALTO RIESGO"
              />
              <InputCheckbox
                name="noHacerTrabajoSobre18"
                checked={form?.noHacerTrabajoSobre18 || false}
                onChange={(e) => handleRecomendacionChange("noHacerTrabajoSobre18", e.target.checked)}
                disabled={form?.ninguno || false}
                className={form?.ninguno ? "opacity-50 text-gray-400" : ""}
                label="NO HACER TRABAJO SOBRE 1.8 M.S.N.PISO"
              />
              <InputCheckbox
                name="usoEppAuditivo"
                checked={form?.usoEppAuditivo || false}
                onChange={(e) => handleRecomendacionChange("usoEppAuditivo", e.target.checked)}
                disabled={form?.ninguno || false}
                className={form?.ninguno ? "opacity-50 text-gray-400" : ""}
                label="USO DE EPP AUDITIVO ANTE EXPOSICIÓN A RUIDO >=80 DB"
              />
              <InputCheckbox
                name="usoLentesConducir"
                checked={form?.usoLentesConducir || false}
                onChange={(e) => handleRecomendacionChange("usoLentesConducir", e.target.checked)}
                disabled={form?.ninguno || false}
                className={form?.ninguno ? "opacity-50 text-gray-400" : ""}
                label="USO DE LENTES CORRECTORES PARA CONDUCIR Y/O OPERAR VEHÍCULOS MOTORIZADOS"
              />
              <InputCheckbox
                name="usoLentesTrabajo"
                checked={form?.usoLentesTrabajo || false}
                onChange={(e) => handleRecomendacionChange("usoLentesTrabajo", e.target.checked)}
                disabled={form?.ninguno || false}
                className={form?.ninguno ? "opacity-50 text-gray-400" : ""}
                label="USO DE LENTES CORRECTORES PARA TRABAJO."
              />
              <InputCheckbox
                name="usoLentesTrabajoSobre18"
                checked={form?.usoLentesTrabajoSobre18 || false}
                onChange={(e) => handleRecomendacionChange("usoLentesTrabajoSobre18", e.target.checked)}
                disabled={form?.ninguno || false}
                className={form?.ninguno ? "opacity-50 text-gray-400" : ""}
                label="USO DE LENTES CORRECTORES PARA TRABAJO SOBRE 1.8 M.S.N.PISO"
              />
              <InputCheckbox
                name="ninguno"
                checked={form?.ninguno || false}
                onChange={(e) => handleRecomendacionChange("ninguno", e.target.checked)}
                disabled={form?.corregirAgudezaVisualTotal || form?.corregirAgudezaVisual || form?.dietaHipocalorica || form?.evitarMovimientosDisergonomicos || form?.noHacerTrabajoAltoRiesgo || form?.noHacerTrabajoSobre18 || form?.usoEppAuditivo || form?.usoLentesConducir || form?.usoLentesTrabajo || form?.usoLentesTrabajoSobre18 || form?.noConducirVehiculos || false}
                className={(() => {
                  const isDisabled = form?.corregirAgudezaVisualTotal || form?.corregirAgudezaVisual || form?.dietaHipocalorica || form?.evitarMovimientosDisergonomicos || form?.noHacerTrabajoAltoRiesgo || form?.noHacerTrabajoSobre18 || form?.usoEppAuditivo || form?.usoLentesConducir || form?.usoLentesTrabajo || form?.usoLentesTrabajoSobre18 || form?.noConducirVehiculos;
                  return isDisabled ? "opacity-50 text-gray-400 cursor-not-allowed" : "";
                })()}
                label="NINGUNO."
              />
              <InputCheckbox
                name="noConducirVehiculos"
                checked={form?.noConducirVehiculos || false}
                onChange={(e) => handleRecomendacionChange("noConducirVehiculos", e.target.checked)}
                disabled={form?.ninguno || false}
                className={form?.ninguno ? "opacity-50 text-gray-400" : ""}
                label="NO CONDUCIR VEHÍCULOS"
              />
          </div>
        </div>
      </div>

          {/* Médico que Certifica */}
          <div className="bg-white border border-gray-200 rounded-lg p-3">
          <InputTextOneLine
            label="Médico que Certifica"
            name="medicoCertifica"
            value={form?.medicoCertifica || ""}
            onChange={handleChange}
              className="w-full"
            />
          </div>

          {/* Restricciones */}
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <h3 className="text-lg font-semibold mb-3">Restricciones</h3>
            <InputTextArea
              label=""
              name="restricciones"
              value={form?.restricciones || ""}
              onChange={handleChange}
              rows={6}
              className="h-full"
            />
          </div>
        </div>

        {/* Columna de Datos Médicos (derecha) - 1/4 del ancho */}
        <div className="lg:col-span-1 flex flex-col">
          <div className="bg-white border border-gray-200 rounded-lg p-3 flex-1 flex flex-col">
            <h4 className="font-semibold text-gray-800 mb-3">Datos Médicos</h4>

            {/* Sección de Visión */}
            <div className="mb-4">
              <h5 className="font-semibold text-gray-700 mb-2">Visión</h5>
              
              {/* Sin Corregir */}
              <div className="mb-4">
                <h6 className="font-semibold text-gray-700 mb-2">Sin Corregir</h6>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center">
                    <div className="font-semibold mb-2">O.D</div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] min-w-[30px]">V.C.:</span>
                        <InputTextOneLine name="visionCercaOd" value={form?.visionCercaOd || ""} onChange={handleChange} />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] min-w-[30px]">V.L.:</span>
                        <InputTextOneLine name="visionLejosOd" value={form?.visionLejosOd || ""} onChange={handleChange} />
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold mb-2">O.I</div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] min-w-[30px]">V.C.:</span>
                        <InputTextOneLine name="visionCercaOi" value={form?.visionCercaOi || ""} onChange={handleChange} />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] min-w-[30px]">V.L.:</span>
                        <InputTextOneLine name="visionLejosOi" value={form?.visionLejosOi || ""} onChange={handleChange} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Corregida */}
              <div className="mb-4">
                <h6 className="font-semibold text-gray-700 mb-2">Corregida</h6>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center">
                    <div className="font-semibold mb-2">O.D</div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] min-w-[30px]">V.C.:</span>
                        <InputTextOneLine name="visionCercaOdCorregida" value={form?.visionCercaOdCorregida || ""} onChange={handleChange} />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] min-w-[30px]">V.L.:</span>
                        <InputTextOneLine name="visionLejosOdCorregida" value={form?.visionLejosOdCorregida || ""} onChange={handleChange} />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] min-w-[30px]">V.Clrs:</span>
                        <InputTextOneLine name="visionColores" value={form?.visionColores || ""} onChange={handleChange} />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] min-w-[30px]">V.B.:</span>
                        <InputTextOneLine name="visionBinocular" value={form?.visionBinocular || ""} onChange={handleChange} />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] min-w-[30px]">R.P.:</span>
                        <InputTextOneLine name="reflejosPupilares" value={form?.reflejosPupilares || ""} onChange={handleChange} />
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold mb-2">O.I</div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] min-w-[30px]">V.C.:</span>
                        <InputTextOneLine name="visionCercaOiCorregida" value={form?.visionCercaOiCorregida || ""} onChange={handleChange} />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] min-w-[30px]">V.L.:</span>
                        <InputTextOneLine name="visionLejosOiCorregida" value={form?.visionLejosOiCorregida || ""} onChange={handleChange} />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] min-w-[30px]">:</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] min-w-[30px]">:</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] min-w-[30px]">:</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enfermedades Oculares */}
              <div className="mb-4 flex-1">
                <h6 className="font-semibold text-gray-700 mb-2">Enfermedades Oculares</h6>
                <InputTextArea rows={3} name="enfermedadOculares" value={form?.enfermedadOculares || ""} onChange={handleChange} />
              </div>
            </div>

            {/* Sección de Laboratorio */}
            <div className="mb-4">
              <h5 className="font-semibold text-gray-700 mb-2">Laboratorio</h5>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] min-w-[60px]">Hemoglobina:</span>
                  <InputTextOneLine name="hemoglobinaHematocrito" value={form?.hemoglobinaHematocrito || ""} onChange={handleChange} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] min-w-[60px]">V.S.G:</span>
                  <InputTextOneLine name="vsg" value={form?.vsg || ""} onChange={handleChange} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] min-w-[60px]">Glucosa:</span>
                  <InputTextOneLine name="glucosa" value={form?.glucosa || ""} onChange={handleChange} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] min-w-[60px]">Creatinina:</span>
                  <InputTextOneLine name="creatinina" value={form?.creatinina || ""} onChange={handleChange} />
                </div>
              </div>
            </div>

            {/* Botones de Acción dentro de la columna derecha */}
            <div className="mt-auto space-y-2">
              {/* Fila 1: Botón 1 y Botón 2 lado a lado */}
              <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSave}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded flex items-center justify-center gap-2"
              >
                  <FontAwesomeIcon icon={faSave} /> Guardar/Actualizar
              </button>
              <button
                type="button"
                onClick={handleClear}
                  className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-2 rounded flex items-center justify-center gap-2"
              >
                <FontAwesomeIcon icon={faTrash} /> Limpiar
              </button>
            </div>

              {/* Fila 2: Input y Botón lado a lado */}
              <div className="flex gap-2">
                <input
                  name="numeroHistoria"
                  value={form?.numeroHistoria || ""}
                  onChange={handleChange}
                  className="flex-1 border rounded px-2 py-1"
                  placeholder="N° Historia"
                />
                <button
                  type="button"
                  onClick={handlePrint}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded flex items-center justify-center gap-2"
                >
                  <FontAwesomeIcon icon={faPrint} /> Imprimir
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
