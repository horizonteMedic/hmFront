import Aptitud_Agroindustrial from "../Ficha_Anexo16/Aptitud_medico_ocupacional_F";
import Anexo7C_Antiguo from "../Anexo16/Anexo7C_Boro";
import GenerarDatosPaciente from "../AntecedentesAltura/AnexoCB_Digitalizado";
import Anexo16A_Digitalizado from "../Anexo16A/Anexo16A_Digitalizado";
import UsoRespiradores from "../UsoRespiradores/UsoRespiradores";
import HistoriaOcupacional_Digitalizado from "../HistoriaOcupacional/HistoriaOcupacional_Digitalizado";
import ficha_antecedente_patologico_Digitalizado from "../AntecedentesPatologicos/ficha_antecedente_patologico_Digitalizado";
import CuestionarioNordico from "../Cuestionario_Nordico/CuestionarioNordico";
import EvaluacionMuscoloEsqueletica from "../MusculoEsqueletica/EvaluacionMuscoloEsqueletica";
import LaboratorioClinico_Digitalizado_nuevo from "../AnalisisBioquimicos/LaboratorioClinico_Digitalizado";
import AnalisisBioquimicos_Digitalizado from "../AnalisisBioquimicos/AnalisisBioquimicos_Digitalizado";
import RagiografiaToraxPA_Digitalizado from "../RayosX/RagiografiaToraxPA_Digitalizado";
import FichaAudiologica_Digitalizado from "../Audiometria/FichaAudiologica_Digitalizado";
import InformePsicologico_Digitalizado from "../ModuloPsicologia/InformePsicologico/InformePsicologico_Digitalizado";
import Oftalmologia from "../Oftalmologia/Oftalmologia";
import conInformadoOcupacional_Digitalizado from "../ConsentimientoInformado/conInformadoOcupacional_Digitalizado";
import InformeElectrocardiograma2023 from "../EKG/InformeElectrocardiograma2023";
// Agrega aquí todos tus reportes

export const reportesMap = {
    certificado_aptitud_medico_ocupacional: Aptitud_Agroindustrial,
    anexo7c: Anexo7C_Antiguo,
    antece_enfermedades_altura: GenerarDatosPaciente,
    anexo16a: Anexo16A_Digitalizado,
    b_uso_respiradores: UsoRespiradores,
    historia_oc_info: HistoriaOcupacional_Digitalizado,
    antecedentes_patologicos: ficha_antecedente_patologico_Digitalizado,
    cuestionario_nordico: CuestionarioNordico,
    evaluacion_musculo_esqueletica: EvaluacionMuscoloEsqueletica,
    lab_clinico: LaboratorioClinico_Digitalizado_nuevo,
    analisis_bioquimicos: AnalisisBioquimicos_Digitalizado,
    radiografia_torax: RagiografiaToraxPA_Digitalizado,
    informe_electrocardiograma: InformeElectrocardiograma2023,
    audiometria_po: FichaAudiologica_Digitalizado,
    informe_psicologico: InformePsicologico_Digitalizado,
    oftalmologia: Oftalmologia,
    consentimientoInformado: conInformadoOcupacional_Digitalizado
    // ...
};
