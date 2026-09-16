import { useMemo } from "react";
import { useSessionData } from "../../../../../../hooks/useSessionData";
import { useForm } from "../../../../../../hooks/useForm";
import { useRegistroEditable } from "../../../../../../hooks/useRegistroEditable";
import { getToday, getFechaHoraActual } from "../../../../../../utils/helpers";
import { buildAuditoria } from "../../../../../../utils/auditoriaUtils";
import {
  PrintHojaR,
  VerifyTR,
  SubmitDataService,
  UpdateDataService,
} from "./controllerCoproParasitologia";
import {
  InputCheckbox,
  InputTextOneLine,
} from "../../../../../../components/reusableComponents/ResusableComponents";
import SectionFieldset from "../../../../../../components/reusableComponents/SectionFieldset";
import SearchButton from "../../../../../../components/reusableComponents/SearchButton";
import AccionesRegistroHeader from "../../../../../../components/reusableComponents/AccionesRegistroHeader";
import AuditoriaRegistro from "../../../../../../components/reusableComponents/AuditoriaRegistro";
import EmpleadoComboBox from "../../../../../../components/reusableComponents/EmpleadoComboBox";
import BotonesForm from "../../../../../../components/templates/BotonesForm";

const tabla = "ac_coproparasitologico";
const colorOptions = ["MARRON", "MOSTAZA", "VERDOSO"];
const consistenciaOptions = ["SOLIDO", "SEMISOLIDO", "DIARREICO"];
const presenceOptions = ["AUSENTE", "PRESENTE"];

const muestrasConfig = [
  { id: "1", label: "MUESTRA: HECES I" },
  { id: "2", label: "MUESTRA: HECES II" },
  { id: "3", label: "MUESTRA: HECES III" },
];

const microsConfig = [
  { id: "1", label: "EXAMEN MICROSCÓPICO I" },
  { id: "2", label: "EXAMEN MICROSCÓPICO II" },
  { id: "3", label: "EXAMEN MICROSCÓPICO III" },
];

const muestraFields = [
  { key: "color", label: "Color", options: colorOptions },
  { key: "aspecto", label: "Aspecto", options: consistenciaOptions },
  { key: "moco", label: "Moco Fecal", options: presenceOptions },
  { key: "grasa", label: "Grasa", options: presenceOptions },
  { key: "sangre", label: "Sangre Visible", options: presenceOptions },
  { key: "restos", label: "Restos Alimenticios", options: presenceOptions },
];

const microsFields = [
  { key: "leucocitos", label: "Leucocitos", type: "campo" },
  { key: "hematies", label: "Hematíes", type: "campo" },
  { key: "parasitos", label: "Parásitos", type: "presence" },
];

// Campos que el usuario puede editar en este formulario (para resaltar/revertir cambios).
const CAMPOS_EDITABLES = [
  "fecha",
  "tipoCoproparasitologico",
  "sinHecesTres",
  ...muestrasConfig.flatMap(({ id }) => muestraFields.map(({ key }) => `heces${id}_${key}`)),
  ...microsConfig.flatMap(({ id }) => microsFields.map(({ key }) => `micro${id}_${key}`)),
  "user_medicoFirma",
  "nombre_medico",
  "user_doctorAsignado",
  "nombre_doctorAsignado",
];

export default function Coproparasitologia() {
  const { token, userlogued, selectedSede, userName } = useSessionData();
  const today = getToday();

  const createInitialState = (today) => {
    const base = {
      norden: "",
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

      tipoCoproparasitologico: false,
      sinHecesTres: false,

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
    muestrasConfig.forEach(({ id }) => {
      muestraFields.forEach(({ key }) => {
        base[`heces${id}_${key}`] = "";
      });
    });
    microsConfig.forEach(({ id }) => {
      microsFields.forEach(({ key }) => {
        base[`micro${id}_${key}`] = "";
      });
    });
    return base;
  };

  const initialFormState = useMemo(() => createInitialState(today), [today]);

  const {
    form,
    setForm,
    handleChangeNumberDecimals,
    handleChange,
    handleChangeSimple,
    handleClear,
    handleClearnotO,
    handlePrintDefault,
  } = useForm(initialFormState, { storageKey: "coproparasitologia" });

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

  const toggleValue = (field, value) => {
    const normalized = value.toUpperCase();
    setForm((prev) => ({
      ...prev,
      [field]: prev[field] === normalized ? "" : normalized,
    }));
  };

  const toggleCampoValue = (field) => {
    setForm((prev) => {
      const current = prev[field] ?? "";
      const hasXCampo = current.toUpperCase().includes("X CAMPO");
      if (hasXCampo) {
        return { ...prev, [field]: current.replace(/ *x campo/gi, "").trim() };
      }
      if (/\d/.test(current)) {
        return { ...prev, [field]: `${current.trim()} X CAMPO`.toUpperCase() };
      }
      return { ...prev, [field]: "X CAMPO" };
    });
  };

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
    if (!e || e.key === "Enter") {
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

  const renderMuestraField = (sampleId, field, disabled) => {
    const name = `heces${sampleId}_${field.key}`;
    return (
      <div key={name} className="space-y-2">
        <InputTextOneLine
          label={field.label}
          name={name}
          value={form[name]}
          onChange={handleChange}
          disabled={disabled}
          edited={isFieldEdited(name)}
          onRevert={() => revertField(name)}
          labelOnTop
        />
        <div className="flex flex-wrap gap-3">
          {field.options.map((opt) => (
            <label
              key={`${name}-${opt}`}
              className="flex items-center gap-2 text-xs md:text-sm"
            >
              <input
                type="checkbox"
                disabled={disabled}
                checked={form[name] === opt}
                onChange={() => toggleValue(name, opt)}
              />
              {opt}
            </label>
          ))}
        </div>
      </div>
    );
  };

  const renderMicroField = (sampleId, field, disabled) => {
    const name = `micro${sampleId}_${field.key}`;
    if (field.type === "campo") {
      return (
        <div key={name} className="space-y-2">
          <InputTextOneLine
            label={field.label}
            name={name}
            value={form[name]}
            onChange={handleChange}
            disabled={disabled}
            edited={isFieldEdited(name)}
            onRevert={() => revertField(name)}
            labelOnTop
          />
          <div className="flex flex-wrap gap-3">
            <label className="flex items-center gap-2 text-xs md:text-sm">
              <input
                type="checkbox"
                disabled={disabled}
                checked={form[name] === "NO SE OBSERVAN"}
                onChange={() => toggleValue(name, "NO SE OBSERVAN")}
              />
              No se observan
            </label>
            <label className="flex items-center gap-2 text-xs md:text-sm">
              <input
                type="checkbox"
                disabled={disabled}
                checked={form[name]?.toUpperCase().includes("X CAMPO")}
                onChange={() => toggleCampoValue(name)}
              />
              __ x campo
            </label>
          </div>
        </div>
      );
    }
    return (
      <div key={name} className="space-y-2">
        <InputTextOneLine
          label={field.label}
          name={name}
          value={form[name]}
          onChange={handleChange}
          disabled={disabled}
          edited={isFieldEdited(name)}
          onRevert={() => revertField(name)}
          labelOnTop
        />
        <div className="flex flex-wrap gap-3">
          {presenceOptions.map((opt) => (
            <label
              key={`${name}-${opt}`}
              className="flex items-center gap-2 text-xs md:text-sm"
            >
              <input
                type="checkbox"
                disabled={disabled}
                checked={form[name] === opt}
                onChange={() => toggleValue(name, opt)}
              />
              {opt}
            </label>
          ))}
        </div>
      </div>
    );
  };

  const handleCheckBoxChange = (e) => {
    const { name, checked } = e.target;

    setForm((prev) => {
      const newForm = {
        ...prev,
        [name]: checked,
      };

      if (name === "tipoCoproparasitologico" && checked) {
        newForm.sinHecesTres = false;
      } else if (name === "sinHecesTres" && checked) {
        newForm.tipoCoproparasitologico = false;
      }

      if (name === "sinHecesTres") {
        muestraFields.forEach((field) => {
          newForm[`heces3_${field.key}`] = checked ? "N/A" : "";
        });

        microsFields.forEach((field) => {
          newForm[`micro3_${field.key}`] = checked ? "N/A" : "";
        });

        if (checked) {
          muestraFields.forEach((field) => {
            newForm[`heces2_${field.key}`] = "";
          });
          microsFields.forEach((field) => {
            newForm[`micro2_${field.key}`] = "";
          });
        }
      }

      if (name === "tipoCoproparasitologico") {
        muestraFields.forEach((field) => {
          newForm[`heces2_${field.key}`] = checked ? "N/A" : "";
          newForm[`heces3_${field.key}`] = checked ? "N/A" : "";
        });

        microsFields.forEach((field) => {
          newForm[`micro2_${field.key}`] = checked ? "N/A" : "";
          newForm[`micro3_${field.key}`] = checked ? "N/A" : "";
        });

        if (checked) {
          muestraFields.forEach((field) => {
            newForm[`heces2_${field.key}`] = "N/A";
            newForm[`heces3_${field.key}`] = "N/A";
          });
          microsFields.forEach((field) => {
            newForm[`micro2_${field.key}`] = "N/A";
            newForm[`micro3_${field.key}`] = "N/A";
          });
        }
      }

      return newForm;
    });
  };

  const marcarTodoAusenteMuestras = () => {
    setForm((prev) => {
      const updated = { ...prev };

      const anyAusente = muestrasConfig.some((sample, idx) => {
        const disabled =
          (prev.tipoCoproparasitologico && idx > 0) ||
          (sample.id === "3" && prev.sinHecesTres);
        if (disabled) return false;
        return ["moco", "grasa", "sangre", "restos"].some(field =>
          updated[`heces${sample.id}_${field}`] === "AUSENTE"
        );
      });

      muestrasConfig.forEach((sample, idx) => {
        const disabled =
          (prev.tipoCoproparasitologico && idx > 0) ||
          (sample.id === "3" && prev.sinHecesTres);

        if (disabled) return false;

        ["moco", "grasa", "sangre", "restos"].forEach((field) => {
          updated[`heces${sample.id}_${field}`] = anyAusente ? "" : "AUSENTE";
        });
      });

      return updated;
    });
  };

  const marcarTodoAusenteExm = () => {
    setForm((prev) => {
      const updated = { ...prev };

      const anyAusente = microsConfig.some((sample, idx) => {
        const disabled = (prev.tipoCoproparasitologico && idx > 0) ||
          (sample.id === "3" && prev.sinHecesTres);
        if (disabled) return false;
        return ["leucocitos", "hematies", "parasitos"].some(field =>
          updated[`micro${sample.id}_${field}`] === "NO SE OBSERVAN",
          // updated[`micro${sample.id}_${field}`] === "AUSENTE"
        );
      });

      microsConfig.forEach((sample, idx) => {
        const disabled = (prev.tipoCoproparasitologico && idx > 0) ||
          (sample.id === "3" && prev.sinHecesTres);
        if (disabled) return false;

        ["leucocitos", "hematies"].forEach((field) => {
          updated[`micro${sample.id}_${field}`] = anyAusente ? "" : "NO SE OBSERVAN";
        });

        ["parasitos"].forEach((field) => {
          updated[`micro${sample.id}_${field}`] = anyAusente ? "" : "AUSENTE";
        });
      });

      return updated;
    });
  };


  return (
    <div className="space-y-3 px-4 max-w-[90%] xl:max-w-[80%] mx-auto">
      <AccionesRegistroHeader
        tieneRegistro={form.tieneRegistro}
        hayRegistroCargado={hayRegistroCargado}
        edicionHabilitada={edicionHabilitada}
        onHabilitarEdicion={habilitarEdicion}
        onLimpiar={handleClear}
      />

      {/* Información del Examen */}
      <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="flex gap-x-3 w-full">
          <InputTextOneLine
            label="N° Orden"
            name="norden"
            value={form.norden}
            onChange={handleChangeNumberDecimals}
            onKeyUp={handleSearch}
            disabled={hayRegistroCargado}
            labelWidth="100px"
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

        <div className="grid grid-cols-[auto_1fr] gap-2 items-center">

          <label htmlFor="" className="h-6 align-middle">Muestras: </label>
          <div className="flex flex-col gap-2">
            <InputCheckbox
              label="COPROPARASITOLÓGICO"
              name="tipoCoproparasitologico"
              checked={form.tipoCoproparasitologico}
              onChange={handleCheckBoxChange}
              disabled={camposDeshabilitados}
            />
            <InputCheckbox
              label="2 MUESTRAS"
              name="sinHecesTres"
              checked={form.sinHecesTres}
              onChange={handleCheckBoxChange}
              disabled={camposDeshabilitados}
            />
          </div>
        </div>

      </SectionFieldset>

      <SectionFieldset legend="Datos Personales" collapsible className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
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

      <SectionFieldset legend="Muestras" className="space-y-6">
        <div className="mb-4">
          <button
            type="button"
            onClick={marcarTodoAusenteMuestras}
            disabled={camposDeshabilitados}
            className="bg-blue-500 hover:bg-blue-600 text-white text-base px-4 py-2 rounded
                        flex items-center gap-2 transition-all duration-150 ease-out
                        hover:shadow-lg active:scale-95 active:shadow-inner disabled:opacity-50 disabled:pointer-events-none"
          >
            Marcar todo AUSENTE
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {muestrasConfig.map((sample, idx) => {
            const disabled =
              camposDeshabilitados ||
              (form.tipoCoproparasitologico && idx > 0) ||
              (sample.id === "3" && form.sinHecesTres);

            return (
              <SectionFieldset
                key={sample.id}
                legend={sample.label}
                className="space-y-4"
              >
                {muestraFields.map((field) => (
                  <div key={field.key}>
                    {renderMuestraField(sample.id, field, disabled)}
                  </div>
                ))}
              </SectionFieldset>
            );
          })}
        </div>
      </SectionFieldset>

      <SectionFieldset legend="Examen Microscópico" className="space-y-6">
        <div className="mb-4">
          <button
            type="button"
            onClick={marcarTodoAusenteExm}
            disabled={camposDeshabilitados}
            className="bg-blue-500 hover:bg-blue-600 text-white text-base px-4 py-2 rounded
                        flex items-center gap-2 transition-all duration-150 ease-out
                        hover:shadow-lg active:scale-95 active:shadow-inner disabled:opacity-50 disabled:pointer-events-none"
          >
            Marcar todo NO SE OBSERVAN / AUSENTE
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {microsConfig.map((sample, idx) => {
            const disabled = camposDeshabilitados ||
              (form.tipoCoproparasitologico && idx > 0) ||
              (sample.id === "3" && form.sinHecesTres);
            return (
              <SectionFieldset
                key={sample.id}
                legend={sample.label}
                className="space-y-4"
              >
                {microsFields.map((field) =>
                  renderMicroField(sample.id, field, disabled)
                )}
              </SectionFieldset>
            );
          })}
        </div>
      </SectionFieldset>

      <SectionFieldset legend="Asignar Médico">
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
