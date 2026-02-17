import React, { useEffect, useState } from 'react';
import { saveAs } from 'file-saver';
import { ComboboxContrata, ComboboxSedes, RucEmpoCon } from './model/Combobox';
import { GetMatrizUniversal } from './model/MatrizPOST';
import Swal from 'sweetalert2';
import { useAuthStore } from '../../../../store/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExcel, faMagnifyingGlass, faChevronLeft, faChevronRight, faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import ExcelJS from 'exceljs';

const MATRICES_MAP = {
  "Matriz-1": { url: "st/registros/matrizAdministrativa", method: "POST" },
  "Matriz-2": { url: "st/registros/matrizSalud", method: "POST" },
  "Matriz-3": { url: "ct/archivos", method: "GET" },
  "Matriz-4": { url: "st/registros/matrizAdministrativaOhla", method: "POST" },
  "Matriz-5": { url: "st/registros/matrizSaludOhla", method: "POST" },
  "Matriz-6": { url: "st/registros/matrizGeneral", method: "POST" },
  "Matriz-7": { url: "st/registros/matrizOhlaGestor", method: "POST" },
  "Matriz-8": { url: "st/registros/matrizOhlaConstruccion", method: "POST" },
  "Matriz-9": { url: "st/registros/matrizArena2026", method: "POST" },
  "Matriz-10": { url: "st/registros/matrizPoderosa2026", method: "POST" },
  "Matriz-11": { url: "st/registros/matrizCaraveli2026", method: "POST" },
  "Matriz-12": { url: "st/registros/matrizProseguridadAsistencia2026", method: "POST" },
  "Matriz-13": { url: "st/registros/matrizProseguridad2026", method: "POST" },
  "Matriz-14": { url: "st/registros/matrizPacificoVida2026", method: "POST" },
  "Matriz-15": { url: "st/registros/matrizBoroo2026", method: "POST" },
  "Matriz-16": { url: "st/registros/matrizPoderosaAltura2026", method: "POST" },

};

const MatrizPostulante = () => {
  const token = useAuthStore(state => state.token);
  const userlogued = useAuthStore(state => state.userlogued);

  //ACCESOS
  const Acceso = useAuthStore(state => state.listAccesos);
  const tienePermisoEnVista = (nombreVista, permiso) => {
    const vista = Acceso.find(item => item.nombre === nombreVista);
    return vista?.listaPermisos.includes(permiso) ?? false;
  };

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

  const today = new Date().toLocaleDateString('en-CA');
  const Sedes = ComboboxSedes();

  useEffect(() => {

    const fetchContrata = async (validar) => {
      const contrata = await RucEmpoCon(userlogued.sub, 'CONTRATA', token)
      if (contrata && Array.isArray(contrata) && contrata.length > 0) {
        const contratas = contrata[0];  // Accedemos al primer elemento del array
        // Verificamos si el ruc no es '0'
        if (contratas.ruc && contratas.ruc !== '0') {
          setContrataUser(contrata)// Actualizamos el estado con el ruc
          if (validar != false) {
            setDatos(prevDatos => ({
              ...prevDatos,
              rucContrata: contratas.ruc,
              rucEmpresa: null,
            }))
          }
        }
      }
    }
    const fetchEmpresayContrata = async () => {
      const empresa = await RucEmpoCon(userlogued.sub, 'EMPRESA', token)
      console.log(empresa)
      if (empresa.length > 0) {
        const empresas = empresa[0];  // Accedemos al primer elemento del array
        // Verificamos si el ruc no es '0'
        if (empresas.ruc && empresas.ruc !== '0') {
          setEmpresaUser(empresa);
          setDatos(prevDatos => ({
            ...prevDatos,
            rucContrata: null,
            rucEmpresa: empresas.ruc,
          }))
          fetchContrata(false) // Actualizamos el estado con el ruc
        } else {
          fetchContrata(true)
        }
      }


    }
    fetchEmpresayContrata();
  }, [])

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

  const SubmitAPI = async () => {

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

    try {
      const config = MATRICES_MAP[datos.matrizSeleccionada];
      console.log(config)
      if (!config) {
        setLoading(false);
        return;
      }

      const response = await GetMatrizUniversal(datosapi, config, token);
      console.log(response)
      if (!Array.isArray(response)) {
        setData([]);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al traer la Matriz',
        });
        return;
      }
      setData(response);
      const headers = Object.keys(response[0] || {});
      setHeaders(headers);
      setTotalPages(Math.ceil(response.length / recordsPerPage));

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Ocurrió un error al traer la Matriz',
        text: 'No hay datos que mostrar',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRUCEmpresa = (e) => {
    //una para empresa
    const selectedRuc = e.target.value;
    const empresaSeleccionada = EmpresaUser.find(empresa => empresa.ruc === selectedRuc);
    if (empresaSeleccionada) {
      setDatos(prevDatos => ({
        ...prevDatos,
        rucContrata: null,
        rucEmpresa: empresaSeleccionada.ruc,
      }))
      return
    }
    const contrataSeleccionada = ContrataUser.find(contrata => contrata.ruc === selectedRuc);

    if (contrataSeleccionada) {
      setDatos(prevDatos => ({
        ...prevDatos,
        rucContrata: contrataSeleccionada.ruc,
        rucEmpresa: null,
      }))
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

    const indexResponsable = head.findIndex(
      h => h.toLowerCase() === 'RESPONSABLE_DIGITALIZACION'
    );

    const indexCondicion = head.findIndex(
      h => h.toLowerCase() === 'condicion'
    );

    data.forEach(row => {
      const rowData = { ...row };

      // 🔒 Lógica exclusiva Matriz-9
      if (
        datos.matrizSeleccionada === 'Matriz-9' &&
        indexResponsable !== -1
      ) {
        rowData[head[indexResponsable]] =
          userlogued.datos.nombres_user.toUpperCase();
      }

      const dataRow = worksheet.addRow(Object.values(rowData));
      dataRow.eachCell((cell, colNumber) => {
        cell.alignment = dataStyle.alignment;
        cell.border = dataStyle.border;
        if (
          datos.matrizSeleccionada === 'Matriz-9' &&
          indexCondicion !== -1 &&
          colNumber - 1 === indexCondicion
        ) {
          const valor = String(cell.value || '').trim().toLowerCase();
          if (valor === 'no apto') {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFFF0000' } // Rojo
            };
            cell.font = {
              bold: true,
              color: { argb: 'FFFFFFFF' }
            };
          }

          if (valor === 'apto') {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FF00B050' } // Verde profesional Excel
            };
            cell.font = {
              bold: true,
              color: { argb: 'FFFFFFFF' }
            };
          }
        }



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
  const currentData = Array.isArray(data) ? data.slice(startIdx, endIdx) : [];

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
            value={datos.rucEmpresa || datos.rucContrata}
            onChange={handleRUCEmpresa}
            className='pointer border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none'>
            <option>Elija una Opcion</option>
            {EmpresaUser.map((option) => (
              <option key={option.ruc} value={option.ruc}>{option.razonSocial}</option>
            ))}
            {ContrataUser.map((option) => (
              <option key={option.ruc} value={option.ruc}>{option.razonSocial}</option>
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
              {tienePermisoEnVista("Matriz Postulante", "Matriz Administrativa") && <option value="Matriz-1">Matriz Administrativa</option>}
              {tienePermisoEnVista("Matriz Postulante", "Matriz Salud") && <option value="Matriz-2">Matriz de Salud</option>}
              {tienePermisoEnVista("Matriz Postulante", "Matriz Archivos") && <option value="Matriz-3">Matriz de Archivos</option>}
              {tienePermisoEnVista("Matriz Postulante", "Matriz Administrativo OHLA") && <option value="Matriz-4">Matriz Administrativa OHLA</option>}
              {tienePermisoEnVista("Matriz Postulante", "Matriz de Salud OHLA") && <option value="Matriz-5">Matriz de Salud OHLA</option>}
              {tienePermisoEnVista("Matriz Postulante", "Matriz General") && <option value="Matriz-6">Matriz General</option>}
              {tienePermisoEnVista("Matriz Postulante", "Matriz Gestor OHLA") && <option value="Matriz-7">Matriz Gestor OHLA</option>},
              {tienePermisoEnVista("Matriz Postulante", "Matriz Construccion OHLA") && <option value="Matriz-8">Matriz Construccion OHLA</option>},
              {tienePermisoEnVista("Matriz Postulante", "Matriz Arena") && <option value="Matriz-9">MATRIZ LA ARENA</option>}
              {tienePermisoEnVista("Matriz Postulante", "Matriz Poderosa 2026") && <option value="Matriz-10">REPORTE CONSOLIDADO ATENCIONES DIARIAS - PODEROSA</option>}
              {tienePermisoEnVista("Matriz Postulante", "Matriz Caraveli 2026") && <option value="Matriz-11">MATRIZ COMPAÑIA MINERA CARAVELI</option>}
              {tienePermisoEnVista("Matriz Postulante", "Matriz Pro-Seguridad Asistencia 2026") && <option value="Matriz-12">PLANILLA ASISTENCIA PROSEGURIDAD</option>}
              {tienePermisoEnVista("Matriz Postulante", "Matriz Pro-Seguridad 2026") && <option value="Matriz-13">MATRIZ SALUD PROSEGURIDAD</option>}
              {tienePermisoEnVista("Matriz Postulante", "Matriz Pacifico Vida 2026") && <option value="Matriz-14">REPORTE CONSOLIDAD-PACIFICO VIDA - PODEROSA</option>}
              {tienePermisoEnVista("Matriz Postulante", "Matriz Boroo 2026") && <option value="Matriz-15">MATRIZ MINERA BOROO MISQUICHILCA</option>}
              {tienePermisoEnVista("Matriz Postulante", "Matriz Poderosa Altura 2026") && <option value="Matriz-16">REPORTE DE TRABAJOS EN ALTURA - PODEROSA</option>}
            </select>
          </div>
          <div className="flex flex-col flex-grow justify-end">
            <button
              onClick={SubmitAPI}
              className={`bg-blue-900 mt-4 text-white px-4 py-2 rounded-md  ${datos.matrizSeleccionada && (datos.rucContrata || datos.rucEmpresa) ? '' : 'opacity-50 cursor-not-allowed'}`}
              disabled={!datos.matrizSeleccionada || loading || (!datos.rucContrata && !datos.rucEmpresa) ||
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
