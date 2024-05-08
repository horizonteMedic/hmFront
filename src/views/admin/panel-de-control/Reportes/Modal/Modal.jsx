import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faFilePdf, faFileImage } from '@fortawesome/free-solid-svg-icons';
import { GetHistoryUser } from '../model/getHistoryUser';
import { GetlistArchivos } from '../model/getlistArchivos';
import ModalUpload from '../ModalsDeSubida/ModalUpload';
import { GetArchivosSubidos } from '../model/getArchivosSubidos';
import { ReadArchivos } from '../model/readArchivos';

const Modal = ({ closeModal, user, start, end, sede, dni, nombre, empresa, contrata, token }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listarchivos, setListarchivos] = useState([]);
  const [read, setRead] = useState([])
  const [modalArchivos, setModalArchivos] = useState(false);
  const [idarchivo, setIdarchivo] = useState('');
  const [nombrearc, setNombrearc] = useState('');
  const [extension, setExtension] = useState('');
  const [color, setColor] = useState('');
  const [historiaClinica, setHistoriaClinica] = useState('');
  const [orden, setOrden] = useState('');
 console.log(data)
  const [fileData, setFileData] = useState(null);
  useEffect(() => {
    setLoading(true);
    GetHistoryUser(user, start, end, sede, dni, empresa, contrata, token)
      .then(response => {
        if (response.mensaje === 'No value present' || response.mensaje === 'Cannot invoke "java.util.List.stream()" because "listadoHP" is null') {
          console.log('no hay na');
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
    GetlistArchivos(token)
      .then(response => {
        setListarchivos(response);
      })
      .catch(error => {
        throw new Error('Network response was not ok.', error);
      });

  }, []);

  useEffect(() => {
      if (data && data.length > 0) {
        GetArchivosSubidos(data[0].historiaClinica, token)
          .then(response => {
            setRead(response);
          })
          .catch(error => {
            throw new Error('Network response was not ok.', error);
          });
      }
  }, [data])

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
            <FontAwesomeIcon icon={faFileImage} size='xl' className="ml-1" style={{ color: archivoEncontrado.codigo }} />
          </>
        );
      }
    }
    return null;
  };
  
  const openModalArchivos = (id, nombre, extension, color, historiaClinica, orden) => {
    setIdarchivo(id);
    setNombrearc(nombre);
    setExtension(extension);
    setColor(color);
    setHistoriaClinica(historiaClinica);
    setOrden(orden);
    setModalArchivos(true);
  };

  const closeModalArchivos = () => {
    setModalArchivos(false);
  };


  const ReadBase64 = (response) => {
    const fileType = response.nombreArchivo.split('.').pop();
    const byteCharacters = atob(response.fileBase64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: `application/${fileType}` });
    console.log(blob)
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = response.nombreArchivo;
      link.click();
      URL.revokeObjectURL(link.href);
  }
  

  const GetBase64 = (historia,id_archivo) => {
    console.log(historia,id_archivo)
    ReadArchivos(historia,id_archivo,token)
    .then(response => {
      console.log(response)
      ReadBase64(response)
    })
    .catch(error => {
      throw new Error('Network response was not ok.', error);
    }); 
  };


  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg overflow-hidden shadow-xl w-[90%]">
        <div className="px-4 py-2 naranjabackgroud flex justify-between ">
          <h2 className="text-lg font-bold color-blanco">Historial Paciente</h2>
          <button onClick={closeModal} className="text-xl text-white" style={{ fontSize: '23px' }}>×</button>
        </div>
        <div className="px-6 py-4 overflow-y-auto flex flex-wrap ">
          <div className="w-full md:w-1/6 mb-4">
            <span>DNI : </span><div className="bg-gray-200 rounded px-2 py-1 inline-block"><strong>{dni}</strong></div>
          </div>
          <div className="w-full md:w-1/2 mb-4">
            <span>Paciente : </span><div className="sombreado-verde rounded px-2 py-1 inline-block"><strong>{nombre}</strong></div>
          </div>
          {loading ? (
            <p className="text-center">Cargando...</p>
          ) : (
              <table className="w-full border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-2 py-1 text-center">Acción</th>
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
                    <th className="border border-gray-300 px-2 py-1 text-center">Archivos</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((dataItem, dataIndex) => (
                    <tr key={dataIndex}>
                      <td className="border border-gray-300 px-2 py-1">
                        <div className="flex flex-col">
                          {listarchivos.map((archivoItem, archivoIndex) => (
                            <div className="flex items-center" onClick={() => { openModalArchivos(archivoItem.id, archivoItem.nombre, archivoItem.extension, archivoItem.codigo, dataItem.historiaClinica, dataItem.orden) }} key={archivoIndex}>
                                <FontAwesomeIcon icon={faArrowUp} className="cursor-pointer" style={{ color: archivoItem.codigo }} />
                              <div className="text-xs cursor-pointer ml-2" >Subir {archivoItem.nombre}</div>
                            </div>
                          ))}
                        </div>
                      </td>
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
                      <td className="border border-gray-300 px-2 py-1">
                        {read.map((readItem, readIndex) => ( 
                          <a key={readIndex} className='cursor-pointer' title={readItem.nombreArchivo}  onClick={() => {GetBase64(dataItem.historiaClinica,readItem.id_tipo_archivo)}}>
                            {filterArchivos(readItem)}
                          </a>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
        </div>
      </div>

      {modalArchivos && (
        <ModalUpload closeModal={closeModal} id={idarchivo} nombre={nombrearc} extension={extension} color={color} historiaClinica={historiaClinica} orden={orden} dni={dni} user={user} token={token} />
      )}

    </div>
  );
};


export default Modal;
