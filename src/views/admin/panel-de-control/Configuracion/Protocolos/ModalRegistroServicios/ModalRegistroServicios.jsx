import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faTimes} from '@fortawesome/free-solid-svg-icons';
import ModalEditarServicio from './ModalEditarServicio';

const ModalRegistroServicios = ({ setShowModalRegistroServicios }) => {
  const [servicios, setServicios] = useState([]);
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [activo, setActivo] = useState(true);
  const [nombreTabla, setNombreTabla] = useState('');
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [servicioEditar, setServicioEditar] = useState(null);

  const handleAgregarServicio = () => {
    if (!nombre.trim() || !precio.trim() || !nombreTabla.trim()) {
      Swal.fire('Error', 'Por favor, complete todos los campos', 'error');
      return;
    }

    const nuevoServicio = { nombre, precio, activo, nombreTabla };
    setServicios([...servicios, nuevoServicio]);
    setNombre('');
    setPrecio('');
    setActivo(true);
    setNombreTabla('');
  };

  const handleEliminarServicio = (index) => {
    Swal.fire({
      title: '¿Está seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedServicios = servicios.filter((servicio, i) => i !== index);
        setServicios(updatedServicios);
        Swal.fire('Eliminado', 'El servicio ha sido eliminado', 'success');
      }
    });
  };

  const handleEditarServicio = (servicio, index) => {
    setServicioEditar({ ...servicio, index });
    setShowModalEditar(true);
  };

  const handleGuardarCambios = (servicio) => {
    const updatedServicios = [...servicios];
    updatedServicios[servicio.index] = servicio;
    setServicios(updatedServicios);
    setShowModalEditar(false);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
      <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-md w-[400px] md:w-[600px] relative">
        <FontAwesomeIcon
          icon={faTimes}
          className="absolute top-0 right-0 m-3 cursor-pointer text-white"
          onClick={() => setShowModalRegistroServicios(false)}
        />
        <div className="p-3 azuloscurobackground flex justify-between">
          <h1 className="text-start font-bold color-azul text-white">Servicios Creación y Lista</h1>
        </div>
        <div className="container p-4">
          <label htmlFor="nombre" className="block font-medium mb-2">
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
         
          <label htmlFor="nombreTabla" className="block font-medium mt-4 mb-2">
            Nombre de la tabla:
          </label>
          <input
            id="nombreTabla"
            name="nombreTabla"
            type="text"
            value={nombreTabla}
            onChange={(e) => setNombreTabla(e.target.value)}
            className="border mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
            placeholder="Ingrese el nombre de la tabla"
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
            className="border mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500  rounded-md"
            placeholder="Ingrese el precio"
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
              onClick={handleAgregarServicio}
              className="mt-4 naranja-btn font-bold py-2 px-4 rounded"
            >
              Agregar
            </button>
          </div>
          <table className="w-full mt-6 border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2">Nombre</th>
                <th className="border border-gray-300 px-4 py-2">Nombre de la tabla</th>
                <th className="border border-gray-300 px-4 py-2">Precio</th>
                <th className="border border-gray-300 px-4 py-2">Estado</th>
                <th className="border border-gray-300 px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {servicios.map((servicio, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-4 py-2">{servicio.nombre}</td>
                  <td className="border border-gray-300 px-4 py-2">{servicio.nombreTabla}</td>
                  <td className="border border-gray-300 px-4 py-2">{servicio.precio}</td>
                  <td className="border border-gray-300 px-4 py-2">{servicio.activo ? 'Activo' : 'Inactivo'}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <FontAwesomeIcon
                      icon={faEdit}
                      className="text-blue-500 cursor-pointer mr-2"
                      onClick={() => handleEditarServicio(servicio, index)}
                    />
                    <FontAwesomeIcon
                      icon={faTrashAlt}
                      className="text-red-500 cursor-pointer"
                      onClick={() => handleEliminarServicio(index)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showModalEditar && (
        <ModalEditarServicio
          servicio={servicioEditar}
          onClose={() => setShowModalEditar(false)}
          onSave={handleGuardarCambios}
        />
      )}
    </div>
  );
};

export default ModalRegistroServicios;