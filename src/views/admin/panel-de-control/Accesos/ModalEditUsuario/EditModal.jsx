import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useAuthStore } from '../../../../../store/auth';
import EditEmpleado from '../model/EditEmpleado';
import Swal from 'sweetalert2';
import { ComboboxDepartamentos, ComboboxProvincias, ComboboxDistritos, ComboboxSexo, ComboboxTipoDoc } from '../model/Combobox';

const editModal = ({ closeModal, Refresgpag, ID, TipoDoc, Nrodoc, Nombres, Apellidos, Email, FechaNacimiento, 
  Cip, Celular, Distrito, Direccion, Cargo, Estado, FechaInicio, UserRegistro}) => {
  
  const userlogued = useAuthStore(state => state.userlogued);
  const [tipoDocumento, setTipoDocumento] = React.useState(TipoDoc);
  const [nrodoc, setNrodoc] = useState(Nrodoc)
  const [nombres, setNombres] = useState(Nombres)
  const [apellidos, setApellidos] = useState(Apellidos)
  const [email, setEmail] = useState(Email)
  const [startDate, setStartDate] = React.useState(FechaNacimiento);
  //Sexo
  const [sexo, setSexo] = React.useState('');
  const [celular, setCelular] = useState(Celular)

  const [departamento, setDepartamento] = React.useState(Distrito.slice(0, 2));
  const [provincia, setProvincia] = React.useState(Distrito.slice(0, 4));
  const [distrito, setDistrito] = React.useState(Distrito.slice(0, 6));
  //Se le pasa el distrito
  const [direccion, setDireccion] = useState(Direccion)
  const [cargo, setCargo] = useState(Cargo)
  //CIP
  const [activo, setActivo] = React.useState(Estado);
  const [cip, setCip] = useState('')

  //Llamada de combobox
  const ListDepartamentos = ComboboxDepartamentos();
  const ListProvincias =  ComboboxProvincias()
  const ListDistritos = ComboboxDistritos()
  const ListSexo = ComboboxSexo()
  const ListTiposDoc = ComboboxTipoDoc()

  function AleertSucces() {
    Swal.fire({
      title: "¡Exito!",
      text: "Se ha Editaro el Empleado con exito!",
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


  const handleSubmit = async (event) => {
    event.preventDefault();
    EditEmpleado(ID, tipoDocumento, nrodoc, nombres, apellidos, email, startDate, 
      cip, celular, distrito, direccion, cargo, activo, FechaInicio, UserRegistro, userlogued.sub)
      .then(data => {
        AleertSucces()
      })
      .catch(error => {
        console.error('Error', error)
      })
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-md p-6 w-[400px] md:w-[880px] relative">
        <FontAwesomeIcon
          icon={faTimes}
          className="absolute top-0 right-0 m-4 cursor-pointer text-gray-500"
          onClick={closeModal}
        />
        <h2 className="text-2xl font-bold mb-4 ">Editar Empleado</h2>
        <form>
          <div className="grid grid-cols-2 gap-4 mb-4 md:grid-cols-3">
            {/* Primer columna */}
            <div>
              <label htmlFor="tipoDocumento" className="block text-sm font-medium text-gray-700">
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
              <label htmlFor="numeroDocumento" className="block text-sm font-medium text-gray-700">
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
              <label htmlFor="primerNombre" className="block text-sm font-medium text-gray-700">
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
              <label htmlFor="apellidos" className="block text-sm font-medium text-gray-700">
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
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
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
              <label htmlFor="fechaNacimiento" className="block text-sm font-medium text-gray-700">
                Fecha de Nacimiento
              </label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                showYearDropdown
                yearDropdownItemNumber={30}
                scrollableYearDropdown
                dateFormat="dd/MM/yyyy"
                className="pointer border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none bg-white"
                required
              />
            </div>
            <div>
              <label htmlFor="sexo" className="block text-sm font-medium text-gray-700">
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
              <label htmlFor="celular" className="block text-sm font-medium text-gray-700">
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
              <label htmlFor="departamento" className="block text-sm font-medium text-gray-700">
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
                  <option key={option.id} value={option.id} selected={option.id === departamento}>{option.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="provincia" className=" block text-sm font-medium text-gray-700">
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
                  <option key={option.id} value={option.id} selected={option.id === provincia}>{option.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="distrito" className="block text-sm font-medium text-gray-700">
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
                  <option key={option.id} value={option.id} selected={option.id === distrito}>{option.nombre}</option>
                ))}
              </select>
            </div>
            {/* Tercera columna */}
            <div>
              <label htmlFor="direccion" className="block text-sm font-medium text-gray-700">
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
              <label htmlFor="cargo" className="block text-sm font-medium text-gray-700">
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
              <label htmlFor="cip" className="block text-sm font-medium text-gray-700">
                CIP
              </label>
              <input
                type="text"
                value={Cip}
                onChange={(e) => {
                  const value = e.target.value.toLowerCase(); // Convertir todo a minúsculas
                  setCip(
                    value
                      .split(' ')
                      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalizar cada palabra
                      .join(' ')
                  );
                }}
                id="cip"
                className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none bg-white"
              />
            </div>
            <div>
              <label htmlFor="activo" className="block text-sm font-medium text-gray-700">
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
              className={`inline-flex justify-center items-center px-4 py-2 azul-btn rounded-md `}
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default editModal;

