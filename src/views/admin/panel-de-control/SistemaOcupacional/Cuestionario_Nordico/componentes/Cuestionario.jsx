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
    <div className="flex w-full text-xl">
      <div className="w-[60%] flex flex-col">
        <div className="flex flex-col justify-center">
          <h2 className="text-center font-semibold mb-4">
            ¿Cuántos años y meses ha estado Ud. haciendo el presente tipo de trabajo?
          </h2>
          <div className="flex w-auto items-center my-2">
            <label className="w-80 text-right" htmlFor="anios">
              Años:
            </label>
            <input
              id="anios"
              value={form.anios}
              onChange={handleChangeNumber}
              type="text"
              name="anios"
              className="w-20 border rounded px-2 py-1 mx-2"
            />
            <label htmlFor="meses" className="ml-4">
              Meses
            </label>
            <input
              id="meses"
              value={form.meses}
              onChange={handleChangeNumber}
              type="text"
              name="meses"
              className="w-20 border rounded px-2 py-1 mx-2"
            />
          </div>
          <div className="flex w-auto items-center my-2">
            <label className="text-right" htmlFor="horasTrabajadas">
              En promedio, ¿cuántas horas a la semana trabaja?:
            </label>
            <input
              id="horasTrabajadas"
              type="text"
              value={form.horasTrabajadas}
              onChange={handleChangeNumber}
              name="horasTrabajadas"
              className="w-20 border rounded px-2 py-1 mx-2"
            />
          </div>
          <div className="flex w-auto items-center my-2">
            <label className="w-80 text-right" htmlFor="">
              Es Ud.:
            </label>
            <label htmlFor="" className="ml-3">
              Diestro
            </label>
            <input
              onChange={handleDiestroZurdo}
              checked={form.esDiestro}
              type="checkbox"
              name="esDiestro"
              className="m-2"
            />
            <label htmlFor="" className="ml-4">
              Zurdo
            </label>
            <input
              onChange={handleDiestroZurdo}
              checked={form.esZurdo}
              type="checkbox"
              name="esZurdo"
              className="m-2"
            />
          </div>
          <h1 className="font-bold mt-3">
            2.- Problemas con los órganos de la locomoción
          </h1>
          <h2 className="text-center mt-5 mb-6">
            ¿Cómo responder el cuestionario?
          </h2>
          <p>
            En este dibujo Ud. puede ver la posición aproximada de las partes del
            cuerpo referidos en el cuestionario.
          </p>
          <p className="mt-2">
            Ud. debe decidir cuál parte tiene o ha tenido molestias / problema (si
            lo ha tenido), por favor responda poniendo una x en el respectivo
            recuadro para cada pregunta.
          </p>
        </div>
      </div>
      <div className="w-[40%] flex flex-col">
        <img src="img/Nordico/nordico.png" alt="" />
      </div>
    </div>
  );
};

export default Cuestionario;
