import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faFolder, faCheck, faTimesCircle } from '@fortawesome/free-solid-svg-icons'; 
import Swal from 'sweetalert2';

const DataUploadModal = ({ closeModal }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedSede, setSelectedSede] = useState('');
  const [isFolderUploadEnabled, setIsFolderUploadEnabled] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({});

  const isImageOrPDFOrExcel = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    return ext === 'jpg' || ext === 'jpeg' || ext === 'png' || ext === 'gif' || ext === 'pdf' || ext === 'xls' || ext === 'xlsx';
  };

  const handleFolderUpload = (e) => {
    setUploadedFiles([]);
    setUploadStatus({});

    const folders = Array.from(e.target.files);
    const folderNames = folders.map((folder) => folder.name);
    setUploadedFiles((prevFiles) => [...prevFiles, ...folderNames]);

    folders.forEach((folder) => {
      if (!isImageOrPDFOrExcel(folder.name)) {
        setUploadStatus((prevStatus) => ({
          ...prevStatus,
          [folder.name]: 'error',
        }));
      } else {
        setTimeout(() => {
          setUploadStatus((prevStatus) => ({
            ...prevStatus,
            [folder.name]: 'success',
          }));
        }, Math.random() * 2000); 
      }
    });
  };

  const handleConfirmUpload = () => {
    if (!selectedSede || uploadedFiles.length === 0) {
      Swal.fire('Error', 'Por favor selecciona una sede y sube al menos un archivo.', 'error');
      return;
    }

    Swal.fire({
      title: 'Confirmar',
      text: `¿Estás seguro de subir los archivos a la sede ${selectedSede}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        setIsUploading(true);
        setTimeout(() => {
          const successRate = Math.random(); 
          const newStatus = uploadedFiles.reduce((acc, file) => ({
            ...acc,
            [file]: Math.random() < successRate ? 'success' : 'error',
          }), {});
          setUploadStatus((prevStatus) => ({ ...prevStatus, ...newStatus }));

          setIsUploading(false);
          closeModal();
          Swal.fire('¡Éxito!', 'Archivos subidos correctamente', 'success');
        }, 2000);
      }
    });
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
      <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-md w-[600px] relative">
        <FontAwesomeIcon icon={faTimes} className="absolute top-0 right-0 m-3 cursor-pointer text-gray-400" onClick={closeModal} />
        <div className="p azuloscurobackground flex justify-between p-3.5">
          <h1 className="text-start font-bold color-azul text-white">Subir Carga Masiva de Datos</h1>
        </div>
        <div className='container p-4'>
          <div className="bg-white rounded-lg z-50">
            <div className="flex mb-4">
              <select id="sedes" className="pointer border rounded-md px-2 py-1" value={selectedSede} onChange={(e) => {
                  setSelectedSede(e.target.value);
                  setIsFolderUploadEnabled(true);
                }}>
                <option value="">Seleccionar Sede</option>
                <option value="sede1">Sede 1</option>
                <option value="sede2">Sede 2</option>
                <option value="sede3">Sede 3</option>
              </select>
            </div>
            <div className="flex mb-4">
              <label htmlFor="folderUpload" className={`${isFolderUploadEnabled ? 'bg-blue-500' : 'bg-gray-300'} text-white px-4 py-2 rounded cursor-pointer flex items-center`}>
                <FontAwesomeIcon icon={faFolder} className="mr-2" />
                Subir Carpeta
                <input type="file" id="folderUpload" multiple directory="" webkitdirectory="" disabled={!selectedSede} onChange={handleFolderUpload} style={{ display: 'none' }} />
              </label>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="max-h-[300px] overflow-y-auto">
                <h3 className="text-lg font-bold mb-2">Archivos Cargados:</h3>
                <table className="table-auto w-full">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">Nombre del Archivo</th>
                      <th className="px-4 py-2">Estado</th>
                      <th className="px-4 py-2">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {uploadedFiles.map((file, index) => (
                      <tr key={index}>
                        <td className="border px-4 py-2">{file}</td>
                        <td className="border px-4 py-2">
                          {uploadStatus[file] === 'success' ? 'Archivo subido correctamente' : 'Error al subir archivo'}
                        </td>
                        <td className="border px-4 py-2">
                          {uploadStatus[file] === 'success' ? (
                            <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                          ) : (
                            <FontAwesomeIcon icon={faTimesCircle} className="text-red-500" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-4">
              <div className="mb-2">
                {Object.values(uploadStatus).some(status => status === 'error') && (
                  <div className="text-red-500">Existen archivos con errores. Corrígelos antes de subir.</div>
                )}
              </div>

            <button
              className={`px-4 py-2 rounded mr-2 ${Object.values(uploadStatus).some(status => status === 'error') ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white'}`}
              onClick={handleConfirmUpload}
              disabled={Object.values(uploadStatus).some(status => status === 'error')}
            >
              Subir
            </button>

              <button onClick={closeModal} className="bg-gray-300 px-4 py-2 rounded">Cerrar</button>
            </div>
            {isUploading && <div className="mt-4">Subiendo archivos...</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataUploadModal;
