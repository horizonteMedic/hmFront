import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faEdit } from "@fortawesome/free-solid-svg-icons";
import { useSessionData } from "../../../../hooks/useSessionData";
import { useForm } from "../../../../hooks/useForm";
import { useRegistroEditable } from "../../../../hooks/useRegistroEditable";
import {
  PrintHojaR,
  SubmitDataService,
  UpdateDataService,
  VerifyTR,
} from "./controllerAntecedentesDeAltura";
import { getToday, getFechaHoraActual } from "../../../../utils/helpers";
import { buildAuditoria } from "../../../../utils/auditoriaUtils";
import EmpleadoComboBox from "../../../../components/reusableComponents/EmpleadoComboBox";
import SectionFieldset from "../../../../components/reusableComponents/SectionFieldset";
import InputTextOneLine from "../../../../components/reusableComponents/InputTextOneLine";
import SearchButton from "../../../../components/reusableComponents/SearchButton";
import RegistroEstadoPill from "../../../../components/reusableComponents/RegistroEstadoPill";
import AuditoriaRegistro from "../../../../components/reusableComponents/AuditoriaRegistro";
import DatosPersonalesLaborales from "../../../../components/templates/DatosPersonalesLaborales";
import BotonesForm from "../../../../components/templates/BotonesForm";
import RadioTable from "../../../../components/reusableComponents/RadioTable";
import InputsBooleanRadioGroup from "../../../../components/reusableComponents/InputsBooleanRadioGroup";
import InputTextArea from "../../../../components/reusableComponents/InputTextArea";
import { getAntecedentesDeAlturaInitialFormState } from "./antecedentesDeAlturaFormDefaults";
import CargaMasivaAntecedentesDeAltura from "./CargaMasivaAntecedentesDeAltura/CargaMasivaAntecedentesDeAltura";

const tabla = "antece_enfermedades_altura";

// Campos que el usuario puede editar en este formulario (para resaltar/revertir cambios).
const CAMPOS_EDITABLES = [
  "fechaExam",
  "apto",
  "comentarios",
  "otrosDescripcion",
  "user_medicoFirma",
  "nombre_medico",
];

export default function AntecedentesDeAltura() {
  const today = getToday();
  const {
    token,
    userlogued,
    selectedSede,
    datosFooter,
    userName,
    userDNI,
    userCMP,
    userEmail,
    userDireccion,
  } = useSessionData();

  const initialFormState = getAntecedentesDeAlturaInitialFormState({
    today,
    userlogued,
    userName,
    userDNI,
    userCMP,
    userEmail,
    userDireccion,
  });

  const [modalCargaMasiva, setModalCargaMasiva] = useState(false);

  const {
    form,
    setForm,
    handleChange,
    handleChangeNumber,
    handleChangeNumberDecimals,
    handleClear,
    handleChangeSimple,
    handleClearnotO,
    handlePrintDefault,
    handleRadioButtonBoolean,
  } = useForm(initialFormState, { storageKey: "antecedentes_altura" });

  const {
    edicionHabilitada,
    habilitarEdicion,
    camposDeshabilitados,
    isFieldEdited,
    revertField,
    revertFields,
  } = useRegistroEditable(form, setForm, {
    tieneRegistro: form.tieneRegistro,
    camposEditables: CAMPOS_EDITABLES,
  });

  // El médico se compone de 2 campos (id de firma + nombre): se detecta el cambio por
  // el id y se revierten ambos en conjunto.
  const isMedicoEdited = isFieldEdited("user_medicoFirma");
  const revertMedico = () => revertFields(["user_medicoFirma", "nombre_medico"]);

  const handleSave = () => {
    SubmitDataService(form, token, userlogued, handleClear, tabla, datosFooter);
  };

  const handleEdit = () => {
    UpdateDataService(form, token, userlogued, handleClear, tabla, datosFooter);
  };

  // ===== Búsqueda con botón =====
  const executeSearch = () => {
    handleClearnotO();
    VerifyTR(form.norden, tabla, token, setForm, selectedSede);
  };

  // ===== Búsqueda con enter =====
  const handleSearch = (e) => {
    if (!e || e.key === "Enter") {
      executeSearch();
    }
  };

  const hayRegistroCargado = Boolean(form.nombres || form.dni);

  const handlePrintNordenChange = (e) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return; // solo dígitos

    const hayDatosCargados = Boolean(form.nombres || form.dni || form.tieneRegistro);
    if (hayDatosCargados && value !== form.norden) {
      setForm({ ...initialFormState, norden: value });
    } else {
      setForm((f) => ({ ...f, norden: value }));
    }
  };

  const handlePrint = () => {
    handlePrintDefault(() => {
      PrintHojaR(form.norden, token, tabla, datosFooter);
    });
  };

  const auditoria = buildAuditoria(form, {
    usuarioActual: userlogued,
    fechaHoraActual: getFechaHoraActual(),
  });

  return (
    <div className="space-y-3 px-4 max-w-[90%] xl:max-w-[80%] mx-auto">
      <div className="sticky top-2 z-20 flex justify-end items-center gap-2 pointer-events-none">
        <button
          type="button"
          onClick={() => setModalCargaMasiva(true)}
          className="pointer-events-auto verde-btn px-4 py-2 rounded flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faUpload} /> Carga Masiva
        </button>
        <RegistroEstadoPill
          tieneRegistro={form.tieneRegistro}
          className={hayRegistroCargado ? "" : "invisible"}
        />
        {hayRegistroCargado && form.tieneRegistro && !edicionHabilitada && (
          <button
            type="button"
            onClick={habilitarEdicion}
            className="pointer-events-auto inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-3 py-1.5 rounded-full shadow-sm transition-all duration-150 ease-out hover:shadow-lg active:scale-95"
          >
            <FontAwesomeIcon icon={faEdit} /> Habilitar edición
          </button>
        )}
      </div>

      <SectionFieldset
        legend="Antecedentes de Enfermedades en Altura"
        className="grid grid-cols-1 xl:grid-cols-3 gap-x-4 gap-y-3"
      >
        <div className="flex gap-x-3 w-full">
          <InputTextOneLine
            label="N° Orden"
            name="norden"
            value={form?.norden}
            onChange={handleChangeNumber}
            onKeyUp={handleSearch}
            disabled={hayRegistroCargado}
            labelWidth="120px"
            className="w-full"
          />
          <SearchButton onClick={executeSearch} />
        </div>

        <InputTextOneLine
          label="Fecha"
          type="date"
          name="fechaExam"
          value={form.fechaExam || ""}
          onChange={handleChangeSimple}
          disabled={camposDeshabilitados}
          edited={isFieldEdited("fechaExam")}
          onRevert={() => revertField("fechaExam")}
          labelWidth="120px"
        />

        <InputsBooleanRadioGroup
          label="Aptitud"
          name="apto"
          value={form?.apto}
          onChange={handleRadioButtonBoolean}
          trueLabel="Apto"
          falseLabel="No apto"
          disabled={camposDeshabilitados}
          edited={isFieldEdited("apto")}
          onRevert={() => revertField("apto")}
        />
      </SectionFieldset>

      <DatosPersonalesLaborales form={form} />

      <SectionFieldset legend="Médico" className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-3">
        <InputTextOneLine
          label="Nombres"
          name="nombreMedico"
          value={form?.nombreMedico}
          disabled
          labelWidth="120px"
        />
        <InputTextOneLine
          label="CMP"
          name="cmp"
          value={form.cmp || ""}
          disabled
          labelWidth="120px"
        />
        <InputTextOneLine
          label="Email"
          name="email"
          value={form?.email}
          disabled
          labelWidth="120px"
        />
        <InputTextOneLine
          label="Dirección"
          name="direccionMedico"
          value={form.direccionMedico || ""}
          disabled
          labelWidth="120px"
        />
      </SectionFieldset>

      <SectionFieldset legend="Antecedentes patológicos">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-3">
          <RadioTable
            className="grid grid-cols-1 md:grid-cols-2"
            items={[
              { name: "accidenteCerebrovascular", label: "Accidente cerebrovascular" },
              { name: "anginaInestable", label: "Angina inestable" },
              {
                name: "antecedenteBypass",
                label: "Antecedente de Bypass arterial coronario/Angioplastia/Stent",
              },
              {
                name: "antecedenteEdemaCerebral",
                label: "Antecedente de edema cerebral de altura",
              },
              {
                name: "antecedenteEdemaPulmonar",
                label: "Antecendente de edema pulmonar de altura",
              },
              {
                name: "antecedenteNeumotorax",
                label: "Antecedente de Neumotórax en los ultimos 6 meses",
              },
              { name: "arritmiaCardiaca", label: "Arritmia cardiaca no controlada" },
              {
                name: "cardiomiopatiaHipertrofica",
                label: "Cardiomiopatía hipertrófica idiopática",
              },
              { name: "cirugiaMayor", label: "Cirugía mayor en los últimos 30 días" },
              {
                name: "insuficienciaValvulaAortica",
                label: "Cualquier insuficiencia en la válvula aórtica",
              },
              { name: "diabetesMellitus", label: "Diabetes Mellitus" },
              { name: "embarazo", label: "Embarazo" },
              { name: "epilepsia", label: "Epilepsia" },
            ]}
            options={[
              { value: true, label: "SI" },
              { value: false, label: "NO" },
            ]}
            labelColumns={6}
            form={form}
            handleRadioButton={handleRadioButtonBoolean}
            disabled={camposDeshabilitados}
          />

          <RadioTable
            className="grid grid-cols-1 md:grid-cols-2"
            items={[
              {
                name: "epoc",
                label: "EPOC - Enfermedad pulmonar obstructiva crónica confirmada",
              },
              {
                name: "eritrocitosisExcesiva",
                label: "Eritrocitosis excesiva (mal de montaña crónico)",
              },
              { name: "hipertensionArterial", label: "Hipertensión arterial" },
              { name: "hipertensionPulmonar", label: "Hipertensión pulmonar" },
              {
                name: "infartoMiocardio",
                label: "Infarto al miocardio en los últimos 6 meses",
              },
              {
                name: "insuficienciaCardiaca",
                label: "Insuficiencia cardíaca congestiva",
              },
              {
                name: "patologiaHemorragicaRetina",
                label: "Patología hemorrágica de retina",
              },
              {
                name: "patologiaValvularCardiaca",
                label: "Patología Valvular Cardíaca en tratamiento (ICC)",
              },
              { name: "presenciaMarcapasos", label: "Presencia de marcapasos" },
              {
                name: "riesgoCardiovascularAlto",
                label: "Presencia de riesgo cardiovascular alto",
              },
              { name: "trastornosCoagulacion", label: "Trastornos de la coagulación" },
              { name: "trombosisVenosaCerebral", label: "Trombosis venosa cerebral" },
              { name: "otros", label: "Otros" },
            ]}
            options={[
              { value: true, label: "SI" },
              { value: false, label: "NO" },
            ]}
            labelColumns={6}
            form={form}
            handleRadioButton={handleRadioButtonBoolean}
            disabled={camposDeshabilitados}
          />
        </div>

        {form.otros && (
          <InputTextOneLine
            label="Descripción (Otros)"
            name="otrosDescripcion"
            value={form.otrosDescripcion || ""}
            onChange={handleChange}
            disabled={camposDeshabilitados}
            edited={isFieldEdited("otrosDescripcion")}
            onRevert={() => revertField("otrosDescripcion")}
            labelWidth="160px"
            className="mt-3"
          />
        )}
      </SectionFieldset>

      <SectionFieldset legend="Comentarios">
        <InputTextArea
          name="comentarios"
          value={form.comentarios}
          onChange={handleChange}
          rows={4}
          disabled={camposDeshabilitados}
          edited={isFieldEdited("comentarios")}
          onRevert={() => revertField("comentarios")}
        />
      </SectionFieldset>

      <SectionFieldset legend="Asignación de médico">
        <EmpleadoComboBox
          value={form.nombre_medico}
          label="Especialista"
          form={form}
          onChange={handleChangeSimple}
          disabled={camposDeshabilitados}
          edited={isMedicoEdited}
          onRevert={revertMedico}
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

      {modalCargaMasiva && (
        <CargaMasivaAntecedentesDeAltura
          onClose={() => setModalCargaMasiva(false)}
          token={token}
          userlogued={userlogued}
          userName={userName}
          userDNI={userDNI}
          userCMP={userCMP}
          userEmail={userEmail}
          userDireccion={userDireccion}
          tabla={tabla}
          sede={selectedSede}
        />
      )}
    </div>
  );
}
