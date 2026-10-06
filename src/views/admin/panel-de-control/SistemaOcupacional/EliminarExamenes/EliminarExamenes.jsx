import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBroom, faDownload, faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";
import { InputTextOneLine } from "../../../../components/reusableComponents/ResusableComponents";
import { useForm } from "../../../../hooks/useForm";
import { useSessionData } from "../../../../hooks/useSessionData";
import SectionFieldset from "../../../../components/reusableComponents/SectionFieldset";
import { VerifyTR, DeleteExamen } from "./controllerEliminarExamenes";
import DatosPersonalesLaborales from "../../../../components/templates/DatosPersonalesLaborales";
import { EXAMENES_CONFIG } from "./ExamenesList";
const tabla = "eliminar_examenes";

export default function EliminarExamenes() {
    const { token, selectedSede } = useSessionData();

    const initialFormState = {
        norden: "",
        nombreExamen: "",

        nombres: "",
        dni: "",
        edad: "",
        sexo: "",

        empresa: "",
        contrata: "",
        areaTrabajo: "",
        puestoActual: "",
        listaExamenes: EXAMENES_CONFIG,


    };

    const {
        form,
        setForm,
        handleChange,
        handleClear,
        handleChangeNumberDecimals,
        handleClearnotO,
    } = useForm(initialFormState, { storageKey: "eliminarExamenesOcupacional" });

    const handleSearch = (e) => {
        if (e.key === "Enter") {
            handleClearnotO();
            VerifyTR(form.norden, tabla, token, setForm, selectedSede, form.listaExamenes);
        }
    };

    const handleDelete = (campo) => {
        DeleteExamen(form.norden, campo, token, setForm, form);
    };

    const ExamenRow = ({ label, name, value }) => (
        <div className="flex items-center gap-2 mb-1 px-[8px] sm:px-[15px]">
            <InputTextOneLine
                className="min-w-0 flex-1"
                label={label}
                name={name}
                value={value}
                inputClassName={`text-center font-bold ${value === "PASO" ? "text-green-600" : "text-red-700"}`}
                // El ancho del label va inline: en móvil se reduce con `!` para dejar espacio al input
                labelClassName="max-sm:!min-w-[110px] max-sm:!max-w-[110px] break-words"
                onChange={handleChange}
                disabled
                labelWidth="160px"
            />
            <button
                type="button"
                disabled={value === "NO PASO"}
                onClick={() => handleDelete(name)}
                className={`shrink-0 text-red-500 hover:text-red-700 border border-red-300 rounded px-2 py-1 ${value === "NO PASO" ? "opacity-50" : ""}`}
                title="Eliminar"
            >
                <FontAwesomeIcon icon={faTrash} />
            </button>
        </div>
    );

    const normalizeItems = (items = []) => {
        const result = [];
        let currentGroup = {
            title: null,
            items: []
        };

        items.forEach(el => {
            // 🔹 Si es sección
            if (el.items && el.title) {
                // guarda grupo anterior
                if (currentGroup.items.length) {
                    result.push(currentGroup);
                }

                // agrega sección directamente
                result.push(el);

                // reinicia grupo
                currentGroup = { title: null, items: [] };
            } else {
                // 🔹 item plano
                currentGroup.items.push(el);
            }
        });

        // último grupo
        if (currentGroup.items.length) {
            result.push(currentGroup);
        }

        return result;
    };

    return (
        <div className="space-y-3 px-[8px] md:px-[15px] max-w-full max-w-[95%] xl:max-w-[90%]  mx-auto">

            <div className="flex justify-end">
                <button className="bg-primario py-2 px-3 text-white rounded-xl w-full sm:w-auto">
                    <a href="/MANUAL-DE-ELIMINAR-EXAMANES.pdf"
                        download="MANUAL-DE-ELIMINAR-EXAMANES.pdf"
                        className="flex gap-x-4 justify-center items-center">
                        <FontAwesomeIcon
                            icon={faDownload}
                        />
                        <span className="download-button-text">Descargar Manual de Eliminar Exámenes</span>
                    </a>
                </button>
            </div>

            {/* Búsqueda */}
            <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
                <InputTextOneLine
                    label="N° Orden"
                    name="norden"
                    value={form?.norden}
                    onChange={handleChangeNumberDecimals}
                    onKeyUp={handleSearch}
                    labelWidth="120px"
                />
                <InputTextOneLine
                    label="Tipo de Examen"
                    name="nombreExamen"
                    value={form.nombreExamen}
                    disabled
                    labelWidth="120px"
                />
            </SectionFieldset>

            <DatosPersonalesLaborales form={form} />

            {/* Layout principal: 1 columna en móvil, 2 en lg y 3 en xl.
                La columna 3 (muchas secciones cortas) ocupa el ancho completo en lg
                y reparte sus secciones en 2 columnas para no dejar huecos. */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 items-start">
                {[1, 2, 3].map(col => (
                    <div
                        key={col}
                        className={`min-w-0 space-y-3 ${col === 3 ? "lg:col-span-2 xl:col-span-1 lg:columns-2 xl:columns-auto lg:gap-x-3" : ""}`}
                    >
                        {form.listaExamenes
                            .filter(section => section.column === col)
                            .map(section => (
                                <div key={section.legend} className="break-inside-avoid">
                                    <SectionFieldset legend={section.legend} fieldsetClassName="min-w-0" className={"!px-0"}>
                                        {(section.sections || normalizeItems(section.items)).map((sub, index) => (
                                            <div key={`${sub.title}-${index}`} className="mb-3">

                                                {/* 🔸 Título */}
                                                {sub.title && (
                                                    <div className="font-semibold text-[10px] rounded-t flex items-center bg-primario  text-white px-4 py-2 w-full rounded mb-2">
                                                        {sub.title}
                                                    </div>
                                                )}

                                                {/* 🔸 Items */}
                                                {sub.items
                                                    .slice() // 🔹 evita mutar el original
                                                    .sort((a, b) => a.label.localeCompare(b.label, 'es', { sensitivity: 'base' }))
                                                    .map((item, index) => (
                                                        <ExamenRow
                                                            key={`${item.name}-${index}`}
                                                            label={item.label}
                                                            name={item.name}
                                                            value={
                                                                Array.isArray(item.resultado)
                                                                    ? item.resultado.length > 0
                                                                        ? "PASO"
                                                                        : "NO TIENE"
                                                                    : item.resultado === true
                                                                        ? "PASO"
                                                                        : "NO PASO"
                                                            }
                                                        />
                                                    ))}
                                            </div>
                                        ))}
                                    </SectionFieldset>
                                </div>
                            ))}
                    </div>
                ))}
            </div>

            <section className="flex flex-col md:flex-row justify-between items-center gap-4 sm:px-[15px]">
                <div className="flex gap-4 w-full md:w-auto">
                    <button
                        type="button"
                        onClick={handleClear}
                        className="bg-amber-500 hover:bg-amber-600 text-white text-base px-6 py-2 rounded flex items-center justify-center gap-2 w-full md:w-auto"
                    >
                        <FontAwesomeIcon icon={faBroom} /> Limpiar
                    </button>
                </div>
            </section>
        </div>
    );
}
