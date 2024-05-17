import { useState } from 'react';
import DatePicker from 'react-datepicker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faMobileAlt } from '@fortawesome/free-solid-svg-icons';

const RegistroClientes = () => {
  const [startDate, setStartDate] = useState(new Date());

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes manejar la lógica para enviar los datos del formulario
    console.log('Formulario enviado');
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 mb-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {/* DNI/LM */}
          <div className="flex items-center space-x-2 mb-4">
            <label htmlFor="dni" className="block w-36">DNI/LM:</label>
            <input
              type="text"
              id="dni"
              name="dni"
              className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white w-96"
            />
            <input type="checkbox" id="sinDNI" name="sinDNI" className='pointer ml-2'/>
            <label htmlFor="sinDNI" className="block ">Sin DNI</label>
          </div>
          {/* Nombres */}
          <div className="flex items-center space-x-2 mb-4">
            <label htmlFor="nombres" className="block  w-36">Nombres:</label>
            <input
              type="text"
              id="nombres"
              name="nombres"
              className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white w-full"
            />
          </div>
          {/* Apellidos */}
          <div className="flex items-center space-x-2 mb-4">
            <label htmlFor="apellidos" className="block  w-36">Apellidos:</label>
            <input
              type="text"
              id="apellidos"
              name="apellidos"
              className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white w-full"
            />
          </div>
          {/* Fecha de Nacimiento */}
          <div className="flex items-center space-x-2 mb-4">
            <label htmlFor="fechaNacimiento" className="block  w-36">Fecha de Nacimiento:</label>
            <DatePicker
              selected={startDate}
              onChange={date => setStartDate(date)}
              dateFormat="dd/MM/yyyy"
              className="border pointer border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white w-full"
            />
          </div>
          {/* Sexo */}
          <div className="flex items-center space-x-2 mb-4">
            <label htmlFor="sexo" className="block w-36">Sexo:</label>
            <select
              id="sexo"
              name="sexo"
              className="border pointer border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white w-full"
            >
              <option value="">Seleccionar</option>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </select>
          </div>
          {/* Email */}
          <div className="flex items-center space-x-2 mb-4">
            <label htmlFor="email" className="block  w-36">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              className="border  border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white w-full"
            />
          </div>
          {/* Lugar de Nacimiento */}
          <div className="flex items-center space-x-2 mb-4">
            <label htmlFor="lugarNacimiento" className="block  w-36">Lugar de Nacimiento:</label>
            <input
              type="text"
              id="lugarNacimiento"
              name="lugarNacimiento"
              className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white w-full"
            />
          </div>
          {/* Nivel de Estudio */}
          <div className="flex items-center space-x-2 mb-4">
            <label htmlFor="nivelEstudio" className="block  w-36">Nivel de Estudio:</label>
            <select
              id="nivelEstudio"
              name="nivelEstudio"
              className="border pointer border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white w-full"
            >
              <option value="">Seleccionar</option>
              <option value="primaria">Primaria</option>
              <option value="secundaria">Secundaria</option>
              <option value="tecnico">Técnico</option>
              <option value="universitario">Universitario</option>
            </select>
          </div>
          {/* Profesión/Ocupación */}
          <div className="flex items-center space-x-2 mb-4">
            <label htmlFor="profOcupacion" className="block  w-36">Prof/Ocupación:</label>
            <select
              id="profOcupacion"
              name="profOcupacion"
              className="border pointer border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white w-full"
            >
              <option value="">Seleccionar</option>
              {/* Agregar opciones aquí */}
            </select>
          </div>
          {/* Estado Civil */}
          <div className="flex items-center space-x-2 mb-4">
            <label htmlFor="estadoCivil" className="block w-36">Estado Civil:</label>
            <select
              id="estadoCivil"
              name="estadoCivil"
              className="border pointer border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white w-full"
            >
              <option value="">Seleccionar</option>
              <option value="soltero">Soltero</option>
              <option value="casado">Casado</option>
              <option value="viudo">Viudo</option>
              <option value="divorciado">Divorciado</option>
            </select>
          </div>
          {/* Dirección Habitual */}
          <div className="flex items-center space-x-2 mb-4">
            <label htmlFor="direccionHabitual" className="block w-36">Dirección Habitual:</label>
            <input
              type="text"
              id="direccionHabitual"
              name="direccionHabitual"
              className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white w-full"
            />
          </div>
          {/* Departamento */}
          <div className="flex items-center space-x-2 mb-4">
            <label htmlFor="departamento" className="block  w-36">Departamento:</label>
            <select
              id="departamento"
              name="departamento"
              className="border pointer border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white w-full"
            >
              <option value="">Seleccionar</option>
              {/* Agregar opciones aquí */}
            </select>
          </div>
          {/* Provincia */}
          <div className="flex items-center space-x-2 mb-4">
            <label htmlFor="provincia" className="block w-36">Provincia:</label>
            <select
              id="provincia"
              name="provincia"
              className="border pointer border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white w-full"
            >
              <option value="">Seleccionar</option>
              {/* Agregar opciones aquí */}
            </select>
          </div>
          {/* Distrito */}
          <div className="flex items-center space-x-2 mb-4">
            <label htmlFor="distrito" className="block  w-36">Distrito:</label>
            <select
              id="distrito"
              name="distrito"
              className="border pointer border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white w-full"
            >
              <option value="">Seleccionar</option>
              {/* Agregar opciones aquí */}
            </select>
          </div>
          {/* Caserío */}
          <div className="flex items-center space-x-2 mb-4">
            <label htmlFor="caserio" className="block  w-36">Caserío:</label>
            <select
              id="caserio"
              name="caserio"
              className="border pointer border-gray-300 px-3 py-2
              rounded-md focus:outline-none bg-white w-full"
            >
              <option value="">Seleccionar</option>
              {/* Agregar opciones aquí */}
            </select>
          </div>
          {/* Teléfono */}
          <div className="flex items-center space-x-2 mb-4">
            <FontAwesomeIcon icon={faPhone} className="" />
            <label htmlFor="telefono" className="block  w-36">Teléfono:</label>
            <input
              type="text"
              id="telefono"
              name="telefono"
              className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white w-full"
            />
          </div>
          {/* Celular */}
          <div className="flex items-center space-x-2 mb-4">
            <FontAwesomeIcon icon={faMobileAlt} className=" " />
            <label htmlFor="celular" className="block  w-36">Celular:</label>
            <input
              type="text"
              id="celular"
              name="celular"
              className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white w-full"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="azul-btn px-6 py-2 rounded-md hover:bg-blue-800 focus:outline-none"
          >
            Registrar
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistroClientes;
