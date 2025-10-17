import {
  InputsBooleanRadioGroup,
  InputTextArea,
  InputTextOneLine,
} from "../../../../../../components/reusableComponents/ResusableComponents";

export default function TestDeCage({
  form,
  handleRadioButtonBoolean,
  handleChange,
}) {
  const cageQuestions = [
    {
      name: "gustaSalirDivertirse",
      namePuntaje: "gustaSalirDivertirsePuntaje",
      label: "¿Le gusta salir a divertirse?",
    },
    {
      name: "molestaLlegaTardeCompromiso",
      namePuntaje: "molestaLlegaTardeCompromisoPuntaje",
      label: "¿Se molesta al llegar tarde a algún compromiso?",
    },
    {
      name: "molestadoGenteCriticaBeber",
      namePuntaje: "molestadoGenteCriticaBeberPuntaje",
      label: "¿Le ha molestado alguna vez la gente que le critica su forma de beber?",
    },
    {
      name: "sentidoEstarReunionDivirtiendoseReanima",
      namePuntaje: "sentidoEstarReunionDivirtiendoseReanimaPuntaje",
      label: "¿Ha sentido que estar en una reunión divirtiéndose lo reanima?",
    },
    {
      name: "impresionDeberiaBeberMenos",
      namePuntaje: "impresionDeberiaBeberMenosPuntaje",
      label: "¿Ha tenido usted alguna vez la impresión de que debería beber menos?",
    },
    {
      name: "duermeBien",
      namePuntaje: "duermeBienPuntaje",
      label: "¿Duerme bien?",
    },
    {
      name: "sentidoCulpablePorBeber",
      namePuntaje: "sentidoCulpablePorBeberPuntaje",
      label: "¿Se ha sentido alguna vez mal o culpable por su costumbre de beber?",
    },
    {
      name: "poneNerviosoMenudo",
      namePuntaje: "poneNerviosoMenudoPuntaje",
      label: "¿Se pone nervioso a menudo?",
    },
    {
      name: "bebeMananaParaCalmarNervios",
      namePuntaje: "bebeMananaParaCalmarNerviosPuntaje",
      label: "¿Alguna vez lo primero que ha hecho por la mañana ha sido beber para calmar sus nervios o para librarse de una resaca?",
    },
    {
      name: "doloresEspaldaLevantarse",
      namePuntaje: "doloresEspaldaLevantarsePuntaje",
      label: "¿Sufre de dolores en la espalda al levantarse?",
    },
  ];

  return (
    <div className="space-y-6">
      <section className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="font-bold mb-3">
          Test de CAGE
        </h3>
        <p className="text-gray-600 mb-3">
          Por favor, responda las siguientes preguntas con honestidad. Este cuestionario ayuda a evaluar posibles problemas relacionados con el consumo de alcohol.
        </p>
        <div className="grid grid-cols-2">
          {cageQuestions.map((question, index) => (
            <div key={question.name} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <span className="bg-blue-100 text-blue-800 font-medium px-2.5 py-0.5 rounded-full min-w-[2rem] text-center">
                  {index + 1}
                </span>
                <div className="w-full flex flex-row gap-8">
                  <InputsBooleanRadioGroup
                    label={question.label}
                    name={question.name}
                    value={form?.[question.name]}
                    onChange={handleRadioButtonBoolean}
                    labelWidth="200px"
                  />
                  <InputTextOneLine
                    label="Puntaje"
                    name={question.namePuntaje}
                    value={form?.[question.namePuntaje]}
                    onChange={handleRadioButtonBoolean}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <InputTextArea
          label="Anamnesis"
          name="anamnesisTestDeCage"
          value={form?.anamnesisTestDeCage}
          onChange={handleChange}
          rows={4}
        />
      </section>
    </div>
  );
}