import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBroom, faSave } from "@fortawesome/free-solid-svg-icons";
import InputTextOneLine from "../InputTextOneLine";
import InputTextArea from "../InputTextArea";
import SectionFieldset from "../SectionFieldset";
import CreatableMultiSelect from "./CreatableMultiSelect";
import Cie10MultiSelect from "./Cie10MultiSelect";
import { getRecomendaciones, getRestricciones } from "./model";

export default function PlantillaDiagnosticoForm({ hook, token }) {
    const {
        form,
        setForm,
        cie10s,
        setCie10s,
        recomendaciones,
        setRecomendaciones,
        restricciones,
        setRestricciones,
        saving,
        guardar,
        limpiar,
    } = hook;

    return (
        <SectionFieldset legend={form.idPlantilla ? "Editar Plantilla" : "Nueva Plantilla"} className="grid md:grid-cols-2 gap-x-4 gap-y-3">
            <InputTextOneLine
                label="Código"
                name="codigo"
                value={form.codigo}
                onChange={(e) =>
                    setForm((prev) => ({ ...prev, codigo: e.target.value.toUpperCase() }))
                }
                labelWidth="120px"
            />
            <InputTextOneLine
                label="Título"
                name="titulo"
                value={form.titulo}
                onChange={(e) =>
                    setForm((prev) => ({ ...prev, titulo: e.target.value.toUpperCase() }))
                }
                labelWidth="120px"
            />
            <InputTextOneLine
                label="Diagnóstico"
                name="diagnostico"
                value={form.diagnostico}
                labelWidth="120px"
                className="col-span-2"
                onChange={(e) =>
                    setForm((prev) => ({ ...prev, diagnostico: e.target.value.toUpperCase() }))
                }
            />
            <div className="col-span-2">
                <Cie10MultiSelect token={token} selected={cie10s} onChange={setCie10s} label="CIE10" />
            </div>

            <CreatableMultiSelect
                label="Recomendaciones"
                placeholder="Buscar o crear recomendación..."
                selected={recomendaciones}
                onChange={setRecomendaciones}
                fetchAll={() => getRecomendaciones(undefined, token)}
            />

            <CreatableMultiSelect
                label="Restricciones"
                placeholder="Buscar o crear restricción..."
                selected={restricciones}
                onChange={setRestricciones}
                fetchAll={() => getRestricciones(undefined, token)}
            />

            <div className="flex gap-3 pt-2">
                <button
                    type="button"
                    disabled={saving}
                    onClick={guardar}
                    className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm px-4 py-2 rounded flex items-center gap-2"
                >
                    <FontAwesomeIcon icon={faSave} />
                    {form.idPlantilla ? "Actualizar" : "Guardar"}
                </button>
                <button
                    type="button"
                    onClick={limpiar}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white text-sm px-4 py-2 rounded flex items-center gap-2"
                >
                    <FontAwesomeIcon icon={faBroom} />
                    Limpiar
                </button>
            </div>
        </SectionFieldset>
    );
}
