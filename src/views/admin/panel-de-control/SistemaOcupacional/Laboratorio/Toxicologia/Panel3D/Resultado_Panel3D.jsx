import { useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faBroom, faPrint } from '@fortawesome/free-solid-svg-icons';
import { useSessionData } from '../../../../../../hooks/useSessionData';
import { useForm } from '../../../../../../hooks/useForm';
import { getToday } from '../../../../../../utils/helpers';
import { PrintHojaR, SubmitDataService, VerifyTR } from './controller3D';
import {
  InputTextOneLine,
  InputsRadioGroup,
} from '../../../../../../components/reusableComponents/ResusableComponents';

const tabla = 'panel3d';

export default function Resultado_Panel3D() {
  const { token, userlogued, selectedSede, datosFooter } = useSessionData();
  const today = getToday();

  const initialFormState = {
    norden: '',
    fecha: today,
    nombres: '',
    edad: '',
    valueM: 'NEGATIVO',
    valueC: 'NEGATIVO',
    valueE: 'NEGATIVO',
    metodo: 'INMUNOCROMATOGRAFICO',
  };

  const {
    form,
    setForm,
    handleChange,
    handleClear,
    handlePrintDefault,
    handleRadioButton,
  } = useForm(initialFormState, { storageKey: 'panel3d' });

  // Refs para navegación
  const fechaRef = useRef(null);
  const valueCRef = useRef(null);
  const valueMRef = useRef(null);
  const valueERef = useRef(null);
  const printRef = useRef(null);

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
        valueE: 'NEGATIVO',
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

  const handleFechaFocus = (e) => e.target.showPicker?.();

  return (
    <div className="w-full max-w-[70vw] mx-auto bg-white rounded shadow p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">PANEL 3D</h2>
      <form className="space-y-6">
        {/* Cabecera */}
        <div className="flex flex-wrap items-center gap-6">
          <InputTextOneLine
            label="Nro Ficha"
            name="norden"
            value={form.norden}
            onChange={handleChange}
            onKeyUp={handleSearch}
            labelWidth="100px"
            inputClassName="w-32"
          />
          <InputTextOneLine
            label="Fecha"
            name="fecha"
            type="date"
            value={form.fecha}
            onChange={handleChange}
            onFocus={handleFechaFocus}
            onKeyUp={e => {
              if (e.key === 'Enter') {
                valueCRef.current?.focus();
              }
            }}
            labelWidth="100px"
            inputClassName="w-40"
            ref={fechaRef}
          />
          <InputTextOneLine
            label="Nombres"
            name="nombres"
            value={form.nombres}
            disabled
            labelWidth="100px"
          />
          <InputTextOneLine
            label="Edad"
            name="edad"
            value={form.edad}
            disabled
            labelWidth="100px"
            inputClassName="w-20"
          />
        </div>

        {/* Método */}
        <div className="mb-4">
          <div className="font-bold mb-2">PRUEBA RÁPIDA CUALITATIVA</div>
          <InputTextOneLine
            name="metodo"
            value={form.metodo}
            onChange={handleChange}
          />
        </div>

        {/* Resultados */}
        <div className="grid grid-cols-3 gap-x-4 gap-y-4 mb-8">
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
            onKeyUp={e => {
              if (e.key === 'Enter') {
                valueMRef.current?.focus();
              }
            }}
            inputClassName="w-32"
            ref={valueCRef}
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
            onKeyUp={e => {
              if (e.key === 'Enter') {
                valueERef.current?.focus();
              }
            }}
            inputClassName="w-32"
            ref={valueMRef}
          />
          
          <div className="flex items-center">EXTASIS (MDMA)</div>
          <InputsRadioGroup
            name="valueE"
            value={form.valueE}
            onChange={handleRadioChange}
            options={[
              { label: 'Positivo', value: 'POSITIVO' },
              { label: 'Negativo', value: 'NEGATIVO' }
            ]}
            groupClassName="gap-6"
          />
          <InputTextOneLine
            name="valueE"
            value={form.valueE}
            onChange={handleChange}
            onKeyUp={e => {
              if (e.key === 'Enter') {
                printRef.current?.focus();
              }
            }}
            inputClassName="w-32"
            ref={valueERef}
          />
        </div>

        {/* Botones */}
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
                inputClassName="w-28"
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
