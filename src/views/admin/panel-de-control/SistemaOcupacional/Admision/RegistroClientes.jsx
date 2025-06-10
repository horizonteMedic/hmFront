import { useState, useRef, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Loading } from '../../../../components/Loading';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faCheck, faSearch, faX, faSignature, faFingerprint, faBroom } from '@fortawesome/free-solid-svg-icons';

import { SearchPacienteDNI, SubmitRegistrarPaciente } from './model/AdminPaciente'; 
import NewPad from './pad/Newpad';
import NewHuellaFut from './huella/HuellaFut';
import { VerifyHoF } from './model/Submit';

const RegistroClientes = (props) => {
  // ref para mantener el cursor fijo en "Nombres"
  const nombreRef = useRef(null);
  const dniRef = useRef(null);   // ⬅️  nuevo

  const [startDate, setStartDate] = useState(new Date());
  

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProfesiones, setFilteredProfesiones] = useState([]);
  const [selectedProfesion, setSelectedProfesion] = useState('');
  const [modalhuellaF, setModalhuellaF] = useState(false);
  const [modalpad, setModalpad] = useState(false);
  const [FirmaP, setFirmaP] = useState({ id: 0, url: '' });
  const [HuellaP, setHuellaP] = useState({ id: 0, url: '' });
  const [notCharge, setNotcharge] = useState(false)
  const {Profesiones,Departamentos,Provincias,Distritos} = props.listas
  
  useEffect(() => {
    if (Profesiones && Profesiones.length > 0) {
      setNotcharge(true); // habilita input
    } else {
      setNotcharge(false); // deshabilita input
    }
  }, [Profesiones]);

  const sexoOptions = ['MASCULINO', 'FEMENINO'];
  const nivelOptions = [
    'ANALFABETO',
    'PRIMARIA COMPLETA',
    'PRIMARIA INCOMPLETA',
    'SECUNDARIA COMPLETA',
    'SECUNDARIA INCOMPLETA',
    'UNIVERSITARIO',
    'TECNICO'
  ];
  const handleDateInput = e => {
    // si quisieras validar o parsear, aquí lo haces
    setDatos(d => ({ ...d, fechaNaciminetoPa: e.target.value }));
  };
  
  // --- Handlers genéricos ---
  const handleChange = e => {
    const { name, value } = e.target;
    props.setDatos(d => ({ ...d, [name]: value.toUpperCase() }));
  };

  const handleDNI = e => {
    const { name, value } = e.target;
    const onlyDigits = value.replace(/\D/g, '');      // quita todo lo que no sea dígito
    props.setDatos(d => ({                                  // guarda como string
      ...d,
      [name]: onlyDigits              // '' si el input está vacío
    }));
  };

  const handleNumber = e => {
    const { name, value } = e.target;
    const onlyDigits = value.replace(/\D/g, '');
    props.setDatos(d => ({ ...d, [name]: onlyDigits }));    // '' si está vacío
  };
  
  const handleDPD = e => {
    const { name, value } = e.target;
    const sel = value ? JSON.parse(value) : '';
    setDatos(d => {
      let newD = { ...d, [name]: sel };
      if (name === 'departamentoPa') {
        newD.provinciaPa = '';
        newD.distritoPa = '';
      }
      return newD;
    });
  };

  const focusNext = (e, nextId) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      document.getElementById(nextId)?.focus();
    }
  };
  
  // Autocomplete de profesión
  const handleProfesionSearch = e => {
    const v = e.target.value;
    setSearchTerm(v);
    setFilteredProfesiones(
      v
        ? Profesiones.filter(o =>
            o.descripcion.toLowerCase().includes(v.toLowerCase())
          )
        : []
    );
  };

  const handleSelectProfesion = prof => {
    setSearchTerm(prof.descripcion)
    setSelectedProfesion(prof.descripcion);
    props.setDatos(d => ({ ...d, ocupacionPa: prof.descripcion }));
    setFilteredProfesiones([]);
    document.getElementById('estadoCivilPa')?.focus();
  };

 // --- Búsqueda de paciente -------------------------
 const handleSearch = e => {
  e.preventDefault();
  if (!props.datos.codPa) return Swal.fire('Error', 'Coloque el DNI', 'error');

  Swal.fire({ title: 'Buscando datos', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

  SearchPacienteDNI(props.selectedSede, props.datos.codPa, props.token)
  .then(async res => {
    Swal.close();

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

      handleLimpiar(true);
      setTimeout(() => nombreRef.current?.focus(), 0);
      return;
    }

    if (res.fechaNaciminetoPa) {
      const [yyyy, mm, dd] = res.fechaNaciminetoPa.split('-');
      res.fechaNaciminetoPa = `${dd}-${mm}-${yyyy}`;
    }

    // 1️⃣ Sanear null/undefined → convertirlos en cadena vacía
    const sanitized = Object.fromEntries(
      Object.entries(res).map(([key, value]) => [key, value ?? ''])
    );

    // 2️⃣ Sobrescribir todo el objeto datos con valores saneados
    props.setDatos(sanitized);

    // 3️⃣ Mapear departamento/provincia/distrito SOLO si vienen valores válidos
    let deptObj = sanitized.departamentoPa || '';
    let provObj = sanitized.provinciaPa || '';
    let distObj = sanitized.distritoPa || '';

    if (sanitized.departamentoPa) {
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
      provinciaPa:    provObj,
      distritoPa:     distObj
    }));

    // 4️⃣ Sincronizar los campos de búsqueda/autocomplete
    if (sanitized.sexoPa === 'M')      setSearchSexo('MASCULINO');
    else if (sanitized.sexoPa === 'F') setSearchSexo('FEMENINO');
    else                                setSearchSexo('');

    setSearchNivel(sanitized.nivelEstPa);
    setSearchCivil(sanitized.estadoCivilPa);

    setSearchTerm(sanitized.ocupacionPa);
    setSelectedProfesion(sanitized.ocupacionPa);

    setSearchDept(sanitized.departamentoPa);
    setSearchProv(sanitized.provinciaPa);
    setSearchDist(sanitized.distritoPa);

    // 5️⃣ Limpiar todas las listas de sugerencias
    setFilteredSexo([]);
    setFilteredNivel([]);
    setFilteredProfesiones([]);
    setFilteredCivil([]);
    setFilteredDept([]);
    setFilteredProv([]);
    setFilteredDist([]);

    // 6️⃣ Cargar huella y firma
    const [H, F] = await Promise.all([
      VerifyHoF(`/api/v01/st/registros/detalleUrlArchivosEmpleados/${sanitized.codPa}/HUELLA`),
      VerifyHoF(`/api/v01/st/registros/detalleUrlArchivosEmpleados/${sanitized.codPa}/FIRMAP`)
    ]);
    setHuellaP(H.id === 1 ? { id: 1, url: H.mensaje } : { id: 0, url: '' });
    setFirmaP(F.id === 1 ? { id: 1, url: F.mensaje } : { id: 0, url: '' });
  })
  .catch(() => {
    Swal.close();
    Swal.fire('Error', 'Ha ocurrido un error', 'error');
  });
 }

 const handleSubmit = e => {
    e.preventDefault();
    const camposRequeridos = ['codPa', 'nombresPa', 'fechaNaciminetoPa', 'sexoPa', 'lugarNacPa', 'nivelEstPa', 'ocupacionPa',
       'estadoCivilPa', 'direccionPa', 'departamentoPa', 'provinciaPa', 'distritoPa', 'celPa']; // agrega los campos que quieras
    const camposVacios = camposRequeridos.filter(campo => !props.datos[campo]);
    if (camposVacios.length > 0) {
      const lista = camposVacios.join(', ');
  return Swal.fire('Error', `Faltan completar: ${lista}`, 'error');
    } 

    if (HuellaP.id === 0 ) return Swal.fire('Error', 'El Paciente no tiene huella registrada', 'error');
    if (FirmaP.id === 0 ) return Swal.fire('Error', 'El Paciente no tiene firma registrada', 'error');

    Swal.fire({
      title: 'Validando Datos',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    SubmitRegistrarPaciente(props.datos, props.selectedSede, props.token)
      .then(r => {
        Swal.close();
        if (!r.id) {
          Swal.fire('Error', 'No se pudo registrar', 'error');
        } else {
          Swal.fire('Registrado', 'Paciente registrado', 'success');
          handleLimpiar();
          props.tabHC();
          props.ChangeDNI(props.datos.codPa);
        }
      })
      .catch(() => {
        Swal.close();
        Swal.fire('Error', 'Problema al registrar', 'error');
      });
  };

 // 1️⃣  Valor inicial de datos (puedes extraerlo a una constante para no repetir)
const initialDatos = {
  codPa: '',
  nombresPa: '',
  apellidosPa: '',
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
  celPa: ''
};

const handleLimpiar = (keepDNI = false) => {
  const dniActual = keepDNI ? props.datos.codPa : '';   // guarda o descarta el DNI

  // 🔄 reinicia el estado principal
  props.setDatos({ ...initialDatos, codPa: dniActual });
  setStartDate(new Date());          // (por si usas DatePicker)

  // 🔄 limpia todos los autocompletados / filtros
  setSearchTerm('');           setFilteredProfesiones([]);   setSelectedProfesion('');
  setSearchSexo('');           setFilteredSexo([]);
  setSearchNivel('');          setFilteredNivel([]);
  setSearchCivil('');          setFilteredCivil([]);
  setSearchDept('');           setFilteredDept([]);
  setSearchProv('');           setFilteredProv([]);
  setSearchDist('');           setFilteredDist([]);

  // 🔄 limpia huella y firma previas
  setHuellaP({ id: 0, url: '' });
  setFirmaP({ id: 0, url: '' });

  // ⌨️ devuelve el foco al DNI para seguir escribiendo
  dniRef.current?.focus();
};

const openHuella = () => {
  if (!props.datos.codPa)
    return Swal.fire('Error', 'Ingresa el DNI del cliente', 'error');
  setModalhuellaF(true);
};
const openPad = () => {
  if (!props.datos.codPa)
    return Swal.fire('Error', 'Ingresa el DNI del cliente', 'error');
  setModalpad(true);
};
// 1. Definir opciones (al principio del componente)
const civilOptions = [
  'SOLTERO',
  'CASADO',
  'VIUDO',
  'CONVIVIENTE',
  'SEPARADO',
  'DIVORCIADO'
];


// 2. Estados para la búsqueda
const [searchSexo, setSearchSexo] = useState('');
const [filteredSexo, setFilteredSexo] = useState([]);
const [searchNivel, setSearchNivel] = useState('');
const [filteredNivel, setFilteredNivel] = useState([]);

// 3. Handlers de filtrado y selección
const handleSexoSearch = e => {
  const v = e.target.value.toUpperCase();
  setSearchSexo(v);
  setFilteredSexo(
    v ? sexoOptions.filter(s => s.includes(v)) : []
  );
};
const handleSelectSexo = val => {
  setSearchSexo(val);
  props.setDatos(d => ({ ...d, sexoPa: val.charAt(0) })); 
  setFilteredSexo([]);
  document.getElementById('emailPa')?.focus();
};

const handleNivelSearch = e => {
  const v = e.target.value.toUpperCase();
  setSearchNivel(v);
  setFilteredNivel(
    v ? nivelOptions.filter(n => n.includes(v)) : []
  );
};
const handleSelectNivel = val => {
  setSearchNivel(val);
  props.setDatos(d => ({ ...d, nivelEstPa: val }));
  setFilteredNivel([]);
  document.getElementById('ocupacionPa')?.focus();
};

// 2. Añadir a tus useState:
const [searchCivil, setSearchCivil] = useState('');
const [filteredCivil, setFilteredCivil] = useState([]);

// 3. Manejadores:
const handleCivilSearch = e => {
  const v = e.target.value.toUpperCase();
  setSearchCivil(v);
  setFilteredCivil(
    v
      ? civilOptions.filter(c => c.includes(v))
      : []
  );
};

const handleSelectCivil = val => {
  setSearchCivil(val);
  props.setDatos(d => ({ ...d, estadoCivilPa: val }));
  setFilteredCivil([]);
  document.getElementById('direccionPa')?.focus();
};

// Opciones base ya vienen de tu ComboboxDepartamentos(), ComboboxProvincias(), ComboboxDistritos()
// Estados para Departamento
const [searchDept, setSearchDept] = useState('');
const [filteredDept, setFilteredDept] = useState([]);

// Estados para Provincia
const [searchProv, setSearchProv] = useState('');
const [filteredProv, setFilteredProv] = useState([]);

// Estados para Distrito
const [searchDist, setSearchDist] = useState('');
const [filteredDist, setFilteredDist] = useState([]);

// Handler Departamento
const handleDeptSearch = e => {
  const v = e.target.value;
    props.setDatos(d => ({...d, departamentoPa: v}))
  setSearchDept(v);
  setFilteredDept(
    v
      ? Departamentos.filter(d =>
          d.nombre.toLowerCase().includes(v.toLowerCase())
        )
      : []
  );
};
const handleSelectDept = dept => {
  setSearchDept(dept.nombre);
  props.setDatos(d => ({ ...d, departamentoPa: dept }));
  setFilteredDept([]);
  // limpia provincias/distritos cuando cambias de depto
  setSearchProv('');
  setFilteredProv([]);
  setSearchDist('');
  setFilteredDist([]);
};

// Handler Provincia (usa Provincias filtradas por depto seleccionado)
const handleProvSearch = e => {
  const v = e.target.value;
    props.setDatos(d => ({...d, provinciaPa: v}))
  setSearchProv(v);
  const opciones = props.datos.departamentoPa
    ? Provincias.filter(p =>
        p.idDepartamento === props.datos.departamentoPa.id &&
        p.nombre.toLowerCase().includes(v.toLowerCase())
      )
    : [];
  setFilteredProv(v ? opciones : []);
};
const handleSelectProv = prov => {
  setSearchProv(prov.nombre);
  props.setDatos(d => ({ ...d, provinciaPa: prov }));
  setFilteredProv([]);
  // limpia distrito al cambiar provincia
  setSearchDist('');
  setFilteredDist([]);
};

// Handler Distrito (usa Distritos filtrados por provincia seleccionada)
const handleDistSearch = e => {
  const v = e.target.value;
  props.setDatos(d => ({...d, distritoPa: v}))
  setSearchDist(v);
  const opciones = props.datos.provinciaPa
    ? Distritos.filter(d =>
        d.idProvincia === props.datos.provinciaPa.id &&
        d.nombre.toLowerCase().includes(v.toLowerCase())
      )
    : [];
  setFilteredDist(v ? opciones : []);
};
const handleSelectDist = dist => {
  setSearchDist(dist.nombre);
  props.setDatos(d => ({ ...d, distritoPa: dist }));
  setFilteredDist([]);
};
const handleFecha = e => {
  const raw = e.target.value.replace(/\D/g, '').slice(0, 8);   // máx. 8 dígitos
  let formatted = raw;

  if (raw.length >= 5) {
    formatted = raw.replace(/(\d{2})(\d{2})(\d{0,4})/, '$1-$2-$3'); // ddMMaaaa → dd-MM-aaaa
  } else if (raw.length >= 3) {
    formatted = raw.replace(/(\d{2})(\d{0,2})/, '$1-$2'); // ddM → dd-M
  }

  props.setDatos(d => ({ ...d, fechaNaciminetoPa: formatted }));
};

console.log(props.datos)
return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-1">
        {/* Columna 1 */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <label htmlFor="codPa" className="block w-[11.5em]">
              DNI/LM:
            </label>
            <input autoComplete="off" 
              ref={dniRef}
              type="text"
              id="codPa"
              name="codPa"
              value={props.datos.codPa}
              onChange={handleDNI}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  handleSearch(e);
                }
              }}
              className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-slate-100 w-full"
              style={{ textTransform: 'uppercase' }}
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 rounded-lg azuloscurobackground text-white flex items-center space-x-2"
            >
              <span>Buscar</span>
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <label className="block w-36">Nombres:</label>
            <input autoComplete="off"
              ref={nombreRef}
              type="text"
              id="nombresPa"
              name="nombresPa"
              value={props.datos.nombresPa}
              onChange={handleChange}
              onKeyDown={(e) => focusNext(e, 'apellidosPa')}
              className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-slate-100 w-full"
              style={{ textTransform: 'uppercase' }}
            />
          </div>

          <div className="flex items-center space-x-2">
            <label className="block w-36">Apellidos:</label>
            <input autoComplete="off"
              type="text"
              id="apellidosPa"
              name="apellidosPa"
              value={props.datos.apellidosPa}
              onChange={handleChange}
              onKeyDown={(e) => focusNext(e, 'fechaNaciminetoPa')}
              className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-slate-100 w-full"
              style={{ textTransform: 'uppercase' }}
            />
          </div>

         {/* Fecha de Nacimiento */}
          <div className="flex items-start space-x-2">     {/* fila igual que los demás */}
            {/* label – ancho fijo */}
            <label className="block w-36 mt-2">Fecha Nac.:</label>

            {/* zona del input + nota */}
            <div className="flex flex-col w-full">
              <input autoComplete="off"
                type="text"
                id="fechaNaciminetoPa"
                name="fechaNaciminetoPa"
                value={props.datos.fechaNaciminetoPa}
                onChange={handleFecha}
                placeholder="dd-MM-yyyy"
                onKeyDown={e => focusNext(e, 'sexoPa')}
                className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-slate-100 w-full"
                style={{ textTransform: 'uppercase' }}
              />

              <p className="text-xs text-gray-500 mt-1">
                Formato: <strong>Día-Mes-Año</strong> (DD-MM-AAAA)
              </p>
            </div>
          </div>

         {/* Sexo */}
<div className="flex flex-col">
  <div className="flex items-center space-x-2">
    <label className="block w-36">Sexo:</label>
    <input autoComplete="off"
      id="sexoPa"
      type="text"
      value={searchSexo}
      onChange={handleSexoSearch}
      placeholder="Escribe para buscar..."
      className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-slate-100 w-full"
      style={{ textTransform: 'uppercase' }}
      onKeyDown={e => {
        if (e.key === 'Enter') {
          e.preventDefault();
          if (filteredSexo.length > 0) {
            handleSelectSexo(filteredSexo[0]);
          } else if (searchSexo && (searchSexo === 'MASCULINO' || searchSexo === 'FEMENINO')) {
            handleSelectSexo(searchSexo);
          } else {
            document.getElementById('emailPa')?.focus();
          }
        }
      }}
    />
  </div>
  {searchSexo && filteredSexo.length > 0 && (
    <div className="border border-gray-300 rounded-md mt-1 max-h-32 overflow-y-auto">
      {filteredSexo.map((opt,i) => (
        <div
          key={i}
          className="cursor-pointer p-2 hover:bg-gray-200"
          onClick={() => handleSelectSexo(opt)}
        >
          {opt}
        </div>
      ))}
    </div>
  )}
</div>

          <div className="flex items-center space-x-2">
            <label className="block w-36">Email:</label>
            <input autoComplete="off"
              id="emailPa"
              onKeyDown={(e) => focusNext(e, 'lugarNacPa')}
              type="email"
              name="emailPa"
              value={props.datos.emailPa}
              onChange={handleChange}
              className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-slate-100 w-full"
              style={{ textTransform: 'uppercase' }}
            />
          </div>

          <div className="flex items-center space-x-2">
            <label className="block w-36">Lugar Nac.:</label>
            <input autoComplete="off"
              id="lugarNacPa"
              type="text"
              name="lugarNacPa"
              value={props.datos.lugarNacPa}
              onKeyDown={(e) => focusNext(e, 'nivelEstPa')}
              onChange={handleChange}
              className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-slate-100 w-full"
              style={{ textTransform: 'uppercase' }}
            />
          </div>
        </div>

        {/* Columna 2 */}
        <div className="flex flex-col space-y-2">
      
        {/* Nivel Estudio */}
        <div className="flex flex-col">
          <div className="flex items-center space-x-2">
            <label className="block w-36">Nivel Estudio:</label>
            <input autoComplete="off"
              id="nivelEstPa"
              type="text"
              value={searchNivel}
              onChange={handleNivelSearch}
              placeholder="Escribe para buscar..."
              className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-slate-100 w-full"
              style={{ textTransform: 'uppercase' }}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (filteredNivel.length > 0) {
                    handleSelectNivel(filteredNivel[0]);
                  } else {
                    document.getElementById('ocupacionPa')?.focus();
                  }
                }
              }}
            />
          </div>
          {searchNivel && filteredNivel.length > 0 && (
            <div className="border border-gray-300 rounded-md mt-1 max-h-32 overflow-y-auto">
              {filteredNivel.map((opt,i) => (
                <div
                  key={i}
                  className="cursor-pointer p-2 hover:bg-gray-200"
                  onClick={() => handleSelectNivel(opt)}
                >
                  {opt}
                </div>
              ))}
            </div>
          )}
        </div>
          {/* Prof/Ocup */}
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <label className="block w-36">Prof/Ocup:</label>
              <input autoComplete="off"
                id="ocupacionPa"
                name="ocupacionPa"
                type="text"
                value={searchTerm}                
                onChange={handleProfesionSearch}
                placeholder="Escribe para buscar..."
                className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-slate-100 w-full"
                style={{ textTransform: 'uppercase' }}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (filteredProfesiones.length > 0) {
                      handleSelectProfesion(filteredProfesiones[0]);
                    } else {
                      document.getElementById('estadoCivilPa')?.focus();
                    }
                  }
                }}
              />
            </div>

            {searchTerm && filteredProfesiones.length > 0 && (
              <div className="border border-gray-300 rounded-md mt-1 max-h-48 overflow-y-auto">
                {filteredProfesiones.map((opt, i) => (
                  <div
                    key={i}
                    className="cursor-pointer p-2 hover:bg-gray-200"
                    onClick={() => handleSelectProfesion(opt)}
                  >
                    {opt.descripcion}
                  </div>
                ))}
              </div>
            )}
          </div>

          
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <label className="block w-36">Estado Civil:</label>
              <input autoComplete="off"
                id="estadoCivilPa"
                name="estadoCivilPa"
                type="text"
                value={searchCivil}
                onChange={handleCivilSearch}
                placeholder="Escribe para buscar..."
                className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-slate-100 w-full"
                style={{ textTransform: 'uppercase' }}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (filteredCivil.length > 0) {
                      handleSelectCivil(filteredCivil[0]);
                    } else {
                      document.getElementById('direccionPa')?.focus();
                    }
                  }
                }}
              />
            </div>

            {searchCivil && filteredCivil.length > 0 && (
              <div className="border border-gray-300 rounded-md mt-1 max-h-48 overflow-y-auto">
                {filteredCivil.map((opt, i) => (
                  <div
                    key={i}
                    className="cursor-pointer p-2 hover:bg-gray-200"
                    onClick={() => handleSelectCivil(opt)}
                  >
                    {opt}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <label className="block w-36">Dirección:</label>
            <input autoComplete="off"
            id='direccionPa'
              type="text"
              name="direccionPa"
              value={props.datos.direccionPa}
              onKeyDown={(e) => focusNext(e, 'departamentoPa')}
              onChange={handleChange}
              className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-slate-100 w-full"
              style={{ textTransform: 'uppercase' }}
            />
          </div>

          {/* Departamento */}
<div className="flex flex-col">
  <div className="flex items-center space-x-2">
    <label className="block w-36">Departamento:</label>
    <input autoComplete="off"
  id="departamentoPa"
  type="text"
  value={searchDept}
  onChange={handleDeptSearch}
  onFocus={() => {
    // si no hay nada filtrado, muestra todo el catálogo
    if (filteredDept.length === 0) {
      setFilteredDept(
        Departamentos.filter(d =>
          d.nombre.toLowerCase().includes(searchDept.toLowerCase())
        )
      );
    }
  }}
  placeholder="Escribe para buscar..."
  className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-slate-100 w-full"
      style={{ textTransform: 'uppercase' }}
      onKeyDown={e => {
        if (e.key === 'Enter' && filteredDept.length > 0) {
          e.preventDefault();
          handleSelectDept(filteredDept[0]);
          document.getElementById('provinciaPa')?.focus();
        }
      }}
    />
  </div>
  {searchDept && filteredDept.length > 0 && (
    <div className="border border-gray-300 rounded-md mt-1 max-h-48 overflow-y-auto">
      {filteredDept.map((opt, i) => (
        <div
          key={i}
          className="cursor-pointer p-2 hover:bg-gray-200"
          onClick={() => {
            handleSelectDept(opt);
            document.getElementById('provinciaPa')?.focus();
          }}
        >
          {opt.nombre}
        </div>
      ))}
    </div>
  )}
</div>

{/* Provincia */}
<div className="flex flex-col">
  <div className="flex items-center space-x-2">
    <label className="block w-36">Provincia:</label>
    <input autoComplete="off"
      id="provinciaPa"
      type="text"
      value={searchProv}
      onChange={handleProvSearch}
      placeholder="Escribe para buscar..."
      onFocus={() => {
        if (filteredProv.length === 0) {
          const opciones = props.datos.departamentoPa
            ? Provincias.filter(p => p.idDepartamento === props.datos.departamentoPa.id)
            : [];
          setFilteredProv(opciones);
        }
      }}
      
      className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-slate-100 w-full"
      style={{ textTransform: 'uppercase' }}
      onKeyDown={e => {
        if (e.key === 'Enter' && filteredProv.length > 0) {
          e.preventDefault();
          handleSelectProv(filteredProv[0]);
          document.getElementById('distritoPa')?.focus();
        }
      }}
    />
  </div>
  {searchProv && filteredProv.length > 0 && (
    <div className="border border-gray-300 rounded-md mt-1 max-h-48 overflow-y-auto">
      {filteredProv.map((opt, i) => (
        <div
          key={i}
          className="cursor-pointer p-2 hover:bg-gray-200"
          onClick={() => {
            handleSelectProv(opt);
            document.getElementById('distritoPa')?.focus();
          }}
        >
          {opt.nombre}
        </div>
      ))}
    </div>
  )}
</div>

{/* Distrito */}
<div className="flex flex-col">
  <div className="flex items-center space-x-2">
    <label className="block w-36">Distrito:</label>
    <input autoComplete="off"
      id="distritoPa"
      type="text"
      value={searchDist}
      onFocus={() => {
        if (filteredDist.length === 0) {
          const opciones = props.datos.provinciaPa
            ? Distritos.filter(d => d.idProvincia === props.datos.provinciaPa.id)
            : [];
          setFilteredDist(opciones);
        }
      }}
      
      onChange={handleDistSearch}
      placeholder="Escribe para buscar..."
      className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-slate-100 w-full"
      style={{ textTransform: 'uppercase' }}
      onKeyDown={e => {
        if (e.key === 'Enter' && filteredDist.length > 0) {
          e.preventDefault();
          handleSelectDist(filteredDist[0]);
          document.getElementById('caserioPA')?.focus();
        }
      }}
    />
  </div>
  {searchDist && filteredDist.length > 0 && (
    <div className="border border-gray-300 rounded-md mt-1 max-h-48 overflow-y-auto">
      {filteredDist.map((opt, i) => (
        <div
          key={i}
          className="cursor-pointer p-2 hover:bg-gray-200"
          onClick={() => {
            handleSelectDist(opt);
            document.getElementById('caserioPA')?.focus();
          }}
        >
          {opt.nombre}
        </div>
      ))}
    </div>
  )}
</div>


          <div className="flex items-center space-x-2">
            <label className="block w-36">Caserío:</label>
            <input autoComplete="off"
              type="text"
              id="caserioPA"
              name="caserioPA"
              value={props.datos.caserioPA}
              onChange={handleChange}
              onKeyDown={(e) => focusNext(e, 'telCasaPa')}
              className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-slate-100 w-full"
              style={{ textTransform: 'uppercase' }}
            />
          </div>

          <div className="flex items-center space-x-2">
            <label className="block w-36">Teléfono:</label>
            <input autoComplete="off"
              type="text"
              id="telCasaPa"
              name="telCasaPa"
              value={props.datos.telCasaPa}
              onKeyDown={(e) => focusNext(e, 'celPa')}
              onChange={handleNumber}
              className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-slate-100 w-full"
            />
          </div>

          <div className="flex items-center space-x-2">
            <label className="block w-36">Celular:</label>
            <input autoComplete="off"
              type="text"
              id="celPa"
              name="celPa"
              value={props.datos.celPa}
              onChange={handleNumber}
              className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-slate-100 w-full"
            />
          </div>
        </div>
      </div>

      {/* Botones finales */}
      <div className="flex justify-end gap-4 mt-4">
        <div className='flex flex-col flex-wrap justify-center items-center'>
          <label htmlFor="">{FirmaP.id === 1 ? <FontAwesomeIcon color='green' icon={faCheck} size='xl'/> : <FontAwesomeIcon color='red' size='xl' icon={faX}/>}</label>
          <button
            onClick={openPad}
            className="w-64 px-6 py-2 text-base font-semibold rounded-xl bg-purple-600 text-white flex items-center gap-2 justify-center hover:bg-purple-700"
          >
            <FontAwesomeIcon icon={faSignature} /> Tomar Firma
          </button>
        </div>
        <div className='flex flex-col flex-wrap justify-center items-center'>
          <label htmlFor="">{HuellaP.id === 1 ? <FontAwesomeIcon color='green' size='xl' icon={faCheck}/> : <FontAwesomeIcon color='red' size='xl' icon={faX}/>}</label>
          <button
          onClick={openHuella}
          className="w-64 px-6 py-2 text-base font-semibold rounded-xl bg-teal-600 text-white flex items-center gap-2 justify-center hover:bg-teal-700"
          >
            <FontAwesomeIcon icon={faFingerprint} /> Tomar Huella Futronic
          </button>
        </div>
        <div className='flex flex-col flex-wrap justify-end items-center'>
          <button
            onClick={handleSubmit}
            className="w-64 px-6 py-2 text-base font-semibold rounded-xl bg-blue-600 text-white flex items-center gap-2 justify-center hover:bg-blue-700"
          >
            <FontAwesomeIcon icon={faCheck} /> Registrar
          </button>
        </div>
        <div className='flex flex-col flex-wrap justify-end items-center'>
          <button
            onClick={handleLimpiar}
            className="w-64 px-6 py-2 text-base font-semibold rounded-xl bg-red-500 text-white flex items-center gap-2 justify-center hover:bg-red-600"
          >
            <FontAwesomeIcon icon={faBroom} /> Limpiar
          </button>
        </div>
      </div>

      {/* Leyenda de botones horizontal */}
      <div className="mt-6 p-3 rounded-lg bg-gray-50 border border-gray-200 w-full flex flex-row items-center justify-center gap-8">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded bg-purple-600 text-white"><FontAwesomeIcon icon={faSignature} /></span>
          <span className="text-gray-700 text-sm">Tomar Firma: Captura la firma digital del paciente</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded bg-teal-600 text-white"><FontAwesomeIcon icon={faFingerprint} /></span>
          <span className="text-gray-700 text-sm">Tomar Huella Futronic: Escanea la huella dactilar del paciente</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded bg-blue-600 text-white"><FontAwesomeIcon icon={faCheck} /></span>
          <span className="text-gray-700 text-sm">Registrar: Guarda los datos del paciente</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded bg-red-500 text-white"><FontAwesomeIcon icon={faBroom} /></span>
          <span className="text-gray-700 text-sm">Limpiar: Limpia todos los campos del formulario</span>
        </div>
      </div>

      {modalhuellaF && (
        <NewHuellaFut
          close={() => setModalhuellaF(false)}
          DNI={props.datos.codPa}
          Huella={HuellaP}
          setHuella={() => {setHuellaP({id: 1})}}
        />
      )}
      {modalpad && (
        <NewPad
          close={() => setModalpad(false)}
          DNI={props.datos.codPa}
          Firma={FirmaP}
          setFirma={() => {setFirmaP({id: 1})}}
        />
      )}
    </div>
  );
};

export default RegistroClientes;
