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
import { SubmitValorizaciones } from './model/controllerValo';

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
    const initialFormState = {
        rucContrata: '',
        rucEmpresa: '',
        razonEmpresa: '',
        razonContrata: '',
        fechaInicio: '',
        fechaFinal: '',
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
    const today = new Date().toLocaleDateString('en-CA');
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
        if (today) {
            setForm(prevDatos => ({
                ...prevDatos,
                fechaInicio: today,
                fechaFinal: today,
            }));
        }
    }, [today]);

    useEffect(() => {
        const SedeDefiner = Sedes.find(sedes => sedes.cod_sede === 'T-NP');

        if (SedeDefiner) {
            setForm(prevDatos => ({
                ...prevDatos,
                sede: SedeDefiner
            }));
        }
    }, [Sedes]);

    /*const SubmitAPI = async () => {

        if (!form.matrizSeleccionada || form.matrizSeleccionada === "") {
            setData([]);
            return;
        }

        setLoading(true);
        const datosapi = {
            rucContrata: form.rucContrata,
            rucEmpresa: form.rucEmpresa,
            fechaInicio: form.fechaInicio,
            fechaFinal: form.fechaFinal,
            sede: form.sede.cod_sede
        };

        try {
            const config = MATRICES_MAP[form.matrizSeleccionada];
            if (!config) {
                setLoading(false);
                return;
            }
            const isMatrizArena = form.matrizSeleccionada === "Matriz-9";
            const isMatrizCaraveli = form.matrizSeleccionada === "Matriz-11";

            if (config.urlH) {

                const { urlH, methodH, urlB, methodB } = config;

                const [headersResponse, bodyResponse] = await Promise.all([
                    GetMatrizUniversal(null, { url: urlH, method: methodH }, token),
                    GetMatrizUniversal(datosapi, { url: urlB, method: methodB }, token)
                ]);

                if (!Array.isArray(headersResponse) || !Array.isArray(bodyResponse)) {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Ocurrió un error al traer la Matriz"
                    });
                    return;
                }

                let processedBody = bodyResponse;

                // 🔥 SOLO MATRIZ 9
                if (isMatrizArena || isMatrizCaraveli) {
                    processedBody = bodyResponse.map(item => ({
                        ...item,
                        responsable_digitalizacion: userlogued.form.nombres_user.toUpperCase()
                    }));
                }

                setHeaders(headersResponse);
                setData(processedBody);

            } else {
                const response = await GetMatrizUniversal(
                    datosapi,
                    { url: config.url, method: config.method },
                    token
                );

                if (!Array.isArray(response)) {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Ocurrió un error al traer la Matriz"
                    });
                }

                setData(response);

                // 🔥 Generar columnas automáticamente
                if (response.length > 0) {
                    const autoHeaders = Object.keys(response[0]).map(key => ({
                        field: key,
                        headerName: key.toUpperCase()
                    }));

                    setHeaders(autoHeaders);
                } else {
                    setHeaders([]);
                }
            }

        } catch (error) {

            Swal.fire({
                icon: "error",
                title: "Ocurrió un error al traer la Matriz",
                text: "No hay form que mostrar",
            });

        } finally {
            setLoading(false);
        }
    };*/

    /*const handleRUCEmpresa = (e) => {
        //una para empresa
        const selectedRuc = e.target.value;
        const empresaSeleccionada = EmpresaUser.find(empresa => empresa.ruc === selectedRuc);
        if (empresaSeleccionada) {
            setForm(prevDatos => ({
                ...prevDatos,
                rucContrata: null,
                rucEmpresa: empresaSeleccionada.ruc,
            }))
            return
        }
        const contrataSeleccionada = ContrataUser.find(contrata => contrata.ruc === selectedRuc);

        if (contrataSeleccionada) {
            setForm(prevDatos => ({
                ...prevDatos,
                rucContrata: contrataSeleccionada.ruc,
                rucEmpresa: null,
            }))
        }

        //otra para contrata
    }*/

    useEffect(() => {
        if (reload > 0) {
            SubmitAPI(); // Llama a la función SubmitAPI para recargar los form
            setReload(0); // Reinicia el estado reload para evitar múltiples recargas
        }
    }, [reload]);


    /*const exportToExcel2 = async () => {
        const config = MATRICES_MAP[form.matrizSeleccionada];
        const trabajadores = data || [];
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Reporte");
        const isMatrizSaludProseguridad = form.matrizSeleccionada === "Matriz-13";
        const isMatriz17 = form.matrizSeleccionada === "Matriz-17";

        const columnasOjo = ["od", "oi", "od lejos", "oi lejos"];
        const esColumnaOjo = (text) =>
            columnasOjo.includes(String(text).toLowerCase().trim());

        const borderStyle = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" }
        };

        // ============================================
        // 🔍 SI NO HAY HEADERS DINÁMICOS (MODO PLANO)
        // ============================================
        if (!head || head.length === 0 || !head[0]?.children) {

            if (trabajadores.length === 0) return;


            // 🔎 Detectar si head viene estructurado
            const hasStructuredHead = head && head.length > 0;

            const columns = hasStructuredHead
                ? head
                : Object.keys(trabajadores[0]).map(key => ({
                    label: key,
                    field: key
                }));

            // 1️⃣ HEADER SIMPLE
            columns.forEach((col, index) => {

                const cell = worksheet.getRow(1).getCell(index + 1);

                const headerName = col.label ?? col.field ?? "";
                cell.value = headerName;

                let fontColor;
                let bgColor;

                // 🔵 PRIORIDAD: MATRIZ 17
                if (isMatriz17) {
                    fontColor = { argb: "FFFFFFFF" }; // blanco
                    bgColor = "FF000080"; // azul oscuro (#000080)
                }

                // 🟡 MATRIZ 13
                else if (isMatrizSaludProseguridad) {
                    fontColor = esColumnaOjo(headerName)
                        ? { argb: "FF000000" } // negro
                        : { argb: "FFFFC000" }; // amarillo

                    bgColor = col.color
                        ? "FF" + col.color.replace("#", "")
                        : "FFFFFFFF";
                }

                // ⚪ DEFAULT
                else {
                    fontColor = undefined;
                    bgColor = col.color
                        ? "FF" + col.color.replace("#", "")
                        : "FFFFFFFF";
                }

                // 🎨 FONT
                cell.font = {
                    bold: true,
                    ...(fontColor && { color: fontColor })
                };

                // 🎨 FILL
                cell.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: bgColor }
                };

                cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
                cell.border = borderStyle;
            });

            // 2️⃣ DATA
            let rowIndex = 2;

            trabajadores.forEach(item => {

                const row = worksheet.getRow(rowIndex);

                columns.forEach((col, colIndex) => {

                    const cell = row.getCell(colIndex + 1);

                    cell.value = item[col.field] ?? "";
                    cell.border = borderStyle;
                    cell.alignment = { horizontal: "center", vertical: "middle" };
                });

                rowIndex++;
            });

            worksheet.columns.forEach(col => col.width = 18);

            const buffer = await workbook.xlsx.writeBuffer();
            saveAs(new Blob([buffer]), `${config.name}.xlsx`);

            return;
        }

        // ============================================
        // 🔥 MODO JERÁRQUICO (CON ESTRUCTURA)
        // ============================================
        const estructura = head;

        const getMaxDepth = (nodes, level = 1) =>
            Math.max(...nodes.map(n =>
                n.children?.length
                    ? getMaxDepth(n.children, level + 1)
                    : level
            ));

        const maxDepth = getMaxDepth(estructura);

        const countLeaves = (node) =>
            !node.children?.length
                ? 1
                : node.children.reduce((sum, child) => sum + countLeaves(child), 0);

        const generateHeader = (nodes, level, startCol) => {

            let currentCol = startCol;

            nodes.forEach(node => {

                const span = countLeaves(node);
                const colStart = currentCol;
                const colEnd = currentCol + span - 1;

                const cell = worksheet.getRow(level).getCell(colStart);
                cell.value = node.label ?? "";
                cell.font = { bold: true };
                cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
                cell.border = borderStyle;

                // 🎨 Pintar SOLO si tiene color
                if (node.color) {
                    cell.fill = {
                        type: "pattern",
                        pattern: "solid",
                        fgColor: { argb: node.color.replace("#", "") }
                    };
                }

                if (span > 1) {
                    worksheet.mergeCells(level, colStart, level, colEnd);
                }

                if (!node.children?.length && level < maxDepth) {
                    worksheet.mergeCells(level, colStart, maxDepth, colStart);
                }

                if (node.children?.length) {
                    generateHeader(node.children, level + 1, colStart);
                }

                currentCol += span;
            });
        };

        generateHeader(estructura, 1, 1);

        // Extraer hojas
        const fields = [];

        const extractFields = (nodes) => {
            nodes.forEach(n => {
                if (!n.children?.length) {
                    fields.push(n.field);
                } else {
                    extractFields(n.children);
                }
            });
        };

        extractFields(estructura);

        let dataStartRow = maxDepth + 1;

        trabajadores.forEach(item => {

            const row = worksheet.getRow(dataStartRow);

            fields.forEach((field, colIndex) => {

                const cell = row.getCell(colIndex + 1);
                const valor = item[field] ?? "";
                cell.value = valor;

                if (form.matrizSeleccionada === "Matriz-9" && field.toLowerCase() === "condicion") {

                    const normalized = String(valor).toLowerCase().trim();

                    if (normalized === "no apto") {
                        cell.fill = {
                            type: "pattern",
                            pattern: "solid",
                            fgColor: { argb: "FFFF0000" }
                        };
                        cell.font = {
                            bold: true,
                            color: { argb: "FFFFFFFF" }
                        };
                    }

                    if (normalized === "apto") {
                        cell.fill = {
                            type: "pattern",
                            pattern: "solid",
                            fgColor: { argb: "FF00B050" }
                        };
                        cell.font = {
                            bold: true,
                            color: { argb: "FFFFFFFF" }
                        };
                    }

                    if (normalized === "evaluado") {
                        cell.fill = {
                            type: "pattern",
                            pattern: "solid",
                            fgColor: { argb: "FF00B050" }
                        };
                        cell.font = {
                            bold: true,
                            color: { argb: "FFFFFFFF" }
                        };
                    }
                }
                cell.border = borderStyle;
                cell.alignment = { horizontal: "center", vertical: "middle" };

            });

            dataStartRow++;
        });

        worksheet.columns.forEach(col => col.width = 18);

        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), `${config.name}.xlsx`);
    };*/

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


    const reloadTable = () => {
        if (form.matrizSeleccionada === "") {
            setData([]);
            return;
        }
        setReload(reload + 1);
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
        SubmitValorizaciones(form, token, setData, setForm)
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
    console.log(columnasVisibles)
    return (
        <div className="container mx-auto mt-12 mb-12">
            <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-xl w-[90%]">
                <div className="px-4 py-2 azuloscurobackground flex justify-between">
                    <h1 className="text-start font-bold color-azul text-white">Valorizacion</h1>
                    <div className="flex items-center gap-4">
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
                        <button onClick={reloadTable} className="focus:outline-none relative">
                            {loading && <div className="absolute inset-0 opacity-50 rounded-md"></div>}
                            <FontAwesomeIcon icon={faSyncAlt} className={`text-white cursor-pointer tamañouno ${loading ? 'opacity-50' : ''}`} />
                        </button>
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
                        <button
                            onClick={() => { setModal(true) }}
                            className={`bg-green-600 mt-4 text-white px-4 py-2 rounded-md `}
                        >
                            <FontAwesomeIcon icon={faMagnifyingGlass} className="mr-2" />
                            Filtros de Tabla
                        </button>
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
