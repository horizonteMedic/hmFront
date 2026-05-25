import Swal from "sweetalert2";
import {
    GetInfoPacDefault,
    GetInfoServicioDefault,
    LoadingDefault,
    PrintHojaRJsReportDefault,
    SubmitDataServiceDefault,
    VerifyTRDefault,
} from "../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../utils/formatDateUtils";
import { getFetch } from "../../../../utils/apiHelpers";

const obtenerReporteUrl =
    "/api/v01/ct/riesgoElectrico/obtenerReporte";
const registrarUrl =
    "/api/v01/ct/riesgoElectrico/registrarActualizar";

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
        onFinish,
        true
    );
    if (res) {
        console.log(res)
        const rese = res.resultado
        set((prev) => ({
            ...prev,
            // Header
            norden: rese.norden ?? "",
            fechaExam: rese.fechaExamen ?? "",
            tipoExamen: rese.nombreExamen ?? "",
            // Datos personales
            nombres: rese.nombreCompletoPaciente ?? "",
            dni: rese.dniPaciente ?? "",
            edad: rese.edadPaciente ?? "",
            fechaNacimiento: formatearFechaCorta(rese.fechaNacimientoPaciente ?? ""),
            lugarNacimiento: rese.lugarNacimientoPaciente ?? "",
            estadoCivil: rese.estadoCivilPaciente ?? "",
            nivelEstudios: rese.nivelEstudioPaciente ?? "",
            sexo: rese.sexoPaciente === "M" ? "MASCULINO" : "FEMENINO",
            empresa: rese.empresa ?? "",
            contrata: rese.contrata ?? "",
            // Campos usados por la interfaz principal
            cargoDesempenar: rese.cargoPaciente ?? "",
            ocupacion: rese.ocupacionPaciente ?? "",

            fechaNacimientoPaciente: formatearFechaCorta(rese.fechaNacimientoPaciente ?? ""),
            peso: rese.peso ?? "",
            talla: rese.talla ?? "",
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
        console.log(res)
        const rese = res.resultado
        set((prev) => ({
            ...prev,
            ...res,
            // Header
            norden: rese.norden ?? "",
            fechaExam: rese.fechaExamen ?? "",
            tipoExamen: rese.nombreExamen ?? "",
            // Datos personales
            nombres: (rese.nombresPaciente + " " + rese.apellidosPaciente) ?? "",
            dni: rese.dniPaciente ?? "",
            edad: rese.edadPaciente ?? "",
            fechaNacimiento: formatearFechaCorta(rese.fechaNacimientoPaciente ?? ""),
            lugarNacimiento: rese.lugarNacimientoPaciente ?? "",
            estadoCivil: rese.estadoCivilPaciente ?? "",
            nivelEstudios: rese.nivelEstudioPaciente ?? "",
            sexo: rese.sexoPaciente === "M" ? "MASCULINO" : "FEMENINO",
            empresa: rese.empresa ?? "",
            contrata: rese.contrata ?? "",
            // Campos usados por la interfaz principal
            cargoDesempenar: rese.cargoPaciente ?? "",
            ocupacion: rese.ocupacionPaciente ?? "", 
            

            evaluacionRiesgoRealizada: rese.evaluacionRiesgoRealizada ?? "",
            personalCompetenteAreaElectrica: rese.personalCompetenteAreaElectrica ?? "",
            conoceTipoVoltaje: rese.conoceTipoVoltaje ?? "",
            personalCertificadoVoltaje: rese.personalCertificadoVoltaje ?? "",
            eppApropiadoTarea: rese.eppApropiadoTarea ?? "",
            sistemaDesenergizado: rese.sistemaDesenergizado ?? "",
            sistemaAislado: rese.sistemaAislado ?? "",
            tarjetasAdvertenciaInstaladas: rese.tarjetasAdvertenciaInstaladas ?? "",
            bloqueosInstalados: rese.bloqueosInstalados ?? "",
            sistemasAterrizados: rese.sistemasAterrizados ?? "",
            trabajosSimultaneosControlados: rese.trabajosSimultaneosControlados ?? "",
            personalEntrenadoRiesgoElectrico: rese.personalEntrenadoRiesgoElectrico ?? "",
            medidasSeguridadSatisfactorias: rese.medidasSeguridadSatisfactorias ?? "",

            aptitud: rese.apto
                ? "APTO"
                : rese.noEsApto
                    ? "NO APTO"
                    : rese.conRestriccion
                        ? "RESTRICCION"
                        : "",

            user_medicoFirma: rese.usuarioFirma ? rese.usuarioFirma : prev.user_medicoFirma,
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
        "norden": form.norden,
        "fechaExamen": form.fechaExamen,
        "userRegistro": user,
        usuarioFirma: form.user_medicoFirma,

        "colorPiel": form.colorPiel,
        "colorOjos": form.colorOjos,
        "cabello": form.cabello,

        "apto": form.aptitud == "APTO",
        "conRestriccion": form.aptitud == "RESTRICCION",
        "noEsApto": form.aptitud == "NO APTO",

        "evaluacionRiesgoRealizada": form.evaluacionRiesgoRealizada,
        "personalCompetenteAreaElectrica": form.personalCompetenteAreaElectrica,
        "conoceTipoVoltaje": form.conoceTipoVoltaje,
        "personalCertificadoVoltaje": form.personalCertificadoVoltaje,
        "eppApropiadoTarea": form.eppApropiadoTarea,
        "sistemaDesenergizado": form.sistemaDesenergizado,
        "sistemaAislado": form.sistemaAislado,
        "tarjetasAdvertenciaInstaladas": form.tarjetasAdvertenciaInstaladas,
        "bloqueosInstalados": form.bloqueosInstalados,
        "sistemasAterrizados": form.sistemasAterrizados,
        "trabajosSimultaneosControlados": form.trabajosSimultaneosControlados,
        "personalEntrenadoRiesgoElectrico": form.personalEntrenadoRiesgoElectrico,
        "medidasSeguridadSatisfactorias": form.medidasSeguridadSatisfactorias,


    };

    await SubmitDataServiceDefault(token, limpiar, body, registrarUrl, () => {
        PrintHojaR(form.norden, token, tabla, datosFooter);
    });
};

export const GetInfoServicioTabla = (nro, tabla, set, token) => {
    GetInfoServicio(nro, tabla, set, token, () => {
        Swal.close();
    });
};

/*export const PrintHojaR = (nro, token, tabla) => {
    PrintHojaRJsReportDefault(
        nro,
        token,
        tabla,
        obtenerReporteJsReportUrl
    );
};*/

export const PrintHojaR = (nro, token, tabla) => {
    Loading('Cargando Formato a Imprimir')
    getFetch(`/api/v01/ct/ministerioEnergiaMinas/obtenerReporte?nOrden=${nro}&nameService=${tabla}&esJasper=true`, token)
        .then(async (res) => {
            console.log(res)
            if (res.norden) {
                const nombre = "ENERGIAYMINAS";
                console.log(nombre)
                const jasperModules = import.meta.glob('../../../../../jaspers/Poderosa/*.jsx');
                const modulo = await jasperModules[`../../../../../jaspers/Poderosa/${nombre}.jsx`]();
                // Ejecuta la función exportada por default con los datos
                if (typeof modulo.default === 'function') {
                    modulo.default(res);
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
            GetInfoServicio(nro, tabla, set, token, () => {
                Swal.close();
            });
        },
        () => {
            //Tiene registro
            GetInfoServicioEditar(nro, tabla, set, token, () => {
                Swal.fire(
                    "Alerta",
                    "Este paciente ya cuenta con registros de Ministerio Energia y Minas",
                    "warning"
                );
            });
        },
        () => {
            //Necesita Agudeza visual 
            Swal.fire(
                "Alerta",
                "El paciente necesita pasar por Triaje.",
                "warning"
            );
        }
    );
};


export const Loading = (mensaje) => {
    LoadingDefault(mensaje);
};