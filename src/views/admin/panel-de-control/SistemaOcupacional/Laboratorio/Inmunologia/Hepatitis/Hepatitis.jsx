import { useSessionData } from '../../../../../../hooks/useSessionData';
import { useForm } from '../../../../../../hooks/useForm';
import { getToday } from '../../../../../../utils/helpers';
import { PrintHojaR, SubmitDataService, VerifyTR } from './controllerHepatitis';
import {
  InputTextOneLine,
  InputsRadioGroup,
} from '../../../../../../components/reusableComponents/ResusableComponents';
import SectionFieldset from '../../../../../../components/reusableComponents/SectionFieldset';
import EmpleadoComboBox from '../../../../../../components/reusableComponents/EmpleadoComboBox';
import BotonesAccion from '../../../../../../components/templates/BotonesAccion';
import { useEffect, useState } from 'react';

export default function Hepatitis() {
  const { token, userlogued, selectedSede, datosFooter, userName } = useSessionData();
  const today = getToday();

  const [tabla, setTabla] = useState("lhepatitis");
  const [tipoHepatitis, setTipoHepatitis] = useState({ tipoHepatitis: "A" })

  const initialFormState = {
    norden: '',
    id: null,
    fecha: today,

    nombreExamen: "",

    dni: "",
    nombres: "",
    apellidos: "",
    fechaNacimiento: "",
    lugarNacimiento: "",
    edad: "",
    sexo: "",
    estadoCivil: "",
    nivelEstudios: "",

    // Datos Laborales
    empresa: "",
    contrata: "",
    ocupacion: "",
    cargoDesempenar: "",

    marca: 'RAPID TEST - MONTEST',
    resultadoHAV: '',
    resultadoHBsAg: '',
    resultadoVHC: "",

    // Médico que Certifica //BUSCADOR
    nombre_medico: userName,
    user_medicoFirma: userlogued,

    nombre_doctorAsignado: "",
    user_doctorAsignado: "",
  };


  const {
    form,
    setForm,
    handleChange,
    handleChangeNumberDecimals,
    handleChangeSimple,
    handleRadioButton,
    handleClearnotO,
    handleClear,
    handlePrintDefault,
  } = useForm(initialFormState);


  const handleRadioButtonTipoHepatitis = (e, value) => {
    const { name } = e.target;
    setTipoHepatitis((f) => ({
      ...f,
      [name]: value.toUpperCase(),
    }));
    handleClearnotO();
  };

  const handleSave = () => {
    SubmitDataService({ ...form, ...tipoHepatitis }, token, userlogued, handleClear, tabla, datosFooter);
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      handleClearnotO();
      VerifyTR(form.norden, tabla, token, setForm, selectedSede);
    }
  };

  const handlePrint = () => {
    handlePrintDefault(() => {
      PrintHojaR(form.norden, token, tabla);
    });
  };

  useEffect(() => {
    const value = tipoHepatitis.tipoHepatitis;
    setTabla(
      value == "A" ? "lhepatitis" :
        value == "B" ? "hepatitis_b" :
          value == "C" ? "hepatitis_c" : "lhepatitis")
    handleClearnotO();
  }, [tipoHepatitis.tipoHepatitis])

  return (
    <div className="space-y-3 px-4 max-w-[90%] xl:max-w-[80%] mx-auto">
      <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <InputTextOneLine
          label="N° Orden"
          name="norden"
          value={form.norden}
          onChange={handleChangeNumberDecimals}
          onKeyUp={handleSearch}
          labelWidth="120px"
        />
        <InputTextOneLine
          label="Fecha"
          name="fecha"
          type="date"
          value={form.fecha}
          onChange={handleChangeSimple}
          labelWidth="120px"
        />
        <InputTextOneLine
          label="Nombre del Examen"
          name="nombreExamen"
          value={form.nombreExamen}
          disabled
          labelWidth="120px"
        />
      </SectionFieldset>

      <SectionFieldset legend="Datos Personales" collapsible className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
        <InputTextOneLine
          label="Nombres"
          name="nombres"
          value={form.nombres}
          disabled
          labelWidth="120px"
        />
        <div className="grid lg:grid-cols-2 gap-3">
          <InputTextOneLine
            label="Edad (Años)"
            name="edad"
            value={form.edad}
            disabled
            labelWidth="120px"
          />
          <InputTextOneLine
            label="Sexo"
            name="sexo"
            value={form.sexo}
            disabled
            labelWidth="120px"
          />
        </div>
        <div className="grid lg:grid-cols-2 gap-3">
          <InputTextOneLine
            label="DNI"
            name="dni"
            value={form.dni}
            labelWidth="120px"
            disabled
          />
          <InputTextOneLine
            label="Fecha Nacimiento"
            name="fechaNacimiento"
            value={form.fechaNacimiento}
            disabled
            labelWidth="120px"
          />
        </div>
        <InputTextOneLine
          label="Lugar Nacimiento"
          name="lugarNacimiento"
          value={form.lugarNacimiento}
          disabled
          labelWidth="120px"
        />
        <InputTextOneLine
          label="Estado Civil"
          name="estadoCivil"
          value={form.estadoCivil}
          disabled
          labelWidth="120px"
        />
        <InputTextOneLine
          label="Nivel Estudios"
          name="nivelEstudios"
          value={form.nivelEstudios}
          disabled
          labelWidth="120px"
        />
      </SectionFieldset>
      <SectionFieldset legend="Datos Laborales" collapsible className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <InputTextOneLine
          label="Empresa"
          name="empresa"
          value={form.empresa}
          disabled
          labelWidth="120px"
        />
        <InputTextOneLine
          label="Contrata"
          name="contrata"
          value={form.contrata}
          disabled
          labelWidth="120px"
        />
        <InputTextOneLine
          label="Ocupación"
          name="ocupacion"
          value={form.ocupacion}
          disabled
          labelWidth="120px"
        />
        <InputTextOneLine
          label="Cargo Desempeñar"
          name="cargoDesempenar"
          value={form.cargoDesempenar}
          disabled
          labelWidth="120px"
        />
      </SectionFieldset>

      <SectionFieldset legend="Tipo de Prueba">
        <InputsRadioGroup
          name="tipoHepatitis"
          value={tipoHepatitis.tipoHepatitis}
          onChange={handleRadioButtonTipoHepatitis}
          options={[
            { label: "HEPATITIS A (HAV)", value: "A" },
            { label: "HEPATITIS B (HBsAg)", value: "B" },
            { label: "HEPATITIS C (VHC)", value: "C" },
          ]}
        />
      </SectionFieldset>

      <SectionFieldset legend="Marca">
        <InputTextOneLine
          label="Marca"
          name="marca"
          value={form.marca}
          onChange={handleChange}
          labelWidth="120px"
        />
      </SectionFieldset>

      <SectionFieldset legend="Resultados Rapid Test" className="grid space-y-3">
        <div className='flex gap-4'>
          {/* HAV */}
          <InputTextOneLine
            label='Hepatitis A (HAV)'
            name="resultadoHAV"
            value={form.resultadoHAV}
            onChange={handleChange}
            disabled={tipoHepatitis.tipoHepatitis != "A"}
            labelWidth='120px'
            className='w-full max-w-[85%]'
          />
          <InputsRadioGroup
            name="resultadoHAV"
            value={form.resultadoHAV}
            onChange={handleRadioButton}
            options={[
              { label: 'Positivo', value: 'POSITIVO' },
              { label: 'Negativo', value: 'NEGATIVO' }
            ]}
            disabled={tipoHepatitis.tipoHepatitis != "A"}
          />
        </div>
        <div className='flex gap-4'>
          {/* HBsAg */}
          <InputTextOneLine
            label='Hepatitis B (HBsAg)'
            name="resultadoHBsAg"
            value={form.resultadoHBsAg}
            onChange={handleChange}
            disabled={tipoHepatitis.tipoHepatitis != "B"}
            labelWidth='120px'
            className='w-full max-w-[85%]'
          />
          <InputsRadioGroup
            name="resultadoHBsAg"
            value={form.resultadoHBsAg}
            onChange={handleRadioButton}
            options={[
              { label: 'Positivo', value: 'POSITIVO' },
              { label: 'Negativo', value: 'NEGATIVO' }
            ]}
            disabled={tipoHepatitis.tipoHepatitis != "B"}
          />
        </div>
        <div className='flex gap-4'>
          <InputTextOneLine
            label='Hepatitis C (VHC)'
            name="resultadoVHC"
            value={form.resultadoVHC}
            onChange={handleChange}
            disabled={tipoHepatitis.tipoHepatitis != "C"}
            labelWidth='120px'
            className='w-full max-w-[85%]'
          />
          <InputsRadioGroup
            name="resultadoVHC"
            value={form.resultadoVHC}
            onChange={handleRadioButton}
            options={[
              { label: 'Positivo', value: 'POSITIVO' },
              { label: 'Negativo', value: 'NEGATIVO' }
            ]}
            disabled={tipoHepatitis.tipoHepatitis != "C"}
          />
        </div>
      </SectionFieldset>

      <SectionFieldset legend="Asignación de Médico" className="space-y-4">
        <EmpleadoComboBox
          value={form.nombre_medico}
          label="Especialista"
          form={form}
          onChange={handleChangeSimple}
        />
        <EmpleadoComboBox
          value={form.nombre_doctorAsignado}
          label="Doctor Asignado"
          form={form}
          onChange={handleChangeSimple}
          nameField="nombre_doctorAsignado"
          idField="user_doctorAsignado"
        />
      </SectionFieldset>

      <BotonesAccion
        form={form}
        handleSave={handleSave}
        handleClear={handleClear}
        handlePrint={handlePrint}
        handleChangeNumberDecimals={handleChangeNumberDecimals}
      />
    </div>
  );
}
