import Swal from "sweetalert2";
import { GetInfoPacDefault, GetInfoServicioDefault, LoadingDefault, SubmitDataServiceDefault, VerifyTRDefault } from "../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../utils/formatDateUtils";
import { convertirGenero } from "../../../../utils/helpers";

const obtenerReporteUrl = "/api/v01/ct/exposicionCalor/obtenerReporte";
const registrarUrl = "/api/v01/ct/exposicionCalor/registrarActualizar";

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
        //const rese = res.resultado
        set((prev) => ({
            ...prev,
            norden: res.norden ?? "",
            nombreExamen: res.nombreExamen ?? "",
            // nombres: res.nombresPaciente ?? "",
            nombres: res.nombres + " " + res.apellidosPaciente,
            dni: res.dni ?? "",
            edad: res.edad ?? "",
            sexo: convertirGenero(res.sexo) ?? "",

            fechaNacimiento: formatearFechaCorta(res.fechaNacimiento) ?? "",
            lugarNacimiento: res.lugarNacimiento ?? "",
            estadoCivil: res.estadoCivil ?? "",
            nivelEstudios: res.nivelEstudios ?? "",

            empresa: res.empresa ?? "",
            contrata: res.contrata ?? "",
            ocupacion: res.ocupacion ?? "",
            cargoDesempenar: res.cargoDesempenar ?? "",

            fecha: res.fechaExamen ?? prev.fecha,
            id: res.id,
            nombreExamen: res.nombreExamen ?? "",
            dni: res.dni ?? "",
        }));
    }
};

export const GetInfoServicioEditar = async (
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
        onFinish,
        true
    );
    if (res) {
        set((prev) => ({
            ...prev,
            // Header
            norden: res.norden ?? "",
            fecha: res.fecha ?? "",
            nombreExamen: res.nombreExamen ?? "",
            nombres: res.nombres + " " + res.apellidosPaciente,
            dni: res.dni ?? "",
            edad: res.edad ?? "",
            sexo: convertirGenero(res.sexo) ?? "",

            fechaNacimiento: formatearFechaCorta(res.fechaNacimiento) ?? "",
            lugarNacimiento: res.lugarNacimiento ?? "",
            estadoCivil: res.estadoCivil ?? "",
            nivelEstudios: res.nivelEstudios ?? "",

            signosVitalesResultados: res.signosVitalesResultados,
            signosVitalesObservaciones: res.signosVitalesObservaciones,
            sistemaCardiovascularResultados: res.sistemaCardiovascularResultados,
            sistemaCardiovascularObservaciones: res.sistemaCardiovascularObservaciones,
            sistemaRespiratorioResultados: res.sistemaRespiratorioResultados,
            sistemaRespiratorioObservaciones: res.sistemaRespiratorioObservaciones,
            estadoNeurologicoResultados: res.estadoNeurologicoResultados,
            estadoNeurologicoObservaciones: res.estadoNeurologicoObservaciones,
            estadoHidratacionResultados: res.estadoHidratacionResultados,
            estadoHidratacionObservaciones: res.estadoHidratacionObservaciones,
            toleranciaCalorResultados: res.toleranciaCalorResultados,
            toleranciaCalorObservaciones: res.toleranciaCalorObservaciones,
            sudoracionResultados: res.sudoracionResultados,
            sudoracionObservaciones: res.sudoracionObservaciones,


            empresa: res.empresa ?? "",
            contrata: res.contrata ?? "",
            ocupacion: res.ocupacion ?? "",
            cargoDesempenar: res.cargoDesempenar ?? "",
            user_medicoFirma: res.usuarioFirma ? res.usuarioFirma : prev.user_medicoFirma,
            user_doctorAsignado: res.doctorAsignado,
        }));
    }
};

export const SubmitDataService = async (
    form,
    token,
    user,
    limpiar,
    tabla
) => {
    if (!form.norden) {
        await Swal.fire("Error", "Datos Incompletos", "error");
        return;
    }

    const body = {
        norden: form.norden,
        id: form.id,
        fecha: form.fecha,

        signosVitalesResultados: form.signosVitalesResultados,
        signosVitalesObservaciones: form.signosVitalesObservaciones,
        sistemaCardiovascularResultados: form.sistemaCardiovascularResultados,
        sistemaCardiovascularObservaciones: form.sistemaCardiovascularObservaciones,
        sistemaRespiratorioResultados: form.sistemaRespiratorioResultados,
        sistemaRespiratorioObservaciones: form.sistemaRespiratorioObservaciones,
        estadoNeurologicoResultados: form.estadoNeurologicoResultados,
        estadoNeurologicoObservaciones: form.estadoNeurologicoObservaciones,
        estadoHidratacionResultados: form.estadoHidratacionResultados,
        estadoHidratacionObservaciones: form.estadoHidratacionObservaciones,
        toleranciaCalorResultados: form.toleranciaCalorResultados,
        toleranciaCalorObservaciones: form.toleranciaCalorObservaciones,
        sudoracionResultados: form.sudoracionResultados,
        sudoracionObservaciones: form.sudoracionObservaciones,


        esApto: form.esApto,
        aptoRestriccion: form.aptoRestriccion,
        noEsApto: form.noEsApto,

        restricciones: form.restricciones,

        usuarioFirma: form.user_medicoFirma,
        userRegistro: user,
    };

    await SubmitDataServiceDefault(token, limpiar, body, registrarUrl, () => {
        PrintHojaR(form.norden, token, tabla);
    });
};

export const GetInfoServicioTabla = (nro, tabla, set, token) => {
    GetInfoServicio(nro, tabla, set, token, () => {
        Swal.close();
    });
};

export const PrintHojaR = (nro, token, tabla) => {
    Loading('Cargando Formato a Imprimir')
    getFetch(`${obtenerReporteUrl}?nOrden=${nro}&nameService=${tabla}&esJasper=true`, token)
        .then(async (res) => {
            if (res?.resultado?.norden) {
                const nombre = "EscalaLakeLouise";
                console.log(nombre)
                const jasperModules = import.meta.glob(
                    "../../../../jaspers/EscalaLakeLouise/*.jsx"
                );
                const modulo = await jasperModules[`../../../../jaspers/EscalaLakeLouise/${nombre}.jsx`]();

                if (typeof modulo.default === 'function') {
                    modulo.default(res.resultado);
                } else {
                    console.error(`El archivo ${nombre}.jsx no exporta una función por defecto`);
                }
                Swal.close();
            } else {
                Swal.close();
            }
        })
};

export const VerifyTR = async (nro, tabla, token, set, sede) => {
    VerifyTRDefault(
        nro,
        tabla,
        token,
        set,
        sede,
        () => {
            //NO Tiene registro
            GetInfoServicio(nro, tabla, set, token, () => {
                Swal.close();
            });
        },
        () => {
            //Tiene registro
            GetInfoServicioEditar(nro, tabla, set, token, () => {
                Swal.fire(
                    "Alerta",
                    "Este paciente ya cuenta con registros de Certificado Exposicion Al Calor.",
                    "warning"
                );
            });
        },
        () => {
            Swal.fire(
                "Alerta",
                "El paciente necesita pasar por Triaje.",
                "warning"
            )
        }
    );
}

const GetInfoPac = async (nro, set, token, sede) => {
    const res = await GetInfoPacDefault(nro, token, sede);
    if (res) {
        set((prev) => ({
            ...prev,
            nombreExamen: res.nomExam ?? "",
            nombres: res.nombresApellidos ?? "",
            edad: res.edad ?? "",
            sexo: convertirGenero(res.genero ?? ""),
            dni: res.dni ?? "",
            fechaNacimiento: formatearFechaCorta(res.fechaNac ?? ""),
            lugarNacimiento: res.lugarNacimiento ?? "",
            estadoCivil: res.estadoCivil,
            nivelEstudios: res.nivelEstudios,
            // Datos Laborales
            empresa: res.empresa,
            contrata: res.contrata,
            ocupacion: res.areaO,
            cargoDesempenar: res.cargo,
        }));
    }
}

export const Loading = (mensaje) => {
    LoadingDefault(mensaje);
};
