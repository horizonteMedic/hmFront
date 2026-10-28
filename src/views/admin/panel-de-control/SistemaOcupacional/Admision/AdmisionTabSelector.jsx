import { useState } from "react";
import TabSelector from "../../../../components/reusableComponents/TabSelector";
import RegistroClientes from "./RegistroClientes";
import AperturaExamenesPreOcup from "./AperturaExamenes/PreOcup/AperturaExamenesPreOcup";
import AperturaExamenesLaArena from "./AperturaExamenes/LaArena/AperturaExamenesLaArena";
import ConsentimientoDigitalizacion from "./ConsentimientoDigitalizacion/ConsentimientoDigitalizacion";
import ReservaPacientes from "./ReservaPacientes";

const VISTA = "Admision";
const TAB_APERTURA = 1;

// Pestañas de Admisión. A diferencia de los demás módulos, sus permisos no son vistas sueltas sino permisos dentro de
// la vista "Admision" (tienePermisoEnVista): aquí se adaptan al `tieneVista` que espera TabSelector. Registro de
// Pacientes no pide permiso (sin `permission`).
export default function AdmisionTabSelector({
    tienePermisoEnVista,
    listasRegistro,
    listas,
    selectedSede,
    token,
    userlogued,
    DNIG,
    ChangeDNI,
}) {
    const [activeTab, setActiveTab] = useState(0);

    const tieneVista = (permiso) => !permiso || tienePermisoEnVista(VISTA, permiso);

    // Las dos aperturas comparten el DNI que viene del Registro de Pacientes (DNIG)
    const propsApertura = { listas, DNIG, selectedSede, token, userlogued, ChangeDNI };

    const tabsConfig = [
        {
            id: 0,
            label: "Registro de Pacientes",
            component: RegistroClientes,
            // Al registrar un paciente se salta a la apertura de exámenes con su DNI
            props: { listas: listasRegistro, selectedSede, token, ChangeDNI, tabHC: () => setActiveTab(TAB_APERTURA) },
        },
        {
            id: TAB_APERTURA,
            permission: "Acceso a Examenes Pre",
            label: "Apertura Exámenes",
            component: AperturaExamenesPreOcup,
            props: { ...propsApertura, tienePermisoEnVista },
        },
        {
            id: 2,
            permission: "Acceso a Examenes Pre",
            label: "Apertura Exámenes La Arena",
            component: AperturaExamenesLaArena,
            props: propsApertura,
        },
        {
            id: 3,
            permission: "Acceso Consentimiento de Digitalizacion",
            label: "Consentimiento Digitalización",
            component: ConsentimientoDigitalizacion,
        },
        {
            id: 4,
            permission: "Acceso Reserva de Pacientes",
            label: "Reserva de Pacientes",
            component: ReservaPacientes,
            props: { token, userlogued },
        },
    ];

    return (
        <TabSelector
            tieneVista={tieneVista}
            tabsConfig={tabsConfig}
            activeTab={activeTab}
            onTabChange={setActiveTab}
        />
    );
}
