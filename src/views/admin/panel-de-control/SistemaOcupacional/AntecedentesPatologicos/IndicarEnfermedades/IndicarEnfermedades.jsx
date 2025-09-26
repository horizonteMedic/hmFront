/* eslint-disable react/prop-types */
import { InputCheckbox, InputTextOneLine, InputsBooleanRadioGroup } from "../../../../../components/reusableComponents/ResusableComponents";

// Componente Indicar Enfermedades
export default function IndicarEnfermedades({
  form,
  setForm,
  handleChange,
  handleChangeNumber,
  handleCheckBoxChange,
  handleChangeSimple,
  handleRadioButton,
  handleRadioButtonBoolean
}) {
  return (
    <div className="space-y-4">
      {/* Sección normal - solo se muestra cuando BOROO NO está activado */}
      {!form?.boroo && (
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <h4 className="font-semibold mb-3">Indicar las enfermedades que ha tenido o tiene, con cierta frecuencia</h4>

          {/* Lista de síntomas en 3 columnas */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Columna 1 */}
            <div className="space-y-1">
              {[
                ["perdidaMemoria", "Pérdida de memoria"],
                ["preocupacionesAngustia", "Preocupaciones o angustia"],
                ["doloresArticulares", "Dolores articulares y/o huesos"],
                ["aumentoDisminucionPeso", "Aumento o disminución de peso"],
                ["dolorCabeza", "Dolor de cabeza"],
                ["diarrea", "Diarrea"],
                ["agitacionEjercicios", "Agitación al hacer ejercicios"],
                ["dolorOcular", "Dolor ocular"],
                ["dolorOpresivoTorax", "Dolor Opresivo Tórax"],
                ["hinchazonPiesManos", "Hinchazón de pies o manos"],
              ].map(([name, label]) => (
                <InputCheckbox
                  key={name}
                  label={label}
                  name={name}
                  checked={form?.[name]}
                  onChange={handleCheckBoxChange}
                />
              ))}
            </div>

            {/* Columna 2 */}
            <div className="space-y-1">
              {[
                ["estrenimiento", "Estreñimiento"],
                ["vomitosSangre", "Vómitos con sangre"],
                ["sangradoOrina", "Sangrado por orina"],
                ["tosSangre", "Tos con sangre"],
                ["coloracionAmarilla", "Coloración amarilla de la piel"],
                ["indigestionFrecuente", "Indigestión frecuente"],
                ["insomnio", "Insomnio"],
                ["lumbalgias", "Lumbalgias o dolor de cintura"],
                ["mareosDesmayos", "Mareos-Desmayos-Vértigos"],
                ["hecesNegras", "Heces negras"],
              ].map(([name, label]) => (
                <InputCheckbox
                  key={name}
                  label={label}
                  name={name}
                  checked={form?.[name]}
                  onChange={handleCheckBoxChange}
                />
              ))}
            </div>

            {/* Columna 3 */}
            <div className="space-y-1">
              {[
                ["orinaDolorArdor", "Orina con dolor o ardor"],
                ["orinaInvoluntaria", "Orina involuntaria"],
                ["dolorOido", "Dolor de oído"],
                ["secrecionesOido", "Secreciones por el oído"],
                ["palpitaciones", "Palpitaciones"],
                ["adormecimientos", "Adormecimientos"],
                ["pesadillasFrecuentes", "Pesadillas frecuentes"],
                ["doloresMusculares", "Dolores musculares"],
                ["tosCronica", "Tos crónica"],
                ["sangradoEncias", "Sangrado por encías"],
              ].map(([name, label]) => (
                <InputCheckbox
                  key={name}
                  label={label}
                  name={name}
                  checked={form?.[name]}
                  onChange={handleCheckBoxChange}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Secciones adicionales cuando BOROO está activado */}
      {form?.boroo && (
        <>
          {/* Antecedentes Inmunológicos / Vacunas */}
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <h4 className="font-semibold mb-4">ANTECEDENTES INMUNOLÓGICOS / VACUNAS:</h4>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Columna 1 - Vacunas */}
              <div className="space-y-1">
                {[
                  ["antitetanica", "Antitetánica"],
                  ["fiebreAmarilla", "Fiebre Amarilla"],
                  ["influenza", "Influenza"],
                  ["hepatitisA", "Hepatitis A"],
                  ["hepatitisB", "Hepatitis B"],
                ].map(([name, label]) => (
                  <InputCheckbox
                    key={name}
                    label={label}
                    name={name}
                    checked={form?.[name]}
                    onChange={handleCheckBoxChange}
                  />
                ))}
              </div>

              {/* Columna 2 - Vacunas */}
              <div className="space-y-1">
                {[
                  ["gripeInfluenza", "Gripe/Influenza"],
                  ["neumococo", "Neumococo"],
                  ["rabia", "Rabia"],
                  ["papilomaHumano", "Papiloma Humano"],
                ].map(([name, label]) => (
                  <InputCheckbox
                    key={name}
                    label={label}
                    name={name}
                    checked={form?.[name]}
                    onChange={handleCheckBoxChange}
                  />
                ))}

                {/* COVID 19 con campos especiales */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 mr-5">
                    <InputCheckbox
                      label="COVID 19"
                      name="covid19"
                      checked={form?.covid19}
                      onChange={handleCheckBoxChange}
                    />
                    {form?.covid19 && (
                      <InputTextOneLine
                        label="N° Dosis"
                        name="covidNumero"
                        value={form?.covidNumero}
                        onChange={handleChangeNumber}
                        labelWidth="50px"
                        className="ml-8"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Hábitos Nocivos */}
      <div className="bg-white border border-gray-200 rounded-lg p-3">
        <h4 className="font-semibold mb-4">Hábitos Nocivos</h4>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Drogas */}
          <div className="border border-gray-200 rounded-lg p-4 space-y-3">
            {/* Fila 1: Drogas SI/NO */}
            <div className="grid grid-cols-2 gap-4">
              <span className="font-semibold">Drogas</span>
              <InputsBooleanRadioGroup
                name="drogas"
                value={form?.drogas}
                onChange={(e, value) => {
                  if (value == false) {
                    setForm(prev => ({ ...prev, tipoDrogas: "", frecuenciaDrogas: "" }));
                  }
                  handleRadioButtonBoolean(e, value)
                }}
              />
              <div className="w-full col-span-2">
                <InputTextOneLine
                  label="Tipo más frecuente"
                  name="tipoDrogas"
                  value={form?.tipoDrogas}
                  onChange={handleChange}
                  disabled={!form?.drogas}
                />
                {/* Botón de tipo de droga */}
                <div className="w-full flex justify-end mt-2">
                  <button className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-all disabled:bg-gray-500`}
                    disabled={!form?.drogas}
                    onClick={() => {
                      setForm(prev => ({
                        ...prev,
                        tipoDrogas: prev.tipoDrogas + " CHACCHA HOJA DE COCA"
                      }))
                    }}>
                    CHACCHA HOJA DE COCA
                  </button>
                </div>
              </div>
            </div>

            {/* Fila 2: Frecuencia */}
            <div className="w-full">
              <InputTextOneLine
                label="Frecuencia"
                name="frecuenciaDrogas"
                value={form?.frecuenciaDrogas}
                onChange={handleChange}
                disabled={!form?.drogas}
              />
              <div className="w-full flex justify-end mt-2">
                <button className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-all disabled:bg-gray-500`}
                  disabled={!form?.drogas}
                  onClick={() => {
                    setForm(prev => ({
                      ...prev,
                      frecuenciaDrogas: prev.frecuenciaDrogas + " 15 DÍAS X MES"
                    }))
                  }}>
                  15 DÍAS X MES
                </button>
              </div>
            </div>
          </div>

          {/* Licor */}
          <div className="border border-gray-200 rounded-lg p-4 space-y-3">
            {/* Fila 1: Licor SI/NO */}
            <div className="grid grid-cols-2 gap-4">
              <span className="font-semibold">Licor</span>
              <InputsBooleanRadioGroup
                name="licor"
                value={form?.licor}
                onChange={(e, value) => {
                  if (value == false) {
                    setForm(prev => ({ ...prev, tipoLicor: "", frecuenciaLicor: "" }));
                  }
                  handleRadioButtonBoolean(e, value)
                }}
              />
              <div className="w-full col-span-2">
                <InputTextOneLine
                  label="Tipo más frecuente"
                  name="tipoLicor"
                  value={form?.tipoLicor}
                  onChange={handleChange}
                  disabled={!form?.licor}
                />
                {/* Botones de tipos de licor */}
                <div className="w-full flex justify-end mt-2 gap-2">
                  <button className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-all disabled:bg-gray-500`}
                    disabled={!form?.licor}
                    onClick={() => {
                      setForm(prev => ({
                        ...prev,
                        tipoLicor: prev.tipoLicor + " RON"
                      }))
                    }}>
                    RON
                  </button>
                  <button className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-all disabled:bg-gray-500`}
                    disabled={!form?.licor}
                    onClick={() => {
                      setForm(prev => ({
                        ...prev,
                        tipoLicor: prev.tipoLicor + " CERVEZA"
                      }))
                    }}>
                    CERVEZA
                  </button>
                  <button className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-all disabled:bg-gray-500`}
                    disabled={!form?.licor}
                    onClick={() => {
                      setForm(prev => ({
                        ...prev,
                        tipoLicor: prev.tipoLicor + " VINO"
                      }))
                    }}>
                    VINO
                  </button>
                  <button className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-all disabled:bg-gray-500`}
                    disabled={!form?.licor}
                    onClick={() => {
                      setForm(prev => ({
                        ...prev,
                        tipoLicor: prev.tipoLicor + " WISKY"
                      }))
                    }}>
                    WISKY
                  </button>
                </div>
              </div>
            </div>

            {/* Fila 2: Frecuencia */}
            <div className="w-full">
              <InputTextOneLine
                label="Frecuencia"
                name="frecuenciaLicor"
                value={form?.frecuenciaLicor}
                onChange={handleChange}
                disabled={!form?.licor}
              />
              <div className="w-full flex justify-end mt-2">
                <button className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-all disabled:bg-gray-500`}
                  disabled={!form?.licor}
                  onClick={() => {
                    setForm(prev => ({
                      ...prev,
                      frecuenciaLicor: prev.frecuenciaLicor + " 1 VEZ X MES"
                    }))
                  }}>
                  1 VEZ X MES
                </button>
              </div>
            </div>
          </div>



          {/* Fumar */}
          <div className="border border-gray-200 rounded-lg p-4 space-y-3">
            {/* Fila 2 */}
            <div className="grid grid-cols-2 gap-4">
              <span className="font-semibold">Fumar</span>
              <InputsBooleanRadioGroup
                name="fumar"
                value={form?.fumar}
                onChange={(e, value) => {
                  if (value == false) {
                    setForm(prev => ({ ...prev, numeroCigarrillos: "" }));
                  }
                  handleRadioButtonBoolean(e, value)
                }}
              />
              <div className="w-full col-span-2">
                <InputTextOneLine
                  label="Número de cigarrillos"
                  name="numeroCigarrillos"
                  value={form?.numeroCigarrillos}
                  onChange={handleChange}
                  disabled={!form?.fumar}
                />
                {/* Fila 1 */}
                <div className="w-full flex justify-end mt-2">
                  <button className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-all disabled:bg-gray-500`}
                    disabled={!form?.fumar}
                    onClick={() => {
                      setForm(prev => ({
                        ...prev,
                        numeroCigarrillos: prev.numeroCigarrillos + " CIGARRILLOS X MES"
                      }))
                    }}>
                    CIGARRILLOS X MES
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Otros */}
          <div className="border border-gray-200 rounded-lg p-4 space-y-3">
            {/* Fila 1: Otros SI/NO */}
            <div className="grid grid-cols-2 gap-4">
              <span className="font-semibold">Otros</span>
              <InputsBooleanRadioGroup
                name="otros"
                value={form?.otros}
                onChange={(e, value) => {
                  if (value == false) {
                    setForm(prev => ({ ...prev, tipoOtros: "", frecuenciaOtros: "" }));
                  }
                  handleRadioButtonBoolean(e, value)
                }}
              />
              <div className="w-full col-span-2">
                <InputTextOneLine
                  label="Tipo más frecuente"
                  name="tipoOtros"
                  value={form?.tipoOtros}
                  onChange={handleChange}
                  disabled={!form?.otros}
                />
              </div>
            </div>

            {/* Fila 2: Frecuencia */}
            <div className="w-full">
              <InputTextOneLine
                label="Frecuencia"
                name="frecuenciaOtros"
                value={form?.frecuenciaOtros}
                onChange={handleChange}
                disabled={!form?.otros}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Secciones adicionales cuando BOROO está activado - Solo Medicamentos y Actividad Física */}
      {form?.boroo && (
        <>
          {/* Medicamentos y Actividad Física */}
          <div className="mt-6 bg-white border border-gray-200 rounded-lg p-3">
            <div className="space-y-6">
              {/* Medicamentos */}
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <span className="font-semibold">Medicamentos:</span>
                  <InputsBooleanRadioGroup
                    name="medicamentos"
                    value={form?.medicamentos}
                    onChange={handleRadioButtonBoolean}
                  />
                </div>
                <InputTextOneLine
                  label="Especifique"
                  name="especifiqueMedicamentos"
                  value={form?.especifiqueMedicamentos}
                  onChange={handleChange}
                />
              </div>

              {/* Actividad Física */}
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <span className="font-semibold">Actividad Física:</span>
                  <InputsBooleanRadioGroup
                    name="actividadFisica"
                    value={form?.actividadFisica}
                    onChange={handleRadioButtonBoolean}
                  />
                </div>
                <InputTextOneLine
                  label="Especifique"
                  name="especifiqueActividadFisica"
                  value={form?.especifiqueActividadFisica}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
