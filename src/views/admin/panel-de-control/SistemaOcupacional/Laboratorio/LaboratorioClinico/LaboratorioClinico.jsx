// src/views/admin/panel-de-control/SistemaOcupacional/Laboratorio/LaboratorioClinico/LaboratorioClinico.jsx
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicroscope, faTint, faHeartbeat } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import HematologiaBioquimicaSIEO from './Hematologia-bioquimicaSI-EO/Hematologia-bioquimicaSI-EO';
import ExamenOrina from './ExamenOrina/ExamenOrina';
import Hematologia from './Hematologia/Hematologia';

const LaboratorioClinico = ({token, selectedSede, userlogued}) => {
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();

  const tabs = [
    /*{
      label: 'Hematología - Bioquímica SI-EO',
      icon: faMicroscope,
      component: <HematologiaBioquimicaSIEO token={token} selectedSede={selectedSede} userlogued={userlogued}/>
    },*/
    {
      label: 'Examen de Orina',
      icon: faTint,
      component: <ExamenOrina token={token} selectedSede={selectedSede} userlogued={userlogued}/>
    },
    {
      label: 'Hematología',
      icon: faHeartbeat,
      component: <Hematologia token={token} selectedSede={selectedSede} userlogued={userlogued}/>
    }
  ];

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex space-x-1 overflow-x-auto">
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            onClick={() => setActiveTab(idx)}
            className={`px-6 py-2 border rounded-t-lg transition duration-150 text-base font-semibold focus:outline-none flex items-center whitespace-nowrap ${
              activeTab === idx
                ? 'bg-[#233245] text-white font-bold'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FontAwesomeIcon icon={tab.icon} className="mr-2" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active Content */}
      <div className="border border-gray-200 border-t-0 p-4 bg-white rounded-b-lg text-lg">
        {tabs[activeTab].component}
      </div>
    </div>
  );
};

export default LaboratorioClinico;
