import {
  InputTextOneLine,
  InputTextArea,
  InputsRadioGroup,
  InputCheckbox,
} from "../../../../../components/reusableComponents/ResusableComponents";

export default function Abdomen({
  form,
  handleChange,
  handleRadioButton,
  handleCheckBoxChange
}) {
  return (
    <div className="p-4" style={{ fontSize: "10px" }}>
      {/* Primera fila - 2 columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4">
        {/* Examen Físico - Abdomen */}
        <div className="bg-white border border-gray-200 rounded-lg p-3 h-full flex flex-col">
          <h4 className="font-semibold text-gray-800 mb-3">Examen Físico - Abdomen</h4>

          <div className="space-y-3 flex-1">
            {/* Abdomen */}
            <InputTextOneLine
              label="Abdomen:"
              name="abdomen"
              value={form.abdomen}
              onChange={handleChange}
              labelWidth="120px"
            />

            {/* Columna Vertebral */}
            <InputTextOneLine
              label="Columna Vertebral:"
              name="columnaVertebral"
              value={form.columnaVertebral}
              onChange={handleChange}
              labelWidth="120px"
            />

            {/* Anillos Inguinales */}
            <InputTextOneLine
              label="Anillos Inguinales:"
              name="anillosInguinales"
              value={form.anillosInguinales}
              onChange={handleChange}
              labelWidth="120px"
            />

            {/* Órganos Genitales */}
            <InputTextOneLine
              label="Órganos Genitales:"
              name="organosGenitales"
              value={form.organosGenitales}
              onChange={handleChange}
              labelWidth="120px"
            />

          </div>
        </div>

        {/* Tacto Rectal */}
        <div className="bg-white border border-gray-200 rounded-lg p-3 h-full flex flex-col">
          <h4 className="font-semibold text-gray-800 mb-3">Tacto Rectal</h4>

          <div className="space-y-3 flex-1">
            <InputsRadioGroup
              name="tactoRectal"
              value={form.tactoRectal}
              onChange={handleRadioButton}
              options={[
                { label: "No se hizo", value: "NO_SE_HIZO" },
                { label: "Normal", value: "NORMAL" },
                { label: "Anormal", value: "ANORMAL" },
              ]}
            />
            {/* Campos adicionales */}
            <div className="border-t pt-3 mt-3 space-y-3">
              {/* Primera fila - 3 columnas */}
              <div className="grid grid-cols-3 gap-3">
                <InputTextOneLine
                  label="Hernias"
                  name="hernias"
                  value={form.hernias}
                  onChange={handleChange}
                  labelOnTop
                />
                <InputTextOneLine
                  label="Várices"
                  name="varices"
                  value={form.varices}
                  onChange={handleChange}
                  labelOnTop
                />
                <InputTextOneLine
                  label="Ganglios"
                  name="ganglios"
                  value={form.ganglios}
                  onChange={handleChange}
                  labelOnTop
                />
              </div>

              {/* Segunda fila - evaluación cognitiva */}
              <InputTextOneLine
                label="Lenguaje, Atención, Memoria, Orientación, Inteligencia Afectividad"
                name="evaluacionCognitiva"
                value={form.evaluacionCognitiva}
                onChange={handleChange}
                labelWidth="367px"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Segunda fila - 2 columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4">
        {/* Información Radiológica */}
        <div className="bg-white border border-gray-200 rounded-lg p-3 h-full flex flex-col">
          <h4 className="font-semibold text-gray-800 mb-3">Información Radiológica</h4>

          <div className="space-y-3 flex-1">
            <div className="grid grid-cols-2 gap-3">
              <InputTextOneLine
                label="N°Rx"
                name="numeroRx"
                value={form.numeroRx}
                disabled
                labelWidth="80px"
              />
              <InputTextOneLine
                label="Fecha"
                name="fechaRx"
                value={form.fechaRx}
                disabled
                labelWidth="80px"
              />
              <InputTextOneLine
                label="Calidad"
                name="calidadRx"
                value={form.calidadRx}
                onChange={handleChange}
                labelWidth="80px"
              />
              <InputTextOneLine
                label="Símbolos"
                name="simbolosRx"
                value={form.simbolosRx}
                onChange={handleChange}
                labelWidth="80px"
              />
            </div>
          </div>
        </div>

        {/* Conclusiones Radiográficas */}
        <div className="bg-white border border-gray-200 rounded-lg p-3 h-full flex flex-col">
          <h4 className="font-semibold text-gray-800 mb-3">Conclusiones Radiográficas</h4>

          <div className="space-y-3 flex-1">
            <div className="grid grid-cols-2 gap-3">
              <InputTextOneLine
                label="Vértices"
                name="vertices"
                value={form.vertices}
                disabled
                labelWidth="120px"
              />
              <InputTextOneLine
                label="Hilios"
                name="hilios"
                value={form.hilios}
                disabled
                labelWidth="120px"
              />
              <InputTextOneLine
                label="Senos"
                name="senos"
                value={form.senos}
                disabled
                labelWidth="120px"
              />
              <InputTextOneLine
                label="Mediastinos"
                name="mediastinos"
                value={form.mediastinos}
                disabled
                labelWidth="120px"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <InputTextOneLine
                label="Conclusiones Radiográficas"
                name="conclusionesRadiograficas"
                value={form.conclusionesRadiograficas}
                disabled
                labelWidth="120px"
              />
              <InputTextOneLine
                label="Silueta Cardiovascular"
                name="siluetaCardiovascular"
                value={form.siluetaCardiovascular}
                disabled
                labelWidth="120px"
              />
            </div>
          </div>
        </div>
      </div>



      {/* Tercera fila - 2 columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
        {/* Estado Mental y Anamnesis */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-3 h-full flex flex-col">
          <h4 className="font-semibold text-gray-800 mb-3">Estado Mental y Anamnesis</h4>

          <div className="space-y-4 flex-1">
            <InputTextOneLine
              label="Estado Mental"
              name="estadoMental"
              value={form.estadoMental}
              onChange={handleChange}
              labelWidth="120px"
            />

            <InputTextArea
              rows={4}
              label="Anamnesis"
              name="anamnesis"
              value={form.anamnesis}
              onChange={handleChange}
              placeholder="Describir la anamnesis del paciente..."
            />
          </div>
        </div>

        {/* Clasificación y Neumoconiosis */}
        <div className="lg:col-span-3 bg-white border border-gray-200 rounded-lg p-3 h-full flex flex-col">
          <h4 className="font-semibold text-gray-800 mb-3">Clasificación y Neumoconiosis</h4>

          <div className="space-y-4 flex-1">
            {/* Sistema de Clasificación */}
            <div>
              <h5 className="font-semibold text-gray-700 mb-2">Clasificación</h5>
              <div className="space-y-2">
                <div className="flex items-end gap-2">
                  {/* Grupo CERO */}
                  <div className="flex flex-col items-center">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="clasificacion"
                        value="0/0"
                        checked={form.clasificacion === "0/0"}
                        onChange={handleRadioButton}
                        className="w-4 h-4"
                      />
                      <span className="text=[11px] text-blue-600 font-medium">0/0</span>
                    </label>
                    <div className="bg-yellow-200 border border-yellow-300 px-3 py-2 rounded text=[11px] font-semibold text-black">
                      CERO
                    </div>
                  </div>

                  <div className="w-px h-10 bg-gray-300"></div>

                  {/* Grupo 1/0 */}
                  <div className="flex flex-col items-center">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="clasificacion"
                        value="1/0"
                        checked={form.clasificacion === "1/0"}
                        onChange={handleRadioButton}
                        className="w-4 h-4"
                      />
                      <span className="text=[11px] text-blue-600 font-medium">1/0</span>
                    </label>
                    <div className="bg-yellow-200 border border-yellow-300 px-3 py-2 rounded text=[11px] font-semibold text-black">
                      1/0
                    </div>
                  </div>

                  <div className="w-px h-10 bg-gray-300"></div>

                  {/* Grupo UNO */}
                  <div className="flex gap-2">
                    <div className="flex flex-col items-center">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="clasificacion"
                          value="1/1"
                          checked={form.clasificacion === "1/1"}
                          onChange={handleRadioButton}
                          className="w-4 h-4"
                        />
                        <span className="text=[11px] text-blue-600 font-medium">1/1</span>
                      </label>
                      <div className="bg-yellow-200 border border-yellow-300 px-3 py-2 rounded text=[11px] font-semibold text-black">
                        UNO
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="clasificacion"
                          value="1/2"
                          checked={form.clasificacion === "1/2"}
                          onChange={handleRadioButton}
                          className="w-4 h-4"
                        />
                        <span className="text=[11px] text-blue-600 font-medium">1/2</span>
                      </label>
                      <div className="bg-yellow-200 border border-yellow-300 px-3 py-2 rounded text=[11px] font-semibold text-black">
                        UNO
                      </div>
                    </div>
                  </div>

                  <div className="w-px h-10 bg-gray-300"></div>

                  {/* Grupo DOS */}
                  <div className="flex gap-2">
                    <div className="flex flex-col items-center">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="clasificacion"
                          value="2/1"
                          checked={form.clasificacion === "2/1"}
                          onChange={handleRadioButton}
                          className="w-4 h-4"
                        />
                        <span className="text=[11px] text-blue-600 font-medium">2/1</span>
                      </label>
                      <div className="bg-yellow-200 border border-yellow-300 px-3 py-2 rounded text=[11px] font-semibold text-black">
                        DOS
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="clasificacion"
                          value="2/2"
                          checked={form.clasificacion === "2/2"}
                          onChange={handleRadioButton}
                          className="w-4 h-4"
                        />
                        <span className="text=[11px] text-blue-600 font-medium">2/2</span>
                      </label>
                      <div className="bg-yellow-200 border border-yellow-300 px-3 py-2 rounded text=[11px] font-semibold text-black">
                        DOS
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="clasificacion"
                          value="2/3"
                          checked={form.clasificacion === "2/3"}
                          onChange={handleRadioButton}
                          className="w-4 h-4"
                        />
                        <span className="text=[11px] text-blue-600 font-medium">2/3</span>
                      </label>
                      <div className="bg-yellow-200 border border-yellow-300 px-3 py-2 rounded text=[11px] font-semibold text-black">
                        DOS
                      </div>
                    </div>
                  </div>

                  <div className="w-px h-10 bg-gray-300"></div>

                  {/* Grupo TRES */}
                  <div className="flex gap-2">
                    <div className="flex flex-col items-center">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="clasificacion"
                          value="3/2"
                          checked={form.clasificacion === "3/2"}
                          onChange={handleRadioButton}
                          className="w-4 h-4"
                        />
                        <span className="text=[11px] text-blue-600 font-medium">3/2</span>
                      </label>
                      <div className="bg-yellow-200 border border-yellow-300 px-3 py-2 rounded text=[11px] font-semibold text-black">
                        TRES
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="clasificacion"
                          value="3/3"
                          checked={form.clasificacion === "3/3"}
                          onChange={handleRadioButton}
                          className="w-4 h-4"
                        />
                        <span className="text=[11px] text-blue-600 font-medium">3/3</span>
                      </label>
                      <div className="bg-yellow-200 border border-yellow-300 px-3 py-2 rounded text=[11px] font-semibold text-black">
                        TRES
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="clasificacion"
                          value="3/+"
                          checked={form.clasificacion === "3/+"}
                          onChange={handleRadioButton}
                          className="w-4 h-4"
                        />
                        <span className="text=[11px] text-blue-600 font-medium">3/+</span>
                      </label>
                      <div className="bg-yellow-200 border border-yellow-300 px-3 py-2 rounded text=[11px] font-semibold text-black">
                        TRES
                      </div>
                    </div>
                  </div>

                  <div className="w-px h-10 bg-gray-300"></div>

                  {/* Grupo CUATRO */}
                  <div className="flex gap-2">
                    <div className="flex flex-col items-center">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="clasificacion"
                          value="A,B,C"
                          checked={form.clasificacion === "A,B,C"}
                          onChange={handleRadioButton}
                          className="w-4 h-4"
                        />
                        <span className="text=[11px] text-blue-600 font-medium">A, B C</span>
                      </label>
                      <div className="bg-yellow-200 border border-yellow-300 px-3 py-2 rounded text=[11px] font-semibold text-black">
                        CUATRO
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="clasificacion"
                          value="St"
                          checked={form.clasificacion === "St"}
                          onChange={handleRadioButton}
                          className="w-4 h-4"
                        />
                        <span className="text=[11px] text-blue-600 font-medium">St</span>
                      </label>
                      <div className="bg-yellow-200 border border-yellow-300 px-3 py-2 rounded text=[11px] font-semibold text-black">
                        CUATRO
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reacciones Serológicas */}
            <div>
              <h5 className="font-semibold text-gray-700 mb-2">Reacciones Serológicas Lues - aLues</h5>
              <div className="flex gap-4">
                <label className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    name="reaccionesSerologicasPositivo"
                    checked={form.reaccionesSerologicasPositivo}
                    onChange={handleCheckBoxChange} //disabled
                  />
                  <span >Positivo</span>
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    name="reaccionesSerologicasNegativo"
                    checked={form.reaccionesSerologicasNegativo}
                    onChange={handleCheckBoxChange}//disabled // negativo por defecto 
                  />
                  <span>Negativo</span>
                </label>
              </div>
            </div>

            {/* Neumoconiosis */}
            <div className="space-y-2">
              <InputTextOneLine
                label="Sin neumoconiosis"
                name="sinNeumoconiosis"
                value={form.sinNeumoconiosis}
                onChange={handleChange}
                labelWidth="150px"
              />
              <InputTextOneLine
                label="Imagen Radiográfica de Exposición a Polvo"
                name="imagenRadiograficaPolvo"
                value={form.imagenRadiograficaPolvo}
                onChange={handleChange}
                labelWidth="150px"
              />
              <InputTextOneLine
                label="Con Neumoconiosis"
                name="conNeumoconiosis"
                value={form.conNeumoconiosis}
                onChange={handleChange}
                labelWidth="150px"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
