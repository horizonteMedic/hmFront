import React, { useEffect, useState } from 'react';
import { ComboboxEmpresa, ComboboxContrata, ComboboxSedes, RucEmpoCon } from './model/Combobox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExcel, faMagnifyingGlass, faChevronLeft, faChevronRight, faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import ExcelJS from 'exceljs';
import AutocompleteInput from '../../../components/reusableComponents/AutocompletableInput';
import { useSessionData } from '../../../hooks/useSessionData';
import { useForm } from '../../../hooks/useForm';
import { SelectField } from '../../../components/reusableComponents/InputSelect';
import InputsBooleanRadioGroup from '../../../components/reusableComponents/InputsBooleanRadioGroup';
import ModalFiltros from './ModalFiltros';
import { exportToExcel, SubmitValorizaciones } from './model/controllerValo';
import { getToday } from '../../../utils/helpers';

const columnasBase = [
    { nombre: "DNI", key: "dni" },
    { nombre: "Nombres", key: "nombres" },
    { nombre: "Apellidos", key: "apellidos" },
    { nombre: "Empresa", key: "empresa" },
    { nombre: "Contrata", key: "contrata" },
    { nombre: "Fecha", key: "fechaApertura" },
    { nombre: "Hora", key: "horaDeRegistro" },
    { nombre: "T. Examen", key: "nombreExamen" },
    { nombre: "Tipo Pago", key: "tipoPago" },
    { nombre: "Precio", key: "precioPo" },
    { nombre: "Exa. Adicional", key: "exaAdicional" },
    { nombre: "Tipo Prueba", key: "tipoPrueba" },
    { nombre: "Precio Adicional", key: "precioAdicional" },
    { nombre: "Autoriza", key: "autoriza" },
    { nombre: "Obs 1", key: "observacion1" },
    { nombre: "Obs 2", key: "observacion2" },
    { nombre: "Sede", key: "sede" },
    { nombre: "N° Orden", key: "norden" }
];

const Columnas = [
    { nombre: "DNI", key: "dni", valor: false },
    { nombre: "Nombres", key: "nombresCompletos", valor: false },
    { nombre: "Cargo", key: "cargo", valor: false },
    { nombre: "Fecha", key: "fechaApertura", valor: false },
    { nombre: "Tipo Pago", key: "tipoPago", valor: false },
    { nombre: "Empresa", key: "empresa", valor: false },
    { nombre: "Contrata", key: "contrata", valor: false },
    { nombre: "EKG", key: "ekg", valor: false },
    { nombre: "Sexo", key: "sexo", valor: false },
    { nombre: "T. Examen", key: "nombreExamen", valor: false },
    { nombre: "Psicosensometria", key: "psicosensometria", valor: false },
    { nombre: "RX Lumbar", key: "rxLumbar", valor: false },
    { nombre: "Trab. Calientes", key: "trabCalientes", valor: false },
    { nombre: "Visual-Compl", key: "visualCompl", valor: false },
    { nombre: "Covid1", key: "tipoPruebaCovid", valor: false },
    { nombre: "Covid2", key: "tipoPruebaCovid", valor: false },
    { nombre: "Manipulador Alimentos", key: "manipuladorAlimentos", valor: false },
    { nombre: "Herramientas Manuales", key: "herramientasManuales", valor: false },
    { nombre: "Fist-Test", key: "fistTest", valor: false },
    { nombre: "Test Altura", key: "testAltura", valor: false },
    { nombre: "RX Plomo", key: "rxPlomo", valor: false },
    { nombre: "Espacios Confinados", key: "espaciosConfinados", valor: false },
    { nombre: "Test Marihuana", key: "testMarihuana", valor: false },
    { nombre: "Test Cocaina", key: "testCocaina", valor: false },
    { nombre: "Mercurio", key: "mercurio", valor: false },
    { nombre: "RX Lumbo Sacra", key: "rxLumboSacra", valor: false },
    { nombre: "RX Dorso Lumbar", key: "rxDorsoLumbar", valor: false }
];

const Valorizacion = () => {
    const { token, userlogued, selectedSede, datosFooter, userName, userDNI } =
        useSessionData();
    const EmpresasMulti = ComboboxEmpresa()
    const ContrataMulti = ComboboxContrata()
    const today = getToday();
    const initialFormState = {
        rucContrata: '',
        rucEmpresa: '',
        razonEmpresa: '',
        razonContrata: '',
        fechaInicio: today,
        fechaFinal: today,
        sede: '',
        tipoPago: '',
        matrizSeleccionada: '', // Agrega este estado para controlar la selección de matriz
        TipoBusqueda: true,
        Filtros: Columnas
    };
    const {
        form,
        setForm,
        handleChange,
        handleChangeNumber,
        handleRadioButton,
        handleChangeSimple,
        handleCheckBoxChange,
        handleRadioButtonBoolean,
        handleClear,
        handleClearnotO,
        handlePrintDefault,
    } = useForm(initialFormState);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [recordsPerPage, setRecordsPerPage] = useState(15);
    const [reload, setReload] = useState(0); // Estado para controlar la recarga de la tabla
    const [exportButtonEnabled, setExportButtonEnabled] = useState(false);
    const [modal, setModal] = useState(false)
    const Sedes = ComboboxSedes();

    // Autocompletado Empresa
    const [searchEmpresa, setSearchEmpresa] = useState(form.razonEmpresa);
    const [searchContrata, setSearchContrata] = useState(form.razonContrata);


    useEffect(() => {
        if (data.length > 0) {
            setExportButtonEnabled(true);
        } else {
            setExportButtonEnabled(false);
        }
    }, [data]);

    useEffect(() => {
        const SedeDefiner = Sedes.find(sedes => sedes.cod_sede === 'T-NP');

        if (SedeDefiner) {
            setForm(prevDatos => ({
                ...prevDatos,
                sede: SedeDefiner
            }));
        }
    }, [Sedes]);

    useEffect(() => {
        if (reload > 0) {
            SubmitAPI(); // Llama a la función SubmitAPI para recargar los form
            setReload(0); // Reinicia el estado reload para evitar múltiples recargas
        }
    }, [reload]);

    const handleExport = () => {
        exportToExcel({
            data,
            form,
            columnasBase,
            config: { name: "Reporte_Valorizacion" }
        });
    };

    const flattenTree = (nodes, level = 0, parentLabel = null, result = []) => {
        nodes.forEach(node => {
            result.push({
                label: node.label,
                field: node.field,
                color: node.color,
                level,
                parentLabel
            });

            if (node.children && node.children.length > 0) {
                flattenTree(node.children, level + 1, node.label, result);
            }
        });

        return result;
    };

    // Paginación
    const visiblePages = () => {
        const totalVisiblePages = 5;
        const halfVisiblePages = Math.floor(totalVisiblePages / 2);
        let startPage = currentPage - halfVisiblePages;
        startPage = Math.max(startPage, 1);
        const endPage = startPage + totalVisiblePages - 1;
        return Array.from({ length: totalVisiblePages }, (_, i) => startPage + i).filter(page => page <= totalPages);
    };

    const handlePageClick = (page) => {
        setCurrentPage(page);
    };

    const handleChangeRecordsPerPage = (e) => {
        setRecordsPerPage(parseInt(e.target.value));
        setCurrentPage(1);
        setTotalPages(Math.ceil(data.length / parseInt(e.target.value)));
    };

    const SubmitAPI = () => {
        const esPersonalizada = !form.TipoBusqueda;

        if (esPersonalizada) {
            setForm(prev => ({
                ...prev,
                Filtros: prev.Filtros.map(col => ({
                    ...col,
                    valor: true
                }))
            }));
        }
        SubmitValorizaciones(form, token, setData, setTotalPages, recordsPerPage)
    }

    const getMaxDepth = (nodes, level = 1) =>
        Math.max(
            ...nodes.map(n =>
                n.children?.length
                    ? getMaxDepth(n.children, level + 1)
                    : level
            )
        );

    const countLeaves = (node) =>
        !node.children?.length
            ? 1
            : node.children.reduce((sum, child) => sum + countLeaves(child), 0);

    const extractLeaves = (nodes, result = []) => {
        nodes.forEach(n => {
            if (!n.children?.length) {
                result.push(n.field);
            } else {
                extractLeaves(n.children, result);
            }
        });
        return result;
    };

    const columnasVisibles = form.TipoBusqueda
        ? columnasBase
        : form.Filtros.filter(col => col.valor);
    const startIdx = (currentPage - 1) * recordsPerPage;
    const endIdx = startIdx + recordsPerPage;
    const currentData = Array.isArray(data)
        ? data.slice(startIdx, endIdx)
        : [];

    return (
        <div className="container mx-auto mt-12 mb-12">
            <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-xl w-[90%]">
                <div className="px-4 py-2 azuloscurobackground flex justify-between">
                    <h1 className="text-start font-bold color-azul text-white">Valorizacion</h1>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleExport}
                            className={`verde-btn px-4 py-1 rounded-md ${exportButtonEnabled ? '' : 'cursor-not-allowed opacity-50'}`}
                            disabled={!exportButtonEnabled}
                        >
                            <FontAwesomeIcon icon={faFileExcel} className="mr-2" />
                            Exportar a Excel
                        </button>
                        <div className="flex items-center">
                            <span className="ml-2 text-white mr-1">Resultados por página</span>
                            <select
                                className="border pointer border-gray-300 rounded-md px-1"
                                value={recordsPerPage}
                                onChange={handleChangeRecordsPerPage}
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={15}>15</option>
                                <option value={20}>20</option>
                                <option value={25}>25</option>
                            </select>
                        </div>
                    </div>
                </div>
                {/* filtros */}
                <div className='flex w-full justify-center items-center mt-4'>
                    <InputsBooleanRadioGroup
                        name="TipoBusqueda"
                        trueLabel="Orden Servicio"
                        falseLabel="Personalizada"
                        value={form?.TipoBusqueda}
                        onChange={handleRadioButtonBoolean}
                    />
                </div>
                <div className="flex w-full flex-grow p-6 pb-0 gap-4">
                    <div className='flex w-[50%] justify-center items-center gap-2'>
                        <AutocompleteInput
                            label="Empresa"
                            id="RazonEmpresa"
                            value={searchEmpresa}
                            options={EmpresasMulti}
                            placeholder="Escribe para buscar empresa..."
                            onChange={(v) => {
                                setSearchEmpresa(v);
                                setForm(d => ({ ...d, razonEmpresa: v }));
                            }}
                            onSelect={(emp) => {
                                setSearchEmpresa(emp.razonSocial);
                                setForm(d => ({ ...d, razonEmpresa: emp.razonSocial, rucEmpresa: emp.ruc }));
                            }}
                            nextFocusId="razonContrata"
                        />
                    </div>
                    <div className='flex w-[50%] justify-center items-center gap-2'>
                        <AutocompleteInput
                            label="Contrata"
                            id="razonContrata"
                            value={searchContrata}
                            options={ContrataMulti}
                            placeholder="Escribe para buscar contrata..."
                            onChange={(v) => {
                                setSearchContrata(v);
                                setForm(d => ({ ...d, razonContrata: v }));
                            }}
                            onSelect={(c) => {
                                setSearchContrata(c.razonSocial);
                                setForm(d => ({ ...d, razonContrata: c.razonSocial, rucContrata: c.ruc }));
                            }}
                        />
                    </div>
                </div>
                <div className="flex flex-wrap gap-4 p-6">
                    <div className="flex flex-col flex-grow">
                        <SelectField
                            label="Sede"
                            name="sede"
                            value={form.sede ? JSON.stringify(form.sede) : ""}
                            onChange={handleChange}
                            placeholder="Seleccionar Sede"
                            options={Sedes.map(s => ({ value: JSON.stringify(s), label: s.nombre_sede }))}
                        />
                    </div>
                    <div className="flex flex-col flex-grow">
                        <p className="font-semibold">Fecha Inicio</p>
                        <input
                            type="date"
                            id="fechaInicio"
                            name="fechaInicio"
                            value={form.fechaInicio}
                            onChange={handleChange}
                            className="pointer border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none"
                        />
                    </div>
                    <div className="flex flex-col flex-grow">
                        <p className="font-semibold">Fecha Fin</p>
                        <input
                            type="date"
                            id="fechaFin"
                            name="fechaFinal"
                            value={form.fechaFinal}
                            onChange={handleChange}
                            className="pointer border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none"
                        />
                    </div>
                    <div className="flex flex-col flex-grow">
                        <SelectField
                            label="Tipo de Pago"
                            name="tipoPago"
                            value={form.tipoPago}
                            onChange={handleChange}
                            options={[
                                { value: "EFECTIVO", label: "EFECTIVO" },
                                { value: "CREDITO", label: "CREDITO" },
                            ]}
                        />
                    </div>
                    <div className="flex flex-grow justify-center gap-2 w-full">
                        {!form.TipoBusqueda && <button
                            onClick={() => { setModal(true) }}
                            className={`bg-green-600 mt-4 text-white px-4 py-2 rounded-md `}
                        >
                            <FontAwesomeIcon icon={faMagnifyingGlass} className="mr-2" />
                            Filtros de Tabla
                        </button>}
                        <button
                            onClick={SubmitAPI}
                            className={`bg-blue-900 mt-4 text-white px-4 py-2 rounded-md  ${form.tipoPago && (form.rucContrata || form.rucEmpresa) ? '' : 'opacity-50 cursor-not-allowed'}`}
                            disabled={!form.tipoPago || loading || (!form.rucContrata && !form.rucEmpresa) ||
                                (form.rucContrata === "" && form.rucEmpresa === "")}
                        >
                            <FontAwesomeIcon icon={faMagnifyingGlass} className="mr-2" />
                            Buscar
                        </button>
                    </div>
                </div>
                {/* Tabla de form */}
                <div className="overflow-x-auto p-3 relative">
                    <table className="min-w-full border border-gray-300 text-sm">

                        {/* HEADER */}
                        <thead className="bg-gray-100">
                            <tr>
                                {columnasVisibles.map((col, i) => (
                                    <th key={i} className="border px-3 py-2 text-left">
                                        {col.nombre}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        {/* BODY */}
                        <tbody>
                            {currentData.map((row, i) => (
                                <tr key={i}>
                                    {columnasVisibles.map((col, j) => {
                                        let value = row[col.key];

                                        if (typeof value === "boolean") {
                                            value = value ? "SI" : "NO";
                                        }

                                        return (
                                            <td key={j} className="border px-2 py-1">
                                                {value ?? "-"}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>
                <div className="flex justify-center p-4">
                    <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className="mx-1 px-3 py-1 naranjabackgroud text-white rounded-md">
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </button>
                    {/* Mostrar números de página */}
                    {visiblePages().map((page) => (
                        <button key={page} onClick={() => handlePageClick(page)} className={`mx-1 px-3 py-1 rounded-md ${currentPage === page ? 'azuloscurobackground text-white' : 'bg-gray-200'}`}>
                            {page}
                        </button>
                    ))}
                    <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} className="mx-1 px-3 py-1 naranjabackgroud text-white rounded-md">
                        <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                </div>
            </div>
            {modal && <ModalFiltros closeModal={() => { setModal(false) }} Filtros={form.Filtros}
                setFiltros={(callback) =>
                    setForm(prev => ({
                        ...prev,
                        Filtros: callback(prev.Filtros) // 🔥 AQUÍ está la clave
                    }))
                } />}
        </div>
    );
};

export default Valorizacion;
