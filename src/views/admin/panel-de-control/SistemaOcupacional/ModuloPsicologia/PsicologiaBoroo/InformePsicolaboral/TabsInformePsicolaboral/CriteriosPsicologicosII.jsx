
import {
  InputsRadioGroup,
  InputTextOneLine,
} from "../../../../../../../components/reusableComponents/ResusableComponents";
import RadioTable from "../../../../../../../components/reusableComponents/RadioTable";
import SectionFieldset from "../../../../../../../components/reusableComponents/SectionFieldset";

export default function CriteriosPsicologicosII({
  form,
  handleRadioButton,
  handleChange,
  disabled = false,
  isFieldEdited,
  revertField,
}) {
  const aspectosConductualesOptions = [
    { value: "BAJO", label: "BAJO" },
    { value: "PROMEDIO", label: "PROMEDIO" },
    { value: "ALTO", label: "ALTO" },
  ];
  return (
    <div className="bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionFieldset legend="Apecto Conductuales">
          <div className="space-y-4">
            <InputTextOneLine
              label="1. Nivel de Alerta ante el riesgo"
              labelOnTop
              name="nivelAlerta"
              value={form?.nivelAlerta}
              onChange={handleChange}
              disabled={disabled}
              edited={isFieldEdited("nivelAlerta")}
              onRevert={() => revertField("nivelAlerta")}
            />
            <InputTextOneLine
              label="2. Tipo de hostigamiento sexual"
              labelOnTop
              name="hostigamientoSexual"
              value={form?.hostigamientoSexual}
              onChange={handleChange}
              disabled={disabled}
              edited={isFieldEdited("hostigamientoSexual")}
              onRevert={() => revertField("hostigamientoSexual")}
            />
            <InputTextOneLine
              label="3. Tipo de consecuencia encontrada"
              labelOnTop
              name="consecuencia"
              value={form?.consecuencia}
              onChange={handleChange}
              disabled={disabled}
              edited={isFieldEdited("consecuencia")}
              onRevert={() => revertField("consecuencia")}
            />
          </div>
        </SectionFieldset>

        <SectionFieldset legend="Aspectos Psicolaborales">
          <RadioTable
            items={[
              { name: "capacidadInfluencia", label: "1. Capacidad de influencia" },
              { name: "adaptacionCambios", label: "2. Adaptación a los cambios" },
              { name: "trabajoEquipoColaboracion", label: "3. Trabajo en equipo y colaboración" },
              { name: "orientacionAccionMejoraProcesos", label: "4. Orientación a la acción y mejora de procesos" },
              { name: "autonomiaProactividad", label: "5. Autonomía y proactividad" },
              { name: "tomaDecisiones", label: "6. Toma de decisiones" },
              { name: "crecimientoPersonal", label: "7. Crecimiento personal" },
              { name: "motivacion", label: "8. Motivación" }
            ]}
            options={[
              { value: "PD", label: "Poco Desarrollado" },
              { value: "NM", label: "Necesita Mejorar" },
              { value: "A", label: "Adecuado" },
              { value: "D", label: "Destacado" },
              { value: "E", label: "Excepcional" }
            ]}
            form={form}
            handleRadioButton={handleRadioButton}
            disabled={disabled}
            isFieldEdited={isFieldEdited}
            onRevert={revertField}
            stackOnMobile
          />
        </SectionFieldset>
      </div>
    </div>
  );
}