/* eslint-disable react/prop-types */
import { InputCheckbox, InputsBooleanRadioGroup, InputsRadioGroup, InputTextOneLine, } from "../../../../../components/reusableComponents/ResusableComponents";

// Componente Antecedentes Patológicos - usa componentes reusables
export default function AntecedentesPatologicosTab({
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
      <div className="bg-white border border-gray-200 rounded-lg p-3">
        <h4 className="font-semibold mb-3">Ingresar Información</h4>

        {/* Barra de información del paciente */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 mb-4">
          <InputTextOneLine label="N° Orden" name="norden" value={form?.norden} onChange={handleChangeNumber} labelWidth="70px" />
          <InputTextOneLine label="Fecha" name="fechaExam" type="date" value={form?.fechaExam} onChange={handleChangeSimple} labelWidth="50px" />
          <InputTextOneLine label="Nombres" name="nombres" value={form?.nombres} disabled labelWidth="70px" />
          <InputTextOneLine label="Sexo" name="sexo" value={form?.sexo} disabled labelWidth="40px" />
          <InputTextOneLine label="Edad" name="edad" value={form?.edad} disabled labelWidth="40px" />
        </div>

        <div className="flex items-center justify-between mb-3">
          <h1 className="font-semibold">1. ANTECEDENTES PATOLÓGICOS PERSONALES</h1>
          <div className="flex items-center gap-2">
            <InputCheckbox
              label="BOROO"
              name="boroo"
              checked={form?.boroo}
              onChange={handleCheckBoxChange}
            />
          </div>
        </div>

        {/* COVID 19, Fecha y Severidad */}
        {!form?.boroo && (
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <InputCheckbox
                label="COVID 19"
                name="covid19"
                checked={form?.covid19}
                onChange={(e) => { setForm(prev => ({ ...prev, severidadCovid: "" })); handleCheckBoxChange(e) }}
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
                label="Severidad"
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
          </div>)}

        <div className="mb-2 font-semibold text-red-600">
          Marcar todas las enfermedades que ha tenido o tiene
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Enfermedades normales */}
          {!form?.boroo && (
            <>
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
            </>
          )}

          {/* Enfermedades BOROO */}
          {form?.boroo && (
            <>
              {/* Columna 1 - BOROO */}
              <div className="space-y-1">
                {[
                  ["alergias", "Alergias"],
                  ["asma", "Asma"],
                  ["bronquitisRepeticion", "Bronquitis a repetición"],
                  ["diabetes", "Diabetes"],
                  ["enfCorazon", "Enfermedades del corazón"],
                  ["enfOculares", "Enf. Oculares"],
                  ["epilepsiaConvulsiones", "Epilepsia o convulsiones"],
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

              {/* Columna 2 - BOROO */}
              <div className="space-y-1">
                {[
                  ["hepatitis", "Hepatitis"],
                  ["hernias", "Hernias"],
                  ["hipertensionArterial", "Hipertención Arterial"],
                  ["traumatismoEncefalocraneano", "Traumatismo encefalocraneano"],
                  ["tuberculosis", "Tuberculosis"],
                  ["ulceraPeptica", "Ulcera péptica"],
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

              {/* Columna 3 - BOROO */}
              <div className="space-y-1">
                {[
                  ["enfReumatica", "Enf Reumática"],
                  ["enfPulmonares", "Enf Pulmonares"],
                  ["enfPiel", "Enf de la Piel"],
                  ["tendinitis", "Tendinitis"],
                  ["onicomicosis", "Onicomicosis"],
                  ["fracturas", "Fracturas"],
                  ["anemia", "Anemia"],
                  ["obesidad", "Obesidad"],
                  ["dislipidemia", "Dislipidemia"],
                  ["intoxicaciones", "Intoxicaciones"],
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
            </>
          )}
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
          {form?.boroo && (
            <InputTextOneLine
              label="Especifique detalles o tratamiento marcada"
              name="detallesTratamiento"
              value={form?.detallesTratamiento}
              onChange={handleChange}
              labelWidth="200px"
            />)}
        </div>
        {form?.boroo && (<>
          {/* Alergias */}
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-4">
              <span className="font-semibold min-w-[200px]">Alergias a Medicamentos / Alimentos:</span>
              <InputsBooleanRadioGroup
                name="alergiasMedicamentos"
                value={form?.alergiasMedicamentos}
                onChange={handleRadioButtonBoolean}
              />
              <InputTextOneLine
                label="Especifique"
                name="especifiqueAlergias"
                value={form?.especifiqueAlergias}
                onChange={handleChange}
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
                      onChange={handleRadioButtonBoolean}
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
                          onChange={handleRadioButtonBoolean}
                        />
                      </div>
                      <InputTextOneLine
                        label="Especifique"
                        name="especifiqueTiempoPerdido"
                        value={form?.especifiqueTiempoPerdido}
                        onChange={handleChange}
                      />
                      <InputTextOneLine
                        label="Tipo de Incapacidad"
                        name="tipoIncapacidad"
                        value={form?.tipoIncapacidad}
                        onChange={handleChange}
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
                      onChange={handleRadioButtonBoolean}
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
                          onChange={handleRadioButtonBoolean}
                        />
                      </div>
                      <InputTextOneLine
                        label="Especifique cual"
                        name="especifiqueCalificacion"
                        value={form?.especifiqueCalificacion}
                        onChange={handleChange}
                      />
                      <InputTextOneLine
                        label="Fecha"
                        name="fechaCalificacion"
                        type="date"
                        value={form?.fechaCalificacion}
                        onChange={handleChangeSimple}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
        )}
      </div>
    </div>
  );
}
