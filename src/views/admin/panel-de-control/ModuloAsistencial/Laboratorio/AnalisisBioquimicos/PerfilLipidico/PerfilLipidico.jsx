import { ConfirmarImpresion, SubmitDataService, UpdateDataService, VerifyTR } from './controllerPerfilLipidico';
import { useSessionData } from '../../../../../../hooks/useSessionData';
import { useForm } from '../../../../../../hooks/useForm';
import { useRegistroEditable } from '../../../../../../hooks/useRegistroEditable';
import { getToday, getFechaHoraActual } from '../../../../../../utils/helpers';
import { buildAuditoria } from '../../../../../../utils/auditoriaUtils';
import {
  InputTextOneLine,
  SectionFieldset
} from '../../../../../../components/reusableComponents/ResusableComponents';
import SearchButton from '../../../../../../components/reusableComponents/SearchButton';
import AccionesRegistroHeader from '../../../../../../components/reusableComponents/AccionesRegistroHeader';
import AuditoriaRegistro from '../../../../../../components/reusableComponents/AuditoriaRegistro';
import { useEffect } from 'react';
import EmpleadoComboBox from '../../../../../../components/reusableComponents/EmpleadoComboBox';
import DatosPersonalesLaboralesAsistencial from '../../../../../../components/templates/DatosPersonalesLaboralesAsistencial';
import BotonesForm from '../../../../../../components/templates/BotonesForm';

// Campos que el usuario puede editar en este formulario (para resaltar/revertir cambios).
const CAMPOS_EDITABLES = [
  "fecha",
  "colesterolTotal",
  "trigliceridos",
  "hdl",
  "ldl",
  "vldl",
  "user_medicoFirma",
  "nombre_medico",
  "user_doctorAsignado",
  "nombre_doctorAsignado",
];

export default function PerfilLipidico() {
  const { token, userlogued, userName } = useSessionData();
  const today = getToday();

  const initialFormState = {
    numeroTicket: "",
    ticketImprimir: "",
    fecha: today,

    codAb: null,

    pacienteId: null,
    numeroDocumento: "",
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
    ocupacion: "",

    colesterolTotal: '',
    ldl: '',
    hdl: '',
    vldl: '',
    trigliceridos: '',

    // Médico que Certifica //BUSCADOR
    nombre_medico: userName,
    user_medicoFirma: userlogued,

    // Doctor Asignado //BUSCADOR
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
    handleChangeNumber,
    handleChangeNumberDecimals,
    handleFocusNext,
    handleChangeSimple,
    handleClear,
  } = useForm(initialFormState, { storageKey: "asistPerfilLipidico" });

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

  const handleSave = () => {
    SubmitDataService(form, token, userlogued, handleClear);
  };

  const handleEdit = () => {
    UpdateDataService(form, token, userlogued, handleClear);
  };

  // Equivalente a handleClearnotO pero conservando el N° Ticket digitado.
  const limpiarSalvoTicket = () => {
    setForm((prev) => ({ ...initialFormState, numeroTicket: prev.numeroTicket }));
  };

  // ===== Búsqueda con botón =====
  const executeSearch = () => {
    limpiarSalvoTicket();
    VerifyTR(form.numeroTicket, token, setForm);
  };

  const handleSearch = (e) => {
    if (!e || e.key === 'Enter') {
      executeSearch();
    }
  };

  const hayRegistroCargado = Boolean(form.nombres);

  const handlePrint = () => {
    ConfirmarImpresion(form.ticketImprimir, token);
  };

  const auditoria = buildAuditoria(form, {
    usuarioActual: userlogued,
    fechaHoraActual: getFechaHoraActual(),
  });

  useEffect(() => {
    if (!form.Editando) {
      const ct = form.colesterolTotal;
      const tg = form.trigliceridos;
      const nCT = parseFloat(String(ct).replace(',', '.'));
      const nTG = parseFloat(String(tg).replace(',', '.'));
      const updates = {};
      if (ct !== '' && Number.isFinite(nCT)) {
        const h = nCT * 0.25;
        updates.hdl = h.toFixed(1);
      } else {
        updates.hdl = '';
      }
      if (tg !== '' && Number.isFinite(nTG)) {
        const v = nTG / 5;
        updates.vldl = v.toFixed(1);
      } else {
        updates.vldl = '';
      }
      if (ct !== '' && tg !== '' && Number.isFinite(nCT) && Number.isFinite(nTG)) {
        const h = nCT * 0.25;
        const v = nTG / 5;
        updates.ldl = (nCT - h - v).toFixed(1);
      } else {
        updates.ldl = '';
      }
      setForm((prev) => ({
        ...prev,
        Editando: false,
        ...updates
      }));
    }
    else {
      setForm((prev) => ({
        ...prev,
        Editando: false,
      }));
    }
  }, [form.colesterolTotal, form.trigliceridos]);

  return (
    <div className="space-y-3 px-4 max-w-[90%] xl:max-w-[80%] mx-auto">
      <AccionesRegistroHeader
        tieneRegistro={form.tieneRegistro}
        hayRegistroCargado={hayRegistroCargado}
        edicionHabilitada={edicionHabilitada}
        onHabilitarEdicion={habilitarEdicion}
        onLimpiar={handleClear}
      />

      <SectionFieldset legend="Información del Examen" className="grid lg:grid-cols-2 gap-3">
        <div className="flex gap-x-3 w-full">
          <InputTextOneLine
            label="N° Ticket"
            name="numeroTicket"
            value={form.numeroTicket}
            onChange={handleChangeNumber}
            onKeyUp={handleSearch}
            disabled={hayRegistroCargado}
            className="w-full"
          />
          <SearchButton onClick={executeSearch} />
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
        />
      </SectionFieldset>

      <DatosPersonalesLaboralesAsistencial form={form} laborales={false} />

      <SectionFieldset legend="Parámetros Bioquímicos" className="grid grid-cols-1 gap-3">
        <div className="flex items-center gap-4">
          <InputTextOneLine
            label="Colesterol Total"
            name="colesterolTotal"
            value={form.colesterolTotal}
            labelWidth="120px"
            onChange={(e) => { handleChangeNumberDecimals(e, 1); }}
            onKeyUp={handleFocusNext}
            className='w-[75%]'
            disabled={camposDeshabilitados}
            edited={isFieldEdited("colesterolTotal")}
            onRevert={() => revertField("colesterolTotal")}
          />
          <span className="text-gray-500 text-[10px] font-medium">{"(Valor Normal < 200 mg/dl)"}</span>
        </div>
        <div className="flex items-center gap-4">
          <InputTextOneLine
            label="Triglicéridos"
            name="trigliceridos"
            value={form.trigliceridos}
            labelWidth="120px"
            onChange={(e) => { handleChangeNumberDecimals(e, 1); }}
            onKeyUp={handleFocusNext}
            className='w-[75%]'
            disabled={camposDeshabilitados}
            edited={isFieldEdited("trigliceridos")}
            onRevert={() => revertField("trigliceridos")}
          />
          <span className="text-gray-500 text-[10px] font-medium">{"(Valor Normal < 150 mg/dl)"}</span>
        </div>
        <div className="flex items-center gap-4">
          <InputTextOneLine
            label="H.D.L. Colesterol"
            name="hdl"
            value={form.hdl}
            labelWidth="120px"
            onChange={(e) => { handleChangeNumberDecimals(e, 1); }}
            onKeyUp={handleFocusNext}
            className='w-[75%]'
            disabled={camposDeshabilitados}
            edited={isFieldEdited("hdl")}
            onRevert={() => revertField("hdl")}
          />
          <span className="text-gray-500 text-[10px] font-medium">(Valor Normal 40 - 60 mg/dl)</span>
        </div>
        <div className="flex items-center gap-4">
          <InputTextOneLine
            label="L.D.L. Colesterol"
            name="ldl"
            value={form.ldl}
            labelWidth="120px"
            onChange={(e) => { handleChangeNumberDecimals(e, 1); }}
            onKeyUp={handleFocusNext}
            className='w-[75%]'
            disabled={camposDeshabilitados}
            edited={isFieldEdited("ldl")}
            onRevert={() => revertField("ldl")}
          />
          <span className="text-gray-500 text-[10px] font-medium">{"(Valor Normal < 129 mg/dl)"}</span>
        </div>
        <div className="flex items-center gap-4">
          <InputTextOneLine
            label="V.L.D.L. Colesterol"
            name="vldl"
            value={form.vldl}
            labelWidth="120px"
            onChange={(e) => { handleChangeNumberDecimals(e, 1); }}
            className='w-[75%]'
            disabled={camposDeshabilitados}
            edited={isFieldEdited("vldl")}
            onRevert={() => revertField("vldl")}
          />
          <span className="text-gray-500 text-[10px] font-medium">{"(Valor Normal < 30 mg/dl)"}</span>
        </div>
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
          form={form}
          label="Doctor Asignado"
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
        handleSave={form.tieneRegistro && edicionHabilitada ? handleEdit : handleSave}
        saveLabel={form.tieneRegistro && edicionHabilitada ? "Guardar Cambios" : "Guardar"}
        handleEdit={habilitarEdicion}
        handleClear={handleClear}
        handlePrint={handlePrint}
        printField="ticketImprimir"
        printLabel="IMPRIMIR N° TICKET"
        hideSave={form.tieneRegistro && !edicionHabilitada}
        hideEdit={!form.tieneRegistro || edicionHabilitada}
      />
    </div>
  );
}
