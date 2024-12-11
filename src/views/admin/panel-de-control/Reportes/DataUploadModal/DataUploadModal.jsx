import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faFolder, faCheck, faTimesCircle, faDownload } from '@fortawesome/free-solid-svg-icons'; 
import Swal from 'sweetalert2';
import ArchivosMasivos from '../model/postArchivosMasivos';
import { Loading } from '../../../../components/Loading';
import { jsPDF } from "jspdf";
import NewIndex from '../model/newIndex';
import { GetlistPDF } from '../model/getPDFlist';


const DataUploadModal = ({ closeModal, Sedes, user, token }) => {
  const [uparchFile, setUparchFile] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isFolderUploadEnabled, setIsFolderUploadEnabled] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({});
  const [sucred, setSucred] = useState(false);
  const [fileOrder, setFileOrder] = useState({});
  const [indice, setIndice] = useState(0)
  const sedes = Sedes
  const defaultSede = sedes.find(sede => sede.cod_sede === 'T-NP');
  const initialSelectedSede = defaultSede || sedes[0];
  const [selectedSede, setSelectedSede] = useState(initialSelectedSede);


  const isImageOrPDFOrExcel = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    return ext === 'jpg' || ext === 'jpeg' || ext === 'png' ||  ext === 'pdf' ;
  };

  const handleFolderUpload = (e) => {
    setUploadedFiles([]);
    setUploadStatus({});
    setFileOrder({}); // Reset file order

    const folders = Array.from(e.target.files);
    setUparchFile(folders);
    const folderNames = folders.map((folder, index) => {
      const order = index + 1;
      setFileOrder((prevOrder) => ({
        ...prevOrder,
        [folder.name]: order,
      }));
      return {
        name: folder.name,
        order: order,
      };
    });
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

  
  const SubidaArchivos = async () => {
    setIndice(0)
    let failedUploads = [];
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const index = await NewIndex(user,uploadedFiles.length,token)
    for (const folder of uparchFile) {
      try {
          const fileBase64 = await toBase64(folder);
          const base64WithoutHeader = fileBase64.split(',')[1];
          const datos = {
              nombre: folder.name,
              sede: selectedSede.cod_sede,
              base64: base64WithoutHeader,
              nomenclatura: null,
              indice: index.id
          };

          const response = await ArchivosMasivos(datos, user, token);
          if (response.id) {
            if (response.id === 1) {
              console.log('Subida exitosa');
            } else {
                setUploadStatus((prevStatus) => ({
                    ...prevStatus,
                    [folder.name]: 'error',
                }));
                failedUploads.push(folder.name);
            }
          } else {
              setUploadStatus((prevStatus) => ({
                  ...prevStatus,
                  [folder.name]: 'error',
              }));
              failedUploads.push(folder.name);
          }
          
      } catch (error) {
          console.error(`Error uploading ${folder.name}:`, error);
          failedUploads.push(folder.name);
      }

      // Espera 5 segundos antes de la siguiente iteración
      await sleep(4000);
    }
    setIndice(index.id)
    // Esperar 3 segundos antes de la sigui
    setSucred(true);
    setIsUploading(false);
    if (failedUploads.length > 0) {
      Swal.fire({
        icon: 'error',
        title: 'Detención!',
        html: `
          <p>Estos archivos no se han subido:</p>
          <div style="display: flex; flex-wrap: wrap; max-height: 300px; overflow-y: auto; text-align: left; padding: 10px;">
            <ul style="flex: 1 1 50%; padding-left: 20px; margin: 0;">
              ${failedUploads
                .slice(0, Math.ceil(failedUploads.length / 2))
                .map((file) => `<li style="font-size: 0.9em;">${file}</li>`)
                .join('')}
            </ul>
            <ul style="flex: 1 1 50%; padding-left: 20px; margin: 0;">
              ${failedUploads
                .slice(Math.ceil(failedUploads.length / 2))
                .map((file) => `<li style="font-size: 0.9em;">${file}</li>`)
                .join('')}
            </ul>
          </div>
        `,
        width: 600,
        confirmButtonText: 'Aceptar',
      });
    }
  };

  const handleConfirmUpload = async () => {
    if (!selectedSede || uploadedFiles.length === 0) {
      Swal.fire('Error', 'Por favor selecciona una sede y sube al menos un archivo.', 'error');
      return;
    }

    Swal.fire({
      title: 'Confirmar',
      text: `¿Estás seguro de subir ${uparchFile.length} archivos a la sede ${selectedSede.nombre_sede}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        setIsUploading(true);
        SubidaArchivos();
      }
    });
  };

  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSelectChange = (e) => {
    const selectedOption = JSON.parse(e.target.value);
    setSelectedSede(selectedOption);
    setIsFolderUploadEnabled(true);
  };

  const generateErrorTablePDF = () => {
    const doc = new jsPDF();

    GetlistPDF(token,indice)
    .then((res) => {

      const errores = res.filter((item) => item.id === 0);
      const subidos = res.filter((item) => item.id === 1);
      const erroresNombres = errores.map((item) => item.nombre);

      const listaFinal = Object.entries(uploadStatus)
        .filter(([nombre, estado]) => estado === 'error') // Filtra errores en uploadStatus
        .map(([nombre]) => nombre) // Mapea nombres
        .filter(Boolean) // Elimina valores undefined
        .filter((nombre) => !erroresNombres.includes(nombre)) // Excluye duplicados
        .concat(erroresNombres) // Combina las listas
        .filter(Boolean); // Limpia valores undefined nuevamente en la lista combinada

      console.log(listaFinal);
      let yPos = 20;
      let pageNumber = 1;
      // Datos generales
      const fechaActual = new Date();
      const fecha = fechaActual.toLocaleDateString();
      const hora = fechaActual.toLocaleTimeString();

      doc.setFontSize(12);
      doc.text(`Índice: ${indice}`, 10, yPos);
      yPos += 10;
      doc.text(`Usuario: ${user}`, 10, yPos); // Asume que tienes la variable `user`
      yPos += 10;
      doc.text(`Fecha: ${fecha}    Hora: ${hora}`, 10, yPos);
      yPos += 10;
      doc.text(`Cantidad Archivos: ${res.length}`, 10, yPos)
      yPos += 20;

      // Sección: Errores
      doc.text('Errores:', 10, yPos);
      yPos += 10;
      listaFinal.forEach((file) => {
        doc.text(`- ${file}`, 10, yPos); // Muestra cada archivo de la lista final
        yPos += 10;
    
        // Manejar salto de página si se supera el espacio
        if (yPos > 280) {
            doc.addPage();
            pageNumber++;
            yPos = 20;
        }
    });

      // Agregar espacio entre secciones o una nueva página si es necesario
      if (yPos > 270) {
          doc.addPage();
          pageNumber++;
          yPos = 20;
      } else {
          yPos += 10;
      }

      // Sección: Subidos Correctamente
      doc.text('Subidos Correctamente:', 10, yPos);
      yPos += 10;
      subidos.forEach((file) => {
          doc.text(`- ${file.mensaje}`, 10, yPos);
          yPos += 10;

          if (yPos > 280) {
              doc.addPage();
              pageNumber++;
              yPos = 20;
          }
      });

      // Guardar el PDF
      doc.save('reporte_archivos.pdf');
    })
    .catch(() => {
      console.error('Error al hacer la consulta:', error);
      Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo generar el reporte. Por favor, inténtalo nuevamente.',
      });
    })

    
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
              <select id="sedes" className="pointer border rounded-md px-2 py-1" value={selectedSede ? JSON.stringify(selectedSede) : ''} onChange={handleSelectChange}>
                <option value="">Seleccionar Sede</option>
                {sedes?.map((option) => (
                  <option key={option.cod_sede} value={JSON.stringify(option)}>{option.nombre_sede}</option>
                ))}
              </select>
            </div>
            <div className="flex mb-4">
              <label htmlFor="folderUpload" className={`bg-blue-500 text-white px-4 py-2 rounded cursor-pointer flex items-center`}>
                <FontAwesomeIcon icon={faFolder} className="mr-2" />
                Subir Carpeta
                <input type="file" id="folderUpload" multiple directory="" webkitdirectory="" disabled={!selectedSede} onChange={handleFolderUpload} style={{ display: 'none' }} />
              </label>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="max-h-[300px] overflow-y-auto">
                <h3 className="text-lg font-bold mb-2">
                  Archivos Cargados: {uploadedFiles.length}
                </h3>
                
                <table className="table-auto w-full">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">N°</th>
                      <th className="px-4 py-2">Nombre del Archivo</th>
                      <th className="px-4 py-2">Estado</th>
                      {sucred && <th className="px-4 py-2">Acciones</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {uploadedFiles.map((file, index) => (
                      <tr key={index}>
                        <td className="border px-4 py-2">{fileOrder[file.name]}</td>
                        <td className="border px-4 py-2">{file.name}</td>
                        <td className={`border px-4 py-2 ${uploadStatus[file.name] === 'success' ? 'bg-green-200' : 'bg-red-300'}`}>
                          {uploadStatus[file.name] === 'success' ? 'Archivo Listo' : 'Error al subir archivo'}
                        </td>
                        {sucred && <td className="border px-4 py-2">
                          {uploadStatus[file.name] === 'success' ? (
                            <>
                              <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                              <p>Archivo Subido Correctamente</p>
                            </>
                          ) : (
                            <FontAwesomeIcon icon={faTimesCircle} className="text-red-500" />
                          )}
                        </td>}
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
                className='px-4 py-2 rounded mr-2 bg-blue-500 text-white'
                onClick={handleConfirmUpload}
              >
                Subir Archivos
              </button>
              <p>*Cada archivo se subira cada 4 segundos al sistema</p>
              {isUploading && <Loading />}

              {Object.values(uploadStatus).some(status => status === 'error') && (
                <button
                  className="px-4 py-2 rounded bg-red-500 text-white"
                  onClick={generateErrorTablePDF}
                >
                  <FontAwesomeIcon icon={faDownload} className="mr-2" />
                  Descargar Errores en PDF
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataUploadModal;
