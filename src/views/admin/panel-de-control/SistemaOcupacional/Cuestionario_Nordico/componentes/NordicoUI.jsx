/**
 * Primitivas visuales del Cuestionario Nórdico (nuevo formato).
 *
 * Son componentes SOLO de presentación: no manejan estado del formulario ni
 * lógica de negocio. Toda la mecánica de checkboxes (grupos excluyentes,
 * `disabled` según la respuesta previa, nombres de campos) sigue viviendo en
 * cada sección; aquí únicamente se estandariza el look & feel.
 *
 * Tamaño de letra: el `:root` de la app fija `font-size: 10px`, así que
 *   text-base = 10px (el tamaño que heredan los inputs de DatosPersonalesLaborales)
 *   text-lg   = 11.25px
 *   text-xl   = 12.5px  ← tamaño base de las preguntas de este cuestionario
 *   text-2xl  = 15px    ← títulos "más grandes por diseño"
 *
 * Reparto pregunta / respuesta (secciones 3-5): 50% para la pregunta y 50% para
 * la respuesta, para que TODAS las preguntas terminen en la misma línea vertical.
 *   - Preguntas con Sí/No: par centrado en la mitad derecha.
 *   - Preguntas con varias opciones (días, hombro derecho/izquierdo/ambos): lista
 *     vertical en la mitad derecha.
 *   - Preguntas con sub-ítems a./b.: el enunciado ocupa su 50% y cada sub-ítem
 *     va debajo, a ancho completo, respetando el mismo reparto 50/50.
 *
 * Nota Tailwind + Bootstrap: Bootstrap 5.3 está cargado global y sus utilidades
 * de spacing homónimas (`px-4`, `mb-4`, `gap-3`...) ganan por `!important`. Por
 * eso se usan valores arbitrarios (`px-[16px]`, `gap-[16px]`) salvo en 0/1/2.
 * Además: no construir clases por interpolación (`md:${var}` no lo genera el
 * build) — escribir siempre la clase completa y literal.
 */

/* Casilla individual "No / Sí" (o cualquier etiqueta) con estética uniforme. */
export const Opt = ({
  label,
  name,
  checked,
  disabled = false,
  onChange,
  className = "",
}) => (
  <label
    className={`flex cursor-pointer select-none items-center gap-[8px] text-xl font-normal ${
      disabled ? "opacity-50" : ""
    } ${className}`}
  >
    <input
      type="checkbox"
      name={name}
      checked={!!checked}
      disabled={disabled}
      onChange={onChange}
      className="h-[15px] w-[15px] shrink-0 accent-[#233245]"
    />
    <span>{label}</span>
  </label>
);

/* Par horizontal Sí/No para el lado derecho de una pregunta. */
export const ParNoSi = ({ children }) => (
  <div className="flex items-center gap-[28px]">{children}</div>
);

/* Lista vertical de opciones (días, hombro derecho/izquierdo/ambos...). */
export const GrupoOpciones = ({ children }) => (
  <div className="flex flex-col gap-[8px]">{children}</div>
);

/**
 * Columna de respuesta (mitad derecha de la pregunta).
 * El contenido va en una caja de ancho fijo, alineada al centro de la columna,
 * y dentro de esa caja todo se alinea a la izquierda: así el PRIMER checkbox de
 * cada pregunta (Sí/No, días, hombro...) arranca siempre en la misma vertical.
 */
const ColRespuesta = ({ children }) => (
  <div className="flex justify-center sm:w-1/2">
    <div className="w-[220px] max-w-full">{children}</div>
  </div>
);

/**
 * Fila de pregunta numerada.
 * - `children`  → el enunciado (mitad izquierda, 50%).
 * - `control`   → la respuesta (mitad derecha, 50%, centrada).
 * - `below`     → contenido a ancho completo debajo (sub-ítems a./b.).
 */
export const Pregunta = ({ n, children, control, below, className = "" }) => (
  <div
    className={`border-b border-gray-100 py-[14px] last:border-b-0 ${className}`}
  >
    <div className="flex flex-col gap-[8px] sm:flex-row sm:items-center sm:gap-[16px]">
      <div className="font-bold leading-relaxed text-gray-800 sm:w-1/2">
        {n != null && <span className="mr-[8px] text-primario">{n}.-</span>}
        {children}
      </div>
      {control != null && <ColRespuesta>{control}</ColRespuesta>}
    </div>
    {below != null && <div className="mt-[10px]">{below}</div>}
  </div>
);

/**
 * Sub-fila (a. / b. …) dentro de una pregunta. Mismo reparto 50/50 que
 * `Pregunta`, con una pequeña sangría en el texto que marca la jerarquía.
 */
export const SubPregunta = ({ texto, control }) => (
  <div className="flex flex-col gap-[6px] sm:flex-row sm:items-center sm:gap-[16px]">
    <span className="pl-[20px] font-normal leading-relaxed text-gray-700 sm:w-1/2">
      {texto}
    </span>
    <ColRespuesta>{control}</ColRespuesta>
  </div>
);

/* Aviso destacado ("Si respondió NO a la pregunta 1, no responda..."). */
export const NotaImportante = ({ children }) => (
  <div className="my-[10px] flex items-start gap-[10px] rounded-r-md border-l-[5px] border-primario bg-primarioClaro px-[18px] py-[12px] text-xl text-gray-700">
    <span className="shrink-0 font-bold text-primario">Importante:</span>
    <span>{children}</span>
  </div>
);

/**
 * Tarjeta introductoria "¿Cómo responder el cuestionario?".
 *
 * - variant="card" (secciones 2-5): tarjeta con barra de acento a la izquierda.
 *   El texto tiene un ancho acotado y la figura se ajusta a su contenido (sin
 *   recuadro blanco ancho); ambos quedan centrados dentro de la tarjeta.
 * - variant="hero": la figura se ve más grande, a la par de todo el texto.
 */
export const ComoResponder = ({
  overline = "Referencia anatómica",
  titulo,
  children,
  img,
  imgAlt = "",
  variant = "card",
}) => {
  const texto = (
    <div className="space-y-[10px]">
      {overline && (
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400">
          {overline}
        </p>
      )}
      {titulo && (
        <h4 className="text-2xl font-bold text-primario">{titulo}</h4>
      )}
      <div className="space-y-[10px] text-xl leading-relaxed text-gray-600">
        {children}
      </div>
    </div>
  );

  if (variant === "hero") {
    return (
      <div className="flex flex-col gap-[24px] md:flex-row md:items-stretch">
        <div className="flex-1">{texto}</div>
        {img && (
          <div className="flex shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white p-[12px] md:w-[480px]">
            <img
              src={img}
              alt={imgAlt}
              className="max-h-[540px] w-auto object-contain"
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mb-[18px] flex flex-col items-center gap-[28px] rounded-lg border border-gray-200 border-l-[5px] border-l-[#c3c7d9] bg-white p-[24px] md:flex-row md:justify-center">
      <div className="w-full max-w-[440px]">{texto}</div>
      {img && (
        <div className="flex shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white p-[8px]">
          <img
            src={img}
            alt={imgAlt}
            className="max-h-[340px] w-auto object-contain"
          />
        </div>
      )}
    </div>
  );
};
