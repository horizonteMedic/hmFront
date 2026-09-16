import InputTextOneLine from "../../../../../components/reusableComponents/InputTextOneLine";
import { Opt } from "./NordicoUI";

/**
 * Sección 1 · Datos personales del trabajo.
 *
 * Layout en 2 columnas alineadas (grid `pregunta | respuesta`): todas las
 * preguntas arrancan en la misma vertical y todas las respuestas también.
 * Los campos de texto usan el reutilizable `InputTextOneLine`; el de horas
 * replica su mismo diseño (`border rounded px-2 py-1`).
 */
const Cuestionario = ({ form, setForm, handleChangeNumber }) => {
  // Diestro / Zurdo: excluyentes entre sí (se comportan como un grupo de radios).
  const handleDiestroZurdo = (e) => {
    const { name } = e.target;
    setForm((prev) => {
      const newForm = { ...prev };
      if (prev[name]) {
        newForm[name] = false;
      } else {
        ["esDiestro", "esZurdo"].forEach((code) => (newForm[code] = false));
        newForm[name] = true;
      }
      return newForm;
    });
  };

  return (
    <div className="grid gap-x-[24px] gap-y-[16px] text-xl text-gray-700 sm:grid-cols-[440px_1fr] sm:items-center">
      {/* 1 · Años y meses en el puesto */}
      <span className="font-semibold text-primario">
        ¿Cuántos años y meses ha estado Ud. haciendo el presente tipo de trabajo?
      </span>
      <div className="flex flex-wrap items-center gap-[20px]">
        <InputTextOneLine
          label="Años"
          name="anios"
          value={form.anios}
          onChange={handleChangeNumber}
          labelWidth="52px"
          inputClassName="text-xl"
          className="w-[150px]"
        />
        <InputTextOneLine
          label="Meses"
          name="meses"
          value={form.meses}
          onChange={handleChangeNumber}
          labelWidth="52px"
          inputClassName="text-xl"
          className="w-[150px]"
        />
      </div>

      {/* 2 · Horas por semana */}
      <label htmlFor="horasTrabajadas" className="font-semibold text-primario">
        En promedio, ¿cuántas horas a la semana trabaja?
      </label>
      <input
        id="horasTrabajadas"
        name="horasTrabajadas"
        type="text"
        value={form.horasTrabajadas}
        onChange={handleChangeNumber}
        className="w-[220px] max-w-full rounded border px-2 py-1 text-xl outline-none"
      />

      {/* 3 · Mano dominante */}
      <span className="font-semibold text-primario">
        Es Ud.:{" "}
        <span className="font-normal text-gray-500">(mano dominante)</span>
      </span>
      <div className="flex items-center gap-[28px]">
        <Opt
          label="Diestro"
          name="esDiestro"
          checked={form.esDiestro}
          onChange={handleDiestroZurdo}
        />
        <Opt
          label="Zurdo"
          name="esZurdo"
          checked={form.esZurdo}
          onChange={handleDiestroZurdo}
        />
      </div>
    </div>
  );
};

export default Cuestionario;
