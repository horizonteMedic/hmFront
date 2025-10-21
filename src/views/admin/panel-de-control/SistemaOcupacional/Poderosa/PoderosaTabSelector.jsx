import TabSelector from "../../../../components/reusableComponents/TabSelector";
import CertificadoAptitudPoderosa from "./CertificadoAptitudPoderosa/CertificadoAptitudPoderosa";
import CertificadoTrabajosCaliente from "./CertificadoTrabajosCaliente/CertificadoTrabajosCaliente";
import LicenciaInterna from "./LicenciaInterna/LicenciaInterna";
import CertificadoAlturaPoderosa from "./CertificadoAlturaPoderosa/CertificadoAlturaPoderosa";
import HojaConsultaExterna from "./HojaConsultaExterna/HojaConsultaExterna";
import CMManipuladoresAlimentos from "./CMManipuladoresAlimentos/CMManipuladoresAlimentos";
import CAHerramientasManuales from "./CAHerramientasManuales/CAHerramientasManuales";

export default function PoderosaTabSelector({ tieneVista }) {
    const tabsConfig = [
        {
            id: 0,
            permission: "Certificado Altura Poderosa",
            label: "Certificado Altura Poderosa",
            component: CertificadoAlturaPoderosa
        },
        {
            id: 1,
            permission: "Certificado Aptitud Poderosa",
            label: "Aptitud Altura Poderosa",
            component: CertificadoAptitudPoderosa
        },
        {
            id: 2,
            permission: "Certificado Trabajos en Caliente",
            label: "Aptitud Trabajos en Caliente",
            component: CertificadoTrabajosCaliente
        },
        {
            id: 3,
            permission: "Licencia Interna",
            label: "Aptitud Licencia Interna",
            component: LicenciaInterna
        },
        {
            id: 4,
            permission: "Hoja Consulta Externa",
            label: "Hoja Consulta Externa",
            component: HojaConsultaExterna
        },
        {
            id: 5,
            permission: "Certificado Medico Manipuladores de Alimentos",
            label: "Certificado Manipuladores de Alimentos",
            component: CMManipuladoresAlimentos
        },
        {
            id: 6,
            permission: "Certificado Aptitud Para Herramientas Manuales",
            label: "Aptitud Herramientas Manuales",
            component: CAHerramientasManuales
        },
    ];
    return (
        <TabSelector
            tieneVista={tieneVista}
            tabsConfig={tabsConfig}
        />
    );
}
