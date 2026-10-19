// Contadores de una carga masiva: `datos` es [{ titulo, valor, clase }].
export default function ResumenCarga({ datos }) {
    return (
        <div className="flex flex-wrap gap-3">
            {datos.map(({ titulo, valor, clase }) => (
                <div key={titulo} className={`rounded px-4 py-2 shadow-sm ${clase}`}>
                    <p className="text-sm">{titulo}</p>
                    <p className="text-xl font-bold">{valor}</p>
                </div>
            ))}
        </div>
    );
}

// Fallos que el backend informó pero que no se pudieron asociar a ninguna fila de la lista.
export function FallosSinFila({ fallos }) {
    if (!fallos.length) return null;

    return (
        <div className="rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-2 text-sm text-yellow-800">
            <p className="font-semibold">
                El servidor reportó {fallos.length} fallo(s) que no se pudieron asociar a una fila de la lista, así que alguna fila
                marcada como registrada podría no estarlo (revisa la lista de medicamentos):
            </p>
            <ul className="list-inside list-disc">
                {fallos.map((fallo, i) => (
                    <li key={i}>
                        {fallo.nombresPa || "(sin nombre)"}: {fallo.motivoFallo}
                    </li>
                ))}
            </ul>
        </div>
    );
}
