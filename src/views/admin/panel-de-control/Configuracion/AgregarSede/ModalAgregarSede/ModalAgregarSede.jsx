import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { registrarSede } from '../../model/AdministrarSedes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
const AgregarSedeModal = ({ setShowModal, Refresgpag, token, userlogued }) => {
  const [nombre, setNombre] = useState('');
  const [codigo, setCodigo] = useState('');
  const [estado, setEstado] = useState(true);
  const [creating, setCreating] = useState(false);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const showAlert = (title, text, icon) => {
    Swal.fire({
      title: title,
      text: text,
      icon: icon,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Aceptar"
    }).then((result) => {
      if (result.isConfirmed) {
        setShowModal();
        Refresgpag();
      }
    });
  };

  const handleSaveSede = () => {
    if (!nombre || !codigo) {
      let errorMessage = 'Por favor, complete los siguientes campos:';
      if (!nombre) errorMessage += '\n- Nombre';
      if (!codigo) errorMessage += '\n- Código';

      showAlert('Error', errorMessage, 'error');
      return;
    }
  
    setCreating(true);
    const newSede = { nombre, codigo, estado };
    registrarSede(newSede, token, userlogued)
      .then(() => {
        showAlert('¡Éxito!', 'Se ha asignado una Nueva Empresa', 'success');
      })
      .catch((error) => {
        console.error('Error', error);
        showAlert('Error', 'Ha ocurrido un error al crear la sede', 'error');
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
          className="absolute top-0 right-0 m-3 cursor-pointer text-white "
          onClick={handleCloseModal}
        />
        <div className="p-3 azuloscurobackground flex justify-between">
          <h1 className="text-start font-bold color-azul text-white">Agregar Nueva Sede</h1>
        </div>
        <div className="container p-4">
          <form>
            <div className="mb-4">
              <label htmlFor="nombre" className="block">Nombre</label>
              <input
                type="text"
                required
                id="nombre"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={nombre}
                onChange={(e) => setNombre(e.target.value.toUpperCase())}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="codigo" className="block ">Código</label>
              <input
                type="text"
                required
                maxLength={4}
                id="codigo"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.toUpperCase())}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="estado" className="block ">Estado</label>
              <input
                type="checkbox"
                id="activo"
                checked={estado}
                onChange={(e) => setEstado(e.target.checked)}
                className="pointer form-checkbox text-blue-500 focus:ring-blue-500 h-6 w-6 bg-white"
                required
              />
            </div>
          </form>
          <div className="flex justify-end mt-4">
          <button
              disabled={creating}
              onClick={handleSaveSede}
              className="azul-btn text-white font-bold py-2 px-4 rounded">
              {creating ? 'Creando Sede...' : 'Registrar'}
          </button>
        </div>

        </div>
      </div>
    </div>
  );
};

export default AgregarSedeModal;
