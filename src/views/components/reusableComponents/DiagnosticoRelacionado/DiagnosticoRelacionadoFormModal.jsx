import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faBroom, faTimes } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { FloatingInput } from "../../../admin/panel-de-control/ModuloSalud/Inventario/ProductosEnInventario/components/FloatingField";
import { useSessionData } from "../../../hooks/useSessionData";
import Cie10MultiSelect from "./Cie10MultiSelect";
import CreatableMultiSelect from "./CreatableMultiSelect";
import {
    getRecomendaciones,
    guardarRecomendacion,
    getRestricciones,
    guardarRestriccion,
} from "./model";
import { registrarDiagnostico } from "./controllerDiagnosticoRelacionado";

const initialForm = { titulo: "", diagnostico: "" };

/**
 * Modal para registrar un diagnóstico relacionado nuevo contra
 * POST /api/v01/ct/diagnostico/registrar. Reutiliza los mismos selectores
 * (CIE10, recomendaciones, restricciones) y estilos de inputs que el
 * formulario de Plantillas de Diagnóstico. No pide código.
 *
 * `plantilla`: si se pasa un diagnóstico de la lista, al abrir el modal se
 * precargan sus campos (título, diagnóstico, CIE10, recomendaciones y
 * restricciones) para "clonarlo" y guardar uno nuevo.
 */
export default function DiagnosticoRelacionadoFormModal({ visible, onClose, onCreated, token, plantilla = null }) {
    const { userlogued } = useSessionData();
    const usuario = userlogued || "";

    const [form, setForm] = useState(initialForm);
    const [cie10s, setCie10s] = useState([]);
    const [recomendaciones, setRecomendaciones] = useState([]);
    const [restricciones, setRestricciones] = useState([]);
    const [saving, setSaving] = useState(false);
    // Mientras el usuario no toque "Título" manualmente, este espeja lo que
    // se escribe en "Diagnóstico". En cuanto lo edita, deja de espejarse.
    const [tituloEditado, setTituloEditado] = useState(false);

    // Al abrir: precarga desde `plantilla` (clonar) o deja el form en blanco.
    useEffect(() => {
        if (!visible) return;
        if (plantilla) {
            setForm({
                titulo: plantilla.titulo || "",
                diagnostico: plantilla.diagnostico || "",
            });
            setCie10s((plantilla.cie10s || []).map((c) => ({ codigo: c.codigo, descripcion: c.descripcion })));
            setRecomendaciones((plantilla.recomendaciones || []).map((r) => ({ id: r.id, descripcion: r.descripcion })));
            setRestricciones((plantilla.restricciones || []).map((r) => ({ id: r.id, descripcion: r.descripcion })));
            setTituloEditado(true);
        } else {
            setForm(initialForm);
            setCie10s([]);
            setRecomendaciones([]);
            setRestricciones([]);
            setTituloEditado(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible, plantilla]);

    if (!visible) return null;

    const clonando = !!plantilla;

    const onDiagnosticoChange = (e) => {
        const value = e.target.value.toUpperCase();
        setForm((prev) => ({
            ...prev,
            diagnostico: value,
            titulo: tituloEditado ? prev.titulo : value,
        }));
    };

    const onTituloChange = (e) => {
        if (!tituloEditado) setTituloEditado(true);
        setForm((prev) => ({ ...prev, titulo: e.target.value.toUpperCase() }));
    };

    const limpiar = () => {
        setForm(initialForm);
        setCie10s([]);
        setRecomendaciones([]);
        setRestricciones([]);
        setTituloEditado(false);
    };

    const cerrar = () => {
        limpiar();
        onClose();
    };

    const extraerMensajeError = async (res, fallback) => {
        if (!res || typeof res.text !== "function") return fallback;
        try {
            const texto = await res.text();
            if (!texto) return fallback;
            try {
                const data = JSON.parse(texto);
                return data.mensaje || data.message || data.error || fallback;
            } catch {
                return texto;
            }
        } catch {
            return fallback;
        }
    };

    const guardar = async () => {
        if (!form.diagnostico.trim()) {
            Swal.fire("Error", "El diagnóstico es obligatorio", "error");
            return;
        }
        if (!form.titulo.trim()) {
            Swal.fire("Error", "El título es obligatorio", "error");
            return;
        }

        setSaving(true);
        try {
            const body = {
                titulo: form.titulo.trim(),
                diagnostico: form.diagnostico.trim(),
                cie10Cods: cie10s.map((c) => c.codigo),
                idsRecomendacion: recomendaciones.map((r) => r.id),
                idsRestriccion: restricciones.map((r) => r.id),
                usuarioRegistro: usuario,
                usuarioActualizacion: usuario,
            };

            const res = await registrarDiagnostico(body, token);

            if (!res || res.error || res.status) {
                const mensaje = await extraerMensajeError(res, "No se pudo registrar el diagnóstico");
                Swal.fire("Error", mensaje, "error");
                return;
            }

            Swal.fire({
                icon: "success",
                title: "Diagnóstico registrado",
                timer: 1500,
                showConfirmButton: false,
            });
            limpiar();
            onCreated && onCreated(res);
            onClose();
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-30">
            <div className="bg-white rounded-md w-[min(600px,95vw)] flex flex-col">
                <div className="flex items-center justify-between px-4 py-3 border-b">
                    <h2 className="text-lg font-bold">
                        {clonando ? "Clonar Diagnóstico Relacionado" : "Nuevo Diagnóstico Relacionado"}
                    </h2>
                    <button type="button" onClick={cerrar} className="text-gray-500 hover:text-gray-700">
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>

                {/* overflow-visible: los dropdowns de los buscadores flotan por
                    encima del pie (Guardar / Limpiar) sin necesidad de scroll. */}
                <div className="p-4 overflow-visible flex flex-col gap-4">
                    <FloatingInput
                        id="dxrel-diagnostico"
                        label="Diagnóstico"
                        required
                        value={form.diagnostico}
                        onChange={onDiagnosticoChange}
                    />
                    <FloatingInput
                        id="dxrel-titulo"
                        label="Título"
                        required
                        value={form.titulo}
                        onChange={onTituloChange}
                    />

                    <Cie10MultiSelect
                        token={token}
                        selected={cie10s}
                        onChange={setCie10s}
                        label="CIE10"
                        color="blue"
                        selectedLabel="CIE10 seleccionados"
                        splitLayout
                    />

                    <CreatableMultiSelect
                        label="Recomendaciones"
                        placeholder="Buscar o crear recomendación..."
                        selected={recomendaciones}
                        onChange={setRecomendaciones}
                        fetchAll={() => getRecomendaciones(token)}
                        onCreate={(descripcion) =>
                            guardarRecomendacion(
                                { descripcion, usuarioRegistro: usuario, usuarioActualizacion: usuario },
                                token
                            )
                        }
                        color="green"
                        selectedLabel="Recomendaciones seleccionadas"
                        splitLayout
                    />

                    <CreatableMultiSelect
                        label="Restricciones"
                        placeholder="Buscar o crear restricción..."
                        selected={restricciones}
                        onChange={setRestricciones}
                        fetchAll={() => getRestricciones(token)}
                        onCreate={(descripcion) =>
                            guardarRestriccion(
                                { descripcion, usuarioRegistro: usuario, usuarioActualizacion: usuario },
                                token
                            )
                        }
                        color="red"
                        selectedLabel="Restricciones seleccionadas"
                        splitLayout
                    />
                </div>

                <div className="flex gap-3 px-4 py-3 border-t">
                    <button
                        type="button"
                        disabled={saving}
                        onClick={guardar}
                        className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm px-4 py-2 rounded flex items-center gap-2"
                    >
                        <FontAwesomeIcon icon={faSave} />
                        Guardar
                    </button>
                    <button
                        type="button"
                        onClick={limpiar}
                        className="bg-yellow-400 hover:bg-yellow-500 text-white text-sm px-4 py-2 rounded flex items-center gap-2"
                    >
                        <FontAwesomeIcon icon={faBroom} />
                        Limpiar
                    </button>
                    <button
                        type="button"
                        onClick={cerrar}
                        className="ml-auto bg-gray-200 hover:bg-gray-300 text-sm px-4 py-2 rounded"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}
