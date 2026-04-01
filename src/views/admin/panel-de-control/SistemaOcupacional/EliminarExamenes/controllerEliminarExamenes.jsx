import Swal from "sweetalert2";
import { URLAzure } from "../../../../config/config";
import { GetInfoServicioDefault, LoadingDefault, GetInfoPacDefault } from "../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../utils/formatDateUtils";
import { getFetch } from "../../../../utils/apiHelpers";

const obtenerReporteUrl =
    "/api/v01/st/registros/obtenerExistenciasExamenes";
const GetExamenURL = `/api/v01/st/registros/obtenerExistenciasExamenes`
const obtenerAnexosExistencia = `/api/v01/ct/anexos/cerrado`
const GetNomenclatura = `/api/v01/ct/fichaInterconsulta/obtenerEspecialidadesNomenclaturaFichaInterconsulta`
const obtenerEspecialidad =
    "/api/v01/ct/fichaInterconsulta/obtenerEspecialidadesFichaInterconsulta";

const urlsEliminar = {
    // Examen Ocupacional
    triaje: "triaje",
    labClinico: "laboratorio",

    rxTorax: "rayosX",
    radiografia: "rayosX/radiografia",
    CuestMujeres: "rayosX/consentimiento-mujeres",

    fichaAudiologica: "audiometria/fichaAudiologica",
    audiometria: "audiometria/audiometriaPo",
    espirometria: "espirometria",
    odontograma: "odontograma",
    psicologia: "informePsicologico",
    fichaOIT: "oit",
    exRxSanguineos: "anexos/rx-sanguineo", //pendiente
    fichaAntPatologicos: "antecedentesPatologicos",
    histOcupacional: "historiaOcupacional",
    cuestionarioNordico: "cuestionarioNordico",
    evMusculoEsqueletica: "evaluacionMusculoEsqueletica",
    oftalmologia: "agudezaVisual/fichaOftalmologica", //pendiente falta eliminar
    actitudMedOcupacional: "anexos/fichaAnexo2",
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
    //Laboratorio
    Hemograma: "laboratorio/hemograma",
    Hemoglobina: "laboratorio/hemoglobina",
    PerfilLipidico: "analisisBioquimico/perfilLipidico",
    PerfilRenal: "analisisBioquimico/perfilRenal",
    AcidoUrico: "analisisBioquimico/acidoUrico",
    PerfilHepatico: "analisisBioquimico/perfilHepatico",
    RiesgoCoronario: "riesgoCoronario",
    ToleranciaGlucosa: "glucosaTolerancia",
    GlucosaBasal: "laboratorio/glucosaBasal",
    PCRUltrasensible: "pcrUltrasensible",
    Gonadotropina: "inmunologia/lgonadotropina",
    BKKOH: "inmunologia/microbiologia",
    //
    Aglutinaciones: "inmunologia/aglutinaciones",
    Hepatitis: "inmunologia/hepatitis",
    VDRL: "inmunologia/vdrl",
    VIH: "inmunologia/vih",
    Thevenon: "inmunologia/thevenon",
    Panel2D: "toxicologia/panel2D",
    Panel3D: "toxicologia/panel3D",
    Panel4D: "toxicologia/panel4D",
    Panel5D: "toxicologia/panel5D",
    Panel10D: "toxicologia/panel10D",
    EtanolSaliva: "etanolSaliva",
    Consentimiento2d: "laboratorio/consentimiento",
    Consentimiento3d: "laboratorio/consentimiento",
    Consentimiento4d: "laboratorio/consentimiento",
    Consentimiento5d: "laboratorio/consentimiento",
    Consentimiento10d: "laboratorio/consentimiento",
    ConsentimientoMari: "laboratorio/consentimiento",
    ConsentimientoBoro: "laboratorio/consentimientoBoro",
    Coprocultivo: "manipuladores/coprocultivo",
    Coproparasitológico: "manipuladores/coproparasitologico",
    ExamenOrina: "laboratorio/orina",
    PruebaAntigenos: "pruebasCovid/pruebaCualitativa",
    //Consentimientos
    ConstInformado: "anexos/consentimiento-informado",
    ConstBuenaSalud: "anexos/consentimiento-buena-salud",
    CONSENT_SINTOMATICO: "consentimientos/consentimientos-admision",
    CONSENT_INFORMADO_MEDICA: "consentimientos/consentimientos-admision",
    CONSENT_RECOM_MEDIC: "consentimientos/consentimientos-admision",
    DECLA_JURA_ANTECE_PERSON_FAM: "consentimientos/consentimientos-admision",
    DECLA_INFO_APTITUD_MO: "consentimientos/consentimientos-admision",
    ConstBrigadista: "constaBrigadista/consta-brigadista",
    ConformidadEmo: "registroConformidadEmo/conformidad-emo",
    //PSICOLOGIA
    Fobias: "fobias/fobias",
    AversionRiesgo: "aversionRiesgo/aversion-riesgo",
    AlturaPsico: "informePsicologicoFobias/informe-psicologico-fobias",
    TrastornoPersonalidad: "transtornoPersonalidad/trastorno-personalidad",
    InformeConduc: "informeConductores/informe-conductores",
    AltoRiesgo: "altoRiesgo/alto-riesgo",
    TrabajosEspeci: "trabajoEspecifico/trabajos-especificos",
    CuestionarioBer: "cuestionarioBerlin/cuestionario-berlin",
    ExamComp: "examenComplementario/examen-complementario",
    Brigadista: "psiBrigadista/informe-brigadista",
    BombaElec: "bombaElectrica/bomba-electrica",
    InformePsico: "informePsicolaboral/informe-psicolaboral",
    InformeRiesgoPsico: "informeRiesgoPsicosocial/informe-riesgo-psicosocial",
    InformeBurnout: "informeBurnout/informe-burnout",
    InformePsicoAdeco: "informePsicologicoAdeco/informe-psicologico-adeco",
    PsicoEspaciosConfi: "psicologiaEspaciosConfinados/psicologia-espacios-confinados",
    AnteceEnfeAltura: "antecedentesEnfermedadesAltura/antecedentes-enfermedades-altura",
    audiometria_2023: "manipuladores/audiometria-2023",
    //Poderosa
    CertAlturaPoderosa: "certificadoTrabajoAltura",
    CertAptitudPoderosa: "aptitudCertificadoCaliente/aptitud-certificado-caliente",
    AptitudLicencia: "aptitudLicenciaConducir/aptitud-licencia-conducir",
    HojaConsultaEx: "hojaConsultaExterna/hoja-consulta-externa",
    CertManpAlimentos: "certificadoManipuladoresAlimentos",
    AptiHerramientas: "certificadoAptitudHerramientasManuales/certificado-aptitud-herramientas-manuales",
    FichaDatosPacientes: "fichaDatosPersonales/ficha-datos-personales",
    CertAptiBrigadista: "certificadoAptitudBrigadista/certificado-aptitud-brigadista",
    DireccionMina: "ministerioEnergiaMinas/ministerio-energia",
    HojaRutaEMO: "hojaRutaEmo/hoja-ruta-emo",
}

const camposExtraEliminar = {
    consentimientoDosaje: "consent_Muestra_Sangre",
    CONSENT_SINTOMATICO: "CONSENT_SINTOMATICO",
    CONSENT_INFORMADO_MEDICA: "CONSENT_INFORMADO_MEDICA",
    CONSENT_RECOM_MEDIC: "CONSENT_RECOM_MEDIC",
    DECLA_JURA_ANTECE_PERSON_FAM: "DECLA_JURA_ANTECE_PERSON_FAM",
    DECLA_INFO_APTITUD_MO: "DECLA_INFO_APTITUD_MO",
    Consentimiento2d: "con_panel2D",
    Consentimiento3d: "con_panel3D",
    Consentimiento4d: "con_panel4D",
    Consentimiento5d: "con_panel5D",
    Consentimiento10d: "con_panel10D",
    ConsentimientoMari: "consent_marihuana",
};

export const VerifyTR = async (nro, tabla, token, set, sede, ExamenesList) => {
    GetInfoPac(nro, set, token, sede, ExamenesList);
};

export const DeleteExamen = async (norden, campo, token, setForm, form) => {
    if (!norden) {
        Swal.fire("Error", "Primero busque un paciente", "error");
        return;
    }
    if (campo === "interconsulta") {
        const res = await getFetch(
            `${obtenerEspecialidad}?nOrden=${norden}`,
            token
        );
        if (Array.isArray(res) && res.length > 0) {
            const inputOptions = res.reduce((acc, item) => {
                acc[item.mensaje] = item.mensaje;
                return acc;
            }, {});
            const totalRadios = Object.keys(inputOptions).length;
            let height = 300; // base
            let width;
            if (totalRadios <= 2) width = "400px";
            else if (totalRadios <= 5) width = "550px";
            else if (totalRadios <= 8) width = "700px";
            else width = "900px";
            if (totalRadios > 5) height += (totalRadios - 5) * 30; // suma 40px por cada extra
            // Mostrar SweetAlert con radios
            const { value: seleccion } = await Swal.fire({
                title: "¿Qué especialidad desea eliminar?",
                input: "radio",
                inputOptions,
                inputValidator: (value) => {
                    if (!value) return "Debes seleccionar una opción o crear una nueva.";
                },
                showCancelButton: true,
                confirmButtonText: "Eliminar",
                cancelButtonText: "Cancelar",
                allowOutsideClick: false,
                customClass: {
                    popup: "swal-dinamico",
                },
                didOpen: () => {
                    const popup = Swal.getPopup();
                    popup.style.maxHeight = `${height}px`;
                    popup.style.width = width; // ← se aplica el ancho dinámico aquí
                }
            });
            if (seleccion) {
                console.log("✅ Especialidad seleccionada:", seleccion);
                const response = await fetch(`${URLAzure}/api/v01/ct/fichaInterconsulta/ficha-interconsulta/eliminar/${norden}/${seleccion}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.ok === true) {
                    Swal.fire("Eliminado", "El registro ha sido eliminado", "success");
                    GetExamenesCheck(norden, setForm, token, form.listaExamenes, false);
                } else {
                    Swal.fire("Error", "No se pudo eliminar el registro", "error");
                }
                return
            } else {
                return
            }
        }
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
            const extra = camposExtraEliminar[campo]
                ? `/${camposExtraEliminar[campo]}`
                : "";
            const response = await fetch(`${URLAzure}/api/v01/ct/${urlsEliminar[campo]}/eliminar/${norden}${extra}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok === true) {

                /*const actualizarLista = (lista, campo) =>
                    lista.map(section => ({
                        ...section,
                        items: section.items.map(item => {
                            // 🔴 Caso especial
                            if (campo === "anexo16") {
                                if (item.name === "anexo16" || item.name === "exRxSanguineos") {
                                    return { ...item, resultado: false, imprimir: false };
                                }
                            }

                            // 🟢 Caso normal
                            if (item.name === campo) {
                                return { ...item, resultado: false, imprimir: false };
                            }

                            return item;
                        })
                    }));*/

                Swal.fire("Eliminado", "El registro ha sido eliminado", "success");
                GetExamenesCheck(norden, setForm, token, form.listaExamenes, false)
                /*setForm((prev) => ({
                    ...prev,

                    // 🔴 Caso especial en el state plano
                    ...(campo === "anexo16"
                        ? {
                            anexo16: false,
                            exRxSanguineos: prev.exRxSanguineos ? false : false // (siempre false, pero explícito)
                        }
                        : {
                            [campo]: ""
                        }),

                    listaExamenes: actualizarLista(prev.listaExamenes, campo),
                }));*/
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

const GetExamenesCheck = async (nro, set, token, ExamenesList, carga = true) => {
    if (carga === true) LoadingDefault("Cargando examenes")

    try {
        const [res, anexo16, anexo2, interconsulta] = await Promise.allSettled([
            getFetch(`${GetExamenURL}?nOrden=${nro}`, token),
            getFetch(`${obtenerAnexosExistencia}?tabla=anexo7c&nOrden=${nro}`, token),
            getFetch(`${obtenerAnexosExistencia}?tabla=anexo_agroindustrial&nOrden=${nro}`, token),
            getFetch(`${GetNomenclatura}?nOrden=${nro}`, token)
        ]);
        console.log('respuesta', res, anexo16, anexo2, interconsulta)

        const listInterconsultas = interconsulta.value?.resultado ? interconsulta.value?.resultado : []

        const especialidades = listInterconsultas.map(i => i.especialidad);
        // 🔹 1. Normalizar respuesta a mapa por nameService
        const serviciosMap = Object.values(res.value).reduce((acc, item) => {
            acc[item.nameService] = item.existe;
            return acc;
        }, {});
        console.log("servicios normalizados", serviciosMap)
        // 🔹 2. Mapear lista base de exámenes
        const configActualizada = ExamenesList.map(section => ({
            ...section,
            items: mapItemsRecursivo(section.items, serviciosMap, anexo16.value, anexo2.value, especialidades),
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

const mapItemsRecursivo = (items, serviciosMap, anexo16, anexo2, especialidades) => {
    return items.map(item => {
        // 🔹 CASO 1: Es grupo (tiene sub-items)
        if (item.items && item.title) {
            return {
                ...item,
                items: mapItemsRecursivo(item.items, serviciosMap, anexo16, anexo2, especialidades)
            };
        }

        // 🔹 CASO 2: Es item normal
        if (item.tabla === "interconsulta") {
            return {
                ...item,
                resultado: especialidades, // array
            };
        }
        let existe;

        if (item.tabla === "anexo7c") {
            existe = anexo16;
        } else if (item.tabla === "ex_radiograficos_sanguineos") {
            existe = anexo16;
        } else if (item.tabla === "anexo_agroindustrial") {
            existe = anexo2;
        } else {
            existe = serviciosMap[item.tabla] === true;
        }

        return {
            ...item,
            resultado: existe,
        };
    });
};