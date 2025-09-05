import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPen, faChartBar } from "@fortawesome/free-solid-svg-icons";
import {
  InputCheckbox,
  InputsRadioGroup,
  InputTextArea,
  InputTextOneLine,
} from "../../../../../components/reusableComponents/ResusableComponents";

const Resultados = ({
  form,
  setForm,
  handleChange,
  handleChangeNumber,
  handleRadioButton,
  handleCheckBoxChange,
  handleClear,
  handleClearnotO,
  handleRadioButtonBoolean,
}) => {
  return (
    <div className="p-6" style={{ fontSize: "11px" }}>
      <h3 className="font-semibold mb-6 text-gray-800">
        Resultados del Examen Ocupacional
      </h3>

      {/* Primera fila - 3 columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Columna 1 - Aptitud del Paciente */}
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <p className="font-semibold text-gray-800 mb-2">
            Aptitud del Paciente
          </p>
          <InputsRadioGroup
            name="aptitud"
            value={form.aptitud}
            onChange={handleRadioButton}
            vertical
            options={[
              {
                label: "APTO (para el puesto en el que trabaja o postula)",
                value: "APTO",
              },
              {
                label:
                  "APTO CON RESTRICCION (para el puesto en el que trabaja o postula)",
                value: "RESTRICCION",
              },
              {
                label: "NO APTO (para el puesto en el que trabaja o postula)",
                value: "NO APTO",
              },
            ]}
          />

          {/* Fechas */}
          <div className="grid grid-cols-2 gap-x-4 my-3">
            <InputTextOneLine
              label="Fecha"
              type="date"
              name="fechaAptitud"
              value={form.fechaAptitud}
              labelWidth="120px"
            />
            <InputTextOneLine
              label="Fecha Vencimiento"
              type="date"
              name="fechaVencimiento"
              value={form.fechaVencimiento}
              labelWidth="120px"
            />
          </div>
          {/* Restricciones */}
          <InputTextArea
            rows={9}
            label="Restricciones"
            name="restricciones"
            value={form.restricciones}
            disabled
          />
        </div>

        {/* Columna 2 - Recomendaciones y Restricciones */}
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <p className="font-semibold text-gray-800 mb-2">
            Recomendaciones y Restricciones
          </p>
          <div className="space-y-2 mb-4">
            <InputCheckbox
              label="CORREGIR AGUDEZA VISUAL TOTAL PARA TRABAJO SOBRE 1.8 M.S.N.PISO"
              checked={form.corregirAgudezaVisualTotal}
              onChange={handleCheckBoxChange}
              name="corregirAgudezaVisualTotal"
            />
            <InputCheckbox
              label="CORREGIR AGUDEZA VISUAL PARA TRABAJO SOBRE 1.8 M.S.N.PISO"
              checked={form.corregirAgudezaVisual}
              onChange={handleCheckBoxChange}
              name="corregirAgudezaVisual"
            />
            <InputCheckbox
              label="DIETA HIPOCALORICA Y EJERCICIOS"
              checked={form.dietaHipocalorica}
              onChange={handleCheckBoxChange}
              name="dietaHipocalorica"
            />
            <InputCheckbox
              label="EVITAR MOVIMIENTOS Y POSICIONES DISERGONOMICAS"
              checked={form.evitarMovimientosDisergonomicos}
              onChange={handleCheckBoxChange}
              name="evitarMovimientosDisergonomicos"
            />
            <InputCheckbox
              label="NO HACER TRABAJO DE ALTO RIESGO"
              checked={form.noTrabajoAltoRiesgo}
              onChange={handleCheckBoxChange}
              name="noTrabajoAltoRiesgo"
            />
            <InputCheckbox
              label="NO HACER TRABAJO SOBRE 1.8 M.S.N.PISO"
              checked={form.noTrabajoSobre18m}
              onChange={handleCheckBoxChange}
              name="noTrabajoSobre18m"
            />
            <InputCheckbox
              label="USO DE EPP AUDITIVO ANTE EXPOSICION A RUIDO ≥80 DB"
              checked={form.usoEppAuditivo}
              onChange={handleCheckBoxChange}
              name="usoEppAuditivo"
            />
            <InputCheckbox
              label="USO DE LENTES CORRECTORES PARA CONDUCIR Y/O OPERAR VEHICULOS MOTORIZADOS"
              checked={form.usoLentesCorrectorConducir}
              onChange={handleCheckBoxChange}
              name="usoLentesCorrectorConducir"
            />
            <InputCheckbox
              label="USO DE LENTES CORRECTORES PARA TRABAJO."
              checked={form.usoLentesCorrectorTrabajo}
              onChange={handleCheckBoxChange}
              name="usoLentesCorrectorTrabajo"
            />
            <InputCheckbox
              label="USO DE LENTES CORRECTORES PARA TRABAJO SOBRE 1.8 M.S.N.PISO"
              checked={form.usoLentesCorrectorTrabajo18m}
              onChange={handleCheckBoxChange}
              name="usoLentesCorrectorTrabajo18m"
            />
            <InputCheckbox
              label="NINGUNO."
              checked={form.ninguno}
              onChange={handleCheckBoxChange}
              name="ninguno"
            />
            <InputCheckbox
              label="NO CONDUCIR VEHICULOS"
              checked={form.noConducirVehiculos}
              onChange={handleCheckBoxChange}
              name="noConducirVehiculos"
            />
            <InputCheckbox
              label="USO DE EPP AUDITIVO"
              checked={form.usoEppAuditivoGeneral}
              onChange={handleCheckBoxChange}
              name="usoEppAuditivoGeneral"
            />
          </div>
        </div>
      </div>
      <h3 className="font-semibold mb-6 text-gray-800">Estado Paciente</h3>

      {/* Segunda fila - Estado del Paciente (1 columna) */}
      <div className="mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <p className="font-semibold text-gray-800 mb-2">Datos de Paciente</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputTextArea
              label="Nro Orden"
              name="nordenEstadoPaciente"
              value={form.nordenEstadoPaciente}
              onChange={handleChange}
            />
            <InputTextArea
              label="Nombres"
              name="nombresEstadoPaciente"
              value={form.nombresEstadoPaciente}
              disabled
            />
            <InputTextArea
              label="Tipo Examen"
              name="tipoExamenEstadoPaciente"
              value={form.tipoExamenEstadoPaciente}
              disabled
            />
          </div>
        </div>
      </div>

      {/* Sección de Exámenes */}
      <div className="mt-6 bg-white border border-gray-200 rounded-lg p-3">
        <p className="font-semibold text-gray-800 mb-2">Exámenes Realizados</p>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <InputTextArea
            label="Triaje"
            name="triaje"
            value={form.triaje}
            disabled
          />
          <InputTextArea
            label="Lab. Clinico"
            name="labClinico"
            value={form.labClinico}
            disabled
          />
          <InputTextArea
            label="Electrocardiograma"
            name="electrocardiograma"
            value={form.electrocardiograma}
            disabled
          />
          <InputTextArea
            label="Rx. Torax P.A"
            name="rxToraxPA"
            value={form.rxToraxPA}
            disabled
          />
          <InputTextArea
            label="Ficha Audiologica"
            name="fichaAudiologica"
            value={form.fichaAudiologica}
            disabled
          />
          <InputTextArea
            label="Espirometria"
            name="espirometria"
            value={form.espirometria}
            disabled
          />
          <InputTextArea
            label="Odontograma"
            name="odontograma"
            value={form.odontograma}
            disabled
          />
          <InputTextArea
            label="Psicologia"
            name="psicologia"
            value={form.psicologia}
            disabled
          />
          <InputTextArea
            label="Anexo 7D"
            name="anexo7D"
            value={form.anexo7D}
            disabled
          />
          <InputTextArea
            label="Hist. Ocupacional"
            name="histOcupacional"
            value={form.histOcupacional}
            disabled
          />
          <InputTextArea
            label="Ficha Ant. Patológicos"
            name="fichaAntPatologicos"
            value={form.fichaAntPatologicos}
            disabled
          />
          <InputTextArea
            label="Cuestionario Nórdico"
            name="cuestionarioNordico"
            value={form.cuestionarioNordico}
            disabled
          />
          <InputTextArea
            label="Cert. Trabajo Altura"
            name="certTrabajoAltura"
            value={form.certTrabajoAltura}
            disabled
          />
          <InputTextArea
            label="Detención S.A.S"
            name="detencionSAS"
            value={form.detencionSAS}
            disabled
          />
          <InputTextArea
            label="Consentimiento Dosaje"
            name="consentimientoDosaje"
            value={form.consentimientoDosaje}
            disabled
          />
          <InputTextArea
            label="Ex. Rx Sanguineos"
            name="exRxSanguineos"
            value={form.exRxSanguineos}
            disabled
          />
          <InputTextArea
            label="Perimetro Toraxico"
            name="perimetroToraxico"
            value={form.perimetroToraxico}
            disabled
          />
          <InputTextArea
            label="Oftalmología"
            name="oftalmologia"
            value={form.oftalmologia}
            disabled
          />
        </div>
      </div>

      {/* Sección de Impresión de Informes */}
      <div className="mt-6 bg-white border border-gray-200 rounded-lg p-3">
        <p className="font-semibold  mb-2">Imprimir Informes de Exámenes</p>
        <div className="flex flex-wrap gap-4">
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Anexo 7C - N°1
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Anexo 7C - N°2
          </button>
        </div>
      </div>
    </div>
  );
};

export default Resultados;
