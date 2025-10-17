import TabSelector from "../../../../components/reusableComponents/TabSelector";
import CertificadoAptitudPoderosa from "./CertificadoAptitudPoderosa/CertificadoAptitudPoderosa";
import CertificadoTrabajosCaliente from "./CertificadoTrabajosCaliente/CertificadoTrabajosCaliente";
import LicenciaInterna from "./LicenciaInterna/LicenciaInterna";
import CertificadoAlturaPoderosa from "./CertificadoAlturaPoderosa/CertificadoAlturaPoderosa";
import HojaConsultaExterna from "./HojaConsultaExterna/HojaConsultaExterna";

export default function PoderosaTabSelector({ tieneVista }) {
    const tabsConfig = [
        {
            id: 0,
            permission: "Certificado Trabajos en Caliente",
            label: "Certificado Trabajos en Caliente",
            component: CertificadoTrabajosCaliente
        },
        {
            id: 1,
            permission: "Licencia Interna",
            label: "Licencia Interna",
            component: LicenciaInterna
        },
        {
            id: 2,
            permission: "Certificado Altura Poderosa",
            label: "Certificado Altura Poderosa",
            component: CertificadoAlturaPoderosa
        },
        {
            id: 3,
            permission: "Certificado Aptitud Poderosa",
            label: "Certificado Aptitud Poderosa",
            component: CertificadoAptitudPoderosa
        },
        {
            id: 4,
            permission: "Hoja Consulta Externa",
            label: "Hoja Consulta Externa",
            component: HojaConsultaExterna
        },
    ];
    return (
        <TabSelector
            tieneVista={tieneVista}
            tabsConfig={tabsConfig}
        />
    );
}
