import { formatearFechaCorta } from "../../../../utils/formatDateUtils";
import { GetInfoServicioDefault
        , PrintHojaRDefault 
} from "../../../../utils/functionUtils";
import { getHoraActual } from "../../../../utils/helpers";

const obtenerReporteUrl = "/api/v01/ct/anexos/anexo16/obtenerReporteConsentimientoInformado";
const registrarUrl = "/api/v01/ct/anexos/anexo16/registrarActualizarConsentimientoInformado";

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
        set((prev) => ({
            ...prev,
            ...res,
            norden: res.norden ?? "",
            nombreExamen: res.nombreExamen,

             nombres: `${res.nombresPaciente ?? ""} ${res.apellidosPaciente ?? ""}`,
             fechaNacimiento: formatearFechaCorta(res.fechaNacimientoPaciente ?? ""),
             lugarNacimiento: res.lugarNacimiento ?? "",
             dniPaciente: res.dniPaciente,

             edad: res.edadPaciente ?? "",
             sexo: res.sexoPaciente === "M" ? "MASCULINO" : "FEMENINO",
             estadoCivil: res.estadoCivil ?? "",
             nivelEstudios: res.nivelEstudio ?? "",
             // Datos Laborales
             empresa: res.empresa ?? "",
             contrata: res.contrata ?? "",
             ocupacion: res.areaPaciente ?? "",
             cargoDesempenar: res.cargoPaciente ?? "",
            apto: "APTO",
            fechaExamen: `${res.fechaExamen ? res.fechaExamen : today}`,
            fechaDesde: `${res.fechaDesde ? res.fechaDesde : today}`,
            fechahasta: `${res.fechahasta ? res.fechahasta : today}`,

            user_medicoFirma: res.usuarioFirma ? res.usuarioFirma : prev.user_medicoFirma,

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
            nombres: `${res.nombrePaciente} ${res.apellidoPaciente}`,
            user_medicoFirma: res.usuarioFirma ? res.usuarioFirma : prev.user_medicoFirma,
            sexo: `${res.sexoPaciente === "F" ? "Femenino" : "Masculino"}`,
            PA: `${res.sistolica}/${res.diastolica}`,
            edadPaciente: res.edadPaciente,
            dniUser: res.dniUsuario,
            apto: res.apto ? "APTO" : res.aptoconrestriccion ? "APTOCONRESTRICCION" : "NOAPTO"
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
        "dniPaciente": form.dniPaciente,
        "fecha": form.fechaDesde,
        "nombreMedico": "",
        "apto": form.apto === "APTO" ? true : false,
        "aptoConRestriccion": form.apto === "APTOCONRESTRICCION" ? true : false,
        "noApto": form.apto === "NOAPTO" ? true : false,
        "horaSalida": getHoraActual(),
        "fechaHasta": form.fechahasta,
        "conclusiones": form.conclusiones,
        userRegistro: user,
        usuarioFirma: form.user_medicoFirma,
    };

    await SubmitDataServiceDefault(token, limpiar, body, registrarUrl, () => {
        PrintHojaR(form.norden, token, tabla, datosFooter);
    });
};
export const PrintHojaR = (nro, token, tabla, datosFooter) => {
    const jasperModules = import.meta.glob("../../../../../../jaspers/ModuloPsicologia/InformePsicoBrigadista/*.jsx");
    PrintHojaRDefault(
        nro,
        token,
        tabla,
        datosFooter,
        obtenerReporteUrl,
        jasperModules,
        "../../../../../../jaspers/ModuloPsicologia/InformePsicoBrigadista"
    );
};
export const Valores = {
    CHECK1: `- LABORATORIO: Hb / Hto, Grupo Sanguíneo y Factor ({grupoFactor}), Glucosa, Ex. orina, 
- APTITUD
- ANEXO 16
- ANTECEDENTES ENFERMEDADES EN ALTURA
- ANEXO 16-A
- USO DE RESPIRADORES
- HISTORIA OCUPACIONAL
- ANTECEDENTES PATOLOGICOS
- CUESTIONARIO NORDICO
- MUSCULO ESQUELETICO
- OIT
- ESPIROMETRIA
- AUDIOMETRIA
- ODONTOLOGIA
- PSICOLOGIA
- AG. VISUAL
- CONSENTIMIENTO INFORMADO
- DECLARACION DE BUENA SALUD
- COPIA DE DNI


        `,

    CHECK2: `- LABORATORIO: Hma, Hb / Hto, Grupo Sanguíneo y Factor ({grupoFactor}), Glucosa, Ex. orina, 
        - APTITUD MÉDICA
- ANEXO 16
- ANTECEDENTES ENFERMEDADES EN ALTURA
- ANEXO 16-A
- PSICOSENSOMETRIA
- CERTIFICADO DE CONDUCCION
- FICHA SAS
- USO DE RESPIRADORES
- HISTORIA OCUPACIONAL 
- ANTECEDENTES PATOLOGICOS
- CUESTIONARIO NORDICO
- FICHA MUSCULO ESQUELETICO
- OIT
- ESPIROMETRIA
- AUDIOMETRIA
- ODONTOLOGIA
- INFORME PSICOLOGICO
- AGUDEZA VISUAL
- DECLARACION DE BUENA SALUD
- CONSENTIMIENTO INFORMADO
- COPIA DE DNI
- COPIA DE LICENCIA DE CONDUCIR


`,

    CHECK3: `- LABORATORIO: Hma, Hb / Hto, Glucosa, Ex. Orina,Grupo Sanguineo y Factor ({grupoFactor})
  - APTITUD MÉDICA
- ANEXO 16
- HISTORIA OCUPACIONAL 
- ANTECEDENTES PATOLOGICOS 
- CUESTIONARIO NORDICO
- FICHA MUSCULO ESQUELETICO 
- OIT 
- ESPIROMETRIA
- AUDIOMETRIA
- ODONTOLOGIA
- AGUDEZA VISUAL
- CONSENTIMIENTO DE BUENA SALUD
- CONSENTIMIENTO INFORMADO
- COPIA DE DNI


`,

    CHECK4: `- LABORATORIO: Hma, Hb / Hto, Glucosa, Ex. Orina.
  - APTITUD MÉDICA
- ANEXO 16
-  HISTORIA OCUPACIONAL 
- ANTECEDENTES PATOLOGICOS 
- CUESTIONARIO NORDICO
- FICHA MUSCULO ESQUELETICO 
- OIT
-  ESPIROMETRIA
- AUDIOMETRIA 
- PSICOLOGIA
- OFTALMOLOGIA 
- CONSENTIMIENTO INFORMADO
- COPIA DE DNI


`,

    CHECK5: `- LABORATORIO: Hma, Hb /Hto, Grupo Sanguineo y Factor ({grupoFactor})
- Glucosa, Creatinina /dl, Ex. Orina, RPR, Test cualitativo: Cocaína y Marihuana, Colesterol y Triglicéridos
- APTITUD MÉDICA
- ANEXO 16
- ANT. ENFERMEDADES ALTURA
- ANEXO 16 – A
- CERT. DE SUFICIENCIA MEDICA PARA TRABAJO EN ALTURA
- PSICOSENSOMETRICO 
- CERT. DE SUFICIENCIA MEDICA PARA CONDUCCION DE VEHICULO                           
- FICHA S.A.S.
- USO DE RESPIRADORES
- HISTORIA OCUPACIONAL 
- ANTECEDENTES PATOLOGICOS 
- CUESTIONARIO NORDICO
- FICHA MUSCULO ESQUELETICO 
- OIT
- ESPIROMETRIA   
- EKG 
- ODONTOLOGIA
- AUDIOMETRIA 
- OFTALMOLOGIA 
- PSICOLOGIA
- CONSENTIMIENTO INFORMADO
- COPIA DE DNI
- COPIA DE LICENCIA DE CONDUCIR

`,

    CHECK6: `- LABORATORIO:  Hb /Hto, Glucosa, Ex. Orina NORMAL, 
  - APTITUD MÉDICA
- ANEXO 16
- HISTORIA OCUPACIONAL 
- ANTECEDENTES PATOLOGICOS 
- CUESTIONARIO NORDICO
- FICHA MUSCULO ESQUELETICO 
- OIT
- AUDIOMETRIA 
- OFTALMOLOGIA 
- CONSENTIMIENTO INFORMADO
- COPIA DE DNI


`,

    CHECK7: `- LABORATORIO: Hma, Hb /Hto, Grupo Sanguineo y Factor ({grupoFactor}), Glucosa, Creatinina /dl, Ex. Orina NORMAL, Vsg , RPR,
  - TEST CUALITATIVO: COLESTEROL Y TRIGLICÉRIDOS
- APTITUD MÉDICA
- ANEXO 16
- ANT. ENFERMEDADES ALTURA
- ANEXO 16 – A
- CERT. DE SUFICIENCIA MEDICA PARA TRABAJO EN ALTURA
- PSICOSENSOMETRICO
- CERT. DE CONDUCCION DE VEHICULOS
- USO DE RESPIRADORES
- HISTORIA OCUPACIONAL 
- ANTECEDENTES PATOLOGICOS 
- CUESTIONARIO NORDICO
- FICHA MUSCULO ESQUELETICO 
- OIT
- ESPIROMETRIA
- EKG
- AUDIOMETRIA 
- ODONTOLOGIA
 - OFTALMOLOGIA 
- PSICOLOGIA
- CONSENTIMIENTO INFORMADO
- COPIA DE DNI
- COPIA DE LICENCIA


`,
};
