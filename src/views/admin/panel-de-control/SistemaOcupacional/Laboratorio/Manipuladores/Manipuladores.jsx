// src/views/admin/panel-de-control/SistemaOcupacional/Laboratorio/Manipuladores/Manipuladores.jsx
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVial, faBug } from '@fortawesome/free-solid-svg-icons';
import Coproparasitologia from './Coproparasitologia/Coproparasitologia';
import Coprocultivo from './Coprocultivo/Coprocultivo';
import { useSessionData } from '../../../../../hooks/useSessionData';

const Manipuladores = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { token, selectedSede, userlogued } = useSessionData();

  const tabs = [
    { label: 'Coprocultivo', icon: faVial, component: <Coprocultivo /> },
    { label: 'Parasitología', icon: faBug, component: <Coproparasitologia /> },
  ];

  return (
    <div className="w-full">
      <div className="flex space-x-1">
        {tabs.map((tab, idx) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(idx)}
            className={`px-6 py-2 border rounded-t-lg transition duration-150 text-base font-semibold focus:outline-none ${activeTab === idx
                ? 'bg-[#233245] text-white font-bold'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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

export default Manipuladores;
