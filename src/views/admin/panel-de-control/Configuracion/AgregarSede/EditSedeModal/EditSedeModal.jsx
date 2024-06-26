import React, { useState } from 'react';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { editSede } from '../../model/AdministrarSedes';
import Swal from 'sweetalert2';
const EditSedeModal = ({ setShowEditModal, Refresgpag, token, item,userlogued }) => {
  const [creating, setCreating] = useState(false);
  const [datosEditados, setDatosEditados] = useState({
    id: item.id,
    nombre: item.nombreSede,
    codigo: item.codigoSede,
    capacidadPaciente: item.capacidadPaciente,
    estado: item.estado,
    fechaRegistro: item.fechaRegistro,
    userRegistro: item.userRegistro
  });
  
  const handleChange = e => {
    const { name, value, } = e.target;
    const capitalizedValue = value.toUpperCase();
    setDatosEditados({
      ...datosEditados,
      [name]: capitalizedValue,
    });
  };
  
  const handleChangeStado = e => {
    const { name,checked } = e.target;
    setDatosEditados({
      ...datosEditados,
      [name]: checked,
    });
  };

  function AleertSucces() {
    Swal.fire({
      title: "¡Exito!",
      text: "Se ha Editado la Sede!",
      icon: "success",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Aceptar"
    }).then((result) => {
      if (result.isConfirmed) {
        setShowEditModal()
        Refresgpag()
      }
    });
  }

  const errorAlert = (title, text, icon) => {
    Swal.fire({
      title: title,
      text: text,
      icon: icon,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Aceptar"
    });
  };

  const handleEdit = (e) => {
    e.preventDefault();
    
    if (!datosEditados.nombre || !datosEditados.codigo || !datosEditados.capacidadPaciente) {
      let errorMessage = 'Por favor, complete los siguientes campos:';
      if (!datosEditados.nombre) errorMessage += '\n- Nombre';
      if (!datosEditados.codigo) errorMessage += '\n- Código';
      if (!datosEditados.capacidadPaciente) errorMessage += '\n- Capacidad';
      errorAlert('Error', errorMessage, 'error');
      return;
    }
  
    setCreating(true)
    
    editSede(datosEditados,userlogued,token)
    .then(data => {
      AleertSucces()
    })
    .catch(error => {
      console.error('Error:', error)
      errorAlert('Error', 'Ha ocurrido un error al crear la sede', 'error');
    })    
    .finally(() => {
      setCreating(false)
    })
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
      <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-md w-[400px] relative">
        <div className="px-4 py-2 azuloscurobackground flex justify-between items-center">
          <h2 className="text-white font-bold">Editar Sede</h2>
          <FontAwesomeIcon icon={faTimes} className="cursor-pointer text-white" onClick={() => setShowEditModal(false)} />
        </div>
        <div className="p-4">
          <label className="block mb-2">
            Nombre:
            <input type="text" name='nombre' className="border border-gray-300 rounded-md px-2 py-1 w-full" value={datosEditados.nombre} onChange={handleChange} />
          </label>
          <label className="block mb-2 mt-4">
            Código:
            <input type="text" name='codigo' maxLength={4} className="border border-gray-300 rounded-md px-2 py-1 w-full" value={datosEditados.codigo} onChange={handleChange} />
          </label>
          <label className="block mb-2 mt-4">
            Capacidad:
            <input type="text" name='capacidad' className="border border-gray-300 rounded-md px-2 py-1 w-full" value={datosEditados.capacidadPaciente} 
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, ''); // Remover caracteres no numéricos
              if (value.length <= 8) {
                setDatosEditados({
                  ...datosEditados,
                  capacidadPaciente: value
                });
              }}} />
          </label>
          <div className="mb-4 mt-4">
            <label htmlFor="estado" className="block text-sm font-medium text-gray-700">Estado</label>
            <input
                type="checkbox"
                name='estado'
                id="activo"
                checked={datosEditados.estado}
                onChange={handleChangeStado}
                className=" pointer form-checkbox text-blue-500 focus:ring-blue-500 h-6 w-6 bg-white"
                required
              />
          </div>
          <div className='flex justify-end mt-3'>
            <button onClick={handleEdit} disabled={creating} className=" azul-btn font-bold py-2 px-4 rounded">{creating ? 'Editando Sede...' : 'Editar Sede'}</button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default EditSedeModal;
