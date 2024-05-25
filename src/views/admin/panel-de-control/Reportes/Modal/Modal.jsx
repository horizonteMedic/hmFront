import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faFilePdf, faFileImage, faDownload } from '@fortawesome/free-solid-svg-icons';
import { GetHistoryUser } from '../model/getHistoryUser';
import { GetlistArchivos } from '../model/getlistArchivos';
import ModalUpload from '../ModalsDeSubida/ModalUpload';
import { GetArchivosSubidos } from '../model/getArchivosSubidos';
import { ReadArchivos, DeleteArchivos64 } from '../model/readArchivos';
import Swal from 'sweetalert2';

const Modal = ({ closeModal, user, iduser, start, end, sede, dni, nombre, empresa, contrata, token, name, apell, Acces }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listarchivos, setListarchivos] = useState([]);
  const [read, setRead] = useState([])
  const [reload, setReload] = useState(0)
  const [openview, setOpenview] = useState(false)

  const [modalArchivos, setModalArchivos] = useState(false);
  const [datosarc, setDatosarc] = useState(null)
  const [currentFile, setCurrentFile] = useState(null);
  useEffect(() => {
    setLoading(true);
    GetHistoryUser(user, start, end, sede, dni, empresa, contrata, token)
      .then(response => {
        if (response.mensaje === 'No value present' || response.mensaje === 'Cannot invoke "java.util.List.stream()" because "listadoHP" is null') {
          setData([]);
        } else {
          setData(response);
        }
      })
      .catch(error => {
        throw new Error('Network response was not ok.', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    GetlistArchivos(token, iduser)
      .then(response => {
        setListarchivos(response);
      })
      .catch(error => {
        throw new Error('Network response was not ok.', error);
      });

  }, []);


  useEffect(() => {
      if (data && data.length > 0) {

        const fetchArchivos = async () => {
          const archivosPorHistoria = {};
          for (let item of data) {
            try {
              const response = await GetArchivosSubidos(item.historiaClinica, iduser, token);
              archivosPorHistoria[item.historiaClinica] = response;
            } catch (error) {
              console.error('Error fetching archivos for historiaClinica', item.historiaClinica, error);
            }
          }
          setRead(archivosPorHistoria);
        };
        fetchArchivos();
      }
  }, [data, reload])

  const reloadread = () => {
    setReload( reload +1)
  }

  const filterArchivos = (readItem) => {
    const archivoEncontrado = listarchivos.find(archivo => archivo.id === readItem.id_tipo_archivo);
    if (archivoEncontrado) {
      if (archivoEncontrado.extension === 'pdf') {
        return (
          <>
            <FontAwesomeIcon icon={faFilePdf} size='xl' className="mr-1"  style={{ color: archivoEncontrado.codigo }} />
          </>
        );
      } else if (archivoEncontrado.extension === 'jpg' || archivoEncontrado.extension === 'png') {
        return (
          <>
            <FontAwesomeIcon icon={faFileImage} size='xl' className="mr-2" style={{ color: archivoEncontrado.codigo }} />
          </>
        );
      }
    }
    return null;
  };
  
  const openModalArchivos = (archivoItem,historiaClinica, orden)  => {
    const combinedParam = {
      archivoItem: archivoItem,
      historiaClinica: historiaClinica,
      orden: orden,
      nombres: name,
      apellidos: apell
    };  
    setDatosarc(combinedParam)
    setModalArchivos(true);
  };

  const closeModalArchivos = () => {
    setModalArchivos(false);
  };

  const ReadFileBase64 = (response) => {
    const fileType = response.nombreArchivo.split('.').pop();
    const byteCharacters = atob(response.fileBase64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: `application/${fileType}` });
  
    const fileDataUri = URL.createObjectURL(blob);
    setCurrentFile({ uri: fileDataUri, name: response.nombreArchivo, type: `application/${fileType}` });
  };
  

  const GetBase64 = (historia, id_archivo) => {
    setOpenview(true)
    ReadArchivos(historia, id_archivo, token)
      .then(response => {
        ReadFileBase64(response);
      })
      .catch(error => {
        throw new Error('Network response was not ok.', error);
      })
      .finally(() =>{
        setOpenview(false)
      })
  };

  const DeleteBase64 = (id) => {

    Swal.fire({
      title: "¿Estas Seguro?",
      text: "No puedes revertir esta accion!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar!"
    }).then((result) => {
      if (result.isConfirmed) {
        DeleteArchivos64(id,token)
          .then(() => {
            Swal.fire({
              title: "Eliminado!",
              text: "El Archivo a sido eliminado de la base de datos.",
              icon: "success"
            }).then((result) => {
              if (result.isConfirmed) reloadread()
            });
          })
          .catch(() => {
            Swal.fire({
              title: "Error!",
              text: "El Archivo no se ha podido eliminar!",
              icon: "error"
            });
          });
      }
    })
    
  };
  const generateLegend = () => {
    const legend = listarchivos.map((archivo, index) => (
      <div key={index} className="flex items-center mb-4"> 
        <FontAwesomeIcon icon={archivo.extension === 'pdf' ? faFilePdf : faFileImage} style={{ color: archivo.codigo }} className="mr-1 ml-4" /> 
        <span className="text-sm">{archivo.nombre}</span>
      </div>
    ));
    return legend;
  };
  

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg overflow-hidden shadow-xl w-full max-w-[90%] mx-4">
        <div className="px-4 py-2 naranjabackgroud flex justify-between">
          <h2 className="text-lg font-bold text-white">Historial Paciente</h2>
          <button onClick={closeModal} className="text-xl text-white" style={{ fontSize: '23px' }}>×</button>
        </div>
        <div className="px-6 py-4 overflow-y-auto max-h-[60vh]">
          <div className="flex flex-wrap mb-4">
            <div className="w-full md:w-1/6 mb-4">
              <span>DNI : </span>
              <div className="bg-gray-200 rounded px-2 py-1 inline-block"><strong>{dni}</strong></div>
            </div>
            <div className="w-full md:w-1/2 mb-4">
              <span>Paciente : </span>
              <div className="bg-green-200 rounded px-2 py-1 inline-block"><strong>{nombre}</strong></div>
            </div>
          </div>
          {loading ? (
            <p className="text-center">Cargando...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    {Acces.Upload && <th className="border border-gray-300 px-2 py-1 text-center">Acción</th>}
                    <th className="border border-gray-300 px-2 py-1 text-center">Orden</th>
                    <th className="border border-gray-300 px-2 py-1 text-center">Empresa</th>
                    <th className="border border-gray-300 px-2 py-1 text-center">Contrata</th>
                    <th className="border border-gray-300 px-2 py-1 text-center">Fecha Examen</th>
                    <th className="border border-gray-300 px-2 py-1 text-center">Examen</th>
                    <th className="border border-gray-300 px-2 py-1 text-center">Estado</th>
                    <th className="border border-gray-300 px-2 py-1 text-center">Cargo</th>
                    <th className="border border-gray-300 px-2 py-1 text-center">Área</th>
                    <th className="border border-gray-300 px-2 py-1 text-center">Grupo sanguíneo</th>
                    <th className="border border-gray-300 px-2 py-1 text-center">Historia Clinica</th>
                    {Acces.Download && <th className="border border-gray-300 px-2 py-1 text-center">Archivos</th>}
                  </tr>
                </thead>
                <tbody>
                  {data.map((dataItem, dataIndex) => (
                    <tr key={dataIndex}>
                      {Acces.Upload && (
                        <td className="border border-gray-300 px-2 py-1">
                          <div className="flex flex-col">
                            {listarchivos.map((archivoItem, archivoIndex) => (
                              <div className="flex items-center" onClick={() => { openModalArchivos(archivoItem, dataItem.historiaClinica, dataItem.orden) }} key={archivoIndex}>
                                <FontAwesomeIcon icon={faArrowUp} className="cursor-pointer pt-2" style={{ color: archivoItem.codigo }} />
                                <div className="text-sm fw-semi-bold cursor-pointer ml-2 pt-2">Subir {archivoItem.nombre}</div>
                              </div>
                            ))}
                          </div>
                        </td>
                      )}
                      <td className="border border-gray-300 px-2 py-1">{dataItem.orden}</td>
                      <td className="border border-gray-300 px-2 py-1">{dataItem.empresa}</td>
                      <td className="border border-gray-300 px-2 py-1">{dataItem.contrata}</td>
                      <td className="border border-gray-300 px-2 py-1">{dataItem.fechaExamen}</td>
                      <td className="border border-gray-300 px-2 py-1">{dataItem.examen}</td>
                      <td className="border border-gray-300 px-2 py-1">{dataItem.estado}</td>
                      <td className="border border-gray-300 px-2 py-1">{dataItem.cargo}</td>
                      <td className="border border-gray-300 px-2 py-1">{dataItem.area}</td>
                      <td className="border border-gray-300 px-2 py-1">{dataItem.grupoSanguineo}</td>
                      <td className="border border-gray-300 px-2 py-1">{dataItem.historiaClinica}</td>
                      {Acces.Download && (
                        <td className="border border-gray-300 px-2 py-1">
                          {(read[dataItem.historiaClinica] || []).map((readItem, readIndex) => (
                            <a key={readIndex} className={`${openview ? 'cursor-auto' : 'cursor-pointer'}`} {...(Acces.Delete ? { onContextMenu: (e) => { e.preventDefault(); DeleteBase64(readItem.id); } } : {})} disabled={openview} title={readItem.nombreArchivo} onClick={() => { GetBase64(dataItem.historiaClinica, readItem.id_tipo_archivo) }}>
                              {filterArchivos(readItem)}
                            </a>
                          ))}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="flex justify-center bg-gray-100 p-3">
          <div className="flex flex-wrap">
            {generateLegend()}
          </div>
        </div>
        {Acces.Delete && (
          <div className="flex justify-center bg-gray-100 p-3">
            <div className="flex items-center">
              <p className="text-red-500 font-bold text-sm text-center">Para eliminar un archivo, hacer click derecho sobre el</p>
            </div>
          </div>
        )}
      </div>
      {modalArchivos && (
        <ModalUpload closeModal={closeModalArchivos} combinedParam={datosarc} dni={dni} user={user} token={token} reloadread={reloadread} />
      )}
      {currentFile && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg overflow-hidden shadow-xl w-[700px] h-[auto] max-h-[90%]">
            <div className="px-4 py-2 naranjabackgroud flex justify-between">
              <h2 className="text-lg font-bold color-blanco">{currentFile.name}</h2>
              <button onClick={() => setCurrentFile(null)} className="text-xl text-white" style={{ fontSize: '23px' }}>×</button>
            </div>
            <div className="px-6 py-4 overflow-y-auto flex justify-center items-center">
              {currentFile.type === 'application/pdf' ? (
                <embed src={currentFile.uri} type="application/pdf" className="h-[500px] w-[500px] max-w-full" />
              ) : (
                <img src={currentFile.uri} alt={currentFile.name} className="h-auto w-auto max-w-full" />
              )}
            </div>
            <div className="flex justify-center">
              <a href={currentFile.uri} download={currentFile.name} className="azul-btn font-bold py-2 px-4 rounded mb-4">
                <FontAwesomeIcon icon={faDownload} className="mr-2" /> Descargar
              </a>
            </div>
          </div>
        </div>
      )}
    </div>

  );
};


export default Modal;
