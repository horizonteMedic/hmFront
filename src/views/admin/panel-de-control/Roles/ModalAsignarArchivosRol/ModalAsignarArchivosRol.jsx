import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { getFetch } from '../../getFetch/getFetch';
import { AsignedArchivoxRol, DeleteAsignedArchivoxRol } from '../model/AsingArchivoxRol';
import Swal from 'sweetalert2';

const ModalArchivo = ({ closeModal, id_rol, token, userlogued }) => {
  const [data, setData] = useState([]);
  const [archivos, setArchivos] = useState([]); // Estado para almacenar los archivos

  const [idarchivo, setIdarchivo] = useState('')
  const [estado, setEstado] = useState(true)
  const [creating, setCreating] = useState(false)
  const [loading, setLoading] = useState(false)
  const [refres, setRefresh] = useState(0)

  useEffect(() => {
    setLoading(true)

    Promise.all([
      getFetch(`/api/v01/ct/tipoArchivoAsignado/busquedaTipoArchivoAsignadoPorIdRol/${id_rol}`, token),
      getFetch('/api/v01/ct/tipoArchivo', token)
    ])
    .then(([Archivos_assigned, ListArchivos]) => {
        // Guarda los datos en el estado
        setData(Archivos_assigned);
        setArchivos(ListArchivos);
    })
    .catch(error => {
        throw new Error('Network response was not ok.', error);
    })
    .finally(() => {
        setLoading(false);
    });
  },[refres])

  function AleertSucces() {
    Swal.fire({
      title: "¡Exito!",
      text: "Se ha asignado correctamente!",
      icon: "success",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Aceptar"
    }).then((result) => {
      if (result.isConfirmed) {
        Refresgpag()
        
      }
    });
  }

  const showAlert = (title, text, icon) => {
    Swal.fire({
      title: title,
      text: text,
      icon: icon,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Aceptar"
    });
  };

  const deleteArchivoAsigned = (id) => {
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
        DeleteAsignedArchivoxRol(id,token)
          .then(() => {
            Swal.fire({
              title: "Eliminado!",
              text: "La Asignacion ha sido eliminada!.",
              icon: "success"
            }).then((result) => {
              if (result.isConfirmed) Refresgpag()
            });
          })
          .catch(() => {
            Swal.fire({
              title: "Error!",
              text: "La Asignacion no se ha podido Eliminar!",
              icon: "error"
            });
          });
      }
    });
  }

  const Refresgpag = () => {
    setRefresh(refres + +1)
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    setCreating(true)
    if (!idarchivo) {
      showAlert('Error', 'Por favor, complete todos los campos.', 'error');
      return;
    }
    const datos = {
      RolPadre: id_rol,
      idArchivo: idarchivo,
      estado: estado
    }
    AsignedArchivoxRol(datos,userlogued,token)
      .then(data => {
        AleertSucces()
      })
      .catch(error => {
        console.error('Error:', error)
      })
      .finally(() => {
        setCreating(false)
      })
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
    <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-md w-[400px] relative">
      <FontAwesomeIcon
        icon={faTimes}
        className="absolute top-0 right-0 m-3 cursor-pointer color-blanco"
        onClick={closeModal}
      />
      <div className="p azuloscurobackground flex justify-between p-3.5">
        <h1 className="text-start font-bold color-azul text-white">Asignar Archivos por rol</h1>
      </div>
      <div className='container p-4'>
        <div className="mb-4">
          <label htmlFor="roles" className="block text-sm font-medium text-gray-700 mb-1">Mostrar todos los Archivos:</label>
          <select onChange={(e) => {setIdarchivo(e.target.value)}} className="pointer border border-gray-300 rounded-md px-3 py-1 w-full">
            <option >Todos los archivos</option>
              {archivos?.map((item) => (
                <option key={item.id} value={item.id}>{item.nombre}</option>
              ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">Estado:</label>
          <div className="flex items-center">
            <input id="estado" name="estado" checked={estado} onChange={(e) => {setEstado(e.target.checked)}} type="checkbox"  className="pointer form-checkbox h-5 w-5 text-purple-500" />
            <label htmlFor="estado" className="ml-2 text-sm text-gray-700">Activo</label>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button disabled={creating} className="azul-btn font-bold py-2 px-4 rounded" onClick={handleSubmit} >
            Guardar datos
          </button>
        </div>
      </div>
      {loading ? (
            <p className="text-center">Cargando...</p>
        ) : (
      <div className='p-4'>
        <table className="w-full border border-gray-300 mb-4">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-2 py-1">Archivo</th>
                <th className="border border-gray-300 px-2 py-1">Acción</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((item, index) => {
                const dataRole = archivos.find(role => role.id === item.idTipoArchivoAsignar);
                return (
                <tr key={index}>
                  <td className="border border-gray-300 px-2 py-1">{dataRole.nombre}</td>
                  <td className="border border-gray-300 px-2 py-1 text-center">
                      <FontAwesomeIcon icon={faTrashAlt} className="text-red-500 pointer" onClick={() =>{deleteArchivoAsigned(item.idTipoArchivoAsignado)}}/>
                  </td>
                </tr>
                )
              })}
              </tbody>
        </table>
        
      </div>
     )}
    </div>
    
  </div>
  );
};

export default ModalArchivo;
