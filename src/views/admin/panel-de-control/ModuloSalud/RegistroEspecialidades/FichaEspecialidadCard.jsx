import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faBan } from "@fortawesome/free-solid-svg-icons";
import InputCheckbox from "../../../../components/reusableComponents/InputCheckbox";

export default function FichaEspecialidadCard({
  ficha,
  entregas,
  visitaAbierta,
  atencionLoading,
  onToggleAtencion,
  onAbrirBuscarMedicamento,
  onAbrirAnular,
}) {
  const atendido = ficha.estado === "PASO";
  const puedeEntregar = visitaAbierta && atendido;

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="font-bold text-[#233245]">{ficha.especialidad?.nombre}</p>
        <InputCheckbox
          label="Atendido"
          checked={atendido}
          disabled={atencionLoading || !visitaAbierta}
          onChange={() => onToggleAtencion(ficha)}
        />
      </div>

      <div className="border-t pt-3">
        <div className="flex items-center justify-between mb-2 gap-2">
          <p className="text-sm font-semibold text-gray-600">Entrega de medicamentos</p>
          <button
            type="button"
            disabled={!puedeEntregar}
            onClick={() => onAbrirBuscarMedicamento(ficha)}
            title={!atendido ? "Debe marcar la especialidad como Atendido primero" : undefined}
            className="azul-btn text-xs px-3 py-1.5 rounded flex items-center gap-1 disabled:opacity-50 whitespace-nowrap"
          >
            <FontAwesomeIcon icon={faPlus} /> Entregar Medicamento
          </button>
        </div>

        {entregas.length === 0 ? (
          <p className="text-xs text-gray-400 italic">Sin entregas registradas</p>
        ) : (
          <ul className="space-y-1.5">
            {entregas.map((entrega) => (
              <li
                key={entrega.id ?? `${entrega.medicamentoId}-${entrega.cantidad}`}
                className={`flex items-center justify-between gap-2 text-sm border rounded px-2 py-1.5 ${
                  entrega.estado === "ANULADA" ? "bg-gray-50 text-gray-400" : ""
                }`}
              >
                <span className={entrega.estado === "ANULADA" ? "line-through" : ""}>
                  {entrega.nombre} <span className="text-gray-400">({entrega.presentacion})</span> x{entrega.cantidad}
                </span>
                {entrega.estado === "ANULADA" ? (
                  <span className="text-xs font-semibold shrink-0">ANULADA</span>
                ) : (
                  <button
                    type="button"
                    disabled={!visitaAbierta}
                    onClick={() => onAbrirAnular(ficha, entrega)}
                    className="text-red-500 hover:text-red-700 text-xs font-semibold flex items-center gap-1 shrink-0 disabled:opacity-50"
                    title="Anular entrega"
                  >
                    <FontAwesomeIcon icon={faBan} /> Anular
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
