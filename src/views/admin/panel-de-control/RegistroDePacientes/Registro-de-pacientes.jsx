import React, { useState, useEffect } from 'react';
import RegistroClientes from './RegistroClientes';
import AperturaExamenesPreOcup from './AperturaExamenesPreOcup';
import ImportacionModal from './ImportacionMasiva';
import ImportacionModalBasica from './ImportacionModalBasica'; // Importa el nuevo modal
import ReservaPacientes from './ReservaPacientes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faClipboardList, faFileExcel, faExpand, faTicket } from '@fortawesome/free-solid-svg-icons';
import './TabComponent.css'; // Importa el archivo CSS aquí
import { useAuthStore } from '../../../../store/auth';
import { Loading } from '../../../components/Loading';

const TabComponent = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const token = useAuthStore(state => state.token);
  const userlogued = useAuthStore(state => state.userlogued);
  const views = useAuthStore(state => state.listView);

  const AccessRegistroC= views.some(view => view.id === 653);
  const AccessHistoriaC = views.some(view => view.id === 654);
  const AccessCitas = views.some(view => view.id === 655);
  const AccesExcelBasico = views.some(view => view.id === 656)
  const AccesExcelCompleto = views.some(view => view.id === 657)

  const Acces = {
    Registro: AccessRegistroC,
    Historia: AccessHistoriaC,
    Citas: AccessCitas,
    ExcelB: AccesExcelBasico,
    ExcelC: AccesExcelCompleto
  }

  useEffect(() => {
    const keys = Object.keys(Acces);
    for (let i = 0; i < keys.length; i++) {
      if (Acces[keys[i]]) {
        setActiveTab(i + 1); // +1 para ajustar al índice basado en 1
        break;
      }
    }
  }, [  ]);



  const changeTab = (tabIndex) => {
    setActiveTab(tabIndex);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openCompleteModal = () => {
    setIsCompleteModalOpen(true);
  };

  const closeCompleteModal = () => {
    setIsCompleteModalOpen(false);
  };

  const toggleFullScreen = () => {
    const elem = document.documentElement;
    if (!document.fullscreenElement) {
      elem.requestFullscreen().catch((err) => {
        console.log(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-md w-[90%] relative mt-6">
      <div className="p azuloscurobackground flex justify-between p-3.5">
        <h1 className="text-start font-bold color-azul text-white">Registro de Pacientes</h1>
        <div className="flex items-center">
          {Acces.ExcelB && <button
            className="verde-btn px-4 rounded flex items-center mr-4 sm:mr-2" 
            onClick={openCompleteModal}
          >
            <FontAwesomeIcon icon={faFileExcel} className="mr-2 px-1 py-2" />
            Excel Básico
          </button>}
          {Acces.ExcelC && <button
            className="verde-btn px-4 rounded flex items-center mr-4 sm:mr-2" 
            onClick={openModal}
          >
            <FontAwesomeIcon icon={faFileExcel} className="mr-2 px-1 py-2" />
            Excel Completo
          </button>}
          
          <button
            className="naranja-btn px-4 rounded flex items-center hidden sm:flex" 
            onClick={toggleFullScreen}
          >
            <FontAwesomeIcon icon={faExpand} className="mr-2 px-1 py-2" />
            Expandir
          </button>
        </div>
      </div>
      <div className='container'>
        <div className="container mx-auto mt-12 mb-12 px-4 sm:px-6 lg:px-8">
          <ImportacionModal isOpen={isModalOpen} onRequestClose={closeModal} selectedSede='T-NP' token={token} userlogued={userlogued}/>
          <ImportacionModalBasica isOpen={isCompleteModalOpen} onRequestClose={closeCompleteModal} selectedSede='T-NP' token={token} userlogued={userlogued}/>
          <div className="bg-white rounded-lg overflow-hidden w-full mx-auto">
            <div className="flex flex-col sm:flex-row"> {/* Flex column en mobile y row en mayores */}
              {Acces.Registro && <div
                className={`cursor-pointer flex items-center py-2 px-4 sm:px-6 ${activeTab === 1 ? 'bg-[#215086] text-white font-bold' : 'bg-[#edf0f7] text-gray-800'} rounded-tl-lg rounded-tr-lg mb-2 sm:mb-0 sm:mr-2`}
                onClick={() => changeTab(1)}
              >
                <FontAwesomeIcon icon={faUsers} className="mr-2" />
                Registro de Clientes en General
              </div>}
              {Acces.Historia && <div
                className={`cursor-pointer flex items-center py-2 px-4 sm:px-6 ${activeTab === 2 ? 'bg-[#215086] text-white font-bold' : ' bg-[#edf0f7] text-gray-800'} rounded-tl-lg rounded-tr-lg mb-2 sm:mb-0 sm:mr-2`}
                onClick={() => changeTab(2)}
              >
                <FontAwesomeIcon icon={faClipboardList} className="mr-2" />
                Apertura de Exámenes Pre-Ocupacionales
              </div>}
              {Acces.Citas && <div
                className={`cursor-pointer flex items-center py-2 px-4 sm:px-6 ${activeTab === 3 ? 'bg-[#215086] text-white font-bold' : ' bg-[#edf0f7] text-gray-800'} rounded-tl-lg rounded-tr-lg  mb-2 sm:mb-0 sm:mr-2`}
                onClick={() => changeTab(3)}
              >
                <FontAwesomeIcon icon={faTicket} className="mr-2" />
                Reserva de Pacientes
              </div>}
            </div>

            <div className="custom-border p-4">
              {activeTab === 1 && Acces.Registro && <RegistroClientes selectedSede='T-NP' Loading={Loading} token={token} />}
              {activeTab === 2 && Acces.Historia && <AperturaExamenesPreOcup selectedSede='T-NP' token={token} Loading={Loading}/>}
              {activeTab === 3 && Acces.Citas && <ReservaPacientes selectedSede='T-NP' token={token} Loading={Loading} userlogued={userlogued.sub}/>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabComponent;
