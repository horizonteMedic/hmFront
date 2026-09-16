import {
  ComoResponder,
  GrupoOpciones,
  NotaImportante,
  Opt,
  ParNoSi,
  Pregunta,
  SubPregunta,
} from "./NordicoUI";

const Cuello = ({ form, setForm }) => {
  const handleInputChangeChecked4 = (e) => {
    const { name } = e.target;
    setForm((prev) => {
      const newForm = { ...prev };
      if (prev[name]) {
        newForm[name] = false;
      } else {
        ["pregunta4AProblemasCuello", "pregunta4BProblemasCuello", "pregunta4CProblemasCuello", "pregunta4DProblemasCuello", "pregunta4EProblemasCuello"]
          .forEach((code) => (newForm[code] = false));
        newForm[name] = true;
      }
      return newForm;
    });
  };

  const handleInputChangeChecked6 = (e) => {
    const { name } = e.target;
    setForm((prev) => {
      const newForm = { ...prev };
      if (prev[name]) {
        newForm[name] = false;
      } else {
        ["pregunta6AProblemasCuello", "pregunta6BProblemasCuello", "pregunta6CProblemasCuello", "pregunta6DProblemasCuello"]
          .forEach((code) => (newForm[code] = false));
        newForm[name] = true;
      }
      return newForm;
    });
  };

  const handleInputChangeCheckedGroup = (e, group) => {
    const { name } = e.target;
    setForm((prev) => {
      const newForm = { ...prev };
      if (prev[name]) {
        newForm[name] = false;
      } else {
        group.forEach((code) => (newForm[code] = false));
        newForm[name] = true;
      }
      return newForm;
    });
  };

  const bloqueado = form.pregunta1ProblemasCuelloNo;

  const noSi = (par, disabled) => (
    <ParNoSi>
      <Opt
        label="No"
        name={par[0]}
        checked={form[par[0]]}
        disabled={disabled}
        onChange={(e) => handleInputChangeCheckedGroup(e, par)}
      />
      <Opt
        label="Sí"
        name={par[1]}
        checked={form[par[1]]}
        disabled={disabled}
        onChange={(e) => handleInputChangeCheckedGroup(e, par)}
      />
    </ParNoSi>
  );

  // Lista vertical de opciones de duración.
  const dias = (opts, handler) => (
    <GrupoOpciones>
      {opts.map((item) => (
        <Opt
          key={item.code}
          label={item.label}
          name={item.code}
          checked={form[item.code]}
          disabled={bloqueado}
          onChange={handler}
        />
      ))}
    </GrupoOpciones>
  );

  return (
    <div className="text-xl text-gray-700">
      <ComoResponder
        titulo="¿Cómo responder el cuestionario?"
        img="img/Nordico/cuello.png"
        imgAlt="Zona del cuello"
      >
        <p>
          Problemas de cuello significa molestias, dolor o disconfort en el área
          indicada. Por favor concéntrese en esta área ignorando cualquier
          problema que usted pueda haber tenido en partes adyacentes a esta.
        </p>
      </ComoResponder>

      <Pregunta
        n="1"
        control={noSi(["pregunta1ProblemasCuelloNo", "pregunta1ProblemasCuelloSi"])}
      >
        Ud. ha tenido problemas en el cuello (molestias, dolor o disconfort)?
      </Pregunta>

      <NotaImportante>
        Si Ud. respondió <strong>NO</strong> a la pregunta 1, no responda las
        preguntas de la 2 a la 8.
      </NotaImportante>

      <Pregunta
        n="2"
        control={noSi(["pregunta2ProblemasCuelloNo", "pregunta2ProblemasCuelloSi"], bloqueado)}
      >
        Ud. ha sido lesionado en su cuello en un accidente?
      </Pregunta>

      <Pregunta
        n="3"
        control={noSi(["pregunta3ProblemasCuelloNo", "pregunta3ProblemasCuelloSi"], bloqueado)}
      >
        Ud. ha tenido cambios de trabajo o actividad por problemas en el cuello?
      </Pregunta>

      <Pregunta
        n="4"
        control={dias(
          [
            { label: "0 Días", code: "pregunta4AProblemasCuello" },
            { label: "1-7 Días", code: "pregunta4BProblemasCuello" },
            { label: "8-30 Días", code: "pregunta4CProblemasCuello" },
            { label: "Más de 30 Días", code: "pregunta4DProblemasCuello" },
            { label: "Todos los Días", code: "pregunta4EProblemasCuello" },
          ],
          handleInputChangeChecked4
        )}
      >
        Cuál es la duración total de tiempo en que ha tenido problemas en el
        cuello durante los últimos 12 meses?
      </Pregunta>

      <NotaImportante>
        Si Ud. respondió <strong>0 días</strong> a la pregunta 4, no responda las
        preguntas 5 a la 8.
      </NotaImportante>

      <Pregunta
        n="5"
        below={
          <div className="space-y-[8px]">
            <SubPregunta
              texto="a. Actividad de trabajo (en el trabajo o la casa)"
              control={noSi(
                ["pregunta5AProblemasCuelloNo", "pregunta5AProblemasCuelloSi"],
                bloqueado
              )}
            />
            <SubPregunta
              texto="b. Actividades recreativas"
              control={noSi(
                ["pregunta5BProblemasCuelloNo", "pregunta5BProblemasCuelloSi"],
                bloqueado
              )}
            />
          </div>
        }
      >
        Los problemas de su cuello han causado a Ud. reducción de su actividad
        física durante los últimos 12 meses?
      </Pregunta>

      <Pregunta
        n="6"
        control={dias(
          [
            { label: "0 Días", code: "pregunta6AProblemasCuello" },
            { label: "1-7 Días", code: "pregunta6BProblemasCuello" },
            { label: "8-30 Días", code: "pregunta6CProblemasCuello" },
            { label: "Más de 30 Días", code: "pregunta6DProblemasCuello" },
          ],
          handleInputChangeChecked6
        )}
      >
        Cuál es la duración total de tiempo que los problemas de su cuello le han
        impedido hacer sus rutinas de trabajo (en el trabajo o en casa) durante
        los últimos 12 meses?
      </Pregunta>

      <Pregunta
        n="7"
        control={noSi(["pregunta7ProblemasCuelloNo", "pregunta7ProblemasCuelloSi"], bloqueado)}
      >
        Ha sido visto por un médico, fisioterapista, quiropráctico u otra persona
        del área debido a problemas en su cuello durante los últimos 12 meses?
      </Pregunta>

      <Pregunta
        n="8"
        control={noSi(["pregunta8ProblemasCuelloNo", "pregunta8ProblemasCuelloSi"], bloqueado)}
      >
        Ha tenido problemas en su cuello en algún momento durante los últimos 7
        días?
      </Pregunta>
    </div>
  );
};

export default Cuello;
