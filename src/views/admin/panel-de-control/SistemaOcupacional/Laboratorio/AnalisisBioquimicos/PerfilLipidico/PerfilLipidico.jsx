import { GetInfoPacAnalisisBio, GetTableAnalBio, Loading, PrintHojaR, SubmitDataService, VerifyTR } from './controllerPerfilLipidico';
import { useSessionData } from '../../../../../../hooks/useSessionData';
import { useForm } from '../../../../../../hooks/useForm';
import { getToday } from '../../../../../../utils/helpers';
import Swal from 'sweetalert2';
import {
  InputTextOneLine,
  SectionFieldset
} from '../../../../../../components/reusableComponents/ResusableComponents';
import { useEffect, useState } from 'react';
import EmpleadoComboBox from '../../../../../../components/reusableComponents/EmpleadoComboBox';
import BotonesAccion from '../../../../../../components/templates/BotonesAccion';

const tabla = 'analisis_bioquimicos';

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
  };
  const [dataTabla, setDataTabla] = useState([]);

  const {
    form,
    setForm,
    handleChange,
    handleChangeNumberDecimals,
    handleFocusNext,
    handleChangeSimple,
    handleClearnotO,
    handleClear,
  } = useForm(initialFormState);

  const handleSave = () => {
    SubmitDataService(form, token, userlogued, handleClear, tabla, obtenerInfoTabla);
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      handleClearnotO();
      VerifyTR(form.norden, tabla, token, setForm, selectedSede);
    }
  };

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
      ...updates
    }));
  }, [form.colesterolTotal, form.trigliceridos]);

  return (
    <div className="p-4 grid xl:grid-cols-2 gap-x-4 gap-y-3">
      <div className="space-y-3">
        <SectionFieldset legend="Información del Examen" className="grid lg:grid-cols-2 gap-3 col-span-2">
          <InputTextOneLine
            label="N° Orden"
            name="norden"
            value={form.norden}
            onChange={handleChangeNumberDecimals}
            onKeyUp={handleSearch}
          />
          <InputTextOneLine
            label="Fecha"
            name="fecha"
            type="date"
            value={form.fecha}
            onChange={handleChangeSimple}
          />
          <InputTextOneLine
            label="Nombre Examen"
            name="nombreExamen"
            value={form.nombreExamen}
            className='col-span-2'
            onChange={handleChangeNumberDecimals}
          />

        </SectionFieldset>
        <SectionFieldset legend="Datos Personales" collapsible className="grid lg:grid-cols-2 gap-3 lg:gap-4">
          <InputTextOneLine
            label="Nombres"
            name="nombres"
            value={form.nombres}
            disabled
            labelWidth="120px"
            className='lg:col-span-2'
          />
          <InputTextOneLine
            label="DNI"
            name="dni"
            value={form.dni}
            labelWidth="120px"
            disabled
          />
          <InputTextOneLine
            label="Edad (Años)"
            name="edad"
            value={form.edad}
            disabled
            labelWidth="120px"
          />
          <InputTextOneLine
            label="Sexo"
            name="sexo"
            value={form.sexo}
            disabled
            labelWidth="120px"
          />
          <InputTextOneLine
            label="Fecha Nacimiento"
            name="fechaNacimiento"
            value={form.fechaNacimiento}
            disabled
            labelWidth="120px"
          />
          <InputTextOneLine
            label="Lugar Nacimiento"
            name="lugarNacimiento"
            value={form.lugarNacimiento}
            className='lg:col-span-2'
            disabled
            labelWidth="120px"
          />
          <InputTextOneLine
            label="Estado Civil"
            name="estadoCivil"
            value={form.estadoCivil}
            disabled
            labelWidth="120px"
          />
          <InputTextOneLine
            label="Nivel Estudios"
            name="nivelEstudios"
            value={form.nivelEstudios}
            disabled
            labelWidth="120px"
          />
        </SectionFieldset>
        <SectionFieldset legend="Datos Laborales" collapsible className="grid gap-3">
          <InputTextOneLine
            label="Empresa"
            name="empresa"
            value={form.empresa}
            disabled
            labelWidth="120px"
          />
          <InputTextOneLine
            label="Contrata"
            name="contrata"
            value={form.contrata}
            disabled
            labelWidth="120px"
          />
          <InputTextOneLine
            label="Ocupación"
            name="ocupacion"
            value={form.ocupacion}
            disabled
            labelWidth="120px"
          />
          <InputTextOneLine
            label="Cargo Desempeñar"
            name="cargoDesempenar"
            value={form.cargoDesempenar}
            disabled
            labelWidth="120px"
          />
        </SectionFieldset>

        <SectionFieldset legend="Parámetros Bioquímicos" className="grid grid-cols-1 gap-3">
          <div className="flex items-center gap-4">
            <InputTextOneLine
              label="Colesterol Total"
              name="colesterolTotal"
              value={form.colesterolTotal}
              labelWidth="120px"
              onChange={handleChange}
              onKeyUp={handleFocusNext}
              className='w-[75%]'
            />
            <span className="text-gray-500 text-[10px] font-medium">{"(Valor Normal < 200 mg/dl)"}</span>
          </div>
          <div className="flex items-center gap-4">
            <InputTextOneLine
              label="Triglicéridos"
              name="trigliceridos"
              value={form.trigliceridos}
              labelWidth="120px"
              onChange={handleChange}
              onKeyUp={handleFocusNext}
              className='w-[75%]'
            />
            <span className="text-gray-500 text-[10px] font-medium">{"(Valor Normal < 150 mg/dl)"}</span>
          </div>
          <div className="flex items-center gap-4">
            <InputTextOneLine
              label="H.D.L. Colesterol"
              name="hdl"
              value={form.hdl}
              labelWidth="120px"
              onChange={handleChange}
              onKeyUp={handleFocusNext}
              className='w-[75%]'
            />
            <span className="text-gray-500 text-[10px] font-medium">(Valor Normal 40 - 60 mg/dl)</span>
          </div>
          <div className="flex items-center gap-4">
            <InputTextOneLine
              label="L.D.L. Colesterol"
              name="ldl"
              value={form.ldl}
              labelWidth="120px"
              onChange={handleChange}
              onKeyUp={handleFocusNext}
              className='w-[75%]'
            />
            <span className="text-gray-500 text-[10px] font-medium">{"(Valor Normal < 129 mg/dl)"}</span>
          </div>
          <div className="flex items-center gap-4">
            <InputTextOneLine
              label="V.L.D.L. Colesterol"
              name="vldl"
              value={form.vldl}
              labelWidth="120px"
              onChange={handleChangeNumberDecimals}
              className='w-[75%]'
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
          />
        </SectionFieldset>

        <BotonesAccion
          form={form}
          handleSave={handleSave}
          handleClear={handleClear}
          handlePrint={() => { }}
          handleChangeNumberDecimals={handleChangeNumberDecimals}
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
