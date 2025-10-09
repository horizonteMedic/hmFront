import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBrain } from "@fortawesome/free-solid-svg-icons";
import PropTypes from 'prop-types';
import {
  InputsRadioGroup,
  InputTextArea,
  InputTextOneLine,
  InputCheckbox
} from "../../../../../../components/reusableComponents/ResusableComponents";

const ExamenMental = ({ form, handleChange }) => {

  return (
    <div className="mx-auto bg-white overflow-hidden">
      <div className="flex h-full">
        <div className="w-full space-y-3 ">
          {/* Header */}
          <div className="flex items-center px-6">
            <FontAwesomeIcon icon={faBrain} className="mr-2 text-[#233245]" />
            <h2 className="text-[11px] font-semibold text-[#233245] uppercase tracking-wider">
              Examen Mental
            </h2>
          </div>

          {/* Content - 3 Columnas */}
          <div className=" text-[11px] space-y-3">
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
                    onChange={handleChange}
                    options={[
                      { label: "Adecuado", value: "Adecuado" },
                      { label: "Inadecuado", value: "Inadecuado" }
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
                    onChange={handleChange}
                    options={[
                      { label: "Erguida", value: "Erguida" },
                      { label: "Encorvada", value: "Encorvada" }
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
                      onChange={handleChange}
                      options={[
                        { label: "Lento", value: "Lento" },
                        { label: "Rápido", value: "Rápido" },
                        { label: "Fluido", value: "Fluido" }
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
                      onChange={handleChange}
                      options={[
                        { label: "Bajo", value: "Bajo" },
                        { label: "Moderado", value: "Moderado" },
                        { label: "Alto", value: "Alto" }
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
                      onChange={handleChange}
                      options={[
                        { label: "Con dificultad", value: "Con dificultad" },
                        { label: "Sin dificultad", value: "Sin dificultad" }
                      ]}
                    />
                    </div>
                  </div>
                </div>

                {/* Orientación */}
                <div className="bg-gray-50 border border-gray-300 rounded p-3">
                  <h4 className="text-blue-600 font-semibold text-[11px] mb-2">Orientación</h4>
                  
                  {/* Tiempo */}
                  <div className="mb-3">
                    <h5 className="font-semibold text-[11px] mb-1">Tiempo</h5>
                    <div className="flex gap-4">
                    <InputsRadioGroup
                      name="orientacionTiempo"
                      value={form.orientacionTiempo}
                      onChange={handleChange}
                      options={[
                        { label: "Orientado", value: "Orientado" },
                        { label: "Desorientado", value: "Desorientado" }
                      ]}
                    />
                    </div>
                  </div>

                  {/* Espacio */}
                  <div className="mb-3">
                    <h5 className="font-semibold text-[11px] mb-1">Espacio</h5>
                    <div className="flex gap-4">
                    <InputsRadioGroup
                      name="orientacionEspacio"
                      value={form.orientacionEspacio}
                      onChange={handleChange}
                      options={[
                        { label: "Orientado", value: "Orientado" },
                        { label: "Desorientado", value: "Desorientado" }
                      ]}
                    />
                    </div>
                  </div>

                  {/* Persona */}
                  <div>
                    <h5 className="font-semibold text-[11px] mb-1">Persona</h5>
                    <div className="flex gap-4">
                    <InputsRadioGroup
                      name="orientacionPersona"
                      value={form.orientacionPersona}
                      onChange={handleChange}
                      options={[
                        { label: "Orientado", value: "Orientado" },
                        { label: "Desorientado", value: "Desorientado" }
                      ]}
                    />
                    </div>
                  </div>
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
                
                {/* Lucido, atento */}
                <div className="bg-gray-50 border border-gray-300 rounded p-3">
                  <InputTextOneLine
                    label="Lucido, atento"
                    name="lucidoAtento"
                    value={form.lucidoAtento}
                    onChange={handleChange}
                    className="mb-2"
                    labelWidth="120px"
                    inputClassName="bg-blue-50 border-blue-200"
                  />
                </div>

                {/* Pensamiento */}
                <div className="bg-gray-50 border border-gray-300 rounded p-3">
                  <InputTextOneLine
                    label="Pensamiento"
                    name="pensamiento"
                    value={form.pensamiento}
                    onChange={handleChange}
                    className="mb-2"
                    labelWidth="120px"
                    inputClassName="bg-blue-50 border-blue-200"
                  />
                </div>

                {/* Percepción */}
                <div className="bg-gray-50 border border-gray-300 rounded p-3">
                  <InputTextOneLine
                    label="Percepción"
                    name="percepcion"
                    value={form.percepcion}
                    onChange={handleChange}
                    className="mb-2"
                    labelWidth="120px"
                    inputClassName="bg-blue-50 border-blue-200"
                  />
                </div>

                {/* Memoria */}
                <div className="bg-gray-50 border border-gray-300 rounded p-3">
                  <h4 className="text-blue-600 font-semibold text-[11px] mb-2">Memoria</h4>

                  <div className="grid grid-cols-3 gap-y-1 gap-x-2">
                    {[
                      "Corto Plazo",
                      "Mediano Plazo",
                      "Largo Plazo"
                    ].map((tipo) => (
                      <label key={tipo} className="flex items-center gap-1">
                        <input
                          type="radio"
                          name="memoria"
                          value={tipo}
                          checked={form.memoria === tipo}
                          onChange={handleChange}
                        />
                        <span className="text-[11px]">{tipo}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Inteligencia */}
                <div className="bg-gray-50 border border-gray-300 rounded p-3">
                  <h4 className="text-blue-600 font-semibold text-[11px] mb-2">Inteligencia</h4>

                  <div className="grid grid-cols-4 gap-y-1 gap-x-2">
                    {[
                      "Muy Superior",
                      "Superior",
                      "Normal Brillante",
                      "Promedio",
                      "N.Torpe",
                      "Fronterizo",
                      "RM Leve",
                      "RM Moderado",
                      "RM Severo",
                      "RM Profundo",
                    ].map((nivel) => (
                      <label key={nivel} className="flex items-center gap-1">
                        <input
                          type="radio"
                          name="inteligencia"
                          value={nivel}
                          checked={form.inteligencia === nivel}
                          onChange={handleChange}
                        />
                        <span className="text-[11px]">{nivel}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Apetito */}
                <div className="bg-gray-50 border border-gray-300 rounded p-3">
                  <InputTextOneLine
                    label="Apetito"
                    name="apetito"
                    value={form.apetito}
                    onChange={handleChange}
                    className="mb-2"
                    labelWidth="120px"
                    inputClassName="bg-blue-50 border-blue-200"
                  />
                </div>

                {/* Sueño */}
                <div className="bg-gray-50 border border-gray-300 rounded p-3">
                  <InputTextOneLine
                    label="Sueño"
                    name="sueno"
                    value={form.sueno}
                    onChange={handleChange}
                    className="mb-2"
                    labelWidth="120px"
                    inputClassName="bg-blue-50 border-blue-200"
                  />
                </div>

                {/* Personalidad */}
                <div className="bg-gray-50 border border-gray-300 rounded p-3">
                  <InputTextOneLine
                    label="Personalidad"
                    name="personalidad"
                    value={form.personalidad}
                    onChange={handleChange}
                    className="mb-2"
                    labelWidth="120px"
                    inputClassName="bg-blue-50 border-blue-200"
                  />
                </div>

                {/* Afectividad */}
                <div className="bg-gray-50 border border-gray-300 rounded p-3">
                  <InputTextOneLine
                    label="Afectividad"
                    name="afectividad"
                    value={form.afectividad}
                    onChange={handleChange}
                    className="mb-2"
                    labelWidth="120px"
                    inputClassName="bg-blue-50 border-blue-200"
                  />
                </div>

                {/* Conducta Sexual */}
                <div className="bg-gray-50 border border-gray-300 rounded p-3">
                  <InputTextOneLine
                    label="Conducta Sexual"
                    name="conductaSexual"
                    value={form.conductaSexual}
                    onChange={handleChange}
                    className="mb-2"
                    labelWidth="120px"
                    inputClassName="bg-blue-50 border-blue-200"
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
                      onChange={(e) => handleChange(e, e.target.checked)}
                    />
                    <InputCheckbox
                      label="Escala de Motivaciones Psicosociales - MPS"
                      name="mps"
                      checked={form.mps}
                      onChange={(e) => handleChange(e, e.target.checked)}
                    />
                    <InputCheckbox
                      label="Luria - DNA Diagnóstico neuropsicológico de Adultos"
                      name="luria"
                      checked={form.luria}
                      onChange={(e) => handleChange(e, e.target.checked)}
                    />
                    <InputCheckbox
                      label="Escala de Apreciación del Estrés EAE"
                      name="eae"
                      checked={form.eae}
                      onChange={(e) => handleChange(e, e.target.checked)}
                    />
                    <InputCheckbox
                      label="Inventario de Burnout de Maslach"
                      name="maslach"
                      checked={form.maslach}
                      onChange={(e) => handleChange(e, e.target.checked)}
                    />
                    <InputCheckbox
                      label="Clima laboral"
                      name="climaLaboral"
                      checked={form.climaLaboral}
                      onChange={(e) => handleChange(e, e.target.checked)}
                    />
                    <InputCheckbox
                      label="Batería de Conductores"
                      name="conductores"
                      checked={form.conductores}
                      onChange={(e) => handleChange(e, e.target.checked)}
                    />
                    <InputCheckbox
                      label="WAIS"
                      name="wais"
                      checked={form.wais}
                      onChange={(e) => handleChange(e, e.target.checked)}
                    />
                    <InputCheckbox
                      label="Test BENTON"
                      name="benton"
                      checked={form.benton}
                      onChange={(e) => handleChange(e, e.target.checked)}
                    />
                    <InputCheckbox
                      label="Test Bender"
                      name="bender"
                      checked={form.bender}
                      onChange={(e) => handleChange(e, e.target.checked)}
                    />
                    <InputCheckbox
                      label="Inventario de la ansiedad ZUNG"
                      name="zungAnsiedad"
                      checked={form.zungAnsiedad}
                      onChange={(e) => handleChange(e, e.target.checked)}
                    />
                    <InputCheckbox
                      label="Inventario de Depresión ZUNG"
                      name="zungDepresion"
                      checked={form.zungDepresion}
                      onChange={(e) => handleChange(e, e.target.checked)}
                    />
                    <InputCheckbox
                      label="Escala de Memoria de Wechsler"
                      name="wechsler"
                      checked={form.wechsler}
                      onChange={(e) => handleChange(e, e.target.checked)}
                    />
                    <InputCheckbox
                      label="Otras Pruebas"
                      name="otrasPruebas"
                      checked={form.otrasPruebas}
                      onChange={(e) => handleChange(e, e.target.checked)}
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
          </div>
        </div>
      </div>
    </div>
  );
};

ExamenMental.propTypes = {
  form: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default ExamenMental;
