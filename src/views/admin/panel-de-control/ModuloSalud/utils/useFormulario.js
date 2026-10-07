import { useState } from "react";

// Estado de un formulario: `valores`, `errores` (solo se muestran tras el primer intento de envío y se van
// actualizando mientras se corrige) y `enviar(accion)`, que valida y ejecuta `accion(valores)`.
// `validar(valores)` devuelve { campo: mensaje } solo con los campos inválidos.
export default function useFormulario(inicial, validar) {
    const [valores, setValores] = useState(inicial);
    const [intentado, setIntentado] = useState(false);
    const [guardando, setGuardando] = useState(false);

    const errores = intentado ? validar(valores) : {};
    const cambiar = (campo, valor) => setValores((v) => ({ ...v, [campo]: valor }));

    const enviar = (accion) => async (e) => {
        e.preventDefault();
        setIntentado(true);
        if (Object.keys(validar(valores)).length) return;

        setGuardando(true);
        try {
            await accion(valores);
        } finally {
            setGuardando(false);
        }
    };

    return { valores, errores, cambiar, guardando, enviar };
}
