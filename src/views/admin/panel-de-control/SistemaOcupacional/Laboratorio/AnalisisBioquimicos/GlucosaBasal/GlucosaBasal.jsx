import { useSessionData } from '../../../../../../hooks/useSessionData';
import { useForm } from '../../../../../../hooks/useForm';
import { getToday } from '../../../../../../utils/helpers';
import { PrintHojaR, SubmitDataService, VerifyTR } from './controllerGlucosaBasal';
import {
    InputCheckbox,
    InputTextOneLine, SectionFieldset
} from '../../../../../../components/reusableComponents/ResusableComponents';
import EmpleadoComboBox from '../../../../../../components/reusableComponents/EmpleadoComboBox';
import { useEffect } from 'react';
import DatosPersonalesLaborales from '../../../../../../components/templates/DatosPersonalesLaborales';
import BotonesAccion from '../../../../../../components/templates/BotonesAccion';

const tabla = 'analisis_bioquimicos';

export default function GlucosaBasal() {
    const { token, userlogued, selectedSede, userName } = useSessionData();
    const today = getToday();

    const initialFormState = {
        norden: '',
        codAb:null,
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
    };

    const {
        form,
        setForm,
        handleChange,
        handleChangeNumberDecimals,
        handleFocusNext,
        handleChangeSimple,
        handleClearnotO,
        handleClear,
        handlePrintDefault,
    } = useForm(initialFormState);

    const handleSave = () => {
        SubmitDataService(form, token, userlogued, handleClear, tabla);
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            handleClearnotO();
            VerifyTR(form.norden, tabla, token, setForm, selectedSede);
        }
    };

    const handlePrint = () => {
        handlePrintDefault(() => {
            PrintHojaR(form.norden, token, tabla);
        });
    };

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
            <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <InputTextOneLine
                    label="N° Orden"
                    name="norden"
                    value={form.norden}
                    onChange={handleChangeNumberDecimals}
                    onKeyUp={handleSearch}
                    labelWidth="120px"
                />
                <InputTextOneLine
                    label="Fecha"
                    name="fecha"
                    type="date"
                    value={form.fecha}
                    onChange={handleChangeSimple}
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
                />
                <InputCheckbox
                    label="Examen Directo"
                    checked={form.examenDirecto}
                    name="examenDirecto"
                    onChange={(e) => {
                        const checked = e.target.checked;
                        setForm(prev => {
                            const newState = { ...prev, examenDirecto: checked };
                            if (checked) {
                                newState.glucosaBasal = '';
                            } else {
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
                        disabled={form.examenDirecto}
                        className='w-[85%]'
                    />
                    <span className="text-gray-500 text-[10px] font-medium">{"(Valor Normal 70 - 110 mg/dl)"}</span>
                </div>
                <div className="flex items-center gap-4">
                    <InputTextOneLine
                        label="Colesterol Total"
                        name="colesterolTotal"
                        value={form.colesterolTotal}
                        labelWidth="120px"
                        onChange={(e) => handleChangeNumberDecimals(e, 1)}
                        onKeyUp={handleFocusNext}
                        disabled={!form.examenDirecto}
                        className='w-[85%]'
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
                        disabled={!form.examenDirecto}
                        className='w-[85%]'
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
                        disabled={!form.examenDirecto}
                        className='w-[85%]'
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
                        disabled={!form.examenDirecto}
                        className='w-[85%]'
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
                        disabled={!form.examenDirecto}
                        className='w-[85%]'
                    />
                    <span className="text-gray-500 text-[10px] font-medium">{"(Valor Normal < 30 mg/dl)"}</span>
                </div>
            </SectionFieldset>

            <SectionFieldset legend="Asignación de Médico">
                <EmpleadoComboBox
                    value={form.nombre_medico}
                    label="Especialista"
                    form={form}
                    onChange={handleChangeSimple}
                />
            </SectionFieldset>

            <BotonesAccion
                form={form}
                handleSave={handleSave}
                handleClear={handleClear}
                handlePrint={handlePrint}
                handleChangeNumberDecimals={handleChangeNumberDecimals}
            />
        </div>
    );
}
