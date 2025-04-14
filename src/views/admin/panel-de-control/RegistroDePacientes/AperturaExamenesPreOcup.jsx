import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import Swal from 'sweetalert2';
import 'react-datepicker/dist/react-datepicker.css';
import { ComboboxEmpresasMulti, ComboboxContratasMulti, ComboboxMedicosMulti, ComboboxPruebaMulti, ComboboxCargoMulti, ComboboxAreaMulti,
  ComboboxExamenMMulti, ComboboxExplotacionMulti, ComboboxMineralMulti, ComboboxAlturaMulti, ComboboxPrecioExamenMulti, ComboboxFormaPago, ComboboxListAuth
 } from './model/Combobox';
import { SearchPacienteDNI } from './model/AdminPaciente';
import { SubmitHistoriaC } from './model/AdminHistoriaC';
import {InputsSelect, InputsSelect2} from './InputsSelect';
import {getFetch} from './../getFetch/getFetch'

const AperturaExamenesPreOcup = (props) => {
  const [stardate, setStartDate] = useState(new Date());


  const EmpresasMulti = ComboboxEmpresasMulti(props.selectedSede)
  const ContrataMulti = ComboboxContratasMulti(props.selectedSede)
  const MedicosMulti = ComboboxMedicosMulti(props.selectedSede)
  const PruebaMulti = ComboboxPruebaMulti(props.selectedSede)
  const CargosMulti = ComboboxCargoMulti(props.selectedSede)
  const AreaMulti = ComboboxAreaMulti(props.selectedSede)
  const ExamenMulti = ComboboxExamenMMulti(props.selectedSede)
  const ExplotacionMulti = ComboboxExplotacionMulti(props.selectedSede)
  const MineralMulti = ComboboxMineralMulti(props.selectedSede)
  const AlturaMulti = ComboboxAlturaMulti(props.selectedSede)
  const FormaPago = ComboboxFormaPago(props.selectedSede)
  const ListAuth = ComboboxListAuth(props.selectedSede)
  
  const [datos, setDatos] = useState({
    codPa: "",
    razonEmpresa:"N/A",
    razonContrata: "N/A",
    n_medico: "",
    tipoPrueba: "",
    cargoDe: "",
    areaO: "",
    nomExamen: "",
    nomEx: "",
    mineralPo: "",
    alturaPo: "",
    precioPo: "",
    tipoPago: "",
    precioAdic: "",
    autoriza: "",
    fechaAperturaPo: '',
    n_operacion: null,
    textObserv1: "",
    textObserv2: "",
    n_fisttest: false, //1
    n_psicosen: false, //2
    n_testaltura: false, //3
    trabCalientes: false, //4
    rxcLumbosacra: false, //5
    visualCompl: false,//6
    manipAlimentos: false, //7
    herraManuales: false, //8
    rxcDorsoLumbar: false, //9
    rxcKLumbar: false, //10
    rxcPlomos: false,//12
    mercurioo: false//13
  })
  const [searchHC, setSearchHC] = useState([])
  const [showEdit, setShowEdit] = useState(false)
  const [habilitar, setHabilitar] = useState(false)
  const [register, setRegister] = useState(true)

  useEffect(() => {
    getFetch(`/api/v01/st/registros/listadoHistorialOcupacional/${props.selectedSede}`,props.token)
    .then((res) => {
      setSearchHC(res)
    })
    .catch(() => {
      console.log('ocurrio un telibre error')
    })
  },[])
  
  useEffect(() => {
    if (searchHC.some(hc => hc.codPa === datos.codPa)) {
      setRegister(false);
      setShowEdit(true)
    } else {
      setShowEdit(false)
    }
  }, [datos.codPa, searchHC]);

  const [creating, setCreating] = useState(false)

  const handleDateChange = (date) => {
    const formattedDate = formatDate(date);
    setStartDate(date);
    setDatos({ ...datos, fechaAperturaPo: formattedDate });
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const newPrice = (value) => {  
    ComboboxPrecioExamenMulti(props.selectedSede,value,props.token)
    .then((res) => {
      setDatos({...datos,
        nomExamen: value,
        precioPo: res.mensaje
      })
    })
    .catch(() => {
      console.log('Telible Error')
    })

  }

  const handleCheack = (e) => {
    const { name, checked } = e.target;
    setDatos({...datos,
      [name]: checked
    })
  }
  
  const handleChange = (e) => {   
    const { name, value } = e.target;
    
    if (name === 'nomExamen') {
      newPrice(value)
      return
    }
    setDatos({
      ...datos,
      [name]: value.toUpperCase(),
    });
  }

  const handleDNI = (e) => {
    const { name, value } = e.target;
    setDatos({
        ...datos,
        [name]: value ? parseInt(value.replace(/\D/g, ''), 10) : 0
    });
    setRegister(true)
  };

  const handleEdit = (value) => {
    setDatos(value)
    setRegister(false)
    setHabilitar(true)
    setShowEdit(true)
  }

  const handleSearch = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      Swal.fire({
        title: 'Validando Datos',
        text: 'Espere por favor...',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      setCreating(true)
      SearchPacienteDNI(props.selectedSede,datos.codPa,props.token)
      .then((res) => {
        if (!res.codPa) {
          return Swal.fire('Error', 'No se ha encontrado al Paciente', 'error');
        }
        setDatos({
          ...datos,
          nombresPa: res.nombresPa,
          apellidosPa: res.apellidosPa
        });
        Swal.close();
      })
      .catch(() => {
        return Swal.fire('Error', 'Ha ocurrido un Error', 'error');
      })
      .finally(() => {
        setCreating(false)
      })
    }
    
  }

  const handleLimpiar = e => {

    setDatos({
      codPa: "",
      razonEmpresa:"N/A",
      razonContrata: "N/A",
      n_medico: "",
      tipoPrueba: "",
      cargoDe: "",
      areaO: "",
      nomExamen: "",
      nomEx: "",
      mineralPo: "",
      alturaPo: "",
      precioPo: "",
      tipoPago: "",
      precioAdic: "",
      autoriza: "",
      fechaAperturaPo: '',
      n_operacion: null,
      textObserv1: "",
      textObserv2: "",
      n_fisttest: false, //1
      n_psicosen: false, //2
      n_testaltura: false, //3
      trabCalientes: false, //4
      rxcLumbosacra: false, //5
      visualCompl: false,//6
      manipAlimentos: false, //7
      herraManuales: false, //8
      rxcDorsoLumbar: false, //9
      rxcKLumbar: false, //10
      rxcPlomos: false,//12
      mercurioo: false//13

    })
    setShowEdit(false)
  }

  const handleSubmitEdit = e => {
    Swal.fire({
      title: 'Validando Datos',
      text: 'Espere por favor...',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    SubmitHistoriaC(datos,props.selectedSede,props.token,2)
    .then((res) => {
      if (!res.id) {
          Swal.fire('Error', 'No se ha podido editar la Historia Clinica', 'error');
        } else {
          Swal.fire('Editado', 'Historia Clinica Editado', 'success');
        }
    })
    .catch(() => {
      console.log('telible error')
    })
  }

  const handleSubmit = (e) => {
    Swal.fire({
      title: 'Validando Datos',
      text: 'Espere por favor...',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    SubmitHistoriaC(datos,props.selectedSede,props.token,1)
    .then((res) => {
      if (!res.id) {
          Swal.fire('Error', 'No se ha podido registrar la Historia Clinica', 'error');
        } else {
          Swal.fire('Registrado', 'Historia Clinica Registrada', 'success');
        }
    })
    .catch(() => {
      console.log('telible error')
    })
    
  };

  const codPa = datos.codPa.toString();  // Convertir a cadena de texto
  const activarDisabled = codPa.length === 8;
  return (
    <div >
      <form onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-2 sm:flex-col gap-4 mb-1">
          <div className="w-full sm:w-full md:w-auto mb-4 pr-4  ">
            <div className="mb-1 pb-2">
              <h2 className="text-lg font-bold">Datos</h2>
            </div>
            <div className="flex items-center space-x-2 mb-1">
              <label htmlFor="dni" className="block w-40">DNI:</label>
              <input
                type="text"
                id="codPa"
                disabled={creating || habilitar}
                value={datos.codPa}
                maxLength={8}
                onKeyDown={handleSearch}
                onChange={handleDNI}
                name="codPa"
                className="border border-gray-300 px-3 py-1  mb-1 rounded-md focus:outline-none bg-white flex-grow w-full"
              />
                <label htmlFor="apellidos" className="block w-36">G.Sang.:</label>
              <input
                type="text"
                disabled={habilitar}
                id="apellidos"
                name="apellidos"
                className="border border-gray-300 px-3 py-1  mb-1 rounded-md focus:outline-none bg-white flex-grow w-36"
              />
               <input
                type="text"
                disabled={habilitar}
                id="apellidos"
                name="apellidos"
                className="border border-gray-300 px-3 py-1  mb-1 rounded-md focus:outline-none bg-white flex-grow w-36"
              />
            </div>
            <div className="flex items-center space-x-2 mb-1">
              <label htmlFor="nombre" className="block w-[14em]">Nombre:</label>
              <input
                type="text"
                disabled={habilitar}
                id="nombre"
                value={datos.nombresPa}
                name="nombre"
                className="border border-gray-300 px-3 py-1  mb-1 rounded-md focus:outline-none bg-white flex-grow w-full"
              />
              <label htmlFor="apellidos" className="block w-[14em]">Apellidos:</label>
              <input
                type="text"
                disabled={habilitar}
                id="apellidos"
                value={datos.apellidosPa}
                name="apellidos"
                className="border border-gray-300 px-3 py-1  mb-1 rounded-md focus:outline-none bg-white flex-grow w-full"
              />
            </div>
            <div className="flex items-center space-x-2 mb-1">
              <InputsSelect2 nombre="razonEmpresa" disabled={habilitar} value={datos.razonEmpresa} title="Empresa" Selects={EmpresasMulti} handleChange={handleChange}/>
              <InputsSelect2 nombre="razonContrata" disabled={habilitar} value={datos.razonContrata} title="Contrata" Selects={ContrataMulti} handleChange={handleChange}/>
            </div>
            <div className="flex items-center space-x-2 mb-1">
              <InputsSelect2 nombre="n_medico" disabled={habilitar} value={datos.n_medico} title="Médico Ocupacional" Selects={MedicosMulti} handleChange={handleChange}/>
              <InputsSelect2 nombre="tipoPrueba" disabled={habilitar} value={datos.tipoPrueba} title="Tipo de Prueba" Selects={PruebaMulti} handleChange={handleChange}/>
            </div>
            <div className="mb-1 mt-5">
              <h2 className="text-lg font-bold">Área Pre-Ocupacional</h2>
            </div>
            <InputsSelect nombre="cargoDe" disabled={habilitar} value={datos.cargoDe} title="Cargo" Selects={CargosMulti} handleChange={handleChange}/>
            <InputsSelect nombre="areaO" disabled={habilitar} value={datos.areaO} title="Área" Selects={AreaMulti} handleChange={handleChange}/>
            <InputsSelect nombre="nomExamen" disabled={habilitar} value={datos.nomExamen} title="Examen Médico" Selects={ExamenMulti} handleChange={handleChange}/>
            <div className="flex items-center space-x-2 mb-1">
              <label htmlFor="examenAdicional" className="block w-[15em] ">Examen Adicional:</label>
              <div className="flex flex-wrap pt-2 pb-2">
              
                <div className="flex items-center mr-8 mb-2">
                  <input type="checkbox" disabled={habilitar} checked={datos.n_fisttest} onChange={handleCheack}  id="examenAdicional4" name="n_fisttest" className="mr-2" />
                  <label htmlFor="examenAdicional4">FIST-TEST</label>
                </div>
                <div className="flex items-center mr-4 mb-2">
                  <input type="checkbox" disabled={habilitar} checked={datos.n_psicosen} onChange={handleCheack} id="examenAdicional5" name="n_psicosen" className="mr-2" />
                  <label htmlFor="examenAdicional5">PSICOSEN</label>
                </div>
                <div className="flex items-center mr-4 mb-2">
                  <input type="checkbox" disabled={habilitar} checked={datos.n_testaltura} onChange={handleCheack} id="examenAdicional6" name="n_testaltura" className="mr-2" />
                  <label htmlFor="examenAdicional6">T.ALTURA</label>
                </div>
                <div className="flex items-center mr-4 mb-2">
                  <input type="checkbox" disabled={habilitar} checked={datos.trabCalientes} onChange={handleCheack} id="examenAdicional7" name="trabCalientes" className="mr-2" />
                  <label htmlFor="examenAdicional7">T.CAL</label>
                </div>
                <div className="flex items-center mr-4 mb-2">
                  <input type="checkbox" disabled={habilitar} checked={datos.rxcLumbosacra} onChange={handleCheack} id="examenAdicional8" name="rxcLumbosacra" className="mr-2" />
                  <label htmlFor="examenAdicional8">RX.C.LUMBO</label>
                </div>
                <div className="flex items-center mr-4 mb-2">
                  <input type="checkbox" disabled={habilitar} checked={datos.visualCompl} onChange={handleCheack} id="examenAdicional9" name="visualCompl" className="mr-2" />
                  <label htmlFor="examenAdicional9">VIS.COMPL</label>
                </div>
                <div className="flex items-center mr-4 mb-2">
                  <input type="checkbox" disabled={habilitar} checked={datos.manipAlimentos} onChange={handleCheack} id="examenAdicional10" name="manipAlimentos" className="mr-2" />
                  <label htmlFor="examenAdicional10">M.ALIM.</label>
                </div>
                <div className="flex items-center mr-4 mb-2">
                  <input type="checkbox" disabled={habilitar} checked={datos.herraManuales} onChange={handleCheack} id="examenAdicional11" name="herraManuales" className="mr-2" />
                  <label htmlFor="examenAdicional11">H.MAN</label>
                </div>
                <div className="flex items-center mr-4 mb-2">
                  <input type="checkbox" disabled={habilitar} checked={datos.rxcDorsoLumbar} onChange={handleCheack} id="examenAdicional12" name="rxcDorsoLumbar" className="mr-2" />
                  <label htmlFor="examenAdicional12">RX.C.DORSE</label>
                </div>
                <div className="flex items-center mr-4 mb-2">
                  <input type="checkbox" disabled={habilitar} checked={datos.rxcKLumbar} onChange={handleCheack} id="examenAdicional13" name="rxcKLumbar" className="mr-2" />
                  <label htmlFor="examenAdicional13">RX.LUMBA</label>
                </div>
                <div className="flex items-center mr-4 mb-2">
                  <input type="checkbox" disabled={habilitar} checked={datos.rxcPlomos} onChange={handleCheack} id="examenAdicional14" name="rxcPlomos" className="mr-2" />
                  <label htmlFor="examenAdicional14">PLOMO S.</label>
                </div>
                <div className="flex items-center mr-4 mb-2">
                  <input type="checkbox" disabled={habilitar} checked={datos.mercurioo} onChange={handleCheack} id="examenAdicional15" name="mercurioo" className="mr-2" />
                  <label htmlFor="examenAdicional15">MER.O</label>
                </div>
              </div>
            </div>
            <InputsSelect nombre="nomEx" disabled={habilitar} value={datos.nomEx} title="Explotación en" Selects={ExplotacionMulti} handleChange={handleChange}/>
            <InputsSelect nombre="mineralPo" disabled={habilitar} value={datos.mineralPo} title="Mineral Exp" Selects={MineralMulti} handleChange={handleChange}/>
            <InputsSelect nombre="alturaPo" disabled={habilitar} value={datos.alturaPo} title="Altura" Selects={AlturaMulti} handleChange={handleChange}/>

          
            <div className="flex items-center space-x-2 mb-1">
              <label htmlFor="Precio" className="block w-1/2">Precio del Examen</label>
              <input type="text"
                id="precioExamenAdicional"
                name="precioExamenAdicional"
                className="border border-gray-300 px-3 py-1  mb-1 rounded-md focus:outline-none bg-white flex-grow w-full" 
                value={datos.precioPo}
                disabled />
              <InputsSelect2 nombre="tipoPago" disabled={habilitar} value={datos.tipoPago} title="Forma de Pago" Selects={FormaPago} handleChange={handleChange}/>
            </div>
            <div className="flex items-center space-x-2 mb-1">
              <label htmlFor="precioExamenAdicional" className="block w-1/2">Precio Examen Adicional:</label>
              <input
                type="text"
                disabled={habilitar}
                value={datos.precioAdic}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ''); // Remover caracteres no numéricos
                  if (value.length <= 8) {
                    setDatos({...datos,
                      precioAdic: value
                    });
                  }
                }}
                id="precioAdic"
                name="precioAdic"
                className="border border-gray-300 px-3 py-1  mb-1 rounded-md focus:outline-none bg-white flex-grow w-full"
              />
              <InputsSelect2 nombre="autoriza" disabled={habilitar} value={datos.autoriza} title="Autorizado Por" Selects={ListAuth} handleChange={handleChange}/>
            </div>
            {showEdit && <div className=" pt-4 flex justify-end items-end ">
                <button type="button" onClick={() => {setHabilitar(false)}}  className=" mr-2 flex items-end border-1 border-blue-500 text-white px-3 py-1 bg-blue-800  mb-1 rounded-md hover:bg-blue-500 hover:text-white focus:outline-none">
                   Habilitar
                </button>
                <button type="button" onClick={handleSubmitEdit}  className=" mr-2 flex items-end border-1 border-blue-500 text-white px-3 py-1 bg-blue-800  mb-1 rounded-md hover:bg-blue-500 hover:text-white focus:outline-none">
                   Editar
                </button>
                <button type="button" onClick={handleLimpiar} className="flex items-end border-1 border-blue-500 text-white px-3 py-1 bg-blue-800  mb-1 rounded-md hover:bg-blue-500 hover:text-white focus:outline-none">
                   Limpiar
                </button>
              </div>}
          </div>
          {/* Nueva columna con estructura solicitada */}
          <div className="w-full sm:w-full mb-4 pl-4">
            <div className="mb-4">
            <div className="flex items-center space-x-2 mb-1">
              <label htmlFor="fechaApertura" className="block w-1/7">Fecha de Apertura:</label>
              <DatePicker
                selected={stardate}
                value={datos.fechaAperturaPo}
                disabled={habilitar}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                className="border pointer border-gray-300 px-3 py-1  mb-1 rounded-md focus:outline-none bg-white flex-grow w-full"
              />
              <label htmlFor="numOperacion" className="block ml-4">N° Operación:</label>
              <input
                type="text"
                disabled={habilitar}
                value={datos.n_operacion}
                id="numOperacion"
                name="n_operacion"
                onChange={handleChange}
                className="border border-gray-300 px-3 py-1  mb-1 rounded-md focus:outline-none bg-white"
              />
            </div>
            <div className="flex items-center space-x-2 mb-1">
              <label htmlFor="observacion1" className="block w-36">Observación 1:</label>
              <input
                type="text"
                disabled={habilitar}
                value={datos.textObserv1}
                onChange={handleChange}
                id="observacion1"
                name="textObserv1"
                className="border border-gray-300 px-3 py-1  mb-1 rounded-md focus:outline-none bg-white flex-grow w-full"
              />
            </div>
            <div className="flex items-center space-x-2 mb-1">
              <label htmlFor="observacion2" className="block w-36">Observación 2:</label>
              <input
                type="text"
                id="observacion2"
                disabled={habilitar}
                value={datos.textObserv2}
                onChange={handleChange}
                name="textObserv2"
                className="border border-gray-300 px-3 py-1  mb-1 rounded-md focus:outline-none bg-white flex-grow w-full"
              />
            </div>
            <div className="flex items-center space-x-2 mb-1">
              <label htmlFor="protocolo" className="block w-36">Protocolo:</label>
              <select
                id="protocolo"
                name="protocolo"
                className="border pointer border-gray-300 px-3 py-1  mb-1 rounded-md focus:outline-none bg-white flex-grow w-full"
              >
                <option value="">Seleccionar</option>
              </select>
            </div>
              <div className="flex items-center space-x-2 mb-2">
                <label htmlFor="soloMiSede" className="block w-1/6">Solo mi Sede</label>
                <input type="checkbox" id="soloMiSede" name="soloMiSede" className="mr-2 pointer" />

                <label htmlFor="fecha" className="block w-14">Fecha:</label>
                <DatePicker
                  selected={stardate}
                  dateFormat="dd/MM/yyyy"
                  className="border pointer border-gray-300 px-3 py-1  mb-1 rounded-md focus:outline-none bg-white w-32"
                />
                <label htmlFor="hora" className="block w-14">Hora:</label>
                <input
                  type="text"
                  id="hora"
                  name="hora"
                  className="border border-gray-300 px-3 py-1  mb-1 rounded-md focus:outline-none bg-white w-24"
                />
                <label htmlFor="sedeClinica" className="block w-36">Sede Clínica:</label>
                <input
                  type="text"
                  id="sedeClinica"
                  name="sedeClinica"
                  className="border border-gray-300 px-3 py-1  mb-1 rounded-md focus:outline-none bg-white flex-grow w-1/2"
                />
              </div>

              <div className="flex items-center space-x-2 mb-2">
                <label htmlFor="nombre" className="block w-36">Nombre:</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  className="border border-gray-300 px-3 py-1  mb-1 rounded-md focus:outline-none bg-white flex-grow w-full"
                />
                <label htmlFor="codigo" className="block w-36">Código:</label>
                <input
                  type="text"
                  id="codigo"
                  name="codigo"
                  className="border border-gray-300 px-3 py-1  mb-1 rounded-md focus:outline-none bg-white flex-grow w-full"
                />
              </div>
            </div>
            <div className="mb-4 ">
              <h3 className="text-lg font-bold mb-2">Últimos Agregados & Hojas de Ruta</h3>
              <div className="overflow-y-auto" style={{ maxHeight: 'calc(7 * 4rem)' }}>
              <table  className="w-full text-center border border-gray-300 mb-4 ">
                <thead>
                  <tr>
                    <th className="border border-gray-300 px-2 py-1  mb-1">Nro. Orden</th>
                    <th className="border border-gray-300 px-2 py-1  mb-1">Nombres</th>
                    <th className="border border-gray-300 px-2 py-1  mb-1">Fecha</th>
                    <th className="border border-gray-300 px-2 py-1  mb-1">Empresa</th>
                    <th className="border border-gray-300 px-2 py-1  mb-1">Contrata</th>
                    <th className="border border-gray-300 px-2 py-1  mb-1">T. Examen</th>
                  </tr>
                </thead>
                <tbody>
                  {searchHC.length == 0  && <div className='flex justify-center items-center'><p>Cargando...</p></div>}
                  {searchHC.map((option, index) => (
                    <tr key={index} className=' cursor-pointer' onClick={() => {handleEdit(option)}}>
                      <td className="border border-gray-300 px-2 py-1  mb-1">{option.n_orden}</td>
                      <td className="border border-gray-300 px-2 py-1  mb-1">Fulanito Panfilo</td>
                      <td className="border border-gray-300 px-2 py-1  mb-1">{option.fechaAperturaPo}</td>
                      <td className="border border-gray-300 px-2 py-1  mb-1">{option.razonEmpresa}</td>
                      <td className="border border-gray-300 px-2 py-1  mb-1">{option.razonContrata}</td>
                      <td className="border border-gray-300 px-2 py-1  mb-1">{option.nomExamen}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
              <div className=" pt-4 flex justify-end items-end">
                {register && <button type="button" onClick={handleSubmit} disabled={!activarDisabled} className="flex items-end border-1 border-blue-500 text-white px-3 py-1 bg-blue-800  mb-1 rounded-md hover:bg-blue-500 hover:text-white focus:outline-none">
                   Agregar
                </button>}
                
              </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AperturaExamenesPreOcup;
