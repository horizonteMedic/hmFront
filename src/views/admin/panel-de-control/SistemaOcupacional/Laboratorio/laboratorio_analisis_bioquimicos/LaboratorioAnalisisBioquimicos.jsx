// src/views/admin/panel-de-control/SistemaOcupacional/Laboratorio/laboratorio_analisis_bioquimicos/LaboratorioAnalisisBioquimicos.jsx
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlask, faFilter, faTint, faLungs } from '@fortawesome/free-solid-svg-icons';
import AnalisisBioquimicos from './Analisis_bioquimicos/Analisis_bioquimicos';
import BioquimicaAcidoUrico from './BioquimicaAcidoUrico/BioquimicaAcidoUrico';
import PerfilHepatico from './PerfilHepatico/PerfilHepatico';
import PerfilRenal from './PerfilRenal/PerfilRenal';

const LaboratorioAnalisisBioquimicos = ({ token, selectedSede, userlogued, permiso }) => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      label: 'Análisis Bioquímicos',
      icon: faFlask,
      vista: 'Analisis Bioquimico',
      permiso: 'Acceso Analisis Bioquimicos',
      component: <AnalisisBioquimicos />
    },
    {
      label: 'Perfil Renal',
      icon: faFilter,
      vista: 'Analisis Bioquimico',
      permiso: 'Acceso Perfil Renal',
      component: <PerfilRenal />
    },
    {
      label: 'Ácido Úrico',
      icon: faTint,
      vista: 'Analisis Bioquimico',
      permiso: 'Acceso Acido Urico',
      component: <BioquimicaAcidoUrico />
    },
    {
      label: 'Perfil Hepático',
      icon: faLungs,
      vista: 'Analisis Bioquimico',
      permiso: 'Acceso Perfil Hepatico',
      component: <PerfilHepatico />
    }
  ];

    const tabsConPermiso = tabs.filter(tab => permiso(tab.vista, tab.permiso));

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex space-x-1 overflow-x-auto">
        {tabsConPermiso.map((tab, idx) => (
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
