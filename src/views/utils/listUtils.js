import { useMemo, useState } from "react";

export function normalizeList(value) {
  if (Array.isArray(value)) {
    return value
      .map(v => String(v).trim())
      .filter(Boolean)
      .map(v => v.toUpperCase());
  }
  if (typeof value === 'string') {
    // Aceptar saltos reales (\n, \r\n), literal "\\n", separador "/n" y el posible "7n" mencionado
    const parts = value
      .split(/\r\n|\r|\n|\\n|\/n|7n/g)
      .map(v => String(v).trim())
      .filter(Boolean);
    return parts.map(v => v.toUpperCase());
  }
  return [];
}

export const usePagination = (data = [], initialRecordsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(initialRecordsPerPage);

  // Total de páginas (se recalcula cada vez que cambia el data o recordsPerPage)
  const totalPages = useMemo(() => {
    if (recordsPerPage === -1) return 1; // Si selecciona "Todos", solo 1 página
    return Math.ceil(data.length / recordsPerPage) || 1;
  }, [data.length, recordsPerPage]);

  // Datos paginados
  const paginatedData = useMemo(() => {
    if (recordsPerPage === -1) return data; // "Todos"
    const startIndex = (currentPage - 1) * recordsPerPage;
    return data.slice(startIndex, startIndex + recordsPerPage);
  }, [data, currentPage, recordsPerPage]);

  // Páginas visibles (ejemplo: 5 botones de paginación)
  const visiblePages = useMemo(() => {
    const totalVisiblePages = 5;
    const halfVisiblePages = Math.floor(totalVisiblePages / 2);

    let startPage = currentPage - halfVisiblePages;
    startPage = Math.max(startPage, 1);

    const endPage = Math.min(startPage + totalVisiblePages - 1, totalPages);

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  }, [currentPage, totalPages]);

  // Cambiar cantidad de registros por página
  const handleChangeRecordsPerPage = (e) => {
    const value = parseInt(e.target.value, 10);
    setRecordsPerPage(value);
    setCurrentPage(1); // Reiniciar a la primera página
  };

  return {
    currentPage,
    setCurrentPage,
    recordsPerPage,
    setRecordsPerPage,
    totalPages,
    visiblePages,
    paginatedData,
    handleChangeRecordsPerPage,
  };
};


