import { useCallback, useEffect, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileImport, faPlus, faUpload } from '@fortawesome/free-solid-svg-icons';
import { SearchPacienteDNI } from '../../model/AdminPaciente';
import { SubmitHistoriaC } from '../../model/AdminHistoriaC';
import { getMasivoimport, ImportData } from '../../controller/HC';
import { getFetch } from '../../../../getFetch/getFetch.js';
import { getFechaHoraActual } from '../../../../../../utils/helpers.js';
import { buildAuditoria } from '../../../../../../utils/auditoriaUtils.js';
import { useRegistroEditable } from '../../../../../../hooks/useRegistroEditable.js';
import AccionesRegistroHeader from '../../../../../../components/reusableComponents/AccionesRegistroHeader.jsx';
import AuditoriaRegistro from '../../../../../../components/reusableComponents/AuditoriaRegistro.jsx';
import InputAutocomplete from '../../../../../../components/reusableComponents/InputAutocomplete.jsx';
import InputCheckbox from '../../../../../../components/reusableComponents/InputCheckbox.jsx';
import InputTextOneLine from '../../../../../../components/reusableComponents/InputTextOneLine.jsx';
import { SelectField } from '../../../../../../components/reusableComponents/InputSelect.jsx';
import SectionFieldset from '../../../../../../components/reusableComponents/SectionFieldset.jsx';
import BotonesForm from '../../../../../../components/templates/BotonesForm.jsx';
import ModalEmpresa from '../modals/modalEmpresa/ModalEmpresa';
import ModalContrata from '../modals/modalContrata/ModalContrata';
import SubidaMasiva from '../modals/modalSubidaMasiva/ModalSubidaMasiva.jsx';
import ModalPreCarga from '../modals/modalPreCargaTable/ModalPreCargaTable.jsx';
import ReportePacientes from '../modals/modalReportePacientes/ModalReportePacientes.jsx';
import ReportePacientes2 from '../modals/modalReportePacientes2/ModalReportePacientes2.jsx';
import ModalContabilidad from '../modals/modalContabilidad/ModalContabilidad.jsx';
import TablaHistorias from './TablaHistorias.jsx';
import { useListadoHistorias } from './useListadoHistorias.js';
import { imprimirHojaDeRuta } from './hojaDeRuta.js';
import { mostrarCargando } from './avisos.js';
import { historiaAFormulario, importadoAFormulario, preCargaAFormulario } from './mapeo.js';
import {
  CAMPOS_EDITABLES,
  CAMPOS_REQUERIDOS,
  crearDatosIniciales,
  EXAMENES_ADICIONALES,
  FECHA_APERTURA_VALIDA,
} from './constantes.js';

const LABEL = '140px';
const BOTON = 'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded px-3 py-1 text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50';
const BOTON_FORM = 'disabled:opacity-50 disabled:cursor-not-allowed bg-emerald-600 hover:bg-emerald-700 text-white text-base px-6 py-2 rounded flex items-center gap-2 transition-all duration-150 ease-out hover:shadow-lg active:scale-95 active:shadow-inner';
const PRECIO_VALIDO = /^[\d.,\sS/]*$/;

const textoOpcion = (opcion) => opcion.mensaje || opcion.descripcion;
const aOpciones = (lista) => (Array.isArray(lista) ? lista : []).map((o) => ({ value: textoOpcion(o), label: textoOpcion(o) }));
const enfocar = (id) => document.getElementById(id)?.focus();
const noHacerNada = () => {};

// Apertura de exámenes ocupacionales (PreOcupacional)
const AperturaExamenesPreOcup = ({ listas, DNIG, selectedSede, token, userlogued, ChangeDNI, tienePermisoEnVista }) => {
  const { EmpresasMulti, ContrataMulti, MedicosMulti, CargosMulti, AreaMulti, ExamenMulti, ExplotacionMulti, MineralMulti, AlturaMulti, FormaPago, ListAuth } = listas;

  // — Estado del formulario —
  const [datos, setDatos] = useState(() => ({ ...crearDatosIniciales(), codPa: DNIG ? String(DNIG) : '' }));
  const [dniEditado, setDniEditado] = useState(false); // tras habilitar y cambiar el DNI se puede "Agregar" como nueva
  const [buscandoPaciente, setBuscandoPaciente] = useState(false);
  const [precioEditable, setPrecioEditable] = useState(false);
  const [mostrarErrores, setMostrarErrores] = useState(false);
  const [modal, setModal] = useState(null); // 'empresa' | 'contrata' | 'masiva' | 'preCarga' | 'reportePacientes' | 'reportePacientes2' | 'contabilidad'
  const [opcionesPreCarga, setOpcionesPreCarga] = useState([]);
  const [cargaId, setCargaId] = useState(0); // cambia cada vez que se carga una historia de la tabla (aunque sea la misma)

  // Resumen de pacientes completados / faltantes del día elegido
  const [fechaResumen, setFechaResumen] = useState(() => new Date());
  const [resumen, setResumen] = useState({ completos: '—', faltantes: '—' });

  // Una historia cargada desde la tabla queda bloqueada hasta "Habilitar edición"; al cargar otra se vuelve a bloquear
  const { edicionHabilitada, habilitarEdicion, camposDeshabilitados, isFieldEdited, revertField, revertFields } = useRegistroEditable(datos, setDatos, {
    tieneRegistro: datos.tieneRegistro,
    camposEditables: CAMPOS_EDITABLES,
    resetKey: cargaId,
  });

  const listado = useListadoHistorias(selectedSede, token);
  const registrosRef = useRef(listado.registros);
  registrosRef.current = listado.registros;

  useEffect(() => {
    if (DNIG) enfocar('codPa');
  }, [DNIG]);

  useEffect(() => {
    let vigente = true;
    getFetch(`/api/v01/ct/consentDigit/resumenAdmPacientesConFiltros?nomSede=${selectedSede}&fecha=${format(fechaResumen, 'dd/MM/yyyy')}`, token)
      .then((res) => vigente && setResumen({ completos: res?.completos ?? '—', faltantes: res?.faltantes ?? '—' }))
      .catch(() => vigente && setResumen({ completos: '—', faltantes: '—' }));
    return () => {
      vigente = false;
    };
  }, [fechaResumen, selectedSede, token]);

  const setCampo = useCallback((name, value) => setDatos((d) => ({ ...d, [name]: value })), []);
  const alEscribir = (e) => {
    const { name, value, selectionStart, selectionEnd } = e.target;
    setCampo(name, value.toUpperCase());
    requestAnimationFrame(() => e.target.setSelectionRange?.(selectionStart, selectionEnd)); // el cursor no salta al final
  };
  const alElegirYEnfocar = (siguienteId) => (e) => {
    setCampo(e.target.name, e.target.value);
    enfocar(siguienteId);
  };
  const cerrarModal = () => setModal(null);

  // Resaltado + botón de revertir de un campo editable
  const revertible = (campo) => ({ edited: isFieldEdited(campo), onRevert: () => revertField(campo) });

  // Campo obligatorio: se marca solo tras intentar guardar y se limpia cuando se completa
  const requerido = (campo) => ({
    required: true,
    error: mostrarErrores && !String(datos[campo] ?? '').trim() ? 'Campo obligatorio' : '',
  });

  const limpiar = () => {
    setDatos(crearDatosIniciales());
    setDniEditado(false);
    setPrecioEditable(false);
    setMostrarErrores(false);
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
      (importado) => setDatos((d) => importadoAFormulario(d, importado)),
      noHacerNada
    );
  };

  const importarPreCarga = () => {
    if (!datos.codPa) return Swal.fire('Error', 'Coloque un DNI válido', 'error');
    getMasivoimport(datos.codPa, token, (resultados) => {
      if (resultados.length === 0) return Swal.fire('Sin Resultado', 'No hay pre-cargas para este DNI', 'info');
      if (resultados.length === 1) return aplicarPreCarga(resultados[0]);
      setOpcionesPreCarga(resultados);
      setModal('preCarga');
    });
  };

  const aplicarPreCarga = async (item) => {
    try {
      const paciente = await consultarPaciente(datos.codPa);
      if (!paciente) return Swal.fire('Error', 'No se ha encontrado al Paciente', 'error');
      setDatos((d) => preCargaAFormulario(d, item, paciente));
      Swal.close();
    } catch {
      Swal.fire('Error', 'Ha ocurrido un Error', 'error');
    } finally {
      cerrarModal();
    }
  };

  // — Examen médico: al elegirlo se trae su precio en la sede —
  const seleccionarExamen = (examen) => {
    setCampo('nomExamen', examen.mensaje);
    getFetch(`/api/v01/ct/ocupacional/PrecioExamenMutisucursal/${selectedSede}/${examen.mensaje}`, token)
      .then((res) => res?.mensaje !== undefined && setCampo('precioPo', res.mensaje))
      .catch(noHacerNada);
  };

  const alCambiarPrecio = (e) => PRECIO_VALIDO.test(e.target.value) && setCampo('precioPo', e.target.value);

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
        setDatos(historiaAFormulario(res));
        setCargaId((id) => id + 1);
        setDniEditado(false);
        setPrecioEditable(false);
        setMostrarErrores(false);
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
        html: `<div style='font-size:1.1em;'>N° <b style='color:#2563eb;'>${registro.n_orden}</b> - <span style='color:#0d9488;font-weight:bold;'>${registro.nombres}</span></div><div class='mt-2'>Espere por favor...</div>`,
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
    const faltantes = Object.entries(CAMPOS_REQUERIDOS)
      .filter(([campo]) => !datos[campo])
      .map(([, etiqueta]) => etiqueta);
    if (faltantes.length > 0) {
      setMostrarErrores(true);
      return Swal.fire('Error', `Faltan completar: ${faltantes.join(', ')}`, 'error');
    }
    if (!FECHA_APERTURA_VALIDA.test(datos.fechaAperturaPo)) {
      setMostrarErrores(true);
      return Swal.fire('Error', 'La fecha de apertura debe tener el formato DD/MM/AAAA', 'error');
    }

    mostrarCargando();
    try {
      const res = await SubmitHistoriaC({ ...datos, user_registro: userlogued }, selectedSede, token, tipoOperacion);
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
          nomExamen: datos.nomExamen,
          razonEmpresa: datos.razonEmpresa,
          n_psicosen: datos.n_psicosen,
          n_testaltura: datos.n_testaltura,
          nombres: `${datos.apellidos} ${datos.nombres}`.trim(),
          protocolo: datos.protocolo,
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

  const hayRegistroCargado = Boolean(datos.tieneRegistro || datos.codPa || datos.nombres);
  const puedeAgregarNueva = datos.tieneRegistro && edicionHabilitada && dniEditado;
  const auditoria = buildAuditoria(datos, { usuarioActual: userlogued, fechaHoraActual: getFechaHoraActual() });
  const puedeSubidaMasiva = tienePermisoEnVista?.('Admision', 'Subida Masiva Examenes Ocupacionales');

  return (
    <div className="space-y-3 px-4 pb-6">
      <AccionesRegistroHeader
        tieneRegistro={datos.tieneRegistro}
        hayRegistroCargado={hayRegistroCargado}
        edicionHabilitada={edicionHabilitada}
        onHabilitarEdicion={habilitarEdicion}
        onLimpiar={limpiar}
        newLabel="Nueva historia"
        editLabel={`Editando historia N° ${datos.n_orden}`}
      >
        {puedeSubidaMasiva && (
          <button type="button" onClick={() => setModal('masiva')} className="pointer-events-auto verde-btn px-4 py-2 rounded flex items-center gap-2">
            <FontAwesomeIcon icon={faUpload} /> Subida Masiva
          </button>
        )}
      </AccionesRegistroHeader>

      <div className="grid grid-cols-1 items-start gap-x-3 gap-y-3 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        {/* ───────── Formulario ───────── */}
        <div className="min-w-0 space-y-3">
          <SectionFieldset
            legend="Datos del Paciente"
            className="space-y-3"
            actions={<span className="font-bold">Historia clínica N° {datos.n_orden || '—'}</span>}
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
              <InputTextOneLine
                label="DNI"
                name="codPa"
                value={datos.codPa}
                onChange={alCambiarDni}
                onKeyUp={buscarPaciente}
                disabled={buscandoPaciente || camposDeshabilitados}
                labelWidth={LABEL}
                className="min-w-0 sm:flex-1"
                inputClassName={datos.idPreNorden ? 'border-orange-400 bg-orange-100' : ''}
                inputMode="numeric"
                maxLength={8}
                placeholder="DNI y Enter para buscar"
                autocomplete="off"
                {...requerido('codPa')}
                edited={isFieldEdited('codPa')}
                onRevert={() => {
                  revertField('codPa');
                  setDniEditado(false);
                }}
              />
              <div className="flex gap-2">
                <button type="button" onClick={importarUltimaHistoria} disabled={camposDeshabilitados} className={`${BOTON} bg-blue-800 hover:bg-blue-700`}>
                  <FontAwesomeIcon icon={faFileImport} />
                  Importar
                </button>
                <button type="button" onClick={importarPreCarga} disabled={camposDeshabilitados} className={`${BOTON} bg-orange-600 hover:bg-orange-500`}>
                  <FontAwesomeIcon icon={faFileImport} />
                  Pre-carga
                </button>
              </div>
            </div>
            {datos.idPreNorden && (
              <p className="mb-0 font-semibold text-orange-700">
                Datos de la pre-carga N° {datos.idPreNorden}
                {datos.preCargaUsuario && ` · registrada por ${datos.preCargaUsuario}`}
              </p>
            )}
            <InputTextOneLine
              label="Nombres"
              name="nombres"
              value={datos.nombres}
              onChange={alEscribir}
              disabled={camposDeshabilitados}
              labelWidth={LABEL}
              autocomplete="off"
              {...requerido('nombres')}
              {...revertible('nombres')}
            />
            <InputTextOneLine
              label="Apellidos"
              name="apellidos"
              value={datos.apellidos}
              onChange={alEscribir}
              disabled={camposDeshabilitados}
              labelWidth={LABEL}
              autocomplete="off"
              {...requerido('apellidos')}
              {...revertible('apellidos')}
            />
          </SectionFieldset>

          <SectionFieldset legend="Empresa y Atención" className="space-y-3">
            <InputAutocomplete
              label="Empresa"
              name="razonEmpresa"
              value={datos.razonEmpresa}
              onChange={(v) => setCampo('razonEmpresa', v)}
              onSelect={(o) => setDatos((d) => ({ ...d, razonEmpresa: o.mensaje, rucEmpresa: o.rucEmpresa }))}
              options={EmpresasMulti}
              placeholder="Escribe para buscar empresa..."
              nextFocusId="razonContrata"
              disabled={camposDeshabilitados}
              labelWidth={LABEL}
              {...requerido('razonEmpresa')}
              edited={isFieldEdited('razonEmpresa')}
              onRevert={() => revertFields(['razonEmpresa', 'rucEmpresa'])}
            >
              <button type="button" onClick={() => setModal('empresa')} disabled={camposDeshabilitados} className={`${BOTON} bg-blue-800 hover:bg-blue-600`}>
                <FontAwesomeIcon icon={faPlus} />
                Agregar
              </button>
            </InputAutocomplete>
            <InputAutocomplete
              label="Contrata"
              name="razonContrata"
              value={datos.razonContrata}
              onChange={(v) => setCampo('razonContrata', v)}
              onSelect={(o) => setCampo('razonContrata', o.mensaje)}
              options={ContrataMulti}
              placeholder="Escribe para buscar contrata..."
              nextFocusId="n_medico"
              disabled={camposDeshabilitados}
              labelWidth={LABEL}
              {...requerido('razonContrata')}
              {...revertible('razonContrata')}
            >
              <button type="button" onClick={() => setModal('contrata')} disabled={camposDeshabilitados} className={`${BOTON} bg-green-600 hover:bg-green-500`}>
                <FontAwesomeIcon icon={faPlus} />
                Agregar
              </button>
            </InputAutocomplete>
            <InputAutocomplete
              label="Médico ocup."
              name="n_medico"
              value={datos.n_medico}
              onChange={(v) => setCampo('n_medico', v)}
              onSelect={(o) => setCampo('n_medico', o.mensaje)}
              options={MedicosMulti}
              placeholder="Escribe para buscar médico..."
              nextFocusId="protocolo"
              disabled={camposDeshabilitados}
              labelWidth={LABEL}
              {...requerido('n_medico')}
              {...revertible('n_medico')}
            />
            <InputTextOneLine
              label="Protocolo"
              name="protocolo"
              value={datos.protocolo}
              onChange={alEscribir}
              disabled={camposDeshabilitados}
              labelWidth={LABEL}
              placeholder="Escribe el protocolo..."
              autocomplete="off"
              {...revertible('protocolo')}
            />
          </SectionFieldset>

          <SectionFieldset legend="Área Pre-Ocupacional y Examen" className="space-y-3">
            <InputAutocomplete
              label="Cargo"
              name="cargoDe"
              value={datos.cargoDe}
              onChange={(v) => setCampo('cargoDe', v)}
              onSelect={(o) => setCampo('cargoDe', o.mensaje)}
              options={CargosMulti}
              placeholder="Escribe para buscar cargo..."
              nextFocusId="areaO"
              disabled={camposDeshabilitados}
              labelWidth={LABEL}
              {...requerido('cargoDe')}
              {...revertible('cargoDe')}
            />
            <InputAutocomplete
              label="Área"
              name="areaO"
              value={datos.areaO}
              onChange={(v) => setCampo('areaO', v)}
              onSelect={(o) => setCampo('areaO', o.mensaje)}
              options={AreaMulti}
              placeholder="Escribe para buscar área..."
              nextFocusId="nomExamen"
              disabled={camposDeshabilitados}
              labelWidth={LABEL}
              {...revertible('areaO')}
            />
            <InputAutocomplete
              label="Examen médico"
              name="nomExamen"
              value={datos.nomExamen}
              onSelect={seleccionarExamen}
              options={ExamenMulti}
              placeholder="Escribe para buscar examen..."
              soloSeleccion
              estricto
              onSinCoincidencia={() => setCampo('nomExamen', '')}
              nextFocusId="nomEx"
              disabled={camposDeshabilitados}
              labelWidth={LABEL}
              edited={isFieldEdited('nomExamen')}
              onRevert={() => revertFields(['nomExamen', 'precioPo'])}
            />

            <div className="flex items-start gap-4">
              <span className="pt-1 font-semibold" style={{ minWidth: LABEL, maxWidth: LABEL }}>
                Examen adicional :
              </span>
              <div className="grid w-full grid-cols-2 gap-x-3 gap-y-2 sm:grid-cols-3">
                {EXAMENES_ADICIONALES.map(({ name, label, title, destacado }) => (
                  <div key={name} title={title}>
                    <InputCheckbox
                      name={name}
                      label={label}
                      checked={datos[name]}
                      onChange={(e) => setCampo(name, e.target.checked)}
                      disabled={camposDeshabilitados}
                      className={destacado ? 'font-bold' : ''}
                    />
                  </div>
                ))}
              </div>
            </div>

            <SelectField
              inline
              label="Explotación en"
              name="nomEx"
              value={datos.nomEx ?? ''}
              onChange={alElegirYEnfocar('mineralPo')}
              options={aOpciones(ExplotacionMulti)}
              placeholder="Seleccione una opción..."
              disabled={camposDeshabilitados}
              labelWidth={LABEL}
              {...revertible('nomEx')}
            />
            <SelectField
              inline
              label="Mineral exp."
              name="mineralPo"
              value={datos.mineralPo ?? ''}
              onChange={alElegirYEnfocar('alturaPo')}
              options={aOpciones(MineralMulti)}
              placeholder="Seleccione una opción..."
              disabled={camposDeshabilitados}
              labelWidth={LABEL}
              {...revertible('mineralPo')}
            />
            <SelectField
              inline
              label="Altura"
              name="alturaPo"
              value={datos.alturaPo ?? ''}
              onChange={alElegirYEnfocar('tipoPago')}
              options={aOpciones(AlturaMulti)}
              placeholder="Seleccione una opción..."
              disabled={camposDeshabilitados}
              labelWidth={LABEL}
              {...revertible('alturaPo')}
            />

            <div className="flex items-start gap-3">
              <InputTextOneLine
                label="Precio del examen"
                name="precioPo"
                value={datos.precioPo}
                onChange={alCambiarPrecio}
                disabled={camposDeshabilitados || !precioEditable}
                labelWidth={LABEL}
                className="min-w-0 flex-1"
                autocomplete="off"
                {...revertible('precioPo')}
              />
              <InputCheckbox
                label="Editar"
                checked={precioEditable}
                onChange={() => setPrecioEditable((v) => !v)}
                disabled={camposDeshabilitados}
                className="pt-1"
              />
            </div>
            <SelectField
              inline
              label="Forma de pago"
              name="tipoPago"
              value={datos.tipoPago ?? ''}
              onChange={(e) => setCampo('tipoPago', e.target.value)}
              options={aOpciones(FormaPago)}
              placeholder="Seleccionar"
              disabled={camposDeshabilitados}
              labelWidth={LABEL}
              {...requerido('tipoPago')}
              {...revertible('tipoPago')}
            />
          </SectionFieldset>

          <SectionFieldset legend="Autorización y Observaciones" className="space-y-3">
            <SelectField
              inline
              label="Autorizado por"
              name="autoriza"
              value={datos.autoriza ?? ''}
              onChange={(e) => setCampo('autoriza', e.target.value)}
              options={aOpciones(ListAuth)}
              placeholder="Seleccionar"
              disabled={camposDeshabilitados}
              labelWidth={LABEL}
              {...revertible('autoriza')}
            />
            <InputTextOneLine
              label="Fecha de apertura"
              name="fechaAperturaPo"
              value={datos.fechaAperturaPo}
              onChange={alCambiarFecha}
              disabled={camposDeshabilitados}
              labelWidth={LABEL}
              inputMode="numeric"
              maxLength={10}
              placeholder="DD/MM/AAAA"
              autocomplete="off"
              {...requerido('fechaAperturaPo')}
              {...revertible('fechaAperturaPo')}
            />
            <InputTextOneLine
              label="Observación 1"
              name="textObserv1"
              value={datos.textObserv1}
              onChange={alEscribir}
              disabled={camposDeshabilitados}
              labelWidth={LABEL}
              autocomplete="off"
              {...revertible('textObserv1')}
            />
            <InputTextOneLine
              label="Observación 2"
              name="textObserv2"
              value={datos.textObserv2}
              onChange={alEscribir}
              disabled={camposDeshabilitados}
              labelWidth={LABEL}
              autocomplete="off"
              {...revertible('textObserv2')}
            />
          </SectionFieldset>

          {/* ===== SECCIÓN: AUDITORÍA DEL REGISTRO ===== */}
          {hayRegistroCargado && (
            <AuditoriaRegistro
              mostrarEdicion={datos.tieneRegistro}
              fechaCreacion={auditoria.fechaCreacion}
              fechaEdicion={auditoria.fechaActualizacion}
              usuarioRegistro={auditoria.usuarioRegistro}
              usuarioEdicion={auditoria.usuarioActualizacion}
            />
          )}

          {/* ===== BOTONES DE ACCIÓN ===== */}
          <BotonesForm
            form={datos}
            hidePrint
            handleSave={() => guardar(datos.tieneRegistro ? 2 : 1)}
            saveLabel={datos.tieneRegistro ? 'Guardar Cambios' : 'Agregar'}
            handleEdit={habilitarEdicion}
            handleClear={limpiar}
            hideSave={datos.tieneRegistro && !edicionHabilitada}
            hideEdit={!datos.tieneRegistro || edicionHabilitada}
          >
            {puedeAgregarNueva && (
              <button type="button" onClick={() => guardar(1)} className={BOTON_FORM} title="Registra una historia nueva con el DNI y los datos actuales">
                <FontAwesomeIcon icon={faPlus} /> Agregar como nueva
              </button>
            )}
          </BotonesForm>
        </div>

        {/* ───────── Listado ───────── */}
        <SectionFieldset
          legend="Últimos agregados y hojas de ruta"
          className="space-y-3"
          actions={<span className="font-bold">{listado.registros.length} registros</span>}
        >
          <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-[3fr_2fr]">
            <InputTextOneLine
              label="Nombre"
              name="busquedaNombre"
              value={listado.busqueda.nombre}
              onChange={(e) => listado.cambiarNombre(e.target.value.toUpperCase())}
              placeholder="Nombres o apellidos"
              labelWidth="70px"
              autocomplete="off"
            />
            <InputTextOneLine
              label="Código"
              name="busquedaCodigo"
              value={listado.busqueda.codigo}
              onChange={(e) => /^\d{0,7}$/.test(e.target.value) && listado.cambiarCodigo(e.target.value)}
              onKeyUp={buscarPorCodigo}
              placeholder="N° orden y Enter"
              inputMode="numeric"
              labelWidth="70px"
              autocomplete="off"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded border border-blue-200 bg-blue-50 p-3">
            <div className="flex items-center gap-2">
              <label htmlFor="fechaResumen" className="mb-0 font-semibold">Fecha :</label>
              <DatePicker
                id="fechaResumen"
                selected={fechaResumen}
                onChange={(fecha) => fecha && setFechaResumen(fecha)}
                dateFormat="dd/MM/yyyy"
                className="w-28 rounded border bg-white px-2 py-1"
              />
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-blue-900">
              <span className="font-medium">Pacientes completados: <b className="text-green-600">{resumen.completos}</b></span>
              <span className="font-medium">Pacientes faltantes: <b className="text-red-600">{resumen.faltantes}</b></span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-gray-700">
              <b className="font-semibold">Click izquierdo</b> carga la historia · <b className="font-semibold">Click derecho</b> imprime la hoja de ruta
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" onClick={() => setModal('reportePacientes')} className="verde-btn rounded px-3 py-1">Reporte de Pacientes</button>
              <button type="button" onClick={() => setModal('reportePacientes2')} className="verde-btn rounded px-3 py-1">Reporte de Pacientes 2</button>
              <button type="button" onClick={() => setModal('contabilidad')} className="verde-btn rounded px-3 py-1">Reporte Contabilidad</button>
            </div>
          </div>

          <TablaHistorias
            registros={listado.registros}
            cargando={listado.cargando}
            seleccionado={datos.tieneRegistro ? datos.n_orden : null}
            onEditar={cargarHistoria}
            onImprimir={imprimirHistoria}
          />
        </SectionFieldset>
      </div>

      {modal === 'empresa' && (
        <ModalEmpresa
          isOpen
          onClose={cerrarModal}
          onSave={noHacerNada}
          Swal={Swal}
          Get={getFetch}
          token={token}
          GetRazonS={(e) => setDatos((d) => ({ ...d, razonEmpresa: e.razonEmpresa, rucEmpresa: e.rucEmpresa }))}
        />
      )}
      {modal === 'contrata' && (
        <ModalContrata
          isOpen
          onClose={cerrarModal}
          onSave={noHacerNada}
          Swal={Swal}
          Get={getFetch}
          token={token}
          GetRazonS={(nombre) => setCampo('razonContrata', nombre)}
        />
      )}
      {modal === 'masiva' && (
        <SubidaMasiva
          onClose={cerrarModal}
          GetRazonS={(nombre) => setCampo('razonContrata', nombre)}
          MedicosMulti={MedicosMulti}
          FormaPago={FormaPago}
          ExamenMulti={ExamenMulti}
          sede={selectedSede}
          token={token}
          userlogued={userlogued}
        />
      )}
      {modal === 'preCarga' && <ModalPreCarga opcionesPreCarga={opcionesPreCarga} setModalPreCarga={cerrarModal} aplicarPreCarga={aplicarPreCarga} />}
      {modal === 'reportePacientes' && <ReportePacientes onClose={cerrarModal} sede={selectedSede} token={token} />}
      {modal === 'reportePacientes2' && <ReportePacientes2 onClose={cerrarModal} sede={selectedSede} token={token} />}
      {modal === 'contabilidad' && <ModalContabilidad onClose={cerrarModal} sede={selectedSede} token={token} />}
    </div>
  );
};

export default AperturaExamenesPreOcup;
