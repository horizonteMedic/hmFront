import Swal from "sweetalert2";
import {
    GetInfoPacDefault,
    GetInfoServicioDefault,
    LoadingDefault,
    PrintHojaRDefault,
    SubmitDataServiceDefault,
    VerifyTRDefault,
} from "../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../utils/formatDateUtils";
import { getFetch } from "../../../../utils/apiHelpers";

const GetExamenURL = `/api/v01/st/registros/obtenerExistenciasExamenes`
const GetExamenExterno = `/api/v01/st/registros/detalleUrlArchivos`

export const GetInfoPac = async (nro, set, token, sede, ExamenesList) => {
    LoadingDefault("Validando datos");
    const res = await GetInfoPacDefault(nro, token, sede);
    if (res) {
        console.log(res);
        set((prev) => ({
            ...prev,
            ...res,
            fechaNacimiento: formatearFechaCorta(res.fechaNac ?? ""),
            edad: res.edad,
            ocupacion: res.areaO ?? "",
            nombreExamen: res.nomExam ?? "",
            cargoDesempenar: res.cargo ?? "",
            lugarNacimiento: res.lugarNacimiento ?? "",
            domicilioActual: res.direccion ?? "",
            sexo: res.genero === "M" ? "MASCULINO" : res.genero === "F" ? "FEMENINO" : "",
        }));
        GetExamenesCheck(nro, set, token, ExamenesList);
    }
};

const GetExamenesCheck = async (nro, set, token, ExamenesList) => {
    LoadingDefault("Cargando examenes");
    try {
        const res = await getFetch(`${GetExamenURL}?nOrden=${nro}`, token);

        let listaActualizada = [...ExamenesList];

        // 🔹 Procesar exámenes generales
        if (res) {
            const resArray = Object.values(res);

            listaActualizada = listaActualizada.map((examen) => {
                const match = resArray.find(
                    (item) => item.nameService === examen.tabla
                );

                return {
                    ...examen,
                    resultado: match ? match.existe : false,
                };
            });
        }

        // 🔹 Procesar ARCHIVOS EXTERNOS (dinámico por nomenclatura)
        // Filtrar exámenes que tienen nomenclatura
        const examenesConNomenclatura = ExamenesList.filter(
            (examen) => examen.nomenclatura
        );

        // Hacer todas las llamadas en paralelo
        const promesasArchivosExternos = examenesConNomenclatura.map((examen) =>
            getFetch(`${GetExamenExterno}/${nro}/${examen.nomenclatura}`, token)
                .then((response) => ({
                    nomenclatura: examen.nomenclatura,
                    tabla: examen.tabla,
                    response,
                }))
                .catch((error) => {
                    console.error(`Error al cargar ${examen.nomenclatura}:`, error);
                    return { nomenclatura: examen.nomenclatura, tabla: examen.tabla, response: null };
                })
        );

        const resultadosArchivosExternos = await Promise.all(promesasArchivosExternos);

        // Actualizar lista con los resultados de archivos externos
        resultadosArchivosExternos.forEach(({ tabla, response }) => {
            if (response?.id === 1) {
                listaActualizada = listaActualizada.map((examen) =>
                    examen.tabla === tabla
                        ? {
                            ...examen,
                            resultado: true,
                            url: response.mensaje,
                        }
                        : examen
                );
            }
        });

        // 🔹 Set final (un solo render)
        set((prev) => ({
            ...prev,
            listaExamenes: listaActualizada,
        }));

    } catch (error) {
        console.error("Error al cargar exámenes:", error);
    } finally {
        Swal.close();
    }

};