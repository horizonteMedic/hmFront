
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeadphones, faFileAlt, } from '@fortawesome/free-solid-svg-icons';
import AudiometriaOhla from './AudiometriaOhla';
import AudiometriaFichaAudiologica from './AudiometriaFichaAudiologica';

const AudiometriaOhlaTabSelector = ({ token, selectedSede, userlogued }) => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { label: 'Audiometría Ohla', icon: faHeadphones, component: <AudiometriaOhla token={token} selectedSede={selectedSede} userlogued={userlogued.sub} /> },
    { label: 'Ficha Audiológica', icon: faFileAlt, component: <AudiometriaFichaAudiologica token={token} selectedSede={selectedSede} userloguedCompleto={userlogued}/> },
   ];

  return (
    <div className="w-full px-4">
      <div className="flex space-x-1">
        {tabs.map((tab, idx) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(idx)}
            className={`px-6 py-2 border rounded-t-lg transition duration-150 text-base font-semibold focus:outline-none ${
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

export default AudiometriaOhlaTabSelector;
