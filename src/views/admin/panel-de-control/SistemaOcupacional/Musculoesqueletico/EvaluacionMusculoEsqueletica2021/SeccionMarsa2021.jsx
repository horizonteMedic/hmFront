import InputsRadioGroup from "../../../../../components/reusableComponents/InputsRadioGroup";
import InputCheckbox from "../../../../../components/reusableComponents/InputCheckbox";
import InputTextOneLine from "../../../../../components/reusableComponents/InputTextOneLine";
import SectionFieldset from "../../../../../components/reusableComponents/SectionFieldset";
import RadioTable from "../../../../../components/reusableComponents/RadioTable";

// Sección exclusiva de MARSA (empresa del N° de orden): descripción de las tareas + evaluación de columna vertebral
// y de articulaciones. Cuando es MARSA reemplaza las evaluaciones dinámicas de cadera/rodilla/tobillo (Parte 3 y 4):
// esas articulaciones usan las MISMAS variables del formulario; hombro, codo, muñeca y manos viven en `form.marsaMsk`.
// Diseño en tarjetas con grillas que se apilan en celular (sin tablas anchas).

const COLUMNAS = [["cervical", "Cervical"], ["dorsal", "Dorsal"], ["lumbar", "Lumbar"]];

const MOVIMIENTOS = [
  ["abduccion", "Abducc."], ["aduccion", "Adducc."], ["flexion", "Flexión"], ["extension", "Extens."],
  ["rotacionExterna", "Rot. Ext."], ["rotacionInterna", "Rot. Int."], ["irradiacion", "Irrad."],
  ["altMasaMuscular", "Alt. Masa Musc."],
];
const MOV_COLUMNA = [
  "Flexión", "Extensión", "Lateraliz. Der.", "Lateraliz. Izq.", "Rotación Der.", "Rotación Izq.", "Irradiación", "Alt. Masa Musc.",
];

// [clave, etiqueta, articulación del form (si ya existía), lado del form]
const ARTICULACIONES = [
  ["hombroDerecho", "Hombro derecho"], ["hombroIzquierdo", "Hombro izquierdo"],
  ["codoDerecho", "Codo derecho"], ["codoIzquierdo", "Codo izquierdo"],
  ["munecaDerecha", "Muñeca derecha"], ["munecaIzquierda", "Muñeca izquierda"],
  ["manosDerechas", "Manos y dedos derechos"], ["manosIzquierdas", "Manos y dedos izquierdos"],
  ["caderaDerecha", "Cadera derecha", "Cadera", "Derecha"], ["caderaIzquierda", "Cadera izquierda", "Cadera", "Izquierda"],
  ["rodillaDerecha", "Rodilla derecha", "Rodilla", "Derecha"], ["rodillaIzquierda", "Rodilla izquierda", "Rodilla", "Izquierda"],
  ["tobilloDerecho", "Tobillo derecho", "Tobillo", "Derecho"], ["tobilloIzquierdo", "Tobillo izquierdo", "Tobillo", "Izquierdo"],
];

// Nombre del campo de una articulación en el form (los de cadera/rodilla/tobillo ya existían: Parte 3 y 4)
const nombreForm = (mov, joint, lado) => `${mov}${joint}${lado}`;

const OPC_VALORACION = [
  { label: "APTO", value: "apto" },
  { label: "NO APTO", value: "noApto" },
  { label: "EN OBSERVACIÓN", value: "observacion" },
];

export const MARSA_MSK_INICIAL = {
  valoracion: "", // apto | noApto | observacion
  horasDia: "",
  tiempoTarea: "", // esporadico | continuo2a4 | continuo4
  movHombro: false,
  movPronosupinacion: false,
  repetidas: false,
  contraResistencia: false,
  posturasForzadas: false,
  ciclo: "", // largo | moderado | corto
  carga: "", // menor1 | entre1y3 | mayor3
  ...Object.fromEntries(COLUMNAS.flatMap(([c]) => [
    [`${c}Lateral`, ""], // normal | concavidadDerecha | concavidadIzquierda
    [`${c}AnteroPosterior`, ""], // normal | aumentada | disminuida
    [`${c}Apofisis`, false],
    [`${c}Contractura`, false],
    ...MOV_COLUMNA.map((_, i) => [`${c}Din${i}`, "0"]),
  ])),
  // Solo las articulaciones nuevas (las demás usan las variables existentes del form)
  ...Object.fromEntries(
    ARTICULACIONES.filter(([, , j]) => !j).flatMap(([k]) => MOVIMIENTOS.map(([m]) => [`${k}_${m}`, "0"]))
  ),
  // Descripción de hallazgos: un campo por grado (0 a 4)
  ...Object.fromEntries([0, 1, 2, 3, 4].map((i) => [`hallazgoGrado${i}`, ""])),
};

const GRADOS = [
  "Grado 0 Ausencia de signos y síntomas",
  "Grado 1 Contractura y/o dolor a la movilización",
  "Grado 2 Grado 1 más dolor a la palpación y/o percusión",
  "Grado 3 Grado 2 más limitación funcional evidente clínicamente",
  "Grado 4 Dolor en reposo",
];

const OPC_TIEMPO = [
  { label: "Esporádico: < 2 horas", value: "esporadico" },
  { label: "Continuo: > 2 horas y < 4 horas", value: "continuo2a4" },
  { label: "Continuo: > 4 horas", value: "continuo4" },
];
const OPC_CICLO = [
  { label: "Largo: > a 2 minutos", value: "largo" },
  { label: "Moderado: 30 segundos - 1 a 2 minutos", value: "moderado" },
  { label: "Corto: hasta 30 segundos", value: "corto" },
];
const OPC_CARGA = [
  { label: "< de 1 Kg", value: "menor1" },
  { label: "Entre 1 Kg y 3 Kg", value: "entre1y3" },
  { label: "> de 3 Kg", value: "mayor3" },
];
const OPC_LATERAL = [
  { label: "Normal", value: "normal" },
  { label: "Concavidad derecha", value: "concavidadDerecha" },
  { label: "Concavidad izquierda", value: "concavidadIzquierda" },
];
// Filas de RadioTable: una por segmento de columna (el nombre es la clave en `marsaMsk`)
const ITEMS_COLUMNA = (tipo) => COLUMNAS.map(([c, nombre]) => ({ name: `${c}${tipo}`, label: `Columna ${nombre.toLowerCase()}` }));
const OPC_ANTERO = [
  { label: "Normal", value: "normal" },
  { label: "Aumentada", value: "aumentada" },
  { label: "Disminuida", value: "disminuida" },
];

export default function SeccionMarsa2021({ form, setForm, handleChange, handleFocusNext, esMarsa, disabled }) {
  const bloqueado = disabled || !esMarsa;
  const d = { ...MARSA_MSK_INICIAL, ...(form.marsaMsk || {}) };
  const set = (campo, valor) =>
    setForm((f) => ({ ...f, marsaMsk: { ...MARSA_MSK_INICIAL, ...(f.marsaMsk || {}), [campo]: valor } }));

  const radio = (campo, options, label) => (
    <InputsRadioGroup
      name={`marsa_${campo}`}
      label={label}
      labelOnTop
      vertical
      allowUncheck
      options={options}
      value={d[campo]}
      onChange={(_, v) => set(campo, v)}
      disabled={bloqueado}
    />
  );
  const check = (campo, label) => (
    <InputCheckbox label={label} name={`marsa_${campo}`} checked={d[campo]} disabled={bloqueado}
      onChange={(e) => set(campo, e.target.checked)} />
  );
  const texto = (campo, label) => (
    <InputTextOneLine key={campo} name={`marsa_${campo}`} label={label} labelOnTop labelClassName="text-xs"
      placeholder="Grado" inputMode="numeric" disabled={bloqueado} value={d[campo]}
      onChange={(e) => set(campo, e.target.value)} />
  );

  return (
    <div className="space-y-4 text-[12px]">
      {!esMarsa && (
        <p className="p-2 rounded border border-amber-300 bg-amber-50 text-amber-800 text-sm">
          {form?.empresa ? (
            <>Esta sección solo se llena para la empresa MARSA. La empresa de este N° de orden es <span className="font-semibold">{form.empresa}</span>.</>
          ) : (
            "Esta sección solo se llena para la empresa MARSA: busque un N° de orden de esa empresa para habilitarla."
          )}
        </p>
      )}

      {/* ===== DESCRIPCIÓN DE LAS TAREAS ===== */}
      <SectionFieldset legend="DESCRIPCIÓN DE LAS TAREAS (ACTIVIDADES RELACIONADAS AL PUESTO DE TRABAJO)" className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <InputTextOneLine name="marsa_horasDia" label="Horas/día en el trabajo" stackOnMobile labelWidth="170px"
              inputMode="numeric" disabled={bloqueado} value={d.horasDia} onChange={(e) => set("horasDia", e.target.value)} />
            {radio("tiempoTarea", OPC_TIEMPO, "Tiempo de tarea")}
          </div>
          <div className="space-y-2">
            <span className="font-semibold">Tiempo de tarea :</span>
            {check("movHombro", "Movimiento de hombro y cintura escapular")}
            {check("movPronosupinacion", "Movimiento de pronosupinación en codo y/o muñeca")}
            {check("repetidas", "Repetidas extensiones y flexiones de muñeca")}
            {check("contraResistencia", "Trabajos contra resistencia")}
            {check("posturasForzadas", "Otros: POSTURAS FORZADAS")}
          </div>
          {radio("ciclo", OPC_CICLO, "Ciclo de trabajo")}
          {radio("carga", OPC_CARGA, "Manipulación manual de cargas")}
        </div>
      </SectionFieldset>

      {/* ===== COLUMNA VERTEBRAL ===== */}
      <SectionFieldset legend="COLUMNA VERTEBRAL - EVALUACIÓN ESTÁTICA" className="space-y-4">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <RadioTable
            items={ITEMS_COLUMNA("Lateral")}
            options={OPC_LATERAL}
            form={d}
            handleRadioButton={(e, v) => set(e.target.name, v)}
            groupLabel="Desviaciones del eje lateral"
            labelColumns={2}
            disabled={bloqueado}
            stackOnMobile
          />
          <RadioTable
            items={ITEMS_COLUMNA("AnteroPosterior")}
            options={OPC_ANTERO}
            form={d}
            handleRadioButton={(e, v) => set(e.target.name, v)}
            groupLabel="Desviación del eje antero-posterior"
            labelColumns={2}
            disabled={bloqueado}
            stackOnMobile
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {COLUMNAS.map(([c, nombre]) => (
            <div key={c} className="space-y-2">
              <span className="font-semibold">Palpación - {nombre} :</span>
              {check(`${c}Apofisis`, "Apóf. espinosas dolorosas")}
              {check(`${c}Contractura`, "Contractura muscular")}
            </div>
          ))}
        </div>
      </SectionFieldset>

      <SectionFieldset legend="COLUMNA VERTEBRAL - EVALUACIÓN DINÁMICA (MOVILIDAD - DOLOR)" className="space-y-3">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white">
            <thead>
              <tr className="border-b-2 border-blue-900">
                <th className="text-left py-2 px-2 font-semibold text-blue-900 sticky left-0 bg-white">Columna</th>
                {MOV_COLUMNA.map((m) => (
                  <th key={m} className="text-center py-2 px-1 font-semibold text-blue-900 text-[11px] min-w-[78px]">{m}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COLUMNAS.map(([c, nombre]) => (
                <tr key={c} className="border-b">
                  <td className="py-2 px-2 font-medium sticky left-0 bg-white">{nombre}</td>
                  {MOV_COLUMNA.map((m, i) => (
                    <td key={i} className="py-1 px-1">
                      <input
                        type="text"
                        inputMode="numeric"
                        name={`marsa_${c}Din${i}`}
                        aria-label={`${nombre} - ${m}`}
                        placeholder="Grado"
                        className={`w-full border rounded px-1 py-1 text-center ${bloqueado ? "bg-gray-300" : ""}`}
                        disabled={bloqueado}
                        onKeyDown={handleFocusNext}
                        value={d[`${c}Din${i}`]}
                        onChange={(e) => set(`${c}Din${i}`, e.target.value)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionFieldset>

      {/* ===== EVALUACIÓN DINÁMICA DE ARTICULACIONES ===== */}
      <SectionFieldset legend="EVALUACIÓN DINÁMICA DE ARTICULACIONES (MOVILIDAD - DOLOR)" className="space-y-3">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white">
            <thead>
              <tr className="border-b-2 border-blue-900">
                <th className="text-left py-2 px-2 font-semibold text-blue-900 sticky left-0 bg-white min-w-[130px]">Articulación</th>
                {MOVIMIENTOS.map(([m, ml]) => (
                  <th key={m} className="text-center py-2 px-1 font-semibold text-blue-900 text-[11px] min-w-[78px]">{ml}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ARTICULACIONES.map(([k, label, joint, lado]) => (
                <tr key={k} className="border-b">
                  <td className="py-2 px-2 font-medium sticky left-0 bg-white">{label}</td>
                  {MOVIMIENTOS.map(([m, ml]) => {
                    // Cadera/rodilla/tobillo usan las variables existentes del form; el resto vive en marsaMsk
                    const name = joint ? nombreForm(m, joint, lado) : `marsa_${k}_${m}`;
                    const valor = joint ? form[name] : d[`${k}_${m}`];
                    // Rodilla: abducción y aducción no se evalúan (siguen vacías y bloqueadas)
                    const rodillaBloqueada = joint === "Rodilla" && (m === "abduccion" || m === "aduccion");
                    const off = bloqueado || rodillaBloqueada;
                    return (
                      <td key={m} className="py-1 px-1">
                        <input
                          type="text"
                          inputMode="numeric"
                          name={name}
                          aria-label={`${label} - ${ml}`}
                          placeholder="Grado"
                          className={`w-full border rounded px-1 py-1 text-center ${off ? "bg-gray-300" : ""}`}
                          disabled={off}

                          onKeyDown={handleFocusNext}
                          value={valor ?? ""}
                          onChange={joint ? handleChange : (e) => set(`${k}_${m}`, e.target.value)}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionFieldset>

      {/* ===== PUNTUACIÓN DE REFERENCIA / DESCRIPCIÓN DE HALLAZGOS (un campo por grado) ===== */}
      <SectionFieldset legend="PUNTUACIÓN DE REFERENCIA (SIGNOS Y SÍNTOMAS) - DESCRIPCIÓN DE HALLAZGOS" className="space-y-2">
        <div className="hidden md:grid grid-cols-2 gap-3 font-semibold text-center">
          <span>Puntuación de referencia</span>
          <span>Descripción de hallazgos</span>
        </div>
        {GRADOS.map((texto, i) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-3 md:items-center">
            <span className="font-medium">{texto}</span>
            <InputTextOneLine name={`marsa_hallazgoGrado${i}`} disabled={bloqueado} onKeyDown={handleFocusNext} placeholder="Descripción de hallazgos"
              value={d[`hallazgoGrado${i}`]} onChange={(e) => set(`hallazgoGrado${i}`, e.target.value)} />
          </div>
        ))}
      </SectionFieldset>

      {/* ===== VALORACIÓN ===== */}
      <SectionFieldset legend="VALORACIÓN" className="space-y-3">
        <InputsRadioGroup
          name="marsa_valoracion"
          options={OPC_VALORACION}
          allowUncheck
          value={d.valoracion}
          onChange={(_, v) => set("valoracion", v)}
          disabled={bloqueado}
        />
      </SectionFieldset>
    </div>
  );
}
