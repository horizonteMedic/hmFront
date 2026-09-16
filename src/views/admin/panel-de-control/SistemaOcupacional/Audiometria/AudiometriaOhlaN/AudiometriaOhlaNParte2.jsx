import React from "react";
import { getToday } from "../../../../../utils/helpers";
import SectionFieldset from "../../../../../components/reusableComponents/SectionFieldset";
import InputTextOneLine from "../../../../../components/reusableComponents/InputTextOneLine";
import InputCheckbox from "../../../../../components/reusableComponents/InputCheckbox";
import InputsRadioGroup from "../../../../../components/reusableComponents/InputsRadioGroup";
import RadioTable from "../../../../../components/reusableComponents/RadioTable";

const today = getToday();

export default function AudiometriaOhlaNParte2({ form, setForm }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleChangeNumber = (e) => {
    const { name, value } = e.target;
    if (/^\d*$/.test(value)) {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const toggleCheckBox = (e) => {
    const { name } = e.target;
    setForm((f) => ({
      ...f,
      [name]: !f[name],
    }));
  };

  const handleCheckRadio = (e, value) => {
    const { name } = e.target;
    setForm((f) => {
      const nuevoValor = f[name] === value.toUpperCase() ? "" : value.toUpperCase();
      return {
        ...f,
        [name]: nuevoValor,
        ...(name === "otro" && nuevoValor === "NO" ? { otroDescripcion: "" } : {}),
      };
    });
  };

  const handleCheckRadioExposicion = (e, objetivo) => {
    const { name } = e.target;
    setForm((f) => ({
      ...f,
      [name]: f[name].toUpperCase().includes(objetivo)
        ? ""
        : /\d/.test(f[name])
          ? f[name] + " " + objetivo
          : " " + objetivo,
    }));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Columna izquierda */}
        <div className="space-y-4">
          <SectionFieldset legend="Datos del Examen" className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <InputTextOneLine
                label="Años Trab."
                name="aniosTrabajo"
                value={form.aniosTrabajo}
                onChange={handleChangeNumber}
                labelWidth="90px"
              />
              <InputTextOneLine
                label="Meses"
                name="mesesTrabajo"
                value={form.mesesTrabajo}
                onChange={handleChangeNumber}
                labelWidth="90px"
              />
              <InputTextOneLine
                label="Otoscopia"
                name="otoscopia"
                value={form.otoscopia}
                onChange={handleChange}
                labelWidth="90px"
              />
            </div>
          </SectionFieldset>

          <SectionFieldset legend="Audiómetro" className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <InputTextOneLine
                label="Marca"
                name="marca"
                value={form.marca}
                disabled
                labelWidth="100px"
                className="flex-1"
              />
              <div className="flex flex-wrap gap-4">
                <InputCheckbox
                  label="No Examen"
                  name="noExamen"
                  checked={form.noExamen}
                  onChange={() => {
                    const nuevoValor = !form.noExamen;
                    setForm((prev) => ({
                      ...prev,
                      noExamen: nuevoValor,
                      marca: nuevoValor ? "-" : "AMPLIVOX",
                      modelo: nuevoValor ? "-" : "AMPLIVOX 270",
                      calibracion: today,
                      bellPlus: false,
                      maico: false,
                    }));
                  }}
                />
                <InputCheckbox
                  label="BELL PLUS"
                  name="bellPlus"
                  checked={form.bellPlus}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setForm((prev) => ({
                      ...prev,
                      bellPlus: checked,
                      marca: checked ? "BELL INVENTIS" : "AMPLIVOX",
                      modelo: checked ? "BELL PLUS" : "AMPLIVOX 270",
                      calibracion: today,
                      noExamen: false,
                    }));
                  }}
                />
                <InputCheckbox
                  label="MAICO"
                  name="maico"
                  checked={form.maico}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setForm((prev) => ({
                      ...prev,
                      maico: checked,
                      marca: checked ? "MAICO" : "AMPLIVOX",
                      modelo: checked ? "MA 28" : "AMPLIVOX 270",
                      calibracion: today,
                      noExamen: false,
                    }));
                  }}
                />
              </div>
            </div>
            <InputTextOneLine label="Modelo" name="modelo" value={form.modelo} disabled labelWidth="100px" />
            <InputTextOneLine
              label="Calibración"
              name="calibracion"
              type="date"
              value={form.calibracion}
              onChange={handleChange}
              labelWidth="100px"
            />
          </SectionFieldset>

          <SectionFieldset legend="Tiempo de Exposición Total Ponderado 8h/d" className="space-y-3">
            <InputTextOneLine
              name="tiempoExposicion"
              value={form.tiempoExposicion}
              onChange={handleChange}
              labelWidth="0px"
            />
            <div className="flex gap-4">
              <InputCheckbox
                label="H/D"
                name="tiempoExposicion"
                checked={form.tiempoExposicion.includes("H/D")}
                onChange={(e) => handleCheckRadioExposicion(e, "H/D")}
              />
              <InputCheckbox
                label="MIN/D"
                name="tiempoExposicion"
                checked={form.tiempoExposicion.includes("MIN/D")}
                onChange={(e) => handleCheckRadioExposicion(e, "MIN/D")}
              />
            </div>
          </SectionFieldset>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <SectionFieldset legend="Uso de Protectores Auditivos" className="flex gap-4">
              <InputCheckbox
                label="Tapones"
                name="tapones"
                checked={form.tapones}
                onChange={toggleCheckBox}
              />
              <InputCheckbox
                label="Orejeras"
                name="orejeras"
                checked={form.orejeras}
                onChange={toggleCheckBox}
              />
            </SectionFieldset>
            <SectionFieldset legend="Apreciación del Ruido">
              <InputsRadioGroup
                name="apreciacion_ruido"
                value={form.apreciacion_ruido}
                options={[
                  { label: "Muy intenso", value: "RUIDO MUY INTENSO" },
                  { label: "Moderado", value: "RUIDO MODERADO" },
                  { label: "No molesto", value: "RUIDO NO MOLESTO" },
                ]}
                onChange={(e, value) => setForm((f) => ({ ...f, apreciacion_ruido: value }))}
                vertical
              />
            </SectionFieldset>
          </div>

          <SectionFieldset legend="Antecedentes Relacionados">
            <RadioTable
              form={form}
              items={[
                { label: "Consumo de tabaco", name: "consumo_tabaco" },
                { label: "Servicio Militar", name: "servicio_militar" },
                { label: "Hobbies con exposición a ruido", name: "hobbies_ruido" },
                { label: "Exposición laboral a químicos", name: "exposicion_quimicos" },
                { label: "Infección al Oído", name: "infeccion_oido" },
                { label: "Uso de Ototoxicos", name: "uso_ototoxicos" },
              ]}
              options={[
                { value: "SI", label: "SI" },
                { value: "NO", label: "NO" },
              ]}
              handleRadioButton={handleCheckRadio}
              labelColumns={2}
            />
          </SectionFieldset>
        </div>

        {/* Columna derecha */}
        <div className="space-y-4">
          <SectionFieldset legend="Síntomas Actuales">
            <RadioTable
              form={form}
              items={[
                { label: "Disminución de la audición", name: "disminucion_audicion" },
                { label: "Dolor de Oídos", name: "dolor_oidos" },
                { label: "Zumbido", name: "zumbido" },
                { label: "Mareos", name: "mareos" },
                { label: "Infección al Oído", name: "infeccion_oido_actual" },
                {
                  label: "Otra",
                  name: "otro",
                  extraContent: (
                    <InputTextOneLine
                      name="otroDescripcion"
                      value={form.otroDescripcion}
                      onChange={handleChange}
                      disabled={form.otro !== "SI"}
                      labelWidth="0px"
                    />
                  ),
                },
              ]}
              options={[
                { value: "SI", label: "SI" },
                { value: "NO", label: "NO" },
              ]}
              handleRadioButton={handleCheckRadio}
              labelColumns={2}
            />
          </SectionFieldset>

          <SectionFieldset legend="Diapasones Rinne y Weber" className="px-2">
            <table className="w-full">
              <thead>
                <tr className="text-center">
                  <th className="py-2">O.D</th>
                  <th className="py-2">Frecuencia</th>
                  <th className="py-2">O.I</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "250 Hz.", key: "250" },
                  { label: "500 Hz.", key: "500" },
                  { label: "1000 Hz.", key: "1000" },
                ].map((hz) => (
                  <tr key={hz.key}>
                    <td className="px-1">
                      <InputTextOneLine
                        name={`od_${hz.key}`}
                        value={form[`od_${hz.key}`]}
                        onChange={handleChange}
                        labelWidth="0px"
                        inputClassName="text-center"
                      />
                    </td>
                    <td className="text-center py-1">{hz.label}</td>
                    <td className="px-1">
                      <InputTextOneLine
                        name={`oi_${hz.key}`}
                        value={form[`oi_${hz.key}`]}
                        onChange={handleChange}
                        labelWidth="0px"
                        inputClassName="text-center"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </SectionFieldset>

          <SectionFieldset legend="Logoaudiometría" className="px-2">
            <table className="w-full">
              <thead>
                <tr className="text-left">
                  <th className="py-2"></th>
                  <th className="text-center py-2">Derecha</th>
                  <th className="text-center py-2">Izquierda</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "Umbral de discriminación", key: "umbral_discriminacion" },
                  { label: "% de discriminación", key: "porcentaje" },
                  { label: "Umbral de Confort MCL", key: "umbral_confort" },
                  { label: "Umbral de Disconfort UCL", key: "umbral_disconfort" },
                ].map((item) => (
                  <tr key={item.key}>
                    <td className="py-1 pr-2">{item.label}</td>
                    <td className="px-1">
                      <InputTextOneLine
                        name={`d_${item.key}`}
                        value={form[`d_${item.key}`]}
                        onChange={handleChange}
                        labelWidth="0px"
                        inputClassName="text-center"
                      />
                    </td>
                    <td className="px-1">
                      <InputTextOneLine
                        name={`i_${item.key}`}
                        value={form[`i_${item.key}`]}
                        onChange={handleChange}
                        labelWidth="0px"
                        inputClassName="text-center"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </SectionFieldset>

          <SectionFieldset legend="Conclusiones">
            <InputTextOneLine
              name="conclusiones"
              value={form.conclusiones}
              onChange={handleChange}
              labelWidth="0px"
            />
          </SectionFieldset>
        </div>
      </div>
    </div>
  );
}
