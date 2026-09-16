import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faBan } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { anularEntrega } from "../controllerRegistroEspecialidades";

const CARGO_OPTIONS = [
  { value: "FARMACIA", label: "Farmacia" },
  { value: "SUPERVISOR", label: "Supervisor" },
  { value: "ADMIN", label: "Administrador" },
];

export default function AnularEntregaModal({ entrega, token, usuarioRegistro, closeModal, onAnulada }) {
  const [cargo, setCargo] = useState("");
  const [motivo, setMotivo] = useState("");
  const [anulando, setAnulando] = useState(false);

  const handleAnular = async () => {
    if (!cargo || !motivo.trim()) {
      Swal.fire({
        title: "Error",
        text: "Debe indicar el cargo y el motivo de la anulación.",
        icon: "error",
        confirmButtonColor: "#084788",
        confirmButtonText: "Aceptar",
      });
      return;
    }

    setAnulando(true);
    const res = await anularEntrega(
      entrega.id,
      { usuarioRegistro, cargoUsuarioRegistro: cargo, motivo: motivo.trim() },
      token
    );
    setAnulando(false);

    if (res.ok) {
      onAnulada(entrega.id);
      Swal.fire({
        title: "Anulada",
        text: "La entrega fue anulada y el stock repuesto.",
        icon: "success",
        confirmButtonColor: "#084788",
        confirmButtonText: "Aceptar",
      });
      closeModal();
      return;
    }

    if (res.status === 403) {
      Swal.fire({
        title: "No autorizado",
        text: "El cargo informado no está autorizado a anular (debe ser FARMACIA, SUPERVISOR o ADMIN).",
        icon: "error",
        confirmButtonColor: "#084788",
        confirmButtonText: "Aceptar",
      });
    } else if (res.status === 400) {
      Swal.fire({
        title: "Error",
        text:
          res.data?.mensaje ||
          res.data?.message ||
          "Falta el motivo, la entrega ya estaba anulada, no fue el mismo día o la visita ya no está ABIERTA.",
        icon: "error",
        confirmButtonColor: "#084788",
        confirmButtonText: "Aceptar",
      });
    } else if (res.status === 404) {
      Swal.fire({
        title: "Error",
        text: "No existe una entrega con ese id.",
        icon: "error",
        confirmButtonColor: "#084788",
        confirmButtonText: "Aceptar",
      });
    } else {
      Swal.fire({
        title: "Error",
        text: "Ha ocurrido un error al anular la entrega.",
        icon: "error",
        confirmButtonColor: "#084788",
        confirmButtonText: "Aceptar",
      });
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-md w-[400px] relative">
        <FontAwesomeIcon
          icon={faTimes}
          className="absolute top-0 right-0 m-3 cursor-pointer text-white"
          onClick={closeModal}
        />
        <div className="p-3 azuloscurobackground flex justify-between">
          <h1 className="text-start font-bold color-azul text-white">Anular Entrega</h1>
        </div>
        <div className="p-4 space-y-4">
          <p className="text-sm text-gray-600">
            Medicamento: <span className="font-semibold">{entrega.nombre}</span> x{entrega.cantidad}
          </p>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Cargo <span className="text-red-500">*</span>
            </label>
            <select
              value={cargo}
              onChange={(e) => setCargo(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#084788]"
            >
              <option value="">Seleccionar...</option>
              {CARGO_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Motivo <span className="text-red-500">*</span>
            </label>
            <textarea
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#084788]"
              placeholder="Motivo de la anulación"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 p-4 border-t">
          <button type="button" onClick={closeModal} className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 font-semibold">
            Cancelar
          </button>
          <button
            type="button"
            disabled={anulando}
            onClick={handleAnular}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-semibold disabled:opacity-50 flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faBan} /> {anulando ? "Anulando..." : "Anular Entrega"}
          </button>
        </div>
      </div>
    </div>
  );
}
