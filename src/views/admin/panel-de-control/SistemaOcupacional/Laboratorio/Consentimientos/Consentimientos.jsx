// src/views/admin/panel-de-control/SistemaOcupacional/Laboratorio/Toxicologia/Consentimientos.jsx
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTint, faSquare, faCube, faLayerGroup, faThLarge, faLeaf, faFlask, faPrint } from '@fortawesome/free-solid-svg-icons';
import { Loading } from '../../../../../components/Loading';
import Panel10D from './Panel10D/Panel10D';
import Panel5D from './Panel5D/Panel5D';
// import Panel4D from './Panel4D/Panel4D';
import Panel3D from './Panel3D/Panel3D';
import Panel2D from './Panel2D/Panel2D';
import MuestraDeSangre from './MuestraDeSangre/MuestraDeSangre';
import ConsMarihuana from './ConsMarihuana/ConsMarihuana';
import Boro from './Boro/Boro';
import { PrintHojaRMasivo } from './Controller/ControllerC';

const Consentimientos = ({ token, selectedSede, userlogued, permiso }) => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [norden, setNorden] = useState('')
  const tabs = [
    { label: 'Muestra Sangre', icon: faTint,vista: 'Consentimientos',
      permiso: 'Acceso Cons - Muestra Sangre',   component: <MuestraDeSangre token={token} selectedSede={selectedSede} userlogued={userlogued} /> },
    { label: 'Panel 2D',       icon: faSquare,vista: 'Consentimientos',
      permiso: 'Acceso Cons - Panel 2D', component: <Panel2D token={token} selectedSede={selectedSede} userlogued={userlogued} /> },
    { label: 'Panel 3D',       icon: faCube,vista: 'Consentimientos',
      permiso: 'Acceso Cons - Panel 3D',   component: <Panel3D token={token} selectedSede={selectedSede} userlogued={userlogued} /> },
    // { label: 'Panel 4D',       icon: faThLarge,vista: 'Consentimientos',
    //   permiso: 'Acceso Cons - Panel 4D',   component: <Panel4D token={token} selectedSede={selectedSede} userlogued={userlogued} /> },
    { label: 'Panel 5D',       icon: faLayerGroup,vista: 'Consentimientos',
      permiso: 'Acceso Cons - Panel 5D', component: <Panel5D token={token} selectedSede={selectedSede} userlogued={userlogued} /> },
    { label: 'Panel 10D',      icon: faLayerGroup,vista: 'Consentimientos',
      permiso: 'Acceso Cons - Panel 10D', component: <Panel10D token={token} selectedSede={selectedSede} userlogued={userlogued} /> },
    { label: 'Cons. Marihuana',icon: faLeaf,vista: 'Consentimientos',
      permiso: 'Acceso Cons - Cons. Marihuana',   component: <ConsMarihuana token={token} selectedSede={selectedSede} userlogued={userlogued} /> },
    { label: 'BORO',           icon: faFlask,vista: 'Consentimientos',
      permiso: 'Acceso Cons - BORO',  component: <Boro token={token} selectedSede={selectedSede} userlogued={userlogued} /> },
  ];
    const tabsConPermiso = tabs.filter(tab => permiso(tab.vista, tab.permiso));

  if (loading) return <Loading />;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center overflow-x-auto">
        {/* Sección izquierda: tabs */}
        <div className="flex space-x-2">
          {tabsConPermiso.map((tab, idx) => (
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
       <div className="flex items-center space-x-2 pr-2">
        <span className="font-semibold text-blue-900 text-lg">IMPRIMIR MASIVO</span>
        <input
          className="border rounded px-3 py-2 w-32 text-base"
          value={norden}
          onChange={(e) => {setNorden(e.target.value)}}
          name="norden"
        />
        <button
          type="button"
          onClick={() => {PrintHojaRMasivo(norden,token)}}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded border border-green-700 flex items-center shadow-md transition-colors"
        >
          <FontAwesomeIcon icon={faPrint} />
        </button>
      </div>
      </div>
      <div className="border border-gray-200 border-t-0 p-4 bg-white rounded-b-lg">
        {tabs[activeTab].component}
      </div>
    </div>
  );
};

export default Consentimientos;
