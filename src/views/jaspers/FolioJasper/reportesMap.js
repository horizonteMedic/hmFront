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
import InformeElectrocardiograma_Digitalizado from "../EKG/InformeElectrocardiograma_Digitalizado";
import OIT_Digitalizado from "../OIT/OIT_Digitalizado";
import Aptitud_medico_resumen_Digitalizado from "../CertificadoMedicoOcupacional/Aptitud_medico_resumen_Digitalizado";
import Aptitud_AgroindustrialH from "../Ficha_Anexo2/Aptitud_Agroindustrial";
import InformePsicologico_Anexo02_Nuevo from "../Anexo2/Anexo2";
import Certificacion_suficiencia_trabajos_en_altura_boro_Digitalizado from "../CertificadoAltura/Certificacion_suficiencia_trabajos_en_altura_boro_Digitalizado";
import Aptitud_Poderosa_Digitalizado from "../AptitupAlturaPoderosa/Aptitud_Poderosa_Digitalizado";
import Certificaciondeconduccion_Digitalizado from "../FichaConduccion/certificaciondeconduccion_Digitalizado_boro";
import B_FichaDetencionSAS2 from "../FichasSAS/FichaDetencionSAS_boro_Digitalizado";
import Aptitud_Licencia_Conducir_Interna_Digitalizado from "../AptitudLicenciaInterna/Aptitud_Licencia_Conducir_Interna_Digitalizado";
import Hoja_Consulta_Externa from "../HojaConsultaExterna/Hoja_Consulta_Externa";
import ConsentAdmisionDeclacionAntecePatologicos from "../ModuloConsentimientos/ConsentAdmisDeclaAntecePatolo/Consent_Admision_DeclacionAntecePatologicos";
import Consentimiento_Muestra_Sangre_Digitalizado from "../Consentimientos/Consentimiento_Muestra_Sangre_Digitalizado";
import LGonadotropina_Digitalizado from "../Inmunologia/LGonadotropina_Digitalizado";
import RAYOSXXXOFI_Digitalizado from "../RayosX/RAYOSXXXOFI_Digitalizado";
import Audiometria2021_Digitalizado from "../Audiometria/Audiometria2021-_Digitalizado_boro";
import CuestionarioAudiometria_Digitalizado from "../Audiometria/CuestionarioAudiometria/CuestionarioAudiometria_Digitalizado";
import Odontograma_Digitalizado from "../Odontologia/Odontograma_Digitalizado";
import FichaPsicologicaOcupacional_Digitalizado from "../ModuloPsicologia/FichaAnexo3/FichaPsicologicaOcupacional_Digitalizado";
import InformePsicologicoAdecoEstres_Digitalizado from "../ModuloPsicologia/InformePsicologicoADECO/InformePsicologicoAdecoEstres_Digitalizado";
// Agrega aquí todos tus reportes
export const ekgMap = {
    InformeElectrocardiograma2023,
    InformeElectrocardiograma_Digitalizado
};


export const reportesMap = {
    certificado_aptitud_medico_resumen: Aptitud_medico_resumen_Digitalizado,
    certificado_aptitud_medico_ocupacional: Aptitud_Agroindustrial,
    anexo7c: Anexo7C_Antiguo,
    //ficha aptitud anexo 2
    aptitud_medico_ocupacional_agro: Aptitud_AgroindustrialH,
    //ANEXO 02 
    anexo_agroindustrial: InformePsicologico_Anexo02_Nuevo,
    //
    antece_enfermedades_altura: GenerarDatosPaciente,
    anexo16a: Anexo16A_Digitalizado,
    //Certificado en Alutra
    b_certificado_altura: Certificacion_suficiencia_trabajos_en_altura_boro_Digitalizado,
    //Cetificado de aptitud altura poderosa
    aptitud_altura_poderosa: Aptitud_Poderosa_Digitalizado,
    //Certificado vehiculos
    b_certificado_conduccion: Certificaciondeconduccion_Digitalizado,
    //FICHA SAS 
    ficha_sas: B_FichaDetencionSAS2,
    //AptitudLicenciaConducir
    aptitud_licencia_conduciri: Aptitud_Licencia_Conducir_Interna_Digitalizado,
    //Hoja Consulta Externa
    hoja_consulta_externa: Hoja_Consulta_Externa,
    //DECLARACION ANTECEDENTES PATOLOGICOS
    DECLA_JURA_ANTECE_PERSON_FAM: ConsentAdmisionDeclacionAntecePatologicos,
    //CONSENTIMIENTO MUESTRA DE SANGER
    consent_Muestra_Sangre: Consentimiento_Muestra_Sangre_Digitalizado,
    //INMUNOLOGIA GENODOTROPINA
    lgonadotropina: LGonadotropina_Digitalizado,
    //CONST LABORATORIOS
    //RADIOGRAFIA
    radiografia: RAYOSXXXOFI_Digitalizado,
    //audiometria
    audiometria_2023: Audiometria2021_Digitalizado,
    //Cuestionario audiometria
    cuestionario_audiometria: CuestionarioAudiometria_Digitalizado,
    //INTERCONSULTA
    //ODONTOGRAMA
    odontograma: Odontograma_Digitalizado,
    //PSICOLOGIA ANEXO 3
    ficha_psicologica_anexo03: FichaPsicologicaOcupacional_Digitalizado,
    //TEST DE FATIGA
    informe_psicologico_estres: InformePsicologicoAdecoEstres_Digitalizado,



    b_uso_respiradores: UsoRespiradores,
    historia_oc_info: HistoriaOcupacional_Digitalizado,
    antecedentes_patologicos: ficha_antecedente_patologico_Digitalizado,
    cuestionario_nordico: CuestionarioNordico,
    evaluacion_musculo_esqueletica: EvaluacionMuscoloEsqueletica,
    lab_clinico: LaboratorioClinico_Digitalizado_nuevo,
    analisis_bioquimicos: AnalisisBioquimicos_Digitalizado,
    oit: OIT_Digitalizado,
    radiografia_torax: RagiografiaToraxPA_Digitalizado,
    informe_electrocardiograma: (data) => {
        switch (data?.nameJasper) {
            case "InformeElectrocardiograma2023":
                return InformeElectrocardiograma2023;

            case "InformeElectrocardiograma_Digitalizado":
                return InformeElectrocardiograma_Digitalizado;

            default:
                console.warn("⚠️ nameJasper no reconocido:", data?.nameJasper);
                return null;
        }
    },
    audiometria_po: FichaAudiologica_Digitalizado,
    informe_psicologico: InformePsicologico_Digitalizado,
    oftalmologia: Oftalmologia,
    consentimientoInformado: conInformadoOcupacional_Digitalizado
    // ...
};
