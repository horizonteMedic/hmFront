import Swal from "sweetalert2";
import { getFetch } from '../../../../getFetch/getFetch';
import { GetInfoLaboratioEx, registrarConsentimiento } from '../Controller/model';
import { GetInfoPacDefault, LoadingDefault, VerifyTRDefault } from '../../../../../../utils/functionUtils';

const date = new Date();
const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const camposAPI = {
  MARIHUANA: { valor: 'antConsumeMarih', fecha: 'fechaConsumeMarih' },
};

const tabla = 'consent_marihuana';

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
