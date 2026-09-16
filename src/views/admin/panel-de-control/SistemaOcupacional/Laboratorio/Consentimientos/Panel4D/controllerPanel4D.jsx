import Swal from "sweetalert2";
import { getFetch } from '../../../../getFetch/getFetch';
import { GetInfoLaboratioEx, registrarConsentimiento } from '../Controller/model';
import { GetInfoPacDefault, LoadingDefault, VerifyTRDefault } from '../../../../../../utils/functionUtils';
import { getToday } from "../../../../../../utils/helpers";

const today = getToday();

const camposAPI = {
  MARIHUANA: { valor: 'antConsumeMarih', fecha: 'fechaConsumeMarih' },
  COCAINA: { valor: 'antConsumeCocacina', fecha: 'fechaConsumeCocacina' },
  COCA: { valor: 'antConsumeHojaCoca', fecha: 'fechaConsumoHojaCoca' },
  OPIA: { valor: 'antConsumeOpiacesos', fecha: 'fechaConsumeOpiacesos' },
  METAN: { valor: 'antConsumeMethanfetaminaOOpiaceos', fecha: 'fechaConsumeMethanfetamina' },
};

const tabla = 'con_panel4D';

export const VerifyTR = async (nro, token, setForm, selectedSede, form) => {
  await VerifyTRDefault(
    nro,
    tabla,
    token,
    setForm,
    selectedSede,
    () => GetInfoServicio(nro, token, setForm, selectedSede),
    () => GetInfoServicioEditar(nro, token, setForm, form)
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
export const GetInfoServicioEditar = async (nro, token, setForm, form) => {
  LoadingDefault('Obteniendo datos');
  try {
    const res = await getFetch(
      `/api/v01/ct/laboratorio/consentimiento-laboratorio?nOrden=${nro}&nameConset=${tabla}`,
      token
    );

    // Manejar errores de la respuesta
    if (res.error) {
      console.error("Error en la respuesta del servidor:", res);
      Swal.fire('Error', `Error al obtener datos: ${res.status === 404 ? 'No se encontró el registro' : `Error ${res.status}`}`, 'error');
      Swal.close();
      return;
    }

    if (res.norden) {
      Swal.fire(
        "Alerta",
        "Este paciente ya cuenta con registros de Consentimientos",
        "warning"
      );
      const antecedentesActualizados = form.antecedentes.map((item) => {
        const campos = camposAPI[item.key] || {};
        return {
          ...item,
          value: res[campos.valor] ?? false,
          fecha: res[campos.fecha] ?? today
        };
      });
      setForm(prev => ({
        ...prev,
        ...res,
        antecedentes: antecedentesActualizados,
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
    console.error("Error al obtener servicio:", error);
    Swal.fire('Error', error.message || 'Ocurrio un error al traer los datos', 'error');
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
    submitFn: (data, tk, usr, auditCtx) => GetInfoLaboratioEx(data, tabla, tk, usr, auditCtx),
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
    submitFn: (data, tk, usr, auditCtx) => GetInfoLaboratioEx(data, tabla, tk, usr, auditCtx),
    onPrint: () => PrintHojaR(form, token),
  });

export const PrintHojaR = async (form, token) => {
  LoadingDefault('Cargando Formato a Imprimir');
  try {
    const res = await getFetch(
      `/api/v01/ct/laboratorio/consentimiento-laboratorio?nOrden=${form.norden}&nameConset=${tabla}`,
      token
    );

    // Manejar errores de la respuesta
    if (res.error) {
      console.error("Error en la respuesta del servidor:", res);
      Swal.fire({
        icon: "error",
        title: "Error al obtener datos",
        text: res.status === 404
          ? "No se encontró el registro o el endpoint no existe."
          : `Error ${res.status}: ${res.statusText || res.message || 'Error desconocido'}`,
      });
      Swal.close();
      return;
    }

    if (res.norden) {
      const nombre = res.nameJasper;
      const jasperModules = import.meta.glob('../../../../../../jaspers/Consentimientos/*.jsx');
      const rutaCompleta = `../../../../../../jaspers/Consentimientos/${nombre}.jsx`;
      const modulo = await jasperModules[rutaCompleta]();
      if (typeof modulo.default === 'function') {
        modulo.default(res);
      } else {
        console.error(`El archivo ${nombre}.jsx no exporta una función por defecto`);
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "N° Orden no existente",
        text: "Por favor, ingrese un N° Orden válido.",
      });
    }
  } catch (error) {
    console.error("Error al obtener el consentimiento:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error.message || "Ocurrió un error al obtener el consentimiento.",
    });
  } finally {
    Swal.close();
  }
};
