import InputCheckbox from "../../../../../components/reusableComponents/InputCheckbox";
import InputsBooleanRadioGroup from "../../../../../components/reusableComponents/InputsBooleanRadioGroup";
import InputsRadioGroup from "../../../../../components/reusableComponents/InputsRadioGroup";
import InputTextOneLine from "../../../../../components/reusableComponents/InputTextOneLine";
import SectionFieldset from "../../../../../components/reusableComponents/SectionFieldset";
import { getToday } from "../../../../../utils/helpers";
import Casillas from "../Casillas";

// Casillas [campo, etiqueta] en columnas (orden alfabético vertical)
const AGENTES = [
  [
    ["alturaEstruct", "Altura Estruct."],
    ["alturaGeograf", "Altura Geograf."],
    ["biologicos", "Biológicos"],
    ["cancerigenos", "Cancerígenos"],
    ["cargas", "Cargas"],
    ["electricos", "Electricos"],
    ["metales", "Metales"],
  ],
  [
    ["movRepet", "Mov. Repet"],
    ["mutagenicos", "Mutagenicos"],
    ["otrosAgentes", "Otros"],
    ["polvo", "Polvo"],
    ["posturas", "Posturas"],
    ["pvd", "PVD"],
    ["quimicos", "Químicos"],
  ],
  [
    ["ruido", "Ruido"],
    ["solventes", "Solventes"],
    ["temperaturaAgente", "Temperatura"],
    ["turnos", "Turnos"],
    ["vibraciones", "Vibraciones"],
    ["vidSegmentario", "Vid Segmentario"],
    ["vidTotal", "Vid Total"],
  ],
];

const ENFERMEDADES = [
  [
    ["acv", "ACV (Acc. Cerebro Vascular)"],
    ["alergias", "Alergias"],
    ["amigdalitisCronica", "Amigdalitis crónica"],
    ["amputacion", "Amputación"],
    ["anemia", "Anemia"],
    ["arritmiasCardiacas", "Arritmias cardiacas"],
    ["asma", "Asma"],
    ["bocio", "Bocio"],
    ["bronconeumonia", "Bronconeumonía"],
    ["bronquitisRepeticion", "Bronquitis a repetición"],
    ["cariesGingivitis", "Caries o gingivitis"],
    ["colecistitis", "Colecistitis"],
    ["columna", "Columna"],
    ["dermatitis", "Dermatitis"],
    ["diabetes", "Diabetes"],
    ["discopatias", "Discopatías"],
    ["dislipidemia", "Dislipidemia"],
    ["disenteria", "Disentería"],
    ["enfCorazon", "Enfermedades del corazón"],
    ["enfOculares", "Enf. Oculares"],
    ["enfPiel", "Enf de la Piel"],
    ["enfPsiquiatricas", "Enf Psiquiátricas"],
    ["enfPulmonares", "Enf Pulmonares"],
    ["enfReumatica", "Enf Reumática"],
    ["epilepsiaConvulsiones", "Epilepsia o convulsiones"],
    ["ets", "ETS"],
    ["faringitisCronica", "Faringitis crónica"],
    ["fiebreMalta", "Fiebre malta"],
  ],
  [
    ["fiebreReumatica", "Fiebre Reumática"],
    ["fiebreTifoidea", "Fiebre tifoidea"],
    ["fobias", "Fobias"],
    ["forunculosis", "Forunculosis"],
    ["fracturas", "Fracturas"],
    ["gastritisCronica", "Gastritis crónica"],
    ["gonorrea", "Gonorrea"],
    ["gota", "Gota"],
    ["hemorroides", "Hemorroides"],
    ["hepatitis", "Hepatitis"],
    ["hernias", "Hernias"],
    ["hipertensionArterial", "Hipertensión Arterial"],
    ["ima", "IMA (Infarto agudo al miocardio)"],
    ["infUrinariasRepetidas", "Inf. Urinarias repetidas"],
    ["insuficienciaCardiaca", "Insuficiencia Cardíaca"],
    ["insuficienciaCoronariaCronica", "Insuficiencia Coronaria Crónica"],
    ["insuficienciaRenalCronica", "Insuficiencia Renal Crónica"],
    ["intoxicaciones", "Intoxicaciones"],
    ["litiasisUrinaria", "Litiasis Urinaria"],
    ["meningitis", "Meningitis"],
    ["migrana", "Migraña"],
    ["neoplasias", "Neoplasias"],
    ["neuritisRepeticion", "Neuritis a Repetición"],
    ["obesidad", "Obesidad"],
    ["onicomicosis", "Onicomicosis"],
    ["otitisMedia", "Otitis Media"],
    ["paludismoMalaria", "Paludismo o malaria"],
    ["parasitosisIntestinal", "Parasitosis Intestinal"],
    ["parotiditis", "Parotiditis"],
  ],
  [
    ["pleuresia", "Pleuresia"],
    ["plumbismo", "Plumbismo"],
    ["poliomielitis", "Poliomielitis"],
    ["portadorMarcapaso", "Portador de Marcapaso"],
    ["presionAltaBaja", "Presión alta o baja"],
    ["protesisCardiacasValvulares", "Prótesis Cardiacas Valvulares"],
    ["quemaduras", "Quemaduras"],
    ["resfriosFrecuentes", "Resfríos frecuentes"],
    ["reumatismoRepeticion", "Reumatismo a repetición"],
    ["sarampion", "Sarampión"],
    ["sifilis", "Sífilis"],
    ["silicosis", "Silicosis"],
    ["sinusitisCronica", "Sinusitis crónica"],
    ["sordera", "Sordera"],
    ["tbc", "TBC"],
    ["tendinitis", "Tendinitis"],
    ["tifoidea", "Tifoidea"],
    ["tosConvulsiva", "Tos convulsiva"],
    ["trastornosNerviosos", "Trastornos Nerviosos"],
    ["traumatismoEncefalocraneano", "Traumatismo encefalocraneano"],
    ["tuberculosis", "Tuberculosis"],
    ["tumoresQuistes", "Tumores - quistes"],
    ["ulceraPeptica", "Ulcera péptica"],
    ["varicela", "Varicela"],
    ["varices", "Várices"],
    ["varicocele", "Varicocele"],
    ["vertigos", "Vértigos"],
    ["vih", "VIH"],
  ],
];

export default function AntecedentesPatologicosTab({
  form,
  setForm,
  handleChange,
  handleCheckBoxChange,
  handleChangeSimple,
  handleRadioButton,
  handleRadioButtonBoolean,
  disabled = false,
  isFieldEdited = () => false,
  revertFields = () => { },
}) {
  // Resaltado + botón de revertir de un campo; `grupo` revierte además los campos que dependen de él
  const revertible = (campo, grupo = [campo]) => ({
    edited: isFieldEdited(campo),
    onRevert: () => revertFields(grupo),
  });

  return (
    <div className="space-y-3">
      <SectionFieldset legend="1. Antecedentes Patológicos Personales" className="space-y-4">
        {/* COVID 19, Fecha y Severidad */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <InputCheckbox
            label="COVID 19"
            name="covid19"
            checked={form?.covid19}
            disabled={disabled}
            onChange={(e) => {
              const today = getToday();
              setForm(prev => ({
                ...prev,
                severidadCovid: "",
                fechaCovid: today,
              }));
              handleCheckBoxChange(e)
            }}
          />
          <InputTextOneLine
            label="Fecha"
            name="fechaCovid"
            type="date"
            value={form?.fechaCovid}
            onChange={handleChangeSimple}
            disabled={disabled || !form?.covid19}
            {...revertible("fechaCovid")}
          />
          <InputsRadioGroup
            name="severidadCovid"
            value={form?.severidadCovid}
            disabled={disabled || !form?.covid19}
            options={[
              { label: "Leve", value: "LEVE" },
              { label: "Moderada", value: "MODERADA" },
              { label: "Severa", value: "SEVERA" },
            ]}
            onChange={handleRadioButton}
            {...revertible("severidadCovid")}
          />
        </div>

        <div className="font-semibold text-red-600">
          Marcar todas las enfermedades que ha tenido o tiene
        </div>

        <fieldset className="bg-white border border-gray-200 rounded-lg p-3">
          <legend className="font-bold mb-3 text-[10px]">
            Agentes presentes en Trabajo Actual
          </legend>
          <Casillas columnas={AGENTES} form={form} onChange={handleCheckBoxChange} disabled={disabled} />
        </fieldset>

        <fieldset className="bg-white border border-gray-200 rounded-lg p-3">
          <Casillas columnas={ENFERMEDADES} form={form} onChange={handleCheckBoxChange} disabled={disabled} />
        </fieldset>
      </SectionFieldset>

      <SectionFieldset legend="Otras Patologías y Alergias" className="space-y-4">
        <InputTextOneLine
          label="Otras Patologías"
          name="otrasPatologias"
          value={form?.otrasPatologias}
          onChange={handleChange}
          disabled={disabled}
          labelWidth="200px"
          {...revertible("otrasPatologias")}
        />
        <InputTextOneLine
          label="Especifique detalles o tratamiento marcada"
          name="detallesTratamiento"
          value={form?.detallesTratamiento}
          onChange={handleChange}
          disabled={disabled}
          labelWidth="200px"
          {...revertible("detallesTratamiento")}
        />

        {/* Alergias */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="font-semibold min-w-[200px]">Alergias a Medicamentos / Alimentos:</span>
          <InputsBooleanRadioGroup
            name="alergiasMedicamentos"
            value={form?.alergiasMedicamentos}
            disabled={disabled}
            onChange={(e, value) => {
              if (value == false)
                setForm(prev => ({ ...prev, especifiqueAlergias: "" }));
              handleRadioButtonBoolean(e, value)
            }}
            {...revertible("alergiasMedicamentos", ["alergiasMedicamentos", "especifiqueAlergias"])}
          />
          <InputTextOneLine
            label="Especifique"
            name="especifiqueAlergias"
            value={form?.especifiqueAlergias}
            onChange={handleChange}
            disabled={disabled || !form?.alergiasMedicamentos}
            className="w-full"
            {...revertible("especifiqueAlergias")}
          />
        </div>
      </SectionFieldset>

      {/* Accidente y Enfermedad Profesional - Dos columnas */}
      <SectionFieldset legend="Accidente de Trabajo y Enfermedad Profesional" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Columna 1 - Accidente relacionado al trabajo */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="font-semibold">Ha sufrido algún accidente relacionado al trabajo:</span>
            <InputsBooleanRadioGroup
              name="accidenteTrabajo"
              value={form?.accidenteTrabajo}
              disabled={disabled}
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
              {...revertible("accidenteTrabajo", ["accidenteTrabajo", "fechaAccidente", "tiempoPerdido", "especifiqueTiempoPerdido", "tipoIncapacidad"])}
            />
          </div>

          {/* Tiempo perdido - solo si accidenteTrabajo es SI */}
          {form?.accidenteTrabajo && (
            <div className="ml-4 space-y-2 border-l-2 border-gray-200 pl-4">
              <InputTextOneLine
                label="Fecha Accidente"
                name="fechaAccidente"
                type="date"
                value={form?.fechaAccidente}
                onChange={handleChangeSimple}
                disabled={disabled}
                labelWidth="120px"
                {...revertible("fechaAccidente")}
              />
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="font-semibold">Hubo tiempo perdido (descanso médico):</span>
                <InputsBooleanRadioGroup
                  name="tiempoPerdido"
                  value={form?.tiempoPerdido}
                  disabled={disabled}
                  onChange={(e, value) => {
                    if (value == false)
                      setForm(prev => ({ ...prev, especifiqueTiempoPerdido: "", tipoIncapacidad: "" }));
                    handleRadioButtonBoolean(e, value)
                  }}
                  {...revertible("tiempoPerdido", ["tiempoPerdido", "especifiqueTiempoPerdido", "tipoIncapacidad"])}
                />
              </div>
              <InputTextOneLine
                label="Especifique"
                name="especifiqueTiempoPerdido"
                value={form?.especifiqueTiempoPerdido}
                onChange={handleChange}
                disabled={disabled || !form?.tiempoPerdido}
                labelWidth="120px"
                {...revertible("especifiqueTiempoPerdido")}
              />
              <InputTextOneLine
                label="Tipo de Incapacidad"
                name="tipoIncapacidad"
                value={form?.tipoIncapacidad}
                onChange={handleChange}
                disabled={disabled || !form?.tiempoPerdido}
                labelWidth="120px"
                {...revertible("tipoIncapacidad")}
              />
            </div>
          )}
        </div>

        {/* Columna 2 - Enfermedad profesional */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="font-semibold">Ha sido declarado con alguna enfermedad profesional o relacionada al trabajo:</span>
            <InputsBooleanRadioGroup
              name="enfermedadProfesional"
              value={form?.enfermedadProfesional}
              disabled={disabled}
              onChange={(e, value) => {
                const today = getToday();
                if (value == false)
                  setForm(prev => ({ ...prev, evaluadoCalificacion: false, especifiqueCalificacion: "", fechaCalificacion: today }));
                handleRadioButtonBoolean(e, value)
              }}
              {...revertible("enfermedadProfesional", ["enfermedadProfesional", "evaluadoCalificacion", "especifiqueCalificacion", "fechaCalificacion"])}
            />
          </div>

          {/* Evaluación para calificación - solo si enfermedadProfesional es SI */}
          {form?.enfermedadProfesional && (
            <div className="ml-4 space-y-2 border-l-2 border-gray-200 pl-4">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="font-semibold">Ha sido evaluado para calificación de enfermedad laboral:</span>
                <InputsBooleanRadioGroup
                  name="evaluadoCalificacion"
                  value={form?.evaluadoCalificacion}
                  disabled={disabled}
                  onChange={(e, value) => {
                    const today = getToday();
                    if (value == false)
                      setForm(prev => ({ ...prev, especifiqueCalificacion: "", fechaCalificacion: today }));
                    handleRadioButtonBoolean(e, value)
                  }}
                  {...revertible("evaluadoCalificacion", ["evaluadoCalificacion", "especifiqueCalificacion", "fechaCalificacion"])}
                />
              </div>
              <InputTextOneLine
                label="Especifique cual"
                name="especifiqueCalificacion"
                value={form?.especifiqueCalificacion}
                onChange={handleChange}
                disabled={disabled || !form?.evaluadoCalificacion}
                labelWidth="120px"
                {...revertible("especifiqueCalificacion")}
              />
              <InputTextOneLine
                label="Fecha"
                name="fechaCalificacion"
                type="date"
                value={form?.fechaCalificacion}
                onChange={handleChangeSimple}
                disabled={disabled || !form?.evaluadoCalificacion}
                labelWidth="120px"
                {...revertible("fechaCalificacion")}
              />
            </div>
          )}
        </div>
      </SectionFieldset>
    </div>
  );
}
