import InputsRadioGroup from "../../../../../components/reusableComponents/InputsRadioGroup";
import { InputCheckbox, InputTextArea, InputTextOneLine, SectionFieldset } from "../../../../../components/reusableComponents/ResusableComponents";

export default function LugarDeTrabajo({ form, handleCheckBoxChange, handleChange, handleChangeNumber, setForm, handleRadioButton }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-3">
      {/* Columna Izquierda */}
      <div className="space-y-3">
        {/* Tipo de respirador */}
        <SectionFieldset legend="Tipo de respirador(es) a utilizar" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-3 gap-x-4">
            <InputCheckbox label="Máscara de polvo" name="respiradorMascaraPolvo" checked={form?.respiradorMascaraPolvo} onChange={handleCheckBoxChange} />
            <InputCheckbox label="½ cara" name="respiradorMediaCara" checked={form?.respiradorMediaCara} onChange={handleCheckBoxChange} />
            <InputCheckbox label="Cara completa" name="respiradorCaraCompleta" checked={form?.respiradorCaraCompleta} onChange={handleCheckBoxChange} />
          </div>
          <InputsRadioGroup
            name="tipoRespiradorTipo"
            vertical
            value={form?.tipoRespiradorTipo}
            onChange={handleRadioButton}
            options={[
              { label: "Purificador de aire (sin energía)", value: "PURIFICADOR_SIN_ENERGIA" },
              { label: "Purificador de aire (con energía)", value: "PURIFICADOR_CON_ENERGIA" },
              { label: "Respirador suministrador de atmósfera", value: "SUMINISTRADOR_ATMOSFERA" },
              { label: "Combinación línea de aire SCBA", value: "COMBINACION_LINEA_AIRE_SCBA" },
              { label: "Respirador de Flujo Continuo", value: "FLUJO_CONTINUO" },
              { label: "Respirador suministrador de aire", value: "SUMINISTRO_AIRE" },
              { label: "SCBA de circuito abierto", value: "SCBA_CIRCUITO_ABIERTO" },
              { label: "SCBA de circuito cerrado", value: "SCBA_CIRCUITO_CERRADO" },
            ]}
          />
        </SectionFieldset>

        {/* Tipo de Protección */}
        <SectionFieldset legend="Tipo de Protección">
          <InputsRadioGroup
            name="tipoProteccion"
            vertical
            value={form?.tipoProteccion}
            onChange={handleRadioButton}
            options={[
              { label: "Filtro HEPA (partículas)", value: "FILTRO_HEPA" },
              { label: "Cartuchos (Gas ácido)", value: "CARTUCHO_GAS_ACIDO" },
              { label: "Cartuchos (Vapor Orgánico)", value: "CARTUCHO_VAPOR_ORGANICO" },
              { label: "Cartuchos (amoniaco)", value: "CARTUCHO_AMONIACO" },
              { label: "Cartuchos (Mercurio)", value: "CARTUCHO_MERCURIO" },
            ]}
          />
        </SectionFieldset>

        {/* Esfuerzo Físico */}
        <SectionFieldset legend="Esfuerzo físico esperado requerido" className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3 pb-1">
            <InputsRadioGroup
              name="esfuerzoFisico"
              value={form?.esfuerzoFisico}
              onChange={handleRadioButton}
              options={[
                { label: "Ligero", value: "LIGERO" },
                { label: "Moderado", value: "MODERADO" },
                { label: "Pesado", value: "PESADO" },
              ]}
            />
          </div>
          <p><span className="font-semibold">Ligero:</span> Sentado mientras escribe, tipea, manejo manual de cargas ligero (3 mets)</p>
          <p><span className="font-semibold">Moderado:</span> Manejo manual de cargas menores de 15 Kg, operando equipos (5 mets)</p>
          <p><span className="font-semibold">Pesado:</span> Manejo de cargas encima de 25 Kg, subiendo escaleras con carga, palaneando (&gt;5 mets)</p>
        </SectionFieldset>
      </div>

      {/* Columna Derecha */}
      <div className="space-y-3">
        {/* Frecuencia de uso */}
        <SectionFieldset legend="Frecuencia de uso" className="space-y-4">
          <InputsRadioGroup
            name="frecuenciaUso"
            vertical
            value={form?.frecuenciaUso}
            onChange={handleRadioButton}
            options={[
              { label: "De manera diaria", value: "DIARIO" },
              { label: "Ocasional - pero no más de dos veces por semana: hrs", value: "OCASIONAL" },
              { label: "Rara vez - uso de emergencia solamente", value: "EMERGENCIA" },
            ]}
          />
          <InputTextOneLine
            label="Promedio de horas de uso por Día (Hrs.)"
            name="promedioHorasDia"
            value={form?.promedioHorasDia}
            onChange={handleChangeNumber}
            labelWidth="220px"
          />
        </SectionFieldset>

        {/* Exposición de Materiales Peligros */}
        <SectionFieldset legend="Exposición de Materiales Peligros" className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-2">
          <InputCheckbox label="Humo de Metal" name="expHumoMetal" checked={form?.expHumoMetal} onChange={handleCheckBoxChange} />
          <InputCheckbox label="Vapor Orgánico" name="expVaporOrganico" checked={form?.expVaporOrganico} onChange={handleCheckBoxChange} />
          <InputCheckbox label="Arsénico" name="expArsenico" checked={form?.expArsenico} onChange={handleCheckBoxChange} />
          <InputCheckbox label="Amoniaco" name="expAmoniaco" checked={form?.expAmoniaco} onChange={handleCheckBoxChange} />
          <InputCheckbox label="Plomo" name="expPlomo" checked={form?.expPlomo} onChange={handleCheckBoxChange} />
          <InputCheckbox label="Polvo Respirable" name="expPolvoRespirable" checked={form?.expPolvoRespirable} onChange={handleCheckBoxChange} />
          <InputCheckbox label="Asbesto" name="expAsbesto" checked={form?.expAsbesto} onChange={handleCheckBoxChange} />
          <InputCheckbox label="Sílice" name="expSilice" checked={form?.expSilice} onChange={handleCheckBoxChange} />
          <InputCheckbox label="DPM" name="expDpm" checked={form?.expDpm} onChange={handleCheckBoxChange} />
          <InputCheckbox label="Mercurio" name="expMercurio" checked={form?.expMercurio} onChange={handleCheckBoxChange} />
          <InputCheckbox label="Monóxido de Carbono" name="expMonoxidoCarbono" checked={form?.expMonoxidoCarbono} onChange={handleCheckBoxChange} />
          <InputCheckbox label="Dióxido de Carbono" name="expDioxidoCarbono" checked={form?.expDioxidoCarbono} onChange={handleCheckBoxChange} />
          <InputCheckbox label="Otros" name="expOtros" checked={form?.expOtros} onChange={handleCheckBoxChange} />
        </SectionFieldset>
        {/* Condiciones Especiales de Trabajo */}
        <SectionFieldset legend="Condiciones Especiales de Trabajo" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
            <InputCheckbox label="Elevaciones Altas (&gt; 2500 msnm)" name="elevacionesAltas" checked={form?.elevacionesAltas} onChange={handleCheckBoxChange} />
            <InputCheckbox label="Temperaturas Extremas" name="temperaturasExtremas" checked={form?.temperaturasExtremas} onChange={handleCheckBoxChange} />
            <InputCheckbox label="Atmosferas Húmedas" name="atmosferasHumidas" checked={form?.atmosferasHumidas} onChange={handleCheckBoxChange} />
            <InputCheckbox label="Espacios confirmados" name="espaciosConfirmados" checked={form?.espaciosConfirmados} onChange={handleCheckBoxChange} />
            <InputCheckbox label="Atmosferas IDLH" name="atmosferasIDLH" checked={form?.atmosferasIDLH} onChange={handleCheckBoxChange} />
            <InputCheckbox label="Hazmat / Fuego / Rescate Mina" name="hazmatFuegoRescate" checked={form?.hazmatFuegoRescate} onChange={handleCheckBoxChange} />
            <InputCheckbox label="EPP adicional utilizado" name="eppAdicionalUtilizado" checked={form?.eppAdicionalUtilizado} onChange={handleCheckBoxChange} />
            <InputCheckbox label="Otros" name="otrosCondicionesTrabajo"
              checked={form?.otrosCondicionesTrabajo}
              onChange={(e) => { setForm(prev => ({ ...prev, otrosCondicionesTrabajoDescripcion: "" })); handleCheckBoxChange(e); }}
            />
          </div>
          <InputTextArea
            label="Otros"
            name="otrosCondicionesTrabajoDescripcion"
            value={form?.otrosCondicionesTrabajoDescripcion}
            disabled={!form.otrosCondicionesTrabajo}
            onChange={handleChange}
            rows={5}
          />
        </SectionFieldset>
      </div>
    </div>
  );
}