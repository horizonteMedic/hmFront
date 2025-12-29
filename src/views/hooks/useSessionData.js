import { useState, useEffect } from "react";
import { useAuthStore } from "../../store/auth";
import { fixEncodingModern } from "../utils/helpers";
import useRealTime from "./useRealTime";

export const useSessionData = () => {
    const { token, userlogued, datosFooter, listaEmpleados, selectedSede } = useAuthStore((state) => ({
        token: state.token,
        userlogued: state.userlogued,
        datosFooter: state.datosFooter,
        listaEmpleados: state.listaEmpleados,
        selectedSede: state.selectedSede
    }));

    const hora = useRealTime();

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
        hora,
    };
};
