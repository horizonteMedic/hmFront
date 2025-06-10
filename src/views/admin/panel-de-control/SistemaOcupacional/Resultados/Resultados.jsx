import React, { useState } from 'react';
import Panel3D from './Panel3D/Panel3D';
import Panel5D from './Panel5D/Panel5D';
import Panel10D from './Panel10D/Panel10D';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicroscope } from '@fortawesome/free-solid-svg-icons';

const Resultados = ({ token, selectedSede }) => {
  const [activeTab, setActiveTab] = useState(1);

  const changeTab = (tabIndex) => setActiveTab(tabIndex);

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row mb-4">
        <div
          className={`cursor-pointer flex items-center py-2 px-4 sm:px-6 ${activeTab === 1 ? 'bg-[#215086] text-white font-bold' : 'bg-[#edf0f7] text-gray-800'} rounded-tl-lg rounded-tr-lg mb-2 sm:mb-0 sm:mr-2`}
          onClick={() => changeTab(1)}
        >
          <FontAwesomeIcon icon={faMicroscope} className="mr-2" />
          Panel X3D
        </div>
        <div
          className={`cursor-pointer flex items-center py-2 px-4 sm:px-6 ${activeTab === 2 ? 'bg-[#215086] text-white font-bold' : 'bg-[#edf0f7] text-gray-800'} rounded-tl-lg rounded-tr-lg mb-2 sm:mb-0 sm:mr-2`}
          onClick={() => changeTab(2)}
        >
          <FontAwesomeIcon icon={faMicroscope} className="mr-2" />
          Panel X5D
        </div>
        <div
          className={`cursor-pointer flex items-center py-2 px-4 sm:px-6 ${activeTab === 3 ? 'bg-[#215086] text-white font-bold' : 'bg-[#edf0f7] text-gray-800'} rounded-tl-lg rounded-tr-lg mb-2 sm:mb-0 sm:mr-2`}
          onClick={() => changeTab(3)}
        >
          <FontAwesomeIcon icon={faMicroscope} className="mr-2" />
          Panel X10D
        </div>
      </div>

      <div className="custom-border p-4">
        {activeTab === 1 && <Panel3D token={token} selectedSede={selectedSede} />}
        {activeTab === 2 && <Panel5D token={token} selectedSede={selectedSede} />}
        {activeTab === 3 && <Panel10D token={token} selectedSede={selectedSede} />}
      </div>
    </div>
  );
};

export default Resultados; 