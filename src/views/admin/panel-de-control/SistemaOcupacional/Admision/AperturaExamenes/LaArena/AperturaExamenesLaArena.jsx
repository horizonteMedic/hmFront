import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBroom,
  faBuilding,
  faClipboardList,
  faFileImport,
  faFileMedical,
  faFloppyDisk,
  faListCheck,
  faLockOpen,
  faMoneyBillWave,
  faNotesMedical,
  faPenToSquare,
  faPlus,
  faStethoscope,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { SearchPacienteDNI } from '../../model/AdminPaciente';
import { SubmitHistoriaC } from '../../model/AdminHistoriaC';
import { getMasivoimport, ImportData } from '../../controller/HC';
import { getFetch } from '../../../../getFetch/getFetch.js';
import { useAuthStore } from '../../../../../../../store/auth.js';
import { fixEncodingModern } from '../../../../../../utils/helpers.js';
import ModalContrata from '../modals/modalContrata/ModalContrata';
import ModalPreCarga from '../modals/modalPreCargaTable/ModalPreCargaTable.jsx';
import ReportePacientes from '../modals/modalReportePacientes/ModalReportePacientes.jsx';
import ReportePacientes2 from '../modals/modalReportePacientes2/ModalReportePacientes2.jsx';
import ModalContabilidad from '../modals/modalContabilidad/ModalContabilidad.jsx';
import AutocompleteInput from './AutocompleteInput.jsx';
import ExamenesAdicionales from './ExamenesAdicionales.jsx';
import TablaHistorias from './TablaHistorias.jsx';
import { useListadoHistorias } from './useListadoHistorias.js';
import { imprimirHojaDeRuta } from './hojaDeRuta.js';
import { BOTON, INPUT, mostrarCargando } from './estilos.js';
import { Campo, Seccion, Selector } from './ui.jsx';
import {
  AUTORIZA_PRECARGA,
  CAMPOS_REQUERIDOS,
  crearDatosIniciales,
  aFechaDMA,
  EMPRESA_LA_ARENA,
  esEmpresaLaArena,
  FECHA_APERTURA_VALIDA,
  hoyDMA,
} from './constantes.js';

const enfocar = (id) => document.getElementById(id)?.focus();

// Apertura de exámenes ocupacionales exclusiva de LA ARENA S.A.
const AperturaExamenesLaArena = ({ listas, DNIG, selectedSede, token, userlogued, ChangeDNI }) => {
  const { EmpresasMulti, ContrataMulti, MedicosMulti, CargosMulti, AreaMulti, ExamenMulti, ExplotacionMulti, MineralMulti, AlturaMulti, FormaPago, ListAuth } =
    listas;

  // Solo se suscribe al nombre (useSessionData volvería a dibujar el formulario cada segundo por su reloj)
  const nombreSesion = useAuthStore((s) => s.userlogued?.datos?.nombres_user);
  const usuario = useMemo(() => fixEncodingModern(nombreSesion), [nombreSesion]);

  // Nombre exacto de la empresa tal como viene en la lista del backend
  const razonEmpresa = useMemo(() => {
    const lista = Array.isArray(EmpresasMulti) ? EmpresasMulti : [];
    const empresa =
      lista.find((e) => e.mensaje?.trim().toUpperCase() === EMPRESA_LA_ARENA) ?? lista.find((e) => esEmpresaLaArena(e.mensaje));
    return empresa?.mensaje ?? EMPRESA_LA_ARENA;
  }, [EmpresasMulti]);

  // — Estado del formulario —
  const [datos, setDatos] = useState(() => ({ ...crearDatosIniciales(), codPa: DNIG ? String(DNIG) : '' }));
  const [textoExamen, setTextoExamen] = useState(''); // el examen solo se fija al elegir una sugerencia
  const [modo, setModo] = useState('nuevo'); // 'nuevo' | 'edicion' (historia cargada desde la tabla)
  const [bloqueado, setBloqueado] = useState(false); // en edición, los campos están bloqueados hasta "Habilitar"
  const [dniEditado, setDniEditado] = useState(false); // tras habilitar y cambiar el DNI se puede "Agregar" como nueva
  const [buscandoPaciente, setBuscandoPaciente] = useState(false);
  const [editarPrecio, setEditarPrecio] = useState(false);
  const [modal, setModal] = useState(null); // 'contrata' | 'preCarga' | 'reportePacientes' | 'reportePacientes2' | 'contabilidad'
  const [opcionesPreCarga, setOpcionesPreCarga] = useState([]);

  const listado = useListadoHistorias(selectedSede, token);
  const registrosRef = useRef(listado.registros);
  registrosRef.current = listado.registros;

  const dniRef = useRef(null);
  const consultaPrecio = useRef(0);

  useEffect(() => {
    if (DNIG) dniRef.current?.focus();
  }, [DNIG]);

  const setCampo = useCallback((name, value) => setDatos((d) => ({ ...d, [name]: value })), []);
  const alEscribir = (e) => setCampo(e.target.name, e.target.value.toUpperCase());
  const alElegir = (e) => setCampo(e.target.name, e.target.value);
  const alElegirYEnfocar = (siguienteId) => (e) => {
    setCampo(e.target.name, e.target.value);
    enfocar(siguienteId);
  };
  const cerrarModal = () => setModal(null);

  const puedeAgregar = modo === 'nuevo' || dniEditado;

  const limpiar = () => {
    setDatos(crearDatosIniciales());
    setTextoExamen('');
    setModo('nuevo');
    setBloqueado(false);
    setDniEditado(false);
    setEditarPrecio(false);
    ChangeDNI?.('');
  };

  // — Paciente —
  const alCambiarDni = (e) => {
    setCampo('codPa', e.target.value.replace(/\D/g, '').slice(0, 8)); // solo números, hasta 8
    setDniEditado(true);
  };

  const consultarPaciente = async (dni) => {
    const paciente = await SearchPacienteDNI(selectedSede, dni, token);
    return paciente?.codPa ? paciente : null;
  };

  const buscarPaciente = async (e) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    mostrarCargando();
    setBuscandoPaciente(true);
    try {
      const paciente = await consultarPaciente(datos.codPa);
      if (!paciente) return Swal.fire('Error', 'No se ha encontrado al Paciente', 'error');
      setDatos((d) => ({ ...d, nombres: paciente.nombresPa, apellidos: paciente.apellidosPa }));
      Swal.close();
    } catch {
      Swal.fire('Error', 'Ha ocurrido un Error', 'error');
    } finally {
      setBuscandoPaciente(false);
    }
  };

  // Trae los datos de la última historia del paciente (sin su N° de historia ni su pre-carga)
  const importarUltimaHistoria = () => {
    ImportData(
      datos.codPa,
      Swal,
      getFetch,
      token,
      (importado) =>
        setDatos((d) => ({ ...d, ...importado, n_orden: d.n_orden, idPreNorden: d.idPreNorden, fechaAperturaPo: hoyDMA() })),
      (res) => setTextoExamen(res.nomExamen || '')
    );
  };

  const importarPreCarga = () => {
    if (!datos.codPa) return Swal.fire('Error', 'Coloque un DNI válido', 'error');
    getMasivoimport(datos.codPa, token, (todas) => {
      const delaArena = todas.filter((p) => esEmpresaLaArena(p.razonEmpresa));
      if (delaArena.length === 0) {
        return Swal.fire('Sin Resultado', `No hay pre-cargas de ${razonEmpresa} para este DNI`, 'info');
      }
      if (delaArena.length === 1) return aplicarPreCarga(delaArena[0]);
      setOpcionesPreCarga(delaArena);
      setModal('preCarga');
    });
  };

  const aplicarPreCarga = async (item) => {
    try {
      const paciente = await consultarPaciente(datos.codPa);
      if (!paciente) return Swal.fire('Error', 'No se ha encontrado al Paciente', 'error');
      setDatos((d) => ({
        ...d,
        ...item,
        nombres: paciente.nombresPa,
        apellidos: paciente.apellidosPa,
        fechaAperturaPo: d.fechaAperturaPo,
        userRegistroDatos: item.usuarioRegistro ?? '',
        protocolo: item.protocolo ?? '',
        precioPo: item.precio,
        tipoPago: item.tipoPago,
        textObserv1: item.observacion1,
        idPreNorden: item.id,
        n_medico: item.medico,
        cargoDe: item.cargo,
        areaO: item.area,
        nomEx: item.nomEx,
        mineralPo: item.mineral,
        alturaPo: item.altura,
        autoriza: AUTORIZA_PRECARGA,
        nomExamen: item.nombreExamen,
      }));
      setTextoExamen(item.nombreExamen || '');
      Swal.close();
    } catch {
      Swal.fire('Error', 'Ha ocurrido un Error', 'error');
    } finally {
      cerrarModal();
    }
  };

  // — Examen y precio —
  const elegirExamen = (examen) => {
    setTextoExamen(examen.mensaje);
    setCampo('nomExamen', examen.mensaje);
    const consulta = ++consultaPrecio.current; // si se elige otro examen enseguida, vale el último
    getFetch(`/api/v01/ct/ocupacional/PrecioExamenMutisucursal/${selectedSede}/${examen.mensaje}`, token)
      .then((res) => {
        if (consulta === consultaPrecio.current && res?.mensaje != null) setCampo('precioPo', res.mensaje);
      })
      .catch(() => {});
  };

  const alCambiarPrecio = (e) => {
    const valor = e.target.value;
    if (valor === '' || /^[\d.,\sS/]*$/.test(valor)) setCampo('precioPo', valor);
  };

  // Fecha DD/MM/AAAA mientras se escribe
  const alCambiarFecha = (e) => {
    const digitos = e.target.value.replace(/\D/g, '').slice(0, 8);
    let fecha = digitos;
    if (digitos.length >= 5) fecha = digitos.replace(/(\d{2})(\d{2})(\d{0,4})/, '$1/$2/$3');
    else if (digitos.length >= 3) fecha = digitos.replace(/(\d{2})(\d{0,2})/, '$1/$2');
    setCampo('fechaAperturaPo', fecha);
  };

  // — Tabla: cargar una historia / imprimir su hoja de ruta —
  const cargarHistoria = useCallback(
    async ({ n_orden }) => {
      try {
        const res = await getFetch(`/api/v01/ct/consentDigit/busquedaHistoriaOcupNOrden/${n_orden}`, token);
        if (!res || res.error) throw new Error('sin datos');
        setDatos({
          ...crearDatosIniciales(),
          ...res,
          fechaAperturaPo: aFechaDMA(res.fechaAperturaPo),
          userRegistroDatos: res.usuarioRegistro ?? '',
          protocolo: res.protocolo ?? '',
        });
        setTextoExamen(res.nomExamen || '');
        setModo('edicion');
        setBloqueado(true);
        setDniEditado(false);
        setEditarPrecio(false);
      } catch {
        Swal.fire('Error', 'No se pudo cargar la historia clínica', 'error');
      }
    },
    [token]
  );

  const imprimirHistoria = useCallback(
    async (registro) => {
      Swal.fire({
        title: "<span style='font-size:1.3em;font-weight:bold;'>Cargando Hoja de Ruta</span>",
        html: `<div style='font-size:1.1em;'>N° <b style='color:#2563eb;'>${registro.n_orden}</b></div><div class='mt-2'>Espere por favor...</div>`,
        icon: 'info',
        showConfirmButton: false,
        didOpen: () => Swal.showLoading(),
      });
      try {
        const hc = await getFetch(`/api/v01/ct/consentDigit/busquedaHistoriaOcupNOrden/${registro.n_orden}`, token);
        if (!hc || hc.error) throw new Error('sin datos');
        await imprimirHojaDeRuta({
          hc: {
            n_orden: hc.n_orden,
            nomExamen: hc.nomExamen,
            razonEmpresa: hc.razonEmpresa,
            n_psicosen: hc.n_psicosen,
            n_testaltura: hc.n_testaltura,
            nombres: registro.nombres,
            protocolo: hc.protocolo ?? '',
          },
          registros: registrosRef.current,
          token,
        });
      } catch {
        Swal.fire('Error', 'No se pudo preparar la hoja de ruta', 'error');
      }
    },
    [token]
  );

  // — Guardar (1 = registrar, 2 = actualizar) —
  const guardar = async (tipoOperacion) => {
    const envio = { ...datos, razonEmpresa };
    const faltantes = Object.entries(CAMPOS_REQUERIDOS)
      .filter(([campo]) => !envio[campo])
      .map(([, etiqueta]) => etiqueta);
    if (faltantes.length > 0) return Swal.fire('Error', `Faltan completar: ${faltantes.join(', ')}`, 'error');
    if (!FECHA_APERTURA_VALIDA.test(envio.fechaAperturaPo)) {
      return Swal.fire('Error', 'La fecha de apertura debe tener el formato DD/MM/AAAA', 'error');
    }

    mostrarCargando();
    try {
      const res = await SubmitHistoriaC({ ...envio, user_registro: userlogued }, selectedSede, token, tipoOperacion);
      if (!res?.id) {
        return Swal.fire(
          'Error',
          tipoOperacion === 1 ? 'No se ha podido registrar la Historia Clínica' : 'No se ha podido editar la Historia Clínica',
          'error'
        );
      }
      limpiar();
      listado.refrescar();
      if (tipoOperacion === 2) return Swal.fire('Editado', 'Historia Clínica Editada', 'success');

      imprimirHojaDeRuta({
        hc: {
          n_orden: res.id,
          nomExamen: envio.nomExamen,
          razonEmpresa,
          n_psicosen: envio.n_psicosen,
          n_testaltura: envio.n_testaltura,
          nombres: `${envio.apellidos} ${envio.nombres}`.trim(),
          protocolo: envio.protocolo,
        },
        registros: registrosRef.current,
        token,
      }).catch(() => Swal.fire('Aviso', 'La historia se registró, pero no se pudo preparar la hoja de ruta', 'warning'));
    } catch {
      Swal.fire('Error', 'Ocurrió un problema al guardar la Historia Clínica', 'error');
    }
  };

  const buscarPorCodigo = async (e) => {
    if (e.key !== 'Enter') return;
    const encontrado = await listado.buscarPorCodigo();
    if (!encontrado) Swal.fire('Sin Resultado', 'No se encontraron registros', 'warning');
  };

  return (
    <div className="px-[16px] pb-[24px]">
      {/* Encabezado */}
      <header className="mb-[14px] flex flex-wrap items-center justify-between gap-2 rounded-lg bg-primario px-[16px] py-[10px] text-white">
        <h2 className="mb-0 flex items-center gap-[10px] text-lg font-bold">
          <FontAwesomeIcon icon={faFileMedical} />
          Apertura de Exámenes · {razonEmpresa}
        </h2>
        <div className="flex items-center gap-[8px] text-base font-semibold">
          <span className="rounded-full bg-white/15 px-[12px] py-[3px]">Sede {selectedSede}</span>
          <span className={`rounded-full px-[12px] py-[3px] ${modo === 'edicion' ? 'bg-amber-500 text-slate-900' : 'bg-white/15'}`}>
            {modo === 'edicion' ? `Editando historia N° ${datos.n_orden}` : 'Nuevo registro'}
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 items-start gap-x-[16px] gap-y-[16px] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        {/* ───────── Formulario ───────── */}
        <div className="flex flex-col gap-[12px]">
          <Seccion
            icono={faUser}
            titulo="Datos del paciente"
            derecha={
              <span className="text-lg font-bold">
                Historia clínica N°
                <b className="ml-[6px] text-xl font-bold text-primario">{datos.n_orden || '—'}</b>
              </span>
            }
          >
            <div className="flex flex-col gap-[10px]">
              <Campo label="DNI" htmlFor="codPa">
                <div className="flex items-center gap-[8px]">
                  <input
                    id="codPa"
                    name="codPa"
                    ref={dniRef}
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    maxLength={8}
                    value={datos.codPa}
                    disabled={buscandoPaciente || bloqueado}
                    placeholder="DNI y Enter para buscar"
                    onChange={alCambiarDni}
                    onKeyDown={buscarPaciente}
                    className={`${INPUT} ${datos.idPreNorden ? '!border-orange-400 !bg-orange-100' : ''}`}
                  />
                  <button type="button" onClick={importarUltimaHistoria} disabled={bloqueado} className={`${BOTON} bg-blue-800 hover:bg-blue-700`}>
                    <FontAwesomeIcon icon={faFileImport} />
                    Importar
                  </button>
                  <button type="button" onClick={importarPreCarga} disabled={bloqueado} className={`${BOTON} bg-orange-600 hover:bg-orange-500`}>
                    <FontAwesomeIcon icon={faFileImport} />
                    Pre-carga
                  </button>
                </div>
              </Campo>
              <div className="grid grid-cols-2 gap-x-[12px]">
                <Campo label="Nombres" htmlFor="nombres">
                  <input id="nombres" name="nombres" type="text" autoComplete="off" value={datos.nombres ?? ''} disabled={bloqueado} onChange={alEscribir} className={INPUT} />
                </Campo>
                <Campo label="Apellidos" htmlFor="apellidos">
                  <input id="apellidos" name="apellidos" type="text" autoComplete="off" value={datos.apellidos ?? ''} disabled={bloqueado} onChange={alEscribir} className={INPUT} />
                </Campo>
              </div>
            </div>
          </Seccion>

          <Seccion icono={faBuilding} titulo="Empresa y atención">
            <div className="grid grid-cols-2 gap-x-[12px] gap-y-[10px]">
              <Campo label="Empresa" htmlFor="razonEmpresa" className="col-span-2">
                <input id="razonEmpresa" type="text" value={razonEmpresa} disabled title="Empresa fija de este formulario" className={INPUT} />
              </Campo>
              <Campo label="Contrata" htmlFor="razonContrata" className="col-span-2">
                <AutocompleteInput
                  id="razonContrata"
                  value={datos.razonContrata}
                  onChange={(v) => setCampo('razonContrata', v)}
                  onSelect={(o) => setCampo('razonContrata', o.mensaje)}
                  opciones={ContrataMulti}
                  placeholder="Escribe para buscar contrata..."
                  disabled={bloqueado}
                  siguienteId="n_medico"
                >
                  <button type="button" onClick={() => setModal('contrata')} disabled={bloqueado} className={`${BOTON} bg-green-600 hover:bg-green-500`}>
                    <FontAwesomeIcon icon={faPlus} />
                    Agregar
                  </button>
                </AutocompleteInput>
              </Campo>
              <Campo label="Médico ocupacional" htmlFor="n_medico">
                <AutocompleteInput
                  id="n_medico"
                  value={datos.n_medico}
                  onChange={(v) => setCampo('n_medico', v)}
                  onSelect={(o) => setCampo('n_medico', o.mensaje)}
                  opciones={MedicosMulti}
                  placeholder="Escribe para buscar médico..."
                  disabled={bloqueado}
                  siguienteId="cargoDe"
                />
              </Campo>
              <Campo label="Protocolo" htmlFor="protocolo">
                <input id="protocolo" name="protocolo" type="text" autoComplete="off" value={datos.protocolo ?? ''} disabled={bloqueado} onChange={alEscribir} placeholder="Opcional" className={INPUT} />
              </Campo>
            </div>
          </Seccion>

          <Seccion icono={faStethoscope} titulo="Área pre-ocupacional y examen">
            <div className="flex flex-col gap-[10px]">
              <div className="grid grid-cols-2 gap-x-[12px] gap-y-[10px]">
                <Campo label="Cargo" htmlFor="cargoDe">
                  <AutocompleteInput
                    id="cargoDe"
                    value={datos.cargoDe}
                    onChange={(v) => setCampo('cargoDe', v)}
                    onSelect={(o) => setCampo('cargoDe', o.mensaje)}
                    opciones={CargosMulti}
                    placeholder="Escribe para buscar cargo..."
                    disabled={bloqueado}
                    siguienteId="areaO"
                  />
                </Campo>
                <Campo label="Área" htmlFor="areaO">
                  <AutocompleteInput
                    id="areaO"
                    value={datos.areaO}
                    onChange={(v) => setCampo('areaO', v)}
                    onSelect={(o) => setCampo('areaO', o.mensaje)}
                    opciones={AreaMulti}
                    placeholder="Escribe para buscar área..."
                    disabled={bloqueado}
                    siguienteId="nomExamen"
                  />
                </Campo>
                <Campo label="Examen médico" htmlFor="nomExamen" className="col-span-2">
                  <AutocompleteInput
                    id="nomExamen"
                    value={textoExamen}
                    onChange={setTextoExamen}
                    onSelect={elegirExamen}
                    opciones={ExamenMulti}
                    placeholder="Escribe para buscar examen..."
                    disabled={bloqueado}
                    siguienteId="nomEx"
                    estricto
                    onSinCoincidencia={() => setCampo('nomExamen', '')}
                  />
                </Campo>
              </div>
              <div className="grid grid-cols-3 gap-x-[12px]">
                <Campo label="Explotación en" htmlFor="nomEx">
                  <Selector id="nomEx" value={datos.nomEx} onChange={alElegirYEnfocar('mineralPo')} opciones={ExplotacionMulti} disabled={bloqueado} />
                </Campo>
                <Campo label="Mineral exp." htmlFor="mineralPo">
                  <Selector id="mineralPo" value={datos.mineralPo} onChange={alElegirYEnfocar('alturaPo')} opciones={MineralMulti} disabled={bloqueado} />
                </Campo>
                <Campo label="Altura" htmlFor="alturaPo">
                  <Selector id="alturaPo" value={datos.alturaPo} onChange={alElegirYEnfocar('tipoPago')} opciones={AlturaMulti} disabled={bloqueado} />
                </Campo>
              </div>
            </div>
          </Seccion>

          <Seccion icono={faListCheck} titulo="Exámenes adicionales">
            <ExamenesAdicionales datos={datos} disabled={bloqueado} onToggle={(e) => setCampo(e.target.name, e.target.checked)} />
          </Seccion>

          <Seccion icono={faMoneyBillWave} titulo="Pago y autorización">
            <div className="grid grid-cols-2 gap-x-[12px] gap-y-[10px]">
              <Campo label="Precio del examen" htmlFor="precioPo">
                <div className="flex items-center gap-[8px]">
                  <input id="precioPo" name="precioPo" type="text" autoComplete="off" value={datos.precioPo ?? ''} disabled={bloqueado || !editarPrecio} onChange={alCambiarPrecio} className={INPUT} />
                  <label className="mb-0 flex cursor-pointer items-center gap-[4px] whitespace-nowrap text-lg font-semibold">
                    <input type="checkbox" checked={editarPrecio} disabled={bloqueado} onChange={(e) => setEditarPrecio(e.target.checked)} />
                    Editar
                  </label>
                </div>
              </Campo>
              <Campo label="Forma de pago" htmlFor="tipoPago">
                <Selector id="tipoPago" value={datos.tipoPago} onChange={alElegir} opciones={FormaPago} disabled={bloqueado} vacio="Seleccionar" />
              </Campo>
              <Campo label="Autorizado por" htmlFor="autoriza">
                <Selector id="autoriza" value={datos.autoriza} onChange={alElegir} opciones={ListAuth} disabled={bloqueado} vacio="Seleccionar" />
              </Campo>
              <Campo label="Fecha de apertura" htmlFor="fechaAperturaPo">
                <input id="fechaAperturaPo" name="fechaAperturaPo" type="text" inputMode="numeric" autoComplete="off" maxLength={10} placeholder="DD/MM/AAAA" value={datos.fechaAperturaPo ?? ''} disabled={bloqueado} onChange={alCambiarFecha} className={INPUT} />
              </Campo>
            </div>
          </Seccion>

          <Seccion icono={faNotesMedical} titulo="Observaciones y registro">
            <div className="grid grid-cols-2 gap-x-[12px] gap-y-[10px]">
              <Campo label="Observación 1" htmlFor="textObserv1" className="col-span-2">
                <input id="textObserv1" name="textObserv1" type="text" autoComplete="off" value={datos.textObserv1 ?? ''} disabled={bloqueado} onChange={alEscribir} className={INPUT} />
              </Campo>
              <Campo label="Observación 2" htmlFor="textObserv2" className="col-span-2">
                <input id="textObserv2" name="textObserv2" type="text" autoComplete="off" value={datos.textObserv2 ?? ''} disabled={bloqueado} onChange={alEscribir} className={INPUT} />
              </Campo>
              <Campo label="Registrado por" htmlFor="userRegistroDatos">
                <input id="userRegistroDatos" type="text" value={datos.userRegistroDatos ?? ''} disabled className={`${INPUT} capitalize`} />
              </Campo>
              <Campo label="Usuario" htmlFor="usuario">
                <input id="usuario" type="text" value={usuario} disabled className={`${INPUT} capitalize`} />
              </Campo>
            </div>
          </Seccion>

          <div className="flex flex-wrap items-center justify-end gap-[8px]">
            <button type="button" onClick={limpiar} className={`${BOTON} bg-slate-600 hover:bg-slate-500`}>
              <FontAwesomeIcon icon={faBroom} />
              Limpiar
            </button>
            {modo === 'edicion' && (
              <>
                <button type="button" onClick={() => setBloqueado(false)} disabled={!bloqueado} className={`${BOTON} bg-blue-800 hover:bg-blue-700`}>
                  <FontAwesomeIcon icon={faLockOpen} />
                  Habilitar
                </button>
                <button type="button" onClick={() => guardar(2)} disabled={bloqueado} className={`${BOTON} bg-blue-800 hover:bg-blue-700`}>
                  <FontAwesomeIcon icon={faPenToSquare} />
                  Actualizar
                </button>
              </>
            )}
            {puedeAgregar && (
              <button type="button" onClick={() => guardar(1)} disabled={!datos.codPa} className={`${BOTON} bg-blue-800 hover:bg-blue-700`}>
                <FontAwesomeIcon icon={faFloppyDisk} />
                Agregar
              </button>
            )}
          </div>
        </div>

        {/* ───────── Listado ───────── */}
        <Seccion
          icono={faClipboardList}
          titulo="Últimos agregados y hojas de ruta"
          derecha={<span className="rounded-full bg-blue-100 px-[10px] py-[2px] text-base font-semibold text-blue-900">{listado.visibles.length} registros</span>}
        >
          <div className="flex flex-col gap-[10px]">
            <div className="grid grid-cols-1 gap-x-[12px] gap-y-[10px] sm:grid-cols-[3fr_2fr]">
              <Campo label="Buscar por nombre" htmlFor="nombre">
                <input id="nombre" type="text" autoComplete="off" value={listado.busqueda.nombre} onChange={(e) => listado.cambiarNombre(e.target.value.toUpperCase())} placeholder="Nombres o apellidos" className={INPUT} />
              </Campo>
              <Campo label="Buscar por código (N° orden)" htmlFor="codigo">
                <input
                  id="codigo"
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  value={listado.busqueda.codigo}
                  onChange={(e) => /^\d{0,7}$/.test(e.target.value) && listado.cambiarCodigo(e.target.value)}
                  onKeyDown={buscarPorCodigo}
                  placeholder="N° y Enter"
                  className={INPUT}
                />
              </Campo>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-[8px]">
              <span className="text-sm text-gray-700">
                <b className="font-semibold">Click izquierdo</b> carga la historia · <b className="font-semibold">Click derecho</b> imprime la hoja de ruta
              </span>
              <div className="flex flex-wrap items-center gap-[8px]">
                <button type="button" onClick={() => setModal('reportePacientes')} className={`${BOTON} verde-btn !font-normal`}>Reporte de Pacientes</button>
                <button type="button" onClick={() => setModal('reportePacientes2')} className={`${BOTON} verde-btn !font-normal`}>Reporte de Pacientes 2</button>
                <button type="button" onClick={() => setModal('contabilidad')} className={`${BOTON} verde-btn !font-normal`}>Reporte Contabilidad</button>
              </div>
            </div>

            <TablaHistorias
              registros={listado.visibles}
              cargando={listado.cargando}
              seleccionado={modo === 'edicion' ? datos.n_orden : null}
              onEditar={cargarHistoria}
              onImprimir={imprimirHistoria}
            />
          </div>
        </Seccion>
      </div>

      {modal === 'contrata' && (
        <ModalContrata onClose={cerrarModal} Swal={Swal} Get={getFetch} token={token} GetRazonS={(nombre) => setCampo('razonContrata', nombre)} />
      )}
      {modal === 'preCarga' && <ModalPreCarga opcionesPreCarga={opcionesPreCarga} setModalPreCarga={cerrarModal} aplicarPreCarga={aplicarPreCarga} />}
      {modal === 'reportePacientes' && <ReportePacientes onClose={cerrarModal} sede={selectedSede} token={token} />}
      {modal === 'reportePacientes2' && <ReportePacientes2 onClose={cerrarModal} sede={selectedSede} token={token} />}
      {modal === 'contabilidad' && <ModalContabilidad onClose={cerrarModal} sede={selectedSede} token={token} />}
    </div>
  );
};

export default AperturaExamenesLaArena;
