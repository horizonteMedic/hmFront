import { useEffect, useState, useRef } from 'react';
import DatePicker from 'react-datepicker';
import Swal from 'sweetalert2';
import 'react-datepicker/dist/react-datepicker.css';
import { SearchPacienteDNI } from '../model/AdminPaciente';
import { GetHistoriaC, SubmitHistoriaC } from '../model/AdminHistoriaC';
import { InputsSelect, InputsSelect2 } from '../InputsSelect';
import { getFetch } from "../../../getFetch/getFetch.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAsterisk, faFileImport } from '@fortawesome/free-solid-svg-icons';
import { ImportData } from '../controller/HC';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import ModalEmpresa from './modals/modalEmpresa/ModalEmpresa';
import ModalContrata from './modals/modalContrata/ModalContrata';
import { format } from 'date-fns';
import { useSessionData } from '../../../../../hooks/useSessionData.js';
import { fixEncodingModern } from '../../../../../utils/helpers.js';
import ModalExamenes from './modals/modalExamenes+/ModalExamenes'

const AperturaExamenesPreOcup = (props) => {
  const today = new Date();
  const [stardate, setStartDate] = useState(new Date());
  const jasperModules = import.meta.glob('../../../../../jaspers/*.jsx'); // ajusta si usas .jsx
  const dniRef = useRef(null);
  const { userlogued } = props;
  const { EmpresasMulti, ContrataMulti, MedicosMulti, PruebaMulti, CargosMulti, AreaMulti,
    ExamenMulti, ExplotacionMulti, MineralMulti, AlturaMulti, FormaPago, ListAuth } = props.listas

  const [isEmpresaModalOpen, setIsEmpresaModalOpen] = useState(false);
  const [isContrataModalOpen, setIsContrataModalOpen] = useState(false);

  const { userCompleto } = useSessionData();

  const handleSaveEmpresa = (data) => {
    // Handle saving empresa data
    console.log('Saving empresa:', data);
    // Add your API call here
  };

  const handleSaveContrata = (data) => {
    // Handle saving contrata data
    console.log('Saving contrata:', data);
    // Add your API call here
  };


  const [datos, setDatos] = useState({
    codPa: props.DNIG ? String(props.DNIG) : "",
    nombres: "",
    apellidos: "",
    razonEmpresa: "",
    rucEmpresa: "",
    razonContrata: "",
    n_medico: "",
    n_hora: "",
    tipoPrueba: "N/A",
    cargoDe: "",
    areaO: "",
    nomExamen: "",
    nomEx: "",
    mineralPo: "",
    alturaPo: "",
    precioPo: "",
    protocolo: "",
    tipoPago: "",
    precioAdic: "",
    autoriza: "",
    fechaAperturaPo: format(today, 'dd/MM/yyyy'),
    n_operacion: "",
    textObserv1: "",
    textObserv2: "",
    n_fisttest: false,
    n_psicosen: false,
    n_testaltura: false,
    trabCalientes: false,
    rxcLumbosacra: false,
    visualCompl: false,
    manipAlimentos: false,
    herraManuales: false,
    rxcDorsoLumbar: false,
    rxcKLumbar: false,
    rxcPlomos: false,
    mercurioo: false,

    espaciosConfinados: false,
    tmarihuana: false,
    tcocaina: false,

    nombreMiUsuario: fixEncodingModern(userCompleto?.datos?.nombres_user),
    userRegistroDatos: ""
  })

  const [searchHC, setSearchHC] = useState([])
  const [showEdit, setShowEdit] = useState(false)
  const [habilitar, setHabilitar] = useState(false)
  const [register, setRegister] = useState(true)
  const [editPri, setEditPri] = useState(false)
  //TABLAHC
  const [SearchP, setSearchP] = useState({
    code: "",
    nombre: ""
  })
  const [refresh, setRefresh] = useState(0)
  const [CanP, setCanP] = useState({ Completos: 0, Faltantes: 0 })
  const [FechaCanP, setFechaCanP] = useState(format(today, 'dd/MM/yyyy'))
  //Examenes Adicionales
  const [modalExam, setModalexam] = useState(false)
  //lista de Protocolos
  const [protocoloOptions, setProtocoloOptions] = useState([])
  useEffect(() => {
    getFetch(`/api/v01/ct/consentDigit/resumenAdmPacientesConFiltros?nomSede=${props.selectedSede}&fecha=${FechaCanP}`, props.token)
      .then((res) => {
        setCanP(d => ({ ...d, Completos: res.completos, Faltantes: res.faltantes }))
      })
  }, [FechaCanP])

  //Traer listas de protocolos
  useEffect(() => {
    if (datos.rucEmpresa) {
      getFetch(`/api/v01/ct/protocolo/obtenerProtocoloRucEmpresa/empresa/${datos.rucEmpresa}`, props.token)
        .then((res) => {
          EnlistarProtos(res)
        })
    }

  }, [datos.rucEmpresa])



  // Autocompletado Empresa
  const [searchEmpresa, setSearchEmpresa] = useState(datos.razonEmpresa);
  const [filteredEmpresas, setFilteredEmpresas] = useState([]);

  useEffect(() => {
    if (props.DNIG) {
      dniRef.current?.focus(); // Aplica focus al montar o cuando cambien props
    }
  }, [props.DNIG])

  const handleEmpresaSearch = e => {
    const v = e.target.value.toUpperCase();

    if (v === "") {
      setDatos(d => ({ ...d, razonEmpresa: "" }));
    }
    setDatos(d => ({ ...d, razonEmpresa: v }))
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
    setDatos(d => ({ ...d, razonEmpresa: emp.mensaje, rucEmpresa: emp.rucEmpresa }));
    setFilteredEmpresas([]);
    // mueve el foco al siguiente campo Contrata
    document.getElementById('razonContrata')?.focus();
  };

  // — Autocomplete Contrata —
  const [searchContrata, setSearchContrata] = useState(datos.razonContrata);
  const [filteredContratas, setFilteredContratas] = useState([]);

  const handleContrataSearch = e => {
    const v = e.target.value.toUpperCase();
    if (v === "") {
      setDatos(d => ({ ...d, razonContrata: "" }));
    }
    setDatos(d => ({ ...d, razonContrata: v }))
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
  const [searchMedico, setSearchMedico] = useState(datos.n_medico);
  const [filteredMedicos, setFilteredMedicos] = useState([]);

  const handleMedicoSearch = e => {
    const v = e.target.value.toUpperCase();
    setSearchMedico(v);
    setDatos(d => ({ ...d, n_medico: v }))
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
  const [searchPrueba, setSearchPrueba] = useState(datos.tipoPrueba);
  const [filteredPruebas, setFilteredPruebas] = useState([]);

  const handlePruebaSearch = e => {
    const v = e.target.value.toUpperCase();
    setDatos(d => ({ ...d, tipoPrueba: v }))
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
    const v = e.target.value.toUpperCase();
    setDatos(d => ({ ...d, cargoDe: v }))
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
    const v = e.target.value.toUpperCase();
    setDatos(d => ({ ...d, areaO: v }))
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
  const [filteredExamMed, setFilteredExamMed] = useState([]);
  const handleExamenMedSearch = e => {
    const v = e.target.value.toUpperCase();
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
    setDatos(d => ({
      ...d,
      nomExamen: x.mensaje
    }));

    setFilteredExamMed([]);
    getFetch(`/api/v01/ct/ocupacional/PrecioExamenMutisucursal/${props.selectedSede}/${x.mensaje}`, props.token)
      .then((res) => {
        setDatos(d => ({
          ...d,
          precioPo: res.mensaje
        }));
      })
      .catch(() => {
        console.log('Telible Error')
      })
    document.getElementById('nomEx')?.focus();
  };

  // Explotación

  // Protocolo (reemplaza estos valores por los tuyos)

  const [searchProtocolo, setSearchProtocolo] = useState(datos.protocolo || '');
  const [filteredProtocolos, setFilteredProtocolos] = useState([]);
  const handleProtocoloSearch = e => {
    const v = e.target.value.toUpperCase();
    if (v === "") {
      setDatos(d => ({ ...d, protocolo: "" }));
    }
    setSearchProtocolo(v);
    setFilteredProtocolos(
      v
        ? protocoloOptions.filter(p =>
          p.nombre.toLowerCase().includes(v.toLowerCase())
        )
        : []
    );
  };
  const handleSelectProtocolo = p => {
    console.log(p)
    setSearchProtocolo(p.nombre);
    setDatos(d => ({ ...d, protocolo: p.nombre }));
    setFilteredProtocolos([]);
  };


  useEffect(() => {

    if (SearchP.code === "" && SearchP.nombre === "") {
      const data = {
        opcion_id_p: 1,
        norden_: 0,
        nombres_apellidos_p: ""
      };

      GetHistoriaC(data, props.selectedSede, props.token)
        .then((res) => {
          if (res) {
            setSearchHC(res);
          } else {
            setSearchHC([]);
          }
        })
        .catch(() => {
          console.log("ocurrió un error");
        });
    }
  }, [SearchP.code, SearchP.nombre, refresh]);

  const [creating, setCreating] = useState(false)

  const handleDateChange = (date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    setStartDate(date);
    setDatos({ ...datos, fechaAperturaPo: formattedDate });
  };



  const newPrice = (value) => {
    props.PrecioC(props.selectedSede, value, props.token)
      .then((res) => {
        setDatos({
          ...datos,
          precioPo: res.mensaje
        })
      })
      .catch(() => {
        console.log('Telible Error')
      })

  }

  const handleCheack = (e) => {
    const { name, checked } = e.target;
    setDatos({
      ...datos,
      [name]: checked
    })
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'nomExamen') {
      newPrice(value.toUpperCase())
      return
    }
    setDatos({
      ...datos,
      [name]: value.toUpperCase(),
    });
  }

  const handleDNI = (e) => {
    const { name, value } = e.target;
    // Solo permitir números y hasta 8 caracteres
    const cleanValue = value.replace(/\D/g, '').slice(0, 8);
    setDatos({
      ...datos,
      [name]: cleanValue
    });
    setRegister(true);
  };

  const handleEdit = (value) => {
    getFetch(`/api/v01/ct/consentDigit/busquedaHistoriaOcupNOrden/${value.n_orden}`, props.token)
      .then((res) => {
        setDatos({
          ...res,
          nombresPa: res.nombres,
          apellidosPa: res.apellidos,
          fechaAperturaPo: formatDate(res.fechaAperturaPo),
          userRegistroDatos: res.usuarioRegistro ?? "",
          protocolo: res.protocolo
        });
        setSearchEmpresa(res.razonEmpresa || "");
        setSearchContrata(res.razonContrata || "")
        setSearchMedico(res.n_medico || "");
        setSearchPrueba(res.tipoPrueba || "")
        setSearchCargo(res.cargoDe || "")
        setSearchArea(res.areaO || "")
        setSearchExamenMedico(res.nomExamen || "")
        setSearchProtocolo(res.protocolo || "")
      })

    setRegister(false)
    setHabilitar(true)
    setShowEdit(true)
  }

  const RendeSet = (res) => {
    setSearchEmpresa(res.razonEmpresa || "");
    setSearchContrata(res.razonContrata || "")
    setSearchMedico(res.n_medico || "");
    setSearchPrueba(res.tipoPrueba || "N/A")
    setSearchCargo(res.cargoDe || "")
    setSearchArea(res.areaO || "")
    setSearchExamenMedico(res.nomExamen || "")
  }

  const SearchHC = (event, type) => {
    if (SearchP.code === "" && SearchP.nombre === "") {
      return;
    }
    if (event.key === 'Enter') {
      Swal.fire({
        title: 'Validando Datos',
        text: 'Espere por favor...',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      if (type === 'code') {
        setSearchP(prev => ({
          ...prev,
          nombre: ""
        }));
        const data = {
          opcion_id_p: 2,
          norden: Number(SearchP.code),
          nombres_apellidos_p: ""
        }
        GetHistoriaC(data, props.selectedSede, props.token)
          .then((res) => {
            if (res) {
              if (res.length) {
                setSearchHC(res); // Solo si tiene elementos
              } else {
                Swal.fire('Sin Resultado', 'No se encontraron registros', 'warning')
              }
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
        GetHistoriaC(data, props.selectedSede, props.token)
          .then((res) => {
            if (res) {
              if (res.length) {
                setSearchHC(res); // Solo si tiene elementos
              } else {
                Swal.fire('Sin Resultado', 'No se encontraron registros', 'warning')
              }
            } else {
              setSearchHC([])
            }
          })
      }
      Swal.close();
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
        showConfirmButton: false,
        showCancelButton: true,
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
        didOpen: () => {
          Swal.showLoading();
        }
      });
      setCreating(true)
      SearchPacienteDNI(props.selectedSede, datos.codPa, props.token)
        .then((res) => {
          if (!res.codPa) {
            return Swal.fire('Error', 'No se ha encontrado al Paciente', 'error');
          }
          setDatos({
            ...datos,
            nombres: res.nombresPa,
            apellidos: res.apellidosPa,
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
      razonEmpresa: "",
      razonContrata: "",
      n_medico: "",
      tipoPrueba: "N/A",
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
      fechaAperturaPo: format(today, 'dd/MM/yyyy'),
      n_operacion: "",
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
      mercurioo: false,//13}

      espaciosConfinados: false,
      tmarihuana: false,
      tcocaina: false,

      nombres: "",
      apellidos: "",
      userRegistroDatos: "",
    })
    RendeSet("")
    props.ChangeDNI("")
    setShowEdit(false)
    setHabilitar(false)
    setRegister(true)
  }

  const GetDatoHR = (HC) => {
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
    getFetch(`/api/v01/ct/consentDigit/nombreHojaRuta?nameExamen=${datos.nomExamen}&empresa=${datos.razonEmpresa}&altaPsicosen=${datos.n_psicosen}&testAltura=${datos.n_testaltura}`, props.token)
      .then(async (res) => {
        if (res.id === 1) {
          const jasperName = res.mensaje; // por ejemplo: 'TestAltura1'
          const filePath = `../../../../../jaspers/${jasperName}.jsx`;
          if (jasperModules[filePath]) {
            const module = await jasperModules[filePath](); // carga el módulo
            if (typeof module.default === 'function') {
              const datos = await GetDatoHR(HC)

              // Obtener la fecha del registro que se va a imprimir
              const registroActual = searchHC.find(item => item.n_orden === HC);
              const fechaRegistro = registroActual ? registroActual.fecha_apertura_po : null;

              if (fechaRegistro) {
                // Filtrar registros de la misma fecha del registro
                const registrosMismaFecha = searchHC.filter(item => item.fecha_apertura_po === fechaRegistro);

                // Buscar la posición del registro en la lista filtrada de esa fecha
                const indiceRegistro = registrosMismaFecha.findIndex(item => item.n_orden === HC);
                const numeroOrden = indiceRegistro !== -1 ? registrosMismaFecha.length - indiceRegistro : 1;

                // Agregar el número de orden a los datos
                const datosConOrden = {
                  ...datos,
                  numeroOrden: numeroOrden
                };

                Swal.fire({
                  title: "Hoja de Ruta",
                  text: "¿Desea Imprimir?.",
                  icon: "success",
                  cancelButtonText: "Cancelar"
                }).then((result) => {
                  if (result.isConfirmed) module.default(datosConOrden);
                });
              } else {
                // Si no se encuentra el registro en searchHC (caso de nuevo registro), usar la fecha actual
                const fechaHoy = format(new Date(), 'yyyy-MM-dd');

                // Filtrar registros de la fecha de hoy
                const registrosHoy = searchHC.filter(item => item.fecha_apertura_po === fechaHoy);

                // El nuevo registro será el siguiente número
                const numeroOrden = registrosHoy.length + 1;

                // Agregar el número de orden a los datos
                const datosConOrden = {
                  ...datos,
                  numeroOrden: numeroOrden
                };

                Swal.fire({
                  title: "Hoja de Ruta",
                  text: "¿Desea Imprimir?.",
                  icon: "success",
                  cancelButtonText: "Cancelar"
                }).then((result) => {
                  if (result.isConfirmed) module.default(datosConOrden);
                });
              }
            } else {
              console.warn('El módulo no exporta una función por defecto');
            }
          } else {
            Swal.fire('Advertencia', `No se encontró el componente jasper: ${jasperName}`, 'warning');
          }
        }
      })
  }

  const SearchClickRight = (n_orden) => {
    Swal.fire({
      title: `<span style="font-size:1.3em;font-weight:bold;">Cargando Hoja de Ruta</span>`,
      html: `<div style="font-size:1.1em;">N° <b style='color:#2563eb;'>${n_orden.n_orden}</b> - <span style='color:#0d9488;font-weight:bold;'>${n_orden.nombres}</span></div><div class='mt-2'>Espere por favor...</div>`,
      icon: 'info',
      background: '#f0f6ff',
      color: '#22223b',
      showConfirmButton: false,
      allowOutsideClick: true,
      allowEscapeKey: true,
      customClass: {
        popup: 'swal2-border-radius',
        title: 'swal2-title-custom',
        htmlContainer: 'swal2-html-custom',
      },
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      },
      didOpen: () => {
        Swal.showLoading();
      }
    });
    getFetch(`/api/v01/ct/consentDigit/busquedaHistoriaOcupNOrden/${n_orden.n_orden}`, props.token)
      .then((res) => {
        InfoHR2(res.n_orden, res.nomExamen, res.razonEmpresa, res.n_psicosen, res.n_testaltura, res.nombres);
      })
  }

  const InfoHR2 = (HC, nomExamen, razonEmpresa, n_psicosen, n_testaltura, nombres) => {
    getFetch(`/api/v01/ct/consentDigit/nombreHojaRuta?nameExamen=${nomExamen}&empresa=${razonEmpresa}&altaPsicosen=${n_psicosen}&testAltura=${n_testaltura}`, props.token)
      .then(async (res) => {
        if (res.id === 1) {
          const jasperName = res.mensaje; // por ejemplo: 'TestAltura1'
          const filePath = `../../../../../jaspers/${jasperName}.jsx`;
          if (jasperModules[filePath]) {
            const module = await jasperModules[filePath](); // carga el módulo
            if (typeof module.default === 'function') {
              const datos = await GetDatoHR(HC)

              // Obtener la fecha del registro que se va a imprimir
              const registroActual = searchHC.find(item => item.n_orden === HC);
              const fechaRegistro = registroActual ? registroActual.fecha_apertura_po : null;

              if (fechaRegistro) {
                // Filtrar registros de la misma fecha del registro
                const registrosMismaFecha = searchHC.filter(item => item.fecha_apertura_po === fechaRegistro);

                // Buscar la posición del registro en la lista filtrada de esa fecha
                const indiceRegistro = registrosMismaFecha.findIndex(item => item.n_orden === HC);
                const numeroOrden = indiceRegistro !== -1 ? registrosMismaFecha.length - indiceRegistro : 1;

                // Agregar el número de orden a los datos
                const datosConOrden = {
                  ...datos,
                  numeroOrden: numeroOrden
                };

                Swal.fire({
                  title: `<span style='font-size:1.3em;font-weight:bold;'>¿Desea Imprimir Hoja de Ruta?</span>`,
                  html: `<div style='font-size:1.1em;'>N° <b style='color:#2563eb;'>${HC}</b> - <span style='color:#0d9488;font-weight:bold;'>${nombres}</span></div>`,
                  icon: 'question',
                  background: '#f0f6ff',
                  color: '#22223b',
                  showCancelButton: true,
                  confirmButtonText: 'Sí, Imprimir',
                  cancelButtonText: 'Cancelar',
                  customClass: {
                    popup: 'swal2-border-radius',
                    title: 'swal2-title-custom',
                    htmlContainer: 'swal2-html-custom',
                    confirmButton: 'swal2-confirm-custom',
                    cancelButton: 'swal2-cancel-custom',
                  },
                  showClass: {
                    popup: 'animate__animated animate__fadeInDown'
                  },
                  hideClass: {
                    popup: 'animate__animated animate__fadeOutUp'
                  }
                }).then((result) => {
                  if (result.isConfirmed) module.default(datosConOrden);
                });
              } else {
                // Fallback si no se encuentra el registro
                Swal.fire({
                  title: "Error",
                  text: "No se pudo determinar la fecha del registro",
                  icon: "error"
                });
              }
            } else {
              console.warn('El módulo no exporta una función por defecto');
            }
          } else {
            Swal.fire('Advertencia', `No se encontró el componente jasper: ${jasperName}`, 'warning');
          }
        }
      })
  }

  const handleSubmitEdit = e => {
    const camposRequeridos = ['codPa', 'nombres', 'apellidos', 'razonEmpresa', 'razonContrata', 'n_medico', 'tipoPrueba',
      'cargoDe', 'areaO', 'nomExamen', 'nomEx', 'mineralPo', 'alturaPo', 'tipoPago', 'fechaAperturaPo']; // agrega los campos que quieras
    const camposVacios = camposRequeridos.filter(campo => !datos[campo]);
    if (camposVacios.length > 0) {
      const lista = camposVacios.join(', ');
      return Swal.fire('Error', `Faltan completar: ${lista}`, 'error');
    }

    Swal.fire({
      title: 'Validando Datos',
      text: 'Espere por favor...',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      showCancelButton: true,
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      didOpen: () => {
        Swal.showLoading();
      }
    });
    SubmitHistoriaC({ ...datos, user_registro: userlogued }, props.selectedSede, props.token, 2)
      .then((res) => {
        if (!res.id) {
          Swal.fire('Error', 'No se ha podido editar la Historia Clinica', 'error');
        } else {
          Swal.fire('Editado', 'Historia Clinica Editado', 'success');
          handleLimpiar()
          setRefresh(refresh + 1)
        }
      })
      .catch(() => {
        console.log('telible error')
      })
  }

  const handleSubmit = (e) => {
    const camposRequeridos = ['codPa', 'nombres', 'apellidos', 'razonEmpresa', 'razonContrata', 'n_medico', 'tipoPrueba',
      'cargoDe', 'areaO', 'nomExamen', 'nomEx', 'mineralPo', 'alturaPo', 'tipoPago', 'fechaAperturaPo']; // agrega los campos que quieras
    const camposVacios = camposRequeridos.filter(campo => !datos[campo]);
    if (camposVacios.length > 0) {
      const lista = camposVacios.join(', ');
      return Swal.fire('Error', `Faltan completar: ${lista}`, 'error');
    }

    Swal.fire({
      title: 'Validando Datos',
      text: 'Espere por favor...',
      allowOutsideClick: false,
      allowEscapeKey: true,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    SubmitHistoriaC({ ...datos, user_registro: userlogued }, props.selectedSede, props.token, 1)
      .then((res) => {
        if (!res.id) {
          Swal.fire('Error', 'No se ha podido registrar la Historia Clinica', 'error');
        } else {
          setSearchP(prev => ({ ...prev, code: "", nombre: "" }));
          handleLimpiar()
          InfoHR(res.id)
          setRefresh(refresh + 1)
        }
      })
      .catch(() => {
        console.log('telible error')
      })
  };

  // Formateo en DD-MM-AAAA mientras escribes
  // Formateo en DD/MM/AAAA mientras escribes
  const handleFechaAperturaInput = e => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 8);
    let formatted = raw;
    if (raw.length >= 5) {
      formatted = raw.replace(/(\d{2})(\d{2})(\d{0,4})/, '$1/$2/$3');
    } else if (raw.length >= 3) {
      formatted = raw.replace(/(\d{2})(\d{0,2})/, '$1/$2');
    }
    setDatos(d => ({ ...d, fechaAperturaPo: formatted }));
  };

  // Debounce para evitar demasiadas llamadas
  const debounceTimeout = useRef(null);

  // Reemplaza el onChange del input de nombre por una función con debounce
  const handleNombreChange = (e) => {
    const value = e.target.value.toUpperCase();
    setSearchP(prev => ({ ...prev, nombre: value, code: "" }));

    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      if (value.trim() !== "") {
        const data = {
          opcion_id_p: 3,
          norden: "",
          nombres_apellidos_p: value
        };
        GetHistoriaC(data, props.selectedSede, props.token)
          .then((res) => {
            if (res && res.length) {
              setSearchHC(res);
            } else {
              setSearchHC([]);
            }
          })
          .catch(() => setSearchHC([]));
      } else {
        setSearchHC([]);
      }
    }, 400);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    if (typeof dateString === 'string' && (dateString.includes('GMT') || dateString.includes('hora estándar'))) {
      return '';
    }

    const parts = dateString.split(/[/-]/); // acepta "2015/02/16" o "2015-02-16"
    if (parts.length !== 3) return '';

    const [year, month, day] = parts.map(Number);
    if (!year || !month || !day) return '';

    return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
  };

  const EnlistarProtos = (res) => {
    console.log(res)
    setDatos(d => ({ ...d, protocolo: "" }));
    setSearchProtocolo("");
    const Toast = Swal.mixin({
      toast: true,
      position: "top-start",
      showConfirmButton: false,
      timer: 7000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
    if (res.estatus === "OK") {
      setProtocoloOptions(res.resultado)
      Toast.fire({
        icon: "success",
        title: `Lista de Protocolos Activa para Empresa: ${datos.razonEmpresa}`
      });
    } else {
      setProtocoloOptions([])
      Toast.fire({
        icon: "error",
        title: `No Existe Lista de Protocolos para Empresa: ${datos.razonEmpresa}`
      });
    }
  }

  return (
    <div >
      <div className="grid md:grid-cols-2 sm:flex-col gap-5 px-4">
        <div className="w-full sm:w-full md:w-auto text-lg font-semibold  ">
          <div className="mb-1 pb-2">
            <h2 className="text-lg font-bold">Datos</h2>
          </div>
          <div className="flex items-center space-x-2 mb-1">
            <label htmlFor="dni" className="block w-40">DNI:</label>
            <input autoComplete="off"
              type="text"
              id="codPa"
              ref={dniRef}
              disabled={creating || habilitar}
              value={datos.codPa}
              maxLength={8}
              onKeyDown={handleSearch}
              onChange={handleDNI}
              name="codPa"
              className={`border border-gray-300 px-3 py-1  mb-1 rounded-md focus:outline-none  flex-grow w-full ${habilitar ? "bg-slate-400" : "bg-slate-100"}`}
            />
            <button
              onClick={() => {
                const wrappedSetDatos = (importedData) => {
                  setDatos(prev => ({
                    ...prev,
                    ...importedData,
                    fechaAperturaPo: format(new Date(), 'dd/MM/yyyy') // Ensure this is always today
                  }));
                };
                ImportData(datos.codPa, Swal, getFetch, props.token, wrappedSetDatos, RendeSet);
              }}
              className='mr-2 flex items-center justify-center border-1 border-blue-500 text-white px-3 py-1 bg-blue-800 mb-1 rounded-md hover:bg-blue-500 hover:text-white focus:outline-none'
            >
              <FontAwesomeIcon icon={faFileImport} className="mr-2" />
              IMPORTAR
            </button>
            <label htmlFor="apellidos" className="block w-36">G.Sang.:</label>
            <input autoComplete="off"
              type="text"
              disabled={habilitar}
              className={`border border-gray-300 px-3 py-1  mb-1 rounded-md focus:outline-none flex-grow w-12 ${habilitar ? "bg-slate-300" : "bg-slate-100"}`}
            />
            <input autoComplete="off"
              type="text"
              disabled={habilitar}
              className={`border border-gray-300 px-3 py-1  mb-1 rounded-md focus:outline-none  flex-grow w-12 ${habilitar ? "bg-slate-300" : "bg-slate-100"}`}
            />
          </div>
          <div className="flex items-center space-x-2 mb-1">
            <label htmlFor="nombre" className="block w-[14em]">Nombre:</label>
            <input autoComplete="off"
              type="text"
              disabled={habilitar}
              id="nombres"
              onChange={handleChange}
              value={datos.nombres}
              name="nombres"
              className={`border border-gray-300 px-3 py-1  mb-1 rounded-md focus:outline-none flex-grow w-full ${habilitar ? "bg-slate-300" : "bg-slate-100"}`}
            />
            <label htmlFor="apellidos" className="block w-[14em]">Apellidos:</label>
            <input autoComplete="off"
              type="text"
              disabled={habilitar}
              id="apellidos"
              onChange={handleChange}
              value={datos.apellidos}
              name="apellidos"
              className={`border border-gray-300 px-3 py-1  mb-1 rounded-md focus:outline-none flex-grow w-full ${habilitar ? "bg-slate-300" : "bg-slate-100"}`}
            />
          </div>
          {/* — Autocomplete Empresa — */}
          <div className="flex items-center space-x-2 mb-1">
            <label htmlFor="razonEmpresa" className="block w-32">
              Empresa:
            </label>
            <div className="relative flex-grow flex items-center">
              <input autoComplete="off"
                id="razonEmpresa"
                name="razonEmpresa"
                type="text"
                value={searchEmpresa}
                placeholder="Escribe para buscar empresa..."
                disabled={habilitar}
                onChange={handleEmpresaSearch}
                className={`border pointer border-gray-300 px-3 py-1 mb-1 rounded-md focus:outline-none w-full ${habilitar ? "bg-slate-300" : "bg-slate-100"}`}
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
              <button
                className="ml-2 flex items-center justify-center px-2 h-8 rounded-md bg-blue-800 hover:bg-blue-600 text-white"
                onClick={() => setIsEmpresaModalOpen(true)}
              >
                Agregar <FontAwesomeIcon icon={faPlus} className="ml-2" />
              </button>
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
            <div className="relative flex-grow flex items-center">
              <input autoComplete="off"
                id="razonContrata"
                name="razonContrata"
                type="text"
                value={searchContrata}
                placeholder="Escribe para buscar contrata..."
                disabled={habilitar}
                onChange={handleContrataSearch}
                className={`border pointer border-gray-300 px-3 py-1 mb-1 rounded-md focus:outline-none w-full ${habilitar ? "bg-slate-300" : "bg-slate-100"}`}
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
              <button
                className="ml-2 flex items-center justify-center px-2 h-8 rounded-md bg-green-600 hover:bg-blue-600 text-white"
                onClick={() => setIsContrataModalOpen(true)}
              >
                Agregar <FontAwesomeIcon icon={faPlus} className="ml-2" />
              </button>
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
              <input autoComplete="off"
                id="n_medico"
                name="n_medico"
                type="text"
                value={searchMedico}
                placeholder="Escribe para buscar médico..."
                disabled={habilitar}
                onChange={handleMedicoSearch}
                className={`border pointer border-gray-300 px-3 py-1 mb-1 rounded-md focus:outline-none w-full ${habilitar ? "bg-slate-300" : "bg-slate-100"}`}
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
            <div className="relative flex-grow flex items-center">
              <input autoComplete="off"
                id="tipoPrueba"
                name="tipoPrueba"
                type="text"
                value={searchPrueba}
                placeholder="Escribe para buscar prueba..."
                disabled={habilitar}
                onChange={handlePruebaSearch}
                className={`border pointer border-gray-300 px-3 py-1 mb-1 rounded-md focus:outline-none w-1/2 ${habilitar ? "bg-slate-300" : "bg-slate-100"}`}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (filteredPruebas.length > 0) {
                      handleSelectPrueba(filteredPruebas[0]);
                    }
                    // Focus on cargo input after selection
                    document.getElementById('cargoDe').focus();
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
              <div className="flex items-center w-1/2 ml-2">
                <label className="whitespace-nowrap mr-2 font-medium">Historia clínica:</label>
                <input
                  type="text"
                  value={datos.n_orden || ""}
                  disabled
                  className="border border-gray-300 px-3 py-4 mb-1 rounded-md focus:outline-none w-full font-bold bg-slate-100 h-14 text-3xl"
                  placeholder="N° Orden"
                />
              </div>
            </div>
          </div>

          <div className="mb-1 mt-5">
            <h2 className="text-lg font-bold">Área Pre-Ocupacional</h2>
          </div>
          {/* — Autocomplete Cargo — */}
          <div className="flex items-center space-x-2 mb-1">
            <label htmlFor="cargoDe" className="block w-32">Cargo:</label>
            <div className="relative flex-grow">
              <input autoComplete="off"
                id="cargoDe"
                name="cargoDe"
                type="text"
                value={searchCargo}
                placeholder="Escribe para buscar cargo..."
                disabled={habilitar}
                onChange={handleCargoSearch}
                className={`border border-gray-300 px-3 py-1 rounded-md  w-full ${habilitar ? "bg-slate-300" : "bg-slate-100"}`}
                onKeyDown={e => {
                  if (e.key === 'Enter' && filteredCargos.length > 0) {
                    e.preventDefault(); handleSelectCargo(filteredCargos[0]);
                  }
                }}
                onFocus={() => setFilteredCargos(
                  CargosMulti.filter(c => c.mensaje.toLowerCase().includes(searchCargo.toLowerCase()))
                )}
                onBlur={() => setTimeout(() => setFilteredCargos([]), 100)}
              />
              {searchCargo && filteredCargos.length > 0 && (
                <ul className="absolute inset-x-0 top-full bg-white border rounded-md mt-1 max-h-40 overflow-y-auto z-10">
                  {filteredCargos.map(c => (
                    <li
                      key={c.id}
                      className="cursor-pointer px-3 py-2 hover:bg-gray-100"
                      onMouseDown={() => handleSelectCargo(c)}
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
              <input autoComplete="off"
                id="areaO" name="areaO" type="text"
                value={searchArea} placeholder="Escribe para buscar área..."
                disabled={habilitar} onChange={handleAreaSearch}
                className={`border border-gray-300 px-3 py-1 rounded-md w-full ${habilitar ? "bg-slate-300" : "bg-slate-100"}`}
                onKeyDown={e => { if (e.key === 'Enter' && filteredAreas.length > 0) { e.preventDefault(); handleSelectArea(filteredAreas[0]); } }}
                onFocus={() => setFilteredAreas(AreaMulti.filter(a => a.mensaje.toLowerCase().includes(searchArea.toLowerCase())))}
                onBlur={() => setTimeout(() => setFilteredAreas([]), 100)}
              />
              {searchArea && filteredAreas.length > 0 && (
                <ul className="absolute inset-x-0 top-full bg-white border rounded-md mt-1 max-h-40 overflow-y-auto z-10">
                  {filteredAreas.map(a => (
                    <li key={a.id} className="cursor-pointer px-3 py-2 hover:bg-gray-100"
                      onMouseDown={() => handleSelectArea(a)}>
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
              <input autoComplete="off"
                id="nomExamen" name="nomExamen"
                type="text" value={searchExamenMedico}
                placeholder="Escribe para buscar examen..."
                disabled={habilitar} onChange={handleExamenMedSearch}
                className={`border border-gray-300 px-3 py-1 rounded-md w-full ${habilitar ? "bg-slate-300" : "bg-slate-100"}`}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    // Si hay una sola opción, seleccionarla
                    if (filteredExamMed.length === 1) {
                      handleSelectExamenMed(filteredExamMed[0]);
                      return;
                    }
                    // Si hay coincidencia exacta, seleccionarla
                    const exact = filteredExamMed.find(x => x.mensaje.trim().toUpperCase() === searchExamenMedico.trim().toUpperCase());
                    if (exact) {
                      handleSelectExamenMed(exact);
                      return;
                    }
                    // Si no hay coincidencia, limpiar el campo real
                    setDatos(d => ({ ...d, nomExamen: '' }));
                  }
                }}
                onFocus={() => setFilteredExamMed(ExamenMulti.filter(x => x.mensaje.toLowerCase().includes(searchExamenMedico.toLowerCase())))}
                onBlur={() => setTimeout(() => setFilteredExamMed([]), 100)}
              />
              {searchExamenMedico && filteredExamMed.length > 0 && (
                <ul className="absolute inset-x-0 top-full bg-white border rounded-md mt-1 max-h-40 overflow-y-auto z-10">
                  {filteredExamMed.map(x => (
                    <li key={x.id} className="cursor-pointer px-3 py-2 hover:bg-gray-100"
                      onMouseDown={() => handleSelectExamenMed(x)}>
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
              {/*<div className='flex px-3'>
                  <button onClick={() => {setModalexam(true)}} className='flex items-end border-1 border-blue-500 text-white px-3 py-1 bg-blue-800  mb-1 rounded-md hover:bg-blue-500 hover:text-white focus:outline-none'>
                    + Seleccionar Exámenes
                  </button>
                </div>*/}

              <div className="flex items-center mr-8 mb-2">
                <input type="checkbox" title="FIST-TEST" disabled={habilitar} checked={datos.n_fisttest} onChange={handleCheack} id="examenAdicional4" name="n_fisttest" className="mr-2" />
                <label htmlFor="examenAdicional4" title="FIST-TEST">FIST-TEST</label>
              </div>
              <div className="flex items-center mr-4 mb-2">
                <input type="checkbox" title='PSICOSENSOMETRIA' disabled={habilitar} checked={datos.n_psicosen} onChange={handleCheack} id="examenAdicional5" name="n_psicosen" className="mr-2" />
                <label htmlFor="examenAdicional5" title='PSICOSENSOMETRIA'>PSICOSEN</label>
              </div>
              <div className="flex items-center mr-4 mb-2">
                <input type="checkbox" title="TEST DE ALTURA" disabled={habilitar} checked={datos.n_testaltura} onChange={handleCheack} id="examenAdicional6" name="n_testaltura" className="mr-2" />
                <label htmlFor="examenAdicional6" title="TEST DE ALTURA">T.ALTURA</label>
              </div>
              <div className="flex items-center mr-4 mb-2">
                <input type="checkbox" title='TRABAJOS EN CALIENTE' disabled={habilitar} checked={datos.trabCalientes} onChange={handleCheack} id="examenAdicional7" name="trabCalientes" className="mr-2" />
                <label htmlFor="examenAdicional7" title='TRABAJOS EN CALIENTE'>T.CAL</label>
              </div>
              <div className="flex items-center mr-4 mb-2">
                <input type="checkbox" title='RX COLUMNA LUMBOSACRA FyL' disabled={habilitar} checked={datos.rxcLumbosacra} onChange={handleCheack} id="examenAdicional8" name="rxcLumbosacra" className="mr-2" />
                <label htmlFor="examenAdicional8" title='RX COLUMNA LUMBOSACRA FyL' >RX.C.LUMBO</label>
              </div>
              <div className="flex items-center mr-4 mb-2">
                <input type="checkbox" title='VISUAL COMPLEMENTARIO' disabled={habilitar} checked={datos.visualCompl} onChange={handleCheack} id="examenAdicional9" name="visualCompl" className="mr-2" />
                <label htmlFor="examenAdicional9" title='VISUAL COMPLEMENTARIO' >VIS.COMPL</label>
              </div>
              <div className="flex items-center mr-4 mb-2">
                <input type="checkbox" title='MANIPULADOR DE ALIMENTOS' disabled={habilitar} checked={datos.manipAlimentos} onChange={handleCheack} id="examenAdicional10" name="manipAlimentos" className="mr-2" />
                <label htmlFor="examenAdicional10" title='MANIPULADOR DE ALIMENTOS' >M.ALIM.</label>
              </div>
              <div className="flex items-center mr-4 mb-2">
                <input type="checkbox" title='HERRAMIENTAS MANUALES' disabled={habilitar} checked={datos.herraManuales} onChange={handleCheack} id="examenAdicional11" name="herraManuales" className="mr-2" />
                <label htmlFor="examenAdicional11" title='HERRAMIENTAS MANUALES'>H.MAN</label>
              </div>
              <div className="flex items-center mr-4 mb-2">
                <input type="checkbox" title='RX COLUMNA DORSOLUMBAR FyL' disabled={habilitar} checked={datos.rxcDorsoLumbar} onChange={handleCheack} id="examenAdicional12" name="rxcDorsoLumbar" className="mr-2" />
                <label htmlFor="examenAdicional12" title='RX COLUMNA DORSOLUMBAR FyL'>RX.C.DORSE</label>
              </div>
              <div className="flex items-center mr-4 mb-2">
                <input type="checkbox" title='RX COLUMNA LUMBA FyL' disabled={habilitar} checked={datos.rxcKLumbar} onChange={handleCheack} id="examenAdicional13" name="rxcKLumbar" className="mr-2" />
                <label htmlFor="examenAdicional13" title='RX COLUMNA LUMBA FyL'>RX.LUMBA</label>
              </div>
              <div className="flex items-center mr-4 mb-2">
                <input type="checkbox" title='PLOMO EN SaNGRA' disabled={habilitar} checked={datos.rxcPlomos} onChange={handleCheack} id="examenAdicional14" name="rxcPlomos" className="mr-2" />
                <label htmlFor="examenAdicional14" title='PLOMO EN SaNGRA'>PLOMO S.</label>
              </div>
              <div className="flex items-center mr-4 mb-2">
                <input type="checkbox" title='MERCURIO EN ORINA' disabled={habilitar} checked={datos.mercurioo} onChange={handleCheack} id="examenAdicional15" name="mercurioo" className="mr-2" />
                <label htmlFor="examenAdicional15" title='MERCURIO EN ORINA'>MER.O</label>
              </div>
              <div className="flex items-center mr-4 mb-2">
                <input type="checkbox" title='ESPACIOS CONFINADOS' disabled={habilitar} checked={datos.espaciosConfinados} onChange={handleCheack} id="examenAdicional16" name="espaciosConfinados" className="mr-2" />
                <label htmlFor="examenAdicional16" title='ESPACIOS CONFINADOS'>ESP.CONF</label>
              </div>
              <div className="flex items-center mr-4 mb-2">
                <input type="checkbox" title='MARIHUANA' disabled={habilitar} checked={datos.tmarihuana} onChange={handleCheack} id="examenAdicional17" name="tmarihuana" className="mr-2" />
                <label htmlFor="examenAdicional17" title='MARIHUANA'>MARIHUANA</label>
              </div>
              <div className="flex items-center mr-4 mb-2">
                <input type="checkbox" title='COCAINA' disabled={habilitar} checked={datos.tcocaina} onChange={handleCheack} id="examenAdicional18" name="tcocaina" className="mr-2" />
                <label htmlFor="examenAdicional18" title='COCAINA'>COCAINA</label>
              </div>

            </div>
          </div>

          {/* — Autocomplete Explotación en — */}
          <div className="flex items-center space-x-2 mb-1">
            <label htmlFor="nomEx" className="block w-32">Explotación en:</label>
            <div className="relative flex-grow">
              <select name="nomEx" id="nomEx" value={datos.nomEx} onChange={(e) => { setDatos({ ...datos, nomEx: e.target.value }), document.getElementById('mineralPo')?.focus(); }}
                className={`border border-gray-300 px-3 py-1 rounded-md w-full ${habilitar ? "bg-slate-300" : "bg-slate-100"}`}>
                <option className="cursor-pointer px-3 py-2 hover:bg-gray-100">Seleccione una opcion...</option>
                {ExplotacionMulti.map((item, index) => (
                  <option className="cursor-pointer px-3 py-2 hover:bg-gray-100" key={index} value={item.mensaje}>{item.mensaje} </option>
                ))}
              </select>

            </div>
          </div>

          {/* — Autocomplete Mineral Exp — */}
          <div className="flex items-center space-x-2 mb-1">
            <label htmlFor="mineralPo" className="block w-32">Mineral Exp:</label>
            <div className="relative flex-grow">
              <select name="mineralPo" id="mineralPo" value={datos.mineralPo} onChange={(e) => { setDatos({ ...datos, mineralPo: e.target.value }), document.getElementById('alturaPo')?.focus(); }}
                className={`border border-gray-300 px-3 py-1 rounded-md w-full ${habilitar ? "bg-slate-300" : "bg-slate-100"}`}>
                <option className="cursor-pointer px-3 py-2 hover:bg-gray-100">Seleccione una opcion...</option>
                {MineralMulti.map((item, index) => (
                  <option className="cursor-pointer px-3 py-2 hover:bg-gray-100" key={index} value={item.mensaje}>{item.mensaje} </option>
                ))}
              </select>
            </div>
          </div>

          {/* — Autocomplete Altura — */}
          <div className="flex items-center space-x-2 mb-1">
            <label htmlFor="alturaPo" className="block w-32">Altura:</label>
            <div className="relative flex-grow">
              <select name="alturaPo" id="alturaPo" value={datos.alturaPo} onChange={(e) => { setDatos({ ...datos, alturaPo: e.target.value }), document.getElementById('tipoPago')?.focus(); }}
                className={`border border-gray-300 px-3 py-1 rounded-md w-full ${habilitar ? "bg-slate-300" : "bg-slate-100"}`}>
                <option className="cursor-pointer px-3 py-2 hover:bg-gray-100">Seleccione una opcion...</option>
                {AlturaMulti.map((item, index) => (
                  <option className="cursor-pointer px-3 py-2 hover:bg-gray-100" key={index} value={item.mensaje}>{item.mensaje} </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2 mb-1">
            <label htmlFor="Precio" className="block w-1/2">Precio del Examen</label>
            <input type="text"
              id="precioPo"
              name="precioPo"
              className={`border border-gray-300 px-3 py-1  mb-1 rounded-md focus:outline-none flex-grow w-full ${!editPri ? "bg-slate-300" : "bg-slate-100"}`}
              value={datos.precioPo}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || /^[\d.,\sS/]*$/.test(value)) {
                  setDatos({
                    ...datos,
                    precioPo: value,
                  });
                }
              }}
              disabled={!editPri} />
            <input type="checkbox" onChange={() => { setEditPri(!editPri) }} />
            <InputsSelect2 nombre="tipoPago" disabled={habilitar} value={datos.tipoPago} title="Forma de Pago" Selects={FormaPago} handleChange={handleChange} />
          </div>
          <div className="flex items-center space-x-2 mb-1">
            <label htmlFor="precioExamenAdicional" className="block w-1/2">Precio Examen Adicional:</label>
            <input autoComplete="off"
              type="text"
              disabled={habilitar}
              value={datos.precioAdic}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, ''); // Remover caracteres no numéricos
                if (value.length <= 8) {
                  setDatos({
                    ...datos,
                    precioAdic: value
                  });
                }
              }}
              id="precioAdic"
              name="precioAdic"
              className={`border border-gray-300 px-3 py-1  mb-1 rounded-md focus:outline-none flex-grow w-full ${habilitar ? "bg-slate-300" : "bg-slate-100"}`}
            />
            <InputsSelect2 nombre="autoriza" disabled={habilitar} value={datos.autoriza} title="Autorizado Por" Selects={ListAuth} handleChange={handleChange} />
          </div>
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-1">
              <label htmlFor="fechaApertura" className="block w-1/3">Fecha de Apertura:</label>

              <input autoComplete="off"
                type="text"
                id="fechaAperturaPo"
                name="fechaAperturaPo"
                placeholder="DD/MM/AAAA"
                value={datos.fechaAperturaPo}
                onChange={handleFechaAperturaInput}
                disabled={habilitar}
                className="border border-gray-300 px-3 py-1 mb-1 rounded-md focus:outline-none bg-white flex-grow w-full"
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    // por ejemplo, pasar al siguiente campo
                    document.getElementById('numOperacion')?.focus();
                  }
                }}
              />
              <label htmlFor="numOperacion" className="block ml-4">N° Operación:</label>
              <input autoComplete="off"
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
              <label htmlFor="textObserv1" className="block w-36">Observación 1:</label>
              <input autoComplete="off"
                type="text"
                disabled={habilitar}
                value={datos.textObserv1}
                onChange={handleChange}
                id="textObserv1"
                name="textObserv1"
                className={`border border-gray-300 px-3 py-1  mb-1 rounded-md focus:outline-none flex-grow w-full ${habilitar ? "bg-slate-300" : "bg-slate-100"}`}
              />
            </div>
            <div className="flex items-center space-x-2 mb-1">
              <label htmlFor="observacion2" className="block w-36">Observación 2:</label>
              <input autoComplete="off"
                type="text"
                id="observacion2"
                disabled={habilitar}
                value={datos.textObserv2}
                onChange={handleChange}
                name="textObserv2"
                className={`border border-gray-300 px-3 py-1  mb-1 rounded-md focus:outline-none flex-grow w-full ${habilitar ? "bg-slate-300" : "bg-slate-100"}`}
              />
            </div>

            {/* — Autocomplete Protocolo — */}
            <div className="flex items-center space-x-2 mb-1">
              <label htmlFor="protocolo" className="block w-32">Protocolo:</label>
              <div className="relative flex-grow">
                <input autoComplete="off"
                  id="protocolo" name="protocolo"
                  type="text" value={searchProtocolo}
                  placeholder="Escribe para buscar protocolo..."
                  disabled={habilitar || !(protocoloOptions?.length > 0)} onChange={handleProtocoloSearch}
                  className={`border border-gray-300 px-3 py-1 rounded-md w-full ${!(protocoloOptions?.length > 0) ? "bg-slate-300" : "bg-slate-100"}`}
                  onKeyDown={e => { if (e.key === 'Enter' && filteredProtocolos.length > 0) { e.preventDefault(); handleSelectProtocolo(filteredProtocolos[0]); } }}
                  onFocus={() => setFilteredProtocolos(protocoloOptions.filter(p => p.nombre.toLowerCase().includes(searchProtocolo.toLowerCase())))}
                  onBlur={() => setTimeout(() => setFilteredProtocolos([]), 100)}
                />
                {searchProtocolo && filteredProtocolos.length > 0 && (
                  <ul className="absolute inset-x-0 top-full bg-white border rounded-md mt-1 max-h-40 overflow-y-auto z-10">
                    {filteredProtocolos.map(p => (
                      <li key={p.idProtocolo} className="cursor-pointer px-3 py-2 hover:bg-gray-100"
                        onMouseDown={() => handleSelectProtocolo(p)}>
                        {p.nombre}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2 mb-1">
              <label htmlFor="userRegistroDatos" className="block w-36">Registrado por :</label>
              <input
                type="text"
                id="userRegistroDatos"
                disabled
                value={datos.userRegistroDatos}
                name="userRegistroDatos"
                className={`border border-gray-300 capitalize px-3 py-1  mb-1 rounded-md focus:outline-none flex-grow w-full mt-2`}
              />
            </div>
            <div className="flex items-center space-x-2 mb-1">
              <label htmlFor="nombreMiUsuario" className="block w-36">Usuario:</label>
              <input autoComplete="off"
                type="text"
                id="nombreMiUsuario"
                disabled
                value={datos.nombreMiUsuario}
                name="nombreMiUsuario"
                className={`border border-gray-300 capitalize px-3 py-1  mb-1 rounded-md focus:outline-none flex-grow w-full mt-2`}
              />
            </div>
          </div>
          {showEdit && <div className=" pt-4 flex justify-end items-end ">
            <button type="button" onClick={() => { setHabilitar(false) }} className=" mr-2 flex items-end border-1 border-blue-500 text-white px-3 py-1 bg-blue-800  mb-1 rounded-md hover:bg-blue-500 hover:text-white focus:outline-none">
              Habilitar
            </button>
            <button type="button" onClick={handleSubmitEdit} className=" mr-2 flex items-end border-1 border-blue-500 text-white px-3 py-1 bg-blue-800  mb-1 rounded-md hover:bg-blue-500 hover:text-white focus:outline-none">
              Actualizar
            </button>
            <button type="button" onClick={handleLimpiar} className="flex items-end border-1 border-blue-500 text-white px-3 py-1 bg-blue-800  mb-1 rounded-md hover:bg-blue-500 hover:text-white focus:outline-none">
              Limpiar
            </button>
          </div>}
          {register && <div className="pt-4 flex justify-end items-end">
            <button type="button" onClick={handleSubmit} disabled={!datos.codPa} className="flex items-end border-1 border-blue-500 text-white px-3 py-1 bg-blue-800 mb-1 rounded-md hover:bg-blue-500 hover:text-white focus:outline-none">
              Agregar
            </button>
          </div>}
        </div>

        {/* Nueva columna con estructura solicitada */}
        <div className="w-full sm:w-full mb-4 pl-4">
          <div className="flex items-center space-x-2 mb-2">
            <label htmlFor="soloMiSede" className="block w-1/6">Solo mi Sede</label>
            <input autoComplete="off" type="checkbox" id="soloMiSede" name="soloMiSede" className="mr-2 pointer" />

            <label htmlFor="fecha" className="block w-14">Fecha:</label>
            <DatePicker
              selected={stardate}
              dateFormat="yyyy/MM/dd"
              className="border pointer border-gray-300 px-3 py-1  mb-1 rounded-md focus:outline-none bg-white w-32"
            />
            <label htmlFor="hora" className="block w-14">Hora:</label>
            <input autoComplete="off"
              type="text"
              defaultValue={datos.n_hora}
              id="hora"
              name="hora"
              disabled
              className="border border-gray-300 px-3 py-1  mb-1 rounded-md focus:outline-none bg-slate-300 w-25"
            />
            <label htmlFor="sedeClinica" className="block w-36">Sede Clínica:</label>
            <input autoComplete="off"
              type="text"
              id="sedeClinica"
              defaultValue={datos.codSede}
              name="sedeClinica"
              disabled
              className="bg-slate-300 border border-gray-300 px-3 py-1  mb-1 rounded-md focus:outline-none  flex-grow w-1/2"
            />
          </div>

          <div className="flex items-center space-x-2 mb-2">
            <label htmlFor="nombre" className="block w-36">Nombre:</label>
            <input autoComplete="off"
              type="text"
              value={SearchP.nombre}
              onChange={handleNombreChange}
              id="nombre"
              name="nombre"
              className="border border-gray-300 px-3 py-1  mb-1 rounded-md focus:outline-none bg-white flex-grow w-full"
            />
            <label htmlFor="codigo" className="block w-36">Código:</label>
            <input autoComplete="off"
              type="text"
              inputMode="numeric"        // muestra teclado numérico en móviles
              pattern="\d*"              // solo acepta números
              value={SearchP.code || ""}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d{0,7}$/.test(value)) { // máximo 7 dígitos numéricos
                  setSearchP(prev => ({
                    ...prev,
                    code: value,
                    nombre: ""
                  }));
                }
              }}
              onKeyDown={(event) => { SearchHC(event, 'code') }}
              id="codigo"
              name="codigo"
              className="border border-gray-300 px-3 py-1  mb-1 rounded-md focus:outline-none bg-white flex-grow w-full"
            />
          </div>
          <div className="mb-4 ">
            <h3 className="text-lg font-bold mb-2">Últimos Agregados & Hojas de Ruta</h3>

            <div className="flex items-center justify-between mb-4 p-4 rounded-lg border border-blue-200 bg-blue-50 ">
              <div className="flex items-center text-lg">
                <label htmlFor="filtroFechaTabla" className="mr-2 font-semibold">Fecha:</label>
                <DatePicker
                  id="filtroFechaTabla"
                  value={FechaCanP}
                  onChange={(date) => { setFechaCanP(format(date, "dd/MM/yyyy")) }}
                  dateFormat="yyyy/MM/dd"
                  className="border border-gray-300 px-3 py-1 rounded-md focus:outline-none bg-white w-32"
                />
              </div>
              <div className="flex text-lg flex-col sm:flex-row sm:space-x-6 mt-2 sm:mt-0">
                <span className="font-medium text-blue-900">Pacientes completados: <span className="font-bold text-green-600">{CanP.Completos}</span></span>
                <span className="font-medium text-blue-900">Pacientes faltantes: <span className="font-bold text-red-600">{CanP.Faltantes}</span></span>
              </div>
            </div>
            <div className="flex items-center mb-2 bg-gray-50">
              <span className="mr-2 text-xl">🖱️</span>
              <span className="text-sm text-gray-700">
                <span className="font-semibold">Click izquierdo</span> para importar datos &nbsp;|&nbsp; <span className="font-semibold">Click derecho</span> para imprimir
              </span>
            </div>
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(12 * 4rem)' }}>

              <table className="w-full text-center border border-gray-300 mb-4 ">
                <thead>
                  <tr>
                    <th className="border border-gray-300 px-2 py-1  mb-1">Nro. Orden</th>
                    <th className="border border-gray-300 px-2 py-1  mb-1">Nombres</th>
                    <th className="border border-gray-300 px-2 py-1  mb-1">Fecha</th>
                    <th className="border border-gray-300 px-2 py-1  mb-1">Empresa</th>
                    <th className="border border-gray-300 px-2 py-1  mb-1">Contrata</th>
                    <th className="border border-gray-300 px-2 py-1  mb-1">T. Examen</th>
                    <th className="border border-gray-300 px-2 py-1  mb-1">Laboratorio</th>
                  </tr>
                </thead>
                <tbody>
                  {searchHC.length == 0 && <tr><td className="border border-gray-300 px-2 py-1  mb-1">Cargando...</td></tr>}
                  {searchHC.map((option, index) => (
                    <tr key={index} className={`cursor-pointer hover:opacity-80 transition-colors ${option.color === 'AMARILLO' ? 'bg-[#ffff00]'
                      : option.color === 'VERDE' ? 'bg-[#00ff00]' : 'bg-[#ff6767]'}`} onClick={() => { handleEdit(option) }} onContextMenu={(e) => {
                        e.preventDefault();
                        SearchClickRight(option);
                      }}>
                      <td className="border border-gray-300 px-2 py-1  mb-1">{option.n_orden}</td>
                      <td className="border border-gray-300 px-2 py-1  mb-1">{option.nombres}</td>
                      <td className="border border-gray-300 px-2 py-1  mb-1">
                        {option.fecha_apertura_po}
                      </td>
                      <td className="border border-gray-300 px-2 py-1  mb-1">{option.razon_empresa}</td>
                      <td className="border border-gray-300 px-2 py-1  mb-1">{option.razon_contrata}</td>
                      <td className="border border-gray-300 px-2 py-1  mb-1">{option.nom_examen}</td>
                      <td className="border border-gray-300 px-2 py-1  mb-1">{option.laboratorio ?? ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {isEmpresaModalOpen && <ModalEmpresa
        isOpen={isEmpresaModalOpen}
        onClose={() => setIsEmpresaModalOpen(false)}
        onSave={handleSaveEmpresa}
        Swal={Swal}
        Get={getFetch}
        token={props.token}
        GetRazonS={(e) => {
          console.log(e), setDatos({
            ...datos,
            razonEmpresa: e.razonEmpresa,
            rucEmpresa: e.rucEmpresa
          });
          setSearchEmpresa(e.razonEmpresa)
        }}
      />}
      {isContrataModalOpen && <ModalContrata
        isOpen={isContrataModalOpen}
        onClose={() => setIsContrataModalOpen(false)}
        onSave={handleSaveContrata}
        Swal={Swal}
        Get={getFetch}
        token={props.token}
        GetRazonS={(e) => {
          setDatos({
            ...datos,
            razonContrata: e
          });
          setSearchContrata(e)
        }}
      />}
      {/*modalExam && <ModalExamenes close={() => setModalexam(false)}/>*/}
    </div>
  );
};

export default AperturaExamenesPreOcup;
