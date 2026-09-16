import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faSearch, faCheck, faTrash, faPlus, faCheckCircle, faRotate } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { getMedicamentos } from "../../Inventario/ProductosEnInventario/model/ProductosEnInventario";
import { crearEntrega, anularEntrega } from "../controllerRegistroEspecialidades";

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

const esLineaValida = (linea) => {
  const cantidadNum = Number(linea.cantidad);
  return (
    linea.cantidad !== "" &&
    Number.isInteger(cantidadNum) &&
    cantidadNum > 0 &&
    cantidadNum <= linea.stockActual
  );
};

export default function BuscarMedicamentoModal({
  ficha,
  token,
  usuarioRegistro,
  entregasExistentes = [],
  closeModal,
  onEntregaRegistrada,
  onEntregaAnulada,
}) {
  const [medicamentos, setMedicamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [soloConStock, setSoloConStock] = useState(true);
  const [carrito, setCarrito] = useState([]);
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

  const buscarEntregaExistente = (nombre) => {
    const nombreNormalizado = normalizeText(nombre);
    return entregasExistentes.find((e) => e.estado !== "ANULADA" && normalizeText(e.nombre) === nombreNormalizado) || null;
  };

  const enCarrito = (medicamentoId) => carrito.some((l) => l.medicamentoId === medicamentoId);

  const handleAgregar = (medicamento) => {
    if (registrando || enCarrito(medicamento.id)) return;

    const entregaExistente = buscarEntregaExistente(medicamento.nombre);

    setCarrito((prev) => [
      ...prev,
      {
        medicamentoId: medicamento.id,
        nombre: medicamento.nombre,
        presentacion: medicamento.presentacion,
        stockActual: medicamento.stockActual ?? 0,
        cantidad: "",
        status: "pendiente",
        errorMsg: null,
        entregaExistente,
      },
    ]);

    if (entregaExistente) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "info",
        title: `${medicamento.nombre} ya tiene una entrega de ${entregaExistente.cantidad} und. Se anulará y se registrará una nueva con la cantidad acumulada.`,
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
      });
    }
  };

  const handleQuitar = (medicamentoId) => {
    if (registrando) return;
    setCarrito((prev) => prev.filter((l) => l.medicamentoId !== medicamentoId));
  };

  const handleCantidadChange = (medicamentoId, value) => {
    const soloDigitos = value.replace(/[^\d]/g, "");
    setCarrito((prev) =>
      prev.map((l) => (l.medicamentoId === medicamentoId ? { ...l, cantidad: soloDigitos, status: "pendiente", errorMsg: null } : l))
    );
  };

  const puedeConfirmar = carrito.length > 0 && carrito.every(esLineaValida) && !registrando;

  const registrarLinea = async (linea) => {
    const cantidadNum = Number(linea.cantidad);

    if (linea.entregaExistente) {
      const cantidadPrevia = linea.entregaExistente.cantidad;
      const resAnular = await anularEntrega(
        linea.entregaExistente.id,
        {
          usuarioRegistro,
          cargoUsuarioRegistro: "FARMACIA",
          motivo: `Consolidación automática: se sumó nueva cantidad entregada (${cantidadPrevia} + ${cantidadNum} = ${cantidadPrevia + cantidadNum}).`,
        },
        token
      );

      if (!resAnular.ok) {
        return { linea, res: resAnular, fase: "anular" };
      }

      onEntregaAnulada?.(linea.entregaExistente.id);

      const cantidadTotal = cantidadPrevia + cantidadNum;
      const resCrear = await crearEntrega(
        { visitaEspecialidadId: ficha.id, medicamentoId: linea.medicamentoId, cantidad: cantidadTotal, usuarioRegistro },
        token
      );
      return { linea, res: resCrear, fase: "crear", cantidadRegistrada: cantidadTotal, seAnuloPrevia: true };
    }

    const res = await crearEntrega(
      { visitaEspecialidadId: ficha.id, medicamentoId: linea.medicamentoId, cantidad: cantidadNum, usuarioRegistro },
      token
    );
    return { linea, res, fase: "crear", cantidadRegistrada: cantidadNum, seAnuloPrevia: false };
  };

  const handleConfirmarTodo = async () => {
    if (!puedeConfirmar) return;

    setRegistrando(true);
    setCarrito((prev) => prev.map((l) => ({ ...l, status: "enviando", errorMsg: null })));

    const resultados = await Promise.allSettled(carrito.map((linea) => registrarLinea(linea)));

    const exitosas = [];
    const fallidas = [];

    resultados.forEach((r, idx) => {
      if (r.status !== "fulfilled") {
        fallidas.push({ linea: carrito[idx], msg: "Error de red al registrar la entrega." });
        return;
      }
      const { linea, res, fase, cantidadRegistrada, seAnuloPrevia } = r.value;

      if (res.ok) {
        exitosas.push({ ...linea, cantidad: cantidadRegistrada, consolidada: seAnuloPrevia });
        onEntregaRegistrada(ficha, {
          id: res.data?.id ?? res.data?.entregaId,
          medicamentoId: linea.medicamentoId,
          nombre: linea.nombre,
          presentacion: linea.presentacion,
          cantidad: cantidadRegistrada,
          estado: "ACTIVA",
        });
        return;
      }

      if (fase === "anular") {
        fallidas.push({
          linea,
          msg: `No se pudo anular la entrega anterior de ${linea.entregaExistente.cantidad} und.; no se registró la nueva cantidad. ${
            res.data?.mensaje || res.data?.message || ""
          }`.trim(),
        });
        return;
      }

      if (seAnuloPrevia) {
        // La anulación de la entrega previa sí se completó, pero la nueva no se pudo crear.
        fallidas.push({
          linea: { ...linea, entregaExistente: null, cantidad: "" },
          msg: `Se anuló la entrega anterior (${linea.entregaExistente.cantidad} und.) pero no se pudo registrar la nueva por ${cantidadRegistrada} und. Ingrese la cantidad total (${cantidadRegistrada}) y reintente.`,
        });
        return;
      }

      const msg =
        res.status === 400
          ? res.data?.mensaje || res.data?.message || "Cantidad inválida, stock insuficiente o la visita ya no está ABIERTA."
          : res.status === 404
          ? "No existe esa ficha de especialidad o ese medicamento."
          : "Ha ocurrido un error al registrar la entrega.";
      fallidas.push({ linea, msg });
    });

    setRegistrando(false);

    if (fallidas.length === 0) {
      const consolidadas = exitosas.filter((l) => l.consolidada).length;
      Swal.fire({
        title: "¡Éxito!",
        text: `Se ${exitosas.length === 1 ? "registró 1 entrega" : `registraron ${exitosas.length} entregas`} y se descontó el stock.${
          consolidadas > 0
            ? ` ${consolidadas === 1 ? "1 de ellas reemplazó" : `${consolidadas} de ellas reemplazaron`} una entrega previa con la cantidad acumulada.`
            : ""
        }`,
        icon: "success",
        confirmButtonColor: "#084788",
        confirmButtonText: "Aceptar",
      });
      closeModal();
      return;
    }

    // Re-consultar el stock: pudo cambiar y ser la causa de la falla.
    let medicamentosFrescos = medicamentos;
    try {
      const fresh = await getMedicamentos(token);
      if (Array.isArray(fresh)) {
        medicamentosFrescos = fresh;
        setMedicamentos(fresh);
      }
    } catch {
      // si el refresco falla, se mantiene el stock que ya se tenía
    }

    setCarrito(
      fallidas.map(({ linea, msg }) => {
        const actualizado = medicamentosFrescos.find((m) => m.id === linea.medicamentoId);
        return {
          ...linea,
          stockActual: actualizado?.stockActual ?? linea.stockActual,
          status: "error",
          errorMsg: msg,
        };
      })
    );

    Swal.fire({
      title: exitosas.length > 0 ? "Registrado parcialmente" : "No se pudo registrar",
      html: `
        ${exitosas.length > 0 ? `<p class="mb-2"><b>Registrados:</b> ${exitosas.map((l) => l.nombre).join(", ")}</p>` : ""}
        <p><b>No se registraron:</b> ${fallidas.map((f) => f.linea.nombre).join(", ")}</p>
        <p class="text-sm text-gray-500 mt-2">Revise el detalle en cada medicamento y reintente.</p>
      `,
      icon: exitosas.length > 0 ? "warning" : "error",
      confirmButtonColor: "#084788",
      confirmButtonText: "Aceptar",
    });
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-md w-[95%] max-w-[620px] relative max-h-[90vh] flex flex-col">
        <FontAwesomeIcon
          icon={faTimes}
          className="absolute top-0 right-0 m-3 cursor-pointer text-white"
          onClick={closeModal}
        />
        <div className="p-3 azuloscurobackground flex justify-between">
          <h1 className="text-start font-bold color-azul text-white">
            Entregar Medicamentos — {ficha.especialidad?.nombre}
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

          <div className="border rounded-lg max-h-[200px] overflow-y-auto divide-y">
            {loading ? (
              <p className="text-center text-sm py-4 text-gray-500">Cargando medicamentos...</p>
            ) : filtered.length === 0 ? (
              <p className="text-center text-sm py-4 text-gray-500">No se encontraron medicamentos</p>
            ) : (
              filtered.map((m) => {
                const yaAgregado = enCarrito(m.id);
                const yaEntregado = !yaAgregado && buscarEntregaExistente(m.nombre);
                return (
                  <div
                    key={m.id}
                    onClick={() => handleAgregar(m)}
                    className={`flex items-center justify-between px-3 py-2 text-sm ${
                      yaAgregado ? "bg-green-50 cursor-default" : "cursor-pointer hover:bg-blue-50"
                    }`}
                  >
                    <div>
                      <p className="font-semibold text-gray-800">{m.nombre}</p>
                      <p className="text-xs text-gray-500">{m.presentacion}</p>
                      {yaEntregado && (
                        <p className="text-xs text-amber-600 flex items-center gap-1 mt-0.5">
                          <FontAwesomeIcon icon={faRotate} /> Ya entregado: {yaEntregado.cantidad} und. (se consolidará)
                        </p>
                      )}
                    </div>
                    {yaAgregado ? (
                      <span className="text-xs font-semibold text-green-600 flex items-center gap-1 shrink-0">
                        <FontAwesomeIcon icon={faCheckCircle} /> En la lista
                      </span>
                    ) : (
                      <span
                        className={`text-xs font-semibold flex items-center gap-2 shrink-0 ${
                          (m.stockActual ?? 0) <= 0 ? "text-red-500" : "text-gray-600"
                        }`}
                      >
                        Stock: {m.stockActual ?? 0}
                        <FontAwesomeIcon icon={faPlus} className="text-[#084788]" />
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-700">
              Medicamentos a entregar {carrito.length > 0 && `(${carrito.length})`}
            </p>
            {carrito.length === 0 ? (
              <p className="text-xs text-gray-400 italic">
                Toque uno o varios medicamentos de la lista de arriba para agregarlos aquí.
              </p>
            ) : (
              <div className="space-y-2">
                {carrito.map((linea) => {
                  const cantidadNum = Number(linea.cantidad);
                  const valida = esLineaValida(linea);
                  const stockRestante = linea.cantidad !== "" && Number.isFinite(cantidadNum) ? linea.stockActual - cantidadNum : null;
                  const cantidadTotalTrasConsolidar =
                    linea.entregaExistente && linea.cantidad !== "" && Number.isFinite(cantidadNum)
                      ? linea.entregaExistente.cantidad + cantidadNum
                      : null;
                  return (
                    <div
                      key={linea.medicamentoId}
                      className={`border rounded-lg p-3 space-y-1.5 ${
                        linea.status === "error"
                          ? "border-red-300 bg-red-50"
                          : linea.status === "exito"
                          ? "border-green-300 bg-green-50"
                          : linea.entregaExistente
                          ? "border-amber-300 bg-amber-50"
                          : "bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm">
                          <span className="font-semibold">{linea.nombre}</span>{" "}
                          <span className="text-gray-400">({linea.presentacion})</span> — Stock:{" "}
                          <span className="font-semibold">{linea.stockActual}</span>
                        </p>
                        <button
                          type="button"
                          disabled={registrando}
                          onClick={() => handleQuitar(linea.medicamentoId)}
                          className="text-red-500 hover:text-red-700 shrink-0 disabled:opacity-40"
                          title="Quitar de la lista"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>

                      {linea.entregaExistente && (
                        <p className="text-xs text-amber-700 flex items-center gap-1">
                          <FontAwesomeIcon icon={faRotate} />
                          Ya tiene una entrega activa de <b>{linea.entregaExistente.cantidad}</b> und. Al confirmar se anulará esa
                          entrega y se registrará una nueva con la cantidad acumulada
                          {cantidadTotalTrasConsolidar !== null ? ` (${cantidadTotalTrasConsolidar} und.)` : ""}.
                        </p>
                      )}

                      <div className="flex items-center gap-3 flex-wrap">
                        <input
                          type="number"
                          min="1"
                          max={linea.stockActual}
                          value={linea.cantidad}
                          disabled={registrando}
                          onChange={(e) => handleCantidadChange(linea.medicamentoId, e.target.value)}
                          placeholder={linea.entregaExistente ? "Cantidad a sumar" : "Cantidad"}
                          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-32 focus:outline-none focus:ring-2 focus:ring-[#084788] disabled:opacity-60"
                        />
                        {linea.cantidad !== "" && (
                          <span className={`text-sm font-semibold ${valida ? "text-green-600" : "text-red-500"}`}>
                            {linea.stockActual <= 0
                              ? "Sin stock disponible"
                              : valida
                              ? `Quedará: ${stockRestante}`
                              : `Máximo disponible: ${linea.stockActual}`}
                          </span>
                        )}
                        {linea.status === "enviando" && <span className="text-xs text-gray-500">Registrando...</span>}
                      </div>
                      {linea.status === "error" && linea.errorMsg && (
                        <p className="text-xs text-red-600">{linea.errorMsg}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 p-4 border-t">
          <button type="button" onClick={closeModal} className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 font-semibold">
            Cancelar
          </button>
          <button
            type="button"
            disabled={!puedeConfirmar}
            onClick={handleConfirmarTodo}
            className="azul-btn px-4 py-2 rounded-md font-semibold disabled:opacity-50 flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faCheck} />
            {registrando ? "Registrando..." : `Registrar Entrega${carrito.length > 1 ? "s" : ""}${carrito.length > 0 ? ` (${carrito.length})` : ""}`}
          </button>
        </div>
      </div>
    </div>
  );
}
