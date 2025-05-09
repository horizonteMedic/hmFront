import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { SubmitNewContrata } from './CRUD';

const ModalContrata = ({ isOpen, onClose, onSave, Swal, Get, token, GetRazonS }) => {
  const [formData, setFormData] = useState({
    ruc: '',
    razonSocial: '',
    direccion: '',
    telefonos: '',
    responsable: '',
    email: '',
  });
  const [List, setList] = useState([])
  
  useEffect(() => {
      Get(`/api/v01/ct/Contr/listadoContratas`,token)
      .then((res) => {
        setList(res)
      })
    },[])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value.toUpperCase()
    }));
  };

  const handleSubmit = (e,text) => {
      e.preventDefault();
      const camposRequeridos = ['ruc', 'razonSocial']; // agrega los campos que quieras
      const camposVacios = camposRequeridos.filter(campo => !formData[campo]);
      if (camposVacios.length > 0) {
        return Swal.fire('Error', 'Complete los campos vacíos', 'error');
      } 
      
      const datos = {
        rucContrata: formData.ruc,
        razonContrata: formData.razonSocial,
        direccionContrata: formData.direccion,
        telefonoContrata: formData.telefonos,
        responsableContrata: formData.responsable,
        emailContrata: formData.email,
        apiToken: null
      }
      SubmitNewContrata(datos, token)
      .then((res) => {
        if (res.rucContrata) {
          Swal.fire('Exito!', `Se ${text} con exito`, 'success')
        }
      })
    };
  
  const ReturnRS = (e) => {
    GetRazonS(e)
    onClose()
  }

  // Add ESC key handler
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[800px] relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-blue-600">Agregar Contrata</h2>
          <div className="text-sm text-gray-500">Agregue su Contrata y ESC para Cerrar</div>
        </div>

          <div className="grid grid-cols-[100px,1fr,200px] gap-2 items-center">
            <label className="text-right">RUC:</label>
            <input
              type="text"
              name="ruc"
              value={formData.ruc}
              onChange={handleChange}
              className="border rounded px-2 py-1"
              maxLength={11}
              required
            />
            <div className="flex gap-2 justify-end">
              <button type="submit" onClick={(e) => {handleSubmit(e,'Registro')}} className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">
                Agregar
              </button>
            </div>

            <label className="text-right">Razón Social:</label>
            <input
              type="text"
              name="razonSocial"
              value={formData.razonSocial}
              onChange={handleChange}
              className="border rounded px-2 py-1"
              required
            />
            <button type="button" onClick={(e) => {handleSubmit(e,'Actualizo')}} className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
              Actualizar
            </button>

            <label className="text-right">Dirección:</label>
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              className="border rounded px-2 py-1"
            />
            <button type="button" className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">
              Limpiar
            </button>

            <label className="text-right">Teléfonos:</label>
            <input
              type="text"
              name="telefonos"
              value={formData.telefonos}
              onChange={handleChange}
              className="border rounded px-2 py-1"
            />
            <button type="button" className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">
              Exportar
            </button>

            <label className="text-right">Responsable:</label>
            <input
              type="text"
              name="responsable"
              value={formData.responsable}
              onChange={handleChange}
              className="border rounded px-2 py-1"
            />
            <button type="button" onClick={onClose} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
              Cerrar
            </button>

            <label className="text-right">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border rounded px-2 py-1"
            />
          </div>

        {/* Search Razón Social input */}
        <div className="mt-4 mb-2">
          <div className="flex items-center gap-2">
            <label className="text-right w-[100px]">Razón Social:</label>
            <div className="relative flex-grow">
              <input
                type="text"
                className="w-full border rounded px-2 py-1"
                placeholder="Buscar razón social..."
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500">
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          </div>
        </div>

        {/* Table section */}
        <div className="mt-2">
          <div className="border rounded">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">RUC</th>
                  <th className="px-4 py-2 text-left">Raz. Social</th>
                  <th className="px-4 py-2 text-left">Dirección</th>
                </tr>
              </thead>
              <tbody>
                {List.map((item,index) => (
                  <tr key={index} onClick={() => {setFormData(item)}} onContextMenu={(e) => {e.preventDefault(), ReturnRS(item.razonContrata)}} className=' cursor-pointer'>
                    <td className="px-4 py-2">{item.rucContrata}</td>
                    <td className="px-4 py-2">{item.razonContrata}</td>
                    <td className="px-4 py-2">{item.direccionContrata}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalContrata;