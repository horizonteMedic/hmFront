import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faSearch, faCheck } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { getMedicamentos } from "../../Inventario/ProductosEnInventario/model/ProductosEnInventario";
import { crearEntrega } from "../controllerRegistroEspecialidades";

const normalizeText = (text) =>
  (text ?? "")
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

const contains = (fieldValue, term) => {
  const words = normalizeText(term).split(/\s+/).filter(Boolean);
  if (words.length === 0) return true;
  const normalizedField = normalizeText(fieldValue);
  return words.every((word) => normalizedField.includes(word));
};

export default function BuscarMedicamentoModal({ ficha, token, usuarioRegistro, closeModal, onEntregaRegistrada }) {
  const [medicamentos, setMedicamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [soloConStock, setSoloConStock] = useState(true);
  const [selected, setSelected] = useState(null);
  const [cantidad, setCantidad] = useState("");
  const [registrando, setRegistrando] = useState(false);

  useEffect(() => {
    setLoading(true);
    getMedicamentos(token)
      .then((res) => setMedicamentos(Array.isArray(res) ? res : []))
      .catch(() => {
        Swal.fire({
          title: "Error",
          text: "No se pudo cargar la lista de medicamentos",
          icon: "error",
          confirmButtonColor: "#084788",
          confirmButtonText: "Aceptar",
        });
      })
      .finally(() => setLoading(false));
  }, [token]);

  const filtered = useMemo(
    () =>
      medicamentos.filter((m) => {
        const matchesSearch = contains(m.nombre, search) || contains(m.presentacion, search);
        const matchesStock = !soloConStock || (m.stockActual ?? 0) > 0;
        return matchesSearch && matchesStock;
      }),
    [medicamentos, search, soloConStock]
  );

  const cantidadNum = Number(cantidad);
  const stockDisponible = selected?.stockActual ?? 0;
  const cantidadValida =
    !!selected && cantidad !== "" && Number.isInteger(cantidadNum) && cantidadNum > 0 && cantidadNum <= stockDisponible;
  const stockRestante = selected && Number.isFinite(cantidadNum) ? stockDisponible - cantidadNum : null;

  const handleSelect = (medicamento) => {
    setSelected(medicamento);
    setCantidad("");
  };

  const handleCantidadChange = (e) => {
    setCantidad(e.target.value.replace(/[^\d]/g, ""));
  };

  const handleConfirmar = async () => {
    if (!selected || !cantidadValida) return;

    setRegistrando(true);
    const res = await crearEntrega(
      {
        visitaEspecialidadId: ficha.id,
        medicamentoId: selected.id,
        cantidad: cantidadNum,
        usuarioRegistro,
      },
      token
    );
    setRegistrando(false);

    if (res.ok) {
      onEntregaRegistrada(ficha, {
        id: res.data?.id ?? res.data?.entregaId,
        medicamentoId: selected.id,
        nombre: selected.nombre,
        presentacion: selected.presentacion,
        cantidad: cantidadNum,
        estado: "ACTIVA",
      });
      Swal.fire({
        title: "¡Éxito!",
        text: "Entrega registrada y stock descontado",
        icon: "success",
        confirmButtonColor: "#084788",
        confirmButtonText: "Aceptar",
      });
      closeModal();
      return;
    }

    if (res.status === 400) {
      Swal.fire({
        title: "Error",
        text:
          res.data?.mensaje ||
          res.data?.message ||
          "Cantidad inválida, stock insuficiente o la visita ya no está ABIERTA.",
        icon: "error",
        confirmButtonColor: "#084788",
        confirmButtonText: "Aceptar",
      });
    } else if (res.status === 404) {
      Swal.fire({
        title: "Error",
        text: "No existe esa ficha de especialidad o ese medicamento.",
        icon: "error",
        confirmButtonColor: "#084788",
        confirmButtonText: "Aceptar",
      });
    } else {
      Swal.fire({
        title: "Error",
        text: "Ha ocurrido un error al registrar la entrega.",
        icon: "error",
        confirmButtonColor: "#084788",
        confirmButtonText: "Aceptar",
      });
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-md w-[95%] max-w-[560px] relative max-h-[90vh] flex flex-col">
        <FontAwesomeIcon
          icon={faTimes}
          className="absolute top-0 right-0 m-3 cursor-pointer text-white"
          onClick={closeModal}
        />
        <div className="p-3 azuloscurobackground flex justify-between">
          <h1 className="text-start font-bold color-azul text-white">
            Entregar Medicamento — {ficha.especialidad?.nombre}
          </h1>
        </div>

        <div className="p-4 overflow-y-auto space-y-4">
          <div className="relative">
            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Buscar por nombre o presentación..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#084788]"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={soloConStock}
              onChange={(e) => setSoloConStock(e.target.checked)}
              className="w-4 h-4 rounded accent-[#084788] cursor-pointer"
            />
            Solo con stock disponible
          </label>

          <div className="border rounded-lg max-h-[220px] overflow-y-auto divide-y">
            {loading ? (
              <p className="text-center text-sm py-4 text-gray-500">Cargando medicamentos...</p>
            ) : filtered.length === 0 ? (
              <p className="text-center text-sm py-4 text-gray-500">No se encontraron medicamentos</p>
            ) : (
              filtered.map((m) => (
                <div
                  key={m.id}
                  onClick={() => handleSelect(m)}
                  className={`flex items-center justify-between px-3 py-2 cursor-pointer text-sm hover:bg-blue-50 ${
                    selected?.id === m.id ? "bg-blue-100" : ""
                  }`}
                >
                  <div>
                    <p className="font-semibold text-gray-800">{m.nombre}</p>
                    <p className="text-xs text-gray-500">{m.presentacion}</p>
                  </div>
                  <span className={`text-xs font-semibold ${(m.stockActual ?? 0) <= 0 ? "text-red-500" : "text-gray-600"}`}>
                    Stock: {m.stockActual ?? 0}
                  </span>
                </div>
              ))
            )}
          </div>

          {selected && (
            <div className="border rounded-lg p-3 bg-gray-50 space-y-2">
              <p className="text-sm">
                Seleccionado: <span className="font-semibold">{selected.nombre}</span> ({selected.presentacion}) — Stock
                disponible: <span className="font-semibold">{stockDisponible}</span>
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                <input
                  type="number"
                  min="1"
                  max={stockDisponible}
                  value={cantidad}
                  onChange={handleCantidadChange}
                  placeholder="Cantidad"
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-32 focus:outline-none focus:ring-2 focus:ring-[#084788]"
                />
                {cantidad !== "" && (
                  <span className={`text-sm font-semibold ${cantidadValida ? "text-green-600" : "text-red-500"}`}>
                    {stockDisponible <= 0
                      ? "Sin stock disponible"
                      : cantidadValida
                      ? `Quedará: ${stockRestante}`
                      : `Máximo disponible: ${stockDisponible}`}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 p-4 border-t">
          <button type="button" onClick={closeModal} className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 font-semibold">
            Cancelar
          </button>
          <button
            type="button"
            disabled={!cantidadValida || registrando}
            onClick={handleConfirmar}
            className="azul-btn px-4 py-2 rounded-md font-semibold disabled:opacity-50 flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faCheck} /> {registrando ? "Registrando..." : "Registrar Entrega"}
          </button>
        </div>
      </div>
    </div>
  );
}
