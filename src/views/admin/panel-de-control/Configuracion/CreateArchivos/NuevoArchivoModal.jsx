import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import NewwTipoArchivo from './model/registroArchivo';
import Swal from 'sweetalert2';

// Componente NuevoArchivoModal mejorado
const NuevoArchivoModal = ({ CerrarModal, Refresgpag, token, userlogued }) => {
  const [nombre, setNombre] = useState('');
  const [extension, setExtension] = useState('');
  const [color, setColor] = useState('');
  const [codigo, setCodigo] = useState('');
  const [estado, setEstado] = useState(true);
  const [creating, setCreating] = useState(false);
  const extensiones = [  'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'jpg', 'jpeg', 'png', 'gif', 'mp3', 'mp4', 'avi', 'mov',  'zip',  'rar', '7z',
];


  function AlertSuccess() {
    Swal.fire({
      title: '¡Éxito!',
      text: 'Se ha creado un Nuevo Tipo de Archivo.',
      icon: 'success',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if (result.isConfirmed) {
        CerrarModal();
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

  const handleColor = (e) => {
    const selectedColor = colores.find((color) => color.nombre === e.target.value);
    if (selectedColor) {
      setColor(selectedColor.nombre);
      setCodigo(selectedColor.codigo);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre || !extension || !color || !codigo) {
      Swal.fire({
        title: '¡Error!',
        text: 'Por favor, complete todos los campos.',
        icon: 'error',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Aceptar'
      });
      return;
    }
  
    setCreating(true);
    NewwTipoArchivo(nombre, extension, color, codigo, estado, userlogued, token)
      .then(() => AlertSuccess())
      .catch((error) => console.error('Error:', error))
      .finally(() => setCreating(false));
  };
  

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-md w-[400px] relative">
        <FontAwesomeIcon
          icon={faTimes}
          className="absolute top-0 right-0 m-3 cursor-pointer text-white "
          onClick={CerrarModal}
        />
        <div className="p-3 azuloscurobackground flex justify-between">
          <h1 className="text-start font-bold color-azul text-white">Crear Nuevo Archivo</h1>
        </div>
        <div className="container p-4">
          <form>
            <div className="mb-4">
              <label htmlFor="nombre" className="block ">
                Nombre:
              </label>
              <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                type="text"
                className="border mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500  rounded-md"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="extension" className="block">
                Extensión:
              </label>
              <select
                value={extension}
                onChange={(e) => setExtension(e.target.value)}
                className="border mt-1 block w-full pl-3 pr-10 py-2 pointer text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
              >
                <option value="seleccione">Seleccione...</option>
                {extensiones.map((ext) => (
                  <option key={ext} value={ext}>
                    {ext}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="codigo" className="block">
                Color:
              </label>
              <select
                onChange={handleColor}
                className="border mt-1 block w-full pl-3 pr-10 py-2 pointer text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
              >
                <option value="seleccione">Seleccione...</option>
                {colores.map((option) => (
                  <option key={`${option.nombre}-${option.codigo}`} value={option.nombre}>
                    {option.nombre}
                  </option>
                ))}
              </select>
              <div className="flex justify-center">
                <div className="mt-2 w-12 h-12" style={{ background: `${codigo}` }} />
              </div>
            </div>
            <div className="mb-4">
              <label className="block">Estado:</label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 pointer text-blue-600"
                  checked={estado}
                  onChange={(e) => setEstado(e.target.checked)}
                />
                <label htmlFor="estado" className="ml-2 ">
                  Activo
                </label>
              </div>
            </div>
            <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse ">
              <button
                onClick={handleSubmit}
                disabled={creating}
                type="submit"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 azul-btn focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                {creating ? 'Creando Archivo...' : 'Crear Archivo'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NuevoArchivoModal;
