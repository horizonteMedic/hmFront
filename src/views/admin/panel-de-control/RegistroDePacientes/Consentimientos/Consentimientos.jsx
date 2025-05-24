import React, { useState } from 'react';
import { Loading } from '../../../../components/Loading';
import Panel10D from './Panel10D/Panel10D';
import Panel5D from './Panel5D/Panel5D';
import Panel3D from './Panel3D/Panel3D';
import Panel2D from './Panel2D/Panel2D';
import MuestraDeSangre from './MuestraDeSangre/MuestraDeSangre';
import ConsMarihuana from './ConsMarihuana/ConsMarihuana';
import Boro from './Boro/Boro';

const tabs = [
  { label: 'Panel 10D', component: <Panel10D /> },
  { label: 'Panel 5D', component: <Panel5D /> },
  { label: 'Panel 3D', component: <Panel3D /> },
  { label: 'Panel 2D', component: <Panel2D /> },
  { label: 'MUESTRA DE SANGRE', component: <MuestraDeSangre /> },
  { label: 'CONS. MARIHUANA', component: <ConsMarihuana /> },
  { label: 'BORO', component: <Boro /> },
];

const Consentimientos = ({ token, selectedSede }) => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="w-full">
      {loading ? (
        <Loading />
      ) : (
        <div className="p-4">
          <h2 className="text-3xl font-extrabold mb-6">Gestión de Consentimientos</h2>
          <div className="flex space-x-2 mb-1">
            {tabs.map((tab, idx) => (
              <button
                key={tab.label}
                className={`px-6 py-2 border rounded-t-lg transition-all duration-150 text-base font-semibold focus:outline-none ${activeTab === idx ? 'bg-white font-bold border-b-0 text-blue-900 shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                onClick={() => setActiveTab(idx)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="border-t-0 border border-gray-200 p-8 bg-white rounded-b-lg text-lg">
            {tabs[activeTab].component}
          </div>
        </div>
      )}
    </div>
  );
};

export default Consentimientos; 