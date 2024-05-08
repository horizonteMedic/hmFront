import React from 'react';

const FileViewerModal = ({ closeModal, fileUrl }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg overflow-hidden shadow-xl w-[90%]">
        <div className="px-4 py-2 flex justify-between">
          <h2 className="text-lg font-bold">Archivo</h2>
          <button onClick={closeModal} className="text-xl">&times;</button>
        </div>
        <div className="p-4">
          <embed src={fileUrl} type="application/pdf" width="100%" height="600px" />
        </div>
      </div>
    </div>
  );
};

export default FileViewerModal;
