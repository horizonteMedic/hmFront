/* eslint-disable react/prop-types */
import { InputCheckbox, InputTextOneLine, InputsBooleanRadioGroup } from "../../../../../../components/reusableComponents/ResusableComponents";

// Componente Indicar Enfermedades
export default function IndicarEnfermedades({
  form,
  handleSiNoChange,
}) {
  return (
    <div className="space-y-4">
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
              <div key={name} className="flex justify-between items-center">
                <span>{label}</span>
                <div className="mr-5">
                  <InputCheckbox
                    label=""
                    name={name}
                    checked={!!form?.[name]}
                    onChange={(e) => handleSiNoChange(name, e, e.target.checked)}
                  />
                </div>
              </div>
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
              <div key={name} className="flex justify-between items-center">
                <span>{label}</span>
                <div className="mr-5">
                  <InputCheckbox
                    label=""
                    name={name}
                    checked={!!form?.[name]}
                    onChange={(e) => handleSiNoChange(name, e, e.target.checked)}
                  />
                </div>
              </div>
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
              <div key={name} className="flex justify-between items-center">
                <span>{label}</span>
                <div className="mr-5">
                  <InputCheckbox
                    label=""
                    name={name}
                    checked={!!form?.[name]}
                    onChange={(e) => handleSiNoChange(name, e, e.target.checked)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Barra separadora */}
        <div className="h-2 bg-blue-200 mb-6"></div>

        {/* Hábitos Nocivos */}
        <h4 className="font-semibold mb-4">Hábitos Nocivos</h4>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Fumar */}
          <div className="border border-gray-200 rounded-lg p-4 space-y-3">
            {/* Fila 1 */}
            <div className="flex items-center gap-6">
              <InputCheckbox
                label="CIGARRILLOS X MES"
                name="cigarrillosMes"
                checked={!!form?.cigarrillosMes}
                onChange={(e) => handleSiNoChange("cigarrillosMes", e, e.target.checked)}
              />
            </div>

            {/* Fila 2 */}
            <div className="flex items-center gap-4 flex-wrap">
              <span className="font-semibold">Fumar</span>
              <InputsBooleanRadioGroup
                name="fumar"
                value={form?.fumar}
                onChange={(e, value) => handleSiNoChange("fumar", e, value)}
                trueLabel="SI"
                falseLabel="NO"
              />
              <span className="font-medium">Número de cigarrillos:</span>
              <InputTextOneLine
                name="numeroCigarrillos"
                value={form?.numeroCigarrillos || ""}
                onChange={() => {}}
              />
            </div>
          </div>


         {/* Licor */}
          <div className="border border-gray-200 rounded-lg p-4 space-y-3">
            {/* Fila 1: Tipos de licor */}
            <div className="flex items-center gap-6">
              <InputCheckbox
                label="RON"
                name="ron"
                checked={!!form?.ron}
                onChange={(e) => handleSiNoChange("ron", e, e.target.checked)}
              />
              <InputCheckbox
                label="CERVEZA"
                name="cerveza"
                checked={!!form?.cerveza}
                onChange={(e) => handleSiNoChange("cerveza", e, e.target.checked)}
              />
              <InputCheckbox
                label="VINO"
                name="vino"
                checked={!!form?.vino}
                onChange={(e) => handleSiNoChange("vino", e, e.target.checked)}
              />
              <InputCheckbox
                label="WISKY"
                name="wisky"
                checked={!!form?.wisky}
                onChange={(e) => handleSiNoChange("wisky", e, e.target.checked)}
              />
            </div>

            {/* Fila 2: Licor SI/NO y Tipo más frecuente */}
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-semibold">Licor:</span>
              <InputsBooleanRadioGroup
                name="licor"
                value={form?.licor}
                onChange={(e, value) => handleSiNoChange("licor", e, value)}
                trueLabel="SI"
                falseLabel="NO"
              />
              <span className="font-medium col-span-1 text-right">
                Tipo más frecuente:
              </span>
              <InputTextOneLine
                name="tipoLicor"
                value={form?.tipoLicor || ""}
                onChange={() => {}}
              />
            </div>

            {/* Fila 3: 1 VEZ X MES y Frecuencia */}
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-medium">1 VEZ X MES:</span>
              <InputCheckbox
                name="unaVezMes"
                checked={!!form?.unaVezMes}
                onChange={(e) => handleSiNoChange("unaVezMes", e, e.target.checked)}
              />
              <span className="font-medium col-span-1 text-right">Frecuencia:</span>
              <InputTextOneLine
                name="frecuenciaLicor"
                value={form?.frecuenciaLicor || ""}
                onChange={() => {}}
              />
            </div>
          </div>



          {/* Drogas */}
          <div className="border border-gray-200 rounded-lg p-4 space-y-3">
            {/* Fila 1: Tipos de drogas */}
            <div className="flex items-center gap-6">
              <InputCheckbox
                label="CHACCHA HOJA DE COCA"
                name="chacchaHojaCoca"
                checked={!!form?.chacchaHojaCoca}
                onChange={(e) => handleSiNoChange("chacchaHojaCoca", e, e.target.checked)}
              />
            </div>

            {/* Fila 2: Drogas SI/NO y Tipo más frecuente */}
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-semibold">Drogas:</span>
              <InputsBooleanRadioGroup
                name="drogas"
                value={form?.drogas}
                onChange={(e, value) => handleSiNoChange("drogas", e, value)}
                trueLabel="SI"
                falseLabel="NO"
              />
              <span className="font-medium col-span-1 text-right">
                Tipo más frecuente:
              </span>
              <InputTextOneLine
                name="tipoDrogas"
                value={form?.tipoDrogas || ""}
                onChange={() => {}}
              />
            </div>

            {/* Fila 3: 15 DÍAS X MES y Frecuencia */}
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-medium">15 DÍAS X MES:</span>
              <InputCheckbox
                name="quinceDiasMes"
                checked={!!form?.quinceDiasMes}
                onChange={(e) => handleSiNoChange("quinceDiasMes", e, e.target.checked)}
              />
              <span className="font-medium col-span-1 text-right">Frecuencia:</span>
              <InputTextOneLine
                name="frecuenciaDrogas"
                value={form?.frecuenciaDrogas || ""}
                onChange={() => {}}
              />
            </div>
          </div>

         {/* Otros */}
        <div className="border border-gray-200 rounded-lg p-4 space-y-3">
          {/* Fila 1: Otros SI/NO y Tipo más frecuente */}
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-semibold">Otros:</span>
            <InputsBooleanRadioGroup
              name="otros"
              value={form?.otros}
              onChange={(e, value) => handleSiNoChange("otros", e, value)}
              trueLabel="SI"
              falseLabel="NO"
            />
            <span className="font-medium col-span-1 text-right">
              Tipo más frecuente:
            </span>
            <InputTextOneLine
              name="tipoOtros"
              value={form?.tipoOtros || ""}
              onChange={() => {}}
            />
          </div>

           {/* Fila 2: Frecuencia */}
           <div className="grid grid-cols-4 items-center gap-4">
             <span className="col-span-2"></span>
             <span className="font-medium col-span-1 text-right">Frecuencia:</span>
             <InputTextOneLine
               name="frecuenciaOtros"
               value={form?.frecuenciaOtros || ""}
               onChange={() => {}}
             />
           </div>
        </div>
        </div>
      </div>
    </div>
  );
}
