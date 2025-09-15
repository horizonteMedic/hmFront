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

      {/* Contenido principal - 2 columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Columna Izquierda */}
        <div className="lg:col-span-6 space-y-3">
          {/* Identificación Personal */}
          <div className="bg-white border border-gray-200 rounded-lg p-3">
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

          {/* Información Laboral */}
          <div className="bg-white border border-gray-200 rounded-lg p-3">
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

          {/* Datos del Puesto */}
          <div className="bg-white border border-gray-200 rounded-lg p-3">
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

          {/* Antecedentes */}
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <h4 className="font-semibold text-gray-800 mb-2">
              Antecedentes
            </h4>
            <div className="space-y-2">
              <InputTextArea
                rows={3}
                label="Antecedentes Personales y/o Ocupacionales (enfermedad y/o accidente)"
                name="antecedentesPersonalesOcupacionales"
                value={form.antecedentesPersonalesOcupacionales}
                onChange={handleChange}
              />
              <InputTextOneLine
                label="Antecedentes Familiares"
                name="antecedentesFamiliares"
                value={form.antecedentesFamiliares}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Comparación Grupo Sanguíneo y Antecedentes Patológicos */}
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <h4 className="font-semibold text-gray-800 mb-2">
              Comparación Grupo Sanguíneo
            </h4>
            <div className="flex items-center space-x-2 mb-3">
              <InputTextOneLine
                name="grupoSanguineoPrevio"
                value={form.grupoSanguineoPrevio}
                onChange={handleChange}
              />
              <span className="font-medium">=</span>
              <InputTextOneLine
                name="grupoSanguineoGrupo"
                value={form.grupoSanguineoGrupo}
                onChange={handleChange}
              />
            </div>
            <InputTextArea
              rows={2}
              label="Antecedentes Patológicos"
              name="antecedentesPatologicos"
              value={form.antecedentesPatologicos}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Columna Derecha */}
        <div className="lg:col-span-6 space-y-3">
          {/* Agentes presentes en Trabajo Actual */}
          <div className="bg-white border border-gray-200 rounded-lg p-3">
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

          {/* Número de Hijos */}
          <div className="bg-white border border-gray-200 rounded-lg p-3">
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
          <div className="bg-white border border-gray-200 rounded-lg p-3">
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

          {/* Hábitos */}
          <div className="bg-white border border-gray-200 rounded-lg p-3">
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

          {/* Medidas Físicas */}
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <h4 className="font-semibold text-gray-800 mb-2">
              Medidas Físicas
            </h4>
            <div className="grid grid-cols-3 gap-2">
              <InputTextOneLine
                label="Talla (m)"
                name="talla"
                value={form.talla}
                disabled
              />
              <InputTextOneLine
                label="Peso (Kg)"
                name="peso"
                value={form.peso}
                disabled
              />
              <InputTextOneLine
                label="IMC"
                name="imc"
                value={form.imc}
                disabled
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}