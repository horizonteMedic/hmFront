import { useEffect } from "react";
import Swal from "sweetalert2";

function useAppVersionChecker(intervalMs = 60000) {
    useEffect(() => {
        let currentVersion = localStorage.getItem("app_version") || null;

        // Función para borrar todas las cookies
        const clearAllCookies = () => {
            const cookies = document.cookie.split(";");
            
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i];
                const eqPos = cookie.indexOf("=");
                const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
                
                // Borrar cookie para el dominio actual
                document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;`;
                
                // También intentar borrar para subdominios
                const domain = window.location.hostname;
                const domainParts = domain.split('.');
                if (domainParts.length > 1) {
                    // Intentar borrar para el dominio base (ej: .example.com)
                    const baseDomain = '.' + domainParts.slice(-2).join('.');
                    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${baseDomain};`;
                }
            }
            
            console.log("Cookies antiguas eliminadas");
        };

        const showUpdateAlert = async (newVersion) => {
            await Swal.fire({
                title: "Nueva versión disponible 🚀",
                text: "Se detectó una nueva versión del sistema. Debes actualizar para continuar usando la aplicación.",
                icon: "info",
                showCancelButton: false,
                showCloseButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
                confirmButtonText: "Actualizar ahora",
                confirmButtonColor: "#2563eb", // azul Tailwind 600
                backdrop: 'rgba(0,0,0,0.5)',
                didOpen: () => {
                    // Aplicar blur al backdrop manualmente
                    const backdrop = document.querySelector('.swal2-backdrop-show');
                    if (backdrop) {
                        backdrop.style.backdropFilter = 'blur(8px)';
                        backdrop.style.webkitBackdropFilter = 'blur(8px)';
                    }
                }
            });

            // Borrar cookies antiguas antes de actualizar
            clearAllCookies();
            
            // Actualizar y recargar obligatoriamente
            if (newVersion) {
                localStorage.setItem("app_version", newVersion);
            } else {
                const res = await fetch(`/version.json?_=${Date.now()}`);
                const data = await res.json();
                localStorage.setItem("app_version", data.version);
            }
            
            // Recargar la página
            window.location.reload(true);
        };

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

                // Si la versión cambió, muestra alerta OBLIGATORIA
                if (data.version !== currentVersion) {
                    await showUpdateAlert(data.version);
                }
            } catch (error) {
                console.error("Error verificando versión:", error);
            }
        };

        // Exponer función para pruebas (solo en desarrollo)
        // Usa: window.testUpdateAlert() en la consola del navegador
        if (process.env.NODE_ENV === 'development') {
            window.testUpdateAlert = () => showUpdateAlert();
        }

        checkVersion();
        const interval = setInterval(checkVersion, intervalMs);
        return () => clearInterval(interval);
    }, [intervalMs]);
}

export default useAppVersionChecker;
