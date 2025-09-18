import {
  InputTextOneLine,
  InputTextArea,
  InputsRadioGroup,
  InputsBooleanRadioGroup,
} from "../../../../../components/reusableComponents/ResusableComponents";

export default function Abdomen({
  form,
  handleChange,
  handleRadioButton,
  handleRadioButtonBoolean,
}) {
  return (
    <div className="p-4" style={{ fontSize: "10px" }}>
      {/* Primera fila - 2 columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4">
        {/* Examen Físico - Abdomen */}
        <div className="bg-white border border-gray-200 rounded-lg p-3 h-full flex flex-col">
          <h4 className="font-semibold text-gray-800 mb-2">
            Examen Físico - Abdomen
          </h4>
          <div className="space-y-2 flex-1">
            <InputTextOneLine
              label="Abdomen:"
              name="abdomen"
              value={form.abdomen}
              onChange={handleChange}
              labelWidth="100px"
              placeholder="RHA(+), B/D, NO DOLOROSO A LA PALPACION"
            />
            <InputTextOneLine
              label="Columna Vertebral:"
              name="columnaVertebral"
              value={form.columnaVertebral}
              onChange={handleChange}
              labelWidth="100px"
              placeholder="CENTRAL, MOVIL, CURVATURAS CONSERVADAS"
            />
            <InputTextOneLine
              label="Anillos Inguinales:"
              name="anillosInguinales"
              value={form.anillosInguinales}
              onChange={handleChange}
              labelWidth="100px"
              placeholder="CONSERVADOS"
            />
            <InputTextOneLine
              label="Órganos Genitales:"
              name="organosGenitales"
              value={form.organosGenitales}
              onChange={handleChange}
              labelWidth="100px"
              placeholder="DE CARACTER NORMAL"
            />
            <InputTextOneLine
              label="Hernias:"
              name="hernias"
              value={form.hernias}
              onChange={handleChange}
              labelWidth="100px"
              placeholder="NO"
            />
            <InputTextOneLine
              label="Várices:"
              name="varices"
              value={form.varices}
              onChange={handleChange}
              labelWidth="100px"
              placeholder="NO"
            />
            <InputTextOneLine
              label="Ganglios:"
              name="ganglios"
              value={form.ganglios}
              onChange={handleChange}
              labelWidth="100px"
              placeholder="NO LINFADENOPATIAS"
            />
          </div>
        </div>

        {/* Tacto Rectal */}
        <div className="bg-white border border-gray-200 rounded-lg p-3 h-full flex flex-col">
          <h4 className="font-semibold text-gray-800 mb-2">Tacto Rectal</h4>
          <div className="space-y-3 flex-1">
            <InputsRadioGroup
              name="tactoRectal"
              value={form.tactoRectal}
              onChange={handleRadioButton}
              options={[
                { label: "No se hizo", value: "no_se_hizo" },
                { label: "Normal", value: "normal" },
                { label: "Anormal", value: "anormal" },
              ]}
            />
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="describirTactoRectal"
                checked={form.describirTactoRectal || false}
                onChange={handleChange}
                className="rounded"
              />
              <label className="font-semibold">Describir en Observación:</label>
            </div>
            <InputTextArea
              rows={3}
              name="tactoRectalObservaciones"
              value={form.tactoRectalObservaciones}
              onChange={handleChange}
              placeholder="Observaciones del tacto rectal..."
            />
          </div>
        </div>
      </div>

      {/* Segunda fila - 2 columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4">
        {/* Estado Mental */}
        <div className="bg-white border border-gray-200 rounded-lg p-3 h-full flex flex-col">
          <h4 className="font-semibold text-gray-800 mb-2">Estado Mental</h4>
          <div className="space-y-2 flex-1">
            <InputTextOneLine
              label="Estado Mental:"
              name="estadoMental"
              value={form.estadoMental}
              onChange={handleChange}
              labelWidth="100px"
              placeholder="DESPIERTO, OTEP, COMUNICATIVO."
            />
            <div className="border-t pt-2 mt-3">
              <h5 className="font-semibold text-gray-800 mb-2">Evaluación Cognitiva</h5>
              <div className="space-y-2">
                <InputTextOneLine
                  label="Lenguaje:"
                  name="lenguaje"
                  value={form.lenguaje}
                  onChange={handleChange}
                  labelWidth="80px"
                  placeholder="NORMAL"
                />
                <InputTextOneLine
                  label="Atención:"
                  name="atencion"
                  value={form.atencion}
                  onChange={handleChange}
                  labelWidth="80px"
                  placeholder="NORMAL"
                />
                <InputTextOneLine
                  label="Memoria:"
                  name="memoria"
                  value={form.memoria}
                  onChange={handleChange}
                  labelWidth="80px"
                  placeholder="NORMAL"
                />
                <InputTextOneLine
                  label="Orientación:"
                  name="orientacion"
                  value={form.orientacion}
                  onChange={handleChange}
                  labelWidth="80px"
                  placeholder="NORMAL"
                />
                <InputTextOneLine
                  label="Inteligencia:"
                  name="inteligencia"
                  value={form.inteligencia}
                  onChange={handleChange}
                  labelWidth="80px"
                  placeholder="NORMAL"
                />
                <InputTextOneLine
                  label="Afectividad:"
                  name="afectividad"
                  value={form.afectividad}
                  onChange={handleChange}
                  labelWidth="80px"
                  placeholder="NORMAL"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Anamnesis */}
        <div className="bg-white border border-gray-200 rounded-lg p-3 h-full flex flex-col">
          <h4 className="font-semibold text-gray-800 mb-2">Anamnesis</h4>
          <div className="space-y-2 flex-1">
            <InputTextArea
              rows={6}
              name="anamnesis"
              value={form.anamnesis}
              onChange={handleChange}
              placeholder="COLABORADOR REFIERE SENTIRSE BIEN, SIN PROBLEMA NO practica deporte o deporte de alto rendimiento."
            />
          </div>
        </div>
      </div>

      {/* Tercera fila - 3 columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Reacciones Serológicas - 4 columnas */}
        <div className="lg:col-span-4">
          <div className="bg-white border border-gray-200 rounded-lg p-3 h-full">
            <h4 className="font-semibold text-gray-800 mb-2">Reacciones Serológicas</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <label className="font-semibold min-w-[120px]">Lues - alues:</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      name="luesPositivo"
                      checked={form.luesPositivo || false}
                      onChange={handleChange}
                      className="rounded"
                    />
                    <span>Positivo</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      name="luesNegativo"
                      checked={form.luesNegativo || false}
                      onChange={handleChange}
                      className="rounded"
                    />
                    <span>Negativo</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Neumoconiosis - 4 columnas */}
        <div className="lg:col-span-4">
          <div className="bg-white border border-gray-200 rounded-lg p-3 h-full">
            <h4 className="font-semibold text-gray-800 mb-2">Neumoconiosis</h4>
            <div className="space-y-2">
              <InputTextOneLine
                label="Sin neumoconiosis:"
                name="sinNeumoconiosis"
                value={form.sinNeumoconiosis}
                onChange={handleChange}
                labelWidth="120px"
              />
              <InputTextOneLine
                label="Con Neumoconiosis:"
                name="conNeumoconiosis"
                value={form.conNeumoconiosis}
                onChange={handleChange}
                labelWidth="120px"
              />
              <InputTextOneLine
                label="Imagen Radiográfica de Exposición a Polvo:"
                name="imagenRadiograficaPolvo"
                value={form.imagenRadiograficaPolvo}
                onChange={handleChange}
                labelWidth="120px"
              />
            </div>
          </div>
        </div>

        {/* Evaluación Categórica - 4 columnas */}
        <div className="lg:col-span-4">
          <div className="bg-white border border-gray-200 rounded-lg p-3 h-full">
            <h4 className="font-semibold text-gray-800 mb-2">Evaluación Categórica</h4>
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-1 text-center">
                <div className="font-semibold text-xs">Código</div>
                <div className="font-semibold text-xs">Selección</div>
                <div className="font-semibold text-xs">Etiqueta</div>
              </div>
              <div className="space-y-1">
                {[
                  { code: "0/0", label: "CERO" },
                  { code: "1/0", label: "1/0" },
                  { code: "1/1", label: "UNO" },
                  { code: "1/2", label: "1/2" },
                  { code: "2/1", label: "2/1" },
                  { code: "2/2", label: "DOS" },
                  { code: "2/3", label: "2/3" },
                  { code: "3/2", label: "3/2" },
                  { code: "3/3", label: "TRES" },
                  { code: "3/+", label: "3/+" },
                  { code: "A, B C", label: "CUATRO" },
                  { code: "St", label: "St" },
                ].map((item) => (
                  <div key={item.code} className="grid grid-cols-3 gap-1 items-center">
                    <div className="text-xs">{item.code}</div>
                    <div className="flex justify-center">
                      <input
                        type="radio"
                        name="evaluacionCategorica"
                        value={item.code}
                        checked={form.evaluacionCategorica === item.code}
                        onChange={handleRadioButton}
                        className="rounded"
                      />
                    </div>
                    <div className="text-xs">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
