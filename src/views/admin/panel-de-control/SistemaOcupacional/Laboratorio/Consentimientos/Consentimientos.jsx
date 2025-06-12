// src/views/admin/panel-de-control/SistemaOcupacional/Laboratorio/Toxicologia/Consentimientos.jsx
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTint, faSquare, faCube, faLayerGroup, faThLarge, faLeaf, faFlask } from '@fortawesome/free-solid-svg-icons';
import { Loading } from '../../../../../components/Loading';
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
    { label: 'Muestra Sangre', icon: faTint,   component: <MuestraDeSangre token={token} selectedSede={selectedSede} userlogued={userlogued} /> },
    { label: 'Panel 2D',       icon: faSquare, component: <Panel2D token={token} selectedSede={selectedSede} userlogued={userlogued} /> },
    { label: 'Panel 3D',       icon: faCube,   component: <Panel3D token={token} selectedSede={selectedSede} userlogued={userlogued} /> },
    { label: 'Panel 5D',       icon: faLayerGroup, component: <Panel5D token={token} selectedSede={selectedSede} userlogued={userlogued} /> },
    { label: 'Panel 10D',      icon: faThLarge, component: <Panel10D token={token} selectedSede={selectedSede} userlogued={userlogued} /> },
    { label: 'Cons. Marihuana',icon: faLeaf,   component: <ConsMarihuana token={token} selectedSede={selectedSede} userlogued={userlogued} /> },
    { label: 'BORO',           icon: faFlask,  component: <Boro token={token} selectedSede={selectedSede} userlogued={userlogued} /> },
  ];

  if (loading) return <Loading />;

  return (
    <div className="w-full">
      <div className="flex space-x-2 overflow-x-auto">
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            onClick={() => setActiveTab(idx)}
            className={`px-6 py-2 border rounded-t-lg transition-all duration-150 text-base font-semibold focus:outline-none ${
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

export default Consentimientos;
