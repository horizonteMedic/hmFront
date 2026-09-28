import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileInvoiceDollar, faFileExcel, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useSessionData } from "../../../../../hooks/useSessionData";
import { GenerarReporteTickets, GenerarExcelTickets } from "./controllerTicket";

const pad = (n) => String(n).padStart(2, "0");
const toISODate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

function getMondayOfWeek(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + diff);
    return d;
}

function defaultRange() {
    const hoy = new Date();
    const lunes = getMondayOfWeek(hoy);
    const domingo = new Date(lunes);
    domingo.setDate(lunes.getDate() + 6);
    return { desde: toISODate(lunes), hasta: toISODate(domingo) };
}

export default function Ticket() {
    const { token } = useSessionData();
    const [form, setForm] = useState(defaultRange());
    const [loadingPdf, setLoadingPdf] = useState(false);
    const [loadingExcel, setLoadingExcel] = useState(false);
    const cargando = loadingPdf || loadingExcel;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const handleGenerarPdf = async () => {
        setLoadingPdf(true);
        await GenerarReporteTickets(form.desde, form.hasta, token);
        setLoadingPdf(false);
    };

    const handleGenerarExcel = async () => {
        setLoadingExcel(true);
        await GenerarExcelTickets(form.desde, form.hasta, token);
        setLoadingExcel(false);
    };

    return (
        <div className="mx-auto max-w-2xl py-4">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-5">
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[#fc6b03]/10 text-[#fc6b03] shrink-0">
                        <FontAwesomeIcon icon={faFileInvoiceDollar} size="lg" />
                    </span>
                    <div>
                        <h2 className="text-lg font-bold text-[#233245]">Reporte de Tickets</h2>
                        <p className="text-sm text-gray-500">Genera el reporte de atención y servicios por ticket en un rango de fechas.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-semibold text-[#233245] mb-1">Fecha Inicio</label>
                        <input
                            type="date"
                            name="desde"
                            value={form.desde}
                            onChange={handleChange}
                            max={form.hasta || undefined}
                            className="w-full h-10 rounded-md border border-gray-300 bg-[#fafafa] px-3 text-sm outline-none focus:ring-2 focus:ring-[#233245]"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-[#233245] mb-1">Fecha Fin</label>
                        <input
                            type="date"
                            name="hasta"
                            value={form.hasta}
                            onChange={handleChange}
                            min={form.desde || undefined}
                            className="w-full h-10 rounded-md border border-gray-300 bg-[#fafafa] px-3 text-sm outline-none focus:ring-2 focus:ring-[#233245]"
                        />
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        type="button"
                        onClick={handleGenerarPdf}
                        disabled={cargando}
                        className="flex-1 flex items-center justify-center gap-2 bg-[#fc6b03] hover:bg-[#e35f00] text-white font-semibold px-6 py-2.5 rounded-md transition-all duration-150 ease-out active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        <FontAwesomeIcon icon={loadingPdf ? faSpinner : faFileInvoiceDollar} spin={loadingPdf} />
                        {loadingPdf ? "Generando..." : "Ticket Detallado"}
                    </button>
                    <button
                        type="button"
                        onClick={handleGenerarExcel}
                        disabled={cargando}
                        className="flex-1 flex items-center justify-center gap-2 bg-[#257a4e] hover:bg-[#1e6440] text-white font-semibold px-6 py-2.5 rounded-md transition-all duration-150 ease-out active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        <FontAwesomeIcon icon={loadingExcel ? faSpinner : faFileExcel} spin={loadingExcel} />
                        {loadingExcel ? "Generando..." : "Excel"}
                    </button>
                </div>
            </div>
        </div>
    );
}
