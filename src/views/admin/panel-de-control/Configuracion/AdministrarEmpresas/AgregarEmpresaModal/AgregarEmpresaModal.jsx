import React, { useState } from 'react';
import { registrarEmpresa } from '../../model/AdministrarEmpresas';
import Swal from 'sweetalert2';
const AgregarEmpresaModal = ({ setShowModal, Refresgpag, token }) => {

  const [creating, setCreating] = useState(false);

  const [ruc, setRuc] = useState('');
  const [razonSocial, setRazonSocial] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [responsable, setResponsable] = useState('');
  const [email, setEmail] = useState('');

  const handleCloseModal = () => {
    setShowModal(false);
  };

  function AleertSucces() {
    Swal.fire({
      title: "¡Exito!",
      text: "Se ha asigando una Nueva Empresa",
      icon: "success",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Aceptar"
    }).then((result) => {
      if (result.isConfirmed) {
        handleCloseModal();
        Refresgpag();
      }
    });
  }

  const handleSaveEmpresa = () => {
    setCreating(true)
    registrarEmpresa(ruc,razonSocial,direccion,telefono,responsable,email,token)
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
    <div className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center">
      <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
      <div className="bg-white rounded-lg overflow-hidden shadow-xl max-w-md w-full p-4 relative">
        <button onClick={handleCloseModal} className="absolute top-0 right-0 m-4 text-gray-500 hover:text-gray-800">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold mb-4">Agregar Empresa</h2>
        <form>
          <div className="mb-4">
            <label htmlFor="ruc" className="block text-sm font-medium text-gray-700">RUC</label>
            <input
              type="text"
              required
              id="ruc"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={ruc}
              onChange={(e) => setRuc(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="razonSocial" className="block text-sm font-medium text-gray-700">Razon Social</label>
            <input
              type="text"
              required
              id="razonSocial"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={razonSocial}
              onChange={(e) => setRazonSocial(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="Direccion" className="block text-sm font-medium text-gray-700">Direccion</label>
            <input
              type="text"
              id="Direccion"
              required
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">Telefono</label>
            <input
              type="tel"
              id="telefono"
              maxLength="9"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="responsable" className="block text-sm font-medium text-gray-700">Responsable</label>
            <input
              type="text"
              id="responsable"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={responsable}
              onChange={(e) => setResponsable(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </form>
        <div className="flex justify-end mt-4">
          <button 
          disabled={creating}
          onClick={handleSaveEmpresa} className="azul-btn text-white font-bold py-2 px-4 rounded">{creating ? 'Creando Empresa...' : 'Registar'}</button>
        </div>
      </div>
    </div>
  );
};

export default AgregarEmpresaModal;
