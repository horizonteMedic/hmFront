import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  InputTextOneLine,
  InputTextArea,
  SectionFieldset,
} from "../../../../components/reusableComponents/ResusableComponents";
import { SelectField } from "../../../../components/reusableComponents/InputSelect";
import AccionesRegistroHeader from "../../../../components/reusableComponents/AccionesRegistroHeader";
import AuditoriaRegistro from "../../../../components/reusableComponents/AuditoriaRegistro";
import SearchButton from "../../../../components/reusableComponents/SearchButton";
import EmpleadoComboBox from "../../../../components/reusableComponents/EmpleadoComboBox";
import BotonesForm from "../../../../components/templates/BotonesForm";
import { useSessionData } from "../../../../hooks/useSessionData";
import { useForm } from "../../../../hooks/useForm";
import { useRegistroEditable } from "../../../../hooks/useRegistroEditable";
import { getFechaHoraActual } from "../../../../utils/helpers";
import { buildAuditoria } from "../../../../utils/auditoriaUtils";
import {
  ConfirmarImpresion,
  ESPECIALIDADES,
  ObtenerCatalogos,
  SubmitDataService,
  VerifyTR,
} from "./controllerHojaReferencia";

// Campos propios que el usuario puede editar (para resaltar/revertir cambios). Paciente, triaje (salvo
// MSNM), historia clínica y receta vienen del backend en solo lectura.
const CAMPOS_EDITABLES = [
  "establecimientoOrigen",
  "establecimientoDestino",
  "areaAtencion",
  "resumenHistoriaClinica",
  "msnm",
  "motivoReferencia",
  "especialidad",
  "condicion",
  "relacionPertenencias",
  "user_medicoFirma",
  "nombre_medico",
];

// Opciones { value, label } de un select a partir de una lista de textos. Un valor ya guardado que no
// está en la lista (p. ej. cargado desde otro sistema) se conserva como opción extra.
const opcionesDe = (lista, actual) => {
  const opciones = [...lista];
  if (actual && !opciones.includes(actual)) opciones.push(actual);
  return opciones.map((opcion) => ({ value: opcion, label: opcion }));
};

export default function HojaReferencia() {
  const { token, userlogued, userName, listaEmpleados, datosFooter } = useSessionData();

  // Valores por defecto y listas del backend (GET .../catalogos).
  const [catalogos, setCatalogos] = useState(null);

  const initialFormState = {
    // Control de edición + auditoría (useRegistroEditable / buildAuditoria)
    id: null,
    ticketCargado: false,
    tieneRegistro: false,
    userRegistro: "",
    fechaRegistro: "",
    usuarioActualizacion: "",
    fechaActualizacion: "",

    // Datos Generales
    numeroTicket: "",
    ticketImprimir: "",
    establecimientoOrigen: catalogos?.establecimientoOrigenDefault ?? "",
    establecimientoDestino: "",
    areaAtencion: catalogos?.areaAtencionDefault ?? "",

    // Datos del Paciente (solo lectura)
    numeroHistoriaClinica: "",
    nombres: "",
    direccion: "",
    celular: "",
    sexo: "",
    edad: "",
    empresa: "",

    resumenHistoriaClinica: "",

    // Triaje (solo lectura, salvo MSNM)
    temperatura: "",
    presionArterial: "",
    frecuenciaCardiaca: "",
    frecuenciaRespiratoria: "",
    saturacionO2: "",
    msnm: "",

    // Historia clínica y receta (solo lectura)
    fuenteHistoria: "",
    examenFisico: "",
    diagnostico: "",
    tratamiento: "",

    // Datos de la Referencia
    motivoReferencia: "",
    especialidad: "",
    condicion: "",
    relacionPertenencias: "",

    // Persona que indica el traslado: por defecto el usuario de la sesión
    nombre_medico: userName,
    user_medicoFirma: userlogued,
  };

  const {
    form,
    setForm,
    handleChange,
    handleChangeSimple,
    handleChangeNumberDecimals,
    handleClear,
  } = useForm(initialFormState, { storageKey: "hoja_referencia_ticket" });

  const {
    edicionHabilitada,
    habilitarEdicion,
    camposDeshabilitados,
    isFieldEdited,
    revertField,
    revertFields,
  } = useRegistroEditable(form, setForm, { tieneRegistro: form.tieneRegistro, camposEditables: CAMPOS_EDITABLES });

  // La persona se compone de 2 campos (id de usuario + nombre): se detecta el cambio por el id y se
  // revierten ambos en conjunto.
  const isPersonaEdited = isFieldEdited("user_medicoFirma");
  const revertPersona = () => revertFields(["user_medicoFirma", "nombre_medico"]);

  const hayRegistroCargado = form.ticketCargado;

  const auditoria = buildAuditoria(form, {
    usuarioActual: userlogued,
    fechaHoraActual: getFechaHoraActual(),
  });

  // ===== Catálogos =====
  useEffect(() => {
    let vigente = true;
    ObtenerCatalogos(token).then((resultado) => {
      if (!vigente) return;
      if (resultado) {
        setCatalogos(resultado);
      } else {
        Swal.fire(
          "Aviso",
          "No se pudieron cargar las opciones de Área de atención y Condición. Se volverá a intentar al buscar un ticket.",
          "warning"
        );
      }
    });
    return () => {
      vigente = false;
    };
  }, [token]);

  // Con los catálogos ya leídos, un formulario nuevo toma los valores por defecto.
  useEffect(() => {
    if (!catalogos) return;
    setForm((f) =>
      f.ticketCargado
        ? f
        : {
          ...f,
          establecimientoOrigen: f.establecimientoOrigen || catalogos.establecimientoOrigenDefault,
          areaAtencion: f.areaAtencion || catalogos.areaAtencionDefault,
        }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catalogos]);

  // ===== Acciones =====
  const handleSave = () => {
    SubmitDataService(form, token, userlogued, handleClear, datosFooter);
  };

  const handlePrint = () => {
    ConfirmarImpresion(form.ticketImprimir, token, datosFooter);
  };

  // ===== Búsqueda con botón / enter =====
  const executeSearch = async () => {
    const numeroTicket = form.numeroTicket;
    setForm({ ...initialFormState, numeroTicket });

    // Si los catálogos no se pudieron leer al abrir, se reintenta aquí.
    let listas = catalogos;
    if (!listas) {
      listas = await ObtenerCatalogos(token);
      if (listas) setCatalogos(listas);
    }
    VerifyTR(numeroTicket, token, setForm, listas, listaEmpleados);
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") executeSearch();
  };

  const opcionesOrigen = opcionesDe(
    catalogos?.establecimientoOrigenDefault ? [catalogos.establecimientoOrigenDefault] : [],
    form.establecimientoOrigen
  );
  const opcionesArea = opcionesDe(catalogos?.areasAtencion ?? [], form.areaAtencion);
  const opcionesCondicion = opcionesDe(catalogos?.condiciones ?? [], form.condicion);
  const opcionesEspecialidad = opcionesDe(ESPECIALIDADES, form.especialidad);

  // Props comunes de los campos propios (bloqueo general + resaltado/revert por campo).
  const editable = (campo) => ({
    disabled: camposDeshabilitados,
    edited: isFieldEdited(campo),
    onRevert: () => revertField(campo),
  });

  return (
    <div className="space-y-3 px-4 max-w-[95%] xl:max-w-[90%] mx-auto">
      <AccionesRegistroHeader
        tieneRegistro={form.tieneRegistro}
        hayRegistroCargado={hayRegistroCargado}
        edicionHabilitada={edicionHabilitada}
        onHabilitarEdicion={habilitarEdicion}
        onLimpiar={handleClear}
      />

      {/* ===== SECCIÓN: DATOS GENERALES ===== */}
      <SectionFieldset legend="Datos Generales" className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-3">
        <div className="flex gap-x-3 w-full">
          <InputTextOneLine
            label="N° Ticket"
            name="numeroTicket"
            value={form.numeroTicket}
            onChange={handleChangeNumberDecimals}
            onKeyUp={handleSearch}
            disabled={hayRegistroCargado}
            labelWidth="180px"
            className="w-full"
          />
          <SearchButton onClick={executeSearch} disabled={hayRegistroCargado} className="lg:hidden" />
        </div>
        <SelectField
          label="Establecimiento de Origen"
          name="establecimientoOrigen"
          value={form.establecimientoOrigen}
          onChange={handleChangeSimple}
          options={opcionesOrigen}
          inline
          labelWidth="180px"
          {...editable("establecimientoOrigen")}
        />
        <InputTextOneLine
          label="Establecimiento de Destino"
          name="establecimientoDestino"
          value={form.establecimientoDestino}
          onChange={handleChange}
          labelWidth="180px"
          required
          {...editable("establecimientoDestino")}
        />
        <SelectField
          label="Área de Atención"
          name="areaAtencion"
          value={form.areaAtencion}
          onChange={handleChangeSimple}
          options={opcionesArea}
          inline
          labelWidth="180px"
          {...editable("areaAtencion")}
        />
      </SectionFieldset>

      {/* ===== SECCIÓN: DATOS DEL PACIENTE (solo lectura) ===== */}
      <SectionFieldset legend="Datos del Paciente" collapsible className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-3">
        <InputTextOneLine label="Nombres" name="nombres" value={form.nombres} disabled labelWidth="120px" />
        <InputTextOneLine label="N° HCL" name="numeroHistoriaClinica" value={form.numeroHistoriaClinica} disabled labelWidth="120px" />
        <InputTextOneLine label="Dirección" name="direccion" value={form.direccion} disabled labelWidth="120px" />
        <InputTextOneLine label="Celular" name="celular" value={form.celular} disabled labelWidth="120px" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-3">
          <InputTextOneLine label="Sexo" name="sexo" value={form.sexo} disabled labelWidth="120px" />
          <InputTextOneLine label="Edad (Años)" name="edad" value={form.edad} disabled labelWidth="120px" />
        </div>
        <InputTextOneLine label="Empresa" name="empresa" value={form.empresa} disabled labelWidth="120px" />
      </SectionFieldset>

      {/* ===== SECCIÓN: RESUMEN DE HISTORIA CLÍNICA ===== */}
      <SectionFieldset legend="Resumen de Historia Clínica">
        <InputTextArea
          name="resumenHistoriaClinica"
          value={form.resumenHistoriaClinica}
          onChange={handleChange}
          rows={4}
          {...editable("resumenHistoriaClinica")}
        />
      </SectionFieldset>

      {/* ===== SECCIÓN: FUNCIONES VITALES (triaje) ===== */}
      <SectionFieldset legend="Funciones Vitales (Triaje)" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-3">
        <InputTextOneLine label="Temperatura (°C)" name="temperatura" value={form.temperatura} disabled labelOnTop />
        <InputTextOneLine label="P.A. (mmHg)" name="presionArterial" value={form.presionArterial} disabled labelOnTop />
        <InputTextOneLine label="F.C. (x min)" name="frecuenciaCardiaca" value={form.frecuenciaCardiaca} disabled labelOnTop />
        <InputTextOneLine label="F.R. (x min)" name="frecuenciaRespiratoria" value={form.frecuenciaRespiratoria} disabled labelOnTop />
        <InputTextOneLine label="Sat. O₂ (%)" name="saturacionO2" value={form.saturacionO2} disabled labelOnTop />
        <InputTextOneLine
          label="MSNM"
          name="msnm"
          value={form.msnm}
          onChange={handleChangeNumberDecimals}
          labelOnTop
          {...editable("msnm")}
        />
      </SectionFieldset>

      {/* ===== SECCIÓN: EXAMEN FÍSICO, DIAGNÓSTICO Y TRATAMIENTO (historia clínica y receta, solo lectura) ===== */}
      <SectionFieldset legend="Examen Físico, Diagnóstico y Tratamiento (solo lectura)" collapsible className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <InputTextArea label="Examen Físico" name="examenFisico" value={form.examenFisico} rows={4} disabled className="lg:col-span-2" />
        <InputTextArea label="Diagnóstico" name="diagnostico" value={form.diagnostico} rows={4} disabled />
        <InputTextArea label="Tratamiento" name="tratamiento" value={form.tratamiento} rows={4} disabled />
        {form.fuenteHistoria && (
          <p className="text-sm italic text-gray-600 lg:col-span-2">Historia clínica de origen: {form.fuenteHistoria}</p>
        )}
      </SectionFieldset>

      {/* ===== SECCIÓN: DATOS DE LA REFERENCIA ===== */}
      <SectionFieldset legend="Datos de la Referencia" className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-3">
        <InputTextArea
          label="Motivo de la Referencia"
          name="motivoReferencia"
          value={form.motivoReferencia}
          onChange={handleChange}
          rows={3}
          required
          className="lg:col-span-2"
          {...editable("motivoReferencia")}
        />
        <SelectField
          label="Especialidad"
          name="especialidad"
          value={form.especialidad}
          onChange={handleChangeSimple}
          options={opcionesEspecialidad}
          inline
          labelWidth="120px"
          {...editable("especialidad")}
        />
        <SelectField
          label="Condición"
          name="condicion"
          value={form.condicion}
          onChange={handleChangeSimple}
          options={opcionesCondicion}
          inline
          labelWidth="120px"
          required
          {...editable("condicion")}
        />
        <InputTextArea
          label="Relación de Pertenencias del Paciente"
          name="relacionPertenencias"
          value={form.relacionPertenencias}
          onChange={handleChange}
          rows={3}
          className="lg:col-span-2"
          {...editable("relacionPertenencias")}
        />
      </SectionFieldset>

      {/* ===== SECCIÓN: PERSONA QUE INDICA EL TRASLADO ===== */}
      <SectionFieldset legend="Persona que Indica el Traslado">
        <EmpleadoComboBox
          value={form.nombre_medico}
          label="Usuario"
          form={form}
          onChange={handleChangeSimple}
          disabled={camposDeshabilitados}
          edited={isPersonaEdited}
          onRevert={revertPersona}
        />
      </SectionFieldset>

      {/* ===== SECCIÓN: AUDITORÍA DEL REGISTRO (usuario y fecha-hora de creación) ===== */}
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
        handleSave={handleSave}
        saveLabel={form.tieneRegistro && edicionHabilitada ? "Guardar Cambios" : "Guardar"}
        handleEdit={habilitarEdicion}
        handleClear={handleClear}
        hideSave={form.tieneRegistro && !edicionHabilitada}
        hideEdit={!form.tieneRegistro || edicionHabilitada}
        handlePrint={handlePrint}
        printField="ticketImprimir"
        printLabel="IMPRIMIR N° TICKET"
        handleChangeNumberDecimals={handleChangeNumberDecimals}
      />
    </div>
  );
}
