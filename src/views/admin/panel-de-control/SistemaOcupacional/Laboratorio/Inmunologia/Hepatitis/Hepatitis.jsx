import { useSessionData } from '../../../../../../hooks/useSessionData';
import { useForm } from '../../../../../../hooks/useForm';
import { useRegistroEditable } from '../../../../../../hooks/useRegistroEditable';
import { getToday, getFechaHoraActual } from '../../../../../../utils/helpers';
import { buildAuditoria } from '../../../../../../utils/auditoriaUtils';
import { PrintHojaR, SubmitDataService, UpdateDataService, VerifyTR } from './controllerHepatitis';
import {
  InputTextOneLine,
  InputsRadioGroup,
} from '../../../../../../components/reusableComponents/ResusableComponents';
import SectionFieldset from '../../../../../../components/reusableComponents/SectionFieldset';
import SearchButton from '../../../../../../components/reusableComponents/SearchButton';
import AccionesRegistroHeader from '../../../../../../components/reusableComponents/AccionesRegistroHeader';
import AuditoriaRegistro from '../../../../../../components/reusableComponents/AuditoriaRegistro';
import EmpleadoComboBox from '../../../../../../components/reusableComponents/EmpleadoComboBox';
import DatosPersonalesLaborales from '../../../../../../components/templates/DatosPersonalesLaborales';
import BotonesForm from '../../../../../../components/templates/BotonesForm';
import { useEffect, useState } from 'react';

// Campos que el usuario puede editar en este formulario (para resaltar/revertir cambios).
const CAMPOS_EDITABLES = [
  "fecha",
  "marca",
  "resultadoHAV",
  "resultadoHBsAg",
  "resultadoVHC",
  "user_medicoFirma",
  "nombre_medico",
  "user_doctorAsignado",
  "nombre_doctorAsignado",
];

export default function Hepatitis() {
  const { token, userlogued, selectedSede, datosFooter, userName } = useSessionData();
  const today = getToday();

  const [tabla, setTabla] = useState("lhepatitis");

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

    tipoHepatitis: "A",
    marca: 'RAPID TEST - MONTEST',
    resultadoHAV: '',
    resultadoHBsAg: '',
    resultadoVHC: "",

    // Médico que Certifica //BUSCADOR
    nombre_medico: userName,
    user_medicoFirma: userlogued,

    nombre_doctorAsignado: "",
    user_doctorAsignado: "",

    // Control de UI: false = mostrar Guardar (nuevo) / true = mostrar Editar (ya existe)
    tieneRegistro: false,

    // Auditoría
    userRegistro: "",
    fechaRegistro: "",
    usuarioActualizacion: "",
    fechaActualizacion: "",
  };


  const {
    form,
    setForm,
    handleChange,
    handleChangeNumber,
    handleChangeNumberDecimals,
    handleChangeSimple,
    handleRadioButton,
    handleClearnotO,
    handleClear,
    handlePrintDefault,
  } = useForm(initialFormState, { storageKey: "hepatitis" });

  const {
    edicionHabilitada,
    habilitarEdicion,
    camposDeshabilitados,
    isFieldEdited,
    revertField,
    revertFields,
  } = useRegistroEditable(form, setForm, { tieneRegistro: form.tieneRegistro, camposEditables: CAMPOS_EDITABLES });

  // El médico y el doctor asignado se componen de 2 campos (id de firma + nombre): se detecta
  // el cambio por el id y se revierten ambos en conjunto.
  const isMedicoEdited = isFieldEdited("user_medicoFirma");
  const revertMedico = () => revertFields(["user_medicoFirma", "nombre_medico"]);
  const isDoctorEdited = isFieldEdited("user_doctorAsignado");
  const revertDoctor = () => revertFields(["user_doctorAsignado", "nombre_doctorAsignado"]);

  // Cambia de tipo de prueba (A/B/C): limpia el resto del formulario pero conserva el tipo
  // recién elegido (cada tipo vive en su propia tabla del backend).
  const handleRadioButtonTipoHepatitis = (e, value) => {
    const normalized = value.toUpperCase();
    handleClearnotO();
    setForm((f) => ({ ...f, tipoHepatitis: normalized }));
  };

  // Limpia el formulario (para una nueva búsqueda) conservando el tipo de prueba actual, para
  // no perder la selección A/B/C mientras se busca un N° Orden distinto.
  const handleClearKeepTipo = () => {
    const tipoActual = form.tipoHepatitis;
    handleClearnotO();
    setForm((f) => ({ ...f, tipoHepatitis: tipoActual }));
  };

  const handleSave = () => {
    SubmitDataService(form, token, userlogued, handleClear, tabla, datosFooter);
  };

  const handleEdit = () => {
    UpdateDataService(form, token, userlogued, handleClear, tabla, datosFooter);
  };

  // ===== Búsqueda con botón =====
  const executeSearch = () => {
    handleClearKeepTipo();
    VerifyTR(form.norden, tabla, token, setForm, selectedSede);
  };

  // ===== Búsqueda con enter =====
  const handleSearch = (e) => {
    if (!e || e.key === 'Enter') {
      executeSearch();
    }
  };

  const hayRegistroCargado = Boolean(form.nombres);

  const handlePrintNordenChange = (e) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return; // solo dígitos

    const hayDatosCargados = Boolean(form.nombres || form.tieneRegistro);
    if (hayDatosCargados && value !== form.norden) {
      setForm({ ...initialFormState, norden: value });
    } else {
      setForm((f) => ({ ...f, norden: value }));
    }
  };

  const handlePrint = () => {
    handlePrintDefault(() => {
      PrintHojaR(form.norden, token, tabla);
    });
  };

  useEffect(() => {
    const value = form.tipoHepatitis;
    setTabla(
      value == "A" ? "lhepatitis" :
        value == "B" ? "hepatitis_b" :
          value == "C" ? "hepatitis_c" : "lhepatitis")
  }, [form.tipoHepatitis])

  const auditoria = buildAuditoria(form, {
    usuarioActual: userlogued,
    fechaHoraActual: getFechaHoraActual(),
  });

  return (
    <div className="space-y-3 px-4 max-w-[90%] xl:max-w-[80%] mx-auto">
      <AccionesRegistroHeader
        tieneRegistro={form.tieneRegistro}
        hayRegistroCargado={hayRegistroCargado}
        edicionHabilitada={edicionHabilitada}
        onHabilitarEdicion={habilitarEdicion}
        onLimpiar={handleClear}
      />

      <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="flex gap-x-3 w-full">
          <InputTextOneLine
            label="N° Orden"
            name="norden"
            value={form.norden}
            onChange={handleChangeNumber}
            onKeyUp={handleSearch}
            disabled={hayRegistroCargado}
            labelWidth="120px"
            className="w-full"
          />
          <SearchButton onClick={executeSearch} className="lg:hidden" />
        </div>
        <InputTextOneLine
          label="Fecha"
          name="fecha"
          type="date"
          value={form.fecha}
          onChange={handleChangeSimple}
          disabled={camposDeshabilitados}
          edited={isFieldEdited("fecha")}
          onRevert={() => revertField("fecha")}
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

      <DatosPersonalesLaborales form={form} />

      <SectionFieldset legend="Tipo de Prueba">
        <InputsRadioGroup
          name="tipoHepatitis"
          value={form.tipoHepatitis}
          onChange={handleRadioButtonTipoHepatitis}
          options={[
            { label: "HEPATITIS A (HAV)", value: "A" },
            { label: "HEPATITIS B (HBsAg)", value: "B" },
            { label: "HEPATITIS C (VHC)", value: "C" },
          ]}
          disabled={camposDeshabilitados}
        />
      </SectionFieldset>

      <SectionFieldset legend="Marca">
        <InputTextOneLine
          label="Marca"
          name="marca"
          value={form.marca}
          onChange={handleChange}
          labelWidth="120px"
          disabled={camposDeshabilitados}
          edited={isFieldEdited("marca")}
          onRevert={() => revertField("marca")}
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
            disabled={form.tipoHepatitis != "A" || camposDeshabilitados}
            labelWidth='120px'
            className='w-full max-w-[85%]'
            edited={isFieldEdited("resultadoHAV")}
            onRevert={() => revertField("resultadoHAV")}
          />
          <InputsRadioGroup
            name="resultadoHAV"
            value={form.resultadoHAV}
            onChange={handleRadioButton}
            options={[
              { label: 'Positivo', value: 'POSITIVO' },
              { label: 'Negativo', value: 'NEGATIVO' }
            ]}
            disabled={form.tipoHepatitis != "A" || camposDeshabilitados}
          />
        </div>
        <div className='flex gap-4'>
          {/* HBsAg */}
          <InputTextOneLine
            label='Hepatitis B (HBsAg)'
            name="resultadoHBsAg"
            value={form.resultadoHBsAg}
            onChange={handleChange}
            disabled={form.tipoHepatitis != "B" || camposDeshabilitados}
            labelWidth='120px'
            className='w-full max-w-[85%]'
            edited={isFieldEdited("resultadoHBsAg")}
            onRevert={() => revertField("resultadoHBsAg")}
          />
          <InputsRadioGroup
            name="resultadoHBsAg"
            value={form.resultadoHBsAg}
            onChange={handleRadioButton}
            options={[
              { label: 'Positivo', value: 'POSITIVO' },
              { label: 'Negativo', value: 'NEGATIVO' }
            ]}
            disabled={form.tipoHepatitis != "B" || camposDeshabilitados}
          />
        </div>
        <div className='flex gap-4'>
          <InputTextOneLine
            label='Hepatitis C (VHC)'
            name="resultadoVHC"
            value={form.resultadoVHC}
            onChange={handleChange}
            disabled={form.tipoHepatitis != "C" || camposDeshabilitados}
            labelWidth='120px'
            className='w-full max-w-[85%]'
            edited={isFieldEdited("resultadoVHC")}
            onRevert={() => revertField("resultadoVHC")}
          />
          <InputsRadioGroup
            name="resultadoVHC"
            value={form.resultadoVHC}
            onChange={handleRadioButton}
            options={[
              { label: 'Positivo', value: 'POSITIVO' },
              { label: 'Negativo', value: 'NEGATIVO' }
            ]}
            disabled={form.tipoHepatitis != "C" || camposDeshabilitados}
          />
        </div>
      </SectionFieldset>

      <SectionFieldset legend="Asignación de Médico" className="space-y-4">
        <EmpleadoComboBox
          value={form.nombre_medico}
          label="Especialista"
          form={form}
          onChange={handleChangeSimple}
          disabled={camposDeshabilitados}
          edited={isMedicoEdited}
          onRevert={revertMedico}
        />
        <EmpleadoComboBox
          value={form.nombre_doctorAsignado}
          label="Doctor Asignado"
          form={form}
          onChange={handleChangeSimple}
          nameField="nombre_doctorAsignado"
          idField="user_doctorAsignado"
          disabled={camposDeshabilitados}
          edited={isDoctorEdited}
          onRevert={revertDoctor}
        />
      </SectionFieldset>

      {/* ===== SECCIÓN: AUDITORÍA DEL REGISTRO ===== */}
      {hayRegistroCargado && (
        <AuditoriaRegistro
          mostrarEdicion={form.tieneRegistro}
          fechaCreacion={auditoria.fechaCreacion}
          fechaEdicion={auditoria.fechaActualizacion}
          usuarioRegistro={auditoria.usuarioRegistro}
          usuarioEdicion={auditoria.usuarioActualizacion}
        />
      )}

      {/* ===== BOTONES DE ACCIÓN ===== */}
      <BotonesForm
        form={form}
        handleChangeNumberDecimals={handleChangeNumberDecimals}
        onNordenChange={handlePrintNordenChange}
        handleSave={form.tieneRegistro && edicionHabilitada ? handleEdit : handleSave}
        saveLabel={form.tieneRegistro && edicionHabilitada ? "Guardar Cambios" : "Guardar"}
        handleEdit={habilitarEdicion}
        handleClear={handleClear}
        handlePrint={handlePrint}
        hideSave={form.tieneRegistro && !edicionHabilitada}
        hideEdit={!form.tieneRegistro || edicionHabilitada}
      />
    </div>
  );
}
