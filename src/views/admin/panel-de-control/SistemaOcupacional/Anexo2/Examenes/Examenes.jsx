import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBroom, faSave, faPrint } from "@fortawesome/free-solid-svg-icons";
import InputTextOneLine from "../../../../../components/reusableComponents/InputTextOneLine";
import InputsRadioGroup from "../../../../../components/reusableComponents/InputsRadioGroup";

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
              value={form.fvc || ""}
              onChange={handleChange}
              disabled
              labelWidth="90px"
            />
            <InputTextOneLine
              label="FEV1 (% I.)"
              name="fev1"
              value={form.fev1 || ""}
              onChange={handleChange}
              disabled
              labelWidth="90px"
            />
            <InputTextOneLine
              label="FEV1/FVC (%)"
              name="fev1Fvc"
              value={form.fev1Fvc || ""}
              onChange={handleChange}
              disabled
              labelWidth="90px"
            />
            <InputTextOneLine
              label="FEF 25-75% (l/s.)"
              name="fef2575"
              value={form.fef2575 || ""}
              onChange={handleChange}
              disabled
              labelWidth="90px"
            />
          </div>
          <InputsRadioGroup
            name="tipoFuncionRespiratoria"
            value={form.tipoFuncionRespiratoria}
            onChange={handleRadioButton}
            disabled
            className="mb-2"
            options={[
              { label: "NORMAL", value: "O" },
              { label: "P. OBSTRUCTIVO", value: "OBSTRUCTIVO" },
            ]}
          />

          <div>
            <label className="block font-semibold  mb-1">
              Conclusión:
            </label>
            <textarea
              rows="2"
              name="conclusionRespiratoria"
              value={form.conclusionRespiratoria}
              onChange={handleChange}
              disabled
              className="border rounded px-2 py-1 w-full resize-none bg-gray-100"
            />
          </div>
        </div>

        <div className="lg:col-span-4">
          {/* Información Triaje */}
          <div className=" bg-white border border-gray-200 rounded-lg p-3">
            <h4 className="font-semibold text-gray-800 mb-2">
              Información Triaje
            </h4>
            <div className="space-y-2 grid grid-cols-2">
              <div className="flex items-center space-x-3">
                <label className="w-14 font-medium text-gray-700">Temp.:</label>
                <input
                  type="text"
                  defaultValue="35"
                  className="w-10 px-1 py-0.5 border border-gray-300 rounded text-center"
                />
                <span>°C</span>
              </div>
              <div className="flex items-center space-x-3">
                <label className="w-14 font-medium text-gray-700">
                  Cintura:
                </label>
                <input
                  type="text"
                  defaultValue="75"
                  className="w-10 px-1 py-0.5 border border-gray-300 rounded text-center"
                />
              </div>
              <div className="flex items-center space-x-3">
                <label className="w-14 font-medium text-gray-700">
                  Cadera:
                </label>
                <input
                  type="text"
                  defaultValue="80"
                  className="w-10 px-1 py-0.5 border border-gray-300 rounded text-center"
                />
              </div>
              <div className="flex items-center space-x-3">
                <label className="w-14 font-medium text-gray-700">ICC:</label>
                <input
                  type="text"
                  defaultValue="0.94"
                  className="w-10 px-1 py-0.5 border border-gray-300 rounded text-center"
                />
              </div>
              <div className="flex items-center space-x-2">
                <label className="w-12 font-medium text-gray-700">Talla:</label>
                <input
                  type="text"
                  defaultValue="170"
                  className="w-12 px-1 py-0.5 border border-gray-300 rounded text-center"
                />
                <span>m.</span>
              </div>
              <div className="flex items-center space-x-2">
                <label className="w-12 font-medium text-gray-700">Peso:</label>
                <input
                  type="text"
                  defaultValue="65"
                  className="w-12 px-1 py-0.5 border border-gray-300 rounded text-center"
                />
                <span>Kg.</span>
              </div>
              <div className="flex items-center space-x-2">
                <label className="w-12 font-medium text-gray-700">IMC:</label>
                <input
                  type="text"
                  defaultValue="0.00"
                  className="w-12 px-1 py-0.5 border border-gray-300 rounded text-center"
                />
              </div>
              <div className="flex items-center space-x-2">
                <label className="w-14 font-medium text-gray-700">
                  Sistólica:
                </label>
                <input
                  type="text"
                  defaultValue="50"
                  className="w-10 px-1 py-0.5 border border-gray-300 rounded text-center"
                />
                <span>min.</span>
              </div>
              <div className="flex items-center space-x-2">
                <label className="w-14 font-medium text-gray-700">
                  Diastólica:
                </label>
                <input
                  type="text"
                  defaultValue="60"
                  className="w-10 px-1 py-0.5 border border-gray-300 rounded text-center"
                />
                <span>min.</span>
              </div>
              <div className="flex items-center space-x-3">
                <label className="w-20 font-medium text-gray-700 whitespace-nowrap">
                  F. Respiratoria:
                </label>
                <input
                  type="text"
                  defaultValue="60"
                  className="w-10 px-1 py-0.5 border border-gray-300 rounded text-center"
                />
                <span>min.</span>
              </div>
              <div className="flex items-center space-x-3">
                <label className="w-20 font-medium text-gray-700 whitespace-nowrap">
                  F. Cardiaca:
                </label>
                <input
                  type="text"
                  defaultValue="60"
                  className="w-10 px-1 py-0.5 border border-gray-300 rounded text-center"
                />
                <span>min.</span>
              </div>
              <div className="flex items-center space-x-3">
                <label className="w-20 font-medium text-gray-700 whitespace-nowrap">
                  Sat. O2:
                </label>
                <input
                  type="text"
                  defaultValue="30"
                  className="w-10 px-1 py-0.5 border border-gray-300 rounded text-center"
                />
                <span>%</span>
              </div>
              <div className="flex items-center space-x-3">
                <label className="w-20 font-medium text-gray-700 whitespace-nowrap">
                  Perímetro:
                </label>
                <input
                  type="text"
                  defaultValue="44"
                  className="w-10 px-1 py-0.5 border border-gray-300 rounded text-center"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Audiometría */}
        <div className="lg:col-span-5 bg-white border border-gray-200 rounded-lg p-3">
          <h4 className="font-semibold text-gray-800 mb-2">Audiometría</h4>

          <div className="mb-3">
            <h5 className="font-medium text-gray-700 mb-1">Oído Derecho</h5>
            <div className="grid grid-cols-7 gap-1 mb-2">
              <div className="text-center font-medium">500</div>
              <div className="text-center font-medium">1000</div>
              <div className="text-center font-medium">2000</div>
              <div className="text-center font-medium">3000</div>
              <div className="text-center font-medium">4000</div>
              <div className="text-center font-medium">6000</div>
              <div className="text-center font-medium">8000</div>
            </div>
            <div className="grid grid-cols-7 gap-1">
              <input
                type="text"
                defaultValue="-"
                className="px-1 py-1 border border-gray-300 rounded text-center bg-yellow-100"
              />
              <input
                type="text"
                defaultValue="-"
                className="px-1 py-1 border border-gray-300 rounded text-center bg-yellow-100"
              />
              <input
                type="text"
                defaultValue="-"
                className="px-1 py-1 border border-gray-300 rounded text-center bg-yellow-100"
              />
              <input
                type="text"
                defaultValue="-"
                className="px-1 py-1 border border-gray-300 rounded text-center bg-yellow-100"
              />
              <input
                type="text"
                defaultValue="-"
                className="px-1 py-1 border border-gray-300 rounded text-center bg-yellow-100"
              />
              <input
                type="text"
                defaultValue="-"
                className="px-1 py-1 border border-gray-300 rounded text-center bg-yellow-100"
              />
              <input
                type="text"
                defaultValue="-"
                className="px-1 py-1 border border-gray-300 rounded text-center bg-yellow-100"
              />
            </div>
            <div className="text-center mt-1">
              <span className="text-xs">db (A)</span>
            </div>
          </div>

          <div>
            <h5 className="font-medium text-gray-700 mb-1">Oído Izquierdo</h5>
            <div className="grid grid-cols-7 gap-1 mb-2">
              <div className="text-center font-medium">500</div>
              <div className="text-center font-medium">1000</div>
              <div className="text-center font-medium">2000</div>
              <div className="text-center font-medium">3000</div>
              <div className="text-center font-medium">4000</div>
              <div className="text-center font-medium">6000</div>
              <div className="text-center font-medium">8000</div>
            </div>
            <div className="grid grid-cols-7 gap-1">
              <input
                type="text"
                defaultValue="-"
                className="px-1 py-1 border border-gray-300 rounded text-center bg-yellow-100"
              />
              <input
                type="text"
                defaultValue="-"
                className="px-1 py-1 border border-gray-300 rounded text-center bg-yellow-100"
              />
              <input
                type="text"
                defaultValue="-"
                className="px-1 py-1 border border-gray-300 rounded text-center bg-yellow-100"
              />
              <input
                type="text"
                defaultValue="-"
                className="px-1 py-1 border border-gray-300 rounded text-center bg-yellow-100"
              />
              <input
                type="text"
                defaultValue="-"
                className="px-1 py-1 border border-gray-300 rounded text-center bg-yellow-100"
              />
              <input
                type="text"
                defaultValue="-"
                className="px-1 py-1 border border-gray-300 rounded text-center bg-yellow-100"
              />
              <input
                type="text"
                defaultValue="-"
                className="px-1 py-1 border border-gray-300 rounded text-center bg-yellow-100"
              />
            </div>
            <div className="text-center mt-1">
              <span className="text-xs">db (A)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Segunda fila - 4 columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 mt-4">
        {/* Ojos */}
        <div className="lg:col-span-6 bg-white border border-gray-200 rounded-lg p-3">
          <h4 className="font-semibold text-gray-800 mb-2">Ojos</h4>

          <div className="mb-2">
            <div className="grid grid-cols-5 gap-1 mb-1">
              <div></div>
              <div className="text-center font-medium">Sin Corregir</div>
              <div className="text-center font-medium">Corregida</div>
              <div></div>
              <div></div>
              <div className="text-center">O.D</div>
              <div className="text-center">O.I</div>
              <div className="text-center">O.D</div>
              <div className="text-center">O.I</div>
              <div></div>
            </div>

            <div className="grid grid-cols-5 gap-1 mb-1">
              <label className="font-medium">Visión de Cerca:</label>
              <input
                type="text"
                defaultValue="20/20"
                className="px-1 py-0.5 border border-gray-300 rounded text-center"
              />
              <input
                type="text"
                defaultValue="20/20"
                className="px-1 py-0.5 border border-gray-300 rounded text-center"
              />
              <input
                type="text"
                defaultValue="00"
                className="px-1 py-0.5 border border-gray-300 rounded text-center"
              />
              <input
                type="text"
                defaultValue="00"
                className="px-1 py-0.5 border border-gray-300 rounded text-center"
              />
            </div>

            <div className="grid grid-cols-5 gap-1 mb-1">
              <label className="font-medium">Visión de Lejos:</label>
              <input
                type="text"
                defaultValue="20/25"
                className="px-1 py-0.5 border border-gray-300 rounded text-center"
              />
              <input
                type="text"
                defaultValue="20/30"
                className="px-1 py-0.5 border border-gray-300 rounded text-center"
              />
              <input
                type="text"
                defaultValue="00"
                className="px-1 py-0.5 border border-gray-300 rounded text-center"
              />
              <input
                type="text"
                defaultValue="00"
                className="px-1 py-0.5 border border-gray-300 rounded text-center"
              />
            </div>

            <div className="flex items-center space-x-3">
              <label className="font-medium">Visión de Colores:</label>
              <input
                type="text"
                defaultValue="10/14"
                className="w-20 px-2 py-1 border border-gray-300 rounded text-center bg-blue-50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Enferm. Oculares:
              </label>
              <input
                type="text"
                defaultValue="AMETROPIA LEVE BILATERAL"
                className="w-full px-2 py-1 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Enfermedad. otros:
              </label>
              <input
                type="text"
                defaultValue="- DISCROMATOPSIA. - PTERIGIÓN BILATERAL."
                className="w-full px-2 py-1 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Reflejos Pupilares:
              </label>
              <input
                type="text"
                defaultValue="CONSERVADOS"
                className="w-full px-2 py-1 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Visión Binocular:
              </label>
              <input
                type="text"
                defaultValue="20/20"
                className="w-full px-2 py-1 border border-gray-300 rounded"
              />
            </div>
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
                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    Ectoscopía:
                  </label>
                  <input
                    type="text"
                    defaultValue="APARENTA BUEN ESTADO DE SALUD."
                    className="w-full px-2 py-1 border border-gray-300 rounded bg-blue-50"
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    Estado Mental:
                  </label>
                  <input
                    type="text"
                    defaultValue="DESPIERTO, OTEP, COMUNICATIVO."
                    className="w-full px-2 py-1 border border-gray-300 rounded bg-blue-50"
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    Anamnesis:
                  </label>
                  <textarea
                    rows="3"
                    defaultValue="COLABORADOR REFIERE SENTIRSE BIEN, SIN PROBLEMAS DE SALUD, NO practica deporte o deporte de alto rendimiento."
                    className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Dentadura*/}
          <div className=" flex flex-col h-full">
            {/* Dentadura */}
            <div className="bg-white border border-gray-200 rounded-lg p-3 flex-1 mb-3">
              <h4 className="font-semibold text-gray-800 mb-2">Dentadura</h4>

              <div className="space-y-2 flex">
                <div className="flex items-center space-x-2">
                  <label className="w-20 font-medium text-gray-700">
                    Piezas en mal estado:
                  </label>
                  <input
                    type="text"
                    defaultValue="3"
                    className="w-10 px-1 py-0.5 border border-gray-300 rounded text-center"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <label className="w-20 font-medium text-gray-700">
                    Piezas que faltan:
                  </label>
                  <input
                    type="text"
                    defaultValue="2"
                    className="w-10 px-1 py-0.5 border border-gray-300 rounded text-center"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
