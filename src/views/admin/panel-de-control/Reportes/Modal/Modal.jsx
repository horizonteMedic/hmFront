import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faFilePdf, faFileImage, faDownload, faEnvelope, faPlus, faFileCsv, faRotate, faEye, faXmark, faFile, faFileExcel } from '@fortawesome/free-solid-svg-icons';
import { GetHistoryUser } from '../model/getHistoryUser';
import { GetlistArchivos } from '../model/getlistArchivos';
import ModalUpload from '../ModalsDeSubida/ModalUpload';
import { GetArchivosSubidos } from '../model/getArchivosSubidos';
import { ReadArchivos, DeleteArchivos64 } from '../model/readArchivos';
import Swal from 'sweetalert2';
import { AutorizarEnvioCorreo, GetCorreosGuardados } from '../ModalCorreo/controllerModalCorreo';
import ModalListaCorreos from '../ModalCorreo/ModalListaCorreos';
import { TEXTO_ADAPTATIVO, BOTON_BASE, InfoTooltip, fechaDMA } from '../ReporteUI';
import SelectorTipoArchivo from './SelectorTipoArchivo';

const EXTENSIONES_IMAGEN = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'];

const Modal = ({ closeModal, archivosList, openModalCorreo, openModalEditCorreo, refreshe, user, iduser, start, end, sede, dni, nombre, empresa, contrata, token, name, apell, Acces, remoto = false }) => {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listarchivos, setListarchivos] = useState([]);
  const [read, setRead] = useState([])
  const [reload, setReload] = useState(0)
  const [openview, setOpenview] = useState(false)

  const [modalArchivos, setModalArchivos] = useState(false);
  const [datosarc, setDatosarc] = useState(null)
  const [currentFile, setCurrentFile] = useState(null);
  // Fila (examen) para la que se está eligiendo el tipo de archivo a subir
  const [selectorSubida, setSelectorSubida] = useState(null);
  // Mientras se consulta la lista de archivos se muestra un skeleton en la columna Archivos
  const [cargandoArchivos, setCargandoArchivos] = useState(true);
  // Historias clínicas cuya lista de archivos está desplegada completa (por defecto se muestran 5)
  const [archivosExpandidos, setArchivosExpandidos] = useState({});
  const ARCHIVOS_VISIBLES = 5;
  // Alto mínimo de la celda de archivos, medido en filas de archivo
  const FILAS_MINIMAS = 1;
  const alternarArchivos = (hc) => setArchivosExpandidos(prev => ({ ...prev, [hc]: !prev[hc] }));

  const [correosPendientesYEnviados, setCorreosPendientesYEnviados] = useState([])

  const [modalListaCorreos, setModalListaCorreos] = useState(false);
  const [datosListaCorreos, setDatosListaCorreos] = useState({ title: '', lista: [] });

  const openViewCorreos = (title, lista) => {
    setDatosListaCorreos({ title, lista });
    setModalListaCorreos(true);
  };

  const obtenerCorreosPendientes = async (norden) => {
    return await GetCorreosGuardados(norden, 'pendiente', token);
  }
  const obtenerCorreosEnviados = async (norden) => {
    return await GetCorreosGuardados(norden, 'enviado', token);
  }
  const obtenerCorreosEnProgreso = async (norden) => {
    return await GetCorreosGuardados(norden, 'en progreso', token);
  }
  const obtenerCorreosError = async (norden) => {
    return await GetCorreosGuardados(norden, 'error', token);
  }

  useEffect(() => {
    setLoading(true);
    GetHistoryUser(user, start, end, sede, dni, empresa, contrata, token, remoto)
      .then(response => {
        if (response.mensaje === 'No value present' || response.mensaje === 'Cannot invoke "java.util.List.stream()" because "listadoHP" is null') {
          setData([]);
        } else {
          setData(response);
        }
      })
      .catch(() => {
        setData([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    GetlistArchivos(token, iduser)
      .then(response => {
        setListarchivos(response);
      })
      .catch(error => {
        throw new Error('Network response was not ok.', error);
      });

  }, []);

  useEffect(() => {
    if (data && data.length > 0) {

      const fetchArchivos = async () => {
        setCargandoArchivos(true);
        // Se consultan todas las historias a la vez para que el skeleton dure lo menos posible.
        const resultados = await Promise.allSettled(
          data.map(item => GetArchivosSubidos(item.historiaClinica, iduser, token, remoto))
        );
        const archivosPorHistoria = {};
        resultados.forEach((r, i) => {
          if (r.status === 'fulfilled') {
            archivosPorHistoria[data[i].historiaClinica] = r.value;
          } else {
            console.error('Error fetching archivos for historiaClinica', data[i].historiaClinica, r.reason);
          }
        });
        setRead(archivosPorHistoria);
        setCargandoArchivos(false);
      };

      const fetchCorreos = async () => {
        const promises = data.map(async (item) => {
          const pendientesPromise = obtenerCorreosPendientes(item.orden)
          const enviadosPromise = obtenerCorreosEnviados(item.orden)
          const enProgresoPromise = obtenerCorreosEnProgreso(item.orden)
          const errorPromise = obtenerCorreosError(item.orden)

          const [pendientes, enviados, enProgreso, conError] = await Promise.all([
            pendientesPromise,
            enviadosPromise,
            enProgresoPromise,
            errorPromise
          ]);
          return {
            orden: item.orden,
            pendientes: pendientes ?? [],
            enviados: enviados ?? [],
            enProgreso: enProgreso ?? [],
            conError: conError ?? []
          };
        });

        const resultados = await Promise.all(promises);
        console.log({ resultados })
        return resultados;
      };
      fetchArchivos();
      // Los correos solo se consultan si alguna de sus columnas está visible.
      if (puedeGestionarCorreo || puedeAutorizarCorreo) {
        fetchCorreos().then(resultados => {
          setCorreosPendientesYEnviados(resultados);
        });
      }
    }
  }, [data, reload])

  const reloadread = () => {
    setReload(reload + 1)
  }

  useEffect(() => {
    reloadread();
  }, [refreshe])

  // Busca el tipo del archivo: primero por id y, si no coincide (los servidores remotos pueden tener
  // otros ids), por nomenclatura. Si no se encuentra, el archivo igual se muestra con un ícono genérico.
  const tipoDeArchivo = (readItem) => {
    const porId = listarchivos.find(archivo => archivo.id === readItem.id_tipo_archivo);
    if (porId) return porId;
    const nomenclatura = String(readItem.nomenclatura ?? '').trim().toUpperCase();
    if (!nomenclatura) return null;
    return listarchivos.find(archivo => String(archivo.nomenclatura ?? '').trim().toUpperCase() === nomenclatura) ?? null;
  };

  // Datos para pintar cada archivo: ícono según extensión, color del tipo y textos a mostrar.
  const infoArchivo = (readItem) => {
    const tipo = tipoDeArchivo(readItem);
    const extension = String(tipo?.extension || String(readItem.nombreArchivo ?? '').split('.').pop() || '').toLowerCase();
    const icono = extension === 'pdf'
      ? faFilePdf
      : ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)
        ? faFileImage
        : ['xlsx', 'xls', 'csv'].includes(extension)
          ? faFileCsv
          : faFile;
    return {
      icono,
      color: tipo?.codigo || '#64748b',
      nomenclatura: readItem.nomenclatura || tipo?.nomenclatura || '',
      tipoNombre: tipo?.nombre || '',
      nombreArchivo: readItem.nombreArchivo || '',
    };
  };

  const openModalArchivos = (archivoItem, historiaClinica, orden, contrata) => {
    const combinedParam = {
      archivoItem: archivoItem,
      historiaClinica: historiaClinica,
      orden: orden,
      nombres: name,
      apellidos: apell,
      contrata: contrata
    };
    setDatosarc(combinedParam)
    setModalArchivos(true);
  };

  const closeModalArchivos = () => {
    setModalArchivos(false);
  };

  const ReadFileBase64 = (response) => {
    const fileType = String(response.nombreArchivo ?? '').split('.').pop().toLowerCase();
    const byteCharacters = atob(response.fileBase64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    // Solo PDF e imágenes se pueden previsualizar; el resto (Excel, Word…) solo se descarga.
    const vista = fileType === 'pdf' ? 'pdf' : EXTENSIONES_IMAGEN.includes(fileType) ? 'imagen' : 'descarga';
    const mime = vista === 'pdf'
      ? 'application/pdf'
      : vista === 'imagen'
        ? `image/${fileType === 'jpg' ? 'jpeg' : fileType}`
        : 'application/octet-stream';
    const blob = new Blob([byteArray], { type: mime });

    const fileDataUri = URL.createObjectURL(blob);
    setCurrentFile({ uri: fileDataUri, name: response.nombreArchivo, type: mime, vista, extension: fileType });
  };


  const GetBase64 = (historia, readItem) => {
    // Si la búsqueda ya trajo el archivo (p. ej. desde un servidor remoto), se abre directo.
    if (readItem.fileBase64) {
      ReadFileBase64(readItem);
      return;
    }
    const id_archivo = readItem.id_tipo_archivo;
    setOpenview(true)
    ReadArchivos(historia, id_archivo, token, remoto)
      .then(response => {
        ReadFileBase64(response);
      })
      .catch(() => {
        Swal.fire({ title: 'Error', text: 'No se pudo abrir el archivo.', icon: 'error' });
      })
      .finally(() => {
        setOpenview(false)
      })
  };

  const DeleteBase64 = (id, nombreArchivo,) => {
    console.log(id, nombreArchivo)
    Swal.fire({
      title: "¿Estás Seguro?",
      html: `Está por eliminar: <strong>${nombreArchivo}</strong><br>Estos cambios no pueden ser revertidos.`,
      icon: "warning",
      iconColor: '#e7333f', // Configuración directa del color del ícono
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar!"
    }).then((result) => {
      if (result.isConfirmed) {
        DeleteArchivos64(id, token)
          .then(() => {
            Swal.fire({
              title: "Eliminado!",
              text: "El Archivo ha sido eliminado de la base de datos.",
              icon: "success"
            }).then((result) => {
              if (result.isConfirmed) reloadread();
            });
          })
          .catch(() => {
            Swal.fire({
              title: "Error!",
              text: "El Archivo no se ha podido eliminar!",
              icon: "error"
            });
          });
      }
    });
  };



  const enviarAutorizacionCorreo = (ordenYSede) => {
    AutorizarEnvioCorreo(ordenYSede, token, () => {
      reloadread();
    });
  }

  const puedeSubir = Acces("Reportes", "Subir Reportes");
  const puedeDescargar = Acces("Reportes", "Descargar Reportes");
  const puedeEliminar = Acces("Reportes", "Eliminar Reportes");
  // Columnas de correo ocultas por ahora ("Gestionar correo" y "Enviar correo").
  // Para volver a mostrarlas según permisos, descomentar estas dos líneas y borrar las dos de abajo.
  // const puedeGestionarCorreo = Acces("Reportes", "Registrar Correo a Enviar");
  // const puedeAutorizarCorreo = Acces("Reportes", "Autorizar Envio Correo");
  const puedeGestionarCorreo = false;
  const puedeAutorizarCorreo = false;
  const totalColumnas = 10 + [puedeSubir, puedeDescargar, puedeGestionarCorreo, puedeAutorizarCorreo].filter(Boolean).length;

  const th = "border px-2 py-2 text-center font-semibold whitespace-nowrap";
  const td = "border px-2 py-1.5 align-top";

  const resumenCorreos = (dataItem) => {
    const correos = correosPendientesYEnviados?.find(item => item.orden === dataItem.orden);
    return {
      correos,
      pendientes: correos?.pendientes?.length || 0,
      enviados: correos?.enviados?.length || 0,
      conError: correos?.conError?.length || 0,
      enProgreso: correos?.enProgreso?.length || 0,
    };
  };

  const ContadoresCorreo = ({ dataItem, correos, pendientes, enviados, conError, enProgreso }) => (
    <div className="space-y-1 text-left">
      <p
        className={pendientes > 0 ? 'cursor-pointer font-semibold text-blue-700 hover:underline' : ''}
        onClick={() => { if (pendientes > 0) openModalEditCorreo(dataItem.orden, dataItem.historiaClinica) }}
      >
        Pendientes: {pendientes}
      </p>
      <p>En cola: {enProgreso} {enProgreso > 0 && <FontAwesomeIcon icon={faEye} className="ml-1 cursor-pointer text-blue-600" title="Ver en cola" onClick={() => openViewCorreos('Correos En Cola', correos.enProgreso)} />}</p>
      <p className={conError > 0 ? 'text-red-600' : ''}>Error al enviar: {conError} {conError > 0 && <FontAwesomeIcon icon={faEye} className="ml-1 cursor-pointer text-blue-600" title="Ver errores" onClick={() => openViewCorreos('Correos con Error', correos.conError)} />}</p>
      <p className={enviados > 0 ? 'text-green-700' : ''}>Enviados: {enviados} {enviados > 0 && <FontAwesomeIcon icon={faEye} className="ml-1 cursor-pointer text-blue-600" title="Ver enviados" onClick={() => openViewCorreos('Correos Enviados', correos.enviados)} />}</p>
    </div>
  );

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-gray-800/50 p-2 sm:p-4 text-gray-800 ${TEXTO_ADAPTATIVO}`}>
      <div className="flex max-h-[95vh] w-full max-w-[96%] flex-col overflow-hidden rounded-lg bg-white shadow-xl">
        {/* Encabezado */}
        <div className="flex items-center justify-between bg-primario px-4 py-2.5 text-white">
          <h2 className="text-[1.05em] font-semibold">Historial Paciente</h2>
          <div className="flex items-center gap-1">
            <button onClick={reloadread} title="Refrescar archivos y correos" className="rounded px-2 py-1 hover:bg-white/10">
              <FontAwesomeIcon icon={faRotate} />
            </button>
            <button onClick={closeModal} title="Cerrar" className="rounded px-2 py-1 text-[1.2em] hover:bg-white/10">
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
        </div>

        {/* Datos del paciente */}
        <div className="grid grid-cols-1 gap-3 border-b bg-primarioClaro px-4 py-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-semibold text-gray-500">DNI</p>
            <p className="font-bold">{dni}</p>
          </div>
          <div className="lg:col-span-2">
            <p className="font-semibold text-gray-500">Paciente</p>
            <p className="font-bold">{nombre}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-500">Sucursal</p>
            <p className="flex items-center gap-2 font-bold">
              {sede}
              <span className={`rounded px-2 py-0.5 text-[0.8em] font-semibold ${remoto ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                {remoto ? 'Remoto' : 'Local'}
              </span>
            </p>
          </div>
        </div>

        {/* Tabla de historias */}
        <div className="flex-1 overflow-auto px-4 py-3">
          <div className="overflow-x-auto rounded-lg border border-gray-300">
            <table className="w-full table-auto border-collapse">
              <thead className="sticky top-0 z-10 bg-primario text-white">
                <tr>
                  {puedeSubir && <th className={th}>Subir</th>}
                  <th className={th}>Orden</th>
                  <th className={th}>Empresa</th>
                  <th className={th}>Contrata</th>
                  <th className={th}>Fecha examen</th>
                  <th className={th}>Examen</th>
                  <th className={th}>Estado</th>
                  <th className={th}>Cargo</th>
                  <th className={th}>Área</th>
                  <th className={th}>Grupo sanguíneo</th>
                  <th className={th}>Historia clínica</th>
                  {puedeDescargar && (
                    <th className={th}>
                      Archivos
                      {puedeEliminar && <InfoTooltip texto="Para eliminar un archivo, haga clic derecho sobre él." />}
                    </th>
                  )}
                  {puedeGestionarCorreo && <th className={th}>Gestionar correo</th>}
                  {puedeAutorizarCorreo && <th className={th}>Enviar correo</th>}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={totalColumnas} className="py-6 text-center text-gray-500">Cargando historial...</td></tr>
                ) : data.length === 0 ? (
                  <tr><td colSpan={totalColumnas} className="py-6 text-center text-gray-500">No se encontraron exámenes para este paciente</td></tr>
                ) : (
                  data.map((dataItem, dataIndex) => {
                    const resumen = resumenCorreos(dataItem);
                    return (
                      <tr key={dataIndex} className="odd:bg-white even:bg-gray-50 hover:bg-blue-50">
                        {puedeSubir && (
                          <td className={`${td} text-center`}>
                            <button
                              type="button"
                              disabled={listarchivos.length === 0}
                              onClick={() => setSelectorSubida(dataItem)}
                              className={`${BOTON_BASE} whitespace-nowrap bg-[#fc6b03] px-3 py-1 text-white hover:bg-[#e05f02]`}
                            >
                              <FontAwesomeIcon icon={faArrowUp} /> Subir archivo
                            </button>
                          </td>
                        )}
                        <td className={`${td} font-semibold`}>{dataItem.orden}</td>
                        <td className={td}>{dataItem.empresa}</td>
                        <td className={td}>{dataItem.contrata}</td>
                        <td className={`${td} whitespace-nowrap`}>{fechaDMA(dataItem.fechaExamen)}</td>
                        <td className={td}>{dataItem.examen}</td>
                        <td className={td}>{dataItem.estado}</td>
                        <td className={td}>{dataItem.cargo}</td>
                        <td className={td}>{dataItem.area}</td>
                        <td className={`${td} text-center`}>{dataItem.grupoSanguineo}</td>
                        <td className={td}>{dataItem.historiaClinica}</td>

                        {puedeDescargar && (
                          <td className={`${td} min-w-[220px]`}>
                            <div className="flex flex-col gap-1.5">
                              {(() => {
                                const archivos = Array.isArray(read[dataItem.historiaClinica]) ? read[dataItem.historiaClinica] : [];
                                const expandido = !!archivosExpandidos[dataItem.historiaClinica];
                                const visibles = expandido ? archivos : archivos.slice(0, ARCHIVOS_VISIBLES);
                                const ocultos = archivos.length - ARCHIVOS_VISIBLES;
                                // Fila con la misma altura que un archivo (borde + padding + una línea de texto).
                                // Se usa para el skeleton y para rellenar hasta FILAS_MINIMAS, así la fila de la
                                // tabla no cambia de alto entre "cargando", "sin archivos" y pocos archivos.
                                const filaBase = (key, clases, contenido = null) => (
                                  <div key={key} aria-hidden={!contenido} className={`flex items-center gap-1.5 rounded-md border px-2 py-1 ${clases}`}>
                                    {contenido ?? <span>&nbsp;</span>}
                                  </div>
                                );
                                const relleno = (usadas) =>
                                  Array.from({ length: Math.max(0, FILAS_MINIMAS - usadas) }).map((_, i) =>
                                    filaBase(`relleno-${i}`, 'invisible')
                                  );
                                if (cargandoArchivos) {
                                  return Array.from({ length: FILAS_MINIMAS }).map((_, i) =>
                                    filaBase(i, 'animate-pulse border-gray-200 bg-gray-50', (
                                      <>
                                        <span className="h-[1.2em] w-[1em] shrink-0 rounded bg-gray-300" />
                                        <span className="h-[0.8em] w-10 shrink-0 rounded bg-gray-300" />
                                        <span className="h-[0.8em] flex-1 rounded bg-gray-200" style={{ maxWidth: `${[140, 110, 170][i % 3]}px` }} />
                                        <span className="w-0 overflow-hidden">&nbsp;</span>
                                      </>
                                    ))
                                  );
                                }
                                if (archivos.length === 0) {
                                  return (
                                    <>
                                      {/* Sin borde: el padding compensa el 1px del borde para conservar el mismo alto que una fila de archivo */}
                                      <div className="flex items-center px-2 py-[calc(0.25rem+1px)] text-gray-400">Sin archivos</div>
                                      {relleno(1)}
                                    </>
                                  );
                                }
                                return (
                                  <>
                              {visibles.map((readItem, readIndex) => {
                                const info = infoArchivo(readItem);
                                return (
                                  <button
                                    key={readIndex}
                                    type="button"
                                    disabled={openview}
                                    {...(puedeEliminar ? { onContextMenu: (e) => { e.preventDefault(); DeleteBase64(readItem.id, readItem.nombreArchivo); } } : {})}
                                    onClick={() => GetBase64(dataItem.historiaClinica, readItem)}
                                    title={info.nombreArchivo}
                                    className="flex w-full items-center gap-1.5 whitespace-nowrap rounded-md border px-2 py-1 text-left transition hover:brightness-95 disabled:cursor-wait disabled:opacity-50"
                                    style={{
                                      backgroundColor: `color-mix(in srgb, ${info.color} 12%, white)`,
                                      borderColor: `color-mix(in srgb, ${info.color} 35%, white)`,
                                    }}
                                  >
                                    {/* Una sola línea: ícono, nomenclatura y nombre del archivo subido */}
                                    <FontAwesomeIcon icon={info.icono} className="shrink-0 text-[1.2em]" style={{ color: info.color }} />
                                    {info.nomenclatura && <span className="shrink-0 font-bold text-gray-800">{info.nomenclatura}</span>}
                                    {info.nombreArchivo && (
                                      <span className="min-w-0 max-w-[280px] truncate text-gray-500">{info.nombreArchivo}</span>
                                    )}
                                  </button>
                                );
                              })}
                                    {relleno(visibles.length)}
                                    {ocultos > 0 && (
                                      <button
                                        type="button"
                                        onClick={() => alternarArchivos(dataItem.historiaClinica)}
                                        className="self-start rounded px-1.5 py-0.5 font-semibold text-blue-600 hover:bg-blue-50 hover:underline"
                                      >
                                        {expandido ? 'Ver menos' : `Ver más (${ocultos})`}
                                      </button>
                                    )}
                                  </>
                                );
                              })()}
                            </div>
                          </td>
                        )}
                        {puedeGestionarCorreo && (
                          <td className={td}>
                            <ContadoresCorreo dataItem={dataItem} {...resumen} />
                            {resumen.enProgreso === 0 && (
                              <button
                                onClick={() => openModalCorreo(dataItem.orden, dataItem.historiaClinica)}
                                className={`${BOTON_BASE} mt-2 bg-blue-600 px-3 py-1 text-white hover:bg-blue-700`}
                              >
                                <FontAwesomeIcon icon={faPlus} /><FontAwesomeIcon icon={faEnvelope} /> Agregar
                              </button>
                            )}
                          </td>
                        )}
                        {puedeAutorizarCorreo && (
                          <td className={td}>
                            <ContadoresCorreo dataItem={dataItem} {...resumen} />
                            {resumen.pendientes !== 0 && (
                              <button
                                onClick={() => enviarAutorizacionCorreo(dataItem.historiaClinica)}
                                className={`${BOTON_BASE} mt-2 whitespace-nowrap bg-green-700 px-3 py-1 text-white hover:bg-green-800`}
                              >
                                <FontAwesomeIcon icon={faEnvelope} /> Enviar correo
                              </button>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {selectorSubida && (
        <SelectorTipoArchivo
          tipos={listarchivos}
          subidos={Array.isArray(read[selectorSubida.historiaClinica]) ? read[selectorSubida.historiaClinica] : []}
          orden={selectorSubida.orden}
          historiaClinica={selectorSubida.historiaClinica}
          onClose={() => setSelectorSubida(null)}
          onSelect={(tipo) => {
            openModalArchivos(tipo, selectorSubida.historiaClinica, selectorSubida.orden, selectorSubida.contrata);
            setSelectorSubida(null);
          }}
        />
      )}
      {modalArchivos && (
        <ModalUpload closeModal={closeModalArchivos} combinedParam={datosarc} dni={dni} user={user} token={token} reloadread={reloadread} sede={sede} />
      )}
      {modalListaCorreos && (
        <ModalListaCorreos
          open={modalListaCorreos}
          archivosList={archivosList}
          onClose={() => setModalListaCorreos(false)}
          title={datosListaCorreos.title}
          listaCorreos={datosListaCorreos.lista}
        />
      )}
      {currentFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800/50 p-4">
          <div className="flex max-h-[92vh] w-full max-w-[900px] flex-col overflow-hidden rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between gap-3 bg-primario px-4 py-2.5 text-white">
              <h2 className="truncate font-semibold">{currentFile.name}</h2>
              <button onClick={() => setCurrentFile(null)} title="Cerrar" className="rounded px-2 py-1 text-[1.2em] hover:bg-white/10">
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
            <div className={`flex flex-1 items-center justify-center overflow-auto bg-gray-100 ${currentFile.vista === 'imagen' ? 'px-4 py-8' : 'p-4'}`}>
              {currentFile.vista === 'pdf' && (
                <embed src={currentFile.uri} type="application/pdf" className="h-[70vh] w-full" />
              )}
              {currentFile.vista === 'imagen' && (
                <img
                  src={currentFile.uri}
                  alt={currentFile.name}
                  className="h-auto max-h-[65vh] max-w-full rounded shadow-sm"
                  onError={() => setCurrentFile(prev => prev && { ...prev, vista: 'descarga' })}
                />
              )}
              {currentFile.vista === 'descarga' && (
                <div className="flex flex-col items-center gap-2 py-6 text-center text-gray-600">
                  <FontAwesomeIcon
                    icon={['xlsx', 'xls', 'csv'].includes(currentFile.extension) ? faFileExcel : faFile}
                    className={`text-[3em] ${['xlsx', 'xls', 'csv'].includes(currentFile.extension) ? 'text-green-600' : 'text-gray-400'}`}
                  />
                  <p className="font-semibold text-gray-700">Este archivo no se puede previsualizar</p>
                  <p>Descárgalo para abrirlo{currentFile.extension ? ` (.${currentFile.extension})` : ''}.</p>
                </div>
              )}
            </div>
            <div className="flex justify-center border-t p-3">
              <a href={currentFile.uri} download={currentFile.name} className={`${BOTON_BASE} bg-blue-600 text-white hover:bg-blue-700`}>
                <FontAwesomeIcon icon={faDownload} /> Descargar
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default Modal;
