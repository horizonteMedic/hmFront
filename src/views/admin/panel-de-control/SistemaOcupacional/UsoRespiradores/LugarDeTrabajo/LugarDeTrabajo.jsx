import { InputCheckbox, InputTextArea } from "../../../../../components/reusableComponents/ResusableComponents";

export default function LugarDeTrabajo({ form, handleCheckBoxChange, handleChange }) {
  return (
    <div className="p-4 space-y-6">
      {/* Evaluación del Lugar de Trabajo */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">7.1 Evaluación del Lugar de Trabajo</h4>

        {/* Tipo de respirador */}
        <div className="mb-6">
          <h5 className="font-semibold text-gray-700 mb-2">Tipo de respirador(es) a utilizar</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputCheckbox
              label="Máscara de polvo"
              name="respiradorMascaraPolvo"
              checked={form?.respiradorMascaraPolvo}
              onChange={handleCheckBoxChange}
            />
            <InputCheckbox
              label="Media cara"
              name="respiradorMediaCara"
              checked={form?.respiradorMediaCara}
              onChange={handleCheckBoxChange}
            />
            <InputCheckbox
              label="Cara completa"
              name="respiradorCaraCompleta"
              checked={form?.respiradorCaraCompleta}
              onChange={handleCheckBoxChange}
            />
            <InputCheckbox
              label="Purificador de aire (sin energía)"
              name="respiradorPurificadorSinEnergia"
              checked={form?.respiradorPurificadorSinEnergia}
              onChange={handleCheckBoxChange}
            />
            <InputCheckbox
              label="Purificador de aire (con energía)"
              name="respiradorPurificadorConEnergia"
              checked={form?.respiradorPurificadorConEnergia}
              onChange={handleCheckBoxChange}
            />
            <InputCheckbox
              label="Respirador autónomo"
              name="respiradorAutonomo"
              checked={form?.respiradorAutonomo}
              onChange={handleCheckBoxChange}
            />
          </div>
        </div>

        {/* Frecuencia de uso */}
        <div className="mb-6">
          <h5 className="font-semibold text-gray-700 mb-2">Frecuencia de uso</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputCheckbox
              label="Diario"
              name="usoDiario"
              checked={form?.usoDiario}
              onChange={handleCheckBoxChange}
            />
            <InputCheckbox
              label="Semanal"
              name="usoSemanal"
              checked={form?.usoSemanal}
              onChange={handleCheckBoxChange}
            />
            <InputCheckbox
              label="Ocasional"
              name="usoOcasional"
              checked={form?.usoOcasional}
              onChange={handleCheckBoxChange}
            />
            <InputCheckbox
              label="Rara vez (emergencias)"
              name="usoRaraVez"
              checked={form?.usoRaraVez}
              onChange={handleCheckBoxChange}
            />
          </div>
        </div>

        {/* Condiciones de trabajo */}
        <div className="mb-6">
          <h5 className="font-semibold text-gray-700 mb-2">Condiciones Especiales del Trabajo</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputCheckbox
              label="Elevaciones altas"
              name="elevacionesAltas"
              checked={form?.elevacionesAltas}
              onChange={handleCheckBoxChange}
            />
            <InputCheckbox
              label="Temperaturas extremas"
              name="temperaturasExtremas"
              checked={form?.temperaturasExtremas}
              onChange={handleCheckBoxChange}
            />
            <InputCheckbox
              label="Atmósferas húmedas"
              name="atmosferasHumidas"
              checked={form?.atmosferasHumidas}
              onChange={handleCheckBoxChange}
            />
            <InputCheckbox
              label="Espacios confinados"
              name="espaciosConfinados"
              checked={form?.espaciosConfinados}
              onChange={handleCheckBoxChange}
            />
            <InputCheckbox
              label="Atmósferas IDLH"
              name="atmosferasIDLH"
              checked={form?.atmosferasIDLH}
              onChange={handleCheckBoxChange}
            />
            <InputCheckbox
              label="HAZMAT/Fuego/Rescate"
              name="hazmatFuegoRescate"
              checked={form?.hazmatFuegoRescate}
              onChange={handleCheckBoxChange}
            />
            <InputCheckbox
              label="Temperaturas extremas en trabajo"
              name="temperaturasExtremasTrabajo"
              checked={form?.temperaturasExtremasTrabajo}
              onChange={handleCheckBoxChange}
            />
          </div>
        </div>

        {/* Materiales de exposición */}
        <div className="mb-6">
          <h5 className="font-semibold text-gray-700 mb-2">Materiales con potencial exposición</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputCheckbox label="Asbestos" name="matAsbestos" checked={form?.matAsbestos} onChange={handleCheckBoxChange} />
            <InputCheckbox label="Sílice" name="matSilice" checked={form?.matSilice} onChange={handleCheckBoxChange} />
            <InputCheckbox label="Tungsteno/Cobalto" name="matTungstenoCobalto" checked={form?.matTungstenoCobalto} onChange={handleCheckBoxChange} />
            <InputCheckbox label="Berilio" name="matBerilio" checked={form?.matBerilio} onChange={handleCheckBoxChange} />
            <InputCheckbox label="Aluminio" name="matAluminio" checked={form?.matAluminio} onChange={handleCheckBoxChange} />
            <InputCheckbox label="Carbón" name="matCarbon" checked={form?.matCarbon} onChange={handleCheckBoxChange} />
            <InputCheckbox label="Hierro" name="matHierro" checked={form?.matHierro} onChange={handleCheckBoxChange} />
            <InputCheckbox label="Latón" name="matLaton" checked={form?.matLaton} onChange={handleCheckBoxChange} />
            <InputCheckbox label="Exceso de polvo" name="matExcesoPolvo" checked={form?.matExcesoPolvo} onChange={handleCheckBoxChange} />
          </div>
        </div>

        {/* Esfuerzo Físico */}
        <div className="mb-6">
          <h5 className="font-semibold text-gray-700 mb-2">Esfuerzo físico esperado</h5>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputCheckbox label="Ligero" name="esfuerzoLigero" checked={form?.esfuerzoLigero} onChange={handleCheckBoxChange} />
            <InputCheckbox label="Moderado" name="esfuerzoModerado" checked={form?.esfuerzoModerado} onChange={handleCheckBoxChange} />
            <InputCheckbox label="Pesado" name="esfuerzoPesado" checked={form?.esfuerzoPesado} onChange={handleCheckBoxChange} />
          </div>
        </div>

        <InputTextArea
          label="Otros (describir)"
          name="otrosLugarTrabajo"
          value={form?.otrosLugarTrabajo}
          onChange={handleChange}
          rows={3}
        />
      </div>
    </div>
  );
}