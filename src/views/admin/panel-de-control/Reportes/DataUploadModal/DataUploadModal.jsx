import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faFolder } from '@fortawesome/free-solid-svg-icons'; // Agrega el icono de carpeta
import Swal from 'sweetalert2';

const DataUploadModal = ({ closeModal }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploadConfirmed, setIsUploadConfirmed] = useState(false);
  const [selectedSede, setSelectedSede] = useState('');
  const [isFolderUploadEnabled, setIsFolderUploadEnabled] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFolderUpload = (e) => {
    const folders = Array.from(e.target.files);
    // Logic to handle folder upload
    // For demonstration purposes, just adding folder names to the uploaded files list
    const folderNames = folders.map((folder) => folder.name);
    setUploadedFiles((prevFiles) => [...prevFiles, ...folderNames]);
  };

  const handleUpload = () => {
    if (selectedSede) {
      Swal.fire({
        title: '¿Seguro que quieres subir los archivos?',
        text: `Esto subirá los archivos a ${selectedSede}.`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          setIsUploadConfirmed(true);
        }
      });
    }
  };

  const handleConfirmUpload = () => {
    setIsUploading(true);
    // Perform upload logic here
    // For demonstration purposes, just simulating a delay
    setTimeout(() => {
      console.log(`Subiendo archivos a ${selectedSede}`);
      // Clear uploaded files and set confirmation to false
      setUploadedFiles([]);
      setIsUploadConfirmed(false);
      setIsUploading(false);
      // Close modal
      closeModal();
    }, 2000); // Simulate a 2-second upload
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
      <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-md w-[400px] relative">
        <FontAwesomeIcon icon={faTimes} className="absolute top-0 right-0 m-3 cursor-pointer text-gray-400" onClick={closeModal} />
        <div className="p azuloscurobackground flex justify-between p-3.5">
          <h1 className="text-start font-bold color-azul text-white">Subir Carga Masiva de Datos</h1>
        </div>
        <div className='container p-4'>
          <div className="bg-white rounded-lg z-50">
            <h2 className="text-lg font-bold mb-4">Carga de Datos</h2>
            <div className="flex mb-4">
              <label htmlFor="sedes" className="mr-2">Sedes:</label>
              <select id="sedes" className="pointer border rounded-md px-2 py-1" value={selectedSede} onChange={(e) => {
                  setSelectedSede(e.target.value);
                  setIsFolderUploadEnabled(true);
                }}>
                <option value="">Seleccionar...</option>
                <option value="sede1">Sede 1</option>
                <option value="sede2">Sede 2</option>
                <option value="sede3">Sede 3</option>
              </select>
            </div>
            <div className="flex mb-4">
              <label htmlFor="folderUpload" className={`${isFolderUploadEnabled ? 'bg-blue-500' : 'bg-gray-300'} text-white px-4 py-2 rounded cursor-pointer flex items-center`}>
                <FontAwesomeIcon icon={faFolder} className="mr-2" />
                Subir Carpeta
                <input type="file" id="folderUpload" multiple directory="" webkitdirectory="" onChange={handleFolderUpload} style={{ display: 'none' }} />
              </label>
            </div>

            {uploadedFiles.length > 0 && (
              <div>
                <h3 className="text-lg font-bold mb-2">Archivos Cargados:</h3>
                <table className="table-auto w-full">
                  <tbody>
                    {uploadedFiles.map((file, index) => (
                      <tr key={index}>
                        <td className="border px-4 py-2">{file}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-4">
              {!isUploadConfirmed ? (
                <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2" onClick={handleUpload}>Subir</button>
              ) : (
                <div>
                  <p>¿Seguro que quieres subir los archivos a {selectedSede}?</p>
                  <button className="bg-green-500 text-white px-4 py-2 rounded mr-2" onClick={handleConfirmUpload}>Confirmar</button>
                  <button className="bg-red-500 text-white px-4 py-2 rounded mr-2" onClick={() => setIsUploadConfirmed(false)}>Cancelar</button>
                </div>
              )}
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
