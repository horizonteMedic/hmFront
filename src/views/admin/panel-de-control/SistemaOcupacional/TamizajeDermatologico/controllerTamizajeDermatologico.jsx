import Swal from "sweetalert2";
import {
    GetInfoPacDefault,
    GetInfoServicioDefault,
    LoadingDefault,
    PrintHojaRDefault,
    SubmitDataServiceDefault,
    VerifyTRDefault,
} from "../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../utils/formatDateUtils";
import { convertirGenero } from "../../../../utils/helpers";
import { getFetch } from "../../../../utils/apiHelpers";

const obtenerReporteUrl = "/api/v01/ct/tamizajeDermatologico/obtenerReporte";
const registrarUrl = "/api/v01/ct/tamizajeDermatologico/registrarActualizar";

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
    const rese = res?.resultado;
    if (rese) {
        set((prev) => ({
            ...prev,
            // Header - Información del examen
            norden: rese.norden ?? "",
            fecha: rese.fechaExamen ?? "",
            nombreExamen: rese.nomExamen ?? "",

            dni: rese.dniPaciente ?? "",
            nombres: `${rese.nombres ?? ""} ${rese.apellidos ?? ""}`,
            fechaNacimiento: formatearFechaCorta(rese.fechaNacimientoPaciente ?? ""),
            lugarNacimiento: rese.lugarNacimientoPaciente ?? "",
            edad: rese.edad ?? "",
            sexo: convertirGenero(rese.sexoPaciente ?? ""),
            estadoCivil: rese.estadoCivilPaciente ?? "",
            nivelEstudios: rese.nivelEstudioPaciente ?? "",

            // Datos Laborales
            empresa: rese.razonEmpresa ?? "",
            contrata: rese.razonContrata ?? "",
            ocupacion: rese.ocupacionPaciente ?? "",
            cargoDesempenar: rese.cargoDe ?? "",

            // Tamizaje Dermatológico
            enfermedadPiel: rese.tieneEnfermedadPiel ?? false,
            enfermedadPielDetalle: rese.diagnosticoEnfermedad ?? "",
            algunaLesion: rese.tieneLesionActual ?? false,
            algunaLesionLocalizacion: rese.localizacionLesion ?? "",
            algunaLesionDesdeCuando: rese.tiempoLesion ?? "",
            coloracionPiel: rese.cambioColoracionPiel ?? false,
            variasLesiones: rese.lesionesRecurrentesAnuales ?? false,
            enrojecimiento: rese.tieneEnrojecimiento ?? false,
            enrojecimientoLocalizacion: rese.localizacionEnrojecimiento ?? "",
            comezon: rese.tieneComezon ?? false,
            comezonLocalizacion: rese.localizacionComezon ?? "",
            hinchazon: rese.tieneHinchazon ?? false,
            hinchazonLocalizacion: rese.localizacionHinchazon ?? "",
            alergiaAsma: rese.tieneRinitisOAsma ?? false,
            usaEpp: rese.usaEpp ?? true,
            usaEppProteccion: rese.tipoEpp ?? "",
            cambiosEnUnas: rese.cambiosEnUnas ?? false,
            algunaMedicacion: rese.tomaMedicacion ?? false,

            // Para el médico
            dermatopatia: rese.hallazgoSugerenteDermatopatia ?? false,
            necesitaDermatologo: rese.requiereEvaluacionDermatologica ?? false,
            interconsultaDermatologia: rese.requiereInterconsultaEspecialidad ?? false,

            // Comentarios
            comentarios: rese.comentarios ?? "",

            // Médico que Certifica
            user_medicoFirma: rese.usuarioFirma ?? "",
            user_doctorAsignado: rese.doctorAsignado ?? "",
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
        norden: form.norden,
        tieneEnfermedadPiel: form.enfermedadPiel ?? false,
        diagnosticoEnfermedad: form.enfermedadPielDetalle ?? "",
        tieneLesionActual: form.algunaLesion ?? false,
        localizacionLesion: form.algunaLesionLocalizacion ?? "",
        tiempoLesion: form.algunaLesionDesdeCuando ?? "",
        cambioColoracionPiel: form.coloracionPiel ?? false,
        lesionesRecurrentesAnuales: form.variasLesiones ?? false,
        tieneEnrojecimiento: form.enrojecimiento ?? false,
        localizacionEnrojecimiento: form.enrojecimientoLocalizacion ?? "",
        tieneComezon: form.comezon ?? false,
        localizacionComezon: form.comezonLocalizacion ?? "",
        tieneHinchazon: form.hinchazon ?? false,
        localizacionHinchazon: form.hinchazonLocalizacion ?? "",
        tieneRinitisOAsma: form.alergiaAsma ?? false,
        usaEpp: form.usaEpp ?? false,
        tipoEpp: form.usaEppProteccion ?? "",
        cambiosEnUnas: form.cambiosEnUnas ?? false,
        tomaMedicacion: form.algunaMedicacion ?? false,
        comentarios: form.comentarios ?? "",
        hallazgoSugerenteDermatopatia: form.dermatopatia ?? false,
        requiereEvaluacionDermatologica: form.necesitaDermatologo ?? false,
        requiereInterconsultaEspecialidad: form.interconsultaDermatologia ?? false,
        especialidad: "",
        fechaExamen: form.fecha,
        userRegistro: user,
        usuarioFirma: form.user_medicoFirma,
        doctorAsignado: form.user_doctorAsignado,
    };

    await SubmitDataServiceDefault(token, limpiar, body, registrarUrl, () => {
        PrintHojaR(form.norden, token, tabla, datosFooter);
    });
};

// export const PrintHojaR = (nro, token, tabla, datosFooter) => {
//     const jasperModules = import.meta.glob("../../../../../../jaspers/TamizajeDermatologico/*.jsx");
//     PrintHojaRDefault(
//         nro,
//         token,
//         tabla,
//         datosFooter,
//         obtenerReporteUrl,
//         jasperModules,
//         "../../../../../../jaspers/TamizajeDermatologico"
//     );
// };

export const PrintHojaR = (nro, token, tabla) => {
    Loading('Cargando Formato a Imprimir')
    getFetch(`${obtenerReporteUrl}?nOrden=${nro}&nameService=${tabla}&esJasper=true`, token)
        .then(async (res) => {
            if (res?.resultado?.norden) {
                const nombre = "TamizajeDermatologico";
                console.log(nombre)
                const jasperModules = import.meta.glob('../../../../jaspers/TamizajeDermatologico/*.jsx');
                const modulo = await jasperModules[`../../../../jaspers/TamizajeDermatologico/${nombre}.jsx`]();
                // Ejecuta la función exportada por default con los datos
                if (typeof modulo.default === 'function') {
                    modulo.default(res.resultado);
                } else {
                    console.error(`El archivo ${nombre}.jsx no exporta una función por defecto`);
                }
                Swal.close()
            } else {
                Swal.close()
            }
        })
}


export const VerifyTR = async (nro, tabla, token, set, sede) => {
    VerifyTRDefault(
        nro,
        tabla,
        token,
        set,
        sede,
        () => {
            //NO Tiene registro
            GetInfoPac(nro, set, token, sede);
        },
        () => {
            //Tiene registro
            GetInfoServicio(nro, tabla, set, token, () => {
                Swal.fire(
                    "Alerta",
                    "Este paciente ya cuenta con registros de Tamizaje Dermatológico.",
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
            sexo: convertirGenero(res.genero),
        }));
    }
};

export const Loading = (mensaje) => {
    LoadingDefault(mensaje);
};