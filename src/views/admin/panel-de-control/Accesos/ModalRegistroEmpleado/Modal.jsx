import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import NewEmpleado, { SearchPacienteDNI } from '../model/RegisterEmpleado';
import { useAuthStore } from '../../../../../store/auth';
import Swal from 'sweetalert2'

import { ComboboxDepartamentos, ComboboxProvincias, ComboboxDistritos, ComboboxSexo, ComboboxTipoDoc } from '../model/Combobox';
import { data } from 'autoprefixer';

const Modal = ({ closeModal, Refresgpag }) => {
  const userlogued = useAuthStore(state => state.userlogued);
  const token = useAuthStore(state => state.token);
  const selectedSede = useAuthStore(state => state.selectedSede)

  const initialFormState = {
    tipoDocumento: "",
    nrodoc: "",
    nombres: "",
    apellidos: "",
    email: "",
    startDate: null,        // fecha
    sexo: "",
    celular: "",
    departamento: "",
    provincia: "",
    distrito: "",
    direccion: "",
    cargo: "",
    activo: true,
  };

  const [form, setForm] = useState(initialFormState);
  //Llamada de combobox
  const ListDepartamentos = ComboboxDepartamentos();
  const ListProvincias = ComboboxProvincias()
  const ListDistritos = ComboboxDistritos()
  const ListSexo = ComboboxSexo()
  const ListTiposDoc = ComboboxTipoDoc()

  const mapUbicacionByNombre = ({
    departamento,
    provincia,
    distrito,
  }) => {
    let depId = "";
    let provId = "";
    let distId = "";

    const normalize = (str = "") =>
      str
        .toString()
        .trim()
        .toUpperCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

    // 🟦 Departamento
    const depFound = ListDepartamentos.find(
      d => normalize(d.nombre) === normalize(departamento)
    );

    if (depFound) {
      depId = depFound.id;

      // 🟩 Provincia (filtrada por departamento)
      const provFound = ListProvincias.find(
        p =>
          p.idDepartamento === depId &&
          normalize(p.nombre) === normalize(provincia)
      );

      if (provFound) {
        provId = provFound.id;

        // 🟨 Distrito (filtrado por provincia)
        const distFound = ListDistritos.find(
          d =>
            d.idProvincia === provId &&
            normalize(d.nombre) === normalize(distrito)
        );

        if (distFound) {
          distId = distFound.id;
        }
      }
    }

    return {
      departamentoId: depId,
      provinciaId: provId,
      distritoId: distId
    };
  };

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value.toUpperCase()
    }));
  };

  const handleSelectChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDateChange = (date) => {
    const newdate = date.toISOString().split('T')[0]
    setForm(prev => ({
      ...prev,
      startDate: newdate
    }));
  };

  //Filtos de Provincias y Distritos
  const filterProvincias = ListProvincias.filter(
    (provincia) => provincia.idDepartamento === form.departamento
  )
  const filterDistritos = ListDistritos.filter(
    (distrito) => distrito.idProvincia === form.provincia
  )

  const isFormValid = () => {
    return form.tipoDocumento !== '' &&
      form.nrodoc !== '' &&
      form.nombres !== '' &&
      form.apellidos !== '' &&
      form.email !== '' &&
      form.startDate !== null &&
      form.sexo !== '' &&
      form.celular !== '' &&
      form.departamento !== '' &&
      form.provincia !== '' &&
      form.distrito !== '' &&
      form.direccion !== '' &&
      form.cargo !== '';
  };

  const resetForm = () => {
    setForm(initialFormState)
  }

  const resetFormNoDNI = () => {
    setForm(prev => ({
      tipoDocumento: "",
      nrodoc: prev.nrodoc,
      nombres: "",
      apellidos: "",
      email: "",
      startDate: null,        // fecha
      sexo: "",
      celular: "",
      departamento: "",
      provincia: "",
      distrito: "",
      direccion: "",
      cargo: "",
      activo: true,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    NewEmpleado(form, userlogued.sub)
      .then(data => {
        AleertSucces()
      })
      .catch(error => {
        console.error('Error', error)
      })
  }

  // --- Búsqueda de paciente -------------------------
  const handleSearch = e => {
    e.preventDefault();
    if (!form.nrodoc) return Swal.fire('Error', 'Coloque el DNI', 'error');
    resetFormNoDNI();

    Swal.fire({
      title: 'Buscando datos', allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      showCancelButton: true,
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!", didOpen: () => Swal.showLoading()
    });

    SearchPacienteDNI(selectedSede, form.nrodoc, token)
      .then(async res => {
        Swal.close();
        console.log(res)
        // Si no existe el paciente
        if (!res.codPa) {
          await Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'info',
            title: '<span style="font-size:1rem">Paciente no encontrado</span>',
            width: 360,
            padding: '1.25rem',
            showConfirmButton: false,
            timer: 1200,
            customClass: { icon: 'swal2-icon-scale' }
          });

          return;
        }

        // 1️⃣ Sanear null/undefined → convertirlos en cadena vacía
        const sanitized = Object.fromEntries(
          Object.entries(res).map(([key, value]) => [key, value ?? ''])
        );

        // 2️⃣ Sobrescribir todo el objeto datos con valores saneados
        console.log(sanitized)

        const { departamentoId, provinciaId, distritoId
        } = mapUbicacionByNombre({
          departamento: sanitized.departamentoPa,
          provincia: sanitized.provinciaPa,
          distrito: sanitized.distritoPa,
        });
        // 3️⃣ Mapear departamento/provincia/distrito SOLO si vienen valores válidos

        setForm(d => ({
          ...d,
          tipoDocumento: "DNI",
          nombres: sanitized.nombresPa,
          apellidos: sanitized.apellidosPa,
          email: sanitized.emailPa,
          startDate: sanitized.fechaNaciminetoPa,
          sexo: sanitized.sexoPa === "M" ? "MASCULINO" : sanitized.sexoPa === "F" ? "FEMENINO" : sanitized.sexoPa,
          celular: sanitized.celPa,
          departamento: departamentoId,
          provincia: provinciaId,
          distrito: distritoId
        }))

        /*if (sanitized.departamentoPa) {
          const foundDept = Departamentos.find(d => d.nombre === sanitized.departamentoPa);
          deptObj = foundDept || sanitized.departamentoPa;

          const foundProv = foundDept
            ? Provincias.find(p =>
              p.idDepartamento === foundDept.id &&
              p.nombre === sanitized.provinciaPa
            )
            : null;
          provObj = foundProv || sanitized.provinciaPa;

          const foundDist = foundProv
            ? Distritos.find(d =>
              d.idProvincia === foundProv.id &&
              d.nombre === sanitized.distritoPa
            )
            : null;
          distObj = foundDist || sanitized.distritoPa;
        }
        //Eliminar validacion
        props.setDatos(d => ({
          ...d,
          departamentoPa: deptObj,
          provinciaPa: provObj,
          distritoPa: distObj
        }));

        // 4️⃣ Sincronizar los campos de búsqueda/autocomplete
        if (sanitized.sexoPa === 'M') setSearchSexo('MASCULINO');
        else if (sanitized.sexoPa === 'F') setSearchSexo('FEMENINO');
        else setSearchSexo('');

        setSearchNivel(sanitized.nivelEstPa);
        setSearchCivil(sanitized.estadoCivilPa);

        setSearchTerm(sanitized.ocupacionPa);
        setSelectedProfesion(sanitized.ocupacionPa);

        setSearchDept(sanitized.departamentoPa);
        setSearchProv(sanitized.provinciaPa);
        setSearchDist(sanitized.distritoPa);*/
      })
      .catch(() => {
        Swal.close();
        Swal.fire('Error', 'Ha ocurrido un error', 'error');
      });
  }
  console.log(form)
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
                  name='tipoDocumento'
                  value={form.tipoDocumento}
                  onChange={handleChange}
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
                  value={form.nrodoc}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, ''); // Remover caracteres no numéricos
                    if (value.length <= 8) {
                      handleChange(e);
                    }
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      handleSearch(e);
                    }
                  }}
                  id="nrodoc"
                  name='nrodoc'
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
                  name='nombres'
                  value={form.nombres}
                  onChange={handleChange}
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
                  value={form.apellidos}
                  name='apellidos'
                  onChange={handleChange}
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
                  value={form.email}
                  name='email'
                  id="email"
                  onChange={handleChange}
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
                  selected={form.startDate}
                  onChange={handleDateChange}
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
                  name='sexo'
                  value={form.sexo}
                  onChange={handleChange}
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
                  value={form.celular}
                  name='celular'
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, ''); // Remover caracteres no numéricos
                    if (value.length <= 9) {
                      handleChange(e)
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
                  name='departamento'
                  value={form.departamento}
                  onChange={handleChange}
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
                  name='provincia'
                  value={form.provincia}
                  onChange={handleChange}
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
                  name='distrito'
                  value={form.distrito}
                  onChange={handleChange}
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
                  value={form.direccion}
                  name='direccion'
                  id="direccion"
                  onChange={handleChange}
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
                  value={form.cargo}
                  name='cargo'
                  onChange={handleChange}
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
                  name='activo'
                  checked={form.activo}
                  onChange={handleChange}
                  className=" pointer form-checkbox text-blue-500 focus:ring-blue-500 h-6 w-6 bg-white"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                type="submit"
                className={`inline-flex justify-center items-center px-4 py-2 azul-btn rounded-md ${isFormValid() ? '' : 'cursor-not-allowed opacity-50'}`}
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

