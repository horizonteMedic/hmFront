import TabSelector from "../../../../components/reusableComponents/TabSelector";
import ConsentimientoBuenaSalud from "./ConsentimientoBuenaSalud/ConsentimientoBuenaSalud";
import ConsentimientoInformado from "./ConsentimientoInformado/ConsentimientoInformado";
import DeclaracionJuradaAntecedentesPersonales from "./DeclaracionJuradaAntecedentesPersonales/DeclaracionJuradaAntecedentesPersonales";
import DeclaracionInformacionAptitudMedico from "./DeclaracionInformacionAptitudMedico/DeclaracionInformacionAptitudMedico";
import EvaluacionMedica from "./EvaluacionMedica/EvaluacionMedica";
import RecepcionExamenMedico from "./RecepcionExamenMedico/RecepcionExamenMedico";
import SintomaticoRespiratorio from "./SintomaticoRespiratorio/SintomaticoRespiratorio";
import SuficienciaBrigadista from "./SuficienciaBrigadista/SuficienciaBrigadista";
import ConformidadEMO from "./ConformidadEMO/ConformidadEMO";

export default function ConsentimientosTabSelector({ tieneVista }) {
    const tabsConfig = [
        {
            id: 0,
            permission: "Consentimiento Informado",
            label: "Informado",
            component: ConsentimientoInformado
        },
        {
            id: 1,
            permission: "Consentimiento Buena Salud",
            label: "Buena Salud",
            component: ConsentimientoBuenaSalud
        },
        {
            id: 2,
            permission: "Declaración Sintomático Respiratorio",
            label: "Sintomático Respiratorio",
            component: SintomaticoRespiratorio
        },
        {
            id: 3,
            permission: "Consentimiento Informado Evaluacion Medica",
            label: "Evaluacion Médica",
            component: EvaluacionMedica
        },
        {
            id: 4,
            permission: "Recepcion Examen Medico",
            label: "Recepción Examen Médico",
            component: RecepcionExamenMedico
        },
        {
            id: 5,
            permission: "Declaracion Jurada Antecedentes Personales",
            label: "Declaración Jurada Antecedentes Personales",
            component: DeclaracionJuradaAntecedentesPersonales
        },
        {
            id: 6,
            permission: "Declaracion Informacion Aptitud Medico",
            label: "Declaracion Informacion Aptitud Medico Ocupacional",
            component: DeclaracionInformacionAptitudMedico
        },
        {
            id: 7,
            permission: "Suficiencia Brigadista",
            label: "Suficiencia Brigadista",
            component: SuficienciaBrigadista
        },
        {
            id: 8,
            permission: "Conformidad EMO",
            label: "Conformidad EMO",
            component: ConformidadEMO
        },
    ];
    return (
        <TabSelector
            tieneVista={tieneVista}
            tabsConfig={tabsConfig}
        />
    );
}
