import {
  InputTextOneLine,
  InputTextArea,
  InputsRadioGroup,
} from "../../../../../components/reusableComponents/ResusableComponents";

export default function Abdomen({
  form,
  handleChange,
  handleRadioButton,
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
              label="Abdomen"
              name="abdomen"
              value={form.abdomen}
              onChange={handleChange}
              labelWidth="120px"
            />

            {/* Columna Vertebral */}
            <InputTextOneLine
              label="Columna Vertebral"
              name="columnaVertebral"
              value={form.columnaVertebral}
              onChange={handleChange}
              labelWidth="120px"
            />

            {/* Anillos Inguinales */}
            <InputTextOneLine
              label="Anillos Inguinales"
              name="anillosInguinales"
              value={form.anillosInguinales}
              onChange={handleChange}
              labelWidth="120px"
            />

            {/* Órganos Genitales */}
            <InputTextOneLine
              label="Órganos Genitales"
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
                    <InputsRadioGroup
                      name="clasificacion"
                      value={form.clasificacion}
                      onChange={handleRadioButton}
                      options={[
                        { label: "0/0", value: "0/0" },
                      ]}
                    />
                    <div className="bg-yellow-200 border border-yellow-300 px-3 py-2 rounded text=[11px] font-semibold text-black">
                      CERO
                    </div>
                  </div>

                  <div className="w-px h-10 bg-gray-300"></div>

                  {/* Grupo 1/0 */}
                  <div className="flex flex-col items-center">
                    <InputsRadioGroup
                      name="clasificacion"
                      value={form.clasificacion}
                      onChange={handleRadioButton}
                      options={[
                        { label: "1/0", value: "1/0" },
                      ]}
                    />
                    <div className="bg-yellow-200 border border-yellow-300 px-3 py-2 rounded text=[11px] font-semibold text-black">
                      1/0
                    </div>
                  </div>

                  <div className="w-px h-10 bg-gray-300"></div>

                  {/* Grupo UNO */}
                  <div className="flex gap-2">
                    <div className="flex flex-col items-center">
                      <InputsRadioGroup
                        name="clasificacion"
                        value={form.clasificacion}
                        onChange={handleRadioButton}
                        options={[
                          { label: "1/1", value: "1/1" },
                        ]}
                      />
                      <div className="bg-yellow-200 border border-yellow-300 px-3 py-2 rounded text=[11px] font-semibold text-black">
                        UNO
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <InputsRadioGroup
                        name="clasificacion"
                        value={form.clasificacion}
                        onChange={handleRadioButton}
                        options={[
                          { label: "1/2", value: "1/2" },
                        ]}
                      />
                      <div className="bg-yellow-200 border border-yellow-300 px-3 py-2 rounded text=[11px] font-semibold text-black">
                        UNO
                      </div>
                    </div>
                  </div>

                  <div className="w-px h-10 bg-gray-300"></div>

                  {/* Grupo DOS */}
                  <div className="flex gap-2">
                    <div className="flex flex-col items-center">
                      <InputsRadioGroup
                        name="clasificacion"
                        value={form.clasificacion}
                        onChange={handleRadioButton}
                        options={[
                          { label: "2/1", value: "2/1" },
                        ]}
                      />
                      <div className="bg-yellow-200 border border-yellow-300 px-3 py-2 rounded text=[11px] font-semibold text-black">
                        DOS
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <InputsRadioGroup
                        name="clasificacion"
                        value={form.clasificacion}
                        onChange={handleRadioButton}
                        options={[
                          { label: "2/2", value: "2/2" },
                        ]}
                      />
                      <div className="bg-yellow-200 border border-yellow-300 px-3 py-2 rounded text=[11px] font-semibold text-black">
                        DOS
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <InputsRadioGroup
                        name="clasificacion"
                        value={form.clasificacion}
                        onChange={handleRadioButton}
                        options={[
                          { label: "2/3", value: "2/3" },
                        ]}
                      />
                      <div className="bg-yellow-200 border border-yellow-300 px-3 py-2 rounded text=[11px] font-semibold text-black">
                        DOS
                      </div>
                    </div>
                  </div>

                  <div className="w-px h-10 bg-gray-300"></div>

                  {/* Grupo TRES */}
                  <div className="flex gap-2">
                    <div className="flex flex-col items-center">
                      <InputsRadioGroup
                        name="clasificacion"
                        value={form.clasificacion}
                        onChange={handleRadioButton}
                        options={[
                          { label: "3/2", value: "3/2" },
                        ]}
                      />
                      <div className="bg-yellow-200 border border-yellow-300 px-3 py-2 rounded text=[11px] font-semibold text-black">
                        TRES
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <InputsRadioGroup
                        name="clasificacion"
                        value={form.clasificacion}
                        onChange={handleRadioButton}
                        options={[
                          { label: "3/3", value: "3/3" },
                        ]}
                      />
                      <div className="bg-yellow-200 border border-yellow-300 px-3 py-2 rounded text=[11px] font-semibold text-black">
                        TRES
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <InputsRadioGroup
                        name="clasificacion"
                        value={form.clasificacion}
                        onChange={handleRadioButton}
                        options={[
                          { label: "3/+", value: "3/+" },
                        ]}
                      />
                      <div className="bg-yellow-200 border border-yellow-300 px-3 py-2 rounded text=[11px] font-semibold text-black">
                        TRES
                      </div>
                    </div>
                  </div>

                  <div className="w-px h-10 bg-gray-300"></div>

                  {/* Grupo CUATRO */}
                  <div className="flex gap-2">
                    <div className="flex flex-col items-center">
                      <InputsRadioGroup
                        name="clasificacion"
                        value={form.clasificacion}
                        onChange={handleRadioButton}
                        options={[
                          { label: "A, B y C", value: "ABC" },
                        ]}
                      />
                      <div className="bg-yellow-200 border border-yellow-300 px-3 py-2 rounded text=[11px] font-semibold text-black">
                        CUATRO
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <InputsRadioGroup
                        name="clasificacion"
                        value={form.clasificacion}
                        onChange={handleRadioButton}
                        options={[
                          { label: "St", value: "ST" },
                        ]}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reacciones Serológicas */}
            <div>
              <h5 className="font-semibold text-gray-700 mb-2">Reacciones Serológicas Lues - aLues</h5>
              <div className="flex gap-4">
                <InputsRadioGroup
                  name="reaccionesSerologicas"
                  value={form.reaccionesSerologicas}
                  onChange={handleRadioButton}
                  disabled
                  options={[
                    { label: "Positivo", value: "POSITIVO" },
                    { label: "Negativo", value: "NEGATIVO" },
                  ]}
                />
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
