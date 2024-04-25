import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';

const Modal = ({ closeModal }) => {
  const [isLegajoModalOpen, setIsLegajoModalOpen] = useState(false);
  const [isCAMUModalOpen, setIsCAMUModalOpen] = useState(false);
  const [isImagenModalOpen, setIsImagenModalOpen] = useState(false);
  const [isCovidModalOpen, setIsCovidModalOpen] = useState(false);

  const openLegajoModal = () => {
    setIsLegajoModalOpen(true);
  };

  const closeLegajoModal = () => {
    setIsLegajoModalOpen(false);
  };

  const openCAMUModal = () => {
    setIsCAMUModalOpen(true);
  };

  const closeCAMUModal = () => {
    setIsCAMUModalOpen(false);
  };

  const openImagenModal = () => {
    setIsImagenModalOpen(true);
  };

  const closeImagenModal = () => {
    setIsImagenModalOpen(false);
  };

  const openCovidModal = () => {
    setIsCovidModalOpen(true);
  };

  const closeCovidModal = () => {
    setIsCovidModalOpen(false);
  };

  const handleFileInputClick = () => {
    document.getElementById('fileInput').click();
  };
  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg overflow-hidden shadow-xl w-[90%]">
        <div className="px-4 py-2 bg-gray-200 flex justify-between ">
          <h2 className="text-lg font-bold">Historial Paciente - Energi s.a.c.</h2>
          <button onClick={closeModal} className="text-xl" style={{ fontSize: '20px' }}>&times;</button>
        </div>
        <div className="px-6 py-4 overflow-y-auto flex flex-wrap "> {/* Agrega flex-wrap para envolver los elementos */}
          <div className="w-full md:w-1/6 mb-4"> {/* Divide en dos columnas en pantallas medianas */}
            <span>DNI : </span><div className="bg-gray-200 rounded px-2 py-1 inline-block"><strong>711393409</strong></div>
          </div>
          <div className="w-full md:w-1/2 mb-4"> {/* Divide en dos columnas en pantallas medianas */}
            <span>Paciente : </span><div className="sombreado-gris rounded px-2 py-1 inline-block"><strong> MANTILLA HUAMAN CATALINO</strong></div>
          </div>
          <table className="w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-2 py-1">ac.</th>
                <th className="border border-gray-300 px-2 py-1">orden</th>
                <th className="border border-gray-300 px-2 py-1">empresa</th>
                <th className="border border-gray-300 px-2 py-1">contrata</th>
                <th className="border border-gray-300 px-2 py-1">fecha apertura</th>
                <th className="border border-gray-300 px-2 py-1">examen</th>
                <th className="border border-gray-300 px-2 py-1">estado</th>
                <th className="border border-gray-300 px-2 py-1">cargo</th>
                <th className="border border-gray-300 px-2 py-1">área</th>
                <th className="border border-gray-300 px-2 py-1">grupo sanguíneo</th>
                <th className="border border-gray-300 px-2 py-1">archivos</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-2 py-1">
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faArrowUp} className="text-red-500 cursor-pointer" onClick={openLegajoModal} />
                      <div className="text-xs cursor-pointer ml-2" onClick={openLegajoModal}>Subir Legajo Médico</div>
                    </div>
                    <div className="flex items-center mt-2">
                      <FontAwesomeIcon icon={faArrowUp} className="text-blue-500 cursor-pointer" onClick={openCAMUModal} />
                      <div className="text-xs cursor-pointer ml-2" onClick={openCAMUModal}>Subir CAMU</div>
                    </div>
                    <div className="flex items-center mt-2">
                      <FontAwesomeIcon icon={faArrowUp} className="text-yellow-500 cursor-pointer" onClick={openImagenModal} />
                      <div className="text-xs cursor-pointer ml-2" onClick={openImagenModal}>Subir Imagen</div>
                    </div>
                    <div className="flex items-center mt-2">
                      <FontAwesomeIcon icon={faArrowUp} className="text-green-500 cursor-pointer" onClick={openCovidModal} />
                      <div className="text-xs cursor-pointer ml-2" onClick={openCovidModal}>Subir Archivo Covid</div>
                    </div>
                  </div>
                </td>
                <td className="border border-gray-300 px-2 py-1">86932</td>
                <td className="border border-gray-300 px-2 py-1">GRUPO TRANSPESA SAC</td>
                <td className="border border-gray-300 px-2 py-1">N/A</td>
                <td className="border border-gray-300 px-2 py-1">22-04-2024</td>
                <td className="border border-gray-300 px-2 py-1">PRE-OCUPACIONAL</td>
                <td className="border border-gray-300 px-2 py-1">PROCESO</td>
                <td className="border border-gray-300 px-2 py-1">CONDUCTOR</td>
                <td className="border border-gray-300 px-2 py-1">TRANSPORTE</td>
                <td className="border border-gray-300 px-2 py-1"></td>
                <td className="border border-gray-300 px-2 py-1"></td>
              </tr>
              {/* Repite el contenido de la tabla según sea necesario */}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Modal para Subir Legajo Médico */}
      {isLegajoModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg overflow-hidden shadow-xl w-[40%] relative">{/* Ancho del modal ajustado al 50% del tamaño de la pantalla */}
            <h2 className="px-4 py-2 bg-gray-200 text-lg font-bold">Subir Legajo Médico</h2>
            <button onClick={closeLegajoModal} className="absolute top-2 right-2 px-2 py-1 text-black rounded-full">X</button>
            <div className="mx-auto my-8 w-[90%] h-[200px] border-dashed border-4 border-gray-400 flex justify-center items-center cursor-pointer" onClick={handleFileInputClick}>
              Haga clic aquí para seleccionar un archivo
              <input type="file" id="fileInput" className="hidden" />
            </div>
          </div>
        </div>
      )}

      {/* Modal para Subir CAMU */}
      {isCAMUModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg overflow-hidden shadow-xl w-[40%] relative">{/* Ancho del modal ajustado al 50% del tamaño de la pantalla */}
            <h2 className="px-4 py-2 bg-gray-200 text-lg font-bold">Subir CAMU</h2>
            <button onClick={closeCAMUModal} className="absolute top-2 right-2 px-2 py-1 text-black rounded-full">X</button>
            <div className="mx-auto my-8 w-[90%] h-[200px] border-dashed border-4 border-gray-400 flex justify-center items-center cursor-pointer" onClick={handleFileInputClick}>
              Haga clic aquí para seleccionar un archivo
              <input type="file" id="fileInput" className="hidden" />
            </div>
          </div>
        </div>
      )}

      {/* Modal para Subir Imagen */}
      {isImagenModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg overflow-hidden shadow-xl w-[40%] relative">{/* Ancho del modal ajustado al 50% del tamaño de la pantalla */}
            <h2 className="px-4 py-2 bg-gray-200 text-lg font-bold">Subir Imagen</h2>
            <button onClick={closeImagenModal} className="absolute top-2 right-2 px-2 py-1 text-black rounded-full">X</button>
            <div className="mx-auto my-8 w-[90%] h-[200px] border-dashed border-4 border-gray-400 flex justify-center items-center cursor-pointer" onClick={handleFileInputClick}>
              Haga clic aquí para seleccionar un archivo
              <input type="file" id="fileInput" className="hidden" />
            </div>
          </div>
        </div>
      )}

      {/* Modal para Subir Archivo Covid */}
      {isCovidModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg overflow-hidden shadow-xl w-[40%] relative">
            <h2 className="px-4 py-2 bg-gray-200 text-lg font-bold">Subir Archivo Covid</h2>
            <button onClick={closeCovidModal} className="absolute top-2 right-2 px-2 py-1 text-black rounded-full">X</button>
            <div className="mx-auto my-8 w-[90%] h-[200px] border-dashed border-4 border-gray-400 flex justify-center items-center cursor-pointer" onClick={handleFileInputClick}>
              Haga clic aquí para seleccionar un archivo
              <input type="file" id="fileInput" className="hidden" />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};


export default Modal;
