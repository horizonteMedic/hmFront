import {
  InputTextArea,
  InputTextOneLine,
  SectionFieldset,
} from "../../../../../components/reusableComponents/ResusableComponents";
import RadioTable from "../../../../../components/reusableComponents/RadioTable";

export default function PersonalEmpleadoIV({
  form,
  setForm,
  handleChange,
  handleRadioButtonBoolean,
}) {
  return (
    <div className="space-y-3">
      <div className="bg-orange-100 border border-orange-300 text-orange-900 rounded-md p-3">
        Sección 3: (Confidencial) El profesional de la salud que va a revisar este
        cuestionario determinará si esta parte debe ser completada por el
        empleado. Responda SI o NO y agregue detalles cuando corresponda.
      </div>
      <div className="grid xl:grid-cols-2 gap-x-4 gap-y-3">
        {/* 1. Sensaciones en altura */}
        <SectionFieldset legend="1. Cuando trabaja en alturas por encima de 2500 msnm en una atmósfera
          con menor oxígeno que lo normal, ¿tiene estas sensaciones?">
          <RadioTable
            items={[
              { name: "alturaMareos", label: "a. Mareos." },
              { name: "alturaDificultadRespirar", label: "b. Dificultad para respirar." },
              { name: "alturaPalpitaciones", label: "c. Palpitaciones." },
              { name: "alturaOtros", label: "d. Otros." },
            ]}
            options={[
              { label: "SI", value: true },
              { label: "NO", value: false },
            ]}
            form={form}
            handleRadioButton={(e, value) => {
              if (e.target.name === "alturaOtros" && !value) {
                setForm(p => ({ ...p, alturaOtrosDescripcion: "" }));
              }
              handleRadioButtonBoolean(e, value);
            }}
          />

          <div className="mt-3">
            <InputTextOneLine
              label="Especifique"
              name="alturaOtrosDescripcion"
              value={form?.alturaOtrosDescripcion}
              disabled={!form?.alturaOtros}
              onChange={handleChange}
            />
          </div>
        </SectionFieldset>

        {/* 2. Problemas pulmonares */}
        <SectionFieldset legend="2. ¿Ha tenido alguna vez algunos de los siguientes problemas pulmonares
          o de pulmón?">
          <RadioTable
            items={[
              { name: "probPulmonAsbestos", label: "a. Asbestos." },
              { name: "probPulmonSilice", label: "b. Sílice." },
              { name: "probPulmonTungstenoCobalto", label: "c. Tungsteno / Cobalto (Ej.: esmerilado o soldadura)." },
              { name: "probPulmonBerilio", label: "d. Berilio." },
              { name: "probPulmonAluminio", label: "e. Aluminio." },
              { name: "probPulmonCarbon", label: "f. Carbón." },
              { name: "probPulmonHierro", label: "g. Hierro." },
              { name: "probPulmonLaton", label: "h. Latón." },
              { name: "probPulmonAmbienteExcesoPolvo", label: "i. Ambientes con exceso de polvo." },
              { name: "probPulmonIndustrialesOtros", label: "j. Otros." },
            ]}
            options={[
              { label: "SI", value: true },
              { label: "NO", value: false },
            ]}
            form={form}
            handleRadioButton={(e, value) => {
              if (e.target.name === "probPulmonIndustrialesOtros" && !value) {
                setForm(p => ({ ...p, probPulmonIndustrialesOtrosDescripcion: "" }));
              }
              handleRadioButtonBoolean(e, value);
            }}
          />

          <div className="mt-3">
            <InputTextOneLine
              label="Especifique"
              name="probPulmonIndustrialesOtrosDescripcion"
              value={form?.probPulmonIndustrialesOtrosDescripcion}
              disabled={!form?.probPulmonIndustrialesOtros}
              onChange={handleChange}
            />
          </div>
        </SectionFieldset>

        <SectionFieldset legend="Items Finales" className="space-y-3">
          {/* 3. Exposición a peligros respiratorios */}
          <InputTextArea
            label="3. Liste cualquier trabajo previo/pasatiempo en los que haya sido expuesto a peligros respiratorios"
            name="trabajosExpuestosPeligrosRespiratorios"
            rows={4}
            value={form?.trabajosExpuestosPeligrosRespiratorios}
            onChange={handleChange}
          />

          {/* 4 y 5. Servicio Militar / MATPEL */}
          <RadioTable
            items={[
              { name: "servicioMilitar", label: "4. ¿Has hecho alguna vez Servicio Militar?" },
              { name: "equipoMatpelEmergencias", label: "5. ¿Has estado alguna vez en un equipo de MATPEL o Respuesta de Emergencias?" },
            ]}
            options={[
              { label: "SI", value: true },
              { label: "NO", value: false },
            ]}
            form={form}
            handleRadioButton={handleRadioButtonBoolean}
          />
        </SectionFieldset>
      </div>
    </div>
  );
}
