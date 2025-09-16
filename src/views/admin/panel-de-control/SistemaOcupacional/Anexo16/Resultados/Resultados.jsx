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
        Resultados del Examen Ocupacional - Anexo 16
      </h3>

      {/* Primera fila - 3 grids */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-6">
        {/* Grupo Sanguíneo */}
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <h4 className="font-semibold text-gray-800 mb-2">Grupo Sanguíneo</h4>
          <div className="space-y-2">
            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Tipo:</label>
              <InputsRadioGroup
                name="grupoSanguineo"
                value={form.grupoSanguineo}
                onChange={handleRadioButton}
                options={[
                  { label: "O", value: "O" },
                  { label: "A", value: "A" },
                  { label: "B", value: "B" },
                  { label: "AB", value: "AB" },
                ]}
              />
            </div>
            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Rh:</label>
              <InputsRadioGroup
                name="rhFactor"
                value={form.rhFactor}
                onChange={handleRadioButton}
                options={[
                  { label: "Rh(+)", value: "positivo" },
                  { label: "Rh(-)", value: "negativo" },
                ]}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="font-semibold min-w-[80px]">Glucosa</label>
                <input
                  type="text"
                  className="border rounded px-2 py-1 flex-1"
                  name="glucosa"
                  value={form.glucosa}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="font-semibold min-w-[80px]">Creatinina</label>
                <input
                  type="text"
                  className="border rounded px-2 py-1 flex-1"
                  name="creatinina"
                  value={form.creatinina}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="font-semibold min-w-[80px]">Coca</label>
                <input
                  type="text"
                  className="border rounded px-2 py-1 flex-1"
                  name="coca"
                  value={form.coca}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="font-semibold min-w-[80px]">Marih.</label>
                <input
                  type="text"
                  className="border rounded px-2 py-1 flex-1"
                  name="marihuana"
                  value={form.marihuana}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="font-semibold min-w-[80px]">Hemoglobina/Hematocrito</label>
                <input
                  type="text"
                  className="border rounded px-2 py-1 flex-1"
                  name="hemoglobinaHematocrito"
                  value={form.hemoglobinaHematocrito}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="font-semibold min-w-[80px]">V.S.G</label>
                <input
                  type="text"
                  className="border rounded px-2 py-1 flex-1"
                  name="vsg"
                  value={form.vsg}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Exámen Químico */}
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <h4 className="font-semibold text-gray-800 mb-2">Exámen Químico</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="font-semibold min-w-[80px]">Nitritos</label>
              <input
                type="text"
                className="border rounded px-2 py-1 flex-1"
                name="nitritos"
                value={form.nitritos}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="font-semibold min-w-[80px]">Proteínas</label>
              <input
                type="text"
                className="border rounded px-2 py-1 flex-1"
                name="proteinas"
                value={form.proteinas}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="font-semibold min-w-[80px]">Cetonas</label>
              <input
                type="text"
                className="border rounded px-2 py-1 flex-1"
                name="cetonas"
                value={form.cetonas}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="font-semibold min-w-[80px]">Leucocitos</label>
              <input
                type="text"
                className="border rounded px-2 py-1 flex-1"
                name="leucocitos"
                value={form.leucocitos}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="font-semibold min-w-[80px]">Urobilinogeno</label>
              <input
                type="text"
                className="border rounded px-2 py-1 flex-1"
                name="urobilinogeno"
                value={form.urobilinogeno}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="font-semibold min-w-[80px]">Bilirrubina</label>
              <input
                type="text"
                className="border rounded px-2 py-1 flex-1"
                name="bilirrubina"
                value={form.bilirrubina}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="font-semibold min-w-[80px]">Glucosa</label>
              <input
                type="text"
                className="border rounded px-2 py-1 flex-1"
                name="glucosaQuimico"
                value={form.glucosaQuimico}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="font-semibold min-w-[80px]">Sangre</label>
              <input
                type="text"
                className="border rounded px-2 py-1 flex-1"
                name="sangre"
                value={form.sangre}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Sedimento Unitario */}
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <h4 className="font-semibold text-gray-800 mb-2">Sedimento Unitario</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="font-semibold min-w-[80px]">Leucocitos</label>
              <input
                type="text"
                className="border rounded px-2 py-1 flex-1"
                name="leucocitosSedimento"
                value={form.leucocitosSedimento}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="font-semibold min-w-[80px]">Cel.Epiteliales</label>
              <input
                type="text"
                className="border rounded px-2 py-1 flex-1"
                name="celulasEpiteliales"
                value={form.celulasEpiteliales}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="font-semibold min-w-[80px]">Cilindios</label>
              <input
                type="text"
                className="border rounded px-2 py-1 flex-1"
                name="cilindios"
                value={form.cilindios}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="font-semibold min-w-[80px]">Bacterías</label>
              <input
                type="text"
                className="border rounded px-2 py-1 flex-1"
                name="bacterias"
                value={form.bacterias}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="font-semibold min-w-[80px]">Hematies</label>
              <input
                type="text"
                className="border rounded px-2 py-1 flex-1"
                name="hematies"
                value={form.hematies}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="font-semibold min-w-[80px]">Cristales</label>
              <input
                type="text"
                className="border rounded px-2 py-1 flex-1"
                name="cristales"
                value={form.cristales}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="font-semibold min-w-[80px]">Pus</label>
              <input
                type="text"
                className="border rounded px-2 py-1 flex-1"
                name="pus"
                value={form.pus}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="font-semibold min-w-[80px]">Otros</label>
              <input
                type="text"
                className="border rounded px-2 py-1 flex-1"
                name="otrosSedimento"
                value={form.otrosSedimento}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Segunda fila - 2 grids: Examen Físico + Otros Exámenes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-6">
        {/* Exámen Físico */}
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <h4 className="font-semibold text-gray-800 mb-2">Exámen Físico</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
              <label className="font-semibold min-w-[60px]">Color</label>
              <input
                type="text"
                className="border rounded px-2 py-1 flex-1"
                name="colorFisico"
                value={form.colorFisico}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="font-semibold min-w-[60px]">Aspecto</label>
              <input
                type="text"
                className="border rounded px-2 py-1 flex-1"
                name="aspectoFisico"
                value={form.aspectoFisico}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="font-semibold min-w-[60px]">Densidad</label>
              <input
                type="text"
                className="border rounded px-2 py-1 flex-1"
                name="densidadFisico"
                value={form.densidadFisico}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="font-semibold min-w-[60px]">PH</label>
              <input
                type="text"
                className="border rounded px-2 py-1 flex-1"
                name="phFisico"
                value={form.phFisico}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Otros Exámenes */}
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <h4 className="font-semibold text-gray-800 mb-2">Otros Exámenes</h4>
          <InputTextArea
            rows={4}
            name="otrosExamenes"
            value={form.otrosExamenes}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Apto para Trabajar */}
      <div className="mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <h4 className="font-semibold text-gray-800 mb-2">Apto para Trabajar</h4>
          <div className="flex items-center gap-4">
            <InputsRadioGroup
              name="aptoParaTrabajar"
              value={form.aptoParaTrabajar}
              onChange={handleRadioButton}
              options={[
                { label: "SI", value: "si" },
                { label: "NO", value: "no" },
                { label: "Reevaluación", value: "reevaluacion" },
              ]}
            />
            <div className="ml-auto">
              <h5 className="font-semibold text-gray-700 mb-2">Operaciones</h5>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                  Agregar/Actualizar
                </button>
                <button className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700">
                  Limpiar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Primera fila - 2 columnas */}
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
          <button
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={() => handlePrint(1)}
          >
            Anexo 16 - N°1
          </button>
          <button
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={() => handlePrint(2)}
          >
            Anexo 16 - N°2
          </button>
        </div>
      </div>
    </div>
  );
}
