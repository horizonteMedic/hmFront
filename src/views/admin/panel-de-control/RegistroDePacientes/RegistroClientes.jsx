import { useState, useRef } from 'react';
import Swal from 'sweetalert2';
import { Loading } from '../../../components/Loading';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faMobileAlt, faSearch } from '@fortawesome/free-solid-svg-icons';
import {
  ComboboxProfesión,
  ComboboxDepartamentos,
  ComboboxProvincias,
  ComboboxDistritos
} from './model/Combobox';
import { SearchPacienteDNI, SubmitRegistrarPaciente } from './model/AdminPaciente';
import NewHuella from './huella/NewHuella';
import NewPad from './pad/Newpad';
import NewHuellaFut from './huella/HuellaFut';
import { VerifyHoF } from './model/Submit';
import InputMask from 'react-input-mask-next';

const RegistroClientes = (props) => {
  // ref para mantener el cursor fijo en "Nombres"
  const nombreRef = useRef(null);
  const dniRef = useRef(null);   // ⬅️  nuevo

  const [startDate, setStartDate] = useState(new Date());
  const [datos, setDatos] = useState({
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
    celPa: '',
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProfesiones, setFilteredProfesiones] = useState([]);
  const [selectedProfesion, setSelectedProfesion] = useState('');
  const [modalhuellaF, setModalhuellaF] = useState(false);
  const [modalpad, setModalpad] = useState(false);
  const [FirmaP, setFirmaP] = useState({ id: 0, url: '' });
  const [HuellaP, setHuellaP] = useState({ id: 0, url: '' });

  const Profesiones   = ComboboxProfesión();
  const Departamentos = ComboboxDepartamentos();
  const Provincias    = ComboboxProvincias();
  const Distritos     = ComboboxDistritos();
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
    setDatos(d => ({ ...d, [name]: value.toUpperCase() }));
  };

  const handleDNI = e => {
    const { name, value } = e.target;
    const onlyDigits = value.replace(/\D/g, '');      // quita todo lo que no sea dígito
    setDatos(d => ({                                  // guarda como string
      ...d,
      [name]: onlyDigits              // '' si el input está vacío
    }));
  };

  const handleNumber = e => {
    const { name, value } = e.target;
    const onlyDigits = value.replace(/\D/g, '');
    setDatos(d => ({ ...d, [name]: onlyDigits }));    // '' si está vacío
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
    setSelectedProfesion(prof.descripcion);
    setDatos(d => ({ ...d, ocupacionPa: prof.descripcion }));
    setSearchTerm('');
    setFilteredProfesiones([]);
  };

 // --- Búsqueda de paciente -------------------------
 const handleSearch = e => {
  e.preventDefault();
  if (!datos.codPa) return Swal.fire('Error', 'Coloque el DNI', 'error');

  Swal.fire({ title: 'Buscando datos', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

  SearchPacienteDNI(props.selectedSede, datos.codPa, props.token)
    .then(async res => {
      Swal.close();
      if (!res.codPa) {
        // ⬇︎ dentro de handleSearch – justo donde hoy haces toast: true, icon: 'info'
        await Swal.fire({
          toast: true,                 // seguimos usando toast (pequeño flotante)
          position: 'top-end',
          icon: 'info',             // ó 'info'  (warning = triángulo, info = “i”)
          title: '<span style="font-size:1rem">Paciente no encontrado</span>',
          width: 360,                  // un poco más ancho que el default (300 px)
          padding: '1.25rem',
          showConfirmButton: false,
          timer: 1000,
          customClass: {
            icon: 'swal2-icon-scale'   // veremos cómo agrandar el icono abajo
          }
        });
        nombreRef.current?.focus();
        return;
      }

      /* --------------------------------------------------
         1. Guardas los datos crudos que llegan del backend
      -------------------------------------------------- */
      setDatos(res);

      /* --------------------------------------------------
         2. Convierte los NOMBRES (strings) en OBJETOS
            para que sigan funcionando los filtros id-based
      -------------------------------------------------- */
      const deptObj = Departamentos.find(d => d.nombre === res.departamentoPa);
      const provObj = Provincias.find(
        p => deptObj && p.idDepartamento === deptObj.id && p.nombre === res.provinciaPa
      );
      const distObj = Distritos.find(
        d => provObj && d.idProvincia === provObj.id && d.nombre === res.distritoPa
      );

      setDatos(d => ({
        ...d,
        departamentoPa: deptObj || '',
        provinciaPa:    provObj || '',
        distritoPa:     distObj || ''
      }));

      /* --------------------------------------------------
         3. Sincroniza los inputs de texto (search*)
      -------------------------------------------------- */
      setSearchSexo(res.sexoPa === 'M' ? 'MASCULINO' : 'FEMENINO');
      setSearchNivel(res.nivelEstPa     || '');
      setSearchCivil(res.estadoCivilPa  || '');

      setSearchTerm(res.ocupacionPa     || '');
      setSelectedProfesion(res.ocupacionPa || '');

      setSearchDept(res.departamentoPa  || '');
      setSearchProv(res.provinciaPa     || '');
      setSearchDist(res.distritoPa      || '');

      /* --------------------------------------------------
         4. Cargar huella / firma
      -------------------------------------------------- */
      const [H, F] = await Promise.all([
        VerifyHoF(`/api/v01/st/registros/detalleUrlArchivosEmpleados/${res.codPa}/HUELLA`),
        VerifyHoF(`/api/v01/st/registros/detalleUrlArchivosEmpleados/${res.codPa}/FIRMAP`)
      ]);
      setHuellaP(H.id === 1 ? { id: 1, url: H.mensaje } : { id: 0, url: '' });
      setFirmaP(F.id === 1 ? { id: 1, url: F.mensaje } : { id: 0, url: '' });
    })
    .catch(() => {
      Swal.close();
      Swal.fire('Error', 'Ha ocurrido un error', 'error');
    });
};

const handleSubmit = e => {
    e.preventDefault();
    if (!datos.codPa)
      return Swal.fire('Error', 'Complete los campos vacíos', 'error');

    Swal.fire({
      title: 'Validando Datos',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    SubmitRegistrarPaciente(datos, props.selectedSede, props.token)
      .then(r => {
        Swal.close();
        if (!r.id) {
          Swal.fire('Error', 'No se pudo registrar', 'error');
        } else {
          Swal.fire('Registrado', 'Paciente registrado', 'success');
          handleLimpiar();
          props.tabHC();
          props.ChangeDNI(datos.codPa);
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

// 2️⃣  Nuevo handleLimpiar
const handleLimpiar = () => {
  setDatos(initialDatos);          // limpia datos principales
  setStartDate(new Date());        // si usas DatePicker más adelante
  setSearchTerm('');               // input Profesión
  setFilteredProfesiones([]);      // lista Profesión
  setSelectedProfesion('');        // texto “Seleccionado”

  setSearchSexo('');
  setFilteredSexo([]);

  setSearchNivel('');
  setFilteredNivel([]);

  setSearchCivil('');
  setFilteredCivil([]);

  setSearchDept('');
  setFilteredDept([]);

  setSearchProv('');
  setFilteredProv([]);

  setSearchDist('');
  setFilteredDist([]);

  setHuellaP({ id: 0, url: '' });  // huella previa
  setFirmaP({ id: 0, url: '' });   // firma previa

  // Si tenías algún mensaje/ref adicional
  dniRef.current?.focus();     // ⬅️  vuelve al campo DNI
};


  const openHuella = () => {
    if (!datos.codPa)
      return Swal.fire('Error', 'Ingresa el DNI del cliente', 'error');
    setModalhuellaF(true);
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
  setDatos(d => ({ ...d, sexoPa: val.charAt(0) })); 
  setFilteredSexo([]);
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
  setDatos(d => ({ ...d, nivelEstPa: val }));
  setFilteredNivel([]);
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
  setDatos(d => ({ ...d, estadoCivilPa: val }));
  setFilteredCivil([]);
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
  setDatos(d => ({ ...d, departamentoPa: dept }));
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
  setSearchProv(v);
  const opciones = datos.departamentoPa
    ? Provincias.filter(p =>
        p.idDepartamento === datos.departamentoPa.id &&
        p.nombre.toLowerCase().includes(v.toLowerCase())
      )
    : [];
  setFilteredProv(v ? opciones : []);
};
const handleSelectProv = prov => {
  setSearchProv(prov.nombre);
  setDatos(d => ({ ...d, provinciaPa: prov }));
  setFilteredProv([]);
  // limpia distrito al cambiar provincia
  setSearchDist('');
  setFilteredDist([]);
};

// Handler Distrito (usa Distritos filtrados por provincia seleccionada)
const handleDistSearch = e => {
  const v = e.target.value;
  setSearchDist(v);
  const opciones = datos.provinciaPa
    ? Distritos.filter(d =>
        d.idProvincia === datos.provinciaPa.id &&
        d.nombre.toLowerCase().includes(v.toLowerCase())
      )
    : [];
  setFilteredDist(v ? opciones : []);
};
const handleSelectDist = dist => {
  setSearchDist(dist.nombre);
  setDatos(d => ({ ...d, distritoPa: dist }));
  setFilteredDist([]);
};
const handleFecha = e => {
  const raw = e.target.value.replace(/\D/g, '').slice(0, 8);   // máx. 8 dígitos
  const formatted = raw
    .replace(/(\d{4})(\d)/, '$1-$2')          // 1995 → 1995-
    .replace(/(\d{4}-\d{2})(\d)/, '$1-$2');   // 1995-07 → 1995-07-
  setDatos(d => ({ ...d, fechaNaciminetoPa: formatted }));
};
  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-1">
        {/* Columna 1 */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <label htmlFor="codPa" className="block w-[11.5em]">
              DNI/LM:
            </label>
            <input
              ref={dniRef}                 // ⬅️  aquí
              type="text"
              id="codPa"
              name="codPa"
              value={datos.codPa}
              onChange={handleDNI}
              onKeyDown={e => {            // ⬅️  disparar búsqueda con Enter
                if (e.key === 'Enter') {
                  handleSearch(e);
                }
              }}
              className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white w-full"
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
            <input
              ref={nombreRef}
              type="text"
              id="nombresPa"
              name="nombresPa"
              value={datos.nombresPa}
              onChange={handleChange}
              onKeyDown={(e) => focusNext(e, 'apellidosPa')}
              className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white w-full"
            />
          </div>

          <div className="flex items-center space-x-2">
            <label className="block w-36">Apellidos:</label>
            <input
              type="text"
              id="apellidosPa"
              name="apellidosPa"
              value={datos.apellidosPa}
              onChange={handleChange}
              onKeyDown={(e) => focusNext(e, 'fechaNaciminetoPa')}
              className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white w-full"
            />
          </div>

         {/* Fecha de Nacimiento */}
<div className="flex items-start space-x-2">     {/* fila igual que los demás */}
  {/* label – ancho fijo */}
  <label className="block w-36 mt-2">Fecha Nac.:</label>

  {/* zona del input + nota */}
  <div className="flex flex-col w-full">
    <input
      type="text"
      id="fechaNaciminetoPa"
      name="fechaNaciminetoPa"
      value={datos.fechaNaciminetoPa}
      onChange={handleFecha}
      placeholder="yyyy-MM-dd"
      onKeyDown={e => focusNext(e, 'sexoPa')}
      className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white w-full"
    />

    <p className="text-xs text-gray-500 mt-1">
      Formato: <strong>Año-Mes-Día</strong> (AAAA-MM-DD)
    </p>
  </div>
</div>

         {/* Sexo */}
<div className="flex flex-col">
  <div className="flex items-center space-x-2">
    <label className="block w-36">Sexo:</label>
    <input
      id="sexoPa"
      type="text"
      value={searchSexo}
      onChange={handleSexoSearch}
      placeholder="Escribe para buscar..."
      className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white w-full"
      onKeyDown={e => {
        if (e.key === 'Enter' && filteredSexo.length > 0) {
          e.preventDefault();
          handleSelectSexo(filteredSexo[0]);
          document.getElementById('emailPa')?.focus();
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
          onClick={() => {
            handleSelectSexo(opt);
            document.getElementById('emailPa')?.focus();
          }}
        >
          {opt}
        </div>
      ))}
    </div>
  )}
</div>

          <div className="flex items-center space-x-2">
            <label className="block w-36">Email:</label>
            <input
              id="emailPa"
              onKeyDown={(e) => focusNext(e, 'lugarNacPa')}
              type="email"
              name="emailPa"
              value={datos.emailPa}
              onChange={handleChange}
              className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white w-full"
            />
          </div>

          <div className="flex items-center space-x-2">
            <label className="block w-36">Lugar Nac.:</label>
            <input
              id="lugarNacPa"
              type="text"
              name="lugarNacPa"
              value={datos.lugarNacPa}
              onKeyDown={(e) => focusNext(e, 'nivelEstPa')}
              onChange={handleChange}
              className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white w-full"
            />
          </div>
        </div>

        {/* Columna 2 */}
        <div className="flex flex-col space-y-2">
      
{/* Nivel Estudio */}
<div className="flex flex-col">
  <div className="flex items-center space-x-2">
    <label className="block w-36">Nivel Estudio:</label>
    <input
      id="nivelEstPa"
      type="text"
      value={searchNivel}
      onChange={handleNivelSearch}
      placeholder="Escribe para buscar..."
      className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white w-full"
      onKeyDown={e => {
        if (e.key === 'Enter' && filteredNivel.length > 0) {
          e.preventDefault();
          handleSelectNivel(filteredNivel[0]);
          document.getElementById('ocupacionPa')?.focus();
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
          onClick={() => {
            handleSelectNivel(opt);
            document.getElementById('ocupacionPa')?.focus();
          }}
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
              <input
                id="ocupacionPa"
                name="ocupacionPa"
                type="text"
                value={searchTerm}
                onChange={handleProfesionSearch}
                placeholder="Escribe para buscar..."
                className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white w-full"
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (filteredProfesiones.length > 0) {
                      // selecciona siempre la primera opción
                      handleSelectProfesion(filteredProfesiones[0]);
                      // mueve el foco al Estado Civil
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

            {selectedProfesion && (
              <p className="text-sm mt-1">
                Seleccionado: <strong>{selectedProfesion}</strong>
              </p>
            )}
          </div>

          
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <label className="block w-36">Estado Civil:</label>
              <input
                id="estadoCivilPa"
                name="estadoCivilPa"
                type="text"
                value={searchCivil}
                onChange={handleCivilSearch}
                placeholder="Escribe para buscar..."
                className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white w-full"
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (filteredCivil.length > 0) {
                      handleSelectCivil(filteredCivil[0]);
                      // luego enfoca Dirección (por ejemplo)
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
                    onClick={() => {
                      handleSelectCivil(opt);
                      document.getElementById('direccionPa')?.focus();
                    }}
                  >
                    {opt}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <label className="block w-36">Dirección:</label>
            <input
            id='direccionPa'
              type="text"
              name="direccionPa"
              value={datos.direccionPa}
              onKeyDown={(e) => focusNext(e, 'departamentoPa')}
              onChange={handleChange}
              className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white w-full"
            />
          </div>

          {/* Departamento */}
<div className="flex flex-col">
  <div className="flex items-center space-x-2">
    <label className="block w-36">Departamento:</label>
    <input
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
  className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white w-full"
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
    <input
      id="provinciaPa"
      type="text"
      value={searchProv}
      onChange={handleProvSearch}
      placeholder="Escribe para buscar..."
      onFocus={() => {
        if (filteredProv.length === 0) {
          const opciones = datos.departamentoPa
            ? Provincias.filter(p => p.idDepartamento === datos.departamentoPa.id)
            : [];
          setFilteredProv(opciones);
        }
      }}
      
      className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white w-full"
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
    <input
      id="distritoPa"
      type="text"
      value={searchDist}
      onFocus={() => {
        if (filteredDist.length === 0) {
          const opciones = datos.provinciaPa
            ? Distritos.filter(d => d.idProvincia === datos.provinciaPa.id)
            : [];
          setFilteredDist(opciones);
        }
      }}
      
      onChange={handleDistSearch}
      placeholder="Escribe para buscar..."
      className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white w-full"
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
            <input
              type="text"
              id="caserioPA"
              name="caserioPA"
              value={datos.caserioPA}
              onChange={handleChange}
              onKeyDown={(e) => focusNext(e, 'telCasaPa')}
              className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white w-full"
            />
          </div>

          <div className="flex items-center space-x-2">
            <label className="block w-36">Teléfono:</label>
            <input
              type="text"
              id="telCasaPa"
              name="telCasaPa"
              value={datos.telCasaPa}
              onKeyDown={(e) => focusNext(e, 'celPa')}
              onChange={handleNumber}
              className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white w-full"
            />
          </div>

          <div className="flex items-center space-x-2">
            <label className="block w-36">Celular:</label>
            <input
              type="text"
              id="celPa"
              name="celPa"
              value={datos.celPa}
              onChange={handleNumber}
              className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none bg-white w-full"
            />
          </div>
        </div>
      </div>

      {/* Botones finales */}
      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={() => setModalpad(true)}
          className="verde-btn px-6 py-2 rounded-md hover:bg-green-800"
        >
          Tomar Firma
        </button>
        <button
          onClick={openHuella}
          className="verde-btn px-6 py-2 rounded-md hover:bg-green-800"
        >
          Tomar Huella Futronic
        </button>
        <button
          onClick={handleSubmit}
          className="azul-btn px-6 py-2 rounded-md hover:bg-blue-800"
        >
          Registrar
        </button>
        <button
          onClick={handleLimpiar}
          className="bg-red-500 px-6 py-2 rounded-md text-white"
        >
          Limpiar
        </button>
      </div>

      {modalhuellaF && (
        <NewHuellaFut
          close={() => setModalhuellaF(false)}
          DNI={datos.codPa}
          Huella={HuellaP}
        />
      )}
      {modalpad && (
        <NewPad
          close={() => setModalpad(false)}
          DNI={datos.codPa}
          Firma={FirmaP}
        />
      )}
    </div>
  );
};

export default RegistroClientes;
