import { InputCheckbox, InputTextArea, InputTextOneLine, InputsBooleanRadioGroup } from "../../../../../components/reusableComponents/ResusableComponents";

export default function MinerosdelNorte({
    form,
    setForm,
    handleChange,
    handleChangeSimple,
    handleChangeNumber,
    handleCheckBoxChange,
    handleRadioButtonBoolean
}) {
    return (
        <div className="space-y-4">
            {/* Sección normal - solo se muestra cuando BOROO NO está activado */}
            <div className="bg-white border border-gray-200 rounded-lg p-3 gap-3">
                <h4 className="font-semibold mb-3">ANTECEDENTES RELACIONADOS AL TRABAJO</h4>
                {/* Lista de síntomas en 3 columnas */}
                <div className="flex flex-col gap-3">
                    <InputTextOneLine label="Puesto al que Postula" name="puestoP" value={form?.puestoP} onChange={handleChange} labelWidth="120px" />
                    <InputTextOneLine label="Tiempo de Experiencia" name="tiempoExp" value={form?.tiempoExp} onChange={handleChange} labelWidth="120px" />
                </div>

            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-3 gap-3 flex flex-col justify-center items-center">
                <div className="flex gap-3 mt-3 justify-center items-center">
                    <label htmlFor="">Ha Sufrido algún accidene relacionado al trabajo</label>
                    <InputsBooleanRadioGroup
                        name="drogas"
                        value={form?.drogas}
                        onChange={handleRadioButtonBoolean}
                    />
                    <InputTextOneLine label="Fecha del Accidente(s)" name="fechaExam" type="date" value={form?.fechaExam} onChange={handleChangeSimple} />
                </div>

                <h1 className="font-bold text-lg text-center">Si la Respuesta es SI, responder las lineas inferiores</h1>

                <div className="flex gap-3 mt-3 justify-center items-center">
                    <label htmlFor="">Hubo un tiempo perdido (descanso médico)</label>
                    <InputsBooleanRadioGroup
                        name="drogas"
                        value={form?.drogas}
                        onChange={handleRadioButtonBoolean}
                    />
                    <InputTextOneLine label="Tiempo de incapacidad" name="fechaExam" value={form?.tiempoIncapacidad} onChange={handleChangeSimple} />
                    <label htmlFor="">(meses)</label>
                </div>

                <div className="flex gap-3 mt-3 justify-center items-center w-[50%]">
                    <InputTextArea
                        label="Especifique la causa básica (o describa el evento)"
                        name="desarrollo"
                        value={form?.desarrollo}
                        onChange={handleChange}
                        rows={2}
                    />

                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-3 gap-3 flex flex-col justify-center items-center">
                <div className="flex gap-3 mt-3 justify-center items-center">
                    <label htmlFor="">Ha sido declarado con alguna enfermedad profesional o relacionada al trabajo</label>
                    <InputsBooleanRadioGroup
                        name="drogas"
                        value={form?.drogas}
                        onChange={handleRadioButtonBoolean}
                    />
                </div>

                <h1 className="font-bold text-lg text-center">Si la Respuesta es SI, responder las lineas inferiores</h1>

                <div className="flex gap-3 mt-3 justify-center items-center">
                    <label htmlFor="">Ha Sido evaluado para calificación de enfermedad laboral</label>
                    <InputsBooleanRadioGroup
                        name="drogas"
                        value={form?.drogas}
                        onChange={handleRadioButtonBoolean}
                    />
                </div>

                <div className="flex gap-3 mt-3 justify-center items-center ">
                    <InputTextOneLine label="Especifique cual" name="fechaExam" value={form?.tiempoIncapacidad} onChange={handleChangeSimple} />
                    <InputTextOneLine label="Fecha del Accidente(s)" name="fechaExam" type="date" value={form?.fechaExam} onChange={handleChangeSimple} />

                </div>
            </div>

            {/* Medicamentos y Actividad Física */}

        </div>
    );
}
