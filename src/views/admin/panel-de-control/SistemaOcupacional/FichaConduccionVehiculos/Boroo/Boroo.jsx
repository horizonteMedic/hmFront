import {
    InputCheckbox,
    InputsRadioGroup,
    InputTextOneLine,
} from "../../../../../components/reusableComponents/ResusableComponents";

export default function Boroo({
    form,
    handleChange,
    handleChangeSimple,
    handleRadioButton,
    handleCheckBoxChange,
    disabled = false,
    isFieldEdited = () => false,
    revertField = () => { },
}) {
    // Props comunes de un campo de texto: bloqueo, resaltado de cambios y botón de revertir.
    const campo = (name, onChange = handleChange) => ({
        name,
        value: form?.[name],
        onChange,
        disabled,
        edited: isFieldEdited(name),
        onRevert: () => revertField(name),
    });

    return (
        <div className="p-4 space-y-6">
            {/* Medidas Antropométricas y Signos Vitales */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Datos Boroo</h4>
                {/* Primera fila */}
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <InputTextOneLine
                        label="Número de Licencia"
                        {...campo("numeroDeLicencia")}
                    />
                    <InputTextOneLine
                        label="Clase de Licencia"
                        {...campo("claseLicencia")}
                    />
                    <InputTextOneLine
                        label="Categoría de Licencia"
                        {...campo("categoriaLicencia")}
                    />
                    <InputTextOneLine
                        label="Fecha de Revalidación de Licencia"
                        type="date"
                        {...campo("fechaRevalidacionLicencia", handleChangeSimple)}
                    />
                    <InputTextOneLine
                        label="Procedencia Licencia"
                        {...campo("procedenciaLicencia")}
                    />
                    <InputsRadioGroup
                        label="Máquina"
                        name="maquina"
                        value={form.maquina}
                        onChange={handleRadioButton}
                        disabled={disabled}
                        edited={isFieldEdited("maquina")}
                        onRevert={() => revertField("maquina")}
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
                        disabled={disabled}
                    />
                </div>
            </div>
        </div >
    );
}
