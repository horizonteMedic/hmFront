import { useState, useEffect, useRef, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyncAlt, faUpload, faClockRotateLeft, faEye } from '@fortawesome/free-solid-svg-icons';
import { ComboboxSedes, ComboboxEmpresas, ComboboxContratas } from './Modal/Combobox';
import { GetListREport } from './model/getlistreport';
import { useAuthStore } from '../../../../store/auth';
import Modal from './Modal/Modal';
import DataUploadModal from './DataUploadModal/DataUploadModal';
import Historial from './Historial/Historial';
import ModalCorreo from './ModalCorreo/ModalCorreo';
import ModalEditCorreo from './ModalCorreo/ModalEditCorreo';
import { GetListArchivos } from './ModalCorreo/controllerModalCorreo';
import InputTextOneLine from '../../../components/reusableComponents/InputTextOneLine';
import { SelectField } from '../../../components/reusableComponents/InputSelect';
import PaginadorTabla from '../../../components/reusableComponents/PaginadorTabla';
import { usePagination } from '../../../utils/listUtils';
import { Seccion, TEXTO_ADAPTATIVO, BOTON_BASE, fechaDMA } from './ReporteUI';

const MENSAJES_SIN_DATOS = [
  'No value present',
  'Cannot invoke "java.util.List.stream()" because "listadoHP" is null',
];

const toTitleCase = (str = '') =>
  str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

const HistorialPaciente = () => {
  const [showDataUploadModal, setShowDataUploadModal] = useState(false);
  const [showHistorial, setShowHistorial] = useState(false);

  const [showCorreoModal, setShowCorreoModal] = useState(false);
  const [showEditCorreoModal, setShowEditCorreoModal] = useState(false);
  const [nordenSeleccionadoCorreo, setNordenSeleccionadoCorreo] = useState('');
  const [nordenYSedeSeleccionadoCorreo, setNordenYSedeSeleccionadoCorreo] = useState('');

  const ListSedes = ComboboxSedes();
  const ListEmpresa = ComboboxEmpresas();
  const ListContrata = ComboboxContratas();

  const [sede, setSede] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [contrata, setContrata] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingOtrasSedes, setLoadingOtrasSedes] = useState(false);
  const [porcentaje, setPorcentaje] = useState(0);
  const [archivosList, setArchivosList] = useState([]);
  const [refreshe, setRefreshe] = useState(0);
  const [data, setData] = useState([]);
  const [reload, setReload] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [pacienteSel, setPacienteSel] = useState(null);

  const abortController = useRef(null);
  const secondPlaneAbortController = useRef(null);

  const token = useAuthStore(state => state.token);
  const userlogued = useAuthStore(state => state.userlogued);
  const Acceso = useAuthStore(state => state.listAccesos);

  const options = { timeZone: 'America/Lima' };
  const [startDate, setStartDate] = useState(new Date(2023, 0, 1).toLocaleDateString('en-CA', options));
  const [endDate, setEndDate] = useState(new Date().toLocaleDateString('en-CA', options));

  const tienePermisoEnVista = (nombreVista, permiso) => {
    const vista = Acceso.find(item => item.nombre === nombreVista);
    return vista?.listaPermisos.includes(permiso) ?? false;
  };

  const empresaBloqueada = ListEmpresa.some(o => o.ruc === '0');
  const contrataBloqueada = ListContrata.some(o => o.ruc === '0');
  const cargandoSedes = loading || loadingOtrasSedes;

  useEffect(() => {
    if (ListSedes.length > 0) setSede(ListSedes[0].cod_sede);
    if (ListEmpresa.length > 0 && ListEmpresa[0].ruc !== '0') {
      setEmpresa(ListEmpresa[0].ruc);
      return;
    }
    if (ListContrata.length > 0 && ListContrata[0].ruc !== '0') {
      setContrata(ListContrata[0].ruc);
    }
  }, [ListSedes, ListEmpresa, ListContrata]);

  useEffect(() => {
    GetListArchivos(setArchivosList, token);
  }, []);

  // Búsqueda (desde 3 caracteres) por DNI o nombre
  const filteredData = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (term.length < 3) return data;
    if (!isNaN(term[0])) {
      return data.filter(item => String(item.dni ?? '').includes(term));
    }
    return data.filter(item => {
      const nombres = typeof item.nombres === 'string' ? item.nombres.toLowerCase() : '';
      const apellidos = typeof item.apellidos === 'string' ? item.apellidos.toLowerCase() : '';
      return `${nombres} ${apellidos}`.includes(term) || `${apellidos} ${nombres}`.includes(term);
    });
  }, [data, searchTerm]);

  const paginacion = usePagination(filteredData, 10);
  const { setCurrentPage, paginatedData } = paginacion;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Carga la sede seleccionada y luego el resto en segundo plano
  useEffect(() => {
    if (!(startDate && endDate && sede)) return;

    abortController.current?.abort();
    secondPlaneAbortController.current?.abort();
    abortController.current = new AbortController();
    const { signal } = abortController.current;

    setPorcentaje(0);
    setLoading(true);
    setLoadingOtrasSedes(true);
    setCurrentPage(1);

    GetListREport(userlogued.sub, startDate, endDate, sede, empresa, contrata, token, { signal })
      .then(response => {
        if (MENSAJES_SIN_DATOS.includes(response?.mensaje) || !Array.isArray(response)) {
          setData([]);
        } else {
          setData(response);
        }
        setPorcentaje(ListSedes.length ? Math.round(100 / ListSedes.length) : 100);
      })
      .catch(() => { })
      .finally(() => {
        if (signal.aborted) return;
        setLoading(false);
        cargarOtrasSedes();
      });
  }, [startDate, endDate, sede, empresa, contrata, reload]);

  const cargarOtrasSedes = async () => {
    secondPlaneAbortController.current?.abort();
    secondPlaneAbortController.current = new AbortController();
    const { signal } = secondPlaneAbortController.current;

    const otrasSedes = ListSedes.filter(s => s.cod_sede !== sede);
    const resultados = await Promise.allSettled(
      otrasSedes.map(s => GetListREport(userlogued.sub, startDate, endDate, s.cod_sede, empresa, contrata, token, { signal }))
    );
    if (signal.aborted) return;
    const extra = resultados
      .filter(r => r.status === 'fulfilled')
      .flatMap(r => (Array.isArray(r.value) ? r.value : []));
    setData(prev => [...prev, ...extra]);
    setPorcentaje(100);
    setLoadingOtrasSedes(false);
  };

  const openModalCorreo = (norden, historiaClinica) => {
    setShowCorreoModal(true);
    setNordenYSedeSeleccionadoCorreo(historiaClinica);
    setNordenSeleccionadoCorreo(norden);
  };

  const openModalEditCorreo = (norden, historiaClinica) => {
    setShowEditCorreoModal(true);
    setNordenYSedeSeleccionadoCorreo(historiaClinica);
    setNordenSeleccionadoCorreo(norden);
  };

  const cerrarCorreos = () => {
    setShowCorreoModal(false);
    setShowEditCorreoModal(false);
    setNordenSeleccionadoCorreo('');
    setNordenYSedeSeleccionadoCorreo('');
  };

  const opcionesSedes = ListSedes.map(o => ({ value: o.cod_sede, label: o.nombre_sede }));
  const opcionesEmpresas = ListEmpresa.map(o => ({ value: o.ruc, label: toTitleCase(o.razonSocial) }));
  const opcionesContratas = ListContrata.map(o => ({ value: o.ruc, label: o.razonSocial }));

  return (
    <div className={`w-full space-y-4 px-4 py-6 text-gray-800 md:px-8 ${TEXTO_ADAPTATIVO}`}>
      <Seccion
        titulo="Reporte de Pacientes"
        acciones={
          <>
            {tienePermisoEnVista('Reportes', 'Historial Masivo') && (
              <button onClick={() => setShowHistorial(true)} className={`${BOTON_BASE} bg-white text-primario hover:bg-gray-100`}>
                <FontAwesomeIcon icon={faClockRotateLeft} /> Historial
              </button>
            )}
            {tienePermisoEnVista('Reportes', 'Carga Masiva 1') && (
              <button onClick={() => setShowDataUploadModal(true)} className={`${BOTON_BASE} bg-[#fc6b03] text-white hover:bg-[#e05f02]`}>
                <FontAwesomeIcon icon={faUpload} /> Subir Carpeta
              </button>
            )}
          </>
        }
      >
        <div className="grid grid-cols-1 items-end gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
          <InputTextOneLine
            label="Fecha inicio"
            name="fechaInicio"
            type="date"
            labelOnTop
            value={startDate}
            onChange={(e) => { setData([]); setStartDate(e.target.value); }}
          />
          <InputTextOneLine
            label="Fecha fin"
            name="fechaFin"
            type="date"
            labelOnTop
            value={endDate}
            onChange={(e) => { setData([]); setEndDate(e.target.value); }}
          />
          <SelectField
            label="Sede"
            name="sede"
            value={sede}
            options={opcionesSedes}
            onChange={(e) => setSede(e.target.value)}
          />
          <SelectField
            label="Empresa"
            name="empresa"
            value={empresa}
            options={opcionesEmpresas}
            disabled={empresaBloqueada}
            onChange={(e) => { setData([]); setEmpresa(e.target.value); setContrata(''); setSearchTerm(''); }}
          />
          <SelectField
            label="Contrata"
            name="contrata"
            value={contrata}
            options={opcionesContratas}
            disabled={contrataBloqueada}
            onChange={(e) => { setData([]); setContrata(e.target.value); setEmpresa(''); setSearchTerm(''); }}
          />
          <div className="flex items-end">
            <button
              onClick={() => setReload(r => r + 1)}
              disabled={loading}
              className={`${BOTON_BASE} w-full justify-center bg-blue-600 py-2 text-white hover:bg-blue-700`}
            >
              <FontAwesomeIcon icon={faSyncAlt} spin={loading} /> Actualizar
            </button>
          </div>
        </div>

        {/* Progreso de carga de sedes */}
        <div className="mt-4 flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3">
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-white">
            <div
              className={`h-full rounded-full transition-all duration-500 ${porcentaje >= 100 ? 'bg-green-600' : 'bg-[#fc6b03]'}`}
              style={{ width: `${porcentaje}%` }}
            />
          </div>
          <span className="font-semibold text-gray-600 sm:w-56 sm:text-right">
            {porcentaje >= 100 ? 'Datos cargados: 100%' : `Cargando sedes… ${porcentaje}%`}
          </span>
        </div>
      </Seccion>

      <Seccion titulo={`Pacientes (${filteredData.length})`}>
        <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <InputTextOneLine
            label="Buscar"
            name="buscarPaciente"
            labelWidth="70px"
            className="w-full md:max-w-md"
            placeholder={cargandoSedes ? 'Esperando carga de sedes…' : 'DNI o nombre (mín. 3 caracteres)'}
            disabled={cargandoSedes}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <p className="text-gray-500">Haga clic en un paciente para ver su historial.</p>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-300 bg-white">
          <table className="w-full table-auto border-collapse">
            <thead className="sticky top-0 bg-primario text-white">
              <tr>
                <th className="border px-3 py-2 text-left font-semibold">DNI</th>
                <th className="border px-3 py-2 text-left font-semibold">Apellidos</th>
                <th className="border px-3 py-2 text-left font-semibold">Nombres</th>
                <th className="border px-3 py-2 text-left font-semibold">Sucursal</th>
                <th className="border px-3 py-2 text-left font-semibold">Fecha examen</th>
                <th className="border px-3 py-2 text-center font-semibold">Acción</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="py-6 text-center text-gray-500">Cargando pacientes...</td></tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-gray-500">
                    {searchTerm ? 'No hay pacientes que coincidan con la búsqueda' : 'No hay pacientes para los filtros elegidos'}
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, index) => (
                  <tr
                    key={`${item.dni}-${item.codigo_sucursal}-${index}`}
                    onClick={() => setPacienteSel(item)}
                    className="cursor-pointer odd:bg-white even:bg-gray-50 hover:!bg-blue-50"
                  >
                    <td className="border px-3 py-1.5 font-semibold">{item.dni}</td>
                    <td className="border px-3 py-1.5">{item.apellidos}</td>
                    <td className="border px-3 py-1.5">{item.nombres}</td>
                    <td className="border px-3 py-1.5">
                      <span className="inline-flex items-center gap-1.5">
                        {item.codigo_sucursal}
                        {item.remoto && (
                          <span className="rounded bg-orange-100 px-1.5 py-0.5 text-[0.8em] font-semibold text-orange-700">Remoto</span>
                        )}
                      </span>
                    </td>
                    <td className="border px-3 py-1.5">{fechaDMA(item.fecha_examen)}</td>
                    <td className="border px-3 py-1.5 text-center">
                      <button
                        onClick={(e) => { e.stopPropagation(); setPacienteSel(item); }}
                        className="inline-flex items-center gap-1.5 rounded bg-blue-600 px-3 py-1 font-semibold text-white hover:bg-blue-700"
                      >
                        <FontAwesomeIcon icon={faEye} /> Ver
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <PaginadorTabla paginacion={paginacion} total={filteredData.length} etiqueta="pacientes" />
      </Seccion>

      {pacienteSel && (
        <Modal
          closeModal={() => setPacienteSel(null)}
          archivosList={archivosList}
          openModalCorreo={openModalCorreo}
          openModalEditCorreo={openModalEditCorreo}
          refreshe={refreshe}
          user={userlogued.sub}
          iduser={userlogued.id_user}
          start={pacienteSel.fecha_examen}
          end={endDate}
          sede={pacienteSel.codigo_sucursal}
          dni={pacienteSel.dni}
          nombre={`${pacienteSel.apellidos} ${pacienteSel.nombres}`}
          empresa={empresa}
          contrata={contrata}
          token={token}
          name={pacienteSel.nombres}
          apell={pacienteSel.apellidos}
          remoto={pacienteSel.remoto ?? false}
          Acces={tienePermisoEnVista}
        />
      )}

      <ModalCorreo open={showCorreoModal} archivosList={archivosList} refrescar={() => setRefreshe(p => p + 1)} norden={nordenSeleccionadoCorreo} nordenYSede={nordenYSedeSeleccionadoCorreo} onClose={cerrarCorreos} />
      <ModalEditCorreo open={showEditCorreoModal} archivosList={archivosList} refrescar={() => setRefreshe(p => p + 1)} norden={nordenSeleccionadoCorreo} nordenYSede={nordenYSedeSeleccionadoCorreo} onClose={cerrarCorreos} />
      {showDataUploadModal && <DataUploadModal closeModal={() => setShowDataUploadModal(false)} Sedes={ListSedes} user={userlogued.sub} token={token} />}
      {showHistorial && <Historial closeModal={() => setShowHistorial(false)} token={token} user={userlogued.sub} />}
    </div>
  );
};

export default HistorialPaciente;
