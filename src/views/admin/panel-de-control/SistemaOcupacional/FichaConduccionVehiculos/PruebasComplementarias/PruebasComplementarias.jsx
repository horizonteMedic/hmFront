import PropTypes from "prop-types";
import {
    InputTextOneLine,
    InputsBooleanRadioGroup
} from "../../../../../components/reusableComponents/ResusableComponents";

export default function PruebasComplementarias({ form, handleChange, handleRadioButtonBoolean }) {
    return (
        <div className="p-4 space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Pruebas Complementarias</h4>
                
                <div className="space-y-3">
                    {/* Lista vertical de pruebas - una por fila */}
                    <div className="flex items-start justify-between">
                        <span className="text-sm pr-4 flex-1">
                            Hipoacusia con compromiso de frecuencias conversacionales (500, 1000 y 2000 Hz) con promedio mayor de 40 db uni o bilateral incluso con audifonos
                        </span>
                        <InputsBooleanRadioGroup
                            name="hipoacusiaFrecuenciasConversacionales"
                            value={form?.hipoacusiaFrecuenciasConversacionales}
                            onChange={handleRadioButtonBoolean}
                        />
                    </div>

                    <div className="flex items-start justify-between">
                        <span className="text-sm pr-4 flex-1">
                            Alteración de agudeza visual(de lejos diferente a 20/20 en cada ojo) y/o de la visión de profundidad incluso con lentes correctores.
                        </span>
                        <InputsBooleanRadioGroup
                            name="alteracionAgudezaVisual"
                            value={form?.alteracionAgudezaVisual}
                            onChange={handleRadioButtonBoolean}
                        />
                    </div>

                    <div className="flex items-start justify-between">
                        <span className="text-sm pr-4 flex-1">
                            No reconocimiento de colores Rojo, Amarillo y Verde
                        </span>
                        <InputsBooleanRadioGroup
                            name="noReconocimientoColores"
                            value={form?.noReconocimientoColores}
                            onChange={handleRadioButtonBoolean}
                        />
                    </div>

                    <div className="flex items-start justify-between">
                        <span className="text-sm pr-4 flex-1">
                            Campimetría Anormal (Test de confrontación alterada)
                        </span>
                        <InputsBooleanRadioGroup
                            name="campimetriaAnormal"
                            value={form?.campimetriaAnormal}
                            onChange={handleRadioButtonBoolean}
                        />
                    </div>

                    <div className="flex items-start justify-between">
                        <span className="text-sm pr-4 flex-1">
                            Prueba de vision de profundidad alterada
                        </span>
                        <InputsBooleanRadioGroup
                            name="pruebaVisionProfundidadAlterada"
                            value={form?.pruebaVisionProfundidadAlterada}
                            onChange={handleRadioButtonBoolean}
                        />
                    </div>

                    <div className="flex items-start justify-between">
                        <span className="text-sm pr-4 flex-1">
                            Test de SAS: Anormal
                        </span>
                        <InputsBooleanRadioGroup
                            name="testSASAnormal"
                            value={form?.testSASAnormal}
                            onChange={handleRadioButtonBoolean}
                        />
                    </div>

                    <div className="flex items-start justify-between">
                        <span className="text-sm pr-4 flex-1">
                            Alguno de los parámetros de la evaluación psicosensométrica alterada: test de palanca, punteo o Reactimetria Alterado
                        </span>
                        <InputsBooleanRadioGroup
                            name="evaluacionPsicosensometricaAlterada"
                            value={form?.evaluacionPsicosensometricaAlterada}
                            onChange={handleRadioButtonBoolean}
                        />
                    </div>

                    {/* Sección de Otros Datos de Relevancia */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <h5 className="text-lg font-semibold text-gray-800 mb-4">5.- OTROS DATOS DE RELEVANCIA</h5>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Detalle las medicinas que están tomando:
                                </label>
                                <InputTextOneLine
                                    name="medicinasTomando"
                                    value={form?.medicinasTomando || ""}
                                    onChange={handleChange}
                                    className="w-full"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Otros:
                                </label>
                                <InputTextOneLine
                                    name="otrosDatosRelevancia"
                                    value={form?.otrosDatosRelevancia || ""}
                                    onChange={handleChange}
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

PruebasComplementarias.propTypes = {
    form: PropTypes.object.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleRadioButtonBoolean: PropTypes.func.isRequired,
};
