// src/views/admin/panel-de-control/SistemaOcupacional/Laboratorio/Inmunologia/Inmunologia_tab.jsx
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMars, faMicroscope, faVirus, faSyringe } from '@fortawesome/free-solid-svg-icons';
import Gonadotropina from './Gonadotropina/Gonadotropina';
import Microbiologia from './Microbiologia/Microbiologia';
import Inmunologia from './Inmunologia/Inmunologia';
import Hepatitis from './Hepatitis/Hepatitis';
import VDRL from './VDRL/VDRL';

const InmunologiaTab = ({token, selectedSede, userlogued, permiso}) => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { label: 'L. Gonadotropina', icon: faMars, vista: 'Inmunologia',
      permiso: 'Acceso L. Gonadotropina',component: <Gonadotropina token={token} selectedSede={selectedSede} userlogued={userlogued}/> },
    { label: 'Microbiología', icon: faMicroscope, vista: 'Inmunologia',
      permiso: 'Acceso Microbiologia', component: <Microbiologia token={token} selectedSede={selectedSede} userlogued={userlogued}/> },
    { label: 'Inmunología', icon: faVirus,vista: 'Inmunologia',
      permiso: 'Acceso Inmunologia', component: <Inmunologia  token={token} selectedSede={selectedSede} userlogued={userlogued}/> },
    { label: 'L. Hepatitis', icon: faSyringe,vista: 'Inmunologia',
      permiso: 'Acceso L. Hepatitis', component: <Hepatitis token={token} selectedSede={selectedSede} userlogued={userlogued}/> },
    { label: 'VDRL', icon: faVirus,vista: 'Inmunologia',
      permiso: 'Acceso VDRL', component: <VDRL token={token} selectedSede={selectedSede} userlogued={userlogued}/> }
  ];
    const tabsConPermiso = tabs.filter(tab => permiso(tab.vista, tab.permiso));

  return (
    <div className="w-full">
      <div className="flex space-x-1">
        {tabsConPermiso.map((tab, idx) => (
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
        {tabsConPermiso[activeTab].component}
      </div>
    </div>
  );
};

export default InmunologiaTab;