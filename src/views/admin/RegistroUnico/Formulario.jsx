import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Formulario.css'
import LoginA from './model/LoginA';
import { ComboboxNivelE, ComboboxProfesion, ComboboxDepartamento, ComboboxDistrito, ComboboxProvincia } from './model/Combobos';
import { SubmitRegistrarPaciente } from './model/SubmitPaciente';
import { SearchPacienteDNI } from './model/SearchDNI';
import Swal from 'sweetalert2';

import {InputSelect, InputText} from './Inputs'

const Formulario = () => {
  const [stardate, setStartDate] = useState(new Date());

  const [datos, setDatos] = useState({
    dni:'',
    nombres: '',
    apellidos: '',
    fechaNacimiento: '',
    sexo: '',
    email: '',
    lugarNacimiento: '',
    nivelEstudio: '',
    profesion: '',
    estadoCivil: '',
    direccion: '',
    departamento: '',
    provincia: '',
    distrito: '',
    caserio: '',
    telefono: '',
    celular: ''
  });
  const [token, setToken] = useState('')
  const [tiempoRestante, setTiempoRestante] = useState(600); 
  const [alertaMostrada, setAlertaMostrada] = useState(false);
  const [lists, setLists] = useState({
    NivelE: [],
    Profesion: [],
    Departamento: [],
    Provincia: [],
    Distrito: []
  })
  const [step, setStep] = useState(1);

  useEffect(() => {
    LoginA('Pacientes','123456')
    .then((res) => {
      setToken(res.mensaje)
      GetCombobox(res.mensaje)
    })
    .catch(() => {
      console.log('ocurrio un telibre error')
    })
  },[])

  function GetCombobox(token) {
    Swal.fire({
      title: 'Abriendo Formulario',
      text: 'Espere por favor...',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    Promise.all([
      ComboboxNivelE(token),
      ComboboxProfesion(token),
      ComboboxDepartamento(token),
      ComboboxProvincia(token),
      ComboboxDistrito(token)
    ])
    .then(([ListNivelE, ListProfesion, ListDepartamento, ListProvincia, ListDistrito]) => {
        setLists({...lists, NivelE: ListNivelE, Profesion: ListProfesion, Departamento: ListDepartamento,
          Provincia: ListProvincia, Distrito: ListDistrito
        })
    })
    .catch(error => {
      throw new Error('Network response was not ok.', error);
    })
    .finally(() => {
      Swal.close()
    })
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTiempoRestante(prev => {
        if (prev === 0) {
          clearInterval(timer);
          setToken('')
          Swal.fire({title: 'Se Expiro su Sesion', text: 'Su sesión expiro, refresque la pagina nuevamente', icon: 'error', allowOutsideClick: false,confirmButtonText: 'Refrescar'}).then((res) => {if (res.isConfirmed) {
            location.reload();
          }})
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!alertaMostrada) {
        e.preventDefault();
        e.returnValue = ''; // Para mostrar el cuadro de diálogo de confirmación personalizado
        return 'Ya no puede acceder al sistema. Póngase en contacto con un asesor.';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [alertaMostrada]);

  const filterProvincias = lists.Provincia.filter(provincia => {
    if (datos.departamento && provincia.idDepartamento === datos.departamento.id) {
      return true;
    }
    return false;
  });

  const filterDistritos = lists.Distrito.filter(distrito => {
    if (datos.provincia && distrito.idProvincia === datos.provincia.id) {
      return true;
    }
    return false;
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Función para capitalizar la primera letra de cada palabra
    const capitalizeFirstLetter = (str) => {
        return str.toLowerCase().replace(/^\w|\s\w/g, (letter) => letter.toUpperCase());
    };

    // Manejar campos especiales y normalizar otros campos
    if (name === 'departamento' || name === 'provincia' || name === 'distrito') {
        const selectedOption = JSON.parse(e.target.value);      
        setDatos(prevDatos => {
            let newDatos = { ...prevDatos, [name]: selectedOption };
            if (name === 'departamento') {
                newDatos = {
                    ...newDatos,
                    provincia: '',
                    distrito: ''
                };
            }
            return newDatos;
        });
    } else if (name === 'dni' || name === 'telefono' || name === 'celular') {
        // Remover caracteres no numéricos
        const numericValue = value.replace(/\D/g, '');
        setDatos({...datos, [name]: numericValue});
    } else {
        // Capitalizar la primera letra en nombres y apellidos
        if (name === 'nombres' || name === 'apellidos') {
            setDatos({...datos, [name]: capitalizeFirstLetter(value)});
        } else {
            // Para otros campos simplemente actualizar el valor
            setDatos({...datos, [name]: value});
        }
    }
};

  
  const handleDateChange = (date) => {
    const formattedDate = formatDate(date);
    setStartDate(date);
    setDatos({ ...datos, fechaNacimiento: formattedDate });
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSearch = (e) => {
    e.preventDefault()

    Swal.fire({
      title: 'Validando Datos',
      text: 'Buscando...',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    SearchPacienteDNI(datos.dni, token)
    .then((res) => {
      console.log(res)
      if (!res.codPa) {
        Swal.fire('Error', 'No se ha podido encontrar al Paciente', 'error');
        return
      } 
      setDatos({...datos,
        nombres: res.nombresPa,
        apellidos: res.apellidosPa,
        fechaNacimiento: res.fechaNaciminetoPa,
        sexo: res.sexoPa,
        email: res.emailPa,
        lugarNacimiento: res.lugarNacPa,
        nivelEstudio: res.nivelEstPa,
        profesion: res.ocupacionPa,
        estadoCivil: res.estadoCivilPa,
        direccion: res.direccionPa,
        departamento: res.departamentoPa,
        provincia: res.provinciaPa,
        distrito: res.distritoPa,
        caserio: res.caserioPa,
        telefono: res.telCasaPa,
        celular: res.celPa
      })
      Swal.close()
    })
    .catch(() => {
      Swal.fire({title: 'Error', text: 'No se pudo realizar la busqueda, intente mas tarde', icon: 'error'})
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    Swal.fire({
      title: 'Validando Datos',
      text: 'Espere por favor...',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    SubmitRegistrarPaciente(datos,token)
    .then((res) => {
      console.log(res)
      if (!res.id) {
        Swal.fire('Error', 'No se ha podido registrar al Paciente', 'error');
      } else {
        Swal.fire('Registrado', 'Paciente Registrado Correctamente', 'success');
      }
    })
    .catch(() => {
      Swal.fire({title: 'Error', text: 'No se pudo Registrar', icon: 'error'})
    })
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep(step + 1);
    } else {
      alert('Por favor, complete todos los campos obligatorios.');
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const validateStep = () => {
    switch (step) {
      case 1:
        return datos.dni && datos.nombres && datos.apellidos && datos.fechaNacimiento && datos.email;
      case 2:
        return datos.lugarNacimiento && datos.nivelEstudio && datos.profesion && datos.estadoCivil && datos.direccion;
      case 3:
        return datos.departamento && datos.provincia && datos.distrito && datos.caserio && datos.telefono && datos.celular;
      default:
        return true;
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <div className="background-image" />
      <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', position: 'relative', zIndex: 1 }} className="min-h-screen flex justify-center items-center">
        <div className="bg-[#144579] p-8 rounded shadow-md w-full sm:w-3/4 lg:w-1/2">
          <h2 className="text-xl font-bold mb-4 text-white">Formulario de Registro</h2>
          <div className="flex justify-end text-white mb-2">
            Tiempo restante: {Math.floor(tiempoRestante / 60)}:{(tiempoRestante % 60).toString().padStart(2, '0')}
          </div>
          
          {/* Progreso */}
          <div className="flex justify-center mb-8">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center">
                <div
                  className={`rounded-full h-8 w-8 flex items-center justify-center ml-3 mr-3 ${step >= num ? 'bg-orange-500' : 'bg-gray-300'} text-white`}
                >
                  {num}
                </div>
                {num !== 3 && (
                  <div className={`flex-1 h-1 ${step > num ? 'bg-orange-500' : 'bg-gray-300'}`} />
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <InputText  label='Dni' name='dni' value={datos.dni} handleChange={handleChange} handleSearch={handleSearch}/>
                <InputText label='Nombres' name='nombres' value={datos.nombres} handleChange={handleChange} />
                <InputText label='Apellidos' name='apellidos' value={datos.apellidos} handleChange={handleChange} />
                <div className='h-full'>
                  <label htmlFor='fechaNacimiento' className=" font-semibold text-white w-full" style={{ fontSize: '15px' }}>Fecha de Nacimiento:</label>
                  <DatePicker
                    id='fechaNacimiento'
                    selected={datos.fechaNacimiento}
                    onChange={handleDateChange}
                    className="form-input border rounded w-full h-10"
                    dateFormat="dd/MM/yyyy"
                    showYearDropdown
                    scrollableYearDropdown
                    yearDropdownItemNumber={200} // Ajusta según la cantidad de años necesarios
                    minDate={new Date("1800-01-01")} // Establece la fecha mínima permitida
                    maxDate={new Date()} // Establece la fecha máxima permitida (hoy)
                  />
                </div>
                <InputSelect  label='Sexo' name='sexo' value={datos.sexo} handleChange={handleChange} />
                <InputText  label='Email' name='email' value={datos.email} handleChange={handleChange} />
              </div>
            )}
            {step === 2 && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <InputText label='Lugar de Nacimiento' name='lugarNacimiento' value={datos.lugarNacimiento} handleChange={handleChange} />
                <InputSelect label='Nivel de Estudios'  name='nivelEstudio' value={datos.nivelEstudio} selected={lists.NivelE} handleChange={handleChange} />
                <InputSelect label='Profesión' name='profesion' value={datos.profesion} selected={lists.Profesion} handleChange={handleChange} />
                <InputSelect label='Estado Civil' name='estadoCivil' value={datos.estadoCivil} handleChange={handleChange} />
                <InputText label='Dirección' name='direccion' value={datos.direccion} handleChange={handleChange} />
              </div>
            )}
            {step === 3 && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <InputSelect label='Departamento' name='departamento' value={typeof datos.departamento === 'string'
                  ? JSON.stringify(lists.Departamento.find(d => d.nombre === datos.departamento)) || ''
                  : JSON.stringify(datos.departamento)} selected={lists.Departamento} handleChange={handleChange} />
                <InputSelect label='Provincia' name='provincia' value={typeof datos.provincia === 'string'
                  ? JSON.stringify(lists.Provincia.find(d => d.nombre === datos.provincia)) 
                  : JSON.stringify(datos.provincia)} selected={!datos.provincia ? filterProvincias : lists.Provincia} handleChange={handleChange} />
                <InputSelect label='Distrito' name='distrito' value={typeof datos.distrito === 'string'
                  ? JSON.stringify(lists.Distrito.find(d => d.nombre === datos.distrito)) 
                  : JSON.stringify(datos.distrito)} selected={!datos.distrito ? filterDistritos : lists.Distrito} handleChange={handleChange} />
                <InputText  label='Caserío' name='caserio' value={datos.caserio} handleChange={handleChange} />
                <InputText  label='Teléfono' name='telefono' value={datos.telefono} handleChange={handleChange} />
                <InputText  label='Celular' name='celular' value={datos.celular} handleChange={handleChange} />
              </div>
            )}
            <div className="text-center">
              {step > 1 && (
                <button type="button" style={{fontSize:'12px'}} onClick={prevStep} className="bg-gray-500 hover:bg-gray-700 text-white font-semibold py-3 px-4 mt-4 rounded mr-2">Anterior</button>
              )}
              {step < 3 && (
                <button type="button"  style={{fontSize:'12px'}} onClick={nextStep} className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-3 px-4 mt-4 rounded">Siguiente</button>
              )}
              {step === 3 && (
                <button type="submit"  style={{fontSize:'12px'}} className="bg-green-500 hover:bg-green-700 text-white font-semibold py-3 px-4 mt-4 rounded">Enviar</button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Formulario;
