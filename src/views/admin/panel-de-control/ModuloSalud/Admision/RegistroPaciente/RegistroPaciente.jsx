import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck, faSearch, faX, faSignature,
  faFingerprint, faBroom, faUpload,
} from "@fortawesome/free-solid-svg-icons";

import { useSessionData } from "../../../../../hooks/useSessionData";
import { useForm } from "../../../../../hooks/useForm";
import SectionFieldset from "../../../../../components/reusableComponents/SectionFieldset";
import InputTextOneLine from "../../../../../components/reusableComponents/InputTextOneLine";
import { getFetch } from "../../../../../utils/apiHelpers";
import { SearchPacienteDNI, SubmitRegistro } from "./controllerRegistroPaciente";
import { SelectField } from "../../../../../components/reusableComponents/InputSelect";
import InputsRadioGroup from "../../../../../components/reusableComponents/InputsRadioGroup";

// ── Opciones fijas ────────────────────────────────────────────────────────────
const SEXO_OPTIONS = [{ label: "MASCULINO", value: "M" }, { label: "FEMENINO", value: "F" }];

// ── Estado inicial ────────────────────────────────────────────────────────────
const initialFormState = {
  TipoDoc: "1",
  origen: "",
  dni: "",
  nombres: "",
  apellidos: "",
  fechaNacimiento: "",
  sexo: "",
  caserio: "",
};

export default function RegistroPaciente({ onRegistrado }) {
  const { token, userlogued, selectedSede } = useSessionData();
  const dniRef = useRef(null);

  const { form, setForm, handleChange, handleChangeSimple, handleRadioButton } = useForm(initialFormState);

  // ── Helpers de fecha ──────────────────────────────────────────────────────
  const handleFecha = (e) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 8);
    let formatted = raw;
    if (raw.length >= 5) formatted = raw.replace(/(\d{2})(\d{2})(\d{0,4})/, "$1-$2-$3");
    else if (raw.length >= 3) formatted = raw.replace(/(\d{2})(\d{0,2})/, "$1-$2");
    setForm((f) => ({ ...f, fechaNacimiento: formatted }));
  };

  const handleOnlyDigits = (name) => (e) => {
    const val = e.target.value.replace(/\D/g, "");
    setForm((f) => ({ ...f, [name]: val }));
  };

  // ── Limpiar todo ──────────────────────────────────────────────────────────

  const handleLimpiar = (keepDNI = false) => {
    setForm({ ...initialFormState, dni: keepDNI ? form.dni : "", TipoDoc: form.TipoDoc });
    setTimeout(() => dniRef.current?.focus(), 0);
  };

  // ── Búsqueda ──────────────────────────────────────────────────────────────
  const handleSearch = async (e) => {
    if (e.key === "Enter") {
      handleLimpiar(true)
      try {
        SearchPacienteDNI(form.dni, form.TipoDoc, token, handleLimpiar, setForm);
      } catch {
        Swal.fire("Error", "Ha ocurrido un error", "error");
      }
    }
  };

  // ── Guardar ───────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    const requeridos = [
      "nombres", "apellidos", "fechaNacimiento", "sexo",
      "caserio"
    ];
    const vacios = requeridos.filter((c) => !form[c]);
    if (vacios.length > 0)
      return Swal.fire("Error", `Faltan completar: ${vacios.join(", ")}`, "error");

    const r = await SubmitRegistro(form, token, userlogued, handleLimpiar);
    console.log(r)
    if (!r?.pacienteId) {
      Swal.fire("Error", "No se pudo registrar", "error");
    } else {
      await Swal.fire("Registrado", "Paciente registrado correctamente", "success");
      onRegistrado?.({
        pacienteId: r.pacienteId,
        dni: form.dni,
        nombres: `${form.nombres} ${form.apellidos}`.trim(),
      });
      handleLimpiar();
    }

  };

  return (
    <div className="space-y-3 px-4 max-w-[90%] xl:max-w-[80%] mx-auto">

      {/* ── Búsqueda ─────────────────────────────────────────────────── */}
      <SectionFieldset legend="Búsqueda de Paciente">
        <div className="flex items-start gap-3">
          <div className="flex-1 flex flex-col gap-2">
            <InputTextOneLine
              label="DNI / LM"
              name="dni"
              value={form.dni}
              onChange={handleOnlyDigits("dni")}
              onKeyUp={handleSearch}
              labelWidth="130px"
              inputRef={dniRef}
              autocomplete="off"
            />
            <InputsRadioGroup
              name="TipoDoc"
              value={form.TipoDoc}
              onChange={handleRadioButton}
              label="Tipo Doc."
              labelWidth="130px"
              options={[
                { label: "DNI", value: "1" },
                { label: "Sin DNI", value: "4" },
                { label: "Pasaporte", value: "3" },
              ]}
            />
          </div>
          <button
            type="button"
            onClick={handleSearch}
            className="azul-btn px-4 py-2 rounded flex items-center gap-2 whitespace-nowrap"
          >
            <FontAwesomeIcon icon={faSearch} /> Buscar
          </button>
        </div>
      </SectionFieldset>

      {/* ── Datos Personales ──────────────────────────────────────────── */}
      <SectionFieldset legend="Datos Personales" className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-3">
        <InputTextOneLine
          label="Nombres"
          name="nombres"
          value={form.nombres}
          onChange={handleChange}
          labelWidth="130px"
        />
        <InputTextOneLine
          label="Apellidos"
          name="apellidos"
          value={form.apellidos}
          onChange={handleChange}
          labelWidth="130px"
        />
        <div>
          <InputTextOneLine
            label="Fecha Nac."
            name="fechaNacimiento"
            value={form.fechaNacimiento}
            onChange={handleFecha}
            placeholder="DD-MM-AAAA"
            labelWidth="130px"
          />
          <p className="text-xs text-gray-400 mt-1 ml-[138px]">Formato: Día-Mes-Año</p>
        </div>
        <SelectField
          label="Sexo"
          name="sexo"
          value={form.sexo}
          onChange={handleChangeSimple}
          options={SEXO_OPTIONS}
          labelWidth="130px"
          inline={true}
        />
      </SectionFieldset>

      {/* ── Dirección ─────────────────────────────────────────────────── */}
      <SectionFieldset legend="Dirección" className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-3">
        <InputTextOneLine
          label="Caserío"
          name="caserio"
          value={form.caserio}
          onChange={handleChange}
          labelWidth="130px"
        />
      </SectionFieldset>

      {/* ── Firma, Huella y Acciones ──────────────────────────────────── */}
      <SectionFieldset legend="OPCIONES">
        <div className="flex flex-wrap justify-center gap-4">
          <div className="flex flex-col items-center gap-1">
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faCheck} /> Registrar
            </button>
          </div>

          <div className="flex flex-col items-center gap-1">
            <button
              type="button"
              onClick={() => handleLimpiar()}
              className="px-6 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faBroom} /> Limpiar
            </button>
          </div>
        </div>
      </SectionFieldset>

    </div>
  );
}
