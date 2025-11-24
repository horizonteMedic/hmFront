import PropTypes from "prop-types";
import {
    InputTextOneLine,
    InputTextArea,
    InputsBooleanRadioGroup
} from "../../../../../components/reusableComponents/ResusableComponents";

export default function ExamenFisico({ form, handleChange, handleRadioButtonBoolean }) {
    return (
        <div className="p-4 space-y-4">
            {/* Medidas Antropométricas y Signos Vitales */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-black mb-4">Medidas Antropométricas y Signos Vitales</h4>
                {/* Primera fila */}
                <div className="grid grid-cols-4 gap-4 mb-4">
                    <InputTextOneLine
                        label="Frecuencia Cardiaca (x min)"
                        name="frecuenciaCardiaca"
                        value={form?.frecuenciaCardiaca}
                        disabled
                        labelWidth="120px"
                    />
                    <InputTextOneLine
                        label="Frecuencia Respiratoria (x min)"
                        name="frecuenciaRespiratoria"
                        value={form?.frecuenciaRespiratoria}
                        disabled
                        labelWidth="120px"
                    />
                    <InputTextOneLine
                        label="Presión Arterial (mmHg)"
                        name="presionArterial"
                        value={form?.presionArterial}
                        disabled
                        labelWidth="120px"
                    />
                    <InputTextOneLine
                        label="Talla (m)"
                        name="talla"
                        value={form?.talla}
                        disabled
                        labelWidth="120px"
                    />
                </div>
                {/* Segunda fila */}
                <div className="grid grid-cols-4 gap-4 mb-4">
                    <InputTextOneLine
                        label="Peso (kg)"
                        name="peso"
                        value={form?.peso}
                        disabled
                        labelWidth="120px"
                    />
                    <InputTextOneLine
                        label="IMC"
                        name="imc"
                        value={form?.imc}
                        className={form?.imcRed ? "text-red-600" : ""}
                        disabled
                        labelWidth="120px"
                    />
                    <InputTextOneLine
                        label="Perímetro Cuello (cm)"
                        name="perimetroCuello"
                        value={form?.perimetroCuello}
                        disabled
                        labelWidth="120px"
                    />
                    <InputTextOneLine
                        label="Perímetro de cintura (cm)"
                        name="perimetroCintura"
                        value={form?.perimetroCintura}
                        disabled
                        labelWidth="120px"
                    />
                </div>
                {/* Tercera fila */}
                <div className="grid grid-cols-4 gap-4">
                    <InputTextOneLine
                        label="Perímetro de cadera (cm)"
                        name="perimetroCadera"
                        value={form?.perimetroCadera}
                        disabled
                        labelWidth="120px"
                    />
                    <InputTextOneLine
                        label="ICC"
                        name="icc"
                        value={form?.icc}
                        disabled
                        labelWidth="120px"
                    />
                    <InputTextOneLine
                        label="P. Torácico Inspiración (cm)"
                        name="perimetroToracicoInspiracion"
                        value={form?.perimetroToracicoInspiracion}
                        disabled
                        labelWidth="120px"
                    />
                    <InputTextOneLine
                        label="P. Torácico Espiración (cm)"
                        name="perimetroToracicoEspiracion"
                        value={form?.perimetroToracicoEspiracion}
                        disabled
                        labelWidth="120px"
                    />
                </div>
            </div>
            {/* Hallazgos del Examen Físico */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-black mb-4">Hallazgos del Examen Físico</h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Columna Izquierda */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px]">Limitación en fuerza y/o movilidad de extremidades (Mayor a 2Kg / fuerza cada mano)</span>
                            <InputsBooleanRadioGroup
                                name="limitacionFuerzaExtremidades"
                                value={form?.limitacionFuerzaExtremidades}
                                onChange={handleRadioButtonBoolean}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[11px]">Alteración presente del equilibrio</span>
                            <InputsBooleanRadioGroup
                                name="alteracionEquilibrio"
                                value={form?.alteracionEquilibrio}
                                onChange={handleRadioButtonBoolean}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[11px]">Anormalidad en la marcha</span>
                            <InputsBooleanRadioGroup
                                name="anormalidadMarcha"
                                value={form?.anormalidadMarcha}
                                onChange={handleRadioButtonBoolean}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[11px]">Alteración de la coordinación presente (dedo nariz)</span>
                            <InputsBooleanRadioGroup
                                name="alteracionCoordinacionDedoNariz"
                                value={form?.alteracionCoordinacionDedoNariz}
                                onChange={handleRadioButtonBoolean}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[11px]">Asimetría facial</span>
                            <InputsBooleanRadioGroup
                                name="asimetriaFacial"
                                value={form?.asimetriaFacial}
                                onChange={handleRadioButtonBoolean}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[11px]">Sustentación en pie 1 &gt; 15°</span>
                            <InputsBooleanRadioGroup
                                name="sustentacionPie1"
                                value={form?.sustentacionPie1}
                                onChange={handleRadioButtonBoolean}
                            />
                        </div>
                    </div>
                    {/* Columna Derecha */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px]">Presencia de nistagmus</span>
                            <InputsBooleanRadioGroup
                                name="presenciaNistagmus"
                                value={form?.presenciaNistagmus}
                                onChange={handleRadioButtonBoolean}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[11px]">Anormalidad en movimientos oculares</span>
                            <InputsBooleanRadioGroup
                                name="anormalidadMovimientosOculares"
                                value={form?.anormalidadMovimientosOculares}
                                onChange={handleRadioButtonBoolean}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[11px]">Pupilas no CIRLA</span>
                            <InputsBooleanRadioGroup
                                name="pupilasNoCirla"
                                value={form?.pupilasNoCirla}
                                onChange={handleRadioButtonBoolean}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[11px]">Anormalidad del lenguaje</span>
                            <InputsBooleanRadioGroup
                                name="anormalidadLenguaje"
                                value={form?.anormalidadLenguaje}
                                onChange={handleRadioButtonBoolean}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[11px]">Movimientos involuntarios</span>
                            <InputsBooleanRadioGroup
                                name="movimientosInvoluntarios"
                                value={form?.movimientosInvoluntarios}
                                onChange={handleRadioButtonBoolean}
                            />
                        </div>
                    </div>
                </div>
                {/* Información Adicional - Dentro del mismo cuadro */}
                <div className="mt-6">
                    <InputTextArea
                        label="Detalle información"
                        name="detalleInformacionExamenFisico"
                        value={form?.detalleInformacionExamenFisico}
                        onChange={handleChange}
                        rows={4}
                    />
                </div>
            </div>
        </div>
    );
}

ExamenFisico.propTypes = {
    form: PropTypes.object.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleRadioButtonBoolean: PropTypes.func.isRequired,
};
