import InputsRadioGroup from "../../../../../../../components/reusableComponents/InputsRadioGroup";

export default function ParteIII({ form, handleRadioButton }) {
  return (
    <fieldset className="bg-white border border-gray-200 rounded-lg p-4 space-y-6">
      <legend className="font-bold mb-4 text-[10px]">Preguntas (durante el último mes)</legend>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <InputsRadioGroup
            label="6. Veces que tomó medicinas para dormir"
            name="medicinasDormirFrecuencia"
            value={form?.medicinasDormirFrecuencia}
            onChange={handleRadioButton}
            options={[
              { value: "NUNCA", label: "Ninguna vez en el último mes" },
              { value: "MENOS_SEMANA", label: "Menos de una vez a la semana" },
              { value: "UNO_DOS_SEMANA", label: "Una o dos veces a la semana" },
              { value: "TRES_SEMANA", label: "Tres veces a la semana" },
            ]}
            labelOnTop
            vertical
          />

          <InputsRadioGroup
            label="7. Somnolencia/sueño en actividades sociales"
            name="somnolenciaSocialFrecuencia"
            value={form?.somnolenciaSocialFrecuencia}
            onChange={handleRadioButton}
            options={[
              { value: "NUNCA", label: "Ninguna vez en el último mes" },
              { value: "MENOS_SEMANA", label: "Menos de una vez a la semana" },
              { value: "UNO_DOS_SEMANA", label: "Una o dos veces a la semana" },
              { value: "TRES_SEMANA", label: "Tres veces a la semana" },
            ]}
            labelOnTop
            vertical
          />

          <InputsRadioGroup
            label="8. Despertares por noche (promedio)"
            name="despertaNochePromedio"
            value={form?.despertaNochePromedio}
            onChange={handleRadioButton}
            options={[
              { value: "1", label: "1 vez por noche" },
              { value: "2", label: "2 veces por noche" },
              { value: "3", label: "3 veces por noche" },
              { value: ">3", label: "> 3 veces por noche" },
            ]}
            labelOnTop
            vertical
          />
        </div>
        <div className="space-y-6">
          <InputsRadioGroup
            label="9. Calidad general del sueño"
            name="calidadSuenoGeneral"
            value={form?.calidadSuenoGeneral}
            onChange={handleRadioButton}
            options={[
              { value: "MUY_BUENA", label: "Muy Buena" },
              { value: "BUENA", label: "Buena" },
              { value: "MALA", label: "Mala" },
              { value: "MUY_MALA", label: "Muy Mala" },
            ]}
            labelOnTop
            vertical
          />

          <InputsRadioGroup
            label="10. Estado de ánimo dificultó actividades"
            name="animoDificultaActividad"
            value={form?.animoDificultaActividad}
            onChange={handleRadioButton}
            options={[
              { value: "NO", label: "No" },
              { value: "SI_ALGO", label: "Sí, algo" },
              { value: "SI_REGULAR", label: "Sí, regular" },
              { value: "SI_MUCHO", label: "Sí, mucho" },
            ]}
            labelOnTop
            vertical
          />

          <InputsRadioGroup
            label="11. ¿Duerme solo o comparte habitación?"
            name="comparteHabitacion"
            value={form?.comparteHabitacion}
            onChange={handleRadioButton}
            labelOnTop
            options={[
              { value: "SOLO", label: "Solo" },
              { value: "SOLO_LADO", label: "Solo, pero hay alguien en la habitación de al lado" },
              { value: "MISMO_CUARTO", label: "Con otra persona en el mismo cuarto" },
              { value: "DOS_O_MAS", label: "Con dos o más personas en el mismo cuarto" },
            ]}
            vertical
          />
        </div>
      </div>
    </fieldset>
  );
}