import React from 'react';

const ViewModal = ({ fileURL, closeModal }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg overflow-hidden shadow-xl">
        <div className="px-4 py-2 naranjabackgroud flex justify-between ">
          <h2 className="text-lg font-bold color-blanco">Vista previa del archivo</h2>
          <button onClick={closeModal} className="text-xl text-white" style={{ fontSize: '23px' }}>×</button>
        </div>
        <div className="p-4">
          {fileURL && (
            <iframe src={fileURL} title="Vista previa de archivo" className="w-full h-full" />
          )}
        </div>
      </div>
      
    </div>
  );
};

export default ViewModal;
