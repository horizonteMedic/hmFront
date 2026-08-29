import { useCallback, useState } from "react";
import Swal from "sweetalert2";
import {
    guardarPlantillaDiagnostico,
    getPlantillaDiagnostico,
    getPlantillasDiagnostico,
    getRecomendaciones,
    guardarRecomendacion,
    getRestricciones,
    guardarRestriccion,
} from "./model";
import { useCatalogoSimple } from "./useCatalogoSimple";

const initialFormState = {
    id: null,
    codigo: "",
    titulo: "",
    diagnostico: "",
};

const recomendacionApi = {
    list: getRecomendaciones,
    guardar: guardarRecomendacion,
};

const restriccionApi = {
    list: getRestricciones,
    guardar: guardarRestriccion,
};

/**
 * Hook reutilizable para el módulo de Plantillas de Diagnóstico:
 * vincula código + título + diagnóstico con listas de cie10, recomendaciones
 * y restricciones. Pensado para incrustarse en cualquier formulario
 * (Triaje y otros) además de usarse en su propia pantalla de búsqueda/CRUD.
 */
export function usePlantillaDiagnostico({ token, usuarioCreacion }) {
    const [form, setForm] = useState(initialFormState);
    const [cie10s, setCie10s] = useState([]);
    const [recomendaciones, setRecomendaciones] = useState([]);
    const [restricciones, setRestricciones] = useState([]);

    // Catálogos completos de recomendaciones/restricciones (búsqueda + CRUD),
    // reutilizados por ejemplo por CatalogoSimpleManager.
    const catalogoRecomendaciones = useCatalogoSimple({
        token,
        usuarioCreacion,
        api: recomendacionApi,
    });
    const catalogoRestricciones = useCatalogoSimple({
        token,
        usuarioCreacion,
        api: restriccionApi,
    });

    const [plantillas, setPlantillas] = useState([]);
    const [filtros, setFiltros] = useState({
        titulo: "",
        codigo: "",
        diagnostico: "",
        cie10: "",
    });
    const [loadingList, setLoadingList] = useState(false);
    const [saving, setSaving] = useState(false);

    // No se auto-consulta al montar el hook: quien lo use decide cuándo
    // pedir el listado (p.ej. el buscador lo hace al abrirse el modal).
    const buscarPlantillas = useCallback(
        async (customFiltros) => {
            setLoadingList(true);
            try {
                const res = await getPlantillasDiagnostico(customFiltros ?? filtros, token);
                setPlantillas(Array.isArray(res) ? res : []);
            } finally {
                setLoadingList(false);
            }
        },
        [filtros, token]
    );

    const limpiar = useCallback(() => {
        setForm(initialFormState);
        setCie10s([]);
        setRecomendaciones([]);
        setRestricciones([]);
    }, []);

    const cargarParaEditar = useCallback(
        async (id) => {
            const res = await getPlantillaDiagnostico(id, token);
            if (!res || res.error) {
                Swal.fire("Error", "No se pudo cargar la plantilla", "error");
                return;
            }
            setForm({
                id: res.id ?? null,
                codigo: res.codigo || "",
                titulo: res.titulo || "",
                diagnostico: res.diagnostico || "",
            });
            setCie10s(res.cie10s || []);
            setRecomendaciones(res.recomendaciones || []);
            setRestricciones(res.restricciones || []);
        },
        [token]
    );

    const validar = () => {
        if (!form.codigo?.trim()) {
            Swal.fire("Error", "El código es obligatorio", "error");
            return false;
        }
        if (!form.titulo?.trim()) {
            Swal.fire("Error", "El título es obligatorio", "error");
            return false;
        }
        if (!form.diagnostico?.trim()) {
            Swal.fire("Error", "El diagnóstico es obligatorio", "error");
            return false;
        }
        return true;
    };

    // Extrae un mensaje legible de una respuesta fallida (Response cruda,
    // aún sin leer) para mostrar el motivo real que dé el backend (p.ej.
    // código o título duplicado), en vez de un mensaje genérico.
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

    const guardar = useCallback(async () => {
        if (!validar()) return null;
        setSaving(true);
        try {
            // Código y título deben ser irrepetibles, pero esa validación ya
            // no se hace en el front (no se consultan GET por codigo/titulo
            // antes de guardar): el propio endpoint de registrar/actualizar
            // la valida y devuelve error si se incumple.

            // Recomendaciones/restricciones ya no admiten crearse "al
            // vuelo" junto con el diagnóstico: cada ítem seleccionado debe
            // tener un id real (CreatableMultiSelect las crea de inmediato
            // contra su propio endpoint apenas el usuario las agrega).
            const body = {
                id: form.id ?? null,
                codigo: form.codigo.trim(),
                titulo: form.titulo.trim(),
                diagnostico: form.diagnostico.trim(),
                cie10Cods: cie10s.map((c) => c.codigo),
                idsRecomendacion: recomendaciones.map((r) => r.id),
                idsRestriccion: restricciones.map((r) => r.id),
            };

            const res = await guardarPlantillaDiagnostico(body, usuarioCreacion, token);

            if (!res || res.error || res.status) {
                const mensaje = await extraerMensajeError(res, "No se pudo guardar la plantilla");
                Swal.fire("Error", mensaje, "error");
                return null;
            }

            Swal.fire({
                icon: "success",
                title: form.id ? "Plantilla actualizada" : "Plantilla creada",
                timer: 1500,
                showConfirmButton: false,
            });
            limpiar();
            buscarPlantillas(filtros);
            return res;
        } finally {
            setSaving(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form, cie10s, recomendaciones, restricciones, token, usuarioCreacion]);

    return {
        form,
        setForm,
        cie10s,
        setCie10s,
        recomendaciones,
        setRecomendaciones,
        restricciones,
        setRestricciones,
        catalogoRecomendaciones,
        catalogoRestricciones,
        plantillas,
        filtros,
        setFiltros,
        loadingList,
        saving,
        buscarPlantillas,
        cargarParaEditar,
        guardar,
        limpiar,
    };
}
