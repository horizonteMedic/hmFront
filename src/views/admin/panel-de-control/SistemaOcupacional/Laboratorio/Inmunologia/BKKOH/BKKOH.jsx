import { useSessionData } from '../../../../../../hooks/useSessionData';
import { useForm } from '../../../../../../hooks/useForm';
import { useRegistroEditable } from '../../../../../../hooks/useRegistroEditable';
import { getToday, getFechaHoraActual } from '../../../../../../utils/helpers';
import { buildAuditoria } from '../../../../../../utils/auditoriaUtils';
import { PrintHojaR, SubmitDataService, UpdateDataService, VerifyTR } from './controllerBKKOH';
import {
  InputCheckbox,
  InputsRadioGroup,
  InputTextOneLine,
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
  "bk1",
  "bk2",
  "koh",
  "user_medicoFirma",
  "nombre_medico",
  "user_doctorAsignado",
  "nombre_doctorAsignado",
];

export default function BKKOH() {
  const { token, userlogued, selectedSede, userName } = useSessionData();
  const [tabla, setTabla] = useState('microbiologia');
  const [examenDirecto, setExamenDirecto] = useState(false);
  const today = getToday();

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

    bk1: '',
    bk2: '',
    koh: '',

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
    handleClearnotO,
    handleRadioButton,
    handleChangeNumber,
    handleChangeNumberDecimals,
    handleChangeSimple,
    handleClear,
    handlePrintDefault,
  } = useForm(initialFormState, { storageKey: "bkKoh" });

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

  useEffect(() => {
    setTabla(examenDirecto ? 'koh' : "microbiologia");
  }, [examenDirecto]);

  const handleSave = () => {
    SubmitDataService(form, token, userlogued, handleClear, tabla);
  };

  const handleEdit = () => {
    UpdateDataService(form, token, userlogued, handleClear, tabla);
  };

  // ===== Búsqueda con botón =====
  const executeSearch = () => {
    handleClearnotO();
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

      <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 xl:grid-cols-3 gap-3 lg:gap-4">
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
          <SearchButton onClick={executeSearch} className="xl:hidden" />
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
          label="Nombre Examen"
          name="nombreExamen"
          value={form.nombreExamen}
          disabled
          labelWidth="120px"
        />
      </SectionFieldset>
      <DatosPersonalesLaborales form={form} />

      <SectionFieldset legend="Configuración">
        <InputCheckbox
          label="Examen Directo"
          checked={examenDirecto}
          name="examenDirecto"
          disabled={camposDeshabilitados}
          onChange={(e) => {
            const checked = e.target.checked;
            setExamenDirecto(checked);
            handleClearnotO();
          }}
        />

      </SectionFieldset>

      <div className="text-center font-semibold text-lg my-4">MUESTRA: ESPUTO</div>
      <SectionFieldset legend="Pruebas" className="grid grid-cols-12 gap-2 items-center">
        {examenDirecto ? (
          <>
            < InputTextOneLine
              label='KOH'
              labelWidth='180px'
              className="col-span-6"
              name="koh"
              value={form.koh}
              onChange={handleChange}
              disabled={!examenDirecto || camposDeshabilitados}
              edited={isFieldEdited("koh")}
              onRevert={() => revertField("koh")}
            />
            <InputsRadioGroup
              name="koh"
              value={form.koh}
              options={[
                { label: 'NEGATIVO', value: 'NEGATIVO' },
                { label: 'POSITIVO', value: 'POSITIVO' },
                { label: 'N/A', value: 'N/A' }
              ]}
              onChange={handleRadioButton}
              disabled={!examenDirecto || camposDeshabilitados}
              className='col-span-6'
            />
          </>)
          : (
            <>
              <InputTextOneLine
                label='Examen de BK - BACILOSCOPIA 1ª'
                labelWidth='180px'
                name="bk1"
                value={form.bk1}
                onChange={handleChange}
                className="col-span-6"
                disabled={examenDirecto || camposDeshabilitados}
                edited={isFieldEdited("bk1")}
                onRevert={() => revertField("bk1")}
              />
              <InputsRadioGroup
                name="bk1"
                value={form.bk1}
                options={[
                  { label: 'BAAR - NEGATIVO', value: 'BAAR - NEGATIVO' },
                  { label: 'BAAR - POSITIVO', value: 'BAAR - POSITIVO' },
                  { label: 'N/A', value: 'N/A' }
                ]}
                onChange={handleRadioButton}
                disabled={examenDirecto || camposDeshabilitados}
                className='col-span-6'
              />
              {/* BK 2 */}
              <InputTextOneLine
                label='Examen de BK - BACILOSCOPIA 2ª'
                labelWidth='180px'
                name="bk2"
                value={form.bk2}
                className="col-span-6"
                onChange={handleChange}
                disabled={examenDirecto || camposDeshabilitados}
                edited={isFieldEdited("bk2")}
                onRevert={() => revertField("bk2")}
              />
              <InputsRadioGroup
                name="bk2"
                value={form.bk2}
                options={[
                  { label: 'BAAR - NEGATIVO', value: 'BAAR - NEGATIVO' },
                  { label: 'BAAR - POSITIVO', value: 'BAAR - POSITIVO' },
                  { label: 'N/A', value: 'N/A' }
                ]}
                onChange={handleRadioButton}
                disabled={examenDirecto || camposDeshabilitados}
                className='col-span-6'
              />
            </>)}
      </SectionFieldset>

      <SectionFieldset legend="Especialista">
        <EmpleadoComboBox
          value={form.nombre_medico}
          form={form}
          label='Especialista que Certifica'
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
