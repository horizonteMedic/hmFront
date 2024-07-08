import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Formulario.css'
import LoginA from './model/LoginA';
import { ComboboxNivelE, ComboboxProfesion, ComboboxDepartamento, ComboboxDistrito, ComboboxProvincia } from './model/Combobos';
import { SubmitRegistrarPaciente } from './model/SubmitPaciente';
import Swal from 'sweetalert2';
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
  const [tiempoRestante, setTiempoRestante] = useState(300); 
  const [alertaMostrada, setAlertaMostrada] = useState(false);
  const [lists, setLists] = useState({
    NivelE: [],
    Profesion: [],
    Departamento: [],
    Provincia: [],
    Distrito: []
  })

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
          Swal.fire({title: 'Se Expiro su Sesion', text: 'Su sesión expiro, refresque la pagina nuevamente', icon: 'error', confirmButtonText: 'Refrescar'}).then((res) => {if (res.isConfirmed) {
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

  const filterProvincias = lists.Provincia.filter(
    (provincia) => provincia.idDepartamento === datos.departamento.id
  )
  const filterDistritos = lists.Distrito.filter(
    (distrito) => distrito.idProvincia === datos.provincia.id
  )

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'departamento' || name === 'provincia' || name === 'distrito') {
      const selectedOption = JSON.parse(e.target.value);
      setDatos({...datos, [name]: selectedOption})
      return
    }
    if (name === 'dni' || name === 'telefono' || name === 'celular') {
      const value = e.target.value.replace(/\D/g, ''); // Remover caracteres no numéricos
        if (value.length <= 8) {
          setDatos({...datos,
            [name]: value
          });
          return
      }
    }
    setDatos({
      ...datos,
      [name]: value
    });
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

  return (
    <>
    <div style={{ position: 'relative' }}>
      <div className="background-image" />
      <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', position: 'relative', zIndex: 1 }} className="min-h-screen flex justify-center items-center">
        <div className="bg-[#144579] p-8 rounded shadow-md w-full sm:w-3/4 lg:w-1/2">
          <h2 className="text-1xl font-bold mb-4 text-white">Formulario de Registro</h2>
          <div className="flex justify-end text-white mb-2">
            Tiempo restante: {Math.floor(tiempoRestante / 60)}:{(tiempoRestante % 60).toString().padStart(2, '0')}
          </div>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {Object.entries(datos).map(([key, value]) => (
                <div key={key} className='h-full'>
                  <label htmlFor={key} className="text-sm font-semibold text-white" style={{ fontSize: '15px' }}>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                  {key === 'fechaNacimiento' ? (
                    <DatePicker
                      id={key}
                      name={key}
                      selected={stardate}
                      onChange={handleDateChange}
                      className="form-input border rounded w-full h-10"
                      dateFormat="dd/MM/yyyy"
                      showYearDropdown
                      scrollableYearDropdown
                      yearDropdownItemNumber={15} // Número de años a mostrar en el menú desplegable
                    />
                  ) : key === 'sexo' || key === 'nivelEstudio' || key === 'estadoCivil' || key === 'departamento' || key === 'provincia' || key === 'distrito' ? (
                    <select id={key} name={key}  onChange={handleChange} className="text-black form-select text-sm cursor-pointer p-1 border rounded w-full">
                      <option value="">Seleccionar</option>
                      {key === 'sexo' && <><option value="M">MACULINO</option>
                        <option value="F">FEMENINO</option></>}
                      {key === 'estadoCivil' && <><option value="SOLTERO">SOLTERO</option>
                        <option value="CASADO">CASADO</option>
                        <option value="VIUDO">VIUDO</option>
                        <option value="CONVIVIENTE">CONVIVIENTE</option>
                        <option value="SEPARADO">SEPARADO</option>
                        <option value="DIVORCIADO">DIVORCIADO</option></>}
                      {key === 'nivelEstudio' && lists.NivelE.map((option, index) => (
                        <option key={index} value={option.descripcion}>{option.descripcion}</option>
                      ))}
                      {key === 'departamento' && lists.Departamento.map((option, index) => (
                        <option key={index} value={JSON.stringify(option)}>{option.nombre}</option>
                      ))}
                      {key === 'provincia' && filterProvincias.map((option, index) => (
                        <option key={index} value={JSON.stringify(option)}>{option.nombre}</option>
                      ))}
                      {key === 'distrito' && filterDistritos.map((option, index) => (
                        <option key={index} value={JSON.stringify(option)}>{option.nombre}</option>
                      ))}
                    </select>
                  ) : (
                    <input type="text" id={key} name={key} maxLength={key === 'dni' && 8} value={value} onChange={handleChange} className="text-black form-input border rounded w-full h-10" />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center">
              <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-1 px-4 mt-4 rounded" style={{fontSize:'13px', borderRadius:'2em'}}>Registrar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
          </>
  );
};

export default Formulario;
