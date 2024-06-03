import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCloudUploadAlt, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import NewArchivo from '../model/NewArchivo';
import Swal from 'sweetalert2';

const ModalUpload = ({ closeModal, combinedParam, dni, user, token, reloadread, sede }) => {

  const [datosarch, setDatosarch] = useState({
      id: combinedParam.archivoItem.id,
      nombre: combinedParam.archivoItem.nombre,
      extension: combinedParam.archivoItem.extension,
      color: combinedParam.archivoItem.color,
      codigo: combinedParam.archivoItem.codigo,
      nomenclatura: combinedParam.archivoItem.nomenclatura,
      historiaClinica: combinedParam.historiaClinica,
      orden: combinedParam.orden,
      nombres: combinedParam.nombres,
      apellidos: combinedParam.apellidos
  });

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
        reloadread()
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
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop().toLowerCase();
      const fileNameWithoutExtension = fileName.substring(0, fileName.lastIndexOf('.'));
      
      if (datosarch.extension === 'pdf' && fileExtension !== 'pdf') {
        Swal.fire({
          icon: 'error',
          title: 'Error al subir archivo',
          text: 'El archivo debe ser un PDF',
        });
        closeModal()
        return;
      } else if (datosarch.extension !== 'pdf' && !['jpg', 'jpeg', 'png'].includes(fileExtension)) {
        Swal.fire({
          icon: 'error',
          title: 'Error al subir archivo',
          text: 'El archivo debe ser una imagen (jpg, jpeg, png)',
        });
        closeModal()
        return;
      }
      

      
      if (sede !== 'HMAC') {

      const Nombres = `${datosarch.apellidos} ${datosarch.nombres}`
      const CodOrden = fileNameWithoutExtension.split('-') 

      if (CodOrden.length < 3) {
        Swal.fire({
          icon: 'error',
          title: 'Error al subir archivo',
          text: 'El nombre del archivo no tiene el formato esperado.\n\nRecuerda que debe ser Orden-Nomenclatura-Nombres',
        });
        closeModal();
        return;
      }

      //Nomenclatuura
      const Orden = fileNameWithoutExtension.split('-')[0]
      //Nombre
      const NamePart = CodOrden[2].trim().replace(/\s+/g, ' ')
      const cleanedNamePart = NamePart.replace(/\s+/g, ' ');
      const ApellName = Nombres.trim().replace(/\s+/g, ' ');

      //Cod Orden
      const Nomenclatura = CodOrden[1].trim()
      
        if (datosarch.orden != Orden) {
          Swal.fire({
            icon: 'error',
            title: 'Error al subir archivo',
            text: `El número de Orden debe ser igual: ${datosarch.orden}. \n\nRecuerda que debe ser Orden-Nomenclatura-Nombres`,
          });
          closeCAMUModal()
          return;
        }

        if (datosarch.nomenclatura.toUpperCase() != Nomenclatura.toUpperCase()) {
          Swal.fire({
            icon: 'error',
            title: 'Error al subir archivo',
            text: `La Nomenlatura debe ser igual: ${datosarch.nomenclatura}. \n\nRecuerda que debe ser Orden-Nomenclatura-Nombres`,
          });
          closeCAMUModal()
          return;
        }
  
  
        if (ApellName.toUpperCase() != cleanedNamePart.toUpperCase()) {
          Swal.fire({
            icon: 'error',
            title: 'Error al subir archivo',
            text: `Los Apellidos y Nombres son Incorrectos: ${ApellName}. \n\nRecuerda que debe ser Orden-Nomenclatura-Nombres`,
          });
          closeCAMUModal()
          return;
        }
  
        
        const filesave = `${Orden}-${Nomenclatura}-${cleanedNamePart}.${fileExtension}`
        setFileName(filesave);
      } else {
        setFileName(fileName)
      }
      

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target.result;
        setFilePreview(base64String);
        setFileUploaded(true);
      };
      reader.readAsDataURL(file);
      
    }
  };
  
  const handleFileInputClick = () => {
    document.getElementById('fileInput').click();
  };

  const handleUpload = () => {
    
    Swal.fire({
      title: "¿Estas Seguro?",
      text: `Vas a subir este archivo a la Sede ${sede}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Subir!"
    }).then((result) => {
      if (result.isConfirmed) {
        setUploading(true);
        NewArchivo(fileName,dni,datosarch.historiaClinica,datosarch.orden,datosarch.id,user,token,filePreview)
        .then(data => {
          setUploadSuccess(true);
          setUploading(false);
          AleertSucces()
        })
        .catch(error => {
          console.error('Error:', error)
        }) 
      } else {
        closeCAMUModal()
      }
    })

    
    // Simulando una solicitud de carga (aquí puedes agregar tu lógica real de carga)
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg overflow-hidden shadow-xl w-[40%] relative">
        <div className="flex justify-between items-center px-4 py-2 bg-gray-200">
          <h2 className=" "> <strong>SUBIR ARCHIVO:</strong> {datosarch.nombre}</h2>
          <button onClick={closeCAMUModal} className="text-black">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className="mx-auto my-8 w-[90%] h-[200px] border-dashed border-4 border-gray-400 flex justify-center items-center cursor-pointer" onClick={handleFileInputClick}>
          {filePreview ? (
              <img src={filePreview} alt="Vista previa del archivo" className="max-w-full max-h-full" />
            ) : (
              <div className="text-center">
                <h2 style={{ fontSize: '24px', fontWeight:'bold' }}>{datosarch.nombre}.{datosarch.extension}</h2>
                <span>Haga clic aquí para seleccionar un archivo</span>
              </div>
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
          style={{background: datosarch.codigo}}
          className={`block w-full py-2 text-white font-bold uppercase rounded hover:bg-red-600 focus:outline-none focus:bg-red-600 ${(!fileUploaded || uploading) && 'opacity-50 cursor-not-allowed'}`}
          >
          Subir <FontAwesomeIcon icon={faCloudUploadAlt} className="ml-2" />
        </button>
      </div>
    </div>
  );
};

export default ModalUpload;