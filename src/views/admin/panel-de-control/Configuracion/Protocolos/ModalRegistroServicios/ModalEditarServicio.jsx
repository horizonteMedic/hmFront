
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';


const ModalEditarServicio = ({ servicio, onClose, token, user, save,Loading,reload }) => {

    const [edits, setEdits] = useState({
      id: servicio.idServicio,
      nombre: servicio.nombreServicio,
      precio: servicio.precio,
      nombreTabla: servicio.tablaServicio,
      estado: servicio.estado,
      fechaRegistro: servicio.fechaRegistro,
      userRegistro: servicio.userRegistro

    })
    const [creating, setCreating] = useState(false)
    
    function AleertSucces() {
      Swal.fire({
        title: "¡Exito!",
        text: "Se ha Actualizado el Servicio",
        icon: "success",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Aceptar"
      }).then((result) => {
        if (result.isConfirmed) {
          reload()
          onClose()
        }
      });
    }

    const handleChange = e => {
      const { name, value } = e.target;
      setEdits({
        ...edits,
        [name]: value,
      });
    };

    const handleGuardarCambios = () => {
      if (!edits.nombre || !edits.precio || !edits.nombreTabla) {
        Swal.fire('Error', 'Por favor, complete todos los campos', 'error');
        return;
      }

      const datos = {
        id: edits.id,
        nombreServicio: edits.nombre.toUpperCase(),
        precio: edits.precio, 
        tablaServicio: edits.nombreTabla.toUpperCase(),
        estado: edits.estado,
        fechaRegistro: edits.fechaRegistro,
        userRegistro: edits.userRegistro
      }
      console.log(datos)
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
          setCreating(true)
          save(datos,user,token)
          .then(() => {
            AleertSucces()
          })
          .catch(error => {
            Swal.fire('Error', 'Ocurrio un Error al Eliminar el Servicio', 'error');
          })
          .finally(() => {
            setCreating(true);
          });
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
              value={edits.nombre}
              onChange={handleChange}
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
              value={edits.precio}
              onChange={(e) => setEdits({...edits, precio: parseFloat(e.target.value)})}
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
              value={edits.nombreTabla}
              onChange={handleChange }
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
              checked={edits.estado}
              onChange={(e) => setEdits({...edits, estado: !edits.estado})}
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
        {creating && <Loading/>}
      </div>
    );
  };
  
  export default ModalEditarServicio;
  
