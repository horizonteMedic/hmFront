import { useEffect } from 'react';
import { useSessionData } from '../../../../../../hooks/useSessionData';
import { useForm } from '../../../../../../hooks/useForm';
import { useRegistroEditable } from '../../../../../../hooks/useRegistroEditable';
import { getToday, getFechaHoraActual } from '../../../../../../utils/helpers';
import { buildAuditoria } from '../../../../../../utils/auditoriaUtils';
import { PrintHojaR, SubmitDataService, UpdateDataService, VerifyTR } from './controllerGlucosaBasal';
import {
    InputCheckbox,
    InputTextOneLine, SectionFieldset
} from '../../../../../../components/reusableComponents/ResusableComponents';
import SearchButton from '../../../../../../components/reusableComponents/SearchButton';
import AccionesRegistroHeader from '../../../../../../components/reusableComponents/AccionesRegistroHeader';
import AuditoriaRegistro from '../../../../../../components/reusableComponents/AuditoriaRegistro';
import EmpleadoComboBox from '../../../../../../components/reusableComponents/EmpleadoComboBox';
import DatosPersonalesLaborales from '../../../../../../components/templates/DatosPersonalesLaborales';
import BotonesForm from '../../../../../../components/templates/BotonesForm';

const tabla = 'analisis_bioquimicos_glucosa_basal';

// Campos que el usuario puede editar en este formulario (para resaltar/revertir cambios).
const CAMPOS_EDITABLES = [
    "fecha",
    "muestra",
    "examenDirecto",
    "glucosaBasal",
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

export default function GlucosaBasal() {
    const { token, userlogued, selectedSede, userName } = useSessionData();
    const today = getToday();

    const initialFormState = {
        norden: '',
        codAb: null,
        fecha: today,

        nombreExamen: "",

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

        muestra: 'SUERO',
        examenDirecto: false,

        glucosaBasal: "",
        colesterolTotal: '',
        ldl: '',
        hdl: '',
        vldl: '',
        trigliceridos: '',

        // Médico que Certifica //BUSCADOR
        nombre_medico: userName,
        user_medicoFirma: userlogued,

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
        handlePrintDefault,
    } = useForm(initialFormState, { storageKey: "glucosaBasal" });

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
        SubmitDataService(form, token, userlogued, handleClear, tabla);
    };

    const handleEdit = () => {
        UpdateDataService(form, token, userlogued, handleClear, tabla);
    };

    // ===== Búsqueda con botón =====
    const executeSearch = () => {
        handleClearnotO();
        VerifyTR(form.norden, tabla, token, setForm, selectedSede);
    };

    // ===== Búsqueda con enter =====
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

    const handlePrint = () => {
        handlePrintDefault(() => {
            PrintHojaR(form.norden, token, tabla);
        });
    };

    const auditoria = buildAuditoria(form, {
        usuarioActual: userlogued,
        fechaHoraActual: getFechaHoraActual(),
    });

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
        <div className="space-y-3 px-4 max-w-[90%] xl:max-w-[80%] mx-auto">
            <AccionesRegistroHeader
                tieneRegistro={form.tieneRegistro}
                hayRegistroCargado={hayRegistroCargado}
                edicionHabilitada={edicionHabilitada}
                onHabilitarEdicion={habilitarEdicion}
                onLimpiar={handleClear}
            />

            <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="flex gap-x-3 w-full">
                    <InputTextOneLine
                        label="N° Orden"
                        name="norden"
                        value={form.norden}
                        onChange={handleChangeNumber}
                        onKeyUp={handleSearch}
                        disabled={hayRegistroCargado}
                        labelWidth="120px"
                        className="w-full"
                    />
                    <SearchButton onClick={executeSearch} className="lg:hidden" />
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
                    labelWidth="120px"
                />
                <InputTextOneLine
                    label="Nombre del Examen"
                    name="nombreExamen"
                    value={form.nombreExamen}
                    disabled
                    labelWidth="120px"
                />
            </SectionFieldset>

            <DatosPersonalesLaborales form={form} />

            <SectionFieldset legend="Muestra" className="grid gap-3">
                <InputTextOneLine
                    label='Muestra'
                    name="muestra"
                    value={form.muestra}
                    labelWidth='120px'
                    onChange={handleChange}
                    disabled={camposDeshabilitados}
                    edited={isFieldEdited("muestra")}
                    onRevert={() => revertField("muestra")}
                />
                <InputCheckbox
                    label="Examen Completo"
                    checked={form.examenDirecto}
                    name="examenDirecto"
                    disabled={camposDeshabilitados}
                    onChange={(e) => {
                        const checked = e.target.checked;
                        setForm(prev => {
                            const newState = { ...prev, examenDirecto: checked };
                            if (!checked) {
                                newState.colesterolTotal = '';
                                newState.ldl = '';
                                newState.hdl = '';
                                newState.vldl = '';
                                newState.trigliceridos = '';
                            }
                            return newState;
                        });
                    }}
                />
            </SectionFieldset>

            <SectionFieldset legend="Resultados" className="grid grid-cols-1 gap-3">
                <div className="flex items-center gap-4">
                    <InputTextOneLine
                        label="Glucosa Basal"
                        name="glucosaBasal"
                        value={form.glucosaBasal}
                        labelWidth="120px"
                        onChange={(e) => handleChangeNumberDecimals(e, 1)}
                        onKeyUp={handleFocusNext}
                        className='w-[85%]'
                        disabled={camposDeshabilitados}
                        edited={isFieldEdited("glucosaBasal")}
                        onRevert={() => revertField("glucosaBasal")}
                    />
                    <span className="text-gray-500 text-[10px] font-medium">{"(Valor Normal 70 - 110 mg/dl)"}</span>
                </div>
                {form.examenDirecto && (
                    <>
                        <div className="flex items-center gap-4">
                            <InputTextOneLine
                                label="Colesterol Total"
                                name="colesterolTotal"
                                value={form.colesterolTotal}
                                labelWidth="120px"
                                onChange={(e) => handleChangeNumberDecimals(e, 1)}
                                onKeyUp={handleFocusNext}
                                disabled={!form.examenDirecto || camposDeshabilitados}
                                className='w-[85%]'
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
                                onChange={(e) => handleChangeNumberDecimals(e, 1)}
                                onKeyUp={handleFocusNext}
                                disabled={!form.examenDirecto || camposDeshabilitados}
                                className='w-[85%]'
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
                                onChange={(e) => handleChangeNumberDecimals(e, 1)}
                                onKeyUp={handleFocusNext}
                                disabled={!form.examenDirecto || camposDeshabilitados}
                                className='w-[85%]'
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
                                onChange={(e) => handleChangeNumberDecimals(e, 1)}
                                onKeyUp={handleFocusNext}
                                disabled={!form.examenDirecto || camposDeshabilitados}
                                className='w-[85%]'
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
                                onChange={(e) => handleChangeNumberDecimals(e, 1)}
                                disabled={!form.examenDirecto || camposDeshabilitados}
                                className='w-[85%]'
                                edited={isFieldEdited("vldl")}
                                onRevert={() => revertField("vldl")}
                            />
                            <span className="text-gray-500 text-[10px] font-medium">{"(Valor Normal < 30 mg/dl)"}</span>
                        </div>
                    </>
                )}
            </SectionFieldset>

            <SectionFieldset legend="Asignación de Médico">
                <EmpleadoComboBox
                    value={form.nombre_medico}
                    label="Especialista"
                    form={form}
                    onChange={handleChangeSimple}
                    disabled={camposDeshabilitados}
                    edited={isMedicoEdited}
                    onRevert={revertMedico}
                />
                <EmpleadoComboBox
                    value={form.nombre_doctorAsignado}
                    label="Doctor Asignado"
                    form={form}
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

            {/* ===== BOTONES DE ACCIÓN ===== */}
            <BotonesForm
                form={form}
                handleChangeNumberDecimals={handleChangeNumberDecimals}
                onNordenChange={handlePrintNordenChange}
                handleSave={form.tieneRegistro && edicionHabilitada ? handleEdit : handleSave}
                saveLabel={form.tieneRegistro && edicionHabilitada ? "Guardar Cambios" : "Guardar"}
                handleEdit={habilitarEdicion}
                handleClear={handleClear}
                handlePrint={handlePrint}
                hideSave={form.tieneRegistro && !edicionHabilitada}
                hideEdit={!form.tieneRegistro || edicionHabilitada}
            />
        </div>
    );
}
