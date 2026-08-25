import { useCallback, useState } from "react";
import Swal from "sweetalert2";
import {
    actualizarPlantillaDiagnostico,
    crearPlantillaDiagnostico,
    eliminarPlantillaDiagnostico,
    getPlantillaDiagnostico,
    getPlantillasDiagnostico,
} from "./model";

const initialFormState = {
    idPlantilla: null,
    codigo: "",
    titulo: "",
    diagnostico: "",
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
        async (idPlantilla) => {
            const res = await getPlantillaDiagnostico(idPlantilla, token);
            if (!res || res.error) {
                Swal.fire("Error", "No se pudo cargar la plantilla", "error");
                return;
            }
            setForm({
                idPlantilla: res.idPlantilla,
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

    // Código y título deben ser irrepetibles: se valida contra el listado
    // filtrado por coincidencia exacta, excluyendo el registro actual.
    const validarDuplicados = async () => {
        const [porCodigo, porTitulo] = await Promise.all([
            getPlantillasDiagnostico({ codigo: form.codigo.trim() }, token),
            getPlantillasDiagnostico({ titulo: form.titulo.trim() }, token),
        ]);
        const chocaCodigo = (Array.isArray(porCodigo) ? porCodigo : []).some(
            (p) =>
                p.idPlantilla !== form.idPlantilla &&
                (p.codigo || "").trim().toUpperCase() === form.codigo.trim().toUpperCase()
        );
        if (chocaCodigo) {
            Swal.fire("Error", "Ya existe una plantilla con ese código", "error");
            return false;
        }
        const chocaTitulo = (Array.isArray(porTitulo) ? porTitulo : []).some(
            (p) =>
                p.idPlantilla !== form.idPlantilla &&
                (p.titulo || "").trim().toUpperCase() === form.titulo.trim().toUpperCase()
        );
        if (chocaTitulo) {
            Swal.fire("Error", "Ya existe una plantilla con ese título", "error");
            return false;
        }
        return true;
    };

    const guardar = useCallback(async () => {
        if (!validar()) return null;
        setSaving(true);
        try {
            const ok = await validarDuplicados();
            if (!ok) return null;

            const body = {
                codigo: form.codigo.trim(),
                titulo: form.titulo.trim(),
                diagnostico: form.diagnostico.trim(),
                cie10Cods: cie10s.map((c) => c.cod),
                recomendacionIds: recomendaciones.filter((r) => !r.isNew).map((r) => r.id),
                recomendacionesNuevas: recomendaciones
                    .filter((r) => r.isNew)
                    .map((r) => r.descripcion),
                restriccionIds: restricciones.filter((r) => !r.isNew).map((r) => r.id),
                restriccionesNuevas: restricciones
                    .filter((r) => r.isNew)
                    .map((r) => r.descripcion),
            };

            const res = form.idPlantilla
                ? await actualizarPlantillaDiagnostico(form.idPlantilla, body, usuarioCreacion, token)
                : await crearPlantillaDiagnostico(body, usuarioCreacion, token);

            if (!res || res.error || res.status) {
                Swal.fire("Error", "No se pudo guardar la plantilla", "error");
                return null;
            }

            Swal.fire({
                icon: "success",
                title: form.idPlantilla ? "Plantilla actualizada" : "Plantilla creada",
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

    const eliminar = useCallback(
        async (idPlantilla) => {
            const confirm = await Swal.fire({
                title: "¿Eliminar plantilla?",
                text: "Esta acción no se puede deshacer",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sí, eliminar",
                cancelButtonText: "Cancelar",
            });
            if (!confirm.isConfirmed) return;
            const res = await eliminarPlantillaDiagnostico(idPlantilla, token);
            if (res && res.error) {
                Swal.fire("Error", "No se pudo eliminar la plantilla", "error");
                return;
            }
            Swal.fire({
                icon: "success",
                title: "Plantilla eliminada",
                timer: 1200,
                showConfirmButton: false,
            });
            if (form.idPlantilla === idPlantilla) limpiar();
            buscarPlantillas(filtros);
        },
        [token, form.idPlantilla, filtros, buscarPlantillas, limpiar]
    );

    return {
        form,
        setForm,
        cie10s,
        setCie10s,
        recomendaciones,
        setRecomendaciones,
        restricciones,
        setRestricciones,
        plantillas,
        filtros,
        setFiltros,
        loadingList,
        saving,
        buscarPlantillas,
        cargarParaEditar,
        guardar,
        eliminar,
        limpiar,
    };
}
