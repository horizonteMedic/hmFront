import {
    InputTextArea,
    InputsBooleanRadioGroup
} from "../../../../../components/reusableComponents/ResusableComponents";

export default function PruebasComplementarias({ form, handleChange, handleRadioButtonBoolean }) {
    return (
        <div className="p-4 space-y-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-black mb-4">Pruebas Complementarias</h4>

                <div className="space-y-3">
                    {/* Lista vertical de pruebas - una por fila */}
                    <div className="flex items-start justify-between">
                        <span className="text-[11px] pr-4 flex-1">
                            Se encuentra usted resfriado o con algún cuadro respiratorio
                        </span>
                        <InputsBooleanRadioGroup
                            name="resfriadoCuadroRespiratorio"
                            value={form?.resfriadoCuadroRespiratorio}
                            onChange={handleRadioButtonBoolean}
                        />
                    </div>

                    <div className="flex items-start justify-between">
                        <span className="text-[11px] pr-4 flex-1">
                            Sufre de vértigo o mareos
                        </span>
                        <InputsBooleanRadioGroup
                            name="vertigoMareos"
                            value={form?.vertigoMareos}
                            onChange={handleRadioButtonBoolean}
                        />
                    </div>

                    <div className="flex items-start justify-between">
                        <span className="text-[11px] pr-4 flex-1">
                            Temor a las alturas
                        </span>
                        <InputsBooleanRadioGroup
                            name="temorAlturas"
                            value={form?.temorAlturas}
                            onChange={handleRadioButtonBoolean}
                        />
                    </div>

                    <div className="flex items-start justify-between">
                        <span className="text-[11px] pr-4 flex-1">
                            Hipoacusia con compromiso de frecuencias conversacionales con promedio mayor de 40 db uni o bilateral incluso con audífonos
                        </span>
                        <InputsBooleanRadioGroup
                            name="hipoacusiaFrecuenciasConversacionales"
                            value={form?.hipoacusiaFrecuenciasConversacionales}
                            onChange={handleRadioButtonBoolean}
                        />
                    </div>

                    <div className="flex items-start justify-between">
                        <span className="text-[11px] pr-4 flex-1">
                            Alteración de la agudeza visual (de lejos diferente a 20/30 en cada ojo) y/o de la visión de profundidad incluso con lentes correctores.
                        </span>
                        <InputsBooleanRadioGroup
                            name="alteracionAgudezaVisual"
                            value={form?.alteracionAgudezaVisual}
                            onChange={handleRadioButtonBoolean}
                        />
                    </div>

                    <div className="flex items-start justify-between">
                        <span className="text-[11px] pr-4 flex-1">
                            Campimetría Anormal (Test de confrontación alterada)
                        </span>
                        <InputsBooleanRadioGroup
                            name="campimetriaAnormal"
                            value={form?.campimetriaAnormal}
                            onChange={handleRadioButtonBoolean}
                        />
                    </div>

                    {/* Sección de Otros Datos de Relevancia */}
                    <div className="mt-8 pt-6 border-t border-gray-200">

                        <div className="space-y-4">
                            <InputTextArea
                                label="Detalle las medicinas que están tomando"
                                rows={4}
                                name="medicinasTomando"
                                value={form?.medicinasTomando}
                                onChange={handleChange}
                            />
                            <InputTextArea
                                label="Comentarios/Detalles Antecedentes"
                                rows={4}
                                name="otrosDatosRelevancia"
                                value={form?.otrosDatosRelevancia}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
