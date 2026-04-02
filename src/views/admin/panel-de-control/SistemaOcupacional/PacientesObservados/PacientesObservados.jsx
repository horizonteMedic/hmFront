import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useSessionData } from "../../../../hooks/useSessionData";
import { useForm } from "../../../../hooks/useForm";
import {
    GetInfoServicio,
    getInfoTabla,
    handleLevantarObservacion,
    Loading,
    SubmitDataService,
    VerifyTR,
} from "./controllerPacientesObservados";
import { formatearFechaCorta } from "../../../../utils/formatDateUtils";
import { getToday } from "../../../../utils/helpers";
import InputTextOneLine from "../../../../components/reusableComponents/InputTextOneLine";
import SectionFieldset from "../../../../components/reusableComponents/SectionFieldset";
import InputTextArea from "../../../../components/reusableComponents/InputTextArea";
import TablaTemplate from "../../../../components/templates/TablaTemplate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faSearch,
    faFileExcel,
    faTrash,
    faFileMedical,
    faBroom,
} from "@fortawesome/free-solid-svg-icons";
import * as XLSX from "xlsx";
import BotonesAccion from "../../../../components/templates/BotonesAccion";

const tabla = "pacientes_observados";

export default function PacientesObservados() {
    const { token, userlogued, selectedSede, hora } = useSessionData();
    const today = getToday();

    const initialFormState = {
        norden: "",
        codigoPacientesObservados: null,
        fecha: today,
        dni: "",
        nombres: "",
        edad: "",
        interpretacion: "",

        // Búsqueda
        nombres_search: "",
        empresas_search: "",
        observaciones_search: "",
        codigo_search: "",
        fechaDesde: today,
        fechaHasta: today,
    };

    const {
        form,
        setForm,
        handleChange,
        handleChangeSimple,
        handleChangeNumberDecimals,
        handleClear,
        handleClearnotO,
    } = useForm(initialFormState);

    const [dataTabla, setDataTabla] = useState([]);

    const handleSave = () => {
        SubmitDataService(form, token, userlogued, handleClear, tabla, obtenerInfoTabla);
    };

    const obtenerInfoTabla = () => {
        getInfoTabla(
            form.nombres_search,
            form.codigo_search,
            form.fechaDesde,
            form.fechaHasta,
            setDataTabla,
            token
        );
    };

    const handleSpecialtyClick = (specialty) => {
        setForm((prev) => {
            const textToAppend = `${specialty.toUpperCase()}: `;
            const currentText = prev.interpretacion || "";
            const newText = currentText.endsWith("\n") || currentText === ""
                ? `${currentText}${textToAppend}`
                : `${currentText}\n${textToAppend}`;

            return { ...prev, interpretacion: newText };
        });
    };

    const handleExportar = () => {
        if (dataTabla.length === 0) {
            Swal.fire("Aviso", "No hay datos para exportar", "info");
            return;
        }
        const dataToExport = dataTabla.map(row => ({
            "N° Orden": row.norden,
            "Nombres": row.nombres,
            "Empresa": row.empresa,
            "Contrata": row.contrata,
            "Fecha": formatearFechaCorta(row.fechaInforme),
            "Observaciones": row.interpretacion,
            "Hora Inicio": row.horaInicio,
            "Hora Fin": row.horaFin,
        }));
        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Pacientes Observados");
        XLSX.writeFile(workbook, `Pacientes_Observados_${getToday()}.xlsx`);
    };

    const handleLevantar = () => {
        handleLevantarObservacion(form, token, userlogued, handleClear, obtenerInfoTabla);
    };

    const handleSearch = (e) => {
        if (e.key === "Enter") {
            handleClearnotO();
            // VerifyTR(form.norden, tabla, token, setForm, selectedSede);
        }
    };

    useEffect(() => {
        obtenerInfoTabla();
    }, []);

    const specialties = [
        ["CARDIOLOGIA", "TEST ALTURA"],
        ["OFTALMOLOGIA", "HTA"],
        ["ODONTOLOGIA", "OTORINOLARINGOLOGIA"],
        ["ESPIROMETRIA", "AUDIOMETRIA"],
        ["OBESIDAD", "LABORATORIO"],
        ["NEUMOLOGIA", "RX TORAX"]
    ];

    return (
        <div className="px-4 max-w-[95%] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-x-6 gap-y-6">
            {/* PANEL IZQUIERDO */}
            <div className="lg:col-span-5 space-y-4">
                <SectionFieldset legend="Información del Paciente" className="grid grid-cols-1 gap-3">
                    <div className="grid grid-cols-2 gap-3">
                        <InputTextOneLine
                            label="N° Orden"
                            name="norden"
                            value={form?.norden}
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
                    </div>
                    <InputTextOneLine
                        label="Nombres"
                        name="nombres"
                        value={form.nombres}
                        disabled
                    />
                    <div className="grid grid-cols-2 gap-3">
                        <InputTextOneLine
                            label="Edad (años)"
                            name="edad"
                            value={form.edad}
                            disabled
                        />
                        <InputTextOneLine
                            label="Hora"
                            name="hora"
                            value={hora}
                            inputClassName="font-bold"
                            disabled
                        />
                    </div>
                </SectionFieldset>

                <div className="grid grid-cols-2 gap-x-8 gap-y-2 ">
                    {specialties.map((pair, idx) => (
                        <div key={idx} className="contents">
                            {pair.map((spec) => (
                                <button
                                    key={spec}
                                    type="button"
                                    onClick={() => handleSpecialtyClick(spec)}
                                    className="px-3 py-1 text-xs font-medium border rounded-md bg-gray-100 hover:bg-gray-200 transition"
                                >

                                    {spec}
                                </button>
                            ))}
                        </div>
                    ))}
                </div>

                <SectionFieldset legend="Interpretación" className="mt-2">
                    <InputTextArea
                        name="interpretacion"
                        value={form.interpretacion}
                        rows={6}
                        onChange={handleChange}
                        noLabel
                    />
                </SectionFieldset>

                <div className="flex justify-between items-center pt-4">
                    <button
                        onClick={handleLevantar}
                        className="
                            bg-red-600 hover:bg-red-700
                            text-white text-base px-6 py-2 rounded
                            flex items-center gap-2
                            transition-all duration-150 ease-out
                            hover:shadow-lg
                            active:scale-95 active:shadow-inner"
                    >
                        <FontAwesomeIcon icon={faTrash} />
                        Levantar Observ
                    </button>
                    <BotonesAccion
                        form={form}
                        handleSave={handleSave}
                        handleClear={handleClear}
                        hidePrint
                    />
                </div>
            </div>

            {/* PANEL DERECHO */}
            <div className="lg:col-span-7 space-y-4">
                <SectionFieldset legend="Buscar" className="space-y-4">
                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-8 space-y-3">
                            <InputTextOneLine
                                label="N° Orden"
                                labelWidth="120px"
                                name="codigo_search"
                                value={form.codigo_search}
                                onChange={handleChangeNumberDecimals}
                            />
                            <InputTextOneLine
                                label="Nombres/Apellidos"
                                labelWidth="120px"
                                name="nombres_search"
                                value={form.nombres_search}
                                onChange={handleChange}
                            />
                            <InputTextOneLine
                                label="Empresa/Contrata"
                                labelWidth="120px"
                                name="empresas_search"
                                value={form.empresas_search}
                                onChange={handleChange}
                            />
                            <InputTextOneLine
                                label="Observaciones"
                                labelWidth="120px"
                                name="observaciones_search"
                                value={form.observaciones_search}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-span-4 space-y-3">
                            <InputTextOneLine
                                label="Desde"
                                name="fechaDesde"
                                type="date"
                                value={form.fechaDesde}
                                onChange={handleChangeSimple}
                            />
                            <InputTextOneLine
                                label="Hasta"
                                name="fechaHasta"
                                type="date"
                                value={form.fechaHasta}
                                onChange={handleChangeSimple}
                            />
                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={obtenerInfoTabla}
                                    className="
                                        bg-blue-600 hover:bg-blue-700 justify-center
                                        text-white text-base px-6 py-2 rounded
                                        flex items-center gap-2
                                        transition-all duration-150 ease-out
                                        hover:shadow-lg
                                        active:scale-95 active:shadow-inner"
                                >
                                    <FontAwesomeIcon icon={faSearch} />
                                    Buscar
                                </button>
                                <button
                                    onClick={handleExportar}
                                    className="
                                        bg-green-600 hover:bg-green-700 justify-center
                                        text-white text-base px-6 py-2 rounded
                                        flex items-center gap-2
                                        transition-all duration-150 ease-out
                                        hover:shadow-lg
                                        active:scale-95 active:shadow-inner"
                                >
                                    <FontAwesomeIcon icon={faFileExcel} />
                                    Exportar
                                </button>
                            </div>
                        </div>
                    </div>
                </SectionFieldset>
                <SectionFieldset legend="Lista de Pacientes" >
                    <Table
                        data={dataTabla}
                        set={setForm}
                        token={token}
                        clean={handleClear}
                    />
                </SectionFieldset>
            </div>
        </div>
    );
}

function Table({ data, set, token, clean }) {
    function clicktable(nro) {
        clean();
        Loading("Importando Datos");
        GetInfoServicio(nro, tabla, set, token, () => {
            Swal.close();
        });
    }

    const columns = [
        {
            label: "N° Orden",
            accessor: "norden",
            width: "100px",
            render: (row) => <span className="font-bold">{row.norden}</span>,
        },
        {
            label: "Nombres",
            accessor: "nombres",
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
            accessor: "fechaInforme",
            width: "100px",
            render: (row) => formatearFechaCorta(row.fechaInforme),
        },
        {
            label: "Observaciones",
            accessor: "interpretacion",
        },
        {
            label: "Hora Inicio",
            accessor: "horaInicio",
        },
        {
            label: "Hora Fin",
            accessor: "horaFin",
        },
    ];

    return (
        <TablaTemplate
            columns={columns}
            data={data}
            height={450}
            onRowClick={(row) => clicktable(row.norden)}
        />
    );
}
