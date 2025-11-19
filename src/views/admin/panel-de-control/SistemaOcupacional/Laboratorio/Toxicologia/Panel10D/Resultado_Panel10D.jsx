import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faBroom, faPrint } from '@fortawesome/free-solid-svg-icons';
import { useSessionData } from '../../../../../../hooks/useSessionData';
import { useForm } from '../../../../../../hooks/useForm';
import { getToday } from '../../../../../../utils/helpers';
import { PrintHojaR, SubmitDataService, VerifyTR } from './controller10D';
import {
  InputTextOneLine,
  InputsRadioGroup,
} from '../../../../../../components/reusableComponents/ResusableComponents';
import SectionFieldset from '../../../../../../components/reusableComponents/SectionFieldset';

const tabla = 'panel10d';

export default function Resultado_Panel10D() {
  const { token, userlogued, selectedSede, datosFooter } = useSessionData();
  const today = getToday();

  const initialFormState = {
    norden: '',
    fecha: today,
    nombres: '',
    edad: '',
    valueM: 'NEGATIVO',
    valueC: 'NEGATIVO',
    valueAn: 'NEGATIVO',
    valueMet: 'NEGATIVO',
    valueBen: 'NEGATIVO',
    valueOpi: 'NEGATIVO',
    valueBar: 'NEGATIVO',
    valueMetadona: 'NEGATIVO',
    valueFenci: 'NEGATIVO',
    valueAnti: 'NEGATIVO',
    metodo: 'INMUNOCROMATOGRAFICO',
  };

  const {
    form,
    setForm,
    handleChange,
    handleClear,
    handlePrintDefault,
    handleRadioButton,
  } = useForm(initialFormState, { storageKey: 'panel10d' });

  const handleSave = () => {
    SubmitDataService(form, token, userlogued, handleClear, tabla, datosFooter);
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      setForm((prev) => ({
        ...prev,
        fecha: today,
        nombres: '',
        edad: '',
        valueM: 'NEGATIVO',
        valueC: 'NEGATIVO',
        valueAn: 'NEGATIVO',
        valueMet: 'NEGATIVO',
        valueBen: 'NEGATIVO',
        valueOpi: 'NEGATIVO',
        valueBar: 'NEGATIVO',
        valueMetadona: 'NEGATIVO',
        valueFenci: 'NEGATIVO',
        valueAnti: 'NEGATIVO',
        metodo: 'INMUNOCROMATOGRAFICO',
      }));
      VerifyTR(form.norden, tabla, token, setForm, selectedSede);
    }
  };

  const handlePrint = () => {
    handlePrintDefault(() => {
      PrintHojaR(form.norden, token, tabla, datosFooter);
    });
  };

  const handleRadioChange = (e, value) => {
    handleRadioButton(e, value);
  };
  return (
    <div className="w-full space-y-4 px-4">
      <h2 className="text-2xl font-bold text-center mb-4">PANEL 10D</h2>
      
      <form className="space-y-4">
        {/* Información del Examen */}
        <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <InputTextOneLine
            label="Nro Ficha"
            name="norden"
            value={form.norden}
            onChange={handleChange}
            onKeyUp={handleSearch}
            labelWidth="120px"
          />
          <InputTextOneLine
            label="Fecha"
            name="fecha"
            type="date"
            value={form.fecha}
            onChange={handleChange}
            labelWidth="120px"
          />
          <InputTextOneLine
            label="Nombres"
            name="nombres"
            value={form.nombres}
            disabled
            labelWidth="120px"
          />
          <InputTextOneLine
            label="Edad"
            name="edad"
            value={form.edad}
            disabled
            labelWidth="120px"
            inputClassName="w-20"
          />
        </SectionFieldset>

        {/* Prueba Rápida Cualitativa */}
        <SectionFieldset legend="Prueba Rápida Cualitativa">
          <InputTextOneLine
            name="metodo"
            value={form.metodo}
            onChange={handleChange}
          />
        </SectionFieldset>

        {/* Resultados */}
        <SectionFieldset legend="Resultados">
          <div className="grid grid-cols-3 gap-x-4 gap-y-4">
          <div className="font-bold">PRUEBAS</div>
          <div className="font-bold"></div>
          <div className="font-bold">RESULTADOS</div>
          
          <div className="flex items-center">COCAINA (COC)</div>
          <InputsRadioGroup
            name="valueC"
            value={form.valueC}
            onChange={handleRadioChange}
            options={[
              { label: 'Positivo', value: 'POSITIVO' },
              { label: 'Negativo', value: 'NEGATIVO' }
            ]}
            groupClassName="gap-6"
          />
          <InputTextOneLine
            name="valueC"
            value={form.valueC}
            onChange={handleChange}
            inputClassName="w-32"
          />
          
          <div className="flex items-center">MARIHUANA (THC)</div>
          <InputsRadioGroup
            name="valueM"
            value={form.valueM}
            onChange={handleRadioChange}
            options={[
              { label: 'Positivo', value: 'POSITIVO' },
              { label: 'Negativo', value: 'NEGATIVO' }
            ]}
            groupClassName="gap-6"
          />
          <InputTextOneLine
            name="valueM"
            value={form.valueM}
            onChange={handleChange}
            inputClassName="w-32"
          />
          
          <div className="flex items-center">ANFETAMINA (AMP)</div>
          <InputsRadioGroup
            name="valueAn"
            value={form.valueAn}
            onChange={handleRadioChange}
            options={[
              { label: 'Positivo', value: 'POSITIVO' },
              { label: 'Negativo', value: 'NEGATIVO' }
            ]}
            groupClassName="gap-6"
          />
          <InputTextOneLine
            name="valueAn"
            value={form.valueAn}
            onChange={handleChange}
            inputClassName="w-32"
          />
          
          <div className="flex items-center">METANFETAMINA (MET)</div>
          <InputsRadioGroup
            name="valueMet"
            value={form.valueMet}
            onChange={handleRadioChange}
            options={[
              { label: 'Positivo', value: 'POSITIVO' },
              { label: 'Negativo', value: 'NEGATIVO' }
            ]}
            groupClassName="gap-6"
          />
          <InputTextOneLine
            name="valueMet"
            value={form.valueMet}
            onChange={handleChange}
            inputClassName="w-32"
          />
          
          <div className="flex items-center">BENZODIAZEPINA (BZO)</div>
          <InputsRadioGroup
            name="valueBen"
            value={form.valueBen}
            onChange={handleRadioChange}
            options={[
              { label: 'Positivo', value: 'POSITIVO' },
              { label: 'Negativo', value: 'NEGATIVO' }
            ]}
            groupClassName="gap-6"
          />
          <InputTextOneLine
            name="valueBen"
            value={form.valueBen}
            onChange={handleChange}
            inputClassName="w-32"
          />
          
          <div className="flex items-center">OPIÁCEOS (OPI)</div>
          <InputsRadioGroup
            name="valueOpi"
            value={form.valueOpi}
            onChange={handleRadioChange}
            options={[
              { label: 'Positivo', value: 'POSITIVO' },
              { label: 'Negativo', value: 'NEGATIVO' }
            ]}
            groupClassName="gap-6"
          />
          <InputTextOneLine
            name="valueOpi"
            value={form.valueOpi}
            onChange={handleChange}
            inputClassName="w-32"
          />
          
          <div className="flex items-center">BARBITÚRICOS (BAR)</div>
          <InputsRadioGroup
            name="valueBar"
            value={form.valueBar}
            onChange={handleRadioChange}
            options={[
              { label: 'Positivo', value: 'POSITIVO' },
              { label: 'Negativo', value: 'NEGATIVO' }
            ]}
            groupClassName="gap-6"
          />
          <InputTextOneLine
            name="valueBar"
            value={form.valueBar}
            onChange={handleChange}
            inputClassName="w-32"
          />
          
          <div className="flex items-center">METADONA (MTD)</div>
          <InputsRadioGroup
            name="valueMetadona"
            value={form.valueMetadona}
            onChange={handleRadioChange}
            options={[
              { label: 'Positivo', value: 'POSITIVO' },
              { label: 'Negativo', value: 'NEGATIVO' }
            ]}
            groupClassName="gap-6"
          />
          <InputTextOneLine
            name="valueMetadona"
            value={form.valueMetadona}
            onChange={handleChange}
            inputClassName="w-32"
          />
          
          <div className="flex items-center">FENCICLIDINA (PCP)</div>
          <InputsRadioGroup
            name="valueFenci"
            value={form.valueFenci}
            onChange={handleRadioChange}
            options={[
              { label: 'Positivo', value: 'POSITIVO' },
              { label: 'Negativo', value: 'NEGATIVO' }
            ]}
            groupClassName="gap-6"
          />
          <InputTextOneLine
            name="valueFenci"
            value={form.valueFenci}
            onChange={handleChange}
            inputClassName="w-32"
          />
          
          <div className="flex items-center">ANTIDEPRESIVOS TRICÍCLICOS (TCA)</div>
          <InputsRadioGroup
            name="valueAnti"
            value={form.valueAnti}
            onChange={handleRadioChange}
            options={[
              { label: 'Positivo', value: 'POSITIVO' },
              { label: 'Negativo', value: 'NEGATIVO' }
            ]}
            groupClassName="gap-6"
          />
          <InputTextOneLine
            name="valueAnti"
            value={form.valueAnti}
            onChange={handleChange}
            inputClassName="w-32"
          />
          </div>
        </SectionFieldset>

        {/* Acciones */}
        <fieldset className="flex flex-col md:flex-row justify-between items-center gap-4 px-3">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleSave}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faSave} /> Guardar/Actualizar
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-2 rounded flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faBroom} /> Limpiar
            </button>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-bold italic mb-2">IMPRIMIR</span>
            <div className="flex items-center gap-2">
              <InputTextOneLine
                name="norden"
                value={form.norden}
                onChange={handleChange}
                inputClassName="w-28"
              />
              <button
                type="button"
                onClick={handlePrint}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faPrint} />
              </button>
            </div>
          </div>
        </fieldset>
      </form>
    </div>
  );
}
