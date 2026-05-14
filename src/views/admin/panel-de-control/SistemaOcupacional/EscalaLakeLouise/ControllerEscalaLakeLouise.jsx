import Swal from "sweetalert2";
import { formatearFechaCorta } from "../../../../utils/formatDateUtils";
import { GetInfoPacDefault, GetInfoServicioDefault, LoadingDefault, PrintHojaRDefault, SubmitDataServiceDefault, VerifyTRDefault } from "../../../../utils/functionUtils";
import { convertirGenero } from "../../../../utils/helpers";
import { getFetch } from "../../../../utils/apiHelpers";

const obtenerReporteUrl = "/api/v01/ct/escalaLakeLouise/obtenerReporte";
const registrarUrl = "/api/v01/ct/escalaLakeLouise/registrarActualizar";

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
        const rese = res.resultado
        set((prev) => ({
            ...prev,
            fecha: rese.fechaExamen ?? prev.fecha,
            id: rese.id,
            nombreExamen: rese.nombreExamen ?? "",
            dni: rese.dni ?? "",

            nombres: rese.nombres ?? "",
            fechaNacimiento: formatearFechaCorta(rese.fechaNacimiento ?? ""),
            lugarNacimiento: rese.lugarNacimiento ?? "",
            edad: rese.edad ?? "",
            sexo: convertirGenero(rese.sexo ?? ""),
            estadoCivil: rese.estadoCivil,
            nivelEstudios: rese.nivelEstudio,
            // Datos Laborales
            empresa: rese.empresa,
            contrata: rese.contrata,
            ocupacion: rese.ocupacion,
            cargoDesempenar: rese.cargoDesempenar,

            cefalea: Number(rese.cefalea) || 0,
            sintomasDigestivos: Number(rese.sintomasDigestivos) || 0,
            fatiga: Number(rese.fatiga) || 0,
            vertigo: Number(rese.vertigo) || 0,
            alteracionesSueno: Number(rese.alteracionesSueno) || 0,
            alteracionesMentales: Number(rese.alteracionesMentales) || 0,
            ataxia: Number(rese.ataxia) || 0,
            edemasPerifericos: Number(rese.edemasPerifericos) || 0,
            calificacion: rese.calificacion || "",

            user_medicoFirma: res.usuarioFirma,
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
        cefalea: parseInt(form.cefalea),
        sintomaDigestivo: parseInt(form.sintomasDigestivos),
        fatiga: parseInt(form.fatiga),
        vertigo: parseInt(form.vertigo),
        alteracionesSueno: parseInt(form.alteracionesSueno),
        alteracionesMentales: parseInt(form.alteracionesMentales),
        ataxia: parseInt(form.ataxia),
        edemasPerifericos: parseInt(form.edemasPerifericos),
        calificacion: form.calificacion,
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
            GetInfoPac(nro, set, token, sede);
        },
        () => {
            //Tiene registro
            GetInfoServicio(nro, tabla, set, token, () => {
                Swal.fire(
                    "Alerta",
                    "Este paciente ya cuenta con registros de Escala Lake Louise.",
                    "warning"
                );
            });
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