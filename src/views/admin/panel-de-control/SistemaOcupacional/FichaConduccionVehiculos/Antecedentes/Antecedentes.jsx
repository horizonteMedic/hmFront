import {
    InputTextArea,
    InputsBooleanRadioGroup
} from "../../../../../components/reusableComponents/ResusableComponents";

export default function Antecedentes({ form, handleChange, handleRadioButtonBoolean }) {
    return (
        <div className="p-4 space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Antecedentes</h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Columna Izquierda */}
                    <div className="space-y-4">
                        <div className="flex items-start justify-between">
                            <span className=" pr-4">
                                Todas las enfermedades que produzcan alteración de la consciencia sin importar su causa e independiente de su tratamiento
                            </span>
                            <InputsBooleanRadioGroup
                                name="alteracionConsciencia"
                                value={form?.alteracionConsciencia}
                                onChange={handleRadioButtonBoolean}
                            />
                        </div>
                        <div className="flex items-start justify-between">
                            <span className=" pr-4">
                                Alcoholismo crónico y en general todas aquellas enfermedades que produzcan incapacidad de efectuar movimientos voluntarios y/o que limiten la capacidad de trabajo como conducción, manejo o control físico de un vehículo motorizado, subir y bajar escaleras, etc.
                            </span>
                            <InputsBooleanRadioGroup
                                name="alcoholismoCronico"
                                value={form?.alcoholismoCronico}
                                onChange={handleRadioButtonBoolean}
                            />
                        </div>
                        <div className="flex items-start justify-between">
                            <span className=" pr-4">
                                Todas aquellas enfermedades que se caractericen por movimientos involuntarios y que interfieran seriamente su capacidad de trabajar, independiente de su tratamiento farmacológico.
                            </span>
                            <InputsBooleanRadioGroup
                                name="movimientosInvoluntariosEnfermedades"
                                value={form?.movimientosInvoluntariosEnfermedades}
                                onChange={handleRadioButtonBoolean}
                            />
                        </div>
                        <div className="flex items-start justify-between">
                            <span className=" pr-4">
                                Pérdida recurrente de la consciencia, independiente de su tratamiento, tales como narcolepsia, epilepsia, etc.
                            </span>
                            <InputsBooleanRadioGroup
                                name="perdidaRecurrenteConsciencia"
                                value={form?.perdidaRecurrenteConsciencia}
                                onChange={handleRadioButtonBoolean}
                            />
                        </div>
                        <div className="flex items-start justify-between">
                            <span className=" pr-4">
                                Diabetes mellitus o hipoglicemia no controlada
                            </span>
                            <InputsBooleanRadioGroup
                                name="diabetesHipoglicemiaNoControlada"
                                value={form?.diabetesHipoglicemiaNoControlada}
                                onChange={handleRadioButtonBoolean}
                            />
                        </div>
                        <div className="flex items-start justify-between">
                            <span className=" pr-4">
                                Insuficiencia renal crónica grado IV.
                            </span>
                            <InputsBooleanRadioGroup
                                name="insuficienciaRenalCronicaGradoIV"
                                value={form?.insuficienciaRenalCronicaGradoIV}
                                onChange={handleRadioButtonBoolean}
                            />
                        </div>
                    </div>

                    {/* Columna Derecha */}
                    <div className="space-y-4">
                        <div className="flex items-start justify-between">
                            <span className=" pr-4">
                                Personas que como consecuencia de una enfermedad o su tratamiento, sufran uno o varios de los siguientes efectos: alteración del estado de consciencia, alteración del equilibrio, en la percepción, en la habilidad motriz, en la estabilidad emocional y en el juicio.
                            </span>
                            <InputsBooleanRadioGroup
                                name="efectosEnfermedadTratamiento"
                                value={form?.efectosEnfermedadTratamiento}
                                onChange={handleRadioButtonBoolean}
                            />
                        </div>
                        <div className="flex items-start justify-between">
                            <span className=" pr-4">
                                Personas que consumen sustancias estupefacientes o psicotrópicas en niveles que no alteren su capacidad de trabajar, pero que se encuentran sin tratamiento o en tratamiento sin prescripción médica.
                            </span>
                            <InputsBooleanRadioGroup
                                name="sustanciasEstupefacientesSinTratamiento"
                                value={form?.sustanciasEstupefacientesSinTratamiento}
                                onChange={handleRadioButtonBoolean}
                            />
                        </div>
                        <div className="flex items-start justify-between">
                            <span className=" pr-4">
                                Personas que consumen sustancias estupefacientes o psicotrópicas en niveles que alteren su capacidad o trabajar como controlar un vehículo.
                            </span>
                            <InputsBooleanRadioGroup
                                name="sustanciasEstupefacientesConAlteracion"
                                value={form?.sustanciasEstupefacientesConAlteracion}
                                onChange={handleRadioButtonBoolean}
                            />
                        </div>
                        <div className="flex items-start justify-between">
                            <span className=" pr-4">
                                Síndrome Apnea Obstructiva del sueño. sospecha o confirmada (Ficha sas)
                            </span>
                            <InputsBooleanRadioGroup
                                name="sindromeApneaObstructivaSueño"
                                value={form?.sindromeApneaObstructivaSueño}
                                onChange={handleRadioButtonBoolean}
                            />
                        </div>
                        <div className="flex items-start justify-between">
                            <span className=" pr-4">
                                Obesidad (IMC &gt; o igual a 30)
                            </span>
                            <InputsBooleanRadioGroup
                                name="obesidadIMC30"
                                value={form?.obesidadIMC30}
                                onChange={handleRadioButtonBoolean}
                            />
                        </div>
                        <div className="flex items-start justify-between">
                            <span className=" pr-4">
                                Anemia de cualquier grado, según criterios OMS 2011.
                            </span>
                            <InputsBooleanRadioGroup
                                name="anemiaCriteriosOMS2011"
                                value={form?.anemiaCriteriosOMS2011}
                                onChange={handleRadioButtonBoolean}
                            />
                        </div>
                        <div className="mt-6">
                            <InputTextArea
                                label="Comentarios/Detalle"
                                name="comentariosDetalleAntecedentes"
                                value={form?.comentariosDetalleAntecedentes}
                                onChange={handleChange}
                                rows={4}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
