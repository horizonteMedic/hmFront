import Swal from "sweetalert2";
import { URLAzure } from "../../../../config/config";
import { GetInfoServicioDefault, LoadingDefault, GetInfoPacDefault } from "../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../utils/formatDateUtils";
import { getFetch } from "../../../../utils/apiHelpers";

const obtenerReporteUrl =
    "/api/v01/st/registros/obtenerExistenciasExamenes";
const GetExamenURL = `/api/v01/st/registros/obtenerExistenciasExamenes`

const urlsEliminar = {
    // Examen Ocupacional
    triaje: "triaje",
    labClinico: "laboratorio",
    rxTorax: "rayosX",
    fichaAudiologica: "audiometria/fichaAudiologica",
    audiometria: "audiometria/audiometriaPo",
    espirometria: "espirometria",
    odontograma: "odontograma",
    psicologia: "informePsicologico",
    fichaOIT: "oit",
    exRxSanguineos: "", //pendiente
    fichaAntPatologicos: "antecedentesPatologicos",
    histOcupacional: "historiaOcupacional",
    cuestionarioNordico: "cuestionarioNordico",
    evMusculoEsqueletica: "evaluacionMusculoEsqueletica",
    oftalmologia: "agudezaVisual/fichaOftalmologica", //pendiente falta eliminar
    actitudMedOcupacional: "",
    usoRespiradores: "respiradores",
    anexo16A: "anexos/anexo16a",
    consentimientoDosaje: "laboratorio/consentimiento",
    anexo16: "anexos/anexo16",
    electrocardiograma: "electroCardiograma",
    // Trabajos en Altura
    certTrabAlturaBarrik: "certificadoTrabajoAltura", //pendiente
    certTrabajoAltura: "certificacionMedicinaAltura",
    // Otros Formatos
    evMuscEsqueletico: "evaluacionMusculoEsqueletica/booro",
    cuestCalidadSueno: "cuestionarioCalidadSueno",
    testFatSomnolencia: "testFatigaSomnolencia",
    evalOftalmologica: "agudezaVisual/evaluacionOftalmologica",
    certManipuladores: "certificadoManipuladoresAlimentos",
    cuestAudiometria: "audiometria/cuestionarioAudiometria",
    informeAudiometria: "audiometriaPo",
    perimetroToraxico: "",
    // Conducción de Vehículos
    fichaSAS: "fichaApneaSueno",
    certConduccVehiculos: "certificadoConduccion",
    // Fichas Sin Restricción 
    fAptitudMedOcup: "anexos/fichaAnexo16",
    fMedicaAnexo2: "anexos/anexo2",
    fAptitudAnexo2: "anexos/fichaAnexo2",
    fMedAgro: "", //pendiente
    fAptitudAgro: "", //pendiente   
}

export const VerifyTR = async (nro, tabla, token, set, sede, ExamenesList) => {
    GetInfoPac(nro, set, token, sede, ExamenesList);
};

export const DeleteExamen = async (norden, campo, token, setForm, form) => {
    if (!norden) {
        Swal.fire("Error", "Primero busque un paciente", "error");
        return;
    }
    console.log(campo)
    const result = await Swal.fire({
        title: "¿Está seguro?",
        text: `¿Desea eliminar el registro de ${campo}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
        try {
            const response = await fetch(`${URLAzure}/api/v01/ct/${urlsEliminar[campo]}/eliminar/${norden}${campo === "consentimientoDosaje" ? "/consent_Muestra_Sangre" : ""}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response)
            if (response.ok === true) {
                const actualizarLista = (lista, campo) =>
                    lista.map(section => ({
                        ...section,
                        items: section.items.map(item =>
                            item.name === campo
                                ? { ...item, resultado: false, imprimir: false }
                                : item
                        )
                    }));
                Swal.fire("Eliminado", "El registro ha sido eliminado", "success");
                setForm((prev) => ({
                    ...prev,
                    [campo]: "",
                    listaExamenes: actualizarLista(prev.listaExamenes, campo),
                }));
            } else {
                Swal.fire("Error", "No se pudo eliminar el registro", "error");
            }
        } catch (error) {
            console.error("Error:", error);
            Swal.fire("Error", "Error de conexión", "error");
        }
    }
};

const GetInfoPac = async (nro, set, token, sede, ExamenesList) => {
    LoadingDefault("Validando datos");
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
        GetExamenesCheck(nro, set, token, ExamenesList);
    }
};

const GetExamenesCheck = async (nro, set, token, ExamenesList) => {
    LoadingDefault("Cargando examenes");

    try {
        const res = await getFetch(`${GetExamenURL}?nOrden=${nro}`, token);
        console.log('respuesta', res)

        // 🔹 1. Normalizar respuesta a mapa por nameService
        const serviciosMap = Object.values(res).reduce((acc, item) => {
            acc[item.nameService] = item.existe;
            return acc;
        }, {});
        console.log("servicios normalizados", serviciosMap)
        // 🔹 2. Mapear lista base de exámenes
        const configActualizada = ExamenesList.map(section => ({
            ...section,
            items: section.items.map(item => {
                const existe = serviciosMap[item.tabla] === true;

                return {
                    ...item,
                    resultado: existe,
                };
            }),
        }));

        console.log('configActualizada', configActualizada)
        // 🔹 3. Set único (sin renders extras)
        set(prev => ({
            ...prev,
            listaExamenes: configActualizada,
        }));


    } catch (error) {
        console.error("Error al cargar exámenes:", error);
    } finally {
        Swal.close();
    }

};
