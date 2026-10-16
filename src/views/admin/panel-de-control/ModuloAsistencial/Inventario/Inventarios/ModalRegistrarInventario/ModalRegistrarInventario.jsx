import { useEffect, useState } from "react";
import Modal from "react-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import InputTextOneLine from "../../../../../../components/reusableComponents/InputTextOneLine";
import { SelectField } from "../../../../../../components/reusableComponents/InputSelect";
import { useForm } from "../../../../../../hooks/useForm";
import { RegistrarInventario, ValidarInventario } from "../controllerInventarios";

Modal.setAppElement("#root");

export default function ModalRegistrarInventario({ isOpen, onRequestClose, inventarios, opcionesSede, sedeActual, token, usuario, onSuccess }) {
    const { form, handleChange, handleChangeSimple, handleClear } = useForm({ nombre: "", sede: sedeActual });
    const [errores, setErrores] = useState({});
    const [registrando, setRegistrando] = useState(false);

    // Cada vez que se abre el formulario empieza vacío y con la sede de la sesión.
    useEffect(() => {
        if (!isOpen) return;
        handleClear();
        setErrores({});
    }, [isOpen]);

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

    const cerrar = () => {
        if (registrando) return;
        onRequestClose();
    };

    const handleSave = async (e) => {
        e.preventDefault();

        const erroresForm = ValidarInventario(form, inventarios);
        setErrores(erroresForm);
        if (Object.keys(erroresForm).length > 0) return;

        setRegistrando(true);
        const registrado = await RegistrarInventario(form, token, usuario);
        setRegistrando(false);
        if (!registrado) return;

        onSuccess();
        onRequestClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={cerrar}
            shouldCloseOnOverlayClick={false}
            contentLabel="Registrar Inventario"
            className="outline-none"
            overlayClassName="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
        >
            <form onSubmit={handleSave} noValidate className="bg-white rounded-lg shadow-xl w-[95vw] max-w-xl max-h-[90vh] flex flex-col overflow-hidden">
                <div className="flex items-center justify-between bg-[#233245] text-white px-4 py-3">
                    <h2 className="font-bold text-lg">Registrar Inventario</h2>
                    <button type="button" onClick={cerrar} className="text-2xl leading-none" title="Cerrar">
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>

                <div className="p-4 space-y-4 overflow-y-auto">
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
                </div>

                <div className="flex justify-end gap-3 border-t border-gray-200 px-4 py-3">
                    <button
                        type="button"
                        onClick={cerrar}
                        disabled={registrando}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded transition-all duration-150 ease-out active:scale-95 disabled:opacity-60"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={registrando}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded flex items-center gap-2 transition-all duration-150 ease-out hover:shadow-lg active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        <FontAwesomeIcon icon={registrando ? faSpinner : faSave} spin={registrando} /> Registrar
                    </button>
                </div>
            </form>
        </Modal>
    );
}
