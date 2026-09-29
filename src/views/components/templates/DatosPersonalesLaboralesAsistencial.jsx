import InputTextOneLine from "../reusableComponents/InputTextOneLine";
import SectionFieldset from "../reusableComponents/SectionFieldset";

export default function DatosPersonalesLaboralesAsistencial({ form, personales = true, laborales = true, minSizePrincipal = "lg", minSizeSecundario = "lg" }) {

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
                        value={form.nombres + " " + form.apellidos}
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
                            value={form.numeroDocumento}
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
                        label="Ocupación"
                        name="ocupacion"
                        value={form.ocupacion}
                        disabled
                        labelWidth="120px"
                    /> 
                </SectionFieldset>
                )}
        </>
    )
}
