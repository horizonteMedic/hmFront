import { useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faBroom, faPrint } from '@fortawesome/free-solid-svg-icons';
import { useSessionData } from '../../../../../../hooks/useSessionData';
import { useForm } from '../../../../../../hooks/useForm';
import { getToday } from '../../../../../../utils/helpers';
import { PrintHojaR, SubmitDataService, VerifyTR } from './controller2D';
import {
  InputTextOneLine,
  InputsRadioGroup,
} from '../../../../../../components/reusableComponents/ResusableComponents';

const tabla = 'panel2d';

export default function Resultado_Panel2D() {
  const { token, userlogued, selectedSede, datosFooter } = useSessionData();
  const today = getToday();

  const initialFormState = {
    norden: '',
    fecha: today,
    nombres: '',
    edad: '',
    valueM: 'NEGATIVO',
    valueC: 'NEGATIVO',
    metodo: 'INMUNOCROMATOGRAFICO',
    medico: ''
  };

  const {
    form,
    setForm,
    handleChange,
    handleClear,
    handlePrintDefault,
    handleRadioButton,
  } = useForm(initialFormState, { storageKey: 'panel2d' });

  // Refs para navegación
  const fechaRef = useRef(null);
  const valueMRef = useRef(null);
  const valueCRef = useRef(null);
  const printRef = useRef(null);

  const handleSave = () => {
    SubmitDataService(form, token, userlogued, handleClear, tabla, datosFooter);
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
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
    <div className="w-full max-w-[70vw] mx-auto bg-white rounded shadow p-6">
      <h2 className="text-2xl font-bold text-center mb-6">PANEL 2D</h2>
      <form className="space-y-6">
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row gap-4">
          <InputTextOneLine
            label="Nro Ficha"
            name="norden"
            value={form.norden}
            onChange={handleChange}
            onKeyUp={handleSearch}
            labelWidth="100px"
            className="flex-1"
          />
          <InputTextOneLine
            label="Fecha"
            name="fecha"
            type="date"
            value={form.fecha}
            onChange={handleChange}
            onKeyUp={e => {
              if (e.key === 'Enter') {
                valueMRef.current?.focus();
              }
            }}
            labelWidth="100px"
            className="flex-1"
            ref={fechaRef}
          />
        </div>
        
        {/* Paciente */}
        <div className="flex flex-col md:flex-row gap-4">
          <InputTextOneLine
            label="Nombres"
            name="nombres"
            value={form.nombres}
            disabled
            labelWidth="100px"
            className="flex-1"
          />
          <InputTextOneLine
            label="Edad"
            name="edad"
            value={form.edad}
            disabled
            labelWidth="100px"
            className="flex-1"
            inputClassName="w-32"
          />
        </div>
        
        {/* Pruebas */}
        <div className="font-bold mb-2">PRUEBA RÁPIDA CUALITATIVA</div>
        <InputTextOneLine
          name="metodo"
          value={form.metodo}
          onChange={handleChange}
          className="mb-4"
        />
        {/* Resultados */}
        <div className="grid grid-cols-3 gap-x-4 gap-y-4 mb-6">
          <div className="font-bold">PRUEBAS</div>
          <div className="font-bold"></div>
          <div className="font-bold">RESULTADOS</div>
          
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
            onKeyUp={e => {
              if (e.key === 'Enter') {
                valueCRef.current?.focus();
              }
            }}
            inputClassName="w-32"
            ref={valueMRef}
          />
          
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
            onKeyUp={e => {
              if (e.key === 'Enter') {
                printRef.current?.focus();
              }
            }}
            inputClassName="w-32"
            ref={valueCRef}
          />
        </div>
        {/* Médico */}
        <div className="flex items-center gap-2">
          <label className="font-semibold min-w-[100px]">ASIGNAR MÉDICO:</label>
          <select 
            disabled 
            value={form.medico} 
            className="border rounded px-2 py-1 flex-1 bg-gray-100"
          >
            <option value="">-- N/A --</option>
          </select>
        </div>
        {/* Acciones */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-6">
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
                inputClassName="w-24"
                ref={printRef}
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
        </div>
      </form>
    </div>
  );
}