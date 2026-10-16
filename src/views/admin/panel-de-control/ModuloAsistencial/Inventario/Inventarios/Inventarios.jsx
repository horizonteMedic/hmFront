import { useEffect, useMemo, useState } from "react";
import InputTextOneLine from "../../../../../components/reusableComponents/InputTextOneLine";
import { SelectField } from "../../../../../components/reusableComponents/InputSelect";
import SectionFieldset from "../../../../../components/reusableComponents/SectionFieldset";
import BotonesForm from "../../../../../components/templates/BotonesForm";
import TablaTemplate from "../../../../../components/templates/TablaTemplate";
import { useForm } from "../../../../../hooks/useForm";
import { useSessionData } from "../../../../../hooks/useSessionData";
import { formatearFechaHora } from "../../../../../utils/formatDateUtils";
import { ObtenerInventarios, RegistrarInventario, ValidarInventario } from "./controllerInventarios";

// Sede de la sesión actual (misma fuente que el selector de sede del Navbar), en mayúsculas como la
// guarda el backend.
const nombreSedeActual = (userCompleto, selectedSede) =>
    String(userCompleto?.sedes?.find((sede) => String(sede.cod_sede) === String(selectedSede))?.nombre_sede ?? "").toUpperCase();

const columnas = [
    { label: "Nombre", accessor: "nombre", width: "24%" },
    { label: "Tipo", accessor: "tipo", width: "10%" },
    { label: "Sede", accessor: "sede", width: "14%" },
    { label: "Inventario Padre", width: "20%", render: (row) => row.inventarioPadreNombre || "—" },
    {
        label: "Estado",
        width: "10%",
        render: (row) => (
            <span className={`px-2 py-0.5 rounded text-sm font-semibold ${row.activo ? "bg-emerald-100 text-emerald-700" : "bg-gray-200 text-gray-600"}`}>
                {row.activo ? "Activo" : "Inactivo"}
            </span>
        ),
    },
    { label: "Registrado por", accessor: "usuarioRegistro", width: "10%" },
    { label: "Fecha de Registro", width: "12%", render: (row) => formatearFechaHora(row.fechaRegistro) },
];

export default function Inventarios() {
    const { token, userlogued, userCompleto, selectedSede } = useSessionData();

    const sedeActual = nombreSedeActual(userCompleto, selectedSede);
    const initialFormState = { nombre: "", sede: sedeActual };
    const { form, handleChange, handleChangeSimple, handleClear } = useForm(initialFormState);

    const [inventarios, setInventarios] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [errorCarga, setErrorCarga] = useState("");
    const [errores, setErrores] = useState({});

    const opcionesSede = useMemo(
        () => (userCompleto?.sedes ?? []).map((sede) => ({ value: String(sede.nombre_sede).toUpperCase(), label: sede.nombre_sede })),
        [userCompleto]
    );

    const cargar = async () => {
        setCargando(true);
        await ObtenerInventarios(token, setInventarios, setErrorCarga);
        setCargando(false);
    };

    useEffect(() => {
        cargar();
    }, []);

    // Al corregir un campo se le quita el mensaje de error.
    const limpiarError = (campo) => setErrores((prev) => ({ ...prev, [campo]: "" }));

    const onChange = (e) => {
        handleChange(e);
        limpiarError(e.target.name);
    };

    // El select no usa handleChange: este pone el valor en mayúsculas y restaura el cursor, algo que
    // un <select> no soporta.
    const onChangeSelect = (e) => {
        handleChangeSimple(e);
        limpiarError(e.target.name);
    };

    const handleSave = async () => {
        const erroresForm = ValidarInventario(form, inventarios);
        setErrores(erroresForm);
        if (Object.keys(erroresForm).length > 0) return;

        const registrado = await RegistrarInventario(form, token, userlogued);
        if (!registrado) return;

        handleClear();
        setErrores({});
        cargar();
    };

    const handleLimpiar = () => {
        handleClear();
        setErrores({});
    };

    return (
        <div className="space-y-4 px-4 pb-4">
            <SectionFieldset legend="Registrar Inventario" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputTextOneLine
                    label="Nombre"
                    name="nombre"
                    value={form.nombre}
                    onChange={onChange}
                    required
                    error={errores.nombre}
                />
                <SelectField
                    label="Sede"
                    name="sede"
                    value={form.sede}
                    onChange={onChangeSelect}
                    options={opcionesSede}
                    inline
                    labelWidth="80px"
                    required
                    error={errores.sede}
                />
            </SectionFieldset>

            <BotonesForm hideEdit hidePrint saveLabel="Registrar" handleSave={handleSave} handleClear={handleLimpiar} />

            <SectionFieldset legend="Inventarios Registrados">
                {errorCarga && (
                    <div className="flex items-center justify-between gap-4 mb-3 p-3 rounded border border-red-300 bg-red-50 text-red-700">
                        <span>{errorCarga}</span>
                        <button
                            type="button"
                            onClick={cargar}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded transition-all duration-150 ease-out active:scale-95"
                        >
                            Reintentar
                        </button>
                    </div>
                )}
                <TablaTemplate
                    columns={columnas}
                    data={inventarios}
                    height={400}
                    emptyText={cargando ? "Cargando inventarios..." : "No hay inventarios registrados"}
                />
            </SectionFieldset>
        </div>
    );
}
