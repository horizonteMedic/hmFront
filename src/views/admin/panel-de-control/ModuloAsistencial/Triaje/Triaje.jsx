import { useState, useRef, useEffect } from 'react';
import {
    InputTextArea,
    InputCheckbox,
    InputTextOneLine,
} from '../../../../components/reusableComponents/ResusableComponents';
import SectionFieldset from '../../../../components/reusableComponents/SectionFieldset';
import AuditoriaRegistro from '../../../../components/reusableComponents/AuditoriaRegistro';
import AccionesRegistroHeader from '../../../../components/reusableComponents/AccionesRegistroHeader';
import BotonesForm from '../../../../components/templates/BotonesForm';
import { useForm } from '../../../../hooks/useForm';
import { useRegistroEditable } from '../../../../hooks/useRegistroEditable';
import { useSessionData } from '../../../../hooks/useSessionData';
import { getToday, getFechaHoraActual } from '../../../../utils/helpers';
import { buildAuditoria } from '../../../../utils/auditoriaUtils';
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
    BuscarPorNroTicket,
    BuscarPorTicket,
    CargarDesdeFila,
    ObtenerTablaTickets,
    RegistrarTriaje,
} from './controllerTriajeAsistencial';
import { PlantillaDiagnosticoManager } from '../../../../components/reusableComponents/PlantillaDiagnostico';
import Swal from 'sweetalert2';
import DatosPersonalesLaboralesAsistencial from '../../../../components/templates/DatosPersonalesLaboralesAsistencial';
import BotonesAccion from '../../../../components/templates/BotonesAccion';

const today = getToday();

// Campos que el usuario puede editar en este formulario (para resaltar/revertir cambios).
const CAMPOS_EDITABLES = [
    'fechaExamen',
    'talla',
    'peso',
    'cintura',
    'cadera',
    'temperatura',
    'fCardiaca',
    'sat02',
    'perimetroCuello',
    'sistolica',
    'diastolica',
    'fRespiratoria',
    'diagnostico',
];

export default function TriajeAsistencial() {
    const { token, userlogued } = useSessionData();
    const debounceTimeout = useRef(null);

    const initialFormState = {
        ocupacional: true,
        asistencial: false,

        // Ticket / identificación del paciente
        ticketId: null,
        pacienteId: null,
        id: null,
        numeroTicket: '',
        nroHistorial: '',
        nomExam: '',
        empresa: '',
        contrata: '',
        nombres: '',
        apellidos: '',
        edad: '',
        sexo: '',
        numeroDocumento: '',
        fechaNacimiento: '',
        lugarNacimiento: '',
        estadoCivil: '',
        nivelEstudios: '',
        ocupacion: '',
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
        diagnosticoCompleto: '',

        // Búsqueda tabla derecha
        codigo: '',
        nombresBusqueda: '',

        // Control de edición + auditoría (useRegistroEditable / buildAuditoria)
        tieneRegistro: false,
        userRegistro: '',
        fechaRegistro: '',
        usuarioActualizacion: '',
        fechaActualizacion: '',
    };

    const {
        form,
        setForm,
        handleChange,
        handleChangeNumber,
        handleClear,
    } = useForm(initialFormState, { storageKey: 'triaje_asistencial' });

    const {
        edicionHabilitada,
        habilitarEdicion,
        camposDeshabilitados,
        isFieldEdited,
        revertField,
    } = useRegistroEditable(form, setForm, { tieneRegistro: form.tieneRegistro, camposEditables: CAMPOS_EDITABLES });

    const [refresh, setRefresh] = useState(0);
    const [tablehc, setTablehc] = useState([]);
    const [hoveredRow, setHoveredRow] = useState(null);
    const [resumenFecha, setResumenFecha] = useState(today);

    // Carga la tabla cuando los filtros de búsqueda están vacíos
    useEffect(() => {
        if (form.codigo === '' && form.nombresBusqueda === '') {
            ObtenerTablaTickets({ fecha: resumenFecha }, token, setTablehc);
        }
    }, [form.codigo, form.nombresBusqueda, refresh, resumenFecha, token]);

    const handleTriajeChange = (e) => {
        const { name, value } = e.target;
        if (/^[\d.,]{0,15}$/.test(value)) {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleVincularPlantilla = (plantilla) => {
        setForm((prev) => {
            let vinculadas = [];
            try {
                const parsed = prev.diagnosticoCompleto ? JSON.parse(prev.diagnosticoCompleto) : [];
                vinculadas = Array.isArray(parsed) ? parsed : [];
            } catch {
                vinculadas = [];
            }
            const yaVinculada = vinculadas.some((p) => p.id === plantilla.id);
            const nuevaLista = yaVinculada
                ? vinculadas
                : [
                    ...vinculadas,
                    {
                        id: plantilla.id,
                        codigo: plantilla.codigo,
                        titulo: plantilla.titulo,
                        diagnostico: plantilla.diagnostico,
                        cie10s: plantilla.cie10s || [],
                        recomendaciones: plantilla.recomendaciones || [],
                        restricciones: plantilla.restricciones || [],
                    },
                ];
            return { ...prev, diagnosticoCompleto: JSON.stringify(nuevaLista) };
        });
    };

    const handleBuscarNroTicket = (event) => {
        if (event.key === 'Enter') {
            BuscarPorNroTicket(form.numeroTicket, token, setForm);
        }
    };

    const handleGuardar = () => {
        RegistrarTriaje(form, token, userlogued, () => {
            handleClear();
            setRefresh((r) => r + 1);
        });
    };

    const handleClearForm = () => {
        handleClear();
    };

    // Click izquierdo en fila: cargar datos del ticket + triaje existente
    const handleRowClick = (row) => {
        CargarDesdeFila(row, token, setForm);
    };

    // Búsqueda por código (N° ticket) al presionar Enter
    // const handleBuscarNroTicket = (event) => {
    //     if (event.key === 'Enter' && form.numeroTicket) {
    //         ObtenerTablaTickets({ numero: form.numeroTicket }, token, setTablehc);
    //     }
    // };

    const handleNroTicketChange = (e) => {
        const value = e.target.value;
        if (/^\d{0,10}$/.test(value)) {
            setForm((prev) => ({ ...prev, numeroTicket: value }));
        }
    };

    const handleNombreChange = (e) => {
        const value = e.target.value.toUpperCase();
        setForm((prev) => ({ ...prev, nombresBusqueda: value, numeroTicket: '' }));
        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        debounceTimeout.current = setTimeout(() => {
            if (value.trim() !== '') {
                ObtenerTablaTickets({ nombres: value }, token, setTablehc);
            } else {
                setTablehc([]);
            }
        }, 400);
    };

    // Estadísticas de la fecha seleccionada
    const ticketsDelDia = tablehc.filter(
        (row) => (row.fecha ?? row.fechaCreacion ?? '').startsWith(resumenFecha)
    );
    const conTriaje = ticketsDelDia.filter((row) =>
        (row.estadoTriaje ?? row.estado ?? '').toLowerCase().includes('complet')
    ).length;
    const sinTriaje = ticketsDelDia.filter((row) =>
        !(row.estadoTriaje ?? row.estado ?? '').toLowerCase().includes('complet')
    ).length;

    const hayRegistroCargado = Boolean(form.nombres || form.numeroDocumento);

    const auditoria = buildAuditoria(form, {
        usuarioActual: userlogued,
        fechaHoraActual: getFechaHoraActual(),
    });

    return (
        <div className="space-y-3 px-4 max-w-[95%] xl:max-w-[90%] mx-auto">
            <AccionesRegistroHeader
                tieneRegistro={form.tieneRegistro}
                hayRegistroCargado={hayRegistroCargado}
                edicionHabilitada={edicionHabilitada}
                onHabilitarEdicion={habilitarEdicion}
                onLimpiar={handleClearForm}
            />

            <SectionFieldset legend="Datos de Registro" className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                <InputTextOneLine
                    label="N° Ticket"
                    name="numeroTicket"
                    value={form.numeroTicket}
                    onChange={handleChangeNumber}
                    onKeyUp={handleBuscarNroTicket}
                    labelWidth="120px"
                />
                <InputTextOneLine
                    label="N° Historia Clínica"
                    name="nroHistorial"
                    value={form.nroHistorial}
                    disabled
                    labelWidth="120px"
                />
                <InputTextOneLine
                    label="Fecha"
                    type="date"
                    name="fechaExamen"
                    value={form.fechaExamen}
                    onChange={handleChange}
                    disabled={!edicionHabilitada}
                    edited={isFieldEdited('fechaExamen')}
                    onRevert={() => revertField('fechaExamen')}
                    labelWidth="120px"
                />
            </SectionFieldset>
            <DatosPersonalesLaboralesAsistencial form={form} />

            <div className="space-y-3 text-md">

                <SectionFieldset legend="Datos Triaje" className="space-y-2">
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-3">
                            <div className="space-y-3">
                                <InputTextOneLine
                                    label="Talla (m)"
                                    name="talla"
                                    value={form.talla}
                                    onChange={handleTriajeChange}
                                    onKeyUp={(e) => Convert(e, form, setForm, Swal)}
                                    disabled={camposDeshabilitados}
                                    edited={isFieldEdited('talla')}
                                    onRevert={() => revertField('talla')}
                                    labelWidth="120px"
                                />
                                <InputTextOneLine
                                    label="Peso (kg)"
                                    name="peso"
                                    value={form.peso}
                                    onChange={handleTriajeChange}
                                    onKeyUp={(e) => GetIMC(e, form, setForm, Swal)}
                                    disabled={camposDeshabilitados}
                                    edited={isFieldEdited('peso')}
                                    onRevert={() => revertField('peso')}
                                    labelWidth="120px"
                                />
                                <InputTextOneLine
                                    label="IMC"
                                    name="imc"
                                    value={form.imc}
                                    disabled
                                    labelWidth="120px"
                                />
                            </div>
                            <div className="space-y-3">
                                <InputTextOneLine
                                    label="Cintura (cm)"
                                    name="cintura"
                                    value={form.cintura}
                                    onChange={handleTriajeChange}
                                    onKeyUp={(e) => GetCintura(e, form, setForm, Swal)}
                                    disabled={camposDeshabilitados}
                                    edited={isFieldEdited('cintura')}
                                    onRevert={() => revertField('cintura')}
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
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-3">
                            <div className="space-y-3">
                                <InputTextOneLine
                                    label="Cadera (cm)"
                                    name="cadera"
                                    value={form.cadera}
                                    onChange={handleTriajeChange}
                                    onKeyUp={(e) => GetICC(e, form, setForm, Swal)}
                                    disabled={camposDeshabilitados}
                                    edited={isFieldEdited('cadera')}
                                    onRevert={() => revertField('cadera')}
                                    labelWidth="120px"
                                />
                                <InputTextOneLine
                                    label="Temperatura (°C)"
                                    name="temperatura"
                                    value={form.temperatura}
                                    onChange={handleTriajeChange}
                                    onKeyUp={(e) => GetCC(e, form, setForm, Swal)}
                                    disabled={camposDeshabilitados}
                                    edited={isFieldEdited('temperatura')}
                                    onRevert={() => revertField('temperatura')}
                                    labelWidth="120px"
                                />
                                <InputTextOneLine
                                    label="F. Cardiaca"
                                    name="fCardiaca"
                                    value={form.fCardiaca}
                                    onChange={handleTriajeChange}
                                    onKeyUp={(e) => GetFC(e, form, setForm, Swal)}
                                    disabled={camposDeshabilitados}
                                    edited={isFieldEdited('fCardiaca')}
                                    onRevert={() => revertField('fCardiaca')}
                                    labelWidth="120px"
                                />
                            </div>
                            <div className="space-y-3">
                                <InputTextOneLine
                                    label="SAT. 02"
                                    name="sat02"
                                    value={form.sat02}
                                    onChange={handleTriajeChange}
                                    onKeyUp={(e) => GetSat(e, form, setForm, Swal)}
                                    disabled={camposDeshabilitados}
                                    edited={isFieldEdited('sat02')}
                                    onRevert={() => revertField('sat02')}
                                    labelWidth="120px"
                                />
                                <InputTextOneLine
                                    label="Perímetro Cuello (cm)"
                                    name="perimetroCuello"
                                    value={form.perimetroCuello}
                                    onChange={handleTriajeChange}
                                    onKeyUp={(e) => GetCuello(e, form, setForm, Swal)}
                                    disabled={camposDeshabilitados}
                                    edited={isFieldEdited('perimetroCuello')}
                                    onRevert={() => revertField('perimetroCuello')}
                                    labelWidth="120px"
                                />
                            </div>
                        </div>
                    </div>

                    <h2 className="font-bold mb-3 mt-3">Presión Sistémica</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-3">
                        <InputTextOneLine
                            label="Sistólica (mm Hg)"
                            name="sistolica"
                            value={form.sistolica}
                            onChange={handleTriajeChange}
                            onKeyUp={(e) => GetSistolica(e, form, setForm, Swal)}
                            disabled={camposDeshabilitados}
                            edited={isFieldEdited('sistolica')}
                            onRevert={() => revertField('sistolica')}
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="Diastólica (mm Hg)"
                            name="diastolica"
                            value={form.diastolica}
                            onChange={handleTriajeChange}
                            onKeyUp={(e) => GetPA(e, form, setForm, Swal)}
                            disabled={camposDeshabilitados}
                            edited={isFieldEdited('diastolica')}
                            onRevert={() => revertField('diastolica')}
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="F. Respiratoria"
                            name="fRespiratoria"
                            value={form.fRespiratoria}
                            onChange={handleTriajeChange}
                            onKeyUp={(e) => GetFRespira(e, form, setForm, Swal)}
                            disabled={camposDeshabilitados}
                            edited={isFieldEdited('fRespiratoria')}
                            onRevert={() => revertField('fRespiratoria')}
                            labelWidth="120px"
                        />
                    </div>
                    <InputTextArea
                        name="diagnostico"
                        label="Diagnóstico"
                        value={form.diagnostico}
                        rows={7}
                        disabled={camposDeshabilitados}
                        edited={isFieldEdited('diagnostico')}
                        onRevert={() => revertField('diagnostico')}
                        onChange={(e) => {
                            setForm((d) => ({
                                ...d,
                                diagnostico: e.target.value.toUpperCase(),
                            }));
                        }}
                    />
                </SectionFieldset>
            </div>

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
                handleSave={handleGuardar}
                saveLabel={form.tieneRegistro && edicionHabilitada ? "Guardar Cambios" : "Guardar"}
                handleEdit={habilitarEdicion}
                handleClear={handleClearForm}
                hideSave={form.tieneRegistro && !edicionHabilitada}
                hideEdit={!form.tieneRegistro || edicionHabilitada}
                hidePrint
            />
        </div>
    );
}
