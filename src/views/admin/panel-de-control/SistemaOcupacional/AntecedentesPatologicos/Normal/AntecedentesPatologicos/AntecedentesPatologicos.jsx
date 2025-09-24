/* eslint-disable react/prop-types */
import { InputCheckbox, InputTextOneLine } from "../../../../../../components/reusableComponents/ResusableComponents";

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

        <h1 className="font-semibold mb-3">1. ANTECEDENTES PATOLÓGICOS PERSONALES</h1>

        {/* Fecha y Severidad */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Fecha:</span>
            <InputTextOneLine 
              name="fechaEnfermedades" 
              type="date" 
              value={form?.fechaEnfermedades || ""} 
              onChange={() => {}} 
            />
          </div>
          <div className="flex items-center gap-4">
            <InputCheckbox 
              label="LEVE" 
              name="severidadLeve" 
              checked={!!form?.severidadLeve} 
              onChange={(e) => handleSiNoChange("severidadLeve", e, e.target.checked)} 
            />
            <InputCheckbox 
              label="MODERADO" 
              name="severidadModerado" 
              checked={!!form?.severidadModerado} 
              onChange={(e) => handleSiNoChange("severidadModerado", e, e.target.checked)} 
            />
            <InputCheckbox 
              label="SEVERO" 
              name="severidadSevero" 
              checked={!!form?.severidadSevero} 
              onChange={(e) => handleSiNoChange("severidadSevero", e, e.target.checked)} 
            />
          </div>
        </div>

        <div className="mb-2">
          Marcar todas las enfermedades que ha tenido o tiene
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
        </div>
      </div>
    </div>
  );
}
