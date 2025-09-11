import {
  InputCheckbox,
  InputsRadioGroup,
  InputTextArea,
  InputTextOneLine,
} from "../../../../../components/reusableComponents/ResusableComponents";

export default function Resultados({
  form,
  setForm,
  handleChange,
  handleRadioButton,
  handleCheckBoxChange,
  handlePrint,
  handleSearchExamenesRealizados
}) {
  const RestriccionCheckbox = ({ label, name }) => {
    return (
      <InputCheckbox
        label={label}
        checked={form[name]}
        name={name}
        onChange={(e) => {
          if (e.target.checked) {
            setForm((prev) => ({
              ...prev,
              [name]: true,
              ninguno: false,
              restricciones:
                prev.restricciones === "NINGUNO" || prev.restricciones === ""
                  ? label
                  : prev.restricciones + "\n" + label,
            }));
          } else {
            setForm((prev) => ({
              ...prev,
              [name]: false,
              restricciones: "",
              corregirAgudezaVisualTotal: false,
              corregirAgudezaVisual: false,
              dietaHipocalorica: false,
              evitarMovimientosDisergonomicos: false,
              noTrabajoAltoRiesgo: false,
              noTrabajoSobre18m: false,
              usoEppAuditivo: false,
              usoLentesCorrectorConducir: false,
              usoLentesCorrectorTrabajo: false,
              usoLentesCorrectorTrabajo18m: false,
              noConducirVehiculos: false,
              usoEppAuditivoGeneral: false,
            }));
          }
        }}
      />
    );
  };

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
            onChange={(e, value) => {
              if (value == "APTO") {
                setForm((prev) => ({
                  ...prev,
                  restricciones: "NINGUNO",
                  ninguno: true,
                  corregirAgudezaVisualTotal: false,
                  corregirAgudezaVisual: false,
                  dietaHipocalorica: false,
                  evitarMovimientosDisergonomicos: false,
                  noTrabajoAltoRiesgo: false,
                  noTrabajoSobre18m: false,
                  usoEppAuditivo: false,
                  usoLentesCorrectorConducir: false,
                  usoLentesCorrectorTrabajo: false,
                  usoLentesCorrectorTrabajo18m: false,
                  noConducirVehiculos: false,
                  usoEppAuditivoGeneral: false,
                }));
              }
              handleRadioButton(e, value);
            }}
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
          <div className="grid gap-y-2 my-2">
            <InputTextOneLine
              label="Fecha"
              type="date"
              name="fechaAptitud"
              value={form.fechaAptitud}
              onChange={handleChange}
              labelWidth="120px"
            />
            <InputTextOneLine
              label="Fecha Vencimiento"
              type="date"
              name="fechaVencimiento"
              value={form.fechaVencimiento}
              onChange={handleChange}
              labelWidth="120px"
            />
          </div>
          {/* Restricciones */}
          <InputTextArea
            rows={9}
            label="Restricciones"
            name="restricciones"
            value={form.restricciones}
            onChange={handleChange}
          />
        </div>

        {/* Columna 2 - Recomendaciones y Restricciones */}
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <p className="font-semibold text-gray-800 mb-2">
            Recomendaciones y Restricciones
          </p>
          <div className="space-y-2 mb-4">
            <RestriccionCheckbox
              label="CORREGIR AGUDEZA VISUAL TOTAL PARA TRABAJO SOBRE 1.8 M.S.N.PISO"
              name="corregirAgudezaVisualTotal"
            />
            <RestriccionCheckbox
              label="CORREGIR AGUDEZA VISUAL PARA TRABAJO SOBRE 1.8 M.S.N.PISO"
              name="corregirAgudezaVisual"
            />
            <RestriccionCheckbox
              label="DIETA HIPOCALORICA Y EJERCICIOS"
              name="dietaHipocalorica"
            />
            <RestriccionCheckbox
              label="EVITAR MOVIMIENTOS Y POSICIONES DISERGONOMICAS"
              name="evitarMovimientosDisergonomicos"
            />
            <RestriccionCheckbox
              label="NO HACER TRABAJO DE ALTO RIESGO"
              name="noTrabajoAltoRiesgo"
            />
            <RestriccionCheckbox
              label="NO HACER TRABAJO SOBRE 1.8 M.S.N.PISO"
              name="noTrabajoSobre18m"
            />
            <RestriccionCheckbox
              label="USO DE EPP AUDITIVO ANTE EXPOSICION A RUIDO ≥80 DB"
              name="usoEppAuditivo"
            />
            <RestriccionCheckbox
              label="USO DE LENTES CORRECTORES PARA CONDUCIR Y/O OPERAR VEHICULOS MOTORIZADOS"
              name="usoLentesCorrectorConducir"
            />
            <RestriccionCheckbox
              label="USO DE LENTES CORRECTORES PARA TRABAJO"
              name="usoLentesCorrectorTrabajo"
            />
            <RestriccionCheckbox
              label="USO DE LENTES CORRECTORES PARA TRABAJO SOBRE 1.8 M.S.N.PISO"
              name="usoLentesCorrectorTrabajo18m"
            />
            <InputCheckbox
              label="NINGUNO"
              checked={form.ninguno}
              onChange={(e) => {
                handleCheckBoxChange(e);
                setForm((prev) => ({
                  ...prev,
                  restricciones: e.target.checked ? "NINGUNO" : "",
                  corregirAgudezaVisualTotal: false,
                  corregirAgudezaVisual: false,
                  dietaHipocalorica: false,
                  evitarMovimientosDisergonomicos: false,
                  noTrabajoAltoRiesgo: false,
                  noTrabajoSobre18m: false,
                  usoEppAuditivo: false,
                  usoLentesCorrectorConducir: false,
                  usoLentesCorrectorTrabajo: false,
                  usoLentesCorrectorTrabajo18m: false,
                  noConducirVehiculos: false,
                  usoEppAuditivoGeneral: false,
                }));
              }}
              name="ninguno"
            />
            <RestriccionCheckbox
              label="NO CONDUCIR VEHICULOS"
              name="noConducirVehiculos"
            />
            <RestriccionCheckbox
              label="USO DE EPP AUDITIVO"
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
            <InputTextOneLine
              label="Nro Orden"
              name="nordenEstadoPaciente"
              value={form.nordenEstadoPaciente}
              onChange={handleChange}
              onKeyUp={handleSearchExamenesRealizados}
            />
            <InputTextOneLine
              label="Nombres"
              name="nombresEstadoPaciente"
              value={form.nombresEstadoPaciente}
              disabled
            />
            <InputTextOneLine
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
            className={form.triaje === "PASADO" ? "text-green-600" : form.triaje === "POR PASAR" ? "text-red-600" : ""}
          />
          <InputTextArea
            label="Lab. Clinico"
            name="labClinico"
            value={form.labClinico}
            disabled
            className={form.labClinico === "PASADO" ? "text-green-600" : form.labClinico === "POR PASAR" ? "text-red-600" : ""}
          />
          <InputTextArea
            label="Electrocardiograma"
            name="electrocardiograma"
            value={form.electrocardiograma}
            disabled
            className={form.electrocardiograma === "PASADO" ? "text-green-600" : form.electrocardiograma === "POR PASAR" ? "text-red-600" : ""}
          />
          <InputTextArea
            label="Rx. Torax P.A"
            name="rxToraxPA"
            value={form.rxToraxPA}
            disabled
            className={form.rxToraxPA === "PASADO" ? "text-green-600" : form.rxToraxPA === "POR PASAR" ? "text-red-600" : ""}
          />
          <InputTextArea
            label="Ficha Audiologica"
            name="fichaAudiologica"
            value={form.fichaAudiologica}
            disabled
            className={form.fichaAudiologica === "PASADO" ? "text-green-600" : form.fichaAudiologica === "POR PASAR" ? "text-red-600" : ""}
          />
          <InputTextArea
            label="Espirometria"
            name="espirometria"
            value={form.espirometria}
            disabled
            className={form.espirometria === "PASADO" ? "text-green-600" : form.espirometria === "POR PASAR" ? "text-red-600" : ""}
          />
          <InputTextArea
            label="Odontograma"
            name="odontograma"
            value={form.odontograma}
            disabled
            className={form.odontograma === "PASADO" ? "text-green-600" : form.odontograma === "POR PASAR" ? "text-red-600" : ""}
          />
          <InputTextArea
            label="Psicologia"
            name="psicologia"
            value={form.psicologia}
            disabled
            className={form.psicologia === "PASADO" ? "text-green-600" : form.psicologia === "POR PASAR" ? "text-red-600" : ""}
          />
          <InputTextArea
            label="Anexo 7D"
            name="anexo7D"
            value={form.anexo7D}
            disabled
            className={form.anexo7D === "PASADO" ? "text-green-600" : form.anexo7D === "POR PASAR" ? "text-red-600" : ""}
          />
          <InputTextArea
            label="Hist. Ocupacional"
            name="histOcupacional"
            value={form.histOcupacional}
            disabled
            className={form.histOcupacional === "PASADO" ? "text-green-600" : form.histOcupacional === "POR PASAR" ? "text-red-600" : ""}
          />
          <InputTextArea
            label="Ficha Ant. Patológicos"
            name="fichaAntPatologicos"
            value={form.fichaAntPatologicos}
            disabled
            className={form.fichaAntPatologicos === "PASADO" ? "text-green-600" : form.fichaAntPatologicos === "POR PASAR" ? "text-red-600" : ""}
          />
          <InputTextArea
            label="Cuestionario Nórdico"
            name="cuestionarioNordico"
            value={form.cuestionarioNordico}
            disabled
            className={form.cuestionarioNordico === "PASADO" ? "text-green-600" : form.cuestionarioNordico === "POR PASAR" ? "text-red-600" : ""}
          />
          <InputTextArea
            label="Cert. Trabajo Altura"
            name="certTrabajoAltura"
            value={form.certTrabajoAltura}
            disabled
            className={form.certTrabajoAltura === "PASADO" ? "text-green-600" : form.certTrabajoAltura === "POR PASAR" ? "text-red-600" : ""}
          />
          <InputTextArea
            label="Detención S.A.S"
            name="detencionSAS"
            value={form.detencionSAS}
            disabled
            className={form.detencionSAS === "PASADO" ? "text-green-600" : form.detencionSAS === "POR PASAR" ? "text-red-600" : ""}
          />
          <InputTextArea
            label="Consentimiento Dosaje"
            name="consentimientoDosaje"
            value={form.consentimientoDosaje}
            disabled
            className={form.consentimientoDosaje === "PASADO" ? "text-green-600" : form.consentimientoDosaje === "POR PASAR" ? "text-red-600" : ""}
          />
          <InputTextArea
            label="Ex. Rx Sanguineos"
            name="exRxSanguineos"
            value={form.exRxSanguineos}
            disabled
            className={form.exRxSanguineos === "PASADO" ? "text-green-600" : form.exRxSanguineos === "POR PASAR" ? "text-red-600" : ""}
          />
          <InputTextArea
            label="Perimetro Toraxico"
            name="perimetroToraxico"
            value={form.perimetroToraxico}
            disabled
            className={form.perimetroToraxico === "PASADO" ? "text-green-600" : form.perimetroToraxico === "POR PASAR" ? "text-red-600" : ""}
          />
          <InputTextArea
            label="Oftalmología"
            name="oftalmologia"
            value={form.oftalmologia}
            disabled
            className={form.oftalmologia === "PASADO" ? "text-green-600" : form.oftalmologia === "POR PASAR" ? "text-red-600" : ""}
          />
        </div>
      </div>

      {/* Sección de Impresión de Informes */}
      <div className="mt-6 bg-white border border-gray-200 rounded-lg p-3">
        <p className="font-semibold  mb-2">Imprimir Informes de Exámenes</p>
        <div className="flex flex-wrap gap-4">
          <button
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={() => handlePrint(1)}
          >
            Anexo 7C - N°1
          </button>
          <button
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={() => handlePrint(2)}
          >
            Anexo 7C - N°2
          </button>
        </div>
      </div>
    </div>
  );
}
