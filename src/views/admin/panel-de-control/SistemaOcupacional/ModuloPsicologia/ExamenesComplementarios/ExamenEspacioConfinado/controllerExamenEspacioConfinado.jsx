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
    "/api/v01/ct/psicologiaEspaciosConfinados/obtenerReportePsicologiaEspaciosConfinados";
const registrarUrl =
    "/api/v01/ct/psicologiaEspaciosConfinados/registrarActualizarPsicologiaEspaciosConfinados";

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
            norden: res.norden,
            fechaExamen: res.fecha,
            nombreExamen: res.nombreExamen ?? "",
            esApto: res.apto === true
                ? true
                : false,

            // Datos Personales - Columna Izquierda
            nombres: res.nombresPaciente ?? "",
            apellidos: res.apellidosPaciente ?? "",
            fechaNacimiento: res.fechaNacimientoPaciente ?? "",
            lugarNacimiento: res.lugarNacimientoPaciente ?? "",

            // Datos Personales - Columna Derecha
            domicilioActual: res.direccionPaciente ?? "",
            edad: res.edadPaciente ?? "",
            estadoCivil: res.estadoCivilPaciente ?? "",
            nivelEstudios: res.nivelEstudioPaciente ?? "",

            // Datos Laborales
            empresa: res.empresa ?? "",
            contrata: res.contrata ?? "",
            ocupacion: res.ocupacionPaciente ?? "",
            cargoDesempenar: res.cargoPaciente ?? "",

            // Criterios Psicológicos - Aspecto Intelectual
            razonamiento:
                res.razonamientoI
                    ? "I"
                    : res.razonamientoNPI
                        ? "NPI"
                        : res.razonamientoNP
                            ? "NP"
                            : res.razonamientoNPS
                                ? "NPS"
                                : res.razonamientoS
                                    ? "S"
                                    : "",
            memoria:
                res.memoriaI
                    ? "I"
                    : res.memoriaNPI
                        ? "NPI"
                        : res.memoriaNP
                            ? "NP"
                            : res.memoriaNPS
                                ? "NPS"
                                : res.memoriaS
                                    ? "S"
                                    : "",
            atencionConcentracion:
                res.atencionI
                    ? "I"
                    : res.atencioNPI
                        ? "NPI"
                        : res.atencionNP
                            ? "NP"
                            : res.atencionNPS
                                ? "NPS"
                                : res.atencionS
                                    ? "S"
                                    : "",
            coordinacionVisoMotora:
                res.visoMotoraI
                    ? "I"
                    : res.visoMotoraNPI
                        ? "NPI"
                        : res.visoMotoraNP
                            ? "NP"
                            : res.visoMotoraNPS
                                ? "NPS"
                                : res.visoMotoraS
                                    ? "S"
                                    : "",
            orientacionEspacial:
                res.orientacionEspacialI
                    ? "I"
                    : res.orientacionEspacialNPI
                        ? "NPI"
                        : res.orientacionEspacialNP
                            ? "NP"
                            : res.orientacionEspacialNPS
                                ? "NPS"
                                : res.orientacionEspacialS
                                    ? "S"
                                    : "",

            // Criterios Psicológicos - Aspectos Personalidad
            estabilidadEmocional:
                res.estabilidadEmocionalInestable
                    ? "INESTABLE"
                    : res.estabilidadEmocionalEstable
                        ? "ESTABLE"
                        : "",
            nivelAnsiedadGeneral:
                res.ansiedadGeneralCaso
                    ? "CASO"
                    : res.ansiedadGeneralNoCaso
                        ? "NO_CASO"
                        : "",
            ansiedadEspaciosConfinados:
                res.ansiedadEspaciosConfinadosNada
                    ? "NADA"
                    : res.ansiedadEspaciosConfinadosPoca
                        ? "POCA_ANSIEDAD"
                        : res.ansiedadEspaciosConfinadosModerada
                            ? "MODERADAMENTE_ANSIOSO"
                            : res.ansiedadEspaciosConfinadosElevada
                                ? "ELEVADAMENTE_ANSIOSO"
                                : "",

            // Análisis y Resultados
            analisisResultados: res.analisis ?? "",
            recomendaciones: res.recomendacion ?? "",
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
    if (form.esApto === undefined) {
        Swal.fire({
            icon: "warning",
            title: "Advertencia",
            text: "Por favor, marque si es apto o no apto.",
        });
        return;
    }
    const body = {
        norden: form.norden,
        fecha: form.fechaExamen,
        razonamientoI: form.razonamiento === "I",
        razonamientoNPI: form.razonamiento === "NPI",
        razonamientoNP: form.razonamiento === "NP",
        razonamientoNPS: form.razonamiento === "NPS",
        razonamientoS: form.razonamiento === "S",
        memoriaI: form.memoria === "I",
        memoriaNPI: form.memoria === "NPI",
        memoriaNP: form.memoria === "NP",
        memoriaNPS: form.memoria === "NPS",
        memoriaS: form.memoria === "S",
        atencionI: form.atencionConcentracion === "I",
        atencioNPI: form.atencionConcentracion === "NPI",
        atencionNP: form.atencionConcentracion === "NP",
        atencionNPS: form.atencionConcentracion === "NPS",
        atencionS: form.atencionConcentracion === "S",
        visoMotoraI: form.coordinacionVisoMotora === "I",
        visoMotoraNPI: form.coordinacionVisoMotora === "NPI",
        visoMotoraNP: form.coordinacionVisoMotora === "NP",
        visoMotoraNPS: form.coordinacionVisoMotora === "NPS",
        visoMotoraS: form.coordinacionVisoMotora === "S",
        orientacionEspacialI: form.orientacionEspacial === "I",
        orientacionEspacialNPI: form.orientacionEspacial === "NPI",
        orientacionEspacialNP: form.orientacionEspacial === "NP",
        orientacionEspacialNPS: form.orientacionEspacial === "NPS",
        orientacionEspacialS: form.orientacionEspacial === "S",
        estabilidadEmocionalInestable: form.estabilidadEmocional === "INESTABLE",
        estabilidadEmocionalEstable: form.estabilidadEmocional === "ESTABLE",
        ansiedadGeneralCaso: form.nivelAnsiedadGeneral === "CASO",
        ansiedadGeneralNoCaso: form.nivelAnsiedadGeneral === "NO_CASO",
        ansiedadEspaciosConfinadosNada: form.ansiedadEspaciosConfinados === "NADA",
        ansiedadEspaciosConfinadosPoca: form.ansiedadEspaciosConfinados === "POCA_ANSIEDAD",
        ansiedadEspaciosConfinadosModerada: form.ansiedadEspaciosConfinados === "MODERADAMENTE_ANSIOSO",
        ansiedadEspaciosConfinadosElevada: form.ansiedadEspaciosConfinados === "ELEVADAMENTE_ANSIOSO",
        apto: form.esApto === true,
        noApto: form.esApto === false,
        analisis: form.analisisResultados,
        recomendacion: form.recomendaciones,
        usuarioRegistro: user,
    };

    await SubmitDataServiceDefault(token, limpiar, body, registrarUrl, () => {
        PrintHojaR(form.norden, token, tabla, datosFooter);
    });
};

export const PrintHojaR = (nro, token, tabla, datosFooter) => {
    const jasperModules = import.meta.glob("../../../../../../jaspers/ModuloPsicologia/ExamenEspacioConfinado/*.jsx");
    PrintHojaRDefault(
        nro,
        token,
        tabla,
        datosFooter,
        obtenerReporteUrl,
        jasperModules,
        "../../../../../../jaspers/ModuloPsicologia/ExamenEspacioConfinado"
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
            //NO Tiene registro
            GetInfoPac(nro, set, token, sede);
        },
        () => {
            //Tiene registro
            GetInfoServicio(nro, tabla, set, token, () => {
                Swal.fire(
                    "Alerta",
                    "Este paciente ya cuenta con registros de Examen de Espacio Confinado.",
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
            fechaNacimiento: formatearFechaCorta(res.fechaNac ?? ""),
            edad: res.edad + " AÑOS",
            ocupacion: res.areaO ?? "",

            nombres: res.nombres ?? "",
            apellidos: res.apellidos ?? "",
            lugarNacimiento: res.lugarNacimiento ?? "", //revisar

            domicilioActual: res.direccion ?? "", //revisar
            estadoCivil: res.estadoCivil ?? "", //revisar
            nivelEstudios: res.nivelEstudios ?? "", //revisar

            empresa: res.empresa ?? "",
            contrata: res.contrata ?? "",
            cargoDesempenar: res.cargo ?? "",
        }));
    }
};

export const Loading = (mensaje) => {
    LoadingDefault(mensaje);
};