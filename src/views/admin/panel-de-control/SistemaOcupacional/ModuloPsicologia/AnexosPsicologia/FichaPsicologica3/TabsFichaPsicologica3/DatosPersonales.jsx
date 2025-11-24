import {
    InputTextOneLine,
    InputTextArea,
} from "../../../../../../../components/reusableComponents/ResusableComponents";
import SectionFieldset from "../../../../../../../components/reusableComponents/SectionFieldset";

export default function DatosPersonales({
    form,
    handleChange,
    handleChangeNumber,
    handleChangeSimple,
    handleSearch
}) {
    return (
        <div className="mx-auto bg-white overflow-hidden">
            <div className="flex h-full">
                <div className="w-full space-y-3 px-3">
                    <div>
                        <div className="p-4 text-[10px] space-y-2">
                            <SectionFieldset legend="Información del Examen">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                    <InputTextOneLine
                                        label="N° Orden"
                                        name="norden"
                                        value={form.norden}
                                        onKeyUp={handleSearch}
                                        onChange={handleChangeNumber}
                                        labelWidth="120px"
                                    />
                                    <InputTextOneLine
                                        label="Fecha Examen"
                                        name="fechaExamen"
                                        type="date"
                                        value={form.fechaExamen}
                                        onChange={handleChangeSimple}
                                        labelWidth="120px"
                                    />
                                    <InputTextOneLine
                                        label="Nombre Examen"
                                        name="nombreExamen"
                                        type="text"
                                        value={form.nombreExamen}
                                        disabled
                                        labelWidth="120px"
                                    />
                                </div>
                            </SectionFieldset>

                            <SectionFieldset legend="Datos Personales">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 space-y-2">
                                    <InputTextOneLine
                                        label="Nombres"
                                        name="nombres"
                                        value={form.nombres}
                                        onChange={handleChange}
                                        disabled
                                        labelWidth="120px"
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <InputTextOneLine
                                            label="DNI"
                                            name="dni"
                                            value={form.dni}
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
                                    <InputTextOneLine
                                        label="Apellidos"
                                        name="apellidos"
                                        value={form.apellidos}
                                        onChange={handleChange}
                                        disabled
                                        labelWidth="120px"
                                    />
                                    <InputTextOneLine
                                        label="Fecha Nacimiento"
                                        name="fechaNacimiento"
                                        value={form.fechaNacimiento}
                                        disabled
                                        labelWidth="120px"
                                    />
                                    <InputTextOneLine
                                        label="Lugar Nacimiento"
                                        name="lugarNacimiento"
                                        value={form.lugarNacimiento}
                                        disabled
                                        labelWidth="120px"
                                    />
                                    <InputTextOneLine
                                        label="Edad (Años)"
                                        name="edad"
                                        value={form.edad}
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
                                        label="Grado Instrucción"
                                        name="gradoInstruccion"
                                        value={form.gradoInstruccion}
                                        disabled
                                        labelWidth="120px"
                                    />
                                </div>
                            </SectionFieldset>

                            <SectionFieldset legend="Datos Laborales">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 space-y-2">
                                    <InputTextOneLine
                                        label="Empresa"
                                        name="empresa"
                                        value={form.empresa}
                                        onChange={handleChange}
                                        disabled
                                        labelWidth="120px"
                                    />
                                    <InputTextOneLine
                                        label="Tiempo de Experiencia"
                                        name="tiempoExperiencia"
                                        value={form.tiempoExperiencia}
                                        onChange={handleChange}
                                        labelWidth="120px"
                                    />
                                    <InputTextOneLine
                                        label="Contrata"
                                        name="contrata"
                                        value={form.contrata}
                                        onChange={handleChange}
                                        disabled
                                        labelWidth="120px"
                                    />
                                    <InputTextOneLine
                                        label="Puesto"
                                        name="puesto"
                                        value={form.puesto}
                                        onChange={handleChange}
                                        disabled
                                        labelWidth="120px"
                                    />
                                    <InputTextOneLine
                                        label="Área"
                                        name="area"
                                        value={form.area}
                                        onChange={handleChange}
                                        disabled
                                        labelWidth="120px"
                                    />
                                    <InputTextOneLine
                                        label="Mineral Exp"
                                        name="mineralExp"
                                        value={form.mineralExp}
                                        onChange={handleChange}
                                        disabled
                                        labelWidth="120px"
                                    />
                                    <InputTextOneLine
                                        label="Explotación en"
                                        name="explotacionEn"
                                        value={form.explotacionEn}
                                        onChange={handleChange}
                                        disabled
                                        labelWidth="120px"
                                    />
                                    <InputTextOneLine
                                        label="Altura de Labor"
                                        name="alturaLabor"
                                        value={form.alturaLabor}
                                        onChange={handleChange}
                                        disabled
                                        labelWidth="120px"
                                    />
                                </div>
                            </SectionFieldset>

                            <SectionFieldset legend="Evaluación y Riesgos" className="grid grid-cols-1 lg:grid-cols-3 gap-x-4">
                                <InputTextArea
                                    rows={5}
                                    label="Motivo Evaluación"
                                    name="motivoEvaluacion"
                                    value={form.motivoEvaluacion}
                                    onChange={handleChange}
                                />
                                <InputTextArea
                                    rows={5}
                                    label="Principales Riesgos"
                                    name="principalesRiesgos"
                                    value={form.principalesRiesgos}
                                    onChange={handleChange}
                                />
                                <InputTextArea
                                    rows={5}
                                    label="Medidas de Seguridad"
                                    name="medidasSeguridad"
                                    value={form.medidasSeguridad}
                                    onChange={handleChange}
                                />
                            </SectionFieldset>

                            <SectionFieldset legend="Historia y Observaciones">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-4">
                                    <InputTextArea
                                        rows={5}
                                        label="Historia Familiar"
                                        name="historiaFamiliar"
                                        value={form.historiaFamiliar}
                                        onChange={handleChange}
                                    />
                                    <InputTextArea
                                        rows={5}
                                        label="Hábitos"
                                        name="habitos"
                                        value={form.habitos}
                                        onChange={handleChange}
                                    />
                                    <InputTextArea
                                        rows={5}
                                        label="Otras Observaciones"
                                        name="otrasObservaciones"
                                        value={form.otrasObservaciones}
                                        onChange={handleChange}
                                    />
                                </div>
                            </SectionFieldset>

                            <SectionFieldset legend="Experiencia Laboral">
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse border border-gray-300 text-[11px]">
                                        <thead>
                                            <tr className="bg-blue-100">
                                                <th className="border border-gray-300 px-2 py-1 text-left text-[11px] font-semibold">Fecha</th>
                                                <th className="border border-gray-300 px-2 py-1 text-left text-[11px] font-semibold">Empresa</th>
                                                <th className="border border-gray-300 px-2 py-1 text-left text-[11px] font-semibold">Actividad Empresa</th>
                                                <th className="border border-gray-300 px-2 py-1 text-left text-[11px] font-semibold">Puesto</th>
                                                <th className="border border-gray-300 px-2 py-1 text-left text-[11px] font-semibold">Sup</th>
                                                <th className="border border-gray-300 px-2 py-1 text-left text-[11px] font-semibold">Sub</th>
                                                <th className="border border-gray-300 px-2 py-1 text-left text-[11px] font-semibold">CausaRetiro</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {form.empresasAnteriores.length === 0 ? (
                                                <tr>
                                                    <td colSpan="7" className="border border-gray-300 px-2 py-4 text-center text-gray-500 text-[11px]">
                                                        No hay empresas registradas
                                                    </td>
                                                </tr>
                                            ) : (
                                                form.empresasAnteriores.map((empresa, index) => (
                                                    <tr key={index}>
                                                        <td className="border border-gray-300 px-2 py-1 text-[11px]">{empresa.fecha}</td>
                                                        <td className="border border-gray-300 px-2 py-1 text-[11px]">{empresa.empresa}</td>
                                                        <td className="border border-gray-300 px-2 py-1 text-[11px]">{empresa.actividad}</td>
                                                        <td className="border border-gray-300 px-2 py-1 text-[11px]">{empresa.ocupacion}</td>
                                                        <td className="border border-gray-300 px-2 py-1 text-[11px]">{empresa.superficie}</td>
                                                        <td className="border border-gray-300 px-2 py-1 text-[11px]">{empresa.socavon}</td>
                                                        <td className="border border-gray-300 px-2 py-1 text-[11px]">{empresa.causaRetiro}</td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </SectionFieldset>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}
