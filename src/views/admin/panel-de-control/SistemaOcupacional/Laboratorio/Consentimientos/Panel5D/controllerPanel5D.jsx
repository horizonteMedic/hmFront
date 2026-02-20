import Swal from "sweetalert2";
import { getFetch } from '../../../../getFetch/getFetch';
import { GetInfoLaboratioEx } from '../Controller/model';
import { GetInfoPacDefault, LoadingDefault, VerifyTRDefault } from '../../../../../../utils/functionUtils';

const date = new Date();
const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const camposAPI = {
  MARIHUANA: { valor: 'antConsumeMarih', fecha: 'fechaConsumeMarih' },
  COCAINA: { valor: 'antConsumeCocacina', fecha: 'fechaConsumeCocacina' },
  COCA: { valor: 'antConsumeHojaCoca', fecha: 'fechaConsumoHojaCoca' },
  ANFETAMINAS: { valor: 'antConsumeAnfetaminaOExtasis', fecha: 'fechaConsumeAnfetamina' },
  METAN: { valor: 'antConsumeMethanfetaminaOOpiaceos', fecha: 'fechaConsumeMethanfetamina' },
  BENZO: { valor: 'antConsumeBenzodiacepinas', fecha: 'fechaConsumeBenzodiacepinas' },
};

const tabla = 'con_panel5D';

export const VerifyTR = async (nro, token, setForm, selectedSede, form) => {
  await VerifyTRDefault(
    nro,
    tabla,
    token,
    setForm,
    selectedSede,
    async () => {
      const res = await GetInfoPacDefault(nro, token, selectedSede);
      if (res) {
        setForm(prev => ({
          ...prev,
          ...res,
          nombres: res.nombresApellidos || '',
        }));
      }
    },
    async () => {
      await GetInfoServicio(nro, token, setForm, form);
    }
  );
};

export const GetInfoServicio = async (nro, token, setForm, form) => {
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
        user_doctorAsignado: res.userMedicoOcup ?? "",
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

export const SubmitDataService = async (form, token, userlogued, limpiar) => {
  if (!form.norden) {
    await Swal.fire('Error', 'Datos Incompletos', 'error');
    return;
  }
  LoadingDefault('Registrando Datos');
  try {
    const res = await GetInfoLaboratioEx(form, tabla, token, userlogued);
    if (res.id === 1 || res.id === 0) {
      Swal.fire({
        title: 'Exito',
        text: `${res.mensaje},\n¿Desea imprimir?`,
        icon: 'success',
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
      }).then((result) => {
        limpiar();
        if (result.isConfirmed) {
          PrintHojaR(form, token);
        }
      });
    } else {
      Swal.fire('Error', 'Ocurrio un error al Registrar', 'error');
    }
  } catch (error) {
    Swal.fire('Error', 'Ocurrio un error al Registrar', 'error');
  }
};

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

