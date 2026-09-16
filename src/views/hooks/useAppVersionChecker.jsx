import { useEffect } from "react";
import Swal from "sweetalert2";
import { useVersionUpdateStore } from "../../store/versionUpdate";

const GRACE_PERIOD_SECONDS = 90; // 1:30 min
const WARNING_AT_SECONDS = 20;

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

// Aplica la nueva versión y recarga la página
const performUpdate = async (newVersion) => {
    clearAllCookies();

    if (newVersion) {
        localStorage.setItem("app_version", newVersion);
    } else {
        const res = await fetch(`/version.json?_=${Date.now()}`);
        const data = await res.json();
        localStorage.setItem("app_version", data.version);
    }

    window.location.reload(true);
};

const applyBlur = () => {
    const backdrop = document.querySelector('.swal2-backdrop-show');
    if (backdrop) {
        backdrop.style.backdropFilter = 'blur(8px)';
        backdrop.style.webkitBackdropFilter = 'blur(8px)';
    }
};

function useAppVersionChecker(intervalMs = 180000) {
    useEffect(() => {
        let currentVersion = localStorage.getItem("app_version") || null;
        let countdownIntervalId = null;

        const clearCountdown = () => {
            if (countdownIntervalId) {
                clearInterval(countdownIntervalId);
                countdownIntervalId = null;
            }
            useVersionUpdateStore.getState().setCountdown({
                countdownActive: false,
                secondsLeft: GRACE_PERIOD_SECONDS,
            });
        };

        const finishWithUpdate = (newVersion) => {
            clearCountdown();
            performUpdate(newVersion);
        };

        const startGracePeriod = (newVersion) => {
            let secondsLeft = GRACE_PERIOD_SECONDS;
            let warned = false;

            useVersionUpdateStore.getState().setCountdown({
                countdownActive: true,
                secondsLeft,
                triggerImmediateUpdate: () => finishWithUpdate(newVersion),
            });

            countdownIntervalId = setInterval(() => {
                secondsLeft -= 1;
                useVersionUpdateStore.getState().setCountdown({ secondsLeft });

                if (secondsLeft === WARNING_AT_SECONDS && !warned) {
                    warned = true;
                    Swal.fire({
                        icon: "warning",
                        title: "¡Atención!",
                        text: "Faltan 20 segundos para que el sistema se actualice automáticamente.",
                        toast: true,
                        position: "top-end",
                        showConfirmButton: false,
                        timer: 4000,
                        timerProgressBar: true,
                    });
                }

                if (secondsLeft <= 0) {
                    finishWithUpdate(newVersion);
                }
            }, 1000);
        };

        const showUpdateChoiceAlert = async (newVersion) => {
            const result = await Swal.fire({
                title: "Nueva versión disponible 🚀",
                html: "Se detectó una nueva versión del sistema.<br/>¿Deseas actualizar ahora o continuar usando el sistema por <b>1:30 min</b> para guardar tus cambios antes de actualizar?",
                icon: "info",
                showCancelButton: true,
                showCloseButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
                confirmButtonText: "1. Actualizar ahora",
                cancelButtonText: "2. Usar 1:30 min para guardar cambios",
                confirmButtonColor: "#2563eb", // azul Tailwind 600
                cancelButtonColor: "#f59e0b", // ámbar Tailwind 500
                backdrop: 'rgba(0,0,0,0.5)',
                didOpen: applyBlur,
            });

            if (result.isConfirmed) {
                await finishWithUpdate(newVersion);
            } else {
                startGracePeriod(newVersion);
            }
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

                // Si la versión cambió, muestra alerta con las 2 opciones
                if (data.version !== currentVersion) {
                    await showUpdateChoiceAlert(data.version);
                }
            } catch (error) {
                console.error("Error verificando versión:", error);
            }
        };

        // Exponer función para simular/probar la detección de una nueva versión
        // (usada por el botón de prueba en el Navbar)
        useVersionUpdateStore.getState().setCountdown({
            simulateNewVersion: () => showUpdateChoiceAlert(null),
        });
        if (process.env.NODE_ENV === 'development') {
            window.testUpdateAlert = () => showUpdateChoiceAlert(null);
        }

        checkVersion();
        const interval = setInterval(checkVersion, intervalMs);
        return () => {
            clearInterval(interval);
            clearCountdown();
        };
    }, [intervalMs]);
}

export default useAppVersionChecker;
