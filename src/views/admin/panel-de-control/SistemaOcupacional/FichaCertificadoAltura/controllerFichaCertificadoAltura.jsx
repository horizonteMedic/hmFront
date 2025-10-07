import Swal from "sweetalert2";
import {
    GetInfoServicioDefault,
    LoadingDefault,
    PrintHojaRDefault,
    SubmitDataServiceDefault,
} from "../../../../utils/functionUtils";
import { getFetch } from "../../../../utils/apiHelpers";

const obtenerReporteUrl =
    "/api/v01/ct/certificadoTrabajoAltura/obtenerReporteCertificadoTrabajoAltura";
const registrarUrl =
    "/api/v01/ct/certificadoTrabajoAltura/registrarActualizarCertificadoTrabajoAltura";

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
            // Header
            norden: res.norden ?? "",
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
        codigoCertificado: form.codigoCertificado,
        dniPaciente: form.dni,
        tiempoExperiencia: form.experienciaAnios,
        edad: form.edad.replace(" años", ""),
        primeraAptitud: form.razonVisita === "PRIMERA ACTITUD",
        revalidacion: form.razonVisita === "REVALIDACION",
        fechaExamen: form.fechaExam,
        antecedentesTodasEnfermedadesSi: form.alteracionConsciencia,
        antecedentesTodasEnfermedadesNo: !form.alteracionConsciencia,
        antecedentesAlcoholismoCronicoSi: form.alcoholismoCronico,
        antecedentesAlcoholismoCronicoNo: !form.alcoholismoCronico,
        antecedentesEnfermedadesInvoluntariosSi: form.movimientosInvoluntariosEnfermedades,
        antecedentesEnfermedadesInvoluntariosNo: !form.movimientosInvoluntariosEnfermedades,
        antecedentesPerdidaConcienciaSi: form.perdidaRecurrenteConsciencia,
        antecedentesPerdidaConcienciaNo: !form.perdidaRecurrenteConsciencia,
        antecedentesConsumeSustanciasSiAltereSi: form.sustanciasEstupefacientesConAlteracion,
        antecedentesConsumeSustanciasSiAltereNo: !form.sustanciasEstupefacientesConAlteracion,
        antecedentesConsumeSustanciasNoAltereSi: form.sustanciasEstupefacientesSinTratamiento,
        antecedentesConsumeSustanciasNoAltereNo: !form.sustanciasEstupefacientesSinTratamiento,
        antecedentesVariosEfectosSi: form.efectosEnfermedadTratamiento,
        antecedentesVariosEfectosNo: !form.efectosEnfermedadTratamiento,
        antecedentesApneaSi: form.sindromeApneaObstructivaSueño,
        antecedentesApneaNo: !form.sindromeApneaObstructivaSueño,
        antecedentesObesidadSi: form.obesidadIMC30,
        antecedentesObesidadNo: !form.obesidadIMC30,
        pcomplementariasHipoacusiaSi: form.hipoacusiaFrecuenciasConversacionales,
        pcomplementariasHipoacusiaNo: !form.hipoacusiaFrecuenciasConversacionales,
        pcomplementariasAlteracionAgudezaVisualSi: form.alteracionAgudezaVisual,
        pcomplementariasAlteracionAgudezaVisualNo: !form.alteracionAgudezaVisual,
        pcomplementariasTemorAlturasSi: form.temorAlturas,
        pcomplementariasTemorAlturasNo: !form.temorAlturas,
        pcomplementariasResfriadoSi: form.resfriadoCuadroRespiratorio,
        pcomplementariasResfriadoNo: !form.resfriadoCuadroRespiratorio,
        pcomplementariasVertigoSi: form.vertigoMareos,
        pcomplementariasVertigoNo: !form.vertigoMareos,
        pcomplementariaCampimetriaSi: form.campimetriaAnormal,
        pcomplementariaCampimetriaNo: !form.campimetriaAnormal,
        examenFisicoLimitacionFuerzaSi: form.limitacionFuerzaExtremidades,
        examenFisicoLimitacionFuerzaNo: !form.limitacionFuerzaExtremidades,
        examenFisicoAlteracionEquilibrioSi: form.alteracionEquilibrio,
        examenFisicoAlteracionEquilibrioNo: !form.alteracionEquilibrio,
        examenFisicoAnormalidadMarchaSi: form.anormalidadMarcha,
        examenFisicoAnormalidadMarchaNo: !form.anormalidadMarcha,
        examenFisicoAlteracionCoordinacionSi: form.alteracionCoordinacionDedoNariz,
        examenFisicoAlteracionCoordinacionNo: !form.alteracionCoordinacionDedoNariz,
        examenFisicoAsimetriaFacialSi: form.asimetriaFacial,
        examenFisicoAsimetriaFacialNo: !form.asimetriaFacial,
        exameFisicoNistagmusSi: form.presenciaNistagmus,
        exameFisicoNistagmusNo: !form.presenciaNistagmus,
        examenFisicoAnormalidadMovimientoSi: form.anormalidadMovimientosOculares,
        examenFisicoAnormalidadMovimientoNo: !form.anormalidadMovimientosOculares,
        examenFisicoCirlaSi: !form.pupilasNoCirla,
        examenFisicoCirlaNo: form.pupilasNoCirla,
        examenFisicoAnormalidadLenguajeSi: form.anormalidadLenguaje,
        examenFisicoAnormalidadLenguajeNo: !form.anormalidadLenguaje,
        examenFisicoMovimientoInvoluntarioSi: form.movimientosInvoluntarios,
        examenFisicoMovimientoInvoluntarioNo: !form.movimientosInvoluntarios,
        antecedentesDiabetesMellitusSi: form.diabetesHipoglicemiaNoControlada,
        antecedentesDiabetesMellitusNo: !form.diabetesHipoglicemiaNoControlada,
        fechaDesde: form.aptoDesde,
        fechaHasta: form.aptoHasta,
        apto: form.conclusion === "APTO",
        observado: form.conclusion === "OBSERVADO",
        dniUsuario: form.dniUsuario,
        detalleMedicina: form.medicinasTomando,
        detalleInformacion: form.detalleInformacionExamenFisico,
        noApto: form.conclusion === "NO APTO",
        aptoConRestriccion: form.conclusion === "APTO CON RESTRICCION",
        observacionesRecomendaciones: form.observacionesRecomendaciones,
        antecedentesComentariosDetalles: form.comentariosDetalleAntecedentes,
        usuarioRegistrar: user,
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
    const jasperModules = import.meta.glob("../../../../jaspers/CertificadoAltura/*.jsx");
    PrintHojaRDefault(
        nro,
        token,
        tabla,
        datosFooter,
        obtenerReporteUrl,
        jasperModules,
        "../../../../jaspers/CertificadoAltura"
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
                    "Este paciente ya cuenta con registros de Ficha Certificado de Altura",
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
