import Swal from "sweetalert2";
import { getFetch } from '../../../../getFetch/getFetch';
import { SubmitInfoLaboratioExBoro, registrarConsentimiento } from '../Controller/model';
import { GetInfoPacDefault, LoadingDefault, VerifyTRDefault } from '../../../../../../utils/functionUtils';

const tabla = 'consent_Boro';

export const VerifyTR = async (nro, token, setForm, selectedSede) => {
  await VerifyTRDefault(
    nro,
    tabla,
    token,
    setForm,
    selectedSede,
    () => GetInfoServicio(nro, token, setForm, selectedSede),
    () => GetInfoServicioEditar(nro, token, setForm)
  );
};

// ===== Mapeo Registro nuevo (datos del paciente) =====
export const GetInfoServicio = async (nro, token, setForm, sede) => {
  const res = await GetInfoPacDefault(nro, token, sede);
  if (res) {
    setForm(prev => ({
      ...prev,
      ...res,
      nombres: res.nombresApellidos || '',
      tieneRegistro: false,
    }));
  }
};

// ===== Mapeo Edición (registro existente) =====
export const GetInfoServicioEditar = async (nro, token, setForm) => {
  LoadingDefault('Obteniendo datos');
  try {
    const res = await getFetch(
      `/api/v01/ct/laboratorio/consentimientoLaboratorioBoro?nOrden=${nro}&nameConset=${tabla}`,
      token
    );
    if (res.norden) {
      Swal.fire(
        "Alerta",
        "Este paciente ya cuenta con registros de Consentimiento Boro",
        "warning"
      );
      setForm(prev => ({
        ...prev,
        ...res,
        enfermedad: { key: res.antBoroAlgunaEnfermedad, cual: res.critCualAlgunaEnfermedad ? res.critCualAlgunaEnfermedad : '' },
        medicamento: { key: res.antBoroAlgunMedicamento, cual: res.critCualAlgunMedicamento ? res.critCualAlgunMedicamento : '' },
        matecoca: { key: res.antBoroConsumenMateCoca, fecha: res.critFechaConsumoMateCoca },
        chaccha: { key: res.masticaHojaCoca, fecha: res.fechaConsumoHojaCoca },
        tratamiento: {
          key: res.antBoroTratQuirugODental, cual: res.critCualTratQuirugODental ? res.critCualTratQuirugODental : '',
          cuando: res.critCuandoTratQuirugODental ? res.critCuandoTratQuirugODental : '', donde: res.critDondeTratQuirugODental ? res.critDondeTratQuirugODental : ''
        },
        user_medicoFirma: res.usuarioFirma ? res.usuarioFirma : prev.user_medicoFirma,
        user_doctorAsignado: res.doctorAsignado ?? "",

        // Auditoría REAL (obtenerReporte). Se guarda CRUDA (la vista la formatea: UTC -> local).
        userRegistro: res.userRegistro ?? "",
        fechaRegistro: res.fechaRegistro ?? "",
        usuarioActualizacion: res.usuarioActualizacion ?? "",
        fechaActualizacion: res.fechaActualizacion ?? "",
        tieneRegistro: true,
      }));
    } else {
      Swal.fire('Error', 'Ocurrio un error al traer los datos', 'error');
    }
  } catch (error) {
    Swal.fire('Error', 'Ocurrio un error al traer los datos', 'error');
  } finally {
    Swal.close();
  }
};

// ===== Guardar (registro nuevo) =====
export const SubmitDataService = (form, token, user, limpiar) =>
  registrarConsentimiento({
    form,
    token,
    user,
    limpiar,
    esActualizacion: false,
    submitFn: (data, tk, usr, auditCtx) => SubmitInfoLaboratioExBoro(data, tk, usr, auditCtx),
    esExito: (res) => Boolean(res?.norden),
    onPrint: () => PrintHojaR(form, token),
  });

// ===== Editar (registro existente) =====
export const UpdateDataService = (form, token, user, limpiar) =>
  registrarConsentimiento({
    form,
    token,
    user,
    limpiar,
    esActualizacion: true,
    submitFn: (data, tk, usr, auditCtx) => SubmitInfoLaboratioExBoro(data, tk, usr, auditCtx),
    esExito: (res) => Boolean(res?.norden),
    onPrint: () => PrintHojaR(form, token),
  });

export const PrintHojaR = async (form, token) => {
  LoadingDefault('Cargando Formato a Imprimir');
  try {
    const res = await getFetch(
      `/api/v01/ct/laboratorio/consentimientoLaboratorioBoro?nOrden=${form.norden}&nameConset=${tabla}`,
      token
    );
    if (res.norden) {
      const nombre = res.nameJasper;
      const jasperModules = import.meta.glob('../../../../../../jaspers/Consentimientos/*.jsx');
      const modulo = await jasperModules[`../../../../../../jaspers/Consentimientos/${nombre}.jsx`]();
      if (typeof modulo.default === 'function') {
        modulo.default(res);
      } else {
        console.error(`El archivo ${nombre}.jsx no exporta una función por defecto`);
      }
    }
  } catch (error) {
    console.error("Error al obtener el consentimiento:", error);
    Swal.fire({
      icon: "error",
      title: "N° Orden no existente",
      text: "Por favor, ingrese un N° Orden válido.",
    });
  } finally {
    Swal.close();
  }
};
