import { ComoResponder, Opt } from "./NordicoUI";

/**
 * Mapa de zonas del cuerpo. Cada entrada conserva EXACTAMENTE los nombres de
 * campo del `form` original: la casilla de presencia (par No/Sí o las 4 opciones
 * derecha/izquierda/ambos), la clave que deshabilita las sub-preguntas (`dis`)
 * y los pares No/Sí de las dos sub-preguntas (q1 = impedimento de rutinas,
 * q2 = molestias en los últimos 7 días).
 */
const ZONAS = [
  {
    label: "Cuello",
    hint: "",
    presencia: { tipo: "sino", grupo: ["cuelloNo", "cuelloSi"], no: "cuelloNo", si: "cuelloSi" },
    dis: "cuelloNo",
    q1: { no: "pregunta1CuelloNo", si: "pregunta1CuelloSi" },
    q2: { no: "pregunta2CuelloNo", si: "pregunta2CuelloSi" },
  },
  {
    label: "Hombros",
    hint: "Derecho, izquierdo o ambos",
    presencia: {
      tipo: "multi",
      grupo: ["hombrosNo", "hombroDerechoSi", "hombroIzquierdoSi", "ambosHombrosSi"],
      opciones: [
        { code: "hombrosNo", label: "No" },
        { code: "hombroDerechoSi", label: "Sí, en el hombro derecho" },
        { code: "hombroIzquierdoSi", label: "Sí, en el hombro izquierdo" },
        { code: "ambosHombrosSi", label: "Sí, en ambos hombros" },
      ],
    },
    dis: "hombrosNo",
    q1: { no: "pregunta1HombrosNo", si: "pregunta1HombrosSi" },
    q2: { no: "pregunta2HombrosNo", si: "pregunta2HombrosSi" },
  },
  {
    label: "Codos",
    hint: "Derecho, izquierdo o ambos",
    presencia: {
      tipo: "multi",
      grupo: ["codosNo", "codoDerechoSi", "codoIzquierdoNo", "ambosCodosSi"],
      opciones: [
        { code: "codosNo", label: "No" },
        { code: "codoDerechoSi", label: "Sí, en el codo derecho" },
        { code: "codoIzquierdoNo", label: "Sí, en el codo izquierdo" },
        { code: "ambosCodosSi", label: "Sí, en ambos codos" },
      ],
    },
    dis: "codosNo",
    q1: { no: "pregunta1CodosNo", si: "pregunta1CodosSi" },
    q2: { no: "pregunta2CodosNo", si: "pregunta2CodosSi" },
  },
  {
    label: "Muñeca / mano",
    hint: "Derecha, izquierda o ambas",
    presencia: {
      tipo: "multi",
      grupo: ["munecaNo", "munecaDerechaSi", "munecaIzquierdaSi", "ambasMunecasSi"],
      opciones: [
        { code: "munecaNo", label: "No" },
        { code: "munecaDerechaSi", label: "Sí, en la muñeca/mano derecha" },
        { code: "munecaIzquierdaSi", label: "Sí, en la muñeca/mano izquierda" },
        { code: "ambasMunecasSi", label: "Sí, en ambas muñecas/manos" },
      ],
    },
    dis: "munecaNo",
    q1: { no: "pregunta1MunecasNo", si: "pregunta1MunecasSi" },
    q2: { no: "pregunta2MunecasNo", si: "pregunta2MunecasSi" },
  },
  {
    label: "Espalda alta (tórax)",
    hint: "",
    presencia: {
      tipo: "sino",
      grupo: ["espaldaAltaToraxNo", "espaldaAltaToraxSi"],
      no: "espaldaAltaToraxNo",
      si: "espaldaAltaToraxSi",
    },
    dis: "espaldaAltaToraxNo",
    q1: { no: "pregunta1EspaldaAltaToraxNo", si: "pregunta1EspaldaAltaToraxSi" },
    q2: { no: "pregunta2EspaldaAltaToraxNo", si: "pregunta2EspaldaAltaToraxSi" },
  },
  {
    label: "Espalda baja (región lumbar)",
    hint: "",
    presencia: {
      tipo: "sino",
      grupo: ["espaldaBajaLumbarNo", "espaldaBajaLumbarSi"],
      no: "espaldaBajaLumbarNo",
      si: "espaldaBajaLumbarSi",
    },
    dis: "espaldaBajaLumbarNo",
    q1: { no: "pregunta1EspaldaBajaLumbarNo", si: "pregunta1EspaldaBajaLumbarSi" },
    q2: { no: "pregunta2EspaldaBajaLumbarNo", si: "pregunta2EspaldaBajaLumbarSi" },
  },
  {
    label: "Una o ambas caderas / muslos",
    hint: "",
    presencia: {
      tipo: "sino",
      grupo: ["caderasOMuslosNo", "caderasOMuslosSi"],
      no: "caderasOMuslosNo",
      si: "caderasOMuslosSi",
    },
    dis: "caderasOMuslosNo",
    q1: { no: "pregunta1CaderasOMuslosNo", si: "pregunta1CaderasOMuslosSi" },
    q2: { no: "pregunta2CaderasOMuslosNo", si: "pregunta2CaderasOMuslosSi" },
  },
  {
    label: "Una o ambas rodillas",
    hint: "",
    presencia: {
      tipo: "sino",
      grupo: ["rodillasNo", "rodillasSi"],
      no: "rodillasNo",
      si: "rodillasSi",
    },
    dis: "rodillasNo",
    q1: { no: "pregunta1RodillasNo", si: "pregunta1RodillasSi" },
    q2: { no: "pregunta2RodillasNo", si: "pregunta2RodillasSi" },
  },
  {
    label: "Uno o ambos tobillos / pies",
    hint: "",
    presencia: {
      tipo: "sino",
      grupo: ["tobillosOPiesNo", "tobillosOPiesSi"],
      no: "tobillosOPiesNo",
      si: "tobillosOPiesSi",
    },
    dis: "tobillosOPiesNo",
    q1: { no: "pregunta1TobillosOPiesNo", si: "pregunta1TobillosOPiesSi" },
    q2: { no: "pregunta2TobillosOPiesNo", si: "pregunta2TobillosOPiesSi" },
  },
];

// const GUIA_ZONAS = [
//   "Cuello",
//   "Hombros",
//   "Codos",
//   "Muñecas / manos",
//   "Espalda alta",
//   "Espalda baja",
//   "Caderas / muslos",
//   "Rodillas",
//   "Tobillos / pies",
// ];

// Plantilla de columnas de la tabla: zona · últimos 12 meses · impedimento · últimos 7 días.
// IMPORTANTE: las clases se escriben LITERALES y completas. Tailwind (build) solo
// genera las clases que encuentra tal cual en el código; `md:${variable}` NO se
// genera. Por eso hay dos constantes: una con prefijo `md:` (filas del cuerpo) y
// otra sin prefijo (cabecera, que ya vive dentro de un contenedor `hidden md:block`).
const COL_GRID =
  "md:grid md:grid-cols-[1.1fr_1.9fr_1.25fr_1.25fr] md:items-center md:gap-x-[16px]";
const HEADER_GRID = "grid grid-cols-[1.1fr_1.9fr_1.25fr_1.25fr] gap-x-[16px]";

const Responder = ({ form, setForm }) => {
  const handleInputChangeCheckedGroup = (e, group) => {
    const { name } = e.target;
    setForm((prev) => {
      const newForm = { ...prev };

      if (prev[name]) {
        // Si ya estaba activo, lo desmarcamos
        newForm[name] = false;
      } else {
        // Desmarcar todos los del grupo recibido
        group.forEach((code) => (newForm[code] = false));

        // Activar solo el seleccionado
        newForm[name] = true;
      }

      return newForm;
    });
  };

  const parNoSi = (par, disabled) => (
    <>
      <Opt
        label="No"
        name={par.no}
        checked={form[par.no]}
        disabled={disabled}
        onChange={(e) => handleInputChangeCheckedGroup(e, [par.no, par.si])}
      />
      <Opt
        label="Sí"
        name={par.si}
        checked={form[par.si]}
        disabled={disabled}
        onChange={(e) => handleInputChangeCheckedGroup(e, [par.no, par.si])}
      />
    </>
  );

  return (
    <div className="text-xl text-gray-700">
      {/* ===== 02-A · Guía corporal ===== */}
      <div id="nordico-sec-2-guia" className="scroll-mt-[70px]">
        <ComoResponder
          titulo="¿Cómo responder este cuestionario?"
          img="img/Nordico/nordico.png"
          imgAlt="Mapa de las partes del cuerpo"
        >
          <p>
            En este dibujo Ud. puede ver la posición aproximada de las partes
            del cuerpo referidos en el cuestionario.
          </p>
          <p>
            Ud. debe decidir cuál parte tiene o ha tenido molestias / problema
            (si lo ha tenido), por favor responda poniendo una x en el
            respectivo recuadro para cada pregunta.
          </p>
          {/* <p>
            Ha tenido Ud. durante cualquier tiempo en los últimos 12 meses
            problemas (molestias, dolor o disconfort). Use la figura para
            identificar cada parte del cuerpo y, en la tabla siguiente, indique
            si ha tenido molestias y cómo afectaron su actividad.
          </p> */}
          {/* <ol className="mt-[8px] grid grid-cols-2 gap-x-[16px] gap-y-[6px] sm:grid-cols-3">
            {GUIA_ZONAS.map((z, i) => (
              <li key={z} className="flex gap-[8px]">
                <span className="font-bold tabular-nums text-primario">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{z}</span>
              </li>
            ))}
          </ol> */}
        </ComoResponder>
      </div>

      {/* Leyenda para móvil (en md+ va dentro de la cabecera de la tabla) */}
      <div className="mb-[10px] flex flex-col gap-[4px] text-base text-gray-500 md:hidden">
        <span>
          <span className="font-semibold text-primario">
            Para ser respondido por todos:
          </span>{" "}
          columna de los últimos 12 meses.
        </span>
        <span>
          <span className="font-semibold text-primario">
            Para ser respondido únicamente por quienes han tenido problemas:
          </span>{" "}
          columnas de rutinas habituales y últimos 7 días.
        </span>
      </div>

      {/* ===== 02-B · Síntomas por zona ===== */}
      <div
        id="nordico-sec-2-tabla"
        className="scroll-mt-[70px] overflow-hidden rounded-lg border border-gray-200"
      >
        {/* Encabezado de 2 niveles (solo md+) */}
        <div className="hidden bg-primario text-white md:block">
          {/* Nivel 1: a quién corresponde responder */}
          <div
            className={`${HEADER_GRID} px-[16px] pb-[6px] pt-[12px] text-[11px] font-bold uppercase tracking-[0.08em]`}
          >
            <span aria-hidden="true" />
            <span className="text-center">Para ser respondido por todos</span>
            <span className="col-span-2 text-center">
              Para ser respondido únicamente por quienes han tenido problemas
            </span>
          </div>
          {/* Nivel 2: la pregunta completa de cada columna */}
          <div
            className={`${HEADER_GRID} border-t border-white/20 px-[16px] py-[10px] text-[11px] leading-snug text-white/90`}
          >
            <span className="self-center font-semibold">Zona del cuerpo</span>
            <span>
              Ha tenido Ud. durante cualquier tiempo en los últimos 12 meses
              problemas (molestias, dolor o disconfort) en:
            </span>
            <span>
              Ha estado impedido en cualquier tiempo durante los pasados 12 meses
              para hacer sus rutinas habituales en el trabajo o su casa por este
              problema?
            </span>
            <span>Ud. ha tenido problemas durante los últimos 7 días?</span>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {ZONAS.map((z) => (
            <div
              key={z.label}
              className={`px-[16px] py-[14px] odd:bg-white even:bg-gray-50/60 ${COL_GRID}`}
            >
              {/* Zona */}
              <div className="mb-[8px] md:mb-0">
                <p className="font-semibold text-primario">{z.label}</p>
                {z.hint && (
                  <p className="text-base text-gray-400">{z.hint}</p>
                )}
              </div>

              {/* Presencia (últimos 12 meses) */}
              <div className="mb-[8px] md:mb-0">
                <p className="mb-[4px] text-base font-medium text-gray-400 md:hidden">
                  ¿Ha tenido problemas en los últimos 12 meses?
                </p>
                {z.presencia.tipo === "sino" ? (
                  <div className="flex items-center gap-x-[20px]">
                    <Opt
                      label="No"
                      name={z.presencia.no}
                      checked={form[z.presencia.no]}
                      onChange={(e) =>
                        handleInputChangeCheckedGroup(e, z.presencia.grupo)
                      }
                    />
                    <Opt
                      label="Sí"
                      name={z.presencia.si}
                      checked={form[z.presencia.si]}
                      onChange={(e) =>
                        handleInputChangeCheckedGroup(e, z.presencia.grupo)
                      }
                    />
                  </div>
                ) : (
                  <div className="flex flex-col gap-[6px]">
                    {z.presencia.opciones.map((o) => (
                      <Opt
                        key={o.code}
                        label={o.label}
                        name={o.code}
                        checked={form[o.code]}
                        onChange={(e) =>
                          handleInputChangeCheckedGroup(e, z.presencia.grupo)
                        }
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Impedimento de rutinas */}
              <div className="mb-[8px] md:mb-0">
                <p className="mb-[4px] text-base font-medium text-gray-400 md:hidden">
                  ¿Le impidió hacer sus rutinas habituales?
                </p>
                <div className="flex items-center gap-x-[20px]">
                  {parNoSi(z.q1, form[z.dis])}
                </div>
              </div>

              {/* Últimos 7 días */}
              <div>
                <p className="mb-[4px] text-base font-medium text-gray-400 md:hidden">
                  ¿Ha tenido problemas en los últimos 7 días?
                </p>
                <div className="flex items-center gap-x-[20px]">
                  {parNoSi(z.q2, form[z.dis])}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Responder;
