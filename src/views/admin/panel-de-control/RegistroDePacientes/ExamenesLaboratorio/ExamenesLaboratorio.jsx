import React, { useState } from 'react';
import Microbiologia from './Microbiologia/Microbiologia';
import Inmunologia from './Inmunologia/Inmunologia';
import Parasitologia from './Parasitologia/Parasitologia';
import BioquimicaAcidoUrico from './BioquimicaAcidoUrico/BioquimicaAcidoUrico';
import Coprocultivo from './Coprocultivo/Coprocultivo';
import Anexo16A from './Anexo16A/Anexo16A';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBacteria, faVial, faBug } from '@fortawesome/free-solid-svg-icons';

const ExamenesLaboratorio = ({ token, selectedSede }) => {
  const [activeTab, setActiveTab] = useState(1);

  const changeTab = (tabIndex) => setActiveTab(tabIndex);

  return (
    <div className="w-full">
        <div className="flex gap-x-2">
          <button
            className={`px-6 py-2 border rounded-t-lg transition-all duration-150 text-base font-semibold focus:outline-none flex items-center ${activeTab === 1 ? 'bg-[#215086] text-white font-bold' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => changeTab(1)}
          >
            <FontAwesomeIcon icon={faBacteria} className="mr-2" />
            Microbiología
          </button>
          <button
            className={`px-6 py-2 border rounded-t-lg transition-all duration-150 text-base font-semibold focus:outline-none flex items-center ${activeTab === 2 ? 'bg-[#215086] text-white font-bold' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => changeTab(2)}
          >
            <FontAwesomeIcon icon={faVial} className="mr-2" />
            Inmunología
          </button>
          <button
            className={`px-6 py-2 border rounded-t-lg transition-all duration-150 text-base font-semibold focus:outline-none flex items-center ${activeTab === 3 ? 'bg-[#215086] text-white font-bold' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => changeTab(3)}
          >
            <FontAwesomeIcon icon={faBug} className="mr-2" />
            Parasitología
          </button>
          <button
            className={`px-6 py-2 border rounded-t-lg transition-all duration-150 text-base font-semibold focus:outline-none flex items-center ${activeTab === 4 ? 'bg-[#215086] text-white font-bold' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => changeTab(4)}
          >
            Bioquímica Ácido Úrico
          </button>
          <button
            className={`px-6 py-2 border rounded-t-lg transition-all duration-150 text-base font-semibold focus:outline-none flex items-center ${activeTab === 5 ? 'bg-[#215086] text-white font-bold' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => changeTab(5)}
          >
            Coprocultivo
          </button>
          <button
            className={`px-6 py-2 border rounded-t-lg transition-all duration-150 text-base font-semibold focus:outline-none flex items-center ${activeTab === 6 ? 'bg-[#215086] text-white font-bold' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => changeTab(6)}
          >
            Anexo 16 A
          </button>
        </div>
        <div className="custom-border p-4 pt-2">
          {activeTab === 1 && <Microbiologia token={token} selectedSede={selectedSede} />}
          {activeTab === 2 && <Inmunologia token={token} selectedSede={selectedSede} />}
          {activeTab === 3 && <Parasitologia token={token} selectedSede={selectedSede} />}
          {activeTab === 4 && <BioquimicaAcidoUrico token={token} selectedSede={selectedSede} />}
          {activeTab === 5 && <Coprocultivo token={token} selectedSede={selectedSede} />}
          {activeTab === 6 && <Anexo16A token={token} selectedSede={selectedSede} />}
        </div>
    </div>
  );
};

export default ExamenesLaboratorio; 