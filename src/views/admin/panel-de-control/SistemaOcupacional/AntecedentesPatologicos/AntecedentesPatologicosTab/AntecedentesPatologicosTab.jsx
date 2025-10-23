/* eslint-disable react/prop-types */
import { InputCheckbox, InputsBooleanRadioGroup, InputsRadioGroup, InputTextOneLine, } from "../../../../../components/reusableComponents/ResusableComponents";
import { getToday } from "../../../../../utils/helpers";

// Componente Antecedentes Patológicos - usa componentes reusables
export default function AntecedentesPatologicosTab({
  form,
  setForm,
  handleChange,
  handleChangeNumber,
  handleCheckBoxChange,
  handleChangeSimple,
  handleRadioButton,
  handleRadioButtonBoolean,
  handleSearch
}) {
  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-lg p-3">
        <h4 className="font-semibold mb-3">Ingresar Información</h4>

        {/* Barra de información del paciente */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4">
          <InputTextOneLine label="N° Orden" name="norden" value={form?.norden} onKeyUp={handleSearch} onChange={handleChangeNumber} labelWidth="60px" />
          <InputTextOneLine label="Fecha" name="fechaExam" type="date" value={form?.fechaExam} onChange={handleChangeSimple} labelWidth="60px" />
          <InputTextOneLine label="Nombres" name="nombres" value={form?.nombres} disabled labelWidth="60px" />
          <div className="grid md:grid-cols-2 gap-4">
            <InputTextOneLine label="Sexo" name="sexo" value={form?.sexo} disabled labelWidth="60px" />
            <InputTextOneLine label="Edad" name="edad" value={form?.edad} disabled labelWidth="60px" />
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <h1 className="font-semibold">1. ANTECEDENTES PATOLÓGICOS PERSONALES</h1>
          <div className="flex items-center gap-2">

          </div>
        </div>

        {/* COVID 19, Fecha y Severidad */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <InputCheckbox
              label="COVID 19"
              name="covid19"
              checked={form?.covid19}
              onChange={(e) => {
                const today = getToday();
                setForm(prev => ({
                  ...prev,
                  severidadCovid: "",
                  fechaCovid: today,
                  dosisVacunas: "",
                }));
                handleCheckBoxChange(e)
              }}
            />
          </div>
          <InputTextOneLine
            label="Fecha"
            name="fechaCovid"
            type="date"
            value={form?.fechaCovid}
            onChange={handleChangeSimple}
            disabled={!form?.covid19}
          />
          <div className="flex items-center gap-4">
            <InputsRadioGroup
              name="severidadCovid"
              value={form?.severidadCovid}
              disabled={!form?.covid19}
              options={[
                { label: "Leve", value: "LEVE" },
                { label: "Moderada", value: "MODERADA" },
                { label: "Severa", value: "SEVERA" },
              ]}
              onChange={handleRadioButton}
            />
          </div>
          <InputTextOneLine
            label="Dosis de vacunas"
            name="dosisVacunas"
            value={form?.dosisVacunas}
            onChange={handleChangeNumber}
            disabled={!form?.covid19}
            labelWidth="120px" />
        </div>


        <div className="mb-2 font-semibold text-red-600">
          Marcar todas las enfermedades que ha tenido o tiene
        </div>
        <div className="space-y-3 mb-4">
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
                checked={form.otrosAgentes}
                name="otrosAgentes"
                onChange={handleCheckBoxChange}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 border rounded p-3">
          {/* Columna 1 */}
          <div className="space-y-1">
            {[
              ["alergias", "Alergias"],
              ["amigdalitisCronica", "Amigdalitis crónica"],
              ["arritmiasCardiacas", "Arritmias cardiacas"],
              ["asma", "Asma"],
              ["bocio", "Bocio"],
              ["bronconeumonia", "Bronconeumonía"],
              ["bronquitisRepeticion", "Bronquitis a repetición"],
              ["cariesGingivitis", "Caries o gingivitis"],
              ["colecistitis", "Colecistitis"],
              ["dermatitis", "Dermatitis"],
              ["diabetes", "Diabetes"],
              ["disenteria", "Disentería"],
              ["enfCorazon", "Enfermedades del corazón"],
              ["enfOculares", "Enf. Oculares"],
              ["epilepsiaConvulsiones", "Epilepsia o convulsiones"],
              ["faringitisCronica", "Faringitis crónica"],
              ["fiebreMalta", "Fiebre malta"],
              ["fiebreTifoidea", "Fiebre tifoidea"],
              ["fiebreReumatica", "Fiebre Reumática"],
              ["forunculosis", "Forunculosis"],
              ["ima", "IMA (Infarto agudo al miocardio)"],
              ["acv", "ACV (Acc. Cerebro Vascular)"],
              ["tbc", "TBC"],
              ["ets", "ETS"],
              ["vih", "VIH"],
              ["fobias", "Fobias"],
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
              ["gastritisCronica", "Gastritis crónica"],
              ["gonorrea", "Gonorrea"],
              ["gota", "Gota"],
              ["hemorroides", "Hemorroides"],
              ["hepatitis", "Hepatitis"],
              ["hernias", "Hernias"],
              ["hipertensionArterial", "Hipertensión Arterial"],
              ["infUrinariasRepetidas", "Inf. Urinarias repetidas"],
              ["intoxicaciones", "Intoxicaciones"],
              ["insuficienciaCardiaca", "Insuficiencia Cardíaca"],
              ["insuficienciaCoronariaCronica", "Insuficiencia Coronaria Crónica"],
              ["insuficienciaRenalCronica", "Insuficiencia Renal Crónica"],
              ["litiasisUrinaria", "Litiasis Urinaria"],
              ["meningitis", "Meningitis"],
              ["neuritisRepeticion", "Neuritis a Repetición"],
              ["otitisMedia", "Otitis Media"],
              ["presionAltaBaja", "Presión alta o baja"],
              ["paludismoMalaria", "Paludismo o malaria"],
              ["parasitosisIntestinal", "Parasitosis Intestinal"],
              ["parotiditis", "Parotiditis"],
              ["vertigos", "Vértigos"],
              ["tifoidea", "Tifoidea"],
              ["neoplasias", "Neoplasias"],
              ["quemaduras", "Quemaduras"],
              ["discopatias", "Discopatías"],
              ["columna", "Columna"],
              ["enfPsiquiatricas", "Enf Psiquiátricas"],
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
              ["pleuresia", "Pleuresia"],
              ["plumbismo", "Plumbismo"],
              ["poliomielitis", "Poliomielitis"],
              ["portadorMarcapaso", "Portador de Marcapaso"],
              ["protesisCardiacasValvulares", "Prótesis Cardiacas Valvulares"],
              ["resfriosFrecuentes", "Resfríos frecuentes"],
              ["reumatismoRepeticion", "Reumatismo a repetición"],
              ["sarampion", "Sarampión"],
              ["sifilis", "Sífilis"],
              ["silicosis", "Silicosis"],
              ["sinusitisCronica", "Sinusitis crónica"],
              ["tosConvulsiva", "Tos convulsiva"],
              ["trastornosNerviosos", "Trastornos Nerviosos"],
              ["traumatismoEncefalocraneano", "Traumatismo encefalocraneano"],
              ["tuberculosis", "Tuberculosis"],
              ["tumoresQuistes", "Tumores - quistes"],
              ["ulceraPeptica", "Ulcera péptica"],
              ["varicela", "Varicela"],
              ["varices", "Várices"],
              ["varicocele", "Varicocele"],
              ["enfReumatica", "Enf Reumática"],
              ["enfPulmonares", "Enf Pulmonares"],
              ["enfPiel", "Enf de la Piel"],
              ["tendinitis", "Tendinitis"],
              ["onicomicosis", "Onicomicosis"],
              ["fracturas", "Fracturas"],
              ["anemia", "Anemia"],
              ["obesidad", "Obesidad"],
              ["dislipidemia", "Dislipidemia"],
              ["amputacion", "Amputación"],
              ["sordera", "Sordera"],
              ["migrana", "Migraña"],
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

        {/* Otras Patologías */}
        <div className="mt-6 space-y-4">
          <InputTextOneLine
            label="Otras Patologías"
            name="otrasPatologias"
            value={form?.otrasPatologias}
            onChange={handleChange}
            labelWidth="200px"
          />
          <InputTextOneLine
            label="Especifique detalles o tratamiento marcada"
            name="detallesTratamiento"
            value={form?.detallesTratamiento}
            onChange={handleChange}
            labelWidth="200px"
          />
        </div>
        <>
          {/* Alergias */}
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-4">
              <span className="font-semibold min-w-[200px]">Alergias a Medicamentos / Alimentos:</span>
              <InputsBooleanRadioGroup
                name="alergiasMedicamentos"
                value={form?.alergiasMedicamentos}
                onChange={(e, value) => {
                  if (value == false)
                    setForm(prev => ({ ...prev, especifiqueAlergias: "" }));
                  handleRadioButtonBoolean(e, value)
                }
                }
              />
              <InputTextOneLine
                label="Especifique"
                name="especifiqueAlergias"
                value={form?.especifiqueAlergias}
                onChange={handleChange}
                disabled={!form?.alergiasMedicamentos}
                className="w-full"
              />
            </div>
          </div>

          {/* Accidente y Enfermedad Profesional - Dos columnas */}
          <div className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Columna 1 - Accidente relacionado al trabajo */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <span className="font-semibold">Ha sufrido algún accidente relacionado al trabajo:</span>
                    <InputsBooleanRadioGroup
                      name="accidenteTrabajo"
                      value={form?.accidenteTrabajo}
                      onChange={(e, value) => {
                        const today = getToday();
                        if (value == false)
                          setForm(prev => ({
                            ...prev,
                            fechaAccidente: today, tiempoPerdido: false,
                            especifiqueTiempoPerdido: "",
                            tipoIncapacidad: "",
                          }));
                        handleRadioButtonBoolean(e, value)
                      }}
                    />
                  </div>

                </div>

                {/* Tiempo perdido - solo si accidenteTrabajo es SI */}
                {form?.accidenteTrabajo && (
                  <div className="ml-4 space-y-4 border-l-2 border-gray-200 pl-4">
                    <div className="space-y-2">
                      <InputTextOneLine
                        label="Fecha Accidente"
                        name="fechaAccidente"
                        type="date"
                        value={form?.fechaAccidente}
                        onChange={handleChangeSimple}
                      />
                      <div className="flex items-center gap-4">
                        <span className="font-semibold">Hubo tiempo perdido (descanso médico):</span>
                        <InputsBooleanRadioGroup
                          name="tiempoPerdido"
                          value={form?.tiempoPerdido}
                          onChange={(e, value) => {
                            if (value == false)
                              setForm(prev => ({ ...prev, especifiqueTiempoPerdido: "", tipoIncapacidad: "" }));
                            handleRadioButtonBoolean(e, value)
                          }}
                        />
                      </div>
                      <InputTextOneLine
                        label="Especifique"
                        name="especifiqueTiempoPerdido"
                        value={form?.especifiqueTiempoPerdido}
                        onChange={handleChange}
                        disabled={!form?.tiempoPerdido}
                      />
                      <InputTextOneLine
                        label="Tipo de Incapacidad"
                        name="tipoIncapacidad"
                        value={form?.tipoIncapacidad}
                        onChange={handleChange}
                        disabled={!form?.tiempoPerdido}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Columna 2 - Enfermedad profesional */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <span className="font-semibold">Ha sido declarado con alguna enfermedad profesional o relacionada al trabajo:</span>
                    <InputsBooleanRadioGroup
                      name="enfermedadProfesional"
                      value={form?.enfermedadProfesional}
                      onChange={(e, value) => {
                        const today = getToday();
                        if (value == false)
                          setForm(prev => ({ ...prev, evaluadoCalificacion: false, especifiqueCalificacion: "", fechaCalificacion: today }));
                        handleRadioButtonBoolean(e, value)
                      }}
                    />
                  </div>
                </div>

                {/* Evaluación para calificación - solo si enfermedadProfesional es SI */}
                {form?.enfermedadProfesional && (
                  <div className="ml-4 space-y-4 border-l-2 border-gray-200 pl-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-4">
                        <span className="font-semibold">Ha sido evaluado para calificación de enfermedad laboral:</span>
                        <InputsBooleanRadioGroup
                          name="evaluadoCalificacion"
                          value={form?.evaluadoCalificacion}
                          onChange={(e, value) => {
                            const today = getToday();
                            if (value == false)
                              setForm(prev => ({ ...prev, especifiqueCalificacion: "", fechaCalificacion: today }));
                            handleRadioButtonBoolean(e, value)
                          }}
                        />
                      </div>
                      <InputTextOneLine
                        label="Especifique cual"
                        name="especifiqueCalificacion"
                        value={form?.especifiqueCalificacion}
                        onChange={handleChange}
                        disabled={!form?.evaluadoCalificacion}
                      />
                      <InputTextOneLine
                        label="Fecha"
                        name="fechaCalificacion"
                        type="date"
                        value={form?.fechaCalificacion}
                        onChange={handleChangeSimple}
                        disabled={!form?.evaluadoCalificacion}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      </div>
    </div>
  );
}
