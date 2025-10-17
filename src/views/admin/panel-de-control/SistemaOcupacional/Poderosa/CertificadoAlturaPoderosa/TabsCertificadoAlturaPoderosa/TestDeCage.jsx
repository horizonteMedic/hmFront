import {
  InputsBooleanRadioGroup,
} from "../../../../../../components/reusableComponents/ResusableComponents";

export default function TestDeCage({
  form,
  handleRadioButtonBoolean,
}) {
  const cageQuestions = [
    {
      name: "gustaSalirDivertirse",
      label: "¿Le gusta salir a divertirse?",
    },
    {
      name: "molestaLlegaTardeCompromiso",
      label: "¿Se molesta al llegar tarde a algún compromiso?",
    },
    {
      name: "molestadoGenteCriticaBeber",
      label: "¿Le ha molestado alguna vez la gente que le critica su forma de beber?",
    },
    {
      name: "sentidoEstarReunionDivirtiendoseReanima",
      label: "¿Ha sentido que estar en una reunión divirtiéndose lo reanima?",
    },
    {
      name: "impresionDeberiaBeberMenos",
      label: "¿Ha tenido usted alguna vez la impresión de que debería beber menos?",
    },
    {
      name: "duermeBien",
      label: "¿Duerme bien?",
    },
    {
      name: "sentidoCulpablePorBeber",
      label: "¿Se ha sentido alguna vez mal o culpable por su costumbre de beber?",
    },
    {
      name: "poneNerviosoMenudo",
      label: "¿Se pone nervioso a menudo?",
    },
    {
      name: "bebeMananaParaCalmarNervios",
      label: "¿Alguna vez lo primero que ha hecho por la mañana ha sido beber para calmar sus nervios o para librarse de una resaca?",
    },
    {
      name: "doloresEspaldaLevantarse",
      label: "¿Sufre de dolores en la espalda al levantarse?",
    },
  ];

  return (
    <div className="space-y-6">
      <section className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Test de CAGE
        </h3>
        <p className="text-gray-600 mb-6">
          Por favor, responda las siguientes preguntas con honestidad. Este cuestionario ayuda a evaluar posibles problemas relacionados con el consumo de alcohol.
        </p>

        <div className="space-y-4">
          {cageQuestions.map((question, index) => (
            <div key={question.name} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <span className="bg-blue-100 text-blue-800  font-medium px-2.5 py-0.5 rounded-full min-w-[2rem] text-center">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <InputsBooleanRadioGroup
                    label={question.label}
                    name={question.name}
                    value={form?.[question.name]}
                    onChange={handleRadioButtonBoolean}
                    labelWidth="200px"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">Información sobre el Test CAGE</h4>
          <p className="text-blue-700 ">
            El test CAGE es una herramienta de screening para detectar problemas relacionados con el alcohol.
            Dos o más respuestas positivas sugieren la necesidad de una evaluación más detallada.
          </p>
        </div>
      </section>
    </div>
  );
}