export default function TablaTemplate({
    columns = [],
    data = [],
    height = 600,
    onRowClick,
    onRowRightClick,
    emptyText = "No hay datos",
}) {
    return (
        <div
            className="rounded-lg border border-gray-300 overflow-y-auto"
            style={{ minHeight: height, maxHeight: height }}
        >
            <table className="w-full table-auto border-collapse">
                <thead className="sticky top-0 z-20 bg-[#233245] text-white">
                    <tr>
                        {columns.map((col, i) => (
                            <th
                                key={i}
                                className="border px-2 py-2 text-left text-lg font-semibold"
                                style={{ width: col.width }}
                            >
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {data.length > 0 ? (
                        data.map((row, i) => (
                            <tr
                                key={i}
                                className="hover:bg-[#233245] hover:text-white cursor-pointer text-lg"
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
