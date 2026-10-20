import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxOpen, faDolly, faFileExcel, faPrescriptionBottleMedical, faSpinner } from "@fortawesome/free-solid-svg-icons";
import InputCheckbox from "../../../../../components/reusableComponents/InputCheckbox";
import InputTextOneLine from "../../../../../components/reusableComponents/InputTextOneLine";
import SectionFieldset from "../../../../../components/reusableComponents/SectionFieldset";
import { useSessionData } from "../../../../../hooks/useSessionData";
import AvisoError from "../../Inventario/Compartido/components/AvisoError";
import SelectorInventario from "../../Inventario/Compartido/components/SelectorInventario";
import { useInventarios } from "../../Inventario/Compartido/hooks/useInventarios";
import { rangoMesActual } from "../../Inventario/Compartido/inventarioUtils";
import { GenerarExcelEntregas, GenerarExcelIngresos, GenerarExcelRetiros } from "./controllerMedicamentos";

const ANCHO_ETIQUETA = "110px";

function TarjetaReporte({ icono, titulo, descripcion, children, generando, deshabilitado, onGenerar }) {
    return (
        <div className="flex flex-col bg-white rounded-lg border border-gray-200 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-3">
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[#fc6b03]/10 text-[#fc6b03] shrink-0">
                    <FontAwesomeIcon icon={icono} size="lg" />
                </span>
                <h3 className="text-base font-bold text-[#233245]">{titulo}</h3>
            </div>
            <p className="text-sm text-gray-500 mb-4">{descripcion}</p>
            <div className="flex-1 mb-4">{children}</div>
            <button
                type="button"
                onClick={onGenerar}
                disabled={deshabilitado}
                className="flex items-center justify-center gap-2 bg-[#257a4e] hover:bg-[#1e6440] text-white font-semibold px-6 py-2.5 rounded-md transition-all duration-150 ease-out active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
                <FontAwesomeIcon icon={generando ? faSpinner : faFileExcel} spin={generando} />
                {generando ? "Generando..." : "Excel"}
            </button>
        </div>
    );
}

export default function Medicamentos() {
    const { token } = useSessionData();
    const { inventarios, inventarioId, setInventarioId, inventarioActual, errorInventarios, cargarInventarios } = useInventarios(token);
    const [rango, setRango] = useState(rangoMesActual);
    const [incluirReceta, setIncluirReceta] = useState(true);
    const [incluirArea, setIncluirArea] = useState(true);
    const [generando, setGenerando] = useState("");

    const filtros = {
        inventarioId,
        inventarioNombre: inventarioActual?.nombre ?? "",
        desde: rango.desde,
        hasta: rango.hasta,
    };

    // Un solo reporte a la vez: mientras se genera uno, los demás botones quedan deshabilitados.
    const generar = async (clave, accion) => {
        setGenerando(clave);
        try {
            await accion();
        } finally {
            setGenerando("");
        }
    };

    const sinTipoDeEntrega = !incluirReceta && !incluirArea;
    const deshabilitar = (clave) => !inventarioId || generando !== "" || (clave === "entregas" && sinTipoDeEntrega);

    return (
        <div className="space-y-4 px-4 pb-4">
            <SectionFieldset legend="Reportes de Medicamentos">
                <AvisoError mensaje={errorInventarios} onRetry={cargarInventarios} />

                <div className="grid grid-cols-1 md:grid-cols-3 items-start gap-4 mb-5">
                    <SelectorInventario
                        inventarios={inventarios}
                        inventarioId={inventarioId}
                        onChange={(e) => setInventarioId(e.target.value)}
                        labelWidth={ANCHO_ETIQUETA}
                    />
                    <InputTextOneLine
                        label="Desde"
                        name="desde"
                        type="date"
                        labelWidth={ANCHO_ETIQUETA}
                        value={rango.desde}
                        max={rango.hasta || undefined}
                        onChange={(e) => setRango((prev) => ({ ...prev, desde: e.target.value }))}
                    />
                    <InputTextOneLine
                        label="Hasta"
                        name="hasta"
                        type="date"
                        labelWidth={ANCHO_ETIQUETA}
                        value={rango.hasta}
                        onChange={(e) => setRango((prev) => ({ ...prev, hasta: e.target.value }))}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <TarjetaReporte
                        icono={faPrescriptionBottleMedical}
                        titulo="Entregas de medicamentos"
                        descripcion="Detalle de lo entregado en el rango, con un resumen del total y de cuántas unidades se entregaron de cada medicamento. No incluye reservas."
                        generando={generando === "entregas"}
                        deshabilitado={deshabilitar("entregas")}
                        onGenerar={() => generar("entregas", () => GenerarExcelEntregas({ ...filtros, incluirReceta, incluirArea }, token))}
                    >
                        <p className="text-sm font-semibold text-[#233245] mb-1">Incluir entregas</p>
                        <div className="flex flex-wrap gap-x-6 gap-y-1">
                            <InputCheckbox label="Por receta" name="incluirReceta" checked={incluirReceta} onChange={(e) => setIncluirReceta(e.target.checked)} />
                            <InputCheckbox label="A áreas" name="incluirArea" checked={incluirArea} onChange={(e) => setIncluirArea(e.target.checked)} />
                        </div>
                        {sinTipoDeEntrega && <p className="mt-1 text-xs text-red-600">Marque al menos una opción.</p>}
                    </TarjetaReporte>

                    <TarjetaReporte
                        icono={faDolly}
                        titulo="Ingresos de stock"
                        descripcion="Ingresos de medicamentos al inventario en el rango, con su cantidad y lote."
                        generando={generando === "ingresos"}
                        deshabilitado={deshabilitar("ingresos")}
                        onGenerar={() => generar("ingresos", () => GenerarExcelIngresos(filtros, token))}
                    />

                    <TarjetaReporte
                        icono={faBoxOpen}
                        titulo="Retiros de medicamentos"
                        descripcion="Detalle de los retiros por vencimiento, pérdida u otros motivos, con un resumen del total y de cuántas unidades se retiraron de cada medicamento."
                        generando={generando === "retiros"}
                        deshabilitado={deshabilitar("retiros")}
                        onGenerar={() => generar("retiros", () => GenerarExcelRetiros(filtros, token))}
                    />
                </div>
            </SectionFieldset>
        </div>
    );
}
