import Swal from "sweetalert2";
import {
    GetInfoPacDefault,
    GetInfoServicioDefault,
    LoadingDefault,
    PrintHojaRDefault,
    SubmitDataServiceDefault,
    VerifyTRDefault,
} from "../../../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../../../utils/formatDateUtils";

const obtenerReporteUrl =
    "/api/v01/ct/cuestionarioCalidadSueno/obtenerReporteCalidadSueno";
const registrarUrl =
    "/api/v01/ct/cuestionarioCalidadSueno/registrarActualizarCalidadSueno";

export const GetInfoServicio = async (
    nro,
    tabla,
    set,
    token,
    onFinish = () => { }
) => {
    const res = await GetInfoServicioDefault(
        nro,
        tabla,
        token,
        obtenerReporteUrl,
        onFinish
    );
    if (res) {
        set((prev) => ({
            ...prev,
            norden: res.norden ?? "",
            fechaExam: res.fecha,
            nombreExamen: res.nombreExamen ?? "",

            // Datos personales
            dni: res.dniPaciente ?? "",
            nombres: `${res.nombresPaciente ?? ""} ${res.apellidosPaciente ?? ""}`,
            fechaNacimiento: formatearFechaCorta(res.fechaNacimientoPaciente ?? ""),
            lugarNacimiento: res.lugarNacimientoPaciente ?? "",
            edad: res.edadPaciente ?? "",
            sexo: res.sexoPaciente === "M" ? "MASCULINO" : "FEMENINO",
            estadoCivil: res.estadoCivilPaciente,
            nivelEstudios: res.nivelEstudioPaciente,

            // Datos Laborales
            empresa: res.empresa ?? "",
            contrata: res.contrata ?? "",
            ocupacion: res.ocupacionPaciente ?? "",
            cargoDesempenar: res.cargoPaciente ?? "",

            // ====================== PARTE I ======================
            horaAcostarse: res.pregunta1 ?? "",
            tiempoDormir: res.pregunta2A ? "MENOS_15" :
                res.pregunta2B ? "ENTRE_16_30" :
                    res.pregunta2C ? "ENTRE_31_60" :
                        res.pregunta2D ? "MAS_60" : "",
            horaLevantarse: res.pregunta3 ?? "",
            horasDormidas: res.pregunta4 ?? "",

            // ====================== PARTE II ======================
            probPrimeraHora: res.pregunta5ANingunaVez ? "NUNCA" :
                res.pregunta5AMenosUnaVez ? "MENOS_SEMANA" :
                    res.pregunta5AUnaDosVeces ? "UNO_DOS_SEMANA" :
                        res.pregunta5ATresVeces ? "TRES_SEMANA" : "",

            probDespertoNoche: res.pregunta5BNingunaVez ? "NUNCA" :
                res.pregunta5BMenosUnaVez ? "MENOS_SEMANA" :
                    res.pregunta5BUnaDosVeces ? "UNO_DOS_SEMANA" :
                        res.pregunta5BTresVeces ? "TRES_SEMANA" : "",

            probLevantarseBano: res.pregunta5CNingunaVez ? "NUNCA" :
                res.pregunta5CMenosUnaVez ? "MENOS_SEMANA" :
                    res.pregunta5CUnaDosVeces ? "UNO_DOS_SEMANA" :
                        res.pregunta5CTresVeces ? "TRES_SEMANA" : "",

            probNoRespirarBien: res.pregunta5DNingunaVez ? "NUNCA" :
                res.pregunta5DMenosUnaVez ? "MENOS_SEMANA" :
                    res.pregunta5DUnaDosVeces ? "UNO_DOS_SEMANA" :
                        res.pregunta5DTresVeces ? "TRES_SEMANA" : "",

            probTosiaRonca: res.pregunta5ENingunaVez ? "NUNCA" :
                res.pregunta5EMenosUnaVez ? "MENOS_SEMANA" :
                    res.pregunta5EUnaDosVeces ? "UNO_DOS_SEMANA" :
                        res.pregunta5ETresVeces ? "TRES_SEMANA" : "",

            probSentiaFrio: res.pregunta5FNingunaVez ? "NUNCA" :
                res.pregunta5FMenosUnaVez ? "MENOS_SEMANA" :
                    res.pregunta5FUnaDosVeces ? "UNO_DOS_SEMANA" :
                        res.pregunta5FTresVeces ? "TRES_SEMANA" : "",

            probSentiaCalor: res.pregunta5GNingunaVez ? "NUNCA" :
                res.pregunta5GMenosUnaVez ? "MENOS_SEMANA" :
                    res.pregunta5GUnaDosVeces ? "UNO_DOS_SEMANA" :
                        res.pregunta5GTresVeces ? "TRES_SEMANA" : "",

            probPesadillas: res.pregunta5HNingunaVez ? "NUNCA" :
                res.pregunta5HMenosUnaVez ? "MENOS_SEMANA" :
                    res.pregunta5HUnaDosVeces ? "UNO_DOS_SEMANA" :
                        res.pregunta5HTresVeces ? "TRES_SEMANA" : "",

            probDolores: res.pregunta5INingunaVez ? "NUNCA" :
                res.pregunta5IMenosUnaVez ? "MENOS_SEMANA" :
                    res.pregunta5IUnaDosVeces ? "UNO_DOS_SEMANA" :
                        res.pregunta5ITresVeces ? "TRES_SEMANA" : "",

            probOtrasRazones: res.pregunta5JNingunaVez ? "NUNCA" :
                res.pregunta5JMenosUnaVez ? "MENOS_SEMANA" :
                    res.pregunta5JUnaDosVeces ? "UNO_DOS_SEMANA" :
                        res.pregunta5JTresVeces ? "TRES_SEMANA" : "",

            // ====================== PARTE III ======================
            medicinasDormirFrecuencia: res.pregunta6NingunaVez ? "NUNCA" :
                res.pregunta6MenosUnaVez ? "MENOS_SEMANA" :
                    res.pregunta6UnaDosVeces ? "UNO_DOS_SEMANA" :
                        res.pregunta6TresVeces ? "TRES_SEMANA" : "",

            somnolenciaSocialFrecuencia: res.pregunta7NingunaVez ? "NUNCA" :
                res.pregunta7MenosUnaVez ? "MENOS_SEMANA" :
                    res.pregunta7UnaDosVeces ? "UNO_DOS_SEMANA" :
                        res.pregunta7TresVeces ? "TRES_SEMANA" : "",

            despertaNochePromedio: res.pregunta8UnaVez ? "1" :
                res.pregunta8DosVeces ? "2" :
                    res.pregunta8TresVeces ? "3" :
                        res.pregunta8CuatroVeces ? ">3" : "",

            calidadSuenoGeneral: res.pregunta9MuyBuena ? "MUY_BUENA" :
                res.pregunta9Buena ? "BUENA" :
                    res.pregunta9Mala ? "MALA" :
                        res.pregunta9MuyMala ? "MUY_MALA" : "",

            animoDificultaActividad: res.pregunta10No ? "NO" :
                res.pregunta10SiAlgo ? "SI_ALGO" :
                    res.pregunta10SiRegular ? "SI_REGULAR" :
                        res.pregunta10SiMucho ? "SI_MUCHO" : "",

            comparteHabitacion: res.pregunta11Solo ? "SOLO" :
                res.pregunta11SoloAlado ? "SOLO_LADO" :
                    res.pregunta11MismoCuarto ? "MISMO_CUARTO" :
                        res.pregunta11DosMasPersonasMismoCuarto ? "DOS_O_MAS" : "",

            user_medicoFirma: res.usuarioFirma,
        }));
    }
};

export const SubmitDataService = async (
    form,
    token,
    user,
    limpiar,
    tabla,
    datosFooter
) => {
    if (!form.norden) {
        await Swal.fire("Error", "Datos Incompletos", "error");
        return;
    }

    const body = {
        // Header
        norden: form.norden,
        pregunta1: form.horaAcostarse,

        pregunta2A: form.tiempoDormir == "MENOS_15",
        pregunta2B: form.tiempoDormir == "ENTRE_16_30",
        pregunta2C: form.tiempoDormir == "ENTRE_31_60",
        pregunta2D: form.tiempoDormir == "MAS_60",

        pregunta3: form.horaLevantarse,
        pregunta4: form.horasDormidas,

        pregunta5ANingunaVez: form.probPrimeraHora == "NUNCA",
        pregunta5AMenosUnaVez: form.probPrimeraHora == "MENOS_SEMANA",
        pregunta5AUnaDosVeces: form.probPrimeraHora == "UNO_DOS_SEMANA",
        pregunta5ATresVeces: form.probPrimeraHora == "TRES_SEMANA",

        pregunta5BNingunaVez: form.probDespertoNoche == "NUNCA",
        pregunta5BMenosUnaVez: form.probDespertoNoche == "MENOS_SEMANA",
        pregunta5BUnaDosVeces: form.probDespertoNoche == "UNO_DOS_SEMANA",
        pregunta5BTresVeces: form.probDespertoNoche == "TRES_SEMANA",

        pregunta5CNingunaVez: form.probLevantarseBano == "NUNCA",
        pregunta5CMenosUnaVez: form.probLevantarseBano == "MENOS_SEMANA",
        pregunta5CUnaDosVeces: form.probLevantarseBano == "UNO_DOS_SEMANA",
        pregunta5CTresVeces: form.probLevantarseBano == "TRES_SEMANA",

        pregunta5DNingunaVez: form.probNoRespirarBien == "NUNCA",
        pregunta5DMenosUnaVez: form.probNoRespirarBien == "MENOS_SEMANA",
        pregunta5DUnaDosVeces: form.probNoRespirarBien == "UNO_DOS_SEMANA",
        pregunta5DTresVeces: form.probNoRespirarBien == "TRES_SEMANA",

        pregunta5ENingunaVez: form.probTosiaRonca == "NUNCA",
        pregunta5EMenosUnaVez: form.probTosiaRonca == "MENOS_SEMANA",
        pregunta5EUnaDosVeces: form.probTosiaRonca == "UNO_DOS_SEMANA",
        pregunta5ETresVeces: form.probTosiaRonca == "TRES_SEMANA",

        pregunta5FNingunaVez: form.probSentiaFrio == "NUNCA",
        pregunta5FMenosUnaVez: form.probSentiaFrio == "MENOS_SEMANA",
        pregunta5FUnaDosVeces: form.probSentiaFrio == "UNO_DOS_SEMANA",
        pregunta5FTresVeces: form.probSentiaFrio == "TRES_SEMANA",

        pregunta5GNingunaVez: form.probSentiaCalor == "NUNCA",
        pregunta5GMenosUnaVez: form.probSentiaCalor == "MENOS_SEMANA",
        pregunta5GUnaDosVeces: form.probSentiaCalor == "UNO_DOS_SEMANA",
        pregunta5GTresVeces: form.probSentiaCalor == "TRES_SEMANA",

        pregunta5HNingunaVez: form.probPesadillas == "NUNCA",
        pregunta5HMenosUnaVez: form.probPesadillas == "MENOS_SEMANA",
        pregunta5HUnaDosVeces: form.probPesadillas == "UNO_DOS_SEMANA",
        pregunta5HTresVeces: form.probPesadillas == "TRES_SEMANA",

        pregunta5INingunaVez: form.probDolores == "NUNCA",
        pregunta5IMenosUnaVez: form.probDolores == "MENOS_SEMANA",
        pregunta5IUnaDosVeces: form.probDolores == "UNO_DOS_SEMANA",
        pregunta5ITresVeces: form.probDolores == "TRES_SEMANA",

        pregunta5JNingunaVez: form.probOtrasRazones == "NUNCA",
        pregunta5JMenosUnaVez: form.probOtrasRazones == "MENOS_SEMANA",
        pregunta5JUnaDosVeces: form.probOtrasRazones == "UNO_DOS_SEMANA",
        pregunta5JTresVeces: form.probOtrasRazones == "TRES_SEMANA",

        //parte 3
        pregunta6NingunaVez: form.medicinasDormirFrecuencia == "NUNCA",
        pregunta6MenosUnaVez: form.medicinasDormirFrecuencia == "MENOS_SEMANA",
        pregunta6UnaDosVeces: form.medicinasDormirFrecuencia == "UNO_DOS_SEMANA",
        pregunta6TresVeces: form.medicinasDormirFrecuencia == "TRES_SEMANA",

        pregunta7NingunaVez: form.somnolenciaSocialFrecuencia == "NUNCA",
        pregunta7MenosUnaVez: form.somnolenciaSocialFrecuencia == "MENOS_SEMANA",
        pregunta7UnaDosVeces: form.somnolenciaSocialFrecuencia == "UNO_DOS_SEMANA",
        pregunta7TresVeces: form.somnolenciaSocialFrecuencia == "TRES_SEMANA",

        pregunta8UnaVez: form.despertaNochePromedio == "1",
        pregunta8DosVeces: form.despertaNochePromedio == "2",
        pregunta8TresVeces: form.despertaNochePromedio == "3",
        pregunta8CuatroVeces: form.despertaNochePromedio == ">3",

        pregunta9MuyBuena: form.calidadSuenoGeneral == "MUY_BUENA",
        pregunta9Buena: form.calidadSuenoGeneral == "BUENA",
        pregunta9Mala: form.calidadSuenoGeneral == "MALA",
        pregunta9MuyMala: form.calidadSuenoGeneral == "MUY_MALA",

        pregunta10No: form.animoDificultaActividad == "NO",
        pregunta10SiAlgo: form.animoDificultaActividad == "SI_ALGO",
        pregunta10SiRegular: form.animoDificultaActividad == "SI_REGULAR",
        pregunta10SiMucho: form.animoDificultaActividad == "SI_MUCHO",

        pregunta11Solo: form.comparteHabitacion == "SOLO",
        pregunta11SoloAlado: form.comparteHabitacion == "SOLO_LADO",
        pregunta11MismoCuarto: form.comparteHabitacion == "MISMO_CUARTO",
        pregunta11DosMasPersonasMismoCuarto: form.comparteHabitacion == "DOS_O_MAS",


        fecha: form.fechaExam,
        usuarioRegistro: user,

        usuarioFirma: form.user_medicoFirma,
    };

    await SubmitDataServiceDefault(token, limpiar, body, registrarUrl, () => {
        PrintHojaR(form.norden, token, tabla, datosFooter);
    });
};

export const PrintHojaR = (nro, token, tabla, datosFooter) => {
    const jasperModules = import.meta.glob("../../../../../../jaspers/ModuloPsicologia/InformePsicoCalidadSueño/*.jsx");
    PrintHojaRDefault(
        nro,
        token,
        tabla,
        datosFooter,
        obtenerReporteUrl,
        jasperModules,
        "../../../../../../jaspers/ModuloPsicologia/InformePsicoCalidadSueño"
    );
};

export const VerifyTR = async (nro, tabla, token, set, sede) => {
    VerifyTRDefault(
        nro,
        tabla,
        token,
        set,
        sede,
        () => {
            // NO tiene registro: cargar datos del paciente
            GetInfoPac(nro, set, token, sede);
        },
        () => {
            // Sí tiene registro: cargar servicio y alertar
            GetInfoServicio(nro, tabla, set, token, () => {
                Swal.fire(
                    "Alerta",
                    "Este paciente ya cuenta con registros de Calidad de Sueño.",
                    "warning"
                );
            });
        }
    );
};

const GetInfoPac = async (nro, set, token, sede) => {
    const res = await GetInfoPacDefault(nro, token, sede);
    if (res) {
        set((prev) => ({
            ...prev,
            ...res,
            nombres: res.nombresApellidos ?? "",
            fechaNacimiento: formatearFechaCorta(res.fechaNac ?? ""),
            edad: res.edad,
            ocupacion: res.areaO ?? "",
            nombreExamen: res.nomExam ?? "",
            cargoDesempenar: res.cargo ?? "",
            lugarNacimiento: res.lugarNacimiento ?? "",
            sexo: res.genero === "M" ? "MASCULINO" : "FEMENINO",
        }));
    }
};

export const Loading = (mensaje) => {
    LoadingDefault(mensaje);
};