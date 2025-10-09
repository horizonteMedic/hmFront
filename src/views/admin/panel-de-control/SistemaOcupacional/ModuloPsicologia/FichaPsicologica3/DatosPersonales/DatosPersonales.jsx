import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faPlus, faBroom } from "@fortawesome/free-solid-svg-icons";
import PropTypes from 'prop-types';
import {
    InputTextOneLine,
    InputTextArea,
} from "../../../../../../components/reusableComponents/ResusableComponents";

export default function DatosPersonales({
    form,
    handleChange,
    handleChangeNumber,
    handleChangeSimple,
    agregarEmpresa,
    limpiarCamposEmpresa
}) {

    return (
        <div className="mx-auto bg-white overflow-hidden">
            <div className="flex h-full">
                <div className="w-full space-y-3 pt-4 px-3">
                    {/*==========================Datos Personales Section==========================*/}
                    <div>
                        <div className="flex items-center px-6">
                            <FontAwesomeIcon icon={faUser} className="mr-2 text-[#233245]" />
                            <h2 className="text-lg font-semibold text-[#233245] uppercase tracking-wider">Datos Personales</h2>
                        </div>
                        {/* ===== SECCIÓN: DATOS PERSONALES ===== */}
                        <div className="p-4 text-[10px] space-y-2">
                            {/* Header con información básica */}
                            <div className="bg-white border border-gray-200 rounded-lg p-3">
                                <h3 className="font-semibold mb-2">Información General</h3>
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                    <InputTextOneLine
                                        label="N° Orden"
                                        name="norden"
                                        value={form.norden}
                                        // onKeyUp={handleSearch}
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
                            </div>
                            {/* Contenido principal - Datos Personales */}
                            <div className="bg-white border border-gray-200 rounded-lg p-3">
                                <h4 className="font-semibold mb-2">Datos Personales</h4>
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
                                        label="Edad"
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
                            </div>

                            {/* ===== SECCIÓN: DATOS LABORALES ===== */}
                            <div className="bg-white border border-gray-200 rounded-lg p-3">
                                <h4 className="font-semibold mb-3">Datos Laborales</h4>

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
                            </div>

                            {/* ===== SECCIÓN: EVALUACIÓN Y RIESGOS ===== */}
                            <div className="bg-white border border-gray-200 rounded-lg p-3">
                                <h4 className="font-semibold mb-3">Evaluación y Riesgos</h4>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-4">
                                    <div>
                                        <h5 className="font-semibold mb-2">Motivo Evaluación</h5>
                                        <InputTextArea
                                            rows={5}
                                            name="motivoEvaluacion"
                                            value={form.motivoEvaluacion}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <h5 className="font-semibold mb-2">Principales Riesgos</h5>
                                        <InputTextArea
                                            rows={5}
                                            name="principalesRiesgos"
                                            value={form.principalesRiesgos}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <h5 className="font-semibold mb-2">Medidas de Seguridad</h5>
                                        <InputTextArea
                                            rows={5}
                                            name="medidasSeguridad"
                                            value={form.medidasSeguridad}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* ===== SECCIÓN: HISTORIA Y OBSERVACIONES ===== */}
                            <div className="bg-white border border-gray-200 rounded-lg p-3">
                                <h4 className="font-semibold mb-3">Historia y Observaciones</h4>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-4">
                                    <div>
                                        <h5 className="font-semibold mb-2">Historia Familiar</h5>
                                        <InputTextArea
                                            rows={5}
                                            name="historiaFamiliar"
                                            value={form.historiaFamiliar}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <h5 className="font-semibold mb-2">Hábitos</h5>
                                        <InputTextArea
                                            rows={5}
                                            name="habitos"
                                            value={form.habitos}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <h5 className="font-semibold mb-2">Otras Observaciones</h5>
                                        <InputTextArea
                                            rows={5}
                                            name="otrasObservaciones"
                                            value={form.otrasObservaciones}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* ===== SECCIÓN: ANTERIORES EMPRESAS ===== */}
                            <div className="bg-white border border-gray-200 rounded-lg p-3">
                                <h4 className="font-semibold mb-3 text-[11px]">ANTERIORES EMPRESAS (experiencia laboral)</h4>

                                {/* Campos de entrada en 2 columnas */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                                    {/* Columna Izquierda */}
                                    <div className="space-y-2">
                                        <div className="grid grid-cols-2 gap-4">
                                            <InputTextOneLine
                                                label="Fecha"
                                                name="fechaEmpresa"
                                                type="date"
                                                value={form.fechaEmpresa}
                                                onChange={handleChangeSimple}
                                                labelWidth="100px"
                                            />
                                            <InputTextOneLine
                                                label="Empresa"
                                                name="nombreEmpresa"
                                                value={form.nombreEmpresa}
                                                onChange={handleChange}
                                                labelWidth="100px"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <InputTextOneLine
                                                label="Act. Empresa"
                                                name="actividadEmpresa"
                                                value={form.actividadEmpresa}
                                                onChange={handleChange}
                                                labelWidth="100px"
                                            />
                                            <InputTextOneLine
                                                label="Puesto"
                                                name="puestoEmpresa"
                                                value={form.puestoEmpresa}
                                                onChange={handleChange}
                                                labelWidth="100px"
                                            />
                                        </div>
                                    </div>

                                    {/* Columna Derecha */}
                                    <div className="space-y-2">
                                        <div className="grid grid-cols-2 gap-4">
                                            <InputTextOneLine
                                                label="T. Sup"
                                                name="tSup"
                                                value={form.tSup}
                                                onChange={handleChange}
                                                labelWidth="100px"
                                            />
                                            <InputTextOneLine
                                                label="T. Sub"
                                                name="tSub"
                                                value={form.tSub}
                                                onChange={handleChange}
                                                labelWidth="100px"
                                            />
                                        </div>
                                        <InputTextOneLine
                                            label="Causa retiro"
                                            name="causaRetiro"
                                            value={form.causaRetiro}
                                            onChange={handleChange}
                                            labelWidth="100px"
                                        />
                                    </div>
                                </div>

                                {/* Botones de acción */}
                                <div className="flex gap-2 mb-4">
                                    <button
                                        type="button"
                                        onClick={agregarEmpresa}
                                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded flex items-center gap-2 text-[11px]"
                                    >
                                        <FontAwesomeIcon icon={faPlus} />
                                        Agregar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={limpiarCamposEmpresa}
                                        className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded flex items-center gap-2 text-[11px]"
                                    >
                                        <FontAwesomeIcon icon={faBroom} />
                                        Limpiar
                                    </button>
                                </div>

                                {/* Tabla de empresas anteriores */}
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
                                                        <td className="border border-gray-300 px-2 py-1 text-[11px]">{empresa.nombreEmpresa}</td>
                                                        <td className="border border-gray-300 px-2 py-1 text-[11px]">{empresa.actividadEmpresa}</td>
                                                        <td className="border border-gray-300 px-2 py-1 text-[11px]">{empresa.puestoEmpresa}</td>
                                                        <td className="border border-gray-300 px-2 py-1 text-[11px]">{empresa.tSup}</td>
                                                        <td className="border border-gray-300 px-2 py-1 text-[11px]">{empresa.tSub}</td>
                                                        <td className="border border-gray-300 px-2 py-1 text-[11px]">{empresa.causaRetiro}</td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

DatosPersonales.propTypes = {
    form: PropTypes.object.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleChangeNumber: PropTypes.func.isRequired,
    agregarEmpresa: PropTypes.func.isRequired,
    limpiarCamposEmpresa: PropTypes.func.isRequired,
};

