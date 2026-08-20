import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faBan, faGear } from "@fortawesome/free-solid-svg-icons";
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
  const entregasActivas = entregas.filter((e) => e.estado !== "ANULADA");

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="font-bold text-[#233245]">{ficha.especialidad?.nombre}</p>
        {atencionLoading ? (
          <span className="flex items-center gap-2 text-gray-500 mr-1 font-semibold">
            <FontAwesomeIcon icon={faGear} spin className="w-5 h-5" />
            Atendido
          </span>
        ) : (
          <InputCheckbox
            label="Atendido"
            checked={atendido}
            disabled={!visitaAbierta}
            className="cursor-pointer"
            onChange={() => onToggleAtencion(ficha)}
          />
        )}
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

        {entregasActivas.length === 0 ? (
          <p className="text-xs text-gray-400 italic">Sin entregas registradas</p>
        ) : (
          <div className="overflow-x-auto border rounded">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="text-left font-semibold text-gray-600 px-2 py-1.5">Medicamento</th>
                  <th className="text-left font-semibold text-gray-600 px-2 py-1.5">Presentación</th>
                  <th className="text-right font-semibold text-gray-600 px-2 py-1.5">Cantidad</th>
                  <th className="text-center font-semibold text-gray-600 px-2 py-1.5">Anular</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {entregasActivas.map((entrega) => (
                  <tr key={entrega.id ?? `${entrega.medicamentoId}-${entrega.cantidad}`}>
                    <td className="px-2 py-1.5">{entrega.nombre}</td>
                    <td className="px-2 py-1.5 text-gray-500">{entrega.presentacion}</td>
                    <td className="px-2 py-1.5 text-right">{entrega.cantidad}</td>
                    <td className="px-2 py-1.5 text-center">
                      <button
                        type="button"
                        disabled={!visitaAbierta}
                        onClick={() => onAbrirAnular(ficha, entrega)}
                        className="text-red-500 hover:text-red-700 disabled:opacity-50"
                        title="Anular entrega"
                      >
                        <FontAwesomeIcon icon={faBan} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
