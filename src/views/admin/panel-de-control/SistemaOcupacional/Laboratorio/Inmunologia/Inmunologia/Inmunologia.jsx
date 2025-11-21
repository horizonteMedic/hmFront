import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faBroom, faPrint } from '@fortawesome/free-solid-svg-icons';
import { useSessionData } from '../../../../../../hooks/useSessionData';
import { useForm } from '../../../../../../hooks/useForm';
import { getToday } from '../../../../../../utils/helpers';
import { PrintHojaR, SubmitDataService, VerifyTR } from './controller';
import {
  InputTextOneLine,
} from '../../../../../../components/reusableComponents/ResusableComponents';
import SectionFieldset from '../../../../../../components/reusableComponents/SectionFieldset';

const tabla = 'inmunologia';

export default function Inmunologia() {
  const { token, userlogued, selectedSede, datosFooter } = useSessionData();
  const today = getToday();

  const initialFormState = {
    norden: '',
    fecha: today,
    nombres: '',
    edad: '',
    tificoO: '1/40',
    tificoH: '1/40',
    paratificoA: '1/40',
    paratificoB: '1/40',
    brucella: '1/40',
    hepatitis: false,
    hepatitisA: '',
    medico: ''
  };

  const {
    form,
    setForm,
    handleChange,
    handleClear,
    handleClearnotO,
    handlePrintDefault,
  } = useForm(initialFormState);

  const handleSave = () => {
    SubmitDataService(form, token, userlogued, handleClear, tabla, datosFooter);
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      handleClearnotO();
      setForm((prev) => ({
        ...prev,
        fecha: today,
        nombres: '',
        edad: '',
        tificoO: '1/40',
        tificoH: '1/40',
        paratificoA: '1/40',
        paratificoB: '1/40',
        brucella: '1/40',
        hepatitis: false,
        hepatitisA: '',
      }));
      VerifyTR(form.norden, tabla, token, setForm, selectedSede);
    }
  };

  const handlePrint = () => {
    handlePrintDefault(() => {
      PrintHojaR(form.norden, token, tabla, datosFooter);
    });
  };

  const handleHepatitisChange = (checked) => {
    setForm(prev => ({
      ...prev,
      hepatitis: checked,
      hepatitisA: checked ? prev.hepatitisA : ''
    }));
  };

  const pruebas = [
    { name: 'tificoO', label: 'TIFICO O' },
    { name: 'tificoH', label: 'TIFICO H' },
    { name: 'paratificoA', label: 'PARATIFICO A' },
    { name: 'paratificoB', label: 'PARATIFICO B' },
    { name: 'brucella', label: 'Brucella abortus' },
  ];

  return (
    <div className="w-full max-w-[70vw] mx-auto bg-white rounded shadow p-6">
      <h2 className="text-2xl font-bold text-center mb-6">INMUNOLOGÍA</h2>
      <form className="space-y-6">
        <SectionFieldset
          legend="Información del Examen"
          className="grid grid-cols-1 lg:grid-cols-2 gap-4"
        >
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
            inputClassName="w-24"
          />
        </SectionFieldset>

        <SectionFieldset legend="MÉTODO EN LÁMINA PORTAOBJETO" className="space-y-4">
          <div className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-2 font-bold flex items-center">PRUEBAS</div>
            <div className="col-span-3 font-bold flex items-center">RESULTADOS</div>
            <div className="col-span-7"></div>

            {pruebas.map(({ name, label }) => (
              <React.Fragment key={name}>
                <div className="col-span-2 flex items-center">{label}</div>
                <div className="col-span-3">
                  <InputTextOneLine
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    inputClassName="w-full"
                  />
                </div>
                <div className="col-span-7"></div>
              </React.Fragment>
            ))}
          </div>
        </SectionFieldset>

        <SectionFieldset legend="Hepatitis">
          <label className="flex items-center gap-2 mb-3">
            <input
              type="checkbox"
              checked={form.hepatitis}
              onChange={(e) => handleHepatitisChange(e.target.checked)}
            />
            <span className="font-semibold">Prueba Rápida HEPATITIS A</span>
          </label>
          {form.hepatitis && (
            <InputTextOneLine
              label="Resultado"
              name="hepatitisA"
              value={form.hepatitisA}
              onChange={handleChange}
              labelWidth="120px"
            />
          )}
        </SectionFieldset>

        <SectionFieldset legend="Asignar Médico">
          <select
            disabled
            className="w-full border rounded px-3 py-2 bg-gray-100 text-sm"
            name="medico"
            value={form.medico}
            onChange={handleChange}
          >
            <option value="">-- Seleccionar --</option>
          </select>
        </SectionFieldset>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap gap-3">
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
            <span className="font-bold italic mb-2">Imprimir</span>
            <div className="flex items-center gap-2">
              <InputTextOneLine
                name="norden"
                value={form.norden}
                onChange={handleChange}
                inputClassName="w-24"
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
