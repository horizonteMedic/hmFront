import {
    InputCheckbox,
    InputsRadioGroup,
    InputTextOneLine,
} from "../../../../../components/reusableComponents/ResusableComponents";

export default function Boroo({ form, handleChange, handleChangeSimple, handleRadioButton, handleCheckBoxChange }) {
    return (
        <div className="p-4 space-y-6">
            {/* Medidas Antropométricas y Signos Vitales */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Datos Boroo</h4>
                {/* Primera fila */}
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <InputTextOneLine
                        label="Número de Licencia"
                        name="numeroDeLicencia"
                        value={form?.numeroDeLicencia}
                        onChange={handleChange}
                    />
                    <InputTextOneLine
                        label="Clase de Licencia"
                        name="claseLicencia"
                        value={form?.claseLicencia}
                        onChange={handleChange}
                    />
                    <InputTextOneLine
                        label="Categoría de Licencia"
                        name="categoriaLicencia"
                        value={form?.categoriaLicencia}
                        onChange={handleChange}
                    />
                    <InputTextOneLine
                        label="Fecha de Revalidación de Licencia"
                        name="fechaRevalidacionLicencia"
                        type="date"
                        value={form?.fechaRevalidacionLicencia}
                        onChange={handleChangeSimple}
                    />
                    <InputTextOneLine
                        label="Procedencia Licencia"
                        name="procedenciaLicencia"
                        value={form?.procedenciaLicencia}
                        onChange={handleChange}
                    />
                    <InputsRadioGroup
                        label="Máquina"
                        name="maquina"
                        value={form.maquina}
                        onChange={handleRadioButton}
                        options={[
                            { label: "Liviano", value: "LIVIANO" },
                            { label: "Pesado", value: "PESADO" },
                        ]}
                    />
                    <InputCheckbox
                        label="Uso Estricto de Lentes Correctores"
                        checked={form.usoEstrictoLentesCorrectores}
                        name="usoEstrictoLentesCorrectores"
                        onChange={handleCheckBoxChange}
                    />
                </div>
            </div>
        </div >
    );
}


