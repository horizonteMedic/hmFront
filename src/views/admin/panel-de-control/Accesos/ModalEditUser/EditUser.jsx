import { useState } from "react";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { editUser } from "../model/EditUser";

const EditUserModal = ({ closeModal, datos, Refresgpag, token }) => {
    const [creating, setCreating] = useState(false);
    const [datosEditados, setDatosEditados] = useState({
        id: datos.idUser,
        username: datos.username,
        estado: datos.estado,
        id_empleado: datos.id_empleado
      });
    const handleChange = e => {
        const { name, value, } = e.target;
        setDatosEditados({
            ...datosEditados,
            [name]: value,
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
            text: "Se ha Editado el Usuario!",
            icon: "success",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Aceptar"
        }).then((result) => {
            if (result.isConfirmed) {
            Refresgpag()
            closeModal()
            }
        });
    }

    const handleEdit = (e) => {
        setCreating(true)
        e.preventDefault();
        editUser(datosEditados,token)
        .then(data => {
            AleertSucces()
        })
        .catch(error => {
            console.error('Error:', error)
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
            <FontAwesomeIcon icon={faTimes} className="cursor-pointer text-white" onClick={() => {closeModal()}} />
          </div>
          <div className="p-4">
            <label className="block mb-2">
              Username:
              <input type="text" name='username' className="border border-gray-300 rounded-md px-2 py-1 w-full" value={datosEditados.username} onChange={handleChange} />
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
              <button onClick={handleEdit} disabled={creating} className=" azul-btn font-bold py-2 px-4 rounded">{creating ? 'Editando Usuario...' : 'Editar Usuario'}</button>
  
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default EditUserModal;