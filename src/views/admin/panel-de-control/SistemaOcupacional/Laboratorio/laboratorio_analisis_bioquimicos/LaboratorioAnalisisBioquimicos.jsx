// src/views/admin/panel-de-control/SistemaOcupacional/Laboratorio/laboratorio_analisis_bioquimicos/LaboratorioAnalisisBioquimicos.jsx
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlask, faFilter, faTint, faLungs } from '@fortawesome/free-solid-svg-icons';
import AnalisisBioquimicos from './Analisis_bioquimicos/Analisis_bioquimicos';
import Bioquimica from './Bioquimica/Bioquimica';
import BioquimicaAcidoUrico from './BioquimicaAcidoUrico/BioquimicaAcidoUrico';
import PerfilHepatico from './PerfilHepatico/PerfilHepatico';

const LaboratorioAnalisisBioquimicos = ({ token, selectedSede, userlogued }) => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      label: 'Análisis Bioquímicos',
      icon: faFlask,
      component: <AnalisisBioquimicos token={token} selectedSede={selectedSede} userlogued={userlogued} />
    },
    {
      label: 'Perfil Renal',
      icon: faFilter,
      component: <Bioquimica token={token} selectedSede={selectedSede} />
    },
    {
      label: 'Ácido Úrico',
      icon: faTint,
      component: <BioquimicaAcidoUrico token={token} selectedSede={selectedSede} />
    },
    {
      label: 'Perfil Hepático',
      icon: faLungs,
      component: <PerfilHepatico token={token} selectedSede={selectedSede} />
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
      <div className="border border-gray-200 border-t-0 p-4 bg-white rounded-b-lg">
        {tabs[activeTab].component}
      </div>
    </div>
  );
};

export default LaboratorioAnalisisBioquimicos;
