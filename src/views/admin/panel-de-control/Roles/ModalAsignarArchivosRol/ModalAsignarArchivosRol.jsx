import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { getFetch } from '../../getFetch/getFetch';
import { AsignedArchivoxRol, DeleteAsignedArchivoxRol } from '../model/AsingArchivoxRol';
import Swal from 'sweetalert2';

const ModalArchivo = ({ closeModal, id_rol, token, userlogued, Nombre }) => {
  const [data, setData] = useState([]);
  const [archivos, setArchivos] = useState([]); // Todos los archivos disponibles
  const [archivosDisponibles, setArchivosDisponibles] = useState([]); // Archivos filtrados
  const [archivosSeleccionados, setArchivosSeleccionados] = useState([]); // Archivos seleccionados con checkbox
  const [estado, setEstado] = useState(true);
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refres, setRefresh] = useState(0);
  const [selectAll, setSelectAll] = useState(false); // Estado para "Seleccionar todos"

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getFetch(`/api/v01/ct/tipoArchivoAsignado/busquedaTipoArchivoAsignadoPorIdRol/${id_rol}`, token),
      getFetch('/api/v01/ct/tipoArchivo', token)
    ])
    .then(([Archivos_assigned, ListArchivos]) => {
      setData(Archivos_assigned);
      setArchivos(ListArchivos);
      filtrarArchivosNoAsignados(Archivos_assigned, ListArchivos);
    })
    .catch(error => {
      throw new Error('Network response was not ok.', error);
    })
    .finally(() => {
      setLoading(false);
    });
  }, [refres]);

  const filtrarArchivosNoAsignados = (asignados, todosArchivos) => {
    const asignadosIds = asignados.map(item => item.idTipoArchivoAsignar);
    const noAsignados = todosArchivos.filter(archivo => !asignadosIds.includes(archivo.id));
    setArchivosDisponibles(noAsignados);
  };

  const AleertSucces = () => {
    Swal.fire({
      title: "¡Exito!",
      text: "Archivos asignados correctamente!",
      icon: "success",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Aceptar"
    }).then((result) => {
      if (result.isConfirmed) {
        Refresgpag();
      }
    });
  };

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
      text: "No puedes revertir esta acción!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar!"
    }).then((result) => {
      if (result.isConfirmed) {
        DeleteAsignedArchivoxRol(id, token)
          .then(() => {
            Swal.fire({
              title: "Eliminado!",
              text: "La asignación ha sido eliminada!.",
              icon: "success"
            }).then((result) => {
              if (result.isConfirmed) Refresgpag();
            });
          })
          .catch(() => {
            Swal.fire({
              title: "Error!",
              text: "La asignación no se ha podido eliminar!",
              icon: "error"
            });
          });
      }
    });
  };

  const Refresgpag = () => {
    setRefresh(refres + 1);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setCreating(true);
    if (archivosSeleccionados.length === 0) {
      showAlert('Error', 'Por favor, seleccione al menos un archivo.', 'error');
      setCreating(false);
      return;
    }
    
    // Asignar varios archivos seleccionados
    Promise.all(
      archivosSeleccionados.map(idArchivo => {
        const datos = {
          RolPadre: id_rol,
          idArchivo,
          estado: estado
        };
        return AsignedArchivoxRol(datos, userlogued, token);
      })
    )
    .then(() => {
      AleertSucces();
    })
    .catch(error => {
      console.error('Error:', error);
      showAlert('Error', 'No se pudieron asignar todos los archivos.', 'error');
    })
    .finally(() => {
      setCreating(false);
    });
  };

  const handleCheckboxChange = (e, idArchivo) => {
    if (e.target.checked) {
      setArchivosSeleccionados([...archivosSeleccionados, idArchivo]);
    } else {
      setArchivosSeleccionados(archivosSeleccionados.filter(id => id !== idArchivo));
    }
  };

  // Manejar "Seleccionar todos"
  const handleSelectAllChange = (e) => {
    const isChecked = e.target.checked;
    setSelectAll(isChecked);

    if (isChecked) {
      // Si se selecciona "Seleccionar todos", agregar todos los archivos
      const allIds = archivosDisponibles.map(item => item.id);
      setArchivosSeleccionados(allIds);
    } else {
      // Si se desmarca "Seleccionar todos", vaciar la selección
      setArchivosSeleccionados([]);
    }
  };

  // Mensaje de conteo de archivos asignados
  const totalArchivos = archivos.length;
  const archivosAsignados = data.length;

  const mensajeArchivos = archivosAsignados === totalArchivos
    ? `Todos los archivos asignados (${archivosAsignados}/${totalArchivos})`
    : `Tienes ${archivosAsignados} de ${totalArchivos} archivos asignados`;

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
      <div className="mx-auto bg-white rounded-lg shadow-lg w-[900px] relative">
        {/* Botón para cerrar */}
        <FontAwesomeIcon
          icon={faTimes}
          className="absolute top-0 right-3 m-3 cursor-pointer text-white"
          onClick={closeModal}
          style={{fontSize:'15px'}}
        />
        
        {/* Encabezado */}
        <div className="bg-[#233245] text-white text-center p-3 rounded-t-lg shadow-sm">
          <h1 className="font-bold text-lg">Asignar Archivos por Rol a {Nombre}</h1>
        </div>
        
        <div className="p-6 bg-gray-100">
          {/* Contenedor de dos columnas */}
          <div className="grid grid-cols-2 gap-4">
            {/* Columna izquierda: Archivos disponibles */}
            <div className="bg-white p-4 shadow-md rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">Archivos Disponibles:</label>
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-blue-500 pointer"
                  onChange={handleSelectAllChange}
                  checked={selectAll}
                />
                <label className="ml-2 text-sm font-bold">Seleccionar todos</label>
              </div>
              <div className="border border-gray-300 p-2 rounded-md h-[200px] overflow-y-auto">
                {archivosDisponibles?.map((item) => (
                  <div key={item.id} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-blue-500 pointer"
                      checked={archivosSeleccionados.includes(item.id)}
                      onChange={(e) => handleCheckboxChange(e, item.id)}
                    />
                    <label className="ml-2 text-sm">{item.nombre}</label>
                  </div>
                ))}
              </div>
              {/* Mensaje con el número de archivos asignados */}
              <p className="text-sm fw-bold text-red-500 mt-2">{mensajeArchivos}</p>
            </div>

            {/* Columna derecha: Archivos asignados */}
            <div className="bg-white p-4 shadow-md rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">Archivos Asignados:</label>
              {loading ? (
                <p className="text-center text-gray-500">Cargando...</p>
              ) : (
                <div className="overflow-y-auto max-h-[240px]">
                  <table className="w-full text-left border border-gray-200 rounded-lg">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border-b border-gray-300 px-4 py-2 font-medium">Archivo</th>
                        <th className="border-b border-gray-300 px-4 py-2 font-medium">Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data?.map((item, index) => {
                        const dataRole = archivos.find(role => role.id === item.idTipoArchivoAsignar);
                        return (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="border-b border-gray-300 px-4 py-2">{dataRole?.nombre}</td>
                            <td className="border-b border-gray-300 px-4 py-2 text-center">
                              <FontAwesomeIcon icon={faTrashAlt} className="text-red-500 cursor-pointer hover:text-red-700" onClick={() => deleteArchivoAsigned(item.idTipoArchivoAsignado)} />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
          
          {/* Botón de guardar */}
          <div className="flex justify-end mt-4">
            <button disabled={creating} className="bg-[#fc6b03] text-white font-bold py-2 px-4 rounded-lg transition duration-300" onClick={handleSubmit}>
              Guardar datos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalArchivo;
