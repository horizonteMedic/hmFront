// src/views/admin/panel-de-control/SistemaOcupacional/Laboratorio/Toxicologia/Toxicologia.jsx
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare, faCube, faLayerGroup, faThLarge } from '@fortawesome/free-solid-svg-icons';
import Resultado_Panel2D from './Panel2D/Resultado_Panel2D';
import Resultado_Panel3D from './Panel3D/Resultado_Panel3D';
import Resultado_Panel5D from './Panel5D/Resultado_Panel5D';
import Resultado_Panel10D from './Panel10D/Resultado_Panel10D';

const Toxicologia = ({token, selectedSede, userlogued}) => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { label: 'Panel 2D', icon: faSquare, component: <Resultado_Panel2D token={token} selectedSede={selectedSede} userlogued={userlogued}/> },
    { label: 'Panel 3D', icon: faCube, component: <Resultado_Panel3D token={token} selectedSede={selectedSede} userlogued={userlogued}/> },
    { label: 'Panel 5D', icon: faLayerGroup, component: <Resultado_Panel5D token={token} selectedSede={selectedSede} userlogued={userlogued}/> },
    { label: 'Panel 10D', icon: faThLarge, component: <Resultado_Panel10D token={token} selectedSede={selectedSede} userlogued={userlogued}/> }
  ];

  return (
    <div className="w-full">
      <div className="flex space-x-1">
        {tabs.map((tab, idx) => (
          <button
            key={tab.label}
            className={`px-6 py-2 border rounded-t-lg transition-all duration-150 text-base font-semibold focus:outline-none ${
              activeTab === idx
                ? 'bg-[#233245] text-white font-bold'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setActiveTab(idx)}
          >
            <FontAwesomeIcon icon={tab.icon} className="mr-2" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="border border-gray-200 border-t-0 p-4 bg-white rounded-b-lg text-lg">
        {tabs[activeTab].component}
      </div>
    </div>
  );
};

export default Toxicologia;
