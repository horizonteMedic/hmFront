import {
  InputTextOneLine,
  InputTextArea,
} from "../../../../../components/reusableComponents/ResusableComponents";

export default function Examenes({
  form,
  setForm,
  handleChange,
  handleChangeNumber,
  handleRadioButton,
  handleCheckBoxChange,
  handleClear,
  handleClearnotO,
  handleRadioButtonBoolean,
}) {
  return (
    <div className="p-4" style={{ fontSize: "10px" }}>
      <h3 className="font-semibold mb-4 text-gray-800">
        Exámenes Complementarios
      </h3>

      {/* Cuatro columnas arriba */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Función Respiratoria */}
        <div className="lg:col-span-3 bg-white border border-gray-200 rounded-lg p-3">
          <h4 className="font-semibold text-gray-800 mb-2">
            Función Respiratoria Abs
          </h4>

          <div className="grid gap-2 mb-2">
            <InputTextOneLine
              label="FVC (% I.)"
              name="fvc"
              value={form.fvc}
              disabled
              labelWidth="80px"
            />
            <InputTextOneLine
              label="FEV1 (% I.)"
              name="fev1"
              value={form.fev1}
              disabled
              labelWidth="80px"
            />
            <InputTextOneLine
              label="FEV1/FVC (%)"
              name="fev1Fvc"
              value={form.fev1Fvc}
              disabled
              labelWidth="80px"
            />
            <InputTextOneLine
              label="FEF 25-75% (l/s.)"
              name="fef2575"
              value={form.fef2575}
              disabled
              labelWidth="80px"
            />
          </div>
          <InputTextArea
            rows={3}
            label="Conclusión"
            name="conclusionRespiratoria"
            value={form.conclusionRespiratoria}
            onChange={handleChange}
          />
        </div>

        <div className="lg:col-span-4">
          {/* Información Triaje */}
          <div className=" bg-white border border-gray-200 rounded-lg p-3">
            <h4 className="font-semibold text-gray-800 mb-2">
              Información Triaje
            </h4>
            <div className="space-y-2 grid grid-cols-2 gap-x-4">
              <InputTextOneLine
                label="Temperatura(°C)"
                name="temperatura"
                value={form.temperatura}
                disabled
                labelWidth="108px"
              />
              <InputTextOneLine
                label="Cintura(cm)"
                name="cintura"
                value={form.cintura}
                disabled
                labelWidth="108px"
              />
              <InputTextOneLine
                label="Cadera(cm)"
                name="cadera"
                value={form.cadera}
                disabled
                labelWidth="108px"
              />
              <InputTextOneLine
                label="ICC"
                name="icc"
                value={form.icc}
                disabled
                labelWidth="108px"
              />
              <InputTextOneLine
                label="Talla(m)"
                name="talla"
                value={form.talla}
                disabled
                labelWidth="108px"
              />
              <InputTextOneLine
                label="Peso(Kg)"
                name="peso"
                value={form.peso}
                disabled
                labelWidth="108px"
              />
              <InputTextOneLine
                label="IMC"
                name="imc"
                value={form.imc}
                disabled
                labelWidth="108px"
              />
              <InputTextOneLine
                label="F. Respiratoria(min)"
                name="frecuenciaRespiratoria"
                value={form.frecuenciaRespiratoria}
                disabled
                labelWidth="108px"
              />
              <InputTextOneLine
                label="F. Cardiaca(min)"
                name="frecuenciaCardiaca"
                value={form.frecuenciaCardiaca}
                disabled
                labelWidth="108px"
              />
              <InputTextOneLine
                label="Sat. O2(%)"
                name="saturacionO2"
                value={form.saturacionO2}
                disabled
                labelWidth="108px"
              />
              <InputTextOneLine
                label="Perímetro(cm)"
                name="perimetro"
                value={form.perimetro}
                disabled
                labelWidth="108px"
              />
              <InputTextOneLine
                label="Sistólica(min)"
                name="presionSistolica"
                value={form.presionSistolica}
                disabled
                labelWidth="108px"
              />
              <InputTextOneLine
                label="Diastólica(min)"
                name="presionDiastolica"
                value={form.presionDiastolica}
                disabled
                labelWidth="108px"
              />
            </div>
          </div>
        </div>

        {/* Audiometría */}
        <div className="lg:col-span-5 bg-white border border-gray-200 rounded-lg p-3">
          <h4 className="font-semibold text-gray-800 mb-2">Audiometría</h4>

          <div className="mb-3">
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

          <div className="mt-4">
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
        </div>
      </div>

      {/* Segunda fila - 4 columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 mt-4">
        {/* Ojos */}
        <div className="lg:col-span-6 bg-white border border-gray-200 rounded-lg p-3">
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
              labelWidth="104px"
            />
            <InputTextOneLine
              label="Enferm. Oculares"
              name="enfermedadOculares"
              value={form.enfermedadOculares}
              disabled
              labelWidth="104px"
            />
            <InputTextOneLine
              label="Enfermedad. otros"
              name="enfermedadOtros"
              value={form.enfermedadOtros}
              disabled
              labelWidth="104px"
            />
            <InputTextOneLine
              label="Reflejos Pupilares"
              name="reflejosPupilares"
              value={form.reflejosPupilares}
              disabled
              labelWidth="104px"
            />
            <InputTextOneLine
              label="Visión Binocular"
              name="visionBinocular"
              value={form.visionBinocular}
              disabled
              labelWidth="104px"
            />
          </div>
        </div>

        <div className="lg:col-span-6 flex flex-col">
          {/* Observaciones Generales - 2 columnas apiladas */}
          <div className=" flex flex-col h-full">
            {/* Observaciones Generales */}
            <div className="bg-white border border-gray-200 rounded-lg p-3 flex-1 mb-3">
              <h4 className="font-semibold text-gray-800 mb-2">
                Observaciones Generales
              </h4>

              <div className="space-y-2">
                <InputTextOneLine
                  label="Ectoscopía"
                  name="ectoscopia"
                  value={form.ectoscopia}
                  disabled
                  labelWidth="90px"
                />
                <InputTextOneLine
                  label="Estado Mental"
                  name="estadoMental"
                  value={form.estadoMental}
                  onChange={handleChange}
                  labelWidth="90px"
                />
                <InputTextArea
                  rows={3}
                  label="Anamnesis"
                  name="anamnesis"
                  value={form.anamnesis}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          {/* Dentadura*/}
          <div className=" flex flex-col h-full">
            {/* Dentadura */}
            <div className="bg-white border border-gray-200 rounded-lg p-3 flex-1 mb-3">
              <h4 className="font-semibold text-gray-800 mb-2">Dentadura</h4>
              <div className="grid grid-cols-2 gap-4">
                <InputTextOneLine
                  label="Piezas en mal estado"
                  name="piezasMalEstado"
                  value={form.piezasMalEstado}
                  disabled
                  labelWidth="120px"
                />

                <InputTextOneLine
                  label="Piezas que faltan"
                  name="piezasFaltan"
                  value={form.piezasFaltan}
                  disabled
                  labelWidth="120px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
