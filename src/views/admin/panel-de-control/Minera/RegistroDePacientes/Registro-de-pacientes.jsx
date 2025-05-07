import { useState } from 'react';
import RegistroClientes from './RegistroClientes';
import AperturaExamenesPreOcup from './AperturaExamenes/AperturaExamenesPreOcup';


const TabComponent = () => {
  const [activeTab, setActiveTab] = useState(1);

  const changeTab = (tabIndex) => {
    setActiveTab(tabIndex);
  };

  return (
    <div className="container mx-auto mt-12 mb-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg overflow-hidden shadow-xl w-full sm:w-[90%] mx-auto">
        <div className="px-4 py-2">
          <div className="flex">
            <div
              className={`cursor-pointer py-2 px-4 ${  activeTab === 1 ? 'azul-btn' : '' } rounded-tl-lg rounded-tr-lg`}
              onClick={() => changeTab(1)}  >
              Registro de Clientes en General
            </div>

            <div
              className={`cursor-pointer py-2 px-4 ${  activeTab === 2 ? 'azul-btn' : ''  } rounded-tl-lg rounded-tr-lg`}
              onClick={() => changeTab(2)} >
              Apertura de Exámenes Pre-Ocupacionales
            </div>

          </div>
          {activeTab === 1 && <RegistroClientes />}
          {activeTab === 2 && <AperturaExamenesPreOcup />}
            
        </div>
      </div>
    </div>
  );
};

export default TabComponent;
