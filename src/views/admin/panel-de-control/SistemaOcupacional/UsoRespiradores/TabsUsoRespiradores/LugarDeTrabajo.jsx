import { InputCheckbox, InputTextArea, InputTextOneLine } from "../../../../../components/reusableComponents/ResusableComponents";

export default function LugarDeTrabajo({ form, handleCheckBoxChange, handleChange, handleChangeNumber,setForm }) {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        {/* Diseño principal en dos columnas para mejor lectura */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Columna Izquierda */}
          <div className="space-y-6">
            {/* Tipo de respirador */}
            <div>
              <h5 className="font-bold mb-4">Tipo de respirador(es) a utilizar</h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                <InputCheckbox label="Máscara de polvo" name="respiradorMascaraPolvo" checked={form?.respiradorMascaraPolvo} onChange={handleCheckBoxChange} />
                <InputCheckbox label="½ cara" name="respiradorMediaCara" checked={form?.respiradorMediaCara} onChange={handleCheckBoxChange} />
                <InputCheckbox label="Cara completa" name="respiradorCaraCompleta" checked={form?.respiradorCaraCompleta} onChange={handleCheckBoxChange} />
              </div>

              <div className="grid grid-cols-1 gap-3">
                <InputCheckbox label="Purificador de aire (sin energía)" name="respiradorPurificadorSinEnergia" checked={form?.respiradorPurificadorSinEnergia} onChange={handleCheckBoxChange} />
                <InputCheckbox label="Purificador de aire (con energía)" name="respiradorPurificadorConEnergia" checked={form?.respiradorPurificadorConEnergia} onChange={handleCheckBoxChange} />
                <InputCheckbox label="Respirador suministrador de atmósfera" name="respiradorSuministroAtmosfera" checked={form?.respiradorSuministroAtmosfera} onChange={handleCheckBoxChange} />
                <InputCheckbox label="Combinación línea de aire SCBA" name="respiradorCombinacionLineaAireSCBA" checked={form?.respiradorCombinacionLineaAireSCBA} onChange={handleCheckBoxChange} />
                <InputCheckbox label="Respirador de Flujo Continuo" name="respiradorFlujoContinuo" checked={form?.respiradorFlujoContinuo} onChange={handleCheckBoxChange} />
                <InputCheckbox label="Respirador suministrador de aire" name="respiradorSuministroAire" checked={form?.respiradorSuministroAire} onChange={handleCheckBoxChange} />
                <InputCheckbox label="SCBA de circuito abierto" name="respiradorScbaCircuitoAbierto" checked={form?.respiradorScbaCircuitoAbierto} onChange={handleCheckBoxChange} />
                <InputCheckbox label="SCBA de circuito cerrado" name="respiradorScbaCircuitoCerrado" checked={form?.respiradorScbaCircuitoCerrado} onChange={handleCheckBoxChange} />
              </div>
            </div>

            {/* Tipo de Protección */}
            <div>
              <h5 className="font-bold mb-4">Tipo de Protección</h5>
              <div className="grid grid-cols-1 gap-3">
                <InputCheckbox label="Filtro HEPA (partículas)" name="proteccionFiltroHepa" checked={form?.proteccionFiltroHepa} onChange={handleCheckBoxChange} />
                <InputCheckbox label="Cartuchos (Gas ácido)" name="proteccionCartuchoGasAcido" checked={form?.proteccionCartuchoGasAcido} onChange={handleCheckBoxChange} />
                <InputCheckbox label="Cartuchos (Vapor Orgánico)" name="proteccionCartuchoVaporOrganico" checked={form?.proteccionCartuchoVaporOrganico} onChange={handleCheckBoxChange} />
                <InputCheckbox label="Cartuchos (amoniaco)" name="proteccionCartuchoAmoniaco" checked={form?.proteccionCartuchoAmoniaco} onChange={handleCheckBoxChange} />
                <InputCheckbox label="Cartuchos (Mercurio)" name="proteccionCartuchoMercurio" checked={form?.proteccionCartuchoMercurio} onChange={handleCheckBoxChange} />
              </div>
            </div>

            {/* Esfuerzo Físico */}
            <div>
              <h5 className="font-bold mb-4">Esfuerzo físico esperado requerido</h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                <InputCheckbox label="Ligero" name="esfuerzoLigero" checked={form?.esfuerzoLigero} onChange={handleCheckBoxChange} />
                <InputCheckbox label="Moderado" name="esfuerzoModerado" checked={form?.esfuerzoModerado} onChange={handleCheckBoxChange} />
                <InputCheckbox label="Pesado" name="esfuerzoPesado" checked={form?.esfuerzoPesado} onChange={handleCheckBoxChange} />
              </div>
              <div className="mt-2 space-y-2">
                <p><span className="font-semibold">Ligero:</span> Sentado mientras escribe, tipea, manejo manual de cargas ligero (3 mets)</p>
                <p><span className="font-semibold">Moderado:</span> Manejo manual de cargas menores de 15 Kg, operando equipos (5 mets)</p>
                <p><span className="font-semibold">Pesado:</span> Manejo de cargas encima de 25 Kg, subiendo escaleras con carga, palaneando (&gt;5 mets)</p>
              </div>
            </div>
          </div>

          {/* Columna Derecha */}
          <div className="space-y-6">
            {/* Frecuencia de uso */}
            <div>
              <h5 className="font-bold mb-4">Frecuencia de uso</h5>
              <div className="space-y-2">
                <InputCheckbox label="De manera diaria" name="usoDiario" checked={form?.usoDiario} onChange={handleCheckBoxChange} />
                <InputCheckbox label="Ocasional – pero no más de dos veces por semana: hrs" name="usoOcasionalMenosDosVeces" checked={form?.usoOcasionalMenosDosVeces} onChange={handleCheckBoxChange} />
                <InputCheckbox label="Rara vez – uso de emergencia solamente" name="usoRaraVezEmergencia" checked={form?.usoRaraVezEmergencia} onChange={handleCheckBoxChange} />
                <InputTextOneLine label="Promedio de horas de uso por Día (Hrs.)" name="promedioHorasDia" value={form?.promedioHorasDia} onChange={handleChangeNumber} labelWidth="220px" />
              </div>
            </div>

            {/* Exposición de Materiales Peligros */}
            <div>
              <h5 className="font-bold mb-4">Exposición de Materiales Peligros</h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
              </div>
            </div>
            {/* Condiciones Especiales de Trabajo */}
            <div>
              <h5 className="font-bold mb-4">Condiciones Especiales de Trabajo</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
              <div className="mt-3">
                <InputTextArea label="Otros:" name="otrosCondicionesTrabajoDescripcion" value={form?.otrosCondicionesTrabajoDescripcion} disabled={!form.otrosCondicionesTrabajo} onChange={handleChange} rows={5} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}