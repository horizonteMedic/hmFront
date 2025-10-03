import PropTypes from "prop-types";
import {
    InputTextOneLine,
    InputTextArea,
    InputsBooleanRadioGroup
} from "../../../../../components/reusableComponents/ResusableComponents";

export default function ExamenMedico({ form, handleChange, handleRadioButtonBoolean }) {
    return (
        <div className="p-4 space-y-6">
            {/* Medidas Antropométricas y Signos Vitales */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Medidas Antropométricas y Signos Vitales</h4>
                
                {/* Primera fila */}
                <div className="grid grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                        <label className="font-semibold text-gray-700 min-w-[60px]">FC:</label>
                        <InputTextOneLine
                            name="frecuenciaCardiaca"
                            value={form?.frecuenciaCardiaca || ""}
                            onChange={handleChange}
                            className="flex-1"
                        />
                        <span className="text-gray-500 text-sm">x min</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="font-semibold text-gray-700 min-w-[60px]">FR:</label>
                        <InputTextOneLine
                            name="frecuenciaRespiratoria"
                            value={form?.frecuenciaRespiratoria || ""}
                            onChange={handleChange}
                            className="flex-1"
                        />
                        <span className="text-gray-500 text-sm">x min</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="font-semibold text-gray-700 min-w-[60px]">PA:</label>
                        <InputTextOneLine
                            name="presionArterial"
                            value={form?.presionArterial || ""}
                            onChange={handleChange}
                            className="flex-1"
                        />
                        <span className="text-gray-500 text-sm">mmHg</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="font-semibold text-gray-700 min-w-[60px]">TALLA:</label>
                        <InputTextOneLine
                            name="talla"
                            value={form?.talla || ""}
                            onChange={handleChange}
                            className="flex-1"
                        />
                        <span className="text-gray-500 text-sm">m</span>
                    </div>
                </div>

                {/* Segunda fila */}
                <div className="grid grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                        <label className="font-semibold text-gray-700 min-w-[60px]">PESO:</label>
                        <InputTextOneLine
                            name="peso"
                            value={form?.peso || ""}
                            onChange={handleChange}
                            className="flex-1"
                        />
                        <span className="text-gray-500 text-sm">kg</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="font-semibold text-gray-700 min-w-[60px]">IMC:</label>
                        <InputTextOneLine
                            name="imc"
                            value={form?.imc || ""}
                            onChange={handleChange}
                            className="flex-1"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="font-semibold text-gray-700 min-w-[60px]">Perímetro Cuello:</label>
                        <InputTextOneLine
                            name="perimetroCuello"
                            value={form?.perimetroCuello || ""}
                            onChange={handleChange}
                            className="flex-1"
                        />
                        <span className="text-gray-500 text-sm">cm</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="font-semibold text-gray-700 min-w-[60px]">Perímetro de cintura:</label>
                        <InputTextOneLine
                            name="perimetroCintura"
                            value={form?.perimetroCintura || ""}
                            onChange={handleChange}
                            className="flex-1"
                        />
                        <span className="text-gray-500 text-sm">cm</span>
                    </div>
                </div>

                {/* Tercera fila */}
                <div className="grid grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                        <label className="font-semibold text-gray-700 min-w-[60px]">Perímetro de Cadera:</label>
                        <InputTextOneLine
                            name="perimetroCadera"
                            value={form?.perimetroCadera || ""}
                            onChange={handleChange}
                            className="flex-1"
                        />
                        <span className="text-gray-500 text-sm">cm</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="font-semibold text-gray-700 min-w-[60px]">ICC:</label>
                        <InputTextOneLine
                            name="icc"
                            value={form?.icc || ""}
                            onChange={handleChange}
                            className="flex-1"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="font-semibold text-gray-700 min-w-[60px]">P. Torácico Inspiración:</label>
                        <InputTextOneLine
                            name="perimetroToracicoInspiracion"
                            value={form?.perimetroToracicoInspiracion || ""}
                            onChange={handleChange}
                            className="flex-1"
                        />
                        <span className="text-gray-500 text-sm">cm</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="font-semibold text-gray-700 min-w-[60px]">P. Torácico Espiración:</label>
                        <InputTextOneLine
                            name="perimetroToracicoEspiracion"
                            value={form?.perimetroToracicoEspiracion || ""}
                            onChange={handleChange}
                            className="flex-1"
                        />
                        <span className="text-gray-500 text-sm">cm</span>
                    </div>
                </div>
            </div>

            {/* Hallazgos del Examen Físico */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Hallazgos del Examen Físico</h4>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Columna Izquierda */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm">Limitación en fuerza y/o movilidad de extremidades (Mayor a 5Kg / fuerza cada mano)</span>
                            <InputsBooleanRadioGroup
                                name="limitacionFuerzaExtremidades"
                                value={form?.limitacionFuerzaExtremidades}
                                onChange={handleRadioButtonBoolean}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm">Alteración presente del equilibrio. (Romberg)</span>
                            <InputsBooleanRadioGroup
                                name="alteracionEquilibrioRomberg"
                                value={form?.alteracionEquilibrioRomberg}
                                onChange={handleRadioButtonBoolean}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm">Anormalidad en la marcha con ojos cerrados.</span>
                            <InputsBooleanRadioGroup
                                name="anormalidadMarchaOjosCerrados"
                                value={form?.anormalidadMarchaOjosCerrados}
                                onChange={handleRadioButtonBoolean}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm">Alteración de la coordinación (dedo índice nariz)</span>
                            <InputsBooleanRadioGroup
                                name="alteracionCoordinacionDedoNariz"
                                value={form?.alteracionCoordinacionDedoNariz}
                                onChange={handleRadioButtonBoolean}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm">Asimetría facial</span>
                            <InputsBooleanRadioGroup
                                name="asimetriaFacial"
                                value={form?.asimetriaFacial}
                                onChange={handleRadioButtonBoolean}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm">Sustentación en 1 pie &gt; 15°</span>
                            <InputsBooleanRadioGroup
                                name="sustentacionUnPie"
                                value={form?.sustentacionUnPie}
                                onChange={handleRadioButtonBoolean}
                            />
                        </div>
                    </div>

                    {/* Columna Derecha */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm">Presencia de nistagmus</span>
                            <InputsBooleanRadioGroup
                                name="presenciaNistagmus"
                                value={form?.presenciaNistagmus}
                                onChange={handleRadioButtonBoolean}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm">Anormalidad en movimientos oculares</span>
                            <InputsBooleanRadioGroup
                                name="anormalidadMovimientosOculares"
                                value={form?.anormalidadMovimientosOculares}
                                onChange={handleRadioButtonBoolean}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm">Pupilas no CIRLA</span>
                            <InputsBooleanRadioGroup
                                name="pupilasNoCirla"
                                value={form?.pupilasNoCirla}
                                onChange={handleRadioButtonBoolean}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm">Anormalidad del lenguaje</span>
                            <InputsBooleanRadioGroup
                                name="anormalidadLenguaje"
                                value={form?.anormalidadLenguaje}
                                onChange={handleRadioButtonBoolean}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm">Movimientos involuntarios</span>
                            <InputsBooleanRadioGroup
                                name="movimientosInvoluntarios"
                                value={form?.movimientosInvoluntarios}
                                onChange={handleRadioButtonBoolean}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Información Adicional */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Información Adicional</h4>
                <InputTextArea
                    label="Detalle información:"
                    name="detalleInformacionExamenMedico"
                    value={form?.detalleInformacionExamenMedico || ""}
                    onChange={handleChange}
                    rows={4}
                />
            </div>
        </div>
    );
}

ExamenMedico.propTypes = {
    form: PropTypes.object.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleRadioButtonBoolean: PropTypes.func.isRequired,
};
