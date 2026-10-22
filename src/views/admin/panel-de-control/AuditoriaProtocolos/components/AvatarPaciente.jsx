import { useState } from "react";

// Foto del paciente; si no tiene o no carga, se muestran sus iniciales.
export default function AvatarPaciente({ url, iniciales }) {
    const [fallo, setFallo] = useState(false);
    const caja = "h-14 w-14 flex-shrink-0 rounded-full";

    return url && !fallo ? (
        <img src={url} alt="" onError={() => setFallo(true)} className={`${caja} border border-gray-200 object-cover`} />
    ) : (
        <div aria-hidden="true" className={`${caja} flex items-center justify-center bg-blue-100 text-xl font-bold text-blue-800`}>
            {iniciales || "?"}
        </div>
    );
}
