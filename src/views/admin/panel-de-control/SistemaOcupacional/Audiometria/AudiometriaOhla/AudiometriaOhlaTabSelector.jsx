import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeadphones, faFileAlt } from "@fortawesome/free-solid-svg-icons";
import AudiometriaOhla from "./AudiometriaOhla";
import AudiometriaFichaAudiologica from "./AudiometriaFichaAudiologica";

const AudiometriaOhlaTabSelector = ({
  token,
  selectedSede,
  userlogued,
  listas,
}) => {
  const [activeTab, setActiveTab] = useState(0);

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
    activar_grafico: false,

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
  };
  const [formOhla, setFormOhla] = useState(initialFormStateOhla);

  const handleClearOhla = () => {
    setFormOhla(initialFormStateOhla);
  };

  const handleClearnotOOhla = () => {
    setFormOhla((prev) => ({ ...initialFormStateOhla, norden: prev.norden }));
  };

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
            className={`px-6 py-2 border rounded-t-lg transition duration-150 text-base font-semibold focus:outline-none ${
              activeTab === idx
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
