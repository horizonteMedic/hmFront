// src/views/admin/panel-de-control/SistemaOcupacional/Laboratorio/Inmunologia/Inmunologia_tab.jsx
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMars, faMicroscope, faVirus, faSyringe } from '@fortawesome/free-solid-svg-icons';
import Gonadotropina from './Gonadotropina/Gonadotropina';
import Microbiologia from './Microbiologia/Microbiologia';
import Inmunologia from './Inmunologia/Inmunologia';
import Hepatitis from './Hepatitis/Hepatitis';

const InmunologiaTab = ({token, selectedSede, userlogued}) => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { label: 'L. Gonadotropina', icon: faMars, component: <Gonadotropina token={token} selectedSede={selectedSede} userlogued={userlogued}/> },
    { label: 'Microbiología', icon: faMicroscope, component: <Microbiologia token={token} selectedSede={selectedSede} userlogued={userlogued}/> },
    { label: 'Inmunología', icon: faVirus, component: <Inmunologia  token={token} selectedSede={selectedSede} userlogued={userlogued}/> },
    { label: 'L. Hepatitis', icon: faSyringe, component: <Hepatitis token={token} selectedSede={selectedSede} userlogued={userlogued}/> }
  ];

  return (
    <div className="w-full">
      <div className="flex space-x-1">
        {tabs.map((tab, idx) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(idx)}
            className={`px-6 py-2 border rounded-t-lg transition duration-150 text-base font-semibold focus:outline-none ${
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

      <div className="border border-gray-200 border-t-0 p-4 bg-white rounded-b-lg">
        {tabs[activeTab].component}
      </div>
    </div>
  );
};

export default InmunologiaTab;