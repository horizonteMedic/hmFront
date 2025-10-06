import InputCheckbox from "../../../../components/reusableComponents/InputCheckbox";
import InputTextOneLine from "../../../../components/reusableComponents/InputTextOneLine";
import useRealTime from "../../../../hooks/useRealTime";

const Initialform = {

}

export default function FichaInterconsulta() {
    return (
        <>
            <div className="space-y-6 max-w-[95%] mx-auto">
                {/* Header */}
                <section className="bg-white border border-gray-200 rounded-lg p-4 w-full">
                    {/* Fila de inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                        <InputTextOneLine label="N° Orden" name="norden" />
                        <InputTextOneLine label="Fecha de Examen" type="date" name="fechaExam" />
                        <InputTextOneLine label="Especialidad" name="tipoExamen" />
                        <InputTextOneLine label="Puesto de Trabajo" name="tipoLicencia" />
                    </div>

                    {/* Hora en tiempo real */}
                    <div className="flex justify-end mt-3">
                        <h1 className="text-lg font-bold">{useRealTime()}</h1>
                    </div>

                    {/* Checkboxes en grid responsivo */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-9 gap-3 mt-4">
                        <InputCheckbox label="Oftalmología" labelRight />
                        <InputCheckbox label="Cardiología" labelRight />
                        <InputCheckbox label="Neumología" labelRight />
                        <InputCheckbox label="Medicina Interna" labelRight />
                        <InputCheckbox label="Endocrinología" labelRight />
                        <InputCheckbox label="Traumatología" labelRight />
                        <InputCheckbox label="Reumatología" labelRight />
                        <InputCheckbox label="Hematología" labelRight />
                        <InputCheckbox label="Nutrición" labelRight />
                        <InputCheckbox label="Otorrinolaringologia" labelRight />
                    </div>
                </section>
                
            </div>
        </>
    )
}
