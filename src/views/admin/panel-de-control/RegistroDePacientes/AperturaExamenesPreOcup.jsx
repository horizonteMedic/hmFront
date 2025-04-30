import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import Swal from 'sweetalert2';
import 'react-datepicker/dist/react-datepicker.css';
import { ComboboxEmpresasMulti, ComboboxContratasMulti, ComboboxMedicosMulti, ComboboxPruebaMulti, ComboboxCargoMulti, ComboboxAreaMulti,
  ComboboxExamenMMulti, ComboboxExplotacionMulti, ComboboxMineralMulti, ComboboxAlturaMulti, ComboboxPrecioExamenMulti, ComboboxFormaPago, ComboboxListAuth
 } from './model/Combobox';
import { SearchPacienteDNI } from './model/AdminPaciente';
import { GetHistoriaC, SubmitHistoriaC } from './model/AdminHistoriaC';
import {InputsSelect, InputsSelect2} from './InputsSelect';
import {getFetch} from './../getFetch/getFetch'
const AperturaExamenesPreOcup = (props) => {
  const [stardate, setStartDate] = useState(new Date());
  const jasperModules = import.meta.glob('../../../jaspers/*.jsx'); // ajusta si usas .jsx


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
    codPa: props.DNIG,
    razonEmpresa:"",
    razonContrata: "",
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
    fechaAperturaPo: new Date(),
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
  //TABLAHC
  const [SearchP, setSearchP] = useState({
    code: "",
    nombre: ""
  })


  // Autocompletado Empresa
  const [searchEmpresa, setSearchEmpresa] = useState(datos.razonEmpresa);
  const [filteredEmpresas, setFilteredEmpresas] = useState([]);

  const handleEmpresaSearch = e => {
    const v = e.target.value;
    setSearchEmpresa(v);
    setFilteredEmpresas(
      v
        ? EmpresasMulti.filter(emp =>
            emp.mensaje.toLowerCase().includes(v.toLowerCase())
          )
        : []
    );
  };

  const handleSelectEmpresa = emp => {
    setSearchEmpresa(emp.mensaje);
    setDatos(d => ({ ...d, razonEmpresa: emp.mensaje }));
    setFilteredEmpresas([]);
    // mueve el foco al siguiente campo Contrata
    document.getElementById('razonContrata')?.focus();
  };

  // — Autocomplete Contrata —
  const [searchContrata, setSearchContrata]       = useState(datos.razonContrata);
  const [filteredContratas, setFilteredContratas] = useState([]);

  const handleContrataSearch = e => {
    const v = e.target.value;
    setSearchContrata(v);
    setFilteredContratas(
      v
        ? ContrataMulti.filter(c =>
            c.mensaje.toLowerCase().includes(v.toLowerCase())
          )
        : []
    );
  };

  const handleSelectContrata = c => {
    setSearchContrata(c.mensaje);
    setDatos(d => ({ ...d, razonContrata: c.mensaje }));
    setFilteredContratas([]);
    document.getElementById('n_medico')?.focus();
  };

  // — Autocomplete Médico Ocupacional —
  const [searchMedico, setSearchMedico]       = useState(datos.n_medico);
  const [filteredMedicos, setFilteredMedicos] = useState([]);

  const handleMedicoSearch = e => {
    const v = e.target.value;
    setSearchMedico(v);
    setFilteredMedicos(
      v
        ? MedicosMulti.filter(m =>
            m.mensaje.toLowerCase().includes(v.toLowerCase())
          )
        : []
    );
  };

  const handleSelectMedico = m => {
    setSearchMedico(m.mensaje);
    setDatos(d => ({ ...d, n_medico: m.mensaje }));
    setFilteredMedicos([]);
    document.getElementById('tipoPrueba')?.focus();
  };

  // — Autocomplete Tipo de Prueba —
  const [searchPrueba, setSearchPrueba]       = useState(datos.tipoPrueba);
  const [filteredPruebas, setFilteredPruebas] = useState([]);

  const handlePruebaSearch = e => {
    const v = e.target.value;
    setSearchPrueba(v);
    setFilteredPruebas(
      v
        ? PruebaMulti.filter(p =>
            p.mensaje.toLowerCase().includes(v.toLowerCase())
          )
        : []
    );
  };

  const handleSelectPrueba = p => {
    setSearchPrueba(p.mensaje);
    setDatos(d => ({ ...d, tipoPrueba: p.mensaje }));
    setFilteredPruebas([]);
    document.getElementById('cargoDe')?.focus();
  };
// — Estados y handlers para los demás autocompletes —
  // Cargo
  const [searchCargo, setSearchCargo] = useState(datos.cargoDe);
  const [filteredCargos, setFilteredCargos] = useState([]);
  const handleCargoSearch = e => {
    const v = e.target.value;
    setSearchCargo(v);
    setFilteredCargos(
      v
        ? CargosMulti.filter(c =>
            c.mensaje.toLowerCase().includes(v.toLowerCase())
          )
        : []
    );
  };
  const handleSelectCargo = c => {
    setSearchCargo(c.mensaje);
    setDatos(d => ({ ...d, cargoDe: c.mensaje }));
    setFilteredCargos([]);
    document.getElementById('areaO')?.focus();
  };

  // Área
  const [searchArea, setSearchArea] = useState(datos.areaO);
  const [filteredAreas, setFilteredAreas] = useState([]);
  const handleAreaSearch = e => {
    const v = e.target.value;
    setSearchArea(v);
    setFilteredAreas(
      v
        ? AreaMulti.filter(a =>
            a.mensaje.toLowerCase().includes(v.toLowerCase())
          )
        : []
    );
  };
  const handleSelectArea = a => {
    setSearchArea(a.mensaje);
    setDatos(d => ({ ...d, areaO: a.mensaje }));
    setFilteredAreas([]);
    document.getElementById('nomExamen')?.focus();
  };

  // Examen Médico
  const [searchExamenMedico, setSearchExamenMedico] = useState(datos.nomExamen);
  const [filteredExamMed, setFilteredExamMed]     = useState([]);
  const handleExamenMedSearch = e => {
    const v = e.target.value;
    setSearchExamenMedico(v);
    setFilteredExamMed(
      v
        ? ExamenMulti.filter(x =>
            x.mensaje.toLowerCase().includes(v.toLowerCase())
          )
        : []
    );
  };
  const handleSelectExamenMed = x => {
    setSearchExamenMedico(x.mensaje);
    setDatos(d => ({ ...d, nomExamen: x.mensaje }));
    setFilteredExamMed([]);
    document.getElementById('nomEx')?.focus();
  };

  // Explotación en
  const [searchExplotacion, setSearchExplotacion] = useState(datos.nomEx);
  const [filteredExplot, setFilteredExplot]     = useState([]);
  const handleExplotSearch = e => {
    const v = e.target.value;
    setSearchExplotacion(v);
    setFilteredExplot(
      v
        ? ExplotacionMulti.filter(x =>
            x.mensaje.toLowerCase().includes(v.toLowerCase())
          )
        : []
    );
  };
  const handleSelectExplot = x => {
    setSearchExplotacion(x.mensaje);
    setDatos(d => ({ ...d, nomEx: x.mensaje }));
    setFilteredExplot([]);
    document.getElementById('mineralPo')?.focus();
  };

  // Mineral Exp
  const [searchMineral, setSearchMineral] = useState(datos.mineralPo);
  const [filteredMinerals, setFilteredMinerals] = useState([]);
  const handleMineralSearch = e => {
    const v = e.target.value;
    setSearchMineral(v);
    setFilteredMinerals(
      v
        ? MineralMulti.filter(m =>
            m.mensaje.toLowerCase().includes(v.toLowerCase())
          )
        : []
    );
  };
  const handleSelectMineral = m => {
    setSearchMineral(m.mensaje);
    setDatos(d => ({ ...d, mineralPo: m.mensaje }));
    setFilteredMinerals([]);
    document.getElementById('alturaPo')?.focus();
  };

  // Altura
  const [searchAltura, setSearchAltura] = useState(datos.alturaPo);
  const [filteredAlturas, setFilteredAlturas] = useState([]);
  const handleAlturaSearch = e => {
    const v = e.target.value;
    setSearchAltura(v);
    setFilteredAlturas(
      v
        ? AlturaMulti.filter(a =>
            a.mensaje.toLowerCase().includes(v.toLowerCase())
          )
        : []
    );
  };
  const handleSelectAltura = a => {
    setSearchAltura(a.mensaje);
    setDatos(d => ({ ...d, alturaPo: a.mensaje }));
    setFilteredAlturas([]);
    document.getElementById('protocolo')?.focus();
  };

  // Protocolo (reemplaza estos valores por los tuyos)
  const protocoloOptions = [
    { id: 1, mensaje: 'Protocolo A' },
    { id: 2, mensaje: 'Protocolo B' },
    // …
  ];
  const [searchProtocolo, setSearchProtocolo] = useState(datos.protocolo || '');
  const [filteredProtocolos, setFilteredProtocolos] = useState([]);
  const handleProtocoloSearch = e => {
    const v = e.target.value;
    setSearchProtocolo(v);
    setFilteredProtocolos(
      v
        ? protocoloOptions.filter(p =>
            p.mensaje.toLowerCase().includes(v.toLowerCase())
          )
        : []
    );
  };
  const handleSelectProtocolo = p => {
    setSearchProtocolo(p.mensaje);
    setDatos(d => ({ ...d, protocolo: p.mensaje }));
    setFilteredProtocolos([]);
  };



  useEffect(() => {
    const data = {
      opcion_id_p: 1,
      norden_: 0,
      nombres_apellidos_p: ""
    }
    GetHistoriaC(data,props.selectedSede,props.token)
    .then((res) => {
      if (res) {
        setSearchHC(res)
      } else {
        setSearchHC([])
      }
    })
    .catch(() => {
      console.log('ocurrio un telibre error')
    })
  },[])
  
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
    getFetch(`/api/v01/ct/consentDigit/busquedaHistoriaOcupNOrden/${value.n_orden}`,props.token)
    .then((res) => {
      console.log(res)
      setDatos(res)
    })
    
    setRegister(false)
    setHabilitar(true)
    setShowEdit(true)
  }

  const SearchHC = (event,type) => {
    if (event.key === 'Enter') {
      if (type==='code') {
        setSearchP(prev => ({
          ...prev,
          nombre: ""
        }));
        const data = {
          opcion_id_p: 2,
          norden: Number(SearchP.code),
          nombres_apellidos_p: ""
        }
        GetHistoriaC(data,props.selectedSede,props.token)
        .then((res) => {
          console.log(res)
          if (res) {
            setSearchHC(res)
          } else {
            setSearchHC([])
          }
        })
      } else {
        setSearchP(prev => ({
          ...prev,
          code: 0
        }));
        const data = {
          opcion_id_p: 3,
          norden: "",
          nombres_apellidos_p: SearchP.nombre
        }
        GetHistoriaC(data,props.selectedSede,props.token)
        .then((res) => {
          if (res) {
            setSearchHC(res)
          } else {
            setSearchHC([])
          }
        })
      }
    }
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
      razonEmpresa:"",
      razonContrata: "",
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
    setHabilitar(false)
    setRegister(true)
  }

  const  GetDatoHR = (HC) => {
    return new Promise((resolve, reject) => {
      getFetch(`/api/v01/ct/consentDigit/infoFormatoHojaRuta/${HC}`, props.token)
        .then(res => {
          resolve(res); // 🔥 devolvemos el resultado exitosamente
        })
        .catch(error => {
          reject(error); // ⚡ devolvemos el error si falla
        });
    });
  }

  const InfoHR = (HC) => {
    getFetch(`/api/v01/ct/consentDigit/nombreHojaRuta?nameExamen=${datos.nomExamen}&empresa=${datos.razonEmpresa}&altaPsicosen=${datos.n_psicosen}&testAltura=${datos.n_testaltura}`,props.token)
    .then(async(res) => {
      if (res.id === 1) {
        const jasperName = res.mensaje; // por ejemplo: 'TestAltura1'
        const filePath = `../../../jaspers/${jasperName}.jsx`;

        if (jasperModules[filePath]) {
          const module = await jasperModules[filePath](); // carga el módulo
          if (typeof module.default === 'function') {
            const datos = await GetDatoHR(HC)
            Swal.fire({
              title: "Hoja de Ruta",
              text: "¿Desea Imprimir?.",
              icon: "success",
              cancelButtonText: "Cancelar"
            }).then((result) => {
              if (result.isConfirmed) module.default(datos);
            });
          } else {
            console.warn('El módulo no exporta una función por defecto');
          }
        } else {
          Swal.fire('Advertencia', `No se encontró el componente jasper: ${jasperName}`, 'warning');
        }
      }
    })
  }

  const InfoHR2 = (HC,nomExamen,razonEmpresa,n_psicosen,n_testaltura) => {
    getFetch(`/api/v01/ct/consentDigit/nombreHojaRuta?nameExamen=${nomExamen}&empresa=${razonEmpresa}&altaPsicosen=${n_psicosen}&testAltura=${n_testaltura}`,props.token)
    .then(async(res) => {
      if (res.id === 1) {
        const jasperName = res.mensaje; // por ejemplo: 'TestAltura1'
        const filePath = `../../../jaspers/${jasperName}.jsx`;
        
        if (jasperModules[filePath]) {
          const module = await jasperModules[filePath](); // carga el módulo
          if (typeof module.default === 'function') {
            
            const datos = await GetDatoHR(HC)
            Swal.fire({
              title: "Hoja de Ruta",
              text: "¿Desea Imprimir?.",
              icon: "success",
              cancelButtonText: "Cancelar"
            }).then((result) => {
              if (result.isConfirmed) module.default(datos);
            });
          } else {
            console.warn('El módulo no exporta una función por defecto');
          }
        } else {
          Swal.fire('Advertencia', `No se encontró el componente jasper: ${jasperName}`, 'warning');
        }
      }
    })
  }

  //doble click
  const SearchClickRight = (n_orden) => {
    Swal.fire({
      title: 'Cargando Hoja de Ruta',
      text: 'Espere por favor...',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    getFetch(`/api/v01/ct/consentDigit/busquedaHistoriaOcupNOrden/${n_orden.n_orden}`,props.token)
    .then((res) => {
      InfoHR2(res.n_orden, res.nomExamen, res.razonEmpresa, res.n_psicosen, res.n_testaltura)
    })
    
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
      console.log(res)
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
      console.log(res)
      if (!res.id) {
          Swal.fire('Error', 'No se ha podido registrar la Historia Clinica', 'error');
        } else {
          InfoHR(res.id)
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
        <div className="grid md:grid-cols-2 sm:flex-col gap-5 ">
          <div className="w-full sm:w-full md:w-auto   ">
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
              {/* — Autocomplete Empresa — */}
              <div className="flex items-center space-x-2 mb-1">
                <label htmlFor="razonEmpresa" className="block w-32">
                  Empresa:
                </label>
                <div className="relative flex-grow">
                  <input
                    id="razonEmpresa"
                    name="razonEmpresa"
                    type="text"
                    value={datos.razonEmpresa}
                    placeholder="Escribe para buscar empresa..."
                    disabled={habilitar}
                    onChange={handleEmpresaSearch}
                    className="border pointer border-gray-300 px-3 py-1 mb-1 rounded-md focus:outline-none bg-white w-full"
                    onKeyDown={e => {
                      if (e.key === 'Enter' && filteredEmpresas.length > 0) {
                        e.preventDefault();
                        handleSelectEmpresa(filteredEmpresas[0]);
                      }
                    }}
                    onFocus={() => {
                      if (searchEmpresa) {
                        setFilteredEmpresas(
                          EmpresasMulti.filter(emp =>
                            emp.mensaje.toLowerCase().includes(searchEmpresa.toLowerCase())
                          )
                        );
                      }
                    }}
                    onBlur={() => setTimeout(() => setFilteredEmpresas([]), 100)}
                  />
                  {searchEmpresa && filteredEmpresas.length > 0 && (
                    <ul className="absolute inset-x-0 top-full bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto z-10">
                      {filteredEmpresas.map(emp => (
                        <li
                          key={emp.id}
                          className="cursor-pointer px-3 py-2 hover:bg-gray-100"
                          onMouseDown={() => handleSelectEmpresa(emp)}
                        >
                          {emp.mensaje}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* — Autocomplete Contrata — */}
              <div className="flex items-center space-x-2 mb-1">
                <label htmlFor="razonContrata" className="block w-32">Contrata:</label>
                <div className="relative flex-grow">
                  <input
                    id="razonContrata"
                    name="razonContrata"
                    type="text"
                    value={searchContrata}
                    placeholder="Escribe para buscar contrata..."
                    disabled={habilitar}
                    onChange={handleContrataSearch}
                    className="border pointer border-gray-300 px-3 py-1 mb-1 rounded-md focus:outline-none bg-white w-full"
                    onKeyDown={e => {
                      if (e.key === 'Enter' && filteredContratas.length > 0) {
                        e.preventDefault();
                        handleSelectContrata(filteredContratas[0]);
                      }
                    }}
                    onFocus={() => {
                      if (searchContrata) {
                        setFilteredContratas(
                          ContrataMulti.filter(c =>
                            c.mensaje.toLowerCase().includes(searchContrata.toLowerCase())
                          )
                        );
                      }
                    }}
                    onBlur={() => setTimeout(() => setFilteredContratas([]), 100)}
                  />
                  {searchContrata && filteredContratas.length > 0 && (
                    <ul className="absolute inset-x-0 top-full bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto z-10">
                      {filteredContratas.map(c => (
                        <li
                          key={c.id}
                          className="cursor-pointer px-3 py-2 hover:bg-gray-100"
                          onMouseDown={() => handleSelectContrata(c)}
                        >
                          {c.mensaje}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* — Autocomplete Médico Ocupacional — */}
              <div className="flex items-center space-x-2 mb-1">
                <label htmlFor="n_medico" className="block w-32">Médico Ocup.:</label>
                <div className="relative flex-grow">
                  <input
                    id="n_medico"
                    name="n_medico"
                    type="text"
                    value={searchMedico}
                    placeholder="Escribe para buscar médico..."
                    disabled={habilitar}
                    onChange={handleMedicoSearch}
                    className="border pointer border-gray-300 px-3 py-1 mb-1 rounded-md focus:outline-none bg-white w-full"
                    onKeyDown={e => {
                      if (e.key === 'Enter' && filteredMedicos.length > 0) {
                        e.preventDefault();
                        handleSelectMedico(filteredMedicos[0]);
                      }
                    }}
                    onFocus={() => {
                      if (searchMedico) {
                        setFilteredMedicos(
                          MedicosMulti.filter(m =>
                            m.mensaje.toLowerCase().includes(searchMedico.toLowerCase())
                          )
                        );
                      }
                    }}
                    onBlur={() => setTimeout(() => setFilteredMedicos([]), 100)}
                  />
                  {searchMedico && filteredMedicos.length > 0 && (
                    <ul className="absolute inset-x-0 top-full bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto z-10">
                      {filteredMedicos.map(m => (
                        <li
                          key={m.id}
                          className="cursor-pointer px-3 py-2 hover:bg-gray-100"
                          onMouseDown={() => handleSelectMedico(m)}
                        >
                          {m.mensaje}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* — Autocomplete Tipo de Prueba — */}
              <div className="flex items-center space-x-2 mb-1">
                <label htmlFor="tipoPrueba" className="block w-32">Tipo Prueba:</label>
                <div className="relative flex-grow">
                  <input
                    id="tipoPrueba"
                    name="tipoPrueba"
                    type="text"
                    value={searchPrueba}
                    placeholder="Escribe para buscar prueba..."
                    disabled={habilitar}
                    onChange={handlePruebaSearch}
                    className="border pointer border-gray-300 px-3 py-1 mb-1 rounded-md focus:outline-none bg-white w-full"
                    onKeyDown={e => {
                      if (e.key === 'Enter' && filteredPruebas.length > 0) {
                        e.preventDefault();
                        handleSelectPrueba(filteredPruebas[0]);
                      }
                    }}
                    onFocus={() => {
                      if (searchPrueba) {
                        setFilteredPruebas(
                          PruebaMulti.filter(p =>
                            p.mensaje.toLowerCase().includes(searchPrueba.toLowerCase())
                          )
                        );
                      }
                    }}
                    onBlur={() => setTimeout(() => setFilteredPruebas([]), 100)}
                  />
                  {searchPrueba && filteredPruebas.length > 0 && (
                    <ul className="absolute inset-x-0 top-full bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto z-10">
                      {filteredPruebas.map(p => (
                        <li
                          key={p.id}
                          className="cursor-pointer px-3 py-2 hover:bg-gray-100"
                          onMouseDown={() => handleSelectPrueba(p)}
                        >
                          {p.mensaje}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

            <div className="mb-1 mt-5">
              <h2 className="text-lg font-bold">Área Pre-Ocupacional</h2>
            </div>
          {/* — Autocomplete Cargo — */}
            <div className="flex items-center space-x-2 mb-1">
              <label htmlFor="cargoDe" className="block w-32">Cargo:</label>
              <div className="relative flex-grow">
                <input
                  id="cargoDe"
                  name="cargoDe"
                  type="text"
                  value={searchCargo}
                  placeholder="Escribe para buscar cargo..."
                  disabled={habilitar}
                  onChange={handleCargoSearch}
                  className="border border-gray-300 px-3 py-1 rounded-md bg-white w-full"
                  onKeyDown={e => {
                    if (e.key==='Enter' && filteredCargos.length>0) {
                      e.preventDefault(); handleSelectCargo(filteredCargos[0]);
                    }
                  }}
                  onFocus={()=> setFilteredCargos(
                    CargosMulti.filter(c=>c.mensaje.toLowerCase().includes(searchCargo.toLowerCase()))
                  )}
                  onBlur={()=>setTimeout(()=>setFilteredCargos([]),100)}
                />
                {searchCargo && filteredCargos.length>0 && (
                  <ul className="absolute inset-x-0 top-full bg-white border rounded-md mt-1 max-h-40 overflow-y-auto z-10">
                    {filteredCargos.map(c=>(
                      <li
                        key={c.id}
                        className="cursor-pointer px-3 py-2 hover:bg-gray-100"
                        onMouseDown={()=>handleSelectCargo(c)}
                      >{c.mensaje}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* — Autocomplete Área — */}
            <div className="flex items-center space-x-2 mb-1">
              <label htmlFor="areaO" className="block w-32">Área:</label>
              <div className="relative flex-grow">
                <input
                  id="areaO" name="areaO" type="text"
                  value={searchArea} placeholder="Escribe para buscar área..."
                  disabled={habilitar} onChange={handleAreaSearch}
                  className="border border-gray-300 px-3 py-1 rounded-md bg-white w-full"
                  onKeyDown={e=>{ if(e.key==='Enter'&&filteredAreas.length>0){e.preventDefault();handleSelectArea(filteredAreas[0]);} }}
                  onFocus={()=>setFilteredAreas(AreaMulti.filter(a=>a.mensaje.toLowerCase().includes(searchArea.toLowerCase())))}
                  onBlur={()=>setTimeout(()=>setFilteredAreas([]),100)}
                />
                {searchArea&&filteredAreas.length>0&&(
                  <ul className="absolute inset-x-0 top-full bg-white border rounded-md mt-1 max-h-40 overflow-y-auto z-10">
                    {filteredAreas.map(a=>(
                      <li key={a.id} className="cursor-pointer px-3 py-2 hover:bg-gray-100"
                          onMouseDown={()=>handleSelectArea(a)}>
                        {a.mensaje}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* — Autocomplete Examen Médico — */}
            <div className="flex items-center space-x-2 mb-1">
              <label htmlFor="nomExamen" className="block w-32">Examen Médico:</label>
              <div className="relative flex-grow">
                <input
                  id="nomExamen" name="nomExamen"
                  type="text" value={searchExamenMedico}
                  placeholder="Escribe para buscar examen..."
                  disabled={habilitar} onChange={handleExamenMedSearch}
                  className="border border-gray-300 px-3 py-1 rounded-md bg-white w-full"
                  onKeyDown={e=>{ if(e.key==='Enter'&&filteredExamMed.length>0){e.preventDefault();handleSelectExamenMed(filteredExamMed[0]);} }}
                  onFocus={()=>setFilteredExamMed(ExamenMulti.filter(x=>x.mensaje.toLowerCase().includes(searchExamenMedico.toLowerCase())))}
                  onBlur={()=>setTimeout(()=>setFilteredExamMed([]),100)}
                />
                {searchExamenMedico&&filteredExamMed.length>0&&(
                  <ul className="absolute inset-x-0 top-full bg-white border rounded-md mt-1 max-h-40 overflow-y-auto z-10">
                    {filteredExamMed.map(x=>(
                      <li key={x.id} className="cursor-pointer px-3 py-2 hover:bg-gray-100"
                          onMouseDown={()=>handleSelectExamenMed(x)}>
                        {x.mensaje}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

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
         
            {/* — Autocomplete Explotación en — */}
            <div className="flex items-center space-x-2 mb-1">
              <label htmlFor="nomEx" className="block w-32">Explotación en:</label>
              <div className="relative flex-grow">
                <input
                  id="nomEx" name="nomEx"
                  type="text" value={searchExplotacion}
                  placeholder="Escribe para buscar explotación..."
                  disabled={habilitar} onChange={handleExplotSearch}
                  className="border border-gray-300 px-3 py-1 rounded-md bg-white w-full"
                  onKeyDown={e=>{ if(e.key==='Enter'&&filteredExplot.length>0){e.preventDefault();handleSelectExplot(filteredExplot[0]);} }}
                  onFocus={()=>setFilteredExplot(ExplotacionMulti.filter(x=>x.mensaje.toLowerCase().includes(searchExplotacion.toLowerCase())))}
                  onBlur={()=>setTimeout(()=>setFilteredExplot([]),100)}
                />
                {searchExplotacion&&filteredExplot.length>0&&(
                  <ul className="absolute inset-x-0 top-full bg-white border rounded-md mt-1 max-h-40 overflow-y-auto z-10">
                    {filteredExplot.map(x=>(
                      <li key={x.id} className="cursor-pointer px-3 py-2 hover:bg-gray-100"
                          onMouseDown={()=>handleSelectExplot(x)}>
                        {x.mensaje}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* — Autocomplete Mineral Exp — */}
            <div className="flex items-center space-x-2 mb-1">
              <label htmlFor="mineralPo" className="block w-32">Mineral Exp:</label>
              <div className="relative flex-grow">
                <input
                  id="mineralPo" name="mineralPo"
                  type="text" value={searchMineral}
                  placeholder="Escribe para buscar mineral..."
                  disabled={habilitar} onChange={handleMineralSearch}
                  className="border border-gray-300 px-3 py-1 rounded-md bg-white w-full"
                  onKeyDown={e=>{ if(e.key==='Enter'&&filteredMinerals.length>0){e.preventDefault();handleSelectMineral(filteredMinerals[0]);} }}
                  onFocus={()=>setFilteredMinerals(MineralMulti.filter(m=>m.mensaje.toLowerCase().includes(searchMineral.toLowerCase())))}
                  onBlur={()=>setTimeout(()=>setFilteredMinerals([]),100)}
                />
                {searchMineral&&filteredMinerals.length>0&&(
                  <ul className="absolute inset-x-0 top-full bg-white border rounded-md mt-1 max-h-40 overflow-y-auto z-10">
                    {filteredMinerals.map(m=>(
                      <li key={m.id} className="cursor-pointer px-3 py-2 hover:bg-gray-100"
                          onMouseDown={()=>handleSelectMineral(m)}>
                        {m.mensaje}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* — Autocomplete Altura — */}
            <div className="flex items-center space-x-2 mb-1">
              <label htmlFor="alturaPo" className="block w-32">Altura:</label>
              <div className="relative flex-grow">
                <input
                  id="alturaPo" name="alturaPo"
                  type="text" value={searchAltura}
                  placeholder="Escribe para buscar altura..."
                  disabled={habilitar} onChange={handleAlturaSearch}
                  className="border border-gray-300 px-3 py-1 rounded-md bg-white w-full"
                  onKeyDown={e=>{ if(e.key==='Enter'&&filteredAlturas.length>0){e.preventDefault();handleSelectAltura(filteredAlturas[0]);} }}
                  onFocus={()=>setFilteredAlturas(AlturaMulti.filter(a=>a.mensaje.toLowerCase().includes(searchAltura.toLowerCase())))}
                  onBlur={()=>setTimeout(()=>setFilteredAlturas([]),100)}
                />
                {searchAltura&&filteredAlturas.length>0&&(
                  <ul className="absolute inset-x-0 top-full bg-white border rounded-md mt-1 max-h-40 overflow-y-auto z-10">
                    {filteredAlturas.map(a=>(
                      <li key={a.id} className="cursor-pointer px-3 py-2 hover:bg-gray-100"
                          onMouseDown={()=>handleSelectAltura(a)}>
                        {a.mensaje}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
                      
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
              <div className="mb-4">
            <div className="flex items-center space-x-2 mb-1">
              <label htmlFor="fechaApertura" className="block w-1/7">Fecha de Apertura:</label>
              <DatePicker
                selected={stardate}
                value={datos.fechaAperturaPo || stardate}
                disabled={habilitar}
                onChange={handleDateChange}
                dateFormat="yyyy/MM/dd"
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
            
            {/* — Autocomplete Protocolo — */}
            <div className="flex items-center space-x-2 mb-1">
              <label htmlFor="protocolo" className="block w-32">Protocolo:</label>
              <div className="relative flex-grow">
                <input
                  id="protocolo" name="protocolo"
                  type="text" value={searchProtocolo}
                  placeholder="Escribe para buscar protocolo..."
                  disabled={habilitar} onChange={handleProtocoloSearch}
                  className="border border-gray-300 px-3 py-1 rounded-md bg-white w-full"
                  onKeyDown={e=>{ if(e.key==='Enter'&&filteredProtocolos.length>0){e.preventDefault();handleSelectProtocolo(filteredProtocolos[0]);} }}
                  onFocus={()=>setFilteredProtocolos(protocoloOptions.filter(p=>p.mensaje.toLowerCase().includes(searchProtocolo.toLowerCase())))}
                  onBlur={()=>setTimeout(()=>setFilteredProtocolos([]),100)}
                />
                {searchProtocolo&&filteredProtocolos.length>0&&(
                  <ul className="absolute inset-x-0 top-full bg-white border rounded-md mt-1 max-h-40 overflow-y-auto z-10">
                    {filteredProtocolos.map(p=>(
                      <li key={p.id} className="cursor-pointer px-3 py-2 hover:bg-gray-100"
                          onMouseDown={()=>handleSelectProtocolo(p)}>
                        {p.mensaje}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            </div>
          </div>
          {/* Nueva columna con estructura solicitada */}
          <div className="w-full sm:w-full mb-4 pl-4">
          <div className="flex items-center space-x-2 mb-2">
                <label htmlFor="soloMiSede" className="block w-1/6">Solo mi Sede</label>
                <input type="checkbox" id="soloMiSede" name="soloMiSede" className="mr-2 pointer" />

                <label htmlFor="fecha" className="block w-14">Fecha:</label>
                <DatePicker
                  selected={stardate}
                  dateFormat="yyyy/MM/dd"
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
                  value={SearchP.nombre}
                  onChange={(e) => {setSearchP(prev => ({...prev, nombre: e.target.value}))}}
                  id="nombre"
                  onKeyDown={(event) => {SearchHC(event,'nombre')}}
                  name="nombre"
                  className="border border-gray-300 px-3 py-1  mb-1 rounded-md focus:outline-none bg-white flex-grow w-full"
                />
                <label htmlFor="codigo" className="block w-36">Código:</label>
                <input
                  type="text"
                  inputMode="numeric"        // muestra teclado numérico en móviles
                  pattern="\d*"              // solo acepta números
                  value={SearchP.code || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d{0,7}$/.test(value)) { // máximo 7 dígitos numéricos
                      setSearchP(prev => ({
                        ...prev,
                        code: value
                      }));
                    }
                  }}
                  onKeyDown={(event) => {SearchHC(event,'code')}}
                  id="codigo"
                  name="codigo"
                  className="border border-gray-300 px-3 py-1  mb-1 rounded-md focus:outline-none bg-white flex-grow w-full"
                />
              </div>
            <div className="mb-4 ">
              <h3 className="text-lg font-bold mb-2">Últimos Agregados & Hojas de Ruta</h3>
              <div className="overflow-y-auto" style={{ maxHeight: 'calc(12 * 4rem)' }}>
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
                    <tr key={index} className=' cursor-pointer' onClick={() => {handleEdit(option)}} onContextMenu={(e) => {
                      e.preventDefault(); // 🔒 evita el menú del navegador
                      SearchClickRight(option); // ✅ tu función personalizada
                    }}>
                      <td className="border border-gray-300 px-2 py-1  mb-1">{option.n_orden}</td>
                      <td className="border border-gray-300 px-2 py-1  mb-1">{option.nombres}</td>
                      <td className="border border-gray-300 px-2 py-1  mb-1">{option.fecha_apertura_po}</td>
                      <td className="border border-gray-300 px-2 py-1  mb-1">{option.razon_empresa}</td>
                      <td className="border border-gray-300 px-2 py-1  mb-1">{option.razon_contrata}</td>
                      <td className="border border-gray-300 px-2 py-1  mb-1">{option.nom_examen}</td>
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
