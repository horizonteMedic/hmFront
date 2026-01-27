import { useState } from "react";
import {
  InputTextOneLine,
  InputsBooleanRadioGroup,
} from "../../../../components/reusableComponents/ResusableComponents.jsx";
import SectionFieldset from "../../../../components/reusableComponents/SectionFieldset";
import { DatosPersonalesLaborales } from "../../../../components/templates/Templates";

export default function CuestionarioNordico() {
  const [form, setForm] = useState({
    norden: "",
    fecha: "",
    nombreExamen: "CUESTIONARIO NÓRDICO",
    esApto: undefined,

    dni: "",
    nombres: "",
    apellidos: "",
    fechaNacimiento: "",
    lugarNacimiento: "",
    edad: "",
    sexo: "",
    estadoCivil: "",
    nivelEstudios: "",

    empresa: "",
    contrata: "",
    ocupacion: "",
    cargoDesempenar: "",

    // AÑOS LABORALES (nuevo cpm)
    aniosTrabajo: "",
    mesesTrabajo: "",
    horasSemana: "",
    manoDominante: "",

    //para la imagen img/cuestionarioNordico
    cuello_12m: undefined,
    cuello_impidio: undefined,
    cuello_7d: undefined,

    hombros_12m: undefined,
    hombros_impidio: undefined,
    hombros_7d: undefined,

    codos_12m: undefined,
    codos_impidio: undefined,
    codos_7d: undefined,

    munecas_12m: undefined,
    munecas_impidio: undefined,
    munecas_7d: undefined,

    espaldaAlta_12m: undefined,
    espaldaAlta_impidio: undefined,
    espaldaAlta_7d: undefined,

    espaldaBaja_12m: undefined,
    espaldaBaja_impidio: undefined,
    espaldaBaja_7d: undefined,

  });

  const handleChangeSimple = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleRadioButtonBoolean = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  return (
    <div className="space-y-3 px-4 max-w-[90%] xl:max-w-[80%] mx-auto">

      {/* Información del Examen */}
      <SectionFieldset
        legend="Información del Examen"
        className="grid grid-cols-1 2xl:grid-cols-4 gap-3"
      >
        <InputTextOneLine
          label="N° Orden"
          name="norden"
          value={form.norden}
          onChange={handleChangeSimple}
          labelWidth="120px"
        />

        <InputTextOneLine
          label="Fecha"
          name="fecha"
          type="date"
          value={form.fecha}
          onChange={handleChangeSimple}
          labelWidth="120px"
        />

        <InputTextOneLine
          label="Nombre del Examen"
          name="nombreExamen"
          value={form.nombreExamen}
          disabled
          labelWidth="120px"
        />

        <InputsBooleanRadioGroup
          label="Aptitud"
          name="esApto"
          value={form.esApto}
          trueLabel="APTO"
          falseLabel="NO APTO"
          onChange={handleRadioButtonBoolean}
        />
      </SectionFieldset>

      {/* Datos Personales + Laborales  */}
      <DatosPersonalesLaborales form={form} />

<SectionFieldset legend="Años Laborales" className="space-y-3">

  <div className="grid grid-cols-2 gap-4">
    <InputTextOneLine
      label="Años"
      name="aniosTrabajo"
      type="number"
      value={form.aniosTrabajo}
      onChange={handleChangeSimple}
    />

    <InputTextOneLine
      label="Meses"
      name="mesesTrabajo"
      type="number"
      value={form.mesesTrabajo}
      onChange={handleChangeSimple}
    />
  </div>

    {/* trabajo */}
    <div className="grid grid-cols-2">
      <div className="col-span-2">
        <InputTextOneLine
          label="Horas trabajadas"
          name="horasSemana"
          type="number"
          value={form.horasSemana}
          onChange={handleChangeSimple}
        />
      </div>
    </div>

    <InputsBooleanRadioGroup
      label="Es Ud."
      name="manoDominante"
      value={form.manoDominante}
      trueLabel="Diestro"
      falseLabel="Zurdo"
      onChange={handleRadioButtonBoolean}
    />

  </SectionFieldset>

<SectionFieldset legend="Problemas con los órganos de la locomoción">
  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

    {/* Texto explicativo */}
    <div className="space-y-3">
      <h3 className="font-semibold text-center">¿Cómo responder el cuestionario?</h3>

      <p>
        En este dibujo Ud. puede ver la posición aproximada de las partes del cuerpo
        referidos en el cuestionario.
      </p>

      <p>
        Ud. debe decidir cuál parte tiene o ha tenido molestias / problema (si lo ha tenido),
        por favor responda marcando una opción para cada pregunta.
      </p>

      <p className="font-semibold mt-4">
        Para ser respondido por todos:
      </p>
      <p>
        ¿Ha tenido Ud. durante cualquier tiempo en los últimos 12 meses problemas
        (molestias, dolor o disconfort) en:
      </p>

      <p className="font-semibold mt-4">
        Para quienes han tenido problemas:
      </p>
      <p>
        ¿Ha estado impedido durante los pasados 12 meses para hacer sus rutinas habituales?
      </p>

      <p>
        ¿Ha tenido problemas durante los últimos 7 días?
      </p>
    </div>

    {/* Imagen */}
    <div className="flex justify-center items-center">
      <img
        src="/img/Nordico/nordico.png"
        alt="Mapa corporal cuestionario nórdico"
        className="max-w-full h-auto border rounded"
      />
    </div>

  </div>

  {/* Tabla de partes del cuerpo */}
  <div className="mt-6 space-y-4">

    {/* Cabecera */}
    <div className="grid grid-cols-4 font-semibold text-center">
      <div>Parte del cuerpo</div>
      <div>Últimos 12 meses</div>
      <div>Impidió actividades</div>
      <div>Últimos 7 días</div>
    </div>

    {/* Cuello */}
    <div className="grid grid-cols-4 items-center gap-2">
      <div>Cuello</div>

      <InputsBooleanRadioGroup
        name="cuello_12m"
        value={form.cuello_12m}
        trueLabel="Si"
        falseLabel="No"
        onChange={handleRadioButtonBoolean}
      />

      <InputsBooleanRadioGroup
        name="cuello_impidio"
        value={form.cuello_impidio}
        trueLabel="Si"
        falseLabel="No"
        onChange={handleRadioButtonBoolean}
      />

      <InputsBooleanRadioGroup
        name="cuello_7d"
        value={form.cuello_7d}
        trueLabel="Si"
        falseLabel="No"
        onChange={handleRadioButtonBoolean}
      />
    </div>

    {/* Hombros */}
    <div className="grid grid-cols-4 items-center gap-2">
      <div>Hombros</div>

      <InputsBooleanRadioGroup
        name="hombros_12m"
        value={form.hombros_12m}
        trueLabel="Si"
        falseLabel="No"
        onChange={handleRadioButtonBoolean}
      />

      <InputsBooleanRadioGroup
        name="hombros_impidio"
        value={form.hombros_impidio}
        trueLabel="Si"
        falseLabel="No"
        onChange={handleRadioButtonBoolean}
      />

      <InputsBooleanRadioGroup
        name="hombros_7d"
        value={form.hombros_7d}
        trueLabel="Si"
        falseLabel="No"
        onChange={handleRadioButtonBoolean}
      />
    </div>

    {/* Codos */}
    <div className="grid grid-cols-4 items-center gap-2">
      <div>Codos</div>

      <InputsBooleanRadioGroup
        name="codos_12m"
        value={form.codos_12m}
        trueLabel="Si"
        falseLabel="No"
        onChange={handleRadioButtonBoolean}
      />

      <InputsBooleanRadioGroup
        name="codos_impidio"
        value={form.codos_impidio}
        trueLabel="Si"
        falseLabel="No"
        onChange={handleRadioButtonBoolean}
      />

      <InputsBooleanRadioGroup
        name="codos_7d"
        value={form.codos_7d}
        trueLabel="Si"
        falseLabel="No"
        onChange={handleRadioButtonBoolean}
      />
    </div>

    {/* Muñecas */}
    <div className="grid grid-cols-4 items-center gap-2">
      <div>Muñecas / Manos</div>

      <InputsBooleanRadioGroup
        name="munecas_12m"
        value={form.munecas_12m}
        trueLabel="Si"
        falseLabel="No"
        onChange={handleRadioButtonBoolean}
      />

      <InputsBooleanRadioGroup
        name="munecas_impidio"
        value={form.munecas_impidio}
        trueLabel="Si"
        falseLabel="No"
        onChange={handleRadioButtonBoolean}
      />

      <InputsBooleanRadioGroup
        name="munecas_7d"
        value={form.munecas_7d}
        trueLabel="Si"
        falseLabel="No"
        onChange={handleRadioButtonBoolean}
      />
    </div>

    {/* Espalda alta */}
    <div className="grid grid-cols-4 items-center gap-2">
      <div>Espalda Alta (Tórax)</div>

      <InputsBooleanRadioGroup
        name="espaldaAlta_12m"
        value={form.espaldaAlta_12m}
        trueLabel="Si"
        falseLabel="No"
        onChange={handleRadioButtonBoolean}
      />

      <InputsBooleanRadioGroup
        name="espaldaAlta_impidio"
        value={form.espaldaAlta_impidio}
        trueLabel="Si"
        falseLabel="No"
        onChange={handleRadioButtonBoolean}
      />

      <InputsBooleanRadioGroup
        name="espaldaAlta_7d"
        value={form.espaldaAlta_7d}
        trueLabel="Si"
        falseLabel="No"
        onChange={handleRadioButtonBoolean}
      />
    </div>

    {/* Espalda baja */}
    <div className="grid grid-cols-4 items-center gap-2">
      <div>Espalda Baja (Lumbar)</div>

      <InputsBooleanRadioGroup
        name="espaldaBaja_12m"
        value={form.espaldaBaja_12m}
        trueLabel="Si"
        falseLabel="No"
        onChange={handleRadioButtonBoolean}
      />

      <InputsBooleanRadioGroup
        name="espaldaBaja_impidio"
        value={form.espaldaBaja_impidio}
        trueLabel="Si"
        falseLabel="No"
        onChange={handleRadioButtonBoolean}
      />

      <InputsBooleanRadioGroup
        name="espaldaBaja_7d"
        value={form.espaldaBaja_7d}
        trueLabel="Si"
        falseLabel="No"
        onChange={handleRadioButtonBoolean}
      />
    </div>

  </div>
</SectionFieldset>

    </div>
  );
}
