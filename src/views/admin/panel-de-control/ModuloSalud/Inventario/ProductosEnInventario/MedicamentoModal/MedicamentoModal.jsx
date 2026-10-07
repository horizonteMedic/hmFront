import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import CampaniaActivaBanner from "../../../components/CampaniaActivaBanner";
import ModalBase from "../../../components/ModalBase";
import { mensajeDeError } from "../../../utils/apiSalud";
import useFormulario from "../../../utils/useFormulario";
import {
    aFormulario,
    crearMedicamento,
    editarMedicamento,
    FORMULARIO_VACIO,
    validarMedicamento,
} from "../controllerProductosEnInventario";
import MedicamentoForm from "./MedicamentoForm";

const FORM_ID = "form-medicamento";

// Alta de un medicamento en la campaña o, si llega `medicamento`, edición de ese medicamento.
export default function MedicamentoModal({ token, campania, medicamento, onClose, onGuardado }) {
    const editando = Boolean(medicamento);
    const { valores, errores, cambiar, guardando, enviar } = useFormulario(
        editando ? aFormulario(medicamento) : FORMULARIO_VACIO,
        validarMedicamento
    );

    const guardar = async (formulario) => {
        try {
            if (editando) await editarMedicamento(medicamento.id, formulario, token);
            else await crearMedicamento(formulario, campania.id, token);

            onGuardado();
            onClose();
            Swal.fire(
                "¡Éxito!",
                editando ? "Se actualizó el medicamento" : `Se registró "${formulario.nombre.trim()}" en la campaña`,
                "success"
            );
        } catch (error) {
            console.error(error);
            Swal.fire("Error", mensajeDeError(error, `Ha ocurrido un error al ${editando ? "editar" : "crear"} el medicamento`), "error");
        }
    };

    return (
        <ModalBase
            title={editando ? "Editar medicamento" : "Nuevo medicamento"}
            onClose={onClose}
            maxWidth="max-w-xl"
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
                        {guardando ? "Guardando..." : editando ? "Guardar cambios" : "Registrar"}
                    </button>
                </>
            }
        >
            <form id={FORM_ID} onSubmit={enviar(guardar)} className="space-y-4">
                <CampaniaActivaBanner campania={campania} />
                <MedicamentoForm id="medicamento" valores={valores} errores={errores} onChange={cambiar} />
            </form>
        </ModalBase>
    );
}
