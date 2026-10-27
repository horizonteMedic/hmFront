import InputsBooleanRadioGroup from "../../../../../components/reusableComponents/InputsBooleanRadioGroup";
import InputTextOneLine from "../../../../../components/reusableComponents/InputTextOneLine";
import SectionFieldset from "../../../../../components/reusableComponents/SectionFieldset";
import Casillas from "../Casillas";

// Casillas [campo, etiqueta] en columnas
const SINTOMAS = [
  [
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
  ],
  [
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
  ],
  [
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
  ],
];

const VACUNAS = [
  [
    ["antitetanica", "Antitetánica"],
    ["fiebreAmarilla", "Fiebre Amarilla"],
    ["influenza", "Influenza"],
    ["hepatitisA", "Hepatitis A"],
    ["hepatitisB", "Hepatitis B"],
  ],
  [
    ["gripeInfluenza", "Gripe/Influenza"],
    ["neumococo", "Neumococo"],
    ["rabia", "Rabia"],
    ["papilomaHumano", "Papiloma Humano"],
    ["covidAntecedentePatologico", "COVID-19"],
  ],
];

// Hábitos nocivos: casilla SI/NO + campos que dependen de ella. `atajos` agrega un texto frecuente al campo
// (unido con `separador` a lo que ya tenga).
const HABITOS = [
  {
    titulo: "Drogas",
    campo: "drogas",
    campos: [
      { name: "tipoDrogas", label: "Tipo más frecuente", atajos: [{ texto: "CHACCHA HOJA DE COCA", separador: " " }] },
      { name: "frecuenciaDrogas", label: "Frecuencia", atajos: [{ texto: "15 DÍAS X MES", separador: " " }] },
    ],
  },
  {
    titulo: "Licor",
    campo: "licor",
    campos: [
      {
        name: "tipoLicor",
        label: "Tipo más frecuente",
        atajos: ["RON", "CERVEZA", "VINO", "WISKY"].map((texto) => ({ texto, separador: ", " })),
      },
      { name: "frecuenciaLicor", label: "Frecuencia", atajos: [{ texto: "1 VEZ X MES", separador: " " }] },
    ],
  },
  {
    titulo: "Fumar",
    campo: "fumar",
    campos: [
      { name: "numeroCigarrillos", label: "Número de cigarrillos", atajos: [{ texto: "CIGARRILLOS X MES", separador: " " }] },
    ],
  },
  {
    titulo: "Otros",
    campo: "otros",
    campos: [
      { name: "tipoOtros", label: "Tipo más frecuente" },
      { name: "frecuenciaOtros", label: "Frecuencia" },
    ],
  },
];

export default function IndicarEnfermedades({
  form,
  setForm,
  handleChange,
  handleChangeNumber,
  handleCheckBoxChange,
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

  const agregarAtajo = (name, { texto, separador }) =>
    setForm((prev) => ({ ...prev, [name]: (prev[name] ? prev[name] + separador : "") + texto }));

  return (
    <div className="space-y-3">
      <SectionFieldset legend="Indicar las enfermedades que ha tenido o tiene, con cierta frecuencia" className="space-y-4">
        <Casillas
          columnas={SINTOMAS}
          form={form}
          onChange={handleCheckBoxChange}
          disabled={disabled}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          espacio="space-y-1"
        />
        <InputTextOneLine
          label="Otras enfermedades"
          name="otrasEnfermedades"
          value={form?.otrasEnfermedades}
          onChange={handleChange}
          disabled={disabled}
          labelWidth="120px"
          {...revertible("otrasEnfermedades")}
        />
      </SectionFieldset>

      {/* Antecedentes Inmunológicos / Vacunas */}
      <SectionFieldset legend="Antecedentes Inmunológicos / Vacunas" className="space-y-4">
        <Casillas
          columnas={VACUNAS}
          form={form}
          onChange={handleCheckBoxChange}
          disabled={disabled}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          espacio="space-y-1"
        />
        <InputTextOneLine
          label="Dosis de vacunas COVID-19"
          name="dosisVacunas"
          value={form?.dosisVacunas}
          onChange={handleChangeNumber}
          disabled={disabled || !form?.covidAntecedentePatologico}
          labelWidth="180px"
          {...revertible("dosisVacunas")}
        />
      </SectionFieldset>

      {/* Hábitos Nocivos */}
      <SectionFieldset legend="Hábitos Nocivos" className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {HABITOS.map(({ titulo, campo, campos }) => (
          <div key={campo} className="border border-gray-200 bg-white rounded-lg p-4 space-y-3">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="font-semibold min-w-[80px]">{titulo}</span>
              <InputsBooleanRadioGroup
                name={campo}
                value={form?.[campo]}
                disabled={disabled}
                onChange={(e, value) => {
                  if (value == false) {
                    setForm(prev => ({ ...prev, ...Object.fromEntries(campos.map(({ name }) => [name, ""])) }));
                  }
                  handleRadioButtonBoolean(e, value)
                }}
                {...revertible(campo, [campo, ...campos.map(({ name }) => name)])}
              />
            </div>
            {campos.map(({ name, label, atajos = [] }) => (
              <div key={name} className="w-full">
                <InputTextOneLine
                  label={label}
                  name={name}
                  value={form?.[name]}
                  onChange={handleChange}
                  disabled={disabled || !form?.[campo]}
                  labelWidth="140px"
                  {...revertible(name)}
                />
                {atajos.length > 0 && (
                  <div className="w-full flex flex-wrap justify-end mt-2 gap-2">
                    {atajos.map((atajo) => (
                      <button
                        key={atajo.texto}
                        type="button"
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-all disabled:bg-gray-500"
                        disabled={disabled || !form?.[campo]}
                        onClick={() => agregarAtajo(name, atajo)}
                      >
                        {atajo.texto}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </SectionFieldset>

      {/* Medicamentos y Actividad Física */}
      <SectionFieldset legend="Medicamentos y Actividad Física" className="space-y-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="font-semibold min-w-[140px]">Medicamentos:</span>
            <InputsBooleanRadioGroup
              name="medicamentos"
              value={form?.medicamentos}
              disabled={disabled}
              onChange={(e, value) => {
                if (value == false)
                  setForm(prev => ({ ...prev, especifiqueMedicamentos: "" }));
                handleRadioButtonBoolean(e, value)
              }}
              {...revertible("medicamentos", ["medicamentos", "especifiqueMedicamentos"])}
            />
          </div>
          <InputTextOneLine
            label="Especifique"
            name="especifiqueMedicamentos"
            value={form?.especifiqueMedicamentos}
            disabled={disabled || !form?.medicamentos}
            onChange={handleChange}
            labelWidth="140px"
            {...revertible("especifiqueMedicamentos")}
          />
        </div>

        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="font-semibold min-w-[140px]">Actividad Física:</span>
            <InputsBooleanRadioGroup
              name="actividadFisica"
              value={form?.actividadFisica}
              disabled={disabled}
              onChange={(e, value) => {
                if (value == false)
                  setForm(prev => ({ ...prev, especifiqueActividadFisica: "" }));
                handleRadioButtonBoolean(e, value)
              }}
              {...revertible("actividadFisica", ["actividadFisica", "especifiqueActividadFisica"])}
            />
          </div>
          <InputTextOneLine
            label="Especifique"
            name="especifiqueActividadFisica"
            value={form?.especifiqueActividadFisica}
            disabled={disabled || !form?.actividadFisica}
            onChange={handleChange}
            labelWidth="140px"
            {...revertible("especifiqueActividadFisica")}
          />
        </div>
      </SectionFieldset>
    </div>
  );
}
