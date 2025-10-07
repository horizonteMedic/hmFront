import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import InputsRadioGroup from "../../../../components/reusableComponents/InputsRadioGroup";
import InputTextOneLine from "../../../../components/reusableComponents/InputTextOneLine";
import { useForm } from "../../../../hooks/useForm";
import useRealTime from "../../../../hooks/useRealTime";
import InputsBooleanRadioGroup from "../../../../components/reusableComponents/InputsBooleanRadioGroup";

export default function CertificadoMedicoOcupacional() {

    const InitialForm = {
        norden: ""
    }

    const { form, setForm, handleChangeNumber,handleChange, handleChangeSimple, handleRadioButton } = useForm(InitialForm)

    return (
        <div className="mx-auto bg-white overflow-hidden">
            {/* Header */}
            <h1 className="text-blue-600 font-semibold p-4 pb-0 mb-0 m-4">Aptitud</h1>
            <div className="flex h-full">
            {/* Contenido principal - 80% */}
                <div className="w-4/5">
                    <div className="w-full">
                        {/* Datos del trabajador */}
                        <section className="bg-white border border-gray-200 rounded-lg p-4  mt-0 m-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                            <InputTextOneLine
                                label="N° Orden"
                                name="norden"
                                labelWidth="60px"
                                value={form?.norden}
                                onChange={handleChangeNumber}
                                //onKeyUp={handleSearch}
                            />
                            <InputTextOneLine
                                label="Tipo de Examen"
                                name="norden"
                                value={form?.norden}
                                labelWidth="100px"
                                onChange={handleChange}
                            />
                            <div className="flex gap-2 justify-center items-center w-full">
                                <InputTextOneLine
                                    label="Imprimir Resumen Medico"
                                    labelWidth="140px"
                                    name="norden"
                                    value={form?.norden}
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    //onClick={handlePrint}
                                    className="bg-blue-600 hover:bg-blue-700 text-white text-base px-4 py-2 rounded flex items-center gap-2"
                                >
                                    <FontAwesomeIcon icon={faPrint} />
                                </button>
                            </div>
                            
                            <div className="flex justify-end mt-3">
                                <h1 className="text-lg font-bold">{useRealTime()}</h1>
                            </div>
                            
                        </section>

                        <h1 className="text-blue-600 font-semibold p-4 pb-0 mb-0 m-4">Certifica que el Sr.</h1>
                        <section className="bg-white border border-gray-200 rounded-lg p-4 mt-0 m-4">
                            {/* Fila 1: Datos personales */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <InputTextOneLine
                                label="Nombres y Apellidos"
                                name="nombres"
                                value={form?.nombres}
                                onChange={handleChange}
                                />
                                <InputTextOneLine
                                label="DNI"
                                labelWidth="50px"
                                name="dni"
                                value={form?.dni}
                                onChange={handleChange}
                                />
                                <InputTextOneLine
                                label="Edad"
                                labelWidth="50px"
                                name="edad"
                                value={form?.edad}
                                onChange={handleChange}
                                />
                                <InputTextOneLine
                                label="Género"
                                labelWidth="60px"
                                name="genero"
                                value={form?.genero}
                                onChange={handleChange}
                                />
                            </div>

                            {/* Fila 2: Empresa y Contratista */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                <InputTextOneLine
                                label="Empresa"
                                name="empresa"
                                value={form?.empresa}
                                onChange={handleChange}
                                />
                                <InputTextOneLine
                                label="Contratista"
                                name="contratista"
                                value={form?.contratista}
                                onChange={handleChange}
                                />
                            </div>

                            {/* Fila 3: Puesto y Ocupación */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                <InputTextOneLine
                                label="Puesto al que Postula"
                                name="puesto"
                                value={form?.puesto}
                                onChange={handleChange}
                                />
                                <InputTextOneLine
                                label="Ocupación Actual o Última Ocupación"
                                name="ocupacion"
                                value={form?.ocupacion}
                                onChange={handleChange}
                                />
                            </div>
                        </section>
                        <div className="flex w-full">
                            <div className="w-1/2">
                                <section className="bg-white border border-gray-200 rounded-lg p-4 mt-0 m-4">
                                    <InputsBooleanRadioGroup
                                    name="especialidad" value={form.especialidad}
                                    onChange={handleRadioButton} options={[{ label: "Oftalmología", value: "OFTALMOLOGÍA" }]}
                                    />
                                </section>
                            </div>
                            <div className="w-1/2">
                                asdadasd
                            </div>
                        </div>
                    </div>
                </div>

            {/* Panel lateral de Agudeza Visual - 20% */}
            <div className="w-1/5">
                <div className="bg-white border border-gray-200 rounded-lg p-4 m-4 flex-1 flex flex-col space-y-3">
                    <h4 className="font-semibold text-gray-800 mb-3">Agudeza Visual</h4>
                </div>
            </div>
        </div>
            
        </div>
    )
}
