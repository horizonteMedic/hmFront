import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import ModalBase from "../../../components/ModalBase";
import { mensajeDeError } from "../../../utils/apiSalud";
import useFormulario from "../../../utils/useFormulario";
import { getTodayPlusOneYear } from "../../../../../../utils/helpers";
import { FloatingInput } from "../components/FloatingField";
import { registrarIngresoStock } from "../controllerProductosEnInventario";

const FORM_ID = "form-ingreso-stock";

// Lote y fecha de vencimiento son obligatorios para el backend; se sugieren valores para no frenar la carga.
const valoresIniciales = () => ({ cantidad: "", lote: "0000", fechaVencimiento: getTodayPlusOneYear(), motivo: "Restock" });

const validar = ({ cantidad, lote, fechaVencimiento, motivo }) => {
    const errores = {};
    if (!/^[1-9]\d*$/.test(cantidad.trim())) errores.cantidad = "Ingresa una cantidad entera mayor a 0";
    if (!lote.trim()) errores.lote = "Ingresa el lote";
    if (!fechaVencimiento) errores.fechaVencimiento = "Selecciona la fecha de vencimiento";
    if (!motivo.trim()) errores.motivo = "Ingresa el motivo";
    return errores;
};

// Suma stock a un medicamento de la campaña (compra o reposición).
export default function IngresoStockModal({ token, usuario, medicamento, onClose, onGuardado }) {
    const { valores, errores, cambiar, guardando, enviar } = useFormulario(valoresIniciales(), validar);
    const campo = (name) => ({
        id: `ingreso-${name}`,
        name,
        value: valores[name],
        error: errores[name],
        onChange: (e) => cambiar(name, e.target.value),
    });

    const guardar = async (ingreso) => {
        try {
            await registrarIngresoStock(medicamento.id, ingreso, usuario, token);
            onGuardado();
            onClose();
            Swal.fire("¡Éxito!", `Se sumaron ${ingreso.cantidad} unidades al stock de "${medicamento.nombre}"`, "success");
        } catch (error) {
            console.error(error);
            Swal.fire("Error", mensajeDeError(error, "Ha ocurrido un error al registrar el ingreso"), "error");
        }
    };

    return (
        <ModalBase
            title="Ingreso de stock"
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
                        {guardando ? "Registrando..." : "Registrar ingreso"}
                    </button>
                </>
            }
        >
            <form id={FORM_ID} onSubmit={enviar(guardar)} className="space-y-4">
                <p className="text-sm text-gray-600">
                    Medicamento: <span className="font-semibold">{medicamento.nombre}</span>
                    {" · "}Stock actual: <span className="font-semibold">{medicamento.stockActual ?? 0}</span>
                </p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FloatingInput {...campo("cantidad")} label="Cantidad" required type="number" min="1" />
                    <FloatingInput {...campo("lote")} label="Lote" required />
                    <FloatingInput {...campo("fechaVencimiento")} label="Fecha de vencimiento" required type="date" />
                    <FloatingInput {...campo("motivo")} label="Motivo" required />
                </div>
            </form>
        </ModalBase>
    );
}
