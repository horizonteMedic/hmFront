import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import NewEmpleado from '../model/RegisterEmpleado';
import { useAuthStore } from '../../../../../store/auth';
import Swal from 'sweetalert2'

import { ComboboxDepartamentos, ComboboxProvincias, ComboboxDistritos, ComboboxSexo, ComboboxTipoDoc } from '../model/Combobox';

const Modal = ({ closeModal, Refresgpag }) => {
  const userlogued = useAuthStore(state => state.userlogued);
  const token = useAuthStore(state => state.token);

  const [tipoDocumento, setTipoDocumento] = React.useState('');
  const [nrodoc, setNrodoc] = useState('')
  const [nombres, setNombres] = useState('')
  const [apellidos, setApellidos] = useState('')
  const [email, setEmail] = useState('')
  const [startDate, setStartDate] = React.useState(null);
  const formattedDate = startDate ? startDate.toISOString().split('T')[0] : '';
  //Sexo
  const [sexo, setSexo] = React.useState('');
  const [celular, setCelular] = useState('')
  const [departamento, setDepartamento] = React.useState('');
  const [provincia, setProvincia] = React.useState('');
  const [distrito, setDistrito] = React.useState('');
  //Se le pasa el distrito
  const [direccion, setDireccion] = useState('')
  const [cargo, setCargo] = useState('')
  //CIP
  const [activo, setActivo] = React.useState(true);

  //Llamada de combobox
  const ListDepartamentos = ComboboxDepartamentos();
  const ListProvincias =  ComboboxProvincias()
  const ListDistritos = ComboboxDistritos()
  const ListSexo = ComboboxSexo()
  const ListTiposDoc = ComboboxTipoDoc()

  function AleertSucces() {
    Swal.fire({
      title: "¡Exito!",
      text: "Se ha creado a un Nuevo Empleado",
      icon: "success",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Aceptar"
    }).then((result) => {
      if (result.isConfirmed) {
        closeModal()
        Refresgpag()
      }
    });
  }

  const handleSexoChange = (event) => {
    setSexo(event.target.value);
  };

  const handleActivoChange = (event) => {
    setActivo(event.target.checked);
  };

  const handleTipoDocumentoChange = (event) => {
    setTipoDocumento(event.target.value);
  };

  const handleDepartamentoChange = (event) => {
    setDepartamento(event.target.value);
  };

  const handleProvinciaChange = (event) => {
    setProvincia(event.target.value);
  };

  const handleDistritoChange = (event) => {
    setDistrito(event.target.value);
  };

  //Filtos de Provincias y Distritos
  const filterProvincias = ListProvincias.filter(
    (provincia) => provincia.idDepartamento === departamento
  )
  const filterDistritos = ListDistritos.filter(
    (distrito) => distrito.idProvincia === provincia
  )

  const isFormValid = () => {
    return tipoDocumento !== '' &&
           nrodoc !== '' &&
           nombres !== '' &&
           apellidos !== '' &&
           email !== '' &&
           startDate !== null &&
           sexo !== '' &&
           celular !== '' &&
           departamento !== '' &&
           provincia !== '' &&
           distrito !== '' &&
           direccion !== '' &&
           cargo !== '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    NewEmpleado(tipoDocumento,nrodoc,nombres
      ,apellidos,cargo,distrito,sexo,email,celular,direccion,activo
    ,formattedDate,userlogued.sub)
      .then(data => {
        AleertSucces()
      })
      .catch(error => {
        console.error('Error', error)
      })
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
       <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-md w-[400px] md:w-[880px]  h-auto relative">

        <FontAwesomeIcon
            icon={faTimes}
            className="absolute top-0 right-0 m-3 cursor-pointer color-blanco"
            onClick={closeModal}
        />
        <div className="p naranjabackgroud flex justify-between p-3.5">
            <h1 className="text-start font-bold color-azul text-white">Registrar Empleado</h1>
        </div>
        <div className='container p-4'>
          <form>
            <div className="grid grid-cols-2 gap-4 mb-4 md:grid-cols-3">
              {/* Primer columna */}
              <div>
                <label htmlFor="tipoDocumento" className="block font-medium text-gray-700">
                  Tipo de Documento
                </label>
                <select
                  id="tipoDocumento"
                  value={tipoDocumento}
                  onChange={handleTipoDocumentoChange}
                  className="pointer border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none bg-white"
                  required
                >
                  <option value="">Seleccionar</option>
                  {ListTiposDoc?.map((option) => (
                    <option key={option.id} value={option.descripcion}>{option.descripcion}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="numeroDocumento" className="block  font-medium ">
                  Documento de Identidad D.N.I
                </label>
                <input
                  type="text"
                  value={nrodoc}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, ''); // Remover caracteres no numéricos
                    if (value.length <= 8) {
                      setNrodoc(value);
                    }
                  }}
                  id="numeroDocumento"
                  className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none bg-white"
                  required
                />

            </div>
            <div>
              <label htmlFor="primerNombre" className="block  font-medium ">
                Nombres
              </label>
              <input
                type="text"
                value={nombres}
                onChange={(e) => {
                  const value = e.target.value.toLowerCase(); // Convertir todo a minúsculas
                  setNombres(
                    value
                      .split(' ')
                      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalizar cada palabra
                      .join(' ')
                  );
                }}
                id="primerNombre"
                className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none bg-white"
                required
              />
            </div>
            <div>
              <label htmlFor="apellidos" className="block t font-medium ">
                Apellidos
              </label>
              <input
                type="text"
                value={apellidos}
                onChange={(e) => {
                  const value = e.target.value.toLowerCase(); // Convertir todo a minúsculas
                  setApellidos(
                    value
                      .split(' ')
                      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalizar cada palabra
                      .join(' ')
                  );
                }}
                id="apellidos"
                className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none bg-white"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block font-medium ">
                Email
              </label>
              <input
                type="email"
                value={email}
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none bg-white"
                required
              />
            </div>
            {/* Segunda columna */}
            <div>
              <label htmlFor="fechaNacimiento" className="block font-medium ">
                Fecha de Nacimiento
              </label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                showYearDropdown
                yearDropdownItemNumber={25}
                scrollableYearDropdown
                dateFormat="dd/MM/yyyy"
                className="pointer border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none bg-white"
                required
              />
            </div>
            <div>
              <label htmlFor="sexo" className="block font-medium ">
                Sexo
              </label>
              <select
                id="sexo"
                value={sexo}
                onChange={handleSexoChange}
                className=" pointer border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none bg-white"
                required
              >
                <option value="">Seleccionar</option>
                {ListSexo?.map((option) => (
                  <option key={option.id} value={option.descripcion}>{option.descripcion}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="celular" className="block font-medium ">
                Celular
              </label>
              <input
                type="text"
                value={celular}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ''); // Remover caracteres no numéricos
                  if (value.length <= 9) {
                    setCelular(value);
                  }
                }}
                id="celular"
                className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none bg-white"
                required
              />
            </div>
            <div>
              <label htmlFor="departamento" className="block font-medium text-gray-700">
                Departamento
              </label>
              <select
                id="departamento"
                value={departamento}
                onChange={handleDepartamentoChange}
                className="pointer border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none bg-white"
                required
              >
                <option value="">Seleccionar</option>
                {ListDepartamentos?.map((option) => (
                  <option key={option.id} value={option.id}>{option.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="provincia" className=" block font-medium ">
                Provincia
              </label>
              <select
                id="provincia"
                value={provincia}
                onChange={handleProvinciaChange}
                className=" pointer border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none bg-white"
                required
              >
                <option value="">Seleccionar</option>
                {filterProvincias?.map((option) => (
                  <option key={option.id} value={option.id}>{option.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="distrito" className="block font-medium ">
                Distrito
              </label>
              <select
                id="distrito"
                value={distrito}
                onChange={handleDistritoChange}
                className="pointer border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none bg-white"
                required
              >
                <option value="">Seleccionar</option>
                {filterDistritos?.map((option) => (
                  <option key={option.id} value={option.id}>{option.nombre}</option>
                ))}
              </select>
            </div>
            {/* Tercera columna */}
            <div>
              <label htmlFor="direccion" className="block font-medium ">
                Dirección
              </label>
              <input
                type="text"
                value={direccion}
                id="direccion"
                onChange={(e) => setDireccion(e.target.value)}
                className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none bg-white"
                required
              />
            </div>
            <div>
              <label htmlFor="cargo" className="block font-medium ">
                Cargo
              </label>
              <input
                type="text"
                value={cargo}
                onChange={(e) => {
                  const value = e.target.value.toLowerCase(); // Convertir todo a minúsculas
                  setCargo(
                    value
                      .split(' ')
                      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalizar cada palabra
                      .join(' ')
                  );
                }}
                id="cargo"
                className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none bg-white"
                required
              />
            </div>
            <div>
              <label htmlFor="cip" className="block  font-medium text-gray-700">
                CIP
              </label>
              <input
                type="text"
                id="cip"
                className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none bg-white"
              />
            </div>
            <div>
              <label htmlFor="activo" className="block  font-medium text-gray-700">
                Activo
              </label>
              <input
                type="checkbox"
                id="activo"
                checked={activo}
                onChange={handleActivoChange}
                className=" pointer form-checkbox text-blue-500 focus:ring-blue-500 h-6 w-6 bg-white"
                required
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              type="submit"
              className={`inline-flex justify-center items-center px-4 py-2 azul-btn rounded-md ${isFormValid() ? '': 'cursor-not-allowed opacity-50'}`}
              disabled={!isFormValid()}
            >
              Guardar
            </button>
          </div>       
          </form>
        </div>
      </div>
    </div>
  );
};

export default Modal;

