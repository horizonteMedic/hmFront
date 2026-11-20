import { useMemo, useState } from 'react';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faX, faSignature, faFingerprint, faCamera, faUpload } from '@fortawesome/free-solid-svg-icons';

import InputTextOneLine from '../../../../components/reusableComponents/InputTextOneLine';
import InputAutocomplete from '../../../../components/reusableComponents/InputAutocomplete';
import SectionFieldset from '../../../../components/reusableComponents/SectionFieldset';
import SearchButton from '../../../../components/reusableComponents/SearchButton';
import AccionesRegistroHeader from '../../../../components/reusableComponents/AccionesRegistroHeader';
import AuditoriaRegistro from '../../../../components/reusableComponents/AuditoriaRegistro';
import BotonesForm from '../../../../components/templates/BotonesForm';
import { useForm } from '../../../../hooks/useForm';
import { useSessionData } from '../../../../hooks/useSessionData';
import { useRegistroEditable } from '../../../../hooks/useRegistroEditable';
import { getFechaHoraActual } from '../../../../utils/helpers';
import { buildAuditoria } from '../../../../utils/auditoriaUtils';

import { SearchPacienteDNI, SubmitRegistrarPaciente } from './model/AdminPaciente';
import { VerifyHoF } from './model/Submit';
import NewPad from './pad/Newpad';
import NewHuellaFut from './huella/HuellaFut';
import FotoPaciente from './foto/FotoPaciente';
import SubidaMasiva from './RegistroPacientes/MasivoRegistroPacientes';
import {
  CAMPOS_EDITABLES,
  CAMPOS_REQUERIDOS,
  crearDatosIniciales,
  ESTADOS_CIVILES,
  esFechaNacimientoValida,
  mascaraFechaNacimiento,
  NIVELES_ESTUDIO,
  OPCIONES_SEXO,
  pacienteAFormulario,
  SEXO_ETIQUETA,
} from './RegistroPacientes/controllerRegistroClientes';

const DATOS_INICIALES = crearDatosIniciales();
const SIN_ARCHIVO = { id: 0, url: '' };
const etiquetaTexto = (opcion) => opcion;
const etiquetaNombre = (opcion) => opcion.nombre;
const etiquetaDescripcion = (opcion) => opcion.descripcion;

// Enter pasa al siguiente campo (flujo de teclado del puesto de admisión)
const alPresionarEnter = (siguienteId) => (e) => {
  if (e.key === 'Enter') document.getElementById(siguienteId)?.focus();
};

const RegistroClientes = ({ listas, selectedSede, token, tabHC, ChangeDNI }) => {
  const { Profesiones = [], Departamentos = [], Provincias = [], Distritos = [] } = listas;
  const { userlogued } = useSessionData();

  const { form, setForm, handleChange, handleClear } = useForm(DATOS_INICIALES, { storageKey: 'RegistroPacientes' });

  const { edicionHabilitada, habilitarEdicion, camposDeshabilitados, isFieldEdited, revertField } = useRegistroEditable(
    form,
    setForm,
    { tieneRegistro: form.tieneRegistro, camposEditables: CAMPOS_EDITABLES }
  );

  const [mostrarErrores, setMostrarErrores] = useState(false);
  const [modal, setModal] = useState(null); // 'huella' | 'pad' | 'foto' | 'masivo'
  const [FirmaP, setFirmaP] = useState(SIN_ARCHIVO);
  const [HuellaP, setHuellaP] = useState(SIN_ARCHIVO);
  const [FotoP, setFotoP] = useState(SIN_ARCHIVO);

  const cerrarModal = () => setModal(null);
  const setCampo = (name, value) => setForm((f) => ({ ...f, [name]: value }));
  const campoNumerico = (e) => setCampo(e.target.name, e.target.value.replace(/\D/g, ''));

  // Resaltado + botón de revertir de un campo editable
  const revertible = (campo) => ({ edited: isFieldEdited(campo), onRevert: () => revertField(campo) });

  // Campo obligatorio: se marca solo tras intentar guardar y se limpia cuando se completa
  const requerido = (campo) => ({
    required: true,
    error: mostrarErrores && !String(form[campo] ?? '').trim() ? 'Campo obligatorio' : '',
  });

  // Departamento -> Provincia -> Distrito (cada lista depende de la elección anterior)
  const departamento = useMemo(() => Departamentos.find((d) => d.nombre === form.departamentoPa), [Departamentos, form.departamentoPa]);
  const provincia = useMemo(
    () => Provincias.find((p) => p.idDepartamento === departamento?.id && p.nombre === form.provinciaPa),
    [Provincias, departamento, form.provinciaPa]
  );
  const provinciasDelDepartamento = useMemo(
    () => (departamento ? Provincias.filter((p) => p.idDepartamento === departamento.id) : []),
    [Provincias, departamento]
  );
  const distritosDeLaProvincia = useMemo(
    () => (provincia ? Distritos.filter((d) => d.idProvincia === provincia.id) : []),
    [Distritos, provincia]
  );

  // Al cambiar el departamento (escribiendo o eligiendo) la provincia y el distrito se limpian si ya no le
  // pertenecen; lo mismo con el distrito al cambiar la provincia
  const cambiarDepartamento = (nombre) =>
    setForm((f) => {
      const dep = Departamentos.find((d) => d.nombre === nombre);
      const provinciaVigente = dep && Provincias.some((p) => p.idDepartamento === dep.id && p.nombre === f.provinciaPa);
      return provinciaVigente ? { ...f, departamentoPa: nombre } : { ...f, departamentoPa: nombre, provinciaPa: '', distritoPa: '' };
    });
  const cambiarProvincia = (nombre) =>
    setForm((f) => {
      const prov = provinciasDelDepartamento.find((p) => p.nombre === nombre);
      const distritoVigente = prov && Distritos.some((d) => d.idProvincia === prov.id && d.nombre === f.distritoPa);
      return distritoVigente ? { ...f, provinciaPa: nombre } : { ...f, provinciaPa: nombre, distritoPa: '' };
    });

  const archivosVacios = () => {
    setFirmaP(SIN_ARCHIVO);
    setHuellaP(SIN_ARCHIVO);
    setFotoP(SIN_ARCHIVO);
  };

  // Limpia el formulario; `conservarDni` deja el DNI buscado para seguir llenando un paciente nuevo
  const limpiar = ({ conservarDni = false } = {}) => {
    const dni = form.codPa;
    setMostrarErrores(false);
    archivosVacios();
    if (conservarDni) setForm({ ...DATOS_INICIALES, codPa: dni });
    else handleClear();
    document.getElementById('codPa')?.focus();
  };

  // ===== Búsqueda de paciente por DNI =====
  const buscarPaciente = async () => {
    if (!form.codPa) return Swal.fire('Error', 'Coloque el DNI', 'error');

    Swal.fire({
      title: 'Buscando datos',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const res = await SearchPacienteDNI(selectedSede, form.codPa, token);
      Swal.close();

      // Paciente nuevo: se conserva el DNI y se sigue con los demás datos
      if (!res?.codPa) {
        await Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'info',
          title: '<span style="font-size:1rem">Paciente no encontrado</span>',
          width: 360,
          padding: '1.25rem',
          showConfirmButton: false,
          timer: 1200,
          customClass: { icon: 'swal2-icon-scale' },
        });
        limpiar({ conservarDni: true });
        setTimeout(() => document.getElementById('nombresPa')?.focus(), 0);
        return;
      }

      setMostrarErrores(false);
      setForm(pacienteAFormulario(res));

      // Huella, firma y foto ya tomadas
      const [H, F, FO] = await Promise.all(
        ['HUELLA', 'FIRMAP', 'FOTO_PACIENTE'].map((tipo) =>
          VerifyHoF(`/api/v01/st/registros/detalleUrlArchivosEmpleados/${res.codPa}/${tipo}`)
        )
      );
      setHuellaP(H.id === 1 ? { id: 1, url: H.mensaje } : SIN_ARCHIVO);
      setFirmaP(F.id === 1 ? { id: 1, url: F.mensaje } : SIN_ARCHIVO);
      setFotoP(FO.id === 1 ? { id: 1, url: FO.mensaje } : SIN_ARCHIVO);
    } catch {
      Swal.close();
      Swal.fire('Error', 'Ha ocurrido un error', 'error');
    }
  };

  // ===== Guardar / Guardar cambios =====
  const guardar = () => {
    const faltantes = Object.entries(CAMPOS_REQUERIDOS)
      .filter(([campo]) => !String(form[campo] ?? '').trim())
      .map(([, etiqueta]) => etiqueta);
    if (faltantes.length > 0) {
      setMostrarErrores(true);
      return Swal.fire('Error', `Faltan completar: ${faltantes.join(', ')}`, 'error');
    }
    if (!esFechaNacimientoValida(form.fechaNaciminetoPa)) {
      setMostrarErrores(true);
      return Swal.fire('Error', 'La fecha de nacimiento debe ser una fecha válida con el formato DD-MM-AAAA', 'error');
    }

    const dni = form.codPa;
    const esEdicion = form.tieneRegistro;

    Swal.fire({
      title: 'Validando Datos',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => Swal.showLoading(),
    });

    SubmitRegistrarPaciente(form, selectedSede, token)
      .then((r) => {
        Swal.close();
        if (!r.id) {
          Swal.fire('Error', esEdicion ? 'No se pudo actualizar' : 'No se pudo registrar', 'error');
          return;
        }
        Swal.fire(esEdicion ? 'Actualizado' : 'Registrado', esEdicion ? 'Paciente actualizado' : 'Paciente registrado', 'success');
        limpiar();
        tabHC();
        ChangeDNI(dni);
      })
      .catch(() => {
        Swal.close();
        Swal.fire('Error', 'Problema al registrar', 'error');
      });
  };

  // Firma, huella y foto necesitan el DNI del paciente
  const abrirCaptura = (tipo) => {
    if (!form.codPa) return Swal.fire('Error', 'Ingresa el DNI del cliente', 'error');
    setModal(tipo);
  };

  const hayRegistroCargado = Boolean(form.codPa || form.nombresPa);
  const auditoria = buildAuditoria(form, { usuarioActual: userlogued, fechaHoraActual: getFechaHoraActual() });

  const documentos = [
    { tipo: 'pad', estado: FirmaP, icono: faSignature, texto: 'Tomar Firma', color: 'bg-purple-600 hover:bg-purple-700', ayuda: 'Captura la firma digital del paciente' },
    { tipo: 'huella', estado: HuellaP, icono: faFingerprint, texto: 'Tomar Huella Futronic', color: 'bg-teal-600 hover:bg-teal-700', ayuda: 'Escanea la huella dactilar del paciente' },
    { tipo: 'foto', estado: FotoP, icono: faCamera, texto: 'Tomar Fotografía', color: 'bg-orange-500 hover:bg-orange-600', ayuda: 'Captura la foto del paciente con la cámara' },
  ];

  return (
    <div className="space-y-3 px-4 max-w-[90%] xl:max-w-[80%] mx-auto">
      <AccionesRegistroHeader
        tieneRegistro={form.tieneRegistro}
        hayRegistroCargado={hayRegistroCargado}
        edicionHabilitada={edicionHabilitada}
        onHabilitarEdicion={habilitarEdicion}
        onLimpiar={() => limpiar()}
      >
        <button type="button" onClick={() => setModal('masivo')} className="pointer-events-auto verde-btn px-4 py-2 rounded flex items-center gap-2">
          <FontAwesomeIcon icon={faUpload} /> Subida Masiva
        </button>
      </AccionesRegistroHeader>

      {/* ===== SECCIÓN: DATOS PERSONALES ===== */}
      <SectionFieldset legend="Datos Personales" className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-3">
        <div className="flex gap-x-3 w-full lg:col-span-2">
          <InputTextOneLine
            label="DNI/LM"
            name="codPa"
            value={form.codPa}
            onChange={campoNumerico}
            onKeyUp={(e) => e.key === 'Enter' && buscarPaciente()}
            disabled={form.tieneRegistro}
            labelWidth="120px"
            className="w-full lg:w-1/2 lg:pr-2"
            inputMode="numeric"
            {...requerido('codPa')}
          />
          <SearchButton onClick={buscarPaciente} disabled={form.tieneRegistro} />
        </div>

        <InputTextOneLine
          label="Nombres"
          name="nombresPa"
          value={form.nombresPa}
          onChange={handleChange}
          onKeyUp={alPresionarEnter('apellidosPa')}
          disabled={camposDeshabilitados}
          labelWidth="120px"
          {...requerido('nombresPa')}
          {...revertible('nombresPa')}
        />
        <InputTextOneLine
          label="Apellidos"
          name="apellidosPa"
          value={form.apellidosPa}
          onChange={handleChange}
          onKeyUp={alPresionarEnter('fechaNaciminetoPa')}
          disabled={camposDeshabilitados}
          labelWidth="120px"
          {...revertible('apellidosPa')}
        />

        <InputTextOneLine
          label="Fecha Nac."
          name="fechaNaciminetoPa"
          value={form.fechaNaciminetoPa}
          onChange={(e) => setCampo('fechaNaciminetoPa', mascaraFechaNacimiento(e.target.value))}
          onKeyUp={alPresionarEnter('sexoPa')}
          disabled={camposDeshabilitados}
          labelWidth="120px"
          placeholder="DD-MM-AAAA"
          maxLength={10}
          inputMode="numeric"
          {...requerido('fechaNaciminetoPa')}
          {...revertible('fechaNaciminetoPa')}
        />
        <InputAutocomplete
          label="Sexo"
          name="sexoPa"
          value={SEXO_ETIQUETA[form.sexoPa] ?? ''}
          onSelect={(sexo) => setCampo('sexoPa', sexo.charAt(0))}
          options={OPCIONES_SEXO}
          getLabel={etiquetaTexto}
          soloSeleccion
          nextFocusId="emailPa"
          disabled={camposDeshabilitados}
          labelWidth="120px"
          {...requerido('sexoPa')}
          {...revertible('sexoPa')}
        />

        <InputTextOneLine
          label="Email"
          name="emailPa"
          value={form.emailPa}
          onChange={handleChange}
          onKeyUp={alPresionarEnter('lugarNacPa')}
          disabled={camposDeshabilitados}
          labelWidth="120px"
          {...revertible('emailPa')}
        />
        <InputTextOneLine
          label="Lugar Nac."
          name="lugarNacPa"
          value={form.lugarNacPa}
          onChange={handleChange}
          onKeyUp={alPresionarEnter('nivelEstPa')}
          disabled={camposDeshabilitados}
          labelWidth="120px"
          {...requerido('lugarNacPa')}
          {...revertible('lugarNacPa')}
        />

        <InputAutocomplete
          label="Nivel Estudio"
          name="nivelEstPa"
          value={form.nivelEstPa}
          onChange={(v) => setCampo('nivelEstPa', v)}
          onSelect={(nivel) => setCampo('nivelEstPa', nivel)}
          options={NIVELES_ESTUDIO}
          getLabel={etiquetaTexto}
          nextFocusId="ocupacionPa"
          disabled={camposDeshabilitados}
          labelWidth="120px"
          {...requerido('nivelEstPa')}
          {...revertible('nivelEstPa')}
        />
        <InputAutocomplete
          label="Prof/Ocup"
          name="ocupacionPa"
          value={form.ocupacionPa}
          onChange={(v) => setCampo('ocupacionPa', v)}
          onSelect={(profesion) => setCampo('ocupacionPa', profesion.descripcion)}
          options={Profesiones}
          getLabel={etiquetaDescripcion}
          nextFocusId="estadoCivilPa"
          disabled={camposDeshabilitados}
          labelWidth="120px"
          {...requerido('ocupacionPa')}
          {...revertible('ocupacionPa')}
        />

        <InputAutocomplete
          label="Estado Civil"
          name="estadoCivilPa"
          value={form.estadoCivilPa}
          onSelect={(estado) => setCampo('estadoCivilPa', estado)}
          options={ESTADOS_CIVILES}
          getLabel={etiquetaTexto}
          soloSeleccion
          nextFocusId="direccionPa"
          disabled={camposDeshabilitados}
          labelWidth="120px"
          {...requerido('estadoCivilPa')}
          {...revertible('estadoCivilPa')}
        />
      </SectionFieldset>

      {/* ===== SECCIÓN: DOMICILIO Y CONTACTO ===== */}
      <SectionFieldset legend="Domicilio y Contacto" className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-3">
        <InputTextOneLine
          label="Dirección"
          name="direccionPa"
          value={form.direccionPa}
          onChange={handleChange}
          onKeyUp={alPresionarEnter('departamentoPa')}
          disabled={camposDeshabilitados}
          labelWidth="120px"
          className="lg:col-span-2"
          {...requerido('direccionPa')}
          {...revertible('direccionPa')}
        />

        <InputAutocomplete
          label="Departamento"
          name="departamentoPa"
          value={form.departamentoPa}
          onChange={cambiarDepartamento}
          onSelect={(dep) => cambiarDepartamento(dep.nombre)}
          options={Departamentos}
          getLabel={etiquetaNombre}
          mostrarTodo
          nextFocusId="provinciaPa"
          disabled={camposDeshabilitados}
          labelWidth="120px"
          {...requerido('departamentoPa')}
          {...revertible('departamentoPa')}
        />
        <InputAutocomplete
          label="Provincia"
          name="provinciaPa"
          value={form.provinciaPa}
          onChange={cambiarProvincia}
          onSelect={(prov) => cambiarProvincia(prov.nombre)}
          options={provinciasDelDepartamento}
          getLabel={etiquetaNombre}
          mostrarTodo
          nextFocusId="distritoPa"
          disabled={camposDeshabilitados}
          labelWidth="120px"
          {...requerido('provinciaPa')}
          {...revertible('provinciaPa')}
        />

        <InputAutocomplete
          label="Distrito"
          name="distritoPa"
          value={form.distritoPa}
          onChange={(v) => setCampo('distritoPa', v)}
          onSelect={(dist) => setCampo('distritoPa', dist.nombre)}
          options={distritosDeLaProvincia}
          getLabel={etiquetaNombre}
          mostrarTodo
          nextFocusId="caserioPA"
          disabled={camposDeshabilitados}
          labelWidth="120px"
          {...requerido('distritoPa')}
          {...revertible('distritoPa')}
        />
        <InputTextOneLine
          label="Caserío"
          name="caserioPA"
          value={form.caserioPA}
          onChange={handleChange}
          onKeyUp={alPresionarEnter('telCasaPa')}
          disabled={camposDeshabilitados}
          labelWidth="120px"
          {...revertible('caserioPA')}
        />

        <InputTextOneLine
          label="Teléfono"
          name="telCasaPa"
          value={form.telCasaPa}
          onChange={campoNumerico}
          onKeyUp={alPresionarEnter('celPa')}
          disabled={camposDeshabilitados}
          labelWidth="120px"
          inputMode="numeric"
          {...revertible('telCasaPa')}
        />
        <InputTextOneLine
          label="Celular"
          name="celPa"
          value={form.celPa}
          onChange={campoNumerico}
          disabled={camposDeshabilitados}
          labelWidth="120px"
          inputMode="numeric"
          {...requerido('celPa')}
          {...revertible('celPa')}
        />
      </SectionFieldset>

      {/* ===== SECCIÓN: FIRMA, HUELLA Y FOTO ===== */}
      <SectionFieldset legend="Biométricos" className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {documentos.map(({ tipo, estado, icono, texto, color, ayuda }) => (
          <div key={tipo} className="flex flex-col items-center gap-2">
            <FontAwesomeIcon
              icon={estado.id === 1 ? faCheck : faX}
              size="xl"
              color={estado.id === 1 ? 'green' : 'red'}
              title={estado.id === 1 ? 'Ya registrada' : 'Pendiente'}
            />
            <button
              type="button"
              onClick={() => abrirCaptura(tipo)}
              title={ayuda}
              className={`w-full max-w-[16rem] px-4 py-2 text-base font-semibold rounded text-white flex items-center gap-2 justify-center transition-all duration-150 ease-out hover:shadow-lg active:scale-95 ${color}`}
            >
              <FontAwesomeIcon icon={icono} /> {texto}
            </button>
          </div>
        ))}
      </SectionFieldset>

      {/* ===== SECCIÓN: AUDITORÍA DEL REGISTRO ===== */}
      {hayRegistroCargado && (
        <AuditoriaRegistro
          mostrarEdicion={form.tieneRegistro}
          fechaCreacion={auditoria.fechaCreacion}
          fechaEdicion={auditoria.fechaActualizacion}
          usuarioRegistro={auditoria.usuarioRegistro}
          usuarioEdicion={auditoria.usuarioActualizacion}
        />
      )}

      {/* ===== BOTONES DE ACCIÓN ===== */}
      <BotonesForm
        form={form}
        hidePrint
        handleSave={guardar}
        saveLabel={form.tieneRegistro && edicionHabilitada ? 'Guardar Cambios' : 'Registrar'}
        handleEdit={habilitarEdicion}
        handleClear={() => limpiar()}
        hideSave={form.tieneRegistro && !edicionHabilitada}
        hideEdit={!form.tieneRegistro || edicionHabilitada}
      />

      {modal === 'huella' && (
        <NewHuellaFut close={cerrarModal} DNI={form.codPa} Huella={HuellaP} setHuella={() => setHuellaP({ id: 1 })} />
      )}
      {modal === 'foto' && (
        <FotoPaciente close={cerrarModal} DNI={form.codPa} Foto={FotoP} setFoto={(url) => setFotoP({ id: 1, url })} />
      )}
      {modal === 'pad' && (
        <NewPad close={cerrarModal} DNI={form.codPa} Firma={FirmaP} setFirma={() => setFirmaP({ id: 1 })} />
      )}
      {modal === 'masivo' && <SubidaMasiva onClose={cerrarModal} sede={selectedSede} token={token} />}
    </div>
  );
};

export default RegistroClientes;
