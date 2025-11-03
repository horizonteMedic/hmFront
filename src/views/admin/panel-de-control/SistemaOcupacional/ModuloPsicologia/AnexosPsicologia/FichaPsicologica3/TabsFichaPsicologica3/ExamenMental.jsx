
import { faBroom, faPrint, faSave } from "@fortawesome/free-solid-svg-icons";
import {
  InputsRadioGroup,
  InputTextArea,
  InputTextOneLine,
  InputCheckbox,
  RadioTable
} from "../../../../../../../components/reusableComponents/ResusableComponents";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Arrays para RadioTable de Orientación
const orientacionItems = [
  { name: "orientacionTiempo", label: "Tiempo" },
  { name: "orientacionEspacio", label: "Espacio" },
  { name: "orientacionPersona", label: "Persona" }
];

const orientacionOptions = [
  { value: "DESORIENTADO", label: "Desorientado" },
  { value: "ORIENTADO", label: "Orientado" }
];

export default function ExamenMental({
  form,
  handleChange,
  handleRadioButton,
  handleCheckBoxChange,
  handleSave,
  handlePrint,
  handleClear
}) {

  return (
    <div className="mx-auto bg-white overflow-hidden">
      <div className="flex h-full">
        <div className="w-full space-y-3 px-3 ">
          {/* Header */}
          {/* Content - 3 Columnas */}
          <div className=" text-[11px] space-y-3 p-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* ===== COLUMNA 1: OBSERVACIÓN DE CONDUCTAS ===== */}
              <div className="space-y-3">
                <h3 className="text-blue-600 font-semibold text-[11px] mb-2">Observación de Conductas</h3>
                {/* Presentación */}
                <div className="bg-gray-50 border border-gray-300 rounded p-3">
                  <h4 className="text-blue-600 font-semibold text-[11px] mb-2">Presentación</h4>
                  <div className="flex gap-4">
                    <InputsRadioGroup
                      name="presentacion"
                      value={form.presentacion}
                      onChange={handleRadioButton}
                      options={[
                        { label: "Adecuado", value: "ADECUADO" },
                        { label: "Inadecuado", value: "INADECUADO" }
                      ]}
                    />
                  </div>
                </div>

                {/* Postura */}
                <div className="bg-gray-50 border border-gray-300 rounded p-3">
                  <h4 className="text-blue-600 font-semibold text-[11px] mb-2">Postura</h4>
                  <div className="flex gap-4">
                    <InputsRadioGroup
                      name="postura"
                      value={form.postura}
                      onChange={handleRadioButton}
                      options={[
                        { label: "Erguida", value: "ERGUIDA" },
                        { label: "Encorvada", value: "ENCORVADA" }
                      ]}
                    />
                  </div>
                </div>

                {/* Discurso */}
                <div className="bg-gray-50 border border-gray-300 rounded p-3">
                  <h4 className="text-blue-600 font-semibold text-[11px] mb-2">Discurso</h4>

                  {/* Ritmo */}
                  <div className="mb-3">
                    <h5 className="font-semibold text-[11px] mb-1">Ritmo</h5>
                    <div className="flex gap-4">
                      <InputsRadioGroup
                        name="ritmo"
                        value={form.ritmo}
                        onChange={handleRadioButton}
                        options={[
                          { label: "Lento", value: "LENTO" },
                          { label: "Rápido", value: "RAPIDO" },
                          { label: "Fluido", value: "FLUIDO" }
                        ]}
                      />
                    </div>
                  </div>

                  {/* Tono */}
                  <div className="mb-3">
                    <h5 className="font-semibold text-[11px] mb-1">Tono</h5>
                    <div className="flex gap-4">
                      <InputsRadioGroup
                        name="tono"
                        value={form.tono}
                        onChange={handleRadioButton}
                        options={[
                          { label: "Bajo", value: "BAJO" },
                          { label: "Moderado", value: "MODERADO" },
                          { label: "Alto", value: "ALTO" }
                        ]}
                      />
                    </div>
                  </div>

                  {/* Articulación */}
                  <div>
                    <h5 className="font-semibold text-[11px] mb-1">Articulación</h5>
                    <div className="flex gap-4">
                      <InputsRadioGroup
                        name="articulacion"
                        value={form.articulacion}
                        onChange={handleRadioButton}
                        options={[
                          { label: "Con dificultad", value: "CON_DIFICULTAD" },
                          { label: "Sin dificultad", value: "SIN_DIFICULTAD" }
                        ]}
                      />
                    </div>
                  </div>
                </div>

                {/* Orientación */}
                <div className="border rounded p-3 ">
                  <h5 className="font-semibold mb-4">Orientación</h5>
                  <RadioTable
                    items={orientacionItems}
                    options={orientacionOptions}
                    form={form}
                    handleRadioButton={handleRadioButton}
                  />
                </div>

                {/* Área Cognitiva */}
                <div className="bg-gray-50 border border-gray-300 rounded p-3">
                  <h4 className="text-blue-600 font-semibold text-[11px] mb-2">Área Cognitiva</h4>
                  <InputTextArea
                    name="areaCognitiva"
                    value={form.areaCognitiva}
                    onChange={handleChange}
                    rows={6}
                    className="w-full"
                  />
                </div>
              </div>

              {/* ===== COLUMNA 2: PROCESOS COGNITIVOS ===== */}
              <div className="space-y-3">
                <h3 className="text-blue-600 font-semibold text-[11px] mb-2">Procesos Cognitivos</h3>
                <div className="bg-gray-50 border border-gray-300 rounded p-3 space-y-2">
                  <InputTextOneLine
                    label="Lucido, atento"
                    name="lucidoAtento"
                    value={form.lucidoAtento}
                    onChange={handleChange}
                    labelWidth="120px"
                  />
                  <InputTextOneLine
                    label="Pensamiento"
                    name="pensamiento"
                    value={form.pensamiento}
                    onChange={handleChange}
                    labelWidth="120px"
                  />
                  <InputTextOneLine
                    label="Percepción"
                    name="percepcion"
                    value={form.percepcion}
                    onChange={handleChange}
                    labelWidth="120px"
                  />
                </div>


                {/* Memoria */}
                <div className="bg-gray-50 border border-gray-300 rounded p-3">
                  <h4 className="text-blue-600 font-semibold text-[11px] mb-2">Memoria</h4>
                  <InputsRadioGroup
                    name="memoria"
                    value={form.memoria}
                    onChange={handleRadioButton}
                    options={[
                      { label: "Corto Plazo", value: "CORTO_PLAZO" },
                      { label: "Mediano Plazo", value: "MEDIANO_PLAZO" },
                      { label: "Largo Plazo", value: "LARGO_PLAZO" }
                    ]}
                  />
                </div>

                {/* Inteligencia */}
                <div className="bg-gray-50 border border-gray-300 rounded p-3">
                  <h4 className="text-blue-600 font-semibold text-[11px] mb-2">Inteligencia</h4>
                  <InputsRadioGroup
                    name="inteligencia"
                    value={form.inteligencia}
                    onChange={handleRadioButton}
                    options={[
                      { label: "Muy Superior", value: "MUY_SUPERIOR" },
                      { label: "Superior", value: "SUPERIOR" },
                      { label: "Normal Brillante", value: "NORMAL_BRILLANTE" },
                      { label: "Promedio", value: "PROMEDIO" },
                      { label: "N.Torpe", value: "N_TORPE" },
                    ]}
                  />
                  <InputsRadioGroup
                    name="inteligencia"
                    value={form.inteligencia}
                    onChange={handleRadioButton}
                    options={[
                      { label: "Fronterizo", value: "FRONTERIZO" },
                      { label: "RM Leve", value: "RM_LEVE" },
                      { label: "RM Moderado", value: "RM_MODERADO" },
                      { label: "RM Severo", value: "RM_SEVERO" },
                      { label: "RM Profundo", value: "RM_PROFUNDO" },
                    ]}
                  />
                </div>
                <div className="bg-gray-50 border border-gray-300 rounded p-3 space-y-2">
                  <InputTextOneLine
                    label="Apetito"
                    name="apetito"
                    value={form.apetito}
                    onChange={handleChange}
                    labelWidth="120px"
                  />
                  <InputTextOneLine
                    label="Sueño"
                    name="sueno"
                    value={form.sueno}
                    onChange={handleChange}
                    labelWidth="120px"
                  />
                  <InputTextOneLine
                    label="Personalidad"
                    name="personalidad"
                    value={form.personalidad}
                    onChange={handleChange}
                    labelWidth="120px"
                  />
                  <InputTextOneLine
                    label="Afectividad"
                    name="afectividad"
                    value={form.afectividad}
                    onChange={handleChange}
                    labelWidth="120px"
                  />
                  <InputTextOneLine
                    label="Conducta Sexual"
                    name="conductaSexual"
                    value={form.conductaSexual}
                    onChange={handleChange}
                    labelWidth="120px"
                  />
                </div>
              </div>

              {/* ===== COLUMNA 3: PRUEBAS PSICOLÓGICAS Y ÁREA EMOCIONAL ===== */}
              <div className="space-y-3">
                <h3 className="text-blue-600 font-semibold text-[11px] mb-2">Pruebas Psicológicas</h3>

                {/* Ptje Nombre - Pruebas Psicológicas */}
                <div className="bg-gray-50 border border-gray-300 rounded p-3">
                  <h4 className="text-blue-600 font-semibold text-[11px] mb-2">Ptje Nombre</h4>
                  <div className="space-y-1">
                    <InputCheckbox
                      label="Inventario Millón de Estilos de Personalidad - MIPS"
                      name="mips"
                      checked={form.mips}
                      onChange={handleCheckBoxChange}
                    />
                    <InputCheckbox
                      label="Escala de Motivaciones Psicosociales - MPS"
                      name="mps"
                      checked={form.mps}
                      onChange={handleCheckBoxChange}
                    />
                    <InputCheckbox
                      label="Luria - DNA Diagnóstico neuropsicológico de Adultos"
                      name="luria"
                      checked={form.luria}
                      onChange={handleCheckBoxChange}
                    />
                    <InputCheckbox
                      label="Escala de Apreciación del Estrés EAE"
                      name="eae"
                      checked={form.eae}
                      onChange={handleCheckBoxChange}
                    />
                    <InputCheckbox
                      label="Inventario de Burnout de Maslach"
                      name="maslach"
                      checked={form.maslach}
                      onChange={handleCheckBoxChange}
                    />
                    <InputCheckbox
                      label="Clima laboral"
                      name="climaLaboral"
                      checked={form.climaLaboral}
                      onChange={handleCheckBoxChange}
                    />
                    <InputCheckbox
                      label="Batería de Conductores"
                      name="conductores"
                      checked={form.conductores}
                      onChange={handleCheckBoxChange}
                    />
                    <InputCheckbox
                      label="WAIS"
                      name="wais"
                      checked={form.wais}
                      onChange={handleCheckBoxChange}
                    />
                    <InputCheckbox
                      label="Test BENTON"
                      name="benton"
                      checked={form.benton}
                      onChange={handleCheckBoxChange}
                    />
                    <InputCheckbox
                      label="Test Bender"
                      name="bender"
                      checked={form.bender}
                      onChange={handleCheckBoxChange}
                    />
                    <InputCheckbox
                      label="Inventario de la ansiedad ZUNG"
                      name="zungAnsiedad"
                      checked={form.zungAnsiedad}
                      onChange={handleCheckBoxChange}
                    />
                    <InputCheckbox
                      label="Inventario de Depresión ZUNG"
                      name="zungDepresion"
                      checked={form.zungDepresion}
                      onChange={handleCheckBoxChange}
                    />
                    <InputCheckbox
                      label="Escala de Memoria de Wechsler"
                      name="wechsler"
                      checked={form.wechsler}
                      onChange={handleCheckBoxChange}
                    />
                    <InputCheckbox
                      label="Otras Pruebas"
                      name="otrasPruebas"
                      checked={form.otrasPruebas}
                      onChange={handleCheckBoxChange}
                    />
                  </div>
                </div>

                {/* Área Emocional */}
                <div className="bg-gray-50 border border-gray-300 rounded p-3">
                  <h4 className="text-blue-600 font-semibold text-[11px] mb-2">Área Emocional</h4>
                  <InputTextArea
                    name="areaEmocional"
                    value={form.areaEmocional}
                    onChange={handleChange}
                    rows={8}
                    className="w-full"
                    placeholder="Describir el estado emocional del paciente..."
                  />
                </div>
              </div>

            </div>
            {/* BOTONES DE ACCIÓN */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleSave}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-base px-6 py-2 rounded flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faSave} /> Guardar/Actualizar
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="bg-yellow-400 hover:bg-yellow-500 text-white text-base px-6 py-2 rounded flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faBroom} /> Limpiar
                </button>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-bold italic text-base mb-1">IMPRIMIR</span>
                <div className="flex items-center gap-2">
                  <input
                    name="norden"
                    value={form.norden}
                    onChange={handleChange}
                    className="border rounded px-2 py-1 text-base w-24"
                  />

                  <button
                    type="button"
                    onClick={handlePrint}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-base px-4 py-2 rounded flex items-center gap-2"
                  >
                    <FontAwesomeIcon icon={faPrint} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
