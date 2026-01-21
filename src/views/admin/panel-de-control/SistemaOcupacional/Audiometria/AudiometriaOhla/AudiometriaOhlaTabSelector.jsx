import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeadphones, faFileAlt } from "@fortawesome/free-solid-svg-icons";
import AudiometriaOhla from "./AudiometriaOhla";
import AudiometriaFichaAudiologica from "./AudiometriaFichaAudiologica";
import { useSessionData } from "../../../../../hooks/useSessionData";

const AudiometriaOhlaTabSelector = ({
  listas,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const { token, userlogued, selectedSede, datosFooter, userName } = useSessionData();
  const date = new Date();
  const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;

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

    //derecha
    nombres_search: "",
    codigo_search: "",
    diagnostico: "",

    // Médico que Certifica //BUSCADOR
    nombre_medico: userName,
    user_medicoFirma: userlogued,

    nombre_doctorAsignado: "",
    user_doctorAsignado: "",

    nombre_doctorExtra: "",
    user_doctorExtra: "",
  };
  const [formOhla, setFormOhla] = useState(initialFormStateOhla);

  const handleClearOhla = () => {
    setFormOhla(initialFormStateOhla);
  };

  const handleClearnotOOhla = () => {
    setFormOhla((prev) => ({ ...initialFormStateOhla, norden: prev.norden }));
  };

  //FICHA AUDIOLOGICA
  //============================================
  const initialFormStateFicha = {
    norden: "",
    codFa: "",
    fecha: today,
    nomExam: "",
    noExamen: false,

    nombres: "",
    edad: "",
    bellPlus: false,

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
    // h_d: false,
    // min_d: false,
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

    nombre_profecional: fixEncodingModern(
      userlogued?.datos?.nombres_user || ""
    ),
    conclusiones: "",
    nombre_medico: "",

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

    // Médico que Certifica //BUSCADOR
    nombre_medico: userName,
    user_medicoFirma: userlogued,

    nombre_doctorAsignado: "",
    user_doctorAsignado: "",

    nombre_doctorExtra: "",
    user_doctorExtra: "",
  };

  const [formFicha, setFormFicha] = useState(initialFormStateFicha);

  const [searchNombreMedico, setSearchNombreMedico] = useState(
    formFicha.nombre_medico
  );
  const [filteredNombresMedicos, setFilteredNombresMedicos] = useState([]);

  const handleClearFicha = () => {
    setFormFicha(initialFormStateFicha);
    setSearchNombreMedico("");
  };

  const handleClearnotOFicha = () => {
    setFormFicha((prev) => ({ ...initialFormStateFicha, norden: prev.norden }));
    setSearchNombreMedico("");
  };

  function fixEncodingModern(str) {
    const bytes = new Uint8Array([...str].map((c) => c.charCodeAt(0)));
    return new TextDecoder("utf-8").decode(bytes);
  }

  const tabs = [
    {
      label: "Audiometría Ohla",
      icon: faHeadphones,
      component: (
        <AudiometriaOhla
          token={token}
          selectedSede={selectedSede}
          userlogued={userlogued.sub}
          form={formOhla}
          setForm={setFormOhla}
          handleClear={handleClearOhla}
          handleClearnotO={handleClearnotOOhla}

          handleClearnotOFicha={handleClearnotOFicha}
          tablaFicha={"ficha_audiologica"}
          setFormFicha={setFormFicha}
          setSearchNombreMedico={setSearchNombreMedico}
          handleClearFicha={handleClearFicha}
        />
      ),
    },
    {
      label: "Ficha Audiológica",
      icon: faFileAlt,
      component: (
        <AudiometriaFichaAudiologica
          token={token}
          selectedSede={selectedSede}
          userloguedCompleto={userlogued}
          listas={listas}
          form={formFicha}
          setForm={setFormFicha}
          searchNombreMedico={searchNombreMedico}
          setSearchNombreMedico={setSearchNombreMedico}
          filteredNombresMedicos={filteredNombresMedicos}
          setFilteredNombresMedicos={setFilteredNombresMedicos}
          handleClear={handleClearFicha}
          handleClearnotO={handleClearnotOFicha}
          handleClearOhla={handleClearOhla}
          formOhla={formOhla}
        />
      ),
    },
  ];

  return (
    <div className="w-full px-4">
      <div className="flex space-x-1">
        {tabs.map((tab, idx) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(idx)}
            className={`px-6 py-2 border rounded-t-lg transition duration-150 text-base font-semibold focus:outline-none ${activeTab === idx
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
        {tabs[activeTab].component}
      </div>
    </div>
  );
};

export default AudiometriaOhlaTabSelector;