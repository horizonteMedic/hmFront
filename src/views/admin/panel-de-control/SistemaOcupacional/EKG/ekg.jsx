import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBroom,
  faSave,
  faTimes,
  faClipboard,
  faSearch,
  faPrint,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { useSessionData } from "../../../../hooks/useSessionData";
import { useForm } from "../../../../hooks/useForm";

const date = new Date();
const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
  2,
  "0"
)}-${String(date.getDate()).padStart(2, "0")}`;

const initialFormState = {
  norden: "",
  nombre: "",
  edad: "",
  fechaNac: "",
  fechaExam: today,
  empresaContratista: "",
  empresa: "",

  ritmo: "1",
  fc: "2",
  eje: "3",
  pr: "4",
  qrs: "5",
  ondaP: "6",
  st: "7",
  qt: "8",
  ondaT: "9",

  observaciones: "",
  conclusiones: "",
  hallazgos: "",
  recomendaciones: "",

  nombres_search: "",
  codigo_search: "",
};

export default function EKG() {
  const { token, userlogued, selectedSede, datosFooter, userCompleto } =
    useSessionData();

  const {
    form,
    setForm,
    handleChange,
    handleChangeNumber,
    handleRadioButton,
    handleCheckBoxChange,
    handleClear,
    handleClearnotO,
    handlePrintDefault,
  } = useForm(initialFormState);

  const [dataTabla, setDataTabla] = useState([]);

  const handleSave = () => {};

  const handleSearch = () => {};

  return (
    <div className="w-full   p-4 text-[11px]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PANEL IZQUIERDO - FORMULARIO DE DATOS */}

        <div className="border rounded shadow-md p-6">
          {/* SECCIÓN SUPERIOR - FILIACIÓN */}
          <div className="space-y-4 p-4 rounded border">
            {/* Fila 1: N° Orden */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-4">
                <label className="font-semibold min-w-[80px] max-w-[80px] ">
                  N° Orden :
                </label>
                <input
                  className="border rounded px-2 py-1 w-full"
                  name="norden"
                  value={form.norden || ""}
                  onKeyUp={handleSearch}
                  onChange={handleChangeNumber}
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="font-semibold min-w-[80px] max-w-[80px]">
                  Fecha Examen :
                </label>
                <input
                  type="date"
                  className="border rounded px-2 py-1 w-full"
                  name="fechaExam"
                  value={form.fechaExam || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <label className="font-semibold min-w-[80px] max-w-[80px]">
                Nombres :
              </label>
              <input
                className="border rounded px-2 py-1 w-full"
                name="nombres"
                value={form.nombres || ""}
                disabled
              />
            </div>

            {/* Fila 2: Nombres y Edad */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-4">
                <label className="font-semibold min-w-[80px] max-w-[80px]">
                  Fecha de Nacimiento :
                </label>
                <input
                  type="text"
                  className="border rounded px-2 py-1 w-full"
                  value={form.fechaNac || ""}
                  name="fechaNac"
                  disabled
                />
              </div>
              <div className="flex items-center gap-4 w-full">
                <label className="font-semibold min-w-[80px] max-w-[80px]">
                  Edad :
                </label>
                <input
                  className="border rounded px-2 py-1 w-full"
                  name="edad"
                  value={form.edad || ""}
                  disabled
                />
              </div>
            </div>
            {/* INFORMACIÓN DE EMPRESA */}
            <div className="flex items-center gap-4">
              <label className="font-semibold min-w-[80px] max-w-[80px]">
                Contrata :
              </label>
              <input
                className="border rounded px-2 py-1 w-full"
                name="contrata"
                value={form.contrata || ""}
                disabled
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="font-semibold min-w-[80px] max-w-[80px]">
                Empresa :
              </label>
              <input
                className="border rounded px-2 py-1 w-full"
                name="empresa"
                value={form.empresa || ""}
                disabled
              />
            </div>
          </div>
          <div className="space-y-3 rounded border p-4 mt-3 bg-white">
            {/* PARÁMETROS EKG */}
            <h3 className="font-bold text-lg  text-blue-900 mb-3">
              Parámetros EKG
            </h3>
            {/* Checkboxes de parámetros */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 ">
              <label className="flex gap-2 font-semibold">
                <input
                  type="checkbox"
                  checked={form.ritmo === "SINUSAL"}
                  onChange={handleCheckBoxChange}
                />
                <span>Ritmo: Sinusal</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.pr === "0.20"}
                  onChange={() => setForm((prev) => ({ ...prev, pr: "0.20" }))}
                />
                <span>P.R: 0.20</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.qtc === "N/E"}
                  onChange={() => setForm((prev) => ({ ...prev, qtc: "N/E" }))}
                />
                <span>Q.T.C.: N/E</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.qrs === "0.08"}
                  onChange={() => setForm((prev) => ({ ...prev, qrs: "0.08" }))}
                />
                <span>Q.R.S.: 0.08</span>
              </label>
            </div>
            {/* Campos de entrada */}
            <div className="grid grid-cols-2 md:grid-cols-3  space-y-3 gap-x-4">
              {/** Fila 1 */}
              <div className="flex items-center gap-4">
                <label className="font-semibold min-w-[80px] max-w-[80px]">
                  Ritmo:
                </label>
                <input
                  className="border rounded px-2 py-1 w-full"
                  name="ritmo"
                  value={form.ritmo ?? ""}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="font-semibold min-w-[80px] max-w-[80px]">
                  F.C. (x min):
                </label>
                <input
                  className="border rounded px-2 py-1 w-full"
                  name="fc"
                  value={form.fc ?? ""}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="font-semibold min-w-[80px] max-w-[80px]">
                  Eje (°):
                </label>
                <input
                  className="border rounded px-2 py-1 w-full"
                  name="pr"
                  value={form.pr ?? ""}
                  onChange={handleChange}
                />
              </div>

              {/** Fila 2 */}
              <div className="flex items-center gap-4">
                <label className="font-semibold min-w-[80px] max-w-[80px]">
                  P.R.:
                </label>
                <input
                  className="border rounded px-2 py-1 w-full"
                  name="pr"
                  value={form.pr ?? ""}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="font-semibold min-w-[80px] max-w-[80px]">
                  Q.R.S.:
                </label>
                <input
                  className="border rounded px-2 py-1 w-full"
                  name="qrs"
                  value={form.qrs ?? ""}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="font-semibold min-w-[80px] max-w-[80px]">
                  Onda P:
                </label>
                <input
                  className="border rounded px-2 py-1 w-full"
                  name="ondaP"
                  value={form.ondaP ?? ""}
                  onChange={handleChange}
                />
              </div>

              {/** Fila 3 */}
              <div className="flex items-center gap-4">
                <label className="font-semibold min-w-[80px] max-w-[80px]">
                  S.T.:
                </label>
                <input
                  className="border rounded px-2 py-1 w-full"
                  name="st"
                  value={form.st ?? ""}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="font-semibold min-w-[80px] max-w-[80px]">
                  Q.T.:
                </label>
                <input
                  className="border rounded px-2 py-1 w-full"
                  name="qt"
                  value={form.qt ?? ""}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="font-semibold min-w-[80px] max-w-[80px]">
                  Onda T.:
                </label>
                <input
                  className="border rounded px-2 py-1 w-full"
                  name="ondaT"
                  value={form.ondaT ?? ""}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* HALLAZGO Y RECOMENDACIONES */}
            <h3 className="font-bold text-lg mt-5 mb-4 text-blue-900">
              Observaciones y Conclusiones
            </h3>

            <div className="space-y-3">
              <div>
                <label className="font-semibold block mb-2">
                  Observaciones:
                </label>
                <textarea
                  className="border rounded px-3 py-2 w-full h-24 resize-none"
                  name="observaciones"
                  value={form.observaciones}
                  onChange={handleChange}
                  placeholder="Describa los hallazgos del EKG..."
                />
              </div>
              {/* Checkboxes de hallazgos */}
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                <label className="flex  gap-2">
                  <input
                    type="checkbox"
                    name="normal"
                    checked={form.normal}
                    onChange={handleChange}
                  />
                  <span>Normal</span>
                </label>
                <label className="flex gap-2">
                  <input
                    type="checkbox"
                    name="bradicardiaSinusalFisiologica"
                    checked={form.bradicardiaSinusalFisiologica}
                    onChange={handleChange}
                  />
                  <span>B.S. Fisiológica</span>
                </label>
                <label className="flex gap-2">
                  <input
                    type="checkbox"
                    name="bradicardiaSinusalAsintomatica"
                    checked={form.bradicardiaSinusalAsintomatica}
                    onChange={handleChange}
                  />
                  <span>B.S. Asintomática</span>
                </label>
                <label className="flex gap-2">
                  <input
                    type="checkbox"
                    name="bloqueoRamaDerecha"
                    checked={form.bloqueoRamaDerecha}
                    onChange={handleChange}
                  />
                  <span>B.I. Rama Derecha</span>
                </label>
                <label className="flex gap-2">
                  <input
                    type="checkbox"
                    name="desviacionEjeCardiacoIzquierda"
                    checked={form.desviacionEjeCardiacoIzquierda}
                    onChange={handleChange}
                  />
                  <span>D.I. Eje Cardíaco</span>
                </label>
                <label className="flex gap-2">
                  <input
                    type="checkbox"
                    name="desviacionEjeCardiacoDerecha"
                    checked={form.desviacionEjeCardiacoDerecha}
                    onChange={handleChange}
                  />
                  <span>D.D. Eje Cardíaco</span>
                </label>
              </div>

              <div>
                <label className="font-semibold block mb-2">
                  Conclusiones:
                </label>
                <textarea
                  className="border rounded px-3 py-2 w-full h-24 resize-none"
                  name="conclusiones"
                  value={form.conclusiones}
                  onChange={handleChange}
                  placeholder="Conclusiones de EKG..."
                />
              </div>

              <div>
                <label className="font-semibold block mb-2">Hallazgos:</label>
                <textarea
                  className="border rounded px-3 py-2 w-full h-24 resize-none"
                  name="hallazgos"
                  value={form.hallazgos}
                  onChange={handleChange}
                  placeholder="Hallazgos de EKG..."
                />
              </div>

              <div>
                <label className="font-semibold block mb-2">
                  Recomendaciones:
                </label>
                <textarea
                  className="border rounded px-3 py-2 w-full h-24 resize-none"
                  name="recomendaciones"
                  value={form.recomendaciones}
                  onChange={handleChange}
                  placeholder="Describa las recomendaciones..."
                />
              </div>

              {/* Checkboxes de recomendaciones */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="evaluacionAnual"
                    checked={form.evaluacionAnual}
                    onChange={handleChange}
                  />
                  <span>Evaluación Anual</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="evaluacion6Meses"
                    checked={form.evaluacion6Meses}
                    onChange={handleChange}
                  />
                  <span>Ev. en 6 Meses</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="evaluacionCardiologo"
                    checked={form.evaluacionCardiologo}
                    onChange={handleChange}
                  />
                  <span>Ev. por Cardiólogo</span>
                </label>
              </div>
            </div>
          </div>
          {/* BOTONES DE ACCIÓN */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4  px-4 pt-4">
            <div className=" flex gap-4">
              <button
                type="button"
                // onClick={handleSave}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-base px-6 py-2 rounded flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faSave} /> Guardar/Actualizar
              </button>
              <button
                type="button"
                // onClick={handleClear}
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
                  // onClick={handlePrint}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-base px-4 py-2 rounded flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faPrint} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* PANEL DERECHO - BÚSQUEDA Y RESULTADOS */}
        <div className="border rounded shadow-md p-6">
          {/* BÚSQUEDA DE INFORMES */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-bold text-lg mb-4 text-blue-900">
              Buscar Informe
            </h3>
            <p className="text-gray-600 mb-4">
              1 Clic para Editar | 2 Para Crear Informe y volver a Imprimir
            </p>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 flex-1">
                <label className="font-semibold min-w-[60px]">Buscar:</label>
                <input
                  className="border rounded px-3 py-2 flex-1"
                  // value={searchTerm}
                  // onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Término de búsqueda"
                />
              </div>

              <div className="flex items-center gap-3 flex-1">
                <label className="font-semibold min-w-[60px]">Código:</label>
                <input
                  className="border rounded px-3 py-2 flex-1"
                  // value={searchCode}
                  // onChange={(e) => setSearchCode(e.target.value)}
                  placeholder="Código del informe"
                />
              </div>

              <button
                onClick={handleSearch}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex-shrink-0"
              >
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </div>
            <div className="overflow-x-auto mt-5">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-3 py-2 text-left font-semibold">
                      Cod
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left font-semibold">
                      N.Orden
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left font-semibold">
                      Nombre
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left font-semibold">
                      Fecha
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dataTabla.map((item, index) => (
                    <tr
                      key={index}
                      className="hover:bg-blue-50 cursor-pointer"
                      // onClick={() => handleEdit(item)}
                    >
                      <td className="border border-gray-300 px-3 py-2">
                        {item.codigo}
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        {item.norden}
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        {item.nombre}
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        {item.fecha}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* DIAGRAMA DEL EJE CARDÍACO */}
          <div className="bg-white rounded border p-6">
            <h3 className="font-bold text-lg mb-4 text-blue-900">
              Diagrama del Eje Cardíaco
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
