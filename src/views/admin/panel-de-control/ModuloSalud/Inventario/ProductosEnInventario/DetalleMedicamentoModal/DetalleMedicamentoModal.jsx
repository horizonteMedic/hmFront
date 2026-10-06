import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import ModalBase from "../../../components/ModalBase";
import { getMedicamento } from "../controllerProductosEnInventario";

const Campo = ({ label, value }) => {
    const vacio = value === undefined || value === null || value === "";
    return (
        <div>
            <span className="block text-xs font-medium uppercase tracking-wider text-gray-500">{label}</span>
            <span className="block break-words text-gray-800">{vacio ? "-" : value}</span>
        </div>
    );
};

// Detalle de solo lectura del medicamento; «Editar» abre el formulario de edición (onEditar).
export default function DetalleMedicamentoModal({ id, token, onClose, onEditar }) {
    const [medicamento, setMedicamento] = useState(null);
    const [fallo, setFallo] = useState(false);

    useEffect(() => {
        let vigente = true;
        getMedicamento(id, token)
            .then((detalle) => vigente && setMedicamento(detalle))
            .catch((error) => {
                console.error(error);
                if (vigente) setFallo(true);
            });
        return () => {
            vigente = false;
        };
    }, [id, token]);

    return (
        <ModalBase
            title="Detalle del medicamento"
            onClose={onClose}
            footer={
                <>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded border border-gray-300 bg-white px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                    >
                        Cerrar
                    </button>
                    {medicamento && (
                        <button
                            type="button"
                            onClick={() => onEditar(medicamento)}
                            className="azul-btn flex items-center gap-2 rounded px-5 py-2 text-sm font-semibold"
                        >
                            <FontAwesomeIcon icon={faPen} /> Editar
                        </button>
                    )}
                </>
            }
        >
            {medicamento ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                        <Campo label="Nombre" value={medicamento.nombre} />
                    </div>
                    <Campo label="Presentación" value={medicamento.presentacion} />
                    <Campo label="Uso" value={medicamento.uso} />
                    <Campo label="Laboratorio" value={medicamento.laboratorio} />
                    <Campo label="Marca" value={medicamento.marca} />
                    <Campo label="Unidad de medida" value={medicamento.unidadMedida} />
                    <Campo label="Stock mínimo" value={medicamento.stockMinimo} />
                    {medicamento.stockActual !== undefined && <Campo label="Stock actual" value={medicamento.stockActual} />}
                </div>
            ) : (
                <p className={`text-center ${fallo ? "text-red-500" : "text-gray-500"}`}>
                    {fallo ? "No se pudo cargar el detalle del medicamento." : "Cargando..."}
                </p>
            )}
        </ModalBase>
    );
}
