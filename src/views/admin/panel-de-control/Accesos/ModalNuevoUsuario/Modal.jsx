import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Modal = ({ closeModal }) => {
  const [startDate, setStartDate] = React.useState(null);
  const [sexo, setSexo] = React.useState('');
  const [activo, setActivo] = React.useState(false);
  const [tipoDocumento, setTipoDocumento] = React.useState('');
  const [departamento, setDepartamento] = React.useState('');
  const [provincia, setProvincia] = React.useState('');
  const [distrito, setDistrito] = React.useState('');

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

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-md p-6 w-[400px] md:w-[880px]">
        <h2 className="text-2xl font-bold mb-4">Registrar Empleado</h2>
        <form>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
              >
                <option value="">Seleccionar</option>
                <option value="DNI">DNI</option>
                <option value="PASAPORTE">Pasaporte</option>
                <option value="RUC">RUC</option>
              </select>
            </div>
            <div>
              <label htmlFor="numeroDocumento" className="block text-sm font-medium text-gray-700">
                Número de Documento
              </label>
              <input
                type="text"
                id="numeroDocumento"
                className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none bg-white"
              />
            </div>
            <div>
              <label htmlFor="primerNombre" className="block text-sm font-medium text-gray-700">
                Nombres
              </label>
              <input
                type="text"
                id="primerNombre"
                className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none bg-white"
              />
            </div>
            <div>
              <label htmlFor="apellidoPaterno" className="block text-sm font-medium text-gray-700">
                Apellido Paterno
              </label>
              <input
                type="text"
                id="apellidoPaterno"
                className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none bg-white"
              />
            </div>
            <div>
              <label htmlFor="apellidoMaterno" className="block text-sm font-medium text-gray-700">
                Apellido Materno
              </label>
              <input
                type="text"
                id="apellidoMaterno"
                className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none bg-white"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none bg-white"
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
                dateFormat="dd-MM-yyyy"
                className="pointer border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none bg-white"
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
              >
                <option value="">Seleccionar</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
              </select>
            </div>
            <div>
              <label htmlFor="celular" className="block text-sm font-medium text-gray-700">
                Celular
              </label>
              <input
                type="text"
                id="celular"
                className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none bg-white"
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
              >
                <option value="">Seleccionar</option>
                {/* Aquí deberías tener opciones para los departamentos */}
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
              >
                <option value="">Seleccionar</option>
                {/* Aquí deberías tener opciones para las provincias */}
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
              >
                <option value="">Seleccionar</option>
                {/* Aquí deberías tener opciones para los distritos */}
              </select>
            </div>
            {/* Tercera columna */}
            <div>
              <label htmlFor="direccion" className="block text-sm font-medium text-gray-700">
                Dirección
              </label>
              <input
                type="text"
                id="direccion"
                className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none bg-white"
              />
            </div>
            <div>
              <label htmlFor="cargo" className="block text-sm font-medium text-gray-700">
                Cargo
              </label>
              <input
                type="text"
                id="cargo"
                className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none bg-white"
              />
            </div>
            <div>
              <label htmlFor="cip" className="block text-sm font-medium text-gray-700">
                CIP
              </label>
              <input
                type="text"
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
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="inline-flex justify-center items-center px-4 py-2 naranja-btn rounded-md mr-2"
              onClick={closeModal}
            >
              Cerrar
            </button>
            <button type="submit" className="inline-flex justify-center items-center px-4 py-2 azul-btn rounded-md">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
