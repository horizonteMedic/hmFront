import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  InputCheckbox,
  InputsRadioGroup,
  InputTextArea,
  InputTextOneLine,
} from "../../../../../components/reusableComponents/ResusableComponents";
import { faBroom, faPrint, faSave } from "@fortawesome/free-solid-svg-icons";

export default function Resultados({
  form,
  setForm,
  handleChange,
  handleRadioButton,
  handleCheckBoxChange,
  handlePrint,
  handleSave,
  handleClear,
}) {
  // Array de médicos para autocompletado
  const MedicosMulti = [
    { id: 1, mensaje: "Dr. Juan Pérez" },
    { id: 2, mensaje: "Dra. María García" },
    { id: 3, mensaje: "Dr. Carlos López" },
    { id: 4, mensaje: "Dra. Ana Martínez" },
    { id: 5, mensaje: "Dr. Luis Rodríguez" },
    { id: 6, mensaje: "Dra. Carmen Sánchez" },
    { id: 7, mensaje: "Dr. Pedro González" },
    { id: 8, mensaje: "Dra. Laura Fernández" },
  ];

  // Función para manejar la búsqueda de médicos
  const handleNombreMedicoSearch = (e) => {
    const value = e.target.value;
    setForm((prev) => ({
      ...prev,
      nombre_medico: value,
      filteredNombresMedicos: value
        ? MedicosMulti.filter((medico) =>
            medico.mensaje.toLowerCase().includes(value.toLowerCase())
          )
        : [],
    }));
  };

  // Función para seleccionar un médico
  const handleSelectNombreMedico = (medico) => {
    setForm((prev) => ({
      ...prev,
      nombre_medico: medico.mensaje,
      filteredNombresMedicos: [],
    }));
  };
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
    
      {/* Primera fila - 3 grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-6">
        

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

      {/* Apto para Trabajar y Operaciones - 2 columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-6">
        {/* Columna 1 - Apto para Trabajar */}
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <h4 className="font-semibold text-gray-800 mb-2">Apto para Trabajar</h4>
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
          
          {/* Médico que Certifica */}
          <div className="mt-4">
            <label className="block font-semibold mb-1">
              Medico que Certifica:
            </label>
            <div className="relative flex-grow flex items-center">
              <input
                id="nombre_medico"
                name="nombre_medico"
                type="text"
                autoComplete="off"
                value={form.nombre_medico || ""}
                onChange={handleNombreMedicoSearch}
                className="border rounded px-2 py-1 w-full"
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    form.filteredNombresMedicos.length > 0
                  ) {
                    e.preventDefault();
                    handleSelectNombreMedico(form.filteredNombresMedicos[0]);
                  }
                }}
                onFocus={() => {
                  if (form.nombre_medico) {
                    setForm((prev) => ({
                      ...prev,
                      filteredNombresMedicos: MedicosMulti.filter((emp) =>
                        emp.mensaje
                          .toLowerCase()
                          .includes(form.nombre_medico.toLowerCase())
                      ),
                    }));
                  }
                }}
                onBlur={() =>
                  setTimeout(
                    () =>
                      setForm((prev) => ({
                        ...prev,
                        filteredNombresMedicos: [],
                      })),
                    100
                  )
                }
              />
              {form.nombre_medico && form.filteredNombresMedicos.length > 0 && (
                <ul className="absolute inset-x-0 top-full bg-white border border-gray-300 rounded max-h-40 overflow-y-auto z-10">
                  {form.filteredNombresMedicos.map((medico) => (
                    <li
                      key={medico.id}
                      className="cursor-pointer px-3 py-2 hover:bg-gray-100"
                      onMouseDown={() => handleSelectNombreMedico(medico)}
                    >
                      {medico.mensaje}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Columna 2 - Operaciones */}
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <p className="font-semibold text-gray-800 mb-2">Imprimir Informes de Exámenes</p>
          {/* BOTONES DE ACCIÓN */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleSave}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-base px-6 py-2 rounded flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faSave} /> Guardar/Actualizar
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="bg-yellow-400 hover:bg-yellow-500 text-white text-base px-6 py-2 rounded flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faBroom} /> Limpiar
              </button>
            </div>
            <div className="flex flex-col items-end">
              <span className="font-bold italic text-base mb-1">IMPRIMIR</span>
              <div className="flex items-center gap-2">
                <input
                  name="norden"
                  value={form.norden}
                  onChange={handleChange}
                  className="border rounded px-2 py-1 text-base w-24"
                />

                <button
                  type="button"
                  onClick={handlePrint}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-base px-4 py-2 rounded flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faPrint} />
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

    </div>
  );
}
