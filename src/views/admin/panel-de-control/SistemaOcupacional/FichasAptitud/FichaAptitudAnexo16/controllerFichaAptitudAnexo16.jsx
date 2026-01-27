import Swal from "sweetalert2";
import {
    GetInfoServicioDefault,
    LoadingDefault,
    PrintHojaRDefault,
    SubmitDataServiceDefault,
} from "../../../../../utils/functionUtils";
import { getFetch } from "../../../../../utils/apiHelpers";
import { getHoraActual } from "../../../../../utils/helpers";

const obtenerReporteUrl =
    "/api/v01/ct/anexos/fichaAnexo16/obtenerReporteFichaAnexo16";
const obtenerReporteResumenMedicoUrl =
    "/api/v01/ct/anexos/obtenerReporteResumenMedico";
const registrarUrl =
    "/api/v01/ct/anexos/fichaAnexo16/registrarActualizarFichaAnexo16";

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
            tipoExamen: res.nombreExamen,
            nombres: res.nombresPaciente + " " + res.apellidosPaciente,
            dni: res.dniPaciente,
            edad: res.edadPaciente,
            sexo: res.sexoPaciente,
            empresa: res.empresa,
            contrata: res.contrata,
            puestoPostula: res.ocupacionPaciente,
            areaTrabajo: res.areaPaciente,
            puestoActual: res.cargoPaciente,
            esOhla: res.esOhla ?? false,

            conclusiones: res.observacionesFichaMedica,

            visionCercaOd: res.visioncercasincorregirodVCercaSOd,
            visionLejosOd: res.visionlejossincorregirodVLejosSOd,
            visionCercaOi: res.visioncercasincorregiroiVCercaSOi,
            visionLejosOi: res.visionlejossincorregiroiVLejosSOi,

            visionCercaOdCorregida: res.oftalodccmologiaOdcc,
            visionLejosOdCorregida: res.odlcoftalmologiaOdlc,
            visionCercaOiCorregida: res.oiccoftalmologiaOicc,
            visionLejosOiCorregida: res.oilcoftalmologiaOilc,

            visionColores: res.vcoftalmologiaVc,
            visionBinocular: res.vboftalmologiaVb,
            reflejosPupilares: res.rpoftalmologiaRp,
            enfermedadOculares: res.enfermedadesocularesoftalmoEOculares,

            hemoglobina: res.hemoglobinaTxthemoglobina,
            vsg: res.vsglabclinicoTxtvsg,
            glucosa: res.glucosalabclinicoTxtglucosabio,
            creatinina: res.creatininalabclinicoTxtcreatininabio,
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
        onFinish
    );
    if (res) {
        set((prev) => ({
            ...prev,
            norden: res.norden,
            tipoExamen: res.nombreExamen,
            nombres: res.nombresPaciente + " " + res.apellidosPaciente,
            dni: res.dniPaciente,
            edad: res.edadPaciente,
            sexo: res.sexoPaciente,
            empresa: res.empresa,
            contrata: res.contrata,
            puestoPostula: res.ocupacionPaciente,
            areaTrabajo: res.areaPaciente,
            puestoActual: res.cargoPaciente,
            esOhla: res.esOhla ?? false,

            conclusiones: res.conclusiones,
            apto: res.apto ? "APTO" :
                (res.aptoConRestriccion ? "APTO CON RESTRICCION" : res.noApto ?
                    "NO APTO" : res.conObservacion ?
                        "CON OBSERVACION" :
                        res.evaluado ? "EVALUADO" : ""),
            fechaValido: res.fechaDesde,
            fechaVencimiento: res.fechaHasta,
            recomendaciones: res.recomendaciones,
            restricciones: res.restriccionesDescripcion,

            // Checkboxes de recomendaciones - mapeados basados en restriccionesDescripcion
            corregirAgudezaVisualTotal: res.restriccionesDescripcion?.includes("CORREGIR AGUDEZA VISUAL TOTAL PARA TRABAJO SOBRE 1.8 M.S.N.PISO") || false,
            corregirAgudezaVisual: res.restriccionesDescripcion?.includes("CORREGIR AGUDEZA VISUAL PARA TRABAJO SOBRE 1.8 M.S.N.PISO") || false,
            dietaHipocalorica: res.restriccionesDescripcion?.includes("DIETA HIPOCALÓRICA Y EJERCICIOS") || false,
            evitarMovimientosDisergonomicos: res.restriccionesDescripcion?.includes("EVITAR MOVIMIENTOS Y POSICIONES DISERGONÓMICAS") || false,
            noHacerTrabajoAltoRiesgo: res.restriccionesDescripcion?.includes("NO HACER TRABAJO DE ALTO RIESGO") || false,
            noHacerTrabajoSobre18: res.restriccionesDescripcion?.includes("NO HACER TRABAJO SOBRE 1.8 M.S.N.PISO") || false,
            usoEppAuditivo: res.restriccionesDescripcion?.includes("USO DE EPP AUDITIVO ANTE EXPOSICIÓN A RUIDO >=80 DB") || false,
            usoLentesConducir: res.restriccionesDescripcion?.includes("USO DE LENTES CORRECTORES PARA CONDUCIR Y/O OPERAR VEHÍCULOS MOTORIZADOS") || false,
            usoLentesTrabajo: res.restriccionesDescripcion?.includes("USO DE LENTES CORRECTORES PARA TRABAJO.") || false,
            usoLentesTrabajoSobre18: res.restriccionesDescripcion?.includes("USO DE LENTES CORRECTORES PARA TRABAJO SOBRE 1.8 M.S.N.PISO") || false,
            ninguno: res.restriccionesDescripcion?.includes("NINGUNO") || res.restriccionesDescripcion === "NINGUNO." || false,
            noConducirVehiculos: res.restriccionesDescripcion?.includes("NO CONDUCIR VEHÍCULOS") || false,
            // Médico que Certifica
            nombre_medico: res.nombreMedico,

            visionCercaOd: res.visioncercasincorregirodVCercaSOd,
            visionLejosOd: res.visionlejossincorregirodVLejosSOd,
            visionCercaOi: res.visioncercasincorregiroiVCercaSOi,
            visionLejosOi: res.visionlejossincorregiroiVLejosSOi,

            visionCercaOdCorregida: res.oftalodccmologiaOdcc,
            visionLejosOdCorregida: res.odlcoftalmologiaOdlc,
            visionCercaOiCorregida: res.oiccoftalmologiaOicc,
            visionLejosOiCorregida: res.oilcoftalmologiaOilc,

            visionColores: res.vcoftalmologiaVc,
            visionBinocular: res.vboftalmologiaVb,
            reflejosPupilares: res.rpoftalmologiaRp,
            enfermedadOculares: res.enfermedadesocularesoftalmoEOculares,

            hemoglobina: res.hemoglobinaTxthemoglobina,
            vsg: res.vsglabclinicoTxtvsg,
            glucosa: res.glucosalabclinicoTxtglucosabio,
            creatinina: res.creatininalabclinicoTxtcreatininabio,

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
        norden: form.norden,
        dni: form.dni,
        fecha: form.fechaValido,
        nombreMedico: form.nombre_medico,
        apto: form.apto === "APTO",
        aptoRestriccion: form.apto === "APTO CON RESTRICCION",
        noApto: form.apto === "NO APTO",
        conObservacion: form.apto === "CON OBSERVACION",
        evaluado: form.apto === "EVALUADO",
        restriccionesDescripcion: form.restricciones,
        horaSalida: getHoraActual(),
        fechaHasta: form.fechaVencimiento,
        recomendaciones: form.recomendaciones,
        conclusiones: form.conclusiones,
        usuarioRegistro: user,

        usuarioFirma: form.user_medicoFirma,
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
    const jasperModules = import.meta.glob("../../../../../jaspers/Ficha_Anexo16/*.jsx");
    PrintHojaRDefault(
        nro,
        token,
        tabla,
        datosFooter,
        obtenerReporteUrl,
        jasperModules,
        "../../../../../jaspers/Ficha_Anexo16"
    );
};
export const PrintHojaR2 = (nro, token, tabla, datosFooter) => {
    const jasperModules = import.meta.glob("../../../../../jaspers/Ficha_Anexo16/ResumenMedico/*.jsx");
    PrintHojaRDefault(
        nro,
        token,
        tabla,
        datosFooter,
        obtenerReporteResumenMedicoUrl,
        jasperModules,
        "../../../../../jaspers/Ficha_Anexo16/ResumenMedico"
    );
};

export const VerifyTR = async (nro, tabla, token, set, sede) => {
    VerifyTRPerzonalizado(
        nro,
        tabla,
        token,
        set,
        sede,
        () => {
            //NO Tiene registro
            GetInfoServicio(nro, tabla, set, token, () => { Swal.close(); });
        },
        () => {
            //Tiene registro
            GetInfoServicioEditar(nro, tabla, set, token, () => {
                Swal.fire(
                    "Alerta",
                    "Este paciente ya cuenta con registros de Ficha Aptitud Anexo 16.",
                    "warning"
                );
            });
        },
        () => {
            //Necesita Agudeza visual 
            Swal.fire(
                "Alerta",
                "El paciente necesita pasar por Anexo 16 para poder registrarse.",
                "warning"
            );
        }
    );
};

export const VerifyTRPerzonalizado = async (nro, tabla, token, set, sede, noTieneRegistro = () => { }, tieneRegistro = () => { }, necesitaExamen = () => { }) => {
    if (!nro) {
        await Swal.fire(
            "Error",
            "Debe Introducir un Nro de Historia Clínica válido",
            "error"
        );
        return;
    }
    Loading("Validando datos");
    getFetch(
        `/api/v01/ct/consentDigit/existenciaExamenes?nOrden=${nro}&nomService=${tabla}`,
        token
    ).then((res) => {
        if (res.id === 0) {
            //No tiene registro previo 
            noTieneRegistro();//datos paciente
        } else if (res.id === 2) {
            necesitaExamen();
        } else {
            tieneRegistro();//obtener data servicio
        }
    });
};

export const Loading = (mensaje) => {
    LoadingDefault(mensaje);
};
