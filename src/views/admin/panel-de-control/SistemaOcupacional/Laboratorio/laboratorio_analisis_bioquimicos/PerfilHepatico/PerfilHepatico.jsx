import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faBroom, faPrint } from '@fortawesome/free-solid-svg-icons';
import { useSessionData } from '../../../../../../hooks/useSessionData';
import { useForm } from '../../../../../../hooks/useForm';
import { getToday } from '../../../../../../utils/helpers';
import { PrintHojaR, SubmitDataService, VerifyTR } from './controllerPerfilH';
import {
  InputTextOneLine,
} from '../../../../../../components/reusableComponents/ResusableComponents';
import SectionFieldset from '../../../../../../components/reusableComponents/SectionFieldset';

const testFields = [
  { label: 'FOSFATASA ALCALINA', name: 'fosfAlc' },
  { label: 'GGT', name: 'ggt' },
  { label: 'TGP', name: 'tgp' },
  { label: 'TGO', name: 'tgo' },
  { label: 'BILIRRUBINA TOTAL', name: 'biliTotal' },
  { label: 'BILIRRUBINA DIRECTA', name: 'biliDir' },
  { label: 'BILIRRUBINA INDIRECTA', name: 'biliInd' },
  { label: 'PROTEINAS TOTALES', name: 'protTot' },
  { label: 'ALBUMINA', name: 'albumina' },
  { label: 'GLOBULINA SERICA', name: 'globSer' },
];

const tabla = 'perfil_hepatico';

export default function PerfilHepatico() {
  const { token, userlogued, selectedSede } = useSessionData();
  const today = getToday();

  const initialFormState = {
    norden: '',
    fecha: today,
    nombres: '',
    edad: '',
    tgo: '',
    tgp: '',
    ggt: '',
    fosfAlc: '',
    biliTotal: '',
    biliInd: '',
    biliDir: '',
    protTot: '',
    albumina: '',
    globSer: '',
    printCount: '',
    medico: ''
  };

  const {
    form,
    setForm,
    handleChange,
    handleClear,
    handlePrintDefault,
  } = useForm(initialFormState);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => {
      let updated = { ...prev, [name]: value };
      // Cálculo automático de Bilirrubina Indirecta
      if (name === 'biliTotal' || name === 'biliDir') {
        const total = parseFloat(name === 'biliTotal' ? value : updated.biliTotal);
        const dir = parseFloat(name === 'biliDir' ? value : updated.biliDir);
        if (!isNaN(total) && !isNaN(dir)) {
          updated.biliInd = (total - dir).toFixed(2);
        } else {
          updated.biliInd = '';
        }
      }
      // Cálculo automático de Globulina
      if (name === 'protTot' || name === 'albumina') {
        const prot = parseFloat(name === 'protTot' ? value : updated.protTot);
        const alb = parseFloat(name === 'albumina' ? value : updated.albumina);
        if (!isNaN(prot) && !isNaN(alb)) {
          updated.globSer = (prot - alb).toFixed(2);
        } else {
          updated.globSer = '';
        }
      }
      return updated;
    });
  };

  const handleSave = () => {
    SubmitDataService(form, token, userlogued, handleClear);
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      setForm(prev => ({
        ...prev,
        fecha: today,
        nombres: '',
        edad: '',
        tgo: '',
        tgp: '',
        ggt: '',
        fosfAlc: '',
        biliTotal: '',
        biliInd: '',
        biliDir: '',
        protTot: '',
        albumina: '',
        globSer: '',
        printCount: '',
        medico: ''
      }));
      VerifyTR(form.norden, tabla, token, setForm, selectedSede);
    }
  };

  const handlePrint = () => {
    handlePrintDefault(() => {
      PrintHojaR(form.norden, token);
    }, '¿Desea Imprimir Perfil Hepático?', form.norden);
  };

  return (
    <div className="w-full max-w-[70vw] mx-auto bg-white rounded shadow p-6">
      <h2 className="text-2xl font-bold text-center mb-6">PERFIL HEPÁTICO</h2>
      
      <form className="space-y-6">
        <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        <SectionFieldset legend="Resultados" className="space-y-4">
          <div className="grid grid-cols-5 gap-x-6 gap-y-3 items-center">
            <div className="col-span-2 font-bold text-center mb-2">PRUEBAS</div>
            <div className="col-span-3 font-bold text-center mb-2">RESULTADOS</div>

            {testFields.map(({ label, name }) => (
              <React.Fragment key={name}>
                <label className="col-span-2 font-semibold text-right">{label}</label>
                <div className="col-span-3">
                  <InputTextOneLine
                    name={name}
                    value={form[name]}
                    onChange={handleFormChange}
                    inputClassName="w-full"
                  />
                </div>
              </React.Fragment>
            ))}
          </div>
        </SectionFieldset>

        <SectionFieldset legend="Asignación de Médico" className="space-y-4">
          <div className="flex items-center gap-2">
            <label className="font-semibold min-w-[120px]">ASIGNAR MÉDICO:</label>
            <select
              disabled
              className="border rounded px-2 py-1 min-w-[220px] bg-gray-100"
              name="medico"
              value={form.medico || ''}
              onChange={handleChange}
            >
              <option value="">Seleccionar medico</option>
              <option value="medico1">Dr. Juan Pérez</option>
              <option value="medico2">Dra. Ana Torres</option>
              <option value="medico3">Dr. Luis Gómez</option>
            </select>
          </div>
        </SectionFieldset>

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
        </fieldset>
      </form>
    </div>
  );
}
