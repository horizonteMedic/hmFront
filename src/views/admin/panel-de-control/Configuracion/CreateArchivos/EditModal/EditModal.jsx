import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { EditArchivo } from '../model/EditArchivos';

const EditModal = ({ setShowEditModal, archivo, Refresgpag, token, userlogued }) => {
  const [datosEditados, setDatosEditados] = useState({
    id: archivo.id,
    nombre: archivo.nombre,
    extension: archivo.extension,
    color: archivo.color,
    codigo: archivo.codigo,
    estado: archivo.estado,
    fechaRegistro: archivo.fechaRegistro,
    userRegistro: archivo.userRegistro
  });
  const [creating, setCreating] = useState(false);

  function AleertSucces() {
    Swal.fire({
      title: "¡Éxito!",
      text: "Se ha editado el Tipo de Archivo.",
      icon: "success",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Aceptar"
    }).then((result) => {
      if (result.isConfirmed) {
        setShowEditModal();
        Refresgpag();
      }
    });
  }

  const colores = [
    { nombre: 'Negro', codigo: '#000000' },
    { nombre: 'Rojo', codigo: '#FF0000' },
    { nombre: 'Verde', codigo: '#00FF00' },
    { nombre: 'Azul', codigo: '#0000FF' },
    { nombre: 'Amarillo', codigo: '#FFFF00' },
    { nombre: 'Cyan', codigo: '#00FFFF' },
    { nombre: 'Magenta', codigo: '#FF00FF' },
    { nombre: 'Gris', codigo: '#808080' },
    { nombre: 'Marrón', codigo: '#A52A2A' },
    { nombre: 'Oro', codigo: '#FFD700' },
    { nombre: 'Plata', codigo: '#C0C0C0' },
    { nombre: 'Verde lima', codigo: '#00FF00' },
    { nombre: 'Azul cielo', codigo: '#87CEEB' },
    { nombre: 'Rosado', codigo: '#FFC0CB' }
  ];

  const handleChange = e => {
    const { name, value } = e.target;
    const capitalizedValue = value.replace(/\b\w/g, char => char.toUpperCase());
    setDatosEditados({
      ...datosEditados,
      [name]: capitalizedValue,
    });
  };
  
  const handleColor = (e) => {
    const selectedColor = colores.find(colores => colores.nombre === e.target.value);
    if (selectedColor) {
      setDatosEditados({
        ...datosEditados,
        color: selectedColor.nombre,
        codigo: selectedColor.codigo,
      });
    } 
  };

  const handleSubmit = e => {
    setCreating(true);
    e.preventDefault();
    EditArchivo(datosEditados, userlogued, token)
    .then(data => {
      AleertSucces();
    })
    .catch(error => {
      console.error('Error:', error);
    })    
    .finally(() => {
      setCreating(false);
    });
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-md w-[400px] relative">
        <FontAwesomeIcon
          icon={faTimes}
          className="absolute top-0 right-0 m-3 cursor-pointer text-white"
          onClick={() => setShowEditModal(false)}
        />
        <div className="p-3 azuloscurobackground flex justify-between">
          <h1 className="text-start font-bold color-azul text-white">Editar Archivo</h1>
        </div>
        <div className='container p-4'>
          <form>
            <div className="mb-4">
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre:</label>
              <input type="text" id="nombre" name="nombre" value={datosEditados.nombre} onChange={handleChange} className="pointer mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div className="mb-4">
              <label htmlFor="extension" className="block text-sm font-medium text-gray-700">Extensión:</label>
              <input type="text" id="extension" name="extension" value={datosEditados.extension} onChange={handleChange} className="pointer mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div className="mb-4">
              <label htmlFor="color" className="block text-sm font-medium text-gray-700">Color:</label>
              <select id="color" name="color" onChange={handleColor} className="pointer mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" >
                <option value={datosEditados.color}>{datosEditados.color}</option>
                {colores.map((option) => (
                  <option key={`${option.nombre}-${option.codigo}`} value={option.nombre} >
                    {option.nombre}
                  </option>
                ))}
              </select>
              <div className='flex justify-center mt-2'>
                <div className='mt-2 w-12 h-12' style={{ background: datosEditados.codigo }} />
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="estado" className="block text-sm font-medium text-gray-700">Estado:</label>
              <input
                id="estado"
                name="estado"
                type="checkbox"
                checked={datosEditados.estado}
                onChange={() => setDatosEditados({ ...datosEditados, estado: !datosEditados.estado })}
                className="pointer mt-1 p-2 block border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={creating}
                className="px-4 py-2  rounded-md azul-btn"
              >
                {creating ? 'Editando Archivo...' : 'Editar Archivo'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
