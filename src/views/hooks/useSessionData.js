import { useState, useEffect } from "react";
import { useAuthStore } from "../../store/auth";
import { fixEncodingModern } from "../utils/helpers";

export const useSessionData = () => {
    const { token, userlogued, datosFooter, listaEmpleados } = useAuthStore((state) => ({
        token: state.token,
        userlogued: state.userlogued,
        datosFooter: state.datosFooter,
        listaEmpleados: state.listaEmpleados
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
        userName: fixEncodingModern(userlogued?.datos?.nombres_user?.toUpperCase() ?? ""),
        userDNI: userlogued?.datos?.dni_user ?? "",
        userCMP: userlogued?.datos?.cmp ?? "",
        userEmail: userlogued?.datos?.email ?? "",
        userDireccion: fixEncodingModern(userlogued?.datos?.direccion?.toUpperCase() ?? ""),
        userlogued: userlogued?.sub ?? "",
        selectedSede,
        datosFooter,
        listaEmpleados,
    };
};
