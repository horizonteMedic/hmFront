import Swal from "sweetalert2";
import {
    GetInfoPacDefault,
    GetInfoServicioDefault,
    LoadingDefault,
    PrintHojaRDefault,
    SubmitDataServiceDefault,
} from "../../../../../utils/functionUtils";
import { getFetch } from "../../../../../utils/apiHelpers";
import { getHoraActual, getToday } from "../../../../../utils/helpers";
import Hoja_Consulta_Externa from "../../../../../jaspers/HojaConsultaExterna/Hoja_Consulta_Externa";

const obtenerReporteUrl =
    "/api/v01/ct/hojaConsultaExterna/obtenerReporteHojaConsultaExterna";
const registrarUrl =
    "/api/v01/ct/hojaConsultaExterna/registrarActualizarHojaConsultaExterna";
const today = getToday();

const generarObservaciones = (res) => {
  return [
`A- ANAMNESIS: COLABORADOR REFIERE SENTIRSE BIEN, SIN PROBLEMAS DE SALUD, NO practica deporte o deporte de alto rendimiento.
B- ANTECEDENTES PERSONALES: ${res.anexo16AntecedentesPersonales2 || "SIN DATOS."}
C- ANTECEDENTES FAMILIARES: ${res.anexo16AntecedentesFamiliares || "JALARLO DEL ANEXO 16."},
D- EXAMEN FISICO:
- ABEG, LOTEP, CAMINANDO NORMALMENTE. VENTILANDO ESPONTANEAMENTE
- CABEZA: NORMOCÉFALO, CENTRAL, MÓVIL, PUPILAS ISOCÓRICAS, FOTO REACTIVAS. NO SE PALPA MASAS NI DEPRESIONES. 
- BOCA: HUMEDA, LENGUA MÓVIL, CENTRAL, NO SE EVIDENCIA LESIONES,
- CUELLO: CENTRAL, MÓVIL, NO TUMORACIONES.
- TÓRAX: BPMV EN ACP, NO RALES.
- CARDIOVASCULAR: RCRR, NO SOPLOS. PULSOS PERIFERICOS PALPABLES
- ABDOMEN: PLANO, RHA PRESENTES, NO DOLOR A LA PALPACIÓN SUPERFICIAL NI PROFUNDA, NO SE PALPA MASAS NI TUMORACIONES.
- RENAL: SIGNO PUÑO PERCUSIÓN BILATERAL NEGATIVO, 
- UROLÓGICO: PUNTOS RENOURETERALES NEGATIVOS.
- COLUMNA VERTEBRAL: CENTRAL, CURVATURAS CONSERVADAS, MOVILIDAD CONSERVADA.
- SISTEMA OSTEOMUSCULAR: MOTRICIDAD CONSERVADA. EXTREMIDADES SIMÉTRICAS. FUERZA MUSCULAR 5/5.
- GENITALES: DIFERIDO
- SISTEMA NERVIOSO: SENSIBILIDAD, MOTRICIDAD CONSERVADA, ROTS CONSERVADOS, BIPEDESTACIÓN CONSERVADA, EQUILIBRIO CONSERVADO, ROMBERG NEGATIVO. NO SIGNOS MENÍNGEOS. NO SIGNOS DE FOCALIZACION, NERVIOS CRANEALES CONSERVADOS, GLASGLOW 15 PTOS.
E- EXÁMENES AUXILIARES: \n${res.anexo16OtrosExamenes || "JALARLO DE LOS EXÁMENES DE LABORATORIO."}
F- DIAGNÓSTICOS: \n${res.anexo16ObservacionesGenerales || "JALARLO DE LOS DIAGNÓSTICOS DEL ANEXO 16."}`
  ].join("\n\n");
};

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
    console.log(res)
    if (res) {
        console.log(res)
        console.log(generarObservaciones(res))
        set((prev) => ({
            ...prev,
            ...res,
            nombres: `${res.nombresPaciente} ${res.apellidosPaciente}`,
            sexo: `${res.sexoPaciente === "F" ? "Femenino" : "Masculino"}`,
            dniUser: res.dniUsuario,            
            edadPaciente: res.edadPaciente,
            nombreExamen: res.nombreExamen,
            empresa: res.empresa,
            contrata: res.contrata,
            cargoPaciente: res.cargoPaciente,
            ocupacionPaciente: res.ocupacionPaciente,
            fechaExamen: prev.fechaExamen,
            observaciones: generarObservaciones(res),
            
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
        console.log(res)
        set((prev) => ({
            ...prev,
            ...res,
            // Header
            nombres: `${res.nombresPaciente} ${res.apellidosPaciente}`,
            sexo: `${res.sexoPaciente === "F" ? "Femenino" : "Masculino"}`,
            edadPaciente: `${res.edadPaciente} AÑOS`,
            dniUser: res.dniUsuario,
            cajon: res.paraiso ? "PARAISO" : res.postaVijus ? "POSTA VIJUS" : res.cedro ? "CEDRO" : res.otros ? "OTROS" : "",
            nombre_medico: res.nombreMedico
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
        "dni": form.dniPaciente,
        "fechaExamen": form.fechaExamen,
        "horaSalida": getHoraActual(),
        "nombreMedico": form.nombre_medico,
        "postaVijus": form.cajon === "POSTA VIJUS" ? true : false,
        "cedro": form.cajon === "CEDRO" ? true : false,
        "paraiso": form.cajon === "PARAISO" ? true : false,
        "otros": form.cajon === "OTROS" ? true : false,
        "otrosDescripcion": form.otrosDescripcion,
        "observaciones": form.observaciones.toUpperCase(),
        "usuarioRegistro": user
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
    const jasperModules = import.meta.glob("../../../../../jaspers/HojaConsultaExterna/*.jsx");
    PrintHojaRDefault(
        nro,
        token,
        tabla,
        datosFooter,
        obtenerReporteUrl,
        jasperModules,
        "../../../../../jaspers/HojaConsultaExterna"
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
                    "Este paciente ya cuenta con registros de Consulta Externa",
                    "warning"
                );
            });
        },
        () => {
            //Necesita Agudeza visual 
            Swal.fire(
                "Alerta",
                "El paciente necesita pasar por ANEXO 16 primero (OBLIGATORIO)",
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
        console.log(res)
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