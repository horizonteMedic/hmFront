import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { editEmpresa } from '../../model/AdministrarEmpresas';
import Swal from 'sweetalert2';

const EditModal = ({ setShowEditModal,Refresgpag,ruc,token, razon,direccion,telefono,responsable, email }) => {
  
  const [creating, setCreating] = useState(false);
  const [arazonSocial, setRazonSocial] = useState(razon);
  const [adireccion, setDireccion] = useState(direccion);
  const [atelefono, setTelefono] = useState(telefono);
  const [aresponsable, setResponsable] = useState(responsable);
  const [aemail, setEmail] = useState(email);
 
  function AleertSucces() {
    Swal.fire({
      title: "¡Exito!",
      text: "Se ha editado la Empresa",
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

  const handleSaveEmpresa = () => {
    setCreating(true)
    editEmpresa (ruc,arazonSocial,adireccion,atelefono,aresponsable,aemail,token)
        .then(data => {
          AleertSucces()
        })
        .catch(error => {
          console.error('Error', error);
        })
        .finally(() =>{
            setCreating(false)
        })
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-md w-[400px] relative">
        <FontAwesomeIcon
          icon={faTimes}
          className="absolute top-0 right-0 m-3 cursor-pointer color-blanco"
          onClick={() => setShowEditModal(false)}
        />
        <div className="p azuloscurobackground flex justify-between p-3.5">
          <h1 className="text-start font-bold color-azul text-white">Editar Empresa</h1>
        </div>
        <div className='container p-4'>
          <form className="mt-4">
            <div className="mb-4">
              <label htmlFor="razonSocial" className="block text-sm font-medium text-gray-700">Razón Social</label>
              <input type="text" value={arazonSocial}
              onChange={(e) => setRazonSocial(e.target.value.toUpperCase())} id="razonSocial" name="razonSocial" className="border border-gray-300 rounded-md px-3 py-2 w-full" />
            </div>
            <div className="mb-4">
              <label htmlFor="direccion" className="block text-sm font-medium text-gray-700">Dirección</label>
              <input type="text" id="direccion" value={adireccion}
              onChange={(e) => setDireccion(e.target.value.toUpperCase())} name="direccion" className="border border-gray-300 rounded-md px-3 py-2 w-full" />
            </div>
            <div className="mb-4">
              <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">Teléfono</label>
              <input type="text" id="telefono" value={atelefono}
              onChange={(e) => setTelefono(e.target.value)} name="telefono" className="border border-gray-300 rounded-md px-3 py-2 w-full" />
            </div>
            <div className="mb-4">
              <label htmlFor="responsable" className="block text-sm font-medium text-gray-700">Responsable</label>
              <input type="text" id="responsable" value={aresponsable}
              onChange={(e) => setResponsable(e.target.value.toUpperCase())} name="responsable" className="border border-gray-300 rounded-md px-3 py-2 w-full" />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" id="email" value={aemail}
              onChange={(e) => setEmail(e.target.value.toUpperCase())} name="email" className="border border-gray-300 rounded-md px-3 py-2 w-full" />
            </div>
            <div className="flex justify-end">
              <button type="button"
               disabled={creating}
               className="azul-btn px-4 py-2 rounded-md" 
               onClick={handleSaveEmpresa}>{creating ? 'Editando Empresa...' : 'Editar'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
