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
                    <InputTextOneLine
                        label="FC (x min)"
                        name="frecuenciaCardiaca"
                        value={form?.frecuenciaCardiaca}
                        disabled
                    />
                    <InputTextOneLine
                        label="FR (x min)"
                        name="frecuenciaRespiratoria"
                        value={form?.frecuenciaRespiratoria}
                        disabled
                    />
                    <InputTextOneLine
                        label="PA (mmHg)"
                        name="presionArterial"
                        value={form?.presionArterial}
                        disabled
                    />
                    <InputTextOneLine
                        label="TALLA (m)"
                        name="talla"
                        value={form?.talla}
                        disabled
                    />
                </div>
                {/* Segunda fila */}
                <div className="grid grid-cols-4 gap-4 mb-4">
                    <InputTextOneLine
                        label="PESO (kg)"
                        name="peso"
                        value={form?.peso}
                        onChange={handleChange}
                        disabled
                    />
                    <InputTextOneLine
                        label="IMC"
                        name="imc"
                        value={form?.imc}
                        onChange={handleChange}
                        disabled
                    />
                    <InputTextOneLine
                        label="Perímetro Cuello (cm)"
                        name="perimetroCuello"
                        value={form?.perimetroCuello}
                        onChange={handleChange}
                        disabled
                    />
                    <InputTextOneLine
                        label="Perímetro de Cintura (cm)"
                        name="perimetroCintura"
                        value={form?.perimetroCintura}
                        onChange={handleChange}
                        disabled
                    />
                </div>
                {/* Tercera fila */}
                <div className="grid grid-cols-4 gap-4">
                    <InputTextOneLine
                        label="Perímetro de Cadera (cm)"
                        name="perimetroCadera"
                        value={form?.perimetroCadera}
                        disabled
                    />
                    <InputTextOneLine
                        label="ICC"
                        name="icc"
                        value={form?.icc}
                        disabled
                    />
                    <InputTextOneLine
                        label="P. Torácico Inspiración (cm)"
                        name="perimetroToracicoInspiracion"
                        value={form?.perimetroToracicoInspiracion}
                        disabled
                    />
                    <InputTextOneLine
                        label="P. Torácico Espiración (cm)"
                        name="perimetroToracicoEspiracion"
                        value={form?.perimetroToracicoEspiracion}
                        disabled
                    />
                </div>
            </div>
            {/* Hallazgos del Examen Físico */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Hallazgos del Examen Físico</h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Columna Izquierda */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span>Limitación en fuerza y/o movilidad de extremidades (Mayor a 5Kg / fuerza cada mano)</span>
                            <InputsBooleanRadioGroup
                                name="limitacionFuerzaExtremidades"
                                value={form?.limitacionFuerzaExtremidades}
                                onChange={handleRadioButtonBoolean}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <span>Alteración presente del equilibrio. (Romberg)</span>
                            <InputsBooleanRadioGroup
                                name="alteracionEquilibrioRomberg"
                                value={form?.alteracionEquilibrioRomberg}
                                onChange={handleRadioButtonBoolean}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <span>Anormalidad en la marcha con ojos cerrados.</span>
                            <InputsBooleanRadioGroup
                                name="anormalidadMarchaOjosCerrados"
                                value={form?.anormalidadMarchaOjosCerrados}
                                onChange={handleRadioButtonBoolean}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <span>Alteración de la coordinación (dedo índice nariz)</span>
                            <InputsBooleanRadioGroup
                                name="alteracionCoordinacionDedoNariz"
                                value={form?.alteracionCoordinacionDedoNariz}
                                onChange={handleRadioButtonBoolean}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <span>Asimetría facial</span>
                            <InputsBooleanRadioGroup
                                name="asimetriaFacial"
                                value={form?.asimetriaFacial}
                                onChange={handleRadioButtonBoolean}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <span>Sustentación en 1 pie &gt; 15°</span>
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
                            <span>Presencia de nistagmus</span>
                            <InputsBooleanRadioGroup
                                name="presenciaNistagmus"
                                value={form?.presenciaNistagmus}
                                onChange={handleRadioButtonBoolean}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <span>Anormalidad en movimientos oculares</span>
                            <InputsBooleanRadioGroup
                                name="anormalidadMovimientosOculares"
                                value={form?.anormalidadMovimientosOculares}
                                onChange={handleRadioButtonBoolean}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <span>Pupilas no CIRLA</span>
                            <InputsBooleanRadioGroup
                                name="pupilasNoCirla"
                                value={form?.pupilasNoCirla}
                                onChange={handleRadioButtonBoolean}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <span>Anormalidad del lenguaje</span>
                            <InputsBooleanRadioGroup
                                name="anormalidadLenguaje"
                                value={form?.anormalidadLenguaje}
                                onChange={handleRadioButtonBoolean}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <span>Movimientos involuntarios</span>
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
                    label="Detalle información"
                    name="detalleInformacionExamenMedico"
                    value={form?.detalleInformacionExamenMedico}
                    onChange={handleChange}
                    rows={4}
                />
            </div>
        </div >
    );
}


