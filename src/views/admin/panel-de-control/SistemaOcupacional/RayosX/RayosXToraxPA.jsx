import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faBroom, faComments } from "@fortawesome/free-solid-svg-icons";
import {
  GetInfoServicio,
  getInfoTabla,
  Loading,
  PrintConsultaEjecutada,
  PrintHojaR,
  SubmitDataService,
  VerifyTR,
} from "./controllerRayoxXToraxPA";
import Swal from "sweetalert2";
import { useSessionData } from "../../../../hooks/useSessionData";
import { useForm } from "../../../../hooks/useForm";

const tabla = "radiografia_torax";
const date = new Date();
const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
  2,
  "0"
)}-${String(date.getDate()).padStart(2, "0")}`;
const initialFormState = {
  norden: "",
  codRat: null,
  fechaExam: today,
  edad: "",
  nombres: "",

  vertices: "LIBRES",
  hilios: "NORMALES",
  senosCostofrenicos: "LIBRES",
  camposPulmonares: "NORMALES",
  tramaBroncovascular: false,
  mediastinos: "NORMALES",
  siluetaCardiovascular: "NORMAL",
  osteomuscular: "NORMAL",
  conclusiones: "NORMAL",
  observaciones: "NORMAL",

  nombres_search: "",
  codigo_search: "",
  fechaDesde: today,
  fechaHasta: today,
};

export default function RayosXToraxPA() {
  const [dataTabla, setDataTabla] = useState([]);
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
  const { token, userlogued, selectedSede, datosFooter, userCompleto } =
    useSessionData();

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      handleClearnotO();
      VerifyTR(form.norden, tabla, token, setForm, selectedSede);
    }
  };

  const handleSave = () => {
    SubmitDataService(form, token, userlogued, handleClear, tabla, datosFooter);
  };

  const handleEjecutarConsulta = () => {
    Swal.fire({
      title: "¿Desea Imprimir Consulta?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, Imprimir",
      cancelButtonText: "Cancelar",
      customClass: {
        title: "swal2-title",
        confirmButton: "swal2-confirm",
        cancelButton: "swal2-cancel",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        PrintConsultaEjecutada(
          form.fechaDesde,
          form.fechaHasta,
          token,
          datosFooter
        );
      }
    });
  };

  const obtenerInfoTabla = () => {
    getInfoTabla(form.nombres_search, form.codigo_search, setDataTabla, token);
  };

  useEffect(() => {
    obtenerInfoTabla();
  }, []);

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Columna izquierda: Formulario */}
      <div className=" w-full xl:w-1/2 text-black flex-1">
        <form className="space-y-6">
          <div className="border p-4 rounded space-y-3">
            <div className="flex items-center gap-4">
              <label className="font-semibold max-w-[150px] min-w-[150px] ">
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
            <div className="flex gap-3 xl:gap-8 w-full flex-col xl:flex-row">
              <div className="flex items-center gap-4">
                <label className="font-semibold max-w-[150px] min-w-[150px]">
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
              <div className="flex items-center gap-4 w-full">
                <label className="font-semibold max-w-[150px] min-w-[150px] xl:max-w-[50px] xl:min-w-[50px]">
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

            <div className="flex items-center gap-4">
              <label className="font-semibold max-w-[150px] min-w-[150px]">
                Nombres :
              </label>
              <input
                className="border rounded px-2 py-1 w-full"
                name="nombres"
                value={form.nombres || ""}
                disabled
              />
            </div>
          </div>
          <div className="border p-4 rounded space-y-3">
            <div className="flex items-center gap-4">
              <label className="font-semibold max-w-[150px] min-w-[150px]">
                Vértices :
              </label>
              <input
                className="border rounded px-2 py-1 w-full"
                name="vertices"
                value={form.vertices || ""}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="font-semibold max-w-[150px] min-w-[150px]">
                Hilios :
              </label>
              <input
                className="border rounded px-2 py-1 w-full"
                name="hilios"
                value={form.hilios || ""}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="font-semibold max-w-[150px] min-w-[150px]">
                Senos Costofrénicos :
              </label>
              <input
                className="border rounded px-2 py-1 w-full"
                name="senosCostofrenicos"
                value={form.senosCostofrenicos || ""}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="font-semibold max-w-[150px] min-w-[150px]">
                Campos Pulmonares :
              </label>
              <input
                className="border rounded px-2 py-1 w-full"
                name="camposPulmonares"
                value={form.camposPulmonares || ""}
                onChange={handleChange}
              />
            </div>
            <label className="flex gap-2 font-semibold ml-[168px]">
              <input
                type="checkbox"
                name="tramaBroncovascular"
                checked={
                  form.camposPulmonares ==
                  "Trama Broncovascular Acentuada en ACP".toUpperCase()
                }
                onChange={(e) => {
                  handleCheckBoxChange(e);
                  setForm((prev) => ({
                    ...prev,
                    camposPulmonares: e.target.checked
                      ? "Trama Broncovascular Acentuada en ACP".toUpperCase()
                      : "",
                  }));
                }}
              />
              Trama Broncovascular Acentuada en ACP
            </label>
            <div className="flex items-center gap-4">
              <label className="font-semibold max-w-[150px] min-w-[150px]">
                Campos Mediastinos :
              </label>
              <input
                className="border rounded px-2 py-1 w-full"
                name="mediastinos"
                value={form.mediastinos || ""}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="font-semibold max-w-[150px] min-w-[150px]">
                Silueta Cardiovascular :
              </label>
              <input
                className="border rounded px-2 py-1 w-full"
                name="siluetaCardiovascular"
                value={form.siluetaCardiovascular || ""}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="font-semibold max-w-[150px] min-w-[150px]">
                Osteomuscular :
              </label>
              <input
                className="border rounded px-2 py-1 w-full"
                name="osteomuscular"
                value={form.osteomuscular || ""}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="font-semibold max-w-[150px] min-w-[150px]">
                Conclusiones Radiográficas :
              </label>
              <input
                className="border rounded px-2 py-1 w-full"
                name="conclusiones"
                value={form.conclusiones || ""}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="font-semibold max-w-[150px] min-w-[150px]">
                Observaciones :
              </label>
              <textarea
                className="border rounded px-2 py-1 w-full resize-none"
                name="observaciones"
                rows={3}
                value={form.observaciones || ""}
                onChange={handleChange}
              />
            </div>
            <label className="flex gap-2 font-semibold ml-[168px]">
              <input
                type="checkbox"
                checked={form.observaciones == "EVALUACIÓN ANUAL"}
                onChange={(e) => {
                  setForm((prev) => ({
                    ...prev,
                    observaciones: e.target.checked ? "EVALUACIÓN ANUAL" : "",
                  }));
                }}
              />
              EVALUACIÓN ANUAL
            </label>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4  pt-2">
              <div className=" flex gap-4">
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
            </div>
          </div>
        </form>
      </div>
      {/* Columna derecha: Panel de historial/búsqueda */}

      <div className="border rounded p-4 flex flex-col flex-1">
        <p className="mb-2 font-semibold">Informe de Examen</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3 items-center justify-center w-full">
          <div>
            <label className="font-semibold">Nombre :</label>
            <input
              className="border rounded px-2 py-1 w-full"
              name="nombres_search"
              value={form.nombres_search}
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  obtenerInfoTabla();
                }
              }}
              onChange={(e) => {
                const { name, value } = e.target;
                setForm((f) => ({ ...f, [name]: value, codigo_search: "" }));
              }}
            />
          </div>
          <div>
            <label className="font-semibold ml-2">Codigo:</label>
            <input
              className="border rounded px-2 py-1  w-full"
              name="codigo_search"
              value={form.codigo_search}
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  obtenerInfoTabla();
                }
              }}
              onChange={(e) => {
                const { name, value } = e.target;
                if (/^[\d/]*$/.test(value)) {
                  setForm((f) => ({
                    ...f,
                    [name]: value,
                    nombres_search: "",
                  }));
                }
              }}
            />
          </div>
        </div>
        <div className="flex-1">
          <Table
            data={dataTabla}
            tabla={tabla}
            set={setForm}
            token={token}
            clean={handleClear}
            datosFooter={datosFooter}
          />
        </div>

        <div className="rounded-md  space-y-4">
          <div>
            <p className="mb-2 font-semibold">Reportes por Fechas</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <label className="font-semibold">Fecha desde :</label>
                <input
                  name="fechaDesde"
                  type="date"
                  value={form.fechaDesde}
                  onChange={handleChange}
                  className="border rounded px-2 py-1 w-full"
                />
              </div>
              <div>
                <label className="font-semibold">Fecha hasta :</label>
                <input
                  name="fechaHasta"
                  type="date"
                  value={form.fechaHasta}
                  onChange={handleChange}
                  className="border rounded px-2 py-1 w-full"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleEjecutarConsulta}
              className="bg-blue-500 hover:bg-blue-600 text-white text-base px-6 py-2 rounded flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faComments} /> Ejecutar Consulta
            </button>
          </div>
        </div>
        <div className="space-y-3">
          <label className="flex gap-2 font-semibold ">
            <input
              type="checkbox"
              checked={form.observaciones == "NO SE TOMÓ RADIOGRAFIA DE TÓRAX"}
              onChange={(e) => {
                // handleCheckBoxChange(e);
                const texto = e.target.checked
                  ? "NO SE TOMÓ RADIOGRAFIA DE TÓRAX"
                  : "";

                setForm((prev) => ({
                  ...prev,
                  vertices: texto,
                  hilios: texto,
                  senosCostofrenicos: texto,
                  camposPulmonares: texto,
                  mediastinos: texto,
                  siluetaCardiovascular: texto,
                  osteomuscular: texto,
                  conclusiones: texto,
                  observaciones: texto,
                }));
              }}
            />
            NO SE TOMO RADIOGRAFIA DE TORAX
          </label>
          <label className="flex gap-2 font-semibold ">
            <input
              type="checkbox"
              checked={form.observaciones == "EVALUACIÓN POR NEUMOLOGÍA"}
              onChange={(e) => {
                // handleCheckBoxChange(e);
                setForm((prev) => ({
                  ...prev,
                  observaciones: e.target.checked
                    ? "EVALUACIÓN POR NEUMOLOGÍA"
                    : "",
                }));
              }}
            />
            EVALUACIÓN POR NEUMOLOGÍA
          </label>
        </div>
      </div>
    </div>
  );
}
function Table({ data, tabla, set, token, clean, datosFooter }) {
  // confirmación antes de imprimir
  const handlePrintConfirm = (nro) => {
    Swal.fire({
      title: "Confirmar impresión",
      text: `¿Deseas imprimir la ficha Nº ${nro}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, imprimir",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        PrintHojaR(nro, token, tabla, datosFooter);
      }
    });
  };

  function clicktable(nro) {
    clean();
    Loading("Importando Datos");
    GetInfoServicio(nro, tabla, set, token, () => {
      Swal.close();
    });
  }
  function convertirFecha(fecha) {
    if (fecha == null || fecha === "") return "";
    const [dia, mes, anio] = fecha.split("-");
    return `${anio}/${mes.padStart(2, "0")}/${dia.padStart(2, "0")}`;
  }

  return (
    <div className="overflow-y-auto mb-4 h-[280px]">
      <table className="w-full table-auto border-collapse ">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1 text-left text-lg">N° Orden</th>
            <th className="border px-2 py-1 text-left text-lg">Nombres</th>
            <th className="border px-2 py-1 text-left text-lg">Fecha</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, i) => (
              <tr
                key={i}
                className={`hover:bg-[#233245] hover:text-white cursor-pointer text-lg `}
                onClick={() => clicktable(row.norden)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  handlePrintConfirm(row.norden);
                }}
              >
                <td className="border px-2 py-1 font-bold">
                  {row.norden || ""}
                </td>
                <td className="border px-2 py-1">{row.nombres || ""}</td>
                <td className="border px-2 py-1">
                  {convertirFecha(row.fechaOd)}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={5}
                className="text-center py-4 text-gray-500 text-lg"
              >
                No hay datos
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
