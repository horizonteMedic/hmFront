import React, { useState } from 'react';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const EditSedeModal = ({ setShowEditModal, Refresgpag, token, nombre, codigo, estado, fecha, responsable }) => {
  const [newNombre, setNewNombre] = useState(nombre);
  const [newCodigo, setNewCodigo] = useState(codigo);
  const [newEstado, setNewEstado] = useState(estado);
  const [newFecha, setNewFecha] = useState(fecha);
  const [newResponsable, setNewResponsable] = useState(responsable);

  const handleEdit = () => {
    // Aquí debes implementar la lógica para editar la sede
    // Por ejemplo, llamar a una función que envíe los datos al servidor
    // y luego cerrar el modal y refrescar la página
    // Puedes usar Refresgpag() para refrescar la página después de editar
    // y setShowEditModal(false) para cerrar el modal
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
      <div className="bg-white rounded-lg overflow-hidden shadow-xl w-96">
        <div className="px-4 py-2 flex justify-between items-center azuloscurobackground">
          <h2 className="text-white font-bold">Editar Sede</h2>
          <FontAwesomeIcon icon={faTimes} className="cursor-pointer text-white" onClick={() => setShowEditModal(false)} />
        </div>
        <div className="p-4">
          <label className="block mb-2">
            Nombre:
            <input type="text" className="border border-gray-300 rounded-md px-2 py-1 w-full" value={newNombre} onChange={(e) => setNewNombre(e.target.value)} />
          </label>
          <label className="block mb-2">
            Código:
            <input type="text" className="border border-gray-300 rounded-md px-2 py-1 w-full" value={newCodigo} onChange={(e) => setNewCodigo(e.target.value)} />
          </label>
          <label className="block mb-2">
            Estado:
            <input type="text" className="border border-gray-300 rounded-md px-2 py-1 w-full" value={newEstado} onChange={(e) => setNewEstado(e.target.value)} />
          </label>
          <label className="block mb-2">
            Fecha:
            <input type="text" className="border border-gray-300 rounded-md px-2 py-1 w-full" value={newFecha} onChange={(e) => setNewFecha(e.target.value)} />
          </label>
          <label className="block mb-2">
            Responsable:
            <input type="text" className="border border-gray-300 rounded-md px-2 py-1 w-full" value={newResponsable} onChange={(e) => setNewResponsable(e.target.value)} />
          </label>
          <div className='flex justify-end mt-3'>
            <button onClick={handleEdit} className=" azul-btn font-bold py-2 px-4 rounded">Guardar Cambios</button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default EditSedeModal;
