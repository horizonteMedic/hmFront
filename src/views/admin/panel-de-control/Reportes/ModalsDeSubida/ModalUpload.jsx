import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCloudUploadAlt, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import NewArchivo from '../model/NewArchivo';
import Swal from 'sweetalert2';

const ModalUpload = ({ closeModal, id, nombre, extension, color, historiaClinica, orden, dni, user, token }) => {
  const [filePreview, setFilePreview] = useState(null);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState(false);

  const [fileName, setFileName] = useState('')
  
  function AleertSucces() {
    Swal.fire({
      title: "¡Exito!",
      text: "Se ha subido con exito el Archivo!",
      icon: "success",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Aceptar"
    }).then((result) => {
      if (result.isConfirmed) {
        closeModal()
      }
    });
  }

  const closeCAMUModal = () => {
    closeModal();
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target.result;
        

        setFilePreview(base64String);
        setFileUploaded(true);
      };
      reader.readAsDataURL(file);
      //Recupero el nombre del archivo
      const fileName = file.name;
      console.log(fileName)
      setFileName(fileName);
    }
  };

  const handleFileInputClick = () => {
    document.getElementById('fileInput').click();
  };

  const handleUpload = () => {
    setUploading(true);
    NewArchivo(fileName,dni,historiaClinica,orden,id,user,token,filePreview)
    .then(data => {
      console.log('gane',data)
      setUploadSuccess(true);
      setUploading(false);
      AleertSucces()
    })
    .catch(error => {
      console.error('Error:', error)
    })
    // Simulando una solicitud de carga (aquí puedes agregar tu lógica real de carga)
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg overflow-hidden shadow-xl w-[40%] relative">
        <div className="flex justify-between items-center px-4 py-2 bg-gray-200">
          <h2 className="text-lg font-bold">SUBIR ARCHIVO {nombre}</h2>
          <button onClick={closeCAMUModal} className="text-black">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className="mx-auto my-8 w-[90%] h-[200px] border-dashed border-4 border-gray-400 flex justify-center items-center cursor-pointer" onClick={handleFileInputClick}>
          {filePreview ? (
            <img src={filePreview} alt="Vista previa del archivo" className="max-w-full max-h-full" />
          ) : (
            <span>Haga clic aquí para seleccionar un archivo</span>
          )}
          <input type="file" id="fileInput" className="hidden" onChange={handleFileInputChange} />
        </div>
        {uploading && (
          <div className="flex items-center justify-center py-2">
            <p className="text-blue-500 mr-2">Subiendo archivo...</p>
            <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-10 w-10"></div>
          </div>
        )}
        {uploadSuccess && (
          <div className="flex items-center justify-center py-2">
            <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mr-2" />
            <p className="text-green-500">Archivo subido correctamente</p>
          </div>
        )}
        {uploadError && (
          <div className="flex items-center justify-center py-2">
            <FontAwesomeIcon icon={faTimesCircle} className="text-red-500 mr-2" />
            <p className="text-red-500">El archivo no pudo ser subido</p>
          </div>
        )}
        <button
          onClick={handleUpload}
          disabled={!fileUploaded || uploading}
          style={{background: `${color}`}}
          className={`block w-full py-2 text-white font-bold uppercase rounded hover:bg-red-600 focus:outline-none focus:bg-red-600 ${(!fileUploaded || uploading) && 'opacity-50 cursor-not-allowed'}`}
        >
          Subir <FontAwesomeIcon icon={faCloudUploadAlt} className="ml-2" />
        </button>
      </div>
    </div>
  );
};

export default ModalUpload;
