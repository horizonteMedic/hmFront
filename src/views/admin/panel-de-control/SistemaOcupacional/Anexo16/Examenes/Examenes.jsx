import {
  InputTextOneLine,
  InputTextArea,
  InputsRadioGroup,
  InputsBooleanRadioGroup,
} from "../../../../../components/reusableComponents/ResusableComponents";

export default function Examenes({
  form,
  handleChange,
  handleRadioButton,
  handleRadioButtonBoolean,
}) {
  return (
    <div className="p-4" style={{ fontSize: "10px" }}>
      <h3 className="font-semibold mb-4 text-gray-800">
        Exámenes Complementarios - Anexo 16
      </h3>

      {/* Primera fila - 3 columnas de igual tamaño */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-4">
        {/* Función Respiratoria */}
        <div className="bg-white border border-gray-200 rounded-lg p-3 h-90 flex flex-col">
          <h4 className="font-semibold text-gray-800 mb-2">
            Función Respiratoria Abs
          </h4>

          <div className="grid gap-2 mb-2 flex-1">
            <div className="flex items-center gap-2">
              <InputTextOneLine
                label="FVC (% I.):"
                name="fvc"
                value={form.fvc}
                onChange={handleChange}
                labelWidth="100px"
              />
              <div className="flex gap-2">
                <label className="flex items-center gap-1">
                  <input type="checkbox" className="rounded" />
                  <span className="text-xs">NORMAL</span>
                </label>
                <label className="flex items-center gap-1">
                  <input type="checkbox" className="rounded" />
                  <span className="text-xs">P. OBSTR...</span>
                </label>
              </div>
            </div>
            <InputTextOneLine
              label="FEV1 (% I.):"
              name="fev1"
              value={form.fev1}
              onChange={handleChange}
              labelWidth="100px"
            />
            <InputTextOneLine
              label="FEV1/FVC (%):"
              name="fev1Fvc"
              value={form.fev1Fvc}
              onChange={handleChange}
              labelWidth="100px"
            />
            <InputTextOneLine
              label="FEF 25-75% (l/s.):"
              name="fef2575"
              value={form.fef2575}
              onChange={handleChange}
              labelWidth="100px"
            />
          </div>
          <InputTextArea
            rows={3}
            label="Conclusión:"
            name="conclusionRespiratoria"
            value={form.conclusionRespiratoria}
            onChange={handleChange}
          />
        </div>

        {/* Información Triaje */}
        <div className="bg-white border border-gray-200 rounded-lg p-3 h-90 flex flex-col">
          <h4 className="font-semibold text-gray-800 mb-2">
            Información Triaje
          </h4>
          <div className="space-y-2 grid grid-cols-2 gap-x-4 flex-1">
            <InputTextOneLine
              label="Temp. (°C):"
              name="temperatura"
              value={form.temperatura}
              onChange={handleChange}
              labelWidth="100px"
            />
            <InputTextOneLine
              label="Cintura (cm):"
              name="cintura"
              value={form.cintura}
              onChange={handleChange}
              labelWidth="100px"
            />
            <InputTextOneLine
              label="Cadera (cm):"
              name="cadera"
              value={form.cadera}
              onChange={handleChange}
              labelWidth="100px"
            />
            <InputTextOneLine
              label="ICC:"
              name="icc"
              value={form.icc}
              onChange={handleChange}
              labelWidth="100px"
            />
            <InputTextOneLine
              label="F. Respiratoria (min):"
              name="frecuenciaRespiratoria"
              value={form.frecuenciaRespiratoria}
              onChange={handleChange}
              labelWidth="100px"
            />
            <InputTextOneLine
              label="F. Cardiaca (min):"
              name="frecuenciaCardiaca"
              value={form.frecuenciaCardiaca}
              onChange={handleChange}
              labelWidth="100px"
            />
            <InputTextOneLine
              label="Sat. O2 (%):"
              name="saturacionO2"
              value={form.saturacionO2}
              onChange={handleChange}
              labelWidth="100px"
            />
            <InputTextOneLine
              label="Sistólica (min):"
              name="presionSistolica"
              value={form.presionSistolica}
              onChange={handleChange}
              labelWidth="100px"
            />
            <InputTextOneLine
              label="Diastólica (min):"
              name="presionDiastolica"
              value={form.presionDiastolica}
              onChange={handleChange}
              labelWidth="100px"
            />
          </div>
        </div>

        {/* Audiometría */}
        <div className="bg-white border border-gray-200 rounded-lg p-3 h-90flex flex-col">
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
              <InputTextOneLine name="od500" value={form.od500} onChange={handleChange} />
              <InputTextOneLine name="od1000" value={form.od1000} onChange={handleChange} />
              <InputTextOneLine name="od2000" value={form.od2000} onChange={handleChange} />
              <InputTextOneLine name="od3000" value={form.od3000} onChange={handleChange} />
              <InputTextOneLine name="od4000" value={form.od4000} onChange={handleChange} />
              <InputTextOneLine name="od6000" value={form.od6000} onChange={handleChange} />
              <InputTextOneLine name="od8000" value={form.od8000} onChange={handleChange} />
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
              <InputTextOneLine name="oi500" value={form.oi500} onChange={handleChange} />
              <InputTextOneLine name="oi1000" value={form.oi1000} onChange={handleChange} />
              <InputTextOneLine name="oi2000" value={form.oi2000} onChange={handleChange} />
              <InputTextOneLine name="oi3000" value={form.oi3000} onChange={handleChange} />
              <InputTextOneLine name="oi4000" value={form.oi4000} onChange={handleChange} />
              <InputTextOneLine name="oi6000" value={form.oi6000} onChange={handleChange} />
              <InputTextOneLine name="oi8000" value={form.oi8000} onChange={handleChange} />
            </div>
          </div>
        </div>
      </div>

      {/* Segunda fila - 3 columnas de igual tamaño */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-4">
        {/* Cabeza, Cuello, Boca */}
        <div className="bg-white border border-gray-200 rounded-lg p-3 h-90flex flex-col">
          <h4 className="font-semibold text-gray-800 mb-2">
            Cabeza, Cuello, Boca
          </h4>
          <div className="space-y-2 flex-1">
            <InputTextOneLine
              label="Cabeza:"
              name="cabeza"
              value={form.cabeza}
              onChange={handleChange}
              labelWidth="90px"
            />
            <InputTextOneLine
              label="Nariz:"
              name="nariz"
              value={form.nariz}
              onChange={handleChange}
              labelWidth="90px"
            />
            <InputTextOneLine
              label="Cuello:"
              name="cuello"
              value={form.cuello}
              onChange={handleChange}
              labelWidth="90px"
            />
            <InputTextOneLine
              label="Perímetro (cm):"
              name="perimetro"
              value={form.perimetro}
              onChange={handleChange}
              labelWidth="90px"
            />
            <InputTextArea
              rows={3}
              label="Boca, Amígdalas, Faringe, Laringe"
              name="bocaAmigdalasFaringeLaringe"
              value={form.bocaAmigdalasFaringeLaringe}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Otoscopía */}
        <div className="bg-white border border-gray-200 rounded-lg p-3 h-90flex flex-col">
          <h4 className="font-semibold text-gray-800 mb-2">Otoscopía</h4>
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-2">
              <label className="font-semibold min-w-[30px]">O.D:</label>
              <InputTextOneLine
                name="otoscopiaOd"
                value={form.otoscopiaOd === true ? "NORMAL" : (form.otoscopiaOd || "NORMAL")}
                onChange={handleChange}
                placeholder="NORMAL"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="font-semibold min-w-[30px]">O.I:</label>
              <InputTextOneLine
                name="otoscopiaOi"
                value={form.otoscopiaOi === true ? "NORMAL" : (form.otoscopiaOi || "NORMAL")}
                onChange={handleChange}
                placeholder="NORMAL"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="font-semibold min-w-[30px]">Tórax:</label>
              <InputTextOneLine
                name="torax"
                value={form.torax}
                onChange={handleChange}
                placeholder="BPMV EN ACP, NO RALES."
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="font-semibold min-w-[30px]">Corazón:</label>
              <InputTextOneLine
                name="corazon"
                value={form.corazon}
                onChange={handleChange}
                placeholder="RCRR, NO SOPLOS."
              />
            </div>
          </div>
        </div>

        {/* Dentadura */}
        <div className="bg-white border border-gray-200 rounded-lg p-3 h-90flex flex-col">
          <h4 className="font-semibold text-gray-800 mb-2">Dentadura</h4>
          <div className="space-y-2 flex-1">
            <InputTextOneLine
              label="Piezas en mal estado:"
              name="piezasMalEstado"
              value={form.piezasMalEstado}
              onChange={handleChange}
              labelWidth="120px"
            />
            <InputTextOneLine
              label="Piezas que faltan:"
              name="piezasFaltan"
              value={form.piezasFaltan}
              onChange={handleChange}
              labelWidth="120px"
            />
            <InputTextOneLine
              label="Observaciones:"
              name="dentaduraObservaciones"
              value={form.dentaduraObservaciones}
              onChange={handleChange}
              labelWidth="120px"
            />
          </div>
        </div>
      </div>

      {/* Tercera fila - 2 columnas: Ojos y Card apilado */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Ojos */}
        <div className="bg-white border border-gray-200 rounded-lg p-3 ">
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
                onChange={handleChange}
              />
              <InputTextOneLine
                name="visionCercaOi"
                value={form.visionCercaOi}
                onChange={handleChange}
              />
              <InputTextOneLine
                name="visionCercaOdCorregida"
                value={form.visionCercaOdCorregida}
                onChange={handleChange}
              />
              <InputTextOneLine
                name="visionCercaOiCorregida"
                value={form.visionCercaOiCorregida}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-5 gap-2 mb-4">
              <label className="font-semibold">Visión de Lejos:</label>
              <InputTextOneLine
                name="visionLejosOd"
                value={form.visionLejosOd}
                onChange={handleChange}
              />
              <InputTextOneLine
                name="visionLejosOi"
                value={form.visionLejosOi}
                onChange={handleChange}
              />
              <InputTextOneLine
                name="visionLejosOdCorregida"
                value={form.visionLejosOdCorregida}
                onChange={handleChange}
              />
              <InputTextOneLine
                name="visionLejosOiCorregida"
                value={form.visionLejosOiCorregida}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <InputTextOneLine
              label="Visión de Colores:"
              name="visionColores"
              value={form.visionColores}
              onChange={handleChange}
              labelWidth="120px"
            />
            <InputTextOneLine
              label="Enferm. Oculares:"
              name="enfermedadOculares"
              value={form.enfermedadOculares}
              onChange={handleChange}
              labelWidth="120px"
            />
            <InputTextOneLine
              label="Enfermedad. otros:"
              name="enfermedadOtros"
              value={form.enfermedadOtros}
              onChange={handleChange}
              labelWidth="120px"
            />
            <InputTextOneLine
              label="Reflejos Pupilares:"
              name="reflejosPupilares"
              value={form.reflejosPupilares}
              onChange={handleChange}
              labelWidth="120px"
            />
            <InputTextOneLine
              label="Visión Binocular:"
              name="visionBinocular"
              value={form.visionBinocular}
              onChange={handleChange}
              labelWidth="120px"
            />
          </div>
        </div>

        {/* Card apilado: Pulmones + Miembros y Reflejos */}
        <div className="space-y-3">
          {/* Pulmones */}
          <div className="bg-white border border-gray-200 rounded-lg p-3 "style={{ height: "150px" }}>
            <h4 className="font-semibold text-gray-800 mb-2">Pulmones</h4>
            <div className="space-y-3">
              <InputsRadioGroup
                name="pulmones"
                value={form.pulmones}
                onChange={handleRadioButton}
                options={[
                  { label: "Normal", value: "normal" },
                  { label: "Anormal", value: "anormal" },
                ]}
              />
              <InputTextArea
                rows={2}
                name="pulmonesObservaciones"
                value={form.pulmonesObservaciones}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Miembros y Reflejos */}
          <div className="bg-white border border-gray-200 rounded-lg p-3 ">
            <h4 className="font-semibold text-gray-800 mb-2">Miembros y Reflejos</h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className=" font-semibold">Miembros Superiores:</label>
                <InputTextOneLine
                  name="miembrosSuperiores"
                  value={form.miembrosSuperiores}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className=" font-semibold">Miembros Inferiores:</label>
                <InputTextOneLine
                  name="miembrosInferiores"
                  value={form.miembrosInferiores}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="font-semibold">Reflejos Osteotendinosos:</label>
                <InputTextOneLine
                  name="reflejosOsteotendinosos"
                  value={form.reflejosOsteotendinosos}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className=" font-semibold">Marcha:</label>
                <InputTextOneLine
                  name="marcha"
                  value={form.marcha}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
