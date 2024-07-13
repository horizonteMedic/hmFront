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
  const [tiempoRestante, setTiempoRestante] = useState(300); 
  const [alertaMostrada, setAlertaMostrada] = useState(false);
  const [lists, setLists] = useState({
    NivelE: [],
    Profesion: [],
    Departamento: [],
    Provincia: [],
    Distrito: []
  })
  const [disabled, setDisabled] = useState(true)

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
  //Filtos de Provincias y Distritos
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
    console.log(name,value)
    if (name === 'departamento' || name === 'provincia' || name === 'distrito') {
      const selectedOption = JSON.parse(e.target.value);      
      setDatos(prevDatos => {
        // Primero, crea una copia del estado actual
        let newDatos = { ...prevDatos, [name]: selectedOption };
        // Si el campo es 'departamentoPa', resetea 'provinciaPa' y 'distritoPa'
        if (name === 'departamento') {
          newDatos = {
            ...newDatos,
            provincia: '',
            distrito: ''
          };
        }
        return newDatos;
      });
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
    console.log(datos)
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

   console.log(datos)
   console.log(JSON.stringify(lists.Provincia.find(d => d.nombre === datos.provincia)) )
  return (
    
    <div style={{ position: 'relative' }}>
      <div className="background-image" />
      <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', position: 'relative', zIndex: 1 }} className="min-h-screen flex justify-center items-center">
        <div className="bg-[#144579] p-8 rounded shadow-md w-full sm:w-3/4 lg:w-1/2">
          <h2 className="text-1xl font-bold mb-4 text-white">Formulario de Registro</h2>
          <div className="flex justify-end text-white mb-2">
            Tiempo restante: {Math.floor(tiempoRestante / 60)}:{(tiempoRestante % 60).toString().padStart(2, '0')}
          </div>
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <InputText name='dni' value={datos.dni} handleChange={handleChange} handleSearch={handleSearch}/>
            <InputText name='nombres' value={datos.nombres} handleChange={handleChange} />
            <InputText name='apellidos' value={datos.apellidos} handleChange={handleChange} />
            <div className='h-full'>
              <label htmlFor='fechaNacimiento' className="text-sm font-semibold text-white" style={{ fontSize: '15px' }}>Fecha de Nacimiento:</label>
              <DatePicker
                id='fechaNacimiento'
                value={datos.fechaNacimiento}
                name='fechaNacimiento'
                selected={stardate}
                onChange={handleDateChange}
                className="form-input border rounded w-full h-10"
                dateFormat="dd/MM/yyyy"
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={15} // Número de años a mostrar en el menú desplegable
              />
            </div>
            <InputSelect name='sexo' value={datos.sexo} handleChange={handleChange} />
            <InputText name='email' value={datos.email} handleChange={handleChange} />
            <InputText name='lugarNacimiento' value={datos.email} handleChange={handleChange} />
            <InputSelect name='nivelEstudio' value={datos.nivelEstudio} selected={lists.NivelE} handleChange={handleChange} />
            <InputSelect name='profesion' value={datos.profesion} selected={lists.Profesion} handleChange={handleChange} />
            <InputSelect name='estadoCivil' value={datos.estadoCivil} handleChange={handleChange} />
            <InputText name='direccion' value={datos.direccion} handleChange={handleChange} />
            <InputSelect name='departamento' value={typeof datos.departamento === 'string'
              ? JSON.stringify(lists.Departamento.find(d => d.nombre === datos.departamento)) || ''
              : JSON.stringify(datos.departamento)} selected={lists.Departamento} handleChange={handleChange} />
            <InputSelect name='provincia' value={typeof datos.provincia === 'string'
              ? JSON.stringify(lists.Provincia.find(d => d.nombre === datos.provincia)) 
              : JSON.stringify(datos.provincia)} selected={!datos.provincia ? filterProvincias : lists.Provincia} handleChange={handleChange} />
            <InputSelect name='distrito' value={typeof datos.distrito === 'string'
              ? JSON.stringify(lists.Distrito.find(d => d.nombre === datos.distrito)) 
              : JSON.stringify(datos.distrito)} selected={!datos.distrito ? filterDistritos : lists.Distrito} handleChange={handleChange} />
            <InputText name='caserio' value={datos.caserio} handleChange={handleChange} />
            <InputText name='telefono' value={datos.telefono} handleChange={handleChange} />
            <InputText name='celular' value={datos.celular} handleChange={handleChange} />

              
            </div>
            <div className="text-center">
              <button onClick={handleSubmit} disabled={!datos.dni} className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-1 px-4 mt-4 rounded" style={{fontSize:'13px', borderRadius:'2em'}}>Registrar</button>
            </div>

          </div>
        </div>
      </div>
    </div>
          
  );
};

export default Formulario;
