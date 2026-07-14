import TabSelector from "../../../../components/reusableComponents/TabSelector";
import HistoriaClinicaAdultoMayor from "./HistoriaClinicaAdultoMayor/HistoriaClinicaAdultoMayor";
import HistoriaClinicaEscolarAdolescente from "./HistoriaClinicaEscolarAdolescente/HistoriaClinicaEscolarAdolescente";
import HistoriaClinicaMujerVaronAdulto from "./HistoriaClinicaMujerVaronAdulto/HistoriaClinicaMujerVaronAdulto";
import HistoriaClinicaNinoMenor5 from "./HistoriaClinicaNinoMenor5/HistoriaClinicaNinoMenor5";

export default function AsistencialTabSelector({ tieneVista }) {
    const tabsConfig = [
        {
            id: 0,
            permission: "Historia Clinica del Nino Menor de 5",
            label: "Historia Clinica del Nino Menor de 5",
            component: HistoriaClinicaNinoMenor5
        },
        {
            id: 1,
            permission: "Historia Clinica del Escolar y Adolescente",
            label: "Historia Clinica del Escolar y Adolescente",
            component: HistoriaClinicaEscolarAdolescente
        },
        {
            id: 2,
            permission: "Historia Clinica del Varon o Mujer Adulto",
            label: "Historia Clinica del Varon o Mujer Adulto",
            component: HistoriaClinicaMujerVaronAdulto
        },
        {
            id: 3,
            permission: "Historia Clinica del Adulto Mayor",
            label: "Historia Clinica del Adulto Mayor",
            component: HistoriaClinicaAdultoMayor
        },
    ];
    return (
        <TabSelector
            tieneVista={tieneVista}
            tabsConfig={tabsConfig}
        />
    );
}
