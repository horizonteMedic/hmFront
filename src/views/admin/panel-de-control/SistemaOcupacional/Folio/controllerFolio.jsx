import Swal from "sweetalert2";
import {
    GetInfoPacDefault,
    LoadingDefault,
} from "../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../utils/formatDateUtils";
import { getFetch } from "../../../../utils/apiHelpers";

const GetExamenURL = `/api/v01/st/registros/obtenerExistenciasExamenes`
const GetExamenExterno = `/api/v01/st/registros/detalleUrlArchivos`
const GetNomenclatura = `/api/v01/ct/fichaInterconsulta/obtenerEspecialidadesNomenclaturaFichaInterconsulta`

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
    const existeInterconsultas = ExamenesList.some(exa => exa.nombre == "INTERCONSULTAS");
    const listaFiltrada = ExamenesList.filter(exa => exa.nombre != "INTERCONSULTAS");//limpiar interconsulta
    try {
        const res = await getFetch(`${GetExamenURL}?nOrden=${nro}`, token);

        let listaActualizada = [...listaFiltrada];

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
                    imprimir: match ? match.existe : false,
                };
            });
        }

        // 🔹 Procesar INTERCONSULTAS
        try {

            if (existeInterconsultas) { //SI EXISTE
                const interconsultasResponse = await getFetch(`${GetNomenclatura}?nOrden=${nro}`, token);

                // Validar si la respuesta tiene contenido y si al menos uno tiene nomenclatura
                if (interconsultasResponse?.resultado && Array.isArray(interconsultasResponse.resultado)) {
                    const interconsultasConNomenclatura = interconsultasResponse.resultado.filter(
                        (item) => item.nomenclatura && item.nomenclatura.trim() !== ""
                    );

                    // Si hay interconsultas con nomenclatura, agregarlas al final de la lista
                    if (interconsultasConNomenclatura.length > 0) {
                        const interconsultasFormateadas = interconsultasConNomenclatura.map((item) => ({
                            nombre: `INTERCONSULTA - ${item.especialidad}`,
                            resultado: true,
                            imprimir: true,
                            tabla: item.nomenclatura,
                            nomenclatura: item.nomenclatura,
                        }));

                        // Agregar interconsultas al final de la lista
                        listaActualizada = [...listaActualizada, ...interconsultasFormateadas];
                    }
                }
            }
        } catch (error) {
            console.error("Error al cargar interconsultas:", error);
            // No detenemos el flujo si falla la carga de interconsultas
        }

        // 🔹 Procesar ARCHIVOS EXTERNOS (dinámico por nomenclatura)
        // Filtrar exámenes que tienen nomenclatura
        const examenesConNomenclatura = listaActualizada.filter(
            (examen) => examen.nomenclatura
        );
        console.log("examenesConNomenclatura", examenesConNomenclatura);
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
                            imprimir: true,
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