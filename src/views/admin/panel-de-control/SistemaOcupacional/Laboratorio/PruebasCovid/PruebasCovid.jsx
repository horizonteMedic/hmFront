// src/views/admin/panel-de-control/SistemaOcupacional/Laboratorio/PruebasCovid/PruebasCovid.jsx
import React, { useState } from 'react';
import PcuanAntigenos from './PcuanAntigenos/PcuanAntigenos';
import PcuanAnticuerpos from './PcuanAnticuerpos/PcuanAnticuerpos';
import PcualAntig from './PcualAntig/PcualAntig';
import ExamenInmunologico from './ExamenInmunologico/ExamenInmunologico';
import PruebasCovidCuantitativo from './ExamenCuantitativo/ExamenCuantitativo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faVirus,
  faDroplet,
  faVial,
  faBiohazard,
  faChartLine
} from '@fortawesome/free-solid-svg-icons';

export default function PruebasCovid({ apiBase, token, selectedSede }) {
  const tabs = [
    {
      id: 'antigenos-cual',
      label: 'P. Cual Antig',
      icon: faVial,
      Component: PcualAntig
    },
    {
      id: 'antigenos',
      label: 'P. Cuan. Antígenos',
      icon: faVirus,
      Component: PcuanAntigenos
    },
    
  ];

  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const ActiveComponent = tabs.find(t => t.id === activeTab).Component;

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex space-x-1">
        {tabs.map(({ id, label, icon }, idx) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center whitespace-nowrap px-6 py-2 border rounded-t-lg transition-all duration-150 text-base font-semibold focus:outline-none ${
              activeTab === id
                ? 'bg-[#233245] text-white font-bold'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FontAwesomeIcon icon={icon} className="mr-2" />
            {label}
          </button>
        ))}
      </div>

      {/* Active Tab Content */}
      <div className="border border-gray-200 border-t-0 p-4 bg-white rounded-b-lg">
        <ActiveComponent
          apiBase={apiBase}
          token={token}
          selectedSede={selectedSede}
        />
      </div>
    </div>
  );
}
