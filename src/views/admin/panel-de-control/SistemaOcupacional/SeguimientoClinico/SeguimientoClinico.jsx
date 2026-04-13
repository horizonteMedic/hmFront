import { InputTextOneLine, InputTextArea } from "../../../../components/reusableComponents/ResusableComponents";
import SectionFieldset from "../../../../components/reusableComponents/SectionFieldset";
import { useSessionData } from "../../../../hooks/useSessionData";
import { getToday } from "../../../../utils/helpers";
import { useForm } from "../../../../hooks/useForm";
import { DatosPersonalesLaborales, TablaTemplate } from "../../../../components/templates/Templates";
import { getHistorialExamenes, searchByNorden } from "./controllerSeguimientoClinico";
import { formatearFechaCorta } from "../../../../utils/formatDateUtils";
import { useState, useEffect } from "react";

export default function SeguimientoClinico() {
    const today = getToday();
    const { token, userlogued, selectedSede, datosFooter, userName } = useSessionData();

    const initialFormState = {
        // Header - Información del examen
        norden: "",
        fecha: today,
        nombreExamen: "",
        esApto: undefined,

        dni: "",
        nombres: "",
        apellidos: "",
        fechaNacimiento: "",
        lugarNacimiento: "",
        edad: "",
        sexo: "",
        estadoCivil: "",
        nivelEstudios: "",
        historialOrdenes: [],

        resultadoExamenes: {
            laboratorio: [],
            audiometria: [],
            oftalmologia: [],
            rayosX: []
        }
    };

    const {
        form,
        setForm,
        handleChange,
        handleChangeNumberDecimals,
        handleChangeSimple,
        handleRadioButtonBoolean,
        handleClear,
        handleClearnotO,
    } = useForm(initialFormState);

    const handleSearch = (e) => {
        if (e.key === "Enter") {
            handleClearnotO();
            searchByNorden(form.norden, setForm, token);
            getHistorialExamenes(form.norden, setForm, token);
        }
    };

    return (
        <div className="px-4 max-w-[95%] xl:max-w-[95%] mx-auto grid gap-x-6 lg:grid-cols-2 ">
            <div className="space-y-3">
                <SectionFieldset legend="Información del Paciente" className="grid grid-cols-2 gap-3">
                    <InputTextOneLine
                        label="N° Orden"
                        name="norden"
                        value={form.norden}
                        onChange={handleChangeNumberDecimals}
                        onKeyUp={handleSearch}
                        labelWidth="120px"
                    />
                </SectionFieldset>
                <DatosPersonalesLaborales form={form} laborales={false} minSizePrincipal={"3xl"} />
                <div className="flex-1">
                    <Table data={form.historialOrdenes} />
                </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <ComparisonTabs resultadoExamenes={form.resultadoExamenes} currentNorden={form.norden} />
            </div>
        </div>
    );
}

function ComparisonTabs({ resultadoExamenes, currentNorden }) {
    const [activeTab, setActiveTab] = useState("laboratorio");
    const [selections, setSelections] = useState({
        laboratorio: { left: "", right: "" },
        audiometria: { left: "", right: "" },
        oftalmologia: { left: "", right: "" },
        rayosX: { left: "", right: "" }
    });

    const tabs = [
        { id: "laboratorio", label: "Laboratorio" },
        { id: "audiometria", label: "Audiometría" },
        { id: "oftalmologia", label: "Oftalmología" },
        { id: "rayosX", label: "Rayos X Tórax" }
    ];

    useEffect(() => {
        if (resultadoExamenes) {
            const newSelections = { ...selections };
            Object.keys(resultadoExamenes).forEach(category => {
                const data = resultadoExamenes[category] || [];
                if (data.length > 0) {
                    // Por defecto, la izquierda es el norden buscado (o el primero si no coincide)
                    const leftIndex = data.findIndex(item => String(item.norden) === String(currentNorden));
                    const leftNorden = leftIndex !== -1 ? data[leftIndex].norden : data[0].norden;

                    // La derecha es el siguiente (o el segundo si el primero es el de la izquierda)
                    let rightNorden = "";
                    if (data.length > 1) {
                        const nextIndex = leftIndex !== -1 ? (leftIndex + 1 < data.length ? leftIndex + 1 : leftIndex - 1) : 1;
                        rightNorden = data[nextIndex].norden;
                    }

                    newSelections[category] = {
                        left: String(leftNorden),
                        right: String(rightNorden)
                    };
                }
            });
            setSelections(newSelections);
        }
    }, [resultadoExamenes, currentNorden]);

    const handleSelectionChange = (category, side, value) => {
        setSelections(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [side]: value
            }
        }));
    };

    const renderComparison = (category) => {
        if (category === "laboratorio") {
            return <LaboratorioTable data={resultadoExamenes.laboratorio || []} />;
        }

        const data = resultadoExamenes[category] || [];
        const leftNorden = selections[category].left;
        const rightNorden = selections[category].right;

        const leftData = data.find(item => String(item.norden) === leftNorden);
        const rightData = data.find(item => String(item.norden) === rightNorden);

        const nordenOptions = data.map(item => ({
            value: String(item.norden),
            label: `${item.norden} (${formatearFechaCorta(item.fecha_registro)})`
        }));

        return (
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 border-b pb-2">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase">Norden Izquierda</label>
                        <select
                            className="w-full p-2 border rounded text-sm bg-gray-50 focus:ring-2 focus:ring-blue-500"
                            value={leftNorden}
                            onChange={(e) => handleSelectionChange(category, "left", e.target.value)}
                        >
                            <option value="">Seleccionar...</option>
                            {nordenOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase">Norden Derecha</label>
                        <select
                            className="w-full p-2 border rounded text-sm bg-gray-50 focus:ring-2 focus:ring-blue-500"
                            value={rightNorden}
                            onChange={(e) => handleSelectionChange(category, "right", e.target.value)}
                        >
                            <option value="">Seleccionar...</option>
                            {nordenOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 overflow-y-auto max-h-[600px] pr-2">
                    <div className="space-y-2 border-r pr-2">
                        {leftData ? <DataRenderer category={category} data={leftData} /> : <NoData />}
                    </div>
                    <div className="space-y-2">
                        {rightData ? <DataRenderer category={category} data={rightData} /> : <NoData />}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex border-b mb-4">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${activeTab === tab.id
                                ? "border-blue-600 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="flex-1">
                {renderComparison(activeTab)}
            </div>
        </div>
    );
}

function LaboratorioTable({ data }) {
    const columns = [
        { label: "N° Orden", accessor: "norden", width: "100px", render: (row) => <span className="font-bold">{row.norden}</span> },
        { label: "Fecha", accessor: "fecha_registro", render: (row) => row.fecha_registro ? formatearFechaCorta(row.fecha_registro) : "SIN REGISTROS" },
        { label: "Grupo Sanguíneo", accessor: "grupo_sanguineo" },
        { label: "Factor RH", accessor: "factor_rh" },
    ];

    return (
        <div className="mt-2">
            <TablaTemplate
                columns={columns}
                data={data}
                height={500}
                onRowClick={(row) => { }}
                onRowRightClick={(row) => { }}
            />
        </div>
    );
}

function NoData() {
    return <div className="text-gray-400 text-center py-10 italic text-sm">Sin datos para comparar</div>;
}

function DataRenderer({ category, data }) {
    if (category === "oftalmologia") {
        return (
            <div className="space-y-4">
                <SectionFieldset legend="Sin Corregir" className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                        <div className="text-[10px] font-bold text-center text-gray-400 uppercase">Ojo Derecho</div>
                        <InputTextOneLine label="V. Cerca" value={data.vision_cerca_od} disabled labelWidth="60px" />
                        <InputTextOneLine label="V. Lejos" value={data.vision_lejos_od} disabled labelWidth="60px" />
                    </div>
                    <div className="space-y-2">
                        <div className="text-[10px] font-bold text-center text-gray-400 uppercase">Ojo Izquierdo</div>
                        <InputTextOneLine label="V. Cerca" value={data.vision_cerca_oi} disabled labelWidth="60px" />
                        <InputTextOneLine label="V. Lejos" value={data.vision_lejos_oi} disabled labelWidth="60px" />
                    </div>
                </SectionFieldset>

                <SectionFieldset legend="Corregida" className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                        <div className="text-[10px] font-bold text-center text-gray-400 uppercase">Ojo Derecho</div>
                        <InputTextOneLine label="V. Cerca" value={data.vision_cerca_corregida_od} disabled labelWidth="60px" />
                        <InputTextOneLine label="V. Lejos" value={data.vision_lejos_corregida_od} disabled labelWidth="60px" />
                    </div>
                    <div className="space-y-2">
                        <div className="text-[10px] font-bold text-center text-gray-400 uppercase">Ojo Izquierdo</div>
                        <InputTextOneLine label="V. Cerca" value={data.vision_cerca_corregida_oi} disabled labelWidth="60px" />
                        <InputTextOneLine label="V. Lejos" value={data.vision_lejos_corregida_oi} disabled labelWidth="60px" />
                    </div>
                </SectionFieldset>

                <SectionFieldset legend="Valoración Oftalmológica" className="grid gap-y-2">
                    <InputTextOneLine label="V. Colores" value={data.vision_colores} disabled labelWidth="100px" />
                    <InputTextOneLine label="V. Binocular" value={data.vision_binocular} disabled labelWidth="100px" />
                    <InputTextOneLine label="Reflejos Pupilares" value={data.reflejos_pupilares} disabled labelWidth="100px" />
                    <InputTextArea label="Enfermedades Oculares" value={data.enfermedades_oculares} disabled rows={4} />
                    <InputTextArea label="Otros" value={data.otros} disabled rows={2} />
                </SectionFieldset>
            </div>
        );
    }

    if (category === "audiometria") {
        const hz = [500, 1000, 2000, 3000, 4000, 6000, 8000];
        const renderFrequencyTable = (title, prefix) => (
            <SectionFieldset legend={title} className="mb-4">
                <div className="grid grid-cols-8 gap-1 mb-1">
                    <div className="text-[8px] font-bold text-center">Hz</div>
                    {hz.map(h => <div key={h} className="text-[8px] font-bold text-center">{h}</div>)}
                </div>
                <div className="grid grid-cols-8 gap-1 items-center">
                    <div className="text-[8px] font-bold text-center leading-tight">dB (A)</div>
                    {hz.map(h => (
                        <div key={h}>
                            <InputTextOneLine value={data[`${prefix}_${h}`]} disabled classNameArea="text-center p-0" />
                        </div>
                    ))}
                </div>
            </SectionFieldset>
        );

        return (
            <div className="space-y-3">
                {renderFrequencyTable("Oído Derecho (Aérea)", "ad")}
                {renderFrequencyTable("Oído Izquierdo (Aérea)", "ai")}
                {renderFrequencyTable("Oído Derecho (Ósea)", "od")}
                {renderFrequencyTable("Oído Izquierdo (Ósea)", "oi")}
                <SectionFieldset legend="Diagnóstico" className="mt-2">
                    <InputTextArea value={data.diagnostico} disabled rows={8} />
                </SectionFieldset>
            </div>
        );
    }

    if (category === "rayosX") {
        return (
            <div className="space-y-4">
                <SectionFieldset legend="Resultados Rayos X" className="grid gap-y-3">
                    <InputTextArea label="Observaciones" value={data.observaciones} disabled rows={8} />
                    <InputTextArea label="Conclusiones" value={data.conclusiones} disabled rows={8} />
                </SectionFieldset>
            </div>
        );
    }

    return null;
}

function Table({ data }) {
    const columns = [
        {
            label: "N° Orden",
            accessor: "nroOrden",
            width: "120px",
            render: (row) => <span className="font-bold">{row.nroOrden}</span>,
        },
        {
            label: "Empresa",
            accessor: "empresa",
        },
        {
            label: "Contrata",
            accessor: "contrata",
        },
        {
            label: "Fecha",
            accessor: "fechaApertura",
            render: (row) => formatearFechaCorta(row.fechaApertura),
        },
        {
            label: "Aptitud",
            accessor: "aptitud",
        },
    ];

    return (
        <TablaTemplate
            columns={columns}
            data={data}
            height={300}
            onRowClick={(row) => { }}
            onRowRightClick={(row) => { }}
        />

    );
}
