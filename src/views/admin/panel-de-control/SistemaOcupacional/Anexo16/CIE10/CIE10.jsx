import { faSearch, faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getFetch } from "../../../getFetch/getFetch";

const url = "/api/v01/ct/cie10/buscar"

const CIE10 = ({ closeModal, token }) => {

    const [inputSearch, setInputSearch] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedResult, setSelectedResult] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const debounceRef = useRef(null);
    const containerRef = useRef(null);

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
                console.log(response)
                const data = await response.resultado
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
    }, [inputSearch]);

    // Cerrar dropdown al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (item) => {
        setSelectedResult(item);
        setInputSearch(`${item.codigo} - ${item.descripcion}`);
        setShowDropdown(false);
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white rounded-xl shadow-xl w-[500px] max-h-[80vh] flex flex-col relative">

                {/* Header */}
                <div className="azuloscurobackground text-white px-4 py-3 flex justify-between items-center rounded-t-xl">
                    <h1 className="font-semibold text-base">Diagnósticos CIE-10</h1>
                    <FontAwesomeIcon icon={faTimes} className="cursor-pointer" onClick={closeModal} />
                </div>

                {/* Body */}
                <div className="p-4 w-full" ref={containerRef}>
                    {/* Input con ícono */}
                    <div className="relative">
                        <FontAwesomeIcon
                            icon={loading ? faSpinner : faSearch}
                            className={`absolute left top-1/2 -translate-y-1/2 text-gray-400 text-sm ${loading ? "animate-spin" : ""}`}
                        />
                        <input
                            type="text"
                            value={inputSearch}
                            onChange={(e) => {
                                setInputSearch(e.target.value);
                                setSelectedResult(null); // Limpiar selección al volver a escribir
                            }}
                            placeholder="Buscar por código o descripción..."
                            className="px-3 py-2 pl-10 border bg-[#FAFAFA] text-sm border-gray-300 rounded-md w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#233245] focus-visible:ring-offset-2"
                        />
                    </div>

                    {/* Dropdown de resultados */}
                    {showDropdown && (
                        <div className="border border-gray-200 rounded-md mt-1 max-h-60 overflow-y-auto shadow-md bg-white z-10 relative">
                            {results.length === 0 ? (
                                <p className="text-sm text-gray-500 px-4 py-3 text-center">
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
                                        <span className="text-xs font-mono font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded mt-0.5 shrink-0">
                                            {item.codigo}
                                        </span>
                                        <span className="text-sm text-gray-700 leading-snug">{item.descripcion}</span>
                                        {selectedResult?.codigo === item.codigo && (
                                            <FontAwesomeIcon icon={faCheck} className="text-blue-600 ml-auto mt-1 shrink-0" />
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* Diagnóstico seleccionado (opcional, para feedback visual) */}
                    {selectedResult && (
                        <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-md flex items-center gap-2">
                            <FontAwesomeIcon icon={faCheck} className="text-green-600 text-xs" />
                            <span className="text-xs text-green-700">
                                <strong>{selectedResult.codigo}</strong> — {selectedResult.descripcion}
                            </span>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-3 border-t flex justify-end gap-2">
                    <button
                        onClick={closeModal}
                        className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={() => {
                            if (selectedResult) {
                                // Usar selectedResult donde lo necesites
                                console.log("Diagnóstico seleccionado:", selectedResult);
                                closeModal();
                            }
                        }}
                        disabled={!selectedResult}
                        className="px-3 py-1 text-sm bg-[#233245] text-white rounded hover:bg-[#1a2535] disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        Confirmar
                    </button>
                </div>

            </div>
        </div>
    );
};


export default CIE10