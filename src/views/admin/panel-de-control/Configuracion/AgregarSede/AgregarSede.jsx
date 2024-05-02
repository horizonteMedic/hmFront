import React, { useState } from 'react';
import RuterConfig from '../RuterConfig';
import NewSede from './model/NewSede';
import { useAuthStore } from '../../../../../store/auth';
import { Loading } from '../../../../components/Loading';
import Swal from 'sweetalert2';

const AgregarSede = () => {
  const [nombre, setNombre] = useState('')
  const [codigo, setCodigo] = useState('')
  const [estado, setEstado] = useState(true); // Estado por defecto
  const [loading, setLoading] = useState(false)
  const token = useAuthStore(state => state.token);
  const userlogued = useAuthStore(state => state.userlogued);

  function AleertSucces() {
    Swal.fire({
      title: "¡Exito!",
      text: "Se ha creado una nueva Sede",
      icon: "success",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Aceptar"
    }).then((result) => {
      if (result.isConfirmed) {
       window.location.reload()
      }
    });
  }

  const handleSubmit = async (event) => {
    setLoading(true)
    event.preventDefault();
    NewSede(nombre,codigo,estado,token,userlogued.sub)
      .then(data => {
        AleertSucces()
      })
      .catch(error => {
        console.error('Error:', error)
      })
      .finally(() => {setLoading(false)})
  };

  

  return (
    <div className="container mx-auto mt-12 mb-12">
      <RuterConfig /> 
      <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-xl  w-[90%]">
        <div className="px-4 py-2 azuloscurobackground flex justify-between ">
          <h1 className="text-center text-start font-bold color-azul text-white">Agregar Sede</h1>
        </div>
        <div className='container p-6'>
          <div className="mb-4">
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
              Nombre:
            </label>
            <input
              id="nombre"
              name="nombre"
              onChange={(e) => setNombre(e.target.value)}
              type="text"
              className="border mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              placeholder="Ingrese el nombre de la sede"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="codigo" className="block text-sm font-medium text-gray-700">
              Código:
            </label>
            <input
              id="codigo"
              name="codigo"
              type="text"
              maxLength={4}
              onChange={(e) => {
                const inputValue = e.target.value.slice(0, 4); // Limitar el valor a 4 caracteres
                setCodigo(inputValue);
              }}              
              className="border mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              placeholder="Ingrese el código de la sede"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="estado" className="block text-sm font-medium text-gray-700">
              Estado:
            </label>
            <div className="mt-1">
              <input
                type="checkbox"
                id="estado"
                name="estado"
                className="pointer focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                checked={estado}
                onChange={(e) => setEstado(e.target.checked)} 
              />
              <span className="ml-2 text-sm text-gray-600">Activo</span>
            </div>
          </div>
          <button onClick={handleSubmit} className="azul-btn font-bold py-2 px-4 rounded">
            Registrar Sede
          </button>
        </div>
      </div>
      {loading && <Loading/>}
    </div>
  );
};

export default AgregarSede;
