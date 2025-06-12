import React, { useState } from 'react';
import BioquimicaAcidoUrico from '../laboratorio_analisis_bioquimicos/BioquimicaAcidoUrico/BioquimicaAcidoUrico';
import Coprocultivo from '../Manipuladores/Coprocultivo/Coprocultivo';
import Anexo16A from './Anexo16A/Anexo16A';
import Altura from './Altura/Altura';
import Anexo16ATestAlturaPsicosensometrico from './Anexo16ATestAlturaPsicosensometrico/Anexo16ATestAlturaPsicosensometrico';
import HemogramaAutomatizado from './HemogramaAutomatizado/HemogramaAutomatizado';
import Psicosensometria from './Psicosensometria/Psicosensometria';
import Coproparasitologia from '../Manipuladores/Coproparasitologia/Coproparasitologia';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBacteria, faVial, faBug, faPlus, faTimes, faFileAlt, faMountain, faFlask, faChartBar, faVirus, faUserMd, faMicroscope, faBrain } from '@fortawesome/free-solid-svg-icons';

const ExamenesLaboratorio = ({ token, selectedSede }) => {
  const [activeTab, setActiveTab] = useState(1);
  const [showAdditionalDropdown, setShowAdditionalDropdown] = useState(false);
  const [showAdditionalModal, setShowAdditionalModal] = useState(false);
  const [selectedAdditionalView, setSelectedAdditionalView] = useState(null);

  const changeTab = (tabIndex) => setActiveTab(tabIndex);

  const additionalViews = [
    { id: 6, label: 'Anexo 16 A', icon: faFileAlt, component: Anexo16A },
    { id: 7, label: 'Test Altura', icon: faMountain, component: Altura },
    { id: 12, label: 'ANEXO 16A - TEST DE ALTURA - PSICOSENSOMETRICO', icon: faUserMd, component: Anexo16ATestAlturaPsicosensometrico },
    { id: 13, label: 'Hemograma Automatizado', icon: faMicroscope, component: HemogramaAutomatizado },
    { id: 15, label: 'Coproparasitología', icon: faBug, component: Coproparasitologia }
  ];

  return (
    <div className="w-full">
        <div className="flex gap-x-2 items-center relative">
          
          <button
            className={`px-6 py-2 border rounded-t-lg transition-all duration-150 text-base font-semibold focus:outline-none flex items-center ${showAdditionalDropdown ? 'bg-[#215086] text-white font-bold' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setShowAdditionalDropdown((prev) => !prev)}
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Adicionales
          </button>
          {showAdditionalDropdown && (
            <>
              <div
                className="dropdown-overlay"
                onClick={() => setShowAdditionalDropdown(false)}
              />
              <div className="dropdown-adicionales">
                {additionalViews.map((view) => (
                  <button
                    key={view.id}
                    className="w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-[#215086] hover:text-white transition-colors"
                    onClick={() => {
                      setSelectedAdditionalView(view);
                      setShowAdditionalModal(true);
                      setShowAdditionalDropdown(false);
                    }}
                  >
                    <FontAwesomeIcon icon={view.icon} className="mr-2 text-[#215086]" />
                    {view.label}
                  </button>
                ))}
              </div>
              <style>{`
                .dropdown-overlay {
                  position: fixed;
                  inset: 0;
                  background: rgba(0,0,0,0.25);
                  z-index: 49;
                  backdrop-filter: blur(4px);
                  -webkit-backdrop-filter: blur(4px);
                }
                .dropdown-adicionales {
                  position: absolute;
                  top: 100%;
                  left: 50%;
                  transform: translateX(-50%);
                  margin-top: 0.5rem;
                  background: white;
                  border: 1px solid #e5e7eb;
                  border-radius: 0.5rem;
                  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
                  z-index: 50;
                  width: 320px;
                  max-width: 100vw;
                }
              `}</style>
            </>
          )}
        </div>
        <div className="custom-border p-4 pt-2">
          {activeTab === 5 && <Coprocultivo token={token} selectedSede={selectedSede} />}
        </div>

        {showAdditionalModal && selectedAdditionalView && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
            <div
              className="bg-white rounded-lg p-6 w-[80vw] h-[80vh] overflow-y-auto shadow-lg mx-auto animate__animated animate__fadeInDown flex flex-col"
              style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-[#215086]">{selectedAdditionalView.label}</h2>
                <button 
                  onClick={() => setShowAdditionalModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
              <div className="border-t pt-4 flex-1 overflow-y-auto">
                <selectedAdditionalView.component token={token} selectedSede={selectedSede} />
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default ExamenesLaboratorio; 