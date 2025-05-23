import React, { useState } from 'react';
import Microbiologia from './Microbiologia/Microbiologia';
import Inmunologia from './Inmunologia/Inmunologia';
import Parasitologia from './Parasitologia/Parasitologia';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBacteria, faVial, faBug } from '@fortawesome/free-solid-svg-icons';

const ExamenesLaboratorio = ({ token, selectedSede }) => {
  const [activeTab, setActiveTab] = useState(1);

  const changeTab = (tabIndex) => setActiveTab(tabIndex);

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row mb-1">
        <div
          className={`cursor-pointer flex items-center py-2 px-4 sm:px-6 ${activeTab === 1 ? 'bg-[#215086] text-white font-bold' : 'bg-[#edf0f7] text-gray-800'} rounded-tl-lg rounded-tr-lg mb-2 sm:mb-0 sm:mr-2`}
          onClick={() => changeTab(1)}
        >
          <FontAwesomeIcon icon={faBacteria} className="mr-2" />
          MICROBIOLOGIA
        </div>
        <div
          className={`cursor-pointer flex items-center py-2 px-4 sm:px-6 ${activeTab === 2 ? 'bg-[#215086] text-white font-bold' : 'bg-[#edf0f7] text-gray-800'} rounded-tl-lg rounded-tr-lg mb-2 sm:mb-0 sm:mr-2`}
          onClick={() => changeTab(2)}
        >
          <FontAwesomeIcon icon={faVial} className="mr-2" />
          INMUNOLOGIA
        </div>
        <div
          className={`cursor-pointer flex items-center py-2 px-4 sm:px-6 ${activeTab === 3 ? 'bg-[#215086] text-white font-bold' : 'bg-[#edf0f7] text-gray-800'} rounded-tl-lg rounded-tr-lg mb-2 sm:mb-0 sm:mr-2`}
          onClick={() => changeTab(3)}
        >
          <FontAwesomeIcon icon={faBug} className="mr-2" />
          PARASITOLOGIA
        </div>
      </div>
      <div className="custom-border p-4 pt-2">
        {activeTab === 1 && <Microbiologia token={token} selectedSede={selectedSede} />}
        {activeTab === 2 && <Inmunologia token={token} selectedSede={selectedSede} />}
        {activeTab === 3 && <Parasitologia token={token} selectedSede={selectedSede} />}
      </div>
    </div>
  );
};

export default ExamenesLaboratorio; 