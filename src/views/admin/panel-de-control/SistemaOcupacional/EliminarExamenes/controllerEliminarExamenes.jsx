import Swal from "sweetalert2";
import { URLAzure } from "../../../../config/config";
import { GetInfoServicioDefault, LoadingDefault, GetInfoPacDefault } from "../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../utils/formatDateUtils";

const obtenerReporteUrl =
    "/api/v01/st/registros/obtenerExistenciasExamenes";

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
    fichaOIT: "",
    exRxSanguineos: "",
    fichaAntPatologicos: "antecedentesPatologicos",
    histOcupacional: "historiaOcupacional",
    cuestionarioNordico: "cuestionarioNordico",
    evMusculoEsqueletica: "",
    oftalmologia: "",
    actitudMedOcupacional: "",
    usoRespiradores: "",
    anexo16A: "",
    consentimientoDosaje: "",
    anexo16: "",
    electrocardiograma: "",
    // Trabajos en Altura
    certTrabAlturaBarrik: "",
    certTrabajoAltura: "",
    // Otros Formatos
    evMuscEsqueletico: "",
    cuestCalidadSueno: "",
    testFatSomnolencia: "",
    evalOftalmologica: "",
    certManipuladores: "",
    cuestAudiometria: "",
    informeAudiometria: "",
    perimetroToraxico: "",
    // Conducción de Vehículos
    fichaSAS: "",
    certConduccVehiculos: "",
    // Fichas Sin Restricción
    fMedica: "",
    fAptitudMedOcup: "",
    fMedicaAnexo2: "",
    fAptitudAnexo2: "",
    fMedAgro: "",
    fAptitudAgro: "",
}

export const VerifyTR = async (nro, tabla, token, set, sede) => {
    GetInfoPac(nro, set, token, sede);
    GetInfoServicio(nro, tabla, set, token, () => { Swal.close(); });
};
export const GetInfoServicio = async (
    nro,
    tabla,
    set,
    token,
    onFinish = () => { }
) => {
    LoadingDefault("Validando datos");
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
            
        }));
    }
};

export const DeleteExamen = async (norden, campo, token, setForm) => {
    if (!norden) {
        Swal.fire("Error", "Primero busque un paciente", "error");
        return;
    }
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
            const response = await fetch(`${URLAzure}/api/v01/ct/${urlsEliminar[campo]}/eliminar/${norden}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                Swal.fire("Eliminado", "El registro ha sido eliminado", "success");
                setForm((prev) => ({
                    ...prev,
                    [campo]: "",
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
            sexo: res.genero === "M" ? "MASCULINO" : "FEMENINO",
        }));
    }
};