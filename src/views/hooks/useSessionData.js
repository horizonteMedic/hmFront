import { useState, useEffect } from "react";
import { useAuthStore } from "../../store/auth";

export const useSessionData = () => {
    const { token, userlogued, datosFooter } = useAuthStore((state) => ({
        token: state.token,
        userlogued: state.userlogued,
        datosFooter: state.datosFooter
    }));

    const [selectedSede, setSelectedSede] = useState("");

    useEffect(() => {
        if (userlogued?.sedes?.length) {
            const sedeTNP = userlogued.sedes.find(
                (sede) => sede.cod_sede === "T-NP"
            );
            setSelectedSede(sedeTNP?.cod_sede ?? userlogued.sedes[0].cod_sede);
        }
    }, [userlogued]);

    return {
        token,
        userCompleto: userlogued,
        userlogued: userlogued?.sub ?? "",
        selectedSede,
        datosFooter,
    };
};
