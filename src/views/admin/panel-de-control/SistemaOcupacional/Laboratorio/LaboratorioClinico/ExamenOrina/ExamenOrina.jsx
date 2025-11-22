import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint, faSave, faBroom } from '@fortawesome/free-solid-svg-icons';
import {
  InputTextOneLine,
  InputTextArea,
  InputCheckbox,
  InputsRadioGroup,
} from '../../../../../../components/reusableComponents/ResusableComponents';
import SectionFieldset from '../../../../../../components/reusableComponents/SectionFieldset';

const physicalLabels = ['No Aplica'];
const chemicalLabels = ['Nitritos', 'Proteínas', 'Cetonas', 'LeucocitosQ', 'AcAscorbico', 'Urobilinogeno', 'Bilirrubina', 'GlucosaQ', 'Sangre'];
const sedimentLabels = ['LeucocitosS', 'Hematies', 'CelEpiteliales', 'Cristales', 'Cilindros', 'Bacterias', 'GramSC', 'Otros'];
const drugLabels = ['Cocaina', 'Marihuana'];

//

export default function ExamenOrina({ form, setForm, formH, ClearForm, setFormH, ClearFormO }) {

  return (
    <div className="space-y-3 ">
      {/* Dos columnas: Examen Físico | Examen Químico, Sedimento Unitario | Drogas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Columna 1 */}
        <div className="space-y-6 flex flex-col">
          <SectionFieldset legend="Examen Físico" className="space-y-4 flex-1">
            <div className="grid grid-cols-5 gap-2">
              {physicalLabels.map(opt => (
                <InputCheckbox
                  key={opt}
                  label={opt}
                  name={opt}
                  checked={form[opt]}
                  disabled
                />
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid grid-cols-2 gap-2 items-center">
                <label className="font-medium">Color:</label>
                <select name="Color" value={form.Color} className="border rounded p-1 w-full" disabled>
                  <option>N/A</option>
                  <option>AMARILLO CLARO</option>
                  <option>AMARILLO PAJIZO</option>
                  <option>AMARILLO AMBAR</option>
                  <option>AMBAR</option>
                  <option>INCOLORO</option>
                  <option>MEDICAMENTOSO</option>
                  <option>SANGUINOLENTO</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2 items-center">
                <label className="font-medium">Aspecto:</label>
                <select name="Aspecto" value={form.Aspecto} className="border rounded p-1 w-full" disabled>
                  <option>N/A</option>
                  <option>LIGERAMENTE TURBIO</option>
                  <option>TRANSPARENTE</option>
                  <option>TURBIO</option>
                </select>
              </div>
              <InputTextOneLine
                label="Densidad"
                name="Densidad"
                value={form.Densidad}
                labelWidth="100px"
                disabled
              />
              <InputTextOneLine
                label="PH"
                name="PH"
                value={form.PH}
                labelWidth="100px"
                disabled
              />
            </div>
          </SectionFieldset>

          <SectionFieldset legend="Sedimento Unitario" className="space-y-4 flex-1">
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {sedimentLabels.map((lbl) => (
                <div key={lbl} className="grid grid-cols-2 items-center gap-2">
                  <label className="font-medium">{lbl.replace('Q', '').replace('S', '')}:</label>
                  <div className="flex items-center gap-2">
                    <InputTextOneLine
                      name={lbl}
                      value={form[lbl]}
                      disabled
                    />
                    {(lbl === 'LeucocitosS' || lbl === 'Hematies') && form[lbl] && (
                      <span className="text-xs text-gray-500">x campos</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </SectionFieldset>
        </div>

        {/* Columna 2 */}
        <div className="space-y-6 flex flex-col">
          <SectionFieldset legend="Examen Químico" className="space-y-4 flex-1">
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {chemicalLabels.map((lbl) => (
                <div key={lbl} className="grid grid-cols-2 items-center gap-2">
                  <label className="font-medium">{lbl === "Sangre" ? "Sangre" : lbl.replace('Q', '').replace('S', '')}:</label>
                  <InputTextOneLine
                    name={lbl}
                    value={form[lbl]}
                    disabled
                  />
                </div>
              ))}
            </div>
          </SectionFieldset>

          <SectionFieldset legend="Drogas" className="space-y-2 flex-1">
            {drugLabels.map((drug) => (
              <div key={drug} className="grid grid-cols-[auto,1fr,auto] items-center gap-x-2">
                <label className="font-medium">{drug}:</label>
                <InputTextOneLine
                  name={drug}
                  value={form[drug]}
                  disabled
                />
                <InputsRadioGroup
                  name={`${drug}_result`}
                  value={form[drug] === 'POSITIVO' ? 'Pos' : form[drug] === 'NEGATIVO' ? 'Neg' : 'NA'}
                  options={[
                    { label: 'Pos.', value: 'Pos' },
                    { label: 'Neg.', value: 'Neg' },
                    { label: 'N/A', value: 'NA' }
                  ]}
                  groupClassName="gap-2"
                  disabled
                />
              </div>
            ))}
          </SectionFieldset>
        </div>
      </div>

      {/* Observaciones - columna completa */}
      <SectionFieldset legend="Observaciones" className="space-y-4">
        <InputTextArea
          name="observaciones"
          value={form.observaciones}
          rows={4}
          disabled
        />
      </SectionFieldset>

      {/* Botones y Imprimir en una sola línea */}
      <div className="flex items-center justify-between gap-4 pt-2 border-t">
        <div className="flex gap-2">
          <button
            className="bg-emerald-600 text-white px-4 py-2 rounded flex items-center gap-2 opacity-60 cursor-not-allowed"
            disabled
          >
            <FontAwesomeIcon icon={faSave} /> Grabar
          </button>
          <button
            className="bg-yellow-400 text-white px-4 py-2 rounded flex items-center gap-2 opacity-60 cursor-not-allowed"
            disabled
          >
            <FontAwesomeIcon icon={faBroom} /> Limpiar
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-blue-900 italic">Imprimir</span>
          <InputTextOneLine
            name="norden"
            value={formH.norden}
            inputClassName="w-28"
            disabled
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 opacity-60 cursor-not-allowed"
            disabled
          >
            <FontAwesomeIcon icon={faPrint} />
          </button>
        </div>
      </div>
    </div>
  );
}
