import { faCheck, faPlus, faPlusCircle, faSearch, faSpinner, faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getFetch } from "../../../getFetch/getFetch";

const CIE10 = ({
  token,
  setForm,
  fieldName = "observacionesGenerales",
  inputType = "lineal", // "lineal" (text) o "multiple" (textarea)
  buttonLabel = "Ingresar CIE 10",
  buttonClassName = "bg-emerald-600 hover:bg-emerald-700 text-white text-base px-6 py-2 rounded flex items-center justify-center gap-2",
  containerClassName = "w-full flex justify-center items-center",
  value, // Nuevo prop: valor actual del formulario
  isIcon = false,
  onConfirm,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [inputSearch, setInputSearch] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedList, setSelectedList] = useState([]);
  const debounceRef = useRef(null);
  const containerRef = useRef(null);


  // Función para parsear el valor inicial del formulario a la lista
  const parseValueToList = (value) => {
    if (!value || value.trim() === "") return [];

    const delimiter = inputType === "multiple" ? "\n" : " | ";
    const normalized = value.replace(/\n/g, delimiter);
    const items = normalized.split(delimiter).filter(item => item.trim() !== "");

    return items.map(item => {
      const match = item.match(/CIE 10: ([A-Za-z0-9.]+) - (.+)/i);
      if (match) {
        return {
          codigo: match[1],
          descripcion: match[2]
        };
      }
      const parts = item.split(" - ");
      if (parts.length >= 2) {
        return {
          codigo: parts[0].replace(/CIE 10:\s*/i, ""),
          descripcion: parts.slice(1).join(" - ")
        };
      }
      return {
        codigo: item,
        descripcion: item
      };
    });
  };

  // Cuando el modal se abre, obtener el valor actual del formulario
  const handleOpenModal = () => {
    // Usamos el prop 'value' que recibimos directamente
    setSelectedList(parseValueToList(value || ""));
    setModalOpen(true);
  };

  useEffect(() => {
    // Limpiar timer anterior
    if (debounceRef.current) clearTimeout(debounceRef.current);

    // No buscar si tiene menos de 2 caracteres
    if (inputSearch.trim().length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    // Esperar 300ms antes de consultar
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await getFetch(
          `/api/v01/ct/cie10/buscar?q=${encodeURIComponent(inputSearch)}`, token
        );
        console.log(response);
        const data = response?.resultado || [];
        setResults(data.slice(0, 15)); // Máximo 15 resultados
        setShowDropdown(true);
      } catch (error) {
        console.error("Error buscando CIE10:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    // Cleanup al desmontar
    return () => clearTimeout(debounceRef.current);
  }, [inputSearch, token]);

  const handleSelect = (item) => {
    setSelectedResult(item);
    setInputSearch(`${item.codigo} - ${item.descripcion}`);
    setShowDropdown(false);
  };

  const addToList = () => {
    if (selectedResult) {
      // Verificar que no esté ya en la lista
      const isAlreadyAdded = selectedList.some(item => item.codigo === selectedResult.codigo);
      if (!isAlreadyAdded) {
        setSelectedList(prev => [...prev, selectedResult].sort((a, b) =>
          a.codigo.localeCompare(b.codigo)
        ));
          // setSelectedList(prev => [...prev, selectedResult]);
      } 
      // Limpiar selección después de agregar
      setSelectedResult(null);
      setInputSearch("");
    }
  };

  const removeFromList = (codigoToRemove) => {
    setSelectedList(prev => prev.filter(item => item.codigo !== codigoToRemove));
  };

  const insertAllInForm = () => {
    if (selectedList.length > 0) {
      const nuevosDiagnosticos = selectedList.map(item =>
        `CIE 10: ${item.codigo} - ${item.descripcion}`
      ).join(inputType === "multiple" ? "\n" : " | ");

      const newValue = nuevosDiagnosticos.toUpperCase();
      
      setForm(prev => ({
        ...prev,
        [fieldName]: newValue
      }));

      if (onConfirm) {
        onConfirm(newValue, selectedList);
      }

      setModalOpen(false);
      // Limpiar la lista después de cerrar
      setSelectedList([]);
      setSelectedResult(null);
      setInputSearch("");
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedList([]);
    setSelectedResult(null);
    setInputSearch("");
  };

  return (
    <>
      {/* Botón para abrir el modal */}
      <div className={containerClassName}>
        <button
          type="button"
          onClick={handleOpenModal}
          className={isIcon ? "" : buttonClassName}
        >
          {isIcon ? <FontAwesomeIcon icon={faPlusCircle} className="text-green-700 text-2xl" /> : buttonLabel}
        </button>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white rounded-xl shadow-xl w-[600px] max-h-[90vh] flex flex-col relative">

            {/* Header */}
            <div className="azuloscurobackground text-white px-4 py-3 flex justify-between items-center rounded-t-xl">
              <h1 className="font-semibold text-base">Diagnósticos CIE-10</h1>
              <FontAwesomeIcon icon={faTimes} className="cursor-pointer" onClick={closeModal} />
            </div>

            {/* Body */}
            <div className="p-4 w-full flex-1 overflow-y-auto" ref={containerRef}>
              {/* Input con ícono */}
              <div className="relative">
                <FontAwesomeIcon
                  icon={loading ? faSpinner : faSearch}
                  className={`absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm ${loading ? "animate-spin" : ""}`}
                />
                <input
                  type="text"
                  value={inputSearch}
                  onChange={(e) => {
                    setInputSearch(e.target.value);
                    setSelectedResult(null); // Limpiar selección al volver a escribir
                  }}
                  placeholder="Buscar por código o descripción..."
                  className="px-4 py-2 pl-10 border bg-[#FAFAFA] text-base border-gray-300 rounded-md w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#233245] focus-visible:ring-offset-2"
                />
              </div>

              {/* Dropdown de resultados */}
              {showDropdown && (
                <div className="border border-gray-200 rounded-md mt-1 max-h-60 overflow-y-auto shadow-md bg-white z-10 relative">
                  {results.length === 0 ? (
                    <p className="text-base text-gray-500 px-4 py-3 text-center">
                      Sin resultados para "{inputSearch}"
                    </p>
                  ) : (
                    results.map((item) => (
                      <div
                        key={item.codigo}
                        onClick={() => handleSelect(item)}
                        className={`flex items-start gap-3 px-4 py-2 cursor-pointer hover:bg-blue-50 border-b border-gray-100 last:border-0 transition-colors ${selectedResult?.codigo === item.codigo ? "bg-blue-50" : ""
                          }`}
                      >
                        <span className="text-base font-mono font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded mt-0.5 shrink-0">
                          {item.codigo}
                        </span>
                        <span className="text-base text-gray-700 leading-snug">{item.descripcion}</span>
                        {selectedResult?.codigo === item.codigo && (
                          <FontAwesomeIcon icon={faCheck} className="text-blue-600 ml-auto mt-1 shrink-0" />
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Botón para agregar a la lista */}
              {selectedResult && (
                <button
                  onClick={addToList}
                  className="mt-3 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-md flex items-center justify-center gap-2"
                >
                  <FontAwesomeIcon icon={faCheck} />
                  Agregar a la lista
                </button>
              )}

              {/* Lista de diagnósticos seleccionados */}
              {selectedList.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold text-gray-700 mb-2 text-base">Diagnósticos a agregar:</h3>
                  <div className="space-y-2">
                    {selectedList.map((item) => (
                      <div
                        key={item.codigo}
                        className="flex items-center gap-3 p-2 bg-green-50 border border-green-200 rounded-md"
                      >
                        <span className="text-base font-mono font-bold text-green-700 bg-green-100 px-1.5 py-0.5 rounded shrink-0">
                          {item.codigo}
                        </span>
                        <span className="text-base text-green-800 flex-1">{item.descripcion}</span>
                        <button
                          onClick={() => removeFromList(item.codigo)}
                          className="text-red-500 hover:text-red-700 shrink-0"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t flex justify-end gap-2">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-base bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={insertAllInForm}
                disabled={selectedList.length === 0}
                className="px-4 py-2 text-base bg-[#233245] text-white rounded hover:bg-[#1a2535] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Confirmar ({selectedList.length})
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default CIE10;
