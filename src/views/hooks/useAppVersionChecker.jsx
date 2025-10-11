import { useEffect } from "react";
import Swal from "sweetalert2";

function useAppVersionChecker(intervalMs = 60000) {
    useEffect(() => {
        let currentVersion = localStorage.getItem("app_version") || null;

        const checkVersion = async () => {
            try {
                const res = await fetch(`/version.json?_=${Date.now()}`);
                const data = await res.json();

                // Si es la primera vez, guarda la versión actual
                if (!currentVersion) {
                    currentVersion = data.version;
                    localStorage.setItem("app_version", currentVersion);
                    return;
                }

                // Si la versión cambió, muestra alerta
                if (data.version !== currentVersion) {
                    const result = await Swal.fire({
                        title: "Nueva versión disponible 🚀",
                        text: "Se detectó una nueva actualización. ¿Deseas recargar para obtener los últimos cambios?",
                        icon: "info",
                        showCancelButton: true,
                        confirmButtonText: "Sí, actualizar",
                        cancelButtonText: "Más tarde",
                        confirmButtonColor: "#2563eb", // azul Tailwind 600
                    });

                    if (result.isConfirmed) {
                        localStorage.setItem("app_version", data.version);
                        window.location.reload(true);
                    }
                }
            } catch (error) {
                console.error("Error verificando versión:", error);
            }
        };

        checkVersion();
        const interval = setInterval(checkVersion, intervalMs);
        return () => clearInterval(interval);
    }, [intervalMs]);
}

export default useAppVersionChecker;
