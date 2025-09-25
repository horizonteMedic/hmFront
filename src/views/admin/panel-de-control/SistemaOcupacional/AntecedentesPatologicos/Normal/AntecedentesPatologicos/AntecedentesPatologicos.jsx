/* eslint-disable react/prop-types */
import { InputCheckbox, InputTextOneLine, InputsBooleanRadioGroup, InputTextArea } from "../../../../../../components/reusableComponents/ResusableComponents";

// Componente Antecedentes Patológicos - usa componentes reusables
export default function AntecedentesPatologicos({
  form,
  handleSiNoChange,
}) {
  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-lg p-3">
        <h4 className="font-semibold mb-3">Ingresar Información</h4>

        {/* Barra de información del paciente */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 mb-4">
          <InputTextOneLine label="N° Orden" name="norden" value={form?.norden || ""} disabled labelWidth="70px" />
          <InputTextOneLine label="Fecha" name="fechaExam" type="date" value={form?.fechaExam || ""} disabled labelWidth="50px" />
          <InputTextOneLine label="Nombres" name="nombres" value={form?.nombres || ""} disabled labelWidth="70px" />
          <InputTextOneLine label="Sexo" name="sexo" value={form?.sexo || ""} disabled labelWidth="40px" />
          <InputTextOneLine label="Edad" name="edad" value={form?.edad || ""} disabled labelWidth="40px" />
        </div>

        <div className="flex items-center justify-between mb-3">
          <h1 className="font-semibold">1. ANTECEDENTES PATOLÓGICOS PERSONALES</h1>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[15px]">BOROO</span>
            <InputCheckbox 
              label="" 
              name="boroo" 
              checked={!!form?.boroo} 
              onChange={(e) => handleSiNoChange("boroo", e, e.target.checked)}
              className="[&>input:checked]:bg-red-500 [&>input:checked]:border-red-500 [&>input:checked]:text-white"
            />
          </div>
        </div>

        {/* COVID 19, Fecha y Severidad */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <InputCheckbox 
              label="COVID 19" 
              name="covid19" 
              checked={!!form?.covid19} 
              onChange={(e) => handleSiNoChange("covid19", e, e.target.checked)} 
            />
          </div>
          <div className={`flex items-center gap-2 ${!form?.covid19 ? 'opacity-50' : ''}`}>
            <span className={`font-semibold ${!form?.covid19 ? 'text-gray-400' : ''}`}>Fecha:</span>
            <InputTextOneLine 
              name="fechaEnfermedades" 
              type="date" 
              value={form?.fechaEnfermedades || ""} 
              onChange={() => {}} 
              disabled={!form?.covid19}
              className={!form?.covid19 ? 'disabled:opacity-50 disabled:cursor-not-allowed' : ''}
            />
          </div>
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 ${!form?.covid19 ? 'opacity-50' : ''}`}>
              <input
                type="checkbox"
                name="severidadLeve"
                checked={!!form?.severidadLeve}
                onChange={(e) => {
                  if (e.target.checked) {
                    // Desmarcar los otros checkboxes
                    handleSiNoChange("severidadModerado", e, false);
                    handleSiNoChange("severidadSevero", e, false);
                  }
                  handleSiNoChange("severidadLeve", e, e.target.checked);
                }}
                disabled={!form?.covid19}
                className="disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <span className={` ${!form?.covid19 ? 'text-gray-400' : ''}`}>LEVE</span>
            </div>
            <div className={`flex items-center gap-2 ${!form?.covid19 ? 'opacity-50' : ''}`}>
              <input
                type="checkbox"
                name="severidadModerado"
                checked={!!form?.severidadModerado}
                onChange={(e) => {
                  if (e.target.checked) {
                    // Desmarcar los otros checkboxes
                    handleSiNoChange("severidadLeve", e, false);
                    handleSiNoChange("severidadSevero", e, false);
                  }
                  handleSiNoChange("severidadModerado", e, e.target.checked);
                }}
                disabled={!form?.covid19}
                className="disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <span className={` ${!form?.covid19 ? 'text-gray-400' : ''}`}>MODERADO</span>
            </div>
            <div className={`flex items-center gap-2 ${!form?.covid19 ? 'opacity-50' : ''}`}>
              <input
                type="checkbox"
                name="severidadSevero"
                checked={!!form?.severidadSevero}
                onChange={(e) => {
                  if (e.target.checked) {
                    // Desmarcar los otros checkboxes
                    handleSiNoChange("severidadLeve", e, false);
                    handleSiNoChange("severidadModerado", e, false);
                  }
                  handleSiNoChange("severidadSevero", e, e.target.checked);
                }}
                disabled={!form?.covid19}
                className="disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <span className={` ${!form?.covid19 ? 'text-gray-400' : ''}`}>SEVERO</span>
            </div>
          </div>
        </div>

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
                  <div key={name} className="flex justify-between items-center">
                   <span>{label}</span>
                   <div className="mr-5">
                    <InputCheckbox
                      label=""
                      name={name}
                      checked={!!form?.[name]}
                      onChange={(e) =>
                        handleSiNoChange(name, e, e.target.checked)
                      }
                    />
                  </div>
                  </div>
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
                  ["diabetes1", "Diabetes1"],
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
            </>
          )}
        </div>

        {/* Secciones adicionales cuando BOROO está activado */}
        {form?.boroo && (
          <>
            {/* Otras Patologías */}
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-semibold">Otras Patologías:</span>
                <InputTextOneLine
                  name="otrasPatologias"
                  value={form?.otrasPatologias || ""}
                  onChange={() => {}}
                  className="flex-1"
                  placeholder="Especifique otras patologías..."
                />
              </div>
              
              <div className="flex items-center gap-4">
                <span className="font-semibold">Especifique detalles o tratamiento marcada:</span>
                <InputTextOneLine
                  name="detallesTratamiento"
                  value={form?.detallesTratamiento || ""}
                  onChange={() => {}}
                  className="flex-1"
                  placeholder="Detalles del tratamiento..."
                />
              </div>
            </div>

            {/* Alergias */}
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-semibold">Alergias a Medicamentos / Alimentos:</span>
                <InputsBooleanRadioGroup
                  name="alergiasMedicamentos"
                  value={form?.alergiasMedicamentos}
                  onChange={(e, value) => handleSiNoChange("alergiasMedicamentos", e, value)}
                  trueLabel="SI"
                  falseLabel="NO"
                />
                <span className="font-semibold">Especifique:</span>
                <InputTextOneLine
                  name="especifiqueAlergias"
                  value={form?.especifiqueAlergias || ""}
                  onChange={() => {}}
                  className="flex-1"
                  placeholder="Especifique las alergias..."
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
                        onChange={(e, value) => handleSiNoChange("accidenteTrabajo", e, value)}
                        trueLabel="SI"
                        falseLabel="NO"
                      />
                    </div>
                    
                    <div className=" text-gray-600 italic">
                      Si la Respuesta es SI, responder las líneas inferiores
                    </div>
                  </div>

                  {/* Tiempo perdido - solo si accidenteTrabajo es SI */}
                  {form?.accidenteTrabajo && (
                    <div className="ml-4 space-y-4 border-l-2 border-gray-200 pl-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-4">
                          <span className="font-semibold">fecha Accidente</span>
                          <InputTextOneLine
                            name="fechaAccidente"
                            type="date"
                            value={form?.fechaAccidente || ""}
                            onChange={() => {}}
                          />
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <span className="font-semibold">Hubo tiempo perdido (descanso médico):</span>
                          <InputsBooleanRadioGroup
                            name="tiempoPerdido"
                            value={form?.tiempoPerdido}
                            onChange={(e, value) => handleSiNoChange("tiempoPerdido", e, value)}
                            trueLabel="SI"
                            falseLabel="NO"
                          />
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <span className="font-semibold">Especifique</span>
                          <InputTextOneLine
                            name="especifiqueTiempoPerdido"
                            value={form?.especifiqueTiempoPerdido || ""}
                            onChange={() => {}}
                            className="flex-1"
                            placeholder="Especifique tiempo perdido..."
                          />
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <span className="font-semibold">T.Incapci.</span>
                          <InputTextOneLine
                            name="tipoIncapacidad"
                            value={form?.tipoIncapacidad || ""}
                            onChange={() => {}}
                            className="flex-1"
                            placeholder="Tipo de incapacidad..."
                          />
                        </div>
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
                        onChange={(e, value) => handleSiNoChange("enfermedadProfesional", e, value)}
                        trueLabel="SI"
                        falseLabel="NO"
                      />
                    </div>
                    
                    <div className=" text-gray-600 italic">
                      Si la Respuesta es SI, responder las líneas inferiores
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
                            onChange={(e, value) => handleSiNoChange("evaluadoCalificacion", e, value)}
                            trueLabel="SI"
                            falseLabel="NO"
                          />
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <span className="font-semibold">Especifique cual:</span>
                          <InputTextOneLine
                            name="especifiqueCalificacion"
                            value={form?.especifiqueCalificacion || ""}
                            onChange={() => {}}
                            className="flex-1"
                            placeholder="Especifique la calificación..."
                          />
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <span className="font-semibold">Fecha:</span>
                          <InputTextOneLine
                            name="fechaCalificacion"
                            type="date"
                            value={form?.fechaCalificacion || ""}
                            onChange={() => {}}
                          />
                        </div>
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
