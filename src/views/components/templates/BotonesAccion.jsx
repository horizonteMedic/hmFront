import { faBroom, faPrint, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function BotonesAccion({
    form,
    handleSave,
    handleClear,
    handlePrint,
    handleChangeNumberDecimals,
    hideSave = false,
    hideClear = false,
    hidePrint = false,
}) {
    return (
        <section className="flex flex-col md:flex-row justify-between items-center gap-4 px-4">
            <div className="flex gap-4">
                {!hideSave && (
                    <button
                        type="button"
                        onClick={handleSave}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-base px-6 py-2 rounded flex items-center gap-2"
                    >
                        <FontAwesomeIcon icon={faSave} /> Guardar/Actualizar
                    </button>
                )}

                {!hideClear && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="bg-amber-500 hover:bg-amber-600 text-white text-base px-6 py-2 rounded flex items-center gap-2"
                    >
                        <FontAwesomeIcon icon={faBroom} /> Limpiar
                    </button>
                )}
            </div>

            {!hidePrint && (
                <div className="flex flex-col items-end">
                    <span className="font-bold italic text-base mb-1">IMPRIMIR</span>
                    <div className="flex items-center gap-2">
                        <input
                            name="norden"
                            value={form.norden}
                            onChange={handleChangeNumberDecimals}
                            onKeyUp={(e) => e.key === "Enter" && handlePrint()}
                            className="border rounded px-2 py-1 text-base w-24"
                        />

                        <button
                            type="button"
                            onClick={handlePrint}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-base px-4 py-2 rounded flex items-center gap-2"
                        >
                            <FontAwesomeIcon icon={faPrint} />
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}


{/* 
    <BotonesAccion
    form={form}
    handleSave={handleSave}
    handleClear={handleClear}
    handlePrint={handlePrint}
    handleChangeNumberDecimals={handleChangeNumberDecimals}
    /> 
*/}