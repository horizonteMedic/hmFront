import InputTextOneLine from "../reusableComponents/InputTextOneLine";
import SectionFieldset from "../reusableComponents/SectionFieldset";

export default function DatosPersonalesLaborales({ form, personales = true, laborales = true, minSizePrincipal = "lg", minSizeSecundario = "lg" }) {
    // minSizePrincipal / minSizeSecundario === "none" => nunca se divide en 2 columnas.
    // Útil en paneles angostos (p. ej. formularios con layout a 2 columnas como EKG),
    // donde partir el grid deja los inputs sin espacio.
    const gridPrincipal =
        minSizePrincipal === "none"
            ? "grid grid-cols-1 gap-x-4 gap-y-3"
            : `grid grid-cols-1 ${minSizePrincipal}:grid-cols-2 gap-x-4 gap-y-3`;
    const gridSecundario =
        minSizeSecundario === "none"
            ? "grid grid-cols-1 gap-x-4 gap-y-3"
            : `grid ${minSizeSecundario}:grid-cols-2 gap-x-4 gap-y-3`;
    return (
        <>
            {personales &&
                (<SectionFieldset legend="Datos Personales" collapsible className={gridPrincipal}>
                    <InputTextOneLine
                        label="Nombres"
                        name="nombres"
                        value={form.nombres}
                        disabled
                        labelWidth="120px"
                    />
                    <div className={gridSecundario}>
                        <InputTextOneLine
                            label="Edad (Años)"
                            name="edad"
                            value={form.edad}
                            disabled
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="Sexo"
                            name="sexo"
                            value={form.sexo}
                            disabled
                            labelWidth="120px"
                        />
                    </div>
                    <div className={gridSecundario}>
                        <InputTextOneLine
                            label="DNI"
                            name="dni"
                            value={form.dni}
                            labelWidth="120px"
                            disabled
                        />
                        <InputTextOneLine
                            label="Fecha Nacimiento"
                            name="fechaNacimiento"
                            value={form.fechaNacimiento}
                            disabled
                            labelWidth="120px"
                        />
                    </div>
                    <InputTextOneLine
                        label="Lugar Nacimiento"
                        name="lugarNacimiento"
                        value={form.lugarNacimiento}
                        disabled
                        labelWidth="120px"
                    />
                    <InputTextOneLine
                        label="Estado Civil"
                        name="estadoCivil"
                        value={form.estadoCivil}
                        disabled
                        labelWidth="120px"
                    />
                    <InputTextOneLine
                        label="Nivel Estudios"
                        name="nivelEstudios"
                        value={form.nivelEstudios}
                        disabled
                        labelWidth="120px"
                    />
                </SectionFieldset>)
            }
            {laborales &&
                (<SectionFieldset legend="Datos Laborales" collapsible className={gridPrincipal}>
                    <InputTextOneLine
                        label="Empresa"
                        name="empresa"
                        value={form.empresa}
                        disabled
                        labelWidth="120px"
                    />
                    <InputTextOneLine
                        label="Contrata"
                        name="contrata"
                        value={form.contrata}
                        disabled
                        labelWidth="120px"
                    />
                    <InputTextOneLine
                        label="Ocupación"
                        name="ocupacion"
                        value={form.ocupacion}
                        disabled
                        labelWidth="120px"
                    />
                    <InputTextOneLine
                        label="Cargo Desempeñar"
                        name="cargoDesempenar"
                        value={form.cargoDesempenar}
                        disabled
                        labelWidth="120px"
                    />
                </SectionFieldset>
                )}
        </>
    )
}
