
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';


const ModalEditarServicio = ({ servicio, onClose, onSave }) => {
    const [nombre, setNombre] = useState(servicio.nombre);
    const [precio, setPrecio] = useState(servicio.precio);
    const [activo, setActivo] = useState(servicio.activo);
    const [nombreTabla, setNombreTabla] = useState(servicio.nombreTabla);
  
    const handleGuardarCambios = () => {
      if (!nombre.trim() || !precio.trim() || !nombreTabla.trim()) {
        Swal.fire('Error', 'Por favor, complete todos los campos', 'error');
        return;
      }
  
      Swal.fire({
        title: '¿Está seguro?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, guardar cambios',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          onSave({ ...servicio, nombre, precio, activo, nombreTabla });
          onClose();
        }
      });
    };
  
    return (
      <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-md w-[400px] relative">
          <FontAwesomeIcon
            icon={faTimes}
            className="absolute top-0 right-0 m-3 cursor-pointer text-white "
            onClick={onClose}
          />
          <div className="p-3 azuloscurobackground flex justify-between">
            <h1 className="text-start font-bold color-azul text-white">Editar Servicio</h1>
          </div>
          <div className="container p-4">
            <label htmlFor="nombre" className="block font-medium  mb-2">
              Nombre del Examen:
            </label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="border mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
              placeholder="Ingrese el nombre del examen"
            />
            <label htmlFor="precio" className="block font-medium mt-4 mb-2">
              Precio:
            </label>
            <input
              id="precio"
              name="precio"
              type="number"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              className="border mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
              placeholder="Ingrese el precio"
            />
            <label htmlFor="nombreTabla" className="block font-medium mt-4 mb-2">
              Nombre de la tabla:
            </label>
            <input
              id="nombreTabla"
              name="nombreTabla"
              type="text"
              value={nombreTabla}
              onChange={(e) => setNombreTabla(e.target.value)}
              className="border mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500  rounded-md"
              placeholder="Ingrese el nombre de la tabla"
            />
            <label htmlFor="estado" className="block font-medium mt-4 mb-2">
              Estado:
            </label>
            <input
              id="estado"
              name="estado"
              type="checkbox"
              checked={activo}
              onChange={(e) => setActivo(e.target.checked)}
              className="mr-2 pointer"
            />
            <span className="">Activo</span>
            <div>
              <button
                onClick={handleGuardarCambios}
                className="mt-4 naranja-btn  font-bold py-2 px-4 rounded"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default ModalEditarServicio;
  
