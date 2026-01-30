import {
  InputCheckbox,
  InputsBooleanRadioGroup,
  InputsRadioGroup,
  InputTextOneLine,
  InputTextArea,
} from "../../../../../components/reusableComponents/ResusableComponents";

export default function DatosPersonales({
  form,
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
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
                labelWidth="68px"
              />
              <InputTextOneLine
                label="Nombres"
                name="nombres"
                value={form.nombres}
                disabled
                labelWidth="68px"
              />
              <InputTextOneLine
                label="Apellidos"
                name="apellidos"
                value={form.apellidos}
                disabled
                labelWidth="68px"
              />
              <InputTextOneLine
                label="Fecha Nac."
                name="fechaNac"
                value={form.fechaNac}
                disabled
                labelWidth="68px"
              />
              <InputTextOneLine
                label="Sexo"
                name="sexo"
                value={form.sexo}
                disabled
                labelWidth="68px"
              />
              <InputTextOneLine
                label="Edad (años)"
                name="edad"
                value={form.edad}
                disabled
                labelWidth="68px"
              />
              <InputTextOneLine
                label="Lugar Nac."
                name="lugarNac"
                value={form.lugarNac}
                disabled
                labelWidth="68px"
              />
              <InputTextOneLine
                label="Domicilio"
                name="domicilio"
                value={form.domicilio}
                disabled
                labelWidth="68px"
              />
              <InputTextOneLine
                label="Teléfono"
                name="telefono"
                value={form.telefono}
                disabled
                labelWidth="68px"
              />
              <InputTextOneLine
                label="Estado Civil"
                name="estadoCivil"
                value={form.estadoCivil}
                disabled
                labelWidth="68px"
              />
              <InputTextOneLine
                label="Grado Inst."
                name="gradoInstruccion"
                value={form.gradoInstruccion}
                disabled
                labelWidth="68px"
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
                onChange={handleChange}
              />
              <InputTextOneLine
                label="Tiempo"
                name="tiempoPuesto"
                value={form.tiempoPuesto}
                onChange={handleChange}
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
              <div className="flex flex-col gap-2">
                <InputTextOneLine
                  label="Antecedentes Personales y/o Ocupacionales (enfermedad y/o accidente)"
                  name="antecedentesPersonales2"
                  value={form.antecedentesPersonales2}
                  onChange={handleChange}
                  labelOnTop
                />
                <InputTextOneLine
                  name="antecedentesPersonales"
                  value={form.antecedentesPersonales}
                  onChange={handleChange}
                />
              </div>

              {/* Antecedentes Familiares */}
              <InputTextOneLine
                label="Antecedentes Familiares"
                name="antecedentesFamiliares"
                value={form.antecedentesFamiliares}
                onChange={handleChange}
                labelOnTop
              />
            </div>
          </div>
        </div>

        {/* Columna Derecha - Antecedentes Patológicos */}
        <div className="bg-white border border-gray-200 rounded-lg p-3 h-full">
          <InputTextArea
            rows={6}
            label="Antecedentes Patológicos"
            name="antecedentesPatologicos"
            value={form.antecedentesPatologicos || ""}
            disabled
          />
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
                    { label: "Nada", value: "NADA" },
                    { label: "Poco", value: "POCO" },
                    { label: "Habitual", value: "HABITUAL" },
                    { label: "Excesivo", value: "EXCESIVO" },
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
                    { label: "Nada", value: "NADA" },
                    { label: "Poco", value: "POCO" },
                    { label: "Habitual", value: "HABITUAL" },
                    { label: "Excesivo", value: "EXCESIVO" },
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
                    { label: "Nada", value: "NADA" },
                    { label: "Poco", value: "POCO" },
                    { label: "Habitual", value: "HABITUAL" },
                    { label: "Excesivo", value: "EXCESIVO" },
                  ]}
                />
              </div>
            </div>
          </div>
          <InputTextArea
            label="Notas Para Doctor"
            name="notasDoctor"
            value={form.notasDoctor}
            rows={4}
            disabled
          />
        </div>

        {/* Columna Derecha - Número de Hijos e Inmunizaciones */}
        <div className="space-y-3">
          <div className="bg-white border border-gray-200 rounded-lg p-3 ">
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
                    onChange={handleChangeNumber}
                  />
                  <InputTextOneLine
                    label="Muertos"
                    name="hijosMuertos"
                    value={form.hijosMuertos}
                    onChange={handleChangeNumber}
                  />
                </div>
              </div>


            </div>
          </div>
          {/* Inmunizaciones */}
          <div className="bg-white border border-gray-200 rounded-lg p-3 ">
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
  );
}