import { getFetch } from "../../getFetch/getFetch";
import Triaje from "../../SistemaOcupacional/Triaje/Triaje";
import { GetListTriajeMult } from "../../SistemaOcupacional/Triaje/Controller";
import EKG from "../../SistemaOcupacional/EKG/ekg";
import { PrintHojaR as imprimirEKG, TABLA_EKG } from "../../SistemaOcupacional/EKG/controllerEKG";
import CertificadoAlturaPoderosa from "../../SistemaOcupacional/Poderosa/CertificadoAlturaPoderosa/CertificadoAlturaPoderosa"; 
import LaboratorioClinico from "../../SistemaOcupacional/Laboratorio/LaboratorioClinico/HematologiaBioquimicaECO/HematologiaBioquimicaECO";
import {
    PrintHojaR as imprimirLaboratorioClinico,
    TABLA_LAB_CLINICO,
} from "../../SistemaOcupacional/Laboratorio/LaboratorioClinico/HematologiaBioquimicaECO/controllerHematologiaBioquimicaECO";
import Anexo16A from "../../SistemaOcupacional/Anexo16A/Anexo16A";
import { PrintHojaR as imprimirAnexo16A, TABLA_ANEXO16A } from "../../SistemaOcupacional/Anexo16A/Anexo16AController";
import Anexo16 from "../../SistemaOcupacional/Anexo16/Anexo16";
import { PrintHojaR as imprimirAnexo16, TABLA_ANEXO16 } from "../../SistemaOcupacional/Anexo16/controllerAnexo16";
import FichaAptitudAnexo16 from "../../SistemaOcupacional/FichasAptitud/FichaAptitudAnexo16/FichaAptitudAnexo16";
import {
    PrintHojaR as imprimirFichaAptitudAnexo16,
    TABLA_FICHA_APTITUD_ANEXO16,
} from "../../SistemaOcupacional/FichasAptitud/FichaAptitudAnexo16/controllerFichaAptitudAnexo16";
import AlturaPsicologica from "../../SistemaOcupacional/ModuloPsicologia/ExamenesComplementarios/AlturaPsicologica/AlturaPsicologica";
import {
    PrintHojaR as imprimirAlturaPsicologica,
    TABLA_ALTURA_PSICOLOGICA,
} from "../../SistemaOcupacional/ModuloPsicologia/ExamenesComplementarios/AlturaPsicologica/controllerAlturaPsicologica";
import Oftalmologia from "../../SistemaOcupacional/Oftalmologia/Oftalmologia/Oftalmologia";
import {
    PrintHojaR as imprimirOftalmologia,
    TABLA_OFTALMOLOGIA,
} from "../../SistemaOcupacional/Oftalmologia/Oftalmologia/controllerOftalmologia";
import Audiometria from "../../SistemaOcupacional/Audiometria/Audiometria/Audiometria";
import {
    PrintHojaR as imprimirAudiometria,
    TABLA_AUDIOMETRIA,
} from "../../SistemaOcupacional/Audiometria/Audiometria/controllerAudiometria";
import AudiometriaCuestionario from "../../SistemaOcupacional/Audiometria/AudiometriaCuestionario/AudiometriaCuestionarioConEstado";
import {
    PrintHojaR as imprimirCuestionarioAudiometria,
    TABLA_CUESTIONARIO_AUDIOMETRIA,
} from "../../SistemaOcupacional/Audiometria/AudiometriaCuestionario/controllerAudiometriaCuestionario";
import Espirometria from "../../SistemaOcupacional/Espirometria/Espirometria";
import {
    PrintHojaR as imprimirEspirometria,
    TABLA_ESPIROMETRIA,
} from "../../SistemaOcupacional/Espirometria/controllerEspirometria";
import PerfilLipidico from "../../SistemaOcupacional/Laboratorio/AnalisisBioquimicos/PerfilLipidico/PerfilLipidico";
import {
    PrintHojaR as imprimirPerfilLipidico,
    TABLA_PERFIL_LIPIDICO,
} from "../../SistemaOcupacional/Laboratorio/AnalisisBioquimicos/PerfilLipidico/controllerPerfilLipidico";
import Panel2D from "../../SistemaOcupacional/Laboratorio/Toxicologia/Panel2D/Panel2D";
import {
    PrintHojaR as imprimirPanel2D,
    TABLA_PANEL_2D,
} from "../../SistemaOcupacional/Laboratorio/Toxicologia/Panel2D/controllerPanel2D";
import CuestionarioNordico from "../../SistemaOcupacional/Cuestionario_Nordico/Cuestionario_Nordico";
import {
    PrintHojaR as imprimirCuestionarioNordico,
    TABLA_CUESTIONARIO_NORDICO,
} from "../../SistemaOcupacional/Cuestionario_Nordico/ControllerCN";
import ConsentimientoPanel2D from "../../SistemaOcupacional/Laboratorio/Consentimientos/Panel2D/Panel2D";
import {
    PrintHojaR as imprimirConsentimientoPanel2D,
} from "../../SistemaOcupacional/Laboratorio/Consentimientos/Panel2D/controllerPanel2D";
import RayosXToraxPA from "../../SistemaOcupacional/RayosX/rayosXToraxPA/RayosXToraxPA";
import {
    PrintHojaR as imprimirRayosXToraxPA,
    TABLA_RAYOS_X_TORAX_PA,
} from "../../SistemaOcupacional/RayosX/rayosXToraxPA/controllerRayoxXToraxPA";
import EvaluacionMusculoEsqueletica from "../../SistemaOcupacional/Musculoesqueletico/EvaluacionMusculoEsqueletica/EvaluacionMusculoEsqueletica";
import {
    PrintHojaR as imprimirEvaluacionMusculoEsqueletica,
    TABLA_EVALUACION_NORMAL,
} from "../../SistemaOcupacional/Musculoesqueletico/EvaluacionMusculoEsqueletica/controllerEvaluacionMusculoEsqueletica";
import EvaluacionMusculoEsqueletica2021 from "../../SistemaOcupacional/Musculoesqueletico/EvaluacionMusculoEsqueletica2021/EvaluacionMusculoEsqueletica2021";
import {
    PrintHojaR as imprimirEvaluacionMusculoEsqueletica2021,
    TABLA_EVALUACION_2021,
} from "../../SistemaOcupacional/Musculoesqueletico/EvaluacionMusculoEsqueletica2021/controllerEvaluacionMusculoEsqueletica2021";
import OIT from "../../SistemaOcupacional/OIT/OIT";
import { PrintHojaR as imprimirOIT, TABLA_OIT } from "../../SistemaOcupacional/OIT/controller/OIT_controller";
import Odontologia from "../../SistemaOcupacional/Odontologia/Odontologia";
import {
    PrintHojaR as imprimirOdontologia,
    TABLA_ODONTOLOGIA,
} from "../../SistemaOcupacional/Odontologia/controllerOdontologia";
import FichaCertificadoAltura from "../../SistemaOcupacional/FichaCertificadoAltura/FichaCertificadoAltura";
import {
    PrintHojaR as imprimirFichaCertificadoAltura,
    TABLA_FICHA_CERTIFICADO_ALTURA,
} from "../../SistemaOcupacional/FichaCertificadoAltura/controllerFichaCertificadoAltura";
import TrabajosEspecificos from "../../SistemaOcupacional/ModuloPsicologia/ExamenesComplementarios2/TrabajosEspecificos/TrabajosEspecificos";
import {
    PrintHojaR as imprimirTrabajosEspecificos,
    TABLA_TRABAJOS_ESPECIFICOS,
} from "../../SistemaOcupacional/ModuloPsicologia/ExamenesComplementarios2/TrabajosEspecificos/controllerTrabajosEspecificos";
import TestFatiga from "../../SistemaOcupacional/TestFatiga/TestFatiga_Somn";
import {
    PrintHojaR as imprimirTestFatiga,
    TABLA_TEST_FATIGA_SOMNOLENCIA,
} from "../../SistemaOcupacional/TestFatiga/ControllerTestF";
import FichaSas from "../../SistemaOcupacional/FichaSAS/FichaSas";
import { PrintHojaR as imprimirFichaSas, TABLA_FICHA_SAS } from "../../SistemaOcupacional/FichaSAS/controllerFichaSas";
import InformePsicologico from "../../SistemaOcupacional/ModuloPsicologia/AnexosPsicologia/InformePsicologico/InformePsicologico";
import {
    PrintHojaR as imprimirInformePsicologico,
    TABLA_INFORME_PSICOLOGICO,
} from "../../SistemaOcupacional/ModuloPsicologia/AnexosPsicologia/InformePsicologico/controllerInformePsicologico";
import Brigadista from "../../SistemaOcupacional/ModuloPsicologia/ExamenesComplementarios2/Brigadista/Brigadista";
import {
    PrintHojaR as imprimirBrigadista,
    TABLA_BRIGADISTA,
} from "../../SistemaOcupacional/ModuloPsicologia/ExamenesComplementarios2/Brigadista/controllerBrigadista";
import Altura18 from "../../SistemaOcupacional/Altura18/Altura18";
import { PrintHojaR as imprimirAltura18, TABLA_ALTURA_18 } from "../../SistemaOcupacional/Altura18/controllerAltura18";

// Altura 1.8 (certificación médica de altura, tabla `certificacion_medica_altura`). Se abre por su propia clave y
// también desde el examen de la hoja llamado "Ficha certificado de trabajos en altura" (ver `b_certificado_altura`).
const ALTURA_18 = {
    titulo: "Ficha Certificado de Trabajos en Altura (Altura 1.8)",
    Formulario: Altura18,
    verReporte: (orden, token, datosFooter) => imprimirAltura18(orden, token, TABLA_ALTURA_18, datosFooter),
};
const esFichaCertificadoTrabajosAltura = (examen) => /ficha.*certificado.*altura/i.test(examen.nombre ?? "");

// Qué abre cada examen del protocolo según su `referenciaNp` (= nameService/tabla del formulario); los que no estén
// aquí aún no son clicables.
//  - Formulario: recibe `nOrdenInicial` (carga esa orden) y `onGuardado` (se llama al registrar el examen).
//  - verReporte(orden, token, datosFooter): abre el reporte del examen ya realizado.
//  - Si una misma clave debe abrir distinto según el nombre del examen, lleva una lista de candidatos y se elige el
//    primero cuyo `coincide(examen)` sea verdadero (o que no lo tenga).
const FORMULARIOS = {
    triaje: {
        titulo: "Triaje",
        Formulario: Triaje,
        verReporte: (orden, token) => GetListTriajeMult(orden, null, getFetch, token, true),
    },
    informe_electrocardiograma: {
        titulo: "Electrocardiograma",
        Formulario: EKG,
        verReporte: (orden, token, datosFooter) => imprimirEKG(orden, token, TABLA_EKG, datosFooter),
    }, 
    lab_clinico: {
        titulo: "Laboratorio Clínico",
        Formulario: LaboratorioClinico,
        verReporte: (orden, token) => imprimirLaboratorioClinico(orden, token, TABLA_LAB_CLINICO),
    },
    anexo16a: {
        titulo: "Anexo 16A",
        Formulario: Anexo16A,
        verReporte: (orden, token, datosFooter) => imprimirAnexo16A(orden, token, TABLA_ANEXO16A, datosFooter),
    },
    oftalmologia2021: {
        titulo: "Oftalmología",
        Formulario: Oftalmologia,
        verReporte: (orden, token) => imprimirOftalmologia(orden, token, TABLA_OFTALMOLOGIA),
    },
    anexo7c: {
        titulo: "Ficha Anexo 16",
        Formulario: Anexo16,
        verReporte: (orden, token, datosFooter) => imprimirAnexo16(orden, token, TABLA_ANEXO16, datosFooter),
    },
    certificado_aptitud_medico_ocupacional: {
        titulo: "Ficha de Aptitud 16",
        Formulario: FichaAptitudAnexo16,
        verReporte: (orden, token, datosFooter) =>
            imprimirFichaAptitudAnexo16(orden, token, TABLA_FICHA_APTITUD_ANEXO16, datosFooter),
    },
    // Ficha Certificado de Altura (SistemaOcupacional/FichaCertificadoAltura), tabla `b_certificado_altura`. El examen de
    // la hoja llamado "Ficha certificado de trabajos en altura" abre Altura 1.8 (pedido del usuario), así que si llega
    // con esta clave se elige por su nombre; los demás exámenes con esta clave abren la Ficha.
    b_certificado_altura: [
        { ...ALTURA_18, coincide: esFichaCertificadoTrabajosAltura },
        {
            titulo: "Ficha Certificado de Trabajos en Altura",
            Formulario: FichaCertificadoAltura,
            verReporte: (orden, token, datosFooter) =>
                imprimirFichaCertificadoAltura(orden, token, TABLA_FICHA_CERTIFICADO_ALTURA, datosFooter),
        },
    ],
    // Altura 1.8 por su propia tabla (si la hoja manda "Ficha certificado de trabajos en altura" con esta clave).
    certificacion_medica_altura: ALTURA_18,
    // Formato Altura Psicológica (ModuloPsicologia/ExamenesComplementarios/AlturaPsicologica), tabla `psicologiafobias`.
    psicologiafobias: {
        titulo: "Formato Altura Psicológica",
        Formulario: AlturaPsicologica,
        verReporte: (orden, token, datosFooter) =>
            imprimirAlturaPsicologica(orden, token, TABLA_ALTURA_PSICOLOGICA, datosFooter),
    },
    audiometria_2023: {
        titulo: "Audiometría",
        Formulario: Audiometria,
        verReporte: (orden, token, datosFooter) => imprimirAudiometria(orden, token, TABLA_AUDIOMETRIA, datosFooter),
    },
    cuestionario_audiometria: {
        titulo: "Cuestionario de Audiometría",
        Formulario: AudiometriaCuestionario,
        verReporte: (orden, token) => imprimirCuestionarioAudiometria(orden, token, TABLA_CUESTIONARIO_AUDIOMETRIA),
    },
    funcion_abs: {
        titulo: "Espirometría",
        Formulario: Espirometria,
        verReporte: (orden, token) => imprimirEspirometria(orden, token, TABLA_ESPIROMETRIA),
    },
    analisis_bioquimicos: {
        titulo: "Perfil Lipídico",
        Formulario: PerfilLipidico,
        verReporte: (orden, token) => imprimirPerfilLipidico(orden, token, TABLA_PERFIL_LIPIDICO),
    },
    panel2d: {
        titulo: "Panel 2D",
        Formulario: Panel2D,
        verReporte: (orden, token, datosFooter) => imprimirPanel2D(orden, token, TABLA_PANEL_2D, datosFooter),
    },
    cuestionario_nordico: {
        titulo: "Cuestionario Nórdico",
        Formulario: CuestionarioNordico,
        verReporte: (orden, token) => imprimirCuestionarioNordico(orden, token, TABLA_CUESTIONARIO_NORDICO),
    },
    // El nameService del consentimiento es "con_panel2D": la clave va en minúsculas porque `formularioDe` normaliza.
    con_panel2d: {
        titulo: "Consentimiento Panel 2D",
        Formulario: ConsentimientoPanel2D,
        // Este PrintHojaR recibe el formulario (solo lee su `norden`), no la orden suelta.
        verReporte: (orden, token) => imprimirConsentimientoPanel2D({ norden: orden }, token),
    },
    radiografia_torax: {
        titulo: "Rayos X Tórax PA",
        Formulario: RayosXToraxPA,
        verReporte: (orden, token, datosFooter) =>
            imprimirRayosXToraxPA(orden, token, TABLA_RAYOS_X_TORAX_PA, datosFooter),
    },
    // Evaluación Músculo Esquelética: la normal y la BOORO (2021) son formularios distintos de un mismo examen;
    // si la hoja usa otra clave para alguna de las dos, solo hay que cambiarla aquí.
    evaluacion_musculo_esqueletica: {
        titulo: "Evaluación Músculo Esquelética",
        Formulario: EvaluacionMusculoEsqueletica,
        verReporte: (orden, token, datosFooter) =>
            imprimirEvaluacionMusculoEsqueletica(orden, token, TABLA_EVALUACION_NORMAL, datosFooter),
    },
    evaluacion_musculo_esqueletica2021: {
        titulo: "Evaluación Músculo Esquelética BOORO",
        Formulario: EvaluacionMusculoEsqueletica2021,
        verReporte: (orden, token, datosFooter) =>
            imprimirEvaluacionMusculoEsqueletica2021(orden, token, TABLA_EVALUACION_2021, datosFooter),
    },
    oit: {
        titulo: "OIT",
        Formulario: OIT,
        verReporte: (orden, token) => imprimirOIT(orden, token, TABLA_OIT),
    },
    odontograma: {
        titulo: "Odontología",
        Formulario: Odontologia,
        verReporte: (orden, token, datosFooter) => imprimirOdontologia(orden, token, TABLA_ODONTOLOGIA, datosFooter),
    },
    especificos: {
        titulo: "Trabajos Específicos",
        Formulario: TrabajosEspecificos,
        verReporte: (orden, token, datosFooter) =>
            imprimirTrabajosEspecificos(orden, token, TABLA_TRABAJOS_ESPECIFICOS, datosFooter),
    },
    test_fatiga_somnolencia: {
        titulo: "Test de Fatiga y Somnolencia",
        Formulario: TestFatiga,
        verReporte: (orden, token, datosFooter) =>
            imprimirTestFatiga(orden, token, TABLA_TEST_FATIGA_SOMNOLENCIA, datosFooter),
    },
    ficha_sas: {
        titulo: "Ficha S.A.S.",
        Formulario: FichaSas,
        verReporte: (orden, token, datosFooter) => imprimirFichaSas(orden, token, TABLA_FICHA_SAS, datosFooter),
    },
    informe_psicologico: {
        titulo: "Informe Psicológico Completo",
        Formulario: InformePsicologico,
        verReporte: (orden, token, datosFooter) =>
            imprimirInformePsicologico(orden, token, TABLA_INFORME_PSICOLOGICO, datosFooter),
    },
    psi_brigadistas: {
        titulo: "Brigadista",
        Formulario: Brigadista,
        verReporte: (orden, token, datosFooter) => imprimirBrigadista(orden, token, TABLA_BRIGADISTA, datosFooter),
    },
};

// El backend puede mandar el `referenciaNp` con otras mayúsculas o con espacios sobrantes: se compara normalizado.
const claveDe = (examen) => String(examen.referenciaNp ?? "").trim().toLowerCase();

const entradaDe = (entrada, examen) =>
    Array.isArray(entrada) ? entrada.find((candidato) => !candidato.coincide || candidato.coincide(examen)) : entrada;

export const formularioDe = (examen) => {
    const clave = claveDe(examen);
    return Object.hasOwn(FORMULARIOS, clave) ? entradaDe(FORMULARIOS[clave], examen) : undefined;
};
