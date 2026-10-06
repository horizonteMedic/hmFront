import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import InputTextOneLine from "../../../../components/reusableComponents/InputTextOneLine";
import { useForm } from "../../../../hooks/useForm";
import { getToday } from "../../../../utils/helpers";
import ModalBase from "../components/ModalBase";
import ImageUploadField from "../components/ImageUploadField";
import { mensajeDeError } from "../utils/apiSalud";
import { crearCampania, subirImagenEmpresa } from "./controllerCampanias";

const FORM_ID = "form-registro-campania";

const CAMPOS_REQUERIDOS = {
    codigo: "Ingresa el código de la campaña",
    nombre: "Ingresa el nombre de la campaña",
    fechaCampania: "Selecciona la fecha de la campaña",
};

// { campo: mensaje } solo con los campos requeridos que están vacíos
const validar = (form) =>
    Object.fromEntries(Object.entries(CAMPOS_REQUERIDOS).filter(([campo]) => !form[campo].trim()));

const Campo = (props) => <InputTextOneLine labelOnTop {...props} />;

export default function ModalRegistroCampania({ token, usuario, onClose, onGuardado }) {
    const { form, handleChange, handleChangeSimple } = useForm({
        codigo: "",
        nombre: "",
        fechaCampania: getToday(),
        empresa: "",
    });
    const [archivo, setArchivo] = useState(null);
    const [intentado, setIntentado] = useState(false);
    const [guardando, setGuardando] = useState(false);
    // Foto ya subida ({ archivo, id }): si el alta falla (p. ej. código repetido) y se reintenta,
    // se reutiliza en vez de subir la misma imagen otra vez.
    const imagenSubida = useRef(null);

    // Los errores solo se muestran tras el primer intento y se actualizan mientras se corrige
    const errores = intentado ? validar(form) : {};

    useEffect(() => {
        document.getElementById("codigo")?.focus();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIntentado(true);
        if (Object.keys(validar(form)).length) return;

        setGuardando(true);
        try {
            let imagenEmpresaId = null;
            if (archivo) {
                if (imagenSubida.current?.archivo !== archivo) {
                    const imagen = await subirImagenEmpresa(
                        { archivo, nombre: form.nombre.trim(), empresa: form.empresa.trim() },
                        token,
                        usuario
                    );
                    imagenSubida.current = { archivo, id: imagen.id };
                }
                imagenEmpresaId = imagenSubida.current.id;
            }

            const campania = await crearCampania({ ...form, imagenEmpresaId }, token, usuario);
            onGuardado();
            onClose();
            Swal.fire("Éxito", `Campaña "${campania.nombre ?? form.nombre.trim()}" registrada correctamente`, "success");
        } catch (error) {
            console.error(error);
            Swal.fire("Error", mensajeDeError(error, "Ocurrió un error al registrar la campaña"), "error");
        } finally {
            setGuardando(false);
        }
    };

    return (
        <ModalBase
            title="Nueva campaña"
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
                        className="flex items-center gap-2 rounded bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        <FontAwesomeIcon icon={faCheck} />
                        {guardando ? "Guardando..." : "Registrar"}
                    </button>
                </>
            }
        >
            <form id={FORM_ID} onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Campo label="Código" name="codigo" value={form.codigo} onChange={handleChange} required error={errores.codigo} />
                <Campo label="Fecha" name="fechaCampania" type="date" value={form.fechaCampania} onChange={handleChangeSimple} required error={errores.fechaCampania} />
                <Campo className="sm:col-span-2" label="Nombre" name="nombre" value={form.nombre} onChange={handleChangeSimple} required error={errores.nombre} />
                <Campo className="sm:col-span-2" label="Empresa (opcional)" name="empresa" value={form.empresa} onChange={handleChangeSimple} />
                <div className="sm:col-span-2">
                    <ImageUploadField
                        label="Foto de la campaña (opcional)"
                        hint="Logo que se mostrará en la campaña y en el ticket de la visita."
                        file={archivo}
                        onChange={setArchivo}
                    />
                </div>
            </form>
        </ModalBase>
    );
}
