import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faFolder, faCheck, faTimesCircle, faDownload } from '@fortawesome/free-solid-svg-icons'; 
import Swal from 'sweetalert2';
import ArchivosMasivos from '../model/postArchivosMasivos';
import { Loading } from '../../../../components/Loading';
import { jsPDF } from "jspdf";
import NewIndex from '../model/newIndex';
import { GetlistPDF } from '../model/getPDFlist';
import autoTable from "jspdf-autotable";

const DataUploadModal = ({ closeModal, Sedes, user, token }) => {
  const [uparchFile, setUparchFile] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isFolderUploadEnabled, setIsFolderUploadEnabled] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({});
  const [sucred, setSucred] = useState(false);
  const [fileOrder, setFileOrder] = useState({});
  const [indice, setIndice] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const sedes = Sedes;
  const defaultSede = sedes.find(sede => sede.cod_sede === 'T-NP');
  const initialSelectedSede = defaultSede || sedes[0];
  const [selectedSede, setSelectedSede] = useState(initialSelectedSede);
  const [isPDFAvailable, setIsPDFAvailable] = useState(false);

  // Estados para la simulación de descarga del PDF
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);
  const [downloadProgressPDF, setDownloadProgressPDF] = useState(0);
  const isImageOrPDFOrExcel = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    return ext === 'jpg' || ext === 'jpeg' || ext === 'png' ||  ext === 'pdf' ;
  };

  const handleFolderUpload = (e) => {
    setUploadedFiles([]);
    setUploadStatus({});
    setFileOrder({});
  
    // Filtrar el archivo desktop.ini
    let folders = Array.from(e.target.files).filter(file => file.name.toLowerCase() !== "desktop.ini");
    
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
    setIndice(0);
    let failedUploads = [];
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const index = await NewIndex(user, uploadedFiles.length, token);
    let uploadedCount = 0; // Contador de archivos procesados

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

      // Actualizar el progreso
      uploadedCount++;
      const progress = Math.round((uploadedCount / uparchFile.length) * 100);
      setUploadProgress(progress);

      // Espera 4 segundos antes de la siguiente iteración
      await sleep(4000);
    }
    setIndice(index.id);
    setSucred(true);
    setIsUploading(false);
    setIsPDFAvailable(true); // Activa el botón de descarga PDF
    
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
        setUploadProgress(0); // Reiniciar el progreso
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
    // Iniciar simulación de descarga
    setIsDownloadingPDF(true);
    setDownloadProgressPDF(0);
  
    // Simular descarga con un intervalo
    const interval = setInterval(() => {
      setDownloadProgressPDF((prev) => {
        const nextVal = prev + 10;
        if (nextVal >= 100) {
          clearInterval(interval);
          // Una vez alcanzado el 100%, generar el PDF
          descargarPDF();
          return 100;
        }
        return nextVal;
      });
    }, 200); // cada 200ms aumenta un 10%
  };
  
  const descargarPDF = () => {
    const doc = new jsPDF();
    const imgUrl = "/img/logo-color.png";
  
    const loadImageAsBase64 = (url) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = url;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          const dataURL = canvas.toDataURL("image/png");
          resolve(dataURL);
        };
        img.onerror = (error) => reject(error);
      });
    };
  
    loadImageAsBase64(imgUrl)
      .then((logoData) => {
        GetlistPDF(token, indice)
          .then((res) => {
            const errores = res.filter((item) => item.id === 0); // Archivos con error
            const subidos = res.filter((item) => item.id === 1); // Archivos correctos
  
            const erroresNombres = errores.map((item) => item.nombre);
  
            const listaFinal = Object.entries(uploadStatus)
              .filter(
                ([nombre, estado]) =>
                  estado === "error" &&
                  nombre.toLowerCase() !== "desktop.ini" &&
                  nombre.trim() !== ""
              )
              .map(([nombre]) => nombre)
              .concat(erroresNombres)
              .filter((nombre) => nombre && nombre.trim() !== "");
  
            doc.addImage(logoData, "PNG", 10, 10, 50, 15);
  
            let yPos = 30;
            const fechaActual = new Date();
            const fecha = fechaActual.toLocaleDateString();
            const hora = fechaActual.toLocaleTimeString();
  
            // Título en negrita
            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.text("Reporte de Datos Cargados", 10, yPos);
            yPos += 10;
  
            doc.setFontSize(10);
            const leftColX = 10;
            const rightColX = 100;
  
            // ÍNDICE en negrita
            doc.setFont("helvetica", "bold");
            doc.text("Índice:", leftColX, yPos);
            doc.setFont("helvetica", "normal");
            doc.text(`${indice}`, leftColX + 20, yPos);
  
            // FECHA en negrita
            doc.setFont("helvetica", "bold");
            doc.text("Fecha:", rightColX, yPos);
            doc.setFont("helvetica", "normal");
            doc.text(`${fecha}`, rightColX + 15, yPos);
            yPos += 10;
  
            // USUARIO en negrita
            doc.setFont("helvetica", "bold");
            doc.text("Usuario:", leftColX, yPos);
            doc.setFont("helvetica", "normal");
            doc.text(`${user}`, leftColX + 25, yPos);
  
            // HORA en negrita
            doc.setFont("helvetica", "bold");
            doc.text("Hora:", rightColX, yPos);
            doc.setFont("helvetica", "normal");
            doc.text(`${hora}`, rightColX + 12, yPos);
            yPos += 10;
  
            // Cantidad Total de Archivos en negrita y color rojo
            doc.setFont("helvetica", "bold");
            doc.setTextColor(255,0,0);
            doc.text(`Cantidad Total de Archivos: ${uparchFile.length}`, leftColX, yPos);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(0,0,0);
            yPos += 10;
  
            // Título de la tabla de errores en negrita
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.text("Archivos subidos con error:", leftColX, yPos);
            doc.setFont("helvetica", "normal");
            yPos += 5;
  
            const errorTable = listaFinal.map((file, index) => [
              index + 1,
              file,
              "Error",
            ]);
  
            autoTable(doc, {
              startY: yPos + 5,
              head: [["#", "Nombre del Archivo", "Estado"]],
              body: errorTable,
              theme: "grid",
              styles: { fontSize: 10, cellPadding: 2 },
              headStyles: { fillColor: [255, 99, 132], textColor: 255 },
            });
  
            yPos = doc.lastAutoTable.finalY + 10;
  
            // Texto debajo de tabla de errores
            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text(
              `* Verificar nomenclatura de archivos y que los archivos no excedan los 5 MB de preferencia, cualquier observación 
              contactar con el área de Sistemas.`,
              leftColX,
              yPos
            );
  
            yPos += 15;
  
            // Título de la tabla de archivos correctos en negrita
            doc.setFontSize(12);
            doc.setTextColor(0);
            doc.setFont("helvetica", "bold");
            doc.text("Archivos Subidos Correctamente:", leftColX, yPos);
            doc.setFont("helvetica", "normal");
            yPos += 5;
  
            const successTable = subidos.map((file, index) => [
              index + 1,
              file.mensaje || "Nombre no disponible",
              "Subido Correctamente",
            ]);
  
            autoTable(doc, {
              startY: yPos + 5,
              head: [["#", "Nombre del Archivo", "Estado"]],
              body: successTable,
              theme: "grid",
              styles: { fontSize: 10, cellPadding: 2 },
              headStyles: { fillColor: [75, 192, 192], textColor: 255 },
            });
  
            // Numeración de páginas
            const totalPages = doc.internal.getNumberOfPages();
            for (let i = 1; i <= totalPages; i++) {
              doc.setPage(i);
              doc.text(`Página ${i} de ${totalPages}`, 105, 290, { align: "center" });
            }
  
            doc.save("reporte_archivos.pdf");
            setIsDownloadingPDF(false); // Finalizar la simulación
          })
          .catch((error) => {
            console.error("Error al generar el PDF:", error);
            setIsDownloadingPDF(false);
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "No se pudo generar el reporte. Por favor, inténtalo nuevamente.",
            });
          });
      })
      .catch((err) => {
        console.error("Error al cargar la imagen:", err);
        setIsDownloadingPDF(false);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo cargar la imagen para el reporte.",
        });
      });
  };
  

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
      <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-md w-[800px] relative">
        <FontAwesomeIcon icon={faTimes} className="absolute top-0 right-0 m-2.5  cursor-pointer text-white"  style={{fontSize:'14px'}} onClick={closeModal} />
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
                              <FontAwesomeIcon icon={faCheck} className="text-green-500 mr-4" />
                              <span>Archivo Subido Correctamente</span>
                            </>
                          ) : (
                            <>
                            <FontAwesomeIcon icon={faTimesCircle} className="text-red-500 mr-4" />
                            <span>Archivo con error</span>
                          </>
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
              <p style={{padding:'10px'}}>*Cada archivo se subira cada 4 segundos al sistema</p>
              
              {isUploading && (
                <div className="flex items-center">
                  <Loading />
                  {uploadProgress < 100 ? (
                    <span className="ml-2 font-bold">
                      Cargando archivos: {uploadProgress}%
                    </span>
                  ) : (
                    <span className="ml-2 font-bold text-green-600">
                      Carga completa
                    </span>
                  )}
                </div>
              )}

              {/* Mostrar el GIF si la carga está completa */}
              {!isUploading && uploadProgress === 100 && (
  <div className="flex flex-col items-center mt-4">
    <img src="/gifs/party-popper-confetti.gif" alt="Carga Completa" style={{width: '100px', height: '100px'}}/>
    <span className="mt-2 font-bold text-green-600">
      ¡Archivos subidos, ya puedes descargar!
    </span>
  </div>
)}



              {isPDFAvailable && (
                <div className="flex flex-col items-center mt-4">
                  <button
                    className="px-4 py-2 rounded bg-red-500 text-white"
                    onClick={generateErrorTablePDF}
                    disabled={isDownloadingPDF}
                  >
                    <FontAwesomeIcon icon={faDownload} className="mr-2" />
                    Descargar PDF
                  </button>
                  {isDownloadingPDF && (
                    <div className="flex items-center mt-2">
                      <Loading />
                      {downloadProgressPDF < 100 ? (
                        <span className="ml-2 font-bold">
                          Descargando archivo: {downloadProgressPDF}%
                        </span>
                      ) : (
                        <span className="ml-2 font-bold text-green-600">
                          Descarga completa
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataUploadModal;
