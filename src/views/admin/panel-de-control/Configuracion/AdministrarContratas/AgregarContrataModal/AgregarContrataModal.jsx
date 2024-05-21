import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { registrarContrata } from '../../model/AdministrarContrata';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
const AgregarContrataModal = ({ setShowModal,Refresgpag,token }) => {

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
      text: "Se ha creado una Nueva Contrata",
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

  const handleSaveContrata = () => {
    if (!ruc || !razonSocial || !direccion || !telefono || !responsable || !email) {
      let errorMessage = 'Por favor, complete los siguientes campos:';
      if (!ruc) errorMessage += '\n- RUC';
      if (!razonSocial) errorMessage += '\n- Razón Social';
      if (!direccion) errorMessage += '\n- Dirección';
      if (!telefono) errorMessage += '\n- Teléfono';
      if (!responsable) errorMessage += '\n- Responsable';
      if (!email) errorMessage += '\n- Email';

      Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Aceptar'
      });
      return;
    }

    setCreating(true);
    registrarContrata(ruc, razonSocial, direccion, telefono, responsable, email, token)
      .then(() => {
        AleertSucces();
      })
      .catch((error) => {
        console.error('Error', error);
        Swal.fire({
          title: 'Error',
          text: 'Ha ocurrido un error al crear la contrata',
          icon: 'error',
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Aceptar'
        });
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
          <h1 className="text-start font-bold color-azul text-white">Agregar Nueva Contrata</h1>
        </div>
        <div className="container p-4">
          <form>
            <div className="mb-4">
              <label htmlFor="ruc" className="block  ">RUC</label>
              <input
                type="text"
                id="ruc"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={ruc}
                onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, ''); // Remover caracteres no numéricos
                        if (value.length <= 20) {
                          setRuc(value);
                        }}}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="razonSocial" className="block  ">Razon Social</label>
              <input
                type="text"
                id="razonSocial"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={razonSocial}
                onChange={(e) => setRazonSocial(e.target.value.toUpperCase())}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="direccion" className="block  ">Dirección</label>
              <input
                type="text"
                id="direccion"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value.toUpperCase())}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="telefono" className="block   ">Telefono</label>
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
              <label htmlFor="responsable" className="block">Responsable</label>
              <input
                type="text"
                id="responsable"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={responsable}
                onChange={(e) => setResponsable(e.target.value.toUpperCase())}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block ">Email</label>
              <input
                type="email"
                id="email"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value.toUpperCase())}
              />
            </div>
          </form>
          <div className="flex justify-end mt-4">
            <button onClick={handleSaveContrata} disabled={creating} className="azul-btn text-white font-bold py-2 px-4 rounded">{creating ? 'Creando Contrata...' : 'Registar'}</button>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default AgregarContrataModal;
