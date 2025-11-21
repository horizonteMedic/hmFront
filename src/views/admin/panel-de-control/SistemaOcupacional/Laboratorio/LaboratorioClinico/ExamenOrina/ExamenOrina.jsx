import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint, faSave, faBroom } from '@fortawesome/free-solid-svg-icons';
import { PrintHojaR, SubmitHematologiaLabCLinico } from './controllerExamenOrina';
import { useSessionData } from '../../../../../../hooks/useSessionData';
import Swal from 'sweetalert2';
import {
  InputTextOneLine,
  InputTextArea,
  InputCheckbox,
  InputsRadioGroup,
} from '../../../../../../components/reusableComponents/ResusableComponents';
import SectionFieldset from '../../../../../../components/reusableComponents/SectionFieldset';

const physicalLabels = ['Incoloro', 'Medicamentosa', 'Transparente', 'Turbio', 'No Aplica'];
const chemicalLabels = ['Nitritos', 'Proteínas', 'Cetonas', 'LeucocitosQ', 'AcAscorbico', 'Urobilinogeno', 'Bilirrubina', 'GlucosaQ', 'Sangre'];
const sedimentLabels = ['LeucocitosS', 'Hematies', 'CelEpiteliales', 'Cristales', 'Cilindros', 'Bacterias', 'GramSC', 'Otros'];
const drugLabels = ['Cocaina', 'Marihuana'];

const initialForm = {
  Incoloro: false,
  Medicamentosa: false,
  Transparente: false,
  Turbio: false,
  NoAplica: false,
  Color: 'AMARILLO CLARO',
  Aspecto: 'TRANSPARENTE',
  Densidad: '',
  PH: '',
  Nitritos: 'NEGATIVO',
  Proteínas: 'NEGATIVO',
  Cetonas: 'NEGATIVO',
  LeucocitosQ: 'NEGATIVO',
  AcAscorbico: 'NEGATIVO',
  Urobilinogeno: 'NEGATIVO',
  Bilirrubina: 'NEGATIVO',
  GlucosaQ: 'NEGATIVO',
  Sangre: 'NEGATIVO',
  LeucocitosS: '0-0',
  Hematies: '0-1',
  CelEpiteliales: 'ESCASAS',
  Cristales: 'NO SE OBSERVAN',
  Cilindros: 'NO SE OBSERVAN',
  Bacterias: 'NO SE OBSERVAN',
  GramSC: 'NO SE OBSERVAN',
  Otros: 'NO SE OBSERVAN',
  Cocaina: '',
  Marihuana: '',
  ScreeningPos: false,
  ScreeningNeg: false,
  ScreeningNA: false,
  ConfirmPos: false,
  ConfirmNeg: false,
  ConfirmNA: false,
  observaciones: '',
  // printValue: ''
};

export default function ExamenOrina({ form, setForm, formH, ClearForm, setFormH, ClearFormO }) {
  const { token, userlogued } = useSessionData();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name, checked) => {
    setForm(prev => ({ ...prev, [name]: checked }));
  };

  const handleClear = () => {
    setForm(initialForm);
    if (ClearForm) ClearForm();
    if (ClearFormO) ClearFormO();
  };

  const handlePrint = () => {
    if (!formH.norden) return Swal.fire('Error', 'Debe colocar un N° Orden', 'error');
    Swal.fire({
      title: '¿Desea Imprimir Laboratorio Clinico?',
      html: `<div style='font-size:1.1em;margin-top:8px;'><b style='color:#5b6ef5;'>N° Orden: ${formH.norden}</b></div>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, Imprimir',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        PrintHojaR(formH.norden, token);
      }
    });
  };

  const handleDrugRadio = (drug, value) => {
    setForm(prev => ({
      ...prev,
      [drug]: value === 'Pos' ? 'POSITIVO' : value === 'Neg' ? 'NEGATIVO' : 'N/A',
    }));
  };

  const handleNoAplicaChange = (checked) => {
    if (checked) {
      setForm(prev => {
        const newForm = { ...prev };
        Object.keys(newForm).forEach(key => {
          if (typeof newForm[key] === 'string' && key !== 'observaciones') {
            newForm[key] = 'N/A';
          }
          if (['ScreeningPos', 'ScreeningNeg', 'ScreeningNA', 'ConfirmPos', 'ConfirmNeg', 'ConfirmNA'].includes(key)) {
            newForm[key] = false;
          }
        });
        newForm.Cocaina = 'N/A';
        newForm.Marihuana = 'N/A';
        newForm.observaciones = '';
        newForm.NoAplica = true;
        return newForm;
      });
    } else {
      setForm(initialForm);
    }
  };

  const handleSave = () => {
    SubmitHematologiaLabCLinico(formH, form, token, userlogued, handleClear);
  };

  return (
    <div className="p-4 space-y-3">
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
                  onChange={(e) => {
                    if (opt === 'No Aplica') {
                      handleNoAplicaChange(e.target.checked);
                    } else {
                      handleCheckboxChange(opt, e.target.checked);
                    }
                  }}
                  disabled={opt !== 'No Aplica'}
                />
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid grid-cols-2 gap-2 items-center">
                <label className="font-medium">Color:</label>
                <select name="Color" value={form.Color} onChange={handleInputChange} className="border rounded p-1 w-full">
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
                <select name="Aspecto" value={form.Aspecto} onChange={handleInputChange} className="border rounded p-1 w-full">
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
                onChange={handleInputChange}
                labelWidth="100px"
              />
              <InputTextOneLine
                label="PH"
                name="PH"
                value={form.PH}
                onChange={handleInputChange}
                labelWidth="100px"
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
                      onChange={handleInputChange}
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
                    onChange={handleInputChange}
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
                  onChange={handleInputChange}
                />
                <InputsRadioGroup
                  name={`${drug}_result`}
                  value={form[drug] === 'POSITIVO' ? 'Pos' : form[drug] === 'NEGATIVO' ? 'Neg' : 'NA'}
                  onChange={(e, value) => handleDrugRadio(drug, value)}
                  options={[
                    { label: 'Pos.', value: 'Pos' },
                    { label: 'Neg.', value: 'Neg' },
                    { label: 'N/A', value: 'NA' }
                  ]}
                  groupClassName="gap-2"
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
          onChange={handleInputChange}
          rows={4}
        />
      </SectionFieldset>

      {/* Botones y Imprimir en una sola línea */}
      <div className="flex items-center justify-between gap-4 pt-2 border-t">
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faSave} /> Grabar
          </button>
          <button
            onClick={handleClear}
            className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faBroom} /> Limpiar
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-blue-900 italic">Imprimir</span>
          <InputTextOneLine
            name="norden"
            value={formH.norden}
            onChange={(e) => setFormH(prev => ({ ...prev, norden: e.target.value }))}
            inputClassName="w-28"
          />
          <button
            onClick={handlePrint}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faPrint} />
          </button>
        </div>
      </div>
    </div>
  );
}
