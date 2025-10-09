import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSave, faPrint, faBroom } from "@fortawesome/free-solid-svg-icons";
import {
    InputTextOneLine,
    InputTextArea,
    InputCheckbox,
    InputsBooleanRadioGroup,
} from "../../../../../components/reusableComponents/ResusableComponents";
import { useForm } from "../../../../../hooks/useForm";

export default function FichaPsicologica2() {
    const initialFormState = {
        // Datos personales
        norden: "",
        fechaExamen: "",
        edad: "",
        lugarNacimiento: "",
        lugarResidencia: "",
        puestoTrabajo: "",
        empresa: "",

        // Motivo de evaluación
        motivoEvaluacion: "",

        // Observación de Conductas
        presentacionAdecuado: false,
        presentacionInadecuado: false,

        posturaErguida: false,
        posturaEncorvada: false,

        discursoRitmoLento: false,
        discursoRitmoRapido: false,
        discursoRitmoFluido: false,

        discursoTonoBajo: false,
        discursoTonoModerado: false,
        discursoTonoAlto: false,

        discursoArtConDificultad: false,
        discursoArtSinDificultad: false,

        orientacionTiempoOrientado: false,
        orientacionTiempoDesorientado: false,
        orientacionEspacioOrientado: false,
        orientacionEspacioDesorientado: false,
        orientacionPersonaOrientado: false,
        orientacionPersonaDesorientado: false,

        // Resultados de evaluación
        nivelIntelectual: "",
        coordinacionVisomotriz: "",
        nivelMemoria: "",
        personalidad: "",
        afectividad: "",

        // Recomendaciones y Conclusiones
        recomendaciones: "",
        areaCognitiva: "",
        areaEmocional: "",

        // Apto/No Apto
        esApto: undefined,

        // Imprimir
        nOrdenImprimir: "",
    };

    const {
        form,
        handleChange,
        handleChangeNumber,
        handleClear,
        handleRadioButtonBoolean,
    } = useForm(initialFormState);

    const handleGuardar = () => {
        // En esta versión solo mostramos en consola.
        // La integración con servicios se puede conectar luego.
        // eslint-disable-next-line no-console
        console.log("Datos guardados FichaPsicologica2:", form);
    };

    return (
        <div className="mx-auto bg-white overflow-hidden">
            <div className="flex h-full">
                <div className="w-full space-y-3 p-4">
                    {/* Datos Personales */}
                    <div>
                        <div className="flex items-center px-6">
                            <FontAwesomeIcon icon={faUser} className="mr-2 text-[#233245]" />
                            <h2 className="text-lg font-semibold text-[#233245] uppercase tracking-wider">
                                Datos Personales
                            </h2>
                        </div>

                        <div className="p-4 text-[10px] space-y-3">
                            <div className="bg-white border border-gray-200 rounded-lg p-3">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                                    <InputTextOneLine
                                        label="N° Orden"
                                        name="norden"
                                        value={form.norden}
                                        onChange={handleChangeNumber}
                                        labelWidth="120px"
                                    />
                                    <InputTextOneLine
                                        label="Fecha Examen"
                                        name="fechaExamen"
                                        type="date"
                                        value={form.fechaExamen}
                                        onChange={handleChange}
                                        labelWidth="120px"
                                    />
                                    <InputTextOneLine
                                        label="Edad"
                                        name="edad"
                                        value={form.edad}
                                        onChange={handleChange}
                                        labelWidth="120px"
                                    />
                                    <InputTextOneLine
                                        label="Lugar Nacimiento"
                                        name="lugarNacimiento"
                                        value={form.lugarNacimiento}
                                        onChange={handleChange}
                                        labelWidth="120px"
                                    />
                                    <InputTextOneLine
                                        label="Lugar de Residencia"
                                        name="lugarResidencia"
                                        value={form.lugarResidencia}
                                        onChange={handleChange}
                                        labelWidth="120px"
                                    />
                                    <InputTextOneLine
                                        label="Puesto de Trabajo"
                                        name="puestoTrabajo"
                                        value={form.puestoTrabajo}
                                        onChange={handleChange}
                                        labelWidth="120px"
                                    />
                                    <InputTextOneLine
                                        label="Empresa donde labora"
                                        name="empresa"
                                        value={form.empresa}
                                        onChange={handleChange}
                                        labelWidth="120px"
                                    />
                                </div>
                            </div>

                            {/* Motivo Evaluación */}
                            <div className="bg-white border border-gray-200 rounded-lg p-3">
                                <h4 className="font-semibold mb-2">Motivo Evaluación</h4>
                                <InputTextArea
                                    rows={4}
                                    name="motivoEvaluacion"
                                    value={form.motivoEvaluacion}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Observación de Conductas */}
                            <div className="bg-white border border-gray-200 rounded-lg p-3">
                                <h4 className="font-semibold mb-2">Observación de Conductas</h4>
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                    {/* Presentación */}
                                    <div className="border rounded p-3">
                                        <h5 className="font-semibold mb-2">Presentación</h5>
                                        <div className="space-y-2">
                                            <InputCheckbox
                                                name="presentacionAdecuado"
                                                label="Adecuado"
                                                checked={form.presentacionAdecuado}
                                                onChange={handleChange}
                                            />
                                            <InputCheckbox
                                                name="presentacionInadecuado"
                                                label="Inadecuado"
                                                checked={form.presentacionInadecuado}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    {/* Postura */}
                                    <div className="border rounded p-3">
                                        <h5 className="font-semibold mb-2">Postura</h5>
                                        <div className="space-y-2">
                                            <InputCheckbox
                                                name="posturaErguida"
                                                label="Erguida"
                                                checked={form.posturaErguida}
                                                onChange={handleChange}
                                            />
                                            <InputCheckbox
                                                name="posturaEncorvada"
                                                label="Encorvada"
                                                checked={form.posturaEncorvada}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    {/* Discurso - Ritmo */}
                                    <div className="border rounded p-3">
                                        <h5 className="font-semibold mb-2">Discurso: Ritmo</h5>
                                        <div className="space-y-2">
                                            <InputCheckbox
                                                name="discursoRitmoLento"
                                                label="Lento"
                                                checked={form.discursoRitmoLento}
                                                onChange={handleChange}
                                            />
                                            <InputCheckbox
                                                name="discursoRitmoRapido"
                                                label="Rápido"
                                                checked={form.discursoRitmoRapido}
                                                onChange={handleChange}
                                            />
                                            <InputCheckbox
                                                name="discursoRitmoFluido"
                                                label="Fluido"
                                                checked={form.discursoRitmoFluido}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    {/* Discurso - Tono */}
                                    <div className="border rounded p-3">
                                        <h5 className="font-semibold mb-2">Discurso: Tono</h5>
                                        <div className="space-y-2">
                                            <InputCheckbox
                                                name="discursoTonoBajo"
                                                label="Bajo"
                                                checked={form.discursoTonoBajo}
                                                onChange={handleChange}
                                            />
                                            <InputCheckbox
                                                name="discursoTonoModerado"
                                                label="Moderado"
                                                checked={form.discursoTonoModerado}
                                                onChange={handleChange}
                                            />
                                            <InputCheckbox
                                                name="discursoTonoAlto"
                                                label="Alto"
                                                checked={form.discursoTonoAlto}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    {/* Discurso - Articulación */}
                                    <div className="border rounded p-3">
                                        <h5 className="font-semibold mb-2">Discurso: Articulación</h5>
                                        <div className="space-y-2">
                                            <InputCheckbox
                                                name="discursoArtConDificultad"
                                                label="Con dificultad"
                                                checked={form.discursoArtConDificultad}
                                                onChange={handleChange}
                                            />
                                            <InputCheckbox
                                                name="discursoArtSinDificultad"
                                                label="Sin dificultad"
                                                checked={form.discursoArtSinDificultad}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    {/* Orientación */}
                                    <div className="border rounded p-3 col-span-1 lg:col-span-2">
                                        <h5 className="font-semibold mb-2">Orientación</h5>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            <div className="space-y-1">
                                                <p className="font-semibold">Tiempo</p>
                                                <InputCheckbox
                                                    name="orientacionTiempoOrientado"
                                                    label="Orientado"
                                                    checked={form.orientacionTiempoOrientado}
                                                    onChange={handleChange}
                                                />
                                                <InputCheckbox
                                                    name="orientacionTiempoDesorientado"
                                                    label="Desorientado"
                                                    checked={form.orientacionTiempoDesorientado}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="font-semibold">Espacio</p>
                                                <InputCheckbox
                                                    name="orientacionEspacioOrientado"
                                                    label="Orientado"
                                                    checked={form.orientacionEspacioOrientado}
                                                    onChange={handleChange}
                                                />
                                                <InputCheckbox
                                                    name="orientacionEspacioDesorientado"
                                                    label="Desorientado"
                                                    checked={form.orientacionEspacioDesorientado}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="font-semibold">Persona</p>
                                                <InputCheckbox
                                                    name="orientacionPersonaOrientado"
                                                    label="Orientado"
                                                    checked={form.orientacionPersonaOrientado}
                                                    onChange={handleChange}
                                                />
                                                <InputCheckbox
                                                    name="orientacionPersonaDesorientado"
                                                    label="Desorientado"
                                                    checked={form.orientacionPersonaDesorientado}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Resultados de Evaluación */}
                            <div className="bg-white border border-gray-200 rounded-lg p-3">
                                <h4 className="font-semibold mb-2">Resultados de Evaluación</h4>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <InputTextOneLine
                                        label="Nivel Intelectual"
                                        name="nivelIntelectual"
                                        value={form.nivelIntelectual}
                                        onChange={handleChange}
                                        labelWidth="160px"
                                    />
                                    <InputTextOneLine
                                        label="Coordinación Visomotriz"
                                        name="coordinacionVisomotriz"
                                        value={form.coordinacionVisomotriz}
                                        onChange={handleChange}
                                        labelWidth="160px"
                                    />
                                    <InputTextOneLine
                                        label="Nivel de Memoria"
                                        name="nivelMemoria"
                                        value={form.nivelMemoria}
                                        onChange={handleChange}
                                        labelWidth="160px"
                                    />
                                    <InputTextArea
                                        rows={4}
                                        label="Personalidad"
                                        name="personalidad"
                                        value={form.personalidad}
                                        onChange={handleChange}
                                    />
                                    <InputTextArea
                                        rows={3}
                                        label="Afectividad"
                                        name="afectividad"
                                        value={form.afectividad}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Recomendaciones y Conclusiones */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <div className="bg-white border border-gray-200 rounded-lg p-3">
                                    <h4 className="font-semibold mb-2">Recomendaciones</h4>
                                    <InputTextArea
                                        rows={6}
                                        name="recomendaciones"
                                        value={form.recomendaciones}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="bg-white border border-gray-200 rounded-lg p-3">
                                    <h4 className="font-semibold mb-2">Conclusiones</h4>
                                    <div className="space-y-3">
                                        <InputTextArea
                                            rows={3}
                                            label="Área Cognitiva"
                                            name="areaCognitiva"
                                            value={form.areaCognitiva}
                                            onChange={handleChange}
                                        />
                                        <InputTextArea
                                            rows={3}
                                            label="Área Emocional"
                                            name="areaEmocional"
                                            value={form.areaEmocional}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* APTO / NO APTO */}
                            <div className="bg-white border border-gray-200 rounded-lg p-3">
                                <div className="flex items-center gap-4">
                                    <p className="font-semibold">Resultado:</p>
                                    <InputsBooleanRadioGroup
                                        name="esApto"
                                        value={form.esApto}
                                        onChange={handleRadioButtonBoolean}
                                        trueLabel="APTO"
                                        falseLabel="NO APTO"
                                    />
                                </div>
                            </div>

                            {/* Imprimir N° Orden */}
                            <div className="bg-white border border-gray-200 rounded-lg p-3">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 items-end">
                                    <InputTextOneLine
                                        label="Imprimir N° Orden"
                                        name="nOrdenImprimir"
                                        value={form.nOrdenImprimir}
                                        onChange={handleChange}
                                        labelWidth="160px"
                                    />
                                    <button
                                        type="button"
                                        className="h-8 px-3 rounded bg-blue-600 text-white flex items-center gap-2 justify-center"
                                        onClick={() => window.print()}
                                    >
                                        <FontAwesomeIcon icon={faPrint} />
                                        Imprimir
                                    </button>
                                </div>
                            </div>

                            {/* Acciones */}
                            <div className="flex flex-wrap gap-3">
                                <button
                                    type="button"
                                    className="h-8 px-3 rounded bg-green-600 text-white flex items-center gap-2"
                                    onClick={handleGuardar}
                                >
                                    <FontAwesomeIcon icon={faSave} /> Guardar
                                </button>
                                <button
                                    type="button"
                                    className="h-8 px-3 rounded bg-gray-600 text-white flex items-center gap-2"
                                    onClick={() => { /* Placeholder para actualizar */ }}
                                >
                                    Actualizar
                                </button>
                                <button
                                    type="button"
                                    className="h-8 px-3 rounded bg-orange-600 text-white flex items-center gap-2"
                                    onClick={handleClear}
                                >
                                    <FontAwesomeIcon icon={faBroom} /> Limpiar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}