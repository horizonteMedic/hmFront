import React, { useEffect, useState } from 'react';
import { saveAs } from 'file-saver';
import { ComboboxContrata, ComboboxSedes, RucEmpoCon } from './model/Combobox';
import { GetMatrizAdmin, GetMatrizDoctor, GetMatrizArchivos } from './model/MatrizPOST';
import Swal from 'sweetalert2';
import { useAuthStore } from '../../../../store/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExcel, faMagnifyingGlass, faChevronLeft, faChevronRight, faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import ExcelJS from 'exceljs';
const MatrizPostulante = () => {
  const token = useAuthStore(state => state.token);
  const listView = useAuthStore(state => state.listView)
  const userlogued = useAuthStore(state => state.userlogued);

  const AccessMatrizAdmi= listView.some(listView => listView.id === 402);
  //Matriz Salud
  const AccesMatrizSalud = listView.some(listView => listView.id === 403);
  //Matriz ARCHIVOS
  const AccesMatrizArchivos = listView.some(listView => listView.id === 502)
  
  const [loading, setLoading] = useState(false);
  const [EmpresaUser, setEmpresaUser] = useState([])
  const [ContrataUser, setContrataUser] = useState([])

  const [datos, setDatos] = useState({
    rucContrata: '',
    rucEmpresa: '',
    fechaInicio: '',
    fechaFinal: '',
    sede: '',
    matrizSeleccionada: '', // Agrega este estado para controlar la selección de matriz
  });
  const [data, setData] = useState([]);
  const [head, setHeaders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(15);
  const [reload, setReload] = useState(0); // Estado para controlar la recarga de la tabla
  const [exportButtonEnabled, setExportButtonEnabled] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const Contratas = ComboboxContrata();
  const Sedes = ComboboxSedes();

  useEffect(() => {
    const fetchEmpresayContrata = async () => {
      const empresa = await RucEmpoCon(userlogued.sub,'EMPRESA',token)
      if (empresa.length > 0) {
        const empresas = empresa[0];  // Accedemos al primer elemento del array
        // Verificamos si el ruc no es '0'
        if (empresas.ruc && empresas.ruc !== '0') {
          setEmpresaUser(empresa);
          return  // Actualizamos el estado con el ruc
        } 
      } 
      const contrata = await RucEmpoCon(userlogued.sub,'CONTRATA',token)
      if (contrata && Array.isArray(contrata) && contrata.length > 0) {
        const contratas = contrata[0];  // Accedemos al primer elemento del array
        // Verificamos si el ruc no es '0'
        if (contratas.ruc && contratas.ruc !== '0') {
          setContrataUser(contrata)// Actualizamos el estado con el ruc
        } 
      } 
      
    }
    fetchEmpresayContrata();
  },[])

  useEffect(() => {
    if (data.length > 0) {
      setExportButtonEnabled(true);
    } else {
      setExportButtonEnabled(false);
    }
  }, [data]);
  
  useEffect(() => {
    if (today) {
      setDatos(prevDatos => ({
        ...prevDatos,
        fechaInicio: today,
        fechaFinal: today,
      }));
    }
  }, [today]);

  useEffect(() => {
    const SedeDefiner = Sedes.find(sedes => sedes.cod_sede === 'T-NP');

    if (SedeDefiner) {
      setDatos(prevDatos => ({
        ...prevDatos,
        sede: SedeDefiner
      }));
    }
  }, [Sedes]);

  const handleChange = (e) => {
    const { name } = e.target;
    const selectedOption = JSON.parse(e.target.value);
    setDatos({
      ...datos,
      [name]: selectedOption,
    });
  };

  const handleMatrizChange = (e) => {
    const matrizSeleccionada = e.target.value;
    if (matrizSeleccionada === "") {
      setData([]);
    }
    setDatos({
      ...datos,
      matrizSeleccionada,
    });
  };
  
  const SubmitAPI = () => {

    if (!datos.matrizSeleccionada || datos.matrizSeleccionada === "") {
      setData([]);
      return;
    }

    setLoading(true);
    const datosapi = {
      rucContrata: datos.rucContrata,
      rucEmpresa: datos.rucEmpresa,
      fechaInicio: datos.fechaInicio,
      fechaFinal: datos.fechaFinal,
      sede: datos.sede.cod_sede
    };

    if (datos.matrizSeleccionada === 'Matriz-1') {
      GetMatrizAdmin(datosapi, token)
      .then(response => {
        setData(response);
        const headers = Object.keys(response[0]);
        setHeaders(headers);
        setTotalPages(Math.ceil(response.length / recordsPerPage));
      })
      .catch(error => {
        Swal.fire({
          icon: 'error',
          title: 'Ocurrio un error al traer la Matriz',
          text: 'No hay datos que mostrar',
        });
      })
      .finally(() => {
        setLoading(false);
      });
    } else if (datos.matrizSeleccionada === 'Matriz-2') {
      GetMatrizDoctor(datosapi, token)
      .then(response => {
        setData(response);
        const headers = Object.keys(response[0]);
        setHeaders(headers);
        setTotalPages(Math.ceil(response.length / recordsPerPage));
      })
      .catch(error => {
        Swal.fire({
          icon: 'error',
          title: 'Ocurrio un error al traer la Matriz',
          text: 'No hay datos que mostrar',
        });
      })
      .finally(() => {
        setLoading(false);
      });
    } else if (datos.matrizSeleccionada === 'Matriz-3') {
      GetMatrizArchivos(token)
      .then(response => {
        setData(response);
        const headers = Object.keys(response[0]);
        setHeaders(headers);
        setTotalPages(Math.ceil(response.length / recordsPerPage));
      })
      .catch(error => {
        Swal.fire({
          icon: 'error',
          title: 'Ocurrio un error al traer la Matriz',
          text: 'No hay datos que mostrar',
        });
      })
      .finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false)
    }
  
    
  };
  
  const handleRUCEmpresa = (e) => {
    //una para empresa
    const selectedOption = JSON.parse(e.target.value);

    if (selectedOption.opcion === 'EMPRESA') {
      setDatos({
        ...datos,
        rucContrata: null,
        rucEmpresa: selectedOption.ruc,
      });
    } else if (selectedOption.opcion === 'CONTRATA') {
      setDatos({
        ...datos,
        rucContrata: selectedOption.ruc,
        rucEmpresa: null,
      });
    }
    
    //otra para contrata
  }

  useEffect(() => {
    if (reload > 0) {
      SubmitAPI(); // Llama a la función SubmitAPI para recargar los datos
      setReload(0); // Reinicia el estado reload para evitar múltiples recargas
    }
  }, [reload]);

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Matriz Postulante');

    const headerStyle = {
        font: { bold: true, color: { argb: 'FFFFFFFF' } }, // Color de la letra blanco
        alignment: { vertical: 'middle', horizontal: 'center' },
        border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: '4F7DE7' } } // Color de fondo azul específico
    };

    const dataStyle = {
        alignment: { vertical: 'middle', horizontal: 'left' },
        border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    };

    // Convert header to uppercase and separate camel case
    const formatHeader = (header) => {
        return header.replace(/([a-z])([A-Z])/g, '$1 $2').toUpperCase();
    };

    const formattedHead = head.map(formatHeader);
  
    const headerRow = worksheet.addRow(formattedHead);
    headerRow.eachCell(cell => {
        cell.style = headerStyle;
    });

    data.forEach(row => {
        const dataRow = worksheet.addRow(Object.values(row));
        dataRow.eachCell(cell => {
            cell.style = dataStyle;
        });
    });

    worksheet.columns.forEach(column => {
        let maxWidth = 0;
        column.eachCell(cell => {
            const valueLength = cell.value ? String(cell.value).length : 0;
            maxWidth = Math.max(maxWidth, valueLength);
        });
        column.width = maxWidth < 20 ? 20 : maxWidth; 
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const dataFile = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(dataFile, 'matriz_postulante.xlsx');
};

  const reloadTable = () => {
    if (datos.matrizSeleccionada === "") {
      setData([]);
      return;
    }
    setReload(reload + 1);
  };
  
  // Paginación
  const visiblePages = () => {
    const totalVisiblePages = 5; 
    const halfVisiblePages = Math.floor(totalVisiblePages / 2);
    let startPage = currentPage - halfVisiblePages;
    startPage = Math.max(startPage, 1); 
    const endPage = startPage + totalVisiblePages - 1;
    return Array.from({ length: totalVisiblePages }, (_, i) => startPage + i).filter(page => page <= totalPages);
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const handleChangeRecordsPerPage = (e) => {
    setRecordsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
    setTotalPages(Math.ceil(data.length / parseInt(e.target.value)));
  };

  const startIdx = (currentPage - 1) * recordsPerPage;
  const endIdx = startIdx + recordsPerPage;
  const currentData = data.slice(startIdx, endIdx);
  return (
    <div className="container mx-auto mt-12 mb-12">
      <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-xl w-[90%]">
        <div className="px-4 py-2 azuloscurobackground flex justify-between">
          <h1 className="text-start font-bold color-azul text-white">Matriz Postulante</h1>
          <div className="flex items-center gap-4">
          <button
            onClick={exportToExcel}
            className={`verde-btn px-4 py-1 rounded-md ${exportButtonEnabled ? '' : 'cursor-not-allowed opacity-50'}`}
            disabled={!exportButtonEnabled}
          >
            <FontAwesomeIcon icon={faFileExcel} className="mr-2" />
            Exportar a Excel
          </button>
            <div className="flex items-center">
              <span className="ml-2 text-white mr-1">Resultados por página</span>
              <select
                className="border pointer border-gray-300 rounded-md px-1"
                value={recordsPerPage}
                onChange={handleChangeRecordsPerPage}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
                <option value={25}>25</option>
              </select>
            </div>
            <button onClick={reloadTable} className="focus:outline-none relative">
              {loading && <div className="absolute inset-0 opacity-50 rounded-md"></div>}
              <FontAwesomeIcon icon={faSyncAlt} className={`text-white cursor-pointer tamañouno ${loading ? 'opacity-50' : ''}`} />
            </button> 
          </div>
        </div>
        {/* filtros */}
        <div className="flex flex-col flex-grow p-6">
          <p className="font-semibold">R.U.C. Contrata/Empresa</p>
          <select name="rucs" 
            onChange={handleRUCEmpresa}
            className='pointer border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none'>
            <option>Elija una Opcion</option>
            {EmpresaUser.map((option) => (
              <option index={option.ruc} value={JSON.stringify({ ...option, opcion: 'EMPRESA' })}>{option.razonSocial}</option>
            ))}
            {ContrataUser.map((option) => (
              <option index={option.ruc} value={JSON.stringify({ ...option, opcion: 'CONTRATA' })}>{option.razonSocial}</option>
            ))}
          
          </select>
        </div>
        <div className="flex flex-wrap gap-4 p-6">
          <div className="flex flex-col flex-grow">
            <p className="font-semibold">Sede</p>
            <select
              value={datos.sede ? JSON.stringify(datos.sede) : ''}
              onChange={handleChange}
              name='sede'
              className="pointer border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none"
            >
              <option value="">Seleccionar Sede</option>
              {Sedes.map((option) => (
                <option key={option.cod_sede} value={JSON.stringify(option)}>{option.nombre_sede}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col flex-grow">
            <p className="font-semibold">Fecha Inicio</p>
            <input
              type="date"
              id="fechaInicio"
              name="fechaInicio"
              value={datos.fechaInicio}
              onChange={(e) => setDatos({
                ...datos,
                fechaInicio: e.target.value,
              })}
              className="pointer border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none"
            />
          </div>
          <div className="flex flex-col flex-grow">
            <p className="font-semibold">Fecha Fin</p>
          
            <input
            type="date"
            id="fechaFin"
            name="fechaFinal"
            value={datos.fechaFinal}
            onChange={(e) => setDatos({
              ...datos,
              fechaFinal: e.target.value,
            })}
            className="pointer border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none"
          />
          </div>
          <div className="flex flex-col flex-grow">
            <p className="font-semibold">Matrices</p>
            <select
              name='matrizSeleccionada'
              value={datos.matrizSeleccionada}
              onChange={handleMatrizChange}
              className="pointer border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none"
            >
              <option value="">Seleccionar...</option>
              {AccessMatrizAdmi && <option  value="Matriz-1">Matriz Administrativa</option>}
              {AccesMatrizSalud && <option  value="Matriz-2">Matriz de Salud</option>}
              {AccesMatrizArchivos && <option value="Matriz-3">Matriz de Archivos</option>}
            </select>
          </div>
          <div className="flex flex-col flex-grow justify-end">
            <button
              onClick={SubmitAPI}
              className={`bg-blue-900 mt-4 text-white px-4 py-2 rounded-md  ${datos.matrizSeleccionada && (datos.rucContrata || datos.rucEmpresa) ? '' : 'opacity-50 cursor-not-allowed'}`}
              disabled={!datos.matrizSeleccionada || loading ||  (!datos.rucContrata && !datos.rucEmpresa) || 
                (datos.rucContrata === "" && datos.rucEmpresa === "")}
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} className="mr-2" />
              Buscar Matriz
            </button>
          </div>
          </div>
      {/* Tabla de datos */}
      <div className="overflow-x-auto p-3 relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
          <p className="text-xl font-semibold">Cargando...</p>
        </div>
      )}
      {loading || (
        <table className="w-full border border-gray-300">
          <thead>
            <tr>
              {head.map((header) => (
                <th key={header} className="border border-gray-300 px-4 py-2">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.map((item, index) => (
              <tr key={index}>
                {head.map((header) => (
                  <td key={header} className="border border-gray-300 px-4 py-2">{item[header]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      </div>
      <div className="flex justify-center p-4">
        <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className="mx-1 px-3 py-1 naranjabackgroud text-white rounded-md">
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        {/* Mostrar números de página */}
        {visiblePages().map((page) => (
          <button key={page} onClick={() => handlePageClick(page)} className={`mx-1 px-3 py-1 rounded-md ${currentPage === page ? 'azuloscurobackground text-white' : 'bg-gray-200'}`}>
            {page}
          </button>
        ))}
        <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} className="mx-1 px-3 py-1 naranjabackgroud text-white rounded-md">
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
      </div>
      </div>
      );
};

export default MatrizPostulante;
