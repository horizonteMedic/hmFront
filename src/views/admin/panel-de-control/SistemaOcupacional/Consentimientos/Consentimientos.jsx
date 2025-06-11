import React, { useState } from 'react';
import { Loading } from '../../../../components/Loading';
import Panel10D from './Panel10D/Panel10D';
import Panel5D from './Panel5D/Panel5D';
import Panel3D from './Panel3D/Panel3D';
import Panel2D from './Panel2D/Panel2D';
import MuestraDeSangre from './MuestraDeSangre/MuestraDeSangre';
import ConsMarihuana from './ConsMarihuana/ConsMarihuana';
import Boro from './Boro/Boro';

const Consentimientos = ({ token, selectedSede, userlogued }) => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { label: 'Panel 10D', component: <Panel10D token={token} selectedSede={selectedSede} userlogued={userlogued} /> },
    { label: 'Panel 5D', component: <Panel5D token={token} selectedSede={selectedSede} userlogued={userlogued} /> },
    { label: 'Panel 3D', component: <Panel3D token={token} selectedSede={selectedSede} userlogued={userlogued} /> },
    { label: 'Panel 2D', component: <Panel2D token={token} selectedSede={selectedSede} userlogued={userlogued} /> },
    { label: 'MUESTRA DE SANGRE', component: <MuestraDeSangre token={token} selectedSede={selectedSede} userlogued={userlogued} /> },
    { label: 'CONS. MARIHUANA', component: <ConsMarihuana token={token} selectedSede={selectedSede} userlogued={userlogued} /> },
    { label: 'BORO', component: <Boro token={token} selectedSede={selectedSede} userlogued={userlogued} /> },
  ];

  const handleBack = () => {
    window.location.assign('/SistemaOcupacional');
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-end gap-4 mb-2">
        <button
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-4 py-2 rounded shadow border border-gray-300"
          onClick={handleBack}
        >
          ← Atrás
        </button>
      </div>
      {loading ? (
        <Loading />
      ) : (
        <div>
          <div className="flex space-x-2">
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
      )}
    </div>
  );
};

export default Consentimientos; 