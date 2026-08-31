import { GetInfoPacAnalisisBio, GetTableAnalBio, Loading, PrintHojaR, SubmitDataService, UpdateDataService, VerifyTR } from './controllerPerfilLipidico';
import { useSessionData } from '../../../../../../hooks/useSessionData';
import { useForm } from '../../../../../../hooks/useForm';
import { useRegistroEditable } from '../../../../../../hooks/useRegistroEditable';
import { getToday, getFechaHoraActual } from '../../../../../../utils/helpers';
import { buildAuditoria } from '../../../../../../utils/auditoriaUtils';
import Swal from 'sweetalert2';
import {
  InputTextOneLine,
  SectionFieldset
} from '../../../../../../components/reusableComponents/ResusableComponents';
import SearchButton from '../../../../../../components/reusableComponents/SearchButton';
import AccionesRegistroHeader from '../../../../../../components/reusableComponents/AccionesRegistroHeader';
import AuditoriaRegistro from '../../../../../../components/reusableComponents/AuditoriaRegistro';
import { useEffect, useState } from 'react';
import EmpleadoComboBox from '../../../../../../components/reusableComponents/EmpleadoComboBox';
import DatosPersonalesLaborales from '../../../../../../components/templates/DatosPersonalesLaborales';
import BotonesForm from '../../../../../../components/templates/BotonesForm';

const tabla = 'analisis_bioquimicos';

// Campos que el usuario puede editar en este formulario (para resaltar/revertir cambios).
const CAMPOS_EDITABLES = [
  "fecha",
  "colesterolTotal",
  "trigliceridos",
  "hdl",
  "ldl",
  "vldl",
  "user_medicoFirma",
  "nombre_medico",
  "user_doctorAsignado",
  "nombre_doctorAsignado",
];

export default function PerfilLipidico() {
  const { token, userlogued, selectedSede, userName } = useSessionData();
  const today = getToday();

  const initialFormState = {
    norden: '',
    fecha: today,
    nombreExamen: '',

    codAb: null,

    dni: "",
    nombres: "",
    apellidos: "",
    fechaNacimiento: "",
    lugarNacimiento: "",
    edad: "",
    sexo: "",
    estadoCivil: "",
    nivelEstudios: "",

    // Datos Laborales
    empresa: "",
    contrata: "",
    ocupacion: "",
    cargoDesempenar: "",

    colesterolTotal: '',
    ldl: '',
    hdl: '',
    vldl: '',
    trigliceridos: '',

    nombres_search: "",
    codigo_search: "",
    // Médico que Certifica //BUSCADOR
    nombre_medico: userName,
    user_medicoFirma: userlogued,

    // Doctor Asignado //BUSCADOR
    nombre_doctorAsignado: "",
    user_doctorAsignado: "",

    // Control de UI: false = mostrar Guardar (nuevo) / true = mostrar Editar (ya existe)
    tieneRegistro: false,

    // Auditoría
    userRegistro: "",
    fechaRegistro: "",
    usuarioActualizacion: "",
    fechaActualizacion: "",
  };
  const [dataTabla, setDataTabla] = useState([]);

  const {
    form,
    setForm,
    handleChange,
    handleChangeNumber,
    handleChangeNumberDecimals,
    handleFocusNext,
    handleChangeSimple,
    handleClearnotO,
    handleClear,
  } = useForm(initialFormState, { storageKey: "perfilLipidico" });

  const {
    edicionHabilitada,
    habilitarEdicion,
    camposDeshabilitados,
    isFieldEdited,
    revertField,
    revertFields,
  } = useRegistroEditable(form, setForm, { tieneRegistro: form.tieneRegistro, camposEditables: CAMPOS_EDITABLES });

  // El médico y el doctor asignado se componen de 2 campos (id de firma + nombre): se detecta
  // el cambio por el id y se revierten ambos en conjunto.
  const isMedicoEdited = isFieldEdited("user_medicoFirma");
  const revertMedico = () => revertFields(["user_medicoFirma", "nombre_medico"]);
  const isDoctorEdited = isFieldEdited("user_doctorAsignado");
  const revertDoctor = () => revertFields(["user_doctorAsignado", "nombre_doctorAsignado"]);

  const handleSave = () => {
    SubmitDataService(form, token, userlogued, handleClear, tabla, obtenerInfoTabla);
  };

  const handleEdit = () => {
    UpdateDataService(form, token, userlogued, handleClear, tabla, obtenerInfoTabla);
  };

  const executeSearch = () => {
    handleClearnotO();
    VerifyTR(form.norden, tabla, token, setForm, selectedSede);
  };

  const handleSearch = (e) => {
    if (!e || e.key === 'Enter') {
      executeSearch();
    }
  };

  const hayRegistroCargado = Boolean(form.nombres);

  const handlePrintNordenChange = (e) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return; // solo dígitos

    const hayDatosCargados = Boolean(form.nombres || form.tieneRegistro);
    if (hayDatosCargados && value !== form.norden) {
      setForm({ ...initialFormState, norden: value });
    } else {
      setForm((f) => ({ ...f, norden: value }));
    }
  };

  const auditoria = buildAuditoria(form, {
    usuarioActual: userlogued,
    fechaHoraActual: getFechaHoraActual(),
  });

  const obtenerInfoTabla = () => {
    const data = {
      opcion_id_p: form.codigo_search === "" && form.nombres_search === ""
        ? 1
        : form.nombres_search !== "" && form.codigo_search === ""
          ? 3
          : form.codigo_search !== "" && form.nombres_search === ""
            ? 2
            : 1,
      norden: form.codigo_search,
      nombres_apellidos_p: form.nombres_search
    };
    GetTableAnalBio(data, selectedSede, token)
      .then((res) => {
        setDataTabla(res || []);
      })
      .catch(() => setDataTabla([]));
  };

  useEffect(() => {
    if (selectedSede) obtenerInfoTabla();
  }, [selectedSede]);

  useEffect(() => {
    if (!form.Editando) {
      const ct = form.colesterolTotal;
      const tg = form.trigliceridos;
      const nCT = parseFloat(String(ct).replace(',', '.'));
      const nTG = parseFloat(String(tg).replace(',', '.'));
      const updates = {};
      if (ct !== '' && Number.isFinite(nCT)) {
        const h = nCT * 0.25;
        updates.hdl = h.toFixed(1);
      } else {
        updates.hdl = '';
      }
      if (tg !== '' && Number.isFinite(nTG)) {
        const v = nTG / 5;
        updates.vldl = v.toFixed(1);
      } else {
        updates.vldl = '';
      }
      if (ct !== '' && tg !== '' && Number.isFinite(nCT) && Number.isFinite(nTG)) {
        const h = nCT * 0.25;
        const v = nTG / 5;
        updates.ldl = (nCT - h - v).toFixed(1);
      } else {
        updates.ldl = '';
      }
      setForm((prev) => ({
        ...prev,
        Editando: false,
        ...updates
      }));
    }
    else {
      setForm((prev) => ({
        ...prev,
        Editando: false,
      }));
    }
  }, [form.colesterolTotal, form.trigliceridos]);

  return (
    <div className="p-4 space-y-3">
      <AccionesRegistroHeader
        tieneRegistro={form.tieneRegistro}
        hayRegistroCargado={hayRegistroCargado}
        edicionHabilitada={edicionHabilitada}
        onHabilitarEdicion={habilitarEdicion}
        onLimpiar={handleClear}
      />
      <div className="grid xl:grid-cols-2 gap-x-4 gap-y-3">
        <div className="space-y-3">
          <SectionFieldset legend="Información del Examen" className="grid lg:grid-cols-2 gap-3 col-span-2">
            <div className="flex gap-x-3 w-full">
              <InputTextOneLine
                label="N° Orden"
                name="norden"
                value={form.norden}
                onChange={handleChangeNumber}
                onKeyUp={handleSearch}
                disabled={hayRegistroCargado}
                className="w-full"
              />
              <SearchButton onClick={executeSearch} />
            </div>
            <InputTextOneLine
              label="Fecha"
              name="fecha"
              type="date"
              value={form.fecha}
              onChange={handleChangeSimple}
              disabled={camposDeshabilitados}
              edited={isFieldEdited("fecha")}
              onRevert={() => revertField("fecha")}
            />
            <InputTextOneLine
              label="Nombre Examen"
              name="nombreExamen"
              value={form.nombreExamen}
              disabled
            />
          </SectionFieldset>

          <DatosPersonalesLaborales form={form} />

          <SectionFieldset legend="Parámetros Bioquímicos" className="grid grid-cols-1 gap-3">
            <div className="flex items-center gap-4">
              <InputTextOneLine
                label="Colesterol Total"
                name="colesterolTotal"
                value={form.colesterolTotal}
                labelWidth="120px"
                onChange={(e) => { handleChangeNumberDecimals(e, 1); }}
                onKeyUp={handleFocusNext}
                className='w-[75%]'
                disabled={camposDeshabilitados}
                edited={isFieldEdited("colesterolTotal")}
                onRevert={() => revertField("colesterolTotal")}
              />
              <span className="text-gray-500 text-[10px] font-medium">{"(Valor Normal < 200 mg/dl)"}</span>
            </div>
            <div className="flex items-center gap-4">
              <InputTextOneLine
                label="Triglicéridos"
                name="trigliceridos"
                value={form.trigliceridos}
                labelWidth="120px"
                onChange={(e) => { handleChangeNumberDecimals(e, 1); }}
                onKeyUp={handleFocusNext}
                className='w-[75%]'
                disabled={camposDeshabilitados}
                edited={isFieldEdited("trigliceridos")}
                onRevert={() => revertField("trigliceridos")}
              />
              <span className="text-gray-500 text-[10px] font-medium">{"(Valor Normal < 150 mg/dl)"}</span>
            </div>
            <div className="flex items-center gap-4">
              <InputTextOneLine
                label="H.D.L. Colesterol"
                name="hdl"
                value={form.hdl}
                labelWidth="120px"
                onChange={(e) => { handleChangeNumberDecimals(e, 1); }}
                onKeyUp={handleFocusNext}
                className='w-[75%]'
                disabled={camposDeshabilitados}
                edited={isFieldEdited("hdl")}
                onRevert={() => revertField("hdl")}
              />
              <span className="text-gray-500 text-[10px] font-medium">(Valor Normal 40 - 60 mg/dl)</span>
            </div>
            <div className="flex items-center gap-4">
              <InputTextOneLine
                label="L.D.L. Colesterol"
                name="ldl"
                value={form.ldl}
                labelWidth="120px"
                onChange={(e) => { handleChangeNumberDecimals(e, 1); }}
                onKeyUp={handleFocusNext}
                className='w-[75%]'
                disabled={camposDeshabilitados}
                edited={isFieldEdited("ldl")}
                onRevert={() => revertField("ldl")}
              />
              <span className="text-gray-500 text-[10px] font-medium">{"(Valor Normal < 129 mg/dl)"}</span>
            </div>
            <div className="flex items-center gap-4">
              <InputTextOneLine
                label="V.L.D.L. Colesterol"
                name="vldl"
                value={form.vldl}
                labelWidth="120px"
                onChange={(e) => { handleChangeNumberDecimals(e, 1); }}
                className='w-[75%]'
                disabled={camposDeshabilitados}
                edited={isFieldEdited("vldl")}
                onRevert={() => revertField("vldl")}
              />
              <span className="text-gray-500 text-[10px] font-medium">{"(Valor Normal < 30 mg/dl)"}</span>
            </div>
          </SectionFieldset>
          <SectionFieldset legend="Especialista">
            <EmpleadoComboBox
              value={form.nombre_medico}
              form={form}
              label='Especialista que Certifica'
              onChange={handleChangeSimple}
              disabled={camposDeshabilitados}
              edited={isMedicoEdited}
              onRevert={revertMedico}
            />
            <EmpleadoComboBox
              value={form.nombre_doctorAsignado}
              form={form}
              label="Doctor Asignado"
              onChange={handleChangeSimple}
              nameField="nombre_doctorAsignado"
              idField="user_doctorAsignado"
              disabled={camposDeshabilitados}
              edited={isDoctorEdited}
              onRevert={revertDoctor}
            />
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

          <BotonesForm
            form={form}
            handleSave={form.tieneRegistro && edicionHabilitada ? handleEdit : handleSave}
            saveLabel={form.tieneRegistro && edicionHabilitada ? "Guardar Cambios" : "Guardar"}
            handleEdit={habilitarEdicion}
            handleClear={handleClear}
            onNordenChange={handlePrintNordenChange}
            handleChangeNumberDecimals={handleChangeNumberDecimals}
            hideSave={form.tieneRegistro && !edicionHabilitada}
            hideEdit={!form.tieneRegistro || edicionHabilitada}
            hidePrint
          />
        </div>
        <SectionFieldset legend="Búsqueda de Examenes" className="grid xl:grid-cols-2 gap-3">
          <InputTextOneLine
            label="Nombres"
            name="nombres_search"
            value={form.nombres_search}
            onKeyUp={(e) => { if (e.key === "Enter") obtenerInfoTabla(); }}
            onChange={(e) => { handleChange(e); setForm(prev => ({ ...prev, codigo_search: "" })) }}
          />
          <InputTextOneLine
            label="Código"
            name="codigo_search"
            value={form.codigo_search}
            onKeyUp={(e) => { if (e.key === "Enter") obtenerInfoTabla(); }}
            onChange={(e) => { handleChangeNumberDecimals(e, 0); setForm(prev => ({ ...prev, nombres_search: "" })) }}
          />
          <Table data={dataTabla} tabla={tabla} set={setForm} token={token} clean={handleClear} />
        </SectionFieldset>

      </div>
    </div>
  );
}

function Table({ data, tabla, set, token, clean }) {
  const handlePrintConfirm = (nro) => {
    Swal.fire({
      title: 'Confirmar impresión',
      text: `¿Deseas imprimir la ficha Nº ${nro}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, imprimir',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        PrintHojaR(nro, token, tabla);
      }
    });
  };

  function clicktable(nro) {
    clean();
    Loading('Importando Datos');
    GetInfoPacAnalisisBio(nro, tabla, set, token);
  }

  return (
    <div className="overflow-y-auto col-span-2" style={{ maxHeight: 'calc(18 * 4rem)' }}>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1 text-left text-lg">N° Orden</th>
            <th className="border px-2 py-1 text-left text-lg">Nombres</th>
            <th className="border px-2 py-1 text-left text-lg">Fecha Apertura</th>
            <th className="border px-2 py-1 text-left text-lg">Examen</th>
            <th className="border px-2 py-1 text-left text-lg">Estado</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, i) => (
              <tr
                key={i}
                className={`hover:bg-gray-50 cursor-pointer text-lg ${row.color === 'AMARILLO' ? 'bg-[#ffff00]' : row.color === 'VERDE' ? 'bg-[#00ff00]' : 'bg-[#ff6767]'}`}
                onClick={() => clicktable(row.n_orden)}
                onContextMenu={(e) => { e.preventDefault(); handlePrintConfirm(row.n_orden); }}
              >
                <td className="border px-2 py-1 font-bold">{row.n_orden}</td>
                <td className="border px-2 py-1">{row.nombres}</td>
                <td className="border px-2 py-1">{row.fecha_apertura_po}</td>
                <td className="border px-2 py-1">{row.nom_examen}</td>
                <td className="border px-2 py-1">{row.estado}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center py-4 text-gray-500 text-lg">
                No hay datos
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
