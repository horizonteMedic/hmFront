import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort, faSortDown, faSortUp } from "@fortawesome/free-solid-svg-icons";

// Orden por cabecera (opcional): con `onSort`, las columnas marcadas `sortable` se pueden pulsar y llaman
// a `onSort(col)`. `sort` es { id, direccion: "asc" | "desc" } de la columna ordenada (se identifica por
// `col.id`) y solo sirve para dibujar la flecha; ordenar los datos es cosa de quien usa la tabla.
export default function TablaTemplate({
    columns = [],
    data = [],
    height = 600,
    onRowClick,
    onRowRightClick,
    getRowClassName,
    emptyText = "No hay datos",
    sort = null,
    onSort,
}) {
    return (
        <div
            className="rounded-lg border border-gray-300 overflow-y-auto"
            style={{ minHeight: height, maxHeight: height }}
        >
            <table className="w-full table-auto border-collapse">
                <thead className="sticky top-0 z-20 bg-[#233245] text-white">
                    <tr>
                        {columns.map((col, i) => {
                            const ordenable = Boolean(onSort && col.sortable);
                            const direccion = ordenable && sort && sort.id === col.id ? sort.direccion : null;
                            return (
                                <th
                                    key={i}
                                    className={`border px-2 py-2 text-left text-lg font-semibold ${ordenable ? "cursor-pointer select-none hover:bg-[#2f435b]" : ""}`}
                                    style={{ width: col.width }}
                                    aria-sort={direccion ? (direccion === "asc" ? "ascending" : "descending") : undefined}
                                    tabIndex={ordenable ? 0 : undefined}
                                    onClick={ordenable ? () => onSort(col) : undefined}
                                    onKeyDown={
                                        ordenable
                                            ? (e) => {
                                                  if (e.target !== e.currentTarget || (e.key !== "Enter" && e.key !== " ")) return;
                                                  e.preventDefault();
                                                  onSort(col);
                                              }
                                            : undefined
                                    }
                                >
                                    {ordenable ? (
                                        <span className="inline-flex items-center gap-1.5">
                                            <span>{col.label}</span>
                                            <FontAwesomeIcon
                                                icon={direccion === "asc" ? faSortUp : direccion === "desc" ? faSortDown : faSort}
                                                className={`text-sm ${direccion ? "text-white" : "text-white/40"}`}
                                            />
                                        </span>
                                    ) : (
                                        col.label
                                    )}
                                </th>
                            );
                        })}
                    </tr>
                </thead>

                <tbody>
                    {data.length > 0 ? (
                        data.map((row, i) => (
                            <tr
                                key={i}
                                className={`hover:bg-[#233245] hover:text-white cursor-pointer text-lg ${getRowClassName?.(row) ?? ""}`}
                                onClick={() => onRowClick?.(row)}
                                onContextMenu={(e) => {
                                    e.preventDefault();
                                    onRowRightClick?.(row);
                                }}
                            >
                                {columns.map((col, j) => (
                                    <td key={j} className="border px-2 py-1">
                                        {col.render
                                            ? col.render(row)
                                            : row[col.accessor] ?? ""}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className="text-center py-4 text-gray-500 text-lg"
                            >
                                {emptyText}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
