import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeadphones, faFileAlt } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

import { useSessionData } from "../../../../../hooks/useSessionData";
import { getToday } from "../../../../../utils/helpers";
import SectionFieldset from "../../../../../components/reusableComponents/SectionFieldset";
import InputTextOneLine from "../../../../../components/reusableComponents/InputTextOneLine";
import EmpleadoComboBox from "../../../../../components/reusableComponents/EmpleadoComboBox";
import BotonesAccion from "../../../../../components/templates/BotonesAccion";
import DatosPersonalesLaborales from "../../../../../components/templates/DatosPersonalesLaborales";

import AudiometriaOhlaNParte1 from "./AudiometriaOhlaNParte1";
import AudiometriaOhlaNParte2 from "./AudiometriaOhlaNParte2";
import {
  VerifyTR,
  VerifyTRFicha,
  SubmitDataServiceAmbos,
  PrintHojaR,
} from "../AudiometriaOhla/controllerAudiometriaOhla";

const TABLA_OHLA = "audiometria_po";
const TABLA_FICHA = "ficha_audiologica";

export default function AudiometriaOhlaN() {
  const { token, userlogued, selectedSede, userName } = useSessionData();
  const today = getToday();

  const [activeTab, setActiveTab] = useState(0);
  const [dataTabla, setDataTabla] = useState([]);

  const initialFormStateOhla = {
    codAu: "",
    norden: "",
    fecha: today,
    fechaNac: "",
    nombres: "",
    edad: "",
    dni: "",
    empresa: "",
    contrata: "",
    nomExam: "",
    no_paso_Examen: false,
    activar_grafico: true,

    od_500: "",
    od_1000: "",
    od_2000: "",
    od_3000: "",
    od_4000: "",
    od_6000: "",
    od_8000: "",

    oi_500: "",
    oi_1000: "",
    oi_2000: "",
    oi_3000: "",
    oi_4000: "",
    oi_6000: "",
    oi_8000: "",

    od_o_500: "",
    od_o_1000: "",
    od_o_2000: "",
    od_o_3000: "",
    od_o_4000: "",
    od_o_6000: "",
    od_o_8000: "",

    llenar_osea: false,
    oi_o_500: "",
    oi_o_1000: "",
    oi_o_2000: "",
    oi_o_3000: "",
    oi_o_4000: "",
    oi_o_6000: "",
    oi_o_8000: "",

    perdida_global: "",
    asignar_especialista: false,

    nombres_search: "",
    codigo_search: "",
    diagnostico: "",
    diagnosticoCie10: "",
  };

  const initialFormStateFicha = {
    norden: "",
    codFa: "",
    fecha: today,
    nomExam: "",
    noExamen: false,

    nombres: "",
    edad: "",
    bellPlus: false,
    maico: false,

    genero: "",
    aniosTrabajo: "",
    mesesTrabajo: "",

    areaO: "",
    otoscopia: "",

    empresa: "",
    contrata: "",

    marca: "AMPLIVOX",
    modelo: "AMPLIVOX 270",
    calibracion: today,
    tiempoExposicion: "",
    tapones: false,
    orejeras: false,
    apreciacion_ruido: "RUIDO NO MOLESTO",

    consumo_tabaco: "NO",
    servicio_militar: "NO",
    hobbies_ruido: "NO",
    exposicion_quimicos: "NO",
    infeccion_oido: "NO",
    uso_ototoxicos: "NO",

    disminucion_audicion: "NO",
    dolor_oidos: "NO",
    zumbido: "NO",
    mareos: "NO",
    infeccion_oido_actual: "NO",
    otro: "NO",
    otroDescripcion: "",

    conclusiones: "",

    od_250: "",
    od_500: "",
    od_1000: "",

    oi_250: "",
    oi_500: "",
    oi_1000: "",

    d_umbral_discriminacion: "",
    d_porcentaje: "",
    d_umbral_confort: "",
    d_umbral_disconfort: "",

    i_umbral_discriminacion: "",
    i_porcentaje: "",
    i_umbral_confort: "",
    i_umbral_disconfort: "",

    nombre_medico: userName,
    user_medicoFirma: userlogued,

    nombre_doctorAsignado: "",
    user_doctorAsignado: "",

    nombre_doctorExtra: "",
    user_doctorExtra: "",
  };

  const [formOhla, setFormOhla] = useState(initialFormStateOhla);
  const [formFicha, setFormFicha] = useState(initialFormStateFicha);

  const handleClearOhla = () => setFormOhla(initialFormStateOhla);
  const handleClearFicha = () => setFormFicha(initialFormStateFicha);
  const handleClear = () => {
    handleClearOhla();
    handleClearFicha();
  };

  const handleClearnotOOhla = () => {
    setFormOhla((prev) => ({ ...initialFormStateOhla, norden: prev.norden, fecha: prev.fecha }));
  };
  const handleClearnotOFicha = () => {
    setFormFicha((prev) => ({ ...initialFormStateFicha, norden: prev.norden, fecha: prev.fecha }));
  };

  const handleChangeNorden = (e) => {
    const { value } = e.target;
    if (/^\d*$/.test(value)) {
      setFormOhla((f) => ({ ...f, norden: value }));
      setFormFicha((f) => ({ ...f, norden: value }));
    }
  };

  const handleChangeFecha = (e) => {
    const { value } = e.target;
    setFormOhla((f) => ({ ...f, fecha: value }));
    setFormFicha((f) => ({ ...f, fecha: value }));
  };

  const handleSearch = async (e) => {
    if (e.key !== "Enter") return;
    if (!formOhla.norden) {
      await Swal.fire(
        "Error",
        "Debe Introducir un Nro de Historia Clinica válido",
        "error"
      );
      return;
    }
    handleClearnotOOhla();
    handleClearnotOFicha();

    // Se ejecutan en secuencia porque ambas comparten el mismo modal de
    // SweetAlert2 y porque OHLA y Ficha están conectadas: si el paciente ya
    // tiene Audiometría (Normal), se bloquean ambas con una sola alerta
    // (se reutiliza el resultado de VerifyTR).
    const resultado = await VerifyTR(formOhla.norden, TABLA_OHLA, token, setFormOhla, selectedSede);
    await VerifyTRFicha(
      formOhla.norden,
      TABLA_FICHA,
      token,
      setFormFicha,
      selectedSede,
      () => { },
      resultado
    );
  };

  const handleSave = () => {
    SubmitDataServiceAmbos(
      formOhla,
      formFicha,
      token,
      userlogued,
      handleClearOhla,
      handleClearFicha,
      formOhla.activar_grafico,
      formOhla.asignar_especialista
    );
  };

  const handlePrint = () => {
    if (!formOhla.norden) {
      Swal.fire("Error", "Debe colocar un N° Orden", "error");
      return;
    }
    Swal.fire({
      title: "¿Desea Imprimir Audiometría OHLA N?",
      html: `<div style='font-size:1.1em;margin-top:8px;'><b style='color:#5b6ef5;'>N° Orden: ${formOhla.norden}</b></div>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, Imprimir",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        PrintHojaR(
          formOhla.norden,
          token,
          TABLA_OHLA,
          formOhla.activar_grafico,
          formOhla.asignar_especialista
        );
      }
    });
  };

  const tabs = [
    { id: 0, label: "Parte 1", icon: faHeadphones },
    { id: 1, label: "Parte 2", icon: faFileAlt },
  ];

  const handleChangeMedico = (e) => {
    const { name, value } = e.target;
    setFormFicha((f) => ({ ...f, [name]: value }));
  };

  // Adaptador: DatosPersonalesLaborales espera nombres de campo propios del
  // formulario legado de Audiometría, pero formOhla se llena desde dos
  // endpoints distintos que devuelven claves distintas para lo mismo:
  //  - Paciente nuevo (infoPersonalPaciente/busquedaPorFiltros): genero, areaO, cargo
  //  - Registro OHLA existente (obtenerInformacionAudiometriaPo): sexo, areaTrabajo, ocupacion
  // Se soportan ambas variantes con fallback (ver jaspers/Audiometria/Audiometria/Audiometria2021-_Digitalizado.jsx).
  const sexoRaw = formOhla.sexo ?? formOhla.genero ?? "";
  const sexoNormalizado =
    sexoRaw === "M" || sexoRaw === "Masculino" || sexoRaw === "MASCULINO"
      ? "MASCULINO"
      : sexoRaw === "F" || sexoRaw === "Femenino" || sexoRaw === "FEMENINO"
        ? "FEMENINO"
        : sexoRaw;

  const datosPacienteForm = {
    nombres: formOhla.nombres,
    edad: formOhla.edad,
    sexo: sexoNormalizado,
    dni: formOhla.dni,
    fechaNacimiento: formOhla.fechaNac,
    lugarNacimiento: formOhla.lugarNacimiento,
    estadoCivil: formOhla.estadoCivil,
    nivelEstudios: formOhla.nivelEstudio ?? formOhla.nivelEstudios,
    empresa: formOhla.empresa,
    contrata: formOhla.contrata,
    ocupacion: formOhla.ocupacion,
    cargoDesempenar: formOhla.cargo ?? formOhla.ocupacion,
  };

  return (
    <div className="w-full max-w-[95vw] mx-auto space-y-4 px-4 pb-6">

      {/* Encabezado compartido: N° Orden, Fecha y datos del paciente (único) */}
      <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <InputTextOneLine
          label="N° Orden"
          name="norden"
          value={formOhla.norden}
          onChange={handleChangeNorden}
          onKeyUp={handleSearch}
          labelWidth="100px"
        />
        <InputTextOneLine
          label="Fecha"
          name="fecha"
          type="date"
          value={formOhla.fecha}
          onChange={handleChangeFecha}
          labelWidth="100px"
        />
        <InputTextOneLine
          label="Ex. Médico"
          name="nomExam"
          value={formOhla.nomExam}
          disabled
          labelWidth="100px"
        />
      </SectionFieldset>

      <DatosPersonalesLaborales form={datosPacienteForm} />

      {/* Tabs Parte 1 / Parte 2 */}
      <div>
        <div className="flex space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2 border rounded-t-lg transition duration-150 text-base font-semibold focus:outline-none ${activeTab === tab.id
                ? "bg-[#233245] text-white font-bold"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              <FontAwesomeIcon icon={tab.icon} className="mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
        <div className="border border-gray-200 border-t-0 p-4 bg-white rounded-b-lg">
          {activeTab === 0 && (
            <AudiometriaOhlaNParte1
              token={token}
              selectedSede={selectedSede}
              form={formOhla}
              setForm={setFormOhla}
              setFormFicha={setFormFicha}
              handleClearFicha={handleClearFicha}
              handleClear={handleClear}
              dataTabla={dataTabla}
              setDataTabla={setDataTabla}
            />
          )}
          {activeTab === 1 && (
            <AudiometriaOhlaNParte2 form={formFicha} setForm={setFormFicha} />
          )}
        </div>
      </div>

      {/* Asignación de firmas: compartida, fuera de los tabs */}
      <SectionFieldset legend="Asignación de Médico" className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <EmpleadoComboBox
          value={formFicha.nombre_medico}
          label="Profesional que Realiza la Audiometría"
          form={formFicha}
          onChange={handleChangeMedico}
        />
        <EmpleadoComboBox
          value={formFicha.nombre_doctorAsignado}
          label="Doctor Asignado"
          form={formFicha}
          onChange={handleChangeMedico}
          nameField="nombre_doctorAsignado"
          idField="user_doctorAsignado"
        />
        <EmpleadoComboBox
          value={formFicha.nombre_doctorExtra}
          label="Doctor Extra"
          form={formFicha}
          onChange={handleChangeMedico}
          nameField="nombre_doctorExtra"
          idField="user_doctorExtra"
        />
      </SectionFieldset>

      <BotonesAccion
        form={formOhla}
        handleSave={handleSave}
        handleClear={handleClear}
        handlePrint={handlePrint}
        handleChangeNumberDecimals={handleChangeNorden}
      />
    </div>
  );
}
