import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import ModalBase from "../../../components/ModalBase";
import { mensajeDeError } from "../../../utils/apiSalud";
import useFormulario from "../../../utils/useFormulario";
import { FloatingInput } from "../components/FloatingField";
import { ajustarStock } from "../controllerProductosEnInventario";

const FORM_ID = "form-ajuste-stock";

const TIPOS = {
    aumentar: { etiqueta: "Aumentar", verbo: "aumentó", icono: faPlus, signo: 1, activo: "border-green-600 bg-green-50 text-green-700" },
    disminuir: { etiqueta: "Disminuir", verbo: "disminuyó", icono: faMinus, signo: -1, activo: "border-red-600 bg-red-50 text-red-700" },
};

const VALORES_INICIALES = { tipo: "aumentar", cantidad: "", motivo: "" };

// Ajuste manual del stock de un medicamento de la campaña: sube o baja según lo que marque el usuario.
export default function AjusteStockModal({ token, usuario, medicamento, onClose, onGuardado }) {
    const stock = medicamento.stockActual ?? 0;

    const validar = ({ tipo, cantidad, motivo }) => {
        const errores = {};
        if (!/^[1-9]\d*$/.test(cantidad.trim())) errores.cantidad = "Ingresa una cantidad entera mayor a 0";
        else if (tipo === "disminuir" && Number(cantidad) > stock) errores.cantidad = `No puedes disminuir más que el stock actual (${stock})`;
        if (!motivo.trim()) errores.motivo = "Escribe el motivo del ajuste";
        return errores;
    };

    const { valores, errores, cambiar, guardando, enviar } = useFormulario(VALORES_INICIALES, validar);
    const campo = (name) => ({
        id: `ajuste-${name}`,
        name,
        value: valores[name],
        error: errores[name],
        onChange: (e) => cambiar(name, e.target.value),
    });

    const cantidad = Number(valores.cantidad);
    const stockResultante = stock + TIPOS[valores.tipo].signo * (cantidad > 0 ? cantidad : 0);

    const guardar = async ({ tipo, cantidad, motivo }) => {
        try {
            await ajustarStock(medicamento.id, { diferencia: TIPOS[tipo].signo * Number(cantidad), motivo }, usuario, token);
            onGuardado();
            onClose();
            Swal.fire("¡Éxito!", `Se ${TIPOS[tipo].verbo} el stock de "${medicamento.nombre}" en ${cantidad} unidad(es)`, "success");
        } catch (error) {
            console.error(error);
            Swal.fire("Error", mensajeDeError(error, "Ha ocurrido un error al registrar el ajuste"), "error");
        }
    };

    return (
        <ModalBase
            title="Ajuste de stock"
            onClose={onClose}
            footer={
                <>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded border border-gray-300 bg-white px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        form={FORM_ID}
                        disabled={guardando}
                        className="azul-btn flex items-center gap-2 rounded px-5 py-2 text-sm font-semibold disabled:opacity-50"
                    >
                        <FontAwesomeIcon icon={faCheck} />
                        {guardando ? "Registrando..." : "Registrar ajuste"}
                    </button>
                </>
            }
        >
            <form id={FORM_ID} onSubmit={enviar(guardar)} className="space-y-4">
                <p className="text-sm text-gray-600">
                    Medicamento: <span className="font-semibold">{medicamento.nombre}</span>
                    {" · "}Stock actual: <span className="font-semibold">{stock}</span>
                </p>

                <div role="radiogroup" aria-label="Tipo de ajuste" className="grid grid-cols-2 gap-2">
                    {Object.entries(TIPOS).map(([clave, { etiqueta, icono, activo }]) => (
                        <button
                            key={clave}
                            type="button"
                            role="radio"
                            aria-checked={valores.tipo === clave}
                            onClick={() => cambiar("tipo", clave)}
                            className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold ${
                                valores.tipo === clave ? activo : "border-gray-300 text-gray-500 hover:bg-gray-50"
                            }`}
                        >
                            <FontAwesomeIcon icon={icono} /> {etiqueta}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FloatingInput {...campo("cantidad")} label="Cantidad" required type="number" min="1" />
                    <FloatingInput {...campo("motivo")} label="Motivo" required />
                </div>

                {cantidad > 0 && (
                    <p className="text-sm text-gray-600">
                        El stock pasará de <span className="font-semibold">{stock}</span> a{" "}
                        <span className="font-semibold">{stockResultante}</span>.
                    </p>
                )}
                <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
                    Es una medida extraordinaria para corregir errores al registrar medicamentos: también corrige las unidades del
                    medicamento y queda guardada con tu usuario y el motivo.
                </p>
            </form>
        </ModalBase>
    );
}
