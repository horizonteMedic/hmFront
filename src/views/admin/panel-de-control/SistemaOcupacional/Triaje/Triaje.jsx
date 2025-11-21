import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBroom, faPencil, faSave } from '@fortawesome/free-solid-svg-icons';
import {
    InputTextArea,
    InputCheckbox,
    InputTextOneLine,
} from '../../../../components/reusableComponents/ResusableComponents';
import SectionFieldset from '../../../../components/reusableComponents/SectionFieldset';
import { useForm } from '../../../../hooks/useForm';
import { useSessionData } from '../../../../hooks/useSessionData';
import { getToday } from '../../../../utils/helpers';
import {
    Convert,
    GetCC,
    GetCintura,
    GetCuello,
    GetFC,
    GetFRespira,
    GetICC,
    GetIMC,
    GetPA,
    GetSat,
    GetSistolica,
} from './Conversiones';
import {
    Clean,
    GetListTriajeMult,
    GetListTriajeMulttable,
    GetTable,
    handleNombreChange,
    handleSubmit,
    SearchHC,
    VerifyTR,
} from './Controller';
import { getFetch } from '../../getFetch/getFetch';
import Swal from 'sweetalert2';

const today = getToday();

export default function Triaje() {
    const { token, selectedSede } = useSessionData();
    const debounceTimeout = useRef(null);

    // Estado inicial del formulario
    const initialFormState = {
        // Tipo de paciente
        ocupacional: true,
        asistencial: false,
        recibo: false,
        nOrden: true,

        // Información del paciente
        nro: '',
        nomExam: '',
        empresa: '',
        contrata: '',
        nroHistorial: '',
        nombres: '',
        apellidos: '',
        edad: '',
        fechaNac: '',
        fechaExamen: today,

        // Datos de triaje
        talla: '',
        peso: '',
        imc: '',
        cintura: '',
        icc: '',
        cadera: '',
        temperatura: '',
        fCardiaca: '',
        sat02: '',
        perimetroCuello: '',
        sistolica: '',
        diastolica: '',
        fRespiratoria: '',
        diagnostico: '',

        // Búsqueda
        tipoPaciente: false,
        tipoOcupacional: true,
        codigo: '',
        nombresBusqueda: '',
    };

    const {
        form,
        setForm,
        handleChange,
        handleChangeNumber,
    } = useForm(initialFormState, { storageKey: 'triaje' });

    // Estados adicionales para la tabla y UI
    const [refresh, setRefresh] = useState(0);
    const [, setHabilitar] = useState(true);
    const [habilitarTR, setHabilitarTR] = useState(false);
    const [habilitarEdicion, setHabilitarEdicion] = useState(false);
    const [tablehc, setTablehc] = useState([]);
    const [hoveredRow, setHoveredRow] = useState(null);
    const [resumenFecha, setResumenFecha] = useState(today);

    // Cargar tabla inicial
    useEffect(() => {
        if (form.codigo === '' && form.nombresBusqueda === '') {
            GetTable(form.codigo, form.nombresBusqueda, selectedSede, token, setTablehc);
        }
    }, [form.codigo, form.nombresBusqueda, refresh, selectedSede, token]);

    // Handlers específicos
    const handleTriajeChange = (e) => {
        const { name, value } = e.target;
        if (/^[\d.,]{0,15}$/.test(value)) {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleBusquedaChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleTR = () => {
        setForm((prev) => ({
            ...prev,
            talla: '',
            peso: '',
            imc: '',
            cintura: '',
            icc: '',
            cadera: '',
            temperatura: '',
            fCardiaca: '',
            sat02: '',
            perimetroCuello: '',
            sistolica: '',
            diastolica: '',
            fRespiratoria: '',
            diagnostico: '',
        }));
    };

    const refreshtable = () => {
        setRefresh((prev) => prev + 1);
    };

    // Calcular resumen de pacientes para la fecha seleccionada
    const pacientesDelDia = tablehc.filter(
        (row) => row.fecha_apertura_po && row.fecha_apertura_po.startsWith(resumenFecha)
    );
    const completados = pacientesDelDia.filter((row) =>
        (row.estado || '').toLowerCase().includes('complet')
    ).length;
    const faltantes = pacientesDelDia.filter((row) =>
        (row.estado || '').toLowerCase().includes('falta')
    ).length;

    // Modifica la función para cargar datos al hacer click izquierdo
    const handleRowClick = async (row) => {
        await new Promise((res) => setTimeout(res, 800));
        await GetListTriajeMulttable(
            row.n_orden,
            setForm,
            getFetch,
            token,
            setHabilitarTR,
            setHabilitar
        );
    };

    // Click derecho: imprimir
    const handleRowContextMenu = async (e, row) => {
        e.preventDefault();
        Swal.fire({
            title: '<span style="font-size:1.3em;font-weight:bold;">¿Desea Imprimir Hoja de Ruta?</span>',
            html: `<div style="font-size:1.1em;">N° <b style='color:#2563eb;'>${row.n_orden}</b> - <span style='color:#0d9488;font-weight:bold;'>${row.nombres.split(' ').slice(0, 2).join(' ')}</span></div>`,
            icon: 'question',
            background: '#f0f6ff',
            color: '#22223b',
            showCancelButton: true,
            confirmButtonText: 'Sí, Imprimir',
            cancelButtonText: 'Cancelar',
            customClass: {
                popup: 'swal2-border-radius',
                title: 'swal2-title-custom',
                htmlContainer: 'swal2-html-custom',
                confirmButton: 'swal2-confirm-custom',
                cancelButton: 'swal2-cancel-custom',
            },
            showClass: {
                popup: 'animate__animated animate__fadeInDown',
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp',
            },
        }).then((result) => {
            if (result.isConfirmed) {
                GetListTriajeMult(row.n_orden, setForm, getFetch, token, true);
            }
        });
    };

    // Handler para búsqueda por código
    const handleCodigoChange = (e) => {
        const value = e.target.value;
        if (/^\d{0,7}$/.test(value)) {
            setForm((prev) => ({
                ...prev,
                codigo: value,
                nombresBusqueda: '',
            }));
        }
    };

    return (
        <div className="flex flex-col md:flex-row w-full">
            {/* Columna 1 - Formulario */}
            <div className="bg-white rounded p-4 min-w-[400px] w-full md:w-[45%]">
                <form className="space-y-3 text-md">
                    {/* Sección: Tipo de paciente y búsqueda */}
                    <SectionFieldset legend="Información del Paciente" className="space-y-3">
                        <div className="flex gap-3 items-center">
                            <InputCheckbox
                                label="Ocupacional"
                                name="ocupacional"
                                checked={form.ocupacional}
                                onChange={(e) => {
                                    setForm((prev) => ({
                                        ...prev,
                                        ocupacional: e.target.checked,
                                        asistencial: !e.target.checked,
                                    }));
                                }}
                            />
                            <InputCheckbox
                                label="Asistencial"
                                name="asistencial"
                                checked={form.asistencial}
                                onChange={(e) => {
                                    setForm((prev) => ({
                                        ...prev,
                                        asistencial: e.target.checked,
                                        ocupacional: !e.target.checked,
                                    }));
                                }}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <InputTextOneLine
                                label="Norden"
                                name="nro"
                                value={form.nro}
                                onChange={handleChangeNumber}
                                onKeyUp={(event) => {
                                    if (event.key === 'Enter') {
                                        handleTR();
                                        VerifyTR(
                                            form,
                                            getFetch,
                                            token,
                                            setForm,
                                            selectedSede,
                                            setHabilitarTR,
                                            setHabilitar
                                        );
                                    }
                                }}
                                labelWidth="120px"
                            />
                            <div className="flex gap-4">
                                <label className="font-semibold flex justify-center gap-2 items-center">
                                    <input
                                        type="radio"
                                        name="recibo"
                                        checked={form.recibo}
                                        onChange={() =>
                                            setForm((f) => ({
                                                ...f,
                                                recibo: true,
                                                nOrden: false,
                                            }))
                                        }
                                    />
                                    Recibo
                                </label>
                                <label className="font-semibold flex justify-center gap-2 items-center">
                                    <input
                                        type="radio"
                                        name="nOrden"
                                        checked={form.nOrden}
                                        onChange={() =>
                                            setForm((f) => ({
                                                ...f,
                                                nOrden: true,
                                                recibo: false,
                                            }))
                                        }
                                    />
                                    N° Orden
                                </label>
                            </div>
                        </div>
                        <InputTextOneLine
                            label="Ex.Médico"
                            name="nomExam"
                            value={form.nomExam}
                            onChange={handleChange}
                            disabled
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="Empresa"
                            name="empresa"
                            value={form.empresa}
                            onChange={handleChange}
                            disabled
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="Contrata"
                            name="contrata"
                            value={form.contrata}
                            onChange={handleChange}
                            disabled
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="N° Historial"
                            name="nroHistorial"
                            value={form.nroHistorial}
                            onChange={handleChange}
                            disabled
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="Nombres"
                            name="nombres"
                            value={form.nombres}
                            onChange={handleChange}
                            disabled
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="Apellidos"
                            name="apellidos"
                            value={form.apellidos}
                            onChange={handleChange}
                            disabled
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="Edad"
                            name="edad"
                            value={form.edad}
                            onChange={handleChange}
                            disabled
                            labelWidth="120px"
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <InputTextOneLine
                                label="Fecha Nac"
                                type="date"
                                name="fechaNac"
                                value={form.fechaNac}
                                onChange={handleChange}
                                disabled
                                labelWidth="120px"
                            />
                            <InputTextOneLine
                                label="Fecha Triaje"
                                type="date"
                                name="fechaExamen"
                                value={form.fechaExamen}
                                onChange={handleChange}
                                disabled={!habilitarEdicion}
                                labelWidth="120px"
                            />
                        </div>
                    </SectionFieldset>

                    {/* Sección: Datos de Triaje */}
                    <SectionFieldset legend="Datos Triaje" className="space-y-2">
                        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                            <div className="space-y-3">
                                <InputTextOneLine
                                    label="Talla (m)"
                                    name="talla"
                                    value={form.talla}
                                    onChange={handleTriajeChange}
                                    onKeyUp={(e) => {
                                        Convert(e, form, setForm, Swal);
                                    }}
                                    disabled={habilitarTR}
                                    labelWidth="120px"
                                />
                                <InputTextOneLine
                                    label="Peso (kg)"
                                    name="peso"
                                    value={form.peso}
                                    onChange={handleTriajeChange}
                                    onKeyUp={(e) => {
                                        GetIMC(e, form, setForm, Swal);
                                    }}
                                    disabled={habilitarTR}
                                    labelWidth="120px"
                                />
                                <InputTextOneLine
                                    label="IMC"
                                    name="imc"
                                    value={form.imc}
                                    disabled
                                    labelWidth="120px"
                                />
                                <InputTextOneLine
                                    label="Cintura (cm)"
                                    name="cintura"
                                    value={form.cintura}
                                    onChange={handleTriajeChange}
                                    onKeyUp={(e) => {
                                        GetCintura(e, form, setForm, Swal);
                                    }}
                                    disabled={habilitarTR}
                                    labelWidth="120px"
                                />
                                <InputTextOneLine
                                    label="ICC"
                                    name="icc"
                                    value={form.icc}
                                    disabled
                                    labelWidth="120px"
                                />
                            </div>
                            <div className="space-y-3">
                                <InputTextOneLine
                                    label="Cadera (cm)"
                                    name="cadera"
                                    value={form.cadera}
                                    onChange={handleTriajeChange}
                                    onKeyUp={(e) => {
                                        GetICC(e, form, setForm, Swal);
                                    }}
                                    disabled={habilitarTR}
                                    labelWidth="120px"
                                />
                                <InputTextOneLine
                                    label="Temperatura (°C)"
                                    name="temperatura"
                                    value={form.temperatura}
                                    onChange={handleTriajeChange}
                                    onKeyUp={(e) => {
                                        GetCC(e, form, setForm, Swal);
                                    }}
                                    disabled={habilitarTR}
                                    labelWidth="120px"
                                />
                                <InputTextOneLine
                                    label="F. Cardiaca"
                                    name="fCardiaca"
                                    value={form.fCardiaca}
                                    onChange={handleTriajeChange}
                                    onKeyUp={(e) => {
                                        GetFC(e, form, setForm, Swal);
                                    }}
                                    disabled={habilitarTR}
                                    labelWidth="120px"
                                />
                                <InputTextOneLine
                                    label="SAT. 02"
                                    name="sat02"
                                    value={form.sat02}
                                    onChange={handleTriajeChange}
                                    onKeyUp={(e) => {
                                        GetSat(e, form, setForm, Swal);
                                    }}
                                    disabled={habilitarTR}
                                    labelWidth="120px"
                                />
                                <InputTextOneLine
                                    label="Perímetro Cuello (cm)"
                                    name="perimetroCuello"
                                    value={form.perimetroCuello}
                                    onChange={handleTriajeChange}
                                    onKeyUp={(e) => {
                                        GetCuello(e, form, setForm, Swal);
                                    }}
                                    disabled={habilitarTR}
                                    labelWidth="120px"
                                />
                            </div>
                        </div>

                        <h2 className="font-bold mb-3 mt-3">Presión Sistémica</h2>
                        <div className="grid grid-cols-3 gap-4 mb-3">
                            <InputTextOneLine
                                label="Sistólica (mm Hg)"
                                name="sistolica"
                                value={form.sistolica}
                                onChange={handleTriajeChange}
                                onKeyUp={(e) => {
                                    GetSistolica(e, form, setForm, Swal);
                                }}
                                disabled={habilitarTR}
                                labelWidth="120px"
                            />
                            <InputTextOneLine
                                label="Diastólica (mm Hg)"
                                name="diastolica"
                                value={form.diastolica}
                                onChange={handleTriajeChange}
                                onKeyUp={(e) => {
                                    GetPA(e, form, setForm, Swal);
                                }}
                                disabled={habilitarTR}
                                labelWidth="120px"
                            />
                            <InputTextOneLine
                                label="F. Respiratoria"
                                name="fRespiratoria"
                                value={form.fRespiratoria}
                                onChange={handleTriajeChange}
                                onKeyUp={(e) => {
                                    GetFRespira(e, form, setForm, Swal);
                                }}
                                disabled={habilitarTR}
                                labelWidth="120px"
                            />
                        </div>
                        <InputTextArea
                            label="Diagnóstico"
                            name="diagnostico"
                            value={form.diagnostico}
                            rows={7}
                            onChange={(e) => {
                                setForm((d) => ({
                                    ...d,
                                    diagnostico: e.target.value.toUpperCase(),
                                }));
                            }}
                        />
                        <section className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4">
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setHabilitarEdicion(true);
                                        setHabilitarTR(false);
                                    }}
                                    className="bg-blue-600 hover:bg-blue-700 text-white text-base px-6 py-2 rounded flex items-center gap-2"
                                >
                                    <FontAwesomeIcon icon={faPencil} /> Editar
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        handleSubmit(
                                            form,
                                            form.edad,
                                            form.nro,
                                            form.fechaExamen,
                                            Swal,
                                            token,
                                            setForm,
                                            refreshtable,
                                            getFetch,
                                            setHabilitar
                                        );
                                    }}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-base px-6 py-2 rounded flex items-center gap-2"
                                >
                                    <FontAwesomeIcon icon={faSave} /> Guardar/Actualizar
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        Clean(setForm);
                                        setHabilitarEdicion(false);
                                    }}
                                    className="bg-yellow-400 hover:bg-yellow-500 text-white text-base px-6 py-2 rounded flex items-center gap-2"
                                >
                                    <FontAwesomeIcon icon={faBroom} /> Limpiar/Cancelar
                                </button>
                            </div>
                        </section>
                    </SectionFieldset>
                </form>
            </div>

            {/* Columna 2 - Tabla de pacientes */}
            <div className="bg-white rounded p-4 min-w-[400px] w-full md:w-[55%]">
                {/* Filtro de búsqueda */}
                <SectionFieldset legend="Últimos Agregados & Hojas de Ruta" className="mb-2">
                    <div className="grid grid-cols-2 gap-4">
                        <InputTextOneLine
                            label="Código"
                            name="codigo"
                            value={form.codigo}
                            onKeyUp={(event) => {
                                SearchHC(event, form, setTablehc, selectedSede, token);
                            }}
                            onChange={handleCodigoChange}
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="Nombres"
                            name="nombresBusqueda"
                            value={form.nombresBusqueda}
                            onChange={(e) => {
                                handleNombreChange(
                                    e,
                                    setForm,
                                    setTablehc,
                                    selectedSede,
                                    token,
                                    debounceTimeout
                                );
                            }}
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="Fecha"
                            type="date"
                            value={resumenFecha}
                            onChange={(e) => setResumenFecha(e.target.value)}
                            labelWidth="120px"
                        />
                        <div className="flex gap-3 items-center">
                            <InputCheckbox
                                label="Pacientes"
                                name="tipoPaciente"
                                checked={form.tipoPaciente}
                                onChange={handleBusquedaChange}
                            />
                            <InputCheckbox
                                label="Ocupacional"
                                name="tipoOcupacional"
                                checked={form.tipoOcupacional}
                                onChange={handleBusquedaChange}
                            />
                        </div>
                    </div>
                </SectionFieldset>

                {/* Número de historia clínica destacado */}
                {form.nroHistorial && (
                    <div className="bg-blue-50 text-gray-500 text-2xl font-extrabold rounded px-4 py-2 mb-2 w-fit mx-auto border border-blue-100 shadow-sm flex items-center justify-center">
                        <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#222' }}>
                            {form.nroHistorial}
                        </span>
                    </div>
                )}

                <div className="">
                    {/* Texto informativo arriba de la tabla */}
                    <div className="bg-blue-50 flex justify-between p-4 mb-2">
                        <div className="bg-blue-50 text-gray-500">
                            (Click izquierdo para importar datos | Click derecho para imprimir)
                        </div>
                        <div className="flex gap-6 font-semibold">
                            <span className="text-gray-700">
                                Pacientes completados:{' '}
                                <span className="text-green-600">{completados}</span>
                            </span>
                            <span className="text-gray-700">
                                Pacientes faltantes:{' '}
                                <span className="text-red-600">{faltantes}</span>
                            </span>
                        </div>
                    </div>
                    <div
                        className="overflow-x-auto overflow-y-auto"
                        style={{ maxHeight: '535px' }}
                    >
                        <table className="w-full text-md border border-gray-300 rounded-lg overflow-hidden">
                            <thead>
                                <tr className="bg-gradient-to-r from-blue-100 to-blue-300 text-center">
                                    <th className="font-bold">N°</th>
                                    <th>Nombre</th>
                                    <th>Fecha</th>
                                    <th>Empresa</th>
                                    <th>Contrata</th>
                                    <th>T.Examen</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tablehc.length == 0 && (
                                    <tr>
                                        <td
                                            className="border border-gray-300 px-2 py-1 mb-1 text-center"
                                            colSpan={7}
                                        >
                                            Cargando...
                                        </td>
                                    </tr>
                                )}
                                {tablehc.map((row, i) => (
                                    <tr
                                        key={i}
                                        className={`text-center cursor-pointer transition-all duration-200
                      ${
                          row.color === 'AMARILLO'
                              ? 'bg-[#ffff00]'
                              : row.color === 'VERDE'
                              ? 'bg-[#00ff00]'
                              : row.color === 'ROJO'
                              ? 'bg-[#ff6767]'
                              : ''
                      }
                      ${
                          hoveredRow !== null && hoveredRow !== i
                              ? 'relative after:content-[""] after:absolute after:inset-0 after:bg-black after:opacity-25 after:pointer-events-none'
                              : ''
                      }`}
                                        style={{ zIndex: 1, position: 'relative' }}
                                        onClick={() => handleRowClick(row)}
                                        onContextMenu={(e) => handleRowContextMenu(e, row)}
                                        onMouseEnter={() => setHoveredRow(i)}
                                        onMouseLeave={() => setHoveredRow(null)}
                                    >
                                        <td className="font-bold border-b border-gray-200 py-1">
                                            {row.n_orden}
                                        </td>
                                        <td className="border-b border-gray-200 py-1">{row.nombres}</td>
                                        <td className="border-b border-gray-200 py-1">
                                            {row.fecha_apertura_po}
                                        </td>
                                        <td className="border-b border-gray-200 py-1">
                                            {row.razon_empresa}
                                        </td>
                                        <td className="border-b border-gray-200 py-1">
                                            {row.razon_contrata}
                                        </td>
                                        <td className="border-b border-gray-200 py-1">
                                            {row.nom_examen}
                                        </td>
                                        <td className="border-b border-gray-200 py-1">{row.estado}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
