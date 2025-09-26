import {
  InputTextOneLine,
  InputTextArea,
  InputsRadioGroup,
  InputCheckbox,
} from "../../../../../components/reusableComponents/ResusableComponents";

export default function Examenes({
  form,
  handleChange,
  handleRadioButton,
  handleCheckBoxChange,
  setForm,
}) {
  return (
    <div className="p-4" style={{ fontSize: "10px" }}>
      {/* Primera fila - 2 columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4">
        {/* Información Triaje */}
        <div className="bg-white border border-gray-200 rounded-lg p-3 h-full flex flex-col">
          <h4 className="font-semibold text-gray-800 mb-2">
            Información Triaje
          </h4>
          <div className="space-y-2 grid grid-cols-2 gap-x-4 flex-1">
            <InputTextOneLine
              label="Temp. (°C)"
              name="temperatura"
              value={form.temperatura}
              disabled
              labelWidth="100px"
            />
            <InputTextOneLine
              label="Cintura (cm)"
              name="cintura"
              value={form.cintura}
              disabled
              labelWidth="100px"
            />
            <InputTextOneLine
              label="Cadera (cm)"
              name="cadera"
              value={form.cadera}
              disabled
              labelWidth="100px"
            />
            <InputTextOneLine
              label="ICC"
              name="icc"
              value={form.icc}
              disabled
              labelWidth="100px"
            />
            <InputTextOneLine
              label="F. Respiratoria (min)"
              name="frecuenciaRespiratoria"
              value={form.frecuenciaRespiratoria}
              disabled
              labelWidth="100px"
            />
            <InputTextOneLine
              label="F. Cardiaca (min)"
              name="frecuenciaCardiaca"
              value={form.frecuenciaCardiaca}
              disabled
              labelWidth="100px"
            />
            <InputTextOneLine
              label="Sat. O2 (%)"
              name="saturacionO2"
              value={form.saturacionO2}
              disabled
              labelWidth="100px"
            />
            <InputTextOneLine
              label="Sistólica (min)"
              name="presionSistolica"
              value={form.presionSistolica}
              disabled
              labelWidth="100px"
            />
            <InputTextOneLine
              label="Diastólica (min)"
              name="presionDiastolica"
              value={form.presionDiastolica}
              disabled
              labelWidth="100px"
            />
            {/* Medidas Físicas integradas */}
            <div className="col-span-2 border-t pt-3 mt-3">
              <h5 className="font-semibold text-gray-800 mb-3 ">
                Medidas Físicas
              </h5>
              <div className="grid grid-cols-3 gap-3">
                <InputTextOneLine
                  label="Talla (m)"
                  name="talla"
                  value={form.talla}
                  disabled
                  labelOnTop
                />
                <InputTextOneLine
                  label="Peso (Kg)"
                  name="peso"
                  value={form.peso}
                  disabled
                  labelOnTop
                />
                <InputTextOneLine
                  label="IMC"
                  name="imc"
                  value={form.imc}
                  className={form.imcRed ? "text-red-600" : ""}
                  disabled
                  labelOnTop
                />
              </div>
            </div>
          </div>
        </div>

        {/* Audiometría */}
        <div className="bg-white border border-gray-200 rounded-lg p-3 h-full flex flex-col">
          <h4 className="font-semibold text-gray-800 mb-2">Audiometría</h4>

          <div className="mb-3 flex-1">
            <h5 className="font-semibold mb-1">Oído Derecho</h5>
            <div className="grid grid-cols-8 gap-1 mb-2">
              <div className="text-center font-semibold">Hz</div>
              <div className="text-center font-semibold">500</div>
              <div className="text-center font-semibold">1000</div>
              <div className="text-center font-semibold">2000</div>
              <div className="text-center font-semibold">3000</div>
              <div className="text-center font-semibold">4000</div>
              <div className="text-center font-semibold">6000</div>
              <div className="text-center font-semibold">8000</div>
            </div>
            <div className="grid grid-cols-8 gap-1">
              <div className="text-center font-semibold my-auto">db (A)</div>
              <InputTextOneLine name="od500" value={form.od500} disabled />
              <InputTextOneLine name="od1000" value={form.od1000} disabled />
              <InputTextOneLine name="od2000" value={form.od2000} disabled />
              <InputTextOneLine name="od3000" value={form.od3000} disabled />
              <InputTextOneLine name="od4000" value={form.od4000} disabled />
              <InputTextOneLine name="od6000" value={form.od6000} disabled />
              <InputTextOneLine name="od8000" value={form.od8000} disabled />
            </div>
          </div>

          <div className="mt-2">
            <h5 className="font-semibold mb-1">Oído Izquierdo</h5>
            <div className="grid grid-cols-8 gap-1 mb-2">
              <div className="text-center font-semibold">Hz</div>
              <div className="text-center font-semibold">500</div>
              <div className="text-center font-semibold">1000</div>
              <div className="text-center font-semibold">2000</div>
              <div className="text-center font-semibold">3000</div>
              <div className="text-center font-semibold">4000</div>
              <div className="text-center font-semibold">6000</div>
              <div className="text-center font-semibold">8000</div>
            </div>
            <div className="grid grid-cols-8 gap-1">
              <div className="text-center font-semibold my-auto">db (A)</div>
              <InputTextOneLine name="oi500" value={form.oi500} disabled />
              <InputTextOneLine name="oi1000" value={form.oi1000} disabled />
              <InputTextOneLine name="oi2000" value={form.oi2000} disabled />
              <InputTextOneLine name="oi3000" value={form.oi3000} disabled />
              <InputTextOneLine name="oi4000" value={form.oi4000} disabled />
              <InputTextOneLine name="oi6000" value={form.oi6000} disabled />
              <InputTextOneLine name="oi8000" value={form.oi8000} disabled />
            </div>
          </div>

          {/* Otoscopía integrada */}
          <div className="mt-3 border-t pt-2">
            <h5 className="font-semibold text-gray-800 mb-2">Otoscopía</h5>
            <div className="space-y-2">
              <InputTextOneLine
                label="O.D:"
                name="otoscopiaOd"
                value={form.otoscopiaOd}
                disabled
              />
              <InputTextOneLine
                label="O.I:"
                name="otoscopiaOi"
                value={form.otoscopiaOi}
                disabled
              />
            </div>
          </div>
        </div>
      </div>

      {/* Segunda fila - 2 columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4">
        {/* Función Respiratoria */}
        <div className="bg-white border border-gray-200 rounded-lg p-3 h-full flex flex-col">
          <h4 className="font-semibold text-gray-800 mb-2">
            Función Respiratoria Abs
          </h4>
          <div className="grid gap-2 mb-2 flex-1">
            <div className="flex items-center gap-2">
              <InputTextOneLine
                label="FVC (% I.)"
                name="fvc"
                value={form.fvc}
                disabled
                labelWidth="100px"
              />
              <div className="flex gap-2">
                <InputCheckbox
                  label="NORMAL"
                  checked={form.funcionABSNormal}
                  onChange={handleCheckBoxChange}
                  name="funcionABSNormal"
                  disabled
                />
                <InputCheckbox
                  label="P. OBSTR"
                  checked={form.funcionABSOBSTR}
                  onChange={handleCheckBoxChange}
                  name="funcionABSOBSTR"
                  disabled
                />
              </div>
            </div>
            <InputTextOneLine
              label="FEV1 (% I.)"
              name="fev1"
              value={form.fev1}
              disabled
              labelWidth="100px"
            />
            <InputTextOneLine
              label="FEV1/FVC (%)"
              name="fev1Fvc"
              value={form.fev1Fvc}
              disabled
              labelWidth="100px"
            />
            <InputTextOneLine
              label="FEF 25-75% (l/s.)"
              name="fef2575"
              value={form.fef2575}
              disabled
              labelWidth="100px"
            />
          </div>
          <InputTextArea
            rows={3}
            label="Conclusión"
            name="conclusionRespiratoria"
            value={form.conclusionRespiratoria}
            disabled
          />
        </div>

        {/* Cabeza, Cuello, Boca */}
        <div className="bg-white border border-gray-200 rounded-lg p-3 h-full flex flex-col">
          <h4 className="font-semibold text-gray-800 mb-2">
            Cabeza, Cuello, Boca
          </h4>
          <div className="space-y-2 flex-1">
            <InputTextOneLine
              label="Cabeza"
              name="cabeza"
              value={form.cabeza}
              onChange={handleChange}
              labelWidth="90px"
            />
            <InputTextOneLine
              label="Nariz"
              name="nariz"
              value={form.nariz}
              onChange={handleChange}
              labelWidth="90px"
            />
            <InputTextOneLine
              label="Cuello"
              name="cuello"
              value={form.cuello}
              onChange={handleChange}
              labelWidth="90px"
            />
            <InputTextOneLine
              label="Perímetro (cm)"
              name="perimetro"
              value={form.perimetro}
              disabled
              labelWidth="90px"
            />
            <InputTextArea
              rows={3}
              label="Boca, Amígdalas, Faringe, Laringe"
              name="bocaAmigdalasFaringeLaringe"
              value={form.bocaAmigdalasFaringeLaringe}
              onChange={handleChange}
            />

            {/* Piel integrada */}
            <div className="border-t pt-2 mt-3">
              <h5 className="font-semibold text-gray-800 mb-2">Piel</h5>
              <div className="space-y-2">
                <InputsRadioGroup
                  name="piel"
                  value={form.piel}
                  onChange={handleRadioButton}
                  options={[
                    { label: "Normal", value: "NORMAL" },
                    { label: "Anormal", value: "ANORMAL" },
                  ]}
                />
                <InputTextArea
                  rows={3}
                  name="pielObservaciones"
                  value={form.pielObservaciones}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Miembros y Reflejos integrados */}
            <div className="border-t pt-2 mt-3">
              <h5 className="font-semibold text-gray-800 mb-2">
                Miembros y Reflejos
              </h5>
              <div className="grid grid-cols-2 gap-2">
                <InputTextOneLine
                  label="Miembros Superiores"
                  name="miembrosSuperiores"
                  value={form.miembrosSuperiores}
                  onChange={handleChange}
                  labelOnTop
                />
                <InputTextOneLine
                  label="Miembros Inferiores"
                  name="miembrosInferiores"
                  value={form.miembrosInferiores}
                  onChange={handleChange}
                  labelOnTop
                />
                <InputTextOneLine
                  label="Reflejos Osteotendinosos"
                  name="reflejosOsteotendinosos"
                  value={form.reflejosOsteotendinosos}
                  onChange={handleChange}
                  labelOnTop
                />
                <InputTextOneLine
                  label="Marcha"
                  name="marcha"
                  value={form.marcha}
                  onChange={handleChange}
                  labelOnTop
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tercera fila - 3 columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Ojos - 5 columnas */}
        <div className="lg:col-span-5">
          <div className="bg-white border border-gray-200 rounded-lg p-3 h-full">
            <h4 className="font-semibold mb-2">Ojos</h4>
            <div className="mb-2">
              <div className="grid grid-cols-5 gap-1 mb-1 text-center font-semibold">
                <div></div>
                <div className="col-span-2">Sin Corregir</div>
                <div className="col-span-2">Corregida</div>

                <div></div>
                <div>O.D</div>
                <div>O.I</div>
                <div>O.D</div>
                <div>O.I</div>
              </div>

              <div className="grid grid-cols-5 gap-2 mb-2">
                <label className="font-semibold">Visión de Cerca:</label>
                <InputTextOneLine
                  name="visionCercaOd"
                  value={form.visionCercaOd}
                  disabled
                />
                <InputTextOneLine
                  name="visionCercaOi"
                  value={form.visionCercaOi}
                  disabled
                />
                <InputTextOneLine
                  name="visionCercaOdCorregida"
                  value={form.visionCercaOdCorregida}
                  disabled
                />
                <InputTextOneLine
                  name="visionCercaOiCorregida"
                  value={form.visionCercaOiCorregida}
                  disabled
                />
              </div>

              <div className="grid grid-cols-5 gap-2 mb-4">
                <label className="font-semibold">Visión de Lejos:</label>
                <InputTextOneLine
                  name="visionLejosOd"
                  value={form.visionLejosOd}
                  disabled
                />
                <InputTextOneLine
                  name="visionLejosOi"
                  value={form.visionLejosOi}
                  disabled
                />
                <InputTextOneLine
                  name="visionLejosOdCorregida"
                  value={form.visionLejosOdCorregida}
                  disabled
                />
                <InputTextOneLine
                  name="visionLejosOiCorregida"
                  value={form.visionLejosOiCorregida}
                  disabled
                />
              </div>
            </div>

            <div className="space-y-2">
              <InputTextOneLine
                label="Visión de Colores"
                name="visionColores"
                value={form.visionColores}
                disabled
                labelWidth="120px"
              />
              <InputTextOneLine
                label="Enferm. Oculares"
                name="enfermedadOculares"
                value={form.enfermedadOculares}
                disabled
                labelWidth="120px"
              />
              <InputTextOneLine
                label="Enfermedad. otros"
                name="enfermedadOtros"
                value={form.enfermedadOtros}
                disabled
                labelWidth="120px"
              />
              <InputTextOneLine
                label="Reflejos Pupilares"
                name="reflejosPupilares"
                value={form.reflejosPupilares}
                disabled
                labelWidth="120px"
              />
              <InputTextOneLine
                label="Visión Binocular"
                name="visionBinocular"
                value={form.visionBinocular}
                disabled
                labelWidth="120px"
              />
            </div>
          </div>
        </div>

        {/* Pulmones - 4 columnas */}
        <div className="lg:col-span-4">
          <div className="bg-white border border-gray-200 rounded-lg p-3 h-full">
            <h4 className="font-semibold text-gray-800 mb-2">Pulmones</h4>
            <div className="space-y-3">
              <InputsRadioGroup
                name="pulmones"
                value={form.pulmones}
                onChange={(e, value) => {
                  handleRadioButton(e, value)
                  if (value == "ANORMAL") {
                    setForm(prev => ({ ...prev, pulmonesObservaciones: "" }));
                  }

                }}
                options={[
                  { label: "Normal", value: "NORMAL" },
                  { label: "Anormal", value: "ANORMAL" },
                ]}
              />
              <InputTextArea
                rows={4}
                name="pulmonesObservaciones"
                value={form.pulmonesObservaciones}
                onChange={handleChange}
              />

              {/* Tórax y Corazón integrados */}
              <div className="border-t pt-2 space-y-2 w-full">
                <InputTextOneLine
                  label="Tórax"
                  name="torax"
                  value={form.torax}
                  onChange={handleChange}
                  labelOnTop
                />
                <InputTextOneLine
                  label="Corazón"
                  name="corazon"
                  value={form.corazon}
                  onChange={handleChange}
                  labelOnTop
                />
              </div>
            </div>
          </div>
        </div>

        {/* Dentadura - 3 columnas (ancho menor) */}
        <div className="lg:col-span-3">
          <div className="bg-white border border-gray-200 rounded-lg p-3 h-full">
            <h4 className="font-semibold text-gray-800 mb-2">Dentadura</h4>
            <div className="space-y-2">
              <InputTextOneLine
                label="Piezas en mal estado"
                name="piezasMalEstado"
                value={form.piezasMalEstado}
                disabled
                labelOnTop
              />
              <InputTextOneLine
                label="Piezas que faltan"
                name="piezasFaltan"
                value={form.piezasFaltan}
                disabled
                labelOnTop
              />
              <InputTextArea
                label="Observaciones"
                rows={8}
                name="dentaduraObservaciones"
                value={form.dentaduraObservaciones}
                disabled
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
