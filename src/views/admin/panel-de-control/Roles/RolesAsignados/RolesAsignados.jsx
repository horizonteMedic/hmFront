import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { AsignedRolxRol, DeleteAsignedRolxRol } from '../model/AsingRolxRol';
import Swal from 'sweetalert2';
import { getFetch } from '../../getFetch/getFetch';

const ModalRolesAsignados = ({ closeModal, data, id,userlogued,token, Nombre }) => {
  
  const [listRol, setListRol] = useState(data)
  const [dataAsigned, setDataAsigned] = useState([])

  const [rolhijo, setRolhijo] = useState('')
  const [estado, setEstado] = useState(true)
  const [creating, setCreating] = useState(false)
  const [loading, setLoading] = useState(false)
  const [refres, setRefresh] = useState(0)

  useEffect(() => {
    setLoading(true)
    getFetch(`/api/v01/ct/rolAsignado/busquedaRolesPorIdRol/${id}`, token)
    .then(response => {
      setDataAsigned(response)
    })
    .catch(error => {
      throw new Error('Network response was not ok.',error);
    })
    .finally(() => {
      setLoading(false)
    })
  },[refres])

  const Refresgpag = () => {
    setRefresh(refres + +1)
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
  
  const handlesubmit = (event) => {
    event.preventDefault();
    setCreating(true)
    if (!rolhijo) {
      showAlert('Error', 'Por favor, complete todos los campos.', 'error');
      return;
    }
  
    const datos = {
      RolPadre: id,
      RolHijo: rolhijo,
      estado: estado
    }
    
    AsignedRolxRol(datos,userlogued,token)
      .then(data => {
        AleertSucces()
      })
      .catch(error => {
        console.error('Error:', error)
      })
      .finally(() => {
        setCreating(false)
      })
  }

  const deleteRol = (id) => {
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
        DeleteAsignedRolxRol(id,token)
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

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
      <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-md w-[400px] relative">
        <FontAwesomeIcon
          icon={faTimes}
          className="absolute top-0 right-0 m-3 cursor-pointer color-blanco"
          onClick={closeModal}
        />
        <div className="p azuloscurobackground flex justify-between p-3.5">
          <h1 className="text-start font-bold color-azul text-white">Asignar Roles a: {Nombre}</h1>
        </div>
        <div className='container p-4'>
          <div className="mb-4">
            <label htmlFor="roles" className="block text-sm font-medium text-gray-700 mb-1">Mostrar todos los roles:</label>
            <select id="roles" name="roles" onChange={(e) => {setRolhijo(e.target.value)}} className="pointer border border-gray-300 rounded-md px-3 py-1 w-full">
              <option value="todos">Todos los roles</option>
              {listRol?.map((item) => (
                <option key={item.idRol} value={item.idRol}>{item.nombre}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">Estado:</label>
            <div className="flex items-center">
              <input id="estado" name="estado" type="checkbox" checked={estado} onChange={(e) => setEstado(e.target.checked)} className="pointer form-checkbox h-5 w-5 text-purple-500" />
              <label htmlFor="estado" className="ml-2 text-sm text-gray-700">Activo</label>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button className="azul-btn font-bold py-2 px-4 rounded" disabled={creating} onClick={handlesubmit}>
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
                  <th className="border border-gray-300 px-2 py-1">Rol</th>
                  <th className="border border-gray-300 px-2 py-1">Acción</th>
                </tr>
              </thead>
              <tbody>
              {dataAsigned?.map((item, index) => {
               
                const dataRole = data.find(role => role.idRol === item.idRolAsignar);
                return (
                <tr key={index}>
                  <td className="border border-gray-300 px-2 py-1">{dataRole.nombre}</td>
                  <td className="border border-gray-300 px-2 py-1 text-center">
                      <FontAwesomeIcon icon={faTrashAlt} className="text-red-500 pointer" onClick={() =>{deleteRol(item.idRolAsignado)}}/>
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

export default ModalRolesAsignados;
