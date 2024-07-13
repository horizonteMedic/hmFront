import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { parse, format } from 'date-fns';
import Swal from 'sweetalert2';
import { Loading } from '../../../components/Loading';
import { addDays } from 'date-fns';
import * as XLSX from 'xlsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExcel, faTimes, faDownload, faExpand, faCompress } from '@fortawesome/free-solid-svg-icons';
import { SubmitMasivoRegistarPaciente, SubmitCitas } from './model/AdminMasivoPaciente';
import { ComboboxContratas, ComboboxEmpresas } from './model/Combobox';
Modal.setAppElement('#root');

const ImportacionModal = ({ isOpen, onRequestClose, selectedSede, token, userlogued }) => {

  const Contratas = ComboboxContratas()
  const Empresas = ComboboxEmpresas()
 
  const columnTitles = [
    'DNI',
    'Nombres',
    'Apellidos',
    'FechaNacimiento',
    'Sexo',
    'Email',
    'LugarNacimiento',
    'NivelEstudios',
    'Ocupacion',
    'EstadoCivil',
    'Direccion',
    'Departamento',
    'Provincia',
    'Distrito',
    'Caserio',
    'Telefono',
    'Celular'
    ];

  const [data, setData] = useState([]);
  const [highlightedRows, setHighlightedRows] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [empresa, setEmpresa] = useState('');
  const [contrata, setContrata] = useState('');
  const [fechaReserva, setFechaReserva] = useState(new Date().toISOString().split('T')[0]); // Fecha de hoy como inicial
  const [loading, setLoading] = useState(false)
  //Estados para manejar los errores
  const [failedPatients, setFailedPatients] = useState([]);
  const [failedCitasPatients, setFailedCitasPatients] = useState([]);
  
  useEffect(() => {
    // Validación de datos al cargar o cambiar datos
    const validateData = () => {
      const errors = [];

      data.forEach((row, rowIndex) => {
        columnTitles.forEach((title) => {
          const value = row[title];
          if (!validateCell(title, value)) {
            errors.push({ rowIndex, title });
          }

          // Validar celdas vacías
          if (value === '' || value === undefined || value === null) {
            errors.push({ rowIndex, title, empty: true });
          }
        });
      });

      setHighlightedRows(errors);
    };

    validateData();
  }, [data]); // Se ejecuta cuando cambia 'data'

  const handleFileUpload = (event) => {
    setData([])
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const binaryStr = e.target.result;
      const workbook = XLSX.read(binaryStr, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      const processedData = jsonData.map(row => {
        if (row['FechaNacimiento']) {
            const serialNumber = row['FechaNacimiento'];
            const date = addDays(new Date(1899, 11, 30), serialNumber);
            row['FechaNacimiento'] = format(date, 'dd/MM/yyyy');
        }
        return row;
      });

      console.log(processedData);
      setData(processedData);
    };
    reader.readAsBinaryString(file);
  };

  const validateCell = (colTitle, value) => {
  switch (colTitle) {
    case 'DNI':
      const dniRegex = /^[0-9]{8}$/;
      return dniRegex.test(value);
    case 'Tipo de Documento':
      const tiposDocumentoPermitidos = ['DNI', 'Pasaporte', 'Carnet Extra'];
      return tiposDocumentoPermitidos.includes(value);
    case 'Nombres':
    case 'Apellidos':
    case 'Ocupación':
      const nombreRegex = /^[a-zA-Z áéíóúÁÉÍÓÚñÑ]+$/;
      return nombreRegex.test(value);
    case 'Sexo':
      const sexoRegex = /^[MF]$/;
      return sexoRegex.test(value);
    case 'Correo':
      const correoRegex = /@/;
      return correoRegex.test(value);
    default:
      // Para cualquier otro caso que no sea DNI, CARNET EXT. o PASAPORTE, retornar true
      return true;
  }
};


  const handleOverlayClick = (event) => {
    if (event.target.className === 'ReactModal__Overlay') {
      setData([]);
      setHighlightedRows([]);
      onRequestClose();
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleDownloadExcelTemplate = () => {
    window.open('https://docs.google.com/spreadsheets/d/1vnpZtd97WybQ3zCWwaF2uH4OTa_G_5hy/edit?usp=sharing&ouid=105230702023683005367&rtpof=true&sd=true', '_blank');
  };

  const handleCargaMasiva = async () => {
    setLoading(true)
    let failedPatients = [];
    let failedCitasPatients = []
    const patientPromises = data.map(async (patient) => {
      try {
          // Intentamos registrar el paciente
          const res = await SubmitMasivoRegistarPaciente(patient, selectedSede, token);
          console.log(res);

          // Si el registro fue exitoso, registramos la cita
          if (res.id) {
            const rucEmpresa = empresa === '' ? null : Number(empresa);
            const rucContrata = contrata === '' ? null : Number(contrata);

              const datos = {
                dni: patient.DNI,
                celular: patient.Celular,
                fechaReserva: fechaReserva,
                nomenSede: selectedSede,
                rucEmpresa: rucEmpresa,
                rucContrata: rucContrata   
              }
              
              const cit = await SubmitCitas(datos, userlogued.sub, token);
              if (!cit.idCitaOcupacional) {
                failedCitasPatients.push(patient.DNI)
              }
          }
      } catch (error) {
          console.log('Ocurrió un error al registrar el paciente:', patient.DNI, error);
          // Añadimos el paciente a la lista de fallidos
          failedPatients.push(patient);
      }
    });
    
    await Promise.all(patientPromises)
    setLoading(false)
    setFailedPatients(failedPatients);
    setFailedCitasPatients(failedCitasPatients);
    if (failedPatients.length > 0 || failedCitasPatients.length > 0) {
      let errorMessage = '';
    
      if (failedPatients.length > 0) {
        errorMessage += `No se pudo registrar a los siguientes pacientes DNI: ${failedPatients.join(', ')}`;
      }
    
      if (failedCitasPatients.length > 0) {
        if (errorMessage) errorMessage += '\n'; // Añadir un salto de línea si ya hay un mensaje de error
        errorMessage += `No se pudo registrar citas para los siguientes pacientes: ${failedCitasPatients.join(', ')}`;
      }
      Swal.fire({
        icon: 'error',
        title: 'Detención!',
        text: errorMessage,
      });
    } else {
      Swal.fire({icon: 'success', title: 'Exito', text: 'Se realizo el registro masivo correctamente'})
    }
  }
 
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => {
        setData([]);
        setHighlightedRows([]);
        onRequestClose();
      }}
      
      contentLabel="Importación Masiva de Excel"
      className={`flex justify-center items-center ${isFullscreen ? 'fullscreen-modal' : ''}`}
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      onOverlayClick={handleOverlayClick}
    >
      <div   className={`fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50  ${isFullscreen ? 'fullscreen-overlay' : ''}`}>
        <div className={`bg-white rounded-lg ${isFullscreen ? 'h-full w-full max-h-full max-w-full' : 'md:h-[600px] md:w-[90%] max-w-full'}`}>
        <div className="p verdebackground flex flex-col md:flex-row justify-between p-3.5 space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0 w-full">
            <h1 className="text-white w-full md:w-auto">
              <strong>Sede: </strong>{selectedSede}
            </h1>
            {/* Selector de empresa */}
            <select
              value={empresa}
              onChange={(e) => {setEmpresa(e.target.value)}}
              className="border pointer rounded-lg bg-white text-black w-full md:w-[150px] px-3 py-1"
            >
              <option value="">Empresa</option>
              {Empresas?.map((option, index) => (
                <option key={index} value={option.ruc}>{option.razonSocial}</option>
              ))}
            </select>
            {/* Selector de Contrata */}
            <select
              value={contrata}
              onChange={(e) => {setContrata(e.target.value)}}
              className="border pointer rounded-lg bg-white text-black w-full md:w-[150px] px-3 py-1"
            >
              <option value="">Contrata</option>
              {Contratas?.map((option, index) => (
                <option key={index} value={option.ruc}>{option.razonSocial}</option>
              ))}
            </select>
            {/* Calendario de Fecha de Reserva */}
            <label htmlFor="" className="w-full md:w-auto">
              <p className="text-white">Fecha de Reserva:</p>
            </label>
            <input
              type="date"
              value={fechaReserva}
              min={new Date().toISOString().split('T')[0]} // Fecha mínima es hoy
              onChange={(e) => setFechaReserva(e.target.value)}
              className="border pointer rounded-lg bg-white text-black w-full md:w-auto px-3 py-1"
            />
            {/* Botón para descargar plantilla */}
            <button
              onClick={handleDownloadExcelTemplate}
              className="flex items-center border rounded-lg justify-center bg-white-500 text-white px-4 py-1 w-full md:w-auto ml-0 md:ml-4 cursor-pointer"
            >
              <FontAwesomeIcon icon={faDownload} className="mr-2" />
              Descargar Plantilla
            </button>
            {/* Botón para cargar archivo Excel */}
            <label
              htmlFor="file-upload"
              className="flex items-center border rounded-lg justify-center bg-white-500 text-white px-4 py-1 w-full md:w-auto ml-0 md:ml-4 cursor-pointer"
            >
              <FontAwesomeIcon icon={faFileExcel} className="mr-2" />
              Cargar Excel
            </label>
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            {/* Botón para alternar entre pantalla completa y normal */}
            {isFullscreen ? (
              <button
                onClick={() => setIsFullscreen(false)}
                className="ml-0 md:ml-4 text-white w-full md:w-auto"
              >
                <FontAwesomeIcon icon={faCompress} className="text-2xl" />
              </button>
            ) : (
              <button
                onClick={() => setIsFullscreen(true)}
                className="ml-0 md:ml-4 text-white w-full md:w-auto"
              >
                <FontAwesomeIcon icon={faExpand} className="text-2xl" />
              </button>
            )}
            {/* Botón para cerrar el modal */}
            <button
              onClick={onRequestClose}
              className="ml-0 md:ml-4 text-white w-full md:w-auto"
            >
              <FontAwesomeIcon icon={faTimes} className="text-2xl" />
            </button>
          </div>
        </div>

          <div className='container p-4'>
            <div className="mt-1">
              <p className='fw-bold'>Datos cargados: {data.length}</p>
              {/* <p>Datos con error: {highlightedRows.length}</p> */}
            </div>
            <div className="overflow-auto max-h-[450px] mt-4">
              <table className="min-w-full bg-white border">
                <thead>
                  <tr>
                    {columnTitles.map((title, index) => (
                      <th key={index} className="py-2 px-4 border text-center bg-gray-200 font-semibold">
                        {title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                {data.length > 0 ? (
                  data.map((row, rowIndex) => (
                    <tr key={rowIndex}
                    className={failedCitasPatients.includes(row.DNI) ? 'bg-red-100' : ''}>
                      {columnTitles.map((title, colIndex) => (
                        <td
                        key={colIndex}
                        className={`py-2 px-4 border text-center ${
                          highlightedRows.find(
                            (error) => error.rowIndex === rowIndex && error.title === title && error.empty
                          )
                            ? 'bg-red-100 text-black' // Cambiar a rojo suave con texto negro si la celda está vacía
                            : highlightedRows.find(
                                (error) => error.rowIndex === rowIndex && error.title === title
                              )
                            ? 'bg-red-200' // Mantener rojo si hay un error pero no está vacía
                            : ''
                        }`}
                      >
                        {row[title]}
                        {highlightedRows.find(
                          (error) => error.rowIndex === rowIndex && error.title === title && error.empty
                        ) && (
                          <span className="text-black text-sm">Celda vacía</span>
                        )}
                        {highlightedRows.find(
                          (error) => error.rowIndex === rowIndex && error.title === title && !error.empty
                        ) && (
                          <span className="text-red-500 text-sm"><br />Error</span>
                        )}
                      </td>
                      
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columnTitles.length} className="py-2 px-4 border text-center">No hay datos para mostrar</td>
                  </tr>
                )}
              </tbody>
              </table>
              
            </div>
            {highlightedRows.length === 0 && data.length > 0 &&
              <div className='flex justify-end w-full'>
                <button onClick={handleCargaMasiva} disabled={!empresa && !contrata} className={`px-3 py-2 mt-4 flex justify-end verdebackground text-white rounded-lg ${!empresa && !contrata && '!bg-green-200'}`}>Subir Datos</button>
              </div>
              }
              
            {highlightedRows.length > 0 && (
            <div className="mt-2">
              <p>Leyenda:</p>
              <div className="flex items-center">
                <div className="h-3 w-3 bg-red-500 rounded-full mr-2"></div>
                <p>Celda con error</p>
              </div>
              {highlightedRows.some((error) => error.empty) && (
                <div className="flex items-center">
                  <div className="h-3 w-3 bg-yellow-500 rounded-full mr-2"></div>
                  <p>Celda vacía</p>
                </div>
              )}
              <div className='text-center'>
                <p>Por favor revisar bien los datos antes de subirlos.</p>
              </div>
            </div>
            )}

          </div>
        </div>
      </div>
      {loading && <Loading/>}
    </Modal>
  );
};

export default ImportacionModal;
