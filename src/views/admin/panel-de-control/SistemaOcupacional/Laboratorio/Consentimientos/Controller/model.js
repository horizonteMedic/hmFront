import Swal from "sweetalert2";
import { URLAzure } from '../../../../../../config/config';
import { sellarAuditoria } from '../../../../../../utils/auditoriaUtils';
import { LoadingDefault } from '../../../../../../utils/functionUtils';

export function GetInfoLaboratioEx(data, tabla, token, user, auditCtx = null) {

    const camposAPI = {
        MARIHUANA: { valor: 'antConsumeMarih', fecha: 'fechaConsumeMarih' },
        COCAINA: { valor: 'antConsumeCocacina', fecha: 'fechaConsumeCocacina' },
        COCA: { valor: 'antConsumeHojaCoca', fecha: 'fechaConsumoHojaCoca' },
        ANFETAMINAS: { valor: 'antConsumeAnfetamina', fecha: 'fechaConsumeAnfetamina' },
        METAN: { valor: 'antConsumeMethanfetaminaOOpiaceos', fecha: 'fechaConsumeMethanfetamina' },
        BENZO: { valor: 'antConsumeBenzodiacepinas', fecha: 'fechaConsumeBenzodiacepinas' },
        OPIA: { valor: 'antConsumeOpiacesos', fecha: 'fechaConsumeOpiacesos' },
        BARBI: { valor: 'antConsumeBarbituricos', fecha: 'fechaConsumeBarbituricos' },
        METADONA: { valor: 'antConsumeMetadona', fecha: 'fechaConsumeMetadona' },
        FENCI: { valor: 'antConsumeFenciclidina', fecha: 'fechaConsumeFenciclidina' },
        ANTI: { valor: 'antConsumeAntidepreTricicli', fecha: 'fechaConsumeAntidepreTricicli' }
    };

    let body = {
        nameConset: tabla,
        userMedicoOcup: data?.user_doctorAsignado ?? "",
        fechaex: data.fecha,
        nOrden: data.norden,
        usuarioFirma: data?.user_medicoFirma ?? "",
        doctorAsignado: data?.user_doctorAsignado ?? "",
    };

    if (data.antecedentes) {
        const antecedentes = Array.isArray(data.antecedentes)
            ? data.antecedentes
            : Object.entries(data.antecedentes).map(([key, value]) => ({
                key,
                value: typeof value === 'object' && value !== null ? value.value : value,
                fecha: typeof value === 'object' && value !== null ? value.fecha : null,
            }));
        antecedentes.forEach(({ key, value, fecha }) => {
            const campos = camposAPI[key];
            if (campos) {
                body[campos.valor] = value ?? false;
                body[campos.fecha] = fecha ?? null;
            }
        });
    }

    // Sella auditoría (creación vs actualización) si el llamador la provee; si no, se preserva
    // el comportamiento original (siempre "userRegistro" = usuario en sesión).
    body = auditCtx
        ? sellarAuditoria(body, {
            user,
            esActualizacion: auditCtx.esActualizacion,
            userRegistro: auditCtx.userRegistro,
            fechaRegistro: auditCtx.fechaRegistro,
        })
        : { ...body, userRegistro: user };

    const url = `${URLAzure}/api/v01/ct/laboratorio/registrarActualizarConsentimientos`
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
    }
    return fetch(url, options).then(res => {
        if (!res.ok) {
            return res
        } return res.json()
    }).then(response => response)
}

export function SubmitInfoLaboratioExBoro(data, token, user, auditCtx = null) {

    let body = {
        antBoroAlgunaEnfermedad: data.enfermedad.key,
        antBoroAlgunMedicamento: data.medicamento.key,
        antBoroConsumenMateCoca: data.matecoca.key,
        antBoroTratQuirugODental: data.tratamiento.key,
        critCualAlgunaEnfermedad: data.enfermedad.cual,
        critCualAlgunMedicamento: data.medicamento.cual,
        critFechaConsumoMateCoca: data.matecoca.fecha,
        fechaConsumoHojaCoca: data.chaccha.fecha,
        critCualTratQuirugODental: data.tratamiento.cual,
        critCuandoTratQuirugODental: data.tratamiento.cuando,
        critDondeTratQuirugODental: data.tratamiento.donde,
        trabajador: data.trabajador,
        postulante: data.postulante,
        userMedicoOcup: "AGARCIA",
        fechaex: data.fecha,
        masticahCoca: data.chaccha.key,
        notas: data.notas,
        norden: data.norden,
        usuarioFirma: data.user_medicoFirma,
        doctorAsignado: data?.user_doctorAsignado ?? "",
    };

    // Sella auditoría (creación vs actualización) si el llamador la provee; si no, se preserva
    // el comportamiento original (siempre "userRegistro" = usuario en sesión).
    body = auditCtx
        ? sellarAuditoria(body, {
            user,
            esActualizacion: auditCtx.esActualizacion,
            userRegistro: auditCtx.userRegistro,
            fechaRegistro: auditCtx.fechaRegistro,
        })
        : { ...body, userRegistro: user };

    const url = `${URLAzure}/api/v01/ct/laboratorio/registrarActualizarConsentimientoBORO`
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
    }
    return fetch(url, options).then(res => {
        if (!res.ok) {
            return res
        } return res.json()
    }).then(response => response)
}

/**
 * registrarConsentimiento
 * ------------------------
 * Guardar/Actualizar genérico para los formularios de Consentimientos. A diferencia de
 * `guardarRegistro`/`actualizarRegistro` (registroOcupacionalUtils), el endpoint de este módulo
 * (`registrarActualizarConsentimientos*`) es un único "upsert": no hace falta bloquear el Guardar
 * si ya existe (ni el Editar si no existe), y el contrato de éxito de la respuesta tampoco es el
 * de `SubmitDataServiceDefault` (id === 1 | nOrden | 201) — aquí es `id === 1` o `id === 0`
 * (o, en el caso de Boro, `norden` truthy).
 *
 * @param {object}   p
 * @param {object}   p.form
 * @param {string}   p.token
 * @param {string}   p.user
 * @param {Function} p.limpiar
 * @param {Function} p.submitFn        (form, token, user, auditCtx) => Promise<res>
 * @param {boolean}  p.esActualizacion true = edición (sella con userRegistro/fechaRegistro originales).
 * @param {Function} [p.onPrint]
 * @param {Function} [p.esExito]       (res) => boolean
 */
export const registrarConsentimiento = async ({
    form,
    token,
    user,
    limpiar,
    submitFn,
    esActualizacion,
    onPrint = () => { },
    esExito = (res) => res?.id === 1 || res?.id === 0,
}) => {
    if (!form.norden) {
        await Swal.fire('Error', 'Datos Incompletos', 'error');
        return;
    }
    LoadingDefault('Registrando Datos');
    try {
        const auditCtx = esActualizacion
            ? { esActualizacion: true, userRegistro: form.userRegistro, fechaRegistro: form.fechaRegistro }
            : { esActualizacion: false };
        const res = await submitFn(form, token, user, auditCtx);
        if (esExito(res)) {
            Swal.fire({
                title: 'Exito',
                text: `${res?.mensaje ?? 'Se completó el registro correctamente'},\n¿Desea imprimir?`,
                icon: 'success',
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
            }).then((result) => {
                limpiar();
                if (result.isConfirmed) {
                    onPrint();
                }
            });
        } else {
            Swal.fire('Error', 'Ocurrio un error al Registrar', 'error');
        }
    } catch (error) {
        Swal.fire('Error', 'Ocurrio un error al Registrar', 'error');
    }
};
