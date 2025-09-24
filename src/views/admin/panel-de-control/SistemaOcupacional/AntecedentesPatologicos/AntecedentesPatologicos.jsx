/* eslint-disable react/prop-types */
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faStethoscope } from "@fortawesome/free-solid-svg-icons";
import Normal from "./Normal/Normal";
import Boro from "./Boro/Boro";

// Componente padre que maneja los tabs de Antecedentes Patológicos
export default function AntecedentesPatologicos({
  form,
  handleSiNoChange,
}) {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      id: 0,
      name: "Normal",
      icon: faUser,
      component: Normal,
    },
    {
      id: 1,
      name: "Boro",
      icon: faStethoscope,
      component: Boro,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <nav className="flex bg-white border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`flex-1 px-4 py-3 uppercase tracking-wider border-b-4 transition-colors duration-200 cursor-pointer hover:bg-gray-100 ${
              activeTab === tab.id
                ? "border-[#233245] font-semibold"
                : "border-transparent"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            <FontAwesomeIcon icon={tab.icon} className="mr-2" />
            {tab.name}
          </button>
        ))}
      </nav>

      {/* Tab Content */}
      <div className="max-w-full">
        {tabs.map((tab) => {
          const Component = tab.component;
          return (
            activeTab === tab.id && (
              <Component
                key={tab.id}
                form={form}
                handleSiNoChange={handleSiNoChange}
              />
            )
          );
        })}
      </div>
    </div>
  );
}
