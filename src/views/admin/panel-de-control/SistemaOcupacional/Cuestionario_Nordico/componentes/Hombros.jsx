import {
  ComoResponder,
  GrupoOpciones,
  NotaImportante,
  Opt,
  ParNoSi,
  Pregunta,
  SubPregunta,
} from "./NordicoUI";

const Hombros = ({ form, setForm }) => {
  const handleInputChangeChecked1 = (e) => {
    const { name } = e.target;
    setForm((prev) => {
      const newForm = { ...prev };
      if (prev[name]) {
        newForm[name] = false;
      } else {
        ["pregunta5AProblemasHombros", "pregunta5BProblemasHombros", "pregunta5CProblemasHombros", "pregunta5DProblemasHombros"]
          .forEach((code) => (newForm[code] = false));
        newForm[name] = true;
      }
      return newForm;
    });
  };

  const handleInputChangeChecked2 = (e) => {
    const { name } = e.target;
    setForm((prev) => {
      const newForm = { ...prev };
      if (prev[name]) {
        newForm[name] = false;
      } else {
        ["pregunta7AProblemasHombros", "pregunta7BProblemasHombros", "pregunta7CProblemasHombros", "pregunta7DProblemasHombros"]
          .forEach((code) => (newForm[code] = false));
        newForm[name] = true;
      }
      return newForm;
    });
  };

  const handleInputChangeChecked10 = (e) => {
    const { name } = e.target;
    setForm((prev) => {
      const newForm = { ...prev };
      if (prev[name]) {
        newForm[name] = false;
      } else {
        ["pregunta2ProblemasHombrosNo", "pregunta2ProblemasHombroIzquierdoSi", "pregunta2ProblemasHombroDerechoSi", "pregunta2ProblemasAmbosHombros"]
          .forEach((code) => (newForm[code] = false));
        newForm[name] = true;
      }
      return newForm;
    });
  };

  const handleInputChangeChecked12 = (e) => {
    const { name } = e.target;
    setForm((prev) => {
      const newForm = { ...prev };
      if (prev[name]) {
        newForm[name] = false;
      } else {
        ["pregunta4ProblemasHombrosNo", "pregunta4ProblemasHombroIzquierdoSi", "pregunta4ProblemasHombroDerechoSi", "pregunta4ProblemasAmbosHombros"]
          .forEach((code) => (newForm[code] = false));
        newForm[name] = true;
      }
      return newForm;
    });
  };

  const handleInputChangeChecked17 = (e) => {
    const { name } = e.target;
    setForm((prev) => {
      const newForm = { ...prev };
      if (prev[name]) {
        newForm[name] = false;
      } else {
        ["pregunta9ProblemasHombrosNo", "pregunta9ProblemasHombroIzquierdoSi", "pregunta9ProblemasHombroDerechoSi", "pregunta9ProblemasAmbosHombros"]
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

  const bloqueado = form.pregunta1ProblemasHombrosNo;

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

  // Grupo de 4 opciones (No / derecho / izquierdo / ambos) para las preguntas 10, 12 y 17.
  // Los nombres de campo se construyen tal cual existen en el `form` original:
  //   pregunta2ProblemasHombrosNo / pregunta2ProblemasHombroDerechoSi / ...AmbosHombros
  const multiHombro = (prefix, handler) => (
    <GrupoOpciones>
      {[
        { code: `${prefix}HombrosNo`, label: "No" },
        { code: `${prefix}HombroDerechoSi`, label: "Sí, en mi hombro derecho" },
        { code: `${prefix}HombroIzquierdoSi`, label: "Sí, en mi hombro izquierdo" },
        { code: `${prefix}AmbosHombros`, label: "Sí, en ambos hombros" },
      ].map((o) => (
        <Opt
          key={o.code}
          label={o.label}
          name={o.code}
          checked={form[o.code]}
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
        img="img/Nordico/hombros.png"
        imgAlt="Zona de los hombros"
      >
        <p>
          Problemas de los hombros significa molestias, dolor o disconfort en el
          área indicada. Por favor concéntrese en esta área ignorando cualquier
          problema que usted pueda haber tenido en partes adyacentes a esta.
          Existe un cuestionario separado para el cuello. Por favor, responda
          poniendo una x en el respectivo recuadro para cada pregunta.
        </p>
      </ComoResponder>

      <Pregunta
        n="9"
        control={noSi(["pregunta1ProblemasHombrosNo", "pregunta1ProblemasHombrosSi"])}
      >
        Ud. ha tenido problema de hombros (molestias, dolor o disconfort)?
      </Pregunta>

      <NotaImportante>
        Si Ud. respondió <strong>NO</strong> a la pregunta 9, no responda las
        preguntas de la 10 a la 17.
      </NotaImportante>

      <Pregunta
        n="10"
        control={multiHombro("pregunta2Problemas", handleInputChangeChecked10)}
      >
        Ud. ha tenido lesiones en sus hombros en un accidente?
      </Pregunta>

      <Pregunta
        n="11"
        control={noSi(["pregunta3ProblemasHombrosNo", "pregunta3ProblemasHombrosSi"], bloqueado)}
      >
        Ud. ha tenido un cambio de trabajo o actividad por problemas de hombros?
      </Pregunta>

      <Pregunta
        n="12"
        control={multiHombro("pregunta4Problemas", handleInputChangeChecked12)}
      >
        Ud. ha tenido problemas en los hombros durante los últimos 12 meses?{" "}
        <span className="text-primario">
          Si Ud. responde NO, no responda las preguntas 13 a 17.
        </span>
      </Pregunta>

      <Pregunta
        n="13"
        control={dias(
          [
            { label: "0 Días", code: "pregunta5AProblemasHombros" },
            { label: "1-7 Días", code: "pregunta5BProblemasHombros" },
            { label: "8-30 Días", code: "pregunta5CProblemasHombros" },
            { label: "Más de 30 Días", code: "pregunta5DProblemasHombros" },
          ],
          handleInputChangeChecked1
        )}
      >
        Cuál es la duración total de tiempo en que Ud. ha tenido problemas en los
        últimos 12 meses?
      </Pregunta>

      <Pregunta
        n="14"
        below={
          <div className="space-y-[8px]">
            <SubPregunta
              texto="a. Actividad de trabajo (en el trabajo o la casa)"
              control={noSi(
                ["pregunta6AProblemasHombrosNo", "pregunta6AProblemasHombrosSi"],
                bloqueado
              )}
            />
            <SubPregunta
              texto="b. Actividades recreativas"
              control={noSi(
                ["pregunta6BProblemasHombrosNo", "pregunta6BProblemasHombrosSi"],
                bloqueado
              )}
            />
          </div>
        }
      >
        El problema en sus hombros le ha causado una disminución de su actividad
        durante los últimos 12 meses?
      </Pregunta>

      <Pregunta
        n="15"
        control={dias(
          [
            { label: "0 Días", code: "pregunta7AProblemasHombros" },
            { label: "1-7 Días", code: "pregunta7BProblemasHombros" },
            { label: "8-30 Días", code: "pregunta7CProblemasHombros" },
            { label: "Más de 30 Días", code: "pregunta7DProblemasHombros" },
          ],
          handleInputChangeChecked2
        )}
      >
        Cuál es la duración total de tiempo que el problema en sus hombros le ha
        impedido hacer sus rutinas de trabajo (en el trabajo o en casa) durante
        los últimos 12 meses?
      </Pregunta>

      <Pregunta
        n="16"
        control={noSi(["pregunta8ProblemasHombrosNo", "pregunta8ProblemasHombrosSi"], bloqueado)}
      >
        Ha sido visto por un médico, fisioterapista, quiropráctico u otra persona
        del área debido a problemas en los hombros los últimos 12 meses?
      </Pregunta>

      <Pregunta
        n="17"
        control={multiHombro("pregunta9Problemas", handleInputChangeChecked17)}
      >
        Ha tenido problemas de los hombros en algún momento durante los últimos 7
        días?
      </Pregunta>
    </div>
  );
};

export default Hombros;
