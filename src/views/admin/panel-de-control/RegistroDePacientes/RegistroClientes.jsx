import { useState } from 'react';
import Swal from 'sweetalert2';
import { Loading } from '../../../components/Loading';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faMobileAlt, faSearch } from '@fortawesome/free-solid-svg-icons';
import {
  ComboboxEstadoCivil,
  ComboboxSexo,
  ComboboxNivelE,
  ComboboxProfesión,
  ComboboxDepartamentos,
  ComboboxProvincias,
  ComboboxDistritos
} from './model/Combobox';
import { SearchPacienteDNI, SubmitRegistrarPaciente } from './model/AdminPaciente';

const RegistroClientes = (props) => {
  const [startDate, setStartDate] = useState(new Date());
  const [datos, setDatos] = useState({
    codPa: '',
    nombresPa: '',
    fechaNaciminetoPa: '',
    sexoPa: '',
    emailPa: '',
    lugarNacPa: '',
    nivelEstPa: '',
    ocupacionPa: '',
    estadoCivilPa: '',
    direccionPa: '',
    departamentoPa: '',
    provinciaPa: '',
    distritoPa: '',
    caserioPA: '',
    telCasaPa: '',
    celPa: '',
    apellidosPa: '',
  });


  
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProfesiones, setFilteredProfesiones] = useState([]);
  const [selectedProfesion, setSelectedProfesion] = useState('');

  
  const handleProfesionSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value) {
      const filteredOptions = Profesiones.filter(option =>
        option.descripcion.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredProfesiones(filteredOptions);
    } else {
      setFilteredProfesiones([]);
    }
  };

  const handleSelectProfesion = (profesion) => {
    setSelectedProfesion(profesion.descripcion);
    setDatos({
      ...datos,
      ocupacionPa: profesion.descripcion,
    });
    setSearchTerm('');
    setFilteredProfesiones([]);
  };

  const handleFormSearch = e => {
    e.preventDefault();
    // Mostrar el mensaje de carga
  };

  const EstadoCivil = ComboboxEstadoCivil();
  const NivelE = ComboboxNivelE();
  const Profesiones = ComboboxProfesión();
  const Departamentos = ComboboxDepartamentos();
  const Provincias = ComboboxProvincias();
  const Distritos = ComboboxDistritos();

  // Filtrar Provincias y Distritos
  const filterProvincias = Provincias.filter(provincia => {
    if (datos.departamentoPa && provincia.idDepartamento === datos.departamentoPa.id) {
      return true;
    }
    return false;
  });
  
  const filterDistritos = Distritos.filter(distrito => {
    if (datos.provinciaPa && distrito.idProvincia === datos.provinciaPa.id) {
      return true;
    }
    return false;
  });

  const handleNumber = e => {
    const { name, value } = e.target;
    setDatos({
      ...datos,
      [name]: value.replace(/\D/g, '') || '0',
    });
  };

  const handleDNI = e => {
    const { name, value } = e.target;
    setDatos({
      ...datos,
      [name]: value ? parseInt(value.replace(/\D/g, ''), 10) : 0,
    });
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setDatos({
      ...datos,
      [name]: value.toUpperCase(),
    });
  };

  const handleDPD = e => {
    const { name } = e.target;
    const selectedOption = JSON.parse(e.target.value);
   
    setDatos(prevDatos => {
      // Primero, crea una copia del estado actual
      let newDatos = { ...prevDatos, [name]: selectedOption };
      // Si el campo es 'departamentoPa', resetea 'provinciaPa' y 'distritoPa'
      if (name === 'departamentoPa') {
        newDatos = {
          ...newDatos,
          provinciaPa: '',
          distritoPa: ''
        };
      }
      return newDatos;
    });
  };

  const handleSearch = e => {
    e.preventDefault();
    
    // Mostrar el mensaje de carga
    Swal.fire({
      title: 'Buscando datos',
      text: 'Espere por favor...',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  
    SearchPacienteDNI(props.selectedSede, datos.codPa, props.token)
      .then(res => {
        console.log(res);
        if (!res.codPa) {
          Swal.fire('Error', 'No se ha encontrado al Paciente', 'error');
        } else {
          setDatos(res);
          Swal.close(); // Cerrar el mensaje de carga
        }
      })
      .catch(() => {
        Swal.fire('Error', 'Ha ocurrido un Error', 'error');
      });
  };
  
  const handleSubmit = () => {
    Swal.fire({
      title: 'Validando Datos',
      text: 'Espere por favor...',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    SubmitRegistrarPaciente(datos, props.selectedSede, props.token)
      .then(res => {
        if (!res.id) {
          Swal.fire('Error', 'No se ha podido registrar al Paciente', 'error');
        } else {
          Swal.fire('Registrado', 'Paciente Registrado Correctamente', 'success');
          handleSearch()
        }
        
      })
      .catch(() => {
        console.log('Ocurrió un problema al registrar al paciente');
      })

  };

  const handleLimpiar = () => {
    setDatos({
      codPa: '',
      nombresPa: '',
      fechaNaciminetoPa: '',
      sexoPa: '',
      emailPa: '',
      lugarNacPa: '',
      nivelEstPa: '',
      ocupacionPa: '',
      estadoCivilPa: '',
      direccionPa: '',
      departamentoPa: '',
      provinciaPa: '',
      distritoPa: '',
      caserioPA: '',
      telCasaPa: '',
      celPa: '',
      apellidosPa: '',
    });
  };
  
  return (
    <>
    <div className="p-4">
  <form onSubmit={handleSearch}>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-1">
      {/* Columna 1 */}
      
      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2">
          <label htmlFor="dni" className="block w-[11.5em]">DNI/LM:</label>
          <input
            type="text"
            value={datos.codPa}
            id="codPa"
            name="codPa"
            onChange={handleDNI}
            className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white w-full"
          />
          <button type="submit" className="px-4 py-2 rounded-lg azuloscurobackground text-white flex items-center space-x-2">
            <span>Buscar</span>
            <FontAwesomeIcon icon={faSearch} className="ml-2" /> {/* Icono de lupa de FontAwesome */}
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <label htmlFor="nombres" className="block w-36">Nombres:</label>
          <input
            type="text"
            id="nombresPa"
            value={datos.nombresPa}
            onChange={handleChange}
            name="nombresPa"
            className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white w-full"
          />
        </div>
        <div className="flex items-center space-x-2">
          <label htmlFor="apellidos" className="block w-36">Apellidos:</label>
          <input
            type="text"
            id="apellidosPa"
            value={datos.apellidosPa}
            onChange={handleChange}
            name="apellidosPa"
            className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white w-full"
          />
        </div>
        <div className="flex items-center space-x-2">
      <label htmlFor="fechaNacimiento" className="block w-36">Fecha de Nacimiento:</label>
      <DatePicker
        selected={startDate}
        onChange={date => setStartDate(date)}
        dateFormat="dd/MM/yyyy"
        showYearDropdown
        yearDropdownItemNumber={15} // Número de años a mostrar
        scrollableYearDropdown // Hacer el dropdown scrollable
        className="border pointer border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white w-full"
      />
    </div>
        <div className="flex items-center space-x-2">
          <label htmlFor="sexo" name="sexo" className="block w-36">Sexo:</label>
          <select
            id="sexoPa"
            value={datos.sexoPa}
            onChange={handleChange}
            name="sexoPa"
            className="border pointer border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white w-full"
          >
            <option value="">Seleccionar</option>
            <option value="M">MACULINO</option>
            <option value="F">FEMENINO</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <label htmlFor="email" className="block w-36">Email:</label>
          <input
            type="email"
            id="emailPa"
            value={datos.emailPa}
            onChange={handleChange}
            name="emailPa"
            className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white w-full"
          />
        </div>
      </div>

      {/* Columna 2 */}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2">
          <label htmlFor="lugarNacimiento" className="block w-36">Lugar de Nacimiento:</label>
          <input
            type="text"
            value={datos.lugarNacPa}
            onChange={handleChange}
            id="lugarNacPa"
            name="lugarNacPa"
            className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white w-full"
          />
        </div>
        <div className="flex items-center space-x-2">
          <label htmlFor="nivelEstudio" name="nivelE" className="block w-36">Nivel de Estudio:</label>
          <select
            id="nivelEstPa"
            value={datos.nivelEstPa}
            onChange={handleChange}
            name="nivelEstPa"
            className="border pointer border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white w-full"
          >
            <option value="">Seleccionar</option>
            {NivelE.map((option) => (
              <option value={option.descripcion} key={option.id}>{option.descripcion}</option>
            ))}
          </select>
        </div>
      <div className="flex items-center space-x-2">
          <label htmlFor="profOcupacion" className="block w-36">Prof/Ocup:</label>
          <input
            type="text"
            value={searchTerm}
            onChange={handleProfesionSearch}
            placeholder="Seleccione"
            className="border pointer border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white w-full"
          />
          {searchTerm && (
            <div className="border border-gray-300 rounded-md mt-1 max-h-48 overflow-y-auto">
              {filteredProfesiones.map((option, index) => (
                <div
                  key={index}
                  className="cursor-pointer p-2 hover:bg-gray-200"
                  onClick={() => handleSelectProfesion(option)}
                >
                  {option.descripcion}
                </div>
              ))}
            </div>
          )}
        </div>
        {selectedProfesion && (
          <div className="text-sm mt-1">
            Seleccionado: <strong>{selectedProfesion}</strong>
          </div>
        )}
        
        <div className="flex items-center space-x-2">
          <label htmlFor="estadoCivil" className="block w-36">Estado Civil:</label>
          <select
            id="estadoCivilPa"
            name="estadoCivilPa"
            value={datos.estadoCivilPa}
            onChange={handleChange}
            className="border pointer border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white w-full"
          >
            <option value="">Seleccionar</option>
            {EstadoCivil.map((option) => (
              <option key={option.id} value={option.descripcion}>{option.descripcion}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <label htmlFor="direccionHabitual" className="block w-36">Dirección Habitual:</label>
          <input
            type="text"
            value={datos.direccionPa}
            onChange={handleChange}
            id="direccionPa"
            name="direccionPa"
            className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white w-full"
          />
        </div>
      </div>

      {/* Columna 3 */}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2">
          <label htmlFor="departamento" name="departamento" className="block w-36">Departamento:</label>
          <select
            id="departamentoPa"
            name="departamentoPa"
            value={typeof datos.departamentoPa === 'string'
              ? JSON.stringify(Departamentos.find(d => d.nombre === datos.departamentoPa)) || ''
              : JSON.stringify(datos.departamentoPa)}
            onChange={handleDPD}
            className="border pointer border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white w-full"
          >
            <option value="">Seleccionar</option>
            {Departamentos.map((option) => (
              <option key={option.id} value={JSON.stringify(option)}>{option.nombre}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <label htmlFor="provincia" className="block w-36">Provincia:</label>
          <select
            id="provinciaPa"
            name="provinciaPa"
            value={typeof datos.provinciaPa === 'string'
              ? JSON.stringify(Provincias.find(d => d.nombre === datos.provinciaPa)) || ''
              : JSON.stringify(datos.provinciaPa)}
            onChange={handleDPD}
            className="border pointer border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white w-full"
          >
            <option value="">Seleccionar</option>
            {!datos.provinciaPa ? filterProvincias.map((option) => (
              <option key={option.id} value={JSON.stringify(option)}>{option.nombre}</option>
            )) : Provincias.map((option) => (
              <option key={option.id} value={JSON.stringify(option)}>{option.nombre}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <label htmlFor="distrito" className="block w-36">Distrito:</label>
          <select
            id="distritoPa"
            name="distritoPa"
            onChange={handleDPD}
            value={typeof datos.distritoPa === 'string'
              ? JSON.stringify(Distritos.find(d => d.nombre === datos.distritoPa)) || ''
              : JSON.stringify(datos.distritoPa)}
            className="border pointer border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white w-full"
          >
            <option value="">Seleccionar</option>
            {!datos.distritoPa ? filterDistritos.map((option) => (
              <option key={option.id} value={JSON.stringify(option)}>{option.nombre}</option>
            )) : Distritos.map((option) => (
              <option key={option.id} value={JSON.stringify(option)}>{option.nombre}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <label htmlFor="caserio" className="block w-36">Caserío:</label>
          <input
            type="text"
            value={datos.caserioPA}
            id="caserioPA"
            onChange={handleChange}
            name="caserioPA"
            className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white w-full"
          />
        </div>
        <div className="flex items-center space-x-2">
          {/* <FontAwesomeIcon icon={faPhone} className="" /> */}
          <label htmlFor="telefono" className="block w-36">Teléfono:</label>
          <input
            type="text"
            value={datos.telCasaPa}
            id="telCasaPa"
            onChange={handleNumber}
            name="telCasaPa"
            className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white w-full"
          />
        </div>
        <div className="flex items-center space-x-2">
          {/* <FontAwesomeIcon icon={faMobileAlt} className="" /> */}
          <label htmlFor="celular" className="block w-36">Celular:</label>
          <input
            type="text"
            value={datos.celPa}
            id="celPa"
            name="celPa"
            onChange={handleNumber}
            className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white w-full"
          />
        </div>
      </div>
    </div>

    {/* Botones al final */}
    <div className="col-span-3 flex justify-end">
      <button
        onClick={handleSubmit}
        className="azul-btn px-6 py-2 rounded-md hover:bg-blue-800 focus:outline-none"
      >
        Registrar
      </button>
      <button
        type="button"
        onClick={handleLimpiar}
        className="bg-red-500 px-6 ml-3 py-2 rounded-md text-white focus:outline-none"
      >
        Limpiar
      </button>
    </div>
  </form>
</div>

    </>
  );
};

export default RegistroClientes;
