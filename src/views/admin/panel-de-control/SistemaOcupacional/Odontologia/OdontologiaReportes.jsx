import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments } from "@fortawesome/free-solid-svg-icons";

const OdontologiaReportes = ({
  form,
  setForm,
  handleChange,
  handleCheckBoxChange,
}) => {
  const [dataTabla, setDataTabla] = useState([]);

  return (
    <div className="w-full  ">
      <div className="flex gap-2 w-full ">
        {/* IZQUIERDA 50% */}
        <div className="w-1/2 bg-white rounded border space-y-6">
          <div className="rounded-md p-4 space-y-4">
            <div>
              <p className="mb-2 font-semibold">Buscar por fechas</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold">Fecha de Examen :</label>
                  <input
                    name="fechaDesde"
                    type="date"
                    value={form.fechaDesde}
                    onChange={handleChange}
                    className="border rounded px-2 py-1 w-full"
                  />
                </div>
                <div>
                  <label className="font-semibold">Fecha de Examen :</label>
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

            <div>
              <p className="mb-2 font-semibold"> Filtrar por:</p>
              <div className="flex items-center gap-6">
                <label className=" flex items-center gap-2 font-medium cursor-pointer pl-2 text-[10px]">
                  <input
                    type="checkbox"
                    name="filtroOcupacional"
                    checked={form.filtroOcupacional}
                    onChange={handleCheckBoxChange}
                  />
                  Ocupacionales
                </label>
                <label className="flex items-center gap-2 font-medium cursor-pointer pl-2 text-[10px]">
                  <input
                    type="checkbox"
                    name="filtroClientesConsulta"
                    checked={form.filtroClientesConsulta}
                    onChange={handleCheckBoxChange}
                  />
                  Clientes Consulta
                </label>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                // onClick={handleClear}
                className="bg-blue-500 hover:bg-blue-600 text-white text-base px-6 py-2 rounded flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faComments} /> Ejecutar Consulta
              </button>
            </div>
          </div>
        </div>

        {/* DERECHA 50% */}
        <div className="border rounded p-4 flex flex-col flex-1">
          <p className="mb-2 font-semibold">Buscar - Imprimir Reportes</p>
          <div className="grid grid-cols-2 gap-2 mb-2 items-center justify-center w-full">
            <div>
              <label className="font-semibold">Nombre :</label>
              <input
                className="border rounded px-2 py-1 w-full"
                name="nombres_search"
                value={form.nombres_search}
                onKeyUp={(e) => {
                  if (e.key === "Enter") {
                    // obtenerInfoTabla();
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
                    // obtenerInfoTabla();
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
          <div className="mb-2">
            <div className="font-semibold ">Agregados Recientemente</div>
          </div>
          <div className="flex-1">
            <Table
              data={dataTabla}
              // tabla={tabla}
              set={setForm}
              // token={token}
              // clean={handleClear}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Co
function Table({ data, set }) {
  // data, tabla, set, token, clean
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
        // PrintHojaR(nro, token, tabla);
      }
    });
  };

  function clicktable(nro) {
    // clean();
    Loading("Importando Datos");
    // GetInfoServicioTabla(nro, tabla, set, token);
  }
  function convertirFecha(fecha) {
    if (fecha == null || fecha === "") return "";
    const [dia, mes, anio] = fecha.split("-");
    return `${anio}/${mes.padStart(2, "0")}/${dia.padStart(2, "0")}`;
  }

  return (
    <div className="overflow-y-auto " style={{ maxHeight: "450px" }}>
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
                  // handlePrintConfirm(row.norden);
                }}
              >
                <td className="border px-2 py-1 font-bold">
                  {row.norden || ""}
                </td>
                <td className="border px-2 py-1">{row.nombres || ""}</td>
                <td className="border px-2 py-1">
                  {convertirFecha(row.fechaOf)}
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

// Componente Section
function Section({ title, children }) {
  return (
    <div className="space-y-2">
      {title && (
        <h3 className="font-semibold text-blue-700 text-xl">{title}</h3>
      )}
      {children}
    </div>
  );
}

// Componente ActionButton con colores del ejemplo
function ActionButton({ color, icon, onClick, children }) {
  const bg = {
    green: "bg-green-600 hover:bg-green-700",
    yellow: "bg-yellow-400 hover:bg-yellow-500",
    blue: "bg-blue-600 hover:bg-blue-700",
    red: "bg-red-500 hover:bg-red-600",
  }[color];

  return (
    <button
      onClick={onClick}
      className={`${bg} text-white px-4 py-2 rounded flex items-center gap-2 text-lg transition-colors`}
    >
      <FontAwesomeIcon icon={icon} />
      {children}
    </button>
  );
}

export default OdontologiaReportes;
