import {
  InputCheckbox,
  InputsBooleanRadioGroup,
  InputsRadioGroup,
  InputTextOneLine,
  InputTextArea,
} from "../../../../../components/reusableComponents/ResusableComponents";

export default function DatosPersonales({
  form,
  setForm,
  handleChange,
  handleChangeNumber,
  handleCheckBoxChange,
  handleRadioButtonBoolean,
  handleRadioButton,
  handleSearch,
}) {
  return (
    <div className="p-4" style={{ fontSize: "10px" }}>
      {/* Header con información del examen */}
      <div className="bg-white border border-gray-200 rounded-lg p-3 mb-4">
        <h3 className="font-semibold mb-2 text-gray-800">Anexo 16</h3>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
          <InputTextOneLine
            label="N° Orden"
            name="norden"
            value={form.norden}
            onKeyUp={handleSearch}
            onChange={handleChangeNumber}
            labelWidth="100px"
          />
          <InputTextOneLine
            label="Ex-Médico"
            name="nomExamen"
            value={form.nomExamen}
            disabled
            labelWidth="100px"
          />
          <InputTextOneLine
            label="Fecha Exámen"
            name="fechaExam"
            type="date"
            value={form.fechaExam}
            onChange={handleChange}
            labelWidth="100px"
          />
        </div>
      </div>

      {/* Primera fila - 2 columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
        {/* Columna Izquierda - Identificación Personal */}
        <div className="space-y-3">
          <div className="bg-white border border-gray-200 rounded-lg p-3 h-full">
            <h4 className="font-semibold text-gray-800 mb-2">
              Identificación Personal
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <InputTextOneLine
                label="DNI"
                name="dni"
                value={form.dni}
                disabled
                labelWidth="65px"
              />
              <InputTextOneLine
                label="Nombres"
                name="nombres"
                value={form.nombres}
                disabled
                labelWidth="65px"
              />
              <InputTextOneLine
                label="Apellidos"
                name="apellidos"
                value={form.apellidos}
                disabled
                labelWidth="65px"
              />
              <InputTextOneLine
                label="Fecha Nac."
                name="fechaNac"
                value={form.fechaNac}
                disabled
                labelWidth="65px"
              />
              <InputTextOneLine
                label="Sexo"
                name="sexo"
                value={form.sexo}
                disabled
                labelWidth="65px"
              />
              <InputTextOneLine
                label="Edad"
                name="edad"
                value={form.edad}
                disabled
                labelWidth="65px"
              />
              <InputTextOneLine
                label="Lugar Nac."
                name="lugarNac"
                value={form.lugarNac}
                disabled
                labelWidth="65px"
              />
              <InputTextOneLine
                label="Domicilio"
                name="domicilio"
                value={form.domicilio}
                disabled
                labelWidth="65px"
              />
              <InputTextOneLine
                label="Teléfono"
                name="telefono"
                value={form.telefono}
                disabled
                labelWidth="65px"
              />
              <InputTextOneLine
                label="Estado Civil"
                name="estadoCivil"
                value={form.estadoCivil}
                disabled
                labelWidth="65px"
              />
              <InputTextOneLine
                label="Grado Inst."
                name="gradoInstruccion"
                value={form.gradoInstruccion}
                disabled
                labelWidth="65px"
              />
            </div>
          </div>
        </div>

        {/* Columna Derecha - Agentes presentes en Trabajo Actual */}
        <div className="space-y-3">
          <div className="bg-white border border-gray-200 rounded-lg p-3 h-full">
            <h4 className="font-semibold text-gray-800 mb-2">
              Agentes presentes en Trabajo Actual
            </h4>
            <div className="grid grid-cols-3 gap-2">
              <InputCheckbox
                label="Ruido"
                checked={form.ruido}
                name="ruido"
                onChange={handleCheckBoxChange}
              />
              <InputCheckbox
                label="Polvo"
                checked={form.polvo}
                name="polvo"
                onChange={handleCheckBoxChange}
              />
              <InputCheckbox
                label="Vid Segmentario"
                checked={form.vidSegmentario}
                name="vidSegmentario"
                onChange={handleCheckBoxChange}
              />
              <InputCheckbox
                label="Vid Total"
                checked={form.vidTotal}
                name="vidTotal"
                onChange={handleCheckBoxChange}
              />
              <InputCheckbox
                label="Altura Estruct."
                checked={form.alturaEstruct}
                name="alturaEstruct"
                onChange={handleCheckBoxChange}
              />
              <InputCheckbox
                label="Vibraciones"
                checked={form.vibraciones}
                name="vibraciones"
                onChange={handleCheckBoxChange}
              />
              <InputCheckbox
                label="Cancerígenos"
                checked={form.cancerigenos}
                name="cancerigenos"
                onChange={handleCheckBoxChange}
              />
              <InputCheckbox
                label="Mutagenicos"
                checked={form.mutagenicos}
                name="mutagenicos"
                onChange={handleCheckBoxChange}
              />
              <InputCheckbox
                label="Solventes"
                checked={form.solventes}
                name="solventes"
                onChange={handleCheckBoxChange}
              />
              <InputCheckbox
                label="Metales"
                checked={form.metales}
                name="metales"
                onChange={handleCheckBoxChange}
              />
              <InputCheckbox
                label="Altura Geograf."
                checked={form.alturaGeograf}
                name="alturaGeograf"
                onChange={handleCheckBoxChange}
              />
              <InputCheckbox
                label="Temperatura"
                checked={form.temperaturaAgente}
                name="temperaturaAgente"
                onChange={handleCheckBoxChange}
              />
              <InputCheckbox
                label="Biológicos"
                checked={form.biologicos}
                name="biologicos"
                onChange={handleCheckBoxChange}
              />
              <InputCheckbox
                label="Posturas"
                checked={form.posturas}
                name="posturas"
                onChange={handleCheckBoxChange}
              />
              <InputCheckbox
                label="Turnos"
                checked={form.turnos}
                name="turnos"
                onChange={handleCheckBoxChange}
              />
              <InputCheckbox
                label="Químicos"
                checked={form.quimicos}
                name="quimicos"
                onChange={handleCheckBoxChange}
              />
              <InputCheckbox
                label="Cargas"
                checked={form.cargas}
                name="cargas"
                onChange={handleCheckBoxChange}
              />
              <InputCheckbox
                label="Mov. Repet"
                checked={form.movRepet}
                name="movRepet"
                onChange={handleCheckBoxChange}
              />
              <InputCheckbox
                label="PVD"
                checked={form.pvd}
                name="pvd"
                onChange={handleCheckBoxChange}
              />
              <InputCheckbox
                label="Electricos"
                checked={form.electricos}
                name="electricos"
                onChange={handleCheckBoxChange}
              />
              <InputCheckbox
                label="Otros"
                checked={form.otros}
                name="otros"
                onChange={handleCheckBoxChange}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Segunda fila - 2 columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
        {/* Columna Izquierda - Información Laboral */}
        <div className="space-y-3">
          <div className="bg-white border border-gray-200 rounded-lg p-3 h-full">
            <h4 className="font-semibold text-gray-800 mb-2">
              Información Laboral
            </h4>
            <div className="space-y-2">
              <InputTextOneLine
                label="Empresa"
                name="empresa"
                value={form.empresa}
                disabled
              />
              <InputTextOneLine
                label="Contrata"
                name="contrata"
                value={form.contrata}
                disabled
              />
              <InputTextOneLine
                label="Mineral Exp"
                name="mineralExp"
                value={form.mineralExp}
                disabled
              />
              <InputTextOneLine
                label="Explotación en"
                name="explotacion"
                value={form.explotacion}
                disabled
              />
              <InputTextOneLine
                label="Altura de Labor"
                name="alturaLaboral"
                value={form.alturaLaboral}
                disabled
              />
            </div>
          </div>
        </div>

        {/* Columna Derecha - Datos del Puesto */}
        <div className="space-y-3">
          <div className="bg-white border border-gray-200 rounded-lg p-3 h-full">
            <h4 className="font-semibold text-gray-800 mb-2">
              Datos del Puesto
            </h4>
            <div className="space-y-2">
              <InputTextOneLine
                label="Puesto al que Postula"
                name="puestoPostula"
                value={form.puestoPostula}
                disabled
              />
              <InputTextOneLine
                label="Puesto Actual"
                name="puestoActual"
                value={form.puestoActual}
                disabled
              />
              <InputTextOneLine
                label="Tiempo"
                name="tiempoPuesto"
                value={form.tiempoPuesto}
                disabled
              />
              <InputTextOneLine
                label="Area"
                name="areaPuesto"
                value={form.areaPuesto}
                disabled
              />
              <div className="flex items-center gap-4">
                <label className="font-semibold text-gray-700 min-w-[100px]">
                  Reubicación:
                </label>
                <InputsBooleanRadioGroup
                  name="reubicacion"
                  value={form.reubicacion}
                  onChange={handleRadioButtonBoolean}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tercera fila - 2 columnas - Antecedentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
        {/* Columna Izquierda - Antecedentes Personales y Familiares */}
        <div className="space-y-3">
          <div className="bg-white border border-gray-200 rounded-lg p-3 h-full">
            <div className="space-y-4">
              {/* Antecedentes Personales */}
              <div className="flex flex-col">
                <label className="font-semibold text-gray-700 mb-1">
                  Antecedentes Personales y/o Ocupacionales (enfermedad y/o accidente)
                </label>
                <input
                  type="text"
                  name="antecedentesPersonalesOcupacionales"
                  value={form.antecedentesPersonalesOcupacionales || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  name="otroAntecedentePersonal"
                  value={form.otroAntecedentePersonal || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 mt-2 border border-gray-300 rounded-md text-gray-800  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Antecedentes Familiares */}
              <div className="flex flex-col">
                <label className="font-semibold text-gray-700 mb-1">Antecedentes Familiares</label>
                <input
                  type="text"
                  name="antecedentesFamiliares"
                  value={form.antecedentesFamiliares || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

      {/* Columna Derecha - Antecedentes Patológicos */}
        <div className="space-y-3">
          <div className="bg-white border border-gray-200 rounded-lg p-3 h-full">
            <h4 className="font-semibold text-gray-800 mb-2">
              Antecedentes Patológicos
            </h4>
            <div className="space-y-3">
              <div>
          
                <textarea
                  name="antecedentesPatologicos"
                  value={form.antecedentesPatologicos || ""}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800 
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                            bg-gray-50 resize-none"
                  placeholder="Describa antecedentes patológicos..."
                />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Cuarta fila - 2 columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Columna Izquierda - Hábitos */}
        <div className="space-y-3">
          <div className="bg-white border border-gray-200 rounded-lg p-3 h-full">
            <h4 className="font-semibold text-gray-800 mb-2">
              Hábitos
            </h4>
            <div className="space-y-3">
              <div>
                <label className="font-semibold text-gray-700 mb-1 block">Tabaco:</label>
                <InputsRadioGroup
                  name="tabaco"
                  value={form.tabaco}
                  onChange={handleRadioButton}
                  options={[
                    { label: "Nada", value: "nada" },
                    { label: "Poco", value: "poco" },
                    { label: "Habitual", value: "habitual" },
                  ]}
                />
              </div>
              <div>
                <label className="font-semibold text-gray-700 mb-1 block">Alcohol:</label>
                <InputsRadioGroup
                  name="alcohol"
                  value={form.alcohol}
                  onChange={handleRadioButton}
                  options={[
                    { label: "Nada", value: "nada" },
                    { label: "Poco", value: "poco" },
                    { label: "Habitual", value: "habitual" },
                  ]}
                />
              </div>
              <div>
                <label className="font-semibold text-gray-700 mb-1 block">Drogas:</label>
                <InputsRadioGroup
                  name="drogas"
                  value={form.drogas}
                  onChange={handleRadioButton}
                  options={[
                    { label: "Nada", value: "nada" },
                    { label: "Poco", value: "poco" },
                    { label: "Habitual", value: "habitual" },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha - Número de Hijos e Inmunizaciones */}
        <div className="space-y-3">
          <div className="bg-white border border-gray-200 rounded-lg p-3 h-full">
            <div className="space-y-4">
              {/* Número de Hijos */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">
                  Número de Hijos
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <InputTextOneLine
                    label="Vivos"
                    name="hijosVivos"
                    value={form.hijosVivos}
                    onChange={handleChange}
                  />
                  <InputTextOneLine
                    label="Muertos"
                    name="hijosMuertos"
                    value={form.hijosMuertos}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Inmunizaciones */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">
                  Inmunizaciones
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  <InputCheckbox
                    label="Tetano"
                    checked={form.tetano}
                    name="tetano"
                    onChange={handleCheckBoxChange}
                  />
                  <InputCheckbox
                    label="Hepatitis - B"
                    checked={form.hepatitisB}
                    name="hepatitisB"
                    onChange={handleCheckBoxChange}
                  />
                  <InputCheckbox
                    label="Fiebre Amarilla"
                    checked={form.fiebreAmarilla}
                    name="fiebreAmarilla"
                    onChange={handleCheckBoxChange}
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