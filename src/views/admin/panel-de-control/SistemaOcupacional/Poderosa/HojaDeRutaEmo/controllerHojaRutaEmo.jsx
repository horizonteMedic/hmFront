import Swal from "sweetalert2";
import {
    GetInfoPacDefault,
    GetInfoServicioDefault,
    LoadingDefault,
    PrintHojaRDefault,
    PrintHojaRJsReportDefault,
    SubmitDataServiceDefault,
    VerifyTRDefault,
} from "../../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../../utils/formatDateUtils";
import { getHoraActual } from "../../../../../utils/helpers";
import { getFetch } from "../../../../../utils/apiHelpers";

const obtenerReporteUrl =
    "/api/v01/ct/hojaRutaEmo/obtenerReporteHojaRuta";
const obtenerReporteJsReportUrl = "/api/v01/ct/hojaRutaEmo/descargarReporteHojaRuta";
const registrarUrl =
    "/api/v01/ct/hojaRutaEmo/registrarActualizar";


export const GetInfoServicio = async (
    nro,
    set,
    token,
    sede
) => {
    const res = await GetInfoPacDefault(
        nro,
        token,
        sede
    );
    console.log(res)
    if (res) {
        console.log(res)
        set((prev) => ({
            ...prev,
            norden: res.norden ?? "",
            fechaExam: prev.fechaExam ?? "",
            // Datos personales
            nombres: res.nombresApellidos ?? "",
            fechaNacimiento: formatearFechaCorta(res.fechaNac ?? ""),
            lugarNacimiento: res.lugarNacimiento ?? "",
            estadoCivil: res.estadoCivil ?? "",
            nivelEstudios: res.nivelEstudios ?? "",
            dni: res.dni ?? "",
            edad: res.edad ?? "",
            sexo: res.genero === "M" ? "MASCULINO" : "FEMENINO",
            empresa: res.empresa ?? "",
            contrata: res.contrata ?? "",
            // Campos usados por la interfaz principal
            cargoDesempenar: res.cargo ?? "",
            ocupacion: res.areaO ?? "",
            usuarioFirma: res.user_medicoFirma,

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
        set((prev) => ({
            ...prev,
            ...res,
            // Header
            norden: res.norden ?? "",
            fechaExamen: res.fechaExamen ?? prev.fechaExamen,
            tipoExamen: res.nombreExamen ?? "",
            // Datos personales
            nombres: res.nombreCompletoPaciente ?? "",
            dni: res.dniPaciente ?? "",
            edad: res.edadPaciente ?? "",
            fechaNacimiento: formatearFechaCorta(res.fechaNacimientoPaciente ?? ""),
            lugarNacimiento: res.lugarNacimientoPaciente ?? "",
            estadoCivil: res.estadoCivilPaciente ?? "",
            nivelEstudios: res.nivelEstudioPaciente ?? "",
            sexo: res.sexoPaciente === "M" ? "MASCULINO" : "FEMENINO",
            empresa: res.empresa ?? "",
            contrata: res.contrata ?? "",
            // Campos usados por la interfaz principal
            cargoDesempenar: res.cargoPaciente ?? "",
            ocupacion: res.ocupacionPaciente ?? "",

            //EXAMEN MEDICO

            // observacion
            user_medicoFirma: res.usuarioFirma ? res.usuarioFirma : prev.user_medicoFirma,
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
        "userRegistro": form.userlogued,
        usuarioFirma: form.user_medicoFirma,

        "observacionesGenerales": form.observacionesGenerales,
        "horaSalida": getHoraActual(),
        "observacionesMedicina": form.observacionesEvaluacionMedica,
        "observacionesPsicologia": form.observacionInformeBrigadista,
        "observacionesVisual": form.observacionesEvaluacionVisual,
        "observacionesAudiometria": form.observacionAudiometria,
        "observacionesEspirometria": form.observacionEspirometria,
        "observacionesRadiografiaTorax": form.observacionRadiografiaTorax,
        "observacionesCardiologia": form.observacionesElectrocardiograma,
        "observacionesLaboratorio": form.observacionesExamenLaboratorio,
        "observacionesBrigadista": form.observacionBrigadista,
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

export const PrintHojaR = (nro, token, tabla, datosFooter) => {
    // const jasperModules = import.meta.glob("../../../../../jaspers/Poderosa/*.jsx");
    // PrintHojaRDefault(
    //     nro,
    //     token,
    //     tabla,
    //     datosFooter,
    //     obtenerReporteUrl,
    //     jasperModules,
    //     "../../../../../jaspers/Poderosa"
    // );
    Loading('Cargando Formato a Imprimir')
    getFetch(`${obtenerReporteUrl}?nOrden=${nro}&nameService=${tabla}&esJasper=true`, token)
        .then(async (res) => {
            if (res.norden) {
                const nombre = "HojaDeRutaEmo_Digitalizado";
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
};

export const PrintHojaRData = (datos, datosFooter) => {
    const jasperModules = import.meta.glob("../../../../../jaspers/Poderosa/*.jsx");
    // Simulamos una respuesta del servidor con los datos proporcionados
    const res = { ...datos, ...datosFooter, nameJasper: "HojaDeRutaEmo_Digitalizado", norden: datos.norden };

    // Buscamos el módulo manualmente
    const rutaCompleta = `../../../../../jaspers/Poderosa/HojaDeRutaEmo_Digitalizado.jsx`;
    const moduloFunc = jasperModules[rutaCompleta];

    if (moduloFunc) {
        moduloFunc().then(modulo => {
            if (typeof modulo.default === "function") {
                modulo.default(res, null);
            }
        });
    }
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
            GetInfoServicioEditar(nro, tabla, set, token, () => { Swal.close() });
        },
        () => {
            //Tiene registro
            GetInfoServicioEditar(nro, tabla, set, token, () => {
                Swal.fire(
                    "Alerta",
                    "Este paciente ya cuenta con registros de Hoja Ruta EMO",
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