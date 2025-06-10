import React, { useState } from 'react';
import HematologiaBioquimicaSIEO from './Hematologia-bioquimicaSI-EO/Hematologia-bioquimicaSI-EO';
import ExamenOrina from './ExamenOrina/ExamenOrina';
import ExamenInmonulogico from './ExamenInmonulogico/ExamenInmonulogico';

const LaboratorioClinico = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { label: 'Hematología - Bioquímica SI-EO', component: <HematologiaBioquimicaSIEO /> },
    { label: 'Examen de Orina', component: <ExamenOrina /> },
    { label: 'Examen Inmunológico', component: <ExamenInmonulogico /> },
  ];

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-[#233245] mb-4">Laboratorio Clínico</h2>
      <div className="flex space-x-1">
        {tabs.map((tab, idx) => (
          <button
            key={tab.label}
            className={`px-6 py-2 border rounded-t-lg transition-all duration-150 text-base font-semibold focus:outline-none ${activeTab === idx ? 'bg-[#233245] text-white font-bold' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setActiveTab(idx)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="border-t-0 border border-gray-200 p-4 bg-white rounded-b-lg text-lg">
        {tabs[activeTab].component}
      </div>
    </div>
  );
};

export default LaboratorioClinico;

