import {
  ComoResponder,
  GrupoOpciones,
  NotaImportante,
  Opt,
  ParNoSi,
  Pregunta,
  SubPregunta,
} from "./NordicoUI";

const Espalda_Baja = ({ form, setForm }) => {
  const handleInputChangeCheckedEB = (e) => {
    const { name } = e.target;
    setForm((prev) => {
      const newForm = { ...prev };

      if (prev[name]) {
        // Si ya estaba activo, lo desmarcamos
        newForm[name] = false;
      } else {
        // Primero desmarcar todos los de este grupo
        ["pregunta4AEspaldaBaja", "pregunta4BEspaldaBaja", "pregunta4CEspaldaBaja", "pregunta4DEspaldaBaja", "pregunta4EEspaldaBaja"]
          .forEach((code) => (newForm[code] = false));

        // Activar solo el seleccionado
        newForm[name] = true;
      }

      return newForm;
    });
  };

  const handleInputChangeCheckedEB2 = (e) => {
    const { name } = e.target;
    setForm((prev) => {
      const newForm = { ...prev };

      if (prev[name]) {
        // Si ya estaba activo, lo desmarcamos
        newForm[name] = false;
      } else {
        // Primero desmarcar todos los de este grupo
        ["pregunta6AEspaldaBaja", "pregunta6BEspaldaBaja", "pregunta6CEspaldaBaja", "pregunta6DEspaldaBaja"]
          .forEach((code) => (newForm[code] = false));

        // Activar solo el seleccionado
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

  const bloqueado = form.pregunta1EspaldaBajaNo;

  // Par No/Sí reutilizable: conserva el grupo excluyente y el `disabled` original.
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

  // Lista vertical de opciones de duración (mitad derecha de la pregunta).
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
        img="img/Nordico/Espaldabaja.png"
        imgAlt="Zona de la espalda baja"
      >
        <p>
          En este dibujo Ud. puede ver la parte del cuerpo referida en el
          cuestionario. Problemas de espalda baja significan molestias, dolor o
          disconfort en el área indicada con irradiación o no hacia una o ambas
          piernas (ciática). Por favor responda poniendo una x en el respectivo
          recuadro para cada pregunta.
        </p>
      </ComoResponder>

      <Pregunta
        n="1"
        control={noSi(["pregunta1EspaldaBajaNo", "pregunta1EspaldaBajaSi"])}
      >
        Ud. ha tenido problemas en la espalda baja (molestias, dolor o
        disconfort)?
      </Pregunta>

      <NotaImportante>
        Si Ud. respondió <strong>NO</strong> a la pregunta 1, no responda las
        preguntas de la 2 a la 8.
      </NotaImportante>

      <Pregunta
        n="2"
        control={noSi(["pregunta2EspaldaBajaNo", "pregunta2EspaldaBajaSi"], bloqueado)}
      >
        Ud. ha estado hospitalizado por problemas de espalda baja?
      </Pregunta>

      <Pregunta
        n="3"
        control={noSi(["pregunta3EspaldaBajaNo", "pregunta3EspaldaBajaSi"], bloqueado)}
      >
        Ud. ha tenido cambios de trabajo o actividad por problemas de espalda
        baja?
      </Pregunta>

      <Pregunta
        n="4"
        control={dias(
          [
            { label: "0 Días", code: "pregunta4AEspaldaBaja" },
            { label: "1-7 Días", code: "pregunta4BEspaldaBaja" },
            { label: "8-30 Días", code: "pregunta4CEspaldaBaja" },
            { label: "Más de 30 Días", code: "pregunta4DEspaldaBaja" },
            { label: "Todos los Días", code: "pregunta4EEspaldaBaja" },
          ],
          handleInputChangeCheckedEB
        )}
      >
        Cuál es la duración total de tiempo en que ha tenido problemas de espalda
        baja durante los últimos 12 meses?
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
                ["pregunta5AEspaldaBajaNo", "pregunta5AEspaldaBajaSi"],
                bloqueado
              )}
            />
            <SubPregunta
              texto="b. Actividades recreativas"
              control={noSi(
                ["pregunta5BEspaldaBajaNo", "pregunta5BEspaldaBajaSi"],
                bloqueado
              )}
            />
          </div>
        }
      >
        Los problemas de espalda baja han causado a Ud. reducción de su actividad
        física durante los últimos 12 meses?
      </Pregunta>

      <Pregunta
        n="6"
        control={dias(
          [
            { label: "0 Días", code: "pregunta6AEspaldaBaja" },
            { label: "1-7 Días", code: "pregunta6BEspaldaBaja" },
            { label: "8-30 Días", code: "pregunta6CEspaldaBaja" },
            { label: "Más de 30 Días", code: "pregunta6DEspaldaBaja" },
          ],
          handleInputChangeCheckedEB2
        )}
      >
        Cuál es la duración total de tiempo que los problemas de espalda baja le
        han impedido hacer sus rutinas de trabajo (en el trabajo o en casa)
        durante los últimos 12 meses?
      </Pregunta>

      <Pregunta
        n="7"
        control={noSi(["pregunta7EspaldaBajaNo", "pregunta7EspaldaBajaSi"], bloqueado)}
      >
        Ha sido visto por un médico, fisioterapista, quiropráctico u otra persona
        del área debido a problemas de espalda durante los últimos 12 meses?
      </Pregunta>

      <Pregunta
        n="8"
        control={noSi(["pregunta8EspaldaBajaNo", "pregunta8EspaldaBajaSi"], bloqueado)}
      >
        Ha tenido problemas de espalda baja en algún momento durante los últimos
        7 días?
      </Pregunta>
    </div>
  );
};

export default Espalda_Baja;
