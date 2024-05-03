import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';

import { GetHistoryUser } from '../model/getHistoryUser';
import { GetlistArchivos } from '../model/getlistArchivos';
import ModalUpload from '../ModalsDeSubida/ModalUpload';

const Modal = ({ closeModal, user,start,end,sede,dni,nombre,token }) => {

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false);
  const [listarchivos, setListarchivos] = useState([])

  const [modalArchivos, setModalArchivos] = useState(false);
  const [idarchivo, setIdarchivo] = useState('')
  const [nombrearc, setNombrearc] = useState('')
  const [extension, setExtension] = useState('')
  const [color, setColor] = useState('')

  //Datos para registrar archivos
  const [historiaClinica, setHistoriaClinica] = useState('')
  const [orden, setOrden] = useState('')

  const [fileData, setFileData] = useState(null);

  useEffect(() => {
    setLoading(true);
    GetHistoryUser(user, start,end,sede,dni,token)
    .then(response => {
      if (response.mensaje === 'No value present' || response.mensaje === 'Cannot invoke "java.util.List.stream()" because "listadoHP" is null') {
        console.log('no hay na');
        setData([])
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
      setListarchivos(response)
    })
    .catch(error => {
      throw new Error('Network response was not ok.', error);
    })
    
  }, [])

  const openModalArchivos = (id,nombre,extension,color,historiaClinica,orden) => {
    setIdarchivo(id)
    setNombrearc(nombre)
    setExtension(extension)
    setColor(color)
    setHistoriaClinica(historiaClinica)
    setOrden(orden)
    setModalArchivos(true);
  };

  const closeModalArchivos = () => {
    setModalArchivos(false);
  };


  const handleFileInputClick = () => {
    document.getElementById('fileInput').click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    convertFileToBase64(file);
  };

  const convertFileToBase64 = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      setFileData(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const enviarArchivo = () => {
    // Aquí puedes realizar la lógica para enviar el archivo en base64 al servidor
    console.log('Enviando archivo:', fileData);
    // Por ejemplo, puedes usar fetch para enviar el archivo
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg overflow-hidden shadow-xl w-[90%]">
        <div className="px-4 py-2 naranjabackgroud flex justify-between ">
          <h2 className="text-lg font-bold color-blanco">Historial Paciente</h2>
          <button onClick={closeModal} className="text-xl text-white" style={{ fontSize: '23px'   }}>&times;</button>
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
                <th className="border border-gray-300 px-2 py-1 text-center">Fecha apertura</th>
                <th className="border border-gray-300 px-2 py-1 text-center">Examen</th>
                <th className="border border-gray-300 px-2 py-1 text-center">Estado</th>
                <th className="border border-gray-300 px-2 py-1 text-center">Cargo</th>
                <th className="border border-gray-300 px-2 py-1 text-center">Área</th>
                <th className="border border-gray-300 px-2 py-1 text-center">Grupo sanguíneo</th>
                <th className="border border-gray-300 px-2 py-1 text-center">Archivos</th>
              </tr>
            </thead>
            <tbody>
              {data.map((dataItem, dataIndex) => (
              <tr key={dataIndex}>
                <td className="border border-gray-300 px-2 py-1">
                  <div className="flex flex-col">
                  {listarchivos.map((archivoItem, archivoIndex) => (
                    <div className="flex items-center" onClick={() => {openModalArchivos(archivoItem.id,archivoItem.nombre,archivoItem.extension,
                    archivoItem.codigo,dataItem.historiaClinica,dataItem.orden)}} key={archivoIndex}>
                      <FontAwesomeIcon icon={faArrowUp} className="cursor-pointer" style={{ color: `${archivoItem.codigo}` }}  />
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
                <td className="border border-gray-300 px-2 py-1"></td>
              </tr>
              ))}
            </tbody>
          </table>
          )}
        </div>
      </div>
      
       {/* Modal para Subir Legajo Médico */}
       {modalArchivos && (
        <ModalUpload closeModal={closeModal} id={idarchivo} nombre={nombrearc} extension={extension} color={color} historiaClinica={historiaClinica} orden={orden} dni={dni} user={user} token={token}/>
      )}

    </div>
  );
};


export default Modal;
